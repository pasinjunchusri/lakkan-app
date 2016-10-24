import {Directive, ElementRef} from '@angular/core';

/*
 Generated class for the ElasticHeader directive.

 See https://angular.io/docs/ts/latest/api/core/index/DirectiveMetadata-class.html
 for more info on Angular 2 Directives.
 */
@Directive({
    selector: '[parallax-header]' // Attribute selector
})
export class ParallaxHeader {
    private element: any;
    private ticking: any;
    private translateAmt: any;
    private scaleAmt: any;
    private scrollTop: any;
    private lastScrollTop: any;
    private scrollerHandle: any;
    private header: any;
    private headerHeight: any;

    constructor(element: ElementRef) {

        var me       = this;
        this.element = element;

        this.scrollerHandle = this.element.nativeElement.children[0];
        this.header         = document.getElementById("elastic-header");
        this.headerHeight   = this.scrollerHandle.clientHeight;
        this.translateAmt   = null;
        this.scaleAmt       = null;
        this.scrollTop      = null;
        this.lastScrollTop  = null;
        this.ticking        = false;
        let headerHeight    = this.headerHeight;
        let scrollerHandle  = this.scrollerHandle;

        this.header.style.webkitTransformOrigin = 'center bottom';

        window.addEventListener('resize', () => headerHeight = scrollerHandle.clientHeight, false);

        this.scrollerHandle.addEventListener('scroll', () => {
            if (!me.ticking) {
                window.requestAnimationFrame(() => me.updateElasticHeader());
            }
            this.ticking = true;
        });

    }

    updateElasticHeader() {

        this.scrollTop = this.scrollerHandle.scrollTop;

        if (this.scrollTop >= 0) {
            this.translateAmt = this.scrollTop / 2;
            this.scaleAmt     = 1;
        } else {
            this.translateAmt = 0;
            this.scaleAmt     = -this.scrollTop / this.headerHeight + 1;
        }

        this.header.style.webkitTransform = 'translate3d(0,' + this.translateAmt + 'px,0) scale(' + this.scaleAmt + ',' + this.scaleAmt + ')';

        this.ticking = false;
    }

}
