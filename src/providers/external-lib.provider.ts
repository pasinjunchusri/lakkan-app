import {Injectable} from "@angular/core";
import {FacebookInitParams, FacebookService} from "ng2-facebook-sdk";
import {IonicUtilProvider} from "./ionic-util.provider";
import {GOOGLE_MAPS_WEB, facebook_appVersion, facebook_appId, language_default, languages} from "../config";

@Injectable()
export class ExternalLibProvider {

    constructor(private util: IonicUtilProvider,
                private fb: FacebookService,
    ) {
        console.log('Hello ExternalLibProvider Provider');
    }

    public googleMapsLib(){
        // Create Google Maps in Browser
        let script = document.createElement('script');
        script.id  = 'gmaps';
        script.src = 'https://maps.googleapis.com/maps/api/js?callback=mapInit&libraries=places,geometry&key=' + GOOGLE_MAPS_WEB;
        document.body.appendChild(script);
    }

    public facebookLib() {
        let userLang = navigator.language.split('-')[0]; // use navigator lang if available
        userLang     = /(pt|en|de)/gi.test(userLang) ? userLang : language_default.split('_')[0];
        let lang     = languages.filter(item => item.code.toLowerCase().indexOf(userLang.toLowerCase()) > -1);
        // Create Facebook in Browser
        let script   = document.createElement('script');
        script.id    = 'facebook';
        script.src   = 'https://connect.facebook.net/' + lang[0]['code'] + '/sdk.js';
        document.body.appendChild(script);
        let fbParams: FacebookInitParams = {
            appId  : facebook_appId,
            xfbml  : true,
            version: facebook_appVersion
        };

        console.log('script', script);
        setTimeout(() => this.fb.init(fbParams), 1000);
        //setTimeout(() => Parse.FacebookUtils.init(fbParams), 1000);
    }

}
