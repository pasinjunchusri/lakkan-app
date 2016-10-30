"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('@angular/core');
var tab_account_popover_1 = require("../tab-account-popover/tab-account-popover");
var TabAccountPage = (function () {
    function TabAccountPage(navCtrl, User, popoverCtrl) {
        this.navCtrl = navCtrl;
        this.User = User;
        this.popoverCtrl = popoverCtrl;
        this.type = 'list';
        this.user = User.current();
        this.username = User.current().get('username');
        console.log(this.username);
    }
    TabAccountPage.prototype.onSelectType = function (type) {
        this.type = type;
        console.log(this.type);
    };
    TabAccountPage.prototype.presentPopover = function (ev) {
        var popover = this.popoverCtrl.create(tab_account_popover_1.TabAccountPopoverPage);
        popover.present({ ev: ev });
    };
    TabAccountPage = __decorate([
        core_1.Component({
            selector: 'page-tab-account',
            templateUrl: 'tab-account.html'
        })
    ], TabAccountPage);
    return TabAccountPage;
}());
exports.TabAccountPage = TabAccountPage;
