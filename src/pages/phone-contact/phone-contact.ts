import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {UserProvider} from "../../providers/user.provider";
import {IonicUtilProvider} from "../../providers/ionic-util.provider";
import _ from 'underscore';
import {AnalyticsProvider} from "../../providers/analytics.provider";

//http://market.ionic.io/plugins/ionic-2-ionic-contacts-inviter
declare const navigator : any;
declare const sms : any;
// const Contacts = navigator.contactsPhoneNumbers;
let contacts = [
  {
    "id": "1",
    "firstName": "Kate",
    "middleName": "",
    "lastName": "Bell",
    "displayName": "Kate Bell",
    "phoneNumbers": [
      {
        "number": "(555) 564-8583",
        "normalizedNumber": "(555) 564-8583",
        "type": "MOBILE"
      }, {
        "number": "(415) 555-3695",
        "normalizedNumber": "(415) 555-3695",
        "type": "OTHER"
      }
    ]
  }, {
    "id": "2",
    "firstName": "Daniel",
    "middleName": "",
    "lastName": "Higgins",
    "displayName": "Daniel Higgins",
    "phoneNumbers": [
      {
        "number": "555-478-7672",
        "normalizedNumber": "555-478-7672",
        "type": "HOME"
      }, {
        "number": "(408) 555-5270",
        "normalizedNumber": "(408) 555-5270",
        "type": "MOBILE"
      }, {
        "number": "(408) 555-3514",
        "normalizedNumber": "(408) 555-3514",
        "type": "OTHER"
      }
    ]
  }, {
    "id": "3",
    "firstName": "John",
    "middleName": "Paul",
    "lastName": "Appleseed",
    "displayName": "John Paul Appleseed",
    "phoneNumbers": [
      {
        "number": "888-555-5512",
        "normalizedNumber": "888-555-5512",
        "type": "MOBILE"
      }, {
        "number": "888-555-1212",
        "normalizedNumber": "888-555-1212",
        "type": "HOME"
      }
    ]
  }
];

@Component({selector: 'page-phone-contact', templateUrl: 'phone-contact.html'})
export class PhoneContactPage {
  data : any;
  loading : boolean = false;
  showPermission : boolean = true;
  search : string = '';
  placeholder : string = 'Search friend';

  cordova : boolean = false;

  constructor(private navCtrl : NavController, private provider : UserProvider, private util : IonicUtilProvider, private analytics : AnalyticsProvider,) {
    // Google Analytics
    this
      .analytics
      .view('Inviter Page');

    this.cordova = this.util.cordova;
    // Translate Search Bar Placeholder
    this
      .util
      .translate(this.placeholder)
      .then((res : string) => this.placeholder = res);
  }

  ionViewDidLoad() {}

  loadContacts(val?: string) {
    this.loading = true;
    this.showPermission = false;
    // Contacts.list(contacts => {
    let result = contacts;
    let data = [];
    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      result = _.filter(contacts, (item) => (item.firstName.toLowerCase().indexOf(val.toLowerCase()) > -1))
    }

    let group = _.groupBy(_.sortBy(result, 'firstName'), (contact : any) => contact.firstName.substr(0, 1));
    
    _.each(group, (value, key) => data.push({group: key, list: value}));
    this.data = data;

    this.loading = false;

    // }, this.errorImport)

  }

  errorImport(error) {
    this.loading = false;
    this
      .util
      .toast(error);
  }

  // Search
  doSearch() {
    this.loadContacts(this.search);
  }

  doCancel() {
    this.search = '';
    this.doSearch();
  }

  onShare(contact : any, phone : any) {
    console.log(contact, phone);
  }

  // SMS
  checkSMSPermission(text : string) {
    var success = (hasPermission) => {
      if (hasPermission) {
        this.sendSms(text);
      } else {
        // show a helpful message to explain why you need to require the permission to
        // send a SMS read
        // http://developer.android.com/training/permissions/requesting.html#explain for
        // more best practices
      }
    };
    sms.hasPermission(success, this.util.toast);
  }

  sendSms(text : string) {
    sms.send(text);
  }

  sms(text : string) {
    this.checkSMSPermission(text);
  }

}
