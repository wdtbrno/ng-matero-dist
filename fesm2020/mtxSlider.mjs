import * as i3 from '@angular/common';
import { CommonModule } from '@angular/common';
import * as i0 from '@angular/core';
import { forwardRef, EventEmitter, Component, ViewEncapsulation, ChangeDetectionStrategy, Optional, Attribute, Inject, Input, Output, ViewChild, NgModule } from '@angular/core';
import { mixinTabIndex, mixinColor, mixinDisabled, MatCommonModule } from '@angular/material/core';
import { coerceBooleanProperty, coerceNumberProperty } from '@angular/cdk/coercion';
import { DOWN_ARROW, RIGHT_ARROW, UP_ARROW, LEFT_ARROW, HOME, END, PAGE_DOWN, PAGE_UP } from '@angular/cdk/keycodes';
import { normalizePassiveListenerOptions } from '@angular/cdk/platform';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { ANIMATION_MODULE_TYPE } from '@angular/platform-browser/animations';
import { Subscription } from 'rxjs';
import * as i1 from '@angular/cdk/a11y';
import * as i2 from '@angular/cdk/bidi';

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
const MTX_SLIDER_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => MtxSlider),
    multi: true,
};
/** A simple change event emitted by the MtxSlider component. */
class MtxSliderChange {
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
class MtxSlider extends _MtxSliderBase {
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

class MtxSliderModule {
}
/** @nocollapse */ MtxSliderModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MtxSliderModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
/** @nocollapse */ MtxSliderModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "15.2.1", ngImport: i0, type: MtxSliderModule, declarations: [MtxSlider], imports: [CommonModule, MatCommonModule], exports: [MtxSlider, MatCommonModule] });
/** @nocollapse */ MtxSliderModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MtxSliderModule, imports: [CommonModule, MatCommonModule, MatCommonModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MtxSliderModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, MatCommonModule],
                    exports: [MtxSlider, MatCommonModule],
                    declarations: [MtxSlider],
                }]
        }] });

/**
 * Generated bundle index. Do not edit.
 */

export { MTX_SLIDER_VALUE_ACCESSOR, MtxSlider, MtxSliderChange, MtxSliderModule };
//# sourceMappingURL=mtxSlider.mjs.map
