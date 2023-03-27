import { EventEmitter } from '@angular/core';
import { MtxGridComponent } from './grid.component';
export declare class MtxGridCellSelectionDirective {
    private _dataGrid;
    private _selected;
    private _rowData;
    shiftKeyPressed: boolean;
    ctrlKeyPressed: boolean;
    get selected(): boolean;
    set matSelectableRowData(value: any);
    cellSelectionChange: EventEmitter<MtxGridCellSelectionDirective>;
    constructor(_dataGrid: MtxGridComponent);
    onClick(event: MouseEvent): void;
    select(): void;
    deselect(): void;
    toggle(): void;
}
