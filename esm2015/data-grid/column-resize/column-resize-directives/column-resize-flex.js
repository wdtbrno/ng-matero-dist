/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Directive, ElementRef, NgZone } from '@angular/core';
import { ColumnResize, ColumnResizeNotifier, ColumnResizeNotifierSource, HeaderRowEventDispatcher, } from '@ng-matero/extensions/column-resize';
import { AbstractMatColumnResize, FLEX_HOST_BINDINGS, FLEX_PROVIDERS } from './common';
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
MatColumnResizeFlex.decorators = [
    { type: Directive, args: [{
                selector: 'mat-table[columnResize]',
                host: FLEX_HOST_BINDINGS,
                providers: [...FLEX_PROVIDERS, { provide: ColumnResize, useExisting: MatColumnResizeFlex }],
            },] }
];
/** @nocollapse */
MatColumnResizeFlex.ctorParameters = () => [
    { type: ColumnResizeNotifier },
    { type: ElementRef },
    { type: HeaderRowEventDispatcher },
    { type: NgZone },
    { type: ColumnResizeNotifierSource }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29sdW1uLXJlc2l6ZS1mbGV4LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvZXh0ZW5zaW9ucy9kYXRhLWdyaWQvY29sdW1uLXJlc2l6ZS9jb2x1bW4tcmVzaXplLWRpcmVjdGl2ZXMvY29sdW1uLXJlc2l6ZS1mbGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUM5RCxPQUFPLEVBQ0wsWUFBWSxFQUNaLG9CQUFvQixFQUNwQiwwQkFBMEIsRUFDMUIsd0JBQXdCLEdBQ3pCLE1BQU0scUNBQXFDLENBQUM7QUFFN0MsT0FBTyxFQUFFLHVCQUF1QixFQUFFLGtCQUFrQixFQUFFLGNBQWMsRUFBRSxNQUFNLFVBQVUsQ0FBQztBQUV2Rjs7O0dBR0c7QUFNSCxNQUFNLE9BQU8sbUJBQW9CLFNBQVEsdUJBQXVCO0lBQzlELFlBQ1csb0JBQTBDLEVBQzFDLFVBQW1DLEVBQ3pCLGVBQXlDLEVBQ3pDLE1BQWMsRUFDZCxRQUFvQztRQUV2RCxLQUFLLEVBQUUsQ0FBQztRQU5DLHlCQUFvQixHQUFwQixvQkFBb0IsQ0FBc0I7UUFDMUMsZUFBVSxHQUFWLFVBQVUsQ0FBeUI7UUFDekIsb0JBQWUsR0FBZixlQUFlLENBQTBCO1FBQ3pDLFdBQU0sR0FBTixNQUFNLENBQVE7UUFDZCxhQUFRLEdBQVIsUUFBUSxDQUE0QjtJQUd6RCxDQUFDOzs7WUFkRixTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLHlCQUF5QjtnQkFDbkMsSUFBSSxFQUFFLGtCQUFrQjtnQkFDeEIsU0FBUyxFQUFFLENBQUMsR0FBRyxjQUFjLEVBQUUsRUFBRSxPQUFPLEVBQUUsWUFBWSxFQUFFLFdBQVcsRUFBRSxtQkFBbUIsRUFBRSxDQUFDO2FBQzVGOzs7O1lBZkMsb0JBQW9CO1lBSEYsVUFBVTtZQUs1Qix3QkFBd0I7WUFMTSxNQUFNO1lBSXBDLDBCQUEwQiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQgeyBEaXJlY3RpdmUsIEVsZW1lbnRSZWYsIE5nWm9uZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtcbiAgQ29sdW1uUmVzaXplLFxuICBDb2x1bW5SZXNpemVOb3RpZmllcixcbiAgQ29sdW1uUmVzaXplTm90aWZpZXJTb3VyY2UsXG4gIEhlYWRlclJvd0V2ZW50RGlzcGF0Y2hlcixcbn0gZnJvbSAnQG5nLW1hdGVyby9leHRlbnNpb25zL2NvbHVtbi1yZXNpemUnO1xuXG5pbXBvcnQgeyBBYnN0cmFjdE1hdENvbHVtblJlc2l6ZSwgRkxFWF9IT1NUX0JJTkRJTkdTLCBGTEVYX1BST1ZJREVSUyB9IGZyb20gJy4vY29tbW9uJztcblxuLyoqXG4gKiBFeHBsaWNpdGx5IGVuYWJsZXMgY29sdW1uIHJlc2l6aW5nIGZvciBhIGZsZXhib3gtYmFzZWQgbWF0LXRhYmxlLlxuICogSW5kaXZpZHVhbCBjb2x1bW5zIG11c3QgYmUgYW5ub3RhdGVkIHNwZWNpZmljYWxseS5cbiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnbWF0LXRhYmxlW2NvbHVtblJlc2l6ZV0nLFxuICBob3N0OiBGTEVYX0hPU1RfQklORElOR1MsXG4gIHByb3ZpZGVyczogWy4uLkZMRVhfUFJPVklERVJTLCB7IHByb3ZpZGU6IENvbHVtblJlc2l6ZSwgdXNlRXhpc3Rpbmc6IE1hdENvbHVtblJlc2l6ZUZsZXggfV0sXG59KVxuZXhwb3J0IGNsYXNzIE1hdENvbHVtblJlc2l6ZUZsZXggZXh0ZW5kcyBBYnN0cmFjdE1hdENvbHVtblJlc2l6ZSB7XG4gIGNvbnN0cnVjdG9yKFxuICAgIHJlYWRvbmx5IGNvbHVtblJlc2l6ZU5vdGlmaWVyOiBDb2x1bW5SZXNpemVOb3RpZmllcixcbiAgICByZWFkb25seSBlbGVtZW50UmVmOiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PixcbiAgICBwcm90ZWN0ZWQgcmVhZG9ubHkgZXZlbnREaXNwYXRjaGVyOiBIZWFkZXJSb3dFdmVudERpc3BhdGNoZXIsXG4gICAgcHJvdGVjdGVkIHJlYWRvbmx5IG5nWm9uZTogTmdab25lLFxuICAgIHByb3RlY3RlZCByZWFkb25seSBub3RpZmllcjogQ29sdW1uUmVzaXplTm90aWZpZXJTb3VyY2VcbiAgKSB7XG4gICAgc3VwZXIoKTtcbiAgfVxufVxuIl19