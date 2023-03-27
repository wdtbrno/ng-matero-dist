(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/common'), require('@angular/forms'), require('@angular/material/checkbox'), require('@ng-matero/extensions/utils'), require('@angular/cdk/a11y'), require('@angular/cdk/coercion')) :
    typeof define === 'function' && define.amd ? define('@ng-matero/extensions/checkbox-group', ['exports', '@angular/core', '@angular/common', '@angular/forms', '@angular/material/checkbox', '@ng-matero/extensions/utils', '@angular/cdk/a11y', '@angular/cdk/coercion'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory((global['ng-matero'] = global['ng-matero'] || {}, global['ng-matero'].extensions = global['ng-matero'].extensions || {}, global['ng-matero'].extensions['checkbox-group'] = {}), global.ng.core, global.ng.common, global.ng.forms, global.ng.material.checkbox, global['ng-matero'].extensions.utils, global.ng.cdk.a11y, global.ng.cdk.coercion));
}(this, (function (exports, core, common, forms, checkbox, utils, a11y, coercion) { 'use strict';

    var MtxCheckboxBase = /** @class */ (function () {
        function MtxCheckboxBase(label, value) {
            this.label = label;
            this.value = value;
        }
        return MtxCheckboxBase;
    }());
    var MtxCheckboxGroupComponent = /** @class */ (function () {
        function MtxCheckboxGroupComponent(_changeDetectorRef, _focusMonitor, _elementRef) {
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
            this.change = new core.EventEmitter();
            this.selectAll = false;
            this.selectAllIndeterminate = false;
            this.selectedItems = [];
            this._onChange = function () { return null; };
            this._onTouched = function () { return null; };
        }
        Object.defineProperty(MtxCheckboxGroupComponent.prototype, "items", {
            get: function () {
                return this._items;
            },
            set: function (value) {
                // TODO: Deep clone
                this._originalItems = JSON.parse(JSON.stringify(value));
                this._items = value.map(function (option) {
                    return option instanceof Object ? option : new MtxCheckboxBase(option, option);
                });
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MtxCheckboxGroupComponent.prototype, "showSelectAll", {
            get: function () {
                return this._showSelectAll;
            },
            set: function (value) {
                this._showSelectAll = coercion.coerceBooleanProperty(value);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MtxCheckboxGroupComponent.prototype, "compareWith", {
            get: function () {
                return this._compareWith;
            },
            set: function (fn) {
                if (typeof fn !== 'function') {
                    throw Error('`compareWith` must be a function.');
                }
                if (fn) {
                    this._compareWith = fn;
                }
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MtxCheckboxGroupComponent.prototype, "disabled", {
            get: function () {
                return this._disabled;
            },
            set: function (value) {
                this._disabled = coercion.coerceBooleanProperty(value);
            },
            enumerable: false,
            configurable: true
        });
        MtxCheckboxGroupComponent.prototype.ngAfterViewInit = function () {
            var _this = this;
            this._focusMonitor.monitor(this._elementRef, true).subscribe(function (focusOrigin) {
                if (!focusOrigin) {
                    // When a focused element becomes disabled, the browser *immediately* fires a blur event.
                    // Angular does not expect events to be raised during change detection, so any state change
                    // (such as a form control's 'ng-touched') will cause a changed-after-checked error.
                    // See https://github.com/angular/angular/issues/17793. To work around this, we defer
                    // telling the form control it has been touched until the next tick.
                    Promise.resolve().then(function () {
                        _this._onTouched();
                        _this._changeDetectorRef.markForCheck();
                    });
                }
            });
        };
        MtxCheckboxGroupComponent.prototype.ngOnDestroy = function () {
            this._focusMonitor.stopMonitoring(this._elementRef);
        };
        /**
         * Finds and selects and option based on its value.
         * @returns Option that has the corresponding value.
         */
        MtxCheckboxGroupComponent.prototype._selectValue = function (value) {
            var _this = this;
            var correspondingOption = this.items.find(function (option) {
                try {
                    var compareValue = option[_this.bindValue] === value;
                    return _this._compareWith ? _this._compareWith(option, value) : compareValue;
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
        };
        /**
         * Sets the model value. Implemented as part of ControlValueAccessor.
         * @param value New value to be written to the model.
         */
        MtxCheckboxGroupComponent.prototype.writeValue = function (value) {
            var _this = this;
            if (value) {
                if (!Array.isArray(value)) {
                    throw Error('Value must be an array.');
                }
                value.forEach(function (currentValue) { return _this._selectValue(currentValue); });
                this.selectedItems = value;
            }
            this._checkMasterCheckboxState();
            this._changeDetectorRef.markForCheck();
        };
        /**
         * Registers a callback to be triggered when the model value changes.
         * Implemented as part of ControlValueAccessor.
         * @param fn Callback to be registered.
         */
        MtxCheckboxGroupComponent.prototype.registerOnChange = function (fn) {
            this._onChange = fn;
        };
        /**
         * Registers a callback to be triggered when the control is touched.
         * Implemented as part of ControlValueAccessor.
         * @param fn Callback to be registered.
         */
        MtxCheckboxGroupComponent.prototype.registerOnTouched = function (fn) {
            this._onTouched = fn;
        };
        /**
         * Sets the disabled state of the control. Implemented as a part of ControlValueAccessor.
         * @param isDisabled Whether the control should be disabled.
         */
        MtxCheckboxGroupComponent.prototype.setDisabledState = function (isDisabled) {
            this._disabled = isDisabled;
        };
        MtxCheckboxGroupComponent.prototype._checkMasterCheckboxState = function () {
            if (this.items
                .filter(function (option) { return option.checked || !option.disabled; })
                .every(function (option) { return !option.checked; })) {
                this.selectAll = false;
                this.selectAllIndeterminate = false;
            }
            else if (this.items
                .filter(function (option) { return option.checked || !option.disabled; })
                .every(function (option) { return option.checked; })) {
                this.selectAll = true;
                this.selectAllIndeterminate = false;
            }
            else {
                this.selectAllIndeterminate = true;
            }
        };
        MtxCheckboxGroupComponent.prototype._getSelectedItems = function (index) {
            var _this = this;
            this.selectedItems = this.items.filter(function (option) { return option.checked; });
            if (this._compareWith) {
                this.selectedItems = this._originalItems.filter(function (option) { return _this.selectedItems.find(function (selectedOption) { return _this._compareWith(option, selectedOption); }); });
            }
            else {
                this.selectedItems = this.selectedItems.map(function (option) { return option[_this.bindValue]; });
            }
            this._onChange(this.selectedItems);
            this.change.emit({ model: this.selectedItems, index: index });
        };
        /** Handle normal checkbox toggle */
        MtxCheckboxGroupComponent.prototype._updateNormalCheckboxState = function (e, index) {
            this._checkMasterCheckboxState();
            this._getSelectedItems(index);
        };
        /** Handle master checkbox toggle */
        MtxCheckboxGroupComponent.prototype._updateMasterCheckboxState = function (e, index) {
            this.selectAll = !this.selectAll;
            this.selectAllIndeterminate = false;
            if (this.selectAll) {
                this.items
                    .filter(function (option) { return option.checked || !option.disabled; })
                    .forEach(function (option) { return (option.checked = true); });
            }
            else {
                this.items
                    .filter(function (option) { return option.checked || !option.disabled; })
                    .forEach(function (option) { return (option.checked = !!option.disabled); });
            }
            this._getSelectedItems(index);
        };
        return MtxCheckboxGroupComponent;
    }());
    MtxCheckboxGroupComponent.decorators = [
        { type: core.Component, args: [{
                    selector: 'mtx-checkbox-group',
                    exportAs: 'mtxCheckboxGroup',
                    host: {
                        class: 'mtx-checkbox-group',
                    },
                    template: "<mat-checkbox class=\"mtx-checkbox-master\"\n              *ngIf=\"showSelectAll\"\n              [checked]=\"selectAll\"\n              [(indeterminate)]=\"selectAllIndeterminate\"\n              [disabled]=\"disabled\"\n              (change)=\"_updateMasterCheckboxState($event, -1);\">\n  {{selectAllLabel}}\n</mat-checkbox>\n\n<mat-checkbox class=\"mtx-checkbox-normal\"\n              *ngFor=\"let option of items; let i = index;\"\n              [(ngModel)]=\"option.checked\"\n              [aria-describedby]=\"option.ariaDescribedby\"\n              [aria-label]=\"option.ariaLabel\"\n              [aria-labelledby]=\"option.ariaLabelledby\"\n              [color]=\"option.color\"\n              [disabled]=\"option.disabled || disabled\"\n              [disableRipple]=\"option.disableRipple\"\n              [labelPosition]=\"option.labelPosition\"\n              [required]=\"option.required\"\n              (change)=\"_updateNormalCheckboxState($event, i)\">\n  {{option[bindLabel] | toObservable | async}}\n</mat-checkbox>\n",
                    encapsulation: core.ViewEncapsulation.None,
                    changeDetection: core.ChangeDetectionStrategy.OnPush,
                    providers: [
                        {
                            provide: forms.NG_VALUE_ACCESSOR,
                            useExisting: core.forwardRef(function () { return MtxCheckboxGroupComponent; }),
                            multi: true,
                        },
                    ],
                    styles: [".mtx-checkbox-group{display:block}.mtx-checkbox-group .mat-checkbox{margin-right:16px}[dir=rtl] .mtx-checkbox-group .mat-checkbox{margin-right:auto;margin-left:16px}"]
                },] }
    ];
    /** @nocollapse */
    MtxCheckboxGroupComponent.ctorParameters = function () { return [
        { type: core.ChangeDetectorRef },
        { type: a11y.FocusMonitor },
        { type: core.ElementRef }
    ]; };
    MtxCheckboxGroupComponent.propDecorators = {
        _checkboxes: [{ type: core.ContentChildren, args: [core.forwardRef(function () { return checkbox.MatCheckbox; }), { descendants: true },] }],
        items: [{ type: core.Input }],
        bindLabel: [{ type: core.Input }],
        bindValue: [{ type: core.Input }],
        showSelectAll: [{ type: core.Input }],
        selectAllLabel: [{ type: core.Input }],
        compareWith: [{ type: core.Input }],
        disabled: [{ type: core.Input }],
        change: [{ type: core.Output }]
    };

    var MtxCheckboxGroupModule = /** @class */ (function () {
        function MtxCheckboxGroupModule() {
        }
        return MtxCheckboxGroupModule;
    }());
    MtxCheckboxGroupModule.decorators = [
        { type: core.NgModule, args: [{
                    imports: [common.CommonModule, forms.FormsModule, checkbox.MatCheckboxModule, utils.MtxUtilsModule],
                    exports: [MtxCheckboxGroupComponent],
                    declarations: [MtxCheckboxGroupComponent],
                },] }
    ];

    /**
     * Generated bundle index. Do not edit.
     */

    exports.MtxCheckboxBase = MtxCheckboxBase;
    exports.MtxCheckboxGroupComponent = MtxCheckboxGroupComponent;
    exports.MtxCheckboxGroupModule = MtxCheckboxGroupModule;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=mtxCheckboxGroup.umd.js.map
