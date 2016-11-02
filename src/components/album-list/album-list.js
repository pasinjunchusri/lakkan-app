"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('@angular/core');
var AlbumList = (function () {
    function AlbumList(provider, events) {
        var _this = this;
        this.provider = provider;
        this.events = events;
        this.params = {
            limit: 5,
            page: 1
        };
        this.data = [];
        this.reload = false;
        console.log('Photo List');
        events.subscribe('photolist:params', function (params) {
            console.log('photolist:params', params);
            _this.params = params[0];
            if (!_this.loading) {
                _this.feed();
            }
        });
    }
    AlbumList.prototype.ionViewDidLoad = function () {
        console.log("I'm alive!");
    };
    AlbumList.prototype.ionViewWillLeave = function () {
        console.log("Looks like I'm about to leave :(");
    };
    AlbumList.prototype.feed = function () {
        var _this = this;
        console.log('Load Feed', this.params, this.loading);
        this.loading = true;
        if (this.params.page == 1) {
            this.data = [];
        }
        this.provider.feed(this.params).then(function (data) {
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
    ], AlbumList.prototype, "username", void 0);
    AlbumList = __decorate([
        core_1.Component({
            selector: 'album-list',
            templateUrl: 'album-list.html'
        })
    ], AlbumList);
    return AlbumList;
}());
exports.AlbumList = AlbumList;
