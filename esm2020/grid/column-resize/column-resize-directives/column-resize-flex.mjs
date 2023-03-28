/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Directive } from '@angular/core';
import { ColumnResize, } from '@ng-matero/extensions/column-resize';
import { AbstractMatColumnResize, FLEX_HOST_BINDINGS, FLEX_PROVIDERS } from './common';
import * as i0 from "@angular/core";
import * as i1 from "@ng-matero/extensions/column-resize";
/**
 * Explicitly enables column resizing for a flexbox-based mat-table.
 * Individual columns must be annotated specifically.
 */
export class MatColumnResizeFlex extends AbstractMatColumnResize {
    constructor(columnResizeNotifier, elementRef, eventDispatcher, ngZone, notifier) {
        super();
        this.columnResizeNotifier = columnResizeNotifier;
        this.elementRef = elementRef;
        this.eventDispatcher = eventDispatcher;
        this.ngZone = ngZone;
        this.notifier = notifier;
    }
}
/** @nocollapse */ MatColumnResizeFlex.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MatColumnResizeFlex, deps: [{ token: i1.ColumnResizeNotifier }, { token: i0.ElementRef }, { token: i1.HeaderRowEventDispatcher }, { token: i0.NgZone }, { token: i1.ColumnResizeNotifierSource }], target: i0.ɵɵFactoryTarget.Directive });
/** @nocollapse */ MatColumnResizeFlex.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.2.1", type: MatColumnResizeFlex, selector: "mat-table[columnResize]", host: { classAttribute: "mat-column-resize-flex" }, providers: [...FLEX_PROVIDERS, { provide: ColumnResize, useExisting: MatColumnResizeFlex }], usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MatColumnResizeFlex, decorators: [{
            type: Directive,
            args: [{
                    selector: 'mat-table[columnResize]',
                    host: FLEX_HOST_BINDINGS,
                    providers: [...FLEX_PROVIDERS, { provide: ColumnResize, useExisting: MatColumnResizeFlex }],
                }]
        }], ctorParameters: function () { return [{ type: i1.ColumnResizeNotifier }, { type: i0.ElementRef }, { type: i1.HeaderRowEventDispatcher }, { type: i0.NgZone }, { type: i1.ColumnResizeNotifierSource }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29sdW1uLXJlc2l6ZS1mbGV4LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvZXh0ZW5zaW9ucy9ncmlkL2NvbHVtbi1yZXNpemUvY29sdW1uLXJlc2l6ZS1kaXJlY3RpdmVzL2NvbHVtbi1yZXNpemUtZmxleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQUUsU0FBUyxFQUFzQixNQUFNLGVBQWUsQ0FBQztBQUM5RCxPQUFPLEVBQ0wsWUFBWSxHQUliLE1BQU0scUNBQXFDLENBQUM7QUFFN0MsT0FBTyxFQUFFLHVCQUF1QixFQUFFLGtCQUFrQixFQUFFLGNBQWMsRUFBRSxNQUFNLFVBQVUsQ0FBQzs7O0FBRXZGOzs7R0FHRztBQU1ILE1BQU0sT0FBTyxtQkFBb0IsU0FBUSx1QkFBdUI7SUFDOUQsWUFDVyxvQkFBMEMsRUFDMUMsVUFBbUMsRUFDekIsZUFBeUMsRUFDekMsTUFBYyxFQUNkLFFBQW9DO1FBRXZELEtBQUssRUFBRSxDQUFDO1FBTkMseUJBQW9CLEdBQXBCLG9CQUFvQixDQUFzQjtRQUMxQyxlQUFVLEdBQVYsVUFBVSxDQUF5QjtRQUN6QixvQkFBZSxHQUFmLGVBQWUsQ0FBMEI7UUFDekMsV0FBTSxHQUFOLE1BQU0sQ0FBUTtRQUNkLGFBQVEsR0FBUixRQUFRLENBQTRCO0lBR3pELENBQUM7O21JQVRVLG1CQUFtQjt1SEFBbkIsbUJBQW1CLHNHQUZuQixDQUFDLEdBQUcsY0FBYyxFQUFFLEVBQUUsT0FBTyxFQUFFLFlBQVksRUFBRSxXQUFXLEVBQUUsbUJBQW1CLEVBQUUsQ0FBQzsyRkFFaEYsbUJBQW1CO2tCQUwvQixTQUFTO21CQUFDO29CQUNULFFBQVEsRUFBRSx5QkFBeUI7b0JBQ25DLElBQUksRUFBRSxrQkFBa0I7b0JBQ3hCLFNBQVMsRUFBRSxDQUFDLEdBQUcsY0FBYyxFQUFFLEVBQUUsT0FBTyxFQUFFLFlBQVksRUFBRSxXQUFXLHFCQUFxQixFQUFFLENBQUM7aUJBQzVGIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7IERpcmVjdGl2ZSwgRWxlbWVudFJlZiwgTmdab25lIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1xuICBDb2x1bW5SZXNpemUsXG4gIENvbHVtblJlc2l6ZU5vdGlmaWVyLFxuICBDb2x1bW5SZXNpemVOb3RpZmllclNvdXJjZSxcbiAgSGVhZGVyUm93RXZlbnREaXNwYXRjaGVyLFxufSBmcm9tICdAbmctbWF0ZXJvL2V4dGVuc2lvbnMvY29sdW1uLXJlc2l6ZSc7XG5cbmltcG9ydCB7IEFic3RyYWN0TWF0Q29sdW1uUmVzaXplLCBGTEVYX0hPU1RfQklORElOR1MsIEZMRVhfUFJPVklERVJTIH0gZnJvbSAnLi9jb21tb24nO1xuXG4vKipcbiAqIEV4cGxpY2l0bHkgZW5hYmxlcyBjb2x1bW4gcmVzaXppbmcgZm9yIGEgZmxleGJveC1iYXNlZCBtYXQtdGFibGUuXG4gKiBJbmRpdmlkdWFsIGNvbHVtbnMgbXVzdCBiZSBhbm5vdGF0ZWQgc3BlY2lmaWNhbGx5LlxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdtYXQtdGFibGVbY29sdW1uUmVzaXplXScsXG4gIGhvc3Q6IEZMRVhfSE9TVF9CSU5ESU5HUyxcbiAgcHJvdmlkZXJzOiBbLi4uRkxFWF9QUk9WSURFUlMsIHsgcHJvdmlkZTogQ29sdW1uUmVzaXplLCB1c2VFeGlzdGluZzogTWF0Q29sdW1uUmVzaXplRmxleCB9XSxcbn0pXG5leHBvcnQgY2xhc3MgTWF0Q29sdW1uUmVzaXplRmxleCBleHRlbmRzIEFic3RyYWN0TWF0Q29sdW1uUmVzaXplIHtcbiAgY29uc3RydWN0b3IoXG4gICAgcmVhZG9ubHkgY29sdW1uUmVzaXplTm90aWZpZXI6IENvbHVtblJlc2l6ZU5vdGlmaWVyLFxuICAgIHJlYWRvbmx5IGVsZW1lbnRSZWY6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+LFxuICAgIHByb3RlY3RlZCByZWFkb25seSBldmVudERpc3BhdGNoZXI6IEhlYWRlclJvd0V2ZW50RGlzcGF0Y2hlcixcbiAgICBwcm90ZWN0ZWQgcmVhZG9ubHkgbmdab25lOiBOZ1pvbmUsXG4gICAgcHJvdGVjdGVkIHJlYWRvbmx5IG5vdGlmaWVyOiBDb2x1bW5SZXNpemVOb3RpZmllclNvdXJjZVxuICApIHtcbiAgICBzdXBlcigpO1xuICB9XG59XG4iXX0=