import {Component, NgZone} from '@angular/core';
import {NavParams, ViewController, Events, ModalController} from "ionic-angular";
import {ParseFile} from "../../providers/parse-file";
import {GmapsAutocompleteModalPage} from "../gmaps-autocomplete-modal/gmaps-autocomplete-modal";
import {IonPhotoCropModal} from "../ion-photo/ion-photo-crop-modal/ion-photo-crop-modal";
//import {GmapsAutocompleteModalPage} from "../../components/gmaps-autocomplete-modal/gmaps-autocomplete-modal";

@Component({
    selector   : 'photo-share-modal',
    templateUrl: 'photo-share-modal.html'
})
export class PhotoShareModal {
    form: any    = {
        title    : '',
        privacity: 'public',
        address  : {},
        location : null
    };
    location: any;
    address: any = {};

    image: any;
    eventName: string;
    _eventName: string = 'photoshare:crop';

    constructor(private navparams: NavParams,
                private viewCtrl: ViewController,
                private ParseFile: ParseFile,
                private events: Events,
                private modalCtrl: ModalController,
                private zone: NgZone
    ) {
        this.image     = this.navparams.get('base64');
        this.eventName = this.navparams.get('eventName');

        events.subscribe('album:selected', album => {
            this.form.album = album[0];
        });

        events.subscribe(this._eventName, _imageCroped => {
            console.log('Imagem cortada');
            this.image = _imageCroped[0];
        });
    }

    showAddressModal() {
        let modal = this.modalCtrl.create(GmapsAutocompleteModalPage);
        modal.onDidDismiss(address => {
            if (address) {
                this.zone.run(() => {
                    this.address       = address
                    this.form.address  = address;
                    this.form.location = address.location;
                })
            }
        });
        modal.present();
    }

    clearAddress() {
        this.form.address  = {};
        this.form.location = null;
        this.address       = {};
    }

    submit(form) {
        if (form.valid) {
            this.ParseFile.uploadProccess({form: this.form, image: this.image});
            this.events.publish('photocrop:close');
            this.events.unsubscribe(this.eventName);
            this.dismiss();
        }
    }

    cropImage(): void {
        this.modalCtrl.create(IonPhotoCropModal, {eventName: this._eventName}).present();
    }

    dismiss(cancel?) {
        if (cancel) {
            this.events.publish('photocrop:close');
        }
        this.viewCtrl.dismiss();
    }


}
