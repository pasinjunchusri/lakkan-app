import {Component} from "@angular/core";
import {NavParams, ViewController, Events, ModalController} from "ionic-angular";
import {GmapsAutocompleteModalPage} from "../gmaps-autocomplete-modal/gmaps-autocomplete-modal";
import {AnalyticsProvider} from "../../providers/analytics";

@Component({
    selector   : 'photo-share-modal',
    templateUrl: 'photo-share-modal.html'
})
export class PhotoShareModal {
    form         = {
        title    : '',
        privacity: 'public',
        image    : null,
        address  : {},
        albumId  : null,
        location : null,
    };
    location: any;
    address: any = {};

    album: any;
    eventName: string;

    _eventName: string = 'photoshare:crop';

    constructor(private navparams: NavParams,
                private viewCtrl: ViewController,
                private events: Events,
                private modalCtrl: ModalController,
                private analytics: AnalyticsProvider,
    ) {
        // Google Analytics
        this.analytics.view('PhotoShareModalPage');

        this.form.image = this.navparams.get('base64');
        this.eventName  = this.navparams.get('eventName');
        this.album      = this.navparams.get('album');

        if (this.album) {
            this.form.albumId = this.album.id;
        }

        events.subscribe('album:selected', album => this.form.albumId = album.id);
        events.subscribe(this._eventName, _imageCroped => this.form.image = _imageCroped);
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
            this.viewCtrl.dismiss({form: this.form});
        }
    }

    dismiss(cancel?) {
        this.viewCtrl.dismiss();
    }


}
