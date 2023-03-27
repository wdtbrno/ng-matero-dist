import { Component, ViewEncapsulation, ChangeDetectionStrategy, Inject, Injectable, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MtxUtilsModule } from '@ng-matero/extensions/utils';

class MtxDialogComponent {
    constructor(dialogRef, data) {
        this.dialogRef = dialogRef;
        this.data = data;
    }
    _onClick(fn) {
        if (fn) {
            fn.call(this);
        }
        this._onClose();
    }
    _onClose() {
        this.dialogRef.close();
    }
}
MtxDialogComponent.decorators = [
    { type: Component, args: [{
                selector: 'mtx-dialog',
                exportAs: 'mtxDialog',
                template: "<h1 class=\"mtx-dialog-title\" *ngIf=\"data.title\">{{data.title | toObservable | async}}\n  <button mat-icon-button *ngIf=\"data.showCloseIcon\" (click)=\"_onClose()\">\n    <mat-icon>close</mat-icon>\n  </button>\n</h1>\n<div class=\"mtx-dialog-content\" *ngIf=\"data.description\">\n  <p>{{data.description | toObservable | async}}</p>\n</div>\n<div class=\"mtx-dialog-actions\">\n  <ng-container *ngFor=\"let btn of data.buttons\">\n    <ng-container [ngSwitch]=\"btn.type\">\n      <ng-container *ngSwitchCase=\"'raised'\">\n        <button mat-raised-button *ngIf=\"btn.focusInitial\" cdkFocusInitial\n                [color]=\"btn.color\" [ngClass]=\"btn.class\" (click)=\"_onClick(btn.onClick)\">\n          {{btn.text | toObservable | async}}\n        </button>\n        <button mat-raised-button *ngIf=\"!btn.focusInitial\"\n                [color]=\"btn.color\" [ngClass]=\"btn.class\" (click)=\"_onClick(btn.onClick)\">\n          {{btn.text | toObservable | async}}\n        </button>\n      </ng-container>\n      <ng-container *ngSwitchCase=\"'stroked'\">\n        <button mat-stroked-button *ngIf=\"btn.focusInitial\" cdkFocusInitial\n                [color]=\"btn.color\" [ngClass]=\"btn.class\" (click)=\"_onClick(btn.onClick)\">\n          {{btn.text | toObservable | async}}\n        </button>\n        <button mat-stroked-button *ngIf=\"!btn.focusInitial\"\n                [color]=\"btn.color\" [ngClass]=\"btn.class\" (click)=\"_onClick(btn.onClick)\">\n          {{btn.text | toObservable | async}}\n        </button>\n      </ng-container>\n      <ng-container *ngSwitchCase=\"'flat'\">\n        <button mat-flat-button *ngIf=\"btn.focusInitial\" cdkFocusInitial\n                [color]=\"btn.color\" [ngClass]=\"btn.class\" (click)=\"_onClick(btn.onClick)\">\n          {{btn.text | toObservable | async}}\n        </button>\n        <button mat-flat-button *ngIf=\"!btn.focusInitial\"\n                [color]=\"btn.color\" [ngClass]=\"btn.class\" (click)=\"_onClick(btn.onClick)\">\n          {{btn.text | toObservable | async}}\n        </button>\n      </ng-container>\n      <ng-container *ngSwitchDefault>\n        <button mat-button *ngIf=\"btn.focusInitial\" cdkFocusInitial\n                [color]=\"btn.color\" [ngClass]=\"btn.class\" (click)=\"_onClick(btn.onClick)\">\n          {{btn.text | toObservable | async}}\n        </button>\n        <button mat-button *ngIf=\"!btn.focusInitial\"\n                [color]=\"btn.color\" [ngClass]=\"btn.class\" (click)=\"_onClick(btn.onClick)\">\n          {{btn.text | toObservable | async}}\n        </button>\n      </ng-container>\n    </ng-container>\n  </ng-container>\n</div>\n",
                encapsulation: ViewEncapsulation.None,
                changeDetection: ChangeDetectionStrategy.OnPush,
                styles: [".mtx-dialog-title{display:flex;justify-content:space-between;align-items:center;margin:0 0 20px;font:500 20px/32px Roboto,Helvetica Neue,sans-serif;letter-spacing:normal}.mtx-dialog-content{display:block;max-height:65vh;padding:0 24px;margin:0 -24px;overflow:auto;-webkit-overflow-scrolling:touch}.mtx-dialog-actions{display:flex;flex-wrap:wrap;align-items:center;justify-content:flex-end;min-height:52px;padding:8px 0;margin-bottom:-24px}"]
            },] }
];
/** @nocollapse */
MtxDialogComponent.ctorParameters = () => [
    { type: MatDialogRef },
    { type: undefined, decorators: [{ type: Inject, args: [MAT_DIALOG_DATA,] }] }
];

const ɵ0 = () => { }, ɵ1 = () => { };
const defaults = {
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
class MtxDialog {
    constructor(dialog) {
        this.dialog = dialog;
    }
    originalOpen(componentOrTemplateRef = MtxDialogComponent, config) {
        return this.dialog.open(componentOrTemplateRef, config);
    }
    open(config, componentOrTemplateRef = MtxDialogComponent) {
        const data = Object.assign({}, defaults, config);
        return this.dialog.open(componentOrTemplateRef, Object.assign(Object.assign({}, data), { data }));
    }
    alert(title, description = '', onOk = () => { }) {
        this.open({
            title,
            description,
            buttons: [
                {
                    color: 'warn',
                    text: 'OK',
                    onClick: () => onOk(),
                },
            ],
        });
    }
    confirm(title, description = '', onOk = () => { }, onClose = () => { }) {
        this.open({
            title,
            description,
            buttons: [
                {
                    color: 'warn',
                    text: 'OK',
                    onClick: () => onOk(),
                },
                {
                    text: 'CLOSE',
                    onClick: () => onClose(),
                },
            ],
        });
    }
}
MtxDialog.decorators = [
    { type: Injectable }
];
/** @nocollapse */
MtxDialog.ctorParameters = () => [
    { type: MatDialog }
];

class MtxDialogModule {
}
MtxDialogModule.decorators = [
    { type: NgModule, args: [{
                imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule, MtxUtilsModule],
                exports: [MtxDialogComponent],
                declarations: [MtxDialogComponent],
                providers: [MtxDialog],
                entryComponents: [MtxDialogComponent],
            },] }
];

/**
 * Generated bundle index. Do not edit.
 */

export { MtxDialog, MtxDialogComponent, MtxDialogModule, ɵ0, ɵ1 };
//# sourceMappingURL=mtxDialog.js.map
