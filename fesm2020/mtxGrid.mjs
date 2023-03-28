import * as i0 from '@angular/core';
import { Injectable, Inject, Directive, Component, ChangeDetectionStrategy, ViewEncapsulation, HostBinding, Input, Pipe, EventEmitter, Output, ViewChild, HostListener, ContentChildren, NgModule } from '@angular/core';
import * as i3$1 from '@angular/common';
import { DOCUMENT, CommonModule } from '@angular/common';
import * as i2$1 from '@angular/forms';
import { FormsModule } from '@angular/forms';
import * as i3$3 from '@angular/material/table';
import { MatTableDataSource, MatRowDef, MatHeaderRowDef, MatFooterRow, MatTable, MatTableModule } from '@angular/material/table';
import * as i4$2 from '@angular/material/sort';
import { MatSort, MatSortModule } from '@angular/material/sort';
import * as i5$1 from '@angular/material/paginator';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import * as i3$2 from '@angular/material/checkbox';
import { MatCheckboxModule } from '@angular/material/checkbox';
import * as i4$1 from '@angular/material/button';
import { MatButtonModule } from '@angular/material/button';
import * as i8$1 from '@angular/material/progress-bar';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import * as i5 from '@angular/material/chips';
import { MatChipsModule } from '@angular/material/chips';
import * as i6 from '@angular/material/tooltip';
import { MatTooltipModule } from '@angular/material/tooltip';
import * as i7 from '@angular/material/icon';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import * as i6$1 from '@angular/material/menu';
import { MatMenuTrigger, MatMenuModule } from '@angular/material/menu';
import * as i7$1 from '@angular/cdk/drag-drop';
import { moveItemInArray, DragDropModule } from '@angular/cdk/drag-drop';
import * as i8 from '@ng-matero/extensions/core';
import { MtxPipesModule } from '@ng-matero/extensions/core';
import * as i1$1 from '@ng-matero/extensions/dialog';
import { MtxDialogModule } from '@ng-matero/extensions/dialog';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { SelectionModel } from '@angular/cdk/collections';
import * as i2 from '@ng-matero/extensions/column-resize';
import { CdkFlexTableResizeStrategy, ResizeStrategy, ColumnResizeNotifier, HeaderRowEventDispatcher, ColumnResizeNotifierSource, TABLE_LAYOUT_FIXED_RESIZE_STRATEGY_PROVIDER, ColumnResize, ResizeOverlayHandle, Resizable } from '@ng-matero/extensions/column-resize';
export { TABLE_LAYOUT_FIXED_RESIZE_STRATEGY_PROVIDER as MAT_TABLE_LAYOUT_FIXED_RESIZE_STRATEGY_PROVIDER } from '@ng-matero/extensions/column-resize';
import * as i1 from '@angular/cdk/table';
import { _COALESCED_STYLE_SCHEDULER } from '@angular/cdk/table';
import * as i3 from '@angular/cdk/bidi';
import * as i4 from '@angular/cdk/overlay';
import { OverlayModule } from '@angular/cdk/overlay';
import PhotoViewer from 'photoviewer';
import { isObservable } from 'rxjs';

class MtxGridUtils {
    constructor() { }
    /**
     * Get cell's value based on the data and column's field (e.g. `a.b.c`)
     * @param rowData Row data
     * @param colDef Column definition
     * @returns
     */
    getCellValue(rowData, colDef) {
        const keyArr = colDef.field ? colDef.field.split('.') : [];
        let tmp = '';
        keyArr.forEach((key, i) => {
            if (i === 0) {
                tmp = rowData[key];
            }
            else {
                tmp = tmp && tmp[key];
            }
        });
        return tmp;
    }
    /**
     * Get all data of a col
     * @param data All data
     * @param colDef Column definition
     * @returns
     */
    getColData(data, colDef) {
        return data.map(rowData => this.getCellValue(rowData, colDef));
    }
    /**
     * Remove white spaces in a string and convert string to array
     * @param str
     * @returns
     */
    str2arr(str) {
        return str.replace(/[\r\n\s]/g, '').split(',');
    }
    /**
     * Whether the value is empty (`null`, `undefined`, `''`, `[]`)
     * @param value
     * @returns
     */
    isEmpty(value) {
        return value == null || value.toString() === '';
    }
    /**
     * Whether the value contain HTML
     * @param value
     * @returns
     */
    isContainHTML(value) {
        return /<\/?[a-z][\s\S]*>/i.test(value);
    }
}
/** @nocollapse */ MtxGridUtils.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MtxGridUtils, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
/** @nocollapse */ MtxGridUtils.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MtxGridUtils });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MtxGridUtils, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return []; } });

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * Overrides CdkFlexTableResizeStrategy to match mat-column elements.
 */
class MatFlexTableResizeStrategy extends CdkFlexTableResizeStrategy {
    constructor(columnResize, styleScheduler, table, document) {
        super(columnResize, styleScheduler, table, document);
    }
    getColumnCssClass(cssFriendlyColumnName) {
        return `mat-column-${cssFriendlyColumnName}`;
    }
}
/** @nocollapse */ MatFlexTableResizeStrategy.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MatFlexTableResizeStrategy, deps: [{ token: i2.ColumnResize }, { token: _COALESCED_STYLE_SCHEDULER }, { token: i1.CdkTable }, { token: DOCUMENT }], target: i0.ɵɵFactoryTarget.Injectable });
/** @nocollapse */ MatFlexTableResizeStrategy.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MatFlexTableResizeStrategy });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MatFlexTableResizeStrategy, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i2.ColumnResize }, { type: i1._CoalescedStyleScheduler, decorators: [{
                    type: Inject,
                    args: [_COALESCED_STYLE_SCHEDULER]
                }] }, { type: i1.CdkTable }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }]; } });
const FLEX_RESIZE_STRATEGY_PROVIDER = {
    provide: ResizeStrategy,
    useClass: MatFlexTableResizeStrategy,
};

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
const PROVIDERS = [
    ColumnResizeNotifier,
    HeaderRowEventDispatcher,
    ColumnResizeNotifierSource,
];
const TABLE_PROVIDERS = [
    ...PROVIDERS,
    TABLE_LAYOUT_FIXED_RESIZE_STRATEGY_PROVIDER,
];
const FLEX_PROVIDERS = [...PROVIDERS, FLEX_RESIZE_STRATEGY_PROVIDER];
const TABLE_HOST_BINDINGS = {
    class: 'mat-column-resize-table',
};
const FLEX_HOST_BINDINGS = {
    class: 'mat-column-resize-flex',
};
class AbstractMatColumnResize extends ColumnResize {
    getTableHeight() {
        const table = this.elementRef.nativeElement;
        const tableParent = table.parentNode;
        const isTableContainer = tableParent.classList.contains('mat-table-container');
        return isTableContainer ? tableParent.offsetHeight : table.offsetHeight;
    }
}

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * Explicitly enables column resizing for a table-based mat-table.
 * Individual columns must be annotated specifically.
 */
class MatColumnResize extends AbstractMatColumnResize {
    constructor(columnResizeNotifier, elementRef, eventDispatcher, ngZone, notifier) {
        super();
        this.columnResizeNotifier = columnResizeNotifier;
        this.elementRef = elementRef;
        this.eventDispatcher = eventDispatcher;
        this.ngZone = ngZone;
        this.notifier = notifier;
    }
}
/** @nocollapse */ MatColumnResize.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MatColumnResize, deps: [{ token: i2.ColumnResizeNotifier }, { token: i0.ElementRef }, { token: i2.HeaderRowEventDispatcher }, { token: i0.NgZone }, { token: i2.ColumnResizeNotifierSource }], target: i0.ɵɵFactoryTarget.Directive });
/** @nocollapse */ MatColumnResize.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.2.1", type: MatColumnResize, selector: "table[mat-table][columnResize]", host: { classAttribute: "mat-column-resize-table" }, providers: [...TABLE_PROVIDERS, { provide: ColumnResize, useExisting: MatColumnResize }], usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MatColumnResize, decorators: [{
            type: Directive,
            args: [{
                    selector: 'table[mat-table][columnResize]',
                    host: TABLE_HOST_BINDINGS,
                    providers: [...TABLE_PROVIDERS, { provide: ColumnResize, useExisting: MatColumnResize }],
                }]
        }], ctorParameters: function () { return [{ type: i2.ColumnResizeNotifier }, { type: i0.ElementRef }, { type: i2.HeaderRowEventDispatcher }, { type: i0.NgZone }, { type: i2.ColumnResizeNotifierSource }]; } });

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * Component shown over the edge of a resizable column that is responsible
 * for handling column resize mouse events and displaying a vertical line along the column edge.
 */
class MatColumnResizeOverlayHandle extends ResizeOverlayHandle {
    constructor(columnDef, columnResize, directionality, elementRef, eventDispatcher, ngZone, resizeNotifier, resizeRef, styleScheduler, document) {
        super();
        this.columnDef = columnDef;
        this.columnResize = columnResize;
        this.directionality = directionality;
        this.elementRef = elementRef;
        this.eventDispatcher = eventDispatcher;
        this.ngZone = ngZone;
        this.resizeNotifier = resizeNotifier;
        this.resizeRef = resizeRef;
        this.styleScheduler = styleScheduler;
        this.document = document;
    }
    updateResizeActive(active) {
        super.updateResizeActive(active);
        this.resizeRef.overlayRef.updateSize({
            height: active
                ? this.columnResize.getTableHeight()
                : this.resizeRef.origin.nativeElement.offsetHeight,
        });
    }
}
/** @nocollapse */ MatColumnResizeOverlayHandle.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MatColumnResizeOverlayHandle, deps: [{ token: i1.CdkColumnDef }, { token: i2.ColumnResize }, { token: i3.Directionality }, { token: i0.ElementRef }, { token: i2.HeaderRowEventDispatcher }, { token: i0.NgZone }, { token: i2.ColumnResizeNotifierSource }, { token: i2.ResizeRef }, { token: _COALESCED_STYLE_SCHEDULER }, { token: DOCUMENT }], target: i0.ɵɵFactoryTarget.Component });
/** @nocollapse */ MatColumnResizeOverlayHandle.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.1", type: MatColumnResizeOverlayHandle, selector: "ng-component", host: { classAttribute: "mat-column-resize-overlay-thumb" }, usesInheritance: true, ngImport: i0, template: '', isInline: true, changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MatColumnResizeOverlayHandle, decorators: [{
            type: Component,
            args: [{
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    encapsulation: ViewEncapsulation.None,
                    host: { class: 'mat-column-resize-overlay-thumb' },
                    template: '',
                }]
        }], ctorParameters: function () { return [{ type: i1.CdkColumnDef }, { type: i2.ColumnResize }, { type: i3.Directionality }, { type: i0.ElementRef }, { type: i2.HeaderRowEventDispatcher }, { type: i0.NgZone }, { type: i2.ColumnResizeNotifierSource }, { type: i2.ResizeRef }, { type: i1._CoalescedStyleScheduler, decorators: [{
                    type: Inject,
                    args: [_COALESCED_STYLE_SCHEDULER]
                }] }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }]; } });

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
class AbstractMatResizable extends Resizable {
    constructor() {
        super(...arguments);
        this.minWidthPxInternal = 32;
    }
    getInlineHandleCssClassName() {
        return 'mat-resizable-handle';
    }
    getOverlayHandleComponentType() {
        return MatColumnResizeOverlayHandle;
    }
}
const RESIZABLE_HOST_BINDINGS = {
    class: 'mat-resizable',
};
const RESIZABLE_INPUTS = [
    'minWidthPx: matResizableMinWidthPx',
    'maxWidthPx: matResizableMaxWidthPx',
];

/**
 * Explicitly enables column resizing for a mat-header-cell.
 */
class MatResizable extends AbstractMatResizable {
    get hasResizableClass() {
        return this.isResizable ? RESIZABLE_HOST_BINDINGS.class : '';
    }
    get resizable() {
        return this.isResizable;
    }
    set resizable(newValue) {
        this.isResizable = newValue == null || newValue === '' || newValue;
    }
    constructor(columnDef, columnResize, directionality, document, elementRef, eventDispatcher, injector, ngZone, overlay, resizeNotifier, resizeStrategy, styleScheduler, viewContainerRef, changeDetectorRef) {
        super();
        this.columnDef = columnDef;
        this.columnResize = columnResize;
        this.directionality = directionality;
        this.elementRef = elementRef;
        this.eventDispatcher = eventDispatcher;
        this.injector = injector;
        this.ngZone = ngZone;
        this.overlay = overlay;
        this.resizeNotifier = resizeNotifier;
        this.resizeStrategy = resizeStrategy;
        this.styleScheduler = styleScheduler;
        this.viewContainerRef = viewContainerRef;
        this.changeDetectorRef = changeDetectorRef;
        this.isResizable = true;
        this.document = document;
    }
}
/** @nocollapse */ MatResizable.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MatResizable, deps: [{ token: i1.CdkColumnDef }, { token: i2.ColumnResize }, { token: i3.Directionality }, { token: DOCUMENT }, { token: i0.ElementRef }, { token: i2.HeaderRowEventDispatcher }, { token: i0.Injector }, { token: i0.NgZone }, { token: i4.Overlay }, { token: i2.ColumnResizeNotifierSource }, { token: i2.ResizeStrategy }, { token: _COALESCED_STYLE_SCHEDULER }, { token: i0.ViewContainerRef }, { token: i0.ChangeDetectorRef }], target: i0.ɵɵFactoryTarget.Directive });
/** @nocollapse */ MatResizable.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.2.1", type: MatResizable, selector: "mat-header-cell[resizable], th[mat-header-cell][resizable]", inputs: { minWidthPx: ["matResizableMinWidthPx", "minWidthPx"], maxWidthPx: ["matResizableMaxWidthPx", "maxWidthPx"], resizable: "resizable" }, host: { properties: { "class": "this.hasResizableClass" } }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MatResizable, decorators: [{
            type: Directive,
            args: [{
                    selector: 'mat-header-cell[resizable], th[mat-header-cell][resizable]',
                    inputs: RESIZABLE_INPUTS,
                }]
        }], ctorParameters: function () { return [{ type: i1.CdkColumnDef }, { type: i2.ColumnResize }, { type: i3.Directionality }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }, { type: i0.ElementRef }, { type: i2.HeaderRowEventDispatcher }, { type: i0.Injector }, { type: i0.NgZone }, { type: i4.Overlay }, { type: i2.ColumnResizeNotifierSource }, { type: i2.ResizeStrategy }, { type: i1._CoalescedStyleScheduler, decorators: [{
                    type: Inject,
                    args: [_COALESCED_STYLE_SCHEDULER]
                }] }, { type: i0.ViewContainerRef }, { type: i0.ChangeDetectorRef }]; }, propDecorators: { hasResizableClass: [{
                type: HostBinding,
                args: ['class']
            }], resizable: [{
                type: Input
            }] } });

class MtxGridColClassPipe {
    transform(colDef, rowData, rowChangeRecord, currentValue) {
        if (typeof colDef.class === 'string') {
            return colDef.class;
        }
        else if (typeof colDef.class === 'function') {
            return colDef.class(rowData, colDef);
        }
        return '';
    }
}
/** @nocollapse */ MtxGridColClassPipe.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MtxGridColClassPipe, deps: [], target: i0.ɵɵFactoryTarget.Pipe });
/** @nocollapse */ MtxGridColClassPipe.ɵpipe = i0.ɵɵngDeclarePipe({ minVersion: "14.0.0", version: "15.2.1", ngImport: i0, type: MtxGridColClassPipe, name: "colClass" });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MtxGridColClassPipe, decorators: [{
            type: Pipe,
            args: [{
                    name: 'colClass',
                }]
        }] });
class MtxGridRowClassPipe {
    transform(rowData, index, dataIndex, rowClassFormatter) {
        const rowIndex = typeof index === 'undefined' ? dataIndex : index;
        const classList = rowIndex % 2 === 1 ? ['mat-row-odd'] : [];
        if (rowClassFormatter) {
            for (const key of Object.keys(rowClassFormatter)) {
                if (rowClassFormatter[key](rowData, rowIndex)) {
                    classList.push(key);
                }
            }
        }
        return classList.join(' ');
    }
}
/** @nocollapse */ MtxGridRowClassPipe.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MtxGridRowClassPipe, deps: [], target: i0.ɵɵFactoryTarget.Pipe });
/** @nocollapse */ MtxGridRowClassPipe.ɵpipe = i0.ɵɵngDeclarePipe({ minVersion: "14.0.0", version: "15.2.1", ngImport: i0, type: MtxGridRowClassPipe, name: "rowClass" });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MtxGridRowClassPipe, decorators: [{
            type: Pipe,
            args: [{
                    name: 'rowClass',
                }]
        }] });
class MtxGridCellActionTooltipPipe {
    transform(btn) {
        if (typeof btn.tooltip === 'string' || isObservable(btn.tooltip)) {
            return {
                message: btn.tooltip,
            };
        }
        else {
            return btn.tooltip || { message: '' };
        }
    }
}
/** @nocollapse */ MtxGridCellActionTooltipPipe.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MtxGridCellActionTooltipPipe, deps: [], target: i0.ɵɵFactoryTarget.Pipe });
/** @nocollapse */ MtxGridCellActionTooltipPipe.ɵpipe = i0.ɵɵngDeclarePipe({ minVersion: "14.0.0", version: "15.2.1", ngImport: i0, type: MtxGridCellActionTooltipPipe, name: "cellActionTooltip" });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MtxGridCellActionTooltipPipe, decorators: [{
            type: Pipe,
            args: [{
                    name: 'cellActionTooltip',
                }]
        }] });
class MtxGridCellActionDisablePipe {
    transform(btn, rowData) {
        if (typeof btn.disabled === 'boolean') {
            return btn.disabled;
        }
        else if (typeof btn.disabled === 'function') {
            return btn.disabled(rowData);
        }
        else {
            return false;
        }
    }
}
/** @nocollapse */ MtxGridCellActionDisablePipe.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MtxGridCellActionDisablePipe, deps: [], target: i0.ɵɵFactoryTarget.Pipe });
/** @nocollapse */ MtxGridCellActionDisablePipe.ɵpipe = i0.ɵɵngDeclarePipe({ minVersion: "14.0.0", version: "15.2.1", ngImport: i0, type: MtxGridCellActionDisablePipe, name: "cellActionDisable" });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MtxGridCellActionDisablePipe, decorators: [{
            type: Pipe,
            args: [{
                    name: 'cellActionDisable',
                }]
        }] });
class MtxGridCellSummaryPipe {
    constructor(utils) {
        this.utils = utils;
    }
    transform(data, colDef) {
        if (typeof colDef.summary === 'string') {
            return colDef.summary;
        }
        else if (typeof colDef.summary === 'function') {
            return colDef.summary(this.utils.getColData(data, colDef), colDef);
        }
    }
}
/** @nocollapse */ MtxGridCellSummaryPipe.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MtxGridCellSummaryPipe, deps: [{ token: MtxGridUtils }], target: i0.ɵɵFactoryTarget.Pipe });
/** @nocollapse */ MtxGridCellSummaryPipe.ɵpipe = i0.ɵɵngDeclarePipe({ minVersion: "14.0.0", version: "15.2.1", ngImport: i0, type: MtxGridCellSummaryPipe, name: "cellSummary" });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MtxGridCellSummaryPipe, decorators: [{
            type: Pipe,
            args: [{
                    name: 'cellSummary',
                }]
        }], ctorParameters: function () { return [{ type: MtxGridUtils }]; } });

class MtxGridCell {
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
/** @nocollapse */ MtxGridCell.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MtxGridCell, deps: [{ token: i1$1.MtxDialog }, { token: MtxGridUtils }, { token: i0.KeyValueDiffers }, { token: i0.ChangeDetectorRef }], target: i0.ɵɵFactoryTarget.Component });
/** @nocollapse */ MtxGridCell.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.1", type: MtxGridCell, selector: "mtx-grid-cell", inputs: { rowData: "rowData", colDef: "colDef", data: "data", summary: "summary", placeholder: "placeholder" }, outputs: { rowDataChange: "rowDataChange" }, exportAs: ["mtxGridCell"], ngImport: i0, template: "<span *ngIf=\"summary; else customCellFormattingTpl\"\r\n      [title]=\"_getFormatterTooltip((data | cellSummary: colDef))\"\r\n      [innerHTML]=\"_getText((data | cellSummary: colDef))\">\r\n</span>\r\n\r\n<!-- Custom formatting -->\r\n<ng-template #customCellFormattingTpl>\r\n  <span *ngIf=\"colDef.formatter; else defaultCellFormattingTpl\"\r\n        [title]=\"_getFormatterTooltip(colDef.formatter(rowData, colDef))\"\r\n        [innerHTML]=\"_getText(colDef.formatter(rowData, colDef))\">\r\n  </span>\r\n</ng-template>\r\n\r\n<!-- Default formatting -->\r\n<ng-template #defaultCellFormattingTpl>\r\n  <ng-container [ngSwitch]=\"colDef.type\">\r\n    <!-- Tag -->\r\n    <ng-container *ngSwitchCase=\"'tag'\">\r\n      <mat-chip-listbox *ngIf=\"colDef.tag && colDef.tag[_value]; else tagEmptyTpl\">\r\n        <mat-chip color=\"primary\" [ngClass]=\"['bg-' + colDef.tag[_value].color]\">\r\n          {{colDef.tag[_value].text}}\r\n        </mat-chip>\r\n      </mat-chip-listbox>\r\n      <ng-template #tagEmptyTpl>{{_value}}</ng-template>\r\n    </ng-container>\r\n    <!-- Buttons -->\r\n    <ng-container *ngSwitchCase=\"'button'\">\r\n      <ng-container *ngFor=\"let btn of colDef.buttons;\">\r\n        <ng-container *ngIf=\"!btn.iif || btn.iif(rowData)\">\r\n          <button *ngIf=\"btn.type==='basic'\"\r\n                  [ngClass]=\"['mtx-grid-action-button', btn.class||'']\"\r\n                  mat-button [color]=\"btn.color || 'primary'\"\r\n                  [disabled]=\"(btn | cellActionDisable: rowData)\"\r\n                  [matTooltip]=\"(btn | cellActionTooltip).message | toObservable | async\"\r\n                  [matTooltipClass]=\"(btn | cellActionTooltip).class\"\r\n                  [matTooltipHideDelay]=\"(btn | cellActionTooltip).hideDelay\"\r\n                  [matTooltipShowDelay]=\"(btn | cellActionTooltip).showDelay\"\r\n                  [matTooltipPosition]=\"(btn | cellActionTooltip).position || 'below'\"\r\n                  [matTooltipTouchGestures]=\"(btn | cellActionTooltip).touchGestures || 'auto'\"\r\n                  (click)=\"_onActionClick($event, btn, rowData)\">\r\n            <mat-icon class=\"mtx-grid-icon\" *ngIf=\"btn.icon\">{{btn.icon}}</mat-icon>\r\n            <span>{{btn.text | toObservable | async}}</span>\r\n          </button>\r\n          <button *ngIf=\"!btn.type || btn.type==='icon'\"\r\n                  [ngClass]=\"['mtx-grid-action-button', btn.class||'']\"\r\n                  mat-icon-button [color]=\"btn.color || 'primary'\"\r\n                  [disabled]=\"(btn | cellActionDisable: rowData)\"\r\n                  [matTooltip]=\"(btn | cellActionTooltip).message | toObservable | async\"\r\n                  [matTooltipClass]=\"(btn | cellActionTooltip).class\"\r\n                  [matTooltipHideDelay]=\"(btn | cellActionTooltip).hideDelay\"\r\n                  [matTooltipShowDelay]=\"(btn | cellActionTooltip).showDelay\"\r\n                  [matTooltipPosition]=\"(btn | cellActionTooltip).position || 'below'\"\r\n                  [matTooltipTouchGestures]=\"(btn | cellActionTooltip).touchGestures || 'auto'\"\r\n                  (click)=\"_onActionClick($event, btn, rowData)\">\r\n            <mat-icon class=\"mtx-grid-icon\">{{btn.icon}}</mat-icon>\r\n          </button>\r\n        </ng-container>\r\n      </ng-container>\r\n    </ng-container>\r\n    <!-- Link -->\r\n    <ng-container *ngSwitchCase=\"'link'\">\r\n      <a [href]=\"_value\" target=\"_blank\">{{_value}}</a>\r\n    </ng-container>\r\n    <!-- Image -->\r\n    <ng-container *ngSwitchCase=\"'image'\">\r\n      <img class=\"mtx-grid-img\" [src]=\"_value\" (click)=\"_onImagePreview(_value)\">\r\n    </ng-container>\r\n    <!-- Boolean -->\r\n    <ng-container *ngSwitchCase=\"'boolean'\">\r\n      <span [title]=\"_getTooltip(_value)\">{{_getText(_value)}}</span>\r\n    </ng-container>\r\n    <!-- Number -->\r\n    <ng-container *ngSwitchCase=\"'number'\">\r\n      <span [title]=\"_getTooltip(_value | number: colDef.typeParameter?.digitsInfo:\r\n      colDef.typeParameter?.locale)\">\r\n        {{_getText(_value | number: colDef.typeParameter?.digitsInfo:\r\n        colDef.typeParameter?.locale)}}\r\n      </span>\r\n    </ng-container>\r\n    <!-- Currency -->\r\n    <ng-container *ngSwitchCase=\"'currency'\">\r\n      <span [title]=\"_getTooltip(_value | currency: colDef.typeParameter?.currencyCode:\r\n      colDef.typeParameter?.display:\r\n      colDef.typeParameter?.digitsInfo:\r\n      colDef.typeParameter?.locale)\">\r\n        {{_getText(_value | currency: colDef.typeParameter?.currencyCode:\r\n        colDef.typeParameter?.display:\r\n        colDef.typeParameter?.digitsInfo:\r\n        colDef.typeParameter?.locale)}}\r\n      </span>\r\n    </ng-container>\r\n    <!-- Percent -->\r\n    <ng-container *ngSwitchCase=\"'percent'\">\r\n      <span [title]=\"_getTooltip(_value | percent: colDef.typeParameter?.digitsInfo:\r\n      colDef.typeParameter?.locale)\">\r\n        {{_getText(_value | percent: colDef.typeParameter?.digitsInfo:\r\n        colDef.typeParameter?.locale)}}\r\n      </span>\r\n    </ng-container>\r\n    <!-- Date -->\r\n    <ng-container *ngSwitchCase=\"'date'\">\r\n      <span [title]=\"_getTooltip(_value | date: colDef.typeParameter?.format:\r\n      colDef.typeParameter?.timezone:\r\n      colDef.typeParameter?.locale)\">\r\n        {{_getText(_value | date: colDef.typeParameter?.format:\r\n        colDef.typeParameter?.timezone:\r\n        colDef.typeParameter?.locale)}}\r\n      </span>\r\n    </ng-container>\r\n    <!-- Default -->\r\n    <ng-container *ngSwitchDefault>\r\n      <span [title]=\"_getTooltip(_value)\">{{_getText(_value)}}</span>\r\n    </ng-container>\r\n  </ng-container>\r\n</ng-template>\r\n", styles: [".mtx-grid-img{display:block;width:30px;border-radius:4px;cursor:pointer}\n"], dependencies: [{ kind: "directive", type: i3$1.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i3$1.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i3$1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i3$1.NgSwitch, selector: "[ngSwitch]", inputs: ["ngSwitch"] }, { kind: "directive", type: i3$1.NgSwitchCase, selector: "[ngSwitchCase]", inputs: ["ngSwitchCase"] }, { kind: "directive", type: i3$1.NgSwitchDefault, selector: "[ngSwitchDefault]" }, { kind: "component", type: i4$1.MatButton, selector: "    button[mat-button], button[mat-raised-button], button[mat-flat-button],    button[mat-stroked-button]  ", inputs: ["disabled", "disableRipple", "color"], exportAs: ["matButton"] }, { kind: "component", type: i4$1.MatIconButton, selector: "button[mat-icon-button]", inputs: ["disabled", "disableRipple", "color"], exportAs: ["matButton"] }, { kind: "component", type: i5.MatChip, selector: "mat-basic-chip, [mat-basic-chip], mat-chip, [mat-chip]", inputs: ["color", "disabled", "disableRipple", "tabIndex", "role", "id", "aria-label", "aria-description", "value", "removable", "highlighted"], outputs: ["removed", "destroyed"], exportAs: ["matChip"] }, { kind: "component", type: i5.MatChipListbox, selector: "mat-chip-listbox", inputs: ["tabIndex", "multiple", "aria-orientation", "selectable", "compareWith", "required", "hideSingleSelectionIndicator", "value"], outputs: ["change"] }, { kind: "directive", type: i6.MatTooltip, selector: "[matTooltip]", exportAs: ["matTooltip"] }, { kind: "component", type: i7.MatIcon, selector: "mat-icon", inputs: ["color", "inline", "svgIcon", "fontSet", "fontIcon"], exportAs: ["matIcon"] }, { kind: "pipe", type: i3$1.AsyncPipe, name: "async" }, { kind: "pipe", type: i3$1.DecimalPipe, name: "number" }, { kind: "pipe", type: i3$1.PercentPipe, name: "percent" }, { kind: "pipe", type: i3$1.CurrencyPipe, name: "currency" }, { kind: "pipe", type: i3$1.DatePipe, name: "date" }, { kind: "pipe", type: i8.MtxToObservablePipe, name: "toObservable" }, { kind: "pipe", type: MtxGridCellActionTooltipPipe, name: "cellActionTooltip" }, { kind: "pipe", type: MtxGridCellActionDisablePipe, name: "cellActionDisable" }, { kind: "pipe", type: MtxGridCellSummaryPipe, name: "cellSummary" }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MtxGridCell, decorators: [{
            type: Component,
            args: [{ selector: 'mtx-grid-cell', exportAs: 'mtxGridCell', encapsulation: ViewEncapsulation.None, changeDetection: ChangeDetectionStrategy.OnPush, template: "<span *ngIf=\"summary; else customCellFormattingTpl\"\r\n      [title]=\"_getFormatterTooltip((data | cellSummary: colDef))\"\r\n      [innerHTML]=\"_getText((data | cellSummary: colDef))\">\r\n</span>\r\n\r\n<!-- Custom formatting -->\r\n<ng-template #customCellFormattingTpl>\r\n  <span *ngIf=\"colDef.formatter; else defaultCellFormattingTpl\"\r\n        [title]=\"_getFormatterTooltip(colDef.formatter(rowData, colDef))\"\r\n        [innerHTML]=\"_getText(colDef.formatter(rowData, colDef))\">\r\n  </span>\r\n</ng-template>\r\n\r\n<!-- Default formatting -->\r\n<ng-template #defaultCellFormattingTpl>\r\n  <ng-container [ngSwitch]=\"colDef.type\">\r\n    <!-- Tag -->\r\n    <ng-container *ngSwitchCase=\"'tag'\">\r\n      <mat-chip-listbox *ngIf=\"colDef.tag && colDef.tag[_value]; else tagEmptyTpl\">\r\n        <mat-chip color=\"primary\" [ngClass]=\"['bg-' + colDef.tag[_value].color]\">\r\n          {{colDef.tag[_value].text}}\r\n        </mat-chip>\r\n      </mat-chip-listbox>\r\n      <ng-template #tagEmptyTpl>{{_value}}</ng-template>\r\n    </ng-container>\r\n    <!-- Buttons -->\r\n    <ng-container *ngSwitchCase=\"'button'\">\r\n      <ng-container *ngFor=\"let btn of colDef.buttons;\">\r\n        <ng-container *ngIf=\"!btn.iif || btn.iif(rowData)\">\r\n          <button *ngIf=\"btn.type==='basic'\"\r\n                  [ngClass]=\"['mtx-grid-action-button', btn.class||'']\"\r\n                  mat-button [color]=\"btn.color || 'primary'\"\r\n                  [disabled]=\"(btn | cellActionDisable: rowData)\"\r\n                  [matTooltip]=\"(btn | cellActionTooltip).message | toObservable | async\"\r\n                  [matTooltipClass]=\"(btn | cellActionTooltip).class\"\r\n                  [matTooltipHideDelay]=\"(btn | cellActionTooltip).hideDelay\"\r\n                  [matTooltipShowDelay]=\"(btn | cellActionTooltip).showDelay\"\r\n                  [matTooltipPosition]=\"(btn | cellActionTooltip).position || 'below'\"\r\n                  [matTooltipTouchGestures]=\"(btn | cellActionTooltip).touchGestures || 'auto'\"\r\n                  (click)=\"_onActionClick($event, btn, rowData)\">\r\n            <mat-icon class=\"mtx-grid-icon\" *ngIf=\"btn.icon\">{{btn.icon}}</mat-icon>\r\n            <span>{{btn.text | toObservable | async}}</span>\r\n          </button>\r\n          <button *ngIf=\"!btn.type || btn.type==='icon'\"\r\n                  [ngClass]=\"['mtx-grid-action-button', btn.class||'']\"\r\n                  mat-icon-button [color]=\"btn.color || 'primary'\"\r\n                  [disabled]=\"(btn | cellActionDisable: rowData)\"\r\n                  [matTooltip]=\"(btn | cellActionTooltip).message | toObservable | async\"\r\n                  [matTooltipClass]=\"(btn | cellActionTooltip).class\"\r\n                  [matTooltipHideDelay]=\"(btn | cellActionTooltip).hideDelay\"\r\n                  [matTooltipShowDelay]=\"(btn | cellActionTooltip).showDelay\"\r\n                  [matTooltipPosition]=\"(btn | cellActionTooltip).position || 'below'\"\r\n                  [matTooltipTouchGestures]=\"(btn | cellActionTooltip).touchGestures || 'auto'\"\r\n                  (click)=\"_onActionClick($event, btn, rowData)\">\r\n            <mat-icon class=\"mtx-grid-icon\">{{btn.icon}}</mat-icon>\r\n          </button>\r\n        </ng-container>\r\n      </ng-container>\r\n    </ng-container>\r\n    <!-- Link -->\r\n    <ng-container *ngSwitchCase=\"'link'\">\r\n      <a [href]=\"_value\" target=\"_blank\">{{_value}}</a>\r\n    </ng-container>\r\n    <!-- Image -->\r\n    <ng-container *ngSwitchCase=\"'image'\">\r\n      <img class=\"mtx-grid-img\" [src]=\"_value\" (click)=\"_onImagePreview(_value)\">\r\n    </ng-container>\r\n    <!-- Boolean -->\r\n    <ng-container *ngSwitchCase=\"'boolean'\">\r\n      <span [title]=\"_getTooltip(_value)\">{{_getText(_value)}}</span>\r\n    </ng-container>\r\n    <!-- Number -->\r\n    <ng-container *ngSwitchCase=\"'number'\">\r\n      <span [title]=\"_getTooltip(_value | number: colDef.typeParameter?.digitsInfo:\r\n      colDef.typeParameter?.locale)\">\r\n        {{_getText(_value | number: colDef.typeParameter?.digitsInfo:\r\n        colDef.typeParameter?.locale)}}\r\n      </span>\r\n    </ng-container>\r\n    <!-- Currency -->\r\n    <ng-container *ngSwitchCase=\"'currency'\">\r\n      <span [title]=\"_getTooltip(_value | currency: colDef.typeParameter?.currencyCode:\r\n      colDef.typeParameter?.display:\r\n      colDef.typeParameter?.digitsInfo:\r\n      colDef.typeParameter?.locale)\">\r\n        {{_getText(_value | currency: colDef.typeParameter?.currencyCode:\r\n        colDef.typeParameter?.display:\r\n        colDef.typeParameter?.digitsInfo:\r\n        colDef.typeParameter?.locale)}}\r\n      </span>\r\n    </ng-container>\r\n    <!-- Percent -->\r\n    <ng-container *ngSwitchCase=\"'percent'\">\r\n      <span [title]=\"_getTooltip(_value | percent: colDef.typeParameter?.digitsInfo:\r\n      colDef.typeParameter?.locale)\">\r\n        {{_getText(_value | percent: colDef.typeParameter?.digitsInfo:\r\n        colDef.typeParameter?.locale)}}\r\n      </span>\r\n    </ng-container>\r\n    <!-- Date -->\r\n    <ng-container *ngSwitchCase=\"'date'\">\r\n      <span [title]=\"_getTooltip(_value | date: colDef.typeParameter?.format:\r\n      colDef.typeParameter?.timezone:\r\n      colDef.typeParameter?.locale)\">\r\n        {{_getText(_value | date: colDef.typeParameter?.format:\r\n        colDef.typeParameter?.timezone:\r\n        colDef.typeParameter?.locale)}}\r\n      </span>\r\n    </ng-container>\r\n    <!-- Default -->\r\n    <ng-container *ngSwitchDefault>\r\n      <span [title]=\"_getTooltip(_value)\">{{_getText(_value)}}</span>\r\n    </ng-container>\r\n  </ng-container>\r\n</ng-template>\r\n", styles: [".mtx-grid-img{display:block;width:30px;border-radius:4px;cursor:pointer}\n"] }]
        }], ctorParameters: function () { return [{ type: i1$1.MtxDialog }, { type: MtxGridUtils }, { type: i0.KeyValueDiffers }, { type: i0.ChangeDetectorRef }]; }, propDecorators: { rowData: [{
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

class MtxGridColumnMenu {
    constructor() {
        this.columns = [];
        this.selectable = true;
        this.selectableChecked = 'show';
        this.sortable = true;
        this.pinnable = true;
        this._buttonText = '';
        this.buttonType = 'stroked';
        this.buttonClass = '';
        this.buttonIcon = '';
        this.showHeader = false;
        this.headerText = 'Columns Header';
        this.showFooter = false;
        this.footerText = 'Columns Footer';
        this.columnChange = new EventEmitter();
        this._pinOptions = [
            { label: 'Pin Left', value: 'left' },
            { label: 'Pin Right', value: 'right' },
            { label: 'No Pin', value: null },
        ];
    }
    get buttonText() {
        const defaultText = `Columns ${this.selectableChecked === 'show' ? 'Shown' : 'Hidden'}`;
        return this._buttonText ? this._buttonText : defaultText;
    }
    set buttonText(value) {
        this._buttonText = value;
    }
    get pinOptions() {
        return this._pinOptions;
    }
    set pinOptions(value) {
        if (value.length > 0) {
            this._pinOptions = value;
        }
    }
    _handleDroped(e) {
        moveItemInArray(this.columns, e.previousIndex, e.currentIndex);
        this.columnChange.emit(this.columns);
    }
    _handleChecked(e) {
        this.columnChange.emit(this.columns);
    }
    _handlePinSelect(col, val) {
        if (col.pinned != val) {
            col.pinned = val;
            this.columnChange.emit(this.columns);
        }
    }
}
/** @nocollapse */ MtxGridColumnMenu.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MtxGridColumnMenu, deps: [], target: i0.ɵɵFactoryTarget.Component });
/** @nocollapse */ MtxGridColumnMenu.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.1", type: MtxGridColumnMenu, selector: "mtx-grid-column-menu", inputs: { columns: "columns", selectable: "selectable", selectableChecked: "selectableChecked", sortable: "sortable", pinnable: "pinnable", buttonText: "buttonText", buttonType: "buttonType", buttonColor: "buttonColor", buttonClass: "buttonClass", buttonIcon: "buttonIcon", showHeader: "showHeader", headerText: "headerText", headerTemplate: "headerTemplate", showFooter: "showFooter", footerText: "footerText", footerTemplate: "footerTemplate", pinOptions: "pinOptions" }, outputs: { columnChange: "columnChange" }, viewQueries: [{ propertyName: "menuPanel", first: true, predicate: ["menu"], descendants: true, static: true }, { propertyName: "menuTrigger", first: true, predicate: MatMenuTrigger, descendants: true }], exportAs: ["mtxGridColumnMenu"], ngImport: i0, template: "<ng-container [ngSwitch]=\"buttonType\">\r\n  <ng-container *ngSwitchCase=\"'raised'\">\r\n    <button [ngClass]=\"buttonClass\" mat-raised-button [color]=\"buttonColor\"\r\n            [matMenuTriggerFor]=\"menu\">\r\n      <mat-icon *ngIf=\"buttonIcon\">{{buttonIcon}}</mat-icon> {{buttonText}}\r\n    </button>\r\n  </ng-container>\r\n  <ng-container *ngSwitchCase=\"'stroked'\">\r\n    <button [ngClass]=\"buttonClass\" mat-stroked-button [color]=\"buttonColor\"\r\n            [matMenuTriggerFor]=\"menu\">\r\n      <mat-icon *ngIf=\"buttonIcon\">{{buttonIcon}}</mat-icon> {{buttonText}}\r\n    </button>\r\n  </ng-container>\r\n  <ng-container *ngSwitchCase=\"'flat'\">\r\n    <button [ngClass]=\"buttonClass\" mat-flat-button [color]=\"buttonColor\"\r\n            [matMenuTriggerFor]=\"menu\">\r\n      <mat-icon *ngIf=\"buttonIcon\">{{buttonIcon}}</mat-icon> {{buttonText}}\r\n    </button>\r\n  </ng-container>\r\n  <ng-container *ngSwitchCase=\"'icon'\">\r\n    <button [ngClass]=\"buttonClass\" mat-icon-button [color]=\"buttonColor\"\r\n            [matMenuTriggerFor]=\"menu\">\r\n      <mat-icon *ngIf=\"buttonIcon\">{{buttonIcon}}</mat-icon>\r\n    </button>\r\n  </ng-container>\r\n  <ng-container *ngSwitchCase=\"'fab'\">\r\n    <button [ngClass]=\"buttonClass\" mat-fab [color]=\"buttonColor\" [matMenuTriggerFor]=\"menu\">\r\n      <mat-icon *ngIf=\"buttonIcon\">{{buttonIcon}}</mat-icon> {{buttonText}}\r\n    </button>\r\n  </ng-container>\r\n  <ng-container *ngSwitchCase=\"'mini-fab'\">\r\n    <button [ngClass]=\"buttonClass\" mat-mini-fab [color]=\"buttonColor\"\r\n            [matMenuTriggerFor]=\"menu\">\r\n      <mat-icon *ngIf=\"buttonIcon\">{{buttonIcon}}</mat-icon> {{buttonText}}\r\n    </button>\r\n  </ng-container>\r\n  <ng-container *ngSwitchDefault>\r\n    <button [ngClass]=\"buttonClass\" mat-button [color]=\"buttonColor\" [matMenuTriggerFor]=\"menu\">\r\n      <mat-icon *ngIf=\"buttonIcon\">{{buttonIcon}}</mat-icon> {{buttonText}}\r\n    </button>\r\n  </ng-container>\r\n</ng-container>\r\n\r\n<mat-menu #menu=\"matMenu\" class=\"mtx-grid-column-menu\">\r\n  <div class=\"mtx-grid-column-menu-content\"\r\n       (click)=\"$event.stopPropagation()\" (keydown)=\"$event.stopPropagation()\">\r\n    <div class=\"mtx-grid-column-menu-header\" *ngIf=\"showHeader\">\r\n      <ng-template [ngIf]=\"headerTemplate\" [ngIfElse]=\"defaultHeaderTpl\">\r\n        <ng-template [ngTemplateOutlet]=\"headerTemplate\"></ng-template>\r\n      </ng-template>\r\n      <ng-template #defaultHeaderTpl>{{headerText}}</ng-template>\r\n    </div>\r\n\r\n    <div class=\"mtx-grid-column-menu-body\">\r\n      <div class=\"mtx-grid-column-menu-list\" *ngIf=\"sortable\"\r\n           cdkDropList (cdkDropListDropped)=\"_handleDroped($event)\">\r\n        <div class=\"mtx-grid-column-menu-item\" *ngFor=\"let col of columns\"\r\n             cdkDrag [cdkDragDisabled]=\"selectableChecked === 'show'? !col.show : col.hide\">\r\n          <svg class=\"mtx-grid-icon mtx-grid-column-drag-handle-icon\" viewBox=\"0 0 24 24\"\r\n               width=\"24px\" height=\"24px\" fill=\"currentColor\" focusable=\"false\">\r\n            <path\r\n                  d=\"M7,19V17H9V19H7M11,19V17H13V19H11M15,19V17H17V19H15M7,15V13H9V15H7M11,15V13H13V15H11M15,15V13H17V15H15M7,11V9H9V11H7M11,11V9H13V11H11M15,11V9H17V11H15M7,7V5H9V7H7M11,7V5H13V7H11M15,7V5H17V7H15Z\">\r\n            </path>\r\n          </svg>\r\n          <ng-template [ngTemplateOutlet]=\"checkboxList\"\r\n                       [ngTemplateOutletContext]=\"{ $implicit: col }\">\r\n          </ng-template>\r\n        </div>\r\n      </div>\r\n\r\n      <div class=\"mtx-grid-column-menu-list\" *ngIf=\"!sortable\">\r\n        <div class=\"mtx-grid-column-menu-item\" *ngFor=\"let col of columns\">\r\n          <ng-template [ngTemplateOutlet]=\"checkboxList\"\r\n                       [ngTemplateOutletContext]=\"{ $implicit: col }\">\r\n          </ng-template>\r\n        </div>\r\n      </div>\r\n    </div>\r\n\r\n    <div class=\"mtx-grid-column-menu-footer\" *ngIf=\"showFooter\">\r\n      <ng-template [ngIf]=\"footerTemplate\" [ngIfElse]=\"defaultFooterTpl\">\r\n        <ng-template [ngTemplateOutlet]=\"footerTemplate\"></ng-template>\r\n      </ng-template>\r\n      <ng-template #defaultFooterTpl>{{footerText}}</ng-template>\r\n    </div>\r\n  </div>\r\n</mat-menu>\r\n\r\n<ng-template #checkboxList let-col>\r\n  <ng-container *ngIf=\"pinnable\">\r\n    <button class=\"mtx-grid-column-pin-button\" mat-icon-button [matMenuTriggerFor]=\"pinList\">\r\n      <svg class=\"mtx-grid-icon mtx-grid-column-pin-icon\" *ngIf=\"col.pinned\"\r\n           viewBox=\"0 0 24 24\" width=\"24px\" height=\"24px\" fill=\"currentColor\" focusable=\"false\">\r\n        <path d=\"M16,12V4H17V2H7V4H8V12L6,14V16H11.2V22H12.8V16H18V14L16,12Z\" />\r\n      </svg>\r\n      <svg class=\"mtx-grid-icon mtx-grid-column-pin-off-icon\" *ngIf=\"!col.pinned\"\r\n           viewBox=\"0 0 24 24\" width=\"24px\" height=\"24px\" fill=\"currentColor\" focusable=\"false\">\r\n        <path\r\n              d=\"M2,5.27L3.28,4L20,20.72L18.73,22L12.8,16.07V22H11.2V16H6V14L8,12V11.27L2,5.27M16,12L18,14V16H17.82L8,6.18V4H7V2H17V4H16V12Z\" />\r\n      </svg>\r\n    </button>\r\n    <mat-menu #pinList=\"matMenu\" class=\"mtx-grid-column-pin-list\">\r\n      <button class=\"mtx-grid-column-pin-option\" *ngFor=\"let item of pinOptions\" mat-menu-item\r\n              (click)=\"_handlePinSelect(col, item.value)\">\r\n        <span class=\"mtx-grid-column-pin-option-placeholder\">\r\n          <!-- eslint-disable-next-line @angular-eslint/template/eqeqeq -->\r\n          <svg class=\"mtx-grid-icon mtx-grid-column-pin-check-icon\" *ngIf=\"col.pinned==item.value\"\r\n               viewBox=\"0 0 24 24\" width=\"24px\" height=\"24px\" fill=\"currentColor\" focusable=\"false\">\r\n            <path d=\"M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z\" />\r\n          </svg>\r\n        </span>\r\n        <span class=\"mtx-grid-column-pin-option-text\">{{item.label | toObservable | async}}</span>\r\n      </button>\r\n    </mat-menu>\r\n  </ng-container>\r\n\r\n  <mat-checkbox class=\"mtx-grid-column-menu-item-label\" *ngIf=\"selectable\"\r\n                [(ngModel)]=\"col[selectableChecked]\" [disabled]=\"col.disabled\"\r\n                (change)=\"_handleChecked($event)\">\r\n    {{col.header | toObservable | async}}\r\n  </mat-checkbox>\r\n  <span class=\"mtx-grid-column-menu-item-label\" *ngIf=\"!selectable\">\r\n    {{col.header | toObservable | async}}\r\n  </span>\r\n</ng-template>\r\n", styles: [".mtx-grid-column-menu .mat-menu-content{padding:0}.mtx-grid-column-menu-body{padding:8px 16px}.mtx-grid-column-menu-header,.mtx-grid-column-menu-footer{position:sticky;z-index:1;padding:8px 16px}.mtx-grid-column-menu-header{top:0}.mtx-grid-column-menu-footer{bottom:0}.mtx-grid-column-menu-list{display:block;max-width:100%}.mtx-grid-column-menu-list.cdk-drop-list-dragging .mtx-grid-column-menu-item:not(.cdk-drag-placeholder){transition:transform .25s cubic-bezier(0,0,.2,1)}.mtx-grid-column-menu-item{display:flex;flex-direction:row;align-items:center}.mtx-grid-column-menu-item.cdk-drag-disabled .cdk-drag-handle{opacity:.35;cursor:no-drop}.mtx-grid-column-menu-item .cdk-drag-handle{cursor:move}.mtx-grid-column-menu-item.cdk-drag-preview{box-shadow:0 3px 1px -2px #0003,0 2px 2px #00000024,0 1px 5px #0000001f}.mtx-grid-column-menu-item.cdk-drag-placeholder{opacity:0}.mtx-grid-column-menu-item.cdk-drag-animating{transition:transform .25s cubic-bezier(0,0,.2,1)}.mtx-grid-column-pin-button.mat-mdc-icon-button{width:40px;height:40px;padding:8px}.mtx-grid-column-pin-button.mat-mdc-icon-button .mat-mdc-button-touch-target{width:100%;height:100%}.mtx-grid-column-pin-option.mat-menu-item{display:flex;align-items:center;height:32px}.mtx-grid-column-pin-option-placeholder{display:inline-block;width:20px;height:20px;line-height:20px;vertical-align:middle}.mtx-grid-column-pin-option-text{padding:0 8px;vertical-align:middle}.mtx-grid-column-drag-handle-icon:hover{cursor:move}\n"], dependencies: [{ kind: "directive", type: i3$1.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i3$1.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i3$1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i3$1.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "directive", type: i3$1.NgSwitch, selector: "[ngSwitch]", inputs: ["ngSwitch"] }, { kind: "directive", type: i3$1.NgSwitchCase, selector: "[ngSwitchCase]", inputs: ["ngSwitchCase"] }, { kind: "directive", type: i3$1.NgSwitchDefault, selector: "[ngSwitchDefault]" }, { kind: "directive", type: i2$1.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i2$1.NgModel, selector: "[ngModel]:not([formControlName]):not([formControl])", inputs: ["name", "disabled", "ngModel", "ngModelOptions"], outputs: ["ngModelChange"], exportAs: ["ngModel"] }, { kind: "component", type: i3$2.MatCheckbox, selector: "mat-checkbox", inputs: ["disableRipple", "color", "tabIndex"], exportAs: ["matCheckbox"] }, { kind: "component", type: i4$1.MatButton, selector: "    button[mat-button], button[mat-raised-button], button[mat-flat-button],    button[mat-stroked-button]  ", inputs: ["disabled", "disableRipple", "color"], exportAs: ["matButton"] }, { kind: "component", type: i4$1.MatIconButton, selector: "button[mat-icon-button]", inputs: ["disabled", "disableRipple", "color"], exportAs: ["matButton"] }, { kind: "component", type: i4$1.MatMiniFabButton, selector: "button[mat-mini-fab]", inputs: ["disabled", "disableRipple", "color"], exportAs: ["matButton"] }, { kind: "component", type: i4$1.MatFabButton, selector: "button[mat-fab]", inputs: ["disabled", "disableRipple", "color", "tabIndex", "extended"], exportAs: ["matButton"] }, { kind: "component", type: i7.MatIcon, selector: "mat-icon", inputs: ["color", "inline", "svgIcon", "fontSet", "fontIcon"], exportAs: ["matIcon"] }, { kind: "component", type: i6$1.MatMenu, selector: "mat-menu", exportAs: ["matMenu"] }, { kind: "component", type: i6$1.MatMenuItem, selector: "[mat-menu-item]", inputs: ["disabled", "disableRipple", "role"], exportAs: ["matMenuItem"] }, { kind: "directive", type: i6$1.MatMenuTrigger, selector: "[mat-menu-trigger-for], [matMenuTriggerFor]", exportAs: ["matMenuTrigger"] }, { kind: "directive", type: i7$1.CdkDropList, selector: "[cdkDropList], cdk-drop-list", inputs: ["cdkDropListConnectedTo", "cdkDropListData", "cdkDropListOrientation", "id", "cdkDropListLockAxis", "cdkDropListDisabled", "cdkDropListSortingDisabled", "cdkDropListEnterPredicate", "cdkDropListSortPredicate", "cdkDropListAutoScrollDisabled", "cdkDropListAutoScrollStep"], outputs: ["cdkDropListDropped", "cdkDropListEntered", "cdkDropListExited", "cdkDropListSorted"], exportAs: ["cdkDropList"] }, { kind: "directive", type: i7$1.CdkDrag, selector: "[cdkDrag]", inputs: ["cdkDragData", "cdkDragLockAxis", "cdkDragRootElement", "cdkDragBoundary", "cdkDragStartDelay", "cdkDragFreeDragPosition", "cdkDragDisabled", "cdkDragConstrainPosition", "cdkDragPreviewClass", "cdkDragPreviewContainer"], outputs: ["cdkDragStarted", "cdkDragReleased", "cdkDragEnded", "cdkDragEntered", "cdkDragExited", "cdkDragDropped", "cdkDragMoved"], exportAs: ["cdkDrag"] }, { kind: "pipe", type: i3$1.AsyncPipe, name: "async" }, { kind: "pipe", type: i8.MtxToObservablePipe, name: "toObservable" }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MtxGridColumnMenu, decorators: [{
            type: Component,
            args: [{ selector: 'mtx-grid-column-menu', exportAs: 'mtxGridColumnMenu', encapsulation: ViewEncapsulation.None, changeDetection: ChangeDetectionStrategy.OnPush, template: "<ng-container [ngSwitch]=\"buttonType\">\r\n  <ng-container *ngSwitchCase=\"'raised'\">\r\n    <button [ngClass]=\"buttonClass\" mat-raised-button [color]=\"buttonColor\"\r\n            [matMenuTriggerFor]=\"menu\">\r\n      <mat-icon *ngIf=\"buttonIcon\">{{buttonIcon}}</mat-icon> {{buttonText}}\r\n    </button>\r\n  </ng-container>\r\n  <ng-container *ngSwitchCase=\"'stroked'\">\r\n    <button [ngClass]=\"buttonClass\" mat-stroked-button [color]=\"buttonColor\"\r\n            [matMenuTriggerFor]=\"menu\">\r\n      <mat-icon *ngIf=\"buttonIcon\">{{buttonIcon}}</mat-icon> {{buttonText}}\r\n    </button>\r\n  </ng-container>\r\n  <ng-container *ngSwitchCase=\"'flat'\">\r\n    <button [ngClass]=\"buttonClass\" mat-flat-button [color]=\"buttonColor\"\r\n            [matMenuTriggerFor]=\"menu\">\r\n      <mat-icon *ngIf=\"buttonIcon\">{{buttonIcon}}</mat-icon> {{buttonText}}\r\n    </button>\r\n  </ng-container>\r\n  <ng-container *ngSwitchCase=\"'icon'\">\r\n    <button [ngClass]=\"buttonClass\" mat-icon-button [color]=\"buttonColor\"\r\n            [matMenuTriggerFor]=\"menu\">\r\n      <mat-icon *ngIf=\"buttonIcon\">{{buttonIcon}}</mat-icon>\r\n    </button>\r\n  </ng-container>\r\n  <ng-container *ngSwitchCase=\"'fab'\">\r\n    <button [ngClass]=\"buttonClass\" mat-fab [color]=\"buttonColor\" [matMenuTriggerFor]=\"menu\">\r\n      <mat-icon *ngIf=\"buttonIcon\">{{buttonIcon}}</mat-icon> {{buttonText}}\r\n    </button>\r\n  </ng-container>\r\n  <ng-container *ngSwitchCase=\"'mini-fab'\">\r\n    <button [ngClass]=\"buttonClass\" mat-mini-fab [color]=\"buttonColor\"\r\n            [matMenuTriggerFor]=\"menu\">\r\n      <mat-icon *ngIf=\"buttonIcon\">{{buttonIcon}}</mat-icon> {{buttonText}}\r\n    </button>\r\n  </ng-container>\r\n  <ng-container *ngSwitchDefault>\r\n    <button [ngClass]=\"buttonClass\" mat-button [color]=\"buttonColor\" [matMenuTriggerFor]=\"menu\">\r\n      <mat-icon *ngIf=\"buttonIcon\">{{buttonIcon}}</mat-icon> {{buttonText}}\r\n    </button>\r\n  </ng-container>\r\n</ng-container>\r\n\r\n<mat-menu #menu=\"matMenu\" class=\"mtx-grid-column-menu\">\r\n  <div class=\"mtx-grid-column-menu-content\"\r\n       (click)=\"$event.stopPropagation()\" (keydown)=\"$event.stopPropagation()\">\r\n    <div class=\"mtx-grid-column-menu-header\" *ngIf=\"showHeader\">\r\n      <ng-template [ngIf]=\"headerTemplate\" [ngIfElse]=\"defaultHeaderTpl\">\r\n        <ng-template [ngTemplateOutlet]=\"headerTemplate\"></ng-template>\r\n      </ng-template>\r\n      <ng-template #defaultHeaderTpl>{{headerText}}</ng-template>\r\n    </div>\r\n\r\n    <div class=\"mtx-grid-column-menu-body\">\r\n      <div class=\"mtx-grid-column-menu-list\" *ngIf=\"sortable\"\r\n           cdkDropList (cdkDropListDropped)=\"_handleDroped($event)\">\r\n        <div class=\"mtx-grid-column-menu-item\" *ngFor=\"let col of columns\"\r\n             cdkDrag [cdkDragDisabled]=\"selectableChecked === 'show'? !col.show : col.hide\">\r\n          <svg class=\"mtx-grid-icon mtx-grid-column-drag-handle-icon\" viewBox=\"0 0 24 24\"\r\n               width=\"24px\" height=\"24px\" fill=\"currentColor\" focusable=\"false\">\r\n            <path\r\n                  d=\"M7,19V17H9V19H7M11,19V17H13V19H11M15,19V17H17V19H15M7,15V13H9V15H7M11,15V13H13V15H11M15,15V13H17V15H15M7,11V9H9V11H7M11,11V9H13V11H11M15,11V9H17V11H15M7,7V5H9V7H7M11,7V5H13V7H11M15,7V5H17V7H15Z\">\r\n            </path>\r\n          </svg>\r\n          <ng-template [ngTemplateOutlet]=\"checkboxList\"\r\n                       [ngTemplateOutletContext]=\"{ $implicit: col }\">\r\n          </ng-template>\r\n        </div>\r\n      </div>\r\n\r\n      <div class=\"mtx-grid-column-menu-list\" *ngIf=\"!sortable\">\r\n        <div class=\"mtx-grid-column-menu-item\" *ngFor=\"let col of columns\">\r\n          <ng-template [ngTemplateOutlet]=\"checkboxList\"\r\n                       [ngTemplateOutletContext]=\"{ $implicit: col }\">\r\n          </ng-template>\r\n        </div>\r\n      </div>\r\n    </div>\r\n\r\n    <div class=\"mtx-grid-column-menu-footer\" *ngIf=\"showFooter\">\r\n      <ng-template [ngIf]=\"footerTemplate\" [ngIfElse]=\"defaultFooterTpl\">\r\n        <ng-template [ngTemplateOutlet]=\"footerTemplate\"></ng-template>\r\n      </ng-template>\r\n      <ng-template #defaultFooterTpl>{{footerText}}</ng-template>\r\n    </div>\r\n  </div>\r\n</mat-menu>\r\n\r\n<ng-template #checkboxList let-col>\r\n  <ng-container *ngIf=\"pinnable\">\r\n    <button class=\"mtx-grid-column-pin-button\" mat-icon-button [matMenuTriggerFor]=\"pinList\">\r\n      <svg class=\"mtx-grid-icon mtx-grid-column-pin-icon\" *ngIf=\"col.pinned\"\r\n           viewBox=\"0 0 24 24\" width=\"24px\" height=\"24px\" fill=\"currentColor\" focusable=\"false\">\r\n        <path d=\"M16,12V4H17V2H7V4H8V12L6,14V16H11.2V22H12.8V16H18V14L16,12Z\" />\r\n      </svg>\r\n      <svg class=\"mtx-grid-icon mtx-grid-column-pin-off-icon\" *ngIf=\"!col.pinned\"\r\n           viewBox=\"0 0 24 24\" width=\"24px\" height=\"24px\" fill=\"currentColor\" focusable=\"false\">\r\n        <path\r\n              d=\"M2,5.27L3.28,4L20,20.72L18.73,22L12.8,16.07V22H11.2V16H6V14L8,12V11.27L2,5.27M16,12L18,14V16H17.82L8,6.18V4H7V2H17V4H16V12Z\" />\r\n      </svg>\r\n    </button>\r\n    <mat-menu #pinList=\"matMenu\" class=\"mtx-grid-column-pin-list\">\r\n      <button class=\"mtx-grid-column-pin-option\" *ngFor=\"let item of pinOptions\" mat-menu-item\r\n              (click)=\"_handlePinSelect(col, item.value)\">\r\n        <span class=\"mtx-grid-column-pin-option-placeholder\">\r\n          <!-- eslint-disable-next-line @angular-eslint/template/eqeqeq -->\r\n          <svg class=\"mtx-grid-icon mtx-grid-column-pin-check-icon\" *ngIf=\"col.pinned==item.value\"\r\n               viewBox=\"0 0 24 24\" width=\"24px\" height=\"24px\" fill=\"currentColor\" focusable=\"false\">\r\n            <path d=\"M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z\" />\r\n          </svg>\r\n        </span>\r\n        <span class=\"mtx-grid-column-pin-option-text\">{{item.label | toObservable | async}}</span>\r\n      </button>\r\n    </mat-menu>\r\n  </ng-container>\r\n\r\n  <mat-checkbox class=\"mtx-grid-column-menu-item-label\" *ngIf=\"selectable\"\r\n                [(ngModel)]=\"col[selectableChecked]\" [disabled]=\"col.disabled\"\r\n                (change)=\"_handleChecked($event)\">\r\n    {{col.header | toObservable | async}}\r\n  </mat-checkbox>\r\n  <span class=\"mtx-grid-column-menu-item-label\" *ngIf=\"!selectable\">\r\n    {{col.header | toObservable | async}}\r\n  </span>\r\n</ng-template>\r\n", styles: [".mtx-grid-column-menu .mat-menu-content{padding:0}.mtx-grid-column-menu-body{padding:8px 16px}.mtx-grid-column-menu-header,.mtx-grid-column-menu-footer{position:sticky;z-index:1;padding:8px 16px}.mtx-grid-column-menu-header{top:0}.mtx-grid-column-menu-footer{bottom:0}.mtx-grid-column-menu-list{display:block;max-width:100%}.mtx-grid-column-menu-list.cdk-drop-list-dragging .mtx-grid-column-menu-item:not(.cdk-drag-placeholder){transition:transform .25s cubic-bezier(0,0,.2,1)}.mtx-grid-column-menu-item{display:flex;flex-direction:row;align-items:center}.mtx-grid-column-menu-item.cdk-drag-disabled .cdk-drag-handle{opacity:.35;cursor:no-drop}.mtx-grid-column-menu-item .cdk-drag-handle{cursor:move}.mtx-grid-column-menu-item.cdk-drag-preview{box-shadow:0 3px 1px -2px #0003,0 2px 2px #00000024,0 1px 5px #0000001f}.mtx-grid-column-menu-item.cdk-drag-placeholder{opacity:0}.mtx-grid-column-menu-item.cdk-drag-animating{transition:transform .25s cubic-bezier(0,0,.2,1)}.mtx-grid-column-pin-button.mat-mdc-icon-button{width:40px;height:40px;padding:8px}.mtx-grid-column-pin-button.mat-mdc-icon-button .mat-mdc-button-touch-target{width:100%;height:100%}.mtx-grid-column-pin-option.mat-menu-item{display:flex;align-items:center;height:32px}.mtx-grid-column-pin-option-placeholder{display:inline-block;width:20px;height:20px;line-height:20px;vertical-align:middle}.mtx-grid-column-pin-option-text{padding:0 8px;vertical-align:middle}.mtx-grid-column-drag-handle-icon:hover{cursor:move}\n"] }]
        }], propDecorators: { menuPanel: [{
                type: ViewChild,
                args: ['menu', { static: true }]
            }], menuTrigger: [{
                type: ViewChild,
                args: [MatMenuTrigger]
            }], columns: [{
                type: Input
            }], selectable: [{
                type: Input
            }], selectableChecked: [{
                type: Input
            }], sortable: [{
                type: Input
            }], pinnable: [{
                type: Input
            }], buttonText: [{
                type: Input
            }], buttonType: [{
                type: Input
            }], buttonColor: [{
                type: Input
            }], buttonClass: [{
                type: Input
            }], buttonIcon: [{
                type: Input
            }], showHeader: [{
                type: Input
            }], headerText: [{
                type: Input
            }], headerTemplate: [{
                type: Input
            }], showFooter: [{
                type: Input
            }], footerText: [{
                type: Input
            }], footerTemplate: [{
                type: Input
            }], columnChange: [{
                type: Output
            }], pinOptions: [{
                type: Input
            }] } });

class MtxGridExpansionToggle {
    get opened() {
        return this._opened;
    }
    set opened(newValue) {
        this._opened = newValue;
        this.openedChange.emit(newValue);
    }
    get expanded() {
        return this._opened;
    }
    set expandableRow(value) {
        if (value !== this._row) {
            this._row = value;
        }
    }
    set template(value) {
        if (value !== this._tplRef) {
            this._tplRef = value;
        }
    }
    constructor() {
        this._opened = false;
        this.openedChange = new EventEmitter();
        this.toggleChange = new EventEmitter();
    }
    onClick(event) {
        event.preventDefault();
        event.stopPropagation();
        this.toggle();
    }
    toggle() {
        this.opened = !this.opened;
        this.toggleChange.emit(this);
    }
}
/** @nocollapse */ MtxGridExpansionToggle.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MtxGridExpansionToggle, deps: [], target: i0.ɵɵFactoryTarget.Directive });
/** @nocollapse */ MtxGridExpansionToggle.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.2.1", type: MtxGridExpansionToggle, selector: "[mtx-grid-expansion-toggle]", inputs: { opened: "opened", expandableRow: "expandableRow", template: ["expansionRowTpl", "template"] }, outputs: { openedChange: "openedChange", toggleChange: "toggleChange" }, host: { listeners: { "click": "onClick($event)" }, properties: { "class.expanded": "this.expanded" } }, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MtxGridExpansionToggle, decorators: [{
            type: Directive,
            args: [{
                    selector: '[mtx-grid-expansion-toggle]',
                }]
        }], ctorParameters: function () { return []; }, propDecorators: { opened: [{
                type: Input
            }], openedChange: [{
                type: Output
            }], expanded: [{
                type: HostBinding,
                args: ['class.expanded']
            }], expandableRow: [{
                type: Input
            }], template: [{
                type: Input,
                args: ['expansionRowTpl']
            }], toggleChange: [{
                type: Output
            }], onClick: [{
                type: HostListener,
                args: ['click', ['$event']]
            }] } });

class MtxGrid {
    get _hasNoResult() {
        return (!this.data || this.data.length === 0) && !this.loading;
    }
    // TODO: Summary display conditions
    get _whetherShowSummary() {
        return this.showSummary;
    }
    constructor(_utils, _changeDetectorRef) {
        this._utils = _utils;
        this._changeDetectorRef = _changeDetectorRef;
        this.dataSource = new MatTableDataSource();
        /** The grid's displayed columns. */
        this.displayedColumns = [];
        /** The grid's columns. */
        this.columns = [];
        /** The grid's data. */
        this.data = [];
        /** The total number of the data. */
        this.length = 0;
        /** Whether the grid is loading. */
        this.loading = false;
        /** Whether the column is resizable. */
        this.columnResizable = false;
        /** Placeholder for the empty value (`null`, `''`, `[]`). */
        this.emptyValuePlaceholder = '--';
        // ===== Page =====
        /** Whether to paginate the data on front end. */
        this.pageOnFront = true;
        /** Whether to show the paginator. */
        this.showPaginator = true;
        /** Whether the paginator is disabled. */
        this.pageDisabled = false;
        /** Whether to show the first/last buttons UI to the user. */
        this.showFirstLastButtons = true;
        /** The zero-based page index of the displayed list of items. */
        this.pageIndex = 0;
        /** Number of items to display on a page. */
        this.pageSize = 10;
        /** The set of provided page size options to display to the user. */
        this.pageSizeOptions = [10, 50, 100];
        /** Whether to hide the page size selection UI from the user. */
        this.hidePageSize = false;
        /** Event emitted when the paginator changes the page size or page index. */
        this.page = new EventEmitter();
        // ===== Sort =====
        /** Whether to sort the data on front end. */
        this.sortOnFront = true;
        /**
         * Whether to disable the user from clearing the sort by finishing the sort direction cycle.
         * May be overriden by the column's `disableClear` in `sortProp`.
         */
        this.sortDisableClear = false;
        /** Whether the sort is disabled. */
        this.sortDisabled = false;
        /**
         * The direction to set when an MatSortable is initially sorted.
         * May be overriden by the column's `start` in `sortProp`.
         */
        this.sortStart = 'asc';
        /** Event emitted when the user changes either the active sort or sort direction. */
        this.sortChange = new EventEmitter();
        // ===== Row =====
        /** Whether to use the row hover style. */
        this.rowHover = false;
        /** Whether to use the row striped style. */
        this.rowStriped = false;
        /** Event emitted when the user clicks the row. */
        this.rowClick = new EventEmitter();
        // ===== Expandable Row =====
        this.expansionRowStates = [];
        /** Whether the row is expandable. */
        this.expandable = false;
        /** Expand all rows automaticaly. */
        this.expandAlways = false;
        /** Event emitted when the user toggles the expandable row. */
        this.expansionChange = new EventEmitter();
        // ===== Row Selection =====
        this.rowSelection = new SelectionModel(true, []);
        /** Whether to support multiple row/cell selection. */
        this.multiSelectable = true;
        /** Whether the user can select multiple rows with click. */
        this.multiSelectionWithClick = false;
        /** The selected row items. */
        this.rowSelected = [];
        /** Whether the row is selectable. */
        this.rowSelectable = false;
        /** Whether to hide the row selection checkbox. */
        this.hideRowSelectionCheckbox = false;
        /** The formatter to disable the row selection or hide the row's checkbox. */
        this.rowSelectionFormatter = {};
        /** Event emitted when the row is selected. */
        this.rowSelectionChange = new EventEmitter();
        // ===== Cell Selection =====
        this.cellSelection = [];
        /** Whether the cell is selectable. */
        this.cellSelectable = true;
        /** Event emitted when the cell is selected. */
        this.cellSelectionChange = new EventEmitter();
        // ===== Toolbar =====
        /** Whether to show the toolbar. */
        this.showToolbar = false;
        /** The text of the toolbar's title. */
        this.toolbarTitle = '';
        // ===== Column Menu =====
        /** Whether the column is hideable. */
        this.columnHideable = true;
        /** Hide or show when the column's checkbox is checked. */
        this.columnHideableChecked = 'show';
        /** Whether the column is sortable. */
        this.columnSortable = true;
        /** Whether the column is pinnable. */
        this.columnPinnable = true;
        /** Event emitted when the column is hided or is sorted. */
        this.columnChange = new EventEmitter();
        /** The options for the column pin list. */
        this.columnPinOptions = [];
        /** Whether to show the column menu button. */
        this.showColumnMenuButton = true;
        /** The text for the column menu button. */
        this.columnMenuButtonText = '';
        /** The type for the column menu button. */
        this.columnMenuButtonType = 'stroked';
        /** The class for the column menu button. */
        this.columnMenuButtonClass = '';
        /** The icon for the column menu button. */
        this.columnMenuButtonIcon = '';
        /** Whether to show the column-menu's header. */
        this.showColumnMenuHeader = false;
        /** The text for the column-menu's header. */
        this.columnMenuHeaderText = 'Columns Header';
        /** Whether to show the the column-menu's footer. */
        this.showColumnMenuFooter = false;
        /** The text for the column-menu's footer. */
        this.columnMenuFooterText = 'Columns Footer';
        // ===== No Result =====
        /** The displayed text for the empty data. */
        this.noResultText = 'No records found';
        // ===== Row Templates =====
        /** Whether to use custom row template. If true, you should define a matRowDef. */
        this.useContentRowTemplate = false;
        // TODO: It can't use together with `useContentRowTemplate`
        this.useContentHeaderRowTemplate = false;
        // TODO: It's not working
        this.useContentFooterRowTemplate = false;
        // ===== Summary =====
        /** Whether to show the summary. */
        this.showSummary = false;
        // ===== Side Bar =====
        /** Whether to show the sidebar. */
        this.showSidebar = false;
        // ===== Status Bar =====
        /** Whether to show the status bar. */
        this.showStatusbar = false;
    }
    detectChanges() {
        this._changeDetectorRef.detectChanges();
    }
    _getColData(data, colDef) {
        return this._utils.getColData(data, colDef);
    }
    // Waiting for async data
    ngOnChanges(changes) {
        this._countPinnedPosition();
        this.displayedColumns = this.columns.filter(item => !item.hide).map(item => item.field);
        if (this.showColumnMenuButton) {
            this.columns.forEach(item => {
                if (this.columnHideableChecked === 'show') {
                    item.show = !item.hide;
                }
                else {
                    item.hide = !!item.hide;
                }
            });
        }
        if (this.rowSelectable && !this.hideRowSelectionCheckbox) {
            this.displayedColumns.unshift('MtxGridCheckboxColumnDef');
        }
        // We should copy each item of data for expansion data
        if (this.expandable) {
            this.expansionRowStates = []; // reset
            this.data?.forEach(_ => {
                this.expansionRowStates.push({ expanded: false });
            });
        }
        if (this.rowSelectable) {
            this.rowSelection = new SelectionModel(this.multiSelectable, this.rowSelected);
        }
        this.dataSource = new MatTableDataSource(this.data);
        this.dataSource.paginator = this.pageOnFront ? this.paginator : null;
        this.dataSource.sort = this.sortOnFront ? this.sort : null;
        // Only scroll top with data change
        if (changes.data) {
            this.scrollTop(0);
        }
    }
    ngAfterViewInit() {
        if (this.pageOnFront) {
            this.dataSource.paginator = this.paginator;
        }
        if (this.sortOnFront) {
            this.dataSource.sort = this.sort;
        }
        if (this.rowDefs?.length > 0 && this.useContentRowTemplate) {
            this.rowDefs.forEach(rowDef => this.table.addRowDef(rowDef));
        }
        if (this.headerRowDefs?.length > 0 && this.useContentHeaderRowTemplate) {
            this.headerRowDefs.forEach(headerRowDef => this.table.addHeaderRowDef(headerRowDef));
        }
        if (this.footerRowDefs?.length > 0 && this.useContentFooterRowTemplate) {
            this.footerRowDefs.forEach(footerRowDef => this.table.addFooterRowDef(footerRowDef));
        }
    }
    ngOnDestroy() { }
    _countPinnedPosition() {
        const count = (acc, cur) => acc + parseFloat(cur.width || '80px');
        const pinnedLeftCols = this.columns.filter(col => col.pinned && col.pinned === 'left');
        pinnedLeftCols.forEach((item, idx) => {
            item.left = pinnedLeftCols.slice(0, idx).reduce(count, 0) + 'px';
        });
        const pinnedRightCols = this.columns
            .filter(col => col.pinned && col.pinned === 'right')
            .reverse();
        pinnedRightCols.forEach((item, idx) => {
            item.right = pinnedRightCols.slice(0, idx).reduce(count, 0) + 'px';
        });
    }
    _getIndex(index, dataIndex) {
        return typeof index === 'undefined' ? dataIndex : index;
    }
    _onSortChange(sort) {
        this.sortChange.emit(sort);
    }
    _onRowDataChange(record) {
        this.rowChangeRecord = record;
        this._changeDetectorRef.markForCheck();
    }
    /** Expansion change event */
    _onExpansionChange(expansionRef, rowData, column, index) {
        this.expansionChange.emit({ expanded: expansionRef.expanded, data: rowData, index, column });
    }
    /** Cell select event */
    _selectCell(cellRef, rowData, colDef) {
        // If not the same cell
        if (this._selectedCell !== cellRef) {
            const colValue = this._utils.getCellValue(rowData, colDef);
            this.cellSelection = []; // reset
            this.cellSelection.push({ cellData: colValue, rowData, colDef });
            this.cellSelectionChange.emit(this.cellSelection);
            if (this._selectedCell) {
                this._selectedCell.deselect(); // the selectedCell will be undefined
            }
        }
        this._selectedCell = cellRef.selected ? cellRef : undefined;
    }
    /** Row select event */
    _selectRow(event, rowData, index) {
        if (this.rowSelectable &&
            !this.rowSelectionFormatter.disabled?.(rowData, index) &&
            !this.rowSelectionFormatter.hideCheckbox?.(rowData, index)) {
            // metaKey -> command key
            if (!this.multiSelectionWithClick && !event.ctrlKey && !event.metaKey) {
                this.rowSelection.clear();
            }
            this._toggleNormalCheckbox(rowData);
        }
        this.rowClick.emit({ rowData, index });
    }
    /** Whether the number of selected elements matches the total number of rows. */
    _isAllSelected() {
        const numSelected = this.rowSelection.selected.length;
        const numRows = this.dataSource.data.filter((row, index) => !this.rowSelectionFormatter.disabled?.(row, index)).length;
        return numSelected === numRows;
    }
    /** Select all rows if they are not all selected; otherwise clear selection. */
    _toggleMasterCheckbox() {
        this._isAllSelected()
            ? this.rowSelection.clear()
            : this.dataSource.data.forEach((row, index) => {
                if (!this.rowSelectionFormatter.disabled?.(row, index)) {
                    this.rowSelection.select(row);
                }
            });
        this.rowSelectionChange.emit(this.rowSelection.selected);
    }
    /** Select normal row */
    _toggleNormalCheckbox(row) {
        this.rowSelection.toggle(row);
        this.rowSelectionChange.emit(this.rowSelection.selected);
    }
    /** Column change event */
    _onColumnChange(columns) {
        this.columnChange.emit(columns);
        this.displayedColumns = Object.assign([], this.getDisplayedColumnFields(columns));
        if (this.rowSelectable && !this.hideRowSelectionCheckbox) {
            this.displayedColumns.unshift('MtxGridCheckboxColumnDef');
        }
    }
    getDisplayedColumnFields(columns) {
        const fields = columns
            .filter(item => (this.columnHideableChecked === 'show' ? item.show : !item.hide))
            .map(item => item.field);
        return fields;
    }
    /** Customize expansion event */
    toggleExpansion(index) {
        if (!this.expandable) {
            throw new Error('The `expandable` should be set true.');
        }
        this.expansionRowStates[index].expanded = !this.expansionRowStates[index].expanded;
        return this.expansionRowStates[index].expanded;
    }
    /** Scroll to top when turn to the next page. */
    _onPage(e) {
        if (this.pageOnFront) {
            this.scrollTop(0);
        }
        this.page.emit(e);
    }
    scrollTop(value) {
        if (value == null) {
            return this.tableContainer?.nativeElement.scrollTop;
        }
        if (this.tableContainer && !this.loading) {
            this.tableContainer.nativeElement.scrollTop = value;
        }
    }
    scrollLeft(value) {
        if (value == null) {
            return this.tableContainer?.nativeElement.scrollLeft;
        }
        if (this.tableContainer && !this.loading) {
            this.tableContainer.nativeElement.scrollLeft = value;
        }
    }
}
/** @nocollapse */ MtxGrid.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MtxGrid, deps: [{ token: MtxGridUtils }, { token: i0.ChangeDetectorRef }], target: i0.ɵɵFactoryTarget.Component });
/** @nocollapse */ MtxGrid.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.1", type: MtxGrid, selector: "mtx-grid", inputs: { displayedColumns: "displayedColumns", columns: "columns", data: "data", length: "length", loading: "loading", trackBy: "trackBy", columnResizable: "columnResizable", emptyValuePlaceholder: "emptyValuePlaceholder", pageOnFront: "pageOnFront", showPaginator: "showPaginator", pageDisabled: "pageDisabled", showFirstLastButtons: "showFirstLastButtons", pageIndex: "pageIndex", pageSize: "pageSize", pageSizeOptions: "pageSizeOptions", hidePageSize: "hidePageSize", paginationTemplate: "paginationTemplate", sortOnFront: "sortOnFront", sortActive: "sortActive", sortDirection: "sortDirection", sortDisableClear: "sortDisableClear", sortDisabled: "sortDisabled", sortStart: "sortStart", rowHover: "rowHover", rowStriped: "rowStriped", expandable: "expandable", expandAlways: "expandAlways", expansionTemplate: "expansionTemplate", multiSelectable: "multiSelectable", multiSelectionWithClick: "multiSelectionWithClick", rowSelected: "rowSelected", rowSelectable: "rowSelectable", hideRowSelectionCheckbox: "hideRowSelectionCheckbox", rowSelectionFormatter: "rowSelectionFormatter", rowClassFormatter: "rowClassFormatter", cellSelectable: "cellSelectable", showToolbar: "showToolbar", toolbarTitle: "toolbarTitle", toolbarTemplate: "toolbarTemplate", columnHideable: "columnHideable", columnHideableChecked: "columnHideableChecked", columnSortable: "columnSortable", columnPinnable: "columnPinnable", columnPinOptions: "columnPinOptions", showColumnMenuButton: "showColumnMenuButton", columnMenuButtonText: "columnMenuButtonText", columnMenuButtonType: "columnMenuButtonType", columnMenuButtonColor: "columnMenuButtonColor", columnMenuButtonClass: "columnMenuButtonClass", columnMenuButtonIcon: "columnMenuButtonIcon", showColumnMenuHeader: "showColumnMenuHeader", columnMenuHeaderText: "columnMenuHeaderText", columnMenuHeaderTemplate: "columnMenuHeaderTemplate", showColumnMenuFooter: "showColumnMenuFooter", columnMenuFooterText: "columnMenuFooterText", columnMenuFooterTemplate: "columnMenuFooterTemplate", noResultText: "noResultText", noResultTemplate: "noResultTemplate", headerTemplate: "headerTemplate", headerExtraTemplate: "headerExtraTemplate", cellTemplate: "cellTemplate", useContentRowTemplate: "useContentRowTemplate", useContentHeaderRowTemplate: "useContentHeaderRowTemplate", useContentFooterRowTemplate: "useContentFooterRowTemplate", showSummary: "showSummary", summaryTemplate: "summaryTemplate", showSidebar: "showSidebar", sidebarTemplate: "sidebarTemplate", showStatusbar: "showStatusbar", statusbarTemplate: "statusbarTemplate" }, outputs: { page: "page", sortChange: "sortChange", rowClick: "rowClick", expansionChange: "expansionChange", rowSelectionChange: "rowSelectionChange", cellSelectionChange: "cellSelectionChange", columnChange: "columnChange" }, host: { classAttribute: "mtx-grid" }, queries: [{ propertyName: "rowDefs", predicate: MatRowDef }, { propertyName: "headerRowDefs", predicate: MatHeaderRowDef }, { propertyName: "footerRowDefs", predicate: MatFooterRow }], viewQueries: [{ propertyName: "table", first: true, predicate: MatTable, descendants: true }, { propertyName: "paginator", first: true, predicate: MatPaginator, descendants: true }, { propertyName: "sort", first: true, predicate: MatSort, descendants: true }, { propertyName: "columnMenu", first: true, predicate: ["columnMenu"], descendants: true }, { propertyName: "tableContainer", first: true, predicate: ["tableContainer"], descendants: true }], exportAs: ["mtxGrid"], usesOnChanges: true, ngImport: i0, template: "<!-- Progress bar-->\r\n<div class=\"mtx-grid-progress\" *ngIf=\"loading\">\r\n  <mat-progress-bar mode=\"indeterminate\"></mat-progress-bar>\r\n</div>\r\n\r\n<!-- Toolbar -->\r\n<div class=\"mtx-grid-toolbar\" *ngIf=\"showToolbar\">\r\n  <div class=\"mtx-grid-toolbar-content\">\r\n    <ng-template [ngIf]=\"toolbarTemplate\" [ngIfElse]=\"defaultToolbarTemplate\">\r\n      <ng-template [ngTemplateOutlet]=\"toolbarTemplate\"></ng-template>\r\n    </ng-template>\r\n    <ng-template #defaultToolbarTemplate>\r\n      <div class=\"mtx-grid-toolbar-title\" *ngIf=\"toolbarTitle\">{{toolbarTitle}}</div>\r\n    </ng-template>\r\n  </div>\r\n  <div class=\"mtx-grid-toolbar-actions\">\r\n    <mtx-grid-column-menu *ngIf=\"showColumnMenuButton\" #columnMenu\r\n                          [columns]=\"columns\"\r\n                          [buttonText]=\"columnMenuButtonText\"\r\n                          [buttonType]=\"columnMenuButtonType\"\r\n                          [buttonColor]=\"columnMenuButtonColor\"\r\n                          [buttonClass]=\"columnMenuButtonClass\"\r\n                          [buttonIcon]=\"columnMenuButtonIcon\"\r\n                          [selectable]=\"columnHideable\"\r\n                          [selectableChecked]=\"columnHideableChecked\"\r\n                          [sortable]=\"columnSortable\"\r\n                          [pinnable]=\"columnPinnable\"\r\n                          [showHeader]=\"showColumnMenuHeader\"\r\n                          [headerText]=\"columnMenuHeaderText\"\r\n                          [headerTemplate]=\"columnMenuHeaderTemplate\"\r\n                          [showFooter]=\"showColumnMenuFooter\"\r\n                          [footerText]=\"columnMenuFooterText\"\r\n                          [footerTemplate]=\"columnMenuFooterTemplate\"\r\n                          [pinOptions]=\"columnPinOptions\"\r\n                          (columnChange)=\"_onColumnChange($event)\">\r\n    </mtx-grid-column-menu>\r\n  </div>\r\n</div>\r\n\r\n<div class=\"mtx-grid-main mtx-grid-layout\">\r\n  <!-- Table content -->\r\n  <div class=\"mtx-grid-content mtx-grid-layout\">\r\n    <div #tableContainer class=\"mat-table-container\"\r\n         [ngClass]=\"{'mat-table-with-data': !_hasNoResult}\">\r\n      <table mat-table *ngIf=\"!columnResizable\"\r\n             [ngClass]=\"{'mat-table-hover': rowHover, 'mat-table-striped': rowStriped, 'mat-table-expandable': expandable}\"\r\n             [dataSource]=\"dataSource\" [multiTemplateDataRows]=\"expandable\"\r\n             matSort\r\n             [matSortActive]=\"sortActive\"\r\n             [matSortDirection]=\"sortDirection\"\r\n             [matSortDisableClear]=\"sortDisableClear\"\r\n             [matSortDisabled]=\"sortDisabled\"\r\n             [matSortStart]=\"sortStart\"\r\n             (matSortChange)=\"_onSortChange($event)\"\r\n             [trackBy]=\"trackBy\">\r\n\r\n        <ng-container *ngIf=\"rowSelectable && !hideRowSelectionCheckbox\"\r\n                      matColumnDef=\"MtxGridCheckboxColumnDef\">\r\n          <th mat-header-cell *matHeaderCellDef class=\"mtx-grid-checkbox-cell\">\r\n            <mat-checkbox *ngIf=\"multiSelectable\"\r\n                          [checked]=\"rowSelection.hasValue() && _isAllSelected()\"\r\n                          [indeterminate]=\"rowSelection.hasValue() && !_isAllSelected()\"\r\n                          (change)=\"$event ? _toggleMasterCheckbox() : null\">\r\n            </mat-checkbox>\r\n          </th>\r\n          <td mat-cell *matCellDef=\"let row; let index = index; let dataIndex = dataIndex;\"\r\n              class=\"mtx-grid-checkbox-cell\">\r\n            <mat-checkbox *ngIf=\"!(rowSelectionFormatter.hideCheckbox && rowSelectionFormatter.hideCheckbox(row, _getIndex(index, dataIndex)))\"\r\n                          [disabled]=\"rowSelectionFormatter.disabled && rowSelectionFormatter.disabled(row, _getIndex(index, dataIndex))\"\r\n                          [checked]=\"rowSelection.isSelected(row)\"\r\n                          (click)=\"$event.stopPropagation()\"\r\n                          (change)=\"$event ? _toggleNormalCheckbox(row) : null\">\r\n            </mat-checkbox>\r\n          </td>\r\n          <td mat-footer-cell *matFooterCellDef class=\"mtx-grid-checkbox-cell\"></td>\r\n        </ng-container>\r\n\r\n        <ng-container *ngFor=\"let col of columns;\">\r\n          <ng-container [matColumnDef]=\"col.field\"\r\n                        [sticky]=\"col.pinned==='left'\" [stickyEnd]=\"col.pinned==='right'\">\r\n            <th mat-header-cell *matHeaderCellDef\r\n                [class]=\"col | colClass\"\r\n                [ngClass]=\"{'mat-table-sticky-left': col.pinned === 'left', 'mat-table-sticky-right': col.pinned === 'right'}\"\r\n                [ngStyle]=\"{'width': col.width, 'min-width': col.width, 'left': col.left, 'right': col.right}\">\r\n              <div class=\"mat-header-cell-inner\">\r\n                <ng-template [ngIf]=\"headerTemplate | isTemplateRef\" [ngIfElse]=\"headerTpl\">\r\n                  <ng-template [ngTemplateOutlet]=\"$any(headerTemplate)\"\r\n                               [ngTemplateOutletContext]=\"{ $implicit: col, colDef: col }\">\r\n                  </ng-template>\r\n                </ng-template>\r\n                <ng-template #headerTpl>\r\n                  <ng-template [ngIf]=\"$any(headerTemplate)?.[col.field] | isTemplateRef\"\r\n                               [ngIfElse]=\"defaultHeaderTpl\">\r\n                    <ng-template [ngTemplateOutlet]=\"$any(headerTemplate)[col.field]\"\r\n                                 [ngTemplateOutletContext]=\"{ $implicit: col, colDef: col }\">\r\n                    </ng-template>\r\n                  </ng-template>\r\n                </ng-template>\r\n                <ng-template #defaultHeaderTpl>\r\n                  <div [mat-sort-header]=\"col.sortProp?.id || col.field\"\r\n                       [disabled]=\"!col.sortable\"\r\n                       [arrowPosition]=\"col.sortProp?.arrowPosition!\"\r\n                       [disableClear]=\"col.sortProp?.disableClear\"\r\n                       [start]=\"col.sortProp?.start!\">\r\n                    <span class=\"mtx-grid-expansion-placeholder\" *ngIf=\"col.showExpand\"></span>\r\n                    <span>{{col.header | toObservable | async}}</span>\r\n                    <svg class=\"mtx-grid-icon mat-sort-header-icon\" *ngIf=\"col.sortable\"\r\n                         viewBox=\"0 0 24 24\" width=\"24px\" height=\"24px\" fill=\"currentColor\"\r\n                         focusable=\"false\">\r\n                      <path d=\"M3,13H15V11H3M3,6V8H21V6M3,18H9V16H3V18Z\"></path>\r\n                    </svg>\r\n                  </div>\r\n                  <ng-template [ngTemplateOutlet]=\"headerExtraTplBase\"\r\n                               [ngTemplateOutletContext]=\"{ $implicit: headerExtraTemplate, colDef: col }\">\r\n                  </ng-template>\r\n                </ng-template>\r\n              </div>\r\n            </th>\r\n\r\n            <td mat-cell *matCellDef=\"let row; let index = index; let dataIndex = dataIndex;\"\r\n                [class]=\"col | colClass: row: rowChangeRecord: rowChangeRecord?.currentValue\"\r\n                [ngClass]=\"{'mat-table-sticky-left': col.pinned === 'left', 'mat-table-sticky-right': col.pinned === 'right'}\"\r\n                [ngStyle]=\"{'width': col.width, 'min-width': col.width, 'left': col.left, 'right': col.right}\"\r\n                mtx-grid-selectable-cell (cellSelectionChange)=\"_selectCell($event, row, col)\">\r\n              <ng-template [ngIf]=\"cellTemplate | isTemplateRef\" [ngIfElse]=\"cellTpl\">\r\n                <ng-template [ngTemplateOutlet]=\"$any(cellTemplate)\"\r\n                             [ngTemplateOutletContext]=\"{ $implicit: row, rowData: row, index: _getIndex(index, dataIndex), colDef: col }\">\r\n                </ng-template>\r\n              </ng-template>\r\n              <ng-template #cellTpl>\r\n                <ng-template [ngIf]=\"$any(cellTemplate)?.[col.field] | isTemplateRef\"\r\n                             [ngIfElse]=\"colDefCellTpl\">\r\n                  <ng-template [ngTemplateOutlet]=\"$any(cellTemplate)[col.field]\"\r\n                               [ngTemplateOutletContext]=\"{ $implicit: row, rowData: row, index: _getIndex(index, dataIndex), colDef: col }\">\r\n                  </ng-template>\r\n                </ng-template>\r\n              </ng-template>\r\n              <ng-template #colDefCellTpl>\r\n                <ng-template [ngIf]=\"col.cellTemplate\" [ngIfElse]=\"defaultCellTpl\"\r\n                             [ngTemplateOutlet]=\"col.cellTemplate!\"\r\n                             [ngTemplateOutletContext]=\"{ $implicit: row, rowData: row, index: _getIndex(index, dataIndex), colDef: col }\">\r\n                </ng-template>\r\n              </ng-template>\r\n              <ng-template #defaultCellTpl>\r\n                <button class=\"mtx-grid-row-expand-button\" *ngIf=\"col.showExpand && !expandAlways\"\r\n                        mat-icon-button mtx-grid-expansion-toggle\r\n                        [(opened)]=\"expansionRowStates[dataIndex].expanded\"\r\n                        (toggleChange)=\"_onExpansionChange($event, row, col, dataIndex);\">\r\n                  <svg class=\"mtx-grid-icon mtx-grid-row-expand-icon\" viewBox=\"0 0 24 24\"\r\n                       width=\"24px\" height=\"24px\" fill=\"currentColor\" focusable=\"false\">\r\n                    <path d=\"M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z\"></path>\r\n                  </svg>\r\n                </button>\r\n\r\n                <mtx-grid-cell [rowData]=\"row\" [colDef]=\"col\" [placeholder]=\"emptyValuePlaceholder\"\r\n                               (rowDataChange)=\"_onRowDataChange($event)\">\r\n                </mtx-grid-cell>\r\n              </ng-template>\r\n            </td>\r\n\r\n            <td mat-footer-cell *matFooterCellDef\r\n                [ngClass]=\"{'mat-table-sticky-left': col.pinned === 'left', 'mat-table-sticky-right': col.pinned === 'right'}\"\r\n                [ngStyle]=\"{'width': col.width, 'min-width': col.width, 'left': col.left, 'right': col.right}\">\r\n              <span class=\"mtx-grid-expansion-placeholder\" *ngIf=\"col.showExpand\"></span>\r\n\r\n              <ng-template [ngIf]=\"summaryTemplate | isTemplateRef\" [ngIfElse]=\"summaryTpl\">\r\n                <ng-template [ngTemplateOutlet]=\"$any(summaryTemplate)\"\r\n                             [ngTemplateOutletContext]=\"{ $implicit: col, colDef: col, data: data }\">\r\n                </ng-template>\r\n              </ng-template>\r\n              <ng-template #summaryTpl>\r\n                <ng-template [ngIf]=\"$any(summaryTemplate)?.[col.field] | isTemplateRef\"\r\n                             [ngIfElse]=\"defaultSummaryTpl\">\r\n                  <ng-template [ngTemplateOutlet]=\"$any(summaryTemplate)[col.field]\"\r\n                               [ngTemplateOutletContext]=\"{ $implicit: _getColData(data, col), colData: _getColData(data, col), colDef: col }\">\r\n                  </ng-template>\r\n                </ng-template>\r\n              </ng-template>\r\n              <ng-template #defaultSummaryTpl>\r\n                <mtx-grid-cell [summary]=\"true\" [data]=\"data\" [colDef]=\"col\"\r\n                               [placeholder]=\"emptyValuePlaceholder\">\r\n                </mtx-grid-cell>\r\n              </ng-template>\r\n            </td>\r\n          </ng-container>\r\n        </ng-container>\r\n\r\n        <ng-template [ngIf]=\"useContentHeaderRowTemplate\" [ngIfElse]=\"defaultHeaderRowTpl\">\r\n        </ng-template>\r\n        <ng-template #defaultHeaderRowTpl>\r\n          <tr mat-header-row *matHeaderRowDef=\"displayedColumns; sticky: true\"></tr>\r\n        </ng-template>\r\n\r\n        <ng-template [ngIf]=\"useContentRowTemplate\" [ngIfElse]=\"defaultRowTpl\"></ng-template>\r\n        <ng-template #defaultRowTpl>\r\n          <tr mat-row\r\n              *matRowDef=\"let row; let index = index; let dataIndex = dataIndex; columns: displayedColumns;\"\r\n              [class]=\"row | rowClass: index: dataIndex: rowClassFormatter\"\r\n              [ngClass]=\"{'selected': rowSelection.isSelected(row)}\"\r\n              (click)=\"_selectRow($event, row, _getIndex(index, dataIndex))\">\r\n          </tr>\r\n        </ng-template>\r\n\r\n        <ng-template [ngIf]=\"_whetherShowSummary\">\r\n          <tr mat-footer-row *matFooterRowDef=\"displayedColumns; sticky: true\"></tr>\r\n        </ng-template>\r\n        <ng-template [ngIf]=\"useContentFooterRowTemplate\"></ng-template>\r\n\r\n        <ng-container *ngIf=\"expandable\">\r\n          <!-- Expanded Content Column - The expandable row is made up of this one column that spans across all columns -->\r\n          <ng-container matColumnDef=\"MtxGridExpansionColumnDef\">\r\n            <td mat-cell *matCellDef=\"let row; let dataIndex = dataIndex\"\r\n                [attr.colspan]=\"displayedColumns.length\">\r\n              <div class=\"mtx-grid-expansion-detail\"\r\n                   [@expansion]=\"expandAlways || expansionRowStates[dataIndex].expanded ? 'expanded' : 'collapsed'\">\r\n                <ng-template [ngTemplateOutlet]=\"expansionTemplate\"\r\n                             [ngTemplateOutletContext]=\"{ $implicit: row, rowData: row, index: dataIndex, expanded: expansionRowStates[dataIndex].expanded }\">\r\n                </ng-template>\r\n              </div>\r\n            </td>\r\n          </ng-container>\r\n\r\n          <tr mat-row\r\n              *matRowDef=\"let row; columns: ['MtxGridExpansionColumnDef']; let dataIndex = dataIndex\"\r\n              [ngClass]=\"['mtx-grid-expansion', expandAlways || expansionRowStates[dataIndex].expanded ? 'expanded' : 'collapsed']\">\r\n          </tr>\r\n        </ng-container>\r\n      </table>\r\n\r\n      <!-- TODO: Use flexbox-based mat-table -->\r\n      <table mat-table *ngIf=\"columnResizable\"\r\n             columnResize\r\n             [ngClass]=\"{'mat-table-hover': rowHover, 'mat-table-striped': rowStriped, 'mat-table-expandable': expandable}\"\r\n             [dataSource]=\"dataSource\" [multiTemplateDataRows]=\"expandable\"\r\n             matSort\r\n             [matSortActive]=\"sortActive\"\r\n             [matSortDirection]=\"sortDirection\"\r\n             [matSortDisableClear]=\"sortDisableClear\"\r\n             [matSortDisabled]=\"sortDisabled\"\r\n             [matSortStart]=\"sortStart\"\r\n             (matSortChange)=\"_onSortChange($event)\"\r\n             [trackBy]=\"trackBy\">\r\n\r\n        <ng-container *ngIf=\"rowSelectable && !hideRowSelectionCheckbox\"\r\n                      matColumnDef=\"MtxGridCheckboxColumnDef\">\r\n          <th mat-header-cell *matHeaderCellDef class=\"mtx-grid-checkbox-cell\">\r\n            <mat-checkbox *ngIf=\"multiSelectable\"\r\n                          [checked]=\"rowSelection.hasValue() && _isAllSelected()\"\r\n                          [indeterminate]=\"rowSelection.hasValue() && !_isAllSelected()\"\r\n                          (change)=\"$event ? _toggleMasterCheckbox() : null\">\r\n            </mat-checkbox>\r\n          </th>\r\n          <td mat-cell *matCellDef=\"let row; let index = index; let dataIndex = dataIndex;\"\r\n              class=\"mtx-grid-checkbox-cell\">\r\n            <mat-checkbox *ngIf=\"!(rowSelectionFormatter.hideCheckbox && rowSelectionFormatter.hideCheckbox(row, _getIndex(index, dataIndex)))\"\r\n                          [disabled]=\"rowSelectionFormatter.disabled && rowSelectionFormatter.disabled(row, _getIndex(index, dataIndex))\"\r\n                          [checked]=\"rowSelection.isSelected(row)\"\r\n                          (click)=\"$event.stopPropagation()\"\r\n                          (change)=\"$event ? _toggleNormalCheckbox(row) : null\">\r\n            </mat-checkbox>\r\n          </td>\r\n          <td mat-footer-cell *matFooterCellDef class=\"mtx-grid-checkbox-cell\"></td>\r\n        </ng-container>\r\n\r\n        <ng-container *ngFor=\"let col of columns;\">\r\n          <ng-container [matColumnDef]=\"col.field\"\r\n                        [sticky]=\"col.pinned==='left'\" [stickyEnd]=\"col.pinned==='right'\">\r\n            <th mat-header-cell *matHeaderCellDef\r\n                [class]=\"col | colClass\"\r\n                [ngClass]=\"{'mat-table-sticky-left': col.pinned === 'left', 'mat-table-sticky-right': col.pinned === 'right'}\"\r\n                [ngStyle]=\"{'width': col.width, 'left': col.left, 'right': col.right}\"\r\n                [resizable]=\"col.resizable\"\r\n                [matResizableMinWidthPx]=\"col.minWidth\" [matResizableMaxWidthPx]=\"col.maxWidth\">\r\n              <div class=\"mat-header-cell-inner\">\r\n                <ng-template [ngIf]=\"headerTemplate | isTemplateRef\" [ngIfElse]=\"headerTpl\">\r\n                  <ng-template [ngTemplateOutlet]=\"$any(headerTemplate)\"\r\n                               [ngTemplateOutletContext]=\"{ $implicit: col, colDef: col }\">\r\n                  </ng-template>\r\n                </ng-template>\r\n                <ng-template #headerTpl>\r\n                  <ng-template [ngIf]=\"$any(headerTemplate)?.[col.field] | isTemplateRef\"\r\n                               [ngIfElse]=\"defaultHeaderTpl\">\r\n                    <ng-template [ngTemplateOutlet]=\"$any(headerTemplate)[col.field]\"\r\n                                 [ngTemplateOutletContext]=\"{ $implicit: col, colDef: col }\">\r\n                    </ng-template>\r\n                  </ng-template>\r\n                </ng-template>\r\n                <ng-template #defaultHeaderTpl>\r\n                  <div [mat-sort-header]=\"col.sortProp?.id || col.field\"\r\n                       [disabled]=\"!col.sortable\"\r\n                       [arrowPosition]=\"col.sortProp?.arrowPosition!\"\r\n                       [disableClear]=\"col.sortProp?.disableClear\"\r\n                       [start]=\"col.sortProp?.start!\">\r\n                    <span class=\"mtx-grid-expansion-placeholder\" *ngIf=\"col.showExpand\"></span>\r\n                    <span>{{col.header | toObservable | async}}</span>\r\n                    <svg class=\"mtx-grid-icon mat-sort-header-icon\" *ngIf=\"col.sortable\"\r\n                         viewBox=\"0 0 24 24\" width=\"24px\" height=\"24px\" fill=\"currentColor\"\r\n                         focusable=\"false\">\r\n                      <path d=\"M3,13H15V11H3M3,6V8H21V6M3,18H9V16H3V18Z\"></path>\r\n                    </svg>\r\n                  </div>\r\n                  <ng-template [ngTemplateOutlet]=\"headerExtraTplBase\"\r\n                               [ngTemplateOutletContext]=\"{ $implicit: headerExtraTemplate, colDef: col }\">\r\n                  </ng-template>\r\n                </ng-template>\r\n              </div>\r\n            </th>\r\n\r\n            <td mat-cell *matCellDef=\"let row; let index = index; let dataIndex = dataIndex;\"\r\n                [class]=\"col | colClass: row: rowChangeRecord :rowChangeRecord?.currentValue\"\r\n                [ngClass]=\"{'mat-table-sticky-left': col.pinned === 'left', 'mat-table-sticky-right': col.pinned === 'right'}\"\r\n                [ngStyle]=\"{'width': col.width, 'left': col.left, 'right': col.right}\"\r\n                mtx-grid-selectable-cell (cellSelectionChange)=\"_selectCell($event, row, col)\">\r\n              <ng-template [ngIf]=\"cellTemplate | isTemplateRef\" [ngIfElse]=\"cellTpl\">\r\n                <ng-template [ngTemplateOutlet]=\"$any(cellTemplate)\"\r\n                             [ngTemplateOutletContext]=\"{ $implicit: row, rowData: row, index: _getIndex(index, dataIndex), colDef: col }\">\r\n                </ng-template>\r\n              </ng-template>\r\n              <ng-template #cellTpl>\r\n                <ng-template [ngIf]=\"$any(cellTemplate)?.[col.field] | isTemplateRef\"\r\n                             [ngIfElse]=\"colDefCellTpl\">\r\n                  <ng-template [ngTemplateOutlet]=\"$any(cellTemplate)[col.field]\"\r\n                               [ngTemplateOutletContext]=\"{ $implicit: row, rowData: row, index: _getIndex(index, dataIndex), colDef: col }\">\r\n                  </ng-template>\r\n                </ng-template>\r\n              </ng-template>\r\n              <ng-template #colDefCellTpl>\r\n                <ng-template [ngIf]=\"col.cellTemplate\" [ngIfElse]=\"defaultCellTpl\"\r\n                             [ngTemplateOutlet]=\"col.cellTemplate!\"\r\n                             [ngTemplateOutletContext]=\"{ $implicit: row, rowData: row, index: _getIndex(index, dataIndex), colDef: col }\">\r\n                </ng-template>\r\n              </ng-template>\r\n              <ng-template #defaultCellTpl>\r\n                <button class=\"mtx-grid-row-expand-button\" *ngIf=\"col.showExpand && !expandAlways\"\r\n                        mat-icon-button mtx-grid-expansion-toggle\r\n                        [(opened)]=\"expansionRowStates[dataIndex].expanded\"\r\n                        (toggleChange)=\"_onExpansionChange($event, row, col, dataIndex);\">\r\n                  <svg class=\"mtx-grid-icon mtx-grid-row-expand-icon\" viewBox=\"0 0 24 24\"\r\n                       width=\"24px\" height=\"24px\" fill=\"currentColor\" focusable=\"false\">\r\n                    <path d=\"M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z\"></path>\r\n                  </svg>\r\n                </button>\r\n\r\n                <mtx-grid-cell [rowData]=\"row\" [colDef]=\"col\" [placeholder]=\"emptyValuePlaceholder\"\r\n                               (rowDataChange)=\"_onRowDataChange($event)\">\r\n                </mtx-grid-cell>\r\n              </ng-template>\r\n            </td>\r\n\r\n            <td mat-footer-cell *matFooterCellDef\r\n                [ngClass]=\"{'mat-table-sticky-left': col.pinned === 'left', 'mat-table-sticky-right': col.pinned === 'right'}\"\r\n                [ngStyle]=\"{'width': col.width, 'left': col.left, 'right': col.right}\">\r\n              <span class=\"mtx-grid-expansion-placeholder\" *ngIf=\"col.showExpand\"></span>\r\n\r\n              <ng-template [ngIf]=\"summaryTemplate | isTemplateRef\" [ngIfElse]=\"summaryTpl\">\r\n                <ng-template [ngTemplateOutlet]=\"$any(summaryTemplate)\"\r\n                             [ngTemplateOutletContext]=\"{ $implicit: col, colDef: col, data: data }\">\r\n                </ng-template>\r\n              </ng-template>\r\n              <ng-template #summaryTpl>\r\n                <ng-template [ngIf]=\"$any(summaryTemplate)?.[col.field] | isTemplateRef\"\r\n                             [ngIfElse]=\"defaultSummaryTpl\">\r\n                  <ng-template [ngTemplateOutlet]=\"$any(summaryTemplate)[col.field]\"\r\n                               [ngTemplateOutletContext]=\"{ $implicit: _getColData(data, col), colData: _getColData(data, col), colDef: col }\">\r\n                  </ng-template>\r\n                </ng-template>\r\n              </ng-template>\r\n              <ng-template #defaultSummaryTpl>\r\n                <mtx-grid-cell [summary]=\"true\" [data]=\"data\" [colDef]=\"col\"\r\n                               [placeholder]=\"emptyValuePlaceholder\">\r\n                </mtx-grid-cell>\r\n              </ng-template>\r\n            </td>\r\n          </ng-container>\r\n        </ng-container>\r\n\r\n        <ng-template [ngIf]=\"useContentHeaderRowTemplate\" [ngIfElse]=\"defaultHeaderRowTpl\">\r\n        </ng-template>\r\n        <ng-template #defaultHeaderRowTpl>\r\n          <tr mat-header-row *matHeaderRowDef=\"displayedColumns; sticky: true\"></tr>\r\n        </ng-template>\r\n\r\n        <ng-template [ngIf]=\"useContentRowTemplate\" [ngIfElse]=\"defaultRowTpl\"></ng-template>\r\n        <ng-template #defaultRowTpl>\r\n          <tr mat-row\r\n              *matRowDef=\"let row; let index = index; let dataIndex = dataIndex; columns: displayedColumns;\"\r\n              [class]=\"row | rowClass: index: dataIndex: rowClassFormatter\"\r\n              [ngClass]=\"{'selected': rowSelection.isSelected(row)}\"\r\n              (click)=\"_selectRow($event, row, _getIndex(index, dataIndex))\">\r\n          </tr>\r\n        </ng-template>\r\n\r\n        <ng-template [ngIf]=\"_whetherShowSummary\">\r\n          <tr mat-footer-row *matFooterRowDef=\"displayedColumns; sticky: true\"></tr>\r\n        </ng-template>\r\n        <ng-template [ngIf]=\"useContentFooterRowTemplate\"></ng-template>\r\n\r\n        <ng-container *ngIf=\"expandable\">\r\n          <!-- Expanded Content Column - The expandable row is made up of this one column that spans across all columns -->\r\n          <ng-container matColumnDef=\"MtxGridExpansionColumnDef\">\r\n            <td mat-cell *matCellDef=\"let row; let dataIndex = dataIndex\"\r\n                [attr.colspan]=\"displayedColumns.length\">\r\n              <div class=\"mtx-grid-expansion-detail\"\r\n                   [@expansion]=\"expandAlways || expansionRowStates[dataIndex].expanded ? 'expanded' : 'collapsed'\">\r\n                <ng-template [ngTemplateOutlet]=\"expansionTemplate\"\r\n                             [ngTemplateOutletContext]=\"{ $implicit: row, rowData: row, index: dataIndex, expanded: expansionRowStates[dataIndex].expanded }\">\r\n                </ng-template>\r\n              </div>\r\n            </td>\r\n          </ng-container>\r\n\r\n          <tr mat-row\r\n              *matRowDef=\"let row; columns: ['MtxGridExpansionColumnDef']; let dataIndex = dataIndex\"\r\n              [ngClass]=\"['mtx-grid-expansion', expandAlways || expansionRowStates[dataIndex].expanded ? 'expanded' : 'collapsed']\">\r\n          </tr>\r\n        </ng-container>\r\n      </table>\r\n    </div>\r\n\r\n    <!-- No result -->\r\n    <div class=\"mtx-grid-no-result\" *ngIf=\"_hasNoResult\">\r\n      <ng-template [ngIf]=\"noResultTemplate\" [ngIfElse]=\"defaultNoResultTpl\">\r\n        <ng-template [ngTemplateOutlet]=\"noResultTemplate\"></ng-template>\r\n      </ng-template>\r\n      <ng-template #defaultNoResultTpl>{{noResultText}}</ng-template>\r\n    </div>\r\n  </div>\r\n\r\n  <!-- Tool sidebar -->\r\n  <div class=\"mtx-grid-sidebar\" *ngIf=\"showSidebar\">\r\n    <ng-template [ngIf]=\"sidebarTemplate\">\r\n      <ng-template [ngTemplateOutlet]=\"sidebarTemplate\"></ng-template>\r\n    </ng-template>\r\n  </div>\r\n</div>\r\n\r\n<div class=\"mtx-grid-footer\">\r\n  <!-- Status Bar -->\r\n  <div class=\"mtx-grid-statusbar\" *ngIf=\"showStatusbar\">\r\n    <ng-template [ngIf]=\"statusbarTemplate\">\r\n      <ng-template [ngTemplateOutlet]=\"statusbarTemplate\"></ng-template>\r\n    </ng-template>\r\n  </div>\r\n\r\n  <!-- Pagination -->\r\n  <div class=\"mtx-grid-pagination\">\r\n    <ng-template [ngIf]=\"paginationTemplate\" [ngIfElse]=\"defaultPaginationTemplate\">\r\n      <ng-template [ngTemplateOutlet]=\"paginationTemplate\"></ng-template>\r\n    </ng-template>\r\n    <ng-template #defaultPaginationTemplate>\r\n      <mat-paginator [class.mat-paginator-hidden]=\"!showPaginator\"\r\n                     [showFirstLastButtons]=\"showFirstLastButtons\"\r\n                     [length]=\"length\"\r\n                     [pageIndex]=\"pageIndex\"\r\n                     [pageSize]=\"pageSize\"\r\n                     [pageSizeOptions]=\"pageSizeOptions\"\r\n                     [hidePageSize]=\"hidePageSize\"\r\n                     (page)=\"_onPage($event)\"\r\n                     [disabled]=\"pageDisabled\">\r\n      </mat-paginator>\r\n    </ng-template>\r\n  </div>\r\n</div>\r\n\r\n<!-- Header template for extra content -->\r\n<ng-template #headerExtraTplBase let-headerExtraTemplate let-col=\"colDef\">\r\n  <ng-template [ngIf]=\"headerExtraTemplate | isTemplateRef\" [ngIfElse]=\"headerExtraTpl\">\r\n    <ng-template [ngTemplateOutlet]=\"headerExtraTemplate\"\r\n                 [ngTemplateOutletContext]=\"{ $implicit: col, colDef: col }\">\r\n    </ng-template>\r\n  </ng-template>\r\n  <ng-template #headerExtraTpl>\r\n    <ng-template [ngIf]=\"$any(headerExtraTemplate)?.[col.field] | isTemplateRef\">\r\n      <ng-template [ngTemplateOutlet]=\"headerExtraTemplate[col.field]\"\r\n                   [ngTemplateOutletContext]=\"{ $implicit: col, colDef: col }\">\r\n      </ng-template>\r\n    </ng-template>\r\n  </ng-template>\r\n</ng-template>\r\n", styles: [".mtx-grid{position:relative;display:flex;flex-direction:column;width:100%}.mtx-grid .mat-table-container{overflow:auto}.mtx-grid .mat-table-container.mat-table-with-data{flex:1}.mtx-grid .mat-mdc-table:not(.mat-column-resize-table){min-width:100%;border-collapse:separate}.mtx-grid .mat-mdc-table:not(.mat-column-resize-table) .mat-mdc-header-cell:not(.mtx-grid-checkbox-cell),.mtx-grid .mat-mdc-table:not(.mat-column-resize-table) .mat-mdc-footer-cell:not(.mtx-grid-checkbox-cell),.mtx-grid .mat-mdc-table:not(.mat-column-resize-table) .mat-mdc-cell:not(.mtx-grid-checkbox-cell){min-width:80px}.mtx-grid .mat-table-sticky-left{border-right-width:1px;border-right-style:solid}[dir=rtl] .mtx-grid .mat-table-sticky-left{border-right-width:0;border-left-width:1px;border-left-style:solid}.mtx-grid .mat-table-sticky-right{border-left-width:1px;border-left-style:solid}[dir=rtl] .mtx-grid .mat-table-sticky-right{border-left-width:0;border-right-width:1px;border-right-style:solid}.mtx-grid .mat-mdc-header-cell,.mtx-grid .mat-mdc-footer-cell,.mtx-grid .mat-mdc-cell{padding:4px 10px;box-sizing:border-box}.mtx-grid .mat-mdc-header-cell:first-of-type:not(:only-of-type),.mtx-grid .mat-mdc-footer-cell:first-of-type:not(:only-of-type),.mtx-grid .mat-mdc-cell:first-of-type:not(:only-of-type){padding-left:24px}.mtx-grid .mat-mdc-header-cell:first-of-type:not(:only-of-type).mtx-grid-checkbox-cell,.mtx-grid .mat-mdc-footer-cell:first-of-type:not(:only-of-type).mtx-grid-checkbox-cell,.mtx-grid .mat-mdc-cell:first-of-type:not(:only-of-type).mtx-grid-checkbox-cell{padding-left:10px;padding-right:10px}[dir=rtl] .mtx-grid .mat-mdc-header-cell:first-of-type:not(:only-of-type),[dir=rtl] .mtx-grid .mat-mdc-footer-cell:first-of-type:not(:only-of-type),[dir=rtl] .mtx-grid .mat-mdc-cell:first-of-type:not(:only-of-type){padding-left:10px;padding-right:24px}[dir=rtl] .mtx-grid .mat-mdc-header-cell:first-of-type:not(:only-of-type).mtx-grid-checkbox-cell,[dir=rtl] .mtx-grid .mat-mdc-footer-cell:first-of-type:not(:only-of-type).mtx-grid-checkbox-cell,[dir=rtl] .mtx-grid .mat-mdc-cell:first-of-type:not(:only-of-type).mtx-grid-checkbox-cell{padding-left:10px;padding-right:10px}.mtx-grid .mat-mdc-header-cell:last-of-type:not(:only-of-type),.mtx-grid .mat-mdc-footer-cell:last-of-type:not(:only-of-type),.mtx-grid .mat-mdc-cell:last-of-type:not(:only-of-type){padding-right:24px}[dir=rtl] .mtx-grid .mat-mdc-header-cell:last-of-type:not(:only-of-type),[dir=rtl] .mtx-grid .mat-mdc-footer-cell:last-of-type:not(:only-of-type),[dir=rtl] .mtx-grid .mat-mdc-cell:last-of-type:not(:only-of-type){padding-left:24px;padding-right:10px}.mtx-grid .mat-mdc-row.mtx-grid-expansion{height:0;overflow:hidden}.mtx-grid .mat-mdc-row.mtx-grid-expansion .mat-mdc-cell{padding-top:0;padding-bottom:0}.mtx-grid .mat-mdc-row.mtx-grid-expansion.collapsed .mat-mdc-cell{border-bottom-width:0}.mtx-grid .mat-mdc-row:last-of-type .mat-cell{border-bottom-width:0}.mtx-grid .mat-sort-header-icon{margin:0 4px}.mtx-grid .mat-header-cell-inner{display:flex;align-items:center}.mtx-grid .mat-paginator-hidden{display:none}.mtx-grid-progress{position:absolute;top:0;z-index:120;width:100%}.mtx-grid-toolbar{display:flex;justify-content:space-between;align-items:center;min-height:48px;padding:8px;box-sizing:border-box}.mtx-grid-layout{display:flex;flex:1 1 auto;overflow:auto}.mtx-grid-content{flex-direction:column;width:0}.mtx-grid-sidebar{max-width:50%;border-left-width:1px;border-left-style:solid}[dir=rtl] .mtx-grid-sidebar{border-left-width:0;border-right-width:1px;border-right-style:solid}.mtx-grid-footer{position:relative;z-index:1}.mtx-grid-statusbar{display:flex;align-items:center;min-height:56px;padding:8px}.mtx-grid-no-result{display:flex;justify-content:center;align-items:center;flex:1;min-height:150px}.mtx-grid-expansion-placeholder{display:inline-block;width:40px;height:40px;vertical-align:middle}.mtx-grid-expansion-detail{display:flex;align-items:center;min-height:48px;overflow:hidden}.mtx-grid-checkbox-cell{flex:none;justify-content:center;width:60px;min-width:60px}.mtx-grid-checkbox-cell .mat-checkbox{display:flex;margin:0 10px}.mtx-grid-checkbox-cell .mat-checkbox-inner-container{margin-left:0}.mtx-grid-row-expand-button.mat-mdc-icon-button{width:40px;height:40px;padding:8px;vertical-align:middle}.mtx-grid-row-expand-button.mat-mdc-icon-button.expanded .mtx-grid-row-expand-icon{transform:rotate(90deg)}.mtx-grid-row-expand-button.mat-mdc-icon-button+mtx-grid-cell{vertical-align:middle}.mtx-grid-row-expand-button.mat-mdc-icon-button .mat-mdc-button-touch-target{width:100%;height:100%}.mtx-grid-icon{width:20px;height:20px;font-size:20px}\n"], dependencies: [{ kind: "directive", type: i0.forwardRef(function () { return i3$1.NgClass; }), selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i0.forwardRef(function () { return i3$1.NgForOf; }), selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i0.forwardRef(function () { return i3$1.NgIf; }), selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i0.forwardRef(function () { return i3$1.NgTemplateOutlet; }), selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "directive", type: i0.forwardRef(function () { return i3$1.NgStyle; }), selector: "[ngStyle]", inputs: ["ngStyle"] }, { kind: "component", type: i0.forwardRef(function () { return i3$3.MatTable; }), selector: "mat-table, table[mat-table]", exportAs: ["matTable"] }, { kind: "directive", type: i0.forwardRef(function () { return i3$3.MatHeaderCellDef; }), selector: "[matHeaderCellDef]" }, { kind: "directive", type: i0.forwardRef(function () { return i3$3.MatHeaderRowDef; }), selector: "[matHeaderRowDef]", inputs: ["matHeaderRowDef", "matHeaderRowDefSticky"] }, { kind: "directive", type: i0.forwardRef(function () { return i3$3.MatColumnDef; }), selector: "[matColumnDef]", inputs: ["sticky", "matColumnDef"] }, { kind: "directive", type: i0.forwardRef(function () { return i3$3.MatCellDef; }), selector: "[matCellDef]" }, { kind: "directive", type: i0.forwardRef(function () { return i3$3.MatRowDef; }), selector: "[matRowDef]", inputs: ["matRowDefColumns", "matRowDefWhen"] }, { kind: "directive", type: i0.forwardRef(function () { return i3$3.MatFooterCellDef; }), selector: "[matFooterCellDef]" }, { kind: "directive", type: i0.forwardRef(function () { return i3$3.MatFooterRowDef; }), selector: "[matFooterRowDef]", inputs: ["matFooterRowDef", "matFooterRowDefSticky"] }, { kind: "directive", type: i0.forwardRef(function () { return i3$3.MatHeaderCell; }), selector: "mat-header-cell, th[mat-header-cell]" }, { kind: "directive", type: i0.forwardRef(function () { return i3$3.MatCell; }), selector: "mat-cell, td[mat-cell]" }, { kind: "directive", type: i0.forwardRef(function () { return i3$3.MatFooterCell; }), selector: "mat-footer-cell, td[mat-footer-cell]" }, { kind: "component", type: i0.forwardRef(function () { return i3$3.MatHeaderRow; }), selector: "mat-header-row, tr[mat-header-row]", exportAs: ["matHeaderRow"] }, { kind: "component", type: i0.forwardRef(function () { return i3$3.MatRow; }), selector: "mat-row, tr[mat-row]", exportAs: ["matRow"] }, { kind: "component", type: i0.forwardRef(function () { return i3$3.MatFooterRow; }), selector: "mat-footer-row, tr[mat-footer-row]", exportAs: ["matFooterRow"] }, { kind: "directive", type: i0.forwardRef(function () { return i4$2.MatSort; }), selector: "[matSort]", inputs: ["matSortDisabled", "matSortActive", "matSortStart", "matSortDirection", "matSortDisableClear"], outputs: ["matSortChange"], exportAs: ["matSort"] }, { kind: "component", type: i0.forwardRef(function () { return i4$2.MatSortHeader; }), selector: "[mat-sort-header]", inputs: ["disabled", "mat-sort-header", "arrowPosition", "start", "sortActionDescription", "disableClear"], exportAs: ["matSortHeader"] }, { kind: "component", type: i0.forwardRef(function () { return i5$1.MatPaginator; }), selector: "mat-paginator", inputs: ["disabled"], exportAs: ["matPaginator"] }, { kind: "component", type: i0.forwardRef(function () { return i3$2.MatCheckbox; }), selector: "mat-checkbox", inputs: ["disableRipple", "color", "tabIndex"], exportAs: ["matCheckbox"] }, { kind: "component", type: i0.forwardRef(function () { return i4$1.MatIconButton; }), selector: "button[mat-icon-button]", inputs: ["disabled", "disableRipple", "color"], exportAs: ["matButton"] }, { kind: "component", type: i0.forwardRef(function () { return i8$1.MatProgressBar; }), selector: "mat-progress-bar", inputs: ["color", "value", "bufferValue", "mode"], outputs: ["animationEnd"], exportAs: ["matProgressBar"] }, { kind: "directive", type: i0.forwardRef(function () { return MatColumnResize; }), selector: "table[mat-table][columnResize]" }, { kind: "directive", type: i0.forwardRef(function () { return MatResizable; }), selector: "mat-header-cell[resizable], th[mat-header-cell][resizable]", inputs: ["matResizableMinWidthPx", "matResizableMaxWidthPx", "resizable"] }, { kind: "component", type: i0.forwardRef(function () { return MtxGridCell; }), selector: "mtx-grid-cell", inputs: ["rowData", "colDef", "data", "summary", "placeholder"], outputs: ["rowDataChange"], exportAs: ["mtxGridCell"] }, { kind: "component", type: i0.forwardRef(function () { return MtxGridColumnMenu; }), selector: "mtx-grid-column-menu", inputs: ["columns", "selectable", "selectableChecked", "sortable", "pinnable", "buttonText", "buttonType", "buttonColor", "buttonClass", "buttonIcon", "showHeader", "headerText", "headerTemplate", "showFooter", "footerText", "footerTemplate", "pinOptions"], outputs: ["columnChange"], exportAs: ["mtxGridColumnMenu"] }, { kind: "directive", type: i0.forwardRef(function () { return MtxGridExpansionToggle; }), selector: "[mtx-grid-expansion-toggle]", inputs: ["opened", "expandableRow", "expansionRowTpl"], outputs: ["openedChange", "toggleChange"] }, { kind: "directive", type: i0.forwardRef(function () { return MtxGridSelectableCell; }), selector: "[mtx-grid-selectable-cell]", inputs: ["mtxSelectableRowData"], outputs: ["cellSelectionChange"] }, { kind: "pipe", type: i0.forwardRef(function () { return i3$1.AsyncPipe; }), name: "async" }, { kind: "pipe", type: i0.forwardRef(function () { return i8.MtxToObservablePipe; }), name: "toObservable" }, { kind: "pipe", type: i0.forwardRef(function () { return i8.MtxIsTemplateRefPipe; }), name: "isTemplateRef" }, { kind: "pipe", type: i0.forwardRef(function () { return MtxGridRowClassPipe; }), name: "rowClass" }, { kind: "pipe", type: i0.forwardRef(function () { return MtxGridColClassPipe; }), name: "colClass" }], animations: [
        trigger('expansion', [
            state('collapsed, void', style({ height: '0', minHeight: '0', visibility: 'hidden' })),
            state('expanded', style({ height: '*', visibility: 'visible' })),
            transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
            transition('expanded <=> void', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
        ]),
    ], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MtxGrid, decorators: [{
            type: Component,
            args: [{ selector: 'mtx-grid', exportAs: 'mtxGrid', host: {
                        class: 'mtx-grid',
                    }, encapsulation: ViewEncapsulation.None, changeDetection: ChangeDetectionStrategy.OnPush, animations: [
                        trigger('expansion', [
                            state('collapsed, void', style({ height: '0', minHeight: '0', visibility: 'hidden' })),
                            state('expanded', style({ height: '*', visibility: 'visible' })),
                            transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
                            transition('expanded <=> void', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
                        ]),
                    ], template: "<!-- Progress bar-->\r\n<div class=\"mtx-grid-progress\" *ngIf=\"loading\">\r\n  <mat-progress-bar mode=\"indeterminate\"></mat-progress-bar>\r\n</div>\r\n\r\n<!-- Toolbar -->\r\n<div class=\"mtx-grid-toolbar\" *ngIf=\"showToolbar\">\r\n  <div class=\"mtx-grid-toolbar-content\">\r\n    <ng-template [ngIf]=\"toolbarTemplate\" [ngIfElse]=\"defaultToolbarTemplate\">\r\n      <ng-template [ngTemplateOutlet]=\"toolbarTemplate\"></ng-template>\r\n    </ng-template>\r\n    <ng-template #defaultToolbarTemplate>\r\n      <div class=\"mtx-grid-toolbar-title\" *ngIf=\"toolbarTitle\">{{toolbarTitle}}</div>\r\n    </ng-template>\r\n  </div>\r\n  <div class=\"mtx-grid-toolbar-actions\">\r\n    <mtx-grid-column-menu *ngIf=\"showColumnMenuButton\" #columnMenu\r\n                          [columns]=\"columns\"\r\n                          [buttonText]=\"columnMenuButtonText\"\r\n                          [buttonType]=\"columnMenuButtonType\"\r\n                          [buttonColor]=\"columnMenuButtonColor\"\r\n                          [buttonClass]=\"columnMenuButtonClass\"\r\n                          [buttonIcon]=\"columnMenuButtonIcon\"\r\n                          [selectable]=\"columnHideable\"\r\n                          [selectableChecked]=\"columnHideableChecked\"\r\n                          [sortable]=\"columnSortable\"\r\n                          [pinnable]=\"columnPinnable\"\r\n                          [showHeader]=\"showColumnMenuHeader\"\r\n                          [headerText]=\"columnMenuHeaderText\"\r\n                          [headerTemplate]=\"columnMenuHeaderTemplate\"\r\n                          [showFooter]=\"showColumnMenuFooter\"\r\n                          [footerText]=\"columnMenuFooterText\"\r\n                          [footerTemplate]=\"columnMenuFooterTemplate\"\r\n                          [pinOptions]=\"columnPinOptions\"\r\n                          (columnChange)=\"_onColumnChange($event)\">\r\n    </mtx-grid-column-menu>\r\n  </div>\r\n</div>\r\n\r\n<div class=\"mtx-grid-main mtx-grid-layout\">\r\n  <!-- Table content -->\r\n  <div class=\"mtx-grid-content mtx-grid-layout\">\r\n    <div #tableContainer class=\"mat-table-container\"\r\n         [ngClass]=\"{'mat-table-with-data': !_hasNoResult}\">\r\n      <table mat-table *ngIf=\"!columnResizable\"\r\n             [ngClass]=\"{'mat-table-hover': rowHover, 'mat-table-striped': rowStriped, 'mat-table-expandable': expandable}\"\r\n             [dataSource]=\"dataSource\" [multiTemplateDataRows]=\"expandable\"\r\n             matSort\r\n             [matSortActive]=\"sortActive\"\r\n             [matSortDirection]=\"sortDirection\"\r\n             [matSortDisableClear]=\"sortDisableClear\"\r\n             [matSortDisabled]=\"sortDisabled\"\r\n             [matSortStart]=\"sortStart\"\r\n             (matSortChange)=\"_onSortChange($event)\"\r\n             [trackBy]=\"trackBy\">\r\n\r\n        <ng-container *ngIf=\"rowSelectable && !hideRowSelectionCheckbox\"\r\n                      matColumnDef=\"MtxGridCheckboxColumnDef\">\r\n          <th mat-header-cell *matHeaderCellDef class=\"mtx-grid-checkbox-cell\">\r\n            <mat-checkbox *ngIf=\"multiSelectable\"\r\n                          [checked]=\"rowSelection.hasValue() && _isAllSelected()\"\r\n                          [indeterminate]=\"rowSelection.hasValue() && !_isAllSelected()\"\r\n                          (change)=\"$event ? _toggleMasterCheckbox() : null\">\r\n            </mat-checkbox>\r\n          </th>\r\n          <td mat-cell *matCellDef=\"let row; let index = index; let dataIndex = dataIndex;\"\r\n              class=\"mtx-grid-checkbox-cell\">\r\n            <mat-checkbox *ngIf=\"!(rowSelectionFormatter.hideCheckbox && rowSelectionFormatter.hideCheckbox(row, _getIndex(index, dataIndex)))\"\r\n                          [disabled]=\"rowSelectionFormatter.disabled && rowSelectionFormatter.disabled(row, _getIndex(index, dataIndex))\"\r\n                          [checked]=\"rowSelection.isSelected(row)\"\r\n                          (click)=\"$event.stopPropagation()\"\r\n                          (change)=\"$event ? _toggleNormalCheckbox(row) : null\">\r\n            </mat-checkbox>\r\n          </td>\r\n          <td mat-footer-cell *matFooterCellDef class=\"mtx-grid-checkbox-cell\"></td>\r\n        </ng-container>\r\n\r\n        <ng-container *ngFor=\"let col of columns;\">\r\n          <ng-container [matColumnDef]=\"col.field\"\r\n                        [sticky]=\"col.pinned==='left'\" [stickyEnd]=\"col.pinned==='right'\">\r\n            <th mat-header-cell *matHeaderCellDef\r\n                [class]=\"col | colClass\"\r\n                [ngClass]=\"{'mat-table-sticky-left': col.pinned === 'left', 'mat-table-sticky-right': col.pinned === 'right'}\"\r\n                [ngStyle]=\"{'width': col.width, 'min-width': col.width, 'left': col.left, 'right': col.right}\">\r\n              <div class=\"mat-header-cell-inner\">\r\n                <ng-template [ngIf]=\"headerTemplate | isTemplateRef\" [ngIfElse]=\"headerTpl\">\r\n                  <ng-template [ngTemplateOutlet]=\"$any(headerTemplate)\"\r\n                               [ngTemplateOutletContext]=\"{ $implicit: col, colDef: col }\">\r\n                  </ng-template>\r\n                </ng-template>\r\n                <ng-template #headerTpl>\r\n                  <ng-template [ngIf]=\"$any(headerTemplate)?.[col.field] | isTemplateRef\"\r\n                               [ngIfElse]=\"defaultHeaderTpl\">\r\n                    <ng-template [ngTemplateOutlet]=\"$any(headerTemplate)[col.field]\"\r\n                                 [ngTemplateOutletContext]=\"{ $implicit: col, colDef: col }\">\r\n                    </ng-template>\r\n                  </ng-template>\r\n                </ng-template>\r\n                <ng-template #defaultHeaderTpl>\r\n                  <div [mat-sort-header]=\"col.sortProp?.id || col.field\"\r\n                       [disabled]=\"!col.sortable\"\r\n                       [arrowPosition]=\"col.sortProp?.arrowPosition!\"\r\n                       [disableClear]=\"col.sortProp?.disableClear\"\r\n                       [start]=\"col.sortProp?.start!\">\r\n                    <span class=\"mtx-grid-expansion-placeholder\" *ngIf=\"col.showExpand\"></span>\r\n                    <span>{{col.header | toObservable | async}}</span>\r\n                    <svg class=\"mtx-grid-icon mat-sort-header-icon\" *ngIf=\"col.sortable\"\r\n                         viewBox=\"0 0 24 24\" width=\"24px\" height=\"24px\" fill=\"currentColor\"\r\n                         focusable=\"false\">\r\n                      <path d=\"M3,13H15V11H3M3,6V8H21V6M3,18H9V16H3V18Z\"></path>\r\n                    </svg>\r\n                  </div>\r\n                  <ng-template [ngTemplateOutlet]=\"headerExtraTplBase\"\r\n                               [ngTemplateOutletContext]=\"{ $implicit: headerExtraTemplate, colDef: col }\">\r\n                  </ng-template>\r\n                </ng-template>\r\n              </div>\r\n            </th>\r\n\r\n            <td mat-cell *matCellDef=\"let row; let index = index; let dataIndex = dataIndex;\"\r\n                [class]=\"col | colClass: row: rowChangeRecord: rowChangeRecord?.currentValue\"\r\n                [ngClass]=\"{'mat-table-sticky-left': col.pinned === 'left', 'mat-table-sticky-right': col.pinned === 'right'}\"\r\n                [ngStyle]=\"{'width': col.width, 'min-width': col.width, 'left': col.left, 'right': col.right}\"\r\n                mtx-grid-selectable-cell (cellSelectionChange)=\"_selectCell($event, row, col)\">\r\n              <ng-template [ngIf]=\"cellTemplate | isTemplateRef\" [ngIfElse]=\"cellTpl\">\r\n                <ng-template [ngTemplateOutlet]=\"$any(cellTemplate)\"\r\n                             [ngTemplateOutletContext]=\"{ $implicit: row, rowData: row, index: _getIndex(index, dataIndex), colDef: col }\">\r\n                </ng-template>\r\n              </ng-template>\r\n              <ng-template #cellTpl>\r\n                <ng-template [ngIf]=\"$any(cellTemplate)?.[col.field] | isTemplateRef\"\r\n                             [ngIfElse]=\"colDefCellTpl\">\r\n                  <ng-template [ngTemplateOutlet]=\"$any(cellTemplate)[col.field]\"\r\n                               [ngTemplateOutletContext]=\"{ $implicit: row, rowData: row, index: _getIndex(index, dataIndex), colDef: col }\">\r\n                  </ng-template>\r\n                </ng-template>\r\n              </ng-template>\r\n              <ng-template #colDefCellTpl>\r\n                <ng-template [ngIf]=\"col.cellTemplate\" [ngIfElse]=\"defaultCellTpl\"\r\n                             [ngTemplateOutlet]=\"col.cellTemplate!\"\r\n                             [ngTemplateOutletContext]=\"{ $implicit: row, rowData: row, index: _getIndex(index, dataIndex), colDef: col }\">\r\n                </ng-template>\r\n              </ng-template>\r\n              <ng-template #defaultCellTpl>\r\n                <button class=\"mtx-grid-row-expand-button\" *ngIf=\"col.showExpand && !expandAlways\"\r\n                        mat-icon-button mtx-grid-expansion-toggle\r\n                        [(opened)]=\"expansionRowStates[dataIndex].expanded\"\r\n                        (toggleChange)=\"_onExpansionChange($event, row, col, dataIndex);\">\r\n                  <svg class=\"mtx-grid-icon mtx-grid-row-expand-icon\" viewBox=\"0 0 24 24\"\r\n                       width=\"24px\" height=\"24px\" fill=\"currentColor\" focusable=\"false\">\r\n                    <path d=\"M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z\"></path>\r\n                  </svg>\r\n                </button>\r\n\r\n                <mtx-grid-cell [rowData]=\"row\" [colDef]=\"col\" [placeholder]=\"emptyValuePlaceholder\"\r\n                               (rowDataChange)=\"_onRowDataChange($event)\">\r\n                </mtx-grid-cell>\r\n              </ng-template>\r\n            </td>\r\n\r\n            <td mat-footer-cell *matFooterCellDef\r\n                [ngClass]=\"{'mat-table-sticky-left': col.pinned === 'left', 'mat-table-sticky-right': col.pinned === 'right'}\"\r\n                [ngStyle]=\"{'width': col.width, 'min-width': col.width, 'left': col.left, 'right': col.right}\">\r\n              <span class=\"mtx-grid-expansion-placeholder\" *ngIf=\"col.showExpand\"></span>\r\n\r\n              <ng-template [ngIf]=\"summaryTemplate | isTemplateRef\" [ngIfElse]=\"summaryTpl\">\r\n                <ng-template [ngTemplateOutlet]=\"$any(summaryTemplate)\"\r\n                             [ngTemplateOutletContext]=\"{ $implicit: col, colDef: col, data: data }\">\r\n                </ng-template>\r\n              </ng-template>\r\n              <ng-template #summaryTpl>\r\n                <ng-template [ngIf]=\"$any(summaryTemplate)?.[col.field] | isTemplateRef\"\r\n                             [ngIfElse]=\"defaultSummaryTpl\">\r\n                  <ng-template [ngTemplateOutlet]=\"$any(summaryTemplate)[col.field]\"\r\n                               [ngTemplateOutletContext]=\"{ $implicit: _getColData(data, col), colData: _getColData(data, col), colDef: col }\">\r\n                  </ng-template>\r\n                </ng-template>\r\n              </ng-template>\r\n              <ng-template #defaultSummaryTpl>\r\n                <mtx-grid-cell [summary]=\"true\" [data]=\"data\" [colDef]=\"col\"\r\n                               [placeholder]=\"emptyValuePlaceholder\">\r\n                </mtx-grid-cell>\r\n              </ng-template>\r\n            </td>\r\n          </ng-container>\r\n        </ng-container>\r\n\r\n        <ng-template [ngIf]=\"useContentHeaderRowTemplate\" [ngIfElse]=\"defaultHeaderRowTpl\">\r\n        </ng-template>\r\n        <ng-template #defaultHeaderRowTpl>\r\n          <tr mat-header-row *matHeaderRowDef=\"displayedColumns; sticky: true\"></tr>\r\n        </ng-template>\r\n\r\n        <ng-template [ngIf]=\"useContentRowTemplate\" [ngIfElse]=\"defaultRowTpl\"></ng-template>\r\n        <ng-template #defaultRowTpl>\r\n          <tr mat-row\r\n              *matRowDef=\"let row; let index = index; let dataIndex = dataIndex; columns: displayedColumns;\"\r\n              [class]=\"row | rowClass: index: dataIndex: rowClassFormatter\"\r\n              [ngClass]=\"{'selected': rowSelection.isSelected(row)}\"\r\n              (click)=\"_selectRow($event, row, _getIndex(index, dataIndex))\">\r\n          </tr>\r\n        </ng-template>\r\n\r\n        <ng-template [ngIf]=\"_whetherShowSummary\">\r\n          <tr mat-footer-row *matFooterRowDef=\"displayedColumns; sticky: true\"></tr>\r\n        </ng-template>\r\n        <ng-template [ngIf]=\"useContentFooterRowTemplate\"></ng-template>\r\n\r\n        <ng-container *ngIf=\"expandable\">\r\n          <!-- Expanded Content Column - The expandable row is made up of this one column that spans across all columns -->\r\n          <ng-container matColumnDef=\"MtxGridExpansionColumnDef\">\r\n            <td mat-cell *matCellDef=\"let row; let dataIndex = dataIndex\"\r\n                [attr.colspan]=\"displayedColumns.length\">\r\n              <div class=\"mtx-grid-expansion-detail\"\r\n                   [@expansion]=\"expandAlways || expansionRowStates[dataIndex].expanded ? 'expanded' : 'collapsed'\">\r\n                <ng-template [ngTemplateOutlet]=\"expansionTemplate\"\r\n                             [ngTemplateOutletContext]=\"{ $implicit: row, rowData: row, index: dataIndex, expanded: expansionRowStates[dataIndex].expanded }\">\r\n                </ng-template>\r\n              </div>\r\n            </td>\r\n          </ng-container>\r\n\r\n          <tr mat-row\r\n              *matRowDef=\"let row; columns: ['MtxGridExpansionColumnDef']; let dataIndex = dataIndex\"\r\n              [ngClass]=\"['mtx-grid-expansion', expandAlways || expansionRowStates[dataIndex].expanded ? 'expanded' : 'collapsed']\">\r\n          </tr>\r\n        </ng-container>\r\n      </table>\r\n\r\n      <!-- TODO: Use flexbox-based mat-table -->\r\n      <table mat-table *ngIf=\"columnResizable\"\r\n             columnResize\r\n             [ngClass]=\"{'mat-table-hover': rowHover, 'mat-table-striped': rowStriped, 'mat-table-expandable': expandable}\"\r\n             [dataSource]=\"dataSource\" [multiTemplateDataRows]=\"expandable\"\r\n             matSort\r\n             [matSortActive]=\"sortActive\"\r\n             [matSortDirection]=\"sortDirection\"\r\n             [matSortDisableClear]=\"sortDisableClear\"\r\n             [matSortDisabled]=\"sortDisabled\"\r\n             [matSortStart]=\"sortStart\"\r\n             (matSortChange)=\"_onSortChange($event)\"\r\n             [trackBy]=\"trackBy\">\r\n\r\n        <ng-container *ngIf=\"rowSelectable && !hideRowSelectionCheckbox\"\r\n                      matColumnDef=\"MtxGridCheckboxColumnDef\">\r\n          <th mat-header-cell *matHeaderCellDef class=\"mtx-grid-checkbox-cell\">\r\n            <mat-checkbox *ngIf=\"multiSelectable\"\r\n                          [checked]=\"rowSelection.hasValue() && _isAllSelected()\"\r\n                          [indeterminate]=\"rowSelection.hasValue() && !_isAllSelected()\"\r\n                          (change)=\"$event ? _toggleMasterCheckbox() : null\">\r\n            </mat-checkbox>\r\n          </th>\r\n          <td mat-cell *matCellDef=\"let row; let index = index; let dataIndex = dataIndex;\"\r\n              class=\"mtx-grid-checkbox-cell\">\r\n            <mat-checkbox *ngIf=\"!(rowSelectionFormatter.hideCheckbox && rowSelectionFormatter.hideCheckbox(row, _getIndex(index, dataIndex)))\"\r\n                          [disabled]=\"rowSelectionFormatter.disabled && rowSelectionFormatter.disabled(row, _getIndex(index, dataIndex))\"\r\n                          [checked]=\"rowSelection.isSelected(row)\"\r\n                          (click)=\"$event.stopPropagation()\"\r\n                          (change)=\"$event ? _toggleNormalCheckbox(row) : null\">\r\n            </mat-checkbox>\r\n          </td>\r\n          <td mat-footer-cell *matFooterCellDef class=\"mtx-grid-checkbox-cell\"></td>\r\n        </ng-container>\r\n\r\n        <ng-container *ngFor=\"let col of columns;\">\r\n          <ng-container [matColumnDef]=\"col.field\"\r\n                        [sticky]=\"col.pinned==='left'\" [stickyEnd]=\"col.pinned==='right'\">\r\n            <th mat-header-cell *matHeaderCellDef\r\n                [class]=\"col | colClass\"\r\n                [ngClass]=\"{'mat-table-sticky-left': col.pinned === 'left', 'mat-table-sticky-right': col.pinned === 'right'}\"\r\n                [ngStyle]=\"{'width': col.width, 'left': col.left, 'right': col.right}\"\r\n                [resizable]=\"col.resizable\"\r\n                [matResizableMinWidthPx]=\"col.minWidth\" [matResizableMaxWidthPx]=\"col.maxWidth\">\r\n              <div class=\"mat-header-cell-inner\">\r\n                <ng-template [ngIf]=\"headerTemplate | isTemplateRef\" [ngIfElse]=\"headerTpl\">\r\n                  <ng-template [ngTemplateOutlet]=\"$any(headerTemplate)\"\r\n                               [ngTemplateOutletContext]=\"{ $implicit: col, colDef: col }\">\r\n                  </ng-template>\r\n                </ng-template>\r\n                <ng-template #headerTpl>\r\n                  <ng-template [ngIf]=\"$any(headerTemplate)?.[col.field] | isTemplateRef\"\r\n                               [ngIfElse]=\"defaultHeaderTpl\">\r\n                    <ng-template [ngTemplateOutlet]=\"$any(headerTemplate)[col.field]\"\r\n                                 [ngTemplateOutletContext]=\"{ $implicit: col, colDef: col }\">\r\n                    </ng-template>\r\n                  </ng-template>\r\n                </ng-template>\r\n                <ng-template #defaultHeaderTpl>\r\n                  <div [mat-sort-header]=\"col.sortProp?.id || col.field\"\r\n                       [disabled]=\"!col.sortable\"\r\n                       [arrowPosition]=\"col.sortProp?.arrowPosition!\"\r\n                       [disableClear]=\"col.sortProp?.disableClear\"\r\n                       [start]=\"col.sortProp?.start!\">\r\n                    <span class=\"mtx-grid-expansion-placeholder\" *ngIf=\"col.showExpand\"></span>\r\n                    <span>{{col.header | toObservable | async}}</span>\r\n                    <svg class=\"mtx-grid-icon mat-sort-header-icon\" *ngIf=\"col.sortable\"\r\n                         viewBox=\"0 0 24 24\" width=\"24px\" height=\"24px\" fill=\"currentColor\"\r\n                         focusable=\"false\">\r\n                      <path d=\"M3,13H15V11H3M3,6V8H21V6M3,18H9V16H3V18Z\"></path>\r\n                    </svg>\r\n                  </div>\r\n                  <ng-template [ngTemplateOutlet]=\"headerExtraTplBase\"\r\n                               [ngTemplateOutletContext]=\"{ $implicit: headerExtraTemplate, colDef: col }\">\r\n                  </ng-template>\r\n                </ng-template>\r\n              </div>\r\n            </th>\r\n\r\n            <td mat-cell *matCellDef=\"let row; let index = index; let dataIndex = dataIndex;\"\r\n                [class]=\"col | colClass: row: rowChangeRecord :rowChangeRecord?.currentValue\"\r\n                [ngClass]=\"{'mat-table-sticky-left': col.pinned === 'left', 'mat-table-sticky-right': col.pinned === 'right'}\"\r\n                [ngStyle]=\"{'width': col.width, 'left': col.left, 'right': col.right}\"\r\n                mtx-grid-selectable-cell (cellSelectionChange)=\"_selectCell($event, row, col)\">\r\n              <ng-template [ngIf]=\"cellTemplate | isTemplateRef\" [ngIfElse]=\"cellTpl\">\r\n                <ng-template [ngTemplateOutlet]=\"$any(cellTemplate)\"\r\n                             [ngTemplateOutletContext]=\"{ $implicit: row, rowData: row, index: _getIndex(index, dataIndex), colDef: col }\">\r\n                </ng-template>\r\n              </ng-template>\r\n              <ng-template #cellTpl>\r\n                <ng-template [ngIf]=\"$any(cellTemplate)?.[col.field] | isTemplateRef\"\r\n                             [ngIfElse]=\"colDefCellTpl\">\r\n                  <ng-template [ngTemplateOutlet]=\"$any(cellTemplate)[col.field]\"\r\n                               [ngTemplateOutletContext]=\"{ $implicit: row, rowData: row, index: _getIndex(index, dataIndex), colDef: col }\">\r\n                  </ng-template>\r\n                </ng-template>\r\n              </ng-template>\r\n              <ng-template #colDefCellTpl>\r\n                <ng-template [ngIf]=\"col.cellTemplate\" [ngIfElse]=\"defaultCellTpl\"\r\n                             [ngTemplateOutlet]=\"col.cellTemplate!\"\r\n                             [ngTemplateOutletContext]=\"{ $implicit: row, rowData: row, index: _getIndex(index, dataIndex), colDef: col }\">\r\n                </ng-template>\r\n              </ng-template>\r\n              <ng-template #defaultCellTpl>\r\n                <button class=\"mtx-grid-row-expand-button\" *ngIf=\"col.showExpand && !expandAlways\"\r\n                        mat-icon-button mtx-grid-expansion-toggle\r\n                        [(opened)]=\"expansionRowStates[dataIndex].expanded\"\r\n                        (toggleChange)=\"_onExpansionChange($event, row, col, dataIndex);\">\r\n                  <svg class=\"mtx-grid-icon mtx-grid-row-expand-icon\" viewBox=\"0 0 24 24\"\r\n                       width=\"24px\" height=\"24px\" fill=\"currentColor\" focusable=\"false\">\r\n                    <path d=\"M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z\"></path>\r\n                  </svg>\r\n                </button>\r\n\r\n                <mtx-grid-cell [rowData]=\"row\" [colDef]=\"col\" [placeholder]=\"emptyValuePlaceholder\"\r\n                               (rowDataChange)=\"_onRowDataChange($event)\">\r\n                </mtx-grid-cell>\r\n              </ng-template>\r\n            </td>\r\n\r\n            <td mat-footer-cell *matFooterCellDef\r\n                [ngClass]=\"{'mat-table-sticky-left': col.pinned === 'left', 'mat-table-sticky-right': col.pinned === 'right'}\"\r\n                [ngStyle]=\"{'width': col.width, 'left': col.left, 'right': col.right}\">\r\n              <span class=\"mtx-grid-expansion-placeholder\" *ngIf=\"col.showExpand\"></span>\r\n\r\n              <ng-template [ngIf]=\"summaryTemplate | isTemplateRef\" [ngIfElse]=\"summaryTpl\">\r\n                <ng-template [ngTemplateOutlet]=\"$any(summaryTemplate)\"\r\n                             [ngTemplateOutletContext]=\"{ $implicit: col, colDef: col, data: data }\">\r\n                </ng-template>\r\n              </ng-template>\r\n              <ng-template #summaryTpl>\r\n                <ng-template [ngIf]=\"$any(summaryTemplate)?.[col.field] | isTemplateRef\"\r\n                             [ngIfElse]=\"defaultSummaryTpl\">\r\n                  <ng-template [ngTemplateOutlet]=\"$any(summaryTemplate)[col.field]\"\r\n                               [ngTemplateOutletContext]=\"{ $implicit: _getColData(data, col), colData: _getColData(data, col), colDef: col }\">\r\n                  </ng-template>\r\n                </ng-template>\r\n              </ng-template>\r\n              <ng-template #defaultSummaryTpl>\r\n                <mtx-grid-cell [summary]=\"true\" [data]=\"data\" [colDef]=\"col\"\r\n                               [placeholder]=\"emptyValuePlaceholder\">\r\n                </mtx-grid-cell>\r\n              </ng-template>\r\n            </td>\r\n          </ng-container>\r\n        </ng-container>\r\n\r\n        <ng-template [ngIf]=\"useContentHeaderRowTemplate\" [ngIfElse]=\"defaultHeaderRowTpl\">\r\n        </ng-template>\r\n        <ng-template #defaultHeaderRowTpl>\r\n          <tr mat-header-row *matHeaderRowDef=\"displayedColumns; sticky: true\"></tr>\r\n        </ng-template>\r\n\r\n        <ng-template [ngIf]=\"useContentRowTemplate\" [ngIfElse]=\"defaultRowTpl\"></ng-template>\r\n        <ng-template #defaultRowTpl>\r\n          <tr mat-row\r\n              *matRowDef=\"let row; let index = index; let dataIndex = dataIndex; columns: displayedColumns;\"\r\n              [class]=\"row | rowClass: index: dataIndex: rowClassFormatter\"\r\n              [ngClass]=\"{'selected': rowSelection.isSelected(row)}\"\r\n              (click)=\"_selectRow($event, row, _getIndex(index, dataIndex))\">\r\n          </tr>\r\n        </ng-template>\r\n\r\n        <ng-template [ngIf]=\"_whetherShowSummary\">\r\n          <tr mat-footer-row *matFooterRowDef=\"displayedColumns; sticky: true\"></tr>\r\n        </ng-template>\r\n        <ng-template [ngIf]=\"useContentFooterRowTemplate\"></ng-template>\r\n\r\n        <ng-container *ngIf=\"expandable\">\r\n          <!-- Expanded Content Column - The expandable row is made up of this one column that spans across all columns -->\r\n          <ng-container matColumnDef=\"MtxGridExpansionColumnDef\">\r\n            <td mat-cell *matCellDef=\"let row; let dataIndex = dataIndex\"\r\n                [attr.colspan]=\"displayedColumns.length\">\r\n              <div class=\"mtx-grid-expansion-detail\"\r\n                   [@expansion]=\"expandAlways || expansionRowStates[dataIndex].expanded ? 'expanded' : 'collapsed'\">\r\n                <ng-template [ngTemplateOutlet]=\"expansionTemplate\"\r\n                             [ngTemplateOutletContext]=\"{ $implicit: row, rowData: row, index: dataIndex, expanded: expansionRowStates[dataIndex].expanded }\">\r\n                </ng-template>\r\n              </div>\r\n            </td>\r\n          </ng-container>\r\n\r\n          <tr mat-row\r\n              *matRowDef=\"let row; columns: ['MtxGridExpansionColumnDef']; let dataIndex = dataIndex\"\r\n              [ngClass]=\"['mtx-grid-expansion', expandAlways || expansionRowStates[dataIndex].expanded ? 'expanded' : 'collapsed']\">\r\n          </tr>\r\n        </ng-container>\r\n      </table>\r\n    </div>\r\n\r\n    <!-- No result -->\r\n    <div class=\"mtx-grid-no-result\" *ngIf=\"_hasNoResult\">\r\n      <ng-template [ngIf]=\"noResultTemplate\" [ngIfElse]=\"defaultNoResultTpl\">\r\n        <ng-template [ngTemplateOutlet]=\"noResultTemplate\"></ng-template>\r\n      </ng-template>\r\n      <ng-template #defaultNoResultTpl>{{noResultText}}</ng-template>\r\n    </div>\r\n  </div>\r\n\r\n  <!-- Tool sidebar -->\r\n  <div class=\"mtx-grid-sidebar\" *ngIf=\"showSidebar\">\r\n    <ng-template [ngIf]=\"sidebarTemplate\">\r\n      <ng-template [ngTemplateOutlet]=\"sidebarTemplate\"></ng-template>\r\n    </ng-template>\r\n  </div>\r\n</div>\r\n\r\n<div class=\"mtx-grid-footer\">\r\n  <!-- Status Bar -->\r\n  <div class=\"mtx-grid-statusbar\" *ngIf=\"showStatusbar\">\r\n    <ng-template [ngIf]=\"statusbarTemplate\">\r\n      <ng-template [ngTemplateOutlet]=\"statusbarTemplate\"></ng-template>\r\n    </ng-template>\r\n  </div>\r\n\r\n  <!-- Pagination -->\r\n  <div class=\"mtx-grid-pagination\">\r\n    <ng-template [ngIf]=\"paginationTemplate\" [ngIfElse]=\"defaultPaginationTemplate\">\r\n      <ng-template [ngTemplateOutlet]=\"paginationTemplate\"></ng-template>\r\n    </ng-template>\r\n    <ng-template #defaultPaginationTemplate>\r\n      <mat-paginator [class.mat-paginator-hidden]=\"!showPaginator\"\r\n                     [showFirstLastButtons]=\"showFirstLastButtons\"\r\n                     [length]=\"length\"\r\n                     [pageIndex]=\"pageIndex\"\r\n                     [pageSize]=\"pageSize\"\r\n                     [pageSizeOptions]=\"pageSizeOptions\"\r\n                     [hidePageSize]=\"hidePageSize\"\r\n                     (page)=\"_onPage($event)\"\r\n                     [disabled]=\"pageDisabled\">\r\n      </mat-paginator>\r\n    </ng-template>\r\n  </div>\r\n</div>\r\n\r\n<!-- Header template for extra content -->\r\n<ng-template #headerExtraTplBase let-headerExtraTemplate let-col=\"colDef\">\r\n  <ng-template [ngIf]=\"headerExtraTemplate | isTemplateRef\" [ngIfElse]=\"headerExtraTpl\">\r\n    <ng-template [ngTemplateOutlet]=\"headerExtraTemplate\"\r\n                 [ngTemplateOutletContext]=\"{ $implicit: col, colDef: col }\">\r\n    </ng-template>\r\n  </ng-template>\r\n  <ng-template #headerExtraTpl>\r\n    <ng-template [ngIf]=\"$any(headerExtraTemplate)?.[col.field] | isTemplateRef\">\r\n      <ng-template [ngTemplateOutlet]=\"headerExtraTemplate[col.field]\"\r\n                   [ngTemplateOutletContext]=\"{ $implicit: col, colDef: col }\">\r\n      </ng-template>\r\n    </ng-template>\r\n  </ng-template>\r\n</ng-template>\r\n", styles: [".mtx-grid{position:relative;display:flex;flex-direction:column;width:100%}.mtx-grid .mat-table-container{overflow:auto}.mtx-grid .mat-table-container.mat-table-with-data{flex:1}.mtx-grid .mat-mdc-table:not(.mat-column-resize-table){min-width:100%;border-collapse:separate}.mtx-grid .mat-mdc-table:not(.mat-column-resize-table) .mat-mdc-header-cell:not(.mtx-grid-checkbox-cell),.mtx-grid .mat-mdc-table:not(.mat-column-resize-table) .mat-mdc-footer-cell:not(.mtx-grid-checkbox-cell),.mtx-grid .mat-mdc-table:not(.mat-column-resize-table) .mat-mdc-cell:not(.mtx-grid-checkbox-cell){min-width:80px}.mtx-grid .mat-table-sticky-left{border-right-width:1px;border-right-style:solid}[dir=rtl] .mtx-grid .mat-table-sticky-left{border-right-width:0;border-left-width:1px;border-left-style:solid}.mtx-grid .mat-table-sticky-right{border-left-width:1px;border-left-style:solid}[dir=rtl] .mtx-grid .mat-table-sticky-right{border-left-width:0;border-right-width:1px;border-right-style:solid}.mtx-grid .mat-mdc-header-cell,.mtx-grid .mat-mdc-footer-cell,.mtx-grid .mat-mdc-cell{padding:4px 10px;box-sizing:border-box}.mtx-grid .mat-mdc-header-cell:first-of-type:not(:only-of-type),.mtx-grid .mat-mdc-footer-cell:first-of-type:not(:only-of-type),.mtx-grid .mat-mdc-cell:first-of-type:not(:only-of-type){padding-left:24px}.mtx-grid .mat-mdc-header-cell:first-of-type:not(:only-of-type).mtx-grid-checkbox-cell,.mtx-grid .mat-mdc-footer-cell:first-of-type:not(:only-of-type).mtx-grid-checkbox-cell,.mtx-grid .mat-mdc-cell:first-of-type:not(:only-of-type).mtx-grid-checkbox-cell{padding-left:10px;padding-right:10px}[dir=rtl] .mtx-grid .mat-mdc-header-cell:first-of-type:not(:only-of-type),[dir=rtl] .mtx-grid .mat-mdc-footer-cell:first-of-type:not(:only-of-type),[dir=rtl] .mtx-grid .mat-mdc-cell:first-of-type:not(:only-of-type){padding-left:10px;padding-right:24px}[dir=rtl] .mtx-grid .mat-mdc-header-cell:first-of-type:not(:only-of-type).mtx-grid-checkbox-cell,[dir=rtl] .mtx-grid .mat-mdc-footer-cell:first-of-type:not(:only-of-type).mtx-grid-checkbox-cell,[dir=rtl] .mtx-grid .mat-mdc-cell:first-of-type:not(:only-of-type).mtx-grid-checkbox-cell{padding-left:10px;padding-right:10px}.mtx-grid .mat-mdc-header-cell:last-of-type:not(:only-of-type),.mtx-grid .mat-mdc-footer-cell:last-of-type:not(:only-of-type),.mtx-grid .mat-mdc-cell:last-of-type:not(:only-of-type){padding-right:24px}[dir=rtl] .mtx-grid .mat-mdc-header-cell:last-of-type:not(:only-of-type),[dir=rtl] .mtx-grid .mat-mdc-footer-cell:last-of-type:not(:only-of-type),[dir=rtl] .mtx-grid .mat-mdc-cell:last-of-type:not(:only-of-type){padding-left:24px;padding-right:10px}.mtx-grid .mat-mdc-row.mtx-grid-expansion{height:0;overflow:hidden}.mtx-grid .mat-mdc-row.mtx-grid-expansion .mat-mdc-cell{padding-top:0;padding-bottom:0}.mtx-grid .mat-mdc-row.mtx-grid-expansion.collapsed .mat-mdc-cell{border-bottom-width:0}.mtx-grid .mat-mdc-row:last-of-type .mat-cell{border-bottom-width:0}.mtx-grid .mat-sort-header-icon{margin:0 4px}.mtx-grid .mat-header-cell-inner{display:flex;align-items:center}.mtx-grid .mat-paginator-hidden{display:none}.mtx-grid-progress{position:absolute;top:0;z-index:120;width:100%}.mtx-grid-toolbar{display:flex;justify-content:space-between;align-items:center;min-height:48px;padding:8px;box-sizing:border-box}.mtx-grid-layout{display:flex;flex:1 1 auto;overflow:auto}.mtx-grid-content{flex-direction:column;width:0}.mtx-grid-sidebar{max-width:50%;border-left-width:1px;border-left-style:solid}[dir=rtl] .mtx-grid-sidebar{border-left-width:0;border-right-width:1px;border-right-style:solid}.mtx-grid-footer{position:relative;z-index:1}.mtx-grid-statusbar{display:flex;align-items:center;min-height:56px;padding:8px}.mtx-grid-no-result{display:flex;justify-content:center;align-items:center;flex:1;min-height:150px}.mtx-grid-expansion-placeholder{display:inline-block;width:40px;height:40px;vertical-align:middle}.mtx-grid-expansion-detail{display:flex;align-items:center;min-height:48px;overflow:hidden}.mtx-grid-checkbox-cell{flex:none;justify-content:center;width:60px;min-width:60px}.mtx-grid-checkbox-cell .mat-checkbox{display:flex;margin:0 10px}.mtx-grid-checkbox-cell .mat-checkbox-inner-container{margin-left:0}.mtx-grid-row-expand-button.mat-mdc-icon-button{width:40px;height:40px;padding:8px;vertical-align:middle}.mtx-grid-row-expand-button.mat-mdc-icon-button.expanded .mtx-grid-row-expand-icon{transform:rotate(90deg)}.mtx-grid-row-expand-button.mat-mdc-icon-button+mtx-grid-cell{vertical-align:middle}.mtx-grid-row-expand-button.mat-mdc-icon-button .mat-mdc-button-touch-target{width:100%;height:100%}.mtx-grid-icon{width:20px;height:20px;font-size:20px}\n"] }]
        }], ctorParameters: function () { return [{ type: MtxGridUtils }, { type: i0.ChangeDetectorRef }]; }, propDecorators: { table: [{
                type: ViewChild,
                args: [MatTable]
            }], paginator: [{
                type: ViewChild,
                args: [MatPaginator]
            }], sort: [{
                type: ViewChild,
                args: [MatSort]
            }], rowDefs: [{
                type: ContentChildren,
                args: [MatRowDef]
            }], headerRowDefs: [{
                type: ContentChildren,
                args: [MatHeaderRowDef]
            }], footerRowDefs: [{
                type: ContentChildren,
                args: [MatFooterRow]
            }], columnMenu: [{
                type: ViewChild,
                args: ['columnMenu']
            }], tableContainer: [{
                type: ViewChild,
                args: ['tableContainer']
            }], displayedColumns: [{
                type: Input
            }], columns: [{
                type: Input
            }], data: [{
                type: Input
            }], length: [{
                type: Input
            }], loading: [{
                type: Input
            }], trackBy: [{
                type: Input
            }], columnResizable: [{
                type: Input
            }], emptyValuePlaceholder: [{
                type: Input
            }], pageOnFront: [{
                type: Input
            }], showPaginator: [{
                type: Input
            }], pageDisabled: [{
                type: Input
            }], showFirstLastButtons: [{
                type: Input
            }], pageIndex: [{
                type: Input
            }], pageSize: [{
                type: Input
            }], pageSizeOptions: [{
                type: Input
            }], hidePageSize: [{
                type: Input
            }], page: [{
                type: Output
            }], paginationTemplate: [{
                type: Input
            }], sortOnFront: [{
                type: Input
            }], sortActive: [{
                type: Input
            }], sortDirection: [{
                type: Input
            }], sortDisableClear: [{
                type: Input
            }], sortDisabled: [{
                type: Input
            }], sortStart: [{
                type: Input
            }], sortChange: [{
                type: Output
            }], rowHover: [{
                type: Input
            }], rowStriped: [{
                type: Input
            }], rowClick: [{
                type: Output
            }], expandable: [{
                type: Input
            }], expandAlways: [{
                type: Input
            }], expansionTemplate: [{
                type: Input
            }], expansionChange: [{
                type: Output
            }], multiSelectable: [{
                type: Input
            }], multiSelectionWithClick: [{
                type: Input
            }], rowSelected: [{
                type: Input
            }], rowSelectable: [{
                type: Input
            }], hideRowSelectionCheckbox: [{
                type: Input
            }], rowSelectionFormatter: [{
                type: Input
            }], rowClassFormatter: [{
                type: Input
            }], rowSelectionChange: [{
                type: Output
            }], cellSelectable: [{
                type: Input
            }], cellSelectionChange: [{
                type: Output
            }], showToolbar: [{
                type: Input
            }], toolbarTitle: [{
                type: Input
            }], toolbarTemplate: [{
                type: Input
            }], columnHideable: [{
                type: Input
            }], columnHideableChecked: [{
                type: Input
            }], columnSortable: [{
                type: Input
            }], columnPinnable: [{
                type: Input
            }], columnChange: [{
                type: Output
            }], columnPinOptions: [{
                type: Input
            }], showColumnMenuButton: [{
                type: Input
            }], columnMenuButtonText: [{
                type: Input
            }], columnMenuButtonType: [{
                type: Input
            }], columnMenuButtonColor: [{
                type: Input
            }], columnMenuButtonClass: [{
                type: Input
            }], columnMenuButtonIcon: [{
                type: Input
            }], showColumnMenuHeader: [{
                type: Input
            }], columnMenuHeaderText: [{
                type: Input
            }], columnMenuHeaderTemplate: [{
                type: Input
            }], showColumnMenuFooter: [{
                type: Input
            }], columnMenuFooterText: [{
                type: Input
            }], columnMenuFooterTemplate: [{
                type: Input
            }], noResultText: [{
                type: Input
            }], noResultTemplate: [{
                type: Input
            }], headerTemplate: [{
                type: Input
            }], headerExtraTemplate: [{
                type: Input
            }], cellTemplate: [{
                type: Input
            }], useContentRowTemplate: [{
                type: Input
            }], useContentHeaderRowTemplate: [{
                type: Input
            }], useContentFooterRowTemplate: [{
                type: Input
            }], showSummary: [{
                type: Input
            }], summaryTemplate: [{
                type: Input
            }], showSidebar: [{
                type: Input
            }], sidebarTemplate: [{
                type: Input
            }], showStatusbar: [{
                type: Input
            }], statusbarTemplate: [{
                type: Input
            }] } });
class MtxGridSelectableCell {
    get selected() {
        return this._selected;
    }
    set mtxSelectableRowData(value) {
        if (value !== this._rowData) {
            this._rowData = value;
        }
    }
    constructor(_grid) {
        this._grid = _grid;
        this._selected = false;
        this.ctrlKeyPressed = false;
        this.shiftKeyPressed = false;
        this.cellSelectionChange = new EventEmitter();
    }
    onClick(event) {
        this.ctrlKeyPressed = event.ctrlKey;
        this.shiftKeyPressed = event.shiftKey;
        if (this._grid.cellSelectable) {
            this.select();
        }
    }
    select() {
        this._selected = true;
        this.cellSelectionChange.emit(this);
    }
    deselect() {
        this._selected = false;
        this.cellSelectionChange.emit(this);
    }
    toggle() {
        this._selected = !this._selected;
        this.cellSelectionChange.emit(this);
    }
}
/** @nocollapse */ MtxGridSelectableCell.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MtxGridSelectableCell, deps: [{ token: MtxGrid }], target: i0.ɵɵFactoryTarget.Directive });
/** @nocollapse */ MtxGridSelectableCell.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.2.1", type: MtxGridSelectableCell, selector: "[mtx-grid-selectable-cell]", inputs: { mtxSelectableRowData: "mtxSelectableRowData" }, outputs: { cellSelectionChange: "cellSelectionChange" }, host: { listeners: { "click": "onClick($event)" }, properties: { "class.selected": "this.selected" } }, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MtxGridSelectableCell, decorators: [{
            type: Directive,
            args: [{
                    selector: '[mtx-grid-selectable-cell]',
                }]
        }], ctorParameters: function () { return [{ type: MtxGrid }]; }, propDecorators: { selected: [{
                type: HostBinding,
                args: ['class.selected']
            }], mtxSelectableRowData: [{
                type: Input
            }], cellSelectionChange: [{
                type: Output
            }], onClick: [{
                type: HostListener,
                args: ['click', ['$event']]
            }] } });

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * Explicitly enables column resizing for a flexbox-based mat-table.
 * Individual columns must be annotated specifically.
 */
class MatColumnResizeFlex extends AbstractMatColumnResize {
    constructor(columnResizeNotifier, elementRef, eventDispatcher, ngZone, notifier) {
        super();
        this.columnResizeNotifier = columnResizeNotifier;
        this.elementRef = elementRef;
        this.eventDispatcher = eventDispatcher;
        this.ngZone = ngZone;
        this.notifier = notifier;
    }
}
/** @nocollapse */ MatColumnResizeFlex.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MatColumnResizeFlex, deps: [{ token: i2.ColumnResizeNotifier }, { token: i0.ElementRef }, { token: i2.HeaderRowEventDispatcher }, { token: i0.NgZone }, { token: i2.ColumnResizeNotifierSource }], target: i0.ɵɵFactoryTarget.Directive });
/** @nocollapse */ MatColumnResizeFlex.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.2.1", type: MatColumnResizeFlex, selector: "mat-table[columnResize]", host: { classAttribute: "mat-column-resize-flex" }, providers: [...FLEX_PROVIDERS, { provide: ColumnResize, useExisting: MatColumnResizeFlex }], usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MatColumnResizeFlex, decorators: [{
            type: Directive,
            args: [{
                    selector: 'mat-table[columnResize]',
                    host: FLEX_HOST_BINDINGS,
                    providers: [...FLEX_PROVIDERS, { provide: ColumnResize, useExisting: MatColumnResizeFlex }],
                }]
        }], ctorParameters: function () { return [{ type: i2.ColumnResizeNotifier }, { type: i0.ElementRef }, { type: i2.HeaderRowEventDispatcher }, { type: i0.NgZone }, { type: i2.ColumnResizeNotifierSource }]; } });

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
const ENTRY_COMMON_COMPONENTS = [MatColumnResizeOverlayHandle];
class MatColumnResizeCommonModule {
}
/** @nocollapse */ MatColumnResizeCommonModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MatColumnResizeCommonModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
/** @nocollapse */ MatColumnResizeCommonModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "15.2.1", ngImport: i0, type: MatColumnResizeCommonModule, declarations: [MatColumnResizeOverlayHandle], exports: [MatColumnResizeOverlayHandle] });
/** @nocollapse */ MatColumnResizeCommonModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MatColumnResizeCommonModule });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MatColumnResizeCommonModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: ENTRY_COMMON_COMPONENTS,
                    exports: ENTRY_COMMON_COMPONENTS,
                }]
        }] });
const IMPORTS = [OverlayModule, MatColumnResizeCommonModule];
class MatColumnResizeModule {
}
/** @nocollapse */ MatColumnResizeModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MatColumnResizeModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
/** @nocollapse */ MatColumnResizeModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "15.2.1", ngImport: i0, type: MatColumnResizeModule, declarations: [MatColumnResize, MatColumnResizeFlex, MatResizable], imports: [OverlayModule, MatColumnResizeCommonModule], exports: [MatColumnResize, MatColumnResizeFlex, MatResizable] });
/** @nocollapse */ MatColumnResizeModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MatColumnResizeModule, imports: [IMPORTS] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MatColumnResizeModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: IMPORTS,
                    declarations: [MatColumnResize, MatColumnResizeFlex, MatResizable],
                    exports: [MatColumnResize, MatColumnResizeFlex, MatResizable],
                }]
        }] });

class MtxGridModule {
}
/** @nocollapse */ MtxGridModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MtxGridModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
/** @nocollapse */ MtxGridModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "15.2.1", ngImport: i0, type: MtxGridModule, declarations: [MtxGrid,
        MtxGridCell,
        MtxGridColumnMenu,
        MtxGridExpansionToggle,
        MtxGridSelectableCell,
        MtxGridRowClassPipe,
        MtxGridColClassPipe,
        MtxGridCellActionTooltipPipe,
        MtxGridCellActionDisablePipe,
        MtxGridCellSummaryPipe], imports: [CommonModule,
        FormsModule,
        MatTableModule,
        MatSortModule,
        MatPaginatorModule,
        MatCheckboxModule,
        MatButtonModule,
        MatProgressBarModule,
        MatChipsModule,
        MatTooltipModule,
        MatIconModule,
        MatSelectModule,
        MatFormFieldModule,
        MatMenuModule,
        DragDropModule,
        MtxDialogModule,
        MtxPipesModule,
        MatColumnResizeModule], exports: [MtxGrid,
        MtxGridCell,
        MtxGridColumnMenu,
        MtxGridExpansionToggle,
        MtxGridSelectableCell,
        MatColumnResizeModule,
        MtxGridRowClassPipe,
        MtxGridColClassPipe,
        MtxGridCellActionTooltipPipe,
        MtxGridCellActionDisablePipe,
        MtxGridCellSummaryPipe] });
/** @nocollapse */ MtxGridModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MtxGridModule, providers: [MtxGridUtils], imports: [CommonModule,
        FormsModule,
        MatTableModule,
        MatSortModule,
        MatPaginatorModule,
        MatCheckboxModule,
        MatButtonModule,
        MatProgressBarModule,
        MatChipsModule,
        MatTooltipModule,
        MatIconModule,
        MatSelectModule,
        MatFormFieldModule,
        MatMenuModule,
        DragDropModule,
        MtxDialogModule,
        MtxPipesModule,
        MatColumnResizeModule, MatColumnResizeModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MtxGridModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [
                        CommonModule,
                        FormsModule,
                        MatTableModule,
                        MatSortModule,
                        MatPaginatorModule,
                        MatCheckboxModule,
                        MatButtonModule,
                        MatProgressBarModule,
                        MatChipsModule,
                        MatTooltipModule,
                        MatIconModule,
                        MatSelectModule,
                        MatFormFieldModule,
                        MatMenuModule,
                        DragDropModule,
                        MtxDialogModule,
                        MtxPipesModule,
                        MatColumnResizeModule,
                    ],
                    exports: [
                        MtxGrid,
                        MtxGridCell,
                        MtxGridColumnMenu,
                        MtxGridExpansionToggle,
                        MtxGridSelectableCell,
                        MatColumnResizeModule,
                        MtxGridRowClassPipe,
                        MtxGridColClassPipe,
                        MtxGridCellActionTooltipPipe,
                        MtxGridCellActionDisablePipe,
                        MtxGridCellSummaryPipe,
                    ],
                    declarations: [
                        MtxGrid,
                        MtxGridCell,
                        MtxGridColumnMenu,
                        MtxGridExpansionToggle,
                        MtxGridSelectableCell,
                        MtxGridRowClassPipe,
                        MtxGridColClassPipe,
                        MtxGridCellActionTooltipPipe,
                        MtxGridCellActionDisablePipe,
                        MtxGridCellSummaryPipe,
                    ],
                    providers: [MtxGridUtils],
                }]
        }] });

/**
 * Generated bundle index. Do not edit.
 */

export { AbstractMatColumnResize, AbstractMatResizable, FLEX_HOST_BINDINGS as MAT_FLEX_HOST_BINDINGS, FLEX_PROVIDERS as MAT_FLEX_PROVIDERS, FLEX_RESIZE_STRATEGY_PROVIDER as MAT_FLEX_RESIZE_STRATEGY_PROVIDER, RESIZABLE_HOST_BINDINGS as MAT_RESIZABLE_HOST_BINDINGS, RESIZABLE_INPUTS as MAT_RESIZABLE_INPUTS, TABLE_HOST_BINDINGS as MAT_TABLE_HOST_BINDINGS, TABLE_PROVIDERS as MAT_TABLE_PROVIDERS, MatColumnResize, MatColumnResizeCommonModule, MatColumnResizeFlex, MatColumnResizeModule, MatColumnResizeOverlayHandle, MatFlexTableResizeStrategy, MatResizable, MtxGrid, MtxGridCell, MtxGridCellActionDisablePipe, MtxGridCellActionTooltipPipe, MtxGridCellSummaryPipe, MtxGridColClassPipe, MtxGridColumnMenu, MtxGridExpansionToggle, MtxGridModule, MtxGridRowClassPipe, MtxGridSelectableCell, MtxGridUtils };
//# sourceMappingURL=mtxGrid.mjs.map
