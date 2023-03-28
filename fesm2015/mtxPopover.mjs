import * as i0 from '@angular/core';
import { InjectionToken, Directive, Inject, EventEmitter, TemplateRef, Component, ChangeDetectionStrategy, ViewEncapsulation, Input, Output, ViewChild, ContentChild, Optional, NgModule } from '@angular/core';
import * as i1 from '@angular/common';
import { DOCUMENT, CommonModule } from '@angular/common';
import * as i1$1 from '@angular/cdk/overlay';
import { Overlay, OverlayConfig, OverlayModule } from '@angular/cdk/overlay';
import * as i3 from '@angular/cdk/a11y';
import { isFakeMousedownFromScreenReader, A11yModule } from '@angular/cdk/a11y';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { ESCAPE, hasModifierKey, ENTER, SPACE } from '@angular/cdk/keycodes';
import { Subject, Subscription, of, merge } from 'rxjs';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { TemplatePortal, DomPortalOutlet } from '@angular/cdk/portal';
import { filter, take, takeUntil } from 'rxjs/operators';
import * as i2 from '@angular/cdk/bidi';

/**
 * Below are all the animations for the mtx-popover component.
 * Animation duration and timing values are based on AngularJS Material.
 */
/**
 * This animation controls the popover panel's entry and exit from the page.
 *
 * When the popover panel is added to the DOM, it scales in and fades in its border.
 *
 * When the popover panel is removed from the DOM, it simply fades out after a brief
 * delay to display the ripple.
 */
const transformPopover = trigger('transformPopover', [
    state('void', style({
        opacity: 0,
        transform: 'scale(0.8)',
    })),
    transition('void => enter', animate('120ms cubic-bezier(0, 0, 0.2, 1)', style({
        opacity: 1,
        transform: 'scale(1)',
    }))),
    transition('* => void', animate('100ms 25ms linear', style({ opacity: 0 }))),
]);

/**
 * Injection token that can be used to reference instances of `MtxPopoverContent`. It serves
 * as alternative token to the actual `MtxPopoverContent` class which could cause unnecessary
 * retention of the class and its directive metadata.
 */
const MTX_POPOVER_CONTENT = new InjectionToken('MtxPopoverContent');
class _MtxPopoverContentBase {
    constructor(_template, _componentFactoryResolver, _appRef, _injector, _viewContainerRef, _document, _changeDetectorRef) {
        this._template = _template;
        this._componentFactoryResolver = _componentFactoryResolver;
        this._appRef = _appRef;
        this._injector = _injector;
        this._viewContainerRef = _viewContainerRef;
        this._document = _document;
        this._changeDetectorRef = _changeDetectorRef;
        /** Emits when the popover content has been attached. */
        this._attached = new Subject();
    }
    /**
     * Attaches the content with a particular context.
     * @docs-private
     */
    attach(context = {}) {
        if (!this._portal) {
            this._portal = new TemplatePortal(this._template, this._viewContainerRef);
        }
        this.detach();
        if (!this._outlet) {
            this._outlet = new DomPortalOutlet(this._document.createElement('div'), this._componentFactoryResolver, this._appRef, this._injector);
        }
        const element = this._template.elementRef.nativeElement;
        // Because we support opening the same popover from different triggers (which in turn have their
        // own `OverlayRef` panel), we have to re-insert the host element every time, otherwise we
        // risk it staying attached to a pane that's no longer in the DOM.
        element.parentNode.insertBefore(this._outlet.outletElement, element);
        // When `MtxPopoverContent` is used in an `OnPush` component, the insertion of the popover
        // content via `createEmbeddedView` does not cause the content to be seen as "dirty"
        // by Angular. This causes the `@ContentChildren` for popover items within the popover to
        // not be updated by Angular. By explicitly marking for check here, we tell Angular that
        // it needs to check for new popover items and update the `@ContentChild` in `MtxPopover`.
        // @breaking-change 9.0.0 Make change detector ref required
        if (this._changeDetectorRef) {
            this._changeDetectorRef.markForCheck();
        }
        this._portal.attach(this._outlet, context);
        this._attached.next();
    }
    /**
     * Detaches the content.
     * @docs-private
     */
    detach() {
        if (this._portal.isAttached) {
            this._portal.detach();
        }
    }
    ngOnDestroy() {
        if (this._outlet) {
            this._outlet.dispose();
        }
    }
}
/** @nocollapse */ _MtxPopoverContentBase.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: _MtxPopoverContentBase, deps: [{ token: i0.TemplateRef }, { token: i0.ComponentFactoryResolver }, { token: i0.ApplicationRef }, { token: i0.Injector }, { token: i0.ViewContainerRef }, { token: DOCUMENT }, { token: i0.ChangeDetectorRef }], target: i0.ɵɵFactoryTarget.Directive });
/** @nocollapse */ _MtxPopoverContentBase.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.2.1", type: _MtxPopoverContentBase, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: _MtxPopoverContentBase, decorators: [{
            type: Directive
        }], ctorParameters: function () {
        return [{ type: i0.TemplateRef }, { type: i0.ComponentFactoryResolver }, { type: i0.ApplicationRef }, { type: i0.Injector }, { type: i0.ViewContainerRef }, { type: undefined, decorators: [{
                        type: Inject,
                        args: [DOCUMENT]
                    }] }, { type: i0.ChangeDetectorRef }];
    } });
/**
 * Popover content that will be rendered lazily once the popover is opened.
 */
class MtxPopoverContent extends _MtxPopoverContentBase {
}
/** @nocollapse */ MtxPopoverContent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MtxPopoverContent, deps: null, target: i0.ɵɵFactoryTarget.Directive });
/** @nocollapse */ MtxPopoverContent.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.2.1", type: MtxPopoverContent, selector: "ng-template[mtxPopoverContent]", providers: [{ provide: MTX_POPOVER_CONTENT, useExisting: MtxPopoverContent }], usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MtxPopoverContent, decorators: [{
            type: Directive,
            args: [{
                    selector: 'ng-template[mtxPopoverContent]',
                    providers: [{ provide: MTX_POPOVER_CONTENT, useExisting: MtxPopoverContent }],
                }]
        }] });

/**
 * Throws an exception for the case when popover trigger doesn't have a valid mtx-popover instance
 */
function throwMtxPopoverMissingError() {
    throw Error(`mtx-popover-trigger: must pass in an mtx-popover instance.

    Example:
      <mtx-popover #popover="mtxPopover"></mtx-popover>
      <button [mtxPopoverTriggerFor]="popover"></button>`);
}
/**
 * Throws an exception for the case when popover's mtxPopoverPosition[0] value isn't valid.
 * In other words, it doesn't match 'above', 'below', 'before' or 'after'.
 */
function throwMtxPopoverInvalidPositionStart() {
    throw Error(`mtxPopoverPosition[0] value must be either 'above', 'below', 'before' or 'after'.
    Example: <mtx-popover [position]="['below', 'after']" #popover="mtxPopover"></mtx-popover>`);
}
/**
 * Throws an exception for the case when popover's mtxPopoverPosition[1] value isn't valid.
 * In other words, it doesn't match 'above', 'below', 'before', 'after' or 'center'.
 */
function throwMtxPopoverInvalidPositionEnd() {
    throw Error(`mtxPopoverPosition[1] value must be either 'above', 'below', 'before', 'after' or 'center'.
    Example: <mtx-popover [position]="['below', 'after']" #popover="mtxPopover"></mtx-popover>`);
}

/** Injection token to be used to override the default options for `mtx-popover`. */
const MTX_POPOVER_DEFAULT_OPTIONS = new InjectionToken('mtx-popover-default-options', {
    providedIn: 'root',
    factory: MTX_POPOVER_DEFAULT_OPTIONS_FACTORY,
});
/** @docs-private */
function MTX_POPOVER_DEFAULT_OPTIONS_FACTORY() {
    return {
        backdropClass: 'cdk-overlay-transparent-backdrop',
    };
}
let popoverPanelUid = 0;
class MtxPopover {
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
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
        this._elementRef = _elementRef;
        this._ngZone = _ngZone;
        this._defaultOptions = _defaultOptions;
        this._triggerEvent = (_a = this._defaultOptions.triggerEvent) !== null && _a !== void 0 ? _a : 'hover';
        this._enterDelay = (_b = this._defaultOptions.enterDelay) !== null && _b !== void 0 ? _b : 100;
        this._leaveDelay = (_c = this._defaultOptions.leaveDelay) !== null && _c !== void 0 ? _c : 100;
        this._position = (_d = this._defaultOptions.position) !== null && _d !== void 0 ? _d : ['below', 'after'];
        this._panelOffsetX = (_e = this._defaultOptions.xOffset) !== null && _e !== void 0 ? _e : 0;
        this._panelOffsetY = (_f = this._defaultOptions.yOffset) !== null && _f !== void 0 ? _f : 0;
        this._arrowWidth = (_g = this._defaultOptions.arrowWidth) !== null && _g !== void 0 ? _g : 16;
        this._arrowHeight = (_h = this._defaultOptions.arrowHeight) !== null && _h !== void 0 ? _h : 16;
        this._arrowOffsetX = (_j = this._defaultOptions.arrowOffsetX) !== null && _j !== void 0 ? _j : 20;
        this._arrowOffsetY = (_k = this._defaultOptions.arrowOffsetY) !== null && _k !== void 0 ? _k : 20;
        this._closeOnPanelClick = (_l = this._defaultOptions.closeOnPanelClick) !== null && _l !== void 0 ? _l : false;
        this._closeOnBackdropClick = (_m = this._defaultOptions.closeOnBackdropClick) !== null && _m !== void 0 ? _m : true;
        this._focusTrapEnabled = (_o = this._defaultOptions.focusTrapEnabled) !== null && _o !== void 0 ? _o : false;
        this._focusTrapAutoCaptureEnabled = (_p = this._defaultOptions.focusTrapAutoCaptureEnabled) !== null && _p !== void 0 ? _p : false;
        this._hasBackdrop = this._defaultOptions.hasBackdrop;
        this._elevation = (_q = this._defaultOptions.elevation) !== null && _q !== void 0 ? _q : 8;
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
/** @nocollapse */ MtxPopover.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.1", type: MtxPopover, selector: "mtx-popover", inputs: { backdropClass: "backdropClass", ariaLabel: ["aria-label", "ariaLabel"], ariaLabelledby: ["aria-labelledby", "ariaLabelledby"], ariaDescribedby: ["aria-describedby", "ariaDescribedby"], triggerEvent: "triggerEvent", enterDelay: "enterDelay", leaveDelay: "leaveDelay", position: "position", xOffset: "xOffset", yOffset: "yOffset", arrowWidth: "arrowWidth", arrowHeight: "arrowHeight", arrowOffsetX: "arrowOffsetX", arrowOffsetY: "arrowOffsetY", closeOnPanelClick: "closeOnPanelClick", closeOnBackdropClick: "closeOnBackdropClick", focusTrapEnabled: "focusTrapEnabled", focusTrapAutoCaptureEnabled: "focusTrapAutoCaptureEnabled", hasBackdrop: "hasBackdrop", elevation: "elevation", panelClass: ["class", "panelClass"], classList: "classList" }, outputs: { closed: "closed" }, queries: [{ propertyName: "lazyContent", first: true, predicate: MTX_POPOVER_CONTENT, descendants: true }], viewQueries: [{ propertyName: "templateRef", first: true, predicate: TemplateRef, descendants: true }], exportAs: ["mtxPopover"], ngImport: i0, template: "<ng-template>\r\n  <div class=\"mtx-popover-panel\"\r\n       [id]=\"panelId\"\r\n       [ngClass]=\"_classList\"\r\n       (keydown)=\"_handleKeydown($event)\"\r\n       (click)=\"_handleClick()\"\r\n       (mouseover)=\"_handleMouseOver()\"\r\n       (mouseleave)=\"_handleMouseLeave()\"\r\n       [@transformPopover]=\"_panelAnimationState\"\r\n       (@transformPopover.start)=\"_onAnimationStart($event)\"\r\n       (@transformPopover.done)=\"_onAnimationDone($event)\"\r\n       tabindex=\"-1\"\r\n       role=\"dialog\"\r\n       [attr.aria-label]=\"ariaLabel || null\"\r\n       [attr.aria-labelledby]=\"ariaLabelledby || null\"\r\n       [attr.aria-describedby]=\"ariaDescribedby || null\"\r\n       [cdkTrapFocus]=\"focusTrapEnabled\"\r\n       [cdkTrapFocusAutoCapture]=\"focusTrapAutoCaptureEnabled\">\r\n    <div class=\"mtx-popover-content\">\r\n      <ng-content></ng-content>\r\n    </div>\r\n    <div class=\"mtx-popover-direction-arrow\" [ngStyle]=\"arrowStyles\"></div>\r\n  </div>\r\n</ng-template>\r\n", styles: [".mtx-popover-panel{position:relative;max-height:calc(100vh - 48px);padding:8px;border-radius:4px;font-size:16px;outline:0}.mtx-popover-panel[class*=mtx-popover-below]{margin-top:calc(.5em + 2px)}.mtx-popover-panel[class*=mtx-popover-above]{margin-bottom:calc(.5em + 2px)}.mtx-popover-panel[class*=mtx-popover-before]{margin-right:calc(.5em + 2px)}[dir=rtl] .mtx-popover-panel[class*=mtx-popover-before]{margin-right:auto;margin-left:calc(.5em + 2px)}.mtx-popover-panel[class*=mtx-popover-after]{margin-left:calc(.5em + 2px)}[dir=rtl] .mtx-popover-panel[class*=mtx-popover-after]{margin-left:auto;margin-right:calc(.5em + 2px)}.mtx-popover-direction-arrow{position:absolute}.mtx-popover-direction-arrow:before,.mtx-popover-direction-arrow:after{position:absolute;display:inline-block;content:\"\";border-width:.5em;border-style:solid}.mtx-popover-direction-arrow:after{border-width:calc(.5em - 1px)}[class*=mtx-popover-below] .mtx-popover-direction-arrow,[class*=mtx-popover-above] .mtx-popover-direction-arrow{width:1em}[class*=mtx-popover-below] .mtx-popover-direction-arrow:after,[class*=mtx-popover-above] .mtx-popover-direction-arrow:after{left:1px}[dir=rtl] [class*=mtx-popover-below] .mtx-popover-direction-arrow:after,[dir=rtl] [class*=mtx-popover-above] .mtx-popover-direction-arrow:after{right:1px;left:auto}[class*=mtx-popover-below] .mtx-popover-direction-arrow{top:0}[class*=mtx-popover-below] .mtx-popover-direction-arrow:before,[class*=mtx-popover-below] .mtx-popover-direction-arrow:after{bottom:0;border-top-width:0}[class*=mtx-popover-above] .mtx-popover-direction-arrow{bottom:0}[class*=mtx-popover-above] .mtx-popover-direction-arrow:before,[class*=mtx-popover-above] .mtx-popover-direction-arrow:after{top:0;border-bottom-width:0}[class*=mtx-popover-before] .mtx-popover-direction-arrow,[class*=mtx-popover-after] .mtx-popover-direction-arrow{height:1em}[class*=mtx-popover-before] .mtx-popover-direction-arrow:after,[class*=mtx-popover-after] .mtx-popover-direction-arrow:after{top:1px}[class*=mtx-popover-before] .mtx-popover-direction-arrow{right:0}[class*=mtx-popover-before] .mtx-popover-direction-arrow:before,[class*=mtx-popover-before] .mtx-popover-direction-arrow:after{left:0;border-right-width:0}[dir=rtl] [class*=mtx-popover-before] .mtx-popover-direction-arrow{right:auto;left:0}[dir=rtl] [class*=mtx-popover-before] .mtx-popover-direction-arrow:before,[dir=rtl] [class*=mtx-popover-before] .mtx-popover-direction-arrow:after{left:auto;right:0;border-left-width:0}[dir=rtl] [class*=mtx-popover-before] .mtx-popover-direction-arrow:before{border-right-width:.5em}[dir=rtl] [class*=mtx-popover-before] .mtx-popover-direction-arrow:after{border-right-width:calc(.5em - 1px)}[class*=mtx-popover-after] .mtx-popover-direction-arrow{left:0}[class*=mtx-popover-after] .mtx-popover-direction-arrow:before,[class*=mtx-popover-after] .mtx-popover-direction-arrow:after{right:0;border-left-width:0}[dir=rtl] [class*=mtx-popover-after] .mtx-popover-direction-arrow{left:auto;right:0}[dir=rtl] [class*=mtx-popover-after] .mtx-popover-direction-arrow:before,[dir=rtl] [class*=mtx-popover-after] .mtx-popover-direction-arrow:after{right:auto;left:0;border-right-width:0}[dir=rtl] [class*=mtx-popover-after] .mtx-popover-direction-arrow:before{border-left-width:.5em}[dir=rtl] [class*=mtx-popover-after] .mtx-popover-direction-arrow:after{border-left-width:calc(.5em - 1px)}\n"], dependencies: [{ kind: "directive", type: i1.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i1.NgStyle, selector: "[ngStyle]", inputs: ["ngStyle"] }, { kind: "directive", type: i3.CdkTrapFocus, selector: "[cdkTrapFocus]", inputs: ["cdkTrapFocus", "cdkTrapFocusAutoCapture"], exportAs: ["cdkTrapFocus"] }], animations: [transformPopover], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MtxPopover, decorators: [{
            type: Component,
            args: [{ selector: 'mtx-popover', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, animations: [transformPopover], exportAs: 'mtxPopover', template: "<ng-template>\r\n  <div class=\"mtx-popover-panel\"\r\n       [id]=\"panelId\"\r\n       [ngClass]=\"_classList\"\r\n       (keydown)=\"_handleKeydown($event)\"\r\n       (click)=\"_handleClick()\"\r\n       (mouseover)=\"_handleMouseOver()\"\r\n       (mouseleave)=\"_handleMouseLeave()\"\r\n       [@transformPopover]=\"_panelAnimationState\"\r\n       (@transformPopover.start)=\"_onAnimationStart($event)\"\r\n       (@transformPopover.done)=\"_onAnimationDone($event)\"\r\n       tabindex=\"-1\"\r\n       role=\"dialog\"\r\n       [attr.aria-label]=\"ariaLabel || null\"\r\n       [attr.aria-labelledby]=\"ariaLabelledby || null\"\r\n       [attr.aria-describedby]=\"ariaDescribedby || null\"\r\n       [cdkTrapFocus]=\"focusTrapEnabled\"\r\n       [cdkTrapFocusAutoCapture]=\"focusTrapAutoCaptureEnabled\">\r\n    <div class=\"mtx-popover-content\">\r\n      <ng-content></ng-content>\r\n    </div>\r\n    <div class=\"mtx-popover-direction-arrow\" [ngStyle]=\"arrowStyles\"></div>\r\n  </div>\r\n</ng-template>\r\n", styles: [".mtx-popover-panel{position:relative;max-height:calc(100vh - 48px);padding:8px;border-radius:4px;font-size:16px;outline:0}.mtx-popover-panel[class*=mtx-popover-below]{margin-top:calc(.5em + 2px)}.mtx-popover-panel[class*=mtx-popover-above]{margin-bottom:calc(.5em + 2px)}.mtx-popover-panel[class*=mtx-popover-before]{margin-right:calc(.5em + 2px)}[dir=rtl] .mtx-popover-panel[class*=mtx-popover-before]{margin-right:auto;margin-left:calc(.5em + 2px)}.mtx-popover-panel[class*=mtx-popover-after]{margin-left:calc(.5em + 2px)}[dir=rtl] .mtx-popover-panel[class*=mtx-popover-after]{margin-left:auto;margin-right:calc(.5em + 2px)}.mtx-popover-direction-arrow{position:absolute}.mtx-popover-direction-arrow:before,.mtx-popover-direction-arrow:after{position:absolute;display:inline-block;content:\"\";border-width:.5em;border-style:solid}.mtx-popover-direction-arrow:after{border-width:calc(.5em - 1px)}[class*=mtx-popover-below] .mtx-popover-direction-arrow,[class*=mtx-popover-above] .mtx-popover-direction-arrow{width:1em}[class*=mtx-popover-below] .mtx-popover-direction-arrow:after,[class*=mtx-popover-above] .mtx-popover-direction-arrow:after{left:1px}[dir=rtl] [class*=mtx-popover-below] .mtx-popover-direction-arrow:after,[dir=rtl] [class*=mtx-popover-above] .mtx-popover-direction-arrow:after{right:1px;left:auto}[class*=mtx-popover-below] .mtx-popover-direction-arrow{top:0}[class*=mtx-popover-below] .mtx-popover-direction-arrow:before,[class*=mtx-popover-below] .mtx-popover-direction-arrow:after{bottom:0;border-top-width:0}[class*=mtx-popover-above] .mtx-popover-direction-arrow{bottom:0}[class*=mtx-popover-above] .mtx-popover-direction-arrow:before,[class*=mtx-popover-above] .mtx-popover-direction-arrow:after{top:0;border-bottom-width:0}[class*=mtx-popover-before] .mtx-popover-direction-arrow,[class*=mtx-popover-after] .mtx-popover-direction-arrow{height:1em}[class*=mtx-popover-before] .mtx-popover-direction-arrow:after,[class*=mtx-popover-after] .mtx-popover-direction-arrow:after{top:1px}[class*=mtx-popover-before] .mtx-popover-direction-arrow{right:0}[class*=mtx-popover-before] .mtx-popover-direction-arrow:before,[class*=mtx-popover-before] .mtx-popover-direction-arrow:after{left:0;border-right-width:0}[dir=rtl] [class*=mtx-popover-before] .mtx-popover-direction-arrow{right:auto;left:0}[dir=rtl] [class*=mtx-popover-before] .mtx-popover-direction-arrow:before,[dir=rtl] [class*=mtx-popover-before] .mtx-popover-direction-arrow:after{left:auto;right:0;border-left-width:0}[dir=rtl] [class*=mtx-popover-before] .mtx-popover-direction-arrow:before{border-right-width:.5em}[dir=rtl] [class*=mtx-popover-before] .mtx-popover-direction-arrow:after{border-right-width:calc(.5em - 1px)}[class*=mtx-popover-after] .mtx-popover-direction-arrow{left:0}[class*=mtx-popover-after] .mtx-popover-direction-arrow:before,[class*=mtx-popover-after] .mtx-popover-direction-arrow:after{right:0;border-left-width:0}[dir=rtl] [class*=mtx-popover-after] .mtx-popover-direction-arrow{left:auto;right:0}[dir=rtl] [class*=mtx-popover-after] .mtx-popover-direction-arrow:before,[dir=rtl] [class*=mtx-popover-after] .mtx-popover-direction-arrow:after{right:auto;left:0;border-right-width:0}[dir=rtl] [class*=mtx-popover-after] .mtx-popover-direction-arrow:before{border-left-width:.5em}[dir=rtl] [class*=mtx-popover-after] .mtx-popover-direction-arrow:after{border-left-width:calc(.5em - 1px)}\n"] }]
        }], ctorParameters: function () {
        return [{ type: i0.ElementRef }, { type: i0.NgZone }, { type: undefined, decorators: [{
                        type: Inject,
                        args: [MTX_POPOVER_DEFAULT_OPTIONS]
                    }] }];
    }, propDecorators: { backdropClass: [{
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

/** Injection token that determines the scroll handling while the popover is open. */
const MTX_POPOVER_SCROLL_STRATEGY = new InjectionToken('mtx-popover-scroll-strategy');
/** @docs-private */
function MTX_POPOVER_SCROLL_STRATEGY_FACTORY(overlay) {
    return () => overlay.scrollStrategies.reposition();
}
/** @docs-private */
const MTX_POPOVER_SCROLL_STRATEGY_FACTORY_PROVIDER = {
    provide: MTX_POPOVER_SCROLL_STRATEGY,
    deps: [Overlay],
    useFactory: MTX_POPOVER_SCROLL_STRATEGY_FACTORY,
};
/**
 * This directive is intended to be used in conjunction with an `mtx-popover` tag. It is
 * responsible for toggling the display of the provided popover instance.
 */
class MtxPopoverTrigger {
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
        var _a;
        if (this._popoverOpen || this._halt) {
            return;
        }
        this._checkPopover();
        const overlayRef = this._createOverlay();
        const overlayConfig = overlayRef.getConfig();
        this._setPosition(overlayConfig.positionStrategy);
        if (this.popover.triggerEvent === 'click') {
            overlayConfig.hasBackdrop = (_a = this.popover.hasBackdrop) !== null && _a !== void 0 ? _a : true;
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
            : of();
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
/** @nocollapse */ MtxPopoverTrigger.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MtxPopoverTrigger, deps: [{ token: i1$1.Overlay }, { token: i0.ElementRef }, { token: i0.ViewContainerRef }, { token: MTX_POPOVER_SCROLL_STRATEGY }, { token: i2.Directionality, optional: true }, { token: i0.ChangeDetectorRef }, { token: i3.FocusMonitor }], target: i0.ɵɵFactoryTarget.Directive });
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
        }], ctorParameters: function () {
        return [{ type: i1$1.Overlay }, { type: i0.ElementRef }, { type: i0.ViewContainerRef }, { type: undefined, decorators: [{
                        type: Inject,
                        args: [MTX_POPOVER_SCROLL_STRATEGY]
                    }] }, { type: i2.Directionality, decorators: [{
                        type: Optional
                    }] }, { type: i0.ChangeDetectorRef }, { type: i3.FocusMonitor }];
    }, propDecorators: { popover: [{
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

class MtxPopoverTarget {
    constructor(elementRef) {
        this.elementRef = elementRef;
    }
}
/** @nocollapse */ MtxPopoverTarget.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MtxPopoverTarget, deps: [{ token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Directive });
/** @nocollapse */ MtxPopoverTarget.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.2.1", type: MtxPopoverTarget, selector: "mtx-popover-target, [mtxPopoverTarget]", exportAs: ["mtxPopoverTarget"], ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MtxPopoverTarget, decorators: [{
            type: Directive,
            args: [{
                    selector: 'mtx-popover-target, [mtxPopoverTarget]',
                    exportAs: 'mtxPopoverTarget',
                }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }]; } });

class MtxPopoverModule {
}
/** @nocollapse */ MtxPopoverModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MtxPopoverModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
/** @nocollapse */ MtxPopoverModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "15.2.1", ngImport: i0, type: MtxPopoverModule, declarations: [MtxPopover, MtxPopoverTrigger, MtxPopoverTarget, MtxPopoverContent], imports: [CommonModule, OverlayModule, A11yModule], exports: [MtxPopover, MtxPopoverTrigger, MtxPopoverTarget, MtxPopoverContent] });
/** @nocollapse */ MtxPopoverModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MtxPopoverModule, providers: [MTX_POPOVER_SCROLL_STRATEGY_FACTORY_PROVIDER], imports: [CommonModule, OverlayModule, A11yModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MtxPopoverModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, OverlayModule, A11yModule],
                    exports: [MtxPopover, MtxPopoverTrigger, MtxPopoverTarget, MtxPopoverContent],
                    declarations: [MtxPopover, MtxPopoverTrigger, MtxPopoverTarget, MtxPopoverContent],
                    providers: [MTX_POPOVER_SCROLL_STRATEGY_FACTORY_PROVIDER],
                }]
        }] });

/**
 * Generated bundle index. Do not edit.
 */

export { MTX_POPOVER_CONTENT, MTX_POPOVER_DEFAULT_OPTIONS, MTX_POPOVER_DEFAULT_OPTIONS_FACTORY, MTX_POPOVER_SCROLL_STRATEGY, MTX_POPOVER_SCROLL_STRATEGY_FACTORY, MTX_POPOVER_SCROLL_STRATEGY_FACTORY_PROVIDER, MtxPopover, MtxPopoverContent, MtxPopoverModule, MtxPopoverTarget, MtxPopoverTrigger, _MtxPopoverContentBase, transformPopover };
//# sourceMappingURL=mtxPopover.mjs.map
