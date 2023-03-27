/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ChangeDetectionStrategy, Component, ElementRef, Inject, NgZone, ViewEncapsulation, } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { CdkColumnDef, _CoalescedStyleScheduler, _COALESCED_STYLE_SCHEDULER, } from '@angular/cdk/table';
import { Directionality } from '@angular/cdk/bidi';
import { ColumnResize, ColumnResizeNotifierSource, HeaderRowEventDispatcher, ResizeOverlayHandle, ResizeRef, } from '@ng-matero/extensions/column-resize';
/**
 * Component shown over the edge of a resizable column that is responsible
 * for handling column resize mouse events and displaying a vertical line along the column edge.
 */
export class MatColumnResizeOverlayHandle extends ResizeOverlayHandle {
    constructor(columnDef, columnResize, directionality, elementRef, eventDispatcher, ngZone, resizeNotifier, resizeRef, styleScheduler, document) {
        super();
        this.columnDef = columnDef;
        this.columnResize = columnResize;
        this.directionality = directionality;
        this.elementRef = elementRef;
        this.eventDispatcher = eventDispatcher;
        this.ngZone = ngZone;
        this.resizeNotifier = resizeNotifier;
        this.resizeRef = resizeRef;
        this.styleScheduler = styleScheduler;
        this.document = document;
    }
    updateResizeActive(active) {
        super.updateResizeActive(active);
        this.resizeRef.overlayRef.updateSize({
            height: active
                ? this.columnResize.getTableHeight()
                : this.resizeRef.origin.nativeElement.offsetHeight,
        });
    }
}
MatColumnResizeOverlayHandle.decorators = [
    { type: Component, args: [{
                changeDetection: ChangeDetectionStrategy.OnPush,
                encapsulation: ViewEncapsulation.None,
                host: { class: 'mat-column-resize-overlay-thumb' },
                template: ''
            },] }
];
/** @nocollapse */
MatColumnResizeOverlayHandle.ctorParameters = () => [
    { type: CdkColumnDef },
    { type: ColumnResize },
    { type: Directionality },
    { type: ElementRef },
    { type: HeaderRowEventDispatcher },
    { type: NgZone },
    { type: ColumnResizeNotifierSource },
    { type: ResizeRef },
    { type: _CoalescedStyleScheduler, decorators: [{ type: Inject, args: [_COALESCED_STYLE_SCHEDULER,] }] },
    { type: undefined, decorators: [{ type: Inject, args: [DOCUMENT,] }] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3ZlcmxheS1oYW5kbGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9leHRlbnNpb25zL2RhdGEtZ3JpZC9jb2x1bW4tcmVzaXplL292ZXJsYXktaGFuZGxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFDTCx1QkFBdUIsRUFDdkIsU0FBUyxFQUNULFVBQVUsRUFDVixNQUFNLEVBQ04sTUFBTSxFQUNOLGlCQUFpQixHQUNsQixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDM0MsT0FBTyxFQUNMLFlBQVksRUFDWix3QkFBd0IsRUFDeEIsMEJBQTBCLEdBQzNCLE1BQU0sb0JBQW9CLENBQUM7QUFDNUIsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLG1CQUFtQixDQUFDO0FBQ25ELE9BQU8sRUFDTCxZQUFZLEVBQ1osMEJBQTBCLEVBQzFCLHdCQUF3QixFQUN4QixtQkFBbUIsRUFDbkIsU0FBUyxHQUNWLE1BQU0scUNBQXFDLENBQUM7QUFJN0M7OztHQUdHO0FBT0gsTUFBTSxPQUFPLDRCQUE2QixTQUFRLG1CQUFtQjtJQUduRSxZQUNxQixTQUF1QixFQUN2QixZQUEwQixFQUMxQixjQUE4QixFQUM5QixVQUFzQixFQUN0QixlQUF5QyxFQUN6QyxNQUFjLEVBQ2QsY0FBMEMsRUFDMUMsU0FBb0IsRUFFcEIsY0FBd0MsRUFDekMsUUFBYTtRQUUvQixLQUFLLEVBQUUsQ0FBQztRQVpXLGNBQVMsR0FBVCxTQUFTLENBQWM7UUFDdkIsaUJBQVksR0FBWixZQUFZLENBQWM7UUFDMUIsbUJBQWMsR0FBZCxjQUFjLENBQWdCO1FBQzlCLGVBQVUsR0FBVixVQUFVLENBQVk7UUFDdEIsb0JBQWUsR0FBZixlQUFlLENBQTBCO1FBQ3pDLFdBQU0sR0FBTixNQUFNLENBQVE7UUFDZCxtQkFBYyxHQUFkLGNBQWMsQ0FBNEI7UUFDMUMsY0FBUyxHQUFULFNBQVMsQ0FBVztRQUVwQixtQkFBYyxHQUFkLGNBQWMsQ0FBMEI7UUFJM0QsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7SUFDM0IsQ0FBQztJQUVTLGtCQUFrQixDQUFDLE1BQWU7UUFDMUMsS0FBSyxDQUFDLGtCQUFrQixDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBRWpDLElBQUksQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQztZQUNuQyxNQUFNLEVBQUUsTUFBTTtnQkFDWixDQUFDLENBQUUsSUFBSSxDQUFDLFlBQXdDLENBQUMsY0FBYyxFQUFFO2dCQUNqRSxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsYUFBYyxDQUFDLFlBQVk7U0FDdEQsQ0FBQyxDQUFDO0lBQ0wsQ0FBQzs7O1lBbENGLFNBQVMsU0FBQztnQkFDVCxlQUFlLEVBQUUsdUJBQXVCLENBQUMsTUFBTTtnQkFDL0MsYUFBYSxFQUFFLGlCQUFpQixDQUFDLElBQUk7Z0JBQ3JDLElBQUksRUFBRSxFQUFFLEtBQUssRUFBRSxpQ0FBaUMsRUFBRTtnQkFDbEQsUUFBUSxFQUFFLEVBQUU7YUFDYjs7OztZQXhCQyxZQUFZO1lBTVosWUFBWTtZQUZMLGNBQWM7WUFYckIsVUFBVTtZQWVWLHdCQUF3QjtZQWJ4QixNQUFNO1lBWU4sMEJBQTBCO1lBRzFCLFNBQVM7WUFUVCx3QkFBd0IsdUJBb0NyQixNQUFNLFNBQUMsMEJBQTBCOzRDQUVqQyxNQUFNLFNBQUMsUUFBUSIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge1xuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgQ29tcG9uZW50LFxuICBFbGVtZW50UmVmLFxuICBJbmplY3QsXG4gIE5nWm9uZSxcbiAgVmlld0VuY2Fwc3VsYXRpb24sXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgRE9DVU1FTlQgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHtcbiAgQ2RrQ29sdW1uRGVmLFxuICBfQ29hbGVzY2VkU3R5bGVTY2hlZHVsZXIsXG4gIF9DT0FMRVNDRURfU1RZTEVfU0NIRURVTEVSLFxufSBmcm9tICdAYW5ndWxhci9jZGsvdGFibGUnO1xuaW1wb3J0IHsgRGlyZWN0aW9uYWxpdHkgfSBmcm9tICdAYW5ndWxhci9jZGsvYmlkaSc7XG5pbXBvcnQge1xuICBDb2x1bW5SZXNpemUsXG4gIENvbHVtblJlc2l6ZU5vdGlmaWVyU291cmNlLFxuICBIZWFkZXJSb3dFdmVudERpc3BhdGNoZXIsXG4gIFJlc2l6ZU92ZXJsYXlIYW5kbGUsXG4gIFJlc2l6ZVJlZixcbn0gZnJvbSAnQG5nLW1hdGVyby9leHRlbnNpb25zL2NvbHVtbi1yZXNpemUnO1xuXG5pbXBvcnQgeyBBYnN0cmFjdE1hdENvbHVtblJlc2l6ZSB9IGZyb20gJy4vY29sdW1uLXJlc2l6ZS1kaXJlY3RpdmVzL2NvbW1vbic7XG5cbi8qKlxuICogQ29tcG9uZW50IHNob3duIG92ZXIgdGhlIGVkZ2Ugb2YgYSByZXNpemFibGUgY29sdW1uIHRoYXQgaXMgcmVzcG9uc2libGVcbiAqIGZvciBoYW5kbGluZyBjb2x1bW4gcmVzaXplIG1vdXNlIGV2ZW50cyBhbmQgZGlzcGxheWluZyBhIHZlcnRpY2FsIGxpbmUgYWxvbmcgdGhlIGNvbHVtbiBlZGdlLlxuICovXG5AQ29tcG9uZW50KHtcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIGhvc3Q6IHsgY2xhc3M6ICdtYXQtY29sdW1uLXJlc2l6ZS1vdmVybGF5LXRodW1iJyB9LFxuICB0ZW1wbGF0ZTogJycsXG59KVxuZXhwb3J0IGNsYXNzIE1hdENvbHVtblJlc2l6ZU92ZXJsYXlIYW5kbGUgZXh0ZW5kcyBSZXNpemVPdmVybGF5SGFuZGxlIHtcbiAgcHJvdGVjdGVkIHJlYWRvbmx5IGRvY3VtZW50OiBEb2N1bWVudDtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcm90ZWN0ZWQgcmVhZG9ubHkgY29sdW1uRGVmOiBDZGtDb2x1bW5EZWYsXG4gICAgcHJvdGVjdGVkIHJlYWRvbmx5IGNvbHVtblJlc2l6ZTogQ29sdW1uUmVzaXplLFxuICAgIHByb3RlY3RlZCByZWFkb25seSBkaXJlY3Rpb25hbGl0eTogRGlyZWN0aW9uYWxpdHksXG4gICAgcHJvdGVjdGVkIHJlYWRvbmx5IGVsZW1lbnRSZWY6IEVsZW1lbnRSZWYsXG4gICAgcHJvdGVjdGVkIHJlYWRvbmx5IGV2ZW50RGlzcGF0Y2hlcjogSGVhZGVyUm93RXZlbnREaXNwYXRjaGVyLFxuICAgIHByb3RlY3RlZCByZWFkb25seSBuZ1pvbmU6IE5nWm9uZSxcbiAgICBwcm90ZWN0ZWQgcmVhZG9ubHkgcmVzaXplTm90aWZpZXI6IENvbHVtblJlc2l6ZU5vdGlmaWVyU291cmNlLFxuICAgIHByb3RlY3RlZCByZWFkb25seSByZXNpemVSZWY6IFJlc2l6ZVJlZixcbiAgICBASW5qZWN0KF9DT0FMRVNDRURfU1RZTEVfU0NIRURVTEVSKVxuICAgIHByb3RlY3RlZCByZWFkb25seSBzdHlsZVNjaGVkdWxlcjogX0NvYWxlc2NlZFN0eWxlU2NoZWR1bGVyLFxuICAgIEBJbmplY3QoRE9DVU1FTlQpIGRvY3VtZW50OiBhbnlcbiAgKSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLmRvY3VtZW50ID0gZG9jdW1lbnQ7XG4gIH1cblxuICBwcm90ZWN0ZWQgdXBkYXRlUmVzaXplQWN0aXZlKGFjdGl2ZTogYm9vbGVhbik6IHZvaWQge1xuICAgIHN1cGVyLnVwZGF0ZVJlc2l6ZUFjdGl2ZShhY3RpdmUpO1xuXG4gICAgdGhpcy5yZXNpemVSZWYub3ZlcmxheVJlZi51cGRhdGVTaXplKHtcbiAgICAgIGhlaWdodDogYWN0aXZlXG4gICAgICAgID8gKHRoaXMuY29sdW1uUmVzaXplIGFzIEFic3RyYWN0TWF0Q29sdW1uUmVzaXplKS5nZXRUYWJsZUhlaWdodCgpXG4gICAgICAgIDogdGhpcy5yZXNpemVSZWYub3JpZ2luLm5hdGl2ZUVsZW1lbnQhLm9mZnNldEhlaWdodCxcbiAgICB9KTtcbiAgfVxufVxuIl19