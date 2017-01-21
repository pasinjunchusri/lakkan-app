import {Component, ViewChild} from '@angular/core';
import {ModalController, Events, App} from 'ionic-angular';
import {AccountEditModalPage} from '../account-edit-modal/account-edit-modal';
import {TabAccountSettingsPage} from '../tab-account-settings/tab-account-settings';
import {UserDataProvider} from '../../providers/user-data';
import {ParseFileProvider} from '../../providers/parse-file';
import {UserProvider} from '../../providers/user';
import {ImageCaptureComponent} from '../../components/image-capture/image-capture';
import {IonicUtilProvider} from '../../providers/ionic-util';
import {AnalyticsProvider} from '../../providers/analytics';

@Component({
    selector:    'page-tab-account',
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

    @ViewChild('image') imageElement: ImageCaptureComponent;

    params = {
        limit:     12,
        page:      1,
        privacity: 'public',
        username:  ''
    };

    constructor(private userData: UserDataProvider,
                private events: Events,
                private modalCtrl: ModalController,
                private ParseFile: ParseFileProvider,
                private User: UserProvider,
                private app: App,
                private util: IonicUtilProvider,
                private analytics: AnalyticsProvider,
    ) {
        // Google Analytics
        this.analytics.view('TabAccountPage');

        this.user            = this.userData.current();
        this.username        = this.user.username;
        this.params.username = this.username;

        // More Item
        this.events.subscribe(this.eventName + ':moreItem', moreItem => this.moreItem = moreItem[0]);


        this.loading = true;
        this.loadProfile().then(profile => {
            this.profile = profile;
            this.loading = false;
            this.onSelectType();
        });


    }

    loadProfile(): Promise<any> {
        return this.userData.profile(this.username);
    }

    ionViewDidLoad() {


        if (this.user.photo) {
            this.photo = this.user.photo._url;
        } else {
            this.photo = 'assets/img/user.png';
        }
    }

    openCapture() {
        this.imageElement.openCapture();
    }

    changePhoto(photo) {
        this.util.onLoading('Uploading image...');
        this.ParseFile.upload({base64: photo}).then(image => {
            this.User.updatePhoto(image).then(user => {
                this.user  = user;
                this.photo = photo;
                this.util.endLoading();
                this.util.toast('Avatar updated');
            }).catch(error => {
                this.util.toast('Error: Not upload image');
            });

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

        this.loading = true;
        this.loadProfile().then(profile => {
            this.profile = profile;
            this.loading = false;
        });
    }

    private sendParams(): void {
        this.events.publish(this.eventName + ':params', this.params);
    }
}
