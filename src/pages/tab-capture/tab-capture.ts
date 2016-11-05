import {Component} from '@angular/core';
import {ViewController, Platform} from 'ionic-angular';
import {IonicUtil} from "../../providers/ionic-util";
import {CameraPreview} from "ionic-native";

@Component({
    selector   : 'page-tab-capture',
    templateUrl: 'tab-capture.html'
})
export class TabCapturePage {

    _cordova: boolean = false;

    constructor(public viewCtrl: ViewController,
                public util: IonicUtil,
                public platform: Platform,
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

                CameraPreview.setOnPictureTakenHandler().subscribe((result) => {
                    console.log(result);
                    // do something with the result
                });
            }


        });
    }

    switch() {
        CameraPreview.switchCamera();
    }

    takePhoto() {
        CameraPreview.takePicture({
            maxWidth : 640,
            maxHeight: 640
        });
    }

    library() {

    }

    dismiss() {
        this.viewCtrl.dismiss();
    }


}
