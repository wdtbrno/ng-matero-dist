import { FocusMonitor } from '@angular/cdk/a11y';
import { Directionality } from '@angular/cdk/bidi';
import { BooleanInput, NumberInput } from '@angular/cdk/coercion';
import { ChangeDetectorRef, ElementRef, EventEmitter, NgZone, OnDestroy, OnInit } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { CanColor, CanDisable, HasTabIndex } from '@angular/material/core';
import * as i0 from "@angular/core";
/**
 * Provider Expression that allows mtx-slider to register as a ControlValueAccessor.
 * This allows it to support [(ngModel)] and [formControl].
 */
export declare const MTX_SLIDER_VALUE_ACCESSOR: any;
/** A simple change event emitted by the MtxSlider component. */
export declare class MtxSliderChange {
    /** The MtxSlider that changed. */
    source: MtxSlider;
    /** The new value of the source slider. */
    value: number | number[] | null;
}
/** @docs-private */
declare const _MtxSliderBase: import("@angular/material/core")._Constructor<HasTabIndex> & import("@angular/material/core")._AbstractConstructor<HasTabIndex> & import("@angular/material/core")._Constructor<CanColor> & import("@angular/material/core")._AbstractConstructor<CanColor> & import("@angular/material/core")._Constructor<CanDisable> & import("@angular/material/core")._AbstractConstructor<CanDisable> & {
    new (_elementRef: ElementRef): {
        _elementRef: ElementRef;
    };
};
/**
 * Allows users to select from a range of values by moving the slider thumb. It is similar in
 * behavior to the native `<input type="range">` element.
 */
export declare class MtxSlider extends _MtxSliderBase implements ControlValueAccessor, OnDestroy, CanDisable, CanColor, OnInit, HasTabIndex {
    private _focusMonitor;
    private _changeDetectorRef;
    private _dir;
    _animationMode?: string | undefined;
    private _ngZone?;
    /** Whether the slider is inverted. */
    get invert(): boolean;
    set invert(value: boolean);
    private _invert;
    /** The maximum value that the slider can have. */
    get max(): number;
    set max(v: number);
    private _max;
    /** The minimum value that the slider can have. */
    get min(): number;
    set min(v: number);
    private _min;
    /** The values at which the thumb will snap. */
    get step(): number;
    set step(v: number);
    private _step;
    /** Whether or not to show the thumb label. */
    get thumbLabel(): boolean;
    set thumbLabel(value: boolean);
    private _thumbLabel;
    /**
     * How often to show ticks. Relative to the step so that a tick always appears on a step.
     * Ex: Tick interval of 4 with a step of 3 will draw a tick every 4 steps (every 12 values).
     */
    get tickInterval(): 'auto' | number;
    set tickInterval(value: 'auto' | number);
    private _tickInterval;
    /** Value of the slider. */
    get value(): number | number[] | null;
    set value(v: number | number[] | null);
    private _value;
    /**
     * Function that will be used to format the value before it is displayed
     * in the thumb label. Can be used to format very large number in order
     * for them to fit into the slider thumb.
     */
    displayWith: (value: number | null) => string | number;
    /** Text corresponding to the slider's value. Used primarily for improved accessibility. */
    valueText: string;
    /** Whether the slider is vertical. */
    get vertical(): boolean;
    set vertical(value: boolean);
    private _vertical;
    /** Event emitted when the slider value has changed. */
    readonly change: EventEmitter<MtxSliderChange>;
    /** Event emitted when the slider thumb moves. */
    readonly input: EventEmitter<MtxSliderChange>;
    /**
     * Emits when the raw value of the slider changes. This is here primarily
     * to facilitate the two-way binding for the `value` input.
     * @docs-private
     */
    readonly valueChange: EventEmitter<number | number[] | null>;
    /** The value to be used for display purposes. */
    get displayValue(): string | number;
    /** The value to be used for display purposes. */
    get displayValueRight(): string | number;
    /** set focus to the host element */
    focus(): void;
    /** blur the host element */
    blur(): void;
    /** onTouch function registered via registerOnTouch (ControlValueAccessor). */
    onTouched: () => any;
    /** The percentage of the slider that coincides with the value. */
    get percent(): number | number[];
    private _percent;
    /**
     * Whether or not the thumb is sliding.
     * Used to determine if there should be a transition for the thumb and fill track.
     */
    _isSliding: boolean;
    /**
     * Whether or not the slider is active (clicked or sliding).
     * Used to shrink and grow the thumb as according to the Material Design spec.
     */
    _isActive: boolean;
    /**
     * Whether the axis of the slider is inverted.
     * (i.e. whether moving the thumb in the positive x or y direction decreases the slider's
     *  value).
     */
    get _invertAxis(): boolean;
    /** Whether the slider is at its minimum value. */
    get _isMinValue(): boolean;
    /**
     * The amount of space to leave between the slider thumb and the track fill & track background
     * elements.
     */
    get _thumbGap(): 0 | 7 | 10;
    /** CSS styles for the track background element. */
    get _trackBackgroundStylesLeft(): {
        [key: string]: string;
    };
    get _trackBackgroundStylesRight(): {
        [key: string]: string;
    };
    /** CSS styles for the track fill element. */
    get _trackFillStyles(): {
        [key: string]: string;
    };
    /** CSS styles for the ticks container element. */
    get _ticksContainerStyles(): {
        [key: string]: string;
    };
    /** CSS styles for the ticks element. */
    get _ticksStyles(): {
        [key: string]: string;
    };
    get _thumbContainerStylesLeft(): {
        [key: string]: string;
    };
    get _thumbContainerStylesRight(): {
        [key: string]: string;
    };
    /** The size of a tick interval as a percentage of the size of the track. */
    private _tickIntervalPercent;
    /** The dimensions of the slider. */
    private _sliderDimensions;
    private _controlValueAccessorChangeFn;
    /** Decimal places to round to, based on the step amount. */
    private _roundToDecimal;
    /** Subscription to the Directionality change EventEmitter. */
    private _dirChangeSubscription;
    /** The value of the slider when the slide start event fires. */
    private _valueOnSlideStart;
    /** Position of the pointer when the dragging started. */
    private _pointerPositionOnStart;
    /** Reference to the inner slider wrapper element. */
    private _sliderWrapper;
    /** The slider thumb which is currently used (left or right) */
    private _currentSliderDir;
    /**
     * Whether mouse events should be converted to a slider position by calculating their distance
     * from the right or bottom edge of the slider as opposed to the top or left.
     */
    private _shouldInvertMouseCoords;
    /** The language direction for this slider element. */
    private _getDirection;
    constructor(elementRef: ElementRef, _focusMonitor: FocusMonitor, _changeDetectorRef: ChangeDetectorRef, _dir: Directionality, tabIndex: string, _animationMode?: string | undefined, _ngZone?: NgZone | undefined);
    ngOnInit(): void;
    ngOnDestroy(): void;
    _onMouseenter(): void;
    _onClick(event: MouseEvent): void;
    _onFocus(): void;
    _onBlur(): void;
    _onKeydown(event: KeyboardEvent): void;
    _onKeyup(): void;
    /** Called when the user has put their pointer down on the slider. */
    private _pointerDown;
    /**
     * Called when the user has moved their pointer after
     * starting to drag. Bound on the document level.
     */
    private _pointerMove;
    /** Called when the user has lifted their pointer. Bound on the document level. */
    private _pointerUp;
    /**
     * Binds our global move and end events. They're bound at the document level and only while
     * dragging so that the user doesn't have to keep their pointer exactly over the slider
     * as they're swiping across the screen.
     */
    private _bindGlobalEvents;
    /** Removes any global event listeners that we may have added. */
    private _removeGlobalEvents;
    /** Increments the slider by the given number of steps (negative number decrements). */
    private _increment;
    /** Calculate the new value from the new physical location. The value will always be snapped. */
    private _updateValueFromPosition;
    /** Calculate the new value from the new physical location. The value will always be snapped. */
    private _updateValueFromPositionLeft;
    /** Calculate the new value from the new physical location. The value will always be snapped. */
    private _updateValueFromPositionRight;
    /** Emits a change event if the current value is different from the last emitted value. */
    private _emitChangeEvent;
    /** Emits an input event when the current value is different from the last emitted value. */
    private _emitInputEvent;
    /** Updates the amount of space between ticks as a percentage of the width of the slider. */
    private _updateTickIntervalPercent;
    /** Creates a slider change object from the specified value. */
    private _createChangeEvent;
    /** Calculates the percentage of the slider that a value is. */
    private _calculatePercentage;
    /** Calculates the value a percentage of the slider corresponds to. */
    private _calculateValue;
    /** Return a number between two numbers. */
    private _clamp;
    /**
     * Get the bounding client rect of the slider track element.
     * The track is used rather than the native element to ignore the extra space that the thumb can
     * take up.
     */
    private _getSliderDimensions;
    /**
     * Focuses the native element.
     * Currently only used to allow a blur event to fire but will be used with keyboard input later.
     */
    private _focusHostElement;
    /** Blurs the native element. */
    private _blurHostElement;
    /** Runs a callback outside of the NgZone, if possible. */
    private _runOutsizeZone;
    /** Runs a callback inside of the NgZone, if possible. */
    private _runInsideZone;
    /**
     * Sets the model value. Implemented as part of ControlValueAccessor.
     * @param value
     */
    writeValue(value: any): void;
    /**
     * Registers a callback to be triggered when the value has changed.
     * Implemented as part of ControlValueAccessor.
     * @param fn Callback to be registered.
     */
    registerOnChange(fn: (value: any) => void): void;
    /**
     * Registers a callback to be triggered when the component is touched.
     * Implemented as part of ControlValueAccessor.
     * @param fn Callback to be registered.
     */
    registerOnTouched(fn: any): void;
    /**
     * Sets whether the component should be disabled.
     * Implemented as part of ControlValueAccessor.
     * @param isDisabled
     */
    setDisabledState(isDisabled: boolean): void;
    isRangeSlider(): boolean;
    private calculateInitialSlideDirection;
    static ngAcceptInputType_invert: BooleanInput;
    static ngAcceptInputType_max: NumberInput;
    static ngAcceptInputType_min: NumberInput;
    static ngAcceptInputType_step: NumberInput;
    static ngAcceptInputType_thumbLabel: BooleanInput;
    static ngAcceptInputType_tickInterval: NumberInput;
    static ngAcceptInputType_value: NumberInput | NumberInput[];
    static ngAcceptInputType_vertical: BooleanInput;
    static ngAcceptInputType_disabled: BooleanInput;
    static ngAcceptInputType_tabIndex: NumberInput;
    static ɵfac: i0.ɵɵFactoryDeclaration<MtxSlider, [null, null, null, { optional: true; }, { attribute: "tabindex"; }, { optional: true; }, null]>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MtxSlider, "mtx-slider", ["mtxSlider"], { "disabled": "disabled"; "color": "color"; "tabIndex": "tabIndex"; "invert": "invert"; "max": "max"; "min": "min"; "step": "step"; "thumbLabel": "thumbLabel"; "tickInterval": "tickInterval"; "value": "value"; "displayWith": "displayWith"; "valueText": "valueText"; "vertical": "vertical"; }, { "change": "change"; "input": "input"; "valueChange": "valueChange"; }, never, never, false, never>;
}
export {};
