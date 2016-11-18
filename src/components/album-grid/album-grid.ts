import {Component, Input, OnInit} from '@angular/core';
import {AlbumFormModalComponent} from '../album-form-modal/album-form-modal';
import {Events, NavController} from 'ionic-angular';
import {GalleryAlbum} from '../../providers/gallery-album';
import {AlbumPhotoGridComponent} from '../album-photo-grid/album-photo-grid';
import {IonicUtil} from "../../providers/ionic-util";
import _ from 'underscore';

@Component({
    selector   : 'album-grid',
    templateUrl: 'album-grid.html'
})
export class AlbumGridComponent implements OnInit {

    @Input() username?: string;
    @Input() event: string;

    params = {
        limit: 15,
        page : 1
    };

    errorIcon: string      = 'ios-images-outline';
    errorText: string      = '';
    data                   = [];
    loading: boolean       = true;
    showEmptyView: boolean = false;
    showErrorView: boolean = false;
    canEdit: boolean       = false;
    _width: any;

    constructor(private provider: GalleryAlbum,
                private events: Events,
                private navCtrl: NavController,
                private util: IonicUtil,
    ) {
        this._width = this.util._widthPlatform / 3 + 'px';

        events.subscribe('albumgrid:reload', () => this.feed());
        events.subscribe('albumgrid:destroy', () => this.feed());
    }

    ngOnInit() {
        console.info(this.event + ':params');
        this.events.subscribe(this.event + ':params', params => {
            if (params) {
                this.params = params[0];
                if (this.params['username']) {
                    let username = Parse.User.current().get('username');
                    console.log(this.params['username'], username);
                    this.canEdit = (this.params['username'] == username) ? true : false;
                }
            }
            this.feed();
        });

        console.info(this.event + ':reload');
        this.events.subscribe(this.event + ':reload', () => {
            this.params.page = 1;
            this.data        = []
            this.feed();
        });
    }

    openAlbum(item) {
        console.log(item);
        this.navCtrl.push(AlbumPhotoGridComponent, {id: item.id});
    }

    albumForm() {
        this.navCtrl.push(AlbumFormModalComponent);
    }

    private feed(): void {
        console.log('Load Feed', this.params, this.loading);

        if (this.params.page == 1) {
            this.data    = [];
            this.loading = true;
        }

        this.provider.list(this.params).then(data => {
            if (data && data.length) {
                _.sortBy(data, 'createdAt').reverse().map(item => {
                    this.data.push(item);
                });
                this.events.publish(this.event + ':moreItem', true);
            } else {
                this.showEmptyView = false;
            }

            this.loading = false;
            this.events.publish(this.event + ':complete', null);
        }, error => {
            this.errorText     = error.message;
            this.showErrorView = true;
            this.events.publish(this.event + ':complete', null);
        });
    }

    public doTry(): void {
        this.showErrorView = false;
        this.feed();
    }

}
