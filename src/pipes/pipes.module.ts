import {NgModule} from '@angular/core';
import {CommonModule} from "@angular/common";

// Pipes
import {Capitalize} from "./capitalize";
import {OrderBy} from "./order-by";


export const sharedPipes = [
    Capitalize,
    OrderBy,
];

@NgModule({
    imports     : [CommonModule],
    exports     : [sharedPipes],
    declarations: [sharedPipes],
})
export class PipesModule {
}
