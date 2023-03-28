import { AnimationEvent } from '@angular/animations';
import { Direction } from '@angular/cdk/bidi';
import { BooleanInput } from '@angular/cdk/coercion';
import { ElementRef, EventEmitter, InjectionToken, NgZone, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { Subject } from 'rxjs';
import { MtxPopoverContent } from './popover-content';
import { MtxPopoverDefaultOptions, MtxPopoverPanel } from './popover-interfaces';
import { MtxPopoverPosition, MtxPopoverTriggerEvent, PopoverCloseReason } from './popover-types';
import * as i0 from "@angular/core";
/** Injection token to be used to override the default options for `mtx-popover`. */
export declare const MTX_POPOVER_DEFAULT_OPTIONS: InjectionToken<MtxPopoverDefaultOptions>;
/** @docs-private */
export declare function MTX_POPOVER_DEFAULT_OPTIONS_FACTORY(): MtxPopoverDefaultOptions;
export declare class MtxPopover implements MtxPopoverPanel, OnInit, OnDestroy {
    private _elementRef;
    private _ngZone;
    private _defaultOptions;
    private _triggerEvent;
    private _enterDelay;
    private _leaveDelay;
    private _position;
    private _panelOffsetX;
    private _panelOffsetY;
    private _arrowWidth;
    private _arrowHeight;
    private _arrowOffsetX;
    private _arrowOffsetY;
    private _closeOnPanelClick;
    private _closeOnBackdropClick;
    private _focusTrapEnabled;
    private _focusTrapAutoCaptureEnabled;
    private _hasBackdrop;
    private _elevation;
    private _previousElevation?;
    private _elevationPrefix;
    /** Config object to be passed into the popover's ngClass. */
    _classList: {
        [key: string]: boolean;
    };
    /** Current state of the panel animation. */
    _panelAnimationState: 'void' | 'enter';
    /** Emits whenever an animation on the popover completes. */
    readonly _animationDone: Subject<AnimationEvent>;
    /** Whether the popover is animating. */
    _isAnimating: boolean;
    /** Closing disabled on popover */
    closeDisabled: boolean;
    /** Config object to be passed into the popover's arrow ngStyle */
    arrowStyles?: Record<string, unknown>;
    /** Layout direction of the popover. */
    direction?: Direction;
    /** Class or list of classes to be added to the overlay panel. */
    overlayPanelClass: string | string[];
    /** Class to be added to the backdrop element. */
    backdropClass: string | undefined;
    /** aria-label for the popover panel. */
    ariaLabel?: string;
    /** aria-labelledby for the popover panel. */
    ariaLabelledby?: string;
    /** aria-describedby for the popover panel. */
    ariaDescribedby?: string;
    /** Popover's trigger event. */
    get triggerEvent(): MtxPopoverTriggerEvent;
    set triggerEvent(value: MtxPopoverTriggerEvent);
    /** Popover's enter delay. */
    get enterDelay(): number;
    set enterDelay(value: number);
    /** Popover's leave delay. */
    get leaveDelay(): number;
    set leaveDelay(value: number);
    /** Popover's position. */
    get position(): MtxPopoverPosition;
    set position(value: MtxPopoverPosition);
    /** Popover-panel's X offset. */
    get xOffset(): number;
    set xOffset(value: number);
    /** Popover-panel's Y offset. */
    get yOffset(): number;
    set yOffset(value: number);
    /** Popover-arrow's width. */
    get arrowWidth(): number;
    set arrowWidth(value: number);
    /** Popover-arrow's height. */
    get arrowHeight(): number;
    set arrowHeight(value: number);
    /** Popover-arrow's X offset. */
    get arrowOffsetX(): number;
    set arrowOffsetX(value: number);
    /** Popover-arrow's Y offset. */
    get arrowOffsetY(): number;
    set arrowOffsetY(value: number);
    /** Whether popover can be closed when click the popover-panel. */
    get closeOnPanelClick(): boolean;
    set closeOnPanelClick(value: boolean);
    /** Whether popover can be closed when click the backdrop. */
    get closeOnBackdropClick(): boolean;
    set closeOnBackdropClick(value: boolean);
    /** Whether enable focus trap using `cdkTrapFocus`. */
    get focusTrapEnabled(): boolean;
    set focusTrapEnabled(value: boolean);
    /** Whether enable focus trap auto capture using `cdkTrapFocusAutoCapture`. */
    get focusTrapAutoCaptureEnabled(): boolean;
    set focusTrapAutoCaptureEnabled(value: boolean);
    /** Whether the popover has a backdrop. It will always be false if the trigger event is hover. */
    get hasBackdrop(): boolean | undefined;
    set hasBackdrop(value: boolean | undefined);
    /** Popover-panel's elevation (0~24). */
    get elevation(): number;
    set elevation(value: number);
    /**
     * This method takes classes set on the host md-popover element and applies them on the
     * popover template that displays in the overlay container. Otherwise, it's difficult
     * to style the containing popover from outside the component.
     * @param classes list of class names
     */
    set panelClass(classes: string);
    /**
     * This method takes classes set on the host md-popover element and applies them on the
     * popover template that displays in the overlay container. Otherwise, it's difficult
     * to style the containing popover from outside the component.
     * @deprecated Use `panelClass` instead.
     * @breaking-change 8.0.0
     */
    get classList(): string;
    set classList(classes: string);
    /** Event emitted when the popover is closed. */
    closed: EventEmitter<PopoverCloseReason>;
    /** @docs-private */
    templateRef: TemplateRef<any>;
    /**
     * Popover content that will be rendered lazily.
     * @docs-private
     */
    lazyContent?: MtxPopoverContent;
    readonly panelId: string;
    constructor(_elementRef: ElementRef, _ngZone: NgZone, _defaultOptions: MtxPopoverDefaultOptions);
    ngOnInit(): void;
    ngOnDestroy(): void;
    /** Handle a keyboard event from the popover, delegating to the appropriate action. */
    _handleKeydown(event: KeyboardEvent): void;
    /** Close popover on click if `closeOnPanelClick` is true. */
    _handleClick(): void;
    /** Disables close of popover when leaving trigger element and mouse over the popover. */
    _handleMouseOver(): void;
    /** Enables close of popover when mouse leaving popover element. */
    _handleMouseLeave(): void;
    /** Sets the current styles for the popover to allow for dynamically changing settings. */
    setCurrentStyles(pos?: MtxPopoverPosition): void;
    /**
     * It's necessary to set position-based classes to ensure the popover panel animation
     * folds out from the correct direction.
     */
    setPositionClasses(pos?: MtxPopoverPosition): void;
    /** Sets the popover-panel's elevation. */
    setElevation(): void;
    /** Starts the enter animation. */
    _startAnimation(): void;
    /** Resets the panel animation to its initial state. */
    _resetAnimation(): void;
    /** Callback that is invoked when the panel animation completes. */
    _onAnimationDone(event: AnimationEvent): void;
    _onAnimationStart(event: AnimationEvent): void;
    static ngAcceptInputType_closeOnPanelClick: BooleanInput;
    static ngAcceptInputType_closeOnBackdropClick: BooleanInput;
    static ngAcceptInputType_focusTrapEnabled: BooleanInput;
    static ngAcceptInputType_focusTrapAutoCaptureEnabled: BooleanInput;
    static ngAcceptInputType_hasBackdrop: BooleanInput;
    static ɵfac: i0.ɵɵFactoryDeclaration<MtxPopover, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MtxPopover, "mtx-popover", ["mtxPopover"], { "backdropClass": "backdropClass"; "ariaLabel": "aria-label"; "ariaLabelledby": "aria-labelledby"; "ariaDescribedby": "aria-describedby"; "triggerEvent": "triggerEvent"; "enterDelay": "enterDelay"; "leaveDelay": "leaveDelay"; "position": "position"; "xOffset": "xOffset"; "yOffset": "yOffset"; "arrowWidth": "arrowWidth"; "arrowHeight": "arrowHeight"; "arrowOffsetX": "arrowOffsetX"; "arrowOffsetY": "arrowOffsetY"; "closeOnPanelClick": "closeOnPanelClick"; "closeOnBackdropClick": "closeOnBackdropClick"; "focusTrapEnabled": "focusTrapEnabled"; "focusTrapAutoCaptureEnabled": "focusTrapAutoCaptureEnabled"; "hasBackdrop": "hasBackdrop"; "elevation": "elevation"; "panelClass": "class"; "classList": "classList"; }, { "closed": "closed"; }, ["lazyContent"], ["*"], false, never>;
}
