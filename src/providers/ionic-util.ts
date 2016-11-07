import {Injectable} from '@angular/core';
import {Platform, LoadingController, ToastController} from "ionic-angular";
import {TranslateService} from "ng2-translate";
import {ThemeableBrowser} from "ionic-native";


@Injectable()
export class IonicUtil {
    private _loading: any;
    public cordova: boolean;
    public _widthPlatform: any;
    public _heightPlatform: any;

    private _browserTheme = {
        statusbar         : {
            color: '#ffffffff'
        },
        toolbar           : {
            height: 44,
            color : '#f0f0f0ff'
        },
        title             : {
            color        : '#003264ff',
            showPageTitle: true
        },
        backButtonCanClose: true
    }

    constructor(private platform: Platform,
                private loadingCtrl: LoadingController,
                private toastCtrl: ToastController,
                private translateService: TranslateService,
    ) {
        this.cordova = platform.is('cordova') ? true : false;
        platform.ready().then(() => {
            this._widthPlatform  = platform.width();
            this._heightPlatform = platform.height();
        })

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
        new ThemeableBrowser(url, '_blank', this._browserTheme);
    }

    translate(text: string): Promise<any> {
        return new Promise(resolve => {
            this.translateService.get(text).subscribe((res: string) => resolve(res));
        });
    }
}
