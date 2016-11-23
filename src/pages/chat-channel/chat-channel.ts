import {Component} from "@angular/core";
import {NavController, ModalController, Events} from "ionic-angular";
import {ChatFormPage} from "../chat-form/chat-form";
import {ChatChannelProvider} from "../../providers/chat-channel";
import {ChatMessagePage} from "../chat-message/chat-message";

@Component({
    selector   : 'page-chat-channel',
    templateUrl: 'chat-channel.html'
})
export class ChatChannelPage {
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
        this.events.subscribe('channel:update', this.onQuery);
    }

    ionViewDidLoad() {
        console.log('Hello ChatChannelPage Page');
        this.onQuery();
    }

    onPageMessage(item) {
        this.navCtrl.push(ChatMessagePage, {channel: item})
    }

    onQuery() {
        this.loading = true;
        this.provider.find().then(data => {
            this.loading = false;
            console.log(data);
            if (data) {
                this.data = data;
            } else {
                this.moreItem = false;
            }
        })
    }

    onModalChatForm() {
        this.modalCtrl.create(ChatFormPage).present();
    }

}
