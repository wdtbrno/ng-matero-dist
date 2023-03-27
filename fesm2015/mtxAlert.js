import { EventEmitter, Component, ViewEncapsulation, ChangeDetectionStrategy, ChangeDetectorRef, HostBinding, Input, Output, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { coerceBooleanProperty } from '@angular/cdk/coercion';

class MtxAlertComponent {
    constructor(_changeDetectorRef) {
        this._changeDetectorRef = _changeDetectorRef;
        /** The alert type */
        this.type = 'default';
        this._dismissible = false;
        /** Material elevation */
        this.elevation = 0;
        /** This event fires when alert closed, $event is an instance of Alert component */
        this.closed = new EventEmitter();
    }
    get hostClassList() {
        return `mtx-alert-${this.type} mat-elevation-z${this.elevation}`;
    }
    /** Whether displays an inline `Close` button */
    get dismissible() {
        return this._dismissible;
    }
    set dismissible(value) {
        this._dismissible = coerceBooleanProperty(value);
    }
    _onClosed() {
        this._changeDetectorRef.markForCheck();
        this.closed.emit(this);
    }
}
MtxAlertComponent.decorators = [
    { type: Component, args: [{
                selector: 'mtx-alert',
                exportAs: 'mtxAlert',
                host: {
                    '[class.mtx-alert]': 'true',
                    '[class.mtx-alert-dismissible]': 'dismissible',
                    'role': 'alert',
                },
                template: "<ng-content></ng-content>\n<ng-template [ngIf]=\"dismissible\">\n  <button type=\"button\" class=\"mtx-alert-close\" aria-label=\"Close\" (click)=\"_onClosed()\">\n    <span aria-hidden=\"true\">&times;</span>\n  </button>\n</ng-template>\n",
                encapsulation: ViewEncapsulation.None,
                changeDetection: ChangeDetectionStrategy.OnPush,
                styles: [".mtx-alert{position:relative;display:block;padding:.75rem 1.25rem;margin-bottom:1rem;border:1px solid transparent;border-radius:.25rem}.mtx-alert-close{position:absolute;top:0;bottom:0;right:0;padding:0 1.25rem;font-size:1.5rem;line-height:1;color:inherit;opacity:.5;background-color:transparent;border:0;cursor:pointer}[dir=rtl] .mtx-alert-close{right:auto;left:0}.mtx-alert-close:hover{opacity:.75}.mtx-alert-dismissible{padding-right:4rem}"]
            },] }
];
/** @nocollapse */
MtxAlertComponent.ctorParameters = () => [
    { type: ChangeDetectorRef }
];
MtxAlertComponent.propDecorators = {
    hostClassList: [{ type: HostBinding, args: ['class',] }],
    type: [{ type: Input }],
    dismissible: [{ type: Input }],
    color: [{ type: Input }],
    elevation: [{ type: Input }],
    closed: [{ type: Output }]
};

class MtxAlertModule {
}
MtxAlertModule.decorators = [
    { type: NgModule, args: [{
                imports: [CommonModule],
                exports: [MtxAlertComponent],
                declarations: [MtxAlertComponent],
            },] }
];

/**
 * Generated bundle index. Do not edit.
 */

export { MtxAlertComponent, MtxAlertModule };
//# sourceMappingURL=mtxAlert.js.map
