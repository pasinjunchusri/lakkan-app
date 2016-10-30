import {NgModule} from '@angular/core';
import {CommonModule} from "@angular/common";

// Components
import {Loader} from "./loader/loader";
import {PhotoGrid} from "./photo-grid/photo-grid";
import {PhotoList} from "./photo-list/photo-list";
import {PhotoCommentModal} from "./photo-comment-modal/photo-comment-modal";
import {PhotoFeedbackModal} from "./photo-feedback-modal/photo-feedback-modal";
import {PhotoCard} from "./photo-card/photo-card";

export const sharedComponents = [
    Loader,
    PhotoCommentModal,
    PhotoFeedbackModal,
    PhotoGrid,
    PhotoList,
    PhotoCard,
];

@NgModule({
    imports     : [CommonModule],
    exports     : [sharedComponents],
    declarations: [sharedComponents],
})
export class ComponentsModule {
}
