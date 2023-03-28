import { BooleanInput } from '@angular/cdk/coercion';
import { AfterContentInit, ChangeDetectorRef, ElementRef, EventEmitter, OnChanges, OnDestroy } from '@angular/core';
import { DatetimeAdapter } from '@ng-matero/extensions/core';
import { MtxDatetimepickerFilterType } from './datetimepicker-filtertype';
import { MtxAMPM } from './datetimepicker-types';
import * as i0 from "@angular/core";
export declare const CLOCK_RADIUS = 50;
export declare const CLOCK_INNER_RADIUS = 27.5;
export declare const CLOCK_OUTER_RADIUS = 41.25;
export declare const CLOCK_TICK_RADIUS = 7.0833;
/** Possible views for datetimepicker clock. */
export type MtxClockView = 'hour' | 'minute';
/**
 * A clock that is used as part of the datetimepicker.
 * @docs-private
 */
export declare class MtxClock<D> implements AfterContentInit, OnDestroy, OnChanges {
    private _elementRef;
    private _adapter;
    private _changeDetectorRef;
    private _document;
    /** A function used to filter which dates are selectable. */
    dateFilter: (date: D, type: MtxDatetimepickerFilterType) => boolean;
    /** Step over minutes. */
    interval: number;
    /** Whether the clock uses 12 hour format. */
    twelvehour: boolean;
    /** Whether the time is now in AM or PM. */
    AMPM: MtxAMPM;
    /** Emits when the currently selected date changes. */
    selectedChange: EventEmitter<D>;
    /** Emits when any date is activated. */
    activeDateChange: EventEmitter<D>;
    /** Emits when any date is selected. */
    readonly _userSelection: EventEmitter<void>;
    /** Whether the clock is in hour view. */
    _hourView: boolean;
    _hours: any[];
    _minutes: any[];
    _selectedHour: number;
    _selectedMinute: number;
    private _timeChanged;
    constructor(_elementRef: ElementRef, _adapter: DatetimeAdapter<D>, _changeDetectorRef: ChangeDetectorRef, _document: any);
    /**
     * The date to display in this clock view.
     */
    get activeDate(): D;
    set activeDate(value: D);
    private _activeDate;
    /** The currently selected date. */
    get selected(): D | null;
    set selected(value: D | null);
    private _selected;
    /** The minimum selectable date. */
    get minDate(): D | null;
    set minDate(value: D | null);
    private _minDate;
    /** The maximum selectable date. */
    get maxDate(): D | null;
    set maxDate(value: D | null);
    private _maxDate;
    /** Whether the clock should be started in hour or minute view. */
    set startView(value: MtxClockView);
    get _hand(): {
        height: string;
        marginTop: string;
        transform: string;
    };
    ngAfterContentInit(): void;
    ngOnDestroy(): void;
    ngOnChanges(): void;
    /** Called when the user has put their pointer down on the clock. */
    private _pointerDown;
    /**
     * Called when the user has moved their pointer after
     * starting to drag. Bound on the document level.
     */
    private _pointerMove;
    /** Called when the user has lifted their pointer. Bound on the document level. */
    private _pointerUp;
    /** Binds our global move and end events. */
    private _bindGlobalEvents;
    /** Removes any global event listeners that we may have added. */
    private _removeGlobalEvents;
    /** Initializes this clock view. */
    private _init;
    /**
     * Set Time
     * @param event
     */
    private setTime;
    static ngAcceptInputType_twelvehour: BooleanInput;
    static ɵfac: i0.ɵɵFactoryDeclaration<MtxClock<any>, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MtxClock<any>, "mtx-clock", ["mtxClock"], { "dateFilter": "dateFilter"; "interval": "interval"; "twelvehour": "twelvehour"; "AMPM": "AMPM"; "activeDate": "activeDate"; "selected": "selected"; "minDate": "minDate"; "maxDate": "maxDate"; "startView": "startView"; }, { "selectedChange": "selectedChange"; "activeDateChange": "activeDateChange"; "_userSelection": "_userSelection"; }, never, never, false, never>;
}
