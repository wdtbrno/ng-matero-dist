import { AfterContentInit, OnInit, QueryList } from '@angular/core';
import { BooleanInput } from '@angular/cdk/coercion';
import { MatFormField } from '@angular/material/form-field';
export declare class MtxFormGroupComponent implements OnInit, AfterContentInit {
    formFields: QueryList<MatFormField>;
    label: string;
    get showRequiredMarker(): boolean;
    set showRequiredMarker(value: boolean);
    private _showRequiredMarker;
    constructor();
    ngOnInit(): void;
    ngAfterContentInit(): void;
    static ngAcceptInputType_showRequiredMarker: BooleanInput;
}
