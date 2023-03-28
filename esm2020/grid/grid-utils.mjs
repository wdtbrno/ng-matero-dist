import { Injectable } from '@angular/core';
import * as i0 from "@angular/core";
export class MtxGridUtils {
    constructor() { }
    /**
     * Get cell's value based on the data and column's field (e.g. `a.b.c`)
     * @param rowData Row data
     * @param colDef Column definition
     * @returns
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
     * @returns
     */
    getColData(data, colDef) {
        return data.map(rowData => this.getCellValue(rowData, colDef));
    }
    /**
     * Remove white spaces in a string and convert string to array
     * @param str
     * @returns
     */
    str2arr(str) {
        return str.replace(/[\r\n\s]/g, '').split(',');
    }
    /**
     * Whether the value is empty (`null`, `undefined`, `''`, `[]`)
     * @param value
     * @returns
     */
    isEmpty(value) {
        return value == null || value.toString() === '';
    }
    /**
     * Whether the value contain HTML
     * @param value
     * @returns
     */
    isContainHTML(value) {
        return /<\/?[a-z][\s\S]*>/i.test(value);
    }
}
/** @nocollapse */ MtxGridUtils.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MtxGridUtils, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
/** @nocollapse */ MtxGridUtils.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MtxGridUtils });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MtxGridUtils, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return []; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JpZC11dGlscy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL2V4dGVuc2lvbnMvZ3JpZC9ncmlkLXV0aWxzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7O0FBSTNDLE1BQU0sT0FBTyxZQUFZO0lBQ3ZCLGdCQUFlLENBQUM7SUFFaEI7Ozs7O09BS0c7SUFDSCxZQUFZLENBQUMsT0FBNEIsRUFBRSxNQUFxQjtRQUM5RCxNQUFNLE1BQU0sR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO1FBQzNELElBQUksR0FBRyxHQUFRLEVBQUUsQ0FBQztRQUNsQixNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBVyxFQUFFLENBQVMsRUFBRSxFQUFFO1lBQ3hDLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRTtnQkFDWCxHQUFHLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2FBQ3BCO2lCQUFNO2dCQUNMLEdBQUcsR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2FBQ3ZCO1FBQ0gsQ0FBQyxDQUFDLENBQUM7UUFDSCxPQUFPLEdBQUcsQ0FBQztJQUNiLENBQUM7SUFFRDs7Ozs7T0FLRztJQUNILFVBQVUsQ0FBQyxJQUFXLEVBQUUsTUFBcUI7UUFDM0MsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxPQUFPLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQztJQUNqRSxDQUFDO0lBRUQ7Ozs7T0FJRztJQUNILE9BQU8sQ0FBQyxHQUFXO1FBQ2pCLE9BQU8sR0FBRyxDQUFDLE9BQU8sQ0FBQyxXQUFXLEVBQUUsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ2pELENBQUM7SUFFRDs7OztPQUlHO0lBQ0gsT0FBTyxDQUFDLEtBQVU7UUFDaEIsT0FBTyxLQUFLLElBQUksSUFBSSxJQUFJLEtBQUssQ0FBQyxRQUFRLEVBQUUsS0FBSyxFQUFFLENBQUM7SUFDbEQsQ0FBQztJQUVEOzs7O09BSUc7SUFDSCxhQUFhLENBQUMsS0FBYTtRQUN6QixPQUFPLG9CQUFvQixDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUMxQyxDQUFDOzs0SEF6RFUsWUFBWTtnSUFBWixZQUFZOzJGQUFaLFlBQVk7a0JBRHhCLFVBQVUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBNdHhHcmlkQ29sdW1uIH0gZnJvbSAnLi9pbnRlcmZhY2VzJztcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIE10eEdyaWRVdGlscyB7XG4gIGNvbnN0cnVjdG9yKCkge31cblxuICAvKipcbiAgICogR2V0IGNlbGwncyB2YWx1ZSBiYXNlZCBvbiB0aGUgZGF0YSBhbmQgY29sdW1uJ3MgZmllbGQgKGUuZy4gYGEuYi5jYClcbiAgICogQHBhcmFtIHJvd0RhdGEgUm93IGRhdGFcbiAgICogQHBhcmFtIGNvbERlZiBDb2x1bW4gZGVmaW5pdGlvblxuICAgKiBAcmV0dXJuc1xuICAgKi9cbiAgZ2V0Q2VsbFZhbHVlKHJvd0RhdGE6IFJlY29yZDxzdHJpbmcsIGFueT4sIGNvbERlZjogTXR4R3JpZENvbHVtbik6IHN0cmluZyB7XG4gICAgY29uc3Qga2V5QXJyID0gY29sRGVmLmZpZWxkID8gY29sRGVmLmZpZWxkLnNwbGl0KCcuJykgOiBbXTtcbiAgICBsZXQgdG1wOiBhbnkgPSAnJztcbiAgICBrZXlBcnIuZm9yRWFjaCgoa2V5OiBzdHJpbmcsIGk6IG51bWJlcikgPT4ge1xuICAgICAgaWYgKGkgPT09IDApIHtcbiAgICAgICAgdG1wID0gcm93RGF0YVtrZXldO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdG1wID0gdG1wICYmIHRtcFtrZXldO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiB0bXA7XG4gIH1cblxuICAvKipcbiAgICogR2V0IGFsbCBkYXRhIG9mIGEgY29sXG4gICAqIEBwYXJhbSBkYXRhIEFsbCBkYXRhXG4gICAqIEBwYXJhbSBjb2xEZWYgQ29sdW1uIGRlZmluaXRpb25cbiAgICogQHJldHVybnNcbiAgICovXG4gIGdldENvbERhdGEoZGF0YTogYW55W10sIGNvbERlZjogTXR4R3JpZENvbHVtbik6IGFueVtdIHtcbiAgICByZXR1cm4gZGF0YS5tYXAocm93RGF0YSA9PiB0aGlzLmdldENlbGxWYWx1ZShyb3dEYXRhLCBjb2xEZWYpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmUgd2hpdGUgc3BhY2VzIGluIGEgc3RyaW5nIGFuZCBjb252ZXJ0IHN0cmluZyB0byBhcnJheVxuICAgKiBAcGFyYW0gc3RyXG4gICAqIEByZXR1cm5zXG4gICAqL1xuICBzdHIyYXJyKHN0cjogc3RyaW5nKTogc3RyaW5nW10ge1xuICAgIHJldHVybiBzdHIucmVwbGFjZSgvW1xcclxcblxcc10vZywgJycpLnNwbGl0KCcsJyk7XG4gIH1cblxuICAvKipcbiAgICogV2hldGhlciB0aGUgdmFsdWUgaXMgZW1wdHkgKGBudWxsYCwgYHVuZGVmaW5lZGAsIGAnJ2AsIGBbXWApXG4gICAqIEBwYXJhbSB2YWx1ZVxuICAgKiBAcmV0dXJuc1xuICAgKi9cbiAgaXNFbXB0eSh2YWx1ZTogYW55KSB7XG4gICAgcmV0dXJuIHZhbHVlID09IG51bGwgfHwgdmFsdWUudG9TdHJpbmcoKSA9PT0gJyc7XG4gIH1cblxuICAvKipcbiAgICogV2hldGhlciB0aGUgdmFsdWUgY29udGFpbiBIVE1MXG4gICAqIEBwYXJhbSB2YWx1ZVxuICAgKiBAcmV0dXJuc1xuICAgKi9cbiAgaXNDb250YWluSFRNTCh2YWx1ZTogc3RyaW5nKSB7XG4gICAgcmV0dXJuIC88XFwvP1thLXpdW1xcc1xcU10qPi9pLnRlc3QodmFsdWUpO1xuICB9XG59XG4iXX0=