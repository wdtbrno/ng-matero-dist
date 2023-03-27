/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Injectable, NgZone } from '@angular/core';
import { combineLatest, Observable, Subject } from 'rxjs';
import { distinctUntilChanged, map, share, skip, startWith } from 'rxjs/operators';
import { closest } from './polyfill';
import { HEADER_ROW_SELECTOR } from './selectors';
/** Coordinates events between the column resize directives. */
export class HeaderRowEventDispatcher {
    constructor(_ngZone) {
        this._ngZone = _ngZone;
        /**
         * Emits the currently hovered header cell or null when no header cells are hovered.
         * Exposed publicly for events to feed in, but subscribers should use headerCellHoveredDistinct,
         * defined below.
         */
        this.headerCellHovered = new Subject();
        /**
         * Emits the header cell for which a user-triggered resize is active or null
         * when no resize is in progress.
         */
        this.overlayHandleActiveForCell = new Subject();
        /** Distinct and shared version of headerCellHovered. */
        this.headerCellHoveredDistinct = this.headerCellHovered.pipe(distinctUntilChanged(), share());
        /**
         * Emits the header that is currently hovered or hosting an active resize event (with active
         * taking precedence).
         */
        this.headerRowHoveredOrActiveDistinct = combineLatest(this.headerCellHoveredDistinct.pipe(map(cell => closest(cell, HEADER_ROW_SELECTOR)), startWith(null), distinctUntilChanged()), this.overlayHandleActiveForCell.pipe(map(cell => closest(cell, HEADER_ROW_SELECTOR)), startWith(null), distinctUntilChanged())).pipe(skip(1), // Ignore initial [null, null] emission.
        map(([hovered, active]) => active || hovered), distinctUntilChanged(), share());
        this._headerRowHoveredOrActiveDistinctReenterZone = this.headerRowHoveredOrActiveDistinct.pipe(this._enterZone(), share());
        // Optimization: Share row events observable with subsequent callers.
        // At startup, calls will be sequential by row (and typically there's only one).
        this._lastSeenRow = null;
        this._lastSeenRowHover = null;
    }
    /**
     * Emits whether the specified row should show its overlay controls.
     * Emission occurs within the NgZone.
     */
    resizeOverlayVisibleForHeaderRow(row) {
        if (row !== this._lastSeenRow) {
            this._lastSeenRow = row;
            this._lastSeenRowHover = this._headerRowHoveredOrActiveDistinctReenterZone.pipe(map(hoveredRow => hoveredRow === row), distinctUntilChanged(), share());
        }
        return this._lastSeenRowHover;
    }
    _enterZone() {
        return (source) => new Observable(observer => source.subscribe({
            next: value => this._ngZone.run(() => observer.next(value)),
            error: err => observer.error(err),
            complete: () => observer.complete(),
        }));
    }
}
HeaderRowEventDispatcher.decorators = [
    { type: Injectable }
];
/** @nocollapse */
HeaderRowEventDispatcher.ctorParameters = () => [
    { type: NgZone }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXZlbnQtZGlzcGF0Y2hlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL2V4dGVuc2lvbnMvY29sdW1uLXJlc2l6ZS9ldmVudC1kaXNwYXRjaGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ25ELE9BQU8sRUFBRSxhQUFhLEVBQTRCLFVBQVUsRUFBRSxPQUFPLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDcEYsT0FBTyxFQUFFLG9CQUFvQixFQUFFLEdBQUcsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQ25GLE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxZQUFZLENBQUM7QUFFckMsT0FBTyxFQUFFLG1CQUFtQixFQUFFLE1BQU0sYUFBYSxDQUFDO0FBRWxELCtEQUErRDtBQUUvRCxNQUFNLE9BQU8sd0JBQXdCO0lBY25DLFlBQTZCLE9BQWU7UUFBZixZQUFPLEdBQVAsT0FBTyxDQUFRO1FBYjVDOzs7O1dBSUc7UUFDTSxzQkFBaUIsR0FBRyxJQUFJLE9BQU8sRUFBa0IsQ0FBQztRQUUzRDs7O1dBR0c7UUFDTSwrQkFBMEIsR0FBRyxJQUFJLE9BQU8sRUFBa0IsQ0FBQztRQUlwRSx3REFBd0Q7UUFDL0MsOEJBQXlCLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxvQkFBb0IsRUFBRSxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUM7UUFFbEc7OztXQUdHO1FBQ00scUNBQWdDLEdBQUcsYUFBYSxDQUN2RCxJQUFJLENBQUMseUJBQXlCLENBQUMsSUFBSSxDQUNqQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLG1CQUFtQixDQUFDLENBQUMsRUFDL0MsU0FBUyxDQUFDLElBQUksQ0FBQyxFQUNmLG9CQUFvQixFQUFFLENBQ3ZCLEVBQ0QsSUFBSSxDQUFDLDBCQUEwQixDQUFDLElBQUksQ0FDbEMsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxtQkFBbUIsQ0FBQyxDQUFDLEVBQy9DLFNBQVMsQ0FBQyxJQUFJLENBQUMsRUFDZixvQkFBb0IsRUFBRSxDQUN2QixDQUNGLENBQUMsSUFBSSxDQUNKLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSx3Q0FBd0M7UUFDakQsR0FBRyxDQUFDLENBQUMsQ0FBQyxPQUFPLEVBQUUsTUFBTSxDQUFDLEVBQUUsRUFBRSxDQUFDLE1BQU0sSUFBSSxPQUFPLENBQUMsRUFDN0Msb0JBQW9CLEVBQUUsRUFDdEIsS0FBSyxFQUFFLENBQ1IsQ0FBQztRQUVlLGlEQUE0QyxHQUFHLElBQUksQ0FBQyxnQ0FBZ0MsQ0FBQyxJQUFJLENBQ3hHLElBQUksQ0FBQyxVQUFVLEVBQUUsRUFDakIsS0FBSyxFQUFFLENBQ1IsQ0FBQztRQUVGLHFFQUFxRTtRQUNyRSxnRkFBZ0Y7UUFDeEUsaUJBQVksR0FBbUIsSUFBSSxDQUFDO1FBQ3BDLHNCQUFpQixHQUErQixJQUFJLENBQUM7SUFuQ2QsQ0FBQztJQXFDaEQ7OztPQUdHO0lBQ0gsZ0NBQWdDLENBQUMsR0FBWTtRQUMzQyxJQUFJLEdBQUcsS0FBSyxJQUFJLENBQUMsWUFBWSxFQUFFO1lBQzdCLElBQUksQ0FBQyxZQUFZLEdBQUcsR0FBRyxDQUFDO1lBQ3hCLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxJQUFJLENBQUMsNENBQTRDLENBQUMsSUFBSSxDQUM3RSxHQUFHLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxVQUFVLEtBQUssR0FBRyxDQUFDLEVBQ3JDLG9CQUFvQixFQUFFLEVBQ3RCLEtBQUssRUFBRSxDQUNSLENBQUM7U0FDSDtRQUVELE9BQU8sSUFBSSxDQUFDLGlCQUFrQixDQUFDO0lBQ2pDLENBQUM7SUFFTyxVQUFVO1FBQ2hCLE9BQU8sQ0FBQyxNQUFxQixFQUFFLEVBQUUsQ0FDL0IsSUFBSSxVQUFVLENBQUksUUFBUSxDQUFDLEVBQUUsQ0FDM0IsTUFBTSxDQUFDLFNBQVMsQ0FBQztZQUNmLElBQUksRUFBRSxLQUFLLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDM0QsS0FBSyxFQUFFLEdBQUcsQ0FBQyxFQUFFLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUM7WUFDakMsUUFBUSxFQUFFLEdBQUcsRUFBRSxDQUFDLFFBQVEsQ0FBQyxRQUFRLEVBQUU7U0FDcEMsQ0FBQyxDQUNILENBQUM7SUFDTixDQUFDOzs7WUE5RUYsVUFBVTs7OztZQVJVLE1BQU0iLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHsgSW5qZWN0YWJsZSwgTmdab25lIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBjb21iaW5lTGF0ZXN0LCBNb25vVHlwZU9wZXJhdG9yRnVuY3Rpb24sIE9ic2VydmFibGUsIFN1YmplY3QgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IGRpc3RpbmN0VW50aWxDaGFuZ2VkLCBtYXAsIHNoYXJlLCBza2lwLCBzdGFydFdpdGggfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQgeyBjbG9zZXN0IH0gZnJvbSAnLi9wb2x5ZmlsbCc7XG5cbmltcG9ydCB7IEhFQURFUl9ST1dfU0VMRUNUT1IgfSBmcm9tICcuL3NlbGVjdG9ycyc7XG5cbi8qKiBDb29yZGluYXRlcyBldmVudHMgYmV0d2VlbiB0aGUgY29sdW1uIHJlc2l6ZSBkaXJlY3RpdmVzLiAqL1xuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIEhlYWRlclJvd0V2ZW50RGlzcGF0Y2hlciB7XG4gIC8qKlxuICAgKiBFbWl0cyB0aGUgY3VycmVudGx5IGhvdmVyZWQgaGVhZGVyIGNlbGwgb3IgbnVsbCB3aGVuIG5vIGhlYWRlciBjZWxscyBhcmUgaG92ZXJlZC5cbiAgICogRXhwb3NlZCBwdWJsaWNseSBmb3IgZXZlbnRzIHRvIGZlZWQgaW4sIGJ1dCBzdWJzY3JpYmVycyBzaG91bGQgdXNlIGhlYWRlckNlbGxIb3ZlcmVkRGlzdGluY3QsXG4gICAqIGRlZmluZWQgYmVsb3cuXG4gICAqL1xuICByZWFkb25seSBoZWFkZXJDZWxsSG92ZXJlZCA9IG5ldyBTdWJqZWN0PEVsZW1lbnQgfCBudWxsPigpO1xuXG4gIC8qKlxuICAgKiBFbWl0cyB0aGUgaGVhZGVyIGNlbGwgZm9yIHdoaWNoIGEgdXNlci10cmlnZ2VyZWQgcmVzaXplIGlzIGFjdGl2ZSBvciBudWxsXG4gICAqIHdoZW4gbm8gcmVzaXplIGlzIGluIHByb2dyZXNzLlxuICAgKi9cbiAgcmVhZG9ubHkgb3ZlcmxheUhhbmRsZUFjdGl2ZUZvckNlbGwgPSBuZXcgU3ViamVjdDxFbGVtZW50IHwgbnVsbD4oKTtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlYWRvbmx5IF9uZ1pvbmU6IE5nWm9uZSkge31cblxuICAvKiogRGlzdGluY3QgYW5kIHNoYXJlZCB2ZXJzaW9uIG9mIGhlYWRlckNlbGxIb3ZlcmVkLiAqL1xuICByZWFkb25seSBoZWFkZXJDZWxsSG92ZXJlZERpc3RpbmN0ID0gdGhpcy5oZWFkZXJDZWxsSG92ZXJlZC5waXBlKGRpc3RpbmN0VW50aWxDaGFuZ2VkKCksIHNoYXJlKCkpO1xuXG4gIC8qKlxuICAgKiBFbWl0cyB0aGUgaGVhZGVyIHRoYXQgaXMgY3VycmVudGx5IGhvdmVyZWQgb3IgaG9zdGluZyBhbiBhY3RpdmUgcmVzaXplIGV2ZW50ICh3aXRoIGFjdGl2ZVxuICAgKiB0YWtpbmcgcHJlY2VkZW5jZSkuXG4gICAqL1xuICByZWFkb25seSBoZWFkZXJSb3dIb3ZlcmVkT3JBY3RpdmVEaXN0aW5jdCA9IGNvbWJpbmVMYXRlc3QoXG4gICAgdGhpcy5oZWFkZXJDZWxsSG92ZXJlZERpc3RpbmN0LnBpcGUoXG4gICAgICBtYXAoY2VsbCA9PiBjbG9zZXN0KGNlbGwsIEhFQURFUl9ST1dfU0VMRUNUT1IpKSxcbiAgICAgIHN0YXJ0V2l0aChudWxsKSxcbiAgICAgIGRpc3RpbmN0VW50aWxDaGFuZ2VkKClcbiAgICApLFxuICAgIHRoaXMub3ZlcmxheUhhbmRsZUFjdGl2ZUZvckNlbGwucGlwZShcbiAgICAgIG1hcChjZWxsID0+IGNsb3Nlc3QoY2VsbCwgSEVBREVSX1JPV19TRUxFQ1RPUikpLFxuICAgICAgc3RhcnRXaXRoKG51bGwpLFxuICAgICAgZGlzdGluY3RVbnRpbENoYW5nZWQoKVxuICAgIClcbiAgKS5waXBlKFxuICAgIHNraXAoMSksIC8vIElnbm9yZSBpbml0aWFsIFtudWxsLCBudWxsXSBlbWlzc2lvbi5cbiAgICBtYXAoKFtob3ZlcmVkLCBhY3RpdmVdKSA9PiBhY3RpdmUgfHwgaG92ZXJlZCksXG4gICAgZGlzdGluY3RVbnRpbENoYW5nZWQoKSxcbiAgICBzaGFyZSgpXG4gICk7XG5cbiAgcHJpdmF0ZSByZWFkb25seSBfaGVhZGVyUm93SG92ZXJlZE9yQWN0aXZlRGlzdGluY3RSZWVudGVyWm9uZSA9IHRoaXMuaGVhZGVyUm93SG92ZXJlZE9yQWN0aXZlRGlzdGluY3QucGlwZShcbiAgICB0aGlzLl9lbnRlclpvbmUoKSxcbiAgICBzaGFyZSgpXG4gICk7XG5cbiAgLy8gT3B0aW1pemF0aW9uOiBTaGFyZSByb3cgZXZlbnRzIG9ic2VydmFibGUgd2l0aCBzdWJzZXF1ZW50IGNhbGxlcnMuXG4gIC8vIEF0IHN0YXJ0dXAsIGNhbGxzIHdpbGwgYmUgc2VxdWVudGlhbCBieSByb3cgKGFuZCB0eXBpY2FsbHkgdGhlcmUncyBvbmx5IG9uZSkuXG4gIHByaXZhdGUgX2xhc3RTZWVuUm93OiBFbGVtZW50IHwgbnVsbCA9IG51bGw7XG4gIHByaXZhdGUgX2xhc3RTZWVuUm93SG92ZXI6IE9ic2VydmFibGU8Ym9vbGVhbj4gfCBudWxsID0gbnVsbDtcblxuICAvKipcbiAgICogRW1pdHMgd2hldGhlciB0aGUgc3BlY2lmaWVkIHJvdyBzaG91bGQgc2hvdyBpdHMgb3ZlcmxheSBjb250cm9scy5cbiAgICogRW1pc3Npb24gb2NjdXJzIHdpdGhpbiB0aGUgTmdab25lLlxuICAgKi9cbiAgcmVzaXplT3ZlcmxheVZpc2libGVGb3JIZWFkZXJSb3cocm93OiBFbGVtZW50KTogT2JzZXJ2YWJsZTxib29sZWFuPiB7XG4gICAgaWYgKHJvdyAhPT0gdGhpcy5fbGFzdFNlZW5Sb3cpIHtcbiAgICAgIHRoaXMuX2xhc3RTZWVuUm93ID0gcm93O1xuICAgICAgdGhpcy5fbGFzdFNlZW5Sb3dIb3ZlciA9IHRoaXMuX2hlYWRlclJvd0hvdmVyZWRPckFjdGl2ZURpc3RpbmN0UmVlbnRlclpvbmUucGlwZShcbiAgICAgICAgbWFwKGhvdmVyZWRSb3cgPT4gaG92ZXJlZFJvdyA9PT0gcm93KSxcbiAgICAgICAgZGlzdGluY3RVbnRpbENoYW5nZWQoKSxcbiAgICAgICAgc2hhcmUoKVxuICAgICAgKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5fbGFzdFNlZW5Sb3dIb3ZlciE7XG4gIH1cblxuICBwcml2YXRlIF9lbnRlclpvbmU8VD4oKTogTW9ub1R5cGVPcGVyYXRvckZ1bmN0aW9uPFQ+IHtcbiAgICByZXR1cm4gKHNvdXJjZTogT2JzZXJ2YWJsZTxUPikgPT5cbiAgICAgIG5ldyBPYnNlcnZhYmxlPFQ+KG9ic2VydmVyID0+XG4gICAgICAgIHNvdXJjZS5zdWJzY3JpYmUoe1xuICAgICAgICAgIG5leHQ6IHZhbHVlID0+IHRoaXMuX25nWm9uZS5ydW4oKCkgPT4gb2JzZXJ2ZXIubmV4dCh2YWx1ZSkpLFxuICAgICAgICAgIGVycm9yOiBlcnIgPT4gb2JzZXJ2ZXIuZXJyb3IoZXJyKSxcbiAgICAgICAgICBjb21wbGV0ZTogKCkgPT4gb2JzZXJ2ZXIuY29tcGxldGUoKSxcbiAgICAgICAgfSlcbiAgICAgICk7XG4gIH1cbn1cbiJdfQ==