import {Component, ViewChild} from "@angular/core";
import {NavController, NavParams, Content} from "ionic-angular";
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
                private params: NavParams,
                private analytics: AnalyticsProvider) {
        // Google Analytics
        this.analytics.view('ChatMessagePage');

        this.channelId = this.navParams.get('channel');
        this.user = Parse.User.current();
        this.image = this.params.get('image');


        this.Channel.get(this.channelId).then(data => {
            this.channel = data;

            this.initForm();

            if (this.image) {
                this.form.image = this.image;
                console.log('form', this.form);
                this.onSendMessage();
            }

            this.data = [];
            let chatMessage = Parse.Object.extend('ChatMessage');
            this.query = new Parse.Query(chatMessage).include(['profile','image']).equalTo('channel', this.channel);

            this.query
                .subscribe()
                .on('open', () => console.info('subscription opened'))
                .on('create', object => this.onCreateChannel(object))
                .on('update', (object) => console.info('object update', object))
                .on('leave', (object) => console.info('object leave', object))
                .on('delete', object => this.onDeleteChannel(object))
                .on('close', (object) => console.info('subscription close', object))

            this.doRefresh();
        }).catch(this.onError);

    }

    onCreateChannel(object) {
        console.log(object)
        this.parseChat(object).then(channel => this.data.push(channel));
        this.scrollToBottom();
    }

    onDeleteChannel(object) {
        console.log(object, this.data)
        this.data = _.filter(this.data, item => item.id != object.id)
        this.scrollToBottom();
    }

    onUpdatedChannel(object) {
        console.info('object update', object)
    }


    onError(error) {
        console.log(error);
        this.util.toast(error);
    }


    loadChannel(channelId: string) {

    }

    initForm(): void {
        this.form = {
            channel: this.channel,
            user:    this.user,
            message: '',
            image:   null
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

    public doRefresh(event?) {
        this.loading = true;

        this.query.find().then(messages => {
            if (messages) {
                this.data = [];
                console.log(messages)
                Promise
                    .all(messages.map(chat => this.parseChat(chat)))
                    .then(result => result.map(item => this.data.push(item)));
            } else {
                this.showEmptyView = true;
                this.showErrorView = false;
            }

            this.loading = false;
            this.scrollToBottom();
            if (event) event.complete();
        }).catch(() => {
            this.loading = false;
            this.showEmptyView = false;
            this.showErrorView = true;
        });
    }

    parseChat(chat: any): Promise<any> {
        let user = Parse.User.current();
        return new Promise(resolve => {
            let obj = {
                id:        chat.id,
                obj:       chat,
                createdAt: chat.createdAt,
                image:     chat.get('image') ? chat.get('image').get('image').url() : null,
                message:   chat.get('message'),
                class:     user.id === chat.get('user').id ? 'right' : 'left',
                profile:   {
                    name:  chat.get('profile').get('name'),
                    photo: chat.get('profile').get('photo') ? chat.get('profile').get('photo').url() : 'assets/img/user.png',
                }
            }
            resolve(obj);

        })
    }


    onSendMessage(): void {
        if (this.form.message || this.form.image) {
            let form = this.form;
            this.initForm();
            this.Message.create(form).then(message => {
                console.log('return messag', message);
            }).catch(error => {
                this.util.toast('Error');
            });
        }

    }

}
