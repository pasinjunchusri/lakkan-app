import {Component, EventEmitter, Output} from '@angular/core';
import {NavController} from 'ionic-angular';
import {Gallery} from "../../providers/gallery";

@Component({
    selector   : 'page-tab-search',
    templateUrl: 'tab-search.html'
})
export class TabSearchPage {

    @Output() sendParams: any = new EventEmitter();

    data: any         = [];
    moreItem: boolean = true;
    loading: boolean  = false;
    typeFeed: string  = 'public';

    params = {
        limit: 5,
        page : 1
    }

    constructor(private navCtrl: NavController, private provider: Gallery) {

    }

    onLoading () {
        this.loading = !this.loading;
    }

    doInfinite(event) {
        //if (!this.loading) {
        this.params.page++;
        this.sendParams.next(this.params);
        //}
    }

    doRefresh(event) {
        //if (!this.loading) {
        this.params.page = 1;
        this.sendParams.next(this.params);
        //}
    }

}
