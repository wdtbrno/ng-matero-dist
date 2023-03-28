import { isFakeMousedownFromScreenReader } from '@angular/cdk/a11y';
import { ENTER, SPACE } from '@angular/cdk/keycodes';
import { Overlay, OverlayConfig, } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { Directive, EventEmitter, Inject, InjectionToken, Input, Optional, Output, } from '@angular/core';
import { merge, of as observableOf, Subscription } from 'rxjs';
import { filter, take, takeUntil } from 'rxjs/operators';
import { MtxPopover } from './popover';
import { throwMtxPopoverMissingError } from './popover-errors';
import * as i0 from "@angular/core";
import * as i1 from "@angular/cdk/overlay";
import * as i2 from "@angular/cdk/bidi";
import * as i3 from "@angular/cdk/a11y";
/** Injection token that determines the scroll handling while the popover is open. */
export const MTX_POPOVER_SCROLL_STRATEGY = new InjectionToken('mtx-popover-scroll-strategy');
/** @docs-private */
export function MTX_POPOVER_SCROLL_STRATEGY_FACTORY(overlay) {
    return () => overlay.scrollStrategies.reposition();
}
/** @docs-private */
export const MTX_POPOVER_SCROLL_STRATEGY_FACTORY_PROVIDER = {
    provide: MTX_POPOVER_SCROLL_STRATEGY,
    deps: [Overlay],
    useFactory: MTX_POPOVER_SCROLL_STRATEGY_FACTORY,
};
/**
 * This directive is intended to be used in conjunction with an `mtx-popover` tag. It is
 * responsible for toggling the display of the provided popover instance.
 */
export class MtxPopoverTrigger {
    /** References the popover instance that the trigger is associated with. */
    get popover() {
        return this._popover;
    }
    set popover(popover) {
        if (popover === this._popover) {
            return;
        }
        this._popover = popover;
        this._popoverCloseSubscription.unsubscribe();
        if (popover) {
            this._popoverCloseSubscription = popover.closed.subscribe((reason) => {
                this._destroyPopover();
            });
        }
    }
    constructor(_overlay, _elementRef, _viewContainerRef, scrollStrategy, _dir, _changeDetectorRef, _focusMonitor) {
        this._overlay = _overlay;
        this._elementRef = _elementRef;
        this._viewContainerRef = _viewContainerRef;
        this._dir = _dir;
        this._changeDetectorRef = _changeDetectorRef;
        this._focusMonitor = _focusMonitor;
        this._overlayRef = null;
        this._popoverOpen = false;
        this._halt = false;
        this._positionSubscription = Subscription.EMPTY;
        this._popoverCloseSubscription = Subscription.EMPTY;
        this._closingActionsSubscription = Subscription.EMPTY;
        // Tracking input type is necessary so it's possible to only auto-focus
        // the first item of the list when the popover is opened via the keyboard
        this._openedBy = undefined;
        /** Event emitted when the associated popover is opened. */
        this.popoverOpened = new EventEmitter();
        /** Event emitted when the associated popover is closed. */
        this.popoverClosed = new EventEmitter();
        this._scrollStrategy = scrollStrategy;
    }
    ngAfterContentInit() {
        this._checkPopover();
        this._setCurrentConfig();
    }
    ngOnDestroy() {
        if (this._overlayRef) {
            this._overlayRef.dispose();
            this._overlayRef = null;
        }
        this._positionSubscription.unsubscribe();
        this._popoverCloseSubscription.unsubscribe();
        this._closingActionsSubscription.unsubscribe();
    }
    _setCurrentConfig() {
        if (this.triggerEvent) {
            this.popover.triggerEvent = this.triggerEvent;
        }
        this.popover.setCurrentStyles();
    }
    /** Whether the popover is open. */
    get popoverOpen() {
        return this._popoverOpen;
    }
    /** The text direction of the containing app. */
    get dir() {
        return this._dir && this._dir.value === 'rtl' ? 'rtl' : 'ltr';
    }
    /** Handles mouse click on the trigger. */
    _handleClick(event) {
        if (this.popover.triggerEvent === 'click') {
            this.togglePopover();
        }
    }
    /** Handles mouse enter on the trigger. */
    _handleMouseEnter(event) {
        this._halt = false;
        if (this.popover.triggerEvent === 'hover') {
            this._mouseoverTimer = setTimeout(() => {
                this.openPopover();
            }, this.popover.enterDelay);
        }
    }
    /** Handles mouse leave on the trigger. */
    _handleMouseLeave(event) {
        if (this.popover.triggerEvent === 'hover') {
            if (this._mouseoverTimer) {
                clearTimeout(this._mouseoverTimer);
                this._mouseoverTimer = null;
            }
            if (this._popoverOpen) {
                setTimeout(() => {
                    if (!this.popover.closeDisabled) {
                        this.closePopover();
                    }
                }, this.popover.leaveDelay);
            }
            else {
                this._halt = true;
            }
        }
    }
    /** Handles mouse presses on the trigger. */
    _handleMousedown(event) {
        if (!isFakeMousedownFromScreenReader(event)) {
            // Since right or middle button clicks won't trigger the `click` event,
            // we shouldn't consider the popover as opened by mouse in those cases.
            this._openedBy = event.button === 0 ? 'mouse' : undefined;
        }
    }
    /** Handles key presses on the trigger. */
    _handleKeydown(event) {
        const keyCode = event.keyCode;
        // Pressing enter on the trigger will trigger the click handler later.
        if (keyCode === ENTER || keyCode === SPACE) {
            this._openedBy = 'keyboard';
        }
    }
    /** Toggles the popover between the open and closed states. */
    togglePopover() {
        return this._popoverOpen ? this.closePopover() : this.openPopover();
    }
    /** Opens the popover. */
    openPopover() {
        if (this._popoverOpen || this._halt) {
            return;
        }
        this._checkPopover();
        const overlayRef = this._createOverlay();
        const overlayConfig = overlayRef.getConfig();
        this._setPosition(overlayConfig.positionStrategy);
        if (this.popover.triggerEvent === 'click') {
            overlayConfig.hasBackdrop = this.popover.hasBackdrop ?? true;
        }
        overlayRef.attach(this._getPortal());
        if (this.popover.lazyContent) {
            this.popover.lazyContent.attach(this.popoverData);
        }
        this._closingActionsSubscription = this._popoverClosingActions().subscribe(() => this.closePopover());
        this._initPopover();
        if (this.popover instanceof MtxPopover) {
            this.popover._startAnimation();
        }
    }
    /** Closes the popover. */
    closePopover() {
        this.popover.closed.emit();
    }
    /**
     * Focuses the popover trigger.
     * @param origin Source of the popover trigger's focus.
     */
    focus(origin, options) {
        if (this._focusMonitor && origin) {
            this._focusMonitor.focusVia(this._elementRef, origin, options);
        }
        else {
            this._elementRef.nativeElement.focus(options);
        }
    }
    /** Removes the popover from the DOM. */
    _destroyPopover(reason) {
        if (!this._overlayRef || !this.popoverOpen) {
            return;
        }
        // Clear the timeout for hover event.
        if (this._mouseoverTimer) {
            clearTimeout(this._mouseoverTimer);
            this._mouseoverTimer = null;
        }
        const popover = this.popover;
        this._closingActionsSubscription.unsubscribe();
        this._overlayRef.detach();
        this._openedBy = undefined;
        if (popover instanceof MtxPopover) {
            popover._resetAnimation();
            if (popover.lazyContent) {
                // Wait for the exit animation to finish before detaching the content.
                popover._animationDone
                    .pipe(filter(event => event.toState === 'void'), take(1), 
                // Interrupt if the content got re-attached.
                takeUntil(popover.lazyContent._attached))
                    .subscribe({
                    next: () => popover.lazyContent.detach(),
                    // No matter whether the content got re-attached, reset the popover.
                    complete: () => this._setIsPopoverOpen(false),
                });
            }
            else {
                this._setIsPopoverOpen(false);
            }
        }
        else {
            this._setIsPopoverOpen(false);
            if (popover.lazyContent) {
                popover.lazyContent.detach();
            }
        }
    }
    /**
     * This method sets the popover state to open.
     */
    _initPopover() {
        this.popover.direction = this.dir;
        this.popover.setElevation();
        this._setIsPopoverOpen(true);
    }
    // set state rather than toggle to support triggers sharing a popover
    _setIsPopoverOpen(isOpen) {
        this._popoverOpen = isOpen;
        this._popoverOpen ? this.popoverOpened.emit() : this.popoverClosed.emit();
    }
    /**
     * This method checks that a valid instance of MdPopover has been passed into
     * `mtxPopoverTriggerFor`. If not, an exception is thrown.
     */
    _checkPopover() {
        if (!this.popover) {
            throwMtxPopoverMissingError();
        }
    }
    /**
     * This method creates the overlay from the provided popover's template and saves its
     * OverlayRef so that it can be attached to the DOM when openPopover is called.
     */
    _createOverlay() {
        if (!this._overlayRef) {
            const config = this._getOverlayConfig();
            this._subscribeToPositions(config.positionStrategy);
            this._overlayRef = this._overlay.create(config);
        }
        else {
            const overlayConfig = this._overlayRef.getConfig();
            const positionStrategy = overlayConfig.positionStrategy;
            positionStrategy.setOrigin(this._getTargetElement());
        }
        return this._overlayRef;
    }
    /**
     * This method builds the configuration object needed to create the overlay, the OverlayConfig.
     * @returns OverlayConfig
     */
    _getOverlayConfig() {
        return new OverlayConfig({
            positionStrategy: this._overlay
                .position()
                .flexibleConnectedTo(this._getTargetElement())
                .withLockedPosition()
                .withGrowAfterOpen()
                .withTransformOriginOn('.mtx-popover-panel'),
            backdropClass: this.popover.backdropClass || 'cdk-overlay-transparent-backdrop',
            panelClass: this.popover.overlayPanelClass,
            scrollStrategy: this._scrollStrategy(),
            direction: this._dir,
        });
    }
    _getTargetElement() {
        if (this.targetElement) {
            return this.targetElement.elementRef;
        }
        return this._elementRef;
    }
    /**
     * Listens to changes in the position of the overlay and sets the correct classes
     * on the popover based on the new position. This ensures the animation origin is always
     * correct, even if a fallback position is used for the overlay.
     */
    _subscribeToPositions(position) {
        this._positionSubscription = position.positionChanges.subscribe(change => {
            const posX = change.connectionPair.overlayX === 'start'
                ? 'after'
                : change.connectionPair.overlayX === 'end'
                    ? 'before'
                    : 'center';
            const posY = change.connectionPair.overlayY === 'top'
                ? 'below'
                : change.connectionPair.overlayY === 'bottom'
                    ? 'above'
                    : 'center';
            const pos = this.popover.position[0] === 'above' || this.popover.position[0] === 'below'
                ? [posY, posX]
                : [posX, posY];
            // required for ChangeDetectionStrategy.OnPush
            this._changeDetectorRef.markForCheck();
            this.popover.setCurrentStyles(pos);
            this.popover.setPositionClasses(pos);
        });
    }
    /**
     * Sets the appropriate positions on a position strategy
     * so the overlay connects with the trigger correctly.
     * @param positionStrategy Strategy whose position to update.
     */
    _setPosition(positionStrategy) {
        const [originX, origin2ndX, origin3rdX] = this.popover.position[0] === 'before' || this.popover.position[1] === 'after'
            ? ['start', 'center', 'end']
            : this.popover.position[0] === 'after' || this.popover.position[1] === 'before'
                ? ['end', 'center', 'start']
                : ['center', 'start', 'end'];
        const [originY, origin2ndY, origin3rdY] = this.popover.position[0] === 'above' || this.popover.position[1] === 'below'
            ? ['top', 'center', 'bottom']
            : this.popover.position[0] === 'below' || this.popover.position[1] === 'above'
                ? ['bottom', 'center', 'top']
                : ['center', 'top', 'bottom'];
        const [overlayX, overlayFallbackX] = this.popover.position[0] === 'below' || this.popover.position[0] === 'above'
            ? [originX, originX]
            : this.popover.position[0] === 'before'
                ? ['end', 'start']
                : ['start', 'end'];
        const [overlayY, overlayFallbackY] = this.popover.position[0] === 'before' || this.popover.position[0] === 'after'
            ? [originY, originY]
            : this.popover.position[0] === 'below'
                ? ['top', 'bottom']
                : ['bottom', 'top'];
        const originFallbackX = overlayX;
        const originFallbackY = overlayY;
        const offsetX = this.popover.xOffset && !isNaN(Number(this.popover.xOffset))
            ? Number(this.dir === 'ltr' ? this.popover.xOffset : -this.popover.xOffset)
            : 0;
        const offsetY = this.popover.yOffset && !isNaN(Number(this.popover.yOffset))
            ? Number(this.popover.yOffset)
            : 0;
        let positions = [{ originX, originY, overlayX, overlayY }];
        if (this.popover.position[0] === 'above' || this.popover.position[0] === 'below') {
            positions = [
                { originX, originY, overlayX, overlayY, offsetY },
                { originX: origin2ndX, originY, overlayX: origin2ndX, overlayY, offsetY },
                { originX: origin3rdX, originY, overlayX: origin3rdX, overlayY, offsetY },
                {
                    originX,
                    originY: originFallbackY,
                    overlayX,
                    overlayY: overlayFallbackY,
                    offsetY: -offsetY,
                },
                {
                    originX: origin2ndX,
                    originY: originFallbackY,
                    overlayX: origin2ndX,
                    overlayY: overlayFallbackY,
                    offsetY: -offsetY,
                },
                {
                    originX: origin3rdX,
                    originY: originFallbackY,
                    overlayX: origin3rdX,
                    overlayY: overlayFallbackY,
                    offsetY: -offsetY,
                },
            ];
        }
        if (this.popover.position[0] === 'before' || this.popover.position[0] === 'after') {
            positions = [
                { originX, originY, overlayX, overlayY, offsetX },
                { originX, originY: origin2ndY, overlayX, overlayY: origin2ndY, offsetX },
                { originX, originY: origin3rdY, overlayX, overlayY: origin3rdY, offsetX },
                {
                    originX: originFallbackX,
                    originY,
                    overlayX: overlayFallbackX,
                    overlayY,
                    offsetX: -offsetX,
                },
                {
                    originX: originFallbackX,
                    originY: origin2ndY,
                    overlayX: overlayFallbackX,
                    overlayY: origin2ndY,
                    offsetX: -offsetX,
                },
                {
                    originX: originFallbackX,
                    originY: origin3rdY,
                    overlayX: overlayFallbackX,
                    overlayY: origin3rdY,
                    offsetX: -offsetX,
                },
            ];
        }
        positionStrategy
            .withPositions(positions)
            .withDefaultOffsetX(offsetX)
            .withDefaultOffsetY(offsetY);
    }
    /** Returns a stream that emits whenever an action that should close the popover occurs. */
    _popoverClosingActions() {
        const backdrop = this.popover.triggerEvent === 'click' && this.popover.closeOnBackdropClick === true
            ? this._overlayRef.backdropClick()
            : observableOf();
        const detachments = this._overlayRef.detachments();
        return merge(backdrop, detachments);
    }
    /** Gets the portal that should be attached to the overlay. */
    _getPortal() {
        // Note that we can avoid this check by keeping the portal on the popover panel.
        // While it would be cleaner, we'd have to introduce another required method on
        // `MtxPopoverPanel`, making it harder to consume.
        if (!this._portal || this._portal.templateRef !== this.popover.templateRef) {
            this._portal = new TemplatePortal(this.popover.templateRef, this._viewContainerRef);
        }
        return this._portal;
    }
}
/** @nocollapse */ MtxPopoverTrigger.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MtxPopoverTrigger, deps: [{ token: i1.Overlay }, { token: i0.ElementRef }, { token: i0.ViewContainerRef }, { token: MTX_POPOVER_SCROLL_STRATEGY }, { token: i2.Directionality, optional: true }, { token: i0.ChangeDetectorRef }, { token: i3.FocusMonitor }], target: i0.ɵɵFactoryTarget.Directive });
/** @nocollapse */ MtxPopoverTrigger.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.2.1", type: MtxPopoverTrigger, selector: "[mtx-popover-trigger-for], [mtxPopoverTriggerFor]", inputs: { popover: ["mtxPopoverTriggerFor", "popover"], popoverData: ["mtxPopoverTriggerData", "popoverData"], targetElement: ["mtxPopoverTargetAt", "targetElement"], triggerEvent: ["mtxPopoverTriggerOn", "triggerEvent"] }, outputs: { popoverOpened: "popoverOpened", popoverClosed: "popoverClosed" }, host: { attributes: { "aria-haspopup": "true" }, listeners: { "click": "_handleClick($event)", "mouseenter": "_handleMouseEnter($event)", "mouseleave": "_handleMouseLeave($event)", "mousedown": "_handleMousedown($event)", "keydown": "_handleKeydown($event)" }, properties: { "attr.aria-expanded": "popoverOpen || null", "attr.aria-controls": "popoverOpen ? popover.panelId : null" } }, exportAs: ["mtxPopoverTrigger"], ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MtxPopoverTrigger, decorators: [{
            type: Directive,
            args: [{
                    selector: '[mtx-popover-trigger-for], [mtxPopoverTriggerFor]',
                    exportAs: 'mtxPopoverTrigger',
                    host: {
                        'aria-haspopup': 'true',
                        '[attr.aria-expanded]': 'popoverOpen || null',
                        '[attr.aria-controls]': 'popoverOpen ? popover.panelId : null',
                        '(click)': '_handleClick($event)',
                        '(mouseenter)': '_handleMouseEnter($event)',
                        '(mouseleave)': '_handleMouseLeave($event)',
                        '(mousedown)': '_handleMousedown($event)',
                        '(keydown)': '_handleKeydown($event)',
                    },
                }]
        }], ctorParameters: function () { return [{ type: i1.Overlay }, { type: i0.ElementRef }, { type: i0.ViewContainerRef }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [MTX_POPOVER_SCROLL_STRATEGY]
                }] }, { type: i2.Directionality, decorators: [{
                    type: Optional
                }] }, { type: i0.ChangeDetectorRef }, { type: i3.FocusMonitor }]; }, propDecorators: { popover: [{
                type: Input,
                args: ['mtxPopoverTriggerFor']
            }], popoverData: [{
                type: Input,
                args: ['mtxPopoverTriggerData']
            }], targetElement: [{
                type: Input,
                args: ['mtxPopoverTargetAt']
            }], triggerEvent: [{
                type: Input,
                args: ['mtxPopoverTriggerOn']
            }], popoverOpened: [{
                type: Output
            }], popoverClosed: [{
                type: Output
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9wb3Zlci10cmlnZ2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vcHJvamVjdHMvZXh0ZW5zaW9ucy9wb3BvdmVyL3BvcG92ZXItdHJpZ2dlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQTZCLCtCQUErQixFQUFFLE1BQU0sbUJBQW1CLENBQUM7QUFFL0YsT0FBTyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQztBQUNyRCxPQUFPLEVBSUwsT0FBTyxFQUNQLGFBQWEsR0FJZCxNQUFNLHNCQUFzQixDQUFDO0FBQzlCLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUNyRCxPQUFPLEVBR0wsU0FBUyxFQUVULFlBQVksRUFDWixNQUFNLEVBQ04sY0FBYyxFQUNkLEtBQUssRUFFTCxRQUFRLEVBQ1IsTUFBTSxHQUVQLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBRSxLQUFLLEVBQUUsRUFBRSxJQUFJLFlBQVksRUFBRSxZQUFZLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDL0QsT0FBTyxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDekQsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLFdBQVcsQ0FBQztBQUN2QyxPQUFPLEVBQUUsMkJBQTJCLEVBQUUsTUFBTSxrQkFBa0IsQ0FBQzs7Ozs7QUFVL0QscUZBQXFGO0FBQ3JGLE1BQU0sQ0FBQyxNQUFNLDJCQUEyQixHQUFHLElBQUksY0FBYyxDQUMzRCw2QkFBNkIsQ0FDOUIsQ0FBQztBQUVGLG9CQUFvQjtBQUNwQixNQUFNLFVBQVUsbUNBQW1DLENBQUMsT0FBZ0I7SUFDbEUsT0FBTyxHQUFHLEVBQUUsQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsVUFBVSxFQUFFLENBQUM7QUFDckQsQ0FBQztBQUVELG9CQUFvQjtBQUNwQixNQUFNLENBQUMs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QVcsRUFBRSx3QkFBd0I7cUJBQ3RDO2lCQUNGOzswQkF3REksTUFBTTsyQkFBQywyQkFBMkI7OzBCQUNsQyxRQUFRO3VHQXZDUCxPQUFPO3NCQURWLEtBQUs7dUJBQUMsc0JBQXNCO2dCQXFCRyxXQUFXO3NCQUExQyxLQUFLO3VCQUFDLHVCQUF1QjtnQkFHRCxhQUFhO3NCQUF6QyxLQUFLO3VCQUFDLG9CQUFvQjtnQkFHRyxZQUFZO3NCQUF6QyxLQUFLO3VCQUFDLHFCQUFxQjtnQkFHbEIsYUFBYTtzQkFBdEIsTUFBTTtnQkFHRyxhQUFhO3NCQUF0QixNQUFNIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRm9jdXNNb25pdG9yLCBGb2N1c09yaWdpbiwgaXNGYWtlTW91c2Vkb3duRnJvbVNjcmVlblJlYWRlciB9IGZyb20gJ0Bhbmd1bGFyL2Nkay9hMTF5JztcbmltcG9ydCB7IERpcmVjdGlvbiwgRGlyZWN0aW9uYWxpdHkgfSBmcm9tICdAYW5ndWxhci9jZGsvYmlkaSc7XG5pbXBvcnQgeyBFTlRFUiwgU1BBQ0UgfSBmcm9tICdAYW5ndWxhci9jZGsva2V5Y29kZXMnO1xuaW1wb3J0IHtcbiAgQ29ubmVjdGVkUG9zaXRpb24sXG4gIEZsZXhpYmxlQ29ubmVjdGVkUG9zaXRpb25TdHJhdGVneSxcbiAgSG9yaXpvbnRhbENvbm5lY3Rpb25Qb3MsXG4gIE92ZXJsYXksXG4gIE92ZXJsYXlDb25maWcsXG4gIE92ZXJsYXlSZWYsXG4gIFNjcm9sbFN0cmF0ZWd5LFxuICBWZXJ0aWNhbENvbm5lY3Rpb25Qb3MsXG59IGZyb20gJ0Bhbmd1bGFyL2Nkay9vdmVybGF5JztcbmltcG9ydCB7IFRlbXBsYXRlUG9ydGFsIH0gZnJvbSAnQGFuZ3VsYXIvY2RrL3BvcnRhbCc7XG5pbXBvcnQge1xuICBBZnRlckNvbnRlbnRJbml0LFxuICBDaGFuZ2VEZXRlY3RvclJlZixcbiAgRGlyZWN0aXZlLFxuICBFbGVtZW50UmVmLFxuICBFdmVudEVtaXR0ZXIsXG4gIEluamVjdCxcbiAgSW5qZWN0aW9uVG9rZW4sXG4gIElucHV0LFxuICBPbkRlc3Ryb3ksXG4gIE9wdGlvbmFsLFxuICBPdXRwdXQsXG4gIFZpZXdDb250YWluZXJSZWYsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgbWVyZ2UsIG9mIGFzIG9ic2VydmFibGVPZiwgU3Vic2NyaXB0aW9uIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBmaWx0ZXIsIHRha2UsIHRha2VVbnRpbCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7IE10eFBvcG92ZXIgfSBmcm9tICcuL3BvcG92ZXInO1xuaW1wb3J0IHsgdGhyb3dNdHhQb3BvdmVyTWlzc2luZ0Vycm9yIH0gZnJvbSAnLi9wb3BvdmVyLWVycm9ycyc7XG5pbXBvcnQgeyBNdHhQb3BvdmVyUGFuZWwgfSBmcm9tICcuL3BvcG92ZXItaW50ZXJmYWNlcyc7XG5pbXBvcnQgeyBNdHhQb3BvdmVyVGFyZ2V0IH0gZnJvbSAnLi9wb3BvdmVyLXRhcmdldCc7XG5pbXBvcnQge1xuICBNdHhQb3BvdmVyUG9zaXRpb24sXG4gIE10eFBvcG92ZXJQb3NpdGlvblN0YXJ0LFxuICBNdHhQb3BvdmVyVHJpZ2dlckV2ZW50LFxuICBQb3BvdmVyQ2xvc2VSZWFzb24sXG59IGZyb20gJy4vcG9wb3Zlci10eXBlcyc7XG5cbi8qKiBJbmplY3Rpb24gdG9rZW4gdGhhdCBkZXRlcm1pbmVzIHRoZSBzY3JvbGwgaGFuZGxpbmcgd2hpbGUgdGhlIHBvcG92ZXIgaXMgb3Blbi4gKi9cbmV4cG9ydCBjb25zdCBNVFhfUE9QT1ZFUl9TQ1JPTExfU1RSQVRFR1kgPSBuZXcgSW5qZWN0aW9uVG9rZW48KCkgPT4gU2Nyb2xsU3RyYXRlZ3k+KFxuICAnbXR4LXBvcG92ZXItc2Nyb2xsLXN0cmF0ZWd5J1xuKTtcblxuLyoqIEBkb2NzLXByaXZhdGUgKi9cbmV4cG9ydCBmdW5jdGlvbiBNVFhfUE9QT1ZFUl9TQ1JPTExfU1RSQVRFR1lfRkFDVE9SWShvdmVybGF5OiBPdmVybGF5KTogKCkgPT4gU2Nyb2xsU3RyYXRlZ3kge1xuICByZXR1cm4gKCkgPT4gb3ZlcmxheS5zY3JvbGxTdHJhdGVnaWVzLnJlcG9zaXRpb24oKTtcbn1cblxuLyoqIEBkb2NzLXByaXZhdGUgKi9cbmV4cG9ydCBjb25zdCBNVFhfUE9QT1ZFUl9TQ1JPTExfU1RSQVRFR1lfRkFDVE9SWV9QUk9WSURFUiA9IHtcbiAgcHJvdmlkZTogTVRYX1BPUE9WRVJfU0NST0xMX1NUUkFURUdZLFxuICBkZXBzOiBbT3ZlcmxheV0sXG4gIHVzZUZhY3Rvcnk6IE1UWF9QT1BPVkVSX1NDUk9MTF9TVFJBVEVHWV9GQUNUT1JZLFxufTtcblxuLyoqXG4gKiBUaGlzIGRpcmVjdGl2ZSBpcyBpbnRlbmRlZCB0byBiZSB1c2VkIGluIGNvbmp1bmN0aW9uIHdpdGggYW4gYG10eC1wb3BvdmVyYCB0YWcuIEl0IGlzXG4gKiByZXNwb25zaWJsZSBmb3IgdG9nZ2xpbmcgdGhlIGRpc3BsYXkgb2YgdGhlIHByb3ZpZGVkIHBvcG92ZXIgaW5zdGFuY2UuXG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ1ttdHgtcG9wb3Zlci10cmlnZ2VyLWZvcl0sIFttdHhQb3BvdmVyVHJpZ2dlckZvcl0nLFxuICBleHBvcnRBczogJ210eFBvcG92ZXJUcmlnZ2VyJyxcbiAgaG9zdDoge1xuICAgICdhcmlhLWhhc3BvcHVwJzogJ3RydWUnLFxuICAgICdbYXR0ci5hcmlhLWV4cGFuZGVkXSc6ICdwb3BvdmVyT3BlbiB8fCBudWxsJyxcbiAgICAnW2F0dHIuYXJpYS1jb250cm9sc10nOiAncG9wb3Zlck9wZW4gPyBwb3BvdmVyLnBhbmVsSWQgOiBudWxsJyxcbiAgICAnKGNsaWNrKSc6ICdfaGFuZGxlQ2xpY2soJGV2ZW50KScsXG4gICAgJyhtb3VzZWVudGVyKSc6ICdfaGFuZGxlTW91c2VFbnRlcigkZXZlbnQpJyxcbiAgICAnKG1vdXNlbGVhdmUpJzogJ19oYW5kbGVNb3VzZUxlYXZlKCRldmVudCknLFxuICAgICcobW91c2Vkb3duKSc6ICdfaGFuZGxlTW91c2Vkb3duKCRldmVudCknLFxuICAgICcoa2V5ZG93biknOiAnX2hhbmRsZUtleWRvd24oJGV2ZW50KScsXG4gIH0sXG59KVxuZXhwb3J0IGNsYXNzIE10eFBvcG92ZXJUcmlnZ2VyIGltcGxlbWVudHMgQWZ0ZXJDb250ZW50SW5pdCwgT25EZXN0cm95IHtcbiAgcHJpdmF0ZSBfcG9ydGFsPzogVGVtcGxhdGVQb3J0YWw7XG4gIHByaXZhdGUgX292ZXJsYXlSZWY6IE92ZXJsYXlSZWYgfCBudWxsID0gbnVsbDtcbiAgcHJpdmF0ZSBfcG9wb3Zlck9wZW4gPSBmYWxzZTtcbiAgcHJpdmF0ZSBfaGFsdCA9IGZhbHNlO1xuICBwcml2YXRlIF9wb3NpdGlvblN1YnNjcmlwdGlvbiA9IFN1YnNjcmlwdGlvbi5FTVBUWTtcbiAgcHJpdmF0ZSBfcG9wb3ZlckNsb3NlU3Vic2NyaXB0aW9uID0gU3Vic2NyaXB0aW9uLkVNUFRZO1xuICBwcml2YXRlIF9jbG9zaW5nQWN0aW9uc1N1YnNjcmlwdGlvbiA9IFN1YnNjcmlwdGlvbi5FTVBUWTtcbiAgcHJpdmF0ZSBfc2Nyb2xsU3RyYXRlZ3khOiAoKSA9PiBTY3JvbGxTdHJhdGVneTtcbiAgcHJpdmF0ZSBfbW91c2VvdmVyVGltZXI6IGFueTtcblxuICAvLyBUcmFja2luZyBpbnB1dCB0eXBlIGlzIG5lY2Vzc2FyeSBzbyBpdCdzIHBvc3NpYmxlIHRvIG9ubHkgYXV0by1mb2N1c1xuICAvLyB0aGUgZmlyc3QgaXRlbSBvZiB0aGUgbGlzdCB3aGVuIHRoZSBwb3BvdmVyIGlzIG9wZW5lZCB2aWEgdGhlIGtleWJvYXJkXG4gIF9vcGVuZWRCeTogRXhjbHVkZTxGb2N1c09yaWdpbiwgJ3Byb2dyYW0nIHwgbnVsbD4gfCB1bmRlZmluZWQgPSB1bmRlZmluZWQ7XG5cbiAgLyoqIFJlZmVyZW5jZXMgdGhlIHBvcG92ZXIgaW5zdGFuY2UgdGhhdCB0aGUgdHJpZ2dlciBpcyBhc3NvY2lhdGVkIHdpdGguICovXG4gIEBJbnB1dCgnbXR4UG9wb3ZlclRyaWdnZXJGb3InKVxuICBnZXQgcG9wb3ZlcigpIHtcbiAgICByZXR1cm4gdGhpcy5fcG9wb3ZlcjtcbiAgfVxuICBzZXQgcG9wb3Zlcihwb3BvdmVyOiBNdHhQb3BvdmVyUGFuZWwpIHtcbiAgICBpZiAocG9wb3ZlciA9PT0gdGhpcy5fcG9wb3Zlcikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuX3BvcG92ZXIgPSBwb3BvdmVyO1xuICAgIHRoaXMuX3BvcG92ZXJDbG9zZVN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuXG4gICAgaWYgKHBvcG92ZXIpIHtcbiAgICAgIHRoaXMuX3BvcG92ZXJDbG9zZVN1YnNjcmlwdGlvbiA9IHBvcG92ZXIuY2xvc2VkLnN1YnNjcmliZSgocmVhc29uOiBQb3BvdmVyQ2xvc2VSZWFzb24pID0+IHtcbiAgICAgICAgdGhpcy5fZGVzdHJveVBvcG92ZXIoKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuICBwcml2YXRlIF9wb3BvdmVyITogTXR4UG9wb3ZlclBhbmVsO1xuXG4gIC8qKiBEYXRhIHRvIGJlIHBhc3NlZCBhbG9uZyB0byBhbnkgbGF6aWx5LXJlbmRlcmVkIGNvbnRlbnQuICovXG4gIEBJbnB1dCgnbXR4UG9wb3ZlclRyaWdnZXJEYXRhJykgcG9wb3ZlckRhdGE6IGFueTtcblxuICAvKiogUmVmZXJlbmNlcyB0aGUgcG9wb3ZlciB0YXJnZXQgaW5zdGFuY2UgdGhhdCB0aGUgdHJpZ2dlciBpcyBhc3NvY2lhdGVkIHdpdGguICovXG4gIEBJbnB1dCgnbXR4UG9wb3ZlclRhcmdldEF0JykgdGFyZ2V0RWxlbWVudD86IE10eFBvcG92ZXJUYXJnZXQ7XG5cbiAgLyoqIFBvcG92ZXIgdHJpZ2dlciBldmVudCAqL1xuICBASW5wdXQoJ210eFBvcG92ZXJUcmlnZ2VyT24nKSB0cmlnZ2VyRXZlbnQ/OiBNdHhQb3BvdmVyVHJpZ2dlckV2ZW50O1xuXG4gIC8qKiBFdmVudCBlbWl0dGVkIHdoZW4gdGhlIGFzc29jaWF0ZWQgcG9wb3ZlciBpcyBvcGVuZWQuICovXG4gIEBPdXRwdXQoKSBwb3BvdmVyT3BlbmVkID0gbmV3IEV2ZW50RW1pdHRlcjx2b2lkPigpO1xuXG4gIC8qKiBFdmVudCBlbWl0dGVkIHdoZW4gdGhlIGFzc29jaWF0ZWQgcG9wb3ZlciBpcyBjbG9zZWQuICovXG4gIEBPdXRwdXQoKSBwb3BvdmVyQ2xvc2VkID0gbmV3IEV2ZW50RW1pdHRlcjx2b2lkPigpO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgX292ZXJsYXk6IE92ZXJsYXksXG4gICAgcHJpdmF0ZSBfZWxlbWVudFJlZjogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4sXG4gICAgcHJpdmF0ZSBfdmlld0NvbnRhaW5lclJlZjogVmlld0NvbnRhaW5lclJlZixcbiAgICBASW5qZWN0KE1UWF9QT1BPVkVSX1NDUk9MTF9TVFJBVEVHWSkgc2Nyb2xsU3RyYXRlZ3k6IGFueSxcbiAgICBAT3B0aW9uYWwoKSBwcml2YXRlIF9kaXI6IERpcmVjdGlvbmFsaXR5LFxuICAgIHByaXZhdGUgX2NoYW5nZURldGVjdG9yUmVmOiBDaGFuZ2VEZXRlY3RvclJlZixcbiAgICBwcml2YXRlIF9mb2N1c01vbml0b3I/OiBGb2N1c01vbml0b3JcbiAgKSB7XG4gICAgdGhpcy5fc2Nyb2xsU3RyYXRlZ3kgPSBzY3JvbGxTdHJhdGVneTtcbiAgfVxuXG4gIG5nQWZ0ZXJDb250ZW50SW5pdCgpIHtcbiAgICB0aGlzLl9jaGVja1BvcG92ZXIoKTtcbiAgICB0aGlzLl9zZXRDdXJyZW50Q29uZmlnKCk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICBpZiAodGhpcy5fb3ZlcmxheVJlZikge1xuICAgICAgdGhpcy5fb3ZlcmxheVJlZi5kaXNwb3NlKCk7XG4gICAgICB0aGlzLl9vdmVybGF5UmVmID0gbnVsbDtcbiAgICB9XG5cbiAgICB0aGlzLl9wb3NpdGlvblN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgIHRoaXMuX3BvcG92ZXJDbG9zZVN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgIHRoaXMuX2Nsb3NpbmdBY3Rpb25zU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gIH1cblxuICBwcml2YXRlIF9zZXRDdXJyZW50Q29uZmlnKCkge1xuICAgIGlmICh0aGlzLnRyaWdnZXJFdmVudCkge1xuICAgICAgdGhpcy5wb3BvdmVyLnRyaWdnZXJFdmVudCA9IHRoaXMudHJpZ2dlckV2ZW50O1xuICAgIH1cblxuICAgIHRoaXMucG9wb3Zlci5zZXRDdXJyZW50U3R5bGVzKCk7XG4gIH1cblxuICAvKiogV2hldGhlciB0aGUgcG9wb3ZlciBpcyBvcGVuLiAqL1xuICBnZXQgcG9wb3Zlck9wZW4oKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX3BvcG92ZXJPcGVuO1xuICB9XG5cbiAgLyoqIFRoZSB0ZXh0IGRpcmVjdGlvbiBvZiB0aGUgY29udGFpbmluZyBhcHAuICovXG4gIGdldCBkaXIoKTogRGlyZWN0aW9uIHtcbiAgICByZXR1cm4gdGhpcy5fZGlyICYmIHRoaXMuX2Rpci52YWx1ZSA9PT0gJ3J0bCcgPyAncnRsJyA6ICdsdHInO1xuICB9XG5cbiAgLyoqIEhhbmRsZXMgbW91c2UgY2xpY2sgb24gdGhlIHRyaWdnZXIuICovXG4gIF9oYW5kbGVDbGljayhldmVudDogTW91c2VFdmVudCk6IHZvaWQge1xuICAgIGlmICh0aGlzLnBvcG92ZXIudHJpZ2dlckV2ZW50ID09PSAnY2xpY2snKSB7XG4gICAgICB0aGlzLnRvZ2dsZVBvcG92ZXIoKTtcbiAgICB9XG4gIH1cblxuICAvKiogSGFuZGxlcyBtb3VzZSBlbnRlciBvbiB0aGUgdHJpZ2dlci4gKi9cbiAgX2hhbmRsZU1vdXNlRW50ZXIoZXZlbnQ6IE1vdXNlRXZlbnQpOiB2b2lkIHtcbiAgICB0aGlzLl9oYWx0ID0gZmFsc2U7XG5cbiAgICBpZiAodGhpcy5wb3BvdmVyLnRyaWdnZXJFdmVudCA9PT0gJ2hvdmVyJykge1xuICAgICAgdGhpcy5fbW91c2VvdmVyVGltZXIgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgdGhpcy5vcGVuUG9wb3ZlcigpO1xuICAgICAgfSwgdGhpcy5wb3BvdmVyLmVudGVyRGVsYXkpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBIYW5kbGVzIG1vdXNlIGxlYXZlIG9uIHRoZSB0cmlnZ2VyLiAqL1xuICBfaGFuZGxlTW91c2VMZWF2ZShldmVudDogTW91c2VFdmVudCk6IHZvaWQge1xuICAgIGlmICh0aGlzLnBvcG92ZXIudHJpZ2dlckV2ZW50ID09PSAnaG92ZXInKSB7XG4gICAgICBpZiAodGhpcy5fbW91c2VvdmVyVGltZXIpIHtcbiAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMuX21vdXNlb3ZlclRpbWVyKTtcbiAgICAgICAgdGhpcy5fbW91c2VvdmVyVGltZXIgPSBudWxsO1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5fcG9wb3Zlck9wZW4pIHtcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgaWYgKCF0aGlzLnBvcG92ZXIuY2xvc2VEaXNhYmxlZCkge1xuICAgICAgICAgICAgdGhpcy5jbG9zZVBvcG92ZXIoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sIHRoaXMucG9wb3Zlci5sZWF2ZURlbGF5KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX2hhbHQgPSB0cnVlO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKiBIYW5kbGVzIG1vdXNlIHByZXNzZXMgb24gdGhlIHRyaWdnZXIuICovXG4gIF9oYW5kbGVNb3VzZWRvd24oZXZlbnQ6IE1vdXNlRXZlbnQpOiB2b2lkIHtcbiAgICBpZiAoIWlzRmFrZU1vdXNlZG93bkZyb21TY3JlZW5SZWFkZXIoZXZlbnQpKSB7XG4gICAgICAvLyBTaW5jZSByaWdodCBvciBtaWRkbGUgYnV0dG9uIGNsaWNrcyB3b24ndCB0cmlnZ2VyIHRoZSBgY2xpY2tgIGV2ZW50LFxuICAgICAgLy8gd2Ugc2hvdWxkbid0IGNvbnNpZGVyIHRoZSBwb3BvdmVyIGFzIG9wZW5lZCBieSBtb3VzZSBpbiB0aG9zZSBjYXNlcy5cbiAgICAgIHRoaXMuX29wZW5lZEJ5ID0gZXZlbnQuYnV0dG9uID09PSAwID8gJ21vdXNlJyA6IHVuZGVmaW5lZDtcbiAgICB9XG4gIH1cblxuICAvKiogSGFuZGxlcyBrZXkgcHJlc3NlcyBvbiB0aGUgdHJpZ2dlci4gKi9cbiAgX2hhbmRsZUtleWRvd24oZXZlbnQ6IEtleWJvYXJkRXZlbnQpOiB2b2lkIHtcbiAgICBjb25zdCBrZXlDb2RlID0gZXZlbnQua2V5Q29kZTtcblxuICAgIC8vIFByZXNzaW5nIGVudGVyIG9uIHRoZSB0cmlnZ2VyIHdpbGwgdHJpZ2dlciB0aGUgY2xpY2sgaGFuZGxlciBsYXRlci5cbiAgICBpZiAoa2V5Q29kZSA9PT0gRU5URVIgfHwga2V5Q29kZSA9PT0gU1BBQ0UpIHtcbiAgICAgIHRoaXMuX29wZW5lZEJ5ID0gJ2tleWJvYXJkJztcbiAgICB9XG4gIH1cblxuICAvKiogVG9nZ2xlcyB0aGUgcG9wb3ZlciBiZXR3ZWVuIHRoZSBvcGVuIGFuZCBjbG9zZWQgc3RhdGVzLiAqL1xuICB0b2dnbGVQb3BvdmVyKCk6IHZvaWQge1xuICAgIHJldHVybiB0aGlzLl9wb3BvdmVyT3BlbiA/IHRoaXMuY2xvc2VQb3BvdmVyKCkgOiB0aGlzLm9wZW5Qb3BvdmVyKCk7XG4gIH1cblxuICAvKiogT3BlbnMgdGhlIHBvcG92ZXIuICovXG4gIG9wZW5Qb3BvdmVyKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLl9wb3BvdmVyT3BlbiB8fCB0aGlzLl9oYWx0KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5fY2hlY2tQb3BvdmVyKCk7XG5cbiAgICBjb25zdCBvdmVybGF5UmVmID0gdGhpcy5fY3JlYXRlT3ZlcmxheSgpO1xuICAgIGNvbnN0IG92ZXJsYXlDb25maWcgPSBvdmVybGF5UmVmLmdldENvbmZpZygpO1xuXG4gICAgdGhpcy5fc2V0UG9zaXRpb24ob3ZlcmxheUNvbmZpZy5wb3NpdGlvblN0cmF0ZWd5IGFzIEZsZXhpYmxlQ29ubmVjdGVkUG9zaXRpb25TdHJhdGVneSk7XG4gICAgaWYgKHRoaXMucG9wb3Zlci50cmlnZ2VyRXZlbnQgPT09ICdjbGljaycpIHtcbiAgICAgIG92ZXJsYXlDb25maWcuaGFzQmFja2Ryb3AgPSB0aGlzLnBvcG92ZXIuaGFzQmFja2Ryb3AgPz8gdHJ1ZTtcbiAgICB9XG4gICAgb3ZlcmxheVJlZi5hdHRhY2godGhpcy5fZ2V0UG9ydGFsKCkpO1xuXG4gICAgaWYgKHRoaXMucG9wb3Zlci5sYXp5Q29udGVudCkge1xuICAgICAgdGhpcy5wb3BvdmVyLmxhenlDb250ZW50LmF0dGFjaCh0aGlzLnBvcG92ZXJEYXRhKTtcbiAgICB9XG5cbiAgICB0aGlzLl9jbG9zaW5nQWN0aW9uc1N1YnNjcmlwdGlvbiA9IHRoaXMuX3BvcG92ZXJDbG9zaW5nQWN0aW9ucygpLnN1YnNjcmliZSgoKSA9PlxuICAgICAgdGhpcy5jbG9zZVBvcG92ZXIoKVxuICAgICk7XG4gICAgdGhpcy5faW5pdFBvcG92ZXIoKTtcblxuICAgIGlmICh0aGlzLnBvcG92ZXIgaW5zdGFuY2VvZiBNdHhQb3BvdmVyKSB7XG4gICAgICB0aGlzLnBvcG92ZXIuX3N0YXJ0QW5pbWF0aW9uKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqIENsb3NlcyB0aGUgcG9wb3Zlci4gKi9cbiAgY2xvc2VQb3BvdmVyKCk6IHZvaWQge1xuICAgIHRoaXMucG9wb3Zlci5jbG9zZWQuZW1pdCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEZvY3VzZXMgdGhlIHBvcG92ZXIgdHJpZ2dlci5cbiAgICogQHBhcmFtIG9yaWdpbiBTb3VyY2Ugb2YgdGhlIHBvcG92ZXIgdHJpZ2dlcidzIGZvY3VzLlxuICAgKi9cbiAgZm9jdXMob3JpZ2luPzogRm9jdXNPcmlnaW4sIG9wdGlvbnM/OiBGb2N1c09wdGlvbnMpIHtcbiAgICBpZiAodGhpcy5fZm9jdXNNb25pdG9yICYmIG9yaWdpbikge1xuICAgICAgdGhpcy5fZm9jdXNNb25pdG9yLmZvY3VzVmlhKHRoaXMuX2VsZW1lbnRSZWYsIG9yaWdpbiwgb3B0aW9ucyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5mb2N1cyhvcHRpb25zKTtcbiAgICB9XG4gIH1cblxuICAvKiogUmVtb3ZlcyB0aGUgcG9wb3ZlciBmcm9tIHRoZSBET00uICovXG4gIHByaXZhdGUgX2Rlc3Ryb3lQb3BvdmVyKHJlYXNvbjogUG9wb3ZlckNsb3NlUmVhc29uKSB7XG4gICAgaWYgKCF0aGlzLl9vdmVybGF5UmVmIHx8ICF0aGlzLnBvcG92ZXJPcGVuKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gQ2xlYXIgdGhlIHRpbWVvdXQgZm9yIGhvdmVyIGV2ZW50LlxuICAgIGlmICh0aGlzLl9tb3VzZW92ZXJUaW1lcikge1xuICAgICAgY2xlYXJUaW1lb3V0KHRoaXMuX21vdXNlb3ZlclRpbWVyKTtcbiAgICAgIHRoaXMuX21vdXNlb3ZlclRpbWVyID0gbnVsbDtcbiAgICB9XG5cbiAgICBjb25zdCBwb3BvdmVyID0gdGhpcy5wb3BvdmVyO1xuICAgIHRoaXMuX2Nsb3NpbmdBY3Rpb25zU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgdGhpcy5fb3ZlcmxheVJlZi5kZXRhY2goKTtcblxuICAgIHRoaXMuX29wZW5lZEJ5ID0gdW5kZWZpbmVkO1xuXG4gICAgaWYgKHBvcG92ZXIgaW5zdGFuY2VvZiBNdHhQb3BvdmVyKSB7XG4gICAgICBwb3BvdmVyLl9yZXNldEFuaW1hdGlvbigpO1xuXG4gICAgICBpZiAocG9wb3Zlci5sYXp5Q29udGVudCkge1xuICAgICAgICAvLyBXYWl0IGZvciB0aGUgZXhpdCBhbmltYXRpb24gdG8gZmluaXNoIGJlZm9yZSBkZXRhY2hpbmcgdGhlIGNvbnRlbnQuXG4gICAgICAgIHBvcG92ZXIuX2FuaW1hdGlvbkRvbmVcbiAgICAgICAgICAucGlwZShcbiAgICAgICAgICAgIGZpbHRlcihldmVudCA9PiBldmVudC50b1N0YXRlID09PSAndm9pZCcpLFxuICAgICAgICAgICAgdGFrZSgxKSxcbiAgICAgICAgICAgIC8vIEludGVycnVwdCBpZiB0aGUgY29udGVudCBnb3QgcmUtYXR0YWNoZWQuXG4gICAgICAgICAgICB0YWtlVW50aWwocG9wb3Zlci5sYXp5Q29udGVudC5fYXR0YWNoZWQpXG4gICAgICAgICAgKVxuICAgICAgICAgIC5zdWJzY3JpYmUoe1xuICAgICAgICAgICAgbmV4dDogKCkgPT4gcG9wb3Zlci5sYXp5Q29udGVudCEuZGV0YWNoKCksXG4gICAgICAgICAgICAvLyBObyBtYXR0ZXIgd2hldGhlciB0aGUgY29udGVudCBnb3QgcmUtYXR0YWNoZWQsIHJlc2V0IHRoZSBwb3BvdmVyLlxuICAgICAgICAgICAgY29tcGxldGU6ICgpID0+IHRoaXMuX3NldElzUG9wb3Zlck9wZW4oZmFsc2UpLFxuICAgICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fc2V0SXNQb3BvdmVyT3BlbihmYWxzZSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX3NldElzUG9wb3Zlck9wZW4oZmFsc2UpO1xuXG4gICAgICBpZiAocG9wb3Zlci5sYXp5Q29udGVudCkge1xuICAgICAgICBwb3BvdmVyLmxhenlDb250ZW50LmRldGFjaCgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBUaGlzIG1ldGhvZCBzZXRzIHRoZSBwb3BvdmVyIHN0YXRlIHRvIG9wZW4uXG4gICAqL1xuICBwcml2YXRlIF9pbml0UG9wb3ZlcigpOiB2b2lkIHtcbiAgICB0aGlzLnBvcG92ZXIuZGlyZWN0aW9uID0gdGhpcy5kaXI7XG4gICAgdGhpcy5wb3BvdmVyLnNldEVsZXZhdGlvbigpO1xuICAgIHRoaXMuX3NldElzUG9wb3Zlck9wZW4odHJ1ZSk7XG4gIH1cblxuICAvLyBzZXQgc3RhdGUgcmF0aGVyIHRoYW4gdG9nZ2xlIHRvIHN1cHBvcnQgdHJpZ2dlcnMgc2hhcmluZyBhIHBvcG92ZXJcbiAgcHJpdmF0ZSBfc2V0SXNQb3BvdmVyT3Blbihpc09wZW46IGJvb2xlYW4pOiB2b2lkIHtcbiAgICB0aGlzLl9wb3BvdmVyT3BlbiA9IGlzT3BlbjtcbiAgICB0aGlzLl9wb3BvdmVyT3BlbiA/IHRoaXMucG9wb3Zlck9wZW5lZC5lbWl0KCkgOiB0aGlzLnBvcG92ZXJDbG9zZWQuZW1pdCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoaXMgbWV0aG9kIGNoZWNrcyB0aGF0IGEgdmFsaWQgaW5zdGFuY2Ugb2YgTWRQb3BvdmVyIGhhcyBiZWVuIHBhc3NlZCBpbnRvXG4gICAqIGBtdHhQb3BvdmVyVHJpZ2dlckZvcmAuIElmIG5vdCwgYW4gZXhjZXB0aW9uIGlzIHRocm93bi5cbiAgICovXG4gIHByaXZhdGUgX2NoZWNrUG9wb3ZlcigpIHtcbiAgICBpZiAoIXRoaXMucG9wb3Zlcikge1xuICAgICAgdGhyb3dNdHhQb3BvdmVyTWlzc2luZ0Vycm9yKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFRoaXMgbWV0aG9kIGNyZWF0ZXMgdGhlIG92ZXJsYXkgZnJvbSB0aGUgcHJvdmlkZWQgcG9wb3ZlcidzIHRlbXBsYXRlIGFuZCBzYXZlcyBpdHNcbiAgICogT3ZlcmxheVJlZiBzbyB0aGF0IGl0IGNhbiBiZSBhdHRhY2hlZCB0byB0aGUgRE9NIHdoZW4gb3BlblBvcG92ZXIgaXMgY2FsbGVkLlxuICAgKi9cbiAgcHJpdmF0ZSBfY3JlYXRlT3ZlcmxheSgpOiBPdmVybGF5UmVmIHtcbiAgICBpZiAoIXRoaXMuX292ZXJsYXlSZWYpIHtcbiAgICAgIGNvbnN0IGNvbmZpZyA9IHRoaXMuX2dldE92ZXJsYXlDb25maWcoKTtcbiAgICAgIHRoaXMuX3N1YnNjcmliZVRvUG9zaXRpb25zKGNvbmZpZy5wb3NpdGlvblN0cmF0ZWd5IGFzIEZsZXhpYmxlQ29ubmVjdGVkUG9zaXRpb25TdHJhdGVneSk7XG4gICAgICB0aGlzLl9vdmVybGF5UmVmID0gdGhpcy5fb3ZlcmxheS5jcmVhdGUoY29uZmlnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3Qgb3ZlcmxheUNvbmZpZyA9IHRoaXMuX292ZXJsYXlSZWYuZ2V0Q29uZmlnKCk7XG4gICAgICBjb25zdCBwb3NpdGlvblN0cmF0ZWd5ID0gb3ZlcmxheUNvbmZpZy5wb3NpdGlvblN0cmF0ZWd5IGFzIEZsZXhpYmxlQ29ubmVjdGVkUG9zaXRpb25TdHJhdGVneTtcbiAgICAgIHBvc2l0aW9uU3RyYXRlZ3kuc2V0T3JpZ2luKHRoaXMuX2dldFRhcmdldEVsZW1lbnQoKSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuX292ZXJsYXlSZWY7XG4gIH1cblxuICAvKipcbiAgICogVGhpcyBtZXRob2QgYnVpbGRzIHRoZSBjb25maWd1cmF0aW9uIG9iamVjdCBuZWVkZWQgdG8gY3JlYXRlIHRoZSBvdmVybGF5LCB0aGUgT3ZlcmxheUNvbmZpZy5cbiAgICogQHJldHVybnMgT3ZlcmxheUNvbmZpZ1xuICAgKi9cbiAgcHJpdmF0ZSBfZ2V0T3ZlcmxheUNvbmZpZygpOiBPdmVybGF5Q29uZmlnIHtcbiAgICByZXR1cm4gbmV3IE92ZXJsYXlDb25maWcoe1xuICAgICAgcG9zaXRpb25TdHJhdGVneTogdGhpcy5fb3ZlcmxheVxuICAgICAgICAucG9zaXRpb24oKVxuICAgICAgICAuZmxleGlibGVDb25uZWN0ZWRUbyh0aGlzLl9nZXRUYXJnZXRFbGVtZW50KCkpXG4gICAgICAgIC53aXRoTG9ja2VkUG9zaXRpb24oKVxuICAgICAgICAud2l0aEdyb3dBZnRlck9wZW4oKVxuICAgICAgICAud2l0aFRyYW5zZm9ybU9yaWdpbk9uKCcubXR4LXBvcG92ZXItcGFuZWwnKSxcbiAgICAgIGJhY2tkcm9wQ2xhc3M6IHRoaXMucG9wb3Zlci5iYWNrZHJvcENsYXNzIHx8ICdjZGstb3ZlcmxheS10cmFuc3BhcmVudC1iYWNrZHJvcCcsXG4gICAgICBwYW5lbENsYXNzOiB0aGlzLnBvcG92ZXIub3ZlcmxheVBhbmVsQ2xhc3MsXG4gICAgICBzY3JvbGxTdHJhdGVneTogdGhpcy5fc2Nyb2xsU3RyYXRlZ3koKSxcbiAgICAgIGRpcmVjdGlvbjogdGhpcy5fZGlyLFxuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBfZ2V0VGFyZ2V0RWxlbWVudCgpOiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PiB7XG4gICAgaWYgKHRoaXMudGFyZ2V0RWxlbWVudCkge1xuICAgICAgcmV0dXJuIHRoaXMudGFyZ2V0RWxlbWVudC5lbGVtZW50UmVmO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLl9lbGVtZW50UmVmO1xuICB9XG5cbiAgLyoqXG4gICAqIExpc3RlbnMgdG8gY2hhbmdlcyBpbiB0aGUgcG9zaXRpb24gb2YgdGhlIG92ZXJsYXkgYW5kIHNldHMgdGhlIGNvcnJlY3QgY2xhc3Nlc1xuICAgKiBvbiB0aGUgcG9wb3ZlciBiYXNlZCBvbiB0aGUgbmV3IHBvc2l0aW9uLiBUaGlzIGVuc3VyZXMgdGhlIGFuaW1hdGlvbiBvcmlnaW4gaXMgYWx3YXlzXG4gICAqIGNvcnJlY3QsIGV2ZW4gaWYgYSBmYWxsYmFjayBwb3NpdGlvbiBpcyB1c2VkIGZvciB0aGUgb3ZlcmxheS5cbiAgICovXG4gIHByaXZhdGUgX3N1YnNjcmliZVRvUG9zaXRpb25zKHBvc2l0aW9uOiBGbGV4aWJsZUNvbm5lY3RlZFBvc2l0aW9uU3RyYXRlZ3kpOiB2b2lkIHtcbiAgICB0aGlzLl9wb3NpdGlvblN1YnNjcmlwdGlvbiA9IHBvc2l0aW9uLnBvc2l0aW9uQ2hhbmdlcy5zdWJzY3JpYmUoY2hhbmdlID0+IHtcbiAgICAgIGNvbnN0IHBvc1ggPVxuICAgICAgICBjaGFuZ2UuY29ubmVjdGlvblBhaXIub3ZlcmxheVggPT09ICdzdGFydCdcbiAgICAgICAgICA/ICdhZnRlcidcbiAgICAgICAgICA6IGNoYW5nZS5jb25uZWN0aW9uUGFpci5vdmVybGF5WCA9PT0gJ2VuZCdcbiAgICAgICAgICA/ICdiZWZvcmUnXG4gICAgICAgICAgOiAnY2VudGVyJztcbiAgICAgIGNvbnN0IHBvc1kgPVxuICAgICAgICBjaGFuZ2UuY29ubmVjdGlvblBhaXIub3ZlcmxheVkgPT09ICd0b3AnXG4gICAgICAgICAgPyAnYmVsb3cnXG4gICAgICAgICAgOiBjaGFuZ2UuY29ubmVjdGlvblBhaXIub3ZlcmxheVkgPT09ICdib3R0b20nXG4gICAgICAgICAgPyAnYWJvdmUnXG4gICAgICAgICAgOiAnY2VudGVyJztcblxuICAgICAgY29uc3QgcG9zOiBNdHhQb3BvdmVyUG9zaXRpb24gPVxuICAgICAgICB0aGlzLnBvcG92ZXIucG9zaXRpb25bMF0gPT09ICdhYm92ZScgfHwgdGhpcy5wb3BvdmVyLnBvc2l0aW9uWzBdID09PSAnYmVsb3cnXG4gICAgICAgICAgPyBbcG9zWSBhcyBNdHhQb3BvdmVyUG9zaXRpb25TdGFydCwgcG9zWF1cbiAgICAgICAgICA6IFtwb3NYIGFzIE10eFBvcG92ZXJQb3NpdGlvblN0YXJ0LCBwb3NZXTtcblxuICAgICAgLy8gcmVxdWlyZWQgZm9yIENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaFxuICAgICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCk7XG5cbiAgICAgIHRoaXMucG9wb3Zlci5zZXRDdXJyZW50U3R5bGVzKHBvcyk7XG4gICAgICB0aGlzLnBvcG92ZXIuc2V0UG9zaXRpb25DbGFzc2VzKHBvcyk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyB0aGUgYXBwcm9wcmlhdGUgcG9zaXRpb25zIG9uIGEgcG9zaXRpb24gc3RyYXRlZ3lcbiAgICogc28gdGhlIG92ZXJsYXkgY29ubmVjdHMgd2l0aCB0aGUgdHJpZ2dlciBjb3JyZWN0bHkuXG4gICAqIEBwYXJhbSBwb3NpdGlvblN0cmF0ZWd5IFN0cmF0ZWd5IHdob3NlIHBvc2l0aW9uIHRvIHVwZGF0ZS5cbiAgICovXG4gIHByaXZhdGUgX3NldFBvc2l0aW9uKHBvc2l0aW9uU3RyYXRlZ3k6IEZsZXhpYmxlQ29ubmVjdGVkUG9zaXRpb25TdHJhdGVneSkge1xuICAgIGNvbnN0IFtvcmlnaW5YLCBvcmlnaW4ybmRYLCBvcmlnaW4zcmRYXTogSG9yaXpvbnRhbENvbm5lY3Rpb25Qb3NbXSA9XG4gICAgICB0aGlzLnBvcG92ZXIucG9zaXRpb25bMF0gPT09ICdiZWZvcmUnIHx8IHRoaXMucG9wb3Zlci5wb3NpdGlvblsxXSA9PT0gJ2FmdGVyJ1xuICAgICAgICA/IFsnc3RhcnQnLCAnY2VudGVyJywgJ2VuZCddXG4gICAgICAgIDogdGhpcy5wb3BvdmVyLnBvc2l0aW9uWzBdID09PSAnYWZ0ZXInIHx8IHRoaXMucG9wb3Zlci5wb3NpdGlvblsxXSA9PT0gJ2JlZm9yZSdcbiAgICAgICAgPyBbJ2VuZCcsICdjZW50ZXInLCAnc3RhcnQnXVxuICAgICAgICA6IFsnY2VudGVyJywgJ3N0YXJ0JywgJ2VuZCddO1xuXG4gICAgY29uc3QgW29yaWdpblksIG9yaWdpbjJuZFksIG9yaWdpbjNyZFldOiBWZXJ0aWNhbENvbm5lY3Rpb25Qb3NbXSA9XG4gICAgICB0aGlzLnBvcG92ZXIucG9zaXRpb25bMF0gPT09ICdhYm92ZScgfHwgdGhpcy5wb3BvdmVyLnBvc2l0aW9uWzFdID09PSAnYmVsb3cnXG4gICAgICAgID8gWyd0b3AnLCAnY2VudGVyJywgJ2JvdHRvbSddXG4gICAgICAgIDogdGhpcy5wb3BvdmVyLnBvc2l0aW9uWzBdID09PSAnYmVsb3cnIHx8IHRoaXMucG9wb3Zlci5wb3NpdGlvblsxXSA9PT0gJ2Fib3ZlJ1xuICAgICAgICA/IFsnYm90dG9tJywgJ2NlbnRlcicsICd0b3AnXVxuICAgICAgICA6IFsnY2VudGVyJywgJ3RvcCcsICdib3R0b20nXTtcblxuICAgIGNvbnN0IFtvdmVybGF5WCwgb3ZlcmxheUZhbGxiYWNrWF06IEhvcml6b250YWxDb25uZWN0aW9uUG9zW10gPVxuICAgICAgdGhpcy5wb3BvdmVyLnBvc2l0aW9uWzBdID09PSAnYmVsb3cnIHx8IHRoaXMucG9wb3Zlci5wb3NpdGlvblswXSA9PT0gJ2Fib3ZlJ1xuICAgICAgICA/IFtvcmlnaW5YLCBvcmlnaW5YXVxuICAgICAgICA6IHRoaXMucG9wb3Zlci5wb3NpdGlvblswXSA9PT0gJ2JlZm9yZSdcbiAgICAgICAgPyBbJ2VuZCcsICdzdGFydCddXG4gICAgICAgIDogWydzdGFydCcsICdlbmQnXTtcblxuICAgIGNvbnN0IFtvdmVybGF5WSwgb3ZlcmxheUZhbGxiYWNrWV06IFZlcnRpY2FsQ29ubmVjdGlvblBvc1tdID1cbiAgICAgIHRoaXMucG9wb3Zlci5wb3NpdGlvblswXSA9PT0gJ2JlZm9yZScgfHwgdGhpcy5wb3BvdmVyLnBvc2l0aW9uWzBdID09PSAnYWZ0ZXInXG4gICAgICAgID8gW29yaWdpblksIG9yaWdpblldXG4gICAgICAgIDogdGhpcy5wb3BvdmVyLnBvc2l0aW9uWzBdID09PSAnYmVsb3cnXG4gICAgICAgID8gWyd0b3AnLCAnYm90dG9tJ11cbiAgICAgICAgOiBbJ2JvdHRvbScsICd0b3AnXTtcblxuICAgIGNvbnN0IG9yaWdpbkZhbGxiYWNrWCA9IG92ZXJsYXlYO1xuICAgIGNvbnN0IG9yaWdpbkZhbGxiYWNrWSA9IG92ZXJsYXlZO1xuXG4gICAgY29uc3Qgb2Zmc2V0WCA9XG4gICAgICB0aGlzLnBvcG92ZXIueE9mZnNldCAmJiAhaXNOYU4oTnVtYmVyKHRoaXMucG9wb3Zlci54T2Zmc2V0KSlcbiAgICAgICAgPyBOdW1iZXIodGhpcy5kaXIgPT09ICdsdHInID8gdGhpcy5wb3BvdmVyLnhPZmZzZXQgOiAtdGhpcy5wb3BvdmVyLnhPZmZzZXQpXG4gICAgICAgIDogMDtcbiAgICBjb25zdCBvZmZzZXRZID1cbiAgICAgIHRoaXMucG9wb3Zlci55T2Zmc2V0ICYmICFpc05hTihOdW1iZXIodGhpcy5wb3BvdmVyLnlPZmZzZXQpKVxuICAgICAgICA/IE51bWJlcih0aGlzLnBvcG92ZXIueU9mZnNldClcbiAgICAgICAgOiAwO1xuXG4gICAgbGV0IHBvc2l0aW9uczogQ29ubmVjdGVkUG9zaXRpb25bXSA9IFt7IG9yaWdpblgsIG9yaWdpblksIG92ZXJsYXlYLCBvdmVybGF5WSB9XTtcblxuICAgIGlmICh0aGlzLnBvcG92ZXIucG9zaXRpb25bMF0gPT09ICdhYm92ZScgfHwgdGhpcy5wb3BvdmVyLnBvc2l0aW9uWzBdID09PSAnYmVsb3cnKSB7XG4gICAgICBwb3NpdGlvbnMgPSBbXG4gICAgICAgIHsgb3JpZ2luWCwgb3JpZ2luWSwgb3ZlcmxheVgsIG92ZXJsYXlZLCBvZmZzZXRZIH0sXG4gICAgICAgIHsgb3JpZ2luWDogb3JpZ2luMm5kWCwgb3JpZ2luWSwgb3ZlcmxheVg6IG9yaWdpbjJuZFgsIG92ZXJsYXlZLCBvZmZzZXRZIH0sXG4gICAgICAgIHsgb3JpZ2luWDogb3JpZ2luM3JkWCwgb3JpZ2luWSwgb3ZlcmxheVg6IG9yaWdpbjNyZFgsIG92ZXJsYXlZLCBvZmZzZXRZIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBvcmlnaW5YLFxuICAgICAgICAgIG9yaWdpblk6IG9yaWdpbkZhbGxiYWNrWSxcbiAgICAgICAgICBvdmVybGF5WCxcbiAgICAgICAgICBvdmVybGF5WTogb3ZlcmxheUZhbGxiYWNrWSxcbiAgICAgICAgICBvZmZzZXRZOiAtb2Zmc2V0WSxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIG9yaWdpblg6IG9yaWdpbjJuZFgsXG4gICAgICAgICAgb3JpZ2luWTogb3JpZ2luRmFsbGJhY2tZLFxuICAgICAgICAgIG92ZXJsYXlYOiBvcmlnaW4ybmRYLFxuICAgICAgICAgIG92ZXJsYXlZOiBvdmVybGF5RmFsbGJhY2tZLFxuICAgICAgICAgIG9mZnNldFk6IC1vZmZzZXRZLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgb3JpZ2luWDogb3JpZ2luM3JkWCxcbiAgICAgICAgICBvcmlnaW5ZOiBvcmlnaW5GYWxsYmFja1ksXG4gICAgICAgICAgb3ZlcmxheVg6IG9yaWdpbjNyZFgsXG4gICAgICAgICAgb3ZlcmxheVk6IG92ZXJsYXlGYWxsYmFja1ksXG4gICAgICAgICAgb2Zmc2V0WTogLW9mZnNldFksXG4gICAgICAgIH0sXG4gICAgICBdO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnBvcG92ZXIucG9zaXRpb25bMF0gPT09ICdiZWZvcmUnIHx8IHRoaXMucG9wb3Zlci5wb3NpdGlvblswXSA9PT0gJ2FmdGVyJykge1xuICAgICAgcG9zaXRpb25zID0gW1xuICAgICAgICB7IG9yaWdpblgsIG9yaWdpblksIG92ZXJsYXlYLCBvdmVybGF5WSwgb2Zmc2V0WCB9LFxuICAgICAgICB7IG9yaWdpblgsIG9yaWdpblk6IG9yaWdpbjJuZFksIG92ZXJsYXlYLCBvdmVybGF5WTogb3JpZ2luMm5kWSwgb2Zmc2V0WCB9LFxuICAgICAgICB7IG9yaWdpblgsIG9yaWdpblk6IG9yaWdpbjNyZFksIG92ZXJsYXlYLCBvdmVybGF5WTogb3JpZ2luM3JkWSwgb2Zmc2V0WCB9LFxuICAgICAgICB7XG4gICAgICAgICAgb3JpZ2luWDogb3JpZ2luRmFsbGJhY2tYLFxuICAgICAgICAgIG9yaWdpblksXG4gICAgICAgICAgb3ZlcmxheVg6IG92ZXJsYXlGYWxsYmFja1gsXG4gICAgICAgICAgb3ZlcmxheVksXG4gICAgICAgICAgb2Zmc2V0WDogLW9mZnNldFgsXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBvcmlnaW5YOiBvcmlnaW5GYWxsYmFja1gsXG4gICAgICAgICAgb3JpZ2luWTogb3JpZ2luMm5kWSxcbiAgICAgICAgICBvdmVybGF5WDogb3ZlcmxheUZhbGxiYWNrWCxcbiAgICAgICAgICBvdmVybGF5WTogb3JpZ2luMm5kWSxcbiAgICAgICAgICBvZmZzZXRYOiAtb2Zmc2V0WCxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIG9yaWdpblg6IG9yaWdpbkZhbGxiYWNrWCxcbiAgICAgICAgICBvcmlnaW5ZOiBvcmlnaW4zcmRZLFxuICAgICAgICAgIG92ZXJsYXlYOiBvdmVybGF5RmFsbGJhY2tYLFxuICAgICAgICAgIG92ZXJsYXlZOiBvcmlnaW4zcmRZLFxuICAgICAgICAgIG9mZnNldFg6IC1vZmZzZXRYLFxuICAgICAgICB9LFxuICAgICAgXTtcbiAgICB9XG5cbiAgICBwb3NpdGlvblN0cmF0ZWd5XG4gICAgICAud2l0aFBvc2l0aW9ucyhwb3NpdGlvbnMpXG4gICAgICAud2l0aERlZmF1bHRPZmZzZXRYKG9mZnNldFgpXG4gICAgICAud2l0aERlZmF1bHRPZmZzZXRZKG9mZnNldFkpO1xuICB9XG5cbiAgLyoqIFJldHVybnMgYSBzdHJlYW0gdGhhdCBlbWl0cyB3aGVuZXZlciBhbiBhY3Rpb24gdGhhdCBzaG91bGQgY2xvc2UgdGhlIHBvcG92ZXIgb2NjdXJzLiAqL1xuICBwcml2YXRlIF9wb3BvdmVyQ2xvc2luZ0FjdGlvbnMoKSB7XG4gICAgY29uc3QgYmFja2Ryb3AgPVxuICAgICAgdGhpcy5wb3BvdmVyLnRyaWdnZXJFdmVudCA9PT0gJ2NsaWNrJyAmJiB0aGlzLnBvcG92ZXIuY2xvc2VPbkJhY2tkcm9wQ2xpY2sgPT09IHRydWVcbiAgICAgICAgPyB0aGlzLl9vdmVybGF5UmVmIS5iYWNrZHJvcENsaWNrKClcbiAgICAgICAgOiBvYnNlcnZhYmxlT2YoKTtcbiAgICBjb25zdCBkZXRhY2htZW50cyA9IHRoaXMuX292ZXJsYXlSZWYhLmRldGFjaG1lbnRzKCk7XG4gICAgcmV0dXJuIG1lcmdlKGJhY2tkcm9wLCBkZXRhY2htZW50cyk7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgcG9ydGFsIHRoYXQgc2hvdWxkIGJlIGF0dGFjaGVkIHRvIHRoZSBvdmVybGF5LiAqL1xuICBwcml2YXRlIF9nZXRQb3J0YWwoKTogVGVtcGxhdGVQb3J0YWwge1xuICAgIC8vIE5vdGUgdGhhdCB3ZSBjYW4gYXZvaWQgdGhpcyBjaGVjayBieSBrZWVwaW5nIHRoZSBwb3J0YWwgb24gdGhlIHBvcG92ZXIgcGFuZWwuXG4gICAgLy8gV2hpbGUgaXQgd291bGQgYmUgY2xlYW5lciwgd2UnZCBoYXZlIHRvIGludHJvZHVjZSBhbm90aGVyIHJlcXVpcmVkIG1ldGhvZCBvblxuICAgIC8vIGBNdHhQb3BvdmVyUGFuZWxgLCBtYWtpbmcgaXQgaGFyZGVyIHRvIGNvbnN1bWUuXG4gICAgaWYgKCF0aGlzLl9wb3J0YWwgfHwgdGhpcy5fcG9ydGFsLnRlbXBsYXRlUmVmICE9PSB0aGlzLnBvcG92ZXIudGVtcGxhdGVSZWYpIHtcbiAgICAgIHRoaXMuX3BvcnRhbCA9IG5ldyBUZW1wbGF0ZVBvcnRhbCh0aGlzLnBvcG92ZXIudGVtcGxhdGVSZWYsIHRoaXMuX3ZpZXdDb250YWluZXJSZWYpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLl9wb3J0YWw7XG4gIH1cbn1cbiJdfQ==