export interface Images {
    [index: number]: { 
    	path: string; 
    	width?: number; 
    	height?: number;
    	//type?: 'image' | 'video'
    };
}

export interface Image {
    path: string; 
    width?: number; 
    height?: number;
}

export interface GalleryProperties {
	minSwipeDistance?: number;
    transitionDuration?: number;
    transitionTimingFunction?: 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'linear';
    counter?: boolean;
    counterSeparator?: string;
    arrows?: boolean;
    index?: number;
    images: Images;
}