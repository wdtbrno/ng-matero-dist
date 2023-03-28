/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import * as i0 from "@angular/core";
/**
 * Originating source of column resize events within a table.
 * @docs-private
 */
export class ColumnResizeNotifierSource {
    constructor() {
        /** Emits when an in-progress resize is canceled. */
        this.resizeCanceled = new Subject();
        /** Emits when a resize is applied. */
        this.resizeCompleted = new Subject();
        /** Triggers a resize action. */
        this.triggerResize = new Subject();
    }
}
/** @nocollapse */ ColumnResizeNotifierSource.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: ColumnResizeNotifierSource, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
/** @nocollapse */ ColumnResizeNotifierSource.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: ColumnResizeNotifierSource });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: ColumnResizeNotifierSource, decorators: [{
            type: Injectable
        }] });
/** Service for triggering column resizes imperatively or being notified of them. */
export class ColumnResizeNotifier {
    constructor(_source) {
        this._source = _source;
        /** Emits whenever a column is resized. */
        this.resizeCompleted = this._source.resizeCompleted;
    }
    /** Instantly resizes the specified column. */
    resize(columnId, size) {
        this._source.triggerResize.next({ columnId, size, completeImmediately: true, isStickyColumn: true });
    }
}
/** @nocollapse */ ColumnResizeNotifier.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: ColumnResizeNotifier, deps: [{ token: ColumnResizeNotifierSource }], target: i0.ɵɵFactoryTarget.Injectable });
/** @nocollapse */ ColumnResizeNotifier.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: ColumnResizeNotifier });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: ColumnResizeNotifier, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: ColumnResizeNotifierSource }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29sdW1uLXJlc2l6ZS1ub3RpZmllci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL2V4dGVuc2lvbnMvY29sdW1uLXJlc2l6ZS9jb2x1bW4tcmVzaXplLW5vdGlmaWVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDekMsT0FBTyxFQUFhLE9BQU8sRUFBQyxNQUFNLE1BQU0sQ0FBQzs7QUE2QnpDOzs7R0FHRztBQUVILE1BQU0sT0FBTywwQkFBMEI7SUFEdkM7UUFFRSxvREFBb0Q7UUFDM0MsbUJBQWMsR0FBRyxJQUFJLE9BQU8sRUFBb0IsQ0FBQztRQUUxRCxzQ0FBc0M7UUFDN0Isb0JBQWUsR0FBRyxJQUFJLE9BQU8sRUFBYyxDQUFDO1FBRXJELGdDQUFnQztRQUN2QixrQkFBYSxHQUFHLElBQUksT0FBTyxFQUFvQixDQUFDO0tBQzFEOzswSUFUWSwwQkFBMEI7OElBQTFCLDBCQUEwQjsyRkFBMUIsMEJBQTBCO2tCQUR0QyxVQUFVOztBQVlYLG9GQUFvRjtBQUVwRixNQUFNLE9BQU8sb0JBQW9CO0lBSS9CLFlBQTZCLE9BQW1DO1FBQW5DLFlBQU8sR0FBUCxPQUFPLENBQTRCO1FBSGhFLDBDQUEwQztRQUNqQyxvQkFBZSxHQUEyQixJQUFJLENBQUMsT0FBTyxDQUFDLGVBQWUsQ0FBQztJQUViLENBQUM7SUFFcEUsOENBQThDO0lBQzlDLE1BQU0sQ0FBQyxRQUFnQixFQUFFLElBQVk7UUFDbkMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUMzQixFQUFDLFFBQVEsRUFBRSxJQUFJLEVBQUUsbUJBQW1CLEVBQUUsSUFBSSxFQUFFLGNBQWMsRUFBRSxJQUFJLEVBQUMsQ0FBQyxDQUFDO0lBQ3pFLENBQUM7O29JQVZVLG9CQUFvQjt3SUFBcEIsb0JBQW9COzJGQUFwQixvQkFBb0I7a0JBRGhDLFVBQVUiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtJbmplY3RhYmxlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7T2JzZXJ2YWJsZSwgU3ViamVjdH0gZnJvbSAncnhqcyc7XG5cbi8qKiBJbmRpY2F0ZXMgdGhlIHdpZHRoIG9mIGEgY29sdW1uLiAqL1xuZXhwb3J0IGludGVyZmFjZSBDb2x1bW5TaXplIHtcbiAgLyoqIFRoZSBJRC9uYW1lIG9mIHRoZSBjb2x1bW4sIGFzIGRlZmluZWQgaW4gQ2RrQ29sdW1uRGVmLiAqL1xuICByZWFkb25seSBjb2x1bW5JZDogc3RyaW5nO1xuXG4gIC8qKiBUaGUgd2lkdGggaW4gcGl4ZWxzIG9mIHRoZSBjb2x1bW4uICovXG4gIHJlYWRvbmx5IHNpemU6IG51bWJlcjtcblxuICAvKiogVGhlIHdpZHRoIGluIHBpeGVscyBvZiB0aGUgY29sdW1uIHByaW9yIHRvIHRoaXMgdXBkYXRlLCBpZiBrbm93bi4gKi9cbiAgcmVhZG9ubHkgcHJldmlvdXNTaXplPzogbnVtYmVyO1xufVxuXG4vKiogSW50ZXJmYWNlIGRlc2NyaWJpbmcgY29sdW1uIHNpemUgY2hhbmdlcy4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQ29sdW1uU2l6ZUFjdGlvbiBleHRlbmRzIENvbHVtblNpemUge1xuICAvKipcbiAgICogV2hldGhlciB0aGUgcmVzaXplIGFjdGlvbiBzaG91bGQgYmUgYXBwbGllZCBpbnN0YW50YW5lb3VzbHkuIEZhbHNlIGZvciBldmVudHMgdHJpZ2dlcmVkIGR1cmluZ1xuICAgKiBhIFVJLXRyaWdnZXJlZCByZXNpemUgKHN1Y2ggYXMgd2l0aCB0aGUgbW91c2UpIHVudGlsIHRoZSBtb3VzZSBidXR0b24gaXMgcmVsZWFzZWQuIFRydWVcbiAgICogZm9yIGFsbCBwcm9ncmFtYXRpY2FsbHkgdHJpZ2dlcmVkIHJlc2l6ZXMuXG4gICAqL1xuICByZWFkb25seSBjb21wbGV0ZUltbWVkaWF0ZWx5PzogYm9vbGVhbjtcblxuICAvKipcbiAgICogV2hldGhlciB0aGUgcmVzaXplIGFjdGlvbiBpcyBiZWluZyBhcHBsaWVkIHRvIGEgc3RpY2t5L3N0aWNreUVuZCBjb2x1bW4uXG4gICAqL1xuICByZWFkb25seSBpc1N0aWNreUNvbHVtbj86IGJvb2xlYW47XG59XG5cbi8qKlxuICogT3JpZ2luYXRpbmcgc291cmNlIG9mIGNvbHVtbiByZXNpemUgZXZlbnRzIHdpdGhpbiBhIHRhYmxlLlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgQ29sdW1uUmVzaXplTm90aWZpZXJTb3VyY2Uge1xuICAvKiogRW1pdHMgd2hlbiBhbiBpbi1wcm9ncmVzcyByZXNpemUgaXMgY2FuY2VsZWQuICovXG4gIHJlYWRvbmx5IHJlc2l6ZUNhbmNlbGVkID0gbmV3IFN1YmplY3Q8Q29sdW1uU2l6ZUFjdGlvbj4oKTtcblxuICAvKiogRW1pdHMgd2hlbiBhIHJlc2l6ZSBpcyBhcHBsaWVkLiAqL1xuICByZWFkb25seSByZXNpemVDb21wbGV0ZWQgPSBuZXcgU3ViamVjdDxDb2x1bW5TaXplPigpO1xuXG4gIC8qKiBUcmlnZ2VycyBhIHJlc2l6ZSBhY3Rpb24uICovXG4gIHJlYWRvbmx5IHRyaWdnZXJSZXNpemUgPSBuZXcgU3ViamVjdDxDb2x1bW5TaXplQWN0aW9uPigpO1xufVxuXG4vKiogU2VydmljZSBmb3IgdHJpZ2dlcmluZyBjb2x1bW4gcmVzaXplcyBpbXBlcmF0aXZlbHkgb3IgYmVpbmcgbm90aWZpZWQgb2YgdGhlbS4gKi9cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBDb2x1bW5SZXNpemVOb3RpZmllciB7XG4gIC8qKiBFbWl0cyB3aGVuZXZlciBhIGNvbHVtbiBpcyByZXNpemVkLiAqL1xuICByZWFkb25seSByZXNpemVDb21wbGV0ZWQ6IE9ic2VydmFibGU8Q29sdW1uU2l6ZT4gPSB0aGlzLl9zb3VyY2UucmVzaXplQ29tcGxldGVkO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVhZG9ubHkgX3NvdXJjZTogQ29sdW1uUmVzaXplTm90aWZpZXJTb3VyY2UpIHt9XG5cbiAgLyoqIEluc3RhbnRseSByZXNpemVzIHRoZSBzcGVjaWZpZWQgY29sdW1uLiAqL1xuICByZXNpemUoY29sdW1uSWQ6IHN0cmluZywgc2l6ZTogbnVtYmVyKTogdm9pZCB7XG4gICAgdGhpcy5fc291cmNlLnRyaWdnZXJSZXNpemUubmV4dChcbiAgICAgICAge2NvbHVtbklkLCBzaXplLCBjb21wbGV0ZUltbWVkaWF0ZWx5OiB0cnVlLCBpc1N0aWNreUNvbHVtbjogdHJ1ZX0pO1xuICB9XG59XG4iXX0=