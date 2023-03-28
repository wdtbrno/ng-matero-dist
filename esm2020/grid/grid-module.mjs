import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatMenuModule } from '@angular/material/menu';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MtxPipesModule } from '@ng-matero/extensions/core';
import { MtxDialogModule } from '@ng-matero/extensions/dialog';
import { MtxGrid, MtxGridSelectableCell } from './grid';
import { MtxGridCell } from './cell';
import { MtxGridColumnMenu } from './column-menu';
import { MtxGridExpansionToggle } from './expansion-toggle';
import { MtxGridUtils } from './grid-utils';
import { MatColumnResizeModule } from './column-resize/column-resize-module';
import { MtxGridCellActionDisablePipe, MtxGridCellActionTooltipPipe, MtxGridCellSummaryPipe, MtxGridColClassPipe, MtxGridRowClassPipe, } from './grid-pipes';
import * as i0 from "@angular/core";
export class MtxGridModule {
}
/** @nocollapse */ MtxGridModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MtxGridModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
/** @nocollapse */ MtxGridModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "15.2.1", ngImport: i0, type: MtxGridModule, declarations: [MtxGrid,
        MtxGridCell,
        MtxGridColumnMenu,
        MtxGridExpansionToggle,
        MtxGridSelectableCell,
        MtxGridRowClassPipe,
        MtxGridColClassPipe,
        MtxGridCellActionTooltipPipe,
        MtxGridCellActionDisablePipe,
        MtxGridCellSummaryPipe], imports: [CommonModule,
        FormsModule,
        MatTableModule,
        MatSortModule,
        MatPaginatorModule,
        MatCheckboxModule,
        MatButtonModule,
        MatProgressBarModule,
        MatChipsModule,
        MatTooltipModule,
        MatIconModule,
        MatSelectModule,
        MatFormFieldModule,
        MatMenuModule,
        DragDropModule,
        MtxDialogModule,
        MtxPipesModule,
        MatColumnResizeModule], exports: [MtxGrid,
        MtxGridCell,
        MtxGridColumnMenu,
        MtxGridExpansionToggle,
        MtxGridSelectableCell,
        MatColumnResizeModule,
        MtxGridRowClassPipe,
        MtxGridColClassPipe,
        MtxGridCellActionTooltipPipe,
        MtxGridCellActionDisablePipe,
        MtxGridCellSummaryPipe] });
/** @nocollapse */ MtxGridModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MtxGridModule, providers: [MtxGridUtils], imports: [CommonModule,
        FormsModule,
        MatTableModule,
        MatSortModule,
        MatPaginatorModule,
        MatCheckboxModule,
        MatButtonModule,
        MatProgressBarModule,
        MatChipsModule,
        MatTooltipModule,
        MatIconModule,
        MatSelectModule,
        MatFormFieldModule,
        MatMenuModule,
        DragDropModule,
        MtxDialogModule,
        MtxPipesModule,
        MatColumnResizeModule, MatColumnResizeModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MtxGridModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [
                        CommonModule,
                        FormsModule,
                        MatTableModule,
                        MatSortModule,
                        MatPaginatorModule,
                        MatCheckboxModule,
                        MatButtonModule,
                        MatProgressBarModule,
                        MatChipsModule,
                        MatTooltipModule,
                        MatIconModule,
                        MatSelectModule,
                        MatFormFieldModule,
                        MatMenuModule,
                        DragDropModule,
                        MtxDialogModule,
                        MtxPipesModule,
                        MatColumnResizeModule,
                    ],
                    exports: [
                        MtxGrid,
                        MtxGridCell,
                        MtxGridColumnMenu,
                        MtxGridExpansionToggle,
                        MtxGridSelectableCell,
                        MatColumnResizeModule,
                        MtxGridRowClassPipe,
                        MtxGridColClassPipe,
                        MtxGridCellActionTooltipPipe,
                        MtxGridCellActionDisablePipe,
                        MtxGridCellSummaryPipe,
                    ],
                    declarations: [
                        MtxGrid,
                        MtxGridCell,
                        MtxGridColumnMenu,
                        MtxGridExpansionToggle,
                        MtxGridSelectableCell,
                        MtxGridRowClassPipe,
                        MtxGridColClassPipe,
                        MtxGridCellActionTooltipPipe,
                        MtxGridCellActionDisablePipe,
                        MtxGridCellSummaryPipe,
                    ],
                    providers: [MtxGridUtils],
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JpZC1tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wcm9qZWN0cy9leHRlbnNpb25zL2dyaWQvZ3JpZC1tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUN6QyxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDL0MsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQzdDLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSx5QkFBeUIsQ0FBQztBQUN6RCxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sd0JBQXdCLENBQUM7QUFDdkQsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sNkJBQTZCLENBQUM7QUFDakUsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sNEJBQTRCLENBQUM7QUFDL0QsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLDBCQUEwQixDQUFDO0FBQzNELE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxNQUFNLGdDQUFnQyxDQUFDO0FBQ3RFLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSx5QkFBeUIsQ0FBQztBQUN6RCxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSwyQkFBMkIsQ0FBQztBQUM3RCxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sd0JBQXdCLENBQUM7QUFDdkQsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLDBCQUEwQixDQUFDO0FBQzNELE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLDhCQUE4QixDQUFDO0FBQ2xFLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSx3QkFBd0IsQ0FBQztBQUN2RCxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sd0JBQXdCLENBQUM7QUFFeEQsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLDRCQUE0QixDQUFDO0FBQzVELE9BQU8sRUFBRSxlQUFl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TmdNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQgeyBGb3Jtc01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCB7IE1hdFRhYmxlTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvdGFibGUnO1xuaW1wb3J0IHsgTWF0U29ydE1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL3NvcnQnO1xuaW1wb3J0IHsgTWF0UGFnaW5hdG9yTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvcGFnaW5hdG9yJztcbmltcG9ydCB7IE1hdENoZWNrYm94TW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvY2hlY2tib3gnO1xuaW1wb3J0IHsgTWF0QnV0dG9uTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvYnV0dG9uJztcbmltcG9ydCB7IE1hdFByb2dyZXNzQmFyTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvcHJvZ3Jlc3MtYmFyJztcbmltcG9ydCB7IE1hdENoaXBzTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvY2hpcHMnO1xuaW1wb3J0IHsgTWF0VG9vbHRpcE1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL3Rvb2x0aXAnO1xuaW1wb3J0IHsgTWF0SWNvbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2ljb24nO1xuaW1wb3J0IHsgTWF0U2VsZWN0TW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvc2VsZWN0JztcbmltcG9ydCB7IE1hdEZvcm1GaWVsZE1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2Zvcm0tZmllbGQnO1xuaW1wb3J0IHsgTWF0TWVudU1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL21lbnUnO1xuaW1wb3J0IHsgRHJhZ0Ryb3BNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jZGsvZHJhZy1kcm9wJztcblxuaW1wb3J0IHsgTXR4UGlwZXNNb2R1bGUgfSBmcm9tICdAbmctbWF0ZXJvL2V4dGVuc2lvbnMvY29yZSc7XG5pbXBvcnQgeyBNdHhEaWFsb2dNb2R1bGUgfSBmcm9tICdAbmctbWF0ZXJvL2V4dGVuc2lvbnMvZGlhbG9nJztcbmltcG9ydCB7IE10eEdyaWQsIE10eEdyaWRTZWxlY3RhYmxlQ2VsbCB9IGZyb20gJy4vZ3JpZCc7XG5pbXBvcnQgeyBNdHhHcmlkQ2VsbCB9IGZyb20gJy4vY2VsbCc7XG5pbXBvcnQgeyBNdHhHcmlkQ29sdW1uTWVudSB9IGZyb20gJy4vY29sdW1uLW1lbnUnO1xuaW1wb3J0IHsgTXR4R3JpZEV4cGFuc2lvblRvZ2dsZSB9IGZyb20gJy4vZXhwYW5zaW9uLXRvZ2dsZSc7XG5pbXBvcnQgeyBNdHhHcmlkVXRpbHMgfSBmcm9tICcuL2dyaWQtdXRpbHMnO1xuaW1wb3J0IHsgTWF0Q29sdW1uUmVzaXplTW9kdWxlIH0gZnJvbSAnLi9jb2x1bW4tcmVzaXplL2NvbHVtbi1yZXNpemUtbW9kdWxlJztcbmltcG9ydCB7XG4gIE10eEdyaWRDZWxsQWN0aW9uRGlzYWJsZVBpcGUsXG4gIE10eEdyaWRDZWxsQWN0aW9uVG9vbHRpcFBpcGUsXG4gIE10eEdyaWRDZWxsU3VtbWFyeVBpcGUsXG4gIE10eEdyaWRDb2xDbGFzc1BpcGUsXG4gIE10eEdyaWRSb3dDbGFzc1BpcGUsXG59IGZyb20gJy4vZ3JpZC1waXBlcyc7XG5cbkBOZ01vZHVsZSh7XG4gIGltcG9ydHM6IFtcbiAgICBDb21tb25Nb2R1bGUsXG4gICAgRm9ybXNNb2R1bGUsXG4gICAgTWF0VGFibGVNb2R1bGUsXG4gICAgTWF0U29ydE1vZHVsZSxcbiAgICBNYXRQYWdpbmF0b3JNb2R1bGUsXG4gICAgTWF0Q2hlY2tib3hNb2R1bGUsXG4gICAgTWF0QnV0dG9uTW9kdWxlLFxuICAgIE1hdFByb2dyZXNzQmFyTW9kdWxlLFxuICAgIE1hdENoaXBzTW9kdWxlLFxuICAgIE1hdFRvb2x0aXBNb2R1bGUsXG4gICAgTWF0SWNvbk1vZHVsZSxcbiAgICBNYXRTZWxlY3RNb2R1bGUsXG4gICAgTWF0Rm9ybUZpZWxkTW9kdWxlLFxuICAgIE1hdE1lbnVNb2R1bGUsXG4gICAgRHJhZ0Ryb3BNb2R1bGUsXG4gICAgTXR4RGlhbG9nTW9kdWxlLFxuICAgIE10eFBpcGVzTW9kdWxlLFxuICAgIE1hdENvbHVtblJlc2l6ZU1vZHVsZSxcbiAgXSxcbiAgZXhwb3J0czogW1xuICAgIE10eEdyaWQsXG4gICAgTXR4R3JpZENlbGwsXG4gICAgTXR4R3JpZENvbHVtbk1lbnUsXG4gICAgTXR4R3JpZEV4cGFuc2lvblRvZ2dsZSxcbiAgICBNdHhHcmlkU2VsZWN0YWJsZUNlbGwsXG4gICAgTWF0Q29sdW1uUmVzaXplTW9kdWxlLFxuICAgIE10eEdyaWRSb3dDbGFzc1BpcGUsXG4gICAgTXR4R3JpZENvbENsYXNzUGlwZSxcbiAgICBNdHhHcmlkQ2VsbEFjdGlvblRvb2x0aXBQaXBlLFxuICAgIE10eEdyaWRDZWxsQWN0aW9uRGlzYWJsZVBpcGUsXG4gICAgTXR4R3JpZENlbGxTdW1tYXJ5UGlwZSxcbiAgXSxcbiAgZGVjbGFyYXRpb25zOiBbXG4gICAgTXR4R3JpZCxcbiAgICBNdHhHcmlkQ2VsbCxcbiAgICBNdHhHcmlkQ29sdW1uTWVudSxcbiAgICBNdHhHcmlkRXhwYW5zaW9uVG9nZ2xlLFxuICAgIE10eEdyaWRTZWxlY3RhYmxlQ2VsbCxcbiAgICBNdHhHcmlkUm93Q2xhc3NQaXBlLFxuICAgIE10eEdyaWRDb2xDbGFzc1BpcGUsXG4gICAgTXR4R3JpZENlbGxBY3Rpb25Ub29sdGlwUGlwZSxcbiAgICBNdHhHcmlkQ2VsbEFjdGlvbkRpc2FibGVQaXBlLFxuICAgIE10eEdyaWRDZWxsU3VtbWFyeVBpcGUsXG4gIF0sXG4gIHByb3ZpZGVyczogW010eEdyaWRVdGlsc10sXG59KVxuZXhwb3J0IGNsYXNzIE10eEdyaWRNb2R1bGUge31cbiJdfQ==