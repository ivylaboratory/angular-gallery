import { Injectable, Injector, ComponentFactoryResolver, EmbeddedViewRef, ApplicationRef } from '@angular/core';

import { EventService } from './event.service';
import { OverlayContainerComponent } from './overlay-container.component';
import { OverlayProperties, ContainerProperties } from './interfaces';
import { defaultProperties } from './default-properties';

@Injectable()
export class Overlay {
    globalEventsSubscription;
    componentRefs = {};
    _properties: any = {};
    _defaultProperties: any;

    constructor(
        private componentFactoryResolver: ComponentFactoryResolver,
        private appRef: ApplicationRef,
        private injector: Injector,
        private eventService: EventService) {
        this.globalEventsSubscription = this.eventService.emitter.subscribe(
            (event) => {
                this.handleGlobalEvents(event);
            }
        );
    }

    appendComponentToBody(properties: any, component: any = OverlayContainerComponent):void {
        if (this.componentRefs[0]){
            return;
        }

        const componentRef = this.componentFactoryResolver
            .resolveComponentFactory(component)
            .create(this.injector);

        this.componentRefs[0] = componentRef;

        (<ContainerProperties>componentRef.instance).properties = properties;
        this.appRef.attachView(componentRef.hostView);
        const domElem = (componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;

        // Add to body
        document.body.appendChild(domElem);
    }

    /*
    appendComponentToTag(element: any, tagname: string = ''):void {
        if (tagname){
            document.getElementsByTagName(tagname)[0].appendChild(element);
        } else {
            document.body.appendChild(element);
        }
    }
    */

    public load(properties: OverlayProperties):void {
        properties = this.applyPropertieDefaults(defaultProperties, properties);
        this.appendComponentToBody(properties);
    }

    public close(prop: any = {}):void {
        /*
        if (this.componentRefs[prop.id]){
            (<ContainerProperties>this.componentRefs[prop.id].instance).closeOverlay();
        }
        */
    }

    applyPropertieDefaults(defaultProperties, properties){
        if (!properties) {
            properties = {};
        }
        if (!properties.index){ 
            properties.index = 0;
        }
        this._defaultProperties = Object.assign({}, defaultProperties);
        return Object.assign(this._defaultProperties, properties);
    }

    objectLength(obj):number {
        let length = 0, key;
        for (key in obj) {
            if (obj.hasOwnProperty(key)) length++;
        }
        return length;
    };

    handleGlobalEvents(event){
        if (event.type === '[Overlay] Hide'){
            this.handleCloseEvent();
        }
    }

    handleCloseEvent(){
        this.appRef.detachView(this.componentRefs[0].hostView);
        this.componentRefs[0].destroy();
        delete this.componentRefs[0];
    }
}