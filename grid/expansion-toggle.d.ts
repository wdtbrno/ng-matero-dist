import { EventEmitter, TemplateRef } from '@angular/core';
import * as i0 from "@angular/core";
export declare class MtxGridExpansionToggle {
    private _opened;
    private _row;
    private _tplRef;
    get opened(): boolean;
    set opened(newValue: boolean);
    openedChange: EventEmitter<boolean>;
    get expanded(): boolean;
    set expandableRow(value: any);
    set template(value: TemplateRef<any>);
    toggleChange: EventEmitter<MtxGridExpansionToggle>;
    constructor();
    onClick(event: MouseEvent): void;
    toggle(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<MtxGridExpansionToggle, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<MtxGridExpansionToggle, "[mtx-grid-expansion-toggle]", never, { "opened": "opened"; "expandableRow": "expandableRow"; "template": "expansionRowTpl"; }, { "openedChange": "openedChange"; "toggleChange": "toggleChange"; }, never, never, false, never>;
}
