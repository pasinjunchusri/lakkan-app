"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('@angular/core');
var profile_1 = require("../profile/profile");
var underscore_1 = require('underscore');
var photo_1 = require("../photo/photo");
var TabActivityPage = (function () {
    function TabActivityPage(navCtrl, provider) {
        this.navCtrl = navCtrl;
        this.provider = provider;
        this.errorIcon = 'ios-images-outline';
        this.errorText = '';
        this.data = [];
        this.loading = true;
        this.showEmptyView = false;
        this.showErrorView = false;
        this.moreItem = false;
        this.params = {
            limit: 20,
            page: 1
        };
    }
    TabActivityPage.prototype.ngOnInit = function () {
        this.feed();
    };
    TabActivityPage.prototype.profile = function (username) {
        this.navCtrl.push(profile_1.ProfilePage, { username: username });
    };
    TabActivityPage.prototype.openPhoto = function (item) {
        console.log();
        this.navCtrl.push(photo_1.PhotoPage, { item: item.item.get('gallery') });
    };
    TabActivityPage.prototype.feed = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            console.log('Load Feed', _this.params, _this.loading);
            if (_this.params.page == 1) {
                _this.data = [];
            }
            _this.provider.feed(_this.params).then(function (data) {
                if (data && data.length) {
                    underscore_1.default.sortBy(data, 'createdAt').reverse().map(function (item) {
                        _this.data.push(item);
                    });
                    _this.moreItem = true;
                }
                else {
                    if (!_this.data.length) {
                        _this.showEmptyView = false;
                    }
                    _this.moreItem = false;
                }
                _this.loading = false;
                resolve(data);
            }, function (error) {
                _this.errorText = error.message;
                _this.showErrorView = true;
                _this.loading = false;
                reject(_this.errorText);
            });
        });
    };
    TabActivityPage.prototype.doInfinite = function (event) {
        this.params.page++;
        this.feed().then(function () { return event.complete(); }).catch(function () { return event.complete(); });
    };
    TabActivityPage.prototype.doRefresh = function (event) {
        this.data = [];
        this.params.page = 1;
        this.feed().then(function () { return event.complete(); }).catch(function () { return event.complete(); });
    };
    TabActivityPage.prototype.doTry = function () {
        this.loading = true;
        this.doRefresh(null);
    };
    TabActivityPage = __decorate([
        core_1.Component({
            selector: 'page-tab-activity',
            templateUrl: 'tab-activity.html'
        })
    ], TabActivityPage);
    return TabActivityPage;
}());
exports.TabActivityPage = TabActivityPage;
