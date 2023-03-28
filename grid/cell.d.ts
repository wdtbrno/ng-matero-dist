import { ChangeDetectorRef, DoCheck, EventEmitter, KeyValueChangeRecord, KeyValueDiffers, OnInit } from '@angular/core';
import { MtxDialog } from '@ng-matero/extensions/dialog';
import { MtxGridUtils } from './grid-utils';
import { MtxGridColumn, MtxGridColumnButton } from './interfaces';
import * as i0 from "@angular/core";
export declare class MtxGridCell implements OnInit, DoCheck {
    private _dialog;
    private _utils;
    private _differs;
    private _changeDetectorRef;
    /** Row data */
    rowData: Record<string, any>;
    /** Column definition */
    colDef: MtxGridColumn;
    /** Table data */
    data: any[];
    /** Whether show summary */
    summary: boolean;
    /** Placeholder for the empty value (`null`, `''`, `[]`) */
    placeholder: string;
    rowDataChange: EventEmitter<KeyValueChangeRecord<string, any>>;
    private rowDataDiffer?;
    get _value(): string;
    constructor(_dialog: MtxDialog, _utils: MtxGridUtils, _differs: KeyValueDiffers, _changeDetectorRef: ChangeDetectorRef);
    ngOnInit(): void;
    ngDoCheck(): void;
    private _applyChanges;
    _getText(value: any): any;
    _getTooltip(value: any): any;
    _getFormatterTooltip(value: any): any;
    _onActionClick(event: MouseEvent, btn: MtxGridColumnButton, rowData: Record<string, any>): void;
    /** Preview enlarged image */
    _onImagePreview(urlStr: string): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<MtxGridCell, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MtxGridCell, "mtx-grid-cell", ["mtxGridCell"], { "rowData": "rowData"; "colDef": "colDef"; "data": "data"; "summary": "summary"; "placeholder": "placeholder"; }, { "rowDataChange": "rowDataChange"; }, never, never, false, never>;
}
