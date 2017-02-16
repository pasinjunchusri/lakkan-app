import {Component} from '@angular/core';
import {IonicUtilProvider} from "../../providers/ionic-util.provider";
import {ViewController, NavParams} from "ionic-angular";
import {GallerFeedbackProvider} from "../../providers/gallery-feedback.provider";
import {UserProvider} from "../../providers/user.provider";
import {TranslateService} from "ng2-translate";
import {AnalyticsProvider} from "../../providers/analytics.provider";


@Component({
    selector   : 'photo-feedback-modal',
    templateUrl: 'photo-feedback-modal.html'
})
export class PhotoFeedbackModalComponent {

    photo: any;
    submitted: boolean = false;
    form: any          = {
        title  : '',
        subject: '',
        message: '',
        lang   : '',
    };

    constructor(private ionic: IonicUtilProvider,
                private viewCtrl: ViewController,
                private navParams: NavParams,
                private provider: GallerFeedbackProvider,
                private User: UserProvider,
                private translate: TranslateService,
                private analytics: AnalyticsProvider,
    ) {
        // Google Analytics
        this.analytics.view('PhotoFeedbackModalPage');

        this.form.gallery = navParams.get('item').obj;
        this.form.user    = this.User.current();
        this.form.lang    = this.translate.getDefaultLang();
        console.log(this.form);
    }

    onSubmit(rForm: any) {
        this.submitted = true;
        if (rForm.valid) {
            this.ionic.onLoading();
            this.provider.create(this.form).then(result => {
                console.log(result);
                this.ionic.endLoading();
                this.dismiss();
            }, error => {
                console.log(error);
                this.ionic.endLoading();
                this.dismiss();
            })
        }
    }

    dismiss() {
        this.viewCtrl.dismiss();
    }

}
