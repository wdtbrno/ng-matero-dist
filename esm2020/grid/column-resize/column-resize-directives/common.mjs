/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ColumnResize, ColumnResizeNotifier, ColumnResizeNotifierSource, HeaderRowEventDispatcher, } from '@ng-matero/extensions/column-resize';
import { TABLE_LAYOUT_FIXED_RESIZE_STRATEGY_PROVIDER, FLEX_RESIZE_STRATEGY_PROVIDER, } from '../resize-strategy';
const PROVIDERS = [
    ColumnResizeNotifier,
    HeaderRowEventDispatcher,
    ColumnResizeNotifierSource,
];
export const TABLE_PROVIDERS = [
    ...PROVIDERS,
    TABLE_LAYOUT_FIXED_RESIZE_STRATEGY_PROVIDER,
];
export const FLEX_PROVIDERS = [...PROVIDERS, FLEX_RESIZE_STRATEGY_PROVIDER];
export const TABLE_HOST_BINDINGS = {
    class: 'mat-column-resize-table',
};
export const FLEX_HOST_BINDINGS = {
    class: 'mat-column-resize-flex',
};
export class AbstractMatColumnResize extends ColumnResize {
    getTableHeight() {
        const table = this.elementRef.nativeElement;
        const tableParent = table.parentNode;
        const isTableContainer = tableParent.classList.contains('mat-table-container');
        return isTableContainer ? tableParent.offsetHeight : table.offsetHeight;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tbW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvZXh0ZW5zaW9ucy9ncmlkL2NvbHVtbi1yZXNpemUvY29sdW1uLXJlc2l6ZS1kaXJlY3RpdmVzL2NvbW1vbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFJSCxPQUFPLEVBQ0wsWUFBWSxFQUNaLG9CQUFvQixFQUNwQiwwQkFBMEIsRUFDMUIsd0JBQXdCLEdBQ3pCLE1BQU0scUNBQXFDLENBQUM7QUFFN0MsT0FBTyxFQUNMLDJDQUEyQyxFQUMzQyw2QkFBNkIsR0FDOUIsTUFBTSxvQkFBb0IsQ0FBQztBQUU1QixNQUFNLFNBQVMsR0FBZTtJQUM1QixvQkFBb0I7SUFDcEIsd0JBQXdCO0lBQ3hCLDBCQUEwQjtDQUMzQixDQUFDO0FBQ0YsTUFBTSxDQUFDLE1BQU0sZUFBZSxHQUFlO0lBQ3pDLEdBQUcsU0FBUztJQUNaLDJDQUEyQztDQUM1QyxDQUFDO0FBQ0YsTUFBTSxDQUFDLE1BQU0sY0FBYyxHQUFlLENBQUMsR0FBRyxTQUFTLEVBQUUsNkJBQTZCLENBQUMsQ0FBQztBQUV4RixNQUFNLENBQUMsTUFBTSxtQkFBbUIsR0FBRztJQUNqQyxLQUFLLEVBQUUseUJBQXlCO0NBQ2pDLENBQUM7QUFDRixNQUFNLENBQUMsTUFBTSxrQkFBa0IsR0FBRztJQUNoQyxLQUFLLEVBQUUsd0JBQXdCO0NBQ2hDLENBQUM7QUFFRixNQUFNLE9BQWdCLHVCQUF3QixTQUFRLFlBQVk7SUFDaEUsY0FBYztRQUNaLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsYUFBYSxDQUFDO1FBQzVDLE1BQU0sV0FBVyxHQUFHLEtBQU0sQ0FBQyxVQUF5QixDQUFDO1FBQ3JELE1BQU0sZ0JBQWdCLEdBQUcsV0FBWSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMscUJBQXFCLENBQUMsQ0FBQztRQUNoRixPQUFPLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxXQUFZLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxLQUFNLENBQUMsWUFBWSxDQUFDO0lBQzVFLENBQUM7Q0FDRiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQgeyBQcm92aWRlciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQge1xuICBDb2x1bW5SZXNpemUsXG4gIENvbHVtblJlc2l6ZU5vdGlmaWVyLFxuICBDb2x1bW5SZXNpemVOb3RpZmllclNvdXJjZSxcbiAgSGVhZGVyUm93RXZlbnREaXNwYXRjaGVyLFxufSBmcm9tICdAbmctbWF0ZXJvL2V4dGVuc2lvbnMvY29sdW1uLXJlc2l6ZSc7XG5cbmltcG9ydCB7XG4gIFRBQkxFX0xBWU9VVF9GSVhFRF9SRVNJWkVfU1RSQVRFR1lfUFJPVklERVIsXG4gIEZMRVhfUkVTSVpFX1NUUkFURUdZX1BST1ZJREVSLFxufSBmcm9tICcuLi9yZXNpemUtc3RyYXRlZ3knO1xuXG5jb25zdCBQUk9WSURFUlM6IFByb3ZpZGVyW10gPSBbXG4gIENvbHVtblJlc2l6ZU5vdGlmaWVyLFxuICBIZWFkZXJSb3dFdmVudERpc3BhdGNoZXIsXG4gIENvbHVtblJlc2l6ZU5vdGlmaWVyU291cmNlLFxuXTtcbmV4cG9ydCBjb25zdCBUQUJMRV9QUk9WSURFUlM6IFByb3ZpZGVyW10gPSBbXG4gIC4uLlBST1ZJREVSUyxcbiAgVEFCTEVfTEFZT1VUX0ZJWEVEX1JFU0laRV9TVFJBVEVHWV9QUk9WSURFUixcbl07XG5leHBvcnQgY29uc3QgRkxFWF9QUk9WSURFUlM6IFByb3ZpZGVyW10gPSBbLi4uUFJPVklERVJTLCBGTEVYX1JFU0laRV9TVFJBVEVHWV9QUk9WSURFUl07XG5cbmV4cG9ydCBjb25zdCBUQUJMRV9IT1NUX0JJTkRJTkdTID0ge1xuICBjbGFzczogJ21hdC1jb2x1bW4tcmVzaXplLXRhYmxlJyxcbn07XG5leHBvcnQgY29uc3QgRkxFWF9IT1NUX0JJTkRJTkdTID0ge1xuICBjbGFzczogJ21hdC1jb2x1bW4tcmVzaXplLWZsZXgnLFxufTtcblxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIEFic3RyYWN0TWF0Q29sdW1uUmVzaXplIGV4dGVuZHMgQ29sdW1uUmVzaXplIHtcbiAgZ2V0VGFibGVIZWlnaHQoKSB7XG4gICAgY29uc3QgdGFibGUgPSB0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudDtcbiAgICBjb25zdCB0YWJsZVBhcmVudCA9IHRhYmxlIS5wYXJlbnROb2RlIGFzIEhUTUxFbGVtZW50O1xuICAgIGNvbnN0IGlzVGFibGVDb250YWluZXIgPSB0YWJsZVBhcmVudCEuY2xhc3NMaXN0LmNvbnRhaW5zKCdtYXQtdGFibGUtY29udGFpbmVyJyk7XG4gICAgcmV0dXJuIGlzVGFibGVDb250YWluZXIgPyB0YWJsZVBhcmVudCEub2Zmc2V0SGVpZ2h0IDogdGFibGUhLm9mZnNldEhlaWdodDtcbiAgfVxufVxuIl19