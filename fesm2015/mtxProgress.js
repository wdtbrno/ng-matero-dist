import { Component, ViewEncapsulation, ChangeDetectionStrategy, Input, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { coerceBooleanProperty } from '@angular/cdk/coercion';

class MtxProgressComponent {
    constructor() {
        /** The progress type */
        this.type = 'info';
        /** The progress value */
        this.value = 0;
        this._striped = false;
        this._animate = false;
    }
    /** Whether applies striped class */
    get striped() {
        return this._striped;
    }
    set striped(value) {
        this._striped = coerceBooleanProperty(value);
    }
    /** Whether applies animated class */
    get animate() {
        return this._animate;
    }
    set animate(value) {
        this._animate = coerceBooleanProperty(value);
    }
}
MtxProgressComponent.decorators = [
    { type: Component, args: [{
                selector: 'mtx-progress',
                exportAs: 'mtxProgress',
                host: {
                    'class': 'mtx-progress',
                    '[style.height]': 'height',
                    '[style.backgroundColor]': 'background',
                },
                template: "<div [class]=\"'mtx-progress-fill mtx-progress-fill-' + type\"\n     [ngClass]=\"{'mtx-progress-fill-striped': striped, 'mtx-progress-fill-animated': animate}\"\n     [ngStyle]=\"{ 'width.%': value, 'background-color': foreground }\"\n     role=\"progress-fill\">\n  <ng-content></ng-content>\n</div>\n",
                encapsulation: ViewEncapsulation.None,
                changeDetection: ChangeDetectionStrategy.OnPush,
                styles: [".mtx-progress{display:flex;height:1rem;margin:8px 0;overflow:hidden;font-size:.75rem;border-radius:.25rem}.mtx-progress-fill{display:flex;flex-direction:column;justify-content:center;text-align:center;transition:width .6s ease}.mtx-progress-fill-striped{background-image:linear-gradient(45deg,hsla(0,0%,100%,.15) 25%,transparent 0,transparent 50%,hsla(0,0%,100%,.15) 0,hsla(0,0%,100%,.15) 75%,transparent 0,transparent);background-size:1rem 1rem}.mtx-progress-fill-animated{-webkit-animation:mtx-progress-fill-stripes 1s linear infinite;animation:mtx-progress-fill-stripes 1s linear infinite}@media (prefers-reduced-motion:reduce){.mtx-progress-fill-animated{-webkit-animation:none;animation:none}}@-webkit-keyframes mtx-progress-fill-stripes{0%{background-position:1rem 0}to{background-position:0 0}}@keyframes mtx-progress-fill-stripes{0%{background-position:1rem 0}to{background-position:0 0}}"]
            },] }
];
MtxProgressComponent.propDecorators = {
    type: [{ type: Input }],
    value: [{ type: Input }],
    height: [{ type: Input }],
    color: [{ type: Input }],
    foreground: [{ type: Input }],
    background: [{ type: Input }],
    striped: [{ type: Input }],
    animate: [{ type: Input }]
};

class MtxProgressModule {
}
MtxProgressModule.decorators = [
    { type: NgModule, args: [{
                imports: [CommonModule],
                exports: [MtxProgressComponent],
                declarations: [MtxProgressComponent],
            },] }
];

/**
 * Generated bundle index. Do not edit.
 */

export { MtxProgressComponent, MtxProgressModule };
//# sourceMappingURL=mtxProgress.js.map
