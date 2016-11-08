import {Component, OnInit, NgZone, ChangeDetectorRef} from '@angular/core';
import {NavController, Events, Platform, ModalController} from 'ionic-angular';
import {Keyboard} from "ionic-native";
import {IonicUtil} from "../../providers/ionic-util";
import {GeoLatLng} from './../../model/GeoPosition';
import {POISearchParams} from './../../model/POISearchParams';
import {POIManager} from "../../providers/POIManager";
import {POIDetailsPage} from "../poi-details/poi-details";
import {TabSearchMapSettingsPage} from "../tab-search-map-settings/tab-search-map-settings";
import {Mapping, MappingAPI} from "../../providers/mapping/Mapping";


@Component({
    selector   : 'page-tab-search-map',
    templateUrl: 'tab-search-map.html',
})
export class TabSearchMapPage implements OnInit {

    private mapDisplayed: boolean        = false;
    private debouncedRefreshResults: any;
    private mapCanvasID: string;
    private initialResultsShown: boolean = false;
    private searchOnDemand: boolean      = true;

    poiViewMode: string = "side";

    selectedPOI: any;

    constructor(private nav: NavController,
                private events: Events,
                private platform: Platform,
                private mapping: Mapping,
                private zone: NgZone,
                private changeDetector: ChangeDetectorRef,
                private modalController: ModalController,
                private util: IonicUtil,
                private poiManager: POIManager
    ) {

        //this.mapping = new Mapping(events);

        this.mapCanvasID = 'map';

        //decide whether to use Native Google Maps SDK or Google Web API
        if ((platform.is('ios') || platform.is('android')) && !(platform.is('core') || platform.is('mobileweb'))) {
            this.mapping.setMapAPI(MappingAPI.GOOGLE_NATIVE);
            //if using native maps, don't allow the keyboard to scroll the view as this conflicts with the plugin rendering
            Keyboard.disableScroll(true);
        } else {
            this.mapping.setMapAPI(MappingAPI.GOOGLE_WEB);
            //this.mapping.setMapAPI(MappingAPI.LEAFLET);
        }
    }

    ionViewDidEnter() {
        console.log("Entered search page.");
        //give input focus to native map
        this.mapping.focusMap();
    }

    ionViewWillLeave() {
        //remove input focus from native map
        console.log("Leavings search page.");
        this.mapping.unfocusMap();
    }

    getPreferredMapHeight(clientHeight: number): number {
        if (clientHeight == null) {
            clientHeight = IonicUtil.getClientHeight();
        }
        var preferredContentHeight = clientHeight - 100;
        return preferredContentHeight;
    }

    enforceMapHeight(size: any) {
        console.log("Would resize map:" + size.width + " " + size.height);

        //this.checkViewportMode();

        let preferredContentHeight = this.getPreferredMapHeight(size[0]);

        if (document.getElementById(this.mapCanvasID).offsetHeight != preferredContentHeight) {
            document.getElementById(this.mapCanvasID).style.height = preferredContentHeight + "px";
        }
        if (this.mapping) {
            this.mapping.updateMapSize();
        }
    }


    ngOnInit() {

        this.debouncedRefreshResults = IonicUtil.debounce(this.refreshResultsAfterMapChange, 1000, false);

        this.events.subscribe('ocm:poi:selected', (args) => {
            this.viewPOIDetails(args[0]);
        });

        this.events.subscribe('ocm:mapping:ready', () => {
            if (!this.initialResultsShown) {

                //centre map on users location before starting to fetch other info
                //get user position
                //attempt to find user current position

                this.locateUser().then(() => {
                    console.log("Search: maps ready, showing first set of results");


                }, (rejection) => {
                    console.log("Could not locate user..");

                }).catch(() => {
                    console.log("Default search..");
                    this.initialResultsShown = true;
                    this.refreshResultsAfterMapChange();
                });


            }
        });

        this.events.subscribe('ocm:mapping:zoom', () => { this.debouncedRefreshResults(); });
        this.events.subscribe('ocm:mapping:dragend', () => { this.debouncedRefreshResults(); });
        this.events.subscribe('ocm:poiList:updated', (listType) => { this.showPOIListOnMap(listType); });
        this.events.subscribe('ocm:poiList:cleared', () => {
            this.mapping.clearMarkers();
            this.debouncedRefreshResults();
        });

        this.events.subscribe('ocm:window:resized', (size) => {
            //handle window resized event, updating map layout if required
            this.enforceMapHeight(size[0]);
        });

        //switch app to to side view mode if display wide enough

        this.mapping.initMap(this.mapCanvasID);

        //TODO:centre map to inital location (last search pos?)

    }

    showPOIListOnMap(listType: string) {

        var preferredMapHeight = this.getPreferredMapHeight(null);
        //TODO: vary by list type
        this.mapping.refreshMapView(preferredMapHeight, this.poiManager.poiList, null);

        if (!this.mapDisplayed) {
            //TODO:centre map on first load
            this.mapDisplayed = true;
        }

        this.mapping.updateMapSize();

        //force refresh of results list
        this.changeDetector.detectChanges();
    }

    getIconForPOI(poi) {
        return IonicUtil.getIconForPOI(poi);
    }

    refreshResultsAfterMapChange() {
        if (!this.searchOnDemand) {
            console.log("Skipping refresh, search on demand disabled..");
            return;
        } else {
            console.log("Refreshing Results..");
        }


        this.initialResultsShown = true;
        //this.appState.isSearchInProgress = true;

        var params = new POISearchParams();
        this.mapping.getMapCenter().subscribe((mapcentre) => {
            if (mapcentre != null) {

                params.latitude  = mapcentre.coords.latitude;
                params.longitude = mapcentre.coords.longitude;

                //store this as last known map centre
                this.util.searchSettings.LastSearchPosition = new GeoLatLng(mapcentre.coords.latitude, mapcentre.coords.longitude);
            }

            /////
            //params.distance = distance;
            // params.distanceUnit = distance_unit;
            // params.maxResults = this.appConfig.maxResults;
            params.includeComments = true;
            params.enableCaching   = true;

            //map viewport search on bounding rectangle instead of map centre

            //if (this.appConfig.enableLiveMapQuerying) {
            // if (this.mappingManager.isMapReady()) {
            this.mapping.getMapBounds().subscribe((bounds) => {
                if (bounds != null) {

                    params.boundingbox = "(" + bounds[0].latitude + "," + bounds[0].longitude + "),(" + bounds[1].latitude + "," + bounds[1].longitude + ")";
                    console.log(JSON.stringify(bounds));

                }
                //close zooms are 1:1 level of detail, zoomed out samples less data
                this.mapping.getMapZoom().subscribe((zoomLevel: number) => {
                    console.log("map zoom level to be converted to level of detail:" + zoomLevel);
                    if (zoomLevel > 10) {
                        params.levelOfDetail = 1;
                    } else if (zoomLevel > 6) {
                        params.levelOfDetail = 3;
                    } else if (zoomLevel > 4) {
                        params.levelOfDetail = 5;
                    } else if (zoomLevel > 3) {
                        params.levelOfDetail = 10;
                    }
                    else {
                        params.levelOfDetail = 20;
                    }
                    //console.log("zoomLevel:" + zoomLevel + "  :Level of detail:" + params.levelOfDetail);
                    //    }
                    //}

                    //apply filter settings from search settings
                    if (this.util.searchSettings != null) {
                        if (this.util.searchSettings.ConnectionTypeList != null) {
                            params.connectionTypeIdList = this.util.searchSettings.ConnectionTypeList;
                        }

                        if (this.util.searchSettings.UsageTypeList != null) {
                            params.usageTypeIdList = this.util.searchSettings.UsageTypeList;
                        }

                        if (this.util.searchSettings.StatusTypeList != null) {
                            params.statusTypeIdList = this.util.searchSettings.StatusTypeList;
                        }

                        if (this.util.searchSettings.OperatorList != null) {
                            params.operatorIdList = this.util.searchSettings.OperatorList;
                        }

                        if (this.util.searchSettings.MinPowerKW != null) {
                            params.minPowerKW = this.util.searchSettings.MinPowerKW;
                        }
                        if (this.util.searchSettings.MaxPowerKW != null) {
                            params.maxPowerKW = this.util.searchSettings.MaxPowerKW;
                        }

                        //if (this.journeyManager.getRoutePolyline() != null) {
                        //    //when searching along a polyline we discard any other bounding box filters etc
                        //    params.polyline      = this.journeyManager.getRoutePolyline();
                        //    params.boundingbox   = null;
                        //    params.levelOfDetail = null;
                        //    params.latitude      = null;
                        //    params.longitude     = null;
                        //    // params.distance = this.routeSearchDistance;
                        //}

                        /*
                         if ($("#filter-submissionstatus").val() != 200) params.submissionStatusTypeID = $("#filter-submissionstatus").val();
                         if ($("#filter-connectionlevel").val() != "") params.levelID = $("#filter-connectionlevel").val();
                         */

                    }

                    //TODO: use stack of requests as may be multiple in sync
                    this.util.isRequestInProgress = true;

                    this.poiManager.fetchPOIList(params)
                        .then(() => { }, (err) => {
                            this.util.toast("Could not fetch POI list. Check connection.");
                        });

                });


            })
                , (err) => {
                // this.util.toast( "Couldn't get map centre.");
            }

        }, (error) => {
            console.log("No map centre, can't begin refresh." + error);

        });


    }

    viewPOIDetails(args: any) {


        console.log("Viewing/fetching [" + this.poiViewMode + "] POI Details " + args.poiId);


        this.poiManager.getPOIById(args.poiId, true).subscribe(poi => {

            console.log("Got POI Details " + poi.ID);

            if (this.poiViewMode == "modal") {
                this.searchOnDemand = false; //suspend interactive searches while modal dialog active

                let poiDetailsModal = this.modalController.create(POIDetailsPage, {item: poi});

                poiDetailsModal.onDidDismiss((data) => {
                    //should focus map again..
                    console.log("Dismissing POI Details.");
                    this.mapping.focusMap();
                    this.searchOnDemand = true;
                });
                this.mapping.unfocusMap();

                this.zone.run(() => {
                    poiDetailsModal.present();
                });
            }
            if (this.poiViewMode == "side") {
                this.zone.run(() => {
                    this.selectedPOI = poi;
                });
            }

        }, (err) => {

            this.util.toast("POI Details not available");
        });


    }

    closePOIDetails() {
        this.selectedPOI = null;
    }


    openSearchOptions() {
        this.nav.push(TabSearchMapSettingsPage);
    }

    locateUser(): Promise<any> {

        var geoPromise = new Promise((resolve, reject) => {
            console.log("Attempting to locate user..");
            navigator.geolocation.getCurrentPosition(resolve, reject);
        }).then((position: any) => {
            console.log("Got user location.");

            this.mapping.updateMapCentrePos(position.coords.latitude, position.coords.longitude, true);
            this.mapping.setMapZoom(15); //TODO: provider specific ideal zoom for 'summary'
            //this.mapping.updateMapSize();

            this.showPOIListOnMap(null);//show initial map view

            // this.refreshResultsAfterMapChange(); //fetch new poi results based on map viewport
        }).catch((err) => {
            ///no geolocation
            console.log("Failed to get user location.");
            this.util.toast("Your location could not be determined.")

            //use a default location, or the last known search position if known
            var searchPos = new GeoLatLng(37.415328, -122.076575);
            if (this.util.searchSettings.LastSearchPosition != null) {
                searchPos = this.util.searchSettings.LastSearchPosition;
            }

            this.util.searchSettings.LastSearchPosition = searchPos;
            this.mapping.updateMapCentrePos(searchPos.latitude, searchPos.longitude, true);
            this.mapping.setMapZoom(15);

            this.refreshResultsAfterMapChange();
            //this.mapping.updateMapSize();

        });

        return geoPromise;

    }

    placeSelected(place) {

        console.log("Got place details:" + place.name);


        //give map back the input focus (mainly for native map)
        this.mapping.focusMap();

        this.mapping.updateMapCentrePos(place.geometry.location.lat(), place.geometry.location.lng(), true);
        this.refreshResultsAfterMapChange();
        ///this.mapping.setMapZoom(15);
        //this.debouncedRefreshResults();


    }

}
