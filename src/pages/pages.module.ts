import {NgModule} from '@angular/core';
import {IonicModule} from "ionic-angular";
import {HttpModule} from "@angular/http";
import {BrowserModule} from "@angular/platform-browser";
import {CommonModule} from "@angular/common";

import {TranslateModule} from 'ng2-translate';
import {IonicImageLoader} from "ionic-image-loader";

// Pipes
import {PipesModule} from "../pipes/pipes.module";

// Providers
import {ProvidersModule} from "../providers/providers.module";

// Pages
import {TabsPage} from '../pages/tabs/tabs';
import {TabHomePage} from "../pages/tab-home/tab-home";
import {TabSearchPage} from "../pages/tab-search/tab-search";
import {TabSharePage} from "../pages/tab-share/tab-share";
import {TabActivityPage} from "../pages/tab-activity/tab-activity";
import {IntroPage} from "../pages/intro/intro";
import {AuthPage} from "./auth/auth";
import {UserForgotPage} from "../pages/user-forgot/user-forgot";
import {TabAccountPage} from "./tab-account/tab-account";
import {TabAccountPopoverPage} from "./tab-account-popover/tab-account-popover";
import {AccountEditModal} from "./account-edit-modal/account-edit-modal";
import {TabAccountSettingsPage} from "./tab-account-settings/tab-account-settings";
import {Loader} from "../components/loader/loader";
import {PhotoCommentModal} from "../components/photo-comment-modal/photo-comment-modal";
import {PhotoFeedbackModal} from "../components/photo-feedback-modal/photo-feedback-modal";
import {PhotoGrid} from "../components/photo-grid/photo-grid";
import {PhotoList} from "../components/photo-list/photo-list";
import {PhotoCard} from "../components/photo-card/photo-card";
import {PhotoPage} from "./photo/photo";
import {UserPage} from "./user/user";

export const APP_PAGES = [
    IntroPage,
    UserForgotPage,
    AuthPage,
    TabsPage,
    TabHomePage,
    TabSearchPage,
    TabSharePage,
    TabActivityPage,
    TabAccountPage,
    TabAccountPopoverPage,
    TabAccountSettingsPage,
    AccountEditModal,
    PhotoPage,
    UserPage,

    // Components
    Loader,
    PhotoCommentModal,
    PhotoFeedbackModal,
    PhotoGrid,
    PhotoList,
    PhotoCard,
];

@NgModule({
    imports     : [
        CommonModule,
        BrowserModule,
        HttpModule,
        PipesModule,
        ProvidersModule,
        IonicImageLoader,
        TranslateModule.forRoot(),
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
    ],
    providers   : []
})
export class PagesModule {
}
