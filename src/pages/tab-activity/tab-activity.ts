import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {GalleryActivity} from "../../providers/gallery-activity";
import {ProfilePage} from "../profile/profile";

@Component({
    selector   : 'page-tab-activity',
    templateUrl: 'tab-activity.html'
})
export class TabActivityPage {

    data: any         = [];
    moreItem: boolean = true;
    loading: boolean  = true;
    type: string      = 'you';

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

    selectType(type: string) {
        this.type = type;
    }

    feed() {
        console.log('Load Feed', this.params);
        return new Promise((resolve, reject) => {
            this.loading = true;
            this.provider.feed(this.params).then(data => {
                if (data && data.length) {
                    data.map(item => {
                        this.data.push(item);
                    });
                } else {
                    this.moreItem = false;
                }

                this.loading = false;
                resolve();
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
