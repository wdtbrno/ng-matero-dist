import { NgModule } from '@angular/core';
import { MatNativeDateModule, NativeDateModule } from '@angular/material/core';
import { DatetimeAdapter } from './datetime-adapter';
import { MTX_DATETIME_FORMATS } from './datetime-formats';
import { NativeDatetimeAdapter } from './native-datetime-adapter';
import { MTX_NATIVE_DATETIME_FORMATS } from './native-datetime-formats';
import * as i0 from "@angular/core";
export class NativeDatetimeModule {
}
/** @nocollapse */ NativeDatetimeModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: NativeDatetimeModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
/** @nocollapse */ NativeDatetimeModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "15.2.1", ngImport: i0, type: NativeDatetimeModule, imports: [NativeDateModule] });
/** @nocollapse */ NativeDatetimeModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: NativeDatetimeModule, providers: [
        {
            provide: DatetimeAdapter,
            useClass: NativeDatetimeAdapter,
        },
    ], imports: [NativeDateModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: NativeDatetimeModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [NativeDateModule],
                    providers: [
                        {
                            provide: DatetimeAdapter,
                            useClass: NativeDatetimeAdapter,
                        },
                    ],
                }]
        }] });
export class MtxNativeDatetimeModule {
}
/** @nocollapse */ MtxNativeDatetimeModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MtxNativeDatetimeModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
/** @nocollapse */ MtxNativeDatetimeModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "15.2.1", ngImport: i0, type: MtxNativeDatetimeModule, imports: [NativeDatetimeModule, MatNativeDateModule] });
/** @nocollapse */ MtxNativeDatetimeModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MtxNativeDatetimeModule, providers: [{ provide: MTX_DATETIME_FORMATS, useValue: MTX_NATIVE_DATETIME_FORMATS }], imports: [NativeDatetimeModule, MatNativeDateModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MtxNativeDatetimeModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [NativeDatetimeModule, MatNativeDateModule],
                    providers: [{ provide: MTX_DATETIME_FORMATS, useValue: MTX_NATIVE_DATETIME_FORMATS }],
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZXRpbWUubW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvZXh0ZW5zaW9ucy9jb3JlL2RhdGV0aW1lL2RhdGV0aW1lLm1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3pDLE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLHdCQUF3QixDQUFDO0FBQy9FLE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQztBQUNyRCxPQUFPLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQztBQUMxRCxPQUFPLEVBQUUscUJBQXFCLEVBQUUsTUFBTSwyQkFBMkIsQ0FBQztBQUNsRSxPQUFPLEVBQUUsMkJBQTJCLEVBQUUsTUFBTSwyQkFBMkIsQ0FBQzs7QUFXeEUsTUFBTSxPQUFPLG9CQUFvQjs7b0lBQXBCLG9CQUFvQjtxSUFBcEIsb0JBQW9CLFlBUnJCLGdCQUFnQjtxSUFRZixvQkFBb0IsYUFQcEI7UUFDVDtZQUNFLE9BQU8sRUFBRSxlQUFlO1lBQ3hCLFFBQVEsRUFBRSxxQkFBcUI7U0FDaEM7S0FDRixZQU5TLGdCQUFnQjsyRkFRZixvQkFBb0I7a0JBVGhDLFFBQVE7bUJBQUM7b0JBQ1IsT0FBTyxFQUFFLENBQUMsZ0JBQWdCLENBQUM7b0JBQzNCLFNBQVMsRUFBRTt3QkFDVDs0QkFDRSxPQUFPLEVBQUUsZUFBZTs0QkFDeEIsUUFBUSxFQUFFLHFCQUFxQjt5QkFDaEM7cUJBQ0Y7aUJBQ0Y7O0FBT0QsTUFBTSxPQUFPLHVCQUF1Qjs7dUlBQXZCLHVCQUF1Qjt3SUFBdkIsdUJBQXVCLFlBTnZCLG9CQUFvQixFQUdDLG1CQUFtQjt3SUFHeEMsdUJBQXVCLGFBRnZCLENBQUMsRUFBRSxPQUFPLEVBQUUsb0JBQW9CLEVBQUUsUUFBUSxFQUFFLDJCQUEyQixFQUFFLENBQUMsWUFEM0Usb0JBQW9CLEVBQUUsbUJBQW1COzJGQUd4Qyx1QkFBdUI7a0JBSm5DLFFBQVE7bUJBQUM7b0JBQ1IsT0FBTyxFQUFFLENBQUMsb0JBQW9CLEVBQUUsbUJBQW1CLENBQUM7b0JBQ3BELFNBQVMsRUFBRSxDQUFDLEVBQUUsT0FBTyxFQUFFLG9CQUFvQixFQUFFLFFBQVEsRUFBRSwyQkFBMkIsRUFBRSxDQUFDO2lCQUN0RiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE5nTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBNYXROYXRpdmVEYXRlTW9kdWxlLCBOYXRpdmVEYXRlTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvY29yZSc7XG5pbXBvcnQgeyBEYXRldGltZUFkYXB0ZXIgfSBmcm9tICcuL2RhdGV0aW1lLWFkYXB0ZXInO1xuaW1wb3J0IHsgTVRYX0RBVEVUSU1FX0ZPUk1BVFMgfSBmcm9tICcuL2RhdGV0aW1lLWZvcm1hdHMnO1xuaW1wb3J0IHsgTmF0aXZlRGF0ZXRpbWVBZGFwdGVyIH0gZnJvbSAnLi9uYXRpdmUtZGF0ZXRpbWUtYWRhcHRlcic7XG5pbXBvcnQgeyBNVFhfTkFUSVZFX0RBVEVUSU1FX0ZPUk1BVFMgfSBmcm9tICcuL25hdGl2ZS1kYXRldGltZS1mb3JtYXRzJztcblxuQE5nTW9kdWxlKHtcbiAgaW1wb3J0czogW05hdGl2ZURhdGVNb2R1bGVdLFxuICBwcm92aWRlcnM6IFtcbiAgICB7XG4gICAgICBwcm92aWRlOiBEYXRldGltZUFkYXB0ZXIsXG4gICAgICB1c2VDbGFzczogTmF0aXZlRGF0ZXRpbWVBZGFwdGVyLFxuICAgIH0sXG4gIF0sXG59KVxuZXhwb3J0IGNsYXNzIE5hdGl2ZURhdGV0aW1lTW9kdWxlIHt9XG5cbkBOZ01vZHVsZSh7XG4gIGltcG9ydHM6IFtOYXRpdmVEYXRldGltZU1vZHVsZSwgTWF0TmF0aXZlRGF0ZU1vZHVsZV0sXG4gIHByb3ZpZGVyczogW3sgcHJvdmlkZTogTVRYX0RBVEVUSU1FX0ZPUk1BVFMsIHVzZVZhbHVlOiBNVFhfTkFUSVZFX0RBVEVUSU1FX0ZPUk1BVFMgfV0sXG59KVxuZXhwb3J0IGNsYXNzIE10eE5hdGl2ZURhdGV0aW1lTW9kdWxlIHt9XG4iXX0=