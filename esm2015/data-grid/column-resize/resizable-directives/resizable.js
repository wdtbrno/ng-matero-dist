import { Directive, ElementRef, Inject, Injector, NgZone, ViewContainerRef, ChangeDetectorRef, Input, HostBinding, } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Directionality } from '@angular/cdk/bidi';
import { Overlay } from '@angular/cdk/overlay';
import { CdkColumnDef, _CoalescedStyleScheduler, _COALESCED_STYLE_SCHEDULER, } from '@angular/cdk/table';
import { ColumnResize, ColumnResizeNotifierSource, HeaderRowEventDispatcher, ResizeStrategy, } from '@ng-matero/extensions/column-resize';
import { AbstractMatResizable, RESIZABLE_HOST_BINDINGS, RESIZABLE_INPUTS } from './common';
/**
 * Explicitly enables column resizing for a mat-header-cell.
 */
export class MatResizable extends AbstractMatResizable {
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
    get hasResizableClass() {
        return this.isResizable ? RESIZABLE_HOST_BINDINGS.class : '';
    }
    get resizable() {
        return this.isResizable;
    }
    set resizable(newValue) {
        this.isResizable = newValue == null || newValue === '' || newValue;
    }
}
MatResizable.decorators = [
    { type: Directive, args: [{
                selector: 'mat-header-cell[resizable], th[mat-header-cell][resizable]',
                inputs: RESIZABLE_INPUTS,
            },] }
];
/** @nocollapse */
MatResizable.ctorParameters = () => [
    { type: CdkColumnDef },
    { type: ColumnResize },
    { type: Directionality },
    { type: undefined, decorators: [{ type: Inject, args: [DOCUMENT,] }] },
    { type: ElementRef },
    { type: HeaderRowEventDispatcher },
    { type: Injector },
    { type: NgZone },
    { type: Overlay },
    { type: ColumnResizeNotifierSource },
    { type: ResizeStrategy },
    { type: _CoalescedStyleScheduler, decorators: [{ type: Inject, args: [_COALESCED_STYLE_SCHEDULER,] }] },
    { type: ViewContainerRef },
    { type: ChangeDetectorRef }
];
MatResizable.propDecorators = {
    hasResizableClass: [{ type: HostBinding, args: ['class',] }],
    resizable: [{ type: Input }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVzaXphYmxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvZXh0ZW5zaW9ucy9kYXRhLWdyaWQvY29sdW1uLXJlc2l6ZS9yZXNpemFibGUtZGlyZWN0aXZlcy9yZXNpemFibGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUNMLFNBQVMsRUFDVCxVQUFVLEVBQ1YsTUFBTSxFQUNOLFFBQVEsRUFDUixNQUFNLEVBQ04sZ0JBQWdCLEVBQ2hCLGlCQUFpQixFQUNqQixLQUFLLEVBQ0wsV0FBVyxHQUNaLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUMzQyxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sbUJBQW1CLENBQUM7QUFDbkQsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBQy9DLE9BQU8sRUFDTCxZQUFZLEVBQ1osd0JBQXdCLEVBQ3hCLDBCQUEwQixHQUMzQixNQUFNLG9CQUFvQixDQUFDO0FBQzVCLE9BQU8sRUFDTCxZQUFZLEVBQ1osMEJBQTBCLEVBQzFCLHdCQUF3QixFQUN4QixjQUFjLEdBQ2YsTUFBTSxxQ0FBcUMsQ0FBQztBQUU3QyxPQUFPLEVBQUUsb0JBQW9CLEVBQUUsdUJBQXVCLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxVQUFVLENBQUM7QUFFM0Y7O0dBRUc7QUFLSCxNQUFNLE9BQU8sWUFBYSxTQUFRLG9CQUFvQjtJQWlCcEQsWUFDcUIsU0FBdUIsRUFDdkIsWUFBMEIsRUFDMUIsY0FBOEIsRUFDL0IsUUFBYSxFQUNaLFVBQXNCLEVBQ3RCLGVBQXlDLEVBQ3pDLFFBQWtCLEVBQ2xCLE1BQWMsRUFDZCxPQUFnQixFQUNoQixjQUEwQyxFQUMxQyxjQUE4QixFQUU5QixjQUF3QyxFQUN4QyxnQkFBa0MsRUFDbEMsaUJBQW9DO1FBRXZELEtBQUssRUFBRSxDQUFDO1FBaEJXLGNBQVMsR0FBVCxTQUFTLENBQWM7UUFDdkIsaUJBQVksR0FBWixZQUFZLENBQWM7UUFDMUIsbUJBQWMsR0FBZCxjQUFjLENBQWdCO1FBRTlCLGVBQVUsR0FBVixVQUFVLENBQVk7UUFDdEIsb0JBQWUsR0FBZixlQUFlLENBQTBCO1FBQ3pDLGFBQVEsR0FBUixRQUFRLENBQVU7UUFDbEIsV0FBTSxHQUFOLE1BQU0sQ0FBUTtRQUNkLFlBQU8sR0FBUCxPQUFPLENBQVM7UUFDaEIsbUJBQWMsR0FBZCxjQUFjLENBQTRCO1FBQzFDLG1CQUFjLEdBQWQsY0FBYyxDQUFnQjtRQUU5QixtQkFBYyxHQUFkLGNBQWMsQ0FBMEI7UUFDeEMscUJBQWdCLEdBQWhCLGdCQUFnQixDQUFrQjtRQUNsQyxzQkFBaUIsR0FBakIsaUJBQWlCLENBQW1CO1FBL0J6RCxnQkFBVyxHQUFHLElBQUksQ0FBQztRQWtDakIsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7SUFDM0IsQ0FBQztJQWpDRCxJQUEwQixpQkFBaUI7UUFDekMsT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyx1QkFBdUIsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztJQUMvRCxDQUFDO0lBRUQsSUFDSSxTQUFTO1FBQ1gsT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDO0lBQzFCLENBQUM7SUFDRCxJQUFJLFNBQVMsQ0FBQyxRQUFhO1FBQ3pCLElBQUksQ0FBQyxXQUFXLEdBQUcsUUFBUSxJQUFJLElBQUksSUFBSSxRQUFRLEtBQUssRUFBRSxJQUFJLFFBQVEsQ0FBQztJQUNyRSxDQUFDOzs7WUFqQkYsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSw0REFBNEQ7Z0JBQ3RFLE1BQU0sRUFBRSxnQkFBZ0I7YUFDekI7Ozs7WUFuQkMsWUFBWTtZQUtaLFlBQVk7WUFSTCxjQUFjOzRDQTRDbEIsTUFBTSxTQUFDLFFBQVE7WUF0RGxCLFVBQVU7WUFvQlYsd0JBQXdCO1lBbEJ4QixRQUFRO1lBQ1IsTUFBTTtZQVFDLE9BQU87WUFRZCwwQkFBMEI7WUFFMUIsY0FBYztZQVBkLHdCQUF3Qix1QkFnRHJCLE1BQU0sU0FBQywwQkFBMEI7WUExRHBDLGdCQUFnQjtZQUNoQixpQkFBaUI7OztnQ0ErQmhCLFdBQVcsU0FBQyxPQUFPO3dCQUluQixLQUFLIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgRGlyZWN0aXZlLFxuICBFbGVtZW50UmVmLFxuICBJbmplY3QsXG4gIEluamVjdG9yLFxuICBOZ1pvbmUsXG4gIFZpZXdDb250YWluZXJSZWYsXG4gIENoYW5nZURldGVjdG9yUmVmLFxuICBJbnB1dCxcbiAgSG9zdEJpbmRpbmcsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgRE9DVU1FTlQgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHsgRGlyZWN0aW9uYWxpdHkgfSBmcm9tICdAYW5ndWxhci9jZGsvYmlkaSc7XG5pbXBvcnQgeyBPdmVybGF5IH0gZnJvbSAnQGFuZ3VsYXIvY2RrL292ZXJsYXknO1xuaW1wb3J0IHtcbiAgQ2RrQ29sdW1uRGVmLFxuICBfQ29hbGVzY2VkU3R5bGVTY2hlZHVsZXIsXG4gIF9DT0FMRVNDRURfU1RZTEVfU0NIRURVTEVSLFxufSBmcm9tICdAYW5ndWxhci9jZGsvdGFibGUnO1xuaW1wb3J0IHtcbiAgQ29sdW1uUmVzaXplLFxuICBDb2x1bW5SZXNpemVOb3RpZmllclNvdXJjZSxcbiAgSGVhZGVyUm93RXZlbnREaXNwYXRjaGVyLFxuICBSZXNpemVTdHJhdGVneSxcbn0gZnJvbSAnQG5nLW1hdGVyby9leHRlbnNpb25zL2NvbHVtbi1yZXNpemUnO1xuXG5pbXBvcnQgeyBBYnN0cmFjdE1hdFJlc2l6YWJsZSwgUkVTSVpBQkxFX0hPU1RfQklORElOR1MsIFJFU0laQUJMRV9JTlBVVFMgfSBmcm9tICcuL2NvbW1vbic7XG5cbi8qKlxuICogRXhwbGljaXRseSBlbmFibGVzIGNvbHVtbiByZXNpemluZyBmb3IgYSBtYXQtaGVhZGVyLWNlbGwuXG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ21hdC1oZWFkZXItY2VsbFtyZXNpemFibGVdLCB0aFttYXQtaGVhZGVyLWNlbGxdW3Jlc2l6YWJsZV0nLFxuICBpbnB1dHM6IFJFU0laQUJMRV9JTlBVVFMsXG59KVxuZXhwb3J0IGNsYXNzIE1hdFJlc2l6YWJsZSBleHRlbmRzIEFic3RyYWN0TWF0UmVzaXphYmxlIHtcbiAgaXNSZXNpemFibGUgPSB0cnVlO1xuXG4gIEBIb3N0QmluZGluZygnY2xhc3MnKSBnZXQgaGFzUmVzaXphYmxlQ2xhc3MoKSB7XG4gICAgcmV0dXJuIHRoaXMuaXNSZXNpemFibGUgPyBSRVNJWkFCTEVfSE9TVF9CSU5ESU5HUy5jbGFzcyA6ICcnO1xuICB9XG5cbiAgQElucHV0KClcbiAgZ2V0IHJlc2l6YWJsZSgpIHtcbiAgICByZXR1cm4gdGhpcy5pc1Jlc2l6YWJsZTtcbiAgfVxuICBzZXQgcmVzaXphYmxlKG5ld1ZhbHVlOiBhbnkpIHtcbiAgICB0aGlzLmlzUmVzaXphYmxlID0gbmV3VmFsdWUgPT0gbnVsbCB8fCBuZXdWYWx1ZSA9PT0gJycgfHwgbmV3VmFsdWU7XG4gIH1cblxuICBwcm90ZWN0ZWQgcmVhZG9ubHkgZG9jdW1lbnQ6IERvY3VtZW50O1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByb3RlY3RlZCByZWFkb25seSBjb2x1bW5EZWY6IENka0NvbHVtbkRlZixcbiAgICBwcm90ZWN0ZWQgcmVhZG9ubHkgY29sdW1uUmVzaXplOiBDb2x1bW5SZXNpemUsXG4gICAgcHJvdGVjdGVkIHJlYWRvbmx5IGRpcmVjdGlvbmFsaXR5OiBEaXJlY3Rpb25hbGl0eSxcbiAgICBASW5qZWN0KERPQ1VNRU5UKSBkb2N1bWVudDogYW55LFxuICAgIHByb3RlY3RlZCByZWFkb25seSBlbGVtZW50UmVmOiBFbGVtZW50UmVmLFxuICAgIHByb3RlY3RlZCByZWFkb25seSBldmVudERpc3BhdGNoZXI6IEhlYWRlclJvd0V2ZW50RGlzcGF0Y2hlcixcbiAgICBwcm90ZWN0ZWQgcmVhZG9ubHkgaW5qZWN0b3I6IEluamVjdG9yLFxuICAgIHByb3RlY3RlZCByZWFkb25seSBuZ1pvbmU6IE5nWm9uZSxcbiAgICBwcm90ZWN0ZWQgcmVhZG9ubHkgb3ZlcmxheTogT3ZlcmxheSxcbiAgICBwcm90ZWN0ZWQgcmVhZG9ubHkgcmVzaXplTm90aWZpZXI6IENvbHVtblJlc2l6ZU5vdGlmaWVyU291cmNlLFxuICAgIHByb3RlY3RlZCByZWFkb25seSByZXNpemVTdHJhdGVneTogUmVzaXplU3RyYXRlZ3ksXG4gICAgQEluamVjdChfQ09BTEVTQ0VEX1NUWUxFX1NDSEVEVUxFUilcbiAgICBwcm90ZWN0ZWQgcmVhZG9ubHkgc3R5bGVTY2hlZHVsZXI6IF9Db2FsZXNjZWRTdHlsZVNjaGVkdWxlcixcbiAgICBwcm90ZWN0ZWQgcmVhZG9ubHkgdmlld0NvbnRhaW5lclJlZjogVmlld0NvbnRhaW5lclJlZixcbiAgICBwcm90ZWN0ZWQgcmVhZG9ubHkgY2hhbmdlRGV0ZWN0b3JSZWY6IENoYW5nZURldGVjdG9yUmVmXG4gICkge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5kb2N1bWVudCA9IGRvY3VtZW50O1xuICB9XG59XG4iXX0=