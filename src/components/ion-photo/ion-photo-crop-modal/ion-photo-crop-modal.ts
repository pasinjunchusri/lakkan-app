import {Component, ViewChild, ElementRef} from '@angular/core';
import {NavParams, ViewController, Events} from 'ionic-angular';
declare const Cropper: any;
declare const document: any;

@Component({
    selector   : 'ion-photo-crop-modal',
    templateUrl: 'ion-photo-crop-modal.html'
})
export class IonPhotoCropModal {
    @ViewChild('imagSrc') input: ElementRef;

    img: any;
    image: any;
    cropper: any;

    constructor(private navParams: NavParams,
                private viewCtrl: ViewController,
                private events: Events
    ) {
        this.img = this.navParams.get('base64');
        this.events.subscribe('photocrop:close', () => this.dismiss());
    }

    ionViewDidLoad() {
        this.imageLoaded();
    }

    // image Crop Method
    imageLoaded() {
        console.log(this.input);
        let image    = document.getElementById('image');
        this.cropper = new Cropper(image, {
            aspectRatio             : 1 / 1,
            dragMode                : 'move',
            autoCropArea            : 0.65,
            restore                 : false,
            guides                  : false,
            center                  : false,
            highlight               : false,
            cropBoxMovable          : false,
            cropBoxResizable        : false,
            toggleDragModeOnDblclick: false,
            responsive              : true,
            //crop        : (event) => {
            //
            //    //this.image = event.target.currentSrc;
            //    //this.image = event.getCroppedCanvas().toDataURL('image/jpeg');
            //}
        });
    }

    crop() {
        let image = this.cropper.getCroppedCanvas().toDataURL('image/jpeg');
        this.events.publish('photocrop:result', image);
    }

    dismiss(): void {
        this.viewCtrl.dismiss();
    }

}
