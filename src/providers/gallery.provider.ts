import {Injectable} from "@angular/core";
import {IParamsLocation} from "../models/parse.params.location.model";
import {IGallery} from "../models/gallery.model";
import {IParams} from "../models/parse.params.model";

declare const Parse: any;


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

    data: any[] = [];

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

    public near(params: IParamsLocation): Promise<any> {
        let query = new Parse.Query('Gallery');
        // Limit by page
        //query.exists('location');
        //query.withinKilometers('location', params.location, 100);
        query.near('location',params.location);
        //query.limit(params.limit);

        return query.find();
    }

    public likeGallery(objectId: string): Promise<any> {
        return Parse.Cloud.run('likeGallery', {galleryId: objectId});
    }

    public bookmarkGallery(objectId: string): Promise<any> {
        return Parse.Cloud.run('galleryBookmark', {galleryId: objectId});
    }
    public feedBookmarkGallery(params: IParams): Promise<any> {
        return Parse.Cloud.run('feedGalleryBookmark', params);
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


    public feed(params: IParams): Promise<any> {
        return Parse.Cloud.run('feedGallery', params);
    }

    comments(params) {
        return Parse.Cloud.run('commentGallery', params);
    }

    // Parse Crud
    get(objectId: string): Promise<any> {
        return Parse.Cloud.run('getGallery', {id: objectId});
    }

    getParse(objectId: string): Promise<any> {
        return new Parse.Query(this._ParseObject).get(objectId);
    }


    createGallery(form:any){
        return Parse.Cloud.run('createGallery', form);
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
