import {Injectable} from '@angular/core';
import {ActionSheetController, Platform} from "ionic-angular";
import {Camera} from 'ionic-native';
import {TranslateService} from "ng2-translate";

@Injectable()
export class IonPhotoService {

    _base64Image: any;
    _cordova: boolean = false;
    _setting          = {
        quality           : 70,
        width             : 1024,
        height            : 1024,
        saveToPhotoAlbum  : false,
        allowEdit         : true,
        correctOrientation: true,
        allowRotation     : true,
        aspectRatio       : 0
    };

    _translateOption: string;
    _translateCamera: string;
    _translateLibrary: string;
    _translateCancel: string;
    _translateNotCordova: string;

    constructor(private actionSheetCtrl: ActionSheetController,
                private platform: Platform,
                private translateService: TranslateService
    ) {
        this._cordova = this.platform.is('cordova') ? true : false;
        // Translate
        this.translate('Chose Option').then(result => this._translateOption = result);
        this.translate('Camera').then(result => this._translateCamera = result);
        this.translate('Photo library').then(result => this._translateLibrary = result);
        this.translate('Cancel').then(result => this._translateCancel = result);
        this.translate('Browser not supported').then(result => this._translateNotCordova = result);
    }

    translate(text: string): Promise<any> {
        return new Promise(resolve => {
            this.translateService.get(text).subscribe((res: string) => resolve(res));
        });
    }

    open() {
        return new Promise((resolve, reject) => {
            this.actionSheetCtrl.create({
                title  : this._translateOption,
                buttons: [
                    {
                        text   : this._translateCamera,
                        icon   : 'camera',
                        handler: () => {
                            if (this._cordova) {
                                this.camera().then(image => resolve('data:image/jpeg;base64,'+image)).catch(error => reject(error));
                            } else {
                                reject(this._translateNotCordova);
                            }
                        }
                    },
                    {
                        text   : this._translateLibrary,
                        icon   : 'images',
                        handler: () => {
                            if (this._cordova) {
                                this.photoLibrary().then(image => resolve('data:image/jpeg;base64,'+image)).catch(error => reject(error));
                            } else {
                                reject(this._translateNotCordova);
                            }
                        }
                    },
                    {
                        text: this._translateCancel
                    }
                ]
            }).present();
        });
    }

    camera() {
        return new Promise((resolve, reject) => {
            let _options = {
                targetWidth    : this._setting.width,
                targetHeight   : this._setting.height,
                quality        : this._setting.quality,
                sourceType     : Camera.PictureSourceType.CAMERA,
                destinationType: Camera.DestinationType.DATA_URL
            };

            Camera.getPicture(_options).then((imageData) => {
                // imageData is a base64 encoded string
                this._base64Image = 'data:image/jpeg;base64,' + imageData;
                resolve(this._base64Image);
            }, (err) => {
                console.log(err);
                reject(err);
            });
        });
    }

    photoLibrary() {
        return new Promise((resolve, reject) => {
            let _options = {
                targetWidth       : this._setting.width,
                targetHeight      : this._setting.height,
                quality           : this._setting.quality,
                sourceType        : Camera.PictureSourceType.PHOTOLIBRARY,
                destinationType   : Camera.DestinationType.DATA_URL
            };

            Camera.getPicture(_options).then((imageData) => {
                // imageData is a base64 encoded string
                this._base64Image = 'data:image/jpeg;base64,' + imageData;
                resolve(this._base64Image);
            }, (err) => {
                console.log(err);
                reject(err);
            });
        });
    }

}
