"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('@angular/core');
var ionic_angular_1 = require("ionic-angular");
var http_1 = require("@angular/http");
var platform_browser_1 = require("@angular/platform-browser");
var common_1 = require("@angular/common");
// Pipes
var pipes_module_1 = require("../pipes/pipes.module");
// Providers
var providers_module_1 = require("../providers/providers.module");
// Pages
var tabs_1 = require('../pages/tabs/tabs');
var tab_home_1 = require("../pages/tab-home/tab-home");
var tab_search_1 = require("../pages/tab-search/tab-search");
var tab_share_1 = require("../pages/tab-share/tab-share");
var tab_activity_1 = require("../pages/tab-activity/tab-activity");
var intro_1 = require("../pages/intro/intro");
var auth_1 = require("./auth/auth");
var tab_account_1 = require("./tab-account/tab-account");
var tab_account_popover_1 = require("./tab-account-popover/tab-account-popover");
var account_edit_modal_1 = require("./account-edit-modal/account-edit-modal");
var tab_account_settings_1 = require("./tab-account-settings/tab-account-settings");
var photo_comment_modal_1 = require("../components/photo-comment-modal/photo-comment-modal");
var photo_feedback_modal_1 = require("../components/photo-feedback-modal/photo-feedback-modal");
var photo_grid_1 = require("../components/photo-grid/photo-grid");
var photo_list_1 = require("../components/photo-list/photo-list");
var photo_card_1 = require("../components/photo-card/photo-card");
var photo_1 = require("./photo/photo");
var loader_1 = require("../components/loader/loader");
var user_password_1 = require("./user-password/user-password");
var profile_1 = require("./profile/profile");
var photo_capture_modal_1 = require("../components/photo-capture-modal/photo-capture-modal");
var photo_share_modal_1 = require("../components/photo-share-modal/photo-share-modal");
exports.APP_PAGES = [
    intro_1.IntroPage,
    auth_1.AuthPage,
    tabs_1.TabsPage,
    tab_home_1.TabHomePage,
    tab_search_1.TabSearchPage,
    tab_share_1.TabSharePage,
    tab_activity_1.TabActivityPage,
    tab_account_1.TabAccountPage,
    tab_account_popover_1.TabAccountPopoverPage,
    tab_account_settings_1.TabAccountSettingsPage,
    account_edit_modal_1.AccountEditModal,
    photo_1.PhotoPage,
    profile_1.ProfilePage,
    user_password_1.UserPassword,
    // Components
    loader_1.Loader,
    photo_comment_modal_1.PhotoCommentModal,
    photo_feedback_modal_1.PhotoFeedbackModal,
    photo_grid_1.PhotoGrid,
    photo_list_1.PhotoList,
    photo_card_1.PhotoCard,
    photo_capture_modal_1.PhotoCaptureModal,
    photo_share_modal_1.PhotoShareModal
];
var PagesModule = (function () {
    function PagesModule() {
    }
    PagesModule = __decorate([
        core_1.NgModule({
            imports: [
                common_1.CommonModule,
                platform_browser_1.BrowserModule,
                http_1.HttpModule,
                pipes_module_1.PipesModule,
                providers_module_1.ProvidersModule,
                ionic_angular_1.IonicModule.forRoot(tabs_1.TabsPage),
                ionic_angular_1.IonicModule.forRoot(intro_1.IntroPage),
            ],
            exports: [
                exports.APP_PAGES,
                platform_browser_1.BrowserModule,
                http_1.HttpModule
            ],
            declarations: [
                exports.APP_PAGES,
            ],
            providers: []
        })
    ], PagesModule);
    return PagesModule;
}());
exports.PagesModule = PagesModule;
