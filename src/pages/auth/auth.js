"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('@angular/core');
var tabs_1 = require("../tabs/tabs");
var AuthPage = (function () {
    function AuthPage(navCtrl, User, alertCtrl, util) {
        this.navCtrl = navCtrl;
        this.User = User;
        this.alertCtrl = alertCtrl;
        this.util = util;
        this.authType = 'login';
        this.submitted = false;
        this.formLogin = {};
        this.formSignup = {};
    }
    AuthPage.prototype.login = function (form) {
        var _this = this;
        this.submitted = true;
        if (form.valid) {
            this.util.onLoading();
            this.User.signIn(this.formLogin).then(function (user) {
                console.log(user);
                _this.util.endLoading();
                _this.onPageTabs();
            }, function (error) {
                console.log(error);
                _this.util.endLoading();
                _this.util.toast(error.message);
            });
        }
    };
    AuthPage.prototype.signup = function (form) {
        var _this = this;
        this.submitted = true;
        if (form.valid) {
            this.util.onLoading();
            this.User.signUp(this.formSignup).then(function (user) {
                console.log(user);
                _this.util.endLoading();
                _this.onPageTabs();
            }, function (error) {
                _this.util.endLoading();
                _this.util.toast(error.message);
            });
        }
    };
    AuthPage.prototype.onPageTabs = function () {
        this.navCtrl.push(tabs_1.TabsPage);
    };
    AuthPage.prototype.loginFacebook = function () {
        console.log('Facebook login');
    };
    AuthPage.prototype.signupFacebook = function () {
    };
    AuthPage.prototype.resetPass = function () {
        var _this = this;
        var alert = this.alertCtrl.create({
            title: 'Recovery your password',
            message: 'Enter your email so we can send you a link to reset your password',
            inputs: [
                {
                    name: 'email',
                    placeholder: 'Email',
                    type: 'email'
                }
            ],
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel'
                },
                {
                    text: 'Submit',
                    handler: function (data) {
                        _this.User.recoverPassword(data.email).then(function (result) {
                            console.log(result);
                            return false;
                        });
                    }
                }
            ]
        });
        alert.present();
    };
    AuthPage = __decorate([
        core_1.Component({
            selector: 'page-auth',
            templateUrl: 'auth.html'
        })
    ], AuthPage);
    return AuthPage;
}());
exports.AuthPage = AuthPage;
