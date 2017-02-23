import {Component} from "@angular/core";
import {App, NavController} from "ionic-angular";
import {UserProvider} from "../../providers/user.provider";
import {TabsPage} from "../tabs/tabs";
import {AnalyticsProvider} from "../../providers/analytics.provider";
import {IonicUtilProvider} from "../../providers/ionic-util.provider";
import {ParseFileProvider} from "../../providers/parse-file.provider";
import {FormBuilder, Validators} from "@angular/forms";
import * as _ from "underscore";
import {TermsPage} from "../terms/terms";
import {UserDataProvider} from "../../providers/user-data.provider";

declare const Parse: any;

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
                private User: UserProvider,
                private analytics: AnalyticsProvider,
                private util: IonicUtilProvider,
                private ParseFile: ParseFileProvider,
                private UserData: UserDataProvider,
                private formBuilder: FormBuilder
    ) {
        // Google Analytics
        this.analytics.view('AuthAvatarPage');

        this._user = new Parse.User.current()['attributes'];

    }

    ionViewWillLoad() {
        // Validate user registration form
        this.form = this.formBuilder.group({
            name    : ['', Validators.required],
            email   : ['', Validators.required],
            username: ['', Validators.compose([Validators.required, Validators.pattern('[a-zA-Z]*')])],
            website : [''],
            gender  : [''],
            birthday: [''],
            phone   : [''],
        });

        _.each(this._user, (value, key) => {
            console.log(key, value);
            if (this.form.controls[key]) {
                this.form.controls[key].setValue(value);
            }
        });

        console.log(this.form.controls);
        this.util.onLoading();
        setTimeout(() => this.loadPhoto(), 1000);
    }

    private loadPhoto() {
        this.UserData.profile(this._user['username']).then(profile => {
            if (profile.photo) {
                this.photo = profile.photo;
            } else {
                this.photo = 'assets/img/user.png';
            }
            this.util.endLoading();
        });
    }

    changePhoto(photo) {
        this.util.onLoading('Uploading image...');
        this.photo = photo;
        this.ParseFile.upload({base64: photo})
            .then(image => this.User.updatePhoto(image))
            .then(user => this._user = user)
            .then(() => this.util.endLoading())
            .then(() => this.util.toast('Avatar updated'))
            .catch(this.onError);
    }

    public submitForm(rForm: any): void {
        this.submitted = true;
        if (rForm.valid) {
            this.util.onLoading();
            this.User.update(this.form)
                .then(result => this.util.endLoading())
                .then(this.app.getRootNav().setRoot(TabsPage))
                .catch(this.onError);
        }
    }

    private onError(error) {
        this.util.endLoading();
        this.util.toast(error);
    }

    public onTerms(): void {
        this.navCtrl.push(TermsPage);
    }

}
