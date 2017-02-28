import {Injectable} from "@angular/core";
import {IGallery} from "../models/gallery.model";
import {IChatMessage} from "../models/chat-message.model";
declare var Parse: any;

@Injectable()
export class ChatMessageProvider {

    data: any[] = [];

    private _fields = [
        'channel',
        'user',
        'message',
        'updated',
    ];

    private _ParseObject: any = Parse.Object.extend('ChatMessage', {});

    constructor() {

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
        return Parse.Cloud.run('getChatMessages', {channelId: channelId});
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
