import {Directive, Renderer, ElementRef} from '@angular/core';
import {Keyboard} from '@ionic-native/keyboard';
import {Platform} from "ionic-angular";

@Directive({
    selector: '[focus]' // Attribute selector
})
export class FocusDirective {
    constructor(private renderer: Renderer,
                private elementRef: ElementRef,
                private platform: Platform,
                private Keyboard: Keyboard
    ) {
    }

    ngAfterViewInit() {
        const element = this.elementRef.nativeElement.querySelector('input');
        // we need to delay our call in order to work with ionic ...
        this.renderer.invokeElementMethod(element, 'focus', []);
        if (this.platform.is('cordova')) {
            this.Keyboard.show();
            element.getBoundingClientRect().top
        }
    }

}
