import {Component} from "@angular/core";
import {NavController, Events, ModalController, NavParams} from "ionic-angular";
import {UserData} from "../../providers/user-data";
import {AccountEditModalPage} from "../account-edit-modal/account-edit-modal";


@Component({
    selector   : 'page-profile',
    templateUrl: 'profile.html'
})
export class ProfilePage {

    user: any;
    username: string;
    loading: boolean = true;
    type: string            = 'list';
    moreItem: boolean       = true;
    eventName: string;

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

        this.username        = this.navParams.get('username');
        this.params.username = this.username;
        this.eventName       = this.username;

        this.loading = true;
        this.User.profile(this.username).then(profile => {
            this.profile        = profile;
            this.loading = false;
        });

        setTimeout(() => this.onSelectType('list'), 1000);
    }

    onEditProfile() {
        let modal = this.modalCtrl.create(AccountEditModalPage);
        modal.present();
    }

    onSelectType(type: string) {
        this.type    = type;
        this.sendParams();
    }

    public doInfinite(event) {
        this.params.page++;
        this.events.unsubscribe(this.eventName + ':complete');
        this.events.subscribe(this.eventName + ':complete', () => event.complete());
        this.sendParams();
    }

    public doRefresh(event?) {
        event.complete();
        this.params.page = 1;
        this.sendParams();
    }

    private sendParams(): void {
        this.events.publish(this.eventName + ':params', this.params);
    }

}
