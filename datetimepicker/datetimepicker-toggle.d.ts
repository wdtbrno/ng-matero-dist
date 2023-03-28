import { AfterContentInit, ChangeDetectorRef, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { BooleanInput } from '@angular/cdk/coercion';
import { MatButton } from '@angular/material/button';
import { MtxDatetimepicker } from './datetimepicker';
import { MtxDatetimepickerIntl } from './datetimepicker-intl';
import * as i0 from "@angular/core";
/** Can be used to override the icon of a `mtxDatetimepickerToggle`. */
export declare class MtxDatetimepickerToggleIcon {
    static ɵfac: i0.ɵɵFactoryDeclaration<MtxDatetimepickerToggleIcon, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<MtxDatetimepickerToggleIcon, "[mtxDatetimepickerToggleIcon]", never, {}, {}, never, never, false, never>;
}
export declare class MtxDatetimepickerToggle<D> implements AfterContentInit, OnChanges, OnDestroy {
    _intl: MtxDatetimepickerIntl;
    private _changeDetectorRef;
    private _stateChanges;
    /** Datetimepicker instance that the button will toggle. */
    datetimepicker: MtxDatetimepicker<D>;
    /** Tabindex for the toggle. */
    tabIndex: number | null;
    /** Screen-reader label for the button. */
    ariaLabel?: string;
    /** Whether the toggle button is disabled. */
    get disabled(): boolean;
    set disabled(value: boolean);
    private _disabled;
    /** Whether ripples on the toggle should be disabled. */
    disableRipple: boolean;
    /** Custom icon set by the consumer. */
    _customIcon: MtxDatetimepickerToggleIcon;
    /** Underlying button element. */
    _button: MatButton;
    constructor(_intl: MtxDatetimepickerIntl, _changeDetectorRef: ChangeDetectorRef, defaultTabIndex: string);
    ngOnChanges(changes: SimpleChanges): void;
    ngOnDestroy(): void;
    ngAfterContentInit(): void;
    _open(event: Event): void;
    private _watchStateChanges;
    static ngAcceptInputType_disabled: BooleanInput;
    static ngAcceptInputType_disableRipple: BooleanInput;
    static ɵfac: i0.ɵɵFactoryDeclaration<MtxDatetimepickerToggle<any>, [null, null, { attribute: "tabindex"; }]>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MtxDatetimepickerToggle<any>, "mtx-datetimepicker-toggle", ["mtxDatetimepickerToggle"], { "datetimepicker": "for"; "tabIndex": "tabIndex"; "ariaLabel": "aria-label"; "disabled": "disabled"; "disableRipple": "disableRipple"; }, {}, ["_customIcon"], ["[mtxDatetimepickerToggleIcon]"], false, never>;
}
