import {Component, ViewChild} from "@angular/core";
import {NavController, NavParams, Content, Events} from "ionic-angular";
import {ChatMessageProvider} from "../../providers/chat-message.provider";
import {IonicUtilProvider} from "../../providers/ionic-util.provider";
import {ChatChannelProvider} from "../../providers/chat-channel.provider";
import {AnalyticsProvider} from "../../providers/analytics.provider";
import _ from "underscore";
declare const Parse: any;

@Component({
    selector:    'page-chat-message',
    templateUrl: 'chat-message.html'
})
export class ChatMessagePage {

    @ViewChild(Content) content: Content;

    query: any;
    channel: any;
    channelId: string;
    user: any;
    image: any;
    users: any;

    errorIcon: string = 'ios-images-outline';
    errorText: string = '';
    loading: boolean = true;
    showEmptyView: boolean = false;
    showErrorView: boolean = false;
    data = [];

    form: any = {
        text: ''
    };


    constructor(public navCtrl: NavController,
                private navParams: NavParams,
                private Channel: ChatChannelProvider,
                private Message: ChatMessageProvider,
                private util: IonicUtilProvider,
                private events: Events,
                private params: NavParams,
                private analytics: AnalyticsProvider) {
        // Google Analytics
        this.analytics.view('ChatMessagePage');

        this.channelId = this.navParams.get('channel');
        this.user = Parse.User.current();
        this.image = this.params.get('image');

        this.events.subscribe('addMessage', message => {
            console.log('addMessage', message);
            if (message) {
                let user = _.findWhere(this.users, {id: message.get('user').id});
                let obj = {
                    _id:       message.id,
                    message:   message.get('message'),
                    channel:   this.channelId,
                    createdAt: message.createdAt,
                    class:     this.userClass(user),
                    user:      user,
                };

                console.log('obj', obj);
                this.data.push(obj);
                this.scrollToBottom();

            }
        });

        // this.loadChannel();
    }

    ionViewDidLoad() {
        console.log(this.channelId);
        this.loadChannel(this.channelId);
    }

    onError(error) {
        console.log(error);
        this.util.toast(error);
    }


    loadChannel(channelId: string) {
        this.Channel.getChatChannel(channelId).then(data => {
            console.log('channel', data);

            this.users = data.users;

            this.channel = data.obj;
            console.log(this.channel)

            this.initForm();

            let chatMessage = Parse.Object.extend('ChatMessage');
            this.query = new Parse.Query(chatMessage).equalTo('channel', this.channel);

            this.query.subscribe().on('create', message => this.events.publish('addMessage', message));

            this.doRefresh();
        }).catch(this.onError);
    }

    initForm(): void {
        this.form = {
            channel: this.channel,
            user:    this.user,
            message: ''
        };
    }

    scrollToBottom(): void {
        setTimeout(() => {
            if (this.content.scrollToBottom) {
                this.content.scrollToBottom(300)
            }
        }, 100);
    }

    public kekypress(event) {
        if (event.keyCode == 13) {
            this.onSendMessage();
        }
    }

    doRefresh(event?): void {
        // Find
        this.Message.find(this.channelId).then(data => {
            this.data = [];
            if (data) {
                this.data = this.parseData(data);
            } else {
                this.showEmptyView = true;
            }
            console.info('data', this.data);
            if (event) {
                event.complete();
            }
            this.loading = false;
            this.scrollToBottom();
        });

    }

    parseData(data: any[]): any[] {
        return _.sortBy(data, 'createdAt').map(item => {
            console.info(this.user.id, item.user.id)
            item.class = this.userClass(item.user);
            return item;
        });

    }

    userClass(user) {
        console.log(user, this.user)
        return user.id === this.user.id ? 'left' : 'right';
    }


    onSendMessage(): void {
        if (this.form.message) {
            let form = this.form;
            this.initForm();
            this.Message.create(form).then(message => {
                console.log('return messag', message);
                //this.initForm();
            }).catch(error => {
                this.util.toast('Error');
            });
        }

    }

}
