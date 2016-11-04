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
    loadingProfile: boolean = true;
    loading: boolean        = true;
    type: string            = 'list';
    profile: any;
    moreItem : boolean = true;

    params = {
        limit    : 12,
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

        this.events.subscribe('photolist:complete', () => {
            this.loading = false;
            this.moreItem = true;
        });


        this.events.subscribe('photolist:empty', () => {
            this.moreItem = false;
        });

        this.loadingProfile = true;
        this.User.profile(this.username).then(profile => {
            this.profile        = profile;
            this.loadingProfile = false;
        });

        setTimeout(() => this.onSelectType('list'), 200);
    }

    onEditProfile() {
        let modal = this.modalCtrl.create(AccountEditModal);
        modal.present();
    }


    onSelectType(type: string) {
        this.type    = type;
        this.loading = true;
        setTimeout(() => this.events.publish('photolist:params', this.params), 150);
    }

    onPageSettings() {
        this.navCtrl.push(TabAccountSettingsPage)

    }

    doInfinite(event) {
        this.params.page++;

        this.loading = true;
        this.events.publish('photolist:params', this.params);

        this.events.unsubscribe('photolist:complete', null);
        this.events.subscribe('photolist:complete', () => {
            this.loading = false;
            event.complete();
        });
    }

    doRefresh(event) {
        this.params.page = 1;

        this.loading = true;
        this.events.publish('photolist:params', this.params);
        this.events.subscribe('photolist:complete', () => {
            this.loading = false;
            event.complete();
        });
    }
}
