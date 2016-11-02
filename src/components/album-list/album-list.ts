import {Component, Input} from '@angular/core';
import {Events} from "ionic-angular";
import {Gallery} from "../../providers/gallery";

@Component({
    selector   : 'album-list',
    templateUrl: 'album-list.html'
})
export class AlbumList {

    @Input() username?: string;

    params = {
        limit: 5,
        page : 1
    };

    data: any       = [];
    reload: boolean = false;
    moreItem: boolean;
    loading: boolean;

    constructor(public provider: Gallery,
                public events: Events
    ) {
        console.log('Photo List');
        events.subscribe('photolist:params', params => {
            console.log('photolist:params', params);
            this.params = params[0];
            if (!this.loading) {
                this.feed();
            }
        });
    }

    ionViewDidLoad() {
        console.log("I'm alive!");
    }
    ionViewWillLeave() {
        console.log("Looks like I'm about to leave :(");
    }


    feed() {
        console.log('Load Feed', this.params, this.loading);

        this.loading = true;

        if (this.params.page == 1) {
            this.data = [];
        }

        this.provider.feed(this.params).then(data => {
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
