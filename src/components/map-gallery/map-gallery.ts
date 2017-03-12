import {Component, ViewChild, ElementRef} from "@angular/core";
import {NavController} from "ionic-angular";
import {Geolocation} from "@ionic-native/geolocation";
import {IonicUtilProvider} from "../../providers/ionic-util.provider";
import {GalleryProvider} from "../../providers/gallery.provider";
import {ExternalLibProvider} from "../../providers/external-lib.provider";
import {IParamsLocation} from "../../models/parse.params.location.model";
import _ from "underscore";
import {AnalyticsProvider} from "../../providers/analytics.provider";
import {PhotoPage} from "../../pages/photo/photo";

declare const Parse: any;
declare const google: any;

@Component({
    selector   : 'map-gallery',
    templateUrl: 'map-gallery.html'
})
export class MapGalleryComponent {

    @ViewChild('map') mapElement: ElementRef;

    map: any;
    mapInitialised: boolean = false;

    params: IParamsLocation = {
        location: null,
        distance: 100
    };

    loading: boolean = true;
    markers: any     = [];


    constructor(private util: IonicUtilProvider,
                private provider: GalleryProvider,
                private navCtrl: NavController,
                private lib: ExternalLibProvider,
                private analytics: AnalyticsProvider,
                private Geolocation: Geolocation,
    ) {
        // Google Analytics
        this.analytics.view('TabSearchMapPage');

        // Delay for load Map
        setTimeout(() => this.loadGoogleMaps(), 500);
    }

    // Load Google Maps Web App if online device
    loadGoogleMaps() {
        this.addConnectivityListeners();
        if (typeof google == 'undefined' || typeof google.maps == 'undefined') {

            console.log('Google maps JavaScript needs to be loaded.');
            this.disableMap();

            if (this.util.isOnline()) {
                console.log('online, loading map');

                //Load the SDK
                window['mapInit'] = () => {
                    this.initMap();
                    this.enableMap();
                };
                this.lib.googleMapsLib();
            }
        } else {
            if (this.util.isOnline()) {
                console.log('showing map');
                this.initMap();
                this.enableMap();
            }
            else {
                console.log('disabling map');
                this.disableMap();
            }
        }
    }

    disableMap() {
        console.log('disable map');
    }

    enableMap() {
        console.log('enable map');
    }

    addConnectivityListeners() {

        let onOnline = () => {
            setTimeout(() => {
                if (typeof google == 'undefined' || typeof google.maps == 'undefined') {
                    this.lib.googleMapsLib();
                } else {
                    (!this.mapInitialised) ? this.initMap() : this.enableMap();
                }
            }, 2000);

        };

        let onOffline = () => this.disableMap();

        document.addEventListener('online', onOnline, false);
        document.addEventListener('offline', onOffline, false);

    }

    initMap() {

        this.mapInitialised = true;

        let latLng = this.position(-34.9290, 138.6010);

        let mapOptions = {
            center   : latLng,
            zoom     : 15,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        // Load Google Maps
        this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

        // Load my position
        this.onMyPosition();

        //On Map Listener event
        google.maps.event.addListener(this.map, 'idle', () => this.onNear());

    }

    onMyPosition() {
        this.util.toast('Loading my position');
        // Get Current Location
        this.Geolocation.getCurrentPosition().then((position) => {

            let latLng           = this.position(position.coords.latitude, position.coords.longitude);
            this.params.location = new Parse.GeoPoint(position.coords.latitude, position.coords.longitude);

            let myLocation = {
                position: latLng,
                title   : 'I am here',
                id      : 0
            };

            this.util.toast('I am here');
            console.log(myLocation);

            setTimeout(() => {
                this.addMarker(myLocation);
                this.map.setCenter(myLocation.position);
            }, 1000);

        }, (err) => {
            console.log(err);
        });
    }

    openPhoto(item: any): void {
        this.navCtrl.push(PhotoPage, {id: item.id});
    }


    position(latitude: number, longitude: number): any {
        return new google.maps.LatLng(latitude, longitude);
    }

    addMarker(item) {
        let marker = new google.maps.Marker({
            id       : item.id,
            position : item.position,
            title    : item.title,
            map      : this.map,
            animation: google.maps.Animation.DROP,
        });
        console.log('addMaker', marker);
        this.markers.push(marker);
        if (item.id) {
            google.maps.event.addListener(marker, 'click', () => this.openPhoto(item));
        }
    }

    addInfoWindow(marker, content) {
        let infoWindow = new google.maps.InfoWindow({content: content});
        google.maps.event.addListener(marker, 'click', () => infoWindow.open(this.map, marker));
    }

    setGallerys(data) {
        data.map((item) => {
            let size   = 40;
            let marker = new google.maps.Marker({
                map     : this.map,
                id      : item.id,
                position: this.position(item.location.latitude, item.location.longitude),
                title   : item.title,
                image   : item.image.url(),
                icon    : {
                    url       : item.imageThumb.url(),
                    size      : new google.maps.Size(size, size),
                    scaledSize: new google.maps.Size(size, size),
                    origin    : new google.maps.Point(0, 0),
                    anchor    : new google.maps.Point(size / 4, size / 4),
                },
                username: item.attributes.user.attributes.username
            });
            console.log(marker);

            if (!_.some(this.markers, item.id)) {
                google.maps.event.addListener(marker, 'click', () => this.openPhoto(item));
                this.markers.push(marker);
            }
        });
    }

    onNear() {
        this.mapElement.nativeElement.classList.add('show-map');
        this.params.location = new Parse.GeoPoint({latitude: this.map.center.lat(), longitude: this.map.center.lng()});
        console.log(this.params);

        this.provider.near(this.params).then(data => {
            console.log(data);
            if (data && data.length) {
                //data.map(item => this.data.push(item));
                this.setGallerys(data);
            }
            this.loading = false;
        }).catch(error => {
            console.log(error);
            this.util.toast(error);
        });
    }

    load(){

        //this.data = this.applyHaversine(data.locations);
        //this.data.sort((locationA, locationB) => locationA.distance - locationB.distance);

    }

    applyHaversine(locations){

        let usersLocation = {
            lat: 40.713744,
            lng: -74.009056
        };

        locations.map((location) => {

            let placeLocation = {
                lat: location.latitude,
                lng: location.longitude
            };

            location.distance = this.getDistanceBetweenPoints(
                usersLocation,
                placeLocation,
                'miles'
            ).toFixed(2);
        });

        return locations;
    }

    getDistanceBetweenPoints(start, end, units){

        let earthRadius = {
            miles: 3958.8,
            km: 6371
        };

        let R = earthRadius[units || 'miles'];
        let lat1 = start.lat;
        let lon1 = start.lng;
        let lat2 = end.lat;
        let lon2 = end.lng;

        let dLat = this.toRad((lat2 - lat1));
        let dLon = this.toRad((lon2 - lon1));
        let a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
        let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        let d = R * c;

        return d;

    }

    toRad(x){
        return x * Math.PI / 180;
    }

}
