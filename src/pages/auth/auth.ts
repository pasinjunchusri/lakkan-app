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
                this.provider.current = user;
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
        console.log('Facebook login');
        this.facebook.getLoginStatus().then(response => {
            console.log(response);
            if (response.status === 'connected') {
                this.processFacebookLogin(response);
            } else {
                this.facebook.login(['email,public_profile']).then(function (authData) {
                    this.processFacebookLogin(authData);
                });
            }

        }).catch(error => {
            console.log('error', error);

        });
    }

    processFacebookLogin(fbAuthData) {

        // this.util.onLoading('Conectando com o Facebook');
        let fbData, newUser;
        let provider = this.provider;

        this.util.onLoading();

        let face = this.facebook.api('me?_fields=name,first_name,last_name,gender,email', ['public_profile']);
        if (!this.cordova) {
            face = this.facebook.api('/me', 'get', {fields: 'name, first_name, last_name, gender, email'});
        }

        face
            .then(data => {
                console.log('fbData', data);
                fbData = data;
                return provider.findByEmail(data.email);
            }).then(user => {
            console.log('findByEmail', user);

            if (user) {
                if (!user['id']) {
                    newUser = true;
                    provider.signInViaFacebook(fbAuthData).then(result => {
                        console.log('signInViaFacebook', result);
                    });
                }

                let authData = user['attributes']['authData'];

                console.log('authData', authData);
                console.log('fbData', fbData);
                console.log(authData['facebook']['id'], fbData['id']);


                // Se encontrar o usuário
                if (authData['facebook']['id'] == fbData['id']) {
                    console.log('Login Provider com o Facebook');
                    provider.signInViaFacebook(fbAuthData).then(result => {
                        console.log('signInViaFacebook 2', result);

                        provider.updateWithFacebookData(fbData).then(user => {
                            console.log('Usuário logado', user);
                            this.util.endLoading();
                            this.onPageTabs();
                        });
                    });
                } else {
                    // Cadastrar novo usuário
                    console.log('Cadastar novo usuário', user, fbData, fbAuthData, authData);
                    this.authType        = 'signup';
                    this.formSignup.name = fbData['name'];
                    this.util.endLoading();
                }
            } else {
                console.log('Novo usuário');
                this.util.endLoading();
            }

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
