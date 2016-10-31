import {Component} from '@angular/core';
import {NavParams, ViewController} from "ionic-angular";
import {IonicUtil} from "../../providers/ionic-util";

@Component({
    selector   : 'photo-capture-modal',
    templateUrl: 'photo-capture-modal.html'
})
export class PhotoCaptureModal {

    constructor(public navparams: NavParams,
                public viewCtrl: ViewController,
                public util: IonicUtil
    ) {

    }

    library(){

    }

    dismiss() {
        this.viewCtrl.dismiss();
    }


}
