import {Injectable} from "@angular/core";
import {IParamsLocation} from "../models/parse.params.location.model";
import {IGallery} from "../models/gallery.model";
import * as PouchDB from "pouchdb";

declare var Parse: any;

//PouchDB.debug.enable('*');
PouchDB.debug.disable();

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

    near(params: IParamsLocation): Promise<any> {
        let query = new Parse.Query(this._ParseObject);
        // Limit by page
        query.exists('location');
        query.withinKilometers('location', params.location, 100);
        //query.near('location',params.location);
        //query.limit(params.limit);

        return query.find();
    }

    likeGallery(objectId: string): Promise<any> {
        return Parse.Cloud.run('likeGallery', {galleryId: objectId});
    }

    follow(params): Promise<any> {
        return Parse.Cloud.run('followUser', params);
    }

    search(params): Promise<any> {
        return Parse.Cloud.run('searchGallery', params);
    }

    cleanDB(): Promise<any> {
        this.data = [];
        return new Promise(resolve => {
            this.db
                .allDocs({include_docs: true})
                .then(result => Promise.all(result.rows.map(row => this.db.remove(row.doc))).then(resolve));
        });
    }

    public feed(params: any): Promise<any> {
        return new Promise((resolve, reject) => {
            let result = [];
            Parse.Cloud.run('feedGallery', params)
                 .then(data => data.map(item => result.push(item)))
                 .then((data: any) => resolve(result))
                 .catch(reject);
        });
    }

    cacheFind(data): Promise<any> {
        let promises = [];
        data.map(item => {
            let obj = {
                _id          : item.id,
                comments     : [],
                commentsTotal: item.commentsTotal,
                createdAt    : item.createdAt,
                image        : item.image,
                imageThumb   : item.imageThumb,
                likesTotal   : item.likesTotal,
                title        : item.title,
                views        : item.views,
                user         : {
                    id      : item.user.id,
                    name    : item.user.name,
                    username: item.user.username,
                    photo   : item.user.photo,

                },
            };

            obj.comments = item.comments.map(comment => {
                return {
                    id       : comment.id,
                    text     : comment.text,
                    user     : comment.user,
                    galleryId: item.id
                };
            })
            promises.push(obj);
        });

        console.log(promises);
        return Promise.all(promises.map(item => this.db.put(item)));
    }


    public findCache(): Promise<any> {
        return new Promise(resolve => {
            this.db.allDocs({include_docs: true}).then(data => {
                if (this.data.length > 0) {
                    resolve(this.data)
                } else {
                    if (data.total_rows) {
                        data.rows.map(row => {
                            //let doc = JSON.stringify(row.doc.data);
                            row.doc.createdAt = new Date(row.doc.createdAt);
                            this.data.push(row.doc);
                        });
                    }
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
