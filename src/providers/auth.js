"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('@angular/core');
var Auth = (function () {
    function Auth() {
        console.log('Hello Auth Provider');
        this.mSessionToken = Parse.User.current();
    }
    Auth.prototype.getLoggedUser = function () {
        return Parse.User.current();
    };
    Auth.prototype.setSessionToken = function (sessionToken) {
        this.mSessionToken = sessionToken;
    };
    Auth.prototype.ensureLoggedIn = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (_this.mSessionToken === null) {
                reject('Session token invalid');
            }
            if (!Parse.User.current()) {
                Parse.User.become(_this.mSessionToken).then(resolve, reject);
            }
            else {
                resolve(Parse.User.current());
            }
        });
    };
    Auth.prototype.recoverPassword = function (email) {
        return Parse.User.requestPasswordReset(email);
    };
    Auth.prototype.logIn = function (obj) {
        return Parse.User.logIn(obj.username, obj.password);
        ;
    };
    Auth.prototype.logOut = function () {
        return Parse.User.logOut();
    };
    Auth = __decorate([
        core_1.Injectable()
    ], Auth);
    return Auth;
}());
exports.Auth = Auth;
