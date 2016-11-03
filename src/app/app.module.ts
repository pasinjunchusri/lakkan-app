import { IonicApp, IonicModule } from 'ionic-angular';
import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { MyApp } from './app.component';
import { APP_PAGES, PagesModule } from "../pages/pages.module";

import { TabHomePage } from "../pages/tab-home/tab-home";
import { IntroPage } from '../pages/intro/intro';
import { AuthPage } from '../pages/auth/auth';
import { TabsPage } from '../pages/tabs/tabs';
import { TabSearchPage } from '../pages/tab-search/tab-search';
import { TabAccountPage } from '../pages/tab-account/tab-account';
import { TabActivityPage } from '../pages/tab-activity/tab-activity';
import { ProfilePage } from "../pages/profile/profile";

import { HttpModule } from "@angular/http";
import { BrowserModule } from "@angular/platform-browser";


@NgModule({
    declarations: [
        MyApp,
    ],
    imports: [
        CommonModule,
        BrowserModule,
        HttpModule,
        PagesModule,
        IonicModule.forRoot(MyApp, {}, {
            links: [
                { component: AuthPage, name: 'Auth', segment: 'auth' },
                { component: IntroPage, name: 'Tabs', segment: 'intro' },
                { component: TabsPage, name: 'Intro', segment: 'tab' },
                { component: TabHomePage, name: 'Home', segment: 'home' },
                { component: TabSearchPage, name: 'Search', segment: 'search' },
                { component: TabActivityPage, name: 'Activity', segment: 'activity' },
                { component: TabAccountPage, name: 'Account', segment: 'account' },
                { component: ProfilePage, name: 'Profile', segment: 'profile' },
            ]
        })
    ],
    exports: [
        BrowserModule,
        HttpModule,
    ],
    entryComponents: [
        MyApp,
        APP_PAGES,
    ],
    providers: [],
    bootstrap: [IonicApp],
})
export class AppModule {

}
