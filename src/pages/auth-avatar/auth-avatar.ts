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

declare const Parse:any;

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
                private formBuilder: FormBuilder
    ) {
        // Google Analytics
        this.analytics.view('AuthAvatarPage');

        this._user = new Parse.User.current()['attributes'];

        if (this._user && this._user['photo']) {
            this.photo = this._user.photo._url;
        }

    }

    ionViewWillLoad() {
        // Validate user registration form
        this.form = this.formBuilder.group({
            name    : ['', Validators.required],
            email   : ['', Validators.required],
            username: ['', Validators.compose([Validators.required, Validators.pattern('[a-zA-Z]*')])],
            status  : ['', Validators.required],
            website : [''],
            gender  : ['male', Validators.required],
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
    }

    changePhoto(photo) {
        this.util.onLoading('Uploading image...');
        this.ParseFile.upload({base64: photo}).then(image => {
            this.User.updatePhoto(image).then(user => {
                this._user       = user;
                this.photo      = photo;
                this.util.endLoading();
                this.util.toast('Avatar updated')
            }).catch(this.onError);

        });
    }

    public submitForm(rForm: any):void {
        this.submitted = true;
        if (rForm.valid) {
            this.util.onLoading();
            this.User.update(this.form).then(result => {
                this.util.endLoading();
                this.app.getRootNav().setRoot(TabsPage);
            }).catch(this.onError);
        }
    }

    private onError(error){
        this.util.endLoading();
        this.util.toast(error);
    }

    public onTerms():void {
        this.navCtrl.push(TermsPage);
    }

}
