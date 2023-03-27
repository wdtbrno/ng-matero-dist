(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/common'), require('@angular/cdk/coercion'), require('@angular/material/form-field')) :
    typeof define === 'function' && define.amd ? define('@ng-matero/extensions/form-group', ['exports', '@angular/core', '@angular/common', '@angular/cdk/coercion', '@angular/material/form-field'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory((global['ng-matero'] = global['ng-matero'] || {}, global['ng-matero'].extensions = global['ng-matero'].extensions || {}, global['ng-matero'].extensions['form-group'] = {}), global.ng.core, global.ng.common, global.ng.cdk.coercion, global.ng.material.formField));
}(this, (function (exports, core, common, coercion, formField) { 'use strict';

    var MtxFormGroupComponent = /** @class */ (function () {
        function MtxFormGroupComponent() {
            this._showRequiredMarker = false;
        }
        Object.defineProperty(MtxFormGroupComponent.prototype, "showRequiredMarker", {
            get: function () {
                return this._showRequiredMarker;
            },
            set: function (value) {
                this._showRequiredMarker = coercion.coerceBooleanProperty(value);
            },
            enumerable: false,
            configurable: true
        });
        MtxFormGroupComponent.prototype.ngOnInit = function () { };
        MtxFormGroupComponent.prototype.ngAfterContentInit = function () {
            this.formFields.forEach(function (item) {
                item.appearance = 'standard';
            });
        };
        return MtxFormGroupComponent;
    }());
    MtxFormGroupComponent.decorators = [
        { type: core.Component, args: [{
                    selector: 'mtx-form-group',
                    host: {
                        class: 'mtx-form-group',
                    },
                    template: "<div class=\"mtx-form-field-layout mtx-form-field-appearance-fluent\">\r\n  <label *ngIf=\"label\"\r\n         class=\"mtx-form-label\"\r\n         [class.mtx-form-label-marker]=\"showRequiredMarker\">{{label}}</label>\r\n  <ng-content></ng-content>\r\n</div>\r\n",
                    encapsulation: core.ViewEncapsulation.None,
                    styles: [".mtx-form-group{display:inline-block}.mtx-form-group .mtx-form-field-layout{display:inline-flex;align-items:flex-start;width:100%}.mtx-form-group .mtx-form-label{position:relative;display:inline-block;padding-top:calc(.375em + 1px);padding-bottom:calc(.375em + 1px);padding-right:1em;line-height:1.125}[dir=rtl] .mtx-form-group .mtx-form-label{padding-right:unset;padding-left:1em}.mtx-form-group .mtx-form-label.mtx-form-label-marker:after{content:\"*\";margin-left:4px}[dir=rtl] .mtx-form-group .mtx-form-label.mtx-form-label-marker:after{margin-left:auto;margin-right:4px}.mtx-form-field-appearance-fluent .mat-form-field{margin-bottom:.25em}.mtx-form-field-appearance-fluent .mat-form-field .mat-form-field-suffix .mat-icon-button{height:1.5em;width:1.5em}.mtx-form-field-appearance-fluent .mat-form-field .mat-form-field-suffix .mat-icon-button .mat-datepicker-toggle-default-icon{width:1em}.mtx-form-field-appearance-fluent .mat-form-field-has-label .mat-form-field-flex{margin-top:.84375em}.mtx-form-field-appearance-fluent .mat-form-field-appearance-standard .mat-form-field-flex{padding-top:0}.mtx-form-field-appearance-fluent .mat-form-field-flex{align-items:center;padding:0 .5em;border-radius:2px}.mtx-form-field-appearance-fluent .mat-form-field-infix{border-top:0;padding:.375em 0}.mtx-form-field-appearance-fluent .mat-form-field-prefix,.mtx-form-field-appearance-fluent .mat-form-field-suffix{display:inline-flex}.mtx-form-field-appearance-fluent .mat-form-field-prefix .mat-icon,.mtx-form-field-appearance-fluent .mat-form-field-suffix .mat-icon{line-height:normal}.mtx-form-field-appearance-fluent .mat-form-field-underline{display:none}.mtx-form-field-appearance-fluent .mtx-select{display:block;margin:0 -8px}.mtx-form-field-appearance-fluent .ng-select{padding-top:.4375em;padding-left:8px;padding-right:8px;margin-top:-.4375em}"]
                },] }
    ];
    /** @nocollapse */
    MtxFormGroupComponent.ctorParameters = function () { return []; };
    MtxFormGroupComponent.propDecorators = {
        formFields: [{ type: core.ContentChildren, args: [formField.MatFormField,] }],
        label: [{ type: core.Input }],
        showRequiredMarker: [{ type: core.Input }]
    };

    var MtxFormGroupModule = /** @class */ (function () {
        function MtxFormGroupModule() {
        }
        return MtxFormGroupModule;
    }());
    MtxFormGroupModule.decorators = [
        { type: core.NgModule, args: [{
                    imports: [common.CommonModule],
                    exports: [MtxFormGroupComponent],
                    declarations: [MtxFormGroupComponent],
                },] }
    ];

    /**
     * Generated bundle index. Do not edit.
     */

    exports.MtxFormGroupComponent = MtxFormGroupComponent;
    exports.MtxFormGroupModule = MtxFormGroupModule;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=mtxFormGroup.umd.js.map
