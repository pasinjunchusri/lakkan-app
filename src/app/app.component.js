"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('@angular/core');
var ionic_native_1 = require('ionic-native');
var tabs_1 = require("../pages/tabs/tabs");
var intro_1 = require("../pages/intro/intro");
var config_1 = require("../config");
var MyApp = (function () {
    function MyApp(platform, translate, imageLoaderConfig) {
        var _this = this;
        // Translate
        translate.setDefaultLang('en');
        translate.use('pt');
        console.log(translate.currentLang);
        // Image Cache
        // enable debug mode to get console errors/warnings/logs
        // this could be useful while trying to debug issues with the component
        imageLoaderConfig.enableDebugMode();
        // disable spinners by default, you can add [spinner]="true" to a specific component instance later on to override this
        imageLoaderConfig.enableSpinner(true);
        platform.ready().then(function () {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            ionic_native_1.StatusBar.styleDefault();
            ionic_native_1.Splashscreen.hide();
            console.log(Parse.User.current());
            if (!Parse.User.current()) {
                _this.rootPage = intro_1.IntroPage;
            }
            else {
                _this.rootPage = tabs_1.TabsPage;
            }
        });
    }
    MyApp.prototype.ngOnInit = function () {
        Parse.initialize(config_1.PARSE_APP_ID);
        Parse.serverURL = config_1.PARSE_SERVER_URL;
    };
    MyApp = __decorate([
        core_1.Component({
            template: "<ion-nav [root]=\"rootPage\" #content></ion-nav>"
        })
    ], MyApp);
    return MyApp;
}());
exports.MyApp = MyApp;
