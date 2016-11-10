"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('@angular/core');
var ionic_native_1 = require("ionic-native");
var IonicUtil = (function () {
    function IonicUtil(platform, loadingCtrl, toastCtrl, translateService, logger) {
        var _this = this;
        this.platform = platform;
        this.loadingCtrl = loadingCtrl;
        this.toastCtrl = toastCtrl;
        this.translateService = translateService;
        this.logger = logger;
        this._browserTheme = {
            statusbar: {
                color: '#ffffffff'
            },
            toolbar: {
                height: 44,
                color: '#f0f0f0ff'
            },
            title: {
                color: '#003264ff',
                showPageTitle: true
            },
            backButtonCanClose: true
        };
        this.cordova = platform.is('cordova') ? true : false;
        platform.ready().then(function () {
            _this._widthPlatform = platform.width();
            _this._heightPlatform = platform.height();
        });
    }
    IonicUtil.getRandomInt = function (min, max) {
        if (min === void 0) { min = 0; }
        if (max === void 0) { max = 9999; }
        return Math.floor(Math.random() * (max - min)) + min;
    };
    IonicUtil.prototype.onLoading = function (message) {
        this._loading = this.loadingCtrl.create();
        this._loading.present();
    };
    IonicUtil.prototype.endLoading = function () {
        this._loading.dismiss();
    };
    IonicUtil.prototype.toast = function (message) {
        var toast = this.toastCtrl.create({
            message: message,
            duration: 3000,
        });
        toast.present();
    };
    IonicUtil.prototype.href = function (url) {
        new ionic_native_1.ThemeableBrowser(url, '_blank', this._browserTheme);
    };
    IonicUtil.prototype.translate = function (text) {
        var _this = this;
        return new Promise(function (resolve) {
            _this.translateService.get(text).subscribe(function (res) { return resolve(res); });
        });
    };
    IonicUtil.getClientHeight = function () {
        var body = document.body, html = document.documentElement;
        var height = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
        return height;
    };
    // Returns a function, that, as long as it continues to be invoked, will not
    // be triggered. The function will be called after it stops being called for
    // N milliseconds. If `immediate` is passed, trigger the function on the
    // leading edge, instead of the trailing.
    //http://davidwalsh.name/javascript-debounce-function
    IonicUtil.debounce = function (func, wait, immediate) {
        var timeout;
        return function () {
            var context = this, args = arguments;
            var later = function () {
                timeout = null;
                if (!immediate) {
                    func.apply(context, args);
                }
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) {
                func.apply(context, args);
            }
        };
    };
    IonicUtil.getMaxLevelOfPOI = function (poi) {
        var level = 0;
        if (poi.Connections != null) {
            for (var c = 0; c < poi.Connections.length; c++) {
                if (poi.Connections[c].Level != null && poi.Connections[c].Level.ID > level) {
                    level = poi.Connections[c].Level.ID;
                }
            }
        }
        if (level == 4) {
            level = 2;
        } //lvl 1&2
        if (level > 4) {
            level = 3;
        } //lvl 2&3 etc
        return level;
    };
    IonicUtil.getIconForPOI = function (poi) {
        var poiLevel = IonicUtil.getMaxLevelOfPOI(poi);
        var iconURL = "assets/images/icons/map/level" + poiLevel;
        if (poi.UsageType != null && poi.UsageType.Title.indexOf("Private") > -1) {
            iconURL += "_private";
        }
        else if (poi.StatusType != null && poi.StatusType.IsOperational != true) {
            iconURL += "_nonoperational";
        }
        else {
            iconURL += "_operational";
        }
        iconURL += "_icon.png";
        return iconURL;
    };
    IonicUtil.formatSystemWebLink = function (linkURL, linkTitle) {
        return "<a href='#' onclick=\"window.open('" + linkURL + "', '_system');return false;\">" + linkTitle + "</a>";
    };
    IonicUtil.formatMapLink = function (poi, linkContent, isRunningUnderCordova) {
        if (isRunningUnderCordova) {
            if (device && device.platform == "WinCE") {
                return this.formatSystemWebLink("maps:" + poi.AddressInfo.Latitude + "," + poi.AddressInfo.Longitude, linkContent);
            }
            else if (device && device.platform == "iOS") {
                return this.formatSystemWebLink("http://maps.apple.com/?q=" + poi.AddressInfo.Latitude + "," + poi.AddressInfo.Longitude, linkContent);
            }
            else {
                return this.formatSystemWebLink("http://maps.google.com/maps?q=" + poi.AddressInfo.Latitude + "," + poi.AddressInfo.Longitude, linkContent);
            }
        }
        //default to google maps online link
        return "<a target=\"_blank\"  href=\"http://maps.google.com/maps?q=" + poi.AddressInfo.Latitude + "," + poi.AddressInfo.Longitude + "\">" + linkContent + "</a>";
    };
    IonicUtil.prototype.getLanguages = function () {
        return this.translateService.getLangs();
    };
    IonicUtil.prototype.saveSearchSettings = function () {
        this.logger.log('Settings');
    };
    IonicUtil.prototype.setLanguage = function (languageCode) {
        this.translateService.use(languageCode);
    };
    IonicUtil = __decorate([
        core_1.Injectable()
    ], IonicUtil);
    return IonicUtil;
}());
exports.IonicUtil = IonicUtil;
