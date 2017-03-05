import {Component, OnInit} from "@angular/core";
import {Platform} from "ionic-angular";
import {Splashscreen} from "@ionic-native/splashscreen";
import {Device} from "@ionic-native/device";
import {TabsPage} from "../pages/tabs/tabs";
import {IntroPage} from "../pages/intro/intro";
import {PARSE_APP_ID, PARSE_SERVER_URL, GOOGLE_ANALYTICS, PARSE_JAVASCRIPT_KEY} from "../config";
import {AnalyticsProvider} from "../providers/analytics.provider";
import {UserProvider} from "../providers/user.provider";

declare const Parse: any;

@Component({
    template: `<ion-nav [root]="rootPage" #content></ion-nav>`
})

export class MyApp implements OnInit {
    rootPage: any;

    ngOnInit() {
        Parse.initialize(PARSE_APP_ID, PARSE_JAVASCRIPT_KEY);
        Parse.serverURL = PARSE_SERVER_URL;
    }

    constructor(private platform: Platform,
                private Analytics: AnalyticsProvider,
                private User: UserProvider) {

        platform.ready().then(() => {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            // StatusBar.styleDefault();
            Splashscreen.hide();

            // Google Analytics
            Analytics.init(GOOGLE_ANALYTICS);
            Analytics.appVersion(Device.version);

            // Start Parse User
            if (!User.current()) {
                this.rootPage = IntroPage;
            } else {
                this.rootPage = TabsPage;
            }
        });
    }
}
