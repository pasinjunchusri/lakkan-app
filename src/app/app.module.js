"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var ionic_angular_1 = require('ionic-angular');
var core_1 = require('@angular/core');
var common_1 = require("@angular/common");
var app_component_1 = require('./app.component');
var pages_module_1 = require("../pages/pages.module");
var tab_home_1 = require("../pages/tab-home/tab-home");
var intro_1 = require('../pages/intro/intro');
var auth_1 = require('../pages/auth/auth');
var tabs_1 = require('../pages/tabs/tabs');
var tab_search_1 = require('../pages/tab-search/tab-search');
var tab_account_1 = require('../pages/tab-account/tab-account');
var tab_activity_1 = require('../pages/tab-activity/tab-activity');
var photo_1 = require("../pages/photo/photo");
var profile_1 = require("../pages/profile/profile");
var angular2_moment_1 = require("angular2-moment");
var ng2_translate_1 = require('ng2-translate');
var ionic_image_loader_1 = require("ionic-image-loader");
var http_1 = require("@angular/http");
var platform_browser_1 = require("@angular/platform-browser");
function createTranslateLoader(http) {
    return new ng2_translate_1.TranslateStaticLoader(http, './assets/i18n', '.json');
}
exports.createTranslateLoader = createTranslateLoader;
var AppModule = (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        core_1.NgModule({
            declarations: [
                app_component_1.MyApp,
            ],
            imports: [
                common_1.CommonModule,
                platform_browser_1.BrowserModule,
                http_1.HttpModule,
                pages_module_1.PagesModule,
                ionic_image_loader_1.IonicImageLoader,
                angular2_moment_1.MomentModule,
                ng2_translate_1.TranslateModule.forRoot({
                    provide: ng2_translate_1.TranslateLoader,
                    useFactory: function (http) { return new ng2_translate_1.TranslateStaticLoader(http, '/assets/i18n', '.json'); },
                    deps: [http_1.Http]
                }),
                ionic_angular_1.IonicModule.forRoot(app_component_1.MyApp, {}, {
                    links: [
                        { component: auth_1.AuthPage, name: 'Auth', segment: 'auth' },
                        { component: intro_1.IntroPage, name: 'Tabs', segment: 'intro' },
                        { component: tabs_1.TabsPage, name: 'Intro', segment: 'tab' },
                        { component: tab_home_1.TabHomePage, name: 'Home', segment: 'home' },
                        { component: tab_search_1.TabSearchPage, name: 'Search', segment: 'search' },
                        { component: tab_activity_1.TabActivityPage, name: 'Activity', segment: 'activity' },
                        { component: tab_account_1.TabAccountPage, name: 'Account', segment: 'account' },
                        { component: photo_1.PhotoPage, name: 'Photo', segment: 'photo' },
                        { component: profile_1.ProfilePage, name: 'Profile', segment: 'profile' },
                    ]
                })
            ],
            exports: [
                platform_browser_1.BrowserModule,
                http_1.HttpModule,
                ng2_translate_1.TranslateModule
            ],
            entryComponents: [
                app_component_1.MyApp,
                pages_module_1.APP_PAGES,
            ],
            providers: [],
            bootstrap: [ionic_angular_1.IonicApp],
        })
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
