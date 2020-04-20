export interface ContainerProperties {
    properties: any;
    overlayBackdrop?: boolean;
}

export interface OverlayProperties {
    id?: string;
    //component: any;
    mainComponent?: any;
    childComponent?: any;
    width?: string;
    height?: string;
    maxWidth?: string;
    maxHeight?: string;
    wrapperWidth?: string;
    wrapperHeight?: string;
    position?: 'absolute' | 'fixed';
    left?: string;
    top?: string;
    right?: string;
    bottom?: string;
    zIndex?: number;
    title?: string;
    overlayBackdrop?: boolean;
    backdropClass?: string | { [key: string]: any; };
    overlayClass?: string | { [key: string]: any; };
    animationDuration?: number;
    animationTimingFunction?: string;
    animationTranslateY?: string;
    fadeIn?: boolean;
    data?: any;
    metadata?: any;
}

export interface ComponentProperties {
    overlayProperties: any;
    overlayData?: any;
    nativeElement?: any;
}