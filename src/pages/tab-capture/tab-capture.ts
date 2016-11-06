import {Component} from '@angular/core';
import {ViewController, Platform, NavController} from 'ionic-angular';
import {IonicUtil} from "../../providers/ionic-util";
import {CameraPreview} from "ionic-native";
import {PhotoService} from "../../providers/photo-service";
import {TabCapturSharePage} from "../tab-capture-share/tab-capture-share";

@Component({
    selector   : 'page-tab-capture',
    templateUrl: 'tab-capture.html'
})
export class TabCapturePage {

    _cordova: boolean = false;
    _cropOptions      = {
        quality: 90,
        toSize : 640
    };
    _maxSize          = 1080;

    constructor(private viewCtrl: ViewController,
                private util: IonicUtil,
                private platform: Platform,
                private PhotoService: PhotoService,
                private navCtrl: NavController
    ) {
        this._cordova = this.platform.is('cordova') ? true : false;

        platform.ready().then(() => {

            let tapEnabled: any  = false;
            let dragEnabled: any = false;
            let toBack: any      = true;
            let alpha            = 1;
            let rect: any        = {
                x     : 0,
                y     : 0,
                width : platform.width(),
                height: platform.height()
            };

            if (this._cordova) {
                CameraPreview.startCamera(
                    rect,
                    'fron',
                    tapEnabled,
                    dragEnabled,
                    toBack,
                    alpha
                );

                CameraPreview.setOnPictureTakenHandler().subscribe((result:any) => {
                    plugins.crop
                           .promise(result[0], this._cropOptions)
                           .then(image => {
                               this.navCtrl.push(TabCapturSharePage, {image: image});
                           });
                });
            }


        });
    }

    switch() {
        if (this._cordova) {
            CameraPreview.switchCamera();
        } else {
            this.util.toast('Browser not supported');
        }
    }

    takePhoto() {
        if (this._cordova) {
            CameraPreview.takePicture({
                maxWidth : this._maxSize,
                maxHeight: this._maxSize
            });
        } else {
            this.util.toast('Browser not supported');
        }
    }

    library() {
        if (this._cordova) {
            this.PhotoService.photoLibrary().then(photo => {
                console.log('photo', photo);
                this.navCtrl.push(TabCapturSharePage, {image: photo});
            });
        } else {
            this.util.toast('Browser not supported');
        }
    }

    dismiss() {
        this.viewCtrl.dismiss();
    }


}
