import {Component} from '@angular/core';
import {NavController, AlertController} from 'ionic-angular';
import {User} from "../../providers/user";
import {TabsPage} from "../tabs/tabs";
import {IonicUtil} from "../../providers/ionic-util";
import {Facebook} from 'ionic-native';
import {FacebookService} from "ng2-facebook-sdk";
import {UserAvatarPage} from "../user-avatar/user-avatar";

@Component({
    selector   : 'page-auth',
    templateUrl: 'auth.html'
})

export class AuthPage {
    authType: string   = 'login';
    error: string;
    submitted: boolean = false;
    facebook: any;
    facebookNative: Facebook;
    facebookBrowser: FacebookService;

    formLogin: {
        username?: string,
        password?: string
    } = {};

    formSignup: {
        name?: string,
        email?: string,
        gender?: string,
        status?: string,
        username?: string,
        password?: string
    } = {};

    alertTranslate: any = {};
    cordova: boolean    = false;

    constructor(private navCtrl: NavController,
                private provider: User,
                private alertCtrl: AlertController,
                private util: IonicUtil,
                private fb: FacebookService
    ) {
        // Define Facebook Browser and Native
        this.facebookNative  = Facebook;
        this.facebookBrowser = fb;

        this.cordova = this.util.cordova;
        this.facebook = this.cordova ? this.facebookNative : this.facebookBrowser;

        this.formSignup.gender = 'male';

        // Translate Search Bar Placeholder
        this.util.translate('Enter your email so we can send you a link to reset your password').then((res: string) => { this.alertTranslate.message = res; });
        this.util.translate('Open your email and also check the spam box').then((res: string) => { this.alertTranslate.emailRecoverySend = res; });
        this.util.translate('Email is required').then((res: string) => { this.alertTranslate.emailRequired = res; });
        this.util.translate('Recovery your password').then((res: string) => { this.alertTranslate.title = res; });
        this.util.translate('Email').then((res: string) => { this.alertTranslate.email = res; });
        this.util.translate('Cancel').then((res: string) => { this.alertTranslate.cancel = res; });
        this.util.translate('Submit').then((res: string) => { this.alertTranslate.submit = res; });
    }

    login(form) {
        this.submitted = true;
        if (form.valid) {
            this.util.onLoading();

            this.provider.signIn(this.formLogin).then(user => {
                console.log(user);
                console.log(this.provider.current());
                this.util.endLoading();
                this.onPageTabs();
            }, error => {
                console.log(error);
                this.util.endLoading();
                this.util.toast(error.message);
            });
        }
    }

    signup(form) {
        console.log(form, this.formSignup);
        this.submitted = true;
        if (form.valid) {
            this.util.onLoading();
            this.provider.signUp(this.formSignup).then(user => {
                console.log(user);
                this.provider.current = user;
                this.util.endLoading();
                this.onPageTabs();
            }, error => {
                this.util.endLoading();
                this.util.toast(error.message);
            });
        }
    }

    onPageTabs() {
        this.navCtrl.push(TabsPage);
    }

    loginFacebook() {

        this.util.onLoading();
        this.facebook.getLoginStatus().then(response => {
            console.log('getLoginStatus', response);
            if (response.status === 'connected') {
                console.log(1);
                this.processFacebookLogin(response);
            } else {
                console.log(2);
                this.facebook.login(['public_profile']).then((authData) => {
                    console.log('facebook login', authData);
                    this.processFacebookLogin(authData);
                });
            }
        });
    }

    processFacebookLogin(authData) {

        this.facebook.api('/me?fields=id,name,birthday,last_name,first_name,email,gender,picture.type(large)')
            .then((fbData) => {
                console.log('fbData', fbData);

                let facebookAuthData = {
                    id             : authData['authResponse']['userID'],
                    access_token   : authData['authResponse']['accessToken'],
                    expiration_date: (new Date().getTime() + 1000).toString()
                };

                Parse.FacebookUtils.logIn(facebookAuthData, {
                    success: (user) => {
                        if (!user.existed()) {
                            // New user
                            console.warn("User signed up and logged in through Facebook!", user);

                            this.provider.facebookSyncProfile(fbData)
                                .then(result => {
                                    this.util.endLoading();
                                    this.navCtrl.push(UserAvatarPage);
                                });

                        } else {
                            // Old User
                            console.info("User logged in through Facebook!", user);
                            this.provider.facebookSyncProfile(fbData)
                                .then(result => {
                                    this.util.endLoading();
                                    this.navCtrl.push(TabsPage);
                                });

                        }
                    },
                    error  : (user, error) => {
                        console.error('User cancelled the Facebook login or did not fully authorize.', user, error);
                        this.util.endLoading();
                        this.util.toast('User cancelled the Facebook login or did not fully authorize');

                    }
                });


            });
    }


    resetPass() {

        this.alertCtrl.create({
            title  : this.alertTranslate.title,
            message: this.alertTranslate.message,
            inputs : [
                {
                    placeholder: this.alertTranslate.email,
                    name       : 'email',
                    type       : 'email'
                }
            ],
            buttons: [
                {
                    text: this.alertTranslate.cancel,
                    role: 'cancel'
                },
                {
                    text   : this.alertTranslate.submit,
                    handler: data => {
                        if (data.email) {
                            this.util.onLoading();
                            this.provider.recoverPassword(data.email).then(result => {
                                console.log(result);
                                setTimeout(() => {
                                    this.util.endLoading();
                                    this.util.toast(this.alertTranslate.emailRecoverySend);
                                }, 500);
                                return false;
                            });
                        } else {
                            this.util.toast(this.alertTranslate.emailRequired);
                        }
                    }
                }
            ]
        }).present();
    }

}
