import {Component, NgZone} from "@angular/core";
import {NavController, NavParams} from "ionic-angular";
import {ChatMessageProvider} from "../../providers/chat-message";
import {UserProvider} from "../../providers/user";
import {IonicUtilProvider} from "../../providers/ionic-util";

declare var Parse: any;

@Component({
    selector   : 'page-chat-message',
    templateUrl: 'chat-message.html'
})
export class ChatMessagePage {

    channel: any;
    user: any;

    data      = [];
    form: any = {
        text: ''
    };

    zone: any;

    constructor(public navCtrl: NavController,
                private navParams: NavParams,
                private provider: ChatMessageProvider,
                private User: UserProvider,
                private Message: ChatMessageProvider,
                private util: IonicUtilProvider
    ) {
        this.zone = new NgZone({enableLongStackTrace: false});
    }

    ionViewDidLoad() {
        console.log('Hello ChatMessagePage Page');
        this.channel = this.navParams.get('channel');
        this.user    = this.User.current();

        this.form = {
            channel: this.channel.obj,
            user   : this.User.current(),
            message: ''
        }

        let chatMessage = Parse.Object.extend('ChatMessage');

        let query = new Parse.Query('ChatMessage');
            //.equalTo('channel', this.channel.obj);

        var subscription = query.subscribe();
        subscription.on("create", function (message) {
            console.log("Message created", message);
            //addMessage(message);
        });

        subscription.on("leave", function (obj) {
            console.log("Message deleted", obj);
            //deleteMessage(message);
        });

        query.find().then(data => {
            console.log(data);
            if (data) {
                data.map(item => this.data.push(item));
            }
        });

        //this.provider.find(this.channel.obj).then(messages => {
        //    console.log(messages);
        //    this.data = messages;
        //})


        console.log(this.channel);
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
