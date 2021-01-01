import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GalleryCarouselComponent } from './gallery-carousel.component';
import { Gallery } from './gallery.service';
import { OverlayModule } from './overlay/overlay.module';

@NgModule({
    declarations: [
        GalleryCarouselComponent
    ],
    imports: [
        CommonModule,
        OverlayModule
    ],
    exports: [
      GalleryCarouselComponent
    ],
    providers: [
        Gallery
    ],
    bootstrap: [
        
    ],
    entryComponents: [
      GalleryCarouselComponent
    ]
})
export class IvyGalleryModule { }
