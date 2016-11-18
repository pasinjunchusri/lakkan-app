import {Component} from '@angular/core';
import {ViewController, Events} from 'ionic-angular';
import {IonicUtilProvider} from "../../providers/ionic-util";
import {UserProvider} from "../../providers/user";
import {ParseFileProvider} from "../../providers/parse-file";

@Component({
    selector   : 'page-account-edit-modal',
    templateUrl: 'account-edit-modal.html'
})
export class AccountEditModalPage {

    form: any;
    photo: any;
    submitted: boolean = false;
    _user: any;
    _eventName: string = 'photoprofile';

    constructor(private viewCtrl: ViewController,
                private ionic: IonicUtilProvider,
                private User: UserProvider,
                private events: Events,
                private util: IonicUtilProvider,
                private ParseFile: ParseFileProvider,
    ) {
        this._user = User.current().attributes;

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

        // Change Photo user
        events.subscribe(this._eventName, imageCroped => {
            this.util.onLoading();
            this.ParseFile.upload({base64: imageCroped[0]}).then(image => {
                this.User.updatePhoto(image).then(user => {
                    console.log(user);
                    this.photo = imageCroped[0];
                    this.util.endLoading();
                });

            })
            this.events.publish('photocrop:close');
        });
    }

    changeAvatar() {
        this.events.publish('photoservice', this._eventName);
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
                this.dismiss();
            }, error => {
                console.log(error);
                this.dismiss();
                this.ionic.endLoading();
            })
        }
    }

    dismiss() {
        this.viewCtrl.dismiss();
    }

}
