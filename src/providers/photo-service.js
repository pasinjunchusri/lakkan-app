"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('@angular/core');
var ionic_native_1 = require('ionic-native');
var PhotoService = (function () {
    function PhotoService(actionSheetCtrl) {
        this.actionSheetCtrl = actionSheetCtrl;
        console.log('Hello PhotoService Provider');
        this.setting = {
            quality: 90,
            width: 640,
            height: 640,
            saveToPhotoAlbum: false,
            allowEdit: true,
            correctOrientation: true,
            allowRotation: true,
            aspectRatio: 0
        };
    }
    PhotoService.prototype.open = function () {
        var actionSheet = this.actionSheetCtrl.create({
            title: 'Chose Option',
            buttons: [
                {
                    text: 'Camera',
                    icon: 'camera',
                    handler: function () {
                        console.log('Camera');
                    }
                },
                {
                    text: 'Photo Library',
                    icon: 'images',
                    handler: function () {
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
    };
    PhotoService.prototype.takePicture = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            ionic_native_1.Camera.getPicture({
                targetWidth: _this.setting.width,
                targetHeight: _this.setting.height,
                quality: _this.setting.quality,
                allowEdit: _this.setting.allowEdit,
                saveToPhotoAlbum: _this.setting.allowEdit,
                sourceType: ionic_native_1.Camera.PictureSourceType.CAMERA,
                destinationType: ionic_native_1.Camera.DestinationType.DATA_URL,
                encodingType: ionic_native_1.Camera.EncodingType.JPEG,
                correctOrientation: true,
            }).then(function (imageData) {
                // imageData is a base64 encoded string
                _this.base64Image = "data:image/jpeg;base64," + imageData;
                resolve(_this.base64Image);
            }, function (err) {
                console.log(err);
                reject(err);
            });
        });
    };
    PhotoService.prototype.photLibrary = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            ionic_native_1.Camera.getPicture({
                targetWidth: _this.setting.width,
                targetHeight: _this.setting.height,
                quality: _this.setting.quality,
                allowEdit: _this.setting.allowEdit,
                saveToPhotoAlbum: _this.setting.allowEdit,
                sourceType: ionic_native_1.Camera.PictureSourceType.PHOTOLIBRARY,
                destinationType: ionic_native_1.Camera.DestinationType.DATA_URL,
                encodingType: ionic_native_1.Camera.EncodingType.JPEG,
                correctOrientation: true,
            }).then(function (imageData) {
                // imageData is a base64 encoded string
                _this.base64Image = "data:image/jpeg;base64," + imageData;
                resolve(_this.base64Image);
            }, function (err) {
                console.log(err);
                reject(err);
            });
        });
    };
    PhotoService.prototype.getPicture = function () {
        return new Promise(function (resolve, reject) {
            var fileInput = document.createElement('<input type="file" accept="image/x-png, image/gif, image/jpeg" max-size="2048" />');
            fileInput[0].click();
            fileInput.on('change', function (evt) {
                var tempImage = evt.currentTarget.files[0];
                var reader = new FileReader();
                reader.onload = function (evt) { return resolve(evt); };
                reader.readAsDataURL(tempImage);
            });
        });
    };
    PhotoService = __decorate([
        core_1.Injectable()
    ], PhotoService);
    return PhotoService;
}());
exports.PhotoService = PhotoService;
