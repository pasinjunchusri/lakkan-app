import {Component, Input, OnInit} from "@angular/core";
import {App, Events, NavController} from "ionic-angular";
import _ from "underscore";
import {IParams} from "../../models/parse.params.model";
import {UserProvider} from "../../providers/user.provider";
import {IonicUtilProvider} from "../../providers/ionic-util.provider";
import {IntroPage} from "../../pages/intro/intro";
import {ProfilePage} from "../../pages/profile/profile";

@Component({
    selector   : 'user-list',
    templateUrl: 'user-list.html'
})
export class UserListComponent implements OnInit {

    @Input() username?: string;
    @Input() event: string;


    params: IParams = {
        limit: 5,
        page : 1
    };

    errorIcon: string      = 'ios-person-outline';
    errorText: string      = '';
    loading: boolean       = true;
    showEmptyView: boolean = false;
    showErrorView: boolean = false;
    data                   = [];

    constructor(private provider: UserProvider,
                private events: Events,
                private app: App,
                private util: IonicUtilProvider,
                private navCtrl: NavController
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
            this.list();
        });

        // Reload
        this.events.subscribe(this.event + ':reload', (params) => {
            console.warn('user-list', this.event + ':reload', params);
            if (params) {
                this.params = params;
            } else {
                this.params.page = 1;
            }
            this.data = []
            // Clean Cache and Reload
            this.list()
                .then(() => this.events.publish('scroll:up'))
                .catch(console.error);
            ;
        });

        // Reload
        this.events.subscribe('photolist:reload', (params) => {
            console.warn('user-list', this.event + ':reload', params);
            if (params) {
                this.params = params;
            } else {
                this.params.page = 1;
            }
            this.data = []
            // Clean Cache and Reload
            this.list()
                .then(() => this.events.publish('scroll:up'))
                .catch(console.error);
            ;
        });
    }

    ngOnDestroy() {
        console.warn('element destroy user list');
        this.events.unsubscribe(this.event + ':reload');
        this.events.unsubscribe(this.event + ':params');
    }


    list(): Promise<any> {

        return new Promise((resolve, reject) => {

            //console.log(this.params);
            if (this.params.page == 1) {
                this.data    = [];
                this.loading = true;
            }

            this.provider.list(this.params).then(data => {
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
                    this.provider.logout();
                    this.app.getRootNav().setRoot(IntroPage);
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

    follow(item): void {
        item.loading = true;
        this.provider.follow({userId: item.id}).then(resp => {
            console.log('Follow result', resp);
            item.isFollow = (resp === 'follow') ? true : false;
            if (resp == 'follow') {
                item.followersTotal += 1;
            }
            if (resp == 'unfollow') {
                item.followersTotal -= 1;
            }
            item.loading = false;
        });
    }


    profile(username: string): void {
        this.navCtrl.push(ProfilePage, {username: username});
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
                this.list();
            }
        });
    }

    public doTry(): void {
        this.showErrorView = false;
        this.list();
    }

}
