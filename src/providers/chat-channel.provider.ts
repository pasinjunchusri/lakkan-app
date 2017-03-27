import {Injectable} from "@angular/core";
import {IChatChannel} from "../models/chat-channel.model";

declare const Parse: any;

@Injectable()
export class ChatChannelProvider {

    data: any[] = [];

    private _ParseObject: any = Parse.Object.extend('ChatChannel', {});

    constructor() {

    }

    find(): Promise<any> {
        return new Parse.Query('ChatChannel').containedIn('users', [Parse.User.current()]).include('profiles').find();

    }

    parseChannel(channel): Promise<any> {
        return new Promise(resolve => {
            let obj = {
                id:       channel.id,
                obj:      channel,
                title:    null,
                message:  channel.get('message'),
                profiles: []
            }
            let user = Parse.User.current();
            channel.relation('profiles').query().notEqualTo('user', user).find().then(profiles => {
                obj.title = profiles.map(profile => profile.get('name')).join(', ');
                obj.profiles = profiles.map(profile => profile.get('photo') ? profile.get('photo').url() : 'assets/img/user.png')
                resolve(obj);
            })
        })
    }


    // Parse Crud
    get(objectId: string) {
        return new Parse.Query(this._ParseObject).get(objectId);
    }

    getChatChannel(objectId: string) {
        return Parse.Cloud.run('getChatChannel', {channelId: objectId});
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
