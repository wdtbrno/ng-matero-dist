import { EventEmitter, TemplateRef } from '@angular/core';
export declare class MtxGridExpansionToggleDirective {
    private _opened;
    private _row;
    private _tplRef;
    get opened(): boolean;
    set opened(newValue: boolean);
    openedChange: EventEmitter<boolean>;
    get expanded(): boolean;
    set expandableRow(value: any);
    set template(value: TemplateRef<any>);
    toggleChange: EventEmitter<MtxGridExpansionToggleDirective>;
    constructor();
    onClick(event: MouseEvent): void;
    toggle(): void;
}
