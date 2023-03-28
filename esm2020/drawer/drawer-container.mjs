import { coerceArray, coerceCssPixelValue } from '@angular/cdk/coercion';
import { Breakpoints } from '@angular/cdk/layout';
import { _getFocusedElementPierceShadowDom } from '@angular/cdk/platform';
import { BasePortalOutlet, CdkPortalOutlet, } from '@angular/cdk/portal';
import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Inject, Optional, ViewChild, ViewEncapsulation, } from '@angular/core';
import { mtxDrawerAnimations } from './drawer-animation';
import * as i0 from "@angular/core";
import * as i1 from "@angular/cdk/a11y";
import * as i2 from "@angular/cdk/layout";
import * as i3 from "./drawer-config";
import * as i4 from "@angular/cdk/portal";
/**
 * Internal component that wraps user-provided drawer content.
 * @docs-private
 */
export class MtxDrawerContainer extends BasePortalOutlet {
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
/** @nocollapse */ MtxDrawerContainer.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MtxDrawerContainer, deps: [{ token: i0.ElementRef }, { token: i0.ChangeDetectorRef }, { token: i1.FocusTrapFactory }, { token: i1.InteractivityChecker }, { token: i0.NgZone }, { token: i2.BreakpointObserver }, { token: DOCUMENT, optional: true }, { token: i3.MtxDrawerConfig }], target: i0.ɵɵFactoryTarget.Component });
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
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i0.ChangeDetectorRef }, { type: i1.FocusTrapFactory }, { type: i1.InteractivityChecker }, { type: i0.NgZone }, { type: i2.BreakpointObserver }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [DOCUMENT]
                }] }, { type: i3.MtxDrawerConfig }]; }, propDecorators: { _portalOutlet: [{
                type: ViewChild,
                args: [CdkPortalOutlet, { static: true }]
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHJhd2VyLWNvbnRhaW5lci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL2V4dGVuc2lvbnMvZHJhd2VyL2RyYXdlci1jb250YWluZXIudHMiLCIuLi8uLi8uLi8uLi9wcm9qZWN0cy9leHRlbnNpb25zL2RyYXdlci9kcmF3ZXItY29udGFpbmVyLmh0bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBRUEsT0FBTyxFQUFFLFdBQVcsRUFBRSxtQkFBbUIsRUFBRSxNQUFNLHVCQUF1QixDQUFDO0FBQ3pFLE9BQU8sRUFBc0IsV0FBVyxFQUFFLE1BQU0scUJBQXFCLENBQUM7QUFDdEUsT0FBTyxFQUFFLGlDQUFpQyxFQUFFLE1BQU0sdUJBQXVCLENBQUM7QUFDMUUsT0FBTyxFQUNMLGdCQUFnQixFQUNoQixlQUFlLEdBSWhCLE1BQU0scUJBQXFCLENBQUM7QUFDN0IsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQzNDLE9BQU8sRUFDTCx1QkFBdUIsRUFFdkIsU0FBUyxFQUlULFlBQVksRUFDWixNQUFNLEVBR04sUUFBUSxFQUNSLFNBQVMsRUFDVCxpQkFBaUIsR0FDbEIsTUFBTSxlQUFlLENBQUM7QUFFdkIsT0FBTyxFQUFFLG1CQUFtQixFQUFFLE1BQU0sb0JBQW9CLENBQUM7Ozs7OztBQUd6RDs7O0dBR0c7QUF1QkgsTUFBTSxPQUFPLGtCQUFtQixTQUFRLGdCQUFnQjtJQXdCdEQsSUFBSSxlQUFlO1FBQ2pCLE9BQU8sY0FBYyxJQUFJLENBQUMsWUFBWSxDQUFDLFFBQVEsRUFBRSxDQUFDO0lBQ3BELENBQUM7SUFFRCxJQUFJLFlBQVk7UUFDZCxPQUFPLElBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxLQUFLLE1BQU0sSUFBSSxJQUFJLENBQUMsWUFBWSxDQUFDLFFBQVEsS0FBSyxPQUFPO1lBQ3BGLENBQUMsQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQztZQUM5QyxDQUFDLENBQUMsT0FBTyxDQUFDO0lBQ2QsQ0FBQztJQUVELElBQUksYUFBYTtRQUNmLE9BQU8sSUFBSSxDQUFDLFlBQVksQ0FBQyxRQUFRLEtBQUssS0FBSyxJQUFJLElBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxLQUFLLFFBQVE7WUFDcEYsQ0FBQyxDQUFDLG1CQUFtQixDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDO1lBQy9DLENBQUMsQ0FBQyxPQUFPLENBQUM7SUFDZCxDQUFDO0lBRUQsY0FBYztRQUNaLE9BQU87WUFDTCxLQUFLLEVBQUUsSUFBSSxDQUFDLFlBQVk7WUFDeEIsTUFBTSxFQUFFLElBQUksQ0FBQyxhQUFhO1lBQzFCLFFBQVEsRUFBRSxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQztZQUN6RCxTQUFTLEVBQUUsbUJBQW1CLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxTQUFTLENBQUM7WUFDM0QsUUFBUSxFQUFFLG1CQUFtQixDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDO1lBQ3pELFNBQVMsRUFBRSxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBQztTQUM1RCxDQUFDO0lBQ0osQ0FBQztJQUVELFlBQ1UsV0FBb0MsRUFDcEMsa0JBQXFDLEVBQ3JDLGlCQUFtQyxFQUMxQixxQkFBMkMsRUFDM0MsT0FBZSxFQUNoQyxrQkFBc0MsRUFDUixRQUFhO0lBQzNDLGdDQUFnQztJQUN6QixZQUE2QjtRQUVwQyxLQUFLLEVBQUUsQ0FBQztRQVZBLGdCQUFXLEdBQVgsV0FBVyxDQUF5QjtRQUNwQyx1QkFBa0IsR0FBbEIsa0JBQWtCLENBQW1CO1FBQ3JDLHNCQUFpQixHQUFqQixpQkFBaUIsQ0FBa0I7UUFDMUIsMEJBQXFCLEdBQXJCLHFCQUFxQixDQUFzQjtRQUMzQyxZQUFPLEdBQVAsT0FBTyxDQUFRO1FBSXpCLGlCQUFZLEdBQVosWUFBWSxDQUFpQjtRQXREdEMsMENBQTBDO1FBQzFDLG9CQUFlLEdBQWtDLE1BQU0sQ0FBQztRQUV4RCx5REFBeUQ7UUFDekQsMkJBQXNCLEdBQUcsSUFBSSxZQUFZLEVBQWtCLENBQUM7UUFLNUQsNkRBQTZEO1FBQ3JELGdDQUEyQixHQUF1QixJQUFJLENBQUM7UUFzRS9EOzs7O1dBSUc7UUFDTSxvQkFBZSxHQUFHLENBQUMsTUFBaUIsRUFBRSxFQUFFO1lBQy9DLElBQUksQ0FBQyx1QkFBdUIsRUFBRSxDQUFDO1lBQy9CLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztZQUN0QixJQUFJLENBQUMsNkJBQTZCLEVBQUUsQ0FBQztZQUNyQyxPQUFPLElBQUksQ0FBQyxhQUFhLENBQUMsZUFBZSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3BELENBQUMsQ0FBQztRQWhDQSxJQUFJLENBQUMsU0FBUyxHQUFHLFFBQVEsQ0FBQztRQUMxQixJQUFJLENBQUMsdUJBQXVCLEdBQUcsa0JBQWtCO2FBQzlDLE9BQU8sQ0FBQyxDQUFDLFdBQVcsQ0FBQyxNQUFNLEVBQUUsV0FBVyxDQUFDLEtBQUssRUFBRSxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUM7YUFDcEUsU0FBUyxDQUFDLEdBQUcsRUFBRSxHQUFFLENBQUMsQ0FBQyxDQUFDO0lBQ3pCLENBQUM7SUFFRCxxRUFBcUU7SUFDckUscUJBQXFCLENBQUksTUFBMEI7UUFDakQsSUFBSSxDQUFDLHVCQUF1QixFQUFFLENBQUM7UUFDL0IsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO1FBQ3RCLElBQUksQ0FBQyw2QkFBNkIsRUFBRSxDQUFDO1FBQ3JDLE9BQU8sSUFBSSxDQUFDLGFBQWEsQ0FBQyxxQkFBcUIsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUMxRCxDQUFDO0lBRUQsb0VBQW9FO0lBQ3BFLG9CQUFvQixDQUFJLE1BQXlCO1FBQy9DLElBQUksQ0FBQyx1QkFBdUIsRUFBRSxDQUFDO1FBQy9CLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztRQUN0QixJQUFJLENBQUMsNkJBQTZCLEVBQUUsQ0FBQztRQUNyQyxPQUFPLElBQUksQ0FBQyxhQUFhLENBQUMsb0JBQW9CLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDekQsQ0FBQztJQWNELG9EQUFvRDtJQUNwRCxLQUFLO1FBQ0gsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUU7WUFDcEIsSUFBSSxDQUFDLGVBQWUsR0FBRyxTQUFTLENBQUM7WUFDakMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLGFBQWEsRUFBRSxDQUFDO1NBQ3pDO0lBQ0gsQ0FBQztJQUVELHVEQUF1RDtJQUN2RCxJQUFJO1FBQ0YsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUU7WUFDcEIsSUFBSSxDQUFDLGVBQWUsR0FBRyxRQUFRLENBQUM7WUFDaEMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLFlBQVksRUFBRSxDQUFDO1NBQ3hDO0lBQ0gsQ0FBQztJQUVELFdBQVc7UUFDVCxJQUFJLENBQUMsdUJBQXVCLENBQUMsV0FBVyxFQUFFLENBQUM7UUFDM0MsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUM7SUFDekIsQ0FBQztJQUVELGdCQUFnQixDQUFDLEtBQXFCO1FBQ3BDLElBQUksS0FBSyxDQUFDLE9BQU8sS0FBSyxRQUFRLEVBQUU7WUFDOUIsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO1NBQ3RCO2FBQU0sSUFBSSxLQUFLLENBQUMsT0FBTyxLQUFLLFNBQVMsRUFBRTtZQUN0QyxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7U0FDbkI7UUFFRCxJQUFJLENBQUMsc0JBQXNCLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQzFDLENBQUM7SUFFRCxpQkFBaUIsQ0FBQyxLQUFxQjtRQUNyQyxJQUFJLENBQUMsc0JBQXNCLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQzFDLENBQUM7SUFFTyxZQUFZLENBQUMsUUFBZ0IsRUFBRSxHQUFZO1FBQ2pELElBQUksQ0FBQyxXQUFXLENBQUMsYUFBYSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLEdBQUcsQ0FBQyxDQUFDO0lBQ2pFLENBQUM7SUFFTyx1QkFBdUI7UUFDN0IsSUFBSSxJQUFJLENBQUMsYUFBYSxDQUFDLFdBQVcsRUFBRSxFQUFFO1lBQ3BDLE1BQU0sS0FBSyxDQUFDLHVFQUF1RSxDQUFDLENBQUM7U0FDdEY7SUFDSCxDQUFDO0lBRU8sY0FBYztRQUNwQixNQUFNLE9BQU8sR0FBZ0IsSUFBSSxDQUFDLFdBQVcsQ0FBQyxhQUFhLENBQUM7UUFDNUQsT0FBTyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsR0FBRyxXQUFXLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxVQUFVLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQztJQUM1RSxDQUFDO0lBRUQ7Ozs7T0FJRztJQUNLLFdBQVcsQ0FBQyxPQUFvQixFQUFFLE9BQXNCO1FBQzlELElBQUksQ0FBQyxJQUFJLENBQUMscUJBQXFCLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxFQUFFO1lBQ3BELE9BQU8sQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFDdEIscUZBQXFGO1lBQ3JGLElBQUksQ0FBQyxPQUFPLENBQUMsaUJBQWlCLENBQUMsR0FBRyxFQUFFO2dCQUNsQyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxFQUFFLEdBQUcsRUFBRSxDQUFDLE9BQU8sQ0FBQyxlQUFlLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztnQkFDNUUsT0FBTyxDQUFDLGdCQUFnQixDQUFDLFdBQVcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxPQUFPLENBQUMsZUFBZSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7WUFDbkYsQ0FBQyxDQUFDLENBQUM7U0FDSjtRQUNELE9BQU8sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDekIsQ0FBQztJQUVEOzs7T0FHRztJQUNLLG1CQUFtQixDQUFDLFFBQWdCLEVBQUUsT0FBc0I7UUFDbEUsTUFBTSxjQUFjLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxhQUFhLENBQUMsYUFBYSxDQUNqRSxRQUFRLENBQ2EsQ0FBQztRQUN4QixJQUFJLGNBQWMsRUFBRTtZQUNsQixJQUFJLENBQUMsV0FBVyxDQUFDLGNBQWMsRUFBRSxPQUFPLENBQUMsQ0FBQztTQUMzQztJQUNILENBQUM7SUFFRDs7O09BR0c7SUFDSyxVQUFVO1FBQ2hCLE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsYUFBYSxDQUFDO1FBRS9DLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFO1lBQ3BCLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQztTQUMxRDtRQUVELG9GQUFvRjtRQUNwRix3RkFBd0Y7UUFDeEYsdUZBQXVGO1FBQ3ZGLDBFQUEwRTtRQUMxRSxxRkFBcUY7UUFDckYsUUFBUSxJQUFJLENBQUMsWUFBWSxDQUFDLFNBQVMsRUFBRTtZQUNuQyxLQUFLLEtBQUssQ0FBQztZQUNYLEtBQUssUUFBUTtnQkFDWCxnREFBZ0Q7Z0JBQ2hELE1BQU0sYUFBYSxHQUFHLGlDQUFpQyxFQUFFLENBQUM7Z0JBQzFELCtFQUErRTtnQkFDL0UsMkVBQTJFO2dCQUMzRSx3RkFBd0Y7Z0JBQ3hGLCtFQUErRTtnQkFDL0Usb0VBQW9FO2dCQUNwRSxJQUFJLGFBQWEsS0FBSyxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxFQUFFO29CQUNqRSxPQUFPLENBQUMsS0FBSyxFQUFFLENBQUM7aUJBQ2pCO2dCQUNELE1BQU07WUFDUixLQUFLLElBQUksQ0FBQztZQUNWLEtBQUssZ0JBQWdCO2dCQUNuQixJQUFJLENBQUMsVUFBVSxDQUFDLDRCQUE0QixFQUFFLENBQUM7Z0JBQy9DLE1BQU07WUFDUixLQUFLLGVBQWU7Z0JBQ2xCLElBQUksQ0FBQyxtQkFBbUIsQ0FBQywwQ0FBMEMsQ0FBQyxDQUFDO2dCQUNyRSxNQUFNO1lBQ1I7Z0JBQ0UsSUFBSSxDQUFDLG1CQUFtQixDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsU0FBVSxDQUFDLENBQUM7Z0JBQ3ZELE1BQU07U0FDVDtJQUNILENBQUM7SUFFRCxtRkFBbUY7SUFDM0UsYUFBYTtRQUNuQixNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsMkJBQTJCLENBQUM7UUFFakQseUZBQXlGO1FBQ3pGLElBQUksSUFBSSxDQUFDLFlBQVksQ0FBQyxZQUFZLElBQUksT0FBTyxJQUFJLE9BQU8sT0FBTyxDQUFDLEtBQUssS0FBSyxVQUFVLEVBQUU7WUFDcEYsTUFBTSxhQUFhLEdBQUcsaUNBQWlDLEVBQUUsQ0FBQztZQUMxRCxNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLGFBQWEsQ0FBQztZQUUvQyx1RkFBdUY7WUFDdkYsNEZBQTRGO1lBQzVGLDZGQUE2RjtZQUM3RixlQUFlO1lBQ2YsSUFDRSxDQUFDLGFBQWE7Z0JBQ2QsYUFBYSxLQUFLLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSTtnQkFDckMsYUFBYSxLQUFLLE9BQU87Z0JBQ3pCLE9BQU8sQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLEVBQy9CO2dCQUNBLE9BQU8sQ0FBQyxLQUFLLEVBQUUsQ0FBQzthQUNqQjtTQUNGO1FBRUQsSUFBSSxJQUFJLENBQUMsVUFBVSxFQUFFO1lBQ25CLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxFQUFFLENBQUM7U0FDM0I7SUFDSCxDQUFDO0lBRUQsc0ZBQXNGO0lBQzlFLDZCQUE2QjtRQUNuQyxJQUFJLENBQUMsMkJBQTJCLEdBQUcsaUNBQWlDLEVBQUUsQ0FBQztRQUV2RSxtRUFBbUU7UUFDbkUsSUFBSSxJQUFJLENBQUMsV0FBVyxDQUFDLGFBQWEsQ0FBQyxLQUFLLEVBQUU7WUFDeEMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLEVBQUU7Z0JBQ2xDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxhQUFhLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQztZQUN2RSxDQUFDLENBQUMsQ0FBQztTQUNKO0lBQ0gsQ0FBQzs7a0lBblFVLGtCQUFrQix5TUEwRFAsUUFBUTtzSEExRG5CLGtCQUFrQixxY0FJbEIsZUFBZSxxRkM5RDVCLGtJQUdBLG9rQkQwQ2MsQ0FBQyxtQkFBbUIsQ0FBQyxXQUFXLENBQUM7MkZBYWxDLGtCQUFrQjtrQkF0QjlCLFNBQVM7K0JBQ0Usc0JBQXNCLG1CQU1mLHVCQUF1QixDQUFDLE9BQU8saUJBQ2pDLGlCQUFpQixDQUFDLElBQUksY0FDekIsQ0FBQyxtQkFBbUIsQ0FBQyxXQUFXLENBQUMsUUFDdkM7d0JBQ0osT0FBTyxFQUFFLHNCQUFzQjt3QkFDL0IsU0FBUyxFQUFFLGlCQUFpQjt3QkFDNUIsVUFBVSxFQUFFLElBQUk7d0JBQ2hCLE1BQU0sRUFBRSxRQUFRO3dCQUNoQixZQUFZLEVBQUUsTUFBTTt3QkFDcEIsbUJBQW1CLEVBQUUseUJBQXlCO3dCQUM5QyxVQUFVLEVBQUUsaUJBQWlCO3dCQUM3QixnQkFBZ0IsRUFBRSwyQkFBMkI7d0JBQzdDLGVBQWUsRUFBRSwwQkFBMEI7cUJBQzVDOzswQkE0REUsUUFBUTs7MEJBQUksTUFBTTsyQkFBQyxRQUFROzBFQXREZ0IsYUFBYTtzQkFBMUQsU0FBUzt1QkFBQyxlQUFlLEVBQUUsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQW5pbWF0aW9uRXZlbnQgfSBmcm9tICdAYW5ndWxhci9hbmltYXRpb25zJztcbmltcG9ydCB7IEZvY3VzVHJhcCwgRm9jdXNUcmFwRmFjdG9yeSwgSW50ZXJhY3Rpdml0eUNoZWNrZXIgfSBmcm9tICdAYW5ndWxhci9jZGsvYTExeSc7XG5pbXBvcnQgeyBjb2VyY2VBcnJheSwgY29lcmNlQ3NzUGl4ZWxWYWx1ZSB9IGZyb20gJ0Bhbmd1bGFyL2Nkay9jb2VyY2lvbic7XG5pbXBvcnQgeyBCcmVha3BvaW50T2JzZXJ2ZXIsIEJyZWFrcG9pbnRzIH0gZnJvbSAnQGFuZ3VsYXIvY2RrL2xheW91dCc7XG5pbXBvcnQgeyBfZ2V0Rm9jdXNlZEVsZW1lbnRQaWVyY2VTaGFkb3dEb20gfSBmcm9tICdAYW5ndWxhci9jZGsvcGxhdGZvcm0nO1xuaW1wb3J0IHtcbiAgQmFzZVBvcnRhbE91dGxldCxcbiAgQ2RrUG9ydGFsT3V0bGV0LFxuICBDb21wb25lbnRQb3J0YWwsXG4gIERvbVBvcnRhbCxcbiAgVGVtcGxhdGVQb3J0YWwsXG59IGZyb20gJ0Bhbmd1bGFyL2Nkay9wb3J0YWwnO1xuaW1wb3J0IHsgRE9DVU1FTlQgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHtcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIENoYW5nZURldGVjdG9yUmVmLFxuICBDb21wb25lbnQsXG4gIENvbXBvbmVudFJlZixcbiAgRWxlbWVudFJlZixcbiAgRW1iZWRkZWRWaWV3UmVmLFxuICBFdmVudEVtaXR0ZXIsXG4gIEluamVjdCxcbiAgTmdab25lLFxuICBPbkRlc3Ryb3ksXG4gIE9wdGlvbmFsLFxuICBWaWV3Q2hpbGQsXG4gIFZpZXdFbmNhcHN1bGF0aW9uLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFN1YnNjcmlwdGlvbiB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgbXR4RHJhd2VyQW5pbWF0aW9ucyB9IGZyb20gJy4vZHJhd2VyLWFuaW1hdGlvbic7XG5pbXBvcnQgeyBNdHhEcmF3ZXJDb25maWcgfSBmcm9tICcuL2RyYXdlci1jb25maWcnO1xuXG4vKipcbiAqIEludGVybmFsIGNvbXBvbmVudCB0aGF0IHdyYXBzIHVzZXItcHJvdmlkZWQgZHJhd2VyIGNvbnRlbnQuXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ210eC1kcmF3ZXItY29udGFpbmVyJyxcbiAgdGVtcGxhdGVVcmw6ICdkcmF3ZXItY29udGFpbmVyLmh0bWwnLFxuICBzdHlsZVVybHM6IFsnZHJhd2VyLWNvbnRhaW5lci5zY3NzJ10sXG4gIC8vIEluIEl2eSBlbWJlZGRlZCB2aWV3cyB3aWxsIGJlIGNoYW5nZSBkZXRlY3RlZCBmcm9tIHRoZWlyIGRlY2xhcmF0aW9uIHBsYWNlLCByYXRoZXIgdGhhbiB3aGVyZVxuICAvLyB0aGV5IHdlcmUgc3RhbXBlZCBvdXQuIFRoaXMgbWVhbnMgdGhhdCB3ZSBjYW4ndCBoYXZlIHRoZSBkcmF3ZXIgY29udGFpbmVyIGJlIE9uUHVzaCxcbiAgLy8gYmVjYXVzZSBpdCBtaWdodCBjYXVzZSB0aGUgc2hlZXRzIHRoYXQgd2VyZSBvcGVuZWQgZnJvbSBhIHRlbXBsYXRlIG5vdCB0byBiZSBvdXQgb2YgZGF0ZS5cbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5EZWZhdWx0LFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICBhbmltYXRpb25zOiBbbXR4RHJhd2VyQW5pbWF0aW9ucy5kcmF3ZXJTdGF0ZV0sXG4gIGhvc3Q6IHtcbiAgICAnY2xhc3MnOiAnbXR4LWRyYXdlci1jb250YWluZXInLFxuICAgICdbY2xhc3NdJzogJ19kcmF3ZXJQb3NpdGlvbicsXG4gICAgJ3RhYmluZGV4JzogJy0xJyxcbiAgICAncm9sZSc6ICdkaWFsb2cnLFxuICAgICdhcmlhLW1vZGFsJzogJ3RydWUnLFxuICAgICdbYXR0ci5hcmlhLWxhYmVsXSc6ICdkcmF3ZXJDb25maWc/LmFyaWFMYWJlbCcsXG4gICAgJ1tAc3RhdGVdJzogJ19hbmltYXRpb25TdGF0ZScsXG4gICAgJyhAc3RhdGUuc3RhcnQpJzogJ19vbkFuaW1hdGlvblN0YXJ0KCRldmVudCknLFxuICAgICcoQHN0YXRlLmRvbmUpJzogJ19vbkFuaW1hdGlvbkRvbmUoJGV2ZW50KScsXG4gIH0sXG59KVxuZXhwb3J0IGNsYXNzIE10eERyYXdlckNvbnRhaW5lciBleHRlbmRzIEJhc2VQb3J0YWxPdXRsZXQgaW1wbGVtZW50cyBPbkRlc3Ryb3kge1xuICBwcml2YXRlIF9icmVha3BvaW50U3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb247XG5cbiAgLyoqIFRoZSBwb3J0YWwgb3V0bGV0IGluc2lkZSBvZiB0aGlzIGNvbnRhaW5lciBpbnRvIHdoaWNoIHRoZSBjb250ZW50IHdpbGwgYmUgbG9hZGVkLiAqL1xuICBAVmlld0NoaWxkKENka1BvcnRhbE91dGxldCwgeyBzdGF0aWM6IHRydWUgfSkgX3BvcnRhbE91dGxldCE6IENka1BvcnRhbE91dGxldDtcblxuICAvKiogVGhlIHN0YXRlIG9mIHRoZSBkcmF3ZXIgYW5pbWF0aW9ucy4gKi9cbiAgX2FuaW1hdGlvblN0YXRlOiAndm9pZCcgfCAndmlzaWJsZScgfCAnaGlkZGVuJyA9ICd2b2lkJztcblxuICAvKiogRW1pdHMgd2hlbmV2ZXIgdGhlIHN0YXRlIG9mIHRoZSBhbmltYXRpb24gY2hhbmdlcy4gKi9cbiAgX2FuaW1hdGlvblN0YXRlQ2hhbmdlZCA9IG5ldyBFdmVudEVtaXR0ZXI8QW5pbWF0aW9uRXZlbnQ+KCk7XG5cbiAgLyoqIFRoZSBjbGFzcyB0aGF0IHRyYXBzIGFuZCBtYW5hZ2VzIGZvY3VzIHdpdGhpbiB0aGUgZHJhd2VyLiAqL1xuICBwcml2YXRlIF9mb2N1c1RyYXAhOiBGb2N1c1RyYXA7XG5cbiAgLyoqIEVsZW1lbnQgdGhhdCB3YXMgZm9jdXNlZCBiZWZvcmUgdGhlIGRyYXdlciB3YXMgb3BlbmVkLiAqL1xuICBwcml2YXRlIF9lbGVtZW50Rm9jdXNlZEJlZm9yZU9wZW5lZDogSFRNTEVsZW1lbnQgfCBudWxsID0gbnVsbDtcblxuICAvKiogU2VydmVyLXNpZGUgcmVuZGVyaW5nLWNvbXBhdGlibGUgcmVmZXJlbmNlIHRvIHRoZSBnbG9iYWwgZG9jdW1lbnQgb2JqZWN0LiAqL1xuICBwcml2YXRlIF9kb2N1bWVudDogRG9jdW1lbnQ7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGNvbXBvbmVudCBoYXMgYmVlbiBkZXN0cm95ZWQuICovXG4gIHByaXZhdGUgX2Rlc3Ryb3llZCE6IGJvb2xlYW47XG5cbiAgZ2V0IF9kcmF3ZXJQb3NpdGlvbigpIHtcbiAgICByZXR1cm4gYG10eC1kcmF3ZXItJHt0aGlzLmRyYXdlckNvbmZpZy5wb3NpdGlvbn1gO1xuICB9XG5cbiAgZ2V0IF9kcmF3ZXJXaWR0aCgpIHtcbiAgICByZXR1cm4gdGhpcy5kcmF3ZXJDb25maWcucG9zaXRpb24gPT09ICdsZWZ0JyB8fCB0aGlzLmRyYXdlckNvbmZpZy5wb3NpdGlvbiA9PT0gJ3JpZ2h0J1xuICAgICAgPyBjb2VyY2VDc3NQaXhlbFZhbHVlKHRoaXMuZHJhd2VyQ29uZmlnLndpZHRoKVxuICAgICAgOiAnMTAwdncnO1xuICB9XG5cbiAgZ2V0IF9kcmF3ZXJIZWlnaHQoKSB7XG4gICAgcmV0dXJuIHRoaXMuZHJhd2VyQ29uZmlnLnBvc2l0aW9uID09PSAndG9wJyB8fCB0aGlzLmRyYXdlckNvbmZpZy5wb3NpdGlvbiA9PT0gJ2JvdHRvbSdcbiAgICAgID8gY29lcmNlQ3NzUGl4ZWxWYWx1ZSh0aGlzLmRyYXdlckNvbmZpZy5oZWlnaHQpXG4gICAgICA6ICcxMDB2aCc7XG4gIH1cblxuICBfZ2V0RHJhd2VyU2l6ZSgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgd2lkdGg6IHRoaXMuX2RyYXdlcldpZHRoLFxuICAgICAgaGVpZ2h0OiB0aGlzLl9kcmF3ZXJIZWlnaHQsXG4gICAgICBtaW5XaWR0aDogY29lcmNlQ3NzUGl4ZWxWYWx1ZSh0aGlzLmRyYXdlckNvbmZpZy5taW5XaWR0aCksXG4gICAgICBtaW5IZWlnaHQ6IGNvZXJjZUNzc1BpeGVsVmFsdWUodGhpcy5kcmF3ZXJDb25maWcubWluSGVpZ2h0KSxcbiAgICAgIG1heFdpZHRoOiBjb2VyY2VDc3NQaXhlbFZhbHVlKHRoaXMuZHJhd2VyQ29uZmlnLm1heFdpZHRoKSxcbiAgICAgIG1heEhlaWdodDogY29lcmNlQ3NzUGl4ZWxWYWx1ZSh0aGlzLmRyYXdlckNvbmZpZy5tYXhIZWlnaHQpLFxuICAgIH07XG4gIH1cblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIF9lbGVtZW50UmVmOiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PixcbiAgICBwcml2YXRlIF9jaGFuZ2VEZXRlY3RvclJlZjogQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gICAgcHJpdmF0ZSBfZm9jdXNUcmFwRmFjdG9yeTogRm9jdXNUcmFwRmFjdG9yeSxcbiAgICBwcml2YXRlIHJlYWRvbmx5IF9pbnRlcmFjdGl2aXR5Q2hlY2tlcjogSW50ZXJhY3Rpdml0eUNoZWNrZXIsXG4gICAgcHJpdmF0ZSByZWFkb25seSBfbmdab25lOiBOZ1pvbmUsXG4gICAgYnJlYWtwb2ludE9ic2VydmVyOiBCcmVha3BvaW50T2JzZXJ2ZXIsXG4gICAgQE9wdGlvbmFsKCkgQEluamVjdChET0NVTUVOVCkgZG9jdW1lbnQ6IGFueSxcbiAgICAvKiogVGhlIGRyYXdlciBjb25maWd1cmF0aW9uLiAqL1xuICAgIHB1YmxpYyBkcmF3ZXJDb25maWc6IE10eERyYXdlckNvbmZpZ1xuICApIHtcbiAgICBzdXBlcigpO1xuXG4gICAgdGhpcy5fZG9jdW1lbnQgPSBkb2N1bWVudDtcbiAgICB0aGlzLl9icmVha3BvaW50U3Vic2NyaXB0aW9uID0gYnJlYWtwb2ludE9ic2VydmVyXG4gICAgICAub2JzZXJ2ZShbQnJlYWtwb2ludHMuTWVkaXVtLCBCcmVha3BvaW50cy5MYXJnZSwgQnJlYWtwb2ludHMuWExhcmdlXSlcbiAgICAgIC5zdWJzY3JpYmUoKCkgPT4ge30pO1xuICB9XG5cbiAgLyoqIEF0dGFjaCBhIGNvbXBvbmVudCBwb3J0YWwgYXMgY29udGVudCB0byB0aGlzIGRyYXdlciBjb250YWluZXIuICovXG4gIGF0dGFjaENvbXBvbmVudFBvcnRhbDxUPihwb3J0YWw6IENvbXBvbmVudFBvcnRhbDxUPik6IENvbXBvbmVudFJlZjxUPiB7XG4gICAgdGhpcy5fdmFsaWRhdGVQb3J0YWxBdHRhY2hlZCgpO1xuICAgIHRoaXMuX3NldFBhbmVsQ2xhc3MoKTtcbiAgICB0aGlzLl9zYXZlUHJldmlvdXNseUZvY3VzZWRFbGVtZW50KCk7XG4gICAgcmV0dXJuIHRoaXMuX3BvcnRhbE91dGxldC5hdHRhY2hDb21wb25lbnRQb3J0YWwocG9ydGFsKTtcbiAgfVxuXG4gIC8qKiBBdHRhY2ggYSB0ZW1wbGF0ZSBwb3J0YWwgYXMgY29udGVudCB0byB0aGlzIGRyYXdlciBjb250YWluZXIuICovXG4gIGF0dGFjaFRlbXBsYXRlUG9ydGFsPEM+KHBvcnRhbDogVGVtcGxhdGVQb3J0YWw8Qz4pOiBFbWJlZGRlZFZpZXdSZWY8Qz4ge1xuICAgIHRoaXMuX3ZhbGlkYXRlUG9ydGFsQXR0YWNoZWQoKTtcbiAgICB0aGlzLl9zZXRQYW5lbENsYXNzKCk7XG4gICAgdGhpcy5fc2F2ZVByZXZpb3VzbHlGb2N1c2VkRWxlbWVudCgpO1xuICAgIHJldHVybiB0aGlzLl9wb3J0YWxPdXRsZXQuYXR0YWNoVGVtcGxhdGVQb3J0YWwocG9ydGFsKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBdHRhY2hlcyBhIERPTSBwb3J0YWwgdG8gdGhlIGRyYXdlciBjb250YWluZXIuXG4gICAqIEBkZXByZWNhdGVkIFRvIGJlIHR1cm5lZCBpbnRvIGEgbWV0aG9kLlxuICAgKiBAYnJlYWtpbmctY2hhbmdlIDEwLjAuMFxuICAgKi9cbiAgb3ZlcnJpZGUgYXR0YWNoRG9tUG9ydGFsID0gKHBvcnRhbDogRG9tUG9ydGFsKSA9PiB7XG4gICAgdGhpcy5fdmFsaWRhdGVQb3J0YWxBdHRhY2hlZCgpO1xuICAgIHRoaXMuX3NldFBhbmVsQ2xhc3MoKTtcbiAgICB0aGlzLl9zYXZlUHJldmlvdXNseUZvY3VzZWRFbGVtZW50KCk7XG4gICAgcmV0dXJuIHRoaXMuX3BvcnRhbE91dGxldC5hdHRhY2hEb21Qb3J0YWwocG9ydGFsKTtcbiAgfTtcblxuICAvKiogQmVnaW4gYW5pbWF0aW9uIG9mIGRyYXdlciBlbnRyYW5jZSBpbnRvIHZpZXcuICovXG4gIGVudGVyKCk6IHZvaWQge1xuICAgIGlmICghdGhpcy5fZGVzdHJveWVkKSB7XG4gICAgICB0aGlzLl9hbmltYXRpb25TdGF0ZSA9ICd2aXNpYmxlJztcbiAgICAgIHRoaXMuX2NoYW5nZURldGVjdG9yUmVmLmRldGVjdENoYW5nZXMoKTtcbiAgICB9XG4gIH1cblxuICAvKiogQmVnaW4gYW5pbWF0aW9uIG9mIHRoZSBkcmF3ZXIgZXhpdGluZyBmcm9tIHZpZXcuICovXG4gIGV4aXQoKTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLl9kZXN0cm95ZWQpIHtcbiAgICAgIHRoaXMuX2FuaW1hdGlvblN0YXRlID0gJ2hpZGRlbic7XG4gICAgICB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKTtcbiAgICB9XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLl9icmVha3BvaW50U3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgdGhpcy5fZGVzdHJveWVkID0gdHJ1ZTtcbiAgfVxuXG4gIF9vbkFuaW1hdGlvbkRvbmUoZXZlbnQ6IEFuaW1hdGlvbkV2ZW50KSB7XG4gICAgaWYgKGV2ZW50LnRvU3RhdGUgPT09ICdoaWRkZW4nKSB7XG4gICAgICB0aGlzLl9yZXN0b3JlRm9jdXMoKTtcbiAgICB9IGVsc2UgaWYgKGV2ZW50LnRvU3RhdGUgPT09ICd2aXNpYmxlJykge1xuICAgICAgdGhpcy5fdHJhcEZvY3VzKCk7XG4gICAgfVxuXG4gICAgdGhpcy5fYW5pbWF0aW9uU3RhdGVDaGFuZ2VkLmVtaXQoZXZlbnQpO1xuICB9XG5cbiAgX29uQW5pbWF0aW9uU3RhcnQoZXZlbnQ6IEFuaW1hdGlvbkV2ZW50KSB7XG4gICAgdGhpcy5fYW5pbWF0aW9uU3RhdGVDaGFuZ2VkLmVtaXQoZXZlbnQpO1xuICB9XG5cbiAgcHJpdmF0ZSBfdG9nZ2xlQ2xhc3MoY3NzQ2xhc3M6IHN0cmluZywgYWRkOiBib29sZWFuKSB7XG4gICAgdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmNsYXNzTGlzdC50b2dnbGUoY3NzQ2xhc3MsIGFkZCk7XG4gIH1cblxuICBwcml2YXRlIF92YWxpZGF0ZVBvcnRhbEF0dGFjaGVkKCkge1xuICAgIGlmICh0aGlzLl9wb3J0YWxPdXRsZXQuaGFzQXR0YWNoZWQoKSkge1xuICAgICAgdGhyb3cgRXJyb3IoJ0F0dGVtcHRpbmcgdG8gYXR0YWNoIGRyYXdlciBjb250ZW50IGFmdGVyIGNvbnRlbnQgaXMgYWxyZWFkeSBhdHRhY2hlZCcpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgX3NldFBhbmVsQ2xhc3MoKSB7XG4gICAgY29uc3QgZWxlbWVudDogSFRNTEVsZW1lbnQgPSB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQ7XG4gICAgZWxlbWVudC5jbGFzc0xpc3QuYWRkKC4uLmNvZXJjZUFycmF5KHRoaXMuZHJhd2VyQ29uZmlnLnBhbmVsQ2xhc3MgfHwgW10pKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBGb2N1c2VzIHRoZSBwcm92aWRlZCBlbGVtZW50LiBJZiB0aGUgZWxlbWVudCBpcyBub3QgZm9jdXNhYmxlLCBpdCB3aWxsIGFkZCBhIHRhYkluZGV4XG4gICAqIGF0dHJpYnV0ZSB0byBmb3JjZWZ1bGx5IGZvY3VzIGl0LiBUaGUgYXR0cmlidXRlIGlzIHJlbW92ZWQgYWZ0ZXIgZm9jdXMgaXMgbW92ZWQuXG4gICAqIEBwYXJhbSBlbGVtZW50IFRoZSBlbGVtZW50IHRvIGZvY3VzLlxuICAgKi9cbiAgcHJpdmF0ZSBfZm9yY2VGb2N1cyhlbGVtZW50OiBIVE1MRWxlbWVudCwgb3B0aW9ucz86IEZvY3VzT3B0aW9ucykge1xuICAgIGlmICghdGhpcy5faW50ZXJhY3Rpdml0eUNoZWNrZXIuaXNGb2N1c2FibGUoZWxlbWVudCkpIHtcbiAgICAgIGVsZW1lbnQudGFiSW5kZXggPSAtMTtcbiAgICAgIC8vIFRoZSB0YWJpbmRleCBhdHRyaWJ1dGUgc2hvdWxkIGJlIHJlbW92ZWQgdG8gYXZvaWQgbmF2aWdhdGluZyB0byB0aGF0IGVsZW1lbnQgYWdhaW5cbiAgICAgIHRoaXMuX25nWm9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB7XG4gICAgICAgIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignYmx1cicsICgpID0+IGVsZW1lbnQucmVtb3ZlQXR0cmlidXRlKCd0YWJpbmRleCcpKTtcbiAgICAgICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCAoKSA9PiBlbGVtZW50LnJlbW92ZUF0dHJpYnV0ZSgndGFiaW5kZXgnKSk7XG4gICAgICB9KTtcbiAgICB9XG4gICAgZWxlbWVudC5mb2N1cyhvcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBGb2N1c2VzIHRoZSBmaXJzdCBlbGVtZW50IHRoYXQgbWF0Y2hlcyB0aGUgZ2l2ZW4gc2VsZWN0b3Igd2l0aGluIHRoZSBmb2N1cyB0cmFwLlxuICAgKiBAcGFyYW0gc2VsZWN0b3IgVGhlIENTUyBzZWxlY3RvciBmb3IgdGhlIGVsZW1lbnQgdG8gc2V0IGZvY3VzIHRvLlxuICAgKi9cbiAgcHJpdmF0ZSBfZm9jdXNCeUNzc1NlbGVjdG9yKHNlbGVjdG9yOiBzdHJpbmcsIG9wdGlvbnM/OiBGb2N1c09wdGlvbnMpIHtcbiAgICBjb25zdCBlbGVtZW50VG9Gb2N1cyA9IHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5xdWVyeVNlbGVjdG9yKFxuICAgICAgc2VsZWN0b3JcbiAgICApIGFzIEhUTUxFbGVtZW50IHwgbnVsbDtcbiAgICBpZiAoZWxlbWVudFRvRm9jdXMpIHtcbiAgICAgIHRoaXMuX2ZvcmNlRm9jdXMoZWxlbWVudFRvRm9jdXMsIG9wdGlvbnMpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBNb3ZlcyB0aGUgZm9jdXMgaW5zaWRlIHRoZSBmb2N1cyB0cmFwLiBXaGVuIGF1dG9Gb2N1cyBpcyBub3Qgc2V0IHRvICdib3R0b20tc2hlZXQnLFxuICAgKiBpZiBmb2N1cyBjYW5ub3QgYmUgbW92ZWQgdGhlbiBmb2N1cyB3aWxsIGdvIHRvIHRoZSBkcmF3ZXIgY29udGFpbmVyLlxuICAgKi9cbiAgcHJpdmF0ZSBfdHJhcEZvY3VzKCkge1xuICAgIGNvbnN0IGVsZW1lbnQgPSB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQ7XG5cbiAgICBpZiAoIXRoaXMuX2ZvY3VzVHJhcCkge1xuICAgICAgdGhpcy5fZm9jdXNUcmFwID0gdGhpcy5fZm9jdXNUcmFwRmFjdG9yeS5jcmVhdGUoZWxlbWVudCk7XG4gICAgfVxuXG4gICAgLy8gSWYgd2VyZSB0byBhdHRlbXB0IHRvIGZvY3VzIGltbWVkaWF0ZWx5LCB0aGVuIHRoZSBjb250ZW50IG9mIHRoZSBkcmF3ZXIgd291bGQgbm90XG4gICAgLy8geWV0IGJlIHJlYWR5IGluIGluc3RhbmNlcyB3aGVyZSBjaGFuZ2UgZGV0ZWN0aW9uIGhhcyB0byBydW4gZmlyc3QuIFRvIGRlYWwgd2l0aCB0aGlzLFxuICAgIC8vIHdlIHNpbXBseSB3YWl0IGZvciB0aGUgbWljcm90YXNrIHF1ZXVlIHRvIGJlIGVtcHR5IHdoZW4gc2V0dGluZyBmb2N1cyB3aGVuIGF1dG9Gb2N1c1xuICAgIC8vIGlzbid0IHNldCB0byBkcmF3ZXIuIElmIHRoZSBlbGVtZW50IGluc2lkZSB0aGUgZHJhd2VyIGNhbid0IGJlIGZvY3VzZWQsXG4gICAgLy8gdGhlbiB0aGUgY29udGFpbmVyIGlzIGZvY3VzZWQgc28gdGhlIHVzZXIgY2FuJ3QgdGFiIGludG8gb3RoZXIgZWxlbWVudHMgYmVoaW5kIGl0LlxuICAgIHN3aXRjaCAodGhpcy5kcmF3ZXJDb25maWcuYXV0b0ZvY3VzKSB7XG4gICAgICBjYXNlIGZhbHNlOlxuICAgICAgY2FzZSAnZGlhbG9nJzpcbiAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNhc2UtZGVjbGFyYXRpb25zXG4gICAgICAgIGNvbnN0IGFjdGl2ZUVsZW1lbnQgPSBfZ2V0Rm9jdXNlZEVsZW1lbnRQaWVyY2VTaGFkb3dEb20oKTtcbiAgICAgICAgLy8gRW5zdXJlIHRoYXQgZm9jdXMgaXMgb24gdGhlIGRyYXdlciBjb250YWluZXIuIEl0J3MgcG9zc2libGUgdGhhdCBhIGRpZmZlcmVudFxuICAgICAgICAvLyBjb21wb25lbnQgdHJpZWQgdG8gbW92ZSBmb2N1cyB3aGlsZSB0aGUgb3BlbiBhbmltYXRpb24gd2FzIHJ1bm5pbmcuIFNlZTpcbiAgICAgICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvY29tcG9uZW50cy9pc3N1ZXMvMTYyMTUuIE5vdGUgdGhhdCB3ZSBvbmx5IHdhbnQgdG8gZG8gdGhpc1xuICAgICAgICAvLyBpZiB0aGUgZm9jdXMgaXNuJ3QgaW5zaWRlIHRoZSBkcmF3ZXIgYWxyZWFkeSwgYmVjYXVzZSBpdCdzIHBvc3NpYmxlIHRoYXQgdGhlXG4gICAgICAgIC8vIGNvbnN1bWVyIHNwZWNpZmllZCBgYXV0b0ZvY3VzYCBpbiBvcmRlciB0byBtb3ZlIGZvY3VzIHRoZW1zZWx2ZXMuXG4gICAgICAgIGlmIChhY3RpdmVFbGVtZW50ICE9PSBlbGVtZW50ICYmICFlbGVtZW50LmNvbnRhaW5zKGFjdGl2ZUVsZW1lbnQpKSB7XG4gICAgICAgICAgZWxlbWVudC5mb2N1cygpO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSB0cnVlOlxuICAgICAgY2FzZSAnZmlyc3QtdGFiYmFibGUnOlxuICAgICAgICB0aGlzLl9mb2N1c1RyYXAuZm9jdXNJbml0aWFsRWxlbWVudFdoZW5SZWFkeSgpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2ZpcnN0LWhlYWRpbmcnOlxuICAgICAgICB0aGlzLl9mb2N1c0J5Q3NzU2VsZWN0b3IoJ2gxLCBoMiwgaDMsIGg0LCBoNSwgaDYsIFtyb2xlPVwiaGVhZGluZ1wiXScpO1xuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHRoaXMuX2ZvY3VzQnlDc3NTZWxlY3Rvcih0aGlzLmRyYXdlckNvbmZpZy5hdXRvRm9jdXMhKTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgLyoqIFJlc3RvcmVzIGZvY3VzIHRvIHRoZSBlbGVtZW50IHRoYXQgd2FzIGZvY3VzZWQgYmVmb3JlIHRoZSBkcmF3ZXIgd2FzIG9wZW5lZC4gKi9cbiAgcHJpdmF0ZSBfcmVzdG9yZUZvY3VzKCkge1xuICAgIGNvbnN0IHRvRm9jdXMgPSB0aGlzLl9lbGVtZW50Rm9jdXNlZEJlZm9yZU9wZW5lZDtcblxuICAgIC8vIFdlIG5lZWQgdGhlIGV4dHJhIGNoZWNrLCBiZWNhdXNlIElFIGNhbiBzZXQgdGhlIGBhY3RpdmVFbGVtZW50YCB0byBudWxsIGluIHNvbWUgY2FzZXMuXG4gICAgaWYgKHRoaXMuZHJhd2VyQ29uZmlnLnJlc3RvcmVGb2N1cyAmJiB0b0ZvY3VzICYmIHR5cGVvZiB0b0ZvY3VzLmZvY3VzID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBjb25zdCBhY3RpdmVFbGVtZW50ID0gX2dldEZvY3VzZWRFbGVtZW50UGllcmNlU2hhZG93RG9tKCk7XG4gICAgICBjb25zdCBlbGVtZW50ID0gdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50O1xuXG4gICAgICAvLyBNYWtlIHN1cmUgdGhhdCBmb2N1cyBpcyBzdGlsbCBpbnNpZGUgdGhlIGRyYXdlciBvciBpcyBvbiB0aGUgYm9keSAodXN1YWxseSBiZWNhdXNlIGFcbiAgICAgIC8vIG5vbi1mb2N1c2FibGUgZWxlbWVudCBsaWtlIHRoZSBiYWNrZHJvcCB3YXMgY2xpY2tlZCkgYmVmb3JlIG1vdmluZyBpdC4gSXQncyBwb3NzaWJsZSB0aGF0XG4gICAgICAvLyB0aGUgY29uc3VtZXIgbW92ZWQgaXQgdGhlbXNlbHZlcyBiZWZvcmUgdGhlIGFuaW1hdGlvbiB3YXMgZG9uZSwgaW4gd2hpY2ggY2FzZSB3ZSBzaG91bGRuJ3RcbiAgICAgIC8vIGRvIGFueXRoaW5nLlxuICAgICAgaWYgKFxuICAgICAgICAhYWN0aXZlRWxlbWVudCB8fFxuICAgICAgICBhY3RpdmVFbGVtZW50ID09PSB0aGlzLl9kb2N1bWVudC5ib2R5IHx8XG4gICAgICAgIGFjdGl2ZUVsZW1lbnQgPT09IGVsZW1lbnQgfHxcbiAgICAgICAgZWxlbWVudC5jb250YWlucyhhY3RpdmVFbGVtZW50KVxuICAgICAgKSB7XG4gICAgICAgIHRvRm9jdXMuZm9jdXMoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAodGhpcy5fZm9jdXNUcmFwKSB7XG4gICAgICB0aGlzLl9mb2N1c1RyYXAuZGVzdHJveSgpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBTYXZlcyBhIHJlZmVyZW5jZSB0byB0aGUgZWxlbWVudCB0aGF0IHdhcyBmb2N1c2VkIGJlZm9yZSB0aGUgZHJhd2VyIHdhcyBvcGVuZWQuICovXG4gIHByaXZhdGUgX3NhdmVQcmV2aW91c2x5Rm9jdXNlZEVsZW1lbnQoKSB7XG4gICAgdGhpcy5fZWxlbWVudEZvY3VzZWRCZWZvcmVPcGVuZWQgPSBfZ2V0Rm9jdXNlZEVsZW1lbnRQaWVyY2VTaGFkb3dEb20oKTtcblxuICAgIC8vIFRoZSBgZm9jdXNgIG1ldGhvZCBpc24ndCBhdmFpbGFibGUgZHVyaW5nIHNlcnZlci1zaWRlIHJlbmRlcmluZy5cbiAgICBpZiAodGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmZvY3VzKSB7XG4gICAgICB0aGlzLl9uZ1pvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xuICAgICAgICBQcm9taXNlLnJlc29sdmUoKS50aGVuKCgpID0+IHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5mb2N1cygpKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxufVxuIiwiPGRpdiBjbGFzcz1cIm10eC1kcmF3ZXItY29udGVudC13cmFwcGVyXCIgW3N0eWxlXT1cIl9nZXREcmF3ZXJTaXplKClcIj5cbiAgPG5nLXRlbXBsYXRlIGNka1BvcnRhbE91dGxldD48L25nLXRlbXBsYXRlPlxuPC9kaXY+XG4iXX0=