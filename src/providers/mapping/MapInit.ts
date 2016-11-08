/**
 * @author Christopher Cook
 * @copyright Webprofusion Ltd http://webprofusion.com
 */

//import {MappingAPI} from './Mapping';

declare var plugin: any;

//function initGoogleMapsCompleted() {
//    ocm_app.mappingManager.externalAPILoaded(MappingAPI.GOOGLE_WEB);
//    ocm_app.initPlacesAutocomplete();
//};

function loadGoogleMaps() {
    //load google maps script async, if google API is selected
    if (console) {
        console.log("Starting load of Google Maps Web API");
    }

    if (!window['cordova']) {
        var script  = document.createElement('script');
        script.type = 'text/javascript';
        script.src  = 'https://maps.googleapis.com/maps/api/js?libraries=places&signed_in=true&callback=initGoogleMapsCompleted'; //key=AIzaSyASE98mCjV1bqG4u2AUHqftB8Vz3zr2sEg&
        document.body.appendChild(script);
    }
}

//if we are not running under cordova then we use Google Maps Web API, otherwise we still use API for distance etc
window.onload = loadGoogleMaps;