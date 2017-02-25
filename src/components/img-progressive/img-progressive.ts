import {Component, ElementRef, AfterContentInit, OnChanges, SimpleChanges, Input} from "@angular/core";
import {IonicUtilProvider} from "../../providers/ionic-util.provider";

@Component({
    selector: 'img-progressive',
    template: `
        <div [ngStyle]="getOverlayStyle()">
            <div [ngStyle]="getOverlayStyle()">
                <ng-content select="[data-overlay]"></ng-content>
            </div>
            <img [src]="srcLow">
        </div>
        <img [src]="src" [ngStyle]="getImageStyle()" (load)="onLoad()"/>
        `,
    styles  : [
        `
        :host {
            display: block;
            position: relative;
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
            display: block;
            position: absolute;
            top: 0;
            left: 0;
            opacity: 0;
            transition: ease all 0.5s;
            width: 100%;
            height: auto;
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
            // width : `${this.width}px`,
            // height: `${this.height}px`
        }
    }

    getOverlayStyle() {
        return {
            // width : `${this.width}px`,
            // height: `${this.height}px`
        }
    }

    onLoad() {
        this.image.style.opacity           = '1';
    }
}
