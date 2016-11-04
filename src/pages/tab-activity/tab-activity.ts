import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {GalleryActivity} from "../../providers/gallery-activity";
import {ProfilePage} from "../profile/profile";
import _ from 'underscore';

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

    params = {
        limit: 20,
        page : 1
    }

    constructor(private navCtrl: NavController,
                private provider: GalleryActivity
    ) {

    }

    ngOnInit() {
        this.feed()
    }

    profile(username: string) {
        this.navCtrl.push(ProfilePage, {username: username});
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

    doInfinite(event) {
        this.params.page++;
        this.feed().then(() => event.complete());
    }

    doRefresh(event) {
        this.data        = [];
        this.params.page = 1;
        this.feed().then(() => event.complete());
    }

}
