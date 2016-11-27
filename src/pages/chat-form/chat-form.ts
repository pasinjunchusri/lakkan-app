import {Component} from "@angular/core";
import {NavController, ViewController, Events} from "ionic-angular";
import {UserProvider} from "../../providers/user";
import {ChatChannelProvider} from "../../providers/chat-channel";
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
                });
                this.loading = false;
            }
        });
    }

    dismiss() {
        this.viewCtrl.dismiss();
    }

    onCreateChannel(){
        console.log(this.form);
        let users = this.data.filter(item => item.checked).map(item => item.userObj);
        console.log(users);
        if (users.length) {

            this.util.onLoading();
            this.Channel.create(users).then(data => {
                console.log('saved', data);
                this.events.publish('channel:update');
                this.util.endLoading();
                this.dismiss();
            });
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
