import {Component, Input, OnInit} from "@angular/core";
import {NavController, Events} from "ionic-angular";
import _ from "underscore";
import {GalleryProvider} from "../../providers/gallery.provider";
import {IParams} from "../../models/parse.params.model";
import {PhotoPage} from "../../pages/photo/photo";

@Component({
    selector   : 'photo-grid',
    templateUrl: 'photo-grid.html'
})
export class PhotoGridComponent implements OnInit {

    @Input() username?: string;
    @Input() event: string;

    params: IParams = {
        limit   : 15,
        page    : 1,
        username: null
    };

    errorIcon: string      = 'ios-images-outline';
    errorText: string      = '';
    loading: boolean       = true;
    showEmptyView: boolean = false;
    showErrorView: boolean = false;
    data                   = [];

    constructor(private provider: GalleryProvider,
                private events: Events,
                private nav: NavController
    ) {
        this.params = {
            limit   : 15,
            page    : 1,
            username: null
        };
    }

    ngOnInit() {
        // Cache Request
        this.events.subscribe(this.event + ':cache', (params: IParams) => {
            console.warn('photo-grid', this.event + ':cache', params);
            this.params = params;
            this.cache();
        });

        // Server Request
        this.events.subscribe(this.event + ':params', (params: IParams) => {
            console.warn('photo-grid', this.event + ':params', params);
            this.params = params;
            this.feed();
        });

        // Reload
        this.events.subscribe(this.event + ':reload', (params: IParams) => {
            console.warn('photo-grid', this.event + ':reload');
            this.params = params;
            this.data   = []
            // Clean Cache and Reload
            this.feed()
                .then(() => this.events.publish('scroll:up'))
                .catch(console.error);
            ;
        });
    }

    ngOnDestroy() {
        console.warn('element destroy photo grid');
        this.events.unsubscribe(this.event + ':reload');
        this.events.unsubscribe(this.event + ':params');
    }

    openPhoto(item): void {
        this.nav.push(PhotoPage, {id: item.id});
    }

    private feed(): Promise<any> {

        return new Promise((resolve, reject) => {
            if (this.params.page == 1) {
                this.data    = [];
                this.loading = true;
            }

            console.log('-----feed', this.params);
            this.provider.feed(this.params).then(data => {
                if (data) {
                    this.showErrorView = false;
                    this.showEmptyView = false;
                    _.sortBy(data, 'createdAt').reverse().map(item => this.data.push(item));
                    this.events.publish(this.event + ':moreItem', true);
                }

                if (!this.data.length) {
                    this.showEmptyView = true;
                    this.events.publish(this.event + ':moreItem', true);
                }

                this.loading = false;
                this.events.publish(this.event + ':complete', null);
                resolve(data);
            }).catch(error => {
                this.errorText     = error.message;
                this.showErrorView = true;
                this.loading       = false;
                this.events.publish(this.event + ':complete', null);
                reject(error);
            });
        });
    }

    private cache(): void {
        console.log('Load cache', this.params);
        this.provider.findCache(this.params).then(_data => {
            console.log('cache', _data);
            if (_data.length) {
                _.sortBy(_data, 'createdAt').reverse().map(item => this.data.push(item));
                this.loading = false;
                this.events.publish(this.event + ':moreItem', true);
            } else {
                this.feed();
            }
        });
    }

    public doTry(): void {
        this.showErrorView = false;
        this.feed();
    }

}
