import { Component } from '@angular/core';

/*
  Generated class for the PhotoFeedbackModal component.

  See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
  for more info on Angular 2 Components.
*/
@Component({
  selector: 'photo-feedback-modal',
  templateUrl: 'photo-feedback-modal.html'
})
export class PhotoFeedbackModal {

  text: string;

  constructor() {
    console.log('Hello PhotoFeedbackModal Component');
    this.text = 'Hello World';
  }

}
