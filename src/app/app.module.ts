import {NgModule} from '@angular/core';
import {CommonModule} from "@angular/common";
import {BrowserModule} from "@angular/platform-browser";
import {HttpModule} from "@angular/http";
import {IonicApp, IonicModule} from 'ionic-angular';

import {MyApp} from './app.component';

import {APP_PAGES, PagesModule} from "../pages/pages.module";

import {IonicImageLoader} from "ionic-image-loader";
import {FacebookService} from "ng2-facebook-sdk";
import {Storage} from "@ionic/storage";

@NgModule({
    declarations   : [
        MyApp,
    ],
    imports        : [
        CommonModule,
        BrowserModule,
        HttpModule,
        PagesModule,
        IonicImageLoader,
        IonicModule.forRoot(MyApp)
    ],
    exports        : [
        BrowserModule,
        HttpModule,
    ],
    entryComponents: [
        MyApp,
        APP_PAGES,
    ],
    providers      : [FacebookService, Storage],
    bootstrap      : [IonicApp],
})
export class AppModule {

}
