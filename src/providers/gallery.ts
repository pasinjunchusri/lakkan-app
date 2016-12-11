import {Injectable} from "@angular/core";
import {IParamsLocation} from "../models/parse.params.location.model";
import {IGallery} from "../models/gallery.model";
import {IParams} from "../models/parse.params.model";
import * as PouchDB from "pouchdb";
import _ from "underscore";

declare const Parse: any;
declare const require: any;

//PouchDB.debug.enable('*');
//PouchDB.debug.disable();

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

        this.db = new PouchDB('Gallery', {auto_compaction: true});

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

    public near(params: IParamsLocation): Promise<any> {
        let query = new Parse.Query(this._ParseObject);
        // Limit by page
        query.exists('location');
        query.withinKilometers('location', params.location, 100);
        //query.near('location',params.location);
        //query.limit(params.limit);

        return query.find();
    }

    public likeGallery(objectId: string): Promise<any> {
        return Parse.Cloud.run('likeGallery', {galleryId: objectId});
    }

    public follow(params): Promise<any> {
        return Parse.Cloud.run('followUser', params);
    }

    public search(params): Promise<any> {
        return Parse.Cloud.run('searchGallery', params);
    }

    public updatedGallery(params: any): Promise<any> {
        console.log('update', params);
        return Parse.Cloud.run('updateGallery', params);
    }

    public cleanCache(): Promise<any> {
        this.data = [];
        return new Promise((resolve, reject) => {
            this.db
                .allDocs({include_docs: true})
                .then(result => Promise.all(result.rows.map(row => this.db.remove(row.doc))))
                .then(resolve)
                .catch(reject);
        });
    }

    public feed(params: IParams): Promise<any> {
        return Parse.Cloud.run('feedGallery', params);
    }

    public feedCache(data: any): Promise<any> {
        let db = new PouchDB('Gallery', {auto_compaction: true});
        return Promise.all(data.map(item => db.put(item)));
    }

    public findCache(params: IParams): Promise<any> {
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

    //feed(params: any){
    //    return Parse.Cloud.run('feedGallery', params);
    //}

    comments(params) {
        return Parse.Cloud.run('commentGallery', params);
    }

    // Parse Crud
    get(objectId: string): Promise<any> {
        return Parse.Cloud.run('getGallery', {id: objectId});
    }

    getCache(objectId: string): Promise<any> {
        return this.db.get(objectId);
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
        return Parse.Cloud.run('destroyGallery', {id: objectId});
    }
}
