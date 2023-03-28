import { A11yModule } from '@angular/cdk/a11y';
import { OverlayModule } from '@angular/cdk/overlay';
import { CdkScrollableModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatCommonModule } from '@angular/material/core';
import { MtxPipesModule } from '@ng-matero/extensions/core';
import { MtxTooltip, MTX_TOOLTIP_SCROLL_STRATEGY_FACTORY_PROVIDER, TooltipComponent, } from './tooltip';
import * as i0 from "@angular/core";
export class MtxTooltipModule {
}
/** @nocollapse */ MtxTooltipModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MtxTooltipModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
/** @nocollapse */ MtxTooltipModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "15.2.1", ngImport: i0, type: MtxTooltipModule, declarations: [MtxTooltip, TooltipComponent], imports: [A11yModule, CommonModule, OverlayModule, MatCommonModule, MtxPipesModule], exports: [MtxTooltip, TooltipComponent, MatCommonModule, CdkScrollableModule] });
/** @nocollapse */ MtxTooltipModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MtxTooltipModule, providers: [MTX_TOOLTIP_SCROLL_STRATEGY_FACTORY_PROVIDER], imports: [A11yModule, CommonModule, OverlayModule, MatCommonModule, MtxPipesModule, MatCommonModule, CdkScrollableModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MtxTooltipModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [A11yModule, CommonModule, OverlayModule, MatCommonModule, MtxPipesModule],
                    exports: [MtxTooltip, TooltipComponent, MatCommonModule, CdkScrollableModule],
                    declarations: [MtxTooltip, TooltipComponent],
                    providers: [MTX_TOOLTIP_SCROLL_STRATEGY_FACTORY_PROVIDER],
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9vbHRpcC1tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wcm9qZWN0cy9leHRlbnNpb25zL3Rvb2x0aXAvdG9vbHRpcC1tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLG1CQUFtQixDQUFDO0FBQy9DLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQztBQUNyRCxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSx3QkFBd0IsQ0FBQztBQUM3RCxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDL0MsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUN6QyxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sd0JBQXdCLENBQUM7QUFDekQsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLDRCQUE0QixDQUFDO0FBQzVELE9BQU8sRUFDTCxVQUFVLEVBQ1YsNENBQTRDLEVBQzVDLGdCQUFnQixHQUNqQixNQUFNLFdBQVcsQ0FBQzs7QUFRbkIsTUFBTSxPQUFPLGdCQUFnQjs7Z0lBQWhCLGdCQUFnQjtpSUFBaEIsZ0JBQWdCLGlCQUhaLFVBQVUsRUFBRSxnQkFBZ0IsYUFGakMsVUFBVSxFQUFFLFlBQVksRUFBRSxhQUFhLEVBQUUsZUFBZSxFQUFFLGNBQWMsYUFDeEUsVUFBVSxFQUFFLGdCQUFnQixFQUFFLGVBQWUsRUFBRSxtQkFBbUI7aUlBSWpFLGdCQUFnQixhQUZoQixDQUFDLDRDQUE0QyxDQUFDLFlBSC9DLFVBQVUsRUFBRSxZQUFZLEVBQUUsYUFBYSxFQUFFLGVBQWUsRUFBRSxjQUFjLEVBQzFDLGVBQWUsRUFBRSxtQkFBbUI7MkZBSWpFLGdCQUFnQjtrQkFONUIsUUFBUTttQkFBQztvQkFDUixPQUFPLEVBQUUsQ0FBQyxVQUFVLEVBQUUsWUFBWSxFQUFFLGFBQWEsRUFBRSxlQUFlLEVBQUUsY0FBYyxDQUFDO29CQUNuRixPQUFPLEVBQUUsQ0FBQyxVQUFVLEVBQUUsZ0JBQWdCLEVBQUUsZUFBZSxFQUFFLG1CQUFtQixDQUFDO29CQUM3RSxZQUFZLEVBQUUsQ0FBQyxVQUFVLEVBQUUsZ0JBQWdCLENBQUM7b0JBQzVDLFNBQVMsRUFBRSxDQUFDLDRDQUE0QyxDQUFDO2lCQUMxRCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEExMXlNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jZGsvYTExeSc7XG5pbXBvcnQgeyBPdmVybGF5TW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY2RrL292ZXJsYXknO1xuaW1wb3J0IHsgQ2RrU2Nyb2xsYWJsZU1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2Nkay9zY3JvbGxpbmcnO1xuaW1wb3J0IHsgQ29tbW9uTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7IE5nTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBNYXRDb21tb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9jb3JlJztcbmltcG9ydCB7IE10eFBpcGVzTW9kdWxlIH0gZnJvbSAnQG5nLW1hdGVyby9leHRlbnNpb25zL2NvcmUnO1xuaW1wb3J0IHtcbiAgTXR4VG9vbHRpcCxcbiAgTVRYX1RPT0xUSVBfU0NST0xMX1NUUkFURUdZX0ZBQ1RPUllfUFJPVklERVIsXG4gIFRvb2x0aXBDb21wb25lbnQsXG59IGZyb20gJy4vdG9vbHRpcCc7XG5cbkBOZ01vZHVsZSh7XG4gIGltcG9ydHM6IFtBMTF5TW9kdWxlLCBDb21tb25Nb2R1bGUsIE92ZXJsYXlNb2R1bGUsIE1hdENvbW1vbk1vZHVsZSwgTXR4UGlwZXNNb2R1bGVdLFxuICBleHBvcnRzOiBbTXR4VG9vbHRpcCwgVG9vbHRpcENvbXBvbmVudCwgTWF0Q29tbW9uTW9kdWxlLCBDZGtTY3JvbGxhYmxlTW9kdWxlXSxcbiAgZGVjbGFyYXRpb25zOiBbTXR4VG9vbHRpcCwgVG9vbHRpcENvbXBvbmVudF0sXG4gIHByb3ZpZGVyczogW01UWF9UT09MVElQX1NDUk9MTF9TVFJBVEVHWV9GQUNUT1JZX1BST1ZJREVSXSxcbn0pXG5leHBvcnQgY2xhc3MgTXR4VG9vbHRpcE1vZHVsZSB7fVxuIl19