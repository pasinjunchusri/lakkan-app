import {Component} from '@angular/core';
import {ViewController, NavParams, ModalController, AlertController, Events} from 'ionic-angular';
import {AlbumFormModal} from '../album-form-modal/album-form-modal';
import {IonicUtil} from '../../providers/ionic-util';
import {Gallery} from "../../providers/gallery";
import {PhotoFeedbackModal} from "../photo-feedback-modal/photo-feedback-modal";
import {TranslateService} from "ng2-translate";

@Component({
    selector: 'photo-list-popover',
    template: `
  <ion-list>
      <button ion-item (click)="report()">{{'Report' | translate}}</button>
      <button ion-item (click)="share()">{{'Share' | translate}}</button>
      <button *ngIf="canEdit" ion-item (click)="edit()">{{ 'Edit photo' | translate}}</button>
      <button *ngIf="canEdit" ion-item (click)="destroy()">{{'Destroy photo' | translate}}</button>
</ion-list>
`
})
export class PhotoListPopover {

    item: any;
    username: string = Parse.User.current().get('username');
    canEdit: boolean = false;
    _translateDestroyTitle: string;
    _translateDestroyMessage: string;
    _translateCancel: string;
    _translateYes: string;

    constructor(private viewCtrl: ViewController,
                private navParams: NavParams,
                private alertCtrl: AlertController,
                private ionicUtil: IonicUtil,
                private provider: Gallery,
                private events: Events,
                private modalCtrl: ModalController,
                private translate: TranslateService
    ) {
        this.item    = this.navParams.get('item');
        this.canEdit = (this.username == this.item.user.attributes['username']) ? true : false;
        this.translate.get('Destroy photo').subscribe((res: string) => this._translateDestroyTitle = res);
        this.translate.get('You are sure destroy this photo?').subscribe((res: string) => this._translateDestroyMessage = res);
        this.translate.get('Cancel').subscribe((res: string) => this._translateCancel = res);
        this.translate.get('Yes').subscribe((res: string) => this._translateYes = res);
    }

    report() {
        this.modalCtrl.create(PhotoFeedbackModal, {item: this.item}).present();
        this.close();
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
        this.modalCtrl.create(AlbumFormModal, {item: this.item}).present();
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
                        this.provider.get(this.item['id']).then(gallery => {
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
