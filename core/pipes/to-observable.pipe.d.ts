import { PipeTransform } from '@angular/core';
import { Observable } from 'rxjs';
import * as i0 from "@angular/core";
export declare class MtxToObservablePipe implements PipeTransform {
    transform(value: Observable<any> | unknown): Observable<any>;
    static ɵfac: i0.ɵɵFactoryDeclaration<MtxToObservablePipe, never>;
    static ɵpipe: i0.ɵɵPipeDeclaration<MtxToObservablePipe, "toObservable", false>;
}
