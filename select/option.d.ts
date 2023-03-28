import { BooleanInput } from '@angular/cdk/coercion';
import { AfterViewChecked, ElementRef, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { Subject } from 'rxjs';
import * as i0 from "@angular/core";
export declare class MtxOption implements OnChanges, AfterViewChecked, OnDestroy {
    elementRef: ElementRef<HTMLElement>;
    value: any;
    get disabled(): boolean;
    set disabled(value: boolean);
    private _disabled;
    get label(): string;
    private _previousLabel?;
    readonly stateChange$: Subject<{
        value: any;
        disabled: boolean;
        label?: string | undefined;
    }>;
    constructor(elementRef: ElementRef<HTMLElement>);
    ngOnChanges(changes: SimpleChanges): void;
    ngAfterViewChecked(): void;
    ngOnDestroy(): void;
    static ngAcceptInputType_disabled: BooleanInput;
    static ɵfac: i0.ɵɵFactoryDeclaration<MtxOption, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MtxOption, "mtx-option", ["mtxOption"], { "value": "value"; "disabled": "disabled"; }, {}, never, ["*"], false, never>;
}
