import {Component} from '@angular/core';
import {NavController, ToastController, LoadingController} from 'ionic-angular';
import {User} from "../../providers/user";
import {TabsPage} from "../tabs/tabs";

@Component({
    selector   : 'page-auth',
    templateUrl: 'auth.html',
    providers  : [User]
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
                public toastCtrl: ToastController,
                public loadingCtrl: LoadingController
    ) {
    }

    login(form) {
        this.submitted = true;
        if (form.valid) {
            let loading = this.loadingCtrl.create({
                content: 'Please wait...'
            });

            loading.present();

            this.User.signIn(this.formLogin).then(user => {
                console.log(user);
                loading.dismiss();
                this.onPageTabs();
            }, error => {
                console.log(error);
                loading.dismiss();
                this.onError(error)
            });
        }
    }

    signup(form) {
        this.submitted = true;
        if (form.valid) {
            let loading = this.loadingCtrl.create({
                content: 'Please wait...'
            });

            loading.present();

            this.User.signUp(this.formSignup).then(user => {
                console.log(user);
                loading.dismiss();
                this.onPageTabs();
            }, error => {
                loading.dismiss();
                this.onError(error)
            });
        }
    }


    onError(error: any) {
        let toast = this.toastCtrl.create({
            message : error.message,
            duration: 3000,
        });
        toast.present();
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
