import { Directive, Injector, } from '@angular/core';
import { ComponentPortal } from '@angular/cdk/portal';
import { merge, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { HEADER_ROW_SELECTOR } from './selectors';
import { ResizeRef } from './resize-ref';
import { closest } from './polyfill';
const OVERLAY_ACTIVE_CLASS = 'cdk-resizable-overlay-thumb-active';
/**
 * Base class for Resizable directives which are applied to column headers to make those columns
 * resizable.
 */
export class Resizable {
    constructor() {
        this.isResizable = true;
        this.minWidthPxInternal = 0;
        this.maxWidthPxInternal = Number.MAX_SAFE_INTEGER;
        this.destroyed = new Subject();
        this._viewInitialized = false;
    }
    /** The minimum width to allow the column to be sized to. */
    get minWidthPx() {
        return this.minWidthPxInternal;
    }
    set minWidthPx(value) {
        if (value) {
            this.minWidthPxInternal = value;
        }
        this.columnResize.setResized();
        if (this.elementRef.nativeElement && this._viewInitialized) {
            this._applyMinWidthPx();
        }
    }
    /** The maximum width to allow the column to be sized to. */
    get maxWidthPx() {
        return this.maxWidthPxInternal;
    }
    set maxWidthPx(value) {
        if (value) {
            this.maxWidthPxInternal = value;
        }
        this.columnResize.setResized();
        if (this.elementRef.nativeElement && this._viewInitialized) {
            this._applyMaxWidthPx();
        }
    }
    ngAfterViewInit() {
        if (this.isResizable) {
            this._listenForRowHoverEvents();
            this._listenForResizeEvents();
            this._appendInlineHandle();
            this.styleScheduler.scheduleEnd(() => {
                this._viewInitialized = true;
                this._applyMinWidthPx();
                this._applyMaxWidthPx();
            });
        }
    }
    ngOnDestroy() {
        this.destroyed.next();
        this.destroyed.complete();
        if (this.inlineHandle) {
            this.elementRef.nativeElement.removeChild(this.inlineHandle);
        }
        if (this.overlayRef) {
            this.overlayRef.dispose();
        }
    }
    _createOverlayForHandle() {
        // Use of overlays allows us to properly capture click events spanning parts
        // of two table cells and is also useful for displaying a resize thumb
        // over both cells and extending it down the table as needed.
        const isRtl = this.directionality.value === 'rtl';
        const positionStrategy = this.overlay
            .position()
            .flexibleConnectedTo(this.elementRef.nativeElement)
            .withFlexibleDimensions(false)
            .withGrowAfterOpen(false)
            .withPush(false)
            .withDefaultOffsetX(isRtl ? 1 : 0)
            .withPositions([
            {
                originX: isRtl ? 'start' : 'end',
                originY: 'top',
                overlayX: 'center',
                overlayY: 'top',
            },
        ]);
        return this.overlay.create({
            // Always position the overlay based on left-indexed coordinates.
            direction: 'ltr',
            disposeOnNavigation: true,
            positionStrategy,
            scrollStrategy: this.overlay.scrollStrategies.reposition(),
            width: '16px',
        });
    }
    _listenForRowHoverEvents() {
        const element = this.elementRef.nativeElement;
        const takeUntilDestroyed = takeUntil(this.destroyed);
        this.eventDispatcher
            .resizeOverlayVisibleForHeaderRow(closest(element, HEADER_ROW_SELECTOR))
            .pipe(takeUntilDestroyed)
            .subscribe(hoveringRow => {
            if (hoveringRow) {
                if (!this.overlayRef) {
                    this.overlayRef = this._createOverlayForHandle();
                }
                this._showHandleOverlay();
            }
            else if (this.overlayRef) {
                // todo - can't detach during an active resize - need to work that out
                this.overlayRef.detach();
            }
        });
    }
    _listenForResizeEvents() {
        const takeUntilDestroyed = takeUntil(this.destroyed);
        merge(this.resizeNotifier.resizeCanceled, this.resizeNotifier.triggerResize)
            .pipe(takeUntilDestroyed, filter(columnSize => columnSize.columnId === this.columnDef.name))
            .subscribe(({ size, previousSize, completeImmediately }) => {
            this.elementRef.nativeElement.classList.add(OVERLAY_ACTIVE_CLASS);
            this._applySize(size, previousSize);
            if (completeImmediately) {
                this._completeResizeOperation();
            }
        });
        merge(this.resizeNotifier.resizeCanceled, this.resizeNotifier.resizeCompleted)
            .pipe(takeUntilDestroyed)
            .subscribe(columnSize => {
            this._cleanUpAfterResize(columnSize);
        });
    }
    _completeResizeOperation() {
        this.ngZone.run(() => {
            this.resizeNotifier.resizeCompleted.next({
                columnId: this.columnDef.name,
                size: this.elementRef.nativeElement.offsetWidth,
            });
        });
    }
    _cleanUpAfterResize(columnSize) {
        this.elementRef.nativeElement.classList.remove(OVERLAY_ACTIVE_CLASS);
        if (this.overlayRef && this.overlayRef.hasAttached()) {
            this._updateOverlayHandleHeight();
            this.overlayRef.updatePosition();
            if (columnSize.columnId === this.columnDef.name) {
                this.inlineHandle.focus();
            }
        }
    }
    _createHandlePortal() {
        const injector = Injector.create({
            parent: this.injector,
            providers: [
                {
                    provide: ResizeRef,
                    useValue: new ResizeRef(this.elementRef, this.overlayRef, this.minWidthPx, this.maxWidthPx),
                },
            ],
        });
        return new ComponentPortal(this.getOverlayHandleComponentType(), this.viewContainerRef, injector);
    }
    _showHandleOverlay() {
        this._updateOverlayHandleHeight();
        this.overlayRef.attach(this._createHandlePortal());
        // Needed to ensure that all of the lifecycle hooks inside the overlay run immediately.
        this.changeDetectorRef.markForCheck();
    }
    _updateOverlayHandleHeight() {
        this.overlayRef.updateSize({ height: this.elementRef.nativeElement.offsetHeight });
    }
    _applySize(sizeInPixels, previousSize) {
        const sizeToApply = Math.min(Math.max(sizeInPixels, this.minWidthPx, 0), this.maxWidthPx);
        this.resizeStrategy.applyColumnSize(this.columnDef.cssClassFriendlyName, this.elementRef.nativeElement, sizeToApply, previousSize);
    }
    _applyMinWidthPx() {
        this.resizeStrategy.applyMinColumnSize(this.columnDef.cssClassFriendlyName, this.elementRef.nativeElement, this.minWidthPx);
    }
    _applyMaxWidthPx() {
        this.resizeStrategy.applyMaxColumnSize(this.columnDef.cssClassFriendlyName, this.elementRef.nativeElement, this.maxWidthPx);
    }
    _appendInlineHandle() {
        this.styleScheduler.schedule(() => {
            this.inlineHandle = this.document.createElement('div');
            this.inlineHandle.tabIndex = 0;
            this.inlineHandle.className = this.getInlineHandleCssClassName();
            // TODO: Apply correct aria role (probably slider) after a11y spec questions resolved.
            this.elementRef.nativeElement.appendChild(this.inlineHandle);
        });
    }
}
Resizable.decorators = [
    { type: Directive }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVzaXphYmxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vcHJvamVjdHMvZXh0ZW5zaW9ucy9jb2x1bW4tcmVzaXplL3Jlc2l6YWJsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBRUwsU0FBUyxFQUVULFFBQVEsR0FNVCxNQUFNLGVBQWUsQ0FBQztBQUV2QixPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0scUJBQXFCLENBQUM7QUFHdEQsT0FBTyxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDdEMsT0FBTyxFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUVuRCxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSxhQUFhLENBQUM7QUFLbEQsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLGNBQWMsQ0FBQztBQUV6QyxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sWUFBWSxDQUFDO0FBRXJDLE1BQU0sb0JBQW9CLEdBQUcsb0NBQW9DLENBQUM7QUFFbEU7OztHQUdHO0FBRUgsTUFBTSxPQUFnQixTQUFTO0lBRC9CO1FBR1ksZ0JBQVcsR0FBRyxJQUFJLENBQUM7UUFFbkIsdUJBQWtCLEdBQVcsQ0FBQyxDQUFDO1FBQy9CLHVCQUFrQixHQUFXLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQztRQUk1QyxjQUFTLEdBQUcsSUFBSSxPQUFPLEVBQVEsQ0FBQztRQWlCM0MscUJBQWdCLEdBQUcsS0FBSyxDQUFDO0lBMk9uQyxDQUFDO0lBek9DLDREQUE0RDtJQUM1RCxJQUFJLFVBQVU7UUFDWixPQUFPLElBQUksQ0FBQyxrQkFBa0IsQ0FBQztJQUNqQyxDQUFDO0lBQ0QsSUFBSSxVQUFVLENBQUMsS0FBYTtRQUMxQixJQUFJLEtBQUssRUFBRTtZQUNULElBQUksQ0FBQyxrQkFBa0IsR0FBRyxLQUFLLENBQUM7U0FDakM7UUFFRCxJQUFJLENBQUMsWUFBWSxDQUFD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QUFDLFVBQVUsQ0FBQyxDQUFDO1FBRTFGLElBQUksQ0FBQyxjQUFjLENBQUMsZUFBZSxDQUNqQyxJQUFJLENBQUMsU0FBUyxDQUFDLG9CQUFvQixFQUNuQyxJQUFJLENBQUMsVUFBVSxDQUFDLGFBQWMsRUFDOUIsV0FBVyxFQUNYLFlBQVksQ0FDYixDQUFDO0lBQ0osQ0FBQztJQUVPLGdCQUFnQjtRQUN0QixJQUFJLENBQUMsY0FBYyxDQUFDLGtCQUFrQixDQUNwQyxJQUFJLENBQUMsU0FBUyxDQUFDLG9CQUFvQixFQUNuQyxJQUFJLENBQUMsVUFBVSxDQUFDLGFBQWEsRUFDN0IsSUFBSSxDQUFDLFVBQVUsQ0FDaEIsQ0FBQztJQUNKLENBQUM7SUFFTyxnQkFBZ0I7UUFDdEIsSUFBSSxDQUFDLGNBQWMsQ0FBQyxrQkFBa0IsQ0FDcEMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxvQkFBb0IsRUFDbkMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxhQUFhLEVBQzdCLElBQUksQ0FBQyxVQUFVLENBQ2hCLENBQUM7SUFDSixDQUFDO0lBRU8sbUJBQW1CO1FBQ3pCLElBQUksQ0FBQyxjQUFjLENBQUMsUUFBUSxDQUFDLEdBQUcsRUFBRTtZQUNoQyxJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ3ZELElBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxHQUFHLENBQUMsQ0FBQztZQUMvQixJQUFJLENBQUMsWUFBWSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsMkJBQTJCLEVBQUUsQ0FBQztZQUVqRSxzRkFBc0Y7WUFFdEYsSUFBSSxDQUFDLFVBQVUsQ0FBQyxhQUFjLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUNoRSxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7OztZQXJRRixTQUFTIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgQWZ0ZXJWaWV3SW5pdCxcbiAgRGlyZWN0aXZlLFxuICBFbGVtZW50UmVmLFxuICBJbmplY3RvcixcbiAgTmdab25lLFxuICBPbkRlc3Ryb3ksXG4gIFR5cGUsXG4gIFZpZXdDb250YWluZXJSZWYsXG4gIENoYW5nZURldGVjdG9yUmVmLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IERpcmVjdGlvbmFsaXR5IH0gZnJvbSAnQGFuZ3VsYXIvY2RrL2JpZGknO1xuaW1wb3J0IHsgQ29tcG9uZW50UG9ydGFsIH0gZnJvbSAnQGFuZ3VsYXIvY2RrL3BvcnRhbCc7XG5pbXBvcnQgeyBPdmVybGF5LCBPdmVybGF5UmVmIH0gZnJvbSAnQGFuZ3VsYXIvY2RrL292ZXJsYXknO1xuaW1wb3J0IHsgQ2RrQ29sdW1uRGVmLCBfQ29hbGVzY2VkU3R5bGVTY2hlZHVsZXIgfSBmcm9tICdAYW5ndWxhci9jZGsvdGFibGUnO1xuaW1wb3J0IHsgbWVyZ2UsIFN1YmplY3QgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IGZpbHRlciwgdGFrZVVudGlsIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG5pbXBvcnQgeyBIRUFERVJfUk9XX1NFTEVDVE9SIH0gZnJvbSAnLi9zZWxlY3RvcnMnO1xuaW1wb3J0IHsgUmVzaXplT3ZlcmxheUhhbmRsZSB9IGZyb20gJy4vb3ZlcmxheS1oYW5kbGUnO1xuaW1wb3J0IHsgQ29sdW1uUmVzaXplIH0gZnJvbSAnLi9jb2x1bW4tcmVzaXplJztcbmltcG9ydCB7IENvbHVtblNpemVBY3Rpb24sIENvbHVtblJlc2l6ZU5vdGlmaWVyU291cmNlIH0gZnJvbSAnLi9jb2x1bW4tcmVzaXplLW5vdGlmaWVyJztcbmltcG9ydCB7IEhlYWRlclJvd0V2ZW50RGlzcGF0Y2hlciB9IGZyb20gJy4vZXZlbnQtZGlzcGF0Y2hlcic7XG5pbXBvcnQgeyBSZXNpemVSZWYgfSBmcm9tICcuL3Jlc2l6ZS1yZWYnO1xuaW1wb3J0IHsgUmVzaXplU3RyYXRlZ3kgfSBmcm9tICcuL3Jlc2l6ZS1zdHJhdGVneSc7XG5pbXBvcnQgeyBjbG9zZXN0IH0gZnJvbSAnLi9wb2x5ZmlsbCc7XG5cbmNvbnN0IE9WRVJMQVlfQUNUSVZFX0NMQVNTID0gJ2Nkay1yZXNpemFibGUtb3ZlcmxheS10aHVtYi1hY3RpdmUnO1xuXG4vKipcbiAqIEJhc2UgY2xhc3MgZm9yIFJlc2l6YWJsZSBkaXJlY3RpdmVzIHdoaWNoIGFyZSBhcHBsaWVkIHRvIGNvbHVtbiBoZWFkZXJzIHRvIG1ha2UgdGhvc2UgY29sdW1uc1xuICogcmVzaXphYmxlLlxuICovXG5ARGlyZWN0aXZlKClcbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBSZXNpemFibGU8SGFuZGxlQ29tcG9uZW50IGV4dGVuZHMgUmVzaXplT3ZlcmxheUhhbmRsZT5cbiAgaW1wbGVtZW50cyBBZnRlclZpZXdJbml0LCBPbkRlc3Ryb3kge1xuICBwcm90ZWN0ZWQgaXNSZXNpemFibGUgPSB0cnVlO1xuXG4gIHByb3RlY3RlZCBtaW5XaWR0aFB4SW50ZXJuYWw6IG51bWJlciA9IDA7XG4gIHByb3RlY3RlZCBtYXhXaWR0aFB4SW50ZXJuYWw6IG51bWJlciA9IE51bWJlci5NQVhfU0FGRV9JTlRFR0VSO1xuXG4gIHByb3RlY3RlZCBpbmxpbmVIYW5kbGU/OiBIVE1MRWxlbWVudDtcbiAgcHJvdGVjdGVkIG92ZXJsYXlSZWY/OiBPdmVybGF5UmVmO1xuICBwcm90ZWN0ZWQgcmVhZG9ubHkgZGVzdHJveWVkID0gbmV3IFN1YmplY3Q8dm9pZD4oKTtcblxuICBwcm90ZWN0ZWQgYWJzdHJhY3QgcmVhZG9ubHkgY29sdW1uRGVmOiBDZGtDb2x1bW5EZWY7XG4gIHByb3RlY3RlZCBhYnN0cmFjdCByZWFkb25seSBjb2x1bW5SZXNpemU6IENvbHVtblJlc2l6ZTtcbiAgcHJvdGVjdGVkIGFic3RyYWN0IHJlYWRvbmx5IGRpcmVjdGlvbmFsaXR5OiBEaXJlY3Rpb25hbGl0eTtcbiAgcHJvdGVjdGVkIGFic3RyYWN0IHJlYWRvbmx5IGRvY3VtZW50OiBEb2N1bWVudDtcbiAgcHJvdGVjdGVkIGFic3RyYWN0IHJlYWRvbmx5IGVsZW1lbnRSZWY6IEVsZW1lbnRSZWY7XG4gIHByb3RlY3RlZCBhYnN0cmFjdCByZWFkb25seSBldmVudERpc3BhdGNoZXI6IEhlYWRlclJvd0V2ZW50RGlzcGF0Y2hlcjtcbiAgcHJvdGVjdGVkIGFic3RyYWN0IHJlYWRvbmx5IGluamVjdG9yOiBJbmplY3RvcjtcbiAgcHJvdGVjdGVkIGFic3RyYWN0IHJlYWRvbmx5IG5nWm9uZTogTmdab25lO1xuICBwcm90ZWN0ZWQgYWJzdHJhY3QgcmVhZG9ubHkgb3ZlcmxheTogT3ZlcmxheTtcbiAgcHJvdGVjdGVkIGFic3RyYWN0IHJlYWRvbmx5IHJlc2l6ZU5vdGlmaWVyOiBDb2x1bW5SZXNpemVOb3RpZmllclNvdXJjZTtcbiAgcHJvdGVjdGVkIGFic3RyYWN0IHJlYWRvbmx5IHJlc2l6ZVN0cmF0ZWd5OiBSZXNpemVTdHJhdGVneTtcbiAgcHJvdGVjdGVkIGFic3RyYWN0IHJlYWRvbmx5IHN0eWxlU2NoZWR1bGVyOiBfQ29hbGVzY2VkU3R5bGVTY2hlZHVsZXI7XG4gIHByb3RlY3RlZCBhYnN0cmFjdCByZWFkb25seSB2aWV3Q29udGFpbmVyUmVmOiBWaWV3Q29udGFpbmVyUmVmO1xuICBwcm90ZWN0ZWQgYWJzdHJhY3QgcmVhZG9ubHkgY2hhbmdlRGV0ZWN0b3JSZWY6IENoYW5nZURldGVjdG9yUmVmO1xuXG4gIHByaXZhdGUgX3ZpZXdJbml0aWFsaXplZCA9IGZhbHNlO1xuXG4gIC8qKiBUaGUgbWluaW11bSB3aWR0aCB0byBhbGxvdyB0aGUgY29sdW1uIHRvIGJlIHNpemVkIHRvLiAqL1xuICBnZXQgbWluV2lkdGhQeCgpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLm1pbldpZHRoUHhJbnRlcm5hbDtcbiAgfVxuICBzZXQgbWluV2lkdGhQeCh2YWx1ZTogbnVtYmVyKSB7XG4gICAgaWYgKHZhbHVlKSB7XG4gICAgICB0aGlzLm1pbldpZHRoUHhJbnRlcm5hbCA9IHZhbHVlO1xuICAgIH1cblxuICAgIHRoaXMuY29sdW1uUmVzaXplLnNldFJlc2l6ZWQoKTtcbiAgICBpZiAodGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQgJiYgdGhpcy5fdmlld0luaXRpYWxpemVkKSB7XG4gICAgICB0aGlzLl9hcHBseU1pbldpZHRoUHgoKTtcbiAgICB9XG4gIH1cblxuICAvKiogVGhlIG1heGltdW0gd2lkdGggdG8gYWxsb3cgdGhlIGNvbHVtbiB0byBiZSBzaXplZCB0by4gKi9cbiAgZ2V0IG1heFdpZHRoUHgoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5tYXhXaWR0aFB4SW50ZXJuYWw7XG4gIH1cbiAgc2V0IG1heFdpZHRoUHgodmFsdWU6IG51bWJlcikge1xuICAgIGlmICh2YWx1ZSkge1xuICAgICAgdGhpcy5tYXhXaWR0aFB4SW50ZXJuYWwgPSB2YWx1ZTtcbiAgICB9XG5cbiAgICB0aGlzLmNvbHVtblJlc2l6ZS5zZXRSZXNpemVkKCk7XG4gICAgaWYgKHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50ICYmIHRoaXMuX3ZpZXdJbml0aWFsaXplZCkge1xuICAgICAgdGhpcy5fYXBwbHlNYXhXaWR0aFB4KCk7XG4gICAgfVxuICB9XG5cbiAgbmdBZnRlclZpZXdJbml0KCkge1xuICAgIGlmICh0aGlzLmlzUmVzaXphYmxlKSB7XG4gICAgICB0aGlzLl9saXN0ZW5Gb3JSb3dIb3ZlckV2ZW50cygpO1xuICAgICAgdGhpcy5fbGlzdGVuRm9yUmVzaXplRXZlbnRzKCk7XG4gICAgICB0aGlzLl9hcHBlbmRJbmxpbmVIYW5kbGUoKTtcblxuICAgICAgdGhpcy5zdHlsZVNjaGVkdWxlci5zY2hlZHVsZUVuZCgoKSA9PiB7XG4gICAgICAgIHRoaXMuX3ZpZXdJbml0aWFsaXplZCA9IHRydWU7XG4gICAgICAgIHRoaXMuX2FwcGx5TWluV2lkdGhQeCgpO1xuICAgICAgICB0aGlzLl9hcHBseU1heFdpZHRoUHgoKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIG5nT25EZXN0cm95KCk6IHZvaWQge1xuICAgIHRoaXMuZGVzdHJveWVkLm5leHQoKTtcbiAgICB0aGlzLmRlc3Ryb3llZC5jb21wbGV0ZSgpO1xuXG4gICAgaWYgKHRoaXMuaW5saW5lSGFuZGxlKSB7XG4gICAgICB0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudCEucmVtb3ZlQ2hpbGQodGhpcy5pbmxpbmVIYW5kbGUpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLm92ZXJsYXlSZWYpIHtcbiAgICAgIHRoaXMub3ZlcmxheVJlZi5kaXNwb3NlKCk7XG4gICAgfVxuICB9XG5cbiAgcHJvdGVjdGVkIGFic3RyYWN0IGdldElubGluZUhhbmRsZUNzc0NsYXNzTmFtZSgpOiBzdHJpbmc7XG5cbiAgcHJvdGVjdGVkIGFic3RyYWN0IGdldE92ZXJsYXlIYW5kbGVDb21wb25lbnRUeXBlKCk6IFR5cGU8SGFuZGxlQ29tcG9uZW50PjtcblxuICBwcml2YXRlIF9jcmVhdGVPdmVybGF5Rm9ySGFuZGxlKCk6IE92ZXJsYXlSZWYge1xuICAgIC8vIFVzZSBvZiBvdmVybGF5cyBhbGxvd3MgdXMgdG8gcHJvcGVybHkgY2FwdHVyZSBjbGljayBldmVudHMgc3Bhbm5pbmcgcGFydHNcbiAgICAvLyBvZiB0d28gdGFibGUgY2VsbHMgYW5kIGlzIGFsc28gdXNlZnVsIGZvciBkaXNwbGF5aW5nIGEgcmVzaXplIHRodW1iXG4gICAgLy8gb3ZlciBib3RoIGNlbGxzIGFuZCBleHRlbmRpbmcgaXQgZG93biB0aGUgdGFibGUgYXMgbmVlZGVkLlxuXG4gICAgY29uc3QgaXNSdGwgPSB0aGlzLmRpcmVjdGlvbmFsaXR5LnZhbHVlID09PSAncnRsJztcbiAgICBjb25zdCBwb3NpdGlvblN0cmF0ZWd5ID0gdGhpcy5vdmVybGF5XG4gICAgICAucG9zaXRpb24oKVxuICAgICAgLmZsZXhpYmxlQ29ubmVjdGVkVG8odGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQhKVxuICAgICAgLndpdGhGbGV4aWJsZURpbWVuc2lvbnMoZmFsc2UpXG4gICAgICAud2l0aEdyb3dBZnRlck9wZW4oZmFsc2UpXG4gICAgICAud2l0aFB1c2goZmFsc2UpXG4gICAgICAud2l0aERlZmF1bHRPZmZzZXRYKGlzUnRsID8gMSA6IDApXG4gICAgICAud2l0aFBvc2l0aW9ucyhbXG4gICAgICAgIHtcbiAgICAgICAgICBvcmlnaW5YOiBpc1J0bCA/ICdzdGFydCcgOiAnZW5kJyxcbiAgICAgICAgICBvcmlnaW5ZOiAndG9wJyxcbiAgICAgICAgICBvdmVybGF5WDogJ2NlbnRlcicsXG4gICAgICAgICAgb3ZlcmxheVk6ICd0b3AnLFxuICAgICAgICB9LFxuICAgICAgXSk7XG5cbiAgICByZXR1cm4gdGhpcy5vdmVybGF5LmNyZWF0ZSh7XG4gICAgICAvLyBBbHdheXMgcG9zaXRpb24gdGhlIG92ZXJsYXkgYmFzZWQgb24gbGVmdC1pbmRleGVkIGNvb3JkaW5hdGVzLlxuICAgICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICAgIGRpc3Bvc2VPbk5hdmlnYXRpb246IHRydWUsXG4gICAgICBwb3NpdGlvblN0cmF0ZWd5LFxuICAgICAgc2Nyb2xsU3RyYXRlZ3k6IHRoaXMub3ZlcmxheS5zY3JvbGxTdHJhdGVnaWVzLnJlcG9zaXRpb24oKSxcbiAgICAgIHdpZHRoOiAnMTZweCcsXG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIF9saXN0ZW5Gb3JSb3dIb3ZlckV2ZW50cygpOiB2b2lkIHtcbiAgICBjb25zdCBlbGVtZW50ID0gdGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQhO1xuICAgIGNvbnN0IHRha2VVbnRpbERlc3Ryb3llZCA9IHRha2VVbnRpbDxib29sZWFuPih0aGlzLmRlc3Ryb3llZCk7XG5cbiAgICB0aGlzLmV2ZW50RGlzcGF0Y2hlclxuICAgICAgLnJlc2l6ZU92ZXJsYXlWaXNpYmxlRm9ySGVhZGVyUm93KGNsb3Nlc3QoZWxlbWVudCwgSEVBREVSX1JPV19TRUxFQ1RPUikhKVxuICAgICAgLnBpcGUodGFrZVVudGlsRGVzdHJveWVkKVxuICAgICAgLnN1YnNjcmliZShob3ZlcmluZ1JvdyA9PiB7XG4gICAgICAgIGlmIChob3ZlcmluZ1Jvdykge1xuICAgICAgICAgIGlmICghdGhpcy5vdmVybGF5UmVmKSB7XG4gICAgICAgICAgICB0aGlzLm92ZXJsYXlSZWYgPSB0aGlzLl9jcmVhdGVPdmVybGF5Rm9ySGFuZGxlKCk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdGhpcy5fc2hvd0hhbmRsZU92ZXJsYXkoKTtcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLm92ZXJsYXlSZWYpIHtcbiAgICAgICAgICAvLyB0b2RvIC0gY2FuJ3QgZGV0YWNoIGR1cmluZyBhbiBhY3RpdmUgcmVzaXplIC0gbmVlZCB0byB3b3JrIHRoYXQgb3V0XG4gICAgICAgICAgdGhpcy5vdmVybGF5UmVmLmRldGFjaCgpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgX2xpc3RlbkZvclJlc2l6ZUV2ZW50cygpIHtcbiAgICBjb25zdCB0YWtlVW50aWxEZXN0cm95ZWQgPSB0YWtlVW50aWw8Q29sdW1uU2l6ZUFjdGlvbj4odGhpcy5kZXN0cm95ZWQpO1xuXG4gICAgbWVyZ2UodGhpcy5yZXNpemVOb3RpZmllci5yZXNpemVDYW5jZWxlZCwgdGhpcy5yZXNpemVOb3RpZmllci50cmlnZ2VyUmVzaXplKVxuICAgICAgLnBpcGUoXG4gICAgICAgIHRha2VVbnRpbERlc3Ryb3llZCxcbiAgICAgICAgZmlsdGVyKGNvbHVtblNpemUgPT4gY29sdW1uU2l6ZS5jb2x1bW5JZCA9PT0gdGhpcy5jb2x1bW5EZWYubmFtZSlcbiAgICAgIClcbiAgICAgIC5zdWJzY3JpYmUoKHsgc2l6ZSwgcHJldmlvdXNTaXplLCBjb21wbGV0ZUltbWVkaWF0ZWx5IH0pID0+IHtcbiAgICAgICAgdGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQhLmNsYXNzTGlzdC5hZGQoT1ZFUkxBWV9BQ1RJVkVfQ0xBU1MpO1xuICAgICAgICB0aGlzLl9hcHBseVNpemUoc2l6ZSwgcHJldmlvdXNTaXplKTtcblxuICAgICAgICBpZiAoY29tcGxldGVJbW1lZGlhdGVseSkge1xuICAgICAgICAgIHRoaXMuX2NvbXBsZXRlUmVzaXplT3BlcmF0aW9uKCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgbWVyZ2UodGhpcy5yZXNpemVOb3RpZmllci5yZXNpemVDYW5jZWxlZCwgdGhpcy5yZXNpemVOb3RpZmllci5yZXNpemVDb21wbGV0ZWQpXG4gICAgICAucGlwZSh0YWtlVW50aWxEZXN0cm95ZWQpXG4gICAgICAuc3Vic2NyaWJlKGNvbHVtblNpemUgPT4ge1xuICAgICAgICB0aGlzLl9jbGVhblVwQWZ0ZXJSZXNpemUoY29sdW1uU2l6ZSk7XG4gICAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgX2NvbXBsZXRlUmVzaXplT3BlcmF0aW9uKCk6IHZvaWQge1xuICAgIHRoaXMubmdab25lLnJ1bigoKSA9PiB7XG4gICAgICB0aGlzLnJlc2l6ZU5vdGlmaWVyLnJlc2l6ZUNvbXBsZXRlZC5uZXh0KHtcbiAgICAgICAgY29sdW1uSWQ6IHRoaXMuY29sdW1uRGVmLm5hbWUsXG4gICAgICAgIHNpemU6IHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50IS5vZmZzZXRXaWR0aCxcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBfY2xlYW5VcEFmdGVyUmVzaXplKGNvbHVtblNpemU6IENvbHVtblNpemVBY3Rpb24pOiB2b2lkIHtcbiAgICB0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudCEuY2xhc3NMaXN0LnJlbW92ZShPVkVSTEFZX0FDVElWRV9DTEFTUyk7XG5cbiAgICBpZiAodGhpcy5vdmVybGF5UmVmICYmIHRoaXMub3ZlcmxheVJlZi5oYXNBdHRhY2hlZCgpKSB7XG4gICAgICB0aGlzLl91cGRhdGVPdmVybGF5SGFuZGxlSGVpZ2h0KCk7XG4gICAgICB0aGlzLm92ZXJsYXlSZWYudXBkYXRlUG9zaXRpb24oKTtcblxuICAgICAgaWYgKGNvbHVtblNpemUuY29sdW1uSWQgPT09IHRoaXMuY29sdW1uRGVmLm5hbWUpIHtcbiAgICAgICAgdGhpcy5pbmxpbmVIYW5kbGUhLmZvY3VzKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBfY3JlYXRlSGFuZGxlUG9ydGFsKCk6IENvbXBvbmVudFBvcnRhbDxIYW5kbGVDb21wb25lbnQ+IHtcbiAgICBjb25zdCBpbmplY3RvciA9IEluamVjdG9yLmNyZWF0ZSh7XG4gICAgICBwYXJlbnQ6IHRoaXMuaW5qZWN0b3IsXG4gICAgICBwcm92aWRlcnM6IFtcbiAgICAgICAge1xuICAgICAgICAgIHByb3ZpZGU6IFJlc2l6ZVJlZixcbiAgICAgICAgICB1c2VWYWx1ZTogbmV3IFJlc2l6ZVJlZihcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudFJlZixcbiAgICAgICAgICAgIHRoaXMub3ZlcmxheVJlZiEsXG4gICAgICAgICAgICB0aGlzLm1pbldpZHRoUHgsXG4gICAgICAgICAgICB0aGlzLm1heFdpZHRoUHhcbiAgICAgICAgICApLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9KTtcblxuICAgIHJldHVybiBuZXcgQ29tcG9uZW50UG9ydGFsKFxuICAgICAgdGhpcy5nZXRPdmVybGF5SGFuZGxlQ29tcG9uZW50VHlwZSgpLFxuICAgICAgdGhpcy52aWV3Q29udGFpbmVyUmVmLFxuICAgICAgaW5qZWN0b3JcbiAgICApO1xuICB9XG5cbiAgcHJpdmF0ZSBfc2hvd0hhbmRsZU92ZXJsYXkoKTogdm9pZCB7XG4gICAgdGhpcy5fdXBkYXRlT3ZlcmxheUhhbmRsZUhlaWdodCgpO1xuICAgIHRoaXMub3ZlcmxheVJlZiEuYXR0YWNoKHRoaXMuX2NyZWF0ZUhhbmRsZVBvcnRhbCgpKTtcblxuICAgIC8vIE5lZWRlZCB0byBlbnN1cmUgdGhhdCBhbGwgb2YgdGhlIGxpZmVjeWNsZSBob29rcyBpbnNpZGUgdGhlIG92ZXJsYXkgcnVuIGltbWVkaWF0ZWx5LlxuICAgIHRoaXMuY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCk7XG4gIH1cblxuICBwcml2YXRlIF91cGRhdGVPdmVybGF5SGFuZGxlSGVpZ2h0KCkge1xuICAgIHRoaXMub3ZlcmxheVJlZiEudXBkYXRlU2l6ZSh7IGhlaWdodDogdGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQhLm9mZnNldEhlaWdodCB9KTtcbiAgfVxuXG4gIHByaXZhdGUgX2FwcGx5U2l6ZShzaXplSW5QaXhlbHM6IG51bWJlciwgcHJldmlvdXNTaXplPzogbnVtYmVyKTogdm9pZCB7XG4gICAgY29uc3Qgc2l6ZVRvQXBwbHkgPSBNYXRoLm1pbihNYXRoLm1heChzaXplSW5QaXhlbHMsIHRoaXMubWluV2lkdGhQeCwgMCksIHRoaXMubWF4V2lkdGhQeCk7XG5cbiAgICB0aGlzLnJlc2l6ZVN0cmF0ZWd5LmFwcGx5Q29sdW1uU2l6ZShcbiAgICAgIHRoaXMuY29sdW1uRGVmLmNzc0NsYXNzRnJpZW5kbHlOYW1lLFxuICAgICAgdGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQhLFxuICAgICAgc2l6ZVRvQXBwbHksXG4gICAgICBwcmV2aW91c1NpemVcbiAgICApO1xuICB9XG5cbiAgcHJpdmF0ZSBfYXBwbHlNaW5XaWR0aFB4KCk6IHZvaWQge1xuICAgIHRoaXMucmVzaXplU3RyYXRlZ3kuYXBwbHlNaW5Db2x1bW5TaXplKFxuICAgICAgdGhpcy5jb2x1bW5EZWYuY3NzQ2xhc3NGcmllbmRseU5hbWUsXG4gICAgICB0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudCxcbiAgICAgIHRoaXMubWluV2lkdGhQeFxuICAgICk7XG4gIH1cblxuICBwcml2YXRlIF9hcHBseU1heFdpZHRoUHgoKTogdm9pZCB7XG4gICAgdGhpcy5yZXNpemVTdHJhdGVneS5hcHBseU1heENvbHVtblNpemUoXG4gICAgICB0aGlzLmNvbHVtbkRlZi5jc3NDbGFzc0ZyaWVuZGx5TmFtZSxcbiAgICAgIHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LFxuICAgICAgdGhpcy5tYXhXaWR0aFB4XG4gICAgKTtcbiAgfVxuXG4gIHByaXZhdGUgX2FwcGVuZElubGluZUhhbmRsZSgpOiB2b2lkIHtcbiAgICB0aGlzLnN0eWxlU2NoZWR1bGVyLnNjaGVkdWxlKCgpID0+IHtcbiAgICAgIHRoaXMuaW5saW5lSGFuZGxlID0gdGhpcy5kb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgIHRoaXMuaW5saW5lSGFuZGxlLnRhYkluZGV4ID0gMDtcbiAgICAgIHRoaXMuaW5saW5lSGFuZGxlLmNsYXNzTmFtZSA9IHRoaXMuZ2V0SW5saW5lSGFuZGxlQ3NzQ2xhc3NOYW1lKCk7XG5cbiAgICAgIC8vIFRPRE86IEFwcGx5IGNvcnJlY3QgYXJpYSByb2xlIChwcm9iYWJseSBzbGlkZXIpIGFmdGVyIGExMXkgc3BlYyBxdWVzdGlvbnMgcmVzb2x2ZWQuXG5cbiAgICAgIHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50IS5hcHBlbmRDaGlsZCh0aGlzLmlubGluZUhhbmRsZSk7XG4gICAgfSk7XG4gIH1cbn1cbiJdfQ==