"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('@angular/core');
var AboutPage = (function () {
    function AboutPage(viewCtrl) {
        this.viewCtrl = viewCtrl;
    }
    AboutPage.prototype.ionViewDidLoad = function () {
        console.log('Hello AboutPage Page');
    };
    AboutPage.prototype.dismiss = function () {
        this.viewCtrl.dismiss();
    };
    AboutPage = __decorate([
        core_1.Component({
            selector: 'page-about',
            templateUrl: 'about.html'
        })
    ], AboutPage);
    return AboutPage;
}());
exports.AboutPage = AboutPage;
