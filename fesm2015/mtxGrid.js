import { Injectable, EventEmitter, TemplateRef, Component, ViewEncapsulation, ChangeDetectionStrategy, ChangeDetectorRef, ViewChild, Input, Output, Directive, HostBinding, HostListener, Inject, ElementRef, NgZone, Injector, ViewContainerRef, NgModule } from '@angular/core';
import { DOCUMENT, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatMenuTrigger, MatMenuModule } from '@angular/material/menu';
import { moveItemInArray, DragDropModule } from '@angular/cdk/drag-drop';
import { MtxUtilsModule } from '@ng-matero/extensions/utils';
import { MtxDialog, MtxDialogModule } from '@ng-matero/extensions/dialog';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { SelectionModel } from '@angular/cdk/collections';
import PhotoViewer from 'photoviewer';
import { Overlay, OverlayModule } from '@angular/cdk/overlay';
import { CdkFlexTableResizeStrategy, ColumnResize, ResizeStrategy, ColumnResizeNotifier, HeaderRowEventDispatcher, ColumnResizeNotifierSource, TABLE_LAYOUT_FIXED_RESIZE_STRATEGY_PROVIDER, ResizeOverlayHandle, ResizeRef, Resizable } from '@ng-matero/extensions/column-resize';
export { TABLE_LAYOUT_FIXED_RESIZE_STRATEGY_PROVIDER as MAT_TABLE_LAYOUT_FIXED_RESIZE_STRATEGY_PROVIDER } from '@ng-matero/extensions/column-resize';
import { _CoalescedStyleScheduler, _COALESCED_STYLE_SCHEDULER, CdkTable, CdkColumnDef } from '@angular/cdk/table';
import { Directionality } from '@angular/cdk/bidi';

class MtxGridService {
    constructor() { }
    /**
     * Get cell value from column key e.g. `a.b.c`
     * @param rowData Row data
     * @param colDef Column definition
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
     */
    getColData(data, colDef) {
        return data.map((rowData) => this.getCellValue(rowData, colDef));
    }
    /**
     * Remove white spaces in a string and convert string to array
     * @param str string
     */
    str2arr(str) {
        return str.replace(/[\r\n\s]/g, '').split(',');
    }
}
MtxGridService.decorators = [
    { type: Injectable }
];
/** @nocollapse */
MtxGridService.ctorParameters = () => [];

class MtxGridComponent {
    constructor(_dataGridSrv, _changeDetectorRef) {
        this._dataGridSrv = _dataGridSrv;
        this._changeDetectorRef = _changeDetectorRef;
        this.dataSource = new MatTableDataSource();
        this.columns = [];
        this.data = [];
        this.length = 0;
        this.loading = false;
        this.columnResizable = false;
        // ===== Page =====
        this.pageOnFront = true;
        this.showPaginator = true;
        this.pageDisabled = false;
        this.showFirstLastButtons = true;
        this.pageIndex = 0;
        this.pageSize = 10;
        this.pageSizeOptions = [10, 50, 100];
        this.hidePageSize = false;
        this.page = new EventEmitter();
        // ===== Sort =====
        this.sortOnFront = true;
        this.sortDisableClear = false;
        this.sortDisabled = false;
        this.sortStart = 'asc';
        this.sortChange = new EventEmitter();
        // ===== Row =====
        this.rowHover = false;
        this.rowStriped = false;
        this.rowClick = new EventEmitter();
        // ===== Expandable Row =====
        this.expansionRowStates = [];
        this.expandable = false;
        this.expandAlways = false;
        this.expansionChange = new EventEmitter();
        // ===== Row Selection =====
        /** Whether support multiple row/cell selection. */
        this.multiSelectable = true;
        this.rowSelection = new SelectionModel(true, []);
        this.rowSelected = [];
        this.rowSelectable = false;
        this.hideRowSelectionCheckbox = false;
        this.rowSelectionFormatter = {};
        this.rowSelectionChange = new EventEmitter();
        // ===== Cell Selection =====
        this.cellSelection = [];
        this.cellSelectable = true;
        this.cellSelectionChange = new EventEmitter();
        // ===== Toolbar =====
        this.showToolbar = false;
        this.toolbarTitle = '';
        // ===== Column Menu =====
        this.columnMenuData = [];
        this.showColumnMenuButton = true;
        this.columnMenuButtonText = '';
        this.columnMenuButtonType = 'stroked';
        this.columnMenuButtonClass = '';
        this.columnMenuButtonIcon = '';
        this.columnHideable = true;
        this.columnHideableChecked = 'show';
        this.columnMovable = true;
        this.columnPinnable = true;
        this.columnChange = new EventEmitter();
        this.showColumnMenuHeader = false;
        this.columnMenuHeaderText = 'Columns Header';
        this.showColumnMenuFooter = false;
        this.columnMenuFooterText = 'Columns Footer';
        // ===== No Result =====
        this.noResultText = 'No records found';
        // ===== Summary =====
        this.showSummary = false;
        // ===== Side Bar =====
        this.showSidebar = false;
        // ===== Status Bar =====
        this.showStatusbar = false;
    }
    get _hasNoResult() {
        return (!this.data || this.data.length === 0) && !this.loading;
    }
    // TODO: Summary display conditions
    get _whetherShowSummary() {
        return this.showSummary;
    }
    detectChanges() {
        this._changeDetectorRef.detectChanges();
    }
    _isTemplateRef(obj) {
        return obj instanceof TemplateRef;
    }
    _getColData(data, colDef) {
        return this._dataGridSrv.getColData(data, colDef);
    }
    _getRowClassList(rowData, index) {
        const classList = {
            'selected': this.rowSelection.isSelected(rowData),
            'mat-row-odd': index % 2,
        };
        if (this.rowClassFormatter) {
            for (const key of Object.keys(this.rowClassFormatter)) {
                classList[key] = this.rowClassFormatter[key](rowData, index);
            }
        }
        return classList;
    }
    ngOnInit() { }
    // Waiting for async data
    ngOnChanges(changes) {
        var _a;
        this._countPinnedPosition();
        this.displayedColumns = this.columns.filter(item => !item.hide).map(item => item.field);
        if (this.showColumnMenuButton) {
            this.columnMenuData = this.columns.map(item => {
                const newItem = {
                    label: item.header,
                    field: item.field,
                    disabled: item.disabled,
                };
                if (this.columnHideableChecked === 'show') {
                    newItem.show = !item.hide;
                }
                else {
                    newItem.hide = item.hide;
                }
                return newItem;
            });
        }
        if (this.rowSelectable && !this.hideRowSelectionCheckbox) {
            this.displayedColumns.unshift('MtxGridCheckboxColumnDef');
        }
        // We should copy each item of data for expansion data
        if (this.expandable) {
            this.expansionRowStates = []; // reset
            (_a = this.data) === null || _a === void 0 ? void 0 : _a.forEach(_ => {
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
    _handleSortChange(sort) {
        this.sortChange.emit(sort);
    }
    /** Expansion change event */
    _handleExpansionChange(expansionRef, rowData, column, index) {
        this.expansionChange.emit({ expanded: expansionRef.expanded, data: rowData, index, column });
    }
    /** Cell select event */
    _selectCell(cellRef, rowData, colDef) {
        // If not the same cell
        if (this._selectedCell !== cellRef) {
            const colValue = this._dataGridSrv.getCellValue(rowData, colDef);
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
        var _a, _b, _c, _d;
        if (this.rowSelectable &&
            !((_b = (_a = this.rowSelectionFormatter).disabled) === null || _b === void 0 ? void 0 : _b.call(_a, rowData, index)) &&
            !((_d = (_c = this.rowSelectionFormatter).hideCheckbox) === null || _d === void 0 ? void 0 : _d.call(_c, rowData, index))) {
            // metaKey -> command key
            if (!event.ctrlKey && !event.metaKey) {
                this.rowSelection.clear();
            }
            this._toggleNormalCheckbox(rowData);
        }
        this.rowClick.emit({ rowData, index });
    }
    /** Whether the number of selected elements matches the total number of rows. */
    _isAllSelected() {
        const numSelected = this.rowSelection.selected.length;
        const numRows = this.dataSource.data.filter((row, index) => { var _a, _b; return !((_b = (_a = this.rowSelectionFormatter).disabled) === null || _b === void 0 ? void 0 : _b.call(_a, row, index)); }).length;
        return numSelected === numRows;
    }
    /** Select all rows if they are not all selected; otherwise clear selection. */
    _toggleMasterCheckbox() {
        this._isAllSelected()
            ? this.rowSelection.clear()
            : this.dataSource.data.forEach((row, index) => {
                var _a, _b;
                if (!((_b = (_a = this.rowSelectionFormatter).disabled) === null || _b === void 0 ? void 0 : _b.call(_a, row, index))) {
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
    _handleColumnChange(columns) {
        this.columnChange.emit(columns);
        this.displayedColumns = Object.assign([], this.getDisplayedColumnFields(columns));
        if (this.rowSelectable && !this.hideRowSelectionCheckbox) {
            this.displayedColumns.unshift('MtxGridCheckboxColumnDef');
        }
    }
    getDisplayedColumnFields(columns) {
        const fields = columns
            .filter((item) => this.columnHideableChecked === 'show' ? item.show : !item.hide)
            .map((item) => item.field);
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
    _handlePage(e) {
        if (this.pageOnFront) {
            this.scrollTop(0);
        }
        this.page.emit(e);
    }
    scrollTop(value) {
        var _a;
        if (value == null) {
            return (_a = this.tableContainer) === null || _a === void 0 ? void 0 : _a.nativeElement.scrollTop;
        }
        if (this.tableContainer && !this.loading) {
            this.tableContainer.nativeElement.scrollTop = value;
        }
    }
    scrollLeft(value) {
        var _a;
        if (value == null) {
            return (_a = this.tableContainer) === null || _a === void 0 ? void 0 : _a.nativeElement.scrollLeft;
        }
        if (this.tableContainer && !this.loading) {
            this.tableContainer.nativeElement.scrollLeft = value;
        }
    }
}
MtxGridComponent.decorators = [
    { type: Component, args: [{
                selector: 'mtx-grid',
                exportAs: 'mtxGrid',
                template: "<!-- Progress bar-->\r\n<div class=\"mtx-grid-progress\" *ngIf=\"loading\">\r\n  <mat-progress-bar mode=\"indeterminate\"></mat-progress-bar>\r\n</div>\r\n\r\n<!-- Toolbar -->\r\n<div class=\"mtx-grid-toolbar\" *ngIf=\"showToolbar\">\r\n  <div class=\"mtx-grid-toolbar-content\">\r\n    <ng-template [ngIf]=\"_isTemplateRef(toolbarTemplate)\" [ngIfElse]=\"defaultToolbarTemplate\">\r\n      <ng-template [ngTemplateOutlet]=\"toolbarTemplate\"></ng-template>\r\n    </ng-template>\r\n    <ng-template #defaultToolbarTemplate>\r\n      <div class=\"mtx-grid-toolbar-title\" *ngIf=\"toolbarTitle\">{{toolbarTitle}}</div>\r\n    </ng-template>\r\n  </div>\r\n  <div class=\"mtx-grid-toolbar-actions\">\r\n    <mtx-grid-column-menu *ngIf=\"showColumnMenuButton\" #columnMenu\r\n                          [columns]=\"columnMenuData\"\r\n                          [buttonText]=\"columnMenuButtonText\"\r\n                          [buttonType]=\"columnMenuButtonType\"\r\n                          [buttonColor]=\"columnMenuButtonColor\"\r\n                          [buttonClass]=\"columnMenuButtonClass\"\r\n                          [buttonIcon]=\"columnMenuButtonIcon\"\r\n                          [selectable]=\"columnHideable\"\r\n                          [selectableChecked]=\"columnHideableChecked\"\r\n                          [sortable]=\"columnMovable\"\r\n                          (selectionChange)=\"_handleColumnChange($event)\"\r\n                          (sortChange)=\"_handleColumnChange($event)\"\r\n                          [showHeader]=\"showColumnMenuHeader\"\r\n                          [headerText]=\"columnMenuHeaderText\"\r\n                          [headerTemplate]=\"columnMenuHeaderTemplate\"\r\n                          [showFooter]=\"showColumnMenuFooter\"\r\n                          [footerText]=\"columnMenuFooterText\"\r\n                          [footerTemplate]=\"columnMenuFooterTemplate\">\r\n    </mtx-grid-column-menu>\r\n  </div>\r\n</div>\r\n\r\n<div class=\"mtx-grid-main mtx-grid-layout\">\r\n  <!-- Table content -->\r\n  <div class=\"mtx-grid-content mtx-grid-layout\">\r\n    <div #tableContainer class=\"mat-table-container\"\r\n         [ngClass]=\"{'mat-table-with-data': !_hasNoResult}\">\r\n      <table mat-table *ngIf=\"!columnResizable\"\r\n             [ngClass]=\"{'mat-table-hover': rowHover, 'mat-table-striped': rowStriped, 'mat-table-expandable': expandable}\"\r\n             [dataSource]=\"dataSource\" [multiTemplateDataRows]=\"expandable\"\r\n             matSort\r\n             [matSortActive]=\"sortActive\"\r\n             [matSortDirection]=\"sortDirection\"\r\n             [matSortDisableClear]=\"sortDisableClear\"\r\n             [matSortDisabled]=\"sortDisabled\"\r\n             [matSortStart]=\"sortStart\"\r\n             (matSortChange)=\"_handleSortChange($event)\"\r\n             [trackBy]=\"trackBy\">\r\n\r\n        <ng-container *ngIf=\"rowSelectable && !hideRowSelectionCheckbox\"\r\n                      matColumnDef=\"MtxGridCheckboxColumnDef\">\r\n          <th mat-header-cell *matHeaderCellDef class=\"mtx-grid-checkbox-cell\">\r\n            <mat-checkbox *ngIf=\"multiSelectable\"\r\n                          [checked]=\"rowSelection.hasValue() && _isAllSelected()\"\r\n                          [indeterminate]=\"rowSelection.hasValue() && !_isAllSelected()\"\r\n                          (change)=\"$event ? _toggleMasterCheckbox() : null\">\r\n            </mat-checkbox>\r\n          </th>\r\n          <td mat-cell *matCellDef=\"let row; let index = index; let dataIndex = dataIndex;\"\r\n              class=\"mtx-grid-checkbox-cell\">\r\n            <mat-checkbox *ngIf=\"!(rowSelectionFormatter.hideCheckbox && rowSelectionFormatter.hideCheckbox!(row, _getIndex(index, dataIndex)))\"\r\n                          [disabled]=\"rowSelectionFormatter.disabled && rowSelectionFormatter.disabled!(row, _getIndex(index, dataIndex))\"\r\n                          [checked]=\"rowSelection.isSelected(row)\"\r\n                          (click)=\"$event.stopPropagation()\"\r\n                          (change)=\"$event ? _toggleNormalCheckbox(row) : null\">\r\n            </mat-checkbox>\r\n          </td>\r\n          <td mat-footer-cell *matFooterCellDef class=\"mtx-grid-checkbox-cell\"></td>\r\n        </ng-container>\r\n\r\n        <ng-container *ngFor=\"let col of columns;\">\r\n          <ng-container [matColumnDef]=\"col.field\"\r\n                        [sticky]=\"col.pinned==='left'\" [stickyEnd]=\"col.pinned==='right'\">\r\n            <th mat-header-cell *matHeaderCellDef\r\n                [class]=\"col.class\"\r\n                [ngClass]=\"{'mat-table-sticky-left': col.pinned === 'left', 'mat-table-sticky-right': col.pinned === 'right'}\"\r\n                [ngStyle]=\"{'width': col.width, 'min-width': col.width, 'left': col.left, 'right': col.right}\">\r\n              <div class=\"mat-header-cell-inner\">\r\n                <ng-template [ngIf]=\"_isTemplateRef(headerTemplate)\" [ngIfElse]=\"headerTpl\">\r\n                  <ng-template [ngTemplateOutlet]=\"headerTemplate\"\r\n                               [ngTemplateOutletContext]=\"{ $implicit: col, colDef: col }\">\r\n                  </ng-template>\r\n                </ng-template>\r\n                <ng-template #headerTpl>\r\n                  <ng-template [ngIf]=\"headerTemplate && _isTemplateRef(headerTemplate[col.field])\"\r\n                               [ngIfElse]=\"defaultHeaderTpl\">\r\n                    <ng-template [ngTemplateOutlet]=\"headerTemplate[col.field]\"\r\n                                 [ngTemplateOutletContext]=\"{ $implicit: col, colDef: col }\">\r\n                    </ng-template>\r\n                  </ng-template>\r\n                </ng-template>\r\n                <ng-template #defaultHeaderTpl>\r\n                  <div [mat-sort-header]=\"col.sortProp?.id || col.field\"\r\n                       [disabled]=\"!col.sortable\"\r\n                       [arrowPosition]=\"col.sortProp?.arrowPosition\"\r\n                       [disableClear]=\"col.sortProp?.disableClear\"\r\n                       [start]=\"col.sortProp?.start\">\r\n                    <span class=\"mtx-grid-expansion-placeholder\" *ngIf=\"col.showExpand\"></span>\r\n                    <span>{{col.header | toObservable | async}}</span>\r\n                    <mat-icon class=\"mat-sort-header-icon\" *ngIf=\"col.sortable\">sort</mat-icon>\r\n                  </div>\r\n                  <ng-template [ngTemplateOutlet]=\"headerExtraTplBase\"\r\n                               [ngTemplateOutletContext]=\"{ $implicit: headerExtraTemplate, colDef: col }\">\r\n                  </ng-template>\r\n                </ng-template>\r\n              </div>\r\n            </th>\r\n\r\n            <td mat-cell *matCellDef=\"let row; let index = index; let dataIndex = dataIndex;\"\r\n                [class]=\"col.class\"\r\n                [ngClass]=\"{'mat-table-sticky-left': col.pinned === 'left', 'mat-table-sticky-right': col.pinned === 'right'}\"\r\n                [ngStyle]=\"{'width': col.width, 'min-width': col.width, 'left': col.left, 'right': col.right}\"\r\n                mtx-grid-selectable-cell (cellSelectionChange)=\"_selectCell($event, row, col)\">\r\n              <ng-template [ngIf]=\"_isTemplateRef(cellTemplate)\" [ngIfElse]=\"cellTpl\">\r\n                <ng-template [ngTemplateOutlet]=\"cellTemplate\"\r\n                             [ngTemplateOutletContext]=\"{ $implicit: row, rowData: row, index: _getIndex(index, dataIndex), colDef: col }\">\r\n                </ng-template>\r\n              </ng-template>\r\n              <ng-template #cellTpl>\r\n                <ng-template [ngIf]=\"cellTemplate && _isTemplateRef(cellTemplate[col.field])\"\r\n                             [ngIfElse]=\"colDefCellTpl\">\r\n                  <ng-template [ngTemplateOutlet]=\"cellTemplate[col.field]\"\r\n                               [ngTemplateOutletContext]=\"{ $implicit: row, rowData: row, index: _getIndex(index, dataIndex), colDef: col }\">\r\n                  </ng-template>\r\n                </ng-template>\r\n              </ng-template>\r\n              <ng-template #colDefCellTpl>\r\n                <ng-template [ngIf]=\"col.cellTemplate\" [ngIfElse]=\"defaultCellTpl\"\r\n                             [ngTemplateOutlet]=\"col.cellTemplate\"\r\n                             [ngTemplateOutletContext]=\"{ $implicit: row, rowData: row, index: _getIndex(index, dataIndex), colDef: col }\">\r\n                </ng-template>\r\n              </ng-template>\r\n              <ng-template #defaultCellTpl>\r\n                <button *ngIf=\"col.showExpand && !expandAlways\" mat-icon-button mtx-grid-expansion-toggle\r\n                        [(opened)]=\"expansionRowStates[dataIndex].expanded\"\r\n                        (toggleChange)=\"_handleExpansionChange($event, row, col, dataIndex);\">\r\n                  <mat-icon>keyboard_arrow_right</mat-icon>\r\n                </button>\r\n\r\n                <mtx-grid-cell [rowData]=\"row\" [colDef]=\"col\"></mtx-grid-cell>\r\n              </ng-template>\r\n            </td>\r\n\r\n            <td mat-footer-cell *matFooterCellDef\r\n                [ngClass]=\"{'mat-table-sticky-left': col.pinned === 'left', 'mat-table-sticky-right': col.pinned === 'right'}\"\r\n                [ngStyle]=\"{'width': col.width, 'min-width': col.width, 'left': col.left, 'right': col.right}\">\r\n              <span class=\"mtx-grid-expansion-placeholder\" *ngIf=\"col.showExpand\"></span>\r\n\r\n              <ng-template [ngIf]=\"_isTemplateRef(summaryTemplate)\" [ngIfElse]=\"summaryTpl\">\r\n                <ng-template [ngTemplateOutlet]=\"summaryTemplate\"\r\n                             [ngTemplateOutletContext]=\"{ $implicit: col, colDef: col, data: data }\">\r\n                </ng-template>\r\n              </ng-template>\r\n              <ng-template #summaryTpl>\r\n                <ng-template [ngIf]=\"summaryTemplate && _isTemplateRef(summaryTemplate[col.field])\"\r\n                             [ngIfElse]=\"defaultSummaryTpl\">\r\n                  <ng-template [ngTemplateOutlet]=\"summaryTemplate[col.field]\"\r\n                               [ngTemplateOutletContext]=\"{ $implicit: _getColData(data, col), colData: _getColData(data, col), colDef: col }\">\r\n                  </ng-template>\r\n                </ng-template>\r\n              </ng-template>\r\n              <ng-template #defaultSummaryTpl>\r\n                <mtx-grid-cell [summary]=\"true\" [data]=\"data\" [colDef]=\"col\">\r\n                </mtx-grid-cell>\r\n              </ng-template>\r\n            </td>\r\n          </ng-container>\r\n        </ng-container>\r\n\r\n        <tr mat-header-row *matHeaderRowDef=\"displayedColumns; sticky: true\"></tr>\r\n        <tr mat-row\r\n            *matRowDef=\"let row; let index = index; let dataIndex = dataIndex; columns: displayedColumns;\"\r\n            [ngClass]=\"_getRowClassList(row, _getIndex(index, dataIndex))\"\r\n            (click)=\"_selectRow($event, row, _getIndex(index, dataIndex))\">\r\n        </tr>\r\n        <ng-container *ngIf=\"_whetherShowSummary\">\r\n          <tr mat-footer-row *matFooterRowDef=\"displayedColumns; sticky: true\"></tr>\r\n        </ng-container>\r\n\r\n        <ng-container *ngIf=\"expandable\">\r\n          <!-- Expanded Content Column - The expandable row is made up of this one column that spans across all columns -->\r\n          <ng-container matColumnDef=\"MtxGridExpansionColumnDef\">\r\n            <td mat-cell *matCellDef=\"let row; let dataIndex = dataIndex\"\r\n                [attr.colspan]=\"displayedColumns.length\">\r\n              <div class=\"mtx-grid-expansion-detail\"\r\n                   [@expansion]=\"expandAlways || expansionRowStates[dataIndex].expanded ? 'expanded' : 'collapsed'\">\r\n                <ng-template [ngTemplateOutlet]=\"expansionTemplate\"\r\n                             [ngTemplateOutletContext]=\"{ $implicit: row, rowData: row, index: dataIndex, expanded: expansionRowStates[dataIndex].expanded }\">\r\n                </ng-template>\r\n              </div>\r\n            </td>\r\n          </ng-container>\r\n\r\n          <tr mat-row\r\n              *matRowDef=\"let row; columns: ['MtxGridExpansionColumnDef']; let dataIndex = dataIndex\"\r\n              [ngClass]=\"['mtx-grid-expansion', expandAlways || expansionRowStates[dataIndex].expanded ? 'expanded' : 'collapsed']\">\r\n          </tr>\r\n        </ng-container>\r\n      </table>\r\n\r\n      <!-- TODO: Use flexbox-based mat-table -->\r\n      <table mat-table *ngIf=\"columnResizable\"\r\n             columnResize\r\n             [ngClass]=\"{'mat-table-hover': rowHover, 'mat-table-striped': rowStriped, 'mat-table-expandable': expandable}\"\r\n             [dataSource]=\"dataSource\" [multiTemplateDataRows]=\"expandable\"\r\n             matSort\r\n             [matSortActive]=\"sortActive\"\r\n             [matSortDirection]=\"sortDirection\"\r\n             [matSortDisableClear]=\"sortDisableClear\"\r\n             [matSortDisabled]=\"sortDisabled\"\r\n             [matSortStart]=\"sortStart\"\r\n             (matSortChange)=\"_handleSortChange($event)\"\r\n             [trackBy]=\"trackBy\">\r\n\r\n        <ng-container *ngIf=\"rowSelectable && !hideRowSelectionCheckbox\"\r\n                      matColumnDef=\"MtxGridCheckboxColumnDef\">\r\n          <th mat-header-cell *matHeaderCellDef class=\"mtx-grid-checkbox-cell\">\r\n            <mat-checkbox *ngIf=\"multiSelectable\"\r\n                          [checked]=\"rowSelection.hasValue() && _isAllSelected()\"\r\n                          [indeterminate]=\"rowSelection.hasValue() && !_isAllSelected()\"\r\n                          (change)=\"$event ? _toggleMasterCheckbox() : null\">\r\n            </mat-checkbox>\r\n          </th>\r\n          <td mat-cell *matCellDef=\"let row; let index = index; let dataIndex = dataIndex;\"\r\n              class=\"mtx-grid-checkbox-cell\">\r\n            <mat-checkbox *ngIf=\"!(rowSelectionFormatter.hideCheckbox && rowSelectionFormatter.hideCheckbox!(row, _getIndex(index, dataIndex)))\"\r\n                          [disabled]=\"rowSelectionFormatter.disabled && rowSelectionFormatter.disabled!(row, _getIndex(index, dataIndex))\"\r\n                          [checked]=\"rowSelection.isSelected(row)\"\r\n                          (click)=\"$event.stopPropagation()\"\r\n                          (change)=\"$event ? _toggleNormalCheckbox(row) : null\">\r\n            </mat-checkbox>\r\n          </td>\r\n          <td mat-footer-cell *matFooterCellDef class=\"mtx-grid-checkbox-cell\"></td>\r\n        </ng-container>\r\n\r\n        <ng-container *ngFor=\"let col of columns;\">\r\n          <ng-container [matColumnDef]=\"col.field\"\r\n                        [sticky]=\"col.pinned==='left'\" [stickyEnd]=\"col.pinned==='right'\">\r\n            <th mat-header-cell *matHeaderCellDef\r\n                [class]=\"col.class\"\r\n                [ngClass]=\"{'mat-table-sticky-left': col.pinned === 'left', 'mat-table-sticky-right': col.pinned === 'right'}\"\r\n                [ngStyle]=\"{'width': col.width, 'left': col.left, 'right': col.right}\"\r\n                [resizable]=\"col.resizable\"\r\n                [matResizableMinWidthPx]=\"col.minWidth\" [matResizableMaxWidthPx]=\"col.maxWidth\">\r\n              <div class=\"mat-header-cell-inner\">\r\n                <ng-template [ngIf]=\"_isTemplateRef(headerTemplate)\" [ngIfElse]=\"headerTpl\">\r\n                  <ng-template [ngTemplateOutlet]=\"headerTemplate\"\r\n                               [ngTemplateOutletContext]=\"{ $implicit: col, colDef: col }\">\r\n                  </ng-template>\r\n                </ng-template>\r\n                <ng-template #headerTpl>\r\n                  <ng-template [ngIf]=\"headerTemplate && _isTemplateRef(headerTemplate[col.field])\"\r\n                               [ngIfElse]=\"defaultHeaderTpl\">\r\n                    <ng-template [ngTemplateOutlet]=\"headerTemplate[col.field]\"\r\n                                 [ngTemplateOutletContext]=\"{ $implicit: col, colDef: col }\">\r\n                    </ng-template>\r\n                  </ng-template>\r\n                </ng-template>\r\n                <ng-template #defaultHeaderTpl>\r\n                  <div [mat-sort-header]=\"col.sortProp?.id || col.field\"\r\n                       [disabled]=\"!col.sortable\"\r\n                       [arrowPosition]=\"col.sortProp?.arrowPosition\"\r\n                       [disableClear]=\"col.sortProp?.disableClear\"\r\n                       [start]=\"col.sortProp?.start\">\r\n                    <span class=\"mtx-grid-expansion-placeholder\" *ngIf=\"col.showExpand\"></span>\r\n                    <span>{{col.header | toObservable | async}}</span>\r\n                    <mat-icon class=\"mat-sort-header-icon\" *ngIf=\"col.sortable\">sort</mat-icon>\r\n                  </div>\r\n                  <ng-template [ngTemplateOutlet]=\"headerExtraTplBase\"\r\n                               [ngTemplateOutletContext]=\"{ $implicit: headerExtraTemplate, colDef: col }\">\r\n                  </ng-template>\r\n                </ng-template>\r\n              </div>\r\n            </th>\r\n\r\n            <td mat-cell *matCellDef=\"let row; let index = index; let dataIndex = dataIndex;\"\r\n                [class]=\"col.class\"\r\n                [ngClass]=\"{'mat-table-sticky-left': col.pinned === 'left', 'mat-table-sticky-right': col.pinned === 'right'}\"\r\n                [ngStyle]=\"{'width': col.width, 'left': col.left, 'right': col.right}\"\r\n                mtx-grid-selectable-cell (cellSelectionChange)=\"_selectCell($event, row, col)\">\r\n              <ng-template [ngIf]=\"_isTemplateRef(cellTemplate)\" [ngIfElse]=\"cellTpl\">\r\n                <ng-template [ngTemplateOutlet]=\"cellTemplate\"\r\n                             [ngTemplateOutletContext]=\"{ $implicit: row, rowData: row, index: _getIndex(index, dataIndex), colDef: col }\">\r\n                </ng-template>\r\n              </ng-template>\r\n              <ng-template #cellTpl>\r\n                <ng-template [ngIf]=\"cellTemplate && _isTemplateRef(cellTemplate[col.field])\"\r\n                             [ngIfElse]=\"colDefCellTpl\">\r\n                  <ng-template [ngTemplateOutlet]=\"cellTemplate[col.field]\"\r\n                               [ngTemplateOutletContext]=\"{ $implicit: row, rowData: row, index: _getIndex(index, dataIndex), colDef: col }\">\r\n                  </ng-template>\r\n                </ng-template>\r\n              </ng-template>\r\n              <ng-template #colDefCellTpl>\r\n                <ng-template [ngIf]=\"col.cellTemplate\" [ngIfElse]=\"defaultCellTpl\"\r\n                             [ngTemplateOutlet]=\"col.cellTemplate\"\r\n                             [ngTemplateOutletContext]=\"{ $implicit: row, rowData: row, index: _getIndex(index, dataIndex), colDef: col }\">\r\n                </ng-template>\r\n              </ng-template>\r\n              <ng-template #defaultCellTpl>\r\n                <button *ngIf=\"col.showExpand && !expandAlways\" mat-icon-button mtx-grid-expansion-toggle\r\n                        [(opened)]=\"expansionRowStates[dataIndex].expanded\"\r\n                        (toggleChange)=\"_handleExpansionChange($event, row, col, dataIndex);\">\r\n                  <mat-icon>keyboard_arrow_right</mat-icon>\r\n                </button>\r\n\r\n                <mtx-grid-cell [rowData]=\"row\" [colDef]=\"col\"></mtx-grid-cell>\r\n              </ng-template>\r\n            </td>\r\n\r\n            <td mat-footer-cell *matFooterCellDef\r\n                [ngClass]=\"{'mat-table-sticky-left': col.pinned === 'left', 'mat-table-sticky-right': col.pinned === 'right'}\"\r\n                [ngStyle]=\"{'width': col.width, 'left': col.left, 'right': col.right}\">\r\n              <span class=\"mtx-grid-expansion-placeholder\" *ngIf=\"col.showExpand\"></span>\r\n\r\n              <ng-template [ngIf]=\"_isTemplateRef(summaryTemplate)\" [ngIfElse]=\"summaryTpl\">\r\n                <ng-template [ngTemplateOutlet]=\"summaryTemplate\"\r\n                             [ngTemplateOutletContext]=\"{ $implicit: col, colDef: col, data: data }\">\r\n                </ng-template>\r\n              </ng-template>\r\n              <ng-template #summaryTpl>\r\n                <ng-template [ngIf]=\"summaryTemplate && _isTemplateRef(summaryTemplate[col.field])\"\r\n                             [ngIfElse]=\"defaultSummaryTpl\">\r\n                  <ng-template [ngTemplateOutlet]=\"summaryTemplate[col.field]\"\r\n                               [ngTemplateOutletContext]=\"{ $implicit: _getColData(data, col), colData: _getColData(data, col), colDef: col }\">\r\n                  </ng-template>\r\n                </ng-template>\r\n              </ng-template>\r\n              <ng-template #defaultSummaryTpl>\r\n                <mtx-grid-cell [summary]=\"true\" [data]=\"data\" [colDef]=\"col\">\r\n                </mtx-grid-cell>\r\n              </ng-template>\r\n            </td>\r\n          </ng-container>\r\n        </ng-container>\r\n\r\n        <tr mat-header-row *matHeaderRowDef=\"displayedColumns; sticky: true\"></tr>\r\n        <tr mat-row\r\n            *matRowDef=\"let row; let index = index; let dataIndex = dataIndex; columns: displayedColumns;\"\r\n            [ngClass]=\"_getRowClassList(row, _getIndex(index, dataIndex))\"\r\n            (click)=\"_selectRow($event, row, _getIndex(index, dataIndex))\">\r\n        </tr>\r\n        <ng-container *ngIf=\"_whetherShowSummary\">\r\n          <tr mat-footer-row *matFooterRowDef=\"displayedColumns; sticky: true\"></tr>\r\n        </ng-container>\r\n\r\n        <ng-container *ngIf=\"expandable\">\r\n          <!-- Expanded Content Column - The expandable row is made up of this one column that spans across all columns -->\r\n          <ng-container matColumnDef=\"MtxGridExpansionColumnDef\">\r\n            <td mat-cell *matCellDef=\"let row; let dataIndex = dataIndex\"\r\n                [attr.colspan]=\"displayedColumns.length\">\r\n              <div class=\"mtx-grid-expansion-detail\"\r\n                   [@expansion]=\"expandAlways || expansionRowStates[dataIndex].expanded ? 'expanded' : 'collapsed'\">\r\n                <ng-template [ngTemplateOutlet]=\"expansionTemplate\"\r\n                             [ngTemplateOutletContext]=\"{ $implicit: row, rowData: row, index: dataIndex, expanded: expansionRowStates[dataIndex].expanded }\">\r\n                </ng-template>\r\n              </div>\r\n            </td>\r\n          </ng-container>\r\n\r\n          <tr mat-row\r\n              *matRowDef=\"let row; columns: ['MtxGridExpansionColumnDef']; let dataIndex = dataIndex\"\r\n              [ngClass]=\"['mtx-grid-expansion', expandAlways || expansionRowStates[dataIndex].expanded ? 'expanded' : 'collapsed']\">\r\n          </tr>\r\n        </ng-container>\r\n      </table>\r\n    </div>\r\n\r\n    <!-- No result -->\r\n    <div class=\"mtx-grid-no-result\" *ngIf=\"_hasNoResult\">\r\n      <ng-template [ngIf]=\"_isTemplateRef(noResultTemplate)\" [ngIfElse]=\"defaultNoResultTpl\">\r\n        <ng-template [ngTemplateOutlet]=\"noResultTemplate\"></ng-template>\r\n      </ng-template>\r\n      <ng-template #defaultNoResultTpl>{{noResultText}}</ng-template>\r\n    </div>\r\n  </div>\r\n\r\n  <!-- Tool sidebar -->\r\n  <div class=\"mtx-grid-sidebar\" *ngIf=\"showSidebar\">\r\n    <ng-template [ngIf]=\"_isTemplateRef(sidebarTemplate)\">\r\n      <ng-template [ngTemplateOutlet]=\"sidebarTemplate\"></ng-template>\r\n    </ng-template>\r\n  </div>\r\n</div>\r\n\r\n<div class=\"mtx-grid-footer\">\r\n  <!-- Status Bar -->\r\n  <div class=\"mtx-grid-statusbar\" *ngIf=\"showStatusbar\">\r\n    <ng-template [ngIf]=\"_isTemplateRef(statusbarTemplate)\">\r\n      <ng-template [ngTemplateOutlet]=\"statusbarTemplate\"></ng-template>\r\n    </ng-template>\r\n  </div>\r\n\r\n  <!-- Pagination -->\r\n  <div class=\"mtx-grid-pagination\">\r\n    <ng-template [ngIf]=\"_isTemplateRef(paginationTemplate)\" [ngIfElse]=\"defaultPaginationTemplate\">\r\n      <ng-template [ngTemplateOutlet]=\"paginationTemplate\"></ng-template>\r\n    </ng-template>\r\n    <ng-template #defaultPaginationTemplate>\r\n      <mat-paginator [class.mat-paginator-hidden]=\"!showPaginator || _hasNoResult\"\r\n                     [showFirstLastButtons]=\"showFirstLastButtons\"\r\n                     [length]=\"length\"\r\n                     [pageIndex]=\"pageIndex\"\r\n                     [pageSize]=\"pageSize\"\r\n                     [pageSizeOptions]=\"pageSizeOptions\"\r\n                     [hidePageSize]=\"hidePageSize\"\r\n                     (page)=\"_handlePage($event)\"\r\n                     [disabled]=\"pageDisabled\">\r\n      </mat-paginator>\r\n    </ng-template>\r\n  </div>\r\n</div>\r\n\r\n<!-- Header template for extra content -->\r\n<ng-template #headerExtraTplBase let-headerExtraTemplate let-col=\"colDef\">\r\n  <ng-template [ngIf]=\"_isTemplateRef(headerExtraTemplate)\" [ngIfElse]=\"headerExtraTpl\">\r\n    <ng-template [ngTemplateOutlet]=\"headerExtraTemplate\"\r\n                 [ngTemplateOutletContext]=\"{ $implicit: col, colDef: col }\">\r\n    </ng-template>\r\n  </ng-template>\r\n  <ng-template #headerExtraTpl>\r\n    <ng-template [ngIf]=\"headerExtraTemplate && _isTemplateRef(headerExtraTemplate[col.field])\">\r\n      <ng-template [ngTemplateOutlet]=\"headerExtraTemplate[col.field]\"\r\n                   [ngTemplateOutletContext]=\"{ $implicit: col, colDef: col }\">\r\n      </ng-template>\r\n    </ng-template>\r\n  </ng-template>\r\n</ng-template>\r\n",
                host: {
                    class: 'mtx-grid',
                },
                encapsulation: ViewEncapsulation.None,
                changeDetection: ChangeDetectionStrategy.OnPush,
                animations: [
                    trigger('expansion', [
                        state('collapsed', style({ height: '0', minHeight: '0', visibility: 'hidden' })),
                        state('expanded', style({ height: '*', visibility: 'visible' })),
                        transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
                    ]),
                ],
                styles: [".mtx-grid{position:relative;display:flex;flex-direction:column;width:100%}.mtx-grid .mat-table-container{overflow:auto}.mtx-grid .mat-table-container.mat-table-with-data{flex:1}.mtx-grid .mat-table:not(.mat-column-resize-table){min-width:100%;border-collapse:separate}.mtx-grid .mat-table:not(.mat-column-resize-table) .mat-cell:not(.mtx-grid-checkbox-cell),.mtx-grid .mat-table:not(.mat-column-resize-table) .mat-footer-cell:not(.mtx-grid-checkbox-cell),.mtx-grid .mat-table:not(.mat-column-resize-table) .mat-header-cell:not(.mtx-grid-checkbox-cell){min-width:80px}.mtx-grid .mat-table-sticky-left{border-right-width:1px;border-right-style:solid}[dir=rtl] .mtx-grid .mat-table-sticky-left{border-right-width:0;border-left-width:1px;border-left-style:solid}.mtx-grid .mat-table-sticky-right{border-left-width:1px;border-left-style:solid}[dir=rtl] .mtx-grid .mat-table-sticky-right{border-left-width:0;border-right-width:1px;border-right-style:solid}.mtx-grid .mat-cell,.mtx-grid .mat-footer-cell,.mtx-grid .mat-header-cell{padding:4px 10px;box-sizing:border-box}.mtx-grid .mat-cell:first-of-type:not(:only-of-type),.mtx-grid .mat-footer-cell:first-of-type:not(:only-of-type),.mtx-grid .mat-header-cell:first-of-type:not(:only-of-type){padding-left:24px}.mtx-grid .mat-cell:first-of-type:not(:only-of-type).mtx-grid-checkbox-cell,.mtx-grid .mat-footer-cell:first-of-type:not(:only-of-type).mtx-grid-checkbox-cell,.mtx-grid .mat-header-cell:first-of-type:not(:only-of-type).mtx-grid-checkbox-cell{padding-left:10px;padding-right:10px}[dir=rtl] .mtx-grid .mat-cell:first-of-type:not(:only-of-type),[dir=rtl] .mtx-grid .mat-footer-cell:first-of-type:not(:only-of-type),[dir=rtl] .mtx-grid .mat-header-cell:first-of-type:not(:only-of-type){padding-left:10px;padding-right:24px}[dir=rtl] .mtx-grid .mat-cell:first-of-type:not(:only-of-type).mtx-grid-checkbox-cell,[dir=rtl] .mtx-grid .mat-footer-cell:first-of-type:not(:only-of-type).mtx-grid-checkbox-cell,[dir=rtl] .mtx-grid .mat-header-cell:first-of-type:not(:only-of-type).mtx-grid-checkbox-cell{padding-left:10px;padding-right:10px}.mtx-grid .mat-cell:last-of-type:not(:only-of-type),.mtx-grid .mat-footer-cell:last-of-type:not(:only-of-type),.mtx-grid .mat-header-cell:last-of-type:not(:only-of-type){padding-right:24px}[dir=rtl] .mtx-grid .mat-cell:last-of-type:not(:only-of-type),[dir=rtl] .mtx-grid .mat-footer-cell:last-of-type:not(:only-of-type),[dir=rtl] .mtx-grid .mat-header-cell:last-of-type:not(:only-of-type){padding-left:24px;padding-right:10px}.mtx-grid .mat-cell .mat-icon-button.expanded .mat-icon{transform:rotate(90deg)}.mtx-grid .mat-row.mtx-grid-expansion{height:0;overflow:hidden}.mtx-grid .mat-row.mtx-grid-expansion .mat-cell{padding-top:0;padding-bottom:0}.mtx-grid .mat-row.mtx-grid-expansion.collapsed .mat-cell{border-bottom-width:0}.mtx-grid .mat-row:last-of-type .mat-cell{border-bottom-width:0}.mtx-grid .mat-sort-header-icon{width:18px;height:18px;margin:0 4px;font-size:18px}.mtx-grid .mat-header-cell-inner{display:flex;align-items:center}.mtx-grid .mat-paginator-hidden{display:none}.mtx-grid-progress{position:absolute;top:0;z-index:120;width:100%}.mtx-grid-toolbar{display:flex;justify-content:space-between;align-items:center;min-height:48px;padding:8px;box-sizing:border-box}.mtx-grid-layout{display:flex;flex:1 1 auto;overflow:auto}.mtx-grid-content{flex-direction:column;width:0}.mtx-grid-sidebar{max-width:50%;border-left-width:1px;border-left-style:solid}[dir=rtl] .mtx-grid-sidebar{border-left-width:0;border-right-width:1px;border-right-style:solid}.mtx-grid-footer{position:relative;z-index:1}.mtx-grid-statusbar{display:flex;align-items:center;min-height:56px;padding:8px}.mtx-grid-no-result{display:flex;justify-content:center;align-items:center;flex:1;min-height:150px}.mtx-grid-expansion-placeholder{display:inline-block;width:40px;height:40px;vertical-align:middle}.mtx-grid-expansion-detail{display:flex;align-items:center;min-height:48px;overflow:hidden}.mtx-grid-checkbox-cell{flex:none;justify-content:center;width:56px;min-width:56px}.mtx-grid-checkbox-cell .mat-checkbox{display:flex;margin:0 10px}.mtx-grid-checkbox-cell .mat-checkbox-inner-container{margin-left:0}"]
            },] }
];
/** @nocollapse */
MtxGridComponent.ctorParameters = () => [
    { type: MtxGridService },
    { type: ChangeDetectorRef }
];
MtxGridComponent.propDecorators = {
    paginator: [{ type: ViewChild, args: [MatPaginator,] }],
    sort: [{ type: ViewChild, args: [MatSort,] }],
    columnMenu: [{ type: ViewChild, args: ['columnMenu',] }],
    tableContainer: [{ type: ViewChild, args: ['tableContainer',] }],
    displayedColumns: [{ type: Input }],
    columns: [{ type: Input }],
    data: [{ type: Input }],
    length: [{ type: Input }],
    loading: [{ type: Input }],
    trackBy: [{ type: Input }],
    columnResizable: [{ type: Input }],
    pageOnFront: [{ type: Input }],
    showPaginator: [{ type: Input }],
    pageDisabled: [{ type: Input }],
    showFirstLastButtons: [{ type: Input }],
    pageIndex: [{ type: Input }],
    pageSize: [{ type: Input }],
    pageSizeOptions: [{ type: Input }],
    hidePageSize: [{ type: Input }],
    page: [{ type: Output }],
    paginationTemplate: [{ type: Input }],
    sortOnFront: [{ type: Input }],
    sortActive: [{ type: Input }],
    sortDirection: [{ type: Input }],
    sortDisableClear: [{ type: Input }],
    sortDisabled: [{ type: Input }],
    sortStart: [{ type: Input }],
    sortChange: [{ type: Output }],
    rowHover: [{ type: Input }],
    rowStriped: [{ type: Input }],
    rowClick: [{ type: Output }],
    expandable: [{ type: Input }],
    expandAlways: [{ type: Input }],
    expansionTemplate: [{ type: Input }],
    expansionChange: [{ type: Output }],
    multiSelectable: [{ type: Input }],
    rowSelected: [{ type: Input }],
    rowSelectable: [{ type: Input }],
    hideRowSelectionCheckbox: [{ type: Input }],
    rowSelectionFormatter: [{ type: Input }],
    rowClassFormatter: [{ type: Input }],
    rowSelectionChange: [{ type: Output }],
    cellSelectable: [{ type: Input }],
    cellSelectionChange: [{ type: Output }],
    showToolbar: [{ type: Input }],
    toolbarTitle: [{ type: Input }],
    toolbarTemplate: [{ type: Input }],
    showColumnMenuButton: [{ type: Input }],
    columnMenuButtonText: [{ type: Input }],
    columnMenuButtonType: [{ type: Input }],
    columnMenuButtonColor: [{ type: Input }],
    columnMenuButtonClass: [{ type: Input }],
    columnMenuButtonIcon: [{ type: Input }],
    columnHideable: [{ type: Input }],
    columnHideableChecked: [{ type: Input }],
    columnMovable: [{ type: Input }],
    columnPinnable: [{ type: Input }],
    columnChange: [{ type: Output }],
    showColumnMenuHeader: [{ type: Input }],
    columnMenuHeaderText: [{ type: Input }],
    columnMenuHeaderTemplate: [{ type: Input }],
    showColumnMenuFooter: [{ type: Input }],
    columnMenuFooterText: [{ type: Input }],
    columnMenuFooterTemplate: [{ type: Input }],
    noResultText: [{ type: Input }],
    noResultTemplate: [{ type: Input }],
    headerTemplate: [{ type: Input }],
    headerExtraTemplate: [{ type: Input }],
    cellTemplate: [{ type: Input }],
    showSummary: [{ type: Input }],
    summaryTemplate: [{ type: Input }],
    showSidebar: [{ type: Input }],
    sidebarTemplate: [{ type: Input }],
    showStatusbar: [{ type: Input }],
    statusbarTemplate: [{ type: Input }]
};

class MtxGridCellComponent {
    constructor(_dialog, _dataGridSrv) {
        this._dialog = _dialog;
        this._dataGridSrv = _dataGridSrv;
        /** Row data */
        this.rowData = {};
        /** All data */
        this.data = [];
        /** Whether show summary */
        this.summary = false;
    }
    get _colValue() {
        return this._dataGridSrv.getCellValue(this.rowData, this.colDef);
    }
    _isString(fn) {
        return Object.prototype.toString.call(fn) === '[object String]';
    }
    _isFunction(fn) {
        return Object.prototype.toString.call(fn) === '[object Function]';
    }
    _isEmptyValue(value) {
        return value == null || value.toString() === '';
    }
    _isContainHTML(value) {
        return /<\/?[a-z][\s\S]*>/i.test(value);
    }
    _getText(value) {
        return this._isEmptyValue(value) ? '--' : value;
    }
    _getTooltip(value) {
        return this._isEmptyValue(value) ? '' : value;
    }
    _getFormatterTooltip(value) {
        return this._isContainHTML(value) || this._isEmptyValue(value) ? '' : value;
    }
    _formatSummary(data, colDef) {
        if (this._isString(colDef.summary)) {
            return colDef.summary;
        }
        else if (this._isFunction(colDef.summary)) {
            return colDef.summary(this._dataGridSrv.getColData(data, colDef), colDef);
        }
    }
    _handleActionConfirm(event, title, description = '', okColor = 'primary', okText = 'OK', closeColor, closeText = 'CLOSE', fn, data) {
        event.preventDefault();
        event.stopPropagation();
        this._dialog.open({
            title,
            description,
            buttons: [
                {
                    color: okColor,
                    text: okText,
                    onClick: () => (fn ? fn(data) : {}),
                },
                { color: closeColor, text: closeText, onClick: () => { } },
            ],
        });
    }
    _handleActionClick(event, btn, rowData) {
        event.preventDefault();
        event.stopPropagation();
        if (btn.click) {
            btn.click(rowData);
        }
    }
    /** Preview enlarged image */
    _onPreview(urlStr) {
        const imgs = [];
        this._dataGridSrv.str2arr(urlStr).forEach((url, index) => {
            imgs.push({ title: index + 1 + '', src: url });
        });
        const footerToolbar = imgs.length > 1
            ? ['zoomIn', 'zoomOut', 'prev', 'next', 'rotateRight', 'rotateLeft', 'actualSize']
            : ['zoomIn', 'zoomOut', 'rotateRight', 'rotateLeft', 'actualSize'];
        const options = {
            title: imgs.length > 1,
            footerToolbar,
        };
        const viewer = new PhotoViewer(imgs, options);
    }
}
MtxGridCellComponent.decorators = [
    { type: Component, args: [{
                selector: 'mtx-grid-cell',
                exportAs: 'mtxGridCell',
                template: "<span *ngIf=\"summary; else customCellFormattingTpl\"\r\n      [title]=\"_getFormatterTooltip(_formatSummary(data, colDef))\"\r\n      [innerHTML]=\"_getText(_formatSummary(data, colDef))\">\r\n</span>\r\n\r\n<!-- Custom formatting -->\r\n<ng-template #customCellFormattingTpl>\r\n  <span *ngIf=\"colDef.formatter; else defaultCellFormattingTpl\"\r\n        [title]=\"_getFormatterTooltip(colDef.formatter!(rowData, colDef))\"\r\n        [innerHTML]=\"_getText(colDef.formatter!(rowData, colDef))\">\r\n  </span>\r\n</ng-template>\r\n\r\n<!-- Default formatting -->\r\n<ng-template #defaultCellFormattingTpl>\r\n  <ng-container [ngSwitch]=\"colDef.type\">\r\n    <!-- Tag -->\r\n    <ng-container *ngSwitchCase=\"'tag'\">\r\n      <mat-chip-list *ngIf=\"colDef.tag && colDef.tag[_colValue]; else tagEmptyTpl\">\r\n        <mat-chip color=\"primary\" [ngClass]=\"['bg-' + colDef.tag[_colValue].color]\">\r\n          {{colDef.tag[_colValue].text}}\r\n        </mat-chip>\r\n      </mat-chip-list>\r\n      <ng-template #tagEmptyTpl>{{_colValue}}</ng-template>\r\n    </ng-container>\r\n    <!-- Buttons -->\r\n    <ng-container *ngSwitchCase=\"'button'\">\r\n      <ng-container *ngFor=\"let btn of colDef.buttons;\">\r\n        <ng-container *ngIf=\"!btn.iif || btn.iif(rowData)\">\r\n          <ng-container *ngIf=\"btn.pop; else btnDefaultTpl\">\r\n            <button [ngClass]=\"['mtx-grid-action-button', btn.class||'']\"\r\n                    *ngIf=\"btn.type==='basic'\"\r\n                    mat-button\r\n                    [color]=\"btn.color || 'primary'\"\r\n                    [disabled]=\"btn.disabled\"\r\n                    [matTooltip]=\"btn.tooltip | toObservable | async\"\r\n                    (click)=\"_handleActionConfirm($event, btn.popTitle, btn.popDescription,\r\n                                                          btn.popOkColor, btn.popOkText,\r\n                                                          btn.popCloseColor, btn.popCloseText,\r\n                                                          btn.click, rowData)\">\r\n              <mat-icon *ngIf=\"btn.icon\">{{btn.icon}}</mat-icon>\r\n              <span>{{btn.text | toObservable | async}}</span>\r\n            </button>\r\n            <button [ngClass]=\"['mtx-grid-action-button', btn.class||'']\"\r\n                    *ngIf=\"!btn.type || btn.type==='icon'\"\r\n                    mat-icon-button\r\n                    [color]=\"btn.color || 'primary'\"\r\n                    [disabled]=\"btn.disabled\"\r\n                    [matTooltip]=\"btn.tooltip | toObservable | async\"\r\n                    (click)=\"_handleActionConfirm($event, btn.popTitle, btn.popDescription,\r\n                                                          btn.popOkColor, btn.popOkText,\r\n                                                          btn.popCloseColor, btn.popCloseText,\r\n                                                          btn.click, rowData)\">\r\n              <mat-icon>{{btn.icon}}</mat-icon>\r\n            </button>\r\n          </ng-container>\r\n          <ng-template #btnDefaultTpl>\r\n            <button [ngClass]=\"['mtx-grid-action-button', btn.class||'']\"\r\n                    *ngIf=\"btn.type==='basic'\"\r\n                    mat-button\r\n                    [color]=\"btn.color || 'primary'\"\r\n                    [disabled]=\"btn.disabled\"\r\n                    [matTooltip]=\"btn.tooltip | toObservable | async\"\r\n                    (click)=\"_handleActionClick($event, btn, rowData)\">\r\n              <mat-icon *ngIf=\"btn.icon\">{{btn.icon}}</mat-icon>\r\n              <span>{{btn.text | toObservable | async}}</span>\r\n            </button>\r\n            <button [ngClass]=\"['mtx-grid-action-button', btn.class||'']\"\r\n                    *ngIf=\"!btn.type || btn.type==='icon'\"\r\n                    mat-icon-button\r\n                    [color]=\"btn.color || 'primary'\"\r\n                    [disabled]=\"btn.disabled\"\r\n                    [matTooltip]=\"btn.tooltip | toObservable | async\"\r\n                    (click)=\"_handleActionClick($event, btn, rowData)\">\r\n              <mat-icon>{{btn.icon}}</mat-icon>\r\n            </button>\r\n          </ng-template>\r\n        </ng-container>\r\n      </ng-container>\r\n    </ng-container>\r\n    <!-- Link -->\r\n    <ng-container *ngSwitchCase=\"'link'\">\r\n      <a [href]=\"_colValue\" target=\"_blank\">{{_colValue}}</a>\r\n    </ng-container>\r\n    <!-- Image -->\r\n    <ng-container *ngSwitchCase=\"'image'\">\r\n      <img class=\"mtx-grid-img\" [src]=\"_colValue\" (click)=\"_onPreview(_colValue)\">\r\n    </ng-container>\r\n    <!-- Boolean -->\r\n    <ng-container *ngSwitchCase=\"'boolean'\">\r\n      <span [title]=\"_getTooltip(_colValue)\">{{_getText(_colValue)}}</span>\r\n    </ng-container>\r\n    <!-- Number -->\r\n    <ng-container *ngSwitchCase=\"'number'\">\r\n      <span [title]=\"_getTooltip(_colValue | number: colDef.typeParameter?.digitsInfo : colDef.typeParameter?.locale)\">\r\n        {{_getText(_colValue | number: colDef.typeParameter?.digitsInfo : colDef.typeParameter?.locale)}}\r\n      </span>\r\n    </ng-container>\r\n    <!-- Currency -->\r\n    <ng-container *ngSwitchCase=\"'currency'\">\r\n      <span [title]=\"_getTooltip(_colValue | currency: colDef.typeParameter?.currencyCode : colDef.typeParameter?.display : colDef.typeParameter?.digitsInfo : colDef.typeParameter?.locale)\">\r\n        {{_getText(_colValue | currency: colDef.typeParameter?.currencyCode : colDef.typeParameter?.display : colDef.typeParameter?.digitsInfo : colDef.typeParameter?.locale)}}\r\n      </span>\r\n    </ng-container>\r\n    <!-- Percent -->\r\n    <ng-container *ngSwitchCase=\"'percent'\">\r\n      <span [title]=\"_getTooltip(_colValue | percent: colDef.typeParameter?.digitsInfo : colDef.typeParameter?.locale)\">\r\n        {{_getText(_colValue | percent: colDef.typeParameter?.digitsInfo : colDef.typeParameter?.locale)}}\r\n      </span>\r\n    </ng-container>\r\n    <!-- Date -->\r\n    <ng-container *ngSwitchCase=\"'date'\">\r\n      <span [title]=\"_getTooltip(_colValue | date: colDef.typeParameter?.format : colDef.typeParameter?.timezone : colDef.typeParameter?.locale)\">\r\n        {{_getText(_colValue | date: colDef.typeParameter?.format : colDef.typeParameter?.timezone : colDef.typeParameter?.locale)}}\r\n      </span>\r\n    </ng-container>\r\n    <!-- Default -->\r\n    <ng-container *ngSwitchDefault>\r\n      <span [title]=\"_getTooltip(_colValue)\">{{_getText(_colValue)}}</span>\r\n    </ng-container>\r\n  </ng-container>\r\n</ng-template>\r\n",
                encapsulation: ViewEncapsulation.None,
                styles: [".mtx-grid-action-button .mat-icon{width:18px;height:18px;font-size:18px;line-height:18px}.mtx-grid-img{display:block;width:30px;border-radius:4px;cursor:pointer}"]
            },] }
];
/** @nocollapse */
MtxGridCellComponent.ctorParameters = () => [
    { type: MtxDialog },
    { type: MtxGridService }
];
MtxGridCellComponent.propDecorators = {
    rowData: [{ type: Input }],
    colDef: [{ type: Input }],
    data: [{ type: Input }],
    summary: [{ type: Input }]
};

class MtxGridColumnMenuComponent {
    constructor() {
        this.columns = [];
        this.selectable = true;
        this.selectableChecked = 'show';
        this.sortable = true;
        this.dndSortable = true;
        this._buttonText = '';
        this.buttonType = 'stroked';
        this.buttonClass = '';
        this.buttonIcon = '';
        this.showHeader = false;
        this.headerText = 'Columns Header';
        this.showFooter = false;
        this.footerText = 'Columns Footer';
        this.selectionChange = new EventEmitter();
        this.sortChange = new EventEmitter();
    }
    get buttonText() {
        const defaultText = `Columns ${this.selectableChecked === 'show' ? 'Shown' : 'Hidden'}`;
        const text = this._buttonText ? this._buttonText : defaultText;
        return text;
    }
    set buttonText(value) {
        this._buttonText = value;
    }
    _handleDroped(event) {
        moveItemInArray(this.columns, event.previousIndex, event.currentIndex);
        this.sortChange.emit(this.columns);
    }
    _handleSelection(e) {
        this.selectionChange.emit(this.columns);
    }
}
MtxGridColumnMenuComponent.decorators = [
    { type: Component, args: [{
                selector: 'mtx-grid-column-menu',
                exportAs: 'mtxGridColumnMenu',
                template: "<ng-container [ngSwitch]=\"buttonType\">\r\n  <ng-container *ngSwitchCase=\"'raised'\">\r\n    <button [ngClass]=\"buttonClass\" mat-raised-button [color]=\"buttonColor\"\r\n            [matMenuTriggerFor]=\"menu\">\r\n      <mat-icon *ngIf=\"buttonIcon\">{{buttonIcon}}</mat-icon> {{buttonText}}\r\n    </button>\r\n  </ng-container>\r\n  <ng-container *ngSwitchCase=\"'stroked'\">\r\n    <button [ngClass]=\"buttonClass\" mat-stroked-button [color]=\"buttonColor\"\r\n            [matMenuTriggerFor]=\"menu\">\r\n      <mat-icon *ngIf=\"buttonIcon\">{{buttonIcon}}</mat-icon> {{buttonText}}\r\n    </button>\r\n  </ng-container>\r\n  <ng-container *ngSwitchCase=\"'flat'\">\r\n    <button [ngClass]=\"buttonClass\" mat-flat-button [color]=\"buttonColor\"\r\n            [matMenuTriggerFor]=\"menu\">\r\n      <mat-icon *ngIf=\"buttonIcon\">{{buttonIcon}}</mat-icon> {{buttonText}}\r\n    </button>\r\n  </ng-container>\r\n  <ng-container *ngSwitchCase=\"'icon'\">\r\n    <button [ngClass]=\"buttonClass\" mat-icon-button [color]=\"buttonColor\"\r\n            [matMenuTriggerFor]=\"menu\">\r\n      <mat-icon *ngIf=\"buttonIcon\">{{buttonIcon}}</mat-icon>\r\n    </button>\r\n  </ng-container>\r\n  <ng-container *ngSwitchCase=\"'fab'\">\r\n    <button [ngClass]=\"buttonClass\" mat-fab [color]=\"buttonColor\" [matMenuTriggerFor]=\"menu\">\r\n      <mat-icon *ngIf=\"buttonIcon\">{{buttonIcon}}</mat-icon> {{buttonText}}\r\n    </button>\r\n  </ng-container>\r\n  <ng-container *ngSwitchCase=\"'mini-fab'\">\r\n    <button [ngClass]=\"buttonClass\" mat-mini-fab [color]=\"buttonColor\"\r\n            [matMenuTriggerFor]=\"menu\">\r\n      <mat-icon *ngIf=\"buttonIcon\">{{buttonIcon}}</mat-icon> {{buttonText}}\r\n    </button>\r\n  </ng-container>\r\n  <ng-container *ngSwitchDefault>\r\n    <button [ngClass]=\"buttonClass\" mat-button [color]=\"buttonColor\" [matMenuTriggerFor]=\"menu\">\r\n      <mat-icon *ngIf=\"buttonIcon\">{{buttonIcon}}</mat-icon> {{buttonText}}\r\n    </button>\r\n  </ng-container>\r\n</ng-container>\r\n\r\n<mat-menu #menu=\"matMenu\" class=\"mtx-grid-column-menu\">\r\n  <div class=\"mtx-grid-column-menu-content\"\r\n       (click)=\"$event.stopPropagation()\" (keydown)=\"$event.stopPropagation()\">\r\n    <div class=\"mtx-grid-column-menu-header\" *ngIf=\"showHeader\">\r\n      <ng-template [ngIf]=\"headerTemplate\" [ngIfElse]=\"defaultHeaderTpl\">\r\n        <ng-template [ngTemplateOutlet]=\"headerTemplate\"></ng-template>\r\n      </ng-template>\r\n      <ng-template #defaultHeaderTpl>{{headerText}}</ng-template>\r\n    </div>\r\n\r\n    <div class=\"mtx-grid-column-menu-body\">\r\n      <div class=\"mtx-grid-column-menu-list\"\r\n           cdkDropList (cdkDropListDropped)=\"_handleDroped($event)\"\r\n           *ngIf=\"sortable\">\r\n        <div class=\"mtx-grid-column-menu-item\" *ngFor=\"let col of columns\"\r\n             cdkDrag [cdkDragDisabled]=\"selectableChecked === 'show'? !col.show : col.hide\">\r\n          <mat-icon cdkDragHandle>drag_handle</mat-icon>\r\n          <ng-template [ngTemplateOutlet]=\"checkboxList\"\r\n                       [ngTemplateOutletContext]=\"{ $implicit: col }\">\r\n          </ng-template>\r\n        </div>\r\n      </div>\r\n\r\n      <div class=\"mtx-grid-column-menu-list\" *ngIf=\"!sortable\">\r\n        <div class=\"mtx-grid-column-menu-item\" *ngFor=\"let col of columns\">\r\n          <ng-template [ngTemplateOutlet]=\"checkboxList\"\r\n                       [ngTemplateOutletContext]=\"{ $implicit: col }\">\r\n          </ng-template>\r\n        </div>\r\n      </div>\r\n    </div>\r\n\r\n    <div class=\"mtx-grid-column-menu-footer\" *ngIf=\"showFooter\">\r\n      <ng-template [ngIf]=\"footerTemplate\" [ngIfElse]=\"defaultFooterTpl\">\r\n        <ng-template [ngTemplateOutlet]=\"footerTemplate\"></ng-template>\r\n      </ng-template>\r\n      <ng-template #defaultFooterTpl>{{footerText}}</ng-template>\r\n    </div>\r\n  </div>\r\n</mat-menu>\r\n\r\n<ng-template #checkboxList let-col>\r\n  <mat-checkbox class=\"mtx-grid-column-menu-item-label\"\r\n                *ngIf=\"selectable\"\r\n                [(ngModel)]=\"col[selectableChecked]\"\r\n                [disabled]=\"col.disabled\"\r\n                (change)=\"_handleSelection($event)\">\r\n    {{col.label | toObservable | async}}\r\n  </mat-checkbox>\r\n  <span class=\"mtx-grid-column-menu-item-label\" *ngIf=\"!selectable\">\r\n    {{col.label | toObservable | async}}\r\n  </span>\r\n</ng-template>\r\n",
                encapsulation: ViewEncapsulation.None,
                changeDetection: ChangeDetectionStrategy.OnPush,
                styles: [".mtx-grid-column-menu .mat-menu-content{padding:0}.mtx-grid-column-menu-body{padding:16px}.mtx-grid-column-menu-footer,.mtx-grid-column-menu-header{position:sticky;z-index:1;padding:8px 16px}.mtx-grid-column-menu-header{top:0}.mtx-grid-column-menu-footer{bottom:0}.mtx-grid-column-menu-list{display:block;max-width:100%}.mtx-grid-column-menu-list.cdk-drop-list-dragging .mtx-grid-column-menu-item:not(.cdk-drag-placeholder){transition:transform .25s cubic-bezier(0,0,.2,1)}.mtx-grid-column-menu-list.cdk-drop-list .mtx-grid-column-menu-item-label{padding:0 4px}.mtx-grid-column-menu-item{display:flex;flex-direction:row;align-items:center;padding:4px 0}.mtx-grid-column-menu-item.cdk-drag-disabled .cdk-drag-handle{opacity:.35;cursor:no-drop}.mtx-grid-column-menu-item .cdk-drag-handle{cursor:move}.mtx-grid-column-menu-item.cdk-drag-preview{box-shadow:0 3px 1px -2px rgba(0,0,0,.2),0 2px 2px 0 rgba(0,0,0,.14),0 1px 5px 0 rgba(0,0,0,.12)}.mtx-grid-column-menu-item.cdk-drag-placeholder{opacity:0}.mtx-grid-column-menu-item.cdk-drag-animating{transition:transform .25s cubic-bezier(0,0,.2,1)}"]
            },] }
];
MtxGridColumnMenuComponent.propDecorators = {
    menuPanel: [{ type: ViewChild, args: ['menu', { static: true },] }],
    menuTrigger: [{ type: ViewChild, args: [MatMenuTrigger,] }],
    columns: [{ type: Input }],
    selectable: [{ type: Input }],
    selectableChecked: [{ type: Input }],
    sortable: [{ type: Input }],
    dndSortable: [{ type: Input }],
    buttonText: [{ type: Input }],
    buttonType: [{ type: Input }],
    buttonColor: [{ type: Input }],
    buttonClass: [{ type: Input }],
    buttonIcon: [{ type: Input }],
    showHeader: [{ type: Input }],
    headerText: [{ type: Input }],
    headerTemplate: [{ type: Input }],
    showFooter: [{ type: Input }],
    footerText: [{ type: Input }],
    footerTemplate: [{ type: Input }],
    selectionChange: [{ type: Output }],
    sortChange: [{ type: Output }]
};

class MtxGridExpansionToggleDirective {
    constructor() {
        this._opened = false;
        this.openedChange = new EventEmitter();
        this.toggleChange = new EventEmitter();
    }
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
MtxGridExpansionToggleDirective.decorators = [
    { type: Directive, args: [{
                selector: '[mtx-grid-expansion-toggle]',
            },] }
];
/** @nocollapse */
MtxGridExpansionToggleDirective.ctorParameters = () => [];
MtxGridExpansionToggleDirective.propDecorators = {
    opened: [{ type: Input }],
    openedChange: [{ type: Output }],
    expanded: [{ type: HostBinding, args: ['class.expanded',] }],
    expandableRow: [{ type: Input }],
    template: [{ type: Input, args: ['expansionRowTpl',] }],
    toggleChange: [{ type: Output }],
    onClick: [{ type: HostListener, args: ['click', ['$event'],] }]
};

class MtxGridCellSelectionDirective {
    constructor(_dataGrid) {
        this._dataGrid = _dataGrid;
        this._selected = false;
        this.shiftKeyPressed = false;
        this.ctrlKeyPressed = false;
        this.cellSelectionChange = new EventEmitter();
    }
    get selected() {
        return this._selected;
    }
    set matSelectableRowData(value) {
        if (value !== this._rowData) {
            this._rowData = value;
        }
    }
    onClick(event) {
        this.ctrlKeyPressed = event.ctrlKey;
        this.shiftKeyPressed = event.shiftKey;
        if (this._dataGrid.cellSelectable) {
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
MtxGridCellSelectionDirective.decorators = [
    { type: Directive, args: [{
                selector: '[mtx-grid-selectable-cell]',
            },] }
];
/** @nocollapse */
MtxGridCellSelectionDirective.ctorParameters = () => [
    { type: MtxGridComponent }
];
MtxGridCellSelectionDirective.propDecorators = {
    selected: [{ type: HostBinding, args: ['class.selected',] }],
    matSelectableRowData: [{ type: Input }],
    cellSelectionChange: [{ type: Output }],
    onClick: [{ type: HostListener, args: ['click', ['$event'],] }]
};

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
MatFlexTableResizeStrategy.decorators = [
    { type: Injectable }
];
/** @nocollapse */
MatFlexTableResizeStrategy.ctorParameters = () => [
    { type: ColumnResize },
    { type: _CoalescedStyleScheduler, decorators: [{ type: Inject, args: [_COALESCED_STYLE_SCHEDULER,] }] },
    { type: CdkTable },
    { type: undefined, decorators: [{ type: Inject, args: [DOCUMENT,] }] }
];
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
MatColumnResize.decorators = [
    { type: Directive, args: [{
                selector: 'table[mat-table][columnResize]',
                host: TABLE_HOST_BINDINGS,
                providers: [...TABLE_PROVIDERS, { provide: ColumnResize, useExisting: MatColumnResize }],
            },] }
];
/** @nocollapse */
MatColumnResize.ctorParameters = () => [
    { type: ColumnResizeNotifier },
    { type: ElementRef },
    { type: HeaderRowEventDispatcher },
    { type: NgZone },
    { type: ColumnResizeNotifierSource }
];

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
MatColumnResizeFlex.decorators = [
    { type: Directive, args: [{
                selector: 'mat-table[columnResize]',
                host: FLEX_HOST_BINDINGS,
                providers: [...FLEX_PROVIDERS, { provide: ColumnResize, useExisting: MatColumnResizeFlex }],
            },] }
];
/** @nocollapse */
MatColumnResizeFlex.ctorParameters = () => [
    { type: ColumnResizeNotifier },
    { type: ElementRef },
    { type: HeaderRowEventDispatcher },
    { type: NgZone },
    { type: ColumnResizeNotifierSource }
];

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
MatColumnResizeOverlayHandle.decorators = [
    { type: Component, args: [{
                changeDetection: ChangeDetectionStrategy.OnPush,
                encapsulation: ViewEncapsulation.None,
                host: { class: 'mat-column-resize-overlay-thumb' },
                template: ''
            },] }
];
/** @nocollapse */
MatColumnResizeOverlayHandle.ctorParameters = () => [
    { type: CdkColumnDef },
    { type: ColumnResize },
    { type: Directionality },
    { type: ElementRef },
    { type: HeaderRowEventDispatcher },
    { type: NgZone },
    { type: ColumnResizeNotifierSource },
    { type: ResizeRef },
    { type: _CoalescedStyleScheduler, decorators: [{ type: Inject, args: [_COALESCED_STYLE_SCHEDULER,] }] },
    { type: undefined, decorators: [{ type: Inject, args: [DOCUMENT,] }] }
];

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
    get hasResizableClass() {
        return this.isResizable ? RESIZABLE_HOST_BINDINGS.class : '';
    }
    get resizable() {
        return this.isResizable;
    }
    set resizable(newValue) {
        this.isResizable = newValue == null || newValue === '' || newValue;
    }
}
MatResizable.decorators = [
    { type: Directive, args: [{
                selector: 'mat-header-cell[resizable], th[mat-header-cell][resizable]',
                inputs: RESIZABLE_INPUTS,
            },] }
];
/** @nocollapse */
MatResizable.ctorParameters = () => [
    { type: CdkColumnDef },
    { type: ColumnResize },
    { type: Directionality },
    { type: undefined, decorators: [{ type: Inject, args: [DOCUMENT,] }] },
    { type: ElementRef },
    { type: HeaderRowEventDispatcher },
    { type: Injector },
    { type: NgZone },
    { type: Overlay },
    { type: ColumnResizeNotifierSource },
    { type: ResizeStrategy },
    { type: _CoalescedStyleScheduler, decorators: [{ type: Inject, args: [_COALESCED_STYLE_SCHEDULER,] }] },
    { type: ViewContainerRef },
    { type: ChangeDetectorRef }
];
MatResizable.propDecorators = {
    hasResizableClass: [{ type: HostBinding, args: ['class',] }],
    resizable: [{ type: Input }]
};

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
MatColumnResizeCommonModule.decorators = [
    { type: NgModule, args: [{
                declarations: ENTRY_COMMON_COMPONENTS,
                exports: ENTRY_COMMON_COMPONENTS,
                entryComponents: ENTRY_COMMON_COMPONENTS,
            },] }
];
const IMPORTS = [OverlayModule, MatColumnResizeCommonModule];
class MatColumnResizeModule {
}
MatColumnResizeModule.decorators = [
    { type: NgModule, args: [{
                imports: IMPORTS,
                declarations: [MatColumnResize, MatColumnResizeFlex, MatResizable],
                exports: [MatColumnResize, MatColumnResizeFlex, MatResizable],
            },] }
];

class MtxGridModule {
}
MtxGridModule.decorators = [
    { type: NgModule, args: [{
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
                    MtxUtilsModule,
                    MatColumnResizeModule,
                ],
                exports: [
                    MtxGridComponent,
                    MtxGridCellComponent,
                    MtxGridColumnMenuComponent,
                    MtxGridExpansionToggleDirective,
                    MtxGridCellSelectionDirective,
                    MatColumnResizeModule,
                ],
                declarations: [
                    MtxGridComponent,
                    MtxGridCellComponent,
                    MtxGridColumnMenuComponent,
                    MtxGridExpansionToggleDirective,
                    MtxGridCellSelectionDirective,
                ],
                providers: [MtxGridService],
            },] }
];

/**
 * Generated bundle index. Do not edit.
 */

export { AbstractMatColumnResize, AbstractMatResizable, FLEX_HOST_BINDINGS as MAT_FLEX_HOST_BINDINGS, FLEX_PROVIDERS as MAT_FLEX_PROVIDERS, FLEX_RESIZE_STRATEGY_PROVIDER as MAT_FLEX_RESIZE_STRATEGY_PROVIDER, RESIZABLE_HOST_BINDINGS as MAT_RESIZABLE_HOST_BINDINGS, RESIZABLE_INPUTS as MAT_RESIZABLE_INPUTS, TABLE_HOST_BINDINGS as MAT_TABLE_HOST_BINDINGS, TABLE_PROVIDERS as MAT_TABLE_PROVIDERS, MatColumnResize, MatColumnResizeCommonModule, MatColumnResizeFlex, MatColumnResizeModule, MatColumnResizeOverlayHandle, MatFlexTableResizeStrategy, MatResizable, MtxGridCellComponent, MtxGridCellSelectionDirective, MtxGridColumnMenuComponent, MtxGridComponent, MtxGridExpansionToggleDirective, MtxGridModule, MtxGridService };
//# sourceMappingURL=mtxGrid.js.map
