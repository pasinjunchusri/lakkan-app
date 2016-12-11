import {Component, ViewChild} from "@angular/core";
import {NavController, NavParams, Content, Events} from "ionic-angular";
import {ChatMessageProvider} from "../../providers/chat-message";
import {IonicUtilProvider} from "../../providers/ionic-util";
import {ChatChannelProvider} from "../../providers/chat-channel";
import _ from "underscore";
declare const Parse: any;

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
    users: any;

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

        this.events.subscribe('addMessage', message => {
            console.log('addMessage', message);
            if (message && message[0]) {

                let item  = message[0];
                let obj   = {
                    _id      : item.id,
                    message  : item.get('message'),
                    channel  : this.channelId,
                    createdAt: item.createdAt,
                    class    : 'right',
                    user     : {},
                };
                obj.user  = _.findWhere(this.users, {id: item.get('user').id});
                obj.class = this.userClass(obj.user);

                console.log('obj', obj);
                this.Message.cache(obj);
                this.data.push(obj);
                this.scrollTop();

            }
        });


        Promise.all([
            this.Channel.get(this.channelId),
            this.Channel.getCache(this.channelId)
        ]).then(data => {
            console.log('channel', data);

            this.channel = data[0];
            this.users   = data[1].users;
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
            }).catch(error => {
                console.log('Error');
            });
        }).catch(error => {
            console.log('Error');
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

    userClass(user) {
        return user.id === this.user.id ? 'right' : 'left';
    }


    onSendMessage(): void {
        let message = this.form.message;
        if (message) {
            this.initForm();
            this.Message.create(this.form).then(message => {
                console.log(message);
            }).catch(error => {
                this.util.toast('Error');
                this.form.message = message;
            });
        }

    }

}
