"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('@angular/core');
var ionic_angular_1 = require("ionic-angular");
// Pages
var tabs_1 = require('../pages/tabs/tabs');
var tab_home_1 = require("../pages/tab-home/tab-home");
var tab_search_1 = require("../pages/tab-search/tab-search");
var tab_share_1 = require("../pages/tab-share/tab-share");
var tab_activity_1 = require("../pages/tab-activity/tab-activity");
var intro_1 = require("../pages/intro/intro");
var auth_1 = require("./auth/auth");
var user_forgot_1 = require("../pages/user-forgot/user-forgot");
var tab_account_1 = require("./tab-account/tab-account");
var tab_account_popover_1 = require("./tab-account-popover/tab-account-popover");
var account_edit_modal_1 = require("./account-edit-modal/account-edit-modal");
// Components
var components_module_1 = require("../components/components.module");
// Pipes
var pipes_module_1 = require("../pipes/pipes.module");
// Providers
var providers_module_1 = require("../providers/providers.module");
exports.APP_PAGES = [
    intro_1.IntroPage,
    user_forgot_1.UserForgotPage,
    auth_1.AuthPage,
    tabs_1.TabsPage,
    tab_home_1.TabHomePage,
    tab_search_1.TabSearchPage,
    tab_share_1.TabSharePage,
    tab_activity_1.TabActivityPage,
    tab_account_1.TabAccountPage,
    tab_account_popover_1.TabAccountPopoverPage,
    account_edit_modal_1.AccountEditModal,
];
var PagesModule = (function () {
    function PagesModule() {
    }
    PagesModule = __decorate([
        core_1.NgModule({
            imports: [
                components_module_1.ComponentsModule,
                pipes_module_1.PipesModule,
                providers_module_1.ProvidersModule,
                ionic_angular_1.IonicModule.forRoot(tabs_1.TabsPage),
                ionic_angular_1.IonicModule.forRoot(intro_1.IntroPage),
            ],
            exports: [
                exports.APP_PAGES
            ],
            declarations: [
                exports.APP_PAGES
            ],
            providers: []
        })
    ], PagesModule);
    return PagesModule;
}());
exports.PagesModule = PagesModule;
