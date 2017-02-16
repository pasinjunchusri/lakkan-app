import {Component} from "@angular/core";
import {App, Events} from "ionic-angular";
import {GalleryActivityProvider} from "../../providers/gallery-activity.provider";
import {ProfilePage} from "../profile/profile";
import _ from "underscore";
import {PhotoPage} from "../photo/photo";
import {AnalyticsProvider} from "../../providers/analytics.provider";

@Component({
    selector   : 'page-tab-activity',
    templateUrl: 'tab-activity.html'
})
export class TabActivityPage {


    errorIcon: string      = 'ios-images-outline';
    errorText: string      = '';
    data                   = [];
    loading: boolean       = true;
    showEmptyView: boolean = false;
    showErrorView: boolean = false;
    moreItem: boolean      = false;

    params = {
        limit: 50,
        page : 1
    }

    constructor(private provider: GalleryActivityProvider,
                private app: App,
                private analytics: AnalyticsProvider,
                private events: Events
    ) {
        // Google Analytics
        this.analytics.view('TabActivityPage');
    }

    ngOnInit() {
        this.feed()
    }

    profile(username: string) {
        this.app.getRootNav().push(ProfilePage, {username: username});
    }

    openPhoto(id: string) {
        console.log('openphoto', id);
        this.app.getRootNav().push(PhotoPage, {id: id});
    }

    feed() {
        return new Promise((resolve, reject) => {
            console.log('Load Feed', this.params, this.loading);

            if (this.params.page == 1) {
                this.data = [];
            }

            this.provider.feed(this.params).then(data => {
                if (data && data.length) {
                    _.sortBy(data, 'createdAt').reverse().map(item => {
                        this.data.push(item);
                    });
                    this.moreItem = true;
                } else {
                    if (!this.data.length) {
                        this.showEmptyView = false;
                    }
                    this.moreItem = false;
                }

                this.loading = false;
                this.events.publish('clearActivity');
                resolve(data);
            }, error => {
                this.errorText     = error.message;
                this.showErrorView = true;
                this.loading       = false;
                reject(this.errorText)
            });
        });
    }

    doInfinite(event) {
        this.params.page++;
        this.feed().then(() => event.complete()).catch(() => event.complete());
    }

    doRefresh(event) {
        this.data        = [];
        this.params.page = 1;
        this.feed().then(() => event.complete()).catch(() => event.complete());
    }

    doTry() {
        this.loading = true;
        this.doRefresh(null);
    }

}
