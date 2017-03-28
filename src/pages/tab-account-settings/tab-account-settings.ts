import {PhoneContactPage} from "./../phone-contact/phone-contact";
import {Component} from "@angular/core";
import {App, ModalController, NavController} from "ionic-angular";
import {IntroPage} from "../intro/intro";
import {UserPasswordPage} from "../user-password/user-password";
import {AccountEditModalPage} from "../account-edit-modal/account-edit-modal";
import {IonicUtilProvider} from "../../providers/ionic-util.provider";
import {AboutPage} from "../about/about";
import {LanguageModalComponent} from "../../components/language-modal/language-modal";
import {UserProvider} from "../../providers/user.provider";
import {AnalyticsProvider} from "../../providers/analytics.provider";
import {TermsPage} from "../terms/terms";
import {FacebookUserListComponent} from "../facebook-user-list/facebook-user-list";

@Component({
  selector   : 'page-tab-account-settings',
  templateUrl: 'tab-account-settings.html'
})
export class TabAccountSettingsPage {

  constructor(private User: UserProvider,
              private app: App,
              private navCtrl: NavController,
              private modalCtrl: ModalController,
              private util: IonicUtilProvider,
              private analytics: AnalyticsProvider
  ) {
    // Google Analytics
    this.analytics.view('TabAccountSettingsPage');

  }

  onInviteFriends() {
    this.navCtrl.push(PhoneContactPage);
  }

  onFacebookFriends() {
    this.navCtrl.push(FacebookUserListComponent)
  }

  aboutPage(): void {
    this.modalCtrl.create(AboutPage).present();
  }

  modalLanguage() {
    this.modalCtrl.create(LanguageModalComponent).present();
  }

  href(url): void {
    this.util.href(url);
  }

  public onTerms(): void {
    this.navCtrl.push(TermsPage);
  }

  changePassword(): void {
    this.modalCtrl.create(UserPasswordPage).present();
  }

  editModal(): void {
    this.modalCtrl.create(AccountEditModalPage).present();
  }

  logout(): void {
    this.User.logout();
    this.app.getRootNav().setRoot(IntroPage);
  }

}
