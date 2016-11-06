import {Component} from '@angular/core';
import {ViewController, NavParams, ModalController, AlertController, Events} from 'ionic-angular';
import {AlbumFormModal} from '../album-form-modal/album-form-modal';
import {IonicUtil} from '../../providers/ionic-util';
import {GalleryAlbum} from '../../providers/gallery-album';

@Component({
    selector: 'album-photo-grid-popover',
    template: `
  <ion-list>
      <button ion-item (click)="upload()">Upload Photo</button>
      <button ion-item (click)="edit()">Edit Album</button>
      <button ion-item (click)="destroy()">Destroy Album</button>
</ion-list>
`
})
export class AlbumPhotoGridPopover {

    id: string;
    _translateDestroyTitle: string;
    _translateDestroyMessage: string;
    _translateCancel: string;
    _translateYes: string;

    constructor(private viewCtrl: ViewController,
                private navParams: NavParams,
                private alertCtrl: AlertController,
                private ionicUtil: IonicUtil,
                private provider: GalleryAlbum,
                private events: Events,
                private modalCtrl: ModalController,
                private util: IonicUtil
    ) {
        this.id = this.navParams.get('id');
        console.log(this.id);
        this.util.translate('Destroy album').then((res: string) => this._translateDestroyTitle = res);
        this.util.translate('You are sure destroy this album and photos?').then((res: string) => this._translateDestroyMessage = res);
        this.util.translate('Cancel').then((res: string) => this._translateCancel = res);
        this.util.translate('Yes').then((res: string) => this._translateYes = res);
    }

    close() {
        this.viewCtrl.dismiss();
    }

    upload() {
        this.close();

    }

    edit() {
        this.close();
        this.modalCtrl.create(AlbumFormModal, {id: this.id}).present();
    }

    destroy() {
        this.close();

        this.alertCtrl.create({
            title  : this._translateDestroyTitle,
            message: this._translateDestroyMessage,
            buttons: [
                {
                    text: this._translateCancel,
                    role: 'cancel'
                },
                {
                    text   : this._translateYes,
                    handler: () => {
                        this.ionicUtil.onLoading();
                        this.provider.get(this.id).then(gallery => {
                            this.provider.destroy(gallery).then(() => {
                                this.ionicUtil.endLoading();

                                // Event Emit
                                this.events.publish('albumgrid:destroy');
                            });
                        });
                    }
                }
            ]
        }).present();


        console.log('confirm destroy album');
    }
}
