import { ElementRef, Injector, NgZone, ViewContainerRef, ChangeDetectorRef } from '@angular/core';
import { Directionality } from '@angular/cdk/bidi';
import { Overlay } from '@angular/cdk/overlay';
import { CdkColumnDef, _CoalescedStyleScheduler } from '@angular/cdk/table';
import { ColumnResize, ColumnResizeNotifierSource, HeaderRowEventDispatcher, ResizeStrategy } from '@ng-matero/extensions/column-resize';
import { AbstractMatResizable } from './common';
import * as i0 from "@angular/core";
/**
 * Explicitly enables column resizing for a mat-header-cell.
 */
export declare class MatResizable extends AbstractMatResizable {
    protected readonly columnDef: CdkColumnDef;
    protected readonly columnResize: ColumnResize;
    protected readonly directionality: Directionality;
    protected readonly elementRef: ElementRef;
    protected readonly eventDispatcher: HeaderRowEventDispatcher;
    protected readonly injector: Injector;
    protected readonly ngZone: NgZone;
    protected readonly overlay: Overlay;
    protected readonly resizeNotifier: ColumnResizeNotifierSource;
    protected readonly resizeStrategy: ResizeStrategy;
    protected readonly styleScheduler: _CoalescedStyleScheduler;
    protected readonly viewContainerRef: ViewContainerRef;
    protected readonly changeDetectorRef: ChangeDetectorRef;
    isResizable: boolean;
    get hasResizableClass(): string;
    get resizable(): any;
    set resizable(newValue: any);
    protected readonly document: Document;
    constructor(columnDef: CdkColumnDef, columnResize: ColumnResize, directionality: Directionality, document: any, elementRef: ElementRef, eventDispatcher: HeaderRowEventDispatcher, injector: Injector, ngZone: NgZone, overlay: Overlay, resizeNotifier: ColumnResizeNotifierSource, resizeStrategy: ResizeStrategy, styleScheduler: _CoalescedStyleScheduler, viewContainerRef: ViewContainerRef, changeDetectorRef: ChangeDetectorRef);
    static ɵfac: i0.ɵɵFactoryDeclaration<MatResizable, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<MatResizable, "mat-header-cell[resizable], th[mat-header-cell][resizable]", never, { "minWidthPx": "matResizableMinWidthPx"; "maxWidthPx": "matResizableMaxWidthPx"; "resizable": "resizable"; }, {}, never, never, false, never>;
}
