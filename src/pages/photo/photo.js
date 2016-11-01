"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('@angular/core');
var PhotoPage = (function () {
    function PhotoPage(navCtrl, navParams) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
    }
    PhotoPage.prototype.ionViewDidLoad = function () {
        this.item = this.navParams.get('item');
        console.log(this.item);
        console.log('Hello Photo Page');
    };
    PhotoPage = __decorate([
        core_1.Component({
            selector: 'page-photo',
            templateUrl: 'photo.html'
        })
    ], PhotoPage);
    return PhotoPage;
}());
exports.PhotoPage = PhotoPage;
