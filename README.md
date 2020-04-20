# Gallery for Angular

<img src="https://badgen.net/bundlephobia/min/angular-gallery" />

Responsive gallery for Angular with touch screen support.

Live demo can be found on [home page](http://ivylab.space/gallery).

## Installation

Install the npm package.
```
npm i angular-gallery
```
Import module:
```ts
import {IvyGalleryModule} from 'angular-gallery';

@NgModule({
    imports: [IvyGalleryModule]
})
```

## Usage
Build your list of thumbnails and open them in full size using the gallery, passing the index of the image as an argument.

```ts
import {Gallery} from 'angular-gallery';

constructor(private gallery: Gallery) {}

showGallery(index: number) {
    let prop = {
        images: [
            {path: 'path_to_image_full_image'},
            ...
        ],
        index
    };
    this.gallery.load(prop);
}
```
```html
<img src="path_to_thumbnail" (click)="showGallery(index)">
```

## Properties

```ts
index: number
// The index of the image in the array that will be displayed when the gallery is opened.

minSwipeDistance: number = 50
// Minimum distance for swipe.

transitionDuration: number = 400
// Animation duration.

transitionTimingFunction: 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'linear' = 'ease'
// Smooth animation function.

counter: boolean = false
// Show counter.

counterSeparator: string = " / "
// Counter separator.

arrows: boolean = true
// Arrows for image navigation.
```

## Browser support

IvyPinch supports the most recent two versions of all major browsers: Chrome (including Android 4.4-10), Firefox, Safari (including iOS 9-13), and Edge.