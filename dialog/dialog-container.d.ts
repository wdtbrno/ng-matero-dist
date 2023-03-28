import { MatDialogRef } from '@angular/material/dialog';
import { MtxDialogData } from './dialog-config';
import * as i0 from "@angular/core";
export declare class MtxDialogContainer {
    dialogRef: MatDialogRef<MtxDialogContainer>;
    data: MtxDialogData;
    constructor(dialogRef: MatDialogRef<MtxDialogContainer>, data: MtxDialogData);
    _onClick(fn: () => void): void;
    _onClose(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<MtxDialogContainer, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MtxDialogContainer, "mtx-dialog-container", ["mtxDialogContainer"], {}, {}, never, never, false, never>;
}
