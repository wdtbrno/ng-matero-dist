(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/common'), require('@angular/cdk/coercion')) :
    typeof define === 'function' && define.amd ? define('@ng-matero/extensions/alert', ['exports', '@angular/core', '@angular/common', '@angular/cdk/coercion'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory((global['ng-matero'] = global['ng-matero'] || {}, global['ng-matero'].extensions = global['ng-matero'].extensions || {}, global['ng-matero'].extensions.alert = {}), global.ng.core, global.ng.common, global.ng.cdk.coercion));
}(this, (function (exports, core, common, coercion) { 'use strict';

    var MtxAlertComponent = /** @class */ (function () {
        function MtxAlertComponent(_changeDetectorRef) {
            this._changeDetectorRef = _changeDetectorRef;
            /** The alert type */
            this.type = 'default';
            this._dismissible = false;
            /** Material elevation */
            this.elevation = 0;
            /** This event fires when alert closed, $event is an instance of Alert component */
            this.closed = new core.EventEmitter();
        }
        Object.defineProperty(MtxAlertComponent.prototype, "hostClassList", {
            get: function () {
                return "mtx-alert-" + this.type + " mat-elevation-z" + this.elevation;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MtxAlertComponent.prototype, "dismissible", {
            /** Whether displays an inline `Close` button */
            get: function () {
                return this._dismissible;
            },
            set: function (value) {
                this._dismissible = coercion.coerceBooleanProperty(value);
            },
            enumerable: false,
            configurable: true
        });
        MtxAlertComponent.prototype._onClosed = function () {
            this._changeDetectorRef.markForCheck();
            this.closed.emit(this);
        };
        return MtxAlertComponent;
    }());
    MtxAlertComponent.decorators = [
        { type: core.Component, args: [{
                    selector: 'mtx-alert',
                    exportAs: 'mtxAlert',
                    host: {
                        '[class.mtx-alert]': 'true',
                        '[class.mtx-alert-dismissible]': 'dismissible',
                        'role': 'alert',
                    },
                    template: "<ng-content></ng-content>\n<ng-template [ngIf]=\"dismissible\">\n  <button type=\"button\" class=\"mtx-alert-close\" aria-label=\"Close\" (click)=\"_onClosed()\">\n    <span aria-hidden=\"true\">&times;</span>\n  </button>\n</ng-template>\n",
                    encapsulation: core.ViewEncapsulation.None,
                    changeDetection: core.ChangeDetectionStrategy.OnPush,
                    styles: [".mtx-alert{position:relative;display:block;padding:.75rem 1.25rem;margin-bottom:1rem;border:1px solid transparent;border-radius:.25rem}.mtx-alert-close{position:absolute;top:0;bottom:0;right:0;padding:0 1.25rem;font-size:1.5rem;line-height:1;color:inherit;opacity:.5;background-color:transparent;border:0;cursor:pointer}[dir=rtl] .mtx-alert-close{right:auto;left:0}.mtx-alert-close:hover{opacity:.75}.mtx-alert-dismissible{padding-right:4rem}"]
                },] }
    ];
    /** @nocollapse */
    MtxAlertComponent.ctorParameters = function () { return [
        { type: core.ChangeDetectorRef }
    ]; };
    MtxAlertComponent.propDecorators = {
        hostClassList: [{ type: core.HostBinding, args: ['class',] }],
        type: [{ type: core.Input }],
        dismissible: [{ type: core.Input }],
        color: [{ type: core.Input }],
        elevation: [{ type: core.Input }],
        closed: [{ type: core.Output }]
    };

    var MtxAlertModule = /** @class */ (function () {
        function MtxAlertModule() {
        }
        return MtxAlertModule;
    }());
    MtxAlertModule.decorators = [
        { type: core.NgModule, args: [{
                    imports: [common.CommonModule],
                    exports: [MtxAlertComponent],
                    declarations: [MtxAlertComponent],
                },] }
    ];

    /**
     * Generated bundle index. Do not edit.
     */

    exports.MtxAlertComponent = MtxAlertComponent;
    exports.MtxAlertModule = MtxAlertModule;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=mtxAlert.umd.js.map
