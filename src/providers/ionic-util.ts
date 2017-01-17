import {Injectable} from '@angular/core';
import {InAppBrowser} from 'ionic-native';
import {Platform, LoadingController, ToastController, AlertController} from 'ionic-angular';
import {TranslateService} from 'ng2-translate';
import * as _ from 'underscore';

declare var device: any;
declare var navigator: any;
declare var Connection: any;

@Injectable()
export class IonicUtilProvider {
    private _loading: any;
    public cordova: boolean  = false;
    public _widthPlatform: any;
    public _heightPlatform: any;
    private maxWidth: number = 640;

    constructor(private platform: Platform,
                private loadingCtrl: LoadingController,
                private toastCtrl: ToastController,
                public translateService: TranslateService,
                private alertCtrl: AlertController
    ) {

        this.cordova = platform.is('cordova') ? true : false;

        console.log('Cordova', this.cordova);

        platform.ready().then(() => {
            this._widthPlatform  = platform.width() <= this.maxWidth ? platform.width() : this.maxWidth;
            this._heightPlatform = platform.height();
        });

    }

    public static parseForm(form) {
        let object = new Object();
        _.each(form.value, (value, key) => {
            object[key] = value;
        });
        return object;
    }

    isOnline(): boolean {
        if (this.cordova && navigator.connection) {
            return navigator.connection.type !== Connection.NONE;
        } else {
            return navigator.onLine;
        }
    }

    isOffline() {
        if (this.cordova && navigator.connection) {
            let networkState = navigator.connection.type;
            return networkState === Connection.NONE;
        } else {
            return !navigator.onLine;
        }
    }

    static getRandomInt(min: number = 0, max: number = 9999) {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    onLoading(message: string = '', duration: number = 3000): void {
        this._loading = this.loadingCtrl.create({content: message, duration: duration});
        this._loading.present();
    }

    endLoading(): void {
        this._loading.dismiss();
    }

    toast(message: string): void {
        let toast = this.toastCtrl.create({
            message:  message,
            duration: 3000,
        });
        toast.present();
    }

    href(url: string): void {
        InAppBrowser.open(url, '_blank', 'location=yes');
    }

    translate(text: string): Promise<any> {
        return new Promise(resolve => {
            this.translateService.get(text).subscribe((res: string) => resolve(res));
        });
    }

    static getClientHeight(): number {
        var body   = document.body, html = document.documentElement;
        var height = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
        return height;
    }

    tryConnect() {
        return new Promise((resolve, reject) => {
            let confirm = this.alertCtrl.create({
                title:   'You are OffLine',
                message: 'Try repeat connect?',
                buttons: [
                    {
                        text:    'Retry',
                        handler: () => {
                            //console.log('Disagree clicked');
                            resolve();
                        }
                    },
                    {
                        text:    'Cancel',
                        handler: () => {
                            //console.log('Disagree clicked');
                            reject();
                        }
                    }
                ]
            });
            confirm.present();
        });
    }


}
