"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('@angular/core');
var intro_1 = require("../intro/intro");
/*
 Generated class for the TabAccountSettings page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
var TabAccountSettingsPage = (function () {
    function TabAccountSettingsPage(navCtrl, Auth, app) {
        this.navCtrl = navCtrl;
        this.Auth = Auth;
        this.app = app;
    }
    TabAccountSettingsPage.prototype.ionViewDidLoad = function () {
        console.log('Hello TabAccountSettings Page');
    };
    TabAccountSettingsPage.prototype.logout = function () {
        this.Auth.logout();
        this.app.getRootNav().setRoot(intro_1.IntroPage);
    };
    TabAccountSettingsPage = __decorate([
        core_1.Component({
            selector: 'page-tab-account-settings',
            templateUrl: 'tab-account-settings.html'
        })
    ], TabAccountSettingsPage);
    return TabAccountSettingsPage;
}());
exports.TabAccountSettingsPage = TabAccountSettingsPage;
