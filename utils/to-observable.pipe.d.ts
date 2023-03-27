import { PipeTransform } from '@angular/core';
import { Observable } from 'rxjs';
export declare class MtxToObservablePipe implements PipeTransform {
    transform(value: Observable<any> | unknown): Observable<any>;
}
