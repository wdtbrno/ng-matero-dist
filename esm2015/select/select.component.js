import { Component, ViewEncapsulation, ChangeDetectionStrategy, Input, ElementRef, ChangeDetectorRef, Optional, Self, Output, EventEmitter, TemplateRef, ContentChild, ContentChildren, QueryList, ViewChild, } from '@angular/core';
import { NgControl } from '@angular/forms';
import { MatFormFieldControl } from '@angular/material/form-field';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { FocusMonitor } from '@angular/cdk/a11y';
import { Subject, merge } from 'rxjs';
import { takeUntil, startWith } from 'rxjs/operators';
import { MtxSelectOptionTemplateDirective, MtxSelectLabelTemplateDirective, MtxSelectHeaderTemplateDirective, MtxSelectFooterTemplateDirective, MtxSelectOptgroupTemplateDirective, MtxSelectNotFoundTemplateDirective, MtxSelectTypeToSearchTemplateDirective, MtxSelectLoadingTextTemplateDirective, MtxSelectMultiLabelTemplateDirective, MtxSelectTagTemplateDirective, MtxSelectLoadingSpinnerTemplateDirective, } from './templates.directive';
import { MtxOptionComponent } from './option.component';
import { NgSelectComponent } from '@ng-select/ng-select';
export function isDefined(value) {
    return value !== undefined && value !== null;
}
let nextUniqueId = 0;
export class MtxSelectComponent {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VsZWN0LmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL2V4dGVuc2lvbnMvc2VsZWN0L3NlbGVjdC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUNMLFNBQVMsRUFJVCxpQkFBaUIsRUFDakIsdUJBQXVCLEVBQ3ZCLEtBQUssRUFDTCxVQUFVLEVBQ1YsaUJBQWlCLEVBQ2pCLFFBQVEsRUFDUixJQUFJLEVBQ0osTUFBTSxFQUNOLFlBQVksRUFDWixXQUFXLEVBQ1gsWUFBWSxFQUNaLGVBQWUsRUFDZixTQUFTLEVBRVQsU0FBUyxHQUNWLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBd0IsU0FBUyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDakUsT0FBTyxFQUFFLG1CQUFtQixFQUFFLE1BQU0sOEJBQThCLENBQUM7QUFDbkUsT0FBTyxFQUFnQixxQkFBcUIsRUFBRSxNQUFNLHVCQUF1QixDQUFDO0FBQzVFLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQztBQUNqRCxPQUFPLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUN0QyxPQUFPLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBRXRELE9BQU8sRUFDTCxnQ0FBZ0MsRUFDaEMsK0JBQStCLEVBQy9CLGdDQUFnQyxFQUNoQyxnQ0FBZ0MsRUFDaEMsa0NBQWtDLEVBQ2xDLGtDQUFrQyxFQUNsQyxzQ0FBc0MsRUFDdEMscUNBQXFDLEVBQ3JDLG9DQUFvQyxFQUNwQyw2QkFBNkIsRUFDN0Isd0NBQXdDLEdBQ3pDLE1BQU0sdUJBQXVCLENBQUM7QUFDL0IsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sb0JBQW9CLENBQUM7QUFDeEQsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sc0JBQXNCLENBQUM7QUFTekQsTUFB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QUUsV0FBVyxFQUFFLElBQUksRUFBRTtxQkFJekQsS0FBSzt5QkFDTCxLQUFLO3lCQUNMLEtBQUs7dUJBQ0wsS0FBSzt3QkFDTCxLQUFLO3dCQUNMLEtBQUs7NEJBQ0wsS0FBSzsyQkFDTCxLQUFLO3dCQUNMLEtBQUs7K0JBQ0wsS0FBSzswQkFDTCxLQUFLOytCQUNMLEtBQUs7c0JBQ0wsS0FBSzt5QkFDTCxLQUFLOzhCQUNMLEtBQUs7cUNBQ0wsS0FBSzsyQkFDTCxLQUFLO3FCQUNMLEtBQUs7c0JBQ0wsS0FBSzswQkFDTCxLQUFLO3lCQUNMLEtBQUs7d0JBQ0wsS0FBSzsrQkFDTCxLQUFLO3VCQUNMLEtBQUs7MkJBQ0wsS0FBSzt5QkFDTCxLQUFLO3VCQUNMLEtBQUs7dUJBQ0wsS0FBSzttQ0FDTCxLQUFLOzBCQUNMLEtBQUs7d0JBQ0wsS0FBSzt5QkFDTCxLQUFLO3VCQUNMLEtBQUs7MEJBQ0wsS0FBSzs0QkFDTCxLQUFLO2lDQUNMLEtBQUs7d0JBQ0wsS0FBSzs0QkFDTCxLQUFLOytCQUNMLEtBQUs7d0JBQ0wsS0FBSzt3QkFFTCxNQUFNLFNBQUMsTUFBTTt5QkFDYixNQUFNLFNBQUMsT0FBTzswQkFDZCxNQUFNLFNBQUMsUUFBUTt3QkFDZixNQUFNLFNBQUMsTUFBTTt5QkFDYixNQUFNLFNBQUMsT0FBTzswQkFDZCxNQUFNLFNBQUMsUUFBUTt5QkFDZixNQUFNLFNBQUMsT0FBTzt1QkFDZCxNQUFNLFNBQUMsS0FBSzswQkFDWixNQUFNLFNBQUMsUUFBUTtxQkFDZixNQUFNLFNBQUMsUUFBUTswQkFDZixNQUFNLFNBQUMsYUFBYTsrQkFFcEIsS0FBSztvQkFTTCxLQUFLO29CQWFMLEtBQUs7aUJBZUwsS0FBSzswQkFjTCxLQUFLO3VCQXdCTCxLQUFLO3VCQVVMLEtBQUsiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBDb21wb25lbnQsXG4gIE9uSW5pdCxcbiAgT25EZXN0cm95LFxuICBEb0NoZWNrLFxuICBWaWV3RW5jYXBzdWxhdGlvbixcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIElucHV0LFxuICBFbGVtZW50UmVmLFxuICBDaGFuZ2VEZXRlY3RvclJlZixcbiAgT3B0aW9uYWwsXG4gIFNlbGYsXG4gIE91dHB1dCxcbiAgRXZlbnRFbWl0dGVyLFxuICBUZW1wbGF0ZVJlZixcbiAgQ29udGVudENoaWxkLFxuICBDb250ZW50Q2hpbGRyZW4sXG4gIFF1ZXJ5TGlzdCxcbiAgQWZ0ZXJWaWV3SW5pdCxcbiAgVmlld0NoaWxkLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IENvbnRyb2xWYWx1ZUFjY2Vzc29yLCBOZ0NvbnRyb2wgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQgeyBNYXRGb3JtRmllbGRDb250cm9sIH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvZm9ybS1maWVsZCc7XG5pbXBvcnQgeyBCb29sZWFuSW5wdXQsIGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSB9IGZyb20gJ0Bhbmd1bGFyL2Nkay9jb2VyY2lvbic7XG5pbXBvcnQgeyBGb2N1c01vbml0b3IgfSBmcm9tICdAYW5ndWxhci9jZGsvYTExeSc7XG5pbXBvcnQgeyBTdWJqZWN0LCBtZXJnZSB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgdGFrZVVudGlsLCBzdGFydFdpdGggfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbmltcG9ydCB7XG4gIE10eFNlbGVjdE9wdGlvblRlbXBsYXRlRGlyZWN0aXZlLFxuICBNdHhTZWxlY3RMYWJlbFRlbXBsYXRlRGlyZWN0aXZlLFxuICBNdHhTZWxlY3RIZWFkZXJUZW1wbGF0ZURpcmVjdGl2ZSxcbiAgTXR4U2VsZWN0Rm9vdGVyVGVtcGxhdGVEaXJlY3RpdmUsXG4gIE10eFNlbGVjdE9wdGdyb3VwVGVtcGxhdGVEaXJlY3RpdmUsXG4gIE10eFNlbGVjdE5vdEZvdW5kVGVtcGxhdGVEaXJlY3RpdmUsXG4gIE10eFNlbGVjdFR5cGVUb1NlYXJjaFRlbXBsYXRlRGlyZWN0aXZlLFxuICBNdHhTZWxlY3RMb2FkaW5nVGV4dFRlbXBsYXRlRGlyZWN0aXZlLFxuICBNdHhTZWxlY3RNdWx0aUxhYmVsVGVtcGxhdGVEaXJlY3RpdmUsXG4gIE10eFNlbGVjdFRhZ1RlbXBsYXRlRGlyZWN0aXZlLFxuICBNdHhTZWxlY3RMb2FkaW5nU3Bpbm5lclRlbXBsYXRlRGlyZWN0aXZlLFxufSBmcm9tICcuL3RlbXBsYXRlcy5kaXJlY3RpdmUnO1xuaW1wb3J0IHsgTXR4T3B0aW9uQ29tcG9uZW50IH0gZnJvbSAnLi9vcHRpb24uY29tcG9uZW50JztcbmltcG9ydCB7IE5nU2VsZWN0Q29tcG9uZW50IH0gZnJvbSAnQG5nLXNlbGVjdC9uZy1zZWxlY3QnO1xuXG5leHBvcnQgdHlwZSBEcm9wZG93blBvc2l0aW9uID0gJ2JvdHRvbScgfCAndG9wJyB8ICdhdXRvJztcbmV4cG9ydCB0eXBlIEFkZFRhZ0ZuID0gKHRlcm06IHN0cmluZykgPT4gYW55IHwgUHJvbWlzZTxhbnk+O1xuZXhwb3J0IHR5cGUgQ29tcGFyZVdpdGhGbiA9IChhOiBhbnksIGI6IGFueSkgPT4gYm9vbGVhbjtcbmV4cG9ydCB0eXBlIEdyb3VwVmFsdWVGbiA9IChrZXk6IHN0cmluZyB8IG9iamVjdCwgY2hpbGRyZW46IGFueVtdKSA9PiBzdHJpbmcgfCBvYmplY3Q7XG5leHBvcnQgdHlwZSBTZWFyY2hGbiA9ICh0ZXJtOiBzdHJpbmcsIGl0ZW06IGFueSkgPT4gYm9vbGVhbjtcbmV4cG9ydCB0eXBlIFRyYWNrQnlGbiA9IChpdGVtOiBhbnkpID0+IGFueTtcblxuZXhwb3J0IGZ1bmN0aW9uIGlzRGVmaW5lZCh2YWx1ZTogYW55KSB7XG4gIHJldHVybiB2YWx1ZSAhPT0gdW5kZWZpbmVkICYmIHZhbHVlICE9PSBudWxsO1xufVxuXG5sZXQgbmV4dFVuaXF1ZUlkID0gMDtcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbXR4LXNlbGVjdCcsXG4gIGV4cG9ydEFzOiAnbXR4U2VsZWN0JyxcbiAgaG9zdDoge1xuICAgICdbYXR0ci5pZF0nOiAnaWQnLFxuICAgICdbYXR0ci5hcmlhLWRlc2NyaWJlZGJ5XSc6ICdfYXJpYURlc2NyaWJlZGJ5IHx8IG51bGwnLFxuICAgICdbY2xhc3MubXR4LXNlbGVjdC1mbG9hdGluZ10nOiAnc2hvdWxkTGFiZWxGbG9hdCcsXG4gICAgJ1tjbGFzcy5tdHgtc2VsZWN0LWludmFsaWRdJzogJ2Vycm9yU3RhdGUnLFxuICAgICdjbGFzcyc6ICdtdHgtc2VsZWN0JyxcbiAgfSxcbiAgdGVtcGxhdGVVcmw6ICcuL3NlbGVjdC5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL3NlbGVjdC5jb21wb25lbnQuc2NzcyddLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgcHJvdmlkZXJzOiBbeyBwcm92aWRlOiBNYXRGb3JtRmllbGRDb250cm9sLCB1c2VFeGlzdGluZzogTXR4U2VsZWN0Q29tcG9uZW50IH1dLFxufSlcbmV4cG9ydCBjbGFzcyBNdHhTZWxlY3RDb21wb25lbnRcbiAgaW1wbGVtZW50c1xuICAgIE9uSW5pdCxcbiAgICBPbkRlc3Ryb3ksXG4gICAgRG9DaGVjayxcbiAgICBBZnRlclZpZXdJbml0LFxuICAgIENvbnRyb2xWYWx1ZUFjY2Vzc29yLFxuICAgIE1hdEZvcm1GaWVsZENvbnRyb2w8YW55PiB7XG4gIEBWaWV3Q2hpbGQoJ25nU2VsZWN0JywgeyBzdGF0aWM6IHRydWUgfSkgbmdTZWxlY3Q6IE5nU2VsZWN0Q29tcG9uZW50O1xuXG4gIC8vIE10eFNlbGVjdCBjdXN0b20gdGVtcGxhdGVzXG4gIEBDb250ZW50Q2hpbGQoTXR4U2VsZWN0T3B0aW9uVGVtcGxhdGVEaXJlY3RpdmUsIHsgcmVhZDogVGVtcGxhdGVSZWYgfSlcbiAgb3B0aW9uVGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XG4gIEBDb250ZW50Q2hpbGQoTXR4U2VsZWN0T3B0Z3JvdXBUZW1wbGF0ZURpcmVjdGl2ZSwgeyByZWFkOiBUZW1wbGF0ZVJlZiB9KVxuICBvcHRncm91cFRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xuICBAQ29udGVudENoaWxkKE10eFNlbGVjdExhYmVsVGVtcGxhdGVEaXJlY3RpdmUsIHsgcmVhZDogVGVtcGxhdGVSZWYgfSlcbiAgbGFiZWxUZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcbiAgQENvbnRlbnRDaGlsZChNdHhTZWxlY3RNdWx0aUxhYmVsVGVtcGxhdGVEaXJlY3RpdmUsIHsgcmVhZDogVGVtcGxhdGVSZWYgfSlcbiAgbXVsdGlMYWJlbFRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xuICBAQ29udGVudENoaWxkKE10eFNlbGVjdEhlYWRlclRlbXBsYXRlRGlyZWN0aXZlLCB7IHJlYWQ6IFRlbXBsYXRlUmVmIH0pXG4gIGhlYWRlclRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xuICBAQ29udGVudENoaWxkKE10eFNlbGVjdEZvb3RlclRlbXBsYXRlRGlyZWN0aXZlLCB7IHJlYWQ6IFRlbXBsYXRlUmVmIH0pXG4gIGZvb3RlclRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xuICBAQ29udGVudENoaWxkKE10eFNlbGVjdE5vdEZvdW5kVGVtcGxhdGVEaXJlY3RpdmUsIHsgcmVhZDogVGVtcGxhdGVSZWYgfSlcbiAgbm90Rm91bmRUZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcbiAgQENvbnRlbnRDaGlsZChNdHhTZWxlY3RUeXBlVG9TZWFyY2hUZW1wbGF0ZURpcmVjdGl2ZSwgeyByZWFkOiBUZW1wbGF0ZVJlZiB9KVxuICB0eXBlVG9TZWFyY2hUZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcbiAgQENvbnRlbnRDaGlsZChNdHhTZWxlY3RMb2FkaW5nVGV4dFRlbXBsYXRlRGlyZWN0aXZlLCB7IHJlYWQ6IFRlbXBsYXRlUmVmIH0pXG4gIGxvYWRpbmdUZXh0VGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XG4gIEBDb250ZW50Q2hpbGQoTXR4U2VsZWN0VGFnVGVtcGxhdGVEaXJlY3RpdmUsIHsgcmVhZDogVGVtcGxhdGVSZWYgfSkgdGFnVGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XG4gIEBDb250ZW50Q2hpbGQoTXR4U2VsZWN0TG9hZGluZ1NwaW5uZXJUZW1wbGF0ZURpcmVjdGl2ZSwgeyByZWFkOiBUZW1wbGF0ZVJlZiB9KVxuICBsb2FkaW5nU3Bpbm5lclRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xuXG4gIEBDb250ZW50Q2hpbGRyZW4oTXR4T3B0aW9uQ29tcG9uZW50LCB7IGRlc2NlbmRhbnRzOiB0cnVlIH0pXG4gIG10eE9wdGlvbnM6IFF1ZXJ5TGlzdDxNdHhPcHRpb25Db21wb25lbnQ+O1xuXG4gIC8qKiBNdHhTZWxlY3Qgb3B0aW9ucyAqL1xuICBASW5wdXQoKSBhZGRUYWc6IGJvb2xlYW4gfCBBZGRUYWdGbiA9IGZhbHNlO1xuICBASW5wdXQoKSBhZGRUYWdUZXh0ID0gJ0FkZCBpdGVtJztcbiAgQElucHV0KCkgYXBwZWFyYW5jZSA9ICd1bmRlcmxpbmUnO1xuICBASW5wdXQoKSBhcHBlbmRUbzogc3RyaW5nO1xuICBASW5wdXQoKSBiaW5kTGFiZWw6IHN0cmluZztcbiAgQElucHV0KCkgYmluZFZhbHVlOiBzdHJpbmc7XG4gIEBJbnB1dCgpIGNsb3NlT25TZWxlY3QgPSB0cnVlO1xuICBASW5wdXQoKSBjbGVhckFsbFRleHQgPSAnQ2xlYXIgYWxsJztcbiAgQElucHV0KCkgY2xlYXJhYmxlID0gdHJ1ZTtcbiAgQElucHV0KCkgY2xlYXJPbkJhY2tzcGFjZSA9IHRydWU7XG4gIEBJbnB1dCgpIGNvbXBhcmVXaXRoOiBDb21wYXJlV2l0aEZuO1xuICBASW5wdXQoKSBkcm9wZG93blBvc2l0aW9uOiBEcm9wZG93blBvc2l0aW9uID0gJ2F1dG8nO1xuICBASW5wdXQoKSBncm91cEJ5OiBzdHJpbmcgfCAoKCkgPT4gdm9pZCk7XG4gIEBJbnB1dCgpIGdyb3VwVmFsdWU6IEdyb3VwVmFsdWVGbjtcbiAgQElucHV0KCkgc2VsZWN0YWJsZUdyb3VwID0gZmFsc2U7XG4gIEBJbnB1dCgpIHNlbGVjdGFibGVHcm91cEFzTW9kZWwgPSB0cnVlO1xuICBASW5wdXQoKSBoaWRlU2VsZWN0ZWQgPSBmYWxzZTtcbiAgQElucHV0KCkgaXNPcGVuOiBib29sZWFuO1xuICBASW5wdXQoKSBsb2FkaW5nID0gZmFsc2U7XG4gIEBJbnB1dCgpIGxvYWRpbmdUZXh0ID0gJ0xvYWRpbmcuLi4nO1xuICBASW5wdXQoKSBsYWJlbEZvcklkOiBzdHJpbmcgfCBudWxsID0gbnVsbDtcbiAgQElucHV0KCkgbWFya0ZpcnN0ID0gdHJ1ZTtcbiAgQElucHV0KCkgbWF4U2VsZWN0ZWRJdGVtczogbnVtYmVyO1xuICBASW5wdXQoKSBtdWx0aXBsZSA9IGZhbHNlO1xuICBASW5wdXQoKSBub3RGb3VuZFRleHQgPSAnTm8gaXRlbXMgZm91bmQnO1xuICBASW5wdXQoKSBzZWFyY2hhYmxlID0gdHJ1ZTtcbiAgQElucHV0KCkgcmVhZG9ubHkgPSBmYWxzZTtcbiAgQElucHV0KCkgc2VhcmNoRm46IFNlYXJjaEZuIHwgbnVsbCA9IG51bGw7XG4gIEBJbnB1dCgpIHNlYXJjaFdoaWxlQ29tcG9zaW5nID0gdHJ1ZTtcbiAgQElucHV0KCkgc2VsZWN0T25UYWIgPSBmYWxzZTtcbiAgQElucHV0KCkgdHJhY2tCeUZuOiBUcmFja0J5Rm4gfCBudWxsID0gbnVsbDtcbiAgQElucHV0KCkgaW5wdXRBdHRyczogeyBba2V5OiBzdHJpbmddOiBzdHJpbmcgfSA9IHt9O1xuICBASW5wdXQoKSB0YWJJbmRleDogbnVtYmVyO1xuICBASW5wdXQoKSBvcGVuT25FbnRlcjogYm9vbGVhbjtcbiAgQElucHV0KCkgbWluVGVybUxlbmd0aCA9IDA7XG4gIEBJbnB1dCgpIGVkaXRhYmxlU2VhcmNoVGVybSA9IGZhbHNlO1xuICBASW5wdXQoKSBrZXlEb3duRm4gPSAoXzogS2V5Ym9hcmRFdmVudCkgPT4gdHJ1ZTtcbiAgQElucHV0KCkgdmlydHVhbFNjcm9sbCA9IGZhbHNlO1xuICBASW5wdXQoKSB0eXBlVG9TZWFyY2hUZXh0ID0gJ1R5cGUgdG8gc2VhcmNoJztcbiAgQElucHV0KCkgdHlwZWFoZWFkOiBTdWJqZWN0PHN0cmluZz47XG5cbiAgQE91dHB1dCgnYmx1cicpIGJsdXJFdmVudCA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgQE91dHB1dCgnZm9jdXMnKSBmb2N1c0V2ZW50ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICBAT3V0cHV0KCdjaGFuZ2UnKSBjaGFuZ2VFdmVudCA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgQE91dHB1dCgnb3BlbicpIG9wZW5FdmVudCA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgQE91dHB1dCgnY2xvc2UnKSBjbG9zZUV2ZW50ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICBAT3V0cHV0KCdzZWFyY2gnKSBzZWFyY2hFdmVudCA9IG5ldyBFdmVudEVtaXR0ZXI8eyB0ZXJtOiBzdHJpbmc7IGl0ZW1zOiBhbnlbXSB9PigpO1xuICBAT3V0cHV0KCdjbGVhcicpIGNsZWFyRXZlbnQgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gIEBPdXRwdXQoJ2FkZCcpIGFkZEV2ZW50ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICBAT3V0cHV0KCdyZW1vdmUnKSByZW1vdmVFdmVudCA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgQE91dHB1dCgnc2Nyb2xsJykgc2Nyb2xsID0gbmV3IEV2ZW50RW1pdHRlcjx7IHN0YXJ0OiBudW1iZXI7IGVuZDogbnVtYmVyIH0+KCk7XG4gIEBPdXRwdXQoJ3Njcm9sbFRvRW5kJykgc2Nyb2xsVG9FbmQgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgQElucHV0KClcbiAgZ2V0IGNsZWFyU2VhcmNoT25BZGQoKSB7XG4gICAgcmV0dXJuIGlzRGVmaW5lZCh0aGlzLl9jbGVhclNlYXJjaE9uQWRkKSA/IHRoaXMuX2NsZWFyU2VhcmNoT25BZGQgOiB0aGlzLmNsb3NlT25TZWxlY3Q7XG4gIH1cbiAgc2V0IGNsZWFyU2VhcmNoT25BZGQodmFsdWUpIHtcbiAgICB0aGlzLl9jbGVhclNlYXJjaE9uQWRkID0gdmFsdWU7XG4gIH1cbiAgcHJpdmF0ZSBfY2xlYXJTZWFyY2hPbkFkZDogYm9vbGVhbjtcblxuICBASW5wdXQoKVxuICBnZXQgaXRlbXMoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2l0ZW1zO1xuICB9XG4gIHNldCBpdGVtcyh2YWx1ZTogYW55W10pIHtcbiAgICB0aGlzLl9pdGVtc0FyZVVzZWQgPSB0cnVlO1xuICAgIHRoaXMuX2l0ZW1zID0gdmFsdWU7XG4gIH1cbiAgcHJpdmF0ZSBfaXRlbXM6IGFueVtdID0gW107XG4gIHByaXZhdGUgX2l0ZW1zQXJlVXNlZDogYm9vbGVhbjtcbiAgcHJpdmF0ZSByZWFkb25seSBfZGVzdHJveSQgPSBuZXcgU3ViamVjdDx2b2lkPigpO1xuXG4gIC8qKiBWYWx1ZSBvZiB0aGUgc2VsZWN0IGNvbnRyb2wuICovXG4gIEBJbnB1dCgpXG4gIGdldCB2YWx1ZSgpOiBhbnkge1xuICAgIHJldHVybiB0aGlzLl92YWx1ZTtcbiAgfVxuICBzZXQgdmFsdWUobmV3VmFsdWU6IGFueSkge1xuICAgIHRoaXMuX3ZhbHVlID0gbmV3VmFsdWU7XG4gICAgdGhpcy5fb25DaGFuZ2UobmV3VmFsdWUpO1xuICAgIHRoaXMuc3RhdGVDaGFuZ2VzLm5leHQoKTtcbiAgfVxuICBwcml2YXRlIF92YWx1ZSA9IG51bGw7XG5cbiAgLyoqIEltcGxlbWVudGVkIGFzIHBhcnQgb2YgTWF0Rm9ybUZpZWxkQ29udHJvbC4gKi9cbiAgcmVhZG9ubHkgc3RhdGVDaGFuZ2VzOiBTdWJqZWN0PHZvaWQ+ID0gbmV3IFN1YmplY3Q8dm9pZD4oKTtcblxuICAvKiogVW5pcXVlIGlkIG9mIHRoZSBlbGVtZW50LiAqL1xuICBASW5wdXQoKVxuICBnZXQgaWQoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5faWQ7XG4gIH1cbiAgc2V0IGlkKHZhbHVlOiBzdHJpbmcpIHtcbiAgICB0aGlzLl9pZCA9IHZhbHVlIHx8IHRoaXMuX3VpZDtcbiAgICB0aGlzLnN0YXRlQ2hhbmdlcy5uZXh0KCk7XG4gIH1cbiAgcHJpdmF0ZSBfaWQ6IHN0cmluZztcblxuICAvKiogVW5pcXVlIGlkIGZvciB0aGlzIGlucHV0LiAqL1xuICBwcml2YXRlIF91aWQgPSBgbXR4LXNlbGVjdC0ke25leHRVbmlxdWVJZCsrfWA7XG5cbiAgLyoqIFBsYWNlaG9sZGVyIHRvIGJlIHNob3duIGlmIHZhbHVlIGlzIGVtcHR5LiAqL1xuICBASW5wdXQoKVxuICBnZXQgcGxhY2Vob2xkZXIoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5fcGxhY2Vob2xkZXI7XG4gIH1cbiAgc2V0IHBsYWNlaG9sZGVyKHZhbHVlOiBzdHJpbmcpIHtcbiAgICB0aGlzLl9wbGFjZWhvbGRlciA9IHZhbHVlO1xuICAgIHRoaXMuc3RhdGVDaGFuZ2VzLm5leHQoKTtcbiAgfVxuICBwcml2YXRlIF9wbGFjZWhvbGRlcjogc3RyaW5nO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBpbnB1dCBpcyBmb2N1c2VkLiAqL1xuICBnZXQgZm9jdXNlZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fZm9jdXNlZDtcbiAgfVxuICBwcml2YXRlIF9mb2N1c2VkID0gZmFsc2U7XG5cbiAgZ2V0IGVtcHR5KCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLnZhbHVlID09IG51bGwgfHwgKEFycmF5LmlzQXJyYXkodGhpcy52YWx1ZSkgJiYgdGhpcy52YWx1ZS5sZW5ndGggPT09IDApO1xuICB9XG5cbiAgZ2V0IHNob3VsZExhYmVsRmxvYXQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuZm9jdXNlZCB8fCAhdGhpcy5lbXB0eTtcbiAgfVxuXG4gIEBJbnB1dCgpXG4gIGdldCByZXF1aXJlZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fcmVxdWlyZWQ7XG4gIH1cbiAgc2V0IHJlcXVpcmVkKHZhbHVlOiBib29sZWFuKSB7XG4gICAgdGhpcy5fcmVxdWlyZWQgPSBjb2VyY2VCb29sZWFuUHJvcGVydHkodmFsdWUpO1xuICAgIHRoaXMuc3RhdGVDaGFuZ2VzLm5leHQoKTtcbiAgfVxuICBwcml2YXRlIF9yZXF1aXJlZCA9IGZhbHNlO1xuXG4gIEBJbnB1dCgpXG4gIGdldCBkaXNhYmxlZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fZGlzYWJsZWQ7XG4gIH1cbiAgc2V0IGRpc2FibGVkKHZhbHVlOiBib29sZWFuKSB7XG4gICAgdGhpcy5fZGlzYWJsZWQgPSBjb2VyY2VCb29sZWFuUHJvcGVydHkodmFsdWUpO1xuICAgIHRoaXMucmVhZG9ubHkgPSB0aGlzLl9kaXNhYmxlZDtcbiAgICB0aGlzLnN0YXRlQ2hhbmdlcy5uZXh0KCk7XG4gIH1cbiAgcHJpdmF0ZSBfZGlzYWJsZWQgPSBmYWxzZTtcblxuICBlcnJvclN0YXRlID0gZmFsc2U7XG5cbiAgLyoqIEEgbmFtZSBmb3IgdGhpcyBjb250cm9sIHRoYXQgY2FuIGJlIHVzZWQgYnkgYG1hdC1mb3JtLWZpZWxkYC4gKi9cbiAgY29udHJvbFR5cGUgPSAnbXR4LXNlbGVjdCc7XG5cbiAgLyoqIFRoZSBhcmlhLWRlc2NyaWJlZGJ5IGF0dHJpYnV0ZSBvbiB0aGUgc2VsZWN0IGZvciBpbXByb3ZlZCBhMTF5LiAqL1xuICBfYXJpYURlc2NyaWJlZGJ5OiBzdHJpbmc7XG5cbiAgLyoqIGBWaWV3IC0+IG1vZGVsIGNhbGxiYWNrIGNhbGxlZCB3aGVuIHZhbHVlIGNoYW5nZXNgICovXG4gIF9vbkNoYW5nZTogKHZhbHVlOiBhbnkpID0+IHZvaWQgPSAoKSA9PiB7fTtcblxuICAvKiogYFZpZXcgLT4gbW9kZWwgY2FsbGJhY2sgY2FsbGVkIHdoZW4gc2VsZWN0IGhhcyBiZWVuIHRvdWNoZWRgICovXG4gIF9vblRvdWNoZWQgPSAoKSA9PiB7fTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIF9mb2N1c01vbml0b3I6IEZvY3VzTW9uaXRvcixcbiAgICBwcml2YXRlIF9lbGVtZW50UmVmOiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PixcbiAgICBwcml2YXRlIF9jaGFuZ2VEZXRlY3RvclJlZjogQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gICAgQE9wdGlvbmFsKCkgQFNlbGYoKSBwdWJsaWMgbmdDb250cm9sOiBOZ0NvbnRyb2xcbiAgKSB7XG4gICAgX2ZvY3VzTW9uaXRvci5tb25pdG9yKF9lbGVtZW50UmVmLCB0cnVlKS5zdWJzY3JpYmUob3JpZ2luID0+IHtcbiAgICAgIGlmICh0aGlzLl9mb2N1c2VkICYmICFvcmlnaW4pIHtcbiAgICAgICAgdGhpcy5fb25Ub3VjaGVkKCk7XG4gICAgICB9XG4gICAgICB0aGlzLl9mb2N1c2VkID0gISFvcmlnaW47XG4gICAgICB0aGlzLnN0YXRlQ2hhbmdlcy5uZXh0KCk7XG4gICAgfSk7XG5cbiAgICBpZiAodGhpcy5uZ0NvbnRyb2wgIT0gbnVsbCkge1xuICAgICAgdGhpcy5uZ0NvbnRyb2wudmFsdWVBY2Nlc3NvciA9IHRoaXM7XG4gICAgfVxuICB9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgLy8gRml4IGNvbXBhcmVXaXRoIHdhcm5pbmcgb2YgdW5kZWZpbmVkIHZhbHVlXG4gICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL25nLXNlbGVjdC9uZy1zZWxlY3QvaXNzdWVzLzE1MzdcbiAgICBpZiAodGhpcy5jb21wYXJlV2l0aCkge1xuICAgICAgdGhpcy5uZ1NlbGVjdC5jb21wYXJlV2l0aCA9IHRoaXMuY29tcGFyZVdpdGg7XG4gICAgfVxuICB9XG5cbiAgbmdBZnRlclZpZXdJbml0KCkge1xuICAgIGlmICghdGhpcy5faXRlbXNBcmVVc2VkKSB7XG4gICAgICB0aGlzLl9zZXRJdGVtc0Zyb21NdHhPcHRpb25zKCk7XG4gICAgfVxuICB9XG5cbiAgbmdEb0NoZWNrKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLm5nQ29udHJvbCkge1xuICAgICAgdGhpcy5lcnJvclN0YXRlID0gKHRoaXMubmdDb250cm9sLmludmFsaWQgJiYgdGhpcy5uZ0NvbnRyb2wudG91Y2hlZCkgYXMgYm9vbGVhbjtcbiAgICAgIHRoaXMuc3RhdGVDaGFuZ2VzLm5leHQoKTtcbiAgICB9XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLl9kZXN0cm95JC5uZXh0KCk7XG4gICAgdGhpcy5fZGVzdHJveSQuY29tcGxldGUoKTtcbiAgICB0aGlzLnN0YXRlQ2hhbmdlcy5jb21wbGV0ZSgpO1xuICAgIHRoaXMuX2ZvY3VzTW9uaXRvci5zdG9wTW9uaXRvcmluZyh0aGlzLl9lbGVtZW50UmVmKTtcbiAgfVxuXG4gIC8qKiBJbXBsZW1lbnRlZCBhcyBwYXJ0IG9mIE1hdEZvcm1GaWVsZENvbnRyb2wuICovXG4gIHNldERlc2NyaWJlZEJ5SWRzKGlkczogc3RyaW5nW10pIHtcbiAgICB0aGlzLl9hcmlhRGVzY3JpYmVkYnkgPSBpZHMuam9pbignICcpO1xuICB9XG5cbiAgLyoqXG4gICAqIERpc2FibGVzIHRoZSBzZWxlY3QuIFBhcnQgb2YgdGhlIENvbnRyb2xWYWx1ZUFjY2Vzc29yIGludGVyZmFjZSByZXF1aXJlZFxuICAgKiB0byBpbnRlZ3JhdGUgd2l0aCBBbmd1bGFyJ3MgY29yZSBmb3JtcyBBUEkuXG4gICAqXG4gICAqIEBwYXJhbSBpc0Rpc2FibGVkIFNldHMgd2hldGhlciB0aGUgY29tcG9uZW50IGlzIGRpc2FibGVkLlxuICAgKi9cbiAgc2V0RGlzYWJsZWRTdGF0ZShpc0Rpc2FibGVkOiBib29sZWFuKSB7XG4gICAgdGhpcy5kaXNhYmxlZCA9IGlzRGlzYWJsZWQ7XG4gIH1cblxuICAvKiogSW1wbGVtZW50ZWQgYXMgcGFydCBvZiBNYXRGb3JtRmllbGRDb250cm9sLiAqL1xuICBvbkNvbnRhaW5lckNsaWNrKGV2ZW50OiBNb3VzZUV2ZW50KSB7XG4gICAgY29uc3QgdGFyZ2V0ID0gZXZlbnQudGFyZ2V0IGFzIEhUTUxFbGVtZW50O1xuICAgIGlmICgvbWF0LWZvcm0tZmllbGR8bXR4LXNlbGVjdC9nLnRlc3QodGFyZ2V0LnBhcmVudEVsZW1lbnQ/LmNsYXNzTGlzdFswXSB8fCAnJykpIHtcbiAgICAgIHRoaXMuZm9jdXMoKTtcbiAgICAgIHRoaXMub3BlbigpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSBzZWxlY3QncyB2YWx1ZS4gUGFydCBvZiB0aGUgQ29udHJvbFZhbHVlQWNjZXNzb3IgaW50ZXJmYWNlXG4gICAqIHJlcXVpcmVkIHRvIGludGVncmF0ZSB3aXRoIEFuZ3VsYXIncyBjb3JlIGZvcm1zIEFQSS5cbiAgICpcbiAgICogQHBhcmFtIHZhbHVlIE5ldyB2YWx1ZSB0byBiZSB3cml0dGVuIHRvIHRoZSBtb2RlbC5cbiAgICovXG4gIHdyaXRlVmFsdWUodmFsdWU6IGFueSk6IHZvaWQge1xuICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgICB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTYXZlcyBhIGNhbGxiYWNrIGZ1bmN0aW9uIHRvIGJlIGludm9rZWQgd2hlbiB0aGUgc2VsZWN0J3MgdmFsdWVcbiAgICogY2hhbmdlcyBmcm9tIHVzZXIgaW5wdXQuIFBhcnQgb2YgdGhlIENvbnRyb2xWYWx1ZUFjY2Vzc29yIGludGVyZmFjZVxuICAgKiByZXF1aXJlZCB0byBpbnRlZ3JhdGUgd2l0aCBBbmd1bGFyJ3MgY29yZSBmb3JtcyBBUEkuXG4gICAqXG4gICAqIEBwYXJhbSBmbiBDYWxsYmFjayB0byBiZSB0cmlnZ2VyZWQgd2hlbiB0aGUgdmFsdWUgY2hhbmdlcy5cbiAgICovXG4gIHJlZ2lzdGVyT25DaGFuZ2UoZm46IGFueSk6IHZvaWQge1xuICAgIHRoaXMuX29uQ2hhbmdlID0gZm47XG4gIH1cblxuICAvKipcbiAgICogU2F2ZXMgYSBjYWxsYmFjayBmdW5jdGlvbiB0byBiZSBpbnZva2VkIHdoZW4gdGhlIHNlbGVjdCBpcyBibHVycmVkXG4gICAqIGJ5IHRoZSB1c2VyLiBQYXJ0IG9mIHRoZSBDb250cm9sVmFsdWVBY2Nlc3NvciBpbnRlcmZhY2UgcmVxdWlyZWRcbiAgICogdG8gaW50ZWdyYXRlIHdpdGggQW5ndWxhcidzIGNvcmUgZm9ybXMgQVBJLlxuICAgKlxuICAgKiBAcGFyYW0gZm4gQ2FsbGJhY2sgdG8gYmUgdHJpZ2dlcmVkIHdoZW4gdGhlIGNvbXBvbmVudCBoYXMgYmVlbiB0b3VjaGVkLlxuICAgKi9cbiAgcmVnaXN0ZXJPblRvdWNoZWQoZm46IGFueSk6IHZvaWQge1xuICAgIHRoaXMuX29uVG91Y2hlZCA9IGZuO1xuICB9XG5cbiAgLyoqIE5nU2VsZWN0OiBfc2V0SXRlbXNGcm9tTmdPcHRpb25zICovXG5cbiAgcHJpdmF0ZSBfc2V0SXRlbXNGcm9tTXR4T3B0aW9ucygpIHtcbiAgICBjb25zdCBtYXBNdHhPcHRpb25zID0gKG9wdGlvbnM6IFF1ZXJ5TGlzdDxNdHhPcHRpb25Db21wb25lbnQ+KSA9PiB7XG4gICAgICB0aGlzLml0ZW1zID0gb3B0aW9ucy5tYXAob3B0aW9uID0+ICh7XG4gICAgICAgICRuZ09wdGlvblZhbHVlOiBvcHRpb24udmFsdWUsXG4gICAgICAgICRuZ09wdGlvbkxhYmVsOiBvcHRpb24uZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmlubmVySFRNTCxcbiAgICAgICAgZGlzYWJsZWQ6IG9wdGlvbi5kaXNhYmxlZCxcbiAgICAgIH0pKTtcbiAgICAgIHRoaXMubmdTZWxlY3QuaXRlbXNMaXN0LnNldEl0ZW1zKHRoaXMuaXRlbXMpO1xuICAgICAgaWYgKHRoaXMubmdTZWxlY3QuaGFzVmFsdWUpIHtcbiAgICAgICAgdGhpcy5uZ1NlbGVjdC5pdGVtc0xpc3QubWFwU2VsZWN0ZWRJdGVtcygpO1xuICAgICAgfVxuICAgICAgdGhpcy5uZ1NlbGVjdC5kZXRlY3RDaGFuZ2VzKCk7XG4gICAgfTtcblxuICAgIGNvbnN0IGhhbmRsZU9wdGlvbkNoYW5nZSA9ICgpID0+IHtcbiAgICAgIGNvbnN0IGNoYW5nZWRPckRlc3Ryb3llZCA9IG1lcmdlKHRoaXMubXR4T3B0aW9ucy5jaGFuZ2VzLCB0aGlzLl9kZXN0cm95JCk7XG4gICAgICBtZXJnZSguLi50aGlzLm10eE9wdGlvbnMubWFwKG9wdGlvbiA9PiBvcHRpb24uc3RhdGVDaGFuZ2UkKSlcbiAgICAgICAgLnBpcGUodGFrZVVudGlsKGNoYW5nZWRPckRlc3Ryb3llZCkpXG4gICAgICAgIC5zdWJzY3JpYmUob3B0aW9uID0+IHtcbiAgICAgICAgICBjb25zdCBpdGVtID0gdGhpcy5uZ1NlbGVjdC5pdGVtc0xpc3QuZmluZEl0ZW0ob3B0aW9uLnZhbHVlKTtcbiAgICAgICAgICBpdGVtLmRpc2FibGVkID0gb3B0aW9uLmRpc2FibGVkO1xuICAgICAgICAgIGl0ZW0ubGFiZWwgPSBvcHRpb24ubGFiZWwgfHwgaXRlbS5sYWJlbDtcbiAgICAgICAgICB0aGlzLm5nU2VsZWN0LmRldGVjdENoYW5nZXMoKTtcbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIHRoaXMubXR4T3B0aW9ucy5jaGFuZ2VzXG4gICAgICAucGlwZShzdGFydFdpdGgodGhpcy5tdHhPcHRpb25zKSwgdGFrZVVudGlsKHRoaXMuX2Rlc3Ryb3kkKSlcbiAgICAgIC5zdWJzY3JpYmUob3B0aW9ucyA9PiB7XG4gICAgICAgIG1hcE10eE9wdGlvbnMob3B0aW9ucyk7XG4gICAgICAgIGhhbmRsZU9wdGlvbkNoYW5nZSgpO1xuICAgICAgfSk7XG4gIH1cblxuICBvcGVuKCkge1xuICAgIHRoaXMubmdTZWxlY3Qub3BlbigpO1xuICB9XG5cbiAgY2xvc2UoKSB7XG4gICAgdGhpcy5uZ1NlbGVjdC5jbG9zZSgpO1xuICB9XG5cbiAgZm9jdXMoKSB7XG4gICAgdGhpcy5uZ1NlbGVjdC5mb2N1cygpO1xuICB9XG5cbiAgYmx1cigpIHtcbiAgICB0aGlzLm5nU2VsZWN0LmJsdXIoKTtcbiAgfVxuXG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9yZXF1aXJlZDogQm9vbGVhbklucHV0O1xuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfZGlzYWJsZWQ6IEJvb2xlYW5JbnB1dDtcbn1cbiJdfQ==