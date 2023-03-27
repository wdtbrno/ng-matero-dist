(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/common'), require('@angular/material/progress-bar'), require('@angular/material/progress-spinner'), require('@angular/cdk/coercion')) :
    typeof define === 'function' && define.amd ? define('@ng-matero/extensions/loader', ['exports', '@angular/core', '@angular/common', '@angular/material/progress-bar', '@angular/material/progress-spinner', '@angular/cdk/coercion'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory((global['ng-matero'] = global['ng-matero'] || {}, global['ng-matero'].extensions = global['ng-matero'].extensions || {}, global['ng-matero'].extensions.loader = {}), global.ng.core, global.ng.common, global.ng.material.progressBar, global.ng.material.progressSpinner, global.ng.cdk.coercion));
}(this, (function (exports, core, common, progressBar, progressSpinner, coercion) { 'use strict';

    var MtxLoaderComponent = /** @class */ (function () {
        function MtxLoaderComponent(_changeDetectorRef) {
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
        Object.defineProperty(MtxLoaderComponent.prototype, "loading", {
            get: function () {
                return this._loading;
            },
            set: function (value) {
                this._loading = coercion.coerceBooleanProperty(value);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MtxLoaderComponent.prototype, "hasBackdrop", {
            get: function () {
                return this._hasBackdrop;
            },
            set: function (value) {
                this._hasBackdrop = coercion.coerceBooleanProperty(value);
            },
            enumerable: false,
            configurable: true
        });
        return MtxLoaderComponent;
    }());
    MtxLoaderComponent.decorators = [
        { type: core.Component, args: [{
                    selector: 'mtx-loader',
                    exportAs: 'mtxLoader',
                    host: {
                        'class': 'mtx-loader',
                        '[class.mtx-loader-loading]': 'loading',
                    },
                    template: "<div class=\"mtx-loader-backdrop\" *ngIf=\"loading && hasBackdrop\"></div>\r\n<div class=\"mtx-loader-main\" *ngIf=\"loading\">\r\n  <mat-spinner *ngIf=\"type==='spinner'\"\r\n               [color]=\"color\"\r\n               [strokeWidth]=\"strokeWidth\"\r\n               [diameter]=\"diameter\"\r\n               [mode]=\"$any(mode)\"\r\n               [value]=\"value\">\r\n  </mat-spinner>\r\n\r\n  <mat-progress-bar *ngIf=\"type==='progressbar'\"\r\n                    [color]=\"color\"\r\n                    [mode]=\"$any(mode)\"\r\n                    [value]=\"value\"\r\n                    [bufferValue]=\"bufferValue\">\r\n  </mat-progress-bar>\r\n</div>\r\n<ng-content></ng-content>\r\n",
                    encapsulation: core.ViewEncapsulation.None,
                    changeDetection: core.ChangeDetectionStrategy.OnPush,
                    styles: [".mtx-loader{position:relative;display:block;width:100%;height:100%}.mtx-loader-main{position:absolute;top:0;left:0;z-index:2;display:flex;justify-content:center;align-items:center;width:100%;height:100%}.mtx-loader-main .mat-spinner{position:relative}.mtx-loader-backdrop,.mtx-loader-main .mat-progress-bar{position:absolute;top:0;left:0;width:100%}.mtx-loader-backdrop{display:block;z-index:1;height:100%;content:\"\"}"]
                },] }
    ];
    /** @nocollapse */
    MtxLoaderComponent.ctorParameters = function () { return [
        { type: core.ChangeDetectorRef }
    ]; };
    MtxLoaderComponent.propDecorators = {
        type: [{ type: core.Input }],
        color: [{ type: core.Input }],
        mode: [{ type: core.Input }],
        value: [{ type: core.Input }],
        strokeWidth: [{ type: core.Input }],
        diameter: [{ type: core.Input }],
        bufferValue: [{ type: core.Input }],
        loading: [{ type: core.Input }],
        hasBackdrop: [{ type: core.Input }]
    };

    var MtxLoaderModule = /** @class */ (function () {
        function MtxLoaderModule() {
        }
        return MtxLoaderModule;
    }());
    MtxLoaderModule.decorators = [
        { type: core.NgModule, args: [{
                    imports: [common.CommonModule, progressSpinner.MatProgressSpinnerModule, progressBar.MatProgressBarModule],
                    exports: [MtxLoaderComponent],
                    declarations: [MtxLoaderComponent],
                },] }
    ];

    /**
     * Generated bundle index. Do not edit.
     */

    exports.MtxLoaderComponent = MtxLoaderComponent;
    exports.MtxLoaderModule = MtxLoaderModule;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=mtxLoader.umd.js.map
