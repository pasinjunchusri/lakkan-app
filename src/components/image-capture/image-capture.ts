import {Component, Output, EventEmitter, ViewChild, ElementRef, Renderer} from "@angular/core";
import {Events, ModalController} from "ionic-angular";
import {IonPhotoService} from "../../components/ion-photo/ion-photo-service";
import {IonicUtilProvider} from "../../providers/ionic-util";
import {IonPhotoCropModal} from "../../components/ion-photo/ion-photo-crop-modal/ion-photo-crop-modal";

@Component({
    selector   : 'image-capture',
    templateUrl: 'image-capture.html'
})
export class ImageCaptureComponent {


    @ViewChild('inputFile') input: ElementRef;
    @Output() imageChange: EventEmitter<any> = new EventEmitter();

    cordova: boolean   = false;
    _eventName: string = 'imagecapture';

    constructor(private photoService: IonPhotoService,
                private util: IonicUtilProvider,
                private modalCtrl: ModalController,
                private render: Renderer,
                private events: Events
    ) {
        this.cordova = this.util.cordova;
        this.events.subscribe(this._eventName, _imageCroped => this.imageChange.emit(_imageCroped));
    }

    openCapture() {
        if (this.cordova) {
            this.photoService.open()
                .then(image => this.cropImage(image))
                .then(image => this.imageChange.emit(image))
                .catch(error => this.util.toast(error));
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
