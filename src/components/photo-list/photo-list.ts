import {Component, Input} from '@angular/core';
import {Events} from "ionic-angular";
import {Gallery} from "../../providers/gallery";

@Component({
    selector   : 'photo-list',
    templateUrl: 'photo-list.html'
})
export class PhotoList {

    data: any       = [];
    reload: boolean = false;
    moreItem: boolean;
    loading: boolean;
    @Input() params = {
        limit: 5,
        page : 1
    };

    constructor(public provider: Gallery,
                public events: Events
    ) {

        events.subscribe('photolist:params', params => {
            console.log('photolist:params', params);
            this.params = params[0];
            if (!this.loading) {
                this.feed();
            }
        });
    }


    feed() {
        console.log('Load Feed', this.params, this.loading);

        if(this.loading) {
            return false;
        }
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
            this.reload = true;
            this.loading = false;
            this.events.publish('photolist:complete');
        });

    }

}
