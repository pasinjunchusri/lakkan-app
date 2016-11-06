import {Component} from '@angular/core';
import {NavParams, ViewController} from "ionic-angular";
import {IonicUtil} from "../../providers/ionic-util";

@Component({
    selector   : 'tab-capture-share',
    templateUrl: 'tab-capture-share.html'
})
export class TabCapturSharePage {
    _base64: string;
    form: any = {
        text: ''
    };

    constructor(private navparams: NavParams,
                private viewCtrl: ViewController,
                private util: IonicUtil
    ) {
        this._base64 = this.navparams.get('image');
    }


    dismiss() {
        this.viewCtrl.dismiss();
    }


}
