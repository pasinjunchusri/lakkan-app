import {Component, Input} from '@angular/core';
import {Events, NavController} from "ionic-angular";
import {PhotoPage} from "../../pages/photo/photo";
import {GalleryAlbum} from "../../providers/gallery-album";

@Component({
    selector   : 'album-grid',
    templateUrl: 'album-grid.html'
})
export class AlbumGrid {

    @Input() username?: string;

    params = {
        limit: 15,
        page : 1
    };

    data: any       = [];
    reload: boolean = false;
    moreItem: boolean;
    loading: boolean;

    constructor(private provider: GalleryAlbum,
                public events: Events,
                public navCtrl: NavController
    ) {


        events.subscribe('photolist:params', params => {
            console.log('photolist:params', params);
            this.params = params[0];
            this.feed();
        });
    }

    openPhoto(item) {
        console.log(item);
        this.navCtrl.push(PhotoPage, {item: item});
    }

    feed() {
        console.log('Load Feed', this.params, this.loading);
        this.loading = true;

        if (this.params.page == 1) {
            this.data = [];
        }

        this.provider.list(this.params).then(data => {

            console.log(data);
            if (data && data.length) {
                data.map(item => {
                    this.data.push(item);
                });
            } else {
                this.moreItem = false;
            }

            this.events.publish('photolist:complete');
            this.loading = false;
        }, error => {
            this.reload  = true;
            this.loading = false;
            this.events.publish('photolist:complete');
        });
    }

}
