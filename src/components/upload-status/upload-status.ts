import {Component} from '@angular/core';
import {ParseFile} from "../../providers/parse-file";
import {NavController} from "ionic-angular";
import {TabCapturSharePage} from "../../pages/tab-capture-share/tab-capture-share";

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


    fileChangeEvent($event: any) {
        let file: File             = $event.target.files[0];
        let image: any             = new Image();
        let fileReader: FileReader = new FileReader();
        let base64                 = this._base64;

        fileReader.addEventListener('loadend', (loadEvent: any) => {
            image.src    = loadEvent.target.result;
            base64       = image.src;
            this._base64 = image.src;
            this.upload();
        });

        fileReader.readAsDataURL(file);
    }

    upload() {
        this.navCtrl.push(TabCapturSharePage, {base64: this._base64});
    }

}
