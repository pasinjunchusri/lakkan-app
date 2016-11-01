import {Component} from '@angular/core';
import {ViewController} from "ionic-angular";
import {IonicUtil} from "../../providers/ionic-util";

@Component({
    selector   : 'photo-capture-modal',
    templateUrl: 'photo-capture-modal.html'
})
export class PhotoCaptureModal {

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
