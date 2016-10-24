import {Injectable, Pipe} from '@angular/core';

/*
 Generated class for the Capitalize pipe.

 See https://angular.io/docs/ts/latest/guide/pipes.html for more info on
 Angular 2 Pipes.
 */
@Pipe({
    name: 'capitalize'
})
@Injectable()
export class Capitalize {
    /*
     Takes a value and makes it lowercase.
     */
    transform(value, args) {
        return value.substr(0, 1).toUpperCase() + value.substr(1).toLowerCase();
    }
}
