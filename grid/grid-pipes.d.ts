import { KeyValueChangeRecord, PipeTransform } from '@angular/core';
import { MtxGridUtils } from './grid-utils';
import { MtxGridColumn, MtxGridColumnButton, MtxGridRowClassFormatter } from './interfaces';
import * as i0 from "@angular/core";
export declare class MtxGridColClassPipe implements PipeTransform {
    transform(colDef: MtxGridColumn, rowData?: Record<string, any>, rowChangeRecord?: KeyValueChangeRecord<string, any>, currentValue?: any): string;
    static ɵfac: i0.ɵɵFactoryDeclaration<MtxGridColClassPipe, never>;
    static ɵpipe: i0.ɵɵPipeDeclaration<MtxGridColClassPipe, "colClass", false>;
}
export declare class MtxGridRowClassPipe implements PipeTransform {
    transform(rowData: Record<string, any>, index: number, dataIndex: number, rowClassFormatter?: MtxGridRowClassFormatter): string;
    static ɵfac: i0.ɵɵFactoryDeclaration<MtxGridRowClassPipe, never>;
    static ɵpipe: i0.ɵɵPipeDeclaration<MtxGridRowClassPipe, "rowClass", false>;
}
export declare class MtxGridCellActionTooltipPipe implements PipeTransform {
    transform(btn: MtxGridColumnButton): import("./interfaces").MtxGridColumnButtonTooltip;
    static ɵfac: i0.ɵɵFactoryDeclaration<MtxGridCellActionTooltipPipe, never>;
    static ɵpipe: i0.ɵɵPipeDeclaration<MtxGridCellActionTooltipPipe, "cellActionTooltip", false>;
}
export declare class MtxGridCellActionDisablePipe implements PipeTransform {
    transform(btn: MtxGridColumnButton, rowData: Record<string, any>): boolean;
    static ɵfac: i0.ɵɵFactoryDeclaration<MtxGridCellActionDisablePipe, never>;
    static ɵpipe: i0.ɵɵPipeDeclaration<MtxGridCellActionDisablePipe, "cellActionDisable", false>;
}
export declare class MtxGridCellSummaryPipe implements PipeTransform {
    private utils;
    constructor(utils: MtxGridUtils);
    transform(data: any[], colDef: MtxGridColumn): any;
    static ɵfac: i0.ɵɵFactoryDeclaration<MtxGridCellSummaryPipe, never>;
    static ɵpipe: i0.ɵɵPipeDeclaration<MtxGridCellSummaryPipe, "cellSummary", false>;
}
