"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('@angular/core');
var AccountEditModal = (function () {
    function AccountEditModal(navCtrl, viewCtrl, ionic, User) {
        this.navCtrl = navCtrl;
        this.viewCtrl = viewCtrl;
        this.ionic = ionic;
        this.User = User;
        this.submitted = false;
        var user = Parse.User.current().attributes;
        if (user.photo) {
            this.photo = user.photo._url;
        }
        this.form = {
            username: user.username,
            name: user.name,
            gender: user.gender,
            birthday: user.birthday,
            status: user.status,
            email: user.email,
            phone: user.phone,
            website: user.website,
        };
    }
    AccountEditModal.prototype.changeAvatar = function () {
        console.log('Mudar Foto');
    };
    AccountEditModal.prototype.save = function (rForm) {
        var _this = this;
        this.submitted = true;
        if (rForm.valid) {
            this.ionic.onLoading();
            console.log(rForm);
            console.log(this.form);
            this.User.update(this.form).then(function (result) {
                console.log(result);
                _this.ionic.endLoading();
            }, function (error) {
                console.log(error);
                _this.ionic.endLoading();
            });
        }
    };
    AccountEditModal.prototype.dismiss = function () {
        this.viewCtrl.dismiss();
    };
    AccountEditModal = __decorate([
        core_1.Component({
            selector: 'page-account-edit-modal',
            templateUrl: 'account-edit-modal.html'
        })
    ], AccountEditModal);
    return AccountEditModal;
}());
exports.AccountEditModal = AccountEditModal;
