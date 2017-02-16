import {Component} from '@angular/core';
import {NavParams, ViewController, Events} from 'ionic-angular';
import {AnalyticsProvider} from '../../providers/analytics.provider';

@Component({
    selector:    'photo-share-modal',
    templateUrl: 'photo-share-modal.html'
})
export class PhotoShareModal {
    form         = {
        title:     '',
        privacity: 'public',
        image:     null,
        address:   {},
        albumId:   null,
        location:  null,
    };
    location: any;
    address: any = {};

    album: any;
    eventName: string;

    _eventName: string = 'photoshare:crop';

    constructor(private navparams: NavParams,
                private viewCtrl: ViewController,
                private events: Events,
                private analytics: AnalyticsProvider,
    ) {
        // Google Analytics
        this.analytics.view('PhotoShareModalPage');

        this.form.image = this.navparams.get('base64');
        this.eventName  = this.navparams.get('eventName');
        this.album      = this.navparams.get('album');

        if (this.album) {
            this.form.albumId = this.album.id;
        }

        this.events.subscribe('album:selected', album => this.form.albumId = album['id']);
        this.events.subscribe('address:selected', address => this.form.address  = address);
    }


    ngOnDestroy() {
        this.events.unsubscribe(this._eventName);
        this.events.unsubscribe('album:selected');
        this.events.unsubscribe('address:selected');
    }

    submit(form) {
        if (form.valid) {
            this.events.unsubscribe(this.eventName);
            this.viewCtrl.dismiss({form: this.form});
        }
    }

    dismiss() {
        this.viewCtrl.dismiss();
    }


}
