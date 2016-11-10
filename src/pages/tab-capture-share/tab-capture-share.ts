import {Component} from '@angular/core';
import {NavParams, ViewController, NavController, Events, ModalController} from "ionic-angular";
import {TabsPage} from "../tabs/tabs";
import {ParseFile} from "../../providers/parse-file";
import {GmapsAutocompleteModalPage} from "../../components/gmaps-autocomplete-modal/gmaps-autocomplete-modal";

@Component({
    selector   : 'tab-capture-share',
    templateUrl: 'tab-capture-share.html'
})
export class TabCapturSharePage {
    form: any = {
        title    : '',
        privacity: 'public',
        address  : '',
        location : ''
    };
    image: any;

    constructor(private navparams: NavParams,
                private navCtrl: NavController,
                private viewCtrl: ViewController,
                private ParseFile: ParseFile,
                private events: Events,
                private modalCtrl: ModalController
    ) {
        this.image = this.navparams.get('base64');
        events.subscribe('album:selected', album => {
            this.form.album = album[0];
        });
    }

    showAddressModal() {
        let modal = this.modalCtrl.create(GmapsAutocompleteModalPage);
        modal.onDidDismiss(address => {
            if (address) {
                this.form.address  = address;
                this.form.location = address.location;
            }
        });
        modal.present();
    }

    clearAddress() {
        this.form.adress   = '';
        this.form.location = ''
    }

    submit(form) {
        if (form.valid) {
            this.navCtrl.push(TabsPage);
            this.ParseFile.uploadProccess({form: this.form, image: this.image});
        }
    }


    dismiss() {
        this.viewCtrl.dismiss();
    }


}
