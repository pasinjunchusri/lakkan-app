import {NgModule} from '@angular/core';
import {CommonModule} from "@angular/common";

// Providers
import {IonicUtilProvider} from "./ionic-util";
import {AuthProvider} from "./auth";
import {UserProvider} from "./user";
import {GalleryProvider} from "./gallery";
import {GalleryActivityProvider} from "./gallery-activity";
import {GalleryCommentProvider} from "./gallery-comment";
import {ParseFileProvider} from "./parse-file";
import {ParsePushProvider} from "./parse-push";
import {GallerFeedbackProvider} from "./gallery-feedback";
import {UserDataProvider} from "./user-data";
import {GalleryAlbumProvider} from './gallery-album';
import {LoggingProvider} from "./logging";
import {ExternalLibProvider} from "./external-lib";

export const sharedProviders = [
    IonicUtilProvider,
    ExternalLibProvider,
    LoggingProvider,
    AuthProvider,
    UserProvider,
    UserDataProvider,
    GalleryProvider,
    GalleryAlbumProvider,
    GalleryActivityProvider,
    GalleryCommentProvider,
    GallerFeedbackProvider,
    ParseFileProvider,
    ParsePushProvider
];

@NgModule({
    imports     : [CommonModule],
    exports     : [],
    declarations: [],
    providers   : [sharedProviders]
})
export class ProvidersModule {
}
