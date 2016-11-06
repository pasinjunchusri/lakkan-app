import {Component} from '@angular/core';
import {NavController, Events, Platform} from 'ionic-angular';
import {Gallery} from "../../providers/gallery";
import {UserListPage} from "../user-list/user-list";
import _ from 'underscore';

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
    moreItem: boolean      = true;

    constructor(private navCtrl: NavController,
                private events: Events,
                private platform: Platform,
                private provider: Gallery
    ) {

    }

    ngOnInit() {
        this.feed()
    }

    selectType(privacity: string) {
        this.params.page      = 1;
        this.privacity        = privacity;
        this.params.privacity = privacity;
        this.feed();
    }

    onPageUsers() {
        this.navCtrl.push(UserListPage);
    }

    feed() {
        return new Promise((resolve, reject) => {
            console.log('Load Feed', this.params, this.loading);

            if (this.params.page == 1) {
                this.data    = [];
                this.loading = true;
            }

            this.provider.feed(this.params).then(data => {
                if (data && data.length) {
                    _.sortBy(data, 'createdAt').reverse().map(item => {
                        this.data.push(item);
                    });
                    this.moreItem = true;
                } else {
                    this.showEmptyView = false;
                    this.moreItem      = false;
                }

                this.loading = false;
                resolve(data);
            }, error => {
                this.errorText     = error.message;
                this.showErrorView = true;
            });
        });
    }

    doInfinite(event) {
        this.params.page++;
        this.feed().then(() => event.complete());
    }

    doRefresh(event) {
        this.params.page = 1;
        this.feed().then(() => event.complete());
    }

}
