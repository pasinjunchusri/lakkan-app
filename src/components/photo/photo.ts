import { Directive } from '@angular/core';

/*
  Generated class for the Photo directive.

  See https://angular.io/docs/ts/latest/api/core/index/DirectiveMetadata-class.html
  for more info on Angular 2 Directives.
*/
@Directive({
  selector: '[photo]' // Attribute selector
})
export class Photo {

  constructor() {
    console.log('Hello Photo Directive');
  }

}
