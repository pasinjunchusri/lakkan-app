import {Component, ViewChild} from '@angular/core';
import {NavParams, ViewController} from "ionic-angular";
import {GalleryComment} from "../../providers/gallery-comment";
import {IonicUtil} from "../../providers/ionic-util";
import _ from 'underscore';

@Component({
    selector   : 'photo-comment-modal',
    templateUrl: 'photo-comment-modal.html'
})
export class PhotoCommentModalComponent {

    @ViewChild('input') myInput;

    errorIcon: string      = 'ios-text-outline';
    errorText: string      = '';
    data                   = [];
    loading: boolean       = true;
    showEmptyView: boolean = false;
    showErrorView: boolean = false;
    moreItem: boolean      = false;
    gallery: any;
    form: any;
    params                 = {
        limit  : 20,
        page   : 1,
        gallery: null
    };

    constructor(private navparams: NavParams,
                private viewCtrl: ViewController,
                private provider: GalleryComment,
                private util: IonicUtil
    ) {
        this.gallery        = this.navparams.data.obj;
        this.params.gallery = this.gallery;
        this.form           = {
            gallery: this.gallery,
            text   : ''
        }
        this.onQuery();
    }

    ionViewLoaded() {
        setTimeout(() => {
            console.log('set focus');
            this.myInput.setFocus();
        }, 150)
    }

    onQuery() {
        return new Promise((resolve, reject) => {
            console.log('Load Feed', this.params, this.loading);

            if (this.params.page == 1) {
                this.data = [];
            }

            this.provider.feed(this.params).then((data: [any]) => {
                if (data && data.length) {
                    _.sortBy(data, 'createdAt').map(item => {
                        this.data.push(item);
                    });
                    this.showErrorView = false;
                    this.showEmptyView = false;
                    this.moreItem      = true;
                } else {
                    if (!this.data.length) {
                        this.showEmptyView = false;
                    }
                    this.moreItem = false;
                }

                this.loading = false;
                resolve(data);
            }, error => {
                this.errorText     = error.message;
                this.showErrorView = true;
                reject(this.errorText)
            });
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
