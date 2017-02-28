import { PhoneContactPage } from './../phone-contact/phone-contact';
import { ExternalLibProvider } from './../../providers/external-lib.provider';
import {Component} from '@angular/core';
import { App, ModalController, NavController } from 'ionic-angular';
import {IntroPage} from "../intro/intro";
import {UserPasswordPage} from "../user-password/user-password";
import {AccountEditModalPage} from "../account-edit-modal/account-edit-modal";
import {IonicUtilProvider} from "../../providers/ionic-util.provider";
import {AboutPage} from "../about/about";
import {LanguageModalComponent} from "../../components/language-modal/language-modal";
import {UserProvider} from "../../providers/user.provider";
import {ChatChannelProvider} from "../../providers/chat-channel.provider";
import {GalleryProvider} from "../../providers/gallery.provider";
import {AnalyticsProvider} from "../../providers/analytics.provider";
import {FacebookService} from 'ng2-facebook-sdk';
import {Facebook} from "@ionic-native/facebook";

declare const FB: any;

@Component({
    selector   : 'page-tab-account-settings',
    templateUrl: 'tab-account-settings.html'
})
export class TabAccountSettingsPage {

    facebook: any;
    facebookNative: Facebook;
    facebookInitialised: boolean = false;
    cordova: boolean             = false;

    constructor(private User: UserProvider,
                private app: App,
                private navCtrl: NavController,
                private modalCtrl: ModalController,
                private util: IonicUtilProvider,
                private ChatChannel: ChatChannelProvider,
                private Gallery: GalleryProvider,
                private analytics: AnalyticsProvider,
                private fb: FacebookService,
                private lib: ExternalLibProvider,
    ) {
        // Google Analytics
        this.analytics.view('TabAccountSettingsPage');

        // Define Facebook Browser and Native
        this.facebookNative = Facebook;
        this.cordova        = this.util.cordova;

        if (!this.cordova) {
            this.loadFacebook();
            this.facebook = this.fb;
        } else {
            this.facebook = this.facebookNative;
        }
    }
    onInviteFriends(){
        this.navCtrl.push(PhoneContactPage);
    }

    onFacebookFriends(){
         this
            .analytics
            .event('Auth', 'Login with Facebook');

        this
            .util
            .onLoading();
        this
            .facebook
            .getLoginStatus()
            .then(response => {
                console.log('getLoginStatus', response);
                if (response.status === 'connected') {
                    console.log(1);
                    this.processFacebookLogin(response);
                } else {
                    console.log(2);
                    this
                        .facebook
                        .login(['public_profile'])
                        .then((authData) => {
                            console.log('facebook login', authData);
                            this.processFacebookLogin(authData);
                        })
                        .catch(error => {
                            console.log(error);
                            this
                                .util
                                .endLoading();
                            this
                                .util
                                .toast(error.message);
                        });
                }
            })
            .catch(error => {
                console.log(error);
                this
                    .util
                    .endLoading();
                this
                    .util
                    .toast(error.message);
            });
    }

    processFacebookLogin(resp){
        console.log(resp)
        this.fb.api('/me/friends').then(console.log).catch(console.error);
    }

     initFacebook() {
        console.log('Facebook Ok');
    }

    loadFacebook() {

        this.addConnectivityListeners();

        if (typeof FB == 'undefined') {

            console.log('Facebook JavaScript needs to be loaded.');
            this.disableFacebook();

            if (this.util.isOnline()) {
                console.log('online, loading facebook');
                this
                    .lib
                    .facebookLib();

            }
        } else {

            if (this.util.isOnline()) {
                console.log('showing facebook');
                this.initFacebook();
                this.enableFacebook();
            } else {
                console.log('disabling facebook');
                this.disableFacebook();
            }

        }

    }

    disableFacebook() {
        console.log('disable facebook');
    }

    enableFacebook() {
        console.log('enable facebook');
    }

    addConnectivityListeners() {

        let onOnline = () => {

            setTimeout(() => {
                if (typeof FB == 'undefined') {
                    this
                        .lib
                        .facebookLib();
                } else {
                    if (!this.facebookInitialised) {
                        this.initFacebook();
                    }
                    this.enableFacebook();
                }
            }, 2000);

        };

        let onOffline = () => {
            this.disableFacebook();
        };

        document.addEventListener('online', onOnline, false);
        document.addEventListener('offline', onOffline, false);

    }

    aboutPage(): void {
        this.modalCtrl.create(AboutPage).present();
    }

    modalLanguage() {
        this.modalCtrl.create(LanguageModalComponent).present();
    }

    href(url): void {
        this.util.href(url);
    }

    changePassword(): void {
        this.modalCtrl.create(UserPasswordPage).present();
    }

    editModal(): void {
        this.modalCtrl.create(AccountEditModalPage).present();
    }

    logout(): void {
        this.User.logout();
        this.app.getRootNav().setRoot(IntroPage);
    }

}
