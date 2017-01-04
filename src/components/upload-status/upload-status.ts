import {Component} from "@angular/core";
import {Events} from "ionic-angular";
import {ParseFileProvider} from "../../providers/parse-file";
import {GalleryProvider} from "../../providers/gallery";
import _ from "underscore";
import {IUpload} from "../../models/upload.model";

@Component({
    selector: 'upload-status',
    //templateUrl: 'upload-status.html',
    template: `<ion-item  *ngFor="let item of uploads; let i=index; " >
                <ion-avatar item-left><img [src]="item.form.image"></ion-avatar>
                <h2>{{item.form.title}}</h2>
                <ion-spinner *ngIf="item.loading" item-right></ion-spinner>
                <button (click)="retry(i)" ion-button *ngIf="!item.loading" color="primary" outline item-right>Retry</button>
                <button (click)="cancel(i)" ion-button *ngIf="!item.loading" color="primary" outline item-right>Cancel</button>
                </ion-item>`
})
export class UploadStatusComponent {

    uploads: any[]   = [];
    loading: boolean = false;

    constructor(private ParseFile: ParseFileProvider,
                private provider: GalleryProvider,
                private events: Events
    ) {

        this.events.subscribe('upload:gallery', item => this.add(item));
    }

    add(item: IUpload) {
        console.log('uploadProccess', item);
        let newItem = {loading: true, form: item.form, status: 'sending', code: new Date().getTime()};
        this.uploads.push(newItem);
        let index = _.findIndex(this.uploads, {code: newItem.code});
        this.process(index);
    }

    process(index: number): void {
        let newItem                 = this.uploads[index];
        this.uploads[index].loading = true;

        this.provider.createGallery(newItem.form).then(item => {
            console.log(item);
            newItem.loading = false;
            this.uploads.splice(index, 1);
            this.events.publish('home:reload',null);
        }).catch(error => {
            console.log(error);
            this.uploads[index].loading = false;
        });
    }

    retry(index): void {
        this.process(index);
    }

    cancel(index, item): void {
        console.log(index, item);
        this.uploads.splice(index, 1);
    }

    getRandomInt(min: number = 0, max: number = 9999) {
        return Math.floor(Math.random() * (max - min)) + min;
    }


}
