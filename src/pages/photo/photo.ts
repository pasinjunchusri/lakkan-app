import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';


@Component({
    selector   : 'page-photo',
    templateUrl: 'photo.html'
})
export class PhotoPage {

    item: any;

    constructor(public navCtrl: NavController,
                public navParams: NavParams
    ) {
        this.item = this.navParams.get('item');
        console.log(this.item);
    }

}
