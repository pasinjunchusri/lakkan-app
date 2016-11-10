"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('@angular/core');
var tabs_1 = require("../tabs/tabs");
var ionic_native_1 = require('ionic-native');
var user_avatar_1 = require("../user-avatar/user-avatar");
var AuthPage = (function () {
    function AuthPage(navCtrl, provider, alertCtrl, util, fb) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.provider = provider;
        this.alertCtrl = alertCtrl;
        this.util = util;
        this.fb = fb;
        this.authType = 'login';
        this.submitted = false;
        this.formLogin = {};
        this.formSignup = {};
        this.alertTranslate = {};
        this.cordova = false;
        // Define Facebook Browser and Native
        this.facebookNative = ionic_native_1.Facebook;
        this.facebookBrowser = fb;
        this.cordova = this.util.cordova;
        // For Ionic View
        this.facebook = this.facebookBrowser;
        // For Native and Browser
        //this.facebook        = this.cordova ? this.facebookNative : this.facebookBrowser;
        this.formSignup.gender = 'male';
        // Translate Search Bar Placeholder
        this.util.translate('Enter your email so we can send you a link to reset your password').then(function (res) { _this.alertTranslate.message = res; });
        this.util.translate('Open your email and also check the spam box').then(function (res) { _this.alertTranslate.emailRecoverySend = res; });
        this.util.translate('Email is required').then(function (res) { _this.alertTranslate.emailRequired = res; });
        this.util.translate('Recovery your password').then(function (res) { _this.alertTranslate.title = res; });
        this.util.translate('Email').then(function (res) { _this.alertTranslate.email = res; });
        this.util.translate('Cancel').then(function (res) { _this.alertTranslate.cancel = res; });
        this.util.translate('Submit').then(function (res) { _this.alertTranslate.submit = res; });
    }
    AuthPage.prototype.login = function (form) {
        var _this = this;
        this.submitted = true;
        if (form.valid) {
            this.util.onLoading();
            this.provider.signIn(this.formLogin).then(function (user) {
                console.log(user);
                console.log(_this.provider.current());
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
        console.log(form, this.formSignup);
        this.submitted = true;
        if (form.valid) {
            this.util.onLoading();
            this.provider.signUp(this.formSignup).then(function (user) {
                console.log(user);
                _this.provider.current = user;
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
        var _this = this;
        this.util.onLoading();
        this.facebook.getLoginStatus().then(function (response) {
            console.log('getLoginStatus', response);
            if (response.status === 'connected') {
                console.log(1);
                _this.processFacebookLogin(response);
            }
            else {
                console.log(2);
                _this.facebook.login(['public_profile']).then(function (authData) {
                    console.log('facebook login', authData);
                    _this.processFacebookLogin(authData);
                });
            }
        });
    };
    AuthPage.prototype.processFacebookLogin = function (fbAuthData) {
        var _this = this;
        //this.facebook.api('/me?fields=name,birthday,gender,email')
        var fbData, newUser;
        this
            .facebook.api('/me?fields=name,birthday,gender,email')
            .then(function (data) {
            fbData = data;
            console.log('fData', data);
            return _this.provider.findByEmail(data.email);
        })
            .then(function (user) {
            console.log('user', user);
            if (!user.id) {
                newUser = true;
                return _this.provider.signInViaFacebook(fbAuthData);
            }
            var authData = user.get('authData');
            console.log('authData', authData);
            if (authData) {
                if (authData.facebook.id === fbData.id) {
                    return _this.provider.signInViaFacebook(fbAuthData);
                }
            }
            else {
                console.log(authData, user);
                return Promise.reject('error');
            }
        })
            .then(function () { return _this.provider.updateWithFacebookData(fbData); })
            .then(function (user) {
            //$rootScope.currentUser = user;
            //$rootScope.$broadcast('onUserLogged');
            //Loading.end();
            if (newUser) {
                //$state.go('avatar', {clear: true})
                //this.navCtrl
                _this.navCtrl.push(user_avatar_1.UserAvatarPage);
            }
            else {
                //$state.go(AppConfig.routes.home, {clear: true});
                _this.navCtrl.push(tabs_1.TabsPage);
            }
            _this.util.endLoading();
        }, function (error) {
            //Loading.end();
            //Dialog.alert(error);
            _this.util.toast(error.message);
            _this.util.endLoading();
        });
    };
    AuthPage.prototype.resetPass = function () {
        var _this = this;
        this.alertCtrl.create({
            title: this.alertTranslate.title,
            message: this.alertTranslate.message,
            inputs: [
                {
                    placeholder: this.alertTranslate.email,
                    name: 'email',
                    type: 'email'
                }
            ],
            buttons: [
                {
                    text: this.alertTranslate.cancel,
                    role: 'cancel'
                },
                {
                    text: this.alertTranslate.submit,
                    handler: function (data) {
                        if (data.email) {
                            _this.util.onLoading();
                            _this.provider.recoverPassword(data.email).then(function (result) {
                                console.log(result);
                                setTimeout(function () {
                                    _this.util.endLoading();
                                    _this.util.toast(_this.alertTranslate.emailRecoverySend);
                                }, 500);
                                return false;
                            });
                        }
                        else {
                            _this.util.toast(_this.alertTranslate.emailRequired);
                        }
                    }
                }
            ]
        }).present();
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
