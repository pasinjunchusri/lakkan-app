import {NgModule} from '@angular/core';
import {IonicModule} from "ionic-angular";
import {TranslateModule, TranslateLoader, TranslateStaticLoader} from 'ng2-translate';
import {Http, HttpModule} from "@angular/http";

// Pages
import {TabsPage} from '../pages/tabs/tabs';
import {TabHomePage} from "../pages/tab-home/tab-home";
import {TabSearchPage} from "../pages/tab-search/tab-search";
import {TabSharePage} from "../pages/tab-share/tab-share";
import {TabActivityPage} from "../pages/tab-activity/tab-activity";
import {TabProfilePage} from "../pages/tab-profile/tab-profile";

import {IntroPage} from "../pages/intro/intro";
import {AuthPage} from "./auth/auth";
import {UserForgotPage} from "../pages/user-forgot/user-forgot";
import {CommonModule} from "@angular/common";

// Components
import {Loader} from "../components/loader/loader";

// Pipes
import {PipesModule} from "../pipes/pipes.module";

// Providers
import {Gallery} from "../providers/gallery";
import {Auth} from "../providers/auth";
import {GalleryActivity} from "../providers/gallery-activity";
import {ParseFile} from "../providers/parse-file";
import {ParsePush} from "../providers/parse-push";
import {User} from "../providers/user";
import {PhotoList} from "../components/photo-list/photo-list";
import {BrowserModule} from "@angular/platform-browser";

export const APP_PAGES = [
    IntroPage,
    UserForgotPage,
    AuthPage,
    TabsPage,
    TabHomePage,
    TabSearchPage,
    TabSharePage,
    TabActivityPage,
    TabProfilePage,
    PhotoList
];

@NgModule({
    imports     : [
        CommonModule,
        BrowserModule,
        HttpModule,
        PipesModule,
        TranslateModule.forRoot({
            provide   : TranslateLoader,
            useFactory: (http: Http) => new TranslateStaticLoader(http, '/assets/i18n', '.json'),
            deps      : [Http]
        }),
        IonicModule.forRoot(TabsPage),
        IonicModule.forRoot(IntroPage),
    ],
    exports     : [
        APP_PAGES,
        BrowserModule,
        HttpModule,
        TranslateModule
    ],
    declarations: [
        APP_PAGES,
        Loader,
    ],
    providers   : [
        Auth,
        User,
        Gallery,
        GalleryActivity,
        ParseFile,
        ParsePush,
    ],
})
export class PagesModule {
}
