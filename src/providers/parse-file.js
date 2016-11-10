"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('@angular/core');
var underscore_1 = require('underscore');
var ParseFile = (function () {
    function ParseFile(provider, events) {
        this.provider = provider;
        this.events = events;
        this._filename = 'file.jpg';
        this._uploadsPending = [];
    }
    ParseFile.prototype.uploadProccess = function (item) {
        var _this = this;
        console.log('uploadProccess', item);
        var newItem = { loading: true, form: item.form, image: item.image, status: 'sending', code: this.getRandomInt() };
        this._uploadsPending.push(newItem);
        var index = underscore_1.default.findIndex(this._uploadsPending, { code: newItem.code });
        this.upload({ base64: newItem.image }).then(function (image) {
            var form = newItem.form;
            form.image = image;
            console.log('form', form);
            _this.provider.put(form).then(function (item) {
                console.log(item);
                item.loading = false;
                _this._uploadsPending.splice(index, 1);
                setTimeout(function () { return _this.events.publish('home:reload', null); }, 500);
            }).catch(function (error) {
                console.log(error);
                _this._uploadsPending[index].status = 'error';
            });
        });
    };
    ParseFile.prototype.getRandomInt = function (min, max) {
        if (min === void 0) { min = 0; }
        if (max === void 0) { max = 9999; }
        return Math.floor(Math.random() * (max - min)) + min;
    };
    ParseFile.prototype.upload = function (file, ext) {
        this._file = file;
        if (ext) {
            this._filename.replace('.jpg', ext);
        }
        return new Parse.File('file.jpg', file).save();
    };
    ParseFile = __decorate([
        core_1.Injectable()
    ], ParseFile);
    return ParseFile;
}());
exports.ParseFile = ParseFile;
