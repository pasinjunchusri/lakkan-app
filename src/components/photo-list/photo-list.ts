import {Component, OnInit} from '@angular/core';
import {Gallery} from "../../providers/gallery";
import {Events} from "ionic-angular";

@Component({
    selector   : 'photo-list',
    templateUrl: 'photo-list.html'
})
export class PhotoList implements OnInit {

    loading: boolean;

    data: any = [];
    moreItem: boolean;
    params    = {
        limit: 5,
        page : 1
    };

    constructor(private provider: Gallery, public events: Events) {

        events.subscribe('photolist:params', params => {
            console.log('photolist:params', params);
            this.params = params[0];
            this.feed();
        });
    }


    ngOnInit() {
        this.feed()
    }

    onLoading() {
        this.loading = !this.loading;
    }

    onChangeParams(event) {
        console.log(event);
    }

    feed() {
        console.log('Load Feed', this.params);
        return new Promise((resolve, reject) => {
            this.loading = true;

            if (this.params.page == 1) {
                this.loading = false;
                this.data    = [];
            }

            this.provider.feed(this.params).then(data => {
                if (data && data.length) {
                    data.map(item => {
                        this.data.push(item);
                    });
                } else {
                    this.moreItem = false;
                }

                this.loading = false;

                this.events.publish('photolist:complete');
                resolve();

            }, error => {

                this.events.publish('photolist:complete');
                reject(error);
            });
        });
    }

    doInfinite(event) {
        if (!this.loading) {
            this.params.page++;
            this.feed().then(() => event.complete());
        }
    }

    doRefresh(event) {
        if (!this.loading) {
            this.data        = [];
            this.params.page = 1;
            this.feed().then(() => event.complete());
        }
    }

}
