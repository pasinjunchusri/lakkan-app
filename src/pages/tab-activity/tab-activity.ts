import {Component} from "@angular/core";
import {App, Events} from "ionic-angular";
import {GalleryActivityProvider} from "../../providers/gallery-activity.provider";
import {ProfilePage} from "../profile/profile";
import _ from "underscore";
import {PhotoPage} from "../photo/photo";
import {AnalyticsProvider} from "../../providers/analytics.provider";
import {UserProvider} from "../../providers/user.provider";

@Component({
    selector:    'page-tab-activity',
    templateUrl: 'tab-activity.html'
})
export class TabActivityPage {


    errorIcon: string = 'ios-images-outline';
    errorText: string = '';
    data = [];
    loading: boolean = true;
    showEmptyView: boolean = false;
    showErrorView: boolean = false;
    moreItem: boolean = false;

    params = {
        limit: 50,
        page:  1
    }

    constructor(private provider: GalleryActivityProvider,
                private app: App,
                private analytics: AnalyticsProvider,
                private events: Events,
                private User: UserProvider,) {
        // Google Analytics
        this.analytics.view('TabActivityPage');
    }

    ionViewDidLoad() {
        this.doRefresh(null);
    }

    profile(username: string) {
        this.app.getRootNav().push(ProfilePage, {username: username});
    }

    openPhoto(id: string) {
        this.app.getRootNav().push(PhotoPage, {id: id});
    }

    follow(item): void {
        item.loading = true;
        this.User.follow({userId: item.user.id}).then(resp => {
            console.log('Follow result', resp);
            item.user.isFollow = (resp === 'follow') ? true : false;
            if (resp == 'follow') {
                item.followersTotal += 1;
            }
            if (resp == 'unfollow') {
                item.followersTotal -= 1;
            }
            item.loading = false;
        });
    }

    public feed(): Promise<any> {
        return new Promise((resolve, reject) => {

            if (this.params.page == 1) {
                this.data = [];
            }

            this.provider.feed(this.params).then(data => {
                //console.log(data);
                if (data) {
                    this.showErrorView = false;
                    this.showEmptyView = false;
                    _.sortBy(data, 'createdAt').reverse().map(item => this.data.push(item));
                }

                if (!this.data.length) {
                    this.showEmptyView = true;
                }

                this.loading = false;
                resolve(data);
            }).catch(error => {
                this.errorText = error.message;
                this.showErrorView = true;
                this.loading = false;
                reject(this.errorText)
            });
        });
    }

    doInfinite(event) {
        this.params.page++;
        this.feed().then(() => event.complete()).catch(() => event.complete());
    }

    doRefresh(event?) {
        this.data = [];
        this.params.page = 1;
        this.events.publish('clearActivity');
        this.provider.checkAll();
        this.feed().then(() => {
            if (event) event.complete()
        }).catch(() => {
            if (event) event.complete()
        });
    }

    doTry() {
        this.loading = true;
        this.doRefresh(null);
    }

}
