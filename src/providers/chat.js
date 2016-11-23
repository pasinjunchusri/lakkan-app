"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('@angular/core');
var ChatProvider = (function () {
    function ChatProvider() {
        var _this = this;
        this._fields = [
            'title',
            'users',
        ];
        this._ParseObject = Parse.Object.extend('ChatChannel', {});
        this._fields.map(function (field) {
            Object.defineProperty(_this._ParseObject.prototype, field, {
                get: function () { return this.get(field); },
                set: function (value) { this.set(field, value); }
            });
        });
        // This is a GeoPoint Object
        Object.defineProperty(this._ParseObject.prototype, 'location', {
            get: function () { return this.get('location'); },
            set: function (val) {
                this.set('location', new Parse.GeoPoint({
                    latitude: val.latitude,
                    longitude: val.longitude
                }));
            }
        });
    }
    ChatProvider.prototype.near = function (params) {
        var query = new Parse.Query(this._ParseObject);
        // Limit by page
        query.exists('location');
        query.withinKilometers('location', params.location, 100);
        //query.near('location',params.location);
        //query.limit(params.limit);
        return query.find();
    };
    // Parse Crud
    ChatProvider.prototype.get = function (objectId) {
        return new Parse.Query(this._ParseObject).get(objectId);
    };
    ChatProvider.prototype.put = function (item) {
        if (item.address && item.address.geo) {
            item.location = new Parse.GeoPoint(item.address.geo);
        }
        if (!item.id) {
            // New Item
            return new this._ParseObject().save(item);
        }
        else {
            // Update item
            return item.save();
        }
    };
    ChatProvider.prototype.destroy = function (objectId) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.get(objectId).then(function (item) {
                item.destroy().then(resolve).catch(reject);
            }).catch(reject);
        });
    };
    ChatProvider = __decorate([
        core_1.Injectable()
    ], ChatProvider);
    return ChatProvider;
}());
exports.ChatProvider = ChatProvider;
