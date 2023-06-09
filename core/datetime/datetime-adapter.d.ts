import { DateAdapter } from '@angular/material/core';
export declare abstract class DatetimeAdapter<D> extends DateAdapter<D> {
    protected _delegate: DateAdapter<D>;
    constructor(_delegate: DateAdapter<D>);
    abstract getHour(date: D): number;
    abstract getMinute(date: D): number;
    abstract getFirstDateOfMonth(date: D): D;
    abstract isInNextMonth(startDate: D, endDate: D): boolean;
    abstract getHourNames(): string[];
    abstract getMinuteNames(): string[];
    abstract addCalendarHours(date: D, months: number): D;
    abstract addCalendarMinutes(date: D, minutes: number): D;
    abstract createDatetime(year: number, month: number, date: number, hour: number, minute: number): D;
    getValidDateOrNull(obj: any): D | null;
    compareDatetime(first: D, second: D, respectMinutePart?: boolean): number | boolean;
    sameDatetime(first: D | null, second: D | null): boolean;
    sameYear(first: D, second: D): boolean;
    sameDay(first: D, second: D): boolean;
    sameHour(first: D, second: D): boolean;
    sameMinute(first: D, second: D): boolean;
    sameMonthAndYear(first: D | null, second: D | null): boolean;
    clone(date: D): D;
    addCalendarYears(date: D, years: number): D;
    addCalendarMonths(date: D, months: number): D;
    addCalendarDays(date: D, days: number): D;
    getYear(date: D): number;
    getMonth(date: D): number;
    getDate(date: D): number;
    getDayOfWeek(date: D): number;
    getMonthNames(style: any): string[];
    getDateNames(): string[];
    getDayOfWeekNames(style: any): string[];
    getYearName(date: D): string;
    getFirstDayOfWeek(): number;
    getNumDaysInMonth(date: D): number;
    createDate(year: number, month: number, date: number): D;
    today(): D;
    parse(value: any, parseFormat: any): D | null;
    format(date: D, displayFormat: any): string;
    toIso8601(date: D): string;
    isDateInstance(obj: any): boolean;
    isValid(date: D): boolean;
    invalid(): D;
    clampDate(date: D, min?: D | null, max?: D | null): D;
}
