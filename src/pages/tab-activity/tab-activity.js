"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('@angular/core');
var profile_1 = require("../profile/profile");
var TabActivityPage = (function () {
    function TabActivityPage(navCtrl, provider) {
        this.navCtrl = navCtrl;
        this.provider = provider;
        this.data = [];
        this.moreItem = true;
        this.loading = true;
        this.type = 'you';
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
    TabActivityPage.prototype.selectType = function (type) {
        this.type = type;
    };
    TabActivityPage.prototype.feed = function () {
        var _this = this;
        console.log('Load Feed', this.params);
        return new Promise(function (resolve, reject) {
            _this.loading = true;
            _this.provider.feed(_this.params).then(function (data) {
                if (data && data.length) {
                    data.map(function (item) {
                        _this.data.push(item);
                    });
                }
                else {
                    _this.moreItem = false;
                }
                _this.loading = false;
                resolve();
            });
        });
    };
    TabActivityPage.prototype.doInfinite = function (event) {
        if (!this.loading) {
            this.params.page++;
            this.feed().then(function () { return event.complete(); });
        }
    };
    TabActivityPage.prototype.doRefresh = function (event) {
        if (!this.loading) {
            this.data = [];
            this.params.page = 1;
            this.feed().then(function () { return event.complete(); });
        }
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
