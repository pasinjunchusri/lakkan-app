import {NgModule} from '@angular/core';
import {CommonModule} from "@angular/common";
import {Auth} from "./auth";

export const sharedProviders = [
    Auth
];

@NgModule({
    imports     : [CommonModule],
    exports     : [],
    declarations: [],
    providers   : [sharedProviders]
})
export class ProvidersModule {
}
