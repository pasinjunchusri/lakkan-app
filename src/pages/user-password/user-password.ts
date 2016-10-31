import {Component} from '@angular/core';
import {NavController, ViewController} from 'ionic-angular';

interface IPassword {
    password: string
}

@Component({
    selector   : 'page-user-password',
    templateUrl: 'user-password.html'
})
export class UserPassword {

    form: any;

    constructor(public navCtrl: NavController,
                public viewCtrl: ViewController
    ) {
        this.form = {
            password       : null,
            changepassword : null,
            confirmpassword: null,
        }
    }

    save(form) {
        if (form.valid) {

        }
    }


    dismiss() {
        this.viewCtrl.dismiss();
    }
}
