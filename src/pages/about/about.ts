import {Component} from '@angular/core';
import {ViewController} from 'ionic-angular';

@Component({
    selector   : 'page-about',
    templateUrl: 'about.html'
})
export class AboutPage {

    constructor(private viewCtrl: ViewController) {}

    ionViewDidLoad() {
        console.log('Hello AboutPage Page');
    }

    dismiss() {
        this.viewCtrl.dismiss();
    }
}
