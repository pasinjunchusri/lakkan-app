import {Component, Input, OnInit} from "@angular/core";
import {ModalController, Events} from "ionic-angular";
import {AlbumListModalPage} from "../album-list-modal/album-list-modal";

@Component({
    selector   : 'album-input',
    templateUrl: 'album-input.html'
})
export class AlbumInputComponent implements OnInit {
    @Input() album?: any;

    constructor(private modalCtrl: ModalController,
                private events: Events,
    ) {
        events.subscribe('album:selected', album => this.album = album[0]);
    }

    ngOnInit() {
        console.log('album', this.album);
    }

    openAlbumList() {
        this.modalCtrl.create(AlbumListModalPage).present();
    }

}
