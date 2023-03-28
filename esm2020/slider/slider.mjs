import { coerceBooleanProperty, coerceNumberProperty, } from '@angular/cdk/coercion';
import { DOWN_ARROW, END, HOME, LEFT_ARROW, PAGE_DOWN, PAGE_UP, RIGHT_ARROW, UP_ARROW, } from '@angular/cdk/keycodes';
import { normalizePassiveListenerOptions } from '@angular/cdk/platform';
import { Attribute, ChangeDetectionStrategy, Component, EventEmitter, forwardRef, Inject, Input, Optional, Output, ViewChild, ViewEncapsulation, } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { mixinColor, mixinDisabled, mixinTabIndex, } from '@angular/material/core';
import { ANIMATION_MODULE_TYPE } from '@angular/platform-browser/animations';
import { Subscription } from 'rxjs';
import * as i0 from "@angular/core";
import * as i1 from "@angular/cdk/a11y";
import * as i2 from "@angular/cdk/bidi";
import * as i3 from "@angular/common";
const activeEventOptions = normalizePassiveListenerOptions({ passive: false });
/**
 * Visually, a 30px separation between tick marks looks best. This is very subjective but it is
 * the default separation we chose.
 */
const MIN_AUTO_TICK_SEPARATION = 30;
/** The thumb gap size for a disabled slider. */
const DISABLED_THUMB_GAP = 0;
/** The thumb gap size for a non-active slider at its minimum value. */
const MIN_VALUE_NONACTIVE_THUMB_GAP = 7;
/** The thumb gap size for an active slider at its minimum value. */
const MIN_VALUE_ACTIVE_THUMB_GAP = 10;
/**
 * Provider Expression that allows mtx-slider to register as a ControlValueAccessor.
 * This allows it to support [(ngModel)] and [formControl].
 */
export const MTX_SLIDER_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => MtxSlider),
    multi: true,
};
/** A simple change event emitted by the MtxSlider component. */
export class MtxSliderChange {
}
// Boilerplate for applying mixins to MtxSlider.
/** @docs-private */
const _MtxSliderBase = mixinTabIndex(mixinColor(mixinDisabled(class {
    constructor(_elementRef) {
        this._elementRef = _elementRef;
    }
}), 'accent'));
/**
 * Allows users to select from a range of values by moving the slider thumb. It is similar in
 * behavior to the native `<input type="range">` element.
 */
export class MtxSlider extends _MtxSliderBase {
    /** Whether the slider is inverted. */
    get invert() {
        return this._invert;
    }
    set invert(value) {
        this._invert = coerceBooleanProperty(value);
    }
    /** The maximum value that the slider can have. */
    get max() {
        return this._max;
    }
    set max(v) {
        this._max = coerceNumberProperty(v, this._max);
        this._percent = this._calculatePercentage(this._value);
        // Since this also modifies the percentage, we need to let the change detection know.
        this._changeDetectorRef.markForCheck();
    }
    /** The minimum value that the slider can have. */
    get min() {
        return this._min;
    }
    set min(v) {
        this._min = coerceNumberProperty(v, this._min);
        // If the value wasn't explicitly set by the user, set it to the min.
        if (this._value === null) {
            this.value = this._min;
        }
        this._percent = this._calculatePercentage(this._value);
        // Since this also modifies the percentage, we need to let the change detection know.
        this._changeDetectorRef.markForCheck();
    }
    /** The values at which the thumb will snap. */
    get step() {
        return this._step;
    }
    set step(v) {
        this._step = coerceNumberProperty(v, this._step);
        if (this._step % 1 !== 0) {
            this._roundToDecimal = this._step.toString().split('.').pop().length;
        }
        // Since this could modify the label, we need to notify the change detection.
        this._changeDetectorRef.markForCheck();
    }
    /** Whether or not to show the thumb label. */
    get thumbLabel() {
        return this._thumbLabel;
    }
    set thumbLabel(value) {
        this._thumbLabel = coerceBooleanProperty(value);
    }
    /**
     * How often to show ticks. Relative to the step so that a tick always appears on a step.
     * Ex: Tick interval of 4 with a step of 3 will draw a tick every 4 steps (every 12 values).
     */
    get tickInterval() {
        return this._tickInterval;
    }
    set tickInterval(value) {
        if (value === 'auto') {
            this._tickInterval = 'auto';
        }
        else if (typeof value === 'number' || typeof value === 'string') {
            this._tickInterval = coerceNumberProperty(value, this._tickInterval);
        }
        else {
            this._tickInterval = 0;
        }
    }
    /** Value of the slider. */
    get value() {
        // If the value needs to be read and it is still uninitialized, initialize it to the min.
        if (this._value === null) {
            this.value = this._min;
        }
        return this._value;
    }
    set value(v) {
        if (v !== this._value ||
            (v instanceof Array &&
                this._value != null &&
                (v[0] !== this._value[0] || v[1] !== this._value[1]))) {
            let value = null;
            if (v instanceof Array) {
                value = [coerceNumberProperty(v[0]), coerceNumberProperty(v[1])];
                value = [Math.min(value[0], value[1]), Math.max(value[1], value[0])];
            }
            else {
                value = coerceNumberProperty(v);
            }
            // While incrementing by a decimal we can end up with values like 33.300000000000004.
            // Truncate it to ensure that it matches the label and to make it easier to work with.
            if (this._roundToDecimal) {
                if (v instanceof Array) {
                    value = [
                        parseFloat(value[0].toFixed(this._roundToDecimal)),
                        parseFloat(value[1].toFixed(this._roundToDecimal)),
                    ];
                }
                else {
                    value = parseFloat(Number(value).toFixed(this._roundToDecimal));
                }
            }
            this._value = value;
            this._percent = this._calculatePercentage(this._value);
            // Since this also modifies the percentage, we need to let the change detection know.
            this._changeDetectorRef.markForCheck();
        }
    }
    /** Whether the slider is vertical. */
    get vertical() {
        return this._vertical;
    }
    set vertical(value) {
        this._vertical = coerceBooleanProperty(value);
    }
    /** The value to be used for display purposes. */
    get displayValue() {
        if (this.value == null) {
            return '';
        }
        if (this.displayWith) {
            if (this.value instanceof Array) {
                return this.displayWith(this.value[0]);
            }
            else {
                return this.displayWith(this.value);
            }
        }
        // Note that this could be improved further by rounding something like 0.999 to 1 or
        // 0.899 to 0.9, however it is very performance sensitive, because it gets called on
        // every change detection cycle.
        if (this.value instanceof Array) {
            if (this._roundToDecimal &&
                this.value &&
                (this.value[0] % 1 !== 0 || this.value[1] % 1 !== 0)) {
                return this.value[0].toFixed(this._roundToDecimal);
            }
        }
        else {
            if (this._roundToDecimal && this.value && this.value % 1 !== 0) {
                return this.value.toFixed(this._roundToDecimal);
            }
        }
        if (this.value instanceof Array) {
            return this.value[0] || 0;
        }
        else {
            return this.value || 0;
        }
    }
    /** The value to be used for display purposes. */
    get displayValueRight() {
        if (this.value == null) {
            return '';
        }
        if (this.displayWith) {
            return this.displayWith(this.value[1]);
        }
        // Note that this could be improved further by rounding something like 0.999 to 1 or
        // 0.899 to 0.9, however it is very performance sensitive, because it gets called on
        // every change detection cycle.
        if (this._roundToDecimal &&
            this.value &&
            this.value != null &&
            this.value[1] % 1 !== 0) {
            return this.value[1].toFixed(this._roundToDecimal);
        }
        return this.value[1] || 0;
    }
    /** set focus to the host element */
    focus() {
        this._focusHostElement();
    }
    /** blur the host element */
    blur() {
        this._blurHostElement();
    }
    /** The percentage of the slider that coincides with the value. */
    get percent() {
        return this._clamp(this._percent);
    }
    /**
     * Whether the axis of the slider is inverted.
     * (i.e. whether moving the thumb in the positive x or y direction decreases the slider's
     *  value).
     */
    get _invertAxis() {
        // Standard non-inverted mode for a vertical slider should be dragging the thumb from bottom
        // to top. However from a y-axis standpoint this is inverted.
        return this.vertical ? !this.invert : this.invert;
    }
    /** Whether the slider is at its minimum value. */
    get _isMinValue() {
        if (this.value instanceof Array) {
            return this.percent[0] === 0;
        }
        else {
            return this.percent === 0;
        }
    }
    /**
     * The amount of space to leave between the slider thumb and the track fill & track background
     * elements.
     */
    get _thumbGap() {
        if (this.disabled) {
            return DISABLED_THUMB_GAP;
        }
        if (this._isMinValue && !this.thumbLabel) {
            return this._isActive ? MIN_VALUE_ACTIVE_THUMB_GAP : MIN_VALUE_NONACTIVE_THUMB_GAP;
        }
        return 0;
    }
    /** CSS styles for the track background element. */
    get _trackBackgroundStylesLeft() {
        const axis = this.vertical ? 'Y' : 'X';
        let scale = '';
        if (this.percent instanceof Array) {
            scale = this.vertical ? `1, ${this.percent[0]}, 1` : `${this.percent[0]}, 1, 1`;
        }
        else {
            scale = this.vertical ? `1, ${this.percent}, 1` : `${this.percent}, 1, 1`;
        }
        const sign = this._shouldInvertMouseCoords() ? '' : '-';
        return {
            // scale3d avoids some rendering issues in Chrome. See #12071.
            transform: `translate${axis}(${sign}${this._thumbGap}px) scale3d(${scale})`,
        };
    }
    get _trackBackgroundStylesRight() {
        const axis = this.vertical ? 'Y' : 'X';
        let scale = '';
        if (this.percent instanceof Array) {
            scale = this.vertical ? `1, ${1 - this.percent[1]}, 1` : `${1 - this.percent[1]}, 1, 1`;
        }
        else {
            scale = this.vertical ? `1, ${1 - this.percent}, 1` : `${1 - this.percent}, 1, 1`;
        }
        const sign = this._shouldInvertMouseCoords() ? '-' : '';
        return {
            // scale3d avoids some rendering issues in Chrome. See #12071.
            transform: `translate${axis}(${sign}${this._thumbGap}px) scale3d(${scale})`,
        };
    }
    /** CSS styles for the track fill element. */
    get _trackFillStyles() {
        const axis = this.vertical ? 'Y' : 'X';
        let scale = '';
        if (this.percent instanceof Array) {
            scale = this.vertical
                ? `1, ${this.percent[1] - this.percent[0]}, 1`
                : `${this.percent[1] - this.percent[0]}, 1, 1`;
        }
        else {
            scale = this.vertical ? `1, ${this.percent}, 1` : `${this.percent}, 1, 1`;
        }
        const invertOffset = this._getDirection() === 'rtl' && !this.vertical ? !this._invertAxis : this._invertAxis;
        let offset = 0;
        if (this.percent instanceof Array) {
            offset = (invertOffset ? 1 - this.percent[1] : this.percent[0]) * 100;
        }
        else {
            offset = 0;
        }
        const sign = this._shouldInvertMouseCoords() ? '' : '-';
        if (this.isRangeSlider()) {
            return {
                // scale3d avoids some rendering issues in Chrome. See #12071.
                transform: `translate${axis}(${offset}%) scale3d(${scale})`,
            };
        }
        else {
            return {
                // scale3d avoids some rendering issues in Chrome. See #12071.
                transform: `translate${axis}(${sign}${this._thumbGap}px) scale3d(${scale})`,
            };
        }
    }
    /** CSS styles for the ticks container element. */
    get _ticksContainerStyles() {
        const axis = this.vertical ? 'Y' : 'X';
        // For a horizontal slider in RTL languages we push the ticks container off the left edge
        // instead of the right edge to avoid causing a horizontal scrollbar to appear.
        const sign = !this.vertical && this._getDirection() === 'rtl' ? '' : '-';
        const offset = (this._tickIntervalPercent / 2) * 100;
        return {
            transform: `translate${axis}(${sign}${offset}%)`,
        };
    }
    /** CSS styles for the ticks element. */
    get _ticksStyles() {
        const tickSize = this._tickIntervalPercent * 100;
        const backgroundSize = this.vertical ? `2px ${tickSize}%` : `${tickSize}% 2px`;
        const axis = this.vertical ? 'Y' : 'X';
        // Depending on the direction we pushed the ticks container, push the ticks the opposite
        // direction to re-center them but clip off the end edge. In RTL languages we need to flip
        // the ticks 180 degrees so we're really cutting off the end edge abd not the start.
        const sign = !this.vertical && this._getDirection() === 'rtl' ? '-' : '';
        const rotate = !this.vertical && this._getDirection() === 'rtl' ? ' rotate(180deg)' : '';
        const styles = {
            backgroundSize,
            // Without translateZ ticks sometimes jitter as the slider moves on Chrome & Firefox.
            transform: `translateZ(0) translate${axis}(${sign}${tickSize / 2}%)${rotate}`,
        };
        if (this._isMinValue && this._thumbGap) {
            const side = this.vertical
                ? this._invertAxis
                    ? 'Bottom'
                    : 'Top'
                : this._invertAxis
                    ? 'Right'
                    : 'Left';
            styles[`padding${side}`] = `${this._thumbGap}px`;
        }
        return styles;
    }
    get _thumbContainerStylesLeft() {
        const axis = this.vertical ? 'Y' : 'X';
        // For a horizontal slider in RTL languages we push the thumb container off the left edge
        // instead of the right edge to avoid causing a horizontal scrollbar to appear.
        const invertOffset = this._getDirection() === 'rtl' && !this.vertical ? !this._invertAxis : this._invertAxis;
        let offset = 0;
        if (this.percent instanceof Array) {
            offset = (invertOffset ? this.percent[0] : 1 - this.percent[0]) * 100;
        }
        else {
            offset = (invertOffset ? this.percent : 1 - this.percent) * 100;
        }
        return {
            transform: `translate${axis}(-${offset}%)`,
        };
    }
    get _thumbContainerStylesRight() {
        const axis = this.vertical ? 'Y' : 'X';
        // For a horizontal slider in RTL languages we push the thumb container off the left edge
        // instead of the right edge to avoid causing a horizontal scrollbar to appear.
        const invertOffset = this._getDirection() === 'rtl' && !this.vertical ? !this._invertAxis : this._invertAxis;
        let offset = 0;
        if (this.percent instanceof Array) {
            offset = (invertOffset ? this.percent[1] : 1 - this.percent[1]) * 100;
        }
        else {
            offset = (invertOffset ? this.percent : 1 - this.percent) * 100;
        }
        return {
            transform: `translate${axis}(-${offset}%)`,
        };
    }
    /**
     * Whether mouse events should be converted to a slider position by calculating their distance
     * from the right or bottom edge of the slider as opposed to the top or left.
     */
    _shouldInvertMouseCoords() {
        return this._getDirection() === 'rtl' && !this.vertical ? !this._invertAxis : this._invertAxis;
    }
    /** The language direction for this slider element. */
    _getDirection() {
        return this._dir && this._dir.value === 'rtl' ? 'rtl' : 'ltr';
    }
    constructor(elementRef, _focusMonitor, _changeDetectorRef, _dir, tabIndex, 
    // @breaking-change 7.0.0 `_animationMode` parameter to be made required.
    _animationMode, _ngZone) {
        super(elementRef);
        this._focusMonitor = _focusMonitor;
        this._changeDetectorRef = _changeDetectorRef;
        this._dir = _dir;
        this._animationMode = _animationMode;
        this._ngZone = _ngZone;
        this._invert = false;
        this._max = 100;
        this._min = 0;
        this._step = 1;
        this._thumbLabel = false;
        this._tickInterval = 0;
        this._value = null;
        this._vertical = false;
        /** Event emitted when the slider value has changed. */
        this.change = new EventEmitter();
        /** Event emitted when the slider thumb moves. */
        this.input = new EventEmitter();
        /**
         * Emits when the raw value of the slider changes. This is here primarily
         * to facilitate the two-way binding for the `value` input.
         * @docs-private
         */
        this.valueChange = new EventEmitter();
        /** onTouch function registered via registerOnTouch (ControlValueAccessor). */
        this.onTouched = () => { };
        this._percent = 0;
        /**
         * Whether or not the thumb is sliding.
         * Used to determine if there should be a transition for the thumb and fill track.
         */
        this._isSliding = false;
        /**
         * Whether or not the slider is active (clicked or sliding).
         * Used to shrink and grow the thumb as according to the Material Design spec.
         */
        this._isActive = false;
        /** The size of a tick interval as a percentage of the size of the track. */
        this._tickIntervalPercent = 0;
        /** The dimensions of the slider. */
        this._sliderDimensions = null;
        this._controlValueAccessorChangeFn = () => { };
        /** Subscription to the Directionality change EventEmitter. */
        this._dirChangeSubscription = Subscription.EMPTY;
        /** The slider thumb which is currently used (left or right) */
        this._currentSliderDir = 'l';
        /** Called when the user has put their pointer down on the slider. */
        this._pointerDown = (event) => {
            // Don't do anything if the slider is disabled or the
            // user is using anything other than the main mouse button.
            if (this.disabled || this._isSliding || (!isTouchEvent(event) && event.button !== 0)) {
                return;
            }
            this.calculateInitialSlideDirection(event);
            this._runInsideZone(() => {
                const oldValue = this.value;
                const pointerPosition = getPointerPositionOnPage(event);
                this._isSliding = true;
                event.preventDefault();
                this._focusHostElement();
                this._onMouseenter(); // Simulate mouseenter in case this is a mobile device.
                this._bindGlobalEvents(event);
                this._focusHostElement();
                // TODO:
                // this._updateValueFromPosition(pointerPosition);
                if (this.value instanceof Array) {
                    if (this._currentSliderDir === 'l') {
                        this._updateValueFromPositionLeft(pointerPosition);
                    }
                    else if (this._currentSliderDir === 'r') {
                        this._updateValueFromPositionRight(pointerPosition);
                    }
                }
                else {
                    this._updateValueFromPositionLeft(pointerPosition);
                }
                this._valueOnSlideStart = this.value;
                this._pointerPositionOnStart = pointerPosition;
                // Emit a change and input event if the value changed.
                if (oldValue !== this.value) {
                    this._emitInputEvent();
                    this._emitChangeEvent();
                }
            });
        };
        /**
         * Called when the user has moved their pointer after
         * starting to drag. Bound on the document level.
         */
        this._pointerMove = (event) => {
            if (this._isSliding) {
                this.calculateInitialSlideDirection(event);
                // Prevent the slide from selecting anything else.
                event.preventDefault();
                const oldValue = this.value;
                // TODO:
                // this._updateValueFromPosition(getPointerPositionOnPage(event));
                const pointerPosition = getPointerPositionOnPage(event);
                if (this._currentSliderDir === 'l') {
                    this._updateValueFromPositionLeft(pointerPosition);
                }
                else if (this._currentSliderDir === 'r') {
                    this._updateValueFromPositionRight(pointerPosition);
                }
                else {
                    if (!this.isRangeSlider()) {
                        this._updateValueFromPositionLeft(pointerPosition);
                    }
                }
                // Native range elements always emit `input` events when the value changed while sliding.
                if (oldValue !== this.value) {
                    this._emitInputEvent();
                }
            }
        };
        /** Called when the user has lifted their pointer. Bound on the document level. */
        this._pointerUp = (event) => {
            if (this._isSliding) {
                const pointerPositionOnStart = this._pointerPositionOnStart;
                const currentPointerPosition = getPointerPositionOnPage(event);
                event.preventDefault();
                this._removeGlobalEvents();
                this._valueOnSlideStart = this._pointerPositionOnStart = null;
                this._isSliding = false;
                if (this._valueOnSlideStart !== this.value &&
                    !this.disabled &&
                    pointerPositionOnStart &&
                    (pointerPositionOnStart.x !== currentPointerPosition.x ||
                        pointerPositionOnStart.y !== currentPointerPosition.y)) {
                    this._emitChangeEvent();
                }
            }
        };
        this.tabIndex = parseInt(tabIndex, 10) || 0;
        this._runOutsizeZone(() => {
            const element = elementRef.nativeElement;
            element.addEventListener('mousedown', this._pointerDown, activeEventOptions);
            element.addEventListener('touchstart', this._pointerDown, activeEventOptions);
        });
    }
    ngOnInit() {
        this._focusMonitor.monitor(this._elementRef, true).subscribe((origin) => {
            this._isActive = !!origin && origin !== 'keyboard';
            this._changeDetectorRef.detectChanges();
        });
        if (this._dir) {
            this._dirChangeSubscription = this._dir.change.subscribe(() => {
                this._changeDetectorRef.markForCheck();
            });
        }
    }
    ngOnDestroy() {
        const element = this._elementRef.nativeElement;
        element.removeEventListener('mousedown', this._pointerDown, activeEventOptions);
        element.removeEventListener('touchstart', this._pointerDown, activeEventOptions);
        this._removeGlobalEvents();
        this._focusMonitor.stopMonitoring(this._elementRef);
        this._dirChangeSubscription.unsubscribe();
    }
    _onMouseenter() {
        if (this.disabled) {
            return;
        }
        // We save the dimensions of the slider here so we can use them to update the spacing of the
        // ticks and determine where on the slider click and slide events happen.
        this._sliderDimensions = this._getSliderDimensions();
        this._updateTickIntervalPercent();
    }
    _onClick(event) {
        if (this.disabled) {
            return;
        }
        let oldValue;
        if (this.value instanceof Array) {
            oldValue = [this.value[0], this.value[1]];
        }
        else {
            oldValue = this.value;
        }
        this._isSliding = false;
        this._focusHostElement();
        if (!this._sliderDimensions) {
            return;
        }
        const offset = this.vertical ? this._sliderDimensions.top : this._sliderDimensions.left;
        const size = this.vertical ? this._sliderDimensions.height : this._sliderDimensions.width;
        const posComponent = this.vertical ? event.clientY : event.clientX;
        // The exact value is calculated from the event and used to find the closest snap value.
        let percent = Number(this._clamp((posComponent - offset) / size));
        if (this._shouldInvertMouseCoords()) {
            percent = 1 - percent;
        }
        if (percent <=
            this.percent[0] +
                (this.percent[1] - this.percent[0]) / 2) {
            this._currentSliderDir = 'l';
        }
        else {
            this._currentSliderDir = 'r';
        }
        if (this._currentSliderDir === 'l') {
            this._updateValueFromPositionLeft({ x: event.clientX, y: event.clientY });
        }
        else {
            this._updateValueFromPositionRight({ x: event.clientX, y: event.clientY });
        }
        // Emit a change and input event if the value changed.
        if (this.value instanceof Array) {
            if (oldValue[0] !== this.value[0] ||
                oldValue[1] !== this.value[1]) {
                this._emitInputEvent();
                this._emitChangeEvent();
            }
        }
        else {
            if (oldValue !== this.value) {
                this._emitInputEvent();
                this._emitChangeEvent();
            }
        }
    }
    _onFocus() {
        // We save the dimensions of the slider here so we can use them to update the spacing of the
        // ticks and determine where on the slider click and slide events happen.
        this._sliderDimensions = this._getSliderDimensions();
        this._updateTickIntervalPercent();
    }
    _onBlur() {
        this.onTouched();
    }
    _onKeydown(event) {
        if (this.disabled) {
            return;
        }
        let oldValue;
        if (this.value instanceof Array) {
            oldValue = [this.value[0], this.value[1]];
        }
        else {
            oldValue = this.value;
        }
        switch (event.keyCode) {
            case PAGE_UP:
                this._increment(10);
                break;
            case PAGE_DOWN:
                this._increment(-10);
                break;
            case END:
                this.value = this.max;
                break;
            case HOME:
                this.value = this.min;
                break;
            case LEFT_ARROW:
                // NOTE: For a sighted user it would make more sense that when they press an arrow
                // key on an inverted slider the thumb moves in that direction. However for a blind
                // user, nothing about the slider indicates that it is inverted. They will expect
                // left to be decrement, regardless of how it appears on the screen. For speakers
                // ofRTL languages, they probably expect left to mean increment. Therefore we flip
                // the meaning of the side arrow keys for RTL. For inverted sliders we prefer a
                // good a11y experience to having it "look right" for sighted users, therefore we do
                // not swap the meaning.
                this._increment(this._getDirection() === 'rtl' ? 1 : -1);
                break;
            case UP_ARROW:
                this._increment(1);
                break;
            case RIGHT_ARROW:
                // See comment on LEFT_ARROW about the conditions under which we flip the meaning.
                this._increment(this._getDirection() === 'rtl' ? -1 : 1);
                break;
            case DOWN_ARROW:
                this._increment(-1);
                break;
            default:
                // Return if the key is not one that we explicitly handle to avoid calling
                // preventDefault on it.
                return;
        }
        if (this.value instanceof Array) {
            if (oldValue[0] !== this.value[0] ||
                oldValue[1] !== this.value[1]) {
                this._emitInputEvent();
                this._emitChangeEvent();
            }
        }
        else {
            if (oldValue !== this.value) {
                this._emitInputEvent();
                this._emitChangeEvent();
            }
        }
        this._isSliding = true;
        event.preventDefault();
    }
    _onKeyup() {
        this._isSliding = false;
    }
    /**
     * Binds our global move and end events. They're bound at the document level and only while
     * dragging so that the user doesn't have to keep their pointer exactly over the slider
     * as they're swiping across the screen.
     */
    _bindGlobalEvents(triggerEvent) {
        if (typeof document !== 'undefined' && document) {
            const isTouch = isTouchEvent(triggerEvent);
            const moveEventName = isTouch ? 'touchmove' : 'mousemove';
            const endEventName = isTouch ? 'touchend' : 'mouseup';
            document.body.addEventListener(moveEventName, this._pointerMove, activeEventOptions);
            document.body.addEventListener(endEventName, this._pointerUp, activeEventOptions);
        }
    }
    /** Removes any global event listeners that we may have added. */
    _removeGlobalEvents() {
        if (typeof document !== 'undefined' && document) {
            document.body.removeEventListener('mousemove', this._pointerMove, activeEventOptions);
            document.body.removeEventListener('mouseup', this._pointerUp, activeEventOptions);
            document.body.removeEventListener('touchmove', this._pointerMove, activeEventOptions);
            document.body.removeEventListener('touchend', this._pointerUp, activeEventOptions);
        }
    }
    /** Increments the slider by the given number of steps (negative number decrements). */
    _increment(numSteps) {
        if (this.value instanceof Array) {
            this.value = this._clamp([(this.value[0] || 0) + this.step * numSteps, (this.value[1] || 0) + this.step * numSteps], this.min, this.max);
        }
        else {
            this.value = this._clamp((this.value || 0) + this.step * numSteps, this.min, this.max);
        }
    }
    /** Calculate the new value from the new physical location. The value will always be snapped. */
    _updateValueFromPosition(pos) {
        if (!this._sliderDimensions) {
            return;
        }
        const offset = this.vertical ? this._sliderDimensions.top : this._sliderDimensions.left;
        const size = this.vertical ? this._sliderDimensions.height : this._sliderDimensions.width;
        const posComponent = this.vertical ? pos.y : pos.x;
        // The exact value is calculated from the event and used to find the closest snap value.
        let percent = this._clamp((posComponent - offset) / size);
        if (this._shouldInvertMouseCoords()) {
            percent = 1 - percent;
        }
        // Since the steps may not divide cleanly into the max value, if the user
        // slid to 0 or 100 percent, we jump to the min/max value. This approach
        // is slightly more intuitive than using `Math.ceil` below, because it
        // follows the user's pointer closer.
        if (percent === 0) {
            this.value = this.min;
        }
        else if (percent === 1) {
            this.value = this.max;
        }
        else {
            const exactValue = this._calculateValue(percent);
            // This calculation finds the closest step by finding the closest
            // whole number divisible by the step relative to the min.
            const closestValue = Math.round((exactValue - this.min) / this.step) * this.step + this.min;
            // The value needs to snap to the min and max.
            this.value = this._clamp(closestValue, this.min, this.max);
        }
    }
    /** Calculate the new value from the new physical location. The value will always be snapped. */
    _updateValueFromPositionLeft(pos) {
        if (!this._sliderDimensions) {
            return;
        }
        const offset = this.vertical ? this._sliderDimensions.top : this._sliderDimensions.left;
        const size = this.vertical ? this._sliderDimensions.height : this._sliderDimensions.width;
        const posComponent = this.vertical ? pos.y : pos.x;
        // The exact value is calculated from the event and used to find the closest snap value.
        let percent = Number(this._clamp((posComponent - offset) / size));
        if (this._shouldInvertMouseCoords()) {
            percent = 1 - percent;
        }
        // Since the steps may not divide cleanly into the max value, if the user
        // slid to 0 or 100 percent, we jump to the min/max value. This approach
        // is slightly more intuitive than using `Math.ceil` below, because it
        // follows the user's pointer closer.
        if (percent === 0) {
            if (this.value instanceof Array) {
                this.value = [this.min, this.value[1]];
            }
            else {
                this.value = this.min;
            }
        }
        else if (percent === 1) {
            if (this.value instanceof Array) {
                this.value = [this.max, this.value[1]];
            }
            else {
                this.value = this.max;
            }
        }
        else {
            const exactValue = this._calculateValue(percent);
            // This calculation finds the closest step by finding the closest
            // whole number divisible by the step relative to the min.
            const closestValue = Math.round((Number(exactValue) - this.min) / this.step) * this.step + this.min;
            // The value needs to snap to the min and max.
            if (this.value instanceof Array) {
                this.value = [Number(this._clamp(closestValue, this.min, this.max)), this.value[1]];
            }
            else {
                this.value = this._clamp(closestValue, this.min, this.max);
            }
        }
    }
    /** Calculate the new value from the new physical location. The value will always be snapped. */
    _updateValueFromPositionRight(pos) {
        if (!this._sliderDimensions) {
            return;
        }
        const offset = this.vertical ? this._sliderDimensions.top : this._sliderDimensions.left;
        const size = this.vertical ? this._sliderDimensions.height : this._sliderDimensions.width;
        const posComponent = this.vertical ? pos.y : pos.x;
        // The exact value is calculated from the event and used to find the closest snap value.
        let percent = Number(this._clamp((posComponent - offset) / size));
        if (this._shouldInvertMouseCoords()) {
            percent = 1 - percent;
        }
        // Since the steps may not divide cleanly into the max value, if the user
        // slid to 0 or 100 percent, we jump to the min/max value. This approach
        // is slightly more intuitive than using `Math.ceil` below, because it
        // follows the user's pointer closer.
        if (percent === 0) {
            if (this.value instanceof Array) {
                this.value = [this.value[0], this.min];
            }
            else {
                this.value = this.min;
            }
        }
        else if (percent === 1) {
            if (this.value instanceof Array) {
                this.value = [this.value[0], this.max];
            }
            else {
                this.value = this.max;
            }
        }
        else {
            const exactValue = this._calculateValue(percent);
            // This calculation finds the closest step by finding the closest
            // whole number divisible by the step relative to the min.
            const closestValue = Math.round((Number(exactValue) - this.min) / this.step) * this.step + this.min;
            // The value needs to snap to the min and max.
            if (this.value instanceof Array) {
                this.value = [this.value[0], Number(this._clamp(closestValue, this.min, this.max))];
            }
            else {
                this.value = this._clamp(closestValue, this.min, this.max);
            }
        }
    }
    /** Emits a change event if the current value is different from the last emitted value. */
    _emitChangeEvent() {
        this._controlValueAccessorChangeFn(this.value);
        this.valueChange.emit(this.value);
        this.change.emit(this._createChangeEvent());
    }
    /** Emits an input event when the current value is different from the last emitted value. */
    _emitInputEvent() {
        this.input.emit(this._createChangeEvent());
    }
    /** Updates the amount of space between ticks as a percentage of the width of the slider. */
    _updateTickIntervalPercent() {
        if (!this.tickInterval || !this._sliderDimensions) {
            return;
        }
        if (this.tickInterval === 'auto') {
            const trackSize = this.vertical
                ? this._sliderDimensions.height
                : this._sliderDimensions.width;
            const pixelsPerStep = (trackSize * this.step) / (this.max - this.min);
            const stepsPerTick = Math.ceil(MIN_AUTO_TICK_SEPARATION / pixelsPerStep);
            const pixelsPerTick = stepsPerTick * this.step;
            this._tickIntervalPercent = pixelsPerTick / trackSize;
        }
        else {
            this._tickIntervalPercent = (this.tickInterval * this.step) / (this.max - this.min);
        }
    }
    /** Creates a slider change object from the specified value. */
    _createChangeEvent(value = this.value) {
        const event = new MtxSliderChange();
        event.source = this;
        event.value = value;
        return event;
    }
    /** Calculates the percentage of the slider that a value is. */
    _calculatePercentage(value) {
        if (value instanceof Array) {
            return [
                ((value[0] || 0) - this.min) / (this.max - this.min),
                ((value[1] || 0) - this.min) / (this.max - this.min),
            ];
        }
        else {
            return ((value || 0) - this.min) / (this.max - this.min);
        }
    }
    /** Calculates the value a percentage of the slider corresponds to. */
    _calculateValue(percentage) {
        if (percentage instanceof Array) {
            return [
                this.min + percentage[0] * (this.max - this.min),
                this.min + percentage[1] * (this.max - this.min),
            ];
        }
        else {
            return this.min + percentage * (this.max - this.min);
        }
    }
    /** Return a number between two numbers. */
    _clamp(value, min = 0, max = 1) {
        if (value instanceof Array) {
            return [Math.max(min, Math.min(value[0], max)), Math.max(min, Math.min(value[1], max))];
        }
        else {
            return Math.max(min, Math.min(value, max));
        }
    }
    /**
     * Get the bounding client rect of the slider track element.
     * The track is used rather than the native element to ignore the extra space that the thumb can
     * take up.
     */
    _getSliderDimensions() {
        return this._sliderWrapper ? this._sliderWrapper.nativeElement.getBoundingClientRect() : null;
    }
    /**
     * Focuses the native element.
     * Currently only used to allow a blur event to fire but will be used with keyboard input later.
     */
    _focusHostElement() {
        this._elementRef.nativeElement.focus();
    }
    /** Blurs the native element. */
    _blurHostElement() {
        this._elementRef.nativeElement.blur();
    }
    /** Runs a callback outside of the NgZone, if possible. */
    _runOutsizeZone(fn) {
        // @breaking-change 9.0.0 Remove this function once `_ngZone` is a required parameter.
        this._ngZone ? this._ngZone.runOutsideAngular(fn) : fn();
    }
    /** Runs a callback inside of the NgZone, if possible. */
    _runInsideZone(fn) {
        // @breaking-change 9.0.0 Remove this function once `_ngZone` is a required parameter.
        this._ngZone ? this._ngZone.run(fn) : fn();
    }
    /**
     * Sets the model value. Implemented as part of ControlValueAccessor.
     * @param value
     */
    writeValue(value) {
        this.value = value;
    }
    /**
     * Registers a callback to be triggered when the value has changed.
     * Implemented as part of ControlValueAccessor.
     * @param fn Callback to be registered.
     */
    registerOnChange(fn) {
        this._controlValueAccessorChangeFn = fn;
    }
    /**
     * Registers a callback to be triggered when the component is touched.
     * Implemented as part of ControlValueAccessor.
     * @param fn Callback to be registered.
     */
    registerOnTouched(fn) {
        this.onTouched = fn;
    }
    /**
     * Sets whether the component should be disabled.
     * Implemented as part of ControlValueAccessor.
     * @param isDisabled
     */
    setDisabledState(isDisabled) {
        this.disabled = isDisabled;
    }
    isRangeSlider() {
        return this.value instanceof Array;
    }
    calculateInitialSlideDirection(event) {
        if (!this._sliderDimensions) {
            return;
        }
        const offset = this.vertical ? this._sliderDimensions.top : this._sliderDimensions.left;
        const size = this.vertical ? this._sliderDimensions.height : this._sliderDimensions.width;
        const pointerPosition = getPointerPositionOnPage(event);
        const posComponent = this.vertical ? pointerPosition.y : pointerPosition.x;
        // The exact value is calculated from the event and used to find the closest snap value.
        let percent = Number(this._clamp((posComponent - offset) / size));
        if (this._shouldInvertMouseCoords()) {
            percent = 1 - percent;
        }
        if (percent <=
            this.percent[0] +
                (this.percent[1] - this.percent[0]) / 2) {
            this._currentSliderDir = 'l';
        }
        else {
            this._currentSliderDir = 'r';
        }
    }
}
/** @nocollapse */ MtxSlider.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MtxSlider, deps: [{ token: i0.ElementRef }, { token: i1.FocusMonitor }, { token: i0.ChangeDetectorRef }, { token: i2.Directionality, optional: true }, { token: 'tabindex', attribute: true }, { token: ANIMATION_MODULE_TYPE, optional: true }, { token: i0.NgZone }], target: i0.ɵɵFactoryTarget.Component });
/** @nocollapse */ MtxSlider.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.1", type: MtxSlider, selector: "mtx-slider", inputs: { disabled: "disabled", color: "color", tabIndex: "tabIndex", invert: "invert", max: "max", min: "min", step: "step", thumbLabel: "thumbLabel", tickInterval: "tickInterval", value: "value", displayWith: "displayWith", valueText: "valueText", vertical: "vertical" }, outputs: { change: "change", input: "input", valueChange: "valueChange" }, host: { attributes: { "role": "slider" }, listeners: { "focus": "_onFocus()", "blur": "_onBlur()", "click": "_onClick($event)", "keydown": "_onKeydown($event)", "keyup": "_onKeyup()", "mouseenter": "_onMouseenter()", "selectstart": "$event.preventDefault()" }, properties: { "tabIndex": "tabIndex", "attr.aria-disabled": "disabled", "attr.aria-valuemax": "max", "attr.aria-valuemin": "min", "attr.aria-valuenow": "value", "attr.aria-valuetext": "valueText == null ? displayValue : valueText", "attr.aria-orientation": "vertical ? \"vertical\" : \"horizontal\"", "class.mtx-slider-disabled": "disabled", "class.mtx-slider-has-ticks": "tickInterval", "class.mtx-slider-horizontal": "!vertical", "class.mtx-slider-axis-inverted": "_invertAxis", "class.mtx-slider-sliding": "_isSliding", "class.mtx-slider-thumb-label-showing": "thumbLabel", "class.mtx-slider-vertical": "vertical", "class.mtx-slider-min-value": "_isMinValue", "class.mtx-range-slider": "isRangeSlider()", "class.mtx-slider-hide-last-tick": "disabled || _isMinValue && _thumbGap && _invertAxis", "class._mtx-animation-noopable": "_animationMode === \"NoopAnimations\"" }, classAttribute: "mtx-slider mat-focus-indicator" }, providers: [MTX_SLIDER_VALUE_ACCESSOR], viewQueries: [{ propertyName: "_sliderWrapper", first: true, predicate: ["sliderWrapper"], descendants: true }], exportAs: ["mtxSlider"], usesInheritance: true, ngImport: i0, template: "<div class=\"mtx-slider-wrapper\" #sliderWrapper>\n  <div class=\"mtx-slider-track-wrapper\">\n    <div *ngIf=\"isRangeSlider()\"\n         class=\"mtx-slider-track-background mtx-slider-track-background-left\"\n         [ngStyle]=\"_trackBackgroundStylesLeft\"></div>\n    <div class=\"mtx-slider-track-background mtx-slider-track-background-right\"\n         [ngStyle]=\"_trackBackgroundStylesRight\"></div>\n    <div class=\"mtx-slider-track-fill\" [ngClass]=\"{'mtx-range-slider-fill': isRangeSlider()}\"\n         [ngStyle]=\"_trackFillStyles\"></div>\n  </div>\n  <div class=\"mtx-slider-ticks-container\" [ngStyle]=\"_ticksContainerStyles\">\n    <div class=\"mtx-slider-ticks\" [ngStyle]=\"_ticksStyles\"></div>\n  </div>\n  <div class=\"mtx-slider-thumb-container\" #leftSlider\n       [ngStyle]=\"_thumbContainerStylesLeft\">\n    <div class=\"mtx-slider-focus-ring\"></div>\n    <div class=\"mtx-slider-thumb left\"></div>\n    <div class=\"mtx-slider-thumb-label\">\n      <span class=\"mtx-slider-thumb-label-text\">{{displayValue}}</span>\n    </div>\n  </div>\n  <div *ngIf=\"isRangeSlider()\"\n       class=\"mtx-slider-thumb-container\" #rightSlider\n       [ngStyle]=\"_thumbContainerStylesRight\">\n    <div class=\"mtx-slider-focus-ring\"></div>\n    <div class=\"mtx-slider-thumb right\"></div>\n    <div class=\"mtx-slider-thumb-label\">\n      <span class=\"mtx-slider-thumb-label-text\">{{displayValueRight}}</span>\n    </div>\n  </div>\n</div>\n", styles: [".mtx-slider{display:inline-block;position:relative;box-sizing:border-box;padding:8px;outline:none;vertical-align:middle}.mtx-slider:not(.mtx-slider-disabled):active,.mtx-slider.mtx-slider-sliding:not(.mtx-slider-disabled){cursor:grabbing}.mtx-slider-wrapper{-webkit-print-color-adjust:exact;print-color-adjust:exact;position:absolute}.mtx-slider-track-wrapper{position:absolute;top:0;left:0;overflow:hidden}.mtx-slider-track-fill,.mtx-slider-track-background-left{position:absolute;transform-origin:0 0;transition:transform .4s cubic-bezier(.25,.8,.25,1),background-color .4s cubic-bezier(.25,.8,.25,1)}.mtx-slider-track-background-right{position:absolute;transform-origin:100% 100%;transition:transform .4s cubic-bezier(.25,.8,.25,1),background-color .4s cubic-bezier(.25,.8,.25,1)}.mtx-slider-ticks-container{position:absolute;left:0;top:0;overflow:hidden}.mtx-slider-ticks{-webkit-background-clip:content-box;background-repeat:repeat;background-clip:content-box;box-sizing:border-box;opacity:0;transition:opacity .4s cubic-bezier(.25,.8,.25,1)}.mtx-slider-thumb-container{position:absolute;z-index:1;transition:transform .4s cubic-bezier(.25,.8,.25,1)}.mtx-slider-focus-ring{position:absolute;width:30px;height:30px;border-radius:50%;transform:scale(0);opacity:0;transition:transform .4s cubic-bezier(.25,.8,.25,1),background-color .4s cubic-bezier(.25,.8,.25,1),opacity .4s cubic-bezier(.25,.8,.25,1)}.mtx-slider.cdk-keyboard-focused .mtx-slider-focus-ring,.mtx-slider.cdk-program-focused .mtx-slider-focus-ring{transform:scale(1);opacity:1}.mtx-slider:not(.mtx-slider-disabled,.mtx-slider-sliding) .mtx-slider-thumb-label,.mtx-slider:not(.mtx-slider-disabled,.mtx-slider-sliding) .mtx-slider-thumb{cursor:grab}.mtx-slider-thumb{position:absolute;right:-10px;bottom:-10px;box-sizing:border-box;width:20px;height:20px;border:3px solid transparent;border-radius:50%;transform:scale(.7);transition:transform .4s cubic-bezier(.25,.8,.25,1),background-color .4s cubic-bezier(.25,.8,.25,1),border-color .4s cubic-bezier(.25,.8,.25,1)}.mtx-slider-thumb-label{display:none;align-items:center;justify-content:center;position:absolute;width:28px;height:28px;border-radius:50%;transition:transform .4s cubic-bezier(.25,.8,.25,1),border-radius .4s cubic-bezier(.25,.8,.25,1),background-color .4s cubic-bezier(.25,.8,.25,1)}.cdk-high-contrast-active .mtx-slider-thumb-label{outline:solid 1px}.mtx-slider-thumb-label-text{z-index:1;opacity:0;transition:opacity .4s cubic-bezier(.25,.8,.25,1)}.mtx-slider-sliding .mtx-slider-track-fill,.mtx-slider-sliding .mtx-slider-track-background-left,.mtx-slider-sliding .mtx-slider-track-background-right,.mtx-slider-sliding .mtx-slider-thumb-container{transition-duration:0ms}.mtx-slider-has-ticks .mtx-slider-wrapper:after{content:\"\";position:absolute;border-width:0;border-style:solid;opacity:0;transition:opacity .4s cubic-bezier(.25,.8,.25,1)}.mtx-slider-has-ticks.cdk-focused:not(.mtx-slider-hide-last-tick) .mtx-slider-wrapper:after,.mtx-slider-has-ticks:hover:not(.mtx-slider-hide-last-tick) .mtx-slider-wrapper:after{opacity:1}.mtx-slider-has-ticks.cdk-focused:not(.mtx-slider-disabled) .mtx-slider-ticks,.mtx-slider-has-ticks:hover:not(.mtx-slider-disabled) .mtx-slider-ticks{opacity:1}.mtx-slider-thumb-label-showing .mtx-slider-focus-ring{display:none}.mtx-slider-thumb-label-showing .mtx-slider-thumb-label{display:flex}.mtx-slider-axis-inverted .mtx-slider-track-fill{transform-origin:100% 100%}.mtx-slider-axis-inverted .mtx-slider-track-fill.mtx-range-slider-fill{transform-origin:0 0}.mtx-slider-axis-inverted .mtx-slider-track-background-left{transform-origin:100% 100%}.mtx-slider-axis-inverted .mtx-slider-track-background-right{transform-origin:0 0}.mtx-slider:not(.mtx-slider-disabled).cdk-focused.mtx-slider-thumb-label-showing .mtx-slider-thumb{transform:scale(0)}.mtx-slider:not(.mtx-slider-disabled).cdk-focused .mtx-slider-thumb-label{border-radius:50% 50% 0}.mtx-slider:not(.mtx-slider-disabled).cdk-focused .mtx-slider-thumb-label-text{opacity:1}.mtx-slider:not(.mtx-slider-disabled).cdk-mouse-focused .mtx-slider-thumb,.mtx-slider:not(.mtx-slider-disabled).cdk-touch-focused .mtx-slider-thumb,.mtx-slider:not(.mtx-slider-disabled).cdk-program-focused .mtx-slider-thumb{border-width:2px;transform:scale(1)}.mtx-slider-disabled .mtx-slider-focus-ring{transform:scale(0);opacity:0}.mtx-slider-disabled .mtx-slider-thumb{border-width:4px;transform:scale(.5)}.mtx-slider-disabled .mtx-slider-thumb-label{display:none}.mtx-slider-horizontal{height:48px;min-width:128px}.mtx-slider-horizontal .mtx-slider-wrapper{height:2px;top:23px;left:8px;right:8px}.mtx-slider-horizontal .mtx-slider-wrapper:after{height:2px;border-left-width:2px;right:0;top:0}.mtx-slider-horizontal .mtx-slider-track-wrapper{height:2px;width:100%}.mtx-slider-horizontal .mtx-slider-track-fill{height:2px;width:100%;transform:scaleX(0)}.mtx-slider-horizontal .mtx-slider-track-background-left,.mtx-slider-horizontal .mtx-slider-track-background-right{height:2px;width:100%;transform:scaleX(1)}.mtx-slider-horizontal .mtx-slider-ticks-container{height:2px;width:100%}.cdk-high-contrast-active .mtx-slider-horizontal .mtx-slider-ticks-container{height:0;outline:solid 2px;top:1px}.mtx-slider-horizontal .mtx-slider-ticks{height:2px;width:100%}.mtx-slider-horizontal .mtx-slider-thumb-container{width:100%;height:0;top:50%}.mtx-slider-horizontal .mtx-slider-focus-ring{top:-15px;right:-15px}.mtx-slider-horizontal .mtx-slider-thumb-label{right:-14px;top:-40px;transform:translateY(26px) scale(.01) rotate(45deg)}.mtx-slider-horizontal .mtx-slider-thumb-label-text{transform:rotate(-45deg)}.mtx-slider-horizontal.cdk-focused .mtx-slider-thumb-label{transform:rotate(45deg)}.cdk-high-contrast-active .mtx-slider-horizontal.cdk-focused .mtx-slider-thumb-label,.cdk-high-contrast-active .mtx-slider-horizontal.cdk-focused .mtx-slider-thumb-label-text{transform:none}.mtx-slider-vertical{width:48px;min-height:128px}.mtx-slider-vertical .mtx-slider-wrapper{width:2px;top:8px;bottom:8px;left:23px}.mtx-slider-vertical .mtx-slider-wrapper:after{width:2px;border-top-width:2px;bottom:0;left:0}.mtx-slider-vertical .mtx-slider-track-wrapper{height:100%;width:2px}.mtx-slider-vertical .mtx-slider-track-fill{height:100%;width:2px;transform:scaleY(0)}.mtx-slider-vertical .mtx-slider-track-background-left,.mtx-slider-vertical .mtx-slider-track-background-right{height:100%;width:2px;transform:scaleY(1)}.mtx-slider-vertical .mtx-slider-ticks-container{width:2px;height:100%}.cdk-high-contrast-active .mtx-slider-vertical .mtx-slider-ticks-container{width:0;outline:solid 2px;left:1px}.mtx-slider-vertical .mtx-slider-focus-ring{bottom:-15px;left:-15px}.mtx-slider-vertical .mtx-slider-ticks{width:2px;height:100%}.mtx-slider-vertical .mtx-slider-thumb-container{height:100%;width:0;left:50%}.mtx-slider-vertical .mtx-slider-thumb{-webkit-backface-visibility:hidden;backface-visibility:hidden}.mtx-slider-vertical .mtx-slider-thumb-label{bottom:-14px;left:-40px;transform:translate(26px) scale(.01) rotate(-45deg)}.mtx-slider-vertical .mtx-slider-thumb-label-text{transform:rotate(45deg)}.mtx-slider-vertical.cdk-focused .mtx-slider-thumb-label{transform:rotate(-45deg)}[dir=rtl] .mtx-slider-wrapper:after{left:0;right:auto}[dir=rtl] .mtx-slider-horizontal .mtx-slider-track-fill:not(.mtx-range-slider-fill){transform-origin:100% 100%}[dir=rtl] .mtx-slider-horizontal .mtx-slider-track-background-left{transform-origin:100% 100%}[dir=rtl] .mtx-slider-horizontal .mtx-slider-track-background-right,[dir=rtl] .mtx-slider-horizontal.mtx-slider-axis-inverted .mtx-slider-track-fill,[dir=rtl] .mtx-slider-horizontal.mtx-slider-axis-inverted .mtx-slider-track-background-left{transform-origin:0 0}[dir=rtl] .mtx-slider-horizontal.mtx-slider-axis-inverted .mtx-slider-track-background-right{transform-origin:100% 100%}.mtx-slider._mtx-animation-noopable .mtx-slider-track-fill,.mtx-slider._mtx-animation-noopable .mtx-slider-track-background-left,.mtx-slider._mtx-animation-noopable .mtx-slider-track-background-right,.mtx-slider._mtx-animation-noopable .mtx-slider-ticks,.mtx-slider._mtx-animation-noopable .mtx-slider-thumb-container,.mtx-slider._mtx-animation-noopable .mtx-slider-focus-ring,.mtx-slider._mtx-animation-noopable .mtx-slider-thumb,.mtx-slider._mtx-animation-noopable .mtx-slider-thumb-label,.mtx-slider._mtx-animation-noopable .mtx-slider-thumb-label-text,.mtx-slider._mtx-animation-noopable .mtx-slider-has-ticks .mtx-slider-wrapper:after{transition:none}\n"], dependencies: [{ kind: "directive", type: i3.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i3.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i3.NgStyle, selector: "[ngStyle]", inputs: ["ngStyle"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MtxSlider, decorators: [{
            type: Component,
            args: [{ selector: 'mtx-slider', exportAs: 'mtxSlider', providers: [MTX_SLIDER_VALUE_ACCESSOR], host: {
                        '(focus)': '_onFocus()',
                        '(blur)': '_onBlur()',
                        '(click)': '_onClick($event)',
                        '(keydown)': '_onKeydown($event)',
                        '(keyup)': '_onKeyup()',
                        '(mouseenter)': '_onMouseenter()',
                        // On Safari starting to slide temporarily triggers text selection mode which
                        // show the wrong cursor. We prevent it by stopping the `selectstart` event.
                        '(selectstart)': '$event.preventDefault()',
                        'class': 'mtx-slider mat-focus-indicator',
                        'role': 'slider',
                        '[tabIndex]': 'tabIndex',
                        '[attr.aria-disabled]': 'disabled',
                        '[attr.aria-valuemax]': 'max',
                        '[attr.aria-valuemin]': 'min',
                        '[attr.aria-valuenow]': 'value',
                        // NVDA and Jaws appear to announce the `aria-valuenow` by calculating its percentage based
                        // on its value between `aria-valuemin` and `aria-valuemax`. Due to how decimals are handled,
                        // it can cause the slider to read out a very long value like 0.20000068 if the current value
                        // is 0.2 with a min of 0 and max of 1. We work around the issue by setting `aria-valuetext`
                        // to the same value that we set on the slider's thumb which will be truncated.
                        '[attr.aria-valuetext]': 'valueText == null ? displayValue : valueText',
                        '[attr.aria-orientation]': 'vertical ? "vertical" : "horizontal"',
                        '[class.mtx-slider-disabled]': 'disabled',
                        '[class.mtx-slider-has-ticks]': 'tickInterval',
                        '[class.mtx-slider-horizontal]': '!vertical',
                        '[class.mtx-slider-axis-inverted]': '_invertAxis',
                        '[class.mtx-slider-sliding]': '_isSliding',
                        '[class.mtx-slider-thumb-label-showing]': 'thumbLabel',
                        '[class.mtx-slider-vertical]': 'vertical',
                        '[class.mtx-slider-min-value]': '_isMinValue',
                        '[class.mtx-range-slider]': 'isRangeSlider()',
                        '[class.mtx-slider-hide-last-tick]': 'disabled || _isMinValue && _thumbGap && _invertAxis',
                        '[class._mtx-animation-noopable]': '_animationMode === "NoopAnimations"',
                    }, inputs: ['disabled', 'color', 'tabIndex'], encapsulation: ViewEncapsulation.None, changeDetection: ChangeDetectionStrategy.OnPush, template: "<div class=\"mtx-slider-wrapper\" #sliderWrapper>\n  <div class=\"mtx-slider-track-wrapper\">\n    <div *ngIf=\"isRangeSlider()\"\n         class=\"mtx-slider-track-background mtx-slider-track-background-left\"\n         [ngStyle]=\"_trackBackgroundStylesLeft\"></div>\n    <div class=\"mtx-slider-track-background mtx-slider-track-background-right\"\n         [ngStyle]=\"_trackBackgroundStylesRight\"></div>\n    <div class=\"mtx-slider-track-fill\" [ngClass]=\"{'mtx-range-slider-fill': isRangeSlider()}\"\n         [ngStyle]=\"_trackFillStyles\"></div>\n  </div>\n  <div class=\"mtx-slider-ticks-container\" [ngStyle]=\"_ticksContainerStyles\">\n    <div class=\"mtx-slider-ticks\" [ngStyle]=\"_ticksStyles\"></div>\n  </div>\n  <div class=\"mtx-slider-thumb-container\" #leftSlider\n       [ngStyle]=\"_thumbContainerStylesLeft\">\n    <div class=\"mtx-slider-focus-ring\"></div>\n    <div class=\"mtx-slider-thumb left\"></div>\n    <div class=\"mtx-slider-thumb-label\">\n      <span class=\"mtx-slider-thumb-label-text\">{{displayValue}}</span>\n    </div>\n  </div>\n  <div *ngIf=\"isRangeSlider()\"\n       class=\"mtx-slider-thumb-container\" #rightSlider\n       [ngStyle]=\"_thumbContainerStylesRight\">\n    <div class=\"mtx-slider-focus-ring\"></div>\n    <div class=\"mtx-slider-thumb right\"></div>\n    <div class=\"mtx-slider-thumb-label\">\n      <span class=\"mtx-slider-thumb-label-text\">{{displayValueRight}}</span>\n    </div>\n  </div>\n</div>\n", styles: [".mtx-slider{display:inline-block;position:relative;box-sizing:border-box;padding:8px;outline:none;vertical-align:middle}.mtx-slider:not(.mtx-slider-disabled):active,.mtx-slider.mtx-slider-sliding:not(.mtx-slider-disabled){cursor:grabbing}.mtx-slider-wrapper{-webkit-print-color-adjust:exact;print-color-adjust:exact;position:absolute}.mtx-slider-track-wrapper{position:absolute;top:0;left:0;overflow:hidden}.mtx-slider-track-fill,.mtx-slider-track-background-left{position:absolute;transform-origin:0 0;transition:transform .4s cubic-bezier(.25,.8,.25,1),background-color .4s cubic-bezier(.25,.8,.25,1)}.mtx-slider-track-background-right{position:absolute;transform-origin:100% 100%;transition:transform .4s cubic-bezier(.25,.8,.25,1),background-color .4s cubic-bezier(.25,.8,.25,1)}.mtx-slider-ticks-container{position:absolute;left:0;top:0;overflow:hidden}.mtx-slider-ticks{-webkit-background-clip:content-box;background-repeat:repeat;background-clip:content-box;box-sizing:border-box;opacity:0;transition:opacity .4s cubic-bezier(.25,.8,.25,1)}.mtx-slider-thumb-container{position:absolute;z-index:1;transition:transform .4s cubic-bezier(.25,.8,.25,1)}.mtx-slider-focus-ring{position:absolute;width:30px;height:30px;border-radius:50%;transform:scale(0);opacity:0;transition:transform .4s cubic-bezier(.25,.8,.25,1),background-color .4s cubic-bezier(.25,.8,.25,1),opacity .4s cubic-bezier(.25,.8,.25,1)}.mtx-slider.cdk-keyboard-focused .mtx-slider-focus-ring,.mtx-slider.cdk-program-focused .mtx-slider-focus-ring{transform:scale(1);opacity:1}.mtx-slider:not(.mtx-slider-disabled,.mtx-slider-sliding) .mtx-slider-thumb-label,.mtx-slider:not(.mtx-slider-disabled,.mtx-slider-sliding) .mtx-slider-thumb{cursor:grab}.mtx-slider-thumb{position:absolute;right:-10px;bottom:-10px;box-sizing:border-box;width:20px;height:20px;border:3px solid transparent;border-radius:50%;transform:scale(.7);transition:transform .4s cubic-bezier(.25,.8,.25,1),background-color .4s cubic-bezier(.25,.8,.25,1),border-color .4s cubic-bezier(.25,.8,.25,1)}.mtx-slider-thumb-label{display:none;align-items:center;justify-content:center;position:absolute;width:28px;height:28px;border-radius:50%;transition:transform .4s cubic-bezier(.25,.8,.25,1),border-radius .4s cubic-bezier(.25,.8,.25,1),background-color .4s cubic-bezier(.25,.8,.25,1)}.cdk-high-contrast-active .mtx-slider-thumb-label{outline:solid 1px}.mtx-slider-thumb-label-text{z-index:1;opacity:0;transition:opacity .4s cubic-bezier(.25,.8,.25,1)}.mtx-slider-sliding .mtx-slider-track-fill,.mtx-slider-sliding .mtx-slider-track-background-left,.mtx-slider-sliding .mtx-slider-track-background-right,.mtx-slider-sliding .mtx-slider-thumb-container{transition-duration:0ms}.mtx-slider-has-ticks .mtx-slider-wrapper:after{content:\"\";position:absolute;border-width:0;border-style:solid;opacity:0;transition:opacity .4s cubic-bezier(.25,.8,.25,1)}.mtx-slider-has-ticks.cdk-focused:not(.mtx-slider-hide-last-tick) .mtx-slider-wrapper:after,.mtx-slider-has-ticks:hover:not(.mtx-slider-hide-last-tick) .mtx-slider-wrapper:after{opacity:1}.mtx-slider-has-ticks.cdk-focused:not(.mtx-slider-disabled) .mtx-slider-ticks,.mtx-slider-has-ticks:hover:not(.mtx-slider-disabled) .mtx-slider-ticks{opacity:1}.mtx-slider-thumb-label-showing .mtx-slider-focus-ring{display:none}.mtx-slider-thumb-label-showing .mtx-slider-thumb-label{display:flex}.mtx-slider-axis-inverted .mtx-slider-track-fill{transform-origin:100% 100%}.mtx-slider-axis-inverted .mtx-slider-track-fill.mtx-range-slider-fill{transform-origin:0 0}.mtx-slider-axis-inverted .mtx-slider-track-background-left{transform-origin:100% 100%}.mtx-slider-axis-inverted .mtx-slider-track-background-right{transform-origin:0 0}.mtx-slider:not(.mtx-slider-disabled).cdk-focused.mtx-slider-thumb-label-showing .mtx-slider-thumb{transform:scale(0)}.mtx-slider:not(.mtx-slider-disabled).cdk-focused .mtx-slider-thumb-label{border-radius:50% 50% 0}.mtx-slider:not(.mtx-slider-disabled).cdk-focused .mtx-slider-thumb-label-text{opacity:1}.mtx-slider:not(.mtx-slider-disabled).cdk-mouse-focused .mtx-slider-thumb,.mtx-slider:not(.mtx-slider-disabled).cdk-touch-focused .mtx-slider-thumb,.mtx-slider:not(.mtx-slider-disabled).cdk-program-focused .mtx-slider-thumb{border-width:2px;transform:scale(1)}.mtx-slider-disabled .mtx-slider-focus-ring{transform:scale(0);opacity:0}.mtx-slider-disabled .mtx-slider-thumb{border-width:4px;transform:scale(.5)}.mtx-slider-disabled .mtx-slider-thumb-label{display:none}.mtx-slider-horizontal{height:48px;min-width:128px}.mtx-slider-horizontal .mtx-slider-wrapper{height:2px;top:23px;left:8px;right:8px}.mtx-slider-horizontal .mtx-slider-wrapper:after{height:2px;border-left-width:2px;right:0;top:0}.mtx-slider-horizontal .mtx-slider-track-wrapper{height:2px;width:100%}.mtx-slider-horizontal .mtx-slider-track-fill{height:2px;width:100%;transform:scaleX(0)}.mtx-slider-horizontal .mtx-slider-track-background-left,.mtx-slider-horizontal .mtx-slider-track-background-right{height:2px;width:100%;transform:scaleX(1)}.mtx-slider-horizontal .mtx-slider-ticks-container{height:2px;width:100%}.cdk-high-contrast-active .mtx-slider-horizontal .mtx-slider-ticks-container{height:0;outline:solid 2px;top:1px}.mtx-slider-horizontal .mtx-slider-ticks{height:2px;width:100%}.mtx-slider-horizontal .mtx-slider-thumb-container{width:100%;height:0;top:50%}.mtx-slider-horizontal .mtx-slider-focus-ring{top:-15px;right:-15px}.mtx-slider-horizontal .mtx-slider-thumb-label{right:-14px;top:-40px;transform:translateY(26px) scale(.01) rotate(45deg)}.mtx-slider-horizontal .mtx-slider-thumb-label-text{transform:rotate(-45deg)}.mtx-slider-horizontal.cdk-focused .mtx-slider-thumb-label{transform:rotate(45deg)}.cdk-high-contrast-active .mtx-slider-horizontal.cdk-focused .mtx-slider-thumb-label,.cdk-high-contrast-active .mtx-slider-horizontal.cdk-focused .mtx-slider-thumb-label-text{transform:none}.mtx-slider-vertical{width:48px;min-height:128px}.mtx-slider-vertical .mtx-slider-wrapper{width:2px;top:8px;bottom:8px;left:23px}.mtx-slider-vertical .mtx-slider-wrapper:after{width:2px;border-top-width:2px;bottom:0;left:0}.mtx-slider-vertical .mtx-slider-track-wrapper{height:100%;width:2px}.mtx-slider-vertical .mtx-slider-track-fill{height:100%;width:2px;transform:scaleY(0)}.mtx-slider-vertical .mtx-slider-track-background-left,.mtx-slider-vertical .mtx-slider-track-background-right{height:100%;width:2px;transform:scaleY(1)}.mtx-slider-vertical .mtx-slider-ticks-container{width:2px;height:100%}.cdk-high-contrast-active .mtx-slider-vertical .mtx-slider-ticks-container{width:0;outline:solid 2px;left:1px}.mtx-slider-vertical .mtx-slider-focus-ring{bottom:-15px;left:-15px}.mtx-slider-vertical .mtx-slider-ticks{width:2px;height:100%}.mtx-slider-vertical .mtx-slider-thumb-container{height:100%;width:0;left:50%}.mtx-slider-vertical .mtx-slider-thumb{-webkit-backface-visibility:hidden;backface-visibility:hidden}.mtx-slider-vertical .mtx-slider-thumb-label{bottom:-14px;left:-40px;transform:translate(26px) scale(.01) rotate(-45deg)}.mtx-slider-vertical .mtx-slider-thumb-label-text{transform:rotate(45deg)}.mtx-slider-vertical.cdk-focused .mtx-slider-thumb-label{transform:rotate(-45deg)}[dir=rtl] .mtx-slider-wrapper:after{left:0;right:auto}[dir=rtl] .mtx-slider-horizontal .mtx-slider-track-fill:not(.mtx-range-slider-fill){transform-origin:100% 100%}[dir=rtl] .mtx-slider-horizontal .mtx-slider-track-background-left{transform-origin:100% 100%}[dir=rtl] .mtx-slider-horizontal .mtx-slider-track-background-right,[dir=rtl] .mtx-slider-horizontal.mtx-slider-axis-inverted .mtx-slider-track-fill,[dir=rtl] .mtx-slider-horizontal.mtx-slider-axis-inverted .mtx-slider-track-background-left{transform-origin:0 0}[dir=rtl] .mtx-slider-horizontal.mtx-slider-axis-inverted .mtx-slider-track-background-right{transform-origin:100% 100%}.mtx-slider._mtx-animation-noopable .mtx-slider-track-fill,.mtx-slider._mtx-animation-noopable .mtx-slider-track-background-left,.mtx-slider._mtx-animation-noopable .mtx-slider-track-background-right,.mtx-slider._mtx-animation-noopable .mtx-slider-ticks,.mtx-slider._mtx-animation-noopable .mtx-slider-thumb-container,.mtx-slider._mtx-animation-noopable .mtx-slider-focus-ring,.mtx-slider._mtx-animation-noopable .mtx-slider-thumb,.mtx-slider._mtx-animation-noopable .mtx-slider-thumb-label,.mtx-slider._mtx-animation-noopable .mtx-slider-thumb-label-text,.mtx-slider._mtx-animation-noopable .mtx-slider-has-ticks .mtx-slider-wrapper:after{transition:none}\n"] }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i1.FocusMonitor }, { type: i0.ChangeDetectorRef }, { type: i2.Directionality, decorators: [{
                    type: Optional
                }] }, { type: undefined, decorators: [{
                    type: Attribute,
                    args: ['tabindex']
                }] }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [ANIMATION_MODULE_TYPE]
                }] }, { type: i0.NgZone }]; }, propDecorators: { invert: [{
                type: Input
            }], max: [{
                type: Input
            }], min: [{
                type: Input
            }], step: [{
                type: Input
            }], thumbLabel: [{
                type: Input
            }], tickInterval: [{
                type: Input
            }], value: [{
                type: Input
            }], displayWith: [{
                type: Input
            }], valueText: [{
                type: Input
            }], vertical: [{
                type: Input
            }], change: [{
                type: Output
            }], input: [{
                type: Output
            }], valueChange: [{
                type: Output
            }], _sliderWrapper: [{
                type: ViewChild,
                args: ['sliderWrapper']
            }] } });
/** Returns whether an event is a touch event. */
function isTouchEvent(event) {
    // This function is called for every pixel that the user has dragged so we need it to be
    // as fast as possible. Since we only bind mouse events and touch events, we can assume
    // that if the event's name starts with `t`, it's a touch event.
    return event.type[0] === 't';
}
/** Gets the coordinates of a touch or mouse event relative to the viewport. */
function getPointerPositionOnPage(event) {
    // `touches` will be empty for start/end events so we have to fall back to `changedTouches`.
    const point = isTouchEvent(event) ? event.touches[0] || event.changedTouches[0] : event;
    return { x: point.clientX, y: point.clientY };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2xpZGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vcHJvamVjdHMvZXh0ZW5zaW9ucy9zbGlkZXIvc2xpZGVyLnRzIiwiLi4vLi4vLi4vLi4vcHJvamVjdHMvZXh0ZW5zaW9ucy9zbGlkZXIvc2xpZGVyLmh0bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBRUEsT0FBTyxFQUVMLHFCQUFxQixFQUNyQixvQkFBb0IsR0FFckIsTUFBTSx1QkFBdUIsQ0FBQztBQUMvQixPQUFPLEVBQ0wsVUFBVSxFQUNWLEdBQUcsRUFDSCxJQUFJLEVBQ0osVUFBVSxFQUNWLFNBQVMsRUFDVCxPQUFPLEVBQ1AsV0FBVyxFQUNYLFFBQVEsR0FDVCxNQUFNLHVCQUF1QixDQUFDO0FBQy9CLE9BQU8sRUFBRSwrQkFBK0IsRUFBRSxNQUFNLHVCQUF1QixDQUFDO0FBQ3hFLE9BQU8sRUFDTCxTQUFTLEVBQ1QsdUJBQXVCLEVBRXZCLFNBQVMsRUFFVCxZQUFZLEVBQ1osVUFBVSxFQUNWLE1BQU0sRUFDTixLQUFLLEVBSUwsUUFBUSxFQUNSLE1BQU0sRUFDTixTQUFTLEVBQ1QsaUJBQWlCLEdBQ2xCLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBd0IsaUJBQWlCLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUN6RSxPQUFPLEVBSUwsVUFBVSxFQUNWLGFBQWEsRUFDYixhQUFhLEdBQ2QsTUFBTSx3QkFBd0IsQ0FBQztBQUNoQyxPQUFPLEVBQUUscUJBQXFCLEVBQUUsTUFBTSxzQ0FBc0MsQ0FBQztBQUM3RSxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sTUFBTSxDQUFDOzs7OztBQUVwQyxNQUFNLGtCQUFrQixHQUFHLCtCQUErQixDQUFDLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUM7QUFFL0U7OztHQUdHO0FBQ0gsTUFBTSx3QkFBd0IsR0FBRyxFQUFFLENBQUM7QUFFcEMsZ0RBQWdEO0FBQ2hELE1BQU0sa0JBQWtCLEdBQUcs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QVM7c0JBQWpCLEtBQUs7Z0JBSUYsUUFBUTtzQkFEWCxLQUFLO2dCQVVhLE1BQU07c0JBQXhCLE1BQU07Z0JBR1ksS0FBSztzQkFBdkIsTUFBTTtnQkFPWSxXQUFXO3NCQUE3QixNQUFNO2dCQXVTNkIsY0FBYztzQkFBakQsU0FBUzt1QkFBQyxlQUFlOztBQXVxQjVCLGlEQUFpRDtBQUNqRCxTQUFTLFlBQVksQ0FBQyxLQUE4QjtJQUNsRCx3RkFBd0Y7SUFDeEYsdUZBQXVGO0lBQ3ZGLGdFQUFnRTtJQUNoRSxPQUFPLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDO0FBQy9CLENBQUM7QUFFRCwrRUFBK0U7QUFDL0UsU0FBUyx3QkFBd0IsQ0FBQyxLQUE4QjtJQUM5RCw0RkFBNEY7SUFDNUYsTUFBTSxLQUFLLEdBQUcsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFJLEtBQUssQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQztJQUN4RixPQUFPLEVBQUUsQ0FBQyxFQUFFLEtBQUssQ0FBQyxPQUFPLEVBQUUsQ0FBQyxFQUFFLEtBQUssQ0FBQyxPQUFPLEVBQUUsQ0FBQztBQUNoRCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRm9jdXNNb25pdG9yLCBGb2N1c09yaWdpbiB9IGZyb20gJ0Bhbmd1bGFyL2Nkay9hMTF5JztcbmltcG9ydCB7IERpcmVjdGlvbmFsaXR5IH0gZnJvbSAnQGFuZ3VsYXIvY2RrL2JpZGknO1xuaW1wb3J0IHtcbiAgQm9vbGVhbklucHV0LFxuICBjb2VyY2VCb29sZWFuUHJvcGVydHksXG4gIGNvZXJjZU51bWJlclByb3BlcnR5LFxuICBOdW1iZXJJbnB1dCxcbn0gZnJvbSAnQGFuZ3VsYXIvY2RrL2NvZXJjaW9uJztcbmltcG9ydCB7XG4gIERPV05fQVJST1csXG4gIEVORCxcbiAgSE9NRSxcbiAgTEVGVF9BUlJPVyxcbiAgUEFHRV9ET1dOLFxuICBQQUdFX1VQLFxuICBSSUdIVF9BUlJPVyxcbiAgVVBfQVJST1csXG59IGZyb20gJ0Bhbmd1bGFyL2Nkay9rZXljb2Rlcyc7XG5pbXBvcnQgeyBub3JtYWxpemVQYXNzaXZlTGlzdGVuZXJPcHRpb25zIH0gZnJvbSAnQGFuZ3VsYXIvY2RrL3BsYXRmb3JtJztcbmltcG9ydCB7XG4gIEF0dHJpYnV0ZSxcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIENoYW5nZURldGVjdG9yUmVmLFxuICBDb21wb25lbnQsXG4gIEVsZW1lbnRSZWYsXG4gIEV2ZW50RW1pdHRlcixcbiAgZm9yd2FyZFJlZixcbiAgSW5qZWN0LFxuICBJbnB1dCxcbiAgTmdab25lLFxuICBPbkRlc3Ryb3ksXG4gIE9uSW5pdCxcbiAgT3B0aW9uYWwsXG4gIE91dHB1dCxcbiAgVmlld0NoaWxkLFxuICBWaWV3RW5jYXBzdWxhdGlvbixcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBDb250cm9sVmFsdWVBY2Nlc3NvciwgTkdfVkFMVUVfQUNDRVNTT1IgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQge1xuICBDYW5Db2xvcixcbiAgQ2FuRGlzYWJsZSxcbiAgSGFzVGFiSW5kZXgsXG4gIG1peGluQ29sb3IsXG4gIG1peGluRGlzYWJsZWQsXG4gIG1peGluVGFiSW5kZXgsXG59IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2NvcmUnO1xuaW1wb3J0IHsgQU5JTUFUSU9OX01PRFVMRV9UWVBFIH0gZnJvbSAnQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3Nlci9hbmltYXRpb25zJztcbmltcG9ydCB7IFN1YnNjcmlwdGlvbiB9IGZyb20gJ3J4anMnO1xuXG5jb25zdCBhY3RpdmVFdmVudE9wdGlvbnMgPSBub3JtYWxpemVQYXNzaXZlTGlzdGVuZXJPcHRpb25zKHsgcGFzc2l2ZTogZmFsc2UgfSk7XG5cbi8qKlxuICogVmlzdWFsbHksIGEgMzBweCBzZXBhcmF0aW9uIGJldHdlZW4gdGljayBtYXJrcyBsb29rcyBiZXN0LiBUaGlzIGlzIHZlcnkgc3ViamVjdGl2ZSBidXQgaXQgaXNcbiAqIHRoZSBkZWZhdWx0IHNlcGFyYXRpb24gd2UgY2hvc2UuXG4gKi9cbmNvbnN0IE1JTl9BVVRPX1RJQ0tfU0VQQVJBVElPTiA9IDMwO1xuXG4vKiogVGhlIHRodW1iIGdhcCBzaXplIGZvciBhIGRpc2FibGVkIHNsaWRlci4gKi9cbmNvbnN0IERJU0FCTEVEX1RIVU1CX0dBUCA9IDA7XG5cbi8qKiBUaGUgdGh1bWIgZ2FwIHNpemUgZm9yIGEgbm9uLWFjdGl2ZSBzbGlkZXIgYXQgaXRzIG1pbmltdW0gdmFsdWUuICovXG5jb25zdCBNSU5fVkFMVUVfTk9OQUNUSVZFX1RIVU1CX0dBUCA9IDc7XG5cbi8qKiBUaGUgdGh1bWIgZ2FwIHNpemUgZm9yIGFuIGFjdGl2ZSBzbGlkZXIgYXQgaXRzIG1pbmltdW0gdmFsdWUuICovXG5jb25zdCBNSU5fVkFMVUVfQUNUSVZFX1RIVU1CX0dBUCA9IDEwO1xuXG4vKipcbiAqIFByb3ZpZGVyIEV4cHJlc3Npb24gdGhhdCBhbGxvd3MgbXR4LXNsaWRlciB0byByZWdpc3RlciBhcyBhIENvbnRyb2xWYWx1ZUFjY2Vzc29yLlxuICogVGhpcyBhbGxvd3MgaXQgdG8gc3VwcG9ydCBbKG5nTW9kZWwpXSBhbmQgW2Zvcm1Db250cm9sXS5cbiAqL1xuZXhwb3J0IGNvbnN0IE1UWF9TTElERVJfVkFMVUVfQUNDRVNTT1I6IGFueSA9IHtcbiAgcHJvdmlkZTogTkdfVkFMVUVfQUNDRVNTT1IsXG4gIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IE10eFNsaWRlciksXG4gIG11bHRpOiB0cnVlLFxufTtcblxuLyoqIEEgc2ltcGxlIGNoYW5nZSBldmVudCBlbWl0dGVkIGJ5IHRoZSBNdHhTbGlkZXIgY29tcG9uZW50LiAqL1xuZXhwb3J0IGNsYXNzIE10eFNsaWRlckNoYW5nZSB7XG4gIC8qKiBUaGUgTXR4U2xpZGVyIHRoYXQgY2hhbmdlZC4gKi9cbiAgc291cmNlITogTXR4U2xpZGVyO1xuXG4gIC8qKiBUaGUgbmV3IHZhbHVlIG9mIHRoZSBzb3VyY2Ugc2xpZGVyLiAqL1xuICB2YWx1ZSE6IG51bWJlciB8IG51bWJlcltdIHwgbnVsbDtcbn1cblxuLy8gQm9pbGVycGxhdGUgZm9yIGFwcGx5aW5nIG1peGlucyB0byBNdHhTbGlkZXIuXG4vKiogQGRvY3MtcHJpdmF0ZSAqL1xuY29uc3QgX010eFNsaWRlckJhc2UgPSBtaXhpblRhYkluZGV4KFxuICBtaXhpbkNvbG9yKFxuICAgIG1peGluRGlzYWJsZWQoXG4gICAgICBjbGFzcyB7XG4gICAgICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBfZWxlbWVudFJlZjogRWxlbWVudFJlZikge31cbiAgICAgIH1cbiAgICApLFxuICAgICdhY2NlbnQnXG4gIClcbik7XG5cbi8qKlxuICogQWxsb3dzIHVzZXJzIHRvIHNlbGVjdCBmcm9tIGEgcmFuZ2Ugb2YgdmFsdWVzIGJ5IG1vdmluZyB0aGUgc2xpZGVyIHRodW1iLiBJdCBpcyBzaW1pbGFyIGluXG4gKiBiZWhhdmlvciB0byB0aGUgbmF0aXZlIGA8aW5wdXQgdHlwZT1cInJhbmdlXCI+YCBlbGVtZW50LlxuICovXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdtdHgtc2xpZGVyJyxcbiAgZXhwb3J0QXM6ICdtdHhTbGlkZXInLFxuICBwcm92aWRlcnM6IFtNVFhfU0xJREVSX1ZBTFVFX0FDQ0VTU09SXSxcbiAgaG9zdDoge1xuICAgICcoZm9jdXMpJzogJ19vbkZvY3VzKCknLFxuICAgICcoYmx1ciknOiAnX29uQmx1cigpJyxcbiAgICAnKGNsaWNrKSc6ICdfb25DbGljaygkZXZlbnQpJyxcbiAgICAnKGtleWRvd24pJzogJ19vbktleWRvd24oJGV2ZW50KScsXG4gICAgJyhrZXl1cCknOiAnX29uS2V5dXAoKScsXG4gICAgJyhtb3VzZWVudGVyKSc6ICdfb25Nb3VzZWVudGVyKCknLFxuXG4gICAgLy8gT24gU2FmYXJpIHN0YXJ0aW5nIHRvIHNsaWRlIHRlbXBvcmFyaWx5IHRyaWdnZXJzIHRleHQgc2VsZWN0aW9uIG1vZGUgd2hpY2hcbiAgICAvLyBzaG93IHRoZSB3cm9uZyBjdXJzb3IuIFdlIHByZXZlbnQgaXQgYnkgc3RvcHBpbmcgdGhlIGBzZWxlY3RzdGFydGAgZXZlbnQuXG4gICAgJyhzZWxlY3RzdGFydCknOiAnJGV2ZW50LnByZXZlbnREZWZhdWx0KCknLFxuICAgICdjbGFzcyc6ICdtdHgtc2xpZGVyIG1hdC1mb2N1cy1pbmRpY2F0b3InLFxuICAgICdyb2xlJzogJ3NsaWRlcicsXG4gICAgJ1t0YWJJbmRleF0nOiAndGFiSW5kZXgnLFxuICAgICdbYXR0ci5hcmlhLWRpc2FibGVkXSc6ICdkaXNhYmxlZCcsXG4gICAgJ1thdHRyLmFyaWEtdmFsdWVtYXhdJzogJ21heCcsXG4gICAgJ1thdHRyLmFyaWEtdmFsdWVtaW5dJzogJ21pbicsXG4gICAgJ1thdHRyLmFyaWEtdmFsdWVub3ddJzogJ3ZhbHVlJyxcblxuICAgIC8vIE5WREEgYW5kIEphd3MgYXBwZWFyIHRvIGFubm91bmNlIHRoZSBgYXJpYS12YWx1ZW5vd2AgYnkgY2FsY3VsYXRpbmcgaXRzIHBlcmNlbnRhZ2UgYmFzZWRcbiAgICAvLyBvbiBpdHMgdmFsdWUgYmV0d2VlbiBgYXJpYS12YWx1ZW1pbmAgYW5kIGBhcmlhLXZhbHVlbWF4YC4gRHVlIHRvIGhvdyBkZWNpbWFscyBhcmUgaGFuZGxlZCxcbiAgICAvLyBpdCBjYW4gY2F1c2UgdGhlIHNsaWRlciB0byByZWFkIG91dCBhIHZlcnkgbG9uZyB2YWx1ZSBsaWtlIDAuMjAwMDAwNjggaWYgdGhlIGN1cnJlbnQgdmFsdWVcbiAgICAvLyBpcyAwLjIgd2l0aCBhIG1pbiBvZiAwIGFuZCBtYXggb2YgMS4gV2Ugd29yayBhcm91bmQgdGhlIGlzc3VlIGJ5IHNldHRpbmcgYGFyaWEtdmFsdWV0ZXh0YFxuICAgIC8vIHRvIHRoZSBzYW1lIHZhbHVlIHRoYXQgd2Ugc2V0IG9uIHRoZSBzbGlkZXIncyB0aHVtYiB3aGljaCB3aWxsIGJlIHRydW5jYXRlZC5cbiAgICAnW2F0dHIuYXJpYS12YWx1ZXRleHRdJzogJ3ZhbHVlVGV4dCA9PSBudWxsID8gZGlzcGxheVZhbHVlIDogdmFsdWVUZXh0JyxcbiAgICAnW2F0dHIuYXJpYS1vcmllbnRhdGlvbl0nOiAndmVydGljYWwgPyBcInZlcnRpY2FsXCIgOiBcImhvcml6b250YWxcIicsXG4gICAgJ1tjbGFzcy5tdHgtc2xpZGVyLWRpc2FibGVkXSc6ICdkaXNhYmxlZCcsXG4gICAgJ1tjbGFzcy5tdHgtc2xpZGVyLWhhcy10aWNrc10nOiAndGlja0ludGVydmFsJyxcbiAgICAnW2NsYXNzLm10eC1zbGlkZXItaG9yaXpvbnRhbF0nOiAnIXZlcnRpY2FsJyxcbiAgICAnW2NsYXNzLm10eC1zbGlkZXItYXhpcy1pbnZlcnRlZF0nOiAnX2ludmVydEF4aXMnLFxuICAgICdbY2xhc3MubXR4LXNsaWRlci1zbGlkaW5nXSc6ICdfaXNTbGlkaW5nJyxcbiAgICAnW2NsYXNzLm10eC1zbGlkZXItdGh1bWItbGFiZWwtc2hvd2luZ10nOiAndGh1bWJMYWJlbCcsXG4gICAgJ1tjbGFzcy5tdHgtc2xpZGVyLXZlcnRpY2FsXSc6ICd2ZXJ0aWNhbCcsXG4gICAgJ1tjbGFzcy5tdHgtc2xpZGVyLW1pbi12YWx1ZV0nOiAnX2lzTWluVmFsdWUnLFxuICAgICdbY2xhc3MubXR4LXJhbmdlLXNsaWRlcl0nOiAnaXNSYW5nZVNsaWRlcigpJyxcbiAgICAnW2NsYXNzLm10eC1zbGlkZXItaGlkZS1sYXN0LXRpY2tdJzogJ2Rpc2FibGVkIHx8IF9pc01pblZhbHVlICYmIF90aHVtYkdhcCAmJiBfaW52ZXJ0QXhpcycsXG4gICAgJ1tjbGFzcy5fbXR4LWFuaW1hdGlvbi1ub29wYWJsZV0nOiAnX2FuaW1hdGlvbk1vZGUgPT09IFwiTm9vcEFuaW1hdGlvbnNcIicsXG4gIH0sXG4gIHRlbXBsYXRlVXJsOiAnc2xpZGVyLmh0bWwnLFxuICBzdHlsZVVybHM6IFsnc2xpZGVyLnNjc3MnXSxcbiAgaW5wdXRzOiBbJ2Rpc2FibGVkJywgJ2NvbG9yJywgJ3RhYkluZGV4J10sXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxufSlcbmV4cG9ydCBjbGFzcyBNdHhTbGlkZXJcbiAgZXh0ZW5kcyBfTXR4U2xpZGVyQmFzZVxuICBpbXBsZW1lbnRzIENvbnRyb2xWYWx1ZUFjY2Vzc29yLCBPbkRlc3Ryb3ksIENhbkRpc2FibGUsIENhbkNvbG9yLCBPbkluaXQsIEhhc1RhYkluZGV4XG57XG4gIC8qKiBXaGV0aGVyIHRoZSBzbGlkZXIgaXMgaW52ZXJ0ZWQuICovXG4gIEBJbnB1dCgpXG4gIGdldCBpbnZlcnQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX2ludmVydDtcbiAgfVxuICBzZXQgaW52ZXJ0KHZhbHVlOiBib29sZWFuKSB7XG4gICAgdGhpcy5faW52ZXJ0ID0gY29lcmNlQm9vbGVhblByb3BlcnR5KHZhbHVlKTtcbiAgfVxuICBwcml2YXRlIF9pbnZlcnQgPSBmYWxzZTtcblxuICAvKiogVGhlIG1heGltdW0gdmFsdWUgdGhhdCB0aGUgc2xpZGVyIGNhbiBoYXZlLiAqL1xuICBASW5wdXQoKVxuICBnZXQgbWF4KCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMuX21heDtcbiAgfVxuICBzZXQgbWF4KHY6IG51bWJlcikge1xuICAgIHRoaXMuX21heCA9IGNvZXJjZU51bWJlclByb3BlcnR5KHYsIHRoaXMuX21heCk7XG4gICAgdGhpcy5fcGVyY2VudCA9IHRoaXMuX2NhbGN1bGF0ZVBlcmNlbnRhZ2UodGhpcy5fdmFsdWUpO1xuXG4gICAgLy8gU2luY2UgdGhpcyBhbHNvIG1vZGlmaWVzIHRoZSBwZXJjZW50YWdlLCB3ZSBuZWVkIHRvIGxldCB0aGUgY2hhbmdlIGRldGVjdGlvbiBrbm93LlxuICAgIHRoaXMuX2NoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpO1xuICB9XG4gIHByaXZhdGUgX21heDogbnVtYmVyID0gMTAwO1xuXG4gIC8qKiBUaGUgbWluaW11bSB2YWx1ZSB0aGF0IHRoZSBzbGlkZXIgY2FuIGhhdmUuICovXG4gIEBJbnB1dCgpXG4gIGdldCBtaW4oKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5fbWluO1xuICB9XG4gIHNldCBtaW4odjogbnVtYmVyKSB7XG4gICAgdGhpcy5fbWluID0gY29lcmNlTnVtYmVyUHJvcGVydHkodiwgdGhpcy5fbWluKTtcblxuICAgIC8vIElmIHRoZSB2YWx1ZSB3YXNuJ3QgZXhwbGljaXRseSBzZXQgYnkgdGhlIHVzZXIsIHNldCBpdCB0byB0aGUgbWluLlxuICAgIGlmICh0aGlzLl92YWx1ZSA9PT0gbnVsbCkge1xuICAgICAgdGhpcy52YWx1ZSA9IHRoaXMuX21pbjtcbiAgICB9XG4gICAgdGhpcy5fcGVyY2VudCA9IHRoaXMuX2NhbGN1bGF0ZVBlcmNlbnRhZ2UodGhpcy5fdmFsdWUpO1xuXG4gICAgLy8gU2luY2UgdGhpcyBhbHNvIG1vZGlmaWVzIHRoZSBwZXJjZW50YWdlLCB3ZSBuZWVkIHRvIGxldCB0aGUgY2hhbmdlIGRldGVjdGlvbiBrbm93LlxuICAgIHRoaXMuX2NoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpO1xuICB9XG4gIHByaXZhdGUgX21pbjogbnVtYmVyID0gMDtcblxuICAvKiogVGhlIHZhbHVlcyBhdCB3aGljaCB0aGUgdGh1bWIgd2lsbCBzbmFwLiAqL1xuICBASW5wdXQoKVxuICBnZXQgc3RlcCgpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLl9zdGVwO1xuICB9XG4gIHNldCBzdGVwKHY6IG51bWJlcikge1xuICAgIHRoaXMuX3N0ZXAgPSBjb2VyY2VOdW1iZXJQcm9wZXJ0eSh2LCB0aGlzLl9zdGVwKTtcblxuICAgIGlmICh0aGlzLl9zdGVwICUgMSAhPT0gMCkge1xuICAgICAgdGhpcy5fcm91bmRUb0RlY2ltYWwgPSB0aGlzLl9zdGVwLnRvU3RyaW5nKCkuc3BsaXQoJy4nKS5wb3AoKSEubGVuZ3RoO1xuICAgIH1cblxuICAgIC8vIFNpbmNlIHRoaXMgY291bGQgbW9kaWZ5IHRoZSBsYWJlbCwgd2UgbmVlZCB0byBub3RpZnkgdGhlIGNoYW5nZSBkZXRlY3Rpb24uXG4gICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCk7XG4gIH1cbiAgcHJpdmF0ZSBfc3RlcDogbnVtYmVyID0gMTtcblxuICAvKiogV2hldGhlciBvciBub3QgdG8gc2hvdyB0aGUgdGh1bWIgbGFiZWwuICovXG4gIEBJbnB1dCgpXG4gIGdldCB0aHVtYkxhYmVsKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl90aHVtYkxhYmVsO1xuICB9XG4gIHNldCB0aHVtYkxhYmVsKHZhbHVlOiBib29sZWFuKSB7XG4gICAgdGhpcy5fdGh1bWJMYWJlbCA9IGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSh2YWx1ZSk7XG4gIH1cbiAgcHJpdmF0ZSBfdGh1bWJMYWJlbDogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIC8qKlxuICAgKiBIb3cgb2Z0ZW4gdG8gc2hvdyB0aWNrcy4gUmVsYXRpdmUgdG8gdGhlIHN0ZXAgc28gdGhhdCBhIHRpY2sgYWx3YXlzIGFwcGVhcnMgb24gYSBzdGVwLlxuICAgKiBFeDogVGljayBpbnRlcnZhbCBvZiA0IHdpdGggYSBzdGVwIG9mIDMgd2lsbCBkcmF3IGEgdGljayBldmVyeSA0IHN0ZXBzIChldmVyeSAxMiB2YWx1ZXMpLlxuICAgKi9cbiAgQElucHV0KClcbiAgZ2V0IHRpY2tJbnRlcnZhbCgpIHtcbiAgICByZXR1cm4gdGhpcy5fdGlja0ludGVydmFsO1xuICB9XG4gIHNldCB0aWNrSW50ZXJ2YWwodmFsdWU6ICdhdXRvJyB8IG51bWJlcikge1xuICAgIGlmICh2YWx1ZSA9PT0gJ2F1dG8nKSB7XG4gICAgICB0aGlzLl90aWNrSW50ZXJ2YWwgPSAnYXV0byc7XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInIHx8IHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHRoaXMuX3RpY2tJbnRlcnZhbCA9IGNvZXJjZU51bWJlclByb3BlcnR5KHZhbHVlLCB0aGlzLl90aWNrSW50ZXJ2YWwgYXMgbnVtYmVyKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fdGlja0ludGVydmFsID0gMDtcbiAgICB9XG4gIH1cbiAgcHJpdmF0ZSBfdGlja0ludGVydmFsOiAnYXV0bycgfCBudW1iZXIgPSAwO1xuXG4gIC8qKiBWYWx1ZSBvZiB0aGUgc2xpZGVyLiAqL1xuICBASW5wdXQoKVxuICBnZXQgdmFsdWUoKTogbnVtYmVyIHwgbnVtYmVyW10gfCBudWxsIHtcbiAgICAvLyBJZiB0aGUgdmFsdWUgbmVlZHMgdG8gYmUgcmVhZCBhbmQgaXQgaXMgc3RpbGwgdW5pbml0aWFsaXplZCwgaW5pdGlhbGl6ZSBpdCB0byB0aGUgbWluLlxuICAgIGlmICh0aGlzLl92YWx1ZSA9PT0gbnVsbCkge1xuICAgICAgdGhpcy52YWx1ZSA9IHRoaXMuX21pbjtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuX3ZhbHVlO1xuICB9XG4gIHNldCB2YWx1ZSh2OiBudW1iZXIgfCBudW1iZXJbXSB8IG51bGwpIHtcbiAgICBpZiAoXG4gICAgICB2ICE9PSB0aGlzLl92YWx1ZSB8fFxuICAgICAgKHYgaW5zdGFuY2VvZiBBcnJheSAmJlxuICAgICAgICB0aGlzLl92YWx1ZSAhPSBudWxsICYmXG4gICAgICAgICh2WzBdICE9PSAodGhpcy5fdmFsdWUgYXMgbnVtYmVyW10pWzBdIHx8IHZbMV0gIT09ICh0aGlzLl92YWx1ZSBhcyBudW1iZXJbXSlbMV0pKVxuICAgICkge1xuICAgICAgbGV0IHZhbHVlOiBudW1iZXIgfCBudW1iZXJbXSB8IG51bGwgPSBudWxsO1xuICAgICAgaWYgKHYgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgICB2YWx1ZSA9IFtjb2VyY2VOdW1iZXJQcm9wZXJ0eSh2WzBdKSwgY29lcmNlTnVtYmVyUHJvcGVydHkodlsxXSldO1xuICAgICAgICB2YWx1ZSA9IFtNYXRoLm1pbih2YWx1ZVswXSwgdmFsdWVbMV0pLCBNYXRoLm1heCh2YWx1ZVsxXSwgdmFsdWVbMF0pXTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhbHVlID0gY29lcmNlTnVtYmVyUHJvcGVydHkodik7XG4gICAgICB9XG5cbiAgICAgIC8vIFdoaWxlIGluY3JlbWVudGluZyBieSBhIGRlY2ltYWwgd2UgY2FuIGVuZCB1cCB3aXRoIHZhbHVlcyBsaWtlIDMzLjMwMDAwMDAwMDAwMDAwNC5cbiAgICAgIC8vIFRydW5jYXRlIGl0IHRvIGVuc3VyZSB0aGF0IGl0IG1hdGNoZXMgdGhlIGxhYmVsIGFuZCB0byBtYWtlIGl0IGVhc2llciB0byB3b3JrIHdpdGguXG4gICAgICBpZiAodGhpcy5fcm91bmRUb0RlY2ltYWwpIHtcbiAgICAgICAgaWYgKHYgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgICAgIHZhbHVlID0gW1xuICAgICAgICAgICAgcGFyc2VGbG9hdCgodmFsdWUgYXMgbnVtYmVyW10pWzBdLnRvRml4ZWQodGhpcy5fcm91bmRUb0RlY2ltYWwpKSxcbiAgICAgICAgICAgIHBhcnNlRmxvYXQoKHZhbHVlIGFzIG51bWJlcltdKVsxXS50b0ZpeGVkKHRoaXMuX3JvdW5kVG9EZWNpbWFsKSksXG4gICAgICAgICAgXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB2YWx1ZSA9IHBhcnNlRmxvYXQoTnVtYmVyKHZhbHVlKS50b0ZpeGVkKHRoaXMuX3JvdW5kVG9EZWNpbWFsKSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgdGhpcy5fdmFsdWUgPSB2YWx1ZTtcbiAgICAgIHRoaXMuX3BlcmNlbnQgPSB0aGlzLl9jYWxjdWxhdGVQZXJjZW50YWdlKHRoaXMuX3ZhbHVlKTtcblxuICAgICAgLy8gU2luY2UgdGhpcyBhbHNvIG1vZGlmaWVzIHRoZSBwZXJjZW50YWdlLCB3ZSBuZWVkIHRvIGxldCB0aGUgY2hhbmdlIGRldGVjdGlvbiBrbm93LlxuICAgICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCk7XG4gICAgfVxuICB9XG4gIHByaXZhdGUgX3ZhbHVlOiBudW1iZXIgfCBudW1iZXJbXSB8IG51bGwgPSBudWxsO1xuXG4gIC8qKlxuICAgKiBGdW5jdGlvbiB0aGF0IHdpbGwgYmUgdXNlZCB0byBmb3JtYXQgdGhlIHZhbHVlIGJlZm9yZSBpdCBpcyBkaXNwbGF5ZWRcbiAgICogaW4gdGhlIHRodW1iIGxhYmVsLiBDYW4gYmUgdXNlZCB0byBmb3JtYXQgdmVyeSBsYXJnZSBudW1iZXIgaW4gb3JkZXJcbiAgICogZm9yIHRoZW0gdG8gZml0IGludG8gdGhlIHNsaWRlciB0aHVtYi5cbiAgICovXG4gIEBJbnB1dCgpIGRpc3BsYXlXaXRoITogKHZhbHVlOiBudW1iZXIgfCBudWxsKSA9PiBzdHJpbmcgfCBudW1iZXI7XG5cbiAgLyoqIFRleHQgY29ycmVzcG9uZGluZyB0byB0aGUgc2xpZGVyJ3MgdmFsdWUuIFVzZWQgcHJpbWFyaWx5IGZvciBpbXByb3ZlZCBhY2Nlc3NpYmlsaXR5LiAqL1xuICBASW5wdXQoKSB2YWx1ZVRleHQhOiBzdHJpbmc7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIHNsaWRlciBpcyB2ZXJ0aWNhbC4gKi9cbiAgQElucHV0KClcbiAgZ2V0IHZlcnRpY2FsKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl92ZXJ0aWNhbDtcbiAgfVxuICBzZXQgdmVydGljYWwodmFsdWU6IGJvb2xlYW4pIHtcbiAgICB0aGlzLl92ZXJ0aWNhbCA9IGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSh2YWx1ZSk7XG4gIH1cbiAgcHJpdmF0ZSBfdmVydGljYWwgPSBmYWxzZTtcblxuICAvKiogRXZlbnQgZW1pdHRlZCB3aGVuIHRoZSBzbGlkZXIgdmFsdWUgaGFzIGNoYW5nZWQuICovXG4gIEBPdXRwdXQoKSByZWFkb25seSBjaGFuZ2U6IEV2ZW50RW1pdHRlcjxNdHhTbGlkZXJDaGFuZ2U+ID0gbmV3IEV2ZW50RW1pdHRlcjxNdHhTbGlkZXJDaGFuZ2U+KCk7XG5cbiAgLyoqIEV2ZW50IGVtaXR0ZWQgd2hlbiB0aGUgc2xpZGVyIHRodW1iIG1vdmVzLiAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgaW5wdXQ6IEV2ZW50RW1pdHRlcjxNdHhTbGlkZXJDaGFuZ2U+ID0gbmV3IEV2ZW50RW1pdHRlcjxNdHhTbGlkZXJDaGFuZ2U+KCk7XG5cbiAgLyoqXG4gICAqIEVtaXRzIHdoZW4gdGhlIHJhdyB2YWx1ZSBvZiB0aGUgc2xpZGVyIGNoYW5nZXMuIFRoaXMgaXMgaGVyZSBwcmltYXJpbHlcbiAgICogdG8gZmFjaWxpdGF0ZSB0aGUgdHdvLXdheSBiaW5kaW5nIGZvciB0aGUgYHZhbHVlYCBpbnB1dC5cbiAgICogQGRvY3MtcHJpdmF0ZVxuICAgKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IHZhbHVlQ2hhbmdlOiBFdmVudEVtaXR0ZXI8bnVtYmVyIHwgbnVtYmVyW10gfCBudWxsPiA9IG5ldyBFdmVudEVtaXR0ZXI8XG4gICAgbnVtYmVyIHwgbnVtYmVyW10gfCBudWxsXG4gID4oKTtcblxuICAvKiogVGhlIHZhbHVlIHRvIGJlIHVzZWQgZm9yIGRpc3BsYXkgcHVycG9zZXMuICovXG4gIGdldCBkaXNwbGF5VmFsdWUoKTogc3RyaW5nIHwgbnVtYmVyIHtcbiAgICBpZiAodGhpcy52YWx1ZSA9PSBudWxsKSB7XG4gICAgICByZXR1cm4gJyc7XG4gICAgfVxuICAgIGlmICh0aGlzLmRpc3BsYXlXaXRoKSB7XG4gICAgICBpZiAodGhpcy52YWx1ZSBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICAgIHJldHVybiB0aGlzLmRpc3BsYXlXaXRoKHRoaXMudmFsdWVbMF0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZGlzcGxheVdpdGgodGhpcy52YWx1ZSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gTm90ZSB0aGF0IHRoaXMgY291bGQgYmUgaW1wcm92ZWQgZnVydGhlciBieSByb3VuZGluZyBzb21ldGhpbmcgbGlrZSAwLjk5OSB0byAxIG9yXG4gICAgLy8gMC44OTkgdG8gMC45LCBob3dldmVyIGl0IGlzIHZlcnkgcGVyZm9ybWFuY2Ugc2Vuc2l0aXZlLCBiZWNhdXNlIGl0IGdldHMgY2FsbGVkIG9uXG4gICAgLy8gZXZlcnkgY2hhbmdlIGRldGVjdGlvbiBjeWNsZS5cbiAgICBpZiAodGhpcy52YWx1ZSBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICBpZiAoXG4gICAgICAgIHRoaXMuX3JvdW5kVG9EZWNpbWFsICYmXG4gICAgICAgIHRoaXMudmFsdWUgJiZcbiAgICAgICAgKHRoaXMudmFsdWVbMF0gJSAxICE9PSAwIHx8IHRoaXMudmFsdWVbMV0gJSAxICE9PSAwKVxuICAgICAgKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnZhbHVlWzBdLnRvRml4ZWQodGhpcy5fcm91bmRUb0RlY2ltYWwpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAodGhpcy5fcm91bmRUb0RlY2ltYWwgJiYgdGhpcy52YWx1ZSAmJiB0aGlzLnZhbHVlICUgMSAhPT0gMCkge1xuICAgICAgICByZXR1cm4gdGhpcy52YWx1ZS50b0ZpeGVkKHRoaXMuX3JvdW5kVG9EZWNpbWFsKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAodGhpcy52YWx1ZSBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICByZXR1cm4gdGhpcy52YWx1ZVswXSB8fCAwO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy52YWx1ZSB8fCAwO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBUaGUgdmFsdWUgdG8gYmUgdXNlZCBmb3IgZGlzcGxheSBwdXJwb3Nlcy4gKi9cbiAgZ2V0IGRpc3BsYXlWYWx1ZVJpZ2h0KCk6IHN0cmluZyB8IG51bWJlciB7XG4gICAgaWYgKHRoaXMudmFsdWUgPT0gbnVsbCkge1xuICAgICAgcmV0dXJuICcnO1xuICAgIH1cbiAgICBpZiAodGhpcy5kaXNwbGF5V2l0aCkge1xuICAgICAgcmV0dXJuIHRoaXMuZGlzcGxheVdpdGgoKHRoaXMudmFsdWUgYXMgbnVtYmVyW10pWzFdKTtcbiAgICB9XG5cbiAgICAvLyBOb3RlIHRoYXQgdGhpcyBjb3VsZCBiZSBpbXByb3ZlZCBmdXJ0aGVyIGJ5IHJvdW5kaW5nIHNvbWV0aGluZyBsaWtlIDAuOTk5IHRvIDEgb3JcbiAgICAvLyAwLjg5OSB0byAwLjksIGhvd2V2ZXIgaXQgaXMgdmVyeSBwZXJmb3JtYW5jZSBzZW5zaXRpdmUsIGJlY2F1c2UgaXQgZ2V0cyBjYWxsZWQgb25cbiAgICAvLyBldmVyeSBjaGFuZ2UgZGV0ZWN0aW9uIGN5Y2xlLlxuICAgIGlmIChcbiAgICAgIHRoaXMuX3JvdW5kVG9EZWNpbWFsICYmXG4gICAgICB0aGlzLnZhbHVlICYmXG4gICAgICB0aGlzLnZhbHVlICE9IG51bGwgJiZcbiAgICAgICh0aGlzLnZhbHVlIGFzIG51bWJlcltdKVsxXSAlIDEgIT09IDBcbiAgICApIHtcbiAgICAgIHJldHVybiAodGhpcy52YWx1ZSBhcyBudW1iZXJbXSlbMV0udG9GaXhlZCh0aGlzLl9yb3VuZFRvRGVjaW1hbCk7XG4gICAgfVxuXG4gICAgcmV0dXJuICh0aGlzLnZhbHVlIGFzIG51bWJlcltdKVsxXSB8fCAwO1xuICB9XG5cbiAgLyoqIHNldCBmb2N1cyB0byB0aGUgaG9zdCBlbGVtZW50ICovXG4gIGZvY3VzKCkge1xuICAgIHRoaXMuX2ZvY3VzSG9zdEVsZW1lbnQoKTtcbiAgfVxuXG4gIC8qKiBibHVyIHRoZSBob3N0IGVsZW1lbnQgKi9cbiAgYmx1cigpIHtcbiAgICB0aGlzLl9ibHVySG9zdEVsZW1lbnQoKTtcbiAgfVxuXG4gIC8qKiBvblRvdWNoIGZ1bmN0aW9uIHJlZ2lzdGVyZWQgdmlhIHJlZ2lzdGVyT25Ub3VjaCAoQ29udHJvbFZhbHVlQWNjZXNzb3IpLiAqL1xuICBvblRvdWNoZWQ6ICgpID0+IGFueSA9ICgpID0+IHt9O1xuXG4gIC8qKiBUaGUgcGVyY2VudGFnZSBvZiB0aGUgc2xpZGVyIHRoYXQgY29pbmNpZGVzIHdpdGggdGhlIHZhbHVlLiAqL1xuICBnZXQgcGVyY2VudCgpOiBudW1iZXIgfCBudW1iZXJbXSB7XG4gICAgcmV0dXJuIHRoaXMuX2NsYW1wKHRoaXMuX3BlcmNlbnQpO1xuICB9XG5cbiAgcHJpdmF0ZSBfcGVyY2VudDogbnVtYmVyIHwgbnVtYmVyW10gPSAwO1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIG9yIG5vdCB0aGUgdGh1bWIgaXMgc2xpZGluZy5cbiAgICogVXNlZCB0byBkZXRlcm1pbmUgaWYgdGhlcmUgc2hvdWxkIGJlIGEgdHJhbnNpdGlvbiBmb3IgdGhlIHRodW1iIGFuZCBmaWxsIHRyYWNrLlxuICAgKi9cbiAgX2lzU2xpZGluZzogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIG9yIG5vdCB0aGUgc2xpZGVyIGlzIGFjdGl2ZSAoY2xpY2tlZCBvciBzbGlkaW5nKS5cbiAgICogVXNlZCB0byBzaHJpbmsgYW5kIGdyb3cgdGhlIHRodW1iIGFzIGFjY29yZGluZyB0byB0aGUgTWF0ZXJpYWwgRGVzaWduIHNwZWMuXG4gICAqL1xuICBfaXNBY3RpdmU6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAvKipcbiAgICogV2hldGhlciB0aGUgYXhpcyBvZiB0aGUgc2xpZGVyIGlzIGludmVydGVkLlxuICAgKiAoaS5lLiB3aGV0aGVyIG1vdmluZyB0aGUgdGh1bWIgaW4gdGhlIHBvc2l0aXZlIHggb3IgeSBkaXJlY3Rpb24gZGVjcmVhc2VzIHRoZSBzbGlkZXInc1xuICAgKiAgdmFsdWUpLlxuICAgKi9cbiAgZ2V0IF9pbnZlcnRBeGlzKCkge1xuICAgIC8vIFN0YW5kYXJkIG5vbi1pbnZlcnRlZCBtb2RlIGZvciBhIHZlcnRpY2FsIHNsaWRlciBzaG91bGQgYmUgZHJhZ2dpbmcgdGhlIHRodW1iIGZyb20gYm90dG9tXG4gICAgLy8gdG8gdG9wLiBIb3dldmVyIGZyb20gYSB5LWF4aXMgc3RhbmRwb2ludCB0aGlzIGlzIGludmVydGVkLlxuICAgIHJldHVybiB0aGlzLnZlcnRpY2FsID8gIXRoaXMuaW52ZXJ0IDogdGhpcy5pbnZlcnQ7XG4gIH1cblxuICAvKiogV2hldGhlciB0aGUgc2xpZGVyIGlzIGF0IGl0cyBtaW5pbXVtIHZhbHVlLiAqL1xuICBnZXQgX2lzTWluVmFsdWUoKSB7XG4gICAgaWYgKHRoaXMudmFsdWUgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgcmV0dXJuICh0aGlzLnBlcmNlbnQgYXMgbnVtYmVyW10pWzBdID09PSAwO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5wZXJjZW50ID09PSAwO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgYW1vdW50IG9mIHNwYWNlIHRvIGxlYXZlIGJldHdlZW4gdGhlIHNsaWRlciB0aHVtYiBhbmQgdGhlIHRyYWNrIGZpbGwgJiB0cmFjayBiYWNrZ3JvdW5kXG4gICAqIGVsZW1lbnRzLlxuICAgKi9cbiAgZ2V0IF90aHVtYkdhcCgpIHtcbiAgICBpZiAodGhpcy5kaXNhYmxlZCkge1xuICAgICAgcmV0dXJuIERJU0FCTEVEX1RIVU1CX0dBUDtcbiAgICB9XG4gICAgaWYgKHRoaXMuX2lzTWluVmFsdWUgJiYgIXRoaXMudGh1bWJMYWJlbCkge1xuICAgICAgcmV0dXJuIHRoaXMuX2lzQWN0aXZlID8gTUlOX1ZBTFVFX0FDVElWRV9USFVNQl9HQVAgOiBNSU5fVkFMVUVfTk9OQUNUSVZFX1RIVU1CX0dBUDtcbiAgICB9XG4gICAgcmV0dXJuIDA7XG4gIH1cblxuICAvKiogQ1NTIHN0eWxlcyBmb3IgdGhlIHRyYWNrIGJhY2tncm91bmQgZWxlbWVudC4gKi9cbiAgZ2V0IF90cmFja0JhY2tncm91bmRTdHlsZXNMZWZ0KCk6IHsgW2tleTogc3RyaW5nXTogc3RyaW5nIH0ge1xuICAgIGNvbnN0IGF4aXMgPSB0aGlzLnZlcnRpY2FsID8gJ1knIDogJ1gnO1xuICAgIGxldCBzY2FsZTogc3RyaW5nID0gJyc7XG4gICAgaWYgKHRoaXMucGVyY2VudCBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICBzY2FsZSA9IHRoaXMudmVydGljYWwgPyBgMSwgJHt0aGlzLnBlcmNlbnRbMF19LCAxYCA6IGAke3RoaXMucGVyY2VudFswXX0sIDEsIDFgO1xuICAgIH0gZWxzZSB7XG4gICAgICBzY2FsZSA9IHRoaXMudmVydGljYWwgPyBgMSwgJHt0aGlzLnBlcmNlbnR9LCAxYCA6IGAke3RoaXMucGVyY2VudH0sIDEsIDFgO1xuICAgIH1cbiAgICBjb25zdCBzaWduID0gdGhpcy5fc2hvdWxkSW52ZXJ0TW91c2VDb29yZHMoKSA/ICcnIDogJy0nO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIC8vIHNjYWxlM2QgYXZvaWRzIHNvbWUgcmVuZGVyaW5nIGlzc3VlcyBpbiBDaHJvbWUuIFNlZSAjMTIwNzEuXG4gICAgICB0cmFuc2Zvcm06IGB0cmFuc2xhdGUke2F4aXN9KCR7c2lnbn0ke3RoaXMuX3RodW1iR2FwfXB4KSBzY2FsZTNkKCR7c2NhbGV9KWAsXG4gICAgfTtcbiAgfVxuXG4gIGdldCBfdHJhY2tCYWNrZ3JvdW5kU3R5bGVzUmlnaHQoKTogeyBba2V5OiBzdHJpbmddOiBzdHJpbmcgfSB7XG4gICAgY29uc3QgYXhpcyA9IHRoaXMudmVydGljYWwgPyAnWScgOiAnWCc7XG4gICAgbGV0IHNjYWxlOiBzdHJpbmcgPSAnJztcbiAgICBpZiAodGhpcy5wZXJjZW50IGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgIHNjYWxlID0gdGhpcy52ZXJ0aWNhbCA/IGAxLCAkezEgLSB0aGlzLnBlcmNlbnRbMV19LCAxYCA6IGAkezEgLSB0aGlzLnBlcmNlbnRbMV19LCAxLCAxYDtcbiAgICB9IGVsc2Uge1xuICAgICAgc2NhbGUgPSB0aGlzLnZlcnRpY2FsID8gYDEsICR7MSAtIHRoaXMucGVyY2VudH0sIDFgIDogYCR7MSAtIHRoaXMucGVyY2VudH0sIDEsIDFgO1xuICAgIH1cbiAgICBjb25zdCBzaWduID0gdGhpcy5fc2hvdWxkSW52ZXJ0TW91c2VDb29yZHMoKSA/ICctJyA6ICcnO1xuICAgIHJldHVybiB7XG4gICAgICAvLyBzY2FsZTNkIGF2b2lkcyBzb21lIHJlbmRlcmluZyBpc3N1ZXMgaW4gQ2hyb21lLiBTZWUgIzEyMDcxLlxuICAgICAgdHJhbnNmb3JtOiBgdHJhbnNsYXRlJHtheGlzfSgke3NpZ259JHt0aGlzLl90aHVtYkdhcH1weCkgc2NhbGUzZCgke3NjYWxlfSlgLFxuICAgIH07XG4gIH1cblxuICAvKiogQ1NTIHN0eWxlcyBmb3IgdGhlIHRyYWNrIGZpbGwgZWxlbWVudC4gKi9cbiAgZ2V0IF90cmFja0ZpbGxTdHlsZXMoKTogeyBba2V5OiBzdHJpbmddOiBzdHJpbmcgfSB7XG4gICAgY29uc3QgYXhpcyA9IHRoaXMudmVydGljYWwgPyAnWScgOiAnWCc7XG4gICAgbGV0IHNjYWxlOiBzdHJpbmcgPSAnJztcbiAgICBpZiAodGhpcy5wZXJjZW50IGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgIHNjYWxlID0gdGhpcy52ZXJ0aWNhbFxuICAgICAgICA/IGAxLCAke3RoaXMucGVyY2VudFsxXSAtIHRoaXMucGVyY2VudFswXX0sIDFgXG4gICAgICAgIDogYCR7dGhpcy5wZXJjZW50WzFdIC0gdGhpcy5wZXJjZW50WzBdfSwgMSwgMWA7XG4gICAgfSBlbHNlIHtcbiAgICAgIHNjYWxlID0gdGhpcy52ZXJ0aWNhbCA/IGAxLCAke3RoaXMucGVyY2VudH0sIDFgIDogYCR7dGhpcy5wZXJjZW50fSwgMSwgMWA7XG4gICAgfVxuXG4gICAgY29uc3QgaW52ZXJ0T2Zmc2V0ID1cbiAgICAgIHRoaXMuX2dldERpcmVjdGlvbigpID09PSAncnRsJyAmJiAhdGhpcy52ZXJ0aWNhbCA/ICF0aGlzLl9pbnZlcnRBeGlzIDogdGhpcy5faW52ZXJ0QXhpcztcbiAgICBsZXQgb2Zmc2V0OiBudW1iZXIgPSAwO1xuICAgIGlmICh0aGlzLnBlcmNlbnQgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgb2Zmc2V0ID0gKGludmVydE9mZnNldCA/IDEgLSB0aGlzLnBlcmNlbnRbMV0gOiB0aGlzLnBlcmNlbnRbMF0pICogMTAwO1xuICAgIH0gZWxzZSB7XG4gICAgICBvZmZzZXQgPSAwO1xuICAgIH1cbiAgICBjb25zdCBzaWduID0gdGhpcy5fc2hvdWxkSW52ZXJ0TW91c2VDb29yZHMoKSA/ICcnIDogJy0nO1xuXG4gICAgaWYgKHRoaXMuaXNSYW5nZVNsaWRlcigpKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICAvLyBzY2FsZTNkIGF2b2lkcyBzb21lIHJlbmRlcmluZyBpc3N1ZXMgaW4gQ2hyb21lLiBTZWUgIzEyMDcxLlxuICAgICAgICB0cmFuc2Zvcm06IGB0cmFuc2xhdGUke2F4aXN9KCR7b2Zmc2V0fSUpIHNjYWxlM2QoJHtzY2FsZX0pYCxcbiAgICAgIH07XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIC8vIHNjYWxlM2QgYXZvaWRzIHNvbWUgcmVuZGVyaW5nIGlzc3VlcyBpbiBDaHJvbWUuIFNlZSAjMTIwNzEuXG4gICAgICAgIHRyYW5zZm9ybTogYHRyYW5zbGF0ZSR7YXhpc30oJHtzaWdufSR7dGhpcy5fdGh1bWJHYXB9cHgpIHNjYWxlM2QoJHtzY2FsZX0pYCxcbiAgICAgIH07XG4gICAgfVxuICB9XG5cbiAgLyoqIENTUyBzdHlsZXMgZm9yIHRoZSB0aWNrcyBjb250YWluZXIgZWxlbWVudC4gKi9cbiAgZ2V0IF90aWNrc0NvbnRhaW5lclN0eWxlcygpOiB7IFtrZXk6IHN0cmluZ106IHN0cmluZyB9IHtcbiAgICBjb25zdCBheGlzID0gdGhpcy52ZXJ0aWNhbCA/ICdZJyA6ICdYJztcbiAgICAvLyBGb3IgYSBob3Jpem9udGFsIHNsaWRlciBpbiBSVEwgbGFuZ3VhZ2VzIHdlIHB1c2ggdGhlIHRpY2tzIGNvbnRhaW5lciBvZmYgdGhlIGxlZnQgZWRnZVxuICAgIC8vIGluc3RlYWQgb2YgdGhlIHJpZ2h0IGVkZ2UgdG8gYXZvaWQgY2F1c2luZyBhIGhvcml6b250YWwgc2Nyb2xsYmFyIHRvIGFwcGVhci5cbiAgICBjb25zdCBzaWduID0gIXRoaXMudmVydGljYWwgJiYgdGhpcy5fZ2V0RGlyZWN0aW9uKCkgPT09ICdydGwnID8gJycgOiAnLSc7XG4gICAgY29uc3Qgb2Zmc2V0ID0gKHRoaXMuX3RpY2tJbnRlcnZhbFBlcmNlbnQgLyAyKSAqIDEwMDtcbiAgICByZXR1cm4ge1xuICAgICAgdHJhbnNmb3JtOiBgdHJhbnNsYXRlJHtheGlzfSgke3NpZ259JHtvZmZzZXR9JSlgLFxuICAgIH07XG4gIH1cblxuICAvKiogQ1NTIHN0eWxlcyBmb3IgdGhlIHRpY2tzIGVsZW1lbnQuICovXG4gIGdldCBfdGlja3NTdHlsZXMoKTogeyBba2V5OiBzdHJpbmddOiBzdHJpbmcgfSB7XG4gICAgY29uc3QgdGlja1NpemUgPSB0aGlzLl90aWNrSW50ZXJ2YWxQZXJjZW50ICogMTAwO1xuICAgIGNvbnN0IGJhY2tncm91bmRTaXplID0gdGhpcy52ZXJ0aWNhbCA/IGAycHggJHt0aWNrU2l6ZX0lYCA6IGAke3RpY2tTaXplfSUgMnB4YDtcbiAgICBjb25zdCBheGlzID0gdGhpcy52ZXJ0aWNhbCA/ICdZJyA6ICdYJztcbiAgICAvLyBEZXBlbmRpbmcgb24gdGhlIGRpcmVjdGlvbiB3ZSBwdXNoZWQgdGhlIHRpY2tzIGNvbnRhaW5lciwgcHVzaCB0aGUgdGlja3MgdGhlIG9wcG9zaXRlXG4gICAgLy8gZGlyZWN0aW9uIHRvIHJlLWNlbnRlciB0aGVtIGJ1dCBjbGlwIG9mZiB0aGUgZW5kIGVkZ2UuIEluIFJUTCBsYW5ndWFnZXMgd2UgbmVlZCB0byBmbGlwXG4gICAgLy8gdGhlIHRpY2tzIDE4MCBkZWdyZWVzIHNvIHdlJ3JlIHJlYWxseSBjdXR0aW5nIG9mZiB0aGUgZW5kIGVkZ2UgYWJkIG5vdCB0aGUgc3RhcnQuXG4gICAgY29uc3Qgc2lnbiA9ICF0aGlzLnZlcnRpY2FsICYmIHRoaXMuX2dldERpcmVjdGlvbigpID09PSAncnRsJyA/ICctJyA6ICcnO1xuICAgIGNvbnN0IHJvdGF0ZSA9ICF0aGlzLnZlcnRpY2FsICYmIHRoaXMuX2dldERpcmVjdGlvbigpID09PSAncnRsJyA/ICcgcm90YXRlKDE4MGRlZyknIDogJyc7XG4gICAgY29uc3Qgc3R5bGVzOiB7IFtrZXk6IHN0cmluZ106IHN0cmluZyB9ID0ge1xuICAgICAgYmFja2dyb3VuZFNpemUsXG4gICAgICAvLyBXaXRob3V0IHRyYW5zbGF0ZVogdGlja3Mgc29tZXRpbWVzIGppdHRlciBhcyB0aGUgc2xpZGVyIG1vdmVzIG9uIENocm9tZSAmIEZpcmVmb3guXG4gICAgICB0cmFuc2Zvcm06IGB0cmFuc2xhdGVaKDApIHRyYW5zbGF0ZSR7YXhpc30oJHtzaWdufSR7dGlja1NpemUgLyAyfSUpJHtyb3RhdGV9YCxcbiAgICB9O1xuXG4gICAgaWYgKHRoaXMuX2lzTWluVmFsdWUgJiYgdGhpcy5fdGh1bWJHYXApIHtcbiAgICAgIGNvbnN0IHNpZGUgPSB0aGlzLnZlcnRpY2FsXG4gICAgICAgID8gdGhpcy5faW52ZXJ0QXhpc1xuICAgICAgICAgID8gJ0JvdHRvbSdcbiAgICAgICAgICA6ICdUb3AnXG4gICAgICAgIDogdGhpcy5faW52ZXJ0QXhpc1xuICAgICAgICA/ICdSaWdodCdcbiAgICAgICAgOiAnTGVmdCc7XG4gICAgICBzdHlsZXNbYHBhZGRpbmcke3NpZGV9YF0gPSBgJHt0aGlzLl90aHVtYkdhcH1weGA7XG4gICAgfVxuXG4gICAgcmV0dXJuIHN0eWxlcztcbiAgfVxuXG4gIGdldCBfdGh1bWJDb250YWluZXJTdHlsZXNMZWZ0KCk6IHsgW2tleTogc3RyaW5nXTogc3RyaW5nIH0ge1xuICAgIGNvbnN0IGF4aXMgPSB0aGlzLnZlcnRpY2FsID8gJ1knIDogJ1gnO1xuICAgIC8vIEZvciBhIGhvcml6b250YWwgc2xpZGVyIGluIFJUTCBsYW5ndWFnZXMgd2UgcHVzaCB0aGUgdGh1bWIgY29udGFpbmVyIG9mZiB0aGUgbGVmdCBlZGdlXG4gICAgLy8gaW5zdGVhZCBvZiB0aGUgcmlnaHQgZWRnZSB0byBhdm9pZCBjYXVzaW5nIGEgaG9yaXpvbnRhbCBzY3JvbGxiYXIgdG8gYXBwZWFyLlxuICAgIGNvbnN0IGludmVydE9mZnNldCA9XG4gICAgICB0aGlzLl9nZXREaXJlY3Rpb24oKSA9PT0gJ3J0bCcgJiYgIXRoaXMudmVydGljYWwgPyAhdGhpcy5faW52ZXJ0QXhpcyA6IHRoaXMuX2ludmVydEF4aXM7XG4gICAgbGV0IG9mZnNldDogbnVtYmVyID0gMDtcbiAgICBpZiAodGhpcy5wZXJjZW50IGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgIG9mZnNldCA9IChpbnZlcnRPZmZzZXQgPyB0aGlzLnBlcmNlbnRbMF0gOiAxIC0gdGhpcy5wZXJjZW50WzBdKSAqIDEwMDtcbiAgICB9IGVsc2Uge1xuICAgICAgb2Zmc2V0ID0gKGludmVydE9mZnNldCA/IHRoaXMucGVyY2VudCA6IDEgLSB0aGlzLnBlcmNlbnQpICogMTAwO1xuICAgIH1cbiAgICByZXR1cm4ge1xuICAgICAgdHJhbnNmb3JtOiBgdHJhbnNsYXRlJHtheGlzfSgtJHtvZmZzZXR9JSlgLFxuICAgIH07XG4gIH1cblxuICBnZXQgX3RodW1iQ29udGFpbmVyU3R5bGVzUmlnaHQoKTogeyBba2V5OiBzdHJpbmddOiBzdHJpbmcgfSB7XG4gICAgY29uc3QgYXhpcyA9IHRoaXMudmVydGljYWwgPyAnWScgOiAnWCc7XG4gICAgLy8gRm9yIGEgaG9yaXpvbnRhbCBzbGlkZXIgaW4gUlRMIGxhbmd1YWdlcyB3ZSBwdXNoIHRoZSB0aHVtYiBjb250YWluZXIgb2ZmIHRoZSBsZWZ0IGVkZ2VcbiAgICAvLyBpbnN0ZWFkIG9mIHRoZSByaWdodCBlZGdlIHRvIGF2b2lkIGNhdXNpbmcgYSBob3Jpem9udGFsIHNjcm9sbGJhciB0byBhcHBlYXIuXG4gICAgY29uc3QgaW52ZXJ0T2Zmc2V0ID1cbiAgICAgIHRoaXMuX2dldERpcmVjdGlvbigpID09PSAncnRsJyAmJiAhdGhpcy52ZXJ0aWNhbCA/ICF0aGlzLl9pbnZlcnRBeGlzIDogdGhpcy5faW52ZXJ0QXhpcztcbiAgICBsZXQgb2Zmc2V0OiBudW1iZXIgPSAwO1xuICAgIGlmICh0aGlzLnBlcmNlbnQgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgb2Zmc2V0ID0gKGludmVydE9mZnNldCA/IHRoaXMucGVyY2VudFsxXSA6IDEgLSB0aGlzLnBlcmNlbnRbMV0pICogMTAwO1xuICAgIH0gZWxzZSB7XG4gICAgICBvZmZzZXQgPSAoaW52ZXJ0T2Zmc2V0ID8gdGhpcy5wZXJjZW50IDogMSAtIHRoaXMucGVyY2VudCkgKiAxMDA7XG4gICAgfVxuICAgIHJldHVybiB7XG4gICAgICB0cmFuc2Zvcm06IGB0cmFuc2xhdGUke2F4aXN9KC0ke29mZnNldH0lKWAsXG4gICAgfTtcbiAgfVxuXG4gIC8qKiBUaGUgc2l6ZSBvZiBhIHRpY2sgaW50ZXJ2YWwgYXMgYSBwZXJjZW50YWdlIG9mIHRoZSBzaXplIG9mIHRoZSB0cmFjay4gKi9cbiAgcHJpdmF0ZSBfdGlja0ludGVydmFsUGVyY2VudDogbnVtYmVyID0gMDtcblxuICAvKiogVGhlIGRpbWVuc2lvbnMgb2YgdGhlIHNsaWRlci4gKi9cbiAgcHJpdmF0ZSBfc2xpZGVyRGltZW5zaW9uczogQ2xpZW50UmVjdCB8IG51bGwgPSBudWxsO1xuXG4gIHByaXZhdGUgX2NvbnRyb2xWYWx1ZUFjY2Vzc29yQ2hhbmdlRm46ICh2YWx1ZTogYW55KSA9PiB2b2lkID0gKCkgPT4ge307XG5cbiAgLyoqIERlY2ltYWwgcGxhY2VzIHRvIHJvdW5kIHRvLCBiYXNlZCBvbiB0aGUgc3RlcCBhbW91bnQuICovXG4gIHByaXZhdGUgX3JvdW5kVG9EZWNpbWFsITogbnVtYmVyO1xuXG4gIC8qKiBTdWJzY3JpcHRpb24gdG8gdGhlIERpcmVjdGlvbmFsaXR5IGNoYW5nZSBFdmVudEVtaXR0ZXIuICovXG4gIHByaXZhdGUgX2RpckNoYW5nZVN1YnNjcmlwdGlvbiA9IFN1YnNjcmlwdGlvbi5FTVBUWTtcblxuICAvKiogVGhlIHZhbHVlIG9mIHRoZSBzbGlkZXIgd2hlbiB0aGUgc2xpZGUgc3RhcnQgZXZlbnQgZmlyZXMuICovXG4gIHByaXZhdGUgX3ZhbHVlT25TbGlkZVN0YXJ0ITogbnVtYmVyIHwgbnVtYmVyW10gfCBudWxsO1xuXG4gIC8qKiBQb3NpdGlvbiBvZiB0aGUgcG9pbnRlciB3aGVuIHRoZSBkcmFnZ2luZyBzdGFydGVkLiAqL1xuICBwcml2YXRlIF9wb2ludGVyUG9zaXRpb25PblN0YXJ0ITogeyB4OiBudW1iZXI7IHk6IG51bWJlciB9IHwgbnVsbDtcblxuICAvKiogUmVmZXJlbmNlIHRvIHRoZSBpbm5lciBzbGlkZXIgd3JhcHBlciBlbGVtZW50LiAqL1xuICBAVmlld0NoaWxkKCdzbGlkZXJXcmFwcGVyJykgcHJpdmF0ZSBfc2xpZGVyV3JhcHBlciE6IEVsZW1lbnRSZWY7XG5cbiAgLyoqIFRoZSBzbGlkZXIgdGh1bWIgd2hpY2ggaXMgY3VycmVudGx5IHVzZWQgKGxlZnQgb3IgcmlnaHQpICovXG4gIHByaXZhdGUgX2N1cnJlbnRTbGlkZXJEaXIgPSAnbCc7XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgbW91c2UgZXZlbnRzIHNob3VsZCBiZSBjb252ZXJ0ZWQgdG8gYSBzbGlkZXIgcG9zaXRpb24gYnkgY2FsY3VsYXRpbmcgdGhlaXIgZGlzdGFuY2VcbiAgICogZnJvbSB0aGUgcmlnaHQgb3IgYm90dG9tIGVkZ2Ugb2YgdGhlIHNsaWRlciBhcyBvcHBvc2VkIHRvIHRoZSB0b3Agb3IgbGVmdC5cbiAgICovXG4gIHByaXZhdGUgX3Nob3VsZEludmVydE1vdXNlQ29vcmRzKCkge1xuICAgIHJldHVybiB0aGlzLl9nZXREaXJlY3Rpb24oKSA9PT0gJ3J0bCcgJiYgIXRoaXMudmVydGljYWwgPyAhdGhpcy5faW52ZXJ0QXhpcyA6IHRoaXMuX2ludmVydEF4aXM7XG4gIH1cblxuICAvKiogVGhlIGxhbmd1YWdlIGRpcmVjdGlvbiBmb3IgdGhpcyBzbGlkZXIgZWxlbWVudC4gKi9cbiAgcHJpdmF0ZSBfZ2V0RGlyZWN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLl9kaXIgJiYgdGhpcy5fZGlyLnZhbHVlID09PSAncnRsJyA/ICdydGwnIDogJ2x0cic7XG4gIH1cblxuICBjb25zdHJ1Y3RvcihcbiAgICBlbGVtZW50UmVmOiBFbGVtZW50UmVmLFxuICAgIHByaXZhdGUgX2ZvY3VzTW9uaXRvcjogRm9jdXNNb25pdG9yLFxuICAgIHByaXZhdGUgX2NoYW5nZURldGVjdG9yUmVmOiBDaGFuZ2VEZXRlY3RvclJlZixcbiAgICBAT3B0aW9uYWwoKSBwcml2YXRlIF9kaXI6IERpcmVjdGlvbmFsaXR5LFxuICAgIEBBdHRyaWJ1dGUoJ3RhYmluZGV4JykgdGFiSW5kZXg6IHN0cmluZyxcbiAgICAvLyBAYnJlYWtpbmctY2hhbmdlIDcuMC4wIGBfYW5pbWF0aW9uTW9kZWAgcGFyYW1ldGVyIHRvIGJlIG1hZGUgcmVxdWlyZWQuXG4gICAgQE9wdGlvbmFsKCkgQEluamVjdChBTklNQVRJT05fTU9EVUxFX1RZUEUpIHB1YmxpYyBfYW5pbWF0aW9uTW9kZT86IHN0cmluZyxcbiAgICBwcml2YXRlIF9uZ1pvbmU/OiBOZ1pvbmVcbiAgKSB7XG4gICAgc3VwZXIoZWxlbWVudFJlZik7XG5cbiAgICB0aGlzLnRhYkluZGV4ID0gcGFyc2VJbnQodGFiSW5kZXgsIDEwKSB8fCAwO1xuXG4gICAgdGhpcy5fcnVuT3V0c2l6ZVpvbmUoKCkgPT4ge1xuICAgICAgY29uc3QgZWxlbWVudCA9IGVsZW1lbnRSZWYubmF0aXZlRWxlbWVudDtcbiAgICAgIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgdGhpcy5fcG9pbnRlckRvd24sIGFjdGl2ZUV2ZW50T3B0aW9ucyk7XG4gICAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCB0aGlzLl9wb2ludGVyRG93biwgYWN0aXZlRXZlbnRPcHRpb25zKTtcbiAgICB9KTtcbiAgfVxuXG4gIG5nT25Jbml0KCkge1xuICAgIHRoaXMuX2ZvY3VzTW9uaXRvci5tb25pdG9yKHRoaXMuX2VsZW1lbnRSZWYsIHRydWUpLnN1YnNjcmliZSgob3JpZ2luOiBGb2N1c09yaWdpbikgPT4ge1xuICAgICAgdGhpcy5faXNBY3RpdmUgPSAhIW9yaWdpbiAmJiBvcmlnaW4gIT09ICdrZXlib2FyZCc7XG4gICAgICB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5kZXRlY3RDaGFuZ2VzKCk7XG4gICAgfSk7XG4gICAgaWYgKHRoaXMuX2Rpcikge1xuICAgICAgdGhpcy5fZGlyQ2hhbmdlU3Vic2NyaXB0aW9uID0gdGhpcy5fZGlyLmNoYW5nZS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIGNvbnN0IGVsZW1lbnQgPSB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQ7XG4gICAgZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCB0aGlzLl9wb2ludGVyRG93biwgYWN0aXZlRXZlbnRPcHRpb25zKTtcbiAgICBlbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCB0aGlzLl9wb2ludGVyRG93biwgYWN0aXZlRXZlbnRPcHRpb25zKTtcbiAgICB0aGlzLl9yZW1vdmVHbG9iYWxFdmVudHMoKTtcbiAgICB0aGlzLl9mb2N1c01vbml0b3Iuc3RvcE1vbml0b3JpbmcodGhpcy5fZWxlbWVudFJlZik7XG4gICAgdGhpcy5fZGlyQ2hhbmdlU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gIH1cblxuICBfb25Nb3VzZWVudGVyKCkge1xuICAgIGlmICh0aGlzLmRpc2FibGVkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gV2Ugc2F2ZSB0aGUgZGltZW5zaW9ucyBvZiB0aGUgc2xpZGVyIGhlcmUgc28gd2UgY2FuIHVzZSB0aGVtIHRvIHVwZGF0ZSB0aGUgc3BhY2luZyBvZiB0aGVcbiAgICAvLyB0aWNrcyBhbmQgZGV0ZXJtaW5lIHdoZXJlIG9uIHRoZSBzbGlkZXIgY2xpY2sgYW5kIHNsaWRlIGV2ZW50cyBoYXBwZW4uXG4gICAgdGhpcy5fc2xpZGVyRGltZW5zaW9ucyA9IHRoaXMuX2dldFNsaWRlckRpbWVuc2lvbnMoKTtcbiAgICB0aGlzLl91cGRhdGVUaWNrSW50ZXJ2YWxQZXJjZW50KCk7XG4gIH1cblxuICBfb25DbGljayhldmVudDogTW91c2VFdmVudCkge1xuICAgIGlmICh0aGlzLmRpc2FibGVkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgbGV0IG9sZFZhbHVlO1xuICAgIGlmICh0aGlzLnZhbHVlIGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgIG9sZFZhbHVlID0gW3RoaXMudmFsdWVbMF0sIHRoaXMudmFsdWVbMV1dO1xuICAgIH0gZWxzZSB7XG4gICAgICBvbGRWYWx1ZSA9IHRoaXMudmFsdWU7XG4gICAgfVxuXG4gICAgdGhpcy5faXNTbGlkaW5nID0gZmFsc2U7XG4gICAgdGhpcy5fZm9jdXNIb3N0RWxlbWVudCgpO1xuXG4gICAgaWYgKCF0aGlzLl9zbGlkZXJEaW1lbnNpb25zKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IG9mZnNldCA9IHRoaXMudmVydGljYWwgPyB0aGlzLl9zbGlkZXJEaW1lbnNpb25zLnRvcCA6IHRoaXMuX3NsaWRlckRpbWVuc2lvbnMubGVmdDtcbiAgICBjb25zdCBzaXplID0gdGhpcy52ZXJ0aWNhbCA/IHRoaXMuX3NsaWRlckRpbWVuc2lvbnMuaGVpZ2h0IDogdGhpcy5fc2xpZGVyRGltZW5zaW9ucy53aWR0aDtcbiAgICBjb25zdCBwb3NDb21wb25lbnQgPSB0aGlzLnZlcnRpY2FsID8gZXZlbnQuY2xpZW50WSA6IGV2ZW50LmNsaWVudFg7XG5cbiAgICAvLyBUaGUgZXhhY3QgdmFsdWUgaXMgY2FsY3VsYXRlZCBmcm9tIHRoZSBldmVudCBhbmQgdXNlZCB0byBmaW5kIHRoZSBjbG9zZXN0IHNuYXAgdmFsdWUuXG4gICAgbGV0IHBlcmNlbnQgPSBOdW1iZXIodGhpcy5fY2xhbXAoKHBvc0NvbXBvbmVudCAtIG9mZnNldCkgLyBzaXplKSk7XG5cbiAgICBpZiAodGhpcy5fc2hvdWxkSW52ZXJ0TW91c2VDb29yZHMoKSkge1xuICAgICAgcGVyY2VudCA9IDEgLSBwZXJjZW50O1xuICAgIH1cblxuICAgIGlmIChcbiAgICAgIHBlcmNlbnQgPD1cbiAgICAgICh0aGlzLnBlcmNlbnQgYXMgbnVtYmVyW10pWzBdICtcbiAgICAgICAgKCh0aGlzLnBlcmNlbnQgYXMgbnVtYmVyW10pWzFdIC0gKHRoaXMucGVyY2VudCBhcyBudW1iZXJbXSlbMF0pIC8gMlxuICAgICkge1xuICAgICAgdGhpcy5fY3VycmVudFNsaWRlckRpciA9ICdsJztcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fY3VycmVudFNsaWRlckRpciA9ICdyJztcbiAgICB9XG5cbiAgICBpZiAodGhpcy5fY3VycmVudFNsaWRlckRpciA9PT0gJ2wnKSB7XG4gICAgICB0aGlzLl91cGRhdGVWYWx1ZUZyb21Qb3NpdGlvbkxlZnQoeyB4OiBldmVudC5jbGllbnRYLCB5OiBldmVudC5jbGllbnRZIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl91cGRhdGVWYWx1ZUZyb21Qb3NpdGlvblJpZ2h0KHsgeDogZXZlbnQuY2xpZW50WCwgeTogZXZlbnQuY2xpZW50WSB9KTtcbiAgICB9XG5cbiAgICAvLyBFbWl0IGEgY2hhbmdlIGFuZCBpbnB1dCBldmVudCBpZiB0aGUgdmFsdWUgY2hhbmdlZC5cbiAgICBpZiAodGhpcy52YWx1ZSBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICBpZiAoXG4gICAgICAgIChvbGRWYWx1ZSBhcyBudW1iZXJbXSlbMF0gIT09IHRoaXMudmFsdWVbMF0gfHxcbiAgICAgICAgKG9sZFZhbHVlIGFzIG51bWJlcltdKVsxXSAhPT0gdGhpcy52YWx1ZVsxXVxuICAgICAgKSB7XG4gICAgICAgIHRoaXMuX2VtaXRJbnB1dEV2ZW50KCk7XG4gICAgICAgIHRoaXMuX2VtaXRDaGFuZ2VFdmVudCgpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAob2xkVmFsdWUgIT09IHRoaXMudmFsdWUpIHtcbiAgICAgICAgdGhpcy5fZW1pdElucHV0RXZlbnQoKTtcbiAgICAgICAgdGhpcy5fZW1pdENoYW5nZUV2ZW50KCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgX29uRm9jdXMoKSB7XG4gICAgLy8gV2Ugc2F2ZSB0aGUgZGltZW5zaW9ucyBvZiB0aGUgc2xpZGVyIGhlcmUgc28gd2UgY2FuIHVzZSB0aGVtIHRvIHVwZGF0ZSB0aGUgc3BhY2luZyBvZiB0aGVcbiAgICAvLyB0aWNrcyBhbmQgZGV0ZXJtaW5lIHdoZXJlIG9uIHRoZSBzbGlkZXIgY2xpY2sgYW5kIHNsaWRlIGV2ZW50cyBoYXBwZW4uXG4gICAgdGhpcy5fc2xpZGVyRGltZW5zaW9ucyA9IHRoaXMuX2dldFNsaWRlckRpbWVuc2lvbnMoKTtcbiAgICB0aGlzLl91cGRhdGVUaWNrSW50ZXJ2YWxQZXJjZW50KCk7XG4gIH1cblxuICBfb25CbHVyKCkge1xuICAgIHRoaXMub25Ub3VjaGVkKCk7XG4gIH1cblxuICBfb25LZXlkb3duKGV2ZW50OiBLZXlib2FyZEV2ZW50KSB7XG4gICAgaWYgKHRoaXMuZGlzYWJsZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBsZXQgb2xkVmFsdWU7XG4gICAgaWYgKHRoaXMudmFsdWUgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgb2xkVmFsdWUgPSBbdGhpcy52YWx1ZVswXSwgdGhpcy52YWx1ZVsxXV07XG4gICAgfSBlbHNlIHtcbiAgICAgIG9sZFZhbHVlID0gdGhpcy52YWx1ZTtcbiAgICB9XG5cbiAgICBzd2l0Y2ggKGV2ZW50LmtleUNvZGUpIHtcbiAgICAgIGNhc2UgUEFHRV9VUDpcbiAgICAgICAgdGhpcy5faW5jcmVtZW50KDEwKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFBBR0VfRE9XTjpcbiAgICAgICAgdGhpcy5faW5jcmVtZW50KC0xMCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBFTkQ6XG4gICAgICAgIHRoaXMudmFsdWUgPSB0aGlzLm1heDtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIEhPTUU6XG4gICAgICAgIHRoaXMudmFsdWUgPSB0aGlzLm1pbjtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIExFRlRfQVJST1c6XG4gICAgICAgIC8vIE5PVEU6IEZvciBhIHNpZ2h0ZWQgdXNlciBpdCB3b3VsZCBtYWtlIG1vcmUgc2Vuc2UgdGhhdCB3aGVuIHRoZXkgcHJlc3MgYW4gYXJyb3dcbiAgICAgICAgLy8ga2V5IG9uIGFuIGludmVydGVkIHNsaWRlciB0aGUgdGh1bWIgbW92ZXMgaW4gdGhhdCBkaXJlY3Rpb24uIEhvd2V2ZXIgZm9yIGEgYmxpbmRcbiAgICAgICAgLy8gdXNlciwgbm90aGluZyBhYm91dCB0aGUgc2xpZGVyIGluZGljYXRlcyB0aGF0IGl0IGlzIGludmVydGVkLiBUaGV5IHdpbGwgZXhwZWN0XG4gICAgICAgIC8vIGxlZnQgdG8gYmUgZGVjcmVtZW50LCByZWdhcmRsZXNzIG9mIGhvdyBpdCBhcHBlYXJzIG9uIHRoZSBzY3JlZW4uIEZvciBzcGVha2Vyc1xuICAgICAgICAvLyBvZlJUTCBsYW5ndWFnZXMsIHRoZXkgcHJvYmFibHkgZXhwZWN0IGxlZnQgdG8gbWVhbiBpbmNyZW1lbnQuIFRoZXJlZm9yZSB3ZSBmbGlwXG4gICAgICAgIC8vIHRoZSBtZWFuaW5nIG9mIHRoZSBzaWRlIGFycm93IGtleXMgZm9yIFJUTC4gRm9yIGludmVydGVkIHNsaWRlcnMgd2UgcHJlZmVyIGFcbiAgICAgICAgLy8gZ29vZCBhMTF5IGV4cGVyaWVuY2UgdG8gaGF2aW5nIGl0IFwibG9vayByaWdodFwiIGZvciBzaWdodGVkIHVzZXJzLCB0aGVyZWZvcmUgd2UgZG9cbiAgICAgICAgLy8gbm90IHN3YXAgdGhlIG1lYW5pbmcuXG4gICAgICAgIHRoaXMuX2luY3JlbWVudCh0aGlzLl9nZXREaXJlY3Rpb24oKSA9PT0gJ3J0bCcgPyAxIDogLTEpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgVVBfQVJST1c6XG4gICAgICAgIHRoaXMuX2luY3JlbWVudCgxKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFJJR0hUX0FSUk9XOlxuICAgICAgICAvLyBTZWUgY29tbWVudCBvbiBMRUZUX0FSUk9XIGFib3V0IHRoZSBjb25kaXRpb25zIHVuZGVyIHdoaWNoIHdlIGZsaXAgdGhlIG1lYW5pbmcuXG4gICAgICAgIHRoaXMuX2luY3JlbWVudCh0aGlzLl9nZXREaXJlY3Rpb24oKSA9PT0gJ3J0bCcgPyAtMSA6IDEpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgRE9XTl9BUlJPVzpcbiAgICAgICAgdGhpcy5faW5jcmVtZW50KC0xKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICAvLyBSZXR1cm4gaWYgdGhlIGtleSBpcyBub3Qgb25lIHRoYXQgd2UgZXhwbGljaXRseSBoYW5kbGUgdG8gYXZvaWQgY2FsbGluZ1xuICAgICAgICAvLyBwcmV2ZW50RGVmYXVsdCBvbiBpdC5cbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnZhbHVlIGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgIGlmIChcbiAgICAgICAgKG9sZFZhbHVlIGFzIG51bWJlcltdKVswXSAhPT0gdGhpcy52YWx1ZVswXSB8fFxuICAgICAgICAob2xkVmFsdWUgYXMgbnVtYmVyW10pWzFdICE9PSB0aGlzLnZhbHVlWzFdXG4gICAgICApIHtcbiAgICAgICAgdGhpcy5fZW1pdElucHV0RXZlbnQoKTtcbiAgICAgICAgdGhpcy5fZW1pdENoYW5nZUV2ZW50KCk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChvbGRWYWx1ZSAhPT0gdGhpcy52YWx1ZSkge1xuICAgICAgICB0aGlzLl9lbWl0SW5wdXRFdmVudCgpO1xuICAgICAgICB0aGlzLl9lbWl0Q2hhbmdlRXZlbnQoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLl9pc1NsaWRpbmcgPSB0cnVlO1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gIH1cblxuICBfb25LZXl1cCgpIHtcbiAgICB0aGlzLl9pc1NsaWRpbmcgPSBmYWxzZTtcbiAgfVxuXG4gIC8qKiBDYWxsZWQgd2hlbiB0aGUgdXNlciBoYXMgcHV0IHRoZWlyIHBvaW50ZXIgZG93biBvbiB0aGUgc2xpZGVyLiAqL1xuICBwcml2YXRlIF9wb2ludGVyRG93biA9IChldmVudDogVG91Y2hFdmVudCB8IE1vdXNlRXZlbnQpID0+IHtcbiAgICAvLyBEb24ndCBkbyBhbnl0aGluZyBpZiB0aGUgc2xpZGVyIGlzIGRpc2FibGVkIG9yIHRoZVxuICAgIC8vIHVzZXIgaXMgdXNpbmcgYW55dGhpbmcgb3RoZXIgdGhhbiB0aGUgbWFpbiBtb3VzZSBidXR0b24uXG4gICAgaWYgKHRoaXMuZGlzYWJsZWQgfHwgdGhpcy5faXNTbGlkaW5nIHx8ICghaXNUb3VjaEV2ZW50KGV2ZW50KSAmJiBldmVudC5idXR0b24gIT09IDApKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5jYWxjdWxhdGVJbml0aWFsU2xpZGVEaXJlY3Rpb24oZXZlbnQpO1xuXG4gICAgdGhpcy5fcnVuSW5zaWRlWm9uZSgoKSA9PiB7XG4gICAgICBjb25zdCBvbGRWYWx1ZSA9IHRoaXMudmFsdWU7XG4gICAgICBjb25zdCBwb2ludGVyUG9zaXRpb24gPSBnZXRQb2ludGVyUG9zaXRpb25PblBhZ2UoZXZlbnQpO1xuICAgICAgdGhpcy5faXNTbGlkaW5nID0gdHJ1ZTtcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICB0aGlzLl9mb2N1c0hvc3RFbGVtZW50KCk7XG4gICAgICB0aGlzLl9vbk1vdXNlZW50ZXIoKTsgLy8gU2ltdWxhdGUgbW91c2VlbnRlciBpbiBjYXNlIHRoaXMgaXMgYSBtb2JpbGUgZGV2aWNlLlxuICAgICAgdGhpcy5fYmluZEdsb2JhbEV2ZW50cyhldmVudCk7XG4gICAgICB0aGlzLl9mb2N1c0hvc3RFbGVtZW50KCk7XG5cbiAgICAgIC8vIFRPRE86XG4gICAgICAvLyB0aGlzLl91cGRhdGVWYWx1ZUZyb21Qb3NpdGlvbihwb2ludGVyUG9zaXRpb24pO1xuICAgICAgaWYgKHRoaXMudmFsdWUgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgICBpZiAodGhpcy5fY3VycmVudFNsaWRlckRpciA9PT0gJ2wnKSB7XG4gICAgICAgICAgdGhpcy5fdXBkYXRlVmFsdWVGcm9tUG9zaXRpb25MZWZ0KHBvaW50ZXJQb3NpdGlvbik7XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5fY3VycmVudFNsaWRlckRpciA9PT0gJ3InKSB7XG4gICAgICAgICAgdGhpcy5fdXBkYXRlVmFsdWVGcm9tUG9zaXRpb25SaWdodChwb2ludGVyUG9zaXRpb24pO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl91cGRhdGVWYWx1ZUZyb21Qb3NpdGlvbkxlZnQocG9pbnRlclBvc2l0aW9uKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5fdmFsdWVPblNsaWRlU3RhcnQgPSB0aGlzLnZhbHVlO1xuICAgICAgdGhpcy5fcG9pbnRlclBvc2l0aW9uT25TdGFydCA9IHBvaW50ZXJQb3NpdGlvbjtcblxuICAgICAgLy8gRW1pdCBhIGNoYW5nZSBhbmQgaW5wdXQgZXZlbnQgaWYgdGhlIHZhbHVlIGNoYW5nZWQuXG4gICAgICBpZiAob2xkVmFsdWUgIT09IHRoaXMudmFsdWUpIHtcbiAgICAgICAgdGhpcy5fZW1pdElucHV0RXZlbnQoKTtcbiAgICAgICAgdGhpcy5fZW1pdENoYW5nZUV2ZW50KCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH07XG5cbiAgLyoqXG4gICAqIENhbGxlZCB3aGVuIHRoZSB1c2VyIGhhcyBtb3ZlZCB0aGVpciBwb2ludGVyIGFmdGVyXG4gICAqIHN0YXJ0aW5nIHRvIGRyYWcuIEJvdW5kIG9uIHRoZSBkb2N1bWVudCBsZXZlbC5cbiAgICovXG4gIHByaXZhdGUgX3BvaW50ZXJNb3ZlID0gKGV2ZW50OiBUb3VjaEV2ZW50IHwgTW91c2VFdmVudCkgPT4ge1xuICAgIGlmICh0aGlzLl9pc1NsaWRpbmcpIHtcbiAgICAgIHRoaXMuY2FsY3VsYXRlSW5pdGlhbFNsaWRlRGlyZWN0aW9uKGV2ZW50KTtcblxuICAgICAgLy8gUHJldmVudCB0aGUgc2xpZGUgZnJvbSBzZWxlY3RpbmcgYW55dGhpbmcgZWxzZS5cbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBjb25zdCBvbGRWYWx1ZSA9IHRoaXMudmFsdWU7XG5cbiAgICAgIC8vIFRPRE86XG4gICAgICAvLyB0aGlzLl91cGRhdGVWYWx1ZUZyb21Qb3NpdGlvbihnZXRQb2ludGVyUG9zaXRpb25PblBhZ2UoZXZlbnQpKTtcbiAgICAgIGNvbnN0IHBvaW50ZXJQb3NpdGlvbiA9IGdldFBvaW50ZXJQb3NpdGlvbk9uUGFnZShldmVudCk7XG4gICAgICBpZiAodGhpcy5fY3VycmVudFNsaWRlckRpciA9PT0gJ2wnKSB7XG4gICAgICAgIHRoaXMuX3VwZGF0ZVZhbHVlRnJvbVBvc2l0aW9uTGVmdChwb2ludGVyUG9zaXRpb24pO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLl9jdXJyZW50U2xpZGVyRGlyID09PSAncicpIHtcbiAgICAgICAgdGhpcy5fdXBkYXRlVmFsdWVGcm9tUG9zaXRpb25SaWdodChwb2ludGVyUG9zaXRpb24pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKCF0aGlzLmlzUmFuZ2VTbGlkZXIoKSkge1xuICAgICAgICAgIHRoaXMuX3VwZGF0ZVZhbHVlRnJvbVBvc2l0aW9uTGVmdChwb2ludGVyUG9zaXRpb24pO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIE5hdGl2ZSByYW5nZSBlbGVtZW50cyBhbHdheXMgZW1pdCBgaW5wdXRgIGV2ZW50cyB3aGVuIHRoZSB2YWx1ZSBjaGFuZ2VkIHdoaWxlIHNsaWRpbmcuXG4gICAgICBpZiAob2xkVmFsdWUgIT09IHRoaXMudmFsdWUpIHtcbiAgICAgICAgdGhpcy5fZW1pdElucHV0RXZlbnQoKTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgLyoqIENhbGxlZCB3aGVuIHRoZSB1c2VyIGhhcyBsaWZ0ZWQgdGhlaXIgcG9pbnRlci4gQm91bmQgb24gdGhlIGRvY3VtZW50IGxldmVsLiAqL1xuICBwcml2YXRlIF9wb2ludGVyVXAgPSAoZXZlbnQ6IFRvdWNoRXZlbnQgfCBNb3VzZUV2ZW50KSA9PiB7XG4gICAgaWYgKHRoaXMuX2lzU2xpZGluZykge1xuICAgICAgY29uc3QgcG9pbnRlclBvc2l0aW9uT25TdGFydCA9IHRoaXMuX3BvaW50ZXJQb3NpdGlvbk9uU3RhcnQ7XG4gICAgICBjb25zdCBjdXJyZW50UG9pbnRlclBvc2l0aW9uID0gZ2V0UG9pbnRlclBvc2l0aW9uT25QYWdlKGV2ZW50KTtcblxuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgIHRoaXMuX3JlbW92ZUdsb2JhbEV2ZW50cygpO1xuICAgICAgdGhpcy5fdmFsdWVPblNsaWRlU3RhcnQgPSB0aGlzLl9wb2ludGVyUG9zaXRpb25PblN0YXJ0ID0gbnVsbDtcbiAgICAgIHRoaXMuX2lzU2xpZGluZyA9IGZhbHNlO1xuXG4gICAgICBpZiAoXG4gICAgICAgIHRoaXMuX3ZhbHVlT25TbGlkZVN0YXJ0ICE9PSB0aGlzLnZhbHVlICYmXG4gICAgICAgICF0aGlzLmRpc2FibGVkICYmXG4gICAgICAgIHBvaW50ZXJQb3NpdGlvbk9uU3RhcnQgJiZcbiAgICAgICAgKHBvaW50ZXJQb3NpdGlvbk9uU3RhcnQueCAhPT0gY3VycmVudFBvaW50ZXJQb3NpdGlvbi54IHx8XG4gICAgICAgICAgcG9pbnRlclBvc2l0aW9uT25TdGFydC55ICE9PSBjdXJyZW50UG9pbnRlclBvc2l0aW9uLnkpXG4gICAgICApIHtcbiAgICAgICAgdGhpcy5fZW1pdENoYW5nZUV2ZW50KCk7XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIC8qKlxuICAgKiBCaW5kcyBvdXIgZ2xvYmFsIG1vdmUgYW5kIGVuZCBldmVudHMuIFRoZXkncmUgYm91bmQgYXQgdGhlIGRvY3VtZW50IGxldmVsIGFuZCBvbmx5IHdoaWxlXG4gICAqIGRyYWdnaW5nIHNvIHRoYXQgdGhlIHVzZXIgZG9lc24ndCBoYXZlIHRvIGtlZXAgdGhlaXIgcG9pbnRlciBleGFjdGx5IG92ZXIgdGhlIHNsaWRlclxuICAgKiBhcyB0aGV5J3JlIHN3aXBpbmcgYWNyb3NzIHRoZSBzY3JlZW4uXG4gICAqL1xuICBwcml2YXRlIF9iaW5kR2xvYmFsRXZlbnRzKHRyaWdnZXJFdmVudDogVG91Y2hFdmVudCB8IE1vdXNlRXZlbnQpIHtcbiAgICBpZiAodHlwZW9mIGRvY3VtZW50ICE9PSAndW5kZWZpbmVkJyAmJiBkb2N1bWVudCkge1xuICAgICAgY29uc3QgaXNUb3VjaCA9IGlzVG91Y2hFdmVudCh0cmlnZ2VyRXZlbnQpO1xuICAgICAgY29uc3QgbW92ZUV2ZW50TmFtZSA9IGlzVG91Y2ggPyAndG91Y2htb3ZlJyA6ICdtb3VzZW1vdmUnO1xuICAgICAgY29uc3QgZW5kRXZlbnROYW1lID0gaXNUb3VjaCA/ICd0b3VjaGVuZCcgOiAnbW91c2V1cCc7XG4gICAgICBkb2N1bWVudC5ib2R5LmFkZEV2ZW50TGlzdGVuZXIobW92ZUV2ZW50TmFtZSwgdGhpcy5fcG9pbnRlck1vdmUsIGFjdGl2ZUV2ZW50T3B0aW9ucyk7XG4gICAgICBkb2N1bWVudC5ib2R5LmFkZEV2ZW50TGlzdGVuZXIoZW5kRXZlbnROYW1lLCB0aGlzLl9wb2ludGVyVXAsIGFjdGl2ZUV2ZW50T3B0aW9ucyk7XG4gICAgfVxuICB9XG5cbiAgLyoqIFJlbW92ZXMgYW55IGdsb2JhbCBldmVudCBsaXN0ZW5lcnMgdGhhdCB3ZSBtYXkgaGF2ZSBhZGRlZC4gKi9cbiAgcHJpdmF0ZSBfcmVtb3ZlR2xvYmFsRXZlbnRzKCkge1xuICAgIGlmICh0eXBlb2YgZG9jdW1lbnQgIT09ICd1bmRlZmluZWQnICYmIGRvY3VtZW50KSB7XG4gICAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIHRoaXMuX3BvaW50ZXJNb3ZlLCBhY3RpdmVFdmVudE9wdGlvbnMpO1xuICAgICAgZG9jdW1lbnQuYm9keS5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgdGhpcy5fcG9pbnRlclVwLCBhY3RpdmVFdmVudE9wdGlvbnMpO1xuICAgICAgZG9jdW1lbnQuYm9keS5yZW1vdmVFdmVudExpc3RlbmVyKCd0b3VjaG1vdmUnLCB0aGlzLl9wb2ludGVyTW92ZSwgYWN0aXZlRXZlbnRPcHRpb25zKTtcbiAgICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlRXZlbnRMaXN0ZW5lcigndG91Y2hlbmQnLCB0aGlzLl9wb2ludGVyVXAsIGFjdGl2ZUV2ZW50T3B0aW9ucyk7XG4gICAgfVxuICB9XG5cbiAgLyoqIEluY3JlbWVudHMgdGhlIHNsaWRlciBieSB0aGUgZ2l2ZW4gbnVtYmVyIG9mIHN0ZXBzIChuZWdhdGl2ZSBudW1iZXIgZGVjcmVtZW50cykuICovXG4gIHByaXZhdGUgX2luY3JlbWVudChudW1TdGVwczogbnVtYmVyKSB7XG4gICAgaWYgKHRoaXMudmFsdWUgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgdGhpcy52YWx1ZSA9IHRoaXMuX2NsYW1wKFxuICAgICAgICBbKHRoaXMudmFsdWVbMF0gfHwgMCkgKyB0aGlzLnN0ZXAgKiBudW1TdGVwcywgKHRoaXMudmFsdWVbMV0gfHwgMCkgKyB0aGlzLnN0ZXAgKiBudW1TdGVwc10sXG4gICAgICAgIHRoaXMubWluLFxuICAgICAgICB0aGlzLm1heFxuICAgICAgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy52YWx1ZSA9IHRoaXMuX2NsYW1wKCh0aGlzLnZhbHVlIHx8IDApICsgdGhpcy5zdGVwICogbnVtU3RlcHMsIHRoaXMubWluLCB0aGlzLm1heCk7XG4gICAgfVxuICB9XG5cbiAgLyoqIENhbGN1bGF0ZSB0aGUgbmV3IHZhbHVlIGZyb20gdGhlIG5ldyBwaHlzaWNhbCBsb2NhdGlvbi4gVGhlIHZhbHVlIHdpbGwgYWx3YXlzIGJlIHNuYXBwZWQuICovXG4gIHByaXZhdGUgX3VwZGF0ZVZhbHVlRnJvbVBvc2l0aW9uKHBvczogeyB4OiBudW1iZXI7IHk6IG51bWJlciB9KSB7XG4gICAgaWYgKCF0aGlzLl9zbGlkZXJEaW1lbnNpb25zKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3Qgb2Zmc2V0ID0gdGhpcy52ZXJ0aWNhbCA/IHRoaXMuX3NsaWRlckRpbWVuc2lvbnMudG9wIDogdGhpcy5fc2xpZGVyRGltZW5zaW9ucy5sZWZ0O1xuICAgIGNvbnN0IHNpemUgPSB0aGlzLnZlcnRpY2FsID8gdGhpcy5fc2xpZGVyRGltZW5zaW9ucy5oZWlnaHQgOiB0aGlzLl9zbGlkZXJEaW1lbnNpb25zLndpZHRoO1xuICAgIGNvbnN0IHBvc0NvbXBvbmVudCA9IHRoaXMudmVydGljYWwgPyBwb3MueSA6IHBvcy54O1xuXG4gICAgLy8gVGhlIGV4YWN0IHZhbHVlIGlzIGNhbGN1bGF0ZWQgZnJvbSB0aGUgZXZlbnQgYW5kIHVzZWQgdG8gZmluZCB0aGUgY2xvc2VzdCBzbmFwIHZhbHVlLlxuICAgIGxldCBwZXJjZW50ID0gdGhpcy5fY2xhbXAoKHBvc0NvbXBvbmVudCAtIG9mZnNldCkgLyBzaXplKTtcblxuICAgIGlmICh0aGlzLl9zaG91bGRJbnZlcnRNb3VzZUNvb3JkcygpKSB7XG4gICAgICBwZXJjZW50ID0gMSAtIChwZXJjZW50IGFzIGFueSk7XG4gICAgfVxuXG4gICAgLy8gU2luY2UgdGhlIHN0ZXBzIG1heSBub3QgZGl2aWRlIGNsZWFubHkgaW50byB0aGUgbWF4IHZhbHVlLCBpZiB0aGUgdXNlclxuICAgIC8vIHNsaWQgdG8gMCBvciAxMDAgcGVyY2VudCwgd2UganVtcCB0byB0aGUgbWluL21heCB2YWx1ZS4gVGhpcyBhcHByb2FjaFxuICAgIC8vIGlzIHNsaWdodGx5IG1vcmUgaW50dWl0aXZlIHRoYW4gdXNpbmcgYE1hdGguY2VpbGAgYmVsb3csIGJlY2F1c2UgaXRcbiAgICAvLyBmb2xsb3dzIHRoZSB1c2VyJ3MgcG9pbnRlciBjbG9zZXIuXG4gICAgaWYgKHBlcmNlbnQgPT09IDApIHtcbiAgICAgIHRoaXMudmFsdWUgPSB0aGlzLm1pbjtcbiAgICB9IGVsc2UgaWYgKHBlcmNlbnQgPT09IDEpIHtcbiAgICAgIHRoaXMudmFsdWUgPSB0aGlzLm1heDtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgZXhhY3RWYWx1ZSA9IHRoaXMuX2NhbGN1bGF0ZVZhbHVlKHBlcmNlbnQpO1xuXG4gICAgICAvLyBUaGlzIGNhbGN1bGF0aW9uIGZpbmRzIHRoZSBjbG9zZXN0IHN0ZXAgYnkgZmluZGluZyB0aGUgY2xvc2VzdFxuICAgICAgLy8gd2hvbGUgbnVtYmVyIGRpdmlzaWJsZSBieSB0aGUgc3RlcCByZWxhdGl2ZSB0byB0aGUgbWluLlxuICAgICAgY29uc3QgY2xvc2VzdFZhbHVlID1cbiAgICAgICAgTWF0aC5yb3VuZCgoKGV4YWN0VmFsdWUgYXMgYW55KSAtIHRoaXMubWluKSAvIHRoaXMuc3RlcCkgKiB0aGlzLnN0ZXAgKyB0aGlzLm1pbjtcblxuICAgICAgLy8gVGhlIHZhbHVlIG5lZWRzIHRvIHNuYXAgdG8gdGhlIG1pbiBhbmQgbWF4LlxuICAgICAgdGhpcy52YWx1ZSA9IHRoaXMuX2NsYW1wKGNsb3Nlc3RWYWx1ZSwgdGhpcy5taW4sIHRoaXMubWF4KTtcbiAgICB9XG4gIH1cblxuICAvKiogQ2FsY3VsYXRlIHRoZSBuZXcgdmFsdWUgZnJvbSB0aGUgbmV3IHBoeXNpY2FsIGxvY2F0aW9uLiBUaGUgdmFsdWUgd2lsbCBhbHdheXMgYmUgc25hcHBlZC4gKi9cbiAgcHJpdmF0ZSBfdXBkYXRlVmFsdWVGcm9tUG9zaXRpb25MZWZ0KHBvczogeyB4OiBudW1iZXI7IHk6IG51bWJlciB9KSB7XG4gICAgaWYgKCF0aGlzLl9zbGlkZXJEaW1lbnNpb25zKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3Qgb2Zmc2V0ID0gdGhpcy52ZXJ0aWNhbCA/IHRoaXMuX3NsaWRlckRpbWVuc2lvbnMudG9wIDogdGhpcy5fc2xpZGVyRGltZW5zaW9ucy5sZWZ0O1xuICAgIGNvbnN0IHNpemUgPSB0aGlzLnZlcnRpY2FsID8gdGhpcy5fc2xpZGVyRGltZW5zaW9ucy5oZWlnaHQgOiB0aGlzLl9zbGlkZXJEaW1lbnNpb25zLndpZHRoO1xuICAgIGNvbnN0IHBvc0NvbXBvbmVudCA9IHRoaXMudmVydGljYWwgPyBwb3MueSA6IHBvcy54O1xuXG4gICAgLy8gVGhlIGV4YWN0IHZhbHVlIGlzIGNhbGN1bGF0ZWQgZnJvbSB0aGUgZXZlbnQgYW5kIHVzZWQgdG8gZmluZCB0aGUgY2xvc2VzdCBzbmFwIHZhbHVlLlxuICAgIGxldCBwZXJjZW50ID0gTnVtYmVyKHRoaXMuX2NsYW1wKChwb3NDb21wb25lbnQgLSBvZmZzZXQpIC8gc2l6ZSkpO1xuXG4gICAgaWYgKHRoaXMuX3Nob3VsZEludmVydE1vdXNlQ29vcmRzKCkpIHtcbiAgICAgIHBlcmNlbnQgPSAxIC0gcGVyY2VudDtcbiAgICB9XG5cbiAgICAvLyBTaW5jZSB0aGUgc3RlcHMgbWF5IG5vdCBkaXZpZGUgY2xlYW5seSBpbnRvIHRoZSBtYXggdmFsdWUsIGlmIHRoZSB1c2VyXG4gICAgLy8gc2xpZCB0byAwIG9yIDEwMCBwZXJjZW50LCB3ZSBqdW1wIHRvIHRoZSBtaW4vbWF4IHZhbHVlLiBUaGlzIGFwcHJvYWNoXG4gICAgLy8gaXMgc2xpZ2h0bHkgbW9yZSBpbnR1aXRpdmUgdGhhbiB1c2luZyBgTWF0aC5jZWlsYCBiZWxvdywgYmVjYXVzZSBpdFxuICAgIC8vIGZvbGxvd3MgdGhlIHVzZXIncyBwb2ludGVyIGNsb3Nlci5cbiAgICBpZiAocGVyY2VudCA9PT0gMCkge1xuICAgICAgaWYgKHRoaXMudmFsdWUgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgICB0aGlzLnZhbHVlID0gW3RoaXMubWluLCB0aGlzLnZhbHVlWzFdXTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMudmFsdWUgPSB0aGlzLm1pbjtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKHBlcmNlbnQgPT09IDEpIHtcbiAgICAgIGlmICh0aGlzLnZhbHVlIGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgICAgdGhpcy52YWx1ZSA9IFt0aGlzLm1heCwgdGhpcy52YWx1ZVsxXV07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnZhbHVlID0gdGhpcy5tYXg7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IGV4YWN0VmFsdWUgPSB0aGlzLl9jYWxjdWxhdGVWYWx1ZShwZXJjZW50KTtcblxuICAgICAgLy8gVGhpcyBjYWxjdWxhdGlvbiBmaW5kcyB0aGUgY2xvc2VzdCBzdGVwIGJ5IGZpbmRpbmcgdGhlIGNsb3Nlc3RcbiAgICAgIC8vIHdob2xlIG51bWJlciBkaXZpc2libGUgYnkgdGhlIHN0ZXAgcmVsYXRpdmUgdG8gdGhlIG1pbi5cbiAgICAgIGNvbnN0IGNsb3Nlc3RWYWx1ZSA9XG4gICAgICAgIE1hdGgucm91bmQoKE51bWJlcihleGFjdFZhbHVlKSAtIHRoaXMubWluKSAvIHRoaXMuc3RlcCkgKiB0aGlzLnN0ZXAgKyB0aGlzLm1pbjtcblxuICAgICAgLy8gVGhlIHZhbHVlIG5lZWRzIHRvIHNuYXAgdG8gdGhlIG1pbiBhbmQgbWF4LlxuICAgICAgaWYgKHRoaXMudmFsdWUgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgICB0aGlzLnZhbHVlID0gW051bWJlcih0aGlzLl9jbGFtcChjbG9zZXN0VmFsdWUsIHRoaXMubWluLCB0aGlzLm1heCkpLCB0aGlzLnZhbHVlWzFdXTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMudmFsdWUgPSB0aGlzLl9jbGFtcChjbG9zZXN0VmFsdWUsIHRoaXMubWluLCB0aGlzLm1heCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqIENhbGN1bGF0ZSB0aGUgbmV3IHZhbHVlIGZyb20gdGhlIG5ldyBwaHlzaWNhbCBsb2NhdGlvbi4gVGhlIHZhbHVlIHdpbGwgYWx3YXlzIGJlIHNuYXBwZWQuICovXG4gIHByaXZhdGUgX3VwZGF0ZVZhbHVlRnJvbVBvc2l0aW9uUmlnaHQocG9zOiB7IHg6IG51bWJlcjsgeTogbnVtYmVyIH0pIHtcbiAgICBpZiAoIXRoaXMuX3NsaWRlckRpbWVuc2lvbnMpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBvZmZzZXQgPSB0aGlzLnZlcnRpY2FsID8gdGhpcy5fc2xpZGVyRGltZW5zaW9ucy50b3AgOiB0aGlzLl9zbGlkZXJEaW1lbnNpb25zLmxlZnQ7XG4gICAgY29uc3Qgc2l6ZSA9IHRoaXMudmVydGljYWwgPyB0aGlzLl9zbGlkZXJEaW1lbnNpb25zLmhlaWdodCA6IHRoaXMuX3NsaWRlckRpbWVuc2lvbnMud2lkdGg7XG4gICAgY29uc3QgcG9zQ29tcG9uZW50ID0gdGhpcy52ZXJ0aWNhbCA/IHBvcy55IDogcG9zLng7XG5cbiAgICAvLyBUaGUgZXhhY3QgdmFsdWUgaXMgY2FsY3VsYXRlZCBmcm9tIHRoZSBldmVudCBhbmQgdXNlZCB0byBmaW5kIHRoZSBjbG9zZXN0IHNuYXAgdmFsdWUuXG4gICAgbGV0IHBlcmNlbnQgPSBOdW1iZXIodGhpcy5fY2xhbXAoKHBvc0NvbXBvbmVudCAtIG9mZnNldCkgLyBzaXplKSk7XG5cbiAgICBpZiAodGhpcy5fc2hvdWxkSW52ZXJ0TW91c2VDb29yZHMoKSkge1xuICAgICAgcGVyY2VudCA9IDEgLSBwZXJjZW50O1xuICAgIH1cblxuICAgIC8vIFNpbmNlIHRoZSBzdGVwcyBtYXkgbm90IGRpdmlkZSBjbGVhbmx5IGludG8gdGhlIG1heCB2YWx1ZSwgaWYgdGhlIHVzZXJcbiAgICAvLyBzbGlkIHRvIDAgb3IgMTAwIHBlcmNlbnQsIHdlIGp1bXAgdG8gdGhlIG1pbi9tYXggdmFsdWUuIFRoaXMgYXBwcm9hY2hcbiAgICAvLyBpcyBzbGlnaHRseSBtb3JlIGludHVpdGl2ZSB0aGFuIHVzaW5nIGBNYXRoLmNlaWxgIGJlbG93LCBiZWNhdXNlIGl0XG4gICAgLy8gZm9sbG93cyB0aGUgdXNlcidzIHBvaW50ZXIgY2xvc2VyLlxuICAgIGlmIChwZXJjZW50ID09PSAwKSB7XG4gICAgICBpZiAodGhpcy52YWx1ZSBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICAgIHRoaXMudmFsdWUgPSBbdGhpcy52YWx1ZVswXSwgdGhpcy5taW5dO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy52YWx1ZSA9IHRoaXMubWluO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAocGVyY2VudCA9PT0gMSkge1xuICAgICAgaWYgKHRoaXMudmFsdWUgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgICB0aGlzLnZhbHVlID0gW3RoaXMudmFsdWVbMF0sIHRoaXMubWF4XTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMudmFsdWUgPSB0aGlzLm1heDtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgZXhhY3RWYWx1ZSA9IHRoaXMuX2NhbGN1bGF0ZVZhbHVlKHBlcmNlbnQpO1xuXG4gICAgICAvLyBUaGlzIGNhbGN1bGF0aW9uIGZpbmRzIHRoZSBjbG9zZXN0IHN0ZXAgYnkgZmluZGluZyB0aGUgY2xvc2VzdFxuICAgICAgLy8gd2hvbGUgbnVtYmVyIGRpdmlzaWJsZSBieSB0aGUgc3RlcCByZWxhdGl2ZSB0byB0aGUgbWluLlxuICAgICAgY29uc3QgY2xvc2VzdFZhbHVlID1cbiAgICAgICAgTWF0aC5yb3VuZCgoTnVtYmVyKGV4YWN0VmFsdWUpIC0gdGhpcy5taW4pIC8gdGhpcy5zdGVwKSAqIHRoaXMuc3RlcCArIHRoaXMubWluO1xuXG4gICAgICAvLyBUaGUgdmFsdWUgbmVlZHMgdG8gc25hcCB0byB0aGUgbWluIGFuZCBtYXguXG4gICAgICBpZiAodGhpcy52YWx1ZSBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICAgIHRoaXMudmFsdWUgPSBbdGhpcy52YWx1ZVswXSwgTnVtYmVyKHRoaXMuX2NsYW1wKGNsb3Nlc3RWYWx1ZSwgdGhpcy5taW4sIHRoaXMubWF4KSldO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy52YWx1ZSA9IHRoaXMuX2NsYW1wKGNsb3Nlc3RWYWx1ZSwgdGhpcy5taW4sIHRoaXMubWF4KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKiogRW1pdHMgYSBjaGFuZ2UgZXZlbnQgaWYgdGhlIGN1cnJlbnQgdmFsdWUgaXMgZGlmZmVyZW50IGZyb20gdGhlIGxhc3QgZW1pdHRlZCB2YWx1ZS4gKi9cbiAgcHJpdmF0ZSBfZW1pdENoYW5nZUV2ZW50KCkge1xuICAgIHRoaXMuX2NvbnRyb2xWYWx1ZUFjY2Vzc29yQ2hhbmdlRm4odGhpcy52YWx1ZSk7XG4gICAgdGhpcy52YWx1ZUNoYW5nZS5lbWl0KHRoaXMudmFsdWUpO1xuICAgIHRoaXMuY2hhbmdlLmVtaXQodGhpcy5fY3JlYXRlQ2hhbmdlRXZlbnQoKSk7XG4gIH1cblxuICAvKiogRW1pdHMgYW4gaW5wdXQgZXZlbnQgd2hlbiB0aGUgY3VycmVudCB2YWx1ZSBpcyBkaWZmZXJlbnQgZnJvbSB0aGUgbGFzdCBlbWl0dGVkIHZhbHVlLiAqL1xuICBwcml2YXRlIF9lbWl0SW5wdXRFdmVudCgpIHtcbiAgICB0aGlzLmlucHV0LmVtaXQodGhpcy5fY3JlYXRlQ2hhbmdlRXZlbnQoKSk7XG4gIH1cblxuICAvKiogVXBkYXRlcyB0aGUgYW1vdW50IG9mIHNwYWNlIGJldHdlZW4gdGlja3MgYXMgYSBwZXJjZW50YWdlIG9mIHRoZSB3aWR0aCBvZiB0aGUgc2xpZGVyLiAqL1xuICBwcml2YXRlIF91cGRhdGVUaWNrSW50ZXJ2YWxQZXJjZW50KCkge1xuICAgIGlmICghdGhpcy50aWNrSW50ZXJ2YWwgfHwgIXRoaXMuX3NsaWRlckRpbWVuc2lvbnMpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAodGhpcy50aWNrSW50ZXJ2YWwgPT09ICdhdXRvJykge1xuICAgICAgY29uc3QgdHJhY2tTaXplID0gdGhpcy52ZXJ0aWNhbFxuICAgICAgICA/IHRoaXMuX3NsaWRlckRpbWVuc2lvbnMuaGVpZ2h0XG4gICAgICAgIDogdGhpcy5fc2xpZGVyRGltZW5zaW9ucy53aWR0aDtcbiAgICAgIGNvbnN0IHBpeGVsc1BlclN0ZXAgPSAodHJhY2tTaXplICogdGhpcy5zdGVwKSAvICh0aGlzLm1heCAtIHRoaXMubWluKTtcbiAgICAgIGNvbnN0IHN0ZXBzUGVyVGljayA9IE1hdGguY2VpbChNSU5fQVVUT19USUNLX1NFUEFSQVRJT04gLyBwaXhlbHNQZXJTdGVwKTtcbiAgICAgIGNvbnN0IHBpeGVsc1BlclRpY2sgPSBzdGVwc1BlclRpY2sgKiB0aGlzLnN0ZXA7XG4gICAgICB0aGlzLl90aWNrSW50ZXJ2YWxQZXJjZW50ID0gcGl4ZWxzUGVyVGljayAvIHRyYWNrU2l6ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fdGlja0ludGVydmFsUGVyY2VudCA9ICh0aGlzLnRpY2tJbnRlcnZhbCAqIHRoaXMuc3RlcCkgLyAodGhpcy5tYXggLSB0aGlzLm1pbik7XG4gICAgfVxuICB9XG5cbiAgLyoqIENyZWF0ZXMgYSBzbGlkZXIgY2hhbmdlIG9iamVjdCBmcm9tIHRoZSBzcGVjaWZpZWQgdmFsdWUuICovXG4gIHByaXZhdGUgX2NyZWF0ZUNoYW5nZUV2ZW50KHZhbHVlID0gdGhpcy52YWx1ZSk6IE10eFNsaWRlckNoYW5nZSB7XG4gICAgY29uc3QgZXZlbnQgPSBuZXcgTXR4U2xpZGVyQ2hhbmdlKCk7XG5cbiAgICBldmVudC5zb3VyY2UgPSB0aGlzO1xuICAgIGV2ZW50LnZhbHVlID0gdmFsdWU7XG5cbiAgICByZXR1cm4gZXZlbnQ7XG4gIH1cblxuICAvKiogQ2FsY3VsYXRlcyB0aGUgcGVyY2VudGFnZSBvZiB0aGUgc2xpZGVyIHRoYXQgYSB2YWx1ZSBpcy4gKi9cbiAgcHJpdmF0ZSBfY2FsY3VsYXRlUGVyY2VudGFnZSh2YWx1ZTogbnVtYmVyIHwgbnVtYmVyW10gfCBudWxsKSB7XG4gICAgaWYgKHZhbHVlIGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgIHJldHVybiBbXG4gICAgICAgICgodmFsdWVbMF0gfHwgMCkgLSB0aGlzLm1pbikgLyAodGhpcy5tYXggLSB0aGlzLm1pbiksXG4gICAgICAgICgodmFsdWVbMV0gfHwgMCkgLSB0aGlzLm1pbikgLyAodGhpcy5tYXggLSB0aGlzLm1pbiksXG4gICAgICBdO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gKCh2YWx1ZSB8fCAwKSAtIHRoaXMubWluKSAvICh0aGlzLm1heCAtIHRoaXMubWluKTtcbiAgICB9XG4gIH1cblxuICAvKiogQ2FsY3VsYXRlcyB0aGUgdmFsdWUgYSBwZXJjZW50YWdlIG9mIHRoZSBzbGlkZXIgY29ycmVzcG9uZHMgdG8uICovXG4gIHByaXZhdGUgX2NhbGN1bGF0ZVZhbHVlKHBlcmNlbnRhZ2U6IG51bWJlciB8IG51bWJlcltdKSB7XG4gICAgaWYgKHBlcmNlbnRhZ2UgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgcmV0dXJuIFtcbiAgICAgICAgdGhpcy5taW4gKyBwZXJjZW50YWdlWzBdICogKHRoaXMubWF4IC0gdGhpcy5taW4pLFxuICAgICAgICB0aGlzLm1pbiArIHBlcmNlbnRhZ2VbMV0gKiAodGhpcy5tYXggLSB0aGlzLm1pbiksXG4gICAgICBdO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5taW4gKyBwZXJjZW50YWdlICogKHRoaXMubWF4IC0gdGhpcy5taW4pO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBSZXR1cm4gYSBudW1iZXIgYmV0d2VlbiB0d28gbnVtYmVycy4gKi9cbiAgcHJpdmF0ZSBfY2xhbXAodmFsdWU6IG51bWJlciB8IG51bWJlcltdLCBtaW4gPSAwLCBtYXggPSAxKSB7XG4gICAgaWYgKHZhbHVlIGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgIHJldHVybiBbTWF0aC5tYXgobWluLCBNYXRoLm1pbih2YWx1ZVswXSwgbWF4KSksIE1hdGgubWF4KG1pbiwgTWF0aC5taW4odmFsdWVbMV0sIG1heCkpXTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIE1hdGgubWF4KG1pbiwgTWF0aC5taW4odmFsdWUsIG1heCkpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgdGhlIGJvdW5kaW5nIGNsaWVudCByZWN0IG9mIHRoZSBzbGlkZXIgdHJhY2sgZWxlbWVudC5cbiAgICogVGhlIHRyYWNrIGlzIHVzZWQgcmF0aGVyIHRoYW4gdGhlIG5hdGl2ZSBlbGVtZW50IHRvIGlnbm9yZSB0aGUgZXh0cmEgc3BhY2UgdGhhdCB0aGUgdGh1bWIgY2FuXG4gICAqIHRha2UgdXAuXG4gICAqL1xuICBwcml2YXRlIF9nZXRTbGlkZXJEaW1lbnNpb25zKCkge1xuICAgIHJldHVybiB0aGlzLl9zbGlkZXJXcmFwcGVyID8gdGhpcy5fc2xpZGVyV3JhcHBlci5uYXRpdmVFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpIDogbnVsbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBGb2N1c2VzIHRoZSBuYXRpdmUgZWxlbWVudC5cbiAgICogQ3VycmVudGx5IG9ubHkgdXNlZCB0byBhbGxvdyBhIGJsdXIgZXZlbnQgdG8gZmlyZSBidXQgd2lsbCBiZSB1c2VkIHdpdGgga2V5Ym9hcmQgaW5wdXQgbGF0ZXIuXG4gICAqL1xuICBwcml2YXRlIF9mb2N1c0hvc3RFbGVtZW50KCkge1xuICAgIHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5mb2N1cygpO1xuICB9XG5cbiAgLyoqIEJsdXJzIHRoZSBuYXRpdmUgZWxlbWVudC4gKi9cbiAgcHJpdmF0ZSBfYmx1ckhvc3RFbGVtZW50KCkge1xuICAgIHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5ibHVyKCk7XG4gIH1cblxuICAvKiogUnVucyBhIGNhbGxiYWNrIG91dHNpZGUgb2YgdGhlIE5nWm9uZSwgaWYgcG9zc2libGUuICovXG4gIHByaXZhdGUgX3J1bk91dHNpemVab25lKGZuOiAoKSA9PiBhbnkpIHtcbiAgICAvLyBAYnJlYWtpbmctY2hhbmdlIDkuMC4wIFJlbW92ZSB0aGlzIGZ1bmN0aW9uIG9uY2UgYF9uZ1pvbmVgIGlzIGEgcmVxdWlyZWQgcGFyYW1ldGVyLlxuICAgIHRoaXMuX25nWm9uZSA/IHRoaXMuX25nWm9uZS5ydW5PdXRzaWRlQW5ndWxhcihmbikgOiBmbigpO1xuICB9XG5cbiAgLyoqIFJ1bnMgYSBjYWxsYmFjayBpbnNpZGUgb2YgdGhlIE5nWm9uZSwgaWYgcG9zc2libGUuICovXG4gIHByaXZhdGUgX3J1bkluc2lkZVpvbmUoZm46ICgpID0+IGFueSkge1xuICAgIC8vIEBicmVha2luZy1jaGFuZ2UgOS4wLjAgUmVtb3ZlIHRoaXMgZnVuY3Rpb24gb25jZSBgX25nWm9uZWAgaXMgYSByZXF1aXJlZCBwYXJhbWV0ZXIuXG4gICAgdGhpcy5fbmdab25lID8gdGhpcy5fbmdab25lLnJ1bihmbikgOiBmbigpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIG1vZGVsIHZhbHVlLiBJbXBsZW1lbnRlZCBhcyBwYXJ0IG9mIENvbnRyb2xWYWx1ZUFjY2Vzc29yLlxuICAgKiBAcGFyYW0gdmFsdWVcbiAgICovXG4gIHdyaXRlVmFsdWUodmFsdWU6IGFueSkge1xuICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWdpc3RlcnMgYSBjYWxsYmFjayB0byBiZSB0cmlnZ2VyZWQgd2hlbiB0aGUgdmFsdWUgaGFzIGNoYW5nZWQuXG4gICAqIEltcGxlbWVudGVkIGFzIHBhcnQgb2YgQ29udHJvbFZhbHVlQWNjZXNzb3IuXG4gICAqIEBwYXJhbSBmbiBDYWxsYmFjayB0byBiZSByZWdpc3RlcmVkLlxuICAgKi9cbiAgcmVnaXN0ZXJPbkNoYW5nZShmbjogKHZhbHVlOiBhbnkpID0+IHZvaWQpIHtcbiAgICB0aGlzLl9jb250cm9sVmFsdWVBY2Nlc3NvckNoYW5nZUZuID0gZm47XG4gIH1cblxuICAvKipcbiAgICogUmVnaXN0ZXJzIGEgY2FsbGJhY2sgdG8gYmUgdHJpZ2dlcmVkIHdoZW4gdGhlIGNvbXBvbmVudCBpcyB0b3VjaGVkLlxuICAgKiBJbXBsZW1lbnRlZCBhcyBwYXJ0IG9mIENvbnRyb2xWYWx1ZUFjY2Vzc29yLlxuICAgKiBAcGFyYW0gZm4gQ2FsbGJhY2sgdG8gYmUgcmVnaXN0ZXJlZC5cbiAgICovXG4gIHJlZ2lzdGVyT25Ub3VjaGVkKGZuOiBhbnkpIHtcbiAgICB0aGlzLm9uVG91Y2hlZCA9IGZuO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgd2hldGhlciB0aGUgY29tcG9uZW50IHNob3VsZCBiZSBkaXNhYmxlZC5cbiAgICogSW1wbGVtZW50ZWQgYXMgcGFydCBvZiBDb250cm9sVmFsdWVBY2Nlc3Nvci5cbiAgICogQHBhcmFtIGlzRGlzYWJsZWRcbiAgICovXG4gIHNldERpc2FibGVkU3RhdGUoaXNEaXNhYmxlZDogYm9vbGVhbikge1xuICAgIHRoaXMuZGlzYWJsZWQgPSBpc0Rpc2FibGVkO1xuICB9XG5cbiAgaXNSYW5nZVNsaWRlcigpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy52YWx1ZSBpbnN0YW5jZW9mIEFycmF5O1xuICB9XG5cbiAgcHJpdmF0ZSBjYWxjdWxhdGVJbml0aWFsU2xpZGVEaXJlY3Rpb24oZXZlbnQ6IE1vdXNlRXZlbnQgfCBUb3VjaEV2ZW50KSB7XG4gICAgaWYgKCF0aGlzLl9zbGlkZXJEaW1lbnNpb25zKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IG9mZnNldCA9IHRoaXMudmVydGljYWwgPyB0aGlzLl9zbGlkZXJEaW1lbnNpb25zLnRvcCA6IHRoaXMuX3NsaWRlckRpbWVuc2lvbnMubGVmdDtcbiAgICBjb25zdCBzaXplID0gdGhpcy52ZXJ0aWNhbCA/IHRoaXMuX3NsaWRlckRpbWVuc2lvbnMuaGVpZ2h0IDogdGhpcy5fc2xpZGVyRGltZW5zaW9ucy53aWR0aDtcbiAgICBjb25zdCBwb2ludGVyUG9zaXRpb24gPSBnZXRQb2ludGVyUG9zaXRpb25PblBhZ2UoZXZlbnQpO1xuICAgIGNvbnN0IHBvc0NvbXBvbmVudCA9IHRoaXMudmVydGljYWwgPyBwb2ludGVyUG9zaXRpb24ueSA6IHBvaW50ZXJQb3NpdGlvbi54O1xuXG4gICAgLy8gVGhlIGV4YWN0IHZhbHVlIGlzIGNhbGN1bGF0ZWQgZnJvbSB0aGUgZXZlbnQgYW5kIHVzZWQgdG8gZmluZCB0aGUgY2xvc2VzdCBzbmFwIHZhbHVlLlxuICAgIGxldCBwZXJjZW50ID0gTnVtYmVyKHRoaXMuX2NsYW1wKChwb3NDb21wb25lbnQgLSBvZmZzZXQpIC8gc2l6ZSkpO1xuXG4gICAgaWYgKHRoaXMuX3Nob3VsZEludmVydE1vdXNlQ29vcmRzKCkpIHtcbiAgICAgIHBlcmNlbnQgPSAxIC0gcGVyY2VudDtcbiAgICB9XG5cbiAgICBpZiAoXG4gICAgICBwZXJjZW50IDw9XG4gICAgICAodGhpcy5wZXJjZW50IGFzIG51bWJlcltdKVswXSArXG4gICAgICAgICgodGhpcy5wZXJjZW50IGFzIG51bWJlcltdKVsxXSAtICh0aGlzLnBlcmNlbnQgYXMgbnVtYmVyW10pWzBdKSAvIDJcbiAgICApIHtcbiAgICAgIHRoaXMuX2N1cnJlbnRTbGlkZXJEaXIgPSAnbCc7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX2N1cnJlbnRTbGlkZXJEaXIgPSAncic7XG4gICAgfVxuICB9XG5cbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX2ludmVydDogQm9vbGVhbklucHV0O1xuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfbWF4OiBOdW1iZXJJbnB1dDtcbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX21pbjogTnVtYmVySW5wdXQ7XG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9zdGVwOiBOdW1iZXJJbnB1dDtcbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX3RodW1iTGFiZWw6IEJvb2xlYW5JbnB1dDtcbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX3RpY2tJbnRlcnZhbDogTnVtYmVySW5wdXQ7XG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV92YWx1ZTogTnVtYmVySW5wdXQgfCBOdW1iZXJJbnB1dFtdO1xuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfdmVydGljYWw6IEJvb2xlYW5JbnB1dDtcbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX2Rpc2FibGVkOiBCb29sZWFuSW5wdXQ7XG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV90YWJJbmRleDogTnVtYmVySW5wdXQ7XG59XG5cbi8qKiBSZXR1cm5zIHdoZXRoZXIgYW4gZXZlbnQgaXMgYSB0b3VjaCBldmVudC4gKi9cbmZ1bmN0aW9uIGlzVG91Y2hFdmVudChldmVudDogTW91c2VFdmVudCB8IFRvdWNoRXZlbnQpOiBldmVudCBpcyBUb3VjaEV2ZW50IHtcbiAgLy8gVGhpcyBmdW5jdGlvbiBpcyBjYWxsZWQgZm9yIGV2ZXJ5IHBpeGVsIHRoYXQgdGhlIHVzZXIgaGFzIGRyYWdnZWQgc28gd2UgbmVlZCBpdCB0byBiZVxuICAvLyBhcyBmYXN0IGFzIHBvc3NpYmxlLiBTaW5jZSB3ZSBvbmx5IGJpbmQgbW91c2UgZXZlbnRzIGFuZCB0b3VjaCBldmVudHMsIHdlIGNhbiBhc3N1bWVcbiAgLy8gdGhhdCBpZiB0aGUgZXZlbnQncyBuYW1lIHN0YXJ0cyB3aXRoIGB0YCwgaXQncyBhIHRvdWNoIGV2ZW50LlxuICByZXR1cm4gZXZlbnQudHlwZVswXSA9PT0gJ3QnO1xufVxuXG4vKiogR2V0cyB0aGUgY29vcmRpbmF0ZXMgb2YgYSB0b3VjaCBvciBtb3VzZSBldmVudCByZWxhdGl2ZSB0byB0aGUgdmlld3BvcnQuICovXG5mdW5jdGlvbiBnZXRQb2ludGVyUG9zaXRpb25PblBhZ2UoZXZlbnQ6IE1vdXNlRXZlbnQgfCBUb3VjaEV2ZW50KSB7XG4gIC8vIGB0b3VjaGVzYCB3aWxsIGJlIGVtcHR5IGZvciBzdGFydC9lbmQgZXZlbnRzIHNvIHdlIGhhdmUgdG8gZmFsbCBiYWNrIHRvIGBjaGFuZ2VkVG91Y2hlc2AuXG4gIGNvbnN0IHBvaW50ID0gaXNUb3VjaEV2ZW50KGV2ZW50KSA/IGV2ZW50LnRvdWNoZXNbMF0gfHwgZXZlbnQuY2hhbmdlZFRvdWNoZXNbMF0gOiBldmVudDtcbiAgcmV0dXJuIHsgeDogcG9pbnQuY2xpZW50WCwgeTogcG9pbnQuY2xpZW50WSB9O1xufVxuIiwiPGRpdiBjbGFzcz1cIm10eC1zbGlkZXItd3JhcHBlclwiICNzbGlkZXJXcmFwcGVyPlxuICA8ZGl2IGNsYXNzPVwibXR4LXNsaWRlci10cmFjay13cmFwcGVyXCI+XG4gICAgPGRpdiAqbmdJZj1cImlzUmFuZ2VTbGlkZXIoKVwiXG4gICAgICAgICBjbGFzcz1cIm10eC1zbGlkZXItdHJhY2stYmFja2dyb3VuZCBtdHgtc2xpZGVyLXRyYWNrLWJhY2tncm91bmQtbGVmdFwiXG4gICAgICAgICBbbmdTdHlsZV09XCJfdHJhY2tCYWNrZ3JvdW5kU3R5bGVzTGVmdFwiPjwvZGl2PlxuICAgIDxkaXYgY2xhc3M9XCJtdHgtc2xpZGVyLXRyYWNrLWJhY2tncm91bmQgbXR4LXNsaWRlci10cmFjay1iYWNrZ3JvdW5kLXJpZ2h0XCJcbiAgICAgICAgIFtuZ1N0eWxlXT1cIl90cmFja0JhY2tncm91bmRTdHlsZXNSaWdodFwiPjwvZGl2PlxuICAgIDxkaXYgY2xhc3M9XCJtdHgtc2xpZGVyLXRyYWNrLWZpbGxcIiBbbmdDbGFzc109XCJ7J210eC1yYW5nZS1zbGlkZXItZmlsbCc6IGlzUmFuZ2VTbGlkZXIoKX1cIlxuICAgICAgICAgW25nU3R5bGVdPVwiX3RyYWNrRmlsbFN0eWxlc1wiPjwvZGl2PlxuICA8L2Rpdj5cbiAgPGRpdiBjbGFzcz1cIm10eC1zbGlkZXItdGlja3MtY29udGFpbmVyXCIgW25nU3R5bGVdPVwiX3RpY2tzQ29udGFpbmVyU3R5bGVzXCI+XG4gICAgPGRpdiBjbGFzcz1cIm10eC1zbGlkZXItdGlja3NcIiBbbmdTdHlsZV09XCJfdGlja3NTdHlsZXNcIj48L2Rpdj5cbiAgPC9kaXY+XG4gIDxkaXYgY2xhc3M9XCJtdHgtc2xpZGVyLXRodW1iLWNvbnRhaW5lclwiICNsZWZ0U2xpZGVyXG4gICAgICAgW25nU3R5bGVdPVwiX3RodW1iQ29udGFpbmVyU3R5bGVzTGVmdFwiPlxuICAgIDxkaXYgY2xhc3M9XCJtdHgtc2xpZGVyLWZvY3VzLXJpbmdcIj48L2Rpdj5cbiAgICA8ZGl2IGNsYXNzPVwibXR4LXNsaWRlci10aHVtYiBsZWZ0XCI+PC9kaXY+XG4gICAgPGRpdiBjbGFzcz1cIm10eC1zbGlkZXItdGh1bWItbGFiZWxcIj5cbiAgICAgIDxzcGFuIGNsYXNzPVwibXR4LXNsaWRlci10aHVtYi1sYWJlbC10ZXh0XCI+e3tkaXNwbGF5VmFsdWV9fTwvc3Bhbj5cbiAgICA8L2Rpdj5cbiAgPC9kaXY+XG4gIDxkaXYgKm5nSWY9XCJpc1JhbmdlU2xpZGVyKClcIlxuICAgICAgIGNsYXNzPVwibXR4LXNsaWRlci10aHVtYi1jb250YWluZXJcIiAjcmlnaHRTbGlkZXJcbiAgICAgICBbbmdTdHlsZV09XCJfdGh1bWJDb250YWluZXJTdHlsZXNSaWdodFwiPlxuICAgIDxkaXYgY2xhc3M9XCJtdHgtc2xpZGVyLWZvY3VzLXJpbmdcIj48L2Rpdj5cbiAgICA8ZGl2IGNsYXNzPVwibXR4LXNsaWRlci10aHVtYiByaWdodFwiPjwvZGl2PlxuICAgIDxkaXYgY2xhc3M9XCJtdHgtc2xpZGVyLXRodW1iLWxhYmVsXCI+XG4gICAgICA8c3BhbiBjbGFzcz1cIm10eC1zbGlkZXItdGh1bWItbGFiZWwtdGV4dFwiPnt7ZGlzcGxheVZhbHVlUmlnaHR9fTwvc3Bhbj5cbiAgICA8L2Rpdj5cbiAgPC9kaXY+XG48L2Rpdj5cbiJdfQ==