import {Component} from '@angular/core';
import {ViewController} from 'ionic-angular';
import {IonicUtil} from "../../providers/ionic-util";
import {User} from "../../providers/user";

@Component({
    selector   : 'page-account-edit-modal',
    templateUrl: 'account-edit-modal.html'
})
export class AccountEditModalPage {

    form: any;
    photo: any;
    submitted: boolean = false;
    _user: any;

    constructor(private viewCtrl: ViewController,
                private ionic: IonicUtil,
                private User: User,
    ) {
        this._user = User.current.attributes;

        if (this._user.photo) {
            this.photo = this._user.photo._url;
        }

        this.form = {
            username: this._user.username,
            name    : this._user.name,
            gender  : this._user.gender,
            birthday: this._user.birthday,
            status  : this._user.status,
            email   : this._user.email,
            phone   : this._user.phone,
            website : this._user.website,
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
