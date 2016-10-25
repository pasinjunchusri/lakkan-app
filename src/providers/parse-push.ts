import {Injectable} from '@angular/core';

declare var ParsePushPlugin: any;

@Injectable()
export class ParsePush {

    init() {
        return new Promise((resolve, reject) => {
            if (ParsePushPlugin) {
                ParsePushPlugin.getInstallationId((id) => {
                    console.log("device installationId: " + id);
                    this.subscribeUser();
                    resolve(id);
                }, (e) => {
                    console.log('error', e);
                    reject(e);
                });
            } else {
                reject('Not Parse Push');
            }
        })
    }

    getSubscriptions() {
        return new Promise((resolve, reject) => {
            ParsePushPlugin.getSubscriptions((subscriptions) => {
                console.log(subscriptions);
                resolve(subscriptions);
            }, (e) => {
                console.log('error', e);
                reject(e);
            });
        })
    }


    subscribeUser() {
        return new Promise((resolve, reject) => {
            let user = Parse.User.current();

            if (ParsePushPlugin && user) {
                ParsePushPlugin.subscribe(user['username']);
            } else {
                reject('Not device');
            }
        });
    }

    on(event, callback) {
        if (ParsePushPlugin) {
            this.on(event, callback);
        }
    }

    subscribe(channel) {
        return new Promise((resolve, reject) => {
            if (ParsePushPlugin) {
                ParsePushPlugin.subscribe(channel, (resp) => {
                    console.log('Subcribe in channel', channel);
                    resolve(resp);
                }, (err) => {
                    console.log('Not Subcribe in channel', channel);
                    reject(err);
                });
            }
        });
    }

    unsubscribe(channel) {
        return new Promise((resolve, reject) => {
            if (ParsePushPlugin) {
                ParsePushPlugin.unsubscribe(channel, (resp) => {
                    console.log('Unsubcribe in channel', channel);
                    resolve(resp);
                }, (err) => {
                    console.log('Not Unsubcribe in channel', channel);
                    reject(err);
                });
            } else {
                reject();
            }
        });
    }
}
