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
var UserListPage = (function () {
    function UserListPage(navCtrl, provider, translate, util) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.provider = provider;
        this.translate = translate;
        this.util = util;
        this.errorIcon = 'ios-images-outline';
        this.errorText = '';
        this.data = [];
        this.loading = true;
        this.showEmptyView = false;
        this.showErrorView = false;
        this.moreItem = false;
        this.search = '';
        this.placeholder = 'Search user';
        this.params = {
            limit: 20,
            page: 1,
            search: ''
        };
        // Translate Search Bar Placeholder
        this.translate.get(this.placeholder).subscribe(function (res) { return _this.placeholder = res; });
        this._width = this.util._widthPlatform / 3 + 'px';
    }
    UserListPage.prototype.ngOnInit = function () {
        this.feed();
    };
    UserListPage.prototype.profile = function (username) {
        this.navCtrl.push(profile_1.ProfilePage, { username: username });
    };
    UserListPage.prototype.feed = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            console.log('Load Feed', _this.params, _this.loading);
            if (_this.params.page == 1) {
                _this.data = [];
            }
            _this.provider.list(_this.params).then(function (data) {
                if (data && data.length) {
                    underscore_1.default.sortBy(data, 'createdAt').reverse().map(function (item) {
                        _this.data.push(item);
                    });
                    _this.showErrorView = false;
                    _this.showEmptyView = false;
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
    UserListPage.prototype.follow = function (user) {
        user.loading = true;
        this.provider.follow(user.userObj.id).then(function (resp) {
            console.log('Follow result', resp);
            user.isFollow = (resp === 'follow') ? true : false;
            if (resp == 'follow') {
                user.followersTotal += 1;
            }
            if (resp == 'unfollow') {
                user.followersTotal -= 1;
            }
            user.loading = false;
        });
    };
    // Search
    UserListPage.prototype.doSearch = function () {
        this.params.search = this.search;
        this.params.page = 1;
        this.feed();
    };
    UserListPage.prototype.doCancel = function () {
        this.search = '';
        this.params.page = 1;
        this.feed();
    };
    UserListPage.prototype.doInfinite = function (event) {
        this.params.page++;
        this.feed().then(function () { return event.complete(); }).catch(function () { return event.complete(); });
    };
    UserListPage.prototype.doRefresh = function (event) {
        this.data = [];
        this.params.page = 1;
        this.feed().then(function () { return event.complete(); }).catch(function () { return event.complete(); });
    };
    UserListPage.prototype.doTry = function () {
        this.loading = true;
        this.doRefresh(null);
    };
    UserListPage = __decorate([
        core_1.Component({
            selector: 'page-user-list',
            templateUrl: 'user-list.html'
        })
    ], UserListPage);
    return UserListPage;
}());
exports.UserListPage = UserListPage;
