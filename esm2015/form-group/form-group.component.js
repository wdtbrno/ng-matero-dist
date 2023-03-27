import { Component, ContentChildren, Input, QueryList, ViewEncapsulation, } from '@angular/core';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { MatFormField } from '@angular/material/form-field';
export class MtxFormGroupComponent {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybS1ncm91cC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wcm9qZWN0cy9leHRlbnNpb25zL2Zvcm0tZ3JvdXAvZm9ybS1ncm91cC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUVMLFNBQVMsRUFDVCxlQUFlLEVBQ2YsS0FBSyxFQUVMLFNBQVMsRUFDVCxpQkFBaUIsR0FDbEIsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFnQixxQkFBcUIsRUFBRSxNQUFNLHVCQUF1QixDQUFDO0FBQzVFLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSw4QkFBOEIsQ0FBQztBQVc1RCxNQUFNLE9BQU8scUJBQXFCO0lBYWhDO1FBRlEsd0JBQW1CLEdBQUcsS0FBSyxDQUFDO0lBRXJCLENBQUM7SUFUaEIsSUFDSSxrQkFBa0I7UUFDcEIsT0FBTyxJQUFJLENBQUMsbUJBQW1CLENBQUM7SUFDbEMsQ0FBQztJQUNELElBQUksa0JBQWtCLENBQUMsS0FBYztRQUNuQyxJQUFJLENBQUMsbUJBQW1CLEdBQUcscUJBQXFCLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDMUQsQ0FBQztJQUtELFFBQVEsS0FBVSxDQUFDO0lBRW5CLGtCQUFrQjtRQUNoQixJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRTtZQUM3QixJQUFJLENBQUMsVUFBVSxHQUFHLFVBQVUsQ0FBQztRQUMvQixDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7OztZQTlCRixTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLGdCQUFnQjtnQkFDMUIsSUFBSSxFQUFFO29CQUNKLEtBQUssRUFBRSxnQkFBZ0I7aUJBQ3hCO2dCQUNELG1SQUEwQztnQkFFMUMsYUFBYSxFQUFFLGlCQUFpQixDQUFDLElBQUk7O2FBQ3RDOzs7Ozt5QkFFRSxlQUFlLFNBQUMsWUFBWTtvQkFFNUIsS0FBSztpQ0FDTCxLQUFLIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcclxuICBBZnRlckNvbnRlbnRJbml0LFxyXG4gIENvbXBvbmVudCxcclxuICBDb250ZW50Q2hpbGRyZW4sXHJcbiAgSW5wdXQsXHJcbiAgT25Jbml0LFxyXG4gIFF1ZXJ5TGlzdCxcclxuICBWaWV3RW5jYXBzdWxhdGlvbixcclxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgQm9vbGVhbklucHV0LCBjb2VyY2VCb29sZWFuUHJvcGVydHkgfSBmcm9tICdAYW5ndWxhci9jZGsvY29lcmNpb24nO1xyXG5pbXBvcnQgeyBNYXRGb3JtRmllbGQgfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9mb3JtLWZpZWxkJztcclxuXHJcbkBDb21wb25lbnQoe1xyXG4gIHNlbGVjdG9yOiAnbXR4LWZvcm0tZ3JvdXAnLFxyXG4gIGhvc3Q6IHtcclxuICAgIGNsYXNzOiAnbXR4LWZvcm0tZ3JvdXAnLFxyXG4gIH0sXHJcbiAgdGVtcGxhdGVVcmw6ICcuL2Zvcm0tZ3JvdXAuY29tcG9uZW50Lmh0bWwnLFxyXG4gIHN0eWxlVXJsczogWycuL2Zvcm0tZ3JvdXAuY29tcG9uZW50LnNjc3MnXSxcclxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxyXG59KVxyXG5leHBvcnQgY2xhc3MgTXR4Rm9ybUdyb3VwQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBBZnRlckNvbnRlbnRJbml0IHtcclxuICBAQ29udGVudENoaWxkcmVuKE1hdEZvcm1GaWVsZCkgZm9ybUZpZWxkcyE6IFF1ZXJ5TGlzdDxNYXRGb3JtRmllbGQ+O1xyXG5cclxuICBASW5wdXQoKSBsYWJlbDogc3RyaW5nO1xyXG4gIEBJbnB1dCgpXHJcbiAgZ2V0IHNob3dSZXF1aXJlZE1hcmtlcigpIHtcclxuICAgIHJldHVybiB0aGlzLl9zaG93UmVxdWlyZWRNYXJrZXI7XHJcbiAgfVxyXG4gIHNldCBzaG93UmVxdWlyZWRNYXJrZXIodmFsdWU6IGJvb2xlYW4pIHtcclxuICAgIHRoaXMuX3Nob3dSZXF1aXJlZE1hcmtlciA9IGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSh2YWx1ZSk7XHJcbiAgfVxyXG4gIHByaXZhdGUgX3Nob3dSZXF1aXJlZE1hcmtlciA9IGZhbHNlO1xyXG5cclxuICBjb25zdHJ1Y3RvcigpIHt9XHJcblxyXG4gIG5nT25Jbml0KCk6IHZvaWQge31cclxuXHJcbiAgbmdBZnRlckNvbnRlbnRJbml0KCkge1xyXG4gICAgdGhpcy5mb3JtRmllbGRzLmZvckVhY2goaXRlbSA9PiB7XHJcbiAgICAgIGl0ZW0uYXBwZWFyYW5jZSA9ICdzdGFuZGFyZCc7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9zaG93UmVxdWlyZWRNYXJrZXI6IEJvb2xlYW5JbnB1dDtcclxufVxyXG4iXX0=