import {Component, ViewChild} from "@angular/core";
import {NavController, ModalController, Events, Content} from "ionic-angular";
import {ChatFormPage} from "../chat-form/chat-form";
import {ChatChannelProvider} from "../../providers/chat-channel";
import {ChatMessagePage} from "../chat-message/chat-message";

@Component({
    selector   : 'page-chat-channel',
    templateUrl: 'chat-channel.html'
})
export class ChatChannelPage {

    @ViewChild('Content') content: Content;

    errorIcon: string      = 'ios-images-outline';
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
                private events: Events
    ) {
        this.events.subscribe('channel:update', () => this.onQuery());
    }

    ionViewDidLoad() {
        console.log('Hello ChatChannelPage Page');
        this.onQuery();
    }

    onPageMessage(item) {
        this.navCtrl.push(ChatMessagePage, {channel: item.id})
    }

    onQuery(force: boolean = false) {
        return new Promise((resolve, reject) => {
            this.loading = true;
            let query    = force ? this.provider.find() : this.provider.findCache();

            query.then(data => {
                console.log(data);
                if (data) {
                    this.data = data;
                } else {
                    this.moreItem = false;
                }
                this.loading = false;
                resolve(data);
            }, error => reject(error));
        });
    }


    public scrollTop() {
        this.content.scrollToTop();
    }

    public doInfinite(event) {
        this.params.page++;
        this.onQuery().then(() => event.complete());
    }

    public doRefresh(event?) {
        this.onQuery(true)
        this.params.page = 1;
        this.onQuery().then(() => event.complete());
    }


    onModalChatForm() {
        this.modalCtrl.create(ChatFormPage).present();
    }

}
