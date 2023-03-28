import { normalizePassiveListenerOptions } from '@angular/cdk/platform';
import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Inject, Input, Output, ViewEncapsulation, } from '@angular/core';
import { MtxDatetimepickerFilterType } from './datetimepicker-filtertype';
import * as i0 from "@angular/core";
import * as i1 from "@ng-matero/extensions/core";
import * as i2 from "@angular/common";
const activeEventOptions = normalizePassiveListenerOptions({ passive: false });
export const CLOCK_RADIUS = 50;
export const CLOCK_INNER_RADIUS = 27.5;
export const CLOCK_OUTER_RADIUS = 41.25;
export const CLOCK_TICK_RADIUS = 7.0833;
/**
 * A clock that is used as part of the datetimepicker.
 * @docs-private
 */
export class MtxClock {
    constructor(_elementRef, _adapter, _changeDetectorRef, _document) {
        this._elementRef = _elementRef;
        this._adapter = _adapter;
        this._changeDetectorRef = _changeDetectorRef;
        this._document = _document;
        /** Step over minutes. */
        this.interval = 1;
        /** Whether the clock uses 12 hour format. */
        this.twelvehour = false;
        /** Whether the time is now in AM or PM. */
        this.AMPM = 'AM';
        /** Emits when the currently selected date changes. */
        this.selectedChange = new EventEmitter();
        /** Emits when any date is activated. */
        this.activeDateChange = new EventEmitter();
        /** Emits when any date is selected. */
        this._userSelection = new EventEmitter();
        /** Whether the clock is in hour view. */
        this._hourView = true;
        this._hours = [];
        this._minutes = [];
        this._timeChanged = false;
        /** Called when the user has put their pointer down on the clock. */
        this._pointerDown = (event) => {
            this._timeChanged = false;
            this.setTime(event);
            this._bindGlobalEvents(event);
        };
        /**
         * Called when the user has moved their pointer after
         * starting to drag. Bound on the document level.
         */
        this._pointerMove = (event) => {
            if (event.cancelable) {
                event.preventDefault();
            }
            this.setTime(event);
        };
        /** Called when the user has lifted their pointer. Bound on the document level. */
        this._pointerUp = (event) => {
            if (event.cancelable) {
                event.preventDefault();
            }
            this._removeGlobalEvents();
            if (this._timeChanged) {
                this.selectedChange.emit(this.activeDate);
                if (!this._hourView) {
                    this._userSelection.emit();
                }
            }
        };
    }
    /**
     * The date to display in this clock view.
     */
    get activeDate() {
        return this._activeDate;
    }
    set activeDate(value) {
        const oldActiveDate = this._activeDate;
        this._activeDate = this._adapter.clampDate(value, this.minDate, this.maxDate);
        if (!this._adapter.sameMinute(oldActiveDate, this._activeDate)) {
            this._init();
        }
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
    set startView(value) {
        this._hourView = value !== 'minute';
    }
    get _hand() {
        const hour = this._adapter.getHour(this.activeDate);
        this._selectedHour = hour;
        this._selectedMinute = this._adapter.getMinute(this.activeDate);
        let deg = 0;
        let radius = CLOCK_OUTER_RADIUS;
        if (this._hourView) {
            const outer = this._selectedHour > 0 && this._selectedHour < 13;
            radius = outer ? CLOCK_OUTER_RADIUS : CLOCK_INNER_RADIUS;
            if (this.twelvehour) {
                radius = CLOCK_OUTER_RADIUS;
            }
            deg = Math.round(this._selectedHour * (360 / (24 / 2)));
        }
        else {
            deg = Math.round(this._selectedMinute * (360 / 60));
        }
        return {
            height: `${radius}%`,
            marginTop: `${50 - radius}%`,
            transform: `rotate(${deg}deg)`,
        };
    }
    ngAfterContentInit() {
        this.activeDate = this._activeDate || this._adapter.today();
        this._init();
    }
    ngOnDestroy() {
        this._removeGlobalEvents();
    }
    ngOnChanges() {
        this._init();
    }
    /** Binds our global move and end events. */
    _bindGlobalEvents(triggerEvent) {
        // Note that we bind the events to the `document`, because it allows us to capture
        // drag cancel events where the user's pointer is outside the browser window.
        const document = this._document;
        const isTouch = isTouchEvent(triggerEvent);
        const moveEventName = isTouch ? 'touchmove' : 'mousemove';
        const endEventName = isTouch ? 'touchend' : 'mouseup';
        document.addEventListener(moveEventName, this._pointerMove, activeEventOptions);
        document.addEventListener(endEventName, this._pointerUp, activeEventOptions);
        if (isTouch) {
            document.addEventListener('touchcancel', this._pointerUp, activeEventOptions);
        }
    }
    /** Removes any global event listeners that we may have added. */
    _removeGlobalEvents() {
        const document = this._document;
        document.removeEventListener('mousemove', this._pointerMove, activeEventOptions);
        document.removeEventListener('mouseup', this._pointerUp, activeEventOptions);
        document.removeEventListener('touchmove', this._pointerMove, activeEventOptions);
        document.removeEventListener('touchend', this._pointerUp, activeEventOptions);
        document.removeEventListener('touchcancel', this._pointerUp, activeEventOptions);
    }
    /** Initializes this clock view. */
    _init() {
        this._hours.length = 0;
        this._minutes.length = 0;
        const hourNames = this._adapter.getHourNames();
        const minuteNames = this._adapter.getMinuteNames();
        if (this.twelvehour) {
            const hours = [];
            for (let i = 0; i < hourNames.length; i++) {
                const radian = (i / 6) * Math.PI;
                const radius = CLOCK_OUTER_RADIUS;
                const hour = i;
                const date = this._adapter.createDatetime(this._adapter.getYear(this.activeDate), this._adapter.getMonth(this.activeDate), this._adapter.getDate(this.activeDate), hour, 0);
                // Check if the date is enabled, no need to respect the minute setting here
                const enabled = (!this.minDate || this._adapter.compareDatetime(date, this.minDate, false) >= 0) &&
                    (!this.maxDate || this._adapter.compareDatetime(date, this.maxDate, false) <= 0) &&
                    (!this.dateFilter || this.dateFilter(date, MtxDatetimepickerFilterType.HOUR));
                // display value for twelvehour clock should be from 1-12 not including 0 and not above 12
                hours.push({
                    value: i,
                    displayValue: i % 12 === 0 ? '12' : hourNames[i % 12],
                    enabled,
                    top: CLOCK_RADIUS - Math.cos(radian) * radius - CLOCK_TICK_RADIUS,
                    left: CLOCK_RADIUS + Math.sin(radian) * radius - CLOCK_TICK_RADIUS,
                });
            }
            // filter out AM or PM hours based on AMPM
            if (this.AMPM === 'AM') {
                this._hours = hours.filter(x => x.value < 12);
            }
            else {
                this._hours = hours.filter(x => x.value >= 12);
            }
        }
        else {
            for (let i = 0; i < hourNames.length; i++) {
                const radian = (i / 6) * Math.PI;
                const outer = i > 0 && i < 13;
                const radius = outer ? CLOCK_OUTER_RADIUS : CLOCK_INNER_RADIUS;
                const date = this._adapter.createDatetime(this._adapter.getYear(this.activeDate), this._adapter.getMonth(this.activeDate), this._adapter.getDate(this.activeDate), i, 0);
                // Check if the date is enabled, no need to respect the minute setting here
                const enabled = (!this.minDate || this._adapter.compareDatetime(date, this.minDate, false) >= 0) &&
                    (!this.maxDate || this._adapter.compareDatetime(date, this.maxDate, false) <= 0) &&
                    (!this.dateFilter || this.dateFilter(date, MtxDatetimepickerFilterType.HOUR));
                this._hours.push({
                    value: i,
                    displayValue: i === 0 ? '00' : hourNames[i],
                    enabled,
                    top: CLOCK_RADIUS - Math.cos(radian) * radius - CLOCK_TICK_RADIUS,
                    left: CLOCK_RADIUS + Math.sin(radian) * radius - CLOCK_TICK_RADIUS,
                    fontSize: i > 0 && i < 13 ? '' : '80%',
                });
            }
        }
        for (let i = 0; i < minuteNames.length; i += 5) {
            const radian = (i / 30) * Math.PI;
            const date = this._adapter.createDatetime(this._adapter.getYear(this.activeDate), this._adapter.getMonth(this.activeDate), this._adapter.getDate(this.activeDate), this._adapter.getHour(this.activeDate), i);
            const enabled = (!this.minDate || this._adapter.compareDatetime(date, this.minDate) >= 0) &&
                (!this.maxDate || this._adapter.compareDatetime(date, this.maxDate) <= 0) &&
                (!this.dateFilter || this.dateFilter(date, MtxDatetimepickerFilterType.MINUTE));
            this._minutes.push({
                value: i,
                displayValue: i === 0 ? '00' : minuteNames[i],
                enabled,
                top: CLOCK_RADIUS - Math.cos(radian) * CLOCK_OUTER_RADIUS - CLOCK_TICK_RADIUS,
                left: CLOCK_RADIUS + Math.sin(radian) * CLOCK_OUTER_RADIUS - CLOCK_TICK_RADIUS,
            });
        }
    }
    /**
     * Set Time
     * @param event
     */
    setTime(event) {
        const trigger = this._elementRef.nativeElement;
        const triggerRect = trigger.getBoundingClientRect();
        const width = trigger.offsetWidth;
        const height = trigger.offsetHeight;
        const { pageX, pageY } = getPointerPositionOnPage(event);
        const x = width / 2 - (pageX - triggerRect.left - window.pageXOffset);
        const y = height / 2 - (pageY - triggerRect.top - window.pageYOffset);
        let radian = Math.atan2(-x, y);
        const unit = Math.PI / (this._hourView ? 6 : this.interval ? 30 / this.interval : 30);
        const z = Math.sqrt(x * x + y * y);
        const outer = this._hourView &&
            z > (width * (CLOCK_OUTER_RADIUS / 100) + width * (CLOCK_INNER_RADIUS / 100)) / 2;
        if (radian < 0) {
            radian = Math.PI * 2 + radian;
        }
        let value = Math.round(radian / unit);
        let date;
        if (this._hourView) {
            if (this.twelvehour) {
                if (this.AMPM === 'AM') {
                    value = value === 0 ? 12 : value;
                }
                else {
                    // if we chosen 12 in PM, the value should be 0 for 0:00,
                    // else we can safely add 12 to the final value
                    value = value === 12 ? 0 : value + 12;
                }
            }
            else {
                if (value === 12) {
                    value = 0;
                }
                value = outer ? (value === 0 ? 12 : value) : value === 0 ? 0 : value + 12;
            }
            date = this._adapter.createDatetime(this._adapter.getYear(this.activeDate), this._adapter.getMonth(this.activeDate), this._adapter.getDate(this.activeDate), value, this._adapter.getMinute(this.activeDate));
        }
        else {
            if (this.interval) {
                value *= this.interval;
            }
            if (value === 60) {
                value = 0;
            }
            date = this._adapter.createDatetime(this._adapter.getYear(this.activeDate), this._adapter.getMonth(this.activeDate), this._adapter.getDate(this.activeDate), this._adapter.getHour(this.activeDate), value);
        }
        this._timeChanged = true;
        this.activeDate = date;
        this._changeDetectorRef.markForCheck();
        this.activeDateChange.emit(this.activeDate);
    }
}
/** @nocollapse */ MtxClock.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MtxClock, deps: [{ token: i0.ElementRef }, { token: i1.DatetimeAdapter }, { token: i0.ChangeDetectorRef }, { token: DOCUMENT }], target: i0.ɵɵFactoryTarget.Component });
/** @nocollapse */ MtxClock.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.1", type: MtxClock, selector: "mtx-clock", inputs: { dateFilter: "dateFilter", interval: "interval", twelvehour: "twelvehour", AMPM: "AMPM", activeDate: "activeDate", selected: "selected", minDate: "minDate", maxDate: "maxDate", startView: "startView" }, outputs: { selectedChange: "selectedChange", activeDateChange: "activeDateChange", _userSelection: "_userSelection" }, host: { attributes: { "role": "clock" }, listeners: { "mousedown": "_pointerDown($event)", "touchstart": "_pointerDown($event)" }, classAttribute: "mtx-clock" }, exportAs: ["mtxClock"], usesOnChanges: true, ngImport: i0, template: "<div class=\"mtx-clock-wrapper\">\n  <div class=\"mtx-clock-center\"></div>\n  <div class=\"mtx-clock-hand\" [ngStyle]=\"_hand\"></div>\n  <div class=\"mtx-clock-hours\" [class.active]=\"_hourView\">\n    <div *ngFor=\"let item of _hours\"\n         class=\"mtx-clock-cell\"\n         [class.mtx-clock-cell-disabled]=\"!item.enabled\"\n         [class.mtx-clock-cell-selected]=\"_selectedHour === item.value\"\n         [style.fontSize]=\"item.fontSize\"\n         [style.left]=\"item.left+'%'\"\n         [style.top]=\"item.top+'%'\">{{ item.displayValue }}</div>\n  </div>\n  <div class=\"mtx-clock-minutes\" [class.active]=\"!_hourView\">\n    <div *ngFor=\"let item of _minutes\"\n         class=\"mtx-clock-cell\"\n         [class.mtx-clock-cell-disabled]=\"!item.enabled\"\n         [class.mtx-clock-cell-selected]=\"_selectedMinute === item.value\"\n         [style.left]=\"item.left+'%'\"\n         [style.top]=\"item.top+'%'\">{{ item.displayValue }}</div>\n  </div>\n</div>\n", styles: [".mtx-clock{position:relative;display:block;min-width:224px;margin:12px;box-sizing:border-box;-webkit-user-select:none;user-select:none;touch-action:none}.mtx-clock-wrapper{position:relative;width:100%;height:0;padding-top:100%;border-radius:50%}.mtx-clock-center{position:absolute;top:50%;left:50%;width:2%;height:2%;margin:-1%;border-radius:50%}.mtx-clock-hand{position:absolute;inset:0;width:1px;margin:0 auto;transform-origin:bottom}.mtx-clock-hand:before{content:\"\";position:absolute;top:-4px;left:-4px;width:8px;height:8px;border-radius:50%}.mtx-clock-hours,.mtx-clock-minutes{position:absolute;top:0;left:0;width:100%;height:100%;opacity:0;visibility:hidden;transition:.35s;transform:scale(1.2)}.mtx-clock-hours.active,.mtx-clock-minutes.active{opacity:1;visibility:visible;transform:scale(1)}.mtx-clock-minutes{transform:scale(.8)}.mtx-clock-cell{position:absolute;display:flex;width:14.1666%;height:14.1666%;justify-content:center;box-sizing:border-box;border-radius:50%;align-items:center;cursor:pointer}.mtx-clock-cell.mtx-clock-cell-disabled{pointer-events:none}\n"], dependencies: [{ kind: "directive", type: i2.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i2.NgStyle, selector: "[ngStyle]", inputs: ["ngStyle"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MtxClock, decorators: [{
            type: Component,
            args: [{ selector: 'mtx-clock', host: {
                        'role': 'clock',
                        'class': 'mtx-clock',
                        '(mousedown)': '_pointerDown($event)',
                        '(touchstart)': '_pointerDown($event)',
                    }, exportAs: 'mtxClock', encapsulation: ViewEncapsulation.None, changeDetection: ChangeDetectionStrategy.OnPush, template: "<div class=\"mtx-clock-wrapper\">\n  <div class=\"mtx-clock-center\"></div>\n  <div class=\"mtx-clock-hand\" [ngStyle]=\"_hand\"></div>\n  <div class=\"mtx-clock-hours\" [class.active]=\"_hourView\">\n    <div *ngFor=\"let item of _hours\"\n         class=\"mtx-clock-cell\"\n         [class.mtx-clock-cell-disabled]=\"!item.enabled\"\n         [class.mtx-clock-cell-selected]=\"_selectedHour === item.value\"\n         [style.fontSize]=\"item.fontSize\"\n         [style.left]=\"item.left+'%'\"\n         [style.top]=\"item.top+'%'\">{{ item.displayValue }}</div>\n  </div>\n  <div class=\"mtx-clock-minutes\" [class.active]=\"!_hourView\">\n    <div *ngFor=\"let item of _minutes\"\n         class=\"mtx-clock-cell\"\n         [class.mtx-clock-cell-disabled]=\"!item.enabled\"\n         [class.mtx-clock-cell-selected]=\"_selectedMinute === item.value\"\n         [style.left]=\"item.left+'%'\"\n         [style.top]=\"item.top+'%'\">{{ item.displayValue }}</div>\n  </div>\n</div>\n", styles: [".mtx-clock{position:relative;display:block;min-width:224px;margin:12px;box-sizing:border-box;-webkit-user-select:none;user-select:none;touch-action:none}.mtx-clock-wrapper{position:relative;width:100%;height:0;padding-top:100%;border-radius:50%}.mtx-clock-center{position:absolute;top:50%;left:50%;width:2%;height:2%;margin:-1%;border-radius:50%}.mtx-clock-hand{position:absolute;inset:0;width:1px;margin:0 auto;transform-origin:bottom}.mtx-clock-hand:before{content:\"\";position:absolute;top:-4px;left:-4px;width:8px;height:8px;border-radius:50%}.mtx-clock-hours,.mtx-clock-minutes{position:absolute;top:0;left:0;width:100%;height:100%;opacity:0;visibility:hidden;transition:.35s;transform:scale(1.2)}.mtx-clock-hours.active,.mtx-clock-minutes.active{opacity:1;visibility:visible;transform:scale(1)}.mtx-clock-minutes{transform:scale(.8)}.mtx-clock-cell{position:absolute;display:flex;width:14.1666%;height:14.1666%;justify-content:center;box-sizing:border-box;border-radius:50%;align-items:center;cursor:pointer}.mtx-clock-cell.mtx-clock-cell-disabled{pointer-events:none}\n"] }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i1.DatetimeAdapter }, { type: i0.ChangeDetectorRef }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }]; }, propDecorators: { dateFilter: [{
                type: Input
            }], interval: [{
                type: Input
            }], twelvehour: [{
                type: Input
            }], AMPM: [{
                type: Input
            }], selectedChange: [{
                type: Output
            }], activeDateChange: [{
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
            }], startView: [{
                type: Input
            }] } });
/** Returns whether an event is a touch event. */
function isTouchEvent(event) {
    // This function is called for every pixel that the user has dragged so we need it to be
    // as fast as possible. Since we only bind mouse events and touch events, we can assume
    // that if the event's name starts with `t`, it's a touch event.
    return event.type[0] === 't';
}
/** Gets the coordinates of a touch or mouse event relative to the document. */
function getPointerPositionOnPage(event) {
    let point;
    if (isTouchEvent(event)) {
        // `touches` will be empty for start/end events so we have to fall back to `changedTouches`.
        point = event.touches[0] || event.changedTouches[0];
    }
    else {
        point = event;
    }
    return point;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xvY2suanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wcm9qZWN0cy9leHRlbnNpb25zL2RhdGV0aW1lcGlja2VyL2Nsb2NrLnRzIiwiLi4vLi4vLi4vLi4vcHJvamVjdHMvZXh0ZW5zaW9ucy9kYXRldGltZXBpY2tlci9jbG9jay5odG1sIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNBLE9BQU8sRUFBRSwrQkFBK0IsRUFBRSxNQUFNLHVCQUF1QixDQUFDO0FBQ3hFLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUMzQyxPQUFPLEVBRUwsdUJBQXVCLEVBRXZCLFNBQVMsRUFFVCxZQUFZLEVBQ1osTUFBTSxFQUNOLEtBQUssRUFHTCxNQUFNLEVBRU4saUJBQWlCLEdBQ2xCLE1BQU0sZUFBZSxDQUFDO0FBRXZCLE9BQU8sRUFBRSwyQkFBMkIsRUFBRSxNQUFNLDZCQUE2QixDQUFDOzs7O0FBRzFFLE1BQU0sa0JBQWtCLEdBQUcsK0JBQStCLENBQUMsRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQztBQUUvRSxNQUFNLENBQUMsTUFBTSxZQUFZLEdBQUcsRUFBRSxDQUFDO0FBQy9CLE1BQU0sQ0FBQyxNQUFNLGtCQUFrQixHQUFHLElBQUksQ0FBQztBQUN2QyxNQUFNLENBQUMsTUFBTSxrQkFBa0IsR0FBRyxLQUFLLENBQUM7QUFDeEMsTUFBTSxDQUFDLE1BQU0saUJBQWlCLEdBQUcsTUFBTSxDQUFDO0FBS3hDOzs7R0FHRztBQWVILE1BQU0sT0FBTyxRQUFRO0lBbUNuQixZQUNVLFdBQXVCLEVBQ3ZCLFFBQTRCLEVBQzVCLGtCQUFxQyxFQUNuQixTQUFjO1FBSGhDLGdCQUFXLEdBQVgsV0FBVyxDQUFZO1FBQ3ZCLGFBQVEsR0FBUixRQUFRLENBQW9CO1FBQzVCLHVCQUFrQixHQUFsQixrQkFBa0IsQ0FBbUI7UUFDbkIsY0FBUyxHQUFULFNBQVMsQ0FBSztRQW5DMUMseUJBQXlCO1FBQ2hC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QU07Z0JBMEJILFVBQVU7c0JBRGIsS0FBSztnQkFlRixRQUFRO3NCQURYLEtBQUs7Z0JBY0YsT0FBTztzQkFEVixLQUFLO2dCQVdGLE9BQU87c0JBRFYsS0FBSztnQkFXRixTQUFTO3NCQURaLEtBQUs7O0FBK1FSLGlEQUFpRDtBQUNqRCxTQUFTLFlBQVksQ0FBQyxLQUE4QjtJQUNsRCx3RkFBd0Y7SUFDeEYsdUZBQXVGO0lBQ3ZGLGdFQUFnRTtJQUNoRSxPQUFPLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDO0FBQy9CLENBQUM7QUFFRCwrRUFBK0U7QUFDL0UsU0FBUyx3QkFBd0IsQ0FBQyxLQUE4QjtJQUM5RCxJQUFJLEtBQXVDLENBQUM7SUFFNUMsSUFBSSxZQUFZLENBQUMsS0FBSyxDQUFDLEVBQUU7UUFDdkIsNEZBQTRGO1FBQzVGLEtBQUssR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFJLEtBQUssQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDckQ7U0FBTTtRQUNMLEtBQUssR0FBRyxLQUFLLENBQUM7S0FDZjtJQUVELE9BQU8sS0FBSyxDQUFDO0FBQ2YsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEJvb2xlYW5JbnB1dCB9IGZyb20gJ0Bhbmd1bGFyL2Nkay9jb2VyY2lvbic7XG5pbXBvcnQgeyBub3JtYWxpemVQYXNzaXZlTGlzdGVuZXJPcHRpb25zIH0gZnJvbSAnQGFuZ3VsYXIvY2RrL3BsYXRmb3JtJztcbmltcG9ydCB7IERPQ1VNRU5UIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7XG4gIEFmdGVyQ29udGVudEluaXQsXG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBDaGFuZ2VEZXRlY3RvclJlZixcbiAgQ29tcG9uZW50LFxuICBFbGVtZW50UmVmLFxuICBFdmVudEVtaXR0ZXIsXG4gIEluamVjdCxcbiAgSW5wdXQsXG4gIE9uQ2hhbmdlcyxcbiAgT25EZXN0cm95LFxuICBPdXRwdXQsXG4gIFNpbXBsZUNoYW5nZXMsXG4gIFZpZXdFbmNhcHN1bGF0aW9uLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IERhdGV0aW1lQWRhcHRlciB9IGZyb20gJ0BuZy1tYXRlcm8vZXh0ZW5zaW9ucy9jb3JlJztcbmltcG9ydCB7IE10eERhdGV0aW1lcGlja2VyRmlsdGVyVHlwZSB9IGZyb20gJy4vZGF0ZXRpbWVwaWNrZXItZmlsdGVydHlwZSc7XG5pbXBvcnQgeyBNdHhBTVBNIH0gZnJvbSAnLi9kYXRldGltZXBpY2tlci10eXBlcyc7XG5cbmNvbnN0IGFjdGl2ZUV2ZW50T3B0aW9ucyA9IG5vcm1hbGl6ZVBhc3NpdmVMaXN0ZW5lck9wdGlvbnMoeyBwYXNzaXZlOiBmYWxzZSB9KTtcblxuZXhwb3J0IGNvbnN0IENMT0NLX1JBRElVUyA9IDUwO1xuZXhwb3J0IGNvbnN0IENMT0NLX0lOTkVSX1JBRElVUyA9IDI3LjU7XG5leHBvcnQgY29uc3QgQ0xPQ0tfT1VURVJfUkFESVVTID0gNDEuMjU7XG5leHBvcnQgY29uc3QgQ0xPQ0tfVElDS19SQURJVVMgPSA3LjA4MzM7XG5cbi8qKiBQb3NzaWJsZSB2aWV3cyBmb3IgZGF0ZXRpbWVwaWNrZXIgY2xvY2suICovXG5leHBvcnQgdHlwZSBNdHhDbG9ja1ZpZXcgPSAnaG91cicgfCAnbWludXRlJztcblxuLyoqXG4gKiBBIGNsb2NrIHRoYXQgaXMgdXNlZCBhcyBwYXJ0IG9mIHRoZSBkYXRldGltZXBpY2tlci5cbiAqIEBkb2NzLXByaXZhdGVcbiAqL1xuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbXR4LWNsb2NrJyxcbiAgdGVtcGxhdGVVcmw6ICdjbG9jay5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJ2Nsb2NrLnNjc3MnXSxcbiAgaG9zdDoge1xuICAgICdyb2xlJzogJ2Nsb2NrJyxcbiAgICAnY2xhc3MnOiAnbXR4LWNsb2NrJyxcbiAgICAnKG1vdXNlZG93biknOiAnX3BvaW50ZXJEb3duKCRldmVudCknLFxuICAgICcodG91Y2hzdGFydCknOiAnX3BvaW50ZXJEb3duKCRldmVudCknLFxuICB9LFxuICBleHBvcnRBczogJ210eENsb2NrJyxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG59KVxuZXhwb3J0IGNsYXNzIE10eENsb2NrPEQ+IGltcGxlbWVudHMgQWZ0ZXJDb250ZW50SW5pdCwgT25EZXN0cm95LCBPbkNoYW5nZXMge1xuICAvKiogQSBmdW5jdGlvbiB1c2VkIHRvIGZpbHRlciB3aGljaCBkYXRlcyBhcmUgc2VsZWN0YWJsZS4gKi9cbiAgQElucHV0KCkgZGF0ZUZpbHRlciE6IChkYXRlOiBELCB0eXBlOiBNdHhEYXRldGltZXBpY2tlckZpbHRlclR5cGUpID0+IGJvb2xlYW47XG5cbiAgLyoqIFN0ZXAgb3ZlciBtaW51dGVzLiAqL1xuICBASW5wdXQoKSBpbnRlcnZhbDogbnVtYmVyID0gMTtcblxuICAvKiogV2hldGhlciB0aGUgY2xvY2sgdXNlcyAxMiBob3VyIGZvcm1hdC4gKi9cbiAgQElucHV0KCkgdHdlbHZlaG91cjogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSB0aW1lIGlzIG5vdyBpbiBBTSBvciBQTS4gKi9cbiAgQElucHV0KCkgQU1QTTogTXR4QU1QTSA9ICdBTSc7XG5cbiAgLyoqIEVtaXRzIHdoZW4gdGhlIGN1cnJlbnRseSBzZWxlY3RlZCBkYXRlIGNoYW5nZXMuICovXG4gIEBPdXRwdXQoKSBzZWxlY3RlZENoYW5nZSA9IG5ldyBFdmVudEVtaXR0ZXI8RD4oKTtcblxuICAvKiogRW1pdHMgd2hlbiBhbnkgZGF0ZSBpcyBhY3RpdmF0ZWQuICovXG4gIEBPdXRwdXQoKSBhY3RpdmVEYXRlQ2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcjxEPigpO1xuXG4gIC8qKiBFbWl0cyB3aGVuIGFueSBkYXRlIGlzIHNlbGVjdGVkLiAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgX3VzZXJTZWxlY3Rpb24gPSBuZXcgRXZlbnRFbWl0dGVyPHZvaWQ+KCk7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGNsb2NrIGlzIGluIGhvdXIgdmlldy4gKi9cbiAgX2hvdXJWaWV3OiBib29sZWFuID0gdHJ1ZTtcblxuICBfaG91cnM6IGFueVtdID0gW107XG5cbiAgX21pbnV0ZXM6IGFueVtdID0gW107XG5cbiAgX3NlbGVjdGVkSG91ciE6IG51bWJlcjtcblxuICBfc2VsZWN0ZWRNaW51dGUhOiBudW1iZXI7XG5cbiAgcHJpdmF0ZSBfdGltZUNoYW5nZWQgPSBmYWxzZTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIF9lbGVtZW50UmVmOiBFbGVtZW50UmVmLFxuICAgIHByaXZhdGUgX2FkYXB0ZXI6IERhdGV0aW1lQWRhcHRlcjxEPixcbiAgICBwcml2YXRlIF9jaGFuZ2VEZXRlY3RvclJlZjogQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gICAgQEluamVjdChET0NVTUVOVCkgcHJpdmF0ZSBfZG9jdW1lbnQ6IGFueVxuICApIHt9XG5cbiAgLyoqXG4gICAqIFRoZSBkYXRlIHRvIGRpc3BsYXkgaW4gdGhpcyBjbG9jayB2aWV3LlxuICAgKi9cbiAgQElucHV0KClcbiAgZ2V0IGFjdGl2ZURhdGUoKTogRCB7XG4gICAgcmV0dXJuIHRoaXMuX2FjdGl2ZURhdGU7XG4gIH1cbiAgc2V0IGFjdGl2ZURhdGUodmFsdWU6IEQpIHtcbiAgICBjb25zdCBvbGRBY3RpdmVEYXRlID0gdGhpcy5fYWN0aXZlRGF0ZTtcbiAgICB0aGlzLl9hY3RpdmVEYXRlID0gdGhpcy5fYWRhcHRlci5jbGFtcERhdGUodmFsdWUsIHRoaXMubWluRGF0ZSwgdGhpcy5tYXhEYXRlKTtcbiAgICBpZiAoIXRoaXMuX2FkYXB0ZXIuc2FtZU1pbnV0ZShvbGRBY3RpdmVEYXRlLCB0aGlzLl9hY3RpdmVEYXRlKSkge1xuICAgICAgdGhpcy5faW5pdCgpO1xuICAgIH1cbiAgfVxuICBwcml2YXRlIF9hY3RpdmVEYXRlITogRDtcblxuICAvKiogVGhlIGN1cnJlbnRseSBzZWxlY3RlZCBkYXRlLiAqL1xuICBASW5wdXQoKVxuICBnZXQgc2VsZWN0ZWQoKTogRCB8IG51bGwge1xuICAgIHJldHVybiB0aGlzLl9zZWxlY3RlZDtcbiAgfVxuICBzZXQgc2VsZWN0ZWQodmFsdWU6IEQgfCBudWxsKSB7XG4gICAgdGhpcy5fc2VsZWN0ZWQgPSB0aGlzLl9hZGFwdGVyLmdldFZhbGlkRGF0ZU9yTnVsbCh0aGlzLl9hZGFwdGVyLmRlc2VyaWFsaXplKHZhbHVlKSk7XG4gICAgaWYgKHRoaXMuX3NlbGVjdGVkKSB7XG4gICAgICB0aGlzLmFjdGl2ZURhdGUgPSB0aGlzLl9zZWxlY3RlZDtcbiAgICB9XG4gIH1cbiAgcHJpdmF0ZSBfc2VsZWN0ZWQhOiBEIHwgbnVsbDtcblxuICAvKiogVGhlIG1pbmltdW0gc2VsZWN0YWJsZSBkYXRlLiAqL1xuICBASW5wdXQoKVxuICBnZXQgbWluRGF0ZSgpOiBEIHwgbnVsbCB7XG4gICAgcmV0dXJuIHRoaXMuX21pbkRhdGU7XG4gIH1cbiAgc2V0IG1pbkRhdGUodmFsdWU6IEQgfCBudWxsKSB7XG4gICAgdGhpcy5fbWluRGF0ZSA9IHRoaXMuX2FkYXB0ZXIuZ2V0VmFsaWREYXRlT3JOdWxsKHRoaXMuX2FkYXB0ZXIuZGVzZXJpYWxpemUodmFsdWUpKTtcbiAgfVxuICBwcml2YXRlIF9taW5EYXRlITogRCB8IG51bGw7XG5cbiAgLyoqIFRoZSBtYXhpbXVtIHNlbGVjdGFibGUgZGF0ZS4gKi9cbiAgQElucHV0KClcbiAgZ2V0IG1heERhdGUoKTogRCB8IG51bGwge1xuICAgIHJldHVybiB0aGlzLl9tYXhEYXRlO1xuICB9XG4gIHNldCBtYXhEYXRlKHZhbHVlOiBEIHwgbnVsbCkge1xuICAgIHRoaXMuX21heERhdGUgPSB0aGlzLl9hZGFwdGVyLmdldFZhbGlkRGF0ZU9yTnVsbCh0aGlzLl9hZGFwdGVyLmRlc2VyaWFsaXplKHZhbHVlKSk7XG4gIH1cbiAgcHJpdmF0ZSBfbWF4RGF0ZSE6IEQgfCBudWxsO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBjbG9jayBzaG91bGQgYmUgc3RhcnRlZCBpbiBob3VyIG9yIG1pbnV0ZSB2aWV3LiAqL1xuICBASW5wdXQoKVxuICBzZXQgc3RhcnRWaWV3KHZhbHVlOiBNdHhDbG9ja1ZpZXcpIHtcbiAgICB0aGlzLl9ob3VyVmlldyA9IHZhbHVlICE9PSAnbWludXRlJztcbiAgfVxuXG4gIGdldCBfaGFuZCgpIHtcbiAgICBjb25zdCBob3VyID0gdGhpcy5fYWRhcHRlci5nZXRIb3VyKHRoaXMuYWN0aXZlRGF0ZSk7XG4gICAgdGhpcy5fc2VsZWN0ZWRIb3VyID0gaG91cjtcbiAgICB0aGlzLl9zZWxlY3RlZE1pbnV0ZSA9IHRoaXMuX2FkYXB0ZXIuZ2V0TWludXRlKHRoaXMuYWN0aXZlRGF0ZSk7XG4gICAgbGV0IGRlZyA9IDA7XG4gICAgbGV0IHJhZGl1cyA9IENMT0NLX09VVEVSX1JBRElVUztcbiAgICBpZiAodGhpcy5faG91clZpZXcpIHtcbiAgICAgIGNvbnN0IG91dGVyID0gdGhpcy5fc2VsZWN0ZWRIb3VyID4gMCAmJiB0aGlzLl9zZWxlY3RlZEhvdXIgPCAxMztcbiAgICAgIHJhZGl1cyA9IG91dGVyID8gQ0xPQ0tfT1VURVJfUkFESVVTIDogQ0xPQ0tfSU5ORVJfUkFESVVTO1xuICAgICAgaWYgKHRoaXMudHdlbHZlaG91cikge1xuICAgICAgICByYWRpdXMgPSBDTE9DS19PVVRFUl9SQURJVVM7XG4gICAgICB9XG4gICAgICBkZWcgPSBNYXRoLnJvdW5kKHRoaXMuX3NlbGVjdGVkSG91ciAqICgzNjAgLyAoMjQgLyAyKSkpO1xuICAgIH0gZWxzZSB7XG4gICAgICBkZWcgPSBNYXRoLnJvdW5kKHRoaXMuX3NlbGVjdGVkTWludXRlICogKDM2MCAvIDYwKSk7XG4gICAgfVxuICAgIHJldHVybiB7XG4gICAgICBoZWlnaHQ6IGAke3JhZGl1c30lYCxcbiAgICAgIG1hcmdpblRvcDogYCR7NTAgLSByYWRpdXN9JWAsXG4gICAgICB0cmFuc2Zvcm06IGByb3RhdGUoJHtkZWd9ZGVnKWAsXG4gICAgfTtcbiAgfVxuXG4gIG5nQWZ0ZXJDb250ZW50SW5pdCgpIHtcbiAgICB0aGlzLmFjdGl2ZURhdGUgPSB0aGlzLl9hY3RpdmVEYXRlIHx8IHRoaXMuX2FkYXB0ZXIudG9kYXkoKTtcbiAgICB0aGlzLl9pbml0KCk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLl9yZW1vdmVHbG9iYWxFdmVudHMoKTtcbiAgfVxuXG4gIG5nT25DaGFuZ2VzKCk6IHZvaWQge1xuICAgIHRoaXMuX2luaXQoKTtcbiAgfVxuXG4gIC8qKiBDYWxsZWQgd2hlbiB0aGUgdXNlciBoYXMgcHV0IHRoZWlyIHBvaW50ZXIgZG93biBvbiB0aGUgY2xvY2suICovXG4gIHByaXZhdGUgX3BvaW50ZXJEb3duID0gKGV2ZW50OiBUb3VjaEV2ZW50IHwgTW91c2VFdmVudCkgPT4ge1xuICAgIHRoaXMuX3RpbWVDaGFuZ2VkID0gZmFsc2U7XG4gICAgdGhpcy5zZXRUaW1lKGV2ZW50KTtcbiAgICB0aGlzLl9iaW5kR2xvYmFsRXZlbnRzKGV2ZW50KTtcbiAgfTtcblxuICAvKipcbiAgICogQ2FsbGVkIHdoZW4gdGhlIHVzZXIgaGFzIG1vdmVkIHRoZWlyIHBvaW50ZXIgYWZ0ZXJcbiAgICogc3RhcnRpbmcgdG8gZHJhZy4gQm91bmQgb24gdGhlIGRvY3VtZW50IGxldmVsLlxuICAgKi9cbiAgcHJpdmF0ZSBfcG9pbnRlck1vdmUgPSAoZXZlbnQ6IFRvdWNoRXZlbnQgfCBNb3VzZUV2ZW50KSA9PiB7XG4gICAgaWYgKGV2ZW50LmNhbmNlbGFibGUpIHtcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgfVxuICAgIHRoaXMuc2V0VGltZShldmVudCk7XG4gIH07XG5cbiAgLyoqIENhbGxlZCB3aGVuIHRoZSB1c2VyIGhhcyBsaWZ0ZWQgdGhlaXIgcG9pbnRlci4gQm91bmQgb24gdGhlIGRvY3VtZW50IGxldmVsLiAqL1xuICBwcml2YXRlIF9wb2ludGVyVXAgPSAoZXZlbnQ6IFRvdWNoRXZlbnQgfCBNb3VzZUV2ZW50KSA9PiB7XG4gICAgaWYgKGV2ZW50LmNhbmNlbGFibGUpIHtcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgfVxuICAgIHRoaXMuX3JlbW92ZUdsb2JhbEV2ZW50cygpO1xuXG4gICAgaWYgKHRoaXMuX3RpbWVDaGFuZ2VkKSB7XG4gICAgICB0aGlzLnNlbGVjdGVkQ2hhbmdlLmVtaXQodGhpcy5hY3RpdmVEYXRlKTtcbiAgICAgIGlmICghdGhpcy5faG91clZpZXcpIHtcbiAgICAgICAgdGhpcy5fdXNlclNlbGVjdGlvbi5lbWl0KCk7XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIC8qKiBCaW5kcyBvdXIgZ2xvYmFsIG1vdmUgYW5kIGVuZCBldmVudHMuICovXG4gIHByaXZhdGUgX2JpbmRHbG9iYWxFdmVudHModHJpZ2dlckV2ZW50OiBUb3VjaEV2ZW50IHwgTW91c2VFdmVudCkge1xuICAgIC8vIE5vdGUgdGhhdCB3ZSBiaW5kIHRoZSBldmVudHMgdG8gdGhlIGBkb2N1bWVudGAsIGJlY2F1c2UgaXQgYWxsb3dzIHVzIHRvIGNhcHR1cmVcbiAgICAvLyBkcmFnIGNhbmNlbCBldmVudHMgd2hlcmUgdGhlIHVzZXIncyBwb2ludGVyIGlzIG91dHNpZGUgdGhlIGJyb3dzZXIgd2luZG93LlxuICAgIGNvbnN0IGRvY3VtZW50ID0gdGhpcy5fZG9jdW1lbnQ7XG4gICAgY29uc3QgaXNUb3VjaCA9IGlzVG91Y2hFdmVudCh0cmlnZ2VyRXZlbnQpO1xuICAgIGNvbnN0IG1vdmVFdmVudE5hbWUgPSBpc1RvdWNoID8gJ3RvdWNobW92ZScgOiAnbW91c2Vtb3ZlJztcbiAgICBjb25zdCBlbmRFdmVudE5hbWUgPSBpc1RvdWNoID8gJ3RvdWNoZW5kJyA6ICdtb3VzZXVwJztcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKG1vdmVFdmVudE5hbWUsIHRoaXMuX3BvaW50ZXJNb3ZlLCBhY3RpdmVFdmVudE9wdGlvbnMpO1xuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoZW5kRXZlbnROYW1lLCB0aGlzLl9wb2ludGVyVXAsIGFjdGl2ZUV2ZW50T3B0aW9ucyk7XG5cbiAgICBpZiAoaXNUb3VjaCkge1xuICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hjYW5jZWwnLCB0aGlzLl9wb2ludGVyVXAsIGFjdGl2ZUV2ZW50T3B0aW9ucyk7XG4gICAgfVxuICB9XG5cbiAgLyoqIFJlbW92ZXMgYW55IGdsb2JhbCBldmVudCBsaXN0ZW5lcnMgdGhhdCB3ZSBtYXkgaGF2ZSBhZGRlZC4gKi9cbiAgcHJpdmF0ZSBfcmVtb3ZlR2xvYmFsRXZlbnRzKCkge1xuICAgIGNvbnN0IGRvY3VtZW50ID0gdGhpcy5fZG9jdW1lbnQ7XG4gICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgdGhpcy5fcG9pbnRlck1vdmUsIGFjdGl2ZUV2ZW50T3B0aW9ucyk7XG4gICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIHRoaXMuX3BvaW50ZXJVcCwgYWN0aXZlRXZlbnRPcHRpb25zKTtcbiAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCd0b3VjaG1vdmUnLCB0aGlzLl9wb2ludGVyTW92ZSwgYWN0aXZlRXZlbnRPcHRpb25zKTtcbiAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCd0b3VjaGVuZCcsIHRoaXMuX3BvaW50ZXJVcCwgYWN0aXZlRXZlbnRPcHRpb25zKTtcbiAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCd0b3VjaGNhbmNlbCcsIHRoaXMuX3BvaW50ZXJVcCwgYWN0aXZlRXZlbnRPcHRpb25zKTtcbiAgfVxuXG4gIC8qKiBJbml0aWFsaXplcyB0aGlzIGNsb2NrIHZpZXcuICovXG4gIHByaXZhdGUgX2luaXQoKSB7XG4gICAgdGhpcy5faG91cnMubGVuZ3RoID0gMDtcbiAgICB0aGlzLl9taW51dGVzLmxlbmd0aCA9IDA7XG5cbiAgICBjb25zdCBob3VyTmFtZXMgPSB0aGlzLl9hZGFwdGVyLmdldEhvdXJOYW1lcygpO1xuICAgIGNvbnN0IG1pbnV0ZU5hbWVzID0gdGhpcy5fYWRhcHRlci5nZXRNaW51dGVOYW1lcygpO1xuICAgIGlmICh0aGlzLnR3ZWx2ZWhvdXIpIHtcbiAgICAgIGNvbnN0IGhvdXJzID0gW107XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGhvdXJOYW1lcy5sZW5ndGg7IGkrKykge1xuICAgICAgICBjb25zdCByYWRpYW4gPSAoaSAvIDYpICogTWF0aC5QSTtcbiAgICAgICAgY29uc3QgcmFkaXVzID0gQ0xPQ0tfT1VURVJfUkFESVVTO1xuXG4gICAgICAgIGNvbnN0IGhvdXIgPSBpO1xuICAgICAgICBjb25zdCBkYXRlID0gdGhpcy5fYWRhcHRlci5jcmVhdGVEYXRldGltZShcbiAgICAgICAgICB0aGlzLl9hZGFwdGVyLmdldFllYXIodGhpcy5hY3RpdmVEYXRlKSxcbiAgICAgICAgICB0aGlzLl9hZGFwdGVyLmdldE1vbnRoKHRoaXMuYWN0aXZlRGF0ZSksXG4gICAgICAgICAgdGhpcy5fYWRhcHRlci5nZXREYXRlKHRoaXMuYWN0aXZlRGF0ZSksXG4gICAgICAgICAgaG91cixcbiAgICAgICAgICAwXG4gICAgICAgICk7XG5cbiAgICAgICAgLy8gQ2hlY2sgaWYgdGhlIGRhdGUgaXMgZW5hYmxlZCwgbm8gbmVlZCB0byByZXNwZWN0IHRoZSBtaW51dGUgc2V0dGluZyBoZXJlXG4gICAgICAgIGNvbnN0IGVuYWJsZWQgPVxuICAgICAgICAgICghdGhpcy5taW5EYXRlIHx8IHRoaXMuX2FkYXB0ZXIuY29tcGFyZURhdGV0aW1lKGRhdGUsIHRoaXMubWluRGF0ZSwgZmFsc2UpID49IDApICYmXG4gICAgICAgICAgKCF0aGlzLm1heERhdGUgfHwgdGhpcy5fYWRhcHRlci5jb21wYXJlRGF0ZXRpbWUoZGF0ZSwgdGhpcy5tYXhEYXRlLCBmYWxzZSkgPD0gMCkgJiZcbiAgICAgICAgICAoIXRoaXMuZGF0ZUZpbHRlciB8fCB0aGlzLmRhdGVGaWx0ZXIoZGF0ZSwgTXR4RGF0ZXRpbWVwaWNrZXJGaWx0ZXJUeXBlLkhPVVIpKTtcblxuICAgICAgICAvLyBkaXNwbGF5IHZhbHVlIGZvciB0d2VsdmVob3VyIGNsb2NrIHNob3VsZCBiZSBmcm9tIDEtMTIgbm90IGluY2x1ZGluZyAwIGFuZCBub3QgYWJvdmUgMTJcbiAgICAgICAgaG91cnMucHVzaCh7XG4gICAgICAgICAgdmFsdWU6IGksXG4gICAgICAgICAgZGlzcGxheVZhbHVlOiBpICUgMTIgPT09IDAgPyAnMTInIDogaG91ck5hbWVzW2kgJSAxMl0sXG4gICAgICAgICAgZW5hYmxlZCxcbiAgICAgICAgICB0b3A6IENMT0NLX1JBRElVUyAtIE1hdGguY29zKHJhZGlhbikgKiByYWRpdXMgLSBDTE9DS19USUNLX1JBRElVUyxcbiAgICAgICAgICBsZWZ0OiBDTE9DS19SQURJVVMgKyBNYXRoLnNpbihyYWRpYW4pICogcmFkaXVzIC0gQ0xPQ0tfVElDS19SQURJVVMsXG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICAvLyBmaWx0ZXIgb3V0IEFNIG9yIFBNIGhvdXJzIGJhc2VkIG9uIEFNUE1cbiAgICAgIGlmICh0aGlzLkFNUE0gPT09ICdBTScpIHtcbiAgICAgICAgdGhpcy5faG91cnMgPSBob3Vycy5maWx0ZXIoeCA9PiB4LnZhbHVlIDwgMTIpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5faG91cnMgPSBob3Vycy5maWx0ZXIoeCA9PiB4LnZhbHVlID49IDEyKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBob3VyTmFtZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgY29uc3QgcmFkaWFuID0gKGkgLyA2KSAqIE1hdGguUEk7XG4gICAgICAgIGNvbnN0IG91dGVyID0gaSA+IDAgJiYgaSA8IDEzO1xuICAgICAgICBjb25zdCByYWRpdXMgPSBvdXRlciA/IENMT0NLX09VVEVSX1JBRElVUyA6IENMT0NLX0lOTkVSX1JBRElVUztcbiAgICAgICAgY29uc3QgZGF0ZSA9IHRoaXMuX2FkYXB0ZXIuY3JlYXRlRGF0ZXRpbWUoXG4gICAgICAgICAgdGhpcy5fYWRhcHRlci5nZXRZZWFyKHRoaXMuYWN0aXZlRGF0ZSksXG4gICAgICAgICAgdGhpcy5fYWRhcHRlci5nZXRNb250aCh0aGlzLmFjdGl2ZURhdGUpLFxuICAgICAgICAgIHRoaXMuX2FkYXB0ZXIuZ2V0RGF0ZSh0aGlzLmFjdGl2ZURhdGUpLFxuICAgICAgICAgIGksXG4gICAgICAgICAgMFxuICAgICAgICApO1xuXG4gICAgICAgIC8vIENoZWNrIGlmIHRoZSBkYXRlIGlzIGVuYWJsZWQsIG5vIG5lZWQgdG8gcmVzcGVjdCB0aGUgbWludXRlIHNldHRpbmcgaGVyZVxuICAgICAgICBjb25zdCBlbmFibGVkID1cbiAgICAgICAgICAoIXRoaXMubWluRGF0ZSB8fCB0aGlzLl9hZGFwdGVyLmNvbXBhcmVEYXRldGltZShkYXRlLCB0aGlzLm1pbkRhdGUsIGZhbHNlKSA+PSAwKSAmJlxuICAgICAgICAgICghdGhpcy5tYXhEYXRlIHx8IHRoaXMuX2FkYXB0ZXIuY29tcGFyZURhdGV0aW1lKGRhdGUsIHRoaXMubWF4RGF0ZSwgZmFsc2UpIDw9IDApICYmXG4gICAgICAgICAgKCF0aGlzLmRhdGVGaWx0ZXIgfHwgdGhpcy5kYXRlRmlsdGVyKGRhdGUsIE10eERhdGV0aW1lcGlja2VyRmlsdGVyVHlwZS5IT1VSKSk7XG5cbiAgICAgICAgdGhpcy5faG91cnMucHVzaCh7XG4gICAgICAgICAgdmFsdWU6IGksXG4gICAgICAgICAgZGlzcGxheVZhbHVlOiBpID09PSAwID8gJzAwJyA6IGhvdXJOYW1lc1tpXSxcbiAgICAgICAgICBlbmFibGVkLFxuICAgICAgICAgIHRvcDogQ0xPQ0tfUkFESVVTIC0gTWF0aC5jb3MocmFkaWFuKSAqIHJhZGl1cyAtIENMT0NLX1RJQ0tfUkFESVVTLFxuICAgICAgICAgIGxlZnQ6IENMT0NLX1JBRElVUyArIE1hdGguc2luKHJhZGlhbikgKiByYWRpdXMgLSBDTE9DS19USUNLX1JBRElVUyxcbiAgICAgICAgICBmb250U2l6ZTogaSA+IDAgJiYgaSA8IDEzID8gJycgOiAnODAlJyxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBtaW51dGVOYW1lcy5sZW5ndGg7IGkgKz0gNSkge1xuICAgICAgY29uc3QgcmFkaWFuID0gKGkgLyAzMCkgKiBNYXRoLlBJO1xuICAgICAgY29uc3QgZGF0ZSA9IHRoaXMuX2FkYXB0ZXIuY3JlYXRlRGF0ZXRpbWUoXG4gICAgICAgIHRoaXMuX2FkYXB0ZXIuZ2V0WWVhcih0aGlzLmFjdGl2ZURhdGUpLFxuICAgICAgICB0aGlzLl9hZGFwdGVyLmdldE1vbnRoKHRoaXMuYWN0aXZlRGF0ZSksXG4gICAgICAgIHRoaXMuX2FkYXB0ZXIuZ2V0RGF0ZSh0aGlzLmFjdGl2ZURhdGUpLFxuICAgICAgICB0aGlzLl9hZGFwdGVyLmdldEhvdXIodGhpcy5hY3RpdmVEYXRlKSxcbiAgICAgICAgaVxuICAgICAgKTtcbiAgICAgIGNvbnN0IGVuYWJsZWQgPVxuICAgICAgICAoIXRoaXMubWluRGF0ZSB8fCB0aGlzLl9hZGFwdGVyLmNvbXBhcmVEYXRldGltZShkYXRlLCB0aGlzLm1pbkRhdGUpID49IDApICYmXG4gICAgICAgICghdGhpcy5tYXhEYXRlIHx8IHRoaXMuX2FkYXB0ZXIuY29tcGFyZURhdGV0aW1lKGRhdGUsIHRoaXMubWF4RGF0ZSkgPD0gMCkgJiZcbiAgICAgICAgKCF0aGlzLmRhdGVGaWx0ZXIgfHwgdGhpcy5kYXRlRmlsdGVyKGRhdGUsIE10eERhdGV0aW1lcGlja2VyRmlsdGVyVHlwZS5NSU5VVEUpKTtcbiAgICAgIHRoaXMuX21pbnV0ZXMucHVzaCh7XG4gICAgICAgIHZhbHVlOiBpLFxuICAgICAgICBkaXNwbGF5VmFsdWU6IGkgPT09IDAgPyAnMDAnIDogbWludXRlTmFtZXNbaV0sXG4gICAgICAgIGVuYWJsZWQsXG4gICAgICAgIHRvcDogQ0xPQ0tfUkFESVVTIC0gTWF0aC5jb3MocmFkaWFuKSAqIENMT0NLX09VVEVSX1JBRElVUyAtIENMT0NLX1RJQ0tfUkFESVVTLFxuICAgICAgICBsZWZ0OiBDTE9DS19SQURJVVMgKyBNYXRoLnNpbihyYWRpYW4pICogQ0xPQ0tfT1VURVJfUkFESVVTIC0gQ0xPQ0tfVElDS19SQURJVVMsXG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogU2V0IFRpbWVcbiAgICogQHBhcmFtIGV2ZW50XG4gICAqL1xuICBwcml2YXRlIHNldFRpbWUoZXZlbnQ6IFRvdWNoRXZlbnQgfCBNb3VzZUV2ZW50KSB7XG4gICAgY29uc3QgdHJpZ2dlciA9IHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudDtcbiAgICBjb25zdCB0cmlnZ2VyUmVjdCA9IHRyaWdnZXIuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgY29uc3Qgd2lkdGggPSB0cmlnZ2VyLm9mZnNldFdpZHRoO1xuICAgIGNvbnN0IGhlaWdodCA9IHRyaWdnZXIub2Zmc2V0SGVpZ2h0O1xuICAgIGNvbnN0IHsgcGFnZVgsIHBhZ2VZIH0gPSBnZXRQb2ludGVyUG9zaXRpb25PblBhZ2UoZXZlbnQpO1xuICAgIGNvbnN0IHggPSB3aWR0aCAvIDIgLSAocGFnZVggLSB0cmlnZ2VyUmVjdC5sZWZ0IC0gd2luZG93LnBhZ2VYT2Zmc2V0KTtcbiAgICBjb25zdCB5ID0gaGVpZ2h0IC8gMiAtIChwYWdlWSAtIHRyaWdnZXJSZWN0LnRvcCAtIHdpbmRvdy5wYWdlWU9mZnNldCk7XG5cbiAgICBsZXQgcmFkaWFuID0gTWF0aC5hdGFuMigteCwgeSk7XG4gICAgY29uc3QgdW5pdCA9IE1hdGguUEkgLyAodGhpcy5faG91clZpZXcgPyA2IDogdGhpcy5pbnRlcnZhbCA/IDMwIC8gdGhpcy5pbnRlcnZhbCA6IDMwKTtcbiAgICBjb25zdCB6ID0gTWF0aC5zcXJ0KHggKiB4ICsgeSAqIHkpO1xuICAgIGNvbnN0IG91dGVyID1cbiAgICAgIHRoaXMuX2hvdXJWaWV3ICYmXG4gICAgICB6ID4gKHdpZHRoICogKENMT0NLX09VVEVSX1JBRElVUyAvIDEwMCkgKyB3aWR0aCAqIChDTE9DS19JTk5FUl9SQURJVVMgLyAxMDApKSAvIDI7XG5cbiAgICBpZiAocmFkaWFuIDwgMCkge1xuICAgICAgcmFkaWFuID0gTWF0aC5QSSAqIDIgKyByYWRpYW47XG4gICAgfVxuICAgIGxldCB2YWx1ZSA9IE1hdGgucm91bmQocmFkaWFuIC8gdW5pdCk7XG5cbiAgICBsZXQgZGF0ZTtcbiAgICBpZiAodGhpcy5faG91clZpZXcpIHtcbiAgICAgIGlmICh0aGlzLnR3ZWx2ZWhvdXIpIHtcbiAgICAgICAgaWYgKHRoaXMuQU1QTSA9PT0gJ0FNJykge1xuICAgICAgICAgIHZhbHVlID0gdmFsdWUgPT09IDAgPyAxMiA6IHZhbHVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIGlmIHdlIGNob3NlbiAxMiBpbiBQTSwgdGhlIHZhbHVlIHNob3VsZCBiZSAwIGZvciAwOjAwLFxuICAgICAgICAgIC8vIGVsc2Ugd2UgY2FuIHNhZmVseSBhZGQgMTIgdG8gdGhlIGZpbmFsIHZhbHVlXG4gICAgICAgICAgdmFsdWUgPSB2YWx1ZSA9PT0gMTIgPyAwIDogdmFsdWUgKyAxMjtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKHZhbHVlID09PSAxMikge1xuICAgICAgICAgIHZhbHVlID0gMDtcbiAgICAgICAgfVxuICAgICAgICB2YWx1ZSA9IG91dGVyID8gKHZhbHVlID09PSAwID8gMTIgOiB2YWx1ZSkgOiB2YWx1ZSA9PT0gMCA/IDAgOiB2YWx1ZSArIDEyO1xuICAgICAgfVxuXG4gICAgICBkYXRlID0gdGhpcy5fYWRhcHRlci5jcmVhdGVEYXRldGltZShcbiAgICAgICAgdGhpcy5fYWRhcHRlci5nZXRZZWFyKHRoaXMuYWN0aXZlRGF0ZSksXG4gICAgICAgIHRoaXMuX2FkYXB0ZXIuZ2V0TW9udGgodGhpcy5hY3RpdmVEYXRlKSxcbiAgICAgICAgdGhpcy5fYWRhcHRlci5nZXREYXRlKHRoaXMuYWN0aXZlRGF0ZSksXG4gICAgICAgIHZhbHVlLFxuICAgICAgICB0aGlzLl9hZGFwdGVyLmdldE1pbnV0ZSh0aGlzLmFjdGl2ZURhdGUpXG4gICAgICApO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAodGhpcy5pbnRlcnZhbCkge1xuICAgICAgICB2YWx1ZSAqPSB0aGlzLmludGVydmFsO1xuICAgICAgfVxuICAgICAgaWYgKHZhbHVlID09PSA2MCkge1xuICAgICAgICB2YWx1ZSA9IDA7XG4gICAgICB9XG4gICAgICBkYXRlID0gdGhpcy5fYWRhcHRlci5jcmVhdGVEYXRldGltZShcbiAgICAgICAgdGhpcy5fYWRhcHRlci5nZXRZZWFyKHRoaXMuYWN0aXZlRGF0ZSksXG4gICAgICAgIHRoaXMuX2FkYXB0ZXIuZ2V0TW9udGgodGhpcy5hY3RpdmVEYXRlKSxcbiAgICAgICAgdGhpcy5fYWRhcHRlci5nZXREYXRlKHRoaXMuYWN0aXZlRGF0ZSksXG4gICAgICAgIHRoaXMuX2FkYXB0ZXIuZ2V0SG91cih0aGlzLmFjdGl2ZURhdGUpLFxuICAgICAgICB2YWx1ZVxuICAgICAgKTtcbiAgICB9XG5cbiAgICB0aGlzLl90aW1lQ2hhbmdlZCA9IHRydWU7XG4gICAgdGhpcy5hY3RpdmVEYXRlID0gZGF0ZTtcbiAgICB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKTtcbiAgICB0aGlzLmFjdGl2ZURhdGVDaGFuZ2UuZW1pdCh0aGlzLmFjdGl2ZURhdGUpO1xuICB9XG5cbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX3R3ZWx2ZWhvdXI6IEJvb2xlYW5JbnB1dDtcbn1cblxuLyoqIFJldHVybnMgd2hldGhlciBhbiBldmVudCBpcyBhIHRvdWNoIGV2ZW50LiAqL1xuZnVuY3Rpb24gaXNUb3VjaEV2ZW50KGV2ZW50OiBNb3VzZUV2ZW50IHwgVG91Y2hFdmVudCk6IGV2ZW50IGlzIFRvdWNoRXZlbnQge1xuICAvLyBUaGlzIGZ1bmN0aW9uIGlzIGNhbGxlZCBmb3IgZXZlcnkgcGl4ZWwgdGhhdCB0aGUgdXNlciBoYXMgZHJhZ2dlZCBzbyB3ZSBuZWVkIGl0IHRvIGJlXG4gIC8vIGFzIGZhc3QgYXMgcG9zc2libGUuIFNpbmNlIHdlIG9ubHkgYmluZCBtb3VzZSBldmVudHMgYW5kIHRvdWNoIGV2ZW50cywgd2UgY2FuIGFzc3VtZVxuICAvLyB0aGF0IGlmIHRoZSBldmVudCdzIG5hbWUgc3RhcnRzIHdpdGggYHRgLCBpdCdzIGEgdG91Y2ggZXZlbnQuXG4gIHJldHVybiBldmVudC50eXBlWzBdID09PSAndCc7XG59XG5cbi8qKiBHZXRzIHRoZSBjb29yZGluYXRlcyBvZiBhIHRvdWNoIG9yIG1vdXNlIGV2ZW50IHJlbGF0aXZlIHRvIHRoZSBkb2N1bWVudC4gKi9cbmZ1bmN0aW9uIGdldFBvaW50ZXJQb3NpdGlvbk9uUGFnZShldmVudDogTW91c2VFdmVudCB8IFRvdWNoRXZlbnQpIHtcbiAgbGV0IHBvaW50OiB7IHBhZ2VYOiBudW1iZXI7IHBhZ2VZOiBudW1iZXIgfTtcblxuICBpZiAoaXNUb3VjaEV2ZW50KGV2ZW50KSkge1xuICAgIC8vIGB0b3VjaGVzYCB3aWxsIGJlIGVtcHR5IGZvciBzdGFydC9lbmQgZXZlbnRzIHNvIHdlIGhhdmUgdG8gZmFsbCBiYWNrIHRvIGBjaGFuZ2VkVG91Y2hlc2AuXG4gICAgcG9pbnQgPSBldmVudC50b3VjaGVzWzBdIHx8IGV2ZW50LmNoYW5nZWRUb3VjaGVzWzBdO1xuICB9IGVsc2Uge1xuICAgIHBvaW50ID0gZXZlbnQ7XG4gIH1cblxuICByZXR1cm4gcG9pbnQ7XG59XG4iLCI8ZGl2IGNsYXNzPVwibXR4LWNsb2NrLXdyYXBwZXJcIj5cbiAgPGRpdiBjbGFzcz1cIm10eC1jbG9jay1jZW50ZXJcIj48L2Rpdj5cbiAgPGRpdiBjbGFzcz1cIm10eC1jbG9jay1oYW5kXCIgW25nU3R5bGVdPVwiX2hhbmRcIj48L2Rpdj5cbiAgPGRpdiBjbGFzcz1cIm10eC1jbG9jay1ob3Vyc1wiIFtjbGFzcy5hY3RpdmVdPVwiX2hvdXJWaWV3XCI+XG4gICAgPGRpdiAqbmdGb3I9XCJsZXQgaXRlbSBvZiBfaG91cnNcIlxuICAgICAgICAgY2xhc3M9XCJtdHgtY2xvY2stY2VsbFwiXG4gICAgICAgICBbY2xhc3MubXR4LWNsb2NrLWNlbGwtZGlzYWJsZWRdPVwiIWl0ZW0uZW5hYmxlZFwiXG4gICAgICAgICBbY2xhc3MubXR4LWNsb2NrLWNlbGwtc2VsZWN0ZWRdPVwiX3NlbGVjdGVkSG91ciA9PT0gaXRlbS52YWx1ZVwiXG4gICAgICAgICBbc3R5bGUuZm9udFNpemVdPVwiaXRlbS5mb250U2l6ZVwiXG4gICAgICAgICBbc3R5bGUubGVmdF09XCJpdGVtLmxlZnQrJyUnXCJcbiAgICAgICAgIFtzdHlsZS50b3BdPVwiaXRlbS50b3ArJyUnXCI+e3sgaXRlbS5kaXNwbGF5VmFsdWUgfX08L2Rpdj5cbiAgPC9kaXY+XG4gIDxkaXYgY2xhc3M9XCJtdHgtY2xvY2stbWludXRlc1wiIFtjbGFzcy5hY3RpdmVdPVwiIV9ob3VyVmlld1wiPlxuICAgIDxkaXYgKm5nRm9yPVwibGV0IGl0ZW0gb2YgX21pbnV0ZXNcIlxuICAgICAgICAgY2xhc3M9XCJtdHgtY2xvY2stY2VsbFwiXG4gICAgICAgICBbY2xhc3MubXR4LWNsb2NrLWNlbGwtZGlzYWJsZWRdPVwiIWl0ZW0uZW5hYmxlZFwiXG4gICAgICAgICBbY2xhc3MubXR4LWNsb2NrLWNlbGwtc2VsZWN0ZWRdPVwiX3NlbGVjdGVkTWludXRlID09PSBpdGVtLnZhbHVlXCJcbiAgICAgICAgIFtzdHlsZS5sZWZ0XT1cIml0ZW0ubGVmdCsnJSdcIlxuICAgICAgICAgW3N0eWxlLnRvcF09XCJpdGVtLnRvcCsnJSdcIj57eyBpdGVtLmRpc3BsYXlWYWx1ZSB9fTwvZGl2PlxuICA8L2Rpdj5cbjwvZGl2PlxuIl19