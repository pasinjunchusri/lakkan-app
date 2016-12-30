import {Component, ElementRef, AfterContentInit, OnChanges, SimpleChanges, Input} from "@angular/core";
import {IonicUtilProvider} from "../../providers/ionic-util";

@Component({
    selector   : 'img-progressive',
    templateUrl: 'img-progressive.html',
    styles     : [
        `
        :host {
            display: block;
            overflow: hidden;
        }

        :host > div
        :host > img,
        :host > div > div {
            padding: 0;
            margin: 0;
            top: 0;
        }

        :host > div {
            position: relative;
        }

        :host > img {
            display: none;
        }

        :host > div > div {
            position: absolute;
        }
        `
    ]
})
export class ImgProgressiveComponent implements AfterContentInit, OnChanges {
    private element: HTMLElement;
    private progressWrapper: HTMLElement;
    private image: HTMLImageElement;

    @Input() srcLow: string;
    @Input() src: string;
    @Input() width: number  = 320;
    @Input() height: number = 320;

    constructor(element: ElementRef, private  util: IonicUtilProvider) {
        this.element = element.nativeElement;
        this.width   = this.util._widthPlatform;
        this.height  = this.util._widthPlatform;
    }

    ngAfterContentInit() {
        this.progressWrapper = <HTMLElement>this.element.children[0];
        const images         = this.element.getElementsByTagName('img');
        this.image           = <HTMLImageElement>images[images.length - 1];
    }

    ngOnChanges(changes: SimpleChanges) {
        for (let propName in changes) {
            propName === 'width' && (this.element.style.width = `${this.width}px`);
            propName === 'height' && (this.element.style.height = `${this.height}px`);
        }
    }

    getImageStyle() {
        return {
            width : `${this.width}px`,
            height: `${this.height}px`
        }
    }

    getOverlayStyle() {
        return {
            width : `${this.width}px`,
            height: `${this.height}px`
        }
    }

    onLoad() {
        this.progressWrapper.style.display = 'none';
        this.image.style.display           = 'block';
    }
}
