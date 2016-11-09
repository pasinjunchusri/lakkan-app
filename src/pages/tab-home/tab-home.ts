import {Component} from '@angular/core';
import {NavController, Events} from 'ionic-angular';
import {Gallery} from "../../providers/gallery";
import {UserListPage} from "../user-list/user-list";
import _ from 'underscore';
import {IonicUtil} from "../../providers/ionic-util";

@Component({
    selector   : 'page-tab-home',
    templateUrl: 'tab-home.html',
})
export class TabHomePage {

    params = {
        limit    : 14,
        page     : 1,
        privacity: 'public'
    };

    privacity: string      = 'public';
    errorIcon: string      = 'ios-images-outline';
    errorText: string      = '';
    data                   = [];
    loading: boolean       = true;
    showEmptyView: boolean = false;
    showErrorView: boolean = false;
    moreItem: boolean      = false;

    constructor(private navCtrl: NavController,
                private provider: Gallery,
                private events: Events,
                private util: IonicUtil
    ) {

        events.subscribe('home:reload', () => this.doRefresh(null));
    }

    ngOnInit() {
        this.feed();
    }

    selectType(privacity: string) {
        this.params.page      = 1;
        this.privacity        = privacity;
        this.params.privacity = privacity;
        this.loading          = true;
        this.feed();
    }

    onPageUsers() {
        this.navCtrl.push(UserListPage);
    }

    feed() {
        return new Promise((resolve, reject) => {
            console.log('Load Feed', this.params, this.loading);

            if (this.params.page == 1) {
                this.data = [];
            }

            this.provider.feed(this.params).then(data => {
                if (data && data.length) {
                    _.sortBy(data, 'createdAt').reverse().map(item => {
                        this.data.push(item);
                    });
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
                resolve(data);
            }, error => {
                this.errorText     = error.message;
                this.showErrorView = true;
                this.loading       = false;
                reject(this.errorText)
            });
        });
    }

    doInfinite(event) {
        this.params.page++;
        this.feed().then(() => { if(event) event.complete() }).catch(() => { if(event) event.complete() });
    }

    doRefresh(event) {
        this.data        = [];
        this.params.page = 1;
        this.feed().then(() => { if(event) event.complete() }).catch(() => { if(event) event.complete() });
    }

    doTry() {
        this.loading = true;
        this.doRefresh(null);
    }
}
