import {Component} from '@angular/core';
import {ViewController, Platform} from 'ionic-angular';


@Component({
    selector   : 'page-user-forgot',
    templateUrl: 'user-forgot.html'
})
export class UserForgotPage {
    signup: {username?: string, password?: string} = {};
    submitted                                      = false;

    constructor(private viewCtrl: ViewController, private platform: Platform) { }

    onForgotPassword(form) {
        this.submitted = true;

        if (form.valid) {
            console.log(form);
        }
    }

    dismiss() {
        this.viewCtrl.dismiss();
    }
}
