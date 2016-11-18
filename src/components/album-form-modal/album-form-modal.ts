import {Component} from '@angular/core';
import {ViewController, NavParams} from 'ionic-angular';
import {GalleryAlbumProvider} from '../../providers/gallery-album';
import {IonicUtilProvider} from '../../providers/ionic-util';

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
                private provider: GalleryAlbumProvider,
                private ionicUtil: IonicUtilProvider,
                private navParams: NavParams
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
                this.provider.put(this.form).then(parseItem => {
                    this.ionicUtil.endLoading();
                    this.viewCtrl.dismiss(parseItem);
                });
            }
        }
    }

    dismiss(): void {
        this.viewCtrl.dismiss();
    }

}
