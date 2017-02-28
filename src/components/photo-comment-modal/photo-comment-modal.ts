import {Component, ViewChild} from "@angular/core";
import {NavParams, Content, ViewController} from "ionic-angular";
import {GalleryCommentProvider} from "../../providers/gallery-comment.provider";
import {IonicUtilProvider} from "../../providers/ionic-util.provider";
import {GalleryProvider} from "../../providers/gallery.provider";
import _ from "underscore";
import {AnalyticsProvider} from "../../providers/analytics.provider";

declare const Parse: any;
declare const $: any;

@Component({
    selector:    'photo-comment-modal',
    templateUrl: 'photo-comment-modal.html'
})
export class PhotoCommentModalComponent {
    @ViewChild(Content) content: Content;

    errorIcon: string = 'ios-text-outline';
    errorText: string = '';
    data = [];
    loading: boolean = true;
    showEmptyView: boolean = false;
    showErrorView: boolean = false;
    moreItem: boolean = false;
    query: any;
    sending = false
    gallery: any;
    form: any;
    galleryId: string;
    user: any;

    params = {
        limit:     20,
        page:      1,
        galleryId: null
    };

    constructor(private navparams: NavParams,
                private viewCtrl: ViewController,
                private provider: GalleryCommentProvider,
                private util: IonicUtilProvider,
                private Gallery: GalleryProvider,
                private analytics: AnalyticsProvider,) {
        // Google Analytics
        this.analytics.view('PhotoCommentModalPage');

        this.form = {
            text: ''
        };

        this.user = Parse.User.current();

    }

    //this.params.galleryId = this.gallery.id;

    ionViewWillEnter() {
        console.info('ionViewWillEnter photoComment');
        this.galleryId = this.navparams.data.galleryId;
        // More Item
        this.onGallery(this.galleryId);
        this.params.galleryId = this.galleryId;
    }

    onAddMessage(message) {
        console.log('addMessage', message);
        if (message) {
            console.log('obj', message);
            this.data.push(message);
            this.scrollToBottom();

        }
    }

    scrollToBottom(): void {
        setTimeout(() => {
            if (this.content.scrollToBottom) {
                this.content.scrollToBottom(300)
            }
        }, 100);
    }

    // keep the input focused.
    // for some reason it works best if this is separate from the send function
    blurInput(e) {
        //console.log(e);
        if (!this.sending) {
            return;
        }
        setTimeout(() => {
            $('#messageBox input').focus();
        }, 10);
        setTimeout(() => {
            $('#messageBox input').focus();
        }, 1);
        $('#messageBox input').focus();
    }

    onGallery(galleryId: string) {
        this.util.onLoading();
        this.Gallery.getParse(galleryId).then(gallery => {
            this.form.gallery = gallery;
            // return this.onQuery()

            let chatMessage = Parse.Object.extend('GalleryComment');
            this.query = new Parse.Query(chatMessage).include('profile').equalTo('channel', gallery);

            this.query.subscribe().on('create', message => this.onAddMessage);

            this.onQuery();

        })
            .catch(this.onError)
        ;
    }

    onError(error) {
        this.util.toast('Error');
        this.util.endLoading();
        this.loading = false;
        this.showErrorView = true;
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
                    this.moreItem = true;
                } else {
                    this.showEmptyView = true;
                    this.moreItem = false;
                }

                this.loading = false;
                resolve(data);
            }).catch(error => {
                this.errorText = error.message;
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
