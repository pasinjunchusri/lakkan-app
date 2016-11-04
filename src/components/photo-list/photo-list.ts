import {Component, Input} from '@angular/core';
import {Events} from "ionic-angular";
import {Gallery} from "../../providers/gallery";
import _ from 'underscore';

@Component({
    selector   : 'photo-list',
    templateUrl: 'photo-list.html'
})
export class PhotoList {

    @Input() username?: string;

    params = {
        limit: 5,
        page : 1
    };

    errorIcon: string = 'ios-images-outline';
    errorText: string = '';
    data = [];
    loading: boolean = true;
    showEmptyView: boolean = false;
    showErrorView: boolean = false;

    constructor(public provider: Gallery,
                public events: Events
    ) {
        events.subscribe('photolist:params', params => {
            console.log('photolist:params', params);
            this.params = params[0];
            this.feed();
        });
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
                    _.sortBy(data, 'createdAt').reverse().map(item => {
                        this.data.push(item);
                    });
                } else {
                    this.showEmptyView = false;
                }
    
                this.loading = false;
                this.events.publish('photolist:complete', null);
                resolve(data);
            }, error => {
                this.errorText = error.message;
                this.showErrorView = true;
                this.events.publish('photolist:complete', null);
            });
        });
    }

}
