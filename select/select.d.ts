import { FocusMonitor } from '@angular/cdk/a11y';
import { BooleanInput } from '@angular/cdk/coercion';
import { AfterViewInit, ChangeDetectorRef, DoCheck, ElementRef, EventEmitter, OnDestroy, OnInit, QueryList, TemplateRef } from '@angular/core';
import { CanDisable, ErrorStateMatcher } from '@angular/material/core';
import { ControlValueAccessor, FormGroupDirective, NgControl, NgForm } from '@angular/forms';
import { MatFormField, MatFormFieldControl } from '@angular/material/form-field';
import { Subject } from 'rxjs';
import { NgSelectComponent } from '@ng-select/ng-select';
import { MtxOption } from './option';
import * as i0 from "@angular/core";
export type DropdownPosition = 'bottom' | 'top' | 'auto';
export type AddTagFn = (term: string) => any | Promise<any>;
export type CompareWithFn = (a: any, b: any) => boolean;
export type GroupValueFn = (key: string | Record<string, any>, children: any[]) => string | Record<string, any>;
export type SearchFn = (term: string, item: any) => boolean;
export type TrackByFn = (item: any) => any;
/** @docs-private */
declare const _MtxSelectMixinBase: import("@angular/material/core")._Constructor<CanDisable> & import("@angular/material/core")._AbstractConstructor<CanDisable> & import("@angular/material/core")._Constructor<import("@angular/material/core").CanUpdateErrorState> & import("@angular/material/core")._AbstractConstructor<import("@angular/material/core").CanUpdateErrorState> & {
    new (_defaultErrorStateMatcher: ErrorStateMatcher, _parentForm: NgForm, _parentFormGroup: FormGroupDirective, ngControl: NgControl): {
        /**
         * Emits whenever the component state changes and should cause the parent
         * form-field to update. Implemented as part of `MatFormFieldControl`.
         * @docs-private
         */
        readonly stateChanges: Subject<void>;
        _defaultErrorStateMatcher: ErrorStateMatcher;
        _parentForm: NgForm;
        _parentFormGroup: FormGroupDirective;
        /**
         * Form control bound to the component.
         * Implemented as part of `MatFormFieldControl`.
         * @docs-private
         */
        ngControl: NgControl;
    };
};
export declare class MtxSelect extends _MtxSelectMixinBase implements OnInit, OnDestroy, DoCheck, AfterViewInit, ControlValueAccessor, CanDisable, MatFormFieldControl<any> {
    protected _changeDetectorRef: ChangeDetectorRef;
    protected _elementRef: ElementRef;
    protected _focusMonitor: FocusMonitor;
    protected _parentFormField?: MatFormField | undefined;
    ngSelect: NgSelectComponent;
    optionTemplate: TemplateRef<any>;
    optgroupTemplate: TemplateRef<any>;
    labelTemplate: TemplateRef<any>;
    multiLabelTemplate: TemplateRef<any>;
    headerTemplate: TemplateRef<any>;
    footerTemplate: TemplateRef<any>;
    notFoundTemplate: TemplateRef<any>;
    typeToSearchTemplate: TemplateRef<any>;
    loadingTextTemplate: TemplateRef<any>;
    tagTemplate: TemplateRef<any>;
    loadingSpinnerTemplate: TemplateRef<any>;
    mtxOptions: QueryList<MtxOption>;
    addTag: boolean | AddTagFn;
    addTagText: string;
    appearance: string;
    appendTo: string;
    bindLabel: string;
    bindValue: string;
    closeOnSelect: boolean;
    clearAllText: string;
    clearable: boolean;
    clearOnBackspace: boolean;
    compareWith: CompareWithFn;
    dropdownPosition: DropdownPosition;
    groupBy: string | (() => void);
    groupValue: GroupValueFn;
    selectableGroup: boolean;
    selectableGroupAsModel: boolean;
    hideSelected: boolean;
    isOpen: boolean;
    loading: boolean;
    loadingText: string;
    labelForId: string | null;
    markFirst: boolean;
    maxSelectedItems: number;
    multiple: boolean;
    notFoundText: string;
    searchable: boolean;
    readonly: boolean;
    searchFn: SearchFn | null;
    searchWhileComposing: boolean;
    selectOnTab: boolean;
    trackByFn: TrackByFn | null;
    inputAttrs: {
        [key: string]: string;
    };
    tabIndex: number;
    openOnEnter: boolean;
    minTermLength: number;
    editableSearchTerm: boolean;
    keyDownFn: (_: KeyboardEvent) => boolean;
    virtualScroll: boolean;
    typeToSearchText: string;
    typeahead: Subject<string>;
    blurEvent: EventEmitter<any>;
    focusEvent: EventEmitter<any>;
    changeEvent: EventEmitter<any>;
    openEvent: EventEmitter<any>;
    closeEvent: EventEmitter<any>;
    searchEvent: EventEmitter<{
        term: string;
        items: any[];
    }>;
    clearEvent: EventEmitter<any>;
    addEvent: EventEmitter<any>;
    removeEvent: EventEmitter<any>;
    scroll: EventEmitter<{
        start: number;
        end: number;
    }>;
    scrollToEnd: EventEmitter<any>;
    get clearSearchOnAdd(): boolean;
    set clearSearchOnAdd(value: boolean);
    private _clearSearchOnAdd?;
    get items(): any[];
    set items(value: any[]);
    private _items;
    private _itemsAreUsed;
    /** Emits whenever the component is destroyed. */
    private readonly _destroy$;
    /** Value of the select control. */
    get value(): any;
    set value(newValue: any);
    private _value;
    /** Implemented as part of MatFormFieldControl. */
    readonly stateChanges: Subject<void>;
    /** Unique id of the element. */
    get id(): string;
    set id(value: string);
    private _id;
    /** Unique id for this select. */
    private _uid;
    /** Placeholder to be shown if value is empty. */
    get placeholder(): string;
    set placeholder(value: string);
    private _placeholder;
    /** Whether the select is focused. */
    get focused(): boolean;
    private _focused;
    /** Whether the select has a value. */
    get empty(): boolean;
    /**
     * Implemented as part of MatFormFieldControl.
     * @docs-private
     */
    get shouldLabelFloat(): boolean;
    /** Whether the component is required. */
    get required(): boolean;
    set required(value: boolean);
    private _required;
    /** Object used to control when error messages are shown. */
    errorStateMatcher: ErrorStateMatcher;
    /** Aria label of the select. */
    ariaLabel: string;
    /** Input that can be used to specify the `aria-labelledby` attribute. */
    ariaLabelledby: string | null;
    /** The aria-describedby attribute on the select for improved a11y. */
    _ariaDescribedby: string | null;
    /** A name for this control that can be used by `mat-form-field`. */
    controlType: string;
    /** `View -> model callback called when value changes` */
    _onChange: (value: any) => void;
    /** `View -> model callback called when select has been touched` */
    _onTouched: () => void;
    /** ID for the DOM node containing the select's value. */
    _valueId: string;
    /** Whether or not the overlay panel is open. */
    get panelOpen(): boolean;
    /**
     * Keeps track of the previous form control assigned to the select.
     * Used to detect if it has changed.
     */
    private _previousControl;
    constructor(_changeDetectorRef: ChangeDetectorRef, _elementRef: ElementRef, _focusMonitor: FocusMonitor, _defaultErrorStateMatcher: ErrorStateMatcher, _parentForm: NgForm, _parentFormGroup: FormGroupDirective, ngControl: NgControl, _parentFormField?: MatFormField | undefined);
    ngOnInit(): void;
    ngAfterViewInit(): void;
    ngDoCheck(): void;
    ngOnDestroy(): void;
    /** Gets the value for the `aria-labelledby` attribute of the inputs. */
    _getAriaLabelledby(): string | null;
    /** Implemented as part of MatFormFieldControl. */
    setDescribedByIds(ids: string[]): void;
    /**
     * Disables the select. Part of the ControlValueAccessor interface required
     * to integrate with Angular's core forms API.
     *
     * @param isDisabled Sets whether the component is disabled.
     */
    setDisabledState(isDisabled: boolean): void;
    /** Implemented as part of MatFormFieldControl. */
    onContainerClick(event: MouseEvent): void;
    /**
     * Sets the select's value. Part of the ControlValueAccessor interface
     * required to integrate with Angular's core forms API.
     *
     * @param value New value to be written to the model.
     */
    writeValue(value: any): void;
    /**
     * Saves a callback function to be invoked when the select's value
     * changes from user input. Part of the ControlValueAccessor interface
     * required to integrate with Angular's core forms API.
     *
     * @param fn Callback to be triggered when the value changes.
     */
    registerOnChange(fn: any): void;
    /**
     * Saves a callback function to be invoked when the select is blurred
     * by the user. Part of the ControlValueAccessor interface required
     * to integrate with Angular's core forms API.
     *
     * @param fn Callback to be triggered when the component has been touched.
     */
    registerOnTouched(fn: any): void;
    /** NgSelect's `_setItemsFromNgOptions` */
    private _setItemsFromMtxOptions;
    open(): void;
    close(): void;
    focus(): void;
    blur(): void;
    static ngAcceptInputType_required: BooleanInput;
    static ngAcceptInputType_disabled: BooleanInput;
    static ɵfac: i0.ɵɵFactoryDeclaration<MtxSelect, [null, null, null, null, { optional: true; }, { optional: true; }, { optional: true; self: true; }, { optional: true; }]>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MtxSelect, "mtx-select", ["mtxSelect"], { "disabled": "disabled"; "addTag": "addTag"; "addTagText": "addTagText"; "appearance": "appearance"; "appendTo": "appendTo"; "bindLabel": "bindLabel"; "bindValue": "bindValue"; "closeOnSelect": "closeOnSelect"; "clearAllText": "clearAllText"; "clearable": "clearable"; "clearOnBackspace": "clearOnBackspace"; "compareWith": "compareWith"; "dropdownPosition": "dropdownPosition"; "groupBy": "groupBy"; "groupValue": "groupValue"; "selectableGroup": "selectableGroup"; "selectableGroupAsModel": "selectableGroupAsModel"; "hideSelected": "hideSelected"; "isOpen": "isOpen"; "loading": "loading"; "loadingText": "loadingText"; "labelForId": "labelForId"; "markFirst": "markFirst"; "maxSelectedItems": "maxSelectedItems"; "multiple": "multiple"; "notFoundText": "notFoundText"; "searchable": "searchable"; "readonly": "readonly"; "searchFn": "searchFn"; "searchWhileComposing": "searchWhileComposing"; "selectOnTab": "selectOnTab"; "trackByFn": "trackByFn"; "inputAttrs": "inputAttrs"; "tabIndex": "tabIndex"; "openOnEnter": "openOnEnter"; "minTermLength": "minTermLength"; "editableSearchTerm": "editableSearchTerm"; "keyDownFn": "keyDownFn"; "virtualScroll": "virtualScroll"; "typeToSearchText": "typeToSearchText"; "typeahead": "typeahead"; "clearSearchOnAdd": "clearSearchOnAdd"; "items": "items"; "value": "value"; "id": "id"; "placeholder": "placeholder"; "required": "required"; "errorStateMatcher": "errorStateMatcher"; "ariaLabel": "aria-label"; "ariaLabelledby": "aria-labelledby"; }, { "blurEvent": "blur"; "focusEvent": "focus"; "changeEvent": "change"; "openEvent": "open"; "closeEvent": "close"; "searchEvent": "search"; "clearEvent": "clear"; "addEvent": "add"; "removeEvent": "remove"; "scroll": "scroll"; "scrollToEnd": "scrollToEnd"; }, ["optionTemplate", "optgroupTemplate", "labelTemplate", "multiLabelTemplate", "headerTemplate", "footerTemplate", "notFoundTemplate", "typeToSearchTemplate", "loadingTextTemplate", "tagTemplate", "loadingSpinnerTemplate", "mtxOptions"], never, false, never>;
}
export {};
