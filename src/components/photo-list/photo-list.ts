import {Component, Input, OnInit} from '@angular/core';
import {Events} from "ionic-angular";
import {Gallery} from "../../providers/gallery";
import _ from 'underscore';
import {IParams} from "../../models/parse.params.model";


@Component({
    selector   : 'photo-list',
    templateUrl: 'photo-list.html'
})
export class PhotoListComponent implements OnInit {

    @Input() username?: string;
    @Input() event: string;

    params: IParams = {
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
