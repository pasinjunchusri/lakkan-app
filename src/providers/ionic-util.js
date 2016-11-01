"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('@angular/core');
var IonicUtil = (function () {
    function IonicUtil(platform, loadingCtrl, toastCtrl) {
        this.platform = platform;
        this.loadingCtrl = loadingCtrl;
        this.toastCtrl = toastCtrl;
        console.log('Hello IonicUtil Provider');
        this.cordova = this.platform.is('cordova') ? true : false;
        console.log(this.cordova);
    }
    IonicUtil.prototype.onLoading = function () {
        this.loading = this.loadingCtrl.create();
        this.loading.present();
    };
    IonicUtil.prototype.endLoading = function () {
        this.loading.dismiss();
    };
    IonicUtil.prototype.toast = function (message) {
        var toast = this.toastCtrl.create({
            message: message,
            duration: 3000,
        });
        toast.present();
    };
    IonicUtil = __decorate([
        core_1.Injectable()
    ], IonicUtil);
    return IonicUtil;
}());
exports.IonicUtil = IonicUtil;
