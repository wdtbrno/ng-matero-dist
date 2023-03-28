import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { ESCAPE, hasModifierKey } from '@angular/cdk/keycodes';
import { ChangeDetectionStrategy, Component, ContentChild, EventEmitter, Inject, InjectionToken, Input, Output, TemplateRef, ViewChild, ViewEncapsulation, } from '@angular/core';
import { Subject } from 'rxjs';
import { transformPopover } from './popover-animations';
import { MTX_POPOVER_CONTENT } from './popover-content';
import { throwMtxPopoverInvalidPositionEnd, throwMtxPopoverInvalidPositionStart, } from './popover-errors';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "@angular/cdk/a11y";
/** Injection token to be used to override the default options for `mtx-popover`. */
export const MTX_POPOVER_DEFAULT_OPTIONS = new InjectionToken('mtx-popover-default-options', {
    providedIn: 'root',
    factory: MTX_POPOVER_DEFAULT_OPTIONS_FACTORY,
});
/** @docs-private */
export function MTX_POPOVER_DEFAULT_OPTIONS_FACTORY() {
    return {
        backdropClass: 'cdk-overlay-transparent-backdrop',
    };
}
let popoverPanelUid = 0;
export class MtxPopover {
    /** Popover's trigger event. */
    get triggerEvent() {
        return this._triggerEvent;
    }
    set triggerEvent(value) {
        this._triggerEvent = value;
    }
    /** Popover's enter delay. */
    get enterDelay() {
        return this._enterDelay;
    }
    set enterDelay(value) {
        this._enterDelay = value;
    }
    /** Popover's leave delay. */
    get leaveDelay() {
        return this._leaveDelay;
    }
    set leaveDelay(value) {
        this._leaveDelay = value;
    }
    /** Popover's position. */
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
    /** Popover-panel's X offset. */
    get xOffset() {
        return this._panelOffsetX;
    }
    set xOffset(value) {
        this._panelOffsetX = value;
    }
    /** Popover-panel's Y offset. */
    get yOffset() {
        return this._panelOffsetY;
    }
    set yOffset(value) {
        this._panelOffsetY = value;
    }
    /** Popover-arrow's width. */
    get arrowWidth() {
        return this._arrowWidth;
    }
    set arrowWidth(value) {
        this._arrowWidth = value;
    }
    /** Popover-arrow's height. */
    get arrowHeight() {
        return this._arrowHeight;
    }
    set arrowHeight(value) {
        this._arrowHeight = value;
    }
    /** Popover-arrow's X offset. */
    get arrowOffsetX() {
        return this._arrowOffsetX;
    }
    set arrowOffsetX(value) {
        this._arrowOffsetX = value;
    }
    /** Popover-arrow's Y offset. */
    get arrowOffsetY() {
        return this._arrowOffsetY;
    }
    set arrowOffsetY(value) {
        this._arrowOffsetY = value;
    }
    /** Whether popover can be closed when click the popover-panel. */
    get closeOnPanelClick() {
        return this._closeOnPanelClick;
    }
    set closeOnPanelClick(value) {
        this._closeOnPanelClick = coerceBooleanProperty(value);
    }
    /** Whether popover can be closed when click the backdrop. */
    get closeOnBackdropClick() {
        return this._closeOnBackdropClick;
    }
    set closeOnBackdropClick(value) {
        this._closeOnBackdropClick = coerceBooleanProperty(value);
    }
    /** Whether enable focus trap using `cdkTrapFocus`. */
    get focusTrapEnabled() {
        return this._focusTrapEnabled;
    }
    set focusTrapEnabled(value) {
        this._focusTrapEnabled = coerceBooleanProperty(value);
    }
    /** Whether enable focus trap auto capture using `cdkTrapFocusAutoCapture`. */
    get focusTrapAutoCaptureEnabled() {
        return this._focusTrapAutoCaptureEnabled;
    }
    set focusTrapAutoCaptureEnabled(value) {
        this._focusTrapAutoCaptureEnabled = coerceBooleanProperty(value);
    }
    /** Whether the popover has a backdrop. It will always be false if the trigger event is hover. */
    get hasBackdrop() {
        return this._hasBackdrop;
    }
    set hasBackdrop(value) {
        this._hasBackdrop = coerceBooleanProperty(value);
    }
    /** Popover-panel's elevation (0~24). */
    get elevation() {
        return Math.max(0, Math.min(Math.round(this._elevation), 24));
    }
    set elevation(value) {
        this._elevation = value;
    }
    /**
     * This method takes classes set on the host md-popover element and applies them on the
     * popover template that displays in the overlay container. Otherwise, it's difficult
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
     * popover template that displays in the overlay container. Otherwise, it's difficult
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
    constructor(_elementRef, _ngZone, _defaultOptions) {
        this._elementRef = _elementRef;
        this._ngZone = _ngZone;
        this._defaultOptions = _defaultOptions;
        this._triggerEvent = this._defaultOptions.triggerEvent ?? 'hover';
        this._enterDelay = this._defaultOptions.enterDelay ?? 100;
        this._leaveDelay = this._defaultOptions.leaveDelay ?? 100;
        this._position = this._defaultOptions.position ?? ['below', 'after'];
        this._panelOffsetX = this._defaultOptions.xOffset ?? 0;
        this._panelOffsetY = this._defaultOptions.yOffset ?? 0;
        this._arrowWidth = this._defaultOptions.arrowWidth ?? 16;
        this._arrowHeight = this._defaultOptions.arrowHeight ?? 16;
        this._arrowOffsetX = this._defaultOptions.arrowOffsetX ?? 20;
        this._arrowOffsetY = this._defaultOptions.arrowOffsetY ?? 20;
        this._closeOnPanelClick = this._defaultOptions.closeOnPanelClick ?? false;
        this._closeOnBackdropClick = this._defaultOptions.closeOnBackdropClick ?? true;
        this._focusTrapEnabled = this._defaultOptions.focusTrapEnabled ?? false;
        this._focusTrapAutoCaptureEnabled = this._defaultOptions.focusTrapAutoCaptureEnabled ?? false;
        this._hasBackdrop = this._defaultOptions.hasBackdrop;
        this._elevation = this._defaultOptions.elevation ?? 8;
        this._elevationPrefix = 'mat-elevation-z';
        /** Config object to be passed into the popover's ngClass. */
        this._classList = {};
        /** Current state of the panel animation. */
        this._panelAnimationState = 'void';
        /** Emits whenever an animation on the popover completes. */
        this._animationDone = new Subject();
        /** Whether the popover is animating. */
        this._isAnimating = false;
        /** Closing disabled on popover */
        this.closeDisabled = false;
        /** Class or list of classes to be added to the overlay panel. */
        this.overlayPanelClass = this._defaultOptions.overlayPanelClass || '';
        /** Class to be added to the backdrop element. */
        this.backdropClass = this._defaultOptions.backdropClass;
        /** Event emitted when the popover is closed. */
        this.closed = new EventEmitter();
        this.panelId = `mtx-popover-panel-${popoverPanelUid++}`;
    }
    ngOnInit() {
        this.setPositionClasses();
    }
    ngOnDestroy() {
        this.closed.complete();
    }
    /** Handle a keyboard event from the popover, delegating to the appropriate action. */
    _handleKeydown(event) {
        const keyCode = event.keyCode;
        switch (keyCode) {
            case ESCAPE:
                if (!hasModifierKey(event)) {
                    event.preventDefault();
                    this.closed.emit('keydown');
                }
                break;
        }
    }
    /** Close popover on click if `closeOnPanelClick` is true. */
    _handleClick() {
        if (this.closeOnPanelClick) {
            this.closed.emit('click');
        }
    }
    /** Disables close of popover when leaving trigger element and mouse over the popover. */
    _handleMouseOver() {
        if (this.triggerEvent === 'hover') {
            this.closeDisabled = true;
        }
    }
    /** Enables close of popover when mouse leaving popover element. */
    _handleMouseLeave() {
        if (this.triggerEvent === 'hover') {
            setTimeout(() => {
                this.closeDisabled = false;
                this.closed.emit();
            }, this.leaveDelay);
        }
    }
    /** Sets the current styles for the popover to allow for dynamically changing settings. */
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
        this.arrowStyles =
            pos[0] === 'above' || pos[0] === 'below'
                ? {
                    left: this.direction === 'ltr' ? left : right,
                    right: this.direction === 'ltr' ? right : left,
                }
                : { top, bottom };
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
    /** Sets the popover-panel's elevation. */
    setElevation() {
        const newElevation = `${this._elevationPrefix}${this.elevation}`;
        if (this._previousElevation) {
            this._classList[this._previousElevation] = false;
        }
        this._classList[newElevation] = true;
        this._previousElevation = newElevation;
    }
    /** Starts the enter animation. */
    _startAnimation() {
        // @breaking-change 8.0.0 Combine with _resetAnimation.
        this._panelAnimationState = 'enter';
    }
    /** Resets the panel animation to its initial state. */
    _resetAnimation() {
        // @breaking-change 8.0.0 Combine with _startAnimation.
        this._panelAnimationState = 'void';
    }
    /** Callback that is invoked when the panel animation completes. */
    _onAnimationDone(event) {
        this._animationDone.next(event);
        this._isAnimating = false;
    }
    _onAnimationStart(event) {
        this._isAnimating = true;
    }
}
/** @nocollapse */ MtxPopover.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MtxPopover, deps: [{ token: i0.ElementRef }, { token: i0.NgZone }, { token: MTX_POPOVER_DEFAULT_OPTIONS }], target: i0.ɵɵFactoryTarget.Component });
/** @nocollapse */ MtxPopover.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.1", type: MtxPopover, selector: "mtx-popover", inputs: { backdropClass: "backdropClass", ariaLabel: ["aria-label", "ariaLabel"], ariaLabelledby: ["aria-labelledby", "ariaLabelledby"], ariaDescribedby: ["aria-describedby", "ariaDescribedby"], triggerEvent: "triggerEvent", enterDelay: "enterDelay", leaveDelay: "leaveDelay", position: "position", xOffset: "xOffset", yOffset: "yOffset", arrowWidth: "arrowWidth", arrowHeight: "arrowHeight", arrowOffsetX: "arrowOffsetX", arrowOffsetY: "arrowOffsetY", closeOnPanelClick: "closeOnPanelClick", closeOnBackdropClick: "closeOnBackdropClick", focusTrapEnabled: "focusTrapEnabled", focusTrapAutoCaptureEnabled: "focusTrapAutoCaptureEnabled", hasBackdrop: "hasBackdrop", elevation: "elevation", panelClass: ["class", "panelClass"], classList: "classList" }, outputs: { closed: "closed" }, queries: [{ propertyName: "lazyContent", first: true, predicate: MTX_POPOVER_CONTENT, descendants: true }], viewQueries: [{ propertyName: "templateRef", first: true, predicate: TemplateRef, descendants: true }], exportAs: ["mtxPopover"], ngImport: i0, template: "<ng-template>\r\n  <div class=\"mtx-popover-panel\"\r\n       [id]=\"panelId\"\r\n       [ngClass]=\"_classList\"\r\n       (keydown)=\"_handleKeydown($event)\"\r\n       (click)=\"_handleClick()\"\r\n       (mouseover)=\"_handleMouseOver()\"\r\n       (mouseleave)=\"_handleMouseLeave()\"\r\n       [@transformPopover]=\"_panelAnimationState\"\r\n       (@transformPopover.start)=\"_onAnimationStart($event)\"\r\n       (@transformPopover.done)=\"_onAnimationDone($event)\"\r\n       tabindex=\"-1\"\r\n       role=\"dialog\"\r\n       [attr.aria-label]=\"ariaLabel || null\"\r\n       [attr.aria-labelledby]=\"ariaLabelledby || null\"\r\n       [attr.aria-describedby]=\"ariaDescribedby || null\"\r\n       [cdkTrapFocus]=\"focusTrapEnabled\"\r\n       [cdkTrapFocusAutoCapture]=\"focusTrapAutoCaptureEnabled\">\r\n    <div class=\"mtx-popover-content\">\r\n      <ng-content></ng-content>\r\n    </div>\r\n    <div class=\"mtx-popover-direction-arrow\" [ngStyle]=\"arrowStyles\"></div>\r\n  </div>\r\n</ng-template>\r\n", styles: [".mtx-popover-panel{position:relative;max-height:calc(100vh - 48px);padding:8px;border-radius:4px;font-size:16px;outline:0}.mtx-popover-panel[class*=mtx-popover-below]{margin-top:calc(.5em + 2px)}.mtx-popover-panel[class*=mtx-popover-above]{margin-bottom:calc(.5em + 2px)}.mtx-popover-panel[class*=mtx-popover-before]{margin-right:calc(.5em + 2px)}[dir=rtl] .mtx-popover-panel[class*=mtx-popover-before]{margin-right:auto;margin-left:calc(.5em + 2px)}.mtx-popover-panel[class*=mtx-popover-after]{margin-left:calc(.5em + 2px)}[dir=rtl] .mtx-popover-panel[class*=mtx-popover-after]{margin-left:auto;margin-right:calc(.5em + 2px)}.mtx-popover-direction-arrow{position:absolute}.mtx-popover-direction-arrow:before,.mtx-popover-direction-arrow:after{position:absolute;display:inline-block;content:\"\";border-width:.5em;border-style:solid}.mtx-popover-direction-arrow:after{border-width:calc(.5em - 1px)}[class*=mtx-popover-below] .mtx-popover-direction-arrow,[class*=mtx-popover-above] .mtx-popover-direction-arrow{width:1em}[class*=mtx-popover-below] .mtx-popover-direction-arrow:after,[class*=mtx-popover-above] .mtx-popover-direction-arrow:after{left:1px}[dir=rtl] [class*=mtx-popover-below] .mtx-popover-direction-arrow:after,[dir=rtl] [class*=mtx-popover-above] .mtx-popover-direction-arrow:after{right:1px;left:auto}[class*=mtx-popover-below] .mtx-popover-direction-arrow{top:0}[class*=mtx-popover-below] .mtx-popover-direction-arrow:before,[class*=mtx-popover-below] .mtx-popover-direction-arrow:after{bottom:0;border-top-width:0}[class*=mtx-popover-above] .mtx-popover-direction-arrow{bottom:0}[class*=mtx-popover-above] .mtx-popover-direction-arrow:before,[class*=mtx-popover-above] .mtx-popover-direction-arrow:after{top:0;border-bottom-width:0}[class*=mtx-popover-before] .mtx-popover-direction-arrow,[class*=mtx-popover-after] .mtx-popover-direction-arrow{height:1em}[class*=mtx-popover-before] .mtx-popover-direction-arrow:after,[class*=mtx-popover-after] .mtx-popover-direction-arrow:after{top:1px}[class*=mtx-popover-before] .mtx-popover-direction-arrow{right:0}[class*=mtx-popover-before] .mtx-popover-direction-arrow:before,[class*=mtx-popover-before] .mtx-popover-direction-arrow:after{left:0;border-right-width:0}[dir=rtl] [class*=mtx-popover-before] .mtx-popover-direction-arrow{right:auto;left:0}[dir=rtl] [class*=mtx-popover-before] .mtx-popover-direction-arrow:before,[dir=rtl] [class*=mtx-popover-before] .mtx-popover-direction-arrow:after{left:auto;right:0;border-left-width:0}[dir=rtl] [class*=mtx-popover-before] .mtx-popover-direction-arrow:before{border-right-width:.5em}[dir=rtl] [class*=mtx-popover-before] .mtx-popover-direction-arrow:after{border-right-width:calc(.5em - 1px)}[class*=mtx-popover-after] .mtx-popover-direction-arrow{left:0}[class*=mtx-popover-after] .mtx-popover-direction-arrow:before,[class*=mtx-popover-after] .mtx-popover-direction-arrow:after{right:0;border-left-width:0}[dir=rtl] [class*=mtx-popover-after] .mtx-popover-direction-arrow{left:auto;right:0}[dir=rtl] [class*=mtx-popover-after] .mtx-popover-direction-arrow:before,[dir=rtl] [class*=mtx-popover-after] .mtx-popover-direction-arrow:after{right:auto;left:0;border-right-width:0}[dir=rtl] [class*=mtx-popover-after] .mtx-popover-direction-arrow:before{border-left-width:.5em}[dir=rtl] [class*=mtx-popover-after] .mtx-popover-direction-arrow:after{border-left-width:calc(.5em - 1px)}\n"], dependencies: [{ kind: "directive", type: i1.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i1.NgStyle, selector: "[ngStyle]", inputs: ["ngStyle"] }, { kind: "directive", type: i2.CdkTrapFocus, selector: "[cdkTrapFocus]", inputs: ["cdkTrapFocus", "cdkTrapFocusAutoCapture"], exportAs: ["cdkTrapFocus"] }], animations: [transformPopover], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MtxPopover, decorators: [{
            type: Component,
            args: [{ selector: 'mtx-popover', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, animations: [transformPopover], exportAs: 'mtxPopover', template: "<ng-template>\r\n  <div class=\"mtx-popover-panel\"\r\n       [id]=\"panelId\"\r\n       [ngClass]=\"_classList\"\r\n       (keydown)=\"_handleKeydown($event)\"\r\n       (click)=\"_handleClick()\"\r\n       (mouseover)=\"_handleMouseOver()\"\r\n       (mouseleave)=\"_handleMouseLeave()\"\r\n       [@transformPopover]=\"_panelAnimationState\"\r\n       (@transformPopover.start)=\"_onAnimationStart($event)\"\r\n       (@transformPopover.done)=\"_onAnimationDone($event)\"\r\n       tabindex=\"-1\"\r\n       role=\"dialog\"\r\n       [attr.aria-label]=\"ariaLabel || null\"\r\n       [attr.aria-labelledby]=\"ariaLabelledby || null\"\r\n       [attr.aria-describedby]=\"ariaDescribedby || null\"\r\n       [cdkTrapFocus]=\"focusTrapEnabled\"\r\n       [cdkTrapFocusAutoCapture]=\"focusTrapAutoCaptureEnabled\">\r\n    <div class=\"mtx-popover-content\">\r\n      <ng-content></ng-content>\r\n    </div>\r\n    <div class=\"mtx-popover-direction-arrow\" [ngStyle]=\"arrowStyles\"></div>\r\n  </div>\r\n</ng-template>\r\n", styles: [".mtx-popover-panel{position:relative;max-height:calc(100vh - 48px);padding:8px;border-radius:4px;font-size:16px;outline:0}.mtx-popover-panel[class*=mtx-popover-below]{margin-top:calc(.5em + 2px)}.mtx-popover-panel[class*=mtx-popover-above]{margin-bottom:calc(.5em + 2px)}.mtx-popover-panel[class*=mtx-popover-before]{margin-right:calc(.5em + 2px)}[dir=rtl] .mtx-popover-panel[class*=mtx-popover-before]{margin-right:auto;margin-left:calc(.5em + 2px)}.mtx-popover-panel[class*=mtx-popover-after]{margin-left:calc(.5em + 2px)}[dir=rtl] .mtx-popover-panel[class*=mtx-popover-after]{margin-left:auto;margin-right:calc(.5em + 2px)}.mtx-popover-direction-arrow{position:absolute}.mtx-popover-direction-arrow:before,.mtx-popover-direction-arrow:after{position:absolute;display:inline-block;content:\"\";border-width:.5em;border-style:solid}.mtx-popover-direction-arrow:after{border-width:calc(.5em - 1px)}[class*=mtx-popover-below] .mtx-popover-direction-arrow,[class*=mtx-popover-above] .mtx-popover-direction-arrow{width:1em}[class*=mtx-popover-below] .mtx-popover-direction-arrow:after,[class*=mtx-popover-above] .mtx-popover-direction-arrow:after{left:1px}[dir=rtl] [class*=mtx-popover-below] .mtx-popover-direction-arrow:after,[dir=rtl] [class*=mtx-popover-above] .mtx-popover-direction-arrow:after{right:1px;left:auto}[class*=mtx-popover-below] .mtx-popover-direction-arrow{top:0}[class*=mtx-popover-below] .mtx-popover-direction-arrow:before,[class*=mtx-popover-below] .mtx-popover-direction-arrow:after{bottom:0;border-top-width:0}[class*=mtx-popover-above] .mtx-popover-direction-arrow{bottom:0}[class*=mtx-popover-above] .mtx-popover-direction-arrow:before,[class*=mtx-popover-above] .mtx-popover-direction-arrow:after{top:0;border-bottom-width:0}[class*=mtx-popover-before] .mtx-popover-direction-arrow,[class*=mtx-popover-after] .mtx-popover-direction-arrow{height:1em}[class*=mtx-popover-before] .mtx-popover-direction-arrow:after,[class*=mtx-popover-after] .mtx-popover-direction-arrow:after{top:1px}[class*=mtx-popover-before] .mtx-popover-direction-arrow{right:0}[class*=mtx-popover-before] .mtx-popover-direction-arrow:before,[class*=mtx-popover-before] .mtx-popover-direction-arrow:after{left:0;border-right-width:0}[dir=rtl] [class*=mtx-popover-before] .mtx-popover-direction-arrow{right:auto;left:0}[dir=rtl] [class*=mtx-popover-before] .mtx-popover-direction-arrow:before,[dir=rtl] [class*=mtx-popover-before] .mtx-popover-direction-arrow:after{left:auto;right:0;border-left-width:0}[dir=rtl] [class*=mtx-popover-before] .mtx-popover-direction-arrow:before{border-right-width:.5em}[dir=rtl] [class*=mtx-popover-before] .mtx-popover-direction-arrow:after{border-right-width:calc(.5em - 1px)}[class*=mtx-popover-after] .mtx-popover-direction-arrow{left:0}[class*=mtx-popover-after] .mtx-popover-direction-arrow:before,[class*=mtx-popover-after] .mtx-popover-direction-arrow:after{right:0;border-left-width:0}[dir=rtl] [class*=mtx-popover-after] .mtx-popover-direction-arrow{left:auto;right:0}[dir=rtl] [class*=mtx-popover-after] .mtx-popover-direction-arrow:before,[dir=rtl] [class*=mtx-popover-after] .mtx-popover-direction-arrow:after{right:auto;left:0;border-right-width:0}[dir=rtl] [class*=mtx-popover-after] .mtx-popover-direction-arrow:before{border-left-width:.5em}[dir=rtl] [class*=mtx-popover-after] .mtx-popover-direction-arrow:after{border-left-width:calc(.5em - 1px)}\n"] }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i0.NgZone }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [MTX_POPOVER_DEFAULT_OPTIONS]
                }] }]; }, propDecorators: { backdropClass: [{
                type: Input
            }], ariaLabel: [{
                type: Input,
                args: ['aria-label']
            }], ariaLabelledby: [{
                type: Input,
                args: ['aria-labelledby']
            }], ariaDescribedby: [{
                type: Input,
                args: ['aria-describedby']
            }], triggerEvent: [{
                type: Input
            }], enterDelay: [{
                type: Input
            }], leaveDelay: [{
                type: Input
            }], position: [{
                type: Input
            }], xOffset: [{
                type: Input
            }], yOffset: [{
                type: Input
            }], arrowWidth: [{
                type: Input
            }], arrowHeight: [{
                type: Input
            }], arrowOffsetX: [{
                type: Input
            }], arrowOffsetY: [{
                type: Input
            }], closeOnPanelClick: [{
                type: Input
            }], closeOnBackdropClick: [{
                type: Input
            }], focusTrapEnabled: [{
                type: Input
            }], focusTrapAutoCaptureEnabled: [{
                type: Input
            }], hasBackdrop: [{
                type: Input
            }], elevation: [{
                type: Input
            }], panelClass: [{
                type: Input,
                args: ['class']
            }], classList: [{
                type: Input
            }], closed: [{
                type: Output
            }], templateRef: [{
                type: ViewChild,
                args: [TemplateRef]
            }], lazyContent: [{
                type: ContentChild,
                args: [MTX_POPOVER_CONTENT]
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9wb3Zlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL2V4dGVuc2lvbnMvcG9wb3Zlci9wb3BvdmVyLnRzIiwiLi4vLi4vLi4vLi4vcHJvamVjdHMvZXh0ZW5zaW9ucy9wb3BvdmVyL3BvcG92ZXIuaHRtbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFFQSxPQUFPLEVBQWdCLHFCQUFxQixFQUFFLE1BQU0sdUJBQXVCLENBQUM7QUFDNUUsT0FBTyxFQUFFLE1BQU0sRUFBRSxjQUFjLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQztBQUMvRCxPQUFPLEVBQ0wsdUJBQXVCLEVBQ3ZCLFNBQVMsRUFDVCxZQUFZLEVBRVosWUFBWSxFQUNaLE1BQU0sRUFDTixjQUFjLEVBQ2QsS0FBSyxFQUlMLE1BQU0sRUFDTixXQUFXLEVBQ1gsU0FBUyxFQUNULGlCQUFpQixHQUNsQixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQy9CLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBQ3hELE9BQU8sRUFBcUIsbUJBQW1CLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQztBQUMzRSxPQUFPLEVBQ0wsaUNBQWlDLEVBQ2pDLG1DQUFtQyxHQUNwQyxNQUFNLGtCQUFrQixDQUFDOzs7O0FBSTFCLG9GQUFvRjtBQUNwRixNQUFNLENBQUMsTUFBTSwyQkFBMkIsR0FBRyxJQUFJLGNBQWMsQ0FDM0QsNkJBQTZCLEVBQzdCO0lBQ0UsVUFBVSxFQUFFLE1BQU07SUFDbEIsT0FBTyxFQUFFLG1DQUFtQztDQUM3QyxDQUNGLENBQUM7QUFFRixvQkFBb0I7QUFDcEIsTUFBTSxVQUFVLG1DQUFtQztJQUNqRCxPQUFPO1FBQ0wsYUFBYSxFQUFFLGtDQUFrQztLQUNsRCxDQUFDO0FBQ0osQ0FBQztBQUVELElBQUksZUFBZSxHQUFHLENBQUMsQ0FBQztBQVd4QixNQUFNLE9BQU8s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ZW50IH0gZnJvbSAnQGFuZ3VsYXIvYW5pbWF0aW9ucyc7XG5pbXBvcnQgeyBEaXJlY3Rpb24gfSBmcm9tICdAYW5ndWxhci9jZGsvYmlkaSc7XG5pbXBvcnQgeyBCb29sZWFuSW5wdXQsIGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSB9IGZyb20gJ0Bhbmd1bGFyL2Nkay9jb2VyY2lvbic7XG5pbXBvcnQgeyBFU0NBUEUsIGhhc01vZGlmaWVyS2V5IH0gZnJvbSAnQGFuZ3VsYXIvY2RrL2tleWNvZGVzJztcbmltcG9ydCB7XG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBDb21wb25lbnQsXG4gIENvbnRlbnRDaGlsZCxcbiAgRWxlbWVudFJlZixcbiAgRXZlbnRFbWl0dGVyLFxuICBJbmplY3QsXG4gIEluamVjdGlvblRva2VuLFxuICBJbnB1dCxcbiAgTmdab25lLFxuICBPbkRlc3Ryb3ksXG4gIE9uSW5pdCxcbiAgT3V0cHV0LFxuICBUZW1wbGF0ZVJlZixcbiAgVmlld0NoaWxkLFxuICBWaWV3RW5jYXBzdWxhdGlvbixcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBTdWJqZWN0IH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyB0cmFuc2Zvcm1Qb3BvdmVyIH0gZnJvbSAnLi9wb3BvdmVyLWFuaW1hdGlvbnMnO1xuaW1wb3J0IHsgTXR4UG9wb3ZlckNvbnRlbnQsIE1UWF9QT1BPVkVSX0NPTlRFTlQgfSBmcm9tICcuL3BvcG92ZXItY29udGVudCc7XG5pbXBvcnQge1xuICB0aHJvd010eFBvcG92ZXJJbnZhbGlkUG9zaXRpb25FbmQsXG4gIHRocm93TXR4UG9wb3ZlckludmFsaWRQb3NpdGlvblN0YXJ0LFxufSBmcm9tICcuL3BvcG92ZXItZXJyb3JzJztcbmltcG9ydCB7IE10eFBvcG92ZXJEZWZhdWx0T3B0aW9ucywgTXR4UG9wb3ZlclBhbmVsIH0gZnJvbSAnLi9wb3BvdmVyLWludGVyZmFjZXMnO1xuaW1wb3J0IHsgTXR4UG9wb3ZlclBvc2l0aW9uLCBNdHhQb3BvdmVyVHJpZ2dlckV2ZW50LCBQb3BvdmVyQ2xvc2VSZWFzb24gfSBmcm9tICcuL3BvcG92ZXItdHlwZXMnO1xuXG4vKiogSW5qZWN0aW9uIHRva2VuIHRvIGJlIHVzZWQgdG8gb3ZlcnJpZGUgdGhlIGRlZmF1bHQgb3B0aW9ucyBmb3IgYG10eC1wb3BvdmVyYC4gKi9cbmV4cG9ydCBjb25zdCBNVFhfUE9QT1ZFUl9ERUZBVUxUX09QVElPTlMgPSBuZXcgSW5qZWN0aW9uVG9rZW48TXR4UG9wb3ZlckRlZmF1bHRPcHRpb25zPihcbiAgJ210eC1wb3BvdmVyLWRlZmF1bHQtb3B0aW9ucycsXG4gIHtcbiAgICBwcm92aWRlZEluOiAncm9vdCcsXG4gICAgZmFjdG9yeTogTVRYX1BPUE9WRVJfREVGQVVMVF9PUFRJT05TX0ZBQ1RPUlksXG4gIH1cbik7XG5cbi8qKiBAZG9jcy1wcml2YXRlICovXG5leHBvcnQgZnVuY3Rpb24gTVRYX1BPUE9WRVJfREVGQVVMVF9PUFRJT05TX0ZBQ1RPUlkoKTogTXR4UG9wb3ZlckRlZmF1bHRPcHRpb25zIHtcbiAgcmV0dXJuIHtcbiAgICBiYWNrZHJvcENsYXNzOiAnY2RrLW92ZXJsYXktdHJhbnNwYXJlbnQtYmFja2Ryb3AnLFxuICB9O1xufVxuXG5sZXQgcG9wb3ZlclBhbmVsVWlkID0gMDtcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbXR4LXBvcG92ZXInLFxuICB0ZW1wbGF0ZVVybDogJy4vcG9wb3Zlci5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJy4vcG9wb3Zlci5zY3NzJ10sXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICBhbmltYXRpb25zOiBbdHJhbnNmb3JtUG9wb3Zlcl0sXG4gIGV4cG9ydEFzOiAnbXR4UG9wb3ZlcicsXG59KVxuZXhwb3J0IGNsYXNzIE10eFBvcG92ZXIgaW1wbGVtZW50cyBNdHhQb3BvdmVyUGFuZWwsIE9uSW5pdCwgT25EZXN0cm95IHtcbiAgcHJpdmF0ZSBfdHJpZ2dlckV2ZW50ID0gdGhpcy5fZGVmYXVsdE9wdGlvbnMudHJpZ2dlckV2ZW50ID8/ICdob3Zlcic7XG4gIHByaXZhdGUgX2VudGVyRGVsYXkgPSB0aGlzLl9kZWZhdWx0T3B0aW9ucy5lbnRlckRlbGF5ID8/IDEwMDtcbiAgcHJpdmF0ZSBfbGVhdmVEZWxheSA9IHRoaXMuX2RlZmF1bHRPcHRpb25zLmxlYXZlRGVsYXkgPz8gMTAwO1xuICBwcml2YXRlIF9wb3NpdGlvbiA9IHRoaXMuX2RlZmF1bHRPcHRpb25zLnBvc2l0aW9uID8/IFsnYmVsb3cnLCAnYWZ0ZXInXTtcbiAgcHJpdmF0ZSBfcGFuZWxPZmZzZXRYID0gdGhpcy5fZGVmYXVsdE9wdGlvbnMueE9mZnNldCA/PyAwO1xuICBwcml2YXRlIF9wYW5lbE9mZnNldFkgPSB0aGlzLl9kZWZhdWx0T3B0aW9ucy55T2Zmc2V0ID8/IDA7XG4gIHByaXZhdGUgX2Fycm93V2lkdGggPSB0aGlzLl9kZWZhdWx0T3B0aW9ucy5hcnJvd1dpZHRoID8/IDE2O1xuICBwcml2YXRlIF9hcnJvd0hlaWdodCA9IHRoaXMuX2RlZmF1bHRPcHRpb25zLmFycm93SGVpZ2h0ID8/IDE2O1xuICBwcml2YXRlIF9hcnJvd09mZnNldFggPSB0aGlzLl9kZWZhdWx0T3B0aW9ucy5hcnJvd09mZnNldFggPz8gMjA7XG4gIHByaXZhdGUgX2Fycm93T2Zmc2V0WSA9IHRoaXMuX2RlZmF1bHRPcHRpb25zLmFycm93T2Zmc2V0WSA/PyAyMDtcbiAgcHJpdmF0ZSBfY2xvc2VPblBhbmVsQ2xpY2sgPSB0aGlzLl9kZWZhdWx0T3B0aW9ucy5jbG9zZU9uUGFuZWxDbGljayA/PyBmYWxzZTtcbiAgcHJpdmF0ZSBfY2xvc2VPbkJhY2tkcm9wQ2xpY2sgPSB0aGlzLl9kZWZhdWx0T3B0aW9ucy5jbG9zZU9uQmFja2Ryb3BDbGljayA/PyB0cnVlO1xuICBwcml2YXRlIF9mb2N1c1RyYXBFbmFibGVkID0gdGhpcy5fZGVmYXVsdE9wdGlvbnMuZm9jdXNUcmFwRW5hYmxlZCA/PyBmYWxzZTtcbiAgcHJpdmF0ZSBfZm9jdXNUcmFwQXV0b0NhcHR1cmVFbmFibGVkID0gdGhpcy5fZGVmYXVsdE9wdGlvbnMuZm9jdXNUcmFwQXV0b0NhcHR1cmVFbmFibGVkID8/IGZhbHNlO1xuICBwcml2YXRlIF9oYXNCYWNrZHJvcCA9IHRoaXMuX2RlZmF1bHRPcHRpb25zLmhhc0JhY2tkcm9wO1xuICBwcml2YXRlIF9lbGV2YXRpb24gPSB0aGlzLl9kZWZhdWx0T3B0aW9ucy5lbGV2YXRpb24gPz8gODtcblxuICBwcml2YXRlIF9wcmV2aW91c0VsZXZhdGlvbj86IHN0cmluZztcbiAgcHJpdmF0ZSBfZWxldmF0aW9uUHJlZml4ID0gJ21hdC1lbGV2YXRpb24teic7XG5cbiAgLyoqIENvbmZpZyBvYmplY3QgdG8gYmUgcGFzc2VkIGludG8gdGhlIHBvcG92ZXIncyBuZ0NsYXNzLiAqL1xuICBfY2xhc3NMaXN0OiB7IFtrZXk6IHN0cmluZ106IGJvb2xlYW4gfSA9IHt9O1xuXG4gIC8qKiBDdXJyZW50IHN0YXRlIG9mIHRoZSBwYW5lbCBhbmltYXRpb24uICovXG4gIF9wYW5lbEFuaW1hdGlvblN0YXRlOiAndm9pZCcgfCAnZW50ZXInID0gJ3ZvaWQnO1xuXG4gIC8qKiBFbWl0cyB3aGVuZXZlciBhbiBhbmltYXRpb24gb24gdGhlIHBvcG92ZXIgY29tcGxldGVzLiAqL1xuICByZWFkb25seSBfYW5pbWF0aW9uRG9uZSA9IG5ldyBTdWJqZWN0PEFuaW1hdGlvbkV2ZW50PigpO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBwb3BvdmVyIGlzIGFuaW1hdGluZy4gKi9cbiAgX2lzQW5pbWF0aW5nID0gZmFsc2U7XG5cbiAgLyoqIENsb3NpbmcgZGlzYWJsZWQgb24gcG9wb3ZlciAqL1xuICBjbG9zZURpc2FibGVkID0gZmFsc2U7XG5cbiAgLyoqIENvbmZpZyBvYmplY3QgdG8gYmUgcGFzc2VkIGludG8gdGhlIHBvcG92ZXIncyBhcnJvdyBuZ1N0eWxlICovXG4gIGFycm93U3R5bGVzPzogUmVjb3JkPHN0cmluZywgdW5rbm93bj47XG5cbiAgLyoqIExheW91dCBkaXJlY3Rpb24gb2YgdGhlIHBvcG92ZXIuICovXG4gIGRpcmVjdGlvbj86IERpcmVjdGlvbjtcblxuICAvKiogQ2xhc3Mgb3IgbGlzdCBvZiBjbGFzc2VzIHRvIGJlIGFkZGVkIHRvIHRoZSBvdmVybGF5IHBhbmVsLiAqL1xuICBvdmVybGF5UGFuZWxDbGFzczogc3RyaW5nIHwgc3RyaW5nW10gPSB0aGlzLl9kZWZhdWx0T3B0aW9ucy5vdmVybGF5UGFuZWxDbGFzcyB8fCAnJztcblxuICAvKiogQ2xhc3MgdG8gYmUgYWRkZWQgdG8gdGhlIGJhY2tkcm9wIGVsZW1lbnQuICovXG4gIEBJbnB1dCgpIGJhY2tkcm9wQ2xhc3MgPSB0aGlzLl9kZWZhdWx0T3B0aW9ucy5iYWNrZHJvcENsYXNzO1xuXG4gIC8qKiBhcmlhLWxhYmVsIGZvciB0aGUgcG9wb3ZlciBwYW5lbC4gKi9cbiAgQElucHV0KCdhcmlhLWxhYmVsJykgYXJpYUxhYmVsPzogc3RyaW5nO1xuXG4gIC8qKiBhcmlhLWxhYmVsbGVkYnkgZm9yIHRoZSBwb3BvdmVyIHBhbmVsLiAqL1xuICBASW5wdXQoJ2FyaWEtbGFiZWxsZWRieScpIGFyaWFMYWJlbGxlZGJ5Pzogc3RyaW5nO1xuXG4gIC8qKiBhcmlhLWRlc2NyaWJlZGJ5IGZvciB0aGUgcG9wb3ZlciBwYW5lbC4gKi9cbiAgQElucHV0KCdhcmlhLWRlc2NyaWJlZGJ5JykgYXJpYURlc2NyaWJlZGJ5Pzogc3RyaW5nO1xuXG4gIC8qKiBQb3BvdmVyJ3MgdHJpZ2dlciBldmVudC4gKi9cbiAgQElucHV0KClcbiAgZ2V0IHRyaWdnZXJFdmVudCgpOiBNdHhQb3BvdmVyVHJpZ2dlckV2ZW50IHtcbiAgICByZXR1cm4gdGhpcy5fdHJpZ2dlckV2ZW50O1xuICB9XG4gIHNldCB0cmlnZ2VyRXZlbnQodmFsdWU6IE10eFBvcG92ZXJUcmlnZ2VyRXZlbnQpIHtcbiAgICB0aGlzLl90cmlnZ2VyRXZlbnQgPSB2YWx1ZTtcbiAgfVxuXG4gIC8qKiBQb3BvdmVyJ3MgZW50ZXIgZGVsYXkuICovXG4gIEBJbnB1dCgpXG4gIGdldCBlbnRlckRlbGF5KCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMuX2VudGVyRGVsYXk7XG4gIH1cbiAgc2V0IGVudGVyRGVsYXkodmFsdWU6IG51bWJlcikge1xuICAgIHRoaXMuX2VudGVyRGVsYXkgPSB2YWx1ZTtcbiAgfVxuXG4gIC8qKiBQb3BvdmVyJ3MgbGVhdmUgZGVsYXkuICovXG4gIEBJbnB1dCgpXG4gIGdldCBsZWF2ZURlbGF5KCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMuX2xlYXZlRGVsYXk7XG4gIH1cbiAgc2V0IGxlYXZlRGVsYXkodmFsdWU6IG51bWJlcikge1xuICAgIHRoaXMuX2xlYXZlRGVsYXkgPSB2YWx1ZTtcbiAgfVxuXG4gIC8qKiBQb3BvdmVyJ3MgcG9zaXRpb24uICovXG4gIEBJbnB1dCgpXG4gIGdldCBwb3NpdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5fcG9zaXRpb247XG4gIH1cbiAgc2V0IHBvc2l0aW9uKHZhbHVlOiBNdHhQb3BvdmVyUG9zaXRpb24pIHtcbiAgICBpZiAoIVsnYmVmb3JlJywgJ2FmdGVyJywgJ2Fib3ZlJywgJ2JlbG93J10uaW5jbHVkZXModmFsdWVbMF0pKSB7XG4gICAgICB0aHJvd010eFBvcG92ZXJJbnZhbGlkUG9zaXRpb25TdGFydCgpO1xuICAgIH1cbiAgICBpZiAoIVsnYmVmb3JlJywgJ2FmdGVyJywgJ2Fib3ZlJywgJ2JlbG93JywgJ2NlbnRlciddLmluY2x1ZGVzKHZhbHVlWzFdKSkge1xuICAgICAgdGhyb3dNdHhQb3BvdmVySW52YWxpZFBvc2l0aW9uRW5kKCk7XG4gICAgfVxuICAgIHRoaXMuX3Bvc2l0aW9uID0gdmFsdWU7XG4gICAgdGhpcy5zZXRQb3NpdGlvbkNsYXNzZXMoKTtcbiAgfVxuXG4gIC8qKiBQb3BvdmVyLXBhbmVsJ3MgWCBvZmZzZXQuICovXG4gIEBJbnB1dCgpXG4gIGdldCB4T2Zmc2V0KCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMuX3BhbmVsT2Zmc2V0WDtcbiAgfVxuICBzZXQgeE9mZnNldCh2YWx1ZTogbnVtYmVyKSB7XG4gICAgdGhpcy5fcGFuZWxPZmZzZXRYID0gdmFsdWU7XG4gIH1cblxuICAvKiogUG9wb3Zlci1wYW5lbCdzIFkgb2Zmc2V0LiAqL1xuICBASW5wdXQoKVxuICBnZXQgeU9mZnNldCgpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLl9wYW5lbE9mZnNldFk7XG4gIH1cbiAgc2V0IHlPZmZzZXQodmFsdWU6IG51bWJlcikge1xuICAgIHRoaXMuX3BhbmVsT2Zmc2V0WSA9IHZhbHVlO1xuICB9XG5cbiAgLyoqIFBvcG92ZXItYXJyb3cncyB3aWR0aC4gKi9cbiAgQElucHV0KClcbiAgZ2V0IGFycm93V2lkdGgoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5fYXJyb3dXaWR0aDtcbiAgfVxuICBzZXQgYXJyb3dXaWR0aCh2YWx1ZTogbnVtYmVyKSB7XG4gICAgdGhpcy5fYXJyb3dXaWR0aCA9IHZhbHVlO1xuICB9XG5cbiAgLyoqIFBvcG92ZXItYXJyb3cncyBoZWlnaHQuICovXG4gIEBJbnB1dCgpXG4gIGdldCBhcnJvd0hlaWdodCgpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLl9hcnJvd0hlaWdodDtcbiAgfVxuICBzZXQgYXJyb3dIZWlnaHQodmFsdWU6IG51bWJlcikge1xuICAgIHRoaXMuX2Fycm93SGVpZ2h0ID0gdmFsdWU7XG4gIH1cblxuICAvKiogUG9wb3Zlci1hcnJvdydzIFggb2Zmc2V0LiAqL1xuICBASW5wdXQoKVxuICBnZXQgYXJyb3dPZmZzZXRYKCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMuX2Fycm93T2Zmc2V0WDtcbiAgfVxuICBzZXQgYXJyb3dPZmZzZXRYKHZhbHVlOiBudW1iZXIpIHtcbiAgICB0aGlzLl9hcnJvd09mZnNldFggPSB2YWx1ZTtcbiAgfVxuXG4gIC8qKiBQb3BvdmVyLWFycm93J3MgWSBvZmZzZXQuICovXG4gIEBJbnB1dCgpXG4gIGdldCBhcnJvd09mZnNldFkoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5fYXJyb3dPZmZzZXRZO1xuICB9XG4gIHNldCBhcnJvd09mZnNldFkodmFsdWU6IG51bWJlcikge1xuICAgIHRoaXMuX2Fycm93T2Zmc2V0WSA9IHZhbHVlO1xuICB9XG5cbiAgLyoqIFdoZXRoZXIgcG9wb3ZlciBjYW4gYmUgY2xvc2VkIHdoZW4gY2xpY2sgdGhlIHBvcG92ZXItcGFuZWwuICovXG4gIEBJbnB1dCgpXG4gIGdldCBjbG9zZU9uUGFuZWxDbGljaygpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fY2xvc2VPblBhbmVsQ2xpY2s7XG4gIH1cbiAgc2V0IGNsb3NlT25QYW5lbENsaWNrKHZhbHVlOiBib29sZWFuKSB7XG4gICAgdGhpcy5fY2xvc2VPblBhbmVsQ2xpY2sgPSBjb2VyY2VCb29sZWFuUHJvcGVydHkodmFsdWUpO1xuICB9XG5cbiAgLyoqIFdoZXRoZXIgcG9wb3ZlciBjYW4gYmUgY2xvc2VkIHdoZW4gY2xpY2sgdGhlIGJhY2tkcm9wLiAqL1xuICBASW5wdXQoKVxuICBnZXQgY2xvc2VPbkJhY2tkcm9wQ2xpY2soKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX2Nsb3NlT25CYWNrZHJvcENsaWNrO1xuICB9XG4gIHNldCBjbG9zZU9uQmFja2Ryb3BDbGljayh2YWx1ZTogYm9vbGVhbikge1xuICAgIHRoaXMuX2Nsb3NlT25CYWNrZHJvcENsaWNrID0gY29lcmNlQm9vbGVhblByb3BlcnR5KHZhbHVlKTtcbiAgfVxuXG4gIC8qKiBXaGV0aGVyIGVuYWJsZSBmb2N1cyB0cmFwIHVzaW5nIGBjZGtUcmFwRm9jdXNgLiAqL1xuICBASW5wdXQoKVxuICBnZXQgZm9jdXNUcmFwRW5hYmxlZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fZm9jdXNUcmFwRW5hYmxlZDtcbiAgfVxuICBzZXQgZm9jdXNUcmFwRW5hYmxlZCh2YWx1ZTogYm9vbGVhbikge1xuICAgIHRoaXMuX2ZvY3VzVHJhcEVuYWJsZWQgPSBjb2VyY2VCb29sZWFuUHJvcGVydHkodmFsdWUpO1xuICB9XG5cbiAgLyoqIFdoZXRoZXIgZW5hYmxlIGZvY3VzIHRyYXAgYXV0byBjYXB0dXJlIHVzaW5nIGBjZGtUcmFwRm9jdXNBdXRvQ2FwdHVyZWAuICovXG4gIEBJbnB1dCgpXG4gIGdldCBmb2N1c1RyYXBBdXRvQ2FwdHVyZUVuYWJsZWQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX2ZvY3VzVHJhcEF1dG9DYXB0dXJlRW5hYmxlZDtcbiAgfVxuICBzZXQgZm9jdXNUcmFwQXV0b0NhcHR1cmVFbmFibGVkKHZhbHVlOiBib29sZWFuKSB7XG4gICAgdGhpcy5fZm9jdXNUcmFwQXV0b0NhcHR1cmVFbmFibGVkID0gY29lcmNlQm9vbGVhblByb3BlcnR5KHZhbHVlKTtcbiAgfVxuXG4gIC8qKiBXaGV0aGVyIHRoZSBwb3BvdmVyIGhhcyBhIGJhY2tkcm9wLiBJdCB3aWxsIGFsd2F5cyBiZSBmYWxzZSBpZiB0aGUgdHJpZ2dlciBldmVudCBpcyBob3Zlci4gKi9cbiAgQElucHV0KClcbiAgZ2V0IGhhc0JhY2tkcm9wKCk6IGJvb2xlYW4gfCB1bmRlZmluZWQge1xuICAgIHJldHVybiB0aGlzLl9oYXNCYWNrZHJvcDtcbiAgfVxuICBzZXQgaGFzQmFja2Ryb3AodmFsdWU6IGJvb2xlYW4gfCB1bmRlZmluZWQpIHtcbiAgICB0aGlzLl9oYXNCYWNrZHJvcCA9IGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSh2YWx1ZSk7XG4gIH1cblxuICAvKiogUG9wb3Zlci1wYW5lbCdzIGVsZXZhdGlvbiAoMH4yNCkuICovXG4gIEBJbnB1dCgpXG4gIGdldCBlbGV2YXRpb24oKTogbnVtYmVyIHtcbiAgICByZXR1cm4gTWF0aC5tYXgoMCwgTWF0aC5taW4oTWF0aC5yb3VuZCh0aGlzLl9lbGV2YXRpb24pLCAyNCkpO1xuICB9XG4gIHNldCBlbGV2YXRpb24odmFsdWU6IG51bWJlcikge1xuICAgIHRoaXMuX2VsZXZhdGlvbiA9IHZhbHVlO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoaXMgbWV0aG9kIHRha2VzIGNsYXNzZXMgc2V0IG9uIHRoZSBob3N0IG1kLXBvcG92ZXIgZWxlbWVudCBhbmQgYXBwbGllcyB0aGVtIG9uIHRoZVxuICAgKiBwb3BvdmVyIHRlbXBsYXRlIHRoYXQgZGlzcGxheXMgaW4gdGhlIG92ZXJsYXkgY29udGFpbmVyLiBPdGhlcndpc2UsIGl0J3MgZGlmZmljdWx0XG4gICAqIHRvIHN0eWxlIHRoZSBjb250YWluaW5nIHBvcG92ZXIgZnJvbSBvdXRzaWRlIHRoZSBjb21wb25lbnQuXG4gICAqIEBwYXJhbSBjbGFzc2VzIGxpc3Qgb2YgY2xhc3MgbmFtZXNcbiAgICovXG4gIEBJbnB1dCgnY2xhc3MnKVxuICBzZXQgcGFuZWxDbGFzcyhjbGFzc2VzOiBzdHJpbmcpIHtcbiAgICBpZiAoY2xhc3NlcyAmJiBjbGFzc2VzLmxlbmd0aCkge1xuICAgICAgdGhpcy5fY2xhc3NMaXN0ID0gY2xhc3Nlcy5zcGxpdCgnICcpLnJlZHVjZSgob2JqOiBhbnksIGNsYXNzTmFtZTogc3RyaW5nKSA9PiB7XG4gICAgICAgIG9ialtjbGFzc05hbWVdID0gdHJ1ZTtcbiAgICAgICAgcmV0dXJuIG9iajtcbiAgICAgIH0sIHt9KTtcblxuICAgICAgdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmNsYXNzTmFtZSA9ICcnO1xuICAgICAgdGhpcy5zZXRQb3NpdGlvbkNsYXNzZXMoKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogVGhpcyBtZXRob2QgdGFrZXMgY2xhc3NlcyBzZXQgb24gdGhlIGhvc3QgbWQtcG9wb3ZlciBlbGVtZW50IGFuZCBhcHBsaWVzIHRoZW0gb24gdGhlXG4gICAqIHBvcG92ZXIgdGVtcGxhdGUgdGhhdCBkaXNwbGF5cyBpbiB0aGUgb3ZlcmxheSBjb250YWluZXIuIE90aGVyd2lzZSwgaXQncyBkaWZmaWN1bHRcbiAgICogdG8gc3R5bGUgdGhlIGNvbnRhaW5pbmcgcG9wb3ZlciBmcm9tIG91dHNpZGUgdGhlIGNvbXBvbmVudC5cbiAgICogQGRlcHJlY2F0ZWQgVXNlIGBwYW5lbENsYXNzYCBpbnN0ZWFkLlxuICAgKiBAYnJlYWtpbmctY2hhbmdlIDguMC4wXG4gICAqL1xuICBASW5wdXQoKVxuICBnZXQgY2xhc3NMaXN0KCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMucGFuZWxDbGFzcztcbiAgfVxuICBzZXQgY2xhc3NMaXN0KGNsYXNzZXM6IHN0cmluZykge1xuICAgIHRoaXMucGFuZWxDbGFzcyA9IGNsYXNzZXM7XG4gIH1cblxuICAvKiogRXZlbnQgZW1pdHRlZCB3aGVuIHRoZSBwb3BvdmVyIGlzIGNsb3NlZC4gKi9cbiAgQE91dHB1dCgpIGNsb3NlZCA9IG5ldyBFdmVudEVtaXR0ZXI8UG9wb3ZlckNsb3NlUmVhc29uPigpO1xuXG4gIC8qKiBAZG9jcy1wcml2YXRlICovXG4gIEBWaWV3Q2hpbGQoVGVtcGxhdGVSZWYpIHRlbXBsYXRlUmVmITogVGVtcGxhdGVSZWY8YW55PjtcblxuICAvKipcbiAgICogUG9wb3ZlciBjb250ZW50IHRoYXQgd2lsbCBiZSByZW5kZXJlZCBsYXppbHkuXG4gICAqIEBkb2NzLXByaXZhdGVcbiAgICovXG4gIEBDb250ZW50Q2hpbGQoTVRYX1BPUE9WRVJfQ09OVEVOVCkgbGF6eUNvbnRlbnQ/OiBNdHhQb3BvdmVyQ29udGVudDtcblxuICByZWFkb25seSBwYW5lbElkID0gYG10eC1wb3BvdmVyLXBhbmVsLSR7cG9wb3ZlclBhbmVsVWlkKyt9YDtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIF9lbGVtZW50UmVmOiBFbGVtZW50UmVmLFxuICAgIHByaXZhdGUgX25nWm9uZTogTmdab25lLFxuICAgIEBJbmplY3QoTVRYX1BPUE9WRVJfREVGQVVMVF9PUFRJT05TKSBwcml2YXRlIF9kZWZhdWx0T3B0aW9uczogTXR4UG9wb3ZlckRlZmF1bHRPcHRpb25zXG4gICkge31cblxuICBuZ09uSW5pdCgpIHtcbiAgICB0aGlzLnNldFBvc2l0aW9uQ2xhc3NlcygpO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgdGhpcy5jbG9zZWQuY29tcGxldGUoKTtcbiAgfVxuXG4gIC8qKiBIYW5kbGUgYSBrZXlib2FyZCBldmVudCBmcm9tIHRoZSBwb3BvdmVyLCBkZWxlZ2F0aW5nIHRvIHRoZSBhcHByb3ByaWF0ZSBhY3Rpb24uICovXG4gIF9oYW5kbGVLZXlkb3duKGV2ZW50OiBLZXlib2FyZEV2ZW50KSB7XG4gICAgY29uc3Qga2V5Q29kZSA9IGV2ZW50LmtleUNvZGU7XG5cbiAgICBzd2l0Y2ggKGtleUNvZGUpIHtcbiAgICAgIGNhc2UgRVNDQVBFOlxuICAgICAgICBpZiAoIWhhc01vZGlmaWVyS2V5KGV2ZW50KSkge1xuICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgdGhpcy5jbG9zZWQuZW1pdCgna2V5ZG93bicpO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBDbG9zZSBwb3BvdmVyIG9uIGNsaWNrIGlmIGBjbG9zZU9uUGFuZWxDbGlja2AgaXMgdHJ1ZS4gKi9cbiAgX2hhbmRsZUNsaWNrKCkge1xuICAgIGlmICh0aGlzLmNsb3NlT25QYW5lbENsaWNrKSB7XG4gICAgICB0aGlzLmNsb3NlZC5lbWl0KCdjbGljaycpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBEaXNhYmxlcyBjbG9zZSBvZiBwb3BvdmVyIHdoZW4gbGVhdmluZyB0cmlnZ2VyIGVsZW1lbnQgYW5kIG1vdXNlIG92ZXIgdGhlIHBvcG92ZXIuICovXG4gIF9oYW5kbGVNb3VzZU92ZXIoKSB7XG4gICAgaWYgKHRoaXMudHJpZ2dlckV2ZW50ID09PSAnaG92ZXInKSB7XG4gICAgICB0aGlzLmNsb3NlRGlzYWJsZWQgPSB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBFbmFibGVzIGNsb3NlIG9mIHBvcG92ZXIgd2hlbiBtb3VzZSBsZWF2aW5nIHBvcG92ZXIgZWxlbWVudC4gKi9cbiAgX2hhbmRsZU1vdXNlTGVhdmUoKSB7XG4gICAgaWYgKHRoaXMudHJpZ2dlckV2ZW50ID09PSAnaG92ZXInKSB7XG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgdGhpcy5jbG9zZURpc2FibGVkID0gZmFsc2U7XG4gICAgICAgIHRoaXMuY2xvc2VkLmVtaXQoKTtcbiAgICAgIH0sIHRoaXMubGVhdmVEZWxheSk7XG4gICAgfVxuICB9XG5cbiAgLyoqIFNldHMgdGhlIGN1cnJlbnQgc3R5bGVzIGZvciB0aGUgcG9wb3ZlciB0byBhbGxvdyBmb3IgZHluYW1pY2FsbHkgY2hhbmdpbmcgc2V0dGluZ3MuICovXG4gIHNldEN1cnJlbnRTdHlsZXMocG9zID0gdGhpcy5wb3NpdGlvbikge1xuICAgIGNvbnN0IGxlZnQgPVxuICAgICAgcG9zWzFdID09PSAnYWZ0ZXInXG4gICAgICAgID8gYCR7dGhpcy5hcnJvd09mZnNldFggLSB0aGlzLmFycm93V2lkdGggLyAyfXB4YFxuICAgICAgICA6IHBvc1sxXSA9PT0gJ2NlbnRlcidcbiAgICAgICAgPyBgY2FsYyg1MCUgLSAke3RoaXMuYXJyb3dXaWR0aCAvIDJ9cHgpYFxuICAgICAgICA6ICcnO1xuICAgIGNvbnN0IHJpZ2h0ID0gcG9zWzFdID09PSAnYmVmb3JlJyA/IGAke3RoaXMuYXJyb3dPZmZzZXRYIC0gdGhpcy5hcnJvd1dpZHRoIC8gMn1weGAgOiAnJztcblxuICAgIGNvbnN0IGJvdHRvbSA9XG4gICAgICBwb3NbMV0gPT09ICdhYm92ZSdcbiAgICAgICAgPyBgJHt0aGlzLmFycm93T2Zmc2V0WSAtIHRoaXMuYXJyb3dIZWlnaHQgLyAyfXB4YFxuICAgICAgICA6IHBvc1sxXSA9PT0gJ2NlbnRlcidcbiAgICAgICAgPyBgY2FsYyg1MCUgLSAke3RoaXMuYXJyb3dIZWlnaHQgLyAyfXB4KWBcbiAgICAgICAgOiAnJztcbiAgICBjb25zdCB0b3AgPSBwb3NbMV0gPT09ICdiZWxvdycgPyBgJHt0aGlzLmFycm93T2Zmc2V0WSAtIHRoaXMuYXJyb3dIZWlnaHQgLyAyfXB4YCA6ICcnO1xuXG4gICAgdGhpcy5hcnJvd1N0eWxlcyA9XG4gICAgICBwb3NbMF0gPT09ICdhYm92ZScgfHwgcG9zWzBdID09PSAnYmVsb3cnXG4gICAgICAgID8ge1xuICAgICAgICAgICAgbGVmdDogdGhpcy5kaXJlY3Rpb24gPT09ICdsdHInID8gbGVmdCA6IHJpZ2h0LFxuICAgICAgICAgICAgcmlnaHQ6IHRoaXMuZGlyZWN0aW9uID09PSAnbHRyJyA/IHJpZ2h0IDogbGVmdCxcbiAgICAgICAgICB9XG4gICAgICAgIDogeyB0b3AsIGJvdHRvbSB9O1xuICB9XG5cbiAgLyoqXG4gICAqIEl0J3MgbmVjZXNzYXJ5IHRvIHNldCBwb3NpdGlvbi1iYXNlZCBjbGFzc2VzIHRvIGVuc3VyZSB0aGUgcG9wb3ZlciBwYW5lbCBhbmltYXRpb25cbiAgICogZm9sZHMgb3V0IGZyb20gdGhlIGNvcnJlY3QgZGlyZWN0aW9uLlxuICAgKi9cbiAgc2V0UG9zaXRpb25DbGFzc2VzKHBvcyA9IHRoaXMucG9zaXRpb24pOiB2b2lkIHtcbiAgICB0aGlzLl9jbGFzc0xpc3RbJ210eC1wb3BvdmVyLWJlZm9yZS1hYm92ZSddID0gcG9zWzBdID09PSAnYmVmb3JlJyAmJiBwb3NbMV0gPT09ICdhYm92ZSc7XG4gICAgdGhpcy5fY2xhc3NMaXN0WydtdHgtcG9wb3Zlci1iZWZvcmUtY2VudGVyJ10gPSBwb3NbMF0gPT09ICdiZWZvcmUnICYmIHBvc1sxXSA9PT0gJ2NlbnRlcic7XG4gICAgdGhpcy5fY2xhc3NMaXN0WydtdHgtcG9wb3Zlci1iZWZvcmUtYmVsb3cnXSA9IHBvc1swXSA9PT0gJ2JlZm9yZScgJiYgcG9zWzFdID09PSAnYmVsb3cnO1xuICAgIHRoaXMuX2NsYXNzTGlzdFsnbXR4LXBvcG92ZXItYWZ0ZXItYWJvdmUnXSA9IHBvc1swXSA9PT0gJ2FmdGVyJyAmJiBwb3NbMV0gPT09ICdhYm92ZSc7XG4gICAgdGhpcy5fY2xhc3NMaXN0WydtdHgtcG9wb3Zlci1hZnRlci1jZW50ZXInXSA9IHBvc1swXSA9PT0gJ2FmdGVyJyAmJiBwb3NbMV0gPT09ICdjZW50ZXInO1xuICAgIHRoaXMuX2NsYXNzTGlzdFsnbXR4LXBvcG92ZXItYWZ0ZXItYmVsb3cnXSA9IHBvc1swXSA9PT0gJ2FmdGVyJyAmJiBwb3NbMV0gPT09ICdiZWxvdyc7XG4gICAgdGhpcy5fY2xhc3NMaXN0WydtdHgtcG9wb3Zlci1hYm92ZS1iZWZvcmUnXSA9IHBvc1swXSA9PT0gJ2Fib3ZlJyAmJiBwb3NbMV0gPT09ICdiZWZvcmUnO1xuICAgIHRoaXMuX2NsYXNzTGlzdFsnbXR4LXBvcG92ZXItYWJvdmUtY2VudGVyJ10gPSBwb3NbMF0gPT09ICdhYm92ZScgJiYgcG9zWzFdID09PSAnY2VudGVyJztcbiAgICB0aGlzLl9jbGFzc0xpc3RbJ210eC1wb3BvdmVyLWFib3ZlLWFmdGVyJ10gPSBwb3NbMF0gPT09ICdhYm92ZScgJiYgcG9zWzFdID09PSAnYWZ0ZXInO1xuICAgIHRoaXMuX2NsYXNzTGlzdFsnbXR4LXBvcG92ZXItYmVsb3ctYmVmb3JlJ10gPSBwb3NbMF0gPT09ICdiZWxvdycgJiYgcG9zWzFdID09PSAnYmVmb3JlJztcbiAgICB0aGlzLl9jbGFzc0xpc3RbJ210eC1wb3BvdmVyLWJlbG93LWNlbnRlciddID0gcG9zWzBdID09PSAnYmVsb3cnICYmIHBvc1sxXSA9PT0gJ2NlbnRlcic7XG4gICAgdGhpcy5fY2xhc3NMaXN0WydtdHgtcG9wb3Zlci1iZWxvdy1hZnRlciddID0gcG9zWzBdID09PSAnYmVsb3cnICYmIHBvc1sxXSA9PT0gJ2FmdGVyJztcbiAgfVxuXG4gIC8qKiBTZXRzIHRoZSBwb3BvdmVyLXBhbmVsJ3MgZWxldmF0aW9uLiAqL1xuICBzZXRFbGV2YXRpb24oKTogdm9pZCB7XG4gICAgY29uc3QgbmV3RWxldmF0aW9uID0gYCR7dGhpcy5fZWxldmF0aW9uUHJlZml4fSR7dGhpcy5lbGV2YXRpb259YDtcblxuICAgIGlmICh0aGlzLl9wcmV2aW91c0VsZXZhdGlvbikge1xuICAgICAgdGhpcy5fY2xhc3NMaXN0W3RoaXMuX3ByZXZpb3VzRWxldmF0aW9uXSA9IGZhbHNlO1xuICAgIH1cblxuICAgIHRoaXMuX2NsYXNzTGlzdFtuZXdFbGV2YXRpb25dID0gdHJ1ZTtcbiAgICB0aGlzLl9wcmV2aW91c0VsZXZhdGlvbiA9IG5ld0VsZXZhdGlvbjtcbiAgfVxuXG4gIC8qKiBTdGFydHMgdGhlIGVudGVyIGFuaW1hdGlvbi4gKi9cbiAgX3N0YXJ0QW5pbWF0aW9uKCkge1xuICAgIC8vIEBicmVha2luZy1jaGFuZ2UgOC4wLjAgQ29tYmluZSB3aXRoIF9yZXNldEFuaW1hdGlvbi5cbiAgICB0aGlzLl9wYW5lbEFuaW1hdGlvblN0YXRlID0gJ2VudGVyJztcbiAgfVxuXG4gIC8qKiBSZXNldHMgdGhlIHBhbmVsIGFuaW1hdGlvbiB0byBpdHMgaW5pdGlhbCBzdGF0ZS4gKi9cbiAgX3Jlc2V0QW5pbWF0aW9uKCkge1xuICAgIC8vIEBicmVha2luZy1jaGFuZ2UgOC4wLjAgQ29tYmluZSB3aXRoIF9zdGFydEFuaW1hdGlvbi5cbiAgICB0aGlzLl9wYW5lbEFuaW1hdGlvblN0YXRlID0gJ3ZvaWQnO1xuICB9XG5cbiAgLyoqIENhbGxiYWNrIHRoYXQgaXMgaW52b2tlZCB3aGVuIHRoZSBwYW5lbCBhbmltYXRpb24gY29tcGxldGVzLiAqL1xuICBfb25BbmltYXRpb25Eb25lKGV2ZW50OiBBbmltYXRpb25FdmVudCkge1xuICAgIHRoaXMuX2FuaW1hdGlvbkRvbmUubmV4dChldmVudCk7XG4gICAgdGhpcy5faXNBbmltYXRpbmcgPSBmYWxzZTtcbiAgfVxuXG4gIF9vbkFuaW1hdGlvblN0YXJ0KGV2ZW50OiBBbmltYXRpb25FdmVudCkge1xuICAgIHRoaXMuX2lzQW5pbWF0aW5nID0gdHJ1ZTtcbiAgfVxuXG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9jbG9zZU9uUGFuZWxDbGljazogQm9vbGVhbklucHV0O1xuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfY2xvc2VPbkJhY2tkcm9wQ2xpY2s6IEJvb2xlYW5JbnB1dDtcbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX2ZvY3VzVHJhcEVuYWJsZWQ6IEJvb2xlYW5JbnB1dDtcbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX2ZvY3VzVHJhcEF1dG9DYXB0dXJlRW5hYmxlZDogQm9vbGVhbklucHV0O1xuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfaGFzQmFja2Ryb3A6IEJvb2xlYW5JbnB1dDtcbn1cbiIsIjxuZy10ZW1wbGF0ZT5cclxuICA8ZGl2IGNsYXNzPVwibXR4LXBvcG92ZXItcGFuZWxcIlxyXG4gICAgICAgW2lkXT1cInBhbmVsSWRcIlxyXG4gICAgICAgW25nQ2xhc3NdPVwiX2NsYXNzTGlzdFwiXHJcbiAgICAgICAoa2V5ZG93bik9XCJfaGFuZGxlS2V5ZG93bigkZXZlbnQpXCJcclxuICAgICAgIChjbGljayk9XCJfaGFuZGxlQ2xpY2soKVwiXHJcbiAgICAgICAobW91c2VvdmVyKT1cIl9oYW5kbGVNb3VzZU92ZXIoKVwiXHJcbiAgICAgICAobW91c2VsZWF2ZSk9XCJfaGFuZGxlTW91c2VMZWF2ZSgpXCJcclxuICAgICAgIFtAdHJhbnNmb3JtUG9wb3Zlcl09XCJfcGFuZWxBbmltYXRpb25TdGF0ZVwiXHJcbiAgICAgICAoQHRyYW5zZm9ybVBvcG92ZXIuc3RhcnQpPVwiX29uQW5pbWF0aW9uU3RhcnQoJGV2ZW50KVwiXHJcbiAgICAgICAoQHRyYW5zZm9ybVBvcG92ZXIuZG9uZSk9XCJfb25BbmltYXRpb25Eb25lKCRldmVudClcIlxyXG4gICAgICAgdGFiaW5kZXg9XCItMVwiXHJcbiAgICAgICByb2xlPVwiZGlhbG9nXCJcclxuICAgICAgIFthdHRyLmFyaWEtbGFiZWxdPVwiYXJpYUxhYmVsIHx8IG51bGxcIlxyXG4gICAgICAgW2F0dHIuYXJpYS1sYWJlbGxlZGJ5XT1cImFyaWFMYWJlbGxlZGJ5IHx8IG51bGxcIlxyXG4gICAgICAgW2F0dHIuYXJpYS1kZXNjcmliZWRieV09XCJhcmlhRGVzY3JpYmVkYnkgfHwgbnVsbFwiXHJcbiAgICAgICBbY2RrVHJhcEZvY3VzXT1cImZvY3VzVHJhcEVuYWJsZWRcIlxyXG4gICAgICAgW2Nka1RyYXBGb2N1c0F1dG9DYXB0dXJlXT1cImZvY3VzVHJhcEF1dG9DYXB0dXJlRW5hYmxlZFwiPlxyXG4gICAgPGRpdiBjbGFzcz1cIm10eC1wb3BvdmVyLWNvbnRlbnRcIj5cclxuICAgICAgPG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PlxyXG4gICAgPC9kaXY+XHJcbiAgICA8ZGl2IGNsYXNzPVwibXR4LXBvcG92ZXItZGlyZWN0aW9uLWFycm93XCIgW25nU3R5bGVdPVwiYXJyb3dTdHlsZXNcIj48L2Rpdj5cclxuICA8L2Rpdj5cclxuPC9uZy10ZW1wbGF0ZT5cclxuIl19