import {Component, OnInit} from '@angular/core';
import {ParseFile} from "../../providers/parse-file";
import {NavController} from "ionic-angular";

@Component({
    selector   : 'upload-status',
    templateUrl: 'upload-status.html'
})
export class UploadStatusComponent implements OnInit {

    _uploadsPending: any = [];

    constructor(private ParseFile: ParseFile,
                private navCtrl: NavController
    ) {

    }

    ngOnInit() {
        this._uploadsPending = this.ParseFile._uploadsPending;
    }

}
