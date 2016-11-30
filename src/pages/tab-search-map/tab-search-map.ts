import {Component, ViewChild, ElementRef} from "@angular/core";
import {NavController} from "ionic-angular";
import {Geolocation} from "ionic-native";
import {IonicUtilProvider} from "../../providers/ionic-util";
import {GalleryProvider} from "../../providers/gallery";
import {ExternalLibProvider} from "../../providers/external-lib";
import {PhotoPage} from "../photo/photo";
import _ from "underscore";

declare const Parse: any;
declare const google: any;

@Component({
    selector   : 'page-tab-search-map',
    templateUrl: 'tab-search-map.html',
})
export class TabSearchMapPage {

    @ViewChild('map') mapElement: ElementRef;

    map: any;
    cordova: boolean = false;

    params = {
        location: null,
        distance: 100
    };

    loading: boolean = true;
    markers: any     = [];


    constructor(private util: IonicUtilProvider,
                private provider: GalleryProvider,
                private navCtrl: NavController,
                private lib: ExternalLibProvider
    ) {
        this.cordova = this.util.cordova;
    }

    ionViewDidLoad() {
        this.lib.googleMaps();
        this.loadMap();
    }

    loadMap() {

        let latLng = this.position(-34.9290, 138.6010);

        let mapOptions = {
            center   : latLng,
            zoom     : 15,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        }
        this.map       = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

        //Wait until the map is loaded
        google.maps.event.addListener(this.map, 'idle', () => this.onNear());

        // Get Current Location
        Geolocation.getCurrentPosition().then((position) => {
            this.params.location = new Parse.GeoPoint(position.coords.latitude, position.coords.longitude);
            let location         = this.position(position.coords.latitude, position.coords.longitude);

            let myLocation = {
                position: location,
                title   : 'I am here',
                id      : 0
            };

            this.addMarker(myLocation);

            this.map.setCenter(myLocation.position);

            console.log(position);

        }, (err) => {
            console.log(err);
        });

    }

    openPhoto(item) {
        this.navCtrl.push(PhotoPage, {item: item});
    }


    position(latitude: number, longitude: number) {
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

        google.maps.event.addListener(marker, 'click', () => {
            if (item.id !== 0) {
                this.openPhoto(item)
            }
        });

        this.markers.push(marker);

    }

    addInfoWindow(marker, content) {
        let infoWindow = new google.maps.InfoWindow({
            content: content
        });
        google.maps.event.addListener(marker, 'click', () => {
            infoWindow.open(this.map, marker);
        });
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

        this.provider.near(this.params).then(data => {
            if (data && data.length) {
                //data.map(item => this.data.push(item));
                this.setGallerys(data);
            }
            this.loading = false;
        }, error => {

            console.log(error);
            //reject(this.errorText)
        });
    }
}
