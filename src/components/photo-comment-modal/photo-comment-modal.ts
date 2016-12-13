import {Component} from "@angular/core";
import {NavParams, ViewController} from "ionic-angular";
import {GalleryCommentProvider} from "../../providers/gallery-comment";
import {IonicUtilProvider} from "../../providers/ionic-util";
import {GalleryProvider} from "../../providers/gallery";
import _ from "underscore";
declare const Parse: any;

@Component({
    selector   : 'photo-comment-modal',
    templateUrl: 'photo-comment-modal.html'
})
export class PhotoCommentModalComponent {

    errorIcon: string      = 'ios-text-outline';
    errorText: string      = '';
    data                   = [];
    loading: boolean       = true;
    showEmptyView: boolean = false;
    showErrorView: boolean = false;
    moreItem: boolean      = false;
    gallery: any;
    form: any;
    galleryId: string;
    user: any;

    params = {
        limit    : 20,
        page     : 1,
        galleryId: null
    };

    constructor(private navparams: NavParams,
                private viewCtrl: ViewController,
                private provider: GalleryCommentProvider,
                private util: IonicUtilProvider,
                private Gallery: GalleryProvider
    ) {
        this.form = {
            text: ''
        };

        this.user = Parse.User.current();

        //this.gallery        = this.navparams.data.obj;
        //this.onQuery();
    }

    //this.params.galleryId = this.gallery.id;

    ionViewWillEnter() {
        console.info('ionViewWillEnter photoComment');
        this.galleryId = this.navparams.data.galleryId;
        // More Item
        this.onGallery(this.galleryId);
        this.params.galleryId = this.galleryId;
    }

    onGallery(galleryId: string) {
        this.util.onLoading();
        this.Gallery.getParse(galleryId).then(gallery => {
                this.form.gallery = gallery;
                return this.onQuery()
            })
            .then(() => this.util.endLoading())
            .catch(error => {
                this.util.toast('Error');
                this.util.endLoading();
                this.loading       = false;
                this.showErrorView = true;
            })
        ;
    }

    onQuery() {
        return new Promise((resolve, reject) => {

            if (this.params.page == 1) {
                this.data = [];
            }

            this.provider.feed(this.params).then((data: [any]) => {
                if (data) {
                    this.data = this.parseData(data);
                    this.showErrorView = false;
                    this.showEmptyView = false;
                    this.moreItem      = true;
                } else {
                    this.showEmptyView = true;
                    this.moreItem      = false;
                }

                this.loading = false;
                resolve(data);
            }).catch(error => {
                this.errorText     = error.message;
                this.showErrorView = true;
                reject(this.errorText)
            });
        });
    }

    parseData(data: any[]): any[] {
        return _.sortBy(data, 'createdAt').map(item => {
            item.class = item.user.id === this.user.id ? 'right' : 'left';
            return item;
        });

    }

    dismiss() {
        this.viewCtrl.dismiss();
    }

    onComment(form) {
        if (form.valid) {
            this.util.onLoading();
            this.provider.create(this.form).then(() => {
                this.form.text = '';
                setTimeout(() => this.onQuery().then(() => this.util.endLoading()), 500)
            });
        }
    }
}
