import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventService } from './event.service';
import { Overlay } from './overlay.service';
import { OverlayContainerComponent } from './overlay-container.component';
import { AdDirective } from './ad.directive';

@NgModule({
    declarations: [
        OverlayContainerComponent,
        AdDirective
    ],
    imports: [
        CommonModule
    ],
    exports: [],
    providers: [
        Overlay,
        EventService
    ],
    bootstrap: [],
    entryComponents: [
        OverlayContainerComponent
    ]
})
export class OverlayModule {
}
