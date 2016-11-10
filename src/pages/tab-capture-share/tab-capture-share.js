"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('@angular/core');
var tabs_1 = require("../tabs/tabs");
var gmaps_autocomplete_modal_1 = require("../../components/gmaps-autocomplete-modal/gmaps-autocomplete-modal");
var TabCapturSharePage = (function () {
    function TabCapturSharePage(navparams, navCtrl, viewCtrl, ParseFile, events, modalCtrl) {
        var _this = this;
        this.navparams = navparams;
        this.navCtrl = navCtrl;
        this.viewCtrl = viewCtrl;
        this.ParseFile = ParseFile;
        this.events = events;
        this.modalCtrl = modalCtrl;
        this.form = {
            title: '',
            privacity: 'public',
            address: '',
            location: ''
        };
        this.image = this.navparams.get('base64');
        events.subscribe('album:selected', function (album) {
            _this.form.album = album[0];
        });
    }
    TabCapturSharePage.prototype.showAddressModal = function () {
        var _this = this;
        var modal = this.modalCtrl.create(gmaps_autocomplete_modal_1.GmapsAutocompleteModalPage);
        modal.onDidDismiss(function (address) {
            if (address) {
                _this.form.address = address;
                _this.form.location = address.location;
            }
        });
        modal.present();
    };
    TabCapturSharePage.prototype.clearAddress = function () {
        this.form.adress = '';
        this.form.location = '';
    };
    TabCapturSharePage.prototype.submit = function (form) {
        if (form.valid) {
            this.navCtrl.push(tabs_1.TabsPage);
            this.ParseFile.uploadProccess({ form: this.form, image: this.image });
        }
    };
    TabCapturSharePage.prototype.dismiss = function () {
        this.viewCtrl.dismiss();
    };
    TabCapturSharePage = __decorate([
        core_1.Component({
            selector: 'tab-capture-share',
            templateUrl: 'tab-capture-share.html'
        })
    ], TabCapturSharePage);
    return TabCapturSharePage;
}());
exports.TabCapturSharePage = TabCapturSharePage;
