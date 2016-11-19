import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-tab-capture',
  templateUrl: 'tab-capture.html'
})
export class TabCapturePage {

  constructor(public navCtrl: NavController) {}

  ionViewDidLoad() {
    console.log('Hello TabCapturePage Page');
  }

}
