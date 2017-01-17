import {Component, ViewChild, ElementRef} from '@angular/core';
import {NavController} from 'ionic-angular';
import {Geolocation} from 'ionic-native';
import {IonicUtilProvider} from '../../providers/ionic-util';
import {GalleryProvider} from '../../providers/gallery';
import {ExternalLibProvider} from '../../providers/external-lib';
import {PhotoPage} from '../photo/photo';
import {IParamsLocation} from '../../models/parse.params.location.model';
import _ from 'underscore';
import {AnalyticsProvider} from '../../providers/analytics';

declare const Parse: any;
declare const google: any;

@Component({
    selector:    'page-tab-search-map',
    templateUrl: 'tab-search-map.html',
})
export class TabSearchMapPage {

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
    ) {
        // Google Analytics
        this.analytics.view('TabSearchMapPage');

        this.loadGoogleMaps();
    }

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

                    if (!this.mapInitialised) {
                        this.initMap();
                    }

                    this.enableMap();
                }
            }, 2000);

        };

        let onOffline = () => {
            this.disableMap();
        };

        document.addEventListener('online', onOnline, false);
        document.addEventListener('offline', onOffline, false);

    }

    initMap() {

        this.mapInitialised = true;

        // Get Current Location
        Geolocation.getCurrentPosition().then((position) => {

            let latLng = this.position(position.coords.latitude, position.coords.longitude);

            let mapOptions = {
                center:    latLng,
                zoom:      15,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };

            this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

            console.log(this.map);

            //Wait until the map is loaded
            google.maps.event.addListener(this.map, 'idle', () => {

                this.mapElement.nativeElement.classList.add('show-map');

                this.params.location = new Parse.GeoPoint(this.map.center.lat(), this.map.center.lng());

                console.log(this.params);

                this.provider.near(this.params).then(data => {
                    if (data && data.length) {
                        //data.map(item => this.data.push(item));
                        this.setGallerys(data);
                    }
                    this.loading = false;
                }).catch(error => {
                    console.log(error);
                    this.util.toast(error);
                });
            });

            this.params.location = new Parse.GeoPoint(position.coords.latitude, position.coords.longitude);


            let myLocation = {
                position: latLng,
                title:    'I am here',
                id:       0
            };

            console.log(myLocation);

            this.addMarker(myLocation);
            this.map.setCenter(myLocation.position);

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
            id:        item.id,
            position:  item.position,
            title:     item.title,
            map:       this.map,
            animation: google.maps.Animation.DROP,
        });
        console.log('addMaker', marker);

        google.maps.event.addListener(marker, 'click', () => {
            if (item.id !== 0) {
                this.openPhoto(item);
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
                map:      this.map,
                id:       item.id,
                position: this.position(item.location.latitude, item.location.longitude),
                title:    item.title,
                image:    item.image.url(),
                icon:     {
                    url:        item.imageThumb.url(),
                    size:       new google.maps.Size(size, size),
                    scaledSize: new google.maps.Size(size, size),
                    origin:     new google.maps.Point(0, 0),
                    anchor:     new google.maps.Point(size / 4, size / 4),
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

    onNear(a) {
        console.log(this.map);
        console.log(this.mapElement);
        //
        //if (this.map) {
        //    this.map.classList.add('show-map');
        //}

        //this.provider.near(this.params).then(data => {
        //    if (data && data.length) {
        //        //data.map(item => this.data.push(item));
        //        this.setGallerys(data);
        //    }
        //    this.loading = false;
        //}).catch(error => {
        //
        //    console.log(error);
        //    this.util.toast(error);
        //});
    }
}
