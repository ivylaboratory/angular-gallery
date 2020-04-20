import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarouselComponent } from './carousel.component';
import { Gallery } from './gallery.service';
import { OverlayModule } from './overlay/overlay.module';

@NgModule({
    declarations: [
        CarouselComponent
    ],
    imports: [
        CommonModule,
        OverlayModule
    ],
    exports: [
        CarouselComponent
    ],
    providers: [
        Gallery
    ],
    bootstrap: [
        
    ],
    entryComponents: [
        CarouselComponent
    ]
})
export class IvyGalleryModule { }
