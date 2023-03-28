import { ChangeDetectionStrategy, Component, EventEmitter, inject, Inject, InjectionToken, Input, Optional, Output, ViewChild, ViewEncapsulation, } from '@angular/core';
import { coerceBooleanProperty, coerceStringArray } from '@angular/cdk/coercion';
import { ESCAPE, hasModifierKey, UP_ARROW } from '@angular/cdk/keycodes';
import { Overlay, OverlayConfig, } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { _getFocusedElementPierceShadowDom } from '@angular/cdk/platform';
import { mixinColor } from '@angular/material/core';
import { merge, Subject, Subscription } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import { MtxCalendar } from './calendar';
import { createMissingDateImplError } from './datetimepicker-errors';
import { mtxDatetimepickerAnimations } from './datetimepicker-animations';
import { DOCUMENT } from '@angular/common';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "@angular/cdk/a11y";
import * as i3 from "./calendar";
import * as i4 from "@angular/cdk/overlay";
import * as i5 from "@ng-matero/extensions/core";
import * as i6 from "@angular/cdk/bidi";
/** Used to generate a unique ID for each datetimepicker instance. */
let datetimepickerUid = 0;
/** Injection token that determines the scroll handling while the calendar is open. */
export const MTX_DATETIMEPICKER_SCROLL_STRATEGY = new InjectionToken('mtx-datetimepicker-scroll-strategy');
export function MTX_DATETIMEPICKER_SCROLL_STRATEGY_FACTORY(overlay) {
    return () => overlay.scrollStrategies.reposition();
}
export const MTX_DATETIMEPICKER_SCROLL_STRATEGY_FACTORY_PROVIDER = {
    provide: MTX_DATETIMEPICKER_SCROLL_STRATEGY,
    deps: [Overlay],
    useFactory: MTX_DATETIMEPICKER_SCROLL_STRATEGY_FACTORY,
};
// Boilerplate for applying mixins to MtxDatetimepickerContent.
/** @docs-private */
const _MtxDatetimepickerContentBase = mixinColor(class {
    constructor(_elementRef) {
        this._elementRef = _elementRef;
    }
});
/**
 * Component used as the content for the datetimepicker dialog and popup. We use this instead of
 * using MtxCalendar directly as the content so we can control the initial focus. This also gives us
 * a place to put additional features of the popup that are not part of the calendar itself in the
 * future. (e.g. confirmation buttons).
 * @docs-private
 */
export class MtxDatetimepickerContent extends _MtxDatetimepickerContentBase {
    constructor(elementRef, _changeDetectorRef) {
        super(elementRef);
        this._changeDetectorRef = _changeDetectorRef;
        /** Emits when an animation has finished. */
        this._animationDone = new Subject();
        /** Id of the label for the `role="dialog"` element. */
        this._dialogLabelId = null;
    }
    ngOnInit() {
        this._animationState = this.datetimepicker.touchUi ? 'enter-dialog' : 'enter-dropdown';
    }
    ngAfterContentInit() {
        this._calendar._focusActiveCell();
    }
    _startExitAnimation() {
        this._animationState = 'void';
        this._changeDetectorRef.markForCheck();
    }
    ngOnDestroy() {
        this._animationDone.complete();
    }
}
/** @nocollapse */ MtxDatetimepickerContent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MtxDatetimepickerContent, deps: [{ token: i0.ElementRef }, { token: i0.ChangeDetectorRef }], target: i0.ɵɵFactoryTarget.Component });
/** @nocollapse */ MtxDatetimepickerContent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.1", type: MtxDatetimepickerContent, selector: "mtx-datetimepicker-content", inputs: { color: "color" }, host: { listeners: { "@transformPanel.done": "_animationDone.next()" }, properties: { "class.mtx-datetimepicker-content-touch": "datetimepicker?.touchUi", "attr.mode": "datetimepicker.mode", "@transformPanel": "_animationState" }, classAttribute: "mtx-datetimepicker-content" }, viewQueries: [{ propertyName: "_calendar", first: true, predicate: MtxCalendar, descendants: true, static: true }], usesInheritance: true, ngImport: i0, template: "<div cdkTrapFocus\n     role=\"dialog\"\n     [attr.aria-modal]=\"true\"\n     [attr.aria-labelledby]=\"_dialogLabelId ?? undefined\"\n     [attr.mode]=\"datetimepicker.mode\"\n     class=\"mtx-datetimepicker-content-container\">\n  <mtx-calendar [id]=\"datetimepicker.id\"\n                [ngClass]=\"datetimepicker.panelClass\"\n                [attr.mode]=\"datetimepicker.mode\"\n                [type]=\"datetimepicker.type\"\n                [startAt]=\"datetimepicker.startAt\"\n                [startView]=\"datetimepicker.startView\"\n                [maxDate]=\"datetimepicker._maxDate\"\n                [minDate]=\"datetimepicker._minDate\"\n                [dateFilter]=\"datetimepicker._dateFilter\"\n                [multiYearSelector]=\"datetimepicker.multiYearSelector\"\n                [preventSameDateTimeSelection]=\"datetimepicker.preventSameDateTimeSelection\"\n                [timeInterval]=\"datetimepicker.timeInterval\"\n                [twelvehour]=\"datetimepicker.twelvehour\"\n                [selected]=\"datetimepicker._selected\"\n                [timeInput]=\"datetimepicker.timeInput\"\n                (selectedChange)=\"datetimepicker._select($event)\"\n                (viewChanged)=\"datetimepicker._viewChanged($event)\"\n                (_userSelection)=\"datetimepicker.close()\"\n                [@fadeInCalendar]=\"'enter'\">\n  </mtx-calendar>\n</div>\n", styles: [".mtx-datetimepicker-content{display:block;border-radius:4px}.mtx-datetimepicker-content-container{display:flex;flex-direction:column;justify-content:space-between}.mtx-datetimepicker-content .mtx-calendar{width:296px;height:424px}.mtx-datetimepicker-content .mtx-calendar.mtx-calendar-with-time-input{height:490px}.mtx-datetimepicker-content[mode=landscape] .mtx-calendar{width:432px;height:328px}.mtx-datetimepicker-content[mode=landscape] .mtx-calendar.mtx-calendar-with-time-input{height:404px}@media all and (orientation: landscape){.mtx-datetimepicker-content[mode=auto] .mtx-calendar{width:432px;height:328px}.mtx-datetimepicker-content[mode=auto] .mtx-calendar.mtx-calendar-with-time-input{height:404px}}.mtx-datetimepicker-content-touch{display:block;max-height:80vh;position:relative;overflow:visible}.mtx-datetimepicker-content-touch .mtx-datetimepicker-content-container{min-height:300px;max-height:850px;min-width:250px;max-width:750px}.mtx-datetimepicker-content-touch .mtx-calendar{width:100%;height:auto}@media all and (orientation: landscape){.mtx-datetimepicker-content-touch .mtx-datetimepicker-content-container[mode=auto],.mtx-datetimepicker-content-touch .mtx-datetimepicker-content-container[mode=landscape]{width:120vh;height:80vh}.mtx-datetimepicker-content-touch .mtx-datetimepicker-content-container[mode=auto] .mtx-calendar,.mtx-datetimepicker-content-touch .mtx-datetimepicker-content-container[mode=landscape] .mtx-calendar{width:auto;height:100%}.mtx-datetimepicker-content-touch .mtx-datetimepicker-content-container[mode=portrait]{width:64vh;height:90vh}.mtx-datetimepicker-content-touch .mtx-datetimepicker-content-container[mode=portrait] .mtx-calendar{width:100%;height:auto}}@media all and (orientation: portrait){.mtx-datetimepicker-content-touch .mtx-datetimepicker-content-container[mode=auto],.mtx-datetimepicker-content-touch .mtx-datetimepicker-content-container[mode=portrait]{width:80vw;height:120vw}.mtx-datetimepicker-content-touch .mtx-datetimepicker-content-container[mode=auto] .mtx-calendar,.mtx-datetimepicker-content-touch .mtx-datetimepicker-content-container[mode=portrait] .mtx-calendar{width:100%;height:auto}.mtx-datetimepicker-content-touch .mtx-datetimepicker-content-container[mode=landscape]{width:90vw;height:64vw}.mtx-datetimepicker-content-touch .mtx-datetimepicker-content-container[mode=landscape] .mtx-calendar{width:auto;height:100%}.mtx-datetimepicker-content-touch .mtx-datetimepicker-content-container-with-actions{height:135vw}}\n"], dependencies: [{ kind: "directive", type: i1.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i2.CdkTrapFocus, selector: "[cdkTrapFocus]", inputs: ["cdkTrapFocus", "cdkTrapFocusAutoCapture"], exportAs: ["cdkTrapFocus"] }, { kind: "component", type: i3.MtxCalendar, selector: "mtx-calendar", inputs: ["multiYearSelector", "twelvehour", "startView", "timeInterval", "dateFilter", "preventSameDateTimeSelection", "type", "startAt", "timeInput", "selected", "minDate", "maxDate"], outputs: ["selectedChange", "viewChanged", "_userSelection"], exportAs: ["mtxCalendar"] }], animations: [
        mtxDatetimepickerAnimations.transformPanel,
        mtxDatetimepickerAnimations.fadeInCalendar,
    ], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MtxDatetimepickerContent, decorators: [{
            type: Component,
            args: [{ selector: 'mtx-datetimepicker-content', host: {
                        'class': 'mtx-datetimepicker-content',
                        '[class.mtx-datetimepicker-content-touch]': 'datetimepicker?.touchUi',
                        '[attr.mode]': 'datetimepicker.mode',
                        '[@transformPanel]': '_animationState',
                        '(@transformPanel.done)': '_animationDone.next()',
                    }, animations: [
                        mtxDatetimepickerAnimations.transformPanel,
                        mtxDatetimepickerAnimations.fadeInCalendar,
                    ], encapsulation: ViewEncapsulation.None, changeDetection: ChangeDetectionStrategy.OnPush, inputs: ['color'], template: "<div cdkTrapFocus\n     role=\"dialog\"\n     [attr.aria-modal]=\"true\"\n     [attr.aria-labelledby]=\"_dialogLabelId ?? undefined\"\n     [attr.mode]=\"datetimepicker.mode\"\n     class=\"mtx-datetimepicker-content-container\">\n  <mtx-calendar [id]=\"datetimepicker.id\"\n                [ngClass]=\"datetimepicker.panelClass\"\n                [attr.mode]=\"datetimepicker.mode\"\n                [type]=\"datetimepicker.type\"\n                [startAt]=\"datetimepicker.startAt\"\n                [startView]=\"datetimepicker.startView\"\n                [maxDate]=\"datetimepicker._maxDate\"\n                [minDate]=\"datetimepicker._minDate\"\n                [dateFilter]=\"datetimepicker._dateFilter\"\n                [multiYearSelector]=\"datetimepicker.multiYearSelector\"\n                [preventSameDateTimeSelection]=\"datetimepicker.preventSameDateTimeSelection\"\n                [timeInterval]=\"datetimepicker.timeInterval\"\n                [twelvehour]=\"datetimepicker.twelvehour\"\n                [selected]=\"datetimepicker._selected\"\n                [timeInput]=\"datetimepicker.timeInput\"\n                (selectedChange)=\"datetimepicker._select($event)\"\n                (viewChanged)=\"datetimepicker._viewChanged($event)\"\n                (_userSelection)=\"datetimepicker.close()\"\n                [@fadeInCalendar]=\"'enter'\">\n  </mtx-calendar>\n</div>\n", styles: [".mtx-datetimepicker-content{display:block;border-radius:4px}.mtx-datetimepicker-content-container{display:flex;flex-direction:column;justify-content:space-between}.mtx-datetimepicker-content .mtx-calendar{width:296px;height:424px}.mtx-datetimepicker-content .mtx-calendar.mtx-calendar-with-time-input{height:490px}.mtx-datetimepicker-content[mode=landscape] .mtx-calendar{width:432px;height:328px}.mtx-datetimepicker-content[mode=landscape] .mtx-calendar.mtx-calendar-with-time-input{height:404px}@media all and (orientation: landscape){.mtx-datetimepicker-content[mode=auto] .mtx-calendar{width:432px;height:328px}.mtx-datetimepicker-content[mode=auto] .mtx-calendar.mtx-calendar-with-time-input{height:404px}}.mtx-datetimepicker-content-touch{display:block;max-height:80vh;position:relative;overflow:visible}.mtx-datetimepicker-content-touch .mtx-datetimepicker-content-container{min-height:300px;max-height:850px;min-width:250px;max-width:750px}.mtx-datetimepicker-content-touch .mtx-calendar{width:100%;height:auto}@media all and (orientation: landscape){.mtx-datetimepicker-content-touch .mtx-datetimepicker-content-container[mode=auto],.mtx-datetimepicker-content-touch .mtx-datetimepicker-content-container[mode=landscape]{width:120vh;height:80vh}.mtx-datetimepicker-content-touch .mtx-datetimepicker-content-container[mode=auto] .mtx-calendar,.mtx-datetimepicker-content-touch .mtx-datetimepicker-content-container[mode=landscape] .mtx-calendar{width:auto;height:100%}.mtx-datetimepicker-content-touch .mtx-datetimepicker-content-container[mode=portrait]{width:64vh;height:90vh}.mtx-datetimepicker-content-touch .mtx-datetimepicker-content-container[mode=portrait] .mtx-calendar{width:100%;height:auto}}@media all and (orientation: portrait){.mtx-datetimepicker-content-touch .mtx-datetimepicker-content-container[mode=auto],.mtx-datetimepicker-content-touch .mtx-datetimepicker-content-container[mode=portrait]{width:80vw;height:120vw}.mtx-datetimepicker-content-touch .mtx-datetimepicker-content-container[mode=auto] .mtx-calendar,.mtx-datetimepicker-content-touch .mtx-datetimepicker-content-container[mode=portrait] .mtx-calendar{width:100%;height:auto}.mtx-datetimepicker-content-touch .mtx-datetimepicker-content-container[mode=landscape]{width:90vw;height:64vw}.mtx-datetimepicker-content-touch .mtx-datetimepicker-content-container[mode=landscape] .mtx-calendar{width:auto;height:100%}.mtx-datetimepicker-content-touch .mtx-datetimepicker-content-container-with-actions{height:135vw}}\n"] }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i0.ChangeDetectorRef }]; }, propDecorators: { _calendar: [{
                type: ViewChild,
                args: [MtxCalendar, { static: true }]
            }] } });
export class MtxDatetimepicker {
    /** Whether to show multi-year view. */
    get multiYearSelector() {
        return this._multiYearSelector;
    }
    set multiYearSelector(value) {
        this._multiYearSelector = coerceBooleanProperty(value);
    }
    /** Whether the clock uses 12 hour format. */
    get twelvehour() {
        return this._twelvehour;
    }
    set twelvehour(value) {
        this._twelvehour = coerceBooleanProperty(value);
    }
    /**
     * Classes to be passed to the date picker panel.
     * Supports string and string array values, similar to `ngClass`.
     */
    get panelClass() {
        return this._panelClass;
    }
    set panelClass(value) {
        this._panelClass = coerceStringArray(value);
    }
    /** Whether the calendar is open. */
    get opened() {
        return this._opened;
    }
    set opened(value) {
        coerceBooleanProperty(value) ? this.open() : this.close();
    }
    /** Color palette to use on the datetimepicker's calendar. */
    get color() {
        return (this._color ||
            (this.datetimepickerInput ? this.datetimepickerInput.getThemePalette() : undefined));
    }
    set color(value) {
        this._color = value;
    }
    constructor(_overlay, _ngZone, _viewContainerRef, _scrollStrategy, _dateAdapter, _dir) {
        this._overlay = _overlay;
        this._ngZone = _ngZone;
        this._viewContainerRef = _viewContainerRef;
        this._scrollStrategy = _scrollStrategy;
        this._dateAdapter = _dateAdapter;
        this._dir = _dir;
        this._document = inject(DOCUMENT);
        this._multiYearSelector = false;
        this._twelvehour = false;
        /** The view that the calendar should start in. */
        this.startView = 'month';
        /** The display mode of datetimepicker. */
        this.mode = 'auto';
        /** Step over minutes. */
        this.timeInterval = 1;
        /** Prevent user to select same date time */
        this.preventSameDateTimeSelection = false;
        /**
         * Emits new selected date when selected date changes.
         * @deprecated Switch to the `dateChange` and `dateInput` binding on the input element.
         */
        this.selectedChanged = new EventEmitter();
        /** Emits when the datetimepicker has been opened. */
        this.openedStream = new EventEmitter();
        /** Emits when the datetimepicker has been closed. */
        this.closedStream = new EventEmitter();
        /** Emits when the view has been changed. */
        this.viewChanged = new EventEmitter();
        this._opened = false;
        /** The id for the datetimepicker calendar. */
        this.id = `mtx-datetimepicker-${datetimepickerUid++}`;
        /** Emits when the datetimepicker is disabled. */
        this._disabledChange = new Subject();
        this._validSelected = null;
        /** The element that was focused before the datetimepicker was opened. */
        this._focusedElementBeforeOpen = null;
        /** Unique class that will be added to the backdrop so that the test harnesses can look it up. */
        this._backdropHarnessClass = `${this.id}-backdrop`;
        this._inputStateChanges = Subscription.EMPTY;
        this._type = 'datetime';
        this._touchUi = false;
        this._timeInput = false;
        /** Preferred position of the datetimepicker in the X axis. */
        this.xPosition = 'start';
        /** Preferred position of the datetimepicker in the Y axis. */
        this.yPosition = 'below';
        this._restoreFocus = true;
        if (!this._dateAdapter) {
            throw createMissingDateImplError('DateAdapter');
        }
    }
    /** The date to open the calendar to initially. */
    get startAt() {
        // If an explicit startAt is set we start there, otherwise we start at whatever the currently
        // selected value is.
        return this._startAt || (this.datetimepickerInput ? this.datetimepickerInput.value : null);
    }
    set startAt(date) {
        this._startAt = this._dateAdapter.getValidDateOrNull(date);
    }
    /** The display type of datetimepicker. */
    get type() {
        return this._type;
    }
    set type(value) {
        this._type = value || 'datetime';
    }
    /**
     * Whether the calendar UI is in touch mode. In touch mode the calendar opens in a dialog rather
     * than a popup and elements have more padding to allow for bigger touch targets.
     */
    get touchUi() {
        return this._touchUi;
    }
    set touchUi(value) {
        this._touchUi = coerceBooleanProperty(value);
    }
    /**
     * Whether the calendar is in time mode. In time mode the calendar clock gets time input
     * elements rather then just clock. When `touchUi` is enabled this will be disabled.
     */
    get timeInput() {
        return this._timeInput && !this.touchUi;
    }
    set timeInput(value) {
        this._timeInput = coerceBooleanProperty(value);
    }
    /** Whether the datetimepicker pop-up should be disabled. */
    get disabled() {
        return this._disabled === undefined && this.datetimepickerInput
            ? this.datetimepickerInput.disabled
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
    /** The currently selected date. */
    get _selected() {
        return this._validSelected;
    }
    set _selected(value) {
        this._validSelected = value;
    }
    /** The minimum selectable date. */
    get _minDate() {
        return this.datetimepickerInput && this.datetimepickerInput.min;
    }
    /** The maximum selectable date. */
    get _maxDate() {
        return this.datetimepickerInput && this.datetimepickerInput.max;
    }
    get _dateFilter() {
        return this.datetimepickerInput && this.datetimepickerInput._dateFilter;
    }
    _viewChanged(type) {
        this.viewChanged.emit(type);
    }
    ngOnDestroy() {
        this._destroyOverlay();
        this.close();
        this._inputStateChanges.unsubscribe();
        this._disabledChange.complete();
    }
    /** Selects the given date */
    _select(date) {
        const oldValue = this._selected;
        this._selected = date;
        if (!this._dateAdapter.sameDatetime(oldValue, this._selected)) {
            this.selectedChanged.emit(date);
        }
    }
    /**
     * Register an input with this datetimepicker.
     * @param input The datetimepicker input to register with this datetimepicker.
     */
    _registerInput(input) {
        if (this.datetimepickerInput) {
            throw Error('A MtxDatetimepicker can only be associated with a single input.');
        }
        this.datetimepickerInput = input;
        this._inputStateChanges = this.datetimepickerInput._valueChange.subscribe((value) => (this._selected = value));
    }
    /** Open the calendar. */
    open() {
        if (this._opened || this.disabled) {
            return;
        }
        if (!this.datetimepickerInput) {
            throw Error('Attempted to open an MtxDatetimepicker with no associated input.');
        }
        this._focusedElementBeforeOpen = _getFocusedElementPierceShadowDom();
        this._openOverlay();
        this._opened = true;
        this.openedStream.emit();
    }
    /** Close the calendar. */
    close() {
        if (!this._opened) {
            return;
        }
        const canRestoreFocus = this._restoreFocus &&
            this._focusedElementBeforeOpen &&
            typeof this._focusedElementBeforeOpen.focus === 'function';
        const completeClose = () => {
            // The `_opened` could've been reset already if
            // we got two events in quick succession.
            if (this._opened) {
                this._opened = false;
                this.closedStream.emit();
            }
        };
        if (this._componentRef) {
            const { instance, location } = this._componentRef;
            instance._startExitAnimation();
            instance._animationDone.pipe(take(1)).subscribe(() => {
                const activeElement = this._document.activeElement;
                // Since we restore focus after the exit animation, we have to check that
                // the user didn't move focus themselves inside the `close` handler.
                if (canRestoreFocus &&
                    (!activeElement ||
                        activeElement === this._document.activeElement ||
                        location.nativeElement.contains(activeElement))) {
                    this._focusedElementBeforeOpen.focus();
                }
                this._focusedElementBeforeOpen = null;
                this._destroyOverlay();
            });
        }
        if (canRestoreFocus) {
            // Because IE moves focus asynchronously, we can't count on it being restored before we've
            // marked the datepicker as closed. If the event fires out of sequence and the element that
            // we're refocusing opens the datepicker on focus, the user could be stuck with not being
            // able to close the calendar at all. We work around it by making the logic, that marks
            // the datepicker as closed, async as well.
            setTimeout(completeClose);
        }
        else {
            completeClose();
        }
    }
    /**
     * Forwards relevant values from the datetimepicker to the
     * datetimepicker content inside the overlay.
     */
    _forwardContentValues(instance) {
        instance.datetimepicker = this;
        instance.color = this.color;
        instance._dialogLabelId = this.datetimepickerInput.getOverlayLabelId();
    }
    /** Opens the overlay with the calendar. */
    _openOverlay() {
        this._destroyOverlay();
        const isDialog = this.touchUi;
        const labelId = this.datetimepickerInput.getOverlayLabelId();
        const portal = new ComponentPortal(MtxDatetimepickerContent, this._viewContainerRef);
        const overlayRef = (this._overlayRef = this._overlay.create(new OverlayConfig({
            positionStrategy: isDialog ? this._getDialogStrategy() : this._getDropdownStrategy(),
            hasBackdrop: true,
            backdropClass: [
                isDialog ? 'cdk-overlay-dark-backdrop' : 'mat-overlay-transparent-backdrop',
                this._backdropHarnessClass,
            ],
            direction: this._dir,
            scrollStrategy: isDialog ? this._overlay.scrollStrategies.block() : this._scrollStrategy(),
            panelClass: `mtx-datetimepicker-${isDialog ? 'dialog' : 'popup'}`,
        })));
        const overlayElement = overlayRef.overlayElement;
        overlayElement.setAttribute('role', 'dialog');
        if (labelId) {
            overlayElement.setAttribute('aria-labelledby', labelId);
        }
        if (isDialog) {
            overlayElement.setAttribute('aria-modal', 'true');
        }
        this._getCloseStream(overlayRef).subscribe(event => {
            if (event) {
                event.preventDefault();
            }
            this.close();
        });
        this._componentRef = overlayRef.attach(portal);
        this._forwardContentValues(this._componentRef.instance);
        // Update the position once the calendar has rendered. Only relevant in dropdown mode.
        if (!isDialog) {
            this._ngZone.onStable.pipe(take(1)).subscribe(() => overlayRef.updatePosition());
        }
    }
    /** Destroys the current overlay. */
    _destroyOverlay() {
        if (this._overlayRef) {
            this._overlayRef.dispose();
            this._overlayRef = this._componentRef = null;
        }
    }
    /** Gets a position strategy that will open the calendar as a dropdown. */
    _getDialogStrategy() {
        return this._overlay.position().global().centerHorizontally().centerVertically();
    }
    /** Gets a position strategy that will open the calendar as a dropdown. */
    _getDropdownStrategy() {
        const strategy = this._overlay
            .position()
            .flexibleConnectedTo(this.datetimepickerInput.getConnectedOverlayOrigin())
            .withTransformOriginOn('.mtx-datetimepicker-content')
            .withFlexibleDimensions(false)
            .withViewportMargin(8)
            .withLockedPosition();
        return this._setConnectedPositions(strategy);
    }
    /**
     * Sets the positions of the datetimepicker in dropdown mode based on the current configuration.
     */
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
            // Closing on alt + up is only valid when there's an input associated with the
            // datetimepicker.
            return ((event.keyCode === ESCAPE && !hasModifierKey(event)) ||
                (this.datetimepickerInput &&
                    hasModifierKey(event, 'altKey') &&
                    event.keyCode === UP_ARROW));
        })));
    }
}
/** @nocollapse */ MtxDatetimepicker.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MtxDatetimepicker, deps: [{ token: i4.Overlay }, { token: i0.NgZone }, { token: i0.ViewContainerRef }, { token: MTX_DATETIMEPICKER_SCROLL_STRATEGY }, { token: i5.DatetimeAdapter, optional: true }, { token: i6.Directionality, optional: true }], target: i0.ɵɵFactoryTarget.Component });
/** @nocollapse */ MtxDatetimepicker.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.1", type: MtxDatetimepicker, selector: "mtx-datetimepicker", inputs: { multiYearSelector: "multiYearSelector", twelvehour: "twelvehour", startView: "startView", mode: "mode", timeInterval: "timeInterval", preventSameDateTimeSelection: "preventSameDateTimeSelection", panelClass: "panelClass", opened: "opened", color: "color", startAt: "startAt", type: "type", touchUi: "touchUi", timeInput: "timeInput", disabled: "disabled", xPosition: "xPosition", yPosition: "yPosition", restoreFocus: "restoreFocus" }, outputs: { selectedChanged: "selectedChanged", openedStream: "opened", closedStream: "closed", viewChanged: "viewChanged" }, exportAs: ["mtxDatetimepicker"], ngImport: i0, template: '', isInline: true, changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MtxDatetimepicker, decorators: [{
            type: Component,
            args: [{
                    selector: 'mtx-datetimepicker',
                    exportAs: 'mtxDatetimepicker',
                    template: '',
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    encapsulation: ViewEncapsulation.None,
                    preserveWhitespaces: false,
                }]
        }], ctorParameters: function () { return [{ type: i4.Overlay }, { type: i0.NgZone }, { type: i0.ViewContainerRef }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [MTX_DATETIMEPICKER_SCROLL_STRATEGY]
                }] }, { type: i5.DatetimeAdapter, decorators: [{
                    type: Optional
                }] }, { type: i6.Directionality, decorators: [{
                    type: Optional
                }] }]; }, propDecorators: { multiYearSelector: [{
                type: Input
            }], twelvehour: [{
                type: Input
            }], startView: [{
                type: Input
            }], mode: [{
                type: Input
            }], timeInterval: [{
                type: Input
            }], preventSameDateTimeSelection: [{
                type: Input
            }], selectedChanged: [{
                type: Output
            }], openedStream: [{
                type: Output,
                args: ['opened']
            }], closedStream: [{
                type: Output,
                args: ['closed']
            }], viewChanged: [{
                type: Output
            }], panelClass: [{
                type: Input
            }], opened: [{
                type: Input
            }], color: [{
                type: Input
            }], startAt: [{
                type: Input
            }], type: [{
                type: Input
            }], touchUi: [{
                type: Input
            }], timeInput: [{
                type: Input
            }], disabled: [{
                type: Input
            }], xPosition: [{
                type: Input
            }], yPosition: [{
                type: Input
            }], restoreFocus: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZXRpbWVwaWNrZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wcm9qZWN0cy9leHRlbnNpb25zL2RhdGV0aW1lcGlja2VyL2RhdGV0aW1lcGlja2VyLnRzIiwiLi4vLi4vLi4vLi4vcHJvamVjdHMvZXh0ZW5zaW9ucy9kYXRldGltZXBpY2tlci9kYXRldGltZXBpY2tlci1jb250ZW50Lmh0bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUVMLHVCQUF1QixFQUV2QixTQUFTLEVBR1QsWUFBWSxFQUNaLE1BQU0sRUFDTixNQUFNLEVBQ04sY0FBYyxFQUNkLEtBQUssRUFJTCxRQUFRLEVBQ1IsTUFBTSxFQUNOLFNBQVMsRUFFVCxpQkFBaUIsR0FDbEIsTUFBTSxlQUFlLENBQUM7QUFFdkIsT0FBTyxFQUFnQixxQkFBcUIsRUFBRSxpQkFBaUIsRUFBRSxNQUFNLHVCQUF1QixDQUFDO0FBQy9GLE9BQU8sRUFBRSxNQUFNLEVBQUUsY0FBYyxFQUFFLFFBQVEsRUFBRSxNQUFNLHVCQUF1QixDQUFDO0FBQ3pFLE9BQU8sRUFFTCxPQUFPLEVBQ1AsYUFBYSxHQUdkLE1BQU0sc0JBQXNCLENBQUM7QUFDOUIsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBQ3RELE9BQU8sRUFBRSxpQ0FBaUMsRUFBRSxNQUFNLHVCQUF1QixDQUFDO0FBQzFFLE9BQU8sRUFBWSxVQUFVLEVBQWdCLE1BQU0sd0JBQXdCLENBQUM7QUFDNUUsT0FBTyxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQ3BELE9BQU8sRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFFOUMsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLFlBQVksQ0FBQztBQUN6QyxPQUFPLEVBQUUsMEJBQTBCLEVBQUUsTUFBTSx5QkFBeUIsQ0FBQztBQUdyRSxPQUFPLEVB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QUMsSUFBSTtvQkFDckMsbUJBQW1CLEVBQUUsS0FBSztpQkFDM0I7OzBCQW9ISSxNQUFNOzJCQUFDLGtDQUFrQzs7MEJBQ3pDLFFBQVE7OzBCQUNSLFFBQVE7NENBaEhQLGlCQUFpQjtzQkFEcEIsS0FBSztnQkFXRixVQUFVO3NCQURiLEtBQUs7Z0JBVUcsU0FBUztzQkFBakIsS0FBSztnQkFHRyxJQUFJO3NCQUFaLEtBQUs7Z0JBR0csWUFBWTtzQkFBcEIsS0FBSztnQkFHRyw0QkFBNEI7c0JBQXBDLEtBQUs7Z0JBTUksZUFBZTtzQkFBeEIsTUFBTTtnQkFHVyxZQUFZO3NCQUE3QixNQUFNO3VCQUFDLFFBQVE7Z0JBR0UsWUFBWTtzQkFBN0IsTUFBTTt1QkFBQyxRQUFRO2dCQUdOLFdBQVc7c0JBQXBCLE1BQU07Z0JBT0gsVUFBVTtzQkFEYixLQUFLO2dCQVdGLE1BQU07c0JBRFQsS0FBSztnQkFjRixLQUFLO3NCQURSLEtBQUs7Z0JBaURGLE9BQU87c0JBRFYsS0FBSztnQkFhRixJQUFJO3NCQURQLEtBQUs7Z0JBY0YsT0FBTztzQkFEVixLQUFLO2dCQWNGLFNBQVM7c0JBRFosS0FBSztnQkFXRixRQUFRO3NCQURYLEtBQUs7Z0JBa0JOLFNBQVM7c0JBRFIsS0FBSztnQkFLTixTQUFTO3NCQURSLEtBQUs7Z0JBU0YsWUFBWTtzQkFEZixLQUFLIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgQWZ0ZXJDb250ZW50SW5pdCxcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIENoYW5nZURldGVjdG9yUmVmLFxuICBDb21wb25lbnQsXG4gIENvbXBvbmVudFJlZixcbiAgRWxlbWVudFJlZixcbiAgRXZlbnRFbWl0dGVyLFxuICBpbmplY3QsXG4gIEluamVjdCxcbiAgSW5qZWN0aW9uVG9rZW4sXG4gIElucHV0LFxuICBOZ1pvbmUsXG4gIE9uRGVzdHJveSxcbiAgT25Jbml0LFxuICBPcHRpb25hbCxcbiAgT3V0cHV0LFxuICBWaWV3Q2hpbGQsXG4gIFZpZXdDb250YWluZXJSZWYsXG4gIFZpZXdFbmNhcHN1bGF0aW9uLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IERpcmVjdGlvbmFsaXR5IH0gZnJvbSAnQGFuZ3VsYXIvY2RrL2JpZGknO1xuaW1wb3J0IHsgQm9vbGVhbklucHV0LCBjb2VyY2VCb29sZWFuUHJvcGVydHksIGNvZXJjZVN0cmluZ0FycmF5IH0gZnJvbSAnQGFuZ3VsYXIvY2RrL2NvZXJjaW9uJztcbmltcG9ydCB7IEVTQ0FQRSwgaGFzTW9kaWZpZXJLZXksIFVQX0FSUk9XIH0gZnJvbSAnQGFuZ3VsYXIvY2RrL2tleWNvZGVzJztcbmltcG9ydCB7XG4gIEZsZXhpYmxlQ29ubmVjdGVkUG9zaXRpb25TdHJhdGVneSxcbiAgT3ZlcmxheSxcbiAgT3ZlcmxheUNvbmZpZyxcbiAgT3ZlcmxheVJlZixcbiAgU2Nyb2xsU3RyYXRlZ3ksXG59IGZyb20gJ0Bhbmd1bGFyL2Nkay9vdmVybGF5JztcbmltcG9ydCB7IENvbXBvbmVudFBvcnRhbCB9IGZyb20gJ0Bhbmd1bGFyL2Nkay9wb3J0YWwnO1xuaW1wb3J0IHsgX2dldEZvY3VzZWRFbGVtZW50UGllcmNlU2hhZG93RG9tIH0gZnJvbSAnQGFuZ3VsYXIvY2RrL3BsYXRmb3JtJztcbmltcG9ydCB7IENhbkNvbG9yLCBtaXhpbkNvbG9yLCBUaGVtZVBhbGV0dGUgfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9jb3JlJztcbmltcG9ydCB7IG1lcmdlLCBTdWJqZWN0LCBTdWJzY3JpcHRpb24gfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IGZpbHRlciwgdGFrZSB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7IERhdGV0aW1lQWRhcHRlciB9IGZyb20gJ0BuZy1tYXRlcm8vZXh0ZW5zaW9ucy9jb3JlJztcbmltcG9ydCB7IE10eENhbGVuZGFyIH0gZnJvbSAnLi9jYWxlbmRhcic7XG5pbXBvcnQgeyBjcmVhdGVNaXNzaW5nRGF0ZUltcGxFcnJvciB9IGZyb20gJy4vZGF0ZXRpbWVwaWNrZXItZXJyb3JzJztcbmltcG9ydCB7IE10eERhdGV0aW1lcGlja2VyRmlsdGVyVHlwZSB9IGZyb20gJy4vZGF0ZXRpbWVwaWNrZXItZmlsdGVydHlwZSc7XG5pbXBvcnQgeyBNdHhEYXRldGltZXBpY2tlcklucHV0IH0gZnJvbSAnLi9kYXRldGltZXBpY2tlci1pbnB1dCc7XG5pbXBvcnQgeyBtdHhEYXRldGltZXBpY2tlckFuaW1hdGlvbnMgfSBmcm9tICcuL2RhdGV0aW1lcGlja2VyLWFuaW1hdGlvbnMnO1xuaW1wb3J0IHsgTXR4Q2FsZW5kYXJWaWV3LCBNdHhEYXRldGltZXBpY2tlclR5cGUgfSBmcm9tICcuL2RhdGV0aW1lcGlja2VyLXR5cGVzJztcbmltcG9ydCB7IERPQ1VNRU5UIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcblxuLyoqIFVzZWQgdG8gZ2VuZXJhdGUgYSB1bmlxdWUgSUQgZm9yIGVhY2ggZGF0ZXRpbWVwaWNrZXIgaW5zdGFuY2UuICovXG5sZXQgZGF0ZXRpbWVwaWNrZXJVaWQgPSAwO1xuXG4vKiogUG9zc2libGUgbW9kZXMgZm9yIGRhdGV0aW1lcGlja2VyIGRyb3Bkb3duIGRpc3BsYXkuICovXG5leHBvcnQgdHlwZSBNdHhEYXRldGltZXBpY2tlck1vZGUgPSAnYXV0bycgfCAncG9ydHJhaXQnIHwgJ2xhbmRzY2FwZSc7XG5cbi8qKiBQb3NzaWJsZSBwb3NpdGlvbnMgZm9yIHRoZSBkYXRldGltZXBpY2tlciBkcm9wZG93biBhbG9uZyB0aGUgWCBheGlzLiAqL1xuZXhwb3J0IHR5cGUgRGF0ZXRpbWVwaWNrZXJEcm9wZG93blBvc2l0aW9uWCA9ICdzdGFydCcgfCAnZW5kJztcblxuLyoqIFBvc3NpYmxlIHBvc2l0aW9ucyBmb3IgdGhlIGRhdGV0aW1lcGlja2VyIGRyb3Bkb3duIGFsb25nIHRoZSBZIGF4aXMuICovXG5leHBvcnQgdHlwZSBEYXRldGltZXBpY2tlckRyb3Bkb3duUG9zaXRpb25ZID0gJ2Fib3ZlJyB8ICdiZWxvdyc7XG5cbi8qKiBJbmplY3Rpb24gdG9rZW4gdGhhdCBkZXRlcm1pbmVzIHRoZSBzY3JvbGwgaGFuZGxpbmcgd2hpbGUgdGhlIGNhbGVuZGFyIGlzIG9wZW4uICovXG5leHBvcnQgY29uc3QgTVRYX0RBVEVUSU1FUElDS0VSX1NDUk9MTF9TVFJBVEVHWSA9IG5ldyBJbmplY3Rpb25Ub2tlbjwoKSA9PiBTY3JvbGxTdHJhdGVneT4oXG4gICdtdHgtZGF0ZXRpbWVwaWNrZXItc2Nyb2xsLXN0cmF0ZWd5J1xuKTtcblxuZXhwb3J0IGZ1bmN0aW9uIE1UWF9EQVRFVElNRVBJQ0tFUl9TQ1JPTExfU1RSQVRFR1lfRkFDVE9SWShvdmVybGF5OiBPdmVybGF5KTogKCkgPT4gU2Nyb2xsU3RyYXRlZ3kge1xuICByZXR1cm4gKCkgPT4gb3ZlcmxheS5zY3JvbGxTdHJhdGVnaWVzLnJlcG9zaXRpb24oKTtcbn1cblxuZXhwb3J0IGNvbnN0IE1UWF9EQVRFVElNRVBJQ0tFUl9TQ1JPTExfU1RSQVRFR1lfRkFDVE9SWV9QUk9WSURFUiA9IHtcbiAgcHJvdmlkZTogTVRYX0RBVEVUSU1FUElDS0VSX1NDUk9MTF9TVFJBVEVHWSxcbiAgZGVwczogW092ZXJsYXldLFxuICB1c2VGYWN0b3J5OiBNVFhfREFURVRJTUVQSUNLRVJfU0NST0xMX1NUUkFURUdZX0ZBQ1RPUlksXG59O1xuXG4vLyBCb2lsZXJwbGF0ZSBmb3IgYXBwbHlpbmcgbWl4aW5zIHRvIE10eERhdGV0aW1lcGlja2VyQ29udGVudC5cbi8qKiBAZG9jcy1wcml2YXRlICovXG5jb25zdCBfTXR4RGF0ZXRpbWVwaWNrZXJDb250ZW50QmFzZSA9IG1peGluQ29sb3IoXG4gIGNsYXNzIHtcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgX2VsZW1lbnRSZWY6IEVsZW1lbnRSZWYpIHt9XG4gIH1cbik7XG5cbi8qKlxuICogQ29tcG9uZW50IHVzZWQgYXMgdGhlIGNvbnRlbnQgZm9yIHRoZSBkYXRldGltZXBpY2tlciBkaWFsb2cgYW5kIHBvcHVwLiBXZSB1c2UgdGhpcyBpbnN0ZWFkIG9mXG4gKiB1c2luZyBNdHhDYWxlbmRhciBkaXJlY3RseSBhcyB0aGUgY29udGVudCBzbyB3ZSBjYW4gY29udHJvbCB0aGUgaW5pdGlhbCBmb2N1cy4gVGhpcyBhbHNvIGdpdmVzIHVzXG4gKiBhIHBsYWNlIHRvIHB1dCBhZGRpdGlvbmFsIGZlYXR1cmVzIG9mIHRoZSBwb3B1cCB0aGF0IGFyZSBub3QgcGFydCBvZiB0aGUgY2FsZW5kYXIgaXRzZWxmIGluIHRoZVxuICogZnV0dXJlLiAoZS5nLiBjb25maXJtYXRpb24gYnV0dG9ucykuXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ210eC1kYXRldGltZXBpY2tlci1jb250ZW50JyxcbiAgdGVtcGxhdGVVcmw6ICdkYXRldGltZXBpY2tlci1jb250ZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsnZGF0ZXRpbWVwaWNrZXItY29udGVudC5zY3NzJ10sXG4gIGhvc3Q6IHtcbiAgICAnY2xhc3MnOiAnbXR4LWRhdGV0aW1lcGlja2VyLWNvbnRlbnQnLFxuICAgICdbY2xhc3MubXR4LWRhdGV0aW1lcGlja2VyLWNvbnRlbnQtdG91Y2hdJzogJ2RhdGV0aW1lcGlja2VyPy50b3VjaFVpJyxcbiAgICAnW2F0dHIubW9kZV0nOiAnZGF0ZXRpbWVwaWNrZXIubW9kZScsXG4gICAgJ1tAdHJhbnNmb3JtUGFuZWxdJzogJ19hbmltYXRpb25TdGF0ZScsXG4gICAgJyhAdHJhbnNmb3JtUGFuZWwuZG9uZSknOiAnX2FuaW1hdGlvbkRvbmUubmV4dCgpJyxcbiAgfSxcbiAgYW5pbWF0aW9uczogW1xuICAgIG10eERhdGV0aW1lcGlja2VyQW5pbWF0aW9ucy50cmFuc2Zvcm1QYW5lbCxcbiAgICBtdHhEYXRldGltZXBpY2tlckFuaW1hdGlvbnMuZmFkZUluQ2FsZW5kYXIsXG4gIF0sXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICBpbnB1dHM6IFsnY29sb3InXSxcbn0pXG5leHBvcnQgY2xhc3MgTXR4RGF0ZXRpbWVwaWNrZXJDb250ZW50PEQ+XG4gIGV4dGVuZHMgX010eERhdGV0aW1lcGlja2VyQ29udGVudEJhc2VcbiAgaW1wbGVtZW50cyBPbkluaXQsIEFmdGVyQ29udGVudEluaXQsIE9uRGVzdHJveSwgQ2FuQ29sb3JcbntcbiAgQFZpZXdDaGlsZChNdHhDYWxlbmRhciwgeyBzdGF0aWM6IHRydWUgfSkgX2NhbGVuZGFyITogTXR4Q2FsZW5kYXI8RD47XG5cbiAgZGF0ZXRpbWVwaWNrZXIhOiBNdHhEYXRldGltZXBpY2tlcjxEPjtcblxuICAvKiogV2hldGhlciB0aGUgZGF0ZXRpbWVwaWNrZXIgaXMgYWJvdmUgb3IgYmVsb3cgdGhlIGlucHV0LiAqL1xuICBfaXNBYm92ZSE6IGJvb2xlYW47XG5cbiAgLyoqIEN1cnJlbnQgc3RhdGUgb2YgdGhlIGFuaW1hdGlvbi4gKi9cbiAgX2FuaW1hdGlvblN0YXRlITogJ2VudGVyLWRyb3Bkb3duJyB8ICdlbnRlci1kaWFsb2cnIHwgJ3ZvaWQnO1xuXG4gIC8qKiBFbWl0cyB3aGVuIGFuIGFuaW1hdGlvbiBoYXMgZmluaXNoZWQuICovXG4gIHJlYWRvbmx5IF9hbmltYXRpb25Eb25lID0gbmV3IFN1YmplY3Q8dm9pZD4oKTtcblxuICAvKiogSWQgb2YgdGhlIGxhYmVsIGZvciB0aGUgYHJvbGU9XCJkaWFsb2dcImAgZWxlbWVudC4gKi9cbiAgX2RpYWxvZ0xhYmVsSWQ6IHN0cmluZyB8IG51bGwgPSBudWxsO1xuXG4gIGNvbnN0cnVjdG9yKGVsZW1lbnRSZWY6IEVsZW1lbnRSZWYsIHByaXZhdGUgX2NoYW5nZURldGVjdG9yUmVmOiBDaGFuZ2VEZXRlY3RvclJlZikge1xuICAgIHN1cGVyKGVsZW1lbnRSZWYpO1xuICB9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgdGhpcy5fYW5pbWF0aW9uU3RhdGUgPSB0aGlzLmRhdGV0aW1lcGlja2VyLnRvdWNoVWkgPyAnZW50ZXItZGlhbG9nJyA6ICdlbnRlci1kcm9wZG93bic7XG4gIH1cblxuICBuZ0FmdGVyQ29udGVudEluaXQoKSB7XG4gICAgdGhpcy5fY2FsZW5kYXIuX2ZvY3VzQWN0aXZlQ2VsbCgpO1xuICB9XG5cbiAgX3N0YXJ0RXhpdEFuaW1hdGlvbigpIHtcbiAgICB0aGlzLl9hbmltYXRpb25TdGF0ZSA9ICd2b2lkJztcbiAgICB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMuX2FuaW1hdGlvbkRvbmUuY29tcGxldGUoKTtcbiAgfVxufVxuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdtdHgtZGF0ZXRpbWVwaWNrZXInLFxuICBleHBvcnRBczogJ210eERhdGV0aW1lcGlja2VyJyxcbiAgdGVtcGxhdGU6ICcnLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgcHJlc2VydmVXaGl0ZXNwYWNlczogZmFsc2UsXG59KVxuZXhwb3J0IGNsYXNzIE10eERhdGV0aW1lcGlja2VyPEQ+IGltcGxlbWVudHMgT25EZXN0cm95IHtcbiAgcHJpdmF0ZSBfZG9jdW1lbnQgPSBpbmplY3QoRE9DVU1FTlQpO1xuXG4gIC8qKiBXaGV0aGVyIHRvIHNob3cgbXVsdGkteWVhciB2aWV3LiAqL1xuICBASW5wdXQoKVxuICBnZXQgbXVsdGlZZWFyU2VsZWN0b3IoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX211bHRpWWVhclNlbGVjdG9yO1xuICB9XG4gIHNldCBtdWx0aVllYXJTZWxlY3Rvcih2YWx1ZTogYm9vbGVhbikge1xuICAgIHRoaXMuX211bHRpWWVhclNlbGVjdG9yID0gY29lcmNlQm9vbGVhblByb3BlcnR5KHZhbHVlKTtcbiAgfVxuICBwcml2YXRlIF9tdWx0aVllYXJTZWxlY3RvciA9IGZhbHNlO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBjbG9jayB1c2VzIDEyIGhvdXIgZm9ybWF0LiAqL1xuICBASW5wdXQoKVxuICBnZXQgdHdlbHZlaG91cigpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fdHdlbHZlaG91cjtcbiAgfVxuICBzZXQgdHdlbHZlaG91cih2YWx1ZTogYm9vbGVhbikge1xuICAgIHRoaXMuX3R3ZWx2ZWhvdXIgPSBjb2VyY2VCb29sZWFuUHJvcGVydHkodmFsdWUpO1xuICB9XG4gIHByaXZhdGUgX3R3ZWx2ZWhvdXIgPSBmYWxzZTtcblxuICAvKiogVGhlIHZpZXcgdGhhdCB0aGUgY2FsZW5kYXIgc2hvdWxkIHN0YXJ0IGluLiAqL1xuICBASW5wdXQoKSBzdGFydFZpZXc6IE10eENhbGVuZGFyVmlldyA9ICdtb250aCc7XG5cbiAgLyoqIFRoZSBkaXNwbGF5IG1vZGUgb2YgZGF0ZXRpbWVwaWNrZXIuICovXG4gIEBJbnB1dCgpIG1vZGU6IE10eERhdGV0aW1lcGlja2VyTW9kZSA9ICdhdXRvJztcblxuICAvKiogU3RlcCBvdmVyIG1pbnV0ZXMuICovXG4gIEBJbnB1dCgpIHRpbWVJbnRlcnZhbDogbnVtYmVyID0gMTtcblxuICAvKiogUHJldmVudCB1c2VyIHRvIHNlbGVjdCBzYW1lIGRhdGUgdGltZSAqL1xuICBASW5wdXQoKSBwcmV2ZW50U2FtZURhdGVUaW1lU2VsZWN0aW9uID0gZmFsc2U7XG5cbiAgLyoqXG4gICAqIEVtaXRzIG5ldyBzZWxlY3RlZCBkYXRlIHdoZW4gc2VsZWN0ZWQgZGF0ZSBjaGFuZ2VzLlxuICAgKiBAZGVwcmVjYXRlZCBTd2l0Y2ggdG8gdGhlIGBkYXRlQ2hhbmdlYCBhbmQgYGRhdGVJbnB1dGAgYmluZGluZyBvbiB0aGUgaW5wdXQgZWxlbWVudC5cbiAgICovXG4gIEBPdXRwdXQoKSBzZWxlY3RlZENoYW5nZWQgPSBuZXcgRXZlbnRFbWl0dGVyPEQ+KCk7XG5cbiAgLyoqIEVtaXRzIHdoZW4gdGhlIGRhdGV0aW1lcGlja2VyIGhhcyBiZWVuIG9wZW5lZC4gKi9cbiAgQE91dHB1dCgnb3BlbmVkJykgb3BlbmVkU3RyZWFtOiBFdmVudEVtaXR0ZXI8dm9pZD4gPSBuZXcgRXZlbnRFbWl0dGVyPHZvaWQ+KCk7XG5cbiAgLyoqIEVtaXRzIHdoZW4gdGhlIGRhdGV0aW1lcGlja2VyIGhhcyBiZWVuIGNsb3NlZC4gKi9cbiAgQE91dHB1dCgnY2xvc2VkJykgY2xvc2VkU3RyZWFtOiBFdmVudEVtaXR0ZXI8dm9pZD4gPSBuZXcgRXZlbnRFbWl0dGVyPHZvaWQ+KCk7XG5cbiAgLyoqIEVtaXRzIHdoZW4gdGhlIHZpZXcgaGFzIGJlZW4gY2hhbmdlZC4gKi9cbiAgQE91dHB1dCgpIHZpZXdDaGFuZ2VkOiBFdmVudEVtaXR0ZXI8TXR4Q2FsZW5kYXJWaWV3PiA9IG5ldyBFdmVudEVtaXR0ZXI8TXR4Q2FsZW5kYXJWaWV3PigpO1xuXG4gIC8qKlxuICAgKiBDbGFzc2VzIHRvIGJlIHBhc3NlZCB0byB0aGUgZGF0ZSBwaWNrZXIgcGFuZWwuXG4gICAqIFN1cHBvcnRzIHN0cmluZyBhbmQgc3RyaW5nIGFycmF5IHZhbHVlcywgc2ltaWxhciB0byBgbmdDbGFzc2AuXG4gICAqL1xuICBASW5wdXQoKVxuICBnZXQgcGFuZWxDbGFzcygpOiBzdHJpbmcgfCBzdHJpbmdbXSB7XG4gICAgcmV0dXJuIHRoaXMuX3BhbmVsQ2xhc3M7XG4gIH1cbiAgc2V0IHBhbmVsQ2xhc3ModmFsdWU6IHN0cmluZyB8IHN0cmluZ1tdKSB7XG4gICAgdGhpcy5fcGFuZWxDbGFzcyA9IGNvZXJjZVN0cmluZ0FycmF5KHZhbHVlKTtcbiAgfVxuICBwcml2YXRlIF9wYW5lbENsYXNzITogc3RyaW5nW107XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGNhbGVuZGFyIGlzIG9wZW4uICovXG4gIEBJbnB1dCgpXG4gIGdldCBvcGVuZWQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX29wZW5lZDtcbiAgfVxuICBzZXQgb3BlbmVkKHZhbHVlOiBib29sZWFuKSB7XG4gICAgY29lcmNlQm9vbGVhblByb3BlcnR5KHZhbHVlKSA/IHRoaXMub3BlbigpIDogdGhpcy5jbG9zZSgpO1xuICB9XG4gIHByaXZhdGUgX29wZW5lZCA9IGZhbHNlO1xuXG4gIC8qKiBUaGUgaWQgZm9yIHRoZSBkYXRldGltZXBpY2tlciBjYWxlbmRhci4gKi9cbiAgaWQgPSBgbXR4LWRhdGV0aW1lcGlja2VyLSR7ZGF0ZXRpbWVwaWNrZXJVaWQrK31gO1xuXG4gIC8qKiBDb2xvciBwYWxldHRlIHRvIHVzZSBvbiB0aGUgZGF0ZXRpbWVwaWNrZXIncyBjYWxlbmRhci4gKi9cbiAgQElucHV0KClcbiAgZ2V0IGNvbG9yKCk6IFRoZW1lUGFsZXR0ZSB7XG4gICAgcmV0dXJuIChcbiAgICAgIHRoaXMuX2NvbG9yIHx8XG4gICAgICAodGhpcy5kYXRldGltZXBpY2tlcklucHV0ID8gdGhpcy5kYXRldGltZXBpY2tlcklucHV0LmdldFRoZW1lUGFsZXR0ZSgpIDogdW5kZWZpbmVkKVxuICAgICk7XG4gIH1cbiAgc2V0IGNvbG9yKHZhbHVlOiBUaGVtZVBhbGV0dGUpIHtcbiAgICB0aGlzLl9jb2xvciA9IHZhbHVlO1xuICB9XG4gIHByaXZhdGUgX2NvbG9yOiBUaGVtZVBhbGV0dGU7XG5cbiAgLyoqIFRoZSBpbnB1dCBlbGVtZW50IHRoaXMgZGF0ZXRpbWVwaWNrZXIgaXMgYXNzb2NpYXRlZCB3aXRoLiAqL1xuICBkYXRldGltZXBpY2tlcklucHV0ITogTXR4RGF0ZXRpbWVwaWNrZXJJbnB1dDxEPjtcblxuICAvKiogRW1pdHMgd2hlbiB0aGUgZGF0ZXRpbWVwaWNrZXIgaXMgZGlzYWJsZWQuICovXG4gIF9kaXNhYmxlZENoYW5nZSA9IG5ldyBTdWJqZWN0PGJvb2xlYW4+KCk7XG5cbiAgcHJpdmF0ZSBfdmFsaWRTZWxlY3RlZDogRCB8IG51bGwgPSBudWxsO1xuXG4gIC8qKiBBIHJlZmVyZW5jZSB0byB0aGUgb3ZlcmxheSBpbnRvIHdoaWNoIHdlJ3ZlIHJlbmRlcmVkIHRoZSBjYWxlbmRhci4gKi9cbiAgcHJpdmF0ZSBfb3ZlcmxheVJlZiE6IE92ZXJsYXlSZWYgfCBudWxsO1xuXG4gIC8qKiBSZWZlcmVuY2UgdG8gdGhlIGNvbXBvbmVudCBpbnN0YW5jZSByZW5kZXJlZCBpbiB0aGUgb3ZlcmxheS4gKi9cbiAgcHJpdmF0ZSBfY29tcG9uZW50UmVmITogQ29tcG9uZW50UmVmPE10eERhdGV0aW1lcGlja2VyQ29udGVudDxEPj4gfCBudWxsO1xuXG4gIC8qKiBUaGUgZWxlbWVudCB0aGF0IHdhcyBmb2N1c2VkIGJlZm9yZSB0aGUgZGF0ZXRpbWVwaWNrZXIgd2FzIG9wZW5lZC4gKi9cbiAgcHJpdmF0ZSBfZm9jdXNlZEVsZW1lbnRCZWZvcmVPcGVuOiBIVE1MRWxlbWVudCB8IG51bGwgPSBudWxsO1xuXG4gIC8qKiBVbmlxdWUgY2xhc3MgdGhhdCB3aWxsIGJlIGFkZGVkIHRvIHRoZSBiYWNrZHJvcCBzbyB0aGF0IHRoZSB0ZXN0IGhhcm5lc3NlcyBjYW4gbG9vayBpdCB1cC4gKi9cbiAgcHJpdmF0ZSBfYmFja2Ryb3BIYXJuZXNzQ2xhc3MgPSBgJHt0aGlzLmlkfS1iYWNrZHJvcGA7XG5cbiAgcHJpdmF0ZSBfaW5wdXRTdGF0ZUNoYW5nZXMgPSBTdWJzY3JpcHRpb24uRU1QVFk7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBfb3ZlcmxheTogT3ZlcmxheSxcbiAgICBwcml2YXRlIF9uZ1pvbmU6IE5nWm9uZSxcbiAgICBwcml2YXRlIF92aWV3Q29udGFpbmVyUmVmOiBWaWV3Q29udGFpbmVyUmVmLFxuICAgIEBJbmplY3QoTVRYX0RBVEVUSU1FUElDS0VSX1NDUk9MTF9TVFJBVEVHWSkgcHJpdmF0ZSBfc2Nyb2xsU3RyYXRlZ3k6IGFueSxcbiAgICBAT3B0aW9uYWwoKSBwcml2YXRlIF9kYXRlQWRhcHRlcjogRGF0ZXRpbWVBZGFwdGVyPEQ+LFxuICAgIEBPcHRpb25hbCgpIHByaXZhdGUgX2RpcjogRGlyZWN0aW9uYWxpdHlcbiAgKSB7XG4gICAgaWYgKCF0aGlzLl9kYXRlQWRhcHRlcikge1xuICAgICAgdGhyb3cgY3JlYXRlTWlzc2luZ0RhdGVJbXBsRXJyb3IoJ0RhdGVBZGFwdGVyJyk7XG4gICAgfVxuICB9XG5cbiAgLyoqIFRoZSBkYXRlIHRvIG9wZW4gdGhlIGNhbGVuZGFyIHRvIGluaXRpYWxseS4gKi9cbiAgQElucHV0KClcbiAgZ2V0IHN0YXJ0QXQoKTogRCB8IG51bGwge1xuICAgIC8vIElmIGFuIGV4cGxpY2l0IHN0YXJ0QXQgaXMgc2V0IHdlIHN0YXJ0IHRoZXJlLCBvdGhlcndpc2Ugd2Ugc3RhcnQgYXQgd2hhdGV2ZXIgdGhlIGN1cnJlbnRseVxuICAgIC8vIHNlbGVjdGVkIHZhbHVlIGlzLlxuICAgIHJldHVybiB0aGlzLl9zdGFydEF0IHx8ICh0aGlzLmRhdGV0aW1lcGlja2VySW5wdXQgPyB0aGlzLmRhdGV0aW1lcGlja2VySW5wdXQudmFsdWUgOiBudWxsKTtcbiAgfVxuICBzZXQgc3RhcnRBdChkYXRlOiBEIHwgbnVsbCkge1xuICAgIHRoaXMuX3N0YXJ0QXQgPSB0aGlzLl9kYXRlQWRhcHRlci5nZXRWYWxpZERhdGVPck51bGwoZGF0ZSk7XG4gIH1cbiAgcHJpdmF0ZSBfc3RhcnRBdCE6IEQgfCBudWxsO1xuXG4gIC8qKiBUaGUgZGlzcGxheSB0eXBlIG9mIGRhdGV0aW1lcGlja2VyLiAqL1xuICBASW5wdXQoKVxuICBnZXQgdHlwZSgpIHtcbiAgICByZXR1cm4gdGhpcy5fdHlwZTtcbiAgfVxuICBzZXQgdHlwZSh2YWx1ZTogTXR4RGF0ZXRpbWVwaWNrZXJUeXBlKSB7XG4gICAgdGhpcy5fdHlwZSA9IHZhbHVlIHx8ICdkYXRldGltZSc7XG4gIH1cbiAgcHJpdmF0ZSBfdHlwZTogTXR4RGF0ZXRpbWVwaWNrZXJUeXBlID0gJ2RhdGV0aW1lJztcblxuICAvKipcbiAgICogV2hldGhlciB0aGUgY2FsZW5kYXIgVUkgaXMgaW4gdG91Y2ggbW9kZS4gSW4gdG91Y2ggbW9kZSB0aGUgY2FsZW5kYXIgb3BlbnMgaW4gYSBkaWFsb2cgcmF0aGVyXG4gICAqIHRoYW4gYSBwb3B1cCBhbmQgZWxlbWVudHMgaGF2ZSBtb3JlIHBhZGRpbmcgdG8gYWxsb3cgZm9yIGJpZ2dlciB0b3VjaCB0YXJnZXRzLlxuICAgKi9cbiAgQElucHV0KClcbiAgZ2V0IHRvdWNoVWkoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX3RvdWNoVWk7XG4gIH1cbiAgc2V0IHRvdWNoVWkodmFsdWU6IGJvb2xlYW4pIHtcbiAgICB0aGlzLl90b3VjaFVpID0gY29lcmNlQm9vbGVhblByb3BlcnR5KHZhbHVlKTtcbiAgfVxuICBwcml2YXRlIF90b3VjaFVpID0gZmFsc2U7XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgdGhlIGNhbGVuZGFyIGlzIGluIHRpbWUgbW9kZS4gSW4gdGltZSBtb2RlIHRoZSBjYWxlbmRhciBjbG9jayBnZXRzIHRpbWUgaW5wdXRcbiAgICogZWxlbWVudHMgcmF0aGVyIHRoZW4ganVzdCBjbG9jay4gV2hlbiBgdG91Y2hVaWAgaXMgZW5hYmxlZCB0aGlzIHdpbGwgYmUgZGlzYWJsZWQuXG4gICAqL1xuICBASW5wdXQoKVxuICBnZXQgdGltZUlucHV0KCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl90aW1lSW5wdXQgJiYgIXRoaXMudG91Y2hVaTtcbiAgfVxuICBzZXQgdGltZUlucHV0KHZhbHVlOiBib29sZWFuKSB7XG4gICAgdGhpcy5fdGltZUlucHV0ID0gY29lcmNlQm9vbGVhblByb3BlcnR5KHZhbHVlKTtcbiAgfVxuICBwcml2YXRlIF90aW1lSW5wdXQgPSBmYWxzZTtcblxuICAvKiogV2hldGhlciB0aGUgZGF0ZXRpbWVwaWNrZXIgcG9wLXVwIHNob3VsZCBiZSBkaXNhYmxlZC4gKi9cbiAgQElucHV0KClcbiAgZ2V0IGRpc2FibGVkKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9kaXNhYmxlZCA9PT0gdW5kZWZpbmVkICYmIHRoaXMuZGF0ZXRpbWVwaWNrZXJJbnB1dFxuICAgICAgPyB0aGlzLmRhdGV0aW1lcGlja2VySW5wdXQuZGlzYWJsZWRcbiAgICAgIDogISF0aGlzLl9kaXNhYmxlZDtcbiAgfVxuICBzZXQgZGlzYWJsZWQodmFsdWU6IGJvb2xlYW4pIHtcbiAgICBjb25zdCBuZXdWYWx1ZSA9IGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSh2YWx1ZSk7XG5cbiAgICBpZiAobmV3VmFsdWUgIT09IHRoaXMuX2Rpc2FibGVkKSB7XG4gICAgICB0aGlzLl9kaXNhYmxlZCA9IG5ld1ZhbHVlO1xuICAgICAgdGhpcy5fZGlzYWJsZWRDaGFuZ2UubmV4dChuZXdWYWx1ZSk7XG4gICAgfVxuICB9XG4gIHByaXZhdGUgX2Rpc2FibGVkITogYm9vbGVhbjtcblxuICAvKiogUHJlZmVycmVkIHBvc2l0aW9uIG9mIHRoZSBkYXRldGltZXBpY2tlciBpbiB0aGUgWCBheGlzLiAqL1xuICBASW5wdXQoKVxuICB4UG9zaXRpb246IERhdGV0aW1lcGlja2VyRHJvcGRvd25Qb3NpdGlvblggPSAnc3RhcnQnO1xuXG4gIC8qKiBQcmVmZXJyZWQgcG9zaXRpb24gb2YgdGhlIGRhdGV0aW1lcGlja2VyIGluIHRoZSBZIGF4aXMuICovXG4gIEBJbnB1dCgpXG4gIHlQb3NpdGlvbjogRGF0ZXRpbWVwaWNrZXJEcm9wZG93blBvc2l0aW9uWSA9ICdiZWxvdyc7XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgdG8gcmVzdG9yZSBmb2N1cyB0byB0aGUgcHJldmlvdXNseS1mb2N1c2VkIGVsZW1lbnQgd2hlbiB0aGUgcGFuZWwgaXMgY2xvc2VkLlxuICAgKiBOb3RlIHRoYXQgYXV0b21hdGljIGZvY3VzIHJlc3RvcmF0aW9uIGlzIGFuIGFjY2Vzc2liaWxpdHkgZmVhdHVyZSBhbmQgaXQgaXMgcmVjb21tZW5kZWQgdGhhdFxuICAgKiB5b3UgcHJvdmlkZSB5b3VyIG93biBlcXVpdmFsZW50LCBpZiB5b3UgZGVjaWRlIHRvIHR1cm4gaXQgb2ZmLlxuICAgKi9cbiAgQElucHV0KClcbiAgZ2V0IHJlc3RvcmVGb2N1cygpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fcmVzdG9yZUZvY3VzO1xuICB9XG4gIHNldCByZXN0b3JlRm9jdXModmFsdWU6IGJvb2xlYW4pIHtcbiAgICB0aGlzLl9yZXN0b3JlRm9jdXMgPSBjb2VyY2VCb29sZWFuUHJvcGVydHkodmFsdWUpO1xuICB9XG4gIHByaXZhdGUgX3Jlc3RvcmVGb2N1cyA9IHRydWU7XG5cbiAgLyoqIFRoZSBjdXJyZW50bHkgc2VsZWN0ZWQgZGF0ZS4gKi9cbiAgZ2V0IF9zZWxlY3RlZCgpOiBEIHwgbnVsbCB7XG4gICAgcmV0dXJuIHRoaXMuX3ZhbGlkU2VsZWN0ZWQ7XG4gIH1cblxuICBzZXQgX3NlbGVjdGVkKHZhbHVlOiBEIHwgbnVsbCkge1xuICAgIHRoaXMuX3ZhbGlkU2VsZWN0ZWQgPSB2YWx1ZTtcbiAgfVxuXG4gIC8qKiBUaGUgbWluaW11bSBzZWxlY3RhYmxlIGRhdGUuICovXG4gIGdldCBfbWluRGF0ZSgpOiBEIHwgbnVsbCB7XG4gICAgcmV0dXJuIHRoaXMuZGF0ZXRpbWVwaWNrZXJJbnB1dCAmJiB0aGlzLmRhdGV0aW1lcGlja2VySW5wdXQubWluO1xuICB9XG5cbiAgLyoqIFRoZSBtYXhpbXVtIHNlbGVjdGFibGUgZGF0ZS4gKi9cbiAgZ2V0IF9tYXhEYXRlKCk6IEQgfCBudWxsIHtcbiAgICByZXR1cm4gdGhpcy5kYXRldGltZXBpY2tlcklucHV0ICYmIHRoaXMuZGF0ZXRpbWVwaWNrZXJJbnB1dC5tYXg7XG4gIH1cblxuICBnZXQgX2RhdGVGaWx0ZXIoKTogKGRhdGU6IEQgfCBudWxsLCB0eXBlOiBNdHhEYXRldGltZXBpY2tlckZpbHRlclR5cGUpID0+IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLmRhdGV0aW1lcGlja2VySW5wdXQgJiYgdGhpcy5kYXRldGltZXBpY2tlcklucHV0Ll9kYXRlRmlsdGVyO1xuICB9XG5cbiAgX3ZpZXdDaGFuZ2VkKHR5cGU6IE10eENhbGVuZGFyVmlldyk6IHZvaWQge1xuICAgIHRoaXMudmlld0NoYW5nZWQuZW1pdCh0eXBlKTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMuX2Rlc3Ryb3lPdmVybGF5KCk7XG4gICAgdGhpcy5jbG9zZSgpO1xuICAgIHRoaXMuX2lucHV0U3RhdGVDaGFuZ2VzLnVuc3Vic2NyaWJlKCk7XG4gICAgdGhpcy5fZGlzYWJsZWRDaGFuZ2UuY29tcGxldGUoKTtcbiAgfVxuXG4gIC8qKiBTZWxlY3RzIHRoZSBnaXZlbiBkYXRlICovXG4gIF9zZWxlY3QoZGF0ZTogRCk6IHZvaWQge1xuICAgIGNvbnN0IG9sZFZhbHVlID0gdGhpcy5fc2VsZWN0ZWQ7XG4gICAgdGhpcy5fc2VsZWN0ZWQgPSBkYXRlO1xuICAgIGlmICghdGhpcy5fZGF0ZUFkYXB0ZXIuc2FtZURhdGV0aW1lKG9sZFZhbHVlLCB0aGlzLl9zZWxlY3RlZCkpIHtcbiAgICAgIHRoaXMuc2VsZWN0ZWRDaGFuZ2VkLmVtaXQoZGF0ZSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVyIGFuIGlucHV0IHdpdGggdGhpcyBkYXRldGltZXBpY2tlci5cbiAgICogQHBhcmFtIGlucHV0IFRoZSBkYXRldGltZXBpY2tlciBpbnB1dCB0byByZWdpc3RlciB3aXRoIHRoaXMgZGF0ZXRpbWVwaWNrZXIuXG4gICAqL1xuICBfcmVnaXN0ZXJJbnB1dChpbnB1dDogTXR4RGF0ZXRpbWVwaWNrZXJJbnB1dDxEPik6IHZvaWQge1xuICAgIGlmICh0aGlzLmRhdGV0aW1lcGlja2VySW5wdXQpIHtcbiAgICAgIHRocm93IEVycm9yKCdBIE10eERhdGV0aW1lcGlja2VyIGNhbiBvbmx5IGJlIGFzc29jaWF0ZWQgd2l0aCBhIHNpbmdsZSBpbnB1dC4nKTtcbiAgICB9XG4gICAgdGhpcy5kYXRldGltZXBpY2tlcklucHV0ID0gaW5wdXQ7XG4gICAgdGhpcy5faW5wdXRTdGF0ZUNoYW5nZXMgPSB0aGlzLmRhdGV0aW1lcGlja2VySW5wdXQuX3ZhbHVlQ2hhbmdlLnN1YnNjcmliZShcbiAgICAgICh2YWx1ZTogRCB8IG51bGwpID0+ICh0aGlzLl9zZWxlY3RlZCA9IHZhbHVlKVxuICAgICk7XG4gIH1cblxuICAvKiogT3BlbiB0aGUgY2FsZW5kYXIuICovXG4gIG9wZW4oKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuX29wZW5lZCB8fCB0aGlzLmRpc2FibGVkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICghdGhpcy5kYXRldGltZXBpY2tlcklucHV0KSB7XG4gICAgICB0aHJvdyBFcnJvcignQXR0ZW1wdGVkIHRvIG9wZW4gYW4gTXR4RGF0ZXRpbWVwaWNrZXIgd2l0aCBubyBhc3NvY2lhdGVkIGlucHV0LicpO1xuICAgIH1cblxuICAgIHRoaXMuX2ZvY3VzZWRFbGVtZW50QmVmb3JlT3BlbiA9IF9nZXRGb2N1c2VkRWxlbWVudFBpZXJjZVNoYWRvd0RvbSgpO1xuICAgIHRoaXMuX29wZW5PdmVybGF5KCk7XG4gICAgdGhpcy5fb3BlbmVkID0gdHJ1ZTtcbiAgICB0aGlzLm9wZW5lZFN0cmVhbS5lbWl0KCk7XG4gIH1cblxuICAvKiogQ2xvc2UgdGhlIGNhbGVuZGFyLiAqL1xuICBjbG9zZSgpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMuX29wZW5lZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGNhblJlc3RvcmVGb2N1cyA9XG4gICAgICB0aGlzLl9yZXN0b3JlRm9jdXMgJiZcbiAgICAgIHRoaXMuX2ZvY3VzZWRFbGVtZW50QmVmb3JlT3BlbiAmJlxuICAgICAgdHlwZW9mIHRoaXMuX2ZvY3VzZWRFbGVtZW50QmVmb3JlT3Blbi5mb2N1cyA9PT0gJ2Z1bmN0aW9uJztcblxuICAgIGNvbnN0IGNvbXBsZXRlQ2xvc2UgPSAoKSA9PiB7XG4gICAgICAvLyBUaGUgYF9vcGVuZWRgIGNvdWxkJ3ZlIGJlZW4gcmVzZXQgYWxyZWFkeSBpZlxuICAgICAgLy8gd2UgZ290IHR3byBldmVudHMgaW4gcXVpY2sgc3VjY2Vzc2lvbi5cbiAgICAgIGlmICh0aGlzLl9vcGVuZWQpIHtcbiAgICAgICAgdGhpcy5fb3BlbmVkID0gZmFsc2U7XG4gICAgICAgIHRoaXMuY2xvc2VkU3RyZWFtLmVtaXQoKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgaWYgKHRoaXMuX2NvbXBvbmVudFJlZikge1xuICAgICAgY29uc3QgeyBpbnN0YW5jZSwgbG9jYXRpb24gfSA9IHRoaXMuX2NvbXBvbmVudFJlZjtcbiAgICAgIGluc3RhbmNlLl9zdGFydEV4aXRBbmltYXRpb24oKTtcbiAgICAgIGluc3RhbmNlLl9hbmltYXRpb25Eb25lLnBpcGUodGFrZSgxKSkuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgY29uc3QgYWN0aXZlRWxlbWVudCA9IHRoaXMuX2RvY3VtZW50LmFjdGl2ZUVsZW1lbnQ7XG5cbiAgICAgICAgLy8gU2luY2Ugd2UgcmVzdG9yZSBmb2N1cyBhZnRlciB0aGUgZXhpdCBhbmltYXRpb24sIHdlIGhhdmUgdG8gY2hlY2sgdGhhdFxuICAgICAgICAvLyB0aGUgdXNlciBkaWRuJ3QgbW92ZSBmb2N1cyB0aGVtc2VsdmVzIGluc2lkZSB0aGUgYGNsb3NlYCBoYW5kbGVyLlxuICAgICAgICBpZiAoXG4gICAgICAgICAgY2FuUmVzdG9yZUZvY3VzICYmXG4gICAgICAgICAgKCFhY3RpdmVFbGVtZW50IHx8XG4gICAgICAgICAgICBhY3RpdmVFbGVtZW50ID09PSB0aGlzLl9kb2N1bWVudC5hY3RpdmVFbGVtZW50IHx8XG4gICAgICAgICAgICBsb2NhdGlvbi5uYXRpdmVFbGVtZW50LmNvbnRhaW5zKGFjdGl2ZUVsZW1lbnQpKVxuICAgICAgICApIHtcbiAgICAgICAgICB0aGlzLl9mb2N1c2VkRWxlbWVudEJlZm9yZU9wZW4hLmZvY3VzKCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9mb2N1c2VkRWxlbWVudEJlZm9yZU9wZW4gPSBudWxsO1xuICAgICAgICB0aGlzLl9kZXN0cm95T3ZlcmxheSgpO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgaWYgKGNhblJlc3RvcmVGb2N1cykge1xuICAgICAgLy8gQmVjYXVzZSBJRSBtb3ZlcyBmb2N1cyBhc3luY2hyb25vdXNseSwgd2UgY2FuJ3QgY291bnQgb24gaXQgYmVpbmcgcmVzdG9yZWQgYmVmb3JlIHdlJ3ZlXG4gICAgICAvLyBtYXJrZWQgdGhlIGRhdGVwaWNrZXIgYXMgY2xvc2VkLiBJZiB0aGUgZXZlbnQgZmlyZXMgb3V0IG9mIHNlcXVlbmNlIGFuZCB0aGUgZWxlbWVudCB0aGF0XG4gICAgICAvLyB3ZSdyZSByZWZvY3VzaW5nIG9wZW5zIHRoZSBkYXRlcGlja2VyIG9uIGZvY3VzLCB0aGUgdXNlciBjb3VsZCBiZSBzdHVjayB3aXRoIG5vdCBiZWluZ1xuICAgICAgLy8gYWJsZSB0byBjbG9zZSB0aGUgY2FsZW5kYXIgYXQgYWxsLiBXZSB3b3JrIGFyb3VuZCBpdCBieSBtYWtpbmcgdGhlIGxvZ2ljLCB0aGF0IG1hcmtzXG4gICAgICAvLyB0aGUgZGF0ZXBpY2tlciBhcyBjbG9zZWQsIGFzeW5jIGFzIHdlbGwuXG4gICAgICBzZXRUaW1lb3V0KGNvbXBsZXRlQ2xvc2UpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb21wbGV0ZUNsb3NlKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEZvcndhcmRzIHJlbGV2YW50IHZhbHVlcyBmcm9tIHRoZSBkYXRldGltZXBpY2tlciB0byB0aGVcbiAgICogZGF0ZXRpbWVwaWNrZXIgY29udGVudCBpbnNpZGUgdGhlIG92ZXJsYXkuXG4gICAqL1xuICBwcm90ZWN0ZWQgX2ZvcndhcmRDb250ZW50VmFsdWVzKGluc3RhbmNlOiBNdHhEYXRldGltZXBpY2tlckNvbnRlbnQ8RD4pIHtcbiAgICBpbnN0YW5jZS5kYXRldGltZXBpY2tlciA9IHRoaXM7XG4gICAgaW5zdGFuY2UuY29sb3IgPSB0aGlzLmNvbG9yO1xuICAgIGluc3RhbmNlLl9kaWFsb2dMYWJlbElkID0gdGhpcy5kYXRldGltZXBpY2tlcklucHV0LmdldE92ZXJsYXlMYWJlbElkKCk7XG4gIH1cblxuICAvKiogT3BlbnMgdGhlIG92ZXJsYXkgd2l0aCB0aGUgY2FsZW5kYXIuICovXG4gIHByaXZhdGUgX29wZW5PdmVybGF5KCk6IHZvaWQge1xuICAgIHRoaXMuX2Rlc3Ryb3lPdmVybGF5KCk7XG5cbiAgICBjb25zdCBpc0RpYWxvZyA9IHRoaXMudG91Y2hVaTtcbiAgICBjb25zdCBsYWJlbElkID0gdGhpcy5kYXRldGltZXBpY2tlcklucHV0LmdldE92ZXJsYXlMYWJlbElkKCk7XG5cbiAgICBjb25zdCBwb3J0YWwgPSBuZXcgQ29tcG9uZW50UG9ydGFsPE10eERhdGV0aW1lcGlja2VyQ29udGVudDxEPj4oXG4gICAgICBNdHhEYXRldGltZXBpY2tlckNvbnRlbnQsXG4gICAgICB0aGlzLl92aWV3Q29udGFpbmVyUmVmXG4gICAgKTtcbiAgICBjb25zdCBvdmVybGF5UmVmID0gKHRoaXMuX292ZXJsYXlSZWYgPSB0aGlzLl9vdmVybGF5LmNyZWF0ZShcbiAgICAgIG5ldyBPdmVybGF5Q29uZmlnKHtcbiAgICAgICAgcG9zaXRpb25TdHJhdGVneTogaXNEaWFsb2cgPyB0aGlzLl9nZXREaWFsb2dTdHJhdGVneSgpIDogdGhpcy5fZ2V0RHJvcGRvd25TdHJhdGVneSgpLFxuICAgICAgICBoYXNCYWNrZHJvcDogdHJ1ZSxcbiAgICAgICAgYmFja2Ryb3BDbGFzczogW1xuICAgICAgICAgIGlzRGlhbG9nID8gJ2Nkay1vdmVybGF5LWRhcmstYmFja2Ryb3AnIDogJ21hdC1vdmVybGF5LXRyYW5zcGFyZW50LWJhY2tkcm9wJyxcbiAgICAgICAgICB0aGlzLl9iYWNrZHJvcEhhcm5lc3NDbGFzcyxcbiAgICAgICAgXSxcbiAgICAgICAgZGlyZWN0aW9uOiB0aGlzLl9kaXIsXG4gICAgICAgIHNjcm9sbFN0cmF0ZWd5OiBpc0RpYWxvZyA/IHRoaXMuX292ZXJsYXkuc2Nyb2xsU3RyYXRlZ2llcy5ibG9jaygpIDogdGhpcy5fc2Nyb2xsU3RyYXRlZ3koKSxcbiAgICAgICAgcGFuZWxDbGFzczogYG10eC1kYXRldGltZXBpY2tlci0ke2lzRGlhbG9nID8gJ2RpYWxvZycgOiAncG9wdXAnfWAsXG4gICAgICB9KVxuICAgICkpO1xuXG4gICAgY29uc3Qgb3ZlcmxheUVsZW1lbnQgPSBvdmVybGF5UmVmLm92ZXJsYXlFbGVtZW50O1xuICAgIG92ZXJsYXlFbGVtZW50LnNldEF0dHJpYnV0ZSgncm9sZScsICdkaWFsb2cnKTtcblxuICAgIGlmIChsYWJlbElkKSB7XG4gICAgICBvdmVybGF5RWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2FyaWEtbGFiZWxsZWRieScsIGxhYmVsSWQpO1xuICAgIH1cblxuICAgIGlmIChpc0RpYWxvZykge1xuICAgICAgb3ZlcmxheUVsZW1lbnQuc2V0QXR0cmlidXRlKCdhcmlhLW1vZGFsJywgJ3RydWUnKTtcbiAgICB9XG5cbiAgICB0aGlzLl9nZXRDbG9zZVN0cmVhbShvdmVybGF5UmVmKS5zdWJzY3JpYmUoZXZlbnQgPT4ge1xuICAgICAgaWYgKGV2ZW50KSB7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICB9XG4gICAgICB0aGlzLmNsb3NlKCk7XG4gICAgfSk7XG5cbiAgICB0aGlzLl9jb21wb25lbnRSZWYgPSBvdmVybGF5UmVmLmF0dGFjaChwb3J0YWwpO1xuICAgIHRoaXMuX2ZvcndhcmRDb250ZW50VmFsdWVzKHRoaXMuX2NvbXBvbmVudFJlZi5pbnN0YW5jZSk7XG5cbiAgICAvLyBVcGRhdGUgdGhlIHBvc2l0aW9uIG9uY2UgdGhlIGNhbGVuZGFyIGhhcyByZW5kZXJlZC4gT25seSByZWxldmFudCBpbiBkcm9wZG93biBtb2RlLlxuICAgIGlmICghaXNEaWFsb2cpIHtcbiAgICAgIHRoaXMuX25nWm9uZS5vblN0YWJsZS5waXBlKHRha2UoMSkpLnN1YnNjcmliZSgoKSA9PiBvdmVybGF5UmVmLnVwZGF0ZVBvc2l0aW9uKCkpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBEZXN0cm95cyB0aGUgY3VycmVudCBvdmVybGF5LiAqL1xuICBwcml2YXRlIF9kZXN0cm95T3ZlcmxheSgpIHtcbiAgICBpZiAodGhpcy5fb3ZlcmxheVJlZikge1xuICAgICAgdGhpcy5fb3ZlcmxheVJlZi5kaXNwb3NlKCk7XG4gICAgICB0aGlzLl9vdmVybGF5UmVmID0gdGhpcy5fY29tcG9uZW50UmVmID0gbnVsbDtcbiAgICB9XG4gIH1cblxuICAvKiogR2V0cyBhIHBvc2l0aW9uIHN0cmF0ZWd5IHRoYXQgd2lsbCBvcGVuIHRoZSBjYWxlbmRhciBhcyBhIGRyb3Bkb3duLiAqL1xuICBwcml2YXRlIF9nZXREaWFsb2dTdHJhdGVneSgpIHtcbiAgICByZXR1cm4gdGhpcy5fb3ZlcmxheS5wb3NpdGlvbigpLmdsb2JhbCgpLmNlbnRlckhvcml6b250YWxseSgpLmNlbnRlclZlcnRpY2FsbHkoKTtcbiAgfVxuXG4gIC8qKiBHZXRzIGEgcG9zaXRpb24gc3RyYXRlZ3kgdGhhdCB3aWxsIG9wZW4gdGhlIGNhbGVuZGFyIGFzIGEgZHJvcGRvd24uICovXG4gIHByaXZhdGUgX2dldERyb3Bkb3duU3RyYXRlZ3koKSB7XG4gICAgY29uc3Qgc3RyYXRlZ3kgPSB0aGlzLl9vdmVybGF5XG4gICAgICAucG9zaXRpb24oKVxuICAgICAgLmZsZXhpYmxlQ29ubmVjdGVkVG8odGhpcy5kYXRldGltZXBpY2tlcklucHV0LmdldENvbm5lY3RlZE92ZXJsYXlPcmlnaW4oKSlcbiAgICAgIC53aXRoVHJhbnNmb3JtT3JpZ2luT24oJy5tdHgtZGF0ZXRpbWVwaWNrZXItY29udGVudCcpXG4gICAgICAud2l0aEZsZXhpYmxlRGltZW5zaW9ucyhmYWxzZSlcbiAgICAgIC53aXRoVmlld3BvcnRNYXJnaW4oOClcbiAgICAgIC53aXRoTG9ja2VkUG9zaXRpb24oKTtcblxuICAgIHJldHVybiB0aGlzLl9zZXRDb25uZWN0ZWRQb3NpdGlvbnMoc3RyYXRlZ3kpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIHBvc2l0aW9ucyBvZiB0aGUgZGF0ZXRpbWVwaWNrZXIgaW4gZHJvcGRvd24gbW9kZSBiYXNlZCBvbiB0aGUgY3VycmVudCBjb25maWd1cmF0aW9uLlxuICAgKi9cbiAgcHJpdmF0ZSBfc2V0Q29ubmVjdGVkUG9zaXRpb25zKHN0cmF0ZWd5OiBGbGV4aWJsZUNvbm5lY3RlZFBvc2l0aW9uU3RyYXRlZ3kpIHtcbiAgICBjb25zdCBwcmltYXJ5WCA9IHRoaXMueFBvc2l0aW9uID09PSAnZW5kJyA/ICdlbmQnIDogJ3N0YXJ0JztcbiAgICBjb25zdCBzZWNvbmRhcnlYID0gcHJpbWFyeVggPT09ICdzdGFydCcgPyAnZW5kJyA6ICdzdGFydCc7XG4gICAgY29uc3QgcHJpbWFyeVkgPSB0aGlzLnlQb3NpdGlvbiA9PT0gJ2Fib3ZlJyA/ICdib3R0b20nIDogJ3RvcCc7XG4gICAgY29uc3Qgc2Vjb25kYXJ5WSA9IHByaW1hcnlZID09PSAndG9wJyA/ICdib3R0b20nIDogJ3RvcCc7XG5cbiAgICByZXR1cm4gc3RyYXRlZ3kud2l0aFBvc2l0aW9ucyhbXG4gICAgICB7XG4gICAgICAgIG9yaWdpblg6IHByaW1hcnlYLFxuICAgICAgICBvcmlnaW5ZOiBzZWNvbmRhcnlZLFxuICAgICAgICBvdmVybGF5WDogcHJpbWFyeVgsXG4gICAgICAgIG92ZXJsYXlZOiBwcmltYXJ5WSxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIG9yaWdpblg6IHByaW1hcnlYLFxuICAgICAgICBvcmlnaW5ZOiBwcmltYXJ5WSxcbiAgICAgICAgb3ZlcmxheVg6IHByaW1hcnlYLFxuICAgICAgICBvdmVybGF5WTogc2Vjb25kYXJ5WSxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIG9yaWdpblg6IHNlY29uZGFyeVgsXG4gICAgICAgIG9yaWdpblk6IHNlY29uZGFyeVksXG4gICAgICAgIG92ZXJsYXlYOiBzZWNvbmRhcnlYLFxuICAgICAgICBvdmVybGF5WTogcHJpbWFyeVksXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBvcmlnaW5YOiBzZWNvbmRhcnlYLFxuICAgICAgICBvcmlnaW5ZOiBwcmltYXJ5WSxcbiAgICAgICAgb3ZlcmxheVg6IHNlY29uZGFyeVgsXG4gICAgICAgIG92ZXJsYXlZOiBzZWNvbmRhcnlZLFxuICAgICAgfSxcbiAgICBdKTtcbiAgfVxuXG4gIC8qKiBHZXRzIGFuIG9ic2VydmFibGUgdGhhdCB3aWxsIGVtaXQgd2hlbiB0aGUgb3ZlcmxheSBpcyBzdXBwb3NlZCB0byBiZSBjbG9zZWQuICovXG4gIHByaXZhdGUgX2dldENsb3NlU3RyZWFtKG92ZXJsYXlSZWY6IE92ZXJsYXlSZWYpIHtcbiAgICByZXR1cm4gbWVyZ2UoXG4gICAgICBvdmVybGF5UmVmLmJhY2tkcm9wQ2xpY2soKSxcbiAgICAgIG92ZXJsYXlSZWYuZGV0YWNobWVudHMoKSxcbiAgICAgIG92ZXJsYXlSZWYua2V5ZG93bkV2ZW50cygpLnBpcGUoXG4gICAgICAgIGZpbHRlcihldmVudCA9PiB7XG4gICAgICAgICAgLy8gQ2xvc2luZyBvbiBhbHQgKyB1cCBpcyBvbmx5IHZhbGlkIHdoZW4gdGhlcmUncyBhbiBpbnB1dCBhc3NvY2lhdGVkIHdpdGggdGhlXG4gICAgICAgICAgLy8gZGF0ZXRpbWVwaWNrZXIuXG4gICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIChldmVudC5rZXlDb2RlID09PSBFU0NBUEUgJiYgIWhhc01vZGlmaWVyS2V5KGV2ZW50KSkgfHxcbiAgICAgICAgICAgICh0aGlzLmRhdGV0aW1lcGlja2VySW5wdXQgJiZcbiAgICAgICAgICAgICAgaGFzTW9kaWZpZXJLZXkoZXZlbnQsICdhbHRLZXknKSAmJlxuICAgICAgICAgICAgICBldmVudC5rZXlDb2RlID09PSBVUF9BUlJPVylcbiAgICAgICAgICApO1xuICAgICAgICB9KVxuICAgICAgKVxuICAgICk7XG4gIH1cblxuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfbXVsdGlZZWFyU2VsZWN0b3I6IEJvb2xlYW5JbnB1dDtcbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX3R3ZWx2ZWhvdXI6IEJvb2xlYW5JbnB1dDtcbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX3ByZXZlbnRTYW1lRGF0ZVRpbWVTZWxlY3Rpb246IEJvb2xlYW5JbnB1dDtcbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX2Rpc2FibGVkOiBCb29sZWFuSW5wdXQ7XG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9vcGVuZWQ6IEJvb2xlYW5JbnB1dDtcbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX3RvdWNoVWk6IEJvb2xlYW5JbnB1dDtcbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX3RpbWVJbnB1dDogQm9vbGVhbklucHV0O1xuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfcmVzdG9yZUZvY3VzOiBCb29sZWFuSW5wdXQ7XG59XG4iLCI8ZGl2IGNka1RyYXBGb2N1c1xuICAgICByb2xlPVwiZGlhbG9nXCJcbiAgICAgW2F0dHIuYXJpYS1tb2RhbF09XCJ0cnVlXCJcbiAgICAgW2F0dHIuYXJpYS1sYWJlbGxlZGJ5XT1cIl9kaWFsb2dMYWJlbElkID8/IHVuZGVmaW5lZFwiXG4gICAgIFthdHRyLm1vZGVdPVwiZGF0ZXRpbWVwaWNrZXIubW9kZVwiXG4gICAgIGNsYXNzPVwibXR4LWRhdGV0aW1lcGlja2VyLWNvbnRlbnQtY29udGFpbmVyXCI+XG4gIDxtdHgtY2FsZW5kYXIgW2lkXT1cImRhdGV0aW1lcGlja2VyLmlkXCJcbiAgICAgICAgICAgICAgICBbbmdDbGFzc109XCJkYXRldGltZXBpY2tlci5wYW5lbENsYXNzXCJcbiAgICAgICAgICAgICAgICBbYXR0ci5tb2RlXT1cImRhdGV0aW1lcGlja2VyLm1vZGVcIlxuICAgICAgICAgICAgICAgIFt0eXBlXT1cImRhdGV0aW1lcGlja2VyLnR5cGVcIlxuICAgICAgICAgICAgICAgIFtzdGFydEF0XT1cImRhdGV0aW1lcGlja2VyLnN0YXJ0QXRcIlxuICAgICAgICAgICAgICAgIFtzdGFydFZpZXddPVwiZGF0ZXRpbWVwaWNrZXIuc3RhcnRWaWV3XCJcbiAgICAgICAgICAgICAgICBbbWF4RGF0ZV09XCJkYXRldGltZXBpY2tlci5fbWF4RGF0ZVwiXG4gICAgICAgICAgICAgICAgW21pbkRhdGVdPVwiZGF0ZXRpbWVwaWNrZXIuX21pbkRhdGVcIlxuICAgICAgICAgICAgICAgIFtkYXRlRmlsdGVyXT1cImRhdGV0aW1lcGlja2VyLl9kYXRlRmlsdGVyXCJcbiAgICAgICAgICAgICAgICBbbXVsdGlZZWFyU2VsZWN0b3JdPVwiZGF0ZXRpbWVwaWNrZXIubXVsdGlZZWFyU2VsZWN0b3JcIlxuICAgICAgICAgICAgICAgIFtwcmV2ZW50U2FtZURhdGVUaW1lU2VsZWN0aW9uXT1cImRhdGV0aW1lcGlja2VyLnByZXZlbnRTYW1lRGF0ZVRpbWVTZWxlY3Rpb25cIlxuICAgICAgICAgICAgICAgIFt0aW1lSW50ZXJ2YWxdPVwiZGF0ZXRpbWVwaWNrZXIudGltZUludGVydmFsXCJcbiAgICAgICAgICAgICAgICBbdHdlbHZlaG91cl09XCJkYXRldGltZXBpY2tlci50d2VsdmVob3VyXCJcbiAgICAgICAgICAgICAgICBbc2VsZWN0ZWRdPVwiZGF0ZXRpbWVwaWNrZXIuX3NlbGVjdGVkXCJcbiAgICAgICAgICAgICAgICBbdGltZUlucHV0XT1cImRhdGV0aW1lcGlja2VyLnRpbWVJbnB1dFwiXG4gICAgICAgICAgICAgICAgKHNlbGVjdGVkQ2hhbmdlKT1cImRhdGV0aW1lcGlja2VyLl9zZWxlY3QoJGV2ZW50KVwiXG4gICAgICAgICAgICAgICAgKHZpZXdDaGFuZ2VkKT1cImRhdGV0aW1lcGlja2VyLl92aWV3Q2hhbmdlZCgkZXZlbnQpXCJcbiAgICAgICAgICAgICAgICAoX3VzZXJTZWxlY3Rpb24pPVwiZGF0ZXRpbWVwaWNrZXIuY2xvc2UoKVwiXG4gICAgICAgICAgICAgICAgW0BmYWRlSW5DYWxlbmRhcl09XCInZW50ZXInXCI+XG4gIDwvbXR4LWNhbGVuZGFyPlxuPC9kaXY+XG4iXX0=