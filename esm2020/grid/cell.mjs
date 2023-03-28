import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewEncapsulation, } from '@angular/core';
import PhotoViewer from 'photoviewer';
import * as i0 from "@angular/core";
import * as i1 from "@ng-matero/extensions/dialog";
import * as i2 from "./grid-utils";
import * as i3 from "@angular/common";
import * as i4 from "@angular/material/button";
import * as i5 from "@angular/material/chips";
import * as i6 from "@angular/material/tooltip";
import * as i7 from "@angular/material/icon";
import * as i8 from "@ng-matero/extensions/core";
import * as i9 from "./grid-pipes";
export class MtxGridCell {
    get _value() {
        return this._utils.getCellValue(this.rowData, this.colDef);
    }
    constructor(_dialog, _utils, _differs, _changeDetectorRef) {
        this._dialog = _dialog;
        this._utils = _utils;
        this._differs = _differs;
        this._changeDetectorRef = _changeDetectorRef;
        /** Row data */
        this.rowData = {};
        /** Table data */
        this.data = [];
        /** Whether show summary */
        this.summary = false;
        /** Placeholder for the empty value (`null`, `''`, `[]`) */
        this.placeholder = '--';
        this.rowDataChange = new EventEmitter();
    }
    ngOnInit() {
        this.rowDataDiffer = this._differs.find(this.rowData).create();
    }
    ngDoCheck() {
        const changes = this.rowDataDiffer?.diff(this.rowData);
        if (changes) {
            this._applyChanges(changes);
        }
    }
    _applyChanges(changes) {
        changes.forEachChangedItem(record => {
            this._changeDetectorRef.markForCheck();
            this.rowDataChange.emit(record);
        });
    }
    _getText(value) {
        return value === undefined ? '' : this._utils.isEmpty(value) ? this.placeholder : value;
    }
    _getTooltip(value) {
        return this._utils.isEmpty(value) ? '' : value;
    }
    _getFormatterTooltip(value) {
        return this._utils.isContainHTML(value) || this._utils.isEmpty(value) ? '' : value;
    }
    _onActionClick(event, btn, rowData) {
        event.preventDefault();
        event.stopPropagation();
        if (btn.pop) {
            this._dialog.open({
                title: btn.pop?.title,
                description: btn.pop?.description,
                buttons: [
                    {
                        color: btn.pop?.okColor || 'primary',
                        text: btn.pop?.okText || 'OK',
                        onClick: () => btn.click?.(rowData) || {},
                    },
                    {
                        color: btn.pop?.closeColor,
                        text: btn.pop?.closeText || 'CLOSE',
                        onClick: () => { },
                    },
                ],
            });
        }
        else {
            btn.click?.(rowData);
        }
    }
    /** Preview enlarged image */
    _onImagePreview(urlStr) {
        const imgs = [];
        this._utils.str2arr(urlStr).forEach((url, index) => {
            imgs.push({ title: index + 1 + '', src: url });
        });
        const footerToolbar = imgs.length > 1
            ? ['zoomIn', 'zoomOut', 'prev', 'next', 'rotateRight', 'rotateLeft', 'actualSize']
            : ['zoomIn', 'zoomOut', 'rotateRight', 'rotateLeft', 'actualSize'];
        const options = {
            title: imgs.length > 1,
            footerToolbar,
        };
        const photoviewer = new PhotoViewer(imgs, options);
    }
}
/** @nocollapse */ MtxGridCell.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MtxGridCell, deps: [{ token: i1.MtxDialog }, { token: i2.MtxGridUtils }, { token: i0.KeyValueDiffers }, { token: i0.ChangeDetectorRef }], target: i0.ɵɵFactoryTarget.Component });
/** @nocollapse */ MtxGridCell.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.1", type: MtxGridCell, selector: "mtx-grid-cell", inputs: { rowData: "rowData", colDef: "colDef", data: "data", summary: "summary", placeholder: "placeholder" }, outputs: { rowDataChange: "rowDataChange" }, exportAs: ["mtxGridCell"], ngImport: i0, template: "<span *ngIf=\"summary; else customCellFormattingTpl\"\r\n      [title]=\"_getFormatterTooltip((data | cellSummary: colDef))\"\r\n      [innerHTML]=\"_getText((data | cellSummary: colDef))\">\r\n</span>\r\n\r\n<!-- Custom formatting -->\r\n<ng-template #customCellFormattingTpl>\r\n  <span *ngIf=\"colDef.formatter; else defaultCellFormattingTpl\"\r\n        [title]=\"_getFormatterTooltip(colDef.formatter(rowData, colDef))\"\r\n        [innerHTML]=\"_getText(colDef.formatter(rowData, colDef))\">\r\n  </span>\r\n</ng-template>\r\n\r\n<!-- Default formatting -->\r\n<ng-template #defaultCellFormattingTpl>\r\n  <ng-container [ngSwitch]=\"colDef.type\">\r\n    <!-- Tag -->\r\n    <ng-container *ngSwitchCase=\"'tag'\">\r\n      <mat-chip-listbox *ngIf=\"colDef.tag && colDef.tag[_value]; else tagEmptyTpl\">\r\n        <mat-chip color=\"primary\" [ngClass]=\"['bg-' + colDef.tag[_value].color]\">\r\n          {{colDef.tag[_value].text}}\r\n        </mat-chip>\r\n      </mat-chip-listbox>\r\n      <ng-template #tagEmptyTpl>{{_value}}</ng-template>\r\n    </ng-container>\r\n    <!-- Buttons -->\r\n    <ng-container *ngSwitchCase=\"'button'\">\r\n      <ng-container *ngFor=\"let btn of colDef.buttons;\">\r\n        <ng-container *ngIf=\"!btn.iif || btn.iif(rowData)\">\r\n          <button *ngIf=\"btn.type==='basic'\"\r\n                  [ngClass]=\"['mtx-grid-action-button', btn.class||'']\"\r\n                  mat-button [color]=\"btn.color || 'primary'\"\r\n                  [disabled]=\"(btn | cellActionDisable: rowData)\"\r\n                  [matTooltip]=\"(btn | cellActionTooltip).message | toObservable | async\"\r\n                  [matTooltipClass]=\"(btn | cellActionTooltip).class\"\r\n                  [matTooltipHideDelay]=\"(btn | cellActionTooltip).hideDelay\"\r\n                  [matTooltipShowDelay]=\"(btn | cellActionTooltip).showDelay\"\r\n                  [matTooltipPosition]=\"(btn | cellActionTooltip).position || 'below'\"\r\n                  [matTooltipTouchGestures]=\"(btn | cellActionTooltip).touchGestures || 'auto'\"\r\n                  (click)=\"_onActionClick($event, btn, rowData)\">\r\n            <mat-icon class=\"mtx-grid-icon\" *ngIf=\"btn.icon\">{{btn.icon}}</mat-icon>\r\n            <span>{{btn.text | toObservable | async}}</span>\r\n          </button>\r\n          <button *ngIf=\"!btn.type || btn.type==='icon'\"\r\n                  [ngClass]=\"['mtx-grid-action-button', btn.class||'']\"\r\n                  mat-icon-button [color]=\"btn.color || 'primary'\"\r\n                  [disabled]=\"(btn | cellActionDisable: rowData)\"\r\n                  [matTooltip]=\"(btn | cellActionTooltip).message | toObservable | async\"\r\n                  [matTooltipClass]=\"(btn | cellActionTooltip).class\"\r\n                  [matTooltipHideDelay]=\"(btn | cellActionTooltip).hideDelay\"\r\n                  [matTooltipShowDelay]=\"(btn | cellActionTooltip).showDelay\"\r\n                  [matTooltipPosition]=\"(btn | cellActionTooltip).position || 'below'\"\r\n                  [matTooltipTouchGestures]=\"(btn | cellActionTooltip).touchGestures || 'auto'\"\r\n                  (click)=\"_onActionClick($event, btn, rowData)\">\r\n            <mat-icon class=\"mtx-grid-icon\">{{btn.icon}}</mat-icon>\r\n          </button>\r\n        </ng-container>\r\n      </ng-container>\r\n    </ng-container>\r\n    <!-- Link -->\r\n    <ng-container *ngSwitchCase=\"'link'\">\r\n      <a [href]=\"_value\" target=\"_blank\">{{_value}}</a>\r\n    </ng-container>\r\n    <!-- Image -->\r\n    <ng-container *ngSwitchCase=\"'image'\">\r\n      <img class=\"mtx-grid-img\" [src]=\"_value\" (click)=\"_onImagePreview(_value)\">\r\n    </ng-container>\r\n    <!-- Boolean -->\r\n    <ng-container *ngSwitchCase=\"'boolean'\">\r\n      <span [title]=\"_getTooltip(_value)\">{{_getText(_value)}}</span>\r\n    </ng-container>\r\n    <!-- Number -->\r\n    <ng-container *ngSwitchCase=\"'number'\">\r\n      <span [title]=\"_getTooltip(_value | number: colDef.typeParameter?.digitsInfo:\r\n      colDef.typeParameter?.locale)\">\r\n        {{_getText(_value | number: colDef.typeParameter?.digitsInfo:\r\n        colDef.typeParameter?.locale)}}\r\n      </span>\r\n    </ng-container>\r\n    <!-- Currency -->\r\n    <ng-container *ngSwitchCase=\"'currency'\">\r\n      <span [title]=\"_getTooltip(_value | currency: colDef.typeParameter?.currencyCode:\r\n      colDef.typeParameter?.display:\r\n      colDef.typeParameter?.digitsInfo:\r\n      colDef.typeParameter?.locale)\">\r\n        {{_getText(_value | currency: colDef.typeParameter?.currencyCode:\r\n        colDef.typeParameter?.display:\r\n        colDef.typeParameter?.digitsInfo:\r\n        colDef.typeParameter?.locale)}}\r\n      </span>\r\n    </ng-container>\r\n    <!-- Percent -->\r\n    <ng-container *ngSwitchCase=\"'percent'\">\r\n      <span [title]=\"_getTooltip(_value | percent: colDef.typeParameter?.digitsInfo:\r\n      colDef.typeParameter?.locale)\">\r\n        {{_getText(_value | percent: colDef.typeParameter?.digitsInfo:\r\n        colDef.typeParameter?.locale)}}\r\n      </span>\r\n    </ng-container>\r\n    <!-- Date -->\r\n    <ng-container *ngSwitchCase=\"'date'\">\r\n      <span [title]=\"_getTooltip(_value | date: colDef.typeParameter?.format:\r\n      colDef.typeParameter?.timezone:\r\n      colDef.typeParameter?.locale)\">\r\n        {{_getText(_value | date: colDef.typeParameter?.format:\r\n        colDef.typeParameter?.timezone:\r\n        colDef.typeParameter?.locale)}}\r\n      </span>\r\n    </ng-container>\r\n    <!-- Default -->\r\n    <ng-container *ngSwitchDefault>\r\n      <span [title]=\"_getTooltip(_value)\">{{_getText(_value)}}</span>\r\n    </ng-container>\r\n  </ng-container>\r\n</ng-template>\r\n", styles: [".mtx-grid-img{display:block;width:30px;border-radius:4px;cursor:pointer}\n"], dependencies: [{ kind: "directive", type: i3.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i3.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i3.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i3.NgSwitch, selector: "[ngSwitch]", inputs: ["ngSwitch"] }, { kind: "directive", type: i3.NgSwitchCase, selector: "[ngSwitchCase]", inputs: ["ngSwitchCase"] }, { kind: "directive", type: i3.NgSwitchDefault, selector: "[ngSwitchDefault]" }, { kind: "component", type: i4.MatButton, selector: "    button[mat-button], button[mat-raised-button], button[mat-flat-button],    button[mat-stroked-button]  ", inputs: ["disabled", "disableRipple", "color"], exportAs: ["matButton"] }, { kind: "component", type: i4.MatIconButton, selector: "button[mat-icon-button]", inputs: ["disabled", "disableRipple", "color"], exportAs: ["matButton"] }, { kind: "component", type: i5.MatChip, selector: "mat-basic-chip, [mat-basic-chip], mat-chip, [mat-chip]", inputs: ["color", "disabled", "disableRipple", "tabIndex", "role", "id", "aria-label", "aria-description", "value", "removable", "highlighted"], outputs: ["removed", "destroyed"], exportAs: ["matChip"] }, { kind: "component", type: i5.MatChipListbox, selector: "mat-chip-listbox", inputs: ["tabIndex", "multiple", "aria-orientation", "selectable", "compareWith", "required", "hideSingleSelectionIndicator", "value"], outputs: ["change"] }, { kind: "directive", type: i6.MatTooltip, selector: "[matTooltip]", exportAs: ["matTooltip"] }, { kind: "component", type: i7.MatIcon, selector: "mat-icon", inputs: ["color", "inline", "svgIcon", "fontSet", "fontIcon"], exportAs: ["matIcon"] }, { kind: "pipe", type: i3.AsyncPipe, name: "async" }, { kind: "pipe", type: i3.DecimalPipe, name: "number" }, { kind: "pipe", type: i3.PercentPipe, name: "percent" }, { kind: "pipe", type: i3.CurrencyPipe, name: "currency" }, { kind: "pipe", type: i3.DatePipe, name: "date" }, { kind: "pipe", type: i8.MtxToObservablePipe, name: "toObservable" }, { kind: "pipe", type: i9.MtxGridCellActionTooltipPipe, name: "cellActionTooltip" }, { kind: "pipe", type: i9.MtxGridCellActionDisablePipe, name: "cellActionDisable" }, { kind: "pipe", type: i9.MtxGridCellSummaryPipe, name: "cellSummary" }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MtxGridCell, decorators: [{
            type: Component,
            args: [{ selector: 'mtx-grid-cell', exportAs: 'mtxGridCell', encapsulation: ViewEncapsulation.None, changeDetection: ChangeDetectionStrategy.OnPush, template: "<span *ngIf=\"summary; else customCellFormattingTpl\"\r\n      [title]=\"_getFormatterTooltip((data | cellSummary: colDef))\"\r\n      [innerHTML]=\"_getText((data | cellSummary: colDef))\">\r\n</span>\r\n\r\n<!-- Custom formatting -->\r\n<ng-template #customCellFormattingTpl>\r\n  <span *ngIf=\"colDef.formatter; else defaultCellFormattingTpl\"\r\n        [title]=\"_getFormatterTooltip(colDef.formatter(rowData, colDef))\"\r\n        [innerHTML]=\"_getText(colDef.formatter(rowData, colDef))\">\r\n  </span>\r\n</ng-template>\r\n\r\n<!-- Default formatting -->\r\n<ng-template #defaultCellFormattingTpl>\r\n  <ng-container [ngSwitch]=\"colDef.type\">\r\n    <!-- Tag -->\r\n    <ng-container *ngSwitchCase=\"'tag'\">\r\n      <mat-chip-listbox *ngIf=\"colDef.tag && colDef.tag[_value]; else tagEmptyTpl\">\r\n        <mat-chip color=\"primary\" [ngClass]=\"['bg-' + colDef.tag[_value].color]\">\r\n          {{colDef.tag[_value].text}}\r\n        </mat-chip>\r\n      </mat-chip-listbox>\r\n      <ng-template #tagEmptyTpl>{{_value}}</ng-template>\r\n    </ng-container>\r\n    <!-- Buttons -->\r\n    <ng-container *ngSwitchCase=\"'button'\">\r\n      <ng-container *ngFor=\"let btn of colDef.buttons;\">\r\n        <ng-container *ngIf=\"!btn.iif || btn.iif(rowData)\">\r\n          <button *ngIf=\"btn.type==='basic'\"\r\n                  [ngClass]=\"['mtx-grid-action-button', btn.class||'']\"\r\n                  mat-button [color]=\"btn.color || 'primary'\"\r\n                  [disabled]=\"(btn | cellActionDisable: rowData)\"\r\n                  [matTooltip]=\"(btn | cellActionTooltip).message | toObservable | async\"\r\n                  [matTooltipClass]=\"(btn | cellActionTooltip).class\"\r\n                  [matTooltipHideDelay]=\"(btn | cellActionTooltip).hideDelay\"\r\n                  [matTooltipShowDelay]=\"(btn | cellActionTooltip).showDelay\"\r\n                  [matTooltipPosition]=\"(btn | cellActionTooltip).position || 'below'\"\r\n                  [matTooltipTouchGestures]=\"(btn | cellActionTooltip).touchGestures || 'auto'\"\r\n                  (click)=\"_onActionClick($event, btn, rowData)\">\r\n            <mat-icon class=\"mtx-grid-icon\" *ngIf=\"btn.icon\">{{btn.icon}}</mat-icon>\r\n            <span>{{btn.text | toObservable | async}}</span>\r\n          </button>\r\n          <button *ngIf=\"!btn.type || btn.type==='icon'\"\r\n                  [ngClass]=\"['mtx-grid-action-button', btn.class||'']\"\r\n                  mat-icon-button [color]=\"btn.color || 'primary'\"\r\n                  [disabled]=\"(btn | cellActionDisable: rowData)\"\r\n                  [matTooltip]=\"(btn | cellActionTooltip).message | toObservable | async\"\r\n                  [matTooltipClass]=\"(btn | cellActionTooltip).class\"\r\n                  [matTooltipHideDelay]=\"(btn | cellActionTooltip).hideDelay\"\r\n                  [matTooltipShowDelay]=\"(btn | cellActionTooltip).showDelay\"\r\n                  [matTooltipPosition]=\"(btn | cellActionTooltip).position || 'below'\"\r\n                  [matTooltipTouchGestures]=\"(btn | cellActionTooltip).touchGestures || 'auto'\"\r\n                  (click)=\"_onActionClick($event, btn, rowData)\">\r\n            <mat-icon class=\"mtx-grid-icon\">{{btn.icon}}</mat-icon>\r\n          </button>\r\n        </ng-container>\r\n      </ng-container>\r\n    </ng-container>\r\n    <!-- Link -->\r\n    <ng-container *ngSwitchCase=\"'link'\">\r\n      <a [href]=\"_value\" target=\"_blank\">{{_value}}</a>\r\n    </ng-container>\r\n    <!-- Image -->\r\n    <ng-container *ngSwitchCase=\"'image'\">\r\n      <img class=\"mtx-grid-img\" [src]=\"_value\" (click)=\"_onImagePreview(_value)\">\r\n    </ng-container>\r\n    <!-- Boolean -->\r\n    <ng-container *ngSwitchCase=\"'boolean'\">\r\n      <span [title]=\"_getTooltip(_value)\">{{_getText(_value)}}</span>\r\n    </ng-container>\r\n    <!-- Number -->\r\n    <ng-container *ngSwitchCase=\"'number'\">\r\n      <span [title]=\"_getTooltip(_value | number: colDef.typeParameter?.digitsInfo:\r\n      colDef.typeParameter?.locale)\">\r\n        {{_getText(_value | number: colDef.typeParameter?.digitsInfo:\r\n        colDef.typeParameter?.locale)}}\r\n      </span>\r\n    </ng-container>\r\n    <!-- Currency -->\r\n    <ng-container *ngSwitchCase=\"'currency'\">\r\n      <span [title]=\"_getTooltip(_value | currency: colDef.typeParameter?.currencyCode:\r\n      colDef.typeParameter?.display:\r\n      colDef.typeParameter?.digitsInfo:\r\n      colDef.typeParameter?.locale)\">\r\n        {{_getText(_value | currency: colDef.typeParameter?.currencyCode:\r\n        colDef.typeParameter?.display:\r\n        colDef.typeParameter?.digitsInfo:\r\n        colDef.typeParameter?.locale)}}\r\n      </span>\r\n    </ng-container>\r\n    <!-- Percent -->\r\n    <ng-container *ngSwitchCase=\"'percent'\">\r\n      <span [title]=\"_getTooltip(_value | percent: colDef.typeParameter?.digitsInfo:\r\n      colDef.typeParameter?.locale)\">\r\n        {{_getText(_value | percent: colDef.typeParameter?.digitsInfo:\r\n        colDef.typeParameter?.locale)}}\r\n      </span>\r\n    </ng-container>\r\n    <!-- Date -->\r\n    <ng-container *ngSwitchCase=\"'date'\">\r\n      <span [title]=\"_getTooltip(_value | date: colDef.typeParameter?.format:\r\n      colDef.typeParameter?.timezone:\r\n      colDef.typeParameter?.locale)\">\r\n        {{_getText(_value | date: colDef.typeParameter?.format:\r\n        colDef.typeParameter?.timezone:\r\n        colDef.typeParameter?.locale)}}\r\n      </span>\r\n    </ng-container>\r\n    <!-- Default -->\r\n    <ng-container *ngSwitchDefault>\r\n      <span [title]=\"_getTooltip(_value)\">{{_getText(_value)}}</span>\r\n    </ng-container>\r\n  </ng-container>\r\n</ng-template>\r\n", styles: [".mtx-grid-img{display:block;width:30px;border-radius:4px;cursor:pointer}\n"] }]
        }], ctorParameters: function () { return [{ type: i1.MtxDialog }, { type: i2.MtxGridUtils }, { type: i0.KeyValueDiffers }, { type: i0.ChangeDetectorRef }]; }, propDecorators: { rowData: [{
                type: Input
            }], colDef: [{
                type: Input
            }], data: [{
                type: Input
            }], summary: [{
                type: Input
            }], placeholder: [{
                type: Input
            }], rowDataChange: [{
                type: Output
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2VsbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL2V4dGVuc2lvbnMvZ3JpZC9jZWxsLnRzIiwiLi4vLi4vLi4vLi4vcHJvamVjdHMvZXh0ZW5zaW9ucy9ncmlkL2NlbGwuaHRtbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQ0wsdUJBQXVCLEVBRXZCLFNBQVMsRUFFVCxZQUFZLEVBQ1osS0FBSyxFQU1MLE1BQU0sRUFDTixpQkFBaUIsR0FDbEIsTUFBTSxlQUFlLENBQUM7QUFJdkIsT0FBTyxXQUFXLE1BQU0sYUFBYSxDQUFDOzs7Ozs7Ozs7OztBQVV0QyxNQUFNLE9BQU8sV0FBVztJQW9CdEIsSUFBSSxNQUFNO1FBQ1IsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUM3RCxDQUFDO0lBRUQsWUFDVSxPQUFrQixFQUNsQixNQUFvQixFQUNwQixRQUF5QixFQUN6QixrQkFBcUM7UUFIckMsWUFBTyxHQUFQLE9BQU8sQ0FBVztRQUNsQixXQUFNLEdBQU4sTUFBTSxDQUFjO1FBQ3BCLGFBQVEsR0FBUixRQUFRLENBQWlCO1FBQ3pCLHVCQUFrQixHQUFsQixrQkFBa0IsQ0FBbUI7UUEzQi9DLGVBQWU7UUFDTixZQUFPLEdBQXdCLEVBQUUsQ0FBQztRQUszQyxpQkFBaUI7UUFDUixTQUFJLEdBQVUsRUFBRSxDQUFDO1FBRTFCLDJCQUEyQjtRQUNsQixZQUFPLEdBQUcsS0FBSyxDQUFDO1FBRXpCLDJEQUEyRDtRQUNsRCxnQkFBVyxHQUFXLElBQUksQ0FBQztRQUUxQixrQkFBYSxHQUFHLElBQUksWUFBWSxFQUFxQyxDQUFDO0lBYTdFLENBQUM7SUFFSixRQUFRO1FBQ04sSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFD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QUcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO1FBQ2pELENBQUMsQ0FBQyxDQUFDO1FBRUgsTUFBTSxhQUFhLEdBQ2pCLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQztZQUNiLENBQUMsQ0FBQyxDQUFDLFFBQVEsRUFBRSxTQUFTLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxhQUFhLEVBQUUsWUFBWSxFQUFFLFlBQVksQ0FBQztZQUNsRixDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUUsU0FBUyxFQUFFLGFBQWEsRUFBRSxZQUFZLEVBQUUsWUFBWSxDQUFDLENBQUM7UUFFdkUsTUFBTSxPQUFPLEdBQXdCO1lBQ25DLEtBQUssRUFBRSxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUM7WUFDdEIsYUFBYTtTQUNkLENBQUM7UUFFRixNQUFNLFdBQVcsR0FBRyxJQUFJLFdBQVcsQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDckQsQ0FBQzs7MkhBMUdVLFdBQVc7K0dBQVgsV0FBVyw2T0M1QnhCLDRvTEFtSEE7MkZEdkZhLFdBQVc7a0JBUnZCLFNBQVM7K0JBQ0UsZUFBZSxZQUNmLGFBQWEsaUJBR1IsaUJBQWlCLENBQUMsSUFBSSxtQkFDcEIsdUJBQXVCLENBQUMsTUFBTTt5TEFJdEMsT0FBTztzQkFBZixLQUFLO2dCQUdHLE1BQU07c0JBQWQsS0FBSztnQkFHRyxJQUFJO3NCQUFaLEtBQUs7Z0JBR0csT0FBTztzQkFBZixLQUFLO2dCQUdHLFdBQVc7c0JBQW5CLEtBQUs7Z0JBRUksYUFBYTtzQkFBdEIsTUFBTSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBDaGFuZ2VEZXRlY3RvclJlZixcbiAgQ29tcG9uZW50LFxuICBEb0NoZWNrLFxuICBFdmVudEVtaXR0ZXIsXG4gIElucHV0LFxuICBLZXlWYWx1ZUNoYW5nZVJlY29yZCxcbiAgS2V5VmFsdWVDaGFuZ2VzLFxuICBLZXlWYWx1ZURpZmZlcixcbiAgS2V5VmFsdWVEaWZmZXJzLFxuICBPbkluaXQsXG4gIE91dHB1dCxcbiAgVmlld0VuY2Fwc3VsYXRpb24sXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgTXR4RGlhbG9nIH0gZnJvbSAnQG5nLW1hdGVyby9leHRlbnNpb25zL2RpYWxvZyc7XG5pbXBvcnQgeyBNdHhHcmlkVXRpbHMgfSBmcm9tICcuL2dyaWQtdXRpbHMnO1xuaW1wb3J0IHsgTXR4R3JpZENvbHVtbiwgTXR4R3JpZENvbHVtbkJ1dHRvbiB9IGZyb20gJy4vaW50ZXJmYWNlcyc7XG5pbXBvcnQgUGhvdG9WaWV3ZXIgZnJvbSAncGhvdG92aWV3ZXInO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdtdHgtZ3JpZC1jZWxsJyxcbiAgZXhwb3J0QXM6ICdtdHhHcmlkQ2VsbCcsXG4gIHRlbXBsYXRlVXJsOiAnLi9jZWxsLmh0bWwnLFxuICBzdHlsZVVybHM6IFsnLi9jZWxsLnNjc3MnXSxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG59KVxuZXhwb3J0IGNsYXNzIE10eEdyaWRDZWxsIGltcGxlbWVudHMgT25Jbml0LCBEb0NoZWNrIHtcbiAgLyoqIFJvdyBkYXRhICovXG4gIEBJbnB1dCgpIHJvd0RhdGE6IFJlY29yZDxzdHJpbmcsIGFueT4gPSB7fTtcblxuICAvKiogQ29sdW1uIGRlZmluaXRpb24gKi9cbiAgQElucHV0KCkgY29sRGVmITogTXR4R3JpZENvbHVtbjtcblxuICAvKiogVGFibGUgZGF0YSAqL1xuICBASW5wdXQoKSBkYXRhOiBhbnlbXSA9IFtdO1xuXG4gIC8qKiBXaGV0aGVyIHNob3cgc3VtbWFyeSAqL1xuICBASW5wdXQoKSBzdW1tYXJ5ID0gZmFsc2U7XG5cbiAgLyoqIFBsYWNlaG9sZGVyIGZvciB0aGUgZW1wdHkgdmFsdWUgKGBudWxsYCwgYCcnYCwgYFtdYCkgKi9cbiAgQElucHV0KCkgcGxhY2Vob2xkZXI6IHN0cmluZyA9ICctLSc7XG5cbiAgQE91dHB1dCgpIHJvd0RhdGFDaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyPEtleVZhbHVlQ2hhbmdlUmVjb3JkPHN0cmluZywgYW55Pj4oKTtcblxuICBwcml2YXRlIHJvd0RhdGFEaWZmZXI/OiBLZXlWYWx1ZURpZmZlcjxzdHJpbmcsIGFueT47XG5cbiAgZ2V0IF92YWx1ZSgpIHtcbiAgICByZXR1cm4gdGhpcy5fdXRpbHMuZ2V0Q2VsbFZhbHVlKHRoaXMucm93RGF0YSwgdGhpcy5jb2xEZWYpO1xuICB9XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBfZGlhbG9nOiBNdHhEaWFsb2csXG4gICAgcHJpdmF0ZSBfdXRpbHM6IE10eEdyaWRVdGlscyxcbiAgICBwcml2YXRlIF9kaWZmZXJzOiBLZXlWYWx1ZURpZmZlcnMsXG4gICAgcHJpdmF0ZSBfY2hhbmdlRGV0ZWN0b3JSZWY6IENoYW5nZURldGVjdG9yUmVmXG4gICkge31cblxuICBuZ09uSW5pdCgpOiB2b2lkIHtcbiAgICB0aGlzLnJvd0RhdGFEaWZmZXIgPSB0aGlzLl9kaWZmZXJzLmZpbmQodGhpcy5yb3dEYXRhKS5jcmVhdGUoKTtcbiAgfVxuXG4gIG5nRG9DaGVjaygpOiB2b2lkIHtcbiAgICBjb25zdCBjaGFuZ2VzID0gdGhpcy5yb3dEYXRhRGlmZmVyPy5kaWZmKHRoaXMucm93RGF0YSk7XG4gICAgaWYgKGNoYW5nZXMpIHtcbiAgICAgIHRoaXMuX2FwcGx5Q2hhbmdlcyhjaGFuZ2VzKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIF9hcHBseUNoYW5nZXMoY2hhbmdlczogS2V5VmFsdWVDaGFuZ2VzPHN0cmluZywgYW55Pikge1xuICAgIGNoYW5nZXMuZm9yRWFjaENoYW5nZWRJdGVtKHJlY29yZCA9PiB7XG4gICAgICB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKTtcbiAgICAgIHRoaXMucm93RGF0YUNoYW5nZS5lbWl0KHJlY29yZCk7XG4gICAgfSk7XG4gIH1cblxuICBfZ2V0VGV4dCh2YWx1ZTogYW55KSB7XG4gICAgcmV0dXJuIHZhbHVlID09PSB1bmRlZmluZWQgPyAnJyA6IHRoaXMuX3V0aWxzLmlzRW1wdHkodmFsdWUpID8gdGhpcy5wbGFjZWhvbGRlciA6IHZhbHVlO1xuICB9XG5cbiAgX2dldFRvb2x0aXAodmFsdWU6IGFueSkge1xuICAgIHJldHVybiB0aGlzLl91dGlscy5pc0VtcHR5KHZhbHVlKSA/ICcnIDogdmFsdWU7XG4gIH1cblxuICBfZ2V0Rm9ybWF0dGVyVG9vbHRpcCh2YWx1ZTogYW55KSB7XG4gICAgcmV0dXJuIHRoaXMuX3V0aWxzLmlzQ29udGFpbkhUTUwodmFsdWUpIHx8IHRoaXMuX3V0aWxzLmlzRW1wdHkodmFsdWUpID8gJycgOiB2YWx1ZTtcbiAgfVxuXG4gIF9vbkFjdGlvbkNsaWNrKGV2ZW50OiBNb3VzZUV2ZW50LCBidG46IE10eEdyaWRDb2x1bW5CdXR0b24sIHJvd0RhdGE6IFJlY29yZDxzdHJpbmcsIGFueT4pIHtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuXG4gICAgaWYgKGJ0bi5wb3ApIHtcbiAgICAgIHRoaXMuX2RpYWxvZy5vcGVuKHtcbiAgICAgICAgdGl0bGU6IGJ0bi5wb3A/LnRpdGxlLFxuICAgICAgICBkZXNjcmlwdGlvbjogYnRuLnBvcD8uZGVzY3JpcHRpb24sXG4gICAgICAgIGJ1dHRvbnM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBjb2xvcjogYnRuLnBvcD8ub2tDb2xvciB8fCAncHJpbWFyeScsXG4gICAgICAgICAgICB0ZXh0OiBidG4ucG9wPy5va1RleHQgfHwgJ09LJyxcbiAgICAgICAgICAgIG9uQ2xpY2s6ICgpID0+IGJ0bi5jbGljaz8uKHJvd0RhdGEpIHx8IHt9LFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgY29sb3I6IGJ0bi5wb3A/LmNsb3NlQ29sb3IsXG4gICAgICAgICAgICB0ZXh0OiBidG4ucG9wPy5jbG9zZVRleHQgfHwgJ0NMT1NFJyxcbiAgICAgICAgICAgIG9uQ2xpY2s6ICgpID0+IHt9LFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgYnRuLmNsaWNrPy4ocm93RGF0YSk7XG4gICAgfVxuICB9XG5cbiAgLyoqIFByZXZpZXcgZW5sYXJnZWQgaW1hZ2UgKi9cbiAgX29uSW1hZ2VQcmV2aWV3KHVybFN0cjogc3RyaW5nKSB7XG4gICAgY29uc3QgaW1nczogUGhvdG9WaWV3ZXIuSW1nW10gPSBbXTtcblxuICAgIHRoaXMuX3V0aWxzLnN0cjJhcnIodXJsU3RyKS5mb3JFYWNoKCh1cmwsIGluZGV4KSA9PiB7XG4gICAgICBpbWdzLnB1c2goeyB0aXRsZTogaW5kZXggKyAxICsgJycsIHNyYzogdXJsIH0pO1xuICAgIH0pO1xuXG4gICAgY29uc3QgZm9vdGVyVG9vbGJhciA9XG4gICAgICBpbWdzLmxlbmd0aCA+IDFcbiAgICAgICAgPyBbJ3pvb21JbicsICd6b29tT3V0JywgJ3ByZXYnLCAnbmV4dCcsICdyb3RhdGVSaWdodCcsICdyb3RhdGVMZWZ0JywgJ2FjdHVhbFNpemUnXVxuICAgICAgICA6IFsnem9vbUluJywgJ3pvb21PdXQnLCAncm90YXRlUmlnaHQnLCAncm90YXRlTGVmdCcsICdhY3R1YWxTaXplJ107XG5cbiAgICBjb25zdCBvcHRpb25zOiBQaG90b1ZpZXdlci5PcHRpb25zID0ge1xuICAgICAgdGl0bGU6IGltZ3MubGVuZ3RoID4gMSxcbiAgICAgIGZvb3RlclRvb2xiYXIsXG4gICAgfTtcblxuICAgIGNvbnN0IHBob3Rvdmlld2VyID0gbmV3IFBob3RvVmlld2VyKGltZ3MsIG9wdGlvbnMpO1xuICB9XG59XG4iLCI8c3BhbiAqbmdJZj1cInN1bW1hcnk7IGVsc2UgY3VzdG9tQ2VsbEZvcm1hdHRpbmdUcGxcIlxyXG4gICAgICBbdGl0bGVdPVwiX2dldEZvcm1hdHRlclRvb2x0aXAoKGRhdGEgfCBjZWxsU3VtbWFyeTogY29sRGVmKSlcIlxyXG4gICAgICBbaW5uZXJIVE1MXT1cIl9nZXRUZXh0KChkYXRhIHwgY2VsbFN1bW1hcnk6IGNvbERlZikpXCI+XHJcbjwvc3Bhbj5cclxuXHJcbjwhLS0gQ3VzdG9tIGZvcm1hdHRpbmcgLS0+XHJcbjxuZy10ZW1wbGF0ZSAjY3VzdG9tQ2VsbEZvcm1hdHRpbmdUcGw+XHJcbiAgPHNwYW4gKm5nSWY9XCJjb2xEZWYuZm9ybWF0dGVyOyBlbHNlIGRlZmF1bHRDZWxsRm9ybWF0dGluZ1RwbFwiXHJcbiAgICAgICAgW3RpdGxlXT1cIl9nZXRGb3JtYXR0ZXJUb29sdGlwKGNvbERlZi5mb3JtYXR0ZXIocm93RGF0YSwgY29sRGVmKSlcIlxyXG4gICAgICAgIFtpbm5lckhUTUxdPVwiX2dldFRleHQoY29sRGVmLmZvcm1hdHRlcihyb3dEYXRhLCBjb2xEZWYpKVwiPlxyXG4gIDwvc3Bhbj5cclxuPC9uZy10ZW1wbGF0ZT5cclxuXHJcbjwhLS0gRGVmYXVsdCBmb3JtYXR0aW5nIC0tPlxyXG48bmctdGVtcGxhdGUgI2RlZmF1bHRDZWxsRm9ybWF0dGluZ1RwbD5cclxuICA8bmctY29udGFpbmVyIFtuZ1N3aXRjaF09XCJjb2xEZWYudHlwZVwiPlxyXG4gICAgPCEtLSBUYWcgLS0+XHJcbiAgICA8bmctY29udGFpbmVyICpuZ1N3aXRjaENhc2U9XCIndGFnJ1wiPlxyXG4gICAgICA8bWF0LWNoaXAtbGlzdGJveCAqbmdJZj1cImNvbERlZi50YWcgJiYgY29sRGVmLnRhZ1tfdmFsdWVdOyBlbHNlIHRhZ0VtcHR5VHBsXCI+XHJcbiAgICAgICAgPG1hdC1jaGlwIGNvbG9yPVwicHJpbWFyeVwiIFtuZ0NsYXNzXT1cIlsnYmctJyArIGNvbERlZi50YWdbX3ZhbHVlXS5jb2xvcl1cIj5cclxuICAgICAgICAgIHt7Y29sRGVmLnRhZ1tfdmFsdWVdLnRleHR9fVxyXG4gICAgICAgIDwvbWF0LWNoaXA+XHJcbiAgICAgIDwvbWF0LWNoaXAtbGlzdGJveD5cclxuICAgICAgPG5nLXRlbXBsYXRlICN0YWdFbXB0eVRwbD57e192YWx1ZX19PC9uZy10ZW1wbGF0ZT5cclxuICAgIDwvbmctY29udGFpbmVyPlxyXG4gICAgPCEtLSBCdXR0b25zIC0tPlxyXG4gICAgPG5nLWNvbnRhaW5lciAqbmdTd2l0Y2hDYXNlPVwiJ2J1dHRvbidcIj5cclxuICAgICAgPG5nLWNvbnRhaW5lciAqbmdGb3I9XCJsZXQgYnRuIG9mIGNvbERlZi5idXR0b25zO1wiPlxyXG4gICAgICAgIDxuZy1jb250YWluZXIgKm5nSWY9XCIhYnRuLmlpZiB8fCBidG4uaWlmKHJvd0RhdGEpXCI+XHJcbiAgICAgICAgICA8YnV0dG9uICpuZ0lmPVwiYnRuLnR5cGU9PT0nYmFzaWMnXCJcclxuICAgICAgICAgICAgICAgICAgW25nQ2xhc3NdPVwiWydtdHgtZ3JpZC1hY3Rpb24tYnV0dG9uJywgYnRuLmNsYXNzfHwnJ11cIlxyXG4gICAgICAgICAgICAgICAgICBtYXQtYnV0dG9uIFtjb2xvcl09XCJidG4uY29sb3IgfHwgJ3ByaW1hcnknXCJcclxuICAgICAgICAgICAgICAgICAgW2Rpc2FibGVkXT1cIihidG4gfCBjZWxsQWN0aW9uRGlzYWJsZTogcm93RGF0YSlcIlxyXG4gICAgICAgICAgICAgICAgICBbbWF0VG9vbHRpcF09XCIoYnRuIHwgY2VsbEFjdGlvblRvb2x0aXApLm1lc3NhZ2UgfCB0b09ic2VydmFibGUgfCBhc3luY1wiXHJcbiAgICAgICAgICAgICAgICAgIFttYXRUb29sdGlwQ2xhc3NdPVwiKGJ0biB8IGNlbGxBY3Rpb25Ub29sdGlwKS5jbGFzc1wiXHJcbiAgICAgICAgICAgICAgICAgIFttYXRUb29sdGlwSGlkZURlbGF5XT1cIihidG4gfCBjZWxsQWN0aW9uVG9vbHRpcCkuaGlkZURlbGF5XCJcclxuICAgICAgICAgICAgICAgICAgW21hdFRvb2x0aXBTaG93RGVsYXldPVwiKGJ0biB8IGNlbGxBY3Rpb25Ub29sdGlwKS5zaG93RGVsYXlcIlxyXG4gICAgICAgICAgICAgICAgICBbbWF0VG9vbHRpcFBvc2l0aW9uXT1cIihidG4gfCBjZWxsQWN0aW9uVG9vbHRpcCkucG9zaXRpb24gfHwgJ2JlbG93J1wiXHJcbiAgICAgICAgICAgICAgICAgIFttYXRUb29sdGlwVG91Y2hHZXN0dXJlc109XCIoYnRuIHwgY2VsbEFjdGlvblRvb2x0aXApLnRvdWNoR2VzdHVyZXMgfHwgJ2F1dG8nXCJcclxuICAgICAgICAgICAgICAgICAgKGNsaWNrKT1cIl9vbkFjdGlvbkNsaWNrKCRldmVudCwgYnRuLCByb3dEYXRhKVwiPlxyXG4gICAgICAgICAgICA8bWF0LWljb24gY2xhc3M9XCJtdHgtZ3JpZC1pY29uXCIgKm5nSWY9XCJidG4uaWNvblwiPnt7YnRuLmljb259fTwvbWF0LWljb24+XHJcbiAgICAgICAgICAgIDxzcGFuPnt7YnRuLnRleHQgfCB0b09ic2VydmFibGUgfCBhc3luY319PC9zcGFuPlxyXG4gICAgICAgICAgPC9idXR0b24+XHJcbiAgICAgICAgICA8YnV0dG9uICpuZ0lmPVwiIWJ0bi50eXBlIHx8IGJ0bi50eXBlPT09J2ljb24nXCJcclxuICAgICAgICAgICAgICAgICAgW25nQ2xhc3NdPVwiWydtdHgtZ3JpZC1hY3Rpb24tYnV0dG9uJywgYnRuLmNsYXNzfHwnJ11cIlxyXG4gICAgICAgICAgICAgICAgICBtYXQtaWNvbi1idXR0b24gW2NvbG9yXT1cImJ0bi5jb2xvciB8fCAncHJpbWFyeSdcIlxyXG4gICAgICAgICAgICAgICAgICBbZGlzYWJsZWRdPVwiKGJ0biB8IGNlbGxBY3Rpb25EaXNhYmxlOiByb3dEYXRhKVwiXHJcbiAgICAgICAgICAgICAgICAgIFttYXRUb29sdGlwXT1cIihidG4gfCBjZWxsQWN0aW9uVG9vbHRpcCkubWVzc2FnZSB8IHRvT2JzZXJ2YWJsZSB8IGFzeW5jXCJcclxuICAgICAgICAgICAgICAgICAgW21hdFRvb2x0aXBDbGFzc109XCIoYnRuIHwgY2VsbEFjdGlvblRvb2x0aXApLmNsYXNzXCJcclxuICAgICAgICAgICAgICAgICAgW21hdFRvb2x0aXBIaWRlRGVsYXldPVwiKGJ0biB8IGNlbGxBY3Rpb25Ub29sdGlwKS5oaWRlRGVsYXlcIlxyXG4gICAgICAgICAgICAgICAgICBbbWF0VG9vbHRpcFNob3dEZWxheV09XCIoYnRuIHwgY2VsbEFjdGlvblRvb2x0aXApLnNob3dEZWxheVwiXHJcbiAgICAgICAgICAgICAgICAgIFttYXRUb29sdGlwUG9zaXRpb25dPVwiKGJ0biB8IGNlbGxBY3Rpb25Ub29sdGlwKS5wb3NpdGlvbiB8fCAnYmVsb3cnXCJcclxuICAgICAgICAgICAgICAgICAgW21hdFRvb2x0aXBUb3VjaEdlc3R1cmVzXT1cIihidG4gfCBjZWxsQWN0aW9uVG9vbHRpcCkudG91Y2hHZXN0dXJlcyB8fCAnYXV0bydcIlxyXG4gICAgICAgICAgICAgICAgICAoY2xpY2spPVwiX29uQWN0aW9uQ2xpY2soJGV2ZW50LCBidG4sIHJvd0RhdGEpXCI+XHJcbiAgICAgICAgICAgIDxtYXQtaWNvbiBjbGFzcz1cIm10eC1ncmlkLWljb25cIj57e2J0bi5pY29ufX08L21hdC1pY29uPlxyXG4gICAgICAgICAgPC9idXR0b24+XHJcbiAgICAgICAgPC9uZy1jb250YWluZXI+XHJcbiAgICAgIDwvbmctY29udGFpbmVyPlxyXG4gICAgPC9uZy1jb250YWluZXI+XHJcbiAgICA8IS0tIExpbmsgLS0+XHJcbiAgICA8bmctY29udGFpbmVyICpuZ1N3aXRjaENhc2U9XCInbGluaydcIj5cclxuICAgICAgPGEgW2hyZWZdPVwiX3ZhbHVlXCIgdGFyZ2V0PVwiX2JsYW5rXCI+e3tfdmFsdWV9fTwvYT5cclxuICAgIDwvbmctY29udGFpbmVyPlxyXG4gICAgPCEtLSBJbWFnZSAtLT5cclxuICAgIDxuZy1jb250YWluZXIgKm5nU3dpdGNoQ2FzZT1cIidpbWFnZSdcIj5cclxuICAgICAgPGltZyBjbGFzcz1cIm10eC1ncmlkLWltZ1wiIFtzcmNdPVwiX3ZhbHVlXCIgKGNsaWNrKT1cIl9vbkltYWdlUHJldmlldyhfdmFsdWUpXCI+XHJcbiAgICA8L25nLWNvbnRhaW5lcj5cclxuICAgIDwhLS0gQm9vbGVhbiAtLT5cclxuICAgIDxuZy1jb250YWluZXIgKm5nU3dpdGNoQ2FzZT1cIidib29sZWFuJ1wiPlxyXG4gICAgICA8c3BhbiBbdGl0bGVdPVwiX2dldFRvb2x0aXAoX3ZhbHVlKVwiPnt7X2dldFRleHQoX3ZhbHVlKX19PC9zcGFuPlxyXG4gICAgPC9uZy1jb250YWluZXI+XHJcbiAgICA8IS0tIE51bWJlciAtLT5cclxuICAgIDxuZy1jb250YWluZXIgKm5nU3dpdGNoQ2FzZT1cIidudW1iZXInXCI+XHJcbiAgICAgIDxzcGFuIFt0aXRsZV09XCJfZ2V0VG9vbHRpcChfdmFsdWUgfCBudW1iZXI6IGNvbERlZi50eXBlUGFyYW1ldGVyPy5kaWdpdHNJbmZvOlxyXG4gICAgICBjb2xEZWYudHlwZVBhcmFtZXRlcj8ubG9jYWxlKVwiPlxyXG4gICAgICAgIHt7X2dldFRleHQoX3ZhbHVlIHwgbnVtYmVyOiBjb2xEZWYudHlwZVBhcmFtZXRlcj8uZGlnaXRzSW5mbzpcclxuICAgICAgICBjb2xEZWYudHlwZVBhcmFtZXRlcj8ubG9jYWxlKX19XHJcbiAgICAgIDwvc3Bhbj5cclxuICAgIDwvbmctY29udGFpbmVyPlxyXG4gICAgPCEtLSBDdXJyZW5jeSAtLT5cclxuICAgIDxuZy1jb250YWluZXIgKm5nU3dpdGNoQ2FzZT1cIidjdXJyZW5jeSdcIj5cclxuICAgICAgPHNwYW4gW3RpdGxlXT1cIl9nZXRUb29sdGlwKF92YWx1ZSB8IGN1cnJlbmN5OiBjb2xEZWYudHlwZVBhcmFtZXRlcj8uY3VycmVuY3lDb2RlOlxyXG4gICAgICBjb2xEZWYudHlwZVBhcmFtZXRlcj8uZGlzcGxheTpcclxuICAgICAgY29sRGVmLnR5cGVQYXJhbWV0ZXI/LmRpZ2l0c0luZm86XHJcbiAgICAgIGNvbERlZi50eXBlUGFyYW1ldGVyPy5sb2NhbGUpXCI+XHJcbiAgICAgICAge3tfZ2V0VGV4dChfdmFsdWUgfCBjdXJyZW5jeTogY29sRGVmLnR5cGVQYXJhbWV0ZXI/LmN1cnJlbmN5Q29kZTpcclxuICAgICAgICBjb2xEZWYudHlwZVBhcmFtZXRlcj8uZGlzcGxheTpcclxuICAgICAgICBjb2xEZWYudHlwZVBhcmFtZXRlcj8uZGlnaXRzSW5mbzpcclxuICAgICAgICBjb2xEZWYudHlwZVBhcmFtZXRlcj8ubG9jYWxlKX19XHJcbiAgICAgIDwvc3Bhbj5cclxuICAgIDwvbmctY29udGFpbmVyPlxyXG4gICAgPCEtLSBQZXJjZW50IC0tPlxyXG4gICAgPG5nLWNvbnRhaW5lciAqbmdTd2l0Y2hDYXNlPVwiJ3BlcmNlbnQnXCI+XHJcbiAgICAgIDxzcGFuIFt0aXRsZV09XCJfZ2V0VG9vbHRpcChfdmFsdWUgfCBwZXJjZW50OiBjb2xEZWYudHlwZVBhcmFtZXRlcj8uZGlnaXRzSW5mbzpcclxuICAgICAgY29sRGVmLnR5cGVQYXJhbWV0ZXI/LmxvY2FsZSlcIj5cclxuICAgICAgICB7e19nZXRUZXh0KF92YWx1ZSB8IHBlcmNlbnQ6IGNvbERlZi50eXBlUGFyYW1ldGVyPy5kaWdpdHNJbmZvOlxyXG4gICAgICAgIGNvbERlZi50eXBlUGFyYW1ldGVyPy5sb2NhbGUpfX1cclxuICAgICAgPC9zcGFuPlxyXG4gICAgPC9uZy1jb250YWluZXI+XHJcbiAgICA8IS0tIERhdGUgLS0+XHJcbiAgICA8bmctY29udGFpbmVyICpuZ1N3aXRjaENhc2U9XCInZGF0ZSdcIj5cclxuICAgICAgPHNwYW4gW3RpdGxlXT1cIl9nZXRUb29sdGlwKF92YWx1ZSB8IGRhdGU6IGNvbERlZi50eXBlUGFyYW1ldGVyPy5mb3JtYXQ6XHJcbiAgICAgIGNvbERlZi50eXBlUGFyYW1ldGVyPy50aW1lem9uZTpcclxuICAgICAgY29sRGVmLnR5cGVQYXJhbWV0ZXI/LmxvY2FsZSlcIj5cclxuICAgICAgICB7e19nZXRUZXh0KF92YWx1ZSB8IGRhdGU6IGNvbERlZi50eXBlUGFyYW1ldGVyPy5mb3JtYXQ6XHJcbiAgICAgICAgY29sRGVmLnR5cGVQYXJhbWV0ZXI/LnRpbWV6b25lOlxyXG4gICAgICAgIGNvbERlZi50eXBlUGFyYW1ldGVyPy5sb2NhbGUpfX1cclxuICAgICAgPC9zcGFuPlxyXG4gICAgPC9uZy1jb250YWluZXI+XHJcbiAgICA8IS0tIERlZmF1bHQgLS0+XHJcbiAgICA8bmctY29udGFpbmVyICpuZ1N3aXRjaERlZmF1bHQ+XHJcbiAgICAgIDxzcGFuIFt0aXRsZV09XCJfZ2V0VG9vbHRpcChfdmFsdWUpXCI+e3tfZ2V0VGV4dChfdmFsdWUpfX08L3NwYW4+XHJcbiAgICA8L25nLWNvbnRhaW5lcj5cclxuICA8L25nLWNvbnRhaW5lcj5cclxuPC9uZy10ZW1wbGF0ZT5cclxuIl19