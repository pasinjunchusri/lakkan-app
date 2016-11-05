import {Component} from '@angular/core';

import {TabHomePage} from "../tab-home/tab-home";
import {TabSearchPage} from "../tab-search/tab-search";
import {TabActivityPage} from "../tab-activity/tab-activity";
import {TabAccountPage} from "../tab-account/tab-account";
import {Platform, NavController} from "ionic-angular";

@Component({
    templateUrl: 'tabs.html'
})

export class TabsPage {
    // this tells the tabs component which Pages
    // should be each tab's root Page
    tabHome: any     = TabHomePage;
    tabSearch: any   = TabSearchPage;
    tabActivity: any = TabActivityPage;
    tabProfile: any  = TabAccountPage;

    constructor(public platform: Platform,
                public navCtrl: NavController
    ) {

    }

    openCapture() {
        console.log('Capture');
        //this.PhotoService.open();
        InstagramAssetsPicker.getMedia(
            function(result) { // success cb
                console.log('getMedia success, result: ', JSON.stringify(result, null, 2));
                // result will be an object with at least a phAssetId, filePath, and type property
                // you will only get the rect object when 'cropAfterSelect' is false
                // the rect object is required for the cropAsset function documented below

                /* example of result when the 'cropAfterSelect' option is set to false
                 {
                 phAssetId: "A1785F1A-EF0F-458C-9AF9-C439981CE0FB/L0/001",
                 type: "video",
                 rect: {
                 Width: 0.5625000293366611,
                 Height: 0.9999999823048711,
                 Y: 0,
                 X: 0.2496093880181434
                 },
                 filePath: "file:///Users/rossmartin/Library/Developer/CoreSimulator/Devices/6465544C-C262-4EA8-BA7C-8BAB4AB98597/data/Media/DCIM/100APPLE/IMG_0006.m4v"
                 }
                 */
            },
            function(err) { // error cb
                console.log('getMedia error, err: ', err);
            },
            { // options
                type: 'all', // accepts 'photo', 'video', or 'all' - defaults to all
                cropAfterSelect: false, // see the note above for when this is false - defaults to false
                showGrid: true // determines whether to show the grid for cropping - defaults to false
            }
        );
    }
}
