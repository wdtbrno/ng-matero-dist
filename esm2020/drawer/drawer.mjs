import { Directionality } from '@angular/cdk/bidi';
import { OverlayConfig } from '@angular/cdk/overlay';
import { ComponentPortal, TemplatePortal } from '@angular/cdk/portal';
import { Injectable, Injector, Optional, SkipSelf, TemplateRef, InjectionToken, Inject, InjectFlags, } from '@angular/core';
import { of as observableOf } from 'rxjs';
import { MtxDrawerConfig } from './drawer-config';
import { MtxDrawerContainer } from './drawer-container';
import { MtxDrawerRef } from './drawer-ref';
import * as i0 from "@angular/core";
import * as i1 from "@angular/cdk/overlay";
import * as i2 from "./drawer-config";
/** Injection token that can be used to access the data that was passed in to a drawer. */
export const MTX_DRAWER_DATA = new InjectionToken('MtxDrawerData');
/** Injection token that can be used to specify default drawer options. */
export const MTX_DRAWER_DEFAULT_OPTIONS = new InjectionToken('mtx-drawer-default-options');
/**
 * Service to trigger Material Design bottom sheets.
 */
export class MtxDrawer {
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
                useValue: { value: config.direction, change: observableOf() },
            });
        }
        return Injector.create({ parent: userInjector || this._injector, providers });
    }
}
/** @nocollapse */ MtxDrawer.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MtxDrawer, deps: [{ token: i1.Overlay }, { token: i0.Injector }, { token: MtxDrawer, optional: true, skipSelf: true }, { token: MTX_DRAWER_DEFAULT_OPTIONS, optional: true }], target: i0.ɵɵFactoryTarget.Injectable });
/** @nocollapse */ MtxDrawer.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MtxDrawer });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MtxDrawer, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i1.Overlay }, { type: i0.Injector }, { type: MtxDrawer, decorators: [{
                    type: Optional
                }, {
                    type: SkipSelf
                }] }, { type: i2.MtxDrawerConfig, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [MTX_DRAWER_DEFAULT_OPTIONS]
                }] }]; } });
/**
 * Applies default options to the drawer config.
 * @param defaults Object containing the default values to which to fall back.
 * @param config The configuration to which the defaults will be applied.
 * @returns The new configuration object with defaults applied.
 */
function _applyConfigDefaults(defaults, config) {
    return { ...defaults, ...config };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHJhd2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vcHJvamVjdHMvZXh0ZW5zaW9ucy9kcmF3ZXIvZHJhd2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQztBQUNuRCxPQUFPLEVBQVcsYUFBYSxFQUFjLE1BQU0sc0JBQXNCLENBQUM7QUFDMUUsT0FBTyxFQUFFLGVBQWUsRUFBaUIsY0FBYyxFQUFFLE1BQU0scUJBQXFCLENBQUM7QUFDckYsT0FBTyxFQUVMLFVBQVUsRUFDVixRQUFRLEVBQ1IsUUFBUSxFQUNSLFFBQVEsRUFDUixXQUFXLEVBQ1gsY0FBYyxFQUNkLE1BQU0sRUFHTixXQUFXLEdBQ1osTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFFLEVBQUUsSUFBSSxZQUFZLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDMUMsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQ2xELE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLG9CQUFvQixDQUFDO0FBQ3hELE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxjQUFjLENBQUM7Ozs7QUFFNUMsMEZBQTBGO0FBQzFGLE1BQU0sQ0FBQyxNQUFNLGVBQWUsR0FBRyxJQUFJLGNBQWMsQ0FBTSxlQUFlLENBQUMsQ0FBQztBQUV4RSwwRUFBMEU7QUFDMUUsTUFBTSxDQUFDLE1BQU0sMEJBQTBCLEdBQUcsSUFBSSxjQUFjLENBQzFELDRCQUE0QixDQUM3QixDQUFDO0FBRUY7O0dBRUc7QUFFSCxNQUFNLE9BQU8sU0FBUztJQUdwQixnREFBZ0Q7SUFDaEQsSUFBSSxnQkFBZ0I7UUFDbEIsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQztRQUNsQyxPQUFPLE1BQU0sQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMscUJB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QVU7OzBCQXFCTixRQUFROzswQkFBSSxRQUFROzswQkFDcEIsUUFBUTs7MEJBQ1IsTUFBTTsyQkFBQywwQkFBMEI7O0FBOEp0Qzs7Ozs7R0FLRztBQUNILFNBQVMsb0JBQW9CLENBQzNCLFFBQXlCLEVBQ3pCLE1BQXdCO0lBRXhCLE9BQU8sRUFBRSxHQUFHLFFBQVEsRUFBRSxHQUFHLE1BQU0sRUFBRSxDQUFDO0FBQ3BDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBEaXJlY3Rpb25hbGl0eSB9IGZyb20gJ0Bhbmd1bGFyL2Nkay9iaWRpJztcbmltcG9ydCB7IE92ZXJsYXksIE92ZXJsYXlDb25maWcsIE92ZXJsYXlSZWYgfSBmcm9tICdAYW5ndWxhci9jZGsvb3ZlcmxheSc7XG5pbXBvcnQgeyBDb21wb25lbnRQb3J0YWwsIENvbXBvbmVudFR5cGUsIFRlbXBsYXRlUG9ydGFsIH0gZnJvbSAnQGFuZ3VsYXIvY2RrL3BvcnRhbCc7XG5pbXBvcnQge1xuICBDb21wb25lbnRSZWYsXG4gIEluamVjdGFibGUsXG4gIEluamVjdG9yLFxuICBPcHRpb25hbCxcbiAgU2tpcFNlbGYsXG4gIFRlbXBsYXRlUmVmLFxuICBJbmplY3Rpb25Ub2tlbixcbiAgSW5qZWN0LFxuICBPbkRlc3Ryb3ksXG4gIFN0YXRpY1Byb3ZpZGVyLFxuICBJbmplY3RGbGFncyxcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBvZiBhcyBvYnNlcnZhYmxlT2YgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IE10eERyYXdlckNvbmZpZyB9IGZyb20gJy4vZHJhd2VyLWNvbmZpZyc7XG5pbXBvcnQgeyBNdHhEcmF3ZXJDb250YWluZXIgfSBmcm9tICcuL2RyYXdlci1jb250YWluZXInO1xuaW1wb3J0IHsgTXR4RHJhd2VyUmVmIH0gZnJvbSAnLi9kcmF3ZXItcmVmJztcblxuLyoqIEluamVjdGlvbiB0b2tlbiB0aGF0IGNhbiBiZSB1c2VkIHRvIGFjY2VzcyB0aGUgZGF0YSB0aGF0IHdhcyBwYXNzZWQgaW4gdG8gYSBkcmF3ZXIuICovXG5leHBvcnQgY29uc3QgTVRYX0RSQVdFUl9EQVRBID0gbmV3IEluamVjdGlvblRva2VuPGFueT4oJ010eERyYXdlckRhdGEnKTtcblxuLyoqIEluamVjdGlvbiB0b2tlbiB0aGF0IGNhbiBiZSB1c2VkIHRvIHNwZWNpZnkgZGVmYXVsdCBkcmF3ZXIgb3B0aW9ucy4gKi9cbmV4cG9ydCBjb25zdCBNVFhfRFJBV0VSX0RFRkFVTFRfT1BUSU9OUyA9IG5ldyBJbmplY3Rpb25Ub2tlbjxNdHhEcmF3ZXJDb25maWc+KFxuICAnbXR4LWRyYXdlci1kZWZhdWx0LW9wdGlvbnMnXG4pO1xuXG4vKipcbiAqIFNlcnZpY2UgdG8gdHJpZ2dlciBNYXRlcmlhbCBEZXNpZ24gYm90dG9tIHNoZWV0cy5cbiAqL1xuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIE10eERyYXdlciBpbXBsZW1lbnRzIE9uRGVzdHJveSB7XG4gIHByaXZhdGUgX2RyYXdlclJlZkF0VGhpc0xldmVsOiBNdHhEcmF3ZXJSZWY8YW55PiB8IG51bGwgPSBudWxsO1xuXG4gIC8qKiBSZWZlcmVuY2UgdG8gdGhlIGN1cnJlbnRseSBvcGVuZWQgZHJhd2VyLiAqL1xuICBnZXQgX29wZW5lZERyYXdlclJlZigpOiBNdHhEcmF3ZXJSZWY8YW55PiB8IG51bGwge1xuICAgIGNvbnN0IHBhcmVudCA9IHRoaXMuX3BhcmVudERyYXdlcjtcbiAgICByZXR1cm4gcGFyZW50ID8gcGFyZW50Ll9vcGVuZWREcmF3ZXJSZWYgOiB0aGlzLl9kcmF3ZXJSZWZBdFRoaXNMZXZlbDtcbiAgfVxuXG4gIHNldCBfb3BlbmVkRHJhd2VyUmVmKHZhbHVlOiBNdHhEcmF3ZXJSZWY8YW55PiB8IG51bGwpIHtcbiAgICBpZiAodGhpcy5fcGFyZW50RHJhd2VyKSB7XG4gICAgICB0aGlzLl9wYXJlbnREcmF3ZXIuX29wZW5lZERyYXdlclJlZiA9IHZhbHVlO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9kcmF3ZXJSZWZBdFRoaXNMZXZlbCA9IHZhbHVlO1xuICAgIH1cbiAgfVxuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgX292ZXJsYXk6IE92ZXJsYXksXG4gICAgcHJpdmF0ZSBfaW5qZWN0b3I6IEluamVjdG9yLFxuICAgIEBPcHRpb25hbCgpIEBTa2lwU2VsZigpIHByaXZhdGUgX3BhcmVudERyYXdlcjogTXR4RHJhd2VyLFxuICAgIEBPcHRpb25hbCgpXG4gICAgQEluamVjdChNVFhfRFJBV0VSX0RFRkFVTFRfT1BUSU9OUylcbiAgICBwcml2YXRlIF9kZWZhdWx0T3B0aW9ucz86IE10eERyYXdlckNvbmZpZ1xuICApIHt9XG5cbiAgLyoqXG4gICAqIE9wZW5zIGEgZHJhd2VyIGNvbnRhaW5pbmcgdGhlIGdpdmVuIGNvbXBvbmVudC5cbiAgICogQHBhcmFtIGNvbXBvbmVudCBUeXBlIG9mIHRoZSBjb21wb25lbnQgdG8gbG9hZCBpbnRvIHRoZSBkcmF3ZXIuXG4gICAqIEBwYXJhbSBjb25maWcgRXh0cmEgY29uZmlndXJhdGlvbiBvcHRpb25zLlxuICAgKiBAcmV0dXJucyBSZWZlcmVuY2UgdG8gdGhlIG5ld2x5LW9wZW5lZCBkcmF3ZXIuXG4gICAqL1xuICBvcGVuPFQsIEQgPSBhbnksIFIgPSBhbnk+KFxuICAgIGNvbXBvbmVudDogQ29tcG9uZW50VHlwZTxUPixcbiAgICBjb25maWc/OiBNdHhEcmF3ZXJDb25maWc8RD5cbiAgKTogTXR4RHJhd2VyUmVmPFQsIFI+O1xuXG4gIC8qKlxuICAgKiBPcGVucyBhIGRyYXdlciBjb250YWluaW5nIHRoZSBnaXZlbiB0ZW1wbGF0ZS5cbiAgICogQHBhcmFtIHRlbXBsYXRlIFRlbXBsYXRlUmVmIHRvIGluc3RhbnRpYXRlIGFzIHRoZSBkcmF3ZXIgY29udGVudC5cbiAgICogQHBhcmFtIGNvbmZpZyBFeHRyYSBjb25maWd1cmF0aW9uIG9wdGlvbnMuXG4gICAqIEByZXR1cm5zIFJlZmVyZW5jZSB0byB0aGUgbmV3bHktb3BlbmVkIGRyYXdlci5cbiAgICovXG4gIG9wZW48VCwgRCA9IGFueSwgUiA9IGFueT4oXG4gICAgdGVtcGxhdGU6IFRlbXBsYXRlUmVmPFQ+LFxuICAgIGNvbmZpZz86IE10eERyYXdlckNvbmZpZzxEPlxuICApOiBNdHhEcmF3ZXJSZWY8VCwgUj47XG5cbiAgb3BlbjxULCBEID0gYW55LCBSID0gYW55PihcbiAgICBjb21wb25lbnRPclRlbXBsYXRlUmVmOiBDb21wb25lbnRUeXBlPFQ+IHwgVGVtcGxhdGVSZWY8VD4sXG4gICAgY29uZmlnPzogTXR4RHJhd2VyQ29uZmlnPEQ+XG4gICk6IE10eERyYXdlclJlZjxULCBSPiB7XG4gICAgY29uc3QgX2NvbmZpZyA9IF9hcHBseUNvbmZpZ0RlZmF1bHRzKHRoaXMuX2RlZmF1bHRPcHRpb25zIHx8IG5ldyBNdHhEcmF3ZXJDb25maWcoKSwgY29uZmlnKTtcbiAgICBjb25zdCBvdmVybGF5UmVmID0gdGhpcy5fY3JlYXRlT3ZlcmxheShfY29uZmlnKTtcbiAgICBjb25zdCBjb250YWluZXIgPSB0aGlzLl9hdHRhY2hDb250YWluZXIob3ZlcmxheVJlZiwgX2NvbmZpZyk7XG4gICAgY29uc3QgcmVmID0gbmV3IE10eERyYXdlclJlZjxULCBSPihjb250YWluZXIsIG92ZXJsYXlSZWYpO1xuXG4gICAgaWYgKGNvbXBvbmVudE9yVGVtcGxhdGVSZWYgaW5zdGFuY2VvZiBUZW1wbGF0ZVJlZikge1xuICAgICAgY29udGFpbmVyLmF0dGFjaFRlbXBsYXRlUG9ydGFsKFxuICAgICAgICBuZXcgVGVtcGxhdGVQb3J0YWw8VD4oY29tcG9uZW50T3JUZW1wbGF0ZVJlZiwgbnVsbCEsIHtcbiAgICAgICAgICAkaW1wbGljaXQ6IF9jb25maWcuZGF0YSxcbiAgICAgICAgICBkcmF3ZXJSZWY6IHJlZixcbiAgICAgICAgfSBhcyBhbnkpXG4gICAgICApO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBwb3J0YWwgPSBuZXcgQ29tcG9uZW50UG9ydGFsKFxuICAgICAgICBjb21wb25lbnRPclRlbXBsYXRlUmVmLFxuICAgICAgICB1bmRlZmluZWQsXG4gICAgICAgIHRoaXMuX2NyZWF0ZUluamVjdG9yKF9jb25maWcsIHJlZilcbiAgICAgICk7XG4gICAgICBjb25zdCBjb250ZW50UmVmID0gY29udGFpbmVyLmF0dGFjaENvbXBvbmVudFBvcnRhbChwb3J0YWwpO1xuICAgICAgcmVmLmluc3RhbmNlID0gY29udGVudFJlZi5pbnN0YW5jZTtcbiAgICB9XG5cbiAgICAvLyBXaGVuIHRoZSBkcmF3ZXIgaXMgZGlzbWlzc2VkLCBjbGVhciB0aGUgcmVmZXJlbmNlIHRvIGl0LlxuICAgIHJlZi5hZnRlckRpc21pc3NlZCgpLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAvLyBDbGVhciB0aGUgZHJhd2VyIHJlZiBpZiBpdCBoYXNuJ3QgYWxyZWFkeSBiZWVuIHJlcGxhY2VkIGJ5IGEgbmV3ZXIgb25lLlxuICAgICAgaWYgKHRoaXMuX29wZW5lZERyYXdlclJlZiA9PSByZWYpIHtcbiAgICAgICAgdGhpcy5fb3BlbmVkRHJhd2VyUmVmID0gbnVsbDtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGlmICh0aGlzLl9vcGVuZWREcmF3ZXJSZWYpIHtcbiAgICAgIC8vIElmIGEgZHJhd2VyIGlzIGFscmVhZHkgaW4gdmlldywgZGlzbWlzcyBpdCBhbmQgZW50ZXIgdGhlXG4gICAgICAvLyBuZXcgZHJhd2VyIGFmdGVyIGV4aXQgYW5pbWF0aW9uIGlzIGNvbXBsZXRlLlxuICAgICAgdGhpcy5fb3BlbmVkRHJhd2VyUmVmLmFmdGVyRGlzbWlzc2VkKCkuc3Vic2NyaWJlKCgpID0+IHJlZi5jb250YWluZXJJbnN0YW5jZS5lbnRlcigpKTtcbiAgICAgIHRoaXMuX29wZW5lZERyYXdlclJlZi5kaXNtaXNzKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIElmIG5vIGRyYXdlciBpcyBpbiB2aWV3LCBlbnRlciB0aGUgbmV3IGRyYXdlci5cbiAgICAgIHJlZi5jb250YWluZXJJbnN0YW5jZS5lbnRlcigpO1xuICAgIH1cblxuICAgIHRoaXMuX29wZW5lZERyYXdlclJlZiA9IHJlZjtcblxuICAgIHJldHVybiByZWY7XG4gIH1cblxuICAvKipcbiAgICogRGlzbWlzc2VzIHRoZSBjdXJyZW50bHktdmlzaWJsZSBkcmF3ZXIuXG4gICAqIEBwYXJhbSByZXN1bHQgRGF0YSB0byBwYXNzIHRvIHRoZSBkcmF3ZXIgaW5zdGFuY2UuXG4gICAqL1xuICBkaXNtaXNzPFIgPSBhbnk+KHJlc3VsdD86IFIpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5fb3BlbmVkRHJhd2VyUmVmKSB7XG4gICAgICB0aGlzLl9vcGVuZWREcmF3ZXJSZWYuZGlzbWlzcyhyZXN1bHQpO1xuICAgIH1cbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIGlmICh0aGlzLl9kcmF3ZXJSZWZBdFRoaXNMZXZlbCkge1xuICAgICAgdGhpcy5fZHJhd2VyUmVmQXRUaGlzTGV2ZWwuZGlzbWlzcygpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBBdHRhY2hlcyB0aGUgZHJhd2VyIGNvbnRhaW5lciBjb21wb25lbnQgdG8gdGhlIG92ZXJsYXkuXG4gICAqL1xuICBwcml2YXRlIF9hdHRhY2hDb250YWluZXIob3ZlcmxheVJlZjogT3ZlcmxheVJlZiwgY29uZmlnOiBNdHhEcmF3ZXJDb25maWcpOiBNdHhEcmF3ZXJDb250YWluZXIge1xuICAgIGNvbnN0IHVzZXJJbmplY3RvciA9IGNvbmZpZyAmJiBjb25maWcudmlld0NvbnRhaW5lclJlZiAmJiBjb25maWcudmlld0NvbnRhaW5lclJlZi5pbmplY3RvcjtcbiAgICBjb25zdCBpbmplY3RvciA9IEluamVjdG9yLmNyZWF0ZSh7XG4gICAgICBwYXJlbnQ6IHVzZXJJbmplY3RvciB8fCB0aGlzLl9pbmplY3RvcixcbiAgICAgIHByb3ZpZGVyczogW3sgcHJvdmlkZTogTXR4RHJhd2VyQ29uZmlnLCB1c2VWYWx1ZTogY29uZmlnIH1dLFxuICAgIH0pO1xuXG4gICAgY29uc3QgY29udGFpbmVyUG9ydGFsID0gbmV3IENvbXBvbmVudFBvcnRhbChcbiAgICAgIE10eERyYXdlckNvbnRhaW5lcixcbiAgICAgIGNvbmZpZy52aWV3Q29udGFpbmVyUmVmLFxuICAgICAgaW5qZWN0b3JcbiAgICApO1xuICAgIGNvbnN0IGNvbnRhaW5lclJlZjogQ29tcG9uZW50UmVmPE10eERyYXdlckNvbnRhaW5lcj4gPSBvdmVybGF5UmVmLmF0dGFjaChjb250YWluZXJQb3J0YWwpO1xuICAgIHJldHVybiBjb250YWluZXJSZWYuaW5zdGFuY2U7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlcyBhIG5ldyBvdmVybGF5IGFuZCBwbGFjZXMgaXQgaW4gdGhlIGNvcnJlY3QgbG9jYXRpb24uXG4gICAqIEBwYXJhbSBjb25maWcgVGhlIHVzZXItc3BlY2lmaWVkIGRyYXdlciBjb25maWcuXG4gICAqL1xuICBwcml2YXRlIF9jcmVhdGVPdmVybGF5KGNvbmZpZzogTXR4RHJhd2VyQ29uZmlnKTogT3ZlcmxheVJlZiB7XG4gICAgY29uc3Qgb3ZlcmxheUNvbmZpZyA9IG5ldyBPdmVybGF5Q29uZmlnKHtcbiAgICAgIGRpcmVjdGlvbjogY29uZmlnLmRpcmVjdGlvbixcbiAgICAgIGhhc0JhY2tkcm9wOiBjb25maWcuaGFzQmFja2Ryb3AsXG4gICAgICBkaXNwb3NlT25OYXZpZ2F0aW9uOiBjb25maWcuY2xvc2VPbk5hdmlnYXRpb24sXG4gICAgICBtYXhXaWR0aDogJzEwMCUnLFxuICAgICAgc2Nyb2xsU3RyYXRlZ3k6IGNvbmZpZy5zY3JvbGxTdHJhdGVneSB8fCB0aGlzLl9vdmVybGF5LnNjcm9sbFN0cmF0ZWdpZXMuYmxvY2soKSxcbiAgICAgIHBvc2l0aW9uU3RyYXRlZ3k6IHRoaXMuX292ZXJsYXkucG9zaXRpb24oKS5nbG9iYWwoKVtjb25maWcucG9zaXRpb24hXSgnMCcpLFxuICAgIH0pO1xuXG4gICAgaWYgKGNvbmZpZy5iYWNrZHJvcENsYXNzKSB7XG4gICAgICBvdmVybGF5Q29uZmlnLmJhY2tkcm9wQ2xhc3MgPSBjb25maWcuYmFja2Ryb3BDbGFzcztcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5fb3ZlcmxheS5jcmVhdGUob3ZlcmxheUNvbmZpZyk7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlcyBhbiBpbmplY3RvciB0byBiZSB1c2VkIGluc2lkZSBvZiBhIGRyYXdlciBjb21wb25lbnQuXG4gICAqIEBwYXJhbSBjb25maWcgQ29uZmlnIHRoYXQgd2FzIHVzZWQgdG8gY3JlYXRlIHRoZSBkcmF3ZXIuXG4gICAqIEBwYXJhbSBkcmF3ZXJSZWYgUmVmZXJlbmNlIHRvIHRoZSBkcmF3ZXIuXG4gICAqL1xuICBwcml2YXRlIF9jcmVhdGVJbmplY3RvcjxUPihjb25maWc6IE10eERyYXdlckNvbmZpZywgZHJhd2VyUmVmOiBNdHhEcmF3ZXJSZWY8VD4pOiBJbmplY3RvciB7XG4gICAgY29uc3QgdXNlckluamVjdG9yID0gY29uZmlnICYmIGNvbmZpZy52aWV3Q29udGFpbmVyUmVmICYmIGNvbmZpZy52aWV3Q29udGFpbmVyUmVmLmluamVjdG9yO1xuICAgIGNvbnN0IHByb3ZpZGVyczogU3RhdGljUHJvdmlkZXJbXSA9IFtcbiAgICAgIHsgcHJvdmlkZTogTXR4RHJhd2VyUmVmLCB1c2VWYWx1ZTogZHJhd2VyUmVmIH0sXG4gICAgICB7IHByb3ZpZGU6IE1UWF9EUkFXRVJfREFUQSwgdXNlVmFsdWU6IGNvbmZpZy5kYXRhIH0sXG4gICAgXTtcblxuICAgIGlmIChcbiAgICAgIGNvbmZpZy5kaXJlY3Rpb24gJiZcbiAgICAgICghdXNlckluamVjdG9yIHx8XG4gICAgICAgICF1c2VySW5qZWN0b3IuZ2V0PERpcmVjdGlvbmFsaXR5IHwgbnVsbD4oRGlyZWN0aW9uYWxpdHksIG51bGwsIEluamVjdEZsYWdzLk9wdGlvbmFsKSlcbiAgICApIHtcbiAgICAgIHByb3ZpZGVycy5wdXNoKHtcbiAgICAgICAgcHJvdmlkZTogRGlyZWN0aW9uYWxpdHksXG4gICAgICAgIHVzZVZhbHVlOiB7IHZhbHVlOiBjb25maWcuZGlyZWN0aW9uLCBjaGFuZ2U6IG9ic2VydmFibGVPZigpIH0sXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICByZXR1cm4gSW5qZWN0b3IuY3JlYXRlKHsgcGFyZW50OiB1c2VySW5qZWN0b3IgfHwgdGhpcy5faW5qZWN0b3IsIHByb3ZpZGVycyB9KTtcbiAgfVxufVxuXG4vKipcbiAqIEFwcGxpZXMgZGVmYXVsdCBvcHRpb25zIHRvIHRoZSBkcmF3ZXIgY29uZmlnLlxuICogQHBhcmFtIGRlZmF1bHRzIE9iamVjdCBjb250YWluaW5nIHRoZSBkZWZhdWx0IHZhbHVlcyB0byB3aGljaCB0byBmYWxsIGJhY2suXG4gKiBAcGFyYW0gY29uZmlnIFRoZSBjb25maWd1cmF0aW9uIHRvIHdoaWNoIHRoZSBkZWZhdWx0cyB3aWxsIGJlIGFwcGxpZWQuXG4gKiBAcmV0dXJucyBUaGUgbmV3IGNvbmZpZ3VyYXRpb24gb2JqZWN0IHdpdGggZGVmYXVsdHMgYXBwbGllZC5cbiAqL1xuZnVuY3Rpb24gX2FwcGx5Q29uZmlnRGVmYXVsdHMoXG4gIGRlZmF1bHRzOiBNdHhEcmF3ZXJDb25maWcsXG4gIGNvbmZpZz86IE10eERyYXdlckNvbmZpZ1xuKTogTXR4RHJhd2VyQ29uZmlnIHtcbiAgcmV0dXJuIHsgLi4uZGVmYXVsdHMsIC4uLmNvbmZpZyB9O1xufVxuIl19