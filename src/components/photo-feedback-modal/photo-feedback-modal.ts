import {Component} from '@angular/core';
import {IonicUtil} from "../../providers/ionic-util";
import {ViewController, NavParams} from "ionic-angular";
import {GallerFeedback} from "../../providers/gallery-feedback";
import {User} from "../../providers/user";
import {TranslateService} from "ng2-translate";


@Component({
    selector   : 'photo-feedback-modal',
    templateUrl: 'photo-feedback-modal.html'
})
export class PhotoFeedbackModal {

    photo: any;
    submitted: boolean = false;
    form: any          = {
        title  : '',
        subject: '',
        message: '',
        lang   : '',
    };

    constructor(private ionic: IonicUtil,
                private viewCtrl: ViewController,
                private navParams: NavParams,
                private provider: GallerFeedback,
                private User: User,
                private translate: TranslateService
    ) {

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
