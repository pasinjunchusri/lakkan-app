import {NgModule} from '@angular/core';
import {TabsPage} from '../pages/tabs/tabs';
import {TabHomePage} from "../pages/tab-home/tab-home";
import {TabSearchPage} from "../pages/tab-search/tab-search";
import {TabSharePage} from "../pages/tab-share/tab-share";
import {TabActivityPage} from "../pages/tab-activity/tab-activity";
import {TabProfilePage} from "../pages/tab-profile/tab-profile";

import {IntroPage} from "../pages/intro/intro";
import {UserLoginPage} from "../pages/user-login/user-login";
import {UserRegisterPage} from "../pages/user-register/user-register";
import {UserForgotPage} from "../pages/user-forgot/user-forgot";
import {CommonModule} from "@angular/common";
import {PipesModule} from "../pipes/pipes.module";
import {Auth} from "../providers/auth";
import {Loader} from "../components/loader/loader";
import {IonicModule} from "ionic-angular";

export const APP_PAGES = [
    IntroPage,
    UserLoginPage,
    UserRegisterPage,
    UserForgotPage,

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
    providers   : [
        Auth
    ],
})
export class PagesModule {
}
