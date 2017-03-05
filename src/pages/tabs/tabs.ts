import {Component, ViewChild} from "@angular/core";
import {TabHomePage} from "../tab-home/tab-home";
import {TabSearchPage} from "../tab-search/tab-search";
import {TabCapturePage} from "../tab-capture/tab-capture";
import {TabActivityPage} from "../tab-activity/tab-activity";
import {TabAccountPage} from "../tab-account/tab-account";
import {NativeAudio} from "@ionic-native/native-audio";
import {Tabs, Events} from "ionic-angular";
import {IonicUtilProvider} from "../../providers/ionic-util.provider";

declare const Parse: any;

@Component({
    selector   : 'page-tabs',
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

    query: any;

    tabActivityBadge: number = 0;

    @ViewChild('myTabs') tabRef: Tabs;

    constructor(private events: Events,
                private util: IonicUtilProvider) {
        this.events.subscribe('tabHome', () => setTimeout(() => this.tabRef.select(0), 100));
        this.events.subscribe('clearActivity', () => this.tabActivityBadge = 0);

        NativeAudio.preloadSimple('activity', 'assets/beep.mp3')
            .then(() => console.log('Audio ok'))
            .catch(console.log);

        // Activities for User
        let chatMessage = Parse.Object.extend('GalleryActivity');
        this.query      = new Parse.Query(chatMessage)
            .equalTo('toUser', Parse.User.current())
            .equalTo('isRead', false);
        // count activity
        this.query.count().then(
            tabCount => this.tabActivityBadge = tabCount);
        // subscribe activity
        this.query.subscribe().on('create',
            activity => {
                NativeAudio.play('activity');
                this.util.toast(activity.get('fromUser').get('name') + ' ' + activity.get('action'))
                this.tabActivityBadge++
            });
    }

}
