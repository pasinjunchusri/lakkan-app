"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('@angular/core');
var user_1 = require("../../providers/user");
var tabs_1 = require("../tabs/tabs");
var AuthPage = (function () {
    function AuthPage(navCtrl, User, toastCtrl, loadingCtrl) {
        this.navCtrl = navCtrl;
        this.User = User;
        this.toastCtrl = toastCtrl;
        this.loadingCtrl = loadingCtrl;
        this.authType = 'login';
        this.submitted = false;
        this.formLogin = {};
        this.formSignup = {};
    }
    AuthPage.prototype.login = function (form) {
        var _this = this;
        this.submitted = true;
        if (form.valid) {
            var loading_1 = this.loadingCtrl.create({
                content: 'Please wait...'
            });
            loading_1.present();
            this.User.signIn(this.formLogin).then(function (user) {
                console.log(user);
                loading_1.dismiss();
                _this.onPageTabs();
            }, function (error) {
                console.log(error);
                loading_1.dismiss();
                _this.onError(error);
            });
        }
    };
    AuthPage.prototype.signup = function (form) {
        var _this = this;
        this.submitted = true;
        if (form.valid) {
            var loading_2 = this.loadingCtrl.create({
                content: 'Please wait...'
            });
            loading_2.present();
            this.User.signUp(this.formSignup).then(function (user) {
                console.log(user);
                loading_2.dismiss();
                _this.onPageTabs();
            }, function (error) {
                loading_2.dismiss();
                _this.onError(error);
            });
        }
    };
    AuthPage.prototype.onError = function (error) {
        var toast = this.toastCtrl.create({
            message: error.message,
            duration: 3000,
        });
        toast.present();
    };
    AuthPage.prototype.onPageTabs = function () {
        this.navCtrl.push(tabs_1.TabsPage);
    };
    AuthPage.prototype.loginFacebook = function () {
        console.log('Facebook login');
    };
    AuthPage.prototype.signupFacebook = function () {
    };
    AuthPage = __decorate([
        core_1.Component({
            selector: 'page-auth',
            templateUrl: 'auth.html',
            providers: [user_1.User]
        })
    ], AuthPage);
    return AuthPage;
}());
exports.AuthPage = AuthPage;
