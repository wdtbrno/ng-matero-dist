import { ChangeDetectorRef, Renderer2, AfterViewInit, OnDestroy, ElementRef, NgZone, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { MtxSplitArea, MtxSplitOutputData, MtxSplitOutputAreaSizes } from './interface';
import { MtxSplitPaneDirective } from './split-pane.directive';
/**
 * mtx-split
 *
 *
 *  PERCENT MODE ([unit]="'percent'")
 *  ___________________________________________________________________________________________
 * |       A       [g1]       B       [g2]       C       [g3]       D       [g4]       E       |
 * |-------------------------------------------------------------------------------------------|
 * |       20                 30                 20                 15                 15      | <-- [size]="x"
 * |               10px               10px               10px               10px               | <-- [gutterSize]="10"
 * |calc(20% - 8px)    calc(30% - 12px)   calc(20% - 8px)    calc(15% - 6px)    calc(15% - 6px)| <-- CSS flex-basis property (with flex-grow&shrink at 0)
 * |     152px              228px              152px              114px              114px     | <-- el.getBoundingClientRect().width
 * |___________________________________________________________________________________________|
 *                                                                                 800px         <-- el.getBoundingClientRect().width
 *  flex-basis = calc( { area.size }% - { area.size/100 * nbGutter*gutterSize }px );
 *
 *
 *  PIXEL MODE ([unit]="'pixel'")
 *  ___________________________________________________________________________________________
 * |       A       [g1]       B       [g2]       C       [g3]       D       [g4]       E       |
 * |-------------------------------------------------------------------------------------------|
 * |      100                250                 *                 150                100      | <-- [size]="y"
 * |               10px               10px               10px               10px               | <-- [gutterSize]="10"
 * |   0 0 100px          0 0 250px           1 1 auto          0 0 150px          0 0 100px   | <-- CSS flex property (flex-grow/flex-shrink/flex-basis)
 * |     100px              250px              200px              150px              100px     | <-- el.getBoundingClientRect().width
 * |___________________________________________________________________________________________|
 *                                                                                 800px         <-- el.getBoundingClientRect().width
 *
 */
export declare class MtxSplitComponent implements AfterViewInit, OnDestroy {
    private ngZone;
    private elRef;
    private cdRef;
    private renderer;
    private _direction;
    set direction(v: 'horizontal' | 'vertical');
    get direction(): 'horizontal' | 'vertical';
    private _unit;
    set unit(v: 'percent' | 'pixel');
    get unit(): 'percent' | 'pixel';
    private _gutterSize;
    set gutterSize(v: number);
    get gutterSize(): number;
    private _gutterStep;
    set gutterStep(v: number);
    get gutterStep(): number;
    private _restrictMove;
    set restrictMove(v: boolean);
    get restrictMove(): boolean;
    private _useTransition;
    set useTransition(v: boolean);
    get useTransition(): boolean;
    private _disabled;
    set disabled(v: boolean);
    get disabled(): boolean;
    private _dir;
    set dir(v: 'ltr' | 'rtl');
    get dir(): 'ltr' | 'rtl';
    private _gutterDblClickDuration;
    set gutterDblClickDuration(v: number);
    get gutterDblClickDuration(): number;
    dragStart: EventEmitter<MtxSplitOutputData>;
    dragEnd: EventEmitter<MtxSplitOutputData>;
    gutterClick: EventEmitter<MtxSplitOutputData>;
    gutterDblClick: EventEmitter<MtxSplitOutputData>;
    private transitionEndSubscriber;
    get transitionEnd(): Observable<MtxSplitOutputAreaSizes>;
    private dragProgressSubject;
    dragProgress$: Observable<MtxSplitOutputData>;
    private isDragging;
    private dragListeners;
    private snapshot;
    private startPoint;
    private endPoint;
    readonly displayedAreas: Array<MtxSplitArea>;
    private readonly hidedAreas;
    private gutterEls;
    constructor(ngZone: NgZone, elRef: ElementRef, cdRef: ChangeDetectorRef, renderer: Renderer2);
    ngAfterViewInit(): void;
    private getNbGutters;
    addArea(component: MtxSplitPaneDirective): void;
    removeArea(component: MtxSplitPaneDirective): void;
    updateArea(component: MtxSplitPaneDirective, resetOrders: boolean, resetSizes: boolean): void;
    showArea(component: MtxSplitPaneDirective): void;
    hideArea(comp: MtxSplitPaneDirective): void;
    getVisibleAreaSizes(): MtxSplitOutputAreaSizes;
    setVisibleAreaSizes(sizes: MtxSplitOutputAreaSizes): boolean;
    private build;
    private refreshStyleSizes;
    _clickTimeout: number | null;
    clickGutter(event: MouseEvent | TouchEvent, gutterNum: number): void;
    startDragging(event: MouseEvent | TouchEvent, gutterOrder: number, gutterNum: number): void;
    private dragEvent;
    private stopDragging;
    notify(type: 'start' | 'progress' | 'end' | 'click' | 'dblclick' | 'transitionEnd', gutterNum: number): void;
    ngOnDestroy(): void;
}
