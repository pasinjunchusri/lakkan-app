import { Injectable, Pipe } from '@angular/core';

import _ from 'underscore';

@Pipe({
    name: 'orderBy'
})
@Injectable()
export class OrderByPipe {

    transform(value, args) {
        console.log(value, args);
        return _.sortBy(value, args);
    }
}
