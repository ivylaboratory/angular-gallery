import {Injectable, Injector, ComponentFactoryResolver, EmbeddedViewRef, ApplicationRef, ComponentRef, EventEmitter} from '@angular/core';

import {CarouselComponent} from './carousel.component';
import {GalleryProperties} from './interfaces';
import {Overlay} from './overlay/overlay.service';
import {OverlayProperties} from './overlay/interfaces'; 
import {EventService as OverlayEventService} from './overlay/event.service'; 
import {defaultProperties} from './default-properties';

@Injectable()
export class Gallery {
    _defaultProperties: OverlayProperties;

    constructor(
        public overlay: Overlay,
        private overlayEventService: OverlayEventService) {}

    public load(properties: GalleryProperties) {
        properties = this.applyPropertieDefaults(defaultProperties, properties);

        this.overlay.load({
            id: 'gallery',
            mainComponent: CarouselComponent,
            width: document.body.clientWidth+'px',
            overlayBackdrop: true,
            position: 'fixed',
            metadata: {
                images: properties.images,
                index: properties.index,
                width: window.innerWidth,
                height: window.innerHeight,
                objectFit: 'initial',
                margin: 0,
                transitionDuration: properties.transitionDuration,
                overflowCellsLimit: 1,
                transitionTimingFunction: properties.transitionTimingFunction,
                counter: properties.counter,
                counterSeparator: properties.counterSeparator,
                arrows: properties.arrows,
                minSwipeDistance: properties.minSwipeDistance
            }
        });
    }

    public close() {
        this.overlayEventService.emitChangeEvent({
            type: 'Hide'
        });
    }

    applyPropertieDefaults(defaultProperties, properties) {
        if (!properties) {
            properties = {};
        }

        for (var propertie in properties) {
            if (properties[propertie] === undefined) {
                delete properties[propertie];
            }
        }

        this._defaultProperties = Object.assign({}, defaultProperties);
        return Object.assign(this._defaultProperties, properties);
    }
}