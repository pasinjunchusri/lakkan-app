import {Component} from '@angular/core';
import {ViewController, NavParams, ModalController, AlertController, Events} from 'ionic-angular';
import {AlbumFormModal} from '../album-form-modal/album-form-modal';
import {IonicUtil} from '../../providers/ionic-util';
import {Gallery} from "../../providers/gallery";

@Component({
    selector: 'photo-list-popover',
    template: `
  <ion-list>
      <button ion-item (click)="upload()">{{'Report' | translate}}</button>
      <button ion-item (click)="share()">{{'Share' | translate}}</button>
      <button *ngIf="canEdit" ion-item (click)="destroy()">{{ 'Edit photo' | translate}}</button>
      <button *ngIf="canEdit" ion-item (click)="edit()">{{'Delete photo' | translate}}</button>
</ion-list>
`
})
export class PhotoListPopover {

    id: string;
    canEdit: boolean = false;

    constructor(public viewCtrl: ViewController,
                public navParams: NavParams,
                public alertCtrl: AlertController,
                public ionicUtil: IonicUtil,
                public provider: Gallery,
                public events: Events,
                public modalCtrl: ModalController
    ) {
        this.id      = this.navParams.get('id');
        this.canEdit = this.navParams.get('canEdit');
    }

    close() {
        this.viewCtrl.dismiss();
    }

    upload() {
        this.close();
    }

    share() {
        this.close();
    }

    edit() {
        this.close();
        this.modalCtrl.create(AlbumFormModal, {id: this.id}).present();
    }

    destroy() {
        this.close();

        this.alertCtrl.create({
            title  : 'Destroy album',
            message: 'You are sure destroy this album and photos?',
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel'
                },
                {
                    text   : 'Yes',
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
