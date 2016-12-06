import {Component} from "@angular/core";
import {NavController, App} from "ionic-angular";
import {PhotoPage} from "../../pages/photo/photo";
import {GalleryProvider} from "../../providers/gallery";
import {IonicUtilProvider} from "../../providers/ionic-util";
import {TabSearchMapPage} from "../tab-search-map/tab-search-map";
import _ from "underscore";
import {IParams} from "../../models/parse.params.model";

@Component({
    selector   : 'page-tab-search',
    templateUrl: 'tab-search.html'
})
export class TabSearchPage {

    words: string       = '';
    placeholder: string = 'Search';
    _width: any;

    params: IParams = {
        limit: 48,
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
                private provider: GalleryProvider,
                private util: IonicUtilProvider,
                private app: App
    ) {
    }

    ionViewDidLoad(){
        // Translate Search Bar Placeholder
        this.util.translate('Search').then((res: string) => this.placeholder = res);
        this._width = this.util._widthPlatform / 3 + 'px';
        this.cache();
    }

    openSearchMap() {
        this.app.getRootNav().push(TabSearchMapPage);
    }

    openPhoto(item) {
        this.app.getRootNav().push(PhotoPage, {id: item.id});
    }

    private feed(): Promise<any> {
        console.log('Load Feed', this.params, this.loading);

        return new Promise((resolve, reject) => {
            if (this.params.page == 1) {
                this.data    = [];
                this.loading = true;
            }

            this.provider.feed(this.params).then(data => {

                console.log('feed', data);
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
                resolve(data);
            }).catch(error => {
                this.errorText     = error.message;
                this.showErrorView = true;
                this.loading       = false;
                reject(error);
            });
        });
    }

    private cache(): void {
        console.log('Load cache', this.params);
        this.provider.findCache(this.params).then(_data => {
            console.log('cache', _data);
            if (_data.length) {
                _.sortBy(_data, 'createdAt').reverse().map(item => this.data.push(item));
                this.loading = false;
                this.moreItem      = true;
            } else {
                this.feed();
            }
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
        this.feed().then(() => {
            if (event) {
                event.complete()
            }
        }).catch(() => {
            if (event) {
                event.complete()
            }
        });
    }

    doRefresh(event) {
        this.data        = [];
        this.params.page = 1;
        this.feed().then(() => {
            if (event) {
                event.complete()
            }
        }).catch(() => {
            if (event) {
                event.complete()
            }
        });
    }

    doTry() {
        this.loading = true;
        this.doRefresh(null);
    }
}
