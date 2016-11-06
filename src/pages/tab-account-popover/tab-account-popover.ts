import {Component} from '@angular/core';
import {NavController, ViewController} from 'ionic-angular';

@Component({
    selector   : 'page-tab-account-popover',
    templateUrl: 'tab-account-popover.html'
})
export class TabAccountPopoverPage {

    constructor(private navCtrl: NavController,
                private viewCtrl: ViewController) {}

    close() {
        this.viewCtrl.dismiss();
    }

}
