import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {Gallery} from "../../providers/gallery";

@Component({
    selector   : 'page-tab-home',
    templateUrl: 'tab-home.html',
})
export class TabHomePage {

    data: any         = [];
    moreItem: boolean = true;
    loading: boolean  = true;

    params = {
        limit: 5,
        page : 1
    }

    constructor(private navCtrl: NavController, private Gallery: Gallery) {

    }

    ngOnInit() {
        this.feed()
    }

    feed() {
        console.log('Load Feed', this.params);
        return new Promise((resolve, reject) => {
            this.loading = true;
            this.Gallery.feed(this.params).then(data => {
                if (data.length) {
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
        if(!this.loading) {
            this.params.page++;
            this.feed().then(() => event.complete());
        }
    }

    doRefresh(event) {
        if (!this.loading) {
            this.data = [];
            this.feed().then(() => event.complete());
        }
    }

}
