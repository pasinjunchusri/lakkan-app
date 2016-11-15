import {Injectable} from '@angular/core';
import {ParsePush} from "./parse-push";
import {IonicUtil} from "./ionic-util";
import {IUserFollow, IUser} from "../models/user.model";

declare var Parse: any;

@Injectable()
export class User {
    private _fields          = [
        'name',
        'username',
        'status',
        'gender',
        'email',
        'photo',
        'photoThumb',
        'roleName',
    ];
    private _ParseObject     = Parse.User.extend({});
            cordova: boolean = false;

    constructor(private ParsePush: ParsePush, private util: IonicUtil) {
        this.cordova = this.util.cordova;

        this._fields.map(field => {
            Object.defineProperty(this._ParseObject.prototype, field, {
                get: function () { return this.get(field) },
                set: function (value) { this.set(field, value) }
            });
        });

        // This is a GeoPoint Object
        Object.defineProperty(this._ParseObject.prototype, 'location', {
            get: function () { return this.get('location'); },
            set: function (val) {
                this.set('location', new Parse.GeoPoint({
                    latitude : val.latitude,
                    longitude: val.longitude
                }));
            }
        });
    }

    current(): any {
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
        return Parse.User.current().save(form);
    }

    updatePhoto(parseFile) {
        let user = Parse.User.current();
        user.set('photo', parseFile);
        return user.save();
    }

    recoverPassword(email: string) {
        return Parse.User.requestPasswordReset(email);
    }

    profile(user: any) {
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

    logout(): void {
        Parse.User.logOut();
    }

    updateWithFacebookData() {
        return Parse.Cloud.run('saveFacebookPicture');
    }

    facebookSyncProfile(fbData: any) {
        return new Promise((resolve, reject) => {
            let currentUser = Parse.User.current();

            if (!currentUser.get('facebook') && fbData.id) {
                currentUser.set('facebook', fbData.id);
            }

            if (!currentUser.get('email') && fbData.email) {
                currentUser.set('email', fbData.email);
            }

            if (!currentUser.get('name') && fbData.name) {
                currentUser.set('name', fbData.name);
            }

            if (!currentUser.get('gender') && fbData.gender) {
                currentUser.set('gender', fbData.gender);
            }

            if (!currentUser.get('birthdate') && fbData.birthday) {
                currentUser.set('birthdate', new Date(fbData.birthday));
            }

            currentUser.save(null).then(() => {
                if (!currentUser.get('photo')) {
                    this.updateWithFacebookData().then(resolve);
                } else {
                    resolve();
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
            Parse.User.logIn(obj.username, obj.password).then(currentUser => {

                if (this.cordova) {
                    // Parse Push
                    this.ParsePush.init();
                }
                resolve(currentUser);

            }, reject);
        });
    }

    changePassword(password: string) {
        return Parse.Cloud.run('changePassword', {password: password});
    }

    destroy(data) {
        return Parse.Cloud.run('destroyUser', data);
    }

    validateEmail(input: string) {
        return Parse.Cloud.run('validateEmail', {email: input});
    }

    validateUsername(input: string) {
        return Parse.Cloud.run('validateUsername', {username: input});
    }

    all(params: any) {
        return Parse.Cloud.run('getUsers', params);
    }

    follow(params: IUserFollow) {
        return Parse.Cloud.run('followUser', params);
    }

    findByEmail(email: string) {
        return Parse.Cloud.run('findUserByEmail', {email: email});
    }

    findUserFacebook(facebookId: string) {
        return Parse.Cloud.run('findUserFacebookId', {facebookId: facebookId});
    }

    list(params: any) {
        return Parse.Cloud.run('listUsers', params)
    }

    getFollowers(username: string) {
        return Parse.Cloud.run('getFollowers', {username: username})
    }

    getLikers(galleryId: string) {
        return Parse.Cloud.run('getLikers', {galleryId: galleryId})
    }

    getFollowing(username: string) {
        return Parse.Cloud.run('getFollowing', {username: username})
    }

}
