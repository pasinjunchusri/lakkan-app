import {Injectable} from '@angular/core';

declare var Parse: any;

@Injectable()
export class GalleryActivityProvider {

    private _fields      = [
        'name',
        'username',
        'status',
        'gender',
        'email',
        'photo',
        'photoThumb',
        'roleName',
    ];
    private _ParseObject = Parse.Object.extend('GalleryActivity', {});

    constructor() {
        this._fields.map(field => {
            Object.defineProperty(this._ParseObject.prototype, field, {
                get: function () {return this.get(field)},
                set: function (value) { this.set(field, value)}
            });
        });

        // This is a GeoPoint Object
        Object.defineProperty(this._ParseObject.prototype, 'location', {
            get: function () {return this.get('location');},
            set: function (val) {
                this.set('location', new Parse.GeoPoint({
                    latitude : val.latitude,
                    longitude: val.longitude
                }));
            }
        });
    }

    public feed(params):Promise<any> {
        return Parse.Cloud.run('feedActivity', params);
    }

    public checkAll():Promise<any>{
        return Parse.Cloud.run('clearActivity');
    }

}
