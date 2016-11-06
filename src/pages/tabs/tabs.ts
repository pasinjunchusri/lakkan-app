import {Component} from '@angular/core';

import {TabHomePage} from "../tab-home/tab-home";
import {TabSearchPage} from "../tab-search/tab-search";
import {TabActivityPage} from "../tab-activity/tab-activity";
import {TabAccountPage} from "../tab-account/tab-account";
import {NavController} from "ionic-angular";
import {TabCapturePage} from "../tab-capture/tab-capture";

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

    constructor(private navCtrl: NavController
    ) {

    }

    openCapture() {
        this.navCtrl.push(TabCapturePage);
    }
}
