import { Injectable, Pipe } from '@angular/core';

@Pipe({
    name: 'capitalize'
})
@Injectable()
export class CapitalizePipe {
    /*
     Takes a value and makes it lowercase.
     */
    transform(value, args) {
        return value.substr(0, 1).toUpperCase() + value.substr(1).toLowerCase();
    }
}
