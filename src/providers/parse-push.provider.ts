import {Injectable} from "@angular/core";
import {Platform} from "ionic-angular";

declare var Parse: any;

@Injectable()
export class ParsePushProvider {
    private _installationId;
    private current: any;
    private cordova: boolean = false;

    constructor(private platform: Platform) {
        this.cordova = this.platform.is('cordova') ? true : false;
    }

    init(): void {
        if (this.cordova && ParsePushPlugin) {
            ParsePushPlugin.getInstallationId((id) => {
                this._installationId = id;
                console.log("device installationId: " + id);
                this.subscribeUser().then(user => {
                    console.log('User subscribe', user);
                    this.on('chat', chat => {
                        console.log('chat', chat);
                    });
                });
            }, error => console.log);
        }
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

            this.current = Parse.User.current();
            if (ParsePushPlugin && this.current) {
                ParsePushPlugin.subscribe(this.current.get('username'), resolve);
            } else {
                reject('Not device');
            }
        });
    }

    on(event: string, callback: any): void {
        if (this.cordova && ParsePushPlugin) {
            return ParsePushPlugin.on(event, callback);
        }
    }

    subscribe(channel): Promise<any> {
        return new Promise((resolve, reject) => {
            if (this.cordova && ParsePushPlugin) {
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
            if (this.cordova && ParsePushPlugin) {
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
