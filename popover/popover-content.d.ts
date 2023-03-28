import { ApplicationRef, ChangeDetectorRef, ComponentFactoryResolver, InjectionToken, Injector, OnDestroy, TemplateRef, ViewContainerRef } from '@angular/core';
import { Subject } from 'rxjs';
import * as i0 from "@angular/core";
/**
 * Injection token that can be used to reference instances of `MtxPopoverContent`. It serves
 * as alternative token to the actual `MtxPopoverContent` class which could cause unnecessary
 * retention of the class and its directive metadata.
 */
export declare const MTX_POPOVER_CONTENT: InjectionToken<MtxPopoverContent>;
export declare abstract class _MtxPopoverContentBase implements OnDestroy {
    private _template;
    private _componentFactoryResolver;
    private _appRef;
    private _injector;
    private _viewContainerRef;
    private _document;
    private _changeDetectorRef?;
    private _portal;
    private _outlet;
    /** Emits when the popover content has been attached. */
    readonly _attached: Subject<void>;
    constructor(_template: TemplateRef<any>, _componentFactoryResolver: ComponentFactoryResolver, _appRef: ApplicationRef, _injector: Injector, _viewContainerRef: ViewContainerRef, _document: any, _changeDetectorRef?: ChangeDetectorRef | undefined);
    /**
     * Attaches the content with a particular context.
     * @docs-private
     */
    attach(context?: any): void;
    /**
     * Detaches the content.
     * @docs-private
     */
    detach(): void;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<_MtxPopoverContentBase, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<_MtxPopoverContentBase, never, never, {}, {}, never, never, false, never>;
}
/**
 * Popover content that will be rendered lazily once the popover is opened.
 */
export declare class MtxPopoverContent extends _MtxPopoverContentBase {
    static ɵfac: i0.ɵɵFactoryDeclaration<MtxPopoverContent, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<MtxPopoverContent, "ng-template[mtxPopoverContent]", never, {}, {}, never, never, false, never>;
}
