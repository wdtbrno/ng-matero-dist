import { Component, ChangeDetectionStrategy, ViewEncapsulation, Input, Output, EventEmitter, ChangeDetectorRef, forwardRef, ContentChildren, QueryList, ElementRef, } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { FocusMonitor } from '@angular/cdk/a11y';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { MatCheckbox } from '@angular/material/checkbox';
export class MtxCheckboxBase {
    constructor(label, value) {
        this.label = label;
        this.value = value;
    }
}
export class MtxCheckboxGroupComponent {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hlY2tib3gtZ3JvdXAuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vcHJvamVjdHMvZXh0ZW5zaW9ucy9jaGVja2JveC1ncm91cC9jaGVja2JveC1ncm91cC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUNMLFNBQVMsRUFDVCx1QkFBdUIsRUFDdkIsaUJBQWlCLEVBQ2pCLEtBQUssRUFDTCxNQUFNLEVBQ04sWUFBWSxFQUNaLGlCQUFpQixFQUNqQixVQUFVLEVBRVYsZUFBZSxFQUNmLFNBQVMsRUFDVCxVQUFVLEdBRVgsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFFLGlCQUFpQixFQUF3QixNQUFNLGdCQUFnQixDQUFDO0FBQ3pFLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQztBQUNqRCxPQUFPLEVBQWdCLHFCQUFxQixFQUFFLE1BQU0sdUJBQXVCLENBQUM7QUFDNUUsT0FBTyxFQUFFLFdBQVcsRUFBcUIsTUFBTSw0QkFBNEIsQ0FBQztBQUc1RSxNQUFNLE9BQU8sZUFBZTtJQUMxQixZQUFtQixLQUFXLEVBQVMsS0FBVztRQUEvQixVQUFLLEdBQUwsS0FBSyxDQUFNO1FBQVMsVUFBSyxHQUFMLEtBQUssQ0FBTTtJQUFHLENBQUM7Q0FDdkQ7QUFvQkQsTUFBTSxPQUFPLHlCQUF5QjtJQW1FcEMsWUFDVSxrQkFBcUMsRUFDckMsYUFBMkIsRUFDM0IsV0FBb0M7UUFGcEMsdUJBQWtCLEdBQWxCLGtCQUFrQixDQUFtQjtRQUNyQyxrQkFBYSxHQUFiLGFBQWEsQ0FBYztRQUMzQixnQkFBVyxHQUFYLFdBQVcsQ0FBeUI7UUF2RHRDLFdBQU0sR0FBVSxFQUFFLENBQUM7UUFDbkIsbUJBQWMsR0FBVSxFQUFFLENBQUM7UUFFMUIsY0FBUyxHQUFHLE9BQU8sQ0FBQztRQUVwQixjQUFTLEdBQUcsT0FBTyxDQUFDO1FBU3JCLG1CQUFjLEdBQUcsS0FB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TUFBTSxDQUFDLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUM7aUJBQ3BELE9BQU8sQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7U0FDNUQ7UUFFRCxJQUFJLENBQUMsaUJBQWlCLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDaEMsQ0FBQzs7O1lBM09GLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsb0JBQW9CO2dCQUM5QixRQUFRLEVBQUUsa0JBQWtCO2dCQUM1QixJQUFJLEVBQUU7b0JBQ0osS0FBSyxFQUFFLG9CQUFvQjtpQkFDNUI7Z0JBQ0QsOGhDQUE4QztnQkFFOUMsYUFBYSxFQUFFLGlCQUFpQixDQUFDLElBQUk7Z0JBQ3JDLGVBQWUsRUFBRSx1QkFBdUIsQ0FBQyxNQUFNO2dCQUMvQyxTQUFTLEVBQUU7b0JBQ1Q7d0JBQ0UsT0FBTyxFQUFFLGlCQUFpQjt3QkFDMUIsV0FBVyxFQUFFLFVBQVUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyx5QkFBeUIsQ0FBQzt3QkFDeEQsS0FBSyxFQUFFLElBQUk7cUJBQ1o7aUJBQ0Y7O2FBQ0Y7Ozs7WUFuQ0MsaUJBQWlCO1lBU1YsWUFBWTtZQUpuQixVQUFVOzs7MEJBZ0NULGVBQWUsU0FBQyxVQUFVLENBQUMsR0FBRyxFQUFFLENBQUMsV0FBVyxDQUFDLEVBQUUsRUFBRSxXQUFXLEVBQUUsSUFBSSxFQUFFO29CQUdwRSxLQUFLO3dCQWNMLEtBQUs7d0JBRUwsS0FBSzs0QkFFTCxLQUFLOzZCQVNMLEtBQUs7MEJBRUwsS0FBSzt1QkFlTCxLQUFLO3FCQVNMLE1BQU0iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBDb21wb25lbnQsXG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBWaWV3RW5jYXBzdWxhdGlvbixcbiAgSW5wdXQsXG4gIE91dHB1dCxcbiAgRXZlbnRFbWl0dGVyLFxuICBDaGFuZ2VEZXRlY3RvclJlZixcbiAgZm9yd2FyZFJlZixcbiAgQWZ0ZXJWaWV3SW5pdCxcbiAgQ29udGVudENoaWxkcmVuLFxuICBRdWVyeUxpc3QsXG4gIEVsZW1lbnRSZWYsXG4gIE9uRGVzdHJveSxcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBOR19WQUxVRV9BQ0NFU1NPUiwgQ29udHJvbFZhbHVlQWNjZXNzb3IgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQgeyBGb2N1c01vbml0b3IgfSBmcm9tICdAYW5ndWxhci9jZGsvYTExeSc7XG5pbXBvcnQgeyBCb29sZWFuSW5wdXQsIGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSB9IGZyb20gJ0Bhbmd1bGFyL2Nkay9jb2VyY2lvbic7XG5pbXBvcnQgeyBNYXRDaGVja2JveCwgTWF0Q2hlY2tib3hDaGFuZ2UgfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9jaGVja2JveCc7XG5pbXBvcnQgeyBNdHhDaGVja2JveEdyb3VwT3B0aW9uIH0gZnJvbSAnLi9jaGVja2JveC1ncm91cC5pbnRlcmZhY2UnO1xuXG5leHBvcnQgY2xhc3MgTXR4Q2hlY2tib3hCYXNlIHtcbiAgY29uc3RydWN0b3IocHVibGljIGxhYmVsPzogYW55LCBwdWJsaWMgdmFsdWU/OiBhbnkpIHt9XG59XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ210eC1jaGVja2JveC1ncm91cCcsXG4gIGV4cG9ydEFzOiAnbXR4Q2hlY2tib3hHcm91cCcsXG4gIGhvc3Q6IHtcbiAgICBjbGFzczogJ210eC1jaGVja2JveC1ncm91cCcsXG4gIH0sXG4gIHRlbXBsYXRlVXJsOiAnLi9jaGVja2JveC1ncm91cC5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL2NoZWNrYm94LWdyb3VwLmNvbXBvbmVudC5zY3NzJ10sXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICBwcm92aWRlcnM6IFtcbiAgICB7XG4gICAgICBwcm92aWRlOiBOR19WQUxVRV9BQ0NFU1NPUixcbiAgICAgIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IE10eENoZWNrYm94R3JvdXBDb21wb25lbnQpLFxuICAgICAgbXVsdGk6IHRydWUsXG4gICAgfSxcbiAgXSxcbn0pXG5leHBvcnQgY2xhc3MgTXR4Q2hlY2tib3hHcm91cENvbXBvbmVudCBpbXBsZW1lbnRzIEFmdGVyVmlld0luaXQsIE9uRGVzdHJveSwgQ29udHJvbFZhbHVlQWNjZXNzb3Ige1xuICBAQ29udGVudENoaWxkcmVuKGZvcndhcmRSZWYoKCkgPT4gTWF0Q2hlY2tib3gpLCB7IGRlc2NlbmRhbnRzOiB0cnVlIH0pXG4gIF9jaGVja2JveGVzOiBRdWVyeUxpc3Q8TWF0Q2hlY2tib3g+O1xuXG4gIEBJbnB1dCgpXG4gIGdldCBpdGVtcygpIHtcbiAgICByZXR1cm4gdGhpcy5faXRlbXM7XG4gIH1cbiAgc2V0IGl0ZW1zKHZhbHVlOiBhbnlbXSkge1xuICAgIC8vIFRPRE86IERlZXAgY2xvbmVcbiAgICB0aGlzLl9vcmlnaW5hbEl0ZW1zID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeSh2YWx1ZSkpO1xuICAgIHRoaXMuX2l0ZW1zID0gdmFsdWUubWFwKG9wdGlvbiA9PiB7XG4gICAgICByZXR1cm4gb3B0aW9uIGluc3RhbmNlb2YgT2JqZWN0ID8gb3B0aW9uIDogbmV3IE10eENoZWNrYm94QmFzZShvcHRpb24sIG9wdGlvbik7XG4gICAgfSk7XG4gIH1cbiAgcHJpdmF0ZSBfaXRlbXM6IGFueVtdID0gW107XG4gIHByaXZhdGUgX29yaWdpbmFsSXRlbXM6IGFueVtdID0gW107XG5cbiAgQElucHV0KCkgYmluZExhYmVsID0gJ2xhYmVsJztcblxuICBASW5wdXQoKSBiaW5kVmFsdWUgPSAndmFsdWUnO1xuXG4gIEBJbnB1dCgpXG4gIGdldCBzaG93U2VsZWN0QWxsKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9zaG93U2VsZWN0QWxsO1xuICB9XG4gIHNldCBzaG93U2VsZWN0QWxsKHZhbHVlOiBib29sZWFuKSB7XG4gICAgdGhpcy5fc2hvd1NlbGVjdEFsbCA9IGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSh2YWx1ZSk7XG4gIH1cbiAgcHJpdmF0ZSBfc2hvd1NlbGVjdEFsbCA9IGZhbHNlO1xuXG4gIEBJbnB1dCgpIHNlbGVjdEFsbExhYmVsID0gJ1NlbGVjdCBBbGwnO1xuXG4gIEBJbnB1dCgpXG4gIGdldCBjb21wYXJlV2l0aCgpIHtcbiAgICByZXR1cm4gdGhpcy5fY29tcGFyZVdpdGg7XG4gIH1cbiAgc2V0IGNvbXBhcmVXaXRoKGZuOiAobzE6IGFueSwgbzI6IGFueSkgPT4gYm9vbGVhbikge1xuICAgIGlmICh0eXBlb2YgZm4gIT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHRocm93IEVycm9yKCdgY29tcGFyZVdpdGhgIG11c3QgYmUgYSBmdW5jdGlvbi4nKTtcbiAgICB9XG5cbiAgICBpZiAoZm4pIHtcbiAgICAgIHRoaXMuX2NvbXBhcmVXaXRoID0gZm47XG4gICAgfVxuICB9XG4gIHByaXZhdGUgX2NvbXBhcmVXaXRoOiAobzE6IGFueSwgbzI6IGFueSkgPT4gYm9vbGVhbjtcblxuICBASW5wdXQoKVxuICBnZXQgZGlzYWJsZWQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX2Rpc2FibGVkO1xuICB9XG4gIHNldCBkaXNhYmxlZCh2YWx1ZTogYm9vbGVhbikge1xuICAgIHRoaXMuX2Rpc2FibGVkID0gY29lcmNlQm9vbGVhblByb3BlcnR5KHZhbHVlKTtcbiAgfVxuICBwcml2YXRlIF9kaXNhYmxlZCA9IGZhbHNlO1xuXG4gIEBPdXRwdXQoKSBjaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyPHsgbW9kZWw6IE10eENoZWNrYm94R3JvdXBPcHRpb25bXTsgaW5kZXg6IG51bWJlciB9PigpO1xuXG4gIHNlbGVjdEFsbCA9IGZhbHNlO1xuICBzZWxlY3RBbGxJbmRldGVybWluYXRlID0gZmFsc2U7XG5cbiAgc2VsZWN0ZWRJdGVtczogTXR4Q2hlY2tib3hHcm91cE9wdGlvbltdID0gW107XG5cbiAgX29uQ2hhbmdlOiAodmFsdWU6IE10eENoZWNrYm94R3JvdXBPcHRpb25bXSkgPT4gdm9pZCA9ICgpID0+IG51bGw7XG4gIF9vblRvdWNoZWQ6ICgpID0+IHZvaWQgPSAoKSA9PiBudWxsO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgX2NoYW5nZURldGVjdG9yUmVmOiBDaGFuZ2VEZXRlY3RvclJlZixcbiAgICBwcml2YXRlIF9mb2N1c01vbml0b3I6IEZvY3VzTW9uaXRvcixcbiAgICBwcml2YXRlIF9lbGVtZW50UmVmOiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PlxuICApIHt9XG5cbiAgbmdBZnRlclZpZXdJbml0KCkge1xuICAgIHRoaXMuX2ZvY3VzTW9uaXRvci5tb25pdG9yKHRoaXMuX2VsZW1lbnRSZWYsIHRydWUpLnN1YnNjcmliZShmb2N1c09yaWdpbiA9PiB7XG4gICAgICBpZiAoIWZvY3VzT3JpZ2luKSB7XG4gICAgICAgIC8vIFdoZW4gYSBmb2N1c2VkIGVsZW1lbnQgYmVjb21lcyBkaXNhYmxlZCwgdGhlIGJyb3dzZXIgKmltbWVkaWF0ZWx5KiBmaXJlcyBhIGJsdXIgZXZlbnQuXG4gICAgICAgIC8vIEFuZ3VsYXIgZG9lcyBub3QgZXhwZWN0IGV2ZW50cyB0byBiZSByYWlzZWQgZHVyaW5nIGNoYW5nZSBkZXRlY3Rpb24sIHNvIGFueSBzdGF0ZSBjaGFuZ2VcbiAgICAgICAgLy8gKHN1Y2ggYXMgYSBmb3JtIGNvbnRyb2wncyAnbmctdG91Y2hlZCcpIHdpbGwgY2F1c2UgYSBjaGFuZ2VkLWFmdGVyLWNoZWNrZWQgZXJyb3IuXG4gICAgICAgIC8vIFNlZSBodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9hbmd1bGFyL2lzc3Vlcy8xNzc5My4gVG8gd29yayBhcm91bmQgdGhpcywgd2UgZGVmZXJcbiAgICAgICAgLy8gdGVsbGluZyB0aGUgZm9ybSBjb250cm9sIGl0IGhhcyBiZWVuIHRvdWNoZWQgdW50aWwgdGhlIG5leHQgdGljay5cbiAgICAgICAgUHJvbWlzZS5yZXNvbHZlKCkudGhlbigoKSA9PiB7XG4gICAgICAgICAgdGhpcy5fb25Ub3VjaGVkKCk7XG4gICAgICAgICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgdGhpcy5fZm9jdXNNb25pdG9yLnN0b3BNb25pdG9yaW5nKHRoaXMuX2VsZW1lbnRSZWYpO1xuICB9XG5cbiAgLyoqXG4gICAqIEZpbmRzIGFuZCBzZWxlY3RzIGFuZCBvcHRpb24gYmFzZWQgb24gaXRzIHZhbHVlLlxuICAgKiBAcmV0dXJucyBPcHRpb24gdGhhdCBoYXMgdGhlIGNvcnJlc3BvbmRpbmcgdmFsdWUuXG4gICAqL1xuICBwcml2YXRlIF9zZWxlY3RWYWx1ZSh2YWx1ZTogTXR4Q2hlY2tib3hHcm91cE9wdGlvbikge1xuICAgIGNvbnN0IGNvcnJlc3BvbmRpbmdPcHRpb24gPSAodGhpcy5pdGVtcyBhcyBNdHhDaGVja2JveEdyb3VwT3B0aW9uW10pLmZpbmQob3B0aW9uID0+IHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IGNvbXBhcmVWYWx1ZSA9IG9wdGlvblt0aGlzLmJpbmRWYWx1ZV0gPT09IHZhbHVlO1xuICAgICAgICByZXR1cm4gdGhpcy5fY29tcGFyZVdpdGggPyB0aGlzLl9jb21wYXJlV2l0aChvcHRpb24sIHZhbHVlKSA6IGNvbXBhcmVWYWx1ZTtcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIGNvbnNvbGUud2FybihlcnJvcik7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGlmIChjb3JyZXNwb25kaW5nT3B0aW9uKSB7XG4gICAgICBjb3JyZXNwb25kaW5nT3B0aW9uLmNoZWNrZWQgPSB0cnVlO1xuICAgIH1cblxuICAgIHJldHVybiBjb3JyZXNwb25kaW5nT3B0aW9uO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIG1vZGVsIHZhbHVlLiBJbXBsZW1lbnRlZCBhcyBwYXJ0IG9mIENvbnRyb2xWYWx1ZUFjY2Vzc29yLlxuICAgKiBAcGFyYW0gdmFsdWUgTmV3IHZhbHVlIHRvIGJlIHdyaXR0ZW4gdG8gdGhlIG1vZGVsLlxuICAgKi9cbiAgd3JpdGVWYWx1ZSh2YWx1ZTogYW55W10pOiB2b2lkIHtcbiAgICBpZiAodmFsdWUpIHtcbiAgICAgIGlmICghQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHtcbiAgICAgICAgdGhyb3cgRXJyb3IoJ1ZhbHVlIG11c3QgYmUgYW4gYXJyYXkuJyk7XG4gICAgICB9XG5cbiAgICAgIHZhbHVlLmZvckVhY2goKGN1cnJlbnRWYWx1ZTogYW55KSA9PiB0aGlzLl9zZWxlY3RWYWx1ZShjdXJyZW50VmFsdWUpKTtcbiAgICAgIHRoaXMuc2VsZWN0ZWRJdGVtcyA9IHZhbHVlO1xuICAgIH1cblxuICAgIHRoaXMuX2NoZWNrTWFzdGVyQ2hlY2tib3hTdGF0ZSgpO1xuICAgIHRoaXMuX2NoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVycyBhIGNhbGxiYWNrIHRvIGJlIHRyaWdnZXJlZCB3aGVuIHRoZSBtb2RlbCB2YWx1ZSBjaGFuZ2VzLlxuICAgKiBJbXBsZW1lbnRlZCBhcyBwYXJ0IG9mIENvbnRyb2xWYWx1ZUFjY2Vzc29yLlxuICAgKiBAcGFyYW0gZm4gQ2FsbGJhY2sgdG8gYmUgcmVnaXN0ZXJlZC5cbiAgICovXG4gIHJlZ2lzdGVyT25DaGFuZ2UoZm46ICh2YWx1ZTogTXR4Q2hlY2tib3hHcm91cE9wdGlvbltdKSA9PiB7fSk6IHZvaWQge1xuICAgIHRoaXMuX29uQ2hhbmdlID0gZm47XG4gIH1cblxuICAvKipcbiAgICogUmVnaXN0ZXJzIGEgY2FsbGJhY2sgdG8gYmUgdHJpZ2dlcmVkIHdoZW4gdGhlIGNvbnRyb2wgaXMgdG91Y2hlZC5cbiAgICogSW1wbGVtZW50ZWQgYXMgcGFydCBvZiBDb250cm9sVmFsdWVBY2Nlc3Nvci5cbiAgICogQHBhcmFtIGZuIENhbGxiYWNrIHRvIGJlIHJlZ2lzdGVyZWQuXG4gICAqL1xuICByZWdpc3Rlck9uVG91Y2hlZChmbjogKCkgPT4ge30pOiB2b2lkIHtcbiAgICB0aGlzLl9vblRvdWNoZWQgPSBmbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSBkaXNhYmxlZCBzdGF0ZSBvZiB0aGUgY29udHJvbC4gSW1wbGVtZW50ZWQgYXMgYSBwYXJ0IG9mIENvbnRyb2xWYWx1ZUFjY2Vzc29yLlxuICAgKiBAcGFyYW0gaXNEaXNhYmxlZCBXaGV0aGVyIHRoZSBjb250cm9sIHNob3VsZCBiZSBkaXNhYmxlZC5cbiAgICovXG4gIHNldERpc2FibGVkU3RhdGUoaXNEaXNhYmxlZDogYm9vbGVhbikge1xuICAgIHRoaXMuX2Rpc2FibGVkID0gaXNEaXNhYmxlZDtcbiAgfVxuXG4gIHByaXZhdGUgX2NoZWNrTWFzdGVyQ2hlY2tib3hTdGF0ZSgpIHtcbiAgICBpZiAoXG4gICAgICAodGhpcy5pdGVtcyBhcyBNdHhDaGVja2JveEdyb3VwT3B0aW9uW10pXG4gICAgICAgIC5maWx0ZXIob3B0aW9uID0+IG9wdGlvbi5jaGVja2VkIHx8ICFvcHRpb24uZGlzYWJsZWQpXG4gICAgICAgIC5ldmVyeShvcHRpb24gPT4gIW9wdGlvbi5jaGVja2VkKVxuICAgICkge1xuICAgICAgdGhpcy5zZWxlY3RBbGwgPSBmYWxzZTtcbiAgICAgIHRoaXMuc2VsZWN0QWxsSW5kZXRlcm1pbmF0ZSA9IGZhbHNlO1xuICAgIH0gZWxzZSBpZiAoXG4gICAgICAodGhpcy5pdGVtcyBhcyBNdHhDaGVja2JveEdyb3VwT3B0aW9uW10pXG4gICAgICAgIC5maWx0ZXIob3B0aW9uID0+IG9wdGlvbi5jaGVja2VkIHx8ICFvcHRpb24uZGlzYWJsZWQpXG4gICAgICAgIC5ldmVyeShvcHRpb24gPT4gb3B0aW9uLmNoZWNrZWQpXG4gICAgKSB7XG4gICAgICB0aGlzLnNlbGVjdEFsbCA9IHRydWU7XG4gICAgICB0aGlzLnNlbGVjdEFsbEluZGV0ZXJtaW5hdGUgPSBmYWxzZTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zZWxlY3RBbGxJbmRldGVybWluYXRlID0gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIF9nZXRTZWxlY3RlZEl0ZW1zKGluZGV4OiBudW1iZXIpIHtcbiAgICB0aGlzLnNlbGVjdGVkSXRlbXMgPSAodGhpcy5pdGVtcyBhcyBNdHhDaGVja2JveEdyb3VwT3B0aW9uW10pLmZpbHRlcihvcHRpb24gPT4gb3B0aW9uLmNoZWNrZWQpO1xuXG4gICAgaWYgKHRoaXMuX2NvbXBhcmVXaXRoKSB7XG4gICAgICB0aGlzLnNlbGVjdGVkSXRlbXMgPSAodGhpcy5fb3JpZ2luYWxJdGVtcyBhcyBNdHhDaGVja2JveEdyb3VwT3B0aW9uW10pLmZpbHRlcihvcHRpb24gPT5cbiAgICAgICAgdGhpcy5zZWxlY3RlZEl0ZW1zLmZpbmQoc2VsZWN0ZWRPcHRpb24gPT4gdGhpcy5fY29tcGFyZVdpdGgob3B0aW9uLCBzZWxlY3RlZE9wdGlvbikpXG4gICAgICApO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnNlbGVjdGVkSXRlbXMgPSB0aGlzLnNlbGVjdGVkSXRlbXMubWFwKG9wdGlvbiA9PiBvcHRpb25bdGhpcy5iaW5kVmFsdWVdKTtcbiAgICB9XG5cbiAgICB0aGlzLl9vbkNoYW5nZSh0aGlzLnNlbGVjdGVkSXRlbXMpO1xuXG4gICAgdGhpcy5jaGFuZ2UuZW1pdCh7IG1vZGVsOiB0aGlzLnNlbGVjdGVkSXRlbXMsIGluZGV4IH0pO1xuICB9XG5cbiAgLyoqIEhhbmRsZSBub3JtYWwgY2hlY2tib3ggdG9nZ2xlICovXG4gIF91cGRhdGVOb3JtYWxDaGVja2JveFN0YXRlKGU6IE1hdENoZWNrYm94Q2hhbmdlLCBpbmRleDogbnVtYmVyKTogdm9pZCB7XG4gICAgdGhpcy5fY2hlY2tNYXN0ZXJDaGVja2JveFN0YXRlKCk7XG4gICAgdGhpcy5fZ2V0U2VsZWN0ZWRJdGVtcyhpbmRleCk7XG4gIH1cblxuICAvKiogSGFuZGxlIG1hc3RlciBjaGVja2JveCB0b2dnbGUgKi9cbiAgX3VwZGF0ZU1hc3RlckNoZWNrYm94U3RhdGUoZTogTWF0Q2hlY2tib3hDaGFuZ2UsIGluZGV4OiBudW1iZXIpOiB2b2lkIHtcbiAgICB0aGlzLnNlbGVjdEFsbCA9ICF0aGlzLnNlbGVjdEFsbDtcbiAgICB0aGlzLnNlbGVjdEFsbEluZGV0ZXJtaW5hdGUgPSBmYWxzZTtcblxuICAgIGlmICh0aGlzLnNlbGVjdEFsbCkge1xuICAgICAgKHRoaXMuaXRlbXMgYXMgTXR4Q2hlY2tib3hHcm91cE9wdGlvbltdKVxuICAgICAgICAuZmlsdGVyKG9wdGlvbiA9PiBvcHRpb24uY2hlY2tlZCB8fCAhb3B0aW9uLmRpc2FibGVkKVxuICAgICAgICAuZm9yRWFjaChvcHRpb24gPT4gKG9wdGlvbi5jaGVja2VkID0gdHJ1ZSkpO1xuICAgIH0gZWxzZSB7XG4gICAgICAodGhpcy5pdGVtcyBhcyBNdHhDaGVja2JveEdyb3VwT3B0aW9uW10pXG4gICAgICAgIC5maWx0ZXIob3B0aW9uID0+IG9wdGlvbi5jaGVja2VkIHx8ICFvcHRpb24uZGlzYWJsZWQpXG4gICAgICAgIC5mb3JFYWNoKG9wdGlvbiA9PiAob3B0aW9uLmNoZWNrZWQgPSAhIW9wdGlvbi5kaXNhYmxlZCkpO1xuICAgIH1cblxuICAgIHRoaXMuX2dldFNlbGVjdGVkSXRlbXMoaW5kZXgpO1xuICB9XG5cbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX3Nob3dTZWxlY3RBbGw6IEJvb2xlYW5JbnB1dDtcbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX2Rpc2FibGVkOiBCb29sZWFuSW5wdXQ7XG59XG4iXX0=