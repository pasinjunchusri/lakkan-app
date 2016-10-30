"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('@angular/core');
var ionic_angular_1 = require('ionic-angular');
var common_1 = require("@angular/common");
var app_component_1 = require('./app.component');
var pages_module_1 = require("../pages/pages.module");
var ionic_image_loader_1 = require("ionic-image-loader");
var ng2_translate_1 = require("ng2-translate");
var http_1 = require("@angular/http");
var platform_browser_1 = require("@angular/platform-browser");
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
                ng2_translate_1.TranslateModule.forRoot({
                    provide: ng2_translate_1.TranslateLoader,
                    useFactory: function (http) { return new ng2_translate_1.TranslateStaticLoader(http, '/assets/i18n', '.json'); },
                    deps: [http_1.Http]
                }),
                ionic_angular_1.IonicModule.forRoot(app_component_1.MyApp)
            ],
            exports: [
                ng2_translate_1.TranslateModule,
                http_1.HttpModule,
                platform_browser_1.BrowserModule
            ],
            bootstrap: [ionic_angular_1.IonicApp],
            entryComponents: [
                pages_module_1.APP_PAGES,
                app_component_1.MyApp
            ],
            providers: []
        })
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
