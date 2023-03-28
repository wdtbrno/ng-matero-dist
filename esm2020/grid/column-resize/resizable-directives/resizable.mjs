import { Directive, Inject, Input, HostBinding, } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { _COALESCED_STYLE_SCHEDULER, } from '@angular/cdk/table';
import { AbstractMatResizable, RESIZABLE_HOST_BINDINGS, RESIZABLE_INPUTS } from './common';
import * as i0 from "@angular/core";
import * as i1 from "@angular/cdk/table";
import * as i2 from "@ng-matero/extensions/column-resize";
import * as i3 from "@angular/cdk/bidi";
import * as i4 from "@angular/cdk/overlay";
/**
 * Explicitly enables column resizing for a mat-header-cell.
 */
export class MatResizable extends AbstractMatResizable {
    get hasResizableClass() {
        return this.isResizable ? RESIZABLE_HOST_BINDINGS.class : '';
    }
    get resizable() {
        return this.isResizable;
    }
    set resizable(newValue) {
        this.isResizable = newValue == null || newValue === '' || newValue;
    }
    constructor(columnDef, columnResize, directionality, document, elementRef, eventDispatcher, injector, ngZone, overlay, resizeNotifier, resizeStrategy, styleScheduler, viewContainerRef, changeDetectorRef) {
        super();
        this.columnDef = columnDef;
        this.columnResize = columnResize;
        this.directionality = directionality;
        this.elementRef = elementRef;
        this.eventDispatcher = eventDispatcher;
        this.injector = injector;
        this.ngZone = ngZone;
        this.overlay = overlay;
        this.resizeNotifier = resizeNotifier;
        this.resizeStrategy = resizeStrategy;
        this.styleScheduler = styleScheduler;
        this.viewContainerRef = viewContainerRef;
        this.changeDetectorRef = changeDetectorRef;
        this.isResizable = true;
        this.document = document;
    }
}
/** @nocollapse */ MatResizable.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MatResizable, deps: [{ token: i1.CdkColumnDef }, { token: i2.ColumnResize }, { token: i3.Directionality }, { token: DOCUMENT }, { token: i0.ElementRef }, { token: i2.HeaderRowEventDispatcher }, { token: i0.Injector }, { token: i0.NgZone }, { token: i4.Overlay }, { token: i2.ColumnResizeNotifierSource }, { token: i2.ResizeStrategy }, { token: _COALESCED_STYLE_SCHEDULER }, { token: i0.ViewContainerRef }, { token: i0.ChangeDetectorRef }], target: i0.ɵɵFactoryTarget.Directive });
/** @nocollapse */ MatResizable.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.2.1", type: MatResizable, selector: "mat-header-cell[resizable], th[mat-header-cell][resizable]", inputs: { minWidthPx: ["matResizableMinWidthPx", "minWidthPx"], maxWidthPx: ["matResizableMaxWidthPx", "maxWidthPx"], resizable: "resizable" }, host: { properties: { "class": "this.hasResizableClass" } }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MatResizable, decorators: [{
            type: Directive,
            args: [{
                    selector: 'mat-header-cell[resizable], th[mat-header-cell][resizable]',
                    inputs: RESIZABLE_INPUTS,
                }]
        }], ctorParameters: function () { return [{ type: i1.CdkColumnDef }, { type: i2.ColumnResize }, { type: i3.Directionality }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }, { type: i0.ElementRef }, { type: i2.HeaderRowEventDispatcher }, { type: i0.Injector }, { type: i0.NgZone }, { type: i4.Overlay }, { type: i2.ColumnResizeNotifierSource }, { type: i2.ResizeStrategy }, { type: i1._CoalescedStyleScheduler, decorators: [{
                    type: Inject,
                    args: [_COALESCED_STYLE_SCHEDULER]
                }] }, { type: i0.ViewContainerRef }, { type: i0.ChangeDetectorRef }]; }, propDecorators: { hasResizableClass: [{
                type: HostBinding,
                args: ['class']
            }], resizable: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVzaXphYmxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvZXh0ZW5zaW9ucy9ncmlkL2NvbHVtbi1yZXNpemUvcmVzaXphYmxlLWRpcmVjdGl2ZXMvcmVzaXphYmxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFDTCxTQUFTLEVBRVQsTUFBTSxFQUtOLEtBQUssRUFDTCxXQUFXLEdBQ1osTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBRzNDLE9BQU8sRUFHTCwwQkFBMEIsR0FDM0IsTUFBTSxvQkFBb0IsQ0FBQztBQVE1QixPQUFPLEVBQUUsb0JBQW9CLEVBQUUsdUJBQXVCLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxVQUFVLENBQUM7Ozs7OztBQUUzRjs7R0FFRztBQUtILE1BQU0sT0FBTyxZQUFhLFNBQVEsb0JBQW9CO0lBR3BELElBQTBCLGlCQUFpQjtRQUN6QyxPQUFPLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLHVCQUF1QixDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO0lBQy9ELENBQUM7SUFFRCxJQUNJLFNBQVM7UUFDWCxPQUFPLElBQUksQ0FBQyxXQUFXLENBQUM7SUFDMUIsQ0FBQztJQUNELElBQUksU0FBUyxDQUFDLFFBQWE7UUFDekIsSUFBSSxDQUFDLFdBQVcsR0FBRyxRQUFRLElBQUksSUFBSSxJQUFJLFFBQVEsS0FBSyxFQUFFLElBQUksUUFBUSxDQUFDO0lBQ3JFLENBQUM7SUFJRCxZQUNxQixTQUF1QixFQUN2QixZQUEwQixFQUMxQixjQUE4QixFQUMvQixRQUFhLEVBQ1osVUFBc0IsRUFDdEIsZUFBeUMsRUFDekMsUUFBa0IsRUFDbEIsTUFBYyxFQUNkLE9BQWdCLEVBQ2hCLGNBQTBDLEVBQzFDLGNBQThCLEVBRTlCLGNBQXdDLEVBQ3hDLGdCQUFrQyxFQUNsQyxpQkFBb0M7UUFFdkQsS0FBSyxFQUFFLENBQUM7UUFoQlcsY0FBUyxHQUFULFNBQVMsQ0FBYztRQUN2QixpQkFBWSxHQUFaLFlBQVksQ0FBYztRQUMxQixtQkFBYyxHQUFkLGNBQWMsQ0FBZ0I7UUFFOUIsZUFBVSxHQUFWLFVBQVUsQ0FBWTtRQUN0QixvQkFBZSxHQUFmLGVBQWUsQ0FBMEI7UUFDekMsYUFBUSxHQUFSLFFBQVEsQ0FBVTtRQUNsQixXQUFNLEdBQU4sTUFBTSxDQUFRO1FBQ2QsWUFBTyxHQUFQLE9BQU8sQ0FBUztRQUNoQixtQkFBYyxHQUFkLGNBQWMsQ0FBNEI7UUFDMUMsbUJBQWMsR0FBZCxjQUFjLENBQWdCO1FBRTlCLG1CQUFjLEdBQWQsY0FBYyxDQUEwQjtRQUN4QyxxQkFBZ0IsR0FBaEIsZ0JBQWdCLENBQWtCO1FBQ2xDLHNCQUFpQixHQUFqQixpQkFBaUIsQ0FBbUI7UUEvQnpELGdCQUFXLEdBQUcsSUFBSSxDQUFDO1FBa0NqQixJQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQztJQUMzQixDQUFDOzs0SEFwQ1UsWUFBWSx3R0FxQmIsUUFBUSw0TkFRUiwwQkFBMEI7Z0hBN0J6QixZQUFZOzJGQUFaLFlBQVk7a0JBSnhCLFNBQVM7bUJBQUM7b0JBQ1QsUUFBUSxFQUFFLDREQUE0RDtvQkFDdEUsTUFBTSxFQUFFLGdCQUFnQjtpQkFDekI7OzBCQXNCSSxNQUFNOzJCQUFDLFFBQVE7OzBCQVFmLE1BQU07MkJBQUMsMEJBQTBCOzJHQTFCVixpQkFBaUI7c0JBQTFDLFdBQVc7dUJBQUMsT0FBTztnQkFLaEIsU0FBUztzQkFEWixLQUFLIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgRGlyZWN0aXZlLFxuICBFbGVtZW50UmVmLFxuICBJbmplY3QsXG4gIEluamVjdG9yLFxuICBOZ1pvbmUsXG4gIFZpZXdDb250YWluZXJSZWYsXG4gIENoYW5nZURldGVjdG9yUmVmLFxuICBJbnB1dCxcbiAgSG9zdEJpbmRpbmcsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgRE9DVU1FTlQgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHsgRGlyZWN0aW9uYWxpdHkgfSBmcm9tICdAYW5ndWxhci9jZGsvYmlkaSc7XG5pbXBvcnQgeyBPdmVybGF5IH0gZnJvbSAnQGFuZ3VsYXIvY2RrL292ZXJsYXknO1xuaW1wb3J0IHtcbiAgQ2RrQ29sdW1uRGVmLFxuICBfQ29hbGVzY2VkU3R5bGVTY2hlZHVsZXIsXG4gIF9DT0FMRVNDRURfU1RZTEVfU0NIRURVTEVSLFxufSBmcm9tICdAYW5ndWxhci9jZGsvdGFibGUnO1xuaW1wb3J0IHtcbiAgQ29sdW1uUmVzaXplLFxuICBDb2x1bW5SZXNpemVOb3RpZmllclNvdXJjZSxcbiAgSGVhZGVyUm93RXZlbnREaXNwYXRjaGVyLFxuICBSZXNpemVTdHJhdGVneSxcbn0gZnJvbSAnQG5nLW1hdGVyby9leHRlbnNpb25zL2NvbHVtbi1yZXNpemUnO1xuXG5pbXBvcnQgeyBBYnN0cmFjdE1hdFJlc2l6YWJsZSwgUkVTSVpBQkxFX0hPU1RfQklORElOR1MsIFJFU0laQUJMRV9JTlBVVFMgfSBmcm9tICcuL2NvbW1vbic7XG5cbi8qKlxuICogRXhwbGljaXRseSBlbmFibGVzIGNvbHVtbiByZXNpemluZyBmb3IgYSBtYXQtaGVhZGVyLWNlbGwuXG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ21hdC1oZWFkZXItY2VsbFtyZXNpemFibGVdLCB0aFttYXQtaGVhZGVyLWNlbGxdW3Jlc2l6YWJsZV0nLFxuICBpbnB1dHM6IFJFU0laQUJMRV9JTlBVVFMsXG59KVxuZXhwb3J0IGNsYXNzIE1hdFJlc2l6YWJsZSBleHRlbmRzIEFic3RyYWN0TWF0UmVzaXphYmxlIHtcbiAgaXNSZXNpemFibGUgPSB0cnVlO1xuXG4gIEBIb3N0QmluZGluZygnY2xhc3MnKSBnZXQgaGFzUmVzaXphYmxlQ2xhc3MoKSB7XG4gICAgcmV0dXJuIHRoaXMuaXNSZXNpemFibGUgPyBSRVNJWkFCTEVfSE9TVF9CSU5ESU5HUy5jbGFzcyA6ICcnO1xuICB9XG5cbiAgQElucHV0KClcbiAgZ2V0IHJlc2l6YWJsZSgpIHtcbiAgICByZXR1cm4gdGhpcy5pc1Jlc2l6YWJsZTtcbiAgfVxuICBzZXQgcmVzaXphYmxlKG5ld1ZhbHVlOiBhbnkpIHtcbiAgICB0aGlzLmlzUmVzaXphYmxlID0gbmV3VmFsdWUgPT0gbnVsbCB8fCBuZXdWYWx1ZSA9PT0gJycgfHwgbmV3VmFsdWU7XG4gIH1cblxuICBwcm90ZWN0ZWQgcmVhZG9ubHkgZG9jdW1lbnQ6IERvY3VtZW50O1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByb3RlY3RlZCByZWFkb25seSBjb2x1bW5EZWY6IENka0NvbHVtbkRlZixcbiAgICBwcm90ZWN0ZWQgcmVhZG9ubHkgY29sdW1uUmVzaXplOiBDb2x1bW5SZXNpemUsXG4gICAgcHJvdGVjdGVkIHJlYWRvbmx5IGRpcmVjdGlvbmFsaXR5OiBEaXJlY3Rpb25hbGl0eSxcbiAgICBASW5qZWN0KERPQ1VNRU5UKSBkb2N1bWVudDogYW55LFxuICAgIHByb3RlY3RlZCByZWFkb25seSBlbGVtZW50UmVmOiBFbGVtZW50UmVmLFxuICAgIHByb3RlY3RlZCByZWFkb25seSBldmVudERpc3BhdGNoZXI6IEhlYWRlclJvd0V2ZW50RGlzcGF0Y2hlcixcbiAgICBwcm90ZWN0ZWQgcmVhZG9ubHkgaW5qZWN0b3I6IEluamVjdG9yLFxuICAgIHByb3RlY3RlZCByZWFkb25seSBuZ1pvbmU6IE5nWm9uZSxcbiAgICBwcm90ZWN0ZWQgcmVhZG9ubHkgb3ZlcmxheTogT3ZlcmxheSxcbiAgICBwcm90ZWN0ZWQgcmVhZG9ubHkgcmVzaXplTm90aWZpZXI6IENvbHVtblJlc2l6ZU5vdGlmaWVyU291cmNlLFxuICAgIHByb3RlY3RlZCByZWFkb25seSByZXNpemVTdHJhdGVneTogUmVzaXplU3RyYXRlZ3ksXG4gICAgQEluamVjdChfQ09BTEVTQ0VEX1NUWUxFX1NDSEVEVUxFUilcbiAgICBwcm90ZWN0ZWQgcmVhZG9ubHkgc3R5bGVTY2hlZHVsZXI6IF9Db2FsZXNjZWRTdHlsZVNjaGVkdWxlcixcbiAgICBwcm90ZWN0ZWQgcmVhZG9ubHkgdmlld0NvbnRhaW5lclJlZjogVmlld0NvbnRhaW5lclJlZixcbiAgICBwcm90ZWN0ZWQgcmVhZG9ubHkgY2hhbmdlRGV0ZWN0b3JSZWY6IENoYW5nZURldGVjdG9yUmVmXG4gICkge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5kb2N1bWVudCA9IGRvY3VtZW50O1xuICB9XG59XG4iXX0=