import {Component} from '@angular/core';

import {TabHomePage} from "../tab-home/tab-home";
import {TabSearchPage} from "../tab-search/tab-search";
import {TabSharePage} from "../tab-share/tab-share";
import {TabActivityPage} from "../tab-activity/tab-activity";
import {TabProfilePage} from "../tab-profile/tab-profile";

@Component({
    templateUrl: 'tabs.html'
})

export class TabsPage {
    // this tells the tabs component which Pages
    // should be each tab's root Page
    tabHome: any     = TabHomePage;
    tabSearch: any   = TabSearchPage;
    tabShare: any    = TabSharePage;
    tabActivity: any = TabActivityPage;
    tabProfile: any  = TabProfilePage;

    constructor() {

    }
}
