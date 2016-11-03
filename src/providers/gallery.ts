import { Injectable } from '@angular/core';

declare var Parse: any;

@Injectable()
export class Gallery {

    fields = [
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
        'expiresAt',
        'icon',
    ];

    ParseObject: any = Parse.Object.extend('Gallery', {});
    tempParams: any;
    tempCache: any = [];

    constructor() {
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

    likeGallery(params) {
        return Parse.Cloud.run('likeGallery', { galleryId: params.galleryId });
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
                    this.tempCache = result;
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
    get(parseId) {
        return new Parse.Query(this.ParseObject).include('profile').get(parseId);
    }

    put(item) {

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
