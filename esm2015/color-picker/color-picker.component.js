import { Component, ViewEncapsulation, ChangeDetectionStrategy, ChangeDetectorRef, Optional, Self, ElementRef, Input, Output, EventEmitter, Inject, ViewChild, Host, NgZone, } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { NgControl } from '@angular/forms';
import { FocusMonitor } from '@angular/cdk/a11y';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { _supportsShadowDom } from '@angular/cdk/platform';
import { MatFormFieldControl, MatFormField } from '@angular/material/form-field';
import { MatMenuTrigger } from '@angular/material/menu';
import { Subject, merge, fromEvent } from 'rxjs';
import { filter } from 'rxjs/operators';
let nextUniqueId = 0;
export class MtxColorPickerComponent {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29sb3ItcGlja2VyLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL2V4dGVuc2lvbnMvY29sb3ItcGlja2VyL2NvbG9yLXBpY2tlci5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUNMLFNBQVMsRUFDVCxpQkFBaUIsRUFDakIsdUJBQXVCLEVBQ3ZCLGlCQUFpQixFQUVqQixRQUFRLEVBQ1IsSUFBSSxFQUNKLFVBQVUsRUFDVixLQUFLLEVBQ0wsTUFBTSxFQUNOLFlBQVksRUFDWixNQUFNLEVBRU4sU0FBUyxFQUNULElBQUksRUFFSixNQUFNLEdBQ1AsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQzNDLE9BQU8sRUFBd0IsU0FBUyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDakUsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLG1CQUFtQixDQUFDO0FBQ2pELE9BQU8sRUFBZ0IscUJBQXFCLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQztBQUM1RSxPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQztBQUMzRCxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsWUFBWSxFQUFFLE1BQU0sOEJBQThCLENBQUM7QUFDakYsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLHdCQUF3QixDQUFDO0FBQ3hELE9BQU8sRUFBRSxPQUFPLEVBQWMsS0FBSyxFQUFFLFNBQVMsRUFBZ0IsTUFBTSxNQUFNLENBQUM7QUFDM0UsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBSXhDLElBQUksWUFBWSxHQUFHLENBQUMsQ0FBQztBQVdyQixNQUFNLE9BQU8sdUJBQXVCO0lBcUlsQyxZQUNVLGFBQTJCLEVBQzNCLFdBQW9DLEVBQ3BDLGtCQUFxQyxFQUNyQyxLQUFhLEVBQ00sU0FBb0IsRUFDbkIs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LFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsa0JBQWtCO2dCQUM1QixRQUFRLEVBQUUsZ0JBQWdCO2dCQUMxQixzdkJBQTRDO2dCQUU1QyxhQUFhLEVBQUUsaUJBQWlCLENBQUMsSUFBSTtnQkFDckMsZUFBZSxFQUFFLHVCQUF1QixDQUFDLE1BQU07Z0JBQy9DLFNBQVMsRUFBRSxDQUFDLEVBQUUsT0FBTyxFQUFFLG1CQUFtQixFQUFFLFdBQVcsRUFBRSx1QkFBdUIsRUFBRSxDQUFDOzthQUNwRjs7OztZQXBCUSxZQUFZO1lBYm5CLFVBQVU7WUFKVixpQkFBaUI7WUFhakIsTUFBTTtZQUd1QixTQUFTLHVCQWdLbkMsUUFBUSxZQUFJLElBQUk7WUE1SlMsWUFBWSx1QkE2SnJDLFFBQVEsWUFBSSxJQUFJOzRDQUNoQixRQUFRLFlBQUksTUFBTSxTQUFDLFFBQVE7OztvQkF6STdCLEtBQUs7aUJBa0JMLEtBQUs7MEJBV0wsS0FBSzt1QkF3QkwsS0FBSzt1QkFVTCxLQUFLO3VCQVdMLEtBQUs7MEJBd0JMLE1BQU07c0JBRU4sU0FBUyxTQUFDLGNBQWMsRUFBRSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBDb21wb25lbnQsXG4gIFZpZXdFbmNhcHN1bGF0aW9uLFxuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gIE9uRGVzdHJveSxcbiAgT3B0aW9uYWwsXG4gIFNlbGYsXG4gIEVsZW1lbnRSZWYsXG4gIElucHV0LFxuICBPdXRwdXQsXG4gIEV2ZW50RW1pdHRlcixcbiAgSW5qZWN0LFxuICBEb0NoZWNrLFxuICBWaWV3Q2hpbGQsXG4gIEhvc3QsXG4gIEFmdGVyVmlld0luaXQsXG4gIE5nWm9uZSxcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBET0NVTUVOVCB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQgeyBDb250cm9sVmFsdWVBY2Nlc3NvciwgTmdDb250cm9sIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuaW1wb3J0IHsgRm9jdXNNb25pdG9yIH0gZnJvbSAnQGFuZ3VsYXIvY2RrL2ExMXknO1xuaW1wb3J0IHsgQm9vbGVhbklucHV0LCBjb2VyY2VCb29sZWFuUHJvcGVydHkgfSBmcm9tICdAYW5ndWxhci9jZGsvY29lcmNpb24nO1xuaW1wb3J0IHsgX3N1cHBvcnRzU2hhZG93RG9tIH0gZnJvbSAnQGFuZ3VsYXIvY2RrL3BsYXRmb3JtJztcbmltcG9ydCB7IE1hdEZvcm1GaWVsZENvbnRyb2wsIE1hdEZvcm1GaWVsZCB9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2Zvcm0tZmllbGQnO1xuaW1wb3J0IHsgTWF0TWVudVRyaWdnZXIgfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9tZW51JztcbmltcG9ydCB7IFN1YmplY3QsIE9ic2VydmFibGUsIG1lcmdlLCBmcm9tRXZlbnQsIFN1YnNjcmlwdGlvbiB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgZmlsdGVyIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG5pbXBvcnQgeyBDb2xvckV2ZW50IH0gZnJvbSAnbmd4LWNvbG9yJztcblxubGV0IG5leHRVbmlxdWVJZCA9IDA7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ210eC1jb2xvci1waWNrZXInLFxuICBleHBvcnRBczogJ210eENvbG9yUGlja2VyJyxcbiAgdGVtcGxhdGVVcmw6ICcuL2NvbG9yLXBpY2tlci5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL2NvbG9yLXBpY2tlci5jb21wb25lbnQuc2NzcyddLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgcHJvdmlkZXJzOiBbeyBwcm92aWRlOiBNYXRGb3JtRmllbGRDb250cm9sLCB1c2VFeGlzdGluZzogTXR4Q29sb3JQaWNrZXJDb21wb25lbnQgfV0sXG59KVxuZXhwb3J0IGNsYXNzIE10eENvbG9yUGlja2VyQ29tcG9uZW50XG4gIGltcGxlbWVudHMgT25EZXN0cm95LCBEb0NoZWNrLCBBZnRlclZpZXdJbml0LCBDb250cm9sVmFsdWVBY2Nlc3NvciwgTWF0Rm9ybUZpZWxkQ29udHJvbDxhbnk+IHtcbiAgLyoqIFZhbHVlIG9mIHRoZSBjb2xvciBwaWNrZXIgY29udHJvbC4gKi9cbiAgQElucHV0KClcbiAgZ2V0IHZhbHVlKCk6IHN0cmluZyB8IG51bGwge1xuICAgIHJldHVybiB0aGlzLl92YWx1ZTtcbiAgfVxuICBzZXQgdmFsdWUobmV3VmFsdWU6IHN0cmluZyB8IG51bGwpIHtcbiAgICB0aGlzLl92YWx1ZSA9IG5ld1ZhbHVlO1xuICAgIHRoaXMuX29uQ2hhbmdlKG5ld1ZhbHVlKTtcbiAgICB0aGlzLnN0YXRlQ2hhbmdlcy5uZXh0KCk7XG4gIH1cbiAgcHJpdmF0ZSBfdmFsdWU6IHN0cmluZyB8IG51bGwgPSAnJztcblxuICAvKiogSW1wbGVtZW50ZWQgYXMgcGFydCBvZiBNYXRGb3JtRmllbGRDb250cm9sLiAqL1xuICByZWFkb25seSBzdGF0ZUNoYW5nZXM6IFN1YmplY3Q8dm9pZD4gPSBuZXcgU3ViamVjdDx2b2lkPigpO1xuXG4gIC8qKiBVbmlxdWUgaWQgZm9yIHRoaXMgaW5wdXQuICovXG4gIHByaXZhdGUgX3VpZCA9IGBtdHgtY29sb3ItcGlja2VyLSR7bmV4dFVuaXF1ZUlkKyt9YDtcblxuICAvKiogVW5pcXVlIGlkIG9mIHRoZSBlbGVtZW50LiAqL1xuICBASW5wdXQoKVxuICBnZXQgaWQoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5faWQ7XG4gIH1cbiAgc2V0IGlkKHZhbHVlOiBzdHJpbmcpIHtcbiAgICB0aGlzLl9pZCA9IHZhbHVlIHx8IHRoaXMuX3VpZDtcbiAgICB0aGlzLnN0YXRlQ2hhbmdlcy5uZXh0KCk7XG4gIH1cbiAgcHJpdmF0ZSBfaWQ6IHN0cmluZztcblxuICAvKiogUGxhY2Vob2xkZXIgdG8gYmUgc2hvd24gaWYgdmFsdWUgaXMgZW1wdHkuICovXG4gIEBJbnB1dCgpXG4gIGdldCBwbGFjZWhvbGRlcigpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLl9wbGFjZWhvbGRlcjtcbiAgfVxuICBzZXQgcGxhY2Vob2xkZXIodmFsdWU6IHN0cmluZykge1xuICAgIHRoaXMuX3BsYWNlaG9sZGVyID0gdmFsdWU7XG4gICAgdGhpcy5zdGF0ZUNoYW5nZXMubmV4dCgpO1xuICB9XG4gIHByaXZhdGUgX3BsYWNlaG9sZGVyOiBzdHJpbmc7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGlucHV0IGlzIGZvY3VzZWQuICovXG4gIGdldCBmb2N1c2VkKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9mb2N1c2VkIHx8IHRoaXMuX3BhbmVsT3BlbjtcbiAgfVxuICBwcml2YXRlIF9mb2N1c2VkID0gZmFsc2U7XG5cbiAgZ2V0IGVtcHR5KCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiAhdGhpcy52YWx1ZTtcbiAgfVxuXG4gIGdldCBzaG91bGRMYWJlbEZsb2F0KCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLmZvY3VzZWQgfHwgIXRoaXMuZW1wdHk7XG4gIH1cblxuICBASW5wdXQoKVxuICBnZXQgcmVxdWlyZWQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX3JlcXVpcmVkO1xuICB9XG4gIHNldCByZXF1aXJlZCh2YWx1ZTogYm9vbGVhbikge1xuICAgIHRoaXMuX3JlcXVpcmVkID0gY29lcmNlQm9vbGVhblByb3BlcnR5KHZhbHVlKTtcbiAgICB0aGlzLnN0YXRlQ2hhbmdlcy5uZXh0KCk7XG4gIH1cbiAgcHJpdmF0ZSBfcmVxdWlyZWQgPSBmYWxzZTtcblxuICBASW5wdXQoKVxuICBnZXQgZGlzYWJsZWQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX2Rpc2FibGVkO1xuICB9XG4gIHNldCBkaXNhYmxlZCh2YWx1ZTogYm9vbGVhbikge1xuICAgIHRoaXMuX2Rpc2FibGVkID0gY29lcmNlQm9vbGVhblByb3BlcnR5KHZhbHVlKTtcbiAgICB0aGlzLnN0YXRlQ2hhbmdlcy5uZXh0KCk7XG4gIH1cbiAgcHJpdmF0ZSBfZGlzYWJsZWQgPSBmYWxzZTtcblxuICAvKiogV2hldGhlciB0aGUgZWxlbWVudCBpcyByZWFkb25seS4gKi9cbiAgQElucHV0KClcbiAgZ2V0IHJlYWRvbmx5KCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9yZWFkb25seTtcbiAgfVxuICBzZXQgcmVhZG9ubHkodmFsdWU6IGJvb2xlYW4pIHtcbiAgICB0aGlzLl9yZWFkb25seSA9IGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSh2YWx1ZSk7XG4gIH1cbiAgcHJpdmF0ZSBfcmVhZG9ubHkgPSBmYWxzZTtcblxuICBlcnJvclN0YXRlID0gZmFsc2U7XG5cbiAgLyoqIEEgbmFtZSBmb3IgdGhpcyBjb250cm9sIHRoYXQgY2FuIGJlIHVzZWQgYnkgYG1hdC1mb3JtLWZpZWxkYC4gKi9cbiAgY29udHJvbFR5cGUgPSAnbXR4LWNvbG9yLXBpY2tlcic7XG5cbiAgLyoqIFRoZSBhcmlhLWRlc2NyaWJlZGJ5IGF0dHJpYnV0ZSBvbiB0aGUgY29sb3IgcGlja2VyIGZvciBpbXByb3ZlZCBhMTF5LiAqL1xuICBfYXJpYURlc2NyaWJlZGJ5OiBzdHJpbmc7XG5cbiAgLyoqIGBWaWV3IC0+IG1vZGVsIGNhbGxiYWNrIGNhbGxlZCB3aGVuIHZhbHVlIGNoYW5nZXNgICovXG4gIF9vbkNoYW5nZTogKHZhbHVlOiBhbnkpID0+IHZvaWQgPSAoKSA9PiB7fTtcblxuICAvKiogYFZpZXcgLT4gbW9kZWwgY2FsbGJhY2sgY2FsbGVkIHdoZW4gY29sb3IgcGlja2VyIGhhcyBiZWVuIHRvdWNoZWRgICovXG4gIF9vblRvdWNoZWQgPSAoKSA9PiB7fTtcblxuICAvKiogRXZlbnQgZW1pdHRlZCB3aGVuIHRoZSBjb2xvciBjaGFuZ2VkICovXG4gIEBPdXRwdXQoKSByZWFkb25seSBjb2xvckNoYW5nZSA9IG5ldyBFdmVudEVtaXR0ZXI8Q29sb3JFdmVudD4oKTtcblxuICBAVmlld0NoaWxkKE1hdE1lbnVUcmlnZ2VyLCB7IHN0YXRpYzogdHJ1ZSB9KSB0cmlnZ2VyOiBNYXRNZW51VHJpZ2dlcjtcblxuICAvKiogV2hldGhlciBvciBub3QgdGhlIG92ZXJsYXkgcGFuZWwgaXMgb3Blbi4gKi9cbiAgX3BhbmVsT3BlbiA9IGZhbHNlO1xuXG4gIC8qKiBUaGUgc3Vic2NyaXB0aW9uIGZvciBjbG9zaW5nIGFjdGlvbnMgKHNvbWUgYXJlIGJvdW5kIHRvIGRvY3VtZW50KS4gKi9cbiAgcHJpdmF0ZSBfY2xvc2luZ0FjdGlvbnNTdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbjtcblxuICAvKiogV2hldGhlciB0aGUgZWxlbWVudCBpcyBpbnNpZGUgb2YgYSBTaGFkb3dSb290IGNvbXBvbmVudC4gKi9cbiAgcHJpdmF0ZSBfaXNJbnNpZGVTaGFkb3dSb290OiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHRoZSBjb2xvciBwaWNrZXIgY2FuIG9wZW4gdGhlIG5leHQgdGltZSBpdCBpcyBmb2N1c2VkLiBVc2VkIHRvIHByZXZlbnQgYSBmb2N1c2VkLFxuICAgKiBjbG9zZWQgY29sb3IgcGlja2VyIGZyb20gYmVpbmcgcmVvcGVuZWQgaWYgdGhlIHVzZXIgc3dpdGNoZXMgdG8gYW5vdGhlciBicm93c2VyIHRhYiBhbmQgdGhlblxuICAgKiBjb21lcyBiYWNrLlxuICAgKi9cbiAgcHJpdmF0ZSBfY2FuT3Blbk9uTmV4dEZvY3VzID0gdHJ1ZTtcblxuICAvKipcbiAgICogRXZlbnQgaGFuZGxlciBmb3Igd2hlbiB0aGUgd2luZG93IGlzIGJsdXJyZWQuIE5lZWRzIHRvIGJlIGFuXG4gICAqIGFycm93IGZ1bmN0aW9uIGluIG9yZGVyIHRvIHByZXNlcnZlIHRoZSBjb250ZXh0LlxuICAgKi9cbiAgcHJpdmF0ZSBfd2luZG93Qmx1ckhhbmRsZXIgPSAoKSA9PiB7XG4gICAgLy8gSWYgdGhlIHVzZXIgYmx1cnJlZCB0aGUgd2luZG93IHdoaWxlIHRoZSBjb2xvciBwaWNrZXIgaXMgZm9jdXNlZCwgaXQgbWVhbnMgdGhhdCBpdCdsbCBiZVxuICAgIC8vIHJlZm9jdXNlZCB3aGVuIHRoZXkgY29tZSBiYWNrLiBJbiB0aGlzIGNhc2Ugd2Ugd2FudCB0byBza2lwIHRoZSBmaXJzdCBmb2N1cyBldmVudCwgaWYgdGhlXG4gICAgLy8gcGFuZSB3YXMgY2xvc2VkLCBpbiBvcmRlciB0byBhdm9pZCByZW9wZW5pbmcgaXQgdW5pbnRlbnRpb25hbGx5LlxuICAgIHRoaXMuX2Nhbk9wZW5Pbk5leHRGb2N1cyA9XG4gICAgICB0aGlzLl9kb2N1bWVudC5hY3RpdmVFbGVtZW50ICE9PSB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQgfHwgdGhpcy5fcGFuZWxPcGVuO1xuICB9O1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgX2ZvY3VzTW9uaXRvcjogRm9jdXNNb25pdG9yLFxuICAgIHByaXZhdGUgX2VsZW1lbnRSZWY6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+LFxuICAgIHByaXZhdGUgX2NoYW5nZURldGVjdG9yUmVmOiBDaGFuZ2VEZXRlY3RvclJlZixcbiAgICBwcml2YXRlIF96b25lOiBOZ1pvbmUsXG4gICAgQE9wdGlvbmFsKCkgQFNlbGYoKSBwdWJsaWMgbmdDb250cm9sOiBOZ0NvbnRyb2wsXG4gICAgQE9wdGlvbmFsKCkgQEhvc3QoKSBwcml2YXRlIF9mb3JtRmllbGQ6IE1hdEZvcm1GaWVsZCxcbiAgICBAT3B0aW9uYWwoKSBASW5qZWN0KERPQ1VNRU5UKSBwcml2YXRlIF9kb2N1bWVudDogYW55XG4gICkge1xuICAgIF9mb2N1c01vbml0b3IubW9uaXRvcihfZWxlbWVudFJlZiwgdHJ1ZSkuc3Vic2NyaWJlKG9yaWdpbiA9PiB7XG4gICAgICBpZiAodGhpcy5fZm9jdXNlZCAmJiAhb3JpZ2luKSB7XG4gICAgICAgIHRoaXMuX29uVG91Y2hlZCgpO1xuICAgICAgfVxuICAgICAgdGhpcy5fZm9jdXNlZCA9ICEhb3JpZ2luO1xuICAgICAgdGhpcy5zdGF0ZUNoYW5nZXMubmV4dCgpO1xuICAgIH0pO1xuXG4gICAgaWYgKHRoaXMubmdDb250cm9sICE9IG51bGwpIHtcbiAgICAgIHRoaXMubmdDb250cm9sLnZhbHVlQWNjZXNzb3IgPSB0aGlzO1xuICAgIH1cbiAgfVxuXG4gIG5nRG9DaGVjaygpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5uZ0NvbnRyb2wpIHtcbiAgICAgIHRoaXMuZXJyb3JTdGF0ZSA9ICh0aGlzLm5nQ29udHJvbC5pbnZhbGlkICYmIHRoaXMubmdDb250cm9sLnRvdWNoZWQpIGFzIGJvb2xlYW47XG4gICAgICB0aGlzLnN0YXRlQ2hhbmdlcy5uZXh0KCk7XG4gICAgfVxuICB9XG5cbiAgbmdBZnRlclZpZXdJbml0KCkge1xuICAgIGlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgdGhpcy5fem9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB7XG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdibHVyJywgdGhpcy5fd2luZG93Qmx1ckhhbmRsZXIpO1xuICAgICAgfSk7XG5cbiAgICAgIGlmIChfc3VwcG9ydHNTaGFkb3dEb20oKSkge1xuICAgICAgICBjb25zdCBlbGVtZW50ID0gdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50O1xuICAgICAgICBjb25zdCByb290Tm9kZSA9IGVsZW1lbnQuZ2V0Um9vdE5vZGUgPyBlbGVtZW50LmdldFJvb3ROb2RlKCkgOiBudWxsO1xuXG4gICAgICAgIC8vIFdlIG5lZWQgdG8gdGFrZSB0aGUgYFNoYWRvd1Jvb3RgIG9mZiBvZiBgd2luZG93YCwgYmVjYXVzZSB0aGUgYnVpbHQtaW4gdHlwZXMgYXJlXG4gICAgICAgIC8vIGluY29ycmVjdC4gU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9NaWNyb3NvZnQvVHlwZVNjcmlwdC9pc3N1ZXMvMjc5MjkuXG4gICAgICAgIHRoaXMuX2lzSW5zaWRlU2hhZG93Um9vdCA9IHJvb3ROb2RlIGluc3RhbmNlb2YgKHdpbmRvdyBhcyBhbnkpLlNoYWRvd1Jvb3Q7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgdGhpcy5zdGF0ZUNoYW5nZXMuY29tcGxldGUoKTtcbiAgICB0aGlzLl9mb2N1c01vbml0b3Iuc3RvcE1vbml0b3JpbmcodGhpcy5fZWxlbWVudFJlZik7XG4gIH1cblxuICAvKiogSW1wbGVtZW50ZWQgYXMgcGFydCBvZiBNYXRGb3JtRmllbGRDb250cm9sLiAqL1xuICBzZXREZXNjcmliZWRCeUlkcyhpZHM6IHN0cmluZ1tdKSB7XG4gICAgdGhpcy5fYXJpYURlc2NyaWJlZGJ5ID0gaWRzLmpvaW4oJyAnKTtcbiAgfVxuXG4gIC8qKiBJbXBsZW1lbnRlZCBhcyBwYXJ0IG9mIE1hdEZvcm1GaWVsZENvbnRyb2wuICovXG4gIG9uQ29udGFpbmVyQ2xpY2soKSB7XG4gICAgdGhpcy5faGFuZGxlRm9jdXMoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSBtb2RlbCB2YWx1ZS4gSW1wbGVtZW50ZWQgYXMgcGFydCBvZiBDb250cm9sVmFsdWVBY2Nlc3Nvci5cbiAgICogQHBhcmFtIHZhbHVlIE5ldyB2YWx1ZSB0byBiZSB3cml0dGVuIHRvIHRoZSBtb2RlbC5cbiAgICovXG4gIHdyaXRlVmFsdWUodmFsdWU6IHN0cmluZyB8IG51bGwpOiB2b2lkIHtcbiAgICB0aGlzLnZhbHVlID0gdmFsdWUgfHwgJyc7XG4gICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCk7XG4gIH1cblxuICAvKipcbiAgICogUmVnaXN0ZXJzIGEgY2FsbGJhY2sgdG8gYmUgdHJpZ2dlcmVkIHdoZW4gdGhlIG1vZGVsIHZhbHVlIGNoYW5nZXMuXG4gICAqIEltcGxlbWVudGVkIGFzIHBhcnQgb2YgQ29udHJvbFZhbHVlQWNjZXNzb3IuXG4gICAqIEBwYXJhbSBmbiBDYWxsYmFjayB0byBiZSByZWdpc3RlcmVkLlxuICAgKi9cbiAgcmVnaXN0ZXJPbkNoYW5nZShmbjogYW55KTogdm9pZCB7XG4gICAgdGhpcy5fb25DaGFuZ2UgPSBmbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWdpc3RlcnMgYSBjYWxsYmFjayB0byBiZSB0cmlnZ2VyZWQgd2hlbiB0aGUgY29udHJvbCBpcyB0b3VjaGVkLlxuICAgKiBJbXBsZW1lbnRlZCBhcyBwYXJ0IG9mIENvbnRyb2xWYWx1ZUFjY2Vzc29yLlxuICAgKiBAcGFyYW0gZm4gQ2FsbGJhY2sgdG8gYmUgcmVnaXN0ZXJlZC5cbiAgICovXG4gIHJlZ2lzdGVyT25Ub3VjaGVkKGZuOiBhbnkpOiB2b2lkIHtcbiAgICB0aGlzLl9vblRvdWNoZWQgPSBmbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSBkaXNhYmxlZCBzdGF0ZSBvZiB0aGUgY29udHJvbC4gSW1wbGVtZW50ZWQgYXMgYSBwYXJ0IG9mIENvbnRyb2xWYWx1ZUFjY2Vzc29yLlxuICAgKiBAcGFyYW0gaXNEaXNhYmxlZCBXaGV0aGVyIHRoZSBjb250cm9sIHNob3VsZCBiZSBkaXNhYmxlZC5cbiAgICovXG4gIHNldERpc2FibGVkU3RhdGUoaXNEaXNhYmxlZDogYm9vbGVhbikge1xuICAgIHRoaXMuZGlzYWJsZWQgPSBpc0Rpc2FibGVkO1xuICB9XG5cbiAgLyoqIE9wZW4gcGFuZWwgd2l0aCBpbnB1dCBmb2N1cyBldmVudC4gKi9cbiAgX2hhbmRsZUZvY3VzKCkge1xuICAgIHRoaXMudHJpZ2dlci5vcGVuTWVudSgpO1xuXG4gICAgdGhpcy5fY2xvc2luZ0FjdGlvbnNTdWJzY3JpcHRpb24gPSBtZXJnZSh0aGlzLl9nZXRPdXRzaWRlQ2xpY2tTdHJlYW0oKSlcbiAgICAgIC5waXBlKClcbiAgICAgIC5zdWJzY3JpYmUoZXZlbnQgPT4ge1xuICAgICAgICB0aGlzLnRyaWdnZXIuY2xvc2VNZW51KCk7XG4gICAgICAgIHRoaXMuX2Nsb3NpbmdBY3Rpb25zU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgICB9KTtcbiAgfVxuXG4gIC8qKiBPcGVucyB0aGUgb3ZlcmxheSBwYW5lbC4gKi9cbiAgX29wZW5QYW5lbCgpIHtcbiAgICBpZiAodGhpcy5fZm9jdXNlZCkge1xuICAgICAgdGhpcy5fcGFuZWxPcGVuID0gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICAvKiogQ2xvc2VzIHRoZSBvdmVybGF5IHBhbmVsIGFuZCBmb2N1c2VzIHRoZSBob3N0IGVsZW1lbnQuICovXG4gIF9jbG9zZVBhbmVsKCkge1xuICAgIGlmICh0aGlzLl9wYW5lbE9wZW4pIHtcbiAgICAgIHRoaXMuX3BhbmVsT3BlbiA9IGZhbHNlO1xuICAgICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCk7XG4gICAgICB0aGlzLl9vblRvdWNoZWQoKTtcbiAgICB9XG4gIH1cblxuICAvKiogVGhlIGNhbGxiYWNrIG9mIGNvbG9yIGNoYW5nZWQuICovXG4gIF9vbkNvbG9yQ2hhbmdlZChtb2RlbDogQ29sb3JFdmVudCkge1xuICAgIHRoaXMudmFsdWUgPSBtb2RlbC5jb2xvci5oZXg7XG4gICAgdGhpcy5jb2xvckNoYW5nZS5lbWl0KG1vZGVsKTtcbiAgfVxuXG4gIC8qKiBTdHJlYW0gb2YgY2xpY2tzIG91dHNpZGUgb2YgdGhlIGNvbG9yIHBpY2tlciBwYW5lbC4gKi9cbiAgcHJpdmF0ZSBfZ2V0T3V0c2lkZUNsaWNrU3RyZWFtKCk6IE9ic2VydmFibGU8YW55PiB7XG4gICAgcmV0dXJuIG1lcmdlKFxuICAgICAgZnJvbUV2ZW50KHRoaXMuX2RvY3VtZW50LCAnY2xpY2snKSBhcyBPYnNlcnZhYmxlPE1vdXNlRXZlbnQ+LFxuICAgICAgZnJvbUV2ZW50KHRoaXMuX2RvY3VtZW50LCAndG91Y2hlbmQnKSBhcyBPYnNlcnZhYmxlPFRvdWNoRXZlbnQ+XG4gICAgKS5waXBlKFxuICAgICAgZmlsdGVyKGV2ZW50ID0+IHtcbiAgICAgICAgLy8gSWYgd2UncmUgaW4gdGhlIFNoYWRvdyBET00sIHRoZSBldmVudCB0YXJnZXQgd2lsbCBiZSB0aGUgc2hhZG93IHJvb3QsIHNvIHdlIGhhdmUgdG9cbiAgICAgICAgLy8gZmFsbCBiYWNrIHRvIGNoZWNrIHRoZSBmaXJzdCBlbGVtZW50IGluIHRoZSBwYXRoIG9mIHRoZSBjbGljayBldmVudC5cbiAgICAgICAgY29uc3QgY2xpY2tUYXJnZXQgPSAoXG4gICAgICAgICAgdGhpcy5faXNJbnNpZGVTaGFkb3dSb290ICYmIGV2ZW50LmNvbXBvc2VkUGF0aCA/IGV2ZW50LmNvbXBvc2VkUGF0aCgpWzBdIDogZXZlbnQudGFyZ2V0XG4gICAgICAgICkgYXMgSFRNTEVsZW1lbnQ7XG4gICAgICAgIGNvbnN0IGZvcm1GaWVsZCA9IHRoaXMuX2Zvcm1GaWVsZCA/IHRoaXMuX2Zvcm1GaWVsZC5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50IDogbnVsbDtcblxuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgIGNsaWNrVGFyZ2V0ICE9PSB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQgJiZcbiAgICAgICAgICAoIWZvcm1GaWVsZCB8fCAhZm9ybUZpZWxkLmNvbnRhaW5zKGNsaWNrVGFyZ2V0KSlcbiAgICAgICAgKTtcbiAgICAgIH0pXG4gICAgKTtcbiAgfVxuXG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9yZXF1aXJlZDogQm9vbGVhbklucHV0O1xuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfcmVhZG9ubHk6IEJvb2xlYW5JbnB1dDtcbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX2Rpc2FibGVkOiBCb29sZWFuSW5wdXQ7XG59XG4iXX0=