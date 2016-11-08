import {Component} from '@angular/core';
import {NavController, Platform} from 'ionic-angular';
import {PhotoPage} from "../../pages/photo/photo";
import {Gallery} from "../../providers/gallery";
import {IonicUtil} from "../../providers/ionic-util";
import {TabSearchMapPage} from "../tab-search-map/tab-search-map";
import _ from 'underscore';
import {Logging} from "../../providers/logging";

@Component({
    selector   : 'page-tab-search',
    templateUrl: 'tab-search.html'
})
export class TabSearchPage {

    words: string       = '';
    placeholder: string = 'Search';
    _width: any;

    params = {
        limit: 24,
        page : 1,
        words: '',
    };

    errorIcon: string      = 'ios-images-outline';
    errorText: string      = '';
    data                   = [];
    loading: boolean       = true;
    showEmptyView: boolean = false;
    showErrorView: boolean = false;
    moreItem: boolean      = false;

    constructor(private navCtrl: NavController,
                private provider: Gallery,
                private util: IonicUtil,
                private platform: Platform,
                private logging: Logging
    ) {

        // Translate Search Bar Placeholder
        this.util.translate('Search').then((res: string) => this.placeholder = res);
        this._width = this.util._widthPlatform / 3 + 'px';
        this.feed();

    }

    openSearchMap() {
        this.navCtrl.push(TabSearchMapPage);
    }

    openPhoto(item) {
        this.navCtrl.push(PhotoPage, {item: item});
    }

    feed() {
        return new Promise((resolve, reject) => {
            this.logging.log('Load Feed' + this.params + this.loading);

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
                reject(this.errorText)
            });
        });
    }

    doSearch() {
        this.params.words = this.words;
        this.params.page  = 1;
        this.feed();
    }

    doCancel() {
        this.words       = '';
        this.params.page = 1;
        this.feed();
    }

    doInfinite(event) {
        this.params.page++;
        event.complete();
    }

    doRefresh(event) {
        this.params.page = 1;
        event.complete();
    }


}
