import { Pipe, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { isObservable, of } from 'rxjs';

class MtxToObservablePipe {
    transform(value) {
        return isObservable(value) ? value : of(value);
    }
}
MtxToObservablePipe.decorators = [
    { type: Pipe, args: [{ name: 'toObservable' },] }
];

class MtxUtilsModule {
}
MtxUtilsModule.decorators = [
    { type: NgModule, args: [{
                imports: [CommonModule],
                exports: [MtxToObservablePipe],
                declarations: [MtxToObservablePipe],
            },] }
];

/**
 * Generated bundle index. Do not edit.
 */

export { MtxToObservablePipe, MtxUtilsModule };
//# sourceMappingURL=mtxUtils.js.map
