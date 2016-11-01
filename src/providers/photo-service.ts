import {Injectable} from '@angular/core';
import {ActionSheetController} from "ionic-angular";
import {Camera} from 'ionic-native';

declare var document:any;

@Injectable()
export class PhotoService {

    setting: any;
    base64Image: string;

    constructor(public actionSheetCtrl: ActionSheetController
    ) {
        console.log('Hello PhotoService Provider');

        this.setting = {
            quality           : 90,
            width             : 640,
            height            : 640,
            saveToPhotoAlbum  : false,
            allowEdit         : true,
            correctOrientation: true,
            allowRotation     : true,
            aspectRatio       : 0
        };

    }

    open() {
        let actionSheet = this.actionSheetCtrl.create({
            title  : 'Chose Option',
            buttons: [
                {
                    text   : 'Camera',
                    icon   : 'camera',
                    handler: () => {
                        console.log('Camera');
                    }
                },
                {
                    text   : 'Photo Library',
                    icon   : 'images',
                    handler: () => {
                        console.log('Photo Library ');
                    }
                },
                {
                    text: 'Cancel',
                    icon: 'close'
                }
            ]
        });

        actionSheet.present();
    }

    takePicture() {
        return new Promise((resolve, reject) => {
            Camera.getPicture({
                targetWidth       : this.setting.width,
                targetHeight      : this.setting.height,
                quality           : this.setting.quality,
                allowEdit         : this.setting.allowEdit,
                saveToPhotoAlbum  : this.setting.allowEdit,
                sourceType        : Camera.PictureSourceType.CAMERA,
                destinationType   : Camera.DestinationType.DATA_URL,
                encodingType      : Camera.EncodingType.JPEG,
                correctOrientation: true,
            }).then((imageData) => {
                // imageData is a base64 encoded string
                this.base64Image = "data:image/jpeg;base64," + imageData;
                resolve(this.base64Image)
            }, (err) => {
                console.log(err);
                reject(err);
            });
        });
    }

    photLibrary() {
        return new Promise((resolve, reject) => {
            Camera.getPicture({
                targetWidth       : this.setting.width,
                targetHeight      : this.setting.height,
                quality           : this.setting.quality,
                allowEdit         : this.setting.allowEdit,
                saveToPhotoAlbum  : this.setting.allowEdit,
                sourceType        : Camera.PictureSourceType.PHOTOLIBRARY,
                destinationType   : Camera.DestinationType.DATA_URL,
                encodingType      : Camera.EncodingType.JPEG,
                correctOrientation: true,
            }).then((imageData) => {
                // imageData is a base64 encoded string
                this.base64Image = "data:image/jpeg;base64," + imageData;
                resolve(this.base64Image)
            }, (err) => {
                console.log(err);
                reject(err);
            });
        });
    }

    getPicture() {
        return new Promise((resolve, reject) => {
            let fileInput = document.createElement('<input type="file" accept="image/x-png, image/gif, image/jpeg" max-size="2048" />');
            fileInput[0].click();
            fileInput.on('change', function (evt) {
                let tempImage = evt.currentTarget.files[0];
                let reader    = new FileReader();
                reader.onload = (evt) => resolve(evt);
                reader.readAsDataURL(tempImage);
            });
        });

    }

}
