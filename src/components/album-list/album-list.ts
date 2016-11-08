import {Component, Input} from '@angular/core';
import {Events} from "ionic-angular";
import {Gallery} from "../../providers/gallery";
import _ from 'underscore';

@Component({
    selector   : 'album-list',
    templateUrl: 'album-list.html'
})
export class AlbumListComponent {

    @Input() username?: string;

    params = {
        limit: 5,
        page : 1
    };

    errorIcon: string      = 'ios-images-outline';
    errorText: string      = '';
    data                   = [];
    loading: boolean       = true;
    showEmptyView: boolean = false;
    showErrorView: boolean = false;

    constructor(private provider: Gallery,
                private events: Events
    ) {
        console.log('Album List');
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
        return new Promise((resolve, reject) => {
            console.log('Load Feed', this.params, this.loading);

            if (this.params.page == 1) {
                this.data    = [];
                this.loading = true;
            }

            this.provider.feed(this.params).then(data => {
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
