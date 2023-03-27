(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/common'), require('rxjs')) :
    typeof define === 'function' && define.amd ? define('@ng-matero/extensions/utils', ['exports', '@angular/core', '@angular/common', 'rxjs'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory((global['ng-matero'] = global['ng-matero'] || {}, global['ng-matero'].extensions = global['ng-matero'].extensions || {}, global['ng-matero'].extensions.utils = {}), global.ng.core, global.ng.common, global.rxjs));
}(this, (function (exports, core, common, rxjs) { 'use strict';

    var MtxToObservablePipe = /** @class */ (function () {
        function MtxToObservablePipe() {
        }
        MtxToObservablePipe.prototype.transform = function (value) {
            return rxjs.isObservable(value) ? value : rxjs.of(value);
        };
        return MtxToObservablePipe;
    }());
    MtxToObservablePipe.decorators = [
        { type: core.Pipe, args: [{ name: 'toObservable' },] }
    ];

    var MtxUtilsModule = /** @class */ (function () {
        function MtxUtilsModule() {
        }
        return MtxUtilsModule;
    }());
    MtxUtilsModule.decorators = [
        { type: core.NgModule, args: [{
                    imports: [common.CommonModule],
                    exports: [MtxToObservablePipe],
                    declarations: [MtxToObservablePipe],
                },] }
    ];

    /**
     * Generated bundle index. Do not edit.
     */

    exports.MtxToObservablePipe = MtxToObservablePipe;
    exports.MtxUtilsModule = MtxUtilsModule;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=mtxUtils.umd.js.map
