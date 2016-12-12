import {Component} from "@angular/core";
import {NavParams, ViewController, Events, ModalController} from "ionic-angular";
import {GmapsAutocompleteModalPage} from "../gmaps-autocomplete-modal/gmaps-autocomplete-modal";
//import {GmapsAutocompleteModalPage} from "../../components/gmaps-autocomplete-modal/gmaps-autocomplete-modal";

@Component({
    selector   : 'photo-share-modal',
    templateUrl: 'photo-share-modal.html'
})
export class PhotoShareModal {
    form         = {
        title    : '',
        privacity: 'public',
        address  : {},
        albumId  : null,
        location : null,
    };
    location: any;
    address: any = {};

    image: any;
    eventName: string;
    _eventName: string = 'photoshare:crop';

    constructor(private navparams: NavParams,
                private viewCtrl: ViewController,
                private events: Events,
                private modalCtrl: ModalController
    ) {
        this.image     = this.navparams.get('base64');
        this.eventName = this.navparams.get('eventName');

        events.subscribe('album:selected', album => this.form.albumId = album[0].id);
        events.subscribe(this._eventName, _imageCroped => this.image = _imageCroped[0]);
    }

    showAddressModal() {
        let modal = this.modalCtrl.create(GmapsAutocompleteModalPage);
        modal.onDidDismiss(address => {
            if (address) {
                this.address       = address
                this.form.address  = address;
                this.form.location = address.location;
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
            this.events.unsubscribe(this.eventName);
            this.events.publish('photocrop:close');
            this.viewCtrl.dismiss({form: this.form, image: this.image});
        }
    }

    dismiss(cancel?) {
        if (cancel) {
            this.events.publish('photocrop:close');
        }
        this.viewCtrl.dismiss();
    }


}
