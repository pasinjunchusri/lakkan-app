import {Component} from '@angular/core';
import {NavController, Events} from 'ionic-angular';

@Component({
    selector   : 'page-tab-search',
    templateUrl: 'tab-search.html'
})
export class TabSearchPage {

    searchInput: string;
    loading: boolean = false;
    params           = {
        limit: 24,
        page : 1
    }

    constructor(public navCtrl: NavController,
                public events: Events
    ) {
        this.searchInput = '';
        this.events.publish('photolist:params', this.params);
    }

    onInput(ev) {
        console.log('Search', this.searchInput);
    }

    onCancel(ev) {
        this.searchInput = null;
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
