import {Component} from '@angular/core';
import {Gallery} from "../../providers/gallery";
import {Events, NavController, ViewController, NavParams, PopoverController} from 'ionic-angular';
import {PhotoPage} from "../../pages/photo/photo";
import {AlbumPhotoGridPopoverComponent} from '../album-photo-grid-popover/album-photo-grid-popover';
import _ from 'underscore';
import {IonicUtil} from "../../providers/ionic-util";

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
    canEdit: boolean       = false;
    _width: any;

    constructor(private provider: Gallery,
                private events: Events,
                private navCtrl: NavController,
                private viewCtrl: ViewController,
                private navParams: NavParams,
                private popoverCtrl: PopoverController,
                private util: IonicUtil,
    ) {
        console.log(this.navParams.get('id'));
        this.params.id = this.navParams.get('id');
        this._width    = this.util._widthPlatform / 3 + 'px';
        this.feed();

        events.subscribe('albumgrid:reload', () => this.feed());
        events.subscribe('albumgrid:destroy', () => this.dismiss());
    }

    dismiss() {
        this.viewCtrl.dismiss();
    }

    openPhoto(item) {
        console.log(item);
        this.navCtrl.push(PhotoPage, {item: item});
    }

    popover(event) {
        this.popoverCtrl.create(AlbumPhotoGridPopoverComponent, {id: this.params.id}).present({ev: event});
    }

    feed() {
        return new Promise((resolve, reject) => {
            console.log('Load Feed', this.params, this.loading);

            if (this.params.page == 1) {
                this.data    = [];
                this.loading = true;
            }

            this.provider.getAlbum(this.params).then(data => {

                if (this.canEdit) {
                    this.data.push({create: true});
                }

                if (data && data.length) {
                    _.sortBy(data, 'createdAt').reverse().map(item => {
                        this.data.push(item);
                    });
                } else {
                    this.showEmptyView = false;
                }

                this.loading = false;
                this.events.publish('photolist:complete');
                resolve(data);
            }, error => {
                this.errorText     = error.message;
                this.showErrorView = true;
                this.events.publish('photolist:complete');
            });
        });
    }

}
