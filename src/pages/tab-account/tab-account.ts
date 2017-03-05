import {Component} from "@angular/core";
import {App, Events, ModalController} from "ionic-angular";
import {AccountEditModalPage} from "../account-edit-modal/account-edit-modal";
import {TabAccountSettingsPage} from "../tab-account-settings/tab-account-settings";
import {UserDataProvider} from "../../providers/user-data.provider";
import {AnalyticsProvider} from "../../providers/analytics.provider";
declare const Parse:any;

@Component({
    selector   : 'page-tab-account',
    templateUrl: 'tab-account.html'
})
export class TabAccountPage {
    photo: any;
    user: any;
    username: string;
    loading: boolean  = true;
    type: string      = 'list';
    profile: any;
    moreItem: boolean = false;
    eventName: string = 'account';

    params = {
        limit    : 12,
        page     : 1,
        privacity: 'public',
        username : ''
    };

    constructor(private userData: UserDataProvider,
                private events: Events,
                private modalCtrl: ModalController,
                private app: App,
                private analytics: AnalyticsProvider,
    ) {
        // Google Analytics
        this.analytics.view('TabAccountPage');

        this.user            = new Parse.User.current();
        this.username        = this.user.get('username');
        this.params.username = this.username;

        // More Item
        this.events.subscribe(this.eventName + ':moreItem', moreItem => this.moreItem = moreItem[0]);
        this.events.subscribe('profile:reload', () => this.loadProfile());
    }

    ionViewDidLoad() {
        this.loadProfile();
        this.onSelectType();
    }

    loadProfile() {
        this.loading = true;
        this.userData.profile(this.username).then(profile => {
            console.log(profile);
            this.profile = profile;
            if (profile.photo) {
                this.photo = profile.photo;
            } else {
                this.photo = 'assets/img/user.png';
            }
            this.loading = false;
        });
    }

    onEditProfile() {
        this.modalCtrl.create(AccountEditModalPage).present();
    }

    onSelectType(type: string = 'list') {
        this.type = type;
        setTimeout(() => this.events.publish(this.eventName + ':reload', this.params), 1000);
    }

    onPageSettings() {
        this.app.getRootNav().push(TabAccountSettingsPage);

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
        this.loadProfile();
    }

    private sendParams(): void {
        this.events.publish(this.eventName + ':params', this.params);
    }
}
