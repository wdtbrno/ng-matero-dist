(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/common'), require('@angular/cdk/coercion')) :
    typeof define === 'function' && define.amd ? define('@ng-matero/extensions/progress', ['exports', '@angular/core', '@angular/common', '@angular/cdk/coercion'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory((global['ng-matero'] = global['ng-matero'] || {}, global['ng-matero'].extensions = global['ng-matero'].extensions || {}, global['ng-matero'].extensions.progress = {}), global.ng.core, global.ng.common, global.ng.cdk.coercion));
}(this, (function (exports, core, common, coercion) { 'use strict';

    var MtxProgressComponent = /** @class */ (function () {
        function MtxProgressComponent() {
            /** The progress type */
            this.type = 'info';
            /** The progress value */
            this.value = 0;
            this._striped = false;
            this._animate = false;
        }
        Object.defineProperty(MtxProgressComponent.prototype, "striped", {
            /** Whether applies striped class */
            get: function () {
                return this._striped;
            },
            set: function (value) {
                this._striped = coercion.coerceBooleanProperty(value);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MtxProgressComponent.prototype, "animate", {
            /** Whether applies animated class */
            get: function () {
                return this._animate;
            },
            set: function (value) {
                this._animate = coercion.coerceBooleanProperty(value);
            },
            enumerable: false,
            configurable: true
        });
        return MtxProgressComponent;
    }());
    MtxProgressComponent.decorators = [
        { type: core.Component, args: [{
                    selector: 'mtx-progress',
                    exportAs: 'mtxProgress',
                    host: {
                        'class': 'mtx-progress',
                        '[style.height]': 'height',
                        '[style.backgroundColor]': 'background',
                    },
                    template: "<div [class]=\"'mtx-progress-fill mtx-progress-fill-' + type\"\n     [ngClass]=\"{'mtx-progress-fill-striped': striped, 'mtx-progress-fill-animated': animate}\"\n     [ngStyle]=\"{ 'width.%': value, 'background-color': foreground }\"\n     role=\"progress-fill\">\n  <ng-content></ng-content>\n</div>\n",
                    encapsulation: core.ViewEncapsulation.None,
                    changeDetection: core.ChangeDetectionStrategy.OnPush,
                    styles: [".mtx-progress{display:flex;height:1rem;margin:8px 0;overflow:hidden;font-size:.75rem;border-radius:.25rem}.mtx-progress-fill{display:flex;flex-direction:column;justify-content:center;text-align:center;transition:width .6s ease}.mtx-progress-fill-striped{background-image:linear-gradient(45deg,hsla(0,0%,100%,.15) 25%,transparent 0,transparent 50%,hsla(0,0%,100%,.15) 0,hsla(0,0%,100%,.15) 75%,transparent 0,transparent);background-size:1rem 1rem}.mtx-progress-fill-animated{-webkit-animation:mtx-progress-fill-stripes 1s linear infinite;animation:mtx-progress-fill-stripes 1s linear infinite}@media (prefers-reduced-motion:reduce){.mtx-progress-fill-animated{-webkit-animation:none;animation:none}}@-webkit-keyframes mtx-progress-fill-stripes{0%{background-position:1rem 0}to{background-position:0 0}}@keyframes mtx-progress-fill-stripes{0%{background-position:1rem 0}to{background-position:0 0}}"]
                },] }
    ];
    MtxProgressComponent.propDecorators = {
        type: [{ type: core.Input }],
        value: [{ type: core.Input }],
        height: [{ type: core.Input }],
        color: [{ type: core.Input }],
        foreground: [{ type: core.Input }],
        background: [{ type: core.Input }],
        striped: [{ type: core.Input }],
        animate: [{ type: core.Input }]
    };

    var MtxProgressModule = /** @class */ (function () {
        function MtxProgressModule() {
        }
        return MtxProgressModule;
    }());
    MtxProgressModule.decorators = [
        { type: core.NgModule, args: [{
                    imports: [common.CommonModule],
                    exports: [MtxProgressComponent],
                    declarations: [MtxProgressComponent],
                },] }
    ];

    /**
     * Generated bundle index. Do not edit.
     */

    exports.MtxProgressComponent = MtxProgressComponent;
    exports.MtxProgressModule = MtxProgressModule;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=mtxProgress.umd.js.map
