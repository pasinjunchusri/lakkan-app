import {Injectable} from '@angular/core';
import {Platform, LoadingController, ToastController, AlertController} from "ionic-angular";
import {TranslateService} from "ng2-translate";
import {InAppBrowser} from "ionic-native";
import {Logging} from "./logging";
import * as _ from 'underscore';

declare var device: any;
declare var navigator: any;
declare var Connection: any;

@Injectable()
export class IonicUtil {
    private _loading: any;
    public cordova: boolean = false;
    public _widthPlatform: any;
    public _heightPlatform: any;

    constructor(private platform: Platform,
                private loadingCtrl: LoadingController,
                private toastCtrl: ToastController,
                public translateService: TranslateService,
                private logger: Logging,
                private alertCtrl: AlertController
    ) {

        this.cordova = platform.is('cordova') ? true : false;

        console.log('Cordova', this.cordova);

        platform.ready().then(() => {
            this._widthPlatform  = platform.width();
            this._heightPlatform = platform.height();
        });

    }

    public static parseForm(form) {
        let object = new Object();
        _.each(form.controls, (value, key) => {
            object[key] = value['value'];
        });
        return object;
    }

    isOnline() {
        if (this.cordova && navigator.connection) {
            let networkState = navigator.connection.type;
            return networkState !== Connection.NONE;
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

    onLoading(message?: string): void {
        this._loading = this.loadingCtrl.create();
        this._loading.present();
    }

    endLoading(): void {
        this._loading.dismiss();
    }

    toast(message: string): void {
        let toast = this.toastCtrl.create({
            message : message,
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
                title  : 'You are OffLine',
                message: 'Try repeat connect?',
                buttons: [
                    {
                        text   : 'Retry',
                        handler: () => {
                            //console.log('Disagree clicked');
                            resolve()
                        }
                    },
                    {
                        text   : 'Cancel',
                        handler: () => {
                            //console.log('Disagree clicked');
                            reject()
                        }
                    }
                ]
            });
            confirm.present();
        })
    }

    // Returns a function, that, as long as it continues to be invoked, will not
    // be triggered. The function will be called after it stops being called for
    // N milliseconds. If `immediate` is passed, trigger the function on the
    // leading edge, instead of the trailing.
    //http://davidwalsh.name/javascript-debounce-function
    static debounce(func, wait, immediate) {
        var timeout;
        return function () {
            var context = this, args = arguments;
            var later   = function () {
                timeout = null;
                if (!immediate) {
                    func.apply(context, args);
                }
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) {
                func.apply(context, args);
            }
        };
    }

    static getMaxLevelOfPOI(poi) {
        var level = 0;

        if (poi.Connections != null) {
            for (var c = 0; c < poi.Connections.length; c++) {
                if (poi.Connections[c].Level != null && poi.Connections[c].Level.ID > level) {
                    level = poi.Connections[c].Level.ID;
                }
            }
        }

        if (level == 4) {
            level = 2;
        } //lvl 1&2
        if (level > 4) {
            level = 3;
        } //lvl 2&3 etc
        return level;
    }

    static getIconForPOI(poi) {
        let poiLevel = IonicUtil.getMaxLevelOfPOI(poi);
        let iconURL  = "assets/images/icons/map/level" + poiLevel;

        if (poi.UsageType != null && poi.UsageType.Title.indexOf("Private") > -1) {
            iconURL += "_private";
        } else if (poi.StatusType != null && poi.StatusType.IsOperational != true) {
            iconURL += "_nonoperational";
        } else {
            iconURL += "_operational";
        }

        iconURL += "_icon.png";
        return iconURL;
    }

    static formatSystemWebLink(linkURL, linkTitle) {
        return "<a href='#' onclick=\"window.open('" + linkURL + "', '_system');return false;\">" + linkTitle + "</a>";
    }

    static formatMapLink(poi, linkContent, isRunningUnderCordova: boolean) {
        if (isRunningUnderCordova) {
            if (device && device.platform == "WinCE") {
                return this.formatSystemWebLink("maps:" + poi.AddressInfo.Latitude + "," + poi.AddressInfo.Longitude, linkContent);
                //return "<a target=\"_system\" data-role=\"button\" data-icon=\"grid\" href=\"maps:" + poi.AddressInfo.Latitude + "," + poi.AddressInfo.Longitude + "\">" + linkContent + "</a>";
            } else if (device && device.platform == "iOS") {
                return this.formatSystemWebLink("http://maps.apple.com/?q=" + poi.AddressInfo.Latitude + "," + poi.AddressInfo.Longitude, linkContent);
                //return "<a target=\"_system\" data-role=\"button\" data-icon=\"grid\" href=\"http://maps.apple.com/?q=" + poi.AddressInfo.Latitude + "," + poi.AddressInfo.Longitude + "\">" + linkContent + "</a>";
            } else {
                return this.formatSystemWebLink("http://maps.google.com/maps?q=" + poi.AddressInfo.Latitude + "," + poi.AddressInfo.Longitude, linkContent);
            }
        }
        //default to google maps online link
        return "<a target=\"_blank\"  href=\"http://maps.google.com/maps?q=" + poi.AddressInfo.Latitude + "," + poi.AddressInfo.Longitude + "\">" + linkContent + "</a>";
    }

    getLanguages(): Array<string> {
        return this.translateService.getLangs();
    }

    saveSearchSettings() {
        this.logger.log('Settings');
    }

    setLanguage(languageCode: string) {
        this.translateService.use(languageCode);
    }
}
