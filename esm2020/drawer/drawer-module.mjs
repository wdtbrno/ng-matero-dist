import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { NgModule } from '@angular/core';
import { MatCommonModule } from '@angular/material/core';
import { MtxDrawer } from './drawer';
import { MtxDrawerContainer } from './drawer-container';
import * as i0 from "@angular/core";
export class MtxDrawerModule {
}
/** @nocollapse */ MtxDrawerModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MtxDrawerModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
/** @nocollapse */ MtxDrawerModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "15.2.1", ngImport: i0, type: MtxDrawerModule, declarations: [MtxDrawerContainer], imports: [OverlayModule, PortalModule, MatCommonModule], exports: [MtxDrawerContainer, MatCommonModule] });
/** @nocollapse */ MtxDrawerModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MtxDrawerModule, providers: [MtxDrawer], imports: [OverlayModule, PortalModule, MatCommonModule, MatCommonModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MtxDrawerModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [OverlayModule, PortalModule, MatCommonModule],
                    exports: [MtxDrawerContainer, MatCommonModule],
                    declarations: [MtxDrawerContainer],
                    providers: [MtxDrawer],
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHJhd2VyLW1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL2V4dGVuc2lvbnMvZHJhd2VyL2RyYXdlci1tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBQ3JELE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUNuRCxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3pDLE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSx3QkFBd0IsQ0FBQztBQUN6RCxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sVUFBVSxDQUFDO0FBQ3JDLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLG9CQUFvQixDQUFDOztBQVF4RCxNQUFNLE9BQU8sZUFBZTs7K0hBQWYsZUFBZTtnSUFBZixlQUFlLGlCQUhYLGtCQUFrQixhQUZ2QixhQUFhLEVBQUUsWUFBWSxFQUFFLGVBQWUsYUFDNUMsa0JBQWtCLEVBQUUsZUFBZTtnSUFJbEMsZUFBZSxhQUZmLENBQUMsU0FBUyxDQUFDLFlBSFosYUFBYSxFQUFFLFlBQVksRUFBRSxlQUFlLEVBQ3hCLGVBQWU7MkZBSWxDLGVBQWU7a0JBTjNCLFFBQVE7bUJBQUM7b0JBQ1IsT0FBTyxFQUFFLENBQUMsYUFBYSxFQUFFLFlBQVksRUFBRSxlQUFlLENBQUM7b0JBQ3ZELE9BQU8sRUFBRSxDQUFDLGtCQUFrQixFQUFFLGVBQWUsQ0FBQztvQkFDOUMsWUFBWSxFQUFFLENBQUMsa0JBQWtCLENBQUM7b0JBQ2xDLFNBQVMsRUFBRSxDQUFDLFNBQVMsQ0FBQztpQkFDdkIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBPdmVybGF5TW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY2RrL292ZXJsYXknO1xuaW1wb3J0IHsgUG9ydGFsTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY2RrL3BvcnRhbCc7XG5pbXBvcnQgeyBOZ01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgTWF0Q29tbW9uTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvY29yZSc7XG5pbXBvcnQgeyBNdHhEcmF3ZXIgfSBmcm9tICcuL2RyYXdlcic7XG5pbXBvcnQgeyBNdHhEcmF3ZXJDb250YWluZXIgfSBmcm9tICcuL2RyYXdlci1jb250YWluZXInO1xuXG5ATmdNb2R1bGUoe1xuICBpbXBvcnRzOiBbT3ZlcmxheU1vZHVsZSwgUG9ydGFsTW9kdWxlLCBNYXRDb21tb25Nb2R1bGVdLFxuICBleHBvcnRzOiBbTXR4RHJhd2VyQ29udGFpbmVyLCBNYXRDb21tb25Nb2R1bGVdLFxuICBkZWNsYXJhdGlvbnM6IFtNdHhEcmF3ZXJDb250YWluZXJdLFxuICBwcm92aWRlcnM6IFtNdHhEcmF3ZXJdLFxufSlcbmV4cG9ydCBjbGFzcyBNdHhEcmF3ZXJNb2R1bGUge31cbiJdfQ==