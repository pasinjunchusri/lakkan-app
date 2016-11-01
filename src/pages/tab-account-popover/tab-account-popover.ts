import {Component} from '@angular/core';
import {NavController, ViewController} from 'ionic-angular';

@Component({
    selector   : 'page-tab-account-popover',
    templateUrl: 'tab-account-popover.html'
})
export class TabAccountPopoverPage {

    constructor(public navCtrl: NavController, public viewCtrl: ViewController) {}

    ionViewDidLoad() {
        console.log('Hello TabAccountPopoverPage Page');
    }

    close() {
        this.viewCtrl.dismiss();
    }

}
