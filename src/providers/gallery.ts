import {Injectable} from '@angular/core';

declare var Parse: any;

@Injectable()
export class Gallery {

    private _fields = [
        'title',
        'commentsTotal',
        'views',
        'likesTotal',
        'user',
        'profile',
        'hashtags',
        'words',
        'privacity',
        'address',
        'lang',
        'image',
        'imageThumb',
        'isApproved',
        'icon',
    ];

    private _ParseObject: any = Parse.Object.extend('Gallery', {});
            tempParams: any;
            tempCache: any    = [];

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

    near(params) {
        let query = new Parse.Query(this._ParseObject);
        // Limit by page
        query.exists('location');
        query.withinKilometers('location', params.location, 100);
        //query.near('location',params.location);
        //query.limit(params.limit);

        return query.find();
    }

    likeGallery(params) {
        return Parse.Cloud.run('likeGallery', {galleryId: params.id});
    }

    follow(params) {
        return Parse.Cloud.run('followUser', params);
    }

    search(params) {
        return Parse.Cloud.run('searchGallery', params);
    }

    feed(params) {
        return Parse.Cloud.run('feedGallery', params);
    }

    feedCache(params) {
        return new Promise((resolve, reject) => {
            console.log(params.page, this.tempParams['page']);
            if (params.page == this.tempParams['page']) {
                resolve(this.tempCache);
            } else {
                Parse.Cloud.run('feedGallery', params).then(result => {
                    this.tempParams = params;
                    this.tempCache  = result;
                    resolve(result);
                }, reject);
            }
        });
    }

    comments(params) {
        return Parse.Cloud.run('commentGallery', params);
    }

    getAlbum(params) {
        return Parse.Cloud.run('getAlbum', params);
    }

    // Parse Crud
    get(galleryId) {
        return new Parse.Query(this).include('profile').get(galleryId);
    }

    put(item) {

        if (item.address && item.address.geo) {
            item.location = new Parse.GeoPoint(item.address.geo);
        }


        if (!item.id) {
            var objPlace = new this._ParseObject();
            return objPlace.save(item);
        } else {
            return item.save();
        }

    }

    destroy(item) {
        return item.destroy();
    }
}
