import {Component} from "@angular/core";
import {NavController, Events, ModalController, NavParams} from "ionic-angular";
import {UserData} from "../../providers/user-data";
import {AccountEditModal} from "../account-edit-modal/account-edit-modal";


@Component({
    selector   : 'page-profile',
    templateUrl: 'profile.html'
})
export class ProfilePage {

    user: any;
    username: string;
    loadingProfile: boolean = true;
    loading: boolean        = true;
    type: string            = 'list';
    moreItem: boolean       = true;

    profile: any = {
        name           : '',
        username       : '',
        photo          : null,
        status         : '',
        galleriesTotal : 0,
        followersTotal : 0,
        followingsTotal: 0,
    };

    params = {
        limit    : 12,
        page     : 1,
        privacity: 'public',
        username : ''
    }

    constructor(public navCtrl: NavController,
                public User: UserData,
                public events: Events,
                public navParams: NavParams,
                public modalCtrl: ModalController
    ) {

        this.username = this.navParams.get('username');

        this.events.subscribe('photolist:complete', () => {
            this.loading  = false;
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

    doInfinite(event) {
        if (!this.loading) {
            this.params.page++;

            this.loading = true;
            this.events.publish('photolist:params', this.params);

            this.events.unsubscribe('photolist:complete', null);
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
            this.events.unsubscribe('photolist:complete', null);
            this.events.subscribe('photolist:complete', () => {
                this.loading = false;
                event.complete();
            });
        }
    }

}
