"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('@angular/core');
var TabSearchPage = (function () {
    function TabSearchPage(navCtrl, provider) {
        this.navCtrl = navCtrl;
        this.provider = provider;
        this.sendParams = new core_1.EventEmitter();
        this.data = [];
        this.moreItem = true;
        this.loading = false;
        this.typeFeed = 'public';
        this.params = {
            limit: 5,
            page: 1
        };
    }
    TabSearchPage.prototype.onLoading = function () {
        this.loading = !this.loading;
    };
    TabSearchPage.prototype.doInfinite = function (event) {
        //if (!this.loading) {
        this.params.page++;
        this.sendParams.next(this.params);
        //}
    };
    TabSearchPage.prototype.doRefresh = function (event) {
        //if (!this.loading) {
        this.params.page = 1;
        this.sendParams.next(this.params);
        //}
    };
    __decorate([
        core_1.Output()
    ], TabSearchPage.prototype, "sendParams", void 0);
    TabSearchPage = __decorate([
        core_1.Component({
            selector: 'page-tab-search',
            templateUrl: 'tab-search.html'
        })
    ], TabSearchPage);
    return TabSearchPage;
}());
exports.TabSearchPage = TabSearchPage;
