"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('@angular/core');
var GallerFeedback = (function () {
    function GallerFeedback() {
        var _this = this;
        this.fields = [
            'text',
            'user',
        ];
        this.ParseObject = Parse.Object.extend('GallerFeedback', {});
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
    GallerFeedback.prototype.create = function (item) {
        var ParseObjectRow = new this.ParseObject();
        return ParseObjectRow.save(item);
    };
    GallerFeedback.prototype.put = function (item) {
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
    GallerFeedback.prototype.destroy = function (item) {
        return item.destroy();
    };
    GallerFeedback = __decorate([
        core_1.Injectable()
    ], GallerFeedback);
    return GallerFeedback;
}());
exports.GallerFeedback = GallerFeedback;
