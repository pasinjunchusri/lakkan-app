import {Injectable} from "@angular/core";
import {IGallery} from "../models/gallery.model";
import {IChatMessage} from "../models/chat-message.model";
import * as PouchDB from "pouchdb";
import _ from "underscore";
declare var Parse: any;

@Injectable()
export class ChatMessageProvider {

    db: any;
    data: any[] = [];

    private _fields = [
        'channel',
        'user',
        'message',
        'updated',
    ];

    private _ParseObject: any = Parse.Object.extend('ChatMessage', {});

    constructor() {

        this.db = new PouchDB('ChatMessage', {auto_compaction: true});

        this._fields.map(field => {
            Object.defineProperty(this._ParseObject.prototype, field, {
                get: function () {return this.get(field)},
                set: function (value) { this.set(field, value)}
            });
        });

        // This is a GeoPoint Object
        Object.defineProperty(this._ParseObject.prototype, 'location', {
            get: function () {return this.get('location');},
            set: function (val) {
                this.set('location', new Parse.GeoPoint({
                    latitude : val.latitude,
                    longitude: val.longitude
                }));
            }
        });
    }

    find(channelId: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.data = [];
            this.cleanChannel(channelId)
                .then(() => new Parse.Cloud.run('getChatMessages', {channel: channelId}))
                .then(data => {
                    return Promise.all(data.map(message => {
                        if (message['image']) {
                            message['image'] = message['image'].attributes;
                        }
                        return this.db.put(message);
                    }))
                })
                .then(() => this.findCache(channelId))
                .then(resolve)
                .catch(reject);
        });
    }

    cacheFind(data): Promise<any> {
        return Promise.all(data.map(message => {
            if (message['image']) {
                message['image'] = message['image'].attributes;
            }
            return this.db.put(message);
        }))
    }

    cache(message: any): Promise<any> {
        return this.db.post(message);
    }

    cleanChannel(channel: string): Promise<any> {
        return new Promise(resolve => {
            this.db.allDocs({include_docs: true}).then(result => {
                return Promise.all(result.rows.map(row => {
                    if (row.doc.channel == channel) {
                        return this.db.remove(row.doc);
                    }
                })).then(resolve)
            });
        });
    }


    findCache(channelId: string): Promise<any> {
        return new Promise(resolve => {
            if (this.data.length > 0) {
                let result = _.filter(this.data, item => item.channel == channelId);
                resolve(result);
            } else {
                this.db.allDocs({include_docs: true}).then(data => {
                    this.data = [];
                    if (data.total_rows) {
                        data.rows.map(row => this.data.push(row.doc));
                        let currentUser = Parse.User.current();
                        // Update Photo user
                        this.data       = this.data.map(message => {
                            if (message.user.id === currentUser.id) {
                                message.user.photo = currentUser['photo'];
                            }
                            if (message.createdAt) {
                                message.createdAt = new Date(message.createdAt)
                            }
                            return message;
                        });
                    }
                    let result = _.filter(this.data, item => item.channel == channelId);
                    resolve(result)
                });
            }
        });
    }


    // Parse Crud
    get(objectId: string) {
        return new Parse.Query(this._ParseObject).get(objectId);
    }

    create(item: IChatMessage) {
        return new this._ParseObject().save(item);
    }

    put(item: IGallery) {

        if (item.address && item.address.geo) {
            item.location = new Parse.GeoPoint(item.address.geo);
        }

        if (!item.id) {
            // New Item
            return new this._ParseObject().save(item);
        } else {
            // Update item
            return item.save();
        }

    }

    destroy(objectId: string) {
        return new Promise((resolve, reject) => {
            this.get(objectId).then(item => {
                item.destroy().then(resolve).catch(reject);
            }).catch(reject);
        });
    }
}
