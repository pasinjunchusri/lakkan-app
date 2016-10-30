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
                pages_module_1.PagesModule,
                ionic_angular_1.IonicModule.forRoot(app_component_1.MyApp, {}, {
                    links: [
                        { component: auth_1.AuthPage, name: 'Auth', segment: 'auth' },
                        { component: intro_1.IntroPage, name: 'Intro', segment: 'intro' },
                        { component: tab_home_1.TabHomePage, name: 'Home', segment: 'home' }
                    ]
                })
            ],
            entryComponents: [
                pages_module_1.APP_PAGES,
                app_component_1.MyApp
            ],
            providers: [],
            bootstrap: [ionic_angular_1.IonicApp],
        })
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
