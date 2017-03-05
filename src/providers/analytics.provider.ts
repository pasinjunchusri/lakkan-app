import {Injectable} from "@angular/core";
import {GoogleAnalytics} from "@ionic-native/googleanalytics";
import {Firebase} from "@ionic-native/firebase";
import {Platform} from "ionic-angular";

@Injectable()
export class AnalyticsProvider {
    cordova: boolean = false;

    constructor(private platform: Platform) {
        this.cordova = platform.is('cordova') ? true : false;
    }

    init(GOOGLE_ID: string) {
        if (this.cordova) {
            GoogleAnalytics.startTrackerWithId(GOOGLE_ID);
        }
    }

    view(name: string) {
        if (this.cordova) {
            GoogleAnalytics.trackView(name);
            Firebase.logEvent('view', {view: name})
        }
    }

    event(category: string,
          action: string) {
        if (this.cordova) {
            GoogleAnalytics.trackEvent(category, action);
            Firebase.logEvent('event', {category: category, action: action})
        }
    }

    appVersion(version: string) {
        if (this.cordova) {
            GoogleAnalytics.setAppVersion(version);
        }
    }
}
