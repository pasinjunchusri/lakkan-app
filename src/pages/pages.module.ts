import {IonicModule, Config, Platform} from 'ionic-angular';
import {NgModule} from '@angular/core';
import {Http, HttpModule} from '@angular/http';
import {BrowserModule} from '@angular/platform-browser';
import {CommonModule} from '@angular/common';

// External Libs
import {MomentModule} from 'angular2-moment';
import {IonicImageLoader} from 'ionic-image-loader';
import {TranslateStaticLoader, TranslateModule, TranslateLoader, TranslateService} from 'ng2-translate';
import {FacebookService, FacebookInitParams} from "ng2-facebook-sdk/dist";

export function createTranslateLoader(http: Http) {
    return new TranslateStaticLoader(http, './i18n', '.json');
}

// Config
import {language_default, languages, facebook_appId, facebook_appVersion} from '../config';

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
import {AccountEditModal} from './account-edit-modal/account-edit-modal';
import {TabAccountSettingsPage} from './tab-account-settings/tab-account-settings';
import {PhotoCommentModal} from '../components/photo-comment-modal/photo-comment-modal';
import {PhotoFeedbackModal} from '../components/photo-feedback-modal/photo-feedback-modal';
import {PhotoGrid} from '../components/photo-grid/photo-grid';
import {PhotoList} from '../components/photo-list/photo-list';
import {PhotoCard} from '../components/photo-card/photo-card';
import {PhotoPage} from './photo/photo';
import {Loader} from '../components/loader/loader';
import {UserPassword} from './user-password/user-password';
import {ProfilePage} from './profile/profile';
import {PhotoCaptureModal} from '../components/photo-capture-modal/photo-capture-modal';
import {AlbumFormModal} from '../components/album-form-modal/album-form-modal';
import {AlbumList} from '../components/album-list/album-list';
import {AlbumGrid} from '../components/album-grid/album-grid';
import {AlbumPhotoGrid} from '../components/album-photo-grid/album-photo-grid';
import {AlbumPhotoGridPopover} from '../components/album-photo-grid-popover/album-photo-grid-popover';
import {LanguageModal} from '../components/language-modal/language-modal';
import {FocusDirective} from '../directives/focus/focus';
import {UserListPage} from "./user-list/user-list";
import {PhotoListPopover} from "../components/photo-list-popover/photo-list-popover";
import {TabCapturePage} from "./tab-capture/tab-capture";
import {TabCapturSharePage} from "./tab-capture-share/tab-capture-share";
import {AboutPage} from "./about/about";

export const APP_PAGES = [
    IntroPage,
    AuthPage,
    TabsPage,
    TabHomePage,
    TabSearchPage,
    TabCapturePage,
    TabCapturSharePage,
    TabActivityPage,
    TabAccountPage,
    TabAccountPopoverPage,
    TabAccountSettingsPage,
    AccountEditModal,
    PhotoPage,
    ProfilePage,
    UserPassword,
    UserListPage,
    AboutPage,

    // Components
    Loader,
    PhotoCommentModal,
    PhotoFeedbackModal,
    PhotoGrid,
    PhotoList,
    PhotoListPopover,
    PhotoCard,
    PhotoCaptureModal,
    AlbumFormModal,
    AlbumList,
    AlbumGrid,
    AlbumPhotoGrid,
    AlbumPhotoGridPopover,
    LanguageModal,
];

@NgModule({
    imports     : [
        CommonModule,
        BrowserModule,
        HttpModule,
        PipesModule,
        ProvidersModule,
        IonicImageLoader,
        MomentModule,
        TranslateModule.forRoot({
            provide   : TranslateLoader,
            useFactory: (createTranslateLoader),
            deps      : [Http]
        }),
        IonicModule.forRoot(TabsPage),
        IonicModule.forRoot(IntroPage),
    ],
    exports     : [
        APP_PAGES,
        BrowserModule,
        HttpModule,
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
                private platform: Platform,
                private fb: FacebookService
    ) {
        this.translateConfig();
        this.facebookInit();
    }

    facebookInit() {
        let userLang = navigator.language.split('-')[0]; // use navigator lang if available
        userLang     = /(pt|en|de)/gi.test(userLang) ? userLang : language_default.split('_')[0];
        let lang     = languages.filter(item => {
            return item.code.toLowerCase().indexOf(userLang.toLowerCase()) > -1;
        });

        // Create Facebook in Browser
        let script = document.createElement('script');
        script.id  = 'facebook';
        script.src = 'https://connect.facebook.net/' + lang[0]['code'] + '/sdk.js';
        document.body.appendChild(script);

        this.platform.ready().then(() => {
            if (!this.platform.is('cordova')) {
                let fbParams: FacebookInitParams = {
                    appId  : facebook_appId,
                    xfbml  : true,
                    version: facebook_appVersion
                };
                setTimeout(() => this.fb.init(fbParams), 1000);
            }
        })

    }

    translateConfig() {
        let userLang = navigator.language.split('-')[0]; // use navigator lang if available
        userLang     = /(pt|en|de)/gi.test(userLang) ? userLang : language_default;

        console.log(userLang);

        this.translate.addLangs(languages.map(lang => lang.code.split('_')[0]));

        // this language will be used as a fallback when a translation isn't found in the current language
        this.translate.setDefaultLang(language_default);


        // the lang to use, if the lang isn't available, it will use the current loader to get them
        this.translate.use(userLang);

        // set lang back button
        //this.translate.get('backButtonText').subscribe((res: string) => this.config.set('backButtonText', res));
        this.config.set('backButtonText', '');

    }
}
