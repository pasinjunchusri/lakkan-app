import {Component, ViewChild} from "@angular/core";
import {Events, Content, App} from "ionic-angular";
import {IParams} from "../../models/parse.params.model";
import {ChatChannelPage} from "../chat-channel/chat-channel";
import {APP_NAME} from "../../config";
import {AnalyticsProvider} from "../../providers/analytics.provider";

@Component({
    selector   : 'page-tab-home',
    templateUrl: 'tab-home.html',
})
export class TabHomePage {
    @ViewChild(Content) content: Content;

    appName: string = APP_NAME;

    params: IParams = {
        limit    : 18,
        page     : 1,
        privacity: 'followers',
    };

    eventName: string = 'home';
    privacity: string = 'followers';
    moreItem: boolean = false;

    constructor(private events: Events,
                private app: App,
                private analytics: AnalyticsProvider,
    ) {
        // Google Analytics
        this.analytics.view('TabHomePage');

        this.eventName = 'home';
    }

    ionViewDidLoad() {
        //console.log('ionViewDidLoad home');

        // Load Cache
        this.params.page = 1;
        this.events.publish(this.eventName + ':reload', this.params);
    }


    ionViewWillEnter() {
        //console.info('ionViewWillEnter home');
        // More Item
        this.events.subscribe(this.eventName + ':moreItem', moreItem => this.moreItem = moreItem);
        this.events.subscribe('scroll:up', () => this.scrollTop());
    }

    ionViewDidLeave() {
        //console.warn('ionViewDidLeave home');
        this.events.unsubscribe(this.eventName + ':moreItem');
        this.events.unsubscribe('scroll:up');
    }

    public onPageChat() {
        this.app.getRootNav().push(ChatChannelPage);
    }

    scrollTop() {
        this.content.scrollToTop(1000);
    }

    public doInfinite(event) {
        this.params.page++;
        this.events.unsubscribe(this.eventName + ':complete');
        this.events.subscribe(this.eventName + ':complete', () => event.complete());
        this.sendParams();
    }

    public doRefresh(event?) {
        if (event) {
            event.complete();
        }
        this.params.page = 1;
        this.events.publish(this.eventName + ':reload', this.params);
    }

    private sendParams(): void {
        this.events.publish(this.eventName + ':params', this.params);
    }

}
