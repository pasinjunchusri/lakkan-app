"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('@angular/core');
var auth_1 = require("../auth/auth");
var IntroPage = (function () {
    function IntroPage(navCtrl, menu, modalCtrl) {
        this.navCtrl = navCtrl;
        this.menu = menu;
        this.modalCtrl = modalCtrl;
        this.showSkip = true;
        this.device = 'android';
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
    IntroPage.prototype.startApp = function () {
        this.navCtrl.push(auth_1.AuthPage);
    };
    IntroPage.prototype.onSlideChangeStart = function (slider) {
        this.showSkip = !slider.isEnd;
    };
    IntroPage = __decorate([
        core_1.Component({
            selector: 'page-intro',
            templateUrl: 'intro.html'
        })
    ], IntroPage);
    return IntroPage;
}());
exports.IntroPage = IntroPage;
