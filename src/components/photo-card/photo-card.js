"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('@angular/core');
var photo_comment_modal_1 = require("../photo-comment-modal/photo-comment-modal");
var profile_1 = require("../../pages/profile/profile");
var PhotoCard = (function () {
    function PhotoCard(provider, events, navCtrl, modalCtrl) {
        this.provider = provider;
        this.events = events;
        this.navCtrl = navCtrl;
        this.modalCtrl = modalCtrl;
        this.loadingLike = false;
    }
    PhotoCard.prototype.openComments = function (item) {
        console.log(item);
        var modal = this.modalCtrl.create(photo_comment_modal_1.PhotoCommentModal, item);
        modal.present();
    };
    PhotoCard.prototype.profile = function (username) {
        console.log('username', username);
        this.navCtrl.push(profile_1.ProfilePage, { username: username });
    };
    PhotoCard.prototype.onLike = function (item) {
        var _this = this;
        console.log(item);
        this.loadingLike = true;
        this.provider.likeGallery({ galleryID: item.id }).then(function (data) {
            if (item.liked) {
                item.liked = false;
                item.likesTotal--;
            }
            else {
                item.liked = true;
                item.likesTotal++;
            }
            console.log(data);
            _this.loadingLike = false;
        });
    };
    __decorate([
        core_1.Input()
    ], PhotoCard.prototype, "item", void 0);
    PhotoCard = __decorate([
        core_1.Component({
            selector: 'photo-card',
            templateUrl: 'photo-card.html'
        })
    ], PhotoCard);
    return PhotoCard;
}());
exports.PhotoCard = PhotoCard;
