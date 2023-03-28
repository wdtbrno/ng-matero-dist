import * as i0 from '@angular/core';
import { InjectionToken, Injectable, Optional, Inject, NgModule, Pipe, TemplateRef } from '@angular/core';
import * as i1 from '@angular/material/core';
import { DateAdapter, MAT_DATE_LOCALE, NativeDateModule, MatNativeDateModule } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { isObservable, of } from 'rxjs';

class DatetimeAdapter extends DateAdapter {
    constructor(_delegate) {
        super();
        this._delegate = _delegate;
    }
    getValidDateOrNull(obj) {
        return this.isDateInstance(obj) && this.isValid(obj) ? obj : null;
    }
    compareDatetime(first, second, respectMinutePart = true) {
        return (this.compareDate(first, second) ||
            this.getHour(first) - this.getHour(second) ||
            (respectMinutePart && this.getMinute(first) - this.getMinute(second)));
    }
    sameDatetime(first, second) {
        if (first && second) {
            const firstValid = this.isValid(first);
            const secondValid = this.isValid(second);
            if (firstValid && secondValid) {
                return !this.compareDatetime(first, second);
            }
            return firstValid === secondValid;
        }
        return first === second;
    }
    sameYear(first, second) {
        return first && second && this.getYear(first) === this.getYear(second);
    }
    sameDay(first, second) {
        return (first &&
            second &&
            this.getDate(first) === this.getDate(second) &&
            this.sameMonthAndYear(first, second));
    }
    sameHour(first, second) {
        return (first && second && this.getHour(first) === this.getHour(second) && this.sameDay(first, second));
    }
    sameMinute(first, second) {
        return (first &&
            second &&
            this.getMinute(first) === this.getMinute(second) &&
            this.sameHour(first, second));
    }
    sameMonthAndYear(first, second) {
        if (first && second) {
            const firstValid = this.isValid(first);
            const secondValid = this.isValid(second);
            if (firstValid && secondValid) {
                return !(this.getYear(first) - this.getYear(second) || this.getMonth(first) - this.getMonth(second));
            }
            return firstValid === secondValid;
        }
        return first === second;
    }
    // delegate
    clone(date) {
        return this._delegate.clone(date);
    }
    addCalendarYears(date, years) {
        return this._delegate.addCalendarYears(date, years);
    }
    addCalendarMonths(date, months) {
        return this._delegate.addCalendarMonths(date, months);
    }
    addCalendarDays(date, days) {
        return this._delegate.addCalendarDays(date, days);
    }
    getYear(date) {
        return this._delegate.getYear(date);
    }
    getMonth(date) {
        return this._delegate.getMonth(date);
    }
    getDate(date) {
        return this._delegate.getDate(date);
    }
    getDayOfWeek(date) {
        return this._delegate.getDayOfWeek(date);
    }
    getMonthNames(style) {
        return this._delegate.getMonthNames(style);
    }
    getDateNames() {
        return this._delegate.getDateNames();
    }
    getDayOfWeekNames(style) {
        return this._delegate.getDayOfWeekNames(style);
    }
    getYearName(date) {
        return this._delegate.getYearName(date);
    }
    getFirstDayOfWeek() {
        return this._delegate.getFirstDayOfWeek();
    }
    getNumDaysInMonth(date) {
        return this._delegate.getNumDaysInMonth(date);
    }
    createDate(year, month, date) {
        return this._delegate.createDate(year, month, date);
    }
    today() {
        return this._delegate.today();
    }
    parse(value, parseFormat) {
        return this._delegate.parse(value, parseFormat);
    }
    format(date, displayFormat) {
        return this._delegate.format(date, displayFormat);
    }
    toIso8601(date) {
        return this._delegate.toIso8601(date);
    }
    isDateInstance(obj) {
        return this._delegate.isDateInstance(obj);
    }
    isValid(date) {
        return this._delegate.isValid(date);
    }
    invalid() {
        return this._delegate.invalid();
    }
    clampDate(date, min, max) {
        if (min && this.compareDatetime(date, min) < 0) {
            return min;
        }
        if (max && this.compareDatetime(date, max) > 0) {
            return max;
        }
        return date;
    }
}

const MTX_DATETIME_FORMATS = new InjectionToken('mtx-datetime-formats');

/** The default hour names to use if Intl API is not available. */
const DEFAULT_HOUR_NAMES = range(24, i => String(i));
/** The default minute names to use if Intl API is not available. */
const DEFAULT_MINUTE_NAMES = range(60, i => String(i));
function range(length, valueFunction) {
    const valuesArray = Array(length);
    for (let i = 0; i < length; i++) {
        valuesArray[i] = valueFunction(i);
    }
    return valuesArray;
}
class NativeDatetimeAdapter extends DatetimeAdapter {
    constructor(matDateLocale, _delegate) {
        super(_delegate);
        this.setLocale(matDateLocale);
    }
    clone(date) {
        return this.createDatetime(this.getYear(date), this.getMonth(date), this.getDate(date), this.getHour(date), this.getMinute(date));
    }
    getHour(date) {
        return date.getHours();
    }
    getMinute(date) {
        return date.getMinutes();
    }
    isInNextMonth(startDate, endDate) {
        const nextMonth = this.getDateInNextMonth(startDate);
        return this.sameMonthAndYear(nextMonth, endDate);
    }
    createDatetime(year, month, date, hour, minute) {
        // Check for invalid month and date (except upper bound on date which we have to check after
        // creating the Date).
        if (month < 0 || month > 11) {
            throw Error(`Invalid month index "${month}". Month index has to be between 0 and 11.`);
        }
        if (date < 1) {
            throw Error(`Invalid date "${date}". Date has to be greater than 0.`);
        }
        if (hour < 0 || hour > 23) {
            throw Error(`Invalid hour "${hour}". Hour has to be between 0 and 23.`);
        }
        if (minute < 0 || minute > 59) {
            throw Error(`Invalid minute "${minute}". Minute has to be between 0 and 59.`);
        }
        const result = this._createDateWithOverflow(year, month, date, hour, minute);
        // Check that the date wasn't above the upper bound for the month, causing the month to overflow
        if (result.getMonth() !== month) {
            throw Error(`Invalid date "${date}" for month with index "${month}".`);
        }
        return result;
    }
    getFirstDateOfMonth(date) {
        const result = new Date();
        result.setFullYear(date.getFullYear(), date.getMonth(), 1);
        return result;
    }
    getHourNames() {
        return DEFAULT_HOUR_NAMES;
    }
    getMinuteNames() {
        return DEFAULT_MINUTE_NAMES;
    }
    addCalendarYears(date, years) {
        return this.addCalendarMonths(date, years * 12);
    }
    addCalendarMonths(date, months) {
        let newDate = this._createDateWithOverflow(this.getYear(date), this.getMonth(date) + months, this.getDate(date), this.getHour(date), this.getMinute(date));
        // It's possible to wind up in the wrong month if the original month has more days than the new
        // month. In this case we want to go to the last day of the desired month.
        // Note: the additional + 12 % 12 ensures we end up with a positive number, since JS % doesn't
        // guarantee this.
        if (this.getMonth(newDate) !== (((this.getMonth(date) + months) % 12) + 12) % 12) {
            newDate = this._createDateWithOverflow(this.getYear(newDate), this.getMonth(newDate), 0, this.getHour(date), this.getMinute(date));
        }
        return newDate;
    }
    addCalendarDays(date, days) {
        return this._createDateWithOverflow(this.getYear(date), this.getMonth(date), this.getDate(date) + days, this.getHour(date), this.getMinute(date));
    }
    addCalendarHours(date, hours) {
        return this._createDateWithOverflow(this.getYear(date), this.getMonth(date), this.getDate(date), this.getHour(date) + hours, this.getMinute(date));
    }
    addCalendarMinutes(date, minutes) {
        return this._createDateWithOverflow(this.getYear(date), this.getMonth(date), this.getDate(date), this.getHour(date), this.getMinute(date) + minutes);
    }
    toIso8601(date) {
        return (super.toIso8601(date) +
            'T' +
            [this._2digit(date.getUTCHours()), this._2digit(date.getUTCMinutes())].join(':'));
    }
    getDateInNextMonth(date) {
        return new Date(date.getFullYear(), date.getMonth() + 1, 1, date.getHours(), date.getMinutes());
    }
    /**
     * Strip out unicode LTR and RTL characters. Edge and IE insert these into formatted dates while
     * other browsers do not. We remove them to make output consistent and because they interfere with
     * date parsing.
     * @param str The string to strip direction characters from.
     * @returns The stripped string.
     */
    _stripDirectionalityCharacters(str) {
        return str.replace(/[\u200e\u200f]/g, '');
    }
    /**
     * Pads a number to make it two digits.
     * @param n The number to pad.
     * @returns The padded number.
     */
    _2digit(n) {
        return ('00' + n).slice(-2);
    }
    /** Creates a date but allows the month and date to overflow. */
    _createDateWithOverflow(year, month, date, hours, minutes) {
        const result = new Date(year, month, date, hours, minutes);
        // We need to correct for the fact that JS native Date treats years in range [0, 99] as
        // abbreviations for 19xx.
        if (year >= 0 && year < 100) {
            result.setFullYear(this.getYear(result) - 1900);
        }
        return result;
    }
}
/** @nocollapse */ NativeDatetimeAdapter.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: NativeDatetimeAdapter, deps: [{ token: MAT_DATE_LOCALE, optional: true }, { token: i1.DateAdapter }], target: i0.ɵɵFactoryTarget.Injectable });
/** @nocollapse */ NativeDatetimeAdapter.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: NativeDatetimeAdapter });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: NativeDatetimeAdapter, decorators: [{
            type: Injectable
        }], ctorParameters: function () {
        return [{ type: undefined, decorators: [{
                        type: Optional
                    }, {
                        type: Inject,
                        args: [MAT_DATE_LOCALE]
                    }] }, { type: i1.DateAdapter }];
    } });

const MTX_NATIVE_DATETIME_FORMATS = {
    parse: {},
    display: {
        dateInput: { year: 'numeric', month: '2-digit', day: '2-digit' },
        monthInput: { month: 'long' },
        datetimeInput: {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
        },
        timeInput: { hour: '2-digit', minute: '2-digit' },
        monthYearLabel: { year: 'numeric', month: 'short' },
        dateA11yLabel: { year: 'numeric', month: 'long', day: 'numeric' },
        monthYearA11yLabel: { year: 'numeric', month: 'long' },
        popupHeaderDateLabel: { weekday: 'short', month: 'short', day: '2-digit' },
    },
};

class NativeDatetimeModule {
}
/** @nocollapse */ NativeDatetimeModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: NativeDatetimeModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
/** @nocollapse */ NativeDatetimeModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "15.2.1", ngImport: i0, type: NativeDatetimeModule, imports: [NativeDateModule] });
/** @nocollapse */ NativeDatetimeModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: NativeDatetimeModule, providers: [
        {
            provide: DatetimeAdapter,
            useClass: NativeDatetimeAdapter,
        },
    ], imports: [NativeDateModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: NativeDatetimeModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [NativeDateModule],
                    providers: [
                        {
                            provide: DatetimeAdapter,
                            useClass: NativeDatetimeAdapter,
                        },
                    ],
                }]
        }] });
class MtxNativeDatetimeModule {
}
/** @nocollapse */ MtxNativeDatetimeModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MtxNativeDatetimeModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
/** @nocollapse */ MtxNativeDatetimeModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "15.2.1", ngImport: i0, type: MtxNativeDatetimeModule, imports: [NativeDatetimeModule, MatNativeDateModule] });
/** @nocollapse */ MtxNativeDatetimeModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MtxNativeDatetimeModule, providers: [{ provide: MTX_DATETIME_FORMATS, useValue: MTX_NATIVE_DATETIME_FORMATS }], imports: [NativeDatetimeModule, MatNativeDateModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MtxNativeDatetimeModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [NativeDatetimeModule, MatNativeDateModule],
                    providers: [{ provide: MTX_DATETIME_FORMATS, useValue: MTX_NATIVE_DATETIME_FORMATS }],
                }]
        }] });

class MtxToObservablePipe {
    transform(value) {
        return isObservable(value) ? value : of(value);
    }
}
/** @nocollapse */ MtxToObservablePipe.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MtxToObservablePipe, deps: [], target: i0.ɵɵFactoryTarget.Pipe });
/** @nocollapse */ MtxToObservablePipe.ɵpipe = i0.ɵɵngDeclarePipe({ minVersion: "14.0.0", version: "15.2.1", ngImport: i0, type: MtxToObservablePipe, name: "toObservable" });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MtxToObservablePipe, decorators: [{
            type: Pipe,
            args: [{ name: 'toObservable' }]
        }] });

class MtxIsTemplateRefPipe {
    transform(obj) {
        return obj instanceof TemplateRef;
    }
}
/** @nocollapse */ MtxIsTemplateRefPipe.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MtxIsTemplateRefPipe, deps: [], target: i0.ɵɵFactoryTarget.Pipe });
/** @nocollapse */ MtxIsTemplateRefPipe.ɵpipe = i0.ɵɵngDeclarePipe({ minVersion: "14.0.0", version: "15.2.1", ngImport: i0, type: MtxIsTemplateRefPipe, name: "isTemplateRef" });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MtxIsTemplateRefPipe, decorators: [{
            type: Pipe,
            args: [{ name: 'isTemplateRef' }]
        }] });

class MtxPipesModule {
}
/** @nocollapse */ MtxPipesModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MtxPipesModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
/** @nocollapse */ MtxPipesModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "15.2.1", ngImport: i0, type: MtxPipesModule, declarations: [MtxToObservablePipe, MtxIsTemplateRefPipe], imports: [CommonModule], exports: [MtxToObservablePipe, MtxIsTemplateRefPipe] });
/** @nocollapse */ MtxPipesModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MtxPipesModule, imports: [CommonModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MtxPipesModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule],
                    exports: [MtxToObservablePipe, MtxIsTemplateRefPipe],
                    declarations: [MtxToObservablePipe, MtxIsTemplateRefPipe],
                }]
        }] });

/**
 * Generated bundle index. Do not edit.
 */

export { DatetimeAdapter, MTX_DATETIME_FORMATS, MTX_NATIVE_DATETIME_FORMATS, MtxIsTemplateRefPipe, MtxNativeDatetimeModule, MtxPipesModule, MtxToObservablePipe, NativeDatetimeAdapter, NativeDatetimeModule };
//# sourceMappingURL=mtxCore.mjs.map
