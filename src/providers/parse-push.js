"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('@angular/core');
var ParsePush = (function () {
    function ParsePush() {
    }
    ParsePush.prototype.init = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (ParsePushPlugin) {
                ParsePushPlugin.getInstallationId(function (id) {
                    console.log("device installationId: " + id);
                    _this.subscribeUser();
                    resolve(id);
                }, function (e) {
                    console.log('error', e);
                    reject(e);
                });
            }
            else {
                reject('Not Parse Push');
            }
        });
    };
    ParsePush.prototype.getSubscriptions = function () {
        return new Promise(function (resolve, reject) {
            ParsePushPlugin.getSubscriptions(function (subscriptions) {
                console.log(subscriptions);
                resolve(subscriptions);
            }, function (e) {
                console.log('error', e);
                reject(e);
            });
        });
    };
    ParsePush.prototype.subscribeUser = function () {
        return new Promise(function (resolve, reject) {
            var user = Parse.User.current();
            if (ParsePushPlugin && user) {
                ParsePushPlugin.subscribe(user['username']);
            }
            else {
                reject('Not device');
            }
        });
    };
    ParsePush.prototype.on = function (event, callback) {
        if (ParsePushPlugin) {
            this.on(event, callback);
        }
    };
    ParsePush.prototype.subscribe = function (channel) {
        return new Promise(function (resolve, reject) {
            if (ParsePushPlugin) {
                ParsePushPlugin.subscribe(channel, function (resp) {
                    console.log('Subcribe in channel', channel);
                    resolve(resp);
                }, function (err) {
                    console.log('Not Subcribe in channel', channel);
                    reject(err);
                });
            }
        });
    };
    ParsePush.prototype.unsubscribe = function (channel) {
        return new Promise(function (resolve, reject) {
            if (ParsePushPlugin) {
                ParsePushPlugin.unsubscribe(channel, function (resp) {
                    console.log('Unsubcribe in channel', channel);
                    resolve(resp);
                }, function (err) {
                    console.log('Not Unsubcribe in channel', channel);
                    reject(err);
                });
            }
            else {
                reject();
            }
        });
    };
    ParsePush = __decorate([
        core_1.Injectable()
    ], ParsePush);
    return ParsePush;
}());
exports.ParsePush = ParsePush;
