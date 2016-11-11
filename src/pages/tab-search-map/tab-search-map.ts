import {Component} from '@angular/core';
import {
    GoogleMap, GoogleMapsLatLng, Geolocation, GoogleMapsMarkerOptions, AnimateCameraOptions, GoogleMapsAnimation,
    GoogleMapsEvent
} from "ionic-native";
import {IonicUtil} from "../../providers/ionic-util";


@Component({
    selector   : 'page-tab-search-map',
    templateUrl: 'tab-search-map.html',
})
export class TabSearchMapPage {


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

    constructor(private util: IonicUtil) {


    }


    ngAfterViewInit() {
        GoogleMap.isAvailable().then(() => {
            let options = {timeout: 10000, enableHighAccuracy: true};
            this.map    = new GoogleMap('map', this.mapOptions);
            this.map.on(GoogleMapsEvent.MAP_READY).subscribe(() => console.log('Map is ready!'));


            Geolocation.getCurrentPosition(options).then((pos) => {
                let myPosition                   = new GoogleMapsLatLng(pos.coords.latitude, pos.coords.longitude);
                // create CameraPosition
                let camera: AnimateCameraOptions = {
                    target: myPosition,
                    zoom  : 18
                };
                this.map.animateCamera(camera);

                // create new marker
                let markerOptions: GoogleMapsMarkerOptions = {
                    position : myPosition,
                    title    : "I am Here",
                    snippet  : "This plugin is awesome!",
                    animation: GoogleMapsAnimation.BOUNCE
                };

                this.map.addMarker(markerOptions).then((marker: any) => {
                    marker.showInfoWindow();
                    // Catch the click event
                    marker.addEventListener(GoogleMapsEvent.MARKER_CLICK, () => {console.log(marker);});

                });

            });
        }, error => {
            this.util.toast('Google maps not avaible');
        });
    }

}
