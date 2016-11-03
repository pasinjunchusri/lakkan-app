import {Component} from '@angular/core';
import {ViewController} from "ionic-angular";
import {IonicUtil} from "../../providers/ionic-util";

@Component({
    selector   : 'language-modal',
    templateUrl: 'language-modal.html'
})
export class LanguageModal {

    constructor(public viewCtrl: ViewController,
                public util: IonicUtil
    ) {

    }

    library() {

    }

    dismiss() {
        this.viewCtrl.dismiss();
    }


}
