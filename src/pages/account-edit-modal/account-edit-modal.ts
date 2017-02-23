import {Component} from "@angular/core";
import {ViewController, Events} from "ionic-angular";
import {UserProvider} from "../../providers/user.provider";
import {IonicUtilProvider} from "../../providers/ionic-util.provider";
import {ParseFileProvider} from "../../providers/parse-file.provider";
import {FormBuilder, Validators} from "@angular/forms";
import * as _ from "underscore";


declare const Parse:any;

@Component({
    selector   : 'page-account-edit-modal',
    templateUrl: 'account-edit-modal.html'
})
export class AccountEditModalPage {

    form: any;
    photo: any;
    _user: any;
    _eventName: string = 'photoprofile';

    constructor(private viewCtrl: ViewController,
                private ionic: IonicUtilProvider,
                private User: UserProvider,
                private events: Events,
                private util: IonicUtilProvider,
                private ParseFile: ParseFileProvider,
                private formBuilder: FormBuilder
    ) {
        this._user = new Parse.User.current().attributes;

        console.log(Parse.User.current());

        if (this._user.photo) {
            this.photo = this._user.photo._url;
        }

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


    ionViewWillLoad() {
        // Validate user registration form
        this.form = this.formBuilder.group({
            name    : ['', Validators.required],
            email   : ['', Validators.required],
            username: ['', Validators.compose([Validators.required, Validators.pattern('[a-zA-Z]*')])],
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
            }).catch(error => {
                this.util.toast('Error: Not upload image')
            });

        });
    }

    submitProfile(rForm: any) {
        if (rForm.valid) {
            this.ionic.onLoading();
            this.User.update(this.form.value).then(result => {
                console.log(result);
                this.ionic.endLoading();
                this.dismiss();
            }).catch(error => {
                console.log(error);
                this.dismiss();
                this.ionic.endLoading();
            });
        }
    }

    dismiss() {
        this.viewCtrl.dismiss();
    }

}
