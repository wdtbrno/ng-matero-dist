(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/common'), require('@angular/material/dialog'), require('@angular/material/button'), require('@angular/material/icon'), require('@ng-matero/extensions/utils')) :
    typeof define === 'function' && define.amd ? define('@ng-matero/extensions/dialog', ['exports', '@angular/core', '@angular/common', '@angular/material/dialog', '@angular/material/button', '@angular/material/icon', '@ng-matero/extensions/utils'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory((global['ng-matero'] = global['ng-matero'] || {}, global['ng-matero'].extensions = global['ng-matero'].extensions || {}, global['ng-matero'].extensions.dialog = {}), global.ng.core, global.ng.common, global.ng.material.dialog, global.ng.material.button, global.ng.material.icon, global['ng-matero'].extensions.utils));
}(this, (function (exports, core, common, dialog, button, icon, utils) { 'use strict';

    var MtxDialogComponent = /** @class */ (function () {
        function MtxDialogComponent(dialogRef, data) {
            this.dialogRef = dialogRef;
            this.data = data;
        }
        MtxDialogComponent.prototype._onClick = function (fn) {
            if (fn) {
                fn.call(this);
            }
            this._onClose();
        };
        MtxDialogComponent.prototype._onClose = function () {
            this.dialogRef.close();
        };
        return MtxDialogComponent;
    }());
    MtxDialogComponent.decorators = [
        { type: core.Component, args: [{
                    selector: 'mtx-dialog',
                    exportAs: 'mtxDialog',
                    template: "<h1 class=\"mtx-dialog-title\" *ngIf=\"data.title\">{{data.title | toObservable | async}}\n  <button mat-icon-button *ngIf=\"data.showCloseIcon\" (click)=\"_onClose()\">\n    <mat-icon>close</mat-icon>\n  </button>\n</h1>\n<div class=\"mtx-dialog-content\" *ngIf=\"data.description\">\n  <p>{{data.description | toObservable | async}}</p>\n</div>\n<div class=\"mtx-dialog-actions\">\n  <ng-container *ngFor=\"let btn of data.buttons\">\n    <ng-container [ngSwitch]=\"btn.type\">\n      <ng-container *ngSwitchCase=\"'raised'\">\n        <button mat-raised-button *ngIf=\"btn.focusInitial\" cdkFocusInitial\n                [color]=\"btn.color\" [ngClass]=\"btn.class\" (click)=\"_onClick(btn.onClick)\">\n          {{btn.text | toObservable | async}}\n        </button>\n        <button mat-raised-button *ngIf=\"!btn.focusInitial\"\n                [color]=\"btn.color\" [ngClass]=\"btn.class\" (click)=\"_onClick(btn.onClick)\">\n          {{btn.text | toObservable | async}}\n        </button>\n      </ng-container>\n      <ng-container *ngSwitchCase=\"'stroked'\">\n        <button mat-stroked-button *ngIf=\"btn.focusInitial\" cdkFocusInitial\n                [color]=\"btn.color\" [ngClass]=\"btn.class\" (click)=\"_onClick(btn.onClick)\">\n          {{btn.text | toObservable | async}}\n        </button>\n        <button mat-stroked-button *ngIf=\"!btn.focusInitial\"\n                [color]=\"btn.color\" [ngClass]=\"btn.class\" (click)=\"_onClick(btn.onClick)\">\n          {{btn.text | toObservable | async}}\n        </button>\n      </ng-container>\n      <ng-container *ngSwitchCase=\"'flat'\">\n        <button mat-flat-button *ngIf=\"btn.focusInitial\" cdkFocusInitial\n                [color]=\"btn.color\" [ngClass]=\"btn.class\" (click)=\"_onClick(btn.onClick)\">\n          {{btn.text | toObservable | async}}\n        </button>\n        <button mat-flat-button *ngIf=\"!btn.focusInitial\"\n                [color]=\"btn.color\" [ngClass]=\"btn.class\" (click)=\"_onClick(btn.onClick)\">\n          {{btn.text | toObservable | async}}\n        </button>\n      </ng-container>\n      <ng-container *ngSwitchDefault>\n        <button mat-button *ngIf=\"btn.focusInitial\" cdkFocusInitial\n                [color]=\"btn.color\" [ngClass]=\"btn.class\" (click)=\"_onClick(btn.onClick)\">\n          {{btn.text | toObservable | async}}\n        </button>\n        <button mat-button *ngIf=\"!btn.focusInitial\"\n                [color]=\"btn.color\" [ngClass]=\"btn.class\" (click)=\"_onClick(btn.onClick)\">\n          {{btn.text | toObservable | async}}\n        </button>\n      </ng-container>\n    </ng-container>\n  </ng-container>\n</div>\n",
                    encapsulation: core.ViewEncapsulation.None,
                    changeDetection: core.ChangeDetectionStrategy.OnPush,
                    styles: [".mtx-dialog-title{display:flex;justify-content:space-between;align-items:center;margin:0 0 20px;font:500 20px/32px Roboto,Helvetica Neue,sans-serif;letter-spacing:normal}.mtx-dialog-content{display:block;max-height:65vh;padding:0 24px;margin:0 -24px;overflow:auto;-webkit-overflow-scrolling:touch}.mtx-dialog-actions{display:flex;flex-wrap:wrap;align-items:center;justify-content:flex-end;min-height:52px;padding:8px 0;margin-bottom:-24px}"]
                },] }
    ];
    /** @nocollapse */
    MtxDialogComponent.ctorParameters = function () { return [
        { type: dialog.MatDialogRef },
        { type: undefined, decorators: [{ type: core.Inject, args: [dialog.MAT_DIALOG_DATA,] }] }
    ]; };

    var ɵ0 = function () { }, ɵ1 = function () { };
    var defaults = {
        title: '',
        description: '',
        buttons: [
            {
                color: 'warn',
                text: 'OK',
                focusInitial: true,
                onClick: ɵ0,
            },
            {
                text: 'CLOSE',
                onClick: ɵ1,
            },
        ],
        showCloseIcon: false,
        disableClose: true,
        width: '300px',
    };
    var MtxDialog = /** @class */ (function () {
        function MtxDialog(dialog) {
            this.dialog = dialog;
        }
        MtxDialog.prototype.originalOpen = function (componentOrTemplateRef, config) {
            if (componentOrTemplateRef === void 0) { componentOrTemplateRef = MtxDialogComponent; }
            return this.dialog.open(componentOrTemplateRef, config);
        };
        MtxDialog.prototype.open = function (config, componentOrTemplateRef) {
            if (componentOrTemplateRef === void 0) { componentOrTemplateRef = MtxDialogComponent; }
            var data = Object.assign({}, defaults, config);
            return this.dialog.open(componentOrTemplateRef, Object.assign(Object.assign({}, data), { data: data }));
        };
        MtxDialog.prototype.alert = function (title, description, onOk) {
            if (description === void 0) { description = ''; }
            if (onOk === void 0) { onOk = function () { }; }
            this.open({
                title: title,
                description: description,
                buttons: [
                    {
                        color: 'warn',
                        text: 'OK',
                        onClick: function () { return onOk(); },
                    },
                ],
            });
        };
        MtxDialog.prototype.confirm = function (title, description, onOk, onClose) {
            if (description === void 0) { description = ''; }
            if (onOk === void 0) { onOk = function () { }; }
            if (onClose === void 0) { onClose = function () { }; }
            this.open({
                title: title,
                description: description,
                buttons: [
                    {
                        color: 'warn',
                        text: 'OK',
                        onClick: function () { return onOk(); },
                    },
                    {
                        text: 'CLOSE',
                        onClick: function () { return onClose(); },
                    },
                ],
            });
        };
        return MtxDialog;
    }());
    MtxDialog.decorators = [
        { type: core.Injectable }
    ];
    /** @nocollapse */
    MtxDialog.ctorParameters = function () { return [
        { type: dialog.MatDialog }
    ]; };

    var MtxDialogModule = /** @class */ (function () {
        function MtxDialogModule() {
        }
        return MtxDialogModule;
    }());
    MtxDialogModule.decorators = [
        { type: core.NgModule, args: [{
                    imports: [common.CommonModule, dialog.MatDialogModule, button.MatButtonModule, icon.MatIconModule, utils.MtxUtilsModule],
                    exports: [MtxDialogComponent],
                    declarations: [MtxDialogComponent],
                    providers: [MtxDialog],
                    entryComponents: [MtxDialogComponent],
                },] }
    ];

    /**
     * Generated bundle index. Do not edit.
     */

    exports.MtxDialog = MtxDialog;
    exports.MtxDialogComponent = MtxDialogComponent;
    exports.MtxDialogModule = MtxDialogModule;
    exports.ɵ0 = ɵ0;
    exports.ɵ1 = ɵ1;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=mtxDialog.umd.js.map
