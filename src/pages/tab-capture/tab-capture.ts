import {Component, ViewChild, ElementRef, Renderer} from "@angular/core";
import {Events, ModalController} from "ionic-angular";
import {IonPhotoService} from "../../components/ion-photo/ion-photo-service";
import {IonicUtilProvider} from "../../providers/ionic-util";
import {PhotoShareModal} from "../../components/photo-share-modal/photo-share-modal";
import {IonPhotoCropModal} from "../../components/ion-photo/ion-photo-crop-modal/ion-photo-crop-modal";

@Component({
    selector   : 'page-tab-capture',
    templateUrl: 'tab-capture.html'
})
export class TabCapturePage {

    @ViewChild('inputFile') input: ElementRef;


    cordova: boolean   = false;
    _eventName: string = 'photoshare';

    constructor(private photoService: IonPhotoService,
                private util: IonicUtilProvider,
                private modalCtrl: ModalController,
                private events: Events,
                private render: Renderer
    ) {
        this.cordova = this.util.cordova;

        // Open Share Modal
        this.events.subscribe(this._eventName, _imageCroped => {
            let modal = this.modalCtrl.create(PhotoShareModal, {base64: _imageCroped});
            modal.onDidDismiss(response => {
                console.log(response);
                if (response) {
                    this.events.publish('upload:gallery', response);
                }
            });
            modal.present();
        });

        if (!this.cordova) {
            setTimeout(() => this.render.invokeElementMethod(this.input.nativeElement, 'click'), 500);
        }
    }

    ionViewWillEnter() {
        console.log('Hello TabCapturePage Page');
        this.events.publish('tabHome')
        this.openCapture();
    }

    openCapture() {

        if (this.cordova) {
            this.photoService.open()
                .then(this.cropImage)
                .catch(this.util.toast);
        } else {
            this.render.invokeElementMethod(this.input.nativeElement, 'click');
        }

    }

    cropImage(image: any) {
        this.modalCtrl.create(IonPhotoCropModal, {base64: image, eventName: this._eventName}).present();
    }

    onChange(event) {
        let files  = event.srcElement.files;
        let image  = files[0];
        let reader = new FileReader();
        if (image) {
            reader.onload = (evt) => {
                if (evt) {
                    let image = evt.srcElement['result'];
                    this.cropImage(image)
                }
            };
            reader.readAsDataURL(image);
        }
    }

}
