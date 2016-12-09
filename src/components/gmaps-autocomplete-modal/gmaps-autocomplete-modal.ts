import {Component} from "@angular/core";
import {ViewController} from "ionic-angular";
import {ExternalLibProvider} from "../../providers/external-lib";
import {IonicUtilProvider} from "../../providers/ionic-util";


@Component({
    selector   : 'gmaps-autocomplete-modal',
    templateUrl: 'gmaps-autocomplete-modal.html'
})
export class GmapsAutocompleteModalPage {

    _data: any;
    _service: any;
    _geocoder: any;
    loading: boolean = true;

    componentForm     = {
        street_number              : 'long_name',
        //number
        route                      : 'long_name',
        //street
        locality                   : 'long_name',
        // district
        sublocality                : 'long_name',
        // district
        neighborhood               : 'long_name',
        //state
        political                  : 'long_name',
        //state
        administrative_area_level_1: 'long_name',
        //state
        country                    : 'long_name',
        //country
        postal_code                : 'long_name' //zipcode
    };
    componentFormName = {
        street_number              : 'number',
        //number
        route                      : 'street',
        //street
        locality                   : 'city',
        // district
        administrative_area_level_1: 'state',
        //state
        country                    : 'country',
        //country
        postal_code                : 'zipcode',
        //zipcode
        neighborhood               : 'district' //zipcode
    };
    autocomplete      = {
        query: ''
    };

    constructor(private viewCtrl: ViewController,
                private lib: ExternalLibProvider,
                private util: IonicUtilProvider
    ) {
        this.loadGmaps();
    }

    loadGmaps() {
        this.lib.googleMaps().then(() => {
            setTimeout(() => {
                this._service  = new google.maps.places.AutocompleteService();
                this._geocoder = new google.maps.Geocoder();
                this.loading   = false;
            }, 1000);
        }).catch(error => {
            this.util.toast(error);
            this.util.tryConnect().then(() => this.loadGmaps());
        });
    }


    doSelect(item: any) {
        this._geocoder.geocode({address: item.description}, (results, status) => {
            this.parseAddress(results[0]).then(data => {
                console.log('Parse Address', data);
                this.viewCtrl.dismiss(data);
            });
        });
    }

    doCancel() {
        this.autocomplete.query = '';
    }

    doSearch() {
        this.loading = true;
        if (this.autocomplete.query == '') {
            this._data = [];
            return;
        }
        this._service.getPlacePredictions({input: this.autocomplete.query}, (predictions, status) => {
            this._data = [];
            predictions.map(item => this._data.push(item));
            this.loading = false;
        });
    }

    parseAddress(place) {
        return new Promise((resolve, reject) => {
            if (!place) {
                reject('not place')
            }
            let address = {
                resume: '',
                geo   : {
                    latitude : place.geometry.location.lat(),
                    longitude: place.geometry.location.lng()
                }
            };
            let image   = this.src(address.geo.latitude, address.geo.longitude, 16, 900, 200);

            for (var i = 0; i < place.address_components.length; i++) {
                var addressType = place.address_components[i].types[0];
                if (this.componentForm[addressType]) {
                    var val = place.address_components[i][this.componentForm[addressType]];

                    address[this.componentFormName[addressType]] = val;
                }
            }
            address['name']   = place.name;
            address['street'] = address['street'] + ', ' + address['number'];
            address['image']  = image;
            address.resume    = address['street'] + ' - ' + address['city'] + ', ' + address['state'] + ', ' + address['country'];
            resolve(address);
        });
    }

    src(lat, lng, zoom, w, h) {
        var link = 'http://maps.googleapis.com/maps/api/staticmap?center=' + lat + ',' + lng + '&zoom=' + zoom +
            '&scale=1&size=' + w + 'x' + h +
            '&maptype=roadmap&format=jpg&visual_refresh=true&markers=size:small%7Ccolor:0xff2600%7Clabel:0%7C' + lat +
            ',' + lng + '&sensor=true';
        return link;
    }

    dismiss() {
        this.viewCtrl.dismiss();
    }

}
