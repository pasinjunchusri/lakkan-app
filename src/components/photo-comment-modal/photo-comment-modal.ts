import {Component, ViewChild} from '@angular/core';
import {NavParams, ViewController} from "ionic-angular";
import {GalleryComment} from "../../providers/gallery-comment";
import {IonicUtil} from "../../providers/ionic-util";


@Component({
    selector   : 'photo-comment-modal',
    templateUrl: 'photo-comment-modal.html'
})
export class PhotoCommentModal {

    @ViewChild('input') myInput;

    comment: string  = '';
    data             = [];
    loading: boolean = true;
    noData: boolean  = false;
    gallery: any;
    text: string;
    form: any;

    constructor(public navparams: NavParams,
                public viewCtrl: ViewController,
                public provider: GalleryComment,
                public util: IonicUtil
    ) {
        this.gallery = this.navparams.data.obj;
        this.form    = {
            gallery: this.gallery,
            text   : null
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
            this.loading   = true;
            this.form.text = '';
            let relation   = this.gallery.relation('comments');
            relation.query().find().then(comments => {
                this.loading = false;
                if (comments.length > 0) {
                    this.data   = comments;
                    this.noData = false
                } else {
                    this.noData = true;
                }

                resolve(comments)
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
                this.onQuery().then(() => this.util.endLoading());
            })
        }
    }
}
