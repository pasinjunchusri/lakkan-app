import {Component} from '@angular/core';
import {NavParams, ViewController, Events} from "ionic-angular";
import {ParseFile} from "../../providers/parse-file";
//import {GmapsAutocompleteModalPage} from "../../components/gmaps-autocomplete-modal/gmaps-autocomplete-modal";

@Component({
    selector   : 'photo-share-modal',
    templateUrl: 'photo-share-modal.html'
})
export class PhotoShareModal {
    form: any = {
        title    : '',
        privacity: 'public',
        address  : null,
        location : null
    };
    image: any;

    constructor(private navparams: NavParams,
                private viewCtrl: ViewController,
                private ParseFile: ParseFile,
                private events: Events
    ) {
        this.image = this.navparams.get('base64');
        events.subscribe('album:selected', album => {
            this.form.album = album[0];
        });
    }

    //showAddressModal() {
    //    let modal = this.modalCtrl.create(GmapsAutocompleteModalPage);
    //    modal.onDidDismiss(address => {
    //        if (address) {
    //            this.form.address  = address;
    //            this.form.location = address.location;
    //        }
    //    });
    //    modal.present();
    //}
    //
    //clearAddress() {
    //    this.form.adress   = '';
    //    this.form.location = ''
    //}

    submit(form) {
        if (form.valid) {
            this.ParseFile.uploadProccess({form: this.form, image: this.image});
            this.events.publish('photocrop:close');
            this.dismiss();
        }
    }


    dismiss() {
        this.viewCtrl.dismiss();
    }


}
