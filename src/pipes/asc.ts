import {Injectable, Pipe} from '@angular/core';

import _ from 'underscore';

@Pipe({
    name: 'asc'
})
@Injectable()
export class AscPipe {

    transform(value, column) {
        return _.sortBy(value, column);
    }
}
