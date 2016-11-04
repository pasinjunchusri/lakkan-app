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
    placeholder:string = 'Search';

    params = {
        limit    : 24,
        page     : 1,
        words: '',
    };

    errorIcon: string = 'ios-images-outline';
    errorText: string = '';
    data = [];
    loading: boolean = true;
    showEmptyView: boolean = false;
    showErrorView: boolean = false;

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
        return new Promise((resolve,reject)=>{
            console.log('Load Feed', this.params, this.loading);
    
            if (this.params.page == 1) {
                this.data = [];
                this.loading = true;
            }
    
            this.provider.feed(this.params).then(data => {
                if (data && data.length) {
                    data.map(item => {
                        this.data.push(item);
                    });
                } else {
                    this.showEmptyView = false;
                }
    
                this.loading = false;
                resolve(data);
            }, error => {
                this.errorText = error.message;
                this.showErrorView = true;
            });
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
