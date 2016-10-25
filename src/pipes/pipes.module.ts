import {NgModule} from '@angular/core';
import {CommonModule} from "@angular/common";

// Pipes
import {Capitalize} from "./capitalize";
import {OrderBy} from "./order-by";
import {TimeAgoPipe} from "angular2-moment";

export const sharedPipes = [
    Capitalize,
    OrderBy,
    TimeAgoPipe
];

@NgModule({
    imports     : [CommonModule],
    exports     : [sharedPipes],
    declarations: [sharedPipes],
})
export class PipesModule {
}
