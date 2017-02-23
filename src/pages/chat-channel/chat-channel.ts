import {Component, ViewChild} from "@angular/core";
import {NavController, ModalController, Events, Content} from "ionic-angular";
import _ from "underscore";
import {ChatChannelProvider} from "../../providers/chat-channel.provider";
import {AnalyticsProvider} from "../../providers/analytics.provider";
import {ChatFormPage} from "../chat-form/chat-form";
import {ChatMessagePage} from "../chat-message/chat-message";
declare const Parse: any;

@Component({
    selector   : 'page-chat-channel',
    templateUrl: 'chat-channel.html'
})
export class ChatChannelPage {

    @ViewChild('Content') content: Content;

    errorIcon: string      = 'chatbubbles';
    errorText: string      = '';
    data                   = [];
    loading: boolean       = true;
    showEmptyView: boolean = false;
    showErrorView: boolean = false;
    moreItem: boolean      = false;

    params = {
        limit: 20,
        page : 1
    }

    constructor(public navCtrl: NavController,
                private provider: ChatChannelProvider,
                private modalCtrl: ModalController,
                private events: Events,
                private analytics: AnalyticsProvider,
    ) {
        // Google Analytics
        this.analytics.view('ChatChannel page');

        this.events.subscribe('channel:update', () => this.find());
    }

    ionViewDidLoad() {
        this.find();
    }

    onPageMessage(item) {
        this.navCtrl.push(ChatMessagePage, {channel: item.id});
    }


    parseResult(data) {
        console.log(data);
        if (data) {
            let user = Parse.User.current();
            data.map(channel => {
                let users = _.filter(channel.users, _user => user.id != _user['id']);
                channel.users = users;
                channel.title = users.map(user=> user['name']).join(', ');

                this.data.push(channel);
            });
            this.showEmptyView = false;
            this.showErrorView = false;
        } else {
            this.moreItem = false;
        }

        if (this.data.length < 1) {
            this.showEmptyView = true;
        }

        this.loading = false;
        return data;
    }

    find() {
        return new Promise((resolve, reject) => {
            this.loading = true;
            this.data    = [];
            this.provider.find().then(data => {
                console.log(data);
                this.parseResult(data);
                resolve(data);
            }, error => {
                this.showErrorView = true;
                reject(error);
            });
        });
    }


    public scrollTop() {
        this.content.scrollToTop();
    }

    public doInfinite(event) {
        this.params.page++;
        this.find().then(() => event.complete());
    }

    public doRefresh(event?) {
        this.params.page = 1;
        this.find().then(() => event.complete());
    }


    onModalChatForm() {
        this.modalCtrl.create(ChatFormPage).present();
    }

}
