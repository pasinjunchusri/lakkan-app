import {Injectable} from '@angular/core';
import {ParsePush} from "./parse-push";
import {Device} from 'ionic-native';

@Injectable()
export class User {
    fields      = [
        'name',
        'username',
        'status',
        'gender',
        'email',
        'photo',
        'photoThumb',
        'roleName',
    ];
    ParseObject = Parse.User.extend({});

    constructor(private ParsePush: ParsePush) {
        this.fields.map(field => {
            Object.defineProperty(this.ParseObject.prototype, field, {
                get: function () {return this.get(field)},
                set: function (value) { this.set(field, value)}
            });
        });

        // This is a GeoPoint Object
        Object.defineProperty(this.ParseObject.prototype, 'location', {
            get: function () {return this.get('location');},
            set: function (val) {
                this.set('location', new Parse.GeoPoint({
                    latitude : val.latitude,
                    longitude: val.longitude
                }));
            }
        });
    }

    current() {
        return Parse.User.current();
    }

    fetch() {
        return new Promise((resolve, reject) => {
            if (Parse.User.current()) {
                Parse.User.current().fetch().then(resolve, reject);
            } else {
                reject();
            }
        });
    }


    update(params) {
        var user = Parse.User.current();
        // User Language

        params.each((value, key) => {
            user.set(key, value);
        })
        return user.save();
    }

    setPhoto(parseFile) {
        let user = Parse.User.current();
        user.set('photo', parseFile);
        return user.save();
    }

    recoverPassword(email) {
        return Parse.User.requestPasswordReset(email);
    }

    getPublicData(user) {
        return new Promise((resolve, reject) => {
            new Parse.Query('UserData').equalTo('user', user).first().then((userData) => {
                if (userData) {
                    resolve(userData);
                } else {
                    reject(Parse.Promise.error({
                        code   : 1,
                        message: 'User Data not found'
                    }));
                }
            }, reject);
        });
    }

    logOut() {
        return Parse.User.logOut();
        //delete $window.localStorage['Parse/' + Parse.applicationId + '/currentUser'];
        //delete $window.localStorage['Parse/' + Parse.applicationId + '/installationId'];
    }

    updateWithFacebookData(data) {
        return new Promise((resolve, reject) => {
            Parse.Cloud.run('saveFacebookPicture', {}).then(() => {
                let user = Parse.User.current();

                if (!data.username && data.email) {
                    user.set('username', data.email.split('@')[0]);
                }

                if (!user.get('name') && data.name) {
                    user.set('name', data.name);
                }

                if (!user.get('email') && data.email) {
                    user.set('email', data.email);
                }
                user.save(null, user.fetch().then(resolve, reject));
            });

        });
    }

    signInViaFacebook(authData) {
        let facebookAuthData = {
            id             : authData.authResponse.userID,
            access_token   : authData.authResponse.accessToken,
            expiration_date: (new Date().getTime() + 1000).toString()
        };
        Parse.FacebookUtils.logIn(facebookAuthData)
    }

    signUp(data) {
        let user = new Parse.User();
        user.set('name', data.name);
        user.set('username', data.username);
        user.set('email', data.email)
        user.set('password', data.password)
        user.set('roleName', 'User')
        return user.signUp(null);

    }

    signIn(obj) {
        return new Promise((resolve, reject) => {
            Parse.User.logIn(obj.username.toLowerCase(), obj.password).then((currentUser) => {

                // device
                var updateUser;
                if (window['cordova']) {
                    updateUser = {
                        device  : Device.device,
                        cordova : Device.device.cordova,
                        model   : Device.device.model,
                        platform: Device.device.platform,
                        uuid    : Device.device.uuid,
                        version : Device.device.version
                    };
                } else {
                    var userAgent = window.navigator.userAgent.match(/(?:Chrom(?:e|ium)|Firefox)\/([0-9]+)\./);

                    updateUser = {
                        device  : {device: (userAgent) ? userAgent[0] : 'emulator'},
                        cordova : '',
                        model   : (userAgent) ? userAgent[0] : 'emulator',
                        platform: window.navigator.platform,
                        uuid    : '',
                        version : (userAgent) ? userAgent[0] : 'emulator'
                    };
                }


                if (window['cordova']) {
                    // Parse Push
                    this.ParsePush.init();
                }


                let user = Parse.User.current();
                updateUser.each((value, key) => {
                    user.set(key, value);
                });
                user.save(updateUser).then(resolve, reject);

            }, reject);
        });
    }

    destroy(data) {
        return Parse.Cloud.run('destroyUser', data);
    }

    validateEmail(input) {
        return Parse.Cloud.run('validateEmail', {email: input});
    }

    validateUsername(input) {
        return Parse.Cloud.run('validateUsername', {username: input});
    }

    all(params) {
        return Parse.Cloud.run('getUsers', params);
    }

    follow(userId) {
        return Parse.Cloud.run('followUser', {userId: userId});
    }

    findByEmail(email) {
        return Parse.Cloud.run('findUserByEmail', {email: email});
    }

    profile(username) {
        return Parse.Cloud.run('profile', {username: username})
    }

    list(params) {
        return Parse.Cloud.run('listUsers', params)
    }

    getFollowers(username) {
        return Parse.Cloud.run('getFollowers', {username: username})
    }

    getLikers(galleryId) {
        return Parse.Cloud.run('getLikers', {galleryId: galleryId})
    }

    getFollowing(username) {
        return Parse.Cloud.run('getFollowing', {username: username})
    }

}
