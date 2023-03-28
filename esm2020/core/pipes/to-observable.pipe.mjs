import { Pipe } from '@angular/core';
import { of, isObservable } from 'rxjs';
import * as i0 from "@angular/core";
export class MtxToObservablePipe {
    transform(value) {
        return isObservable(value) ? value : of(value);
    }
}
/** @nocollapse */ MtxToObservablePipe.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MtxToObservablePipe, deps: [], target: i0.ɵɵFactoryTarget.Pipe });
/** @nocollapse */ MtxToObservablePipe.ɵpipe = i0.ɵɵngDeclarePipe({ minVersion: "14.0.0", version: "15.2.1", ngImport: i0, type: MtxToObservablePipe, name: "toObservable" });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MtxToObservablePipe, decorators: [{
            type: Pipe,
            args: [{ name: 'toObservable' }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG8tb2JzZXJ2YWJsZS5waXBlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvZXh0ZW5zaW9ucy9jb3JlL3BpcGVzL3RvLW9ic2VydmFibGUucGlwZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsSUFBSSxFQUFpQixNQUFNLGVBQWUsQ0FBQztBQUNwRCxPQUFPLEVBQWMsRUFBRSxFQUFFLFlBQVksRUFBRSxNQUFNLE1BQU0sQ0FBQzs7QUFHcEQsTUFBTSxPQUFPLG1CQUFtQjtJQUM5QixTQUFTLENBQUMsS0FBZ0M7UUFDeEMsT0FBTyxZQUFZLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ2pELENBQUM7O21JQUhVLG1CQUFtQjtpSUFBbkIsbUJBQW1COzJGQUFuQixtQkFBbUI7a0JBRC9CLElBQUk7bUJBQUMsRUFBRSxJQUFJLEVBQUUsY0FBYyxFQUFFIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgUGlwZSwgUGlwZVRyYW5zZm9ybSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSwgb2YsIGlzT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xuXG5AUGlwZSh7IG5hbWU6ICd0b09ic2VydmFibGUnIH0pXG5leHBvcnQgY2xhc3MgTXR4VG9PYnNlcnZhYmxlUGlwZSBpbXBsZW1lbnRzIFBpcGVUcmFuc2Zvcm0ge1xuICB0cmFuc2Zvcm0odmFsdWU6IE9ic2VydmFibGU8YW55PiB8IHVua25vd24pOiBPYnNlcnZhYmxlPGFueT4ge1xuICAgIHJldHVybiBpc09ic2VydmFibGUodmFsdWUpID8gdmFsdWUgOiBvZih2YWx1ZSk7XG4gIH1cbn1cbiJdfQ==