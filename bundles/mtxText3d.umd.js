(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/common')) :
    typeof define === 'function' && define.amd ? define('@ng-matero/extensions/text3d', ['exports', '@angular/core', '@angular/common'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory((global['ng-matero'] = global['ng-matero'] || {}, global['ng-matero'].extensions = global['ng-matero'].extensions || {}, global['ng-matero'].extensions.text3d = {}), global.ng.core, global.ng.common));
}(this, (function (exports, core, common) { 'use strict';

    var MtxText3dComponent = /** @class */ (function () {
        function MtxText3dComponent() {
            this.text = '';
            this.depth = 20;
            this.rotateX = 60;
            this.rotateY = 0;
            this.rotateZ = 0;
        }
        Object.defineProperty(MtxText3dComponent.prototype, "transform", {
            get: function () {
                return "rotateX(" + this.rotateX + "deg) rotateY(" + this.rotateY + "deg) rotateZ(" + this.rotateZ + "deg)";
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MtxText3dComponent.prototype, "depthArr", {
            get: function () {
                var tmpArr = [];
                for (var i = 1; i <= this.depth; i++) {
                    tmpArr.push(i);
                }
                return tmpArr;
            },
            enumerable: false,
            configurable: true
        });
        return MtxText3dComponent;
    }());
    MtxText3dComponent.decorators = [
        { type: core.Component, args: [{
                    selector: 'mtx-text3d',
                    exportAs: 'mtxText3d',
                    host: {
                        'class': 'mtx-text3d',
                        '[style.transform]': 'transform',
                    },
                    template: "<span class=\"mtx-text3d-layer\" *ngFor=\"let i of depthArr\"\n      [ngStyle]=\"{'z-index': -i, 'transform': 'translate3d(0, 0,'+ -i + 'px)'}\">\n  {{text}}\n  <ng-container [ngTemplateOutlet]=\"template\"></ng-container>\n</span>\n",
                    encapsulation: core.ViewEncapsulation.None,
                    changeDetection: core.ChangeDetectionStrategy.OnPush,
                    styles: [".mtx-text3d{display:block;transform-style:preserve-3d;-webkit-animation:rotate 5s ease infinite;animation:rotate 5s ease infinite;font-weight:700}.mtx-text3d .mtx-text3d-layer{display:block;text-align:center;font-size:10rem}.mtx-text3d .mtx-text3d-layer:not(:first-child){position:absolute;top:0;left:0;right:0;margin:auto;transform-style:preserve-3d}"]
                },] }
    ];
    /** @nocollapse */
    MtxText3dComponent.ctorParameters = function () { return []; };
    MtxText3dComponent.propDecorators = {
        template: [{ type: core.ContentChild, args: [core.TemplateRef, { static: false },] }],
        text: [{ type: core.Input }],
        depth: [{ type: core.Input }],
        rotateX: [{ type: core.Input }],
        rotateY: [{ type: core.Input }],
        rotateZ: [{ type: core.Input }]
    };

    var MtxText3dModule = /** @class */ (function () {
        function MtxText3dModule() {
        }
        return MtxText3dModule;
    }());
    MtxText3dModule.decorators = [
        { type: core.NgModule, args: [{
                    imports: [common.CommonModule],
                    exports: [MtxText3dComponent],
                    declarations: [MtxText3dComponent],
                },] }
    ];

    /**
     * Generated bundle index. Do not edit.
     */

    exports.MtxText3dComponent = MtxText3dComponent;
    exports.MtxText3dModule = MtxText3dModule;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=mtxText3d.umd.js.map
