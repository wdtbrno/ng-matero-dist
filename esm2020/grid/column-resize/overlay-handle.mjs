/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ChangeDetectionStrategy, Component, Inject, ViewEncapsulation, } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { _COALESCED_STYLE_SCHEDULER, } from '@angular/cdk/table';
import { ResizeOverlayHandle, } from '@ng-matero/extensions/column-resize';
import * as i0 from "@angular/core";
import * as i1 from "@angular/cdk/table";
import * as i2 from "@ng-matero/extensions/column-resize";
import * as i3 from "@angular/cdk/bidi";
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
/** @nocollapse */ MatColumnResizeOverlayHandle.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MatColumnResizeOverlayHandle, deps: [{ token: i1.CdkColumnDef }, { token: i2.ColumnResize }, { token: i3.Directionality }, { token: i0.ElementRef }, { token: i2.HeaderRowEventDispatcher }, { token: i0.NgZone }, { token: i2.ColumnResizeNotifierSource }, { token: i2.ResizeRef }, { token: _COALESCED_STYLE_SCHEDULER }, { token: DOCUMENT }], target: i0.ɵɵFactoryTarget.Component });
/** @nocollapse */ MatColumnResizeOverlayHandle.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.1", type: MatColumnResizeOverlayHandle, selector: "ng-component", host: { classAttribute: "mat-column-resize-overlay-thumb" }, usesInheritance: true, ngImport: i0, template: '', isInline: true, changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MatColumnResizeOverlayHandle, decorators: [{
            type: Component,
            args: [{
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    encapsulation: ViewEncapsulation.None,
                    host: { class: 'mat-column-resize-overlay-thumb' },
                    template: '',
                }]
        }], ctorParameters: function () { return [{ type: i1.CdkColumnDef }, { type: i2.ColumnResize }, { type: i3.Directionality }, { type: i0.ElementRef }, { type: i2.HeaderRowEventDispatcher }, { type: i0.NgZone }, { type: i2.ColumnResizeNotifierSource }, { type: i2.ResizeRef }, { type: i1._CoalescedStyleScheduler, decorators: [{
                    type: Inject,
                    args: [_COALESCED_STYLE_SCHEDULER]
                }] }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3ZlcmxheS1oYW5kbGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9leHRlbnNpb25zL2dyaWQvY29sdW1uLXJlc2l6ZS9vdmVybGF5LWhhbmRsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQ0wsdUJBQXVCLEVBQ3ZCLFNBQVMsRUFFVCxNQUFNLEVBRU4saUJBQWlCLEdBQ2xCLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUMzQyxPQUFPLEVBR0wsMEJBQTBCLEdBQzNCLE1BQU0sb0JBQW9CLENBQUM7QUFFNUIsT0FBTyxFQUlMLG1CQUFtQixHQUVwQixNQUFNLHFDQUFxQyxDQUFDOzs7OztBQUk3Qzs7O0dBR0c7QUFPSCxNQUFNLE9BQU8sNEJBQTZCLFNBQVEsbUJBQW1CO0lBR25FLFlBQ3FCLFNBQXVCLEVBQ3ZCLFlBQTBCLEVBQzFCLGNBQThCLEVBQzlCLFVBQXNCLEVBQ3RCLGVBQXlDLEVBQ3pDLE1BQWMsRUFDZCxjQUEwQyxFQUMxQyxTQUFvQixFQUVwQixjQUF3QyxFQUN6QyxRQUFhO1FBRS9CLEtBQUssRUFBRSxDQUFDO1FBWlcsY0FBUyxHQUFULFNBQVMsQ0FBYztRQUN2QixpQkFBWSxHQUFaLFlBQVksQ0FBYztRQUMxQixtQkFBYyxHQUFkLGNBQWMsQ0FBZ0I7UUFDOUIsZUFBVSxHQUFWLFVBQVUsQ0FBWTtRQUN0QixvQkFBZSxHQUFmLGVBQWUsQ0FBMEI7UUFDekMsV0FBTSxHQUFOLE1BQU0sQ0FBUTtRQUNkLG1CQUFjLEdBQWQsY0FBYyxDQUE0QjtRQUMxQyxjQUFTLEdBQVQsU0FBUyxDQUFXO1FBRXBCLG1CQUFjLEdBQWQsY0FBYyxDQUEwQjtRQUkzRCxJQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQztJQUMzQixDQUFDO0lBRVMsa0JBQWtCLENBQUMsTUFBZTtRQUMxQyxLQUFLLENBQUMsa0JBQWtCLENBQUMsTUFBTSxDQUFDLENBQUM7UUFFakMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDO1lBQ25DLE1BQU0sRUFBRSxNQUFNO2dCQUNaLENBQUMsQ0FBRSxJQUFJLENBQUMsWUFBd0MsQ0FBQyxjQUFjLEVBQUU7Z0JBQ2pFLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxhQUFjLENBQUMsWUFBWTtTQUN0RCxDQUFDLENBQUM7SUFDTCxDQUFDOzs0SUE1QlUsNEJBQTRCLG1RQVk3QiwwQkFBMEIsYUFFMUIsUUFBUTtnSUFkUCw0QkFBNEIsd0lBRjdCLEVBQUU7MkZBRUQsNEJBQTRCO2tCQU54QyxTQUFTO21CQUFDO29CQUNULGVBQWUsRUFBRSx1QkFBdUIsQ0FBQyxNQUFNO29CQUMvQyxhQUFhLEVBQUUsaUJBQWlCLENBQUMsSUFBSTtvQkFDckMsSUFBSSxFQUFFLEVBQUUsS0FBSyxFQUFFLGlDQUFpQyxFQUFFO29CQUNsRCxRQUFRLEVBQUUsRUFBRTtpQkFDYjs7MEJBYUksTUFBTTsyQkFBQywwQkFBMEI7OzBCQUVqQyxNQUFNOzJCQUFDLFFBQVEiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIENvbXBvbmVudCxcbiAgRWxlbWVudFJlZixcbiAgSW5qZWN0LFxuICBOZ1pvbmUsXG4gIFZpZXdFbmNhcHN1bGF0aW9uLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IERPQ1VNRU5UIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7XG4gIENka0NvbHVtbkRlZixcbiAgX0NvYWxlc2NlZFN0eWxlU2NoZWR1bGVyLFxuICBfQ09BTEVTQ0VEX1NUWUxFX1NDSEVEVUxFUixcbn0gZnJvbSAnQGFuZ3VsYXIvY2RrL3RhYmxlJztcbmltcG9ydCB7IERpcmVjdGlvbmFsaXR5IH0gZnJvbSAnQGFuZ3VsYXIvY2RrL2JpZGknO1xuaW1wb3J0IHtcbiAgQ29sdW1uUmVzaXplLFxuICBDb2x1bW5SZXNpemVOb3RpZmllclNvdXJjZSxcbiAgSGVhZGVyUm93RXZlbnREaXNwYXRjaGVyLFxuICBSZXNpemVPdmVybGF5SGFuZGxlLFxuICBSZXNpemVSZWYsXG59IGZyb20gJ0BuZy1tYXRlcm8vZXh0ZW5zaW9ucy9jb2x1bW4tcmVzaXplJztcblxuaW1wb3J0IHsgQWJzdHJhY3RNYXRDb2x1bW5SZXNpemUgfSBmcm9tICcuL2NvbHVtbi1yZXNpemUtZGlyZWN0aXZlcy9jb21tb24nO1xuXG4vKipcbiAqIENvbXBvbmVudCBzaG93biBvdmVyIHRoZSBlZGdlIG9mIGEgcmVzaXphYmxlIGNvbHVtbiB0aGF0IGlzIHJlc3BvbnNpYmxlXG4gKiBmb3IgaGFuZGxpbmcgY29sdW1uIHJlc2l6ZSBtb3VzZSBldmVudHMgYW5kIGRpc3BsYXlpbmcgYSB2ZXJ0aWNhbCBsaW5lIGFsb25nIHRoZSBjb2x1bW4gZWRnZS5cbiAqL1xuQENvbXBvbmVudCh7XG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICBob3N0OiB7IGNsYXNzOiAnbWF0LWNvbHVtbi1yZXNpemUtb3ZlcmxheS10aHVtYicgfSxcbiAgdGVtcGxhdGU6ICcnLFxufSlcbmV4cG9ydCBjbGFzcyBNYXRDb2x1bW5SZXNpemVPdmVybGF5SGFuZGxlIGV4dGVuZHMgUmVzaXplT3ZlcmxheUhhbmRsZSB7XG4gIHByb3RlY3RlZCByZWFkb25seSBkb2N1bWVudDogRG9jdW1lbnQ7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJvdGVjdGVkIHJlYWRvbmx5IGNvbHVtbkRlZjogQ2RrQ29sdW1uRGVmLFxuICAgIHByb3RlY3RlZCByZWFkb25seSBjb2x1bW5SZXNpemU6IENvbHVtblJlc2l6ZSxcbiAgICBwcm90ZWN0ZWQgcmVhZG9ubHkgZGlyZWN0aW9uYWxpdHk6IERpcmVjdGlvbmFsaXR5LFxuICAgIHByb3RlY3RlZCByZWFkb25seSBlbGVtZW50UmVmOiBFbGVtZW50UmVmLFxuICAgIHByb3RlY3RlZCByZWFkb25seSBldmVudERpc3BhdGNoZXI6IEhlYWRlclJvd0V2ZW50RGlzcGF0Y2hlcixcbiAgICBwcm90ZWN0ZWQgcmVhZG9ubHkgbmdab25lOiBOZ1pvbmUsXG4gICAgcHJvdGVjdGVkIHJlYWRvbmx5IHJlc2l6ZU5vdGlmaWVyOiBDb2x1bW5SZXNpemVOb3RpZmllclNvdXJjZSxcbiAgICBwcm90ZWN0ZWQgcmVhZG9ubHkgcmVzaXplUmVmOiBSZXNpemVSZWYsXG4gICAgQEluamVjdChfQ09BTEVTQ0VEX1NUWUxFX1NDSEVEVUxFUilcbiAgICBwcm90ZWN0ZWQgcmVhZG9ubHkgc3R5bGVTY2hlZHVsZXI6IF9Db2FsZXNjZWRTdHlsZVNjaGVkdWxlcixcbiAgICBASW5qZWN0KERPQ1VNRU5UKSBkb2N1bWVudDogYW55XG4gICkge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5kb2N1bWVudCA9IGRvY3VtZW50O1xuICB9XG5cbiAgcHJvdGVjdGVkIHVwZGF0ZVJlc2l6ZUFjdGl2ZShhY3RpdmU6IGJvb2xlYW4pOiB2b2lkIHtcbiAgICBzdXBlci51cGRhdGVSZXNpemVBY3RpdmUoYWN0aXZlKTtcblxuICAgIHRoaXMucmVzaXplUmVmLm92ZXJsYXlSZWYudXBkYXRlU2l6ZSh7XG4gICAgICBoZWlnaHQ6IGFjdGl2ZVxuICAgICAgICA/ICh0aGlzLmNvbHVtblJlc2l6ZSBhcyBBYnN0cmFjdE1hdENvbHVtblJlc2l6ZSkuZ2V0VGFibGVIZWlnaHQoKVxuICAgICAgICA6IHRoaXMucmVzaXplUmVmLm9yaWdpbi5uYXRpdmVFbGVtZW50IS5vZmZzZXRIZWlnaHQsXG4gICAgfSk7XG4gIH1cbn1cbiJdfQ==