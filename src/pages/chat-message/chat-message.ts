import {Component, ViewChild} from "@angular/core";
import {NavController, NavParams, Content, Events} from "ionic-angular";
import {ChatMessageProvider} from "../../providers/chat-message";
import {UserProvider} from "../../providers/user";
import {IonicUtilProvider} from "../../providers/ionic-util";

declare var Parse: any;

@Component({
    selector   : 'page-chat-message',
    templateUrl: 'chat-message.html'
})
export class ChatMessagePage {

    @ViewChild(Content) content: Content;

    channel: any;
    user: any;

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
                private User: UserProvider,
                private Message: ChatMessageProvider,
                private util: IonicUtilProvider,
                private events: Events
    ) {

    }

    ionViewDidLoad() {
        console.log('Hello ChatMessagePage Page');

        this.events.subscribe('addMessage', message => {
            console.log('addMessage', message);
            if (message && message[0]) {
                this.data.push(message[0]);
                setTimeout(() => {
                    if (this.content.scrollToBottom) {
                        this.content.scrollToBottom(300)
                    }
                }, 100);
            }
        });

        this.channel = this.navParams.get('channel');
        this.user    = this.User.current();

        this.form = {
            channel: this.channel.obj,
            user   : this.User.current(),
            message: ''
        }

        let chatMessage = Parse.Object.extend('ChatMessage');

        let query = new Parse.Query(chatMessage).equalTo('channel', this.channel.obj);

        query.subscribe()
             .on('create', message => this.events.publish('addMessage', {user: message.get('user'), message: message.get('message')}));


        // Find
        query.include('user').find().then(data => {
            if (data) {
                data.map(item => this.events.publish('addMessage', {user: item.user, message: item.message}));
            } else {
                this.showEmptyView = true;
            }
            this.loading = false;
        });

    }


    onSendMessage() {
        this.util.onLoading();
        this.Message.create(this.form).then(message => {
            console.log(message);
            this.form.message = '';
            this.util.endLoading();
        });
    }

}
