import {Component} from "@angular/core";
import {Events, ModalController, NavParams} from "ionic-angular";
import {AccountEditModalPage} from "../account-edit-modal/account-edit-modal";
import {UserProvider} from "../../providers/user";
import {IonicUtilProvider} from "../../providers/ionic-util";
import {IParams} from "../../models/parse.params.model";


@Component({
    selector   : 'page-profile',
    templateUrl: 'profile.html'
})
export class ProfilePage {

    user: any;
    username: string;
    loading: boolean  = true;
    type: string      = 'list';
    moreItem: boolean = true;
    eventName: string;

    profile: any = {
        id             : '',
        name           : '',
        username       : '',
        photo          : null,
        status         : '',
        galleriesTotal : 0,
        followersTotal : 0,
        followingsTotal: 0,
    };

    params: IParams = {
        limit    : 12,
        page     : 1,
        privacity: 'public',
        username : null
    }

    constructor(private User: UserProvider,
                private events: Events,
                private navParams: NavParams,
                private modalCtrl: ModalController,
                private util: IonicUtilProvider
    ) {
        this.username        = this.navParams.get('username');
        this.params.username = this.username;
        this.eventName       = this.username;
        console.log('Open Profile', this.username);

        this.loading = true;
        this.User.getProfileCache(this.username).then(profile => {
            if (profile) {
                this.profile         = profile;
                this.profile.loading = false;
            } else {
                this.loadProfile();
            }
            this.onSelectType();
        });
    }

    ionViewWillEnter() {

    }

    loadProfile() {
        this.User.getProfile(this.username).then(profile => {
            this.profile         = profile;
            this.profile.loading = false;
            this.loading         = false;
        }).catch(this.util.toast);
    }

    onEditProfile(): void {
        this.modalCtrl.create(AccountEditModalPage).present();
    }

    onSelectType(type: string = 'list') {
        this.type = type;
        setTimeout(() => this.events.publish(this.eventName + ':reload', this.params), 500);
    }

    follow(user): void {
        console.log('user', user);
        user.loading = true;
        this.User.follow({userId: user.id}).then(resp => {
            console.log('Follow result', resp);
            user.isFollow = (resp === 'follow') ? true : false;
            if (resp == 'follow') {
                user.followersTotal += 1;
            }
            if (resp == 'unfollow') {
                user.followersTotal -= 1;
            }
            user.loading = false;
        });
    }

    public doInfinite(event) {
        this.params.page++;
        this.events.unsubscribe(this.eventName + ':complete');
        this.events.subscribe(this.eventName + ':complete', () => event.complete());
        this.sendParams();
    }

    public doRefresh(event?) {
        if (event) {
            event.complete();
        }
        this.params.page = 1;
        this.events.publish(this.eventName + ':reload', this.params);
    }

    private sendParams(): void {
        console.log('sendParams', this.params);
        this.events.publish(this.eventName + ':params', this.params);
    }

}
