import {Component} from '@angular/core';
import {NavController, Events, Platform} from 'ionic-angular';
import {Gallery} from "../../providers/gallery";

@Component({
    selector   : 'page-tab-home',
    templateUrl: 'tab-home.html',
})
export class TabHomePage {

    params = {
        limit    : 5,
        page     : 1,
        privacity: 'public'
    };

    privacity: string = 'public';    
    data: any       = [];
    reload: boolean = false;
    moreItem: boolean;
    loading: boolean;

    constructor(public navCtrl: NavController,
                public events: Events,
                public platform: Platform,
                public provider: Gallery
    ) {

        
    }

    ngOnInit() {
        this.feed()
    }

    selectType(privacity: string) {
        this.params.page      = 1;
        this.privacity        = privacity;
        this.params.privacity = privacity;
        this.feed();
    }

    feed() {
        return new Promise((resolve,reject)=>{
            console.log('Load Feed', this.params, this.loading);

            this.loading = true;
    
            if (this.params.page == 1) {
                this.data = [];
            }
    
            this.provider.feed(this.params).then(data => {
                if (data && data.length) {
                    data.map(item => {
                        this.data.push(item);
                    });
                } else {
                    this.moreItem = false;
                }
    
                this.loading = false;
                resolve(data);
            }, error => {
                this.reload  = true;
                this.loading = false;
                reject(error);
            });
        })

    }

    doInfinite(event) {
        this.params.page++;
        this.feed().then(() => event.complete());
    }

    doRefresh(event) {
       this.data        = [];
       this.moreItem = false;
        this.params.page = 1;
        this.feed().then(() => event.complete());
    }

}
