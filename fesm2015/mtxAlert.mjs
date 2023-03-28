import * as i0 from '@angular/core';
import { EventEmitter, Component, ViewEncapsulation, ChangeDetectionStrategy, HostBinding, Input, Output, NgModule } from '@angular/core';
import * as i1 from '@angular/common';
import { CommonModule } from '@angular/common';
import { coerceBooleanProperty } from '@angular/cdk/coercion';

class MtxAlert {
    get _hostClassList() {
        return `mtx-alert-${this.type} mat-elevation-z${this.elevation}`;
    }
    /** Whether to display an inline close button. */
    get dismissible() {
        return this._dismissible;
    }
    set dismissible(value) {
        this._dismissible = coerceBooleanProperty(value);
    }
    constructor(_changeDetectorRef) {
        this._changeDetectorRef = _changeDetectorRef;
        /** The alert's type. Can be `default`, `info`, `success`, `warning` or `danger`. */
        this.type = 'default';
        this._dismissible = false;
        /** The alert's elevation (0~24). */
        this.elevation = 0;
        /** Event emitted when the alert closed. */
        this.closed = new EventEmitter();
    }
    _onClosed() {
        this._changeDetectorRef.markForCheck();
        this.closed.emit(this);
    }
}
/** @nocollapse */ MtxAlert.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MtxAlert, deps: [{ token: i0.ChangeDetectorRef }], target: i0.ɵɵFactoryTarget.Component });
/** @nocollapse */ MtxAlert.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.1", type: MtxAlert, selector: "mtx-alert", inputs: { type: "type", dismissible: "dismissible", elevation: "elevation" }, outputs: { closed: "closed" }, host: { attributes: { "role": "alert" }, properties: { "class.mtx-alert": "true", "class.mtx-alert-dismissible": "dismissible", "class": "this._hostClassList" } }, exportAs: ["mtxAlert"], ngImport: i0, template: "<ng-content></ng-content>\n<ng-template [ngIf]=\"dismissible\">\n  <button type=\"button\" class=\"mtx-alert-close\" aria-label=\"Close\" (click)=\"_onClosed()\">\n    <span aria-hidden=\"true\">&times;</span>\n  </button>\n</ng-template>\n", styles: [".mtx-alert{position:relative;display:block;padding:.75rem 1.25rem;margin-bottom:1rem;border:1px solid transparent;border-radius:.25rem}.mtx-alert-close{position:absolute;top:0;bottom:0;right:0;padding:0 1.25rem;font-size:1.5rem;line-height:1;color:inherit;opacity:.5;background-color:transparent;border:0;cursor:pointer}[dir=rtl] .mtx-alert-close{right:auto;left:0}.mtx-alert-close:hover{opacity:.75}.mtx-alert-dismissible{padding-right:4rem}\n"], dependencies: [{ kind: "directive", type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MtxAlert, decorators: [{
            type: Component,
            args: [{ selector: 'mtx-alert', exportAs: 'mtxAlert', host: {
                        '[class.mtx-alert]': 'true',
                        '[class.mtx-alert-dismissible]': 'dismissible',
                        'role': 'alert',
                    }, encapsulation: ViewEncapsulation.None, changeDetection: ChangeDetectionStrategy.OnPush, template: "<ng-content></ng-content>\n<ng-template [ngIf]=\"dismissible\">\n  <button type=\"button\" class=\"mtx-alert-close\" aria-label=\"Close\" (click)=\"_onClosed()\">\n    <span aria-hidden=\"true\">&times;</span>\n  </button>\n</ng-template>\n", styles: [".mtx-alert{position:relative;display:block;padding:.75rem 1.25rem;margin-bottom:1rem;border:1px solid transparent;border-radius:.25rem}.mtx-alert-close{position:absolute;top:0;bottom:0;right:0;padding:0 1.25rem;font-size:1.5rem;line-height:1;color:inherit;opacity:.5;background-color:transparent;border:0;cursor:pointer}[dir=rtl] .mtx-alert-close{right:auto;left:0}.mtx-alert-close:hover{opacity:.75}.mtx-alert-dismissible{padding-right:4rem}\n"] }]
        }], ctorParameters: function () { return [{ type: i0.ChangeDetectorRef }]; }, propDecorators: { _hostClassList: [{
                type: HostBinding,
                args: ['class']
            }], type: [{
                type: Input
            }], dismissible: [{
                type: Input
            }], elevation: [{
                type: Input
            }], closed: [{
                type: Output
            }] } });

class MtxAlertModule {
}
/** @nocollapse */ MtxAlertModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MtxAlertModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
/** @nocollapse */ MtxAlertModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "15.2.1", ngImport: i0, type: MtxAlertModule, declarations: [MtxAlert], imports: [CommonModule], exports: [MtxAlert] });
/** @nocollapse */ MtxAlertModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MtxAlertModule, imports: [CommonModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MtxAlertModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule],
                    exports: [MtxAlert],
                    declarations: [MtxAlert],
                }]
        }] });

/**
 * Generated bundle index. Do not edit.
 */

export { MtxAlert, MtxAlertModule };
//# sourceMappingURL=mtxAlert.mjs.map
