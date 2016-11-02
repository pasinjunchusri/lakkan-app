import {Component, Input} from '@angular/core';
import {Gallery} from "../../providers/gallery";
import {Events, NavController} from "ionic-angular";
import {PhotoPage} from "../../pages/photo/photo";

@Component({
    selector   : 'photo-grid',
    templateUrl: 'photo-grid.html'
})
export class PhotoGrid {

    @Input() username?: string;
     params = {
        limit: 15,
        page : 1
    };

    data: any       = [];
    reload: boolean = false;
    moreItem: boolean;
    loading: boolean;

    constructor(private provider: Gallery,
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

        this.provider.feed(this.params).then(data => {

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
            this.reload = true;
            this.loading = false;
            this.events.publish('photolist:complete');
        });
    }

}
