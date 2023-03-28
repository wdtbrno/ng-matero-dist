import * as i0 from '@angular/core';
import { Component, ViewEncapsulation, ChangeDetectionStrategy, Input, NgModule } from '@angular/core';
import * as i1 from '@angular/common';
import { CommonModule } from '@angular/common';
import { coerceBooleanProperty } from '@angular/cdk/coercion';

class MtxProgress {
    constructor() {
        /** The progress's type. Can be `default`, `info`, `success`, `warning` or `danger`. */
        this.type = 'info';
        /** The value of the progress. */
        this.value = 0;
        this._striped = false;
        this._animate = false;
    }
    /** Whether to apply the striped class. */
    get striped() {
        return this._striped;
    }
    set striped(value) {
        this._striped = coerceBooleanProperty(value);
    }
    /** Whether to apply the animated class. */
    get animate() {
        return this._animate;
    }
    set animate(value) {
        this._animate = coerceBooleanProperty(value);
    }
}
/** @nocollapse */ MtxProgress.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MtxProgress, deps: [], target: i0.ɵɵFactoryTarget.Component });
/** @nocollapse */ MtxProgress.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.1", type: MtxProgress, selector: "mtx-progress", inputs: { type: "type", value: "value", height: "height", color: "color", foreground: "foreground", background: "background", striped: "striped", animate: "animate" }, host: { properties: { "style.height": "height", "style.backgroundColor": "background" }, classAttribute: "mtx-progress" }, exportAs: ["mtxProgress"], ngImport: i0, template: "<div [class]=\"'mtx-progress-fill mtx-progress-fill-' + type\"\n     [ngClass]=\"{'mtx-progress-fill-striped': striped, 'mtx-progress-fill-animated': animate}\"\n     [ngStyle]=\"{ 'width.%': value, 'background-color': foreground }\"\n     role=\"progress-fill\">\n  <ng-content></ng-content>\n</div>\n", styles: [".mtx-progress{display:flex;height:1rem;margin:8px 0;overflow:hidden;font-size:.75rem;border-radius:.25rem}.mtx-progress-fill{display:flex;flex-direction:column;justify-content:center;text-align:center;transition:width .6s ease}.mtx-progress-fill-striped{background-image:linear-gradient(45deg,rgba(255,255,255,.15) 25%,transparent 25%,transparent 50%,rgba(255,255,255,.15) 50%,rgba(255,255,255,.15) 75%,transparent 75%,transparent);background-size:1rem 1rem}.mtx-progress-fill-animated{animation:mtx-progress-fill-stripes 1s linear infinite}@media (prefers-reduced-motion: reduce){.mtx-progress-fill-animated{animation:none}}@keyframes mtx-progress-fill-stripes{0%{background-position:1rem 0}to{background-position:0 0}}\n"], dependencies: [{ kind: "directive", type: i1.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i1.NgStyle, selector: "[ngStyle]", inputs: ["ngStyle"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MtxProgress, decorators: [{
            type: Component,
            args: [{ selector: 'mtx-progress', exportAs: 'mtxProgress', host: {
                        'class': 'mtx-progress',
                        '[style.height]': 'height',
                        '[style.backgroundColor]': 'background',
                    }, encapsulation: ViewEncapsulation.None, changeDetection: ChangeDetectionStrategy.OnPush, template: "<div [class]=\"'mtx-progress-fill mtx-progress-fill-' + type\"\n     [ngClass]=\"{'mtx-progress-fill-striped': striped, 'mtx-progress-fill-animated': animate}\"\n     [ngStyle]=\"{ 'width.%': value, 'background-color': foreground }\"\n     role=\"progress-fill\">\n  <ng-content></ng-content>\n</div>\n", styles: [".mtx-progress{display:flex;height:1rem;margin:8px 0;overflow:hidden;font-size:.75rem;border-radius:.25rem}.mtx-progress-fill{display:flex;flex-direction:column;justify-content:center;text-align:center;transition:width .6s ease}.mtx-progress-fill-striped{background-image:linear-gradient(45deg,rgba(255,255,255,.15) 25%,transparent 25%,transparent 50%,rgba(255,255,255,.15) 50%,rgba(255,255,255,.15) 75%,transparent 75%,transparent);background-size:1rem 1rem}.mtx-progress-fill-animated{animation:mtx-progress-fill-stripes 1s linear infinite}@media (prefers-reduced-motion: reduce){.mtx-progress-fill-animated{animation:none}}@keyframes mtx-progress-fill-stripes{0%{background-position:1rem 0}to{background-position:0 0}}\n"] }]
        }], propDecorators: { type: [{
                type: Input
            }], value: [{
                type: Input
            }], height: [{
                type: Input
            }], color: [{
                type: Input
            }], foreground: [{
                type: Input
            }], background: [{
                type: Input
            }], striped: [{
                type: Input
            }], animate: [{
                type: Input
            }] } });

class MtxProgressModule {
}
/** @nocollapse */ MtxProgressModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MtxProgressModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
/** @nocollapse */ MtxProgressModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "15.2.1", ngImport: i0, type: MtxProgressModule, declarations: [MtxProgress], imports: [CommonModule], exports: [MtxProgress] });
/** @nocollapse */ MtxProgressModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MtxProgressModule, imports: [CommonModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MtxProgressModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule],
                    exports: [MtxProgress],
                    declarations: [MtxProgress],
                }]
        }] });

/**
 * Generated bundle index. Do not edit.
 */

export { MtxProgress, MtxProgressModule };
//# sourceMappingURL=mtxProgress.mjs.map
