import {NgModule} from '@angular/core';
import {CommonModule} from "@angular/common";

// Providers
import {IonicUtil} from "./ionic-util";
import {Auth} from "./auth";
import {User} from "./user";
import {Gallery} from "./gallery";
import {GalleryActivity} from "./gallery-activity";
import {GalleryComment} from "./gallery-comment";
import {ParseFile} from "./parse-file";
import {ParsePush} from "./parse-push";
import {GallerFeedback} from "./gallery-feedback";
import {UserData} from "./user-data";
import {PhotoService} from "./photo-service";
import {GalleryAlbum} from './gallery-album';
import {UploadService} from "./upload";
import {Logging} from "./logging";

export const sharedProviders = [
    IonicUtil,
    Logging,
    Auth,
    User,
    UserData,
    PhotoService,
    Gallery,
    GalleryAlbum,
    GalleryActivity,
    GalleryComment,
    GallerFeedback,
    ParseFile,
    ParsePush,
    UploadService,
];

@NgModule({
    imports     : [CommonModule],
    exports     : [],
    declarations: [],
    providers   : [sharedProviders]
})
export class ProvidersModule {
}
