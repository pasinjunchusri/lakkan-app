import {Component, ViewChild} from "@angular/core";
import {Events, Content, App} from "ionic-angular";
import {IParams} from "../../models/parse.params.model";
import {ChatChannelPage} from "../chat-channel/chat-channel";
import {UserListPage} from "../user-list/user-list";

@Component({
    selector   : 'page-tab-home',
    templateUrl: 'tab-home.html',
})
export class TabHomePage {
    @ViewChild('Content') content: Content;

    params: IParams = {
        limit    : 10,
        page     : 1,
        privacity: 'public'
    };

    eventName: string = 'home';
    privacity: string = 'public';
    moreItem: boolean = false;

    constructor(private events: Events,
                private app: App
    ) {

        this.eventName = 'home';
        setTimeout(() => this.onSelectPrivacity(), 1000);

        // More Item
        this.events.subscribe(this.eventName + ':moreItem', moreItem => this.moreItem = moreItem[0]);
        this.events.subscribe('home:top', () => this.scrollTop());
    }


    public onSelectPrivacity(privacity: string = 'public') {
        this.params.privacity = privacity;
        this.sendParams();
    }

    public onPageChat() {
        this.app.getRootNav().push(ChatChannelPage);
    }

    public onPageUsers() {
        this.app.getRootNav().push(UserListPage);
    }

    public scrollTop() {
        this.content.scrollToTop();
    }

    public doInfinite(event) {
        this.params.page++;
        this.events.unsubscribe(this.eventName + ':complete');
        this.events.subscribe(this.eventName + ':complete', () => event.complete());
        this.sendParams();
    }

    public doRefresh(event?) {
        event.complete();
        this.params.page = 1;
        this.sendParams();
    }

    private sendParams(): void {
        this.events.publish(this.eventName + ':params', this.params);
    }

}
