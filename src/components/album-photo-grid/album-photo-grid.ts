import { Component } from '@angular/core';
import { Gallery } from "../../providers/gallery";
import { Events, NavController, ViewController, NavParams, PopoverController } from 'ionic-angular';
import { PhotoPage } from "../../pages/photo/photo";
import { AlbumPhotoGridPopover } from '../album-photo-grid-popover/album-photo-grid-popover';

@Component({
    selector: 'album-photo-grid',
    templateUrl: 'album-photo-grid.html'
})
export class AlbumPhotoGrid {
    params = {
        limit: 15,
        page: 1,
        id: null
    };

    data: any = [];
    reload: boolean = false;
    moreItem: boolean;
    loading: boolean;

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

        events.subscribe('albumgrid:reload',() => this.feed());
        events.subscribe('albumgrid:destroy',() => this.dismiss());
    }

    dismiss() {
        this.viewCtrl.dismiss();
    }

    openPhoto(item) {
        console.log(item);
        this.navCtrl.push(PhotoPage, { item: item });
    }

    popover(event){
        this.popoverCtrl.create(AlbumPhotoGridPopover, {id: this.params.id}).present({ev: event});
    }

    feed() {
        console.log('Load Feed', this.params, this.loading);
        this.loading = true;

        if (this.params.page == 1) {
            this.data = [];
        }

        this.provider.getAlbum(this.params).then(data => {

            console.log(data);
            if (data && data.photos.length) {
                data.photos.map(item => {
                    this.data.push(item);
                });
            } else {
                this.moreItem = false;
            }

            this.loading = false;
        }, error => {
            this.reload = true;
            this.loading = false;
        });
    }

}
