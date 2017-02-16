import { Storage } from '@ionic/storage';
import {Component} from '@angular/core';
import {ViewController} from "ionic-angular";
import {IonicUtilProvider} from "../../providers/ionic-util.provider";
import {TranslateService} from "ng2-translate";

import {languages} from "../../config";
import _ from 'underscore';

@Component({
    selector   : 'language-modal',
    templateUrl: 'language-modal.html'
})
export class LanguageModalComponent {

    _languages: any;
    _placeholder: string;
    _words: string = '';

    constructor(private viewCtrl: ViewController,
                private util: IonicUtilProvider,
                private translate: TranslateService,
                private storage: Storage
    ) {
        this._languages = _.sortBy(languages, 'name');
        this.startTranslate();
    }

    doSearch() {
        let filter =  languages.filter(item => {
            return item.name.toLowerCase().indexOf(this._words.toLowerCase()) > -1;
        });
        this._languages = _.sortBy(filter, 'name');
    }

    startTranslate() {
        // Translate Search Bar Placeholder
        this.util.translate('Search').then((res: string) => this._placeholder = res);
    }

    selectLanguage(lang: any) {
        this.util.onLoading();
        let langSelected = lang.code.split('_')[0];
        this.translate.use(langSelected);
        setTimeout(() => {
            this.startTranslate();
            this.storage.set('lang', langSelected);
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
