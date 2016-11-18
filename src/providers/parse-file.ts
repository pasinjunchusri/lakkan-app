import {Injectable} from '@angular/core';

declare var Parse: any;

@Injectable()
export class ParseFileProvider {

    private _file: any;
    private _filename: string     = 'file.jpg'

    constructor() {

    }


    upload(file: any, ext?) {
        this._file = file;

        if (ext) {
            this._filename.replace('.jpg', ext);
        }

        return new Parse.File('file.jpg', file).save();
    }
}
