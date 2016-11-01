import {Component} from '@angular/core';
import {NavController, Events} from 'ionic-angular';

@Component({
    selector   : 'page-tab-home',
    templateUrl: 'tab-home.html',
})
export class TabHomePage {

    privacity: string = 'public';
    loading: boolean  = false;

    params = {
        limit    : 5,
        page     : 1,
        privacity: 'public'
    }

    constructor(public navCtrl: NavController,
                public events: Events
    ) {

        setTimeout(() => {
            this.selectType('public');
        }, 200);
    }

    selectType(privacity: string) {
        this.privacity        = privacity;
        this.params.page      = 1;
        this.params.privacity = privacity;
        this.events.publish('photolist:params', this.params);
    }

    doInfinite(event) {
        if (!this.loading) {
            this.params.page++;

            this.loading = true;
            this.events.publish('photolist:params', this.params);
            this.events.subscribe('photolist:complete', () => {
                this.loading = false;
                event.complete();
            });
        }
    }

    doRefresh(event) {
        if (!this.loading) {
            this.params.page = 1;

            this.loading = true;
            this.events.publish('photolist:params', this.params);
            this.events.subscribe('photolist:complete', () => {
                this.loading = false;
                event.complete();
            });
        }
    }

}
