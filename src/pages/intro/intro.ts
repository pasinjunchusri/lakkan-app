import {Component} from '@angular/core';
import {MenuController, NavController, ModalController} from 'ionic-angular';
import {AuthPage} from "../auth/auth";

export interface Slide {
    title: string;
    image: string;
}

@Component({
    selector   : 'page-intro',
    templateUrl: 'intro.html'
})

export class IntroPage {
    slides: Slide[];
    showSkip = true;
    device   = 'android';

    constructor(public navCtrl: NavController,
                public menu: MenuController,
                public modalCtrl: ModalController
    ) {
        this.slides = [
            {
                title: 'Welcome to <b>ICA</b>',
                image: 'assets/img/intro1.png',
            },
            {
                title: 'What is Ionic?',
                image: 'assets/img/intro2.png',
            },
            {
                title: 'What is Ionic Platform?',
                image: 'assets/img/intro3.png',
            },
            {
                title: 'What is Ionic Platform?',
                image: 'assets/img/intro4.png',
            },
            {
                title: 'What is Ionic Platform?',
                image: 'assets/img/intro5.png',
            },
            {
                title: 'What is Ionic Platform?',
                image: 'assets/img/intro6.png',
            },
        ];
    }

    startApp() {
        this.navCtrl.push(AuthPage);
    }

    onSlideChangeStart(slider) {
        this.showSkip = !slider.isEnd;
    }


    ionViewDidLoad() {
        console.log('Hello TestPage Page');
    }

    ionViewDidEnter() {
        // the root left menu should be disabled on the tutorial page
        this.menu.enable(false);
    }

    ionViewWillLeave() {
        // enable the root left menu when leaving the tutorial page
        this.menu.enable(true);
    }

}
