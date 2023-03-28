import { InjectionToken } from '@angular/core';
export interface MtxDatetimeFormats {
    parse: {
        dateInput?: any;
        monthInput?: any;
        yearInput?: any;
        timeInput?: any;
        datetimeInput?: any;
    };
    display: {
        dateInput: any;
        monthInput: any;
        yearInput?: any;
        timeInput: any;
        datetimeInput: any;
        monthYearLabel: any;
        dateA11yLabel: any;
        monthYearA11yLabel: any;
        popupHeaderDateLabel: any;
    };
}
export declare const MTX_DATETIME_FORMATS: InjectionToken<MtxDatetimeFormats>;
