import {Component} from '@angular/core';
import {GoogleMap, GoogleMapsLatLng, GoogleMapsEvent} from "@ionic-native/googlemap";
import {Geolocation} from "@ionic-native/geolocation";
import {Platform} from "ionic-angular";
// http://www.joshmorony.com/integrating-native-google-maps-into-an-ionic-2-application/
@Component({
    selector   : 'photo-map',
    templateUrl: 'photo-map.html'
})
export class PhotoMapComponent {
    _map: GoogleMap;
    _currentPosition: GoogleMapsLatLng;

    constructor(private platform: Platform) {
        platform.ready().then(() => {
            this.startMap();
        });
    }


    startMap() {
        if (this._currentPosition) {
            this.loadMap(this._currentPosition);
        } else {
            Geolocation.getCurrentPosition().then(position => {
                this._currentPosition = new GoogleMapsLatLng(position.coords.latitude, position.coords.longitude);
                this.loadMap(this._currentPosition);
            })
        }
    }

    loadMap(location: GoogleMapsLatLng): void {

        this._map = new GoogleMap('map', {
            backgroundColor: 'white',
            controls       : {
                compass         : true,
                myLocationButton: true,
                indoorPicker    : true,
                zoom            : true,
            },
            gestures       : {
                scroll: true,
                tilt  : true,
                rotate: true,
                zoom  : true,
            },
            camera         : {
                latLng : location,
                tilt   : 30,
                zoom   : 15,
                bearing: 50
            }
        });

        this._map.on(GoogleMapsEvent.MAP_READY).subscribe(() => {
            console.log('Mais is ready!');
        });
    }
}
