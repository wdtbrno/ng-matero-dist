(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@ng-matero/extensions/alert'), require('@ng-matero/extensions/button'), require('@ng-matero/extensions/checkbox-group'), require('@ng-matero/extensions/color-picker'), require('@ng-matero/extensions/column-resize'), require('@ng-matero/extensions/data-grid'), require('@ng-matero/extensions/dialog'), require('@ng-matero/extensions/loader'), require('@ng-matero/extensions/popover'), require('@ng-matero/extensions/progress'), require('@ng-matero/extensions/select'), require('@ng-matero/extensions/split-pane'), require('@ng-matero/extensions/tooltip'), require('@ng-matero/extensions/form-group'), require('@ng-matero/extensions/text3d'), require('@angular/core')) :
    typeof define === 'function' && define.amd ? define('@ng-matero/extensions', ['exports', '@ng-matero/extensions/alert', '@ng-matero/extensions/button', '@ng-matero/extensions/checkbox-group', '@ng-matero/extensions/color-picker', '@ng-matero/extensions/column-resize', '@ng-matero/extensions/data-grid', '@ng-matero/extensions/dialog', '@ng-matero/extensions/loader', '@ng-matero/extensions/popover', '@ng-matero/extensions/progress', '@ng-matero/extensions/select', '@ng-matero/extensions/split-pane', '@ng-matero/extensions/tooltip', '@ng-matero/extensions/form-group', '@ng-matero/extensions/text3d', '@angular/core'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory((global['ng-matero'] = global['ng-matero'] || {}, global['ng-matero'].extensions = {}), global['ng-matero'].extensions.alert, global['ng-matero'].extensions.button, global['ng-matero'].extensions['checkbox-group'], global['ng-matero'].extensions['color-picker'], global['ng-matero'].extensions['column-resize'], global['ng-matero'].extensions['data-grid'], global['ng-matero'].extensions.dialog, global['ng-matero'].extensions.loader, global['ng-matero'].extensions.popover, global['ng-matero'].extensions.progress, global['ng-matero'].extensions.select, global['ng-matero'].extensions['split-pane'], global['ng-matero'].extensions.tooltip, global['ng-matero'].extensions['form-group'], global['ng-matero'].extensions.text3d, global.ng.core));
}(this, (function (exports, alert, button, checkboxGroup, colorPicker, columnResize, dataGrid, dialog, loader, popover, progress, select, splitPane, tooltip, formGroup, text3d, core) { 'use strict';

    var MaterialExtensionsExperimentalModule = /** @class */ (function () {
        function MaterialExtensionsExperimentalModule() {
        }
        return MaterialExtensionsExperimentalModule;
    }());
    MaterialExtensionsExperimentalModule.decorators = [
        { type: core.NgModule, args: [{
                    exports: [formGroup.MtxFormGroupModule, text3d.MtxText3dModule],
                    declarations: [],
                },] }
    ];

    var MaterialExtensionsModule = /** @class */ (function () {
        function MaterialExtensionsModule() {
        }
        return MaterialExtensionsModule;
    }());
    MaterialExtensionsModule.decorators = [
        { type: core.NgModule, args: [{
                    exports: [
                        alert.MtxAlertModule,
                        button.MtxButtonModule,
                        checkboxGroup.MtxCheckboxGroupModule,
                        colorPicker.MtxColorPickerModule,
                        dataGrid.MtxGridModule,
                        dialog.MtxDialogModule,
                        loader.MtxLoaderModule,
                        popover.MtxPopoverModule,
                        progress.MtxProgressModule,
                        select.MtxSelectModule,
                        splitPane.MtxSplitModule,
                        tooltip.MtxTooltipModule,
                    ],
                    declarations: [],
                },] }
    ];

    /*
     * Public API Surface of components
     */

    /**
     * Generated bundle index. Do not edit.
     */

    Object.keys(alert).forEach(function (k) {
        if (k !== 'default') Object.defineProperty(exports, k, {
            enumerable: true,
            get: function () {
                return alert[k];
            }
        });
    });
    Object.keys(button).forEach(function (k) {
        if (k !== 'default') Object.defineProperty(exports, k, {
            enumerable: true,
            get: function () {
                return button[k];
            }
        });
    });
    Object.keys(checkboxGroup).forEach(function (k) {
        if (k !== 'default') Object.defineProperty(exports, k, {
            enumerable: true,
            get: function () {
                return checkboxGroup[k];
            }
        });
    });
    Object.keys(colorPicker).forEach(function (k) {
        if (k !== 'default') Object.defineProperty(exports, k, {
            enumerable: true,
            get: function () {
                return colorPicker[k];
            }
        });
    });
    Object.keys(columnResize).forEach(function (k) {
        if (k !== 'default') Object.defineProperty(exports, k, {
            enumerable: true,
            get: function () {
                return columnResize[k];
            }
        });
    });
    Object.keys(dataGrid).forEach(function (k) {
        if (k !== 'default') Object.defineProperty(exports, k, {
            enumerable: true,
            get: function () {
                return dataGrid[k];
            }
        });
    });
    Object.keys(dialog).forEach(function (k) {
        if (k !== 'default') Object.defineProperty(exports, k, {
            enumerable: true,
            get: function () {
                return dialog[k];
            }
        });
    });
    Object.keys(loader).forEach(function (k) {
        if (k !== 'default') Object.defineProperty(exports, k, {
            enumerable: true,
            get: function () {
                return loader[k];
            }
        });
    });
    Object.keys(popover).forEach(function (k) {
        if (k !== 'default') Object.defineProperty(exports, k, {
            enumerable: true,
            get: function () {
                return popover[k];
            }
        });
    });
    Object.keys(progress).forEach(function (k) {
        if (k !== 'default') Object.defineProperty(exports, k, {
            enumerable: true,
            get: function () {
                return progress[k];
            }
        });
    });
    Object.keys(select).forEach(function (k) {
        if (k !== 'default') Object.defineProperty(exports, k, {
            enumerable: true,
            get: function () {
                return select[k];
            }
        });
    });
    Object.keys(splitPane).forEach(function (k) {
        if (k !== 'default') Object.defineProperty(exports, k, {
            enumerable: true,
            get: function () {
                return splitPane[k];
            }
        });
    });
    Object.keys(tooltip).forEach(function (k) {
        if (k !== 'default') Object.defineProperty(exports, k, {
            enumerable: true,
            get: function () {
                return tooltip[k];
            }
        });
    });
    Object.keys(formGroup).forEach(function (k) {
        if (k !== 'default') Object.defineProperty(exports, k, {
            enumerable: true,
            get: function () {
                return formGroup[k];
            }
        });
    });
    Object.keys(text3d).forEach(function (k) {
        if (k !== 'default') Object.defineProperty(exports, k, {
            enumerable: true,
            get: function () {
                return text3d[k];
            }
        });
    });
    exports.MaterialExtensionsExperimentalModule = MaterialExtensionsExperimentalModule;
    exports.MaterialExtensionsModule = MaterialExtensionsModule;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=extensions.umd.js.map
