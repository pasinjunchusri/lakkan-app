import {NgModule} from '@angular/core';
import {IonicApp, IonicModule} from 'ionic-angular';
import {MyApp} from './app.component';
import {AboutPage} from '../pages/about/about';
import {ContactPage} from '../pages/contact/contact';
import {HomePage} from '../pages/home/home';
import {TabsPage} from '../pages/tabs/tabs';
import {IntroPage} from "../pages/intro/intro";


@NgModule({
    declarations   : [
        MyApp,
        AboutPage,
        ContactPage,
        HomePage,
        TabsPage,
        IntroPage,
    ],
    imports        : [
        IonicModule.forRoot(MyApp)
    ],
    bootstrap      : [IonicApp],
    entryComponents: [
        MyApp,
        AboutPage,
        ContactPage,
        HomePage,
        TabsPage,
        IntroPage,
    ],
    providers      : []
})
export class AppModule {
}
