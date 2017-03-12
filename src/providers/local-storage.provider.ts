import {Injectable} from "@angular/core"
import {Platform} from "ionic-angular"

declare const window: any;

@Injectable()
export class LocalStorageProvider {
  cordova: boolean = false
  storage: any     = window.localStorage

  constructor(private platform: Platform) {
    this.cordova = platform.is('cordova') ? true : false
  }

  set(key: string, value: any): any {
    return this.storage.setItem(key, value)
  }

  get(key: string): Promise<any> {
    return new Promise(resolve => {
      let result = this.storage.getItem(key)
      console.log(result)
      resolve(result)
    })
  }
}
