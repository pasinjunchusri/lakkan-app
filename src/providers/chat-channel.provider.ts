import {Injectable} from "@angular/core";
import {IChatChannel} from "../models/chat-channel.model";
import * as PouchDB from "pouchdb";

declare const Parse: any;

@Injectable()
export class ChatChannelProvider {

    db: any;
    data: any[] = [];

    private _ParseObject: any = Parse.Object.extend('ChatChannel', {});

    constructor() {

        this.db = new PouchDB('ChatChannel', {auto_compaction: true});
    }

    find(): Promise<any> {
        return new Parse.Cloud.run('getChatChannels');
        // return new Promise((resolve, reject) => {
        //     this.cleanDB()
        //         .then(() => Parse.Cloud.run('getChatChannels'))
        //         .then(()=>this.cleanDB())
        //         .then(data => data.map(item => this.db.put(item)))
        //         .then(() => this.findCache())
        //         .then(resolve)
        //         .catch(reject);
        // });
    }



    cleanDB(): Promise<any> {
        this.data = [];
        return new Promise((resolve, reject) => {
            this.db
                .allDocs({include_docs: true})
                .then(result => Promise.all(result.rows.map(row => this.db.remove(row.doc))))
                .then(resolve)
                .catch(reject);
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

    getCache(id: string) {
        return this.db.get(id);
    }

    // Parse Crud
    get(objectId: string) {
        return Parse.Query(this._ParseObject).get(objectId);
    }

    getChatChannel(objectId: string) {
        return Parse.Cloud.run('getChatChannel',{channelId: objectId});
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
