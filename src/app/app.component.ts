import {Component, OnInit} from "@angular/core";
import {Platform} from "ionic-angular";
import {Device, Splashscreen} from "ionic-native";
import {TabsPage} from "../pages/tabs/tabs";
import {IntroPage} from "../pages/intro/intro";
import {GOOGLE_ANALYTICS, PARSE_APP_ID, PARSE_JAVASCRIPT_KEY, PARSE_SERVER_URL} from "../config";
import {AnalyticsProvider} from "../providers/analytics.provider";
import {UserProvider} from "../providers/user.provider";
import {ExternalLibProvider} from "../providers/external-lib.provider";

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
              private lib: ExternalLibProvider,
              private User: UserProvider) {


    platform.ready().then(() => {
      // Define Facebook Browser and Native
      this.lib.initFacebook();
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      // StatusBar.styleDefault();
      Splashscreen.hide();

      // Google Analytics
      Analytics.init(GOOGLE_ANALYTICS);
      Analytics.appVersion(Device['version']);

      // Start Parse User
      if (!User.current()) {
        this.rootPage = IntroPage;
      } else {
        this.rootPage = TabsPage;
      }
    });
  }
}
