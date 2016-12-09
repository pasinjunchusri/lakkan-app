import {Injectable} from "@angular/core";
import * as PouchDB from "pouchdb";
declare var Parse: any;

@Injectable()
export class GalleryAlbumProvider {

    private _fields = [
        'title',
        'description',
        'lang',
        'qtyPhotos',
        'user',
        'image',
        'imageThumb',
    ];

    private _ParseObject: any = Parse.Object.extend('GalleryAlbum', {});

    db: any;
    data: any[] = [];

    constructor() {

        this.db = new PouchDB('GalleryAlbum', {auto_compaction: true});

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

    find(params: any): Promise<any> {
        return Parse.Cloud.run('listAlbum', params);
    }

    cleanCache(): Promise<any> {
        this.data = [];
        return new Promise(resolve => {
            this.db
                .allDocs({include_docs: true})
                .then(result => Promise.all(result.rows.map(row => this.db.remove(row.doc))).then(resolve));
        });
    }


    findCache(params?: any): Promise<any> {
        return new Promise(resolve => {
            if (this.data.length > 0) {
                resolve(this.data)
            } else {
                this.db.allDocs({include_docs: true}).then(data => {
                    if (data.total_rows) {
                        this.data = data.rows.map(row => row.doc);
                    }
                    resolve(this.data);
                })
            }
        });
    }

    photo(params: any) {
        return Parse.Cloud.run('photoAlbum', params);
    }

    getAlbum(params) {
        return Parse.Cloud.run('getAlbum', params);
    }

    // Parse Crud
    get(parseId: string) {
        return new Parse.Query(this._ParseObject).include('profile').get(parseId);
    }

    put(item: any) {

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
