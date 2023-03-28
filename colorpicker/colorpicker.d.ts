import { Directionality } from '@angular/cdk/bidi';
import { BooleanInput } from '@angular/cdk/coercion';
import { ScrollStrategy, Overlay } from '@angular/cdk/overlay';
import { ChangeDetectorRef, ElementRef, EventEmitter, InjectionToken, NgZone, OnChanges, OnDestroy, TemplateRef, ViewContainerRef } from '@angular/core';
import { CanColor, ThemePalette } from '@angular/material/core';
import { Subject } from 'rxjs';
import { ColorFormat, MtxColorpickerInput } from './colorpicker-input';
import { ColorEvent } from 'ngx-color';
import * as i0 from "@angular/core";
/** Injection token that determines the scroll handling while the panel is open. */
export declare const MTX_COLORPICKER_SCROLL_STRATEGY: InjectionToken<() => ScrollStrategy>;
export declare function MTX_COLORPICKER_SCROLL_STRATEGY_FACTORY(overlay: Overlay): () => ScrollStrategy;
/** Possible positions for the colorpicker dropdown along the X axis. */
export type ColorpickerDropdownPositionX = 'start' | 'end';
/** Possible positions for the colorpicker dropdown along the Y axis. */
export type ColorpickerDropdownPositionY = 'above' | 'below';
export declare const MTX_COLORPICKER_SCROLL_STRATEGY_FACTORY_PROVIDER: {
    provide: InjectionToken<() => ScrollStrategy>;
    deps: (typeof Overlay)[];
    useFactory: typeof MTX_COLORPICKER_SCROLL_STRATEGY_FACTORY;
};
/** @docs-private */
declare const _MtxColorpickerContentBase: import("@angular/material/core")._Constructor<CanColor> & import("@angular/material/core")._AbstractConstructor<CanColor> & {
    new (_elementRef: ElementRef): {
        _elementRef: ElementRef;
    };
};
export declare class MtxColorpickerContent extends _MtxColorpickerContentBase implements OnDestroy, CanColor {
    private _changeDetectorRef;
    picker: MtxColorpicker;
    /** Current state of the animation. */
    _animationState: 'enter-dropdown' | 'void';
    /** Emits when an animation has finished. */
    readonly _animationDone: Subject<void>;
    constructor(elementRef: ElementRef, _changeDetectorRef: ChangeDetectorRef);
    _startExitAnimation(): void;
    ngOnDestroy(): void;
    getColorString(e: ColorEvent): string;
    static ɵfac: i0.ɵɵFactoryDeclaration<MtxColorpickerContent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MtxColorpickerContent, "mtx-colorpicker-content", ["mtxColorpickerContent"], { "color": "color"; }, {}, never, never, false, never>;
}
export declare class MtxColorpicker implements OnChanges, OnDestroy {
    private _overlay;
    private _ngZone;
    private _viewContainerRef;
    private _dir;
    private _document;
    private _scrollStrategy;
    private _inputStateChanges;
    /** Custom colorpicker content set by the consumer. */
    content: TemplateRef<any>;
    /** Emits when the colorpicker has been opened. */
    openedStream: EventEmitter<void>;
    /** Emits when the colorpicker has been closed. */
    closedStream: EventEmitter<void>;
    get disabled(): boolean;
    set disabled(value: boolean);
    private _disabled;
    /** Preferred position of the colorpicker in the X axis. */
    xPosition: ColorpickerDropdownPositionX;
    /** Preferred position of the colorpicker in the Y axis. */
    yPosition: ColorpickerDropdownPositionY;
    /**
     * Whether to restore focus to the previously-focused element when the panel is closed.
     * Note that automatic focus restoration is an accessibility feature and it is recommended that
     * you provide your own equivalent, if you decide to turn it off.
     */
    get restoreFocus(): boolean;
    set restoreFocus(value: boolean);
    private _restoreFocus;
    /** Whether the panel is open. */
    get opened(): boolean;
    set opened(value: boolean);
    private _opened;
    /** The id for the colorpicker panel. */
    id: string;
    /** Color palette to use on the colorpicker's panel. */
    get color(): ThemePalette;
    set color(value: ThemePalette);
    private _color;
    /** The input and output color format. */
    get format(): ColorFormat;
    set format(value: ColorFormat);
    _format: ColorFormat;
    /** The currently selected color. */
    get selected(): string;
    set selected(value: string);
    private _validSelected;
    /** A reference to the overlay when the picker is opened as a popup. */
    private _overlayRef;
    /** Reference to the component instance rendered in the overlay. */
    private _componentRef;
    /** The element that was focused before the colorpicker was opened. */
    private _focusedElementBeforeOpen;
    /** Unique class that will be added to the backdrop so that the test harnesses can look it up. */
    private _backdropHarnessClass;
    /** The input element this colorpicker is associated with. */
    pickerInput: MtxColorpickerInput;
    /** Emits when the datepicker is disabled. */
    readonly _disabledChange: Subject<boolean>;
    /** Emits new selected color when selected color changes. */
    readonly _selectedChanged: Subject<string>;
    constructor(_overlay: Overlay, _ngZone: NgZone, _viewContainerRef: ViewContainerRef, scrollStrategy: any, _dir: Directionality, _document: any);
    ngOnChanges(): void;
    ngOnDestroy(): void;
    /** Selects the given color. */
    select(nextVal: string): void;
    /**
     * Register an input with this colorpicker.
     * @param input The colorpicker input to register with this colorpicker.
     */
    registerInput(input: MtxColorpickerInput): void;
    /** Open the panel. */
    open(): void;
    /** Close the panel. */
    close(): void;
    /** Forwards relevant values from the colorpicker to the colorpicker content inside the overlay. */
    protected _forwardContentValues(instance: MtxColorpickerContent): void;
    /** Open the colopicker as a popup. */
    private _openOverlay;
    /** Destroys the current overlay. */
    private _destroyOverlay;
    /** Gets a position strategy that will open the panel as a dropdown. */
    private _getDropdownStrategy;
    /** Sets the positions of the colorpicker in dropdown mode based on the current configuration. */
    private _setConnectedPositions;
    /** Gets an observable that will emit when the overlay is supposed to be closed. */
    private _getCloseStream;
    static ngAcceptInputType_disabled: BooleanInput;
    static ɵfac: i0.ɵɵFactoryDeclaration<MtxColorpicker, [null, null, null, null, { optional: true; }, { optional: true; }]>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MtxColorpicker, "mtx-colorpicker", ["mtxColorpicker"], { "content": "content"; "disabled": "disabled"; "xPosition": "xPosition"; "yPosition": "yPosition"; "restoreFocus": "restoreFocus"; "opened": "opened"; "color": "color"; "format": "format"; }, { "openedStream": "opened"; "closedStream": "closed"; }, never, never, false, never>;
}
export {};
