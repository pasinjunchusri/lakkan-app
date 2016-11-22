import {Component, ElementRef, ViewChild, Renderer} from '@angular/core';
import {ModalController, Events, Tabs} from "ionic-angular";

import {TabHomePage} from "../tab-home/tab-home";
import {TabSearchPage} from "../tab-search/tab-search";
import {TabCapturePage} from "../tab-capture/tab-capture";
import {TabActivityPage} from "../tab-activity/tab-activity";
import {TabAccountPage} from "../tab-account/tab-account";

import {IonPhotoCropModal} from "../../components/ion-photo/ion-photo-crop-modal/ion-photo-crop-modal";
import {PhotoShareModal} from "../../components/photo-share-modal/photo-share-modal";
import {IonPhotoService} from "../../components/ion-photo/ion-photo-service";
import {IonicUtilProvider} from "../../providers/ionic-util";

@Component({
    selector   : 'tabs',
    templateUrl: 'tabs.html'
})

export class TabsPage {
    // this tells the tabs component which Pages
    // should be each tab's root Page
    tabHome: any     = TabHomePage;
    tabSearch: any   = TabSearchPage;
    tabCapture: any  = TabCapturePage;
    tabActivity: any = TabActivityPage;
    tabProfile: any  = TabAccountPage;

    @ViewChild('inputFile') input: ElementRef;
    @ViewChild('myTabs') tabRef: Tabs;

    cordova: boolean   = false;
    _eventName: string = 'photoshare';

    constructor(private photoService: IonPhotoService,
                private util: IonicUtilProvider,
                private modalCtrl: ModalController,
                private events: Events,
                private render: Renderer
    ) {
        this.cordova = this.util.cordova;

        // Open Capture Photo
        this.events.subscribe('photoservice', eventName => {
            this.openCapture(eventName[0]);
        });

        // Open Share Modal
        this.events.subscribe(this._eventName, _imageCroped => {
            let modal = this.modalCtrl.create(PhotoShareModal, {base64: _imageCroped[0]});
            modal.onDidDismiss(response => {
                console.log(response);
                if (response) {
                    this.events.publish('upload:gallery', response);
                }
            });
            modal.present();
        });
    }


    openCapture(eventname) {
        this._eventName = eventname;
        if (this.cordova) {
            this.photoService.open()
                .then(image => this.cropImage(image))
                .catch(error => {
                    console.log(error);
                    this.util.toast(error);
                });
        } else {
            this.render.invokeElementMethod(this.input.nativeElement, 'click');
        }

        setTimeout(() => this.tabRef.select(0), 100);
    }

    cropImage(image) {
        this.modalCtrl.create(IonPhotoCropModal, {base64: image, eventName: this._eventName}).present();
    }

    onChange(event) {
        let files     = event.srcElement.files;
        let image     = files[0];
        let reader    = new FileReader();
        reader.onload = (evt) => {
            if (evt) {
                let image = evt.srcElement['result'];
                this.cropImage(image)
            }
        };
        reader.readAsDataURL(image);
    }
}
