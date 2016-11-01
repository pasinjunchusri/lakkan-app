import {Component} from '@angular/core';
import {NavController, ViewController} from 'ionic-angular';
import {IonicUtil} from "../../providers/ionic-util";
import {User} from "../../providers/user";

@Component({
    selector   : 'page-account-edit-modal',
    templateUrl: 'account-edit-modal.html'
})
export class AccountEditModal {

    form: any;
    photo: any;
    submitted: boolean = false;

    constructor(public navCtrl: NavController,
                public viewCtrl: ViewController,
                public ionic: IonicUtil,
                public User: User,
    ) {
        let user = Parse.User.current().attributes;

        if (user.photo) {
            this.photo = user.photo._url;
        }

        this.form = {
            username: user.username,
            name    : user.name,
            gender  : user.gender,
            birthday: user.birthday,
            status  : user.status,
            email   : user.email,
            phone   : user.phone,
            website : user.website,
        };
    }

    changeAvatar() {
        console.log('Mudar Foto');
    }

    save(rForm: any) {
        this.submitted = true;
        if (rForm.valid) {
            this.ionic.onLoading();
            console.log(rForm);
            console.log(this.form);
            this.User.update(this.form).then(result => {
                console.log(result);
                this.ionic.endLoading();
            }, error => {
                console.log(error);
                this.ionic.endLoading();
            })
        }
    }

    dismiss() {
        this.viewCtrl.dismiss();
    }

}
