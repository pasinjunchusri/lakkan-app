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
    }

    ionViewDidLoad() {

        this.channelId = this.navParams.get('channel');
        this.user = Parse.User.current();
        this.image = this.params.get('image');

        this.events.subscribe('addMessage', message => {
            console.log('addMessage', message);
            if (message) {

                let item = message;
                let obj = {
                    _id:       item.id,
                    message:   item.get('message'),
                    channel:   this.channelId,
                    createdAt: item.createdAt,
                    class:     'right',
                    user:      {},
                };
                obj.user = _.findWhere(this.users, {id: message.get('user').id});
                obj.class = this.userClass(obj.user);

                console.log('obj', obj);
                // this.Message.cache(obj);
                this.data.push(obj);
                this.scrollTop();

            }
        });

    }

    ionViewDidEnter() {
        this.loadChannel();
    }

    loadChannel() {

        new Parse.Promise([
            this.Channel.getMessages(this.channelId),
            this.Channel.get(this.channelId),
        ]).when(data => {
            console.log('channel', data);

            this.users = data[0].users;
            this.channel = data[1];
            this.initForm();

            let chatMessage = Parse.Object.extend('ChatMessage');
            this.query = new Parse.Query(chatMessage).equalTo('channel', this.channel.obj);

            this.query.subscribe().on('create', message => this.events.publish('addMessage', message));

            this.doRefresh();
        }).catch(error => {
            console.log('Error');
        });
    }

    initForm(): void {
        this.form = {
            channel: this.channel,
            user:    this.user,
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

    public kekypress(event) {
        if (event.keyCode == 13) {
            this.onSendMessage();
        }
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
            console.log(item);
            return item;
        });

    }

    userClass(user) {
        console.log(user, this.user)
        return user.id === this.user.id ? 'right' : 'left';
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
