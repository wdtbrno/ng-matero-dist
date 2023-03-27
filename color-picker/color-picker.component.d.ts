import { ChangeDetectorRef, OnDestroy, ElementRef, EventEmitter, DoCheck, AfterViewInit, NgZone } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { FocusMonitor } from '@angular/cdk/a11y';
import { BooleanInput } from '@angular/cdk/coercion';
import { MatFormFieldControl, MatFormField } from '@angular/material/form-field';
import { MatMenuTrigger } from '@angular/material/menu';
import { Subject } from 'rxjs';
import { ColorEvent } from 'ngx-color';
export declare class MtxColorPickerComponent implements OnDestroy, DoCheck, AfterViewInit, ControlValueAccessor, MatFormFieldControl<any> {
    private _focusMonitor;
    private _elementRef;
    private _changeDetectorRef;
    private _zone;
    ngControl: NgControl;
    private _formField;
    private _document;
    /** Value of the color picker control. */
    get value(): string | null;
    set value(newValue: string | null);
    private _value;
    /** Implemented as part of MatFormFieldControl. */
    readonly stateChanges: Subject<void>;
    /** Unique id for this input. */
    private _uid;
    /** Unique id of the element. */
    get id(): string;
    set id(value: string);
    private _id;
    /** Placeholder to be shown if value is empty. */
    get placeholder(): string;
    set placeholder(value: string);
    private _placeholder;
    /** Whether the input is focused. */
    get focused(): boolean;
    private _focused;
    get empty(): boolean;
    get shouldLabelFloat(): boolean;
    get required(): boolean;
    set required(value: boolean);
    private _required;
    get disabled(): boolean;
    set disabled(value: boolean);
    private _disabled;
    /** Whether the element is readonly. */
    get readonly(): boolean;
    set readonly(value: boolean);
    private _readonly;
    errorState: boolean;
    /** A name for this control that can be used by `mat-form-field`. */
    controlType: string;
    /** The aria-describedby attribute on the color picker for improved a11y. */
    _ariaDescribedby: string;
    /** `View -> model callback called when value changes` */
    _onChange: (value: any) => void;
    /** `View -> model callback called when color picker has been touched` */
    _onTouched: () => void;
    /** Event emitted when the color changed */
    readonly colorChange: EventEmitter<ColorEvent>;
    trigger: MatMenuTrigger;
    /** Whether or not the overlay panel is open. */
    _panelOpen: boolean;
    /** The subscription for closing actions (some are bound to document). */
    private _closingActionsSubscription;
    /** Whether the element is inside of a ShadowRoot component. */
    private _isInsideShadowRoot;
    /**
     * Whether the color picker can open the next time it is focused. Used to prevent a focused,
     * closed color picker from being reopened if the user switches to another browser tab and then
     * comes back.
     */
    private _canOpenOnNextFocus;
    /**
     * Event handler for when the window is blurred. Needs to be an
     * arrow function in order to preserve the context.
     */
    private _windowBlurHandler;
    constructor(_focusMonitor: FocusMonitor, _elementRef: ElementRef<HTMLElement>, _changeDetectorRef: ChangeDetectorRef, _zone: NgZone, ngControl: NgControl, _formField: MatFormField, _document: any);
    ngDoCheck(): void;
    ngAfterViewInit(): void;
    ngOnDestroy(): void;
    /** Implemented as part of MatFormFieldControl. */
    setDescribedByIds(ids: string[]): void;
    /** Implemented as part of MatFormFieldControl. */
    onContainerClick(): void;
    /**
     * Sets the model value. Implemented as part of ControlValueAccessor.
     * @param value New value to be written to the model.
     */
    writeValue(value: string | null): void;
    /**
     * Registers a callback to be triggered when the model value changes.
     * Implemented as part of ControlValueAccessor.
     * @param fn Callback to be registered.
     */
    registerOnChange(fn: any): void;
    /**
     * Registers a callback to be triggered when the control is touched.
     * Implemented as part of ControlValueAccessor.
     * @param fn Callback to be registered.
     */
    registerOnTouched(fn: any): void;
    /**
     * Sets the disabled state of the control. Implemented as a part of ControlValueAccessor.
     * @param isDisabled Whether the control should be disabled.
     */
    setDisabledState(isDisabled: boolean): void;
    /** Open panel with input focus event. */
    _handleFocus(): void;
    /** Opens the overlay panel. */
    _openPanel(): void;
    /** Closes the overlay panel and focuses the host element. */
    _closePanel(): void;
    /** The callback of color changed. */
    _onColorChanged(model: ColorEvent): void;
    /** Stream of clicks outside of the color picker panel. */
    private _getOutsideClickStream;
    static ngAcceptInputType_required: BooleanInput;
    static ngAcceptInputType_readonly: BooleanInput;
    static ngAcceptInputType_disabled: BooleanInput;
}
