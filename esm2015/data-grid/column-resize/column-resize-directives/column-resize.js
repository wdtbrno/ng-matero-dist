/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Directive, ElementRef, NgZone } from '@angular/core';
import { ColumnResize, ColumnResizeNotifier, ColumnResizeNotifierSource, HeaderRowEventDispatcher, } from '@ng-matero/extensions/column-resize';
import { AbstractMatColumnResize, TABLE_HOST_BINDINGS, TABLE_PROVIDERS } from './common';
/**
 * Explicitly enables column resizing for a table-based mat-table.
 * Individual columns must be annotated specifically.
 */
export class MatColumnResize extends AbstractMatColumnResize {
    constructor(columnResizeNotifier, elementRef, eventDispatcher, ngZone, notifier) {
        super();
        this.columnResizeNotifier = columnResizeNotifier;
        this.elementRef = elementRef;
        this.eventDispatcher = eventDispatcher;
        this.ngZone = ngZone;
        this.notifier = notifier;
    }
}
MatColumnResize.decorators = [
    { type: Directive, args: [{
                selector: 'table[mat-table][columnResize]',
                host: TABLE_HOST_BINDINGS,
                providers: [...TABLE_PROVIDERS, { provide: ColumnResize, useExisting: MatColumnResize }],
            },] }
];
/** @nocollapse */
MatColumnResize.ctorParameters = () => [
    { type: ColumnResizeNotifier },
    { type: ElementRef },
    { type: HeaderRowEventDispatcher },
    { type: NgZone },
    { type: ColumnResizeNotifierSource }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29sdW1uLXJlc2l6ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2V4dGVuc2lvbnMvZGF0YS1ncmlkL2NvbHVtbi1yZXNpemUvY29sdW1uLXJlc2l6ZS1kaXJlY3RpdmVzL2NvbHVtbi1yZXNpemUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFFLFNBQVMsRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzlELE9BQU8sRUFDTCxZQUFZLEVBQ1osb0JBQW9CLEVBQ3BCLDBCQUEwQixFQUMxQix3QkFBd0IsR0FDekIsTUFBTSxxQ0FBcUMsQ0FBQztBQUU3QyxPQUFPLEVBQUUsdUJBQXVCLEVBQUUsbUJBQW1CLEVBQUUsZUFBZSxFQUFFLE1BQU0sVUFBVSxDQUFDO0FBRXpGOzs7R0FHRztBQU1ILE1BQU0sT0FBTyxlQUFnQixTQUFRLHVCQUF1QjtJQUMxRCxZQUNXLG9CQUEwQyxFQUMxQyxVQUFtQyxFQUN6QixlQUF5QyxFQUN6QyxNQUFjLEVBQ2QsUUFBb0M7UUFFdkQsS0FBSyxFQUFFLENBQUM7UUFOQyx5QkFBb0IsR0FBcEIsb0JBQW9CLENBQXNCO1FBQzFDLGVBQVUsR0FBVixVQUFVLENBQXlCO1FBQ3pCLG9CQUFlLEdBQWYsZUFBZSxDQUEwQjtRQUN6QyxXQUFNLEdBQU4sTUFBTSxDQUFRO1FBQ2QsYUFBUSxHQUFSLFFBQVEsQ0FBNEI7SUFHekQsQ0FBQzs7O1lBZEYsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSxnQ0FBZ0M7Z0JBQzFDLElBQUksRUFBRSxtQkFBbUI7Z0JBQ3pCLFNBQVMsRUFBRSxDQUFDLEdBQUcsZUFBZSxFQUFFLEVBQUUsT0FBTyxFQUFFLFlBQVksRUFBRSxXQUFXLEVBQUUsZUFBZSxFQUFFLENBQUM7YUFDekY7Ozs7WUFmQyxvQkFBb0I7WUFIRixVQUFVO1lBSzVCLHdCQUF3QjtZQUxNLE1BQU07WUFJcEMsMEJBQTBCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7IERpcmVjdGl2ZSwgRWxlbWVudFJlZiwgTmdab25lIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1xuICBDb2x1bW5SZXNpemUsXG4gIENvbHVtblJlc2l6ZU5vdGlmaWVyLFxuICBDb2x1bW5SZXNpemVOb3RpZmllclNvdXJjZSxcbiAgSGVhZGVyUm93RXZlbnREaXNwYXRjaGVyLFxufSBmcm9tICdAbmctbWF0ZXJvL2V4dGVuc2lvbnMvY29sdW1uLXJlc2l6ZSc7XG5cbmltcG9ydCB7IEFic3RyYWN0TWF0Q29sdW1uUmVzaXplLCBUQUJMRV9IT1NUX0JJTkRJTkdTLCBUQUJMRV9QUk9WSURFUlMgfSBmcm9tICcuL2NvbW1vbic7XG5cbi8qKlxuICogRXhwbGljaXRseSBlbmFibGVzIGNvbHVtbiByZXNpemluZyBmb3IgYSB0YWJsZS1iYXNlZCBtYXQtdGFibGUuXG4gKiBJbmRpdmlkdWFsIGNvbHVtbnMgbXVzdCBiZSBhbm5vdGF0ZWQgc3BlY2lmaWNhbGx5LlxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICd0YWJsZVttYXQtdGFibGVdW2NvbHVtblJlc2l6ZV0nLFxuICBob3N0OiBUQUJMRV9IT1NUX0JJTkRJTkdTLFxuICBwcm92aWRlcnM6IFsuLi5UQUJMRV9QUk9WSURFUlMsIHsgcHJvdmlkZTogQ29sdW1uUmVzaXplLCB1c2VFeGlzdGluZzogTWF0Q29sdW1uUmVzaXplIH1dLFxufSlcbmV4cG9ydCBjbGFzcyBNYXRDb2x1bW5SZXNpemUgZXh0ZW5kcyBBYnN0cmFjdE1hdENvbHVtblJlc2l6ZSB7XG4gIGNvbnN0cnVjdG9yKFxuICAgIHJlYWRvbmx5IGNvbHVtblJlc2l6ZU5vdGlmaWVyOiBDb2x1bW5SZXNpemVOb3RpZmllcixcbiAgICByZWFkb25seSBlbGVtZW50UmVmOiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PixcbiAgICBwcm90ZWN0ZWQgcmVhZG9ubHkgZXZlbnREaXNwYXRjaGVyOiBIZWFkZXJSb3dFdmVudERpc3BhdGNoZXIsXG4gICAgcHJvdGVjdGVkIHJlYWRvbmx5IG5nWm9uZTogTmdab25lLFxuICAgIHByb3RlY3RlZCByZWFkb25seSBub3RpZmllcjogQ29sdW1uUmVzaXplTm90aWZpZXJTb3VyY2VcbiAgKSB7XG4gICAgc3VwZXIoKTtcbiAgfVxufVxuIl19