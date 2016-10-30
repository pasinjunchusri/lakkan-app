"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('@angular/core');
// Components
var loader_1 = require("./loader/loader");
var photo_grid_1 = require("./photo-grid/photo-grid");
var photo_list_1 = require("./photo-list/photo-list");
var photo_comment_modal_1 = require("./photo-comment-modal/photo-comment-modal");
var photo_feedback_modal_1 = require("./photo-feedback-modal/photo-feedback-modal");
var photo_card_1 = require("./photo-card/photo-card");
exports.sharedComponents = [
    loader_1.Loader,
    photo_comment_modal_1.PhotoCommentModal,
    photo_feedback_modal_1.PhotoFeedbackModal,
    photo_grid_1.PhotoGrid,
    photo_list_1.PhotoList,
    photo_card_1.PhotoCard,
];
var ComponentsModule = (function () {
    function ComponentsModule() {
    }
    ComponentsModule = __decorate([
        core_1.NgModule({
            imports: [],
            exports: [],
            declarations: [exports.sharedComponents],
            providers: [],
        })
    ], ComponentsModule);
    return ComponentsModule;
}());
exports.ComponentsModule = ComponentsModule;
