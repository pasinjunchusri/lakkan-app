import {NgModule} from '@angular/core';
import {IonicModule} from "ionic-angular";

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
];

@NgModule({
    imports     : [
        CommonModule,
        PipesModule,
        IonicModule.forRoot(TabsPage),
        IonicModule.forRoot(IntroPage),
    ],
    exports     : [
        APP_PAGES
    ],
    declarations: [
        APP_PAGES,
        Loader,

    ],
    providers   : [],
})
export class PagesModule {
}
