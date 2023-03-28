import { AfterContentInit, EventEmitter } from '@angular/core';
import { MtxCalendarCell } from './calendar-body';
import { MtxDatetimeFormats, DatetimeAdapter } from '@ng-matero/extensions/core';
import { MtxDatetimepickerType } from './datetimepicker-types';
import * as i0 from "@angular/core";
/**
 * An internal component used to display a single year in the datetimepicker.
 * @docs-private
 */
export declare class MtxYearView<D> implements AfterContentInit {
    _adapter: DatetimeAdapter<D>;
    private _dateFormats;
    type: MtxDatetimepickerType;
    /** A function used to filter which dates are selectable. */
    dateFilter: (date: D) => boolean;
    /** Emits when a new month is selected. */
    selectedChange: EventEmitter<D>;
    /** Emits when any date is selected. */
    readonly _userSelection: EventEmitter<void>;
    /** Grid of calendar cells representing the months of the year. */
    _months: MtxCalendarCell[][];
    /** The label for this year (e.g. "2017"). */
    _yearLabel: string;
    /** The month in this year that today falls on. Null if today is in a different year. */
    _todayMonth: number | null;
    /**
     * The month in this year that the selected Date falls on.
     * Null if the selected Date is in a different year.
     */
    _selectedMonth: number | null;
    _calendarState: string;
    constructor(_adapter: DatetimeAdapter<D>, _dateFormats: MtxDatetimeFormats);
    private _activeDate;
    /** The date to display in this year view (everything other than the year is ignored). */
    get activeDate(): D;
    set activeDate(value: D);
    private _selected;
    /** The currently selected date. */
    get selected(): D;
    set selected(value: D);
    ngAfterContentInit(): void;
    /** Handles when a new month is selected. */
    _monthSelected(month: number): void;
    _calendarStateDone(): void;
    /** Initializes this month view. */
    private _init;
    /**
     * Gets the month in this year that the given Date falls on.
     * Returns null if the given Date is in another year.
     */
    private _getMonthInCurrentYear;
    /** Creates an MdCalendarCell for the given month. */
    private _createCellForMonth;
    /** Whether the given month is enabled. */
    private _isMonthEnabled;
    static ɵfac: i0.ɵɵFactoryDeclaration<MtxYearView<any>, [{ optional: true; }, { optional: true; }]>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MtxYearView<any>, "mtx-year-view", ["mtxYearView"], { "type": "type"; "dateFilter": "dateFilter"; "activeDate": "activeDate"; "selected": "selected"; }, { "selectedChange": "selectedChange"; "_userSelection": "_userSelection"; }, never, never, false, never>;
}
