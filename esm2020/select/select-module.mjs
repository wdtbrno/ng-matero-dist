import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { MtxSelect } from './select';
import { MtxSelectFooterTemplate, MtxSelectHeaderTemplate, MtxSelectLabelTemplate, MtxSelectLoadingSpinnerTemplate, MtxSelectLoadingTextTemplate, MtxSelectMultiLabelTemplate, MtxSelectNotFoundTemplate, MtxSelectOptgroupTemplate, MtxSelectOptionTemplate, MtxSelectTagTemplate, MtxSelectTypeToSearchTemplate, } from './templates';
import { MtxOption } from './option';
import * as i0 from "@angular/core";
export class MtxSelectModule {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VsZWN0LW1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL2V4dGVuc2lvbnMvc2VsZWN0L3NlbGVjdC1tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUN6QyxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDL0MsT0FBTyxFQUFFLFdBQVcsRUFBRSxtQkFBbUIsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBRWxFLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQztBQUV0RCxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sVUFBVSxDQUFDO0FBQ3JDLE9BQU8sRUFDTCx1QkFBdUIsRUFDdkIsdUJBQXVCLEVBQ3ZCLHNCQUFzQixFQUN0QiwrQkFBK0IsRUFDL0IsNEJBQTRCLEVBQzVCLDJCQUEyQixFQUMzQix5QkFBeUIsRUFDekIseUJBQXlCLEVBQ3pCLHVCQUF1QixFQUN2QixvQkFBb0IsRUFDcEIsNkJBQTZCLEdBQzlCLE1BQU0sYUFBYSxDQUFDO0FBQ3JCLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxVQUFVLENBQUM7O0FBbUNyQyxNQUFNLE9BQU8sZUFBZTs7K0hBQWYsZUFBZTtnSUFBZixlQUFlLGlCQWZ4QixTQUFTO1FBQ1QsU0FBUztRQUNULHlCQUF5QjtRQUN6Qix1QkFBdUI7UUFDdkIsc0JBQXNCO1FBQ3RCLDJCQUEyQjtRQUMzQix1QkFBdUI7UUFDdkIsdUJBQXVCO1FBQ3ZCLHlCQUF5QjtRQUN6Qiw2QkFBNkI7UUFDN0IsNEJBQTRCO1FBQzVCLG9CQUFvQjtRQUNwQiwrQkFBK0IsYUE3QnZCLFlBQVksRUFBRSxXQUFXLEVBQUUsbUJBQW1CLEVBQUUsY0FBYyxhQUV0RSxTQUFTO1FBQ1QsU0FBUztRQUNULHlCQUF5QjtRQUN6Qix1QkFBdUI7UUFDdkIsc0JBQXNCO1FBQ3RCLDJCQUEyQjtRQUMzQix1QkFBdUI7UUFDdkIsdUJBQXVCO1FBQ3ZCLHlCQUF5QjtRQUN6Qiw2QkFBNkI7UUFDN0IsNEJBQTRCO1FBQzVCLG9CQUFvQjtRQUNwQiwrQkFBK0I7Z0lBa0J0QixlQUFlLFlBaENoQixZQUFZLEVBQUUsV0FBVyxFQUFFLG1CQUFtQixFQUFFLGNBQWM7MkZBZ0M3RCxlQUFlO2tCQWpDM0IsUUFBUTttQkFBQztvQkFDUixPQUFPLEVBQUUsQ0FBQyxZQUFZLEVBQUUsV0FBVyxFQUFFLG1CQUFtQixFQUFFLGNBQWMsQ0FBQztvQkFDekUsT0FBTyxFQUFFO3dCQUNQLFNBQVM7d0JBQ1QsU0FBUzt3QkFDVCx5QkFBeUI7d0JBQ3pCLHVCQUF1Qjt3QkFDdkIsc0JBQXNCO3dCQUN0QiwyQkFBMkI7d0JBQzNCLHVCQUF1Qjt3QkFDdkIsdUJBQXVCO3dCQUN2Qix5QkFBeUI7d0JBQ3pCLDZCQUE2Qjt3QkFDN0IsNEJBQTRCO3dCQUM1QixvQkFBb0I7d0JBQ3BCLCtCQUErQjtxQkFDaEM7b0JBQ0QsWUFBWSxFQUFFO3dCQUNaLFNBQVM7d0JBQ1QsU0FBUzt3QkFDVCx5QkFBeUI7d0JBQ3pCLHVCQUF1Qjt3QkFDdkIsc0JBQXNCO3dCQUN0QiwyQkFBMkI7d0JBQzNCLHVCQUF1Qjt3QkFDdkIsdUJBQXVCO3dCQUN2Qix5QkFBeUI7d0JBQ3pCLDZCQUE2Qjt3QkFDN0IsNEJBQTRCO3dCQUM1QixvQkFBb0I7d0JBQ3BCLCtCQUErQjtxQkFDaEM7aUJBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBOZ01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQ29tbW9uTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7IEZvcm1zTW9kdWxlLCBSZWFjdGl2ZUZvcm1zTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuXG5pbXBvcnQgeyBOZ1NlbGVjdE1vZHVsZSB9IGZyb20gJ0BuZy1zZWxlY3Qvbmctc2VsZWN0JztcblxuaW1wb3J0IHsgTXR4U2VsZWN0IH0gZnJvbSAnLi9zZWxlY3QnO1xuaW1wb3J0IHtcbiAgTXR4U2VsZWN0Rm9vdGVyVGVtcGxhdGUsXG4gIE10eFNlbGVjdEhlYWRlclRlbXBsYXRlLFxuICBNdHhTZWxlY3RMYWJlbFRlbXBsYXRlLFxuICBNdHhTZWxlY3RMb2FkaW5nU3Bpbm5lclRlbXBsYXRlLFxuICBNdHhTZWxlY3RMb2FkaW5nVGV4dFRlbXBsYXRlLFxuICBNdHhTZWxlY3RNdWx0aUxhYmVsVGVtcGxhdGUsXG4gIE10eFNlbGVjdE5vdEZvdW5kVGVtcGxhdGUsXG4gIE10eFNlbGVjdE9wdGdyb3VwVGVtcGxhdGUsXG4gIE10eFNlbGVjdE9wdGlvblRlbXBsYXRlLFxuICBNdHhTZWxlY3RUYWdUZW1wbGF0ZSxcbiAgTXR4U2VsZWN0VHlwZVRvU2VhcmNoVGVtcGxhdGUsXG59IGZyb20gJy4vdGVtcGxhdGVzJztcbmltcG9ydCB7IE10eE9wdGlvbiB9IGZyb20gJy4vb3B0aW9uJztcblxuQE5nTW9kdWxlKHtcbiAgaW1wb3J0czogW0NvbW1vbk1vZHVsZSwgRm9ybXNNb2R1bGUsIFJlYWN0aXZlRm9ybXNNb2R1bGUsIE5nU2VsZWN0TW9kdWxlXSxcbiAgZXhwb3J0czogW1xuICAgIE10eFNlbGVjdCxcbiAgICBNdHhPcHRpb24sXG4gICAgTXR4U2VsZWN0T3B0Z3JvdXBUZW1wbGF0ZSxcbiAgICBNdHhTZWxlY3RPcHRpb25UZW1wbGF0ZSxcbiAgICBNdHhTZWxlY3RMYWJlbFRlbXBsYXRlLFxuICAgIE10eFNlbGVjdE11bHRpTGFiZWxUZW1wbGF0ZSxcbiAgICBNdHhTZWxlY3RIZWFkZXJUZW1wbGF0ZSxcbiAgICBNdHhTZWxlY3RGb290ZXJUZW1wbGF0ZSxcbiAgICBNdHhTZWxlY3ROb3RGb3VuZFRlbXBsYXRlLFxuICAgIE10eFNlbGVjdFR5cGVUb1NlYXJjaFRlbXBsYXRlLFxuICAgIE10eFNlbGVjdExvYWRpbmdUZXh0VGVtcGxhdGUsXG4gICAgTXR4U2VsZWN0VGFnVGVtcGxhdGUsXG4gICAgTXR4U2VsZWN0TG9hZGluZ1NwaW5uZXJUZW1wbGF0ZSxcbiAgXSxcbiAgZGVjbGFyYXRpb25zOiBbXG4gICAgTXR4U2VsZWN0LFxuICAgIE10eE9wdGlvbixcbiAgICBNdHhTZWxlY3RPcHRncm91cFRlbXBsYXRlLFxuICAgIE10eFNlbGVjdE9wdGlvblRlbXBsYXRlLFxuICAgIE10eFNlbGVjdExhYmVsVGVtcGxhdGUsXG4gICAgTXR4U2VsZWN0TXVsdGlMYWJlbFRlbXBsYXRlLFxuICAgIE10eFNlbGVjdEhlYWRlclRlbXBsYXRlLFxuICAgIE10eFNlbGVjdEZvb3RlclRlbXBsYXRlLFxuICAgIE10eFNlbGVjdE5vdEZvdW5kVGVtcGxhdGUsXG4gICAgTXR4U2VsZWN0VHlwZVRvU2VhcmNoVGVtcGxhdGUsXG4gICAgTXR4U2VsZWN0TG9hZGluZ1RleHRUZW1wbGF0ZSxcbiAgICBNdHhTZWxlY3RUYWdUZW1wbGF0ZSxcbiAgICBNdHhTZWxlY3RMb2FkaW5nU3Bpbm5lclRlbXBsYXRlLFxuICBdLFxufSlcbmV4cG9ydCBjbGFzcyBNdHhTZWxlY3RNb2R1bGUge31cbiJdfQ==