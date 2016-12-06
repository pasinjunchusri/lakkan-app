import {Component, ViewChild} from "@angular/core";
import {TabHomePage} from "../tab-home/tab-home";
import {TabSearchPage} from "../tab-search/tab-search";
import {TabCapturePage} from "../tab-capture/tab-capture";
import {TabActivityPage} from "../tab-activity/tab-activity";
import {TabAccountPage} from "../tab-account/tab-account";
import {Tabs, Events} from "ionic-angular";

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

    @ViewChild('myTabs') tabRef: Tabs;

    constructor(private events: Events) {
        this.events.subscribe('tabHome', () => {
            setTimeout(() => this.tabRef.select(0), 100);
        })
    }

}
