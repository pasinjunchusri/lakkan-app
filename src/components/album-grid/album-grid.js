"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('@angular/core');
var photo_1 = require("../../pages/photo/photo");
var AlbumGrid = (function () {
    function AlbumGrid(provider, events, navCtrl) {
        var _this = this;
        this.provider = provider;
        this.events = events;
        this.navCtrl = navCtrl;
        this.params = {
            limit: 15,
            page: 1
        };
        this.data = [];
        this.reload = false;
        events.subscribe('photolist:params', function (params) {
            console.log('photolist:params', params);
            _this.params = params[0];
            _this.feed();
        });
    }
    AlbumGrid.prototype.openPhoto = function (item) {
        console.log(item);
        this.navCtrl.push(photo_1.PhotoPage, { item: item });
    };
    AlbumGrid.prototype.feed = function () {
        var _this = this;
        console.log('Load Feed', this.params, this.loading);
        this.loading = true;
        if (this.params.page == 1) {
            this.data = [];
        }
        this.provider.feed(this.params).then(function (data) {
            console.log(data);
            if (data && data.length) {
                data.map(function (item) {
                    _this.data.push(item);
                });
            }
            else {
                _this.moreItem = false;
            }
            _this.events.publish('photolist:complete');
            _this.loading = false;
        }, function (error) {
            _this.reload = true;
            _this.loading = false;
            _this.events.publish('photolist:complete');
        });
    };
    __decorate([
        core_1.Input()
    ], AlbumGrid.prototype, "username", void 0);
    AlbumGrid = __decorate([
        core_1.Component({
            selector: 'album-grid',
            templateUrl: 'album-grid.html'
        })
    ], AlbumGrid);
    return AlbumGrid;
}());
exports.AlbumGrid = AlbumGrid;
