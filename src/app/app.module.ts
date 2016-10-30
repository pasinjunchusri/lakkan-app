import {IonicApp, IonicModule} from 'ionic-angular';
import {NgModule} from '@angular/core';
import {CommonModule} from "@angular/common";
import {MyApp} from './app.component';
import {APP_PAGES, PagesModule} from "../pages/pages.module";

import {TabHomePage} from "../pages/tab-home/tab-home";
import {IntroPage} from '../pages/intro/intro';
import {AuthPage} from '../pages/auth/auth';
import {TabsPage} from '../pages/tabs/tabs';
import {TabSearchPage} from '../pages/tab-search/tab-search';
import {TabAccountPage} from '../pages/tab-account/tab-account';
import {TabActivityPage} from '../pages/tab-activity/tab-activity';

@NgModule({
    declarations   : [
        MyApp,
    ],
    imports        : [
        CommonModule,
        PagesModule,
        IonicModule.forRoot(MyApp, {}, {
            links: [
                {component: AuthPage, name: 'Auth', segment: 'auth'},
                {component: TabsPage, name: 'Intro', segment: 'intro'},
                {component: IntroPage, name: 'Tabs', segment: 'tab'},
                {component: TabHomePage, name: 'Home', segment: 'home'},
                {component: TabSearchPage, name: 'Search', segment: 'search'},
                {component: TabActivityPage, name: 'Activity', segment: 'activity'},
                {component: TabAccountPage, name: 'Account', segment: 'account'},
            ]
        })
    ],
    entryComponents: [
        APP_PAGES,
        MyApp
    ],
    providers      : [],
    bootstrap      : [IonicApp],
})
export class AppModule {
}
