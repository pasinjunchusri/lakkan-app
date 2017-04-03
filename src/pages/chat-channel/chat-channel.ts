import {Component, ViewChild} from "@angular/core";
import {Content, Events, ModalController, NavController} from "ionic-angular";
import {ChatChannelProvider} from "../../providers/chat-channel.provider";
import {AnalyticsProvider} from "../../providers/analytics.provider";
import {ChatFormPage} from "../chat-form/chat-form";
import {ChatMessagePage} from "../chat-message/chat-message";
import _ from "underscore";
import {isNullOrUndefined} from "util";
declare const Parse: any;

@Component({
  selector   : 'page-chat-channel',
  templateUrl: 'chat-channel.html'
})
export class ChatChannelPage {

  @ViewChild('Content') content: Content;

  errorIcon: string = 'chatbubbles';
  errorText: string = '';
  data              = [];
  query: any;

  loading: boolean       = true;
  showEmptyView: boolean = false;
  showErrorView: boolean = false;
  moreItem: boolean      = false;

  params = {
    limit: 20,
    page : 1
  }

  constructor(public navCtrl: NavController,
              private events: Events,
              private provider: ChatChannelProvider,
              private modalCtrl: ModalController,
              private analytics: AnalyticsProvider,) {
    // Google Analytics
    this.analytics.view('ChatChannel page');
    this.data = [];

    let ParseObject = Parse.Object.extend('ChatChannel');
    this.query      = new Parse.Query(ParseObject).containedIn('users', [Parse.User.current()]).include('profiles');


    this.query
      .subscribe()
      .on('open', () => console.info('subscription opened'))
      .on('create', object => this.onCreateChannel(object))
      .on('update', (object) => console.info('object update', object))
      .on('leave', (object) => console.info('object leave', object))
      .on('delete', object => this.onDeleteChannel(object))
      .on('close', (object) => console.info('subscription close', object))
  }


  ionViewDidLoad() {
    this.events.subscribe('channel:reload', ()=>this.doRefresh())
    this.events.subscribe('channel:open', (channelId)=>this.onPageMessage(channelId))
    this.doRefresh();
  }


  onCreateChannel(object) {
    console.log(object)
    this.provider.parseChannel(object).then(channel => this.data.push(channel));
    this.scrollToBottom();
  }

  onDeleteChannel(object) {
    console.log(object, this.data)
    this.data = _.filter(this.data, item => item.id != object.id)
    this.scrollToBottom();
  }

  onPageMessage(channelId) {
    this.navCtrl.push(ChatMessagePage, {channel: channelId});
  }


  scrollToBottom(): void {
    setTimeout(() => {
        if (!isNullOrUndefined(this.content) && this.content.scrollToBottom) {
            this.content.scrollToBottom(300)
        }
    }, 100);
  }

  public doRefresh(event?) {
    this.loading = true;

    this.query.find().then(channels => {
      if (channels) {
        this.data = [];
        Promise
          .all(channels.map(channel => this.provider.parseChannel(channel)))
          .then(result => result.map(item => this.data.push(item)));
      } else {
        this.showEmptyView = true;
        this.showErrorView = false;
      }

      this.loading = false;
      this.scrollToBottom();
      if (event) event.complete();
    }).catch(() => {
      this.loading       = false;
      this.showEmptyView = false;
      this.showErrorView = true;
    });
  }


  onModalChatForm() {
    this.modalCtrl.create(ChatFormPage).present();
  }

}
