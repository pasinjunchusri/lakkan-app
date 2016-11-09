import {Component} from '@angular/core';
import {NavController, AlertController} from 'ionic-angular';
import {User} from "../../providers/user";
import {TabsPage} from "../tabs/tabs";
import {IonicUtil} from "../../providers/ionic-util";
import {Facebook} from 'ionic-native';
import {FacebookService} from "ng2-facebook-sdk";

@Component({
    selector   : 'page-auth',
    templateUrl: 'auth.html'
})

export class AuthPage {
    authType: string   = 'login';
    error: string;
    submitted: boolean = false;
    facebook: any;

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

        this.cordova  = this.util.cordova;
        this.facebook = this.cordova ? Facebook : fb;

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

    processFacebookLogin(fbAuthData) {

        let fbData;
        let provider = this.provider;

        this.facebook.api('/me?fields=name,birthday,gender,email').then(data => {
            console.log('fbData', data);
            fbData = data;
            if (fbData['email']) {
                console.log('Logica 1');
                return provider.findByEmail(data.email).then(() => provider.signInViaFacebook(fbAuthData));
            } else {
                console.log('Logica 2');
                return provider.signInViaFacebook(fbAuthData);
            }
        }).then(respUser => {
            console.log('respUser', respUser);

            if(!respUser.name) {
                if(fbData['name']) {respUser.set('name', fbData['name']);}
                if(fbData['gender']) {respUser.set('gender', fbData['gender']);}
                respUser.save();
            }

            this.util.endLoading();
            this.onPageTabs();

        }).catch(error => {
            console.log('error', error);
            this.util.endLoading();

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
