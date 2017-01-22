import {Component} from '@angular/core';
import {NavController, NavParams, ViewController, Events} from 'ionic-angular';
import {GalleryProvider} from '../../providers/gallery';
import {AnalyticsProvider} from '../../providers/analytics';
import {IonicUtilProvider} from '../../providers/ionic-util';

@Component({
    selector:    'page-photo-edit',
    templateUrl: 'photo-edit.html'
})
export class PhotoEditPage {
    item: any;
    form: any = {
        id:        null,
        title:     '',
        privacity: '',
        albumId:   null,
        address:   null,
    };
    image: any;

    constructor(public navCtrl: NavController,
                private navParams: NavParams,
                private provider: GalleryProvider,
                private viewCtrl: ViewController,
                private events: Events,
                private analytics: AnalyticsProvider,
                private util: IonicUtilProvider
    ) {
        // Google Analytics
        this.analytics.view('PhotoEditPage');
    }

    ionViewWillLoad() {
        let item            = this.navParams.get('item');
        this.item           = item;
        this.form.id        = item.id;
        this.form.title     = item.title;
        this.form.privacity = item.privacity;
        this.events.subscribe('album:selected', album => this.form.albumId = album['id']);
        this.events.subscribe('address:selected', address => this.form.address  = address);
    }

    ngOnDestroy() {
        this.events.unsubscribe('album:selected');
        this.events.unsubscribe('address:selected');
    }

    submit(form) {
        if (form.valid) {
            this.util.onLoading('Updating....');
            this.provider.updatedGallery(this.form).then(() => {
                this.events.publish('home:reload', null);
                this.util.endLoading();
                this.viewCtrl.dismiss();
            });

        }
    }

    dismiss(cancel?) {
        this.viewCtrl.dismiss();
    }
}
