import { Overlay } from '@angular/cdk/overlay';
import { ComponentType } from '@angular/cdk/portal';
import { Injector, TemplateRef, InjectionToken, OnDestroy } from '@angular/core';
import { MtxDrawerConfig } from './drawer-config';
import { MtxDrawerRef } from './drawer-ref';
import * as i0 from "@angular/core";
/** Injection token that can be used to access the data that was passed in to a drawer. */
export declare const MTX_DRAWER_DATA: InjectionToken<any>;
/** Injection token that can be used to specify default drawer options. */
export declare const MTX_DRAWER_DEFAULT_OPTIONS: InjectionToken<MtxDrawerConfig<any>>;
/**
 * Service to trigger Material Design bottom sheets.
 */
export declare class MtxDrawer implements OnDestroy {
    private _overlay;
    private _injector;
    private _parentDrawer;
    private _defaultOptions?;
    private _drawerRefAtThisLevel;
    /** Reference to the currently opened drawer. */
    get _openedDrawerRef(): MtxDrawerRef<any> | null;
    set _openedDrawerRef(value: MtxDrawerRef<any> | null);
    constructor(_overlay: Overlay, _injector: Injector, _parentDrawer: MtxDrawer, _defaultOptions?: MtxDrawerConfig<any> | undefined);
    /**
     * Opens a drawer containing the given component.
     * @param component Type of the component to load into the drawer.
     * @param config Extra configuration options.
     * @returns Reference to the newly-opened drawer.
     */
    open<T, D = any, R = any>(component: ComponentType<T>, config?: MtxDrawerConfig<D>): MtxDrawerRef<T, R>;
    /**
     * Opens a drawer containing the given template.
     * @param template TemplateRef to instantiate as the drawer content.
     * @param config Extra configuration options.
     * @returns Reference to the newly-opened drawer.
     */
    open<T, D = any, R = any>(template: TemplateRef<T>, config?: MtxDrawerConfig<D>): MtxDrawerRef<T, R>;
    /**
     * Dismisses the currently-visible drawer.
     * @param result Data to pass to the drawer instance.
     */
    dismiss<R = any>(result?: R): void;
    ngOnDestroy(): void;
    /**
     * Attaches the drawer container component to the overlay.
     */
    private _attachContainer;
    /**
     * Creates a new overlay and places it in the correct location.
     * @param config The user-specified drawer config.
     */
    private _createOverlay;
    /**
     * Creates an injector to be used inside of a drawer component.
     * @param config Config that was used to create the drawer.
     * @param drawerRef Reference to the drawer.
     */
    private _createInjector;
    static ɵfac: i0.ɵɵFactoryDeclaration<MtxDrawer, [null, null, { optional: true; skipSelf: true; }, { optional: true; }]>;
    static ɵprov: i0.ɵɵInjectableDeclaration<MtxDrawer>;
}
