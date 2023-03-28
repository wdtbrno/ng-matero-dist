import { Directive, EventEmitter, forwardRef, Inject, Input, Optional, Output, } from '@angular/core';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR, Validators, } from '@angular/forms';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { DOWN_ARROW } from '@angular/cdk/keycodes';
import { MAT_INPUT_VALUE_ACCESSOR } from '@angular/material/input';
import { Subscription } from 'rxjs';
import { MTX_DATETIME_FORMATS, } from '@ng-matero/extensions/core';
import { createMissingDateImplError } from './datetimepicker-errors';
import { MtxDatetimepickerFilterType } from './datetimepicker-filtertype';
import * as i0 from "@angular/core";
import * as i1 from "@ng-matero/extensions/core";
import * as i2 from "@angular/material/form-field";
export const MAT_DATETIMEPICKER_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => MtxDatetimepickerInput),
    multi: true,
};
export const MAT_DATETIMEPICKER_VALIDATORS = {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(() => MtxDatetimepickerInput),
    multi: true,
};
/**
 * An event used for datetimepicker input and change events. We don't always have access to a native
 * input or change event because the event may have been triggered by the user clicking on the
 * calendar popup. For consistency, we always use MtxDatetimepickerInputEvent instead.
 */
export class MtxDatetimepickerInputEvent {
    constructor(target, targetElement) {
        this.target = target;
        this.targetElement = targetElement;
        this.value = this.target.value;
    }
}
/** Directive used to connect an input to a MtxDatetimepicker. */
export class MtxDatetimepickerInput {
    constructor(_elementRef, _dateAdapter, _dateFormats, _formField) {
        this._elementRef = _elementRef;
        this._dateAdapter = _dateAdapter;
        this._dateFormats = _dateFormats;
        this._formField = _formField;
        /** Emits when a `change` event is fired on this `<input>`. */
        this.dateChange = new EventEmitter();
        /** Emits when an `input` event is fired on this `<input>`. */
        this.dateInput = new EventEmitter();
        /** Emits when the value changes (either due to user input or programmatic change). */
        this._valueChange = new EventEmitter();
        /** Emits when the disabled state has changed */
        this._disabledChange = new EventEmitter();
        this._datetimepickerSubscription = Subscription.EMPTY;
        this._localeSubscription = Subscription.EMPTY;
        /** Whether the last value set on the input was valid. */
        this._lastValueValid = false;
        this._onTouched = () => { };
        this._cvaOnChange = () => { };
        this._validatorOnChange = () => { };
        /** The form control validator for whether the input parses. */
        this._parseValidator = () => {
            return this._lastValueValid
                ? null
                : { mtxDatetimepickerParse: { text: this._elementRef.nativeElement.value } };
        };
        /** The form control validator for the min date. */
        this._minValidator = (control) => {
            const controlValue = this._dateAdapter.getValidDateOrNull(this._dateAdapter.deserialize(control.value));
            return !this.min ||
                !controlValue ||
                this._dateAdapter.compareDatetime(this.min, controlValue) <= 0
                ? null
                : { mtxDatetimepickerMin: { min: this.min, actual: controlValue } };
        };
        /** The form control validator for the max date. */
        this._maxValidator = (control) => {
            const controlValue = this._dateAdapter.getValidDateOrNull(this._dateAdapter.deserialize(control.value));
            return !this.max ||
                !controlValue ||
                this._dateAdapter.compareDatetime(this.max, controlValue) >= 0
                ? null
                : { mtxDatetimepickerMax: { max: this.max, actual: controlValue } };
        };
        /** The form control validator for the date filter. */
        this._filterValidator = (control) => {
            const controlValue = this._dateAdapter.getValidDateOrNull(this._dateAdapter.deserialize(control.value));
            return !this._dateFilter ||
                !controlValue ||
                this._dateFilter(controlValue, MtxDatetimepickerFilterType.DATE)
                ? null
                : { mtxDatetimepickerFilter: true };
        };
        /** The combined form control validator for this input. */
        this._validator = Validators.compose([
            this._parseValidator,
            this._minValidator,
            this._maxValidator,
            this._filterValidator,
        ]);
        if (!this._dateAdapter) {
            throw createMissingDateImplError('DatetimeAdapter');
        }
        if (!this._dateFormats) {
            throw createMissingDateImplError('MTX_DATETIME_FORMATS');
        }
        // Update the displayed date when the locale changes.
        this._localeSubscription = _dateAdapter.localeChanges.subscribe(() => {
            this.value = this._dateAdapter.deserialize(this.value);
        });
    }
    /** The datetimepicker that this input is associated with. */
    set mtxDatetimepicker(value) {
        this.registerDatetimepicker(value);
    }
    set mtxDatetimepickerFilter(filter) {
        this._dateFilter = filter;
        this._validatorOnChange();
    }
    /** The value of the input. */
    get value() {
        return this._value;
    }
    set value(value) {
        value = this._dateAdapter.deserialize(value);
        this._lastValueValid = !value || this._dateAdapter.isValid(value);
        value = this._dateAdapter.getValidDateOrNull(value);
        const oldDate = this.value;
        this._value = value;
        this._formatValue(value);
        // use timeout to ensure the datetimepicker is instantiated and we get the correct format
        setTimeout(() => {
            if (!this._dateAdapter.sameDatetime(oldDate, value)) {
                this._valueChange.emit(value);
            }
        });
    }
    /** The minimum valid date. */
    get min() {
        return this._min;
    }
    set min(value) {
        this._min = this._dateAdapter.getValidDateOrNull(this._dateAdapter.deserialize(value));
        this._validatorOnChange();
    }
    /** The maximum valid date. */
    get max() {
        return this._max;
    }
    set max(value) {
        this._max = this._dateAdapter.getValidDateOrNull(this._dateAdapter.deserialize(value));
        this._validatorOnChange();
    }
    /** Whether the datetimepicker-input is disabled. */
    get disabled() {
        return !!this._disabled;
    }
    set disabled(value) {
        const newValue = coerceBooleanProperty(value);
        if (this._disabled !== newValue) {
            this._disabled = newValue;
            this._disabledChange.emit(newValue);
        }
    }
    ngAfterContentInit() {
        if (this._datetimepicker) {
            this._datetimepickerSubscription = this._datetimepicker.selectedChanged.subscribe((selected) => {
                this.value = selected;
                this._cvaOnChange(selected);
                this._onTouched();
                this.dateInput.emit(new MtxDatetimepickerInputEvent(this, this._elementRef.nativeElement));
                this.dateChange.emit(new MtxDatetimepickerInputEvent(this, this._elementRef.nativeElement));
            });
        }
    }
    ngOnDestroy() {
        this._datetimepickerSubscription.unsubscribe();
        this._localeSubscription.unsubscribe();
        this._valueChange.complete();
        this._disabledChange.complete();
    }
    registerOnValidatorChange(fn) {
        this._validatorOnChange = fn;
    }
    validate(c) {
        return this._validator ? this._validator(c) : null;
    }
    /**
     * Gets the element that the datetimepicker popup should be connected to.
     * @return The element to connect the popup to.
     */
    getConnectedOverlayOrigin() {
        return this._formField ? this._formField.getConnectedOverlayOrigin() : this._elementRef;
    }
    /** Gets the ID of an element that should be used a description for the calendar overlay. */
    getOverlayLabelId() {
        if (this._formField) {
            return this._formField.getLabelId();
        }
        return this._elementRef.nativeElement.getAttribute('aria-labelledby');
    }
    // Implemented as part of ControlValueAccessor
    writeValue(value) {
        this.value = value;
    }
    // Implemented as part of ControlValueAccessor
    registerOnChange(fn) {
        this._cvaOnChange = fn;
    }
    // Implemented as part of ControlValueAccessor
    registerOnTouched(fn) {
        this._onTouched = fn;
    }
    // Implemented as part of ControlValueAccessor
    setDisabledState(disabled) {
        this.disabled = disabled;
    }
    _onKeydown(event) {
        if (event.altKey && event.keyCode === DOWN_ARROW) {
            this._datetimepicker.open();
            event.preventDefault();
        }
    }
    _onInput(value) {
        let date = this._dateAdapter.parse(value, this.getParseFormat());
        this._lastValueValid = !date || this._dateAdapter.isValid(date);
        date = this._dateAdapter.getValidDateOrNull(date);
        this._value = date;
        this._cvaOnChange(date);
        this._valueChange.emit(date);
        this.dateInput.emit(new MtxDatetimepickerInputEvent(this, this._elementRef.nativeElement));
    }
    _onChange() {
        this.dateChange.emit(new MtxDatetimepickerInputEvent(this, this._elementRef.nativeElement));
    }
    /** Handles blur events on the input. */
    _onBlur() {
        // Reformat the input only if we have a valid value.
        if (this.value) {
            this._formatValue(this.value);
        }
        this._onTouched();
    }
    registerDatetimepicker(value) {
        if (value) {
            this._datetimepicker = value;
            this._datetimepicker._registerInput(this);
        }
    }
    getDisplayFormat() {
        switch (this._datetimepicker.type) {
            case 'date':
                return this._dateFormats.display.dateInput;
            case 'datetime':
                return this._dateFormats.display.datetimeInput;
            case 'time':
                return this._dateFormats.display.timeInput;
            case 'month':
                return this._dateFormats.display.monthInput;
            case 'year':
                return this._dateFormats.display.yearInput;
        }
    }
    getParseFormat() {
        let parseFormat;
        switch (this._datetimepicker.type) {
            case 'date':
                parseFormat = this._dateFormats.parse.dateInput;
                break;
            case 'datetime':
                parseFormat = this._dateFormats.parse.datetimeInput;
                break;
            case 'time':
                parseFormat = this._dateFormats.parse.timeInput;
                break;
            case 'month':
                parseFormat = this._dateFormats.parse.monthInput;
                break;
            case 'year':
                parseFormat = this._dateFormats.parse.yearInput;
                break;
        }
        if (!parseFormat) {
            parseFormat = this._dateFormats.parse.dateInput;
        }
        return parseFormat;
    }
    /** Formats a value and sets it on the input element. */
    _formatValue(value) {
        this._elementRef.nativeElement.value = value
            ? this._dateAdapter.format(value, this.getDisplayFormat())
            : '';
    }
    /** Returns the palette used by the input's form field, if any. */
    getThemePalette() {
        return this._formField ? this._formField.color : undefined;
    }
}
/** @nocollapse */ MtxDatetimepickerInput.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MtxDatetimepickerInput, deps: [{ token: i0.ElementRef }, { token: i1.DatetimeAdapter, optional: true }, { token: MTX_DATETIME_FORMATS, optional: true }, { token: i2.MatFormField, optional: true }], target: i0.ɵɵFactoryTarget.Directive });
/** @nocollapse */ MtxDatetimepickerInput.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.2.1", type: MtxDatetimepickerInput, selector: "input[mtxDatetimepicker]", inputs: { mtxDatetimepicker: "mtxDatetimepicker", mtxDatetimepickerFilter: "mtxDatetimepickerFilter", value: "value", min: "min", max: "max", disabled: "disabled" }, outputs: { dateChange: "dateChange", dateInput: "dateInput" }, host: { listeners: { "input": "_onInput($event.target.value)", "change": "_onChange()", "blur": "_onBlur()", "keydown": "_onKeydown($event)" }, properties: { "attr.aria-haspopup": "true", "attr.aria-owns": "(_datetimepicker?.opened && _datetimepicker.id) || null", "attr.min": "min ? _dateAdapter.toIso8601(min) : null", "attr.max": "max ? _dateAdapter.toIso8601(max) : null", "disabled": "disabled" } }, providers: [
        MAT_DATETIMEPICKER_VALUE_ACCESSOR,
        MAT_DATETIMEPICKER_VALIDATORS,
        { provide: MAT_INPUT_VALUE_ACCESSOR, useExisting: MtxDatetimepickerInput },
    ], exportAs: ["mtxDatetimepickerInput"], ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MtxDatetimepickerInput, decorators: [{
            type: Directive,
            args: [{
                    selector: 'input[mtxDatetimepicker]',
                    providers: [
                        MAT_DATETIMEPICKER_VALUE_ACCESSOR,
                        MAT_DATETIMEPICKER_VALIDATORS,
                        { provide: MAT_INPUT_VALUE_ACCESSOR, useExisting: MtxDatetimepickerInput },
                    ],
                    host: {
                        '[attr.aria-haspopup]': 'true',
                        '[attr.aria-owns]': '(_datetimepicker?.opened && _datetimepicker.id) || null',
                        '[attr.min]': 'min ? _dateAdapter.toIso8601(min) : null',
                        '[attr.max]': 'max ? _dateAdapter.toIso8601(max) : null',
                        '[disabled]': 'disabled',
                        '(input)': '_onInput($event.target.value)',
                        '(change)': '_onChange()',
                        '(blur)': '_onBlur()',
                        '(keydown)': '_onKeydown($event)',
                    },
                    exportAs: 'mtxDatetimepickerInput',
                }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i1.DatetimeAdapter, decorators: [{
                    type: Optional
                }] }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [MTX_DATETIME_FORMATS]
                }] }, { type: i2.MatFormField, decorators: [{
                    type: Optional
                }] }]; }, propDecorators: { dateChange: [{
                type: Output
            }], dateInput: [{
                type: Output
            }], mtxDatetimepicker: [{
                type: Input
            }], mtxDatetimepickerFilter: [{
                type: Input
            }], value: [{
                type: Input
            }], min: [{
                type: Input
            }], max: [{
                type: Input
            }], disabled: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZXRpbWVwaWNrZXItaW5wdXQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wcm9qZWN0cy9leHRlbnNpb25zL2RhdGV0aW1lcGlja2VyL2RhdGV0aW1lcGlja2VyLWlucHV0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFFTCxTQUFTLEVBRVQsWUFBWSxFQUNaLFVBQVUsRUFDVixNQUFNLEVBQ04sS0FBSyxFQUVMLFFBQVEsRUFDUixNQUFNLEdBQ1AsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUdMLGFBQWEsRUFDYixpQkFBaUIsRUFJakIsVUFBVSxHQUNYLE1BQU0sZ0JBQWdCLENBQUM7QUFDeEIsT0FBTyxFQUFnQixxQkFBcUIsRUFBRSxNQUFNLHVCQUF1QixDQUFDO0FBQzVFLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQztBQUVuRCxPQUFPLEVBQUUsd0JBQXdCLEVBQUUsTUFBTSx5QkFBeUIsQ0FBQztBQUVuRSxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQ3BDLE9BQU8sRUFFTCxvQkFBb0IsR0FFckIsTUFBTSw0QkFBNEIsQ0FBQztBQUVwQyxPQUFPLEVBQUUsMEJBQTBCLEVBQUUsTUFBTSx5QkFBeUIsQ0FBQztBQUNyRSxPQUFPLEVBQUUsMkJBQTJCLEVBQUUsTUFBTSw2QkFBNkIsQ0FBQzs7OztBQUUxRSxNQUFNLENBQUMsTUFBTSxpQ0FBaUMsR0FBUTtJQUNwRCxPQUFPLEVBQUUsaUJBQWlCO0lBQzFCLFdBQVcsRUFBRSxVQUFVLENBQUMsR0FBRyxFQUFFLENBQUMsc0JBQXNCLENBQUM7SUFDckQsS0FBSyxFQUFFLElBQUk7Q0FDWixDQUFDO0FBRUYsTUFBTSxDQUFDLE1BQU0sNkJBQTZCLEdBQVE7SUFDaEQsT0FBTyxFQUFFLGFBQWE7SUFDdEIsV0FBVyxFQUFFLFVBQVUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxzQkFBc0IsQ0FBQztJQUNy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QkFBbkIsTUFBTTtnQkFHRyxTQUFTO3NCQUFsQixNQUFNO2dCQW9DSCxpQkFBaUI7c0JBRHBCLEtBQUs7Z0JBTUYsdUJBQXVCO3NCQUQxQixLQUFLO2dCQVVGLEtBQUs7c0JBRFIsS0FBSztnQkF1QkYsR0FBRztzQkFETixLQUFLO2dCQVlGLEdBQUc7c0JBRE4sS0FBSztnQkFZRixRQUFRO3NCQURYLEtBQUsiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBBZnRlckNvbnRlbnRJbml0LFxuICBEaXJlY3RpdmUsXG4gIEVsZW1lbnRSZWYsXG4gIEV2ZW50RW1pdHRlcixcbiAgZm9yd2FyZFJlZixcbiAgSW5qZWN0LFxuICBJbnB1dCxcbiAgT25EZXN0cm95LFxuICBPcHRpb25hbCxcbiAgT3V0cHV0LFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7XG4gIEFic3RyYWN0Q29udHJvbCxcbiAgQ29udHJvbFZhbHVlQWNjZXNzb3IsXG4gIE5HX1ZBTElEQVRPUlMsXG4gIE5HX1ZBTFVFX0FDQ0VTU09SLFxuICBWYWxpZGF0aW9uRXJyb3JzLFxuICBWYWxpZGF0b3IsXG4gIFZhbGlkYXRvckZuLFxuICBWYWxpZGF0b3JzLFxufSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQgeyBCb29sZWFuSW5wdXQsIGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSB9IGZyb20gJ0Bhbmd1bGFyL2Nkay9jb2VyY2lvbic7XG5pbXBvcnQgeyBET1dOX0FSUk9XIH0gZnJvbSAnQGFuZ3VsYXIvY2RrL2tleWNvZGVzJztcbmltcG9ydCB7IFRoZW1lUGFsZXR0ZSB9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2NvcmUnO1xuaW1wb3J0IHsgTUFUX0lOUFVUX1ZBTFVFX0FDQ0VTU09SIH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvaW5wdXQnO1xuaW1wb3J0IHsgTWF0Rm9ybUZpZWxkIH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvZm9ybS1maWVsZCc7XG5pbXBvcnQgeyBTdWJzY3JpcHRpb24gfSBmcm9tICdyeGpzJztcbmltcG9ydCB7XG4gIERhdGV0aW1lQWRhcHRlcixcbiAgTVRYX0RBVEVUSU1FX0ZPUk1BVFMsXG4gIE10eERhdGV0aW1lRm9ybWF0cyxcbn0gZnJvbSAnQG5nLW1hdGVyby9leHRlbnNpb25zL2NvcmUnO1xuaW1wb3J0IHsgTXR4RGF0ZXRpbWVwaWNrZXIgfSBmcm9tICcuL2RhdGV0aW1lcGlja2VyJztcbmltcG9ydCB7IGNyZWF0ZU1pc3NpbmdEYXRlSW1wbEVycm9yIH0gZnJvbSAnLi9kYXRldGltZXBpY2tlci1lcnJvcnMnO1xuaW1wb3J0IHsgTXR4RGF0ZXRpbWVwaWNrZXJGaWx0ZXJUeXBlIH0gZnJvbSAnLi9kYXRldGltZXBpY2tlci1maWx0ZXJ0eXBlJztcblxuZXhwb3J0IGNvbnN0IE1BVF9EQVRFVElNRVBJQ0tFUl9WQUxVRV9BQ0NFU1NPUjogYW55ID0ge1xuICBwcm92aWRlOiBOR19WQUxVRV9BQ0NFU1NPUixcbiAgdXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gTXR4RGF0ZXRpbWVwaWNrZXJJbnB1dCksXG4gIG11bHRpOiB0cnVlLFxufTtcblxuZXhwb3J0IGNvbnN0IE1BVF9EQVRFVElNRVBJQ0tFUl9WQUxJREFUT1JTOiBhbnkgPSB7XG4gIHByb3ZpZGU6IE5HX1ZBTElEQVRPUlMsXG4gIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IE10eERhdGV0aW1lcGlja2VySW5wdXQpLFxuICBtdWx0aTogdHJ1ZSxcbn07XG5cbi8qKlxuICogQW4gZXZlbnQgdXNlZCBmb3IgZGF0ZXRpbWVwaWNrZXIgaW5wdXQgYW5kIGNoYW5nZSBldmVudHMuIFdlIGRvbid0IGFsd2F5cyBoYXZlIGFjY2VzcyB0byBhIG5hdGl2ZVxuICogaW5wdXQgb3IgY2hhbmdlIGV2ZW50IGJlY2F1c2UgdGhlIGV2ZW50IG1heSBoYXZlIGJlZW4gdHJpZ2dlcmVkIGJ5IHRoZSB1c2VyIGNsaWNraW5nIG9uIHRoZVxuICogY2FsZW5kYXIgcG9wdXAuIEZvciBjb25zaXN0ZW5jeSwgd2UgYWx3YXlzIHVzZSBNdHhEYXRldGltZXBpY2tlcklucHV0RXZlbnQgaW5zdGVhZC5cbiAqL1xuZXhwb3J0IGNsYXNzIE10eERhdGV0aW1lcGlja2VySW5wdXRFdmVudDxEPiB7XG4gIC8qKiBUaGUgbmV3IHZhbHVlIGZvciB0aGUgdGFyZ2V0IGRhdGV0aW1lcGlja2VyIGlucHV0LiAqL1xuICB2YWx1ZTogRCB8IG51bGw7XG5cbiAgY29uc3RydWN0b3IocHVibGljIHRhcmdldDogTXR4RGF0ZXRpbWVwaWNrZXJJbnB1dDxEPiwgcHVibGljIHRhcmdldEVsZW1lbnQ6IEhUTUxFbGVtZW50KSB7XG4gICAgdGhpcy52YWx1ZSA9IHRoaXMudGFyZ2V0LnZhbHVlO1xuICB9XG59XG5cbi8qKiBEaXJlY3RpdmUgdXNlZCB0byBjb25uZWN0IGFuIGlucHV0IHRvIGEgTXR4RGF0ZXRpbWVwaWNrZXIuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdpbnB1dFttdHhEYXRldGltZXBpY2tlcl0nLFxuICBwcm92aWRlcnM6IFtcbiAgICBNQVRfREFURVRJTUVQSUNLRVJfVkFMVUVfQUNDRVNTT1IsXG4gICAgTUFUX0RBVEVUSU1FUElDS0VSX1ZBTElEQVRPUlMsXG4gICAgeyBwcm92aWRlOiBNQVRfSU5QVVRfVkFMVUVfQUNDRVNTT1IsIHVzZUV4aXN0aW5nOiBNdHhEYXRldGltZXBpY2tlcklucHV0IH0sXG4gIF0sXG4gIGhvc3Q6IHtcbiAgICAnW2F0dHIuYXJpYS1oYXNwb3B1cF0nOiAndHJ1ZScsXG4gICAgJ1thdHRyLmFyaWEtb3duc10nOiAnKF9kYXRldGltZXBpY2tlcj8ub3BlbmVkICYmIF9kYXRldGltZXBpY2tlci5pZCkgfHwgbnVsbCcsXG4gICAgJ1thdHRyLm1pbl0nOiAnbWluID8gX2RhdGVBZGFwdGVyLnRvSXNvODYwMShtaW4pIDogbnVsbCcsXG4gICAgJ1thdHRyLm1heF0nOiAnbWF4ID8gX2RhdGVBZGFwdGVyLnRvSXNvODYwMShtYXgpIDogbnVsbCcsXG4gICAgJ1tkaXNhYmxlZF0nOiAnZGlzYWJsZWQnLFxuICAgICcoaW5wdXQpJzogJ19vbklucHV0KCRldmVudC50YXJnZXQudmFsdWUpJyxcbiAgICAnKGNoYW5nZSknOiAnX29uQ2hhbmdlKCknLFxuICAgICcoYmx1ciknOiAnX29uQmx1cigpJyxcbiAgICAnKGtleWRvd24pJzogJ19vbktleWRvd24oJGV2ZW50KScsXG4gIH0sXG4gIGV4cG9ydEFzOiAnbXR4RGF0ZXRpbWVwaWNrZXJJbnB1dCcsXG59KVxuZXhwb3J0IGNsYXNzIE10eERhdGV0aW1lcGlja2VySW5wdXQ8RD5cbiAgaW1wbGVtZW50cyBBZnRlckNvbnRlbnRJbml0LCBDb250cm9sVmFsdWVBY2Nlc3NvciwgT25EZXN0cm95LCBWYWxpZGF0b3JcbntcbiAgX2RhdGV0aW1lcGlja2VyITogTXR4RGF0ZXRpbWVwaWNrZXI8RD47XG5cbiAgX2RhdGVGaWx0ZXIhOiAoZGF0ZTogRCB8IG51bGwsIHR5cGU6IE10eERhdGV0aW1lcGlja2VyRmlsdGVyVHlwZSkgPT4gYm9vbGVhbjtcblxuICAvKiogRW1pdHMgd2hlbiBhIGBjaGFuZ2VgIGV2ZW50IGlzIGZpcmVkIG9uIHRoaXMgYDxpbnB1dD5gLiAqL1xuICBAT3V0cHV0KCkgZGF0ZUNoYW5nZSA9IG5ldyBFdmVudEVtaXR0ZXI8TXR4RGF0ZXRpbWVwaWNrZXJJbnB1dEV2ZW50PEQ+PigpO1xuXG4gIC8qKiBFbWl0cyB3aGVuIGFuIGBpbnB1dGAgZXZlbnQgaXMgZmlyZWQgb24gdGhpcyBgPGlucHV0PmAuICovXG4gIEBPdXRwdXQoKSBkYXRlSW5wdXQgPSBuZXcgRXZlbnRFbWl0dGVyPE10eERhdGV0aW1lcGlja2VySW5wdXRFdmVudDxEPj4oKTtcblxuICAvKiogRW1pdHMgd2hlbiB0aGUgdmFsdWUgY2hhbmdlcyAoZWl0aGVyIGR1ZSB0byB1c2VyIGlucHV0IG9yIHByb2dyYW1tYXRpYyBjaGFuZ2UpLiAqL1xuICBfdmFsdWVDaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyPEQgfCBudWxsPigpO1xuXG4gIC8qKiBFbWl0cyB3aGVuIHRoZSBkaXNhYmxlZCBzdGF0ZSBoYXMgY2hhbmdlZCAqL1xuICBfZGlzYWJsZWRDaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyPGJvb2xlYW4+KCk7XG5cbiAgcHJpdmF0ZSBfZGF0ZXRpbWVwaWNrZXJTdWJzY3JpcHRpb24gPSBTdWJzY3JpcHRpb24uRU1QVFk7XG5cbiAgcHJpdmF0ZSBfbG9jYWxlU3Vic2NyaXB0aW9uID0gU3Vic2NyaXB0aW9uLkVNUFRZO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBsYXN0IHZhbHVlIHNldCBvbiB0aGUgaW5wdXQgd2FzIHZhbGlkLiAqL1xuICBwcml2YXRlIF9sYXN0VmFsdWVWYWxpZCA9IGZhbHNlO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgX2VsZW1lbnRSZWY6IEVsZW1lbnRSZWYsXG4gICAgQE9wdGlvbmFsKCkgcHVibGljIF9kYXRlQWRhcHRlcjogRGF0ZXRpbWVBZGFwdGVyPEQ+LFxuICAgIEBPcHRpb25hbCgpIEBJbmplY3QoTVRYX0RBVEVUSU1FX0ZPUk1BVFMpIHByaXZhdGUgX2RhdGVGb3JtYXRzOiBNdHhEYXRldGltZUZvcm1hdHMsXG4gICAgQE9wdGlvbmFsKCkgcHJpdmF0ZSBfZm9ybUZpZWxkOiBNYXRGb3JtRmllbGRcbiAgKSB7XG4gICAgaWYgKCF0aGlzLl9kYXRlQWRhcHRlcikge1xuICAgICAgdGhyb3cgY3JlYXRlTWlzc2luZ0RhdGVJbXBsRXJyb3IoJ0RhdGV0aW1lQWRhcHRlcicpO1xuICAgIH1cbiAgICBpZiAoIXRoaXMuX2RhdGVGb3JtYXRzKSB7XG4gICAgICB0aHJvdyBjcmVhdGVNaXNzaW5nRGF0ZUltcGxFcnJvcignTVRYX0RBVEVUSU1FX0ZPUk1BVFMnKTtcbiAgICB9XG5cbiAgICAvLyBVcGRhdGUgdGhlIGRpc3BsYXllZCBkYXRlIHdoZW4gdGhlIGxvY2FsZSBjaGFuZ2VzLlxuICAgIHRoaXMuX2xvY2FsZVN1YnNjcmlwdGlvbiA9IF9kYXRlQWRhcHRlci5sb2NhbGVDaGFuZ2VzLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICB0aGlzLnZhbHVlID0gdGhpcy5fZGF0ZUFkYXB0ZXIuZGVzZXJpYWxpemUodGhpcy52YWx1ZSk7XG4gICAgfSk7XG4gIH1cblxuICAvKiogVGhlIGRhdGV0aW1lcGlja2VyIHRoYXQgdGhpcyBpbnB1dCBpcyBhc3NvY2lhdGVkIHdpdGguICovXG4gIEBJbnB1dCgpXG4gIHNldCBtdHhEYXRldGltZXBpY2tlcih2YWx1ZTogTXR4RGF0ZXRpbWVwaWNrZXI8RD4pIHtcbiAgICB0aGlzLnJlZ2lzdGVyRGF0ZXRpbWVwaWNrZXIodmFsdWUpO1xuICB9XG5cbiAgQElucHV0KClcbiAgc2V0IG10eERhdGV0aW1lcGlja2VyRmlsdGVyKFxuICAgIGZpbHRlcjogKGRhdGU6IEQgfCBudWxsLCB0eXBlOiBNdHhEYXRldGltZXBpY2tlckZpbHRlclR5cGUpID0+IGJvb2xlYW5cbiAgKSB7XG4gICAgdGhpcy5fZGF0ZUZpbHRlciA9IGZpbHRlcjtcbiAgICB0aGlzLl92YWxpZGF0b3JPbkNoYW5nZSgpO1xuICB9XG5cbiAgLyoqIFRoZSB2YWx1ZSBvZiB0aGUgaW5wdXQuICovXG4gIEBJbnB1dCgpXG4gIGdldCB2YWx1ZSgpOiBEIHwgbnVsbCB7XG4gICAgcmV0dXJuIHRoaXMuX3ZhbHVlO1xuICB9XG4gIHNldCB2YWx1ZSh2YWx1ZTogRCB8IG51bGwpIHtcbiAgICB2YWx1ZSA9IHRoaXMuX2RhdGVBZGFwdGVyLmRlc2VyaWFsaXplKHZhbHVlKTtcbiAgICB0aGlzLl9sYXN0VmFsdWVWYWxpZCA9ICF2YWx1ZSB8fCB0aGlzLl9kYXRlQWRhcHRlci5pc1ZhbGlkKHZhbHVlKTtcbiAgICB2YWx1ZSA9IHRoaXMuX2RhdGVBZGFwdGVyLmdldFZhbGlkRGF0ZU9yTnVsbCh2YWx1ZSk7XG4gICAgY29uc3Qgb2xkRGF0ZSA9IHRoaXMudmFsdWU7XG4gICAgdGhpcy5fdmFsdWUgPSB2YWx1ZTtcbiAgICB0aGlzLl9mb3JtYXRWYWx1ZSh2YWx1ZSk7XG5cbiAgICAvLyB1c2UgdGltZW91dCB0byBlbnN1cmUgdGhlIGRhdGV0aW1lcGlja2VyIGlzIGluc3RhbnRpYXRlZCBhbmQgd2UgZ2V0IHRoZSBjb3JyZWN0IGZvcm1hdFxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgaWYgKCF0aGlzLl9kYXRlQWRhcHRlci5zYW1lRGF0ZXRpbWUob2xkRGF0ZSwgdmFsdWUpKSB7XG4gICAgICAgIHRoaXMuX3ZhbHVlQ2hhbmdlLmVtaXQodmFsdWUpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG4gIHByaXZhdGUgX3ZhbHVlITogRCB8IG51bGw7XG5cbiAgLyoqIFRoZSBtaW5pbXVtIHZhbGlkIGRhdGUuICovXG4gIEBJbnB1dCgpXG4gIGdldCBtaW4oKTogRCB8IG51bGwge1xuICAgIHJldHVybiB0aGlzLl9taW47XG4gIH1cbiAgc2V0IG1pbih2YWx1ZTogRCB8IG51bGwpIHtcbiAgICB0aGlzLl9taW4gPSB0aGlzLl9kYXRlQWRhcHRlci5nZXRWYWxpZERhdGVPck51bGwodGhpcy5fZGF0ZUFkYXB0ZXIuZGVzZXJpYWxpemUodmFsdWUpKTtcbiAgICB0aGlzLl92YWxpZGF0b3JPbkNoYW5nZSgpO1xuICB9XG4gIHByaXZhdGUgX21pbiE6IEQgfCBudWxsO1xuXG4gIC8qKiBUaGUgbWF4aW11bSB2YWxpZCBkYXRlLiAqL1xuICBASW5wdXQoKVxuICBnZXQgbWF4KCk6IEQgfCBudWxsIHtcbiAgICByZXR1cm4gdGhpcy5fbWF4O1xuICB9XG4gIHNldCBtYXgodmFsdWU6IEQgfCBudWxsKSB7XG4gICAgdGhpcy5fbWF4ID0gdGhpcy5fZGF0ZUFkYXB0ZXIuZ2V0VmFsaWREYXRlT3JOdWxsKHRoaXMuX2RhdGVBZGFwdGVyLmRlc2VyaWFsaXplKHZhbHVlKSk7XG4gICAgdGhpcy5fdmFsaWRhdG9yT25DaGFuZ2UoKTtcbiAgfVxuICBwcml2YXRlIF9tYXghOiBEIHwgbnVsbDtcblxuICAvKiogV2hldGhlciB0aGUgZGF0ZXRpbWVwaWNrZXItaW5wdXQgaXMgZGlzYWJsZWQuICovXG4gIEBJbnB1dCgpXG4gIGdldCBkaXNhYmxlZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gISF0aGlzLl9kaXNhYmxlZDtcbiAgfVxuICBzZXQgZGlzYWJsZWQodmFsdWU6IGJvb2xlYW4pIHtcbiAgICBjb25zdCBuZXdWYWx1ZSA9IGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSh2YWx1ZSk7XG5cbiAgICBpZiAodGhpcy5fZGlzYWJsZWQgIT09IG5ld1ZhbHVlKSB7XG4gICAgICB0aGlzLl9kaXNhYmxlZCA9IG5ld1ZhbHVlO1xuICAgICAgdGhpcy5fZGlzYWJsZWRDaGFuZ2UuZW1pdChuZXdWYWx1ZSk7XG4gICAgfVxuICB9XG4gIHByaXZhdGUgX2Rpc2FibGVkITogYm9vbGVhbjtcblxuICBfb25Ub3VjaGVkID0gKCkgPT4ge307XG5cbiAgbmdBZnRlckNvbnRlbnRJbml0KCkge1xuICAgIGlmICh0aGlzLl9kYXRldGltZXBpY2tlcikge1xuICAgICAgdGhpcy5fZGF0ZXRpbWVwaWNrZXJTdWJzY3JpcHRpb24gPSB0aGlzLl9kYXRldGltZXBpY2tlci5zZWxlY3RlZENoYW5nZWQuc3Vic2NyaWJlKFxuICAgICAgICAoc2VsZWN0ZWQ6IEQpID0+IHtcbiAgICAgICAgICB0aGlzLnZhbHVlID0gc2VsZWN0ZWQ7XG4gICAgICAgICAgdGhpcy5fY3ZhT25DaGFuZ2Uoc2VsZWN0ZWQpO1xuICAgICAgICAgIHRoaXMuX29uVG91Y2hlZCgpO1xuICAgICAgICAgIHRoaXMuZGF0ZUlucHV0LmVtaXQoXG4gICAgICAgICAgICBuZXcgTXR4RGF0ZXRpbWVwaWNrZXJJbnB1dEV2ZW50KHRoaXMsIHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudClcbiAgICAgICAgICApO1xuICAgICAgICAgIHRoaXMuZGF0ZUNoYW5nZS5lbWl0KFxuICAgICAgICAgICAgbmV3IE10eERhdGV0aW1lcGlja2VySW5wdXRFdmVudCh0aGlzLCB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQpXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgKTtcbiAgICB9XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLl9kYXRldGltZXBpY2tlclN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgIHRoaXMuX2xvY2FsZVN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgIHRoaXMuX3ZhbHVlQ2hhbmdlLmNvbXBsZXRlKCk7XG4gICAgdGhpcy5fZGlzYWJsZWRDaGFuZ2UuY29tcGxldGUoKTtcbiAgfVxuXG4gIHJlZ2lzdGVyT25WYWxpZGF0b3JDaGFuZ2UoZm46ICgpID0+IHZvaWQpOiB2b2lkIHtcbiAgICB0aGlzLl92YWxpZGF0b3JPbkNoYW5nZSA9IGZuO1xuICB9XG5cbiAgdmFsaWRhdGUoYzogQWJzdHJhY3RDb250cm9sKTogVmFsaWRhdGlvbkVycm9ycyB8IG51bGwge1xuICAgIHJldHVybiB0aGlzLl92YWxpZGF0b3IgPyB0aGlzLl92YWxpZGF0b3IoYykgOiBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgdGhlIGVsZW1lbnQgdGhhdCB0aGUgZGF0ZXRpbWVwaWNrZXIgcG9wdXAgc2hvdWxkIGJlIGNvbm5lY3RlZCB0by5cbiAgICogQHJldHVybiBUaGUgZWxlbWVudCB0byBjb25uZWN0IHRoZSBwb3B1cCB0by5cbiAgICovXG4gIGdldENvbm5lY3RlZE92ZXJsYXlPcmlnaW4oKTogRWxlbWVudFJlZiB7XG4gICAgcmV0dXJuIHRoaXMuX2Zvcm1GaWVsZCA/IHRoaXMuX2Zvcm1GaWVsZC5nZXRDb25uZWN0ZWRPdmVybGF5T3JpZ2luKCkgOiB0aGlzLl9lbGVtZW50UmVmO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIElEIG9mIGFuIGVsZW1lbnQgdGhhdCBzaG91bGQgYmUgdXNlZCBhIGRlc2NyaXB0aW9uIGZvciB0aGUgY2FsZW5kYXIgb3ZlcmxheS4gKi9cbiAgZ2V0T3ZlcmxheUxhYmVsSWQoKTogc3RyaW5nIHwgbnVsbCB7XG4gICAgaWYgKHRoaXMuX2Zvcm1GaWVsZCkge1xuICAgICAgcmV0dXJuIHRoaXMuX2Zvcm1GaWVsZC5nZXRMYWJlbElkKCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2FyaWEtbGFiZWxsZWRieScpO1xuICB9XG5cbiAgLy8gSW1wbGVtZW50ZWQgYXMgcGFydCBvZiBDb250cm9sVmFsdWVBY2Nlc3NvclxuICB3cml0ZVZhbHVlKHZhbHVlOiBEKTogdm9pZCB7XG4gICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuICB9XG5cbiAgLy8gSW1wbGVtZW50ZWQgYXMgcGFydCBvZiBDb250cm9sVmFsdWVBY2Nlc3NvclxuICByZWdpc3Rlck9uQ2hhbmdlKGZuOiAodmFsdWU6IGFueSkgPT4gdm9pZCk6IHZvaWQge1xuICAgIHRoaXMuX2N2YU9uQ2hhbmdlID0gZm47XG4gIH1cblxuICAvLyBJbXBsZW1lbnRlZCBhcyBwYXJ0IG9mIENvbnRyb2xWYWx1ZUFjY2Vzc29yXG4gIHJlZ2lzdGVyT25Ub3VjaGVkKGZuOiAoKSA9PiB2b2lkKTogdm9pZCB7XG4gICAgdGhpcy5fb25Ub3VjaGVkID0gZm47XG4gIH1cblxuICAvLyBJbXBsZW1lbnRlZCBhcyBwYXJ0IG9mIENvbnRyb2xWYWx1ZUFjY2Vzc29yXG4gIHNldERpc2FibGVkU3RhdGUoZGlzYWJsZWQ6IGJvb2xlYW4pOiB2b2lkIHtcbiAgICB0aGlzLmRpc2FibGVkID0gZGlzYWJsZWQ7XG4gIH1cblxuICBfb25LZXlkb3duKGV2ZW50OiBLZXlib2FyZEV2ZW50KSB7XG4gICAgaWYgKGV2ZW50LmFsdEtleSAmJiBldmVudC5rZXlDb2RlID09PSBET1dOX0FSUk9XKSB7XG4gICAgICB0aGlzLl9kYXRldGltZXBpY2tlci5vcGVuKCk7XG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIH1cbiAgfVxuXG4gIF9vbklucHV0KHZhbHVlOiBzdHJpbmcpIHtcbiAgICBsZXQgZGF0ZSA9IHRoaXMuX2RhdGVBZGFwdGVyLnBhcnNlKHZhbHVlLCB0aGlzLmdldFBhcnNlRm9ybWF0KCkpO1xuICAgIHRoaXMuX2xhc3RWYWx1ZVZhbGlkID0gIWRhdGUgfHwgdGhpcy5fZGF0ZUFkYXB0ZXIuaXNWYWxpZChkYXRlKTtcbiAgICBkYXRlID0gdGhpcy5fZGF0ZUFkYXB0ZXIuZ2V0VmFsaWREYXRlT3JOdWxsKGRhdGUpO1xuICAgIHRoaXMuX3ZhbHVlID0gZGF0ZTtcbiAgICB0aGlzLl9jdmFPbkNoYW5nZShkYXRlKTtcbiAgICB0aGlzLl92YWx1ZUNoYW5nZS5lbWl0KGRhdGUpO1xuICAgIHRoaXMuZGF0ZUlucHV0LmVtaXQobmV3IE10eERhdGV0aW1lcGlja2VySW5wdXRFdmVudCh0aGlzLCB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQpKTtcbiAgfVxuXG4gIF9vbkNoYW5nZSgpIHtcbiAgICB0aGlzLmRhdGVDaGFuZ2UuZW1pdChuZXcgTXR4RGF0ZXRpbWVwaWNrZXJJbnB1dEV2ZW50KHRoaXMsIHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudCkpO1xuICB9XG5cbiAgLyoqIEhhbmRsZXMgYmx1ciBldmVudHMgb24gdGhlIGlucHV0LiAqL1xuICBfb25CbHVyKCkge1xuICAgIC8vIFJlZm9ybWF0IHRoZSBpbnB1dCBvbmx5IGlmIHdlIGhhdmUgYSB2YWxpZCB2YWx1ZS5cbiAgICBpZiAodGhpcy52YWx1ZSkge1xuICAgICAgdGhpcy5fZm9ybWF0VmFsdWUodGhpcy52YWx1ZSk7XG4gICAgfVxuXG4gICAgdGhpcy5fb25Ub3VjaGVkKCk7XG4gIH1cblxuICBwcml2YXRlIHJlZ2lzdGVyRGF0ZXRpbWVwaWNrZXIodmFsdWU6IE10eERhdGV0aW1lcGlja2VyPEQ+KSB7XG4gICAgaWYgKHZhbHVlKSB7XG4gICAgICB0aGlzLl9kYXRldGltZXBpY2tlciA9IHZhbHVlO1xuICAgICAgdGhpcy5fZGF0ZXRpbWVwaWNrZXIuX3JlZ2lzdGVySW5wdXQodGhpcyk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBnZXREaXNwbGF5Rm9ybWF0KCkge1xuICAgIHN3aXRjaCAodGhpcy5fZGF0ZXRpbWVwaWNrZXIudHlwZSkge1xuICAgICAgY2FzZSAnZGF0ZSc6XG4gICAgICAgIHJldHVybiB0aGlzLl9kYXRlRm9ybWF0cy5kaXNwbGF5LmRhdGVJbnB1dDtcbiAgICAgIGNhc2UgJ2RhdGV0aW1lJzpcbiAgICAgICAgcmV0dXJuIHRoaXMuX2RhdGVGb3JtYXRzLmRpc3BsYXkuZGF0ZXRpbWVJbnB1dDtcbiAgICAgIGNhc2UgJ3RpbWUnOlxuICAgICAgICByZXR1cm4gdGhpcy5fZGF0ZUZvcm1hdHMuZGlzcGxheS50aW1lSW5wdXQ7XG4gICAgICBjYXNlICdtb250aCc6XG4gICAgICAgIHJldHVybiB0aGlzLl9kYXRlRm9ybWF0cy5kaXNwbGF5Lm1vbnRoSW5wdXQ7XG4gICAgICBjYXNlICd5ZWFyJzpcbiAgICAgICAgcmV0dXJuIHRoaXMuX2RhdGVGb3JtYXRzLmRpc3BsYXkueWVhcklucHV0O1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgZ2V0UGFyc2VGb3JtYXQoKSB7XG4gICAgbGV0IHBhcnNlRm9ybWF0O1xuXG4gICAgc3dpdGNoICh0aGlzLl9kYXRldGltZXBpY2tlci50eXBlKSB7XG4gICAgICBjYXNlICdkYXRlJzpcbiAgICAgICAgcGFyc2VGb3JtYXQgPSB0aGlzLl9kYXRlRm9ybWF0cy5wYXJzZS5kYXRlSW5wdXQ7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnZGF0ZXRpbWUnOlxuICAgICAgICBwYXJzZUZvcm1hdCA9IHRoaXMuX2RhdGVGb3JtYXRzLnBhcnNlLmRhdGV0aW1lSW5wdXQ7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAndGltZSc6XG4gICAgICAgIHBhcnNlRm9ybWF0ID0gdGhpcy5fZGF0ZUZvcm1hdHMucGFyc2UudGltZUlucHV0O1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ21vbnRoJzpcbiAgICAgICAgcGFyc2VGb3JtYXQgPSB0aGlzLl9kYXRlRm9ybWF0cy5wYXJzZS5tb250aElucHV0O1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ3llYXInOlxuICAgICAgICBwYXJzZUZvcm1hdCA9IHRoaXMuX2RhdGVGb3JtYXRzLnBhcnNlLnllYXJJbnB1dDtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICAgIGlmICghcGFyc2VGb3JtYXQpIHtcbiAgICAgIHBhcnNlRm9ybWF0ID0gdGhpcy5fZGF0ZUZvcm1hdHMucGFyc2UuZGF0ZUlucHV0O1xuICAgIH1cblxuICAgIHJldHVybiBwYXJzZUZvcm1hdDtcbiAgfVxuXG4gIHByaXZhdGUgX2N2YU9uQ2hhbmdlOiAodmFsdWU6IGFueSkgPT4gdm9pZCA9ICgpID0+IHt9O1xuXG4gIHByaXZhdGUgX3ZhbGlkYXRvck9uQ2hhbmdlID0gKCkgPT4ge307XG5cbiAgLyoqIFRoZSBmb3JtIGNvbnRyb2wgdmFsaWRhdG9yIGZvciB3aGV0aGVyIHRoZSBpbnB1dCBwYXJzZXMuICovXG4gIHByaXZhdGUgX3BhcnNlVmFsaWRhdG9yOiBWYWxpZGF0b3JGbiA9ICgpOiBWYWxpZGF0aW9uRXJyb3JzIHwgbnVsbCA9PiB7XG4gICAgcmV0dXJuIHRoaXMuX2xhc3RWYWx1ZVZhbGlkXG4gICAgICA/IG51bGxcbiAgICAgIDogeyBtdHhEYXRldGltZXBpY2tlclBhcnNlOiB7IHRleHQ6IHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC52YWx1ZSB9IH07XG4gIH07XG5cbiAgLyoqIFRoZSBmb3JtIGNvbnRyb2wgdmFsaWRhdG9yIGZvciB0aGUgbWluIGRhdGUuICovXG4gIHByaXZhdGUgX21pblZhbGlkYXRvcjogVmFsaWRhdG9yRm4gPSAoY29udHJvbDogQWJzdHJhY3RDb250cm9sKTogVmFsaWRhdGlvbkVycm9ycyB8IG51bGwgPT4ge1xuICAgIGNvbnN0IGNvbnRyb2xWYWx1ZSA9IHRoaXMuX2RhdGVBZGFwdGVyLmdldFZhbGlkRGF0ZU9yTnVsbChcbiAgICAgIHRoaXMuX2RhdGVBZGFwdGVyLmRlc2VyaWFsaXplKGNvbnRyb2wudmFsdWUpXG4gICAgKTtcbiAgICByZXR1cm4gIXRoaXMubWluIHx8XG4gICAgICAhY29udHJvbFZhbHVlIHx8XG4gICAgICB0aGlzLl9kYXRlQWRhcHRlci5jb21wYXJlRGF0ZXRpbWUodGhpcy5taW4sIGNvbnRyb2xWYWx1ZSkgPD0gMFxuICAgICAgPyBudWxsXG4gICAgICA6IHsgbXR4RGF0ZXRpbWVwaWNrZXJNaW46IHsgbWluOiB0aGlzLm1pbiwgYWN0dWFsOiBjb250cm9sVmFsdWUgfSB9O1xuICB9O1xuXG4gIC8qKiBUaGUgZm9ybSBjb250cm9sIHZhbGlkYXRvciBmb3IgdGhlIG1heCBkYXRlLiAqL1xuICBwcml2YXRlIF9tYXhWYWxpZGF0b3I6IFZhbGlkYXRvckZuID0gKGNvbnRyb2w6IEFic3RyYWN0Q29udHJvbCk6IFZhbGlkYXRpb25FcnJvcnMgfCBudWxsID0+IHtcbiAgICBjb25zdCBjb250cm9sVmFsdWUgPSB0aGlzLl9kYXRlQWRhcHRlci5nZXRWYWxpZERhdGVPck51bGwoXG4gICAgICB0aGlzLl9kYXRlQWRhcHRlci5kZXNlcmlhbGl6ZShjb250cm9sLnZhbHVlKVxuICAgICk7XG4gICAgcmV0dXJuICF0aGlzLm1heCB8fFxuICAgICAgIWNvbnRyb2xWYWx1ZSB8fFxuICAgICAgdGhpcy5fZGF0ZUFkYXB0ZXIuY29tcGFyZURhdGV0aW1lKHRoaXMubWF4LCBjb250cm9sVmFsdWUpID49IDBcbiAgICAgID8gbnVsbFxuICAgICAgOiB7IG10eERhdGV0aW1lcGlja2VyTWF4OiB7IG1heDogdGhpcy5tYXgsIGFjdHVhbDogY29udHJvbFZhbHVlIH0gfTtcbiAgfTtcblxuICAvKiogVGhlIGZvcm0gY29udHJvbCB2YWxpZGF0b3IgZm9yIHRoZSBkYXRlIGZpbHRlci4gKi9cbiAgcHJpdmF0ZSBfZmlsdGVyVmFsaWRhdG9yOiBWYWxpZGF0b3JGbiA9IChjb250cm9sOiBBYnN0cmFjdENvbnRyb2wpOiBWYWxpZGF0aW9uRXJyb3JzIHwgbnVsbCA9PiB7XG4gICAgY29uc3QgY29udHJvbFZhbHVlID0gdGhpcy5fZGF0ZUFkYXB0ZXIuZ2V0VmFsaWREYXRlT3JOdWxsKFxuICAgICAgdGhpcy5fZGF0ZUFkYXB0ZXIuZGVzZXJpYWxpemUoY29udHJvbC52YWx1ZSlcbiAgICApO1xuICAgIHJldHVybiAhdGhpcy5fZGF0ZUZpbHRlciB8fFxuICAgICAgIWNvbnRyb2xWYWx1ZSB8fFxuICAgICAgdGhpcy5fZGF0ZUZpbHRlcihjb250cm9sVmFsdWUsIE10eERhdGV0aW1lcGlja2VyRmlsdGVyVHlwZS5EQVRFKVxuICAgICAgPyBudWxsXG4gICAgICA6IHsgbXR4RGF0ZXRpbWVwaWNrZXJGaWx0ZXI6IHRydWUgfTtcbiAgfTtcblxuICAvKiogVGhlIGNvbWJpbmVkIGZvcm0gY29udHJvbCB2YWxpZGF0b3IgZm9yIHRoaXMgaW5wdXQuICovXG4gIHByaXZhdGUgX3ZhbGlkYXRvcjogVmFsaWRhdG9yRm4gfCBudWxsID0gVmFsaWRhdG9ycy5jb21wb3NlKFtcbiAgICB0aGlzLl9wYXJzZVZhbGlkYXRvcixcbiAgICB0aGlzLl9taW5WYWxpZGF0b3IsXG4gICAgdGhpcy5fbWF4VmFsaWRhdG9yLFxuICAgIHRoaXMuX2ZpbHRlclZhbGlkYXRvcixcbiAgXSk7XG5cbiAgLyoqIEZvcm1hdHMgYSB2YWx1ZSBhbmQgc2V0cyBpdCBvbiB0aGUgaW5wdXQgZWxlbWVudC4gKi9cbiAgcHJpdmF0ZSBfZm9ybWF0VmFsdWUodmFsdWU6IEQgfCBudWxsKSB7XG4gICAgdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LnZhbHVlID0gdmFsdWVcbiAgICAgID8gdGhpcy5fZGF0ZUFkYXB0ZXIuZm9ybWF0KHZhbHVlLCB0aGlzLmdldERpc3BsYXlGb3JtYXQoKSlcbiAgICAgIDogJyc7XG4gIH1cblxuICAvKiogUmV0dXJucyB0aGUgcGFsZXR0ZSB1c2VkIGJ5IHRoZSBpbnB1dCdzIGZvcm0gZmllbGQsIGlmIGFueS4gKi9cbiAgZ2V0VGhlbWVQYWxldHRlKCk6IFRoZW1lUGFsZXR0ZSB7XG4gICAgcmV0dXJuIHRoaXMuX2Zvcm1GaWVsZCA/IHRoaXMuX2Zvcm1GaWVsZC5jb2xvciA6IHVuZGVmaW5lZDtcbiAgfVxuXG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9kaXNhYmxlZDogQm9vbGVhbklucHV0O1xufVxuIl19