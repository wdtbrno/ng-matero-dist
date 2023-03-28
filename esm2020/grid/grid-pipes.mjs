import { Pipe } from '@angular/core';
import { isObservable } from 'rxjs';
import * as i0 from "@angular/core";
import * as i1 from "./grid-utils";
export class MtxGridColClassPipe {
    transform(colDef, rowData, rowChangeRecord, currentValue) {
        if (typeof colDef.class === 'string') {
            return colDef.class;
        }
        else if (typeof colDef.class === 'function') {
            return colDef.class(rowData, colDef);
        }
        return '';
    }
}
/** @nocollapse */ MtxGridColClassPipe.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MtxGridColClassPipe, deps: [], target: i0.ɵɵFactoryTarget.Pipe });
/** @nocollapse */ MtxGridColClassPipe.ɵpipe = i0.ɵɵngDeclarePipe({ minVersion: "14.0.0", version: "15.2.1", ngImport: i0, type: MtxGridColClassPipe, name: "colClass" });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MtxGridColClassPipe, decorators: [{
            type: Pipe,
            args: [{
                    name: 'colClass',
                }]
        }] });
export class MtxGridRowClassPipe {
    transform(rowData, index, dataIndex, rowClassFormatter) {
        const rowIndex = typeof index === 'undefined' ? dataIndex : index;
        const classList = rowIndex % 2 === 1 ? ['mat-row-odd'] : [];
        if (rowClassFormatter) {
            for (const key of Object.keys(rowClassFormatter)) {
                if (rowClassFormatter[key](rowData, rowIndex)) {
                    classList.push(key);
                }
            }
        }
        return classList.join(' ');
    }
}
/** @nocollapse */ MtxGridRowClassPipe.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MtxGridRowClassPipe, deps: [], target: i0.ɵɵFactoryTarget.Pipe });
/** @nocollapse */ MtxGridRowClassPipe.ɵpipe = i0.ɵɵngDeclarePipe({ minVersion: "14.0.0", version: "15.2.1", ngImport: i0, type: MtxGridRowClassPipe, name: "rowClass" });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MtxGridRowClassPipe, decorators: [{
            type: Pipe,
            args: [{
                    name: 'rowClass',
                }]
        }] });
export class MtxGridCellActionTooltipPipe {
    transform(btn) {
        if (typeof btn.tooltip === 'string' || isObservable(btn.tooltip)) {
            return {
                message: btn.tooltip,
            };
        }
        else {
            return btn.tooltip || { message: '' };
        }
    }
}
/** @nocollapse */ MtxGridCellActionTooltipPipe.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MtxGridCellActionTooltipPipe, deps: [], target: i0.ɵɵFactoryTarget.Pipe });
/** @nocollapse */ MtxGridCellActionTooltipPipe.ɵpipe = i0.ɵɵngDeclarePipe({ minVersion: "14.0.0", version: "15.2.1", ngImport: i0, type: MtxGridCellActionTooltipPipe, name: "cellActionTooltip" });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MtxGridCellActionTooltipPipe, decorators: [{
            type: Pipe,
            args: [{
                    name: 'cellActionTooltip',
                }]
        }] });
export class MtxGridCellActionDisablePipe {
    transform(btn, rowData) {
        if (typeof btn.disabled === 'boolean') {
            return btn.disabled;
        }
        else if (typeof btn.disabled === 'function') {
            return btn.disabled(rowData);
        }
        else {
            return false;
        }
    }
}
/** @nocollapse */ MtxGridCellActionDisablePipe.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MtxGridCellActionDisablePipe, deps: [], target: i0.ɵɵFactoryTarget.Pipe });
/** @nocollapse */ MtxGridCellActionDisablePipe.ɵpipe = i0.ɵɵngDeclarePipe({ minVersion: "14.0.0", version: "15.2.1", ngImport: i0, type: MtxGridCellActionDisablePipe, name: "cellActionDisable" });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MtxGridCellActionDisablePipe, decorators: [{
            type: Pipe,
            args: [{
                    name: 'cellActionDisable',
                }]
        }] });
export class MtxGridCellSummaryPipe {
    constructor(utils) {
        this.utils = utils;
    }
    transform(data, colDef) {
        if (typeof colDef.summary === 'string') {
            return colDef.summary;
        }
        else if (typeof colDef.summary === 'function') {
            return colDef.summary(this.utils.getColData(data, colDef), colDef);
        }
    }
}
/** @nocollapse */ MtxGridCellSummaryPipe.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MtxGridCellSummaryPipe, deps: [{ token: i1.MtxGridUtils }], target: i0.ɵɵFactoryTarget.Pipe });
/** @nocollapse */ MtxGridCellSummaryPipe.ɵpipe = i0.ɵɵngDeclarePipe({ minVersion: "14.0.0", version: "15.2.1", ngImport: i0, type: MtxGridCellSummaryPipe, name: "cellSummary" });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MtxGridCellSummaryPipe, decorators: [{
            type: Pipe,
            args: [{
                    name: 'cellSummary',
                }]
        }], ctorParameters: function () { return [{ type: i1.MtxGridUtils }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JpZC1waXBlcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL2V4dGVuc2lvbnMvZ3JpZC9ncmlkLXBpcGVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBd0IsSUFBSSxFQUFpQixNQUFNLGVBQWUsQ0FBQztBQUMxRSxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sTUFBTSxDQUFDOzs7QUFPcEMsTUFBTSxPQUFPLG1CQUFtQjtJQUM5QixTQUFTLENBQ1AsTUFBcUIsRUFDckIsT0FBNkIsRUFDN0IsZUFBbUQsRUFDbkQsWUFBa0I7UUFFbEIsSUFBSSxPQUFPLE1BQU0sQ0FBQyxLQUFLLEtBQUssUUFBUSxFQUFFO1lBQ3BDLE9BQU8sTUFBTSxDQUFDLEtBQUssQ0FBQztTQUNyQjthQUFNLElBQUksT0FBTyxNQUFNLENBQUMsS0FBSyxLQUFLLFVBQVUsRUFBRTtZQUM3QyxPQUFPLE1BQU0sQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1NBQ3RDO1FBQ0QsT0FBTyxFQUFFLENBQUM7SUFDWixDQUFDOzttSUFiVSxtQkFBbUI7aUlBQW5CLG1CQUFtQjsyRkFBbkIsbUJBQW1CO2tCQUgvQixJQUFJO21CQUFDO29CQUNKLElBQUksRUFBRSxVQUFVO2lCQUNqQjs7QUFvQkQsTUFBTSxPQUFPLG1CQUFtQjtJQUM5QixTQUFTLENBQ1AsT0FBNEIsRUFDNUIsS0FBYSxFQUNiLFNBQWlCLEVBQ2pCLGlCQUE0QztRQUU1QyxNQUFNLFFBQVEsR0FBRyxPQUFPLEtBQUssS0FBSyxXQUFXLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO1FBQ2xFLE1BQU0sU0FBUyxHQUFhLFFBQVEsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7UUFDdEUsSUFBSSxpQkFBaUIsRUFBRTtZQUNyQixLQUFLLE1BQU0sR0FBRyxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsRUFBRTtnQkFDaEQsSUFBSSxpQkFBaUIsQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLEVBQUUsUUFBUSxDQUFDLEVBQUU7b0JBQzdDLFNBQVMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7aUJBQ3JCO2FBQ0Y7U0FDRjtRQUNELE9BQU8sU0FBUyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUM3QixDQUFDOzttSUFqQlUsbUJBQW1CO2lJQUFuQixtQkFBbUI7MkZBQW5CLG1CQUFtQjtrQkFIL0IsSUFBSTttQkFBQztvQkFDSixJQUFJLEVBQUUsVUFBVTtpQkFDakI7O0FBd0JELE1BQU0sT0FBTyw0QkFBNEI7SUFDdkMsU0FBUyxDQUFDLEdBQXdCO1FBQ2hDLElBQUksT0FBTyxHQUFHLENBQUMsT0FBTyxLQUFLLFFBQVEsSUFBSSxZQUFZLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxFQUFFO1lBQ2hFLE9BQU87Z0JBQ0wsT0FBTyxFQUFFLEdBQUcsQ0FBQyxPQUFPO2FBQ3JCLENBQUM7U0FDSDthQUFNO1lBQ0wsT0FBTyxHQUFHLENBQUMsT0FBTyxJQUFJLEVBQUUsT0FBTyxFQUFFLEVBQUUsRUFBRSxDQUFDO1NBQ3ZDO0lBQ0gsQ0FBQzs7NElBVFUsNEJBQTRCOzBJQUE1Qiw0QkFBNEI7MkZBQTVCLDRCQUE0QjtrQkFIeEMsSUFBSTttQkFBQztvQkFDSixJQUFJLEVBQUUsbUJBQW1CO2lCQUMxQjs7QUFnQkQsTUFBTSxPQUFPLDRCQUE0QjtJQUN2QyxTQUFTLENBQUMsR0FBd0IsRUFBRSxPQUE0QjtRQUM5RCxJQUFJLE9BQU8sR0FBRyxDQUFDLFFBQVEsS0FBSyxTQUFTLEVBQUU7WUFDckMsT0FBTyxHQUFHLENBQUMsUUFBUSxDQUFDO1NBQ3JCO2FBQU0sSUFBSSxPQUFPLEdBQUcsQ0FBQyxRQUFRLEtBQUssVUFBVSxFQUFFO1lBQzdDLE9BQU8sR0FBRyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQztTQUM5QjthQUFNO1lBQ0wsT0FBTyxLQUFLLENBQUM7U0FDZDtJQUNILENBQUM7OzRJQVRVLDRCQUE0QjswSUFBNUIsNEJBQTRCOzJGQUE1Qiw0QkFBNEI7a0JBSHhDLElBQUk7bUJBQUM7b0JBQ0osSUFBSSxFQUFFLG1CQUFtQjtpQkFDMUI7O0FBZ0JELE1BQU0sT0FBTyxzQkFBc0I7SUFDakMsWUFBb0IsS0FBbUI7UUFBbkIsVUFBSyxHQUFMLEtBQUssQ0FBYztJQUFHLENBQUM7SUFDM0MsU0FBUyxDQUFDLElBQVcsRUFBRSxNQUFxQjtRQUMxQyxJQUFJLE9BQU8sTUFBTSxDQUFDLE9BQU8sS0FBSyxRQUFRLEVBQUU7WUFDdEMsT0FBTyxNQUFNLENBQUMsT0FBTyxDQUFDO1NBQ3ZCO2FBQU0sSUFBSSxPQUFPLE1BQU0sQ0FBQyxPQUFPLEtBQUssVUFBVSxFQUFFO1lBQy9DLE9BQVEsTUFBTSxDQUFDLE9BQXdELENBQ3JFLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLElBQUksRUFBRSxNQUFNLENBQUMsRUFDbkMsTUFBTSxDQUNQLENBQUM7U0FDSDtJQUNILENBQUM7O3NJQVhVLHNCQUFzQjtvSUFBdEIsc0JBQXNCOzJGQUF0QixzQkFBc0I7a0JBSGxDLElBQUk7bUJBQUM7b0JBQ0osSUFBSSxFQUFFLGFBQWE7aUJBQ3BCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgS2V5VmFsdWVDaGFuZ2VSZWNvcmQsIFBpcGUsIFBpcGVUcmFuc2Zvcm0gfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IGlzT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgTXR4R3JpZFV0aWxzIH0gZnJvbSAnLi9ncmlkLXV0aWxzJztcbmltcG9ydCB7IE10eEdyaWRDb2x1bW4sIE10eEdyaWRDb2x1bW5CdXR0b24sIE10eEdyaWRSb3dDbGFzc0Zvcm1hdHRlciB9IGZyb20gJy4vaW50ZXJmYWNlcyc7XG5cbkBQaXBlKHtcbiAgbmFtZTogJ2NvbENsYXNzJyxcbn0pXG5leHBvcnQgY2xhc3MgTXR4R3JpZENvbENsYXNzUGlwZSBpbXBsZW1lbnRzIFBpcGVUcmFuc2Zvcm0ge1xuICB0cmFuc2Zvcm0oXG4gICAgY29sRGVmOiBNdHhHcmlkQ29sdW1uLFxuICAgIHJvd0RhdGE/OiBSZWNvcmQ8c3RyaW5nLCBhbnk+LFxuICAgIHJvd0NoYW5nZVJlY29yZD86IEtleVZhbHVlQ2hhbmdlUmVjb3JkPHN0cmluZywgYW55PixcbiAgICBjdXJyZW50VmFsdWU/OiBhbnlcbiAgKTogc3RyaW5nIHtcbiAgICBpZiAodHlwZW9mIGNvbERlZi5jbGFzcyA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHJldHVybiBjb2xEZWYuY2xhc3M7XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgY29sRGVmLmNsYXNzID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICByZXR1cm4gY29sRGVmLmNsYXNzKHJvd0RhdGEsIGNvbERlZik7XG4gICAgfVxuICAgIHJldHVybiAnJztcbiAgfVxufVxuXG5AUGlwZSh7XG4gIG5hbWU6ICdyb3dDbGFzcycsXG59KVxuZXhwb3J0IGNsYXNzIE10eEdyaWRSb3dDbGFzc1BpcGUgaW1wbGVtZW50cyBQaXBlVHJhbnNmb3JtIHtcbiAgdHJhbnNmb3JtKFxuICAgIHJvd0RhdGE6IFJlY29yZDxzdHJpbmcsIGFueT4sXG4gICAgaW5kZXg6IG51bWJlcixcbiAgICBkYXRhSW5kZXg6IG51bWJlcixcbiAgICByb3dDbGFzc0Zvcm1hdHRlcj86IE10eEdyaWRSb3dDbGFzc0Zvcm1hdHRlclxuICApOiBzdHJpbmcge1xuICAgIGNvbnN0IHJvd0luZGV4ID0gdHlwZW9mIGluZGV4ID09PSAndW5kZWZpbmVkJyA/IGRhdGFJbmRleCA6IGluZGV4O1xuICAgIGNvbnN0IGNsYXNzTGlzdDogc3RyaW5nW10gPSByb3dJbmRleCAlIDIgPT09IDEgPyBbJ21hdC1yb3ctb2RkJ10gOiBbXTtcbiAgICBpZiAocm93Q2xhc3NGb3JtYXR0ZXIpIHtcbiAgICAgIGZvciAoY29uc3Qga2V5IG9mIE9iamVjdC5rZXlzKHJvd0NsYXNzRm9ybWF0dGVyKSkge1xuICAgICAgICBpZiAocm93Q2xhc3NGb3JtYXR0ZXJba2V5XShyb3dEYXRhLCByb3dJbmRleCkpIHtcbiAgICAgICAgICBjbGFzc0xpc3QucHVzaChrZXkpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBjbGFzc0xpc3Quam9pbignICcpO1xuICB9XG59XG5cbkBQaXBlKHtcbiAgbmFtZTogJ2NlbGxBY3Rpb25Ub29sdGlwJyxcbn0pXG5leHBvcnQgY2xhc3MgTXR4R3JpZENlbGxBY3Rpb25Ub29sdGlwUGlwZSBpbXBsZW1lbnRzIFBpcGVUcmFuc2Zvcm0ge1xuICB0cmFuc2Zvcm0oYnRuOiBNdHhHcmlkQ29sdW1uQnV0dG9uKSB7XG4gICAgaWYgKHR5cGVvZiBidG4udG9vbHRpcCA9PT0gJ3N0cmluZycgfHwgaXNPYnNlcnZhYmxlKGJ0bi50b29sdGlwKSkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgbWVzc2FnZTogYnRuLnRvb2x0aXAsXG4gICAgICB9O1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gYnRuLnRvb2x0aXAgfHwgeyBtZXNzYWdlOiAnJyB9O1xuICAgIH1cbiAgfVxufVxuXG5AUGlwZSh7XG4gIG5hbWU6ICdjZWxsQWN0aW9uRGlzYWJsZScsXG59KVxuZXhwb3J0IGNsYXNzIE10eEdyaWRDZWxsQWN0aW9uRGlzYWJsZVBpcGUgaW1wbGVtZW50cyBQaXBlVHJhbnNmb3JtIHtcbiAgdHJhbnNmb3JtKGJ0bjogTXR4R3JpZENvbHVtbkJ1dHRvbiwgcm93RGF0YTogUmVjb3JkPHN0cmluZywgYW55Pikge1xuICAgIGlmICh0eXBlb2YgYnRuLmRpc2FibGVkID09PSAnYm9vbGVhbicpIHtcbiAgICAgIHJldHVybiBidG4uZGlzYWJsZWQ7XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgYnRuLmRpc2FibGVkID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICByZXR1cm4gYnRuLmRpc2FibGVkKHJvd0RhdGEpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG59XG5cbkBQaXBlKHtcbiAgbmFtZTogJ2NlbGxTdW1tYXJ5Jyxcbn0pXG5leHBvcnQgY2xhc3MgTXR4R3JpZENlbGxTdW1tYXJ5UGlwZSBpbXBsZW1lbnRzIFBpcGVUcmFuc2Zvcm0ge1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHV0aWxzOiBNdHhHcmlkVXRpbHMpIHt9XG4gIHRyYW5zZm9ybShkYXRhOiBhbnlbXSwgY29sRGVmOiBNdHhHcmlkQ29sdW1uKSB7XG4gICAgaWYgKHR5cGVvZiBjb2xEZWYuc3VtbWFyeSA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHJldHVybiBjb2xEZWYuc3VtbWFyeTtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBjb2xEZWYuc3VtbWFyeSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgcmV0dXJuIChjb2xEZWYuc3VtbWFyeSBhcyAoZGF0YTogYW55W10sIGNvbERlZj86IE10eEdyaWRDb2x1bW4pID0+IGFueSkoXG4gICAgICAgIHRoaXMudXRpbHMuZ2V0Q29sRGF0YShkYXRhLCBjb2xEZWYpLFxuICAgICAgICBjb2xEZWZcbiAgICAgICk7XG4gICAgfVxuICB9XG59XG4iXX0=