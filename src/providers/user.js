"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('@angular/core');
var User = (function () {
    function User(ParsePush) {
        var _this = this;
        this.ParsePush = ParsePush;
        this._fields = [
            'name',
            'username',
            'status',
            'gender',
            'email',
            'photo',
            'photoThumb',
            'roleName',
        ];
        this._ParseObject = Parse.User.extend({});
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
    User.prototype.current = function () {
        return Parse.User.current();
    };
    User.prototype.fetch = function () {
        return new Promise(function (resolve, reject) {
            if (Parse.User.current()) {
                Parse.User.current().fetch().then(resolve, reject);
            }
            else {
                reject();
            }
        });
    };
    User.prototype.update = function (form) {
        var user = Parse.User.current();
        // User Language
        return user.save(form);
    };
    User.prototype.setPhoto = function (parseFile) {
        var user = Parse.User.current();
        user.set('photo', parseFile);
        return user.save();
    };
    User.prototype.recoverPassword = function (email) {
        return Parse.User.requestPasswordReset(email);
    };
    User.prototype.getPublicData = function (user) {
        return new Promise(function (resolve, reject) {
            new Parse.Query('UserData').equalTo('user', user).first().then(function (userData) {
                if (userData) {
                    resolve(userData);
                }
                else {
                    reject(Parse.Promise.error({
                        code: 1,
                        message: 'User Data not found'
                    }));
                }
            }, reject);
        });
    };
    User.prototype.logOut = function () {
        return Parse.User.logOut();
        //delete $window.localStorage['Parse/' + Parse.applicationId + '/currentUser'];
        //delete $window.localStorage['Parse/' + Parse.applicationId + '/installationId'];
    };
    User.prototype.updateWithFacebookData = function (data) {
        return new Promise(function (resolve, reject) {
            Parse.Cloud.run('saveFacebookPicture').then(function () {
                var user = Parse.User.current();
                if (!data.username && data.email) {
                    user.set('username', data.email.split('@')[0]);
                }
                if (!user.get('name') && data.name) {
                    user.set('name', data.name);
                }
                if (!user.get('email') && data.email) {
                    user.set('email', data.email);
                }
                user.save(null).then(resolve, reject);
            });
        });
    };
    User.prototype.signInViaFacebook = function (authData) {
        console.log('signInViaFacebook', authData);
        return new Promise(function (resolve, reject) {
            var facebookAuthData = {
                id: authData['authResponse']['userID'],
                access_token: authData['authResponse']['accessToken'],
                expiration_date: (new Date().getTime() + 1000).toString()
            };
            console.log('facebookAuthData', facebookAuthData);
            Parse.FacebookUtils.logIn(facebookAuthData, {
                success: function (user) {
                    if (!user.existed()) {
                        console.log("User signed up and logged in through Facebook!", user);
                    }
                    else {
                        console.log("User logged in through Facebook!", user);
                    }
                    resolve(user);
                },
                error: function (user, error) {
                    console.log('User cancelled the Facebook login or did not fully authorize.', user, error);
                    reject({ error: error, user: user });
                }
            });
        });
    };
    User.prototype.signUp = function (data) {
        var user = new Parse.User();
        user.set('name', data.name);
        user.set('username', data.username);
        user.set('email', data.email);
        user.set('password', data.password);
        user.set('roleName', 'User');
        return user.signUp(null);
    };
    User.prototype.signIn = function (obj) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            Parse.User.logIn(obj.username.toLowerCase(), obj.password).then(function (currentUser) {
                console.log('currentUser', currentUser);
                console.log('cordova', window['cordova']);
                if (window['cordova']) {
                    // Parse Push
                    _this.ParsePush.init();
                }
                resolve(currentUser);
            }, reject);
        });
    };
    User.prototype.changePassword = function (password) {
        return Parse.Cloud.run('changePassword', { password: password });
    };
    User.prototype.destroy = function (data) {
        return Parse.Cloud.run('destroyUser', data);
    };
    User.prototype.validateEmail = function (input) {
        return Parse.Cloud.run('validateEmail', { email: input });
    };
    User.prototype.validateUsername = function (input) {
        return Parse.Cloud.run('validateUsername', { username: input });
    };
    User.prototype.all = function (params) {
        return Parse.Cloud.run('getUsers', params);
    };
    User.prototype.follow = function (userId) {
        return Parse.Cloud.run('followUser', { userId: userId });
    };
    User.prototype.findByEmail = function (email) {
        return Parse.Cloud.run('findUserByEmail', { email: email });
    };
    User.prototype.findUserFacebook = function (facebookId) {
        return Parse.Cloud.run('findUserFacebookId', { facebookId: facebookId });
    };
    User.prototype.list = function (params) {
        return Parse.Cloud.run('listUsers', params);
    };
    User.prototype.getFollowers = function (username) {
        return Parse.Cloud.run('getFollowers', { username: username });
    };
    User.prototype.getLikers = function (galleryId) {
        return Parse.Cloud.run('getLikers', { galleryId: galleryId });
    };
    User.prototype.getFollowing = function (username) {
        return Parse.Cloud.run('getFollowing', { username: username });
    };
    User = __decorate([
        core_1.Injectable()
    ], User);
    return User;
}());
exports.User = User;
