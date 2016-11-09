import {Component, ViewChild} from '@angular/core';
import {GoogleMap, GoogleMapsLatLng, Geolocation, CameraPosition, GoogleMapsMarkerOptions, GoogleMapsAnimation, GoogleMapsEvent} from "ionic-native";


@Component({
    selector   : 'page-tab-search-map',
    templateUrl: 'tab-search-map.html',
})
export class TabSearchMapPage {

    @ViewChild('map') mapElement;

    map: GoogleMap;
    mapStartLocation = new GoogleMapsLatLng(-34.9290, 138.6010);
    mapOptions       = {
        'backgroundColor': 'white',
        'controls'       : {
            'compass'         : true,
            'myLocationButton': true,
            'indoorPicker'    : true,
            'zoom'            : true
        },
        'gestures'       : {
            'scroll': true,
            'tilt'  : true,
            'rotate': true,
            'zoom'  : true
        },
        'camera'         : {
            'latLng' : this.mapStartLocation,
            'tilt'   : 30,
            'zoom'   : 15,
            'bearing': 50
        }
    };

    constructor() {
        this.loadMap();

    }


    loadMap() {
        let options = {timeout: 10000, enableHighAccuracy: true};
        //ENABLE THE FOLLOWING:

        Geolocation.getCurrentPosition(options).then((pos) => {
            this.map                   = new GoogleMap(this.mapElement, this.mapOptions);
            let position               = new GoogleMapsLatLng(pos.coords.latitude, pos.coords.longitude);
            // create CameraPosition
            let camera: CameraPosition = {
                target : position,
                zoom   : 18,
                tilt   : 60,
                bearing: 140
            };
            this.map.moveCamera(camera);

            // move the map's camera to position
            //this.map.animateCamera(camera);

            // create new marker
            let markerOptions: GoogleMapsMarkerOptions = {
                position : position,
                title    : "Welecome to \n" + "Cordova GoogleMaps plugin for iOS and Android",
                snippet  : "This plugin is awesome!",
                animation: GoogleMapsAnimation.BOUNCE
            };

            this.map.addMarker(markerOptions).then((marker: any) => {
                marker.showInfoWindow();

                // Catch the click event
                marker.addEventListener(GoogleMapsEvent.MARKER_CLICK, function () {

                    console.log(marker);

                });

            });

            this.map.on(GoogleMapsEvent.MAP_READY).subscribe(() => {
                console.log('Map is ready!');
            });

        });
    }

}
