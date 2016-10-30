"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('@angular/core');
var PhotoCommentModal = (function () {
    function PhotoCommentModal(navparams, viewCtrl, provider, util) {
        this.navparams = navparams;
        this.viewCtrl = viewCtrl;
        this.provider = provider;
        this.util = util;
        this.comment = '';
        this.data = [];
        this.loading = true;
        this.noData = false;
        this.gallery = this.navparams.data.obj;
        this.form = {
            gallery: this.gallery,
            text: null
        };
        this.onQuery();
    }
    PhotoCommentModal.prototype.ionViewLoaded = function () {
        var _this = this;
        setTimeout(function () {
            console.log('set focus');
            _this.myInput.setFocus();
        }, 150);
    };
    PhotoCommentModal.prototype.onQuery = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.loading = true;
            _this.form.text = '';
            var relation = _this.gallery.relation('comments');
            relation.query().find().then(function (comments) {
                _this.loading = false;
                if (comments.length > 0) {
                    _this.data = comments;
                    _this.noData = false;
                }
                else {
                    _this.noData = true;
                }
                resolve(comments);
            });
        });
    };
    PhotoCommentModal.prototype.dismiss = function () {
        this.viewCtrl.dismiss();
    };
    PhotoCommentModal.prototype.onComment = function (form) {
        var _this = this;
        if (form.valid) {
            this.util.onLoading();
            this.provider.create(this.form).then(function (result) {
                _this.onQuery().then(function () { return _this.util.endLoading(); });
            });
        }
    };
    __decorate([
        core_1.ViewChild('input')
    ], PhotoCommentModal.prototype, "myInput", void 0);
    PhotoCommentModal = __decorate([
        core_1.Component({
            selector: 'photo-comment-modal',
            templateUrl: 'photo-comment-modal.html'
        })
    ], PhotoCommentModal);
    return PhotoCommentModal;
}());
exports.PhotoCommentModal = PhotoCommentModal;
