import { EventEmitter, OnChanges, TemplateRef, TrackByFunction, OnDestroy, AfterViewInit, ChangeDetectorRef, ElementRef, SimpleChanges, QueryList, KeyValueChangeRecord } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatFooterRowDef, MatHeaderRowDef, MatRowDef, MatTable, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Sort, MatSort, SortDirection } from '@angular/material/sort';
import { ThemePalette } from '@angular/material/core';
import { MtxGridColumn, MtxGridCellTemplate, MtxGridRowSelectionFormatter, MtxGridRowClassFormatter, MtxGridButtonType, MtxGridColumnPinOption } from './interfaces';
import { MtxGridExpansionToggle } from './expansion-toggle';
import { MtxGridUtils } from './grid-utils';
import { MtxGridColumnMenu } from './column-menu';
import * as i0 from "@angular/core";
export declare class MtxGrid implements OnChanges, AfterViewInit, OnDestroy {
    private _utils;
    private _changeDetectorRef;
    table: MatTable<any>;
    paginator: MatPaginator;
    sort: MatSort;
    rowDefs: QueryList<MatRowDef<any>>;
    headerRowDefs: QueryList<MatHeaderRowDef>;
    footerRowDefs: QueryList<MatFooterRowDef>;
    columnMenu: MtxGridColumnMenu;
    tableContainer: ElementRef<HTMLDivElement>;
    dataSource: MatTableDataSource<unknown, import("@angular/material/table").MatTableDataSourcePaginator>;
    /** The grid's displayed columns. */
    displayedColumns: string[];
    /** The grid's columns. */
    columns: MtxGridColumn[];
    /** The grid's data. */
    data: any[];
    /** The total number of the data. */
    length: number;
    /** Whether the grid is loading. */
    loading: boolean;
    /** Tracking function that will be used to check the differences in data changes. */
    trackBy: TrackByFunction<any>;
    /** Whether the column is resizable. */
    columnResizable: boolean;
    /** Placeholder for the empty value (`null`, `''`, `[]`). */
    emptyValuePlaceholder: string;
    /** Whether to paginate the data on front end. */
    pageOnFront: boolean;
    /** Whether to show the paginator. */
    showPaginator: boolean;
    /** Whether the paginator is disabled. */
    pageDisabled: boolean;
    /** Whether to show the first/last buttons UI to the user. */
    showFirstLastButtons: boolean;
    /** The zero-based page index of the displayed list of items. */
    pageIndex: number;
    /** Number of items to display on a page. */
    pageSize: number;
    /** The set of provided page size options to display to the user. */
    pageSizeOptions: number[];
    /** Whether to hide the page size selection UI from the user. */
    hidePageSize: boolean;
    /** Event emitted when the paginator changes the page size or page index. */
    page: EventEmitter<PageEvent>;
    /** The template for the pagination. */
    paginationTemplate: TemplateRef<any>;
    /** Whether to sort the data on front end. */
    sortOnFront: boolean;
    /** The id of the most recently sorted MatSortable. */
    sortActive: string;
    /** The sort direction of the currently active MatSortable. */
    sortDirection: SortDirection;
    /**
     * Whether to disable the user from clearing the sort by finishing the sort direction cycle.
     * May be overriden by the column's `disableClear` in `sortProp`.
     */
    sortDisableClear: boolean;
    /** Whether the sort is disabled. */
    sortDisabled: boolean;
    /**
     * The direction to set when an MatSortable is initially sorted.
     * May be overriden by the column's `start` in `sortProp`.
     */
    sortStart: 'asc' | 'desc';
    /** Event emitted when the user changes either the active sort or sort direction. */
    sortChange: EventEmitter<Sort>;
    /** Whether to use the row hover style. */
    rowHover: boolean;
    /** Whether to use the row striped style. */
    rowStriped: boolean;
    /** Event emitted when the user clicks the row. */
    rowClick: EventEmitter<any>;
    expansionRowStates: any[];
    /** Whether the row is expandable. */
    expandable: boolean;
    /** Expand all rows automaticaly. */
    expandAlways: boolean;
    /** The template for the expandable row. */
    expansionTemplate: TemplateRef<any>;
    /** Event emitted when the user toggles the expandable row. */
    expansionChange: EventEmitter<any>;
    rowSelection: SelectionModel<any>;
    /** Whether to support multiple row/cell selection. */
    multiSelectable: boolean;
    /** Whether the user can select multiple rows with click. */
    multiSelectionWithClick: boolean;
    /** The selected row items. */
    rowSelected: any[];
    /** Whether the row is selectable. */
    rowSelectable: boolean;
    /** Whether to hide the row selection checkbox. */
    hideRowSelectionCheckbox: boolean;
    /** The formatter to disable the row selection or hide the row's checkbox. */
    rowSelectionFormatter: MtxGridRowSelectionFormatter;
    /** The formatter to set the row's class. */
    rowClassFormatter?: MtxGridRowClassFormatter;
    /** Event emitted when the row is selected. */
    rowSelectionChange: EventEmitter<any[]>;
    cellSelection: any[];
    /** Whether the cell is selectable. */
    cellSelectable: boolean;
    /** Event emitted when the cell is selected. */
    cellSelectionChange: EventEmitter<any[]>;
    private _selectedCell?;
    /** Whether to show the toolbar. */
    showToolbar: boolean;
    /** The text of the toolbar's title. */
    toolbarTitle: string;
    /** The template for the toolbar. */
    toolbarTemplate: TemplateRef<any>;
    /** Whether the column is hideable. */
    columnHideable: boolean;
    /** Hide or show when the column's checkbox is checked. */
    columnHideableChecked: 'show' | 'hide';
    /** Whether the column is sortable. */
    columnSortable: boolean;
    /** Whether the column is pinnable. */
    columnPinnable: boolean;
    /** Event emitted when the column is hided or is sorted. */
    columnChange: EventEmitter<MtxGridColumn[]>;
    /** The options for the column pin list. */
    columnPinOptions: MtxGridColumnPinOption[];
    /** Whether to show the column menu button. */
    showColumnMenuButton: boolean;
    /** The text for the column menu button. */
    columnMenuButtonText: string;
    /** The type for the column menu button. */
    columnMenuButtonType: MtxGridButtonType;
    /** The color for the column menu button. */
    columnMenuButtonColor: ThemePalette;
    /** The class for the column menu button. */
    columnMenuButtonClass: string;
    /** The icon for the column menu button. */
    columnMenuButtonIcon: string;
    /** Whether to show the column-menu's header. */
    showColumnMenuHeader: boolean;
    /** The text for the column-menu's header. */
    columnMenuHeaderText: string;
    /** The template for the column-menu's header. */
    columnMenuHeaderTemplate: TemplateRef<any>;
    /** Whether to show the the column-menu's footer. */
    showColumnMenuFooter: boolean;
    /** The text for the column-menu's footer. */
    columnMenuFooterText: string;
    /** The template for the column-menu's footer. */
    columnMenuFooterTemplate: TemplateRef<any>;
    /** The displayed text for the empty data. */
    noResultText: string;
    /** The template for the empty data. */
    noResultTemplate: TemplateRef<any>;
    get _hasNoResult(): boolean;
    /** The header's cell template for the grid. */
    headerTemplate: TemplateRef<any> | MtxGridCellTemplate;
    /** The header's cell template for the grid exclude sort. */
    headerExtraTemplate: TemplateRef<any> | MtxGridCellTemplate;
    /** The cell template for the grid. */
    cellTemplate: TemplateRef<any> | MtxGridCellTemplate;
    /** Whether to use custom row template. If true, you should define a matRowDef. */
    useContentRowTemplate: boolean;
    useContentHeaderRowTemplate: boolean;
    useContentFooterRowTemplate: boolean;
    /** Whether to show the summary. */
    showSummary: boolean;
    /** The template for the summary. */
    summaryTemplate: TemplateRef<any> | MtxGridCellTemplate;
    get _whetherShowSummary(): boolean;
    /** Whether to show the sidebar. */
    showSidebar: boolean;
    /** The template for the sidebar. */
    sidebarTemplate: TemplateRef<any>;
    /** Whether to show the status bar. */
    showStatusbar: boolean;
    /** The template for the status bar. */
    statusbarTemplate: TemplateRef<any>;
    /** The changed record of row data. */
    rowChangeRecord?: KeyValueChangeRecord<string, any>;
    constructor(_utils: MtxGridUtils, _changeDetectorRef: ChangeDetectorRef);
    detectChanges(): void;
    _getColData(data: any[], colDef: MtxGridColumn): any[];
    ngOnChanges(changes: SimpleChanges): void;
    ngAfterViewInit(): void;
    ngOnDestroy(): void;
    _countPinnedPosition(): void;
    _getIndex(index: number, dataIndex: number): number;
    _onSortChange(sort: Sort): void;
    _onRowDataChange(record: KeyValueChangeRecord<string, any>): void;
    /** Expansion change event */
    _onExpansionChange(expansionRef: MtxGridExpansionToggle, rowData: Record<string, any>, column: MtxGridColumn, index: number): void;
    /** Cell select event */
    _selectCell(cellRef: MtxGridSelectableCell, rowData: Record<string, any>, colDef: MtxGridColumn): void;
    /** Row select event */
    _selectRow(event: MouseEvent, rowData: Record<string, any>, index: number): void;
    /** Whether the number of selected elements matches the total number of rows. */
    _isAllSelected(): boolean;
    /** Select all rows if they are not all selected; otherwise clear selection. */
    _toggleMasterCheckbox(): void;
    /** Select normal row */
    _toggleNormalCheckbox(row: Record<string, any>): void;
    /** Column change event */
    _onColumnChange(columns: MtxGridColumn[]): void;
    getDisplayedColumnFields(columns: MtxGridColumn[]): string[];
    /** Customize expansion event */
    toggleExpansion(index: number): any;
    /** Scroll to top when turn to the next page. */
    _onPage(e: PageEvent): void;
    scrollTop(value?: number): number | void;
    scrollLeft(value?: number): number | void;
    static ɵfac: i0.ɵɵFactoryDeclaration<MtxGrid, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MtxGrid, "mtx-grid", ["mtxGrid"], { "displayedColumns": "displayedColumns"; "columns": "columns"; "data": "data"; "length": "length"; "loading": "loading"; "trackBy": "trackBy"; "columnResizable": "columnResizable"; "emptyValuePlaceholder": "emptyValuePlaceholder"; "pageOnFront": "pageOnFront"; "showPaginator": "showPaginator"; "pageDisabled": "pageDisabled"; "showFirstLastButtons": "showFirstLastButtons"; "pageIndex": "pageIndex"; "pageSize": "pageSize"; "pageSizeOptions": "pageSizeOptions"; "hidePageSize": "hidePageSize"; "paginationTemplate": "paginationTemplate"; "sortOnFront": "sortOnFront"; "sortActive": "sortActive"; "sortDirection": "sortDirection"; "sortDisableClear": "sortDisableClear"; "sortDisabled": "sortDisabled"; "sortStart": "sortStart"; "rowHover": "rowHover"; "rowStriped": "rowStriped"; "expandable": "expandable"; "expandAlways": "expandAlways"; "expansionTemplate": "expansionTemplate"; "multiSelectable": "multiSelectable"; "multiSelectionWithClick": "multiSelectionWithClick"; "rowSelected": "rowSelected"; "rowSelectable": "rowSelectable"; "hideRowSelectionCheckbox": "hideRowSelectionCheckbox"; "rowSelectionFormatter": "rowSelectionFormatter"; "rowClassFormatter": "rowClassFormatter"; "cellSelectable": "cellSelectable"; "showToolbar": "showToolbar"; "toolbarTitle": "toolbarTitle"; "toolbarTemplate": "toolbarTemplate"; "columnHideable": "columnHideable"; "columnHideableChecked": "columnHideableChecked"; "columnSortable": "columnSortable"; "columnPinnable": "columnPinnable"; "columnPinOptions": "columnPinOptions"; "showColumnMenuButton": "showColumnMenuButton"; "columnMenuButtonText": "columnMenuButtonText"; "columnMenuButtonType": "columnMenuButtonType"; "columnMenuButtonColor": "columnMenuButtonColor"; "columnMenuButtonClass": "columnMenuButtonClass"; "columnMenuButtonIcon": "columnMenuButtonIcon"; "showColumnMenuHeader": "showColumnMenuHeader"; "columnMenuHeaderText": "columnMenuHeaderText"; "columnMenuHeaderTemplate": "columnMenuHeaderTemplate"; "showColumnMenuFooter": "showColumnMenuFooter"; "columnMenuFooterText": "columnMenuFooterText"; "columnMenuFooterTemplate": "columnMenuFooterTemplate"; "noResultText": "noResultText"; "noResultTemplate": "noResultTemplate"; "headerTemplate": "headerTemplate"; "headerExtraTemplate": "headerExtraTemplate"; "cellTemplate": "cellTemplate"; "useContentRowTemplate": "useContentRowTemplate"; "useContentHeaderRowTemplate": "useContentHeaderRowTemplate"; "useContentFooterRowTemplate": "useContentFooterRowTemplate"; "showSummary": "showSummary"; "summaryTemplate": "summaryTemplate"; "showSidebar": "showSidebar"; "sidebarTemplate": "sidebarTemplate"; "showStatusbar": "showStatusbar"; "statusbarTemplate": "statusbarTemplate"; }, { "page": "page"; "sortChange": "sortChange"; "rowClick": "rowClick"; "expansionChange": "expansionChange"; "rowSelectionChange": "rowSelectionChange"; "cellSelectionChange": "cellSelectionChange"; "columnChange": "columnChange"; }, ["rowDefs", "headerRowDefs", "footerRowDefs"], never, false, never>;
}
export declare class MtxGridSelectableCell {
    private _grid;
    private _selected;
    private _rowData;
    ctrlKeyPressed: boolean;
    shiftKeyPressed: boolean;
    get selected(): boolean;
    set mtxSelectableRowData(value: any);
    cellSelectionChange: EventEmitter<MtxGridSelectableCell>;
    constructor(_grid: MtxGrid);
    onClick(event: MouseEvent): void;
    select(): void;
    deselect(): void;
    toggle(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<MtxGridSelectableCell, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<MtxGridSelectableCell, "[mtx-grid-selectable-cell]", never, { "mtxSelectableRowData": "mtxSelectableRowData"; }, { "cellSelectionChange": "cellSelectionChange"; }, never, never, false, never>;
}
