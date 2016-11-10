"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('@angular/core');
var intro_1 = require("../intro/intro");
var user_password_1 = require("../user-password/user-password");
var account_edit_modal_1 = require("../account-edit-modal/account-edit-modal");
var about_1 = require("../about/about");
var language_modal_1 = require("../../components/language-modal/language-modal");
var TabAccountSettingsPage = (function () {
    function TabAccountSettingsPage(Auth, app, modalCtrl, util) {
        this.Auth = Auth;
        this.app = app;
        this.modalCtrl = modalCtrl;
        this.util = util;
    }
    TabAccountSettingsPage.prototype.aboutPage = function () {
        this.modalCtrl.create(about_1.AboutPage).present();
    };
    TabAccountSettingsPage.prototype.modalLanguage = function () {
        this.modalCtrl.create(language_modal_1.LanguageModalComponent).present();
    };
    TabAccountSettingsPage.prototype.href = function (url) {
        this.util.href(url);
    };
    TabAccountSettingsPage.prototype.changePassword = function () {
        this.modalCtrl.create(user_password_1.UserPasswordPage).present();
    };
    TabAccountSettingsPage.prototype.editModal = function () {
        this.modalCtrl.create(account_edit_modal_1.AccountEditModalPage).present();
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
