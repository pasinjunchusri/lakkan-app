import {Component} from '@angular/core';
import {Platform} from 'ionic-angular';
import {StatusBar, Splashscreen} from 'ionic-native';

import {IntroPage} from "../pages/intro/intro";


@Component({
    template: `<ion-nav [root]="rootPage" #content></ion-nav>`
})
export class MyApp {
    rootPage = IntroPage;

    constructor(platform: Platform) {
        platform.ready().then(() => {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            StatusBar.styleDefault();
            Splashscreen.hide();
        });
    }
}
