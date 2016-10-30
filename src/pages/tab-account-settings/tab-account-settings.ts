import {Component} from '@angular/core';
import {NavController, App} from 'ionic-angular';
import {Auth} from "../../providers/auth";
import {IntroPage} from "../intro/intro";

/*
 Generated class for the TabAccountSettings page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
    selector   : 'page-tab-account-settings',
    templateUrl: 'tab-account-settings.html'
})
export class TabAccountSettingsPage {

    constructor(public navCtrl: NavController,
                public Auth: Auth,
                public app: App
    ) {}

    ionViewDidLoad() {
        console.log('Hello TabAccountSettings Page');
    }

    logout() {
        this.Auth.logout();
        this.app.getRootNav().setRoot(IntroPage);
    }

}
