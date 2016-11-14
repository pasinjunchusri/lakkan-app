import {IonicModule, Config} from 'ionic-angular';
import {NgModule} from '@angular/core';
import {Http} from '@angular/http';
import {CommonModule} from '@angular/common';

// External Libs
import {MomentModule} from 'angular2-moment';
import {IonicImageLoader} from 'ionic-image-loader';
import {TranslateStaticLoader, TranslateModule, TranslateLoader, TranslateService} from 'ng2-translate';
import {FacebookService} from "ng2-facebook-sdk/dist";

export function createTranslateLoader(http: Http) {
    return new TranslateStaticLoader(http, './i18n', '.json');
}

// Config
import {language_default, languages} from '../config';

// Pipes
import {PipesModule} from '../pipes/pipes.module';

// Providers
import {ProvidersModule} from '../providers/providers.module';

// Pages
import {TabsPage} from '../pages/tabs/tabs';
import {TabHomePage} from "../pages/tab-home/tab-home";
import {TabSearchPage} from "../pages/tab-search/tab-search";
import {TabActivityPage} from "../pages/tab-activity/tab-activity";
import {IntroPage} from "../pages/intro/intro";
import {AuthPage} from './auth/auth';
import {TabAccountPage} from './tab-account/tab-account';
import {TabAccountPopoverPage} from './tab-account-popover/tab-account-popover';
import {AccountEditModalPage} from './account-edit-modal/account-edit-modal';
import {TabAccountSettingsPage} from './tab-account-settings/tab-account-settings';
import {PhotoCommentModalComponent} from '../components/photo-comment-modal/photo-comment-modal';
import {PhotoFeedbackModalComponent} from '../components/photo-feedback-modal/photo-feedback-modal';
import {PhotoGridComponent} from '../components/photo-grid/photo-grid';
import {PhotoListComponent} from '../components/photo-list/photo-list';
import {PhotoCardComponent} from '../components/photo-card/photo-card';
import {PhotoPage} from './photo/photo';
import {LoaderComponent} from '../components/loader/loader';
import {UserPasswordPage} from './user-password/user-password';
import {ProfilePage} from './profile/profile';
import {AlbumFormModalComponent} from '../components/album-form-modal/album-form-modal';
import {AlbumGridComponent} from '../components/album-grid/album-grid';
import {AlbumPhotoGridComponent} from '../components/album-photo-grid/album-photo-grid';
import {AlbumPhotoGridPopoverComponent} from '../components/album-photo-grid-popover/album-photo-grid-popover';
import {LanguageModalComponent} from '../components/language-modal/language-modal';
import {FocusDirective} from '../directives/focus/focus';
import {UserListPage} from "./user-list/user-list";
import {PhotoListPopoverComponent} from "../components/photo-list-popover/photo-list-popover";
import {AboutPage} from "./about/about";
import {PhotoMapComponent} from "../components/photo-map/photo-map";
import {LocationModalComponent} from "../components/location-modal/location-modal";
import {TabSearchMapPage} from "./tab-search-map/tab-search-map";
import {UploadStatusComponent} from "../components/upload-status/upload-status";
import {IonicUtil} from "../providers/ionic-util";
import {Logging} from "../providers/logging";
import {TabSearchMapSettingsPage} from "./tab-search-map-settings/tab-search-map-settings";
import {AlbumInputComponent} from "../components/album-input/album-input";
import {AlbumListModalPage} from "../components/album-list-modal/album-list-modal";
import {UserAvatarPage} from "./user-avatar/user-avatar";
import {GmapsAutocompleteModalPage} from "../components/gmaps-autocomplete-modal/gmaps-autocomplete-modal";
import {PhotoShareModal} from "../components/photo-share-modal/photo-share-modal";
import {IonPhotoModule} from "../components/ion-photo/ion-photo.module";
import {ExternalLib} from "../providers/external-lib";

export const APP_PAGES = [
    IntroPage,
    AuthPage,
    TabsPage,
    TabHomePage,
    TabSearchPage,
    TabSearchMapPage,
    TabSearchMapSettingsPage,
    TabActivityPage,
    TabAccountPage,
    TabAccountPopoverPage,
    TabAccountSettingsPage,
    AccountEditModalPage,
    PhotoPage,
    ProfilePage,
    UserPasswordPage,
    UserListPage,
    AboutPage,
    UserAvatarPage,
    GmapsAutocompleteModalPage,

    // Modal
    AlbumListModalPage,

    // Components
    LoaderComponent,
    PhotoCommentModalComponent,
    PhotoFeedbackModalComponent,
    PhotoGridComponent,
    PhotoMapComponent,
    PhotoListComponent,
    PhotoListPopoverComponent,
    PhotoCardComponent,
    PhotoShareModal,
    AlbumFormModalComponent,
    AlbumGridComponent,
    AlbumInputComponent,
    AlbumPhotoGridComponent,
    AlbumPhotoGridPopoverComponent,
    LanguageModalComponent,
    LocationModalComponent,
    UploadStatusComponent,
];

@NgModule({
    imports     : [
        CommonModule,
        PipesModule,
        ProvidersModule,
        IonicImageLoader,
        MomentModule,
        TranslateModule.forRoot({
            provide   : TranslateLoader,
            useFactory: (createTranslateLoader),
            deps      : [Http]
        }),
        IonPhotoModule,
        IonicModule.forRoot(TabsPage),
        IonicModule.forRoot(IntroPage),
    ],
    exports     : [
        APP_PAGES,
        MomentModule,
        IonicImageLoader,
    ],
    declarations: [
        APP_PAGES,
        FocusDirective,
    ],
    providers   : []
})
export class PagesModule {

    constructor(private translate: TranslateService,
                private config: Config,
                private fb: FacebookService,
                private util: IonicUtil,
                private logger: Logging,
                private lib: ExternalLib
    ) {
        this.translateConfig();
        this.lib.googleMaps();
        this.lib.facebookLoad();
    }


    translateConfig() {
        let userLang = navigator.language.split('-')[0]; // use navigator lang if available
        userLang     = /(pt|en|de)/gi.test(userLang) ? userLang : language_default;


        this.translate.addLangs(languages.map(lang => lang.code.split('_')[0]));

        // this language will be used as a fallback when a translation isn't found in the current language
        this.translate.setDefaultLang(language_default);


        // the lang to use, if the lang isn't available, it will use the current loader to get them
        this.translate.use(userLang).subscribe(() => {
            this.logger.log("Testing translation");

            this.translate.get('cancel', {value: 'world'}).subscribe((res: string) => {
                console.log(res);
                //=> 'hello world'
            }, (err) => {
                console.log("Translation error:" + err);
            });

            this.translate.get("cancel").subscribe(data => {
                this.logger.log("Translation test:" + data);
            });
        });

        // set lang back button
        //this.translate.get('backButtonText').subscribe((res: string) => this.config.set('backButtonText', res));
        this.config.set('backButtonText', '');

    }
}
