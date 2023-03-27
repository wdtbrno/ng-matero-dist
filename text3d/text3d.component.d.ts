import { TemplateRef } from '@angular/core';
export declare class MtxText3dComponent {
    template: TemplateRef<any>;
    text: string;
    depth: number;
    rotateX: number;
    rotateY: number;
    rotateZ: number;
    get transform(): string;
    get depthArr(): number[];
    constructor();
}
