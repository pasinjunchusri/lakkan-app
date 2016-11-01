import {Component} from '@angular/core';
import {NavParams, ViewController} from "ionic-angular";
import {IonicUtil} from "../../providers/ionic-util";

@Component({
    selector   : 'photo-share-modal',
    templateUrl: 'photo-share-modal.html'
})
export class PhotoShareModal {
    form: any = {
        text: ''
    };

    constructor(public navparams: NavParams,
                public viewCtrl: ViewController,
                public util: IonicUtil
    ) {

    }

    library() {

    }

    dismiss() {
        this.viewCtrl.dismiss();
    }


}
