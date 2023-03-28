import { FocusMonitor, FocusOrigin } from '@angular/cdk/a11y';
import { Direction, Directionality } from '@angular/cdk/bidi';
import { Overlay, ScrollStrategy } from '@angular/cdk/overlay';
import { AfterContentInit, ChangeDetectorRef, ElementRef, EventEmitter, InjectionToken, OnDestroy, ViewContainerRef } from '@angular/core';
import { MtxPopoverPanel } from './popover-interfaces';
import { MtxPopoverTarget } from './popover-target';
import { MtxPopoverTriggerEvent } from './popover-types';
import * as i0 from "@angular/core";
/** Injection token that determines the scroll handling while the popover is open. */
export declare const MTX_POPOVER_SCROLL_STRATEGY: InjectionToken<() => ScrollStrategy>;
/** @docs-private */
export declare function MTX_POPOVER_SCROLL_STRATEGY_FACTORY(overlay: Overlay): () => ScrollStrategy;
/** @docs-private */
export declare const MTX_POPOVER_SCROLL_STRATEGY_FACTORY_PROVIDER: {
    provide: InjectionToken<() => ScrollStrategy>;
    deps: (typeof Overlay)[];
    useFactory: typeof MTX_POPOVER_SCROLL_STRATEGY_FACTORY;
};
/**
 * This directive is intended to be used in conjunction with an `mtx-popover` tag. It is
 * responsible for toggling the display of the provided popover instance.
 */
export declare class MtxPopoverTrigger implements AfterContentInit, OnDestroy {
    private _overlay;
    private _elementRef;
    private _viewContainerRef;
    private _dir;
    private _changeDetectorRef;
    private _focusMonitor?;
    private _portal?;
    private _overlayRef;
    private _popoverOpen;
    private _halt;
    private _positionSubscription;
    private _popoverCloseSubscription;
    private _closingActionsSubscription;
    private _scrollStrategy;
    private _mouseoverTimer;
    _openedBy: Exclude<FocusOrigin, 'program' | null> | undefined;
    /** References the popover instance that the trigger is associated with. */
    get popover(): MtxPopoverPanel;
    set popover(popover: MtxPopoverPanel);
    private _popover;
    /** Data to be passed along to any lazily-rendered content. */
    popoverData: any;
    /** References the popover target instance that the trigger is associated with. */
    targetElement?: MtxPopoverTarget;
    /** Popover trigger event */
    triggerEvent?: MtxPopoverTriggerEvent;
    /** Event emitted when the associated popover is opened. */
    popoverOpened: EventEmitter<void>;
    /** Event emitted when the associated popover is closed. */
    popoverClosed: EventEmitter<void>;
    constructor(_overlay: Overlay, _elementRef: ElementRef<HTMLElement>, _viewContainerRef: ViewContainerRef, scrollStrategy: any, _dir: Directionality, _changeDetectorRef: ChangeDetectorRef, _focusMonitor?: FocusMonitor | undefined);
    ngAfterContentInit(): void;
    ngOnDestroy(): void;
    private _setCurrentConfig;
    /** Whether the popover is open. */
    get popoverOpen(): boolean;
    /** The text direction of the containing app. */
    get dir(): Direction;
    /** Handles mouse click on the trigger. */
    _handleClick(event: MouseEvent): void;
    /** Handles mouse enter on the trigger. */
    _handleMouseEnter(event: MouseEvent): void;
    /** Handles mouse leave on the trigger. */
    _handleMouseLeave(event: MouseEvent): void;
    /** Handles mouse presses on the trigger. */
    _handleMousedown(event: MouseEvent): void;
    /** Handles key presses on the trigger. */
    _handleKeydown(event: KeyboardEvent): void;
    /** Toggles the popover between the open and closed states. */
    togglePopover(): void;
    /** Opens the popover. */
    openPopover(): void;
    /** Closes the popover. */
    closePopover(): void;
    /**
     * Focuses the popover trigger.
     * @param origin Source of the popover trigger's focus.
     */
    focus(origin?: FocusOrigin, options?: FocusOptions): void;
    /** Removes the popover from the DOM. */
    private _destroyPopover;
    /**
     * This method sets the popover state to open.
     */
    private _initPopover;
    private _setIsPopoverOpen;
    /**
     * This method checks that a valid instance of MdPopover has been passed into
     * `mtxPopoverTriggerFor`. If not, an exception is thrown.
     */
    private _checkPopover;
    /**
     * This method creates the overlay from the provided popover's template and saves its
     * OverlayRef so that it can be attached to the DOM when openPopover is called.
     */
    private _createOverlay;
    /**
     * This method builds the configuration object needed to create the overlay, the OverlayConfig.
     * @returns OverlayConfig
     */
    private _getOverlayConfig;
    private _getTargetElement;
    /**
     * Listens to changes in the position of the overlay and sets the correct classes
     * on the popover based on the new position. This ensures the animation origin is always
     * correct, even if a fallback position is used for the overlay.
     */
    private _subscribeToPositions;
    /**
     * Sets the appropriate positions on a position strategy
     * so the overlay connects with the trigger correctly.
     * @param positionStrategy Strategy whose position to update.
     */
    private _setPosition;
    /** Returns a stream that emits whenever an action that should close the popover occurs. */
    private _popoverClosingActions;
    /** Gets the portal that should be attached to the overlay. */
    private _getPortal;
    static ɵfac: i0.ɵɵFactoryDeclaration<MtxPopoverTrigger, [null, null, null, null, { optional: true; }, null, null]>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<MtxPopoverTrigger, "[mtx-popover-trigger-for], [mtxPopoverTriggerFor]", ["mtxPopoverTrigger"], { "popover": "mtxPopoverTriggerFor"; "popoverData": "mtxPopoverTriggerData"; "targetElement": "mtxPopoverTargetAt"; "triggerEvent": "mtxPopoverTriggerOn"; }, { "popoverOpened": "popoverOpened"; "popoverClosed": "popoverClosed"; }, never, never, false, never>;
}
