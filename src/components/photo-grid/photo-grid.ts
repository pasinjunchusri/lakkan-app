import {Component, OnInit, Input} from '@angular/core';
import {Gallery} from "../../providers/gallery";
import {Events, Platform, NavController} from "ionic-angular";
import {PhotoPage} from "../../pages/photo/photo";

@Component({
    selector   : 'photo-grid',
    templateUrl: 'photo-grid.html'
})
export class PhotoGrid implements OnInit {

    @Input() username?: string;
    @Input() params: any;

    loading: boolean  = true;
    moreItem: boolean = true;
    data: any         = [];
    cordova: boolean  = false;

    constructor(private provider: Gallery,
                public events: Events,
                public platform: Platform,
                public navCtrl: NavController
    ) {

        this.cordova = this.platform.is('cordova') ? true : false;
        events.subscribe('photolist:params', params => {
            console.log('photolist:params', params);
            this.params = params[0];
            this.feed();
        });
    }


    ngOnInit() {
        this.feed()
    }

    openPhoto(item) {
        console.log(item);
        this.navCtrl.push(PhotoPage, {item: item});
    }

    feed() {
        console.log('Load Feed', this.params);
        return new Promise((resolve, reject) => {
            this.loading = true;

            if (this.params.page == 1) {
                this.data = [];
            }

            this.provider.feed(this.params).then(data => {

                if (data && data.length) {
                    data.map(item => {
                        this.data.push(item);
                    });
                    this.moreItem = true;
                } else {
                    this.moreItem = false;
                }

                this.loading = false;

                this.events.publish('photolist:complete');
                resolve();

            }, error => {

                this.events.publish('photolist:complete');
                reject(error);
            });
        });
    }

    doInfinite(event) {
        if (!this.loading) {
            this.params.page++;
            this.feed().then(() => event.complete());
        }
    }

    doRefresh(event) {
        if (!this.loading) {
            this.data        = [];
            this.params.page = 1;
            this.feed().then(() => event.complete());
        }
    }

}
