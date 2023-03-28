import { Component, ChangeDetectionStrategy, ViewEncapsulation, Input, Output, EventEmitter, forwardRef, ContentChildren, } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { MatCheckbox } from '@angular/material/checkbox';
import * as i0 from "@angular/core";
import * as i1 from "@angular/cdk/a11y";
import * as i2 from "@angular/common";
import * as i3 from "@angular/forms";
import * as i4 from "@angular/material/checkbox";
import * as i5 from "@ng-matero/extensions/core";
export class MtxCheckboxBase {
    constructor(label, value) {
        this.label = label;
        this.value = value;
    }
}
export class MtxCheckboxGroup {
    get items() {
        return this._items;
    }
    set items(value) {
        // TODO: Deep clone
        this._originalItems = JSON.parse(JSON.stringify(value));
        this._items = value.map(option => {
            return option instanceof Object ? option : new MtxCheckboxBase(option, option);
        });
    }
    get showSelectAll() {
        return this._showSelectAll;
    }
    set showSelectAll(value) {
        this._showSelectAll = coerceBooleanProperty(value);
    }
    get compareWith() {
        return this._compareWith;
    }
    set compareWith(fn) {
        if (typeof fn !== 'function') {
            throw Error('`compareWith` must be a function.');
        }
        if (fn) {
            this._compareWith = fn;
        }
    }
    get disabled() {
        return this._disabled;
    }
    set disabled(value) {
        this._disabled = coerceBooleanProperty(value);
    }
    constructor(_changeDetectorRef, _focusMonitor, _elementRef) {
        this._changeDetectorRef = _changeDetectorRef;
        this._focusMonitor = _focusMonitor;
        this._elementRef = _elementRef;
        this._items = [];
        this._originalItems = [];
        this.bindLabel = 'label';
        this.bindValue = 'value';
        this._showSelectAll = false;
        this.selectAllLabel = 'Select All';
        this._disabled = false;
        this.change = new EventEmitter();
        this.selectAll = false;
        this.selectAllIndeterminate = false;
        this.selectedItems = [];
        this._onChange = () => null;
        this._onTouched = () => null;
    }
    ngAfterViewInit() {
        this._focusMonitor.monitor(this._elementRef, true).subscribe(focusOrigin => {
            if (!focusOrigin) {
                // When a focused element becomes disabled, the browser *immediately* fires a blur event.
                // Angular does not expect events to be raised during change detection, so any state change
                // (such as a form control's 'ng-touched') will cause a changed-after-checked error.
                // See https://github.com/angular/angular/issues/17793. To work around this, we defer
                // telling the form control it has been touched until the next tick.
                Promise.resolve().then(() => {
                    this._onTouched();
                    this._changeDetectorRef.markForCheck();
                });
            }
        });
    }
    ngOnDestroy() {
        this._focusMonitor.stopMonitoring(this._elementRef);
    }
    /**
     * Finds and selects and option based on its value.
     * @returns Option that has the corresponding value.
     */
    _selectValue(value) {
        const correspondingOption = this.items.find(option => {
            try {
                const compareValue = option[this.bindValue] === value;
                return this._compareWith ? this._compareWith(option, value) : compareValue;
            }
            catch (error) {
                console.warn(error);
                return false;
            }
        });
        if (correspondingOption) {
            correspondingOption.checked = true;
        }
        return correspondingOption;
    }
    /**
     * Sets the model value. Implemented as part of ControlValueAccessor.
     * @param value New value to be written to the model.
     */
    writeValue(value) {
        if (value) {
            if (!Array.isArray(value)) {
                throw Error('Value must be an array.');
            }
            value.forEach((currentValue) => this._selectValue(currentValue));
            this.selectedItems = value;
        }
        this._checkMasterCheckboxState();
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
        this._disabled = isDisabled;
    }
    _checkMasterCheckboxState() {
        if (this.items
            .filter(option => option.checked || !option.disabled)
            .every(option => !option.checked)) {
            this.selectAll = false;
            this.selectAllIndeterminate = false;
        }
        else if (this.items
            .filter(option => option.checked || !option.disabled)
            .every(option => option.checked)) {
            this.selectAll = true;
            this.selectAllIndeterminate = false;
        }
        else {
            this.selectAllIndeterminate = true;
        }
    }
    _getSelectedItems(index) {
        this.selectedItems = this.items.filter(option => option.checked);
        if (this._compareWith) {
            this.selectedItems = this._originalItems.filter(option => this.selectedItems.find(selectedOption => this._compareWith(option, selectedOption)));
        }
        else {
            this.selectedItems = this.selectedItems.map(option => option[this.bindValue]);
        }
        this._onChange(this.selectedItems);
        this.change.emit({ model: this.selectedItems, index });
    }
    /** Handle normal checkbox toggle */
    _updateNormalCheckboxState(e, index) {
        this._checkMasterCheckboxState();
        this._getSelectedItems(index);
    }
    /** Handle master checkbox toggle */
    _updateMasterCheckboxState(e, index) {
        this.selectAll = !this.selectAll;
        this.selectAllIndeterminate = false;
        if (this.selectAll) {
            this.items
                .filter(option => option.checked || !option.disabled)
                .forEach(option => (option.checked = true));
        }
        else {
            this.items
                .filter(option => option.checked || !option.disabled)
                .forEach(option => (option.checked = !!option.disabled));
        }
        this._getSelectedItems(index);
    }
}
/** @nocollapse */ MtxCheckboxGroup.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MtxCheckboxGroup, deps: [{ token: i0.ChangeDetectorRef }, { token: i1.FocusMonitor }, { token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Component });
/** @nocollapse */ MtxCheckboxGroup.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.1", type: MtxCheckboxGroup, selector: "mtx-checkbox-group", inputs: { items: "items", bindLabel: "bindLabel", bindValue: "bindValue", showSelectAll: "showSelectAll", selectAllLabel: "selectAllLabel", compareWith: "compareWith", disabled: "disabled" }, outputs: { change: "change" }, host: { classAttribute: "mtx-checkbox-group" }, providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef((() => MtxCheckboxGroup)),
            multi: true,
        },
    ], queries: [{ propertyName: "_checkboxes", predicate: i0.forwardRef(function () { return MatCheckbox; }), descendants: true }], exportAs: ["mtxCheckboxGroup"], ngImport: i0, template: "<mat-checkbox class=\"mtx-checkbox-master\"\n              *ngIf=\"showSelectAll\"\n              [checked]=\"selectAll\"\n              [(indeterminate)]=\"selectAllIndeterminate\"\n              [disabled]=\"disabled\"\n              (change)=\"_updateMasterCheckboxState($event, -1)\">\n  {{selectAllLabel}}\n</mat-checkbox>\n\n<mat-checkbox class=\"mtx-checkbox-normal\"\n              *ngFor=\"let option of items; let i = index;\"\n              [(ngModel)]=\"option.checked\"\n              [ngModelOptions]=\"{standalone: true}\"\n              [aria-describedby]=\"option.ariaDescribedby\"\n              [aria-label]=\"option.ariaLabel\"\n              [aria-labelledby]=\"option.ariaLabelledby\"\n              [color]=\"option.color\"\n              [disabled]=\"option.disabled || disabled\"\n              [disableRipple]=\"option.disableRipple\"\n              [labelPosition]=\"option.labelPosition\"\n              [required]=\"option.required\"\n              (change)=\"_updateNormalCheckboxState($event, i)\">\n  {{option[bindLabel] | toObservable | async}}\n</mat-checkbox>\n", styles: [""], dependencies: [{ kind: "directive", type: i2.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i2.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i3.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i3.RequiredValidator, selector: ":not([type=checkbox])[required][formControlName],:not([type=checkbox])[required][formControl],:not([type=checkbox])[required][ngModel]", inputs: ["required"] }, { kind: "directive", type: i3.NgModel, selector: "[ngModel]:not([formControlName]):not([formControl])", inputs: ["name", "disabled", "ngModel", "ngModelOptions"], outputs: ["ngModelChange"], exportAs: ["ngModel"] }, { kind: "component", type: i4.MatCheckbox, selector: "mat-checkbox", inputs: ["disableRipple", "color", "tabIndex"], exportAs: ["matCheckbox"] }, { kind: "directive", type: i4.MatCheckboxRequiredValidator, selector: "mat-checkbox[required][formControlName],             mat-checkbox[required][formControl], mat-checkbox[required][ngModel]" }, { kind: "pipe", type: i2.AsyncPipe, name: "async" }, { kind: "pipe", type: i5.MtxToObservablePipe, name: "toObservable" }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MtxCheckboxGroup, decorators: [{
            type: Component,
            args: [{ selector: 'mtx-checkbox-group', exportAs: 'mtxCheckboxGroup', host: {
                        class: 'mtx-checkbox-group',
                    }, encapsulation: ViewEncapsulation.None, changeDetection: ChangeDetectionStrategy.OnPush, providers: [
                        {
                            provide: NG_VALUE_ACCESSOR,
                            useExisting: forwardRef((() => MtxCheckboxGroup)),
                            multi: true,
                        },
                    ], template: "<mat-checkbox class=\"mtx-checkbox-master\"\n              *ngIf=\"showSelectAll\"\n              [checked]=\"selectAll\"\n              [(indeterminate)]=\"selectAllIndeterminate\"\n              [disabled]=\"disabled\"\n              (change)=\"_updateMasterCheckboxState($event, -1)\">\n  {{selectAllLabel}}\n</mat-checkbox>\n\n<mat-checkbox class=\"mtx-checkbox-normal\"\n              *ngFor=\"let option of items; let i = index;\"\n              [(ngModel)]=\"option.checked\"\n              [ngModelOptions]=\"{standalone: true}\"\n              [aria-describedby]=\"option.ariaDescribedby\"\n              [aria-label]=\"option.ariaLabel\"\n              [aria-labelledby]=\"option.ariaLabelledby\"\n              [color]=\"option.color\"\n              [disabled]=\"option.disabled || disabled\"\n              [disableRipple]=\"option.disableRipple\"\n              [labelPosition]=\"option.labelPosition\"\n              [required]=\"option.required\"\n              (change)=\"_updateNormalCheckboxState($event, i)\">\n  {{option[bindLabel] | toObservable | async}}\n</mat-checkbox>\n" }]
        }], ctorParameters: function () { return [{ type: i0.ChangeDetectorRef }, { type: i1.FocusMonitor }, { type: i0.ElementRef }]; }, propDecorators: { _checkboxes: [{
                type: ContentChildren,
                args: [forwardRef(() => MatCheckbox), { descendants: true }]
            }], items: [{
                type: Input
            }], bindLabel: [{
                type: Input
            }], bindValue: [{
                type: Input
            }], showSelectAll: [{
                type: Input
            }], selectAllLabel: [{
                type: Input
            }], compareWith: [{
                type: Input
            }], disabled: [{
                type: Input
            }], change: [{
                type: Output
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hlY2tib3gtZ3JvdXAuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wcm9qZWN0cy9leHRlbnNpb25zL2NoZWNrYm94LWdyb3VwL2NoZWNrYm94LWdyb3VwLnRzIiwiLi4vLi4vLi4vLi4vcHJvamVjdHMvZXh0ZW5zaW9ucy9jaGVja2JveC1ncm91cC9jaGVja2JveC1ncm91cC5odG1sIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFDTCxTQUFTLEVBQ1QsdUJBQXVCLEVBQ3ZCLGlCQUFpQixFQUNqQixLQUFLLEVBQ0wsTUFBTSxFQUNOLFlBQVksRUFFWixVQUFVLEVBRVYsZUFBZSxHQUloQixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUUsaUJBQWlCLEVBQXdCLE1BQU0sZ0JBQWdCLENBQUM7QUFDekUsT0FBTyxFQUFnQixxQkFBcUIsRUFBRSxNQUFNLHVCQUF1QixDQUFDO0FBQzVFLE9BQU8sRUFBRSxXQUFXLEVBQXFCLE1BQU0sNEJBQTRCLENBQUM7Ozs7Ozs7QUFJNUUsTUFBTSxPQUFPLGVBQWU7SUFDMUIsWUFBbUIsS0FBVyxFQUFTLEtBQVc7UUFBL0IsVUFBSyxHQUFMLEtBQUssQ0FBTTtRQUFTLFVBQUssR0FBTCxLQUFLLENBQU07SUFBRyxDQUFDO0NBQ3ZEO0FBb0JELE1BQU0sT0FBTyxnQkFBZ0I7SUFJM0IsSUFDSSxLQUFLO1FBQ1AsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDO0lBQ3JCLENBQUM7SUFDRCxJQUFJLEtBQUssQ0FBQyxLQUFZO1FBQ3BCLG1CQUFtQjtRQUNuQixJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1FBQ3hELElBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFBRTtZQUMvQixPQUFPLE1BQU0sWUFBWSxNQUFNLENBQUMsQ0FB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dGVudCI6WyJpbXBvcnQge1xuICBDb21wb25lbnQsXG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBWaWV3RW5jYXBzdWxhdGlvbixcbiAgSW5wdXQsXG4gIE91dHB1dCxcbiAgRXZlbnRFbWl0dGVyLFxuICBDaGFuZ2VEZXRlY3RvclJlZixcbiAgZm9yd2FyZFJlZixcbiAgQWZ0ZXJWaWV3SW5pdCxcbiAgQ29udGVudENoaWxkcmVuLFxuICBRdWVyeUxpc3QsXG4gIEVsZW1lbnRSZWYsXG4gIE9uRGVzdHJveSxcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBOR19WQUxVRV9BQ0NFU1NPUiwgQ29udHJvbFZhbHVlQWNjZXNzb3IgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQgeyBCb29sZWFuSW5wdXQsIGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSB9IGZyb20gJ0Bhbmd1bGFyL2Nkay9jb2VyY2lvbic7XG5pbXBvcnQgeyBNYXRDaGVja2JveCwgTWF0Q2hlY2tib3hDaGFuZ2UgfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9jaGVja2JveCc7XG5pbXBvcnQgeyBGb2N1c01vbml0b3IgfSBmcm9tICdAYW5ndWxhci9jZGsvYTExeSc7XG5pbXBvcnQgeyBNdHhDaGVja2JveEdyb3VwT3B0aW9uIH0gZnJvbSAnLi9pbnRlcmZhY2VzJztcblxuZXhwb3J0IGNsYXNzIE10eENoZWNrYm94QmFzZSB7XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBsYWJlbD86IGFueSwgcHVibGljIHZhbHVlPzogYW55KSB7fVxufVxuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdtdHgtY2hlY2tib3gtZ3JvdXAnLFxuICBleHBvcnRBczogJ210eENoZWNrYm94R3JvdXAnLFxuICBob3N0OiB7XG4gICAgY2xhc3M6ICdtdHgtY2hlY2tib3gtZ3JvdXAnLFxuICB9LFxuICB0ZW1wbGF0ZVVybDogJy4vY2hlY2tib3gtZ3JvdXAuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL2NoZWNrYm94LWdyb3VwLnNjc3MnXSxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gIHByb3ZpZGVyczogW1xuICAgIHtcbiAgICAgIHByb3ZpZGU6IE5HX1ZBTFVFX0FDQ0VTU09SLFxuICAgICAgdXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gTXR4Q2hlY2tib3hHcm91cCksXG4gICAgICBtdWx0aTogdHJ1ZSxcbiAgICB9LFxuICBdLFxufSlcbmV4cG9ydCBjbGFzcyBNdHhDaGVja2JveEdyb3VwIGltcGxlbWVudHMgQWZ0ZXJWaWV3SW5pdCwgT25EZXN0cm95LCBDb250cm9sVmFsdWVBY2Nlc3NvciB7XG4gIEBDb250ZW50Q2hpbGRyZW4oZm9yd2FyZFJlZigoKSA9PiBNYXRDaGVja2JveCksIHsgZGVzY2VuZGFudHM6IHRydWUgfSlcbiAgX2NoZWNrYm94ZXMhOiBRdWVyeUxpc3Q8TWF0Q2hlY2tib3g+O1xuXG4gIEBJbnB1dCgpXG4gIGdldCBpdGVtcygpIHtcbiAgICByZXR1cm4gdGhpcy5faXRlbXM7XG4gIH1cbiAgc2V0IGl0ZW1zKHZhbHVlOiBhbnlbXSkge1xuICAgIC8vIFRPRE86IERlZXAgY2xvbmVcbiAgICB0aGlzLl9vcmlnaW5hbEl0ZW1zID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeSh2YWx1ZSkpO1xuICAgIHRoaXMuX2l0ZW1zID0gdmFsdWUubWFwKG9wdGlvbiA9PiB7XG4gICAgICByZXR1cm4gb3B0aW9uIGluc3RhbmNlb2YgT2JqZWN0ID8gb3B0aW9uIDogbmV3IE10eENoZWNrYm94QmFzZShvcHRpb24sIG9wdGlvbik7XG4gICAgfSk7XG4gIH1cbiAgcHJpdmF0ZSBfaXRlbXM6IGFueVtdID0gW107XG4gIHByaXZhdGUgX29yaWdpbmFsSXRlbXM6IGFueVtdID0gW107XG5cbiAgQElucHV0KCkgYmluZExhYmVsID0gJ2xhYmVsJztcblxuICBASW5wdXQoKSBiaW5kVmFsdWUgPSAndmFsdWUnO1xuXG4gIEBJbnB1dCgpXG4gIGdldCBzaG93U2VsZWN0QWxsKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9zaG93U2VsZWN0QWxsO1xuICB9XG4gIHNldCBzaG93U2VsZWN0QWxsKHZhbHVlOiBib29sZWFuKSB7XG4gICAgdGhpcy5fc2hvd1NlbGVjdEFsbCA9IGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSh2YWx1ZSk7XG4gIH1cbiAgcHJpdmF0ZSBfc2hvd1NlbGVjdEFsbCA9IGZhbHNlO1xuXG4gIEBJbnB1dCgpIHNlbGVjdEFsbExhYmVsID0gJ1NlbGVjdCBBbGwnO1xuXG4gIEBJbnB1dCgpXG4gIGdldCBjb21wYXJlV2l0aCgpIHtcbiAgICByZXR1cm4gdGhpcy5fY29tcGFyZVdpdGg7XG4gIH1cbiAgc2V0IGNvbXBhcmVXaXRoKGZuOiAobzE6IGFueSwgbzI6IGFueSkgPT4gYm9vbGVhbikge1xuICAgIGlmICh0eXBlb2YgZm4gIT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHRocm93IEVycm9yKCdgY29tcGFyZVdpdGhgIG11c3QgYmUgYSBmdW5jdGlvbi4nKTtcbiAgICB9XG5cbiAgICBpZiAoZm4pIHtcbiAgICAgIHRoaXMuX2NvbXBhcmVXaXRoID0gZm47XG4gICAgfVxuICB9XG4gIHByaXZhdGUgX2NvbXBhcmVXaXRoITogKG8xOiBhbnksIG8yOiBhbnkpID0+IGJvb2xlYW47XG5cbiAgQElucHV0KClcbiAgZ2V0IGRpc2FibGVkKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9kaXNhYmxlZDtcbiAgfVxuICBzZXQgZGlzYWJsZWQodmFsdWU6IGJvb2xlYW4pIHtcbiAgICB0aGlzLl9kaXNhYmxlZCA9IGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSh2YWx1ZSk7XG4gIH1cbiAgcHJpdmF0ZSBfZGlzYWJsZWQgPSBmYWxzZTtcblxuICBAT3V0cHV0KCkgY2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcjx7IG1vZGVsOiBNdHhDaGVja2JveEdyb3VwT3B0aW9uW107IGluZGV4OiBudW1iZXIgfT4oKTtcblxuICBzZWxlY3RBbGwgPSBmYWxzZTtcbiAgc2VsZWN0QWxsSW5kZXRlcm1pbmF0ZSA9IGZhbHNlO1xuXG4gIHNlbGVjdGVkSXRlbXM6IE10eENoZWNrYm94R3JvdXBPcHRpb25bXSA9IFtdO1xuXG4gIF9vbkNoYW5nZTogKHZhbHVlOiBNdHhDaGVja2JveEdyb3VwT3B0aW9uW10pID0+IHZvaWQgPSAoKSA9PiBudWxsO1xuICBfb25Ub3VjaGVkOiAoKSA9PiB2b2lkID0gKCkgPT4gbnVsbDtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIF9jaGFuZ2VEZXRlY3RvclJlZjogQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gICAgcHJpdmF0ZSBfZm9jdXNNb25pdG9yOiBGb2N1c01vbml0b3IsXG4gICAgcHJpdmF0ZSBfZWxlbWVudFJlZjogRWxlbWVudFJlZjxIVE1MRWxlbWVudD5cbiAgKSB7fVxuXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcbiAgICB0aGlzLl9mb2N1c01vbml0b3IubW9uaXRvcih0aGlzLl9lbGVtZW50UmVmLCB0cnVlKS5zdWJzY3JpYmUoZm9jdXNPcmlnaW4gPT4ge1xuICAgICAgaWYgKCFmb2N1c09yaWdpbikge1xuICAgICAgICAvLyBXaGVuIGEgZm9jdXNlZCBlbGVtZW50IGJlY29tZXMgZGlzYWJsZWQsIHRoZSBicm93c2VyICppbW1lZGlhdGVseSogZmlyZXMgYSBibHVyIGV2ZW50LlxuICAgICAgICAvLyBBbmd1bGFyIGRvZXMgbm90IGV4cGVjdCBldmVudHMgdG8gYmUgcmFpc2VkIGR1cmluZyBjaGFuZ2UgZGV0ZWN0aW9uLCBzbyBhbnkgc3RhdGUgY2hhbmdlXG4gICAgICAgIC8vIChzdWNoIGFzIGEgZm9ybSBjb250cm9sJ3MgJ25nLXRvdWNoZWQnKSB3aWxsIGNhdXNlIGEgY2hhbmdlZC1hZnRlci1jaGVja2VkIGVycm9yLlxuICAgICAgICAvLyBTZWUgaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvYW5ndWxhci9pc3N1ZXMvMTc3OTMuIFRvIHdvcmsgYXJvdW5kIHRoaXMsIHdlIGRlZmVyXG4gICAgICAgIC8vIHRlbGxpbmcgdGhlIGZvcm0gY29udHJvbCBpdCBoYXMgYmVlbiB0b3VjaGVkIHVudGlsIHRoZSBuZXh0IHRpY2suXG4gICAgICAgIFByb21pc2UucmVzb2x2ZSgpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgIHRoaXMuX29uVG91Y2hlZCgpO1xuICAgICAgICAgIHRoaXMuX2NoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMuX2ZvY3VzTW9uaXRvci5zdG9wTW9uaXRvcmluZyh0aGlzLl9lbGVtZW50UmVmKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBGaW5kcyBhbmQgc2VsZWN0cyBhbmQgb3B0aW9uIGJhc2VkIG9uIGl0cyB2YWx1ZS5cbiAgICogQHJldHVybnMgT3B0aW9uIHRoYXQgaGFzIHRoZSBjb3JyZXNwb25kaW5nIHZhbHVlLlxuICAgKi9cbiAgcHJpdmF0ZSBfc2VsZWN0VmFsdWUodmFsdWU6IE10eENoZWNrYm94R3JvdXBPcHRpb24pIHtcbiAgICBjb25zdCBjb3JyZXNwb25kaW5nT3B0aW9uID0gKHRoaXMuaXRlbXMgYXMgTXR4Q2hlY2tib3hHcm91cE9wdGlvbltdKS5maW5kKG9wdGlvbiA9PiB7XG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCBjb21wYXJlVmFsdWUgPSBvcHRpb25bdGhpcy5iaW5kVmFsdWVdID09PSB2YWx1ZTtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2NvbXBhcmVXaXRoID8gdGhpcy5fY29tcGFyZVdpdGgob3B0aW9uLCB2YWx1ZSkgOiBjb21wYXJlVmFsdWU7XG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBjb25zb2xlLndhcm4oZXJyb3IpO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBpZiAoY29ycmVzcG9uZGluZ09wdGlvbikge1xuICAgICAgY29ycmVzcG9uZGluZ09wdGlvbi5jaGVja2VkID0gdHJ1ZTtcbiAgICB9XG5cbiAgICByZXR1cm4gY29ycmVzcG9uZGluZ09wdGlvbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSBtb2RlbCB2YWx1ZS4gSW1wbGVtZW50ZWQgYXMgcGFydCBvZiBDb250cm9sVmFsdWVBY2Nlc3Nvci5cbiAgICogQHBhcmFtIHZhbHVlIE5ldyB2YWx1ZSB0byBiZSB3cml0dGVuIHRvIHRoZSBtb2RlbC5cbiAgICovXG4gIHdyaXRlVmFsdWUodmFsdWU6IGFueVtdKTogdm9pZCB7XG4gICAgaWYgKHZhbHVlKSB7XG4gICAgICBpZiAoIUFycmF5LmlzQXJyYXkodmFsdWUpKSB7XG4gICAgICAgIHRocm93IEVycm9yKCdWYWx1ZSBtdXN0IGJlIGFuIGFycmF5LicpO1xuICAgICAgfVxuXG4gICAgICB2YWx1ZS5mb3JFYWNoKChjdXJyZW50VmFsdWU6IGFueSkgPT4gdGhpcy5fc2VsZWN0VmFsdWUoY3VycmVudFZhbHVlKSk7XG4gICAgICB0aGlzLnNlbGVjdGVkSXRlbXMgPSB2YWx1ZTtcbiAgICB9XG5cbiAgICB0aGlzLl9jaGVja01hc3RlckNoZWNrYm94U3RhdGUoKTtcbiAgICB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWdpc3RlcnMgYSBjYWxsYmFjayB0byBiZSB0cmlnZ2VyZWQgd2hlbiB0aGUgbW9kZWwgdmFsdWUgY2hhbmdlcy5cbiAgICogSW1wbGVtZW50ZWQgYXMgcGFydCBvZiBDb250cm9sVmFsdWVBY2Nlc3Nvci5cbiAgICogQHBhcmFtIGZuIENhbGxiYWNrIHRvIGJlIHJlZ2lzdGVyZWQuXG4gICAqL1xuICByZWdpc3Rlck9uQ2hhbmdlKGZuOiAodmFsdWU6IE10eENoZWNrYm94R3JvdXBPcHRpb25bXSkgPT4gUmVjb3JkPHN0cmluZywgdW5rbm93bj4pOiB2b2lkIHtcbiAgICB0aGlzLl9vbkNoYW5nZSA9IGZuO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVycyBhIGNhbGxiYWNrIHRvIGJlIHRyaWdnZXJlZCB3aGVuIHRoZSBjb250cm9sIGlzIHRvdWNoZWQuXG4gICAqIEltcGxlbWVudGVkIGFzIHBhcnQgb2YgQ29udHJvbFZhbHVlQWNjZXNzb3IuXG4gICAqIEBwYXJhbSBmbiBDYWxsYmFjayB0byBiZSByZWdpc3RlcmVkLlxuICAgKi9cbiAgcmVnaXN0ZXJPblRvdWNoZWQoZm46ICgpID0+IFJlY29yZDxzdHJpbmcsIHVua25vd24+KTogdm9pZCB7XG4gICAgdGhpcy5fb25Ub3VjaGVkID0gZm47XG4gIH1cblxuICAvKipcbiAgICogU2V0cyB0aGUgZGlzYWJsZWQgc3RhdGUgb2YgdGhlIGNvbnRyb2wuIEltcGxlbWVudGVkIGFzIGEgcGFydCBvZiBDb250cm9sVmFsdWVBY2Nlc3Nvci5cbiAgICogQHBhcmFtIGlzRGlzYWJsZWQgV2hldGhlciB0aGUgY29udHJvbCBzaG91bGQgYmUgZGlzYWJsZWQuXG4gICAqL1xuICBzZXREaXNhYmxlZFN0YXRlKGlzRGlzYWJsZWQ6IGJvb2xlYW4pIHtcbiAgICB0aGlzLl9kaXNhYmxlZCA9IGlzRGlzYWJsZWQ7XG4gIH1cblxuICBwcml2YXRlIF9jaGVja01hc3RlckNoZWNrYm94U3RhdGUoKSB7XG4gICAgaWYgKFxuICAgICAgKHRoaXMuaXRlbXMgYXMgTXR4Q2hlY2tib3hHcm91cE9wdGlvbltdKVxuICAgICAgICAuZmlsdGVyKG9wdGlvbiA9PiBvcHRpb24uY2hlY2tlZCB8fCAhb3B0aW9uLmRpc2FibGVkKVxuICAgICAgICAuZXZlcnkob3B0aW9uID0+ICFvcHRpb24uY2hlY2tlZClcbiAgICApIHtcbiAgICAgIHRoaXMuc2VsZWN0QWxsID0gZmFsc2U7XG4gICAgICB0aGlzLnNlbGVjdEFsbEluZGV0ZXJtaW5hdGUgPSBmYWxzZTtcbiAgICB9IGVsc2UgaWYgKFxuICAgICAgKHRoaXMuaXRlbXMgYXMgTXR4Q2hlY2tib3hHcm91cE9wdGlvbltdKVxuICAgICAgICAuZmlsdGVyKG9wdGlvbiA9PiBvcHRpb24uY2hlY2tlZCB8fCAhb3B0aW9uLmRpc2FibGVkKVxuICAgICAgICAuZXZlcnkob3B0aW9uID0+IG9wdGlvbi5jaGVja2VkKVxuICAgICkge1xuICAgICAgdGhpcy5zZWxlY3RBbGwgPSB0cnVlO1xuICAgICAgdGhpcy5zZWxlY3RBbGxJbmRldGVybWluYXRlID0gZmFsc2U7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuc2VsZWN0QWxsSW5kZXRlcm1pbmF0ZSA9IHRydWU7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBfZ2V0U2VsZWN0ZWRJdGVtcyhpbmRleDogbnVtYmVyKSB7XG4gICAgdGhpcy5zZWxlY3RlZEl0ZW1zID0gKHRoaXMuaXRlbXMgYXMgTXR4Q2hlY2tib3hHcm91cE9wdGlvbltdKS5maWx0ZXIob3B0aW9uID0+IG9wdGlvbi5jaGVja2VkKTtcblxuICAgIGlmICh0aGlzLl9jb21wYXJlV2l0aCkge1xuICAgICAgdGhpcy5zZWxlY3RlZEl0ZW1zID0gKHRoaXMuX29yaWdpbmFsSXRlbXMgYXMgTXR4Q2hlY2tib3hHcm91cE9wdGlvbltdKS5maWx0ZXIob3B0aW9uID0+XG4gICAgICAgIHRoaXMuc2VsZWN0ZWRJdGVtcy5maW5kKHNlbGVjdGVkT3B0aW9uID0+IHRoaXMuX2NvbXBhcmVXaXRoKG9wdGlvbiwgc2VsZWN0ZWRPcHRpb24pKVxuICAgICAgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zZWxlY3RlZEl0ZW1zID0gdGhpcy5zZWxlY3RlZEl0ZW1zLm1hcChvcHRpb24gPT4gb3B0aW9uW3RoaXMuYmluZFZhbHVlXSk7XG4gICAgfVxuXG4gICAgdGhpcy5fb25DaGFuZ2UodGhpcy5zZWxlY3RlZEl0ZW1zKTtcblxuICAgIHRoaXMuY2hhbmdlLmVtaXQoeyBtb2RlbDogdGhpcy5zZWxlY3RlZEl0ZW1zLCBpbmRleCB9KTtcbiAgfVxuXG4gIC8qKiBIYW5kbGUgbm9ybWFsIGNoZWNrYm94IHRvZ2dsZSAqL1xuICBfdXBkYXRlTm9ybWFsQ2hlY2tib3hTdGF0ZShlOiBNYXRDaGVja2JveENoYW5nZSwgaW5kZXg6IG51bWJlcik6IHZvaWQge1xuICAgIHRoaXMuX2NoZWNrTWFzdGVyQ2hlY2tib3hTdGF0ZSgpO1xuICAgIHRoaXMuX2dldFNlbGVjdGVkSXRlbXMoaW5kZXgpO1xuICB9XG5cbiAgLyoqIEhhbmRsZSBtYXN0ZXIgY2hlY2tib3ggdG9nZ2xlICovXG4gIF91cGRhdGVNYXN0ZXJDaGVja2JveFN0YXRlKGU6IE1hdENoZWNrYm94Q2hhbmdlLCBpbmRleDogbnVtYmVyKTogdm9pZCB7XG4gICAgdGhpcy5zZWxlY3RBbGwgPSAhdGhpcy5zZWxlY3RBbGw7XG4gICAgdGhpcy5zZWxlY3RBbGxJbmRldGVybWluYXRlID0gZmFsc2U7XG5cbiAgICBpZiAodGhpcy5zZWxlY3RBbGwpIHtcbiAgICAgICh0aGlzLml0ZW1zIGFzIE10eENoZWNrYm94R3JvdXBPcHRpb25bXSlcbiAgICAgICAgLmZpbHRlcihvcHRpb24gPT4gb3B0aW9uLmNoZWNrZWQgfHwgIW9wdGlvbi5kaXNhYmxlZClcbiAgICAgICAgLmZvckVhY2gob3B0aW9uID0+IChvcHRpb24uY2hlY2tlZCA9IHRydWUpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgKHRoaXMuaXRlbXMgYXMgTXR4Q2hlY2tib3hHcm91cE9wdGlvbltdKVxuICAgICAgICAuZmlsdGVyKG9wdGlvbiA9PiBvcHRpb24uY2hlY2tlZCB8fCAhb3B0aW9uLmRpc2FibGVkKVxuICAgICAgICAuZm9yRWFjaChvcHRpb24gPT4gKG9wdGlvbi5jaGVja2VkID0gISFvcHRpb24uZGlzYWJsZWQpKTtcbiAgICB9XG5cbiAgICB0aGlzLl9nZXRTZWxlY3RlZEl0ZW1zKGluZGV4KTtcbiAgfVxuXG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9zaG93U2VsZWN0QWxsOiBCb29sZWFuSW5wdXQ7XG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9kaXNhYmxlZDogQm9vbGVhbklucHV0O1xufVxuIiwiPG1hdC1jaGVja2JveCBjbGFzcz1cIm10eC1jaGVja2JveC1tYXN0ZXJcIlxuICAgICAgICAgICAgICAqbmdJZj1cInNob3dTZWxlY3RBbGxcIlxuICAgICAgICAgICAgICBbY2hlY2tlZF09XCJzZWxlY3RBbGxcIlxuICAgICAgICAgICAgICBbKGluZGV0ZXJtaW5hdGUpXT1cInNlbGVjdEFsbEluZGV0ZXJtaW5hdGVcIlxuICAgICAgICAgICAgICBbZGlzYWJsZWRdPVwiZGlzYWJsZWRcIlxuICAgICAgICAgICAgICAoY2hhbmdlKT1cIl91cGRhdGVNYXN0ZXJDaGVja2JveFN0YXRlKCRldmVudCwgLTEpXCI+XG4gIHt7c2VsZWN0QWxsTGFiZWx9fVxuPC9tYXQtY2hlY2tib3g+XG5cbjxtYXQtY2hlY2tib3ggY2xhc3M9XCJtdHgtY2hlY2tib3gtbm9ybWFsXCJcbiAgICAgICAgICAgICAgKm5nRm9yPVwibGV0IG9wdGlvbiBvZiBpdGVtczsgbGV0IGkgPSBpbmRleDtcIlxuICAgICAgICAgICAgICBbKG5nTW9kZWwpXT1cIm9wdGlvbi5jaGVja2VkXCJcbiAgICAgICAgICAgICAgW25nTW9kZWxPcHRpb25zXT1cIntzdGFuZGFsb25lOiB0cnVlfVwiXG4gICAgICAgICAgICAgIFthcmlhLWRlc2NyaWJlZGJ5XT1cIm9wdGlvbi5hcmlhRGVzY3JpYmVkYnlcIlxuICAgICAgICAgICAgICBbYXJpYS1sYWJlbF09XCJvcHRpb24uYXJpYUxhYmVsXCJcbiAgICAgICAgICAgICAgW2FyaWEtbGFiZWxsZWRieV09XCJvcHRpb24uYXJpYUxhYmVsbGVkYnlcIlxuICAgICAgICAgICAgICBbY29sb3JdPVwib3B0aW9uLmNvbG9yXCJcbiAgICAgICAgICAgICAgW2Rpc2FibGVkXT1cIm9wdGlvbi5kaXNhYmxlZCB8fCBkaXNhYmxlZFwiXG4gICAgICAgICAgICAgIFtkaXNhYmxlUmlwcGxlXT1cIm9wdGlvbi5kaXNhYmxlUmlwcGxlXCJcbiAgICAgICAgICAgICAgW2xhYmVsUG9zaXRpb25dPVwib3B0aW9uLmxhYmVsUG9zaXRpb25cIlxuICAgICAgICAgICAgICBbcmVxdWlyZWRdPVwib3B0aW9uLnJlcXVpcmVkXCJcbiAgICAgICAgICAgICAgKGNoYW5nZSk9XCJfdXBkYXRlTm9ybWFsQ2hlY2tib3hTdGF0ZSgkZXZlbnQsIGkpXCI+XG4gIHt7b3B0aW9uW2JpbmRMYWJlbF0gfCB0b09ic2VydmFibGUgfCBhc3luY319XG48L21hdC1jaGVja2JveD5cbiJdfQ==