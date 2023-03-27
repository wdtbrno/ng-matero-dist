import { MtxGridColumn } from './grid.interface';
export declare class MtxGridService {
    constructor();
    /**
     * Get cell value from column key e.g. `a.b.c`
     * @param rowData Row data
     * @param colDef Column definition
     */
    getCellValue(rowData: any, colDef: MtxGridColumn): string;
    /**
     * Get all data of a col
     * @param data All data
     * @param colDef Column definition
     */
    getColData(data: any[], colDef: MtxGridColumn): any[];
    /**
     * Remove white spaces in a string and convert string to array
     * @param str string
     */
    str2arr(str: string): string[];
}
