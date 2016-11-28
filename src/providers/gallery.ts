import {Injectable} from "@angular/core";
import {IParamsLocation} from "../models/parse.params.location.model";
import {IGallery} from "../models/gallery.model";
import * as PouchDB from "pouchdb";
import _ from "underscore";


//PouchDB.debug.enable('*');
declare var Parse: any;

@Injectable()
export class GalleryProvider {

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

    db: any;
    data: any[] = [];

    constructor() {

        this.db = new PouchDB('Gallery');

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

    cleanDB(): Promise<any> {
        this.data = [];
        return new Promise((resolve, reject) => this.db.destroy().then(() => this.db = new PouchDB('Gallery')).then(resolve, reject));
    }

    near(params: IParamsLocation) {
        let query = new Parse.Query(this._ParseObject);
        // Limit by page
        query.exists('location');
        query.withinKilometers('location', params.location, 100);
        //query.near('location',params.location);
        //query.limit(params.limit);

        return query.find();
    }

    likeGallery(objectId: string) {
        return Parse.Cloud.run('likeGallery', {galleryId: objectId});
    }

    follow(params) {
        return Parse.Cloud.run('followUser', params);
    }

    search(params) {
        return Parse.Cloud.run('searchGallery', params);
    }

    feed(params: any): Promise<any> {
        return new Promise((resolve, reject) => {
            Parse.Cloud.run('feedGallery', params).then((data: any) => {
                let _data = [];
                _.map(data, (item: any) => {
                    let obj      = item;
                    obj._id      = item.id;
                    obj.user     = item.user.attributes;
                    obj.comments = [];

                    if (item.commentsTotal) {
                        let comments = [];
                        item.comments.map(comment => {
                            let _comment  = comment.attributes;
                            _comment.user = comment.user.attributes;
                            comments.push(_comment);
                        })
                        obj.comments = comments;
                    }
                    this.db.put(obj);
                    this.data.push(obj);
                    _data.push(obj);
                });

                resolve(_data);

            }, reject);
        });
    }

    loadCache(): Promise<any> {
        return new Promise(resolve => {
            this.db.allDocs({include_docs: true}).then(data => {
                if (data.total_rows) {
                    data.rows.map(row => {
                        //let doc = JSON.stringify(row.doc.data);
                        if (row.doc.image) {
                            row.doc.image._url = row.doc.image.url;
                        }
                        if (row.doc.user.image) {
                            row.doc.user.image._url = row.doc.user.image.url;
                        }
                        row.doc.createdAt = new Date(row.doc.createdAt);
                        this.data.push(row.doc);
                    });
                }
                resolve(this.data);
            })
        });
    }

    //feed(params: any){
    //    return Parse.Cloud.run('feedGallery', params);
    //}

    comments(params) {
        return Parse.Cloud.run('commentGallery', params);
    }

    getAlbum(params) {
        return Parse.Cloud.run('getAlbum', params);
    }

    // Parse Crud
    get(objectId: string) {
        return new Parse.Query(this._ParseObject).include('profile').get(objectId);
    }

    put(item: IGallery) {

        if (item.address && item.address.geo) {
            item.location = new Parse.GeoPoint(item.address.geo);
        }

        if (!item.id) {
            // New Item
            return new this._ParseObject().save(item);
        } else {
            // Update item
            return item.save();
        }

    }

    destroy(objectId: string) {
        return new Promise((resolve, reject) => {
            this.get(objectId).then(item => {
                item.destroy().then(resolve).catch(reject);
            }).catch(reject);
        });
    }
}
