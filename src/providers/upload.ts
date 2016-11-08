import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {PARSE_APP_ID, PARSE_REST_API_KEY, PARSE_SERVER_URL} from '../config';

declare var Parse: any;
@Injectable()
export class UploadService {
    progress: any;
    progressObserver: any;
    percent: number = 0;

    constructor() {
        this.progress = Observable.create(observer => {
            this.progressObserver = observer
        }).share();
    }

    /*
     https://plnkr.co/edit/ozZqbxIorjQW15BrDFrg?p=preview
     this.service.makeFileRequest('http://localhost:8182/upload', [], files).subscribe(() => {
     console.log('sent');
     });
     * */
    uploadRxjs(files: File[]) {
        return Observable.create(observer => {
            let formData: FormData  = new FormData(),
                xhr: XMLHttpRequest = new XMLHttpRequest();

            let url = PARSE_SERVER_URL;
            if (url[url.length - 1] !== '/') {
                url += '/';
            }
            url += 'files/' + 'file.jpg';

            for (let i = 0; i < files.length; i++) {
                formData.append("uploads[]", files[i], files[i].name);
            }

            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        observer.next(JSON.parse(xhr.response));
                        observer.complete();
                    } else {
                        observer.error(xhr.response);
                    }
                }
            };

            xhr.upload.onprogress = (event) => {
                this.progress = Math.round(event.loaded / event.total * 100);
                this.progressObserver.next(this.progress);
            };

            xhr.setRequestHeader('X-Parse-Application-Id', PARSE_APP_ID);
            xhr.setRequestHeader('X-Parse-REST-API-Key', PARSE_REST_API_KEY);
            xhr.setRequestHeader('Content-Type', 'image/jpeg');
            xhr.open("POST", url, true);
            xhr.send(formData);
        });
    }

    /*
     http://stackoverflow.com/questions/37236188/angular2-and-xhr-eventlistener
     this.service.makeFileRequest('http://localhost:8182/upload', [], files).then(() => {
     console.log('sent');
     });
     * */

    uploadPromise(file: File) {
        return new Promise((resolve, reject) => {
            let formData: any = new FormData();
            let xhr           = new XMLHttpRequest();
            let url           = PARSE_SERVER_URL;
            if (url[url.length - 1] !== '/') {
                url += '/';
            }
            url += 'files/' + 'file.jpg';

            formData.append("uploads[]", file, file.name);

            xhr.upload.addEventListener('progress', (evt) => this.progressFunction(evt), false);
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4) {
                    if (xhr.status == 200) {
                        resolve(JSON.parse(xhr.response));
                    } else {
                        reject(xhr.response);
                    }
                }
            }
            xhr.setRequestHeader('X-Parse-Application-Id', PARSE_APP_ID);
            xhr.setRequestHeader('X-Parse-REST-API-Key', PARSE_REST_API_KEY);
            xhr.setRequestHeader('Content-Type', file.type);
            xhr.open("POST", url, true);
            xhr.send(formData);
        });
    }

    uploadBase64Promise(base64: string) {
        return new Promise((resolve, reject) => {
            let xhr  = new XMLHttpRequest();
            let url  = PARSE_SERVER_URL + '/files/file.jpg';
            let file = new Parse.File('file.jpg', {base64: base64});


            let formData: any = new FormData();
            formData.append("uploads[]", file, 'file.jpg');

            xhr.upload.addEventListener('progress', (evt) => this.progressFunction(evt), false);
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4) {
                    if (xhr.status == 200) {
                        resolve(JSON.parse(xhr.response));
                    } else {
                        reject(xhr.response);
                    }
                }
            }
            xhr.open('POST', url, true);
            xhr.setRequestHeader('X-Parse-Application-Id', PARSE_APP_ID);
            xhr.setRequestHeader('X-Parse-REST-API-Key', PARSE_REST_API_KEY);
            xhr.setRequestHeader('Content-Type', 'image/jpeg');
            xhr.send(formData);
        });
    }

    uploadsPromise(files: Array<File>) {
        return new Promise((resolve, reject) => {
            let formData: any = new FormData();
            let xhr           = new XMLHttpRequest();
            let url           = PARSE_SERVER_URL;
            if (url[url.length - 1] !== '/') {
                url += '/';
            }
            url += 'files/' + 'file.jpg';

            for (var i = 0; i < files.length; i++) {
                formData.append("uploads[]", files[i], files[i].name);
            }
            xhr.upload.addEventListener('progress', (evt) => this.progressFunction(evt), false);
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4) {
                    if (xhr.status == 200) {
                        resolve(JSON.parse(xhr.response));
                    } else {
                        reject(xhr.response);
                    }
                }
            }
            xhr.setRequestHeader('X-Parse-Application-Id', PARSE_APP_ID);
            xhr.setRequestHeader('X-Parse-REST-API-Key', PARSE_REST_API_KEY);
            xhr.setRequestHeader('Content-Type', 'image/jpeg');
            xhr.open("POST", url, true);
            xhr.send(formData);
        });
    }

    progressFunction(evt, d?) {

        if (evt.lengthComputable) {
            //percent changed but I couldn't see change in html.
            this.percent = Math.round(evt.loaded / evt.total * 100);
            //log works correctly.
            console.log("PERCENT : ", this.percent);
            //log works correctly.
            console.log(Math.round(evt.loaded / evt.total * 100));
        }
    }
}
