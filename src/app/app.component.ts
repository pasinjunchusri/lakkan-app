import {Component} from '@angular/core';
import {Platform} from 'ionic-angular';
import {StatusBar, Splashscreen} from 'ionic-native';

import {TabsPage} from "../pages/tabs/tabs";
import {IntroPage} from "../pages/intro/intro";

export const parseServer = {
    appId    : 'myAppId',
    serverUrl: 'https://photogram.codevibe.io/parse'
};

declare var Parse: any;

@Component({
    template: `<ion-nav [root]="rootPage" #content></ion-nav>`
})

export class MyApp {
    rootPage: any;

    ngOnInit() {
        Parse.initialize(parseServer.appId);
        Parse.serverURL = parseServer.serverUrl;
    }

    constructor(platform: Platform) {

        platform.ready().then(() => {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            StatusBar.styleDefault();
            Splashscreen.hide();

            console.log(Parse.User.current());
            if (!Parse.User.current()) {
                this.rootPage = IntroPage;
            } else {
                this.rootPage= TabsPage;
            }
        });
    }
}
