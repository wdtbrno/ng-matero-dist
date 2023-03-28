import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { ESCAPE, hasModifierKey, UP_ARROW } from '@angular/cdk/keycodes';
import { OverlayConfig, Overlay, } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Inject, InjectionToken, Input, Optional, Output, ViewEncapsulation, } from '@angular/core';
import { mixinColor } from '@angular/material/core';
import { Subject, Subscription, merge } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import { mtxColorpickerAnimations } from './colorpicker-animations';
import { TinyColor } from '@ctrl/tinycolor';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "ngx-color/chrome";
import * as i3 from "@angular/cdk/overlay";
import * as i4 from "@angular/cdk/bidi";
/** Used to generate a unique ID for each colorpicker instance. */
let colorpickerUid = 0;
/** Injection token that determines the scroll handling while the panel is open. */
export const MTX_COLORPICKER_SCROLL_STRATEGY = new InjectionToken('mtx-colorpicker-scroll-strategy');
export function MTX_COLORPICKER_SCROLL_STRATEGY_FACTORY(overlay) {
    return () => overlay.scrollStrategies.reposition();
}
export const MTX_COLORPICKER_SCROLL_STRATEGY_FACTORY_PROVIDER = {
    provide: MTX_COLORPICKER_SCROLL_STRATEGY,
    deps: [Overlay],
    useFactory: MTX_COLORPICKER_SCROLL_STRATEGY_FACTORY,
};
// Boilerplate for applying mixins to MtxColorpickerContent.
/** @docs-private */
const _MtxColorpickerContentBase = mixinColor(class {
    constructor(_elementRef) {
        this._elementRef = _elementRef;
    }
});
export class MtxColorpickerContent extends _MtxColorpickerContentBase {
    constructor(elementRef, _changeDetectorRef) {
        super(elementRef);
        this._changeDetectorRef = _changeDetectorRef;
        /** Current state of the animation. */
        this._animationState = 'enter-dropdown';
        /** Emits when an animation has finished. */
        this._animationDone = new Subject();
    }
    _startExitAnimation() {
        this._animationState = 'void';
        this._changeDetectorRef.markForCheck();
    }
    ngOnDestroy() {
        this._animationDone.complete();
    }
    getColorString(e) {
        return {
            hex: e.color.rgb.a === 1 ? e.color.hex : new TinyColor(e.color.rgb).toHex8String(),
            rgb: new TinyColor(e.color.rgb).toRgbString(),
            hsl: new TinyColor(e.color.hsl).toHslString(),
            hsv: new TinyColor(e.color.hsv).toHsvString(),
        }[this.picker.format];
    }
}
/** @nocollapse */ MtxColorpickerContent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MtxColorpickerContent, deps: [{ token: i0.ElementRef }, { token: i0.ChangeDetectorRef }], target: i0.ɵɵFactoryTarget.Component });
/** @nocollapse */ MtxColorpickerContent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.1", type: MtxColorpickerContent, selector: "mtx-colorpicker-content", inputs: { color: "color" }, host: { listeners: { "@transformPanel.done": "_animationDone.next()" }, properties: { "@transformPanel": "_animationState" }, classAttribute: "mtx-colorpicker-content" }, exportAs: ["mtxColorpickerContent"], usesInheritance: true, ngImport: i0, template: "<ng-template [ngIf]=\"picker.content\" [ngIfElse]=\"default\"\n             [ngTemplateOutlet]=\"picker.content\">\n</ng-template>\n<ng-template #default>\n  <color-chrome [color]=\"picker.selected\"\n                (onChangeComplete)=\"picker.select(getColorString($event))\">\n  </color-chrome>\n</ng-template>\n", styles: [".mtx-colorpicker-content{display:block;border-radius:4px}\n"], dependencies: [{ kind: "directive", type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i1.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "component", type: i2.ChromeComponent, selector: "color-chrome", inputs: ["disableAlpha"] }], animations: [mtxColorpickerAnimations.transformPanel], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MtxColorpickerContent, decorators: [{
            type: Component,
            args: [{ selector: 'mtx-colorpicker-content', host: {
                        'class': 'mtx-colorpicker-content',
                        '[@transformPanel]': '_animationState',
                        '(@transformPanel.done)': '_animationDone.next()',
                    }, animations: [mtxColorpickerAnimations.transformPanel], exportAs: 'mtxColorpickerContent', encapsulation: ViewEncapsulation.None, changeDetection: ChangeDetectionStrategy.OnPush, inputs: ['color'], template: "<ng-template [ngIf]=\"picker.content\" [ngIfElse]=\"default\"\n             [ngTemplateOutlet]=\"picker.content\">\n</ng-template>\n<ng-template #default>\n  <color-chrome [color]=\"picker.selected\"\n                (onChangeComplete)=\"picker.select(getColorString($event))\">\n  </color-chrome>\n</ng-template>\n", styles: [".mtx-colorpicker-content{display:block;border-radius:4px}\n"] }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i0.ChangeDetectorRef }]; } });
export class MtxColorpicker {
    get disabled() {
        return this._disabled === undefined && this.pickerInput
            ? this.pickerInput.disabled
            : !!this._disabled;
    }
    set disabled(value) {
        const newValue = coerceBooleanProperty(value);
        if (newValue !== this._disabled) {
            this._disabled = newValue;
            this._disabledChange.next(newValue);
        }
    }
    /**
     * Whether to restore focus to the previously-focused element when the panel is closed.
     * Note that automatic focus restoration is an accessibility feature and it is recommended that
     * you provide your own equivalent, if you decide to turn it off.
     */
    get restoreFocus() {
        return this._restoreFocus;
    }
    set restoreFocus(value) {
        this._restoreFocus = coerceBooleanProperty(value);
    }
    /** Whether the panel is open. */
    get opened() {
        return this._opened;
    }
    set opened(value) {
        coerceBooleanProperty(value) ? this.open() : this.close();
    }
    /** Color palette to use on the colorpicker's panel. */
    get color() {
        return this._color || (this.pickerInput ? this.pickerInput.getThemePalette() : undefined);
    }
    set color(value) {
        this._color = value;
    }
    /** The input and output color format. */
    get format() {
        return this._format || this.pickerInput.format;
    }
    set format(value) {
        this._format = value;
    }
    /** The currently selected color. */
    get selected() {
        return this._validSelected;
    }
    set selected(value) {
        this._validSelected = value;
    }
    constructor(_overlay, _ngZone, _viewContainerRef, scrollStrategy, _dir, _document) {
        this._overlay = _overlay;
        this._ngZone = _ngZone;
        this._viewContainerRef = _viewContainerRef;
        this._dir = _dir;
        this._document = _document;
        this._inputStateChanges = Subscription.EMPTY;
        /** Emits when the colorpicker has been opened. */
        this.openedStream = new EventEmitter();
        /** Emits when the colorpicker has been closed. */
        this.closedStream = new EventEmitter();
        /** Preferred position of the colorpicker in the X axis. */
        this.xPosition = 'start';
        /** Preferred position of the colorpicker in the Y axis. */
        this.yPosition = 'below';
        this._restoreFocus = true;
        this._opened = false;
        /** The id for the colorpicker panel. */
        this.id = `mtx-colorpicker-${colorpickerUid++}`;
        this._validSelected = '';
        /** The element that was focused before the colorpicker was opened. */
        this._focusedElementBeforeOpen = null;
        /** Unique class that will be added to the backdrop so that the test harnesses can look it up. */
        this._backdropHarnessClass = `${this.id}-backdrop`;
        /** Emits when the datepicker is disabled. */
        this._disabledChange = new Subject();
        /** Emits new selected color when selected color changes. */
        this._selectedChanged = new Subject();
        this._scrollStrategy = scrollStrategy;
    }
    ngOnChanges() { }
    ngOnDestroy() {
        this._destroyOverlay();
        this.close();
        this._inputStateChanges.unsubscribe();
        this._disabledChange.complete();
    }
    /** Selects the given color. */
    select(nextVal) {
        const oldValue = this.selected;
        this.selected = nextVal;
        // TODO: `nextVal` should compare with `oldValue`
        this._selectedChanged.next(nextVal);
    }
    /**
     * Register an input with this colorpicker.
     * @param input The colorpicker input to register with this colorpicker.
     */
    registerInput(input) {
        if (this.pickerInput) {
            throw Error('A Colorpicker can only be associated with a single input.');
        }
        this.pickerInput = input;
        this._inputStateChanges = input._valueChange.subscribe((value) => (this.selected = value));
    }
    /** Open the panel. */
    open() {
        if (this._opened || this.disabled) {
            return;
        }
        if (!this.pickerInput) {
            throw Error('Attempted to open an Colorpicker with no associated input.');
        }
        if (this._document) {
            this._focusedElementBeforeOpen = this._document.activeElement;
        }
        this._openOverlay();
        this._opened = true;
        this.openedStream.emit();
    }
    /** Close the panel. */
    close() {
        if (!this._opened) {
            return;
        }
        if (this._componentRef) {
            const instance = this._componentRef.instance;
            instance._startExitAnimation();
            instance._animationDone.pipe(take(1)).subscribe(() => this._destroyOverlay());
        }
        const completeClose = () => {
            // The `_opened` could've been reset already if
            // we got two events in quick succession.
            if (this._opened) {
                this._opened = false;
                this.closedStream.emit();
                this._focusedElementBeforeOpen = null;
            }
        };
        if (this._restoreFocus &&
            this._focusedElementBeforeOpen &&
            typeof this._focusedElementBeforeOpen.focus === 'function') {
            // Because IE moves focus asynchronously, we can't count on it being restored before we've
            // marked the colorpicker as closed. If the event fires out of sequence and the element that
            // we're refocusing opens the colorpicker on focus, the user could be stuck with not being
            // able to close the panel at all. We work around it by making the logic, that marks
            // the colorpicker as closed, async as well.
            this._focusedElementBeforeOpen.focus();
            setTimeout(completeClose);
        }
        else {
            completeClose();
        }
    }
    /** Forwards relevant values from the colorpicker to the colorpicker content inside the overlay. */
    _forwardContentValues(instance) {
        instance.picker = this;
        instance.color = this.color;
    }
    /** Open the colopicker as a popup. */
    _openOverlay() {
        this._destroyOverlay();
        const labelId = this.pickerInput.getOverlayLabelId();
        const portal = new ComponentPortal(MtxColorpickerContent, this._viewContainerRef);
        const overlayRef = (this._overlayRef = this._overlay.create(new OverlayConfig({
            positionStrategy: this._getDropdownStrategy(),
            hasBackdrop: true,
            backdropClass: ['mat-overlay-transparent-backdrop', this._backdropHarnessClass],
            direction: this._dir,
            scrollStrategy: this._scrollStrategy(),
            panelClass: `mtx-colorpicker-popup`,
        })));
        const overlayElement = overlayRef.overlayElement;
        overlayElement.setAttribute('role', 'dialog');
        if (labelId) {
            overlayElement.setAttribute('aria-labelledby', labelId);
        }
        this._getCloseStream(overlayRef).subscribe(event => {
            if (event) {
                event.preventDefault();
            }
            this.close();
        });
        this._componentRef = overlayRef.attach(portal);
        this._forwardContentValues(this._componentRef.instance);
        // Update the position once the panel has rendered. Only relevant in dropdown mode.
        this._ngZone.onStable.pipe(take(1)).subscribe(() => overlayRef.updatePosition());
    }
    /** Destroys the current overlay. */
    _destroyOverlay() {
        if (this._overlayRef) {
            this._overlayRef.dispose();
            this._overlayRef = this._componentRef = null;
        }
    }
    /** Gets a position strategy that will open the panel as a dropdown. */
    _getDropdownStrategy() {
        const strategy = this._overlay
            .position()
            .flexibleConnectedTo(this.pickerInput.getConnectedOverlayOrigin())
            .withTransformOriginOn('.mtx-colorpicker-content')
            .withFlexibleDimensions(false)
            .withViewportMargin(8)
            .withLockedPosition();
        return this._setConnectedPositions(strategy);
    }
    /** Sets the positions of the colorpicker in dropdown mode based on the current configuration. */
    _setConnectedPositions(strategy) {
        const primaryX = this.xPosition === 'end' ? 'end' : 'start';
        const secondaryX = primaryX === 'start' ? 'end' : 'start';
        const primaryY = this.yPosition === 'above' ? 'bottom' : 'top';
        const secondaryY = primaryY === 'top' ? 'bottom' : 'top';
        return strategy.withPositions([
            {
                originX: primaryX,
                originY: secondaryY,
                overlayX: primaryX,
                overlayY: primaryY,
            },
            {
                originX: primaryX,
                originY: primaryY,
                overlayX: primaryX,
                overlayY: secondaryY,
            },
            {
                originX: secondaryX,
                originY: secondaryY,
                overlayX: secondaryX,
                overlayY: primaryY,
            },
            {
                originX: secondaryX,
                originY: primaryY,
                overlayX: secondaryX,
                overlayY: secondaryY,
            },
        ]);
    }
    /** Gets an observable that will emit when the overlay is supposed to be closed. */
    _getCloseStream(overlayRef) {
        return merge(overlayRef.backdropClick(), overlayRef.detachments(), overlayRef.keydownEvents().pipe(filter(event => {
            // Closing on alt + up is only valid when there's an input associated with the colorpicker.
            return ((event.keyCode === ESCAPE && !hasModifierKey(event)) ||
                (this.pickerInput && hasModifierKey(event, 'altKey') && event.keyCode === UP_ARROW));
        })));
    }
}
/** @nocollapse */ MtxColorpicker.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MtxColorpicker, deps: [{ token: i3.Overlay }, { token: i0.NgZone }, { token: i0.ViewContainerRef }, { token: MTX_COLORPICKER_SCROLL_STRATEGY }, { token: i4.Directionality, optional: true }, { token: DOCUMENT, optional: true }], target: i0.ɵɵFactoryTarget.Component });
/** @nocollapse */ MtxColorpicker.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.1", type: MtxColorpicker, selector: "mtx-colorpicker", inputs: { content: "content", disabled: "disabled", xPosition: "xPosition", yPosition: "yPosition", restoreFocus: "restoreFocus", opened: "opened", color: "color", format: "format" }, outputs: { openedStream: "opened", closedStream: "closed" }, exportAs: ["mtxColorpicker"], usesOnChanges: true, ngImport: i0, template: '', isInline: true, changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MtxColorpicker, decorators: [{
            type: Component,
            args: [{
                    selector: 'mtx-colorpicker',
                    template: '',
                    exportAs: 'mtxColorpicker',
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    encapsulation: ViewEncapsulation.None,
                }]
        }], ctorParameters: function () { return [{ type: i3.Overlay }, { type: i0.NgZone }, { type: i0.ViewContainerRef }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [MTX_COLORPICKER_SCROLL_STRATEGY]
                }] }, { type: i4.Directionality, decorators: [{
                    type: Optional
                }] }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [DOCUMENT]
                }] }]; }, propDecorators: { content: [{
                type: Input
            }], openedStream: [{
                type: Output,
                args: ['opened']
            }], closedStream: [{
                type: Output,
                args: ['closed']
            }], disabled: [{
                type: Input
            }], xPosition: [{
                type: Input
            }], yPosition: [{
                type: Input
            }], restoreFocus: [{
                type: Input
            }], opened: [{
                type: Input
            }], color: [{
                type: Input
            }], format: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29sb3JwaWNrZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wcm9qZWN0cy9leHRlbnNpb25zL2NvbG9ycGlja2VyL2NvbG9ycGlja2VyLnRzIiwiLi4vLi4vLi4vLi4vcHJvamVjdHMvZXh0ZW5zaW9ucy9jb2xvcnBpY2tlci9jb2xvcnBpY2tlci1jb250ZW50Lmh0bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0EsT0FBTyxFQUFnQixxQkFBcUIsRUFBRSxNQUFNLHVCQUF1QixDQUFDO0FBQzVFLE9BQU8sRUFBRSxNQUFNLEVBQUUsY0FBYyxFQUFFLFFBQVEsRUFBRSxNQUFNLHVCQUF1QixDQUFDO0FBQ3pFLE9BQU8sRUFFTCxhQUFhLEVBQ2IsT0FBTyxHQUdSLE1BQU0sc0JBQXNCLENBQUM7QUFDOUIsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBQ3RELE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUMzQyxPQUFPLEVBQ0wsdUJBQXVCLEVBRXZCLFNBQVMsRUFHVCxZQUFZLEVBQ1osTUFBTSxFQUNOLGNBQWMsRUFDZCxLQUFLLEVBSUwsUUFBUSxFQUNSLE1BQU0sRUFHTixpQkFBaUIsR0FDbEIsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFZLFVBQVUsRUFBZ0IsTUFBTSx3QkFBd0IsQ0FBQztBQUM1RSxPQUFPLEVBQUUsT0FBTyxFQUFFLFlBQVksRUFBRSxLQUFLLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDcEQsT0FBTyxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUM5QyxPQUFPLEVBQUUsd0JBQXdCLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQztBQUtwRSxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0saUJBQWlCLENBQUM7Ozs7OztBQUU1QyxrRUFBa0U7QUFDbEUsSUFBSSxjQUFjLEdBQUcsQ0FBQyxDQUFDO0FBRXZCLG1GQUFtRjtBQUNuRixNQUFNLENBQUMsTUFBTSwrQkFBK0IsR0FBRyxJQUFJLGNBQWMsQ0FDL0QsaUNBQWlDLENBQ2xDLENBQUM7QUFFRixNQUFNLFVBQVUsdUNBQXVDLENBQUMsT0FBZ0I7SUFDdEUsT0FBTyxHQUFHLEVBQUUsQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsVUFBVSxFQUFFLENBQUM7QUFDckQsQ0FBQztBQVFELE1BQU0sQ0FBQyxNQUFNLGdEQUFnRCxHQUFHO0lBQzlELE9BQU8sRUFBRSwrQkFBK0I7SUFDeEMsSUFBSSxFQUFFLENBQUMsT0FBTyxDQUFDO0lBQ2YsVUFBVSxFQUFFLHVDQUF1QztDQUNwRCxDQUFDO0FBRUYsNERBQTREO0FBQzVELG9CQUFvQjtBQUNwQixNQUFNLDBCQUEwQixHQUFHLFVBQVUsQ0FDM0M7SUFDRSxZQUFtQixXQUF1QjtRQUF2QixnQkFBVyxHQUFYLFdBQVcsQ0FBWTtJQUFHLENBQUM7Q0FDL0MsQ0FDRixDQUFDO0FBaUJGLE1BQU0sT0FBTyxxQkFDWCxTQUFRLDBCQUEwQjtJQVdsQyxZQUFZLFVBQXNCLEVBQVUsa0JBQXFDO1FBQy9FLEtBQUssQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUR3Qix1QkFBa0IsR0FBbEIsa0JBQWtCLENBQW1CO1FBTmpGLHNDQUFzQztRQUN0QyxvQkFBZSxHQUE4QixnQkFBZ0IsQ0FBQztRQUU5RCw0Q0FBNEM7UUFDbkMsbUJBQWMsR0FBRyxJQUFJLE9BQU8sRUFBUSxDQUFDO0lBSTlDLENBQUM7SUFFRCxtQkFBbUI7UUFDakIsSUFBSSxDQUFDLGVBQWUsR0FBRyxNQUFNLENBQUM7UUFDOUIsSUFBSSxDQUFDLGtCQUFrQixDQUFDLFlBQVksRUFBRSxDQUFDO0lBQ3pDLENBQUM7SUFFRCxXQUFXO1FBQ1QsSUFBSSxDQUFDLGNBQWMsQ0FBQyxRQUFRLEVBQUUsQ0FBQztJQUNqQyxDQUFDO0lBRUQsY0FBYyxDQUFDLENBQWE7UUFDMUIsT0FBTztZQUNMLEdBQUcsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxTQUFTLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxZQUFZLEVBQUU7WUFDbEYsR0FBRyxFQUFFLElBQUksU0FBUyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsV0FBVyxFQUFFO1lBQzdDLEdBQUcsRUFBRSxJQUFJLFNBQVMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFdBQVcsRUFBRTtZQUM3QyxHQUFHLEVBQUUsSUFBSSxTQUFTLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxXQUFXLEVBQUU7U0FDOUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ3hCLENBQUM7O3FJQWhDVSxxQkFBcUI7eUhBQXJCLHFCQUFxQixrVUN4RmxDLDZUQVFBLHVkRDBFYyxDQUFDLHdCQUF3QixDQUFDLGNBQWMsQ0FBQzsyRkFNMUMscUJBQXFCO2tCQWZqQyxTQUFTOytCQUNFLHlCQUF5QixRQUc3Qjt3QkFDSixPQUFPLEVBQUUseUJBQXlCO3dCQUNsQyxtQkFBbUIsRUFBRSxpQkFBaUI7d0JBQ3RDLHdCQUF3QixFQUFFLHVCQUF1QjtxQkFDbEQsY0FDVyxDQUFDLHdCQUF3QixDQUFDLGNBQWMsQ0FBQyxZQUMzQyx1QkFBdUIsaUJBQ2xCLGlCQUFpQixDQUFDLElBQUksbUJBQ3BCLHVCQUF1QixDQUFDLE1BQU0sVUFDdkMsQ0FBQyxPQUFPLENBQUM7O0FBNENuQixNQUFNLE9BQU8sY0FBYztJQWF6QixJQUFhLFFBQVE7UUFDbkIsT0FBTyxJQUFJLENBQUMsU0FBUyxLQUFLLFNBQVMsSUFBSSxJQUFJLENBQUMsV0FBVztZQUNyRCxDQUFDLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxRQUFRO1lBQzNCLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQztJQUN2QixDQUFDO0lBQ0QsSUFBSSxRQUFRLENBQUMsS0FBYztRQUN6QixNQUFNLFFBQVEsR0FBRyxxQkFBcUIsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUU5QyxJQUFJLFFBQVEsS0FBSyxJQUFJLENBQUMsU0FBUyxFQUFFO1lBQy9CLElBQUksQ0FBQyxTQUFTLEdBQUcsUUFBUSxDQUFDO1lBQzFCLElBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1NBQ3JDO0lBQ0gsQ0FBQztJQVdEOzs7O09BSUc7SUFDSCxJQUNJLFlBQVk7UUFDZCxPQUFPLElBQUksQ0FBQyxhQUFhLENBQUM7SUFDNUIsQ0FBQztJQUNELElBQUksWUFBWSxDQUFDLEtBQWM7UUFDN0IsSUFBSSxDQUFDLGFBQWEsR0FBRyxxQkFBcUIsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNwRCxDQUFDO0lBR0QsaUNBQWlDO0lBQ2pDLElBQ0ksTUFBTTtRQUNSLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQztJQUN0QixDQUFDO0lBQ0QsSUFBSSxNQUFNLENBQUMsS0FBYztRQUN2QixxQkFBcUIsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7SUFDNUQsQ0FBQztJQU1ELHVEQUF1RDtJQUN2RCxJQUNJLEtBQUs7UUFDUCxPQUFPLElBQUksQ0FBQyxNQUFNLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLGVBQWUsRUFBRSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUM1RixDQUFDO0lBQ0QsSUFBSSxLQUFLLENBQUMsS0FBbUI7UUFDM0IsSUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUM7SUFDdEIsQ0FBQztJQUdELHlDQUF5QztJQUN6QyxJQUNJLE1BQU07UUFDUixPQUFPLElBQUksQ0FBQyxPQUFPLElBQUksSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUM7SUFDakQsQ0FBQztJQUNELElBQUksTUFBTSxDQUFDLEtBQWtCO1FBQzNCLElBQUksQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDO0lBQ3ZCLENBQUM7SUFHRCxvQ0FBb0M7SUFDcEMsSUFBSSxRQUFRO1FBQ1YsT0FBTyxJQUFJLENBQUMsY0FBYyxDQUFDO0lBQzdCLENBQUM7SUFDRCxJQUFJLFFBQVEsQ0FBQyxLQUFhO1FBQ3hCLElBQUksQ0FBQyxjQUFjLEdBQUcsS0FBSyxDQUFDO0lBQzlCLENBQUM7SUF3QkQsWUFDVSxRQUFpQixFQUNqQixPQUFlLEVBQ2YsaUJBQW1DLEVBQ0YsY0FBbUIsRUFDeEMsSUFBb0IsRUFDRixTQUFjO1FBTDVDLGFBQVEsR0FBUixRQUFRLENBQVM7UUFDakIsWUFBTyxHQUFQLE9BQU8sQ0FBUTtRQUNmLHNCQUFpQixHQUFqQixpQkFBaUIsQ0FBa0I7UUFFdkIsU0FBSSxHQUFKLElBQUksQ0FBZ0I7UUFDRixjQUFTLEdBQVQsU0FBUyxDQUFLO1FBckg5Qyx1QkFBa0IsR0FBRyxZQUFZLENBQUMsS0FBSyxDQUFDO1FBS2hELGtEQUFrRDtRQUNoQyxpQkFBWSxHQUF1QixJQUFJLFlBQVksRUFBUSxDQUFDO1FBRTlFLGtEQUFrRDtRQUNoQyxpQkFBWSxHQUF1QixJQUFJLFlBQVksRUFBUSxDQUFDO1FBaUI5RSwyREFBMkQ7UUFFM0QsY0FBUyxHQUFpQyxPQUFPLENBQUM7UUFFbEQsMkRBQTJEO1FBRTNELGNBQVMsR0FBaUMsT0FBTyxDQUFDO1FBYzFDLGtCQUFhLEdBQUcsSUFBSSxDQUFDO1FBVXJCLFlBQU8sR0FBRyxLQUFLLENBQUM7UUFFeEIsd0NBQXdDO1FBQ3hDLE9BQUUsR0FBRyxtQkFBbUIsY0FBYyxFQUFFLEVBQUUsQ0FBQztRQTZCbkMsbUJBQWMsR0FBVyxFQUFFLENBQUM7UUFRcEMsc0VBQXNFO1FBQzlELDhCQUF5QixHQUF1QixJQUFJLENBQUM7UUFFN0QsaUdBQWlHO1FBQ3pGLDBCQUFxQixHQUFHLEdBQUcsSUFBSSxDQUFDLEVBQUUsV0FBVyxDQUFDO1FBS3RELDZDQUE2QztRQUNwQyxvQkFBZSxHQUFHLElBQUksT0FBTyxFQUFXLENBQUM7UUFFbEQsNERBQTREO1FBQ25ELHFCQUFnQixHQUFHLElBQUksT0FBTyxFQUFVLENBQUM7UUFVaEQsSUFBSSxDQUFDLGVBQWUsR0FBRyxjQUFjLENBQUM7SUFDeEMsQ0FBQztJQUVELFdBQVcsS0FBSSxDQUFDO0lBRWhCLFdBQVc7UUFDVCxJQUFJLENBQUMsZUFBZSxFQUFFLENBQUM7UUFDdkIsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQ2IsSUFBSSxDQUFDLGtCQUFrQixDQUFDLFdBQVcsRUFBRSxDQUFDO1FBQ3RDLElBQUksQ0FBQyxlQUFlLENBQUMsUUFBUSxFQUFFLENBQUM7SUFDbEMsQ0FBQztJQUVELCtCQUErQjtJQUMvQixNQUFNLENBQUMsT0FBZTtRQUNwQixNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDO1FBQy9CLElBQUksQ0FBQyxRQUFRLEdBQUcsT0FBTyxDQUFDO1FBRXhCLGlEQUFpRDtRQUNqRCxJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ3RDLENBQUM7SUFFRDs7O09BR0c7SUFDSCxhQUFhLENBQUMsS0FBMEI7UUFDdEMsSUFBSSxJQUFJLENBQUMsV0FBVyxFQUFFO1lBQ3BCLE1BQU0sS0FBSyxDQUFDLDJEQUEyRCxDQUFDLENBQUM7U0FDMUU7UUFDRCxJQUFJLENBQUMsV0FBVyxHQUFHLEtBQUssQ0FBQztRQUN6QixJQUFJLENBQUMsa0JBQWtCLEdBQUcsS0FBSyxDQUFDLFlBQVksQ0FBQyxTQUFTLENBQ3BELENBQUMsS0FBYSxFQUFFLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDLENBQzNDLENBQUM7SUFDSixDQUFDO0lBRUQsc0JBQXNCO0lBQ3RCLElBQUk7UUFDRixJQUFJLElBQUksQ0FBQyxPQUFPLElBQUksSUFBSSxDQUFDLFFBQVEsRUFBRTtZQUNqQyxPQUFPO1NBQ1I7UUFDRCxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRTtZQUNyQixNQUFNLEtBQUssQ0FBQyw0REFBNEQsQ0FBQyxDQUFDO1NBQzNFO1FBRUQsSUFBSSxJQUFJLENBQUMsU0FBUyxFQUFFO1lBQ2xCLElBQUksQ0FBQyx5QkFBeUIsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWEsQ0FBQztTQUMvRDtRQUVELElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztRQUNwQixJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQztRQUNwQixJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksRUFBRSxDQUFDO0lBQzNCLENBQUM7SUFFRCx1QkFBdUI7SUFDdkIsS0FBSztRQUNILElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFO1lBQ2pCLE9BQU87U0FDUjtRQUVELElBQUksSUFBSSxDQUFDLGFBQWEsRUFBRTtZQUN0QixNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQztZQUM3QyxRQUFRLENBQUMsbUJBQW1CLEVBQUUsQ0FBQztZQUMvQixRQUFRLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDLENBQUM7U0FDL0U7UUFFRCxNQUFNLGFBQWEsR0FBRyxHQUFHLEVBQUU7WUFDekIsK0NBQStDO1lBQy9DLHlDQUF5QztZQUN6QyxJQUFJLElBQUksQ0FBQyxPQUFPLEVBQUU7Z0JBQ2hCLElBQUksQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDO2dCQUNyQixJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksRUFBRSxDQUFDO2dCQUN6QixJQUFJLENBQUMseUJBQXlCLEdBQUcsSUFBSSxDQUFDO2FBQ3ZDO1FBQ0gsQ0FBQyxDQUFDO1FBRUYsSUFDRSxJQUFJLENBQUMsYUFBYTtZQUNsQixJQUFJLENBQUMseUJBQXlCO1lBQzlCLE9BQU8sSUFBSSxDQUFDLHlCQUF5QixDQUFDLEtBQUssS0FBSyxVQUFVLEVBQzFEO1lBQ0EsMEZBQTBGO1lBQzFGLDRGQUE0RjtZQUM1RiwwRkFBMEY7WUFDMUYsb0ZBQW9GO1lBQ3BGLDRDQUE0QztZQUM1QyxJQUFJLENBQUMseUJBQXlCLENBQUMsS0FBSyxFQUFFLENBQUM7WUFDdkMsVUFBVSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1NBQzNCO2FBQU07WUFDTCxhQUFhLEVBQUUsQ0FBQztTQUNqQjtJQUNILENBQUM7SUFFRCxtR0FBbUc7SUFDekYscUJBQXFCLENBQUMsUUFBK0I7UUFDN0QsUUFBUSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7UUFDdkIsUUFBUSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO0lBQzlCLENBQUM7SUFFRCxzQ0FBc0M7SUFDOUIsWUFBWTtRQUNsQixJQUFJLENBQUMsZUFBZSxFQUFFLENBQUM7UUFFdkIsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxpQkFBaUIsRUFBRSxDQUFDO1FBQ3JELE1BQU0sTUFBTSxHQUFHLElBQUksZUFBZSxDQUNoQyxxQkFBcUIsRUFDckIsSUFBSSxDQUFDLGlCQUFpQixDQUN2QixDQUFDO1FBQ0YsTUFBTSxVQUFVLEdBQUcsQ0FBQyxJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUN6RCxJQUFJLGFBQWEsQ0FBQztZQUNoQixnQkFBZ0IsRUFBRSxJQUFJLENBQUMsb0JBQW9CLEVBQUU7WUFDN0MsV0FBVyxFQUFFLElBQUk7WUFDakIsYUFBYSxFQUFFLENBQUMsa0NBQWtDLEVBQUUsSUFBSSxDQUFDLHFCQUFxQixDQUFDO1lBQy9FLFNBQVMsRUFBRSxJQUFJLENBQUMsSUFBSTtZQUNwQixjQUFjLEVBQUUsSUFBSSxDQUFDLGVBQWUsRUFBRTtZQUN0QyxVQUFVLEVBQUUsdUJBQXVCO1NBQ3BDLENBQUMsQ0FDSCxDQUFDLENBQUM7UUFDSCxNQUFNLGNBQWMsR0FBRyxVQUFVLENBQUMsY0FBYyxDQUFDO1FBQ2pELGNBQWMsQ0FBQyxZQUFZLENBQUMsTUFBTSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBRTlDLElBQUksT0FBTyxFQUFFO1lBQ1gsY0FBYyxDQUFDLFlBQVksQ0FBQyxpQkFBaUIsRUFBRSxPQUFPLENBQUMsQ0FBQztTQUN6RDtRQUVELElBQUksQ0FBQyxlQUFlLENBQUMsVUFBVSxDQUFDLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxFQUFFO1lBQ2pELElBQUksS0FBSyxFQUFFO2dCQUNULEtBQUssQ0FBQyxjQUFjLEVBQUUsQ0FBQzthQUN4QjtZQUNELElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUNmLENBQUMsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLGFBQWEsR0FBRyxVQUFVLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQy9DLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBRXhELG1GQUFtRjtRQUNuRixJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRSxDQUFDLFVBQVUsQ0FBQyxjQUFjLEVBQUUsQ0FBQyxDQUFDO0lBQ25GLENBQUM7SUFFRCxvQ0FBb0M7SUFDNUIsZUFBZTtRQUNyQixJQUFJLElBQUksQ0FBQyxXQUFXLEVBQUU7WUFDcEIsSUFBSSxDQUFDLFdBQVcsQ0FBQyxPQUFPLEVBQUUsQ0FBQztZQUMzQixJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDO1NBQzlDO0lBQ0gsQ0FBQztJQUVELHVFQUF1RTtJQUMvRCxvQkFBb0I7UUFDMUIsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLFFBQVE7YUFDM0IsUUFBUSxFQUFFO2FBQ1YsbUJBQW1CLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyx5QkFBeUIsRUFBRSxDQUFDO2FBQ2pFLHFCQUFxQixDQUFDLDBCQUEwQixDQUFDO2FBQ2pELHNCQUFzQixDQUFDLEtBQUssQ0FBQzthQUM3QixrQkFBa0IsQ0FBQyxDQUFDLENBQUM7YUFDckIsa0JBQWtCLEVBQUUsQ0FBQztRQUV4QixPQUFPLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUMvQyxDQUFDO0lBRUQsaUdBQWlHO0lBQ3pGLHNCQUFzQixDQUFDLFFBQTJDO1FBQ3hFLE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxTQUFTLEtBQUssS0FBSyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQztRQUM1RCxNQUFNLFVBQVUsR0FBRyxRQUFRLEtBQUssT0FBTyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQztRQUMxRCxNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsU0FBUyxLQUFLLE9BQU8sQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7UUFDL0QsTUFBTSxVQUFVLEdBQUcsUUFBUSxLQUFLLEtBQUssQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7UUFFekQsT0FBTyxRQUFRLENBQUMsYUFBYSxDQUFDO1lBQzVCO2dCQUNFLE9BQU8sRUFBRSxRQUFRO2dCQUNqQixPQUFPLEVBQUUsVUFBVTtnQkFDbkIsUUFBUSxFQUFFLFFBQVE7Z0JBQ2xCLFFBQVEsRUFBRSxRQUFRO2FBQ25CO1lBQ0Q7Z0JBQ0UsT0FBTyxFQUFFLFFBQVE7Z0JBQ2pCLE9BQU8sRUFBRSxRQUFRO2dCQUNqQixRQUFRLEVBQUUsUUFBUTtnQkFDbEIsUUFBUSxFQUFFLFVBQVU7YUFDckI7WUFDRDtnQkFDRSxPQUFPLEVBQUUsVUFBVTtnQkFDbkIsT0FBTyxFQUFFLFVBQVU7Z0JBQ25CLFFBQVEsRUFBRSxVQUFVO2dCQUNwQixRQUFRLEVBQUUsUUFBUTthQUNuQjtZQUNEO2dCQUNFLE9BQU8sRUFBRSxVQUFVO2dCQUNuQixPQUFPLEVBQUUsUUFBUTtnQkFDakIsUUFBUSxFQUFFLFVBQVU7Z0JBQ3BCLFFBQVEsRUFBRSxVQUFVO2FBQ3JCO1NBQ0YsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVELG1GQUFtRjtJQUMzRSxlQUFlLENBQUMsVUFBc0I7UUFDNUMsT0FBTyxLQUFLLENBQ1YsVUFBVSxDQUFDLGFBQWEsRUFBRSxFQUMxQixVQUFVLENBQUMsV0FBVyxFQUFFLEVBQ3hCLFVBQVUsQ0FBQyxhQUFhLEVBQUUsQ0FBQyxJQUFJLENBQzdCLE1BQU0sQ0FBQyxLQUFLLENBQUMsRUFBRTtZQUNiLDJGQUEyRjtZQUMzRixPQUFPLENBQ0wsQ0FBQyxLQUFLLENBQUMsT0FBTyxLQUFLLE1BQU0sSUFBSSxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDcEQsQ0FBQyxJQUFJLENBQUMsV0FBVyxJQUFJLGNBQWMsQ0FBQyxLQUFLLEVBQUUsUUFBUSxDQUFDLElBQUksS0FBSyxDQUFDLE9BQU8sS0FBSyxRQUFRLENBQUMsQ0FDcEYsQ0FBQztRQUNKLENBQUMsQ0FBQyxDQUNILENBQ0YsQ0FBQztJQUNKLENBQUM7OzhIQTFVVSxjQUFjLCtGQXFIZiwrQkFBK0IsMkRBRW5CLFFBQVE7a0hBdkhuQixjQUFjLCtWQUxmLEVBQUU7MkZBS0QsY0FBYztrQkFQMUIsU0FBUzttQkFBQztvQkFDVCxRQUFRLEVBQUUsaUJBQWlCO29CQUMzQixRQUFRLEVBQUUsRUFBRTtvQkFDWixRQUFRLEVBQUUsZ0JBQWdCO29CQUMxQixlQUFlLEVBQUUsdUJBQXVCLENBQUMsTUFBTTtvQkFDL0MsYUFBYSxFQUFFLGlCQUFpQixDQUFDLElBQUk7aUJBQ3RDOzswQkFzSEksTUFBTTsyQkFBQywrQkFBK0I7OzBCQUN0QyxRQUFROzswQkFDUixRQUFROzswQkFBSSxNQUFNOzJCQUFDLFFBQVE7NENBbEhyQixPQUFPO3NCQUFmLEtBQUs7Z0JBR1ksWUFBWTtzQkFBN0IsTUFBTTt1QkFBQyxRQUFRO2dCQUdFLFlBQVk7c0JBQTdCLE1BQU07dUJBQUMsUUFBUTtnQkFFSCxRQUFRO3NCQUFwQixLQUFLO2dCQWlCTixTQUFTO3NCQURSLEtBQUs7Z0JBS04sU0FBUztzQkFEUixLQUFLO2dCQVNGLFlBQVk7c0JBRGYsS0FBSztnQkFXRixNQUFNO3NCQURULEtBQUs7Z0JBY0YsS0FBSztzQkFEUixLQUFLO2dCQVdGLE1BQU07c0JBRFQsS0FBSyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IERpcmVjdGlvbmFsaXR5IH0gZnJvbSAnQGFuZ3VsYXIvY2RrL2JpZGknO1xuaW1wb3J0IHsgQm9vbGVhbklucHV0LCBjb2VyY2VCb29sZWFuUHJvcGVydHkgfSBmcm9tICdAYW5ndWxhci9jZGsvY29lcmNpb24nO1xuaW1wb3J0IHsgRVNDQVBFLCBoYXNNb2RpZmllcktleSwgVVBfQVJST1cgfSBmcm9tICdAYW5ndWxhci9jZGsva2V5Y29kZXMnO1xuaW1wb3J0IHtcbiAgU2Nyb2xsU3RyYXRlZ3ksXG4gIE92ZXJsYXlDb25maWcsXG4gIE92ZXJsYXksXG4gIE92ZXJsYXlSZWYsXG4gIEZsZXhpYmxlQ29ubmVjdGVkUG9zaXRpb25TdHJhdGVneSxcbn0gZnJvbSAnQGFuZ3VsYXIvY2RrL292ZXJsYXknO1xuaW1wb3J0IHsgQ29tcG9uZW50UG9ydGFsIH0gZnJvbSAnQGFuZ3VsYXIvY2RrL3BvcnRhbCc7XG5pbXBvcnQgeyBET0NVTUVOVCB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQge1xuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gIENvbXBvbmVudCxcbiAgQ29tcG9uZW50UmVmLFxuICBFbGVtZW50UmVmLFxuICBFdmVudEVtaXR0ZXIsXG4gIEluamVjdCxcbiAgSW5qZWN0aW9uVG9rZW4sXG4gIElucHV0LFxuICBOZ1pvbmUsXG4gIE9uQ2hhbmdlcyxcbiAgT25EZXN0cm95LFxuICBPcHRpb25hbCxcbiAgT3V0cHV0LFxuICBUZW1wbGF0ZVJlZixcbiAgVmlld0NvbnRhaW5lclJlZixcbiAgVmlld0VuY2Fwc3VsYXRpb24sXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQ2FuQ29sb3IsIG1peGluQ29sb3IsIFRoZW1lUGFsZXR0ZSB9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2NvcmUnO1xuaW1wb3J0IHsgU3ViamVjdCwgU3Vic2NyaXB0aW9uLCBtZXJnZSB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgZmlsdGVyLCB0YWtlIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHsgbXR4Q29sb3JwaWNrZXJBbmltYXRpb25zIH0gZnJvbSAnLi9jb2xvcnBpY2tlci1hbmltYXRpb25zJztcbmltcG9ydCB7IENvbG9yRm9ybWF0LCBNdHhDb2xvcnBpY2tlcklucHV0IH0gZnJvbSAnLi9jb2xvcnBpY2tlci1pbnB1dCc7XG5cbmltcG9ydCB7IENvbG9yRXZlbnQgfSBmcm9tICduZ3gtY29sb3InO1xuXG5pbXBvcnQgeyBUaW55Q29sb3IgfSBmcm9tICdAY3RybC90aW55Y29sb3InO1xuXG4vKiogVXNlZCB0byBnZW5lcmF0ZSBhIHVuaXF1ZSBJRCBmb3IgZWFjaCBjb2xvcnBpY2tlciBpbnN0YW5jZS4gKi9cbmxldCBjb2xvcnBpY2tlclVpZCA9IDA7XG5cbi8qKiBJbmplY3Rpb24gdG9rZW4gdGhhdCBkZXRlcm1pbmVzIHRoZSBzY3JvbGwgaGFuZGxpbmcgd2hpbGUgdGhlIHBhbmVsIGlzIG9wZW4uICovXG5leHBvcnQgY29uc3QgTVRYX0NPTE9SUElDS0VSX1NDUk9MTF9TVFJBVEVHWSA9IG5ldyBJbmplY3Rpb25Ub2tlbjwoKSA9PiBTY3JvbGxTdHJhdGVneT4oXG4gICdtdHgtY29sb3JwaWNrZXItc2Nyb2xsLXN0cmF0ZWd5J1xuKTtcblxuZXhwb3J0IGZ1bmN0aW9uIE1UWF9DT0xPUlBJQ0tFUl9TQ1JPTExfU1RSQVRFR1lfRkFDVE9SWShvdmVybGF5OiBPdmVybGF5KTogKCkgPT4gU2Nyb2xsU3RyYXRlZ3kge1xuICByZXR1cm4gKCkgPT4gb3ZlcmxheS5zY3JvbGxTdHJhdGVnaWVzLnJlcG9zaXRpb24oKTtcbn1cblxuLyoqIFBvc3NpYmxlIHBvc2l0aW9ucyBmb3IgdGhlIGNvbG9ycGlja2VyIGRyb3Bkb3duIGFsb25nIHRoZSBYIGF4aXMuICovXG5leHBvcnQgdHlwZSBDb2xvcnBpY2tlckRyb3Bkb3duUG9zaXRpb25YID0gJ3N0YXJ0JyB8ICdlbmQnO1xuXG4vKiogUG9zc2libGUgcG9zaXRpb25zIGZvciB0aGUgY29sb3JwaWNrZXIgZHJvcGRvd24gYWxvbmcgdGhlIFkgYXhpcy4gKi9cbmV4cG9ydCB0eXBlIENvbG9ycGlja2VyRHJvcGRvd25Qb3NpdGlvblkgPSAnYWJvdmUnIHwgJ2JlbG93JztcblxuZXhwb3J0IGNvbnN0IE1UWF9DT0xPUlBJQ0tFUl9TQ1JPTExfU1RSQVRFR1lfRkFDVE9SWV9QUk9WSURFUiA9IHtcbiAgcHJvdmlkZTogTVRYX0NPTE9SUElDS0VSX1NDUk9MTF9TVFJBVEVHWSxcbiAgZGVwczogW092ZXJsYXldLFxuICB1c2VGYWN0b3J5OiBNVFhfQ09MT1JQSUNLRVJfU0NST0xMX1NUUkFURUdZX0ZBQ1RPUlksXG59O1xuXG4vLyBCb2lsZXJwbGF0ZSBmb3IgYXBwbHlpbmcgbWl4aW5zIHRvIE10eENvbG9ycGlja2VyQ29udGVudC5cbi8qKiBAZG9jcy1wcml2YXRlICovXG5jb25zdCBfTXR4Q29sb3JwaWNrZXJDb250ZW50QmFzZSA9IG1peGluQ29sb3IoXG4gIGNsYXNzIHtcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgX2VsZW1lbnRSZWY6IEVsZW1lbnRSZWYpIHt9XG4gIH1cbik7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ210eC1jb2xvcnBpY2tlci1jb250ZW50JyxcbiAgdGVtcGxhdGVVcmw6ICcuL2NvbG9ycGlja2VyLWNvbnRlbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWydjb2xvcnBpY2tlci1jb250ZW50LnNjc3MnXSxcbiAgaG9zdDoge1xuICAgICdjbGFzcyc6ICdtdHgtY29sb3JwaWNrZXItY29udGVudCcsXG4gICAgJ1tAdHJhbnNmb3JtUGFuZWxdJzogJ19hbmltYXRpb25TdGF0ZScsXG4gICAgJyhAdHJhbnNmb3JtUGFuZWwuZG9uZSknOiAnX2FuaW1hdGlvbkRvbmUubmV4dCgpJyxcbiAgfSxcbiAgYW5pbWF0aW9uczogW210eENvbG9ycGlja2VyQW5pbWF0aW9ucy50cmFuc2Zvcm1QYW5lbF0sXG4gIGV4cG9ydEFzOiAnbXR4Q29sb3JwaWNrZXJDb250ZW50JyxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gIGlucHV0czogWydjb2xvciddLFxufSlcbmV4cG9ydCBjbGFzcyBNdHhDb2xvcnBpY2tlckNvbnRlbnRcbiAgZXh0ZW5kcyBfTXR4Q29sb3JwaWNrZXJDb250ZW50QmFzZVxuICBpbXBsZW1lbnRzIE9uRGVzdHJveSwgQ2FuQ29sb3JcbntcbiAgcGlja2VyITogTXR4Q29sb3JwaWNrZXI7XG5cbiAgLyoqIEN1cnJlbnQgc3RhdGUgb2YgdGhlIGFuaW1hdGlvbi4gKi9cbiAgX2FuaW1hdGlvblN0YXRlOiAnZW50ZXItZHJvcGRvd24nIHwgJ3ZvaWQnID0gJ2VudGVyLWRyb3Bkb3duJztcblxuICAvKiogRW1pdHMgd2hlbiBhbiBhbmltYXRpb24gaGFzIGZpbmlzaGVkLiAqL1xuICByZWFkb25seSBfYW5pbWF0aW9uRG9uZSA9IG5ldyBTdWJqZWN0PHZvaWQ+KCk7XG5cbiAgY29uc3RydWN0b3IoZWxlbWVudFJlZjogRWxlbWVudFJlZiwgcHJpdmF0ZSBfY2hhbmdlRGV0ZWN0b3JSZWY6IENoYW5nZURldGVjdG9yUmVmKSB7XG4gICAgc3VwZXIoZWxlbWVudFJlZik7XG4gIH1cblxuICBfc3RhcnRFeGl0QW5pbWF0aW9uKCkge1xuICAgIHRoaXMuX2FuaW1hdGlvblN0YXRlID0gJ3ZvaWQnO1xuICAgIHRoaXMuX2NoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgdGhpcy5fYW5pbWF0aW9uRG9uZS5jb21wbGV0ZSgpO1xuICB9XG5cbiAgZ2V0Q29sb3JTdHJpbmcoZTogQ29sb3JFdmVudCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGhleDogZS5jb2xvci5yZ2IuYSA9PT0gMSA/IGUuY29sb3IuaGV4IDogbmV3IFRpbnlDb2xvcihlLmNvbG9yLnJnYikudG9IZXg4U3RyaW5nKCksXG4gICAgICByZ2I6IG5ldyBUaW55Q29sb3IoZS5jb2xvci5yZ2IpLnRvUmdiU3RyaW5nKCksXG4gICAgICBoc2w6IG5ldyBUaW55Q29sb3IoZS5jb2xvci5oc2wpLnRvSHNsU3RyaW5nKCksXG4gICAgICBoc3Y6IG5ldyBUaW55Q29sb3IoZS5jb2xvci5oc3YpLnRvSHN2U3RyaW5nKCksXG4gICAgfVt0aGlzLnBpY2tlci5mb3JtYXRdO1xuICB9XG59XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ210eC1jb2xvcnBpY2tlcicsXG4gIHRlbXBsYXRlOiAnJyxcbiAgZXhwb3J0QXM6ICdtdHhDb2xvcnBpY2tlcicsXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxufSlcbmV4cG9ydCBjbGFzcyBNdHhDb2xvcnBpY2tlciBpbXBsZW1lbnRzIE9uQ2hhbmdlcywgT25EZXN0cm95IHtcbiAgcHJpdmF0ZSBfc2Nyb2xsU3RyYXRlZ3k6ICgpID0+IFNjcm9sbFN0cmF0ZWd5O1xuICBwcml2YXRlIF9pbnB1dFN0YXRlQ2hhbmdlcyA9IFN1YnNjcmlwdGlvbi5FTVBUWTtcblxuICAvKiogQ3VzdG9tIGNvbG9ycGlja2VyIGNvbnRlbnQgc2V0IGJ5IHRoZSBjb25zdW1lci4gKi9cbiAgQElucHV0KCkgY29udGVudCE6IFRlbXBsYXRlUmVmPGFueT47XG5cbiAgLyoqIEVtaXRzIHdoZW4gdGhlIGNvbG9ycGlja2VyIGhhcyBiZWVuIG9wZW5lZC4gKi9cbiAgQE91dHB1dCgnb3BlbmVkJykgb3BlbmVkU3RyZWFtOiBFdmVudEVtaXR0ZXI8dm9pZD4gPSBuZXcgRXZlbnRFbWl0dGVyPHZvaWQ+KCk7XG5cbiAgLyoqIEVtaXRzIHdoZW4gdGhlIGNvbG9ycGlja2VyIGhhcyBiZWVuIGNsb3NlZC4gKi9cbiAgQE91dHB1dCgnY2xvc2VkJykgY2xvc2VkU3RyZWFtOiBFdmVudEVtaXR0ZXI8dm9pZD4gPSBuZXcgRXZlbnRFbWl0dGVyPHZvaWQ+KCk7XG5cbiAgQElucHV0KCkgZ2V0IGRpc2FibGVkKCkge1xuICAgIHJldHVybiB0aGlzLl9kaXNhYmxlZCA9PT0gdW5kZWZpbmVkICYmIHRoaXMucGlja2VySW5wdXRcbiAgICAgID8gdGhpcy5waWNrZXJJbnB1dC5kaXNhYmxlZFxuICAgICAgOiAhIXRoaXMuX2Rpc2FibGVkO1xuICB9XG4gIHNldCBkaXNhYmxlZCh2YWx1ZTogYm9vbGVhbikge1xuICAgIGNvbnN0IG5ld1ZhbHVlID0gY29lcmNlQm9vbGVhblByb3BlcnR5KHZhbHVlKTtcblxuICAgIGlmIChuZXdWYWx1ZSAhPT0gdGhpcy5fZGlzYWJsZWQpIHtcbiAgICAgIHRoaXMuX2Rpc2FibGVkID0gbmV3VmFsdWU7XG4gICAgICB0aGlzLl9kaXNhYmxlZENoYW5nZS5uZXh0KG5ld1ZhbHVlKTtcbiAgICB9XG4gIH1cbiAgcHJpdmF0ZSBfZGlzYWJsZWQhOiBib29sZWFuO1xuXG4gIC8qKiBQcmVmZXJyZWQgcG9zaXRpb24gb2YgdGhlIGNvbG9ycGlja2VyIGluIHRoZSBYIGF4aXMuICovXG4gIEBJbnB1dCgpXG4gIHhQb3NpdGlvbjogQ29sb3JwaWNrZXJEcm9wZG93blBvc2l0aW9uWCA9ICdzdGFydCc7XG5cbiAgLyoqIFByZWZlcnJlZCBwb3NpdGlvbiBvZiB0aGUgY29sb3JwaWNrZXIgaW4gdGhlIFkgYXhpcy4gKi9cbiAgQElucHV0KClcbiAgeVBvc2l0aW9uOiBDb2xvcnBpY2tlckRyb3Bkb3duUG9zaXRpb25ZID0gJ2JlbG93JztcblxuICAvKipcbiAgICogV2hldGhlciB0byByZXN0b3JlIGZvY3VzIHRvIHRoZSBwcmV2aW91c2x5LWZvY3VzZWQgZWxlbWVudCB3aGVuIHRoZSBwYW5lbCBpcyBjbG9zZWQuXG4gICAqIE5vdGUgdGhhdCBhdXRvbWF0aWMgZm9jdXMgcmVzdG9yYXRpb24gaXMgYW4gYWNjZXNzaWJpbGl0eSBmZWF0dXJlIGFuZCBpdCBpcyByZWNvbW1lbmRlZCB0aGF0XG4gICAqIHlvdSBwcm92aWRlIHlvdXIgb3duIGVxdWl2YWxlbnQsIGlmIHlvdSBkZWNpZGUgdG8gdHVybiBpdCBvZmYuXG4gICAqL1xuICBASW5wdXQoKVxuICBnZXQgcmVzdG9yZUZvY3VzKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9yZXN0b3JlRm9jdXM7XG4gIH1cbiAgc2V0IHJlc3RvcmVGb2N1cyh2YWx1ZTogYm9vbGVhbikge1xuICAgIHRoaXMuX3Jlc3RvcmVGb2N1cyA9IGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSh2YWx1ZSk7XG4gIH1cbiAgcHJpdmF0ZSBfcmVzdG9yZUZvY3VzID0gdHJ1ZTtcblxuICAvKiogV2hldGhlciB0aGUgcGFuZWwgaXMgb3Blbi4gKi9cbiAgQElucHV0KClcbiAgZ2V0IG9wZW5lZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fb3BlbmVkO1xuICB9XG4gIHNldCBvcGVuZWQodmFsdWU6IGJvb2xlYW4pIHtcbiAgICBjb2VyY2VCb29sZWFuUHJvcGVydHkodmFsdWUpID8gdGhpcy5vcGVuKCkgOiB0aGlzLmNsb3NlKCk7XG4gIH1cbiAgcHJpdmF0ZSBfb3BlbmVkID0gZmFsc2U7XG5cbiAgLyoqIFRoZSBpZCBmb3IgdGhlIGNvbG9ycGlja2VyIHBhbmVsLiAqL1xuICBpZCA9IGBtdHgtY29sb3JwaWNrZXItJHtjb2xvcnBpY2tlclVpZCsrfWA7XG5cbiAgLyoqIENvbG9yIHBhbGV0dGUgdG8gdXNlIG9uIHRoZSBjb2xvcnBpY2tlcidzIHBhbmVsLiAqL1xuICBASW5wdXQoKVxuICBnZXQgY29sb3IoKTogVGhlbWVQYWxldHRlIHtcbiAgICByZXR1cm4gdGhpcy5fY29sb3IgfHwgKHRoaXMucGlja2VySW5wdXQgPyB0aGlzLnBpY2tlcklucHV0LmdldFRoZW1lUGFsZXR0ZSgpIDogdW5kZWZpbmVkKTtcbiAgfVxuICBzZXQgY29sb3IodmFsdWU6IFRoZW1lUGFsZXR0ZSkge1xuICAgIHRoaXMuX2NvbG9yID0gdmFsdWU7XG4gIH1cbiAgcHJpdmF0ZSBfY29sb3I6IFRoZW1lUGFsZXR0ZTtcblxuICAvKiogVGhlIGlucHV0IGFuZCBvdXRwdXQgY29sb3IgZm9ybWF0LiAqL1xuICBASW5wdXQoKVxuICBnZXQgZm9ybWF0KCk6IENvbG9yRm9ybWF0IHtcbiAgICByZXR1cm4gdGhpcy5fZm9ybWF0IHx8IHRoaXMucGlja2VySW5wdXQuZm9ybWF0O1xuICB9XG4gIHNldCBmb3JtYXQodmFsdWU6IENvbG9yRm9ybWF0KSB7XG4gICAgdGhpcy5fZm9ybWF0ID0gdmFsdWU7XG4gIH1cbiAgX2Zvcm1hdCE6IENvbG9yRm9ybWF0O1xuXG4gIC8qKiBUaGUgY3VycmVudGx5IHNlbGVjdGVkIGNvbG9yLiAqL1xuICBnZXQgc2VsZWN0ZWQoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5fdmFsaWRTZWxlY3RlZDtcbiAgfVxuICBzZXQgc2VsZWN0ZWQodmFsdWU6IHN0cmluZykge1xuICAgIHRoaXMuX3ZhbGlkU2VsZWN0ZWQgPSB2YWx1ZTtcbiAgfVxuICBwcml2YXRlIF92YWxpZFNlbGVjdGVkOiBzdHJpbmcgPSAnJztcblxuICAvKiogQSByZWZlcmVuY2UgdG8gdGhlIG92ZXJsYXkgd2hlbiB0aGUgcGlja2VyIGlzIG9wZW5lZCBhcyBhIHBvcHVwLiAqL1xuICBwcml2YXRlIF9vdmVybGF5UmVmITogT3ZlcmxheVJlZiB8IG51bGw7XG5cbiAgLyoqIFJlZmVyZW5jZSB0byB0aGUgY29tcG9uZW50IGluc3RhbmNlIHJlbmRlcmVkIGluIHRoZSBvdmVybGF5LiAqL1xuICBwcml2YXRlIF9jb21wb25lbnRSZWYhOiBDb21wb25lbnRSZWY8TXR4Q29sb3JwaWNrZXJDb250ZW50PiB8IG51bGw7XG5cbiAgLyoqIFRoZSBlbGVtZW50IHRoYXQgd2FzIGZvY3VzZWQgYmVmb3JlIHRoZSBjb2xvcnBpY2tlciB3YXMgb3BlbmVkLiAqL1xuICBwcml2YXRlIF9mb2N1c2VkRWxlbWVudEJlZm9yZU9wZW46IEhUTUxFbGVtZW50IHwgbnVsbCA9IG51bGw7XG5cbiAgLyoqIFVuaXF1ZSBjbGFzcyB0aGF0IHdpbGwgYmUgYWRkZWQgdG8gdGhlIGJhY2tkcm9wIHNvIHRoYXQgdGhlIHRlc3QgaGFybmVzc2VzIGNhbiBsb29rIGl0IHVwLiAqL1xuICBwcml2YXRlIF9iYWNrZHJvcEhhcm5lc3NDbGFzcyA9IGAke3RoaXMuaWR9LWJhY2tkcm9wYDtcblxuICAvKiogVGhlIGlucHV0IGVsZW1lbnQgdGhpcyBjb2xvcnBpY2tlciBpcyBhc3NvY2lhdGVkIHdpdGguICovXG4gIHBpY2tlcklucHV0ITogTXR4Q29sb3JwaWNrZXJJbnB1dDtcblxuICAvKiogRW1pdHMgd2hlbiB0aGUgZGF0ZXBpY2tlciBpcyBkaXNhYmxlZC4gKi9cbiAgcmVhZG9ubHkgX2Rpc2FibGVkQ2hhbmdlID0gbmV3IFN1YmplY3Q8Ym9vbGVhbj4oKTtcblxuICAvKiogRW1pdHMgbmV3IHNlbGVjdGVkIGNvbG9yIHdoZW4gc2VsZWN0ZWQgY29sb3IgY2hhbmdlcy4gKi9cbiAgcmVhZG9ubHkgX3NlbGVjdGVkQ2hhbmdlZCA9IG5ldyBTdWJqZWN0PHN0cmluZz4oKTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIF9vdmVybGF5OiBPdmVybGF5LFxuICAgIHByaXZhdGUgX25nWm9uZTogTmdab25lLFxuICAgIHByaXZhdGUgX3ZpZXdDb250YWluZXJSZWY6IFZpZXdDb250YWluZXJSZWYsXG4gICAgQEluamVjdChNVFhfQ09MT1JQSUNLRVJfU0NST0xMX1NUUkFURUdZKSBzY3JvbGxTdHJhdGVneTogYW55LFxuICAgIEBPcHRpb25hbCgpIHByaXZhdGUgX2RpcjogRGlyZWN0aW9uYWxpdHksXG4gICAgQE9wdGlvbmFsKCkgQEluamVjdChET0NVTUVOVCkgcHJpdmF0ZSBfZG9jdW1lbnQ6IGFueVxuICApIHtcbiAgICB0aGlzLl9zY3JvbGxTdHJhdGVneSA9IHNjcm9sbFN0cmF0ZWd5O1xuICB9XG5cbiAgbmdPbkNoYW5nZXMoKSB7fVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMuX2Rlc3Ryb3lPdmVybGF5KCk7XG4gICAgdGhpcy5jbG9zZSgpO1xuICAgIHRoaXMuX2lucHV0U3RhdGVDaGFuZ2VzLnVuc3Vic2NyaWJlKCk7XG4gICAgdGhpcy5fZGlzYWJsZWRDaGFuZ2UuY29tcGxldGUoKTtcbiAgfVxuXG4gIC8qKiBTZWxlY3RzIHRoZSBnaXZlbiBjb2xvci4gKi9cbiAgc2VsZWN0KG5leHRWYWw6IHN0cmluZyk6IHZvaWQge1xuICAgIGNvbnN0IG9sZFZhbHVlID0gdGhpcy5zZWxlY3RlZDtcbiAgICB0aGlzLnNlbGVjdGVkID0gbmV4dFZhbDtcblxuICAgIC8vIFRPRE86IGBuZXh0VmFsYCBzaG91bGQgY29tcGFyZSB3aXRoIGBvbGRWYWx1ZWBcbiAgICB0aGlzLl9zZWxlY3RlZENoYW5nZWQubmV4dChuZXh0VmFsKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWdpc3RlciBhbiBpbnB1dCB3aXRoIHRoaXMgY29sb3JwaWNrZXIuXG4gICAqIEBwYXJhbSBpbnB1dCBUaGUgY29sb3JwaWNrZXIgaW5wdXQgdG8gcmVnaXN0ZXIgd2l0aCB0aGlzIGNvbG9ycGlja2VyLlxuICAgKi9cbiAgcmVnaXN0ZXJJbnB1dChpbnB1dDogTXR4Q29sb3JwaWNrZXJJbnB1dCk6IHZvaWQge1xuICAgIGlmICh0aGlzLnBpY2tlcklucHV0KSB7XG4gICAgICB0aHJvdyBFcnJvcignQSBDb2xvcnBpY2tlciBjYW4gb25seSBiZSBhc3NvY2lhdGVkIHdpdGggYSBzaW5nbGUgaW5wdXQuJyk7XG4gICAgfVxuICAgIHRoaXMucGlja2VySW5wdXQgPSBpbnB1dDtcbiAgICB0aGlzLl9pbnB1dFN0YXRlQ2hhbmdlcyA9IGlucHV0Ll92YWx1ZUNoYW5nZS5zdWJzY3JpYmUoXG4gICAgICAodmFsdWU6IHN0cmluZykgPT4gKHRoaXMuc2VsZWN0ZWQgPSB2YWx1ZSlcbiAgICApO1xuICB9XG5cbiAgLyoqIE9wZW4gdGhlIHBhbmVsLiAqL1xuICBvcGVuKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLl9vcGVuZWQgfHwgdGhpcy5kaXNhYmxlZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoIXRoaXMucGlja2VySW5wdXQpIHtcbiAgICAgIHRocm93IEVycm9yKCdBdHRlbXB0ZWQgdG8gb3BlbiBhbiBDb2xvcnBpY2tlciB3aXRoIG5vIGFzc29jaWF0ZWQgaW5wdXQuJyk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX2RvY3VtZW50KSB7XG4gICAgICB0aGlzLl9mb2N1c2VkRWxlbWVudEJlZm9yZU9wZW4gPSB0aGlzLl9kb2N1bWVudC5hY3RpdmVFbGVtZW50O1xuICAgIH1cblxuICAgIHRoaXMuX29wZW5PdmVybGF5KCk7XG4gICAgdGhpcy5fb3BlbmVkID0gdHJ1ZTtcbiAgICB0aGlzLm9wZW5lZFN0cmVhbS5lbWl0KCk7XG4gIH1cblxuICAvKiogQ2xvc2UgdGhlIHBhbmVsLiAqL1xuICBjbG9zZSgpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMuX29wZW5lZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICh0aGlzLl9jb21wb25lbnRSZWYpIHtcbiAgICAgIGNvbnN0IGluc3RhbmNlID0gdGhpcy5fY29tcG9uZW50UmVmLmluc3RhbmNlO1xuICAgICAgaW5zdGFuY2UuX3N0YXJ0RXhpdEFuaW1hdGlvbigpO1xuICAgICAgaW5zdGFuY2UuX2FuaW1hdGlvbkRvbmUucGlwZSh0YWtlKDEpKS5zdWJzY3JpYmUoKCkgPT4gdGhpcy5fZGVzdHJveU92ZXJsYXkoKSk7XG4gICAgfVxuXG4gICAgY29uc3QgY29tcGxldGVDbG9zZSA9ICgpID0+IHtcbiAgICAgIC8vIFRoZSBgX29wZW5lZGAgY291bGQndmUgYmVlbiByZXNldCBhbHJlYWR5IGlmXG4gICAgICAvLyB3ZSBnb3QgdHdvIGV2ZW50cyBpbiBxdWljayBzdWNjZXNzaW9uLlxuICAgICAgaWYgKHRoaXMuX29wZW5lZCkge1xuICAgICAgICB0aGlzLl9vcGVuZWQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5jbG9zZWRTdHJlYW0uZW1pdCgpO1xuICAgICAgICB0aGlzLl9mb2N1c2VkRWxlbWVudEJlZm9yZU9wZW4gPSBudWxsO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBpZiAoXG4gICAgICB0aGlzLl9yZXN0b3JlRm9jdXMgJiZcbiAgICAgIHRoaXMuX2ZvY3VzZWRFbGVtZW50QmVmb3JlT3BlbiAmJlxuICAgICAgdHlwZW9mIHRoaXMuX2ZvY3VzZWRFbGVtZW50QmVmb3JlT3Blbi5mb2N1cyA9PT0gJ2Z1bmN0aW9uJ1xuICAgICkge1xuICAgICAgLy8gQmVjYXVzZSBJRSBtb3ZlcyBmb2N1cyBhc3luY2hyb25vdXNseSwgd2UgY2FuJ3QgY291bnQgb24gaXQgYmVpbmcgcmVzdG9yZWQgYmVmb3JlIHdlJ3ZlXG4gICAgICAvLyBtYXJrZWQgdGhlIGNvbG9ycGlja2VyIGFzIGNsb3NlZC4gSWYgdGhlIGV2ZW50IGZpcmVzIG91dCBvZiBzZXF1ZW5jZSBhbmQgdGhlIGVsZW1lbnQgdGhhdFxuICAgICAgLy8gd2UncmUgcmVmb2N1c2luZyBvcGVucyB0aGUgY29sb3JwaWNrZXIgb24gZm9jdXMsIHRoZSB1c2VyIGNvdWxkIGJlIHN0dWNrIHdpdGggbm90IGJlaW5nXG4gICAgICAvLyBhYmxlIHRvIGNsb3NlIHRoZSBwYW5lbCBhdCBhbGwuIFdlIHdvcmsgYXJvdW5kIGl0IGJ5IG1ha2luZyB0aGUgbG9naWMsIHRoYXQgbWFya3NcbiAgICAgIC8vIHRoZSBjb2xvcnBpY2tlciBhcyBjbG9zZWQsIGFzeW5jIGFzIHdlbGwuXG4gICAgICB0aGlzLl9mb2N1c2VkRWxlbWVudEJlZm9yZU9wZW4uZm9jdXMoKTtcbiAgICAgIHNldFRpbWVvdXQoY29tcGxldGVDbG9zZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbXBsZXRlQ2xvc2UoKTtcbiAgICB9XG4gIH1cblxuICAvKiogRm9yd2FyZHMgcmVsZXZhbnQgdmFsdWVzIGZyb20gdGhlIGNvbG9ycGlja2VyIHRvIHRoZSBjb2xvcnBpY2tlciBjb250ZW50IGluc2lkZSB0aGUgb3ZlcmxheS4gKi9cbiAgcHJvdGVjdGVkIF9mb3J3YXJkQ29udGVudFZhbHVlcyhpbnN0YW5jZTogTXR4Q29sb3JwaWNrZXJDb250ZW50KSB7XG4gICAgaW5zdGFuY2UucGlja2VyID0gdGhpcztcbiAgICBpbnN0YW5jZS5jb2xvciA9IHRoaXMuY29sb3I7XG4gIH1cblxuICAvKiogT3BlbiB0aGUgY29sb3BpY2tlciBhcyBhIHBvcHVwLiAqL1xuICBwcml2YXRlIF9vcGVuT3ZlcmxheSgpOiB2b2lkIHtcbiAgICB0aGlzLl9kZXN0cm95T3ZlcmxheSgpO1xuXG4gICAgY29uc3QgbGFiZWxJZCA9IHRoaXMucGlja2VySW5wdXQuZ2V0T3ZlcmxheUxhYmVsSWQoKTtcbiAgICBjb25zdCBwb3J0YWwgPSBuZXcgQ29tcG9uZW50UG9ydGFsPE10eENvbG9ycGlja2VyQ29udGVudD4oXG4gICAgICBNdHhDb2xvcnBpY2tlckNvbnRlbnQsXG4gICAgICB0aGlzLl92aWV3Q29udGFpbmVyUmVmXG4gICAgKTtcbiAgICBjb25zdCBvdmVybGF5UmVmID0gKHRoaXMuX292ZXJsYXlSZWYgPSB0aGlzLl9vdmVybGF5LmNyZWF0ZShcbiAgICAgIG5ldyBPdmVybGF5Q29uZmlnKHtcbiAgICAgICAgcG9zaXRpb25TdHJhdGVneTogdGhpcy5fZ2V0RHJvcGRvd25TdHJhdGVneSgpLFxuICAgICAgICBoYXNCYWNrZHJvcDogdHJ1ZSxcbiAgICAgICAgYmFja2Ryb3BDbGFzczogWydtYXQtb3ZlcmxheS10cmFuc3BhcmVudC1iYWNrZHJvcCcsIHRoaXMuX2JhY2tkcm9wSGFybmVzc0NsYXNzXSxcbiAgICAgICAgZGlyZWN0aW9uOiB0aGlzLl9kaXIsXG4gICAgICAgIHNjcm9sbFN0cmF0ZWd5OiB0aGlzLl9zY3JvbGxTdHJhdGVneSgpLFxuICAgICAgICBwYW5lbENsYXNzOiBgbXR4LWNvbG9ycGlja2VyLXBvcHVwYCxcbiAgICAgIH0pXG4gICAgKSk7XG4gICAgY29uc3Qgb3ZlcmxheUVsZW1lbnQgPSBvdmVybGF5UmVmLm92ZXJsYXlFbGVtZW50O1xuICAgIG92ZXJsYXlFbGVtZW50LnNldEF0dHJpYnV0ZSgncm9sZScsICdkaWFsb2cnKTtcblxuICAgIGlmIChsYWJlbElkKSB7XG4gICAgICBvdmVybGF5RWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2FyaWEtbGFiZWxsZWRieScsIGxhYmVsSWQpO1xuICAgIH1cblxuICAgIHRoaXMuX2dldENsb3NlU3RyZWFtKG92ZXJsYXlSZWYpLnN1YnNjcmliZShldmVudCA9PiB7XG4gICAgICBpZiAoZXZlbnQpIHtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuY2xvc2UoKTtcbiAgICB9KTtcblxuICAgIHRoaXMuX2NvbXBvbmVudFJlZiA9IG92ZXJsYXlSZWYuYXR0YWNoKHBvcnRhbCk7XG4gICAgdGhpcy5fZm9yd2FyZENvbnRlbnRWYWx1ZXModGhpcy5fY29tcG9uZW50UmVmLmluc3RhbmNlKTtcblxuICAgIC8vIFVwZGF0ZSB0aGUgcG9zaXRpb24gb25jZSB0aGUgcGFuZWwgaGFzIHJlbmRlcmVkLiBPbmx5IHJlbGV2YW50IGluIGRyb3Bkb3duIG1vZGUuXG4gICAgdGhpcy5fbmdab25lLm9uU3RhYmxlLnBpcGUodGFrZSgxKSkuc3Vic2NyaWJlKCgpID0+IG92ZXJsYXlSZWYudXBkYXRlUG9zaXRpb24oKSk7XG4gIH1cblxuICAvKiogRGVzdHJveXMgdGhlIGN1cnJlbnQgb3ZlcmxheS4gKi9cbiAgcHJpdmF0ZSBfZGVzdHJveU92ZXJsYXkoKSB7XG4gICAgaWYgKHRoaXMuX292ZXJsYXlSZWYpIHtcbiAgICAgIHRoaXMuX292ZXJsYXlSZWYuZGlzcG9zZSgpO1xuICAgICAgdGhpcy5fb3ZlcmxheVJlZiA9IHRoaXMuX2NvbXBvbmVudFJlZiA9IG51bGw7XG4gICAgfVxuICB9XG5cbiAgLyoqIEdldHMgYSBwb3NpdGlvbiBzdHJhdGVneSB0aGF0IHdpbGwgb3BlbiB0aGUgcGFuZWwgYXMgYSBkcm9wZG93bi4gKi9cbiAgcHJpdmF0ZSBfZ2V0RHJvcGRvd25TdHJhdGVneSgpIHtcbiAgICBjb25zdCBzdHJhdGVneSA9IHRoaXMuX292ZXJsYXlcbiAgICAgIC5wb3NpdGlvbigpXG4gICAgICAuZmxleGlibGVDb25uZWN0ZWRUbyh0aGlzLnBpY2tlcklucHV0LmdldENvbm5lY3RlZE92ZXJsYXlPcmlnaW4oKSlcbiAgICAgIC53aXRoVHJhbnNmb3JtT3JpZ2luT24oJy5tdHgtY29sb3JwaWNrZXItY29udGVudCcpXG4gICAgICAud2l0aEZsZXhpYmxlRGltZW5zaW9ucyhmYWxzZSlcbiAgICAgIC53aXRoVmlld3BvcnRNYXJnaW4oOClcbiAgICAgIC53aXRoTG9ja2VkUG9zaXRpb24oKTtcblxuICAgIHJldHVybiB0aGlzLl9zZXRDb25uZWN0ZWRQb3NpdGlvbnMoc3RyYXRlZ3kpO1xuICB9XG5cbiAgLyoqIFNldHMgdGhlIHBvc2l0aW9ucyBvZiB0aGUgY29sb3JwaWNrZXIgaW4gZHJvcGRvd24gbW9kZSBiYXNlZCBvbiB0aGUgY3VycmVudCBjb25maWd1cmF0aW9uLiAqL1xuICBwcml2YXRlIF9zZXRDb25uZWN0ZWRQb3NpdGlvbnMoc3RyYXRlZ3k6IEZsZXhpYmxlQ29ubmVjdGVkUG9zaXRpb25TdHJhdGVneSkge1xuICAgIGNvbnN0IHByaW1hcnlYID0gdGhpcy54UG9zaXRpb24gPT09ICdlbmQnID8gJ2VuZCcgOiAnc3RhcnQnO1xuICAgIGNvbnN0IHNlY29uZGFyeVggPSBwcmltYXJ5WCA9PT0gJ3N0YXJ0JyA/ICdlbmQnIDogJ3N0YXJ0JztcbiAgICBjb25zdCBwcmltYXJ5WSA9IHRoaXMueVBvc2l0aW9uID09PSAnYWJvdmUnID8gJ2JvdHRvbScgOiAndG9wJztcbiAgICBjb25zdCBzZWNvbmRhcnlZID0gcHJpbWFyeVkgPT09ICd0b3AnID8gJ2JvdHRvbScgOiAndG9wJztcblxuICAgIHJldHVybiBzdHJhdGVneS53aXRoUG9zaXRpb25zKFtcbiAgICAgIHtcbiAgICAgICAgb3JpZ2luWDogcHJpbWFyeVgsXG4gICAgICAgIG9yaWdpblk6IHNlY29uZGFyeVksXG4gICAgICAgIG92ZXJsYXlYOiBwcmltYXJ5WCxcbiAgICAgICAgb3ZlcmxheVk6IHByaW1hcnlZLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgb3JpZ2luWDogcHJpbWFyeVgsXG4gICAgICAgIG9yaWdpblk6IHByaW1hcnlZLFxuICAgICAgICBvdmVybGF5WDogcHJpbWFyeVgsXG4gICAgICAgIG92ZXJsYXlZOiBzZWNvbmRhcnlZLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgb3JpZ2luWDogc2Vjb25kYXJ5WCxcbiAgICAgICAgb3JpZ2luWTogc2Vjb25kYXJ5WSxcbiAgICAgICAgb3ZlcmxheVg6IHNlY29uZGFyeVgsXG4gICAgICAgIG92ZXJsYXlZOiBwcmltYXJ5WSxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIG9yaWdpblg6IHNlY29uZGFyeVgsXG4gICAgICAgIG9yaWdpblk6IHByaW1hcnlZLFxuICAgICAgICBvdmVybGF5WDogc2Vjb25kYXJ5WCxcbiAgICAgICAgb3ZlcmxheVk6IHNlY29uZGFyeVksXG4gICAgICB9LFxuICAgIF0pO1xuICB9XG5cbiAgLyoqIEdldHMgYW4gb2JzZXJ2YWJsZSB0aGF0IHdpbGwgZW1pdCB3aGVuIHRoZSBvdmVybGF5IGlzIHN1cHBvc2VkIHRvIGJlIGNsb3NlZC4gKi9cbiAgcHJpdmF0ZSBfZ2V0Q2xvc2VTdHJlYW0ob3ZlcmxheVJlZjogT3ZlcmxheVJlZikge1xuICAgIHJldHVybiBtZXJnZShcbiAgICAgIG92ZXJsYXlSZWYuYmFja2Ryb3BDbGljaygpLFxuICAgICAgb3ZlcmxheVJlZi5kZXRhY2htZW50cygpLFxuICAgICAgb3ZlcmxheVJlZi5rZXlkb3duRXZlbnRzKCkucGlwZShcbiAgICAgICAgZmlsdGVyKGV2ZW50ID0+IHtcbiAgICAgICAgICAvLyBDbG9zaW5nIG9uIGFsdCArIHVwIGlzIG9ubHkgdmFsaWQgd2hlbiB0aGVyZSdzIGFuIGlucHV0IGFzc29jaWF0ZWQgd2l0aCB0aGUgY29sb3JwaWNrZXIuXG4gICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIChldmVudC5rZXlDb2RlID09PSBFU0NBUEUgJiYgIWhhc01vZGlmaWVyS2V5KGV2ZW50KSkgfHxcbiAgICAgICAgICAgICh0aGlzLnBpY2tlcklucHV0ICYmIGhhc01vZGlmaWVyS2V5KGV2ZW50LCAnYWx0S2V5JykgJiYgZXZlbnQua2V5Q29kZSA9PT0gVVBfQVJST1cpXG4gICAgICAgICAgKTtcbiAgICAgICAgfSlcbiAgICAgIClcbiAgICApO1xuICB9XG5cbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX2Rpc2FibGVkOiBCb29sZWFuSW5wdXQ7XG59XG4iLCI8bmctdGVtcGxhdGUgW25nSWZdPVwicGlja2VyLmNvbnRlbnRcIiBbbmdJZkVsc2VdPVwiZGVmYXVsdFwiXG4gICAgICAgICAgICAgW25nVGVtcGxhdGVPdXRsZXRdPVwicGlja2VyLmNvbnRlbnRcIj5cbjwvbmctdGVtcGxhdGU+XG48bmctdGVtcGxhdGUgI2RlZmF1bHQ+XG4gIDxjb2xvci1jaHJvbWUgW2NvbG9yXT1cInBpY2tlci5zZWxlY3RlZFwiXG4gICAgICAgICAgICAgICAgKG9uQ2hhbmdlQ29tcGxldGUpPVwicGlja2VyLnNlbGVjdChnZXRDb2xvclN0cmluZygkZXZlbnQpKVwiPlxuICA8L2NvbG9yLWNocm9tZT5cbjwvbmctdGVtcGxhdGU+XG4iXX0=