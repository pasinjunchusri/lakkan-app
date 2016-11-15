import {Component, Input} from '@angular/core';
import {Gallery} from "../../providers/gallery";
import {Events, NavController} from "ionic-angular";
import {PhotoPage} from "../../pages/photo/photo";
import _ from 'underscore';
import {IonicUtil} from "../../providers/ionic-util";

@Component({
    selector   : 'photo-grid',
    templateUrl: 'photo-grid.html'
})
export class PhotoGridComponent {

    @Input() username?: string;

    params = {
        limit: 15,
        page : 1
    };

    _width: any;
    errorIcon: string      = 'ios-images-outline';
    errorText: string      = '';
    data                   = [];
    loading: boolean       = true;
    showEmptyView: boolean = false;
    showErrorView: boolean = false;

    constructor(private provider: Gallery,
                private events: Events,
                private navCtrl: NavController,
                private util: IonicUtil
    ) {

        this._width = util._widthPlatform / 3 + 'px';

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
                resolve(data);
            }, error => {
                this.errorText     = error.message;
                this.showErrorView = true;
            });
        });
    }

}
