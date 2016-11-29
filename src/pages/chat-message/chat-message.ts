import {Component, ViewChild} from "@angular/core";
import {NavController, NavParams, Content, Events} from "ionic-angular";
import {ChatMessageProvider} from "../../providers/chat-message";
import {UserProvider} from "../../providers/user";
import {IonicUtilProvider} from "../../providers/ionic-util";
import {ChatChannelProvider} from "../../providers/chat-channel";
import _ from "underscore";
declare var Parse: any;

@Component({
    selector   : 'page-chat-message',
    templateUrl: 'chat-message.html'
})
export class ChatMessagePage {

    @ViewChild(Content) content: Content;

    query: any;
    channel: any;
    channelId: string;
    user: any;
    image: any;

    errorIcon: string      = 'ios-images-outline';
    errorText: string      = '';
    loading: boolean       = true;
    showEmptyView: boolean = false;
    showErrorView: boolean = false;
    data                   = [];

    form: any = {
        text: ''
    };


    constructor(public navCtrl: NavController,
                private navParams: NavParams,
                private oni: UserProvider,
                private Channel: ChatChannelProvider,
                private Message: ChatMessageProvider,
                private util: IonicUtilProvider,
                private events: Events,
                private params: NavParams
    ) {

    }

    ionViewDidLoad() {

        this.channelId = this.navParams.get('channel');
        this.user      = new Parse.User.current();
        this.image     = this.params.get('image');

        console.log(this.image);

        this.events.subscribe('addMessage', message => {
            console.log('addMessage', message);
            if (message && message[0]) {

                let item = message[0];
                let obj  = {
                    _id      : item.id,
                    message  : item.attributes.message,
                    user     : item.attributes.user.attributes,
                    channel  : item.attributes.channel.id,
                    createdAt: item.createdAt,
                    class    : 'right',
                };

                this.Message.cache(obj);
                this.data.push(obj);
                this.scrollTop();

            }
        });

        this.Channel.get(this.channelId).then(channel => {
            this.channel = channel;
            this.initForm();

            let chatMessage = Parse.Object.extend('ChatMessage');
            this.query      = new Parse.Query(chatMessage).equalTo('channel', this.channel);

            this.query.subscribe().on('create', message => this.events.publish('addMessage', message));

            this.Message.findCache(this.channelId).then(data => {
                if (data.length > 0) {
                    this.data    = this.parseData(data);
                    this.loading = false;
                    this.scrollTop();
                } else {
                    this.doRefresh(null);
                }

                if (this.image) {
                    this.form.image = this.image;
                    this.onSendMessage();
                }
            });
        });
    }

    initForm(): void {
        this.form = {
            channel: this.channel,
            user   : this.user,
            message: ''
        };
    }

    scrollTop(): void {
        setTimeout(() => {
            if (this.content.scrollToBottom) {
                this.content.scrollToBottom(300)
            }
        }, 100);
    }

    doRefresh(event?): void {
        // Find
        this.Message.find(this.channelId).then(data => {
            this.data = [];
            console.info('query', data);
            if (data) {
                this.data = this.parseData(data);
            } else {
                this.showEmptyView = true;
            }
            this.loading = false;
            if (event) {
                event.complete();
            }
            this.scrollTop();
        });

    }

    parseData(data: any[]): any[] {
        return _.sortBy(data, 'createdAt').map(item => {
            item.class = item.user.id === this.user.id ? 'right' : 'left';
            return item;
        });

    }


    onSendMessage(): void {
        this.util.onLoading();
        this.Message.create(this.form).then(message => {
            console.log(message);
            this.initForm();
            this.util.endLoading();
        });
    }

}
