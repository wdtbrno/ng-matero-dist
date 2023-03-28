import { ElementRef, OnChanges, Renderer2, SimpleChanges, ViewContainerRef } from '@angular/core';
import { BooleanInput } from '@angular/cdk/coercion';
import { ThemePalette } from '@angular/material/core';
import * as i0 from "@angular/core";
export declare class MatButtonLoading implements OnChanges {
    private _elementRef;
    private _viewContainerRef;
    private _renderer;
    private spinner;
    get loading(): boolean;
    set loading(value: boolean);
    private _loading;
    get disabled(): boolean;
    set disabled(value: boolean);
    private _disabled;
    color: ThemePalette;
    constructor(_elementRef: ElementRef<HTMLButtonElement>, _viewContainerRef: ViewContainerRef, _renderer: Renderer2);
    ngOnChanges(changes: SimpleChanges): void;
    private createSpinner;
    private destroySpinner;
    static ngAcceptInputType_loading: BooleanInput;
    static ngAcceptInputType_disabled: BooleanInput;
    static ɵfac: i0.ɵɵFactoryDeclaration<MatButtonLoading, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<MatButtonLoading, "[mat-button][loading],             [mat-raised-button][loading],             [mat-stroked-button][loading],             [mat-flat-button][loading],             [mat-icon-button][loading],             [mat-fab][loading],             [mat-mini-fab][loading]", never, { "loading": "loading"; "disabled": "disabled"; "color": "color"; }, {}, never, never, false, never>;
}
