import {Component, ViewChild} from "@angular/core";
import {TabHomePage} from "../tab-home/tab-home";
import {TabSearchPage} from "../tab-search/tab-search";
import {TabCapturePage} from "../tab-capture/tab-capture";
import {TabActivityPage} from "../tab-activity/tab-activity";
import {TabAccountPage} from "../tab-account/tab-account";
import {Tabs, Events} from "ionic-angular";
import {ParsePushProvider} from "../../providers/parse-push";
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

    tabActivityBadge: number = 0;

    @ViewChild('myTabs') tabRef: Tabs;

    constructor(private events: Events,
                private Push: ParsePushProvider,
                private util: IonicUtilProvider,
    ) {
        this.events.subscribe('tabHome', () => setTimeout(() => this.tabRef.select(0), 100));
        this.events.subscribe('clearActivity', () => this.tabActivityBadge = 0);

        this.Push.on('activity', push => {
            console.info(push);
            push = JSON.stringify(push);
            console.log(push);
            this.util.toast(push['alert']);
            this.tabActivityBadge++;
        });

        this.Push.on('receivePN', pn => {
            console.log('push pn', JSON.stringify(pn));
        });

        this.Push.on('receivePN:activity', pn => {
            console.log('push pn activity', JSON.stringify(pn));
        });

        this.Push.on('openPN', pn => {
            console.log('push pn', JSON.stringify(pn));
        });
    }

}
