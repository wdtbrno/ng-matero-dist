import { ChangeDetectionStrategy, Component, EventEmitter, Inject, Input, Optional, Output, ViewEncapsulation, } from '@angular/core';
import { createMissingDateImplError } from './datetimepicker-errors';
import { MtxCalendarCell } from './calendar-body';
import { mtxDatetimepickerAnimations } from './datetimepicker-animations';
import { MTX_DATETIME_FORMATS, } from '@ng-matero/extensions/core';
import * as i0 from "@angular/core";
import * as i1 from "@ng-matero/extensions/core";
import * as i2 from "./calendar-body";
/**
 * An internal component used to display a single year in the datetimepicker.
 * @docs-private
 */
export class MtxYearView {
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
    /** The date to display in this year view (everything other than the year is ignored). */
    get activeDate() {
        return this._activeDate;
    }
    set activeDate(value) {
        const oldActiveDate = this._activeDate;
        this._activeDate = value || this._adapter.today();
        if (oldActiveDate &&
            this._activeDate &&
            !this._adapter.sameYear(oldActiveDate, this._activeDate)) {
            this._init();
            // if (oldActiveDate < this._activeDate) {
            //  this.calendarState('right');
            // } else {
            //  this.calendarState('left');
            // }
        }
    }
    /** The currently selected date. */
    get selected() {
        return this._selected;
    }
    set selected(value) {
        this._selected = value;
        this._selectedMonth = this._getMonthInCurrentYear(this.selected);
    }
    ngAfterContentInit() {
        this._init();
    }
    /** Handles when a new month is selected. */
    _monthSelected(month) {
        const normalizedDate = this._adapter.createDatetime(this._adapter.getYear(this.activeDate), month, 1, 0, 0);
        this.selectedChange.emit(this._adapter.createDatetime(this._adapter.getYear(this.activeDate), month, Math.min(this._adapter.getDate(this.activeDate), this._adapter.getNumDaysInMonth(normalizedDate)), this._adapter.getHour(this.activeDate), this._adapter.getMinute(this.activeDate)));
        if (this.type === 'month') {
            this._userSelection.emit();
        }
    }
    _calendarStateDone() {
        this._calendarState = '';
    }
    /** Initializes this month view. */
    _init() {
        this._selectedMonth = this._getMonthInCurrentYear(this.selected);
        this._todayMonth = this._getMonthInCurrentYear(this._adapter.today());
        this._yearLabel = this._adapter.getYearName(this.activeDate);
        const monthNames = this._adapter.getMonthNames('short');
        // First row of months only contains 5 elements so we can fit the year label on the same row.
        this._months = [
            [0, 1, 2, 3],
            [4, 5, 6, 7],
            [8, 9, 10, 11],
        ].map(row => row.map(month => this._createCellForMonth(month, monthNames[month])));
    }
    /**
     * Gets the month in this year that the given Date falls on.
     * Returns null if the given Date is in another year.
     */
    _getMonthInCurrentYear(date) {
        return this._adapter.sameYear(date, this.activeDate) ? this._adapter.getMonth(date) : null;
    }
    /** Creates an MdCalendarCell for the given month. */
    _createCellForMonth(month, monthName) {
        const ariaLabel = this._adapter.format(this._adapter.createDatetime(this._adapter.getYear(this.activeDate), month, 1, this._adapter.getHour(this.activeDate), this._adapter.getMinute(this.activeDate)), this._dateFormats.display.monthYearA11yLabel);
        return new MtxCalendarCell(month, monthName.toLocaleUpperCase(), ariaLabel, this._isMonthEnabled(month));
    }
    // private calendarState(direction: string): void {
    //   this._calendarState = direction;
    // }
    /** Whether the given month is enabled. */
    _isMonthEnabled(month) {
        if (!this.dateFilter) {
            return true;
        }
        const firstOfMonth = this._adapter.createDatetime(this._adapter.getYear(this.activeDate), month, 1, this._adapter.getHour(this.activeDate), this._adapter.getMinute(this.activeDate));
        // If any date in the month is enabled count the month as enabled.
        for (let date = firstOfMonth; this._adapter.getMonth(date) === month; date = this._adapter.addCalendarDays(date, 1)) {
            if (this.dateFilter(date)) {
                return true;
            }
        }
        return false;
    }
}
/** @nocollapse */ MtxYearView.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MtxYearView, deps: [{ token: i1.DatetimeAdapter, optional: true }, { token: MTX_DATETIME_FORMATS, optional: true }], target: i0.ɵɵFactoryTarget.Component });
/** @nocollapse */ MtxYearView.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.1", type: MtxYearView, selector: "mtx-year-view", inputs: { type: "type", dateFilter: "dateFilter", activeDate: "activeDate", selected: "selected" }, outputs: { selectedChange: "selectedChange", _userSelection: "_userSelection" }, exportAs: ["mtxYearView"], ngImport: i0, template: "<table class=\"mtx-calendar-table\" role=\"grid\">\n  <thead class=\"mtx-calendar-table-header\"></thead>\n  <tbody mtx-calendar-body\n         (@slideCalendar.done)=\"_calendarStateDone()\"\n         [@slideCalendar]=\"_calendarState\"\n         [label]=\"_yearLabel\"\n         [rows]=\"_months\"\n         [todayValue]=\"_todayMonth!\"\n         [labelMinRequiredCells]=\"2\"\n         [numCols]=\"4\"\n         [activeCell]=\"_adapter.getMonth(activeDate)\"\n         [selectedValue]=\"_selectedMonth!\"\n         (selectedValueChange)=\"_monthSelected($event)\"\n         [allowDisabledSelection]=\"true\"></tbody>\n</table>\n", dependencies: [{ kind: "component", type: i2.MtxCalendarBody, selector: "[mtx-calendar-body]", inputs: ["label", "rows", "todayValue", "selectedValue", "labelMinRequiredCells", "numCols", "allowDisabledSelection", "activeCell"], outputs: ["selectedValueChange"], exportAs: ["mtxCalendarBody"] }], animations: [mtxDatetimepickerAnimations.slideCalendar], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MtxYearView, decorators: [{
            type: Component,
            args: [{ selector: 'mtx-year-view', exportAs: 'mtxYearView', animations: [mtxDatetimepickerAnimations.slideCalendar], encapsulation: ViewEncapsulation.None, changeDetection: ChangeDetectionStrategy.OnPush, template: "<table class=\"mtx-calendar-table\" role=\"grid\">\n  <thead class=\"mtx-calendar-table-header\"></thead>\n  <tbody mtx-calendar-body\n         (@slideCalendar.done)=\"_calendarStateDone()\"\n         [@slideCalendar]=\"_calendarState\"\n         [label]=\"_yearLabel\"\n         [rows]=\"_months\"\n         [todayValue]=\"_todayMonth!\"\n         [labelMinRequiredCells]=\"2\"\n         [numCols]=\"4\"\n         [activeCell]=\"_adapter.getMonth(activeDate)\"\n         [selectedValue]=\"_selectedMonth!\"\n         (selectedValueChange)=\"_monthSelected($event)\"\n         [allowDisabledSelection]=\"true\"></tbody>\n</table>\n" }]
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
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoieWVhci12aWV3LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vcHJvamVjdHMvZXh0ZW5zaW9ucy9kYXRldGltZXBpY2tlci95ZWFyLXZpZXcudHMiLCIuLi8uLi8uLi8uLi9wcm9qZWN0cy9leHRlbnNpb25zL2RhdGV0aW1lcGlja2VyL3llYXItdmlldy5odG1sIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFFTCx1QkFBdUIsRUFDdkIsU0FBUyxFQUNULFlBQVksRUFDWixNQUFNLEVBQ04sS0FBSyxFQUNMLFFBQVEsRUFDUixNQUFNLEVBQ04saUJBQWlCLEdBQ2xCLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBRSwwQkFBMEIsRUFBRSxNQUFNLHlCQUF5QixDQUFDO0FBQ3JFLE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUNsRCxPQUFPLEVBQUUsMkJBQTJCLEVBQUUsTUFBTSw2QkFBNkIsQ0FBQztBQUMxRSxPQUFPLEVBQ0wsb0JBQW9CLEdBR3JCLE1BQU0sNEJBQTRCLENBQUM7Ozs7QUFHcEM7OztHQUdHO0FBU0gsTUFBTSxPQUFPLFdBQVc7SUE2QnRCLFlBQ3FCLFFBQTRCLEVBQ0csWUFBZ0M7UUFEL0QsYUFBUSxHQUFSLFFBQVEsQ0FBb0I7UUFDRyxpQkFBWSxHQUFaLFlBQVksQ0FBb0I7UUE5QjNFLFNBQUksR0FBMEIsTUFBTSxDQUFDO1FBSzlDLDBDQUEwQztRQUNoQyxtQkFBYyxHQUFHLElBQUksWUFBWSxFQUFLLENBQUM7UUFFakQsdUNBQXVDO1FBQ3BCLG1CQUFjLEdBQUcsSUFBSSxZQUFZLEVBQVEsQ0FBQztRQXVCM0QsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUU7WUFDbEIsTUFBTSwwQkFBMEIsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO1NBQ3JEO1FBRUQsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLEVBQUU7WUFDdEIsTUFBTSwwQkFBMEIsQ0FBQyxzQkFB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QUEyQixDQUFDLGFBQWEsQ0FBQzsyRkFJNUMsV0FBVztrQkFSdkIsU0FBUzsrQkFDRSxlQUFlLFlBRWYsYUFBYSxjQUNYLENBQUMsMkJBQTJCLENBQUMsYUFBYSxDQUFDLGlCQUN4QyxpQkFBaUIsQ0FBQyxJQUFJLG1CQUNwQix1QkFBdUIsQ0FBQyxNQUFNOzswQkFnQzVDLFFBQVE7OzBCQUNSLFFBQVE7OzBCQUFJLE1BQU07MkJBQUMsb0JBQW9COzRDQTlCakMsSUFBSTtzQkFBWixLQUFLO2dCQUdHLFVBQVU7c0JBQWxCLEtBQUs7Z0JBR0ksY0FBYztzQkFBdkIsTUFBTTtnQkFHWSxjQUFjO3NCQUFoQyxNQUFNO2dCQXNDSCxVQUFVO3NCQURiLEtBQUs7Z0JBMEJGLFFBQVE7c0JBRFgsS0FBSyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIEFmdGVyQ29udGVudEluaXQsXG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBDb21wb25lbnQsXG4gIEV2ZW50RW1pdHRlcixcbiAgSW5qZWN0LFxuICBJbnB1dCxcbiAgT3B0aW9uYWwsXG4gIE91dHB1dCxcbiAgVmlld0VuY2Fwc3VsYXRpb24sXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgY3JlYXRlTWlzc2luZ0RhdGVJbXBsRXJyb3IgfSBmcm9tICcuL2RhdGV0aW1lcGlja2VyLWVycm9ycyc7XG5pbXBvcnQgeyBNdHhDYWxlbmRhckNlbGwgfSBmcm9tICcuL2NhbGVuZGFyLWJvZHknO1xuaW1wb3J0IHsgbXR4RGF0ZXRpbWVwaWNrZXJBbmltYXRpb25zIH0gZnJvbSAnLi9kYXRldGltZXBpY2tlci1hbmltYXRpb25zJztcbmltcG9ydCB7XG4gIE1UWF9EQVRFVElNRV9GT1JNQVRTLFxuICBNdHhEYXRldGltZUZvcm1hdHMsXG4gIERhdGV0aW1lQWRhcHRlcixcbn0gZnJvbSAnQG5nLW1hdGVyby9leHRlbnNpb25zL2NvcmUnO1xuaW1wb3J0IHsgTXR4RGF0ZXRpbWVwaWNrZXJUeXBlIH0gZnJvbSAnLi9kYXRldGltZXBpY2tlci10eXBlcyc7XG5cbi8qKlxuICogQW4gaW50ZXJuYWwgY29tcG9uZW50IHVzZWQgdG8gZGlzcGxheSBhIHNpbmdsZSB5ZWFyIGluIHRoZSBkYXRldGltZXBpY2tlci5cbiAqIEBkb2NzLXByaXZhdGVcbiAqL1xuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbXR4LXllYXItdmlldycsXG4gIHRlbXBsYXRlVXJsOiAneWVhci12aWV3Lmh0bWwnLFxuICBleHBvcnRBczogJ210eFllYXJWaWV3JyxcbiAgYW5pbWF0aW9uczogW210eERhdGV0aW1lcGlja2VyQW5pbWF0aW9ucy5zbGlkZUNhbGVuZGFyXSxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG59KVxuZXhwb3J0IGNsYXNzIE10eFllYXJWaWV3PEQ+IGltcGxlbWVudHMgQWZ0ZXJDb250ZW50SW5pdCB7XG4gIEBJbnB1dCgpIHR5cGU6IE10eERhdGV0aW1lcGlja2VyVHlwZSA9ICdkYXRlJztcblxuICAvKiogQSBmdW5jdGlvbiB1c2VkIHRvIGZpbHRlciB3aGljaCBkYXRlcyBhcmUgc2VsZWN0YWJsZS4gKi9cbiAgQElucHV0KCkgZGF0ZUZpbHRlciE6IChkYXRlOiBEKSA9PiBib29sZWFuO1xuXG4gIC8qKiBFbWl0cyB3aGVuIGEgbmV3IG1vbnRoIGlzIHNlbGVjdGVkLiAqL1xuICBAT3V0cHV0KCkgc2VsZWN0ZWRDaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyPEQ+KCk7XG5cbiAgLyoqIEVtaXRzIHdoZW4gYW55IGRhdGUgaXMgc2VsZWN0ZWQuICovXG4gIEBPdXRwdXQoKSByZWFkb25seSBfdXNlclNlbGVjdGlvbiA9IG5ldyBFdmVudEVtaXR0ZXI8dm9pZD4oKTtcblxuICAvKiogR3JpZCBvZiBjYWxlbmRhciBjZWxscyByZXByZXNlbnRpbmcgdGhlIG1vbnRocyBvZiB0aGUgeWVhci4gKi9cbiAgX21vbnRocyE6IE10eENhbGVuZGFyQ2VsbFtdW107XG5cbiAgLyoqIFRoZSBsYWJlbCBmb3IgdGhpcyB5ZWFyIChlLmcuIFwiMjAxN1wiKS4gKi9cbiAgX3llYXJMYWJlbCE6IHN0cmluZztcblxuICAvKiogVGhlIG1vbnRoIGluIHRoaXMgeWVhciB0aGF0IHRvZGF5IGZhbGxzIG9uLiBOdWxsIGlmIHRvZGF5IGlzIGluIGEgZGlmZmVyZW50IHllYXIuICovXG4gIF90b2RheU1vbnRoITogbnVtYmVyIHwgbnVsbDtcblxuICAvKipcbiAgICogVGhlIG1vbnRoIGluIHRoaXMgeWVhciB0aGF0IHRoZSBzZWxlY3RlZCBEYXRlIGZhbGxzIG9uLlxuICAgKiBOdWxsIGlmIHRoZSBzZWxlY3RlZCBEYXRlIGlzIGluIGEgZGlmZmVyZW50IHllYXIuXG4gICAqL1xuICBfc2VsZWN0ZWRNb250aCE6IG51bWJlciB8IG51bGw7XG5cbiAgX2NhbGVuZGFyU3RhdGUhOiBzdHJpbmc7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgQE9wdGlvbmFsKCkgcHVibGljIF9hZGFwdGVyOiBEYXRldGltZUFkYXB0ZXI8RD4sXG4gICAgQE9wdGlvbmFsKCkgQEluamVjdChNVFhfREFURVRJTUVfRk9STUFUUykgcHJpdmF0ZSBfZGF0ZUZvcm1hdHM6IE10eERhdGV0aW1lRm9ybWF0c1xuICApIHtcbiAgICBpZiAoIXRoaXMuX2FkYXB0ZXIpIHtcbiAgICAgIHRocm93IGNyZWF0ZU1pc3NpbmdEYXRlSW1wbEVycm9yKCdEYXRldGltZUFkYXB0ZXInKTtcbiAgICB9XG5cbiAgICBpZiAoIXRoaXMuX2RhdGVGb3JtYXRzKSB7XG4gICAgICB0aHJvdyBjcmVhdGVNaXNzaW5nRGF0ZUltcGxFcnJvcignTVRYX0RBVEVUSU1FX0ZPUk1BVFMnKTtcbiAgICB9XG5cbiAgICB0aGlzLl9hY3RpdmVEYXRlID0gdGhpcy5fYWRhcHRlci50b2RheSgpO1xuICB9XG5cbiAgcHJpdmF0ZSBfYWN0aXZlRGF0ZTogRDtcblxuICAvKiogVGhlIGRhdGUgdG8gZGlzcGxheSBpbiB0aGlzIHllYXIgdmlldyAoZXZlcnl0aGluZyBvdGhlciB0aGFuIHRoZSB5ZWFyIGlzIGlnbm9yZWQpLiAqL1xuICBASW5wdXQoKVxuICBnZXQgYWN0aXZlRGF0ZSgpOiBEIHtcbiAgICByZXR1cm4gdGhpcy5fYWN0aXZlRGF0ZTtcbiAgfVxuXG4gIHNldCBhY3RpdmVEYXRlKHZhbHVlOiBEKSB7XG4gICAgY29uc3Qgb2xkQWN0aXZlRGF0ZSA9IHRoaXMuX2FjdGl2ZURhdGU7XG4gICAgdGhpcy5fYWN0aXZlRGF0ZSA9IHZhbHVlIHx8IHRoaXMuX2FkYXB0ZXIudG9kYXkoKTtcbiAgICBpZiAoXG4gICAgICBvbGRBY3RpdmVEYXRlICYmXG4gICAgICB0aGlzLl9hY3RpdmVEYXRlICYmXG4gICAgICAhdGhpcy5fYWRhcHRlci5zYW1lWWVhcihvbGRBY3RpdmVEYXRlLCB0aGlzLl9hY3RpdmVEYXRlKVxuICAgICkge1xuICAgICAgdGhpcy5faW5pdCgpO1xuICAgICAgLy8gaWYgKG9sZEFjdGl2ZURhdGUgPCB0aGlzLl9hY3RpdmVEYXRlKSB7XG4gICAgICAvLyAgdGhpcy5jYWxlbmRhclN0YXRlKCdyaWdodCcpO1xuICAgICAgLy8gfSBlbHNlIHtcbiAgICAgIC8vICB0aGlzLmNhbGVuZGFyU3RhdGUoJ2xlZnQnKTtcbiAgICAgIC8vIH1cbiAgICB9XG4gIH1cblxuICBwcml2YXRlIF9zZWxlY3RlZCE6IEQ7XG5cbiAgLyoqIFRoZSBjdXJyZW50bHkgc2VsZWN0ZWQgZGF0ZS4gKi9cbiAgQElucHV0KClcbiAgZ2V0IHNlbGVjdGVkKCk6IEQge1xuICAgIHJldHVybiB0aGlzLl9zZWxlY3RlZDtcbiAgfVxuXG4gIHNldCBzZWxlY3RlZCh2YWx1ZTogRCkge1xuICAgIHRoaXMuX3NlbGVjdGVkID0gdmFsdWU7XG4gICAgdGhpcy5fc2VsZWN0ZWRNb250aCA9IHRoaXMuX2dldE1vbnRoSW5DdXJyZW50WWVhcih0aGlzLnNlbGVjdGVkKTtcbiAgfVxuXG4gIG5nQWZ0ZXJDb250ZW50SW5pdCgpIHtcbiAgICB0aGlzLl9pbml0KCk7XG4gIH1cblxuICAvKiogSGFuZGxlcyB3aGVuIGEgbmV3IG1vbnRoIGlzIHNlbGVjdGVkLiAqL1xuICBfbW9udGhTZWxlY3RlZChtb250aDogbnVtYmVyKSB7XG4gICAgY29uc3Qgbm9ybWFsaXplZERhdGUgPSB0aGlzLl9hZGFwdGVyLmNyZWF0ZURhdGV0aW1lKFxuICAgICAgdGhpcy5fYWRhcHRlci5nZXRZZWFyKHRoaXMuYWN0aXZlRGF0ZSksXG4gICAgICBtb250aCxcbiAgICAgIDEsXG4gICAgICAwLFxuICAgICAgMFxuICAgICk7XG5cbiAgICB0aGlzLnNlbGVjdGVkQ2hhbmdlLmVtaXQoXG4gICAgICB0aGlzLl9hZGFwdGVyLmNyZWF0ZURhdGV0aW1lKFxuICAgICAgICB0aGlzLl9hZGFwdGVyLmdldFllYXIodGhpcy5hY3RpdmVEYXRlKSxcbiAgICAgICAgbW9udGgsXG4gICAgICAgIE1hdGgubWluKFxuICAgICAgICAgIHRoaXMuX2FkYXB0ZXIuZ2V0RGF0ZSh0aGlzLmFjdGl2ZURhdGUpLFxuICAgICAgICAgIHRoaXMuX2FkYXB0ZXIuZ2V0TnVtRGF5c0luTW9udGgobm9ybWFsaXplZERhdGUpXG4gICAgICAgICksXG4gICAgICAgIHRoaXMuX2FkYXB0ZXIuZ2V0SG91cih0aGlzLmFjdGl2ZURhdGUpLFxuICAgICAgICB0aGlzLl9hZGFwdGVyLmdldE1pbnV0ZSh0aGlzLmFjdGl2ZURhdGUpXG4gICAgICApXG4gICAgKTtcbiAgICBpZiAodGhpcy50eXBlID09PSAnbW9udGgnKSB7XG4gICAgICB0aGlzLl91c2VyU2VsZWN0aW9uLmVtaXQoKTtcbiAgICB9XG4gIH1cblxuICBfY2FsZW5kYXJTdGF0ZURvbmUoKSB7XG4gICAgdGhpcy5fY2FsZW5kYXJTdGF0ZSA9ICcnO1xuICB9XG5cbiAgLyoqIEluaXRpYWxpemVzIHRoaXMgbW9udGggdmlldy4gKi9cbiAgcHJpdmF0ZSBfaW5pdCgpIHtcbiAgICB0aGlzLl9zZWxlY3RlZE1vbnRoID0gdGhpcy5fZ2V0TW9udGhJbkN1cnJlbnRZZWFyKHRoaXMuc2VsZWN0ZWQpO1xuICAgIHRoaXMuX3RvZGF5TW9udGggPSB0aGlzLl9nZXRNb250aEluQ3VycmVudFllYXIodGhpcy5fYWRhcHRlci50b2RheSgpKTtcbiAgICB0aGlzLl95ZWFyTGFiZWwgPSB0aGlzLl9hZGFwdGVyLmdldFllYXJOYW1lKHRoaXMuYWN0aXZlRGF0ZSk7XG5cbiAgICBjb25zdCBtb250aE5hbWVzID0gdGhpcy5fYWRhcHRlci5nZXRNb250aE5hbWVzKCdzaG9ydCcpO1xuICAgIC8vIEZpcnN0IHJvdyBvZiBtb250aHMgb25seSBjb250YWlucyA1IGVsZW1lbnRzIHNvIHdlIGNhbiBmaXQgdGhlIHllYXIgbGFiZWwgb24gdGhlIHNhbWUgcm93LlxuICAgIHRoaXMuX21vbnRocyA9IFtcbiAgICAgIFswLCAxLCAyLCAzXSxcbiAgICAgIFs0LCA1LCA2LCA3XSxcbiAgICAgIFs4LCA5LCAxMCwgMTFdLFxuICAgIF0ubWFwKHJvdyA9PiByb3cubWFwKG1vbnRoID0+IHRoaXMuX2NyZWF0ZUNlbGxGb3JNb250aChtb250aCwgbW9udGhOYW1lc1ttb250aF0pKSk7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyB0aGUgbW9udGggaW4gdGhpcyB5ZWFyIHRoYXQgdGhlIGdpdmVuIERhdGUgZmFsbHMgb24uXG4gICAqIFJldHVybnMgbnVsbCBpZiB0aGUgZ2l2ZW4gRGF0ZSBpcyBpbiBhbm90aGVyIHllYXIuXG4gICAqL1xuICBwcml2YXRlIF9nZXRNb250aEluQ3VycmVudFllYXIoZGF0ZTogRCkge1xuICAgIHJldHVybiB0aGlzLl9hZGFwdGVyLnNhbWVZZWFyKGRhdGUsIHRoaXMuYWN0aXZlRGF0ZSkgPyB0aGlzLl9hZGFwdGVyLmdldE1vbnRoKGRhdGUpIDogbnVsbDtcbiAgfVxuXG4gIC8qKiBDcmVhdGVzIGFuIE1kQ2FsZW5kYXJDZWxsIGZvciB0aGUgZ2l2ZW4gbW9udGguICovXG4gIHByaXZhdGUgX2NyZWF0ZUNlbGxGb3JNb250aChtb250aDogbnVtYmVyLCBtb250aE5hbWU6IHN0cmluZykge1xuICAgIGNvbnN0IGFyaWFMYWJlbCA9IHRoaXMuX2FkYXB0ZXIuZm9ybWF0KFxuICAgICAgdGhpcy5fYWRhcHRlci5jcmVhdGVEYXRldGltZShcbiAgICAgICAgdGhpcy5fYWRhcHRlci5nZXRZZWFyKHRoaXMuYWN0aXZlRGF0ZSksXG4gICAgICAgIG1vbnRoLFxuICAgICAgICAxLFxuICAgICAgICB0aGlzLl9hZGFwdGVyLmdldEhvdXIodGhpcy5hY3RpdmVEYXRlKSxcbiAgICAgICAgdGhpcy5fYWRhcHRlci5nZXRNaW51dGUodGhpcy5hY3RpdmVEYXRlKVxuICAgICAgKSxcbiAgICAgIHRoaXMuX2RhdGVGb3JtYXRzLmRpc3BsYXkubW9udGhZZWFyQTExeUxhYmVsXG4gICAgKTtcbiAgICByZXR1cm4gbmV3IE10eENhbGVuZGFyQ2VsbChcbiAgICAgIG1vbnRoLFxuICAgICAgbW9udGhOYW1lLnRvTG9jYWxlVXBwZXJDYXNlKCksXG4gICAgICBhcmlhTGFiZWwsXG4gICAgICB0aGlzLl9pc01vbnRoRW5hYmxlZChtb250aClcbiAgICApO1xuICB9XG5cbiAgLy8gcHJpdmF0ZSBjYWxlbmRhclN0YXRlKGRpcmVjdGlvbjogc3RyaW5nKTogdm9pZCB7XG4gIC8vICAgdGhpcy5fY2FsZW5kYXJTdGF0ZSA9IGRpcmVjdGlvbjtcbiAgLy8gfVxuXG4gIC8qKiBXaGV0aGVyIHRoZSBnaXZlbiBtb250aCBpcyBlbmFibGVkLiAqL1xuICBwcml2YXRlIF9pc01vbnRoRW5hYmxlZChtb250aDogbnVtYmVyKSB7XG4gICAgaWYgKCF0aGlzLmRhdGVGaWx0ZXIpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGNvbnN0IGZpcnN0T2ZNb250aCA9IHRoaXMuX2FkYXB0ZXIuY3JlYXRlRGF0ZXRpbWUoXG4gICAgICB0aGlzLl9hZGFwdGVyLmdldFllYXIodGhpcy5hY3RpdmVEYXRlKSxcbiAgICAgIG1vbnRoLFxuICAgICAgMSxcbiAgICAgIHRoaXMuX2FkYXB0ZXIuZ2V0SG91cih0aGlzLmFjdGl2ZURhdGUpLFxuICAgICAgdGhpcy5fYWRhcHRlci5nZXRNaW51dGUodGhpcy5hY3RpdmVEYXRlKVxuICAgICk7XG5cbiAgICAvLyBJZiBhbnkgZGF0ZSBpbiB0aGUgbW9udGggaXMgZW5hYmxlZCBjb3VudCB0aGUgbW9udGggYXMgZW5hYmxlZC5cbiAgICBmb3IgKFxuICAgICAgbGV0IGRhdGUgPSBmaXJzdE9mTW9udGg7XG4gICAgICB0aGlzLl9hZGFwdGVyLmdldE1vbnRoKGRhdGUpID09PSBtb250aDtcbiAgICAgIGRhdGUgPSB0aGlzLl9hZGFwdGVyLmFkZENhbGVuZGFyRGF5cyhkYXRlLCAxKVxuICAgICkge1xuICAgICAgaWYgKHRoaXMuZGF0ZUZpbHRlcihkYXRlKSkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbn1cbiIsIjx0YWJsZSBjbGFzcz1cIm10eC1jYWxlbmRhci10YWJsZVwiIHJvbGU9XCJncmlkXCI+XG4gIDx0aGVhZCBjbGFzcz1cIm10eC1jYWxlbmRhci10YWJsZS1oZWFkZXJcIj48L3RoZWFkPlxuICA8dGJvZHkgbXR4LWNhbGVuZGFyLWJvZHlcbiAgICAgICAgIChAc2xpZGVDYWxlbmRhci5kb25lKT1cIl9jYWxlbmRhclN0YXRlRG9uZSgpXCJcbiAgICAgICAgIFtAc2xpZGVDYWxlbmRhcl09XCJfY2FsZW5kYXJTdGF0ZVwiXG4gICAgICAgICBbbGFiZWxdPVwiX3llYXJMYWJlbFwiXG4gICAgICAgICBbcm93c109XCJfbW9udGhzXCJcbiAgICAgICAgIFt0b2RheVZhbHVlXT1cIl90b2RheU1vbnRoIVwiXG4gICAgICAgICBbbGFiZWxNaW5SZXF1aXJlZENlbGxzXT1cIjJcIlxuICAgICAgICAgW251bUNvbHNdPVwiNFwiXG4gICAgICAgICBbYWN0aXZlQ2VsbF09XCJfYWRhcHRlci5nZXRNb250aChhY3RpdmVEYXRlKVwiXG4gICAgICAgICBbc2VsZWN0ZWRWYWx1ZV09XCJfc2VsZWN0ZWRNb250aCFcIlxuICAgICAgICAgKHNlbGVjdGVkVmFsdWVDaGFuZ2UpPVwiX21vbnRoU2VsZWN0ZWQoJGV2ZW50KVwiXG4gICAgICAgICBbYWxsb3dEaXNhYmxlZFNlbGVjdGlvbl09XCJ0cnVlXCI+PC90Ym9keT5cbjwvdGFibGU+XG4iXX0=