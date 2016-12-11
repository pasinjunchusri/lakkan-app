import {Injectable} from "@angular/core";
import {Storage} from "@ionic/storage";
import {ParsePushProvider} from "./parse-push";
import {IonicUtilProvider} from "./ionic-util";
import {IUserFollow} from "../models/user.model";
import * as PouchDB from "pouchdb";
import {IParams} from "../models/parse.params.model";
import _ from "underscore";
declare var Parse: any;

@Injectable()
export class UserProvider {
    db: any;
    dbFollowing: any;
    dbFolllowers: any;

    data: any[]          = [];
    dataFollowers: any[] = [];
    dataFollowing: any[] = [];

    private _fields          = [
        'name',
        'username',
        'status',
        'gender',
        'email',
        'photo',
        'photoThumb',
    ];
    private _ParseObject     = Parse.User.extend({});
            cordova: boolean = false;

    constructor(private ParsePush: ParsePushProvider,
                private util: IonicUtilProvider,
                private Storage: Storage
    ) {
        this.cordova = this.util.cordova;

        // Start
        this.db           = new PouchDB('User');
        this.dbFollowing  = new PouchDB('UserFollowing');
        this.dbFolllowers = new PouchDB('UserFollowers');

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
        return new Parse.User.current();
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


    update(form) {
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

    getProfile(username: string): Promise<any> {
        return Parse.Cloud.run('profile', {username: username})
    }

    getProfileCache(username: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.findCache().then(data => resolve(_.find(data, {username: username})));
        });
    }

    getCache(id: string): Promise<any> {
        return this.db.get(id);
    }

    public findCache(params?: IParams): Promise<any> {
        return new Promise(resolve => {
            this.db.allDocs({include_docs: true}).then(data => {
                console.log(data);
                this.data = [];
                if (data.total_rows) {
                    data.rows.map(row => {
                        //let doc = JSON.stringify(row.doc.data);
                        row.doc.createdAt = new Date(row.doc.createdAt);
                        this.data.push(row.doc);
                    });

                    if (params.username) {
                        let _data = _.find(this.data, {username: params.username});
                        console.log('cache username', _data);
                        resolve(_data);
                    } else {
                        console.log('cache', this.data);
                        resolve(this.data);
                    }
                } else {
                    resolve(this.data);
                }
            })
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
        return user.signUp(null);

    }

    signIn(obj) {
        return new Promise((resolve, reject) => {
            Parse.User.logIn(obj.username, obj.password).then(currentUser => {
                console.log('logIn', currentUser);

                if (this.cordova) {
                    // Parse Push
                    this.ParsePush.init();
                }
                resolve(currentUser);

            }, reject);
        });
    }

    setStorage(user: any): void {
        let obj = {
            id      : user.id,
            name    : user.get('name'),
            username: user.get('username'),
            email   : user.get('email'),
            gender  : user.get('gender'),
            photo   : user.get('photo'),
            status  : user.get('status'),
        };
        console.log(obj);
        this.Storage.set('user', obj)
    }

    getStorage(): Promise<any> {
        return this.Storage.get('user');
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


    follow(params: IUserFollow): Promise<any> {
        return Parse.Cloud.run('followUser', params);
    }

    findByEmail(email: string) {
        return Parse.Cloud.run('findUserByEmail', {email: email});
    }

    findUserFacebook(facebookId: string) {
        return Parse.Cloud.run('findUserFacebookId', {facebookId: facebookId});
    }

    list(params: any): Promise<any> {
        return Parse.Cloud.run('listUsers', params)
    }

    getLikers(galleryId: string) {
        return Parse.Cloud.run('getLikers', {galleryId: galleryId})
    }

    getFollowers(username: string): Promise<any> {
        return Parse.Cloud.run('getFollowers', {username: username})
    }

    // Following

    getFollowing(username: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.cleanDBFollowing()
                .then(() => Parse.Cloud.run('getFollowing', {username: username}))
                .then(data => data.map(item => this.dbFollowing.put(item)))
                .then(() => this.followingCache())
                .then((data: any) => {
                    resolve(data);
                }, reject);
        });
    }

    cleanDBFollowing(): Promise<any> {
        this.data = [];
        return new Promise(resolve => {
            this.dbFollowing
                .allDocs({include_docs: true})
                .then(result => Promise.all(result.rows.map(row => this.dbFollowing.remove(row.doc))).then(resolve));
        });
    }


    followingCache(): Promise<any> {
        return new Promise(resolve => {
            if (this.data.length > 0) {
                resolve(this.data)
            } else {
                this.dbFollowing.allDocs({include_docs: true}).then(data => {
                    if (data.total_rows) {
                        this.data = data.rows.map(row => row.doc);
                    }
                    resolve(this.data);
                });
            }
        });
    }


}
