import { Injectable } from '@angular/core';
import { ParsePush } from "./parse-push";

export interface IUser {
    name: string;
    username: string;
    password: string,
    email: string;
    gender?: string;
    brithday?: any;
    phone?: number;
    website?: string;
}

@Injectable()
export class User {
    fields = [
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
                get: function () { return this.get(field) },
                set: function (value) { this.set(field, value) }
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


    update(form: IUser) {
        let user = Parse.User.current();
        // User Language
        return user.save(form);
    }

    setPhoto(parseFile) {
        let user = Parse.User.current();
        user.set('photo', parseFile);
        return user.save();
    }

    recoverPassword(email: string) {
        return Parse.User.requestPasswordReset(email);
    }

    getPublicData(user) {
        return new Promise((resolve, reject) => {
            new Parse.Query('UserData').equalTo('user', user).first().then((userData) => {
                if (userData) {
                    resolve(userData);
                } else {
                    reject(Parse.Promise.error({
                        code: 1,
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

    signInViaFacebook(authData: any) {
        return new Promise((resolve, reject) => {
            let facebookAuthData = {
                id: authData['authResponse']['userID'],
                access_token: authData['authResponse']['accessToken'],
                expiration_date: (new Date().getTime() + 1000).toString()
            };
            console.log('facebookAuthData', facebookAuthData);
            Parse.FacebookUtils.logIn(facebookAuthData, {
                success: function (user) {
                    if (!user.existed()) {
                        console.log("User signed up and logged in through Facebook!", user);
                    } else {
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
            Parse.User.logIn(obj.username.toLowerCase(), obj.password).then(currentUser => {

                console.log('currentUser', currentUser);
                console.log('cordova', window['cordova']);


                if (window['cordova']) {
                    // Parse Push
                    this.ParsePush.init();
                }


                resolve(currentUser);

            }, reject);
        });
    }

    changePassword(password: string) {
        return Parse.Cloud.run('changePassword', { password: password });
    }

    destroy(data) {
        return Parse.Cloud.run('destroyUser', data);
    }

    validateEmail(input: string) {
        return Parse.Cloud.run('validateEmail', { email: input });
    }

    validateUsername(input: string) {
        return Parse.Cloud.run('validateUsername', { username: input });
    }

    all(params: any) {
        return Parse.Cloud.run('getUsers', params);
    }

    follow(userId: string) {
        return Parse.Cloud.run('followUser', { userId: userId });
    }

    findByEmail(email: string) {
        return Parse.Cloud.run('findUserByEmail', { email: email });
    }

    list(params: any) {
        return Parse.Cloud.run('listUsers', params)
    }

    getFollowers(username: string) {
        return Parse.Cloud.run('getFollowers', { username: username })
    }

    getLikers(galleryId: string) {
        return Parse.Cloud.run('getLikers', { galleryId: galleryId })
    }

    getFollowing(username: string) {
        return Parse.Cloud.run('getFollowing', { username: username })
    }

}
