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
var photo_share_modal_1 = require("../../components/photo-share-modal/photo-share-modal");
var TabsPage = (function () {
    function TabsPage(PhotoService, platform, modalCtrl) {
        this.PhotoService = PhotoService;
        this.platform = platform;
        this.modalCtrl = modalCtrl;
        // this tells the tabs component which Pages
        // should be each tab's root Page
        this.tabHome = tab_home_1.TabHomePage;
        this.tabSearch = tab_search_1.TabSearchPage;
        this.tabActivity = tab_activity_1.TabActivityPage;
        this.tabProfile = tab_account_1.TabAccountPage;
    }
    TabsPage.prototype.openCapture = function () {
        console.log('Capture');
        //this.PhotoService.open();
        this.modalCtrl.create(photo_share_modal_1.PhotoShareModal).present();
    };
    TabsPage = __decorate([
        core_1.Component({
            templateUrl: 'tabs.html'
        })
    ], TabsPage);
    return TabsPage;
}());
exports.TabsPage = TabsPage;
