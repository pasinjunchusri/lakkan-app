import {NgModule} from '@angular/core';
import {CommonModule} from "@angular/common";

// Pipes
import {Capitalize} from "./capitalize";

export const sharedPipes = [
    Capitalize
];

@NgModule({
    imports     : [CommonModule],
    exports     : [sharedPipes],
    declarations: [sharedPipes],
})
export class PipesModule {
}
