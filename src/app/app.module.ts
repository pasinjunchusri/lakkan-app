import {NgModule} from '@angular/core';
import {IonicApp, IonicModule} from 'ionic-angular';
import {MyApp} from './app.component';
import {APP_PAGES, PagesModule} from "../pages/pages.module";
import {CommonModule} from "@angular/common";
import {User} from "../providers/user";
import {Auth} from "../providers/auth";
import {ParsePush} from "../providers/parse-push";
import {Gallery} from "../providers/gallery";
import {ParseFile} from "../providers/parse-file";


@NgModule({
    declarations   : [
        MyApp,
    ],
    imports        : [
        CommonModule,
        PagesModule,
        IonicModule.forRoot(MyApp)
    ],
    bootstrap      : [IonicApp],
    entryComponents: [
        APP_PAGES,
        MyApp
    ],
    providers      : [
        User,
        Auth,
        ParsePush,
        Gallery,
        ParseFile
    ]
})
export class AppModule {
}
