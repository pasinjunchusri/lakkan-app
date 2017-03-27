import {Component} from "@angular/core";
import {AlertController, Events, NavController, NavParams, ViewController} from "ionic-angular";
import {ChatChannelProvider} from "../../providers/chat-channel.provider";
import {IonicUtilProvider} from "../../providers/ionic-util.provider";

@Component({
  selector   : 'page-chat-message-popover',
  templateUrl: 'chat-message-popover.html'
})
export class ChatMessagePopoverPage {
  channelId: string;
  _translateDestroyTitle:string;
  _translateDestroyMessage:string;
  _translateCancel:string;
  _translateYes:string;

  constructor(public navCtrl: NavController,
              public events: Events,
              public alertCtrl: AlertController,
              public util: IonicUtilProvider,
              public provider: ChatChannelProvider,
              public viewCtrl: ViewController,
              public navParams: NavParams) {

    this.util.translate('Destroy chat').then((res: string) => this._translateDestroyTitle = res);
    this.util.translate('You are sure destroy this chat?').then((res: string) => this._translateDestroyMessage = res);
    this.util.translate('Cancel').then((res: string) => this._translateCancel = res);
    this.util.translate('Yes').then((res: string) => this._translateYes = res);

    this.channelId = this.navParams.get('id')
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChatMessagePopoverPage');
  }

  doDestroyChannel() {
    console.log('Destroy chat', this.channelId)

    this.alertCtrl.create({
      title  : this._translateDestroyTitle,
      message: this._translateDestroyMessage,
      buttons: [
        {
          text: this._translateCancel,
          role: 'cancel'
        },
        {
          text   : this._translateYes,
          handler: () => {
            this.util.onLoading();
            this.provider.destroy(this.channelId).then(() => {
              this.util.endLoading();
              this.events.publish('channel:reload')
              this.close();
            }).catch(error => {
              console.log('error', error)
              this.util.toast(error.message)
              this.util.endLoading();
            })
            ;
          }
        }
      ]
    }).present();

  }

  close() {
    this.events.publish('chat:pop');
    this.viewCtrl.dismiss();
  }

}
