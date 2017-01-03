import {Component} from "@angular/core";
import {NavParams} from "ionic-angular";
import {GalleryProvider} from "../../providers/gallery";
import {AnalyticsProvider} from "../../providers/analytics";


@Component({
    selector   : 'page-photo',
    templateUrl: 'photo.html'
})
export class PhotoPage {

    item: any;
    id: any;
    loading: boolean = false;

    constructor(private navParams: NavParams,
                private provider: GalleryProvider,
                private analytics: AnalyticsProvider,
    ) {
        // Google Analytics
        this.analytics.view('PhotoPage');

        this.id       = this.navParams.get('id');
        this.loading = true;

        // Fisrt Get in Cache
        this.provider.getCache(this.id).then(obj => {
                console.log('obj', obj);
                this.item     = obj;
                this.loading = false;
            })
            .catch(error => {
                console.log(error);
                this.load();
            });

    }

    load() {
        this.provider.get(this.id).then(gallery => {
            console.log('gallery', gallery);
            this.item     = gallery;
            this.loading = false;
        });
    }

}
