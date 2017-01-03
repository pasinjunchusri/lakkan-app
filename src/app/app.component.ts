import {Component, OnInit} from "@angular/core";
import {Platform} from "ionic-angular";
import {Splashscreen, Device} from "ionic-native";
import {TabsPage} from "../pages/tabs/tabs";
import {IntroPage} from "../pages/intro/intro";
import {PARSE_APP_ID, PARSE_SERVER_URL, GOOGLE_ANALYTICS} from "../config";
import {ParsePushProvider} from "../providers/parse-push";
import {AnalyticsProvider} from "../providers/analytics";

declare const Parse: any;

@Component({
    template: `<ion-nav [root]="rootPage" #content></ion-nav>`
})

export class MyApp implements OnInit {
    rootPage: any;

    ngOnInit() {
        Parse.initialize(PARSE_APP_ID);
        Parse.serverURL = PARSE_SERVER_URL;
    }

    constructor(private platform: Platform,
                private Push: ParsePushProvider,
                private Analytics: AnalyticsProvider,
    ) {

        platform.ready().then(() => {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            // StatusBar.styleDefault();
            Splashscreen.hide();

            // Google Analytics
            Analytics.init(GOOGLE_ANALYTICS);
            Analytics.appVersion(Device.version);

            // Start Parse User
            let user = Parse.User.current();
            console.log(user);
            if (!user) {
                this.rootPage = IntroPage;
            } else {
                this.Push.init();
                this.rootPage = TabsPage;
            }
        });
    }
}
