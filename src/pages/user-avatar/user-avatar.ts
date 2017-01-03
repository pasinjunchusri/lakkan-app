import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {IonicUtilProvider} from "../../providers/ionic-util";
import {UserProvider} from "../../providers/user";
import {TabsPage} from "../tabs/tabs";
import {AnalyticsProvider} from "../../providers/analytics";

@Component({
    selector   : 'user-avatar',
    templateUrl: 'user-avatar.html'
})
export class UserAvatarPage {

    form: any;
    photo: any;
    submitted: boolean = false;
    _user: any;

    constructor(private navCtrl: NavController,
                private ionic: IonicUtilProvider,
                private User: UserProvider,
                private analytics: AnalyticsProvider,
    ) {
        // Google Analytics
        this.analytics.view('UserAvatarPage');

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
                this.dismiss();
            }, error => {
                console.log(error);
                this.dismiss();
                this.ionic.endLoading();
            })
        }
    }

    dismiss() {
        this.navCtrl.push(TabsPage);
    }

}
