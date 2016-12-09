import {Component, Input, OnInit} from "@angular/core";
import {App, Events, NavController} from "ionic-angular";
import {AlbumFormModalComponent} from "../album-form-modal/album-form-modal";
import {GalleryAlbumProvider} from "../../providers/gallery-album";
import {AlbumPhotoGridComponent} from "../album-photo-grid/album-photo-grid";
import {IonicUtilProvider} from "../../providers/ionic-util";
import _ from "underscore";
import {IParams} from "../../models/parse.params.model";
declare const Parse: any;

@Component({
    selector   : 'album-grid',
    templateUrl: 'album-grid.html'
})
export class AlbumGridComponent implements OnInit {

    @Input() username?: string;
    @Input() event: string;

    params = {
        limit   : 15,
        page    : 1,
        username: null
    };

    errorIcon: string      = 'ios-images-outline';
    errorText: string      = '';
    data                   = [];
    loading: boolean       = true;
    showEmptyView: boolean = false;
    showErrorView: boolean = false;
    canEdit: boolean       = false;
    _width: any;

    constructor(private provider: GalleryAlbumProvider,
                private events: Events,
                private navCtrl: NavController,
                private util: IonicUtilProvider,
                private app: App,
    ) {
        this._width = this.util._widthPlatform / 3 + 'px';

        events.subscribe('albumgrid:reload', () => this.feed());
        events.subscribe('albumgrid:destroy', () => this.feed());
    }

    ngOnInit() {
        this.username = Parse.User.current().get('username');

        this.events.subscribe(this.event + ':params', params => {
            console.warn('album starter ', this.event + ':params', params);
            this.params = params[0];
            this.feed();
        });

        // Server Request
        this.events.subscribe(this.event + ':params', (params: IParams) => {
            console.info(this.event + ':params', params);
            this.params = params[0];
            this.feed();
        });

        // Reload
        this.events.subscribe(this.event + ':reload', (params: IParams) => {
            console.warn('album-grid', this.event + ':reload');
            this.params  = params[0];
            this.canEdit = this.validCanEdit(this.params.username);
            // Clean Cache and Reload
            this.feed()
                .then(() => this.events.publish('scroll:up'))
                .catch(console.error);
            ;
        });
    }

    validCanEdit(username): boolean {
        return (this.username == username) ? true : false;
    }

    ngOnDestroy() {
        console.warn('element destroy album grid');
        this.events.unsubscribe(this.event + ':reload');
        this.events.unsubscribe(this.event + ':params');
        this.events.unsubscribe('albumgrid:reload');
        this.events.unsubscribe('albumgrid:destroy');
    }

    openAlbum(item): void {
        this.app.getRootNav().push(AlbumPhotoGridComponent, {id: item.id});
    }

    albumForm(): void {
        this.navCtrl.push(AlbumFormModalComponent);
    }

    feed(): Promise<any> {
        return new Promise((resolve, reject) => {
            if (this.params.page == 1) {
                this.data = [];
                if (this.validCanEdit(this.params.username)) {
                    this.data.push({create: true})
                }
            }

            this.provider.find(this.params).then(data => {
                if (data) {
                    this.showErrorView = false;
                    this.showEmptyView = false;
                    _.sortBy(data, 'createdAt').reverse().map(item => this.data.push(item));
                    this.events.publish(this.event + ':moreItem', true);
                }

                if(!this.data.length){
                    this.showEmptyView = true;
                    this.events.publish(this.event + ':moreItem', true);
                }

                this.loading = false;
                this.events.publish(this.event + ':complete', null);
                resolve(data);
            }).catch(error => {
                this.errorText     = error.message;
                this.showErrorView = true;
                this.loading       = false;
                this.events.publish(this.event + ':complete', null);
                reject(this.errorText);
            });
        });
    }

    public doTry(): void {
        this.showErrorView = false;
        this.feed();
    }

}
