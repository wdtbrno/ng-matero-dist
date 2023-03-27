import { Component, ViewEncapsulation, ChangeDetectionStrategy, ChangeDetectorRef, Input, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { coerceBooleanProperty } from '@angular/cdk/coercion';

class MtxLoaderComponent {
    constructor(_changeDetectorRef) {
        this._changeDetectorRef = _changeDetectorRef;
        this.type = 'spinner';
        this.color = 'primary';
        this.mode = 'indeterminate';
        this.value = 0;
        this.strokeWidth = 4; // only support spinner
        this.diameter = 48; // only support spinner
        this.bufferValue = 0; // only support progresbar
        this._loading = true;
        this._hasBackdrop = true;
    }
    get loading() {
        return this._loading;
    }
    set loading(value) {
        this._loading = coerceBooleanProperty(value);
    }
    get hasBackdrop() {
        return this._hasBackdrop;
    }
    set hasBackdrop(value) {
        this._hasBackdrop = coerceBooleanProperty(value);
    }
}
MtxLoaderComponent.decorators = [
    { type: Component, args: [{
                selector: 'mtx-loader',
                exportAs: 'mtxLoader',
                host: {
                    'class': 'mtx-loader',
                    '[class.mtx-loader-loading]': 'loading',
                },
                template: "<div class=\"mtx-loader-backdrop\" *ngIf=\"loading && hasBackdrop\"></div>\r\n<div class=\"mtx-loader-main\" *ngIf=\"loading\">\r\n  <mat-spinner *ngIf=\"type==='spinner'\"\r\n               [color]=\"color\"\r\n               [strokeWidth]=\"strokeWidth\"\r\n               [diameter]=\"diameter\"\r\n               [mode]=\"$any(mode)\"\r\n               [value]=\"value\">\r\n  </mat-spinner>\r\n\r\n  <mat-progress-bar *ngIf=\"type==='progressbar'\"\r\n                    [color]=\"color\"\r\n                    [mode]=\"$any(mode)\"\r\n                    [value]=\"value\"\r\n                    [bufferValue]=\"bufferValue\">\r\n  </mat-progress-bar>\r\n</div>\r\n<ng-content></ng-content>\r\n",
                encapsulation: ViewEncapsulation.None,
                changeDetection: ChangeDetectionStrategy.OnPush,
                styles: [".mtx-loader{position:relative;display:block;width:100%;height:100%}.mtx-loader-main{position:absolute;top:0;left:0;z-index:2;display:flex;justify-content:center;align-items:center;width:100%;height:100%}.mtx-loader-main .mat-spinner{position:relative}.mtx-loader-backdrop,.mtx-loader-main .mat-progress-bar{position:absolute;top:0;left:0;width:100%}.mtx-loader-backdrop{display:block;z-index:1;height:100%;content:\"\"}"]
            },] }
];
/** @nocollapse */
MtxLoaderComponent.ctorParameters = () => [
    { type: ChangeDetectorRef }
];
MtxLoaderComponent.propDecorators = {
    type: [{ type: Input }],
    color: [{ type: Input }],
    mode: [{ type: Input }],
    value: [{ type: Input }],
    strokeWidth: [{ type: Input }],
    diameter: [{ type: Input }],
    bufferValue: [{ type: Input }],
    loading: [{ type: Input }],
    hasBackdrop: [{ type: Input }]
};

class MtxLoaderModule {
}
MtxLoaderModule.decorators = [
    { type: NgModule, args: [{
                imports: [CommonModule, MatProgressSpinnerModule, MatProgressBarModule],
                exports: [MtxLoaderComponent],
                declarations: [MtxLoaderComponent],
            },] }
];

/**
 * Generated bundle index. Do not edit.
 */

export { MtxLoaderComponent, MtxLoaderModule };
//# sourceMappingURL=mtxLoader.js.map
