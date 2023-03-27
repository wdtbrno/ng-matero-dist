import { ThemePalette } from '@angular/material/core';
import { MtxDialog } from '@ng-matero/extensions/dialog';
import { Observable } from 'rxjs';
import { MtxGridColumn, MtxGridColumnButton } from './grid.interface';
import { MtxGridService } from './grid.service';
export declare class MtxGridCellComponent {
    private _dialog;
    private _dataGridSrv;
    /** Row data */
    rowData: {};
    /** Column definition */
    colDef: MtxGridColumn;
    /** All data */
    data: never[];
    /** Whether show summary */
    summary: boolean;
    get _colValue(): string;
    _isString(fn: any): boolean;
    _isFunction(fn: any): boolean;
    _isEmptyValue(value: any): boolean;
    _isContainHTML(value: string): boolean;
    _getText(value: any): any;
    _getTooltip(value: any): any;
    _getFormatterTooltip(value: any): any;
    _formatSummary(data: any[], colDef: MtxGridColumn): string | void | ((data: any[], colDef?: MtxGridColumn | undefined) => void);
    constructor(_dialog: MtxDialog, _dataGridSrv: MtxGridService);
    _handleActionConfirm(event: MouseEvent, title: string | Observable<string>, description: string | Observable<string> | undefined, okColor: ThemePalette, okText: string | Observable<string> | undefined, closeColor: ThemePalette, closeText?: string | Observable<string>, fn?: (p: any) => void, data?: any): void;
    _handleActionClick(event: MouseEvent, btn: MtxGridColumnButton, rowData: any): void;
    /** Preview enlarged image */
    _onPreview(urlStr: string): void;
}
