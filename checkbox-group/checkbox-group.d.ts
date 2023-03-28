import { EventEmitter, ChangeDetectorRef, AfterViewInit, QueryList, ElementRef, OnDestroy } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { BooleanInput } from '@angular/cdk/coercion';
import { MatCheckbox, MatCheckboxChange } from '@angular/material/checkbox';
import { FocusMonitor } from '@angular/cdk/a11y';
import { MtxCheckboxGroupOption } from './interfaces';
import * as i0 from "@angular/core";
export declare class MtxCheckboxBase {
    label?: any;
    value?: any;
    constructor(label?: any, value?: any);
}
export declare class MtxCheckboxGroup implements AfterViewInit, OnDestroy, ControlValueAccessor {
    private _changeDetectorRef;
    private _focusMonitor;
    private _elementRef;
    _checkboxes: QueryList<MatCheckbox>;
    get items(): any[];
    set items(value: any[]);
    private _items;
    private _originalItems;
    bindLabel: string;
    bindValue: string;
    get showSelectAll(): boolean;
    set showSelectAll(value: boolean);
    private _showSelectAll;
    selectAllLabel: string;
    get compareWith(): (o1: any, o2: any) => boolean;
    set compareWith(fn: (o1: any, o2: any) => boolean);
    private _compareWith;
    get disabled(): boolean;
    set disabled(value: boolean);
    private _disabled;
    change: EventEmitter<{
        model: MtxCheckboxGroupOption[];
        index: number;
    }>;
    selectAll: boolean;
    selectAllIndeterminate: boolean;
    selectedItems: MtxCheckboxGroupOption[];
    _onChange: (value: MtxCheckboxGroupOption[]) => void;
    _onTouched: () => void;
    constructor(_changeDetectorRef: ChangeDetectorRef, _focusMonitor: FocusMonitor, _elementRef: ElementRef<HTMLElement>);
    ngAfterViewInit(): void;
    ngOnDestroy(): void;
    /**
     * Finds and selects and option based on its value.
     * @returns Option that has the corresponding value.
     */
    private _selectValue;
    /**
     * Sets the model value. Implemented as part of ControlValueAccessor.
     * @param value New value to be written to the model.
     */
    writeValue(value: any[]): void;
    /**
     * Registers a callback to be triggered when the model value changes.
     * Implemented as part of ControlValueAccessor.
     * @param fn Callback to be registered.
     */
    registerOnChange(fn: (value: MtxCheckboxGroupOption[]) => Record<string, unknown>): void;
    /**
     * Registers a callback to be triggered when the control is touched.
     * Implemented as part of ControlValueAccessor.
     * @param fn Callback to be registered.
     */
    registerOnTouched(fn: () => Record<string, unknown>): void;
    /**
     * Sets the disabled state of the control. Implemented as a part of ControlValueAccessor.
     * @param isDisabled Whether the control should be disabled.
     */
    setDisabledState(isDisabled: boolean): void;
    private _checkMasterCheckboxState;
    private _getSelectedItems;
    /** Handle normal checkbox toggle */
    _updateNormalCheckboxState(e: MatCheckboxChange, index: number): void;
    /** Handle master checkbox toggle */
    _updateMasterCheckboxState(e: MatCheckboxChange, index: number): void;
    static ngAcceptInputType_showSelectAll: BooleanInput;
    static ngAcceptInputType_disabled: BooleanInput;
    static ɵfac: i0.ɵɵFactoryDeclaration<MtxCheckboxGroup, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MtxCheckboxGroup, "mtx-checkbox-group", ["mtxCheckboxGroup"], { "items": "items"; "bindLabel": "bindLabel"; "bindValue": "bindValue"; "showSelectAll": "showSelectAll"; "selectAllLabel": "selectAllLabel"; "compareWith": "compareWith"; "disabled": "disabled"; }, { "change": "change"; }, ["_checkboxes"], never, false, never>;
}
