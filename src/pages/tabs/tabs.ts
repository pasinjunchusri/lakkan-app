import {Component, ViewChild} from "@angular/core";
import {TabHomePage} from "../tab-home/tab-home";
import {TabSearchPage} from "../tab-search/tab-search";
import {TabCapturePage} from "../tab-capture/tab-capture";
import {TabActivityPage} from "../tab-activity/tab-activity";
import {TabAccountPage} from "../tab-account/tab-account";
import {Tabs, Events} from "ionic-angular";

declare const Parse: any;

@Component({
    selector:    'page-tabs',
    templateUrl: 'tabs.html'
})

export class TabsPage {
    // this tells the tabs component which Pages
    // should be each tab's root Page
    tabHome: any = TabHomePage;
    tabSearch: any = TabSearchPage;
    tabCapture: any = TabCapturePage;
    tabActivity: any = TabActivityPage;
    tabProfile: any = TabAccountPage;

    query: any;

    tabActivityBadge: number = 0;

    @ViewChild('myTabs') tabRef: Tabs;

    constructor(private events: Events) {
        this.events.subscribe('tabHome', () => setTimeout(() => this.tabRef.select(0), 100));
        this.events.subscribe('clearActivity', () => this.tabActivityBadge = 0);

        // Activities for User
        let chatMessage = Parse.Object.extend('GalleryActivity');
        this.query = new Parse.Query(chatMessage)
            .equalTo('toUser', Parse.User.current())
            .equalTo('isRead', false);
        // count activity
        this.query.count().then(tabCount => this.tabActivityBadge = tabCount);
        // subscribe activity
        this.query.subscribe().on('create', activity => this.tabActivityBadge++);
    }

}
