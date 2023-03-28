import { EventEmitter, ChangeDetectorRef } from '@angular/core';
import { BooleanInput } from '@angular/cdk/coercion';
import * as i0 from "@angular/core";
export type MtxAlertType = 'default' | 'info' | 'success' | 'warning' | 'danger';
export declare class MtxAlert {
    private _changeDetectorRef;
    get _hostClassList(): string;
    /** The alert's type. Can be `default`, `info`, `success`, `warning` or `danger`. */
    type: MtxAlertType;
    /** Whether to display an inline close button. */
    get dismissible(): boolean;
    set dismissible(value: boolean);
    private _dismissible;
    /** The alert's elevation (0~24). */
    elevation: number;
    /** Event emitted when the alert closed. */
    closed: EventEmitter<MtxAlert>;
    constructor(_changeDetectorRef: ChangeDetectorRef);
    _onClosed(): void;
    static ngAcceptInputType_dismissible: BooleanInput;
    static ɵfac: i0.ɵɵFactoryDeclaration<MtxAlert, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MtxAlert, "mtx-alert", ["mtxAlert"], { "type": "type"; "dismissible": "dismissible"; "elevation": "elevation"; }, { "closed": "closed"; }, never, ["*"], false, never>;
}
