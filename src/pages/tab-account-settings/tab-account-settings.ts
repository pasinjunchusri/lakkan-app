import {Component} from '@angular/core';
import {App, ModalController} from 'ionic-angular';
import {Auth} from "../../providers/auth";
import {IntroPage} from "../intro/intro";
import {UserPassword} from "../user-password/user-password";
import {AccountEditModal} from "../account-edit-modal/account-edit-modal";


@Component({
    selector   : 'page-tab-account-settings',
    templateUrl: 'tab-account-settings.html'
})
export class TabAccountSettingsPage {

    constructor(private Auth: Auth,
                private app: App,
                private modalCtrl: ModalController,
    ) {}


    changePassword(): void {
        this.modalCtrl.create(UserPassword).present();
    }

    editModal(): void {
        this.modalCtrl.create(AccountEditModal).present();
    }

    logout(): void {
        this.Auth.logout();
        this.app.getRootNav().setRoot(IntroPage);
    }

}
