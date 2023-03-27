import { EventEmitter, ChangeDetectorRef } from '@angular/core';
import { BooleanInput } from '@angular/cdk/coercion';
export declare type MtxAlertType = 'default' | 'info' | 'success' | 'warning' | 'danger';
export declare class MtxAlertComponent {
    private _changeDetectorRef;
    get hostClassList(): string;
    /** The alert type */
    type: MtxAlertType;
    /** Whether displays an inline `Close` button */
    get dismissible(): boolean;
    set dismissible(value: boolean);
    private _dismissible;
    /** The alert text color */
    color: string;
    /** Material elevation */
    elevation: number;
    /** This event fires when alert closed, $event is an instance of Alert component */
    closed: EventEmitter<MtxAlertComponent>;
    constructor(_changeDetectorRef: ChangeDetectorRef);
    _onClosed(): void;
    static ngAcceptInputType_dismissible: BooleanInput;
}
