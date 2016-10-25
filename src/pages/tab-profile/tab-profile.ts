import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {User} from "../../providers/user";

@Component({
    selector   : 'page-tab-profile',
    templateUrl: 'tab-profile.html'
})
export class TabProfilePage {
    user: any;

    constructor(public navCtrl: NavController, public User:User) {
        this.user = User.current();
    }

}
