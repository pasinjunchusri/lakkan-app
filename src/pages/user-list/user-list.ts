import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {UserProvider} from "../../providers/user";
import {ProfilePage} from "../profile/profile";
import {IonicUtilProvider} from "../../providers/ionic-util";
import _ from 'underscore';

@Component({
    selector   : 'page-user-list',
    templateUrl: 'user-list.html'
})
export class UserListPage {
    errorIcon: string      = 'ios-images-outline';
    errorText: string      = '';
    data                   = [];
    loading: boolean       = true;
    showEmptyView: boolean = false;
    showErrorView: boolean = false;
    moreItem: boolean      = false;
    search: string         = '';
    placeholder: string    = 'Search user';

    params = {
        limit : 20,
        page  : 1,
        search: ''
    }

    constructor(private navCtrl: NavController,
                private provider: UserProvider,
                private util: IonicUtilProvider
    ) {
        // Translate Search Bar Placeholder
        this.util.translate(this.placeholder).then((res: string) => this.placeholder = res);
    }

    ionViewDidLoad() {
        this.feed()
    }

    profile(username: string):void {
        this.navCtrl.push(ProfilePage, {username: username});
    }

    feed():Promise<any> {
        return new Promise((resolve, reject) => {
            console.log('Load Feed', this.params, this.loading);

            if (this.params.page == 1) {
                this.data = [];
            }

            this.provider.list(this.params).then(data => {
                console.log(data);
                if (data && data.length) {
                    _.sortBy(data, 'createdAt').reverse().map(item => this.data.push(item));

                    this.showErrorView = false;
                    this.showEmptyView = false;
                    this.moreItem      = true;
                } else {
                    if (!this.data.length) {
                        this.showEmptyView = false;
                    }
                    this.moreItem = false;
                }

                this.loading = false;
                resolve(this.data);
            }).catch(error => {
                this.errorText     = error.message;
                this.showErrorView = true;
                this.loading       = false;
                reject(this.errorText);
            });
        });
    }

    follow(user):void {
        user.loading = true;
        this.provider.follow({userId: user.id}).then(resp => {
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

    // Search
    doSearch() {
        this.params.search = this.search;
        this.params.page   = 1;
        this.feed();
    }

    doCancel() {
        this.search      = '';
        this.params.page = 1;
        this.feed();
    }

    doInfinite(event) {
        this.params.page++;
        this.feed().then(() => event.complete()).catch(() => event.complete());
    }

    doRefresh(event) {
        this.data        = [];
        this.params.page = 1;
        this.feed().then(() => event.complete()).catch(() => event.complete());
    }

    doTry() {
        this.loading = true;
        this.doRefresh(null);
    }

}
