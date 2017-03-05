import {Injectable} from "@angular/core";

declare var Parse: any;

@Injectable()
export class GalleryCommentProvider {

    private _fields = [
        'text',
        'user',
    ];

    private _ParseObject: any = Parse.Object.extend('GalleryComment', {});

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

    create(item: any): Promise<any> {
        return new this._ParseObject().save(item);
    }

    put(item: any): Promise<any> {

        if (item.address && item.address.geo) {
            item.location = new Parse.GeoPoint(item.address.geo);
        }

        if (!item.id) {
            let objPlace = new this._ParseObject();
            return objPlace.save(item);
        } else {
            return item.save();
        }

    }

    destroy(item): Promise<any> {
        return item.destroy();
    }
}
