import { AfterContentInit, ElementRef, EventEmitter, OnDestroy } from '@angular/core';
import { AbstractControl, ControlValueAccessor, ValidationErrors, Validator } from '@angular/forms';
import { BooleanInput } from '@angular/cdk/coercion';
import { ThemePalette } from '@angular/material/core';
import { MatFormField } from '@angular/material/form-field';
import { DatetimeAdapter, MtxDatetimeFormats } from '@ng-matero/extensions/core';
import { MtxDatetimepicker } from './datetimepicker';
import { MtxDatetimepickerFilterType } from './datetimepicker-filtertype';
import * as i0 from "@angular/core";
export declare const MAT_DATETIMEPICKER_VALUE_ACCESSOR: any;
export declare const MAT_DATETIMEPICKER_VALIDATORS: any;
/**
 * An event used for datetimepicker input and change events. We don't always have access to a native
 * input or change event because the event may have been triggered by the user clicking on the
 * calendar popup. For consistency, we always use MtxDatetimepickerInputEvent instead.
 */
export declare class MtxDatetimepickerInputEvent<D> {
    target: MtxDatetimepickerInput<D>;
    targetElement: HTMLElement;
    /** The new value for the target datetimepicker input. */
    value: D | null;
    constructor(target: MtxDatetimepickerInput<D>, targetElement: HTMLElement);
}
/** Directive used to connect an input to a MtxDatetimepicker. */
export declare class MtxDatetimepickerInput<D> implements AfterContentInit, ControlValueAccessor, OnDestroy, Validator {
    private _elementRef;
    _dateAdapter: DatetimeAdapter<D>;
    private _dateFormats;
    private _formField;
    _datetimepicker: MtxDatetimepicker<D>;
    _dateFilter: (date: D | null, type: MtxDatetimepickerFilterType) => boolean;
    /** Emits when a `change` event is fired on this `<input>`. */
    dateChange: EventEmitter<MtxDatetimepickerInputEvent<D>>;
    /** Emits when an `input` event is fired on this `<input>`. */
    dateInput: EventEmitter<MtxDatetimepickerInputEvent<D>>;
    /** Emits when the value changes (either due to user input or programmatic change). */
    _valueChange: EventEmitter<D | null>;
    /** Emits when the disabled state has changed */
    _disabledChange: EventEmitter<boolean>;
    private _datetimepickerSubscription;
    private _localeSubscription;
    /** Whether the last value set on the input was valid. */
    private _lastValueValid;
    constructor(_elementRef: ElementRef, _dateAdapter: DatetimeAdapter<D>, _dateFormats: MtxDatetimeFormats, _formField: MatFormField);
    /** The datetimepicker that this input is associated with. */
    set mtxDatetimepicker(value: MtxDatetimepicker<D>);
    set mtxDatetimepickerFilter(filter: (date: D | null, type: MtxDatetimepickerFilterType) => boolean);
    /** The value of the input. */
    get value(): D | null;
    set value(value: D | null);
    private _value;
    /** The minimum valid date. */
    get min(): D | null;
    set min(value: D | null);
    private _min;
    /** The maximum valid date. */
    get max(): D | null;
    set max(value: D | null);
    private _max;
    /** Whether the datetimepicker-input is disabled. */
    get disabled(): boolean;
    set disabled(value: boolean);
    private _disabled;
    _onTouched: () => void;
    ngAfterContentInit(): void;
    ngOnDestroy(): void;
    registerOnValidatorChange(fn: () => void): void;
    validate(c: AbstractControl): ValidationErrors | null;
    /**
     * Gets the element that the datetimepicker popup should be connected to.
     * @return The element to connect the popup to.
     */
    getConnectedOverlayOrigin(): ElementRef;
    /** Gets the ID of an element that should be used a description for the calendar overlay. */
    getOverlayLabelId(): string | null;
    writeValue(value: D): void;
    registerOnChange(fn: (value: any) => void): void;
    registerOnTouched(fn: () => void): void;
    setDisabledState(disabled: boolean): void;
    _onKeydown(event: KeyboardEvent): void;
    _onInput(value: string): void;
    _onChange(): void;
    /** Handles blur events on the input. */
    _onBlur(): void;
    private registerDatetimepicker;
    private getDisplayFormat;
    private getParseFormat;
    private _cvaOnChange;
    private _validatorOnChange;
    /** The form control validator for whether the input parses. */
    private _parseValidator;
    /** The form control validator for the min date. */
    private _minValidator;
    /** The form control validator for the max date. */
    private _maxValidator;
    /** The form control validator for the date filter. */
    private _filterValidator;
    /** The combined form control validator for this input. */
    private _validator;
    /** Formats a value and sets it on the input element. */
    private _formatValue;
    /** Returns the palette used by the input's form field, if any. */
    getThemePalette(): ThemePalette;
    static ngAcceptInputType_disabled: BooleanInput;
    static ɵfac: i0.ɵɵFactoryDeclaration<MtxDatetimepickerInput<any>, [null, { optional: true; }, { optional: true; }, { optional: true; }]>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<MtxDatetimepickerInput<any>, "input[mtxDatetimepicker]", ["mtxDatetimepickerInput"], { "mtxDatetimepicker": "mtxDatetimepicker"; "mtxDatetimepickerFilter": "mtxDatetimepickerFilter"; "value": "value"; "min": "min"; "max": "max"; "disabled": "disabled"; }, { "dateChange": "dateChange"; "dateInput": "dateInput"; }, never, never, false, never>;
}
