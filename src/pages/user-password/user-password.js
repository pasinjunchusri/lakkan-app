"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('@angular/core');
var UserPasswordPage = (function () {
    function UserPasswordPage(viewCtrl, ionicUtil, provider) {
        this.viewCtrl = viewCtrl;
        this.ionicUtil = ionicUtil;
        this.provider = provider;
        this.submitted = false;
        this.form = {
            password: '',
            changepassword: '',
            confirmpassword: '',
        };
    }
    UserPasswordPage.prototype.save = function (form) {
        var _this = this;
        this.submitted = true;
        if (form.valid) {
            this.ionicUtil.onLoading();
            this.provider.changePassword(this.form.password).then(function (user) {
                _this.ionicUtil.endLoading();
                _this.dismiss();
            });
        }
    };
    UserPasswordPage.prototype.dismiss = function () {
        this.viewCtrl.dismiss();
    };
    UserPasswordPage = __decorate([
        core_1.Component({
            selector: 'page-user-password',
            templateUrl: 'user-password.html'
        })
    ], UserPasswordPage);
    return UserPasswordPage;
}());
exports.UserPasswordPage = UserPasswordPage;
