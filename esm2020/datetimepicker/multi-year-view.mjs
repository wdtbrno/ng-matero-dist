import { ChangeDetectionStrategy, Component, EventEmitter, Inject, Input, Optional, Output, ViewEncapsulation, } from '@angular/core';
import { createMissingDateImplError } from './datetimepicker-errors';
import { MtxCalendarCell } from './calendar-body';
import { mtxDatetimepickerAnimations } from './datetimepicker-animations';
import { MTX_DATETIME_FORMATS, } from '@ng-matero/extensions/core';
import * as i0 from "@angular/core";
import * as i1 from "@ng-matero/extensions/core";
import * as i2 from "./calendar-body";
export const yearsPerPage = 24;
export const yearsPerRow = 4;
/**
 * An internal component used to display multiple years in the datetimepicker.
 * @docs-private
 */
export class MtxMultiYearView {
    constructor(_adapter, _dateFormats) {
        this._adapter = _adapter;
        this._dateFormats = _dateFormats;
        this.type = 'date';
        /** Emits when a new month is selected. */
        this.selectedChange = new EventEmitter();
        /** Emits when any date is selected. */
        this._userSelection = new EventEmitter();
        if (!this._adapter) {
            throw createMissingDateImplError('DatetimeAdapter');
        }
        if (!this._dateFormats) {
            throw createMissingDateImplError('MTX_DATETIME_FORMATS');
        }
        this._activeDate = this._adapter.today();
    }
    /** The date to display in this multi year view */
    get activeDate() {
        return this._activeDate;
    }
    set activeDate(value) {
        const oldActiveDate = this._activeDate;
        this._activeDate = value || this._adapter.today();
        if (oldActiveDate &&
            this._activeDate &&
            !isSameMultiYearView(this._adapter, oldActiveDate, this._activeDate, this.minDate, this.maxDate)) {
            this._init();
        }
    }
    /** The currently selected date. */
    get selected() {
        return this._selected;
    }
    set selected(value) {
        this._selected = value;
        this._selectedYear = this._selected && this._adapter.getYear(this._selected);
    }
    /** The minimum selectable date. */
    get minDate() {
        return this._minDate;
    }
    set minDate(value) {
        this._minDate = this._getValidDateOrNull(this._adapter.deserialize(value));
    }
    /** The maximum selectable date. */
    get maxDate() {
        return this._maxDate;
    }
    set maxDate(value) {
        this._maxDate = this._getValidDateOrNull(this._adapter.deserialize(value));
    }
    ngAfterContentInit() {
        this._init();
    }
    /** Handles when a new year is selected. */
    _yearSelected(year) {
        const month = this._adapter.getMonth(this.activeDate);
        const normalizedDate = this._adapter.createDatetime(year, month, 1, 0, 0);
        this.selectedChange.emit(this._adapter.createDatetime(year, month, Math.min(this._adapter.getDate(this.activeDate), this._adapter.getNumDaysInMonth(normalizedDate)), this._adapter.getHour(this.activeDate), this._adapter.getMinute(this.activeDate)));
        if (this.type === 'year') {
            this._userSelection.emit();
        }
    }
    _getActiveCell() {
        return getActiveOffset(this._adapter, this.activeDate, this.minDate, this.maxDate);
    }
    _calendarStateDone() {
        this._calendarState = '';
    }
    /** Initializes this year view. */
    _init() {
        this._todayYear = this._adapter.getYear(this._adapter.today());
        this._yearLabel = this._adapter.getYearName(this.activeDate);
        const activeYear = this._adapter.getYear(this.activeDate);
        const minYearOfPage = activeYear - getActiveOffset(this._adapter, this.activeDate, this.minDate, this.maxDate);
        this._years = [];
        for (let i = 0, row = []; i < yearsPerPage; i++) {
            row.push(minYearOfPage + i);
            if (row.length === yearsPerRow) {
                this._years.push(row.map(year => this._createCellForYear(year)));
                row = [];
            }
        }
    }
    /** Creates an MtxCalendarCell for the given year. */
    _createCellForYear(year) {
        const yearName = this._adapter.getYearName(this._adapter.createDate(year, 0, 1));
        return new MtxCalendarCell(year, yearName, yearName, this._shouldEnableYear(year));
    }
    /** Whether the given year is enabled. */
    _shouldEnableYear(year) {
        // disable if the year is greater than maxDate lower than minDate
        if (year === undefined ||
            year === null ||
            (this.maxDate && year > this._adapter.getYear(this.maxDate)) ||
            (this.minDate && year < this._adapter.getYear(this.minDate))) {
            return false;
        }
        // enable if it reaches here and there's no filter defined
        if (!this.dateFilter) {
            return true;
        }
        const firstOfYear = this._adapter.createDate(year, 0, 1);
        // If any date in the year is enabled count the year as enabled.
        for (let date = firstOfYear; this._adapter.getYear(date) === year; date = this._adapter.addCalendarDays(date, 1)) {
            if (this.dateFilter(date)) {
                return true;
            }
        }
        return false;
    }
    /**
     * Gets the year in this years range that the given Date falls on.
     * Returns null if the given Date is not in this range.
     */
    _getYearInCurrentRange(date) {
        const year = this._adapter.getYear(date);
        return this._isInRange(year) ? year : null;
    }
    /**
     * Validate if the current year is in the current range
     * Returns true if is in range else returns false
     */
    _isInRange(year) {
        return true;
    }
    /**
     * @param obj The object to check.
     * @returns The given object if it is both a date instance and valid, otherwise null.
     */
    _getValidDateOrNull(obj) {
        return this._adapter.isDateInstance(obj) && this._adapter.isValid(obj) ? obj : null;
    }
}
/** @nocollapse */ MtxMultiYearView.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MtxMultiYearView, deps: [{ token: i1.DatetimeAdapter, optional: true }, { token: MTX_DATETIME_FORMATS, optional: true }], target: i0.ɵɵFactoryTarget.Component });
/** @nocollapse */ MtxMultiYearView.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.1", type: MtxMultiYearView, selector: "mtx-multi-year-view", inputs: { type: "type", dateFilter: "dateFilter", activeDate: "activeDate", selected: "selected", minDate: "minDate", maxDate: "maxDate" }, outputs: { selectedChange: "selectedChange", _userSelection: "_userSelection" }, exportAs: ["mtxMultiYearView"], ngImport: i0, template: "<table class=\"mtx-calendar-table\" role=\"grid\">\n  <thead class=\"mtx-calendar-table-header\"></thead>\n  <tbody mtx-calendar-body\n         (@slideCalendar.done)=\"_calendarStateDone()\"\n         [@slideCalendar]=\"_calendarState\"\n         [todayValue]=\"_todayYear\"\n         [rows]=\"_years\"\n         [numCols]=\"4\"\n         [activeCell]=\"_getActiveCell()\"\n         [allowDisabledSelection]=\"true\"\n         [selectedValue]=\"_selectedYear!\"\n         (selectedValueChange)=\"_yearSelected($event)\"></tbody>\n</table>\n", dependencies: [{ kind: "component", type: i2.MtxCalendarBody, selector: "[mtx-calendar-body]", inputs: ["label", "rows", "todayValue", "selectedValue", "labelMinRequiredCells", "numCols", "allowDisabledSelection", "activeCell"], outputs: ["selectedValueChange"], exportAs: ["mtxCalendarBody"] }], animations: [mtxDatetimepickerAnimations.slideCalendar], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MtxMultiYearView, decorators: [{
            type: Component,
            args: [{ selector: 'mtx-multi-year-view', exportAs: 'mtxMultiYearView', animations: [mtxDatetimepickerAnimations.slideCalendar], encapsulation: ViewEncapsulation.None, changeDetection: ChangeDetectionStrategy.OnPush, template: "<table class=\"mtx-calendar-table\" role=\"grid\">\n  <thead class=\"mtx-calendar-table-header\"></thead>\n  <tbody mtx-calendar-body\n         (@slideCalendar.done)=\"_calendarStateDone()\"\n         [@slideCalendar]=\"_calendarState\"\n         [todayValue]=\"_todayYear\"\n         [rows]=\"_years\"\n         [numCols]=\"4\"\n         [activeCell]=\"_getActiveCell()\"\n         [allowDisabledSelection]=\"true\"\n         [selectedValue]=\"_selectedYear!\"\n         (selectedValueChange)=\"_yearSelected($event)\"></tbody>\n</table>\n" }]
        }], ctorParameters: function () { return [{ type: i1.DatetimeAdapter, decorators: [{
                    type: Optional
                }] }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [MTX_DATETIME_FORMATS]
                }] }]; }, propDecorators: { type: [{
                type: Input
            }], dateFilter: [{
                type: Input
            }], selectedChange: [{
                type: Output
            }], _userSelection: [{
                type: Output
            }], activeDate: [{
                type: Input
            }], selected: [{
                type: Input
            }], minDate: [{
                type: Input
            }], maxDate: [{
                type: Input
            }] } });
export function isSameMultiYearView(dateAdapter, date1, date2, minDate, maxDate) {
    const year1 = dateAdapter.getYear(date1);
    const year2 = dateAdapter.getYear(date2);
    const startingYear = getStartingYear(dateAdapter, minDate, maxDate);
    return (Math.floor((year1 - startingYear) / yearsPerPage) ===
        Math.floor((year2 - startingYear) / yearsPerPage));
}
/**
 * When the multi-year view is first opened, the active year will be in view.
 * So we compute how many years are between the active year and the *slot* where our
 * "startingYear" will render when paged into view.
 */
export function getActiveOffset(dateAdapter, activeDate, minDate, maxDate) {
    const activeYear = dateAdapter.getYear(activeDate);
    return euclideanModulo(activeYear - getStartingYear(dateAdapter, minDate, maxDate), yearsPerPage);
}
/**
 * We pick a "starting" year such that either the maximum year would be at the end
 * or the minimum year would be at the beginning of a page.
 */
function getStartingYear(dateAdapter, minDate, maxDate) {
    let startingYear = 0;
    if (maxDate) {
        const maxYear = dateAdapter.getYear(maxDate);
        startingYear = maxYear - yearsPerPage + 1;
    }
    else if (minDate) {
        startingYear = dateAdapter.getYear(minDate);
    }
    return startingYear;
}
/** Gets remainder that is non-negative, even if first number is negative */
function euclideanModulo(a, b) {
    return ((a % b) + b) % b;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibXVsdGkteWVhci12aWV3LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vcHJvamVjdHMvZXh0ZW5zaW9ucy9kYXRldGltZXBpY2tlci9tdWx0aS15ZWFyLXZpZXcudHMiLCIuLi8uLi8uLi8uLi9wcm9qZWN0cy9leHRlbnNpb25zL2RhdGV0aW1lcGlja2VyL211bHRpLXllYXItdmlldy5odG1sIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFFTCx1QkFBdUIsRUFDdkIsU0FBUyxFQUNULFlBQVksRUFDWixNQUFNLEVBQ04sS0FBSyxFQUNMLFFBQVEsRUFDUixNQUFNLEVBQ04saUJBQWlCLEdBQ2xCLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBRSwwQkFBMEIsRUFBRSxNQUFNLHlCQUF5QixDQUFDO0FBQ3JFLE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUNsRCxPQUFPLEVBQUUsMkJBQTJCLEVBQUUsTUFBTSw2QkFBNkIsQ0FBQztBQUMxRSxPQUFPLEVBQ0wsb0JBQW9CLEdBR3JCLE1BQU0sNEJBQTRCLENBQUM7Ozs7QUFHcEMsTUFBTSxDQUFDLE1BQU0sWUFBWSxHQUFHLEVBQUUsQ0FBQztBQUUvQixNQUFNLENBQUMsTUFBTSxXQUFXLEdBQUcsQ0FBQyxDQUFDO0FBRTdCOzs7R0FHRztBQVNILE1BQU0sT0FBTyxnQkFBZ0I7SUE2QjNCLFlBQ3FCLFFBQTRCLEVBQ0csWUFBZ0M7UUFEL0QsYUFBUSxHQUFSLFFBQVEsQ0FBb0I7UUFDRyxpQkFBWSxHQUFaLFlBQVksQ0FBb0I7UUE5QjNFLFNBQUksR0FBMEIsTUFBTSxDQUFDO1FBSzlDLDBDQUEwQztRQUNoQyxtQkFBYyxHQUFHLElBQUksWUFBWSxFQUFLLENBQUM7UUFFakQsdUNBQXVDO1FBQ3BCLG1CQUFjLEdBQUcsSUFBSSxZQUFZLEVBQVEsQ0FBQztRQXVCM0QsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUU7WUFDbEIs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Q0FBQyxDQUFDO0lBQ25ELE9BQU8sZUFBZSxDQUFDLFVBQVUsR0FBRyxlQUFlLENBQUMsV0FBVyxFQUFFLE9BQU8sRUFBRSxPQUFPLENBQUMsRUFBRSxZQUFZLENBQUMsQ0FBQztBQUNwRyxDQUFDO0FBRUQ7OztHQUdHO0FBQ0gsU0FBUyxlQUFlLENBQ3RCLFdBQStCLEVBQy9CLE9BQWlCLEVBQ2pCLE9BQWlCO0lBRWpCLElBQUksWUFBWSxHQUFHLENBQUMsQ0FBQztJQUNyQixJQUFJLE9BQU8sRUFBRTtRQUNYLE1BQU0sT0FBTyxHQUFHLFdBQVcsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDN0MsWUFBWSxHQUFHLE9BQU8sR0FBRyxZQUFZLEdBQUcsQ0FBQyxDQUFDO0tBQzNDO1NBQU0sSUFBSSxPQUFPLEVBQUU7UUFDbEIsWUFBWSxHQUFHLFdBQVcsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7S0FDN0M7SUFDRCxPQUFPLFlBQVksQ0FBQztBQUN0QixDQUFDO0FBRUQsNEVBQTRFO0FBQzVFLFNBQVMsZUFBZSxDQUFDLENBQVMsRUFBRSxDQUFTO0lBQzNDLE9BQU8sQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDM0IsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIEFmdGVyQ29udGVudEluaXQsXG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBDb21wb25lbnQsXG4gIEV2ZW50RW1pdHRlcixcbiAgSW5qZWN0LFxuICBJbnB1dCxcbiAgT3B0aW9uYWwsXG4gIE91dHB1dCxcbiAgVmlld0VuY2Fwc3VsYXRpb24sXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgY3JlYXRlTWlzc2luZ0RhdGVJbXBsRXJyb3IgfSBmcm9tICcuL2RhdGV0aW1lcGlja2VyLWVycm9ycyc7XG5pbXBvcnQgeyBNdHhDYWxlbmRhckNlbGwgfSBmcm9tICcuL2NhbGVuZGFyLWJvZHknO1xuaW1wb3J0IHsgbXR4RGF0ZXRpbWVwaWNrZXJBbmltYXRpb25zIH0gZnJvbSAnLi9kYXRldGltZXBpY2tlci1hbmltYXRpb25zJztcbmltcG9ydCB7XG4gIE1UWF9EQVRFVElNRV9GT1JNQVRTLFxuICBNdHhEYXRldGltZUZvcm1hdHMsXG4gIERhdGV0aW1lQWRhcHRlcixcbn0gZnJvbSAnQG5nLW1hdGVyby9leHRlbnNpb25zL2NvcmUnO1xuaW1wb3J0IHsgTXR4RGF0ZXRpbWVwaWNrZXJUeXBlIH0gZnJvbSAnLi9kYXRldGltZXBpY2tlci10eXBlcyc7XG5cbmV4cG9ydCBjb25zdCB5ZWFyc1BlclBhZ2UgPSAyNDtcblxuZXhwb3J0IGNvbnN0IHllYXJzUGVyUm93ID0gNDtcblxuLyoqXG4gKiBBbiBpbnRlcm5hbCBjb21wb25lbnQgdXNlZCB0byBkaXNwbGF5IG11bHRpcGxlIHllYXJzIGluIHRoZSBkYXRldGltZXBpY2tlci5cbiAqIEBkb2NzLXByaXZhdGVcbiAqL1xuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbXR4LW11bHRpLXllYXItdmlldycsXG4gIHRlbXBsYXRlVXJsOiAnbXVsdGkteWVhci12aWV3Lmh0bWwnLFxuICBleHBvcnRBczogJ210eE11bHRpWWVhclZpZXcnLFxuICBhbmltYXRpb25zOiBbbXR4RGF0ZXRpbWVwaWNrZXJBbmltYXRpb25zLnNsaWRlQ2FsZW5kYXJdLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbn0pXG5leHBvcnQgY2xhc3MgTXR4TXVsdGlZZWFyVmlldzxEPiBpbXBsZW1lbnRzIEFmdGVyQ29udGVudEluaXQge1xuICBASW5wdXQoKSB0eXBlOiBNdHhEYXRldGltZXBpY2tlclR5cGUgPSAnZGF0ZSc7XG5cbiAgLyoqIEEgZnVuY3Rpb24gdXNlZCB0byBmaWx0ZXIgd2hpY2ggZGF0ZXMgYXJlIHNlbGVjdGFibGUuICovXG4gIEBJbnB1dCgpIGRhdGVGaWx0ZXIhOiAoZGF0ZTogRCkgPT4gYm9vbGVhbjtcblxuICAvKiogRW1pdHMgd2hlbiBhIG5ldyBtb250aCBpcyBzZWxlY3RlZC4gKi9cbiAgQE91dHB1dCgpIHNlbGVjdGVkQ2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcjxEPigpO1xuXG4gIC8qKiBFbWl0cyB3aGVuIGFueSBkYXRlIGlzIHNlbGVjdGVkLiAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgX3VzZXJTZWxlY3Rpb24gPSBuZXcgRXZlbnRFbWl0dGVyPHZvaWQ+KCk7XG5cbiAgLyoqIEdyaWQgb2YgY2FsZW5kYXIgY2VsbHMgcmVwcmVzZW50aW5nIHRoZSB5ZWFycyBpbiB0aGUgcmFuZ2UuICovXG4gIF95ZWFycyE6IE10eENhbGVuZGFyQ2VsbFtdW107XG5cbiAgLyoqIFRoZSBsYWJlbCBmb3IgdGhpcyB5ZWFyIHJhbmdlIChlLmcuIFwiMjAwMC0yMDIwXCIpLiAqL1xuICBfeWVhckxhYmVsITogc3RyaW5nO1xuXG4gIC8qKiBUaGUgeWVhciBpbiB0aGlzIHJhbmdlIHRoYXQgdG9kYXkgZmFsbHMgb24uIE51bGwgaWYgdG9kYXkgaXMgaW4gYSBkaWZmZXJlbnQgcmFuZ2UuICovXG4gIF90b2RheVllYXIhOiBudW1iZXI7XG5cbiAgLyoqXG4gICAqIFRoZSB5ZWFyIGluIHRoaXMgcmFuZ2UgdGhhdCB0aGUgc2VsZWN0ZWQgRGF0ZSBmYWxscyBvbi5cbiAgICogTnVsbCBpZiB0aGUgc2VsZWN0ZWQgRGF0ZSBpcyBpbiBhIGRpZmZlcmVudCByYW5nZS5cbiAgICovXG4gIF9zZWxlY3RlZFllYXIhOiBudW1iZXIgfCBudWxsO1xuXG4gIF9jYWxlbmRhclN0YXRlITogc3RyaW5nO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIEBPcHRpb25hbCgpIHB1YmxpYyBfYWRhcHRlcjogRGF0ZXRpbWVBZGFwdGVyPEQ+LFxuICAgIEBPcHRpb25hbCgpIEBJbmplY3QoTVRYX0RBVEVUSU1FX0ZPUk1BVFMpIHByaXZhdGUgX2RhdGVGb3JtYXRzOiBNdHhEYXRldGltZUZvcm1hdHNcbiAgKSB7XG4gICAgaWYgKCF0aGlzLl9hZGFwdGVyKSB7XG4gICAgICB0aHJvdyBjcmVhdGVNaXNzaW5nRGF0ZUltcGxFcnJvcignRGF0ZXRpbWVBZGFwdGVyJyk7XG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLl9kYXRlRm9ybWF0cykge1xuICAgICAgdGhyb3cgY3JlYXRlTWlzc2luZ0RhdGVJbXBsRXJyb3IoJ01UWF9EQVRFVElNRV9GT1JNQVRTJyk7XG4gICAgfVxuXG4gICAgdGhpcy5fYWN0aXZlRGF0ZSA9IHRoaXMuX2FkYXB0ZXIudG9kYXkoKTtcbiAgfVxuXG4gIC8qKiBUaGUgZGF0ZSB0byBkaXNwbGF5IGluIHRoaXMgbXVsdGkgeWVhciB2aWV3ICovXG4gIEBJbnB1dCgpXG4gIGdldCBhY3RpdmVEYXRlKCk6IEQge1xuICAgIHJldHVybiB0aGlzLl9hY3RpdmVEYXRlO1xuICB9XG4gIHNldCBhY3RpdmVEYXRlKHZhbHVlOiBEKSB7XG4gICAgY29uc3Qgb2xkQWN0aXZlRGF0ZSA9IHRoaXMuX2FjdGl2ZURhdGU7XG4gICAgdGhpcy5fYWN0aXZlRGF0ZSA9IHZhbHVlIHx8IHRoaXMuX2FkYXB0ZXIudG9kYXkoKTtcbiAgICBpZiAoXG4gICAgICBvbGRBY3RpdmVEYXRlICYmXG4gICAgICB0aGlzLl9hY3RpdmVEYXRlICYmXG4gICAgICAhaXNTYW1lTXVsdGlZZWFyVmlldyhcbiAgICAgICAgdGhpcy5fYWRhcHRlcixcbiAgICAgICAgb2xkQWN0aXZlRGF0ZSxcbiAgICAgICAgdGhpcy5fYWN0aXZlRGF0ZSxcbiAgICAgICAgdGhpcy5taW5EYXRlLFxuICAgICAgICB0aGlzLm1heERhdGVcbiAgICAgIClcbiAgICApIHtcbiAgICAgIHRoaXMuX2luaXQoKTtcbiAgICB9XG4gIH1cbiAgcHJpdmF0ZSBfYWN0aXZlRGF0ZTogRDtcblxuICAvKiogVGhlIGN1cnJlbnRseSBzZWxlY3RlZCBkYXRlLiAqL1xuICBASW5wdXQoKVxuICBnZXQgc2VsZWN0ZWQoKTogRCB7XG4gICAgcmV0dXJuIHRoaXMuX3NlbGVjdGVkO1xuICB9XG4gIHNldCBzZWxlY3RlZCh2YWx1ZTogRCkge1xuICAgIHRoaXMuX3NlbGVjdGVkID0gdmFsdWU7XG4gICAgdGhpcy5fc2VsZWN0ZWRZZWFyID0gdGhpcy5fc2VsZWN0ZWQgJiYgdGhpcy5fYWRhcHRlci5nZXRZZWFyKHRoaXMuX3NlbGVjdGVkKTtcbiAgfVxuICBwcml2YXRlIF9zZWxlY3RlZCE6IEQ7XG5cbiAgLyoqIFRoZSBtaW5pbXVtIHNlbGVjdGFibGUgZGF0ZS4gKi9cbiAgQElucHV0KClcbiAgZ2V0IG1pbkRhdGUoKTogRCB8IG51bGwge1xuICAgIHJldHVybiB0aGlzLl9taW5EYXRlO1xuICB9XG4gIHNldCBtaW5EYXRlKHZhbHVlOiBEIHwgbnVsbCkge1xuICAgIHRoaXMuX21pbkRhdGUgPSB0aGlzLl9nZXRWYWxpZERhdGVPck51bGwodGhpcy5fYWRhcHRlci5kZXNlcmlhbGl6ZSh2YWx1ZSkpO1xuICB9XG4gIHByaXZhdGUgX21pbkRhdGUhOiBEIHwgbnVsbDtcblxuICAvKiogVGhlIG1heGltdW0gc2VsZWN0YWJsZSBkYXRlLiAqL1xuICBASW5wdXQoKVxuICBnZXQgbWF4RGF0ZSgpOiBEIHwgbnVsbCB7XG4gICAgcmV0dXJuIHRoaXMuX21heERhdGU7XG4gIH1cbiAgc2V0IG1heERhdGUodmFsdWU6IEQgfCBudWxsKSB7XG4gICAgdGhpcy5fbWF4RGF0ZSA9IHRoaXMuX2dldFZhbGlkRGF0ZU9yTnVsbCh0aGlzLl9hZGFwdGVyLmRlc2VyaWFsaXplKHZhbHVlKSk7XG4gIH1cbiAgcHJpdmF0ZSBfbWF4RGF0ZSE6IEQgfCBudWxsO1xuXG4gIG5nQWZ0ZXJDb250ZW50SW5pdCgpIHtcbiAgICB0aGlzLl9pbml0KCk7XG4gIH1cblxuICAvKiogSGFuZGxlcyB3aGVuIGEgbmV3IHllYXIgaXMgc2VsZWN0ZWQuICovXG4gIF95ZWFyU2VsZWN0ZWQoeWVhcjogbnVtYmVyKSB7XG4gICAgY29uc3QgbW9udGggPSB0aGlzLl9hZGFwdGVyLmdldE1vbnRoKHRoaXMuYWN0aXZlRGF0ZSk7XG4gICAgY29uc3Qgbm9ybWFsaXplZERhdGUgPSB0aGlzLl9hZGFwdGVyLmNyZWF0ZURhdGV0aW1lKHllYXIsIG1vbnRoLCAxLCAwLCAwKTtcblxuICAgIHRoaXMuc2VsZWN0ZWRDaGFuZ2UuZW1pdChcbiAgICAgIHRoaXMuX2FkYXB0ZXIuY3JlYXRlRGF0ZXRpbWUoXG4gICAgICAgIHllYXIsXG4gICAgICAgIG1vbnRoLFxuICAgICAgICBNYXRoLm1pbihcbiAgICAgICAgICB0aGlzLl9hZGFwdGVyLmdldERhdGUodGhpcy5hY3RpdmVEYXRlKSxcbiAgICAgICAgICB0aGlzLl9hZGFwdGVyLmdldE51bURheXNJbk1vbnRoKG5vcm1hbGl6ZWREYXRlKVxuICAgICAgICApLFxuICAgICAgICB0aGlzLl9hZGFwdGVyLmdldEhvdXIodGhpcy5hY3RpdmVEYXRlKSxcbiAgICAgICAgdGhpcy5fYWRhcHRlci5nZXRNaW51dGUodGhpcy5hY3RpdmVEYXRlKVxuICAgICAgKVxuICAgICk7XG5cbiAgICBpZiAodGhpcy50eXBlID09PSAneWVhcicpIHtcbiAgICAgIHRoaXMuX3VzZXJTZWxlY3Rpb24uZW1pdCgpO1xuICAgIH1cbiAgfVxuXG4gIF9nZXRBY3RpdmVDZWxsKCk6IG51bWJlciB7XG4gICAgcmV0dXJuIGdldEFjdGl2ZU9mZnNldCh0aGlzLl9hZGFwdGVyLCB0aGlzLmFjdGl2ZURhdGUsIHRoaXMubWluRGF0ZSwgdGhpcy5tYXhEYXRlKTtcbiAgfVxuXG4gIF9jYWxlbmRhclN0YXRlRG9uZSgpIHtcbiAgICB0aGlzLl9jYWxlbmRhclN0YXRlID0gJyc7XG4gIH1cblxuICAvKiogSW5pdGlhbGl6ZXMgdGhpcyB5ZWFyIHZpZXcuICovXG4gIHByaXZhdGUgX2luaXQoKSB7XG4gICAgdGhpcy5fdG9kYXlZZWFyID0gdGhpcy5fYWRhcHRlci5nZXRZZWFyKHRoaXMuX2FkYXB0ZXIudG9kYXkoKSk7XG4gICAgdGhpcy5feWVhckxhYmVsID0gdGhpcy5fYWRhcHRlci5nZXRZZWFyTmFtZSh0aGlzLmFjdGl2ZURhdGUpO1xuXG4gICAgY29uc3QgYWN0aXZlWWVhciA9IHRoaXMuX2FkYXB0ZXIuZ2V0WWVhcih0aGlzLmFjdGl2ZURhdGUpO1xuXG4gICAgY29uc3QgbWluWWVhck9mUGFnZSA9XG4gICAgICBhY3RpdmVZZWFyIC0gZ2V0QWN0aXZlT2Zmc2V0KHRoaXMuX2FkYXB0ZXIsIHRoaXMuYWN0aXZlRGF0ZSwgdGhpcy5taW5EYXRlLCB0aGlzLm1heERhdGUpO1xuXG4gICAgdGhpcy5feWVhcnMgPSBbXTtcbiAgICBmb3IgKGxldCBpID0gMCwgcm93OiBudW1iZXJbXSA9IFtdOyBpIDwgeWVhcnNQZXJQYWdlOyBpKyspIHtcbiAgICAgIHJvdy5wdXNoKG1pblllYXJPZlBhZ2UgKyBpKTtcbiAgICAgIGlmIChyb3cubGVuZ3RoID09PSB5ZWFyc1BlclJvdykge1xuICAgICAgICB0aGlzLl95ZWFycy5wdXNoKHJvdy5tYXAoeWVhciA9PiB0aGlzLl9jcmVhdGVDZWxsRm9yWWVhcih5ZWFyKSkpO1xuICAgICAgICByb3cgPSBbXTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKiogQ3JlYXRlcyBhbiBNdHhDYWxlbmRhckNlbGwgZm9yIHRoZSBnaXZlbiB5ZWFyLiAqL1xuICBwcml2YXRlIF9jcmVhdGVDZWxsRm9yWWVhcih5ZWFyOiBudW1iZXIpIHtcbiAgICBjb25zdCB5ZWFyTmFtZSA9IHRoaXMuX2FkYXB0ZXIuZ2V0WWVhck5hbWUodGhpcy5fYWRhcHRlci5jcmVhdGVEYXRlKHllYXIsIDAsIDEpKTtcbiAgICByZXR1cm4gbmV3IE10eENhbGVuZGFyQ2VsbCh5ZWFyLCB5ZWFyTmFtZSwgeWVhck5hbWUsIHRoaXMuX3Nob3VsZEVuYWJsZVllYXIoeWVhcikpO1xuICB9XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGdpdmVuIHllYXIgaXMgZW5hYmxlZC4gKi9cbiAgcHJpdmF0ZSBfc2hvdWxkRW5hYmxlWWVhcih5ZWFyOiBudW1iZXIpIHtcbiAgICAvLyBkaXNhYmxlIGlmIHRoZSB5ZWFyIGlzIGdyZWF0ZXIgdGhhbiBtYXhEYXRlIGxvd2VyIHRoYW4gbWluRGF0ZVxuICAgIGlmIChcbiAgICAgIHllYXIgPT09IHVuZGVmaW5lZCB8fFxuICAgICAgeWVhciA9PT0gbnVsbCB8fFxuICAgICAgKHRoaXMubWF4RGF0ZSAmJiB5ZWFyID4gdGhpcy5fYWRhcHRlci5nZXRZZWFyKHRoaXMubWF4RGF0ZSkpIHx8XG4gICAgICAodGhpcy5taW5EYXRlICYmIHllYXIgPCB0aGlzLl9hZGFwdGVyLmdldFllYXIodGhpcy5taW5EYXRlKSlcbiAgICApIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICAvLyBlbmFibGUgaWYgaXQgcmVhY2hlcyBoZXJlIGFuZCB0aGVyZSdzIG5vIGZpbHRlciBkZWZpbmVkXG4gICAgaWYgKCF0aGlzLmRhdGVGaWx0ZXIpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGNvbnN0IGZpcnN0T2ZZZWFyID0gdGhpcy5fYWRhcHRlci5jcmVhdGVEYXRlKHllYXIsIDAsIDEpO1xuXG4gICAgLy8gSWYgYW55IGRhdGUgaW4gdGhlIHllYXIgaXMgZW5hYmxlZCBjb3VudCB0aGUgeWVhciBhcyBlbmFibGVkLlxuICAgIGZvciAoXG4gICAgICBsZXQgZGF0ZSA9IGZpcnN0T2ZZZWFyO1xuICAgICAgdGhpcy5fYWRhcHRlci5nZXRZZWFyKGRhdGUpID09PSB5ZWFyO1xuICAgICAgZGF0ZSA9IHRoaXMuX2FkYXB0ZXIuYWRkQ2FsZW5kYXJEYXlzKGRhdGUsIDEpXG4gICAgKSB7XG4gICAgICBpZiAodGhpcy5kYXRlRmlsdGVyKGRhdGUpKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIHRoZSB5ZWFyIGluIHRoaXMgeWVhcnMgcmFuZ2UgdGhhdCB0aGUgZ2l2ZW4gRGF0ZSBmYWxscyBvbi5cbiAgICogUmV0dXJucyBudWxsIGlmIHRoZSBnaXZlbiBEYXRlIGlzIG5vdCBpbiB0aGlzIHJhbmdlLlxuICAgKi9cbiAgcHJpdmF0ZSBfZ2V0WWVhckluQ3VycmVudFJhbmdlKGRhdGU6IEQpIHtcbiAgICBjb25zdCB5ZWFyID0gdGhpcy5fYWRhcHRlci5nZXRZZWFyKGRhdGUpO1xuICAgIHJldHVybiB0aGlzLl9pc0luUmFuZ2UoeWVhcikgPyB5ZWFyIDogbnVsbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBWYWxpZGF0ZSBpZiB0aGUgY3VycmVudCB5ZWFyIGlzIGluIHRoZSBjdXJyZW50IHJhbmdlXG4gICAqIFJldHVybnMgdHJ1ZSBpZiBpcyBpbiByYW5nZSBlbHNlIHJldHVybnMgZmFsc2VcbiAgICovXG4gIHByaXZhdGUgX2lzSW5SYW5nZSh5ZWFyOiBudW1iZXIpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0gb2JqIFRoZSBvYmplY3QgdG8gY2hlY2suXG4gICAqIEByZXR1cm5zIFRoZSBnaXZlbiBvYmplY3QgaWYgaXQgaXMgYm90aCBhIGRhdGUgaW5zdGFuY2UgYW5kIHZhbGlkLCBvdGhlcndpc2UgbnVsbC5cbiAgICovXG4gIHByaXZhdGUgX2dldFZhbGlkRGF0ZU9yTnVsbChvYmo6IGFueSk6IEQgfCBudWxsIHtcbiAgICByZXR1cm4gdGhpcy5fYWRhcHRlci5pc0RhdGVJbnN0YW5jZShvYmopICYmIHRoaXMuX2FkYXB0ZXIuaXNWYWxpZChvYmopID8gb2JqIDogbnVsbDtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNTYW1lTXVsdGlZZWFyVmlldzxEPihcbiAgZGF0ZUFkYXB0ZXI6IERhdGV0aW1lQWRhcHRlcjxEPixcbiAgZGF0ZTE6IEQsXG4gIGRhdGUyOiBELFxuICBtaW5EYXRlOiBEIHwgbnVsbCxcbiAgbWF4RGF0ZTogRCB8IG51bGxcbik6IGJvb2xlYW4ge1xuICBjb25zdCB5ZWFyMSA9IGRhdGVBZGFwdGVyLmdldFllYXIoZGF0ZTEpO1xuICBjb25zdCB5ZWFyMiA9IGRhdGVBZGFwdGVyLmdldFllYXIoZGF0ZTIpO1xuICBjb25zdCBzdGFydGluZ1llYXIgPSBnZXRTdGFydGluZ1llYXIoZGF0ZUFkYXB0ZXIsIG1pbkRhdGUsIG1heERhdGUpO1xuICByZXR1cm4gKFxuICAgIE1hdGguZmxvb3IoKHllYXIxIC0gc3RhcnRpbmdZZWFyKSAvIHllYXJzUGVyUGFnZSkgPT09XG4gICAgTWF0aC5mbG9vcigoeWVhcjIgLSBzdGFydGluZ1llYXIpIC8geWVhcnNQZXJQYWdlKVxuICApO1xufVxuXG4vKipcbiAqIFdoZW4gdGhlIG11bHRpLXllYXIgdmlldyBpcyBmaXJzdCBvcGVuZWQsIHRoZSBhY3RpdmUgeWVhciB3aWxsIGJlIGluIHZpZXcuXG4gKiBTbyB3ZSBjb21wdXRlIGhvdyBtYW55IHllYXJzIGFyZSBiZXR3ZWVuIHRoZSBhY3RpdmUgeWVhciBhbmQgdGhlICpzbG90KiB3aGVyZSBvdXJcbiAqIFwic3RhcnRpbmdZZWFyXCIgd2lsbCByZW5kZXIgd2hlbiBwYWdlZCBpbnRvIHZpZXcuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRBY3RpdmVPZmZzZXQ8RD4oXG4gIGRhdGVBZGFwdGVyOiBEYXRldGltZUFkYXB0ZXI8RD4sXG4gIGFjdGl2ZURhdGU6IEQsXG4gIG1pbkRhdGU6IEQgfCBudWxsLFxuICBtYXhEYXRlOiBEIHwgbnVsbFxuKTogbnVtYmVyIHtcbiAgY29uc3QgYWN0aXZlWWVhciA9IGRhdGVBZGFwdGVyLmdldFllYXIoYWN0aXZlRGF0ZSk7XG4gIHJldHVybiBldWNsaWRlYW5Nb2R1bG8oYWN0aXZlWWVhciAtIGdldFN0YXJ0aW5nWWVhcihkYXRlQWRhcHRlciwgbWluRGF0ZSwgbWF4RGF0ZSksIHllYXJzUGVyUGFnZSk7XG59XG5cbi8qKlxuICogV2UgcGljayBhIFwic3RhcnRpbmdcIiB5ZWFyIHN1Y2ggdGhhdCBlaXRoZXIgdGhlIG1heGltdW0geWVhciB3b3VsZCBiZSBhdCB0aGUgZW5kXG4gKiBvciB0aGUgbWluaW11bSB5ZWFyIHdvdWxkIGJlIGF0IHRoZSBiZWdpbm5pbmcgb2YgYSBwYWdlLlxuICovXG5mdW5jdGlvbiBnZXRTdGFydGluZ1llYXI8RD4oXG4gIGRhdGVBZGFwdGVyOiBEYXRldGltZUFkYXB0ZXI8RD4sXG4gIG1pbkRhdGU6IEQgfCBudWxsLFxuICBtYXhEYXRlOiBEIHwgbnVsbFxuKTogbnVtYmVyIHtcbiAgbGV0IHN0YXJ0aW5nWWVhciA9IDA7XG4gIGlmIChtYXhEYXRlKSB7XG4gICAgY29uc3QgbWF4WWVhciA9IGRhdGVBZGFwdGVyLmdldFllYXIobWF4RGF0ZSk7XG4gICAgc3RhcnRpbmdZZWFyID0gbWF4WWVhciAtIHllYXJzUGVyUGFnZSArIDE7XG4gIH0gZWxzZSBpZiAobWluRGF0ZSkge1xuICAgIHN0YXJ0aW5nWWVhciA9IGRhdGVBZGFwdGVyLmdldFllYXIobWluRGF0ZSk7XG4gIH1cbiAgcmV0dXJuIHN0YXJ0aW5nWWVhcjtcbn1cblxuLyoqIEdldHMgcmVtYWluZGVyIHRoYXQgaXMgbm9uLW5lZ2F0aXZlLCBldmVuIGlmIGZpcnN0IG51bWJlciBpcyBuZWdhdGl2ZSAqL1xuZnVuY3Rpb24gZXVjbGlkZWFuTW9kdWxvKGE6IG51bWJlciwgYjogbnVtYmVyKTogbnVtYmVyIHtcbiAgcmV0dXJuICgoYSAlIGIpICsgYikgJSBiO1xufVxuIiwiPHRhYmxlIGNsYXNzPVwibXR4LWNhbGVuZGFyLXRhYmxlXCIgcm9sZT1cImdyaWRcIj5cbiAgPHRoZWFkIGNsYXNzPVwibXR4LWNhbGVuZGFyLXRhYmxlLWhlYWRlclwiPjwvdGhlYWQ+XG4gIDx0Ym9keSBtdHgtY2FsZW5kYXItYm9keVxuICAgICAgICAgKEBzbGlkZUNhbGVuZGFyLmRvbmUpPVwiX2NhbGVuZGFyU3RhdGVEb25lKClcIlxuICAgICAgICAgW0BzbGlkZUNhbGVuZGFyXT1cIl9jYWxlbmRhclN0YXRlXCJcbiAgICAgICAgIFt0b2RheVZhbHVlXT1cIl90b2RheVllYXJcIlxuICAgICAgICAgW3Jvd3NdPVwiX3llYXJzXCJcbiAgICAgICAgIFtudW1Db2xzXT1cIjRcIlxuICAgICAgICAgW2FjdGl2ZUNlbGxdPVwiX2dldEFjdGl2ZUNlbGwoKVwiXG4gICAgICAgICBbYWxsb3dEaXNhYmxlZFNlbGVjdGlvbl09XCJ0cnVlXCJcbiAgICAgICAgIFtzZWxlY3RlZFZhbHVlXT1cIl9zZWxlY3RlZFllYXIhXCJcbiAgICAgICAgIChzZWxlY3RlZFZhbHVlQ2hhbmdlKT1cIl95ZWFyU2VsZWN0ZWQoJGV2ZW50KVwiPjwvdGJvZHk+XG48L3RhYmxlPlxuIl19