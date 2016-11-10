"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('@angular/core');
var tab_home_1 = require("../tab-home/tab-home");
var tab_search_1 = require("../tab-search/tab-search");
var tab_activity_1 = require("../tab-activity/tab-activity");
var tab_account_1 = require("../tab-account/tab-account");
var tab_capture_share_1 = require("../tab-capture-share/tab-capture-share");
var TabsPage = (function () {
    function TabsPage(navCtrl, photoService, util) {
        this.navCtrl = navCtrl;
        this.photoService = photoService;
        this.util = util;
        // this tells the tabs component which Pages
        // should be each tab's root Page
        this.tabHome = tab_home_1.TabHomePage;
        this.tabSearch = tab_search_1.TabSearchPage;
        this.tabActivity = tab_activity_1.TabActivityPage;
        this.tabProfile = tab_account_1.TabAccountPage;
    }
    TabsPage.prototype.openCapture = function () {
        var _this = this;
        this.photoService.open().then(function (image) {
            _this.navCtrl.push(tab_capture_share_1.TabCapturSharePage, { base64: image });
        }).catch(function (error) {
            console.log(error);
            _this.util.toast(error);
        });
    };
    TabsPage = __decorate([
        core_1.Component({
            templateUrl: 'tabs.html'
        })
    ], TabsPage);
    return TabsPage;
}());
exports.TabsPage = TabsPage;
