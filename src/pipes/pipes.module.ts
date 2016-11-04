import {NgModule} from '@angular/core';
import {CommonModule} from "@angular/common";

// Pipes

import {AscPipe} from "./asc";
import {DescPipe} from "./desc";
import {CapitalizePipe} from "./capitalize";
import {OrderByPipe} from "./order-by";


export const sharedPipes = [
    CapitalizePipe,
    OrderByPipe,
    AscPipe,
    DescPipe,
];

@NgModule({
    imports     : [CommonModule],
    exports     : [sharedPipes],
    declarations: [sharedPipes],
})
export class PipesModule {
}
