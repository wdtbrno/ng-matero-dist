import { Component, ViewEncapsulation, ChangeDetectionStrategy, ContentChild, TemplateRef, Input, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

class MtxText3dComponent {
    constructor() {
        this.text = '';
        this.depth = 20;
        this.rotateX = 60;
        this.rotateY = 0;
        this.rotateZ = 0;
    }
    get transform() {
        return `rotateX(${this.rotateX}deg) rotateY(${this.rotateY}deg) rotateZ(${this.rotateZ}deg)`;
    }
    get depthArr() {
        const tmpArr = [];
        for (let i = 1; i <= this.depth; i++) {
            tmpArr.push(i);
        }
        return tmpArr;
    }
}
MtxText3dComponent.decorators = [
    { type: Component, args: [{
                selector: 'mtx-text3d',
                exportAs: 'mtxText3d',
                host: {
                    'class': 'mtx-text3d',
                    '[style.transform]': 'transform',
                },
                template: "<span class=\"mtx-text3d-layer\" *ngFor=\"let i of depthArr\"\n      [ngStyle]=\"{'z-index': -i, 'transform': 'translate3d(0, 0,'+ -i + 'px)'}\">\n  {{text}}\n  <ng-container [ngTemplateOutlet]=\"template\"></ng-container>\n</span>\n",
                encapsulation: ViewEncapsulation.None,
                changeDetection: ChangeDetectionStrategy.OnPush,
                styles: [".mtx-text3d{display:block;transform-style:preserve-3d;-webkit-animation:rotate 5s ease infinite;animation:rotate 5s ease infinite;font-weight:700}.mtx-text3d .mtx-text3d-layer{display:block;text-align:center;font-size:10rem}.mtx-text3d .mtx-text3d-layer:not(:first-child){position:absolute;top:0;left:0;right:0;margin:auto;transform-style:preserve-3d}"]
            },] }
];
/** @nocollapse */
MtxText3dComponent.ctorParameters = () => [];
MtxText3dComponent.propDecorators = {
    template: [{ type: ContentChild, args: [TemplateRef, { static: false },] }],
    text: [{ type: Input }],
    depth: [{ type: Input }],
    rotateX: [{ type: Input }],
    rotateY: [{ type: Input }],
    rotateZ: [{ type: Input }]
};

class MtxText3dModule {
}
MtxText3dModule.decorators = [
    { type: NgModule, args: [{
                imports: [CommonModule],
                exports: [MtxText3dComponent],
                declarations: [MtxText3dComponent],
            },] }
];

/**
 * Generated bundle index. Do not edit.
 */

export { MtxText3dComponent, MtxText3dModule };
//# sourceMappingURL=mtxText3d.js.map
