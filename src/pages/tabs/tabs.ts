import {Component, ElementRef, ViewChild, Renderer} from '@angular/core';
import {ModalController, Events} from "ionic-angular";

import {TabHomePage} from "../tab-home/tab-home";
import {TabSearchPage} from "../tab-search/tab-search";
import {TabActivityPage} from "../tab-activity/tab-activity";
import {TabAccountPage} from "../tab-account/tab-account";
import {IonicUtil} from "../../providers/ionic-util";
import {IonPhotoCropModal} from "../../components/ion-photo/ion-photo-crop-modal/ion-photo-crop-modal";
import {PhotoShareModal} from "../../components/photo-share-modal/photo-share-modal";
import {IonPhotoService} from "../../components/ion-photo/ion-photo-service";

@Component({
    templateUrl: 'tabs.html'
})

export class TabsPage {
    // this tells the tabs component which Pages
    // should be each tab's root Page
    tabHome: any     = TabHomePage;
    tabSearch: any   = TabSearchPage;
    tabActivity: any = TabActivityPage;
    tabProfile: any  = TabAccountPage;
    @ViewChild('inputFile') input: ElementRef;

    cordova: boolean = false;

    constructor(private photoService: IonPhotoService,
                private util: IonicUtil,
                private modalCtrl: ModalController,
                private render: Renderer,
                private events: Events
    ) {
        this.cordova = this.util.cordova;
    }


    openCapture() {
        if (this.cordova) {
            this.photoService.open()
                .then(image => this.cropAndShare(image))
                .catch(error => {
                    console.log(error);
                    this.util.toast(error);
                });
        } else {
            this.render.invokeElementMethod(this.input.nativeElement, 'click');
        }
    }

    cropAndShare(image) {
        let eventName = 'photocrop:result';
        this.modalCtrl.create(IonPhotoCropModal, {base64: image}).present();

        this.events.subscribe(eventName, _imageCroped => {
            console.log(_imageCroped);
            this.modalCtrl.create(PhotoShareModal, {base64: _imageCroped[0], eventName: eventName}).present();
        });
    }

    onChange(event) {
        let files     = event.srcElement.files;
        let image     = files[0];
        let reader    = new FileReader();
        reader.onload = (evt) => {
            let image = evt.srcElement['result'];
            this.cropAndShare(image)
        };
        reader.readAsDataURL(image);
    }
}
