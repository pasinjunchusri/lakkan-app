import {Component} from '@angular/core';
import {NavController, Events, ModalController, NavParams} from 'ionic-angular';
import {UserData} from "../../providers/user-data";
import {AccountEditModal} from "../account-edit-modal/account-edit-modal";


@Component({
    selector   : 'page-profile',
    templateUrl: 'profile.html'
})
export class ProfilePage {

    user: any;
    username: string;
    loading: boolean = true;
    type: string     = 'list';
    profile: any = {
            name: '',
            username: '',
            photo: '',
            status: '',
            galleriesTotal: 0,
            followersTotal: 0,
            followingsTotal: 0,
        };
    params: any = {
            limit    : 5,
            page     : 1,
            privacity: 'public',
            username : this.username
        };

    constructor(public navCtrl: NavController,
                public User: UserData,
                public events: Events,
                public navParams: NavParams,
                public modalCtrl: ModalController
    ) {

        this.username = this.navParams.get('username');

        this.User.profile(this.username).then(profile => {
            console.log(profile);
            this.profile = profile;
            this.loading = false;
        });

        setTimeout(()=>{
            this.onSelectType('public');
        }, 150);
    }

    onEditProfile() {
        let modal = this.modalCtrl.create(AccountEditModal);
        modal.present();
    }


    onSelectType(type: string) {
        this.type = type;
        console.log(this.type);
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
