import {Component} from '@angular/core';
import {ModalController, Events} from "ionic-angular";
import {AlbumListModalPage} from "../album-list-modal/album-list-modal";

@Component({
    selector   : 'album-input',
    templateUrl: 'album-input.html'
})
export class AlbumInputComponent {

    item: any;

    constructor(private modalCtrl: ModalController,
                private events: Events
    ) {
        events.subscribe('album:selected', album => {
            this.item = album[0].attributes;
            console.log(this.item);
        });
    }

    openAlbumList() {
        this.modalCtrl.create(AlbumListModalPage).present();
    }

}
