import {Injectable} from '@angular/core';
import {FacebookInitParams, FacebookService} from "ng2-facebook-sdk";
import {IonicUtilProvider} from "./ionic-util";
import {GOOGLE_MAPS_WEB, facebook_appVersion} from "../config";
import {facebook_appId, language_default, languages} from '../config'

@Injectable()
export class ExternalLibProvider {

    constructor(private util: IonicUtilProvider,
                private fb: FacebookService,
    ) {
        console.log('Hello ExternalLibProvider Provider');
    }

    public googleMaps() {
        if (this.util.isOnline()) {
            this.googleMapsLib();
        } else {
            this.util.tryConnect().then(() => {
                this.googleMaps();
            }).catch(() => {
                this.util.toast('Google Maps not avaible');
            });
        }
    }

    public facebookLoad() {
        if (this.util.isOnline()) {
            this.facebookLib();
        } else {
            this.util.tryConnect().then(() => {
                this.facebookLib();
            }).catch(() => {
                this.util.toast('Facebook not avaible');
            });
        }
    }

    private googleMapsLib(): void {
        // Create Google Maps in Browser
        let script = document.createElement('script');
        script.id  = 'gmaps';
        script.src = 'https://maps.googleapis.com/maps/api/js?libraries=places,geometry&key=' + GOOGLE_MAPS_WEB;
        document.body.appendChild(script);
    }

    private facebookLib(): void {
        let userLang = navigator.language.split('-')[0]; // use navigator lang if available
        userLang     = /(pt|en|de)/gi.test(userLang) ? userLang : language_default.split('_')[0];
        let lang     = languages.filter(item => {
            return item.code.toLowerCase().indexOf(userLang.toLowerCase()) > -1;
        });
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
        setTimeout(() => this.fb.init(fbParams), 500);
    }

}
