import { A11yModule } from '@angular/cdk/a11y';
import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MtxCalendar } from './calendar';
import { MtxCalendarBody } from './calendar-body';
import { MtxClock } from './clock';
import { MtxTime, MtxTimeInput } from './time';
import { MtxDatetimepicker, MtxDatetimepickerContent, MTX_DATETIMEPICKER_SCROLL_STRATEGY_FACTORY_PROVIDER, } from './datetimepicker';
import { MtxDatetimepickerInput } from './datetimepicker-input';
import { MtxDatetimepickerToggle, MtxDatetimepickerToggleIcon } from './datetimepicker-toggle';
import { MtxMonthView } from './month-view';
import { MtxYearView } from './year-view';
import { MtxMultiYearView } from './multi-year-view';
import * as i0 from "@angular/core";
export class MtxDatetimepickerModule {
}
/** @nocollapse */ MtxDatetimepickerModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MtxDatetimepickerModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
/** @nocollapse */ MtxDatetimepickerModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "15.2.1", ngImport: i0, type: MtxDatetimepickerModule, declarations: [MtxCalendar,
        MtxCalendarBody,
        MtxClock,
        MtxTime,
        MtxTimeInput,
        MtxDatetimepicker,
        MtxDatetimepickerToggle,
        MtxDatetimepickerToggleIcon,
        MtxDatetimepickerInput,
        MtxDatetimepickerContent,
        MtxMonthView,
        MtxYearView,
        MtxMultiYearView], imports: [CommonModule, MatButtonModule, OverlayModule, A11yModule, PortalModule], exports: [MtxCalendar,
        MtxCalendarBody,
        MtxClock,
        MtxTime,
        MtxDatetimepicker,
        MtxDatetimepickerToggle,
        MtxDatetimepickerToggleIcon,
        MtxDatetimepickerInput,
        MtxDatetimepickerContent,
        MtxMonthView,
        MtxYearView,
        MtxMultiYearView] });
/** @nocollapse */ MtxDatetimepickerModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MtxDatetimepickerModule, providers: [MTX_DATETIMEPICKER_SCROLL_STRATEGY_FACTORY_PROVIDER], imports: [CommonModule, MatButtonModule, OverlayModule, A11yModule, PortalModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MtxDatetimepickerModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, MatButtonModule, OverlayModule, A11yModule, PortalModule],
                    declarations: [
                        MtxCalendar,
                        MtxCalendarBody,
                        MtxClock,
                        MtxTime,
                        MtxTimeInput,
                        MtxDatetimepicker,
                        MtxDatetimepickerToggle,
                        MtxDatetimepickerToggleIcon,
                        MtxDatetimepickerInput,
                        MtxDatetimepickerContent,
                        MtxMonthView,
                        MtxYearView,
                        MtxMultiYearView,
                    ],
                    exports: [
                        MtxCalendar,
                        MtxCalendarBody,
                        MtxClock,
                        MtxTime,
                        MtxDatetimepicker,
                        MtxDatetimepickerToggle,
                        MtxDatetimepickerToggleIcon,
                        MtxDatetimepickerInput,
                        MtxDatetimepickerContent,
                        MtxMonthView,
                        MtxYearView,
                        MtxMultiYearView,
                    ],
                    providers: [MTX_DATETIMEPICKER_SCROLL_STRATEGY_FACTORY_PROVIDER],
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZXRpbWVwaWNrZXItbW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vcHJvamVjdHMvZXh0ZW5zaW9ucy9kYXRldGltZXBpY2tlci9kYXRldGltZXBpY2tlci1tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLG1CQUFtQixDQUFDO0FBQy9DLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQztBQUNyRCxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0scUJBQXFCLENBQUM7QUFDbkQsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQy9DLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDekMsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLDBCQUEwQixDQUFDO0FBQzNELE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxZQUFZLENBQUM7QUFDekMsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQ2xELE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxTQUFTLENBQUM7QUFDbkMsT0FBTyxFQUFFLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxRQUFRLENBQUM7QUFDL0MsT0FBTyxFQUNMLGlCQUFpQixFQUNqQix3QkFBd0IsRUFDeEIsbURBQW1ELEdBQ3BELE1BQU0sa0JBQWtCLENBQUM7QUFDMUIsT0FBTyxFQUFFLHNCQUFzQixFQUFFLE1BQU0sd0JBQXdCLENBQUM7QUFDaEUsT0FBTyxFQUFFLHVCQUF1QixFQUFFLDJCQUEyQixFQUFFLE1BQU0seUJBQXlCLENBQUM7QUFDL0YsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGNBQWMsQ0FBQztBQUM1QyxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sYUFBYSxDQUFDO0FBQzFDLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLG1CQUFtQixDQUFDOztBQW1DckQsTUFBTSxPQUFPLHVCQUF1Qjs7dUlBQXZCLHVCQUF1Qjt3SUFBdkIsdUJBQXVCLGlCQTlCaEMsV0FBVztRQUNYLGVBQWU7UUFDZixRQUFRO1FBQ1IsT0FBTztRQUNQLFlBQVk7UUFDWixpQkFBaUI7UUFDakIsdUJBQXVCO1FBQ3ZCLDJCQUEyQjtRQUMzQixzQkFBc0I7UUFDdEIsd0JBQXdCO1FBQ3hCLFlBQVk7UUFDWixXQUFXO1FBQ1gsZ0JBQWdCLGFBZFIsWUFBWSxFQUFFLGVBQWUsRUFBRSxhQUFhLEVBQUUsVUFBVSxFQUFFLFlBQVksYUFpQjlFLFdBQVc7UUFDWCxlQUFlO1FBQ2YsUUFBUTtRQUNSLE9BQU87UUFDUCxpQkFBaUI7UUFDakIsdUJBQXVCO1FBQ3ZCLDJCQUEyQjtRQUMzQixzQkFBc0I7UUFDdEIsd0JBQXdCO1FBQ3hCLFlBQVk7UUFDWixXQUFXO1FBQ1gsZ0JBQWdCO3dJQUlQLHVCQUF1QixhQUZ2QixDQUFDLG1EQUFtRCxDQUFDLFlBOUJ0RCxZQUFZLEVBQUUsZUFBZSxFQUFFLGFBQWEsRUFBRSxVQUFVLEVBQUUsWUFBWTsyRkFnQ3JFLHVCQUF1QjtrQkFqQ25DLFFBQVE7bUJBQUM7b0JBQ1IsT0FBTyxFQUFFLENBQUMsWUFBWSxFQUFFLGVBQWUsRUFBRSxhQUFhLEVBQUUsVUFBVSxFQUFFLFlBQVksQ0FBQztvQkFDakYsWUFBWSxFQUFFO3dCQUNaLFdBQVc7d0JBQ1gsZUFBZTt3QkFDZixRQUFRO3dCQUNSLE9BQU87d0JBQ1AsWUFBWTt3QkFDWixpQkFBaUI7d0JBQ2pCLHVCQUF1Qjt3QkFDdkIsMkJBQTJCO3dCQUMzQixzQkFBc0I7d0JBQ3RCLHdCQUF3Qjt3QkFDeEIsWUFBWTt3QkFDWixXQUFXO3dCQUNYLGdCQUFnQjtxQkFDakI7b0JBQ0QsT0FBTyxFQUFFO3dCQUNQLFdBQVc7d0JBQ1gsZUFBZTt3QkFDZixRQUFRO3dCQUNSLE9BQU87d0JBQ1AsaUJBQWlCO3dCQUNqQix1QkFBdUI7d0JBQ3ZCLDJCQUEyQjt3QkFDM0Isc0JBQXNCO3dCQUN0Qix3QkFBd0I7d0JBQ3hCLFlBQVk7d0JBQ1osV0FBVzt3QkFDWCxnQkFBZ0I7cUJBQ2pCO29CQUNELFNBQVMsRUFBRSxDQUFDLG1EQUFtRCxDQUFDO2lCQUNqRSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEExMXlNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jZGsvYTExeSc7XG5pbXBvcnQgeyBPdmVybGF5TW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY2RrL292ZXJsYXknO1xuaW1wb3J0IHsgUG9ydGFsTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY2RrL3BvcnRhbCc7XG5pbXBvcnQgeyBDb21tb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHsgTmdNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE1hdEJ1dHRvbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2J1dHRvbic7XG5pbXBvcnQgeyBNdHhDYWxlbmRhciB9IGZyb20gJy4vY2FsZW5kYXInO1xuaW1wb3J0IHsgTXR4Q2FsZW5kYXJCb2R5IH0gZnJvbSAnLi9jYWxlbmRhci1ib2R5JztcbmltcG9ydCB7IE10eENsb2NrIH0gZnJvbSAnLi9jbG9jayc7XG5pbXBvcnQgeyBNdHhUaW1lLCBNdHhUaW1lSW5wdXQgfSBmcm9tICcuL3RpbWUnO1xuaW1wb3J0IHtcbiAgTXR4RGF0ZXRpbWVwaWNrZXIsXG4gIE10eERhdGV0aW1lcGlja2VyQ29udGVudCxcbiAgTVRYX0RBVEVUSU1FUElDS0VSX1NDUk9MTF9TVFJBVEVHWV9GQUNUT1JZX1BST1ZJREVSLFxufSBmcm9tICcuL2RhdGV0aW1lcGlja2VyJztcbmltcG9ydCB7IE10eERhdGV0aW1lcGlja2VySW5wdXQgfSBmcm9tICcuL2RhdGV0aW1lcGlja2VyLWlucHV0JztcbmltcG9ydCB7IE10eERhdGV0aW1lcGlja2VyVG9nZ2xlLCBNdHhEYXRldGltZXBpY2tlclRvZ2dsZUljb24gfSBmcm9tICcuL2RhdGV0aW1lcGlja2VyLXRvZ2dsZSc7XG5pbXBvcnQgeyBNdHhNb250aFZpZXcgfSBmcm9tICcuL21vbnRoLXZpZXcnO1xuaW1wb3J0IHsgTXR4WWVhclZpZXcgfSBmcm9tICcuL3llYXItdmlldyc7XG5pbXBvcnQgeyBNdHhNdWx0aVllYXJWaWV3IH0gZnJvbSAnLi9tdWx0aS15ZWFyLXZpZXcnO1xuXG5ATmdNb2R1bGUoe1xuICBpbXBvcnRzOiBbQ29tbW9uTW9kdWxlLCBNYXRCdXR0b25Nb2R1bGUsIE92ZXJsYXlNb2R1bGUsIEExMXlNb2R1bGUsIFBvcnRhbE1vZHVsZV0sXG4gIGRlY2xhcmF0aW9uczogW1xuICAgIE10eENhbGVuZGFyLFxuICAgIE10eENhbGVuZGFyQm9keSxcbiAgICBNdHhDbG9jayxcbiAgICBNdHhUaW1lLFxuICAgIE10eFRpbWVJbnB1dCxcbiAgICBNdHhEYXRldGltZXBpY2tlcixcbiAgICBNdHhEYXRldGltZXBpY2tlclRvZ2dsZSxcbiAgICBNdHhEYXRldGltZXBpY2tlclRvZ2dsZUljb24sXG4gICAgTXR4RGF0ZXRpbWVwaWNrZXJJbnB1dCxcbiAgICBNdHhEYXRldGltZXBpY2tlckNvbnRlbnQsXG4gICAgTXR4TW9udGhWaWV3LFxuICAgIE10eFllYXJWaWV3LFxuICAgIE10eE11bHRpWWVhclZpZXcsXG4gIF0sXG4gIGV4cG9ydHM6IFtcbiAgICBNdHhDYWxlbmRhcixcbiAgICBNdHhDYWxlbmRhckJvZHksXG4gICAgTXR4Q2xvY2ssXG4gICAgTXR4VGltZSxcbiAgICBNdHhEYXRldGltZXBpY2tlcixcbiAgICBNdHhEYXRldGltZXBpY2tlclRvZ2dsZSxcbiAgICBNdHhEYXRldGltZXBpY2tlclRvZ2dsZUljb24sXG4gICAgTXR4RGF0ZXRpbWVwaWNrZXJJbnB1dCxcbiAgICBNdHhEYXRldGltZXBpY2tlckNvbnRlbnQsXG4gICAgTXR4TW9udGhWaWV3LFxuICAgIE10eFllYXJWaWV3LFxuICAgIE10eE11bHRpWWVhclZpZXcsXG4gIF0sXG4gIHByb3ZpZGVyczogW01UWF9EQVRFVElNRVBJQ0tFUl9TQ1JPTExfU1RSQVRFR1lfRkFDVE9SWV9QUk9WSURFUl0sXG59KVxuZXhwb3J0IGNsYXNzIE10eERhdGV0aW1lcGlja2VyTW9kdWxlIHt9XG4iXX0=