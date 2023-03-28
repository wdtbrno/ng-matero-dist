import { ChangeDetectionStrategy, Component, EventEmitter, Inject, Input, Optional, Output, ViewEncapsulation, } from '@angular/core';
import { DOWN_ARROW, END, ENTER, HOME, LEFT_ARROW, PAGE_DOWN, PAGE_UP, RIGHT_ARROW, UP_ARROW, } from '@angular/cdk/keycodes';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { first } from 'rxjs/operators';
import { MTX_DATETIME_FORMATS, } from '@ng-matero/extensions/core';
import { mtxDatetimepickerAnimations } from './datetimepicker-animations';
import { createMissingDateImplError } from './datetimepicker-errors';
import { MtxDatetimepickerFilterType } from './datetimepicker-filtertype';
import { getActiveOffset, isSameMultiYearView, yearsPerPage, yearsPerRow } from './multi-year-view';
import * as i0 from "@angular/core";
import * as i1 from "./datetimepicker-intl";
import * as i2 from "@ng-matero/extensions/core";
import * as i3 from "@angular/common";
import * as i4 from "@angular/material/button";
import * as i5 from "./clock";
import * as i6 from "./time";
import * as i7 from "./month-view";
import * as i8 from "./year-view";
import * as i9 from "./multi-year-view";
/**
 * A calendar that is used as part of the datetimepicker.
 * @docs-private
 */
export class MtxCalendar {
    /** Whether to show multi-year view. */
    get multiYearSelector() {
        return this._multiYearSelector;
    }
    set multiYearSelector(value) {
        this._multiYearSelector = coerceBooleanProperty(value);
    }
    /** Whether the clock uses 12 hour format. */
    get twelvehour() {
        return this._twelvehour;
    }
    set twelvehour(value) {
        this._twelvehour = coerceBooleanProperty(value);
    }
    constructor(_elementRef, _intl, _ngZone, _adapter, _dateFormats, _changeDetectorRef) {
        this._elementRef = _elementRef;
        this._intl = _intl;
        this._ngZone = _ngZone;
        this._adapter = _adapter;
        this._dateFormats = _dateFormats;
        this._multiYearSelector = false;
        this._twelvehour = false;
        /** Whether the calendar should be started in month or year view. */
        this.startView = 'month';
        /** Step over minutes. */
        this.timeInterval = 1;
        /** Prevent user to select same date time */
        this.preventSameDateTimeSelection = false;
        /** Emits when the currently selected date changes. */
        this.selectedChange = new EventEmitter();
        /** Emits when the view has been changed. */
        this.viewChanged = new EventEmitter();
        this._userSelection = new EventEmitter();
        this._clockView = 'hour';
        this._type = 'date';
        this._timeInput = false;
        /** Date filter for the month and year views. */
        this._dateFilterForViews = (date) => {
            return (!!date &&
                (!this.dateFilter || this.dateFilter(date, MtxDatetimepickerFilterType.DATE)) &&
                (!this.minDate || this._adapter.compareDate(date, this.minDate) >= 0) &&
                (!this.maxDate || this._adapter.compareDate(date, this.maxDate) <= 0));
        };
        if (!this._adapter) {
            throw createMissingDateImplError('DatetimeAdapter');
        }
        if (!this._dateFormats) {
            throw createMissingDateImplError('MTX_DATETIME_FORMATS');
        }
        this._intlChanges = _intl.changes.subscribe(() => _changeDetectorRef.markForCheck());
    }
    /** The display type of datetimepicker. */
    get type() {
        return this._type;
    }
    set type(value) {
        this._type = value || 'date';
        if (this.type === 'year') {
            this.multiYearSelector = true;
        }
    }
    /** A date representing the period (month or year) to start the calendar in. */
    get startAt() {
        return this._startAt;
    }
    set startAt(value) {
        this._startAt = this._adapter.getValidDateOrNull(value);
    }
    /**
     * Whether the calendar is in time mode. In time mode the calendar clock gets time input elements
     * rather then just clock. When touchUi is enabled this will be disabled
     */
    get timeInput() {
        return this._timeInput;
    }
    set timeInput(value) {
        this._timeInput = coerceBooleanProperty(value);
    }
    /** The currently selected date. */
    get selected() {
        return this._selected;
    }
    set selected(value) {
        this._selected = this._adapter.getValidDateOrNull(value);
    }
    /** The minimum selectable date. */
    get minDate() {
        return this._minDate;
    }
    set minDate(value) {
        this._minDate = this._adapter.getValidDateOrNull(value);
    }
    /** The maximum selectable date. */
    get maxDate() {
        return this._maxDate;
    }
    set maxDate(value) {
        this._maxDate = this._adapter.getValidDateOrNull(value);
    }
    /**
     * The current active date. This determines which time period is shown and which date is
     * highlighted when using keyboard navigation.
     */
    get _activeDate() {
        return this._clampedActiveDate;
    }
    set _activeDate(value) {
        const oldActiveDate = this._clampedActiveDate;
        this._clampedActiveDate = this._adapter.clampDate(value, this.minDate, this.maxDate);
        // whenever active date changed, and possibly got clamped we should adjust the am/pm setting
        this._selectAMPM(this._clampedActiveDate);
        if (oldActiveDate &&
            this._clampedActiveDate &&
            this.currentView === 'month' &&
            !this._adapter.sameMonthAndYear(oldActiveDate, this._clampedActiveDate)) {
            if (this._adapter.isInNextMonth(oldActiveDate, this._clampedActiveDate)) {
                this.calendarState('right');
            }
            else {
                this.calendarState('left');
            }
        }
    }
    /** Whether the calendar is in month view. */
    get currentView() {
        return this._currentView;
    }
    set currentView(view) {
        this._currentView = view;
        this.viewChanged.emit(view);
    }
    get _yearPeriodText() {
        if (this.currentView === 'multi-year') {
            // The offset from the active year to the "slot" for the starting year is the
            // *actual* first rendered year in the multi-year view, and the last year is
            // just yearsPerPage - 1 away.
            const activeYear = this._adapter.getYear(this._activeDate);
            const minYearOfPage = activeYear - getActiveOffset(this._adapter, this._activeDate, this.minDate, this.maxDate);
            const maxYearOfPage = minYearOfPage + yearsPerPage - 1;
            const minYearName = this._adapter.getYearName(this._adapter.createDate(minYearOfPage, 0, 1));
            const maxYearName = this._adapter.getYearName(this._adapter.createDate(maxYearOfPage, 0, 1));
            return this._intl.formatYearRange(minYearName, maxYearName);
        }
        return this.currentView === 'month'
            ? this._adapter.getMonthNames('long')[this._adapter.getMonth(this._activeDate)]
            : this._adapter.getYearName(this._activeDate);
    }
    get _yearButtonText() {
        return this._adapter.getYearName(this._activeDate);
    }
    get _yearButtonLabel() {
        return this.multiYearSelector
            ? this._intl.switchToMultiYearViewLabel
            : this._intl.switchToYearViewLabel;
    }
    get _dateButtonText() {
        switch (this.type) {
            case 'month':
                return this._adapter.getMonthNames('long')[this._adapter.getMonth(this._activeDate)];
            default:
                return this._adapter.format(this._activeDate, this._dateFormats.display.popupHeaderDateLabel);
        }
    }
    get _dateButtonLabel() {
        return this._intl.switchToMonthViewLabel;
    }
    get _hoursButtonText() {
        let hour = this._adapter.getHour(this._activeDate);
        if (this.twelvehour) {
            if (hour === 0) {
                hour = 24;
            }
            hour = hour > 12 ? hour - 12 : hour;
        }
        return this._2digit(hour);
    }
    get _hourButtonLabel() {
        return this._intl.switchToClockHourViewLabel;
    }
    get _minutesButtonText() {
        return this._2digit(this._adapter.getMinute(this._activeDate));
    }
    get _minuteButtonLabel() {
        return this._intl.switchToClockMinuteViewLabel;
    }
    get _prevButtonLabel() {
        switch (this._currentView) {
            case 'month':
                return this._intl.prevMonthLabel;
            case 'year':
                return this._intl.prevYearLabel;
            case 'multi-year':
                return this._intl.prevMultiYearLabel;
            default:
                return '';
        }
    }
    get _nextButtonLabel() {
        switch (this._currentView) {
            case 'month':
                return this._intl.nextMonthLabel;
            case 'year':
                return this._intl.nextYearLabel;
            case 'multi-year':
                return this._intl.nextMultiYearLabel;
            default:
                return '';
        }
    }
    _userSelected() {
        this._userSelection.emit();
    }
    ngAfterContentInit() {
        this._activeDate = this.startAt || this._adapter.today();
        this._selectAMPM(this._activeDate);
        if (this.type === 'year') {
            this.currentView = 'multi-year';
        }
        else if (this.type === 'month') {
            this.currentView = 'year';
        }
        else if (this.type === 'time') {
            this.currentView = 'clock';
        }
        else {
            this.currentView = this.startView || 'month';
        }
    }
    ngOnDestroy() {
        this._intlChanges.unsubscribe();
    }
    /** Handles date selection in the month view. */
    _dateSelected(date) {
        if (this.type === 'date') {
            if (!this._adapter.sameDate(date, this.selected) || !this.preventSameDateTimeSelection) {
                this.selectedChange.emit(date);
            }
        }
        else {
            this._activeDate = date;
            this.currentView = 'clock';
        }
    }
    /** Handles month selection in the year view. */
    _monthSelected(month) {
        if (this.type === 'month') {
            if (!this._adapter.sameMonthAndYear(month, this.selected) ||
                !this.preventSameDateTimeSelection) {
                this.selectedChange.emit(this._adapter.getFirstDateOfMonth(month));
            }
        }
        else {
            this._activeDate = month;
            this.currentView = 'month';
            this._clockView = 'hour';
        }
    }
    /** Handles year selection in the multi year view. */
    _yearSelected(year) {
        if (this.type === 'year') {
            if (!this._adapter.sameYear(year, this.selected) || !this.preventSameDateTimeSelection) {
                const normalizedDate = this._adapter.createDatetime(this._adapter.getYear(year), 0, 1, 0, 0);
                this.selectedChange.emit(normalizedDate);
            }
        }
        else {
            this._activeDate = year;
            this.currentView = 'year';
        }
    }
    _timeSelected(date) {
        this._activeDate = this._updateDate(date);
        if (!this._adapter.sameDatetime(date, this.selected) || !this.preventSameDateTimeSelection) {
            this.selectedChange.emit(date);
        }
    }
    _dialTimeSelected(date) {
        if (this._clockView !== 'minute') {
            this._activeDate = this._updateDate(date);
            this._clockView = 'minute';
        }
        else {
            if (!this._adapter.sameDatetime(date, this.selected) || !this.preventSameDateTimeSelection) {
                this.selectedChange.emit(date);
            }
        }
    }
    _onActiveDateChange(date) {
        this._activeDate = date;
    }
    _updateDate(date) {
        if (this.twelvehour) {
            const HOUR = this._adapter.getHour(date);
            if (HOUR === 12) {
                if (this._AMPM === 'AM') {
                    return this._adapter.addCalendarHours(date, -12);
                }
            }
            else if (this._AMPM === 'PM') {
                return this._adapter.addCalendarHours(date, 12);
            }
        }
        return date;
    }
    _selectAMPM(date) {
        const hour = this._adapter.getHour(date);
        if (hour > 11) {
            this._AMPM = 'PM';
        }
        else {
            this._AMPM = 'AM';
        }
    }
    _ampmClicked(source) {
        this._currentView = 'clock';
        if (source === this._AMPM) {
            return;
        }
        // if AMPM changed from PM to AM substract 12 hours
        const currentHour = this._adapter.getHour(this._activeDate);
        let newHourValue;
        if (source === 'AM') {
            newHourValue = currentHour >= 12 ? this._adapter.getHour(this._activeDate) - 12 : 12;
        }
        // otherwise add 12 hours
        else {
            newHourValue = (currentHour + 12) % 24;
        }
        const newActiveDate = this._adapter.clampDate(this._adapter.createDatetime(this._adapter.getYear(this._activeDate), this._adapter.getMonth(this._activeDate), this._adapter.getDate(this._activeDate), newHourValue, this._adapter.getMinute(this._activeDate)), this.minDate, this.maxDate);
        // only if our clamped date is not changed, we know we can apply the newActiveDate to the
        // activeDate
        if (this._adapter.getHour(newActiveDate) === newHourValue) {
            this._activeDate = newActiveDate;
            this._AMPM = source;
        }
    }
    _yearClicked() {
        if (this.type === 'year' || this.multiYearSelector) {
            this.currentView = 'multi-year';
            return;
        }
        this.currentView = 'year';
    }
    _dateClicked() {
        if (this.type !== 'month') {
            this.currentView = 'month';
        }
    }
    _hoursClicked() {
        this.currentView = 'clock';
        this._clockView = 'hour';
    }
    _minutesClicked() {
        this.currentView = 'clock';
        this._clockView = 'minute';
    }
    /** Handles user clicks on the previous button. */
    _previousClicked() {
        this._activeDate =
            this.currentView === 'month'
                ? this._adapter.addCalendarMonths(this._activeDate, -1)
                : this._adapter.addCalendarYears(this._activeDate, this.currentView === 'year' ? -1 : -yearsPerPage);
    }
    /** Handles user clicks on the next button. */
    _nextClicked() {
        this._activeDate =
            this.currentView === 'month'
                ? this._adapter.addCalendarMonths(this._activeDate, 1)
                : this._adapter.addCalendarYears(this._activeDate, this.currentView === 'year' ? 1 : yearsPerPage);
    }
    /** Whether the previous period button is enabled. */
    _previousEnabled() {
        if (!this.minDate) {
            return true;
        }
        return !this.minDate || !this._isSameView(this._activeDate, this.minDate);
    }
    /** Whether the next period button is enabled. */
    _nextEnabled() {
        return !this.maxDate || !this._isSameView(this._activeDate, this.maxDate);
    }
    /** Handles keydown events on the calendar body. */
    _handleCalendarBodyKeydown(event) {
        // TODO(mmalerba): We currently allow keyboard navigation to disabled dates, but just prevent
        // disabled ones from being selected. This may not be ideal, we should look into whether
        // navigation should skip over disabled dates, and if so, how to implement that efficiently.
        if (this.currentView === 'month') {
            this._handleCalendarBodyKeydownInMonthView(event);
        }
        else if (this.currentView === 'year') {
            this._handleCalendarBodyKeydownInYearView(event);
        }
        else if (this.currentView === 'multi-year') {
            this._handleCalendarBodyKeydownInMultiYearView(event);
        }
        else {
            this._handleCalendarBodyKeydownInClockView(event);
        }
    }
    _focusActiveCell() {
        this._ngZone.runOutsideAngular(() => {
            this._ngZone.onStable
                .asObservable()
                .pipe(first())
                .subscribe(() => {
                this._elementRef.nativeElement.focus();
            });
        });
    }
    _calendarStateDone() {
        this._calendarState = '';
    }
    /** Whether the two dates represent the same view in the current view mode (month or year). */
    _isSameView(date1, date2) {
        if (this.currentView === 'month') {
            return (this._adapter.getYear(date1) === this._adapter.getYear(date2) &&
                this._adapter.getMonth(date1) === this._adapter.getMonth(date2));
        }
        if (this.currentView === 'year') {
            return this._adapter.getYear(date1) === this._adapter.getYear(date2);
        }
        // Otherwise we are in 'multi-year' view.
        return isSameMultiYearView(this._adapter, date1, date2, this.minDate, this.maxDate);
    }
    /** Handles keydown events on the calendar body when calendar is in month view. */
    _handleCalendarBodyKeydownInMonthView(event) {
        switch (event.keyCode) {
            case LEFT_ARROW:
                this._activeDate = this._adapter.addCalendarDays(this._activeDate, -1);
                break;
            case RIGHT_ARROW:
                this._activeDate = this._adapter.addCalendarDays(this._activeDate, 1);
                break;
            case UP_ARROW:
                this._activeDate = this._adapter.addCalendarDays(this._activeDate, -7);
                break;
            case DOWN_ARROW:
                this._activeDate = this._adapter.addCalendarDays(this._activeDate, 7);
                break;
            case HOME:
                this._activeDate = this._adapter.addCalendarDays(this._activeDate, 1 - this._adapter.getDate(this._activeDate));
                break;
            case END:
                this._activeDate = this._adapter.addCalendarDays(this._activeDate, this._adapter.getNumDaysInMonth(this._activeDate) -
                    this._adapter.getDate(this._activeDate));
                break;
            case PAGE_UP:
                this._activeDate = event.altKey
                    ? this._adapter.addCalendarYears(this._activeDate, -1)
                    : this._adapter.addCalendarMonths(this._activeDate, -1);
                break;
            case PAGE_DOWN:
                this._activeDate = event.altKey
                    ? this._adapter.addCalendarYears(this._activeDate, 1)
                    : this._adapter.addCalendarMonths(this._activeDate, 1);
                break;
            case ENTER:
                if (this._dateFilterForViews(this._activeDate)) {
                    this._dateSelected(this._activeDate);
                    // Prevent unexpected default actions such as form submission.
                    event.preventDefault();
                }
                return;
            default:
                // Don't prevent default or focus active cell on keys that we don't explicitly handle.
                return;
        }
        // Prevent unexpected default actions such as form submission.
        event.preventDefault();
    }
    /** Handles keydown events on the calendar body when calendar is in year view. */
    _handleCalendarBodyKeydownInYearView(event) {
        switch (event.keyCode) {
            case LEFT_ARROW:
                this._activeDate = this._adapter.addCalendarMonths(this._activeDate, -1);
                break;
            case RIGHT_ARROW:
                this._activeDate = this._adapter.addCalendarMonths(this._activeDate, 1);
                break;
            case UP_ARROW:
                this._activeDate = this._prevMonthInSameCol(this._activeDate);
                break;
            case DOWN_ARROW:
                this._activeDate = this._nextMonthInSameCol(this._activeDate);
                break;
            case HOME:
                this._activeDate = this._adapter.addCalendarMonths(this._activeDate, -this._adapter.getMonth(this._activeDate));
                break;
            case END:
                this._activeDate = this._adapter.addCalendarMonths(this._activeDate, 11 - this._adapter.getMonth(this._activeDate));
                break;
            case PAGE_UP:
                this._activeDate = this._adapter.addCalendarYears(this._activeDate, event.altKey ? -10 : -1);
                break;
            case PAGE_DOWN:
                this._activeDate = this._adapter.addCalendarYears(this._activeDate, event.altKey ? 10 : 1);
                break;
            case ENTER:
                this._monthSelected(this._activeDate);
                break;
            default:
                // Don't prevent default or focus active cell on keys that we don't explicitly handle.
                return;
        }
        // Prevent unexpected default actions such as form submission.
        event.preventDefault();
    }
    /** Handles keydown events on the calendar body when calendar is in multi-year view. */
    _handleCalendarBodyKeydownInMultiYearView(event) {
        switch (event.keyCode) {
            case LEFT_ARROW:
                this._activeDate = this._adapter.addCalendarYears(this._activeDate, -1);
                break;
            case RIGHT_ARROW:
                this._activeDate = this._adapter.addCalendarYears(this._activeDate, 1);
                break;
            case UP_ARROW:
                this._activeDate = this._adapter.addCalendarYears(this._activeDate, -yearsPerRow);
                break;
            case DOWN_ARROW:
                this._activeDate = this._adapter.addCalendarYears(this._activeDate, yearsPerRow);
                break;
            case HOME:
                this._activeDate = this._adapter.addCalendarYears(this._activeDate, -getActiveOffset(this._adapter, this._activeDate, this.minDate, this.maxDate));
                break;
            case END:
                this._activeDate = this._adapter.addCalendarYears(this._activeDate, yearsPerPage -
                    getActiveOffset(this._adapter, this._activeDate, this.minDate, this.maxDate) -
                    1);
                break;
            case PAGE_UP:
                this._activeDate = this._adapter.addCalendarYears(this._activeDate, event.altKey ? -yearsPerPage * 10 : -yearsPerPage);
                break;
            case PAGE_DOWN:
                this._activeDate = this._adapter.addCalendarYears(this._activeDate, event.altKey ? yearsPerPage * 10 : yearsPerPage);
                break;
            case ENTER:
                this._yearSelected(this._activeDate);
                break;
            default:
                // Don't prevent default or focus active cell on keys that we don't explicitly handle.
                return;
        }
    }
    /** Handles keydown events on the calendar body when calendar is in month view. */
    _handleCalendarBodyKeydownInClockView(event) {
        switch (event.keyCode) {
            case UP_ARROW:
                this._activeDate =
                    this._clockView === 'hour'
                        ? this._adapter.addCalendarHours(this._activeDate, 1)
                        : this._adapter.addCalendarMinutes(this._activeDate, this.timeInterval);
                break;
            case DOWN_ARROW:
                this._activeDate =
                    this._clockView === 'hour'
                        ? this._adapter.addCalendarHours(this._activeDate, -1)
                        : this._adapter.addCalendarMinutes(this._activeDate, -this.timeInterval);
                break;
            case ENTER:
                if (!this.timeInput) {
                    this._dialTimeSelected(this._activeDate);
                }
                return;
            default:
                // Don't prevent default or focus active cell on keys that we don't explicitly handle.
                return;
        }
        // Prevent unexpected default actions such as form submission.
        event.preventDefault();
    }
    /**
     * Determine the date for the month that comes before the given month in the same column in the
     * calendar table.
     */
    _prevMonthInSameCol(date) {
        // Determine how many months to jump forward given that there are 2 empty slots at the beginning
        // of each year.
        const increment = this._adapter.getMonth(date) <= 4 ? -5 : this._adapter.getMonth(date) >= 7 ? -7 : -12;
        return this._adapter.addCalendarMonths(date, increment);
    }
    /**
     * Determine the date for the month that comes after the given month in the same column in the
     * calendar table.
     */
    _nextMonthInSameCol(date) {
        // Determine how many months to jump forward given that there are 2 empty slots at the beginning
        // of each year.
        const increment = this._adapter.getMonth(date) <= 4 ? 7 : this._adapter.getMonth(date) >= 7 ? 5 : 12;
        return this._adapter.addCalendarMonths(date, increment);
    }
    calendarState(direction) {
        this._calendarState = direction;
    }
    _2digit(n) {
        return ('00' + n).slice(-2);
    }
}
/** @nocollapse */ MtxCalendar.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MtxCalendar, deps: [{ token: i0.ElementRef }, { token: i1.MtxDatetimepickerIntl }, { token: i0.NgZone }, { token: i2.DatetimeAdapter, optional: true }, { token: MTX_DATETIME_FORMATS, optional: true }, { token: i0.ChangeDetectorRef }], target: i0.ɵɵFactoryTarget.Component });
/** @nocollapse */ MtxCalendar.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.1", type: MtxCalendar, selector: "mtx-calendar", inputs: { multiYearSelector: "multiYearSelector", twelvehour: "twelvehour", startView: "startView", timeInterval: "timeInterval", dateFilter: "dateFilter", preventSameDateTimeSelection: "preventSameDateTimeSelection", type: "type", startAt: "startAt", timeInput: "timeInput", selected: "selected", minDate: "minDate", maxDate: "maxDate" }, outputs: { selectedChange: "selectedChange", viewChanged: "viewChanged", _userSelection: "_userSelection" }, host: { attributes: { "tabindex": "0" }, listeners: { "keydown": "_handleCalendarBodyKeydown($event)" }, properties: { "class.mtx-calendar-with-time-input": "timeInput" }, classAttribute: "mtx-calendar" }, exportAs: ["mtxCalendar"], ngImport: i0, template: "<div class=\"mtx-calendar-header\">\n  <button *ngIf=\"type !== 'time'\"\n          mat-button type=\"button\" class=\"mtx-calendar-header-year\"\n          [class.active]=\"currentView === 'year' || currentView === 'multi-year'\"\n          [attr.aria-label]=\"_yearButtonLabel\"\n          (click)=\"_yearClicked()\">\n    <span>{{ _yearButtonText }}</span>\n    <svg *ngIf=\"multiYearSelector || type === 'year'\"\n         class=\"mtx-calendar-header-year-dropdown\" matButtonIcon iconPositionEnd\n         width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"currentColor\">\n      <path d=\"M7,10L12,15L17,10H7Z\"></path>\n    </svg>\n  </button>\n  <div *ngIf=\"type !== 'year'\" class=\"mtx-calendar-header-date-time\">\n    <button *ngIf=\"type !== 'time'\"\n            mat-button type=\"button\" class=\"mtx-calendar-header-date\"\n            [class.active]=\"currentView === 'month'\"\n            [class.not-clickable]=\"type === 'month'\"\n            [attr.aria-label]=\"_dateButtonLabel\"\n            (click)=\"_dateClicked()\">{{ _dateButtonText }}</button>\n    <span *ngIf=\"type.endsWith('time')\" class=\"mtx-calendar-header-time\"\n          [class.active]=\"currentView === 'clock'\">\n      <span class=\"mtx-calendar-header-hour-minute-container\">\n        <button mat-button type=\"button\" class=\"mtx-calendar-header-hours\"\n                [class.active]=\"_clockView === 'hour'\"\n                [attr.aria-label]=\"_hourButtonLabel\"\n                (click)=\"_hoursClicked()\">{{ _hoursButtonText }}</button>\n        <span class=\"mtx-calendar-header-hour-minute-separator\">:</span>\n        <button mat-button type=\"button\" class=\"mtx-calendar-header-minutes\"\n                [class.active]=\"_clockView === 'minute'\"\n                [attr.aria-label]=\"_minuteButtonLabel\"\n                (click)=\"_minutesClicked()\">{{ _minutesButtonText }}</button>\n      </span>\n      <span *ngIf=\"twelvehour\" class=\"mtx-calendar-header-ampm-container\">\n        <button mat-button type=\"button\" class=\"mtx-calendar-header-ampm\"\n                [class.active]=\"_AMPM === 'AM'\" aria-label=\"AM\"\n                (click)=\"_ampmClicked('AM')\">AM</button>\n        <button mat-button type=\"button\" class=\"mtx-calendar-header-ampm\"\n                [class.active]=\"_AMPM === 'PM'\" aria-label=\"PM\"\n                (click)=\"_ampmClicked('PM')\">PM</button>\n      </span>\n    </span>\n  </div>\n</div>\n\n<div class=\"mtx-calendar-content\" [ngSwitch]=\"currentView\">\n  <div *ngIf=\"currentView === 'month' || currentView === 'year' || currentView === 'multi-year'\"\n       class=\"mtx-month-content\">\n    <div class=\"mtx-calendar-controls\">\n      <button mat-icon-button type=\"button\"\n              class=\"mtx-calendar-previous-button\"\n              [class.disabled]=\"!_previousEnabled()\"\n              [attr.aria-disabled]=\"!_previousEnabled()\"\n              [attr.aria-label]=\"_prevButtonLabel\"\n              (click)=\"_previousClicked()\">\n        <svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\">\n          <path d=\"M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z\"></path>\n        </svg>\n      </button>\n      <div class=\"mtx-calendar-period-button\"\n           [@slideCalendar]=\"_calendarState\"\n           (@slideCalendar.done)=\"_calendarStateDone()\">\n        <strong>{{ _yearPeriodText }}</strong>\n      </div>\n      <button mat-icon-button type=\"button\"\n              class=\"mtx-calendar-next-button\"\n              [class.disabled]=\"!_nextEnabled()\"\n              [attr.aria-disabled]=\"!_nextEnabled()\"\n              [attr.aria-label]=\"_nextButtonLabel\"\n              (click)=\"_nextClicked()\">\n        <svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\">\n          <path d=\"M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z\"></path>\n        </svg>\n      </button>\n    </div>\n  </div>\n  <mtx-month-view *ngSwitchCase=\"'month'\"\n                  (_userSelection)=\"_userSelected()\"\n                  (selectedChange)=\"_dateSelected($event)\"\n                  [activeDate]=\"_activeDate\"\n                  [dateFilter]=\"_dateFilterForViews\"\n                  [selected]=\"selected!\"\n                  [type]=\"type\">\n  </mtx-month-view>\n  <mtx-year-view *ngSwitchCase=\"'year'\"\n                 (_userSelection)=\"_userSelected()\"\n                 (selectedChange)=\"_monthSelected($event)\"\n                 [activeDate]=\"_activeDate\"\n                 [dateFilter]=\"_dateFilterForViews\"\n                 [selected]=\"selected!\"\n                 [type]=\"type\">\n  </mtx-year-view>\n  <mtx-multi-year-view *ngSwitchCase=\"'multi-year'\"\n                       (_userSelection)=\"_userSelected()\"\n                       (selectedChange)=\"_yearSelected($event)\"\n                       [activeDate]=\"_activeDate\"\n                       [dateFilter]=\"_dateFilterForViews\"\n                       [maxDate]=\"maxDate\"\n                       [minDate]=\"minDate\"\n                       [selected]=\"selected!\"\n                       [type]=\"type\">\n  </mtx-multi-year-view>\n\n  <ng-container *ngSwitchDefault>\n    <mtx-time *ngIf=\"timeInput; else clock\"\n              (_userSelection)=\"_userSelected()\"\n              (activeDateChange)=\"_onActiveDateChange($event)\"\n              (selectedChange)=\"_timeSelected($event)\"\n              [AMPM]=\"_AMPM\"\n              (ampmChange)=\"_ampmClicked($event)\"\n              [clockView]=\"_clockView\"\n              (clockViewChange)=\"_clockView = $event\"\n              [twelvehour]=\"twelvehour\"\n              [dateFilter]=\"dateFilter\"\n              [interval]=\"timeInterval\"\n              [maxDate]=\"maxDate\"\n              [minDate]=\"minDate\"\n              [selected]=\"_activeDate\">\n    </mtx-time>\n\n    <ng-template #clock>\n      <mtx-clock (_userSelection)=\"_userSelected()\"\n                 (activeDateChange)=\"_onActiveDateChange($event)\"\n                 (selectedChange)=\"_dialTimeSelected($event)\"\n                 [AMPM]=\"_AMPM\"\n                 [dateFilter]=\"dateFilter\"\n                 [interval]=\"timeInterval\"\n                 [maxDate]=\"maxDate\"\n                 [minDate]=\"minDate\"\n                 [selected]=\"_activeDate\"\n                 [startView]=\"_clockView\"\n                 [twelvehour]=\"twelvehour\">\n      </mtx-clock>\n    </ng-template>\n  </ng-container>\n</div>\n", styles: [".mtx-calendar{display:block;outline:none}.mtx-calendar-header{box-sizing:border-box;padding:8px;border-radius:4px 4px 0 0}.mtx-calendar-header .mtx-calendar-header-year,.mtx-calendar-header .mtx-calendar-header-date,.mtx-calendar-header .mtx-calendar-header-hours,.mtx-calendar-header .mtx-calendar-header-minutes,.mtx-calendar-header .mtx-calendar-header-ampm{height:auto;min-width:auto;padding:0 4px;text-align:inherit;line-height:inherit;color:inherit;font-size:inherit;font-weight:inherit;letter-spacing:normal;white-space:normal;word-break:break-word}.mtx-calendar-header .mtx-calendar-header-year .mat-mdc-button-touch-target,.mtx-calendar-header .mtx-calendar-header-date .mat-mdc-button-touch-target,.mtx-calendar-header .mtx-calendar-header-hours .mat-mdc-button-touch-target,.mtx-calendar-header .mtx-calendar-header-minutes .mat-mdc-button-touch-target,.mtx-calendar-header .mtx-calendar-header-ampm .mat-mdc-button-touch-target{height:100%}.mtx-calendar-header .mtx-calendar-header-year{line-height:24px}.mtx-calendar-header-date-time{font-size:24px;line-height:36px}.mtx-calendar-header-year:not(.active),.mtx-calendar-header-date:not(.active),.mtx-calendar-header-hours:not(.active),.mtx-calendar-header-minutes:not(.active),.mtx-calendar-header-ampm:not(.active){opacity:.6}.mtx-calendar-header-year.not-clickable,.mtx-calendar-header-date.not-clickable,.mtx-calendar-header-hours.not-clickable,.mtx-calendar-header-minutes.not-clickable,.mtx-calendar-header-ampm.not-clickable{cursor:initial}.mtx-calendar-header-time{display:inline-flex}.mtx-calendar-header-time:not(.active){opacity:.6}.mtx-calendar-header-time:not(.active) .mtx-calendar-header-hours,.mtx-calendar-header-time:not(.active) .mtx-calendar-header-minutes,.mtx-calendar-header-time:not(.active) .mtx-calendar-header-ampm{opacity:1}.mtx-calendar-header-hour-minute-separator{display:inline-block;width:8px;text-align:center}.mtx-calendar-header-ampm-container{display:inline-flex;flex-direction:column;line-height:18px;font-size:12px}[mode=landscape] .mtx-calendar{display:flex}[mode=landscape] .mtx-calendar .mtx-calendar-header{width:144px;min-width:144px;padding:16px 8px;border-radius:4px 0 0 4px}[dir=rtl] [mode=landscape] .mtx-calendar .mtx-calendar-header{border-radius:0 4px 4px 0}[mode=landscape] .mtx-calendar .mtx-calendar-header-year+.mtx-calendar-header-date-time,[mode=landscape] .mtx-calendar .mtx-calendar-header-date+.mtx-calendar-header-time{margin-top:4px}[mode=landscape] .mtx-calendar .mtx-calendar-header-date-time{font-size:28px}[mode=landscape] .mtx-calendar .mtx-calendar-header-time{display:flex;flex-direction:column}[mode=landscape] .mtx-calendar .mtx-calendar-header-time .mtx-calendar-header-hours,[mode=landscape] .mtx-calendar .mtx-calendar-header-time .mtx-calendar-header-minutes,[mode=landscape] .mtx-calendar .mtx-calendar-header-time .mtx-calendar-header-ampm{width:40px;text-align:center}[mode=landscape] .mtx-calendar .mtx-calendar-header-ampm-container{flex-direction:row;font-size:20px}[mode=landscape] .mtx-calendar .mtx-calendar-header-ampm{padding:4px}[mode=landscape] .mtx-calendar .mtx-calendar-header-ampm+.mtx-calendar-header-ampm{margin:0 8px}@media all and (orientation: landscape){[mode=auto] .mtx-calendar{display:flex}[mode=auto] .mtx-calendar .mtx-calendar-header{width:144px;min-width:144px;padding:16px 8px;border-radius:4px 0 0 4px}[dir=rtl] [mode=auto] .mtx-calendar .mtx-calendar-header{border-radius:0 4px 4px 0}[mode=auto] .mtx-calendar .mtx-calendar-header-year+.mtx-calendar-header-date-time,[mode=auto] .mtx-calendar .mtx-calendar-header-date+.mtx-calendar-header-time{margin-top:4px}[mode=auto] .mtx-calendar .mtx-calendar-header-date-time{font-size:28px}[mode=auto] .mtx-calendar .mtx-calendar-header-time{display:flex;flex-direction:column}[mode=auto] .mtx-calendar .mtx-calendar-header-time .mtx-calendar-header-hours,[mode=auto] .mtx-calendar .mtx-calendar-header-time .mtx-calendar-header-minutes,[mode=auto] .mtx-calendar .mtx-calendar-header-time .mtx-calendar-header-ampm{width:40px;text-align:center}[mode=auto] .mtx-calendar .mtx-calendar-header-ampm-container{flex-direction:row;font-size:20px}[mode=auto] .mtx-calendar .mtx-calendar-header-ampm{padding:4px}[mode=auto] .mtx-calendar .mtx-calendar-header-ampm+.mtx-calendar-header-ampm{margin:0 8px}}.mtx-calendar-content{width:100%;padding:8px;outline:none;box-sizing:border-box;overflow:hidden}.mtx-calendar-controls{display:flex;align-items:center;justify-content:space-between;margin:0 calc(4.7142857143% - 16px)}.mtx-calendar-controls .mat-icon-button:hover .mat-button-focus-overlay{opacity:.04}.mtx-calendar-period-button{display:inline-block;height:40px;line-height:40px;outline:none;border:0;background:transparent;box-sizing:border-box}.mtx-calendar-previous-button.disabled,.mtx-calendar-next-button.disabled{pointer-events:none}.mtx-calendar-previous-button svg,.mtx-calendar-next-button svg{fill:currentColor;vertical-align:top}[dir=rtl] .mtx-calendar-previous-button svg,[dir=rtl] .mtx-calendar-next-button svg{transform:rotate(180deg)}.mtx-calendar-table{border-spacing:0;border-collapse:collapse;width:100%}.mtx-calendar-table-header th{text-align:center;padding:8px 0}\n"], dependencies: [{ kind: "directive", type: i3.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i3.NgSwitch, selector: "[ngSwitch]", inputs: ["ngSwitch"] }, { kind: "directive", type: i3.NgSwitchCase, selector: "[ngSwitchCase]", inputs: ["ngSwitchCase"] }, { kind: "directive", type: i3.NgSwitchDefault, selector: "[ngSwitchDefault]" }, { kind: "component", type: i4.MatButton, selector: "    button[mat-button], button[mat-raised-button], button[mat-flat-button],    button[mat-stroked-button]  ", inputs: ["disabled", "disableRipple", "color"], exportAs: ["matButton"] }, { kind: "component", type: i4.MatIconButton, selector: "button[mat-icon-button]", inputs: ["disabled", "disableRipple", "color"], exportAs: ["matButton"] }, { kind: "component", type: i5.MtxClock, selector: "mtx-clock", inputs: ["dateFilter", "interval", "twelvehour", "AMPM", "activeDate", "selected", "minDate", "maxDate", "startView"], outputs: ["selectedChange", "activeDateChange", "_userSelection"], exportAs: ["mtxClock"] }, { kind: "component", type: i6.MtxTime, selector: "mtx-time", inputs: ["dateFilter", "interval", "twelvehour", "AMPM", "activeDate", "selected", "minDate", "maxDate", "clockView"], outputs: ["selectedChange", "activeDateChange", "_userSelection", "ampmChange", "clockViewChange"], exportAs: ["mtxTime"] }, { kind: "component", type: i7.MtxMonthView, selector: "mtx-month-view", inputs: ["type", "dateFilter", "activeDate", "selected"], outputs: ["selectedChange", "_userSelection"], exportAs: ["mtxMonthView"] }, { kind: "component", type: i8.MtxYearView, selector: "mtx-year-view", inputs: ["type", "dateFilter", "activeDate", "selected"], outputs: ["selectedChange", "_userSelection"], exportAs: ["mtxYearView"] }, { kind: "component", type: i9.MtxMultiYearView, selector: "mtx-multi-year-view", inputs: ["type", "dateFilter", "activeDate", "selected", "minDate", "maxDate"], outputs: ["selectedChange", "_userSelection"], exportAs: ["mtxMultiYearView"] }], animations: [mtxDatetimepickerAnimations.slideCalendar], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MtxCalendar, decorators: [{
            type: Component,
            args: [{ selector: 'mtx-calendar', host: {
                        'class': 'mtx-calendar',
                        '[class.mtx-calendar-with-time-input]': 'timeInput',
                        'tabindex': '0',
                        '(keydown)': '_handleCalendarBodyKeydown($event)',
                    }, exportAs: 'mtxCalendar', animations: [mtxDatetimepickerAnimations.slideCalendar], encapsulation: ViewEncapsulation.None, changeDetection: ChangeDetectionStrategy.OnPush, template: "<div class=\"mtx-calendar-header\">\n  <button *ngIf=\"type !== 'time'\"\n          mat-button type=\"button\" class=\"mtx-calendar-header-year\"\n          [class.active]=\"currentView === 'year' || currentView === 'multi-year'\"\n          [attr.aria-label]=\"_yearButtonLabel\"\n          (click)=\"_yearClicked()\">\n    <span>{{ _yearButtonText }}</span>\n    <svg *ngIf=\"multiYearSelector || type === 'year'\"\n         class=\"mtx-calendar-header-year-dropdown\" matButtonIcon iconPositionEnd\n         width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"currentColor\">\n      <path d=\"M7,10L12,15L17,10H7Z\"></path>\n    </svg>\n  </button>\n  <div *ngIf=\"type !== 'year'\" class=\"mtx-calendar-header-date-time\">\n    <button *ngIf=\"type !== 'time'\"\n            mat-button type=\"button\" class=\"mtx-calendar-header-date\"\n            [class.active]=\"currentView === 'month'\"\n            [class.not-clickable]=\"type === 'month'\"\n            [attr.aria-label]=\"_dateButtonLabel\"\n            (click)=\"_dateClicked()\">{{ _dateButtonText }}</button>\n    <span *ngIf=\"type.endsWith('time')\" class=\"mtx-calendar-header-time\"\n          [class.active]=\"currentView === 'clock'\">\n      <span class=\"mtx-calendar-header-hour-minute-container\">\n        <button mat-button type=\"button\" class=\"mtx-calendar-header-hours\"\n                [class.active]=\"_clockView === 'hour'\"\n                [attr.aria-label]=\"_hourButtonLabel\"\n                (click)=\"_hoursClicked()\">{{ _hoursButtonText }}</button>\n        <span class=\"mtx-calendar-header-hour-minute-separator\">:</span>\n        <button mat-button type=\"button\" class=\"mtx-calendar-header-minutes\"\n                [class.active]=\"_clockView === 'minute'\"\n                [attr.aria-label]=\"_minuteButtonLabel\"\n                (click)=\"_minutesClicked()\">{{ _minutesButtonText }}</button>\n      </span>\n      <span *ngIf=\"twelvehour\" class=\"mtx-calendar-header-ampm-container\">\n        <button mat-button type=\"button\" class=\"mtx-calendar-header-ampm\"\n                [class.active]=\"_AMPM === 'AM'\" aria-label=\"AM\"\n                (click)=\"_ampmClicked('AM')\">AM</button>\n        <button mat-button type=\"button\" class=\"mtx-calendar-header-ampm\"\n                [class.active]=\"_AMPM === 'PM'\" aria-label=\"PM\"\n                (click)=\"_ampmClicked('PM')\">PM</button>\n      </span>\n    </span>\n  </div>\n</div>\n\n<div class=\"mtx-calendar-content\" [ngSwitch]=\"currentView\">\n  <div *ngIf=\"currentView === 'month' || currentView === 'year' || currentView === 'multi-year'\"\n       class=\"mtx-month-content\">\n    <div class=\"mtx-calendar-controls\">\n      <button mat-icon-button type=\"button\"\n              class=\"mtx-calendar-previous-button\"\n              [class.disabled]=\"!_previousEnabled()\"\n              [attr.aria-disabled]=\"!_previousEnabled()\"\n              [attr.aria-label]=\"_prevButtonLabel\"\n              (click)=\"_previousClicked()\">\n        <svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\">\n          <path d=\"M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z\"></path>\n        </svg>\n      </button>\n      <div class=\"mtx-calendar-period-button\"\n           [@slideCalendar]=\"_calendarState\"\n           (@slideCalendar.done)=\"_calendarStateDone()\">\n        <strong>{{ _yearPeriodText }}</strong>\n      </div>\n      <button mat-icon-button type=\"button\"\n              class=\"mtx-calendar-next-button\"\n              [class.disabled]=\"!_nextEnabled()\"\n              [attr.aria-disabled]=\"!_nextEnabled()\"\n              [attr.aria-label]=\"_nextButtonLabel\"\n              (click)=\"_nextClicked()\">\n        <svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\">\n          <path d=\"M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z\"></path>\n        </svg>\n      </button>\n    </div>\n  </div>\n  <mtx-month-view *ngSwitchCase=\"'month'\"\n                  (_userSelection)=\"_userSelected()\"\n                  (selectedChange)=\"_dateSelected($event)\"\n                  [activeDate]=\"_activeDate\"\n                  [dateFilter]=\"_dateFilterForViews\"\n                  [selected]=\"selected!\"\n                  [type]=\"type\">\n  </mtx-month-view>\n  <mtx-year-view *ngSwitchCase=\"'year'\"\n                 (_userSelection)=\"_userSelected()\"\n                 (selectedChange)=\"_monthSelected($event)\"\n                 [activeDate]=\"_activeDate\"\n                 [dateFilter]=\"_dateFilterForViews\"\n                 [selected]=\"selected!\"\n                 [type]=\"type\">\n  </mtx-year-view>\n  <mtx-multi-year-view *ngSwitchCase=\"'multi-year'\"\n                       (_userSelection)=\"_userSelected()\"\n                       (selectedChange)=\"_yearSelected($event)\"\n                       [activeDate]=\"_activeDate\"\n                       [dateFilter]=\"_dateFilterForViews\"\n                       [maxDate]=\"maxDate\"\n                       [minDate]=\"minDate\"\n                       [selected]=\"selected!\"\n                       [type]=\"type\">\n  </mtx-multi-year-view>\n\n  <ng-container *ngSwitchDefault>\n    <mtx-time *ngIf=\"timeInput; else clock\"\n              (_userSelection)=\"_userSelected()\"\n              (activeDateChange)=\"_onActiveDateChange($event)\"\n              (selectedChange)=\"_timeSelected($event)\"\n              [AMPM]=\"_AMPM\"\n              (ampmChange)=\"_ampmClicked($event)\"\n              [clockView]=\"_clockView\"\n              (clockViewChange)=\"_clockView = $event\"\n              [twelvehour]=\"twelvehour\"\n              [dateFilter]=\"dateFilter\"\n              [interval]=\"timeInterval\"\n              [maxDate]=\"maxDate\"\n              [minDate]=\"minDate\"\n              [selected]=\"_activeDate\">\n    </mtx-time>\n\n    <ng-template #clock>\n      <mtx-clock (_userSelection)=\"_userSelected()\"\n                 (activeDateChange)=\"_onActiveDateChange($event)\"\n                 (selectedChange)=\"_dialTimeSelected($event)\"\n                 [AMPM]=\"_AMPM\"\n                 [dateFilter]=\"dateFilter\"\n                 [interval]=\"timeInterval\"\n                 [maxDate]=\"maxDate\"\n                 [minDate]=\"minDate\"\n                 [selected]=\"_activeDate\"\n                 [startView]=\"_clockView\"\n                 [twelvehour]=\"twelvehour\">\n      </mtx-clock>\n    </ng-template>\n  </ng-container>\n</div>\n", styles: [".mtx-calendar{display:block;outline:none}.mtx-calendar-header{box-sizing:border-box;padding:8px;border-radius:4px 4px 0 0}.mtx-calendar-header .mtx-calendar-header-year,.mtx-calendar-header .mtx-calendar-header-date,.mtx-calendar-header .mtx-calendar-header-hours,.mtx-calendar-header .mtx-calendar-header-minutes,.mtx-calendar-header .mtx-calendar-header-ampm{height:auto;min-width:auto;padding:0 4px;text-align:inherit;line-height:inherit;color:inherit;font-size:inherit;font-weight:inherit;letter-spacing:normal;white-space:normal;word-break:break-word}.mtx-calendar-header .mtx-calendar-header-year .mat-mdc-button-touch-target,.mtx-calendar-header .mtx-calendar-header-date .mat-mdc-button-touch-target,.mtx-calendar-header .mtx-calendar-header-hours .mat-mdc-button-touch-target,.mtx-calendar-header .mtx-calendar-header-minutes .mat-mdc-button-touch-target,.mtx-calendar-header .mtx-calendar-header-ampm .mat-mdc-button-touch-target{height:100%}.mtx-calendar-header .mtx-calendar-header-year{line-height:24px}.mtx-calendar-header-date-time{font-size:24px;line-height:36px}.mtx-calendar-header-year:not(.active),.mtx-calendar-header-date:not(.active),.mtx-calendar-header-hours:not(.active),.mtx-calendar-header-minutes:not(.active),.mtx-calendar-header-ampm:not(.active){opacity:.6}.mtx-calendar-header-year.not-clickable,.mtx-calendar-header-date.not-clickable,.mtx-calendar-header-hours.not-clickable,.mtx-calendar-header-minutes.not-clickable,.mtx-calendar-header-ampm.not-clickable{cursor:initial}.mtx-calendar-header-time{display:inline-flex}.mtx-calendar-header-time:not(.active){opacity:.6}.mtx-calendar-header-time:not(.active) .mtx-calendar-header-hours,.mtx-calendar-header-time:not(.active) .mtx-calendar-header-minutes,.mtx-calendar-header-time:not(.active) .mtx-calendar-header-ampm{opacity:1}.mtx-calendar-header-hour-minute-separator{display:inline-block;width:8px;text-align:center}.mtx-calendar-header-ampm-container{display:inline-flex;flex-direction:column;line-height:18px;font-size:12px}[mode=landscape] .mtx-calendar{display:flex}[mode=landscape] .mtx-calendar .mtx-calendar-header{width:144px;min-width:144px;padding:16px 8px;border-radius:4px 0 0 4px}[dir=rtl] [mode=landscape] .mtx-calendar .mtx-calendar-header{border-radius:0 4px 4px 0}[mode=landscape] .mtx-calendar .mtx-calendar-header-year+.mtx-calendar-header-date-time,[mode=landscape] .mtx-calendar .mtx-calendar-header-date+.mtx-calendar-header-time{margin-top:4px}[mode=landscape] .mtx-calendar .mtx-calendar-header-date-time{font-size:28px}[mode=landscape] .mtx-calendar .mtx-calendar-header-time{display:flex;flex-direction:column}[mode=landscape] .mtx-calendar .mtx-calendar-header-time .mtx-calendar-header-hours,[mode=landscape] .mtx-calendar .mtx-calendar-header-time .mtx-calendar-header-minutes,[mode=landscape] .mtx-calendar .mtx-calendar-header-time .mtx-calendar-header-ampm{width:40px;text-align:center}[mode=landscape] .mtx-calendar .mtx-calendar-header-ampm-container{flex-direction:row;font-size:20px}[mode=landscape] .mtx-calendar .mtx-calendar-header-ampm{padding:4px}[mode=landscape] .mtx-calendar .mtx-calendar-header-ampm+.mtx-calendar-header-ampm{margin:0 8px}@media all and (orientation: landscape){[mode=auto] .mtx-calendar{display:flex}[mode=auto] .mtx-calendar .mtx-calendar-header{width:144px;min-width:144px;padding:16px 8px;border-radius:4px 0 0 4px}[dir=rtl] [mode=auto] .mtx-calendar .mtx-calendar-header{border-radius:0 4px 4px 0}[mode=auto] .mtx-calendar .mtx-calendar-header-year+.mtx-calendar-header-date-time,[mode=auto] .mtx-calendar .mtx-calendar-header-date+.mtx-calendar-header-time{margin-top:4px}[mode=auto] .mtx-calendar .mtx-calendar-header-date-time{font-size:28px}[mode=auto] .mtx-calendar .mtx-calendar-header-time{display:flex;flex-direction:column}[mode=auto] .mtx-calendar .mtx-calendar-header-time .mtx-calendar-header-hours,[mode=auto] .mtx-calendar .mtx-calendar-header-time .mtx-calendar-header-minutes,[mode=auto] .mtx-calendar .mtx-calendar-header-time .mtx-calendar-header-ampm{width:40px;text-align:center}[mode=auto] .mtx-calendar .mtx-calendar-header-ampm-container{flex-direction:row;font-size:20px}[mode=auto] .mtx-calendar .mtx-calendar-header-ampm{padding:4px}[mode=auto] .mtx-calendar .mtx-calendar-header-ampm+.mtx-calendar-header-ampm{margin:0 8px}}.mtx-calendar-content{width:100%;padding:8px;outline:none;box-sizing:border-box;overflow:hidden}.mtx-calendar-controls{display:flex;align-items:center;justify-content:space-between;margin:0 calc(4.7142857143% - 16px)}.mtx-calendar-controls .mat-icon-button:hover .mat-button-focus-overlay{opacity:.04}.mtx-calendar-period-button{display:inline-block;height:40px;line-height:40px;outline:none;border:0;background:transparent;box-sizing:border-box}.mtx-calendar-previous-button.disabled,.mtx-calendar-next-button.disabled{pointer-events:none}.mtx-calendar-previous-button svg,.mtx-calendar-next-button svg{fill:currentColor;vertical-align:top}[dir=rtl] .mtx-calendar-previous-button svg,[dir=rtl] .mtx-calendar-next-button svg{transform:rotate(180deg)}.mtx-calendar-table{border-spacing:0;border-collapse:collapse;width:100%}.mtx-calendar-table-header th{text-align:center;padding:8px 0}\n"] }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i1.MtxDatetimepickerIntl }, { type: i0.NgZone }, { type: i2.DatetimeAdapter, decorators: [{
                    type: Optional
                }] }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [MTX_DATETIME_FORMATS]
                }] }, { type: i0.ChangeDetectorRef }]; }, propDecorators: { multiYearSelector: [{
                type: Input
            }], twelvehour: [{
                type: Input
            }], startView: [{
                type: Input
            }], timeInterval: [{
                type: Input
            }], dateFilter: [{
                type: Input
            }], preventSameDateTimeSelection: [{
                type: Input
            }], selectedChange: [{
                type: Output
            }], viewChanged: [{
                type: Output
            }], _userSelection: [{
                type: Output
            }], type: [{
                type: Input
            }], startAt: [{
                type: Input
            }], timeInput: [{
                type: Input
            }], selected: [{
                type: Input
            }], minDate: [{
                type: Input
            }], maxDate: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FsZW5kYXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wcm9qZWN0cy9leHRlbnNpb25zL2RhdGV0aW1lcGlja2VyL2NhbGVuZGFyLnRzIiwiLi4vLi4vLi4vLi4vcHJvamVjdHMvZXh0ZW5zaW9ucy9kYXRldGltZXBpY2tlci9jYWxlbmRhci5odG1sIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFFTCx1QkFBdUIsRUFFdkIsU0FBUyxFQUVULFlBQVksRUFDWixNQUFNLEVBQ04sS0FBSyxFQUdMLFFBQVEsRUFDUixNQUFNLEVBQ04saUJBQWlCLEdBQ2xCLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFDTCxVQUFVLEVBQ1YsR0FBRyxFQUNILEtBQUssRUFDTCxJQUFJLEVBQ0osVUFBVSxFQUNWLFNBQVMsRUFDVCxPQUFPLEVBQ1AsV0FBVyxFQUNYLFFBQVEsR0FDVCxNQUFNLHVCQUF1QixDQUFDO0FBQy9CLE9BQU8sRUFBZ0IscUJBQXFCLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQztBQUU1RSxPQUFPLEVBQUUsS0FBSyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDdkMsT0FBTyxFQUVMLG9CQUFvQixHQUVyQixNQUFNLDRCQUE0QixDQUFDO0FBRXBDLE9BQU8sRUFBRSwyQkFBMkIsRUFBRSxNQUFNLDZCQUE2QixDQUFDO0FBQzFFLE9BQU8sRUFBRSwwQkFBMEIsRUFBRSxNQUFNLHlCQUF5QixDQUFDO0FBQ3JFLE9BQU8sRUFBRSwyQkFBMkIsRUFBRSxNQUFNLDZCQUE2QixDQUFDO0FBQzFFLE9BQU8sRUFBRSxlQUFlLEVBQUUsbUJBQW1CLEVBQUUsWUFBWSxFQUFFLFdBQVcsRUFBRSxNQUFNLG1CQUFtQixDQUFDOzs7Ozs7Ozs7OztBQUlwRzs7O0dBR0c7QUFnQkgsTUFBTSxPQUFPLFdBQVc7SUFDdEIsdUNBQXVDO0lBQ3ZDLElBQ0ksaUJBQWlCO1FBQ25CLE9BQU8sSUFBSSxDQUFDLGtCQUFrQixDQUFD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R0ksY0FBYztzQkFBdkIsTUFBTTtnQkFHRyxXQUFXO3NCQUFwQixNQUFNO2dCQUVHLGNBQWM7c0JBQXZCLE1BQU07Z0JBaUNILElBQUk7c0JBRFAsS0FBSztnQkFjRixPQUFPO3NCQURWLEtBQUs7Z0JBY0YsU0FBUztzQkFEWixLQUFLO2dCQVdGLFFBQVE7c0JBRFgsS0FBSztnQkFXRixPQUFPO3NCQURWLEtBQUs7Z0JBV0YsT0FBTztzQkFEVixLQUFLIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgQWZ0ZXJDb250ZW50SW5pdCxcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIENoYW5nZURldGVjdG9yUmVmLFxuICBDb21wb25lbnQsXG4gIEVsZW1lbnRSZWYsXG4gIEV2ZW50RW1pdHRlcixcbiAgSW5qZWN0LFxuICBJbnB1dCxcbiAgTmdab25lLFxuICBPbkRlc3Ryb3ksXG4gIE9wdGlvbmFsLFxuICBPdXRwdXQsXG4gIFZpZXdFbmNhcHN1bGF0aW9uLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7XG4gIERPV05fQVJST1csXG4gIEVORCxcbiAgRU5URVIsXG4gIEhPTUUsXG4gIExFRlRfQVJST1csXG4gIFBBR0VfRE9XTixcbiAgUEFHRV9VUCxcbiAgUklHSFRfQVJST1csXG4gIFVQX0FSUk9XLFxufSBmcm9tICdAYW5ndWxhci9jZGsva2V5Y29kZXMnO1xuaW1wb3J0IHsgQm9vbGVhbklucHV0LCBjb2VyY2VCb29sZWFuUHJvcGVydHkgfSBmcm9tICdAYW5ndWxhci9jZGsvY29lcmNpb24nO1xuaW1wb3J0IHsgU3Vic2NyaXB0aW9uIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBmaXJzdCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7XG4gIERhdGV0aW1lQWRhcHRlcixcbiAgTVRYX0RBVEVUSU1FX0ZPUk1BVFMsXG4gIE10eERhdGV0aW1lRm9ybWF0cyxcbn0gZnJvbSAnQG5nLW1hdGVyby9leHRlbnNpb25zL2NvcmUnO1xuaW1wb3J0IHsgTXR4Q2xvY2tWaWV3IH0gZnJvbSAnLi9jbG9jayc7XG5pbXBvcnQgeyBtdHhEYXRldGltZXBpY2tlckFuaW1hdGlvbnMgfSBmcm9tICcuL2RhdGV0aW1lcGlja2VyLWFuaW1hdGlvbnMnO1xuaW1wb3J0IHsgY3JlYXRlTWlzc2luZ0RhdGVJbXBsRXJyb3IgfSBmcm9tICcuL2RhdGV0aW1lcGlja2VyLWVycm9ycyc7XG5pbXBvcnQgeyBNdHhEYXRldGltZXBpY2tlckZpbHRlclR5cGUgfSBmcm9tICcuL2RhdGV0aW1lcGlja2VyLWZpbHRlcnR5cGUnO1xuaW1wb3J0IHsgZ2V0QWN0aXZlT2Zmc2V0LCBpc1NhbWVNdWx0aVllYXJWaWV3LCB5ZWFyc1BlclBhZ2UsIHllYXJzUGVyUm93IH0gZnJvbSAnLi9tdWx0aS15ZWFyLXZpZXcnO1xuaW1wb3J0IHsgTXR4QU1QTSwgTXR4Q2FsZW5kYXJWaWV3LCBNdHhEYXRldGltZXBpY2tlclR5cGUgfSBmcm9tICcuL2RhdGV0aW1lcGlja2VyLXR5cGVzJztcbmltcG9ydCB7IE10eERhdGV0aW1lcGlja2VySW50bCB9IGZyb20gJy4vZGF0ZXRpbWVwaWNrZXItaW50bCc7XG5cbi8qKlxuICogQSBjYWxlbmRhciB0aGF0IGlzIHVzZWQgYXMgcGFydCBvZiB0aGUgZGF0ZXRpbWVwaWNrZXIuXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ210eC1jYWxlbmRhcicsXG4gIHRlbXBsYXRlVXJsOiAnY2FsZW5kYXIuaHRtbCcsXG4gIHN0eWxlVXJsczogWydjYWxlbmRhci5zY3NzJ10sXG4gIGhvc3Q6IHtcbiAgICAnY2xhc3MnOiAnbXR4LWNhbGVuZGFyJyxcbiAgICAnW2NsYXNzLm10eC1jYWxlbmRhci13aXRoLXRpbWUtaW5wdXRdJzogJ3RpbWVJbnB1dCcsXG4gICAgJ3RhYmluZGV4JzogJzAnLFxuICAgICcoa2V5ZG93biknOiAnX2hhbmRsZUNhbGVuZGFyQm9keUtleWRvd24oJGV2ZW50KScsXG4gIH0sXG4gIGV4cG9ydEFzOiAnbXR4Q2FsZW5kYXInLFxuICBhbmltYXRpb25zOiBbbXR4RGF0ZXRpbWVwaWNrZXJBbmltYXRpb25zLnNsaWRlQ2FsZW5kYXJdLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbn0pXG5leHBvcnQgY2xhc3MgTXR4Q2FsZW5kYXI8RD4gaW1wbGVtZW50cyBBZnRlckNvbnRlbnRJbml0LCBPbkRlc3Ryb3kge1xuICAvKiogV2hldGhlciB0byBzaG93IG11bHRpLXllYXIgdmlldy4gKi9cbiAgQElucHV0KClcbiAgZ2V0IG11bHRpWWVhclNlbGVjdG9yKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9tdWx0aVllYXJTZWxlY3RvcjtcbiAgfVxuICBzZXQgbXVsdGlZZWFyU2VsZWN0b3IodmFsdWU6IGJvb2xlYW4pIHtcbiAgICB0aGlzLl9tdWx0aVllYXJTZWxlY3RvciA9IGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSh2YWx1ZSk7XG4gIH1cbiAgcHJpdmF0ZSBfbXVsdGlZZWFyU2VsZWN0b3IgPSBmYWxzZTtcblxuICAvKiogV2hldGhlciB0aGUgY2xvY2sgdXNlcyAxMiBob3VyIGZvcm1hdC4gKi9cbiAgQElucHV0KClcbiAgZ2V0IHR3ZWx2ZWhvdXIoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX3R3ZWx2ZWhvdXI7XG4gIH1cbiAgc2V0IHR3ZWx2ZWhvdXIodmFsdWU6IGJvb2xlYW4pIHtcbiAgICB0aGlzLl90d2VsdmVob3VyID0gY29lcmNlQm9vbGVhblByb3BlcnR5KHZhbHVlKTtcbiAgfVxuICBwcml2YXRlIF90d2VsdmVob3VyID0gZmFsc2U7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGNhbGVuZGFyIHNob3VsZCBiZSBzdGFydGVkIGluIG1vbnRoIG9yIHllYXIgdmlldy4gKi9cbiAgQElucHV0KCkgc3RhcnRWaWV3OiBNdHhDYWxlbmRhclZpZXcgPSAnbW9udGgnO1xuXG4gIC8qKiBTdGVwIG92ZXIgbWludXRlcy4gKi9cbiAgQElucHV0KCkgdGltZUludGVydmFsOiBudW1iZXIgPSAxO1xuXG4gIC8qKiBBIGZ1bmN0aW9uIHVzZWQgdG8gZmlsdGVyIHdoaWNoIGRhdGVzIGFyZSBzZWxlY3RhYmxlLiAqL1xuICBASW5wdXQoKSBkYXRlRmlsdGVyITogKGRhdGU6IEQsIHR5cGU6IE10eERhdGV0aW1lcGlja2VyRmlsdGVyVHlwZSkgPT4gYm9vbGVhbjtcblxuICAvKiogUHJldmVudCB1c2VyIHRvIHNlbGVjdCBzYW1lIGRhdGUgdGltZSAqL1xuICBASW5wdXQoKSBwcmV2ZW50U2FtZURhdGVUaW1lU2VsZWN0aW9uID0gZmFsc2U7XG5cbiAgLyoqIEVtaXRzIHdoZW4gdGhlIGN1cnJlbnRseSBzZWxlY3RlZCBkYXRlIGNoYW5nZXMuICovXG4gIEBPdXRwdXQoKSBzZWxlY3RlZENoYW5nZTogRXZlbnRFbWl0dGVyPEQ+ID0gbmV3IEV2ZW50RW1pdHRlcjxEPigpO1xuXG4gIC8qKiBFbWl0cyB3aGVuIHRoZSB2aWV3IGhhcyBiZWVuIGNoYW5nZWQuICovXG4gIEBPdXRwdXQoKSB2aWV3Q2hhbmdlZDogRXZlbnRFbWl0dGVyPE10eENhbGVuZGFyVmlldz4gPSBuZXcgRXZlbnRFbWl0dGVyPE10eENhbGVuZGFyVmlldz4oKTtcblxuICBAT3V0cHV0KCkgX3VzZXJTZWxlY3Rpb24gPSBuZXcgRXZlbnRFbWl0dGVyPHZvaWQ+KCk7XG5cbiAgX0FNUE0hOiBNdHhBTVBNO1xuXG4gIF9jbG9ja1ZpZXc6IE10eENsb2NrVmlldyA9ICdob3VyJztcblxuICBfY2FsZW5kYXJTdGF0ZSE6IHN0cmluZztcblxuICBwcml2YXRlIF9pbnRsQ2hhbmdlczogU3Vic2NyaXB0aW9uO1xuXG4gIHByaXZhdGUgX2NsYW1wZWRBY3RpdmVEYXRlITogRDtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIF9lbGVtZW50UmVmOiBFbGVtZW50UmVmLFxuICAgIHByaXZhdGUgX2ludGw6IE10eERhdGV0aW1lcGlja2VySW50bCxcbiAgICBwcml2YXRlIF9uZ1pvbmU6IE5nWm9uZSxcbiAgICBAT3B0aW9uYWwoKSBwcml2YXRlIF9hZGFwdGVyOiBEYXRldGltZUFkYXB0ZXI8RD4sXG4gICAgQE9wdGlvbmFsKCkgQEluamVjdChNVFhfREFURVRJTUVfRk9STUFUUykgcHJpdmF0ZSBfZGF0ZUZvcm1hdHM6IE10eERhdGV0aW1lRm9ybWF0cyxcbiAgICBfY2hhbmdlRGV0ZWN0b3JSZWY6IENoYW5nZURldGVjdG9yUmVmXG4gICkge1xuICAgIGlmICghdGhpcy5fYWRhcHRlcikge1xuICAgICAgdGhyb3cgY3JlYXRlTWlzc2luZ0RhdGVJbXBsRXJyb3IoJ0RhdGV0aW1lQWRhcHRlcicpO1xuICAgIH1cblxuICAgIGlmICghdGhpcy5fZGF0ZUZvcm1hdHMpIHtcbiAgICAgIHRocm93IGNyZWF0ZU1pc3NpbmdEYXRlSW1wbEVycm9yKCdNVFhfREFURVRJTUVfRk9STUFUUycpO1xuICAgIH1cblxuICAgIHRoaXMuX2ludGxDaGFuZ2VzID0gX2ludGwuY2hhbmdlcy5zdWJzY3JpYmUoKCkgPT4gX2NoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpKTtcbiAgfVxuXG4gIC8qKiBUaGUgZGlzcGxheSB0eXBlIG9mIGRhdGV0aW1lcGlja2VyLiAqL1xuICBASW5wdXQoKVxuICBnZXQgdHlwZSgpOiBNdHhEYXRldGltZXBpY2tlclR5cGUge1xuICAgIHJldHVybiB0aGlzLl90eXBlO1xuICB9XG4gIHNldCB0eXBlKHZhbHVlOiBNdHhEYXRldGltZXBpY2tlclR5cGUpIHtcbiAgICB0aGlzLl90eXBlID0gdmFsdWUgfHwgJ2RhdGUnO1xuICAgIGlmICh0aGlzLnR5cGUgPT09ICd5ZWFyJykge1xuICAgICAgdGhpcy5tdWx0aVllYXJTZWxlY3RvciA9IHRydWU7XG4gICAgfVxuICB9XG4gIHByaXZhdGUgX3R5cGU6IE10eERhdGV0aW1lcGlja2VyVHlwZSA9ICdkYXRlJztcblxuICAvKiogQSBkYXRlIHJlcHJlc2VudGluZyB0aGUgcGVyaW9kIChtb250aCBvciB5ZWFyKSB0byBzdGFydCB0aGUgY2FsZW5kYXIgaW4uICovXG4gIEBJbnB1dCgpXG4gIGdldCBzdGFydEF0KCk6IEQgfCBudWxsIHtcbiAgICByZXR1cm4gdGhpcy5fc3RhcnRBdDtcbiAgfVxuICBzZXQgc3RhcnRBdCh2YWx1ZTogRCB8IG51bGwpIHtcbiAgICB0aGlzLl9zdGFydEF0ID0gdGhpcy5fYWRhcHRlci5nZXRWYWxpZERhdGVPck51bGwodmFsdWUpO1xuICB9XG4gIHByaXZhdGUgX3N0YXJ0QXQhOiBEIHwgbnVsbDtcblxuICAvKipcbiAgICogV2hldGhlciB0aGUgY2FsZW5kYXIgaXMgaW4gdGltZSBtb2RlLiBJbiB0aW1lIG1vZGUgdGhlIGNhbGVuZGFyIGNsb2NrIGdldHMgdGltZSBpbnB1dCBlbGVtZW50c1xuICAgKiByYXRoZXIgdGhlbiBqdXN0IGNsb2NrLiBXaGVuIHRvdWNoVWkgaXMgZW5hYmxlZCB0aGlzIHdpbGwgYmUgZGlzYWJsZWRcbiAgICovXG4gIEBJbnB1dCgpXG4gIGdldCB0aW1lSW5wdXQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX3RpbWVJbnB1dDtcbiAgfVxuICBzZXQgdGltZUlucHV0KHZhbHVlOiBib29sZWFuKSB7XG4gICAgdGhpcy5fdGltZUlucHV0ID0gY29lcmNlQm9vbGVhblByb3BlcnR5KHZhbHVlKTtcbiAgfVxuICBwcml2YXRlIF90aW1lSW5wdXQgPSBmYWxzZTtcblxuICAvKiogVGhlIGN1cnJlbnRseSBzZWxlY3RlZCBkYXRlLiAqL1xuICBASW5wdXQoKVxuICBnZXQgc2VsZWN0ZWQoKTogRCB8IG51bGwge1xuICAgIHJldHVybiB0aGlzLl9zZWxlY3RlZDtcbiAgfVxuICBzZXQgc2VsZWN0ZWQodmFsdWU6IEQgfCBudWxsKSB7XG4gICAgdGhpcy5fc2VsZWN0ZWQgPSB0aGlzLl9hZGFwdGVyLmdldFZhbGlkRGF0ZU9yTnVsbCh2YWx1ZSk7XG4gIH1cbiAgcHJpdmF0ZSBfc2VsZWN0ZWQhOiBEIHwgbnVsbDtcblxuICAvKiogVGhlIG1pbmltdW0gc2VsZWN0YWJsZSBkYXRlLiAqL1xuICBASW5wdXQoKVxuICBnZXQgbWluRGF0ZSgpOiBEIHwgbnVsbCB7XG4gICAgcmV0dXJuIHRoaXMuX21pbkRhdGU7XG4gIH1cbiAgc2V0IG1pbkRhdGUodmFsdWU6IEQgfCBudWxsKSB7XG4gICAgdGhpcy5fbWluRGF0ZSA9IHRoaXMuX2FkYXB0ZXIuZ2V0VmFsaWREYXRlT3JOdWxsKHZhbHVlKTtcbiAgfVxuICBwcml2YXRlIF9taW5EYXRlITogRCB8IG51bGw7XG5cbiAgLyoqIFRoZSBtYXhpbXVtIHNlbGVjdGFibGUgZGF0ZS4gKi9cbiAgQElucHV0KClcbiAgZ2V0IG1heERhdGUoKTogRCB8IG51bGwge1xuICAgIHJldHVybiB0aGlzLl9tYXhEYXRlO1xuICB9XG4gIHNldCBtYXhEYXRlKHZhbHVlOiBEIHwgbnVsbCkge1xuICAgIHRoaXMuX21heERhdGUgPSB0aGlzLl9hZGFwdGVyLmdldFZhbGlkRGF0ZU9yTnVsbCh2YWx1ZSk7XG4gIH1cbiAgcHJpdmF0ZSBfbWF4RGF0ZSE6IEQgfCBudWxsO1xuXG4gIC8qKlxuICAgKiBUaGUgY3VycmVudCBhY3RpdmUgZGF0ZS4gVGhpcyBkZXRlcm1pbmVzIHdoaWNoIHRpbWUgcGVyaW9kIGlzIHNob3duIGFuZCB3aGljaCBkYXRlIGlzXG4gICAqIGhpZ2hsaWdodGVkIHdoZW4gdXNpbmcga2V5Ym9hcmQgbmF2aWdhdGlvbi5cbiAgICovXG4gIGdldCBfYWN0aXZlRGF0ZSgpOiBEIHtcbiAgICByZXR1cm4gdGhpcy5fY2xhbXBlZEFjdGl2ZURhdGU7XG4gIH1cblxuICBzZXQgX2FjdGl2ZURhdGUodmFsdWU6IEQpIHtcbiAgICBjb25zdCBvbGRBY3RpdmVEYXRlID0gdGhpcy5fY2xhbXBlZEFjdGl2ZURhdGU7XG4gICAgdGhpcy5fY2xhbXBlZEFjdGl2ZURhdGUgPSB0aGlzLl9hZGFwdGVyLmNsYW1wRGF0ZSh2YWx1ZSwgdGhpcy5taW5EYXRlLCB0aGlzLm1heERhdGUpO1xuXG4gICAgLy8gd2hlbmV2ZXIgYWN0aXZlIGRhdGUgY2hhbmdlZCwgYW5kIHBvc3NpYmx5IGdvdCBjbGFtcGVkIHdlIHNob3VsZCBhZGp1c3QgdGhlIGFtL3BtIHNldHRpbmdcbiAgICB0aGlzLl9zZWxlY3RBTVBNKHRoaXMuX2NsYW1wZWRBY3RpdmVEYXRlKTtcbiAgICBpZiAoXG4gICAgICBvbGRBY3RpdmVEYXRlICYmXG4gICAgICB0aGlzLl9jbGFtcGVkQWN0aXZlRGF0ZSAmJlxuICAgICAgdGhpcy5jdXJyZW50VmlldyA9PT0gJ21vbnRoJyAmJlxuICAgICAgIXRoaXMuX2FkYXB0ZXIuc2FtZU1vbnRoQW5kWWVhcihvbGRBY3RpdmVEYXRlLCB0aGlzLl9jbGFtcGVkQWN0aXZlRGF0ZSlcbiAgICApIHtcbiAgICAgIGlmICh0aGlzLl9hZGFwdGVyLmlzSW5OZXh0TW9udGgob2xkQWN0aXZlRGF0ZSwgdGhpcy5fY2xhbXBlZEFjdGl2ZURhdGUpKSB7XG4gICAgICAgIHRoaXMuY2FsZW5kYXJTdGF0ZSgncmlnaHQnKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuY2FsZW5kYXJTdGF0ZSgnbGVmdCcpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKiBXaGV0aGVyIHRoZSBjYWxlbmRhciBpcyBpbiBtb250aCB2aWV3LiAqL1xuICBnZXQgY3VycmVudFZpZXcoKTogTXR4Q2FsZW5kYXJWaWV3IHtcbiAgICByZXR1cm4gdGhpcy5fY3VycmVudFZpZXc7XG4gIH1cbiAgc2V0IGN1cnJlbnRWaWV3KHZpZXc6IE10eENhbGVuZGFyVmlldykge1xuICAgIHRoaXMuX2N1cnJlbnRWaWV3ID0gdmlldztcbiAgICB0aGlzLnZpZXdDaGFuZ2VkLmVtaXQodmlldyk7XG4gIH1cbiAgcHJpdmF0ZSBfY3VycmVudFZpZXchOiBNdHhDYWxlbmRhclZpZXc7XG5cbiAgZ2V0IF95ZWFyUGVyaW9kVGV4dCgpOiBzdHJpbmcge1xuICAgIGlmICh0aGlzLmN1cnJlbnRWaWV3ID09PSAnbXVsdGkteWVhcicpIHtcbiAgICAgIC8vIFRoZSBvZmZzZXQgZnJvbSB0aGUgYWN0aXZlIHllYXIgdG8gdGhlIFwic2xvdFwiIGZvciB0aGUgc3RhcnRpbmcgeWVhciBpcyB0aGVcbiAgICAgIC8vICphY3R1YWwqIGZpcnN0IHJlbmRlcmVkIHllYXIgaW4gdGhlIG11bHRpLXllYXIgdmlldywgYW5kIHRoZSBsYXN0IHllYXIgaXNcbiAgICAgIC8vIGp1c3QgeWVhcnNQZXJQYWdlIC0gMSBhd2F5LlxuICAgICAgY29uc3QgYWN0aXZlWWVhciA9IHRoaXMuX2FkYXB0ZXIuZ2V0WWVhcih0aGlzLl9hY3RpdmVEYXRlKTtcbiAgICAgIGNvbnN0IG1pblllYXJPZlBhZ2UgPVxuICAgICAgICBhY3RpdmVZZWFyIC0gZ2V0QWN0aXZlT2Zmc2V0KHRoaXMuX2FkYXB0ZXIsIHRoaXMuX2FjdGl2ZURhdGUsIHRoaXMubWluRGF0ZSwgdGhpcy5tYXhEYXRlKTtcbiAgICAgIGNvbnN0IG1heFllYXJPZlBhZ2UgPSBtaW5ZZWFyT2ZQYWdlICsgeWVhcnNQZXJQYWdlIC0gMTtcbiAgICAgIGNvbnN0IG1pblllYXJOYW1lID0gdGhpcy5fYWRhcHRlci5nZXRZZWFyTmFtZSh0aGlzLl9hZGFwdGVyLmNyZWF0ZURhdGUobWluWWVhck9mUGFnZSwgMCwgMSkpO1xuICAgICAgY29uc3QgbWF4WWVhck5hbWUgPSB0aGlzLl9hZGFwdGVyLmdldFllYXJOYW1lKHRoaXMuX2FkYXB0ZXIuY3JlYXRlRGF0ZShtYXhZZWFyT2ZQYWdlLCAwLCAxKSk7XG4gICAgICByZXR1cm4gdGhpcy5faW50bC5mb3JtYXRZZWFyUmFuZ2UobWluWWVhck5hbWUsIG1heFllYXJOYW1lKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5jdXJyZW50VmlldyA9PT0gJ21vbnRoJ1xuICAgICAgPyB0aGlzLl9hZGFwdGVyLmdldE1vbnRoTmFtZXMoJ2xvbmcnKVt0aGlzLl9hZGFwdGVyLmdldE1vbnRoKHRoaXMuX2FjdGl2ZURhdGUpXVxuICAgICAgOiB0aGlzLl9hZGFwdGVyLmdldFllYXJOYW1lKHRoaXMuX2FjdGl2ZURhdGUpO1xuICB9XG5cbiAgZ2V0IF95ZWFyQnV0dG9uVGV4dCgpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLl9hZGFwdGVyLmdldFllYXJOYW1lKHRoaXMuX2FjdGl2ZURhdGUpO1xuICB9XG5cbiAgZ2V0IF95ZWFyQnV0dG9uTGFiZWwoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5tdWx0aVllYXJTZWxlY3RvclxuICAgICAgPyB0aGlzLl9pbnRsLnN3aXRjaFRvTXVsdGlZZWFyVmlld0xhYmVsXG4gICAgICA6IHRoaXMuX2ludGwuc3dpdGNoVG9ZZWFyVmlld0xhYmVsO1xuICB9XG5cbiAgZ2V0IF9kYXRlQnV0dG9uVGV4dCgpOiBzdHJpbmcge1xuICAgIHN3aXRjaCAodGhpcy50eXBlKSB7XG4gICAgICBjYXNlICdtb250aCc6XG4gICAgICAgIHJldHVybiB0aGlzLl9hZGFwdGVyLmdldE1vbnRoTmFtZXMoJ2xvbmcnKVt0aGlzLl9hZGFwdGVyLmdldE1vbnRoKHRoaXMuX2FjdGl2ZURhdGUpXTtcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybiB0aGlzLl9hZGFwdGVyLmZvcm1hdChcbiAgICAgICAgICB0aGlzLl9hY3RpdmVEYXRlLFxuICAgICAgICAgIHRoaXMuX2RhdGVGb3JtYXRzLmRpc3BsYXkucG9wdXBIZWFkZXJEYXRlTGFiZWxcbiAgICAgICAgKTtcbiAgICB9XG4gIH1cblxuICBnZXQgX2RhdGVCdXR0b25MYWJlbCgpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLl9pbnRsLnN3aXRjaFRvTW9udGhWaWV3TGFiZWw7XG4gIH1cblxuICBnZXQgX2hvdXJzQnV0dG9uVGV4dCgpOiBzdHJpbmcge1xuICAgIGxldCBob3VyID0gdGhpcy5fYWRhcHRlci5nZXRIb3VyKHRoaXMuX2FjdGl2ZURhdGUpO1xuICAgIGlmICh0aGlzLnR3ZWx2ZWhvdXIpIHtcbiAgICAgIGlmIChob3VyID09PSAwKSB7XG4gICAgICAgIGhvdXIgPSAyNDtcbiAgICAgIH1cbiAgICAgIGhvdXIgPSBob3VyID4gMTIgPyBob3VyIC0gMTIgOiBob3VyO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5fMmRpZ2l0KGhvdXIpO1xuICB9XG5cbiAgZ2V0IF9ob3VyQnV0dG9uTGFiZWwoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5faW50bC5zd2l0Y2hUb0Nsb2NrSG91clZpZXdMYWJlbDtcbiAgfVxuXG4gIGdldCBfbWludXRlc0J1dHRvblRleHQoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5fMmRpZ2l0KHRoaXMuX2FkYXB0ZXIuZ2V0TWludXRlKHRoaXMuX2FjdGl2ZURhdGUpKTtcbiAgfVxuXG4gIGdldCBfbWludXRlQnV0dG9uTGFiZWwoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5faW50bC5zd2l0Y2hUb0Nsb2NrTWludXRlVmlld0xhYmVsO1xuICB9XG5cbiAgZ2V0IF9wcmV2QnV0dG9uTGFiZWwoKTogc3RyaW5nIHtcbiAgICBzd2l0Y2ggKHRoaXMuX2N1cnJlbnRWaWV3KSB7XG4gICAgICBjYXNlICdtb250aCc6XG4gICAgICAgIHJldHVybiB0aGlzLl9pbnRsLnByZXZNb250aExhYmVsO1xuICAgICAgY2FzZSAneWVhcic6XG4gICAgICAgIHJldHVybiB0aGlzLl9pbnRsLnByZXZZZWFyTGFiZWw7XG4gICAgICBjYXNlICdtdWx0aS15ZWFyJzpcbiAgICAgICAgcmV0dXJuIHRoaXMuX2ludGwucHJldk11bHRpWWVhckxhYmVsO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmV0dXJuICcnO1xuICAgIH1cbiAgfVxuXG4gIGdldCBfbmV4dEJ1dHRvbkxhYmVsKCk6IHN0cmluZyB7XG4gICAgc3dpdGNoICh0aGlzLl9jdXJyZW50Vmlldykge1xuICAgICAgY2FzZSAnbW9udGgnOlxuICAgICAgICByZXR1cm4gdGhpcy5faW50bC5uZXh0TW9udGhMYWJlbDtcbiAgICAgIGNhc2UgJ3llYXInOlxuICAgICAgICByZXR1cm4gdGhpcy5faW50bC5uZXh0WWVhckxhYmVsO1xuICAgICAgY2FzZSAnbXVsdGkteWVhcic6XG4gICAgICAgIHJldHVybiB0aGlzLl9pbnRsLm5leHRNdWx0aVllYXJMYWJlbDtcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybiAnJztcbiAgICB9XG4gIH1cblxuICAvKiogRGF0ZSBmaWx0ZXIgZm9yIHRoZSBtb250aCBhbmQgeWVhciB2aWV3cy4gKi9cbiAgX2RhdGVGaWx0ZXJGb3JWaWV3cyA9IChkYXRlOiBEKSA9PiB7XG4gICAgcmV0dXJuIChcbiAgICAgICEhZGF0ZSAmJlxuICAgICAgKCF0aGlzLmRhdGVGaWx0ZXIgfHwgdGhpcy5kYXRlRmlsdGVyKGRhdGUsIE10eERhdGV0aW1lcGlja2VyRmlsdGVyVHlwZS5EQVRFKSkgJiZcbiAgICAgICghdGhpcy5taW5EYXRlIHx8IHRoaXMuX2FkYXB0ZXIuY29tcGFyZURhdGUoZGF0ZSwgdGhpcy5taW5EYXRlKSA+PSAwKSAmJlxuICAgICAgKCF0aGlzLm1heERhdGUgfHwgdGhpcy5fYWRhcHRlci5jb21wYXJlRGF0ZShkYXRlLCB0aGlzLm1heERhdGUpIDw9IDApXG4gICAgKTtcbiAgfTtcblxuICBfdXNlclNlbGVjdGVkKCk6IHZvaWQge1xuICAgIHRoaXMuX3VzZXJTZWxlY3Rpb24uZW1pdCgpO1xuICB9XG5cbiAgbmdBZnRlckNvbnRlbnRJbml0KCkge1xuICAgIHRoaXMuX2FjdGl2ZURhdGUgPSB0aGlzLnN0YXJ0QXQgfHwgdGhpcy5fYWRhcHRlci50b2RheSgpO1xuICAgIHRoaXMuX3NlbGVjdEFNUE0odGhpcy5fYWN0aXZlRGF0ZSk7XG5cbiAgICBpZiAodGhpcy50eXBlID09PSAneWVhcicpIHtcbiAgICAgIHRoaXMuY3VycmVudFZpZXcgPSAnbXVsdGkteWVhcic7XG4gICAgfSBlbHNlIGlmICh0aGlzLnR5cGUgPT09ICdtb250aCcpIHtcbiAgICAgIHRoaXMuY3VycmVudFZpZXcgPSAneWVhcic7XG4gICAgfSBlbHNlIGlmICh0aGlzLnR5cGUgPT09ICd0aW1lJykge1xuICAgICAgdGhpcy5jdXJyZW50VmlldyA9ICdjbG9jayc7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuY3VycmVudFZpZXcgPSB0aGlzLnN0YXJ0VmlldyB8fCAnbW9udGgnO1xuICAgIH1cbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMuX2ludGxDaGFuZ2VzLnVuc3Vic2NyaWJlKCk7XG4gIH1cblxuICAvKiogSGFuZGxlcyBkYXRlIHNlbGVjdGlvbiBpbiB0aGUgbW9udGggdmlldy4gKi9cbiAgX2RhdGVTZWxlY3RlZChkYXRlOiBEKTogdm9pZCB7XG4gICAgaWYgKHRoaXMudHlwZSA9PT0gJ2RhdGUnKSB7XG4gICAgICBpZiAoIXRoaXMuX2FkYXB0ZXIuc2FtZURhdGUoZGF0ZSwgdGhpcy5zZWxlY3RlZCkgfHwgIXRoaXMucHJldmVudFNhbWVEYXRlVGltZVNlbGVjdGlvbikge1xuICAgICAgICB0aGlzLnNlbGVjdGVkQ2hhbmdlLmVtaXQoZGF0ZSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX2FjdGl2ZURhdGUgPSBkYXRlO1xuICAgICAgdGhpcy5jdXJyZW50VmlldyA9ICdjbG9jayc7XG4gICAgfVxuICB9XG5cbiAgLyoqIEhhbmRsZXMgbW9udGggc2VsZWN0aW9uIGluIHRoZSB5ZWFyIHZpZXcuICovXG4gIF9tb250aFNlbGVjdGVkKG1vbnRoOiBEKTogdm9pZCB7XG4gICAgaWYgKHRoaXMudHlwZSA9PT0gJ21vbnRoJykge1xuICAgICAgaWYgKFxuICAgICAgICAhdGhpcy5fYWRhcHRlci5zYW1lTW9udGhBbmRZZWFyKG1vbnRoLCB0aGlzLnNlbGVjdGVkKSB8fFxuICAgICAgICAhdGhpcy5wcmV2ZW50U2FtZURhdGVUaW1lU2VsZWN0aW9uXG4gICAgICApIHtcbiAgICAgICAgdGhpcy5zZWxlY3RlZENoYW5nZS5lbWl0KHRoaXMuX2FkYXB0ZXIuZ2V0Rmlyc3REYXRlT2ZNb250aChtb250aCkpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9hY3RpdmVEYXRlID0gbW9udGg7XG4gICAgICB0aGlzLmN1cnJlbnRWaWV3ID0gJ21vbnRoJztcbiAgICAgIHRoaXMuX2Nsb2NrVmlldyA9ICdob3VyJztcbiAgICB9XG4gIH1cblxuICAvKiogSGFuZGxlcyB5ZWFyIHNlbGVjdGlvbiBpbiB0aGUgbXVsdGkgeWVhciB2aWV3LiAqL1xuICBfeWVhclNlbGVjdGVkKHllYXI6IEQpOiB2b2lkIHtcbiAgICBpZiAodGhpcy50eXBlID09PSAneWVhcicpIHtcbiAgICAgIGlmICghdGhpcy5fYWRhcHRlci5zYW1lWWVhcih5ZWFyLCB0aGlzLnNlbGVjdGVkIGFzIEQpIHx8ICF0aGlzLnByZXZlbnRTYW1lRGF0ZVRpbWVTZWxlY3Rpb24pIHtcbiAgICAgICAgY29uc3Qgbm9ybWFsaXplZERhdGUgPSB0aGlzLl9hZGFwdGVyLmNyZWF0ZURhdGV0aW1lKFxuICAgICAgICAgIHRoaXMuX2FkYXB0ZXIuZ2V0WWVhcih5ZWFyKSxcbiAgICAgICAgICAwLFxuICAgICAgICAgIDEsXG4gICAgICAgICAgMCxcbiAgICAgICAgICAwXG4gICAgICAgICk7XG4gICAgICAgIHRoaXMuc2VsZWN0ZWRDaGFuZ2UuZW1pdChub3JtYWxpemVkRGF0ZSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX2FjdGl2ZURhdGUgPSB5ZWFyO1xuICAgICAgdGhpcy5jdXJyZW50VmlldyA9ICd5ZWFyJztcbiAgICB9XG4gIH1cblxuICBfdGltZVNlbGVjdGVkKGRhdGU6IEQpIHtcbiAgICB0aGlzLl9hY3RpdmVEYXRlID0gdGhpcy5fdXBkYXRlRGF0ZShkYXRlKTtcbiAgICBpZiAoIXRoaXMuX2FkYXB0ZXIuc2FtZURhdGV0aW1lKGRhdGUsIHRoaXMuc2VsZWN0ZWQpIHx8ICF0aGlzLnByZXZlbnRTYW1lRGF0ZVRpbWVTZWxlY3Rpb24pIHtcbiAgICAgIHRoaXMuc2VsZWN0ZWRDaGFuZ2UuZW1pdChkYXRlKTtcbiAgICB9XG4gIH1cblxuICBfZGlhbFRpbWVTZWxlY3RlZChkYXRlOiBEKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuX2Nsb2NrVmlldyAhPT0gJ21pbnV0ZScpIHtcbiAgICAgIHRoaXMuX2FjdGl2ZURhdGUgPSB0aGlzLl91cGRhdGVEYXRlKGRhdGUpO1xuICAgICAgdGhpcy5fY2xvY2tWaWV3ID0gJ21pbnV0ZSc7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICghdGhpcy5fYWRhcHRlci5zYW1lRGF0ZXRpbWUoZGF0ZSwgdGhpcy5zZWxlY3RlZCkgfHwgIXRoaXMucHJldmVudFNhbWVEYXRlVGltZVNlbGVjdGlvbikge1xuICAgICAgICB0aGlzLnNlbGVjdGVkQ2hhbmdlLmVtaXQoZGF0ZSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgX29uQWN0aXZlRGF0ZUNoYW5nZShkYXRlOiBEKSB7XG4gICAgdGhpcy5fYWN0aXZlRGF0ZSA9IGRhdGU7XG4gIH1cblxuICBfdXBkYXRlRGF0ZShkYXRlOiBEKTogRCB7XG4gICAgaWYgKHRoaXMudHdlbHZlaG91cikge1xuICAgICAgY29uc3QgSE9VUiA9IHRoaXMuX2FkYXB0ZXIuZ2V0SG91cihkYXRlKTtcbiAgICAgIGlmIChIT1VSID09PSAxMikge1xuICAgICAgICBpZiAodGhpcy5fQU1QTSA9PT0gJ0FNJykge1xuICAgICAgICAgIHJldHVybiB0aGlzLl9hZGFwdGVyLmFkZENhbGVuZGFySG91cnMoZGF0ZSwgLTEyKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmICh0aGlzLl9BTVBNID09PSAnUE0nKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9hZGFwdGVyLmFkZENhbGVuZGFySG91cnMoZGF0ZSwgMTIpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZGF0ZTtcbiAgfVxuXG4gIF9zZWxlY3RBTVBNKGRhdGU6IEQpIHtcbiAgICBjb25zdCBob3VyID0gdGhpcy5fYWRhcHRlci5nZXRIb3VyKGRhdGUpO1xuICAgIGlmIChob3VyID4gMTEpIHtcbiAgICAgIHRoaXMuX0FNUE0gPSAnUE0nO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9BTVBNID0gJ0FNJztcbiAgICB9XG4gIH1cblxuICBfYW1wbUNsaWNrZWQoc291cmNlOiBNdHhBTVBNKTogdm9pZCB7XG4gICAgdGhpcy5fY3VycmVudFZpZXcgPSAnY2xvY2snO1xuXG4gICAgaWYgKHNvdXJjZSA9PT0gdGhpcy5fQU1QTSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIGlmIEFNUE0gY2hhbmdlZCBmcm9tIFBNIHRvIEFNIHN1YnN0cmFjdCAxMiBob3Vyc1xuICAgIGNvbnN0IGN1cnJlbnRIb3VyID0gdGhpcy5fYWRhcHRlci5nZXRIb3VyKHRoaXMuX2FjdGl2ZURhdGUpO1xuICAgIGxldCBuZXdIb3VyVmFsdWU7XG4gICAgaWYgKHNvdXJjZSA9PT0gJ0FNJykge1xuICAgICAgbmV3SG91clZhbHVlID0gY3VycmVudEhvdXIgPj0gMTIgPyB0aGlzLl9hZGFwdGVyLmdldEhvdXIodGhpcy5fYWN0aXZlRGF0ZSkgLSAxMiA6IDEyO1xuICAgIH1cbiAgICAvLyBvdGhlcndpc2UgYWRkIDEyIGhvdXJzXG4gICAgZWxzZSB7XG4gICAgICBuZXdIb3VyVmFsdWUgPSAoY3VycmVudEhvdXIgKyAxMikgJSAyNDtcbiAgICB9XG5cbiAgICBjb25zdCBuZXdBY3RpdmVEYXRlID0gdGhpcy5fYWRhcHRlci5jbGFtcERhdGUoXG4gICAgICB0aGlzLl9hZGFwdGVyLmNyZWF0ZURhdGV0aW1lKFxuICAgICAgICB0aGlzLl9hZGFwdGVyLmdldFllYXIodGhpcy5fYWN0aXZlRGF0ZSksXG4gICAgICAgIHRoaXMuX2FkYXB0ZXIuZ2V0TW9udGgodGhpcy5fYWN0aXZlRGF0ZSksXG4gICAgICAgIHRoaXMuX2FkYXB0ZXIuZ2V0RGF0ZSh0aGlzLl9hY3RpdmVEYXRlKSxcbiAgICAgICAgbmV3SG91clZhbHVlLFxuICAgICAgICB0aGlzLl9hZGFwdGVyLmdldE1pbnV0ZSh0aGlzLl9hY3RpdmVEYXRlKVxuICAgICAgKSxcbiAgICAgIHRoaXMubWluRGF0ZSxcbiAgICAgIHRoaXMubWF4RGF0ZVxuICAgICk7XG5cbiAgICAvLyBvbmx5IGlmIG91ciBjbGFtcGVkIGRhdGUgaXMgbm90IGNoYW5nZWQsIHdlIGtub3cgd2UgY2FuIGFwcGx5IHRoZSBuZXdBY3RpdmVEYXRlIHRvIHRoZVxuICAgIC8vIGFjdGl2ZURhdGVcbiAgICBpZiAodGhpcy5fYWRhcHRlci5nZXRIb3VyKG5ld0FjdGl2ZURhdGUpID09PSBuZXdIb3VyVmFsdWUpIHtcbiAgICAgIHRoaXMuX2FjdGl2ZURhdGUgPSBuZXdBY3RpdmVEYXRlO1xuICAgICAgdGhpcy5fQU1QTSA9IHNvdXJjZTtcbiAgICB9XG4gIH1cblxuICBfeWVhckNsaWNrZWQoKTogdm9pZCB7XG4gICAgaWYgKHRoaXMudHlwZSA9PT0gJ3llYXInIHx8IHRoaXMubXVsdGlZZWFyU2VsZWN0b3IpIHtcbiAgICAgIHRoaXMuY3VycmVudFZpZXcgPSAnbXVsdGkteWVhcic7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMuY3VycmVudFZpZXcgPSAneWVhcic7XG4gIH1cblxuICBfZGF0ZUNsaWNrZWQoKTogdm9pZCB7XG4gICAgaWYgKHRoaXMudHlwZSAhPT0gJ21vbnRoJykge1xuICAgICAgdGhpcy5jdXJyZW50VmlldyA9ICdtb250aCc7XG4gICAgfVxuICB9XG5cbiAgX2hvdXJzQ2xpY2tlZCgpOiB2b2lkIHtcbiAgICB0aGlzLmN1cnJlbnRWaWV3ID0gJ2Nsb2NrJztcbiAgICB0aGlzLl9jbG9ja1ZpZXcgPSAnaG91cic7XG4gIH1cblxuICBfbWludXRlc0NsaWNrZWQoKTogdm9pZCB7XG4gICAgdGhpcy5jdXJyZW50VmlldyA9ICdjbG9jayc7XG4gICAgdGhpcy5fY2xvY2tWaWV3ID0gJ21pbnV0ZSc7XG4gIH1cblxuICAvKiogSGFuZGxlcyB1c2VyIGNsaWNrcyBvbiB0aGUgcHJldmlvdXMgYnV0dG9uLiAqL1xuICBfcHJldmlvdXNDbGlja2VkKCk6IHZvaWQge1xuICAgIHRoaXMuX2FjdGl2ZURhdGUgPVxuICAgICAgdGhpcy5jdXJyZW50VmlldyA9PT0gJ21vbnRoJ1xuICAgICAgICA/IHRoaXMuX2FkYXB0ZXIuYWRkQ2FsZW5kYXJNb250aHModGhpcy5fYWN0aXZlRGF0ZSwgLTEpXG4gICAgICAgIDogdGhpcy5fYWRhcHRlci5hZGRDYWxlbmRhclllYXJzKFxuICAgICAgICAgICAgdGhpcy5fYWN0aXZlRGF0ZSxcbiAgICAgICAgICAgIHRoaXMuY3VycmVudFZpZXcgPT09ICd5ZWFyJyA/IC0xIDogLXllYXJzUGVyUGFnZVxuICAgICAgICAgICk7XG4gIH1cblxuICAvKiogSGFuZGxlcyB1c2VyIGNsaWNrcyBvbiB0aGUgbmV4dCBidXR0b24uICovXG4gIF9uZXh0Q2xpY2tlZCgpOiB2b2lkIHtcbiAgICB0aGlzLl9hY3RpdmVEYXRlID1cbiAgICAgIHRoaXMuY3VycmVudFZpZXcgPT09ICdtb250aCdcbiAgICAgICAgPyB0aGlzLl9hZGFwdGVyLmFkZENhbGVuZGFyTW9udGhzKHRoaXMuX2FjdGl2ZURhdGUsIDEpXG4gICAgICAgIDogdGhpcy5fYWRhcHRlci5hZGRDYWxlbmRhclllYXJzKFxuICAgICAgICAgICAgdGhpcy5fYWN0aXZlRGF0ZSxcbiAgICAgICAgICAgIHRoaXMuY3VycmVudFZpZXcgPT09ICd5ZWFyJyA/IDEgOiB5ZWFyc1BlclBhZ2VcbiAgICAgICAgICApO1xuICB9XG5cbiAgLyoqIFdoZXRoZXIgdGhlIHByZXZpb3VzIHBlcmlvZCBidXR0b24gaXMgZW5hYmxlZC4gKi9cbiAgX3ByZXZpb3VzRW5hYmxlZCgpOiBib29sZWFuIHtcbiAgICBpZiAoIXRoaXMubWluRGF0ZSkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHJldHVybiAhdGhpcy5taW5EYXRlIHx8ICF0aGlzLl9pc1NhbWVWaWV3KHRoaXMuX2FjdGl2ZURhdGUsIHRoaXMubWluRGF0ZSk7XG4gIH1cblxuICAvKiogV2hldGhlciB0aGUgbmV4dCBwZXJpb2QgYnV0dG9uIGlzIGVuYWJsZWQuICovXG4gIF9uZXh0RW5hYmxlZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gIXRoaXMubWF4RGF0ZSB8fCAhdGhpcy5faXNTYW1lVmlldyh0aGlzLl9hY3RpdmVEYXRlLCB0aGlzLm1heERhdGUpO1xuICB9XG5cbiAgLyoqIEhhbmRsZXMga2V5ZG93biBldmVudHMgb24gdGhlIGNhbGVuZGFyIGJvZHkuICovXG4gIF9oYW5kbGVDYWxlbmRhckJvZHlLZXlkb3duKGV2ZW50OiBLZXlib2FyZEV2ZW50KTogdm9pZCB7XG4gICAgLy8gVE9ETyhtbWFsZXJiYSk6IFdlIGN1cnJlbnRseSBhbGxvdyBrZXlib2FyZCBuYXZpZ2F0aW9uIHRvIGRpc2FibGVkIGRhdGVzLCBidXQganVzdCBwcmV2ZW50XG4gICAgLy8gZGlzYWJsZWQgb25lcyBmcm9tIGJlaW5nIHNlbGVjdGVkLiBUaGlzIG1heSBub3QgYmUgaWRlYWwsIHdlIHNob3VsZCBsb29rIGludG8gd2hldGhlclxuICAgIC8vIG5hdmlnYXRpb24gc2hvdWxkIHNraXAgb3ZlciBkaXNhYmxlZCBkYXRlcywgYW5kIGlmIHNvLCBob3cgdG8gaW1wbGVtZW50IHRoYXQgZWZmaWNpZW50bHkuXG4gICAgaWYgKHRoaXMuY3VycmVudFZpZXcgPT09ICdtb250aCcpIHtcbiAgICAgIHRoaXMuX2hhbmRsZUNhbGVuZGFyQm9keUtleWRvd25Jbk1vbnRoVmlldyhldmVudCk7XG4gICAgfSBlbHNlIGlmICh0aGlzLmN1cnJlbnRWaWV3ID09PSAneWVhcicpIHtcbiAgICAgIHRoaXMuX2hhbmRsZUNhbGVuZGFyQm9keUtleWRvd25JblllYXJWaWV3KGV2ZW50KTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuY3VycmVudFZpZXcgPT09ICdtdWx0aS15ZWFyJykge1xuICAgICAgdGhpcy5faGFuZGxlQ2FsZW5kYXJCb2R5S2V5ZG93bkluTXVsdGlZZWFyVmlldyhldmVudCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX2hhbmRsZUNhbGVuZGFyQm9keUtleWRvd25JbkNsb2NrVmlldyhldmVudCk7XG4gICAgfVxuICB9XG5cbiAgX2ZvY3VzQWN0aXZlQ2VsbCgpIHtcbiAgICB0aGlzLl9uZ1pvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xuICAgICAgdGhpcy5fbmdab25lLm9uU3RhYmxlXG4gICAgICAgIC5hc09ic2VydmFibGUoKVxuICAgICAgICAucGlwZShmaXJzdCgpKVxuICAgICAgICAuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgICB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuZm9jdXMoKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICBfY2FsZW5kYXJTdGF0ZURvbmUoKSB7XG4gICAgdGhpcy5fY2FsZW5kYXJTdGF0ZSA9ICcnO1xuICB9XG5cbiAgLyoqIFdoZXRoZXIgdGhlIHR3byBkYXRlcyByZXByZXNlbnQgdGhlIHNhbWUgdmlldyBpbiB0aGUgY3VycmVudCB2aWV3IG1vZGUgKG1vbnRoIG9yIHllYXIpLiAqL1xuICBwcml2YXRlIF9pc1NhbWVWaWV3KGRhdGUxOiBELCBkYXRlMjogRCk6IGJvb2xlYW4ge1xuICAgIGlmICh0aGlzLmN1cnJlbnRWaWV3ID09PSAnbW9udGgnKSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICB0aGlzLl9hZGFwdGVyLmdldFllYXIoZGF0ZTEpID09PSB0aGlzLl9hZGFwdGVyLmdldFllYXIoZGF0ZTIpICYmXG4gICAgICAgIHRoaXMuX2FkYXB0ZXIuZ2V0TW9udGgoZGF0ZTEpID09PSB0aGlzLl9hZGFwdGVyLmdldE1vbnRoKGRhdGUyKVxuICAgICAgKTtcbiAgICB9XG4gICAgaWYgKHRoaXMuY3VycmVudFZpZXcgPT09ICd5ZWFyJykge1xuICAgICAgcmV0dXJuIHRoaXMuX2FkYXB0ZXIuZ2V0WWVhcihkYXRlMSkgPT09IHRoaXMuX2FkYXB0ZXIuZ2V0WWVhcihkYXRlMik7XG4gICAgfVxuICAgIC8vIE90aGVyd2lzZSB3ZSBhcmUgaW4gJ211bHRpLXllYXInIHZpZXcuXG4gICAgcmV0dXJuIGlzU2FtZU11bHRpWWVhclZpZXcodGhpcy5fYWRhcHRlciwgZGF0ZTEsIGRhdGUyLCB0aGlzLm1pbkRhdGUsIHRoaXMubWF4RGF0ZSk7XG4gIH1cblxuICAvKiogSGFuZGxlcyBrZXlkb3duIGV2ZW50cyBvbiB0aGUgY2FsZW5kYXIgYm9keSB3aGVuIGNhbGVuZGFyIGlzIGluIG1vbnRoIHZpZXcuICovXG4gIHByaXZhdGUgX2hhbmRsZUNhbGVuZGFyQm9keUtleWRvd25Jbk1vbnRoVmlldyhldmVudDogS2V5Ym9hcmRFdmVudCk6IHZvaWQge1xuICAgIHN3aXRjaCAoZXZlbnQua2V5Q29kZSkge1xuICAgICAgY2FzZSBMRUZUX0FSUk9XOlxuICAgICAgICB0aGlzLl9hY3RpdmVEYXRlID0gdGhpcy5fYWRhcHRlci5hZGRDYWxlbmRhckRheXModGhpcy5fYWN0aXZlRGF0ZSwgLTEpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgUklHSFRfQVJST1c6XG4gICAgICAgIHRoaXMuX2FjdGl2ZURhdGUgPSB0aGlzLl9hZGFwdGVyLmFkZENhbGVuZGFyRGF5cyh0aGlzLl9hY3RpdmVEYXRlLCAxKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFVQX0FSUk9XOlxuICAgICAgICB0aGlzLl9hY3RpdmVEYXRlID0gdGhpcy5fYWRhcHRlci5hZGRDYWxlbmRhckRheXModGhpcy5fYWN0aXZlRGF0ZSwgLTcpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgRE9XTl9BUlJPVzpcbiAgICAgICAgdGhpcy5fYWN0aXZlRGF0ZSA9IHRoaXMuX2FkYXB0ZXIuYWRkQ2FsZW5kYXJEYXlzKHRoaXMuX2FjdGl2ZURhdGUsIDcpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgSE9NRTpcbiAgICAgICAgdGhpcy5fYWN0aXZlRGF0ZSA9IHRoaXMuX2FkYXB0ZXIuYWRkQ2FsZW5kYXJEYXlzKFxuICAgICAgICAgIHRoaXMuX2FjdGl2ZURhdGUsXG4gICAgICAgICAgMSAtIHRoaXMuX2FkYXB0ZXIuZ2V0RGF0ZSh0aGlzLl9hY3RpdmVEYXRlKVxuICAgICAgICApO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgRU5EOlxuICAgICAgICB0aGlzLl9hY3RpdmVEYXRlID0gdGhpcy5fYWRhcHRlci5hZGRDYWxlbmRhckRheXMoXG4gICAgICAgICAgdGhpcy5fYWN0aXZlRGF0ZSxcbiAgICAgICAgICB0aGlzLl9hZGFwdGVyLmdldE51bURheXNJbk1vbnRoKHRoaXMuX2FjdGl2ZURhdGUpIC1cbiAgICAgICAgICAgIHRoaXMuX2FkYXB0ZXIuZ2V0RGF0ZSh0aGlzLl9hY3RpdmVEYXRlKVxuICAgICAgICApO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgUEFHRV9VUDpcbiAgICAgICAgdGhpcy5fYWN0aXZlRGF0ZSA9IGV2ZW50LmFsdEtleVxuICAgICAgICAgID8gdGhpcy5fYWRhcHRlci5hZGRDYWxlbmRhclllYXJzKHRoaXMuX2FjdGl2ZURhdGUsIC0xKVxuICAgICAgICAgIDogdGhpcy5fYWRhcHRlci5hZGRDYWxlbmRhck1vbnRocyh0aGlzLl9hY3RpdmVEYXRlLCAtMSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBQQUdFX0RPV046XG4gICAgICAgIHRoaXMuX2FjdGl2ZURhdGUgPSBldmVudC5hbHRLZXlcbiAgICAgICAgICA/IHRoaXMuX2FkYXB0ZXIuYWRkQ2FsZW5kYXJZZWFycyh0aGlzLl9hY3RpdmVEYXRlLCAxKVxuICAgICAgICAgIDogdGhpcy5fYWRhcHRlci5hZGRDYWxlbmRhck1vbnRocyh0aGlzLl9hY3RpdmVEYXRlLCAxKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIEVOVEVSOlxuICAgICAgICBpZiAodGhpcy5fZGF0ZUZpbHRlckZvclZpZXdzKHRoaXMuX2FjdGl2ZURhdGUpKSB7XG4gICAgICAgICAgdGhpcy5fZGF0ZVNlbGVjdGVkKHRoaXMuX2FjdGl2ZURhdGUpO1xuICAgICAgICAgIC8vIFByZXZlbnQgdW5leHBlY3RlZCBkZWZhdWx0IGFjdGlvbnMgc3VjaCBhcyBmb3JtIHN1Ym1pc3Npb24uXG4gICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm47XG4gICAgICBkZWZhdWx0OlxuICAgICAgICAvLyBEb24ndCBwcmV2ZW50IGRlZmF1bHQgb3IgZm9jdXMgYWN0aXZlIGNlbGwgb24ga2V5cyB0aGF0IHdlIGRvbid0IGV4cGxpY2l0bHkgaGFuZGxlLlxuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gUHJldmVudCB1bmV4cGVjdGVkIGRlZmF1bHQgYWN0aW9ucyBzdWNoIGFzIGZvcm0gc3VibWlzc2lvbi5cbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICB9XG5cbiAgLyoqIEhhbmRsZXMga2V5ZG93biBldmVudHMgb24gdGhlIGNhbGVuZGFyIGJvZHkgd2hlbiBjYWxlbmRhciBpcyBpbiB5ZWFyIHZpZXcuICovXG4gIHByaXZhdGUgX2hhbmRsZUNhbGVuZGFyQm9keUtleWRvd25JblllYXJWaWV3KGV2ZW50OiBLZXlib2FyZEV2ZW50KTogdm9pZCB7XG4gICAgc3dpdGNoIChldmVudC5rZXlDb2RlKSB7XG4gICAgICBjYXNlIExFRlRfQVJST1c6XG4gICAgICAgIHRoaXMuX2FjdGl2ZURhdGUgPSB0aGlzLl9hZGFwdGVyLmFkZENhbGVuZGFyTW9udGhzKHRoaXMuX2FjdGl2ZURhdGUsIC0xKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFJJR0hUX0FSUk9XOlxuICAgICAgICB0aGlzLl9hY3RpdmVEYXRlID0gdGhpcy5fYWRhcHRlci5hZGRDYWxlbmRhck1vbnRocyh0aGlzLl9hY3RpdmVEYXRlLCAxKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFVQX0FSUk9XOlxuICAgICAgICB0aGlzLl9hY3RpdmVEYXRlID0gdGhpcy5fcHJldk1vbnRoSW5TYW1lQ29sKHRoaXMuX2FjdGl2ZURhdGUpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgRE9XTl9BUlJPVzpcbiAgICAgICAgdGhpcy5fYWN0aXZlRGF0ZSA9IHRoaXMuX25leHRNb250aEluU2FtZUNvbCh0aGlzLl9hY3RpdmVEYXRlKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIEhPTUU6XG4gICAgICAgIHRoaXMuX2FjdGl2ZURhdGUgPSB0aGlzLl9hZGFwdGVyLmFkZENhbGVuZGFyTW9udGhzKFxuICAgICAgICAgIHRoaXMuX2FjdGl2ZURhdGUsXG4gICAgICAgICAgLXRoaXMuX2FkYXB0ZXIuZ2V0TW9udGgodGhpcy5fYWN0aXZlRGF0ZSlcbiAgICAgICAgKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIEVORDpcbiAgICAgICAgdGhpcy5fYWN0aXZlRGF0ZSA9IHRoaXMuX2FkYXB0ZXIuYWRkQ2FsZW5kYXJNb250aHMoXG4gICAgICAgICAgdGhpcy5fYWN0aXZlRGF0ZSxcbiAgICAgICAgICAxMSAtIHRoaXMuX2FkYXB0ZXIuZ2V0TW9udGgodGhpcy5fYWN0aXZlRGF0ZSlcbiAgICAgICAgKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFBBR0VfVVA6XG4gICAgICAgIHRoaXMuX2FjdGl2ZURhdGUgPSB0aGlzLl9hZGFwdGVyLmFkZENhbGVuZGFyWWVhcnMoXG4gICAgICAgICAgdGhpcy5fYWN0aXZlRGF0ZSxcbiAgICAgICAgICBldmVudC5hbHRLZXkgPyAtMTAgOiAtMVxuICAgICAgICApO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgUEFHRV9ET1dOOlxuICAgICAgICB0aGlzLl9hY3RpdmVEYXRlID0gdGhpcy5fYWRhcHRlci5hZGRDYWxlbmRhclllYXJzKHRoaXMuX2FjdGl2ZURhdGUsIGV2ZW50LmFsdEtleSA/IDEwIDogMSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBFTlRFUjpcbiAgICAgICAgdGhpcy5fbW9udGhTZWxlY3RlZCh0aGlzLl9hY3RpdmVEYXRlKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICAvLyBEb24ndCBwcmV2ZW50IGRlZmF1bHQgb3IgZm9jdXMgYWN0aXZlIGNlbGwgb24ga2V5cyB0aGF0IHdlIGRvbid0IGV4cGxpY2l0bHkgaGFuZGxlLlxuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gUHJldmVudCB1bmV4cGVjdGVkIGRlZmF1bHQgYWN0aW9ucyBzdWNoIGFzIGZvcm0gc3VibWlzc2lvbi5cbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICB9XG5cbiAgLyoqIEhhbmRsZXMga2V5ZG93biBldmVudHMgb24gdGhlIGNhbGVuZGFyIGJvZHkgd2hlbiBjYWxlbmRhciBpcyBpbiBtdWx0aS15ZWFyIHZpZXcuICovXG4gIHByaXZhdGUgX2hhbmRsZUNhbGVuZGFyQm9keUtleWRvd25Jbk11bHRpWWVhclZpZXcoZXZlbnQ6IEtleWJvYXJkRXZlbnQpOiB2b2lkIHtcbiAgICBzd2l0Y2ggKGV2ZW50LmtleUNvZGUpIHtcbiAgICAgIGNhc2UgTEVGVF9BUlJPVzpcbiAgICAgICAgdGhpcy5fYWN0aXZlRGF0ZSA9IHRoaXMuX2FkYXB0ZXIuYWRkQ2FsZW5kYXJZZWFycyh0aGlzLl9hY3RpdmVEYXRlLCAtMSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBSSUdIVF9BUlJPVzpcbiAgICAgICAgdGhpcy5fYWN0aXZlRGF0ZSA9IHRoaXMuX2FkYXB0ZXIuYWRkQ2FsZW5kYXJZZWFycyh0aGlzLl9hY3RpdmVEYXRlLCAxKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFVQX0FSUk9XOlxuICAgICAgICB0aGlzLl9hY3RpdmVEYXRlID0gdGhpcy5fYWRhcHRlci5hZGRDYWxlbmRhclllYXJzKHRoaXMuX2FjdGl2ZURhdGUsIC15ZWFyc1BlclJvdyk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBET1dOX0FSUk9XOlxuICAgICAgICB0aGlzLl9hY3RpdmVEYXRlID0gdGhpcy5fYWRhcHRlci5hZGRDYWxlbmRhclllYXJzKHRoaXMuX2FjdGl2ZURhdGUsIHllYXJzUGVyUm93KTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIEhPTUU6XG4gICAgICAgIHRoaXMuX2FjdGl2ZURhdGUgPSB0aGlzLl9hZGFwdGVyLmFkZENhbGVuZGFyWWVhcnMoXG4gICAgICAgICAgdGhpcy5fYWN0aXZlRGF0ZSxcbiAgICAgICAgICAtZ2V0QWN0aXZlT2Zmc2V0KHRoaXMuX2FkYXB0ZXIsIHRoaXMuX2FjdGl2ZURhdGUsIHRoaXMubWluRGF0ZSwgdGhpcy5tYXhEYXRlKVxuICAgICAgICApO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgRU5EOlxuICAgICAgICB0aGlzLl9hY3RpdmVEYXRlID0gdGhpcy5fYWRhcHRlci5hZGRDYWxlbmRhclllYXJzKFxuICAgICAgICAgIHRoaXMuX2FjdGl2ZURhdGUsXG4gICAgICAgICAgeWVhcnNQZXJQYWdlIC1cbiAgICAgICAgICAgIGdldEFjdGl2ZU9mZnNldCh0aGlzLl9hZGFwdGVyLCB0aGlzLl9hY3RpdmVEYXRlLCB0aGlzLm1pbkRhdGUsIHRoaXMubWF4RGF0ZSkgLVxuICAgICAgICAgICAgMVxuICAgICAgICApO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgUEFHRV9VUDpcbiAgICAgICAgdGhpcy5fYWN0aXZlRGF0ZSA9IHRoaXMuX2FkYXB0ZXIuYWRkQ2FsZW5kYXJZZWFycyhcbiAgICAgICAgICB0aGlzLl9hY3RpdmVEYXRlLFxuICAgICAgICAgIGV2ZW50LmFsdEtleSA/IC15ZWFyc1BlclBhZ2UgKiAxMCA6IC15ZWFyc1BlclBhZ2VcbiAgICAgICAgKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFBBR0VfRE9XTjpcbiAgICAgICAgdGhpcy5fYWN0aXZlRGF0ZSA9IHRoaXMuX2FkYXB0ZXIuYWRkQ2FsZW5kYXJZZWFycyhcbiAgICAgICAgICB0aGlzLl9hY3RpdmVEYXRlLFxuICAgICAgICAgIGV2ZW50LmFsdEtleSA/IHllYXJzUGVyUGFnZSAqIDEwIDogeWVhcnNQZXJQYWdlXG4gICAgICAgICk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBFTlRFUjpcbiAgICAgICAgdGhpcy5feWVhclNlbGVjdGVkKHRoaXMuX2FjdGl2ZURhdGUpO1xuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIC8vIERvbid0IHByZXZlbnQgZGVmYXVsdCBvciBmb2N1cyBhY3RpdmUgY2VsbCBvbiBrZXlzIHRoYXQgd2UgZG9uJ3QgZXhwbGljaXRseSBoYW5kbGUuXG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gIH1cblxuICAvKiogSGFuZGxlcyBrZXlkb3duIGV2ZW50cyBvbiB0aGUgY2FsZW5kYXIgYm9keSB3aGVuIGNhbGVuZGFyIGlzIGluIG1vbnRoIHZpZXcuICovXG4gIHByaXZhdGUgX2hhbmRsZUNhbGVuZGFyQm9keUtleWRvd25JbkNsb2NrVmlldyhldmVudDogS2V5Ym9hcmRFdmVudCk6IHZvaWQge1xuICAgIHN3aXRjaCAoZXZlbnQua2V5Q29kZSkge1xuICAgICAgY2FzZSBVUF9BUlJPVzpcbiAgICAgICAgdGhpcy5fYWN0aXZlRGF0ZSA9XG4gICAgICAgICAgdGhpcy5fY2xvY2tWaWV3ID09PSAnaG91cidcbiAgICAgICAgICAgID8gdGhpcy5fYWRhcHRlci5hZGRDYWxlbmRhckhvdXJzKHRoaXMuX2FjdGl2ZURhdGUsIDEpXG4gICAgICAgICAgICA6IHRoaXMuX2FkYXB0ZXIuYWRkQ2FsZW5kYXJNaW51dGVzKHRoaXMuX2FjdGl2ZURhdGUsIHRoaXMudGltZUludGVydmFsKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIERPV05fQVJST1c6XG4gICAgICAgIHRoaXMuX2FjdGl2ZURhdGUgPVxuICAgICAgICAgIHRoaXMuX2Nsb2NrVmlldyA9PT0gJ2hvdXInXG4gICAgICAgICAgICA/IHRoaXMuX2FkYXB0ZXIuYWRkQ2FsZW5kYXJIb3Vycyh0aGlzLl9hY3RpdmVEYXRlLCAtMSlcbiAgICAgICAgICAgIDogdGhpcy5fYWRhcHRlci5hZGRDYWxlbmRhck1pbnV0ZXModGhpcy5fYWN0aXZlRGF0ZSwgLXRoaXMudGltZUludGVydmFsKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIEVOVEVSOlxuICAgICAgICBpZiAoIXRoaXMudGltZUlucHV0KSB7XG4gICAgICAgICAgdGhpcy5fZGlhbFRpbWVTZWxlY3RlZCh0aGlzLl9hY3RpdmVEYXRlKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm47XG4gICAgICBkZWZhdWx0OlxuICAgICAgICAvLyBEb24ndCBwcmV2ZW50IGRlZmF1bHQgb3IgZm9jdXMgYWN0aXZlIGNlbGwgb24ga2V5cyB0aGF0IHdlIGRvbid0IGV4cGxpY2l0bHkgaGFuZGxlLlxuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gUHJldmVudCB1bmV4cGVjdGVkIGRlZmF1bHQgYWN0aW9ucyBzdWNoIGFzIGZvcm0gc3VibWlzc2lvbi5cbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIERldGVybWluZSB0aGUgZGF0ZSBmb3IgdGhlIG1vbnRoIHRoYXQgY29tZXMgYmVmb3JlIHRoZSBnaXZlbiBtb250aCBpbiB0aGUgc2FtZSBjb2x1bW4gaW4gdGhlXG4gICAqIGNhbGVuZGFyIHRhYmxlLlxuICAgKi9cbiAgcHJpdmF0ZSBfcHJldk1vbnRoSW5TYW1lQ29sKGRhdGU6IEQpOiBEIHtcbiAgICAvLyBEZXRlcm1pbmUgaG93IG1hbnkgbW9udGhzIHRvIGp1bXAgZm9yd2FyZCBnaXZlbiB0aGF0IHRoZXJlIGFyZSAyIGVtcHR5IHNsb3RzIGF0IHRoZSBiZWdpbm5pbmdcbiAgICAvLyBvZiBlYWNoIHllYXIuXG4gICAgY29uc3QgaW5jcmVtZW50ID1cbiAgICAgIHRoaXMuX2FkYXB0ZXIuZ2V0TW9udGgoZGF0ZSkgPD0gNCA/IC01IDogdGhpcy5fYWRhcHRlci5nZXRNb250aChkYXRlKSA+PSA3ID8gLTcgOiAtMTI7XG4gICAgcmV0dXJuIHRoaXMuX2FkYXB0ZXIuYWRkQ2FsZW5kYXJNb250aHMoZGF0ZSwgaW5jcmVtZW50KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEZXRlcm1pbmUgdGhlIGRhdGUgZm9yIHRoZSBtb250aCB0aGF0IGNvbWVzIGFmdGVyIHRoZSBnaXZlbiBtb250aCBpbiB0aGUgc2FtZSBjb2x1bW4gaW4gdGhlXG4gICAqIGNhbGVuZGFyIHRhYmxlLlxuICAgKi9cbiAgcHJpdmF0ZSBfbmV4dE1vbnRoSW5TYW1lQ29sKGRhdGU6IEQpOiBEIHtcbiAgICAvLyBEZXRlcm1pbmUgaG93IG1hbnkgbW9udGhzIHRvIGp1bXAgZm9yd2FyZCBnaXZlbiB0aGF0IHRoZXJlIGFyZSAyIGVtcHR5IHNsb3RzIGF0IHRoZSBiZWdpbm5pbmdcbiAgICAvLyBvZiBlYWNoIHllYXIuXG4gICAgY29uc3QgaW5jcmVtZW50ID1cbiAgICAgIHRoaXMuX2FkYXB0ZXIuZ2V0TW9udGgoZGF0ZSkgPD0gNCA/IDcgOiB0aGlzLl9hZGFwdGVyLmdldE1vbnRoKGRhdGUpID49IDcgPyA1IDogMTI7XG4gICAgcmV0dXJuIHRoaXMuX2FkYXB0ZXIuYWRkQ2FsZW5kYXJNb250aHMoZGF0ZSwgaW5jcmVtZW50KTtcbiAgfVxuXG4gIHByaXZhdGUgY2FsZW5kYXJTdGF0ZShkaXJlY3Rpb246IHN0cmluZyk6IHZvaWQge1xuICAgIHRoaXMuX2NhbGVuZGFyU3RhdGUgPSBkaXJlY3Rpb247XG4gIH1cblxuICBwcml2YXRlIF8yZGlnaXQobjogbnVtYmVyKSB7XG4gICAgcmV0dXJuICgnMDAnICsgbikuc2xpY2UoLTIpO1xuICB9XG5cbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX211bHRpWWVhclNlbGVjdG9yOiBCb29sZWFuSW5wdXQ7XG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV90d2VsdmVob3VyOiBCb29sZWFuSW5wdXQ7XG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV90aW1lSW5wdXQ6IEJvb2xlYW5JbnB1dDtcbn1cbiIsIjxkaXYgY2xhc3M9XCJtdHgtY2FsZW5kYXItaGVhZGVyXCI+XG4gIDxidXR0b24gKm5nSWY9XCJ0eXBlICE9PSAndGltZSdcIlxuICAgICAgICAgIG1hdC1idXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwibXR4LWNhbGVuZGFyLWhlYWRlci15ZWFyXCJcbiAgICAgICAgICBbY2xhc3MuYWN0aXZlXT1cImN1cnJlbnRWaWV3ID09PSAneWVhcicgfHwgY3VycmVudFZpZXcgPT09ICdtdWx0aS15ZWFyJ1wiXG4gICAgICAgICAgW2F0dHIuYXJpYS1sYWJlbF09XCJfeWVhckJ1dHRvbkxhYmVsXCJcbiAgICAgICAgICAoY2xpY2spPVwiX3llYXJDbGlja2VkKClcIj5cbiAgICA8c3Bhbj57eyBfeWVhckJ1dHRvblRleHQgfX08L3NwYW4+XG4gICAgPHN2ZyAqbmdJZj1cIm11bHRpWWVhclNlbGVjdG9yIHx8IHR5cGUgPT09ICd5ZWFyJ1wiXG4gICAgICAgICBjbGFzcz1cIm10eC1jYWxlbmRhci1oZWFkZXIteWVhci1kcm9wZG93blwiIG1hdEJ1dHRvbkljb24gaWNvblBvc2l0aW9uRW5kXG4gICAgICAgICB3aWR0aD1cIjI0XCIgaGVpZ2h0PVwiMjRcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCIgZmlsbD1cImN1cnJlbnRDb2xvclwiPlxuICAgICAgPHBhdGggZD1cIk03LDEwTDEyLDE1TDE3LDEwSDdaXCI+PC9wYXRoPlxuICAgIDwvc3ZnPlxuICA8L2J1dHRvbj5cbiAgPGRpdiAqbmdJZj1cInR5cGUgIT09ICd5ZWFyJ1wiIGNsYXNzPVwibXR4LWNhbGVuZGFyLWhlYWRlci1kYXRlLXRpbWVcIj5cbiAgICA8YnV0dG9uICpuZ0lmPVwidHlwZSAhPT0gJ3RpbWUnXCJcbiAgICAgICAgICAgIG1hdC1idXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwibXR4LWNhbGVuZGFyLWhlYWRlci1kYXRlXCJcbiAgICAgICAgICAgIFtjbGFzcy5hY3RpdmVdPVwiY3VycmVudFZpZXcgPT09ICdtb250aCdcIlxuICAgICAgICAgICAgW2NsYXNzLm5vdC1jbGlja2FibGVdPVwidHlwZSA9PT0gJ21vbnRoJ1wiXG4gICAgICAgICAgICBbYXR0ci5hcmlhLWxhYmVsXT1cIl9kYXRlQnV0dG9uTGFiZWxcIlxuICAgICAgICAgICAgKGNsaWNrKT1cIl9kYXRlQ2xpY2tlZCgpXCI+e3sgX2RhdGVCdXR0b25UZXh0IH19PC9idXR0b24+XG4gICAgPHNwYW4gKm5nSWY9XCJ0eXBlLmVuZHNXaXRoKCd0aW1lJylcIiBjbGFzcz1cIm10eC1jYWxlbmRhci1oZWFkZXItdGltZVwiXG4gICAgICAgICAgW2NsYXNzLmFjdGl2ZV09XCJjdXJyZW50VmlldyA9PT0gJ2Nsb2NrJ1wiPlxuICAgICAgPHNwYW4gY2xhc3M9XCJtdHgtY2FsZW5kYXItaGVhZGVyLWhvdXItbWludXRlLWNvbnRhaW5lclwiPlxuICAgICAgICA8YnV0dG9uIG1hdC1idXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwibXR4LWNhbGVuZGFyLWhlYWRlci1ob3Vyc1wiXG4gICAgICAgICAgICAgICAgW2NsYXNzLmFjdGl2ZV09XCJfY2xvY2tWaWV3ID09PSAnaG91cidcIlxuICAgICAgICAgICAgICAgIFthdHRyLmFyaWEtbGFiZWxdPVwiX2hvdXJCdXR0b25MYWJlbFwiXG4gICAgICAgICAgICAgICAgKGNsaWNrKT1cIl9ob3Vyc0NsaWNrZWQoKVwiPnt7IF9ob3Vyc0J1dHRvblRleHQgfX08L2J1dHRvbj5cbiAgICAgICAgPHNwYW4gY2xhc3M9XCJtdHgtY2FsZW5kYXItaGVhZGVyLWhvdXItbWludXRlLXNlcGFyYXRvclwiPjo8L3NwYW4+XG4gICAgICAgIDxidXR0b24gbWF0LWJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJtdHgtY2FsZW5kYXItaGVhZGVyLW1pbnV0ZXNcIlxuICAgICAgICAgICAgICAgIFtjbGFzcy5hY3RpdmVdPVwiX2Nsb2NrVmlldyA9PT0gJ21pbnV0ZSdcIlxuICAgICAgICAgICAgICAgIFthdHRyLmFyaWEtbGFiZWxdPVwiX21pbnV0ZUJ1dHRvbkxhYmVsXCJcbiAgICAgICAgICAgICAgICAoY2xpY2spPVwiX21pbnV0ZXNDbGlja2VkKClcIj57eyBfbWludXRlc0J1dHRvblRleHQgfX08L2J1dHRvbj5cbiAgICAgIDwvc3Bhbj5cbiAgICAgIDxzcGFuICpuZ0lmPVwidHdlbHZlaG91clwiIGNsYXNzPVwibXR4LWNhbGVuZGFyLWhlYWRlci1hbXBtLWNvbnRhaW5lclwiPlxuICAgICAgICA8YnV0dG9uIG1hdC1idXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwibXR4LWNhbGVuZGFyLWhlYWRlci1hbXBtXCJcbiAgICAgICAgICAgICAgICBbY2xhc3MuYWN0aXZlXT1cIl9BTVBNID09PSAnQU0nXCIgYXJpYS1sYWJlbD1cIkFNXCJcbiAgICAgICAgICAgICAgICAoY2xpY2spPVwiX2FtcG1DbGlja2VkKCdBTScpXCI+QU08L2J1dHRvbj5cbiAgICAgICAgPGJ1dHRvbiBtYXQtYnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cIm10eC1jYWxlbmRhci1oZWFkZXItYW1wbVwiXG4gICAgICAgICAgICAgICAgW2NsYXNzLmFjdGl2ZV09XCJfQU1QTSA9PT0gJ1BNJ1wiIGFyaWEtbGFiZWw9XCJQTVwiXG4gICAgICAgICAgICAgICAgKGNsaWNrKT1cIl9hbXBtQ2xpY2tlZCgnUE0nKVwiPlBNPC9idXR0b24+XG4gICAgICA8L3NwYW4+XG4gICAgPC9zcGFuPlxuICA8L2Rpdj5cbjwvZGl2PlxuXG48ZGl2IGNsYXNzPVwibXR4LWNhbGVuZGFyLWNvbnRlbnRcIiBbbmdTd2l0Y2hdPVwiY3VycmVudFZpZXdcIj5cbiAgPGRpdiAqbmdJZj1cImN1cnJlbnRWaWV3ID09PSAnbW9udGgnIHx8IGN1cnJlbnRWaWV3ID09PSAneWVhcicgfHwgY3VycmVudFZpZXcgPT09ICdtdWx0aS15ZWFyJ1wiXG4gICAgICAgY2xhc3M9XCJtdHgtbW9udGgtY29udGVudFwiPlxuICAgIDxkaXYgY2xhc3M9XCJtdHgtY2FsZW5kYXItY29udHJvbHNcIj5cbiAgICAgIDxidXR0b24gbWF0LWljb24tYnV0dG9uIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgICAgICBjbGFzcz1cIm10eC1jYWxlbmRhci1wcmV2aW91cy1idXR0b25cIlxuICAgICAgICAgICAgICBbY2xhc3MuZGlzYWJsZWRdPVwiIV9wcmV2aW91c0VuYWJsZWQoKVwiXG4gICAgICAgICAgICAgIFthdHRyLmFyaWEtZGlzYWJsZWRdPVwiIV9wcmV2aW91c0VuYWJsZWQoKVwiXG4gICAgICAgICAgICAgIFthdHRyLmFyaWEtbGFiZWxdPVwiX3ByZXZCdXR0b25MYWJlbFwiXG4gICAgICAgICAgICAgIChjbGljayk9XCJfcHJldmlvdXNDbGlja2VkKClcIj5cbiAgICAgICAgPHN2ZyB3aWR0aD1cIjI0XCIgaGVpZ2h0PVwiMjRcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCI+XG4gICAgICAgICAgPHBhdGggZD1cIk0xNS40MSA3LjQxTDE0IDZsLTYgNiA2IDYgMS40MS0xLjQxTDEwLjgzIDEyelwiPjwvcGF0aD5cbiAgICAgICAgPC9zdmc+XG4gICAgICA8L2J1dHRvbj5cbiAgICAgIDxkaXYgY2xhc3M9XCJtdHgtY2FsZW5kYXItcGVyaW9kLWJ1dHRvblwiXG4gICAgICAgICAgIFtAc2xpZGVDYWxlbmRhcl09XCJfY2FsZW5kYXJTdGF0ZVwiXG4gICAgICAgICAgIChAc2xpZGVDYWxlbmRhci5kb25lKT1cIl9jYWxlbmRhclN0YXRlRG9uZSgpXCI+XG4gICAgICAgIDxzdHJvbmc+e3sgX3llYXJQZXJpb2RUZXh0IH19PC9zdHJvbmc+XG4gICAgICA8L2Rpdj5cbiAgICAgIDxidXR0b24gbWF0LWljb24tYnV0dG9uIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgICAgICBjbGFzcz1cIm10eC1jYWxlbmRhci1uZXh0LWJ1dHRvblwiXG4gICAgICAgICAgICAgIFtjbGFzcy5kaXNhYmxlZF09XCIhX25leHRFbmFibGVkKClcIlxuICAgICAgICAgICAgICBbYXR0ci5hcmlhLWRpc2FibGVkXT1cIiFfbmV4dEVuYWJsZWQoKVwiXG4gICAgICAgICAgICAgIFthdHRyLmFyaWEtbGFiZWxdPVwiX25leHRCdXR0b25MYWJlbFwiXG4gICAgICAgICAgICAgIChjbGljayk9XCJfbmV4dENsaWNrZWQoKVwiPlxuICAgICAgICA8c3ZnIHdpZHRoPVwiMjRcIiBoZWlnaHQ9XCIyNFwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIj5cbiAgICAgICAgICA8cGF0aCBkPVwiTTEwIDZMOC41OSA3LjQxIDEzLjE3IDEybC00LjU4IDQuNTlMMTAgMThsNi02elwiPjwvcGF0aD5cbiAgICAgICAgPC9zdmc+XG4gICAgICA8L2J1dHRvbj5cbiAgICA8L2Rpdj5cbiAgPC9kaXY+XG4gIDxtdHgtbW9udGgtdmlldyAqbmdTd2l0Y2hDYXNlPVwiJ21vbnRoJ1wiXG4gICAgICAgICAgICAgICAgICAoX3VzZXJTZWxlY3Rpb24pPVwiX3VzZXJTZWxlY3RlZCgpXCJcbiAgICAgICAgICAgICAgICAgIChzZWxlY3RlZENoYW5nZSk9XCJfZGF0ZVNlbGVjdGVkKCRldmVudClcIlxuICAgICAgICAgICAgICAgICAgW2FjdGl2ZURhdGVdPVwiX2FjdGl2ZURhdGVcIlxuICAgICAgICAgICAgICAgICAgW2RhdGVGaWx0ZXJdPVwiX2RhdGVGaWx0ZXJGb3JWaWV3c1wiXG4gICAgICAgICAgICAgICAgICBbc2VsZWN0ZWRdPVwic2VsZWN0ZWQhXCJcbiAgICAgICAgICAgICAgICAgIFt0eXBlXT1cInR5cGVcIj5cbiAgPC9tdHgtbW9udGgtdmlldz5cbiAgPG10eC15ZWFyLXZpZXcgKm5nU3dpdGNoQ2FzZT1cIid5ZWFyJ1wiXG4gICAgICAgICAgICAgICAgIChfdXNlclNlbGVjdGlvbik9XCJfdXNlclNlbGVjdGVkKClcIlxuICAgICAgICAgICAgICAgICAoc2VsZWN0ZWRDaGFuZ2UpPVwiX21vbnRoU2VsZWN0ZWQoJGV2ZW50KVwiXG4gICAgICAgICAgICAgICAgIFthY3RpdmVEYXRlXT1cIl9hY3RpdmVEYXRlXCJcbiAgICAgICAgICAgICAgICAgW2RhdGVGaWx0ZXJdPVwiX2RhdGVGaWx0ZXJGb3JWaWV3c1wiXG4gICAgICAgICAgICAgICAgIFtzZWxlY3RlZF09XCJzZWxlY3RlZCFcIlxuICAgICAgICAgICAgICAgICBbdHlwZV09XCJ0eXBlXCI+XG4gIDwvbXR4LXllYXItdmlldz5cbiAgPG10eC1tdWx0aS15ZWFyLXZpZXcgKm5nU3dpdGNoQ2FzZT1cIidtdWx0aS15ZWFyJ1wiXG4gICAgICAgICAgICAgICAgICAgICAgIChfdXNlclNlbGVjdGlvbik9XCJfdXNlclNlbGVjdGVkKClcIlxuICAgICAgICAgICAgICAgICAgICAgICAoc2VsZWN0ZWRDaGFuZ2UpPVwiX3llYXJTZWxlY3RlZCgkZXZlbnQpXCJcbiAgICAgICAgICAgICAgICAgICAgICAgW2FjdGl2ZURhdGVdPVwiX2FjdGl2ZURhdGVcIlxuICAgICAgICAgICAgICAgICAgICAgICBbZGF0ZUZpbHRlcl09XCJfZGF0ZUZpbHRlckZvclZpZXdzXCJcbiAgICAgICAgICAgICAgICAgICAgICAgW21heERhdGVdPVwibWF4RGF0ZVwiXG4gICAgICAgICAgICAgICAgICAgICAgIFttaW5EYXRlXT1cIm1pbkRhdGVcIlxuICAgICAgICAgICAgICAgICAgICAgICBbc2VsZWN0ZWRdPVwic2VsZWN0ZWQhXCJcbiAgICAgICAgICAgICAgICAgICAgICAgW3R5cGVdPVwidHlwZVwiPlxuICA8L210eC1tdWx0aS15ZWFyLXZpZXc+XG5cbiAgPG5nLWNvbnRhaW5lciAqbmdTd2l0Y2hEZWZhdWx0PlxuICAgIDxtdHgtdGltZSAqbmdJZj1cInRpbWVJbnB1dDsgZWxzZSBjbG9ja1wiXG4gICAgICAgICAgICAgIChfdXNlclNlbGVjdGlvbik9XCJfdXNlclNlbGVjdGVkKClcIlxuICAgICAgICAgICAgICAoYWN0aXZlRGF0ZUNoYW5nZSk9XCJfb25BY3RpdmVEYXRlQ2hhbmdlKCRldmVudClcIlxuICAgICAgICAgICAgICAoc2VsZWN0ZWRDaGFuZ2UpPVwiX3RpbWVTZWxlY3RlZCgkZXZlbnQpXCJcbiAgICAgICAgICAgICAgW0FNUE1dPVwiX0FNUE1cIlxuICAgICAgICAgICAgICAoYW1wbUNoYW5nZSk9XCJfYW1wbUNsaWNrZWQoJGV2ZW50KVwiXG4gICAgICAgICAgICAgIFtjbG9ja1ZpZXddPVwiX2Nsb2NrVmlld1wiXG4gICAgICAgICAgICAgIChjbG9ja1ZpZXdDaGFuZ2UpPVwiX2Nsb2NrVmlldyA9ICRldmVudFwiXG4gICAgICAgICAgICAgIFt0d2VsdmVob3VyXT1cInR3ZWx2ZWhvdXJcIlxuICAgICAgICAgICAgICBbZGF0ZUZpbHRlcl09XCJkYXRlRmlsdGVyXCJcbiAgICAgICAgICAgICAgW2ludGVydmFsXT1cInRpbWVJbnRlcnZhbFwiXG4gICAgICAgICAgICAgIFttYXhEYXRlXT1cIm1heERhdGVcIlxuICAgICAgICAgICAgICBbbWluRGF0ZV09XCJtaW5EYXRlXCJcbiAgICAgICAgICAgICAgW3NlbGVjdGVkXT1cIl9hY3RpdmVEYXRlXCI+XG4gICAgPC9tdHgtdGltZT5cblxuICAgIDxuZy10ZW1wbGF0ZSAjY2xvY2s+XG4gICAgICA8bXR4LWNsb2NrIChfdXNlclNlbGVjdGlvbik9XCJfdXNlclNlbGVjdGVkKClcIlxuICAgICAgICAgICAgICAgICAoYWN0aXZlRGF0ZUNoYW5nZSk9XCJfb25BY3RpdmVEYXRlQ2hhbmdlKCRldmVudClcIlxuICAgICAgICAgICAgICAgICAoc2VsZWN0ZWRDaGFuZ2UpPVwiX2RpYWxUaW1lU2VsZWN0ZWQoJGV2ZW50KVwiXG4gICAgICAgICAgICAgICAgIFtBTVBNXT1cIl9BTVBNXCJcbiAgICAgICAgICAgICAgICAgW2RhdGVGaWx0ZXJdPVwiZGF0ZUZpbHRlclwiXG4gICAgICAgICAgICAgICAgIFtpbnRlcnZhbF09XCJ0aW1lSW50ZXJ2YWxcIlxuICAgICAgICAgICAgICAgICBbbWF4RGF0ZV09XCJtYXhEYXRlXCJcbiAgICAgICAgICAgICAgICAgW21pbkRhdGVdPVwibWluRGF0ZVwiXG4gICAgICAgICAgICAgICAgIFtzZWxlY3RlZF09XCJfYWN0aXZlRGF0ZVwiXG4gICAgICAgICAgICAgICAgIFtzdGFydFZpZXddPVwiX2Nsb2NrVmlld1wiXG4gICAgICAgICAgICAgICAgIFt0d2VsdmVob3VyXT1cInR3ZWx2ZWhvdXJcIj5cbiAgICAgIDwvbXR4LWNsb2NrPlxuICAgIDwvbmctdGVtcGxhdGU+XG4gIDwvbmctY29udGFpbmVyPlxuPC9kaXY+XG4iXX0=