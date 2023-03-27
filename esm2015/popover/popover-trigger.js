import { Directive, ElementRef, EventEmitter, Input, Optional, Output, ViewContainerRef, HostListener, HostBinding, ChangeDetectorRef, } from '@angular/core';
import { isFakeMousedownFromScreenReader } from '@angular/cdk/a11y';
import { Directionality } from '@angular/cdk/bidi';
import { Overlay, OverlayConfig, } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { throwMtxPopoverMissingError } from './popover-errors';
/**
 * This directive is intended to be used in conjunction with an mtx-popover tag. It is
 * responsible for toggling the display of the provided popover instance.
 */
export class MtxPopoverTrigger {
    constructor(_overlay, _elementRef, _viewContainerRef, _dir, _changeDetectorRef) {
        this._overlay = _overlay;
        this._elementRef = _elementRef;
        this._viewContainerRef = _viewContainerRef;
        this._dir = _dir;
        this._changeDetectorRef = _changeDetectorRef;
        this.ariaHaspopup = true;
        this.popoverOpened$ = new Subject();
        this.popoverClosed$ = new Subject();
        this._overlayRef = null;
        this._popoverOpen = false;
        this._halt = false;
        // tracking input type is necessary so it's possible to only auto-focus
        // the first item of the list when the popover is opened via the keyboard
        this._openedByMouse = false;
        this._onDestroy = new Subject();
        /** Event emitted when the associated popover is opened. */
        this.popoverOpened = new EventEmitter();
        /** Event emitted when the associated popover is closed. */
        this.popoverClosed = new EventEmitter();
    }
    ngAfterViewInit() {
        this._checkPopover();
        this._setCurrentConfig();
        this.popover.closed.subscribe(() => this.closePopover());
    }
    ngOnDestroy() {
        this.destroyPopover();
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
    onClick(event) {
        if (this.popover.triggerEvent === 'click') {
            this.togglePopover();
        }
    }
    onMouseEnter(event) {
        this._halt = false;
        if (this.popover.triggerEvent === 'hover') {
            this._mouseoverTimer = setTimeout(() => {
                this.openPopover();
            }, this.popover.enterDelay);
        }
    }
    onMouseLeave(event) {
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
    /** Toggles the popover between the open and closed states. */
    togglePopover() {
        return this._popoverOpen ? this.closePopover() : this.openPopover();
    }
    /** Opens the popover. */
    openPopover() {
        if (!this._popoverOpen && !this._halt) {
            this._createOverlay().attach(this._portal);
            this._subscribeToBackdrop();
            this._subscribeToDetachments();
            this._initPopover();
        }
    }
    /** Closes the popover. */
    closePopover() {
        if (this._overlayRef) {
            this._overlayRef.detach();
            this._resetPopover();
        }
        this.destroyPopover();
    }
    /** Removes the popover from the DOM. */
    destroyPopover() {
        if (this._mouseoverTimer) {
            clearTimeout(this._mouseoverTimer);
            this._mouseoverTimer = null;
        }
        if (this._overlayRef) {
            this._overlayRef.dispose();
            this._overlayRef = null;
            this._cleanUpSubscriptions();
        }
        this._onDestroy.next();
        this._onDestroy.complete();
    }
    /** Focuses the popover trigger. */
    focus() {
        this._elementRef.nativeElement.focus();
    }
    /** The text direction of the containing app. */
    get dir() {
        return this._dir && this._dir.value === 'rtl' ? 'rtl' : 'ltr';
    }
    /**
     * This method ensures that the popover closes when the overlay backdrop is clicked.
     * We do not use first() here because doing so would not catch clicks from within
     * the popover, and it would fail to unsubscribe properly. Instead, we unsubscribe
     * explicitly when the popover is closed or destroyed.
     */
    _subscribeToBackdrop() {
        if (this._overlayRef) {
            /** Only subscribe to backdrop if trigger event is click */
            if (this.triggerEvent === 'click' && this.popover.closeOnBackdropClick === true) {
                this._overlayRef
                    .backdropClick()
                    .pipe(takeUntil(this.popoverClosed$), takeUntil(this._onDestroy))
                    .subscribe(() => {
                    this.popover._emitCloseEvent();
                });
            }
        }
    }
    _subscribeToDetachments() {
        if (this._overlayRef) {
            this._overlayRef
                .detachments()
                .pipe(takeUntil(this.popoverClosed$), takeUntil(this._onDestroy))
                .subscribe(() => {
                this._setPopoverClosed();
            });
        }
    }
    /**
     * This method sets the popover state to open and focuses the first item if
     * the popover was opened via the keyboard.
     */
    _initPopover() {
        this._setPopoverOpened();
    }
    /**
     * This method resets the popover when it's closed, most importantly restoring
     * focus to the popover trigger if the popover was opened via the keyboard.
     */
    _resetPopover() {
        this._setPopoverClosed();
        // Focus only needs to be reset to the host element if the popover was opened
        // by the keyboard and manually shifted to the first popover item.
        if (!this._openedByMouse) {
            this.focus();
        }
        this._openedByMouse = false;
    }
    /** set state rather than toggle to support triggers sharing a popover */
    _setPopoverOpened() {
        if (!this._popoverOpen) {
            this._popoverOpen = true;
            this.popoverOpened$.next();
            this.popoverOpened.emit();
        }
    }
    /** set state rather than toggle to support triggers sharing a popover */
    _setPopoverClosed() {
        if (this._popoverOpen) {
            this._popoverOpen = false;
            this.popoverClosed$.next();
            this.popoverClosed.emit();
        }
    }
    /**
     *  This method checks that a valid instance of MdPopover has been passed into
     *  mdPopoverTriggerFor. If not, an exception is thrown.
     */
    _checkPopover() {
        if (!this.popover) {
            throwMtxPopoverMissingError();
        }
    }
    /**
     *  This method creates the overlay from the provided popover's template and saves its
     *  OverlayRef so that it can be attached to the DOM when openPopover is called.
     */
    _createOverlay() {
        if (!this._overlayRef) {
            this._portal = new TemplatePortal(this.popover.templateRef, this._viewContainerRef);
            const config = this._getOverlayConfig();
            this._subscribeToPositions(config.positionStrategy);
            this._overlayRef = this._overlay.create(config);
        }
        return this._overlayRef;
    }
    /**
     * This method builds the configuration object needed to create the overlay, the OverlayConfig.
     * @returns OverlayConfig
     */
    _getOverlayConfig() {
        const overlayState = new OverlayConfig();
        overlayState.positionStrategy = this._getPosition();
        /** Display overlay backdrop if trigger event is click */
        if (this.triggerEvent === 'click') {
            overlayState.hasBackdrop = true;
            overlayState.backdropClass = 'cdk-overlay-transparent-backdrop';
        }
        overlayState.direction = this._dir;
        overlayState.scrollStrategy = this._getOverlayScrollStrategy(this.popover.scrollStrategy);
        return overlayState;
    }
    /**
     * This method returns the scroll strategy used by the cdk/overlay.
     */
    _getOverlayScrollStrategy(strategy) {
        switch (strategy) {
            case 'noop':
                return this._overlay.scrollStrategies.noop();
            case 'close':
                return this._overlay.scrollStrategies.close();
            case 'block':
                return this._overlay.scrollStrategies.block();
            case 'reposition':
            default:
                return this._overlay.scrollStrategies.reposition();
        }
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
            this.popover.zone.run(() => {
                this.popover.setCurrentStyles(pos);
                this.popover.setPositionClasses(pos);
            });
        });
    }
    /**
     * This method builds the position strategy for the overlay, so the popover is properly connected
     * to the trigger.
     * @returns ConnectedPositionStrategy
     */
    _getPosition() {
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
        /**
         * For overriding position element, when `mtxPopoverTargetAt` has a valid element reference.
         * Useful for sticking popover to parent element and offsetting arrow to trigger element.
         * If undefined defaults to the trigger element reference.
         */
        let element = this._elementRef;
        if (typeof this.targetElement !== 'undefined') {
            this.popover.containerPositioning = true;
            element = this.targetElement._elementRef;
        }
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
        return this._overlay
            .position()
            .flexibleConnectedTo(element)
            .withLockedPosition()
            .withPositions(positions)
            .withDefaultOffsetX(offsetX)
            .withDefaultOffsetY(offsetY);
    }
    _cleanUpSubscriptions() {
        if (this._backdropSubscription) {
            this._backdropSubscription.unsubscribe();
        }
        if (this._positionSubscription) {
            this._positionSubscription.unsubscribe();
        }
        if (this._detachmentsSubscription) {
            this._detachmentsSubscription.unsubscribe();
        }
    }
    _handleMousedown(event) {
        if (event && !isFakeMousedownFromScreenReader(event)) {
            this._openedByMouse = true;
        }
    }
}
MtxPopoverTrigger.decorators = [
    { type: Directive, args: [{
                selector: '[mtxPopoverTriggerFor]',
                exportAs: 'mtxPopoverTrigger',
            },] }
];
/** @nocollapse */
MtxPopoverTrigger.ctorParameters = () => [
    { type: Overlay },
    { type: ElementRef },
    { type: ViewContainerRef },
    { type: Directionality, decorators: [{ type: Optional }] },
    { type: ChangeDetectorRef }
];
MtxPopoverTrigger.propDecorators = {
    ariaHaspopup: [{ type: HostBinding, args: ['attr.aria-haspopup',] }],
    popover: [{ type: Input, args: ['mtxPopoverTriggerFor',] }],
    targetElement: [{ type: Input, args: ['mtxPopoverTargetAt',] }],
    triggerEvent: [{ type: Input, args: ['mtxPopoverTriggerOn',] }],
    popoverOpened: [{ type: Output }],
    popoverClosed: [{ type: Output }],
    onClick: [{ type: HostListener, args: ['click', ['$event'],] }],
    onMouseEnter: [{ type: HostListener, args: ['mouseenter', ['$event'],] }],
    onMouseLeave: [{ type: HostListener, args: ['mouseleave', ['$event'],] }],
    _handleMousedown: [{ type: HostListener, args: ['mousedown', ['$event'],] }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9wb3Zlci10cmlnZ2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vcHJvamVjdHMvZXh0ZW5zaW9ucy9wb3BvdmVyL3BvcG92ZXItdHJpZ2dlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBRUwsU0FBUyxFQUNULFVBQVUsRUFDVixZQUFZLEVBQ1osS0FBSyxFQUVMLFFBQVEsRUFDUixNQUFNLEVBQ04sZ0JBQWdCLEVBQ2hCLFlBQVksRUFDWixXQUFXLEVBQ1gsaUJBQWlCLEdBQ2xCLE1BQU0sZUFBZSxDQUFDO0FBRXZCLE9BQU8sRUFBRSwrQkFBK0IsRUFBRSxNQUFNLG1CQUFtQixDQUFDO0FBQ3BFLE9BQU8sRUFBYSxjQUFjLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQztBQUM5RCxPQUFPLEVBQ0wsT0FBTyxFQUVQLGFBQWEsR0FNZCxNQUFNLHNCQUFzQixDQUFDO0FBQzlCLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUVyRCxPQUFPLEVBQWdCLE9BQU8sRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUM3QyxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFTM0MsT0FBTyxFQUFFLDJCQUEyQixFQUFFLE1BQU0sa0JBQWtCLENBQUM7QUFFL0Q7OztHQUdHO0FBTUgsTUFBTSxPQUFPLGlCQUFpQjtJQXFDNUIsWUFDVSxRQUFpQixFQUNsQixXQUF1QixFQUN0QixpQkFBbUMsRUFDdkIsSUFBb0IsRUFDaEMsa0JBQXFDO1FBSnJDLGFBQVEsR0FBUixRQUFRLENBQVM7UUFDbEIsZ0JBQVcsR0FBWCxXQUFXLENBQVk7UUFDdEIsc0JBQWlCLEdBQWpCLGlCQUFpQixDQUFrQjtRQUN2QixTQUFJLEdBQUosSUFBSSxDQUFnQjtRQUNoQyx1QkFBa0IsR0FBbEIsa0JBQWtCLENBQW1CO1FBekNaLGlCQUFZLEdBQUcsSUFBSSxDQUFDO1FBRXZELG1CQUFjLEdBQUcsSUFBSSxP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OztPQUlHO0lBQ0ssWUFBWTtRQUNsQixNQUFNLENBQUMsT0FBTyxFQUFFLFVBQVUsRUFBRSxVQUFVLENBQUMsR0FDckMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEtBQUssUUFBUSxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxLQUFLLE9BQU87WUFDM0UsQ0FBQyxDQUFDLENBQUMsT0FBTyxFQUFFLFFBQVEsRUFBRSxLQUFLLENBQUM7WUFDNUIsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxLQUFLLE9BQU8sSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsS0FBSyxRQUFRO2dCQUMvRSxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsUUFBUSxFQUFFLE9BQU8sQ0FBQztnQkFDNUIsQ0FBQyxDQUFDLENBQUMsUUFBUSxFQUFFLE9BQU8sRUFBRSxLQUFLLENBQUMsQ0FBQztRQUVqQyxNQUFNLENBQUMsT0FBTyxFQUFFLFVBQVUsRUFBRSxVQUFVLENBQUMsR0FDckMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEtBQUssT0FBTyxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxLQUFLLE9BQU87WUFDMUUsQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLFFBQVEsRUFBRSxRQUFRLENBQUM7WUFDN0IsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxLQUFLLE9BQU8sSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsS0FBSyxPQUFPO2dCQUM5RSxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUUsUUFBUSxFQUFFLEtBQUssQ0FBQztnQkFDN0IsQ0FBQyxDQUFDLENBQUMsUUFBUSxFQUFFLEtBQUssRUFBRSxRQUFRLENBQUMsQ0FBQztRQUVsQyxN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Z0JBQ2xDLFFBQVEsRUFBRSxtQkFBbUI7YUFDOUI7Ozs7WUEvQkMsT0FBTztZQWZQLFVBQVU7WUFNVixnQkFBZ0I7WUFPRSxjQUFjLHVCQTJFN0IsUUFBUTtZQS9FWCxpQkFBaUI7OzsyQkF1Q2hCLFdBQVcsU0FBQyxvQkFBb0I7c0JBc0JoQyxLQUFLLFNBQUMsc0JBQXNCOzRCQUc1QixLQUFLLFNBQUMsb0JBQW9COzJCQUcxQixLQUFLLFNBQUMscUJBQXFCOzRCQUczQixNQUFNOzRCQUdOLE1BQU07c0JBaUNOLFlBQVksU0FBQyxPQUFPLEVBQUUsQ0FBQyxRQUFRLENBQUM7MkJBT2hDLFlBQVksU0FBQyxZQUFZLEVBQUUsQ0FBQyxRQUFRLENBQUM7MkJBVXJDLFlBQVksU0FBQyxZQUFZLEVBQUUsQ0FBQyxRQUFRLENBQUM7K0JBNlhyQyxZQUFZLFNBQUMsV0FBVyxFQUFFLENBQUMsUUFBUSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgQWZ0ZXJWaWV3SW5pdCxcbiAgRGlyZWN0aXZlLFxuICBFbGVtZW50UmVmLFxuICBFdmVudEVtaXR0ZXIsXG4gIElucHV0LFxuICBPbkRlc3Ryb3ksXG4gIE9wdGlvbmFsLFxuICBPdXRwdXQsXG4gIFZpZXdDb250YWluZXJSZWYsXG4gIEhvc3RMaXN0ZW5lcixcbiAgSG9zdEJpbmRpbmcsXG4gIENoYW5nZURldGVjdG9yUmVmLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgaXNGYWtlTW91c2Vkb3duRnJvbVNjcmVlblJlYWRlciB9IGZyb20gJ0Bhbmd1bGFyL2Nkay9hMTF5JztcbmltcG9ydCB7IERpcmVjdGlvbiwgRGlyZWN0aW9uYWxpdHkgfSBmcm9tICdAYW5ndWxhci9jZGsvYmlkaSc7XG5pbXBvcnQge1xuICBPdmVybGF5LFxuICBPdmVybGF5UmVmLFxuICBPdmVybGF5Q29uZmlnLFxuICBIb3Jpem9udGFsQ29ubmVjdGlvblBvcyxcbiAgVmVydGljYWxDb25uZWN0aW9uUG9zLFxuICBGbGV4aWJsZUNvbm5lY3RlZFBvc2l0aW9uU3RyYXRlZ3ksXG4gIFNjcm9sbFN0cmF0ZWd5LFxuICBDb25uZWN0ZWRQb3NpdGlvbixcbn0gZnJvbSAnQGFuZ3VsYXIvY2RrL292ZXJsYXknO1xuaW1wb3J0IHsgVGVtcGxhdGVQb3J0YWwgfSBmcm9tICdAYW5ndWxhci9jZGsvcG9ydGFsJztcblxuaW1wb3J0IHsgU3Vic2NyaXB0aW9uLCBTdWJqZWN0IH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyB0YWtlVW50aWwgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbmltcG9ydCB7IE10eFBvcG92ZXJQYW5lbCwgTXR4VGFyZ2V0IH0gZnJvbSAnLi9wb3BvdmVyLWludGVyZmFjZXMnO1xuaW1wb3J0IHtcbiAgTXR4UG9wb3ZlclRyaWdnZXJFdmVudCxcbiAgTXR4UG9wb3ZlclNjcm9sbFN0cmF0ZWd5LFxuICBNdHhQb3BvdmVyUG9zaXRpb24sXG4gIE10eFBvcG92ZXJQb3NpdGlvblN0YXJ0LFxufSBmcm9tICcuL3BvcG92ZXItdHlwZXMnO1xuaW1wb3J0IHsgdGhyb3dNdHhQb3BvdmVyTWlzc2luZ0Vycm9yIH0gZnJvbSAnLi9wb3BvdmVyLWVycm9ycyc7XG5cbi8qKlxuICogVGhpcyBkaXJlY3RpdmUgaXMgaW50ZW5kZWQgdG8gYmUgdXNlZCBpbiBjb25qdW5jdGlvbiB3aXRoIGFuIG10eC1wb3BvdmVyIHRhZy4gSXQgaXNcbiAqIHJlc3BvbnNpYmxlIGZvciB0b2dnbGluZyB0aGUgZGlzcGxheSBvZiB0aGUgcHJvdmlkZWQgcG9wb3ZlciBpbnN0YW5jZS5cbiAqL1xuXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdbbXR4UG9wb3ZlclRyaWdnZXJGb3JdJyxcbiAgZXhwb3J0QXM6ICdtdHhQb3BvdmVyVHJpZ2dlcicsXG59KVxuZXhwb3J0IGNsYXNzIE10eFBvcG92ZXJUcmlnZ2VyIGltcGxlbWVudHMgQWZ0ZXJWaWV3SW5pdCwgT25EZXN0cm95IHtcbiAgQEhvc3RCaW5kaW5nKCdhdHRyLmFyaWEtaGFzcG9wdXAnKSBhcmlhSGFzcG9wdXAgPSB0cnVlO1xuXG4gIHBvcG92ZXJPcGVuZWQkID0gbmV3IFN1YmplY3Q8dm9pZD4oKTtcbiAgcG9wb3ZlckNsb3NlZCQgPSBuZXcgU3ViamVjdDx2b2lkPigpO1xuXG4gIHByaXZhdGUgX3BvcnRhbDogVGVtcGxhdGVQb3J0YWw8YW55PjtcbiAgcHJpdmF0ZSBfb3ZlcmxheVJlZjogT3ZlcmxheVJlZiB8IG51bGwgPSBudWxsO1xuICBwcml2YXRlIF9wb3BvdmVyT3BlbiA9IGZhbHNlO1xuICBwcml2YXRlIF9oYWx0ID0gZmFsc2U7XG4gIHByaXZhdGUgX2JhY2tkcm9wU3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb247XG4gIHByaXZhdGUgX3Bvc2l0aW9uU3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb247XG4gIHByaXZhdGUgX2RldGFjaG1lbnRzU3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb247XG5cbiAgcHJpdmF0ZSBfbW91c2VvdmVyVGltZXI6IGFueTtcblxuICAvLyB0cmFja2luZyBpbnB1dCB0eXBlIGlzIG5lY2Vzc2FyeSBzbyBpdCdzIHBvc3NpYmxlIHRvIG9ubHkgYXV0by1mb2N1c1xuICAvLyB0aGUgZmlyc3QgaXRlbSBvZiB0aGUgbGlzdCB3aGVuIHRoZSBwb3BvdmVyIGlzIG9wZW5lZCB2aWEgdGhlIGtleWJvYXJkXG4gIHByaXZhdGUgX29wZW5lZEJ5TW91c2UgPSBmYWxzZTtcblxuICBwcml2YXRlIF9vbkRlc3Ryb3kgPSBuZXcgU3ViamVjdDx2b2lkPigpO1xuXG4gIC8qKiBSZWZlcmVuY2VzIHRoZSBwb3BvdmVyIGluc3RhbmNlIHRoYXQgdGhlIHRyaWdnZXIgaXMgYXNzb2NpYXRlZCB3aXRoLiAqL1xuICBASW5wdXQoJ210eFBvcG92ZXJUcmlnZ2VyRm9yJykgcG9wb3ZlcjogTXR4UG9wb3ZlclBhbmVsO1xuXG4gIC8qKiBSZWZlcmVuY2VzIHRoZSBwb3BvdmVyIHRhcmdldCBpbnN0YW5jZSB0aGF0IHRoZSB0cmlnZ2VyIGlzIGFzc29jaWF0ZWQgd2l0aC4gKi9cbiAgQElucHV0KCdtdHhQb3BvdmVyVGFyZ2V0QXQnKSB0YXJnZXRFbGVtZW50OiBNdHhUYXJnZXQ7XG5cbiAgLyoqIFBvcG92ZXIgdHJpZ2dlciBldmVudCAqL1xuICBASW5wdXQoJ210eFBvcG92ZXJUcmlnZ2VyT24nKSB0cmlnZ2VyRXZlbnQ6IE10eFBvcG92ZXJUcmlnZ2VyRXZlbnQ7XG5cbiAgLyoqIEV2ZW50IGVtaXR0ZWQgd2hlbiB0aGUgYXNzb2NpYXRlZCBwb3BvdmVyIGlzIG9wZW5lZC4gKi9cbiAgQE91dHB1dCgpIHBvcG92ZXJPcGVuZWQgPSBuZXcgRXZlbnRFbWl0dGVyPHZvaWQ+KCk7XG5cbiAgLyoqIEV2ZW50IGVtaXR0ZWQgd2hlbiB0aGUgYXNzb2NpYXRlZCBwb3BvdmVyIGlzIGNsb3NlZC4gKi9cbiAgQE91dHB1dCgpIHBvcG92ZXJDbG9zZWQgPSBuZXcgRXZlbnRFbWl0dGVyPHZvaWQ+KCk7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBfb3ZlcmxheTogT3ZlcmxheSxcbiAgICBwdWJsaWMgX2VsZW1lbnRSZWY6IEVsZW1lbnRSZWYsXG4gICAgcHJpdmF0ZSBfdmlld0NvbnRhaW5lclJlZjogVmlld0NvbnRhaW5lclJlZixcbiAgICBAT3B0aW9uYWwoKSBwcml2YXRlIF9kaXI6IERpcmVjdGlvbmFsaXR5LFxuICAgIHByaXZhdGUgX2NoYW5nZURldGVjdG9yUmVmOiBDaGFuZ2VEZXRlY3RvclJlZlxuICApIHt9XG5cbiAgbmdBZnRlclZpZXdJbml0KCkge1xuICAgIHRoaXMuX2NoZWNrUG9wb3ZlcigpO1xuICAgIHRoaXMuX3NldEN1cnJlbnRDb25maWcoKTtcbiAgICB0aGlzLnBvcG92ZXIuY2xvc2VkLnN1YnNjcmliZSgoKSA9PiB0aGlzLmNsb3NlUG9wb3ZlcigpKTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMuZGVzdHJveVBvcG92ZXIoKTtcbiAgfVxuXG4gIHByaXZhdGUgX3NldEN1cnJlbnRDb25maWcoKSB7XG4gICAgaWYgKHRoaXMudHJpZ2dlckV2ZW50KSB7XG4gICAgICB0aGlzLnBvcG92ZXIudHJpZ2dlckV2ZW50ID0gdGhpcy50cmlnZ2VyRXZlbnQ7XG4gICAgfVxuXG4gICAgdGhpcy5wb3BvdmVyLnNldEN1cnJlbnRTdHlsZXMoKTtcbiAgfVxuXG4gIC8qKiBXaGV0aGVyIHRoZSBwb3BvdmVyIGlzIG9wZW4uICovXG4gIGdldCBwb3BvdmVyT3BlbigpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fcG9wb3Zlck9wZW47XG4gIH1cblxuICBASG9zdExpc3RlbmVyKCdjbGljaycsIFsnJGV2ZW50J10pXG4gIG9uQ2xpY2soZXZlbnQ6IE1vdXNlRXZlbnQpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5wb3BvdmVyLnRyaWdnZXJFdmVudCA9PT0gJ2NsaWNrJykge1xuICAgICAgdGhpcy50b2dnbGVQb3BvdmVyKCk7XG4gICAgfVxuICB9XG5cbiAgQEhvc3RMaXN0ZW5lcignbW91c2VlbnRlcicsIFsnJGV2ZW50J10pXG4gIG9uTW91c2VFbnRlcihldmVudDogTW91c2VFdmVudCk6IHZvaWQge1xuICAgIHRoaXMuX2hhbHQgPSBmYWxzZTtcbiAgICBpZiAodGhpcy5wb3BvdmVyLnRyaWdnZXJFdmVudCA9PT0gJ2hvdmVyJykge1xuICAgICAgdGhpcy5fbW91c2VvdmVyVGltZXIgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgdGhpcy5vcGVuUG9wb3ZlcigpO1xuICAgICAgfSwgdGhpcy5wb3BvdmVyLmVudGVyRGVsYXkpO1xuICAgIH1cbiAgfVxuXG4gIEBIb3N0TGlzdGVuZXIoJ21vdXNlbGVhdmUnLCBbJyRldmVudCddKVxuICBvbk1vdXNlTGVhdmUoZXZlbnQ6IE1vdXNlRXZlbnQpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5wb3BvdmVyLnRyaWdnZXJFdmVudCA9PT0gJ2hvdmVyJykge1xuICAgICAgaWYgKHRoaXMuX21vdXNlb3ZlclRpbWVyKSB7XG4gICAgICAgIGNsZWFyVGltZW91dCh0aGlzLl9tb3VzZW92ZXJUaW1lcik7XG4gICAgICAgIHRoaXMuX21vdXNlb3ZlclRpbWVyID0gbnVsbDtcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLl9wb3BvdmVyT3Blbikge1xuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICBpZiAoIXRoaXMucG9wb3Zlci5jbG9zZURpc2FibGVkKSB7XG4gICAgICAgICAgICB0aGlzLmNsb3NlUG9wb3ZlcigpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSwgdGhpcy5wb3BvdmVyLmxlYXZlRGVsYXkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5faGFsdCA9IHRydWU7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqIFRvZ2dsZXMgdGhlIHBvcG92ZXIgYmV0d2VlbiB0aGUgb3BlbiBhbmQgY2xvc2VkIHN0YXRlcy4gKi9cbiAgdG9nZ2xlUG9wb3ZlcigpOiB2b2lkIHtcbiAgICByZXR1cm4gdGhpcy5fcG9wb3Zlck9wZW4gPyB0aGlzLmNsb3NlUG9wb3ZlcigpIDogdGhpcy5vcGVuUG9wb3ZlcigpO1xuICB9XG5cbiAgLyoqIE9wZW5zIHRoZSBwb3BvdmVyLiAqL1xuICBvcGVuUG9wb3ZlcigpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMuX3BvcG92ZXJPcGVuICYmICF0aGlzLl9oYWx0KSB7XG4gICAgICB0aGlzLl9jcmVhdGVPdmVybGF5KCkuYXR0YWNoKHRoaXMuX3BvcnRhbCk7XG5cbiAgICAgIHRoaXMuX3N1YnNjcmliZVRvQmFja2Ryb3AoKTtcbiAgICAgIHRoaXMuX3N1YnNjcmliZVRvRGV0YWNobWVudHMoKTtcblxuICAgICAgdGhpcy5faW5pdFBvcG92ZXIoKTtcbiAgICB9XG4gIH1cblxuICAvKiogQ2xvc2VzIHRoZSBwb3BvdmVyLiAqL1xuICBjbG9zZVBvcG92ZXIoKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuX292ZXJsYXlSZWYpIHtcbiAgICAgIHRoaXMuX292ZXJsYXlSZWYuZGV0YWNoKCk7XG4gICAgICB0aGlzLl9yZXNldFBvcG92ZXIoKTtcbiAgICB9XG5cbiAgICB0aGlzLmRlc3Ryb3lQb3BvdmVyKCk7XG4gIH1cblxuICAvKiogUmVtb3ZlcyB0aGUgcG9wb3ZlciBmcm9tIHRoZSBET00uICovXG4gIGRlc3Ryb3lQb3BvdmVyKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLl9tb3VzZW92ZXJUaW1lcikge1xuICAgICAgY2xlYXJUaW1lb3V0KHRoaXMuX21vdXNlb3ZlclRpbWVyKTtcbiAgICAgIHRoaXMuX21vdXNlb3ZlclRpbWVyID0gbnVsbDtcbiAgICB9XG4gICAgaWYgKHRoaXMuX292ZXJsYXlSZWYpIHtcbiAgICAgIHRoaXMuX292ZXJsYXlSZWYuZGlzcG9zZSgpO1xuICAgICAgdGhpcy5fb3ZlcmxheVJlZiA9IG51bGw7XG4gICAgICB0aGlzLl9jbGVhblVwU3Vic2NyaXB0aW9ucygpO1xuICAgIH1cblxuICAgIHRoaXMuX29uRGVzdHJveS5uZXh0KCk7XG4gICAgdGhpcy5fb25EZXN0cm95LmNvbXBsZXRlKCk7XG4gIH1cblxuICAvKiogRm9jdXNlcyB0aGUgcG9wb3ZlciB0cmlnZ2VyLiAqL1xuICBmb2N1cygpIHtcbiAgICB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuZm9jdXMoKTtcbiAgfVxuXG4gIC8qKiBUaGUgdGV4dCBkaXJlY3Rpb24gb2YgdGhlIGNvbnRhaW5pbmcgYXBwLiAqL1xuICBnZXQgZGlyKCk6IERpcmVjdGlvbiB7XG4gICAgcmV0dXJuIHRoaXMuX2RpciAmJiB0aGlzLl9kaXIudmFsdWUgPT09ICdydGwnID8gJ3J0bCcgOiAnbHRyJztcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGlzIG1ldGhvZCBlbnN1cmVzIHRoYXQgdGhlIHBvcG92ZXIgY2xvc2VzIHdoZW4gdGhlIG92ZXJsYXkgYmFja2Ryb3AgaXMgY2xpY2tlZC5cbiAgICogV2UgZG8gbm90IHVzZSBmaXJzdCgpIGhlcmUgYmVjYXVzZSBkb2luZyBzbyB3b3VsZCBub3QgY2F0Y2ggY2xpY2tzIGZyb20gd2l0aGluXG4gICAqIHRoZSBwb3BvdmVyLCBhbmQgaXQgd291bGQgZmFpbCB0byB1bnN1YnNjcmliZSBwcm9wZXJseS4gSW5zdGVhZCwgd2UgdW5zdWJzY3JpYmVcbiAgICogZXhwbGljaXRseSB3aGVuIHRoZSBwb3BvdmVyIGlzIGNsb3NlZCBvciBkZXN0cm95ZWQuXG4gICAqL1xuICBwcml2YXRlIF9zdWJzY3JpYmVUb0JhY2tkcm9wKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLl9vdmVybGF5UmVmKSB7XG4gICAgICAvKiogT25seSBzdWJzY3JpYmUgdG8gYmFja2Ryb3AgaWYgdHJpZ2dlciBldmVudCBpcyBjbGljayAqL1xuICAgICAgaWYgKHRoaXMudHJpZ2dlckV2ZW50ID09PSAnY2xpY2snICYmIHRoaXMucG9wb3Zlci5jbG9zZU9uQmFja2Ryb3BDbGljayA9PT0gdHJ1ZSkge1xuICAgICAgICB0aGlzLl9vdmVybGF5UmVmXG4gICAgICAgICAgLmJhY2tkcm9wQ2xpY2soKVxuICAgICAgICAgIC5waXBlKHRha2VVbnRpbCh0aGlzLnBvcG92ZXJDbG9zZWQkKSwgdGFrZVVudGlsKHRoaXMuX29uRGVzdHJveSkpXG4gICAgICAgICAgLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnBvcG92ZXIuX2VtaXRDbG9zZUV2ZW50KCk7XG4gICAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBfc3Vic2NyaWJlVG9EZXRhY2htZW50cygpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5fb3ZlcmxheVJlZikge1xuICAgICAgdGhpcy5fb3ZlcmxheVJlZlxuICAgICAgICAuZGV0YWNobWVudHMoKVxuICAgICAgICAucGlwZSh0YWtlVW50aWwodGhpcy5wb3BvdmVyQ2xvc2VkJCksIHRha2VVbnRpbCh0aGlzLl9vbkRlc3Ryb3kpKVxuICAgICAgICAuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgICB0aGlzLl9zZXRQb3BvdmVyQ2xvc2VkKCk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBUaGlzIG1ldGhvZCBzZXRzIHRoZSBwb3BvdmVyIHN0YXRlIHRvIG9wZW4gYW5kIGZvY3VzZXMgdGhlIGZpcnN0IGl0ZW0gaWZcbiAgICogdGhlIHBvcG92ZXIgd2FzIG9wZW5lZCB2aWEgdGhlIGtleWJvYXJkLlxuICAgKi9cbiAgcHJpdmF0ZSBfaW5pdFBvcG92ZXIoKTogdm9pZCB7XG4gICAgdGhpcy5fc2V0UG9wb3Zlck9wZW5lZCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoaXMgbWV0aG9kIHJlc2V0cyB0aGUgcG9wb3ZlciB3aGVuIGl0J3MgY2xvc2VkLCBtb3N0IGltcG9ydGFudGx5IHJlc3RvcmluZ1xuICAgKiBmb2N1cyB0byB0aGUgcG9wb3ZlciB0cmlnZ2VyIGlmIHRoZSBwb3BvdmVyIHdhcyBvcGVuZWQgdmlhIHRoZSBrZXlib2FyZC5cbiAgICovXG4gIHByaXZhdGUgX3Jlc2V0UG9wb3ZlcigpOiB2b2lkIHtcbiAgICB0aGlzLl9zZXRQb3BvdmVyQ2xvc2VkKCk7XG5cbiAgICAvLyBGb2N1cyBvbmx5IG5lZWRzIHRvIGJlIHJlc2V0IHRvIHRoZSBob3N0IGVsZW1lbnQgaWYgdGhlIHBvcG92ZXIgd2FzIG9wZW5lZFxuICAgIC8vIGJ5IHRoZSBrZXlib2FyZCBhbmQgbWFudWFsbHkgc2hpZnRlZCB0byB0aGUgZmlyc3QgcG9wb3ZlciBpdGVtLlxuICAgIGlmICghdGhpcy5fb3BlbmVkQnlNb3VzZSkge1xuICAgICAgdGhpcy5mb2N1cygpO1xuICAgIH1cbiAgICB0aGlzLl9vcGVuZWRCeU1vdXNlID0gZmFsc2U7XG4gIH1cblxuICAvKiogc2V0IHN0YXRlIHJhdGhlciB0aGFuIHRvZ2dsZSB0byBzdXBwb3J0IHRyaWdnZXJzIHNoYXJpbmcgYSBwb3BvdmVyICovXG4gIHByaXZhdGUgX3NldFBvcG92ZXJPcGVuZWQoKTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLl9wb3BvdmVyT3Blbikge1xuICAgICAgdGhpcy5fcG9wb3Zlck9wZW4gPSB0cnVlO1xuXG4gICAgICB0aGlzLnBvcG92ZXJPcGVuZWQkLm5leHQoKTtcbiAgICAgIHRoaXMucG9wb3Zlck9wZW5lZC5lbWl0KCk7XG4gICAgfVxuICB9XG5cbiAgLyoqIHNldCBzdGF0ZSByYXRoZXIgdGhhbiB0b2dnbGUgdG8gc3VwcG9ydCB0cmlnZ2VycyBzaGFyaW5nIGEgcG9wb3ZlciAqL1xuICBwcml2YXRlIF9zZXRQb3BvdmVyQ2xvc2VkKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLl9wb3BvdmVyT3Blbikge1xuICAgICAgdGhpcy5fcG9wb3Zlck9wZW4gPSBmYWxzZTtcblxuICAgICAgdGhpcy5wb3BvdmVyQ2xvc2VkJC5uZXh0KCk7XG4gICAgICB0aGlzLnBvcG92ZXJDbG9zZWQuZW1pdCgpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiAgVGhpcyBtZXRob2QgY2hlY2tzIHRoYXQgYSB2YWxpZCBpbnN0YW5jZSBvZiBNZFBvcG92ZXIgaGFzIGJlZW4gcGFzc2VkIGludG9cbiAgICogIG1kUG9wb3ZlclRyaWdnZXJGb3IuIElmIG5vdCwgYW4gZXhjZXB0aW9uIGlzIHRocm93bi5cbiAgICovXG4gIHByaXZhdGUgX2NoZWNrUG9wb3ZlcigpIHtcbiAgICBpZiAoIXRoaXMucG9wb3Zlcikge1xuICAgICAgdGhyb3dNdHhQb3BvdmVyTWlzc2luZ0Vycm9yKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqICBUaGlzIG1ldGhvZCBjcmVhdGVzIHRoZSBvdmVybGF5IGZyb20gdGhlIHByb3ZpZGVkIHBvcG92ZXIncyB0ZW1wbGF0ZSBhbmQgc2F2ZXMgaXRzXG4gICAqICBPdmVybGF5UmVmIHNvIHRoYXQgaXQgY2FuIGJlIGF0dGFjaGVkIHRvIHRoZSBET00gd2hlbiBvcGVuUG9wb3ZlciBpcyBjYWxsZWQuXG4gICAqL1xuICBwcml2YXRlIF9jcmVhdGVPdmVybGF5KCk6IE92ZXJsYXlSZWYge1xuICAgIGlmICghdGhpcy5fb3ZlcmxheVJlZikge1xuICAgICAgdGhpcy5fcG9ydGFsID0gbmV3IFRlbXBsYXRlUG9ydGFsKHRoaXMucG9wb3Zlci50ZW1wbGF0ZVJlZiwgdGhpcy5fdmlld0NvbnRhaW5lclJlZik7XG4gICAgICBjb25zdCBjb25maWcgPSB0aGlzLl9nZXRPdmVybGF5Q29uZmlnKCk7XG4gICAgICB0aGlzLl9zdWJzY3JpYmVUb1Bvc2l0aW9ucyhjb25maWcucG9zaXRpb25TdHJhdGVneSBhcyBGbGV4aWJsZUNvbm5lY3RlZFBvc2l0aW9uU3RyYXRlZ3kpO1xuICAgICAgdGhpcy5fb3ZlcmxheVJlZiA9IHRoaXMuX292ZXJsYXkuY3JlYXRlKGNvbmZpZyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuX292ZXJsYXlSZWY7XG4gIH1cblxuICAvKipcbiAgICogVGhpcyBtZXRob2QgYnVpbGRzIHRoZSBjb25maWd1cmF0aW9uIG9iamVjdCBuZWVkZWQgdG8gY3JlYXRlIHRoZSBvdmVybGF5LCB0aGUgT3ZlcmxheUNvbmZpZy5cbiAgICogQHJldHVybnMgT3ZlcmxheUNvbmZpZ1xuICAgKi9cbiAgcHJpdmF0ZSBfZ2V0T3ZlcmxheUNvbmZpZygpOiBPdmVybGF5Q29uZmlnIHtcbiAgICBjb25zdCBvdmVybGF5U3RhdGUgPSBuZXcgT3ZlcmxheUNvbmZpZygpO1xuICAgIG92ZXJsYXlTdGF0ZS5wb3NpdGlvblN0cmF0ZWd5ID0gdGhpcy5fZ2V0UG9zaXRpb24oKTtcblxuICAgIC8qKiBEaXNwbGF5IG92ZXJsYXkgYmFja2Ryb3AgaWYgdHJpZ2dlciBldmVudCBpcyBjbGljayAqL1xuICAgIGlmICh0aGlzLnRyaWdnZXJFdmVudCA9PT0gJ2NsaWNrJykge1xuICAgICAgb3ZlcmxheVN0YXRlLmhhc0JhY2tkcm9wID0gdHJ1ZTtcbiAgICAgIG92ZXJsYXlTdGF0ZS5iYWNrZHJvcENsYXNzID0gJ2Nkay1vdmVybGF5LXRyYW5zcGFyZW50LWJhY2tkcm9wJztcbiAgICB9XG5cbiAgICBvdmVybGF5U3RhdGUuZGlyZWN0aW9uID0gdGhpcy5fZGlyO1xuICAgIG92ZXJsYXlTdGF0ZS5zY3JvbGxTdHJhdGVneSA9IHRoaXMuX2dldE92ZXJsYXlTY3JvbGxTdHJhdGVneSh0aGlzLnBvcG92ZXIuc2Nyb2xsU3RyYXRlZ3kpO1xuXG4gICAgcmV0dXJuIG92ZXJsYXlTdGF0ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGlzIG1ldGhvZCByZXR1cm5zIHRoZSBzY3JvbGwgc3RyYXRlZ3kgdXNlZCBieSB0aGUgY2RrL292ZXJsYXkuXG4gICAqL1xuICBwcml2YXRlIF9nZXRPdmVybGF5U2Nyb2xsU3RyYXRlZ3koc3RyYXRlZ3k6IE10eFBvcG92ZXJTY3JvbGxTdHJhdGVneSk6IFNjcm9sbFN0cmF0ZWd5IHtcbiAgICBzd2l0Y2ggKHN0cmF0ZWd5KSB7XG4gICAgICBjYXNlICdub29wJzpcbiAgICAgICAgcmV0dXJuIHRoaXMuX292ZXJsYXkuc2Nyb2xsU3RyYXRlZ2llcy5ub29wKCk7XG4gICAgICBjYXNlICdjbG9zZSc6XG4gICAgICAgIHJldHVybiB0aGlzLl9vdmVybGF5LnNjcm9sbFN0cmF0ZWdpZXMuY2xvc2UoKTtcbiAgICAgIGNhc2UgJ2Jsb2NrJzpcbiAgICAgICAgcmV0dXJuIHRoaXMuX292ZXJsYXkuc2Nyb2xsU3RyYXRlZ2llcy5ibG9jaygpO1xuICAgICAgY2FzZSAncmVwb3NpdGlvbic6XG4gICAgICBkZWZhdWx0OlxuICAgICAgICByZXR1cm4gdGhpcy5fb3ZlcmxheS5zY3JvbGxTdHJhdGVnaWVzLnJlcG9zaXRpb24oKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogTGlzdGVucyB0byBjaGFuZ2VzIGluIHRoZSBwb3NpdGlvbiBvZiB0aGUgb3ZlcmxheSBhbmQgc2V0cyB0aGUgY29ycmVjdCBjbGFzc2VzXG4gICAqIG9uIHRoZSBwb3BvdmVyIGJhc2VkIG9uIHRoZSBuZXcgcG9zaXRpb24uIFRoaXMgZW5zdXJlcyB0aGUgYW5pbWF0aW9uIG9yaWdpbiBpcyBhbHdheXNcbiAgICogY29ycmVjdCwgZXZlbiBpZiBhIGZhbGxiYWNrIHBvc2l0aW9uIGlzIHVzZWQgZm9yIHRoZSBvdmVybGF5LlxuICAgKi9cbiAgcHJpdmF0ZSBfc3Vic2NyaWJlVG9Qb3NpdGlvbnMocG9zaXRpb246IEZsZXhpYmxlQ29ubmVjdGVkUG9zaXRpb25TdHJhdGVneSk6IHZvaWQge1xuICAgIHRoaXMuX3Bvc2l0aW9uU3Vic2NyaXB0aW9uID0gcG9zaXRpb24ucG9zaXRpb25DaGFuZ2VzLnN1YnNjcmliZShjaGFuZ2UgPT4ge1xuICAgICAgY29uc3QgcG9zWCA9XG4gICAgICAgIGNoYW5nZS5jb25uZWN0aW9uUGFpci5vdmVybGF5WCA9PT0gJ3N0YXJ0J1xuICAgICAgICAgID8gJ2FmdGVyJ1xuICAgICAgICAgIDogY2hhbmdlLmNvbm5lY3Rpb25QYWlyLm92ZXJsYXlYID09PSAnZW5kJ1xuICAgICAgICAgID8gJ2JlZm9yZSdcbiAgICAgICAgICA6ICdjZW50ZXInO1xuICAgICAgY29uc3QgcG9zWSA9XG4gICAgICAgIGNoYW5nZS5jb25uZWN0aW9uUGFpci5vdmVybGF5WSA9PT0gJ3RvcCdcbiAgICAgICAgICA/ICdiZWxvdydcbiAgICAgICAgICA6IGNoYW5nZS5jb25uZWN0aW9uUGFpci5vdmVybGF5WSA9PT0gJ2JvdHRvbSdcbiAgICAgICAgICA/ICdhYm92ZSdcbiAgICAgICAgICA6ICdjZW50ZXInO1xuXG4gICAgICBjb25zdCBwb3M6IE10eFBvcG92ZXJQb3NpdGlvbiA9XG4gICAgICAgIHRoaXMucG9wb3Zlci5wb3NpdGlvblswXSA9PT0gJ2Fib3ZlJyB8fCB0aGlzLnBvcG92ZXIucG9zaXRpb25bMF0gPT09ICdiZWxvdydcbiAgICAgICAgICA/IFtwb3NZIGFzIE10eFBvcG92ZXJQb3NpdGlvblN0YXJ0LCBwb3NYXVxuICAgICAgICAgIDogW3Bvc1ggYXMgTXR4UG9wb3ZlclBvc2l0aW9uU3RhcnQsIHBvc1ldO1xuXG4gICAgICAvLyByZXF1aXJlZCBmb3IgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoXG4gICAgICB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKTtcblxuICAgICAgdGhpcy5wb3BvdmVyLnpvbmUucnVuKCgpID0+IHtcbiAgICAgICAgdGhpcy5wb3BvdmVyLnNldEN1cnJlbnRTdHlsZXMocG9zKTtcbiAgICAgICAgdGhpcy5wb3BvdmVyLnNldFBvc2l0aW9uQ2xhc3Nlcyhwb3MpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogVGhpcyBtZXRob2QgYnVpbGRzIHRoZSBwb3NpdGlvbiBzdHJhdGVneSBmb3IgdGhlIG92ZXJsYXksIHNvIHRoZSBwb3BvdmVyIGlzIHByb3Blcmx5IGNvbm5lY3RlZFxuICAgKiB0byB0aGUgdHJpZ2dlci5cbiAgICogQHJldHVybnMgQ29ubmVjdGVkUG9zaXRpb25TdHJhdGVneVxuICAgKi9cbiAgcHJpdmF0ZSBfZ2V0UG9zaXRpb24oKTogRmxleGlibGVDb25uZWN0ZWRQb3NpdGlvblN0cmF0ZWd5IHtcbiAgICBjb25zdCBbb3JpZ2luWCwgb3JpZ2luMm5kWCwgb3JpZ2luM3JkWF06IEhvcml6b250YWxDb25uZWN0aW9uUG9zW10gPVxuICAgICAgdGhpcy5wb3BvdmVyLnBvc2l0aW9uWzBdID09PSAnYmVmb3JlJyB8fCB0aGlzLnBvcG92ZXIucG9zaXRpb25bMV0gPT09ICdhZnRlcidcbiAgICAgICAgPyBbJ3N0YXJ0JywgJ2NlbnRlcicsICdlbmQnXVxuICAgICAgICA6IHRoaXMucG9wb3Zlci5wb3NpdGlvblswXSA9PT0gJ2FmdGVyJyB8fCB0aGlzLnBvcG92ZXIucG9zaXRpb25bMV0gPT09ICdiZWZvcmUnXG4gICAgICAgID8gWydlbmQnLCAnY2VudGVyJywgJ3N0YXJ0J11cbiAgICAgICAgOiBbJ2NlbnRlcicsICdzdGFydCcsICdlbmQnXTtcblxuICAgIGNvbnN0IFtvcmlnaW5ZLCBvcmlnaW4ybmRZLCBvcmlnaW4zcmRZXTogVmVydGljYWxDb25uZWN0aW9uUG9zW10gPVxuICAgICAgdGhpcy5wb3BvdmVyLnBvc2l0aW9uWzBdID09PSAnYWJvdmUnIHx8IHRoaXMucG9wb3Zlci5wb3NpdGlvblsxXSA9PT0gJ2JlbG93J1xuICAgICAgICA/IFsndG9wJywgJ2NlbnRlcicsICdib3R0b20nXVxuICAgICAgICA6IHRoaXMucG9wb3Zlci5wb3NpdGlvblswXSA9PT0gJ2JlbG93JyB8fCB0aGlzLnBvcG92ZXIucG9zaXRpb25bMV0gPT09ICdhYm92ZSdcbiAgICAgICAgPyBbJ2JvdHRvbScsICdjZW50ZXInLCAndG9wJ11cbiAgICAgICAgOiBbJ2NlbnRlcicsICd0b3AnLCAnYm90dG9tJ107XG5cbiAgICBjb25zdCBbb3ZlcmxheVgsIG92ZXJsYXlGYWxsYmFja1hdOiBIb3Jpem9udGFsQ29ubmVjdGlvblBvc1tdID1cbiAgICAgIHRoaXMucG9wb3Zlci5wb3NpdGlvblswXSA9PT0gJ2JlbG93JyB8fCB0aGlzLnBvcG92ZXIucG9zaXRpb25bMF0gPT09ICdhYm92ZSdcbiAgICAgICAgPyBbb3JpZ2luWCwgb3JpZ2luWF1cbiAgICAgICAgOiB0aGlzLnBvcG92ZXIucG9zaXRpb25bMF0gPT09ICdiZWZvcmUnXG4gICAgICAgID8gWydlbmQnLCAnc3RhcnQnXVxuICAgICAgICA6IFsnc3RhcnQnLCAnZW5kJ107XG5cbiAgICBjb25zdCBbb3ZlcmxheVksIG92ZXJsYXlGYWxsYmFja1ldOiBWZXJ0aWNhbENvbm5lY3Rpb25Qb3NbXSA9XG4gICAgICB0aGlzLnBvcG92ZXIucG9zaXRpb25bMF0gPT09ICdiZWZvcmUnIHx8IHRoaXMucG9wb3Zlci5wb3NpdGlvblswXSA9PT0gJ2FmdGVyJ1xuICAgICAgICA/IFtvcmlnaW5ZLCBvcmlnaW5ZXVxuICAgICAgICA6IHRoaXMucG9wb3Zlci5wb3NpdGlvblswXSA9PT0gJ2JlbG93J1xuICAgICAgICA/IFsndG9wJywgJ2JvdHRvbSddXG4gICAgICAgIDogWydib3R0b20nLCAndG9wJ107XG5cbiAgICBjb25zdCBvcmlnaW5GYWxsYmFja1ggPSBvdmVybGF5WDtcbiAgICBjb25zdCBvcmlnaW5GYWxsYmFja1kgPSBvdmVybGF5WTtcblxuICAgIGNvbnN0IG9mZnNldFggPVxuICAgICAgdGhpcy5wb3BvdmVyLnhPZmZzZXQgJiYgIWlzTmFOKE51bWJlcih0aGlzLnBvcG92ZXIueE9mZnNldCkpXG4gICAgICAgID8gTnVtYmVyKHRoaXMuZGlyID09PSAnbHRyJyA/IHRoaXMucG9wb3Zlci54T2Zmc2V0IDogLXRoaXMucG9wb3Zlci54T2Zmc2V0KVxuICAgICAgICA6IDA7XG4gICAgY29uc3Qgb2Zmc2V0WSA9XG4gICAgICB0aGlzLnBvcG92ZXIueU9mZnNldCAmJiAhaXNOYU4oTnVtYmVyKHRoaXMucG9wb3Zlci55T2Zmc2V0KSlcbiAgICAgICAgPyBOdW1iZXIodGhpcy5wb3BvdmVyLnlPZmZzZXQpXG4gICAgICAgIDogMDtcblxuICAgIC8qKlxuICAgICAqIEZvciBvdmVycmlkaW5nIHBvc2l0aW9uIGVsZW1lbnQsIHdoZW4gYG10eFBvcG92ZXJUYXJnZXRBdGAgaGFzIGEgdmFsaWQgZWxlbWVudCByZWZlcmVuY2UuXG4gICAgICogVXNlZnVsIGZvciBzdGlja2luZyBwb3BvdmVyIHRvIHBhcmVudCBlbGVtZW50IGFuZCBvZmZzZXR0aW5nIGFycm93IHRvIHRyaWdnZXIgZWxlbWVudC5cbiAgICAgKiBJZiB1bmRlZmluZWQgZGVmYXVsdHMgdG8gdGhlIHRyaWdnZXIgZWxlbWVudCByZWZlcmVuY2UuXG4gICAgICovXG4gICAgbGV0IGVsZW1lbnQgPSB0aGlzLl9lbGVtZW50UmVmO1xuICAgIGlmICh0eXBlb2YgdGhpcy50YXJnZXRFbGVtZW50ICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgdGhpcy5wb3BvdmVyLmNvbnRhaW5lclBvc2l0aW9uaW5nID0gdHJ1ZTtcbiAgICAgIGVsZW1lbnQgPSB0aGlzLnRhcmdldEVsZW1lbnQuX2VsZW1lbnRSZWY7XG4gICAgfVxuXG4gICAgbGV0IHBvc2l0aW9uczogQ29ubmVjdGVkUG9zaXRpb25bXSA9IFt7IG9yaWdpblgsIG9yaWdpblksIG92ZXJsYXlYLCBvdmVybGF5WSB9XTtcblxuICAgIGlmICh0aGlzLnBvcG92ZXIucG9zaXRpb25bMF0gPT09ICdhYm92ZScgfHwgdGhpcy5wb3BvdmVyLnBvc2l0aW9uWzBdID09PSAnYmVsb3cnKSB7XG4gICAgICBwb3NpdGlvbnMgPSBbXG4gICAgICAgIHsgb3JpZ2luWCwgb3JpZ2luWSwgb3ZlcmxheVgsIG92ZXJsYXlZLCBvZmZzZXRZIH0sXG4gICAgICAgIHsgb3JpZ2luWDogb3JpZ2luMm5kWCwgb3JpZ2luWSwgb3ZlcmxheVg6IG9yaWdpbjJuZFgsIG92ZXJsYXlZLCBvZmZzZXRZIH0sXG4gICAgICAgIHsgb3JpZ2luWDogb3JpZ2luM3JkWCwgb3JpZ2luWSwgb3ZlcmxheVg6IG9yaWdpbjNyZFgsIG92ZXJsYXlZLCBvZmZzZXRZIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBvcmlnaW5YLFxuICAgICAgICAgIG9yaWdpblk6IG9yaWdpbkZhbGxiYWNrWSxcbiAgICAgICAgICBvdmVybGF5WCxcbiAgICAgICAgICBvdmVybGF5WTogb3ZlcmxheUZhbGxiYWNrWSxcbiAgICAgICAgICBvZmZzZXRZOiAtb2Zmc2V0WSxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIG9yaWdpblg6IG9yaWdpbjJuZFgsXG4gICAgICAgICAgb3JpZ2luWTogb3JpZ2luRmFsbGJhY2tZLFxuICAgICAgICAgIG92ZXJsYXlYOiBvcmlnaW4ybmRYLFxuICAgICAgICAgIG92ZXJsYXlZOiBvdmVybGF5RmFsbGJhY2tZLFxuICAgICAgICAgIG9mZnNldFk6IC1vZmZzZXRZLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgb3JpZ2luWDogb3JpZ2luM3JkWCxcbiAgICAgICAgICBvcmlnaW5ZOiBvcmlnaW5GYWxsYmFja1ksXG4gICAgICAgICAgb3ZlcmxheVg6IG9yaWdpbjNyZFgsXG4gICAgICAgICAgb3ZlcmxheVk6IG92ZXJsYXlGYWxsYmFja1ksXG4gICAgICAgICAgb2Zmc2V0WTogLW9mZnNldFksXG4gICAgICAgIH0sXG4gICAgICBdO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnBvcG92ZXIucG9zaXRpb25bMF0gPT09ICdiZWZvcmUnIHx8IHRoaXMucG9wb3Zlci5wb3NpdGlvblswXSA9PT0gJ2FmdGVyJykge1xuICAgICAgcG9zaXRpb25zID0gW1xuICAgICAgICB7IG9yaWdpblgsIG9yaWdpblksIG92ZXJsYXlYLCBvdmVybGF5WSwgb2Zmc2V0WCB9LFxuICAgICAgICB7IG9yaWdpblgsIG9yaWdpblk6IG9yaWdpbjJuZFksIG92ZXJsYXlYLCBvdmVybGF5WTogb3JpZ2luMm5kWSwgb2Zmc2V0WCB9LFxuICAgICAgICB7IG9yaWdpblgsIG9yaWdpblk6IG9yaWdpbjNyZFksIG92ZXJsYXlYLCBvdmVybGF5WTogb3JpZ2luM3JkWSwgb2Zmc2V0WCB9LFxuICAgICAgICB7XG4gICAgICAgICAgb3JpZ2luWDogb3JpZ2luRmFsbGJhY2tYLFxuICAgICAgICAgIG9yaWdpblksXG4gICAgICAgICAgb3ZlcmxheVg6IG92ZXJsYXlGYWxsYmFja1gsXG4gICAgICAgICAgb3ZlcmxheVksXG4gICAgICAgICAgb2Zmc2V0WDogLW9mZnNldFgsXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBvcmlnaW5YOiBvcmlnaW5GYWxsYmFja1gsXG4gICAgICAgICAgb3JpZ2luWTogb3JpZ2luMm5kWSxcbiAgICAgICAgICBvdmVybGF5WDogb3ZlcmxheUZhbGxiYWNrWCxcbiAgICAgICAgICBvdmVybGF5WTogb3JpZ2luMm5kWSxcbiAgICAgICAgICBvZmZzZXRYOiAtb2Zmc2V0WCxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIG9yaWdpblg6IG9yaWdpbkZhbGxiYWNrWCxcbiAgICAgICAgICBvcmlnaW5ZOiBvcmlnaW4zcmRZLFxuICAgICAgICAgIG92ZXJsYXlYOiBvdmVybGF5RmFsbGJhY2tYLFxuICAgICAgICAgIG92ZXJsYXlZOiBvcmlnaW4zcmRZLFxuICAgICAgICAgIG9mZnNldFg6IC1vZmZzZXRYLFxuICAgICAgICB9LFxuICAgICAgXTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5fb3ZlcmxheVxuICAgICAgLnBvc2l0aW9uKClcbiAgICAgIC5mbGV4aWJsZUNvbm5lY3RlZFRvKGVsZW1lbnQpXG4gICAgICAud2l0aExvY2tlZFBvc2l0aW9uKClcbiAgICAgIC53aXRoUG9zaXRpb25zKHBvc2l0aW9ucylcbiAgICAgIC53aXRoRGVmYXVsdE9mZnNldFgob2Zmc2V0WClcbiAgICAgIC53aXRoRGVmYXVsdE9mZnNldFkob2Zmc2V0WSk7XG4gIH1cblxuICBwcml2YXRlIF9jbGVhblVwU3Vic2NyaXB0aW9ucygpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5fYmFja2Ryb3BTdWJzY3JpcHRpb24pIHtcbiAgICAgIHRoaXMuX2JhY2tkcm9wU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgfVxuICAgIGlmICh0aGlzLl9wb3NpdGlvblN1YnNjcmlwdGlvbikge1xuICAgICAgdGhpcy5fcG9zaXRpb25TdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICB9XG4gICAgaWYgKHRoaXMuX2RldGFjaG1lbnRzU3Vic2NyaXB0aW9uKSB7XG4gICAgICB0aGlzLl9kZXRhY2htZW50c1N1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgIH1cbiAgfVxuXG4gIEBIb3N0TGlzdGVuZXIoJ21vdXNlZG93bicsIFsnJGV2ZW50J10pIF9oYW5kbGVNb3VzZWRvd24oZXZlbnQ6IE1vdXNlRXZlbnQpOiB2b2lkIHtcbiAgICBpZiAoZXZlbnQgJiYgIWlzRmFrZU1vdXNlZG93bkZyb21TY3JlZW5SZWFkZXIoZXZlbnQpKSB7XG4gICAgICB0aGlzLl9vcGVuZWRCeU1vdXNlID0gdHJ1ZTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==