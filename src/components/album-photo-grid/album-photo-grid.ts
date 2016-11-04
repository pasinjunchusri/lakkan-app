import {Component} from '@angular/core';
import {Gallery} from "../../providers/gallery";
import {Events, NavController, ViewController, NavParams, PopoverController} from 'ionic-angular';
import {PhotoPage} from "../../pages/photo/photo";
import {AlbumPhotoGridPopover} from '../album-photo-grid-popover/album-photo-grid-popover';

@Component({
    selector   : 'album-photo-grid',
    templateUrl: 'album-photo-grid.html'
})
export class AlbumPhotoGrid {
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

    constructor(private provider: Gallery,
                public events: Events,
                public navCtrl: NavController,
                public viewCtrl: ViewController,
                public navParams: NavParams,
                public popoverCtrl: PopoverController,
    ) {
        console.log(this.navParams.get('id'));
        this.params.id = this.navParams.get('id');
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
        this.popoverCtrl.create(AlbumPhotoGridPopover, {id: this.params.id}).present({ev: event});
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
                    data.map(item => {
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
