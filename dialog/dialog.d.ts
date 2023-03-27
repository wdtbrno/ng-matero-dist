import { TemplateRef } from '@angular/core';
import { ComponentType } from '@angular/cdk/portal';
import { MatDialog } from '@angular/material/dialog';
import { MtxDialogData } from './dialog.config';
import { Observable } from 'rxjs';
export declare class MtxDialog {
    dialog: MatDialog;
    constructor(dialog: MatDialog);
    originalOpen(componentOrTemplateRef: ComponentType<any> | TemplateRef<any> | undefined, config: any): import("@angular/material/dialog").MatDialogRef<any, any>;
    open(config: MtxDialogData, componentOrTemplateRef?: ComponentType<any> | TemplateRef<any>): import("@angular/material/dialog").MatDialogRef<any, any>;
    alert(title: string | Observable<string>, description?: string | Observable<string>, onOk?: () => void): void;
    confirm(title: string | Observable<string>, description?: string | Observable<string>, onOk?: () => void, onClose?: () => void): void;
}
