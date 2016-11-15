import {Component} from '@angular/core';
import {NavController, ModalController, Events} from 'ionic-angular';
import {AccountEditModalPage} from "../account-edit-modal/account-edit-modal";
import {TabAccountSettingsPage} from "../tab-account-settings/tab-account-settings";
import {UserData} from "../../providers/user-data";
import {ParseFile} from "../../providers/parse-file";
import {User} from "../../providers/user";
import {IonicUtil} from "../../providers/ionic-util";

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
    showEmptyView: boolean  = false;
    showErrorView: boolean  = false;
    moreItem: boolean       = false;
    _eventName: string      = 'changephoto';

    params = {
        limit    : 12,
        page     : 1,
        privacity: 'public',
        username : ''
    }

    constructor(private navCtrl: NavController,
                private userData: UserData,
                private events: Events,
                private modalCtrl: ModalController,
                private ParseFile: ParseFile,
                private User: User,
                private util: IonicUtil
    ) {
        this.user            = userData.current();
        this.username        = this.user.username;
        this.params.username = this.username;
        console.log(this.user, this.params);

        this.events.subscribe('photolist:complete', () => {
            this.loading  = false;
            this.moreItem = true;
        });


        this.events.subscribe('photolist:empty', () => {
            this.moreItem = false;
        });

        this.loadingProfile = true;
        this.userData.profile(this.username).then(profile => {
            this.profile        = profile;
            this.loadingProfile = false;
        });

        setTimeout(() => this.onSelectType('list'), 200);

        // Change Photo user
        events.subscribe(this._eventName, imageCroped => {
            this.util.onLoading();
            this.ParseFile.upload({base64: imageCroped[0]}).then(image => {
                this.User.updatePhoto(image).then(user => {
                    console.log(user);
                    this.user = user;
                    this.util.endLoading();
                });

            })
            this.user.photo._url = imageCroped[0];
            this.events.publish('photocrop:close');
        });
    }

    changePhoto() {
        this.events.publish('photoservice', this._eventName);
    }

    onEditProfile() {
        let modal = this.modalCtrl.create(AccountEditModalPage);
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
            event.complete();
        });
    }

    doRefresh(event) {
        this.params.page = 1;

        this.loading = true;
        this.events.publish('photolist:params', this.params);
        this.events.subscribe('photolist:complete', () => {
            event.complete();
        });
    }
}
