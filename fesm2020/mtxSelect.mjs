import * as i0 from '@angular/core';
import { Component, ChangeDetectionStrategy, Input, Directive, EventEmitter, TemplateRef, ViewEncapsulation, Optional, Self, Inject, ViewChild, ContentChild, ContentChildren, Output, NgModule } from '@angular/core';
import * as i4 from '@angular/common';
import { CommonModule } from '@angular/common';
import * as i3 from '@angular/forms';
import { Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import * as i5 from '@ng-select/ng-select';
import { NgSelectModule } from '@ng-select/ng-select';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import * as i2 from '@angular/material/core';
import { mixinDisabled, mixinErrorState } from '@angular/material/core';
import * as i7 from '@angular/material/form-field';
import { MAT_FORM_FIELD, MatFormFieldControl } from '@angular/material/form-field';
import { Subject, merge } from 'rxjs';
import { takeUntil, startWith } from 'rxjs/operators';
import * as i1 from '@angular/cdk/a11y';

class MtxOption {
    get disabled() {
        return this._disabled;
    }
    set disabled(value) {
        this._disabled = coerceBooleanProperty(value);
    }
    get label() {
        return (this.elementRef.nativeElement.textContent || '').trim();
    }
    constructor(elementRef) {
        this.elementRef = elementRef;
        this._disabled = false;
        this.stateChange$ = new Subject();
    }
    ngOnChanges(changes) {
        if (changes.disabled) {
            this.stateChange$.next({
                value: this.value,
                disabled: this._disabled,
            });
        }
    }
    ngAfterViewChecked() {
        if (this.label !== this._previousLabel) {
            this._previousLabel = this.label;
            this.stateChange$.next({
                value: this.value,
                disabled: this._disabled,
                label: this.elementRef.nativeElement.innerHTML,
            });
        }
    }
    ngOnDestroy() {
        this.stateChange$.complete();
    }
}
/** @nocollapse */ MtxOption.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MtxOption, deps: [{ token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Component });
/** @nocollapse */ MtxOption.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.1", type: MtxOption, selector: "mtx-option", inputs: { value: "value", disabled: "disabled" }, exportAs: ["mtxOption"], usesOnChanges: true, ngImport: i0, template: `<ng-content></ng-content>`, isInline: true, changeDetection: i0.ChangeDetectionStrategy.OnPush });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MtxOption, decorators: [{
            type: Component,
            args: [{
                    selector: 'mtx-option',
                    exportAs: 'mtxOption',
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    template: `<ng-content></ng-content>`,
                }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }]; }, propDecorators: { value: [{
                type: Input
            }], disabled: [{
                type: Input
            }] } });

class MtxSelectOptionTemplate {
    constructor(template) {
        this.template = template;
    }
}
/** @nocollapse */ MtxSelectOptionTemplate.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MtxSelectOptionTemplate, deps: [{ token: i0.TemplateRef }], target: i0.ɵɵFactoryTarget.Directive });
/** @nocollapse */ MtxSelectOptionTemplate.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.2.1", type: MtxSelectOptionTemplate, selector: "[ng-option-tmp]", ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MtxSelectOptionTemplate, decorators: [{
            type: Directive,
            args: [{ selector: '[ng-option-tmp]' }]
        }], ctorParameters: function () { return [{ type: i0.TemplateRef }]; } });
class MtxSelectOptgroupTemplate {
    constructor(template) {
        this.template = template;
    }
}
/** @nocollapse */ MtxSelectOptgroupTemplate.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MtxSelectOptgroupTemplate, deps: [{ token: i0.TemplateRef }], target: i0.ɵɵFactoryTarget.Directive });
/** @nocollapse */ MtxSelectOptgroupTemplate.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.2.1", type: MtxSelectOptgroupTemplate, selector: "[ng-optgroup-tmp]", ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MtxSelectOptgroupTemplate, decorators: [{
            type: Directive,
            args: [{ selector: '[ng-optgroup-tmp]' }]
        }], ctorParameters: function () { return [{ type: i0.TemplateRef }]; } });
class MtxSelectLabelTemplate {
    constructor(template) {
        this.template = template;
    }
}
/** @nocollapse */ MtxSelectLabelTemplate.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MtxSelectLabelTemplate, deps: [{ token: i0.TemplateRef }], target: i0.ɵɵFactoryTarget.Directive });
/** @nocollapse */ MtxSelectLabelTemplate.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.2.1", type: MtxSelectLabelTemplate, selector: "[ng-label-tmp]", ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MtxSelectLabelTemplate, decorators: [{
            type: Directive,
            args: [{ selector: '[ng-label-tmp]' }]
        }], ctorParameters: function () { return [{ type: i0.TemplateRef }]; } });
class MtxSelectMultiLabelTemplate {
    constructor(template) {
        this.template = template;
    }
}
/** @nocollapse */ MtxSelectMultiLabelTemplate.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MtxSelectMultiLabelTemplate, deps: [{ token: i0.TemplateRef }], target: i0.ɵɵFactoryTarget.Directive });
/** @nocollapse */ MtxSelectMultiLabelTemplate.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.2.1", type: MtxSelectMultiLabelTemplate, selector: "[ng-multi-label-tmp]", ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MtxSelectMultiLabelTemplate, decorators: [{
            type: Directive,
            args: [{ selector: '[ng-multi-label-tmp]' }]
        }], ctorParameters: function () { return [{ type: i0.TemplateRef }]; } });
class MtxSelectHeaderTemplate {
    constructor(template) {
        this.template = template;
    }
}
/** @nocollapse */ MtxSelectHeaderTemplate.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MtxSelectHeaderTemplate, deps: [{ token: i0.TemplateRef }], target: i0.ɵɵFactoryTarget.Directive });
/** @nocollapse */ MtxSelectHeaderTemplate.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.2.1", type: MtxSelectHeaderTemplate, selector: "[ng-header-tmp]", ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MtxSelectHeaderTemplate, decorators: [{
            type: Directive,
            args: [{ selector: '[ng-header-tmp]' }]
        }], ctorParameters: function () { return [{ type: i0.TemplateRef }]; } });
class MtxSelectFooterTemplate {
    constructor(template) {
        this.template = template;
    }
}
/** @nocollapse */ MtxSelectFooterTemplate.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MtxSelectFooterTemplate, deps: [{ token: i0.TemplateRef }], target: i0.ɵɵFactoryTarget.Directive });
/** @nocollapse */ MtxSelectFooterTemplate.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.2.1", type: MtxSelectFooterTemplate, selector: "[ng-footer-tmp]", ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MtxSelectFooterTemplate, decorators: [{
            type: Directive,
            args: [{ selector: '[ng-footer-tmp]' }]
        }], ctorParameters: function () { return [{ type: i0.TemplateRef }]; } });
class MtxSelectNotFoundTemplate {
    constructor(template) {
        this.template = template;
    }
}
/** @nocollapse */ MtxSelectNotFoundTemplate.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MtxSelectNotFoundTemplate, deps: [{ token: i0.TemplateRef }], target: i0.ɵɵFactoryTarget.Directive });
/** @nocollapse */ MtxSelectNotFoundTemplate.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.2.1", type: MtxSelectNotFoundTemplate, selector: "[ng-notfound-tmp]", ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MtxSelectNotFoundTemplate, decorators: [{
            type: Directive,
            args: [{ selector: '[ng-notfound-tmp]' }]
        }], ctorParameters: function () { return [{ type: i0.TemplateRef }]; } });
class MtxSelectTypeToSearchTemplate {
    constructor(template) {
        this.template = template;
    }
}
/** @nocollapse */ MtxSelectTypeToSearchTemplate.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MtxSelectTypeToSearchTemplate, deps: [{ token: i0.TemplateRef }], target: i0.ɵɵFactoryTarget.Directive });
/** @nocollapse */ MtxSelectTypeToSearchTemplate.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.2.1", type: MtxSelectTypeToSearchTemplate, selector: "[ng-typetosearch-tmp]", ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MtxSelectTypeToSearchTemplate, decorators: [{
            type: Directive,
            args: [{ selector: '[ng-typetosearch-tmp]' }]
        }], ctorParameters: function () { return [{ type: i0.TemplateRef }]; } });
class MtxSelectLoadingTextTemplate {
    constructor(template) {
        this.template = template;
    }
}
/** @nocollapse */ MtxSelectLoadingTextTemplate.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MtxSelectLoadingTextTemplate, deps: [{ token: i0.TemplateRef }], target: i0.ɵɵFactoryTarget.Directive });
/** @nocollapse */ MtxSelectLoadingTextTemplate.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.2.1", type: MtxSelectLoadingTextTemplate, selector: "[ng-loadingtext-tmp]", ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MtxSelectLoadingTextTemplate, decorators: [{
            type: Directive,
            args: [{ selector: '[ng-loadingtext-tmp]' }]
        }], ctorParameters: function () { return [{ type: i0.TemplateRef }]; } });
class MtxSelectTagTemplate {
    constructor(template) {
        this.template = template;
    }
}
/** @nocollapse */ MtxSelectTagTemplate.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MtxSelectTagTemplate, deps: [{ token: i0.TemplateRef }], target: i0.ɵɵFactoryTarget.Directive });
/** @nocollapse */ MtxSelectTagTemplate.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.2.1", type: MtxSelectTagTemplate, selector: "[ng-tag-tmp]", ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MtxSelectTagTemplate, decorators: [{
            type: Directive,
            args: [{ selector: '[ng-tag-tmp]' }]
        }], ctorParameters: function () { return [{ type: i0.TemplateRef }]; } });
class MtxSelectLoadingSpinnerTemplate {
    constructor(template) {
        this.template = template;
    }
}
/** @nocollapse */ MtxSelectLoadingSpinnerTemplate.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MtxSelectLoadingSpinnerTemplate, deps: [{ token: i0.TemplateRef }], target: i0.ɵɵFactoryTarget.Directive });
/** @nocollapse */ MtxSelectLoadingSpinnerTemplate.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.2.1", type: MtxSelectLoadingSpinnerTemplate, selector: "[ng-loadingspinner-tmp]", ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MtxSelectLoadingSpinnerTemplate, decorators: [{
            type: Directive,
            args: [{ selector: '[ng-loadingspinner-tmp]' }]
        }], ctorParameters: function () { return [{ type: i0.TemplateRef }]; } });

let nextUniqueId = 0;
// Boilerplate for applying mixins to MtxSelect.
/** @docs-private */
const _MtxSelectMixinBase = mixinDisabled(mixinErrorState(class {
    constructor(_defaultErrorStateMatcher, _parentForm, _parentFormGroup, 
    /**
     * Form control bound to the component.
     * Implemented as part of `MatFormFieldControl`.
     * @docs-private
     */
    ngControl) {
        this._defaultErrorStateMatcher = _defaultErrorStateMatcher;
        this._parentForm = _parentForm;
        this._parentFormGroup = _parentFormGroup;
        this.ngControl = ngControl;
        /**
         * Emits whenever the component state changes and should cause the parent
         * form-field to update. Implemented as part of `MatFormFieldControl`.
         * @docs-private
         */
        this.stateChanges = new Subject();
    }
}));
class MtxSelect extends _MtxSelectMixinBase {
    get clearSearchOnAdd() {
        return this._clearSearchOnAdd ?? this.closeOnSelect;
    }
    set clearSearchOnAdd(value) {
        this._clearSearchOnAdd = value;
    }
    get items() {
        return this._items;
    }
    set items(value) {
        this._itemsAreUsed = true;
        this._items = value;
    }
    /** Value of the select control. */
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
    /** Whether the select is focused. */
    get focused() {
        return this._focused;
    }
    /** Whether the select has a value. */
    get empty() {
        return this.value == null || (Array.isArray(this.value) && this.value.length === 0);
    }
    /**
     * Implemented as part of MatFormFieldControl.
     * @docs-private
     */
    get shouldLabelFloat() {
        return this.focused || !this.empty;
    }
    /** Whether the component is required. */
    get required() {
        return this._required ?? this.ngControl?.control?.hasValidator(Validators.required) ?? false;
    }
    set required(value) {
        this._required = coerceBooleanProperty(value);
        this.stateChanges.next();
    }
    /** Whether or not the overlay panel is open. */
    get panelOpen() {
        return !!this.ngSelect.isOpen;
    }
    constructor(_changeDetectorRef, _elementRef, _focusMonitor, _defaultErrorStateMatcher, _parentForm, _parentFormGroup, ngControl, _parentFormField) {
        super(_defaultErrorStateMatcher, _parentForm, _parentFormGroup, ngControl);
        this._changeDetectorRef = _changeDetectorRef;
        this._elementRef = _elementRef;
        this._focusMonitor = _focusMonitor;
        this._parentFormField = _parentFormField;
        this.addTag = false;
        this.addTagText = 'Add item';
        this.appearance = 'underline';
        this.appendTo = 'body';
        this.closeOnSelect = true;
        this.clearAllText = 'Clear all';
        this.clearable = true;
        this.clearOnBackspace = true;
        this.dropdownPosition = 'auto';
        this.selectableGroup = false;
        this.selectableGroupAsModel = true;
        this.hideSelected = false;
        this.loading = false;
        this.loadingText = 'Loading...';
        this.labelForId = null;
        this.markFirst = true;
        this.multiple = false;
        this.notFoundText = 'No items found';
        this.searchable = true;
        this.readonly = false;
        this.searchFn = null;
        this.searchWhileComposing = true;
        this.selectOnTab = false;
        this.trackByFn = null;
        this.inputAttrs = {};
        this.minTermLength = 0;
        this.editableSearchTerm = false;
        this.keyDownFn = (_) => true;
        this.virtualScroll = false;
        this.typeToSearchText = 'Type to search';
        this.blurEvent = new EventEmitter();
        this.focusEvent = new EventEmitter();
        this.changeEvent = new EventEmitter();
        this.openEvent = new EventEmitter();
        this.closeEvent = new EventEmitter();
        this.searchEvent = new EventEmitter();
        this.clearEvent = new EventEmitter();
        this.addEvent = new EventEmitter();
        this.removeEvent = new EventEmitter();
        this.scroll = new EventEmitter();
        this.scrollToEnd = new EventEmitter();
        this._items = [];
        this._itemsAreUsed = false;
        /** Emits whenever the component is destroyed. */
        this._destroy$ = new Subject();
        this._value = null;
        /** Implemented as part of MatFormFieldControl. */
        this.stateChanges = new Subject();
        /** Unique id for this select. */
        this._uid = `mtx-select-${nextUniqueId++}`;
        this._focused = false;
        /** Aria label of the select. */
        this.ariaLabel = '';
        /** Input that can be used to specify the `aria-labelledby` attribute. */
        this.ariaLabelledby = null;
        /** The aria-describedby attribute on the select for improved a11y. */
        this._ariaDescribedby = null;
        /** A name for this control that can be used by `mat-form-field`. */
        this.controlType = 'mtx-select';
        /** `View -> model callback called when value changes` */
        this._onChange = () => { };
        /** `View -> model callback called when select has been touched` */
        this._onTouched = () => { };
        /** ID for the DOM node containing the select's value. */
        this._valueId = `mtx-select-value-${nextUniqueId++}`;
        _focusMonitor.monitor(this._elementRef, true).subscribe(origin => {
            if (this._focused && !origin) {
                this._onTouched();
            }
            this._focused = !!origin;
            this.stateChanges.next();
        });
        if (this.ngControl) {
            // Note: we provide the value accessor through here, instead of
            // the `providers` to avoid running into a circular import.
            this.ngControl.valueAccessor = this;
        }
        // Force setter to be called in case id was not specified.
        // eslint-disable-next-line no-self-assign
        this.id = this.id;
    }
    ngOnInit() {
        // Fix compareWith warning of undefined value
        // https://github.com/ng-select/ng-select/issues/1537
        if (this.compareWith) {
            this.ngSelect.compareWith = this.compareWith;
        }
    }
    ngAfterViewInit() {
        if (!this._itemsAreUsed) {
            this._setItemsFromMtxOptions();
        }
    }
    ngDoCheck() {
        const ngControl = this.ngControl;
        if (this.ngControl) {
            // The disabled state might go out of sync if the form group is swapped out. See #17860.
            if (this._previousControl !== ngControl.control) {
                if (this._previousControl !== undefined &&
                    ngControl.disabled !== null &&
                    ngControl.disabled !== this.disabled) {
                    this.disabled = ngControl.disabled;
                }
                this._previousControl = ngControl.control;
            }
            this.updateErrorState();
        }
    }
    ngOnDestroy() {
        this._destroy$.next();
        this._destroy$.complete();
        this.stateChanges.complete();
        this._focusMonitor.stopMonitoring(this._elementRef);
    }
    /** Gets the value for the `aria-labelledby` attribute of the inputs. */
    _getAriaLabelledby() {
        if (this.ariaLabel) {
            return null;
        }
        const labelId = this._parentFormField?.getLabelId();
        let value = (labelId ? labelId + ' ' : '') + this._valueId;
        if (this.ariaLabelledby) {
            value += ' ' + this.ariaLabelledby;
        }
        return value;
    }
    /** Implemented as part of MatFormFieldControl. */
    setDescribedByIds(ids) {
        this._ariaDescribedby = ids.length ? ids.join(' ') : null;
    }
    /**
     * Disables the select. Part of the ControlValueAccessor interface required
     * to integrate with Angular's core forms API.
     *
     * @param isDisabled Sets whether the component is disabled.
     */
    setDisabledState(isDisabled) {
        this.disabled = isDisabled;
        this.readonly = isDisabled;
        this._changeDetectorRef.markForCheck();
        this.stateChanges.next();
    }
    /** Implemented as part of MatFormFieldControl. */
    onContainerClick(event) {
        const target = event.target;
        if (/mat-mdc-form-field|mtx-select/g.test(target.parentElement?.classList[0] || '')) {
            this.focus();
            this.open();
        }
    }
    /**
     * Sets the select's value. Part of the ControlValueAccessor interface
     * required to integrate with Angular's core forms API.
     *
     * @param value New value to be written to the model.
     */
    writeValue(value) {
        this.value = value;
        this._changeDetectorRef.markForCheck();
    }
    /**
     * Saves a callback function to be invoked when the select's value
     * changes from user input. Part of the ControlValueAccessor interface
     * required to integrate with Angular's core forms API.
     *
     * @param fn Callback to be triggered when the value changes.
     */
    registerOnChange(fn) {
        this._onChange = fn;
    }
    /**
     * Saves a callback function to be invoked when the select is blurred
     * by the user. Part of the ControlValueAccessor interface required
     * to integrate with Angular's core forms API.
     *
     * @param fn Callback to be triggered when the component has been touched.
     */
    registerOnTouched(fn) {
        this._onTouched = fn;
    }
    /** NgSelect's `_setItemsFromNgOptions` */
    _setItemsFromMtxOptions() {
        const mapMtxOptions = (options) => {
            this.items = options.map(option => ({
                $ngOptionValue: option.value,
                $ngOptionLabel: option.elementRef.nativeElement.innerHTML,
                disabled: option.disabled,
            }));
            this.ngSelect.itemsList.setItems(this.items);
            if (this.ngSelect.hasValue) {
                this.ngSelect.itemsList.mapSelectedItems();
            }
            this.ngSelect.detectChanges();
        };
        const handleOptionChange = () => {
            const changedOrDestroyed = merge(this.mtxOptions.changes, this._destroy$);
            merge(...this.mtxOptions.map(option => option.stateChange$))
                .pipe(takeUntil(changedOrDestroyed))
                .subscribe(option => {
                const item = this.ngSelect.itemsList.findItem(option.value);
                item.disabled = option.disabled;
                item.label = option.label || item.label;
                this.ngSelect.detectChanges();
            });
        };
        this.mtxOptions.changes
            .pipe(startWith(this.mtxOptions), takeUntil(this._destroy$))
            .subscribe(options => {
            mapMtxOptions(options);
            handleOptionChange();
        });
    }
    open() {
        this.ngSelect.open();
    }
    close() {
        this.ngSelect.close();
    }
    focus() {
        this.ngSelect.focus();
    }
    blur() {
        this.ngSelect.blur();
    }
}
/** @nocollapse */ MtxSelect.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MtxSelect, deps: [{ token: i0.ChangeDetectorRef }, { token: i0.ElementRef }, { token: i1.FocusMonitor }, { token: i2.ErrorStateMatcher }, { token: i3.NgForm, optional: true }, { token: i3.FormGroupDirective, optional: true }, { token: i3.NgControl, optional: true, self: true }, { token: MAT_FORM_FIELD, optional: true }], target: i0.ɵɵFactoryTarget.Component });
/** @nocollapse */ MtxSelect.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.1", type: MtxSelect, selector: "mtx-select", inputs: { disabled: "disabled", addTag: "addTag", addTagText: "addTagText", appearance: "appearance", appendTo: "appendTo", bindLabel: "bindLabel", bindValue: "bindValue", closeOnSelect: "closeOnSelect", clearAllText: "clearAllText", clearable: "clearable", clearOnBackspace: "clearOnBackspace", compareWith: "compareWith", dropdownPosition: "dropdownPosition", groupBy: "groupBy", groupValue: "groupValue", selectableGroup: "selectableGroup", selectableGroupAsModel: "selectableGroupAsModel", hideSelected: "hideSelected", isOpen: "isOpen", loading: "loading", loadingText: "loadingText", labelForId: "labelForId", markFirst: "markFirst", maxSelectedItems: "maxSelectedItems", multiple: "multiple", notFoundText: "notFoundText", searchable: "searchable", readonly: "readonly", searchFn: "searchFn", searchWhileComposing: "searchWhileComposing", selectOnTab: "selectOnTab", trackByFn: "trackByFn", inputAttrs: "inputAttrs", tabIndex: "tabIndex", openOnEnter: "openOnEnter", minTermLength: "minTermLength", editableSearchTerm: "editableSearchTerm", keyDownFn: "keyDownFn", virtualScroll: "virtualScroll", typeToSearchText: "typeToSearchText", typeahead: "typeahead", clearSearchOnAdd: "clearSearchOnAdd", items: "items", value: "value", id: "id", placeholder: "placeholder", required: "required", errorStateMatcher: "errorStateMatcher", ariaLabel: ["aria-label", "ariaLabel"], ariaLabelledby: ["aria-labelledby", "ariaLabelledby"] }, outputs: { blurEvent: "blur", focusEvent: "focus", changeEvent: "change", openEvent: "open", closeEvent: "close", searchEvent: "search", clearEvent: "clear", addEvent: "add", removeEvent: "remove", scroll: "scroll", scrollToEnd: "scrollToEnd" }, host: { attributes: { "role": "combobox", "aria-autocomplete": "none" }, properties: { "attr.id": "id", "attr.aria-expanded": "panelOpen", "attr.aria-label": "ariaLabel || null", "attr.aria-labelledby": "_getAriaLabelledby()", "attr.aria-describedby": "_ariaDescribedby || null", "attr.aria-required": "required.toString()", "attr.aria-disabled": "disabled.toString()", "attr.aria-invalid": "errorState", "class.mtx-select-floating": "shouldLabelFloat", "class.mtx-select-disabled": "disabled", "class.mtx-select-invalid": "errorState", "class.mtx-select-required": "required", "class.mtx-select-empty": "empty", "class.mtx-select-multiple": "multiple" }, classAttribute: "mtx-select" }, providers: [{ provide: MatFormFieldControl, useExisting: MtxSelect }], queries: [{ propertyName: "optionTemplate", first: true, predicate: MtxSelectOptionTemplate, descendants: true, read: TemplateRef }, { propertyName: "optgroupTemplate", first: true, predicate: MtxSelectOptgroupTemplate, descendants: true, read: TemplateRef }, { propertyName: "labelTemplate", first: true, predicate: MtxSelectLabelTemplate, descendants: true, read: TemplateRef }, { propertyName: "multiLabelTemplate", first: true, predicate: MtxSelectMultiLabelTemplate, descendants: true, read: TemplateRef }, { propertyName: "headerTemplate", first: true, predicate: MtxSelectHeaderTemplate, descendants: true, read: TemplateRef }, { propertyName: "footerTemplate", first: true, predicate: MtxSelectFooterTemplate, descendants: true, read: TemplateRef }, { propertyName: "notFoundTemplate", first: true, predicate: MtxSelectNotFoundTemplate, descendants: true, read: TemplateRef }, { propertyName: "typeToSearchTemplate", first: true, predicate: MtxSelectTypeToSearchTemplate, descendants: true, read: TemplateRef }, { propertyName: "loadingTextTemplate", first: true, predicate: MtxSelectLoadingTextTemplate, descendants: true, read: TemplateRef }, { propertyName: "tagTemplate", first: true, predicate: MtxSelectTagTemplate, descendants: true, read: TemplateRef }, { propertyName: "loadingSpinnerTemplate", first: true, predicate: MtxSelectLoadingSpinnerTemplate, descendants: true, read: TemplateRef }, { propertyName: "mtxOptions", predicate: MtxOption, descendants: true }], viewQueries: [{ propertyName: "ngSelect", first: true, predicate: ["ngSelect"], descendants: true, static: true }], exportAs: ["mtxSelect"], usesInheritance: true, ngImport: i0, template: "<ng-select #ngSelect [class.ng-select-invalid]=\"errorState\"\n           [(ngModel)]=\"value\"\n           [ngModelOptions]=\"{standalone: true}\"\n           [placeholder]=\"placeholder\"\n           [items]=\"items\"\n           [addTag]=\"addTag\"\n           [addTagText]=\"addTagText\"\n           [appendTo]=\"appendTo\"\n           [appearance]=\"appearance\"\n           [bindLabel]=\"bindLabel\"\n           [bindValue]=\"bindValue\"\n           [closeOnSelect]=\"closeOnSelect\"\n           [clearAllText]=\"clearAllText\"\n           [clearable]=\"clearable\"\n           [clearOnBackspace]=\"clearOnBackspace\"\n           [dropdownPosition]=\"dropdownPosition\"\n           [groupBy]=\"groupBy\"\n           [groupValue]=\"groupValue\"\n           [hideSelected]=\"hideSelected\"\n           [isOpen]=\"isOpen\"\n           [inputAttrs]=\"inputAttrs\"\n           [loading]=\"loading\"\n           [loadingText]=\"loadingText\"\n           [labelForId]=\"labelForId\"\n           [markFirst]=\"markFirst\"\n           [maxSelectedItems]=\"maxSelectedItems\"\n           [multiple]=\"multiple\"\n           [notFoundText]=\"notFoundText\"\n           [readonly]=\"readonly\"\n           [typeahead]=\"typeahead\"\n           [typeToSearchText]=\"typeToSearchText\"\n           [trackByFn]=\"trackByFn\"\n           [searchable]=\"searchable\"\n           [searchFn]=\"searchFn\"\n           [searchWhileComposing]=\"searchWhileComposing\"\n           [clearSearchOnAdd]=\"clearSearchOnAdd\"\n           [selectableGroup]=\"selectableGroup\"\n           [selectableGroupAsModel]=\"selectableGroupAsModel\"\n           [selectOnTab]=\"selectOnTab\"\n           [tabIndex]=\"tabIndex\"\n           [openOnEnter]=\"openOnEnter\"\n           [minTermLength]=\"minTermLength\"\n           [editableSearchTerm]=\"editableSearchTerm\"\n           [keyDownFn]=\"keyDownFn\"\n           [virtualScroll]=\"virtualScroll\"\n           (blur)=\"blurEvent.emit($event)\"\n           (focus)=\"focusEvent.emit($event)\"\n           (change)=\"changeEvent.emit($event)\"\n           (open)=\"openEvent.emit($event)\"\n           (close)=\"closeEvent.emit($event)\"\n           (search)=\"searchEvent.emit($event)\"\n           (clear)=\"clearEvent.emit($event)\"\n           (add)=\"addEvent.emit($event)\"\n           (remove)=\"removeEvent.emit($event)\"\n           (scroll)=\"scroll.emit($event)\"\n           (scrollToEnd)=\"scrollToEnd.emit($event)\">\n\n  <ng-container *ngIf=\"optionTemplate\">\n    <ng-template ng-option-tmp let-item=\"item\" let-item$=\"item$\" let-index=\"index\"\n                 let-searchTerm=\"searchTerm\">\n      <ng-template [ngTemplateOutlet]=\"optionTemplate\"\n                   [ngTemplateOutletContext]=\"{ item: item, item$: item$, index: index, searchTerm: searchTerm }\">\n      </ng-template>\n    </ng-template>\n  </ng-container>\n\n  <ng-container *ngIf=\"optgroupTemplate\">\n    <ng-template ng-optgroup-tmp let-item=\"item\" let-item$=\"item$\" let-index=\"index\"\n                 let-searchTerm=\"searchTerm\">\n      <ng-template [ngTemplateOutlet]=\"optgroupTemplate\"\n                   [ngTemplateOutletContext]=\"{ item: item, item$: item$, index: index, searchTerm: searchTerm }\">\n      </ng-template>\n    </ng-template>\n  </ng-container>\n\n  <ng-container *ngIf=\"labelTemplate\">\n    <ng-template ng-label-tmp let-item=\"item\" let-clear=\"clear\" let-label=\"label\">\n      <ng-template [ngTemplateOutlet]=\"labelTemplate\"\n                   [ngTemplateOutletContext]=\"{ item: item, clear: clear, label: label }\">\n      </ng-template>\n    </ng-template>\n  </ng-container>\n\n  <ng-container *ngIf=\"multiLabelTemplate\">\n    <ng-template ng-multi-label-tmp let-items=\"items\" let-clear=\"clear\">\n      <ng-template [ngTemplateOutlet]=\"multiLabelTemplate\"\n                   [ngTemplateOutletContext]=\"{ items: items, clear: clear }\">\n      </ng-template>\n    </ng-template>\n  </ng-container>\n\n  <ng-container *ngIf=\"headerTemplate\">\n    <ng-template ng-header-tmp>\n      <ng-template [ngTemplateOutlet]=\"headerTemplate\">\n      </ng-template>\n    </ng-template>\n  </ng-container>\n\n  <ng-container *ngIf=\"footerTemplate\">\n    <ng-template ng-footer-tmp>\n      <ng-template [ngTemplateOutlet]=\"footerTemplate\">\n      </ng-template>\n    </ng-template>\n  </ng-container>\n\n  <ng-container *ngIf=\"notFoundTemplate\">\n    <ng-template ng-notfound-tmp let-searchTerm=\"searchTerm\">\n      <ng-template [ngTemplateOutlet]=\"notFoundTemplate\"\n                   [ngTemplateOutletContext]=\"{ searchTerm: searchTerm }\">\n      </ng-template>\n    </ng-template>\n  </ng-container>\n\n  <ng-container *ngIf=\"typeToSearchTemplate\">\n    <ng-template ng-typetosearch-tmp>\n      <ng-template [ngTemplateOutlet]=\"typeToSearchTemplate\">\n      </ng-template>\n    </ng-template>\n  </ng-container>\n\n  <ng-container *ngIf=\"loadingTextTemplate\">\n    <ng-template ng-loadingtext-tmp let-searchTerm=\"searchTerm\">\n      <ng-template [ngTemplateOutlet]=\"loadingTextTemplate\"\n                   [ngTemplateOutletContext]=\"{ searchTerm: searchTerm }\">\n      </ng-template>\n    </ng-template>\n  </ng-container>\n\n  <ng-container *ngIf=\"tagTemplate\">\n    <ng-template ng-tag-tmp let-searchTerm=\"searchTerm\">\n      <ng-template [ngTemplateOutlet]=\"tagTemplate\"\n                   [ngTemplateOutletContext]=\"{ searchTerm: searchTerm }\">\n      </ng-template>\n    </ng-template>\n  </ng-container>\n\n  <ng-container *ngIf=\"loadingSpinnerTemplate\">\n    <ng-template ng-loadingspinner-tmp>\n      <ng-template [ngTemplateOutlet]=\"loadingSpinnerTemplate\">\n      </ng-template>\n    </ng-template>\n  </ng-container>\n\n</ng-select>\n", styles: [".ng-select{padding-right:16px;padding-left:16px;margin-right:-16px;margin-left:-16px}.ng-select .ng-select-container,.ng-select .ng-select-container .ng-value-container{align-items:center}.ng-select .ng-select-container .ng-value-container .ng-input>input{font:inherit;padding:0}.ng-select .ng-placeholder{transition:opacity .2s;opacity:1}.mat-form-field-hide-placeholder .ng-select .ng-placeholder{opacity:0}.ng-select .ng-has-value .ng-placeholder{display:none}.ng-select.ng-select-opened .ng-arrow-wrapper .ng-arrow{top:-2px;border-width:0 5px 5px}.ng-select.ng-select-single.ng-select-filtered .ng-placeholder{display:initial;visibility:hidden}.ng-select.ng-select-single .ng-select-container .ng-value-container .ng-placeholder:after,.ng-select.ng-select-single .ng-select-container .ng-value-container .ng-value:after{display:inline-block;content:\"\"}.ng-select.ng-select-multiple .ng-select-container .ng-value-container{margin:-4px 0}.ng-select.ng-select-multiple .ng-select-container .ng-value-container .ng-value{margin-right:4px;border-radius:16px;font-size:.875em;line-height:18px}[dir=rtl] .ng-select.ng-select-multiple .ng-select-container .ng-value-container .ng-value{margin-right:auto;margin-left:4px}.ng-select.ng-select-multiple .ng-select-container .ng-value-container .ng-value .ng-value-label{display:inline-block;margin:0 8px}.ng-select.ng-select-multiple .ng-select-container .ng-value-container .ng-value .ng-value-icon{display:inline-block;width:18px;height:18px;border-radius:100%;text-align:center}.ng-select.ng-select-multiple .ng-select-container .ng-value-container .ng-value .ng-value-icon.left{margin-right:-4px}[dir=rtl] .ng-select.ng-select-multiple .ng-select-container .ng-value-container .ng-value .ng-value-icon.left{margin-left:-4px;margin-right:auto}.ng-select.ng-select-multiple .ng-select-container .ng-value-container .ng-value .ng-value-icon.right{margin-left:-4px}[dir=rtl] .ng-select.ng-select-multiple .ng-select-container .ng-value-container .ng-value .ng-value-icon.right{margin-right:-4px;margin-left:auto}.ng-select .ng-clear-wrapper{text-align:center}.ng-select .ng-arrow-wrapper{width:18px}.ng-select .ng-arrow-wrapper .ng-arrow{border-width:5px 5px 2px;border-style:solid}.ng-dropdown-panel{left:0}[dir=rtl] .ng-dropdown-panel{right:0;left:auto}.ng-dropdown-panel.ng-select-bottom{top:100%;border-bottom-left-radius:4px;border-bottom-right-radius:4px;box-shadow:0 2px 4px -1px #0003,0 4px 5px #00000024,0 1px 10px #0000001f}.ng-dropdown-panel.ng-select-top{bottom:100%;border-top-left-radius:4px;border-top-right-radius:4px;box-shadow:0 2px 4px -1px #0003,0 4px 5px #00000024,0 1px 10px #0000001f}.ng-dropdown-panel .ng-dropdown-header,.ng-dropdown-panel .ng-dropdown-footer{padding:14px 16px}.ng-dropdown-panel .ng-dropdown-panel-items .ng-optgroup{padding:14px 16px;font-weight:500;-webkit-user-select:none;user-select:none;cursor:pointer}.ng-dropdown-panel .ng-dropdown-panel-items .ng-optgroup.ng-option-disabled{cursor:default}.ng-dropdown-panel .ng-dropdown-panel-items .ng-option{position:relative;padding:14px 16px;text-overflow:ellipsis;text-decoration:none;text-align:left;white-space:nowrap;overflow:hidden}[dir=rtl] .ng-dropdown-panel .ng-dropdown-panel-items .ng-option{text-align:right}.ng-dropdown-panel .ng-dropdown-panel-items .ng-option.ng-option-child{padding-left:32px}[dir=rtl] .ng-dropdown-panel .ng-dropdown-panel-items .ng-option.ng-option-child{padding-right:32px;padding-left:0}.ng-dropdown-panel .ng-dropdown-panel-items .ng-option .ng-tag-label{padding-right:5px;font-size:80%;font-weight:400}[dir=rtl] .ng-dropdown-panel .ng-dropdown-panel-items .ng-option .ng-tag-label{padding-left:5px;padding-right:0}\n"], dependencies: [{ kind: "directive", type: i4.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i4.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "directive", type: i3.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i3.NgModel, selector: "[ngModel]:not([formControlName]):not([formControl])", inputs: ["name", "disabled", "ngModel", "ngModelOptions"], outputs: ["ngModelChange"], exportAs: ["ngModel"] }, { kind: "component", type: i5.NgSelectComponent, selector: "ng-select", inputs: ["bindLabel", "bindValue", "markFirst", "placeholder", "notFoundText", "typeToSearchText", "addTagText", "loadingText", "clearAllText", "appearance", "dropdownPosition", "appendTo", "loading", "closeOnSelect", "hideSelected", "selectOnTab", "openOnEnter", "maxSelectedItems", "groupBy", "groupValue", "bufferAmount", "virtualScroll", "selectableGroup", "selectableGroupAsModel", "searchFn", "trackByFn", "clearOnBackspace", "labelForId", "inputAttrs", "tabIndex", "readonly", "searchWhileComposing", "minTermLength", "editableSearchTerm", "keyDownFn", "typeahead", "multiple", "addTag", "searchable", "clearable", "isOpen", "items", "compareWith", "clearSearchOnAdd"], outputs: ["blur", "focus", "change", "open", "close", "search", "clear", "add", "remove", "scroll", "scrollToEnd"] }, { kind: "directive", type: i5.NgOptgroupTemplateDirective, selector: "[ng-optgroup-tmp]" }, { kind: "directive", type: i5.NgOptionTemplateDirective, selector: "[ng-option-tmp]" }, { kind: "directive", type: i5.NgLabelTemplateDirective, selector: "[ng-label-tmp]" }, { kind: "directive", type: i5.NgMultiLabelTemplateDirective, selector: "[ng-multi-label-tmp]" }, { kind: "directive", type: i5.NgHeaderTemplateDirective, selector: "[ng-header-tmp]" }, { kind: "directive", type: i5.NgFooterTemplateDirective, selector: "[ng-footer-tmp]" }, { kind: "directive", type: i5.NgNotFoundTemplateDirective, selector: "[ng-notfound-tmp]" }, { kind: "directive", type: i5.NgTypeToSearchTemplateDirective, selector: "[ng-typetosearch-tmp]" }, { kind: "directive", type: i5.NgLoadingTextTemplateDirective, selector: "[ng-loadingtext-tmp]" }, { kind: "directive", type: i5.NgTagTemplateDirective, selector: "[ng-tag-tmp]" }, { kind: "directive", type: i5.NgLoadingSpinnerTemplateDirective, selector: "[ng-loadingspinner-tmp]" }, { kind: "directive", type: MtxSelectOptgroupTemplate, selector: "[ng-optgroup-tmp]" }, { kind: "directive", type: MtxSelectOptionTemplate, selector: "[ng-option-tmp]" }, { kind: "directive", type: MtxSelectLabelTemplate, selector: "[ng-label-tmp]" }, { kind: "directive", type: MtxSelectMultiLabelTemplate, selector: "[ng-multi-label-tmp]" }, { kind: "directive", type: MtxSelectHeaderTemplate, selector: "[ng-header-tmp]" }, { kind: "directive", type: MtxSelectFooterTemplate, selector: "[ng-footer-tmp]" }, { kind: "directive", type: MtxSelectNotFoundTemplate, selector: "[ng-notfound-tmp]" }, { kind: "directive", type: MtxSelectTypeToSearchTemplate, selector: "[ng-typetosearch-tmp]" }, { kind: "directive", type: MtxSelectLoadingTextTemplate, selector: "[ng-loadingtext-tmp]" }, { kind: "directive", type: MtxSelectTagTemplate, selector: "[ng-tag-tmp]" }, { kind: "directive", type: MtxSelectLoadingSpinnerTemplate, selector: "[ng-loadingspinner-tmp]" }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MtxSelect, decorators: [{
            type: Component,
            args: [{ selector: 'mtx-select', exportAs: 'mtxSelect', host: {
                        'role': 'combobox',
                        'aria-autocomplete': 'none',
                        '[attr.id]': 'id',
                        '[attr.aria-expanded]': 'panelOpen',
                        '[attr.aria-label]': 'ariaLabel || null',
                        '[attr.aria-labelledby]': '_getAriaLabelledby()',
                        '[attr.aria-describedby]': '_ariaDescribedby || null',
                        '[attr.aria-required]': 'required.toString()',
                        '[attr.aria-disabled]': 'disabled.toString()',
                        '[attr.aria-invalid]': 'errorState',
                        '[class.mtx-select-floating]': 'shouldLabelFloat',
                        '[class.mtx-select-disabled]': 'disabled',
                        '[class.mtx-select-invalid]': 'errorState',
                        '[class.mtx-select-required]': 'required',
                        '[class.mtx-select-empty]': 'empty',
                        '[class.mtx-select-multiple]': 'multiple',
                        'class': 'mtx-select',
                    }, inputs: ['disabled'], encapsulation: ViewEncapsulation.None, changeDetection: ChangeDetectionStrategy.OnPush, providers: [{ provide: MatFormFieldControl, useExisting: MtxSelect }], template: "<ng-select #ngSelect [class.ng-select-invalid]=\"errorState\"\n           [(ngModel)]=\"value\"\n           [ngModelOptions]=\"{standalone: true}\"\n           [placeholder]=\"placeholder\"\n           [items]=\"items\"\n           [addTag]=\"addTag\"\n           [addTagText]=\"addTagText\"\n           [appendTo]=\"appendTo\"\n           [appearance]=\"appearance\"\n           [bindLabel]=\"bindLabel\"\n           [bindValue]=\"bindValue\"\n           [closeOnSelect]=\"closeOnSelect\"\n           [clearAllText]=\"clearAllText\"\n           [clearable]=\"clearable\"\n           [clearOnBackspace]=\"clearOnBackspace\"\n           [dropdownPosition]=\"dropdownPosition\"\n           [groupBy]=\"groupBy\"\n           [groupValue]=\"groupValue\"\n           [hideSelected]=\"hideSelected\"\n           [isOpen]=\"isOpen\"\n           [inputAttrs]=\"inputAttrs\"\n           [loading]=\"loading\"\n           [loadingText]=\"loadingText\"\n           [labelForId]=\"labelForId\"\n           [markFirst]=\"markFirst\"\n           [maxSelectedItems]=\"maxSelectedItems\"\n           [multiple]=\"multiple\"\n           [notFoundText]=\"notFoundText\"\n           [readonly]=\"readonly\"\n           [typeahead]=\"typeahead\"\n           [typeToSearchText]=\"typeToSearchText\"\n           [trackByFn]=\"trackByFn\"\n           [searchable]=\"searchable\"\n           [searchFn]=\"searchFn\"\n           [searchWhileComposing]=\"searchWhileComposing\"\n           [clearSearchOnAdd]=\"clearSearchOnAdd\"\n           [selectableGroup]=\"selectableGroup\"\n           [selectableGroupAsModel]=\"selectableGroupAsModel\"\n           [selectOnTab]=\"selectOnTab\"\n           [tabIndex]=\"tabIndex\"\n           [openOnEnter]=\"openOnEnter\"\n           [minTermLength]=\"minTermLength\"\n           [editableSearchTerm]=\"editableSearchTerm\"\n           [keyDownFn]=\"keyDownFn\"\n           [virtualScroll]=\"virtualScroll\"\n           (blur)=\"blurEvent.emit($event)\"\n           (focus)=\"focusEvent.emit($event)\"\n           (change)=\"changeEvent.emit($event)\"\n           (open)=\"openEvent.emit($event)\"\n           (close)=\"closeEvent.emit($event)\"\n           (search)=\"searchEvent.emit($event)\"\n           (clear)=\"clearEvent.emit($event)\"\n           (add)=\"addEvent.emit($event)\"\n           (remove)=\"removeEvent.emit($event)\"\n           (scroll)=\"scroll.emit($event)\"\n           (scrollToEnd)=\"scrollToEnd.emit($event)\">\n\n  <ng-container *ngIf=\"optionTemplate\">\n    <ng-template ng-option-tmp let-item=\"item\" let-item$=\"item$\" let-index=\"index\"\n                 let-searchTerm=\"searchTerm\">\n      <ng-template [ngTemplateOutlet]=\"optionTemplate\"\n                   [ngTemplateOutletContext]=\"{ item: item, item$: item$, index: index, searchTerm: searchTerm }\">\n      </ng-template>\n    </ng-template>\n  </ng-container>\n\n  <ng-container *ngIf=\"optgroupTemplate\">\n    <ng-template ng-optgroup-tmp let-item=\"item\" let-item$=\"item$\" let-index=\"index\"\n                 let-searchTerm=\"searchTerm\">\n      <ng-template [ngTemplateOutlet]=\"optgroupTemplate\"\n                   [ngTemplateOutletContext]=\"{ item: item, item$: item$, index: index, searchTerm: searchTerm }\">\n      </ng-template>\n    </ng-template>\n  </ng-container>\n\n  <ng-container *ngIf=\"labelTemplate\">\n    <ng-template ng-label-tmp let-item=\"item\" let-clear=\"clear\" let-label=\"label\">\n      <ng-template [ngTemplateOutlet]=\"labelTemplate\"\n                   [ngTemplateOutletContext]=\"{ item: item, clear: clear, label: label }\">\n      </ng-template>\n    </ng-template>\n  </ng-container>\n\n  <ng-container *ngIf=\"multiLabelTemplate\">\n    <ng-template ng-multi-label-tmp let-items=\"items\" let-clear=\"clear\">\n      <ng-template [ngTemplateOutlet]=\"multiLabelTemplate\"\n                   [ngTemplateOutletContext]=\"{ items: items, clear: clear }\">\n      </ng-template>\n    </ng-template>\n  </ng-container>\n\n  <ng-container *ngIf=\"headerTemplate\">\n    <ng-template ng-header-tmp>\n      <ng-template [ngTemplateOutlet]=\"headerTemplate\">\n      </ng-template>\n    </ng-template>\n  </ng-container>\n\n  <ng-container *ngIf=\"footerTemplate\">\n    <ng-template ng-footer-tmp>\n      <ng-template [ngTemplateOutlet]=\"footerTemplate\">\n      </ng-template>\n    </ng-template>\n  </ng-container>\n\n  <ng-container *ngIf=\"notFoundTemplate\">\n    <ng-template ng-notfound-tmp let-searchTerm=\"searchTerm\">\n      <ng-template [ngTemplateOutlet]=\"notFoundTemplate\"\n                   [ngTemplateOutletContext]=\"{ searchTerm: searchTerm }\">\n      </ng-template>\n    </ng-template>\n  </ng-container>\n\n  <ng-container *ngIf=\"typeToSearchTemplate\">\n    <ng-template ng-typetosearch-tmp>\n      <ng-template [ngTemplateOutlet]=\"typeToSearchTemplate\">\n      </ng-template>\n    </ng-template>\n  </ng-container>\n\n  <ng-container *ngIf=\"loadingTextTemplate\">\n    <ng-template ng-loadingtext-tmp let-searchTerm=\"searchTerm\">\n      <ng-template [ngTemplateOutlet]=\"loadingTextTemplate\"\n                   [ngTemplateOutletContext]=\"{ searchTerm: searchTerm }\">\n      </ng-template>\n    </ng-template>\n  </ng-container>\n\n  <ng-container *ngIf=\"tagTemplate\">\n    <ng-template ng-tag-tmp let-searchTerm=\"searchTerm\">\n      <ng-template [ngTemplateOutlet]=\"tagTemplate\"\n                   [ngTemplateOutletContext]=\"{ searchTerm: searchTerm }\">\n      </ng-template>\n    </ng-template>\n  </ng-container>\n\n  <ng-container *ngIf=\"loadingSpinnerTemplate\">\n    <ng-template ng-loadingspinner-tmp>\n      <ng-template [ngTemplateOutlet]=\"loadingSpinnerTemplate\">\n      </ng-template>\n    </ng-template>\n  </ng-container>\n\n</ng-select>\n", styles: [".ng-select{padding-right:16px;padding-left:16px;margin-right:-16px;margin-left:-16px}.ng-select .ng-select-container,.ng-select .ng-select-container .ng-value-container{align-items:center}.ng-select .ng-select-container .ng-value-container .ng-input>input{font:inherit;padding:0}.ng-select .ng-placeholder{transition:opacity .2s;opacity:1}.mat-form-field-hide-placeholder .ng-select .ng-placeholder{opacity:0}.ng-select .ng-has-value .ng-placeholder{display:none}.ng-select.ng-select-opened .ng-arrow-wrapper .ng-arrow{top:-2px;border-width:0 5px 5px}.ng-select.ng-select-single.ng-select-filtered .ng-placeholder{display:initial;visibility:hidden}.ng-select.ng-select-single .ng-select-container .ng-value-container .ng-placeholder:after,.ng-select.ng-select-single .ng-select-container .ng-value-container .ng-value:after{display:inline-block;content:\"\"}.ng-select.ng-select-multiple .ng-select-container .ng-value-container{margin:-4px 0}.ng-select.ng-select-multiple .ng-select-container .ng-value-container .ng-value{margin-right:4px;border-radius:16px;font-size:.875em;line-height:18px}[dir=rtl] .ng-select.ng-select-multiple .ng-select-container .ng-value-container .ng-value{margin-right:auto;margin-left:4px}.ng-select.ng-select-multiple .ng-select-container .ng-value-container .ng-value .ng-value-label{display:inline-block;margin:0 8px}.ng-select.ng-select-multiple .ng-select-container .ng-value-container .ng-value .ng-value-icon{display:inline-block;width:18px;height:18px;border-radius:100%;text-align:center}.ng-select.ng-select-multiple .ng-select-container .ng-value-container .ng-value .ng-value-icon.left{margin-right:-4px}[dir=rtl] .ng-select.ng-select-multiple .ng-select-container .ng-value-container .ng-value .ng-value-icon.left{margin-left:-4px;margin-right:auto}.ng-select.ng-select-multiple .ng-select-container .ng-value-container .ng-value .ng-value-icon.right{margin-left:-4px}[dir=rtl] .ng-select.ng-select-multiple .ng-select-container .ng-value-container .ng-value .ng-value-icon.right{margin-right:-4px;margin-left:auto}.ng-select .ng-clear-wrapper{text-align:center}.ng-select .ng-arrow-wrapper{width:18px}.ng-select .ng-arrow-wrapper .ng-arrow{border-width:5px 5px 2px;border-style:solid}.ng-dropdown-panel{left:0}[dir=rtl] .ng-dropdown-panel{right:0;left:auto}.ng-dropdown-panel.ng-select-bottom{top:100%;border-bottom-left-radius:4px;border-bottom-right-radius:4px;box-shadow:0 2px 4px -1px #0003,0 4px 5px #00000024,0 1px 10px #0000001f}.ng-dropdown-panel.ng-select-top{bottom:100%;border-top-left-radius:4px;border-top-right-radius:4px;box-shadow:0 2px 4px -1px #0003,0 4px 5px #00000024,0 1px 10px #0000001f}.ng-dropdown-panel .ng-dropdown-header,.ng-dropdown-panel .ng-dropdown-footer{padding:14px 16px}.ng-dropdown-panel .ng-dropdown-panel-items .ng-optgroup{padding:14px 16px;font-weight:500;-webkit-user-select:none;user-select:none;cursor:pointer}.ng-dropdown-panel .ng-dropdown-panel-items .ng-optgroup.ng-option-disabled{cursor:default}.ng-dropdown-panel .ng-dropdown-panel-items .ng-option{position:relative;padding:14px 16px;text-overflow:ellipsis;text-decoration:none;text-align:left;white-space:nowrap;overflow:hidden}[dir=rtl] .ng-dropdown-panel .ng-dropdown-panel-items .ng-option{text-align:right}.ng-dropdown-panel .ng-dropdown-panel-items .ng-option.ng-option-child{padding-left:32px}[dir=rtl] .ng-dropdown-panel .ng-dropdown-panel-items .ng-option.ng-option-child{padding-right:32px;padding-left:0}.ng-dropdown-panel .ng-dropdown-panel-items .ng-option .ng-tag-label{padding-right:5px;font-size:80%;font-weight:400}[dir=rtl] .ng-dropdown-panel .ng-dropdown-panel-items .ng-option .ng-tag-label{padding-left:5px;padding-right:0}\n"] }]
        }], ctorParameters: function () { return [{ type: i0.ChangeDetectorRef }, { type: i0.ElementRef }, { type: i1.FocusMonitor }, { type: i2.ErrorStateMatcher }, { type: i3.NgForm, decorators: [{
                    type: Optional
                }] }, { type: i3.FormGroupDirective, decorators: [{
                    type: Optional
                }] }, { type: i3.NgControl, decorators: [{
                    type: Optional
                }, {
                    type: Self
                }] }, { type: i7.MatFormField, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [MAT_FORM_FIELD]
                }] }]; }, propDecorators: { ngSelect: [{
                type: ViewChild,
                args: ['ngSelect', { static: true }]
            }], optionTemplate: [{
                type: ContentChild,
                args: [MtxSelectOptionTemplate, { read: TemplateRef }]
            }], optgroupTemplate: [{
                type: ContentChild,
                args: [MtxSelectOptgroupTemplate, { read: TemplateRef }]
            }], labelTemplate: [{
                type: ContentChild,
                args: [MtxSelectLabelTemplate, { read: TemplateRef }]
            }], multiLabelTemplate: [{
                type: ContentChild,
                args: [MtxSelectMultiLabelTemplate, { read: TemplateRef }]
            }], headerTemplate: [{
                type: ContentChild,
                args: [MtxSelectHeaderTemplate, { read: TemplateRef }]
            }], footerTemplate: [{
                type: ContentChild,
                args: [MtxSelectFooterTemplate, { read: TemplateRef }]
            }], notFoundTemplate: [{
                type: ContentChild,
                args: [MtxSelectNotFoundTemplate, { read: TemplateRef }]
            }], typeToSearchTemplate: [{
                type: ContentChild,
                args: [MtxSelectTypeToSearchTemplate, { read: TemplateRef }]
            }], loadingTextTemplate: [{
                type: ContentChild,
                args: [MtxSelectLoadingTextTemplate, { read: TemplateRef }]
            }], tagTemplate: [{
                type: ContentChild,
                args: [MtxSelectTagTemplate, { read: TemplateRef }]
            }], loadingSpinnerTemplate: [{
                type: ContentChild,
                args: [MtxSelectLoadingSpinnerTemplate, { read: TemplateRef }]
            }], mtxOptions: [{
                type: ContentChildren,
                args: [MtxOption, { descendants: true }]
            }], addTag: [{
                type: Input
            }], addTagText: [{
                type: Input
            }], appearance: [{
                type: Input
            }], appendTo: [{
                type: Input
            }], bindLabel: [{
                type: Input
            }], bindValue: [{
                type: Input
            }], closeOnSelect: [{
                type: Input
            }], clearAllText: [{
                type: Input
            }], clearable: [{
                type: Input
            }], clearOnBackspace: [{
                type: Input
            }], compareWith: [{
                type: Input
            }], dropdownPosition: [{
                type: Input
            }], groupBy: [{
                type: Input
            }], groupValue: [{
                type: Input
            }], selectableGroup: [{
                type: Input
            }], selectableGroupAsModel: [{
                type: Input
            }], hideSelected: [{
                type: Input
            }], isOpen: [{
                type: Input
            }], loading: [{
                type: Input
            }], loadingText: [{
                type: Input
            }], labelForId: [{
                type: Input
            }], markFirst: [{
                type: Input
            }], maxSelectedItems: [{
                type: Input
            }], multiple: [{
                type: Input
            }], notFoundText: [{
                type: Input
            }], searchable: [{
                type: Input
            }], readonly: [{
                type: Input
            }], searchFn: [{
                type: Input
            }], searchWhileComposing: [{
                type: Input
            }], selectOnTab: [{
                type: Input
            }], trackByFn: [{
                type: Input
            }], inputAttrs: [{
                type: Input
            }], tabIndex: [{
                type: Input
            }], openOnEnter: [{
                type: Input
            }], minTermLength: [{
                type: Input
            }], editableSearchTerm: [{
                type: Input
            }], keyDownFn: [{
                type: Input
            }], virtualScroll: [{
                type: Input
            }], typeToSearchText: [{
                type: Input
            }], typeahead: [{
                type: Input
            }], blurEvent: [{
                type: Output,
                args: ['blur']
            }], focusEvent: [{
                type: Output,
                args: ['focus']
            }], changeEvent: [{
                type: Output,
                args: ['change']
            }], openEvent: [{
                type: Output,
                args: ['open']
            }], closeEvent: [{
                type: Output,
                args: ['close']
            }], searchEvent: [{
                type: Output,
                args: ['search']
            }], clearEvent: [{
                type: Output,
                args: ['clear']
            }], addEvent: [{
                type: Output,
                args: ['add']
            }], removeEvent: [{
                type: Output,
                args: ['remove']
            }], scroll: [{
                type: Output,
                args: ['scroll']
            }], scrollToEnd: [{
                type: Output,
                args: ['scrollToEnd']
            }], clearSearchOnAdd: [{
                type: Input
            }], items: [{
                type: Input
            }], value: [{
                type: Input
            }], id: [{
                type: Input
            }], placeholder: [{
                type: Input
            }], required: [{
                type: Input
            }], errorStateMatcher: [{
                type: Input
            }], ariaLabel: [{
                type: Input,
                args: ['aria-label']
            }], ariaLabelledby: [{
                type: Input,
                args: ['aria-labelledby']
            }] } });

class MtxSelectModule {
}
/** @nocollapse */ MtxSelectModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MtxSelectModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
/** @nocollapse */ MtxSelectModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "15.2.1", ngImport: i0, type: MtxSelectModule, declarations: [MtxSelect,
        MtxOption,
        MtxSelectOptgroupTemplate,
        MtxSelectOptionTemplate,
        MtxSelectLabelTemplate,
        MtxSelectMultiLabelTemplate,
        MtxSelectHeaderTemplate,
        MtxSelectFooterTemplate,
        MtxSelectNotFoundTemplate,
        MtxSelectTypeToSearchTemplate,
        MtxSelectLoadingTextTemplate,
        MtxSelectTagTemplate,
        MtxSelectLoadingSpinnerTemplate], imports: [CommonModule, FormsModule, ReactiveFormsModule, NgSelectModule], exports: [MtxSelect,
        MtxOption,
        MtxSelectOptgroupTemplate,
        MtxSelectOptionTemplate,
        MtxSelectLabelTemplate,
        MtxSelectMultiLabelTemplate,
        MtxSelectHeaderTemplate,
        MtxSelectFooterTemplate,
        MtxSelectNotFoundTemplate,
        MtxSelectTypeToSearchTemplate,
        MtxSelectLoadingTextTemplate,
        MtxSelectTagTemplate,
        MtxSelectLoadingSpinnerTemplate] });
/** @nocollapse */ MtxSelectModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MtxSelectModule, imports: [CommonModule, FormsModule, ReactiveFormsModule, NgSelectModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MtxSelectModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, FormsModule, ReactiveFormsModule, NgSelectModule],
                    exports: [
                        MtxSelect,
                        MtxOption,
                        MtxSelectOptgroupTemplate,
                        MtxSelectOptionTemplate,
                        MtxSelectLabelTemplate,
                        MtxSelectMultiLabelTemplate,
                        MtxSelectHeaderTemplate,
                        MtxSelectFooterTemplate,
                        MtxSelectNotFoundTemplate,
                        MtxSelectTypeToSearchTemplate,
                        MtxSelectLoadingTextTemplate,
                        MtxSelectTagTemplate,
                        MtxSelectLoadingSpinnerTemplate,
                    ],
                    declarations: [
                        MtxSelect,
                        MtxOption,
                        MtxSelectOptgroupTemplate,
                        MtxSelectOptionTemplate,
                        MtxSelectLabelTemplate,
                        MtxSelectMultiLabelTemplate,
                        MtxSelectHeaderTemplate,
                        MtxSelectFooterTemplate,
                        MtxSelectNotFoundTemplate,
                        MtxSelectTypeToSearchTemplate,
                        MtxSelectLoadingTextTemplate,
                        MtxSelectTagTemplate,
                        MtxSelectLoadingSpinnerTemplate,
                    ],
                }]
        }] });

/**
 * Generated bundle index. Do not edit.
 */

export { MtxOption, MtxSelect, MtxSelectFooterTemplate, MtxSelectHeaderTemplate, MtxSelectLabelTemplate, MtxSelectLoadingSpinnerTemplate, MtxSelectLoadingTextTemplate, MtxSelectModule, MtxSelectMultiLabelTemplate, MtxSelectNotFoundTemplate, MtxSelectOptgroupTemplate, MtxSelectOptionTemplate, MtxSelectTagTemplate, MtxSelectTypeToSearchTemplate };
//# sourceMappingURL=mtxSelect.mjs.map
