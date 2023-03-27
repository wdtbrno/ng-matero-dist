import { ChangeDetectorRef } from '@angular/core';
import { BooleanInput } from '@angular/cdk/coercion';
import { ThemePalette } from '@angular/material/core';
import { ProgressBarMode } from '@angular/material/progress-bar';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';
export declare type MtxLoaderType = 'spinner' | 'progressbar';
export declare class MtxLoaderComponent {
    private _changeDetectorRef;
    type: MtxLoaderType;
    color: ThemePalette;
    mode: ProgressSpinnerMode | ProgressBarMode;
    value: number;
    strokeWidth: number;
    diameter: number;
    bufferValue: number;
    get loading(): boolean;
    set loading(value: boolean);
    private _loading;
    get hasBackdrop(): boolean;
    set hasBackdrop(value: boolean);
    private _hasBackdrop;
    constructor(_changeDetectorRef: ChangeDetectorRef);
    static ngAcceptInputType_loading: BooleanInput;
    static ngAcceptInputType_hasBackdrop: BooleanInput;
}
