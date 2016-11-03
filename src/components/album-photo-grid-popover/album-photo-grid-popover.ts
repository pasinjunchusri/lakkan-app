import { Component } from '@angular/core';
import { ViewController, NavParams, ModalController, AlertController, Events } from 'ionic-angular';
import { AlbumFormModal } from '../album-form-modal/album-form-modal';
import { IonicUtil } from '../../providers/ionic-util';
import { GalleryAlbum } from '../../providers/gallery-album';

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

  id:string;

  constructor(public viewCtrl: ViewController,
              public navParams: NavParams,
              public alertCtrl : AlertController,
              public ionicUtil: IonicUtil,
              public provider: GalleryAlbum,
              public events: Events,
              public modalCtrl : ModalController
  ) {
      this.id = this.navParams.get('id');
      console.log(this.id);
  }

  close(){
    this.viewCtrl.dismiss();
  }
  
  upload(){
    this.close();
    
  }

  edit(){
    this.close();
    this.modalCtrl.create(AlbumFormModal,{id: this.id}).present();
  }

  destroy() {
    this.close();

    this.alertCtrl.create({
      title: 'Destroy album',
      message: 'You are sure destroy this album and photos?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Yes',
          handler: () => {
            this.ionicUtil.onLoading();
            this.provider.get(this.id).then(gallery=>{
                this.provider.destroy(gallery).then(()=>{
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
