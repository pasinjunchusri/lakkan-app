import {Component, NgZone} from '@angular/core';
import {Events} from "ionic-angular";

import {ParseFileProvider} from "../../providers/parse-file";
import {GalleryProvider} from "../../providers/gallery";
import _ from 'underscore';

export interface IUpload {
    loading: boolean;
    form: any;
    status: string;
    code: number;
    image?: any;
}

@Component({
    selector: 'upload-status',
    //templateUrl: 'upload-status.html',
    template: `<div *ngIf="!loading">
                <ion-item  *ngFor="let item of uploads; let i =index; " >
                <ion-avatar item-left><img [src]="item.image"></ion-avatar>
                <h2>{{item.form.title}}</h2>
                <ion-spinner (click)="retry(i, item)" *ngIf="item.loading" item-right></ion-spinner>
                <button (click)="retry(i, item)" ion-button *ngIf="!item.loading" color="primary" outline item-right>Retry</button>
                <button (click)="cancel(i, item)" ion-button *ngIf="!item.loading" color="primary" outline item-right>Cancel</button>
                </ion-item>
            </div>`
})
export class UploadStatusComponent {

    uploads: any[]   = [];
    loading: boolean = false;

    constructor(private ParseFile: ParseFileProvider,
                private provider: GalleryProvider,
                private events: Events,
                private zone: NgZone
    ) {

        this.uploads.push({loading: true, form: {title: 'Teste'}, status: 'sending', code: this.getRandomInt()})

        events.subscribe('upload:gallery', item => {
            console.log('upload:gallery', item);
            this.zone.run(() => {
                this.loading = true;
                this.uploads.push({loading: true, form: {title: 'Teste 2'}, status: 'sending', code: this.getRandomInt()})
                this.loading = false;
            });
        });
    }

    retry($event, item): void {
        console.log($event, item);
        item.loading = !item.loading;
    }

    cancel(index, item): void {
        console.log(index, item);
        this.uploads.splice(index, 1);
    }

    uploadProccess(item: IUpload) {

        console.log('uploadProccess', item);
        let newItem = {loading: true, form: item.form, image: item.image, status: 'sending', code: this.getRandomInt()};
        this.uploads.push(newItem);
        console.log(this.uploads);
        let index = _.findIndex(this.uploads, {code: newItem.code});

        console.log(this.uploads, index);

        this.ParseFile.upload({base64: newItem.image}).then(image => {
            let form   = newItem.form;
            form.image = image;
            console.log('form', form);

            this.provider.put(form).then(item => {
                console.log(item);
                item.loading = false;
                this.uploads.splice(index, 1);

                this.events.publish('home:reload', null);

            }).catch(error => {
                console.log(error);
                this.uploads[index].status = 'error';
            });
        })
    }

    getRandomInt(min: number = 0, max: number = 9999) {
        return Math.floor(Math.random() * (max - min)) + min;
    }


}
