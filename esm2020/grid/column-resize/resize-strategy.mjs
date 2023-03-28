/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { _COALESCED_STYLE_SCHEDULER } from '@angular/cdk/table';
import { ResizeStrategy, CdkFlexTableResizeStrategy, TABLE_LAYOUT_FIXED_RESIZE_STRATEGY_PROVIDER, } from '@ng-matero/extensions/column-resize';
import * as i0 from "@angular/core";
import * as i1 from "@ng-matero/extensions/column-resize";
import * as i2 from "@angular/cdk/table";
export { TABLE_LAYOUT_FIXED_RESIZE_STRATEGY_PROVIDER };
/**
 * Overrides CdkFlexTableResizeStrategy to match mat-column elements.
 */
export class MatFlexTableResizeStrategy extends CdkFlexTableResizeStrategy {
    constructor(columnResize, styleScheduler, table, document) {
        super(columnResize, styleScheduler, table, document);
    }
    getColumnCssClass(cssFriendlyColumnName) {
        return `mat-column-${cssFriendlyColumnName}`;
    }
}
/** @nocollapse */ MatFlexTableResizeStrategy.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MatFlexTableResizeStrategy, deps: [{ token: i1.ColumnResize }, { token: _COALESCED_STYLE_SCHEDULER }, { token: i2.CdkTable }, { token: DOCUMENT }], target: i0.ɵɵFactoryTarget.Injectable });
/** @nocollapse */ MatFlexTableResizeStrategy.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MatFlexTableResizeStrategy });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MatFlexTableResizeStrategy, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i1.ColumnResize }, { type: i2._CoalescedStyleScheduler, decorators: [{
                    type: Inject,
                    args: [_COALESCED_STYLE_SCHEDULER]
                }] }, { type: i2.CdkTable }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }]; } });
export const FLEX_RESIZE_STRATEGY_PROVIDER = {
    provide: ResizeStrategy,
    useClass: MatFlexTableResizeStrategy,
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVzaXplLXN0cmF0ZWd5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvZXh0ZW5zaW9ucy9ncmlkL2NvbHVtbi1yZXNpemUvcmVzaXplLXN0cmF0ZWd5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFBRSxNQUFNLEVBQUUsVUFBVSxFQUFZLE1BQU0sZUFBZSxDQUFDO0FBQzdELE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUMzQyxPQUFPLEVBQXNDLDBCQUEwQixFQUFFLE1BQU0sb0JBQW9CLENBQUM7QUFFcEcsT0FBTyxFQUVMLGNBQWMsRUFDZCwwQkFBMEIsRUFDMUIsMkNBQTJDLEdBQzVDLE1BQU0scUNBQXFDLENBQUM7Ozs7QUFFN0MsT0FBTyxFQUFFLDJDQUEyQyxFQUFFLENBQUM7QUFFdkQ7O0dBRUc7QUFFSCxNQUFNLE9BQU8sMEJBQTJCLFNBQVEsMEJBQTBCO0lBQ3hFLFlBQ0UsWUFBMEIsRUFDVSxjQUF3QyxFQUM1RSxLQUF3QixFQUNOLFFBQWE7UUFFL0IsS0FBSyxDQUFDLFlBQVksRUFBRSxjQUFjLEVBQUUsS0FBSyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQ3ZELENBQUM7SUFFUyxpQkFBaUIsQ0FBQyxxQkFBNkI7UUFDdkQsT0FBTyxjQUFjLHFCQUFxQixFQUFFLENBQUM7SUFDL0MsQ0FBQzs7MElBWlUsMEJBQTBCLDhDQUczQiwwQkFBMEIscUNBRTFCLFFBQVE7OElBTFAsMEJBQTBCOzJGQUExQiwwQkFBMEI7a0JBRHRDLFVBQVU7OzBCQUlOLE1BQU07MkJBQUMsMEJBQTBCOzswQkFFakMsTUFBTTsyQkFBQyxRQUFROztBQVVwQixNQUFNLENBQUMsTUFBTSw2QkFBNkIsR0FBYTtJQUNyRCxPQUFPLEVBQUUsY0FBYztJQUN2QixRQUFRLEVBQUUsMEJBQTBCO0NBQ3JDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHsgSW5qZWN0LCBJbmplY3RhYmxlLCBQcm92aWRlciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgRE9DVU1FTlQgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHsgQ2RrVGFibGUsIF9Db2FsZXNjZWRTdHlsZVNjaGVkdWxlciwgX0NPQUxFU0NFRF9TVFlMRV9TQ0hFRFVMRVIgfSBmcm9tICdAYW5ndWxhci9jZGsvdGFibGUnO1xuXG5pbXBvcnQge1xuICBDb2x1bW5SZXNpemUsXG4gIFJlc2l6ZVN0cmF0ZWd5LFxuICBDZGtGbGV4VGFibGVSZXNpemVTdHJhdGVneSxcbiAgVEFCTEVfTEFZT1VUX0ZJWEVEX1JFU0laRV9TVFJBVEVHWV9QUk9WSURFUixcbn0gZnJvbSAnQG5nLW1hdGVyby9leHRlbnNpb25zL2NvbHVtbi1yZXNpemUnO1xuXG5leHBvcnQgeyBUQUJMRV9MQVlPVVRfRklYRURfUkVTSVpFX1NUUkFURUdZX1BST1ZJREVSIH07XG5cbi8qKlxuICogT3ZlcnJpZGVzIENka0ZsZXhUYWJsZVJlc2l6ZVN0cmF0ZWd5IHRvIG1hdGNoIG1hdC1jb2x1bW4gZWxlbWVudHMuXG4gKi9cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBNYXRGbGV4VGFibGVSZXNpemVTdHJhdGVneSBleHRlbmRzIENka0ZsZXhUYWJsZVJlc2l6ZVN0cmF0ZWd5IHtcbiAgY29uc3RydWN0b3IoXG4gICAgY29sdW1uUmVzaXplOiBDb2x1bW5SZXNpemUsXG4gICAgQEluamVjdChfQ09BTEVTQ0VEX1NUWUxFX1NDSEVEVUxFUikgc3R5bGVTY2hlZHVsZXI6IF9Db2FsZXNjZWRTdHlsZVNjaGVkdWxlcixcbiAgICB0YWJsZTogQ2RrVGFibGU8dW5rbm93bj4sXG4gICAgQEluamVjdChET0NVTUVOVCkgZG9jdW1lbnQ6IGFueVxuICApIHtcbiAgICBzdXBlcihjb2x1bW5SZXNpemUsIHN0eWxlU2NoZWR1bGVyLCB0YWJsZSwgZG9jdW1lbnQpO1xuICB9XG5cbiAgcHJvdGVjdGVkIGdldENvbHVtbkNzc0NsYXNzKGNzc0ZyaWVuZGx5Q29sdW1uTmFtZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgICByZXR1cm4gYG1hdC1jb2x1bW4tJHtjc3NGcmllbmRseUNvbHVtbk5hbWV9YDtcbiAgfVxufVxuXG5leHBvcnQgY29uc3QgRkxFWF9SRVNJWkVfU1RSQVRFR1lfUFJPVklERVI6IFByb3ZpZGVyID0ge1xuICBwcm92aWRlOiBSZXNpemVTdHJhdGVneSxcbiAgdXNlQ2xhc3M6IE1hdEZsZXhUYWJsZVJlc2l6ZVN0cmF0ZWd5LFxufTtcbiJdfQ==