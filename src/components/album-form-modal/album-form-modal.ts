import {Component} from '@angular/core';
import {ViewController, NavParams, Events} from 'ionic-angular';
import {GalleryAlbum} from '../../providers/gallery-album';
import {IonicUtil} from '../../providers/ionic-util';

@Component({
    selector   : 'album-form-modal',
    templateUrl: 'album-form-modal.html'
})
export class AlbumFormModalComponent {
    id: string;
    form: any = {
        title      : '',
        description: ''
    };

    submitted: boolean = false;

    constructor(private viewCtrl: ViewController,
                private provider: GalleryAlbum,
                private ionicUtil: IonicUtil,
                private navParams: NavParams,
                private events: Events
    ) {
        this.id = this.navParams.get('id');
        if (this.id) {
            this.get();
        }

    }

    get() {
        this.ionicUtil.onLoading();
        this.provider.get(this.id).then(album => {
            console.log(album);
            this.form = album;
            this.ionicUtil.endLoading();
        })
    }

    submit(form: any) {
        this.submitted = true;
        if (form.valid) {
            console.log(this.form);
            if (this.form.id) {
                this.form.save();
                this.dismiss();
            } else {
                this.ionicUtil.onLoading();
                this.provider.put(this.form).then(form => {
                    this.ionicUtil.endLoading();
                    this.dismiss();
                    this.events.publish('album:reload');
                });
            }
        }
    }

    dismiss(): void {
        this.viewCtrl.dismiss();
    }

}
