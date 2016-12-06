import {Injectable} from "@angular/core";
import {IChatChannel} from "../models/chat-channel.model";
import * as PouchDB from "pouchdb";

declare var Parse: any;

@Injectable()
export class ChatChannelProvider {

    db: any;
    data: any[] = [];

    private _fields = [
        //'users',
        //'profiles',
        //'messages',
    ];

    private _ParseObject: any = Parse.Object.extend('ChatChannel', {});

    constructor() {

        this.db = new PouchDB('ChatChannel', {auto_compaction: true});

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

    find(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.cleanDB()
                .then(() => Parse.Cloud.run('getChatChannel'))
                .then(data => {
                    data.map(item => {
                        let obj      = item;
                        obj._id      = item.id;
                        obj.profiles = item.profiles.map(profile => profile.attributes);
                        obj.users    = item.users.map(user => user.attributes);
                        if (item.message) {
                            obj.message = item.message.attributes;
                        }
                        console.info(obj);
                        this.db.put(obj);
                    });
                    return data;
                })
                .then(() => this.findCache())
                .then(resolve)
                .catch(reject);
        });
    }

    cleanDB(): Promise<any> {
        this.data = [];
        return new Promise(resolve => {
            this.db
                .allDocs({include_docs: true})
                .then(result => Promise.all(result.rows.map(row => this.db.remove(row.doc))).then(resolve));
        });
    }


    findCache(): Promise<any> {
        return new Promise(resolve => {
            if (this.data.length > 0) {
                resolve(this.data)
            } else {
                this.db.allDocs({include_docs: true}).then(data => {
                    if (data.total_rows) {
                        this.data = data.rows.map(row => row.doc);
                    }
                    resolve(this.data);
                })
            }
        });
    }

    // Parse Crud
    get(objectId: string) {
        return new Parse.Query(this._ParseObject).get(objectId);
    }

    create(params: {users: any[], message?: string}): Promise<any> {
        return new Parse.Cloud.run('createChatChannel', params)
    }

    put(item: IChatChannel) {

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
