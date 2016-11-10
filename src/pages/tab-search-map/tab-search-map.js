"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('@angular/core');
var ionic_native_1 = require("ionic-native");
var TabSearchMapPage = (function () {
    function TabSearchMapPage() {
        this.mapStartLocation = new ionic_native_1.GoogleMapsLatLng(-34.9290, 138.6010);
        this.mapOptions = {
            'backgroundColor': 'white',
            'controls': {
                'compass': true,
                'myLocationButton': true,
                'indoorPicker': true,
                'zoom': true
            },
            'gestures': {
                'scroll': true,
                'tilt': true,
                'rotate': true,
                'zoom': true
            },
            'camera': {
                'latLng': this.mapStartLocation,
                'tilt': 30,
                'zoom': 15,
                'bearing': 50
            }
        };
        this.loadMap();
    }
    TabSearchMapPage.prototype.loadMap = function () {
        var _this = this;
        var options = { timeout: 10000, enableHighAccuracy: true };
        //ENABLE THE FOLLOWING:
        ionic_native_1.Geolocation.getCurrentPosition(options).then(function (pos) {
            _this.map = new ionic_native_1.GoogleMap(_this.mapElement, _this.mapOptions);
            var position = new ionic_native_1.GoogleMapsLatLng(pos.coords.latitude, pos.coords.longitude);
            // create CameraPosition
            var camera = {
                target: position,
                zoom: 18,
                tilt: 60,
                bearing: 140
            };
            _this.map.moveCamera(camera);
            // move the map's camera to position
            //this.map.animateCamera(camera);
            // create new marker
            var markerOptions = {
                position: position,
                title: "Welecome to \n" + "Cordova GoogleMaps plugin for iOS and Android",
                snippet: "This plugin is awesome!",
                animation: ionic_native_1.GoogleMapsAnimation.BOUNCE
            };
            _this.map.addMarker(markerOptions).then(function (marker) {
                marker.showInfoWindow();
                // Catch the click event
                marker.addEventListener(ionic_native_1.GoogleMapsEvent.MARKER_CLICK, function () {
                    console.log(marker);
                });
            });
            _this.map.on(ionic_native_1.GoogleMapsEvent.MAP_READY).subscribe(function () {
                console.log('Map is ready!');
            });
        });
    };
    __decorate([
        core_1.ViewChild('map')
    ], TabSearchMapPage.prototype, "mapElement", void 0);
    TabSearchMapPage = __decorate([
        core_1.Component({
            selector: 'page-tab-search-map',
            templateUrl: 'tab-search-map.html',
        })
    ], TabSearchMapPage);
    return TabSearchMapPage;
}());
exports.TabSearchMapPage = TabSearchMapPage;
