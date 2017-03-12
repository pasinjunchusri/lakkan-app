import {NgModule, ErrorHandler} from "@angular/core";
import {CommonModule} from "@angular/common";
import {BrowserModule} from "@angular/platform-browser";
import {HttpModule} from "@angular/http";
import {IonicApp, IonicModule, IonicErrorHandler} from "ionic-angular";
import {MyApp} from "./app.component";
import {APP_PAGES, PagesModule} from "../pages/pages.module";
import {FacebookService} from "ng2-facebook-sdk";
import {PhotoCardComponent} from "../components/photo-card/photo-card";
import {ProfilePage} from "../pages/profile/profile";
import {ChatMessagePage} from "../pages/chat-message/chat-message";

@NgModule({
    declarations   : [
        MyApp,
    ],
    imports        : [
        CommonModule,
        BrowserModule,
        HttpModule,
        PagesModule,
        IonicModule.forRoot(MyApp, {}, {
            // DeepLinker
            // http://blog.ionic.io/deeplinking-in-ionic-apps/
            links: [
                {component: ProfilePage, name: 'Profile', segment: 'profile/:username'},
                {component: PhotoCardComponent, name: 'Photo', segment: 'photo/:id'},
                {component: ChatMessagePage, name: 'Chat', segment: 'chat/:id'},
            ]
        })
    ],
    exports        : [
        BrowserModule,
        HttpModule,
    ],
    entryComponents: [
        MyApp,
        APP_PAGES,
    ],
    providers      : [
        FacebookService,
        {provide: ErrorHandler, useClass: IonicErrorHandler}
    ],
    bootstrap      : [IonicApp],
})
export class AppModule {

}
