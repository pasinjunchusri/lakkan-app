import {Component} from '@angular/core';
import {App, NavController} from 'ionic-angular';
import {IonicUtilProvider} from "../../providers/ionic-util.provider";
import {UserProvider} from "../../providers/user.provider";
import {TabsPage} from "../tabs/tabs";
import {AnalyticsProvider} from "../../providers/analytics.provider";
import {TermsPage} from "../terms/terms";

@Component({
    selector   : 'auth-avatar',
    templateUrl: 'auth-avatar.html'
})
export class AuthAvatarPage {

    form: any;
    photo: any;
    submitted: boolean = false;
    _user: any;

    constructor(private navCtrl: NavController,
                private app: App,
                private ionic: IonicUtilProvider,
                private User: UserProvider,
                private analytics: AnalyticsProvider,
    ) {
        // Google Analytics
        this.analytics.view('AuthAvatarPage');

        this._user = User.current().attributes;

        if (this._user.photo) {
            this.photo = this._user.photo.url();
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

    save(rForm: any) {
        this.submitted = true;
        if (rForm.valid) {
            this.ionic.onLoading();
            console.log(rForm);
            console.log(this.form);
            this.User.update(this.form).then(result => {
                console.log(result);
                this.ionic.endLoading();
                this.app.getRootNav().setRoot(TabsPage);
            }, error => {
                console.log(error);
                this.ionic.endLoading();
            })
        }
    }

    onTerms(){
        this.navCtrl.push(TermsPage);
    }

}
