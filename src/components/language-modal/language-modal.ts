import {Component} from "@angular/core";
import {ViewController} from "ionic-angular";
import {IonicUtilProvider} from "../../providers/ionic-util.provider";
import {TranslateService} from "ng2-translate";
import {LocalStorageProvider} from "../../providers/local-storage.provider";
import {languages} from "../../config";
import _ from "underscore";
declare const Parse:any;

@Component({
    selector   : 'language-modal',
    templateUrl: 'language-modal.html'
})
export class LanguageModalComponent {

    _languages: any;
    _words: string = '';

    constructor(private viewCtrl: ViewController,
                private util: IonicUtilProvider,
                private translate: TranslateService,
                private storage: LocalStorageProvider
    ) {
        this._languages = _.sortBy(languages, 'name');
    }

    doSearch() {
        let filter =  languages.filter(item => {
            return item.name.toLowerCase().indexOf(this._words.toLowerCase()) > -1;
        });
        this._languages = _.sortBy(filter, 'name');
    }


    selectLanguage(lang: any) {
        this.util.onLoading();
        let langSelected = lang.code.split('_')[0];
        this.translate.use(langSelected);
        setTimeout(() => {
            this.storage.set('lang', langSelected)
            Parse.User.current().set('lang', langSelected).save();
            this.util.endLoading();
            this.dismiss();
        }, 1000);
    }

    doCancel(): void {
        this._words = '';
    }

    dismiss() {
        this.viewCtrl.dismiss();
    }
}
