import {Component} from "@angular/core";
import {IonicUtilProvider} from "../../providers/ionic-util.provider";
import {AnalyticsProvider} from "../../providers/analytics.provider";
import _ from "underscore";

// cordova plugin add https://github.com/dbaq/cordova-plugin-contacts-phone-numbers.git
// cordova plugin add https://github.com/cordova-sms/cordova-sms-plugin.git
declare const navigator: any;
declare const sms: any;

@Component({selector: 'page-phone-contact', templateUrl: 'phone-contact.html'})
export class PhoneContactPage {
    Contacts: any           = navigator.contactsPhoneNumbers;
    SMS: any                = sms;
    data: any;
    loading: boolean        = false;
    showPermission: boolean = true;
    search: string          = '';
    placeholder: string     = 'Search friend';
    _message: string        = 'Hey, come join me on Photogram!, Can download it at: https://photogram.codevibe.io';

    cordova: boolean = false;

    constructor(private util: IonicUtilProvider,
                private analytics: AnalyticsProvider,
    ) {
        // Google Analytics
        this.analytics.view('Inviter Page');

        this.cordova = this.util.cordova;
        // Translate Search Bar Placeholder
        this.util.translate(this.placeholder).then((res: string) => this.placeholder = res);

      this.loadContacts();
    }

    loadContacts(val?: string) {
        this.loading        = true;
        this.showPermission = false;
        this.Contacts.list(contacts => {
            let result = contacts;
            let data   = [];
            // if the value is an empty string don't filter the items
            if (val && val.trim() != '') {
                result = _.filter(contacts, (item) => (item['firstName'].toLowerCase().indexOf(val.toLowerCase()) > -1))
            }

            let group = _.groupBy(_.sortBy(result, 'firstName'), (contact: any) => contact.firstName? contact.firstName.substr(0, 1) : '');

            _.each(group, (value, key) => data.push({group: key, list: value}));
            this.data    = data;
            this.loading = false;

        }, this.errorImport)

    }

    errorImport(error) {
        this.loading = false;
        this.util.toast(error);
    }

    // Search
    doSearch() {
        this.loadContacts(this.search);
    }

    doCancel() {
        this.search = '';
        this.doSearch();
    }

    onShare(contact: any, phone: any) {
        console.log(contact, phone);
        this.hasPermission().then(permission => {
                if (permission) {
                    this.SMS.send(phone.normalizeNumber, this._message)
                } else {
                    this.onErrorSMSPermison();
                }
            })
            .catch(this.onErrorSMSPermison)
    }

    // SMS
    hasPermission(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.SMS.hasPermission(resolve, reject);
        });
    }

    onErrorSMSPermison() {
        this.util.toast('Please check SMS permission')
    }

}
