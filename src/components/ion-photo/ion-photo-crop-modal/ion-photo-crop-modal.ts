import {Component} from '@angular/core';
import {NavParams, ViewController, Events, Platform} from 'ionic-angular';
declare const Cropper: any;
declare const document: any;

@Component({
    selector   : 'ion-photo-crop-modal',
    templateUrl: 'ion-photo-crop-modal.html'
})
export class IonPhotoCropModal {

    img: any;
    image: any;
    cropper: any;
    _eventName: string;

    constructor(private navParams: NavParams,
                private viewCtrl: ViewController,
                private events: Events,
                private platform: Platform
    ) {
        this._eventName = this.navParams.get('eventName')
        this.img        = this.navParams.get('base64');

        this.events.subscribe('photocrop:close', () => this.dismiss());
        this.platform.registerBackButtonAction(() => this.dismiss());
    }

    ionViewDidLoad() {
        this.imageLoaded();
    }

    // image Crop Method
    imageLoaded() {
        let image    = document.getElementById('image');
        this.cropper = new Cropper(image, {
            aspectRatio             : 1 / 1,
            dragMode                : 'move',
            autoCropArea            : 1,
            viewMode                : 1,
            restore                 : true,
            guides                  : true,
            center                  : true,
            highlight               : false,
            cropBoxMovable          : false,
            cropBoxResizable        : false,
            toggleDragModeOnDblclick: false,
            responsive              : true,
            //minCanvasWidth          : 640,
            //minContainerWidth       : 640,
            //crop        : (event) => {
            //
            //    //this.image = event.target.currentSrc;
            //    //this.image = event.getCroppedCanvas().toDataURL('image/jpeg');
            //}
        });
    }

    crop() {
        let image = this.cropper.getCroppedCanvas().toDataURL('image/jpeg');
        this.events.publish(this._eventName, image);
        this.dismiss();
    }

    rotate(value: number): void {
        this.cropper.rotate(value);
    }

    dismiss(): void {
        this.viewCtrl.dismiss();
    }

}
