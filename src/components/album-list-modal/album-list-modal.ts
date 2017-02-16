import {Component} from "@angular/core";
import {Events, ViewController, ModalController} from "ionic-angular";
import {GalleryAlbumProvider} from "../../providers/gallery-album.provider";
import {AlbumFormModalComponent} from "../album-form-modal/album-form-modal";
import {IonicUtilProvider} from "../../providers/ionic-util.provider";
import {AnalyticsProvider} from "../../providers/analytics.provider";
import _ from "underscore";

@Component({
    selector   : 'page-album-list-modal',
    templateUrl: 'album-list-modal.html'
})
export class AlbumListModalPage {

    params = {
        limit : 20,
        page  : 1,
        search: ''
    };

    _words: string         = '';
    _placeholder: string   = '';
    privacity: string      = 'public';
    errorIcon: string      = 'ios-images-outline';
    errorText: string      = '';
    data                   = [];
    loading: boolean       = true;
    showEmptyView: boolean = false;
    showErrorView: boolean = false;
    moreItem: boolean      = false;

    constructor(private util: IonicUtilProvider,
                private provider: GalleryAlbumProvider,
                private events: Events,
                private viewCtrl: ViewController,
                private modalCtrl: ModalController,
                private analytics: AnalyticsProvider,
    ) {
        // Google Analytics
        this.analytics.view('AlbumListModalPage');

        // Translate Search Bar Placeholder
        this.util.translate('Search album').then((res: string) => this._placeholder = res);
        //this.events.subscribe('album:reload', () => this.doRefresh(null));
    }

    ionViewDidLoad() {
        this.feed();
    }

    selectAlbum(album: any) {
        console.log('select album', album);
        this.events.publish('album:selected', album);
        this.dismiss();
    }

    albumForm() {
        let modal = this.modalCtrl.create(AlbumFormModalComponent);
        modal.onDidDismiss(() => this.doRefresh())
        modal.present();
    }

    feed(): Promise<any> {
        return new Promise((resolve, reject) => {
            console.log('Load Feed', this.params, this.loading);

            if (this.params.page == 1) {
                this.data = [];
            }

            this.provider.find(this.params).then(data => {
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
                resolve(data);
            }).catch(error => {
                this.errorText     = error.message;
                this.showErrorView = true;
                this.loading       = false;
                reject(this.errorText)
            });
        });
    }


    dismiss() {
        this.viewCtrl.dismiss();
    }

    // Search
    doSearch() {
        this.params.search = this._words;
        this.params.page   = 1;
        this.feed();
    }

    doCancel() {
        this._words      = '';
        this.params.page = 1;
        this.feed();
    }

    doInfinite(event) {
        this.params.page++;
        this.feed().then(() => event.complete()).catch(() => event.complete());
    }

    doRefresh(event?) {
        console.log('do refresh');
        this.params.page = 1;
        this.feed()
            .then(() => {
                if (event) {
                    event.complete()
                }
            })
            .catch(() => {
                if (event) {
                    event.complete()
                }
            });
        ;
    }

    doTry() {
        this.loading = true;
        this.doRefresh(null);
    }
}
