import {Injectable} from '@angular/core';

@Injectable()
export class ParseFile {

    upload(file, ext) {
        let filename = 'file.jpg';

        if (ext) {
            filename.replace('.jpg', ext);
        }

        return new Parse.File(filename, file);
    }
}
