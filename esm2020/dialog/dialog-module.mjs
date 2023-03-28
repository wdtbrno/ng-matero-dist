import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MtxPipesModule } from '@ng-matero/extensions/core';
import { MtxDialogContainer } from './dialog-container';
import { MtxDialog } from './dialog';
import * as i0 from "@angular/core";
export class MtxDialogModule {
}
/** @nocollapse */ MtxDialogModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MtxDialogModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
/** @nocollapse */ MtxDialogModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "15.2.1", ngImport: i0, type: MtxDialogModule, declarations: [MtxDialogContainer], imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule, MtxPipesModule], exports: [MtxDialogContainer] });
/** @nocollapse */ MtxDialogModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MtxDialogModule, providers: [MtxDialog], imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule, MtxPipesModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MtxDialogModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule, MtxPipesModule],
                    exports: [MtxDialogContainer],
                    declarations: [MtxDialogContainer],
                    providers: [MtxDialog],
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlhbG9nLW1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL2V4dGVuc2lvbnMvZGlhbG9nL2RpYWxvZy1tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUN6QyxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDL0MsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLDBCQUEwQixDQUFDO0FBQzNELE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQztBQUMzRCxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sd0JBQXdCLENBQUM7QUFFdkQsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLDRCQUE0QixDQUFDO0FBQzVELE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLG9CQUFvQixDQUFDO0FBQ3hELE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxVQUFVLENBQUM7O0FBUXJDLE1BQU0sT0FBTyxlQUFlOzsrSEFBZixlQUFlO2dJQUFmLGVBQWUsaUJBSFgsa0JBQWtCLGFBRnZCLFlBQVksRUFBRSxlQUFlLEVBQUUsZUFBZSxFQUFFLGFBQWEsRUFBRSxjQUFjLGFBQzdFLGtCQUFrQjtnSUFJakIsZUFBZSxhQUZmLENBQUMsU0FBUyxDQUFDLFlBSFosWUFBWSxFQUFFLGVBQWUsRUFBRSxlQUFlLEVBQUUsYUFBYSxFQUFFLGNBQWM7MkZBSzVFLGVBQWU7a0JBTjNCLFFBQVE7bUJBQUM7b0JBQ1IsT0FBTyxFQUFFLENBQUMsWUFBWSxFQUFFLGVBQWUsRUFBRSxlQUFlLEVBQUUsYUFBYSxFQUFFLGNBQWMsQ0FBQztvQkFDeEYsT0FBTyxFQUFFLENBQUMsa0JBQWtCLENBQUM7b0JBQzdCLFlBQVksRUFBRSxDQUFDLGtCQUFrQixDQUFDO29CQUNsQyxTQUFTLEVBQUUsQ0FBQyxTQUFTLENBQUM7aUJBQ3ZCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTmdNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQgeyBNYXREaWFsb2dNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9kaWFsb2cnO1xuaW1wb3J0IHsgTWF0QnV0dG9uTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvYnV0dG9uJztcbmltcG9ydCB7IE1hdEljb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9pY29uJztcblxuaW1wb3J0IHsgTXR4UGlwZXNNb2R1bGUgfSBmcm9tICdAbmctbWF0ZXJvL2V4dGVuc2lvbnMvY29yZSc7XG5pbXBvcnQgeyBNdHhEaWFsb2dDb250YWluZXIgfSBmcm9tICcuL2RpYWxvZy1jb250YWluZXInO1xuaW1wb3J0IHsgTXR4RGlhbG9nIH0gZnJvbSAnLi9kaWFsb2cnO1xuXG5ATmdNb2R1bGUoe1xuICBpbXBvcnRzOiBbQ29tbW9uTW9kdWxlLCBNYXREaWFsb2dNb2R1bGUsIE1hdEJ1dHRvbk1vZHVsZSwgTWF0SWNvbk1vZHVsZSwgTXR4UGlwZXNNb2R1bGVdLFxuICBleHBvcnRzOiBbTXR4RGlhbG9nQ29udGFpbmVyXSxcbiAgZGVjbGFyYXRpb25zOiBbTXR4RGlhbG9nQ29udGFpbmVyXSxcbiAgcHJvdmlkZXJzOiBbTXR4RGlhbG9nXSxcbn0pXG5leHBvcnQgY2xhc3MgTXR4RGlhbG9nTW9kdWxlIHt9XG4iXX0=