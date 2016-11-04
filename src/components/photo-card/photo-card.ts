import {Component, Input} from '@angular/core';
import {Events, ModalController, NavController} from "ionic-angular";
import {Gallery} from "../../providers/gallery";
import {PhotoCommentModal} from "../photo-comment-modal/photo-comment-modal";
import {ProfilePage} from "../../pages/profile/profile";

@Component({
    selector   : 'photo-card',
    templateUrl: 'photo-card.html'
})
export class PhotoCard {

    @Input() item: any;

    loadingLike: boolean = false;

    constructor(public provider: Gallery,
                public events: Events,
                public navCtrl: NavController,
                public modalCtrl: ModalController
    ) {

    }


    openComments(item) {
        console.log(item);
        let modal = this.modalCtrl.create(PhotoCommentModal, item);
        modal.present();
    }

    profile(username: string) {
        console.log('username', username);
        this.navCtrl.push(ProfilePage, {username: username})
    }

    onLike(item) {
        console.log(item);
        this.loadingLike = true;
        this.provider.likeGallery({id: item.id}).then(data => {
            if (item.isLiked) {
                item.isLiked = false;
                item.likesTotal--;
            } else {
                item.isLiked = true;
                item.likesTotal++;
            }
            console.log(data);
            this.loadingLike = false;
        });
    }

}
