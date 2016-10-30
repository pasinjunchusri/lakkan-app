import { Component } from '@angular/core';
import {NavController, ViewController} from 'ionic-angular';

/*
  Generated class for the AccountEditModal page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-account-edit-modal',
  templateUrl: 'account-edit-modal.html'
})
export class AccountEditModal {

  constructor(public navCtrl: NavController,
              public viewCtrl: ViewController,
  ) {}

  ionViewDidLoad() {
    console.log('Hello AccountEditModal Page');
  }

  dismiss(){
    this.viewCtrl.dismiss();
  }

}
