import {NgModule} from '@angular/core';
import {IonicApp, IonicModule} from 'ionic-angular';
import {MyApp} from './app.component';
import {APP_PAGES, PagesModule} from "../pages/pages.module";
import {CommonModule} from "@angular/common";


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
    providers      : []
})
export class AppModule {
}
