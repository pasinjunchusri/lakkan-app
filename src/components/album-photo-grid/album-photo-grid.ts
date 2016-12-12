import {Component} from "@angular/core";
import {Events, NavController, ViewController, NavParams, PopoverController} from "ionic-angular";
import {PhotoPage} from "../../pages/photo/photo";
import {AlbumPhotoGridPopoverComponent} from "../album-photo-grid-popover/album-photo-grid-popover";
import {IonicUtilProvider} from "../../providers/ionic-util";
import {GalleryAlbumProvider} from "../../providers/gallery-album";
import _ from "underscore";
declare const Parse: any;

@Component({
    selector   : 'album-photo-grid',
    templateUrl: 'album-photo-grid.html'
})
export class AlbumPhotoGridComponent {
    params = {
        limit: 15,
        page : 1,
        id   : null
    };

    errorIcon: string      = 'ios-images-outline';
    errorText: string      = '';
    data                   = [];
    loading: boolean       = true;
    showEmptyView: boolean = false;
    showErrorView: boolean = false;
    moreItem: boolean      = false;
    canEdit: boolean       = false;
    username: any;
    _width: any;

    constructor(private provider: GalleryAlbumProvider,
                private events: Events,
                private navCtrl: NavController,
                private viewCtrl: ViewController,
                private navParams: NavParams,
                private popoverCtrl: PopoverController,
                private util: IonicUtilProvider,
    ) {
        this._width   = this.util._widthPlatform / 3 + 'px';
        this.username = Parse.User.current().get('username');
    }

    ionViewWillEnter() {
        console.log(this.navParams.get('id'));
        this.params.id = this.navParams.get('id');

        this.events.subscribe('albumgrid:reload', () => this.feed());
        this.events.subscribe('albumgrid:destroy', () => this.dismiss());
        this.provider.get(this.params.id).then(album => {
            console.log('album', album);
            this.canEdit = this.validCanEdit(album.user.get('username'));
            this.feed();
        })
    }

    dismiss(): void {
        this.viewCtrl.dismiss();
    }

    openPhoto(item): void {
        this.navCtrl.push(PhotoPage, {id: item.id});
    }

    popover(event): void {
        this.popoverCtrl.create(AlbumPhotoGridPopoverComponent, {id: this.params.id}).present({ev: event});
    }

    feed(): Promise<any> {
        return new Promise((resolve, reject) => {
            if (this.params.page == 1) {
                this.data    = [];
                this.loading = true;
            }

            console.log('-----feed', this.params);
            this.provider.getAlbum(this.params).then(data => {


                console.log('-----result', data);
                if (data) {
                    this.showErrorView = false;
                    this.showEmptyView = false;
                    _.sortBy(data, 'createdAt').reverse().map(item => this.data.push(item));
                } else {
                    this.moreItem = false;
                }

                if (!this.data.length) {
                    this.showEmptyView = true;
                }
                this.loading = false;
                resolve(data);
            }).catch(error => {
                this.errorText     = error.message;
                this.showErrorView = true;
                this.loading       = false;
                reject(error);
            });
        });
    }

    validCanEdit(username): boolean {
        return (this.username == username) ? true : false;
    }

    public doInfinite(event) {
        if (event) {
            event.complete();
        }
        this.params.page++;
        this.feed();
    }

    public doRefresh(event?) {
        if (event) {
            event.complete();
        }
        this.params.page = 1;
        this.feed();
    }

}
