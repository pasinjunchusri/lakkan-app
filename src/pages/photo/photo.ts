import {Component} from '@angular/core';
import {NavParams} from 'ionic-angular';
import {GalleryProvider} from '../../providers/gallery';
import {AnalyticsProvider} from '../../providers/analytics';


@Component({
    selector:    'page-photo',
    templateUrl: 'photo.html'
})
export class PhotoPage {

    item: any;
    id: any;
    loading: boolean = true;

    constructor(private navParams: NavParams,
                private provider: GalleryProvider,
                private analytics: AnalyticsProvider,
    ) {
        // Google Analytics
        this.analytics.view('PhotoPage');
        this.id = this.navParams.get('id');
        this.load();

    }

    load() {
        this.loading = true;
        this.provider.get(this.id).then(gallery => {
            console.log('gallery', gallery);
            this.item    = gallery;
            this.loading = false;
        });
    }

}
