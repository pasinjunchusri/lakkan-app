import {Injectable} from '@angular/core';
import {ActionSheetController} from "ionic-angular";
import 'rxjs/add/operator/map';

@Injectable()
export class PhotoService {

    setting: any;

    constructor(public actionSheetCtrl: ActionSheetController,
    ) {
        console.log('Hello PhotoService Provider');

        this.setting = {
            jrCrop            : false,
            quality           : 90,
            allowEdit         : true,
            filter            : true,
            correctOrientation: true,
            targetWidth       : 640,
            targetHeight      : 640,
            saveToPhotoAlbum  : false,
            allowRotation     : true,
            aspectRatio       : 0
        };

    }

    open() {
        let actionSheet = this.actionSheetCtrl.create({
            title  : 'Modify your album',
            buttons: [
                {
                    text   : 'Destructive',
                    role   : 'destructive',
                    handler: () => {
                        console.log('Destructive clicked');
                    }
                },
                {
                    text   : 'Archive',
                    handler: () => {
                        console.log('Archive clicked');
                    }
                },
                {
                    text   : 'Cancel',
                    role   : 'cancel',
                    handler: () => {
                        console.log('Cancel clicked');
                    }
                }
            ]
        });

        actionSheet.present();
    }

}
