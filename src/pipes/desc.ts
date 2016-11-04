import {Injectable, Pipe} from '@angular/core';

import _ from 'underscore';

@Pipe({
    name: 'des'
})
@Injectable()
export class DescPipe {

    transform(items: Array<any>, conditions: string): Array<any> {
        console.log(items, conditions);
        let sorted = _.sortBy(items, 'createdAt').reverse();
        let data   = [];
        _.map(sorted, item => {
            console.log(item);
            data.push(item);
        })

        return data;
    }
}
