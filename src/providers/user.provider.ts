import {Injectable} from "@angular/core";
import {Events} from "ionic-angular";
import {ParsePushProvider} from "./parse-push.provider";
import {IonicUtilProvider} from "./ionic-util.provider";
import {IUserFollow} from "../models/user.model";
import {LocalStorageProvider} from "./local-storage.provider";
import _ from "underscore";
declare var Parse: any;

@Injectable()
export class UserProvider {

  data: any[]      = [];
  cordova: boolean = false;

  constructor(private ParsePush: ParsePushProvider,
              private util: IonicUtilProvider,
              private events: Events,
              private Storage: LocalStorageProvider) {
    this.cordova = this.util.cordova;

  }

  current(): any {
    let user = Parse.User.current();
    if (user) {
      this.ParsePush.init();
    }
    return user;
  }

  fetch() {
    return new Promise((resolve, reject) => {
      if (Parse.User.current()) {
        Parse.User.current().fetch().then(resolve, reject);
      } else {
        reject();
      }
    });
  }

  setLanguage(lang: string = 'en'): Promise<any> {
    return Parse.User.current().set('lang', lang).save();
  }


  update(form: any) {
    let user = Parse.User.current();
    _.each(form, (value, key) => user.set(key, value));
    console.log(form);
    return user.save();
  }

  updatePhoto(parseFile) {
    let user = Parse.User.current();
    user.set('photo', parseFile);
    return user.save();
  }

  recoverPassword(email: string) {
    return Parse.User.requestPasswordReset(email);
  }

  getProfile(username: string): Promise<any> {
    return Parse.Cloud.run('profile', {username: username});
  }

  updateAvatar(photo: string): Promise<any> {
    return Parse.Cloud.run('updateAvatar', {photo: photo});
  }

  logout(): void {
    let user = Parse.User.current();
    this.ParsePush.unsubscribe(user.get('username'));
    this.events.unsubscribe('upload:gallery');
    Parse.User.logOut();
  }

  updateWithFacebookData(): Promise<any> {
    return new Promise((resolve,
                        reject) => {
      let currentUser = null;
      Parse.Cloud.run('saveFacebookPicture')
        .then(user => currentUser = user)
        .then(() => this.Storage.get('lang'))
        .then(this.setLanguage)
        .then(() => this.ParsePush.init())
        .then(() => resolve(currentUser))
        .catch(reject);
    })
  }

  facebookSyncProfile(fbData: any) {
    let currentUser = Parse.User.current();

    if (!currentUser.get('facebook') && fbData.id) {
      currentUser.set('facebook', fbData.id);
    }

    if (!currentUser.get('email') && fbData.email) {
      currentUser.set('email', fbData.email);
    }

    if (!currentUser.get('name') && fbData.name) {
      currentUser.set('name', fbData.name);
    }

    if (!currentUser.get('gender') && fbData.gender) {
      currentUser.set('gender', fbData.gender);
    }

    if (!currentUser.get('birthdate') && fbData.birthday) {
      currentUser.set('birthdate', new Date(fbData.birthday));
    }

    return currentUser.save();
  }

  signUp(data) {
    let user = new Parse.User();
    _.each(data, (value,
                  key) => user.set(key, value));
    return user.signUp(null);

  }

  signIn(obj) {

    return new Promise((resolve,
                        reject) => {
      let currentUser = null
      Parse.User
        .logIn(obj.username, obj.password)
        .then(
          _user => currentUser = _user)
        .then(() => this.Storage.get('lang'))
        .then(this.setLanguage)
        .then(() => this.ParsePush.init())
        .then(() => resolve(currentUser))
        .catch(reject);
    });
  }


  changePassword(password: string) {
    return Parse.Cloud.run('changePassword', {password: password});
  }

  destroy(data) {
    return Parse.Cloud.run('destroyUser', data);
  }

  validateEmail(input: string) {
    return Parse.Cloud.run('validateEmail', {email: input});
  }

  validateUsername(input: string) {
    return Parse.Cloud.run('validateUsername', {username: input});
  }


  follow(params: IUserFollow): Promise<any> {
    return Parse.Cloud.run('followUser', params);
  }


  list(params: any): Promise<any> {
    return Parse.Cloud.run('listUsers', params);
  }

  getLikers(galleryId: string) {
    return Parse.Cloud.run('getLikers', {galleryId: galleryId});
  }

  getFollowers(username: string): Promise<any> {
    return Parse.Cloud.run('getFollowers', {username: username});
  }

  // Following

  getFollowing(username: string): Promise<any> {
    return Parse.Cloud.run('getFollowing', {username: username});

  }


}
