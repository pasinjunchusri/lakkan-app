"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('@angular/core');
var common_1 = require("@angular/common");
// Providers
var ionic_util_1 = require("./ionic-util");
var auth_1 = require("./auth");
var user_1 = require("./user");
var gallery_1 = require("./gallery");
var gallery_activity_1 = require("./gallery-activity");
var gallery_comment_1 = require("./gallery-comment");
var parse_file_1 = require("./parse-file");
var parse_push_1 = require("./parse-push");
var gallery_feedback_1 = require("./gallery-feedback");
exports.sharedProviders = [
    ionic_util_1.IonicUtil,
    auth_1.Auth,
    user_1.User,
    gallery_1.Gallery,
    gallery_activity_1.GalleryActivity,
    gallery_comment_1.GalleryComment,
    gallery_feedback_1.GallerFeedback,
    parse_file_1.ParseFile,
    parse_push_1.ParsePush,
];
var ProvidersModule = (function () {
    function ProvidersModule() {
    }
    ProvidersModule = __decorate([
        core_1.NgModule({
            imports: [common_1.CommonModule],
            exports: [],
            declarations: [],
            providers: [exports.sharedProviders]
        })
    ], ProvidersModule);
    return ProvidersModule;
}());
exports.ProvidersModule = ProvidersModule;
