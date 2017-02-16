import {Component} from "@angular/core";
import {Validators, FormBuilder} from "@angular/forms";
import {App, AlertController, NavController} from "ionic-angular";
import {IonicUtilProvider} from "../../providers/ionic-util.provider";
import {UserProvider} from "../../providers/user.provider";
import {ExternalLibProvider} from "../../providers/external-lib.provider";
import {AnalyticsProvider} from "../../providers/analytics.provider";
import {TabsPage} from "../tabs/tabs";

declare const Parse: any;
declare const FB: any;

@Component({
  selector: 'page-auth-login',
  templateUrl: 'auth-login.html'
})
export class AuthLoginPage {
    authType: string = 'login';
    error: string;

    formLogin: any;
    formSignup: any;

    alertTranslate: any        = {};
    cordova: boolean           = false;
    inputPasswordType: string  = 'password';
    inputPasswordIcon: string  = 'eye-off';
    inputPasswordShow: boolean = false;

    constructor(private navCtrl: NavController,
                private provider: UserProvider,
                private alertCtrl: AlertController,
                private util: IonicUtilProvider,
                private app: App,
                private formBuilder: FormBuilder,
                private lib: ExternalLibProvider,
                private analytics: AnalyticsProvider,
    ) {
        // Google Analytics
        this.analytics.view('AuthPage');

       

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

    }

    toggleInputPassword() {
        this.inputPasswordShow = !this.inputPasswordShow;
        this.inputPasswordType = this.inputPasswordShow ? 'text' : 'password';
        this.inputPasswordIcon = this.inputPasswordShow ? 'eye' : 'eye-off';
    }

    login(form): void {
        this.analytics.event('Auth','login');
        if (form.valid) {
            this.util.onLoading();

            this.provider.signIn(this.formLogin.value).then(user => {
                console.log(user);
                console.log(this.provider.current());
                this.util.endLoading();
                this.onPageTabs();
            }).catch(error => {
                console.log(error);
                this.util.endLoading();
                this.util.toast(error.message);
            });
        }
    }

    validPassword(password: string, confirm: string): boolean {
        return (password == confirm) ? true : false;
    }

    onPageTabs(): void {
        this.app.getRootNav().setRoot(TabsPage);
    }


    resetPassword(): void {
        this.analytics.event('Auth','reset password');
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
                            }).catch(error => {
                                this.util.toast('Server error');
                                this.util.endLoading();
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
