import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {User} from "../../providers/user";
import {ProfilePage} from "../profile/profile";
import {TranslateService} from "ng2-translate";
import {IonicUtil} from "../../providers/ionic-util";


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
    search: string         = '';
    placeholder: string    = 'Search user';
    _width: any;

    params = {
        limit : 20,
        page  : 1,
        search: ''
    }

    constructor(private navCtrl: NavController,
                private provider: User,
                private translate: TranslateService,
                private util: IonicUtil
    ) {
        // Translate Search Bar Placeholder
        this.translate.get(this.placeholder).subscribe((res: string) => this.placeholder = res);
        this._width = this.util._widthPlatform / 3 + 'px';
    }

    ngOnInit() {
        this.feed()
    }

    profile(username: string) {
        this.navCtrl.push(ProfilePage, {username: username});
    }

    feed() {
        return new Promise((resolve, reject) => {
            console.log('Load Feed', this.params, this.loading);

            if (this.params.page == 1) {
                this.data    = [];
                this.loading = true;
            }

            this.provider.list(this.params).then(data => {
                if (data && data.length) {
                    data.map(item => {
                        this.data.push(item);
                    });
                } else {
                    this.showEmptyView = false;
                }

                this.loading = false;
                resolve(data);
            }, error => {
                this.errorText     = error.message;
                this.showErrorView = true;
                reject(error);
            });
        });
    }

    follow() {

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
        this.feed().then(() => event.complete());
    }

    doRefresh(event) {
        this.data        = [];
        this.params.page = 1;
        this.feed().then(() => event.complete());
    }

}
