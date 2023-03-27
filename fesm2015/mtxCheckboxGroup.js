import { EventEmitter, Component, ViewEncapsulation, ChangeDetectionStrategy, forwardRef, ChangeDetectorRef, ElementRef, ContentChildren, Input, Output, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { MatCheckbox, MatCheckboxModule } from '@angular/material/checkbox';
import { MtxUtilsModule } from '@ng-matero/extensions/utils';
import { FocusMonitor } from '@angular/cdk/a11y';
import { coerceBooleanProperty } from '@angular/cdk/coercion';

class MtxCheckboxBase {
    constructor(label, value) {
        this.label = label;
        this.value = value;
    }
}
class MtxCheckboxGroupComponent {
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
MtxCheckboxGroupComponent.decorators = [
    { type: Component, args: [{
                selector: 'mtx-checkbox-group',
                exportAs: 'mtxCheckboxGroup',
                host: {
                    class: 'mtx-checkbox-group',
                },
                template: "<mat-checkbox class=\"mtx-checkbox-master\"\n              *ngIf=\"showSelectAll\"\n              [checked]=\"selectAll\"\n              [(indeterminate)]=\"selectAllIndeterminate\"\n              [disabled]=\"disabled\"\n              (change)=\"_updateMasterCheckboxState($event, -1);\">\n  {{selectAllLabel}}\n</mat-checkbox>\n\n<mat-checkbox class=\"mtx-checkbox-normal\"\n              *ngFor=\"let option of items; let i = index;\"\n              [(ngModel)]=\"option.checked\"\n              [aria-describedby]=\"option.ariaDescribedby\"\n              [aria-label]=\"option.ariaLabel\"\n              [aria-labelledby]=\"option.ariaLabelledby\"\n              [color]=\"option.color\"\n              [disabled]=\"option.disabled || disabled\"\n              [disableRipple]=\"option.disableRipple\"\n              [labelPosition]=\"option.labelPosition\"\n              [required]=\"option.required\"\n              (change)=\"_updateNormalCheckboxState($event, i)\">\n  {{option[bindLabel] | toObservable | async}}\n</mat-checkbox>\n",
                encapsulation: ViewEncapsulation.None,
                changeDetection: ChangeDetectionStrategy.OnPush,
                providers: [
                    {
                        provide: NG_VALUE_ACCESSOR,
                        useExisting: forwardRef(() => MtxCheckboxGroupComponent),
                        multi: true,
                    },
                ],
                styles: [".mtx-checkbox-group{display:block}.mtx-checkbox-group .mat-checkbox{margin-right:16px}[dir=rtl] .mtx-checkbox-group .mat-checkbox{margin-right:auto;margin-left:16px}"]
            },] }
];
/** @nocollapse */
MtxCheckboxGroupComponent.ctorParameters = () => [
    { type: ChangeDetectorRef },
    { type: FocusMonitor },
    { type: ElementRef }
];
MtxCheckboxGroupComponent.propDecorators = {
    _checkboxes: [{ type: ContentChildren, args: [forwardRef(() => MatCheckbox), { descendants: true },] }],
    items: [{ type: Input }],
    bindLabel: [{ type: Input }],
    bindValue: [{ type: Input }],
    showSelectAll: [{ type: Input }],
    selectAllLabel: [{ type: Input }],
    compareWith: [{ type: Input }],
    disabled: [{ type: Input }],
    change: [{ type: Output }]
};

class MtxCheckboxGroupModule {
}
MtxCheckboxGroupModule.decorators = [
    { type: NgModule, args: [{
                imports: [CommonModule, FormsModule, MatCheckboxModule, MtxUtilsModule],
                exports: [MtxCheckboxGroupComponent],
                declarations: [MtxCheckboxGroupComponent],
            },] }
];

/**
 * Generated bundle index. Do not edit.
 */

export { MtxCheckboxBase, MtxCheckboxGroupComponent, MtxCheckboxGroupModule };
//# sourceMappingURL=mtxCheckboxGroup.js.map
