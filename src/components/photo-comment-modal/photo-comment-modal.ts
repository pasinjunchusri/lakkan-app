import { Component, ViewChild } from '@angular/core';
import { NavParams, ViewController } from "ionic-angular";
import { GalleryComment } from "../../providers/gallery-comment";
import { IonicUtil } from "../../providers/ionic-util";
import _ from 'underscore';

@Component({
    selector: 'photo-comment-modal',
    templateUrl: 'photo-comment-modal.html'
})
export class PhotoCommentModal {

    @ViewChild('input') myInput;

    errorIcon: string = 'ios-text-outline';
    errorText: string = '';
    data = [];
    loading: boolean = true;
    showEmptyView: boolean = false;
    showErrorView: boolean = false;
    gallery: any;
    form: any;

    constructor(public navparams: NavParams,
        public viewCtrl: ViewController,
        public provider: GalleryComment,
        public util: IonicUtil
    ) {
        this.gallery = this.navparams.data.obj;
        this.form = {
            gallery: this.gallery,
            text: ''
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
            this.loading = true;
            this.form.text = '';
            let relation = this.gallery.relation('comments');
            relation.query().find().then(comments => {
                this.loading = false;
                if (comments.length > 0) {
                    this.data = _.sortBy(comments, 'createdAt');
                } else {
                    this.showEmptyView = true;
                }
                resolve(comments)
            }, error => {
                this.errorText = error.message;
                this.showErrorView = true;
            });

        });
    }

    dismiss() {
        this.viewCtrl.dismiss();
    }

    onComment(form) {
        if (form.valid) {
            this.util.onLoading();
            this.provider.create(this.form).then(result => {
                setTimeout(() => this.onQuery().then(() => this.util.endLoading()), 500)
            });
        }
    }
}
