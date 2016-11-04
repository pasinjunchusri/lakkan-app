import {Component, Input} from '@angular/core';
import {Gallery} from "../../providers/gallery";
import {Events, NavController} from "ionic-angular";
import {PhotoPage} from "../../pages/photo/photo";

@Component({
    selector   : 'photo-grid',
    templateUrl: 'photo-grid.html'
})
export class PhotoGrid {

    @Input() username?: string;
     params = {
        limit: 15,
        page : 1
    };

    errorIcon: string = 'ios-images-outline';
    errorText: string = '';
    data = [];
    loading: boolean = true;
    showEmptyView: boolean = false;
    showErrorView: boolean = false;

    constructor(private provider: Gallery,
                public events: Events,
                public navCtrl: NavController
    ) {
        events.subscribe('photolist:params', params => {
            console.log('photolist:params', params);
            this.params = params[0];
            this.feed();
        });
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

}
