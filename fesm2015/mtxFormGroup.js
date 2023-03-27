import { Component, ViewEncapsulation, ContentChildren, Input, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { MatFormField } from '@angular/material/form-field';

class MtxFormGroupComponent {
    constructor() {
        this._showRequiredMarker = false;
    }
    get showRequiredMarker() {
        return this._showRequiredMarker;
    }
    set showRequiredMarker(value) {
        this._showRequiredMarker = coerceBooleanProperty(value);
    }
    ngOnInit() { }
    ngAfterContentInit() {
        this.formFields.forEach(item => {
            item.appearance = 'standard';
        });
    }
}
MtxFormGroupComponent.decorators = [
    { type: Component, args: [{
                selector: 'mtx-form-group',
                host: {
                    class: 'mtx-form-group',
                },
                template: "<div class=\"mtx-form-field-layout mtx-form-field-appearance-fluent\">\r\n  <label *ngIf=\"label\"\r\n         class=\"mtx-form-label\"\r\n         [class.mtx-form-label-marker]=\"showRequiredMarker\">{{label}}</label>\r\n  <ng-content></ng-content>\r\n</div>\r\n",
                encapsulation: ViewEncapsulation.None,
                styles: [".mtx-form-group{display:inline-block}.mtx-form-group .mtx-form-field-layout{display:inline-flex;align-items:flex-start;width:100%}.mtx-form-group .mtx-form-label{position:relative;display:inline-block;padding-top:calc(.375em + 1px);padding-bottom:calc(.375em + 1px);padding-right:1em;line-height:1.125}[dir=rtl] .mtx-form-group .mtx-form-label{padding-right:unset;padding-left:1em}.mtx-form-group .mtx-form-label.mtx-form-label-marker:after{content:\"*\";margin-left:4px}[dir=rtl] .mtx-form-group .mtx-form-label.mtx-form-label-marker:after{margin-left:auto;margin-right:4px}.mtx-form-field-appearance-fluent .mat-form-field{margin-bottom:.25em}.mtx-form-field-appearance-fluent .mat-form-field .mat-form-field-suffix .mat-icon-button{height:1.5em;width:1.5em}.mtx-form-field-appearance-fluent .mat-form-field .mat-form-field-suffix .mat-icon-button .mat-datepicker-toggle-default-icon{width:1em}.mtx-form-field-appearance-fluent .mat-form-field-has-label .mat-form-field-flex{margin-top:.84375em}.mtx-form-field-appearance-fluent .mat-form-field-appearance-standard .mat-form-field-flex{padding-top:0}.mtx-form-field-appearance-fluent .mat-form-field-flex{align-items:center;padding:0 .5em;border-radius:2px}.mtx-form-field-appearance-fluent .mat-form-field-infix{border-top:0;padding:.375em 0}.mtx-form-field-appearance-fluent .mat-form-field-prefix,.mtx-form-field-appearance-fluent .mat-form-field-suffix{display:inline-flex}.mtx-form-field-appearance-fluent .mat-form-field-prefix .mat-icon,.mtx-form-field-appearance-fluent .mat-form-field-suffix .mat-icon{line-height:normal}.mtx-form-field-appearance-fluent .mat-form-field-underline{display:none}.mtx-form-field-appearance-fluent .mtx-select{display:block;margin:0 -8px}.mtx-form-field-appearance-fluent .ng-select{padding-top:.4375em;padding-left:8px;padding-right:8px;margin-top:-.4375em}"]
            },] }
];
/** @nocollapse */
MtxFormGroupComponent.ctorParameters = () => [];
MtxFormGroupComponent.propDecorators = {
    formFields: [{ type: ContentChildren, args: [MatFormField,] }],
    label: [{ type: Input }],
    showRequiredMarker: [{ type: Input }]
};

class MtxFormGroupModule {
}
MtxFormGroupModule.decorators = [
    { type: NgModule, args: [{
                imports: [CommonModule],
                exports: [MtxFormGroupComponent],
                declarations: [MtxFormGroupComponent],
            },] }
];

/**
 * Generated bundle index. Do not edit.
 */

export { MtxFormGroupComponent, MtxFormGroupModule };
//# sourceMappingURL=mtxFormGroup.js.map
