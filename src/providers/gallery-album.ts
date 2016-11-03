import {Injectable} from '@angular/core';

declare var Parse: any;

@Injectable()
export class GalleryAlbum {

    fields = [
        'title',
        'description',
        'lang',
        'qtyPhotos',
        'user',
        'image',
        'imageThumb',
    ];

    ParseObject: any = Parse.Object.extend('GalleryAlbum', {});
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

    list(params:any) {
        return Parse.Cloud.run('listAlbum', params);
    }

    photo(params:any) {
        return Parse.Cloud.run('photoAlbum', params);
    }

    // Parse Crud
    get(parseId:string) {
        return new Parse.Query(this.ParseObject).include('profile').get(parseId);
    }

    put(item:any) {

        if (item.address && item.address.geo) {
            item.location = new Parse.GeoPoint(item.address.geo);
        }


        if (!item.id) {
            let objPlace = new this.ParseObject();
            return objPlace.save(item);
        } else {
            return item.save();
        }

    }

    destroy(item) {
        return item.destroy();
    }
}
