import {Injectable} from '@angular/core';
import {Platform, LoadingController, ToastController} from "ionic-angular";


@Injectable()
export class IonicUtil {
    cordova: boolean;
    loading: any;

    constructor(public platform: Platform,
                public loadingCtrl: LoadingController,
                public toastCtrl: ToastController
    ) {
        this.cordova = this.platform.is('cordova') ? true : false;
        console.log('cordova',this.cordova);
    }

    onLoading(message?:string) {
        this.loading = this.loadingCtrl.create();
        this.loading.present();
    }

    endLoading() {
        this.loading.dismiss();
    }

    toast(message: string) {
        let toast = this.toastCtrl.create({
            message : message,
            duration: 3000,
        });
        toast.present();
    }
}
