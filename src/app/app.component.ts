import { Component } from '@angular/core';

import { Gallery } from './gallery/gallery.service';
import { CarouselComponent } from './gallery/carousel.component';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.sass']
})
export class AppComponent {

    constructor(public gallery: Gallery) {}

    showGallery(index: number = 0) {
        let prop: any = {};
        prop.component = CarouselComponent;
        prop.images = [
            {path: '/assets/photo-1547691889-841a6f1c5ca6.jpg'},
            {path: '/assets/photo-1548625149-9129dad5eef7.jpg'},
            {path: '/assets/photo-1548625149-d37da68f9a7f.jpg'},
            {path: '/assets/photo-1487819162750-4a48cfbf83b0.jpg'},
            {path: '/assets/photo-1489365091240-6a18fc761ec2.jpg'}
        ];
        prop.index = index;
        this.gallery.load(prop);
    }

    closeGallery() {
        this.gallery.close();
    }
}
