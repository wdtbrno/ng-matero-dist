import * as i1$1 from '@angular/common';
import { DOCUMENT, CommonModule } from '@angular/common';
import * as i0 from '@angular/core';
import { forwardRef, EventEmitter, Directive, Optional, Input, Output, Component, ViewEncapsulation, ChangeDetectionStrategy, Attribute, ContentChild, ViewChild, InjectionToken, Inject, NgModule } from '@angular/core';
import * as i3 from '@angular/cdk/overlay';
import { Overlay, OverlayConfig, OverlayModule } from '@angular/cdk/overlay';
import { A11yModule } from '@angular/cdk/a11y';
import { ComponentPortal, PortalModule } from '@angular/cdk/portal';
import * as i2 from '@angular/material/button';
import { MatButtonModule } from '@angular/material/button';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { DOWN_ARROW, ESCAPE, hasModifierKey, UP_ARROW } from '@angular/cdk/keycodes';
import { NG_VALUE_ACCESSOR, NG_VALIDATORS, Validators } from '@angular/forms';
import { MAT_INPUT_VALUE_ACCESSOR } from '@angular/material/input';
import { Subscription, of, merge, Subject } from 'rxjs';
import * as i1 from '@angular/material/form-field';
import { mixinColor } from '@angular/material/core';
import { take, filter } from 'rxjs/operators';
import { trigger, transition, animate, keyframes, style } from '@angular/animations';
import { TinyColor } from '@ctrl/tinycolor';
import * as i2$1 from 'ngx-color/chrome';
import { ColorChromeModule } from 'ngx-color/chrome';
import * as i4 from '@angular/cdk/bidi';

class MtxColorPickerInputEvent {
    constructor(
    /** Reference to the colorpicker input component that emitted the event. */
    target, 
    /** Reference to the native input element associated with the colorpicker input. */
    targetElement) {
        this.target = target;
        this.targetElement = targetElement;
        this.value = this.target.value;
    }
}
const MTX_COLORPICKER_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => MtxColorpickerInput),
    multi: true,
};
const MTX_COLORPICKER_VALIDATORS = {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(() => MtxColorpickerInput),
    multi: true,
};
class MtxColorpickerInput {
    set mtxColorpicker(value) {
        if (!value) {
            return;
        }
        this._picker = value;
        this._picker.registerInput(this);
        this._pickerSubscription.unsubscribe();
        this._pickerSubscription = this._picker._selectedChanged.subscribe((selected) => {
            this.value = selected;
            this._cvaOnChange(selected);
            this._onTouched();
            this.colorInput.emit(new MtxColorPickerInputEvent(this, this._elementRef.nativeElement));
            this.colorChange.emit(new MtxColorPickerInputEvent(this, this._elementRef.nativeElement));
        });
    }
    /** Whether the colorpicker-input is disabled. */
    get disabled() {
        return !!this._disabled;
    }
    set disabled(value) {
        const newValue = coerceBooleanProperty(value);
        const element = this._elementRef.nativeElement;
        if (this._disabled !== newValue) {
            this._disabled = newValue;
            this._disabledChange.emit(newValue);
        }
        // We need to null check the `blur` method, because it's undefined during SSR.
        // In Ivy static bindings are invoked earlier, before the element is attached to the DOM.
        // This can cause an error to be thrown in some browsers (IE/Edge) which assert that the
        // element has been inserted.
        if (newValue && this._isInitialized && element.blur) {
            // Normally, native input elements automatically blur if they turn disabled. This behavior
            // is problematic, because it would mean that it triggers another change detection cycle,
            // which then causes a changed after checked error if the input element was focused before.
            element.blur();
        }
    }
    /** The value of the input. */
    get value() {
        return this._value;
    }
    set value(value) {
        const oldValue = this.value;
        this._value = value;
        this._formatValue(value);
        this._valueChange.emit(value);
    }
    constructor(_elementRef, _formField) {
        this._elementRef = _elementRef;
        this._formField = _formField;
        /** The input and output color format. */
        this.format = 'hex';
        /** Emits when a `change` event is fired on this `<input>`. */
        this.colorChange = new EventEmitter();
        /** Emits when an `input` event is fired on this `<input>`. */
        this.colorInput = new EventEmitter();
        /** Emits when the disabled state has changed */
        this._disabledChange = new EventEmitter();
        /** Emits when the value changes (either due to user input or programmatic change). */
        this._valueChange = new EventEmitter();
        this._onTouched = () => { };
        this._validatorOnChange = () => { };
        this._cvaOnChange = () => { };
        this._pickerSubscription = Subscription.EMPTY;
        /** The combined form control validator for this input. */
        this._validator = Validators.compose([]);
        /** Whether the last value set on the input was valid. */
        this._lastValueValid = false;
    }
    ngAfterViewInit() {
        this._isInitialized = true;
    }
    ngOnDestroy() {
        this._pickerSubscription.unsubscribe();
        this._valueChange.complete();
        this._disabledChange.complete();
    }
    registerOnValidatorChange(fn) {
        this._validatorOnChange = fn;
    }
    /** @docs-private */
    validate(c) {
        return this._validator ? this._validator(c) : null;
    }
    /**
     * @deprecated
     * @breaking-change 8.0.0 Use `getConnectedOverlayOrigin` instead
     */
    getPopupConnectionElementRef() {
        return this.getConnectedOverlayOrigin();
    }
    /**
     * Gets the element that the colorpicker popup should be connected to.
     * @return The element to connect the popup to.
     */
    getConnectedOverlayOrigin() {
        return this._formField ? this._formField.getConnectedOverlayOrigin() : this._elementRef;
    }
    /** Gets the ID of an element that should be used a description for the overlay. */
    getOverlayLabelId() {
        if (this._formField) {
            return this._formField.getLabelId();
        }
        return this._elementRef.nativeElement.getAttribute('aria-labelledby');
    }
    // Implemented as part of ControlValueAccessor.
    writeValue(value) {
        this.value = value;
    }
    // Implemented as part of ControlValueAccessor.
    registerOnChange(fn) {
        this._cvaOnChange = fn;
    }
    // Implemented as part of ControlValueAccessor.
    registerOnTouched(fn) {
        this._onTouched = fn;
    }
    // Implemented as part of ControlValueAccessor.
    setDisabledState(isDisabled) {
        this.disabled = isDisabled;
    }
    _onKeydown(event) {
        const isAltDownArrow = event.altKey && event.keyCode === DOWN_ARROW;
        if (this._picker && isAltDownArrow && !this._elementRef.nativeElement.readOnly) {
            this._picker.open();
            event.preventDefault();
        }
    }
    /** Handles blur events on the input. */
    _onBlur() {
        // Reformat the input only if we have a valid value.
        if (this.value) {
            this._formatValue(this.value);
        }
        this._onTouched();
    }
    _onInput(value) {
        const nextValue = value;
        this._value = nextValue;
        this._cvaOnChange(nextValue);
        this._valueChange.emit(nextValue);
        this.colorInput.emit(new MtxColorPickerInputEvent(this, this._elementRef.nativeElement));
    }
    _onChange() {
        this.colorChange.emit(new MtxColorPickerInputEvent(this, this._elementRef.nativeElement));
    }
    /** Returns the palette used by the input's form field, if any. */
    getThemePalette() {
        return this._formField ? this._formField.color : undefined;
    }
    /** TODO: Formats a value and sets it on the input element. */
    _formatValue(value) {
        this._elementRef.nativeElement.value = value ? value : '';
    }
}
/** @nocollapse */ MtxColorpickerInput.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MtxColorpickerInput, deps: [{ token: i0.ElementRef }, { token: i1.MatFormField, optional: true }], target: i0.ɵɵFactoryTarget.Directive });
/** @nocollapse */ MtxColorpickerInput.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.2.1", type: MtxColorpickerInput, selector: "input[mtxColorpicker]", inputs: { mtxColorpicker: "mtxColorpicker", disabled: "disabled", value: "value", format: "format" }, outputs: { colorChange: "colorChange", colorInput: "colorInput" }, host: { listeners: { "input": "_onInput($event.target.value)", "change": "_onChange()", "blur": "_onBlur()", "keydown": "_onKeydown($event)" }, properties: { "attr.aria-haspopup": "_picker ? \"dialog\" : null", "attr.aria-owns": "(_picker?.opened && _picker.id) || null", "disabled": "disabled" }, classAttribute: "mtx-colorpicker-input" }, providers: [
        MTX_COLORPICKER_VALUE_ACCESSOR,
        MTX_COLORPICKER_VALIDATORS,
        { provide: MAT_INPUT_VALUE_ACCESSOR, useExisting: MtxColorpickerInput },
    ], exportAs: ["mtxColorpickerInput"], ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MtxColorpickerInput, decorators: [{
            type: Directive,
            args: [{
                    selector: 'input[mtxColorpicker]',
                    providers: [
                        MTX_COLORPICKER_VALUE_ACCESSOR,
                        MTX_COLORPICKER_VALIDATORS,
                        { provide: MAT_INPUT_VALUE_ACCESSOR, useExisting: MtxColorpickerInput },
                    ],
                    host: {
                        'class': 'mtx-colorpicker-input',
                        '[attr.aria-haspopup]': '_picker ? "dialog" : null',
                        '[attr.aria-owns]': '(_picker?.opened && _picker.id) || null',
                        '[disabled]': 'disabled',
                        '(input)': '_onInput($event.target.value)',
                        '(change)': '_onChange()',
                        '(blur)': '_onBlur()',
                        '(keydown)': '_onKeydown($event)',
                    },
                    exportAs: 'mtxColorpickerInput',
                }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i1.MatFormField, decorators: [{
                    type: Optional
                }] }]; }, propDecorators: { mtxColorpicker: [{
                type: Input
            }], disabled: [{
                type: Input
            }], value: [{
                type: Input
            }], format: [{
                type: Input
            }], colorChange: [{
                type: Output
            }], colorInput: [{
                type: Output
            }] } });

/** Can be used to override the icon of a `mtxColorpickerToggle`. */
class MtxColorpickerToggleIcon {
}
/** @nocollapse */ MtxColorpickerToggleIcon.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MtxColorpickerToggleIcon, deps: [], target: i0.ɵɵFactoryTarget.Directive });
/** @nocollapse */ MtxColorpickerToggleIcon.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.2.1", type: MtxColorpickerToggleIcon, selector: "[mtxColorpickerToggleIcon]", ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MtxColorpickerToggleIcon, decorators: [{
            type: Directive,
            args: [{
                    selector: '[mtxColorpickerToggleIcon]',
                }]
        }] });
class MtxColorpickerToggle {
    /** Whether the toggle button is disabled. */
    get disabled() {
        if (this._disabled == null && this.picker) {
            return this.picker.disabled;
        }
        return !!this._disabled;
    }
    set disabled(value) {
        this._disabled = coerceBooleanProperty(value);
    }
    constructor(_changeDetectorRef, defaultTabIndex) {
        this._changeDetectorRef = _changeDetectorRef;
        this._stateChanges = Subscription.EMPTY;
        const parsedTabIndex = Number(defaultTabIndex);
        this.tabIndex = parsedTabIndex || parsedTabIndex === 0 ? parsedTabIndex : null;
    }
    ngOnChanges(changes) {
        if (changes.picker) {
            this._watchStateChanges();
        }
    }
    ngOnDestroy() {
        this._stateChanges.unsubscribe();
    }
    ngAfterContentInit() {
        this._watchStateChanges();
    }
    _open(event) {
        if (this.picker && !this.disabled) {
            this.picker.open();
            event.stopPropagation();
        }
    }
    _watchStateChanges() {
        const pickerDisabled = this.picker ? this.picker._disabledChange : of();
        const inputDisabled = this.picker && this.picker.pickerInput
            ? this.picker.pickerInput._disabledChange
            : of();
        const pickerToggled = this.picker
            ? merge(this.picker.openedStream, this.picker.closedStream)
            : of();
        this._stateChanges.unsubscribe();
        this._stateChanges = merge(pickerDisabled, inputDisabled, pickerToggled).subscribe(() => this._changeDetectorRef.markForCheck());
    }
}
/** @nocollapse */ MtxColorpickerToggle.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MtxColorpickerToggle, deps: [{ token: i0.ChangeDetectorRef }, { token: 'tabindex', attribute: true }], target: i0.ɵɵFactoryTarget.Component });
/** @nocollapse */ MtxColorpickerToggle.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.1", type: MtxColorpickerToggle, selector: "mtx-colorpicker-toggle", inputs: { picker: ["for", "picker"], tabIndex: "tabIndex", ariaLabel: ["aria-label", "ariaLabel"], disabled: "disabled", disableRipple: "disableRipple" }, host: { listeners: { "click": "_open($event)" }, properties: { "attr.tabindex": "null", "class.mtx-colorpicker-toggle-active": "picker && picker.opened", "class.mat-accent": "picker && picker.color === \"accent\"", "class.mat-warn": "picker && picker.color === \"warn\"" }, classAttribute: "mtx-colorpicker-toggle" }, queries: [{ propertyName: "_customIcon", first: true, predicate: MtxColorpickerToggleIcon, descendants: true }], viewQueries: [{ propertyName: "_button", first: true, predicate: ["button"], descendants: true }], exportAs: ["mtxColorpickerToggle"], usesOnChanges: true, ngImport: i0, template: "<button #button\n        mat-icon-button\n        type=\"button\"\n        [attr.aria-haspopup]=\"picker ? 'dialog' : null\"\n        [attr.aria-label]=\"ariaLabel\"\n        [attr.tabindex]=\"disabled ? -1 : tabIndex\"\n        [disabled]=\"disabled\"\n        [disableRipple]=\"disableRipple\">\n\n  <svg *ngIf=\"!_customIcon\"\n       class=\"mtx-colorpicker-toggle-default-icon\"\n       viewBox=\"0 0 24 24\"\n       width=\"24px\"\n       height=\"24px\"\n       fill=\"currentColor\"\n       focusable=\"false\">\n    <path\n          d=\"M17.5,12A1.5,1.5 0 0,1 16,10.5A1.5,1.5 0 0,1 17.5,9A1.5,1.5 0 0,1 19,10.5A1.5,1.5 0 0,1 17.5,12M14.5,8A1.5,1.5 0 0,1 13,6.5A1.5,1.5 0 0,1 14.5,5A1.5,1.5 0 0,1 16,6.5A1.5,1.5 0 0,1 14.5,8M9.5,8A1.5,1.5 0 0,1 8,6.5A1.5,1.5 0 0,1 9.5,5A1.5,1.5 0 0,1 11,6.5A1.5,1.5 0 0,1 9.5,8M6.5,12A1.5,1.5 0 0,1 5,10.5A1.5,1.5 0 0,1 6.5,9A1.5,1.5 0 0,1 8,10.5A1.5,1.5 0 0,1 6.5,12M12,3A9,9 0 0,0 3,12A9,9 0 0,0 12,21A1.5,1.5 0 0,0 13.5,19.5C13.5,19.11 13.35,18.76 13.11,18.5C12.88,18.23 12.73,17.88 12.73,17.5A1.5,1.5 0 0,1 14.23,16H16A5,5 0 0,0 21,11C21,6.58 16.97,3 12,3Z\" />\n  </svg>\n\n  <ng-content select=\"[mtxColorpickerToggleIcon]\"></ng-content>\n</button>\n", styles: [".mat-form-field-appearance-legacy .mat-form-field-prefix .mtx-colorpicker-toggle-default-icon,.mat-form-field-appearance-legacy .mat-form-field-suffix .mtx-colorpicker-toggle-default-icon{width:1em}.mat-form-field:not(.mat-form-field-appearance-legacy) .mat-form-field-prefix .mtx-colorpicker-toggle-default-icon,.mat-form-field:not(.mat-form-field-appearance-legacy) .mat-form-field-suffix .mtx-colorpicker-toggle-default-icon{display:block;width:1.5em;height:1.5em}.mat-form-field:not(.mat-form-field-appearance-legacy) .mat-form-field-prefix .mat-icon-button .mtx-colorpicker-toggle-default-icon,.mat-form-field:not(.mat-form-field-appearance-legacy) .mat-form-field-suffix .mat-icon-button .mtx-colorpicker-toggle-default-icon{margin:auto}\n"], dependencies: [{ kind: "directive", type: i1$1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "component", type: i2.MatIconButton, selector: "button[mat-icon-button]", inputs: ["disabled", "disableRipple", "color"], exportAs: ["matButton"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MtxColorpickerToggle, decorators: [{
            type: Component,
            args: [{ selector: 'mtx-colorpicker-toggle', host: {
                        'class': 'mtx-colorpicker-toggle',
                        '[attr.tabindex]': 'null',
                        '[class.mtx-colorpicker-toggle-active]': 'picker && picker.opened',
                        '[class.mat-accent]': 'picker && picker.color === "accent"',
                        '[class.mat-warn]': 'picker && picker.color === "warn"',
                        // Bind the `click` on the host, rather than the inner `button`, so that we can call
                        // `stopPropagation` on it without affecting the user's `click` handlers. We need to stop
                        // it so that the input doesn't get focused automatically by the form field (See #21836).
                        '(click)': '_open($event)',
                    }, exportAs: 'mtxColorpickerToggle', encapsulation: ViewEncapsulation.None, changeDetection: ChangeDetectionStrategy.OnPush, template: "<button #button\n        mat-icon-button\n        type=\"button\"\n        [attr.aria-haspopup]=\"picker ? 'dialog' : null\"\n        [attr.aria-label]=\"ariaLabel\"\n        [attr.tabindex]=\"disabled ? -1 : tabIndex\"\n        [disabled]=\"disabled\"\n        [disableRipple]=\"disableRipple\">\n\n  <svg *ngIf=\"!_customIcon\"\n       class=\"mtx-colorpicker-toggle-default-icon\"\n       viewBox=\"0 0 24 24\"\n       width=\"24px\"\n       height=\"24px\"\n       fill=\"currentColor\"\n       focusable=\"false\">\n    <path\n          d=\"M17.5,12A1.5,1.5 0 0,1 16,10.5A1.5,1.5 0 0,1 17.5,9A1.5,1.5 0 0,1 19,10.5A1.5,1.5 0 0,1 17.5,12M14.5,8A1.5,1.5 0 0,1 13,6.5A1.5,1.5 0 0,1 14.5,5A1.5,1.5 0 0,1 16,6.5A1.5,1.5 0 0,1 14.5,8M9.5,8A1.5,1.5 0 0,1 8,6.5A1.5,1.5 0 0,1 9.5,5A1.5,1.5 0 0,1 11,6.5A1.5,1.5 0 0,1 9.5,8M6.5,12A1.5,1.5 0 0,1 5,10.5A1.5,1.5 0 0,1 6.5,9A1.5,1.5 0 0,1 8,10.5A1.5,1.5 0 0,1 6.5,12M12,3A9,9 0 0,0 3,12A9,9 0 0,0 12,21A1.5,1.5 0 0,0 13.5,19.5C13.5,19.11 13.35,18.76 13.11,18.5C12.88,18.23 12.73,17.88 12.73,17.5A1.5,1.5 0 0,1 14.23,16H16A5,5 0 0,0 21,11C21,6.58 16.97,3 12,3Z\" />\n  </svg>\n\n  <ng-content select=\"[mtxColorpickerToggleIcon]\"></ng-content>\n</button>\n", styles: [".mat-form-field-appearance-legacy .mat-form-field-prefix .mtx-colorpicker-toggle-default-icon,.mat-form-field-appearance-legacy .mat-form-field-suffix .mtx-colorpicker-toggle-default-icon{width:1em}.mat-form-field:not(.mat-form-field-appearance-legacy) .mat-form-field-prefix .mtx-colorpicker-toggle-default-icon,.mat-form-field:not(.mat-form-field-appearance-legacy) .mat-form-field-suffix .mtx-colorpicker-toggle-default-icon{display:block;width:1.5em;height:1.5em}.mat-form-field:not(.mat-form-field-appearance-legacy) .mat-form-field-prefix .mat-icon-button .mtx-colorpicker-toggle-default-icon,.mat-form-field:not(.mat-form-field-appearance-legacy) .mat-form-field-suffix .mat-icon-button .mtx-colorpicker-toggle-default-icon{margin:auto}\n"] }]
        }], ctorParameters: function () { return [{ type: i0.ChangeDetectorRef }, { type: undefined, decorators: [{
                    type: Attribute,
                    args: ['tabindex']
                }] }]; }, propDecorators: { picker: [{
                type: Input,
                args: ['for']
            }], tabIndex: [{
                type: Input
            }], ariaLabel: [{
                type: Input,
                args: ['aria-label']
            }], disabled: [{
                type: Input
            }], disableRipple: [{
                type: Input
            }], _customIcon: [{
                type: ContentChild,
                args: [MtxColorpickerToggleIcon]
            }], _button: [{
                type: ViewChild,
                args: ['button']
            }] } });

/**
 * Animations used by the colorpicker.
 * @docs-private
 */
const mtxColorpickerAnimations = {
    /** Transforms the height of the colorpicker's panel. */
    transformPanel: trigger('transformPanel', [
        transition('void => enter-dropdown', animate('120ms cubic-bezier(0, 0, 0.2, 1)', keyframes([
            style({ opacity: 0, transform: 'scale(1, 0.8)' }),
            style({ opacity: 1, transform: 'scale(1, 1)' }),
        ]))),
        transition('* => void', animate('100ms linear', style({ opacity: 0 }))),
    ]),
};

/** Used to generate a unique ID for each colorpicker instance. */
let colorpickerUid = 0;
/** Injection token that determines the scroll handling while the panel is open. */
const MTX_COLORPICKER_SCROLL_STRATEGY = new InjectionToken('mtx-colorpicker-scroll-strategy');
function MTX_COLORPICKER_SCROLL_STRATEGY_FACTORY(overlay) {
    return () => overlay.scrollStrategies.reposition();
}
const MTX_COLORPICKER_SCROLL_STRATEGY_FACTORY_PROVIDER = {
    provide: MTX_COLORPICKER_SCROLL_STRATEGY,
    deps: [Overlay],
    useFactory: MTX_COLORPICKER_SCROLL_STRATEGY_FACTORY,
};
// Boilerplate for applying mixins to MtxColorpickerContent.
/** @docs-private */
const _MtxColorpickerContentBase = mixinColor(class {
    constructor(_elementRef) {
        this._elementRef = _elementRef;
    }
});
class MtxColorpickerContent extends _MtxColorpickerContentBase {
    constructor(elementRef, _changeDetectorRef) {
        super(elementRef);
        this._changeDetectorRef = _changeDetectorRef;
        /** Current state of the animation. */
        this._animationState = 'enter-dropdown';
        /** Emits when an animation has finished. */
        this._animationDone = new Subject();
    }
    _startExitAnimation() {
        this._animationState = 'void';
        this._changeDetectorRef.markForCheck();
    }
    ngOnDestroy() {
        this._animationDone.complete();
    }
    getColorString(e) {
        return {
            hex: e.color.rgb.a === 1 ? e.color.hex : new TinyColor(e.color.rgb).toHex8String(),
            rgb: new TinyColor(e.color.rgb).toRgbString(),
            hsl: new TinyColor(e.color.hsl).toHslString(),
            hsv: new TinyColor(e.color.hsv).toHsvString(),
        }[this.picker.format];
    }
}
/** @nocollapse */ MtxColorpickerContent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MtxColorpickerContent, deps: [{ token: i0.ElementRef }, { token: i0.ChangeDetectorRef }], target: i0.ɵɵFactoryTarget.Component });
/** @nocollapse */ MtxColorpickerContent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.1", type: MtxColorpickerContent, selector: "mtx-colorpicker-content", inputs: { color: "color" }, host: { listeners: { "@transformPanel.done": "_animationDone.next()" }, properties: { "@transformPanel": "_animationState" }, classAttribute: "mtx-colorpicker-content" }, exportAs: ["mtxColorpickerContent"], usesInheritance: true, ngImport: i0, template: "<ng-template [ngIf]=\"picker.content\" [ngIfElse]=\"default\"\n             [ngTemplateOutlet]=\"picker.content\">\n</ng-template>\n<ng-template #default>\n  <color-chrome [color]=\"picker.selected\"\n                (onChangeComplete)=\"picker.select(getColorString($event))\">\n  </color-chrome>\n</ng-template>\n", styles: [".mtx-colorpicker-content{display:block;border-radius:4px}\n"], dependencies: [{ kind: "directive", type: i1$1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i1$1.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "component", type: i2$1.ChromeComponent, selector: "color-chrome", inputs: ["disableAlpha"] }], animations: [mtxColorpickerAnimations.transformPanel], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MtxColorpickerContent, decorators: [{
            type: Component,
            args: [{ selector: 'mtx-colorpicker-content', host: {
                        'class': 'mtx-colorpicker-content',
                        '[@transformPanel]': '_animationState',
                        '(@transformPanel.done)': '_animationDone.next()',
                    }, animations: [mtxColorpickerAnimations.transformPanel], exportAs: 'mtxColorpickerContent', encapsulation: ViewEncapsulation.None, changeDetection: ChangeDetectionStrategy.OnPush, inputs: ['color'], template: "<ng-template [ngIf]=\"picker.content\" [ngIfElse]=\"default\"\n             [ngTemplateOutlet]=\"picker.content\">\n</ng-template>\n<ng-template #default>\n  <color-chrome [color]=\"picker.selected\"\n                (onChangeComplete)=\"picker.select(getColorString($event))\">\n  </color-chrome>\n</ng-template>\n", styles: [".mtx-colorpicker-content{display:block;border-radius:4px}\n"] }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i0.ChangeDetectorRef }]; } });
class MtxColorpicker {
    get disabled() {
        return this._disabled === undefined && this.pickerInput
            ? this.pickerInput.disabled
            : !!this._disabled;
    }
    set disabled(value) {
        const newValue = coerceBooleanProperty(value);
        if (newValue !== this._disabled) {
            this._disabled = newValue;
            this._disabledChange.next(newValue);
        }
    }
    /**
     * Whether to restore focus to the previously-focused element when the panel is closed.
     * Note that automatic focus restoration is an accessibility feature and it is recommended that
     * you provide your own equivalent, if you decide to turn it off.
     */
    get restoreFocus() {
        return this._restoreFocus;
    }
    set restoreFocus(value) {
        this._restoreFocus = coerceBooleanProperty(value);
    }
    /** Whether the panel is open. */
    get opened() {
        return this._opened;
    }
    set opened(value) {
        coerceBooleanProperty(value) ? this.open() : this.close();
    }
    /** Color palette to use on the colorpicker's panel. */
    get color() {
        return this._color || (this.pickerInput ? this.pickerInput.getThemePalette() : undefined);
    }
    set color(value) {
        this._color = value;
    }
    /** The input and output color format. */
    get format() {
        return this._format || this.pickerInput.format;
    }
    set format(value) {
        this._format = value;
    }
    /** The currently selected color. */
    get selected() {
        return this._validSelected;
    }
    set selected(value) {
        this._validSelected = value;
    }
    constructor(_overlay, _ngZone, _viewContainerRef, scrollStrategy, _dir, _document) {
        this._overlay = _overlay;
        this._ngZone = _ngZone;
        this._viewContainerRef = _viewContainerRef;
        this._dir = _dir;
        this._document = _document;
        this._inputStateChanges = Subscription.EMPTY;
        /** Emits when the colorpicker has been opened. */
        this.openedStream = new EventEmitter();
        /** Emits when the colorpicker has been closed. */
        this.closedStream = new EventEmitter();
        /** Preferred position of the colorpicker in the X axis. */
        this.xPosition = 'start';
        /** Preferred position of the colorpicker in the Y axis. */
        this.yPosition = 'below';
        this._restoreFocus = true;
        this._opened = false;
        /** The id for the colorpicker panel. */
        this.id = `mtx-colorpicker-${colorpickerUid++}`;
        this._validSelected = '';
        /** The element that was focused before the colorpicker was opened. */
        this._focusedElementBeforeOpen = null;
        /** Unique class that will be added to the backdrop so that the test harnesses can look it up. */
        this._backdropHarnessClass = `${this.id}-backdrop`;
        /** Emits when the datepicker is disabled. */
        this._disabledChange = new Subject();
        /** Emits new selected color when selected color changes. */
        this._selectedChanged = new Subject();
        this._scrollStrategy = scrollStrategy;
    }
    ngOnChanges() { }
    ngOnDestroy() {
        this._destroyOverlay();
        this.close();
        this._inputStateChanges.unsubscribe();
        this._disabledChange.complete();
    }
    /** Selects the given color. */
    select(nextVal) {
        const oldValue = this.selected;
        this.selected = nextVal;
        // TODO: `nextVal` should compare with `oldValue`
        this._selectedChanged.next(nextVal);
    }
    /**
     * Register an input with this colorpicker.
     * @param input The colorpicker input to register with this colorpicker.
     */
    registerInput(input) {
        if (this.pickerInput) {
            throw Error('A Colorpicker can only be associated with a single input.');
        }
        this.pickerInput = input;
        this._inputStateChanges = input._valueChange.subscribe((value) => (this.selected = value));
    }
    /** Open the panel. */
    open() {
        if (this._opened || this.disabled) {
            return;
        }
        if (!this.pickerInput) {
            throw Error('Attempted to open an Colorpicker with no associated input.');
        }
        if (this._document) {
            this._focusedElementBeforeOpen = this._document.activeElement;
        }
        this._openOverlay();
        this._opened = true;
        this.openedStream.emit();
    }
    /** Close the panel. */
    close() {
        if (!this._opened) {
            return;
        }
        if (this._componentRef) {
            const instance = this._componentRef.instance;
            instance._startExitAnimation();
            instance._animationDone.pipe(take(1)).subscribe(() => this._destroyOverlay());
        }
        const completeClose = () => {
            // The `_opened` could've been reset already if
            // we got two events in quick succession.
            if (this._opened) {
                this._opened = false;
                this.closedStream.emit();
                this._focusedElementBeforeOpen = null;
            }
        };
        if (this._restoreFocus &&
            this._focusedElementBeforeOpen &&
            typeof this._focusedElementBeforeOpen.focus === 'function') {
            // Because IE moves focus asynchronously, we can't count on it being restored before we've
            // marked the colorpicker as closed. If the event fires out of sequence and the element that
            // we're refocusing opens the colorpicker on focus, the user could be stuck with not being
            // able to close the panel at all. We work around it by making the logic, that marks
            // the colorpicker as closed, async as well.
            this._focusedElementBeforeOpen.focus();
            setTimeout(completeClose);
        }
        else {
            completeClose();
        }
    }
    /** Forwards relevant values from the colorpicker to the colorpicker content inside the overlay. */
    _forwardContentValues(instance) {
        instance.picker = this;
        instance.color = this.color;
    }
    /** Open the colopicker as a popup. */
    _openOverlay() {
        this._destroyOverlay();
        const labelId = this.pickerInput.getOverlayLabelId();
        const portal = new ComponentPortal(MtxColorpickerContent, this._viewContainerRef);
        const overlayRef = (this._overlayRef = this._overlay.create(new OverlayConfig({
            positionStrategy: this._getDropdownStrategy(),
            hasBackdrop: true,
            backdropClass: ['mat-overlay-transparent-backdrop', this._backdropHarnessClass],
            direction: this._dir,
            scrollStrategy: this._scrollStrategy(),
            panelClass: `mtx-colorpicker-popup`,
        })));
        const overlayElement = overlayRef.overlayElement;
        overlayElement.setAttribute('role', 'dialog');
        if (labelId) {
            overlayElement.setAttribute('aria-labelledby', labelId);
        }
        this._getCloseStream(overlayRef).subscribe(event => {
            if (event) {
                event.preventDefault();
            }
            this.close();
        });
        this._componentRef = overlayRef.attach(portal);
        this._forwardContentValues(this._componentRef.instance);
        // Update the position once the panel has rendered. Only relevant in dropdown mode.
        this._ngZone.onStable.pipe(take(1)).subscribe(() => overlayRef.updatePosition());
    }
    /** Destroys the current overlay. */
    _destroyOverlay() {
        if (this._overlayRef) {
            this._overlayRef.dispose();
            this._overlayRef = this._componentRef = null;
        }
    }
    /** Gets a position strategy that will open the panel as a dropdown. */
    _getDropdownStrategy() {
        const strategy = this._overlay
            .position()
            .flexibleConnectedTo(this.pickerInput.getConnectedOverlayOrigin())
            .withTransformOriginOn('.mtx-colorpicker-content')
            .withFlexibleDimensions(false)
            .withViewportMargin(8)
            .withLockedPosition();
        return this._setConnectedPositions(strategy);
    }
    /** Sets the positions of the colorpicker in dropdown mode based on the current configuration. */
    _setConnectedPositions(strategy) {
        const primaryX = this.xPosition === 'end' ? 'end' : 'start';
        const secondaryX = primaryX === 'start' ? 'end' : 'start';
        const primaryY = this.yPosition === 'above' ? 'bottom' : 'top';
        const secondaryY = primaryY === 'top' ? 'bottom' : 'top';
        return strategy.withPositions([
            {
                originX: primaryX,
                originY: secondaryY,
                overlayX: primaryX,
                overlayY: primaryY,
            },
            {
                originX: primaryX,
                originY: primaryY,
                overlayX: primaryX,
                overlayY: secondaryY,
            },
            {
                originX: secondaryX,
                originY: secondaryY,
                overlayX: secondaryX,
                overlayY: primaryY,
            },
            {
                originX: secondaryX,
                originY: primaryY,
                overlayX: secondaryX,
                overlayY: secondaryY,
            },
        ]);
    }
    /** Gets an observable that will emit when the overlay is supposed to be closed. */
    _getCloseStream(overlayRef) {
        return merge(overlayRef.backdropClick(), overlayRef.detachments(), overlayRef.keydownEvents().pipe(filter(event => {
            // Closing on alt + up is only valid when there's an input associated with the colorpicker.
            return ((event.keyCode === ESCAPE && !hasModifierKey(event)) ||
                (this.pickerInput && hasModifierKey(event, 'altKey') && event.keyCode === UP_ARROW));
        })));
    }
}
/** @nocollapse */ MtxColorpicker.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MtxColorpicker, deps: [{ token: i3.Overlay }, { token: i0.NgZone }, { token: i0.ViewContainerRef }, { token: MTX_COLORPICKER_SCROLL_STRATEGY }, { token: i4.Directionality, optional: true }, { token: DOCUMENT, optional: true }], target: i0.ɵɵFactoryTarget.Component });
/** @nocollapse */ MtxColorpicker.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.1", type: MtxColorpicker, selector: "mtx-colorpicker", inputs: { content: "content", disabled: "disabled", xPosition: "xPosition", yPosition: "yPosition", restoreFocus: "restoreFocus", opened: "opened", color: "color", format: "format" }, outputs: { openedStream: "opened", closedStream: "closed" }, exportAs: ["mtxColorpicker"], usesOnChanges: true, ngImport: i0, template: '', isInline: true, changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MtxColorpicker, decorators: [{
            type: Component,
            args: [{
                    selector: 'mtx-colorpicker',
                    template: '',
                    exportAs: 'mtxColorpicker',
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    encapsulation: ViewEncapsulation.None,
                }]
        }], ctorParameters: function () { return [{ type: i3.Overlay }, { type: i0.NgZone }, { type: i0.ViewContainerRef }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [MTX_COLORPICKER_SCROLL_STRATEGY]
                }] }, { type: i4.Directionality, decorators: [{
                    type: Optional
                }] }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [DOCUMENT]
                }] }]; }, propDecorators: { content: [{
                type: Input
            }], openedStream: [{
                type: Output,
                args: ['opened']
            }], closedStream: [{
                type: Output,
                args: ['closed']
            }], disabled: [{
                type: Input
            }], xPosition: [{
                type: Input
            }], yPosition: [{
                type: Input
            }], restoreFocus: [{
                type: Input
            }], opened: [{
                type: Input
            }], color: [{
                type: Input
            }], format: [{
                type: Input
            }] } });

class MtxColorpickerModule {
}
/** @nocollapse */ MtxColorpickerModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MtxColorpickerModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
/** @nocollapse */ MtxColorpickerModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "15.2.1", ngImport: i0, type: MtxColorpickerModule, declarations: [MtxColorpicker,
        MtxColorpickerContent,
        MtxColorpickerInput,
        MtxColorpickerToggle,
        MtxColorpickerToggleIcon], imports: [CommonModule,
        OverlayModule,
        A11yModule,
        PortalModule,
        MatButtonModule,
        ColorChromeModule], exports: [MtxColorpicker,
        MtxColorpickerContent,
        MtxColorpickerInput,
        MtxColorpickerToggle,
        MtxColorpickerToggleIcon] });
/** @nocollapse */ MtxColorpickerModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MtxColorpickerModule, providers: [MTX_COLORPICKER_SCROLL_STRATEGY_FACTORY_PROVIDER], imports: [CommonModule,
        OverlayModule,
        A11yModule,
        PortalModule,
        MatButtonModule,
        ColorChromeModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MtxColorpickerModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [
                        CommonModule,
                        OverlayModule,
                        A11yModule,
                        PortalModule,
                        MatButtonModule,
                        ColorChromeModule,
                    ],
                    exports: [
                        MtxColorpicker,
                        MtxColorpickerContent,
                        MtxColorpickerInput,
                        MtxColorpickerToggle,
                        MtxColorpickerToggleIcon,
                    ],
                    declarations: [
                        MtxColorpicker,
                        MtxColorpickerContent,
                        MtxColorpickerInput,
                        MtxColorpickerToggle,
                        MtxColorpickerToggleIcon,
                    ],
                    providers: [MTX_COLORPICKER_SCROLL_STRATEGY_FACTORY_PROVIDER],
                }]
        }] });

/**
 * Generated bundle index. Do not edit.
 */

export { MTX_COLORPICKER_SCROLL_STRATEGY, MTX_COLORPICKER_SCROLL_STRATEGY_FACTORY, MTX_COLORPICKER_SCROLL_STRATEGY_FACTORY_PROVIDER, MTX_COLORPICKER_VALIDATORS, MTX_COLORPICKER_VALUE_ACCESSOR, MtxColorpicker, MtxColorpickerContent, MtxColorpickerInput, MtxColorpickerModule, MtxColorpickerToggle, MtxColorpickerToggleIcon, mtxColorpickerAnimations };
//# sourceMappingURL=mtxColorpicker.mjs.map
