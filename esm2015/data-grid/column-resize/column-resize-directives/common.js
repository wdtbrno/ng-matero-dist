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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tbW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvZXh0ZW5zaW9ucy9kYXRhLWdyaWQvY29sdW1uLXJlc2l6ZS9jb2x1bW4tcmVzaXplLWRpcmVjdGl2ZXMvY29tbW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUlILE9BQU8sRUFDTCxZQUFZLEVBQ1osb0JBQW9CLEVBQ3BCLDBCQUEwQixFQUMxQix3QkFBd0IsR0FDekIsTUFBTSxxQ0FBcUMsQ0FBQztBQUU3QyxPQUFPLEVBQ0wsMkNBQTJDLEVBQzNDLDZCQUE2QixHQUM5QixNQUFNLG9CQUFvQixDQUFDO0FBRTVCLE1BQU0sU0FBUyxHQUFlO0lBQzVCLG9CQUFvQjtJQUNwQix3QkFBd0I7SUFDeEIsMEJBQTBCO0NBQzNCLENBQUM7QUFDRixNQUFNLENBQUMsTUFBTSxlQUFlLEdBQWU7SUFDekMsR0FBRyxTQUFTO0lBQ1osMkNBQTJDO0NBQzVDLENBQUM7QUFDRixNQUFNLENBQUMsTUFBTSxjQUFjLEdBQWUsQ0FBQyxHQUFHLFNBQVMsRUFBRSw2QkFBNkIsQ0FBQyxDQUFDO0FBRXhGLE1BQU0sQ0FBQyxNQUFNLG1CQUFtQixHQUFHO0lBQ2pDLEtBQUssRUFBRSx5QkFBeUI7Q0FDakMsQ0FBQztBQUNGLE1BQU0sQ0FBQyxNQUFNLGtCQUFrQixHQUFHO0lBQ2hDLEtBQUssRUFBRSx3QkFBd0I7Q0FDaEMsQ0FBQztBQUVGLE1BQU0sT0FBZ0IsdUJBQXdCLFNBQVEsWUFBWTtJQUNoRSxjQUFjO1FBQ1osTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxhQUFhLENBQUM7UUFDNUMsTUFBTSxXQUFXLEdBQUcsS0FBTSxDQUFDLFVBQXlCLENBQUM7UUFDckQsTUFBTSxnQkFBZ0IsR0FBRyxXQUFZLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO1FBQ2hGLE9BQU8sZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLFdBQVksQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLEtBQU0sQ0FBQyxZQUFZLENBQUM7SUFDNUUsQ0FBQztDQUNGIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7IFByb3ZpZGVyIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7XG4gIENvbHVtblJlc2l6ZSxcbiAgQ29sdW1uUmVzaXplTm90aWZpZXIsXG4gIENvbHVtblJlc2l6ZU5vdGlmaWVyU291cmNlLFxuICBIZWFkZXJSb3dFdmVudERpc3BhdGNoZXIsXG59IGZyb20gJ0BuZy1tYXRlcm8vZXh0ZW5zaW9ucy9jb2x1bW4tcmVzaXplJztcblxuaW1wb3J0IHtcbiAgVEFCTEVfTEFZT1VUX0ZJWEVEX1JFU0laRV9TVFJBVEVHWV9QUk9WSURFUixcbiAgRkxFWF9SRVNJWkVfU1RSQVRFR1lfUFJPVklERVIsXG59IGZyb20gJy4uL3Jlc2l6ZS1zdHJhdGVneSc7XG5cbmNvbnN0IFBST1ZJREVSUzogUHJvdmlkZXJbXSA9IFtcbiAgQ29sdW1uUmVzaXplTm90aWZpZXIsXG4gIEhlYWRlclJvd0V2ZW50RGlzcGF0Y2hlcixcbiAgQ29sdW1uUmVzaXplTm90aWZpZXJTb3VyY2UsXG5dO1xuZXhwb3J0IGNvbnN0IFRBQkxFX1BST1ZJREVSUzogUHJvdmlkZXJbXSA9IFtcbiAgLi4uUFJPVklERVJTLFxuICBUQUJMRV9MQVlPVVRfRklYRURfUkVTSVpFX1NUUkFURUdZX1BST1ZJREVSLFxuXTtcbmV4cG9ydCBjb25zdCBGTEVYX1BST1ZJREVSUzogUHJvdmlkZXJbXSA9IFsuLi5QUk9WSURFUlMsIEZMRVhfUkVTSVpFX1NUUkFURUdZX1BST1ZJREVSXTtcblxuZXhwb3J0IGNvbnN0IFRBQkxFX0hPU1RfQklORElOR1MgPSB7XG4gIGNsYXNzOiAnbWF0LWNvbHVtbi1yZXNpemUtdGFibGUnLFxufTtcbmV4cG9ydCBjb25zdCBGTEVYX0hPU1RfQklORElOR1MgPSB7XG4gIGNsYXNzOiAnbWF0LWNvbHVtbi1yZXNpemUtZmxleCcsXG59O1xuXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgQWJzdHJhY3RNYXRDb2x1bW5SZXNpemUgZXh0ZW5kcyBDb2x1bW5SZXNpemUge1xuICBnZXRUYWJsZUhlaWdodCgpIHtcbiAgICBjb25zdCB0YWJsZSA9IHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50O1xuICAgIGNvbnN0IHRhYmxlUGFyZW50ID0gdGFibGUhLnBhcmVudE5vZGUgYXMgSFRNTEVsZW1lbnQ7XG4gICAgY29uc3QgaXNUYWJsZUNvbnRhaW5lciA9IHRhYmxlUGFyZW50IS5jbGFzc0xpc3QuY29udGFpbnMoJ21hdC10YWJsZS1jb250YWluZXInKTtcbiAgICByZXR1cm4gaXNUYWJsZUNvbnRhaW5lciA/IHRhYmxlUGFyZW50IS5vZmZzZXRIZWlnaHQgOiB0YWJsZSEub2Zmc2V0SGVpZ2h0O1xuICB9XG59XG4iXX0=