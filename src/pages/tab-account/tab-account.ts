import {Component} from "@angular/core";
import {ModalController, Events, App} from "ionic-angular";
import {AccountEditModalPage} from "../account-edit-modal/account-edit-modal";
import {TabAccountSettingsPage} from "../tab-account-settings/tab-account-settings";
import {UserDataProvider} from "../../providers/user-data";
import {ParseFileProvider} from "../../providers/parse-file";
import {UserProvider} from "../../providers/user";

@Component({
    selector   : 'page-tab-account',
    templateUrl: 'tab-account.html'
})
export class TabAccountPage {
    photo: any;
    user: any;
    username: string;
    loading: boolean   = true;
    type: string       = 'list';
    profile: any;
    moreItem: boolean  = false;
    _eventName: string = 'changephoto';
    eventName: string  = 'account';

    params = {
        limit    : 12,
        page     : 1,
        privacity: 'public',
        username : ''
    }

    constructor(private userData: UserDataProvider,
                private events: Events,
                private modalCtrl: ModalController,
                private ParseFile: ParseFileProvider,
                private User: UserProvider,
                private app: App
    ) {

        this.user            = this.userData.current();
        this.username        = this.user.username;
        this.params.username = this.username;

        // More Item
        this.events.subscribe(this.eventName + ':moreItem', moreItem => this.moreItem = moreItem[0]);


        this.loading = true;
        this.userData.profile(this.username).then(profile => {
            this.profile = profile;
            this.loading = false;
        });


        // Change Photo user
        events.subscribe(this._eventName, imageCroped => {
            this.ParseFile.upload({base64: imageCroped[0]}).then(image => {
                this.User.updatePhoto(image).then(user => {
                    console.log(user);
                    this.user = user;
                    this.doRefresh();
                });

            })
            this.user.photo = imageCroped[0];
            this.events.publish('photocrop:close');
        });

        setTimeout(() => this.onSelectType(), 1000);
    }

    ionViewDidLoad(){


        if (this.user.photo) {
            this.photo = this.user.photo._url;
        } else {
            this.photo = 'assets/img/user.png';
        }
    }


    changePhoto() {
        this.events.publish('photoservice', this._eventName);
    }

    onEditProfile() {
        this.modalCtrl.create(AccountEditModalPage).present();
    }


    onSelectType(type: string = 'list') {
        this.type = type;
        this.sendParams();
    }

    onPageSettings() {
        this.app.getRootNav().push(TabAccountSettingsPage)

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
