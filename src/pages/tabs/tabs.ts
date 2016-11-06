import {Component} from '@angular/core';
import {NavController} from "ionic-angular";

import {TabHomePage} from "../tab-home/tab-home";
import {TabSearchPage} from "../tab-search/tab-search";
import {TabActivityPage} from "../tab-activity/tab-activity";
import {TabAccountPage} from "../tab-account/tab-account";
import {TabCapturSharePage} from "../tab-capture-share/tab-capture-share";
import {PhotoService} from "../../providers/photo-service";
import {IonicUtil} from "../../providers/ionic-util";

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

    constructor(private navCtrl: NavController,
                private photoService: PhotoService,
                private util: IonicUtil
    ) {

    }

    openCapture() {
        this.photoService.open().then(image => {
            this.navCtrl.push(TabCapturSharePage, {image: image});
        }).catch(error => {
            console.log(error);
            this.util.toast(error);
        });
    }
}
