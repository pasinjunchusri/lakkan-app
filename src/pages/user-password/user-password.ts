import {Component} from '@angular/core';
import {NavController, ViewController} from 'ionic-angular';
import { User } from '../../providers/user';
import { IonicUtil } from '../../providers/ionic-util';

interface IPassword {
    password: string
}

@Component({
    selector   : 'page-user-password',
    templateUrl: 'user-password.html'
})
export class UserPassword {

    form: any;
    submitted: boolean = false;

    constructor(public navCtrl: NavController,
                public viewCtrl: ViewController,
                public ionicUtil: IonicUtil,
                public provider: User,
    ) {
        this.form = {
            password       : '',
            changepassword : '',
            confirmpassword: '',
        }
    }

    save(form) {
        this.submitted = true;
        if (form.valid) {
            this.ionicUtil.onLoading();
            this.provider.changePassword(this.form.password).then(user=>{
                this.dismiss();
                this.ionicUtil.endLoading();
            });
        }
    }


    dismiss() {
        this.viewCtrl.dismiss();
    }
}
