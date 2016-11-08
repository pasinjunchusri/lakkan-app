import {Component} from '@angular/core';
import {NavParams, ViewController, NavController} from "ionic-angular";
import {TabsPage} from "../tabs/tabs";
import {ParseFile} from "../../providers/parse-file";

@Component({
    selector   : 'tab-capture-share',
    templateUrl: 'tab-capture-share.html'
})
export class TabCapturSharePage {
    form: any = {
        title    : '',
        privacity: 'public',
    };
    image: any;

    constructor(private navparams: NavParams,
                private navCtrl: NavController,
                private viewCtrl: ViewController,
                private ParseFile: ParseFile,
    ) {
        this.image = this.navparams.get('base64');
    }

    submit(form) {
        if (form.valid) {
            this.navCtrl.push(TabsPage);
            this.ParseFile.uploadProccess({form: this.form, image: this.image});
        }
    }


    dismiss() {
        this.viewCtrl.dismiss();
    }


}
