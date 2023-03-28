/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Injectable } from '@angular/core';
import { combineLatest, Observable, Subject } from 'rxjs';
import { distinctUntilChanged, map, share, skip, startWith } from 'rxjs/operators';
import { closest } from './polyfill';
import { HEADER_ROW_SELECTOR } from './selectors';
import * as i0 from "@angular/core";
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
/** @nocollapse */ HeaderRowEventDispatcher.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: HeaderRowEventDispatcher, deps: [{ token: i0.NgZone }], target: i0.ɵɵFactoryTarget.Injectable });
/** @nocollapse */ HeaderRowEventDispatcher.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: HeaderRowEventDispatcher });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: HeaderRowEventDispatcher, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i0.NgZone }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXZlbnQtZGlzcGF0Y2hlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL2V4dGVuc2lvbnMvY29sdW1uLXJlc2l6ZS9ldmVudC1kaXNwYXRjaGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFBRSxVQUFVLEVBQVUsTUFBTSxlQUFlLENBQUM7QUFDbkQsT0FBTyxFQUFFLGFBQWEsRUFBNEIsVUFBVSxFQUFFLE9BQU8sRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUNwRixPQUFPLEVBQUUsb0JBQW9CLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDbkYsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLFlBQVksQ0FBQztBQUVyQyxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSxhQUFhLENBQUM7O0FBRWxELCtEQUErRDtBQUUvRCxNQUFNLE9BQU8sd0JBQXdCO0lBY25DLFlBQTZCLE9BQWU7UUFBZixZQUFPLEdBQVAsT0FBTyxDQUFRO1FBYjVDOzs7O1dBSUc7UUFDTSxzQkFBaUIsR0FBRyxJQUFJLE9BQU8sRUFBa0IsQ0FBQztRQUUzRDs7O1dBR0c7UUFDTSwrQkFBMEIsR0FBRyxJQUFJLE9BQU8sRUFBa0IsQ0FBQztRQUlwRSx3REFBd0Q7UUFDL0MsOEJBQXlCLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxvQkFBb0IsRUFBRSxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUM7UUFFbEc7OztXQUdHO1FBQ00scUNBQWdDLEdBQUcsYUFBYSxDQUN2RCxJQUFJLENBQUMseUJBQXlCLENBQUMsSUFBSSxDQUNqQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLG1CQUFtQixDQUFDLENBQUMsRUFDL0MsU0FBUyxDQUFDLElBQUksQ0FBQyxFQUNmLG9CQUFvQixFQUFFLENBQ3ZCLEVBQ0QsSUFBSSxDQUFDLDBCQUEwQixDQUFDLElBQUksQ0FDbEMsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxtQkFBbUIsQ0FBQyxDQUFDLEVBQy9DLFNBQVMsQ0FBQyxJQUFJLENBQUMsRUFDZixvQkFBb0IsRUFBRSxDQUN2QixDQUNGLENBQUMsSUFBSSxDQUNKLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSx3Q0FBd0M7UUFDakQsR0FBRyxDQUFDLENBQUMsQ0FBQyxPQUFPLEVBQUUsTUFBTSxDQUFDLEVBQUUsRUFBRSxDQUFDLE1BQU0sSUFBSSxPQUFPLENBQUMsRUFDN0Msb0JBQW9CLEVBQUUsRUFDdEIsS0FBSyxFQUFFLENBQ1IsQ0FBQztRQUVlLGlEQUE0QyxHQUMzRCxJQUFJLENBQUMsZ0NBQWdDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDO1FBRXpFLHFFQUFxRTtRQUNyRSxnRkFBZ0Y7UUFDeEUsaUJBQVksR0FBbUIsSUFBSSxDQUFDO1FBQ3BDLHNCQUFpQixHQUErQixJQUFJLENBQUM7SUFqQ2QsQ0FBQztJQW1DaEQ7OztPQUdHO0lBQ0gsZ0NBQWdDLENBQUMsR0FBWTtRQUMzQyxJQUFJLEdBQUcsS0FBSyxJQUFJLENBQUMsWUFBWSxFQUFFO1lBQzdCLElBQUksQ0FBQyxZQUFZLEdBQUcsR0FBRyxDQUFDO1lBQ3hCLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxJQUFJLENBQUMsNENBQTRDLENBQUMsSUFBSSxDQUM3RSxHQUFHLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxVQUFVLEtBQUssR0FBRyxDQUFDLEVBQ3JDLG9CQUFvQixFQUFFLEVBQ3RCLEtBQUssRUFBRSxDQUNSLENBQUM7U0FDSDtRQUVELE9BQU8sSUFBSSxDQUFDLGlCQUFrQixDQUFDO0lBQ2pDLENBQUM7SUFFTyxVQUFVO1FBQ2hCLE9BQU8sQ0FBQyxNQUFxQixFQUFFLEVBQUUsQ0FDL0IsSUFBSSxVQUFVLENBQUksUUFBUSxDQUFDLEVBQUUsQ0FDM0IsTUFBTSxDQUFDLFNBQVMsQ0FBQztZQUNmLElBQUksRUFBRSxLQUFLLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDM0QsS0FBSyxFQUFFLEdBQUcsQ0FBQyxFQUFFLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUM7WUFDakMsUUFBUSxFQUFFLEdBQUcsRUFBRSxDQUFDLFFBQVEsQ0FBQyxRQUFRLEVBQUU7U0FDcEMsQ0FBQyxDQUNILENBQUM7SUFDTixDQUFDOzt3SUEzRVUsd0JBQXdCOzRJQUF4Qix3QkFBd0I7MkZBQXhCLHdCQUF3QjtrQkFEcEMsVUFBVSIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQgeyBJbmplY3RhYmxlLCBOZ1pvbmUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IGNvbWJpbmVMYXRlc3QsIE1vbm9UeXBlT3BlcmF0b3JGdW5jdGlvbiwgT2JzZXJ2YWJsZSwgU3ViamVjdCB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgZGlzdGluY3RVbnRpbENoYW5nZWQsIG1hcCwgc2hhcmUsIHNraXAsIHN0YXJ0V2l0aCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7IGNsb3Nlc3QgfSBmcm9tICcuL3BvbHlmaWxsJztcblxuaW1wb3J0IHsgSEVBREVSX1JPV19TRUxFQ1RPUiB9IGZyb20gJy4vc2VsZWN0b3JzJztcblxuLyoqIENvb3JkaW5hdGVzIGV2ZW50cyBiZXR3ZWVuIHRoZSBjb2x1bW4gcmVzaXplIGRpcmVjdGl2ZXMuICovXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgSGVhZGVyUm93RXZlbnREaXNwYXRjaGVyIHtcbiAgLyoqXG4gICAqIEVtaXRzIHRoZSBjdXJyZW50bHkgaG92ZXJlZCBoZWFkZXIgY2VsbCBvciBudWxsIHdoZW4gbm8gaGVhZGVyIGNlbGxzIGFyZSBob3ZlcmVkLlxuICAgKiBFeHBvc2VkIHB1YmxpY2x5IGZvciBldmVudHMgdG8gZmVlZCBpbiwgYnV0IHN1YnNjcmliZXJzIHNob3VsZCB1c2UgaGVhZGVyQ2VsbEhvdmVyZWREaXN0aW5jdCxcbiAgICogZGVmaW5lZCBiZWxvdy5cbiAgICovXG4gIHJlYWRvbmx5IGhlYWRlckNlbGxIb3ZlcmVkID0gbmV3IFN1YmplY3Q8RWxlbWVudCB8IG51bGw+KCk7XG5cbiAgLyoqXG4gICAqIEVtaXRzIHRoZSBoZWFkZXIgY2VsbCBmb3Igd2hpY2ggYSB1c2VyLXRyaWdnZXJlZCByZXNpemUgaXMgYWN0aXZlIG9yIG51bGxcbiAgICogd2hlbiBubyByZXNpemUgaXMgaW4gcHJvZ3Jlc3MuXG4gICAqL1xuICByZWFkb25seSBvdmVybGF5SGFuZGxlQWN0aXZlRm9yQ2VsbCA9IG5ldyBTdWJqZWN0PEVsZW1lbnQgfCBudWxsPigpO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVhZG9ubHkgX25nWm9uZTogTmdab25lKSB7fVxuXG4gIC8qKiBEaXN0aW5jdCBhbmQgc2hhcmVkIHZlcnNpb24gb2YgaGVhZGVyQ2VsbEhvdmVyZWQuICovXG4gIHJlYWRvbmx5IGhlYWRlckNlbGxIb3ZlcmVkRGlzdGluY3QgPSB0aGlzLmhlYWRlckNlbGxIb3ZlcmVkLnBpcGUoZGlzdGluY3RVbnRpbENoYW5nZWQoKSwgc2hhcmUoKSk7XG5cbiAgLyoqXG4gICAqIEVtaXRzIHRoZSBoZWFkZXIgdGhhdCBpcyBjdXJyZW50bHkgaG92ZXJlZCBvciBob3N0aW5nIGFuIGFjdGl2ZSByZXNpemUgZXZlbnQgKHdpdGggYWN0aXZlXG4gICAqIHRha2luZyBwcmVjZWRlbmNlKS5cbiAgICovXG4gIHJlYWRvbmx5IGhlYWRlclJvd0hvdmVyZWRPckFjdGl2ZURpc3RpbmN0ID0gY29tYmluZUxhdGVzdChcbiAgICB0aGlzLmhlYWRlckNlbGxIb3ZlcmVkRGlzdGluY3QucGlwZShcbiAgICAgIG1hcChjZWxsID0+IGNsb3Nlc3QoY2VsbCwgSEVBREVSX1JPV19TRUxFQ1RPUikpLFxuICAgICAgc3RhcnRXaXRoKG51bGwpLFxuICAgICAgZGlzdGluY3RVbnRpbENoYW5nZWQoKVxuICAgICksXG4gICAgdGhpcy5vdmVybGF5SGFuZGxlQWN0aXZlRm9yQ2VsbC5waXBlKFxuICAgICAgbWFwKGNlbGwgPT4gY2xvc2VzdChjZWxsLCBIRUFERVJfUk9XX1NFTEVDVE9SKSksXG4gICAgICBzdGFydFdpdGgobnVsbCksXG4gICAgICBkaXN0aW5jdFVudGlsQ2hhbmdlZCgpXG4gICAgKVxuICApLnBpcGUoXG4gICAgc2tpcCgxKSwgLy8gSWdub3JlIGluaXRpYWwgW251bGwsIG51bGxdIGVtaXNzaW9uLlxuICAgIG1hcCgoW2hvdmVyZWQsIGFjdGl2ZV0pID0+IGFjdGl2ZSB8fCBob3ZlcmVkKSxcbiAgICBkaXN0aW5jdFVudGlsQ2hhbmdlZCgpLFxuICAgIHNoYXJlKClcbiAgKTtcblxuICBwcml2YXRlIHJlYWRvbmx5IF9oZWFkZXJSb3dIb3ZlcmVkT3JBY3RpdmVEaXN0aW5jdFJlZW50ZXJab25lID1cbiAgICB0aGlzLmhlYWRlclJvd0hvdmVyZWRPckFjdGl2ZURpc3RpbmN0LnBpcGUodGhpcy5fZW50ZXJab25lKCksIHNoYXJlKCkpO1xuXG4gIC8vIE9wdGltaXphdGlvbjogU2hhcmUgcm93IGV2ZW50cyBvYnNlcnZhYmxlIHdpdGggc3Vic2VxdWVudCBjYWxsZXJzLlxuICAvLyBBdCBzdGFydHVwLCBjYWxscyB3aWxsIGJlIHNlcXVlbnRpYWwgYnkgcm93IChhbmQgdHlwaWNhbGx5IHRoZXJlJ3Mgb25seSBvbmUpLlxuICBwcml2YXRlIF9sYXN0U2VlblJvdzogRWxlbWVudCB8IG51bGwgPSBudWxsO1xuICBwcml2YXRlIF9sYXN0U2VlblJvd0hvdmVyOiBPYnNlcnZhYmxlPGJvb2xlYW4+IHwgbnVsbCA9IG51bGw7XG5cbiAgLyoqXG4gICAqIEVtaXRzIHdoZXRoZXIgdGhlIHNwZWNpZmllZCByb3cgc2hvdWxkIHNob3cgaXRzIG92ZXJsYXkgY29udHJvbHMuXG4gICAqIEVtaXNzaW9uIG9jY3VycyB3aXRoaW4gdGhlIE5nWm9uZS5cbiAgICovXG4gIHJlc2l6ZU92ZXJsYXlWaXNpYmxlRm9ySGVhZGVyUm93KHJvdzogRWxlbWVudCk6IE9ic2VydmFibGU8Ym9vbGVhbj4ge1xuICAgIGlmIChyb3cgIT09IHRoaXMuX2xhc3RTZWVuUm93KSB7XG4gICAgICB0aGlzLl9sYXN0U2VlblJvdyA9IHJvdztcbiAgICAgIHRoaXMuX2xhc3RTZWVuUm93SG92ZXIgPSB0aGlzLl9oZWFkZXJSb3dIb3ZlcmVkT3JBY3RpdmVEaXN0aW5jdFJlZW50ZXJab25lLnBpcGUoXG4gICAgICAgIG1hcChob3ZlcmVkUm93ID0+IGhvdmVyZWRSb3cgPT09IHJvdyksXG4gICAgICAgIGRpc3RpbmN0VW50aWxDaGFuZ2VkKCksXG4gICAgICAgIHNoYXJlKClcbiAgICAgICk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuX2xhc3RTZWVuUm93SG92ZXIhO1xuICB9XG5cbiAgcHJpdmF0ZSBfZW50ZXJab25lPFQ+KCk6IE1vbm9UeXBlT3BlcmF0b3JGdW5jdGlvbjxUPiB7XG4gICAgcmV0dXJuIChzb3VyY2U6IE9ic2VydmFibGU8VD4pID0+XG4gICAgICBuZXcgT2JzZXJ2YWJsZTxUPihvYnNlcnZlciA9PlxuICAgICAgICBzb3VyY2Uuc3Vic2NyaWJlKHtcbiAgICAgICAgICBuZXh0OiB2YWx1ZSA9PiB0aGlzLl9uZ1pvbmUucnVuKCgpID0+IG9ic2VydmVyLm5leHQodmFsdWUpKSxcbiAgICAgICAgICBlcnJvcjogZXJyID0+IG9ic2VydmVyLmVycm9yKGVyciksXG4gICAgICAgICAgY29tcGxldGU6ICgpID0+IG9ic2VydmVyLmNvbXBsZXRlKCksXG4gICAgICAgIH0pXG4gICAgICApO1xuICB9XG59XG4iXX0=