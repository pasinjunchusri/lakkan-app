"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('@angular/core');
var config_1 = require("../../config");
var LanguageModalComponent = (function () {
    function LanguageModalComponent(viewCtrl, util, translate) {
        this.viewCtrl = viewCtrl;
        this.util = util;
        this.translate = translate;
        this._words = '';
        this._languages = config_1.languages;
        this.startTranslate();
    }
    LanguageModalComponent.prototype.doSearch = function () {
        var _this = this;
        this._languages = config_1.languages.filter(function (item) {
            return item.name.toLowerCase().indexOf(_this._words.toLowerCase()) > -1;
        });
    };
    LanguageModalComponent.prototype.startTranslate = function () {
        var _this = this;
        // Translate Search Bar Placeholder
        this.util.translate('Search').then(function (res) { return _this._placeholder = res; });
    };
    LanguageModalComponent.prototype.selectLanguage = function (lang) {
        var _this = this;
        this.util.onLoading();
        this.translate.use(lang.code.split('_')[0]);
        setTimeout(function () {
            _this.startTranslate();
            _this.util.endLoading();
            _this.dismiss();
        }, 1000);
    };
    LanguageModalComponent.prototype.doCancel = function () {
        this._words = '';
    };
    LanguageModalComponent.prototype.dismiss = function () {
        this.viewCtrl.dismiss();
    };
    LanguageModalComponent = __decorate([
        core_1.Component({
            selector: 'language-modal',
            templateUrl: 'language-modal.html'
        })
    ], LanguageModalComponent);
    return LanguageModalComponent;
}());
exports.LanguageModalComponent = LanguageModalComponent;
