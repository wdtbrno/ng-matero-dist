import { BooleanInput } from '@angular/cdk/coercion';
import { AfterContentInit, ChangeDetectorRef, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MtxColorpicker } from './colorpicker';
import * as i0 from "@angular/core";
/** Can be used to override the icon of a `mtxColorpickerToggle`. */
export declare class MtxColorpickerToggleIcon {
    static ɵfac: i0.ɵɵFactoryDeclaration<MtxColorpickerToggleIcon, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<MtxColorpickerToggleIcon, "[mtxColorpickerToggleIcon]", never, {}, {}, never, never, false, never>;
}
export declare class MtxColorpickerToggle implements AfterContentInit, OnChanges, OnDestroy {
    private _changeDetectorRef;
    private _stateChanges;
    /** Colorpicker instance that the button will toggle. */
    picker: MtxColorpicker;
    /** Tabindex for the toggle. */
    tabIndex: number | null;
    /** Screen-reader label for the button. */
    ariaLabel: string;
    /** Whether the toggle button is disabled. */
    get disabled(): boolean;
    set disabled(value: boolean);
    private _disabled;
    /** Whether ripples on the toggle should be disabled. */
    disableRipple: boolean;
    /** Custom icon set by the consumer. */
    _customIcon: MtxColorpickerToggleIcon;
    /** Underlying button element. */
    _button: MatButton;
    constructor(_changeDetectorRef: ChangeDetectorRef, defaultTabIndex: string);
    ngOnChanges(changes: SimpleChanges): void;
    ngOnDestroy(): void;
    ngAfterContentInit(): void;
    _open(event: Event): void;
    private _watchStateChanges;
    static ngAcceptInputType_disabled: BooleanInput;
    static ngAcceptInputType_disableRipple: BooleanInput;
    static ɵfac: i0.ɵɵFactoryDeclaration<MtxColorpickerToggle, [null, { attribute: "tabindex"; }]>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MtxColorpickerToggle, "mtx-colorpicker-toggle", ["mtxColorpickerToggle"], { "picker": "for"; "tabIndex": "tabIndex"; "ariaLabel": "aria-label"; "disabled": "disabled"; "disableRipple": "disableRipple"; }, {}, ["_customIcon"], ["[mtxColorpickerToggleIcon]"], false, never>;
}
