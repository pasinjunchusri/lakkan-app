import {Component} from '@angular/core';
import {NavController, AlertController} from 'ionic-angular';
import {User} from "../../providers/user";
import {TabsPage} from "../tabs/tabs";
import {IonicUtil} from "../../providers/ionic-util";
import { TranslateService } from 'ng2-translate';

@Component({
    selector   : 'page-auth',
    templateUrl: 'auth.html'
})

export class AuthPage {
    authType: string   = 'login';
    error: string;
    submitted: boolean = false;

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

    constructor(public navCtrl: NavController,
                public User: User,
                public alertCtrl: AlertController,
                public util: IonicUtil,
                public translate: TranslateService
    ) {
        // Translate Search Bar Placeholder
        this.translate.get('Enter your email so we can send you a link to reset your password').subscribe((res:string)=>{this.alertTranslate.message = res;});
        this.translate.get('Email is required').subscribe((res:string)=>{this.alertTranslate.emailRequired = res;});
        this.translate.get('Recovery your password').subscribe((res:string)=>{this.alertTranslate.title = res;});
        this.translate.get('Email').subscribe((res:string)=>{this.alertTranslate.email = res;});
        this.translate.get('Cancel').subscribe((res:string)=>{this.alertTranslate.cancel = res;});
        this.translate.get('Submit').subscribe((res:string)=>{this.alertTranslate.submit = res;});
    }

    login(form) {
        this.submitted = true;
        if (form.valid) {
            this.util.onLoading();

            this.User.signIn(this.formLogin).then(user => {
                console.log(user);
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
        this.submitted = true;
        if (form.valid) {
            this.util.onLoading();

            this.User.signUp(this.formSignup).then(user => {
                console.log(user);
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
    }

    signupFacebook() {

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
                       if(data.email) {
                            this.User.recoverPassword(data.email).then(result => {
                                console.log(result);
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
