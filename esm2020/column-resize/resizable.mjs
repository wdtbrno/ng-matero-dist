import { Directive, Injector, } from '@angular/core';
import { ComponentPortal } from '@angular/cdk/portal';
import { merge, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { HEADER_ROW_SELECTOR } from './selectors';
import { ResizeRef } from './resize-ref';
import { closest } from './polyfill';
import * as i0 from "@angular/core";
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
/** @nocollapse */ Resizable.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: Resizable, deps: [], target: i0.ɵɵFactoryTarget.Directive });
/** @nocollapse */ Resizable.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.2.1", type: Resizable, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: Resizable, decorators: [{
            type: Directive
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVzaXphYmxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vcHJvamVjdHMvZXh0ZW5zaW9ucy9jb2x1bW4tcmVzaXplL3Jlc2l6YWJsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBRUwsU0FBUyxFQUVULFFBQVEsR0FNVCxNQUFNLGVBQWUsQ0FBQztBQUV2QixPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0scUJBQXFCLENBQUM7QUFHdEQsT0FBTyxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDdEMsT0FBTyxFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUVuRCxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSxhQUFhLENBQUM7QUFLbEQsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLGNBQWMsQ0FBQztBQUV6QyxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sWUFBWSxDQUFDOztBQUVyQyxNQUFNLG9CQUFvQixHQUFHLG9DQUFvQyxDQUFDO0FBRWxFOzs7R0FHRztBQUVILE1BQU0sT0FBZ0IsU0FBUztJQUQvQjtRQUdZLGdCQUFXLEdBQUcsSUFBSSxDQUFDO1FBRW5CLHVCQUFrQixHQUFXLENBQUMsQ0FBQztRQUMvQix1QkFBa0IsR0FBVyxNQUFNLENBQUMsZ0JBQWdCLENBQUM7UUFJNUMsY0FBUyxHQUFHLElBQUksT0FBTyxFQUFRLENBQUM7UUFpQjNDLHFCQUFnQixHQUFHLEtBQUssQ0FBQztLQTJPbEM7SUF6T0MsNERBQTREO0lBQzVELElBQUksVUFBVTtRQUNaLE9BQU8sSUFBSSxDQUFDLGtCQUFrQixDQUFDO0lBQ2pDLENBQUM7SUFDRCxJQUFJLFVBQVUsQ0FBQyxLQUFhO1FBQzFCLElBQUksS0FBSyxFQUFFO1lBQ1QsSUFBSSxDQUFDLGtCQUFrQixHQUFHLEtBQUssQ0FBQztTQUNqQztRQUVELElBQUksQ0FBQyxZQUFZLENBQUMsVUFB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XG4gIERpcmVjdGl2ZSxcbiAgRWxlbWVudFJlZixcbiAgSW5qZWN0b3IsXG4gIE5nWm9uZSxcbiAgT25EZXN0cm95LFxuICBUeXBlLFxuICBWaWV3Q29udGFpbmVyUmVmLFxuICBDaGFuZ2VEZXRlY3RvclJlZixcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBEaXJlY3Rpb25hbGl0eSB9IGZyb20gJ0Bhbmd1bGFyL2Nkay9iaWRpJztcbmltcG9ydCB7IENvbXBvbmVudFBvcnRhbCB9IGZyb20gJ0Bhbmd1bGFyL2Nkay9wb3J0YWwnO1xuaW1wb3J0IHsgT3ZlcmxheSwgT3ZlcmxheVJlZiB9IGZyb20gJ0Bhbmd1bGFyL2Nkay9vdmVybGF5JztcbmltcG9ydCB7IENka0NvbHVtbkRlZiwgX0NvYWxlc2NlZFN0eWxlU2NoZWR1bGVyIH0gZnJvbSAnQGFuZ3VsYXIvY2RrL3RhYmxlJztcbmltcG9ydCB7IG1lcmdlLCBTdWJqZWN0IH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBmaWx0ZXIsIHRha2VVbnRpbCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcblxuaW1wb3J0IHsgSEVBREVSX1JPV19TRUxFQ1RPUiB9IGZyb20gJy4vc2VsZWN0b3JzJztcbmltcG9ydCB7IFJlc2l6ZU92ZXJsYXlIYW5kbGUgfSBmcm9tICcuL292ZXJsYXktaGFuZGxlJztcbmltcG9ydCB7IENvbHVtblJlc2l6ZSB9IGZyb20gJy4vY29sdW1uLXJlc2l6ZSc7XG5pbXBvcnQgeyBDb2x1bW5TaXplQWN0aW9uLCBDb2x1bW5SZXNpemVOb3RpZmllclNvdXJjZSB9IGZyb20gJy4vY29sdW1uLXJlc2l6ZS1ub3RpZmllcic7XG5pbXBvcnQgeyBIZWFkZXJSb3dFdmVudERpc3BhdGNoZXIgfSBmcm9tICcuL2V2ZW50LWRpc3BhdGNoZXInO1xuaW1wb3J0IHsgUmVzaXplUmVmIH0gZnJvbSAnLi9yZXNpemUtcmVmJztcbmltcG9ydCB7IFJlc2l6ZVN0cmF0ZWd5IH0gZnJvbSAnLi9yZXNpemUtc3RyYXRlZ3knO1xuaW1wb3J0IHsgY2xvc2VzdCB9IGZyb20gJy4vcG9seWZpbGwnO1xuXG5jb25zdCBPVkVSTEFZX0FDVElWRV9DTEFTUyA9ICdjZGstcmVzaXphYmxlLW92ZXJsYXktdGh1bWItYWN0aXZlJztcblxuLyoqXG4gKiBCYXNlIGNsYXNzIGZvciBSZXNpemFibGUgZGlyZWN0aXZlcyB3aGljaCBhcmUgYXBwbGllZCB0byBjb2x1bW4gaGVhZGVycyB0byBtYWtlIHRob3NlIGNvbHVtbnNcbiAqIHJlc2l6YWJsZS5cbiAqL1xuQERpcmVjdGl2ZSgpXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgUmVzaXphYmxlPEhhbmRsZUNvbXBvbmVudCBleHRlbmRzIFJlc2l6ZU92ZXJsYXlIYW5kbGU+XG4gIGltcGxlbWVudHMgQWZ0ZXJWaWV3SW5pdCwgT25EZXN0cm95IHtcbiAgcHJvdGVjdGVkIGlzUmVzaXphYmxlID0gdHJ1ZTtcblxuICBwcm90ZWN0ZWQgbWluV2lkdGhQeEludGVybmFsOiBudW1iZXIgPSAwO1xuICBwcm90ZWN0ZWQgbWF4V2lkdGhQeEludGVybmFsOiBudW1iZXIgPSBOdW1iZXIuTUFYX1NBRkVfSU5URUdFUjtcblxuICBwcm90ZWN0ZWQgaW5saW5lSGFuZGxlPzogSFRNTEVsZW1lbnQ7XG4gIHByb3RlY3RlZCBvdmVybGF5UmVmPzogT3ZlcmxheVJlZjtcbiAgcHJvdGVjdGVkIHJlYWRvbmx5IGRlc3Ryb3llZCA9IG5ldyBTdWJqZWN0PHZvaWQ+KCk7XG5cbiAgcHJvdGVjdGVkIGFic3RyYWN0IHJlYWRvbmx5IGNvbHVtbkRlZjogQ2RrQ29sdW1uRGVmO1xuICBwcm90ZWN0ZWQgYWJzdHJhY3QgcmVhZG9ubHkgY29sdW1uUmVzaXplOiBDb2x1bW5SZXNpemU7XG4gIHByb3RlY3RlZCBhYnN0cmFjdCByZWFkb25seSBkaXJlY3Rpb25hbGl0eTogRGlyZWN0aW9uYWxpdHk7XG4gIHByb3RlY3RlZCBhYnN0cmFjdCByZWFkb25seSBkb2N1bWVudDogRG9jdW1lbnQ7XG4gIHByb3RlY3RlZCBhYnN0cmFjdCByZWFkb25seSBlbGVtZW50UmVmOiBFbGVtZW50UmVmO1xuICBwcm90ZWN0ZWQgYWJzdHJhY3QgcmVhZG9ubHkgZXZlbnREaXNwYXRjaGVyOiBIZWFkZXJSb3dFdmVudERpc3BhdGNoZXI7XG4gIHByb3RlY3RlZCBhYnN0cmFjdCByZWFkb25seSBpbmplY3RvcjogSW5qZWN0b3I7XG4gIHByb3RlY3RlZCBhYnN0cmFjdCByZWFkb25seSBuZ1pvbmU6IE5nWm9uZTtcbiAgcHJvdGVjdGVkIGFic3RyYWN0IHJlYWRvbmx5IG92ZXJsYXk6IE92ZXJsYXk7XG4gIHByb3RlY3RlZCBhYnN0cmFjdCByZWFkb25seSByZXNpemVOb3RpZmllcjogQ29sdW1uUmVzaXplTm90aWZpZXJTb3VyY2U7XG4gIHByb3RlY3RlZCBhYnN0cmFjdCByZWFkb25seSByZXNpemVTdHJhdGVneTogUmVzaXplU3RyYXRlZ3k7XG4gIHByb3RlY3RlZCBhYnN0cmFjdCByZWFkb25seSBzdHlsZVNjaGVkdWxlcjogX0NvYWxlc2NlZFN0eWxlU2NoZWR1bGVyO1xuICBwcm90ZWN0ZWQgYWJzdHJhY3QgcmVhZG9ubHkgdmlld0NvbnRhaW5lclJlZjogVmlld0NvbnRhaW5lclJlZjtcbiAgcHJvdGVjdGVkIGFic3RyYWN0IHJlYWRvbmx5IGNoYW5nZURldGVjdG9yUmVmOiBDaGFuZ2VEZXRlY3RvclJlZjtcblxuICBwcml2YXRlIF92aWV3SW5pdGlhbGl6ZWQgPSBmYWxzZTtcblxuICAvKiogVGhlIG1pbmltdW0gd2lkdGggdG8gYWxsb3cgdGhlIGNvbHVtbiB0byBiZSBzaXplZCB0by4gKi9cbiAgZ2V0IG1pbldpZHRoUHgoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5taW5XaWR0aFB4SW50ZXJuYWw7XG4gIH1cbiAgc2V0IG1pbldpZHRoUHgodmFsdWU6IG51bWJlcikge1xuICAgIGlmICh2YWx1ZSkge1xuICAgICAgdGhpcy5taW5XaWR0aFB4SW50ZXJuYWwgPSB2YWx1ZTtcbiAgICB9XG5cbiAgICB0aGlzLmNvbHVtblJlc2l6ZS5zZXRSZXNpemVkKCk7XG4gICAgaWYgKHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50ICYmIHRoaXMuX3ZpZXdJbml0aWFsaXplZCkge1xuICAgICAgdGhpcy5fYXBwbHlNaW5XaWR0aFB4KCk7XG4gICAgfVxuICB9XG5cbiAgLyoqIFRoZSBtYXhpbXVtIHdpZHRoIHRvIGFsbG93IHRoZSBjb2x1bW4gdG8gYmUgc2l6ZWQgdG8uICovXG4gIGdldCBtYXhXaWR0aFB4KCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMubWF4V2lkdGhQeEludGVybmFsO1xuICB9XG4gIHNldCBtYXhXaWR0aFB4KHZhbHVlOiBudW1iZXIpIHtcbiAgICBpZiAodmFsdWUpIHtcbiAgICAgIHRoaXMubWF4V2lkdGhQeEludGVybmFsID0gdmFsdWU7XG4gICAgfVxuXG4gICAgdGhpcy5jb2x1bW5SZXNpemUuc2V0UmVzaXplZCgpO1xuICAgIGlmICh0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudCAmJiB0aGlzLl92aWV3SW5pdGlhbGl6ZWQpIHtcbiAgICAgIHRoaXMuX2FwcGx5TWF4V2lkdGhQeCgpO1xuICAgIH1cbiAgfVxuXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcbiAgICBpZiAodGhpcy5pc1Jlc2l6YWJsZSkge1xuICAgICAgdGhpcy5fbGlzdGVuRm9yUm93SG92ZXJFdmVudHMoKTtcbiAgICAgIHRoaXMuX2xpc3RlbkZvclJlc2l6ZUV2ZW50cygpO1xuICAgICAgdGhpcy5fYXBwZW5kSW5saW5lSGFuZGxlKCk7XG5cbiAgICAgIHRoaXMuc3R5bGVTY2hlZHVsZXIuc2NoZWR1bGVFbmQoKCkgPT4ge1xuICAgICAgICB0aGlzLl92aWV3SW5pdGlhbGl6ZWQgPSB0cnVlO1xuICAgICAgICB0aGlzLl9hcHBseU1pbldpZHRoUHgoKTtcbiAgICAgICAgdGhpcy5fYXBwbHlNYXhXaWR0aFB4KCk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBuZ09uRGVzdHJveSgpOiB2b2lkIHtcbiAgICB0aGlzLmRlc3Ryb3llZC5uZXh0KCk7XG4gICAgdGhpcy5kZXN0cm95ZWQuY29tcGxldGUoKTtcblxuICAgIGlmICh0aGlzLmlubGluZUhhbmRsZSkge1xuICAgICAgdGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQhLnJlbW92ZUNoaWxkKHRoaXMuaW5saW5lSGFuZGxlKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5vdmVybGF5UmVmKSB7XG4gICAgICB0aGlzLm92ZXJsYXlSZWYuZGlzcG9zZSgpO1xuICAgIH1cbiAgfVxuXG4gIHByb3RlY3RlZCBhYnN0cmFjdCBnZXRJbmxpbmVIYW5kbGVDc3NDbGFzc05hbWUoKTogc3RyaW5nO1xuXG4gIHByb3RlY3RlZCBhYnN0cmFjdCBnZXRPdmVybGF5SGFuZGxlQ29tcG9uZW50VHlwZSgpOiBUeXBlPEhhbmRsZUNvbXBvbmVudD47XG5cbiAgcHJpdmF0ZSBfY3JlYXRlT3ZlcmxheUZvckhhbmRsZSgpOiBPdmVybGF5UmVmIHtcbiAgICAvLyBVc2Ugb2Ygb3ZlcmxheXMgYWxsb3dzIHVzIHRvIHByb3Blcmx5IGNhcHR1cmUgY2xpY2sgZXZlbnRzIHNwYW5uaW5nIHBhcnRzXG4gICAgLy8gb2YgdHdvIHRhYmxlIGNlbGxzIGFuZCBpcyBhbHNvIHVzZWZ1bCBmb3IgZGlzcGxheWluZyBhIHJlc2l6ZSB0aHVtYlxuICAgIC8vIG92ZXIgYm90aCBjZWxscyBhbmQgZXh0ZW5kaW5nIGl0IGRvd24gdGhlIHRhYmxlIGFzIG5lZWRlZC5cblxuICAgIGNvbnN0IGlzUnRsID0gdGhpcy5kaXJlY3Rpb25hbGl0eS52YWx1ZSA9PT0gJ3J0bCc7XG4gICAgY29uc3QgcG9zaXRpb25TdHJhdGVneSA9IHRoaXMub3ZlcmxheVxuICAgICAgLnBvc2l0aW9uKClcbiAgICAgIC5mbGV4aWJsZUNvbm5lY3RlZFRvKHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50ISlcbiAgICAgIC53aXRoRmxleGlibGVEaW1lbnNpb25zKGZhbHNlKVxuICAgICAgLndpdGhHcm93QWZ0ZXJPcGVuKGZhbHNlKVxuICAgICAgLndpdGhQdXNoKGZhbHNlKVxuICAgICAgLndpdGhEZWZhdWx0T2Zmc2V0WChpc1J0bCA/IDEgOiAwKVxuICAgICAgLndpdGhQb3NpdGlvbnMoW1xuICAgICAgICB7XG4gICAgICAgICAgb3JpZ2luWDogaXNSdGwgPyAnc3RhcnQnIDogJ2VuZCcsXG4gICAgICAgICAgb3JpZ2luWTogJ3RvcCcsXG4gICAgICAgICAgb3ZlcmxheVg6ICdjZW50ZXInLFxuICAgICAgICAgIG92ZXJsYXlZOiAndG9wJyxcbiAgICAgICAgfSxcbiAgICAgIF0pO1xuXG4gICAgcmV0dXJuIHRoaXMub3ZlcmxheS5jcmVhdGUoe1xuICAgICAgLy8gQWx3YXlzIHBvc2l0aW9uIHRoZSBvdmVybGF5IGJhc2VkIG9uIGxlZnQtaW5kZXhlZCBjb29yZGluYXRlcy5cbiAgICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgICBkaXNwb3NlT25OYXZpZ2F0aW9uOiB0cnVlLFxuICAgICAgcG9zaXRpb25TdHJhdGVneSxcbiAgICAgIHNjcm9sbFN0cmF0ZWd5OiB0aGlzLm92ZXJsYXkuc2Nyb2xsU3RyYXRlZ2llcy5yZXBvc2l0aW9uKCksXG4gICAgICB3aWR0aDogJzE2cHgnLFxuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBfbGlzdGVuRm9yUm93SG92ZXJFdmVudHMoKTogdm9pZCB7XG4gICAgY29uc3QgZWxlbWVudCA9IHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50ITtcbiAgICBjb25zdCB0YWtlVW50aWxEZXN0cm95ZWQgPSB0YWtlVW50aWw8Ym9vbGVhbj4odGhpcy5kZXN0cm95ZWQpO1xuXG4gICAgdGhpcy5ldmVudERpc3BhdGNoZXJcbiAgICAgIC5yZXNpemVPdmVybGF5VmlzaWJsZUZvckhlYWRlclJvdyhjbG9zZXN0KGVsZW1lbnQsIEhFQURFUl9ST1dfU0VMRUNUT1IpISlcbiAgICAgIC5waXBlKHRha2VVbnRpbERlc3Ryb3llZClcbiAgICAgIC5zdWJzY3JpYmUoaG92ZXJpbmdSb3cgPT4ge1xuICAgICAgICBpZiAoaG92ZXJpbmdSb3cpIHtcbiAgICAgICAgICBpZiAoIXRoaXMub3ZlcmxheVJlZikge1xuICAgICAgICAgICAgdGhpcy5vdmVybGF5UmVmID0gdGhpcy5fY3JlYXRlT3ZlcmxheUZvckhhbmRsZSgpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHRoaXMuX3Nob3dIYW5kbGVPdmVybGF5KCk7XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5vdmVybGF5UmVmKSB7XG4gICAgICAgICAgLy8gdG9kbyAtIGNhbid0IGRldGFjaCBkdXJpbmcgYW4gYWN0aXZlIHJlc2l6ZSAtIG5lZWQgdG8gd29yayB0aGF0IG91dFxuICAgICAgICAgIHRoaXMub3ZlcmxheVJlZi5kZXRhY2goKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gIH1cblxuICBwcml2YXRlIF9saXN0ZW5Gb3JSZXNpemVFdmVudHMoKSB7XG4gICAgY29uc3QgdGFrZVVudGlsRGVzdHJveWVkID0gdGFrZVVudGlsPENvbHVtblNpemVBY3Rpb24+KHRoaXMuZGVzdHJveWVkKTtcblxuICAgIG1lcmdlKHRoaXMucmVzaXplTm90aWZpZXIucmVzaXplQ2FuY2VsZWQsIHRoaXMucmVzaXplTm90aWZpZXIudHJpZ2dlclJlc2l6ZSlcbiAgICAgIC5waXBlKFxuICAgICAgICB0YWtlVW50aWxEZXN0cm95ZWQsXG4gICAgICAgIGZpbHRlcihjb2x1bW5TaXplID0+IGNvbHVtblNpemUuY29sdW1uSWQgPT09IHRoaXMuY29sdW1uRGVmLm5hbWUpXG4gICAgICApXG4gICAgICAuc3Vic2NyaWJlKCh7IHNpemUsIHByZXZpb3VzU2l6ZSwgY29tcGxldGVJbW1lZGlhdGVseSB9KSA9PiB7XG4gICAgICAgIHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50IS5jbGFzc0xpc3QuYWRkKE9WRVJMQVlfQUNUSVZFX0NMQVNTKTtcbiAgICAgICAgdGhpcy5fYXBwbHlTaXplKHNpemUsIHByZXZpb3VzU2l6ZSk7XG5cbiAgICAgICAgaWYgKGNvbXBsZXRlSW1tZWRpYXRlbHkpIHtcbiAgICAgICAgICB0aGlzLl9jb21wbGV0ZVJlc2l6ZU9wZXJhdGlvbigpO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgIG1lcmdlKHRoaXMucmVzaXplTm90aWZpZXIucmVzaXplQ2FuY2VsZWQsIHRoaXMucmVzaXplTm90aWZpZXIucmVzaXplQ29tcGxldGVkKVxuICAgICAgLnBpcGUodGFrZVVudGlsRGVzdHJveWVkKVxuICAgICAgLnN1YnNjcmliZShjb2x1bW5TaXplID0+IHtcbiAgICAgICAgdGhpcy5fY2xlYW5VcEFmdGVyUmVzaXplKGNvbHVtblNpemUpO1xuICAgICAgfSk7XG4gIH1cblxuICBwcml2YXRlIF9jb21wbGV0ZVJlc2l6ZU9wZXJhdGlvbigpOiB2b2lkIHtcbiAgICB0aGlzLm5nWm9uZS5ydW4oKCkgPT4ge1xuICAgICAgdGhpcy5yZXNpemVOb3RpZmllci5yZXNpemVDb21wbGV0ZWQubmV4dCh7XG4gICAgICAgIGNvbHVtbklkOiB0aGlzLmNvbHVtbkRlZi5uYW1lLFxuICAgICAgICBzaXplOiB0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudCEub2Zmc2V0V2lkdGgsXG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgX2NsZWFuVXBBZnRlclJlc2l6ZShjb2x1bW5TaXplOiBDb2x1bW5TaXplQWN0aW9uKTogdm9pZCB7XG4gICAgdGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQhLmNsYXNzTGlzdC5yZW1vdmUoT1ZFUkxBWV9BQ1RJVkVfQ0xBU1MpO1xuXG4gICAgaWYgKHRoaXMub3ZlcmxheVJlZiAmJiB0aGlzLm92ZXJsYXlSZWYuaGFzQXR0YWNoZWQoKSkge1xuICAgICAgdGhpcy5fdXBkYXRlT3ZlcmxheUhhbmRsZUhlaWdodCgpO1xuICAgICAgdGhpcy5vdmVybGF5UmVmLnVwZGF0ZVBvc2l0aW9uKCk7XG5cbiAgICAgIGlmIChjb2x1bW5TaXplLmNvbHVtbklkID09PSB0aGlzLmNvbHVtbkRlZi5uYW1lKSB7XG4gICAgICAgIHRoaXMuaW5saW5lSGFuZGxlIS5mb2N1cygpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgX2NyZWF0ZUhhbmRsZVBvcnRhbCgpOiBDb21wb25lbnRQb3J0YWw8SGFuZGxlQ29tcG9uZW50PiB7XG4gICAgY29uc3QgaW5qZWN0b3IgPSBJbmplY3Rvci5jcmVhdGUoe1xuICAgICAgcGFyZW50OiB0aGlzLmluamVjdG9yLFxuICAgICAgcHJvdmlkZXJzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBwcm92aWRlOiBSZXNpemVSZWYsXG4gICAgICAgICAgdXNlVmFsdWU6IG5ldyBSZXNpemVSZWYoXG4gICAgICAgICAgICB0aGlzLmVsZW1lbnRSZWYsXG4gICAgICAgICAgICB0aGlzLm92ZXJsYXlSZWYhLFxuICAgICAgICAgICAgdGhpcy5taW5XaWR0aFB4LFxuICAgICAgICAgICAgdGhpcy5tYXhXaWR0aFB4XG4gICAgICAgICAgKSxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSk7XG5cbiAgICByZXR1cm4gbmV3IENvbXBvbmVudFBvcnRhbChcbiAgICAgIHRoaXMuZ2V0T3ZlcmxheUhhbmRsZUNvbXBvbmVudFR5cGUoKSxcbiAgICAgIHRoaXMudmlld0NvbnRhaW5lclJlZixcbiAgICAgIGluamVjdG9yXG4gICAgKTtcbiAgfVxuXG4gIHByaXZhdGUgX3Nob3dIYW5kbGVPdmVybGF5KCk6IHZvaWQge1xuICAgIHRoaXMuX3VwZGF0ZU92ZXJsYXlIYW5kbGVIZWlnaHQoKTtcbiAgICB0aGlzLm92ZXJsYXlSZWYhLmF0dGFjaCh0aGlzLl9jcmVhdGVIYW5kbGVQb3J0YWwoKSk7XG5cbiAgICAvLyBOZWVkZWQgdG8gZW5zdXJlIHRoYXQgYWxsIG9mIHRoZSBsaWZlY3ljbGUgaG9va3MgaW5zaWRlIHRoZSBvdmVybGF5IHJ1biBpbW1lZGlhdGVseS5cbiAgICB0aGlzLmNoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpO1xuICB9XG5cbiAgcHJpdmF0ZSBfdXBkYXRlT3ZlcmxheUhhbmRsZUhlaWdodCgpIHtcbiAgICB0aGlzLm92ZXJsYXlSZWYhLnVwZGF0ZVNpemUoeyBoZWlnaHQ6IHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50IS5vZmZzZXRIZWlnaHQgfSk7XG4gIH1cblxuICBwcml2YXRlIF9hcHBseVNpemUoc2l6ZUluUGl4ZWxzOiBudW1iZXIsIHByZXZpb3VzU2l6ZT86IG51bWJlcik6IHZvaWQge1xuICAgIGNvbnN0IHNpemVUb0FwcGx5ID0gTWF0aC5taW4oTWF0aC5tYXgoc2l6ZUluUGl4ZWxzLCB0aGlzLm1pbldpZHRoUHgsIDApLCB0aGlzLm1heFdpZHRoUHgpO1xuXG4gICAgdGhpcy5yZXNpemVTdHJhdGVneS5hcHBseUNvbHVtblNpemUoXG4gICAgICB0aGlzLmNvbHVtbkRlZi5jc3NDbGFzc0ZyaWVuZGx5TmFtZSxcbiAgICAgIHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50ISxcbiAgICAgIHNpemVUb0FwcGx5LFxuICAgICAgcHJldmlvdXNTaXplXG4gICAgKTtcbiAgfVxuXG4gIHByaXZhdGUgX2FwcGx5TWluV2lkdGhQeCgpOiB2b2lkIHtcbiAgICB0aGlzLnJlc2l6ZVN0cmF0ZWd5LmFwcGx5TWluQ29sdW1uU2l6ZShcbiAgICAgIHRoaXMuY29sdW1uRGVmLmNzc0NsYXNzRnJpZW5kbHlOYW1lLFxuICAgICAgdGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQsXG4gICAgICB0aGlzLm1pbldpZHRoUHhcbiAgICApO1xuICB9XG5cbiAgcHJpdmF0ZSBfYXBwbHlNYXhXaWR0aFB4KCk6IHZvaWQge1xuICAgIHRoaXMucmVzaXplU3RyYXRlZ3kuYXBwbHlNYXhDb2x1bW5TaXplKFxuICAgICAgdGhpcy5jb2x1bW5EZWYuY3NzQ2xhc3NGcmllbmRseU5hbWUsXG4gICAgICB0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudCxcbiAgICAgIHRoaXMubWF4V2lkdGhQeFxuICAgICk7XG4gIH1cblxuICBwcml2YXRlIF9hcHBlbmRJbmxpbmVIYW5kbGUoKTogdm9pZCB7XG4gICAgdGhpcy5zdHlsZVNjaGVkdWxlci5zY2hlZHVsZSgoKSA9PiB7XG4gICAgICB0aGlzLmlubGluZUhhbmRsZSA9IHRoaXMuZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICB0aGlzLmlubGluZUhhbmRsZS50YWJJbmRleCA9IDA7XG4gICAgICB0aGlzLmlubGluZUhhbmRsZS5jbGFzc05hbWUgPSB0aGlzLmdldElubGluZUhhbmRsZUNzc0NsYXNzTmFtZSgpO1xuXG4gICAgICAvLyBUT0RPOiBBcHBseSBjb3JyZWN0IGFyaWEgcm9sZSAocHJvYmFibHkgc2xpZGVyKSBhZnRlciBhMTF5IHNwZWMgcXVlc3Rpb25zIHJlc29sdmVkLlxuXG4gICAgICB0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudCEuYXBwZW5kQ2hpbGQodGhpcy5pbmxpbmVIYW5kbGUpO1xuICAgIH0pO1xuICB9XG59XG4iXX0=