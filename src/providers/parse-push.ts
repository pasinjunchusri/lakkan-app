import {Injectable} from '@angular/core';

declare var Parse: any;

@Injectable()
export class ParsePush {
    private _installationId;
    private current: any;

    constructor() {
        this.current = Parse.User.current();
    }

    init(): Promise<any> {
        return new Promise((resolve, reject) => {
            if (ParsePushPlugin) {
                ParsePushPlugin.getInstallationId((id) => {
                    this._installationId = id;
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

    getSubscriptions(): Promise<any> {
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


    subscribeUser(): Promise<any> {
        return new Promise((resolve, reject) => {

            if (ParsePushPlugin && this.current) {
                ParsePushPlugin.subscribe(this.current['username']);
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

    subscribe(channel): Promise<any> {
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

    unsubscribe(channel): Promise<any> {
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
