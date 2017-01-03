import {Component, Input, OnInit} from "@angular/core";
import {App, Events} from "ionic-angular";
import _ from "underscore";
import {IParams} from "../../models/parse.params.model";
import {GalleryProvider} from "../../providers/gallery";
import {UserProvider} from "../../providers/user";
import {AuthPage} from "../../pages/auth/auth";
import {IonicUtilProvider} from "../../providers/ionic-util";

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
    loading: boolean       = true;
    showEmptyView: boolean = false;
    showErrorView: boolean = false;
    data                   = [];

    constructor(private provider: GalleryProvider,
                private events: Events,
                private User: UserProvider,
                private app: App,
                private util: IonicUtilProvider,
    ) {

    }

    ngOnInit() {
        // Cache Request
        this.events.subscribe(this.event + ':cache', (params: IParams) => {
            console.info(this.event + ':cache', params);
            this.params = params;
            this.cache();
        });

        // Server Request
        this.events.subscribe(this.event + ':params', (params: IParams) => {
            console.info(this.event + ':params', params);
            this.params = params;
            this.feed();
        });

        // Reload
        this.events.subscribe(this.event + ':reload', (params) => {
            console.warn('photo-list', this.event + ':reload', params);
            if (params) {
                this.params = params;
            } else {
                this.params.page = 1;
            }
            this.data = []
            // Clean Cache and Reload
            this.feed()
                .then(() => this.events.publish('scroll:up'))
                .catch(console.error);
            ;
        });
    }

    ngOnDestroy() {
        this.events.unsubscribe(this.event + ':reload');
        this.events.unsubscribe(this.event + ':params');
        this.events.unsubscribe('albumgrid:reload');
        this.events.unsubscribe('albumgrid:destroy');
    }


    feed(): Promise<any> {

        return new Promise((resolve, reject) => {

            //console.log(this.params);
            if (this.params.page == 1) {
                this.data    = [];
                this.loading = true;
            }

            this.provider.feed(this.params).then(data => {
                //console.log(data);
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

                if (error.code == Parse.Error['INVALID_SESSION_TOKEN']) {
                    this.User.logout();
                    this.app.getRootNav().setRoot(AuthPage);
                    this.util.toast('Invalid session, please login');
                }

                this.errorText     = error.message;
                this.showErrorView = true;
                this.loading       = false;
                this.events.publish(this.event + ':complete', null);
                reject(error);
            });
        });
    }


    cache(): void {
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
