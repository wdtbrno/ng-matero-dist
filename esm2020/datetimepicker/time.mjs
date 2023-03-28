import { coerceBooleanProperty, coerceNumberProperty, } from '@angular/cdk/coercion';
import { DOWN_ARROW, UP_ARROW } from '@angular/cdk/keycodes';
import { ChangeDetectionStrategy, Component, Directive, ElementRef, EventEmitter, Input, Output, ViewChild, ViewEncapsulation, } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "@ng-matero/extensions/core";
import * as i2 from "./datetimepicker-intl";
import * as i3 from "@angular/common";
import * as i4 from "@angular/material/button";
import * as i5 from "./clock";
function pad(num, size) {
    num = String(num);
    while (num.length < size)
        num = '0' + num;
    return num;
}
export class MtxTimeInput {
    set timeInterval(value) {
        this._interval = coerceNumberProperty(value);
    }
    set timeMin(value) {
        this._min = coerceNumberProperty(value);
    }
    set timeMax(value) {
        this._max = coerceNumberProperty(value);
    }
    set timeValue(value) {
        this._value = coerceNumberProperty(value);
        if (!this.hasFocus) {
            this.writeValue(this._value);
        }
        this.writePlaceholder(this._value);
    }
    constructor(element, cdr) {
        this.element = element;
        this.cdr = cdr;
        this._interval = 1;
        this._min = 0;
        this._max = Infinity;
        this.timeValueChanged = new EventEmitter();
        this.keyDownListener = this.keyDownHandler.bind(this);
        this.keyPressListener = this.keyPressHandler.bind(this);
        this.inputEventListener = this.inputChangedHandler.bind(this);
        this.inputElement.addEventListener('keydown', this.keyDownListener, {
            passive: true,
        });
        // Do not passive since we want to be able to preventDefault()
        this.inputElement.addEventListener('keypress', this.keyPressListener);
        this.inputElement.addEventListener('input', this.inputEventListener, {
            passive: true,
        });
    }
    get hasFocus() {
        return this.element.nativeElement && this.element?.nativeElement === document?.activeElement;
    }
    get inputElement() {
        return this.element.nativeElement;
    }
    // We look here at the placeholder value, because we write '' into the value on focus
    // placeholder should always be up to date with "currentValue"
    get valid() {
        // At the start _value is undefined therefore this would result in not valid and
        // make a ugly warning border afterwards we can safely check
        if (this._value) {
            const currentValue = String(this.inputElement.value);
            // It can be that currentValue is empty due to we removing the value on focus,
            // if that is the case we should check previous value which should be in the placeholder
            if (currentValue.length) {
                return this._value == this.inputElement.value;
            }
            else {
                return this._value == this.inputElement.placeholder;
            }
        }
        return true;
    }
    get invalid() {
        return !this.valid;
    }
    blur() {
        this.writeValue(this._value);
        this.writePlaceholder(this._value);
        this.timeValueChanged.emit(this._value);
    }
    focus() {
        this.writeValue('');
    }
    /**
     * Write value to inputElement
     * @param value NumberInput
     */
    writeValue(value) {
        if (value !== '') {
            this.inputElement.value = pad(value, 2);
        }
        else {
            this.inputElement.value = '';
        }
        this.cdr.markForCheck();
    }
    /**
     * Writes value to placeholder
     * @param value NumberInput
     */
    writePlaceholder(value) {
        this.inputElement.placeholder = pad(value, 2);
        this.cdr.markForCheck();
    }
    keyDownHandler(event) {
        if (String(this.inputElement.value).length > 0) {
            let value = null;
            if (event.keyCode === UP_ARROW) {
                value = coerceNumberProperty(this._value);
                value += this._interval;
                event.stopPropagation();
            }
            else if (event.keyCode === DOWN_ARROW) {
                value = coerceNumberProperty(this._value);
                value -= this._interval;
                event.stopPropagation();
            }
            // if value has changed
            if (typeof value === 'number') {
                this.writeValue(value);
                this.writePlaceholder(value);
                this.clampInputValue();
                this.timeValueChanged.emit(this._value);
            }
        }
    }
    /**
     * Prevent non number inputs in the inputElement with the exception of Enter/BackSpace
     * @param event KeyboardEvent
     */
    keyPressHandler(event) {
        const key = event?.key ?? null;
        if (isNaN(Number(key)) && key !== 'Enter') {
            event.preventDefault();
        }
    }
    inputChangedHandler() {
        this.clampInputValue();
        this.timeValueChanged.emit(this._value);
    }
    clampInputValue() {
        if (this.inputElement?.value === '') {
            return;
        }
        const value = coerceNumberProperty(this.inputElement?.value ?? null);
        // if this._min === 0, we should allow 0
        if (value || (this._min === 0 && value === 0)) {
            const clampedValue = Math.min(Math.max(value, this._min), this._max);
            if (clampedValue !== value) {
                this.writeValue(clampedValue);
                this.writePlaceholder(clampedValue);
            }
            this._value = clampedValue;
        }
    }
    /**
     * Remove event listeners on destruction
     */
    ngOnDestroy() {
        this.inputElement.removeEventListener('keydown', this.keyDownListener);
        this.inputElement.removeEventListener('keypress', this.keyPressListener);
        this.inputElement.removeEventListener('input', this.inputEventListener);
    }
}
/** @nocollapse */ MtxTimeInput.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MtxTimeInput, deps: [{ token: i0.ElementRef }, { token: i0.ChangeDetectorRef }], target: i0.ɵɵFactoryTarget.Directive });
/** @nocollapse */ MtxTimeInput.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.2.1", type: MtxTimeInput, selector: "input.mtx-time-input", inputs: { timeInterval: "timeInterval", timeMin: "timeMin", timeMax: "timeMax", timeValue: "timeValue" }, outputs: { timeValueChanged: "timeValueChanged" }, host: { listeners: { "blur": "blur($event)", "focus": "focus($event)" } }, exportAs: ["mtxTimeInput"], ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MtxTimeInput, decorators: [{
            type: Directive,
            args: [{
                    selector: 'input.mtx-time-input',
                    host: {
                        '(blur)': 'blur($event)',
                        '(focus)': 'focus($event)',
                    },
                    exportAs: 'mtxTimeInput',
                }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i0.ChangeDetectorRef }]; }, propDecorators: { timeInterval: [{
                type: Input,
                args: ['timeInterval']
            }], timeMin: [{
                type: Input,
                args: ['timeMin']
            }], timeMax: [{
                type: Input,
                args: ['timeMax']
            }], timeValue: [{
                type: Input,
                args: ['timeValue']
            }], timeValueChanged: [{
                type: Output
            }] } });
export class MtxTime {
    /** Whether the clock uses 12 hour format. */
    get twelvehour() {
        return this._twelvehour;
    }
    set twelvehour(value) {
        this._twelvehour = coerceBooleanProperty(value);
    }
    /**
     * The date to display in this clock view.
     */
    get activeDate() {
        return this._activeDate;
    }
    set activeDate(value) {
        this._activeDate = this._adapter.clampDate(value, this.minDate, this.maxDate);
    }
    /** The currently selected date. */
    get selected() {
        return this._selected;
    }
    set selected(value) {
        this._selected = this._adapter.getValidDateOrNull(this._adapter.deserialize(value));
        if (this._selected) {
            this.activeDate = this._selected;
        }
    }
    /** The minimum selectable date. */
    get minDate() {
        return this._minDate;
    }
    set minDate(value) {
        this._minDate = this._adapter.getValidDateOrNull(this._adapter.deserialize(value));
    }
    /** The maximum selectable date. */
    get maxDate() {
        return this._maxDate;
    }
    set maxDate(value) {
        this._maxDate = this._adapter.getValidDateOrNull(this._adapter.deserialize(value));
    }
    /** Whether the clock should be started in hour or minute view. */
    get clockView() {
        return this._clockView;
    }
    set clockView(value) {
        this._clockView = value;
    }
    get isHourView() {
        return this._clockView === 'hour';
    }
    get isMinuteView() {
        return this._clockView === 'hour';
    }
    get hour() {
        if (!this.activeDate) {
            if (this.twelvehour) {
                return '12';
            }
            else {
                return '00';
            }
        }
        const hour = Number(this._adapter.getHour(this.activeDate));
        if (!this.twelvehour) {
            return this.prefixWithZero(hour);
        }
        if (hour === 0) {
            return '12';
        }
        else {
            return this.prefixWithZero(hour > 12 ? hour - 12 : hour);
        }
    }
    get minute() {
        if (this.activeDate) {
            return this.prefixWithZero(this._adapter.getMinute(this.activeDate));
        }
        return '00';
    }
    prefixWithZero(value) {
        if (value < 10) {
            return '0' + String(value);
        }
        return String(value);
    }
    constructor(_adapter, _changeDetectorRef, _datetimepickerIntl) {
        this._adapter = _adapter;
        this._changeDetectorRef = _changeDetectorRef;
        this._datetimepickerIntl = _datetimepickerIntl;
        /** Emits when the currently selected date changes. */
        this.selectedChange = new EventEmitter();
        /** Emits when any date changes. */
        this.activeDateChange = new EventEmitter();
        /** Emits when any date is selected. */
        this._userSelection = new EventEmitter();
        /** Emits when AM/PM button are clicked. */
        this.ampmChange = new EventEmitter();
        /** Emits when AM/PM button are clicked. */
        this.clockViewChange = new EventEmitter();
        /** Step over minutes. */
        this.interval = 1;
        this._twelvehour = false;
        /** Whether the time is now in AM or PM. */
        this.AMPM = 'AM';
        /** Whether the clock is in hour view. */
        this._clockView = 'hour';
        this.datetimepickerIntlChangesSubscription = this._datetimepickerIntl.changes.subscribe(() => {
            this._changeDetectorRef.detectChanges();
        });
    }
    ngOnChanges(changes) {
        // when clockView changes by input we should focus the correct input
        if (changes.clockView) {
            if (changes.clockView.currentValue !== changes.clockView.previousValue) {
                this.focusInputElement();
            }
        }
    }
    ngAfterViewInit() {
        this.focusInputElement();
    }
    focusInputElement() {
        if (this.clockView === 'hour') {
            if (this.hourInputElement) {
                this.hourInputElement.nativeElement.focus();
            }
        }
        else {
            if (this.minuteInputElement) {
                this.minuteInputElement.nativeElement.focus();
            }
        }
    }
    handleHourInputChange(value) {
        const hour = coerceNumberProperty(value);
        if (hour || hour === 0) {
            const newValue = this._adapter.createDatetime(this._adapter.getYear(this.activeDate), this._adapter.getMonth(this.activeDate), this._adapter.getDate(this.activeDate), this.updateHourForAmPm(hour), this._adapter.getMinute(this.activeDate));
            this._activeDate = this._adapter.clampDate(newValue, this.minDate, this.maxDate);
            this.activeDateChange.emit(this.activeDate);
            // If previously we did set [mtxValue]="13" and the input changed to 6, and the clamping
            // will make it "13" again then the hourInputDirective will not have been updated
            // since "13" === "13" same reference so no change detected by directly setting it within
            // this handler, we handle this usecase
            if (this.hourInputDirective) {
                this.hourInputDirective.timeValue = this.hour;
            }
        }
    }
    updateHourForAmPm(value) {
        if (!this.twelvehour) {
            return value;
        }
        // value should be between 1-12
        if (this.AMPM === 'AM') {
            if (value === 0 || value === 12) {
                return 0;
            }
            return value;
        }
        // PM
        else {
            if (value === 0 || value === 12) {
                return 12;
            }
            // other cases, we should add 12 to the value aka 3:00 PM = 3 + 12 = 15:00
            return value + 12;
        }
    }
    handleMinuteInputChange(value) {
        const minute = coerceNumberProperty(value);
        if (minute || minute === 0) {
            const newValue = this._adapter.createDatetime(this._adapter.getYear(this.activeDate), this._adapter.getMonth(this.activeDate), this._adapter.getDate(this.activeDate), this._adapter.getHour(this._activeDate), minute);
            this._activeDate = this._adapter.clampDate(newValue, this.minDate, this.maxDate);
            this.activeDateChange.emit(this.activeDate);
            // If previously we did set [mtxValue]="40" and the input changed to 30, and the clamping
            // will make it "40" again then the minuteInputDirective will not have been updated
            // since "40" === "40" same reference so no change detected by directly setting it within
            // this handler, we handle this usecase
            if (this.minuteInputDirective) {
                this.minuteInputDirective.timeValue = this.minute;
            }
        }
    }
    handleFocus(clockView) {
        this.clockView = clockView;
        this.clockViewChange.emit(clockView);
    }
    _timeSelected(date) {
        if (this.clockView === 'hour') {
            this.clockView = 'minute';
        }
        this._activeDate = this.selected = date;
    }
    _onActiveDateChange(date) {
        this._activeDate = date;
        this.activeDateChange.emit(date);
    }
    handleOk() {
        if (this._selected) {
            this.selectedChange.emit(this._selected);
        }
        this._userSelection.emit();
    }
    handleCancel() {
        this._userSelection.emit();
    }
    ngOnDestroy() {
        if (this.datetimepickerIntlChangesSubscription) {
            this.datetimepickerIntlChangesSubscription.unsubscribe();
        }
    }
}
/** @nocollapse */ MtxTime.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MtxTime, deps: [{ token: i1.DatetimeAdapter }, { token: i0.ChangeDetectorRef }, { token: i2.MtxDatetimepickerIntl }], target: i0.ɵɵFactoryTarget.Component });
/** @nocollapse */ MtxTime.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.1", type: MtxTime, selector: "mtx-time", inputs: { dateFilter: "dateFilter", interval: "interval", twelvehour: "twelvehour", AMPM: "AMPM", activeDate: "activeDate", selected: "selected", minDate: "minDate", maxDate: "maxDate", clockView: "clockView" }, outputs: { selectedChange: "selectedChange", activeDateChange: "activeDateChange", _userSelection: "_userSelection", ampmChange: "ampmChange", clockViewChange: "clockViewChange" }, host: { classAttribute: "mtx-time" }, viewQueries: [{ propertyName: "hourInputElement", first: true, predicate: ["hourInput"], descendants: true, read: (ElementRef) }, { propertyName: "hourInputDirective", first: true, predicate: ["hourInput"], descendants: true, read: MtxTimeInput }, { propertyName: "minuteInputElement", first: true, predicate: ["minuteInput"], descendants: true, read: (ElementRef) }, { propertyName: "minuteInputDirective", first: true, predicate: ["minuteInput"], descendants: true, read: MtxTimeInput }], exportAs: ["mtxTime"], usesOnChanges: true, ngImport: i0, template: "<div class=\"mtx-time-input-wrapper\">\n  <div class=\"mtx-time-input-inner\">\n    <input class=\"mtx-time-input\"\n           [class.mtx-time-input-active]=\"clockView === 'hour'\"\n           [class.mtx-time-input-warning]=\"!hourInput.valid\"\n           #hourInput=\"mtxTimeInput\"\n           type=\"text\"\n           inputmode=\"numeric\"\n           maxlength=\"2\"\n           [timeMin]=\"twelvehour ? 1 : 0\"\n           [timeMax]=\"twelvehour ? 12 : 23\"\n           [timeValue]=\"hour\"\n           (timeValueChanged)=\"handleHourInputChange($event)\"\n           (focus)=\"handleFocus('hour')\" />\n\n    <div class=\"mtx-time-seperator\">:</div>\n\n    <input class=\"mtx-time-input\"\n           [class.mtx-time-input-active]=\"clockView === 'minute'\"\n           [class.mtx-time-input-warning]=\"!minuteInput.valid\"\n           #minuteInput=\"mtxTimeInput\"\n           type=\"text\"\n           inputmode=\"numeric\"\n           maxlength=\"2\"\n           [timeMin]=\"0\"\n           [timeMax]=\"59\"\n           [timeValue]=\"minute\"\n           (timeValueChanged)=\"handleMinuteInputChange($event)\"\n           [timeInterval]=\"interval\"\n           (focus)=\"handleFocus('minute')\" />\n\n    <div *ngIf=\"twelvehour\" class=\"mtx-time-ampm\">\n      <button mat-button type=\"button\" class=\"mtx-time-am\"\n              [class.mtx-time-ampm-active]=\"AMPM === 'AM'\" aria-label=\"AM\"\n              (keydown)=\"$event.stopPropagation()\"\n              (click)=\"ampmChange.emit('AM')\">AM</button>\n      <button mat-button type=\"button\" class=\"mtx-time-pm\"\n              [class.mtx-time-ampm-active]=\"AMPM === 'PM'\" aria-label=\"PM\"\n              (keydown)=\"$event.stopPropagation()\"\n              (click)=\"ampmChange.emit('PM')\">PM</button>\n    </div>\n  </div>\n</div>\n\n<mtx-clock (selectedChange)=\"_timeSelected($event)\"\n           (activeDateChange)=\"_onActiveDateChange($event)\"\n           [AMPM]=\"AMPM\"\n           [dateFilter]=\"dateFilter\"\n           [interval]=\"interval\"\n           [maxDate]=\"maxDate\"\n           [minDate]=\"minDate\"\n           [selected]=\"selected\"\n           [startView]=\"clockView\"\n           [twelvehour]=\"twelvehour\">\n</mtx-clock>\n\n<div class=\"mtx-time-button-wrapper\">\n  <button class=\"mtx-time-cancel-button\" mat-button type=\"button\" (click)=\"handleCancel()\">\n    {{ _datetimepickerIntl.cancelLabel }}\n  </button>\n  <button class=\"mtx-time-ok-button\" mat-button type=\"button\" (click)=\"handleOk()\"\n          [disabled]=\"minuteInputDirective?.invalid || hourInputDirective?.invalid\">\n    {{ _datetimepickerIntl.okLabel }}\n  </button>\n</div>\n", styles: [".mtx-time{display:block;outline:none;-webkit-user-select:none;user-select:none}.mtx-time-input-wrapper{padding:8px 0;text-align:center}.mtx-time-input-inner{display:inline-flex;height:56px}.mtx-time-input{box-sizing:border-box;width:72px;height:100%;padding:0;font-size:36px;text-align:center;border-radius:8px;border:2px solid transparent;-webkit-appearance:none;appearance:none;outline:none}.mtx-time-seperator{display:inline-flex;justify-content:center;align-items:center;width:24px;font-size:36px}.mtx-time-ampm{display:inline-flex;flex-direction:column;margin-left:12px}[dir=rtl] .mtx-time-ampm{margin-left:auto;margin-right:12px}.mtx-time-ampm .mtx-time-am,.mtx-time-ampm .mtx-time-pm{--mdc-typography-button-font-weight: 400;flex:1;width:40px;min-width:auto;border-width:1px;border-style:solid}.mtx-time-ampm .mtx-time-am .mat-mdc-button-touch-target,.mtx-time-ampm .mtx-time-pm .mat-mdc-button-touch-target{height:100%}.mtx-time-ampm .mtx-time-am{border-radius:8px 8px 0 0}.mtx-time-ampm .mtx-time-pm{border-radius:0 0 8px 8px;border-top:none}.mtx-time-button-wrapper{display:flex;justify-content:flex-end;padding-top:8px}.mtx-time-button-wrapper .mat-mdc-button-base+.mat-mdc-button-base{margin-left:8px}[dir=rtl] .mtx-time-button-wrapper .mat-mdc-button-base+.mat-mdc-button-base{margin-left:0;margin-right:8px}\n"], dependencies: [{ kind: "directive", type: i3.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "component", type: i4.MatButton, selector: "    button[mat-button], button[mat-raised-button], button[mat-flat-button],    button[mat-stroked-button]  ", inputs: ["disabled", "disableRipple", "color"], exportAs: ["matButton"] }, { kind: "component", type: i5.MtxClock, selector: "mtx-clock", inputs: ["dateFilter", "interval", "twelvehour", "AMPM", "activeDate", "selected", "minDate", "maxDate", "startView"], outputs: ["selectedChange", "activeDateChange", "_userSelection"], exportAs: ["mtxClock"] }, { kind: "directive", type: MtxTimeInput, selector: "input.mtx-time-input", inputs: ["timeInterval", "timeMin", "timeMax", "timeValue"], outputs: ["timeValueChanged"], exportAs: ["mtxTimeInput"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MtxTime, decorators: [{
            type: Component,
            args: [{ selector: 'mtx-time', exportAs: 'mtxTime', host: {
                        class: 'mtx-time',
                    }, encapsulation: ViewEncapsulation.None, changeDetection: ChangeDetectionStrategy.OnPush, template: "<div class=\"mtx-time-input-wrapper\">\n  <div class=\"mtx-time-input-inner\">\n    <input class=\"mtx-time-input\"\n           [class.mtx-time-input-active]=\"clockView === 'hour'\"\n           [class.mtx-time-input-warning]=\"!hourInput.valid\"\n           #hourInput=\"mtxTimeInput\"\n           type=\"text\"\n           inputmode=\"numeric\"\n           maxlength=\"2\"\n           [timeMin]=\"twelvehour ? 1 : 0\"\n           [timeMax]=\"twelvehour ? 12 : 23\"\n           [timeValue]=\"hour\"\n           (timeValueChanged)=\"handleHourInputChange($event)\"\n           (focus)=\"handleFocus('hour')\" />\n\n    <div class=\"mtx-time-seperator\">:</div>\n\n    <input class=\"mtx-time-input\"\n           [class.mtx-time-input-active]=\"clockView === 'minute'\"\n           [class.mtx-time-input-warning]=\"!minuteInput.valid\"\n           #minuteInput=\"mtxTimeInput\"\n           type=\"text\"\n           inputmode=\"numeric\"\n           maxlength=\"2\"\n           [timeMin]=\"0\"\n           [timeMax]=\"59\"\n           [timeValue]=\"minute\"\n           (timeValueChanged)=\"handleMinuteInputChange($event)\"\n           [timeInterval]=\"interval\"\n           (focus)=\"handleFocus('minute')\" />\n\n    <div *ngIf=\"twelvehour\" class=\"mtx-time-ampm\">\n      <button mat-button type=\"button\" class=\"mtx-time-am\"\n              [class.mtx-time-ampm-active]=\"AMPM === 'AM'\" aria-label=\"AM\"\n              (keydown)=\"$event.stopPropagation()\"\n              (click)=\"ampmChange.emit('AM')\">AM</button>\n      <button mat-button type=\"button\" class=\"mtx-time-pm\"\n              [class.mtx-time-ampm-active]=\"AMPM === 'PM'\" aria-label=\"PM\"\n              (keydown)=\"$event.stopPropagation()\"\n              (click)=\"ampmChange.emit('PM')\">PM</button>\n    </div>\n  </div>\n</div>\n\n<mtx-clock (selectedChange)=\"_timeSelected($event)\"\n           (activeDateChange)=\"_onActiveDateChange($event)\"\n           [AMPM]=\"AMPM\"\n           [dateFilter]=\"dateFilter\"\n           [interval]=\"interval\"\n           [maxDate]=\"maxDate\"\n           [minDate]=\"minDate\"\n           [selected]=\"selected\"\n           [startView]=\"clockView\"\n           [twelvehour]=\"twelvehour\">\n</mtx-clock>\n\n<div class=\"mtx-time-button-wrapper\">\n  <button class=\"mtx-time-cancel-button\" mat-button type=\"button\" (click)=\"handleCancel()\">\n    {{ _datetimepickerIntl.cancelLabel }}\n  </button>\n  <button class=\"mtx-time-ok-button\" mat-button type=\"button\" (click)=\"handleOk()\"\n          [disabled]=\"minuteInputDirective?.invalid || hourInputDirective?.invalid\">\n    {{ _datetimepickerIntl.okLabel }}\n  </button>\n</div>\n", styles: [".mtx-time{display:block;outline:none;-webkit-user-select:none;user-select:none}.mtx-time-input-wrapper{padding:8px 0;text-align:center}.mtx-time-input-inner{display:inline-flex;height:56px}.mtx-time-input{box-sizing:border-box;width:72px;height:100%;padding:0;font-size:36px;text-align:center;border-radius:8px;border:2px solid transparent;-webkit-appearance:none;appearance:none;outline:none}.mtx-time-seperator{display:inline-flex;justify-content:center;align-items:center;width:24px;font-size:36px}.mtx-time-ampm{display:inline-flex;flex-direction:column;margin-left:12px}[dir=rtl] .mtx-time-ampm{margin-left:auto;margin-right:12px}.mtx-time-ampm .mtx-time-am,.mtx-time-ampm .mtx-time-pm{--mdc-typography-button-font-weight: 400;flex:1;width:40px;min-width:auto;border-width:1px;border-style:solid}.mtx-time-ampm .mtx-time-am .mat-mdc-button-touch-target,.mtx-time-ampm .mtx-time-pm .mat-mdc-button-touch-target{height:100%}.mtx-time-ampm .mtx-time-am{border-radius:8px 8px 0 0}.mtx-time-ampm .mtx-time-pm{border-radius:0 0 8px 8px;border-top:none}.mtx-time-button-wrapper{display:flex;justify-content:flex-end;padding-top:8px}.mtx-time-button-wrapper .mat-mdc-button-base+.mat-mdc-button-base{margin-left:8px}[dir=rtl] .mtx-time-button-wrapper .mat-mdc-button-base+.mat-mdc-button-base{margin-left:0;margin-right:8px}\n"] }]
        }], ctorParameters: function () { return [{ type: i1.DatetimeAdapter }, { type: i0.ChangeDetectorRef }, { type: i2.MtxDatetimepickerIntl }]; }, propDecorators: { selectedChange: [{
                type: Output
            }], activeDateChange: [{
                type: Output
            }], _userSelection: [{
                type: Output
            }], ampmChange: [{
                type: Output
            }], clockViewChange: [{
                type: Output
            }], dateFilter: [{
                type: Input
            }], interval: [{
                type: Input
            }], hourInputElement: [{
                type: ViewChild,
                args: ['hourInput', { read: (ElementRef) }]
            }], hourInputDirective: [{
                type: ViewChild,
                args: ['hourInput', { read: MtxTimeInput }]
            }], minuteInputElement: [{
                type: ViewChild,
                args: ['minuteInput', { read: (ElementRef) }]
            }], minuteInputDirective: [{
                type: ViewChild,
                args: ['minuteInput', { read: MtxTimeInput }]
            }], twelvehour: [{
                type: Input
            }], AMPM: [{
                type: Input
            }], activeDate: [{
                type: Input
            }], selected: [{
                type: Input
            }], minDate: [{
                type: Input
            }], maxDate: [{
                type: Input
            }], clockView: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGltZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL2V4dGVuc2lvbnMvZGF0ZXRpbWVwaWNrZXIvdGltZS50cyIsIi4uLy4uLy4uLy4uL3Byb2plY3RzL2V4dGVuc2lvbnMvZGF0ZXRpbWVwaWNrZXIvdGltZS5odG1sIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFFTCxxQkFBcUIsRUFDckIsb0JBQW9CLEdBRXJCLE1BQU0sdUJBQXVCLENBQUM7QUFDL0IsT0FBTyxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQztBQUM3RCxPQUFPLEVBRUwsdUJBQXVCLEVBRXZCLFNBQVMsRUFDVCxTQUFTLEVBQ1QsVUFBVSxFQUNWLFlBQVksRUFDWixLQUFLLEVBR0wsTUFBTSxFQUVOLFNBQVMsRUFDVCxpQkFBaUIsR0FDbEIsTUFBTSxlQUFlLENBQUM7Ozs7Ozs7QUFRdkIsU0FBUyxHQUFHLENBQUMsR0FBZ0IsRUFBRSxJQUFZO0lBQ3pDLEdBQUcsR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDbEIsT0FBTyxHQUFHLENBQUMsTUFBTSxHQUFHLElBQUk7UUFBRSxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsQ0FBQztJQUMxQyxPQUFPLEdBQUcsQ0FBQztBQUNiLENBQUM7QUFVRCxNQUFNLE9BQU8sWUFBWTtJQUN2QixJQUNJLFlBQVksQ0FBQyxLQUFrQjtRQUNqQyxJQUFJLENBQUMsU0FBUyxHQUFHLG9CQUFvQixDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQy9DLENBQUM7SUFHRCxJQUNJLE9BQU8sQ0FBQyxLQUFrQjtRQUM1QixJQUFJLENBQUMsSUFBSSxHQUFHLG9CQUFvQixDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQzFDLENBQUM7SUFHRCxJQUNJLE9BQU8sQ0FBQyxLQUFrQjtRQUM1QixJQUFJLENBQUMsSUFBSSxHQUFHLG9CQUFvQixDQUFDLEtBQUssQ0FBQyxDQUFD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QU07Z0JBR0UsVUFBVTtzQkFBbEIsS0FBSztnQkFHRyxRQUFRO3NCQUFoQixLQUFLO2dCQUdJLGdCQUFnQjtzQkFEekIsU0FBUzt1QkFBQyxXQUFXLEVBQUUsRUFBRSxJQUFJLEVBQUUsQ0FBQSxVQUE0QixDQUFBLEVBQUU7Z0JBSXBELGtCQUFrQjtzQkFEM0IsU0FBUzt1QkFBQyxXQUFXLEVBQUUsRUFBRSxJQUFJLEVBQUUsWUFBWSxFQUFFO2dCQUlwQyxrQkFBa0I7c0JBRDNCLFNBQVM7dUJBQUMsYUFBYSxFQUFFLEVBQUUsSUFBSSxFQUFFLENBQUEsVUFBNEIsQ0FBQSxFQUFFO2dCQUl0RCxvQkFBb0I7c0JBRDdCLFNBQVM7dUJBQUMsYUFBYSxFQUFFLEVBQUUsSUFBSSxFQUFFLFlBQVksRUFBRTtnQkFPNUMsVUFBVTtzQkFEYixLQUFLO2dCQVVHLElBQUk7c0JBQVosS0FBSztnQkFNRixVQUFVO3NCQURiLEtBQUs7Z0JBV0YsUUFBUTtzQkFEWCxLQUFLO2dCQWNGLE9BQU87c0JBRFYsS0FBSztnQkFZRixPQUFPO3NCQURWLEtBQUs7Z0JBV0YsU0FBUztzQkFEWixLQUFLIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgQm9vbGVhbklucHV0LFxuICBjb2VyY2VCb29sZWFuUHJvcGVydHksXG4gIGNvZXJjZU51bWJlclByb3BlcnR5LFxuICBOdW1iZXJJbnB1dCxcbn0gZnJvbSAnQGFuZ3VsYXIvY2RrL2NvZXJjaW9uJztcbmltcG9ydCB7IERPV05fQVJST1csIFVQX0FSUk9XIH0gZnJvbSAnQGFuZ3VsYXIvY2RrL2tleWNvZGVzJztcbmltcG9ydCB7XG4gIEFmdGVyVmlld0luaXQsXG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBDaGFuZ2VEZXRlY3RvclJlZixcbiAgQ29tcG9uZW50LFxuICBEaXJlY3RpdmUsXG4gIEVsZW1lbnRSZWYsXG4gIEV2ZW50RW1pdHRlcixcbiAgSW5wdXQsXG4gIE9uQ2hhbmdlcyxcbiAgT25EZXN0cm95LFxuICBPdXRwdXQsXG4gIFNpbXBsZUNoYW5nZXMsXG4gIFZpZXdDaGlsZCxcbiAgVmlld0VuY2Fwc3VsYXRpb24sXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgRGF0ZXRpbWVBZGFwdGVyIH0gZnJvbSAnQG5nLW1hdGVyby9leHRlbnNpb25zL2NvcmUnO1xuaW1wb3J0IHsgU3Vic2NyaXB0aW9uTGlrZSB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgTXR4Q2xvY2tWaWV3IH0gZnJvbSAnLi9jbG9jayc7XG5pbXBvcnQgeyBNdHhEYXRldGltZXBpY2tlckZpbHRlclR5cGUgfSBmcm9tICcuL2RhdGV0aW1lcGlja2VyLWZpbHRlcnR5cGUnO1xuaW1wb3J0IHsgTXR4RGF0ZXRpbWVwaWNrZXJJbnRsIH0gZnJvbSAnLi9kYXRldGltZXBpY2tlci1pbnRsJztcbmltcG9ydCB7IE10eEFNUE0gfSBmcm9tICcuL2RhdGV0aW1lcGlja2VyLXR5cGVzJztcblxuZnVuY3Rpb24gcGFkKG51bTogTnVtYmVySW5wdXQsIHNpemU6IG51bWJlcikge1xuICBudW0gPSBTdHJpbmcobnVtKTtcbiAgd2hpbGUgKG51bS5sZW5ndGggPCBzaXplKSBudW0gPSAnMCcgKyBudW07XG4gIHJldHVybiBudW07XG59XG5cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ2lucHV0Lm10eC10aW1lLWlucHV0JyxcbiAgaG9zdDoge1xuICAgICcoYmx1ciknOiAnYmx1cigkZXZlbnQpJyxcbiAgICAnKGZvY3VzKSc6ICdmb2N1cygkZXZlbnQpJyxcbiAgfSxcbiAgZXhwb3J0QXM6ICdtdHhUaW1lSW5wdXQnLFxufSlcbmV4cG9ydCBjbGFzcyBNdHhUaW1lSW5wdXQgaW1wbGVtZW50cyBPbkRlc3Ryb3kge1xuICBASW5wdXQoJ3RpbWVJbnRlcnZhbCcpXG4gIHNldCB0aW1lSW50ZXJ2YWwodmFsdWU6IE51bWJlcklucHV0KSB7XG4gICAgdGhpcy5faW50ZXJ2YWwgPSBjb2VyY2VOdW1iZXJQcm9wZXJ0eSh2YWx1ZSk7XG4gIH1cbiAgcHJpdmF0ZSBfaW50ZXJ2YWw6IG51bWJlciA9IDE7XG5cbiAgQElucHV0KCd0aW1lTWluJylcbiAgc2V0IHRpbWVNaW4odmFsdWU6IE51bWJlcklucHV0KSB7XG4gICAgdGhpcy5fbWluID0gY29lcmNlTnVtYmVyUHJvcGVydHkodmFsdWUpO1xuICB9XG4gIHByaXZhdGUgX21pbiA9IDA7XG5cbiAgQElucHV0KCd0aW1lTWF4JylcbiAgc2V0IHRpbWVNYXgodmFsdWU6IE51bWJlcklucHV0KSB7XG4gICAgdGhpcy5fbWF4ID0gY29lcmNlTnVtYmVyUHJvcGVydHkodmFsdWUpO1xuICB9XG4gIHByaXZhdGUgX21heCA9IEluZmluaXR5O1xuXG4gIEBJbnB1dCgndGltZVZhbHVlJylcbiAgc2V0IHRpbWVWYWx1ZSh2YWx1ZTogTnVtYmVySW5wdXQpIHtcbiAgICB0aGlzLl92YWx1ZSA9IGNvZXJjZU51bWJlclByb3BlcnR5KHZhbHVlKTtcbiAgICBpZiAoIXRoaXMuaGFzRm9jdXMpIHtcbiAgICAgIHRoaXMud3JpdGVWYWx1ZSh0aGlzLl92YWx1ZSk7XG4gICAgfVxuICAgIHRoaXMud3JpdGVQbGFjZWhvbGRlcih0aGlzLl92YWx1ZSk7XG4gIH1cblxuICBAT3V0cHV0KCkgdGltZVZhbHVlQ2hhbmdlZCA9IG5ldyBFdmVudEVtaXR0ZXI8TnVtYmVySW5wdXQ+KCk7XG5cbiAgcHJpdmF0ZSBfdmFsdWU6IE51bWJlcklucHV0O1xuXG4gIHByaXZhdGUga2V5RG93bkxpc3RlbmVyID0gdGhpcy5rZXlEb3duSGFuZGxlci5iaW5kKHRoaXMpO1xuICBwcml2YXRlIGtleVByZXNzTGlzdGVuZXIgPSB0aGlzLmtleVByZXNzSGFuZGxlci5iaW5kKHRoaXMpO1xuICBwcml2YXRlIGlucHV0RXZlbnRMaXN0ZW5lciA9IHRoaXMuaW5wdXRDaGFuZ2VkSGFuZGxlci5iaW5kKHRoaXMpO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgZWxlbWVudDogRWxlbWVudFJlZiwgcHJpdmF0ZSBjZHI6IENoYW5nZURldGVjdG9yUmVmKSB7XG4gICAgdGhpcy5pbnB1dEVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIHRoaXMua2V5RG93bkxpc3RlbmVyLCB7XG4gICAgICBwYXNzaXZlOiB0cnVlLFxuICAgIH0pO1xuXG4gICAgLy8gRG8gbm90IHBhc3NpdmUgc2luY2Ugd2Ugd2FudCB0byBiZSBhYmxlIHRvIHByZXZlbnREZWZhdWx0KClcbiAgICB0aGlzLmlucHV0RWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXlwcmVzcycsIHRoaXMua2V5UHJlc3NMaXN0ZW5lcik7XG4gICAgdGhpcy5pbnB1dEVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCB0aGlzLmlucHV0RXZlbnRMaXN0ZW5lciwge1xuICAgICAgcGFzc2l2ZTogdHJ1ZSxcbiAgICB9KTtcbiAgfVxuXG4gIGdldCBoYXNGb2N1cygpIHtcbiAgICByZXR1cm4gdGhpcy5lbGVtZW50Lm5hdGl2ZUVsZW1lbnQgJiYgdGhpcy5lbGVtZW50Py5uYXRpdmVFbGVtZW50ID09PSBkb2N1bWVudD8uYWN0aXZlRWxlbWVudDtcbiAgfVxuXG4gIGdldCBpbnB1dEVsZW1lbnQoKSB7XG4gICAgcmV0dXJuIHRoaXMuZWxlbWVudC5uYXRpdmVFbGVtZW50IGFzIEhUTUxJbnB1dEVsZW1lbnQ7XG4gIH1cblxuICAvLyBXZSBsb29rIGhlcmUgYXQgdGhlIHBsYWNlaG9sZGVyIHZhbHVlLCBiZWNhdXNlIHdlIHdyaXRlICcnIGludG8gdGhlIHZhbHVlIG9uIGZvY3VzXG4gIC8vIHBsYWNlaG9sZGVyIHNob3VsZCBhbHdheXMgYmUgdXAgdG8gZGF0ZSB3aXRoIFwiY3VycmVudFZhbHVlXCJcbiAgZ2V0IHZhbGlkKCkge1xuICAgIC8vIEF0IHRoZSBzdGFydCBfdmFsdWUgaXMgdW5kZWZpbmVkIHRoZXJlZm9yZSB0aGlzIHdvdWxkIHJlc3VsdCBpbiBub3QgdmFsaWQgYW5kXG4gICAgLy8gbWFrZSBhIHVnbHkgd2FybmluZyBib3JkZXIgYWZ0ZXJ3YXJkcyB3ZSBjYW4gc2FmZWx5IGNoZWNrXG4gICAgaWYgKHRoaXMuX3ZhbHVlKSB7XG4gICAgICBjb25zdCBjdXJyZW50VmFsdWUgPSBTdHJpbmcodGhpcy5pbnB1dEVsZW1lbnQudmFsdWUpO1xuXG4gICAgICAvLyBJdCBjYW4gYmUgdGhhdCBjdXJyZW50VmFsdWUgaXMgZW1wdHkgZHVlIHRvIHdlIHJlbW92aW5nIHRoZSB2YWx1ZSBvbiBmb2N1cyxcbiAgICAgIC8vIGlmIHRoYXQgaXMgdGhlIGNhc2Ugd2Ugc2hvdWxkIGNoZWNrIHByZXZpb3VzIHZhbHVlIHdoaWNoIHNob3VsZCBiZSBpbiB0aGUgcGxhY2Vob2xkZXJcbiAgICAgIGlmIChjdXJyZW50VmFsdWUubGVuZ3RoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl92YWx1ZSA9PSB0aGlzLmlucHV0RWxlbWVudC52YWx1ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB0aGlzLl92YWx1ZSA9PSB0aGlzLmlucHV0RWxlbWVudC5wbGFjZWhvbGRlcjtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBnZXQgaW52YWxpZCgpIHtcbiAgICByZXR1cm4gIXRoaXMudmFsaWQ7XG4gIH1cblxuICBibHVyKCkge1xuICAgIHRoaXMud3JpdGVWYWx1ZSh0aGlzLl92YWx1ZSk7XG4gICAgdGhpcy53cml0ZVBsYWNlaG9sZGVyKHRoaXMuX3ZhbHVlKTtcbiAgICB0aGlzLnRpbWVWYWx1ZUNoYW5nZWQuZW1pdCh0aGlzLl92YWx1ZSk7XG4gIH1cblxuICBmb2N1cygpIHtcbiAgICB0aGlzLndyaXRlVmFsdWUoJycpO1xuICB9XG5cbiAgLyoqXG4gICAqIFdyaXRlIHZhbHVlIHRvIGlucHV0RWxlbWVudFxuICAgKiBAcGFyYW0gdmFsdWUgTnVtYmVySW5wdXRcbiAgICovXG4gIHdyaXRlVmFsdWUodmFsdWU6IE51bWJlcklucHV0KSB7XG4gICAgaWYgKHZhbHVlICE9PSAnJykge1xuICAgICAgdGhpcy5pbnB1dEVsZW1lbnQudmFsdWUgPSBwYWQodmFsdWUsIDIpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmlucHV0RWxlbWVudC52YWx1ZSA9ICcnO1xuICAgIH1cbiAgICB0aGlzLmNkci5tYXJrRm9yQ2hlY2soKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBXcml0ZXMgdmFsdWUgdG8gcGxhY2Vob2xkZXJcbiAgICogQHBhcmFtIHZhbHVlIE51bWJlcklucHV0XG4gICAqL1xuICB3cml0ZVBsYWNlaG9sZGVyKHZhbHVlOiBOdW1iZXJJbnB1dCkge1xuICAgIHRoaXMuaW5wdXRFbGVtZW50LnBsYWNlaG9sZGVyID0gcGFkKHZhbHVlLCAyKTtcbiAgICB0aGlzLmNkci5tYXJrRm9yQ2hlY2soKTtcbiAgfVxuXG4gIGtleURvd25IYW5kbGVyKGV2ZW50OiBLZXlib2FyZEV2ZW50KSB7XG4gICAgaWYgKFN0cmluZyh0aGlzLmlucHV0RWxlbWVudC52YWx1ZSkubGVuZ3RoID4gMCkge1xuICAgICAgbGV0IHZhbHVlOiBudW1iZXIgfCBudWxsID0gbnVsbDtcbiAgICAgIGlmIChldmVudC5rZXlDb2RlID09PSBVUF9BUlJPVykge1xuICAgICAgICB2YWx1ZSA9IGNvZXJjZU51bWJlclByb3BlcnR5KHRoaXMuX3ZhbHVlKTtcbiAgICAgICAgdmFsdWUgKz0gdGhpcy5faW50ZXJ2YWw7XG4gICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgfSBlbHNlIGlmIChldmVudC5rZXlDb2RlID09PSBET1dOX0FSUk9XKSB7XG4gICAgICAgIHZhbHVlID0gY29lcmNlTnVtYmVyUHJvcGVydHkodGhpcy5fdmFsdWUpO1xuICAgICAgICB2YWx1ZSAtPSB0aGlzLl9pbnRlcnZhbDtcbiAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICB9XG5cbiAgICAgIC8vIGlmIHZhbHVlIGhhcyBjaGFuZ2VkXG4gICAgICBpZiAodHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJykge1xuICAgICAgICB0aGlzLndyaXRlVmFsdWUodmFsdWUpO1xuICAgICAgICB0aGlzLndyaXRlUGxhY2Vob2xkZXIodmFsdWUpO1xuICAgICAgICB0aGlzLmNsYW1wSW5wdXRWYWx1ZSgpO1xuICAgICAgICB0aGlzLnRpbWVWYWx1ZUNoYW5nZWQuZW1pdCh0aGlzLl92YWx1ZSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFByZXZlbnQgbm9uIG51bWJlciBpbnB1dHMgaW4gdGhlIGlucHV0RWxlbWVudCB3aXRoIHRoZSBleGNlcHRpb24gb2YgRW50ZXIvQmFja1NwYWNlXG4gICAqIEBwYXJhbSBldmVudCBLZXlib2FyZEV2ZW50XG4gICAqL1xuICBrZXlQcmVzc0hhbmRsZXIoZXZlbnQ6IEtleWJvYXJkRXZlbnQpIHtcbiAgICBjb25zdCBrZXkgPSBldmVudD8ua2V5ID8/IG51bGw7XG4gICAgaWYgKGlzTmFOKE51bWJlcihrZXkpKSAmJiBrZXkgIT09ICdFbnRlcicpIHtcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgfVxuICB9XG5cbiAgaW5wdXRDaGFuZ2VkSGFuZGxlcigpIHtcbiAgICB0aGlzLmNsYW1wSW5wdXRWYWx1ZSgpO1xuICAgIHRoaXMudGltZVZhbHVlQ2hhbmdlZC5lbWl0KHRoaXMuX3ZhbHVlKTtcbiAgfVxuXG4gIGNsYW1wSW5wdXRWYWx1ZSgpIHtcbiAgICBpZiAodGhpcy5pbnB1dEVsZW1lbnQ/LnZhbHVlID09PSAnJykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHZhbHVlID0gY29lcmNlTnVtYmVyUHJvcGVydHkodGhpcy5pbnB1dEVsZW1lbnQ/LnZhbHVlID8/IG51bGwpO1xuICAgIC8vIGlmIHRoaXMuX21pbiA9PT0gMCwgd2Ugc2hvdWxkIGFsbG93IDBcbiAgICBpZiAodmFsdWUgfHwgKHRoaXMuX21pbiA9PT0gMCAmJiB2YWx1ZSA9PT0gMCkpIHtcbiAgICAgIGNvbnN0IGNsYW1wZWRWYWx1ZSA9IE1hdGgubWluKE1hdGgubWF4KHZhbHVlLCB0aGlzLl9taW4pLCB0aGlzLl9tYXgpO1xuICAgICAgaWYgKGNsYW1wZWRWYWx1ZSAhPT0gdmFsdWUpIHtcbiAgICAgICAgdGhpcy53cml0ZVZhbHVlKGNsYW1wZWRWYWx1ZSk7XG4gICAgICAgIHRoaXMud3JpdGVQbGFjZWhvbGRlcihjbGFtcGVkVmFsdWUpO1xuICAgICAgfVxuICAgICAgdGhpcy5fdmFsdWUgPSBjbGFtcGVkVmFsdWU7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZSBldmVudCBsaXN0ZW5lcnMgb24gZGVzdHJ1Y3Rpb25cbiAgICovXG4gIG5nT25EZXN0cm95KCk6IHZvaWQge1xuICAgIHRoaXMuaW5wdXRFbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCB0aGlzLmtleURvd25MaXN0ZW5lcik7XG4gICAgdGhpcy5pbnB1dEVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigna2V5cHJlc3MnLCB0aGlzLmtleVByZXNzTGlzdGVuZXIpO1xuICAgIHRoaXMuaW5wdXRFbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2lucHV0JywgdGhpcy5pbnB1dEV2ZW50TGlzdGVuZXIpO1xuICB9XG59XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ210eC10aW1lJyxcbiAgdGVtcGxhdGVVcmw6ICd0aW1lLmh0bWwnLFxuICBzdHlsZVVybHM6IFsndGltZS5zY3NzJ10sXG4gIGV4cG9ydEFzOiAnbXR4VGltZScsXG4gIGhvc3Q6IHtcbiAgICBjbGFzczogJ210eC10aW1lJyxcbiAgfSxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG59KVxuZXhwb3J0IGNsYXNzIE10eFRpbWU8RD4gaW1wbGVtZW50cyBPbkNoYW5nZXMsIEFmdGVyVmlld0luaXQsIE9uRGVzdHJveSB7XG4gIC8qKiBFbWl0cyB3aGVuIHRoZSBjdXJyZW50bHkgc2VsZWN0ZWQgZGF0ZSBjaGFuZ2VzLiAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgc2VsZWN0ZWRDaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyPEQ+KCk7XG5cbiAgLyoqIEVtaXRzIHdoZW4gYW55IGRhdGUgY2hhbmdlcy4gKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IGFjdGl2ZURhdGVDaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyPEQ+KCk7XG5cbiAgLyoqIEVtaXRzIHdoZW4gYW55IGRhdGUgaXMgc2VsZWN0ZWQuICovXG4gIEBPdXRwdXQoKSByZWFkb25seSBfdXNlclNlbGVjdGlvbiA9IG5ldyBFdmVudEVtaXR0ZXI8dm9pZD4oKTtcblxuICAvKiogRW1pdHMgd2hlbiBBTS9QTSBidXR0b24gYXJlIGNsaWNrZWQuICovXG4gIEBPdXRwdXQoKSByZWFkb25seSBhbXBtQ2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcjxNdHhBTVBNPigpO1xuXG4gIC8qKiBFbWl0cyB3aGVuIEFNL1BNIGJ1dHRvbiBhcmUgY2xpY2tlZC4gKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IGNsb2NrVmlld0NoYW5nZSA9IG5ldyBFdmVudEVtaXR0ZXI8TXR4Q2xvY2tWaWV3PigpO1xuXG4gIC8qKiBBIGZ1bmN0aW9uIHVzZWQgdG8gZmlsdGVyIHdoaWNoIGRhdGVzIGFyZSBzZWxlY3RhYmxlLiAqL1xuICBASW5wdXQoKSBkYXRlRmlsdGVyITogKGRhdGU6IEQsIHR5cGU6IE10eERhdGV0aW1lcGlja2VyRmlsdGVyVHlwZSkgPT4gYm9vbGVhbjtcblxuICAvKiogU3RlcCBvdmVyIG1pbnV0ZXMuICovXG4gIEBJbnB1dCgpIGludGVydmFsOiBudW1iZXIgPSAxO1xuXG4gIEBWaWV3Q2hpbGQoJ2hvdXJJbnB1dCcsIHsgcmVhZDogRWxlbWVudFJlZjxIVE1MSW5wdXRFbGVtZW50PiB9KVxuICBwcm90ZWN0ZWQgaG91cklucHV0RWxlbWVudDogRWxlbWVudFJlZjxIVE1MSW5wdXRFbGVtZW50PiB8IHVuZGVmaW5lZDtcblxuICBAVmlld0NoaWxkKCdob3VySW5wdXQnLCB7IHJlYWQ6IE10eFRpbWVJbnB1dCB9KVxuICBwcm90ZWN0ZWQgaG91cklucHV0RGlyZWN0aXZlOiBNdHhUaW1lSW5wdXQgfCB1bmRlZmluZWQ7XG5cbiAgQFZpZXdDaGlsZCgnbWludXRlSW5wdXQnLCB7IHJlYWQ6IEVsZW1lbnRSZWY8SFRNTElucHV0RWxlbWVudD4gfSlcbiAgcHJvdGVjdGVkIG1pbnV0ZUlucHV0RWxlbWVudDogRWxlbWVudFJlZjxIVE1MSW5wdXRFbGVtZW50PiB8IHVuZGVmaW5lZDtcblxuICBAVmlld0NoaWxkKCdtaW51dGVJbnB1dCcsIHsgcmVhZDogTXR4VGltZUlucHV0IH0pXG4gIHByb3RlY3RlZCBtaW51dGVJbnB1dERpcmVjdGl2ZTogTXR4VGltZUlucHV0IHwgdW5kZWZpbmVkO1xuXG4gIGRhdGV0aW1lcGlja2VySW50bENoYW5nZXNTdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbkxpa2U7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGNsb2NrIHVzZXMgMTIgaG91ciBmb3JtYXQuICovXG4gIEBJbnB1dCgpXG4gIGdldCB0d2VsdmVob3VyKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl90d2VsdmVob3VyO1xuICB9XG4gIHNldCB0d2VsdmVob3VyKHZhbHVlOiBib29sZWFuKSB7XG4gICAgdGhpcy5fdHdlbHZlaG91ciA9IGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSh2YWx1ZSk7XG4gIH1cbiAgcHJpdmF0ZSBfdHdlbHZlaG91ciA9IGZhbHNlO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSB0aW1lIGlzIG5vdyBpbiBBTSBvciBQTS4gKi9cbiAgQElucHV0KCkgQU1QTTogTXR4QU1QTSA9ICdBTSc7XG5cbiAgLyoqXG4gICAqIFRoZSBkYXRlIHRvIGRpc3BsYXkgaW4gdGhpcyBjbG9jayB2aWV3LlxuICAgKi9cbiAgQElucHV0KClcbiAgZ2V0IGFjdGl2ZURhdGUoKTogRCB7XG4gICAgcmV0dXJuIHRoaXMuX2FjdGl2ZURhdGU7XG4gIH1cbiAgc2V0IGFjdGl2ZURhdGUodmFsdWU6IEQpIHtcbiAgICB0aGlzLl9hY3RpdmVEYXRlID0gdGhpcy5fYWRhcHRlci5jbGFtcERhdGUodmFsdWUsIHRoaXMubWluRGF0ZSwgdGhpcy5tYXhEYXRlKTtcbiAgfVxuICBwcml2YXRlIF9hY3RpdmVEYXRlITogRDtcblxuICAvKiogVGhlIGN1cnJlbnRseSBzZWxlY3RlZCBkYXRlLiAqL1xuICBASW5wdXQoKVxuICBnZXQgc2VsZWN0ZWQoKTogRCB8IG51bGwge1xuICAgIHJldHVybiB0aGlzLl9zZWxlY3RlZDtcbiAgfVxuICBzZXQgc2VsZWN0ZWQodmFsdWU6IEQgfCBudWxsKSB7XG4gICAgdGhpcy5fc2VsZWN0ZWQgPSB0aGlzLl9hZGFwdGVyLmdldFZhbGlkRGF0ZU9yTnVsbCh0aGlzLl9hZGFwdGVyLmRlc2VyaWFsaXplKHZhbHVlKSk7XG4gICAgaWYgKHRoaXMuX3NlbGVjdGVkKSB7XG4gICAgICB0aGlzLmFjdGl2ZURhdGUgPSB0aGlzLl9zZWxlY3RlZDtcbiAgICB9XG4gIH1cbiAgcHJpdmF0ZSBfc2VsZWN0ZWQhOiBEIHwgbnVsbDtcblxuICAvKiogVGhlIG1pbmltdW0gc2VsZWN0YWJsZSBkYXRlLiAqL1xuICBASW5wdXQoKVxuICBnZXQgbWluRGF0ZSgpOiBEIHwgbnVsbCB7XG4gICAgcmV0dXJuIHRoaXMuX21pbkRhdGU7XG4gIH1cblxuICBzZXQgbWluRGF0ZSh2YWx1ZTogRCB8IG51bGwpIHtcbiAgICB0aGlzLl9taW5EYXRlID0gdGhpcy5fYWRhcHRlci5nZXRWYWxpZERhdGVPck51bGwodGhpcy5fYWRhcHRlci5kZXNlcmlhbGl6ZSh2YWx1ZSkpO1xuICB9XG4gIHByaXZhdGUgX21pbkRhdGUhOiBEIHwgbnVsbDtcblxuICAvKiogVGhlIG1heGltdW0gc2VsZWN0YWJsZSBkYXRlLiAqL1xuICBASW5wdXQoKVxuICBnZXQgbWF4RGF0ZSgpOiBEIHwgbnVsbCB7XG4gICAgcmV0dXJuIHRoaXMuX21heERhdGU7XG4gIH1cbiAgc2V0IG1heERhdGUodmFsdWU6IEQgfCBudWxsKSB7XG4gICAgdGhpcy5fbWF4RGF0ZSA9IHRoaXMuX2FkYXB0ZXIuZ2V0VmFsaWREYXRlT3JOdWxsKHRoaXMuX2FkYXB0ZXIuZGVzZXJpYWxpemUodmFsdWUpKTtcbiAgfVxuICBwcml2YXRlIF9tYXhEYXRlITogRCB8IG51bGw7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGNsb2NrIHNob3VsZCBiZSBzdGFydGVkIGluIGhvdXIgb3IgbWludXRlIHZpZXcuICovXG4gIEBJbnB1dCgpXG4gIGdldCBjbG9ja1ZpZXcoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2Nsb2NrVmlldztcbiAgfVxuICBzZXQgY2xvY2tWaWV3KHZhbHVlOiBNdHhDbG9ja1ZpZXcpIHtcbiAgICB0aGlzLl9jbG9ja1ZpZXcgPSB2YWx1ZTtcbiAgfVxuICAvKiogV2hldGhlciB0aGUgY2xvY2sgaXMgaW4gaG91ciB2aWV3LiAqL1xuICBwcml2YXRlIF9jbG9ja1ZpZXc6IE10eENsb2NrVmlldyA9ICdob3VyJztcblxuICBnZXQgaXNIb3VyVmlldygpIHtcbiAgICByZXR1cm4gdGhpcy5fY2xvY2tWaWV3ID09PSAnaG91cic7XG4gIH1cblxuICBnZXQgaXNNaW51dGVWaWV3KCkge1xuICAgIHJldHVybiB0aGlzLl9jbG9ja1ZpZXcgPT09ICdob3VyJztcbiAgfVxuXG4gIGdldCBob3VyKCkge1xuICAgIGlmICghdGhpcy5hY3RpdmVEYXRlKSB7XG4gICAgICBpZiAodGhpcy50d2VsdmVob3VyKSB7XG4gICAgICAgIHJldHVybiAnMTInO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuICcwMCc7XG4gICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgaG91ciA9IE51bWJlcih0aGlzLl9hZGFwdGVyLmdldEhvdXIodGhpcy5hY3RpdmVEYXRlKSk7XG4gICAgaWYgKCF0aGlzLnR3ZWx2ZWhvdXIpIHtcbiAgICAgIHJldHVybiB0aGlzLnByZWZpeFdpdGhaZXJvKGhvdXIpO1xuICAgIH1cblxuICAgIGlmIChob3VyID09PSAwKSB7XG4gICAgICByZXR1cm4gJzEyJztcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMucHJlZml4V2l0aFplcm8oaG91ciA+IDEyID8gaG91ciAtIDEyIDogaG91cik7XG4gICAgfVxuICB9XG5cbiAgZ2V0IG1pbnV0ZSgpIHtcbiAgICBpZiAodGhpcy5hY3RpdmVEYXRlKSB7XG4gICAgICByZXR1cm4gdGhpcy5wcmVmaXhXaXRoWmVybyh0aGlzLl9hZGFwdGVyLmdldE1pbnV0ZSh0aGlzLmFjdGl2ZURhdGUpKTtcbiAgICB9XG5cbiAgICByZXR1cm4gJzAwJztcbiAgfVxuXG4gIHByZWZpeFdpdGhaZXJvKHZhbHVlOiBudW1iZXIpIHtcbiAgICBpZiAodmFsdWUgPCAxMCkge1xuICAgICAgcmV0dXJuICcwJyArIFN0cmluZyh2YWx1ZSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIFN0cmluZyh2YWx1ZSk7XG4gIH1cblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIF9hZGFwdGVyOiBEYXRldGltZUFkYXB0ZXI8RD4sXG4gICAgcHJpdmF0ZSBfY2hhbmdlRGV0ZWN0b3JSZWY6IENoYW5nZURldGVjdG9yUmVmLFxuICAgIHByb3RlY3RlZCBfZGF0ZXRpbWVwaWNrZXJJbnRsOiBNdHhEYXRldGltZXBpY2tlckludGxcbiAgKSB7XG4gICAgdGhpcy5kYXRldGltZXBpY2tlckludGxDaGFuZ2VzU3Vic2NyaXB0aW9uID0gdGhpcy5fZGF0ZXRpbWVwaWNrZXJJbnRsLmNoYW5nZXMuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgIHRoaXMuX2NoYW5nZURldGVjdG9yUmVmLmRldGVjdENoYW5nZXMoKTtcbiAgICB9KTtcbiAgfVxuXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpOiB2b2lkIHtcbiAgICAvLyB3aGVuIGNsb2NrVmlldyBjaGFuZ2VzIGJ5IGlucHV0IHdlIHNob3VsZCBmb2N1cyB0aGUgY29ycmVjdCBpbnB1dFxuICAgIGlmIChjaGFuZ2VzLmNsb2NrVmlldykge1xuICAgICAgaWYgKGNoYW5nZXMuY2xvY2tWaWV3LmN1cnJlbnRWYWx1ZSAhPT0gY2hhbmdlcy5jbG9ja1ZpZXcucHJldmlvdXNWYWx1ZSkge1xuICAgICAgICB0aGlzLmZvY3VzSW5wdXRFbGVtZW50KCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgbmdBZnRlclZpZXdJbml0KCk6IHZvaWQge1xuICAgIHRoaXMuZm9jdXNJbnB1dEVsZW1lbnQoKTtcbiAgfVxuXG4gIGZvY3VzSW5wdXRFbGVtZW50KCkge1xuICAgIGlmICh0aGlzLmNsb2NrVmlldyA9PT0gJ2hvdXInKSB7XG4gICAgICBpZiAodGhpcy5ob3VySW5wdXRFbGVtZW50KSB7XG4gICAgICAgICh0aGlzLmhvdXJJbnB1dEVsZW1lbnQubmF0aXZlRWxlbWVudCBhcyBIVE1MSW5wdXRFbGVtZW50KS5mb2N1cygpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAodGhpcy5taW51dGVJbnB1dEVsZW1lbnQpIHtcbiAgICAgICAgKHRoaXMubWludXRlSW5wdXRFbGVtZW50Lm5hdGl2ZUVsZW1lbnQgYXMgSFRNTElucHV0RWxlbWVudCkuZm9jdXMoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBoYW5kbGVIb3VySW5wdXRDaGFuZ2UodmFsdWU6IE51bWJlcklucHV0KSB7XG4gICAgY29uc3QgaG91ciA9IGNvZXJjZU51bWJlclByb3BlcnR5KHZhbHVlKTtcbiAgICBpZiAoaG91ciB8fCBob3VyID09PSAwKSB7XG4gICAgICBjb25zdCBuZXdWYWx1ZSA9IHRoaXMuX2FkYXB0ZXIuY3JlYXRlRGF0ZXRpbWUoXG4gICAgICAgIHRoaXMuX2FkYXB0ZXIuZ2V0WWVhcih0aGlzLmFjdGl2ZURhdGUpLFxuICAgICAgICB0aGlzLl9hZGFwdGVyLmdldE1vbnRoKHRoaXMuYWN0aXZlRGF0ZSksXG4gICAgICAgIHRoaXMuX2FkYXB0ZXIuZ2V0RGF0ZSh0aGlzLmFjdGl2ZURhdGUpLFxuICAgICAgICB0aGlzLnVwZGF0ZUhvdXJGb3JBbVBtKGhvdXIpLFxuICAgICAgICB0aGlzLl9hZGFwdGVyLmdldE1pbnV0ZSh0aGlzLmFjdGl2ZURhdGUpXG4gICAgICApO1xuXG4gICAgICB0aGlzLl9hY3RpdmVEYXRlID0gdGhpcy5fYWRhcHRlci5jbGFtcERhdGUobmV3VmFsdWUsIHRoaXMubWluRGF0ZSwgdGhpcy5tYXhEYXRlKTtcbiAgICAgIHRoaXMuYWN0aXZlRGF0ZUNoYW5nZS5lbWl0KHRoaXMuYWN0aXZlRGF0ZSk7XG5cbiAgICAgIC8vIElmIHByZXZpb3VzbHkgd2UgZGlkIHNldCBbbXR4VmFsdWVdPVwiMTNcIiBhbmQgdGhlIGlucHV0IGNoYW5nZWQgdG8gNiwgYW5kIHRoZSBjbGFtcGluZ1xuICAgICAgLy8gd2lsbCBtYWtlIGl0IFwiMTNcIiBhZ2FpbiB0aGVuIHRoZSBob3VySW5wdXREaXJlY3RpdmUgd2lsbCBub3QgaGF2ZSBiZWVuIHVwZGF0ZWRcbiAgICAgIC8vIHNpbmNlIFwiMTNcIiA9PT0gXCIxM1wiIHNhbWUgcmVmZXJlbmNlIHNvIG5vIGNoYW5nZSBkZXRlY3RlZCBieSBkaXJlY3RseSBzZXR0aW5nIGl0IHdpdGhpblxuICAgICAgLy8gdGhpcyBoYW5kbGVyLCB3ZSBoYW5kbGUgdGhpcyB1c2VjYXNlXG4gICAgICBpZiAodGhpcy5ob3VySW5wdXREaXJlY3RpdmUpIHtcbiAgICAgICAgdGhpcy5ob3VySW5wdXREaXJlY3RpdmUudGltZVZhbHVlID0gdGhpcy5ob3VyO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHVwZGF0ZUhvdXJGb3JBbVBtKHZhbHVlOiBudW1iZXIpIHtcbiAgICBpZiAoIXRoaXMudHdlbHZlaG91cikge1xuICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cblxuICAgIC8vIHZhbHVlIHNob3VsZCBiZSBiZXR3ZWVuIDEtMTJcbiAgICBpZiAodGhpcy5BTVBNID09PSAnQU0nKSB7XG4gICAgICBpZiAodmFsdWUgPT09IDAgfHwgdmFsdWUgPT09IDEyKSB7XG4gICAgICAgIHJldHVybiAwO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cbiAgICAvLyBQTVxuICAgIGVsc2Uge1xuICAgICAgaWYgKHZhbHVlID09PSAwIHx8IHZhbHVlID09PSAxMikge1xuICAgICAgICByZXR1cm4gMTI7XG4gICAgICB9XG5cbiAgICAgIC8vIG90aGVyIGNhc2VzLCB3ZSBzaG91bGQgYWRkIDEyIHRvIHRoZSB2YWx1ZSBha2EgMzowMCBQTSA9IDMgKyAxMiA9IDE1OjAwXG4gICAgICByZXR1cm4gdmFsdWUgKyAxMjtcbiAgICB9XG4gIH1cblxuICBoYW5kbGVNaW51dGVJbnB1dENoYW5nZSh2YWx1ZTogTnVtYmVySW5wdXQpIHtcbiAgICBjb25zdCBtaW51dGUgPSBjb2VyY2VOdW1iZXJQcm9wZXJ0eSh2YWx1ZSk7XG4gICAgaWYgKG1pbnV0ZSB8fCBtaW51dGUgPT09IDApIHtcbiAgICAgIGNvbnN0IG5ld1ZhbHVlID0gdGhpcy5fYWRhcHRlci5jcmVhdGVEYXRldGltZShcbiAgICAgICAgdGhpcy5fYWRhcHRlci5nZXRZZWFyKHRoaXMuYWN0aXZlRGF0ZSksXG4gICAgICAgIHRoaXMuX2FkYXB0ZXIuZ2V0TW9udGgodGhpcy5hY3RpdmVEYXRlKSxcbiAgICAgICAgdGhpcy5fYWRhcHRlci5nZXREYXRlKHRoaXMuYWN0aXZlRGF0ZSksXG4gICAgICAgIHRoaXMuX2FkYXB0ZXIuZ2V0SG91cih0aGlzLl9hY3RpdmVEYXRlKSxcbiAgICAgICAgbWludXRlXG4gICAgICApO1xuICAgICAgdGhpcy5fYWN0aXZlRGF0ZSA9IHRoaXMuX2FkYXB0ZXIuY2xhbXBEYXRlKG5ld1ZhbHVlLCB0aGlzLm1pbkRhdGUsIHRoaXMubWF4RGF0ZSk7XG4gICAgICB0aGlzLmFjdGl2ZURhdGVDaGFuZ2UuZW1pdCh0aGlzLmFjdGl2ZURhdGUpO1xuXG4gICAgICAvLyBJZiBwcmV2aW91c2x5IHdlIGRpZCBzZXQgW210eFZhbHVlXT1cIjQwXCIgYW5kIHRoZSBpbnB1dCBjaGFuZ2VkIHRvIDMwLCBhbmQgdGhlIGNsYW1waW5nXG4gICAgICAvLyB3aWxsIG1ha2UgaXQgXCI0MFwiIGFnYWluIHRoZW4gdGhlIG1pbnV0ZUlucHV0RGlyZWN0aXZlIHdpbGwgbm90IGhhdmUgYmVlbiB1cGRhdGVkXG4gICAgICAvLyBzaW5jZSBcIjQwXCIgPT09IFwiNDBcIiBzYW1lIHJlZmVyZW5jZSBzbyBubyBjaGFuZ2UgZGV0ZWN0ZWQgYnkgZGlyZWN0bHkgc2V0dGluZyBpdCB3aXRoaW5cbiAgICAgIC8vIHRoaXMgaGFuZGxlciwgd2UgaGFuZGxlIHRoaXMgdXNlY2FzZVxuICAgICAgaWYgKHRoaXMubWludXRlSW5wdXREaXJlY3RpdmUpIHtcbiAgICAgICAgdGhpcy5taW51dGVJbnB1dERpcmVjdGl2ZS50aW1lVmFsdWUgPSB0aGlzLm1pbnV0ZTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBoYW5kbGVGb2N1cyhjbG9ja1ZpZXc6IE10eENsb2NrVmlldykge1xuICAgIHRoaXMuY2xvY2tWaWV3ID0gY2xvY2tWaWV3O1xuICAgIHRoaXMuY2xvY2tWaWV3Q2hhbmdlLmVtaXQoY2xvY2tWaWV3KTtcbiAgfVxuXG4gIF90aW1lU2VsZWN0ZWQoZGF0ZTogRCk6IHZvaWQge1xuICAgIGlmICh0aGlzLmNsb2NrVmlldyA9PT0gJ2hvdXInKSB7XG4gICAgICB0aGlzLmNsb2NrVmlldyA9ICdtaW51dGUnO1xuICAgIH1cbiAgICB0aGlzLl9hY3RpdmVEYXRlID0gdGhpcy5zZWxlY3RlZCA9IGRhdGU7XG4gIH1cblxuICBfb25BY3RpdmVEYXRlQ2hhbmdlKGRhdGU6IEQpIHtcbiAgICB0aGlzLl9hY3RpdmVEYXRlID0gZGF0ZTtcbiAgICB0aGlzLmFjdGl2ZURhdGVDaGFuZ2UuZW1pdChkYXRlKTtcbiAgfVxuXG4gIGhhbmRsZU9rKCkge1xuICAgIGlmICh0aGlzLl9zZWxlY3RlZCkge1xuICAgICAgdGhpcy5zZWxlY3RlZENoYW5nZS5lbWl0KHRoaXMuX3NlbGVjdGVkKTtcbiAgICB9XG4gICAgdGhpcy5fdXNlclNlbGVjdGlvbi5lbWl0KCk7XG4gIH1cblxuICBoYW5kbGVDYW5jZWwoKSB7XG4gICAgdGhpcy5fdXNlclNlbGVjdGlvbi5lbWl0KCk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5kYXRldGltZXBpY2tlckludGxDaGFuZ2VzU3Vic2NyaXB0aW9uKSB7XG4gICAgICB0aGlzLmRhdGV0aW1lcGlja2VySW50bENoYW5nZXNTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICB9XG4gIH1cblxuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfdHdlbHZlaG91cjogQm9vbGVhbklucHV0O1xufVxuIiwiPGRpdiBjbGFzcz1cIm10eC10aW1lLWlucHV0LXdyYXBwZXJcIj5cbiAgPGRpdiBjbGFzcz1cIm10eC10aW1lLWlucHV0LWlubmVyXCI+XG4gICAgPGlucHV0IGNsYXNzPVwibXR4LXRpbWUtaW5wdXRcIlxuICAgICAgICAgICBbY2xhc3MubXR4LXRpbWUtaW5wdXQtYWN0aXZlXT1cImNsb2NrVmlldyA9PT0gJ2hvdXInXCJcbiAgICAgICAgICAgW2NsYXNzLm10eC10aW1lLWlucHV0LXdhcm5pbmddPVwiIWhvdXJJbnB1dC52YWxpZFwiXG4gICAgICAgICAgICNob3VySW5wdXQ9XCJtdHhUaW1lSW5wdXRcIlxuICAgICAgICAgICB0eXBlPVwidGV4dFwiXG4gICAgICAgICAgIGlucHV0bW9kZT1cIm51bWVyaWNcIlxuICAgICAgICAgICBtYXhsZW5ndGg9XCIyXCJcbiAgICAgICAgICAgW3RpbWVNaW5dPVwidHdlbHZlaG91ciA/IDEgOiAwXCJcbiAgICAgICAgICAgW3RpbWVNYXhdPVwidHdlbHZlaG91ciA/IDEyIDogMjNcIlxuICAgICAgICAgICBbdGltZVZhbHVlXT1cImhvdXJcIlxuICAgICAgICAgICAodGltZVZhbHVlQ2hhbmdlZCk9XCJoYW5kbGVIb3VySW5wdXRDaGFuZ2UoJGV2ZW50KVwiXG4gICAgICAgICAgIChmb2N1cyk9XCJoYW5kbGVGb2N1cygnaG91cicpXCIgLz5cblxuICAgIDxkaXYgY2xhc3M9XCJtdHgtdGltZS1zZXBlcmF0b3JcIj46PC9kaXY+XG5cbiAgICA8aW5wdXQgY2xhc3M9XCJtdHgtdGltZS1pbnB1dFwiXG4gICAgICAgICAgIFtjbGFzcy5tdHgtdGltZS1pbnB1dC1hY3RpdmVdPVwiY2xvY2tWaWV3ID09PSAnbWludXRlJ1wiXG4gICAgICAgICAgIFtjbGFzcy5tdHgtdGltZS1pbnB1dC13YXJuaW5nXT1cIiFtaW51dGVJbnB1dC52YWxpZFwiXG4gICAgICAgICAgICNtaW51dGVJbnB1dD1cIm10eFRpbWVJbnB1dFwiXG4gICAgICAgICAgIHR5cGU9XCJ0ZXh0XCJcbiAgICAgICAgICAgaW5wdXRtb2RlPVwibnVtZXJpY1wiXG4gICAgICAgICAgIG1heGxlbmd0aD1cIjJcIlxuICAgICAgICAgICBbdGltZU1pbl09XCIwXCJcbiAgICAgICAgICAgW3RpbWVNYXhdPVwiNTlcIlxuICAgICAgICAgICBbdGltZVZhbHVlXT1cIm1pbnV0ZVwiXG4gICAgICAgICAgICh0aW1lVmFsdWVDaGFuZ2VkKT1cImhhbmRsZU1pbnV0ZUlucHV0Q2hhbmdlKCRldmVudClcIlxuICAgICAgICAgICBbdGltZUludGVydmFsXT1cImludGVydmFsXCJcbiAgICAgICAgICAgKGZvY3VzKT1cImhhbmRsZUZvY3VzKCdtaW51dGUnKVwiIC8+XG5cbiAgICA8ZGl2ICpuZ0lmPVwidHdlbHZlaG91clwiIGNsYXNzPVwibXR4LXRpbWUtYW1wbVwiPlxuICAgICAgPGJ1dHRvbiBtYXQtYnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cIm10eC10aW1lLWFtXCJcbiAgICAgICAgICAgICAgW2NsYXNzLm10eC10aW1lLWFtcG0tYWN0aXZlXT1cIkFNUE0gPT09ICdBTSdcIiBhcmlhLWxhYmVsPVwiQU1cIlxuICAgICAgICAgICAgICAoa2V5ZG93bik9XCIkZXZlbnQuc3RvcFByb3BhZ2F0aW9uKClcIlxuICAgICAgICAgICAgICAoY2xpY2spPVwiYW1wbUNoYW5nZS5lbWl0KCdBTScpXCI+QU08L2J1dHRvbj5cbiAgICAgIDxidXR0b24gbWF0LWJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJtdHgtdGltZS1wbVwiXG4gICAgICAgICAgICAgIFtjbGFzcy5tdHgtdGltZS1hbXBtLWFjdGl2ZV09XCJBTVBNID09PSAnUE0nXCIgYXJpYS1sYWJlbD1cIlBNXCJcbiAgICAgICAgICAgICAgKGtleWRvd24pPVwiJGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpXCJcbiAgICAgICAgICAgICAgKGNsaWNrKT1cImFtcG1DaGFuZ2UuZW1pdCgnUE0nKVwiPlBNPC9idXR0b24+XG4gICAgPC9kaXY+XG4gIDwvZGl2PlxuPC9kaXY+XG5cbjxtdHgtY2xvY2sgKHNlbGVjdGVkQ2hhbmdlKT1cIl90aW1lU2VsZWN0ZWQoJGV2ZW50KVwiXG4gICAgICAgICAgIChhY3RpdmVEYXRlQ2hhbmdlKT1cIl9vbkFjdGl2ZURhdGVDaGFuZ2UoJGV2ZW50KVwiXG4gICAgICAgICAgIFtBTVBNXT1cIkFNUE1cIlxuICAgICAgICAgICBbZGF0ZUZpbHRlcl09XCJkYXRlRmlsdGVyXCJcbiAgICAgICAgICAgW2ludGVydmFsXT1cImludGVydmFsXCJcbiAgICAgICAgICAgW21heERhdGVdPVwibWF4RGF0ZVwiXG4gICAgICAgICAgIFttaW5EYXRlXT1cIm1pbkRhdGVcIlxuICAgICAgICAgICBbc2VsZWN0ZWRdPVwic2VsZWN0ZWRcIlxuICAgICAgICAgICBbc3RhcnRWaWV3XT1cImNsb2NrVmlld1wiXG4gICAgICAgICAgIFt0d2VsdmVob3VyXT1cInR3ZWx2ZWhvdXJcIj5cbjwvbXR4LWNsb2NrPlxuXG48ZGl2IGNsYXNzPVwibXR4LXRpbWUtYnV0dG9uLXdyYXBwZXJcIj5cbiAgPGJ1dHRvbiBjbGFzcz1cIm10eC10aW1lLWNhbmNlbC1idXR0b25cIiBtYXQtYnV0dG9uIHR5cGU9XCJidXR0b25cIiAoY2xpY2spPVwiaGFuZGxlQ2FuY2VsKClcIj5cbiAgICB7eyBfZGF0ZXRpbWVwaWNrZXJJbnRsLmNhbmNlbExhYmVsIH19XG4gIDwvYnV0dG9uPlxuICA8YnV0dG9uIGNsYXNzPVwibXR4LXRpbWUtb2stYnV0dG9uXCIgbWF0LWJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgKGNsaWNrKT1cImhhbmRsZU9rKClcIlxuICAgICAgICAgIFtkaXNhYmxlZF09XCJtaW51dGVJbnB1dERpcmVjdGl2ZT8uaW52YWxpZCB8fCBob3VySW5wdXREaXJlY3RpdmU/LmludmFsaWRcIj5cbiAgICB7eyBfZGF0ZXRpbWVwaWNrZXJJbnRsLm9rTGFiZWwgfX1cbiAgPC9idXR0b24+XG48L2Rpdj5cbiJdfQ==