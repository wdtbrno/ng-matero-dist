import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverlayModule } from '@angular/cdk/overlay';
import { A11yModule } from '@angular/cdk/a11y';
import { MtxPopover } from './popover';
import { MtxPopoverTrigger, MTX_POPOVER_SCROLL_STRATEGY_FACTORY_PROVIDER } from './popover-trigger';
import { MtxPopoverTarget } from './popover-target';
import { MtxPopoverContent } from './popover-content';
import * as i0 from "@angular/core";
export class MtxPopoverModule {
}
/** @nocollapse */ MtxPopoverModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MtxPopoverModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
/** @nocollapse */ MtxPopoverModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "15.2.1", ngImport: i0, type: MtxPopoverModule, declarations: [MtxPopover, MtxPopoverTrigger, MtxPopoverTarget, MtxPopoverContent], imports: [CommonModule, OverlayModule, A11yModule], exports: [MtxPopover, MtxPopoverTrigger, MtxPopoverTarget, MtxPopoverContent] });
/** @nocollapse */ MtxPopoverModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MtxPopoverModule, providers: [MTX_POPOVER_SCROLL_STRATEGY_FACTORY_PROVIDER], imports: [CommonModule, OverlayModule, A11yModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MtxPopoverModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, OverlayModule, A11yModule],
                    exports: [MtxPopover, MtxPopoverTrigger, MtxPopoverTarget, MtxPopoverContent],
                    declarations: [MtxPopover, MtxPopoverTrigger, MtxPopoverTarget, MtxPopoverContent],
                    providers: [MTX_POPOVER_SCROLL_STRATEGY_FACTORY_PROVIDER],
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9wb3Zlci1tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wcm9qZWN0cy9leHRlbnNpb25zL3BvcG92ZXIvcG9wb3Zlci1tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUN6QyxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFFL0MsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBQ3JELE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQztBQUUvQyxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sV0FBVyxDQUFDO0FBQ3ZDLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSw0Q0FBNEMsRUFBRSxNQUFNLG1CQUFtQixDQUFDO0FBQ3BHLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLGtCQUFrQixDQUFDO0FBQ3BELE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLG1CQUFtQixDQUFDOztBQVF0RCxNQUFNLE9BQU8sZ0JBQWdCOztnSUFBaEIsZ0JBQWdCO2lJQUFoQixnQkFBZ0IsaUJBSFosVUFBVSxFQUFFLGlCQUFpQixFQUFFLGdCQUFnQixFQUFFLGlCQUFpQixhQUZ2RSxZQUFZLEVBQUUsYUFBYSxFQUFFLFVBQVUsYUFDdkMsVUFBVSxFQUFFLGlCQUFpQixFQUFFLGdCQUFnQixFQUFFLGlCQUFpQjtpSUFJakUsZ0JBQWdCLGFBRmhCLENBQUMsNENBQTRDLENBQUMsWUFIL0MsWUFBWSxFQUFFLGFBQWEsRUFBRSxVQUFVOzJGQUt0QyxnQkFBZ0I7a0JBTjVCLFFBQVE7bUJBQUM7b0JBQ1IsT0FBTyxFQUFFLENBQUMsWUFBWSxFQUFFLGFBQWEsRUFBRSxVQUFVLENBQUM7b0JBQ2xELE9BQU8sRUFBRSxDQUFDLFVBQVUsRUFBRSxpQkFBaUIsRUFBRSxnQkFBZ0IsRUFBRSxpQkFBaUIsQ0FBQztvQkFDN0UsWUFBWSxFQUFFLENBQUMsVUFBVSxFQUFFLGlCQUFpQixFQUFFLGdCQUFnQixFQUFFLGlCQUFpQixDQUFDO29CQUNsRixTQUFTLEVBQUUsQ0FBQyw0Q0FBNEMsQ0FBQztpQkFDMUQiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBOZ01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQ29tbW9uTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcblxuaW1wb3J0IHsgT3ZlcmxheU1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2Nkay9vdmVybGF5JztcbmltcG9ydCB7IEExMXlNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jZGsvYTExeSc7XG5cbmltcG9ydCB7IE10eFBvcG92ZXIgfSBmcm9tICcuL3BvcG92ZXInO1xuaW1wb3J0IHsgTXR4UG9wb3ZlclRyaWdnZXIsIE1UWF9QT1BPVkVSX1NDUk9MTF9TVFJBVEVHWV9GQUNUT1JZX1BST1ZJREVSIH0gZnJvbSAnLi9wb3BvdmVyLXRyaWdnZXInO1xuaW1wb3J0IHsgTXR4UG9wb3ZlclRhcmdldCB9IGZyb20gJy4vcG9wb3Zlci10YXJnZXQnO1xuaW1wb3J0IHsgTXR4UG9wb3ZlckNvbnRlbnQgfSBmcm9tICcuL3BvcG92ZXItY29udGVudCc7XG5cbkBOZ01vZHVsZSh7XG4gIGltcG9ydHM6IFtDb21tb25Nb2R1bGUsIE92ZXJsYXlNb2R1bGUsIEExMXlNb2R1bGVdLFxuICBleHBvcnRzOiBbTXR4UG9wb3ZlciwgTXR4UG9wb3ZlclRyaWdnZXIsIE10eFBvcG92ZXJUYXJnZXQsIE10eFBvcG92ZXJDb250ZW50XSxcbiAgZGVjbGFyYXRpb25zOiBbTXR4UG9wb3ZlciwgTXR4UG9wb3ZlclRyaWdnZXIsIE10eFBvcG92ZXJUYXJnZXQsIE10eFBvcG92ZXJDb250ZW50XSxcbiAgcHJvdmlkZXJzOiBbTVRYX1BPUE9WRVJfU0NST0xMX1NUUkFURUdZX0ZBQ1RPUllfUFJPVklERVJdLFxufSlcbmV4cG9ydCBjbGFzcyBNdHhQb3BvdmVyTW9kdWxlIHt9XG4iXX0=