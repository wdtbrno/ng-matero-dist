import { MatDialogRef } from '@angular/material/dialog';
import { MtxDialogData } from './dialog.config';
export declare class MtxDialogComponent {
    dialogRef: MatDialogRef<MtxDialogComponent>;
    data: MtxDialogData;
    constructor(dialogRef: MatDialogRef<MtxDialogComponent>, data: MtxDialogData);
    _onClick(fn: () => void): void;
    _onClose(): void;
}
