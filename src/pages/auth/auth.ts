import {Component} from '@angular/core';
import {NavController, AlertController} from 'ionic-angular';
import {User} from "../../providers/user";
import {TabsPage} from "../tabs/tabs";
import {IonicUtil} from "../../providers/ionic-util";

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

    constructor(public navCtrl: NavController,
                public User: User,
                public alertCtrl: AlertController,
                public util: IonicUtil
    ) {
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
        let alert = this.alertCtrl.create({
            title  : 'Recovery your password',
            message: 'Enter your email so we can send you a link to reset your password',
            inputs : [
                {
                    name       : 'email',
                    placeholder: 'Email',
                    type       : 'email'
                }
            ],
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel'
                },
                {
                    text   : 'Submit',
                    handler: data => {
                        this.User.recoverPassword(data.email).then(result => {
                            console.log(result);
                            return false;
                        })
                    }
                }
            ]
        });
        alert.present();
    }

}
