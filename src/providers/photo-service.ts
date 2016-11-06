import {Injectable} from '@angular/core';
import {ActionSheetController, Platform} from "ionic-angular";
import {Camera} from 'ionic-native';

declare var document: any;

@Injectable()
export class PhotoService {

    private _base64Image: string;

    _cordova: boolean = false;

    _options: any = {
        allowEdit      : true,
        sourceType     : Camera.PictureSourceType.SAVEDPHOTOALBUM,
        mediaType      : Camera.MediaType.ALLMEDIA,
        destinationType: Camera.DestinationType.FILE_URI
    };

    _setting = {
        quality           : 90,
        width             : 640,
        height            : 640,
        saveToPhotoAlbum  : false,
        allowEdit         : true,
        correctOrientation: true,
        allowRotation     : true,
        aspectRatio       : 0
    };

    constructor(public actionSheetCtrl: ActionSheetController,
                public platform: Platform
    ) {
        this._cordova = this.platform.is('cordova') ? true : false;

    }


    // Return a promise to catch errors while loading image
    getMedia(): Promise<any> {
        return new Promise((resolve, reject) => {
            // Get Image from ionic-native's built in camera plugin
            Camera.getPicture(this._options).then(fileUri => {
                // Crop Image, on android this returns something like, '/storage/emulated/0/Android/...'
                // Only giving an android example as ionic-native camera has built in cropping ability
                if (this.platform.is('android')) {
                    // Modify fileUri format, may not always be necessary
                    fileUri       = 'file://' + fileUri;
                    const options = {quality: 100};
                    /* Using cordova-plugin-crop starts here */
                    plugins.crop.promise(fileUri, options).then((path) => {
                        // path looks like 'file:///storage/emulated/0/Android/data/com.foo.bar/cache/1477008080626-cropped.jpg?1477008106566'
                        console.log('Cropped Image Path!: ' + path);
                        // Do whatever you want with new path such as read in a file
                        // Here we resolve the path to finish, but normally you would now want to read in the file
                        resolve(path);
                    }).catch((error) => {
                        reject(error);
                    });
                }
            }).catch((error) => {
                reject(error);
            });
        });
    }

    open() {
        this.actionSheetCtrl.create({
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
        }).present();
    }

    takePicture(): Promise<string> {
        return new Promise((resolve, reject) => {
            Camera.getPicture({
                targetWidth       : this._setting.width,
                targetHeight      : this._setting.height,
                quality           : this._setting.quality,
                allowEdit         : this._setting.allowEdit,
                saveToPhotoAlbum  : this._setting.allowEdit,
                sourceType        : Camera.PictureSourceType.CAMERA,
                destinationType   : Camera.DestinationType.DATA_URL,
                encodingType      : Camera.EncodingType.JPEG,
                correctOrientation: true,
            }).then((imageData) => {
                // imageData is a base64 encoded string
                this._base64Image = "data:image/jpeg;base64," + imageData;
                resolve(this._base64Image)
            }, (err) => {
                console.log(err);
                reject(err);
            });
        });
    }

    library(): Promise <string> {
        return new Promise((resolve, reject) => {
            Camera.getPicture({
                targetWidth       : this._setting.width,
                targetHeight      : this._setting.height,
                quality           : this._setting.quality,
                allowEdit         : this._setting.allowEdit,
                saveToPhotoAlbum  : this._setting.allowEdit,
                sourceType        : Camera.PictureSourceType.PHOTOLIBRARY,
                destinationType   : Camera.DestinationType.DATA_URL,
                encodingType      : Camera.EncodingType.JPEG,
                correctOrientation: true,
            }).then((imageData) => {
                // imageData is a base64 encoded string
                this._base64Image = "data:image/jpeg;base64," + imageData;
                resolve(this._base64Image)
            }, (err) => {
                console.log(err);
                reject(err);
            });
        });
    }

    libraryLocal() {
        return new Promise((resolve, reject) => {
            let fileInput = document.createElement('<input type="file" accept="image/x-png, image/gif, image/jpeg" max-size="2048" />');
            fileInput[0].click();
            fileInput.on('change', (evt) => {
                let tempImage = evt.currentTarget.files[0];
                let reader    = new FileReader();
                reader.onload = (evt) => resolve(evt);
                reader.readAsDataURL(tempImage);
            });
        });

    }

}
