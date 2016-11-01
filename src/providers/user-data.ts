import {Injectable} from '@angular/core';

declare var Parse: any;

@Injectable()
export class UserData {

    fields = [
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

    ParseObject: any = Parse.Object.extend('UserData', {});
    tempParams: any;
    tempCache: any   = [];

    constructor() {
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

    profile(username) {
        return Parse.Cloud.run('profile', {username: username})
    }
}
