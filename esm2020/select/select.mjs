import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { ChangeDetectionStrategy, Component, ContentChild, ContentChildren, EventEmitter, Inject, Input, Optional, Output, Self, TemplateRef, ViewChild, ViewEncapsulation, } from '@angular/core';
import { mixinDisabled, mixinErrorState, } from '@angular/material/core';
import { Validators, } from '@angular/forms';
import { MatFormFieldControl, MAT_FORM_FIELD } from '@angular/material/form-field';
import { merge, Subject } from 'rxjs';
import { startWith, takeUntil } from 'rxjs/operators';
import { MtxOption } from './option';
import { MtxSelectFooterTemplate, MtxSelectHeaderTemplate, MtxSelectLabelTemplate, MtxSelectLoadingSpinnerTemplate, MtxSelectLoadingTextTemplate, MtxSelectMultiLabelTemplate, MtxSelectNotFoundTemplate, MtxSelectOptgroupTemplate, MtxSelectOptionTemplate, MtxSelectTagTemplate, MtxSelectTypeToSearchTemplate, } from './templates';
import * as i0 from "@angular/core";
import * as i1 from "@angular/cdk/a11y";
import * as i2 from "@angular/material/core";
import * as i3 from "@angular/forms";
import * as i4 from "@angular/common";
import * as i5 from "@ng-select/ng-select";
import * as i6 from "./templates";
import * as i7 from "@angular/material/form-field";
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
export class MtxSelect extends _MtxSelectMixinBase {
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
/** @nocollapse */ MtxSelect.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.1", type: MtxSelect, selector: "mtx-select", inputs: { disabled: "disabled", addTag: "addTag", addTagText: "addTagText", appearance: "appearance", appendTo: "appendTo", bindLabel: "bindLabel", bindValue: "bindValue", closeOnSelect: "closeOnSelect", clearAllText: "clearAllText", clearable: "clearable", clearOnBackspace: "clearOnBackspace", compareWith: "compareWith", dropdownPosition: "dropdownPosition", groupBy: "groupBy", groupValue: "groupValue", selectableGroup: "selectableGroup", selectableGroupAsModel: "selectableGroupAsModel", hideSelected: "hideSelected", isOpen: "isOpen", loading: "loading", loadingText: "loadingText", labelForId: "labelForId", markFirst: "markFirst", maxSelectedItems: "maxSelectedItems", multiple: "multiple", notFoundText: "notFoundText", searchable: "searchable", readonly: "readonly", searchFn: "searchFn", searchWhileComposing: "searchWhileComposing", selectOnTab: "selectOnTab", trackByFn: "trackByFn", inputAttrs: "inputAttrs", tabIndex: "tabIndex", openOnEnter: "openOnEnter", minTermLength: "minTermLength", editableSearchTerm: "editableSearchTerm", keyDownFn: "keyDownFn", virtualScroll: "virtualScroll", typeToSearchText: "typeToSearchText", typeahead: "typeahead", clearSearchOnAdd: "clearSearchOnAdd", items: "items", value: "value", id: "id", placeholder: "placeholder", required: "required", errorStateMatcher: "errorStateMatcher", ariaLabel: ["aria-label", "ariaLabel"], ariaLabelledby: ["aria-labelledby", "ariaLabelledby"] }, outputs: { blurEvent: "blur", focusEvent: "focus", changeEvent: "change", openEvent: "open", closeEvent: "close", searchEvent: "search", clearEvent: "clear", addEvent: "add", removeEvent: "remove", scroll: "scroll", scrollToEnd: "scrollToEnd" }, host: { attributes: { "role": "combobox", "aria-autocomplete": "none" }, properties: { "attr.id": "id", "attr.aria-expanded": "panelOpen", "attr.aria-label": "ariaLabel || null", "attr.aria-labelledby": "_getAriaLabelledby()", "attr.aria-describedby": "_ariaDescribedby || null", "attr.aria-required": "required.toString()", "attr.aria-disabled": "disabled.toString()", "attr.aria-invalid": "errorState", "class.mtx-select-floating": "shouldLabelFloat", "class.mtx-select-disabled": "disabled", "class.mtx-select-invalid": "errorState", "class.mtx-select-required": "required", "class.mtx-select-empty": "empty", "class.mtx-select-multiple": "multiple" }, classAttribute: "mtx-select" }, providers: [{ provide: MatFormFieldControl, useExisting: MtxSelect }], queries: [{ propertyName: "optionTemplate", first: true, predicate: MtxSelectOptionTemplate, descendants: true, read: TemplateRef }, { propertyName: "optgroupTemplate", first: true, predicate: MtxSelectOptgroupTemplate, descendants: true, read: TemplateRef }, { propertyName: "labelTemplate", first: true, predicate: MtxSelectLabelTemplate, descendants: true, read: TemplateRef }, { propertyName: "multiLabelTemplate", first: true, predicate: MtxSelectMultiLabelTemplate, descendants: true, read: TemplateRef }, { propertyName: "headerTemplate", first: true, predicate: MtxSelectHeaderTemplate, descendants: true, read: TemplateRef }, { propertyName: "footerTemplate", first: true, predicate: MtxSelectFooterTemplate, descendants: true, read: TemplateRef }, { propertyName: "notFoundTemplate", first: true, predicate: MtxSelectNotFoundTemplate, descendants: true, read: TemplateRef }, { propertyName: "typeToSearchTemplate", first: true, predicate: MtxSelectTypeToSearchTemplate, descendants: true, read: TemplateRef }, { propertyName: "loadingTextTemplate", first: true, predicate: MtxSelectLoadingTextTemplate, descendants: true, read: TemplateRef }, { propertyName: "tagTemplate", first: true, predicate: MtxSelectTagTemplate, descendants: true, read: TemplateRef }, { propertyName: "loadingSpinnerTemplate", first: true, predicate: MtxSelectLoadingSpinnerTemplate, descendants: true, read: TemplateRef }, { propertyName: "mtxOptions", predicate: MtxOption, descendants: true }], viewQueries: [{ propertyName: "ngSelect", first: true, predicate: ["ngSelect"], descendants: true, static: true }], exportAs: ["mtxSelect"], usesInheritance: true, ngImport: i0, template: "<ng-select #ngSelect [class.ng-select-invalid]=\"errorState\"\n           [(ngModel)]=\"value\"\n           [ngModelOptions]=\"{standalone: true}\"\n           [placeholder]=\"placeholder\"\n           [items]=\"items\"\n           [addTag]=\"addTag\"\n           [addTagText]=\"addTagText\"\n           [appendTo]=\"appendTo\"\n           [appearance]=\"appearance\"\n           [bindLabel]=\"bindLabel\"\n           [bindValue]=\"bindValue\"\n           [closeOnSelect]=\"closeOnSelect\"\n           [clearAllText]=\"clearAllText\"\n           [clearable]=\"clearable\"\n           [clearOnBackspace]=\"clearOnBackspace\"\n           [dropdownPosition]=\"dropdownPosition\"\n           [groupBy]=\"groupBy\"\n           [groupValue]=\"groupValue\"\n           [hideSelected]=\"hideSelected\"\n           [isOpen]=\"isOpen\"\n           [inputAttrs]=\"inputAttrs\"\n           [loading]=\"loading\"\n           [loadingText]=\"loadingText\"\n           [labelForId]=\"labelForId\"\n           [markFirst]=\"markFirst\"\n           [maxSelectedItems]=\"maxSelectedItems\"\n           [multiple]=\"multiple\"\n           [notFoundText]=\"notFoundText\"\n           [readonly]=\"readonly\"\n           [typeahead]=\"typeahead\"\n           [typeToSearchText]=\"typeToSearchText\"\n           [trackByFn]=\"trackByFn\"\n           [searchable]=\"searchable\"\n           [searchFn]=\"searchFn\"\n           [searchWhileComposing]=\"searchWhileComposing\"\n           [clearSearchOnAdd]=\"clearSearchOnAdd\"\n           [selectableGroup]=\"selectableGroup\"\n           [selectableGroupAsModel]=\"selectableGroupAsModel\"\n           [selectOnTab]=\"selectOnTab\"\n           [tabIndex]=\"tabIndex\"\n           [openOnEnter]=\"openOnEnter\"\n           [minTermLength]=\"minTermLength\"\n           [editableSearchTerm]=\"editableSearchTerm\"\n           [keyDownFn]=\"keyDownFn\"\n           [virtualScroll]=\"virtualScroll\"\n           (blur)=\"blurEvent.emit($event)\"\n           (focus)=\"focusEvent.emit($event)\"\n           (change)=\"changeEvent.emit($event)\"\n           (open)=\"openEvent.emit($event)\"\n           (close)=\"closeEvent.emit($event)\"\n           (search)=\"searchEvent.emit($event)\"\n           (clear)=\"clearEvent.emit($event)\"\n           (add)=\"addEvent.emit($event)\"\n           (remove)=\"removeEvent.emit($event)\"\n           (scroll)=\"scroll.emit($event)\"\n           (scrollToEnd)=\"scrollToEnd.emit($event)\">\n\n  <ng-container *ngIf=\"optionTemplate\">\n    <ng-template ng-option-tmp let-item=\"item\" let-item$=\"item$\" let-index=\"index\"\n                 let-searchTerm=\"searchTerm\">\n      <ng-template [ngTemplateOutlet]=\"optionTemplate\"\n                   [ngTemplateOutletContext]=\"{ item: item, item$: item$, index: index, searchTerm: searchTerm }\">\n      </ng-template>\n    </ng-template>\n  </ng-container>\n\n  <ng-container *ngIf=\"optgroupTemplate\">\n    <ng-template ng-optgroup-tmp let-item=\"item\" let-item$=\"item$\" let-index=\"index\"\n                 let-searchTerm=\"searchTerm\">\n      <ng-template [ngTemplateOutlet]=\"optgroupTemplate\"\n                   [ngTemplateOutletContext]=\"{ item: item, item$: item$, index: index, searchTerm: searchTerm }\">\n      </ng-template>\n    </ng-template>\n  </ng-container>\n\n  <ng-container *ngIf=\"labelTemplate\">\n    <ng-template ng-label-tmp let-item=\"item\" let-clear=\"clear\" let-label=\"label\">\n      <ng-template [ngTemplateOutlet]=\"labelTemplate\"\n                   [ngTemplateOutletContext]=\"{ item: item, clear: clear, label: label }\">\n      </ng-template>\n    </ng-template>\n  </ng-container>\n\n  <ng-container *ngIf=\"multiLabelTemplate\">\n    <ng-template ng-multi-label-tmp let-items=\"items\" let-clear=\"clear\">\n      <ng-template [ngTemplateOutlet]=\"multiLabelTemplate\"\n                   [ngTemplateOutletContext]=\"{ items: items, clear: clear }\">\n      </ng-template>\n    </ng-template>\n  </ng-container>\n\n  <ng-container *ngIf=\"headerTemplate\">\n    <ng-template ng-header-tmp>\n      <ng-template [ngTemplateOutlet]=\"headerTemplate\">\n      </ng-template>\n    </ng-template>\n  </ng-container>\n\n  <ng-container *ngIf=\"footerTemplate\">\n    <ng-template ng-footer-tmp>\n      <ng-template [ngTemplateOutlet]=\"footerTemplate\">\n      </ng-template>\n    </ng-template>\n  </ng-container>\n\n  <ng-container *ngIf=\"notFoundTemplate\">\n    <ng-template ng-notfound-tmp let-searchTerm=\"searchTerm\">\n      <ng-template [ngTemplateOutlet]=\"notFoundTemplate\"\n                   [ngTemplateOutletContext]=\"{ searchTerm: searchTerm }\">\n      </ng-template>\n    </ng-template>\n  </ng-container>\n\n  <ng-container *ngIf=\"typeToSearchTemplate\">\n    <ng-template ng-typetosearch-tmp>\n      <ng-template [ngTemplateOutlet]=\"typeToSearchTemplate\">\n      </ng-template>\n    </ng-template>\n  </ng-container>\n\n  <ng-container *ngIf=\"loadingTextTemplate\">\n    <ng-template ng-loadingtext-tmp let-searchTerm=\"searchTerm\">\n      <ng-template [ngTemplateOutlet]=\"loadingTextTemplate\"\n                   [ngTemplateOutletContext]=\"{ searchTerm: searchTerm }\">\n      </ng-template>\n    </ng-template>\n  </ng-container>\n\n  <ng-container *ngIf=\"tagTemplate\">\n    <ng-template ng-tag-tmp let-searchTerm=\"searchTerm\">\n      <ng-template [ngTemplateOutlet]=\"tagTemplate\"\n                   [ngTemplateOutletContext]=\"{ searchTerm: searchTerm }\">\n      </ng-template>\n    </ng-template>\n  </ng-container>\n\n  <ng-container *ngIf=\"loadingSpinnerTemplate\">\n    <ng-template ng-loadingspinner-tmp>\n      <ng-template [ngTemplateOutlet]=\"loadingSpinnerTemplate\">\n      </ng-template>\n    </ng-template>\n  </ng-container>\n\n</ng-select>\n", styles: [".ng-select{padding-right:16px;padding-left:16px;margin-right:-16px;margin-left:-16px}.ng-select .ng-select-container,.ng-select .ng-select-container .ng-value-container{align-items:center}.ng-select .ng-select-container .ng-value-container .ng-input>input{font:inherit;padding:0}.ng-select .ng-placeholder{transition:opacity .2s;opacity:1}.mat-form-field-hide-placeholder .ng-select .ng-placeholder{opacity:0}.ng-select .ng-has-value .ng-placeholder{display:none}.ng-select.ng-select-opened .ng-arrow-wrapper .ng-arrow{top:-2px;border-width:0 5px 5px}.ng-select.ng-select-single.ng-select-filtered .ng-placeholder{display:initial;visibility:hidden}.ng-select.ng-select-single .ng-select-container .ng-value-container .ng-placeholder:after,.ng-select.ng-select-single .ng-select-container .ng-value-container .ng-value:after{display:inline-block;content:\"\"}.ng-select.ng-select-multiple .ng-select-container .ng-value-container{margin:-4px 0}.ng-select.ng-select-multiple .ng-select-container .ng-value-container .ng-value{margin-right:4px;border-radius:16px;font-size:.875em;line-height:18px}[dir=rtl] .ng-select.ng-select-multiple .ng-select-container .ng-value-container .ng-value{margin-right:auto;margin-left:4px}.ng-select.ng-select-multiple .ng-select-container .ng-value-container .ng-value .ng-value-label{display:inline-block;margin:0 8px}.ng-select.ng-select-multiple .ng-select-container .ng-value-container .ng-value .ng-value-icon{display:inline-block;width:18px;height:18px;border-radius:100%;text-align:center}.ng-select.ng-select-multiple .ng-select-container .ng-value-container .ng-value .ng-value-icon.left{margin-right:-4px}[dir=rtl] .ng-select.ng-select-multiple .ng-select-container .ng-value-container .ng-value .ng-value-icon.left{margin-left:-4px;margin-right:auto}.ng-select.ng-select-multiple .ng-select-container .ng-value-container .ng-value .ng-value-icon.right{margin-left:-4px}[dir=rtl] .ng-select.ng-select-multiple .ng-select-container .ng-value-container .ng-value .ng-value-icon.right{margin-right:-4px;margin-left:auto}.ng-select .ng-clear-wrapper{text-align:center}.ng-select .ng-arrow-wrapper{width:18px}.ng-select .ng-arrow-wrapper .ng-arrow{border-width:5px 5px 2px;border-style:solid}.ng-dropdown-panel{left:0}[dir=rtl] .ng-dropdown-panel{right:0;left:auto}.ng-dropdown-panel.ng-select-bottom{top:100%;border-bottom-left-radius:4px;border-bottom-right-radius:4px;box-shadow:0 2px 4px -1px #0003,0 4px 5px #00000024,0 1px 10px #0000001f}.ng-dropdown-panel.ng-select-top{bottom:100%;border-top-left-radius:4px;border-top-right-radius:4px;box-shadow:0 2px 4px -1px #0003,0 4px 5px #00000024,0 1px 10px #0000001f}.ng-dropdown-panel .ng-dropdown-header,.ng-dropdown-panel .ng-dropdown-footer{padding:14px 16px}.ng-dropdown-panel .ng-dropdown-panel-items .ng-optgroup{padding:14px 16px;font-weight:500;-webkit-user-select:none;user-select:none;cursor:pointer}.ng-dropdown-panel .ng-dropdown-panel-items .ng-optgroup.ng-option-disabled{cursor:default}.ng-dropdown-panel .ng-dropdown-panel-items .ng-option{position:relative;padding:14px 16px;text-overflow:ellipsis;text-decoration:none;text-align:left;white-space:nowrap;overflow:hidden}[dir=rtl] .ng-dropdown-panel .ng-dropdown-panel-items .ng-option{text-align:right}.ng-dropdown-panel .ng-dropdown-panel-items .ng-option.ng-option-child{padding-left:32px}[dir=rtl] .ng-dropdown-panel .ng-dropdown-panel-items .ng-option.ng-option-child{padding-right:32px;padding-left:0}.ng-dropdown-panel .ng-dropdown-panel-items .ng-option .ng-tag-label{padding-right:5px;font-size:80%;font-weight:400}[dir=rtl] .ng-dropdown-panel .ng-dropdown-panel-items .ng-option .ng-tag-label{padding-left:5px;padding-right:0}\n"], dependencies: [{ kind: "directive", type: i4.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i4.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "directive", type: i3.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i3.NgModel, selector: "[ngModel]:not([formControlName]):not([formControl])", inputs: ["name", "disabled", "ngModel", "ngModelOptions"], outputs: ["ngModelChange"], exportAs: ["ngModel"] }, { kind: "component", type: i5.NgSelectComponent, selector: "ng-select", inputs: ["bindLabel", "bindValue", "markFirst", "placeholder", "notFoundText", "typeToSearchText", "addTagText", "loadingText", "clearAllText", "appearance", "dropdownPosition", "appendTo", "loading", "closeOnSelect", "hideSelected", "selectOnTab", "openOnEnter", "maxSelectedItems", "groupBy", "groupValue", "bufferAmount", "virtualScroll", "selectableGroup", "selectableGroupAsModel", "searchFn", "trackByFn", "clearOnBackspace", "labelForId", "inputAttrs", "tabIndex", "readonly", "searchWhileComposing", "minTermLength", "editableSearchTerm", "keyDownFn", "typeahead", "multiple", "addTag", "searchable", "clearable", "isOpen", "items", "compareWith", "clearSearchOnAdd"], outputs: ["blur", "focus", "change", "open", "close", "search", "clear", "add", "remove", "scroll", "scrollToEnd"] }, { kind: "directive", type: i5.NgOptgroupTemplateDirective, selector: "[ng-optgroup-tmp]" }, { kind: "directive", type: i5.NgOptionTemplateDirective, selector: "[ng-option-tmp]" }, { kind: "directive", type: i5.NgLabelTemplateDirective, selector: "[ng-label-tmp]" }, { kind: "directive", type: i5.NgMultiLabelTemplateDirective, selector: "[ng-multi-label-tmp]" }, { kind: "directive", type: i5.NgHeaderTemplateDirective, selector: "[ng-header-tmp]" }, { kind: "directive", type: i5.NgFooterTemplateDirective, selector: "[ng-footer-tmp]" }, { kind: "directive", type: i5.NgNotFoundTemplateDirective, selector: "[ng-notfound-tmp]" }, { kind: "directive", type: i5.NgTypeToSearchTemplateDirective, selector: "[ng-typetosearch-tmp]" }, { kind: "directive", type: i5.NgLoadingTextTemplateDirective, selector: "[ng-loadingtext-tmp]" }, { kind: "directive", type: i5.NgTagTemplateDirective, selector: "[ng-tag-tmp]" }, { kind: "directive", type: i5.NgLoadingSpinnerTemplateDirective, selector: "[ng-loadingspinner-tmp]" }, { kind: "directive", type: i6.MtxSelectOptgroupTemplate, selector: "[ng-optgroup-tmp]" }, { kind: "directive", type: i6.MtxSelectOptionTemplate, selector: "[ng-option-tmp]" }, { kind: "directive", type: i6.MtxSelectLabelTemplate, selector: "[ng-label-tmp]" }, { kind: "directive", type: i6.MtxSelectMultiLabelTemplate, selector: "[ng-multi-label-tmp]" }, { kind: "directive", type: i6.MtxSelectHeaderTemplate, selector: "[ng-header-tmp]" }, { kind: "directive", type: i6.MtxSelectFooterTemplate, selector: "[ng-footer-tmp]" }, { kind: "directive", type: i6.MtxSelectNotFoundTemplate, selector: "[ng-notfound-tmp]" }, { kind: "directive", type: i6.MtxSelectTypeToSearchTemplate, selector: "[ng-typetosearch-tmp]" }, { kind: "directive", type: i6.MtxSelectLoadingTextTemplate, selector: "[ng-loadingtext-tmp]" }, { kind: "directive", type: i6.MtxSelectTagTemplate, selector: "[ng-tag-tmp]" }, { kind: "directive", type: i6.MtxSelectLoadingSpinnerTemplate, selector: "[ng-loadingspinner-tmp]" }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VsZWN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vcHJvamVjdHMvZXh0ZW5zaW9ucy9zZWxlY3Qvc2VsZWN0LnRzIiwiLi4vLi4vLi4vLi4vcHJvamVjdHMvZXh0ZW5zaW9ucy9zZWxlY3Qvc2VsZWN0Lmh0bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0EsT0FBTyxFQUFnQixxQkFBcUIsRUFBRSxNQUFNLHVCQUF1QixDQUFDO0FBQzVFLE9BQU8sRUFFTCx1QkFBdUIsRUFFdkIsU0FBUyxFQUNULFlBQVksRUFDWixlQUFlLEVBR2YsWUFBWSxFQUNaLE1BQU0sRUFDTixLQUFLLEVBR0wsUUFBUSxFQUNSLE1BQU0sRUFFTixJQUFJLEVBQ0osV0FBVyxFQUNYLFNBQVMsRUFDVCxpQkFBaUIsR0FDbEIsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUdMLGFBQWEsRUFDYixlQUFlLEdBQ2hCLE1BQU0sd0JBQXdCLENBQUM7QUFDaEMsT0FBTyxFQU1MLFVBQVUsR0FDWCxNQUFNLGdCQUFnQixDQUFDO0FBQ3hCLE9BQU8sRUFBZ0IsbUJBQW1CLEVBQUUsY0FBYyxFQUFFLE1BQU0sOEJBQThCLENBQUM7QUFDakcsT0FBTyxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDdEMsT0FBTyxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUV0RCxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sVUFBVSxDQUFDO0FBQ3JDLE9BQU8sRUFDTCx1QkFBdUIsRUFDdkIsdUJBQXVCLEVBQ3ZCLHNCQUFzQixFQUN0QiwrQkFBK0IsRUFDL0IsNEJBQTRCLEVBQzVCLDJCQUEyQixFQUMzQix5QkFBeUIsRUFDekIseUJBQXlCLEVBQ3pCLHVCQUF1QixFQUN2QixvQkFBb0IsRUFDcEIsNkJBQTZCLEdBQzlCLE1BQU0sYUFBYSxDQUFDOzs7Ozs7Ozs7QUFZckIsSUFBSSxZQUFZLEdBQUcsQ0FBQyxDQUFDO0FBRXJCLGdEQUFnRDtBQUNoRCxvQkFBb0I7QUFDcEIsTUFBTSxtQkFBbUIsR0FBRyxhQUFhLENBQ3ZDLGVBQWUsQ0FDYjtJQVFFLFlBQ1MseUJBQTRDLEVBQzVDLFdBQW1CLEVBQ25CLGdCQUFvQztJQUMzQzs7OztPQUlHO0lBQ0ksU0FBb0I7UUFScEIsOEJBQXlCLEdBQXpCLHlCQUF5QixDQUFtQjtRQUM1QyxnQkFBVyxHQUFYLFdBQVcsQ0FBUTtRQUNuQixxQkFBZ0IsR0FBaEIsZ0JBQWdCLENBQW9CO1FBTXBDLGNBQVMsR0FBVCxTQUFTLENBQVc7UUFoQjdCOzs7O1dBSUc7UUFDTSxpQkFBWSxHQUFHLElBQUksT0FBTyxFQUFRLENBQUM7SUFZekMsQ0FBQztDQUNMLENBQ0YsQ0FDRixDQUFDO0FBK0JGLE1BQU0sT0FBTyxTQUNYLFNBQVEsbUJBQW1CO0lBMkYzQixJQUNJLGdCQUFnQjtRQUNsQixPQUFPLElBQUksQ0FBQyxpQkFBaUIsSUFBSSxJQUFJLENBQUMsYUFBYSxDQUFDO0lBQ3RELENBQUM7SUFDRCxJQUFJLGdCQUFnQixDQUFDLEtBQUs7UUFDeEIsSUFBSSxDQUFDLGlCQUFpQixHQUFHLEtBQUssQ0FBQztJQUNqQyxDQUFDO0lBR0QsSUFDSSxLQUFLO1FBQ1AsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDO0lBQ3JCLENBQUM7SUFDRCxJQUFJLEtBQUssQ0FBQyxLQUFZO1FBQ3BCLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDO1FBQzFCLElBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDO0lBQ3RCLENBQUM7SUFPRCxtQ0FBbUM7SUFDbkMsSUFDSSxLQUFLO1FBQ1AsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDO0lBQ3JCLENBQUM7SUFDRCxJQUFJLEtBQUssQ0FBQyxRQUFhO1FBQ3JCLElBQUksQ0FBQyxNQUFNLEdBQUcsUUFBUSxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDekIsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUMzQixDQUFDO0lBTUQsZ0NBQWdDO0lBQ2hDLElBQ0ksRUFBRTtRQUNKLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQztJQUNsQixDQUFDO0lBQ0QsSUFBSSxFQUFFLENBQUMsS0FBYTtRQUNsQixJQUFJLENBQUMsR0FBRyxHQUFHLEtBQUssSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDO1FBQzlCLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDM0IsQ0FBQztJQU1ELGlEQUFpRDtJQUNqRCxJQUNJLFdBQVc7UUFDYixPQUFPLElBQUksQ0FBQyxZQUFZLENBQUM7SUFDM0IsQ0FBQztJQUNELElBQUksV0FBVyxDQUFDLEtBQWE7UUFDM0IsSUFBSSxDQUFDLFlBQVksR0FBRyxLQUFLLENBQUM7UUFDMUIsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUMzQixDQUFDO0lBR0QscUNBQXFDO0lBQ3JDLElBQUksT0FBTztRQUNULE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQztJQUN2QixDQUFDO0lBR0Qsc0NBQXNDO0lBQ3RDLElBQUksS0FBSztRQUNQLE9BQU8sSUFBSSxDQUFDLEtBQUssSUFBSSxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sS0FBSyxDQUFDLENBQUMsQ0FBQztJQUN0RixDQUFDO0lBRUQ7OztPQUdHO0lBQ0gsSUFBSSxnQkFBZ0I7UUFDbEIsT0FBTyxJQUFJLENBQUMsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQztJQUNyQyxDQUFDO0lBRUQseUNBQXlDO0lBQ3pDLElBQ0ksUUFBUTtRQUNWLE9BQU8sSUFBSSxDQUFDLFNBQVMsSUFBSSxJQUFJLENBQUMsU0FBUyxFQUFFLE9BQU8sRUFBRSxZQUFZLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEtBQUssQ0FBQztJQUMvRixDQUFDO0lBQ0QsSUFBSSxRQUFRLENBQUMsS0FBYztRQUN6QixJQUFJLENBQUMsU0FBUyxHQUFHLHFCQUFxQixDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzlDLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDM0IsQ0FBQztJQTJCRCxnREFBZ0Q7SUFDaEQsSUFBSSxTQUFTO1FBQ1gsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUM7SUFDaEMsQ0FBQztJQVFELFlBQ1ksa0JBQXFDLEVBQ3JDLFdBQXVCLEVBQ3ZCLGFBQTJCLEVBQ3JDLHlCQUE0QyxFQUNoQyxXQUFtQixFQUNuQixnQkFBb0MsRUFDNUIsU0FBb0IsRUFDTSxnQkFBK0I7UUFFN0UsS0FBSyxDQUFDLHlCQUF5QixFQUFFLFdBQVcsRUFBRSxnQkFBZ0IsRUFBRSxTQUFTLENBQUMsQ0FBQztRQVRqRSx1QkFBa0IsR0FBbEIsa0JBQWtCLENBQW1CO1FBQ3JDLGdCQUFXLEdBQVgsV0FBVyxDQUFZO1FBQ3ZCLGtCQUFhLEdBQWIsYUFBYSxDQUFjO1FBS1MscUJBQWdCLEdBQWhCLGdCQUFnQixDQUFlO1FBN0x0RSxXQUFNLEdBQXVCLEtBQUssQ0FBQztRQUNuQyxlQUFVLEdBQUcsVUFBVSxDQUFDO1FBQ3hCLGVBQVUsR0FBRyxXQUFXLENBQUM7UUFDekIsYUFBUSxHQUFHLE1BQU0sQ0FBQztRQUdsQixrQkFBYSxHQUFHLElBQUksQ0FBQztRQUNyQixpQkFBWSxHQUFHLFdBQVcsQ0FBQztRQUMzQixjQUFTLEdBQUcsSUFBSSxDQUFDO1FBQ2pCLHFCQUFnQixHQUFHLElBQUksQ0FBQztRQUV4QixxQkFBZ0IsR0FBcUIsTUFBTSxDQUFDO1FBRzVDLG9CQUFlLEdBQUcsS0FBSyxDQUFDO1FBQ3hCLDJCQUFzQixHQUFHLElBQUksQ0FBQztRQUM5QixpQkFBWSxHQUFHLEtBQUssQ0FBQztRQUVyQixZQUFPLEdBQUcsS0FBSyxDQUFDO1FBQ2hCLGdCQUFXLEdBQUcsWUFBWSxDQUFDO1FBQzNCLGVBQVUsR0FBa0IsSUFBSSxDQUFDO1FBQ2pDLGNBQVMsR0FBRyxJQUFJLENBQUM7UUFFakIsYUFBUSxHQUFHLEtBQUssQ0FBQztRQUNqQixpQkFBWSxHQUFHLGdCQUFnQixDQUFDO1FBQ2hDLGVBQVUsR0FBRyxJQUFJLENBQUM7UUFDbEIsYUFBUSxHQUFHLEtBQUssQ0FBQztRQUNqQixhQUFRLEdBQW9CLElBQUksQ0FBQztRQUNqQyx5QkFBb0IsR0FBRyxJQUFJLENBQUM7UUFDNUIsZ0JBQVcsR0FBRyxLQUFLLENBQUM7UUFDcEIsY0FBUyxHQUFxQixJQUFJLENBQUM7UUFDbkMsZUFBVSxHQUE4QixFQUFFLENBQUM7UUFHM0Msa0JBQWEsR0FBRyxDQUFDLENBQUM7UUFDbEIsdUJBQWtCLEdBQUcsS0FBSyxDQUFDO1FBQzNCLGNBQVMsR0FBRyxDQUFDLENBQWdCLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQztRQUN2QyxrQkFBYSxHQUFHLEtBQUssQ0FBQztRQUN0QixxQkFBZ0IsR0FBRyxnQkFBZ0IsQ0FBQztRQUc3QixjQUFTLEdBQUcsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUM5QixlQUFVLEdBQUcsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUMvQixnQkFBVyxHQUFHLElBQUksWUFBWSxFQUFFLENBQUM7UUFDbkMsY0FBUyxHQUFHLElBQUksWUFBWSxFQUFFLENBQUM7UUFDOUIsZUFBVSxHQUFHLElBQUksWUFBWSxFQUFFLENBQUM7UUFDL0IsZ0JBQVcsR0FBRyxJQUFJLFlBQVksRUFBa0MsQ0FBQztRQUNsRSxlQUFVLEdBQUcsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUNsQyxhQUFRLEdBQUcsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUMzQixnQkFBVyxHQUFHLElBQUksWUFBWSxFQUFFLENBQUM7UUFDakMsV0FBTSxHQUFHLElBQUksWUFBWSxFQUFrQyxDQUFDO1FBQ3ZELGdCQUFXLEdBQUcsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQW1CaEQsV0FBTSxHQUFVLEVBQUUsQ0FBQztRQUNuQixrQkFBYSxHQUFHLEtBQUssQ0FBQztRQUU5QixpREFBaUQ7UUFDaEMsY0FBUyxHQUFHLElBQUksT0FBTyxFQUFRLENBQUM7UUFZekMsV0FBTSxHQUFHLElBQUksQ0FBQztRQUV0QixrREFBa0Q7UUFDekMsaUJBQVksR0FBa0IsSUFBSSxPQUFPLEVBQVEsQ0FBQztRQWEzRCxpQ0FBaUM7UUFDekIsU0FBSSxHQUFHLGNBQWMsWUFBWSxFQUFFLEVBQUUsQ0FBQztRQWlCdEMsYUFBUSxHQUFHLEtBQUssQ0FBQztRQTZCekIsZ0NBQWdDO1FBQ1gsY0FBUyxHQUFXLEVBQUUsQ0FBQztRQUU1Qyx5RUFBeUU7UUFDL0MsbUJBQWMsR0FBa0IsSUFBSSxDQUFDO1FBRS9ELHNFQUFzRTtRQUN0RSxxQkFBZ0IsR0FBa0IsSUFBSSxDQUFDO1FBRXZDLG9FQUFvRTtRQUNwRSxnQkFBVyxHQUFHLFlBQVksQ0FBQztRQUUzQix5REFBeUQ7UUFDekQsY0FBUyxHQUF5QixHQUFHLEVBQUUsR0FBRSxDQUFDLENBQUM7UUFFM0MsbUVBQW1FO1FBQ25FLGVBQVUsR0FBRyxHQUFHLEVBQUUsR0FBRSxDQUFDLENBQUM7UUFFdEIseURBQXlEO1FBQ3pELGFBQVEsR0FBRyxvQkFBb0IsWUFBWSxFQUFFLEVBQUUsQ0FBQztRQXlCOUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsRUFBRTtZQUMvRCxJQUFJLElBQUksQ0FBQyxRQUFRLElBQUksQ0FBQyxNQUFNLEVBQUU7Z0JBQzVCLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQzthQUNuQjtZQUNELElBQUksQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQztZQUN6QixJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksRUFBRSxDQUFDO1FBQzNCLENBQUMsQ0FBQyxDQUFDO1FBRUgsSUFBSSxJQUFJLENBQUMsU0FBUyxFQUFFO1lBQ2xCLCtEQUErRDtZQUMvRCwyREFBMkQ7WUFDM0QsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDO1NBQ3JDO1FBRUQsMERBQTBEO1FBQzFELDBDQUEwQztRQUMxQyxJQUFJLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUM7SUFDcEIsQ0FBQztJQUVELFFBQVE7UUFDTiw2Q0FBNkM7UUFDN0MscURBQXFEO1FBQ3JELElBQUksSUFBSSxDQUFDLFdBQVcsRUFBRTtZQUNwQixJQUFJLENBQUMsUUFBUSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDO1NBQzlDO0lBQ0gsQ0FBQztJQUVELGVBQWU7UUFDYixJQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRTtZQUN2QixJQUFJLENBQUMsdUJBQXVCLEVBQUUsQ0FBQztTQUNoQztJQUNILENBQUM7SUFFRCxTQUFTO1FBQ1AsTUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQztRQUNqQyxJQUFJLElBQUksQ0FBQyxTQUFTLEVBQUU7WUFDbEIsd0ZBQXdGO1lBQ3hGLElBQUksSUFBSSxDQUFDLGdCQUFnQixLQUFLLFNBQVMsQ0FBQyxPQUFPLEVBQUU7Z0JBQy9DLElBQ0UsSUFBSSxDQUFDLGdCQUFnQixLQUFLLFNBQVM7b0JBQ25DLFNBQVMsQ0FBQyxRQUFRLEtBQUssSUFBSTtvQkFDM0IsU0FBUyxDQUFDLFFBQVEsS0FBSyxJQUFJLENBQUMsUUFBUSxFQUNwQztvQkFDQSxJQUFJLENBQUMsUUFBUSxHQUFHLFNBQVMsQ0FBQyxRQUFRLENBQUM7aUJBQ3BDO2dCQUVELElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxTQUFTLENBQUMsT0FBTyxDQUFDO2FBQzNDO1lBRUQsSUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUM7U0FDekI7SUFDSCxDQUFDO0lBRUQsV0FBVztRQUNULElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDdEIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUMxQixJQUFJLENBQUMsWUFBWSxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQzdCLElBQUksQ0FBQyxhQUFhLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztJQUN0RCxDQUFDO0lBRUQsd0VBQXdFO0lBQ3hFLGtCQUFrQjtRQUNoQixJQUFJLElBQUksQ0FBQyxTQUFTLEVBQUU7WUFDbEIsT0FBTyxJQUFJLENBQUM7U0FDYjtRQUVELE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxVQUFVLEVBQUUsQ0FBQztRQUNwRCxJQUFJLEtBQUssR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsT0FBTyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQztRQUUzRCxJQUFJLElBQUksQ0FBQyxjQUFjLEVBQUU7WUFDdkIsS0FBSyxJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDO1NBQ3BDO1FBRUQsT0FBTyxLQUFLLENBQUM7SUFDZixDQUFDO0lBRUQsa0RBQWtEO0lBQ2xELGlCQUFpQixDQUFDLEdBQWE7UUFDN0IsSUFBSSxDQUFDLGdCQUFnQixHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztJQUM1RCxDQUFDO0lBRUQ7Ozs7O09BS0c7SUFDSCxnQkFBZ0IsQ0FBQyxVQUFtQjtRQUNsQyxJQUFJLENBQUMsUUFBUSxHQUFHLFVBQVUsQ0FBQztRQUMzQixJQUFJLENBQUMsUUFBUSxHQUFHLFVBQVUsQ0FBQztRQUMzQixJQUFJLENBQUMsa0JBQWtCLENBQUMsWUFBWSxFQUFFLENBQUM7UUFDdkMsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUMzQixDQUFDO0lBRUQsa0RBQWtEO0lBQ2xELGdCQUFnQixDQUFDLEtBQWlCO1FBQ2hDLE1BQU0sTUFBTSxHQUFHLEtBQUssQ0FBQyxNQUFxQixDQUFDO1FBQzNDLElBQUksZ0NBQWdDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxhQUFhLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFO1lBQ25GLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUNiLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztTQUNiO0lBQ0gsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ0gsVUFBVSxDQUFDLEtBQVU7UUFDbkIsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7UUFDbkIsSUFBSSxDQUFDLGtCQUFrQixDQUFDLFlBQVksRUFBRSxDQUFDO0lBQ3pDLENBQUM7SUFFRDs7Ozs7O09BTUc7SUFDSCxnQkFBZ0IsQ0FBQyxFQUFPO1FBQ3RCLElBQUksQ0FBQyxTQUFTLEdBQUcsRUFBRSxDQUFDO0lBQ3RCLENBQUM7SUFFRDs7Ozs7O09BTUc7SUFDSCxpQkFBaUIsQ0FBQyxFQUFPO1FBQ3ZCLElBQUksQ0FBQyxVQUFVLEdBQUcsRUFBRSxDQUFDO0lBQ3ZCLENBQUM7SUFFRCwwQ0FBMEM7SUFDbEMsdUJBQXVCO1FBQzdCLE1BQU0sYUFBYSxHQUFHLENBQUMsT0FBNkIsRUFBRSxFQUFFO1lBQ3RELElBQUksQ0FBQyxLQUFLLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUM7Z0JBQ2xDLGNBQWMsRUFBRSxNQUFNLENBQUMsS0FBSztnQkFDNUIsY0FBYyxFQUFFLE1BQU0sQ0FBQyxVQUFVLENBQUMsYUFBYSxDQUFDLFNBQVM7Z0JBQ3pELFFBQVEsRUFBRSxNQUFNLENBQUMsUUFBUTthQUMxQixDQUFDLENBQUMsQ0FBQztZQUNKLElBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDN0MsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsRUFBRTtnQkFDMUIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQzthQUM1QztZQUNELElBQUksQ0FBQyxRQUFRLENBQUMsYUFBYSxFQUFFLENBQUM7UUFDaEMsQ0FBQyxDQUFDO1FBRUYsTUFBTSxrQkFBa0IsR0FBRyxHQUFHLEVBQUU7WUFDOUIsTUFBTSxrQkFBa0IsR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQzFFLEtBQUssQ0FBQyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDO2lCQUN6RCxJQUFJLENBQUMsU0FBUyxDQUFDLGtCQUFrQixDQUFDLENBQUM7aUJBQ25DLFNBQVMsQ0FBQyxNQUFNLENBQUMsRUFBRTtnQkFDbEIsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDNUQsSUFBSSxDQUFDLFFBQVEsR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDO2dCQUNoQyxJQUFJLENBQUMsS0FBSyxHQUFHLE1BQU0sQ0FBQyxLQUFLLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQztnQkFDeEMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxhQUFhLEVBQUUsQ0FBQztZQUNoQyxDQUFDLENBQUMsQ0FBQztRQUNQLENBQUMsQ0FBQztRQUVGLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTzthQUNwQixJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsRUFBRSxTQUFTLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO2FBQzNELFNBQVMsQ0FBQyxPQUFPLENBQUMsRUFBRTtZQUNuQixhQUFhLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDdkIsa0JBQWtCLEVBQUUsQ0FBQztRQUN2QixDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7SUFFRCxJQUFJO1FBQ0YsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUN2QixDQUFDO0lBRUQsS0FBSztRQUNILElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFLENBQUM7SUFDeEIsQ0FBQztJQUVELEtBQUs7UUFDSCxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRSxDQUFDO0lBQ3hCLENBQUM7SUFFRCxJQUFJO1FBQ0YsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUN2QixDQUFDOzt5SEFqYVUsU0FBUyx1UkFvT0UsY0FBYzs2R0FwT3pCLFNBQVMsbzJFQUZULENBQUMsRUFBRSxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsV0FBVyxFQUFFLFNBQVMsRUFBRSxDQUFDLHNFQWV2RCx1QkFBdUIsMkJBQVUsV0FBVyxnRUFFNUMseUJBQXlCLDJCQUFVLFdBQVcsNkRBRTlDLHNCQUFzQiwyQkFBVSxXQUFXLGtFQUUzQywyQkFBMkIsMkJBQVUsV0FBVyw4REFFaEQsdUJBQXVCLDJCQUFVLFdBQVcsOERBRTVDLHVCQUF1QiwyQkFBVSxXQUFXLGdFQUU1Qyx5QkFBeUIsMkJBQVUsV0FBVyxvRUFFOUMsNkJBQTZCLDJCQUFVLFdBQVcsbUVBRWxELDRCQUE0QiwyQkFBVSxXQUFXLDJEQUVqRCxvQkFBb0IsMkJBQVUsV0FBVyxzRUFFekMsK0JBQStCLDJCQUFVLFdBQVcsNkNBR2pELFNBQVMsb05Daks1Qixpb0xBZ0pBOzJGRG5CYSxTQUFTO2tCQTdCckIsU0FBUzsrQkFDRSxZQUFZLFlBQ1osV0FBVyxRQUNmO3dCQUNKLE1BQU0sRUFBRSxVQUFVO3dCQUNsQixtQkFBbUIsRUFBRSxNQUFNO3dCQUMzQixXQUFXLEVBQUUsSUFBSTt3QkFDakIsc0JBQXNCLEVBQUUsV0FBVzt3QkFDbkMsbUJBQW1CLEVBQUUsbUJBQW1CO3dCQUN4Qyx3QkFBd0IsRUFBRSxzQkFBc0I7d0JBQ2hELHlCQUF5QixFQUFFLDBCQUEwQjt3QkFDckQsc0JBQXNCLEVBQUUscUJBQXFCO3dCQUM3QyxzQkFBc0IsRUFBRSxxQkFBcUI7d0JBQzdDLHFCQUFxQixFQUFFLFlBQVk7d0JBQ25DLDZCQUE2QixFQUFFLGtCQUFrQjt3QkFDakQsNkJBQTZCLEVBQUUsVUFBVTt3QkFDekMsNEJBQTRCLEVBQUUsWUFBWTt3QkFDMUMsNkJBQTZCLEVBQUUsVUFBVTt3QkFDekMsMEJBQTBCLEVBQUUsT0FBTzt3QkFDbkMsNkJBQTZCLEVBQUUsVUFBVTt3QkFDekMsT0FBTyxFQUFFLFlBQVk7cUJBQ3RCLFVBR08sQ0FBQyxVQUFVLENBQUMsaUJBQ0wsaUJBQWlCLENBQUMsSUFBSSxtQkFDcEIsdUJBQXVCLENBQUMsTUFBTSxhQUNwQyxDQUFDLEVBQUUsT0FBTyxFQUFFLG1CQUFtQixFQUFFLFdBQVcsV0FBVyxFQUFFLENBQUM7OzBCQW1PbEUsUUFBUTs7MEJBQ1IsUUFBUTs7MEJBQ1IsUUFBUTs7MEJBQUksSUFBSTs7MEJBQ2hCLFFBQVE7OzBCQUFJLE1BQU07MkJBQUMsY0FBYzs0Q0F6TkssUUFBUTtzQkFBaEQsU0FBUzt1QkFBQyxVQUFVLEVBQUUsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFO2dCQUd2QyxjQUFjO3NCQURiLFlBQVk7dUJBQUMsdUJBQXVCLEVBQUUsRUFBRSxJQUFJLEVBQUUsV0FBVyxFQUFFO2dCQUc1RCxnQkFBZ0I7c0JBRGYsWUFBWTt1QkFBQyx5QkFBeUIsRUFBRSxFQUFFLElBQUksRUFBRSxXQUFXLEVBQUU7Z0JBRzlELGFBQWE7c0JBRFosWUFBWTt1QkFBQyxzQkFBc0IsRUFBRSxFQUFFLElBQUksRUFBRSxXQUFXLEVBQUU7Z0JBRzNELGtCQUFrQjtzQkFEakIsWUFBWTt1QkFBQywyQkFBMkIsRUFBRSxFQUFFLElBQUksRUFBRSxXQUFXLEVBQUU7Z0JBR2hFLGNBQWM7c0JBRGIsWUFBWTt1QkFBQyx1QkFBdUIsRUFBRSxFQUFFLElBQUksRUFBRSxXQUFXLEVBQUU7Z0JBRzVELGNBQWM7c0JBRGIsWUFBWTt1QkFBQyx1QkFBdUIsRUFBRSxFQUFFLElBQUksRUFBRSxXQUFXLEVBQUU7Z0JBRzVELGdCQUFnQjtzQkFEZixZQUFZO3VCQUFDLHlCQUF5QixFQUFFLEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBRTtnQkFHOUQsb0JBQW9CO3NCQURuQixZQUFZO3VCQUFDLDZCQUE2QixFQUFFLEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBRTtnQkFHbEUsbUJBQW1CO3NCQURsQixZQUFZO3VCQUFDLDRCQUE0QixFQUFFLEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBRTtnQkFHakUsV0FBVztzQkFEVixZQUFZO3VCQUFDLG9CQUFvQixFQUFFLEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBRTtnQkFHekQsc0JBQXNCO3NCQURyQixZQUFZO3VCQUFDLCtCQUErQixFQUFFLEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBRTtnQkFJcEUsVUFBVTtzQkFEVCxlQUFlO3VCQUFDLFNBQVMsRUFBRSxFQUFFLFdBQVcsRUFBRSxJQUFJLEVBQUU7Z0JBR3hDLE1BQU07c0JBQWQsS0FBSztnQkFDRyxVQUFVO3NCQUFsQixLQUFLO2dCQUNHLFVBQVU7c0JBQWxCLEtBQUs7Z0JBQ0csUUFBUTtzQkFBaEIsS0FBSztnQkFDRyxTQUFTO3NCQUFqQixLQUFLO2dCQUNHLFNBQVM7c0JBQWpCLEtBQUs7Z0JBQ0csYUFBYTtzQkFBckIsS0FBSztnQkFDRyxZQUFZO3NCQUFwQixLQUFLO2dCQUNHLFNBQVM7c0JBQWpCLEtBQUs7Z0JBQ0csZ0JBQWdCO3NCQUF4QixLQUFLO2dCQUNHLFdBQVc7c0JBQW5CLEtBQUs7Z0JBQ0csZ0JBQWdCO3NCQUF4QixLQUFLO2dCQUNHLE9BQU87c0JBQWYsS0FBSztnQkFDRyxVQUFVO3NCQUFsQixLQUFLO2dCQUNHLGVBQWU7c0JBQXZCLEtBQUs7Z0JBQ0csc0JBQXNCO3NCQUE5QixLQUFLO2dCQUNHLFlBQVk7c0JBQXBCLEtBQUs7Z0JBQ0csTUFBTTtzQkFBZCxLQUFLO2dCQUNHLE9BQU87c0JBQWYsS0FBSztnQkFDRyxXQUFXO3NCQUFuQixLQUFLO2dCQUNHLFVBQVU7c0JBQWxCLEtBQUs7Z0JBQ0csU0FBUztzQkFBakIsS0FBSztnQkFDRyxnQkFBZ0I7c0JBQXhCLEtBQUs7Z0JBQ0csUUFBUTtzQkFBaEIsS0FBSztnQkFDRyxZQUFZO3NCQUFwQixLQUFLO2dCQUNHLFVBQVU7c0JBQWxCLEtBQUs7Z0JBQ0csUUFBUTtzQkFBaEIsS0FBSztnQkFDRyxRQUFRO3NCQUFoQixLQUFLO2dCQUNHLG9CQUFvQjtzQkFBNUIsS0FBSztnQkFDRyxXQUFXO3NCQUFuQixLQUFLO2dCQUNHLFNBQVM7c0JBQWpCLEtBQUs7Z0JBQ0csVUFBVTtzQkFBbEIsS0FBSztnQkFDRyxRQUFRO3NCQUFoQixLQUFLO2dCQUNHLFdBQVc7c0JBQW5CLEtBQUs7Z0JBQ0csYUFBYTtzQkFBckIsS0FBSztnQkFDRyxrQkFBa0I7c0JBQTFCLEtBQUs7Z0JBQ0csU0FBUztzQkFBakIsS0FBSztnQkFDRyxhQUFhO3NCQUFyQixLQUFLO2dCQUNHLGdCQUFnQjtzQkFBeEIsS0FBSztnQkFDRyxTQUFTO3NCQUFqQixLQUFLO2dCQUVVLFNBQVM7c0JBQXhCLE1BQU07dUJBQUMsTUFBTTtnQkFDRyxVQUFVO3NCQUExQixNQUFNO3VCQUFDLE9BQU87Z0JBQ0csV0FBVztzQkFBNUIsTUFBTTt1QkFBQyxRQUFRO2dCQUNBLFNBQVM7c0JBQXhCLE1BQU07dUJBQUMsTUFBTTtnQkFDRyxVQUFVO3NCQUExQixNQUFNO3VCQUFDLE9BQU87Z0JBQ0csV0FBVztzQkFBNUIsTUFBTTt1QkFBQyxRQUFRO2dCQUNDLFVBQVU7c0JBQTFCLE1BQU07dUJBQUMsT0FBTztnQkFDQSxRQUFRO3NCQUF0QixNQUFNO3VCQUFDLEtBQUs7Z0JBQ0ssV0FBVztzQkFBNUIsTUFBTTt1QkFBQyxRQUFRO2dCQUNFLE1BQU07c0JBQXZCLE1BQU07dUJBQUMsUUFBUTtnQkFDTyxXQUFXO3NCQUFqQyxNQUFNO3VCQUFDLGFBQWE7Z0JBR2pCLGdCQUFnQjtzQkFEbkIsS0FBSztnQkFVRixLQUFLO3NCQURSLEtBQUs7Z0JBZ0JGLEtBQUs7c0JBRFIsS0FBSztnQkFnQkYsRUFBRTtzQkFETCxLQUFLO2dCQWVGLFdBQVc7c0JBRGQsS0FBSztnQkErQkYsUUFBUTtzQkFEWCxLQUFLO2dCQVdZLGlCQUFpQjtzQkFBbEMsS0FBSztnQkFHZSxTQUFTO3NCQUE3QixLQUFLO3VCQUFDLFlBQVk7Z0JBR08sY0FBYztzQkFBdkMsS0FBSzt1QkFBQyxpQkFBaUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBGb2N1c01vbml0b3IgfSBmcm9tICdAYW5ndWxhci9jZGsvYTExeSc7XG5pbXBvcnQgeyBCb29sZWFuSW5wdXQsIGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSB9IGZyb20gJ0Bhbmd1bGFyL2Nkay9jb2VyY2lvbic7XG5pbXBvcnQge1xuICBBZnRlclZpZXdJbml0LFxuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gIENvbXBvbmVudCxcbiAgQ29udGVudENoaWxkLFxuICBDb250ZW50Q2hpbGRyZW4sXG4gIERvQ2hlY2ssXG4gIEVsZW1lbnRSZWYsXG4gIEV2ZW50RW1pdHRlcixcbiAgSW5qZWN0LFxuICBJbnB1dCxcbiAgT25EZXN0cm95LFxuICBPbkluaXQsXG4gIE9wdGlvbmFsLFxuICBPdXRwdXQsXG4gIFF1ZXJ5TGlzdCxcbiAgU2VsZixcbiAgVGVtcGxhdGVSZWYsXG4gIFZpZXdDaGlsZCxcbiAgVmlld0VuY2Fwc3VsYXRpb24sXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtcbiAgQ2FuRGlzYWJsZSxcbiAgRXJyb3JTdGF0ZU1hdGNoZXIsXG4gIG1peGluRGlzYWJsZWQsXG4gIG1peGluRXJyb3JTdGF0ZSxcbn0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvY29yZSc7XG5pbXBvcnQge1xuICBBYnN0cmFjdENvbnRyb2wsXG4gIENvbnRyb2xWYWx1ZUFjY2Vzc29yLFxuICBGb3JtR3JvdXBEaXJlY3RpdmUsXG4gIE5nQ29udHJvbCxcbiAgTmdGb3JtLFxuICBWYWxpZGF0b3JzLFxufSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQgeyBNYXRGb3JtRmllbGQsIE1hdEZvcm1GaWVsZENvbnRyb2wsIE1BVF9GT1JNX0ZJRUxEIH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvZm9ybS1maWVsZCc7XG5pbXBvcnQgeyBtZXJnZSwgU3ViamVjdCB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgc3RhcnRXaXRoLCB0YWtlVW50aWwgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQgeyBOZ1NlbGVjdENvbXBvbmVudCB9IGZyb20gJ0BuZy1zZWxlY3Qvbmctc2VsZWN0JztcbmltcG9ydCB7IE10eE9wdGlvbiB9IGZyb20gJy4vb3B0aW9uJztcbmltcG9ydCB7XG4gIE10eFNlbGVjdEZvb3RlclRlbXBsYXRlLFxuICBNdHhTZWxlY3RIZWFkZXJUZW1wbGF0ZSxcbiAgTXR4U2VsZWN0TGFiZWxUZW1wbGF0ZSxcbiAgTXR4U2VsZWN0TG9hZGluZ1NwaW5uZXJUZW1wbGF0ZSxcbiAgTXR4U2VsZWN0TG9hZGluZ1RleHRUZW1wbGF0ZSxcbiAgTXR4U2VsZWN0TXVsdGlMYWJlbFRlbXBsYXRlLFxuICBNdHhTZWxlY3ROb3RGb3VuZFRlbXBsYXRlLFxuICBNdHhTZWxlY3RPcHRncm91cFRlbXBsYXRlLFxuICBNdHhTZWxlY3RPcHRpb25UZW1wbGF0ZSxcbiAgTXR4U2VsZWN0VGFnVGVtcGxhdGUsXG4gIE10eFNlbGVjdFR5cGVUb1NlYXJjaFRlbXBsYXRlLFxufSBmcm9tICcuL3RlbXBsYXRlcyc7XG5cbmV4cG9ydCB0eXBlIERyb3Bkb3duUG9zaXRpb24gPSAnYm90dG9tJyB8ICd0b3AnIHwgJ2F1dG8nO1xuZXhwb3J0IHR5cGUgQWRkVGFnRm4gPSAodGVybTogc3RyaW5nKSA9PiBhbnkgfCBQcm9taXNlPGFueT47XG5leHBvcnQgdHlwZSBDb21wYXJlV2l0aEZuID0gKGE6IGFueSwgYjogYW55KSA9PiBib29sZWFuO1xuZXhwb3J0IHR5cGUgR3JvdXBWYWx1ZUZuID0gKFxuICBrZXk6IHN0cmluZyB8IFJlY29yZDxzdHJpbmcsIGFueT4sXG4gIGNoaWxkcmVuOiBhbnlbXVxuKSA9PiBzdHJpbmcgfCBSZWNvcmQ8c3RyaW5nLCBhbnk+O1xuZXhwb3J0IHR5cGUgU2VhcmNoRm4gPSAodGVybTogc3RyaW5nLCBpdGVtOiBhbnkpID0+IGJvb2xlYW47XG5leHBvcnQgdHlwZSBUcmFja0J5Rm4gPSAoaXRlbTogYW55KSA9PiBhbnk7XG5cbmxldCBuZXh0VW5pcXVlSWQgPSAwO1xuXG4vLyBCb2lsZXJwbGF0ZSBmb3IgYXBwbHlpbmcgbWl4aW5zIHRvIE10eFNlbGVjdC5cbi8qKiBAZG9jcy1wcml2YXRlICovXG5jb25zdCBfTXR4U2VsZWN0TWl4aW5CYXNlID0gbWl4aW5EaXNhYmxlZChcbiAgbWl4aW5FcnJvclN0YXRlKFxuICAgIGNsYXNzIHtcbiAgICAgIC8qKlxuICAgICAgICogRW1pdHMgd2hlbmV2ZXIgdGhlIGNvbXBvbmVudCBzdGF0ZSBjaGFuZ2VzIGFuZCBzaG91bGQgY2F1c2UgdGhlIHBhcmVudFxuICAgICAgICogZm9ybS1maWVsZCB0byB1cGRhdGUuIEltcGxlbWVudGVkIGFzIHBhcnQgb2YgYE1hdEZvcm1GaWVsZENvbnRyb2xgLlxuICAgICAgICogQGRvY3MtcHJpdmF0ZVxuICAgICAgICovXG4gICAgICByZWFkb25seSBzdGF0ZUNoYW5nZXMgPSBuZXcgU3ViamVjdDx2b2lkPigpO1xuXG4gICAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgcHVibGljIF9kZWZhdWx0RXJyb3JTdGF0ZU1hdGNoZXI6IEVycm9yU3RhdGVNYXRjaGVyLFxuICAgICAgICBwdWJsaWMgX3BhcmVudEZvcm06IE5nRm9ybSxcbiAgICAgICAgcHVibGljIF9wYXJlbnRGb3JtR3JvdXA6IEZvcm1Hcm91cERpcmVjdGl2ZSxcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEZvcm0gY29udHJvbCBib3VuZCB0byB0aGUgY29tcG9uZW50LlxuICAgICAgICAgKiBJbXBsZW1lbnRlZCBhcyBwYXJ0IG9mIGBNYXRGb3JtRmllbGRDb250cm9sYC5cbiAgICAgICAgICogQGRvY3MtcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgcHVibGljIG5nQ29udHJvbDogTmdDb250cm9sXG4gICAgICApIHt9XG4gICAgfVxuICApXG4pO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdtdHgtc2VsZWN0JyxcbiAgZXhwb3J0QXM6ICdtdHhTZWxlY3QnLFxuICBob3N0OiB7XG4gICAgJ3JvbGUnOiAnY29tYm9ib3gnLFxuICAgICdhcmlhLWF1dG9jb21wbGV0ZSc6ICdub25lJyxcbiAgICAnW2F0dHIuaWRdJzogJ2lkJyxcbiAgICAnW2F0dHIuYXJpYS1leHBhbmRlZF0nOiAncGFuZWxPcGVuJyxcbiAgICAnW2F0dHIuYXJpYS1sYWJlbF0nOiAnYXJpYUxhYmVsIHx8IG51bGwnLFxuICAgICdbYXR0ci5hcmlhLWxhYmVsbGVkYnldJzogJ19nZXRBcmlhTGFiZWxsZWRieSgpJyxcbiAgICAnW2F0dHIuYXJpYS1kZXNjcmliZWRieV0nOiAnX2FyaWFEZXNjcmliZWRieSB8fCBudWxsJyxcbiAgICAnW2F0dHIuYXJpYS1yZXF1aXJlZF0nOiAncmVxdWlyZWQudG9TdHJpbmcoKScsXG4gICAgJ1thdHRyLmFyaWEtZGlzYWJsZWRdJzogJ2Rpc2FibGVkLnRvU3RyaW5nKCknLFxuICAgICdbYXR0ci5hcmlhLWludmFsaWRdJzogJ2Vycm9yU3RhdGUnLFxuICAgICdbY2xhc3MubXR4LXNlbGVjdC1mbG9hdGluZ10nOiAnc2hvdWxkTGFiZWxGbG9hdCcsXG4gICAgJ1tjbGFzcy5tdHgtc2VsZWN0LWRpc2FibGVkXSc6ICdkaXNhYmxlZCcsXG4gICAgJ1tjbGFzcy5tdHgtc2VsZWN0LWludmFsaWRdJzogJ2Vycm9yU3RhdGUnLFxuICAgICdbY2xhc3MubXR4LXNlbGVjdC1yZXF1aXJlZF0nOiAncmVxdWlyZWQnLFxuICAgICdbY2xhc3MubXR4LXNlbGVjdC1lbXB0eV0nOiAnZW1wdHknLFxuICAgICdbY2xhc3MubXR4LXNlbGVjdC1tdWx0aXBsZV0nOiAnbXVsdGlwbGUnLFxuICAgICdjbGFzcyc6ICdtdHgtc2VsZWN0JyxcbiAgfSxcbiAgdGVtcGxhdGVVcmw6ICcuL3NlbGVjdC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJy4vc2VsZWN0LnNjc3MnXSxcbiAgaW5wdXRzOiBbJ2Rpc2FibGVkJ10sXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICBwcm92aWRlcnM6IFt7IHByb3ZpZGU6IE1hdEZvcm1GaWVsZENvbnRyb2wsIHVzZUV4aXN0aW5nOiBNdHhTZWxlY3QgfV0sXG59KVxuZXhwb3J0IGNsYXNzIE10eFNlbGVjdFxuICBleHRlbmRzIF9NdHhTZWxlY3RNaXhpbkJhc2VcbiAgaW1wbGVtZW50c1xuICAgIE9uSW5pdCxcbiAgICBPbkRlc3Ryb3ksXG4gICAgRG9DaGVjayxcbiAgICBBZnRlclZpZXdJbml0LFxuICAgIENvbnRyb2xWYWx1ZUFjY2Vzc29yLFxuICAgIENhbkRpc2FibGUsXG4gICAgTWF0Rm9ybUZpZWxkQ29udHJvbDxhbnk+XG57XG4gIEBWaWV3Q2hpbGQoJ25nU2VsZWN0JywgeyBzdGF0aWM6IHRydWUgfSkgbmdTZWxlY3QhOiBOZ1NlbGVjdENvbXBvbmVudDtcblxuICBAQ29udGVudENoaWxkKE10eFNlbGVjdE9wdGlvblRlbXBsYXRlLCB7IHJlYWQ6IFRlbXBsYXRlUmVmIH0pXG4gIG9wdGlvblRlbXBsYXRlITogVGVtcGxhdGVSZWY8YW55PjtcbiAgQENvbnRlbnRDaGlsZChNdHhTZWxlY3RPcHRncm91cFRlbXBsYXRlLCB7IHJlYWQ6IFRlbXBsYXRlUmVmIH0pXG4gIG9wdGdyb3VwVGVtcGxhdGUhOiBUZW1wbGF0ZVJlZjxhbnk+O1xuICBAQ29udGVudENoaWxkKE10eFNlbGVjdExhYmVsVGVtcGxhdGUsIHsgcmVhZDogVGVtcGxhdGVSZWYgfSlcbiAgbGFiZWxUZW1wbGF0ZSE6IFRlbXBsYXRlUmVmPGFueT47XG4gIEBDb250ZW50Q2hpbGQoTXR4U2VsZWN0TXVsdGlMYWJlbFRlbXBsYXRlLCB7IHJlYWQ6IFRlbXBsYXRlUmVmIH0pXG4gIG11bHRpTGFiZWxUZW1wbGF0ZSE6IFRlbXBsYXRlUmVmPGFueT47XG4gIEBDb250ZW50Q2hpbGQoTXR4U2VsZWN0SGVhZGVyVGVtcGxhdGUsIHsgcmVhZDogVGVtcGxhdGVSZWYgfSlcbiAgaGVhZGVyVGVtcGxhdGUhOiBUZW1wbGF0ZVJlZjxhbnk+O1xuICBAQ29udGVudENoaWxkKE10eFNlbGVjdEZvb3RlclRlbXBsYXRlLCB7IHJlYWQ6IFRlbXBsYXRlUmVmIH0pXG4gIGZvb3RlclRlbXBsYXRlITogVGVtcGxhdGVSZWY8YW55PjtcbiAgQENvbnRlbnRDaGlsZChNdHhTZWxlY3ROb3RGb3VuZFRlbXBsYXRlLCB7IHJlYWQ6IFRlbXBsYXRlUmVmIH0pXG4gIG5vdEZvdW5kVGVtcGxhdGUhOiBUZW1wbGF0ZVJlZjxhbnk+O1xuICBAQ29udGVudENoaWxkKE10eFNlbGVjdFR5cGVUb1NlYXJjaFRlbXBsYXRlLCB7IHJlYWQ6IFRlbXBsYXRlUmVmIH0pXG4gIHR5cGVUb1NlYXJjaFRlbXBsYXRlITogVGVtcGxhdGVSZWY8YW55PjtcbiAgQENvbnRlbnRDaGlsZChNdHhTZWxlY3RMb2FkaW5nVGV4dFRlbXBsYXRlLCB7IHJlYWQ6IFRlbXBsYXRlUmVmIH0pXG4gIGxvYWRpbmdUZXh0VGVtcGxhdGUhOiBUZW1wbGF0ZVJlZjxhbnk+O1xuICBAQ29udGVudENoaWxkKE10eFNlbGVjdFRhZ1RlbXBsYXRlLCB7IHJlYWQ6IFRlbXBsYXRlUmVmIH0pXG4gIHRhZ1RlbXBsYXRlITogVGVtcGxhdGVSZWY8YW55PjtcbiAgQENvbnRlbnRDaGlsZChNdHhTZWxlY3RMb2FkaW5nU3Bpbm5lclRlbXBsYXRlLCB7IHJlYWQ6IFRlbXBsYXRlUmVmIH0pXG4gIGxvYWRpbmdTcGlubmVyVGVtcGxhdGUhOiBUZW1wbGF0ZVJlZjxhbnk+O1xuXG4gIEBDb250ZW50Q2hpbGRyZW4oTXR4T3B0aW9uLCB7IGRlc2NlbmRhbnRzOiB0cnVlIH0pXG4gIG10eE9wdGlvbnMhOiBRdWVyeUxpc3Q8TXR4T3B0aW9uPjtcblxuICBASW5wdXQoKSBhZGRUYWc6IGJvb2xlYW4gfCBBZGRUYWdGbiA9IGZhbHNlO1xuICBASW5wdXQoKSBhZGRUYWdUZXh0ID0gJ0FkZCBpdGVtJztcbiAgQElucHV0KCkgYXBwZWFyYW5jZSA9ICd1bmRlcmxpbmUnO1xuICBASW5wdXQoKSBhcHBlbmRUbyA9ICdib2R5JztcbiAgQElucHV0KCkgYmluZExhYmVsITogc3RyaW5nO1xuICBASW5wdXQoKSBiaW5kVmFsdWUhOiBzdHJpbmc7XG4gIEBJbnB1dCgpIGNsb3NlT25TZWxlY3QgPSB0cnVlO1xuICBASW5wdXQoKSBjbGVhckFsbFRleHQgPSAnQ2xlYXIgYWxsJztcbiAgQElucHV0KCkgY2xlYXJhYmxlID0gdHJ1ZTtcbiAgQElucHV0KCkgY2xlYXJPbkJhY2tzcGFjZSA9IHRydWU7XG4gIEBJbnB1dCgpIGNvbXBhcmVXaXRoITogQ29tcGFyZVdpdGhGbjtcbiAgQElucHV0KCkgZHJvcGRvd25Qb3NpdGlvbjogRHJvcGRvd25Qb3NpdGlvbiA9ICdhdXRvJztcbiAgQElucHV0KCkgZ3JvdXBCeSE6IHN0cmluZyB8ICgoKSA9PiB2b2lkKTtcbiAgQElucHV0KCkgZ3JvdXBWYWx1ZSE6IEdyb3VwVmFsdWVGbjtcbiAgQElucHV0KCkgc2VsZWN0YWJsZUdyb3VwID0gZmFsc2U7XG4gIEBJbnB1dCgpIHNlbGVjdGFibGVHcm91cEFzTW9kZWwgPSB0cnVlO1xuICBASW5wdXQoKSBoaWRlU2VsZWN0ZWQgPSBmYWxzZTtcbiAgQElucHV0KCkgaXNPcGVuITogYm9vbGVhbjtcbiAgQElucHV0KCkgbG9hZGluZyA9IGZhbHNlO1xuICBASW5wdXQoKSBsb2FkaW5nVGV4dCA9ICdMb2FkaW5nLi4uJztcbiAgQElucHV0KCkgbGFiZWxGb3JJZDogc3RyaW5nIHwgbnVsbCA9IG51bGw7XG4gIEBJbnB1dCgpIG1hcmtGaXJzdCA9IHRydWU7XG4gIEBJbnB1dCgpIG1heFNlbGVjdGVkSXRlbXMhOiBudW1iZXI7XG4gIEBJbnB1dCgpIG11bHRpcGxlID0gZmFsc2U7XG4gIEBJbnB1dCgpIG5vdEZvdW5kVGV4dCA9ICdObyBpdGVtcyBmb3VuZCc7XG4gIEBJbnB1dCgpIHNlYXJjaGFibGUgPSB0cnVlO1xuICBASW5wdXQoKSByZWFkb25seSA9IGZhbHNlO1xuICBASW5wdXQoKSBzZWFyY2hGbjogU2VhcmNoRm4gfCBudWxsID0gbnVsbDtcbiAgQElucHV0KCkgc2VhcmNoV2hpbGVDb21wb3NpbmcgPSB0cnVlO1xuICBASW5wdXQoKSBzZWxlY3RPblRhYiA9IGZhbHNlO1xuICBASW5wdXQoKSB0cmFja0J5Rm46IFRyYWNrQnlGbiB8IG51bGwgPSBudWxsO1xuICBASW5wdXQoKSBpbnB1dEF0dHJzOiB7IFtrZXk6IHN0cmluZ106IHN0cmluZyB9ID0ge307XG4gIEBJbnB1dCgpIHRhYkluZGV4ITogbnVtYmVyO1xuICBASW5wdXQoKSBvcGVuT25FbnRlciE6IGJvb2xlYW47XG4gIEBJbnB1dCgpIG1pblRlcm1MZW5ndGggPSAwO1xuICBASW5wdXQoKSBlZGl0YWJsZVNlYXJjaFRlcm0gPSBmYWxzZTtcbiAgQElucHV0KCkga2V5RG93bkZuID0gKF86IEtleWJvYXJkRXZlbnQpID0+IHRydWU7XG4gIEBJbnB1dCgpIHZpcnR1YWxTY3JvbGwgPSBmYWxzZTtcbiAgQElucHV0KCkgdHlwZVRvU2VhcmNoVGV4dCA9ICdUeXBlIHRvIHNlYXJjaCc7XG4gIEBJbnB1dCgpIHR5cGVhaGVhZCE6IFN1YmplY3Q8c3RyaW5nPjtcblxuICBAT3V0cHV0KCdibHVyJykgYmx1ckV2ZW50ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICBAT3V0cHV0KCdmb2N1cycpIGZvY3VzRXZlbnQgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gIEBPdXRwdXQoJ2NoYW5nZScpIGNoYW5nZUV2ZW50ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICBAT3V0cHV0KCdvcGVuJykgb3BlbkV2ZW50ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICBAT3V0cHV0KCdjbG9zZScpIGNsb3NlRXZlbnQgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gIEBPdXRwdXQoJ3NlYXJjaCcpIHNlYXJjaEV2ZW50ID0gbmV3IEV2ZW50RW1pdHRlcjx7IHRlcm06IHN0cmluZzsgaXRlbXM6IGFueVtdIH0+KCk7XG4gIEBPdXRwdXQoJ2NsZWFyJykgY2xlYXJFdmVudCA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgQE91dHB1dCgnYWRkJykgYWRkRXZlbnQgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gIEBPdXRwdXQoJ3JlbW92ZScpIHJlbW92ZUV2ZW50ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICBAT3V0cHV0KCdzY3JvbGwnKSBzY3JvbGwgPSBuZXcgRXZlbnRFbWl0dGVyPHsgc3RhcnQ6IG51bWJlcjsgZW5kOiBudW1iZXIgfT4oKTtcbiAgQE91dHB1dCgnc2Nyb2xsVG9FbmQnKSBzY3JvbGxUb0VuZCA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICBASW5wdXQoKVxuICBnZXQgY2xlYXJTZWFyY2hPbkFkZCgpIHtcbiAgICByZXR1cm4gdGhpcy5fY2xlYXJTZWFyY2hPbkFkZCA/PyB0aGlzLmNsb3NlT25TZWxlY3Q7XG4gIH1cbiAgc2V0IGNsZWFyU2VhcmNoT25BZGQodmFsdWUpIHtcbiAgICB0aGlzLl9jbGVhclNlYXJjaE9uQWRkID0gdmFsdWU7XG4gIH1cbiAgcHJpdmF0ZSBfY2xlYXJTZWFyY2hPbkFkZD86IGJvb2xlYW47XG5cbiAgQElucHV0KClcbiAgZ2V0IGl0ZW1zKCkge1xuICAgIHJldHVybiB0aGlzLl9pdGVtcztcbiAgfVxuICBzZXQgaXRlbXModmFsdWU6IGFueVtdKSB7XG4gICAgdGhpcy5faXRlbXNBcmVVc2VkID0gdHJ1ZTtcbiAgICB0aGlzLl9pdGVtcyA9IHZhbHVlO1xuICB9XG4gIHByaXZhdGUgX2l0ZW1zOiBhbnlbXSA9IFtdO1xuICBwcml2YXRlIF9pdGVtc0FyZVVzZWQgPSBmYWxzZTtcblxuICAvKiogRW1pdHMgd2hlbmV2ZXIgdGhlIGNvbXBvbmVudCBpcyBkZXN0cm95ZWQuICovXG4gIHByaXZhdGUgcmVhZG9ubHkgX2Rlc3Ryb3kkID0gbmV3IFN1YmplY3Q8dm9pZD4oKTtcblxuICAvKiogVmFsdWUgb2YgdGhlIHNlbGVjdCBjb250cm9sLiAqL1xuICBASW5wdXQoKVxuICBnZXQgdmFsdWUoKTogYW55IHtcbiAgICByZXR1cm4gdGhpcy5fdmFsdWU7XG4gIH1cbiAgc2V0IHZhbHVlKG5ld1ZhbHVlOiBhbnkpIHtcbiAgICB0aGlzLl92YWx1ZSA9IG5ld1ZhbHVlO1xuICAgIHRoaXMuX29uQ2hhbmdlKG5ld1ZhbHVlKTtcbiAgICB0aGlzLnN0YXRlQ2hhbmdlcy5uZXh0KCk7XG4gIH1cbiAgcHJpdmF0ZSBfdmFsdWUgPSBudWxsO1xuXG4gIC8qKiBJbXBsZW1lbnRlZCBhcyBwYXJ0IG9mIE1hdEZvcm1GaWVsZENvbnRyb2wuICovXG4gIHJlYWRvbmx5IHN0YXRlQ2hhbmdlczogU3ViamVjdDx2b2lkPiA9IG5ldyBTdWJqZWN0PHZvaWQ+KCk7XG5cbiAgLyoqIFVuaXF1ZSBpZCBvZiB0aGUgZWxlbWVudC4gKi9cbiAgQElucHV0KClcbiAgZ2V0IGlkKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuX2lkO1xuICB9XG4gIHNldCBpZCh2YWx1ZTogc3RyaW5nKSB7XG4gICAgdGhpcy5faWQgPSB2YWx1ZSB8fCB0aGlzLl91aWQ7XG4gICAgdGhpcy5zdGF0ZUNoYW5nZXMubmV4dCgpO1xuICB9XG4gIHByaXZhdGUgX2lkITogc3RyaW5nO1xuXG4gIC8qKiBVbmlxdWUgaWQgZm9yIHRoaXMgc2VsZWN0LiAqL1xuICBwcml2YXRlIF91aWQgPSBgbXR4LXNlbGVjdC0ke25leHRVbmlxdWVJZCsrfWA7XG5cbiAgLyoqIFBsYWNlaG9sZGVyIHRvIGJlIHNob3duIGlmIHZhbHVlIGlzIGVtcHR5LiAqL1xuICBASW5wdXQoKVxuICBnZXQgcGxhY2Vob2xkZXIoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5fcGxhY2Vob2xkZXI7XG4gIH1cbiAgc2V0IHBsYWNlaG9sZGVyKHZhbHVlOiBzdHJpbmcpIHtcbiAgICB0aGlzLl9wbGFjZWhvbGRlciA9IHZhbHVlO1xuICAgIHRoaXMuc3RhdGVDaGFuZ2VzLm5leHQoKTtcbiAgfVxuICBwcml2YXRlIF9wbGFjZWhvbGRlciE6IHN0cmluZztcblxuICAvKiogV2hldGhlciB0aGUgc2VsZWN0IGlzIGZvY3VzZWQuICovXG4gIGdldCBmb2N1c2VkKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9mb2N1c2VkO1xuICB9XG4gIHByaXZhdGUgX2ZvY3VzZWQgPSBmYWxzZTtcblxuICAvKiogV2hldGhlciB0aGUgc2VsZWN0IGhhcyBhIHZhbHVlLiAqL1xuICBnZXQgZW1wdHkoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMudmFsdWUgPT0gbnVsbCB8fCAoQXJyYXkuaXNBcnJheSh0aGlzLnZhbHVlKSAmJiB0aGlzLnZhbHVlLmxlbmd0aCA9PT0gMCk7XG4gIH1cblxuICAvKipcbiAgICogSW1wbGVtZW50ZWQgYXMgcGFydCBvZiBNYXRGb3JtRmllbGRDb250cm9sLlxuICAgKiBAZG9jcy1wcml2YXRlXG4gICAqL1xuICBnZXQgc2hvdWxkTGFiZWxGbG9hdCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5mb2N1c2VkIHx8ICF0aGlzLmVtcHR5O1xuICB9XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGNvbXBvbmVudCBpcyByZXF1aXJlZC4gKi9cbiAgQElucHV0KClcbiAgZ2V0IHJlcXVpcmVkKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9yZXF1aXJlZCA/PyB0aGlzLm5nQ29udHJvbD8uY29udHJvbD8uaGFzVmFsaWRhdG9yKFZhbGlkYXRvcnMucmVxdWlyZWQpID8/IGZhbHNlO1xuICB9XG4gIHNldCByZXF1aXJlZCh2YWx1ZTogYm9vbGVhbikge1xuICAgIHRoaXMuX3JlcXVpcmVkID0gY29lcmNlQm9vbGVhblByb3BlcnR5KHZhbHVlKTtcbiAgICB0aGlzLnN0YXRlQ2hhbmdlcy5uZXh0KCk7XG4gIH1cbiAgcHJpdmF0ZSBfcmVxdWlyZWQ6IGJvb2xlYW4gfCB1bmRlZmluZWQ7XG5cbiAgLyoqIE9iamVjdCB1c2VkIHRvIGNvbnRyb2wgd2hlbiBlcnJvciBtZXNzYWdlcyBhcmUgc2hvd24uICovXG4gIEBJbnB1dCgpIG92ZXJyaWRlIGVycm9yU3RhdGVNYXRjaGVyITogRXJyb3JTdGF0ZU1hdGNoZXI7XG5cbiAgLyoqIEFyaWEgbGFiZWwgb2YgdGhlIHNlbGVjdC4gKi9cbiAgQElucHV0KCdhcmlhLWxhYmVsJykgYXJpYUxhYmVsOiBzdHJpbmcgPSAnJztcblxuICAvKiogSW5wdXQgdGhhdCBjYW4gYmUgdXNlZCB0byBzcGVjaWZ5IHRoZSBgYXJpYS1sYWJlbGxlZGJ5YCBhdHRyaWJ1dGUuICovXG4gIEBJbnB1dCgnYXJpYS1sYWJlbGxlZGJ5JykgYXJpYUxhYmVsbGVkYnk6IHN0cmluZyB8IG51bGwgPSBudWxsO1xuXG4gIC8qKiBUaGUgYXJpYS1kZXNjcmliZWRieSBhdHRyaWJ1dGUgb24gdGhlIHNlbGVjdCBmb3IgaW1wcm92ZWQgYTExeS4gKi9cbiAgX2FyaWFEZXNjcmliZWRieTogc3RyaW5nIHwgbnVsbCA9IG51bGw7XG5cbiAgLyoqIEEgbmFtZSBmb3IgdGhpcyBjb250cm9sIHRoYXQgY2FuIGJlIHVzZWQgYnkgYG1hdC1mb3JtLWZpZWxkYC4gKi9cbiAgY29udHJvbFR5cGUgPSAnbXR4LXNlbGVjdCc7XG5cbiAgLyoqIGBWaWV3IC0+IG1vZGVsIGNhbGxiYWNrIGNhbGxlZCB3aGVuIHZhbHVlIGNoYW5nZXNgICovXG4gIF9vbkNoYW5nZTogKHZhbHVlOiBhbnkpID0+IHZvaWQgPSAoKSA9PiB7fTtcblxuICAvKiogYFZpZXcgLT4gbW9kZWwgY2FsbGJhY2sgY2FsbGVkIHdoZW4gc2VsZWN0IGhhcyBiZWVuIHRvdWNoZWRgICovXG4gIF9vblRvdWNoZWQgPSAoKSA9PiB7fTtcblxuICAvKiogSUQgZm9yIHRoZSBET00gbm9kZSBjb250YWluaW5nIHRoZSBzZWxlY3QncyB2YWx1ZS4gKi9cbiAgX3ZhbHVlSWQgPSBgbXR4LXNlbGVjdC12YWx1ZS0ke25leHRVbmlxdWVJZCsrfWA7XG5cbiAgLyoqIFdoZXRoZXIgb3Igbm90IHRoZSBvdmVybGF5IHBhbmVsIGlzIG9wZW4uICovXG4gIGdldCBwYW5lbE9wZW4oKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuICEhdGhpcy5uZ1NlbGVjdC5pc09wZW47XG4gIH1cblxuICAvKipcbiAgICogS2VlcHMgdHJhY2sgb2YgdGhlIHByZXZpb3VzIGZvcm0gY29udHJvbCBhc3NpZ25lZCB0byB0aGUgc2VsZWN0LlxuICAgKiBVc2VkIHRvIGRldGVjdCBpZiBpdCBoYXMgY2hhbmdlZC5cbiAgICovXG4gIHByaXZhdGUgX3ByZXZpb3VzQ29udHJvbDogQWJzdHJhY3RDb250cm9sIHwgbnVsbCB8IHVuZGVmaW5lZDtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcm90ZWN0ZWQgX2NoYW5nZURldGVjdG9yUmVmOiBDaGFuZ2VEZXRlY3RvclJlZixcbiAgICBwcm90ZWN0ZWQgX2VsZW1lbnRSZWY6IEVsZW1lbnRSZWYsXG4gICAgcHJvdGVjdGVkIF9mb2N1c01vbml0b3I6IEZvY3VzTW9uaXRvcixcbiAgICBfZGVmYXVsdEVycm9yU3RhdGVNYXRjaGVyOiBFcnJvclN0YXRlTWF0Y2hlcixcbiAgICBAT3B0aW9uYWwoKSBfcGFyZW50Rm9ybTogTmdGb3JtLFxuICAgIEBPcHRpb25hbCgpIF9wYXJlbnRGb3JtR3JvdXA6IEZvcm1Hcm91cERpcmVjdGl2ZSxcbiAgICBAT3B0aW9uYWwoKSBAU2VsZigpIG5nQ29udHJvbDogTmdDb250cm9sLFxuICAgIEBPcHRpb25hbCgpIEBJbmplY3QoTUFUX0ZPUk1fRklFTEQpIHByb3RlY3RlZCBfcGFyZW50Rm9ybUZpZWxkPzogTWF0Rm9ybUZpZWxkXG4gICkge1xuICAgIHN1cGVyKF9kZWZhdWx0RXJyb3JTdGF0ZU1hdGNoZXIsIF9wYXJlbnRGb3JtLCBfcGFyZW50Rm9ybUdyb3VwLCBuZ0NvbnRyb2wpO1xuXG4gICAgX2ZvY3VzTW9uaXRvci5tb25pdG9yKHRoaXMuX2VsZW1lbnRSZWYsIHRydWUpLnN1YnNjcmliZShvcmlnaW4gPT4ge1xuICAgICAgaWYgKHRoaXMuX2ZvY3VzZWQgJiYgIW9yaWdpbikge1xuICAgICAgICB0aGlzLl9vblRvdWNoZWQoKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuX2ZvY3VzZWQgPSAhIW9yaWdpbjtcbiAgICAgIHRoaXMuc3RhdGVDaGFuZ2VzLm5leHQoKTtcbiAgICB9KTtcblxuICAgIGlmICh0aGlzLm5nQ29udHJvbCkge1xuICAgICAgLy8gTm90ZTogd2UgcHJvdmlkZSB0aGUgdmFsdWUgYWNjZXNzb3IgdGhyb3VnaCBoZXJlLCBpbnN0ZWFkIG9mXG4gICAgICAvLyB0aGUgYHByb3ZpZGVyc2AgdG8gYXZvaWQgcnVubmluZyBpbnRvIGEgY2lyY3VsYXIgaW1wb3J0LlxuICAgICAgdGhpcy5uZ0NvbnRyb2wudmFsdWVBY2Nlc3NvciA9IHRoaXM7XG4gICAgfVxuXG4gICAgLy8gRm9yY2Ugc2V0dGVyIHRvIGJlIGNhbGxlZCBpbiBjYXNlIGlkIHdhcyBub3Qgc3BlY2lmaWVkLlxuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1zZWxmLWFzc2lnblxuICAgIHRoaXMuaWQgPSB0aGlzLmlkO1xuICB9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgLy8gRml4IGNvbXBhcmVXaXRoIHdhcm5pbmcgb2YgdW5kZWZpbmVkIHZhbHVlXG4gICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL25nLXNlbGVjdC9uZy1zZWxlY3QvaXNzdWVzLzE1MzdcbiAgICBpZiAodGhpcy5jb21wYXJlV2l0aCkge1xuICAgICAgdGhpcy5uZ1NlbGVjdC5jb21wYXJlV2l0aCA9IHRoaXMuY29tcGFyZVdpdGg7XG4gICAgfVxuICB9XG5cbiAgbmdBZnRlclZpZXdJbml0KCkge1xuICAgIGlmICghdGhpcy5faXRlbXNBcmVVc2VkKSB7XG4gICAgICB0aGlzLl9zZXRJdGVtc0Zyb21NdHhPcHRpb25zKCk7XG4gICAgfVxuICB9XG5cbiAgbmdEb0NoZWNrKCk6IHZvaWQge1xuICAgIGNvbnN0IG5nQ29udHJvbCA9IHRoaXMubmdDb250cm9sO1xuICAgIGlmICh0aGlzLm5nQ29udHJvbCkge1xuICAgICAgLy8gVGhlIGRpc2FibGVkIHN0YXRlIG1pZ2h0IGdvIG91dCBvZiBzeW5jIGlmIHRoZSBmb3JtIGdyb3VwIGlzIHN3YXBwZWQgb3V0LiBTZWUgIzE3ODYwLlxuICAgICAgaWYgKHRoaXMuX3ByZXZpb3VzQ29udHJvbCAhPT0gbmdDb250cm9sLmNvbnRyb2wpIHtcbiAgICAgICAgaWYgKFxuICAgICAgICAgIHRoaXMuX3ByZXZpb3VzQ29udHJvbCAhPT0gdW5kZWZpbmVkICYmXG4gICAgICAgICAgbmdDb250cm9sLmRpc2FibGVkICE9PSBudWxsICYmXG4gICAgICAgICAgbmdDb250cm9sLmRpc2FibGVkICE9PSB0aGlzLmRpc2FibGVkXG4gICAgICAgICkge1xuICAgICAgICAgIHRoaXMuZGlzYWJsZWQgPSBuZ0NvbnRyb2wuZGlzYWJsZWQ7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9wcmV2aW91c0NvbnRyb2wgPSBuZ0NvbnRyb2wuY29udHJvbDtcbiAgICAgIH1cblxuICAgICAgdGhpcy51cGRhdGVFcnJvclN0YXRlKCk7XG4gICAgfVxuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgdGhpcy5fZGVzdHJveSQubmV4dCgpO1xuICAgIHRoaXMuX2Rlc3Ryb3kkLmNvbXBsZXRlKCk7XG4gICAgdGhpcy5zdGF0ZUNoYW5nZXMuY29tcGxldGUoKTtcbiAgICB0aGlzLl9mb2N1c01vbml0b3Iuc3RvcE1vbml0b3JpbmcodGhpcy5fZWxlbWVudFJlZik7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgdmFsdWUgZm9yIHRoZSBgYXJpYS1sYWJlbGxlZGJ5YCBhdHRyaWJ1dGUgb2YgdGhlIGlucHV0cy4gKi9cbiAgX2dldEFyaWFMYWJlbGxlZGJ5KCkge1xuICAgIGlmICh0aGlzLmFyaWFMYWJlbCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgY29uc3QgbGFiZWxJZCA9IHRoaXMuX3BhcmVudEZvcm1GaWVsZD8uZ2V0TGFiZWxJZCgpO1xuICAgIGxldCB2YWx1ZSA9IChsYWJlbElkID8gbGFiZWxJZCArICcgJyA6ICcnKSArIHRoaXMuX3ZhbHVlSWQ7XG5cbiAgICBpZiAodGhpcy5hcmlhTGFiZWxsZWRieSkge1xuICAgICAgdmFsdWUgKz0gJyAnICsgdGhpcy5hcmlhTGFiZWxsZWRieTtcbiAgICB9XG5cbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cblxuICAvKiogSW1wbGVtZW50ZWQgYXMgcGFydCBvZiBNYXRGb3JtRmllbGRDb250cm9sLiAqL1xuICBzZXREZXNjcmliZWRCeUlkcyhpZHM6IHN0cmluZ1tdKSB7XG4gICAgdGhpcy5fYXJpYURlc2NyaWJlZGJ5ID0gaWRzLmxlbmd0aCA/IGlkcy5qb2luKCcgJykgOiBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIERpc2FibGVzIHRoZSBzZWxlY3QuIFBhcnQgb2YgdGhlIENvbnRyb2xWYWx1ZUFjY2Vzc29yIGludGVyZmFjZSByZXF1aXJlZFxuICAgKiB0byBpbnRlZ3JhdGUgd2l0aCBBbmd1bGFyJ3MgY29yZSBmb3JtcyBBUEkuXG4gICAqXG4gICAqIEBwYXJhbSBpc0Rpc2FibGVkIFNldHMgd2hldGhlciB0aGUgY29tcG9uZW50IGlzIGRpc2FibGVkLlxuICAgKi9cbiAgc2V0RGlzYWJsZWRTdGF0ZShpc0Rpc2FibGVkOiBib29sZWFuKSB7XG4gICAgdGhpcy5kaXNhYmxlZCA9IGlzRGlzYWJsZWQ7XG4gICAgdGhpcy5yZWFkb25seSA9IGlzRGlzYWJsZWQ7XG4gICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCk7XG4gICAgdGhpcy5zdGF0ZUNoYW5nZXMubmV4dCgpO1xuICB9XG5cbiAgLyoqIEltcGxlbWVudGVkIGFzIHBhcnQgb2YgTWF0Rm9ybUZpZWxkQ29udHJvbC4gKi9cbiAgb25Db250YWluZXJDbGljayhldmVudDogTW91c2VFdmVudCkge1xuICAgIGNvbnN0IHRhcmdldCA9IGV2ZW50LnRhcmdldCBhcyBIVE1MRWxlbWVudDtcbiAgICBpZiAoL21hdC1tZGMtZm9ybS1maWVsZHxtdHgtc2VsZWN0L2cudGVzdCh0YXJnZXQucGFyZW50RWxlbWVudD8uY2xhc3NMaXN0WzBdIHx8ICcnKSkge1xuICAgICAgdGhpcy5mb2N1cygpO1xuICAgICAgdGhpcy5vcGVuKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIHNlbGVjdCdzIHZhbHVlLiBQYXJ0IG9mIHRoZSBDb250cm9sVmFsdWVBY2Nlc3NvciBpbnRlcmZhY2VcbiAgICogcmVxdWlyZWQgdG8gaW50ZWdyYXRlIHdpdGggQW5ndWxhcidzIGNvcmUgZm9ybXMgQVBJLlxuICAgKlxuICAgKiBAcGFyYW0gdmFsdWUgTmV3IHZhbHVlIHRvIGJlIHdyaXR0ZW4gdG8gdGhlIG1vZGVsLlxuICAgKi9cbiAgd3JpdGVWYWx1ZSh2YWx1ZTogYW55KTogdm9pZCB7XG4gICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuICAgIHRoaXMuX2NoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNhdmVzIGEgY2FsbGJhY2sgZnVuY3Rpb24gdG8gYmUgaW52b2tlZCB3aGVuIHRoZSBzZWxlY3QncyB2YWx1ZVxuICAgKiBjaGFuZ2VzIGZyb20gdXNlciBpbnB1dC4gUGFydCBvZiB0aGUgQ29udHJvbFZhbHVlQWNjZXNzb3IgaW50ZXJmYWNlXG4gICAqIHJlcXVpcmVkIHRvIGludGVncmF0ZSB3aXRoIEFuZ3VsYXIncyBjb3JlIGZvcm1zIEFQSS5cbiAgICpcbiAgICogQHBhcmFtIGZuIENhbGxiYWNrIHRvIGJlIHRyaWdnZXJlZCB3aGVuIHRoZSB2YWx1ZSBjaGFuZ2VzLlxuICAgKi9cbiAgcmVnaXN0ZXJPbkNoYW5nZShmbjogYW55KTogdm9pZCB7XG4gICAgdGhpcy5fb25DaGFuZ2UgPSBmbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBTYXZlcyBhIGNhbGxiYWNrIGZ1bmN0aW9uIHRvIGJlIGludm9rZWQgd2hlbiB0aGUgc2VsZWN0IGlzIGJsdXJyZWRcbiAgICogYnkgdGhlIHVzZXIuIFBhcnQgb2YgdGhlIENvbnRyb2xWYWx1ZUFjY2Vzc29yIGludGVyZmFjZSByZXF1aXJlZFxuICAgKiB0byBpbnRlZ3JhdGUgd2l0aCBBbmd1bGFyJ3MgY29yZSBmb3JtcyBBUEkuXG4gICAqXG4gICAqIEBwYXJhbSBmbiBDYWxsYmFjayB0byBiZSB0cmlnZ2VyZWQgd2hlbiB0aGUgY29tcG9uZW50IGhhcyBiZWVuIHRvdWNoZWQuXG4gICAqL1xuICByZWdpc3Rlck9uVG91Y2hlZChmbjogYW55KTogdm9pZCB7XG4gICAgdGhpcy5fb25Ub3VjaGVkID0gZm47XG4gIH1cblxuICAvKiogTmdTZWxlY3QncyBgX3NldEl0ZW1zRnJvbU5nT3B0aW9uc2AgKi9cbiAgcHJpdmF0ZSBfc2V0SXRlbXNGcm9tTXR4T3B0aW9ucygpIHtcbiAgICBjb25zdCBtYXBNdHhPcHRpb25zID0gKG9wdGlvbnM6IFF1ZXJ5TGlzdDxNdHhPcHRpb24+KSA9PiB7XG4gICAgICB0aGlzLml0ZW1zID0gb3B0aW9ucy5tYXAob3B0aW9uID0+ICh7XG4gICAgICAgICRuZ09wdGlvblZhbHVlOiBvcHRpb24udmFsdWUsXG4gICAgICAgICRuZ09wdGlvbkxhYmVsOiBvcHRpb24uZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmlubmVySFRNTCxcbiAgICAgICAgZGlzYWJsZWQ6IG9wdGlvbi5kaXNhYmxlZCxcbiAgICAgIH0pKTtcbiAgICAgIHRoaXMubmdTZWxlY3QuaXRlbXNMaXN0LnNldEl0ZW1zKHRoaXMuaXRlbXMpO1xuICAgICAgaWYgKHRoaXMubmdTZWxlY3QuaGFzVmFsdWUpIHtcbiAgICAgICAgdGhpcy5uZ1NlbGVjdC5pdGVtc0xpc3QubWFwU2VsZWN0ZWRJdGVtcygpO1xuICAgICAgfVxuICAgICAgdGhpcy5uZ1NlbGVjdC5kZXRlY3RDaGFuZ2VzKCk7XG4gICAgfTtcblxuICAgIGNvbnN0IGhhbmRsZU9wdGlvbkNoYW5nZSA9ICgpID0+IHtcbiAgICAgIGNvbnN0IGNoYW5nZWRPckRlc3Ryb3llZCA9IG1lcmdlKHRoaXMubXR4T3B0aW9ucy5jaGFuZ2VzLCB0aGlzLl9kZXN0cm95JCk7XG4gICAgICBtZXJnZSguLi50aGlzLm10eE9wdGlvbnMubWFwKG9wdGlvbiA9PiBvcHRpb24uc3RhdGVDaGFuZ2UkKSlcbiAgICAgICAgLnBpcGUodGFrZVVudGlsKGNoYW5nZWRPckRlc3Ryb3llZCkpXG4gICAgICAgIC5zdWJzY3JpYmUob3B0aW9uID0+IHtcbiAgICAgICAgICBjb25zdCBpdGVtID0gdGhpcy5uZ1NlbGVjdC5pdGVtc0xpc3QuZmluZEl0ZW0ob3B0aW9uLnZhbHVlKTtcbiAgICAgICAgICBpdGVtLmRpc2FibGVkID0gb3B0aW9uLmRpc2FibGVkO1xuICAgICAgICAgIGl0ZW0ubGFiZWwgPSBvcHRpb24ubGFiZWwgfHwgaXRlbS5sYWJlbDtcbiAgICAgICAgICB0aGlzLm5nU2VsZWN0LmRldGVjdENoYW5nZXMoKTtcbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIHRoaXMubXR4T3B0aW9ucy5jaGFuZ2VzXG4gICAgICAucGlwZShzdGFydFdpdGgodGhpcy5tdHhPcHRpb25zKSwgdGFrZVVudGlsKHRoaXMuX2Rlc3Ryb3kkKSlcbiAgICAgIC5zdWJzY3JpYmUob3B0aW9ucyA9PiB7XG4gICAgICAgIG1hcE10eE9wdGlvbnMob3B0aW9ucyk7XG4gICAgICAgIGhhbmRsZU9wdGlvbkNoYW5nZSgpO1xuICAgICAgfSk7XG4gIH1cblxuICBvcGVuKCkge1xuICAgIHRoaXMubmdTZWxlY3Qub3BlbigpO1xuICB9XG5cbiAgY2xvc2UoKSB7XG4gICAgdGhpcy5uZ1NlbGVjdC5jbG9zZSgpO1xuICB9XG5cbiAgZm9jdXMoKSB7XG4gICAgdGhpcy5uZ1NlbGVjdC5mb2N1cygpO1xuICB9XG5cbiAgYmx1cigpIHtcbiAgICB0aGlzLm5nU2VsZWN0LmJsdXIoKTtcbiAgfVxuXG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9yZXF1aXJlZDogQm9vbGVhbklucHV0O1xuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfZGlzYWJsZWQ6IEJvb2xlYW5JbnB1dDtcbn1cbiIsIjxuZy1zZWxlY3QgI25nU2VsZWN0IFtjbGFzcy5uZy1zZWxlY3QtaW52YWxpZF09XCJlcnJvclN0YXRlXCJcbiAgICAgICAgICAgWyhuZ01vZGVsKV09XCJ2YWx1ZVwiXG4gICAgICAgICAgIFtuZ01vZGVsT3B0aW9uc109XCJ7c3RhbmRhbG9uZTogdHJ1ZX1cIlxuICAgICAgICAgICBbcGxhY2Vob2xkZXJdPVwicGxhY2Vob2xkZXJcIlxuICAgICAgICAgICBbaXRlbXNdPVwiaXRlbXNcIlxuICAgICAgICAgICBbYWRkVGFnXT1cImFkZFRhZ1wiXG4gICAgICAgICAgIFthZGRUYWdUZXh0XT1cImFkZFRhZ1RleHRcIlxuICAgICAgICAgICBbYXBwZW5kVG9dPVwiYXBwZW5kVG9cIlxuICAgICAgICAgICBbYXBwZWFyYW5jZV09XCJhcHBlYXJhbmNlXCJcbiAgICAgICAgICAgW2JpbmRMYWJlbF09XCJiaW5kTGFiZWxcIlxuICAgICAgICAgICBbYmluZFZhbHVlXT1cImJpbmRWYWx1ZVwiXG4gICAgICAgICAgIFtjbG9zZU9uU2VsZWN0XT1cImNsb3NlT25TZWxlY3RcIlxuICAgICAgICAgICBbY2xlYXJBbGxUZXh0XT1cImNsZWFyQWxsVGV4dFwiXG4gICAgICAgICAgIFtjbGVhcmFibGVdPVwiY2xlYXJhYmxlXCJcbiAgICAgICAgICAgW2NsZWFyT25CYWNrc3BhY2VdPVwiY2xlYXJPbkJhY2tzcGFjZVwiXG4gICAgICAgICAgIFtkcm9wZG93blBvc2l0aW9uXT1cImRyb3Bkb3duUG9zaXRpb25cIlxuICAgICAgICAgICBbZ3JvdXBCeV09XCJncm91cEJ5XCJcbiAgICAgICAgICAgW2dyb3VwVmFsdWVdPVwiZ3JvdXBWYWx1ZVwiXG4gICAgICAgICAgIFtoaWRlU2VsZWN0ZWRdPVwiaGlkZVNlbGVjdGVkXCJcbiAgICAgICAgICAgW2lzT3Blbl09XCJpc09wZW5cIlxuICAgICAgICAgICBbaW5wdXRBdHRyc109XCJpbnB1dEF0dHJzXCJcbiAgICAgICAgICAgW2xvYWRpbmddPVwibG9hZGluZ1wiXG4gICAgICAgICAgIFtsb2FkaW5nVGV4dF09XCJsb2FkaW5nVGV4dFwiXG4gICAgICAgICAgIFtsYWJlbEZvcklkXT1cImxhYmVsRm9ySWRcIlxuICAgICAgICAgICBbbWFya0ZpcnN0XT1cIm1hcmtGaXJzdFwiXG4gICAgICAgICAgIFttYXhTZWxlY3RlZEl0ZW1zXT1cIm1heFNlbGVjdGVkSXRlbXNcIlxuICAgICAgICAgICBbbXVsdGlwbGVdPVwibXVsdGlwbGVcIlxuICAgICAgICAgICBbbm90Rm91bmRUZXh0XT1cIm5vdEZvdW5kVGV4dFwiXG4gICAgICAgICAgIFtyZWFkb25seV09XCJyZWFkb25seVwiXG4gICAgICAgICAgIFt0eXBlYWhlYWRdPVwidHlwZWFoZWFkXCJcbiAgICAgICAgICAgW3R5cGVUb1NlYXJjaFRleHRdPVwidHlwZVRvU2VhcmNoVGV4dFwiXG4gICAgICAgICAgIFt0cmFja0J5Rm5dPVwidHJhY2tCeUZuXCJcbiAgICAgICAgICAgW3NlYXJjaGFibGVdPVwic2VhcmNoYWJsZVwiXG4gICAgICAgICAgIFtzZWFyY2hGbl09XCJzZWFyY2hGblwiXG4gICAgICAgICAgIFtzZWFyY2hXaGlsZUNvbXBvc2luZ109XCJzZWFyY2hXaGlsZUNvbXBvc2luZ1wiXG4gICAgICAgICAgIFtjbGVhclNlYXJjaE9uQWRkXT1cImNsZWFyU2VhcmNoT25BZGRcIlxuICAgICAgICAgICBbc2VsZWN0YWJsZUdyb3VwXT1cInNlbGVjdGFibGVHcm91cFwiXG4gICAgICAgICAgIFtzZWxlY3RhYmxlR3JvdXBBc01vZGVsXT1cInNlbGVjdGFibGVHcm91cEFzTW9kZWxcIlxuICAgICAgICAgICBbc2VsZWN0T25UYWJdPVwic2VsZWN0T25UYWJcIlxuICAgICAgICAgICBbdGFiSW5kZXhdPVwidGFiSW5kZXhcIlxuICAgICAgICAgICBbb3Blbk9uRW50ZXJdPVwib3Blbk9uRW50ZXJcIlxuICAgICAgICAgICBbbWluVGVybUxlbmd0aF09XCJtaW5UZXJtTGVuZ3RoXCJcbiAgICAgICAgICAgW2VkaXRhYmxlU2VhcmNoVGVybV09XCJlZGl0YWJsZVNlYXJjaFRlcm1cIlxuICAgICAgICAgICBba2V5RG93bkZuXT1cImtleURvd25GblwiXG4gICAgICAgICAgIFt2aXJ0dWFsU2Nyb2xsXT1cInZpcnR1YWxTY3JvbGxcIlxuICAgICAgICAgICAoYmx1cik9XCJibHVyRXZlbnQuZW1pdCgkZXZlbnQpXCJcbiAgICAgICAgICAgKGZvY3VzKT1cImZvY3VzRXZlbnQuZW1pdCgkZXZlbnQpXCJcbiAgICAgICAgICAgKGNoYW5nZSk9XCJjaGFuZ2VFdmVudC5lbWl0KCRldmVudClcIlxuICAgICAgICAgICAob3Blbik9XCJvcGVuRXZlbnQuZW1pdCgkZXZlbnQpXCJcbiAgICAgICAgICAgKGNsb3NlKT1cImNsb3NlRXZlbnQuZW1pdCgkZXZlbnQpXCJcbiAgICAgICAgICAgKHNlYXJjaCk9XCJzZWFyY2hFdmVudC5lbWl0KCRldmVudClcIlxuICAgICAgICAgICAoY2xlYXIpPVwiY2xlYXJFdmVudC5lbWl0KCRldmVudClcIlxuICAgICAgICAgICAoYWRkKT1cImFkZEV2ZW50LmVtaXQoJGV2ZW50KVwiXG4gICAgICAgICAgIChyZW1vdmUpPVwicmVtb3ZlRXZlbnQuZW1pdCgkZXZlbnQpXCJcbiAgICAgICAgICAgKHNjcm9sbCk9XCJzY3JvbGwuZW1pdCgkZXZlbnQpXCJcbiAgICAgICAgICAgKHNjcm9sbFRvRW5kKT1cInNjcm9sbFRvRW5kLmVtaXQoJGV2ZW50KVwiPlxuXG4gIDxuZy1jb250YWluZXIgKm5nSWY9XCJvcHRpb25UZW1wbGF0ZVwiPlxuICAgIDxuZy10ZW1wbGF0ZSBuZy1vcHRpb24tdG1wIGxldC1pdGVtPVwiaXRlbVwiIGxldC1pdGVtJD1cIml0ZW0kXCIgbGV0LWluZGV4PVwiaW5kZXhcIlxuICAgICAgICAgICAgICAgICBsZXQtc2VhcmNoVGVybT1cInNlYXJjaFRlcm1cIj5cbiAgICAgIDxuZy10ZW1wbGF0ZSBbbmdUZW1wbGF0ZU91dGxldF09XCJvcHRpb25UZW1wbGF0ZVwiXG4gICAgICAgICAgICAgICAgICAgW25nVGVtcGxhdGVPdXRsZXRDb250ZXh0XT1cInsgaXRlbTogaXRlbSwgaXRlbSQ6IGl0ZW0kLCBpbmRleDogaW5kZXgsIHNlYXJjaFRlcm06IHNlYXJjaFRlcm0gfVwiPlxuICAgICAgPC9uZy10ZW1wbGF0ZT5cbiAgICA8L25nLXRlbXBsYXRlPlxuICA8L25nLWNvbnRhaW5lcj5cblxuICA8bmctY29udGFpbmVyICpuZ0lmPVwib3B0Z3JvdXBUZW1wbGF0ZVwiPlxuICAgIDxuZy10ZW1wbGF0ZSBuZy1vcHRncm91cC10bXAgbGV0LWl0ZW09XCJpdGVtXCIgbGV0LWl0ZW0kPVwiaXRlbSRcIiBsZXQtaW5kZXg9XCJpbmRleFwiXG4gICAgICAgICAgICAgICAgIGxldC1zZWFyY2hUZXJtPVwic2VhcmNoVGVybVwiPlxuICAgICAgPG5nLXRlbXBsYXRlIFtuZ1RlbXBsYXRlT3V0bGV0XT1cIm9wdGdyb3VwVGVtcGxhdGVcIlxuICAgICAgICAgICAgICAgICAgIFtuZ1RlbXBsYXRlT3V0bGV0Q29udGV4dF09XCJ7IGl0ZW06IGl0ZW0sIGl0ZW0kOiBpdGVtJCwgaW5kZXg6IGluZGV4LCBzZWFyY2hUZXJtOiBzZWFyY2hUZXJtIH1cIj5cbiAgICAgIDwvbmctdGVtcGxhdGU+XG4gICAgPC9uZy10ZW1wbGF0ZT5cbiAgPC9uZy1jb250YWluZXI+XG5cbiAgPG5nLWNvbnRhaW5lciAqbmdJZj1cImxhYmVsVGVtcGxhdGVcIj5cbiAgICA8bmctdGVtcGxhdGUgbmctbGFiZWwtdG1wIGxldC1pdGVtPVwiaXRlbVwiIGxldC1jbGVhcj1cImNsZWFyXCIgbGV0LWxhYmVsPVwibGFiZWxcIj5cbiAgICAgIDxuZy10ZW1wbGF0ZSBbbmdUZW1wbGF0ZU91dGxldF09XCJsYWJlbFRlbXBsYXRlXCJcbiAgICAgICAgICAgICAgICAgICBbbmdUZW1wbGF0ZU91dGxldENvbnRleHRdPVwieyBpdGVtOiBpdGVtLCBjbGVhcjogY2xlYXIsIGxhYmVsOiBsYWJlbCB9XCI+XG4gICAgICA8L25nLXRlbXBsYXRlPlxuICAgIDwvbmctdGVtcGxhdGU+XG4gIDwvbmctY29udGFpbmVyPlxuXG4gIDxuZy1jb250YWluZXIgKm5nSWY9XCJtdWx0aUxhYmVsVGVtcGxhdGVcIj5cbiAgICA8bmctdGVtcGxhdGUgbmctbXVsdGktbGFiZWwtdG1wIGxldC1pdGVtcz1cIml0ZW1zXCIgbGV0LWNsZWFyPVwiY2xlYXJcIj5cbiAgICAgIDxuZy10ZW1wbGF0ZSBbbmdUZW1wbGF0ZU91dGxldF09XCJtdWx0aUxhYmVsVGVtcGxhdGVcIlxuICAgICAgICAgICAgICAgICAgIFtuZ1RlbXBsYXRlT3V0bGV0Q29udGV4dF09XCJ7IGl0ZW1zOiBpdGVtcywgY2xlYXI6IGNsZWFyIH1cIj5cbiAgICAgIDwvbmctdGVtcGxhdGU+XG4gICAgPC9uZy10ZW1wbGF0ZT5cbiAgPC9uZy1jb250YWluZXI+XG5cbiAgPG5nLWNvbnRhaW5lciAqbmdJZj1cImhlYWRlclRlbXBsYXRlXCI+XG4gICAgPG5nLXRlbXBsYXRlIG5nLWhlYWRlci10bXA+XG4gICAgICA8bmctdGVtcGxhdGUgW25nVGVtcGxhdGVPdXRsZXRdPVwiaGVhZGVyVGVtcGxhdGVcIj5cbiAgICAgIDwvbmctdGVtcGxhdGU+XG4gICAgPC9uZy10ZW1wbGF0ZT5cbiAgPC9uZy1jb250YWluZXI+XG5cbiAgPG5nLWNvbnRhaW5lciAqbmdJZj1cImZvb3RlclRlbXBsYXRlXCI+XG4gICAgPG5nLXRlbXBsYXRlIG5nLWZvb3Rlci10bXA+XG4gICAgICA8bmctdGVtcGxhdGUgW25nVGVtcGxhdGVPdXRsZXRdPVwiZm9vdGVyVGVtcGxhdGVcIj5cbiAgICAgIDwvbmctdGVtcGxhdGU+XG4gICAgPC9uZy10ZW1wbGF0ZT5cbiAgPC9uZy1jb250YWluZXI+XG5cbiAgPG5nLWNvbnRhaW5lciAqbmdJZj1cIm5vdEZvdW5kVGVtcGxhdGVcIj5cbiAgICA8bmctdGVtcGxhdGUgbmctbm90Zm91bmQtdG1wIGxldC1zZWFyY2hUZXJtPVwic2VhcmNoVGVybVwiPlxuICAgICAgPG5nLXRlbXBsYXRlIFtuZ1RlbXBsYXRlT3V0bGV0XT1cIm5vdEZvdW5kVGVtcGxhdGVcIlxuICAgICAgICAgICAgICAgICAgIFtuZ1RlbXBsYXRlT3V0bGV0Q29udGV4dF09XCJ7IHNlYXJjaFRlcm06IHNlYXJjaFRlcm0gfVwiPlxuICAgICAgPC9uZy10ZW1wbGF0ZT5cbiAgICA8L25nLXRlbXBsYXRlPlxuICA8L25nLWNvbnRhaW5lcj5cblxuICA8bmctY29udGFpbmVyICpuZ0lmPVwidHlwZVRvU2VhcmNoVGVtcGxhdGVcIj5cbiAgICA8bmctdGVtcGxhdGUgbmctdHlwZXRvc2VhcmNoLXRtcD5cbiAgICAgIDxuZy10ZW1wbGF0ZSBbbmdUZW1wbGF0ZU91dGxldF09XCJ0eXBlVG9TZWFyY2hUZW1wbGF0ZVwiPlxuICAgICAgPC9uZy10ZW1wbGF0ZT5cbiAgICA8L25nLXRlbXBsYXRlPlxuICA8L25nLWNvbnRhaW5lcj5cblxuICA8bmctY29udGFpbmVyICpuZ0lmPVwibG9hZGluZ1RleHRUZW1wbGF0ZVwiPlxuICAgIDxuZy10ZW1wbGF0ZSBuZy1sb2FkaW5ndGV4dC10bXAgbGV0LXNlYXJjaFRlcm09XCJzZWFyY2hUZXJtXCI+XG4gICAgICA8bmctdGVtcGxhdGUgW25nVGVtcGxhdGVPdXRsZXRdPVwibG9hZGluZ1RleHRUZW1wbGF0ZVwiXG4gICAgICAgICAgICAgICAgICAgW25nVGVtcGxhdGVPdXRsZXRDb250ZXh0XT1cInsgc2VhcmNoVGVybTogc2VhcmNoVGVybSB9XCI+XG4gICAgICA8L25nLXRlbXBsYXRlPlxuICAgIDwvbmctdGVtcGxhdGU+XG4gIDwvbmctY29udGFpbmVyPlxuXG4gIDxuZy1jb250YWluZXIgKm5nSWY9XCJ0YWdUZW1wbGF0ZVwiPlxuICAgIDxuZy10ZW1wbGF0ZSBuZy10YWctdG1wIGxldC1zZWFyY2hUZXJtPVwic2VhcmNoVGVybVwiPlxuICAgICAgPG5nLXRlbXBsYXRlIFtuZ1RlbXBsYXRlT3V0bGV0XT1cInRhZ1RlbXBsYXRlXCJcbiAgICAgICAgICAgICAgICAgICBbbmdUZW1wbGF0ZU91dGxldENvbnRleHRdPVwieyBzZWFyY2hUZXJtOiBzZWFyY2hUZXJtIH1cIj5cbiAgICAgIDwvbmctdGVtcGxhdGU+XG4gICAgPC9uZy10ZW1wbGF0ZT5cbiAgPC9uZy1jb250YWluZXI+XG5cbiAgPG5nLWNvbnRhaW5lciAqbmdJZj1cImxvYWRpbmdTcGlubmVyVGVtcGxhdGVcIj5cbiAgICA8bmctdGVtcGxhdGUgbmctbG9hZGluZ3NwaW5uZXItdG1wPlxuICAgICAgPG5nLXRlbXBsYXRlIFtuZ1RlbXBsYXRlT3V0bGV0XT1cImxvYWRpbmdTcGlubmVyVGVtcGxhdGVcIj5cbiAgICAgIDwvbmctdGVtcGxhdGU+XG4gICAgPC9uZy10ZW1wbGF0ZT5cbiAgPC9uZy1jb250YWluZXI+XG5cbjwvbmctc2VsZWN0PlxuIl19