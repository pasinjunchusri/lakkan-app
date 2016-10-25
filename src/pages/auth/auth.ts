import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {User} from "../../providers/user";
import {TabsPage} from "../tabs/tabs";

@Component({
    selector   : 'page-auth',
    templateUrl: 'auth.html',
    providers  : [User]
})
export class AuthPage {
    authType: string = 'login';
    error: string;
    submitted: false;

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

    constructor(public navCtrl: NavController, public User: User) {}

    login(form) {
        console.log(form);
        if (form.valid) {
            this.User.signIn(this.formLogin).then(user => {
                console.log(user);
                this.onPageTabs();
            }).catch(error => {
                console.log(error);
            })
        }
    }

    signup(form) {
        if (form.valid) {
            this.User.signUp(this.formSignup).then(user => {
                console.log(user);
                this.onPageTabs();
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

}
