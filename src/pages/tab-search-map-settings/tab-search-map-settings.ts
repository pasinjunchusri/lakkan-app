import {Component} from '@angular/core';
import {POIManager} from './../../providers/POIManager';
import {SearchSettings} from './../../model/SearchSettings';
import {IonicUtil} from "../../providers/ionic-util";

@Component({
    templateUrl: 'tab-search-map-settings.html'
})
export class TabSearchMapSettingsPage {


    operators: Array<any>;
    usageTypes: Array<any>;
    statusTypes: Array<any>;
    connectionTypes: Array<any>;

    searchSettings: SearchSettings;
    languages: any;
    powerRange = {lower: 0, upper: 500};

    constructor(public poiManager: POIManager,
                private  util: IonicUtil
    ) {

        this.searchSettings = new SearchSettings();

        this.languages = this.util.getLanguages();
        //TODO reference data manager with filtered versions of reference type lists
        //
        if (this.searchSettings.MinPowerKW != null) {
            this.powerRange.lower = this.searchSettings.MinPowerKW;
        }
        if (this.searchSettings.MaxPowerKW != null) {
            this.powerRange.upper = this.searchSettings.MaxPowerKW;
        }
        if (this.powerRange.upper == 0) {
            this.powerRange.upper = 500;
        }
    }

    ionViewWillLeave() {
        if (this.searchSettings.Language != null) {
            this.util.setLanguage(this.searchSettings.Language);
        }

        this.searchSettings.MinPowerKW = this.powerRange.lower;
        this.searchSettings.MaxPowerKW = this.powerRange.upper;

        if (this.searchSettings.MinPowerKW == 1) {
            this.searchSettings.MinPowerKW = null;
        }
        if (this.searchSettings.MaxPowerKW == 500) {
            this.searchSettings.MaxPowerKW = null;
        }

        //save search settings
        this.util.searchSettings = this.searchSettings;
        this.util.saveSearchSettings();

        //TODO: publish event to refresh results based on new criteria
        this.poiManager.clearResults();
    }
}
