import * as i1$1 from '@angular/cdk/overlay';
import { OverlayConfig, OverlayModule } from '@angular/cdk/overlay';
import * as i4 from '@angular/cdk/portal';
import { BasePortalOutlet, CdkPortalOutlet, TemplatePortal, ComponentPortal, PortalModule } from '@angular/cdk/portal';
import * as i0 from '@angular/core';
import { EventEmitter, Component, ChangeDetectionStrategy, ViewEncapsulation, Optional, Inject, ViewChild, InjectionToken, TemplateRef, Injector, InjectFlags, Injectable, SkipSelf, NgModule } from '@angular/core';
import { MatCommonModule } from '@angular/material/core';
import { Directionality } from '@angular/cdk/bidi';
import { Subject, merge, of } from 'rxjs';
import { coerceCssPixelValue, coerceArray } from '@angular/cdk/coercion';
import * as i2 from '@angular/cdk/layout';
import { Breakpoints } from '@angular/cdk/layout';
import { _getFocusedElementPierceShadowDom } from '@angular/cdk/platform';
import { DOCUMENT } from '@angular/common';
import { trigger, state, style, transition, animate } from '@angular/animations';
import * as i1 from '@angular/cdk/a11y';
import { ESCAPE, hasModifierKey } from '@angular/cdk/keycodes';
import { filter, take } from 'rxjs/operators';

/**
 * Configuration used when opening a drawer.
 */
class MtxDrawerConfig {
    constructor() {
        /** Data being injected into the child component. */
        this.data = null;
        /** Whether the drawer has a backdrop. */
        this.hasBackdrop = true;
        /** Whether the user can use escape or clicking outside to close the drawer. */
        this.disableClose = false;
        /** Aria label to assign to the drawer element. */
        this.ariaLabel = null;
        /**
         * Whether the drawer should close when the user goes backwards/forwards in history.
         * Note that this usually doesn't include clicking on links (unless the user is using
         * the `HashLocationStrategy`).
         */
        this.closeOnNavigation = true;
        /**
         * Where the drawer should focus on open.
         * @breaking-change 14.0.0 Remove boolean option from autoFocus. Use string or
         * AutoFocusTarget instead.
         */
        this.autoFocus = 'first-tabbable';
        /**
         * Whether the drawer should restore focus to the
         * previously-focused element, after it's closed.
         */
        this.restoreFocus = true;
        /** Position of the drawer */
        this.position = 'right';
    }
}

/** Animations used by the drawer. */
const mtxDrawerAnimations = {
    /** Animation that shows and hides a drawer. */
    drawerState: trigger('state', [
        state('void, hidden', style({
            'box-shadow': 'none',
            'visibility': 'hidden',
        })),
        state('visible', style({
            transform: 'none',
            visibility: 'visible',
        })),
        transition('visible => void, visible => hidden', animate('400ms cubic-bezier(0.25, 0.8, 0.25, 1)')),
        transition('void => visible', animate('150ms cubic-bezier(0, 0, 0.2, 1)')),
    ]),
};

/**
 * Internal component that wraps user-provided drawer content.
 * @docs-private
 */
class MtxDrawerContainer extends BasePortalOutlet {
    get _drawerPosition() {
        return `mtx-drawer-${this.drawerConfig.position}`;
    }
    get _drawerWidth() {
        return this.drawerConfig.position === 'left' || this.drawerConfig.position === 'right'
            ? coerceCssPixelValue(this.drawerConfig.width)
            : '100vw';
    }
    get _drawerHeight() {
        return this.drawerConfig.position === 'top' || this.drawerConfig.position === 'bottom'
            ? coerceCssPixelValue(this.drawerConfig.height)
            : '100vh';
    }
    _getDrawerSize() {
        return {
            width: this._drawerWidth,
            height: this._drawerHeight,
            minWidth: coerceCssPixelValue(this.drawerConfig.minWidth),
            minHeight: coerceCssPixelValue(this.drawerConfig.minHeight),
            maxWidth: coerceCssPixelValue(this.drawerConfig.maxWidth),
            maxHeight: coerceCssPixelValue(this.drawerConfig.maxHeight),
        };
    }
    constructor(_elementRef, _changeDetectorRef, _focusTrapFactory, _interactivityChecker, _ngZone, breakpointObserver, document, 
    /** The drawer configuration. */
    drawerConfig) {
        super();
        this._elementRef = _elementRef;
        this._changeDetectorRef = _changeDetectorRef;
        this._focusTrapFactory = _focusTrapFactory;
        this._interactivityChecker = _interactivityChecker;
        this._ngZone = _ngZone;
        this.drawerConfig = drawerConfig;
        /** The state of the drawer animations. */
        this._animationState = 'void';
        /** Emits whenever the state of the animation changes. */
        this._animationStateChanged = new EventEmitter();
        /** Element that was focused before the drawer was opened. */
        this._elementFocusedBeforeOpened = null;
        /**
         * Attaches a DOM portal to the drawer container.
         * @deprecated To be turned into a method.
         * @breaking-change 10.0.0
         */
        this.attachDomPortal = (portal) => {
            this._validatePortalAttached();
            this._setPanelClass();
            this._savePreviouslyFocusedElement();
            return this._portalOutlet.attachDomPortal(portal);
        };
        this._document = document;
        this._breakpointSubscription = breakpointObserver
            .observe([Breakpoints.Medium, Breakpoints.Large, Breakpoints.XLarge])
            .subscribe(() => { });
    }
    /** Attach a component portal as content to this drawer container. */
    attachComponentPortal(portal) {
        this._validatePortalAttached();
        this._setPanelClass();
        this._savePreviouslyFocusedElement();
        return this._portalOutlet.attachComponentPortal(portal);
    }
    /** Attach a template portal as content to this drawer container. */
    attachTemplatePortal(portal) {
        this._validatePortalAttached();
        this._setPanelClass();
        this._savePreviouslyFocusedElement();
        return this._portalOutlet.attachTemplatePortal(portal);
    }
    /** Begin animation of drawer entrance into view. */
    enter() {
        if (!this._destroyed) {
            this._animationState = 'visible';
            this._changeDetectorRef.detectChanges();
        }
    }
    /** Begin animation of the drawer exiting from view. */
    exit() {
        if (!this._destroyed) {
            this._animationState = 'hidden';
            this._changeDetectorRef.markForCheck();
        }
    }
    ngOnDestroy() {
        this._breakpointSubscription.unsubscribe();
        this._destroyed = true;
    }
    _onAnimationDone(event) {
        if (event.toState === 'hidden') {
            this._restoreFocus();
        }
        else if (event.toState === 'visible') {
            this._trapFocus();
        }
        this._animationStateChanged.emit(event);
    }
    _onAnimationStart(event) {
        this._animationStateChanged.emit(event);
    }
    _toggleClass(cssClass, add) {
        this._elementRef.nativeElement.classList.toggle(cssClass, add);
    }
    _validatePortalAttached() {
        if (this._portalOutlet.hasAttached()) {
            throw Error('Attempting to attach drawer content after content is already attached');
        }
    }
    _setPanelClass() {
        const element = this._elementRef.nativeElement;
        element.classList.add(...coerceArray(this.drawerConfig.panelClass || []));
    }
    /**
     * Focuses the provided element. If the element is not focusable, it will add a tabIndex
     * attribute to forcefully focus it. The attribute is removed after focus is moved.
     * @param element The element to focus.
     */
    _forceFocus(element, options) {
        if (!this._interactivityChecker.isFocusable(element)) {
            element.tabIndex = -1;
            // The tabindex attribute should be removed to avoid navigating to that element again
            this._ngZone.runOutsideAngular(() => {
                element.addEventListener('blur', () => element.removeAttribute('tabindex'));
                element.addEventListener('mousedown', () => element.removeAttribute('tabindex'));
            });
        }
        element.focus(options);
    }
    /**
     * Focuses the first element that matches the given selector within the focus trap.
     * @param selector The CSS selector for the element to set focus to.
     */
    _focusByCssSelector(selector, options) {
        const elementToFocus = this._elementRef.nativeElement.querySelector(selector);
        if (elementToFocus) {
            this._forceFocus(elementToFocus, options);
        }
    }
    /**
     * Moves the focus inside the focus trap. When autoFocus is not set to 'bottom-sheet',
     * if focus cannot be moved then focus will go to the drawer container.
     */
    _trapFocus() {
        const element = this._elementRef.nativeElement;
        if (!this._focusTrap) {
            this._focusTrap = this._focusTrapFactory.create(element);
        }
        // If were to attempt to focus immediately, then the content of the drawer would not
        // yet be ready in instances where change detection has to run first. To deal with this,
        // we simply wait for the microtask queue to be empty when setting focus when autoFocus
        // isn't set to drawer. If the element inside the drawer can't be focused,
        // then the container is focused so the user can't tab into other elements behind it.
        switch (this.drawerConfig.autoFocus) {
            case false:
            case 'dialog':
                // eslint-disable-next-line no-case-declarations
                const activeElement = _getFocusedElementPierceShadowDom();
                // Ensure that focus is on the drawer container. It's possible that a different
                // component tried to move focus while the open animation was running. See:
                // https://github.com/angular/components/issues/16215. Note that we only want to do this
                // if the focus isn't inside the drawer already, because it's possible that the
                // consumer specified `autoFocus` in order to move focus themselves.
                if (activeElement !== element && !element.contains(activeElement)) {
                    element.focus();
                }
                break;
            case true:
            case 'first-tabbable':
                this._focusTrap.focusInitialElementWhenReady();
                break;
            case 'first-heading':
                this._focusByCssSelector('h1, h2, h3, h4, h5, h6, [role="heading"]');
                break;
            default:
                this._focusByCssSelector(this.drawerConfig.autoFocus);
                break;
        }
    }
    /** Restores focus to the element that was focused before the drawer was opened. */
    _restoreFocus() {
        const toFocus = this._elementFocusedBeforeOpened;
        // We need the extra check, because IE can set the `activeElement` to null in some cases.
        if (this.drawerConfig.restoreFocus && toFocus && typeof toFocus.focus === 'function') {
            const activeElement = _getFocusedElementPierceShadowDom();
            const element = this._elementRef.nativeElement;
            // Make sure that focus is still inside the drawer or is on the body (usually because a
            // non-focusable element like the backdrop was clicked) before moving it. It's possible that
            // the consumer moved it themselves before the animation was done, in which case we shouldn't
            // do anything.
            if (!activeElement ||
                activeElement === this._document.body ||
                activeElement === element ||
                element.contains(activeElement)) {
                toFocus.focus();
            }
        }
        if (this._focusTrap) {
            this._focusTrap.destroy();
        }
    }
    /** Saves a reference to the element that was focused before the drawer was opened. */
    _savePreviouslyFocusedElement() {
        this._elementFocusedBeforeOpened = _getFocusedElementPierceShadowDom();
        // The `focus` method isn't available during server-side rendering.
        if (this._elementRef.nativeElement.focus) {
            this._ngZone.runOutsideAngular(() => {
                Promise.resolve().then(() => this._elementRef.nativeElement.focus());
            });
        }
    }
}
/** @nocollapse */ MtxDrawerContainer.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MtxDrawerContainer, deps: [{ token: i0.ElementRef }, { token: i0.ChangeDetectorRef }, { token: i1.FocusTrapFactory }, { token: i1.InteractivityChecker }, { token: i0.NgZone }, { token: i2.BreakpointObserver }, { token: DOCUMENT, optional: true }, { token: MtxDrawerConfig }], target: i0.ɵɵFactoryTarget.Component });
/** @nocollapse */ MtxDrawerContainer.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.1", type: MtxDrawerContainer, selector: "mtx-drawer-container", host: { attributes: { "tabindex": "-1", "role": "dialog", "aria-modal": "true" }, listeners: { "@state.start": "_onAnimationStart($event)", "@state.done": "_onAnimationDone($event)" }, properties: { "class": "_drawerPosition", "attr.aria-label": "drawerConfig?.ariaLabel", "@state": "_animationState" }, classAttribute: "mtx-drawer-container" }, viewQueries: [{ propertyName: "_portalOutlet", first: true, predicate: CdkPortalOutlet, descendants: true, static: true }], usesInheritance: true, ngImport: i0, template: "<div class=\"mtx-drawer-content-wrapper\" [style]=\"_getDrawerSize()\">\n  <ng-template cdkPortalOutlet></ng-template>\n</div>\n", styles: [".mtx-drawer-container{display:block;outline:0}.cdk-high-contrast-active .mtx-drawer-container{outline:1px solid}.mtx-drawer-content-wrapper{box-sizing:border-box;padding:8px 16px;overflow:auto}.mtx-drawer-right{transform:translate(100%)}.mtx-drawer-left{transform:translate(-100%)}.mtx-drawer-bottom{transform:translateY(100%)}.mtx-drawer-top{transform:translateY(-100%)}\n"], dependencies: [{ kind: "directive", type: i4.CdkPortalOutlet, selector: "[cdkPortalOutlet]", inputs: ["cdkPortalOutlet"], outputs: ["attached"], exportAs: ["cdkPortalOutlet"] }], animations: [mtxDrawerAnimations.drawerState], changeDetection: i0.ChangeDetectionStrategy.Default, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MtxDrawerContainer, decorators: [{
            type: Component,
            args: [{ selector: 'mtx-drawer-container', changeDetection: ChangeDetectionStrategy.Default, encapsulation: ViewEncapsulation.None, animations: [mtxDrawerAnimations.drawerState], host: {
                        'class': 'mtx-drawer-container',
                        '[class]': '_drawerPosition',
                        'tabindex': '-1',
                        'role': 'dialog',
                        'aria-modal': 'true',
                        '[attr.aria-label]': 'drawerConfig?.ariaLabel',
                        '[@state]': '_animationState',
                        '(@state.start)': '_onAnimationStart($event)',
                        '(@state.done)': '_onAnimationDone($event)',
                    }, template: "<div class=\"mtx-drawer-content-wrapper\" [style]=\"_getDrawerSize()\">\n  <ng-template cdkPortalOutlet></ng-template>\n</div>\n", styles: [".mtx-drawer-container{display:block;outline:0}.cdk-high-contrast-active .mtx-drawer-container{outline:1px solid}.mtx-drawer-content-wrapper{box-sizing:border-box;padding:8px 16px;overflow:auto}.mtx-drawer-right{transform:translate(100%)}.mtx-drawer-left{transform:translate(-100%)}.mtx-drawer-bottom{transform:translateY(100%)}.mtx-drawer-top{transform:translateY(-100%)}\n"] }]
        }], ctorParameters: function () {
        return [{ type: i0.ElementRef }, { type: i0.ChangeDetectorRef }, { type: i1.FocusTrapFactory }, { type: i1.InteractivityChecker }, { type: i0.NgZone }, { type: i2.BreakpointObserver }, { type: undefined, decorators: [{
                        type: Optional
                    }, {
                        type: Inject,
                        args: [DOCUMENT]
                    }] }, { type: MtxDrawerConfig }];
    }, propDecorators: { _portalOutlet: [{
                type: ViewChild,
                args: [CdkPortalOutlet, { static: true }]
            }] } });

/**
 * Reference to a drawer dispatched from the drawer service.
 */
class MtxDrawerRef {
    constructor(containerInstance, _overlayRef) {
        this._overlayRef = _overlayRef;
        /** Subject for notifying the user that the drawer has been dismissed. */
        this._afterDismissed = new Subject();
        /** Subject for notifying the user that the drawer has opened and appeared. */
        this._afterOpened = new Subject();
        this.containerInstance = containerInstance;
        this.disableClose = containerInstance.drawerConfig.disableClose;
        // Emit when opening animation completes
        containerInstance._animationStateChanged
            .pipe(filter(event => event.phaseName === 'done' && event.toState === 'visible'), take(1))
            .subscribe(() => {
            this._afterOpened.next();
            this._afterOpened.complete();
        });
        // Dispose overlay when closing animation is complete
        containerInstance._animationStateChanged
            .pipe(filter(event => event.phaseName === 'done' && event.toState === 'hidden'), take(1))
            .subscribe(() => {
            clearTimeout(this._closeFallbackTimeout);
            _overlayRef.dispose();
        });
        _overlayRef
            .detachments()
            .pipe(take(1))
            .subscribe(() => {
            this._afterDismissed.next(this._result);
            this._afterDismissed.complete();
        });
        merge(_overlayRef.backdropClick(), _overlayRef.keydownEvents().pipe(filter(event => event.keyCode === ESCAPE))).subscribe(event => {
            if (!this.disableClose &&
                (event.type !== 'keydown' || !hasModifierKey(event))) {
                event.preventDefault();
                this.dismiss();
            }
        });
    }
    /**
     * Dismisses the drawer.
     * @param result Data to be passed back to the drawer opener.
     */
    dismiss(result) {
        if (!this._afterDismissed.closed) {
            // Transition the backdrop in parallel to the drawer.
            this.containerInstance._animationStateChanged
                .pipe(filter(event => event.phaseName === 'start'), take(1))
                .subscribe(event => {
                // The logic that disposes of the overlay depends on the exit animation completing, however
                // it isn't guaranteed if the parent view is destroyed while it's running. Add a fallback
                // timeout which will clean everything up if the animation hasn't fired within the specified
                // amount of time plus 100ms. We don't need to run this outside the NgZone, because for the
                // vast majority of cases the timeout will have been cleared before it has fired.
                this._closeFallbackTimeout = setTimeout(() => {
                    this._overlayRef.dispose();
                }, event.totalTime + 100);
                this._overlayRef.detachBackdrop();
            });
            this._result = result;
            this.containerInstance.exit();
        }
    }
    /** Gets an observable that is notified when the drawer is finished closing. */
    afterDismissed() {
        return this._afterDismissed;
    }
    /** Gets an observable that is notified when the drawer has opened and appeared. */
    afterOpened() {
        return this._afterOpened;
    }
    /**
     * Gets an observable that emits when the overlay's backdrop has been clicked.
     */
    backdropClick() {
        return this._overlayRef.backdropClick();
    }
    /**
     * Gets an observable that emits when keydown events are targeted on the overlay.
     */
    keydownEvents() {
        return this._overlayRef.keydownEvents();
    }
}

/** Injection token that can be used to access the data that was passed in to a drawer. */
const MTX_DRAWER_DATA = new InjectionToken('MtxDrawerData');
/** Injection token that can be used to specify default drawer options. */
const MTX_DRAWER_DEFAULT_OPTIONS = new InjectionToken('mtx-drawer-default-options');
/**
 * Service to trigger Material Design bottom sheets.
 */
class MtxDrawer {
    /** Reference to the currently opened drawer. */
    get _openedDrawerRef() {
        const parent = this._parentDrawer;
        return parent ? parent._openedDrawerRef : this._drawerRefAtThisLevel;
    }
    set _openedDrawerRef(value) {
        if (this._parentDrawer) {
            this._parentDrawer._openedDrawerRef = value;
        }
        else {
            this._drawerRefAtThisLevel = value;
        }
    }
    constructor(_overlay, _injector, _parentDrawer, _defaultOptions) {
        this._overlay = _overlay;
        this._injector = _injector;
        this._parentDrawer = _parentDrawer;
        this._defaultOptions = _defaultOptions;
        this._drawerRefAtThisLevel = null;
    }
    open(componentOrTemplateRef, config) {
        const _config = _applyConfigDefaults(this._defaultOptions || new MtxDrawerConfig(), config);
        const overlayRef = this._createOverlay(_config);
        const container = this._attachContainer(overlayRef, _config);
        const ref = new MtxDrawerRef(container, overlayRef);
        if (componentOrTemplateRef instanceof TemplateRef) {
            container.attachTemplatePortal(new TemplatePortal(componentOrTemplateRef, null, {
                $implicit: _config.data,
                drawerRef: ref,
            }));
        }
        else {
            const portal = new ComponentPortal(componentOrTemplateRef, undefined, this._createInjector(_config, ref));
            const contentRef = container.attachComponentPortal(portal);
            ref.instance = contentRef.instance;
        }
        // When the drawer is dismissed, clear the reference to it.
        ref.afterDismissed().subscribe(() => {
            // Clear the drawer ref if it hasn't already been replaced by a newer one.
            if (this._openedDrawerRef == ref) {
                this._openedDrawerRef = null;
            }
        });
        if (this._openedDrawerRef) {
            // If a drawer is already in view, dismiss it and enter the
            // new drawer after exit animation is complete.
            this._openedDrawerRef.afterDismissed().subscribe(() => ref.containerInstance.enter());
            this._openedDrawerRef.dismiss();
        }
        else {
            // If no drawer is in view, enter the new drawer.
            ref.containerInstance.enter();
        }
        this._openedDrawerRef = ref;
        return ref;
    }
    /**
     * Dismisses the currently-visible drawer.
     * @param result Data to pass to the drawer instance.
     */
    dismiss(result) {
        if (this._openedDrawerRef) {
            this._openedDrawerRef.dismiss(result);
        }
    }
    ngOnDestroy() {
        if (this._drawerRefAtThisLevel) {
            this._drawerRefAtThisLevel.dismiss();
        }
    }
    /**
     * Attaches the drawer container component to the overlay.
     */
    _attachContainer(overlayRef, config) {
        const userInjector = config && config.viewContainerRef && config.viewContainerRef.injector;
        const injector = Injector.create({
            parent: userInjector || this._injector,
            providers: [{ provide: MtxDrawerConfig, useValue: config }],
        });
        const containerPortal = new ComponentPortal(MtxDrawerContainer, config.viewContainerRef, injector);
        const containerRef = overlayRef.attach(containerPortal);
        return containerRef.instance;
    }
    /**
     * Creates a new overlay and places it in the correct location.
     * @param config The user-specified drawer config.
     */
    _createOverlay(config) {
        const overlayConfig = new OverlayConfig({
            direction: config.direction,
            hasBackdrop: config.hasBackdrop,
            disposeOnNavigation: config.closeOnNavigation,
            maxWidth: '100%',
            scrollStrategy: config.scrollStrategy || this._overlay.scrollStrategies.block(),
            positionStrategy: this._overlay.position().global()[config.position]('0'),
        });
        if (config.backdropClass) {
            overlayConfig.backdropClass = config.backdropClass;
        }
        return this._overlay.create(overlayConfig);
    }
    /**
     * Creates an injector to be used inside of a drawer component.
     * @param config Config that was used to create the drawer.
     * @param drawerRef Reference to the drawer.
     */
    _createInjector(config, drawerRef) {
        const userInjector = config && config.viewContainerRef && config.viewContainerRef.injector;
        const providers = [
            { provide: MtxDrawerRef, useValue: drawerRef },
            { provide: MTX_DRAWER_DATA, useValue: config.data },
        ];
        if (config.direction &&
            (!userInjector ||
                !userInjector.get(Directionality, null, InjectFlags.Optional))) {
            providers.push({
                provide: Directionality,
                useValue: { value: config.direction, change: of() },
            });
        }
        return Injector.create({ parent: userInjector || this._injector, providers });
    }
}
/** @nocollapse */ MtxDrawer.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MtxDrawer, deps: [{ token: i1$1.Overlay }, { token: i0.Injector }, { token: MtxDrawer, optional: true, skipSelf: true }, { token: MTX_DRAWER_DEFAULT_OPTIONS, optional: true }], target: i0.ɵɵFactoryTarget.Injectable });
/** @nocollapse */ MtxDrawer.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MtxDrawer });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MtxDrawer, decorators: [{
            type: Injectable
        }], ctorParameters: function () {
        return [{ type: i1$1.Overlay }, { type: i0.Injector }, { type: MtxDrawer, decorators: [{
                        type: Optional
                    }, {
                        type: SkipSelf
                    }] }, { type: MtxDrawerConfig, decorators: [{
                        type: Optional
                    }, {
                        type: Inject,
                        args: [MTX_DRAWER_DEFAULT_OPTIONS]
                    }] }];
    } });
/**
 * Applies default options to the drawer config.
 * @param defaults Object containing the default values to which to fall back.
 * @param config The configuration to which the defaults will be applied.
 * @returns The new configuration object with defaults applied.
 */
function _applyConfigDefaults(defaults, config) {
    return Object.assign(Object.assign({}, defaults), config);
}

class MtxDrawerModule {
}
/** @nocollapse */ MtxDrawerModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MtxDrawerModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
/** @nocollapse */ MtxDrawerModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "15.2.1", ngImport: i0, type: MtxDrawerModule, declarations: [MtxDrawerContainer], imports: [OverlayModule, PortalModule, MatCommonModule], exports: [MtxDrawerContainer, MatCommonModule] });
/** @nocollapse */ MtxDrawerModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MtxDrawerModule, providers: [MtxDrawer], imports: [OverlayModule, PortalModule, MatCommonModule, MatCommonModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MtxDrawerModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [OverlayModule, PortalModule, MatCommonModule],
                    exports: [MtxDrawerContainer, MatCommonModule],
                    declarations: [MtxDrawerContainer],
                    providers: [MtxDrawer],
                }]
        }] });

/**
 * Generated bundle index. Do not edit.
 */

export { MTX_DRAWER_DATA, MTX_DRAWER_DEFAULT_OPTIONS, MtxDrawer, MtxDrawerConfig, MtxDrawerContainer, MtxDrawerModule, MtxDrawerRef, mtxDrawerAnimations };
//# sourceMappingURL=mtxDrawer.mjs.map
