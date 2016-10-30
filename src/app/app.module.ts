import {NgModule} from '@angular/core';
import {IonicApp, IonicModule} from 'ionic-angular';
import {CommonModule} from "@angular/common";
import {MyApp} from './app.component';
import {APP_PAGES, PagesModule} from "../pages/pages.module";


@NgModule({
    declarations   : [
        MyApp,
    ],
    imports        : [
        CommonModule,
        PagesModule,
        IonicModule.forRoot(MyApp)
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
