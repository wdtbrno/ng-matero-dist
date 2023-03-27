import { EventEmitter, Component, ViewEncapsulation, ChangeDetectionStrategy, ElementRef, ChangeDetectorRef, NgZone, Optional, Self, Host, Inject, Input, Output, ViewChild, NgModule } from '@angular/core';
import { DOCUMENT, CommonModule } from '@angular/common';
import { NgControl, FormsModule } from '@angular/forms';
import { MatMenuTrigger, MatMenuModule } from '@angular/material/menu';
import { MatFormFieldControl, MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ColorChromeModule } from 'ngx-color/chrome';
import { FocusMonitor } from '@angular/cdk/a11y';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { _supportsShadowDom } from '@angular/cdk/platform';
import { Subject, merge, fromEvent } from 'rxjs';
import { filter } from 'rxjs/operators';

let nextUniqueId = 0;
class MtxColorPickerComponent {
    constructor(_focusMonitor, _elementRef, _changeDetectorRef, _zone, ngControl, _formField, _document) {
        this._focusMonitor = _focusMonitor;
        this._elementRef = _elementRef;
        this._changeDetectorRef = _changeDetectorRef;
        this._zone = _zone;
        this.ngControl = ngControl;
        this._formField = _formField;
        this._document = _document;
        this._value = '';
        /** Implemented as part of MatFormFieldControl. */
        this.stateChanges = new Subject();
        /** Unique id for this input. */
        this._uid = `mtx-color-picker-${nextUniqueId++}`;
        this._focused = false;
        this._required = false;
        this._disabled = false;
        this._readonly = false;
        this.errorState = false;
        /** A name for this control that can be used by `mat-form-field`. */
        this.controlType = 'mtx-color-picker';
        /** `View -> model callback called when value changes` */
        this._onChange = () => { };
        /** `View -> model callback called when color picker has been touched` */
        this._onTouched = () => { };
        /** Event emitted when the color changed */
        this.colorChange = new EventEmitter();
        /** Whether or not the overlay panel is open. */
        this._panelOpen = false;
        /**
         * Whether the color picker can open the next time it is focused. Used to prevent a focused,
         * closed color picker from being reopened if the user switches to another browser tab and then
         * comes back.
         */
        this._canOpenOnNextFocus = true;
        /**
         * Event handler for when the window is blurred. Needs to be an
         * arrow function in order to preserve the context.
         */
        this._windowBlurHandler = () => {
            // If the user blurred the window while the color picker is focused, it means that it'll be
            // refocused when they come back. In this case we want to skip the first focus event, if the
            // pane was closed, in order to avoid reopening it unintentionally.
            this._canOpenOnNextFocus =
                this._document.activeElement !== this._elementRef.nativeElement || this._panelOpen;
        };
        _focusMonitor.monitor(_elementRef, true).subscribe(origin => {
            if (this._focused && !origin) {
                this._onTouched();
            }
            this._focused = !!origin;
            this.stateChanges.next();
        });
        if (this.ngControl != null) {
            this.ngControl.valueAccessor = this;
        }
    }
    /** Value of the color picker control. */
    get value() {
        return this._value;
    }
    set value(newValue) {
        this._value = newValue;
        this._onChange(newValue);
        this.stateChanges.next();
    }
    /** Unique id of the element. */
    get id() {
        return this._id;
    }
    set id(value) {
        this._id = value || this._uid;
        this.stateChanges.next();
    }
    /** Placeholder to be shown if value is empty. */
    get placeholder() {
        return this._placeholder;
    }
    set placeholder(value) {
        this._placeholder = value;
        this.stateChanges.next();
    }
    /** Whether the input is focused. */
    get focused() {
        return this._focused || this._panelOpen;
    }
    get empty() {
        return !this.value;
    }
    get shouldLabelFloat() {
        return this.focused || !this.empty;
    }
    get required() {
        return this._required;
    }
    set required(value) {
        this._required = coerceBooleanProperty(value);
        this.stateChanges.next();
    }
    get disabled() {
        return this._disabled;
    }
    set disabled(value) {
        this._disabled = coerceBooleanProperty(value);
        this.stateChanges.next();
    }
    /** Whether the element is readonly. */
    get readonly() {
        return this._readonly;
    }
    set readonly(value) {
        this._readonly = coerceBooleanProperty(value);
    }
    ngDoCheck() {
        if (this.ngControl) {
            this.errorState = (this.ngControl.invalid && this.ngControl.touched);
            this.stateChanges.next();
        }
    }
    ngAfterViewInit() {
        if (typeof window !== 'undefined') {
            this._zone.runOutsideAngular(() => {
                window.addEventListener('blur', this._windowBlurHandler);
            });
            if (_supportsShadowDom()) {
                const element = this._elementRef.nativeElement;
                const rootNode = element.getRootNode ? element.getRootNode() : null;
                // We need to take the `ShadowRoot` off of `window`, because the built-in types are
                // incorrect. See https://github.com/Microsoft/TypeScript/issues/27929.
                this._isInsideShadowRoot = rootNode instanceof window.ShadowRoot;
            }
        }
    }
    ngOnDestroy() {
        this.stateChanges.complete();
        this._focusMonitor.stopMonitoring(this._elementRef);
    }
    /** Implemented as part of MatFormFieldControl. */
    setDescribedByIds(ids) {
        this._ariaDescribedby = ids.join(' ');
    }
    /** Implemented as part of MatFormFieldControl. */
    onContainerClick() {
        this._handleFocus();
    }
    /**
     * Sets the model value. Implemented as part of ControlValueAccessor.
     * @param value New value to be written to the model.
     */
    writeValue(value) {
        this.value = value || '';
        this._changeDetectorRef.markForCheck();
    }
    /**
     * Registers a callback to be triggered when the model value changes.
     * Implemented as part of ControlValueAccessor.
     * @param fn Callback to be registered.
     */
    registerOnChange(fn) {
        this._onChange = fn;
    }
    /**
     * Registers a callback to be triggered when the control is touched.
     * Implemented as part of ControlValueAccessor.
     * @param fn Callback to be registered.
     */
    registerOnTouched(fn) {
        this._onTouched = fn;
    }
    /**
     * Sets the disabled state of the control. Implemented as a part of ControlValueAccessor.
     * @param isDisabled Whether the control should be disabled.
     */
    setDisabledState(isDisabled) {
        this.disabled = isDisabled;
    }
    /** Open panel with input focus event. */
    _handleFocus() {
        this.trigger.openMenu();
        this._closingActionsSubscription = merge(this._getOutsideClickStream())
            .pipe()
            .subscribe(event => {
            this.trigger.closeMenu();
            this._closingActionsSubscription.unsubscribe();
        });
    }
    /** Opens the overlay panel. */
    _openPanel() {
        if (this._focused) {
            this._panelOpen = true;
        }
    }
    /** Closes the overlay panel and focuses the host element. */
    _closePanel() {
        if (this._panelOpen) {
            this._panelOpen = false;
            this._changeDetectorRef.markForCheck();
            this._onTouched();
        }
    }
    /** The callback of color changed. */
    _onColorChanged(model) {
        this.value = model.color.hex;
        this.colorChange.emit(model);
    }
    /** Stream of clicks outside of the color picker panel. */
    _getOutsideClickStream() {
        return merge(fromEvent(this._document, 'click'), fromEvent(this._document, 'touchend')).pipe(filter(event => {
            // If we're in the Shadow DOM, the event target will be the shadow root, so we have to
            // fall back to check the first element in the path of the click event.
            const clickTarget = (this._isInsideShadowRoot && event.composedPath ? event.composedPath()[0] : event.target);
            const formField = this._formField ? this._formField._elementRef.nativeElement : null;
            return (clickTarget !== this._elementRef.nativeElement &&
                (!formField || !formField.contains(clickTarget)));
        }));
    }
}
MtxColorPickerComponent.decorators = [
    { type: Component, args: [{
                selector: 'mtx-color-picker',
                exportAs: 'mtxColorPicker',
                template: "<input matInput\n       [(ngModel)]=\"value\"\n       [placeholder]=\"placeholder\"\n       [disabled]=\"disabled\"\n       [readonly]=\"readonly\"\n       (focus)=\"_handleFocus()\"\n       autocomplete=\"off\">\n\n<div #colorPickerTrigger=\"matMenuTrigger\"\n     [matMenuTriggerFor]=\"colorPickerPopover\"\n     (menuOpened)=\"_openPanel()\"\n     (menuClosed)=\"_closePanel()\">\n</div>\n\n<mat-menu #colorPickerPopover=\"matMenu\" class=\"mtx-color-picker-panel\" [hasBackdrop]=\"false\">\n  <div class=\"mtx-color-picker\"\n       (click)=\"$event.stopPropagation()\"\n       (keydown)=\"$event.stopPropagation()\">\n    <color-chrome [color]=\"value\" (onChangeComplete)=\"_onColorChanged($event)\"></color-chrome>\n  </div>\n</mat-menu>\n",
                encapsulation: ViewEncapsulation.None,
                changeDetection: ChangeDetectionStrategy.OnPush,
                providers: [{ provide: MatFormFieldControl, useExisting: MtxColorPickerComponent }],
                styles: [".mtx-color-picker-panel .mat-menu-content:not(:empty){padding:0}.mtx-color-picker-panel .mtx-color-picker{padding:8px}.mtx-color-picker-panel .mtx-color-picker .chrome-picker{box-shadow:none;border-radius:0}.mtx-color-picker-panel .mtx-color-picker .chrome-picker .saturation{border-radius:0}"]
            },] }
];
/** @nocollapse */
MtxColorPickerComponent.ctorParameters = () => [
    { type: FocusMonitor },
    { type: ElementRef },
    { type: ChangeDetectorRef },
    { type: NgZone },
    { type: NgControl, decorators: [{ type: Optional }, { type: Self }] },
    { type: MatFormField, decorators: [{ type: Optional }, { type: Host }] },
    { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [DOCUMENT,] }] }
];
MtxColorPickerComponent.propDecorators = {
    value: [{ type: Input }],
    id: [{ type: Input }],
    placeholder: [{ type: Input }],
    required: [{ type: Input }],
    disabled: [{ type: Input }],
    readonly: [{ type: Input }],
    colorChange: [{ type: Output }],
    trigger: [{ type: ViewChild, args: [MatMenuTrigger, { static: true },] }]
};

class MtxColorPickerModule {
}
MtxColorPickerModule.decorators = [
    { type: NgModule, args: [{
                imports: [
                    CommonModule,
                    FormsModule,
                    MatMenuModule,
                    MatFormFieldModule,
                    MatInputModule,
                    ColorChromeModule,
                ],
                exports: [MtxColorPickerComponent],
                declarations: [MtxColorPickerComponent],
            },] }
];

/**
 * Generated bundle index. Do not edit.
 */

export { MtxColorPickerComponent, MtxColorPickerModule };
//# sourceMappingURL=mtxColorPicker.js.map
