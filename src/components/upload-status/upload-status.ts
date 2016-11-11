import {Component} from '@angular/core';
import {ParseFile} from "../../providers/parse-file";
import {NavController} from "ionic-angular";

@Component({
    selector   : 'upload-status',
    templateUrl: 'upload-status.html'
})
export class UploadStatusComponent {

    _uploadsPending: any = [];
    _base64: any;

    constructor(private ParseFile: ParseFile,
                private navCtrl: NavController
    ) {

        this._uploadsPending = this.ParseFile._uploadsPending;
    }
}
