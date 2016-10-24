import {Component} from '@angular/core';
import {ViewController, Platform} from 'ionic-angular';


@Component({
    selector   : 'page-user-login',
    templateUrl: 'user-login.html'
})
export class UserLoginPage {

    login: {username?: string, password?: string} = {};
    submitted                                     = false;

    constructor(private viewCtrl: ViewController, private platform: Platform) { }


    onLogin(form) {
        this.submitted = true;

        if (form.valid) {
            console.log(form);
            //this.navCtrl.push(TabsPage);
        }
    }

    dismiss() {
        this.viewCtrl.dismiss();
    }

}
