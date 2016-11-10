"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('@angular/core');
var photo_1 = require("../../pages/photo/photo");
var tab_search_map_1 = require("../tab-search-map/tab-search-map");
var underscore_1 = require('underscore');
var TabSearchPage = (function () {
    function TabSearchPage(navCtrl, provider, util) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.provider = provider;
        this.util = util;
        this.words = '';
        this.placeholder = 'Search';
        this.params = {
            limit: 24,
            page: 1,
            words: '',
        };
        this.errorIcon = 'ios-images-outline';
        this.errorText = '';
        this.data = [];
        this.loading = true;
        this.showEmptyView = false;
        this.showErrorView = false;
        this.moreItem = false;
        // Translate Search Bar Placeholder
        this.util.translate('Search').then(function (res) { return _this.placeholder = res; });
        this._width = this.util._widthPlatform / 3 + 'px';
        this.feed();
    }
    TabSearchPage.prototype.openSearchMap = function () {
        this.navCtrl.push(tab_search_map_1.TabSearchMapPage);
    };
    TabSearchPage.prototype.openPhoto = function (item) {
        this.navCtrl.push(photo_1.PhotoPage, { item: item });
    };
    TabSearchPage.prototype.feed = function () {
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
                _this.errorText = error.message;
                _this.showErrorView = true;
                _this.loading = false;
                reject(_this.errorText);
            });
        });
    };
    TabSearchPage.prototype.doSearch = function () {
        this.params.words = this.words;
        this.params.page = 1;
        this.feed();
    };
    TabSearchPage.prototype.doCancel = function () {
        this.words = '';
        this.params.page = 1;
        this.feed();
    };
    TabSearchPage.prototype.doInfinite = function (event) {
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
    TabSearchPage.prototype.doRefresh = function (event) {
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
    TabSearchPage.prototype.doTry = function () {
        this.loading = true;
        this.doRefresh(null);
    };
    TabSearchPage = __decorate([
        core_1.Component({
            selector: 'page-tab-search',
            templateUrl: 'tab-search.html'
        })
    ], TabSearchPage);
    return TabSearchPage;
}());
exports.TabSearchPage = TabSearchPage;
