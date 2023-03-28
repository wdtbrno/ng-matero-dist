import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import * as i0 from "@angular/core";
export class MtxDatetimepickerIntl {
    constructor() {
        /**
         * Stream to emit from when labels are changed. Use this to notify components when the labels have
         * changed after initialization.
         */
        this.changes = new Subject();
        /** A label for the calendar popup (used by screen readers). */
        this.calendarLabel = 'Calendar';
        /** A label for the button used to open the calendar popup (used by screen readers). */
        this.openCalendarLabel = 'Open calendar';
        /** Label for the button used to close the calendar popup. */
        this.closeCalendarLabel = 'Close calendar';
        /** A label for the previous month button (used by screen readers). */
        this.prevMonthLabel = 'Previous month';
        /** A label for the next month button (used by screen readers). */
        this.nextMonthLabel = 'Next month';
        /** A label for the previous year button (used by screen readers). */
        this.prevYearLabel = 'Previous year';
        /** A label for the next year button (used by screen readers). */
        this.nextYearLabel = 'Next year';
        /** A label for the previous multi-year button (used by screen readers). */
        this.prevMultiYearLabel = 'Previous 24 years';
        /** A label for the next multi-year button (used by screen readers). */
        this.nextMultiYearLabel = 'Next 24 years';
        /** A label for the 'switch to month view' button (used by screen readers). */
        this.switchToMonthViewLabel = 'Choose date';
        /** A label for the 'switch to year view' button (used by screen readers). */
        this.switchToYearViewLabel = 'Choose month';
        /** A label for the 'switch to multi-year view' button (used by screen readers). */
        this.switchToMultiYearViewLabel = 'Choose month and year';
        /** A label for the first date of a range of dates (used by screen readers). */
        this.startDateLabel = 'Start date';
        /** A label for the last date of a range of dates (used by screen readers). */
        this.endDateLabel = 'End date';
        /** A label for the 'switch to clock hour view' button (used by screen readers). */
        this.switchToClockHourViewLabel = 'Choose hour';
        /** A label for the 'switch to clock minute view' button (used by screen readers). */
        this.switchToClockMinuteViewLabel = 'Choose minute';
        /** Label used for ok button within the manual time input. */
        this.okLabel = 'OK';
        /** Label used for cancel button within the manual time input. */
        this.cancelLabel = 'Cancel';
    }
    /** Formats a range of years (used for visuals). */
    formatYearRange(start, end) {
        return `${start} \u2013 ${end}`;
    }
    /** Formats a label for a range of years (used by screen readers). */
    formatYearRangeLabel(start, end) {
        return `${start} to ${end}`;
    }
}
/** @nocollapse */ MtxDatetimepickerIntl.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MtxDatetimepickerIntl, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
/** @nocollapse */ MtxDatetimepickerIntl.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MtxDatetimepickerIntl, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MtxDatetimepickerIntl, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZXRpbWVwaWNrZXItaW50bC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL2V4dGVuc2lvbnMvZGF0ZXRpbWVwaWNrZXIvZGF0ZXRpbWVwaWNrZXItaW50bC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzNDLE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxNQUFNLENBQUM7O0FBRy9CLE1BQU0sT0FBTyxxQkFBcUI7SUFEbEM7UUFFRTs7O1dBR0c7UUFDTSxZQUFPLEdBQUcsSUFBSSxPQUFPLEVBQVEsQ0FBQztRQUV2QywrREFBK0Q7UUFDL0Qsa0JBQWEsR0FBRyxVQUFVLENBQUM7UUFFM0IsdUZBQXVGO1FBQ3ZGLHNCQUFpQixHQUFHLGVBQWUsQ0FBQztRQUVwQyw2REFBNkQ7UUFDN0QsdUJBQWtCLEdBQUcsZ0JBQWdCLENBQUM7UUFFdEMsc0VBQXNFO1FBQ3RFLG1CQUFjLEdBQUcsZ0JBQWdCLENBQUM7UUFFbEMsa0VBQWtFO1FBQ2xFLG1CQUFjLEdBQUcsWUFBWSxDQUFDO1FBRTlCLHFFQUFxRTtRQUNyRSxrQkFBYSxHQUFHLGVBQWUsQ0FBQztRQUVoQyxpRUFBaUU7UUFDakUsa0JBQWEsR0FBRyxXQUFXLENBQUM7UUFFNUIsMkVBQTJFO1FBQzNFLHVCQUFrQixHQUFHLG1CQUFtQixDQUFDO1FBRXpDLHVFQUF1RTtRQUN2RSx1QkFBa0IsR0FBRyxlQUFlLENBQUM7UUFFckMsOEVBQThFO1FBQzlFLDJCQUFzQixHQUFHLGFBQWEsQ0FBQztRQUV2Qyw2RUFBNkU7UUFDN0UsMEJBQXFCLEdBQUcsY0FBYyxDQUFDO1FBRXZDLG1GQUFtRjtRQUNuRiwrQkFBMEIsR0FBRyx1QkFBdUIsQ0FBQztRQUVyRCwrRUFBK0U7UUFDL0UsbUJBQWMsR0FBRyxZQUFZLENBQUM7UUFFOUIsOEVBQThFO1FBQzlFLGlCQUFZLEdBQUcsVUFBVSxDQUFDO1FBWTFCLG1GQUFtRjtRQUNuRiwrQkFBMEIsR0FBRyxhQUFhLENBQUM7UUFFM0MscUZBQXFGO1FBQ3JGLGlDQUE0QixHQUFHLGVBQWUsQ0FBQztRQUUvQyw2REFBNkQ7UUFDN0QsWUFBTyxHQUFHLElBQUksQ0FBQztRQUVmLGlFQUFpRTtRQUNqRSxnQkFBVyxHQUFHLFFBQVEsQ0FBQztLQUN4QjtJQXJCQyxtREFBbUQ7SUFDbkQsZUFBZSxDQUFDLEtBQWEsRUFBRSxHQUFXO1FBQ3hDLE9BQU8sR0FBRyxLQUFLLFdBQVcsR0FBRyxFQUFFLENBQUM7SUFDbEMsQ0FBQztJQUVELHFFQUFxRTtJQUNyRSxvQkFBb0IsQ0FBQyxLQUFhLEVBQUUsR0FBVztRQUM3QyxPQUFPLEdBQUcsS0FBSyxPQUFPLEdBQUcsRUFBRSxDQUFDO0lBQzlCLENBQUM7O3FJQXpEVSxxQkFBcUI7eUlBQXJCLHFCQUFxQixjQURSLE1BQU07MkZBQ25CLHFCQUFxQjtrQkFEakMsVUFBVTttQkFBQyxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBTdWJqZWN0IH0gZnJvbSAncnhqcyc7XG5cbkBJbmplY3RhYmxlKHsgcHJvdmlkZWRJbjogJ3Jvb3QnIH0pXG5leHBvcnQgY2xhc3MgTXR4RGF0ZXRpbWVwaWNrZXJJbnRsIHtcbiAgLyoqXG4gICAqIFN0cmVhbSB0byBlbWl0IGZyb20gd2hlbiBsYWJlbHMgYXJlIGNoYW5nZWQuIFVzZSB0aGlzIHRvIG5vdGlmeSBjb21wb25lbnRzIHdoZW4gdGhlIGxhYmVscyBoYXZlXG4gICAqIGNoYW5nZWQgYWZ0ZXIgaW5pdGlhbGl6YXRpb24uXG4gICAqL1xuICByZWFkb25seSBjaGFuZ2VzID0gbmV3IFN1YmplY3Q8dm9pZD4oKTtcblxuICAvKiogQSBsYWJlbCBmb3IgdGhlIGNhbGVuZGFyIHBvcHVwICh1c2VkIGJ5IHNjcmVlbiByZWFkZXJzKS4gKi9cbiAgY2FsZW5kYXJMYWJlbCA9ICdDYWxlbmRhcic7XG5cbiAgLyoqIEEgbGFiZWwgZm9yIHRoZSBidXR0b24gdXNlZCB0byBvcGVuIHRoZSBjYWxlbmRhciBwb3B1cCAodXNlZCBieSBzY3JlZW4gcmVhZGVycykuICovXG4gIG9wZW5DYWxlbmRhckxhYmVsID0gJ09wZW4gY2FsZW5kYXInO1xuXG4gIC8qKiBMYWJlbCBmb3IgdGhlIGJ1dHRvbiB1c2VkIHRvIGNsb3NlIHRoZSBjYWxlbmRhciBwb3B1cC4gKi9cbiAgY2xvc2VDYWxlbmRhckxhYmVsID0gJ0Nsb3NlIGNhbGVuZGFyJztcblxuICAvKiogQSBsYWJlbCBmb3IgdGhlIHByZXZpb3VzIG1vbnRoIGJ1dHRvbiAodXNlZCBieSBzY3JlZW4gcmVhZGVycykuICovXG4gIHByZXZNb250aExhYmVsID0gJ1ByZXZpb3VzIG1vbnRoJztcblxuICAvKiogQSBsYWJlbCBmb3IgdGhlIG5leHQgbW9udGggYnV0dG9uICh1c2VkIGJ5IHNjcmVlbiByZWFkZXJzKS4gKi9cbiAgbmV4dE1vbnRoTGFiZWwgPSAnTmV4dCBtb250aCc7XG5cbiAgLyoqIEEgbGFiZWwgZm9yIHRoZSBwcmV2aW91cyB5ZWFyIGJ1dHRvbiAodXNlZCBieSBzY3JlZW4gcmVhZGVycykuICovXG4gIHByZXZZZWFyTGFiZWwgPSAnUHJldmlvdXMgeWVhcic7XG5cbiAgLyoqIEEgbGFiZWwgZm9yIHRoZSBuZXh0IHllYXIgYnV0dG9uICh1c2VkIGJ5IHNjcmVlbiByZWFkZXJzKS4gKi9cbiAgbmV4dFllYXJMYWJlbCA9ICdOZXh0IHllYXInO1xuXG4gIC8qKiBBIGxhYmVsIGZvciB0aGUgcHJldmlvdXMgbXVsdGkteWVhciBidXR0b24gKHVzZWQgYnkgc2NyZWVuIHJlYWRlcnMpLiAqL1xuICBwcmV2TXVsdGlZZWFyTGFiZWwgPSAnUHJldmlvdXMgMjQgeWVhcnMnO1xuXG4gIC8qKiBBIGxhYmVsIGZvciB0aGUgbmV4dCBtdWx0aS15ZWFyIGJ1dHRvbiAodXNlZCBieSBzY3JlZW4gcmVhZGVycykuICovXG4gIG5leHRNdWx0aVllYXJMYWJlbCA9ICdOZXh0IDI0IHllYXJzJztcblxuICAvKiogQSBsYWJlbCBmb3IgdGhlICdzd2l0Y2ggdG8gbW9udGggdmlldycgYnV0dG9uICh1c2VkIGJ5IHNjcmVlbiByZWFkZXJzKS4gKi9cbiAgc3dpdGNoVG9Nb250aFZpZXdMYWJlbCA9ICdDaG9vc2UgZGF0ZSc7XG5cbiAgLyoqIEEgbGFiZWwgZm9yIHRoZSAnc3dpdGNoIHRvIHllYXIgdmlldycgYnV0dG9uICh1c2VkIGJ5IHNjcmVlbiByZWFkZXJzKS4gKi9cbiAgc3dpdGNoVG9ZZWFyVmlld0xhYmVsID0gJ0Nob29zZSBtb250aCc7XG5cbiAgLyoqIEEgbGFiZWwgZm9yIHRoZSAnc3dpdGNoIHRvIG11bHRpLXllYXIgdmlldycgYnV0dG9uICh1c2VkIGJ5IHNjcmVlbiByZWFkZXJzKS4gKi9cbiAgc3dpdGNoVG9NdWx0aVllYXJWaWV3TGFiZWwgPSAnQ2hvb3NlIG1vbnRoIGFuZCB5ZWFyJztcblxuICAvKiogQSBsYWJlbCBmb3IgdGhlIGZpcnN0IGRhdGUgb2YgYSByYW5nZSBvZiBkYXRlcyAodXNlZCBieSBzY3JlZW4gcmVhZGVycykuICovXG4gIHN0YXJ0RGF0ZUxhYmVsID0gJ1N0YXJ0IGRhdGUnO1xuXG4gIC8qKiBBIGxhYmVsIGZvciB0aGUgbGFzdCBkYXRlIG9mIGEgcmFuZ2Ugb2YgZGF0ZXMgKHVzZWQgYnkgc2NyZWVuIHJlYWRlcnMpLiAqL1xuICBlbmREYXRlTGFiZWwgPSAnRW5kIGRhdGUnO1xuXG4gIC8qKiBGb3JtYXRzIGEgcmFuZ2Ugb2YgeWVhcnMgKHVzZWQgZm9yIHZpc3VhbHMpLiAqL1xuICBmb3JtYXRZZWFyUmFuZ2Uoc3RhcnQ6IHN0cmluZywgZW5kOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIHJldHVybiBgJHtzdGFydH0gXFx1MjAxMyAke2VuZH1gO1xuICB9XG5cbiAgLyoqIEZvcm1hdHMgYSBsYWJlbCBmb3IgYSByYW5nZSBvZiB5ZWFycyAodXNlZCBieSBzY3JlZW4gcmVhZGVycykuICovXG4gIGZvcm1hdFllYXJSYW5nZUxhYmVsKHN0YXJ0OiBzdHJpbmcsIGVuZDogc3RyaW5nKTogc3RyaW5nIHtcbiAgICByZXR1cm4gYCR7c3RhcnR9IHRvICR7ZW5kfWA7XG4gIH1cblxuICAvKiogQSBsYWJlbCBmb3IgdGhlICdzd2l0Y2ggdG8gY2xvY2sgaG91ciB2aWV3JyBidXR0b24gKHVzZWQgYnkgc2NyZWVuIHJlYWRlcnMpLiAqL1xuICBzd2l0Y2hUb0Nsb2NrSG91clZpZXdMYWJlbCA9ICdDaG9vc2UgaG91cic7XG5cbiAgLyoqIEEgbGFiZWwgZm9yIHRoZSAnc3dpdGNoIHRvIGNsb2NrIG1pbnV0ZSB2aWV3JyBidXR0b24gKHVzZWQgYnkgc2NyZWVuIHJlYWRlcnMpLiAqL1xuICBzd2l0Y2hUb0Nsb2NrTWludXRlVmlld0xhYmVsID0gJ0Nob29zZSBtaW51dGUnO1xuXG4gIC8qKiBMYWJlbCB1c2VkIGZvciBvayBidXR0b24gd2l0aGluIHRoZSBtYW51YWwgdGltZSBpbnB1dC4gKi9cbiAgb2tMYWJlbCA9ICdPSyc7XG5cbiAgLyoqIExhYmVsIHVzZWQgZm9yIGNhbmNlbCBidXR0b24gd2l0aGluIHRoZSBtYW51YWwgdGltZSBpbnB1dC4gKi9cbiAgY2FuY2VsTGFiZWwgPSAnQ2FuY2VsJztcbn1cbiJdfQ==