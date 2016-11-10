"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('@angular/core');
var GmapsAutocompleteModalPage = (function () {
    function GmapsAutocompleteModalPage(viewCtrl, zone) {
        this.viewCtrl = viewCtrl;
        this.zone = zone;
        this._service = new google.maps.places.AutocompleteService();
        this._geocoder = new google.maps.Geocoder();
        this.componentForm = {
            street_number: 'long_name',
            //number
            route: 'long_name',
            //street
            locality: 'long_name',
            // district
            sublocality: 'long_name',
            // district
            neighborhood: 'long_name',
            //state
            political: 'long_name',
            //state
            administrative_area_level_1: 'long_name',
            //state
            country: 'long_name',
            //country
            postal_code: 'long_name' //zipcode
        };
        this.componentFormName = {
            street_number: 'number',
            //number
            route: 'street',
            //street
            locality: 'city',
            // district
            administrative_area_level_1: 'state',
            //state
            country: 'country',
            //country
            postal_code: 'zipcode',
            //zipcode
            neighborhood: 'district' //zipcode
        };
        this.autocomplete = {
            query: ''
        };
    }
    GmapsAutocompleteModalPage.prototype.doSelect = function (item) {
        var _this = this;
        this._geocoder.geocode({ address: item.description }, function (results, status) {
            _this.parseAddress(results[0]).then(function (data) {
                console.log('Parse Address', data);
                _this.viewCtrl.dismiss(data);
            });
        });
    };
    GmapsAutocompleteModalPage.prototype.doCancel = function () {
        this.autocomplete.query = '';
    };
    GmapsAutocompleteModalPage.prototype.doSearch = function () {
        var _this = this;
        if (this.autocomplete.query == '') {
            this._data = [];
            return;
        }
        this._service.getPlacePredictions({ input: this.autocomplete.query }, function (predictions, status) {
            _this._data = [];
            _this.zone.run(function () { return predictions.map(function (item) { return _this._data.push(item); }); });
        });
    };
    GmapsAutocompleteModalPage.prototype.parseAddress = function (place) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (!place) {
                reject('not place');
            }
            var address = {
                resume: '',
                geo: {
                    latitude: place.geometry.location.lat(),
                    longitude: place.geometry.location.lng()
                }
            };
            var image = _this.src(address.geo.latitude, address.geo.longitude, 16, 900, 200);
            for (var i = 0; i < place.address_components.length; i++) {
                var addressType = place.address_components[i].types[0];
                if (_this.componentForm[addressType]) {
                    var val = place.address_components[i][_this.componentForm[addressType]];
                    address[_this.componentFormName[addressType]] = val;
                }
            }
            address['name'] = place.name;
            address['street'] = address['street'] + ', ' + address['number'];
            address['image'] = image;
            address.resume = address['street'] + ' - ' + address['city'] + ', ' + address['state'] + ', ' + address['country'];
            resolve(address);
        });
    };
    GmapsAutocompleteModalPage.prototype.src = function (lat, lng, zoom, w, h) {
        var link = 'http://maps.googleapis.com/maps/api/staticmap?center=' + lat + ',' + lng + '&zoom=' + zoom +
            '&scale=1&size=' + w + 'x' + h +
            '&maptype=roadmap&format=jpg&visual_refresh=true&markers=size:small%7Ccolor:0xff2600%7Clabel:0%7C' + lat +
            ',' + lng + '&sensor=true';
        return link;
    };
    GmapsAutocompleteModalPage.prototype.dismiss = function () {
        this.viewCtrl.dismiss();
    };
    GmapsAutocompleteModalPage = __decorate([
        core_1.Component({
            selector: 'gmaps-autocomplete-modal',
            templateUrl: 'gmaps-autocomplete-modal.html'
        })
    ], GmapsAutocompleteModalPage);
    return GmapsAutocompleteModalPage;
}());
exports.GmapsAutocompleteModalPage = GmapsAutocompleteModalPage;
