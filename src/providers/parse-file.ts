import {Injectable} from '@angular/core';
import {Gallery} from "./gallery";
import {Events} from "ionic-angular";
import _ from 'underscore';

declare var Parse: any;

@Injectable()
export class ParseFile {

    private _file: any;
    private _filename: string   = 'file.jpg'
    public _uploadsPending: any = [];

    constructor(private provider: Gallery,
                private events: Events
    ) {

    }

    uploadProccess(item: any) {

        console.log('uploadProccess', item);
        let newItem = {loading: true, form: item.form, image: item.image, status: 'sending', code: this.getRandomInt()};
        this._uploadsPending.push(newItem);
        let index = _.findIndex(this._uploadsPending, {code: newItem.code});

        this.upload({base64: newItem.image}).then(image => {
            let form   = newItem.form;
            form.image = image;
            console.log('form', form);

            this.provider.put(form).then(item => {
                console.log(item);
                item.loading = false;
                this._uploadsPending.splice(index, 1);

                setTimeout(() => this.events.publish('home:reload', null), 500);
            }).catch(error => {
                console.log(error);
                this._uploadsPending[index].status = 'error';
            });
        })
    }

    getRandomInt(min: number = 0, max: number = 9999) {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    upload(file: any, ext?) {
        this._file = file;

        if (ext) {
            this._filename.replace('.jpg', ext);
        }

        return new Parse.File('file.jpg', file).save();
    }
}
