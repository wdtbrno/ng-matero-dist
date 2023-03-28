import * as i0 from '@angular/core';
import { Component, ViewEncapsulation, ChangeDetectionStrategy, Input, NgModule } from '@angular/core';
import * as i1 from '@angular/common';
import { CommonModule } from '@angular/common';
import * as i3 from '@angular/material/progress-bar';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import * as i2 from '@angular/material/progress-spinner';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { coerceBooleanProperty } from '@angular/cdk/coercion';

class MtxLoader {
    /** Whether the loader is loading. */
    get loading() {
        return this._loading;
    }
    set loading(value) {
        this._loading = coerceBooleanProperty(value);
    }
    /** Whether the loader has a backdrop. */
    get hasBackdrop() {
        return this._hasBackdrop;
    }
    set hasBackdrop(value) {
        this._hasBackdrop = coerceBooleanProperty(value);
    }
    constructor(_changeDetectorRef) {
        this._changeDetectorRef = _changeDetectorRef;
        /** The loader's type. Can be `spinner` or `progressbar` */
        this.type = 'spinner';
        /** Theme color palette for the component. */
        this.color = 'primary';
        /** Mode of the progress circle or the progress bar. */
        this.mode = 'indeterminate';
        /** Stroke width of the spinner loader. */
        this.strokeWidth = 4;
        /** The diameter of the spinner loader (will set width and height of svg). */
        this.diameter = 48;
        /** Buffer value of the progressbar loader. */
        this.bufferValue = 0;
        /** Value of the progress circle or the progress bar. */
        this.value = 0;
        this._loading = true;
        this._hasBackdrop = true;
    }
}
/** @nocollapse */ MtxLoader.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MtxLoader, deps: [{ token: i0.ChangeDetectorRef }], target: i0.ɵɵFactoryTarget.Component });
/** @nocollapse */ MtxLoader.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.1", type: MtxLoader, selector: "mtx-loader", inputs: { type: "type", color: "color", mode: "mode", strokeWidth: "strokeWidth", diameter: "diameter", bufferValue: "bufferValue", value: "value", loading: "loading", hasBackdrop: "hasBackdrop" }, host: { properties: { "class.mtx-loader-loading": "loading" }, classAttribute: "mtx-loader" }, exportAs: ["mtxLoader"], ngImport: i0, template: "<div class=\"mtx-loader-backdrop\" *ngIf=\"loading && hasBackdrop\"></div>\r\n<div class=\"mtx-loader-main\" *ngIf=\"loading\">\r\n  <mat-spinner *ngIf=\"type==='spinner'\"\r\n               [color]=\"color\"\r\n               [strokeWidth]=\"strokeWidth\"\r\n               [diameter]=\"diameter\"\r\n               [mode]=\"$any(mode)\"\r\n               [value]=\"value\">\r\n  </mat-spinner>\r\n\r\n  <mat-progress-bar *ngIf=\"type==='progressbar'\"\r\n                    [color]=\"color\"\r\n                    [mode]=\"$any(mode)\"\r\n                    [value]=\"value\"\r\n                    [bufferValue]=\"bufferValue\">\r\n  </mat-progress-bar>\r\n</div>\r\n<ng-content></ng-content>\r\n", styles: [".mtx-loader{position:relative;display:block;width:100%;height:100%}.mtx-loader-main{position:absolute;top:0;left:0;z-index:2;display:flex;justify-content:center;align-items:center;width:100%;height:100%}.mtx-loader-main .mat-mdc-spinner{position:relative}.mtx-loader-main .mat-mdc-progress-bar{position:absolute;top:0;left:0;width:100%}.mtx-loader-backdrop{display:block;position:absolute;top:0;left:0;z-index:1;width:100%;height:100%;content:\"\"}\n"], dependencies: [{ kind: "directive", type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "component", type: i2.MatProgressSpinner, selector: "mat-progress-spinner, mat-spinner", inputs: ["color", "mode", "value", "diameter", "strokeWidth"], exportAs: ["matProgressSpinner"] }, { kind: "component", type: i3.MatProgressBar, selector: "mat-progress-bar", inputs: ["color", "value", "bufferValue", "mode"], outputs: ["animationEnd"], exportAs: ["matProgressBar"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MtxLoader, decorators: [{
            type: Component,
            args: [{ selector: 'mtx-loader', exportAs: 'mtxLoader', host: {
                        'class': 'mtx-loader',
                        '[class.mtx-loader-loading]': 'loading',
                    }, encapsulation: ViewEncapsulation.None, changeDetection: ChangeDetectionStrategy.OnPush, template: "<div class=\"mtx-loader-backdrop\" *ngIf=\"loading && hasBackdrop\"></div>\r\n<div class=\"mtx-loader-main\" *ngIf=\"loading\">\r\n  <mat-spinner *ngIf=\"type==='spinner'\"\r\n               [color]=\"color\"\r\n               [strokeWidth]=\"strokeWidth\"\r\n               [diameter]=\"diameter\"\r\n               [mode]=\"$any(mode)\"\r\n               [value]=\"value\">\r\n  </mat-spinner>\r\n\r\n  <mat-progress-bar *ngIf=\"type==='progressbar'\"\r\n                    [color]=\"color\"\r\n                    [mode]=\"$any(mode)\"\r\n                    [value]=\"value\"\r\n                    [bufferValue]=\"bufferValue\">\r\n  </mat-progress-bar>\r\n</div>\r\n<ng-content></ng-content>\r\n", styles: [".mtx-loader{position:relative;display:block;width:100%;height:100%}.mtx-loader-main{position:absolute;top:0;left:0;z-index:2;display:flex;justify-content:center;align-items:center;width:100%;height:100%}.mtx-loader-main .mat-mdc-spinner{position:relative}.mtx-loader-main .mat-mdc-progress-bar{position:absolute;top:0;left:0;width:100%}.mtx-loader-backdrop{display:block;position:absolute;top:0;left:0;z-index:1;width:100%;height:100%;content:\"\"}\n"] }]
        }], ctorParameters: function () { return [{ type: i0.ChangeDetectorRef }]; }, propDecorators: { type: [{
                type: Input
            }], color: [{
                type: Input
            }], mode: [{
                type: Input
            }], strokeWidth: [{
                type: Input
            }], diameter: [{
                type: Input
            }], bufferValue: [{
                type: Input
            }], value: [{
                type: Input
            }], loading: [{
                type: Input
            }], hasBackdrop: [{
                type: Input
            }] } });

class MtxLoaderModule {
}
/** @nocollapse */ MtxLoaderModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MtxLoaderModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
/** @nocollapse */ MtxLoaderModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "15.2.1", ngImport: i0, type: MtxLoaderModule, declarations: [MtxLoader], imports: [CommonModule, MatProgressSpinnerModule, MatProgressBarModule], exports: [MtxLoader] });
/** @nocollapse */ MtxLoaderModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MtxLoaderModule, imports: [CommonModule, MatProgressSpinnerModule, MatProgressBarModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MtxLoaderModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, MatProgressSpinnerModule, MatProgressBarModule],
                    exports: [MtxLoader],
                    declarations: [MtxLoader],
                }]
        }] });

/**
 * Generated bundle index. Do not edit.
 */

export { MtxLoader, MtxLoaderModule };
//# sourceMappingURL=mtxLoader.mjs.map
