import {Directive, Renderer, ElementRef} from '@angular/core';
import {Keyboard} from 'ionic-native';

@Directive({
  selector: '[focus]' // Attribute selector
})
export class FocusDirective {
 constructor(private renderer:Renderer, private elementRef:ElementRef) {
    }
    ngAfterViewInit() {
        const element = this.elementRef.nativeElement.querySelector('input');
        // we need to delay our call in order to work with ionic ...
        setTimeout(() => {
            this.renderer.invokeElementMethod(element, 'focus', []);
            Keyboard.show();
            element.getBoundingClientRect().top
        }, 0);
    }

}
