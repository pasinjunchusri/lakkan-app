import {AlbumFormModal} from '../album-form-modal/album-form-modal';
import {Component, Input} from '@angular/core';
import {Events, NavController} from 'ionic-angular';
import {GalleryAlbum} from '../../providers/gallery-album';
import {AlbumPhotoGrid} from '../album-photo-grid/album-photo-grid';
import _ from 'underscore';

@Component({
    selector   : 'album-grid',
    templateUrl: 'album-grid.html'
})
export class AlbumGrid {

    @Input() username?: string;

    params = {
        limit: 15,
        page : 1
    };

    errorIcon: string = 'ios-images-outline';
    errorText: string = '';
    data = [];
    loading: boolean = true;
    showEmptyView: boolean = false;
    showErrorView: boolean = false;
    canEdit: boolean = false;

    constructor(private provider: GalleryAlbum,
                public events: Events,
                public navCtrl: NavController
    ) {

        events.subscribe('photolist:params', params => {
            console.log('photolist:params', params);
            this.params = params[0];

            if(this.params['username']) {
                let username = Parse.User.current().get('username');
                console.log(this.params['username'], username);
                this.canEdit = (this.params['username'] == username) ? true :false;
            }
            this.feed();
        });

        events.subscribe('albumgrid:reload',() => this.feed() );
        events.subscribe('albumgrid:destroy',() => this.feed() );
    }

    openAlbum(item) {
        console.log(item);
        this.navCtrl.push(AlbumPhotoGrid, {id: item.id});
    }

    albumForm(){
        this.navCtrl.push(AlbumFormModal);
    }

    feed() {
        return new Promise((resolve,reject)=>{
            console.log('Load Feed', this.params, this.loading);
    
            if (this.params.page == 1) {
                this.data = [];
                this.loading = true;
            }
    
            this.provider.list(this.params).then(data => {

                if(this.canEdit && !this.data.length) {
                    this.data.push({create: true});
                }

                if (data && data.length) {
                    _.sortBy(data, 'createdAt').reverse().map(item => {
                        this.data.push(item);
                    });

                    this.loading = false;
                    this.events.publish('photolist:complete');
                } else {
                    this.showEmptyView = false;
                    this.events.publish('photolist:empty');
                }
                console.log(this.data);
                
                resolve(this.data);
            }, error => {
                this.errorText = error.message;
                this.showErrorView = true;
                this.events.publish('photolist:complete');
            });
        });
    }

}
