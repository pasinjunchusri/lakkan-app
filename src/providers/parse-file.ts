import {Injectable} from '@angular/core';

declare var Parse: any;

@Injectable()
export class ParseFile {

    private _file: any;
    private _filename: string = 'file.jpg'

    upload(file, ext) {
        this._file = file;

        if (ext) {
            this._filename.replace('.jpg', ext);
        }

        return new Parse.File(this._filename, file);
    }
}
