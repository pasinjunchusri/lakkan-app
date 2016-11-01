import {Component} from '@angular/core';

import {TabHomePage} from "../tab-home/tab-home";
import {TabSearchPage} from "../tab-search/tab-search";
import {TabActivityPage} from "../tab-activity/tab-activity";
import {TabAccountPage} from "../tab-account/tab-account";
import {PhotoService} from "../../providers/photo-service";
import {Platform, ModalController} from "ionic-angular";
import {PhotoShareModal} from "../../components/photo-share-modal/photo-share-modal";

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

    constructor(public PhotoService: PhotoService,
                public platform: Platform,
                public modalCtrl: ModalController
    ) {

    }

    openCapture() {
        console.log('Capture');
        //this.PhotoService.open();
        this.modalCtrl.create(PhotoShareModal).present();
    }
}
