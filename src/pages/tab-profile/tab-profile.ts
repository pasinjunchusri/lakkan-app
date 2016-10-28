import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {User} from "../../providers/user";

@Component({
    selector   : 'page-tab-profile',
    templateUrl: 'tab-profile.html'
})
export class TabProfilePage {
    user: any;
    type: string = 'list';

    constructor(public navCtrl: NavController, public User:User) {
        this.user = User.current();
    }


    onSelectType(type: string) {
        this.type = type;
        console.log(this.type);
    }
}
