import { ChangeDetectorRef } from '@angular/core';
import { BooleanInput } from '@angular/cdk/coercion';
import { ThemePalette } from '@angular/material/core';
import { ProgressBarMode } from '@angular/material/progress-bar';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';
import * as i0 from "@angular/core";
export type MtxLoaderType = 'spinner' | 'progressbar';
export declare class MtxLoader {
    private _changeDetectorRef;
    /** The loader's type. Can be `spinner` or `progressbar` */
    type: MtxLoaderType;
    /** Theme color palette for the component. */
    color: ThemePalette;
    /** Mode of the progress circle or the progress bar. */
    mode: ProgressSpinnerMode | ProgressBarMode;
    /** Stroke width of the spinner loader. */
    strokeWidth: number;
    /** The diameter of the spinner loader (will set width and height of svg). */
    diameter: number;
    /** Buffer value of the progressbar loader. */
    bufferValue: number;
    /** Value of the progress circle or the progress bar. */
    value: number;
    /** Whether the loader is loading. */
    get loading(): boolean;
    set loading(value: boolean);
    private _loading;
    /** Whether the loader has a backdrop. */
    get hasBackdrop(): boolean;
    set hasBackdrop(value: boolean);
    private _hasBackdrop;
    constructor(_changeDetectorRef: ChangeDetectorRef);
    static ngAcceptInputType_loading: BooleanInput;
    static ngAcceptInputType_hasBackdrop: BooleanInput;
    static ɵfac: i0.ɵɵFactoryDeclaration<MtxLoader, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MtxLoader, "mtx-loader", ["mtxLoader"], { "type": "type"; "color": "color"; "mode": "mode"; "strokeWidth": "strokeWidth"; "diameter": "diameter"; "bufferValue": "bufferValue"; "value": "value"; "loading": "loading"; "hasBackdrop": "hasBackdrop"; }, {}, never, ["*"], false, never>;
}
