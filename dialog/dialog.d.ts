import { TemplateRef } from '@angular/core';
import { ComponentType } from '@angular/cdk/portal';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { MtxDialogData } from './dialog-config';
import * as i0 from "@angular/core";
export declare class MtxDialog {
    dialog: MatDialog;
    constructor(dialog: MatDialog);
    originalOpen(componentOrTemplateRef: ComponentType<any> | TemplateRef<any> | undefined, config: any): import("@angular/material/dialog").MatDialogRef<any, any>;
    open(config: MtxDialogData, componentOrTemplateRef?: ComponentType<any> | TemplateRef<any>): import("@angular/material/dialog").MatDialogRef<any, any>;
    alert(title: string | Observable<string>, description?: string | Observable<string>, onOk?: () => void): void;
    confirm(title: string | Observable<string>, description?: string | Observable<string>, onOk?: () => void, onClose?: () => void): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<MtxDialog, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<MtxDialog>;
}
