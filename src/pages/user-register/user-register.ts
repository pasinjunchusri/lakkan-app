import {Component} from '@angular/core';
import {ViewController, Platform} from 'ionic-angular';


@Component({
    selector   : 'page-user-register',
    templateUrl: 'user-register.html'
})
export class UserRegisterPage {
    signup: {username?: string, password?: string} = {};
    submitted                                      = false;

    constructor(private viewCtrl: ViewController, private platform: Platform) { }

    onSignup(form) {
        this.submitted = true;

        if (form.valid) {
            console.log(form);
        }
    }

    dismiss() {
        this.viewCtrl.dismiss();
    }
}
