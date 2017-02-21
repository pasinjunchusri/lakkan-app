import {TermsPage} from "./../terms/terms";
import {AuthRegisterPage} from "./../auth-register/auth-register";
import {AuthLoginPage} from "./../auth-login/auth-login";
import {Component} from "@angular/core";
import {MenuController, NavController, ModalController} from "ionic-angular";
import {LanguageModalComponent} from "../../components/language-modal/language-modal";
import {AnalyticsProvider} from "../../providers/analytics.provider";
const SLIDES = require('./intro.slides').SLIDES;

@Component({
    selector   : 'page-intro',
    templateUrl: 'intro.html'
})

export class IntroPage {
    slides: any;
    showSkip = true;
    device   = 'android';

    constructor(public navCtrl: NavController,
                public menu: MenuController,
                public modalCtrl: ModalController,
                private analytics: AnalyticsProvider,
    ) {
        // Google Analytics
        this.analytics.view('IntroPage');
        this.slides = SLIDES;
    }

    modalLanguage(): void {
        this.modalCtrl.create(LanguageModalComponent).present();
    }

    onSkip(slide) {
        slide.slideTo(this.slides.length + 1, 1000)
    }

    onLogin() {
        this.navCtrl.push(AuthLoginPage);
    }

    onRegister() {
        this.navCtrl.push(AuthRegisterPage);
    }

    onTerms() {
        this.navCtrl.push(TermsPage);
    }

    onSlideChangeStart(event) {
        console.log(event);
    }

}
