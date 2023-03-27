import { Component, EventEmitter, Input, Output, TemplateRef, ViewChild, ViewEncapsulation, ElementRef, ChangeDetectionStrategy, HostBinding, NgZone, Optional, } from '@angular/core';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { ESCAPE } from '@angular/cdk/keycodes';
import { Directionality } from '@angular/cdk/bidi';
import { throwMtxPopoverInvalidPositionStart, throwMtxPopoverInvalidPositionEnd, } from './popover-errors';
import { transformPopover } from './popover-animations';
export class MtxPopover {
    constructor(_dir, _elementRef, zone) {
        this._dir = _dir;
        this._elementRef = _elementRef;
        this.zone = zone;
        this.role = 'dialog';
        /** Settings for popover, view setters and getters for more detail */
        this._position = ['below', 'after'];
        this._triggerEvent = 'hover';
        this._scrollStrategy = 'reposition';
        this._enterDelay = 100;
        this._leaveDelay = 100;
        this._panelOffsetX = 0;
        this._panelOffsetY = 0;
        this._closeOnPanelClick = false;
        this._closeOnBackdropClick = true;
        this._disableAnimation = false;
        this._focusTrapEnabled = true;
        this._focusTrapAutoCaptureEnabled = true;
        this._arrowOffsetX = 20;
        this._arrowOffsetY = 20;
        this._arrowWidth = 16;
        this._arrowHeight = 16;
        /** Config object to be passed into the popover's ngClass */
        this._classList = {};
        /** Whether popover's `targetElement` is defined */
        this.containerPositioning = false;
        /** Closing disabled on popover */
        this.closeDisabled = false;
        /** Emits the current animation state whenever it changes. */
        this._onAnimationStateChange = new EventEmitter();
        /** Event emitted when the popover is closed. */
        this.closed = new EventEmitter();
        this.setPositionClasses();
    }
    /** Position of the popover. */
    get position() {
        return this._position;
    }
    set position(value) {
        if (!['before', 'after', 'above', 'below'].includes(value[0])) {
            throwMtxPopoverInvalidPositionStart();
        }
        if (!['before', 'after', 'above', 'below', 'center'].includes(value[1])) {
            throwMtxPopoverInvalidPositionEnd();
        }
        this._position = value;
        this.setPositionClasses();
    }
    /** Popover trigger event */
    get triggerEvent() {
        return this._triggerEvent;
    }
    set triggerEvent(value) {
        this._triggerEvent = value;
    }
    /** Popover scroll strategy */
    get scrollStrategy() {
        return this._scrollStrategy;
    }
    set scrollStrategy(value) {
        this._scrollStrategy = value;
    }
    /** Popover enter delay */
    get enterDelay() {
        return this._enterDelay;
    }
    set enterDelay(value) {
        this._enterDelay = value;
    }
    /** Popover leave delay */
    get leaveDelay() {
        return this._leaveDelay;
    }
    set leaveDelay(value) {
        this._leaveDelay = value;
    }
    /** Popover target offset x */
    get xOffset() {
        return this._panelOffsetX;
    }
    set xOffset(value) {
        this._panelOffsetX = value;
    }
    /** Popover target offset y */
    get yOffset() {
        return this._panelOffsetY;
    }
    set yOffset(value) {
        this._panelOffsetY = value;
    }
    /** Popover arrow offset x */
    get arrowOffsetX() {
        return this._arrowOffsetX;
    }
    set arrowOffsetX(value) {
        this._arrowOffsetX = value;
    }
    /** Popover arrow offset y */
    get arrowOffsetY() {
        return this._arrowOffsetY;
    }
    set arrowOffsetY(value) {
        this._arrowOffsetY = value;
    }
    /** Popover arrow width */
    get arrowWidth() {
        return this._arrowWidth;
    }
    set arrowWidth(value) {
        this._arrowWidth = value;
    }
    /** Popover arrow height */
    get arrowHeight() {
        return this._arrowHeight;
    }
    set arrowHeight(value) {
        this._arrowHeight = value;
    }
    /** Popover close on container click */
    get closeOnPanelClick() {
        return this._closeOnPanelClick;
    }
    set closeOnPanelClick(value) {
        this._closeOnPanelClick = coerceBooleanProperty(value);
    }
    /** Popover close on backdrop click */
    get closeOnBackdropClick() {
        return this._closeOnBackdropClick;
    }
    set closeOnBackdropClick(value) {
        this._closeOnBackdropClick = coerceBooleanProperty(value);
    }
    /** Disable animations of popover and all child elements */
    get disableAnimation() {
        return this._disableAnimation;
    }
    set disableAnimation(value) {
        this._disableAnimation = coerceBooleanProperty(value);
    }
    /** Popover focus trap using cdkTrapFocus */
    get focusTrapEnabled() {
        return this._focusTrapEnabled;
    }
    set focusTrapEnabled(value) {
        this._focusTrapEnabled = coerceBooleanProperty(value);
    }
    /** Popover focus trap auto capture using cdkTrapFocusAutoCapture */
    get focusTrapAutoCaptureEnabled() {
        return this._focusTrapAutoCaptureEnabled;
    }
    set focusTrapAutoCaptureEnabled(value) {
        this._focusTrapAutoCaptureEnabled = coerceBooleanProperty(value);
    }
    /**
     * This method takes classes set on the host md-popover element and applies them on the
     * popover template that displays in the overlay container.  Otherwise, it's difficult
     * to style the containing popover from outside the component.
     * @param classes list of class names
     */
    set panelClass(classes) {
        if (classes && classes.length) {
            this._classList = classes.split(' ').reduce((obj, className) => {
                obj[className] = true;
                return obj;
            }, {});
            this._elementRef.nativeElement.className = '';
            this.setPositionClasses();
        }
    }
    /**
     * This method takes classes set on the host md-popover element and applies them on the
     * popover template that displays in the overlay container.  Otherwise, it's difficult
     * to style the containing popover from outside the component.
     * @deprecated Use `panelClass` instead.
     * @breaking-change 8.0.0
     */
    get classList() {
        return this.panelClass;
    }
    set classList(classes) {
        this.panelClass = classes;
    }
    ngOnDestroy() {
        this._emitCloseEvent();
        this.closed.complete();
    }
    /** Handle a keyboard event from the popover, delegating to the appropriate action. */
    _handleKeydown(event) {
        switch (event.keyCode) {
            case ESCAPE:
                this._emitCloseEvent();
                return;
        }
    }
    /**
     * This emits a close event to which the trigger is subscribed. When emitted, the
     * trigger will close the popover.
     */
    _emitCloseEvent() {
        this.closed.emit();
    }
    /** Close popover on click if closeOnPanelClick is true */
    onClick() {
        if (this.closeOnPanelClick) {
            this._emitCloseEvent();
        }
    }
    /**
     * TODO: Refactor when @angular/cdk includes feature I mentioned on github see link below.
     * https://github.com/angular/material2/pull/5493#issuecomment-313085323
     */
    /** Disables close of popover when leaving trigger element and mouse over the popover */
    onMouseOver() {
        if (this.triggerEvent === 'hover') {
            this.closeDisabled = true;
        }
    }
    /** Enables close of popover when mouse leaving popover element */
    onMouseLeave() {
        if (this.triggerEvent === 'hover') {
            this.closeDisabled = false;
            this._emitCloseEvent();
        }
    }
    // TODO: Refactor how styles are set and updated on the component, use best practices.
    // TODO: If arrow left and right positioning is requested, see if flex direction can be used to work with order.
    /** Sets the current styles for the popover to allow for dynamically changing settings */
    setCurrentStyles(pos = this.position) {
        const left = pos[1] === 'after'
            ? `${this.arrowOffsetX - this.arrowWidth / 2}px`
            : pos[1] === 'center'
                ? `calc(50% - ${this.arrowWidth / 2}px)`
                : '';
        const right = pos[1] === 'before' ? `${this.arrowOffsetX - this.arrowWidth / 2}px` : '';
        const bottom = pos[1] === 'above'
            ? `${this.arrowOffsetY - this.arrowHeight / 2}px`
            : pos[1] === 'center'
                ? `calc(50% - ${this.arrowHeight / 2}px)`
                : '';
        const top = pos[1] === 'below' ? `${this.arrowOffsetY - this.arrowHeight / 2}px` : '';
        this.popoverArrowStyles =
            pos[0] === 'above' || pos[0] === 'below'
                ? {
                    left: this._dir.value === 'ltr' ? left : right,
                    right: this._dir.value === 'ltr' ? right : left,
                }
                : {
                    top,
                    bottom,
                };
    }
    /**
     * It's necessary to set position-based classes to ensure the popover panel animation
     * folds out from the correct direction.
     */
    setPositionClasses(pos = this.position) {
        this._classList['mtx-popover-before-above'] = pos[0] === 'before' && pos[1] === 'above';
        this._classList['mtx-popover-before-center'] = pos[0] === 'before' && pos[1] === 'center';
        this._classList['mtx-popover-before-below'] = pos[0] === 'before' && pos[1] === 'below';
        this._classList['mtx-popover-after-above'] = pos[0] === 'after' && pos[1] === 'above';
        this._classList['mtx-popover-after-center'] = pos[0] === 'after' && pos[1] === 'center';
        this._classList['mtx-popover-after-below'] = pos[0] === 'after' && pos[1] === 'below';
        this._classList['mtx-popover-above-before'] = pos[0] === 'above' && pos[1] === 'before';
        this._classList['mtx-popover-above-center'] = pos[0] === 'above' && pos[1] === 'center';
        this._classList['mtx-popover-above-after'] = pos[0] === 'above' && pos[1] === 'after';
        this._classList['mtx-popover-below-before'] = pos[0] === 'below' && pos[1] === 'before';
        this._classList['mtx-popover-below-center'] = pos[0] === 'below' && pos[1] === 'center';
        this._classList['mtx-popover-below-after'] = pos[0] === 'below' && pos[1] === 'after';
    }
}
MtxPopover.decorators = [
    { type: Component, args: [{
                selector: 'mtx-popover',
                template: "<ng-template>\r\n  <div class=\"mtx-popover-panel mat-elevation-z8\" role=\"dialog\"\r\n       [ngClass]=\"_classList\"\r\n       [ngStyle]=\"popoverPanelStyles\"\r\n       (keydown)=\"_handleKeydown($event)\"\r\n       (click)=\"onClick()\"\r\n       (mouseover)=\"onMouseOver()\"\r\n       (mouseleave)=\"onMouseLeave()\"\r\n       [@.disabled]=\"disableAnimation\"\r\n       [@transformPopover]=\"'enter'\">\r\n    <div class=\"mtx-popover-direction-arrow\" [ngStyle]=\"popoverArrowStyles\"></div>\r\n    <div class=\"mtx-popover-content\"\r\n         [ngStyle]=\"popoverContentStyles\"\r\n         [cdkTrapFocus]=\"focusTrapEnabled\"\r\n         [cdkTrapFocusAutoCapture]=\"focusTrapAutoCaptureEnabled\">\r\n      <ng-content></ng-content>\r\n    </div>\r\n  </div>\r\n</ng-template>\r\n",
                changeDetection: ChangeDetectionStrategy.OnPush,
                encapsulation: ViewEncapsulation.None,
                animations: [transformPopover],
                exportAs: 'mtxPopover',
                styles: [".mtx-popover-panel{max-height:calc(100vh - 48px);padding:8px;border-radius:4px;font-size:16px}.mtx-popover-panel[class*=mtx-popover-below]{margin-top:calc(.5em + 2px)}.mtx-popover-panel[class*=mtx-popover-above]{margin-bottom:calc(.5em + 2px)}.mtx-popover-panel[class*=mtx-popover-before]{margin-right:calc(.5em + 2px)}[dir=rtl] .mtx-popover-panel[class*=mtx-popover-before]{margin-right:auto;margin-left:calc(.5em + 2px)}.mtx-popover-panel[class*=mtx-popover-after]{margin-left:calc(.5em + 2px)}[dir=rtl] .mtx-popover-panel[class*=mtx-popover-after]{margin-left:auto;margin-right:calc(.5em + 2px)}.mtx-popover-direction-arrow{position:absolute}.mtx-popover-direction-arrow:after,.mtx-popover-direction-arrow:before{position:absolute;display:inline-block;content:\"\";border-width:.5em;border-style:solid}.mtx-popover-direction-arrow:after{border-width:calc(.5em - 1px)}[class*=mtx-popover-above] .mtx-popover-direction-arrow,[class*=mtx-popover-below] .mtx-popover-direction-arrow{width:1em}[class*=mtx-popover-above] .mtx-popover-direction-arrow:after,[class*=mtx-popover-below] .mtx-popover-direction-arrow:after{left:1px}[dir=rtl] [class*=mtx-popover-above] .mtx-popover-direction-arrow:after,[dir=rtl] [class*=mtx-popover-below] .mtx-popover-direction-arrow:after{right:1px;left:auto}[class*=mtx-popover-below] .mtx-popover-direction-arrow{top:0}[class*=mtx-popover-below] .mtx-popover-direction-arrow:after,[class*=mtx-popover-below] .mtx-popover-direction-arrow:before{bottom:0;border-top-width:0}[class*=mtx-popover-above] .mtx-popover-direction-arrow{bottom:0}[class*=mtx-popover-above] .mtx-popover-direction-arrow:after,[class*=mtx-popover-above] .mtx-popover-direction-arrow:before{top:0;border-bottom-width:0}[class*=mtx-popover-after] .mtx-popover-direction-arrow,[class*=mtx-popover-before] .mtx-popover-direction-arrow{height:1em}[class*=mtx-popover-after] .mtx-popover-direction-arrow:after,[class*=mtx-popover-before] .mtx-popover-direction-arrow:after{top:1px}[class*=mtx-popover-before] .mtx-popover-direction-arrow{right:0}[class*=mtx-popover-before] .mtx-popover-direction-arrow:after,[class*=mtx-popover-before] .mtx-popover-direction-arrow:before{left:0;border-right-width:0}[dir=rtl] [class*=mtx-popover-before] .mtx-popover-direction-arrow{right:auto;left:0}[dir=rtl] [class*=mtx-popover-before] .mtx-popover-direction-arrow:after,[dir=rtl] [class*=mtx-popover-before] .mtx-popover-direction-arrow:before{left:auto;right:0;border-left-width:0}[dir=rtl] [class*=mtx-popover-before] .mtx-popover-direction-arrow:before{border-right-width:.5em}[dir=rtl] [class*=mtx-popover-before] .mtx-popover-direction-arrow:after{border-right-width:calc(.5em - 1px)}[class*=mtx-popover-after] .mtx-popover-direction-arrow{left:0}[class*=mtx-popover-after] .mtx-popover-direction-arrow:after,[class*=mtx-popover-after] .mtx-popover-direction-arrow:before{right:0;border-left-width:0}[dir=rtl] [class*=mtx-popover-after] .mtx-popover-direction-arrow{left:auto;right:0}[dir=rtl] [class*=mtx-popover-after] .mtx-popover-direction-arrow:after,[dir=rtl] [class*=mtx-popover-after] .mtx-popover-direction-arrow:before{right:auto;left:0;border-right-width:0}[dir=rtl] [class*=mtx-popover-after] .mtx-popover-direction-arrow:before{border-left-width:.5em}[dir=rtl] [class*=mtx-popover-after] .mtx-popover-direction-arrow:after{border-left-width:calc(.5em - 1px)}"]
            },] }
];
/** @nocollapse */
MtxPopover.ctorParameters = () => [
    { type: Directionality, decorators: [{ type: Optional }] },
    { type: ElementRef },
    { type: NgZone }
];
MtxPopover.propDecorators = {
    role: [{ type: HostBinding, args: ['attr.role',] }],
    position: [{ type: Input }],
    triggerEvent: [{ type: Input }],
    scrollStrategy: [{ type: Input }],
    enterDelay: [{ type: Input }],
    leaveDelay: [{ type: Input }],
    xOffset: [{ type: Input }],
    yOffset: [{ type: Input }],
    arrowOffsetX: [{ type: Input }],
    arrowOffsetY: [{ type: Input }],
    arrowWidth: [{ type: Input }],
    arrowHeight: [{ type: Input }],
    closeOnPanelClick: [{ type: Input }],
    closeOnBackdropClick: [{ type: Input }],
    disableAnimation: [{ type: Input }],
    focusTrapEnabled: [{ type: Input }],
    focusTrapAutoCaptureEnabled: [{ type: Input }],
    panelClass: [{ type: Input, args: ['class',] }],
    classList: [{ type: Input }],
    closed: [{ type: Output }],
    templateRef: [{ type: ViewChild, args: [TemplateRef,] }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9wb3Zlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL2V4dGVuc2lvbnMvcG9wb3Zlci9wb3BvdmVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFDTCxTQUFTLEVBQ1QsWUFBWSxFQUNaLEtBQUssRUFFTCxNQUFNLEVBQ04sV0FBVyxFQUNYLFNBQVMsRUFDVCxpQkFBaUIsRUFDakIsVUFBVSxFQUNWLHVCQUF1QixFQUN2QixXQUFXLEVBQ1gsTUFBTSxFQUNOLFFBQVEsR0FDVCxNQUFNLGVBQWUsQ0FBQztBQUV2QixPQUFPLEVBQWdCLHFCQUFxQixFQUFFLE1BQU0sdUJBQXVCLENBQUM7QUFDNUUsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLHVCQUF1QixDQUFDO0FBQy9DLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQztBQU9uRCxPQUFPLEVBQ0wsbUNBQW1DLEVBQ25DLGlDQUFpQyxHQUNsQyxNQUFNLGtCQUFrQixDQUFDO0FBRTFCLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBV3hELE1BQU0sT0FBTyxVQUFVO0lBd09yQixZQUNzQixJQUFvQixFQUNoQyxXQUF1QixFQUN4QixJQUFZO1FBRkMsU0FBSSxHQUFKLElBQUksQ0FBZ0I7UUFDaEMsZ0JBQVcsR0FBWCxXQUFXLENBQVk7UUFDeEIsU0FBSSxHQUFKLElBQUksQ0FBUTtRQTFPSyxTQUFJLEdBQUcsUUFBUSxDQUFDO1FBRTFDLHFFQUFxRTtRQUM3RCxjQUFTLEdBQXVCLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQ25ELGtCQUFhLEdBQTJCLE9BQU8sQ0FBQztRQUNoRCxvQkFBZSxHQUE2QixZQUFZLENBQUM7UUFDekQsZ0JBQVcsR0FBRyxHQUFHLENBQUM7UUFDbEIsZ0JBQVcsR0FBRyxHQUFHLENBQUM7UUFDbEIsa0JBQWEsR0FBRyxDQUFDLENBQUM7UUFDbEIs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QUMsSUFBSTtnQkFDckMsVUFBVSxFQUFFLENBQUMsZ0JBQWdCLENBQUM7Z0JBQzlCLFFBQVEsRUFBRSxZQUFZOzthQUN2Qjs7OztZQXRCUSxjQUFjLHVCQWdRbEIsUUFBUTtZQXpRWCxVQUFVO1lBR1YsTUFBTTs7O21CQThCTCxXQUFXLFNBQUMsV0FBVzt1QkEwQ3ZCLEtBQUs7MkJBZ0JMLEtBQUs7NkJBU0wsS0FBSzt5QkFTTCxLQUFLO3lCQVNMLEtBQUs7c0JBU0wsS0FBSztzQkFTTCxLQUFLOzJCQVNMLEtBQUs7MkJBU0wsS0FBSzt5QkFTTCxLQUFLOzBCQVNMLEtBQUs7Z0NBU0wsS0FBSzttQ0FTTCxLQUFLOytCQVNMLEtBQUs7K0JBU0wsS0FBSzswQ0FTTCxLQUFLO3lCQWNMLEtBQUssU0FBQyxPQUFPO3dCQW9CYixLQUFLO3FCQVNMLE1BQU07MEJBRU4sU0FBUyxTQUFDLFdBQVciLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBDb21wb25lbnQsXG4gIEV2ZW50RW1pdHRlcixcbiAgSW5wdXQsXG4gIE9uRGVzdHJveSxcbiAgT3V0cHV0LFxuICBUZW1wbGF0ZVJlZixcbiAgVmlld0NoaWxkLFxuICBWaWV3RW5jYXBzdWxhdGlvbixcbiAgRWxlbWVudFJlZixcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIEhvc3RCaW5kaW5nLFxuICBOZ1pvbmUsXG4gIE9wdGlvbmFsLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEFuaW1hdGlvbkV2ZW50IH0gZnJvbSAnQGFuZ3VsYXIvYW5pbWF0aW9ucyc7XG5pbXBvcnQgeyBCb29sZWFuSW5wdXQsIGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSB9IGZyb20gJ0Bhbmd1bGFyL2Nkay9jb2VyY2lvbic7XG5pbXBvcnQgeyBFU0NBUEUgfSBmcm9tICdAYW5ndWxhci9jZGsva2V5Y29kZXMnO1xuaW1wb3J0IHsgRGlyZWN0aW9uYWxpdHkgfSBmcm9tICdAYW5ndWxhci9jZGsvYmlkaSc7XG5cbmltcG9ydCB7XG4gIE10eFBvcG92ZXJUcmlnZ2VyRXZlbnQsXG4gIE10eFBvcG92ZXJTY3JvbGxTdHJhdGVneSxcbiAgTXR4UG9wb3ZlclBvc2l0aW9uLFxufSBmcm9tICcuL3BvcG92ZXItdHlwZXMnO1xuaW1wb3J0IHtcbiAgdGhyb3dNdHhQb3BvdmVySW52YWxpZFBvc2l0aW9uU3RhcnQsXG4gIHRocm93TXR4UG9wb3ZlckludmFsaWRQb3NpdGlvbkVuZCxcbn0gZnJvbSAnLi9wb3BvdmVyLWVycm9ycyc7XG5pbXBvcnQgeyBNdHhQb3BvdmVyUGFuZWwgfSBmcm9tICcuL3BvcG92ZXItaW50ZXJmYWNlcyc7XG5pbXBvcnQgeyB0cmFuc2Zvcm1Qb3BvdmVyIH0gZnJvbSAnLi9wb3BvdmVyLWFuaW1hdGlvbnMnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdtdHgtcG9wb3ZlcicsXG4gIHRlbXBsYXRlVXJsOiAnLi9wb3BvdmVyLmh0bWwnLFxuICBzdHlsZVVybHM6IFsnLi9wb3BvdmVyLnNjc3MnXSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIGFuaW1hdGlvbnM6IFt0cmFuc2Zvcm1Qb3BvdmVyXSxcbiAgZXhwb3J0QXM6ICdtdHhQb3BvdmVyJyxcbn0pXG5leHBvcnQgY2xhc3MgTXR4UG9wb3ZlciBpbXBsZW1lbnRzIE10eFBvcG92ZXJQYW5lbCwgT25EZXN0cm95IHtcbiAgQEhvc3RCaW5kaW5nKCdhdHRyLnJvbGUnKSByb2xlID0gJ2RpYWxvZyc7XG5cbiAgLyoqIFNldHRpbmdzIGZvciBwb3BvdmVyLCB2aWV3IHNldHRlcnMgYW5kIGdldHRlcnMgZm9yIG1vcmUgZGV0YWlsICovXG4gIHByaXZhdGUgX3Bvc2l0aW9uOiBNdHhQb3BvdmVyUG9zaXRpb24gPSBbJ2JlbG93JywgJ2FmdGVyJ107XG4gIHByaXZhdGUgX3RyaWdnZXJFdmVudDogTXR4UG9wb3ZlclRyaWdnZXJFdmVudCA9ICdob3Zlcic7XG4gIHByaXZhdGUgX3Njcm9sbFN0cmF0ZWd5OiBNdHhQb3BvdmVyU2Nyb2xsU3RyYXRlZ3kgPSAncmVwb3NpdGlvbic7XG4gIHByaXZhdGUgX2VudGVyRGVsYXkgPSAxMDA7XG4gIHByaXZhdGUgX2xlYXZlRGVsYXkgPSAxMDA7XG4gIHByaXZhdGUgX3BhbmVsT2Zmc2V0WCA9IDA7XG4gIHByaXZhdGUgX3BhbmVsT2Zmc2V0WSA9IDA7XG4gIHByaXZhdGUgX2Nsb3NlT25QYW5lbENsaWNrID0gZmFsc2U7XG4gIHByaXZhdGUgX2Nsb3NlT25CYWNrZHJvcENsaWNrID0gdHJ1ZTtcbiAgcHJpdmF0ZSBfZGlzYWJsZUFuaW1hdGlvbiA9IGZhbHNlO1xuICBwcml2YXRlIF9mb2N1c1RyYXBFbmFibGVkID0gdHJ1ZTtcbiAgcHJpdmF0ZSBfZm9jdXNUcmFwQXV0b0NhcHR1cmVFbmFibGVkID0gdHJ1ZTtcbiAgcHJpdmF0ZSBfYXJyb3dPZmZzZXRYID0gMjA7XG4gIHByaXZhdGUgX2Fycm93T2Zmc2V0WSA9IDIwO1xuICBwcml2YXRlIF9hcnJvd1dpZHRoID0gMTY7XG4gIHByaXZhdGUgX2Fycm93SGVpZ2h0ID0gMTY7XG5cbiAgLyoqIENvbmZpZyBvYmplY3QgdG8gYmUgcGFzc2VkIGludG8gdGhlIHBvcG92ZXIncyBuZ0NsYXNzICovXG4gIF9jbGFzc0xpc3Q6IHsgW2tleTogc3RyaW5nXTogYm9vbGVhbiB9ID0ge307XG5cbiAgLyoqIFdoZXRoZXIgcG9wb3ZlcidzIGB0YXJnZXRFbGVtZW50YCBpcyBkZWZpbmVkICovXG4gIHB1YmxpYyBjb250YWluZXJQb3NpdGlvbmluZyA9IGZhbHNlO1xuXG4gIC8qKiBDbG9zaW5nIGRpc2FibGVkIG9uIHBvcG92ZXIgKi9cbiAgcHVibGljIGNsb3NlRGlzYWJsZWQgPSBmYWxzZTtcblxuICAvKiogQ29uZmlnIG9iamVjdCB0byBiZSBwYXNzZWQgaW50byB0aGUgcG9wb3ZlcidzIGFycm93IG5nU3R5bGUgKi9cbiAgcHVibGljIHBvcG92ZXJQYW5lbFN0eWxlczoge307XG5cbiAgLyoqIENvbmZpZyBvYmplY3QgdG8gYmUgcGFzc2VkIGludG8gdGhlIHBvcG92ZXIncyBhcnJvdyBuZ1N0eWxlICovXG4gIHB1YmxpYyBwb3BvdmVyQXJyb3dTdHlsZXM6IHt9O1xuXG4gIC8qKiBDb25maWcgb2JqZWN0IHRvIGJlIHBhc3NlZCBpbnRvIHRoZSBwb3BvdmVyJ3MgY29udGVudCBuZ1N0eWxlICovXG4gIHB1YmxpYyBwb3BvdmVyQ29udGVudFN0eWxlczoge307XG5cbiAgLyoqIEVtaXRzIHRoZSBjdXJyZW50IGFuaW1hdGlvbiBzdGF0ZSB3aGVuZXZlciBpdCBjaGFuZ2VzLiAqL1xuICBfb25BbmltYXRpb25TdGF0ZUNoYW5nZSA9IG5ldyBFdmVudEVtaXR0ZXI8QW5pbWF0aW9uRXZlbnQ+KCk7XG5cbiAgLyoqIFBvc2l0aW9uIG9mIHRoZSBwb3BvdmVyLiAqL1xuICBASW5wdXQoKVxuICBnZXQgcG9zaXRpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuX3Bvc2l0aW9uO1xuICB9XG4gIHNldCBwb3NpdGlvbih2YWx1ZTogTXR4UG9wb3ZlclBvc2l0aW9uKSB7XG4gICAgaWYgKCFbJ2JlZm9yZScsICdhZnRlcicsICdhYm92ZScsICdiZWxvdyddLmluY2x1ZGVzKHZhbHVlWzBdKSkge1xuICAgICAgdGhyb3dNdHhQb3BvdmVySW52YWxpZFBvc2l0aW9uU3RhcnQoKTtcbiAgICB9XG4gICAgaWYgKCFbJ2JlZm9yZScsICdhZnRlcicsICdhYm92ZScsICdiZWxvdycsICdjZW50ZXInXS5pbmNsdWRlcyh2YWx1ZVsxXSkpIHtcbiAgICAgIHRocm93TXR4UG9wb3ZlckludmFsaWRQb3NpdGlvbkVuZCgpO1xuICAgIH1cbiAgICB0aGlzLl9wb3NpdGlvbiA9IHZhbHVlO1xuICAgIHRoaXMuc2V0UG9zaXRpb25DbGFzc2VzKCk7XG4gIH1cblxuICAvKiogUG9wb3ZlciB0cmlnZ2VyIGV2ZW50ICovXG4gIEBJbnB1dCgpXG4gIGdldCB0cmlnZ2VyRXZlbnQoKTogTXR4UG9wb3ZlclRyaWdnZXJFdmVudCB7XG4gICAgcmV0dXJuIHRoaXMuX3RyaWdnZXJFdmVudDtcbiAgfVxuICBzZXQgdHJpZ2dlckV2ZW50KHZhbHVlOiBNdHhQb3BvdmVyVHJpZ2dlckV2ZW50KSB7XG4gICAgdGhpcy5fdHJpZ2dlckV2ZW50ID0gdmFsdWU7XG4gIH1cblxuICAvKiogUG9wb3ZlciBzY3JvbGwgc3RyYXRlZ3kgKi9cbiAgQElucHV0KClcbiAgZ2V0IHNjcm9sbFN0cmF0ZWd5KCk6IE10eFBvcG92ZXJTY3JvbGxTdHJhdGVneSB7XG4gICAgcmV0dXJuIHRoaXMuX3Njcm9sbFN0cmF0ZWd5O1xuICB9XG4gIHNldCBzY3JvbGxTdHJhdGVneSh2YWx1ZTogTXR4UG9wb3ZlclNjcm9sbFN0cmF0ZWd5KSB7XG4gICAgdGhpcy5fc2Nyb2xsU3RyYXRlZ3kgPSB2YWx1ZTtcbiAgfVxuXG4gIC8qKiBQb3BvdmVyIGVudGVyIGRlbGF5ICovXG4gIEBJbnB1dCgpXG4gIGdldCBlbnRlckRlbGF5KCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMuX2VudGVyRGVsYXk7XG4gIH1cbiAgc2V0IGVudGVyRGVsYXkodmFsdWU6IG51bWJlcikge1xuICAgIHRoaXMuX2VudGVyRGVsYXkgPSB2YWx1ZTtcbiAgfVxuXG4gIC8qKiBQb3BvdmVyIGxlYXZlIGRlbGF5ICovXG4gIEBJbnB1dCgpXG4gIGdldCBsZWF2ZURlbGF5KCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMuX2xlYXZlRGVsYXk7XG4gIH1cbiAgc2V0IGxlYXZlRGVsYXkodmFsdWU6IG51bWJlcikge1xuICAgIHRoaXMuX2xlYXZlRGVsYXkgPSB2YWx1ZTtcbiAgfVxuXG4gIC8qKiBQb3BvdmVyIHRhcmdldCBvZmZzZXQgeCAqL1xuICBASW5wdXQoKVxuICBnZXQgeE9mZnNldCgpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLl9wYW5lbE9mZnNldFg7XG4gIH1cbiAgc2V0IHhPZmZzZXQodmFsdWU6IG51bWJlcikge1xuICAgIHRoaXMuX3BhbmVsT2Zmc2V0WCA9IHZhbHVlO1xuICB9XG5cbiAgLyoqIFBvcG92ZXIgdGFyZ2V0IG9mZnNldCB5ICovXG4gIEBJbnB1dCgpXG4gIGdldCB5T2Zmc2V0KCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMuX3BhbmVsT2Zmc2V0WTtcbiAgfVxuICBzZXQgeU9mZnNldCh2YWx1ZTogbnVtYmVyKSB7XG4gICAgdGhpcy5fcGFuZWxPZmZzZXRZID0gdmFsdWU7XG4gIH1cblxuICAvKiogUG9wb3ZlciBhcnJvdyBvZmZzZXQgeCAqL1xuICBASW5wdXQoKVxuICBnZXQgYXJyb3dPZmZzZXRYKCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMuX2Fycm93T2Zmc2V0WDtcbiAgfVxuICBzZXQgYXJyb3dPZmZzZXRYKHZhbHVlOiBudW1iZXIpIHtcbiAgICB0aGlzLl9hcnJvd09mZnNldFggPSB2YWx1ZTtcbiAgfVxuXG4gIC8qKiBQb3BvdmVyIGFycm93IG9mZnNldCB5ICovXG4gIEBJbnB1dCgpXG4gIGdldCBhcnJvd09mZnNldFkoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5fYXJyb3dPZmZzZXRZO1xuICB9XG4gIHNldCBhcnJvd09mZnNldFkodmFsdWU6IG51bWJlcikge1xuICAgIHRoaXMuX2Fycm93T2Zmc2V0WSA9IHZhbHVlO1xuICB9XG5cbiAgLyoqIFBvcG92ZXIgYXJyb3cgd2lkdGggKi9cbiAgQElucHV0KClcbiAgZ2V0IGFycm93V2lkdGgoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5fYXJyb3dXaWR0aDtcbiAgfVxuICBzZXQgYXJyb3dXaWR0aCh2YWx1ZTogbnVtYmVyKSB7XG4gICAgdGhpcy5fYXJyb3dXaWR0aCA9IHZhbHVlO1xuICB9XG5cbiAgLyoqIFBvcG92ZXIgYXJyb3cgaGVpZ2h0ICovXG4gIEBJbnB1dCgpXG4gIGdldCBhcnJvd0hlaWdodCgpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLl9hcnJvd0hlaWdodDtcbiAgfVxuICBzZXQgYXJyb3dIZWlnaHQodmFsdWU6IG51bWJlcikge1xuICAgIHRoaXMuX2Fycm93SGVpZ2h0ID0gdmFsdWU7XG4gIH1cblxuICAvKiogUG9wb3ZlciBjbG9zZSBvbiBjb250YWluZXIgY2xpY2sgKi9cbiAgQElucHV0KClcbiAgZ2V0IGNsb3NlT25QYW5lbENsaWNrKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9jbG9zZU9uUGFuZWxDbGljaztcbiAgfVxuICBzZXQgY2xvc2VPblBhbmVsQ2xpY2sodmFsdWU6IGJvb2xlYW4pIHtcbiAgICB0aGlzLl9jbG9zZU9uUGFuZWxDbGljayA9IGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSh2YWx1ZSk7XG4gIH1cblxuICAvKiogUG9wb3ZlciBjbG9zZSBvbiBiYWNrZHJvcCBjbGljayAqL1xuICBASW5wdXQoKVxuICBnZXQgY2xvc2VPbkJhY2tkcm9wQ2xpY2soKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX2Nsb3NlT25CYWNrZHJvcENsaWNrO1xuICB9XG4gIHNldCBjbG9zZU9uQmFja2Ryb3BDbGljayh2YWx1ZTogYm9vbGVhbikge1xuICAgIHRoaXMuX2Nsb3NlT25CYWNrZHJvcENsaWNrID0gY29lcmNlQm9vbGVhblByb3BlcnR5KHZhbHVlKTtcbiAgfVxuXG4gIC8qKiBEaXNhYmxlIGFuaW1hdGlvbnMgb2YgcG9wb3ZlciBhbmQgYWxsIGNoaWxkIGVsZW1lbnRzICovXG4gIEBJbnB1dCgpXG4gIGdldCBkaXNhYmxlQW5pbWF0aW9uKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9kaXNhYmxlQW5pbWF0aW9uO1xuICB9XG4gIHNldCBkaXNhYmxlQW5pbWF0aW9uKHZhbHVlOiBib29sZWFuKSB7XG4gICAgdGhpcy5fZGlzYWJsZUFuaW1hdGlvbiA9IGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSh2YWx1ZSk7XG4gIH1cblxuICAvKiogUG9wb3ZlciBmb2N1cyB0cmFwIHVzaW5nIGNka1RyYXBGb2N1cyAqL1xuICBASW5wdXQoKVxuICBnZXQgZm9jdXNUcmFwRW5hYmxlZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fZm9jdXNUcmFwRW5hYmxlZDtcbiAgfVxuICBzZXQgZm9jdXNUcmFwRW5hYmxlZCh2YWx1ZTogYm9vbGVhbikge1xuICAgIHRoaXMuX2ZvY3VzVHJhcEVuYWJsZWQgPSBjb2VyY2VCb29sZWFuUHJvcGVydHkodmFsdWUpO1xuICB9XG5cbiAgLyoqIFBvcG92ZXIgZm9jdXMgdHJhcCBhdXRvIGNhcHR1cmUgdXNpbmcgY2RrVHJhcEZvY3VzQXV0b0NhcHR1cmUgKi9cbiAgQElucHV0KClcbiAgZ2V0IGZvY3VzVHJhcEF1dG9DYXB0dXJlRW5hYmxlZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fZm9jdXNUcmFwQXV0b0NhcHR1cmVFbmFibGVkO1xuICB9XG4gIHNldCBmb2N1c1RyYXBBdXRvQ2FwdHVyZUVuYWJsZWQodmFsdWU6IGJvb2xlYW4pIHtcbiAgICB0aGlzLl9mb2N1c1RyYXBBdXRvQ2FwdHVyZUVuYWJsZWQgPSBjb2VyY2VCb29sZWFuUHJvcGVydHkodmFsdWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoaXMgbWV0aG9kIHRha2VzIGNsYXNzZXMgc2V0IG9uIHRoZSBob3N0IG1kLXBvcG92ZXIgZWxlbWVudCBhbmQgYXBwbGllcyB0aGVtIG9uIHRoZVxuICAgKiBwb3BvdmVyIHRlbXBsYXRlIHRoYXQgZGlzcGxheXMgaW4gdGhlIG92ZXJsYXkgY29udGFpbmVyLiAgT3RoZXJ3aXNlLCBpdCdzIGRpZmZpY3VsdFxuICAgKiB0byBzdHlsZSB0aGUgY29udGFpbmluZyBwb3BvdmVyIGZyb20gb3V0c2lkZSB0aGUgY29tcG9uZW50LlxuICAgKiBAcGFyYW0gY2xhc3NlcyBsaXN0IG9mIGNsYXNzIG5hbWVzXG4gICAqL1xuICBASW5wdXQoJ2NsYXNzJylcbiAgc2V0IHBhbmVsQ2xhc3MoY2xhc3Nlczogc3RyaW5nKSB7XG4gICAgaWYgKGNsYXNzZXMgJiYgY2xhc3Nlcy5sZW5ndGgpIHtcbiAgICAgIHRoaXMuX2NsYXNzTGlzdCA9IGNsYXNzZXMuc3BsaXQoJyAnKS5yZWR1Y2UoKG9iajogYW55LCBjbGFzc05hbWU6IHN0cmluZykgPT4ge1xuICAgICAgICBvYmpbY2xhc3NOYW1lXSA9IHRydWU7XG4gICAgICAgIHJldHVybiBvYmo7XG4gICAgICB9LCB7fSk7XG5cbiAgICAgIHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5jbGFzc05hbWUgPSAnJztcbiAgICAgIHRoaXMuc2V0UG9zaXRpb25DbGFzc2VzKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFRoaXMgbWV0aG9kIHRha2VzIGNsYXNzZXMgc2V0IG9uIHRoZSBob3N0IG1kLXBvcG92ZXIgZWxlbWVudCBhbmQgYXBwbGllcyB0aGVtIG9uIHRoZVxuICAgKiBwb3BvdmVyIHRlbXBsYXRlIHRoYXQgZGlzcGxheXMgaW4gdGhlIG92ZXJsYXkgY29udGFpbmVyLiAgT3RoZXJ3aXNlLCBpdCdzIGRpZmZpY3VsdFxuICAgKiB0byBzdHlsZSB0aGUgY29udGFpbmluZyBwb3BvdmVyIGZyb20gb3V0c2lkZSB0aGUgY29tcG9uZW50LlxuICAgKiBAZGVwcmVjYXRlZCBVc2UgYHBhbmVsQ2xhc3NgIGluc3RlYWQuXG4gICAqIEBicmVha2luZy1jaGFuZ2UgOC4wLjBcbiAgICovXG4gIEBJbnB1dCgpXG4gIGdldCBjbGFzc0xpc3QoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5wYW5lbENsYXNzO1xuICB9XG4gIHNldCBjbGFzc0xpc3QoY2xhc3Nlczogc3RyaW5nKSB7XG4gICAgdGhpcy5wYW5lbENsYXNzID0gY2xhc3NlcztcbiAgfVxuXG4gIC8qKiBFdmVudCBlbWl0dGVkIHdoZW4gdGhlIHBvcG92ZXIgaXMgY2xvc2VkLiAqL1xuICBAT3V0cHV0KCkgY2xvc2VkID0gbmV3IEV2ZW50RW1pdHRlcjx2b2lkPigpO1xuXG4gIEBWaWV3Q2hpbGQoVGVtcGxhdGVSZWYpIHRlbXBsYXRlUmVmOiBUZW1wbGF0ZVJlZjxhbnk+O1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIEBPcHRpb25hbCgpIHByaXZhdGUgX2RpcjogRGlyZWN0aW9uYWxpdHksXG4gICAgcHJpdmF0ZSBfZWxlbWVudFJlZjogRWxlbWVudFJlZixcbiAgICBwdWJsaWMgem9uZTogTmdab25lXG4gICkge1xuICAgIHRoaXMuc2V0UG9zaXRpb25DbGFzc2VzKCk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLl9lbWl0Q2xvc2VFdmVudCgpO1xuICAgIHRoaXMuY2xvc2VkLmNvbXBsZXRlKCk7XG4gIH1cblxuICAvKiogSGFuZGxlIGEga2V5Ym9hcmQgZXZlbnQgZnJvbSB0aGUgcG9wb3ZlciwgZGVsZWdhdGluZyB0byB0aGUgYXBwcm9wcmlhdGUgYWN0aW9uLiAqL1xuICBfaGFuZGxlS2V5ZG93bihldmVudDogS2V5Ym9hcmRFdmVudCkge1xuICAgIHN3aXRjaCAoZXZlbnQua2V5Q29kZSkge1xuICAgICAgY2FzZSBFU0NBUEU6XG4gICAgICAgIHRoaXMuX2VtaXRDbG9zZUV2ZW50KCk7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogVGhpcyBlbWl0cyBhIGNsb3NlIGV2ZW50IHRvIHdoaWNoIHRoZSB0cmlnZ2VyIGlzIHN1YnNjcmliZWQuIFdoZW4gZW1pdHRlZCwgdGhlXG4gICAqIHRyaWdnZXIgd2lsbCBjbG9zZSB0aGUgcG9wb3Zlci5cbiAgICovXG4gIF9lbWl0Q2xvc2VFdmVudCgpOiB2b2lkIHtcbiAgICB0aGlzLmNsb3NlZC5lbWl0KCk7XG4gIH1cblxuICAvKiogQ2xvc2UgcG9wb3ZlciBvbiBjbGljayBpZiBjbG9zZU9uUGFuZWxDbGljayBpcyB0cnVlICovXG4gIG9uQ2xpY2soKSB7XG4gICAgaWYgKHRoaXMuY2xvc2VPblBhbmVsQ2xpY2spIHtcbiAgICAgIHRoaXMuX2VtaXRDbG9zZUV2ZW50KCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFRPRE86IFJlZmFjdG9yIHdoZW4gQGFuZ3VsYXIvY2RrIGluY2x1ZGVzIGZlYXR1cmUgSSBtZW50aW9uZWQgb24gZ2l0aHViIHNlZSBsaW5rIGJlbG93LlxuICAgKiBodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9tYXRlcmlhbDIvcHVsbC81NDkzI2lzc3VlY29tbWVudC0zMTMwODUzMjNcbiAgICovXG4gIC8qKiBEaXNhYmxlcyBjbG9zZSBvZiBwb3BvdmVyIHdoZW4gbGVhdmluZyB0cmlnZ2VyIGVsZW1lbnQgYW5kIG1vdXNlIG92ZXIgdGhlIHBvcG92ZXIgKi9cbiAgb25Nb3VzZU92ZXIoKSB7XG4gICAgaWYgKHRoaXMudHJpZ2dlckV2ZW50ID09PSAnaG92ZXInKSB7XG4gICAgICB0aGlzLmNsb3NlRGlzYWJsZWQgPSB0cnVlO1xuICAgIH1cbiAgfVxuICAvKiogRW5hYmxlcyBjbG9zZSBvZiBwb3BvdmVyIHdoZW4gbW91c2UgbGVhdmluZyBwb3BvdmVyIGVsZW1lbnQgKi9cbiAgb25Nb3VzZUxlYXZlKCkge1xuICAgIGlmICh0aGlzLnRyaWdnZXJFdmVudCA9PT0gJ2hvdmVyJykge1xuICAgICAgdGhpcy5jbG9zZURpc2FibGVkID0gZmFsc2U7XG4gICAgICB0aGlzLl9lbWl0Q2xvc2VFdmVudCgpO1xuICAgIH1cbiAgfVxuXG4gIC8vIFRPRE86IFJlZmFjdG9yIGhvdyBzdHlsZXMgYXJlIHNldCBhbmQgdXBkYXRlZCBvbiB0aGUgY29tcG9uZW50LCB1c2UgYmVzdCBwcmFjdGljZXMuXG4gIC8vIFRPRE86IElmIGFycm93IGxlZnQgYW5kIHJpZ2h0IHBvc2l0aW9uaW5nIGlzIHJlcXVlc3RlZCwgc2VlIGlmIGZsZXggZGlyZWN0aW9uIGNhbiBiZSB1c2VkIHRvIHdvcmsgd2l0aCBvcmRlci5cbiAgLyoqIFNldHMgdGhlIGN1cnJlbnQgc3R5bGVzIGZvciB0aGUgcG9wb3ZlciB0byBhbGxvdyBmb3IgZHluYW1pY2FsbHkgY2hhbmdpbmcgc2V0dGluZ3MgKi9cbiAgc2V0Q3VycmVudFN0eWxlcyhwb3MgPSB0aGlzLnBvc2l0aW9uKSB7XG4gICAgY29uc3QgbGVmdCA9XG4gICAgICBwb3NbMV0gPT09ICdhZnRlcidcbiAgICAgICAgPyBgJHt0aGlzLmFycm93T2Zmc2V0WCAtIHRoaXMuYXJyb3dXaWR0aCAvIDJ9cHhgXG4gICAgICAgIDogcG9zWzFdID09PSAnY2VudGVyJ1xuICAgICAgICA/IGBjYWxjKDUwJSAtICR7dGhpcy5hcnJvd1dpZHRoIC8gMn1weClgXG4gICAgICAgIDogJyc7XG4gICAgY29uc3QgcmlnaHQgPSBwb3NbMV0gPT09ICdiZWZvcmUnID8gYCR7dGhpcy5hcnJvd09mZnNldFggLSB0aGlzLmFycm93V2lkdGggLyAyfXB4YCA6ICcnO1xuXG4gICAgY29uc3QgYm90dG9tID1cbiAgICAgIHBvc1sxXSA9PT0gJ2Fib3ZlJ1xuICAgICAgICA/IGAke3RoaXMuYXJyb3dPZmZzZXRZIC0gdGhpcy5hcnJvd0hlaWdodCAvIDJ9cHhgXG4gICAgICAgIDogcG9zWzFdID09PSAnY2VudGVyJ1xuICAgICAgICA/IGBjYWxjKDUwJSAtICR7dGhpcy5hcnJvd0hlaWdodCAvIDJ9cHgpYFxuICAgICAgICA6ICcnO1xuICAgIGNvbnN0IHRvcCA9IHBvc1sxXSA9PT0gJ2JlbG93JyA/IGAke3RoaXMuYXJyb3dPZmZzZXRZIC0gdGhpcy5hcnJvd0hlaWdodCAvIDJ9cHhgIDogJyc7XG5cbiAgICB0aGlzLnBvcG92ZXJBcnJvd1N0eWxlcyA9XG4gICAgICBwb3NbMF0gPT09ICdhYm92ZScgfHwgcG9zWzBdID09PSAnYmVsb3cnXG4gICAgICAgID8ge1xuICAgICAgICAgICAgbGVmdDogdGhpcy5fZGlyLnZhbHVlID09PSAnbHRyJyA/IGxlZnQgOiByaWdodCxcbiAgICAgICAgICAgIHJpZ2h0OiB0aGlzLl9kaXIudmFsdWUgPT09ICdsdHInID8gcmlnaHQgOiBsZWZ0LFxuICAgICAgICAgIH1cbiAgICAgICAgOiB7XG4gICAgICAgICAgICB0b3AsXG4gICAgICAgICAgICBib3R0b20sXG4gICAgICAgICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJdCdzIG5lY2Vzc2FyeSB0byBzZXQgcG9zaXRpb24tYmFzZWQgY2xhc3NlcyB0byBlbnN1cmUgdGhlIHBvcG92ZXIgcGFuZWwgYW5pbWF0aW9uXG4gICAqIGZvbGRzIG91dCBmcm9tIHRoZSBjb3JyZWN0IGRpcmVjdGlvbi5cbiAgICovXG4gIHNldFBvc2l0aW9uQ2xhc3Nlcyhwb3MgPSB0aGlzLnBvc2l0aW9uKTogdm9pZCB7XG4gICAgdGhpcy5fY2xhc3NMaXN0WydtdHgtcG9wb3Zlci1iZWZvcmUtYWJvdmUnXSA9IHBvc1swXSA9PT0gJ2JlZm9yZScgJiYgcG9zWzFdID09PSAnYWJvdmUnO1xuICAgIHRoaXMuX2NsYXNzTGlzdFsnbXR4LXBvcG92ZXItYmVmb3JlLWNlbnRlciddID0gcG9zWzBdID09PSAnYmVmb3JlJyAmJiBwb3NbMV0gPT09ICdjZW50ZXInO1xuICAgIHRoaXMuX2NsYXNzTGlzdFsnbXR4LXBvcG92ZXItYmVmb3JlLWJlbG93J10gPSBwb3NbMF0gPT09ICdiZWZvcmUnICYmIHBvc1sxXSA9PT0gJ2JlbG93JztcbiAgICB0aGlzLl9jbGFzc0xpc3RbJ210eC1wb3BvdmVyLWFmdGVyLWFib3ZlJ10gPSBwb3NbMF0gPT09ICdhZnRlcicgJiYgcG9zWzFdID09PSAnYWJvdmUnO1xuICAgIHRoaXMuX2NsYXNzTGlzdFsnbXR4LXBvcG92ZXItYWZ0ZXItY2VudGVyJ10gPSBwb3NbMF0gPT09ICdhZnRlcicgJiYgcG9zWzFdID09PSAnY2VudGVyJztcbiAgICB0aGlzLl9jbGFzc0xpc3RbJ210eC1wb3BvdmVyLWFmdGVyLWJlbG93J10gPSBwb3NbMF0gPT09ICdhZnRlcicgJiYgcG9zWzFdID09PSAnYmVsb3cnO1xuICAgIHRoaXMuX2NsYXNzTGlzdFsnbXR4LXBvcG92ZXItYWJvdmUtYmVmb3JlJ10gPSBwb3NbMF0gPT09ICdhYm92ZScgJiYgcG9zWzFdID09PSAnYmVmb3JlJztcbiAgICB0aGlzLl9jbGFzc0xpc3RbJ210eC1wb3BvdmVyLWFib3ZlLWNlbnRlciddID0gcG9zWzBdID09PSAnYWJvdmUnICYmIHBvc1sxXSA9PT0gJ2NlbnRlcic7XG4gICAgdGhpcy5fY2xhc3NMaXN0WydtdHgtcG9wb3Zlci1hYm92ZS1hZnRlciddID0gcG9zWzBdID09PSAnYWJvdmUnICYmIHBvc1sxXSA9PT0gJ2FmdGVyJztcbiAgICB0aGlzLl9jbGFzc0xpc3RbJ210eC1wb3BvdmVyLWJlbG93LWJlZm9yZSddID0gcG9zWzBdID09PSAnYmVsb3cnICYmIHBvc1sxXSA9PT0gJ2JlZm9yZSc7XG4gICAgdGhpcy5fY2xhc3NMaXN0WydtdHgtcG9wb3Zlci1iZWxvdy1jZW50ZXInXSA9IHBvc1swXSA9PT0gJ2JlbG93JyAmJiBwb3NbMV0gPT09ICdjZW50ZXInO1xuICAgIHRoaXMuX2NsYXNzTGlzdFsnbXR4LXBvcG92ZXItYmVsb3ctYWZ0ZXInXSA9IHBvc1swXSA9PT0gJ2JlbG93JyAmJiBwb3NbMV0gPT09ICdhZnRlcic7XG4gIH1cblxuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfY2xvc2VPblBhbmVsQ2xpY2s6IEJvb2xlYW5JbnB1dDtcbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX2Nsb3NlT25CYWNrZHJvcENsaWNrOiBCb29sZWFuSW5wdXQ7XG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9kaXNhYmxlQW5pbWF0aW9uOiBCb29sZWFuSW5wdXQ7XG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9mb2N1c1RyYXBFbmFibGVkOiBCb29sZWFuSW5wdXQ7XG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9mb2N1c1RyYXBBdXRvQ2FwdHVyZUVuYWJsZWQ6IEJvb2xlYW5JbnB1dDtcbn1cbiJdfQ==