import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import { TranslateService } from 'ng2-translate';
import {PhotoPage} from "../../pages/photo/photo";
import {Gallery} from "../../providers/gallery";

@Component({
    selector   : 'page-tab-search',
    templateUrl: 'tab-search.html'
})
export class TabSearchPage {

    words: string ='';
    loading: boolean  = false;
    placeholder:string = 'Search';

    params = {
        limit    : 24,
        page     : 1,
        words: '',
    };

    data: any       = [];
    reload: boolean = false;
    moreItem: boolean;

    constructor(private navCtrl: NavController,
                public translate: TranslateService,
                public provider: Gallery
    ) {

        // Translate Search Bar Placeholder
        this.translate.get(this.placeholder).subscribe((res:string)=>this.placeholder = res);
        this.feed();
    }

    openPhoto(item) {
        console.log(item);
        this.navCtrl.push(PhotoPage, {item: item});
    }

    feed() {
        console.log('Load Feed', this.params, this.loading);
        this.loading = true;

        if (this.params.page == 1) {
            this.data = [];
        }

        this.provider.feed(this.params).then(data => {

            console.log(data);
            if (data && data.length) {
                data.map(item => {
                    this.data.push(item);
                });
            } else {
                this.moreItem = false;
            }

            this.loading = false;
        }, error => {
            this.reload = true;
            this.loading = false;
        });
    }

    doSearch() {
        this.params.words = this.words;
        this.params.page = 1;
        this.feed();
    }

    doCancel() {
        this.words = '';
        this.params.page = 1;
        this.feed();
    }

    doInfinite(event) {
        this.params.page++;
        event.complete();
    }

    doRefresh(event) {
        this.params.page = 1;
        event.complete();
    }

}
