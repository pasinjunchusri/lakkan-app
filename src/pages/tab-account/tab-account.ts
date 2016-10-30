import {Component} from '@angular/core';
import {NavController, ModalController, Events} from 'ionic-angular';
import {AccountEditModal} from "../account-edit-modal/account-edit-modal";
import {TabAccountSettingsPage} from "../tab-account-settings/tab-account-settings";
import {UserData} from "../../providers/user-data";

@Component({
    selector   : 'page-tab-account',
    templateUrl: 'tab-account.html'
})
export class TabAccountPage {
    user: any;
    username: string;
    loading: boolean = true;
    type: string     = 'list';
    profile: any;

    params = {
        limit    : 5,
        page     : 1,
        privacity: 'public',
        username : ''
    }

    constructor(public navCtrl: NavController,
                public User: UserData,
                public events: Events,
                public modalCtrl: ModalController
    ) {
        this.user            = User.current();
        this.username        = User.current().get('username');
        this.params.username = this.username;

        this.loading = true;
        this.User.profile(this.username).then(profile => {
            console.log(profile);
            this.profile = profile;
            this.loading = false;
        });
    }

    onEditProfile() {
        let modal = this.modalCtrl.create(AccountEditModal);
        modal.present();
    }


    onSelectType(type: string) {
        this.type = type;
        console.log(this.type);
    }

    onPageSettings() {
        this.navCtrl.push(TabAccountSettingsPage)

    }

    doInfinite(event) {
        if (!this.loading) {
            this.params.page++;

            this.loading = true;
            this.events.publish('photolist:params', this.params);
            this.events.subscribe('photolist:complete', () => {
                this.loading = false;
                event.complete();
            });
        }
    }

    doRefresh(event) {
        if (!this.loading) {
            this.params.page = 1;

            this.loading = true;
            this.events.publish('photolist:params', this.params);
            this.events.subscribe('photolist:complete', () => {
                this.loading = false;
                event.complete();
            });
        }
    }
}
