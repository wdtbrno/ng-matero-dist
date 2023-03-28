import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { OverlayModule } from '@angular/cdk/overlay';
import { A11yModule } from '@angular/cdk/a11y';
import { PortalModule } from '@angular/cdk/portal';
import { MatButtonModule } from '@angular/material/button';
import { MtxColorpickerInput } from './colorpicker-input';
import { MtxColorpickerToggle, MtxColorpickerToggleIcon } from './colorpicker-toggle';
import { MtxColorpicker, MtxColorpickerContent, MTX_COLORPICKER_SCROLL_STRATEGY_FACTORY_PROVIDER, } from './colorpicker';
import { ColorChromeModule } from 'ngx-color/chrome';
import * as i0 from "@angular/core";
export class MtxColorpickerModule {
}
/** @nocollapse */ MtxColorpickerModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MtxColorpickerModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
/** @nocollapse */ MtxColorpickerModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "15.2.1", ngImport: i0, type: MtxColorpickerModule, declarations: [MtxColorpicker,
        MtxColorpickerContent,
        MtxColorpickerInput,
        MtxColorpickerToggle,
        MtxColorpickerToggleIcon], imports: [CommonModule,
        OverlayModule,
        A11yModule,
        PortalModule,
        MatButtonModule,
        ColorChromeModule], exports: [MtxColorpicker,
        MtxColorpickerContent,
        MtxColorpickerInput,
        MtxColorpickerToggle,
        MtxColorpickerToggleIcon] });
/** @nocollapse */ MtxColorpickerModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MtxColorpickerModule, providers: [MTX_COLORPICKER_SCROLL_STRATEGY_FACTORY_PROVIDER], imports: [CommonModule,
        OverlayModule,
        A11yModule,
        PortalModule,
        MatButtonModule,
        ColorChromeModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MtxColorpickerModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [
                        CommonModule,
                        OverlayModule,
                        A11yModule,
                        PortalModule,
                        MatButtonModule,
                        ColorChromeModule,
                    ],
                    exports: [
                        MtxColorpicker,
                        MtxColorpickerContent,
                        MtxColorpickerInput,
                        MtxColorpickerToggle,
                        MtxColorpickerToggleIcon,
                    ],
                    declarations: [
                        MtxColorpicker,
                        MtxColorpickerContent,
                        MtxColorpickerInput,
                        MtxColorpickerToggle,
                        MtxColorpickerToggleIcon,
                    ],
                    providers: [MTX_COLORPICKER_SCROLL_STRATEGY_FACTORY_PROVIDER],
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29sb3JwaWNrZXItbW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vcHJvamVjdHMvZXh0ZW5zaW9ucy9jb2xvcnBpY2tlci9jb2xvcnBpY2tlci1tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQy9DLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDekMsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBQ3JELE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQztBQUMvQyxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0scUJBQXFCLENBQUM7QUFDbkQsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLDBCQUEwQixDQUFDO0FBQzNELE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBQzFELE9BQU8sRUFBRSxvQkFBb0IsRUFBRSx3QkFBd0IsRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBQ3RGLE9BQU8sRUFDTCxjQUFjLEVBQ2QscUJBQXFCLEVBQ3JCLGdEQUFnRCxHQUNqRCxNQUFNLGVBQWUsQ0FBQztBQUV2QixPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxrQkFBa0IsQ0FBQzs7QUEyQnJELE1BQU0sT0FBTyxvQkFBb0I7O29JQUFwQixvQkFBb0I7cUlBQXBCLG9CQUFvQixpQkFSN0IsY0FBYztRQUNkLHFCQUFxQjtRQUNyQixtQkFBbUI7UUFDbkIsb0JBQW9CO1FBQ3BCLHdCQUF3QixhQW5CeEIsWUFBWTtRQUNaLGFBQWE7UUFDYixVQUFVO1FBQ1YsWUFBWTtRQUNaLGVBQWU7UUFDZixpQkFBaUIsYUFHakIsY0FBYztRQUNkLHFCQUFxQjtRQUNyQixtQkFBbUI7UUFDbkIsb0JBQW9CO1FBQ3BCLHdCQUF3QjtxSUFXZixvQkFBb0IsYUFGcEIsQ0FBQyxnREFBZ0QsQ0FBQyxZQXJCM0QsWUFBWTtRQUNaLGFBQWE7UUFDYixVQUFVO1FBQ1YsWUFBWTtRQUNaLGVBQWU7UUFDZixpQkFBaUI7MkZBa0JSLG9CQUFvQjtrQkF6QmhDLFFBQVE7bUJBQUM7b0JBQ1IsT0FBTyxFQUFFO3dCQUNQLFlBQVk7d0JBQ1osYUFBYTt3QkFDYixVQUFVO3dCQUNWLFlBQVk7d0JBQ1osZUFBZTt3QkFDZixpQkFBaUI7cUJBQ2xCO29CQUNELE9BQU8sRUFBRTt3QkFDUCxjQUFjO3dCQUNkLHFCQUFxQjt3QkFDckIsbUJBQW1CO3dCQUNuQixvQkFBb0I7d0JBQ3BCLHdCQUF3QjtxQkFDekI7b0JBQ0QsWUFBWSxFQUFFO3dCQUNaLGNBQWM7d0JBQ2QscUJBQXFCO3dCQUNyQixtQkFBbUI7d0JBQ25CLG9CQUFvQjt3QkFDcEIsd0JBQXdCO3FCQUN6QjtvQkFDRCxTQUFTLEVBQUUsQ0FBQyxnREFBZ0QsQ0FBQztpQkFDOUQiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21tb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHsgTmdNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE92ZXJsYXlNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jZGsvb3ZlcmxheSc7XG5pbXBvcnQgeyBBMTF5TW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY2RrL2ExMXknO1xuaW1wb3J0IHsgUG9ydGFsTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY2RrL3BvcnRhbCc7XG5pbXBvcnQgeyBNYXRCdXR0b25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9idXR0b24nO1xuaW1wb3J0IHsgTXR4Q29sb3JwaWNrZXJJbnB1dCB9IGZyb20gJy4vY29sb3JwaWNrZXItaW5wdXQnO1xuaW1wb3J0IHsgTXR4Q29sb3JwaWNrZXJUb2dnbGUsIE10eENvbG9ycGlja2VyVG9nZ2xlSWNvbiB9IGZyb20gJy4vY29sb3JwaWNrZXItdG9nZ2xlJztcbmltcG9ydCB7XG4gIE10eENvbG9ycGlja2VyLFxuICBNdHhDb2xvcnBpY2tlckNvbnRlbnQsXG4gIE1UWF9DT0xPUlBJQ0tFUl9TQ1JPTExfU1RSQVRFR1lfRkFDVE9SWV9QUk9WSURFUixcbn0gZnJvbSAnLi9jb2xvcnBpY2tlcic7XG5cbmltcG9ydCB7IENvbG9yQ2hyb21lTW9kdWxlIH0gZnJvbSAnbmd4LWNvbG9yL2Nocm9tZSc7XG5cbkBOZ01vZHVsZSh7XG4gIGltcG9ydHM6IFtcbiAgICBDb21tb25Nb2R1bGUsXG4gICAgT3ZlcmxheU1vZHVsZSxcbiAgICBBMTF5TW9kdWxlLFxuICAgIFBvcnRhbE1vZHVsZSxcbiAgICBNYXRCdXR0b25Nb2R1bGUsXG4gICAgQ29sb3JDaHJvbWVNb2R1bGUsXG4gIF0sXG4gIGV4cG9ydHM6IFtcbiAgICBNdHhDb2xvcnBpY2tlcixcbiAgICBNdHhDb2xvcnBpY2tlckNvbnRlbnQsXG4gICAgTXR4Q29sb3JwaWNrZXJJbnB1dCxcbiAgICBNdHhDb2xvcnBpY2tlclRvZ2dsZSxcbiAgICBNdHhDb2xvcnBpY2tlclRvZ2dsZUljb24sXG4gIF0sXG4gIGRlY2xhcmF0aW9uczogW1xuICAgIE10eENvbG9ycGlja2VyLFxuICAgIE10eENvbG9ycGlja2VyQ29udGVudCxcbiAgICBNdHhDb2xvcnBpY2tlcklucHV0LFxuICAgIE10eENvbG9ycGlja2VyVG9nZ2xlLFxuICAgIE10eENvbG9ycGlja2VyVG9nZ2xlSWNvbixcbiAgXSxcbiAgcHJvdmlkZXJzOiBbTVRYX0NPTE9SUElDS0VSX1NDUk9MTF9TVFJBVEVHWV9GQUNUT1JZX1BST1ZJREVSXSxcbn0pXG5leHBvcnQgY2xhc3MgTXR4Q29sb3JwaWNrZXJNb2R1bGUge31cbiJdfQ==