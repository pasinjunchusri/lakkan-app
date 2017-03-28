import {Component} from "@angular/core";
import {ViewController} from "ionic-angular";
import {UserProvider} from "../../providers/user.provider";
import {IonicUtilProvider} from "../../providers/ionic-util.provider";
import {AnalyticsProvider} from "../../providers/analytics.provider";

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
              private util: IonicUtilProvider,
              private provider: UserProvider,
              private analytics: AnalyticsProvider,) {
    // Google Analytics
    this.analytics.view('UserPasswordPage');
  }

  save(form) {
    this.submitted = true;

    if (this.form.changepassword != this.form.confirmpassword) {
      return;
    }

    if (form.valid) {
      this.util.onLoading();
      this.provider.changePassword(this.form.changepassword).then(user => {
        this.util.endLoading();
        this.util.toast('Password changed')
        this.dismiss();
      }).catch(error => {
        this.util.endLoading();
        this.util.toast(error.message);
      });
    }
  }


  dismiss() {
    this.viewCtrl.dismiss();
  }
}
