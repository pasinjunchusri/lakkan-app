import {Component, OnInit, Input} from '@angular/core';
import {Events, ModalController} from "ionic-angular";
import {Gallery} from "../../providers/gallery";

@Component({
    selector   : 'photo-list',
    templateUrl: 'photo-list.html'
})
export class PhotoList implements OnInit {

    data: any = [];
    moreItem: boolean;
    loading: boolean;
    @Input() params    = {
        limit: 5,
        page : 1
    };

    constructor(public provider: Gallery,
                public events: Events,
                public modalCtrl: ModalController
    ) {

        events.subscribe('photolist:params', params => {
            console.log('photolist:params', params);
            this.params = params[0];
            this.feed();
        });
    }

    ngOnInit() {
        this.feed()
    }

    feed() {
        console.log('Load Feed', this.params);
        return new Promise((resolve, reject) => {
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
