"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('@angular/core');
var photo_1 = require("../../pages/photo/photo");
var PhotoGrid = (function () {
    function PhotoGrid(provider, events, platform, navCtrl) {
        var _this = this;
        this.provider = provider;
        this.events = events;
        this.platform = platform;
        this.navCtrl = navCtrl;
        this.loading = true;
        this.moreItem = true;
        this.data = [];
        this.cordova = false;
        this.cordova = this.platform.is('cordova') ? true : false;
        events.subscribe('photolist:params', function (params) {
            console.log('photolist:params', params);
            _this.params = params[0];
            _this.feed();
        });
    }
    PhotoGrid.prototype.ngOnInit = function () {
        this.feed();
    };
    PhotoGrid.prototype.openPhoto = function (item) {
        console.log(item);
        this.navCtrl.push(photo_1.PhotoPage, item);
    };
    PhotoGrid.prototype.feed = function () {
        var _this = this;
        console.log('Load Feed', this.params);
        return new Promise(function (resolve, reject) {
            _this.loading = true;
            if (_this.params.page == 1) {
                _this.data = [];
            }
            _this.provider.feed(_this.params).then(function (data) {
                if (data && data.length) {
                    data.map(function (item) {
                        _this.data.push(item);
                    });
                    _this.moreItem = true;
                }
                else {
                    _this.moreItem = false;
                }
                _this.loading = false;
                _this.events.publish('photolist:complete');
                resolve();
            }, function (error) {
                _this.events.publish('photolist:complete');
                reject(error);
            });
        });
    };
    PhotoGrid.prototype.doInfinite = function (event) {
        if (!this.loading) {
            this.params.page++;
            this.feed().then(function () { return event.complete(); });
        }
    };
    PhotoGrid.prototype.doRefresh = function (event) {
        if (!this.loading) {
            this.data = [];
            this.params.page = 1;
            this.feed().then(function () { return event.complete(); });
        }
    };
    __decorate([
        core_1.Input()
    ], PhotoGrid.prototype, "username", void 0);
    __decorate([
        core_1.Input()
    ], PhotoGrid.prototype, "params", void 0);
    PhotoGrid = __decorate([
        core_1.Component({
            selector: 'photo-grid',
            templateUrl: 'photo-grid.html'
        })
    ], PhotoGrid);
    return PhotoGrid;
}());
exports.PhotoGrid = PhotoGrid;
