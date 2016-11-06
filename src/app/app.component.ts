import {Component, OnInit} from '@angular/core';
import {Platform} from 'ionic-angular';
import {Splashscreen} from 'ionic-native';

import {TabsPage} from "../pages/tabs/tabs";
import {IntroPage} from "../pages/intro/intro";

import {PARSE_APP_ID, PARSE_SERVER_URL} from "../config";
import {ImageLoaderConfig} from "ionic-image-loader";


@Component({
    template: `<ion-nav [root]="rootPage" #content></ion-nav>`
})

export class MyApp implements OnInit {
    rootPage: any;

    ngOnInit() {
        Parse.initialize(PARSE_APP_ID);
        Parse.serverURL = PARSE_SERVER_URL;
    }

    constructor(platform: Platform,
                imageLoaderConfig: ImageLoaderConfig
    ) {


        // Image Cache
        // enable debug mode to get console errors/warnings/logs
        // this could be useful while trying to debug issues with the component
        imageLoaderConfig.enableDebugMode();

        // disable spinners by default, you can add [spinner]="true" to a specific component instance later on to override this
        imageLoaderConfig.enableSpinner(true);

        platform.ready().then(() => {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            // StatusBar.styleDefault();
            Splashscreen.hide();

            console.log(Parse.User.current());
            if (!Parse.User.current()) {
                this.rootPage = IntroPage;
            } else {
                this.rootPage = TabsPage;
            }
        });
    }
}
