import { EventEmitter, OnDestroy, TemplateRef, ElementRef, NgZone } from '@angular/core';
import { AnimationEvent } from '@angular/animations';
import { BooleanInput } from '@angular/cdk/coercion';
import { Directionality } from '@angular/cdk/bidi';
import { MtxPopoverTriggerEvent, MtxPopoverScrollStrategy, MtxPopoverPosition } from './popover-types';
import { MtxPopoverPanel } from './popover-interfaces';
export declare class MtxPopover implements MtxPopoverPanel, OnDestroy {
    private _dir;
    private _elementRef;
    zone: NgZone;
    role: string;
    /** Settings for popover, view setters and getters for more detail */
    private _position;
    private _triggerEvent;
    private _scrollStrategy;
    private _enterDelay;
    private _leaveDelay;
    private _panelOffsetX;
    private _panelOffsetY;
    private _closeOnPanelClick;
    private _closeOnBackdropClick;
    private _disableAnimation;
    private _focusTrapEnabled;
    private _focusTrapAutoCaptureEnabled;
    private _arrowOffsetX;
    private _arrowOffsetY;
    private _arrowWidth;
    private _arrowHeight;
    /** Config object to be passed into the popover's ngClass */
    _classList: {
        [key: string]: boolean;
    };
    /** Whether popover's `targetElement` is defined */
    containerPositioning: boolean;
    /** Closing disabled on popover */
    closeDisabled: boolean;
    /** Config object to be passed into the popover's arrow ngStyle */
    popoverPanelStyles: {};
    /** Config object to be passed into the popover's arrow ngStyle */
    popoverArrowStyles: {};
    /** Config object to be passed into the popover's content ngStyle */
    popoverContentStyles: {};
    /** Emits the current animation state whenever it changes. */
    _onAnimationStateChange: EventEmitter<AnimationEvent>;
    /** Position of the popover. */
    get position(): MtxPopoverPosition;
    set position(value: MtxPopoverPosition);
    /** Popover trigger event */
    get triggerEvent(): MtxPopoverTriggerEvent;
    set triggerEvent(value: MtxPopoverTriggerEvent);
    /** Popover scroll strategy */
    get scrollStrategy(): MtxPopoverScrollStrategy;
    set scrollStrategy(value: MtxPopoverScrollStrategy);
    /** Popover enter delay */
    get enterDelay(): number;
    set enterDelay(value: number);
    /** Popover leave delay */
    get leaveDelay(): number;
    set leaveDelay(value: number);
    /** Popover target offset x */
    get xOffset(): number;
    set xOffset(value: number);
    /** Popover target offset y */
    get yOffset(): number;
    set yOffset(value: number);
    /** Popover arrow offset x */
    get arrowOffsetX(): number;
    set arrowOffsetX(value: number);
    /** Popover arrow offset y */
    get arrowOffsetY(): number;
    set arrowOffsetY(value: number);
    /** Popover arrow width */
    get arrowWidth(): number;
    set arrowWidth(value: number);
    /** Popover arrow height */
    get arrowHeight(): number;
    set arrowHeight(value: number);
    /** Popover close on container click */
    get closeOnPanelClick(): boolean;
    set closeOnPanelClick(value: boolean);
    /** Popover close on backdrop click */
    get closeOnBackdropClick(): boolean;
    set closeOnBackdropClick(value: boolean);
    /** Disable animations of popover and all child elements */
    get disableAnimation(): boolean;
    set disableAnimation(value: boolean);
    /** Popover focus trap using cdkTrapFocus */
    get focusTrapEnabled(): boolean;
    set focusTrapEnabled(value: boolean);
    /** Popover focus trap auto capture using cdkTrapFocusAutoCapture */
    get focusTrapAutoCaptureEnabled(): boolean;
    set focusTrapAutoCaptureEnabled(value: boolean);
    /**
     * This method takes classes set on the host md-popover element and applies them on the
     * popover template that displays in the overlay container.  Otherwise, it's difficult
     * to style the containing popover from outside the component.
     * @param classes list of class names
     */
    set panelClass(classes: string);
    /**
     * This method takes classes set on the host md-popover element and applies them on the
     * popover template that displays in the overlay container.  Otherwise, it's difficult
     * to style the containing popover from outside the component.
     * @deprecated Use `panelClass` instead.
     * @breaking-change 8.0.0
     */
    get classList(): string;
    set classList(classes: string);
    /** Event emitted when the popover is closed. */
    closed: EventEmitter<void>;
    templateRef: TemplateRef<any>;
    constructor(_dir: Directionality, _elementRef: ElementRef, zone: NgZone);
    ngOnDestroy(): void;
    /** Handle a keyboard event from the popover, delegating to the appropriate action. */
    _handleKeydown(event: KeyboardEvent): void;
    /**
     * This emits a close event to which the trigger is subscribed. When emitted, the
     * trigger will close the popover.
     */
    _emitCloseEvent(): void;
    /** Close popover on click if closeOnPanelClick is true */
    onClick(): void;
    /**
     * TODO: Refactor when @angular/cdk includes feature I mentioned on github see link below.
     * https://github.com/angular/material2/pull/5493#issuecomment-313085323
     */
    /** Disables close of popover when leaving trigger element and mouse over the popover */
    onMouseOver(): void;
    /** Enables close of popover when mouse leaving popover element */
    onMouseLeave(): void;
    /** Sets the current styles for the popover to allow for dynamically changing settings */
    setCurrentStyles(pos?: MtxPopoverPosition): void;
    /**
     * It's necessary to set position-based classes to ensure the popover panel animation
     * folds out from the correct direction.
     */
    setPositionClasses(pos?: MtxPopoverPosition): void;
    static ngAcceptInputType_closeOnPanelClick: BooleanInput;
    static ngAcceptInputType_closeOnBackdropClick: BooleanInput;
    static ngAcceptInputType_disableAnimation: BooleanInput;
    static ngAcceptInputType_focusTrapEnabled: BooleanInput;
    static ngAcceptInputType_focusTrapAutoCaptureEnabled: BooleanInput;
}
