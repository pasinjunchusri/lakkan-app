"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('@angular/core');
var UserData = (function () {
    function UserData() {
        var _this = this;
        this._fields = [
            'followingsTotal',
            'followersTotal',
            'commentsTotal',
            'galleriesTotal',
            'albumTotal',
            'photo',
            'status',
            'name',
            'username',
            'user',
        ];
        this._ParseObject = Parse.Object.extend('UserData', {});
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
    UserData.prototype.current = function () {
        return Parse.User.current();
    };
    UserData.prototype.profile = function (username) {
        return Parse.Cloud.run('profile', { username: username });
    };
    UserData = __decorate([
        core_1.Injectable()
    ], UserData);
    return UserData;
}());
exports.UserData = UserData;
