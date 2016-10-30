import {Component, Input} from '@angular/core';
import {Events, ModalController} from "ionic-angular";
import {Gallery} from "../../providers/gallery";
import {PhotoCommentModal} from "../photo-comment-modal/photo-comment-modal";

@Component({
    selector   : 'photo-card',
    templateUrl: 'photo-card.html'
})
export class PhotoCard {

    @Input() item: any;

    loadingLike: boolean = false;

    constructor(public provider: Gallery,
                public events: Events,
                public modalCtrl: ModalController
    ) {

    }


    openComments(item) {
        console.log(item);
        let modal = this.modalCtrl.create(PhotoCommentModal, item);
        modal.present();
    }

    onLike(item) {
        console.log(item);
        this.loadingLike = true;
        this.provider.likeGallery({galleryID: item.id}).then(data => {
            if (item.liked) {
                item.liked = false;
                item.likesTotal--;
            } else {
                item.liked = true;
                item.likesTotal++;
            }
            console.log(data);
            this.loadingLike = false;
        });
    }

}
