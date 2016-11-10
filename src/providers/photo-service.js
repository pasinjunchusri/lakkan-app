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
    function PhotoService(actionSheetCtrl, platform, util) {
        var _this = this;
        this.actionSheetCtrl = actionSheetCtrl;
        this.platform = platform;
        this.util = util;
        this._cordova = false;
        this._options = {
            allowEdit: true,
            sourceType: ionic_native_1.Camera.PictureSourceType.SAVEDPHOTOALBUM,
            mediaType: ionic_native_1.Camera.MediaType.ALLMEDIA,
            destinationType: ionic_native_1.Camera.DestinationType.FILE_URI
        };
        this._setting = {
            quality: 90,
            width: 640,
            height: 640,
            saveToPhotoAlbum: false,
            allowEdit: true,
            correctOrientation: true,
            allowRotation: true,
            aspectRatio: 0
        };
        this._cordova = this.platform.is('cordova') ? true : false;
        // Translate
        this.util.translate('Chose Option').then(function (result) { return _this._translateOption = result; });
        this.util.translate('Camera').then(function (result) { return _this._translateCamera = result; });
        this.util.translate('Photo library').then(function (result) { return _this._translateLibrary = result; });
        this.util.translate('Cancel').then(function (result) { return _this._translateCancel = result; });
        this.util.translate('Browser not supported').then(function (result) { return _this._translateNotCordova = result; });
    }
    PhotoService.prototype.open = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.actionSheetCtrl.create({
                title: _this._translateOption,
                buttons: [
                    {
                        text: _this._translateCamera,
                        icon: 'camera',
                        handler: function () {
                            if (_this._cordova) {
                                _this.camera().then(function (image) { return resolve(image); }).catch(function (error) { return reject(error); });
                            }
                            else {
                                reject(_this._translateNotCordova);
                            }
                        }
                    },
                    {
                        text: _this._translateLibrary,
                        icon: 'images',
                        handler: function () {
                            if (_this._cordova) {
                                _this.photoLibrary().then(function (image) { return resolve(image); }).catch(function (error) { return reject(error); });
                            }
                            else {
                                reject(_this._translateNotCordova);
                            }
                        }
                    },
                    {
                        text: _this._translateCancel,
                        icon: 'close'
                    }
                ]
            }).present();
        });
    };
    PhotoService.prototype.camera = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            ionic_native_1.Camera.getPicture({
                targetWidth: _this._setting.width,
                targetHeight: _this._setting.height,
                quality: _this._setting.quality,
                //allowEdit         : this._setting.allowEdit,
                saveToPhotoAlbum: false,
                destinationType: ionic_native_1.Camera.DestinationType.DATA_URL,
            }).then(function (imageData) {
                // imageData is a base64 encoded string
                _this._base64Image = 'data:image/jpeg;base64,' + imageData;
                resolve(_this._base64Image);
            }, function (err) {
                console.log(err);
                reject(err);
            });
        });
    };
    PhotoService.prototype.photoLibrary = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            ionic_native_1.Camera.getPicture({
                targetWidth: _this._setting.width,
                targetHeight: _this._setting.height,
                quality: _this._setting.quality,
                allowEdit: _this._setting.allowEdit,
                saveToPhotoAlbum: _this._setting.saveToPhotoAlbum,
                sourceType: ionic_native_1.Camera.PictureSourceType.PHOTOLIBRARY,
                destinationType: ionic_native_1.Camera.DestinationType.DATA_URL,
                encodingType: ionic_native_1.Camera.EncodingType.JPEG,
                correctOrientation: true,
            }).then(function (imageData) {
                // imageData is a base64 encoded string
                _this._base64Image = 'data:image/jpeg;base64,' + imageData;
                resolve(_this._base64Image);
            }, function (err) {
                console.log(err);
                reject(err);
            });
        });
    };
    // Return a promise to catch errors while loading image
    PhotoService.prototype.getMedia = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            // Get Image from ionic-native's built in camera plugin
            ionic_native_1.Camera.getPicture(_this._options).then(function (fileUri) {
                // Crop Image, on android this returns something like, '/storage/emulated/0/Android/...'
                // Only giving an android example as ionic-native camera has built in cropping ability
                if (_this.platform.is('android')) {
                    // Modify fileUri format, may not always be necessary
                    fileUri = 'file://' + fileUri;
                    var options = { quality: 100 };
                    /* Using cordova-plugin-crop starts here */
                    plugins.crop.promise(fileUri, options).then(function (path) {
                        // path looks like 'file:///storage/emulated/0/Android/data/com.foo.bar/cache/1477008080626-cropped.jpg?1477008106566'
                        console.log('Cropped Image Path!: ' + path);
                        // Do whatever you want with new path such as read in a file
                        // Here we resolve the path to finish, but normally you would now want to read in the file
                        resolve(path);
                    }).catch(function (error) {
                        reject(error);
                    });
                }
            }).catch(function (error) {
                reject(error);
            });
        });
    };
    PhotoService.prototype.libraryLocal = function () {
        return new Promise(function (resolve, reject) {
            var fileInput = document.createElement('<input type="file" accept="image/x-png, image/gif, image/jpeg" max-size="2048" />');
            fileInput[0].click();
            fileInput.addEventListener('change', function (evt) {
                var image = evt.target.result[0];
                var reader = new FileReader();
                reader.onload = function (evt) { return resolve(evt); };
                reader.readAsDataURL(image);
            });
        });
    };
    PhotoService = __decorate([
        core_1.Injectable()
    ], PhotoService);
    return PhotoService;
}());
exports.PhotoService = PhotoService;
