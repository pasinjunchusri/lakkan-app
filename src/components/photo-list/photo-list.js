"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('@angular/core');
var PhotoList = (function () {
    function PhotoList(provider, events, modalCtrl) {
        var _this = this;
        this.provider = provider;
        this.events = events;
        this.modalCtrl = modalCtrl;
        this.data = [];
        this.loadingLike = false;
        this.params = {
            limit: 5,
            page: 1
        };
        events.subscribe('photolist:params', function (params) {
            console.log('photolist:params', params);
            _this.params = params[0];
            _this.feed();
        });
    }
    PhotoList.prototype.ngOnInit = function () {
        this.feed();
    };
    PhotoList.prototype.feed = function () {
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
    PhotoList.prototype.doInfinite = function (event) {
        if (!this.loading) {
            this.params.page++;
            this.feed().then(function () { return event.complete(); });
        }
    };
    PhotoList.prototype.doRefresh = function (event) {
        if (!this.loading) {
            this.data = [];
            this.params.page = 1;
            this.feed().then(function () { return event.complete(); });
        }
    };
    __decorate([
        core_1.Input()
    ], PhotoList.prototype, "username", void 0);
    PhotoList = __decorate([
        core_1.Component({
            selector: 'photo-list',
            templateUrl: 'photo-list.html'
        })
    ], PhotoList);
    return PhotoList;
}());
exports.PhotoList = PhotoList;
