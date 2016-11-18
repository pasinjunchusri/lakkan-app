import {Injectable} from '@angular/core';

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

    feed(params: any) {

        const _page  = params.page || 1;
        const _limit = params.limit || 24;

        return new Promise((resolve, reject) => {
            new Parse.Query('GalleryCommentProvider')
                .equalTo('gallery', params.gallery)
                .descending('createdAt')
                .limit(_limit)
                .skip((_page * _limit) - _limit)
                .find()
                .then((data: any) => {resolve(data)}, reject)
        });

    }

    create(item) {
        let ParseObjectRow = new this._ParseObject();
        return ParseObjectRow.save(item);
    }

    put(item) {

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

    destroy(item) {
        return item.destroy();
    }
}
