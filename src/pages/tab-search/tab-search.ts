import {Component, ViewChild} from "@angular/core";
import {Events, Content} from "ionic-angular";
import {AnalyticsProvider} from "../../providers/analytics.provider";

@Component({
    selector:    'page-tab-search',
    templateUrl: 'tab-search.html'
})
export class TabSearchPage {

    @ViewChild(Content) content: Content;

    search: string = '';
    username: string;
    type: string = 'photo';
    profile: any;
    moreItem: boolean = false;
    eventName: string = 'search';

    params = {
        limit:     24,
        page:      1,
        privacity: 'public',
        search:    '',
    };

    constructor(private analytics: AnalyticsProvider,
                private events: Events) {
        // Google Analytics
        this.analytics.view('TabSearchPage');

        // More Item
        this.events.subscribe(this.eventName + ':moreItem', moreItem => this.moreItem = moreItem[0]);

    }

    ionViewDidLoad() {
        this.onSelectType();
    }

    public doInfinite(event) {
        this.params.page++;
        this.events.unsubscribe(this.eventName + ':complete');
        this.events.subscribe(this.eventName + ':complete', () => event.complete());
        this.sendParams();
    }

    public doRefresh(event?): void {
        if (event) {
            event.complete();
        }
        this.params.page = 1;
        this.sendParams();

    }

    private sendParams(): void {
        this.events.publish(this.eventName + ':params', this.params);
    }

    public onSelectType(type: string = this.type): void {
        this.type = type;
        setTimeout(() => this.onReload(), 500);
    }

    public onReload(): void {
        this.params.page = 1;
        this.params.search = "";
        this.sendParams();
        this.scrollToTop();
    }

    // Search
    public doSearch(): void {
        this.params.search = this.search;
        this.params.page = 1;
        this.sendParams();
    }

    scrollToTop(): void {
        setTimeout(() => {
            if (this.content.scrollTop) {
                this.content.scrollToTop(100)
            }
        }, 100);
    }
}
