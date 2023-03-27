import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { MtxSelectComponent } from './select.component';
import { MtxSelectFooterTemplateDirective, MtxSelectHeaderTemplateDirective, MtxSelectLabelTemplateDirective, MtxSelectLoadingSpinnerTemplateDirective, MtxSelectLoadingTextTemplateDirective, MtxSelectMultiLabelTemplateDirective, MtxSelectNotFoundTemplateDirective, MtxSelectOptgroupTemplateDirective, MtxSelectOptionTemplateDirective, MtxSelectTagTemplateDirective, MtxSelectTypeToSearchTemplateDirective, } from './templates.directive';
import { MtxOptionComponent } from './option.component';
export class MtxSelectModule {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VsZWN0Lm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL2V4dGVuc2lvbnMvc2VsZWN0L3NlbGVjdC5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUN6QyxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDL0MsT0FBTyxFQUFFLFdBQVcsRUFBRSxtQkFBbUIsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBRWxFLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQztBQUV0RCxPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQztBQUN4RCxPQUFPLEVBQ0wsZ0NBQWdDLEVBQ2hDLGdDQUFnQyxFQUNoQywrQkFBK0IsRUFDL0Isd0NBQXdDLEVBQ3hDLHFDQUFxQyxFQUNyQyxvQ0FBb0MsRUFDcEMsa0NBQWtDLEVBQ2xDLGtDQUFrQyxFQUNsQyxnQ0FBZ0MsRUFDaEMsNkJBQTZCLEVBQzdCLHNDQUFzQyxHQUN2QyxNQUFNLHVCQUF1QixDQUFDO0FBQy9CLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLG9CQUFvQixDQUFDO0FBbUN4RCxNQUFNLE9BQU8sZUFBZTs7O1lBakMzQixRQUFRLFNBQUM7Z0JBQ1IsT0FBTyxFQUFFLENBQUMsWUFBWSxFQUFFLFdBQVcsRUFBRSxtQkFBbUIsRUFBRSxjQUFjLENBQUM7Z0JBQ3pFLE9BQU8sRUFBRTtvQkFDUCxrQkFBa0I7b0JBQ2xCLGtCQUFrQjtvQkFDbEIsa0NBQWtDO29CQUNsQyxnQ0FBZ0M7b0JBQ2hDLCtCQUErQjtvQkFDL0Isb0NBQW9DO29CQUNwQyxnQ0FBZ0M7b0JBQ2hDLGdDQUFnQztvQkFDaEMsa0NBQWtDO29CQUNsQyxzQ0FBc0M7b0JBQ3RDLHFDQUFxQztvQkFDckMsNkJBQTZCO29CQUM3Qix3Q0FBd0M7aUJBQ3pDO2dCQUNELFlBQVksRUFBRTtvQkFDWixrQkFBa0I7b0JBQ2xCLGtCQUFrQjtvQkFDbEIsa0NBQWtDO29CQUNsQyxnQ0FBZ0M7b0JBQ2hDLCtCQUErQjtvQkFDL0Isb0NBQW9DO29CQUNwQyxnQ0FBZ0M7b0JBQ2hDLGdDQUFnQztvQkFDaEMsa0NBQWtDO29CQUNsQyxzQ0FBc0M7b0JBQ3RDLHFDQUFxQztvQkFDckMsNkJBQTZCO29CQUM3Qix3Q0FBd0M7aUJBQ3pDO2FBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBOZ01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQ29tbW9uTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7IEZvcm1zTW9kdWxlLCBSZWFjdGl2ZUZvcm1zTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuXG5pbXBvcnQgeyBOZ1NlbGVjdE1vZHVsZSB9IGZyb20gJ0BuZy1zZWxlY3Qvbmctc2VsZWN0JztcblxuaW1wb3J0IHsgTXR4U2VsZWN0Q29tcG9uZW50IH0gZnJvbSAnLi9zZWxlY3QuY29tcG9uZW50JztcbmltcG9ydCB7XG4gIE10eFNlbGVjdEZvb3RlclRlbXBsYXRlRGlyZWN0aXZlLFxuICBNdHhTZWxlY3RIZWFkZXJUZW1wbGF0ZURpcmVjdGl2ZSxcbiAgTXR4U2VsZWN0TGFiZWxUZW1wbGF0ZURpcmVjdGl2ZSxcbiAgTXR4U2VsZWN0TG9hZGluZ1NwaW5uZXJUZW1wbGF0ZURpcmVjdGl2ZSxcbiAgTXR4U2VsZWN0TG9hZGluZ1RleHRUZW1wbGF0ZURpcmVjdGl2ZSxcbiAgTXR4U2VsZWN0TXVsdGlMYWJlbFRlbXBsYXRlRGlyZWN0aXZlLFxuICBNdHhTZWxlY3ROb3RGb3VuZFRlbXBsYXRlRGlyZWN0aXZlLFxuICBNdHhTZWxlY3RPcHRncm91cFRlbXBsYXRlRGlyZWN0aXZlLFxuICBNdHhTZWxlY3RPcHRpb25UZW1wbGF0ZURpcmVjdGl2ZSxcbiAgTXR4U2VsZWN0VGFnVGVtcGxhdGVEaXJlY3RpdmUsXG4gIE10eFNlbGVjdFR5cGVUb1NlYXJjaFRlbXBsYXRlRGlyZWN0aXZlLFxufSBmcm9tICcuL3RlbXBsYXRlcy5kaXJlY3RpdmUnO1xuaW1wb3J0IHsgTXR4T3B0aW9uQ29tcG9uZW50IH0gZnJvbSAnLi9vcHRpb24uY29tcG9uZW50JztcblxuQE5nTW9kdWxlKHtcbiAgaW1wb3J0czogW0NvbW1vbk1vZHVsZSwgRm9ybXNNb2R1bGUsIFJlYWN0aXZlRm9ybXNNb2R1bGUsIE5nU2VsZWN0TW9kdWxlXSxcbiAgZXhwb3J0czogW1xuICAgIE10eFNlbGVjdENvbXBvbmVudCxcbiAgICBNdHhPcHRpb25Db21wb25lbnQsXG4gICAgTXR4U2VsZWN0T3B0Z3JvdXBUZW1wbGF0ZURpcmVjdGl2ZSxcbiAgICBNdHhTZWxlY3RPcHRpb25UZW1wbGF0ZURpcmVjdGl2ZSxcbiAgICBNdHhTZWxlY3RMYWJlbFRlbXBsYXRlRGlyZWN0aXZlLFxuICAgIE10eFNlbGVjdE11bHRpTGFiZWxUZW1wbGF0ZURpcmVjdGl2ZSxcbiAgICBNdHhTZWxlY3RIZWFkZXJUZW1wbGF0ZURpcmVjdGl2ZSxcbiAgICBNdHhTZWxlY3RGb290ZXJUZW1wbGF0ZURpcmVjdGl2ZSxcbiAgICBNdHhTZWxlY3ROb3RGb3VuZFRlbXBsYXRlRGlyZWN0aXZlLFxuICAgIE10eFNlbGVjdFR5cGVUb1NlYXJjaFRlbXBsYXRlRGlyZWN0aXZlLFxuICAgIE10eFNlbGVjdExvYWRpbmdUZXh0VGVtcGxhdGVEaXJlY3RpdmUsXG4gICAgTXR4U2VsZWN0VGFnVGVtcGxhdGVEaXJlY3RpdmUsXG4gICAgTXR4U2VsZWN0TG9hZGluZ1NwaW5uZXJUZW1wbGF0ZURpcmVjdGl2ZSxcbiAgXSxcbiAgZGVjbGFyYXRpb25zOiBbXG4gICAgTXR4U2VsZWN0Q29tcG9uZW50LFxuICAgIE10eE9wdGlvbkNvbXBvbmVudCxcbiAgICBNdHhTZWxlY3RPcHRncm91cFRlbXBsYXRlRGlyZWN0aXZlLFxuICAgIE10eFNlbGVjdE9wdGlvblRlbXBsYXRlRGlyZWN0aXZlLFxuICAgIE10eFNlbGVjdExhYmVsVGVtcGxhdGVEaXJlY3RpdmUsXG4gICAgTXR4U2VsZWN0TXVsdGlMYWJlbFRlbXBsYXRlRGlyZWN0aXZlLFxuICAgIE10eFNlbGVjdEhlYWRlclRlbXBsYXRlRGlyZWN0aXZlLFxuICAgIE10eFNlbGVjdEZvb3RlclRlbXBsYXRlRGlyZWN0aXZlLFxuICAgIE10eFNlbGVjdE5vdEZvdW5kVGVtcGxhdGVEaXJlY3RpdmUsXG4gICAgTXR4U2VsZWN0VHlwZVRvU2VhcmNoVGVtcGxhdGVEaXJlY3RpdmUsXG4gICAgTXR4U2VsZWN0TG9hZGluZ1RleHRUZW1wbGF0ZURpcmVjdGl2ZSxcbiAgICBNdHhTZWxlY3RUYWdUZW1wbGF0ZURpcmVjdGl2ZSxcbiAgICBNdHhTZWxlY3RMb2FkaW5nU3Bpbm5lclRlbXBsYXRlRGlyZWN0aXZlLFxuICBdLFxufSlcbmV4cG9ydCBjbGFzcyBNdHhTZWxlY3RNb2R1bGUge31cbiJdfQ==