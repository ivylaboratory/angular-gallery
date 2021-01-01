import {ChangeDetectorRef, Component, ElementRef, EventEmitter, HostBinding, HostListener, Input, Output, OnDestroy, SimpleChanges} from '@angular/core';

import {Images} from './interfaces';
import {Touches} from './touches';
import {Carousel} from './carousel';
import {OverlayProperties} from './overlay/interfaces';
import {EventService as OverlayEventService} from './overlay/event.service'; 


@Component({
	selector: 'gallery-carousel, [gallery-carousel]',
    exportAs: 'gallery-carousel',
	templateUrl: './gallery-carousel.component.html',
    styleUrls: ['./gallery-carousel.component.sass']
})

export class GalleryCarouselComponent implements OnDestroy {
    _id: string;
    _images: Images;
    touches: any;
    carousel: any;
    landscapeMode: any;
    minTimeout = 30;
    isVideoPlaying: boolean;
    _isCounter: boolean;
    _width: number;
    _cellWidth: number | '100%' = 200;
    isMoving: boolean;
    _properties: OverlayProperties;
    _transitionDuration: number = 200;

    get isLandscape(){
        return window.innerWidth > window.innerHeight;
    }

    get isSafari(): any {
        const ua = navigator.userAgent.toLowerCase();
        if (ua.indexOf('safari') !== -1) {
            return !(ua.indexOf('chrome') > -1);
        }
    }

    get counter() {
        return this.carousel.slideCounter + 1 + this.counterSeparator + this.images.length;
    }

    @Input()
    set images(images: Images & any) {
        this._images = images;
    }
    get images(){
        return this._images;
    }

    get isNgContent(){
        return this.elementRef.nativeElement.querySelector('.carousel-content-wrapper').children.length > 0;
    }

    @Output() events: EventEmitter<any> = new EventEmitter<any>();

    @Input() height: number = 200;
    @Input() width: number;
    @Input() borderRadius: number;
    @Input() margin: number = 10;
    @Input() objectFit: 'contain' | 'cover' | 'none' = 'cover';
    @Input() minSwipeDistance: number = 50;

    @Input()
    set transitionDuration(value: number) {
        this._transitionDuration = value;
    }
    get transitionDuration(){
        if (this._transitionDuration === 0) {
            return 1;
        } else {
            return this._transitionDuration;
        }
    }

    @Input() transitionTimingFunction: 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'linear' = 'ease';
    @Input() videoProperties: any;
    @Input() counterSeparator: string = " / ";
    @Input() overflowCellsLimit: number = 3;
    @Input() listeners: 'auto' | 'mouse and touch' = 'mouse and touch';

    @Input('cellWidth') set cellWidth(value: number | '100%') {
        if (value){
            this._cellWidth = value;
        }
    }

    @Input('counter') set isCounter(value: boolean) {
        if (value){
            this._isCounter = value;
        }
    }
    get isCounter() {
        return this._isCounter && this.images.length > 1;
    }

    @Input() arrows: boolean = true;
    @Input() arrowsOutside: boolean;
    @Input() arrowsTheme: 'light' | 'dark' = 'light';

    @Input() set overlayProperties (properties: OverlayProperties) {
        this._properties = properties;
        this._images = this._properties.metadata.images;
        this._cellWidth = this._properties.metadata.width;
        this.height = this._properties.metadata.height;
        this.width = this._properties.metadata.width;
        this.objectFit = this._properties.metadata.objectFit;
        this.margin = this._properties.metadata.margin;
        this.transitionDuration = this._properties.metadata.transitionDuration;
        this.overflowCellsLimit = this._properties.metadata.overflowCellsLimit;
        this.minSwipeDistance = this._properties.metadata.minSwipeDistance;
        this.transitionTimingFunction = this._properties.metadata.transitionTimingFunction;
        this._isCounter = this._properties.metadata.counter;
        this.counterSeparator = this._properties.metadata.counterSeparator;
        this.arrows = this._properties.metadata.arrows;
    }

    get properties() {
        return this._properties;
    }

    get cellLimit() {
        if (this.carousel) {
            return this.carousel.cellLimit;
        }
    }

    @HostBinding('class.carousel') hostClassCarousel: boolean = true;
    @HostBinding('style.height') hostStyleHeight: string;
    @HostBinding('style.width') hostStyleWidth: string;

    @HostListener('window:resize', ['$event'])
    onWindowResize(event: any) {
        this.landscapeMode = this.isLandscape;
        this.ref.detectChanges();

        this.initCarousel();
        this.carousel.lineUpCells();
    }

    constructor(
        private elementRef: ElementRef, 
        private ref: ChangeDetectorRef,
        private overlayEventService: OverlayEventService){
    }

    ngOnInit(){
        this.touches = new Touches({
            element: this.elementRef.nativeElement.querySelector('.carousel-cells'),
            listeners: this.listeners
        });

        this.touches.on('touchstart', this.handleTouchstart);
        this.touches.on('horizontal-swipe', this.handleHorizontalSwipe);
        this.touches.on('touchend', this.handleTouchend);
        this.touches.on('mousedown', this.handleTouchstart);
        this.touches.on('mouseup', this.handleTouchend);
        this.touches.on('tap', this.handleTap);

        this.initCarousel();
        this.setDimensions();
        this.setInitialIndex();
    }

    ngAfterViewInit() {
        this.carousel.lineUpCells();
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.width || changes.height) {
            this.setDimensions();
            this.initCarousel();
            this.carousel.lineUpCells();
        }
    }

    ngOnDestroy() {
        this.touches.destroy();
    }

    initCarousel() {
        this.carousel = new Carousel({
            element: this.elementRef.nativeElement.querySelector('.carousel-cells'),
            container: this.elementRef.nativeElement,
            images: this.images,
            cellWidth: this.getCellWidth(),
            overflowCellsLimit: this.overflowCellsLimit,
            visibleWidth: this.width,
            margin: this.margin,
            minSwipeDistance: this.minSwipeDistance,
            transitionDuration: this.transitionDuration,
            transitionTimingFunction: this.transitionTimingFunction,
            videoProperties: this.videoProperties
        });
    }

    setDimensions() {
        this.hostStyleHeight = this.height + 'px';
        this.hostStyleWidth = this.width + 'px';
    }

    getFile(index) {
        return this.carousel.getFile(index);
    }

    /* Touchstart */
    handleTouchstart = (event: any) => {
        event.preventDefault();
        this.carousel.handleTouchstart(event);
        this.isMoving = true;
        this.events.emit({
            type: 'touchstart',
            event
        });
    }

    /* Touchmove */
    handleHorizontalSwipe = (event: any) => {
        event.preventDefault();
        this.carousel.handleHorizontalSwipe(event);
        this.events.emit({
            type: 'swipe',
            event
        });
    }

    /* Touchend */
    handleTouchend = (event: any) => {
        const touches = event.touches;
        this.carousel.handleTouchend(event);
        this.isMoving = false;
        this.events.emit({
            type: 'touchend',
            event
        });
    }

    /* Tap */
    handleTap = (event: any) => {
        const i = this.carousel.slideCounter;
        const cellIndex = this.carousel.currentCellIndex;
        const fileIndex = this.carousel.getFileIndex(i);
        const file = this.carousel.getFile(cellIndex);

        this.events.emit({
            type: 'click',
            file: file,
            index: fileIndex
        });
    }

    handleTransitionendCellContainer(event) {
        this.carousel.handleSlideEnd();
    }

    toggleVideo(video) {
        event.preventDefault();
        if (this.videoProperties.noPlay) {
            return;
        }

        if (video.paused) {
            video.play();
            this.isVideoPlaying = true;
        } else {
            video.pause();
            this.isVideoPlaying = false;
        }

        this.ref.detectChanges();
    }

    getCurrentIndex() {
        return this.carousel.slideCounter;
    }

    getCellWidth(): number {
        if (this._cellWidth === '100%') {
            return this.elementRef.nativeElement.clientWidth;
        } else {
            return this._cellWidth;
        }
    }

    next() {
        this.carousel.next(1);
    }

    prev() {
        this.carousel.prev(1);
    }

    select(index: number) {
        this.carousel.select(index);
    }

    isNextArrowDisabled() {
        return this.carousel.isNextArrowDisabled();
    }

    isPrevArrowDisabled() {
        return this.carousel.isPrevArrowDisabled();
    }

    close() {
        this.overlayEventService.emitChangeEvent({
            type: 'Hide'
        });
    }

    setInitialIndex() {
        if (this._properties.metadata.index != undefined) {
            this.select(this._properties.metadata.index);
        }
    }
}