import { Component } from '@angular/core';

/*
  Generated class for the PhotoList component.

  See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
  for more info on Angular 2 Components.
*/
@Component({
  selector: 'photo-list',
  templateUrl: 'photo-list.html'
})
export class PhotoList {

  text: string;

  constructor() {
    console.log('Hello PhotoList Component');
    this.text = 'Hello World';
  }

}
