import { BooleanInput } from '@angular/cdk/coercion';
import { AfterViewInit, ElementRef, EventEmitter, OnDestroy } from '@angular/core';
import { AbstractControl, ControlValueAccessor, ValidationErrors } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import { MatFormField } from '@angular/material/form-field';
import { MtxColorpicker } from './colorpicker';
import * as i0 from "@angular/core";
export declare class MtxColorPickerInputEvent {
    /** Reference to the colorpicker input component that emitted the event. */
    target: MtxColorpickerInput;
    /** Reference to the native input element associated with the colorpicker input. */
    targetElement: HTMLElement;
    /** The new value for the target colorpicker input. */
    value: string | null;
    constructor(
    /** Reference to the colorpicker input component that emitted the event. */
    target: MtxColorpickerInput, 
    /** Reference to the native input element associated with the colorpicker input. */
    targetElement: HTMLElement);
}
export declare const MTX_COLORPICKER_VALUE_ACCESSOR: any;
export declare const MTX_COLORPICKER_VALIDATORS: any;
export type ColorFormat = 'hex' | 'rgb' | 'hsl' | 'hsv';
export declare class MtxColorpickerInput implements ControlValueAccessor, AfterViewInit, OnDestroy {
    private _elementRef;
    private _formField;
    /** Whether the component has been initialized. */
    private _isInitialized;
    set mtxColorpicker(value: MtxColorpicker);
    _picker: MtxColorpicker;
    /** Whether the colorpicker-input is disabled. */
    get disabled(): boolean;
    set disabled(value: boolean);
    private _disabled;
    /** The value of the input. */
    get value(): string | null;
    set value(value: string | null);
    private _value;
    /** The input and output color format. */
    format: ColorFormat;
    /** Emits when a `change` event is fired on this `<input>`. */
    readonly colorChange: EventEmitter<MtxColorPickerInputEvent>;
    /** Emits when an `input` event is fired on this `<input>`. */
    readonly colorInput: EventEmitter<MtxColorPickerInputEvent>;
    /** Emits when the disabled state has changed */
    _disabledChange: EventEmitter<boolean>;
    /** Emits when the value changes (either due to user input or programmatic change). */
    _valueChange: EventEmitter<string | null>;
    _onTouched: () => void;
    _validatorOnChange: () => void;
    private _cvaOnChange;
    private _pickerSubscription;
    /** The combined form control validator for this input. */
    private _validator;
    /** Whether the last value set on the input was valid. */
    private _lastValueValid;
    constructor(_elementRef: ElementRef<HTMLInputElement>, _formField: MatFormField);
    ngAfterViewInit(): void;
    ngOnDestroy(): void;
    registerOnValidatorChange(fn: () => void): void;
    /** @docs-private */
    validate(c: AbstractControl): ValidationErrors | null;
    /**
     * @deprecated
     * @breaking-change 8.0.0 Use `getConnectedOverlayOrigin` instead
     */
    getPopupConnectionElementRef(): ElementRef;
    /**
     * Gets the element that the colorpicker popup should be connected to.
     * @return The element to connect the popup to.
     */
    getConnectedOverlayOrigin(): ElementRef;
    /** Gets the ID of an element that should be used a description for the overlay. */
    getOverlayLabelId(): string | null;
    writeValue(value: string): void;
    registerOnChange(fn: (value: any) => void): void;
    registerOnTouched(fn: () => void): void;
    setDisabledState(isDisabled: boolean): void;
    _onKeydown(event: KeyboardEvent): void;
    /** Handles blur events on the input. */
    _onBlur(): void;
    _onInput(value: string): void;
    _onChange(): void;
    /** Returns the palette used by the input's form field, if any. */
    getThemePalette(): ThemePalette;
    /** TODO: Formats a value and sets it on the input element. */
    private _formatValue;
    static ngAcceptInputType_value: any;
    static ngAcceptInputType_disabled: BooleanInput;
    static ɵfac: i0.ɵɵFactoryDeclaration<MtxColorpickerInput, [null, { optional: true; }]>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<MtxColorpickerInput, "input[mtxColorpicker]", ["mtxColorpickerInput"], { "mtxColorpicker": "mtxColorpicker"; "disabled": "disabled"; "value": "value"; "format": "format"; }, { "colorChange": "colorChange"; "colorInput": "colorInput"; }, never, never, false, never>;
}
