import {Component} from '@angular/core';
import {ViewController} from 'ionic-angular';
import {UserProvider} from '../../providers/user';
import {IonicUtilProvider} from '../../providers/ionic-util';

interface IPassword {
    password: string
}

@Component({
    selector   : 'page-user-password',
    templateUrl: 'user-password.html'
})
export class UserPasswordPage {

    submitted: boolean = false;
    form: any          = {
        password       : '',
        changepassword : '',
        confirmpassword: '',
    };

    constructor(private viewCtrl: ViewController,
                private ionicUtil: IonicUtilProvider,
                private provider: UserProvider,
    ) {

    }

    save(form) {
        this.submitted = true;
        if (form.valid) {
            this.ionicUtil.onLoading();
            this.provider.changePassword(this.form.password).then(user => {
                this.ionicUtil.endLoading();
                this.dismiss();
            });
        }
    }


    dismiss() {
        this.viewCtrl.dismiss();
    }
}
