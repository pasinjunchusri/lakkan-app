import {Component} from '@angular/core';
import {MenuController, NavController, ModalController} from 'ionic-angular';
import {AuthPage} from "../auth/auth";
import {LanguageModalComponent} from "../../components/language-modal/language-modal";

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
                title: 'Share more incredible moments',
                image: 'assets/img/intro1.png',
            },
            {
                title: 'Follow your friends and relive your moments',
                image: 'assets/img/intro2.png',
            },
            {
                title: 'Find people around you and enjoy your photos',
                image: 'assets/img/intro3.png',
            },
            {
                title: 'Share Photo with Albums',
                image: 'assets/img/intro4.png',
            },
            {
                title: 'Add location in your photos and mention your friends',
                image: 'assets/img/intro5.png',
            },
            {
                title: 'Review and like photos of your friends',
                image: 'assets/img/intro6.png',
            },
        ];
    }

    modalLanguage(): void {
        this.modalCtrl.create(LanguageModalComponent).present();
    }

    startApp(): void {
        this.navCtrl.push(AuthPage);
    }

    onSlideChangeStart(slider) {
        this.showSkip = !slider.isEnd;
    }

}
