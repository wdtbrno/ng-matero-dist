import { MtxGridColumn } from './interfaces';
import * as i0 from "@angular/core";
export declare class MtxGridUtils {
    constructor();
    /**
     * Get cell's value based on the data and column's field (e.g. `a.b.c`)
     * @param rowData Row data
     * @param colDef Column definition
     * @returns
     */
    getCellValue(rowData: Record<string, any>, colDef: MtxGridColumn): string;
    /**
     * Get all data of a col
     * @param data All data
     * @param colDef Column definition
     * @returns
     */
    getColData(data: any[], colDef: MtxGridColumn): any[];
    /**
     * Remove white spaces in a string and convert string to array
     * @param str
     * @returns
     */
    str2arr(str: string): string[];
    /**
     * Whether the value is empty (`null`, `undefined`, `''`, `[]`)
     * @param value
     * @returns
     */
    isEmpty(value: any): boolean;
    /**
     * Whether the value contain HTML
     * @param value
     * @returns
     */
    isContainHTML(value: string): boolean;
    static ɵfac: i0.ɵɵFactoryDeclaration<MtxGridUtils, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<MtxGridUtils>;
}
