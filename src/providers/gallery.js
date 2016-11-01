"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('@angular/core');
var Gallery = (function () {
    function Gallery() {
        var _this = this;
        this.fields = [
            'title',
            'commentsTotal',
            'views',
            'likesTotal',
            'user',
            'profile',
            'hashtags',
            'words',
            'privacity',
            'address',
            'lang',
            'image',
            'imageThumb',
            'isApproved',
            'expiresAt',
            'icon',
        ];
        this.ParseObject = Parse.Object.extend('Gallery', {});
        this.tempCache = [];
        this.fields.map(function (field) {
            Object.defineProperty(_this.ParseObject.prototype, field, {
                get: function () { return this.get(field); },
                set: function (value) { this.set(field, value); }
            });
        });
        // This is a GeoPoint Object
        Object.defineProperty(this.ParseObject.prototype, 'location', {
            get: function () { return this.get('location'); },
            set: function (val) {
                this.set('location', new Parse.GeoPoint({
                    latitude: val.latitude,
                    longitude: val.longitude
                }));
            }
        });
    }
    Gallery.prototype.likeGallery = function (params) {
        return Parse.Cloud.run('likeGallery', { galleryId: params.galleryId });
    };
    Gallery.prototype.follow = function (params) {
        return Parse.Cloud.run('followUser', params);
    };
    Gallery.prototype.search = function (params) {
        return Parse.Cloud.run('searchGallery', params);
    };
    Gallery.prototype.feed = function (params) {
        return Parse.Cloud.run('feedGallery', params);
    };
    Gallery.prototype.feedCache = function (params) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            console.log(params.page, _this.tempParams['page']);
            if (params.page == _this.tempParams['page']) {
                resolve(_this.tempCache);
            }
            else {
                Parse.Cloud.run('feedGallery', params).then(function (result) {
                    _this.tempParams = params;
                    _this.tempCache = result;
                    resolve(result);
                }, reject);
            }
        });
    };
    Gallery.prototype.comments = function (params) {
        return Parse.Cloud.run('commentGallery', params);
    };
    Gallery.prototype.getAlbum = function (params) {
        return Parse.Cloud.run('getAlbum', params);
    };
    // Parse Crud
    Gallery.prototype.get = function (galleryId) {
        return new Parse.Query(this).include('profile').get(galleryId);
    };
    Gallery.prototype.put = function (item) {
        if (item.address && item.address.geo) {
            item.location = new Parse.GeoPoint(item.address.geo);
        }
        if (!item.id) {
            var objPlace = new this.ParseObject();
            return objPlace.save(item);
        }
        else {
            return item.save();
        }
    };
    Gallery.prototype.destroy = function (item) {
        return item.destroy();
    };
    Gallery = __decorate([
        core_1.Injectable()
    ], Gallery);
    return Gallery;
}());
exports.Gallery = Gallery;
