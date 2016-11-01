"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('@angular/core');
var account_edit_modal_1 = require("../account-edit-modal/account-edit-modal");
var ProfilePage = (function () {
    function ProfilePage(navCtrl, User, events, navParams, modalCtrl) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.User = User;
        this.events = events;
        this.navParams = navParams;
        this.modalCtrl = modalCtrl;
        this.loading = true;
        this.type = 'list';
        this.username = this.navParams.get('username');
        this.params = {
            limit: 5,
            page: 1,
            privacity: 'public',
            username: this.username
        };
        this.profile = {
            name: '',
            username: '',
            photo: '',
            status: '',
            galleriesTotal: 0,
            followersTotal: 0,
            followingsTotal: 0,
        };
        this.User.profile(this.username).then(function (profile) {
            console.log(profile);
            _this.profile = profile;
            _this.loading = false;
        });
    }
    ProfilePage.prototype.onEditProfile = function () {
        var modal = this.modalCtrl.create(account_edit_modal_1.AccountEditModal);
        modal.present();
    };
    ProfilePage.prototype.onSelectType = function (type) {
        this.type = type;
        console.log(this.type);
    };
    ProfilePage.prototype.doInfinite = function (event) {
        var _this = this;
        if (!this.loading) {
            this.params.page++;
            this.loading = true;
            this.events.publish('photolist:params', this.params);
            this.events.subscribe('photolist:complete', function () {
                _this.loading = false;
                event.complete();
            });
        }
    };
    ProfilePage.prototype.doRefresh = function (event) {
        var _this = this;
        if (!this.loading) {
            this.params.page = 1;
            this.loading = true;
            this.events.publish('photolist:params', this.params);
            this.events.subscribe('photolist:complete', function () {
                _this.loading = false;
                event.complete();
            });
        }
    };
    ProfilePage = __decorate([
        core_1.Component({
            selector: 'page-profile',
            templateUrl: 'profile.html'
        })
    ], ProfilePage);
    return ProfilePage;
}());
exports.ProfilePage = ProfilePage;
