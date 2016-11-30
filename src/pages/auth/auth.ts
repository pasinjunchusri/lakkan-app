import {Component} from "@angular/core";
import {Validators, FormBuilder} from "@angular/forms";
import {App, AlertController, NavController} from "ionic-angular";
import {Facebook} from "ionic-native";
import {FacebookService} from "ng2-facebook-sdk";
import {TabsPage} from "../tabs/tabs";
import {UserAvatarPage} from "../user-avatar/user-avatar";
import {IonicUtilProvider} from "../../providers/ionic-util";
import {UserProvider} from "../../providers/user";

declare const Parse:any;

@Component({
    selector   : 'page-auth',
    templateUrl: 'auth.html'
})

export class AuthPage {
    authType: string = 'login';
    error: string;
    facebook: any;
    facebookNative: Facebook;
    facebookBrowser: FacebookService;

    formLogin: any;
    formSignup: any;

    alertTranslate: any = {};
    cordova: boolean    = false;

    constructor(private navCtrl: NavController,
                private provider: UserProvider,
                private alertCtrl: AlertController,
                private util: IonicUtilProvider,
                private fb: FacebookService,
                private app: App,
                private formBuilder: FormBuilder
    ) {
        // Define Facebook Browser and Native
        this.facebookNative  = Facebook;
        this.facebookBrowser = fb;

        this.cordova  = this.util.cordova;
        this.facebook = this.cordova ? this.facebookNative : this.facebookBrowser;

        //this.formSignup.gender = 'male';

        // Translate Search Bar Placeholder
        this.util.translate('Enter your email so we can send you a link to reset your password').then((res: string) => { this.alertTranslate.message = res; });
        this.util.translate('Open your email and also check the spam box').then((res: string) => { this.alertTranslate.emailRecoverySend = res; });
        this.util.translate('Email is required').then((res: string) => { this.alertTranslate.emailRequired = res; });
        this.util.translate('Recovery your password').then((res: string) => { this.alertTranslate.title = res; });
        this.util.translate('Email').then((res: string) => { this.alertTranslate.email = res; });
        this.util.translate('Cancel').then((res: string) => { this.alertTranslate.cancel = res; });
        this.util.translate('Submit').then((res: string) => { this.alertTranslate.submit = res; });
    }

    ionViewWillLoad() {
        this.formLogin = this.formBuilder.group({
            username: ['', Validators.compose([Validators.required, Validators.minLength(4)])],
            password: ['', Validators.compose([Validators.required, Validators.minLength(5)])],
        });

        // Validate user registration form
        this.formSignup = this.formBuilder.group({
            name                : ['', Validators.required],
            email               : ['', Validators.required],
            username            : ['', Validators.compose([Validators.required, Validators.minLength(4)])],
            gender              : ['', Validators.required],
            password            : ['', Validators.compose([Validators.required, Validators.minLength(6)])],
            passwordConfirmation: ['', Validators.compose([Validators.required, Validators.minLength(6)])]
        });
    }


    login(form): void {
        if (form.valid) {
            this.util.onLoading();

            this.provider.signIn(this.formLogin.value).then(user => {
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

    validPassword(password: string, confirm: string): boolean {
        console.log(password, confirm);
        return (password == confirm) ? true : false;
    }

    createUser(form): void {
        let newForm = this.formSignup.value;
        console.log(form);

        if (this.validPassword(newForm.password, newForm.passwordConfirmation)) {
            this.util.onLoading();

            delete newForm['passwordConfirmation'];
            console.log(newForm);
            this.provider.signUp(newForm).then(user => {
                console.log(user);
                this.provider.current = user;
                this.util.endLoading();
                this.onPageTabs();
            }, error => {
                console.log(error);
                this.util.endLoading();
                this.util.toast(error.message);
            });

        } else {
            this.util.toast('Password not confirm');
        }
    }

    onPageTabs(): void {
        this.app.getRootNav().setRoot(TabsPage);
    }

    loginFacebook(): void {

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

        console.log('Profcess Facebook');
        this.facebook.api('/me?fields=id,name,birthday,last_name,first_name,email,gender', ['public_profile'])
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
                            console.warn("UserProvider signed up and logged in through Facebook!", user);

                            this.provider.facebookSyncProfile(fbData)
                                .then(result => {
                                    this.util.endLoading();
                                    this.navCtrl.push(UserAvatarPage);
                                });

                        } else {
                            // Old UserProvider
                            console.info("UserProvider logged in through Facebook!", user);
                            this.provider.facebookSyncProfile(fbData)
                                .then(result => {
                                    this.util.endLoading();
                                    this.navCtrl.push(TabsPage);
                                });

                        }
                    },
                    error  : (user, error) => {
                        console.error('UserProvider cancelled the Facebook login or did not fully authorize.', user, error);
                        this.util.endLoading();
                        this.util.toast('UserProvider cancelled the Facebook login or did not fully authorize');

                    }
                });


            });
    }


    resetPassword(): void {

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
