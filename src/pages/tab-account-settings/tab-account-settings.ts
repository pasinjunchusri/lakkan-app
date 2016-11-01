import {Component} from '@angular/core';
import {NavController, App, ModalController} from 'ionic-angular';
import {Auth} from "../../providers/auth";
import {IntroPage} from "../intro/intro";
import {UserPassword} from "../user-password/user-password";
import {AccountEditModal} from "../account-edit-modal/account-edit-modal";

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
                public app: App,
                public modalCtrl: ModalController,
    ) {}

    ionViewDidLoad() {
        console.log('Hello TabAccountSettings Page');
    }

    changePassword(){
        let modal = this.modalCtrl.create(UserPassword);
        modal.present();
    }

    editModal(){
        let modal = this.modalCtrl.create(AccountEditModal);
        modal.present();
    }

    logout() {
        this.Auth.logout();
        this.app.getRootNav().setRoot(IntroPage);
    }

}
