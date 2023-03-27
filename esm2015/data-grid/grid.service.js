import { Injectable } from '@angular/core';
export class MtxGridService {
    constructor() { }
    /**
     * Get cell value from column key e.g. `a.b.c`
     * @param rowData Row data
     * @param colDef Column definition
     */
    getCellValue(rowData, colDef) {
        const keyArr = colDef.field ? colDef.field.split('.') : [];
        let tmp = '';
        keyArr.forEach((key, i) => {
            if (i === 0) {
                tmp = rowData[key];
            }
            else {
                tmp = tmp && tmp[key];
            }
        });
        return tmp;
    }
    /**
     * Get all data of a col
     * @param data All data
     * @param colDef Column definition
     */
    getColData(data, colDef) {
        return data.map((rowData) => this.getCellValue(rowData, colDef));
    }
    /**
     * Remove white spaces in a string and convert string to array
     * @param str string
     */
    str2arr(str) {
        return str.replace(/[\r\n\s]/g, '').split(',');
    }
}
MtxGridService.decorators = [
    { type: Injectable }
];
/** @nocollapse */
MtxGridService.ctorParameters = () => [];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JpZC5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vcHJvamVjdHMvZXh0ZW5zaW9ucy9kYXRhLWdyaWQvZ3JpZC5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFJM0MsTUFBTSxPQUFPLGNBQWM7SUFDekIsZ0JBQWUsQ0FBQztJQUVoQjs7OztPQUlHO0lBQ0gsWUFBWSxDQUFDLE9BQVksRUFBRSxNQUFxQjtRQUM5QyxNQUFNLE1BQU0sR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO1FBRTNELElBQUksR0FBRyxHQUFRLEVBQUUsQ0FBQztRQUVsQixNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBVyxFQUFFLENBQVMsRUFBRSxFQUFFO1lBQ3hDLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRTtnQkFDWCxHQUFHLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2FBQ3BCO2lCQUFNO2dCQUNMLEdBQUcsR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2FBQ3ZCO1FBQ0gsQ0FBQyxDQUFDLENBQUM7UUFDSCxPQUFPLEdBQUcsQ0FBQztJQUNiLENBQUM7SUFFRDs7OztPQUlHO0lBQ0gsVUFBVSxDQUFDLElBQVcsRUFBRSxNQUFxQjtRQUMzQyxPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFZLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsT0FBTyxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUM7SUFDeEUsQ0FBQztJQUVEOzs7T0FHRztJQUNILE9BQU8sQ0FBQyxHQUFXO1FBQ2pCLE9BQU8sR0FBRyxDQUFDLE9BQU8sQ0FBQyxXQUFXLEVBQUUsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ2pELENBQUM7OztZQXZDRixVQUFVIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBNdHhHcmlkQ29sdW1uIH0gZnJvbSAnLi9ncmlkLmludGVyZmFjZSc7XHJcblxyXG5ASW5qZWN0YWJsZSgpXHJcbmV4cG9ydCBjbGFzcyBNdHhHcmlkU2VydmljZSB7XHJcbiAgY29uc3RydWN0b3IoKSB7fVxyXG5cclxuICAvKipcclxuICAgKiBHZXQgY2VsbCB2YWx1ZSBmcm9tIGNvbHVtbiBrZXkgZS5nLiBgYS5iLmNgXHJcbiAgICogQHBhcmFtIHJvd0RhdGEgUm93IGRhdGFcclxuICAgKiBAcGFyYW0gY29sRGVmIENvbHVtbiBkZWZpbml0aW9uXHJcbiAgICovXHJcbiAgZ2V0Q2VsbFZhbHVlKHJvd0RhdGE6IGFueSwgY29sRGVmOiBNdHhHcmlkQ29sdW1uKTogc3RyaW5nIHtcclxuICAgIGNvbnN0IGtleUFyciA9IGNvbERlZi5maWVsZCA/IGNvbERlZi5maWVsZC5zcGxpdCgnLicpIDogW107XHJcblxyXG4gICAgbGV0IHRtcDogYW55ID0gJyc7XHJcblxyXG4gICAga2V5QXJyLmZvckVhY2goKGtleTogc3RyaW5nLCBpOiBudW1iZXIpID0+IHtcclxuICAgICAgaWYgKGkgPT09IDApIHtcclxuICAgICAgICB0bXAgPSByb3dEYXRhW2tleV07XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdG1wID0gdG1wICYmIHRtcFtrZXldO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICAgIHJldHVybiB0bXA7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBHZXQgYWxsIGRhdGEgb2YgYSBjb2xcclxuICAgKiBAcGFyYW0gZGF0YSBBbGwgZGF0YVxyXG4gICAqIEBwYXJhbSBjb2xEZWYgQ29sdW1uIGRlZmluaXRpb25cclxuICAgKi9cclxuICBnZXRDb2xEYXRhKGRhdGE6IGFueVtdLCBjb2xEZWY6IE10eEdyaWRDb2x1bW4pOiBhbnlbXSB7XHJcbiAgICByZXR1cm4gZGF0YS5tYXAoKHJvd0RhdGE6IGFueSkgPT4gdGhpcy5nZXRDZWxsVmFsdWUocm93RGF0YSwgY29sRGVmKSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBSZW1vdmUgd2hpdGUgc3BhY2VzIGluIGEgc3RyaW5nIGFuZCBjb252ZXJ0IHN0cmluZyB0byBhcnJheVxyXG4gICAqIEBwYXJhbSBzdHIgc3RyaW5nXHJcbiAgICovXHJcbiAgc3RyMmFycihzdHI6IHN0cmluZyk6IHN0cmluZ1tdIHtcclxuICAgIHJldHVybiBzdHIucmVwbGFjZSgvW1xcclxcblxcc10vZywgJycpLnNwbGl0KCcsJyk7XHJcbiAgfVxyXG59XHJcbiJdfQ==