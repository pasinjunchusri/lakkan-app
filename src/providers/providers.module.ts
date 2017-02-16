import { Storage } from '@ionic/storage';
import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
// Providers
import {IonicUtilProvider} from "./ionic-util.provider";
import {LoggingProvider} from "./logging.provider";
import {AuthProvider} from "./auth.provider";
import {UserProvider} from "./user.provider";
import {GalleryProvider} from "./gallery.provider";
import {GalleryActivityProvider} from "./gallery-activity.provider";
import {GalleryCommentProvider} from "./gallery-comment.provider";
import {ParseFileProvider} from "./parse-file.provider";
import {ParsePushProvider} from "./parse-push.provider";
import {GallerFeedbackProvider} from "./gallery-feedback.provider";
import {UserDataProvider} from "./user-data.provider";
import {GalleryAlbumProvider} from "./gallery-album.provider";
import {ExternalLibProvider} from "./external-lib.provider";
import {ChatChannelProvider} from "./chat-channel.provider";
import {ChatMessageProvider} from "./chat-message.provider";
import {AnalyticsProvider} from "./analytics.provider";

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
    ParsePushProvider,
    ChatChannelProvider,
    ChatMessageProvider,
    AnalyticsProvider,
    Storage,
];

@NgModule({
    imports     : [CommonModule],
    exports     : [],
    declarations: [],
    providers   : [sharedProviders]
})
export class ProvidersModule {
}
