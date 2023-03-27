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
import { MtxUtilsModule } from '@ng-matero/extensions/utils';
import { MtxDialogModule } from '@ng-matero/extensions/dialog';
import { MtxGridComponent } from './grid.component';
import { MtxGridCellComponent } from './cell.component';
import { MtxGridColumnMenuComponent } from './column-menu.component';
import { MtxGridExpansionToggleDirective } from './expansion-toggle.directive';
import { MtxGridCellSelectionDirective } from './cell-selection.directive';
import { MtxGridService } from './grid.service';
import { MatColumnResizeModule } from './column-resize/column-resize-module';
export class MtxGridModule {
}
MtxGridModule.decorators = [
    { type: NgModule, args: [{
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
                    MtxUtilsModule,
                    MatColumnResizeModule,
                ],
                exports: [
                    MtxGridComponent,
                    MtxGridCellComponent,
                    MtxGridColumnMenuComponent,
                    MtxGridExpansionToggleDirective,
                    MtxGridCellSelectionDirective,
                    MatColumnResizeModule,
                ],
                declarations: [
                    MtxGridComponent,
                    MtxGridCellComponent,
                    MtxGridColumnMenuComponent,
                    MtxGridExpansionToggleDirective,
                    MtxGridCellSelectionDirective,
                ],
                providers: [MtxGridService],
            },] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JpZC5tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wcm9qZWN0cy9leHRlbnNpb25zL2RhdGEtZ3JpZC9ncmlkLm1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3pDLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUMvQyxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDN0MsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLHlCQUF5QixDQUFDO0FBQ3pELE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSx3QkFBd0IsQ0FBQztBQUN2RCxPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSw2QkFBNkIsQ0FBQztBQUNqRSxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSw0QkFBNEIsQ0FBQztBQUMvRCxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sMEJBQTBCLENBQUM7QUFDM0QsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0sZ0NBQWdDLENBQUM7QUFDdEUsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLHlCQUF5QixDQUFDO0FBQ3pELE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLDJCQUEyQixDQUFDO0FBQzdELE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSx3QkFBd0IsQ0FBQztBQUN2RCxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sMEJBQTBCLENBQUM7QUFDM0QsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sOEJBQThCLENBQUM7QUFDbEUsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLHdCQUF3QixDQUFDO0FBQ3ZELE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSx3QkFBd0IsQ0FBQztBQUV4RCxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sNkJBQTZCLENBQUM7QUFDN0QsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLDhCQUE4QixDQUFDO0FBQy9ELE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLGtCQUFrQixDQUFDO0FBQ3BELE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxNQUFNLGtCQUFrQixDQUFDO0FBQ3hELE9BQU8sRUFBRSwwQkFBMEIsRUFBRSxNQUFNLHlCQUF5QixDQUFDO0FBQ3JFLE9BQU8sRUFBRSwrQkFBK0IsRUFBRSxNQUFNLDhCQUE4QixDQUFDO0FBQy9FLE9BQU8sRUFBRSw2QkFBNkIsRUFBRSxNQUFNLDRCQUE0QixDQUFDO0FBQzNFLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUNoRCxPQUFPLEVBQUUscUJBQXFCLEVBQUUsTUFBTSxzQ0FBc0MsQ0FBQztBQXdDN0UsTUFBTSxPQUFPLGFBQWE7OztZQXRDekIsUUFBUSxTQUFDO2dCQUNSLE9BQU8sRUFBRTtvQkFDUCxZQUFZO29CQUNaLFdBQVc7b0JBQ1gsY0FBYztvQkFDZCxhQUFhO29CQUNiLGtCQUFrQjtvQkFDbEIsaUJBQWlCO29CQUNqQixlQUFlO29CQUNmLG9CQUFvQjtvQkFDcEIsY0FBYztvQkFDZCxnQkFBZ0I7b0JBQ2hCLGFBQWE7b0JBQ2IsZUFBZTtvQkFDZixrQkFBa0I7b0JBQ2xCLGFBQWE7b0JBQ2IsY0FBYztvQkFDZCxlQUFlO29CQUNmLGNBQWM7b0JBQ2QscUJBQXFCO2lCQUN0QjtnQkFDRCxPQUFPLEVBQUU7b0JBQ1AsZ0JBQWdCO29CQUNoQixvQkFBb0I7b0JBQ3BCLDBCQUEwQjtvQkFDMUIsK0JBQStCO29CQUMvQiw2QkFBNkI7b0JBQzdCLHFCQUFxQjtpQkFDdEI7Z0JBQ0QsWUFBWSxFQUFFO29CQUNaLGdCQUFnQjtvQkFDaEIsb0JBQW9CO29CQUNwQiwwQkFBMEI7b0JBQzFCLCtCQUErQjtvQkFDL0IsNkJBQTZCO2lCQUM5QjtnQkFDRCxTQUFTLEVBQUUsQ0FBQyxjQUFjLENBQUM7YUFDNUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBOZ01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBDb21tb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xyXG5pbXBvcnQgeyBGb3Jtc01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcclxuaW1wb3J0IHsgTWF0VGFibGVNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC90YWJsZSc7XHJcbmltcG9ydCB7IE1hdFNvcnRNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9zb3J0JztcclxuaW1wb3J0IHsgTWF0UGFnaW5hdG9yTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvcGFnaW5hdG9yJztcclxuaW1wb3J0IHsgTWF0Q2hlY2tib3hNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9jaGVja2JveCc7XHJcbmltcG9ydCB7IE1hdEJ1dHRvbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2J1dHRvbic7XHJcbmltcG9ydCB7IE1hdFByb2dyZXNzQmFyTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvcHJvZ3Jlc3MtYmFyJztcclxuaW1wb3J0IHsgTWF0Q2hpcHNNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9jaGlwcyc7XHJcbmltcG9ydCB7IE1hdFRvb2x0aXBNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC90b29sdGlwJztcclxuaW1wb3J0IHsgTWF0SWNvbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2ljb24nO1xyXG5pbXBvcnQgeyBNYXRTZWxlY3RNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9zZWxlY3QnO1xyXG5pbXBvcnQgeyBNYXRGb3JtRmllbGRNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9mb3JtLWZpZWxkJztcclxuaW1wb3J0IHsgTWF0TWVudU1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL21lbnUnO1xyXG5pbXBvcnQgeyBEcmFnRHJvcE1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2Nkay9kcmFnLWRyb3AnO1xyXG5cclxuaW1wb3J0IHsgTXR4VXRpbHNNb2R1bGUgfSBmcm9tICdAbmctbWF0ZXJvL2V4dGVuc2lvbnMvdXRpbHMnO1xyXG5pbXBvcnQgeyBNdHhEaWFsb2dNb2R1bGUgfSBmcm9tICdAbmctbWF0ZXJvL2V4dGVuc2lvbnMvZGlhbG9nJztcclxuaW1wb3J0IHsgTXR4R3JpZENvbXBvbmVudCB9IGZyb20gJy4vZ3JpZC5jb21wb25lbnQnO1xyXG5pbXBvcnQgeyBNdHhHcmlkQ2VsbENvbXBvbmVudCB9IGZyb20gJy4vY2VsbC5jb21wb25lbnQnO1xyXG5pbXBvcnQgeyBNdHhHcmlkQ29sdW1uTWVudUNvbXBvbmVudCB9IGZyb20gJy4vY29sdW1uLW1lbnUuY29tcG9uZW50JztcclxuaW1wb3J0IHsgTXR4R3JpZEV4cGFuc2lvblRvZ2dsZURpcmVjdGl2ZSB9IGZyb20gJy4vZXhwYW5zaW9uLXRvZ2dsZS5kaXJlY3RpdmUnO1xyXG5pbXBvcnQgeyBNdHhHcmlkQ2VsbFNlbGVjdGlvbkRpcmVjdGl2ZSB9IGZyb20gJy4vY2VsbC1zZWxlY3Rpb24uZGlyZWN0aXZlJztcclxuaW1wb3J0IHsgTXR4R3JpZFNlcnZpY2UgfSBmcm9tICcuL2dyaWQuc2VydmljZSc7XHJcbmltcG9ydCB7IE1hdENvbHVtblJlc2l6ZU1vZHVsZSB9IGZyb20gJy4vY29sdW1uLXJlc2l6ZS9jb2x1bW4tcmVzaXplLW1vZHVsZSc7XHJcblxyXG5ATmdNb2R1bGUoe1xyXG4gIGltcG9ydHM6IFtcclxuICAgIENvbW1vbk1vZHVsZSxcclxuICAgIEZvcm1zTW9kdWxlLFxyXG4gICAgTWF0VGFibGVNb2R1bGUsXHJcbiAgICBNYXRTb3J0TW9kdWxlLFxyXG4gICAgTWF0UGFnaW5hdG9yTW9kdWxlLFxyXG4gICAgTWF0Q2hlY2tib3hNb2R1bGUsXHJcbiAgICBNYXRCdXR0b25Nb2R1bGUsXHJcbiAgICBNYXRQcm9ncmVzc0Jhck1vZHVsZSxcclxuICAgIE1hdENoaXBzTW9kdWxlLFxyXG4gICAgTWF0VG9vbHRpcE1vZHVsZSxcclxuICAgIE1hdEljb25Nb2R1bGUsXHJcbiAgICBNYXRTZWxlY3RNb2R1bGUsXHJcbiAgICBNYXRGb3JtRmllbGRNb2R1bGUsXHJcbiAgICBNYXRNZW51TW9kdWxlLFxyXG4gICAgRHJhZ0Ryb3BNb2R1bGUsXHJcbiAgICBNdHhEaWFsb2dNb2R1bGUsXHJcbiAgICBNdHhVdGlsc01vZHVsZSxcclxuICAgIE1hdENvbHVtblJlc2l6ZU1vZHVsZSxcclxuICBdLFxyXG4gIGV4cG9ydHM6IFtcclxuICAgIE10eEdyaWRDb21wb25lbnQsXHJcbiAgICBNdHhHcmlkQ2VsbENvbXBvbmVudCxcclxuICAgIE10eEdyaWRDb2x1bW5NZW51Q29tcG9uZW50LFxyXG4gICAgTXR4R3JpZEV4cGFuc2lvblRvZ2dsZURpcmVjdGl2ZSxcclxuICAgIE10eEdyaWRDZWxsU2VsZWN0aW9uRGlyZWN0aXZlLFxyXG4gICAgTWF0Q29sdW1uUmVzaXplTW9kdWxlLFxyXG4gIF0sXHJcbiAgZGVjbGFyYXRpb25zOiBbXHJcbiAgICBNdHhHcmlkQ29tcG9uZW50LFxyXG4gICAgTXR4R3JpZENlbGxDb21wb25lbnQsXHJcbiAgICBNdHhHcmlkQ29sdW1uTWVudUNvbXBvbmVudCxcclxuICAgIE10eEdyaWRFeHBhbnNpb25Ub2dnbGVEaXJlY3RpdmUsXHJcbiAgICBNdHhHcmlkQ2VsbFNlbGVjdGlvbkRpcmVjdGl2ZSxcclxuICBdLFxyXG4gIHByb3ZpZGVyczogW010eEdyaWRTZXJ2aWNlXSxcclxufSlcclxuZXhwb3J0IGNsYXNzIE10eEdyaWRNb2R1bGUge31cclxuIl19