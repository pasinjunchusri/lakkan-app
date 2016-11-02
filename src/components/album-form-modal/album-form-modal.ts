import { Component } from '@angular/core';

@Component({
  selector: 'album-form-modal',
  templateUrl: 'album-form-modal.html'
})
export class AlbumFormModal {

  text: string;

  constructor() {
    console.log('Hello PhotoFeedbackModal Component');
    this.text = 'Hello World';
  }

}
