import {Component} from "@angular/core";
import {NavController, ViewController, Events} from "ionic-angular";
import {UserProvider} from "../../providers/user";
import {ChatChannelProvider} from "../../providers/chat-channel";
import {ChatMessageProvider} from "../../providers/chat-message";
import {IonicUtilProvider} from "../../providers/ionic-util";

@Component({
    selector   : 'page-chat-form',
    templateUrl: 'chat-form.html'
})
export class ChatFormPage {
    words: string       = '';
    placeholder: string = 'Search';
    _width: any;


    errorIcon: string      = 'ios-images-outline';
    errorText: string      = '';
    loading: boolean       = true;
    showEmptyView: boolean = false;
    showErrorView: boolean = false;
    moreItem: boolean      = false;
    data                   = [];

    form: any = {
        text: ''
    };
    username: string;

    constructor(public navCtrl: NavController,
                private User: UserProvider,
                private Channel: ChatChannelProvider,
                private Message: ChatMessageProvider,
                private viewCtrl: ViewController,
                private util: IonicUtilProvider,
                private events: Events
    ) {
        this.username = this.User.current().username;
        console.log(this.username);
    }

    ionViewDidLoad() {
        console.log('Hello ChatFormPage Page');
        this.User.getFollowing(this.username).then(data => {
            if (data) {
                data.map(item => {
                    item.checked = false;
                    this.data.push(item);
                })
            }
        });
    }

    dismiss() {
        this.viewCtrl.dismiss();
    }

    onCreateChannel() {
        console.log(this.form);
        let users = this.data.filter(item => item.checked);
        if (users.length) {

            this.util.onLoading('Salvando...');
            this.User.profile(this.username).then(profile => {
                console.log('profile', profile);

                this.Channel.create().then(data => {
                    console.log('create', data);
                    let relation = data.relation('users');
                    // Add my user
                    relation.add(this.User.current());
                    // Add Other Users
                    users.map(user => {
                        relation.add(user.obj);
                    });

                    let relation2 = data.relation('profiles');
                    // Add my user
                    relation2.add(profile.obj);
                    // Add Other Users
                    users.map(user => {
                        console.log('userDataObj', user, user.userDataObj);
                        relation2.add(user.userDataObj);
                    });

                    console.log('save', data);
                    return data.save();

                }).then(data => {
                    console.log('saved', data);

                    this.Message.create({
                        channel: data,
                        user   : this.User.current(),
                        message: this.form.text
                    }).then(message => {
                        let relationMessage = data.relation('messages');
                        relationMessage.add(message);
                        data.save();
                        console.log(message);
                        this.events.publish('channel:update')
                        this.util.endLoading();
                        this.dismiss();
                    });
                })
                //


            })
        } else {
            console.log('Select user first');
        }
    }

    doSearch() {

    }

    doCancel() {
        this.words = '';
    }

}
