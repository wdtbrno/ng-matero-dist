import * as i0 from '@angular/core';
import { Component, ViewEncapsulation, ChangeDetectionStrategy, Inject, Injectable, NgModule } from '@angular/core';
import * as i2 from '@angular/common';
import { CommonModule } from '@angular/common';
import * as i1 from '@angular/material/dialog';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import * as i3 from '@angular/material/button';
import { MatButtonModule } from '@angular/material/button';
import * as i4 from '@angular/material/icon';
import { MatIconModule } from '@angular/material/icon';
import * as i5 from '@ng-matero/extensions/core';
import { MtxPipesModule } from '@ng-matero/extensions/core';

class MtxDialogContainer {
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
/** @nocollapse */ MtxDialogContainer.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MtxDialogContainer, deps: [{ token: i1.MatDialogRef }, { token: MAT_DIALOG_DATA }], target: i0.ɵɵFactoryTarget.Component });
/** @nocollapse */ MtxDialogContainer.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.1", type: MtxDialogContainer, selector: "mtx-dialog-container", host: { classAttribute: "mtx-dialog-container" }, exportAs: ["mtxDialogContainer"], ngImport: i0, template: "<h1 class=\"mtx-dialog-title\" *ngIf=\"data.title\">\n  <span>{{data.title | toObservable | async}}</span>\n  <button mat-icon-button *ngIf=\"data.showCloseIcon\" (click)=\"_onClose()\">\n    <mat-icon>close</mat-icon>\n  </button>\n</h1>\n<div class=\"mtx-dialog-content\" *ngIf=\"data.description\">\n  <p>{{data.description | toObservable | async}}</p>\n</div>\n<div class=\"mtx-dialog-actions\">\n  <ng-container *ngFor=\"let btn of data.buttons\">\n    <ng-container [ngSwitch]=\"btn.type\">\n      <ng-container *ngSwitchCase=\"'raised'\">\n        <button mat-raised-button *ngIf=\"btn.focusInitial\" cdkFocusInitial\n                [color]=\"btn.color\" [ngClass]=\"btn.class!\" (click)=\"_onClick(btn.onClick!)\">\n          {{btn.text | toObservable | async}}\n        </button>\n        <button mat-raised-button *ngIf=\"!btn.focusInitial\"\n                [color]=\"btn.color\" [ngClass]=\"btn.class!\" (click)=\"_onClick(btn.onClick!)\">\n          {{btn.text | toObservable | async}}\n        </button>\n      </ng-container>\n      <ng-container *ngSwitchCase=\"'stroked'\">\n        <button mat-stroked-button *ngIf=\"btn.focusInitial\" cdkFocusInitial\n                [color]=\"btn.color\" [ngClass]=\"btn.class!\" (click)=\"_onClick(btn.onClick!)\">\n          {{btn.text | toObservable | async}}\n        </button>\n        <button mat-stroked-button *ngIf=\"!btn.focusInitial\"\n                [color]=\"btn.color\" [ngClass]=\"btn.class!\" (click)=\"_onClick(btn.onClick!)\">\n          {{btn.text | toObservable | async}}\n        </button>\n      </ng-container>\n      <ng-container *ngSwitchCase=\"'flat'\">\n        <button mat-flat-button *ngIf=\"btn.focusInitial\" cdkFocusInitial\n                [color]=\"btn.color\" [ngClass]=\"btn.class!\" (click)=\"_onClick(btn.onClick!)\">\n          {{btn.text | toObservable | async}}\n        </button>\n        <button mat-flat-button *ngIf=\"!btn.focusInitial\"\n                [color]=\"btn.color\" [ngClass]=\"btn.class!\" (click)=\"_onClick(btn.onClick!)\">\n          {{btn.text | toObservable | async}}\n        </button>\n      </ng-container>\n      <ng-container *ngSwitchDefault>\n        <button mat-button *ngIf=\"btn.focusInitial\" cdkFocusInitial\n                [color]=\"btn.color\" [ngClass]=\"btn.class!\" (click)=\"_onClick(btn.onClick!)\">\n          {{btn.text | toObservable | async}}\n        </button>\n        <button mat-button *ngIf=\"!btn.focusInitial\"\n                [color]=\"btn.color\" [ngClass]=\"btn.class!\" (click)=\"_onClick(btn.onClick!)\">\n          {{btn.text | toObservable | async}}\n        </button>\n      </ng-container>\n    </ng-container>\n  </ng-container>\n</div>\n", styles: [".mtx-dialog-title{display:flex;justify-content:space-between;align-items:center;padding:8px 24px;margin:0;line-height:48px;font-weight:500;font-size:20px}.mtx-dialog-title .mat-mdc-button-base{margin-right:-16px}[dir=rtl] .mtx-dialog-title .mat-mdc-button-base{margin-right:0;margin-left:-16px}.mtx-dialog-content{display:block;max-height:65vh;padding:0 24px;overflow:auto;-webkit-overflow-scrolling:touch}.mtx-dialog-content p{margin-top:0}.mtx-dialog-actions{display:flex;flex-wrap:wrap;align-items:center;justify-content:flex-end;padding:8px}.mtx-dialog-actions .mat-mdc-button-base{margin-left:8px}[dir=rtl] .mtx-dialog-actions .mat-mdc-button-base{margin-left:0;margin-right:8px}\n"], dependencies: [{ kind: "directive", type: i2.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i2.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i2.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i2.NgSwitch, selector: "[ngSwitch]", inputs: ["ngSwitch"] }, { kind: "directive", type: i2.NgSwitchCase, selector: "[ngSwitchCase]", inputs: ["ngSwitchCase"] }, { kind: "directive", type: i2.NgSwitchDefault, selector: "[ngSwitchDefault]" }, { kind: "component", type: i3.MatButton, selector: "    button[mat-button], button[mat-raised-button], button[mat-flat-button],    button[mat-stroked-button]  ", inputs: ["disabled", "disableRipple", "color"], exportAs: ["matButton"] }, { kind: "component", type: i3.MatIconButton, selector: "button[mat-icon-button]", inputs: ["disabled", "disableRipple", "color"], exportAs: ["matButton"] }, { kind: "component", type: i4.MatIcon, selector: "mat-icon", inputs: ["color", "inline", "svgIcon", "fontSet", "fontIcon"], exportAs: ["matIcon"] }, { kind: "pipe", type: i2.AsyncPipe, name: "async" }, { kind: "pipe", type: i5.MtxToObservablePipe, name: "toObservable" }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MtxDialogContainer, decorators: [{
            type: Component,
            args: [{ selector: 'mtx-dialog-container', exportAs: 'mtxDialogContainer', host: {
                        class: 'mtx-dialog-container',
                    }, encapsulation: ViewEncapsulation.None, changeDetection: ChangeDetectionStrategy.OnPush, template: "<h1 class=\"mtx-dialog-title\" *ngIf=\"data.title\">\n  <span>{{data.title | toObservable | async}}</span>\n  <button mat-icon-button *ngIf=\"data.showCloseIcon\" (click)=\"_onClose()\">\n    <mat-icon>close</mat-icon>\n  </button>\n</h1>\n<div class=\"mtx-dialog-content\" *ngIf=\"data.description\">\n  <p>{{data.description | toObservable | async}}</p>\n</div>\n<div class=\"mtx-dialog-actions\">\n  <ng-container *ngFor=\"let btn of data.buttons\">\n    <ng-container [ngSwitch]=\"btn.type\">\n      <ng-container *ngSwitchCase=\"'raised'\">\n        <button mat-raised-button *ngIf=\"btn.focusInitial\" cdkFocusInitial\n                [color]=\"btn.color\" [ngClass]=\"btn.class!\" (click)=\"_onClick(btn.onClick!)\">\n          {{btn.text | toObservable | async}}\n        </button>\n        <button mat-raised-button *ngIf=\"!btn.focusInitial\"\n                [color]=\"btn.color\" [ngClass]=\"btn.class!\" (click)=\"_onClick(btn.onClick!)\">\n          {{btn.text | toObservable | async}}\n        </button>\n      </ng-container>\n      <ng-container *ngSwitchCase=\"'stroked'\">\n        <button mat-stroked-button *ngIf=\"btn.focusInitial\" cdkFocusInitial\n                [color]=\"btn.color\" [ngClass]=\"btn.class!\" (click)=\"_onClick(btn.onClick!)\">\n          {{btn.text | toObservable | async}}\n        </button>\n        <button mat-stroked-button *ngIf=\"!btn.focusInitial\"\n                [color]=\"btn.color\" [ngClass]=\"btn.class!\" (click)=\"_onClick(btn.onClick!)\">\n          {{btn.text | toObservable | async}}\n        </button>\n      </ng-container>\n      <ng-container *ngSwitchCase=\"'flat'\">\n        <button mat-flat-button *ngIf=\"btn.focusInitial\" cdkFocusInitial\n                [color]=\"btn.color\" [ngClass]=\"btn.class!\" (click)=\"_onClick(btn.onClick!)\">\n          {{btn.text | toObservable | async}}\n        </button>\n        <button mat-flat-button *ngIf=\"!btn.focusInitial\"\n                [color]=\"btn.color\" [ngClass]=\"btn.class!\" (click)=\"_onClick(btn.onClick!)\">\n          {{btn.text | toObservable | async}}\n        </button>\n      </ng-container>\n      <ng-container *ngSwitchDefault>\n        <button mat-button *ngIf=\"btn.focusInitial\" cdkFocusInitial\n                [color]=\"btn.color\" [ngClass]=\"btn.class!\" (click)=\"_onClick(btn.onClick!)\">\n          {{btn.text | toObservable | async}}\n        </button>\n        <button mat-button *ngIf=\"!btn.focusInitial\"\n                [color]=\"btn.color\" [ngClass]=\"btn.class!\" (click)=\"_onClick(btn.onClick!)\">\n          {{btn.text | toObservable | async}}\n        </button>\n      </ng-container>\n    </ng-container>\n  </ng-container>\n</div>\n", styles: [".mtx-dialog-title{display:flex;justify-content:space-between;align-items:center;padding:8px 24px;margin:0;line-height:48px;font-weight:500;font-size:20px}.mtx-dialog-title .mat-mdc-button-base{margin-right:-16px}[dir=rtl] .mtx-dialog-title .mat-mdc-button-base{margin-right:0;margin-left:-16px}.mtx-dialog-content{display:block;max-height:65vh;padding:0 24px;overflow:auto;-webkit-overflow-scrolling:touch}.mtx-dialog-content p{margin-top:0}.mtx-dialog-actions{display:flex;flex-wrap:wrap;align-items:center;justify-content:flex-end;padding:8px}.mtx-dialog-actions .mat-mdc-button-base{margin-left:8px}[dir=rtl] .mtx-dialog-actions .mat-mdc-button-base{margin-left:0;margin-right:8px}\n"] }]
        }], ctorParameters: function () {
        return [{ type: i1.MatDialogRef }, { type: undefined, decorators: [{
                        type: Inject,
                        args: [MAT_DIALOG_DATA]
                    }] }];
    } });

const defaults = {
    title: '',
    description: '',
    buttons: [
        {
            color: 'warn',
            text: 'OK',
            focusInitial: true,
            onClick: () => { },
        },
        {
            text: 'CLOSE',
            onClick: () => { },
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
    originalOpen(componentOrTemplateRef = MtxDialogContainer, config) {
        return this.dialog.open(componentOrTemplateRef, config);
    }
    open(config, componentOrTemplateRef = MtxDialogContainer) {
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
/** @nocollapse */ MtxDialog.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MtxDialog, deps: [{ token: i1.MatDialog }], target: i0.ɵɵFactoryTarget.Injectable });
/** @nocollapse */ MtxDialog.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MtxDialog });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MtxDialog, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i1.MatDialog }]; } });

class MtxDialogModule {
}
/** @nocollapse */ MtxDialogModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MtxDialogModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
/** @nocollapse */ MtxDialogModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "15.2.1", ngImport: i0, type: MtxDialogModule, declarations: [MtxDialogContainer], imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule, MtxPipesModule], exports: [MtxDialogContainer] });
/** @nocollapse */ MtxDialogModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MtxDialogModule, providers: [MtxDialog], imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule, MtxPipesModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MtxDialogModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule, MtxPipesModule],
                    exports: [MtxDialogContainer],
                    declarations: [MtxDialogContainer],
                    providers: [MtxDialog],
                }]
        }] });

/**
 * Generated bundle index. Do not edit.
 */

export { MtxDialog, MtxDialogContainer, MtxDialogModule };
//# sourceMappingURL=mtxDialog.mjs.map
