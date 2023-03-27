import { Directive, TemplateRef, Component, ChangeDetectionStrategy, ElementRef, Input, EventEmitter, ViewEncapsulation, ChangeDetectorRef, Optional, Self, ViewChild, ContentChild, ContentChildren, Output, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { MatFormFieldControl } from '@angular/material/form-field';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { FocusMonitor } from '@angular/cdk/a11y';
import { Subject, merge } from 'rxjs';
import { takeUntil, startWith } from 'rxjs/operators';

class MtxSelectOptionTemplateDirective {
    constructor(template) {
        this.template = template;
    }
}
MtxSelectOptionTemplateDirective.decorators = [
    { type: Directive, args: [{ selector: '[ng-option-tmp]' },] }
];
/** @nocollapse */
MtxSelectOptionTemplateDirective.ctorParameters = () => [
    { type: TemplateRef }
];
class MtxSelectOptgroupTemplateDirective {
    constructor(template) {
        this.template = template;
    }
}
MtxSelectOptgroupTemplateDirective.decorators = [
    { type: Directive, args: [{ selector: '[ng-optgroup-tmp]' },] }
];
/** @nocollapse */
MtxSelectOptgroupTemplateDirective.ctorParameters = () => [
    { type: TemplateRef }
];
class MtxSelectLabelTemplateDirective {
    constructor(template) {
        this.template = template;
    }
}
MtxSelectLabelTemplateDirective.decorators = [
    { type: Directive, args: [{ selector: '[ng-label-tmp]' },] }
];
/** @nocollapse */
MtxSelectLabelTemplateDirective.ctorParameters = () => [
    { type: TemplateRef }
];
class MtxSelectMultiLabelTemplateDirective {
    constructor(template) {
        this.template = template;
    }
}
MtxSelectMultiLabelTemplateDirective.decorators = [
    { type: Directive, args: [{ selector: '[ng-multi-label-tmp]' },] }
];
/** @nocollapse */
MtxSelectMultiLabelTemplateDirective.ctorParameters = () => [
    { type: TemplateRef }
];
class MtxSelectHeaderTemplateDirective {
    constructor(template) {
        this.template = template;
    }
}
MtxSelectHeaderTemplateDirective.decorators = [
    { type: Directive, args: [{ selector: '[ng-header-tmp]' },] }
];
/** @nocollapse */
MtxSelectHeaderTemplateDirective.ctorParameters = () => [
    { type: TemplateRef }
];
class MtxSelectFooterTemplateDirective {
    constructor(template) {
        this.template = template;
    }
}
MtxSelectFooterTemplateDirective.decorators = [
    { type: Directive, args: [{ selector: '[ng-footer-tmp]' },] }
];
/** @nocollapse */
MtxSelectFooterTemplateDirective.ctorParameters = () => [
    { type: TemplateRef }
];
class MtxSelectNotFoundTemplateDirective {
    constructor(template) {
        this.template = template;
    }
}
MtxSelectNotFoundTemplateDirective.decorators = [
    { type: Directive, args: [{ selector: '[ng-notfound-tmp]' },] }
];
/** @nocollapse */
MtxSelectNotFoundTemplateDirective.ctorParameters = () => [
    { type: TemplateRef }
];
class MtxSelectTypeToSearchTemplateDirective {
    constructor(template) {
        this.template = template;
    }
}
MtxSelectTypeToSearchTemplateDirective.decorators = [
    { type: Directive, args: [{ selector: '[ng-typetosearch-tmp]' },] }
];
/** @nocollapse */
MtxSelectTypeToSearchTemplateDirective.ctorParameters = () => [
    { type: TemplateRef }
];
class MtxSelectLoadingTextTemplateDirective {
    constructor(template) {
        this.template = template;
    }
}
MtxSelectLoadingTextTemplateDirective.decorators = [
    { type: Directive, args: [{ selector: '[ng-loadingtext-tmp]' },] }
];
/** @nocollapse */
MtxSelectLoadingTextTemplateDirective.ctorParameters = () => [
    { type: TemplateRef }
];
class MtxSelectTagTemplateDirective {
    constructor(template) {
        this.template = template;
    }
}
MtxSelectTagTemplateDirective.decorators = [
    { type: Directive, args: [{ selector: '[ng-tag-tmp]' },] }
];
/** @nocollapse */
MtxSelectTagTemplateDirective.ctorParameters = () => [
    { type: TemplateRef }
];
class MtxSelectLoadingSpinnerTemplateDirective {
    constructor(template) {
        this.template = template;
    }
}
MtxSelectLoadingSpinnerTemplateDirective.decorators = [
    { type: Directive, args: [{ selector: '[ng-loadingspinner-tmp]' },] }
];
/** @nocollapse */
MtxSelectLoadingSpinnerTemplateDirective.ctorParameters = () => [
    { type: TemplateRef }
];

class MtxOptionComponent {
    constructor(elementRef) {
        this.elementRef = elementRef;
        this.stateChange$ = new Subject();
        this._disabled = false;
    }
    get disabled() {
        return this._disabled;
    }
    set disabled(value) {
        this._disabled = this._isDisabled(value);
    }
    get label() {
        return (this.elementRef.nativeElement.textContent || '').trim();
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
    _isDisabled(value) {
        return value != null && `${value}` !== 'false';
    }
}
MtxOptionComponent.decorators = [
    { type: Component, args: [{
                selector: 'mtx-option',
                exportAs: 'mtxOption',
                changeDetection: ChangeDetectionStrategy.OnPush,
                template: `<ng-content></ng-content>`
            },] }
];
/** @nocollapse */
MtxOptionComponent.ctorParameters = () => [
    { type: ElementRef }
];
MtxOptionComponent.propDecorators = {
    value: [{ type: Input }],
    disabled: [{ type: Input }]
};

function isDefined(value) {
    return value !== undefined && value !== null;
}
let nextUniqueId = 0;
class MtxSelectComponent {
    constructor(_focusMonitor, _elementRef, _changeDetectorRef, ngControl) {
        this._focusMonitor = _focusMonitor;
        this._elementRef = _elementRef;
        this._changeDetectorRef = _changeDetectorRef;
        this.ngControl = ngControl;
        /** MtxSelect options */
        this.addTag = false;
        this.addTagText = 'Add item';
        this.appearance = 'underline';
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
        this._destroy$ = new Subject();
        this._value = null;
        /** Implemented as part of MatFormFieldControl. */
        this.stateChanges = new Subject();
        /** Unique id for this input. */
        this._uid = `mtx-select-${nextUniqueId++}`;
        this._focused = false;
        this._required = false;
        this._disabled = false;
        this.errorState = false;
        /** A name for this control that can be used by `mat-form-field`. */
        this.controlType = 'mtx-select';
        /** `View -> model callback called when value changes` */
        this._onChange = () => { };
        /** `View -> model callback called when select has been touched` */
        this._onTouched = () => { };
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
    get clearSearchOnAdd() {
        return isDefined(this._clearSearchOnAdd) ? this._clearSearchOnAdd : this.closeOnSelect;
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
    /** Whether the input is focused. */
    get focused() {
        return this._focused;
    }
    get empty() {
        return this.value == null || (Array.isArray(this.value) && this.value.length === 0);
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
        this.readonly = this._disabled;
        this.stateChanges.next();
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
        if (this.ngControl) {
            this.errorState = (this.ngControl.invalid && this.ngControl.touched);
            this.stateChanges.next();
        }
    }
    ngOnDestroy() {
        this._destroy$.next();
        this._destroy$.complete();
        this.stateChanges.complete();
        this._focusMonitor.stopMonitoring(this._elementRef);
    }
    /** Implemented as part of MatFormFieldControl. */
    setDescribedByIds(ids) {
        this._ariaDescribedby = ids.join(' ');
    }
    /**
     * Disables the select. Part of the ControlValueAccessor interface required
     * to integrate with Angular's core forms API.
     *
     * @param isDisabled Sets whether the component is disabled.
     */
    setDisabledState(isDisabled) {
        this.disabled = isDisabled;
    }
    /** Implemented as part of MatFormFieldControl. */
    onContainerClick(event) {
        var _a;
        const target = event.target;
        if (/mat-form-field|mtx-select/g.test(((_a = target.parentElement) === null || _a === void 0 ? void 0 : _a.classList[0]) || '')) {
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
    /** NgSelect: _setItemsFromNgOptions */
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
MtxSelectComponent.decorators = [
    { type: Component, args: [{
                selector: 'mtx-select',
                exportAs: 'mtxSelect',
                host: {
                    '[attr.id]': 'id',
                    '[attr.aria-describedby]': '_ariaDescribedby || null',
                    '[class.mtx-select-floating]': 'shouldLabelFloat',
                    '[class.mtx-select-invalid]': 'errorState',
                    'class': 'mtx-select',
                },
                template: "<ng-select #ngSelect [class.ng-select-invalid]=\"errorState\"\n           [(ngModel)]=\"value\"\n           [placeholder]=\"placeholder\"\n           [items]=\"items\"\n           [addTag]=\"addTag\"\n           [addTagText]=\"addTagText\"\n           [appendTo]=\"appendTo\"\n           [appearance]=\"appearance\"\n           [bindLabel]=\"bindLabel\"\n           [bindValue]=\"bindValue\"\n           [closeOnSelect]=\"closeOnSelect\"\n           [clearAllText]=\"clearAllText\"\n           [clearable]=\"clearable\"\n           [clearOnBackspace]=\"clearOnBackspace\"\n           [dropdownPosition]=\"dropdownPosition\"\n           [groupBy]=\"groupBy\"\n           [groupValue]=\"groupValue\"\n           [hideSelected]=\"hideSelected\"\n           [isOpen]=\"isOpen\"\n           [inputAttrs]=\"inputAttrs\"\n           [loading]=\"loading\"\n           [loadingText]=\"loadingText\"\n           [labelForId]=\"labelForId\"\n           [markFirst]=\"markFirst\"\n           [maxSelectedItems]=\"maxSelectedItems\"\n           [multiple]=\"multiple\"\n           [notFoundText]=\"notFoundText\"\n           [readonly]=\"readonly\"\n           [typeahead]=\"typeahead\"\n           [typeToSearchText]=\"typeToSearchText\"\n           [trackByFn]=\"trackByFn\"\n           [searchable]=\"searchable\"\n           [searchFn]=\"searchFn\"\n           [searchWhileComposing]=\"searchWhileComposing\"\n           [clearSearchOnAdd]=\"clearSearchOnAdd\"\n           [selectableGroup]=\"selectableGroup\"\n           [selectableGroupAsModel]=\"selectableGroupAsModel\"\n           [selectOnTab]=\"selectOnTab\"\n           [tabIndex]=\"tabIndex\"\n           [openOnEnter]=\"openOnEnter\"\n           [minTermLength]=\"minTermLength\"\n           [editableSearchTerm]=\"editableSearchTerm\"\n           [keyDownFn]=\"keyDownFn\"\n           [virtualScroll]=\"virtualScroll\"\n           (blur)=\"blurEvent.emit($event)\"\n           (focus)=\"focusEvent.emit($event)\"\n           (change)=\"changeEvent.emit($event)\"\n           (open)=\"openEvent.emit($event)\"\n           (close)=\"closeEvent.emit($event)\"\n           (search)=\"searchEvent.emit($event)\"\n           (clear)=\"clearEvent.emit($event)\"\n           (add)=\"addEvent.emit($event)\"\n           (remove)=\"removeEvent.emit($event)\"\n           (scroll)=\"scroll.emit($event)\"\n           (scrollToEnd)=\"scrollToEnd.emit($event)\">\n\n  <ng-container *ngIf=\"optionTemplate\">\n    <ng-template ng-option-tmp let-item=\"item\" let-item$=\"item$\" let-index=\"index\"\n                 let-searchTerm=\"searchTerm\">\n      <ng-template [ngTemplateOutlet]=\"optionTemplate\"\n                   [ngTemplateOutletContext]=\"{ item: item, item$: item$, index: index, searchTerm: searchTerm }\">\n      </ng-template>\n    </ng-template>\n  </ng-container>\n\n  <ng-container *ngIf=\"optgroupTemplate\">\n    <ng-template ng-optgroup-tmp let-item=\"item\" let-item$=\"item$\" let-index=\"index\"\n                 let-searchTerm=\"searchTerm\">\n      <ng-template [ngTemplateOutlet]=\"optgroupTemplate\"\n                   [ngTemplateOutletContext]=\"{ item: item, item$: item$, index: index, searchTerm: searchTerm }\">\n      </ng-template>\n    </ng-template>\n  </ng-container>\n\n  <ng-container *ngIf=\"labelTemplate\">\n    <ng-template ng-label-tmp let-item=\"item\" let-clear=\"clear\" let-label=\"label\">\n      <ng-template [ngTemplateOutlet]=\"labelTemplate\"\n                   [ngTemplateOutletContext]=\"{ item: item, clear: clear, label: label }\">\n      </ng-template>\n    </ng-template>\n  </ng-container>\n\n  <ng-container *ngIf=\"multiLabelTemplate\">\n    <ng-template ng-multi-label-tmp let-items=\"items\" let-clear=\"clear\">\n      <ng-template [ngTemplateOutlet]=\"multiLabelTemplate\"\n                   [ngTemplateOutletContext]=\"{ items: items, clear: clear }\">\n      </ng-template>\n    </ng-template>\n  </ng-container>\n\n  <ng-container *ngIf=\"headerTemplate\">\n    <ng-template ng-header-tmp>\n      <ng-template [ngTemplateOutlet]=\"headerTemplate\">\n      </ng-template>\n    </ng-template>\n  </ng-container>\n\n  <ng-container *ngIf=\"footerTemplate\">\n    <ng-template ng-footer-tmp>\n      <ng-template [ngTemplateOutlet]=\"footerTemplate\">\n      </ng-template>\n    </ng-template>\n  </ng-container>\n\n  <ng-container *ngIf=\"notFoundTemplate\">\n    <ng-template ng-notfound-tmp let-searchTerm=\"searchTerm\">\n      <ng-template [ngTemplateOutlet]=\"notFoundTemplate\"\n                   [ngTemplateOutletContext]=\"{ searchTerm: searchTerm }\">\n      </ng-template>\n    </ng-template>\n  </ng-container>\n\n  <ng-container *ngIf=\"typeToSearchTemplate\">\n    <ng-template ng-typetosearch-tmp>\n      <ng-template [ngTemplateOutlet]=\"typeToSearchTemplate\">\n      </ng-template>\n    </ng-template>\n  </ng-container>\n\n  <ng-container *ngIf=\"loadingTextTemplate\">\n    <ng-template ng-loadingtext-tmp let-searchTerm=\"searchTerm\">\n      <ng-template [ngTemplateOutlet]=\"loadingTextTemplate\"\n                   [ngTemplateOutletContext]=\"{ searchTerm: searchTerm }\">\n      </ng-template>\n    </ng-template>\n  </ng-container>\n\n  <ng-container *ngIf=\"tagTemplate\">\n    <ng-template ng-tag-tmp let-searchTerm=\"searchTerm\">\n      <ng-template [ngTemplateOutlet]=\"tagTemplate\"\n                   [ngTemplateOutletContext]=\"{ searchTerm: searchTerm }\">\n      </ng-template>\n    </ng-template>\n  </ng-container>\n\n  <ng-container *ngIf=\"loadingSpinnerTemplate\">\n    <ng-template ng-loadingspinner-tmp>\n      <ng-template [ngTemplateOutlet]=\"loadingSpinnerTemplate\">\n      </ng-template>\n    </ng-template>\n  </ng-container>\n\n</ng-select>\n",
                encapsulation: ViewEncapsulation.None,
                changeDetection: ChangeDetectionStrategy.OnPush,
                providers: [{ provide: MatFormFieldControl, useExisting: MtxSelectComponent }],
                styles: [".ng-select{padding-top:calc(.4375em + .84375em);margin-top:calc(-.4375em - .84375em);padding-bottom:.4375em;margin-bottom:-.4375em}.ng-select .ng-select-container,.ng-select .ng-select-container .ng-value-container{align-items:center}.ng-select .ng-select-container .ng-value-container .ng-input>input{font:inherit;padding:0}.mat-form-field-has-label .ng-select .ng-placeholder{transition:opacity .2s;opacity:0}.mat-form-field-has-label .mtx-select-floating .ng-select .ng-placeholder{opacity:1}.ng-select .ng-has-value .ng-placeholder{display:none}.ng-select.ng-select-opened .ng-arrow-wrapper .ng-arrow{top:-2px;border-width:0 5px 5px}.ng-select.ng-select-single.ng-select-filtered .ng-placeholder{display:initial;visibility:hidden}.ng-select.ng-select-single .ng-select-container .ng-value-container .ng-placeholder:after,.ng-select.ng-select-single .ng-select-container .ng-value-container .ng-value:after{display:inline-block;content:\"\"}.ng-select.ng-select-multiple .ng-select-container .ng-value-container{margin:-4px 0}.ng-select.ng-select-multiple .ng-select-container .ng-value-container .ng-value{margin:4px;border-radius:16px;font-size:.875em;line-height:18px}.ng-select.ng-select-multiple .ng-select-container .ng-value-container .ng-value .ng-value-label{display:inline-block;margin:0 8px}.ng-select.ng-select-multiple .ng-select-container .ng-value-container .ng-value .ng-value-icon{display:inline-block;width:18px;height:18px;border-radius:100%;text-align:center}.ng-select.ng-select-multiple .ng-select-container .ng-value-container .ng-value .ng-value-icon.left{margin-right:-4px}[dir=rtl] .ng-select.ng-select-multiple .ng-select-container .ng-value-container .ng-value .ng-value-icon.left{margin-left:-4px;margin-right:auto}.ng-select.ng-select-multiple .ng-select-container .ng-value-container .ng-value .ng-value-icon.right{margin-left:-4px}[dir=rtl] .ng-select.ng-select-multiple .ng-select-container .ng-value-container .ng-value .ng-value-icon.right{margin-right:-4px;margin-left:auto}.ng-select .ng-clear-wrapper{height:18px;text-align:center}.ng-select .ng-arrow-wrapper{width:18px}.ng-select .ng-arrow-wrapper .ng-arrow{border-width:5px 5px 2px;border-style:solid}.ng-dropdown-panel{left:0}[dir=rtl] .ng-dropdown-panel{right:0;left:auto}.ng-dropdown-panel.ng-select-bottom{top:100%;border-bottom-left-radius:4px;border-bottom-right-radius:4px}.ng-dropdown-panel.ng-select-bottom,.ng-dropdown-panel.ng-select-top{box-shadow:0 2px 4px -1px rgba(0,0,0,.2),0 4px 5px 0 rgba(0,0,0,.14),0 1px 10px 0 rgba(0,0,0,.12)}.ng-dropdown-panel.ng-select-top{bottom:100%;border-top-left-radius:4px;border-top-right-radius:4px}.ng-dropdown-panel .ng-dropdown-footer,.ng-dropdown-panel .ng-dropdown-header{padding:14px 16px}.ng-dropdown-panel .ng-dropdown-panel-items .ng-optgroup{height:3em;padding:14px 16px;font-weight:500;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;cursor:pointer}.ng-dropdown-panel .ng-dropdown-panel-items .ng-optgroup.ng-option-disabled{cursor:default}.ng-dropdown-panel .ng-dropdown-panel-items .ng-option{position:relative;padding:14px 16px;text-overflow:ellipsis;text-decoration:none;text-align:left;white-space:nowrap;overflow:hidden}[dir=rtl] .ng-dropdown-panel .ng-dropdown-panel-items .ng-option{text-align:right}.ng-dropdown-panel .ng-dropdown-panel-items .ng-option.ng-option-child{padding-left:32px}[dir=rtl] .ng-dropdown-panel .ng-dropdown-panel-items .ng-option.ng-option-child{padding-right:32px;padding-left:0}.ng-dropdown-panel .ng-dropdown-panel-items .ng-option .ng-tag-label{padding-right:5px;font-size:80%;font-weight:400}[dir=rtl] .ng-dropdown-panel .ng-dropdown-panel-items .ng-option .ng-tag-label{padding-left:5px;padding-right:0}"]
            },] }
];
/** @nocollapse */
MtxSelectComponent.ctorParameters = () => [
    { type: FocusMonitor },
    { type: ElementRef },
    { type: ChangeDetectorRef },
    { type: NgControl, decorators: [{ type: Optional }, { type: Self }] }
];
MtxSelectComponent.propDecorators = {
    ngSelect: [{ type: ViewChild, args: ['ngSelect', { static: true },] }],
    optionTemplate: [{ type: ContentChild, args: [MtxSelectOptionTemplateDirective, { read: TemplateRef },] }],
    optgroupTemplate: [{ type: ContentChild, args: [MtxSelectOptgroupTemplateDirective, { read: TemplateRef },] }],
    labelTemplate: [{ type: ContentChild, args: [MtxSelectLabelTemplateDirective, { read: TemplateRef },] }],
    multiLabelTemplate: [{ type: ContentChild, args: [MtxSelectMultiLabelTemplateDirective, { read: TemplateRef },] }],
    headerTemplate: [{ type: ContentChild, args: [MtxSelectHeaderTemplateDirective, { read: TemplateRef },] }],
    footerTemplate: [{ type: ContentChild, args: [MtxSelectFooterTemplateDirective, { read: TemplateRef },] }],
    notFoundTemplate: [{ type: ContentChild, args: [MtxSelectNotFoundTemplateDirective, { read: TemplateRef },] }],
    typeToSearchTemplate: [{ type: ContentChild, args: [MtxSelectTypeToSearchTemplateDirective, { read: TemplateRef },] }],
    loadingTextTemplate: [{ type: ContentChild, args: [MtxSelectLoadingTextTemplateDirective, { read: TemplateRef },] }],
    tagTemplate: [{ type: ContentChild, args: [MtxSelectTagTemplateDirective, { read: TemplateRef },] }],
    loadingSpinnerTemplate: [{ type: ContentChild, args: [MtxSelectLoadingSpinnerTemplateDirective, { read: TemplateRef },] }],
    mtxOptions: [{ type: ContentChildren, args: [MtxOptionComponent, { descendants: true },] }],
    addTag: [{ type: Input }],
    addTagText: [{ type: Input }],
    appearance: [{ type: Input }],
    appendTo: [{ type: Input }],
    bindLabel: [{ type: Input }],
    bindValue: [{ type: Input }],
    closeOnSelect: [{ type: Input }],
    clearAllText: [{ type: Input }],
    clearable: [{ type: Input }],
    clearOnBackspace: [{ type: Input }],
    compareWith: [{ type: Input }],
    dropdownPosition: [{ type: Input }],
    groupBy: [{ type: Input }],
    groupValue: [{ type: Input }],
    selectableGroup: [{ type: Input }],
    selectableGroupAsModel: [{ type: Input }],
    hideSelected: [{ type: Input }],
    isOpen: [{ type: Input }],
    loading: [{ type: Input }],
    loadingText: [{ type: Input }],
    labelForId: [{ type: Input }],
    markFirst: [{ type: Input }],
    maxSelectedItems: [{ type: Input }],
    multiple: [{ type: Input }],
    notFoundText: [{ type: Input }],
    searchable: [{ type: Input }],
    readonly: [{ type: Input }],
    searchFn: [{ type: Input }],
    searchWhileComposing: [{ type: Input }],
    selectOnTab: [{ type: Input }],
    trackByFn: [{ type: Input }],
    inputAttrs: [{ type: Input }],
    tabIndex: [{ type: Input }],
    openOnEnter: [{ type: Input }],
    minTermLength: [{ type: Input }],
    editableSearchTerm: [{ type: Input }],
    keyDownFn: [{ type: Input }],
    virtualScroll: [{ type: Input }],
    typeToSearchText: [{ type: Input }],
    typeahead: [{ type: Input }],
    blurEvent: [{ type: Output, args: ['blur',] }],
    focusEvent: [{ type: Output, args: ['focus',] }],
    changeEvent: [{ type: Output, args: ['change',] }],
    openEvent: [{ type: Output, args: ['open',] }],
    closeEvent: [{ type: Output, args: ['close',] }],
    searchEvent: [{ type: Output, args: ['search',] }],
    clearEvent: [{ type: Output, args: ['clear',] }],
    addEvent: [{ type: Output, args: ['add',] }],
    removeEvent: [{ type: Output, args: ['remove',] }],
    scroll: [{ type: Output, args: ['scroll',] }],
    scrollToEnd: [{ type: Output, args: ['scrollToEnd',] }],
    clearSearchOnAdd: [{ type: Input }],
    items: [{ type: Input }],
    value: [{ type: Input }],
    id: [{ type: Input }],
    placeholder: [{ type: Input }],
    required: [{ type: Input }],
    disabled: [{ type: Input }]
};

class MtxSelectModule {
}
MtxSelectModule.decorators = [
    { type: NgModule, args: [{
                imports: [CommonModule, FormsModule, ReactiveFormsModule, NgSelectModule],
                exports: [
                    MtxSelectComponent,
                    MtxOptionComponent,
                    MtxSelectOptgroupTemplateDirective,
                    MtxSelectOptionTemplateDirective,
                    MtxSelectLabelTemplateDirective,
                    MtxSelectMultiLabelTemplateDirective,
                    MtxSelectHeaderTemplateDirective,
                    MtxSelectFooterTemplateDirective,
                    MtxSelectNotFoundTemplateDirective,
                    MtxSelectTypeToSearchTemplateDirective,
                    MtxSelectLoadingTextTemplateDirective,
                    MtxSelectTagTemplateDirective,
                    MtxSelectLoadingSpinnerTemplateDirective,
                ],
                declarations: [
                    MtxSelectComponent,
                    MtxOptionComponent,
                    MtxSelectOptgroupTemplateDirective,
                    MtxSelectOptionTemplateDirective,
                    MtxSelectLabelTemplateDirective,
                    MtxSelectMultiLabelTemplateDirective,
                    MtxSelectHeaderTemplateDirective,
                    MtxSelectFooterTemplateDirective,
                    MtxSelectNotFoundTemplateDirective,
                    MtxSelectTypeToSearchTemplateDirective,
                    MtxSelectLoadingTextTemplateDirective,
                    MtxSelectTagTemplateDirective,
                    MtxSelectLoadingSpinnerTemplateDirective,
                ],
            },] }
];

/**
 * Generated bundle index. Do not edit.
 */

export { MtxOptionComponent, MtxSelectComponent, MtxSelectFooterTemplateDirective, MtxSelectHeaderTemplateDirective, MtxSelectLabelTemplateDirective, MtxSelectLoadingSpinnerTemplateDirective, MtxSelectLoadingTextTemplateDirective, MtxSelectModule, MtxSelectMultiLabelTemplateDirective, MtxSelectNotFoundTemplateDirective, MtxSelectOptgroupTemplateDirective, MtxSelectOptionTemplateDirective, MtxSelectTagTemplateDirective, MtxSelectTypeToSearchTemplateDirective, isDefined };
//# sourceMappingURL=mtxSelect.js.map
