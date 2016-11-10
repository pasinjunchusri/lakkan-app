"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('@angular/core');
var user_list_1 = require("../user-list/user-list");
var underscore_1 = require('underscore');
var TabHomePage = (function () {
    function TabHomePage(navCtrl, provider, events, ParseUtil) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.provider = provider;
        this.events = events;
        this.ParseUtil = ParseUtil;
        this.params = {
            limit: 14,
            page: 1,
            privacity: 'public'
        };
        this.privacity = 'public';
        this.errorIcon = 'ios-images-outline';
        this.errorText = '';
        this.data = [];
        this.loading = true;
        this.showEmptyView = false;
        this.showErrorView = false;
        this.moreItem = false;
        this.address = {
            place: ''
        };
        events.subscribe('home:reload', function () { return _this.doRefresh(null); });
    }
    TabHomePage.prototype.ngOnInit = function () {
        this.feed();
    };
    TabHomePage.prototype.selectType = function (privacity) {
        this.params.page = 1;
        this.privacity = privacity;
        this.params.privacity = privacity;
        this.loading = true;
        this.feed();
    };
    TabHomePage.prototype.onPageUsers = function () {
        this.navCtrl.push(user_list_1.UserListPage);
    };
    TabHomePage.prototype.feed = function () {
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
                _this.ParseUtil.error(error);
                _this.errorText = error.message;
                _this.showErrorView = true;
                _this.loading = false;
                reject(_this.errorText);
            });
        });
    };
    TabHomePage.prototype.doInfinite = function (event) {
        this.params.page++;
        this.feed().then(function () {
            if (event) {
                event.complete();
            }
        }).catch(function () {
            if (event) {
                event.complete();
            }
        });
    };
    TabHomePage.prototype.doRefresh = function (event) {
        this.data = [];
        this.params.page = 1;
        this.feed().then(function () {
            if (event) {
                event.complete();
            }
        }).catch(function () {
            if (event) {
                event.complete();
            }
        });
    };
    TabHomePage.prototype.doTry = function () {
        this.loading = true;
        this.doRefresh(null);
    };
    TabHomePage = __decorate([
        core_1.Component({
            selector: 'page-tab-home',
            templateUrl: 'tab-home.html',
        })
    ], TabHomePage);
    return TabHomePage;
}());
exports.TabHomePage = TabHomePage;
