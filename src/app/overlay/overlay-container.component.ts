import { Component, OnInit, HostBinding, HostListener, ViewChild, ElementRef, Input, ComponentFactoryResolver
} from '@angular/core';
import { EventService } from './event.service';
import { AdDirective } from './ad.directive';
import { ComponentProperties, OverlayProperties } from './interfaces';

@Component({
    selector: 'overlay',
    templateUrl: './overlay-container.component.html',
    styleUrls: ['./overlay-container.component.sass']
})

export class OverlayContainerComponent implements OnInit {
    public isInitial: boolean;
    globalEventsSubscription;
    public overlayBackdrop: boolean = true;
    minTimeout: number = 30;
    _hostOpacity: number = 0;

    @ViewChild(AdDirective, {static: true}) adHost: AdDirective;

    @Input() properties: OverlayProperties;

    @HostBinding('style.opacity')
    get hostOpacity(){
        return this.properties.fadeIn ? this._hostOpacity : 1;
    }
    set hostOpacity(value){
        this._hostOpacity = value;
    }

    @HostBinding('style.transition')
    get hostTransition(){
        const duration = this.properties.animationDuration+'ms ';
        const esing = this.properties.animationTimingFunction;
        return 'opacity '+ duration + esing + ', transform '+ duration + esing;
    }

    @HostBinding('style.transform') hostTransform: string;
    @HostBinding('style.z-index') 
    get hostZIndex(){
        return this.properties.zIndex;
    }

    @HostBinding('style.width') 
    get hostWidth(){
        return this.properties.wrapperWidth;
    }
    @HostBinding('style.height') 
    get hostHeight(){
        return this.properties.wrapperHeight;
    }

    @HostBinding('style.position') 
    get hostPosition(){
        return this.properties.position;
    }

    @HostBinding('class.overlay-shown') hostShown: boolean;

    @HostListener('document:click', ['$event'])
    onClick(event){
        if (!this.elementRef.nativeElement.contains(event.target)) {
            if (this.hostShown){
                this.closeOverlay();
            }
        }
    }

    @HostListener('transitionend', ['$event'])
    transitionEnd(event) {
        if (event.target.tagName.toLowerCase() != "overlay"){
            return;
        }

        if (event.propertyName != "opacity") {
            return;
        }

        if (this.hostShown) {
            this.closeOverlayEnd();
            //this.stateEvents.emit("shown");
        } else {
            this.hostShown = true;
            //this.stateEvents.emit("hidden");
        }
    }

    get popoverClass(){
        if (this.properties.metadata){
            return this.properties.metadata.popoverClass;
        }
    }

    constructor(
        private componentFactoryResolver: ComponentFactoryResolver,
        public elementRef: ElementRef,
        private eventService: EventService) {
        this.globalEventsSubscription = this.eventService.emitter.subscribe(
            (event) => {
                this.handleGlobalEvents(event);
            }
        );
    }

    ngOnInit() {
        this.loadComponent();
        this.initialOverlay();

        setTimeout(() => {
            this.isInitial = true;
        }, this.minTimeout); // Note: not good
    }

    ngAfterViewInit() {
        setTimeout(() => {
            this.showOverlayAnimation();
        }, this.minTimeout);
    }

    ngOnDestroy() {
        if (this.globalEventsSubscription) {
            this.globalEventsSubscription.unsubscribe();
        }
    }

    initialOverlay(){
        this.hostTransform = 'translateY('+this.properties.animationTranslateY+')';
    }

    showOverlayAnimation(){
        this.hostOpacity = 1;
        this.hostTransform = 'translateY(0px)';
    }

    loadComponent() {
        let adItem = this.properties;
        let componentFactory = this.componentFactoryResolver.resolveComponentFactory(adItem.mainComponent);
        let viewContainerRef = this.adHost.viewContainerRef;

        viewContainerRef.clear();

        let componentRef = viewContainerRef.createComponent(componentFactory);
        let componentRefElement = (<ComponentProperties>componentRef.location).nativeElement;

        // Set styles
        componentRefElement.style.width = this.properties.width;
        componentRefElement.style.height = this.properties.height;

        // Set classes
        if (typeof this.popoverClass === 'string') {
            componentRefElement.classList.add(this.popoverClass);
        }
        if (typeof this.popoverClass === 'object') {
            this.popoverClass.forEach(function(className) {
                componentRefElement.classList.add(className);
            }); 
        }

        // Pass properties
        (<ComponentProperties>componentRef.instance).overlayProperties = this.properties;
    }

    closeOverlay(){
        this.hostOpacity = 0;
        this.hostTransform = 'translateY('+this.properties.animationTranslateY+')';
    }

    closeOverlayEnd() {
        this.hostShown = false;
        this.eventService.emitChangeEvent({
            type: '[Overlay] Hide'
        });
    }

    handleGlobalEvents(event){
        if (event.type === 'Hide'){
            this.closeOverlay();
        }
    }
}
