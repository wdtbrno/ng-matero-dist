import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MtxPipesModule } from '@ng-matero/extensions/core';
import { MtxCheckboxGroup } from './checkbox-group';
import * as i0 from "@angular/core";
export class MtxCheckboxGroupModule {
}
/** @nocollapse */ MtxCheckboxGroupModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MtxCheckboxGroupModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
/** @nocollapse */ MtxCheckboxGroupModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "15.2.1", ngImport: i0, type: MtxCheckboxGroupModule, declarations: [MtxCheckboxGroup], imports: [CommonModule, FormsModule, MatCheckboxModule, MtxPipesModule], exports: [MtxCheckboxGroup, MtxPipesModule] });
/** @nocollapse */ MtxCheckboxGroupModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MtxCheckboxGroupModule, imports: [CommonModule, FormsModule, MatCheckboxModule, MtxPipesModule, MtxPipesModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MtxCheckboxGroupModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, FormsModule, MatCheckboxModule, MtxPipesModule],
                    exports: [MtxCheckboxGroup, MtxPipesModule],
                    declarations: [MtxCheckboxGroup],
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hlY2tib3gtZ3JvdXAtbW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vcHJvamVjdHMvZXh0ZW5zaW9ucy9jaGVja2JveC1ncm91cC9jaGVja2JveC1ncm91cC1tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUN6QyxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDL0MsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQzdDLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLDRCQUE0QixDQUFDO0FBRS9ELE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSw0QkFBNEIsQ0FBQztBQUM1RCxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxrQkFBa0IsQ0FBQzs7QUFPcEQsTUFBTSxPQUFPLHNCQUFzQjs7c0lBQXRCLHNCQUFzQjt1SUFBdEIsc0JBQXNCLGlCQUZsQixnQkFBZ0IsYUFGckIsWUFBWSxFQUFFLFdBQVcsRUFBRSxpQkFBaUIsRUFBRSxjQUFjLGFBQzVELGdCQUFnQixFQUFFLGNBQWM7dUlBRy9CLHNCQUFzQixZQUp2QixZQUFZLEVBQUUsV0FBVyxFQUFFLGlCQUFpQixFQUFFLGNBQWMsRUFDMUMsY0FBYzsyRkFHL0Isc0JBQXNCO2tCQUxsQyxRQUFRO21CQUFDO29CQUNSLE9BQU8sRUFBRSxDQUFDLFlBQVksRUFBRSxXQUFXLEVBQUUsaUJBQWlCLEVBQUUsY0FBYyxDQUFDO29CQUN2RSxPQUFPLEVBQUUsQ0FBQyxnQkFBZ0IsRUFBRSxjQUFjLENBQUM7b0JBQzNDLFlBQVksRUFBRSxDQUFDLGdCQUFnQixDQUFDO2lCQUNqQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE5nTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBDb21tb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHsgRm9ybXNNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQgeyBNYXRDaGVja2JveE1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2NoZWNrYm94JztcblxuaW1wb3J0IHsgTXR4UGlwZXNNb2R1bGUgfSBmcm9tICdAbmctbWF0ZXJvL2V4dGVuc2lvbnMvY29yZSc7XG5pbXBvcnQgeyBNdHhDaGVja2JveEdyb3VwIH0gZnJvbSAnLi9jaGVja2JveC1ncm91cCc7XG5cbkBOZ01vZHVsZSh7XG4gIGltcG9ydHM6IFtDb21tb25Nb2R1bGUsIEZvcm1zTW9kdWxlLCBNYXRDaGVja2JveE1vZHVsZSwgTXR4UGlwZXNNb2R1bGVdLFxuICBleHBvcnRzOiBbTXR4Q2hlY2tib3hHcm91cCwgTXR4UGlwZXNNb2R1bGVdLFxuICBkZWNsYXJhdGlvbnM6IFtNdHhDaGVja2JveEdyb3VwXSxcbn0pXG5leHBvcnQgY2xhc3MgTXR4Q2hlY2tib3hHcm91cE1vZHVsZSB7fVxuIl19