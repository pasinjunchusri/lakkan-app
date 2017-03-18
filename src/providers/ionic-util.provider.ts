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
    public cordova: boolean = false;
    public _widthPlatform: any;
    public _heightPlatform: any;
    private maxWidth: number = 640;

    private textTranslated: any = {};

    constructor(private platform: Platform,
                private loadingCtrl: LoadingController,
                private toastCtrl: ToastController,
                public translateService: TranslateService,
                private alertCtrl: AlertController) {

        this.cordova = platform.is('cordova') ? true : false;

        console.log('Cordova', this.cordova);

        this.translate('Cancel').then((res: string) => this.textTranslated.cancel = res);
        this.translate('Retry').then((res: string) => this.textTranslated.retry = res);
        this.translate('You are OffLine').then((res: string) => this.textTranslated.areOffline = res);
        this.translate('Try repeat connect?').then((res: string) => this.textTranslated.reconect = res);

        platform.ready().then(() => {
            this._widthPlatform = platform.width() <= this.maxWidth ? platform.width() : this.maxWidth;
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

    toast(message: string, duration: number = 3000, position: string = 'top'): void {
        let toast = this.toastCtrl.create({
            message:  message,
            duration: duration,
            position: position
        });
        toast.present();
    }

    href(url: string): void {
        let browser = new InAppBrowser(url, '_system');
//      browser.executeScript(...);
//      browser.insertCSS(...);
        browser.show();
    }

    translate(text: string): Promise<any> {
        return new Promise(resolve => {
            this.translateService.get(text).subscribe((res: string) => resolve(res));
        });
    }

    validEmail(email: string) {
        let filter = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i
        return filter.test(email);
    }

    validPassword(password: string, confirm: string): boolean {
        return (password == confirm) ? true : false;
    }

    static getClientHeight(): number {
        var body = document.body, html = document.documentElement;
        var height = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
        return height;
    }

    tryConnect() {
        return new Promise((resolve, reject) => {
            let confirm = this.alertCtrl.create({
                title:   this.textTranslated.areOffline,
                message: this.textTranslated.reconect,
                buttons: [
                    {
                        text:    this.textTranslated.retry,
                        handler: () => {
                            //console.log('Disagree clicked');
                            resolve();
                        }
                    },
                    {
                        text:    this.textTranslated.cancel,
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
