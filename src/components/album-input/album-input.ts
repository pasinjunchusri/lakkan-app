import { Component } from '@angular/core';

/*
  Generated class for the AlbumInput component.

  See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
  for more info on Angular 2 Components.
*/
@Component({
  selector: 'album-input',
  templateUrl: 'album-input.html'
})
export class AlbumInputComponent {

  text: string;

  constructor() {
    console.log('Hello AlbumInput Component');
    this.text = 'Hello World';
  }

}
