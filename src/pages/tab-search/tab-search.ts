import {Component} from '@angular/core';
import {NavController, Events} from 'ionic-angular';
import { TranslateService } from 'ng2-translate';

@Component({
    selector   : 'page-tab-search',
    templateUrl: 'tab-search.html'
})
export class TabSearchPage {

    words: string ='';
    loading: boolean  = false;
    placeholder:string = 'Search';

    params = {
        limit    : 15,
        page     : 1,
        privacity: 'public',
        words: '',
    };

    constructor(private navCtrl: NavController,
                private events: Events,
                private translate: TranslateService
    ) {

        // Translate Search Bar Placeholder
        this.translate.get(this.placeholder).subscribe((res:string)=>this.placeholder = res);

        this.loading = true;
        this.events.subscribe('photolist:complete', () => {
            this.loading = false;
        });

        setTimeout(() => {
            this.events.publish('photolist:params', this.params);
        }, 150);
        
    }

    doSearch() {
        this.params.words = this.words;
        this.doReload();
    }

    doCancel() {
        this.words = '';
        this.doReload();
    }

    doReload(){
        this.params.page = 1;
        this.loading = true;
        this.events.publish('photolist:params', this.params);
        this.events.subscribe('photolist:complete', () => this.loading = false);
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
