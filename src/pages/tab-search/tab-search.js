"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('@angular/core');
var TabSearchPage = (function () {
    function TabSearchPage(navCtrl, events) {
        this.navCtrl = navCtrl;
        this.events = events;
        this.loading = false;
        this.params = {
            limit: 24,
            page: 1
        };
        this.events.publish('photolist:params', this.params);
    }
    TabSearchPage.prototype.doInfinite = function (event) {
        var _this = this;
        if (!this.loading) {
            this.params.page++;
            this.loading = true;
            this.events.publish('photolist:params', this.params);
            this.events.subscribe('photolist:complete', function () {
                _this.loading = false;
                event.complete();
            });
        }
    };
    TabSearchPage.prototype.doRefresh = function (event) {
        var _this = this;
        if (!this.loading) {
            this.params.page = 1;
            this.loading = true;
            this.events.publish('photolist:params', this.params);
            this.events.subscribe('photolist:complete', function () {
                _this.loading = false;
                event.complete();
            });
        }
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
