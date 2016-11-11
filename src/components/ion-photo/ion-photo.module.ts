import {NgModule} from '@angular/core';
import {IonicModule} from "ionic-angular";
import {IonPhotoCropModal} from "./ion-photo-crop-modal/ion-photo-crop-modal";
import {IonPhotoService} from "./ion-photo-service";
import {TranslateModule, TranslateLoader} from "ng2-translate";

export const APP_COMPONENTS = [
    IonPhotoCropModal,
];

@NgModule({
    imports     : [IonicModule,
                   TranslateModule.forRoot({
                       provide   : TranslateLoader
                   })
    ],
    exports     : [APP_COMPONENTS],
    declarations: [APP_COMPONENTS],
    entryComponents: [APP_COMPONENTS],
    providers   : [
        IonPhotoService
    ],
})

export class IonPhotoModule {
}
