import {Component, Input, OnInit} from '@angular/core';
import {Gallery} from "../../providers/gallery";
import {Events, NavController} from "ionic-angular";
import {PhotoPage} from "../../pages/photo/photo";
import _ from 'underscore';
import {IonicUtil} from "../../providers/ionic-util";

@Component({
    selector   : 'photo-grid',
    templateUrl: 'photo-grid.html'
})
export class PhotoGridComponent implements  OnInit{

    @Input() username?: string;
    @Input() event: string;

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
    }

    ngOnInit() {
        console.info(this.event + ':params');
        this.events.subscribe(this.event + ':params', params => {
            if (params) {
                this.params = params[0];
            }
            this.feed();
        });

        console.info(this.event + ':reload');
        this.events.subscribe(this.event + ':reload', () => {
            this.params.page = 1;
            this.data        = []
            this.feed();
        });
    }

    openPhoto(item) {
        console.log(item);
        this.navCtrl.push(PhotoPage, {item: item});
    }

    private feed(): void {
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
                this.events.publish(this.event + ':moreItem', true);
            } else {
                this.showEmptyView = false;
            }

            this.loading = false;
            this.events.publish(this.event + ':complete', null);
        }, error => {
            this.errorText     = error.message;
            this.showErrorView = true;
            this.events.publish(this.event + ':complete', null);
        });
    }

    public doTry(): void {
        this.showErrorView = false;
        this.feed();
    }

}
