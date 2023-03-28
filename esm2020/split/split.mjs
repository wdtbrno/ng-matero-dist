import { Component, Input, Output, ChangeDetectionStrategy, ViewChildren, EventEmitter, ViewEncapsulation, } from '@angular/core';
import { mixinColor } from '@angular/material/core';
import { Observable, Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { getInputPositiveNumber, getInputBoolean, isUserSizesValid, getAreaMinSize, getAreaMaxSize, getPointFromEvent, getElementPixelSize, getGutterSideAbsorptionCapacity, updateAreaSize, } from './utils';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
// Boilerplate for applying mixins to _MtxSplitBase.
/** @docs-private */
const _MtxSplitBase = mixinColor(class {
    constructor(_elementRef) {
        this._elementRef = _elementRef;
    }
});
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
export class MtxSplit extends _MtxSplitBase {
    set direction(v) {
        this._direction = v === 'vertical' ? 'vertical' : 'horizontal';
        this.renderer.addClass(this.elRef.nativeElement, `mtx-split-${this._direction}`);
        this.renderer.removeClass(this.elRef.nativeElement, `mtx-split-${this._direction === 'vertical' ? 'horizontal' : 'vertical'}`);
        this.build(false, false);
    }
    get direction() {
        return this._direction;
    }
    set unit(v) {
        this._unit = v === 'pixel' ? 'pixel' : 'percent';
        this.renderer.addClass(this.elRef.nativeElement, `mtx-split-${this._unit}`);
        this.renderer.removeClass(this.elRef.nativeElement, `mtx-split-${this._unit === 'pixel' ? 'percent' : 'pixel'}`);
        this.build(false, true);
    }
    get unit() {
        return this._unit;
    }
    set gutterSize(v) {
        this._gutterSize = getInputPositiveNumber(v, 11);
        this.build(false, false);
    }
    get gutterSize() {
        return this._gutterSize;
    }
    set gutterStep(v) {
        this._gutterStep = getInputPositiveNumber(v, 1);
    }
    get gutterStep() {
        return this._gutterStep;
    }
    set restrictMove(v) {
        this._restrictMove = getInputBoolean(v);
    }
    get restrictMove() {
        return this._restrictMove;
    }
    set useTransition(v) {
        this._useTransition = getInputBoolean(v);
        if (this._useTransition) {
            this.renderer.addClass(this.elRef.nativeElement, 'mtx-split-transition');
        }
        else {
            this.renderer.removeClass(this.elRef.nativeElement, 'mtx-split-transition');
        }
    }
    get useTransition() {
        return this._useTransition;
    }
    set disabled(v) {
        this._disabled = getInputBoolean(v);
        if (this._disabled) {
            this.renderer.addClass(this.elRef.nativeElement, 'mtx-split-disabled');
        }
        else {
            this.renderer.removeClass(this.elRef.nativeElement, 'mtx-split-disabled');
        }
    }
    get disabled() {
        return this._disabled;
    }
    set dir(v) {
        this._dir = v === 'rtl' ? 'rtl' : 'ltr';
        this.renderer.setAttribute(this.elRef.nativeElement, 'dir', this._dir);
    }
    get dir() {
        return this._dir;
    }
    set gutterDblClickDuration(v) {
        this._gutterDblClickDuration = getInputPositiveNumber(v, 0);
    }
    get gutterDblClickDuration() {
        return this._gutterDblClickDuration;
    }
    get transitionEnd() {
        return new Observable(subscriber => (this.transitionEndSubscriber = subscriber)).pipe(debounceTime(20));
    }
    constructor(ngZone, elRef, cdRef, renderer) {
        super(elRef);
        this.ngZone = ngZone;
        this.elRef = elRef;
        this.cdRef = cdRef;
        this.renderer = renderer;
        this._direction = 'horizontal';
        ////
        this._unit = 'percent';
        ////
        this._gutterSize = 4;
        ////
        this._gutterStep = 1;
        ////
        this._restrictMove = false;
        ////
        this._useTransition = false;
        ////
        this._disabled = false;
        ////
        this._dir = 'ltr';
        ////
        this._gutterDblClickDuration = 0;
        ////
        this.dragStart = new EventEmitter(false);
        this.dragEnd = new EventEmitter(false);
        this.gutterClick = new EventEmitter(false);
        this.gutterDblClick = new EventEmitter(false);
        this.dragProgressSubject = new Subject();
        this.dragProgress$ = this.dragProgressSubject.asObservable();
        ////
        this.isDragging = false;
        this.dragListeners = [];
        this.snapshot = null;
        this.startPoint = null;
        this.endPoint = null;
        this.displayedAreas = [];
        this.hidedAreas = [];
        this._clickTimeout = null;
        // To force adding default class, could be override by user @Input() or not
        this.direction = this._direction;
    }
    ngAfterViewInit() {
        this.ngZone.runOutsideAngular(() => {
            // To avoid transition at first rendering
            setTimeout(() => this.renderer.addClass(this.elRef.nativeElement, 'mtx-split-init'));
        });
    }
    getNbGutters() {
        return this.displayedAreas.length === 0 ? 0 : this.displayedAreas.length - 1;
    }
    addArea(component) {
        const newArea = {
            component,
            order: 0,
            size: 0,
            minSize: null,
            maxSize: null,
        };
        if (component.visible === true) {
            this.displayedAreas.push(newArea);
            this.build(true, true);
        }
        else {
            this.hidedAreas.push(newArea);
        }
    }
    removeArea(component) {
        if (this.displayedAreas.some(a => a.component === component)) {
            const area = this.displayedAreas.find(a => a.component === component);
            this.displayedAreas.splice(this.displayedAreas.indexOf(area), 1);
            this.build(true, true);
        }
        else if (this.hidedAreas.some(a => a.component === component)) {
            const area = this.hidedAreas.find(a => a.component === component);
            this.hidedAreas.splice(this.hidedAreas.indexOf(area), 1);
        }
    }
    updateArea(component, resetOrders, resetSizes) {
        if (component.visible === true) {
            this.build(resetOrders, resetSizes);
        }
    }
    showArea(component) {
        const area = this.hidedAreas.find(a => a.component === component);
        if (area === undefined) {
            return;
        }
        const areas = this.hidedAreas.splice(this.hidedAreas.indexOf(area), 1);
        this.displayedAreas.push(...areas);
        this.build(true, true);
    }
    hideArea(comp) {
        const area = this.displayedAreas.find(a => a.component === comp);
        if (area === undefined) {
            return;
        }
        const areas = this.displayedAreas.splice(this.displayedAreas.indexOf(area), 1);
        areas.forEach(_area => {
            _area.order = 0;
            _area.size = 0;
        });
        this.hidedAreas.push(...areas);
        this.build(true, true);
    }
    getVisibleAreaSizes() {
        return this.displayedAreas.map(a => (a.size === null ? '*' : a.size));
    }
    setVisibleAreaSizes(sizes) {
        if (sizes.length !== this.displayedAreas.length) {
            return false;
        }
        const formatedSizes = sizes.map(s => getInputPositiveNumber(s, null));
        const isValid = isUserSizesValid(this.unit, formatedSizes);
        if (isValid === false) {
            return false;
        }
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        this.displayedAreas.forEach((area, i) => (area.component._size = formatedSizes[i]));
        this.build(false, true);
        return true;
    }
    build(resetOrders, resetSizes) {
        this.stopDragging();
        // ¤ AREAS ORDER
        if (resetOrders === true) {
            // If user provided 'order' for each area, use it to sort them.
            if (this.displayedAreas.every(a => a.component.order !== null)) {
                this.displayedAreas.sort((a, b) => (a.component.order - b.component.order));
            }
            // Then set real order with multiples of 2, numbers between will be used by gutters.
            this.displayedAreas.forEach((area, i) => {
                area.order = i * 2;
                area.component.setStyleOrder(area.order);
            });
        }
        // ¤ AREAS SIZE
        if (resetSizes === true) {
            const useUserSizes = isUserSizesValid(this.unit, this.displayedAreas.map(a => a.component.size));
            switch (this.unit) {
                case 'percent': {
                    const defaultSize = 100 / this.displayedAreas.length;
                    this.displayedAreas.forEach(area => {
                        area.size = useUserSizes ? area.component.size : defaultSize;
                        area.minSize = getAreaMinSize(area);
                        area.maxSize = getAreaMaxSize(area);
                    });
                    break;
                }
                case 'pixel': {
                    if (useUserSizes) {
                        this.displayedAreas.forEach(area => {
                            area.size = area.component.size;
                            area.minSize = getAreaMinSize(area);
                            area.maxSize = getAreaMaxSize(area);
                        });
                    }
                    else {
                        const wildcardSizeAreas = this.displayedAreas.filter(a => a.component.size === null);
                        // No wildcard area > Need to select one arbitrarily > first
                        if (wildcardSizeAreas.length === 0 && this.displayedAreas.length > 0) {
                            this.displayedAreas.forEach((area, i) => {
                                area.size = i === 0 ? null : area.component.size;
                                area.minSize = i === 0 ? null : getAreaMinSize(area);
                                area.maxSize = i === 0 ? null : getAreaMaxSize(area);
                            });
                        }
                        // More than one wildcard area > Need to keep only one arbitrarly > first
                        else if (wildcardSizeAreas.length > 1) {
                            let alreadyGotOne = false;
                            this.displayedAreas.forEach(area => {
                                if (area.component.size === null) {
                                    if (alreadyGotOne === false) {
                                        area.size = null;
                                        area.minSize = null;
                                        area.maxSize = null;
                                        alreadyGotOne = true;
                                    }
                                    else {
                                        area.size = 100;
                                        area.minSize = null;
                                        area.maxSize = null;
                                    }
                                }
                                else {
                                    area.size = area.component.size;
                                    area.minSize = getAreaMinSize(area);
                                    area.maxSize = getAreaMaxSize(area);
                                }
                            });
                        }
                    }
                    break;
                }
            }
        }
        this.refreshStyleSizes();
        this.cdRef.markForCheck();
    }
    refreshStyleSizes() {
        ///////////////////////////////////////////
        // PERCENT MODE
        if (this.unit === 'percent') {
            // Only one area > flex-basis 100%
            if (this.displayedAreas.length === 1) {
                this.displayedAreas[0].component.setStyleFlex(0, 0, `100%`, false, false);
            }
            // Multiple areas > use each percent basis
            else {
                const sumGutterSize = this.getNbGutters() * this.gutterSize;
                this.displayedAreas.forEach(area => {
                    area.component.setStyleFlex(0, 0, `calc( ${area.size}% - ${(area.size / 100) * sumGutterSize}px )`, area.minSize !== null && area.minSize === area.size ? true : false, area.maxSize !== null && area.maxSize === area.size ? true : false);
                });
            }
        }
        ///////////////////////////////////////////
        // PIXEL MODE
        else if (this.unit === 'pixel') {
            this.displayedAreas.forEach(area => {
                // Area with wildcard size
                if (area.size === null) {
                    if (this.displayedAreas.length === 1) {
                        area.component.setStyleFlex(1, 1, `100%`, false, false);
                    }
                    else {
                        area.component.setStyleFlex(1, 1, `auto`, false, false);
                    }
                }
                // Area with pixel size
                else {
                    // Only one area > flex-basis 100%
                    if (this.displayedAreas.length === 1) {
                        area.component.setStyleFlex(0, 0, `100%`, false, false);
                    }
                    // Multiple areas > use each pixel basis
                    else {
                        area.component.setStyleFlex(0, 0, `${area.size}px`, area.minSize !== null && area.minSize === area.size ? true : false, area.maxSize !== null && area.maxSize === area.size ? true : false);
                    }
                }
            });
        }
    }
    clickGutter(event, gutterNum) {
        const tempPoint = getPointFromEvent(event);
        // Be sure mouseup/touchend happened at same point as mousedown/touchstart to trigger click/dblclick
        if (this.startPoint && this.startPoint.x === tempPoint.x && this.startPoint.y === tempPoint.y) {
            // If timeout in progress and new click > clearTimeout & dblClickEvent
            if (this._clickTimeout !== null) {
                window.clearTimeout(this._clickTimeout);
                this._clickTimeout = null;
                this.notify('dblclick', gutterNum);
                this.stopDragging();
            }
            // Else start timeout to call clickEvent at end
            else {
                this._clickTimeout = window.setTimeout(() => {
                    this._clickTimeout = null;
                    this.notify('click', gutterNum);
                    this.stopDragging();
                }, this.gutterDblClickDuration);
            }
        }
    }
    startDragging(event, gutterOrder, gutterNum) {
        event.preventDefault();
        event.stopPropagation();
        this.startPoint = getPointFromEvent(event);
        if (this.startPoint === null || this.disabled === true) {
            return;
        }
        this.snapshot = {
            gutterNum,
            lastSteppedOffset: 0,
            allAreasSizePixel: getElementPixelSize(this.elRef, this.direction) - this.getNbGutters() * this.gutterSize,
            allInvolvedAreasSizePercent: 100,
            areasBeforeGutter: [],
            areasAfterGutter: [],
        };
        this.displayedAreas.forEach(area => {
            const areaSnapshot = {
                area,
                sizePixelAtStart: getElementPixelSize(area.component.elRef, this.direction),
                sizePercentAtStart: (this.unit === 'percent' ? area.size : -1), // If pixel mode, anyway, will not be used.
            };
            if (area.order < gutterOrder) {
                if (this.restrictMove === true) {
                    this.snapshot.areasBeforeGutter = [areaSnapshot];
                }
                else {
                    this.snapshot.areasBeforeGutter.unshift(areaSnapshot);
                }
            }
            else if (area.order > gutterOrder) {
                if (this.restrictMove === true) {
                    if (this.snapshot.areasAfterGutter.length === 0) {
                        this.snapshot.areasAfterGutter = [areaSnapshot];
                    }
                }
                else {
                    this.snapshot.areasAfterGutter.push(areaSnapshot);
                }
            }
        });
        this.snapshot.allInvolvedAreasSizePercent = [
            ...this.snapshot.areasBeforeGutter,
            ...this.snapshot.areasAfterGutter,
        ].reduce((t, a) => t + a.sizePercentAtStart, 0);
        if (this.snapshot.areasBeforeGutter.length === 0 ||
            this.snapshot.areasAfterGutter.length === 0) {
            return;
        }
        this.dragListeners.push(this.renderer.listen('document', 'mouseup', this.stopDragging.bind(this)));
        this.dragListeners.push(this.renderer.listen('document', 'touchend', this.stopDragging.bind(this)));
        this.dragListeners.push(this.renderer.listen('document', 'touchcancel', this.stopDragging.bind(this)));
        this.ngZone.runOutsideAngular(() => {
            this.dragListeners.push(this.renderer.listen('document', 'mousemove', this.dragEvent.bind(this)));
            this.dragListeners.push(this.renderer.listen('document', 'touchmove', this.dragEvent.bind(this)));
        });
        this.displayedAreas.forEach(area => area.component.lockEvents());
        this.isDragging = true;
        this.renderer.addClass(this.elRef.nativeElement, 'mtx-dragging');
        this.renderer.addClass(this.gutterEls.toArray()[this.snapshot.gutterNum - 1].nativeElement, 'mtx-dragged');
        this.notify('start', this.snapshot.gutterNum);
    }
    dragEvent(event) {
        event.preventDefault();
        event.stopPropagation();
        if (this._clickTimeout !== null) {
            window.clearTimeout(this._clickTimeout);
            this._clickTimeout = null;
        }
        if (this.isDragging === false) {
            return;
        }
        this.endPoint = getPointFromEvent(event);
        if (this.endPoint === null) {
            return;
        }
        // Calculate steppedOffset
        let offset = this.direction === 'horizontal'
            ? this.startPoint.x - this.endPoint.x
            : this.startPoint.y - this.endPoint.y;
        if (this.dir === 'rtl') {
            offset = -offset;
        }
        const steppedOffset = Math.round(offset / this.gutterStep) * this.gutterStep;
        if (steppedOffset === this.snapshot.lastSteppedOffset) {
            return;
        }
        this.snapshot.lastSteppedOffset = steppedOffset;
        // Need to know if each gutter side areas could reacts to steppedOffset
        let areasBefore = getGutterSideAbsorptionCapacity(this.unit, this.snapshot.areasBeforeGutter, -steppedOffset, this.snapshot.allAreasSizePixel);
        let areasAfter = getGutterSideAbsorptionCapacity(this.unit, this.snapshot.areasAfterGutter, steppedOffset, this.snapshot.allAreasSizePixel);
        // Each gutter side areas can't absorb all offset
        if (areasBefore.remain !== 0 && areasAfter.remain !== 0) {
            if (Math.abs(areasBefore.remain) === Math.abs(areasAfter.remain)) {
                /** */
            }
            else if (Math.abs(areasBefore.remain) > Math.abs(areasAfter.remain)) {
                areasAfter = getGutterSideAbsorptionCapacity(this.unit, this.snapshot.areasAfterGutter, steppedOffset + areasBefore.remain, this.snapshot.allAreasSizePixel);
            }
            else {
                areasBefore = getGutterSideAbsorptionCapacity(this.unit, this.snapshot.areasBeforeGutter, -(steppedOffset - areasAfter.remain), this.snapshot.allAreasSizePixel);
            }
        }
        // Areas before gutter can't absorbs all offset > need to recalculate sizes for areas after gutter.
        else if (areasBefore.remain !== 0) {
            areasAfter = getGutterSideAbsorptionCapacity(this.unit, this.snapshot.areasAfterGutter, steppedOffset + areasBefore.remain, this.snapshot.allAreasSizePixel);
        }
        // Areas after gutter can't absorbs all offset > need to recalculate sizes for areas before gutter.
        else if (areasAfter.remain !== 0) {
            areasBefore = getGutterSideAbsorptionCapacity(this.unit, this.snapshot.areasBeforeGutter, -(steppedOffset - areasAfter.remain), this.snapshot.allAreasSizePixel);
        }
        if (this.unit === 'percent') {
            // Hack because of browser messing up with sizes using calc(X% - Ypx) -> el.getBoundingClientRect()
            // If not there, playing with gutters makes total going down to 99.99875% then 99.99286%, 99.98986%,..
            const all = [...areasBefore.list, ...areasAfter.list];
            const areaToReset = all.find(a => a.percentAfterAbsorption !== 0 &&
                a.percentAfterAbsorption !== a.areaSnapshot.area.minSize &&
                a.percentAfterAbsorption !== a.areaSnapshot.area.maxSize);
            if (areaToReset) {
                areaToReset.percentAfterAbsorption =
                    this.snapshot.allInvolvedAreasSizePercent -
                        all
                            .filter(a => a !== areaToReset)
                            .reduce((total, a) => total + a.percentAfterAbsorption, 0);
            }
        }
        // Now we know areas could absorb steppedOffset, time to really update sizes
        areasBefore.list.forEach(item => updateAreaSize(this.unit, item));
        areasAfter.list.forEach(item => updateAreaSize(this.unit, item));
        this.refreshStyleSizes();
        this.notify('progress', this.snapshot.gutterNum);
    }
    stopDragging(event) {
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }
        if (this.isDragging === false) {
            return;
        }
        this.displayedAreas.forEach(area => area.component.unlockEvents());
        while (this.dragListeners.length > 0) {
            const fct = this.dragListeners.pop();
            if (fct) {
                fct();
            }
        }
        // Warning: Have to be before "notify('end')"
        // because "notify('end')"" can be linked to "[size]='x'" > "build()" > "stopDragging()"
        this.isDragging = false;
        // If moved from starting point, notify end
        if (this.endPoint &&
            (this.startPoint.x !== this.endPoint.x ||
                this.startPoint.y !== this.endPoint.y)) {
            this.notify('end', this.snapshot.gutterNum);
        }
        this.renderer.removeClass(this.elRef.nativeElement, 'mtx-dragging');
        this.renderer.removeClass(this.gutterEls.toArray()[this.snapshot.gutterNum - 1].nativeElement, 'mtx-dragged');
        this.snapshot = null;
        // Needed to let (click)="clickGutter(...)" event run and verify if mouse moved or not
        this.ngZone.runOutsideAngular(() => {
            setTimeout(() => {
                this.startPoint = null;
                this.endPoint = null;
            });
        });
    }
    notify(type, gutterNum) {
        const sizes = this.getVisibleAreaSizes();
        if (type === 'start') {
            this.dragStart.emit({ gutterNum, sizes });
        }
        else if (type === 'end') {
            this.dragEnd.emit({ gutterNum, sizes });
        }
        else if (type === 'click') {
            this.gutterClick.emit({ gutterNum, sizes });
        }
        else if (type === 'dblclick') {
            this.gutterDblClick.emit({ gutterNum, sizes });
        }
        else if (type === 'transitionEnd') {
            if (this.transitionEndSubscriber) {
                this.ngZone.run(() => this.transitionEndSubscriber.next(sizes));
            }
        }
        else if (type === 'progress') {
            // Stay outside zone to allow users do what they want about change detection mechanism.
            this.dragProgressSubject.next({ gutterNum, sizes });
        }
    }
    ngOnDestroy() {
        this.stopDragging();
    }
}
/** @nocollapse */ MtxSplit.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MtxSplit, deps: [{ token: i0.NgZone }, { token: i0.ElementRef }, { token: i0.ChangeDetectorRef }, { token: i0.Renderer2 }], target: i0.ɵɵFactoryTarget.Component });
/** @nocollapse */ MtxSplit.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.1", type: MtxSplit, selector: "mtx-split", inputs: { color: "color", direction: "direction", unit: "unit", gutterSize: "gutterSize", gutterStep: "gutterStep", restrictMove: "restrictMove", useTransition: "useTransition", disabled: "disabled", dir: "dir", gutterDblClickDuration: "gutterDblClickDuration" }, outputs: { dragStart: "dragStart", dragEnd: "dragEnd", gutterClick: "gutterClick", gutterDblClick: "gutterDblClick", transitionEnd: "transitionEnd" }, host: { classAttribute: "mtx-split" }, viewQueries: [{ propertyName: "gutterEls", predicate: ["gutterEls"], descendants: true }], exportAs: ["mtxSplit"], usesInheritance: true, ngImport: i0, template: "<ng-content></ng-content>\r\n<ng-template ngFor [ngForOf]=\"displayedAreas\" let-index=\"index\" let-last=\"last\">\r\n  <div #gutterEls class=\"mtx-split-gutter\" [ngClass]=\"['mat-' + color]\"\r\n       *ngIf=\"last === false\"\r\n       [style.flex-basis.px]=\"gutterSize\"\r\n       [style.order]=\"index * 2 + 1\"\r\n       (mousedown)=\"startDragging($event, index * 2 + 1, index + 1)\"\r\n       (touchstart)=\"startDragging($event, index * 2 + 1, index + 1)\"\r\n       (mouseup)=\"clickGutter($event, index + 1)\"\r\n       (touchend)=\"clickGutter($event, index + 1)\">\r\n    <div class=\"mtx-split-gutter-handle\"></div>\r\n  </div>\r\n</ng-template>\r\n", styles: [".mtx-split{display:flex;flex-wrap:nowrap;justify-content:flex-start;align-items:stretch;overflow:hidden;width:100%;height:100%}.mtx-split>.mtx-split-gutter{position:relative;display:flex;flex-grow:0;flex-shrink:0;align-items:center;justify-content:center}.mtx-split>.mtx-split-gutter>.mtx-split-gutter-handle{position:absolute;opacity:0}.mtx-split>.mtx-split-pane{flex-grow:0;flex-shrink:0;overflow-x:hidden;overflow-y:auto}.mtx-split>.mtx-split-pane.mtx-split-pane-hidden{flex:0 1 0!important;overflow-x:hidden;overflow-y:hidden}.mtx-split.mtx-split-horizontal{flex-direction:row}.mtx-split.mtx-split-horizontal>.mtx-split-gutter{flex-direction:row;height:100%;cursor:col-resize}.mtx-split.mtx-split-horizontal>.mtx-split-gutter>.mtx-split-gutter-handle{width:8px;height:100%;left:-2px;right:2px}.mtx-split.mtx-split-horizontal>.mtx-split-pane{height:100%}.mtx-split.mtx-split-vertical{flex-direction:column}.mtx-split.mtx-split-vertical>.mtx-split-gutter{flex-direction:column;width:100%;cursor:row-resize}.mtx-split.mtx-split-vertical>.mtx-split-gutter>.mtx-split-gutter-handle{width:100%;height:8px;top:-2px;bottom:2px}.mtx-split.mtx-split-vertical>.mtx-split-pane{width:100%}.mtx-split.mtx-split-vertical>.mtx-split-pane.mtx-split-pane-hidden{max-width:0}.mtx-split.mtx-split-disabled>.mtx-split-gutter{cursor:default}.mtx-split.mtx-split-disabled>.mtx-split-gutter .mtx-split-gutter-handle{background-image:none}.mtx-split.mtx-split-transition.mtx-split-init:not(.mtx-dragging)>.mtx-split-gutter,.mtx-split.mtx-split-transition.mtx-split-init:not(.mtx-dragging)>.mtx-split-pane{transition:flex-basis .3s}\n"], dependencies: [{ kind: "directive", type: i1.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i1.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MtxSplit, decorators: [{
            type: Component,
            args: [{ selector: 'mtx-split', exportAs: 'mtxSplit', host: {
                        class: 'mtx-split',
                    }, encapsulation: ViewEncapsulation.None, changeDetection: ChangeDetectionStrategy.OnPush, inputs: ['color'], template: "<ng-content></ng-content>\r\n<ng-template ngFor [ngForOf]=\"displayedAreas\" let-index=\"index\" let-last=\"last\">\r\n  <div #gutterEls class=\"mtx-split-gutter\" [ngClass]=\"['mat-' + color]\"\r\n       *ngIf=\"last === false\"\r\n       [style.flex-basis.px]=\"gutterSize\"\r\n       [style.order]=\"index * 2 + 1\"\r\n       (mousedown)=\"startDragging($event, index * 2 + 1, index + 1)\"\r\n       (touchstart)=\"startDragging($event, index * 2 + 1, index + 1)\"\r\n       (mouseup)=\"clickGutter($event, index + 1)\"\r\n       (touchend)=\"clickGutter($event, index + 1)\">\r\n    <div class=\"mtx-split-gutter-handle\"></div>\r\n  </div>\r\n</ng-template>\r\n", styles: [".mtx-split{display:flex;flex-wrap:nowrap;justify-content:flex-start;align-items:stretch;overflow:hidden;width:100%;height:100%}.mtx-split>.mtx-split-gutter{position:relative;display:flex;flex-grow:0;flex-shrink:0;align-items:center;justify-content:center}.mtx-split>.mtx-split-gutter>.mtx-split-gutter-handle{position:absolute;opacity:0}.mtx-split>.mtx-split-pane{flex-grow:0;flex-shrink:0;overflow-x:hidden;overflow-y:auto}.mtx-split>.mtx-split-pane.mtx-split-pane-hidden{flex:0 1 0!important;overflow-x:hidden;overflow-y:hidden}.mtx-split.mtx-split-horizontal{flex-direction:row}.mtx-split.mtx-split-horizontal>.mtx-split-gutter{flex-direction:row;height:100%;cursor:col-resize}.mtx-split.mtx-split-horizontal>.mtx-split-gutter>.mtx-split-gutter-handle{width:8px;height:100%;left:-2px;right:2px}.mtx-split.mtx-split-horizontal>.mtx-split-pane{height:100%}.mtx-split.mtx-split-vertical{flex-direction:column}.mtx-split.mtx-split-vertical>.mtx-split-gutter{flex-direction:column;width:100%;cursor:row-resize}.mtx-split.mtx-split-vertical>.mtx-split-gutter>.mtx-split-gutter-handle{width:100%;height:8px;top:-2px;bottom:2px}.mtx-split.mtx-split-vertical>.mtx-split-pane{width:100%}.mtx-split.mtx-split-vertical>.mtx-split-pane.mtx-split-pane-hidden{max-width:0}.mtx-split.mtx-split-disabled>.mtx-split-gutter{cursor:default}.mtx-split.mtx-split-disabled>.mtx-split-gutter .mtx-split-gutter-handle{background-image:none}.mtx-split.mtx-split-transition.mtx-split-init:not(.mtx-dragging)>.mtx-split-gutter,.mtx-split.mtx-split-transition.mtx-split-init:not(.mtx-dragging)>.mtx-split-pane{transition:flex-basis .3s}\n"] }]
        }], ctorParameters: function () { return [{ type: i0.NgZone }, { type: i0.ElementRef }, { type: i0.ChangeDetectorRef }, { type: i0.Renderer2 }]; }, propDecorators: { direction: [{
                type: Input
            }], unit: [{
                type: Input
            }], gutterSize: [{
                type: Input
            }], gutterStep: [{
                type: Input
            }], restrictMove: [{
                type: Input
            }], useTransition: [{
                type: Input
            }], disabled: [{
                type: Input
            }], dir: [{
                type: Input
            }], gutterDblClickDuration: [{
                type: Input
            }], dragStart: [{
                type: Output
            }], dragEnd: [{
                type: Output
            }], gutterClick: [{
                type: Output
            }], gutterDblClick: [{
                type: Output
            }], transitionEnd: [{
                type: Output
            }], gutterEls: [{
                type: ViewChildren,
                args: ['gutterEls']
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3BsaXQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wcm9qZWN0cy9leHRlbnNpb25zL3NwbGl0L3NwbGl0LnRzIiwiLi4vLi4vLi4vLi4vcHJvamVjdHMvZXh0ZW5zaW9ucy9zcGxpdC9zcGxpdC5odG1sIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFDTCxTQUFTLEVBQ1QsS0FBSyxFQUNMLE1BQU0sRUFDTix1QkFBdUIsRUFPdkIsWUFBWSxFQUVaLFlBQVksRUFDWixpQkFBaUIsR0FDbEIsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFZLFVBQVUsRUFBRSxNQUFNLHdCQUF3QixDQUFDO0FBQzlELE9BQU8sRUFBRSxVQUFVLEVBQWMsT0FBTyxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQ3ZELE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQVc5QyxPQUFPLEVBQ0wsc0JBQXNCLEVBQ3RCLGVBQWUsRUFDZixnQkFBZ0IsRUFDaEIsY0FBYyxFQUNkLGNBQWMsRUFDZCxpQkFBaUIsRUFDakIsbUJBQW1CLEVBQ25CLCtCQUErQixFQUMvQixjQUFjLEdBQ2YsTUFBTSxTQUFTLENBQUM7OztBQUVqQixvREFBb0Q7QUFDcEQsb0JBQW9CO0FBQ3BCLE1BQU0sYUFBYSxHQUFHLFVBQVUsQ0FDOUI7SUFDRSxZQUFtQixXQUF1QjtRQUF2QixnQkFBVyxHQUFYLFdBQVcsQ0FBWTtJQUFHLENBQUM7Q0FDL0MsQ0FDRixDQUFDO0FBRUY7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0E0Qkc7QUFjSCxNQUFNLE9BQU8sUUFBUyxTQUFRLGFBQWE7SUFHekMsSUFBYSxTQUFTLENBQUMsQ0FBNEI7UUFDakQsSUFBSSxDQUFDLFVBQVUsR0FBRyxDQUFDLEtBQUssVUFBVSxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQztRQUUvRCxJQUFJLENBQUMsUUFBUSxDQUFDLFFB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QTsyRkQ4RWEsUUFBUTtrQkFacEIsU0FBUzsrQkFDRSxXQUFXLFlBQ1gsVUFBVSxRQUNkO3dCQUNKLEtBQUssRUFBRSxXQUFXO3FCQUNuQixpQkFDYyxpQkFBaUIsQ0FBQyxJQUFJLG1CQUNwQix1QkFBdUIsQ0FBQyxNQUFNLFVBR3ZDLENBQUMsT0FBTyxDQUFDOzhLQUtKLFNBQVM7c0JBQXJCLEtBQUs7Z0JBb0JPLElBQUk7c0JBQWhCLEtBQUs7Z0JBb0JPLFVBQVU7c0JBQXRCLEtBQUs7Z0JBY08sVUFBVTtzQkFBdEIsS0FBSztnQkFZTyxZQUFZO3NCQUF4QixLQUFLO2dCQVlPLGFBQWE7c0JBQXpCLEtBQUs7Z0JBa0JPLFFBQVE7c0JBQXBCLEtBQUs7Z0JBa0JPLEdBQUc7c0JBQWYsS0FBSztnQkFjTyxzQkFBc0I7c0JBQWxDLEtBQUs7Z0JBVUksU0FBUztzQkFBbEIsTUFBTTtnQkFDRyxPQUFPO3NCQUFoQixNQUFNO2dCQUNHLFdBQVc7c0JBQXBCLE1BQU07Z0JBQ0csY0FBYztzQkFBdkIsTUFBTTtnQkFHTyxhQUFhO3NCQUExQixNQUFNO2dCQW9CNEIsU0FBUztzQkFBM0MsWUFBWTt1QkFBQyxXQUFXIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgQ29tcG9uZW50LFxuICBJbnB1dCxcbiAgT3V0cHV0LFxuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gIFJlbmRlcmVyMixcbiAgQWZ0ZXJWaWV3SW5pdCxcbiAgT25EZXN0cm95LFxuICBFbGVtZW50UmVmLFxuICBOZ1pvbmUsXG4gIFZpZXdDaGlsZHJlbixcbiAgUXVlcnlMaXN0LFxuICBFdmVudEVtaXR0ZXIsXG4gIFZpZXdFbmNhcHN1bGF0aW9uLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IENhbkNvbG9yLCBtaXhpbkNvbG9yIH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvY29yZSc7XG5pbXBvcnQgeyBPYnNlcnZhYmxlLCBTdWJzY3JpYmVyLCBTdWJqZWN0IH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBkZWJvdW5jZVRpbWUgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbmltcG9ydCB7XG4gIE10eFNwbGl0QXJlYSxcbiAgTXR4U3BsaXRQb2ludCxcbiAgTXR4U3BsaXRTbmFwc2hvdCxcbiAgTXR4U3BsaXRBcmVhU25hcHNob3QsXG4gIE10eFNwbGl0T3V0cHV0RGF0YSxcbiAgTXR4U3BsaXRPdXRwdXRBcmVhU2l6ZXMsXG59IGZyb20gJy4vaW50ZXJmYWNlcyc7XG5pbXBvcnQgeyBNdHhTcGxpdFBhbmUgfSBmcm9tICcuL3NwbGl0LXBhbmUnO1xuaW1wb3J0IHtcbiAgZ2V0SW5wdXRQb3NpdGl2ZU51bWJlcixcbiAgZ2V0SW5wdXRCb29sZWFuLFxuICBpc1VzZXJTaXplc1ZhbGlkLFxuICBnZXRBcmVhTWluU2l6ZSxcbiAgZ2V0QXJlYU1heFNpemUsXG4gIGdldFBvaW50RnJvbUV2ZW50LFxuICBnZXRFbGVtZW50UGl4ZWxTaXplLFxuICBnZXRHdXR0ZXJTaWRlQWJzb3JwdGlvbkNhcGFjaXR5LFxuICB1cGRhdGVBcmVhU2l6ZSxcbn0gZnJvbSAnLi91dGlscyc7XG5cbi8vIEJvaWxlcnBsYXRlIGZvciBhcHBseWluZyBtaXhpbnMgdG8gX010eFNwbGl0QmFzZS5cbi8qKiBAZG9jcy1wcml2YXRlICovXG5jb25zdCBfTXR4U3BsaXRCYXNlID0gbWl4aW5Db2xvcihcbiAgY2xhc3Mge1xuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBfZWxlbWVudFJlZjogRWxlbWVudFJlZikge31cbiAgfVxuKTtcblxuLyoqXG4gKiBtdHgtc3BsaXRcbiAqXG4gKlxuICogIFBFUkNFTlQgTU9ERSAoW3VuaXRdPVwiJ3BlcmNlbnQnXCIpXG4gKiAgX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX1xuICogfCAgICAgICBBICAgICAgIFtnMV0gICAgICAgQiAgICAgICBbZzJdICAgICAgIEMgICAgICAgW2czXSAgICAgICBEICAgICAgIFtnNF0gICAgICAgRSAgICAgICB8XG4gKiB8LS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLXxcbiAqIHwgICAgICAgMjAgICAgICAgICAgICAgICAgIDMwICAgICAgICAgICAgICAgICAyMCAgICAgICAgICAgICAgICAgMTUgICAgICAgICAgICAgICAgIDE1ICAgICAgfCA8LS0gW3NpemVdPVwieFwiXG4gKiB8ICAgICAgICAgICAgICAgMTBweCAgICAgICAgICAgICAgIDEwcHggICAgICAgICAgICAgICAxMHB4ICAgICAgICAgICAgICAgMTBweCAgICAgICAgICAgICAgIHwgPC0tIFtndXR0ZXJTaXplXT1cIjEwXCJcbiAqIHxjYWxjKDIwJSAtIDhweCkgICAgY2FsYygzMCUgLSAxMnB4KSAgIGNhbGMoMjAlIC0gOHB4KSAgICBjYWxjKDE1JSAtIDZweCkgICAgY2FsYygxNSUgLSA2cHgpfCA8LS0gQ1NTIGZsZXgtYmFzaXMgcHJvcGVydHkgKHdpdGggZmxleC1ncm93JnNocmluayBhdCAwKVxuICogfCAgICAgMTUycHggICAgICAgICAgICAgIDIyOHB4ICAgICAgICAgICAgICAxNTJweCAgICAgICAgICAgICAgMTE0cHggICAgICAgICAgICAgIDExNHB4ICAgICB8IDwtLSBlbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS53aWR0aFxuICogfF9fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX198XG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDgwMHB4ICAgICAgICAgPC0tIGVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLndpZHRoXG4gKiAgZmxleC1iYXNpcyA9IGNhbGMoIHsgYXJlYS5zaXplIH0lIC0geyBhcmVhLnNpemUvMTAwICogbmJHdXR0ZXIqZ3V0dGVyU2l6ZSB9cHggKTtcbiAqXG4gKlxuICogIFBJWEVMIE1PREUgKFt1bml0XT1cIidwaXhlbCdcIilcbiAqICBfX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fXG4gKiB8ICAgICAgIEEgICAgICAgW2cxXSAgICAgICBCICAgICAgIFtnMl0gICAgICAgQyAgICAgICBbZzNdICAgICAgIEQgICAgICAgW2c0XSAgICAgICBFICAgICAgIHxcbiAqIHwtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tfFxuICogfCAgICAgIDEwMCAgICAgICAgICAgICAgICAyNTAgICAgICAgICAgICAgICAgICogICAgICAgICAgICAgICAgIDE1MCAgICAgICAgICAgICAgICAxMDAgICAgICB8IDwtLSBbc2l6ZV09XCJ5XCJcbiAqIHwgICAgICAgICAgICAgICAxMHB4ICAgICAgICAgICAgICAgMTBweCAgICAgICAgICAgICAgIDEwcHggICAgICAgICAgICAgICAxMHB4ICAgICAgICAgICAgICAgfCA8LS0gW2d1dHRlclNpemVdPVwiMTBcIlxuICogfCAgIDAgMCAxMDBweCAgICAgICAgICAwIDAgMjUwcHggICAgICAgICAgIDEgMSBhdXRvICAgICAgICAgIDAgMCAxNTBweCAgICAgICAgICAwIDAgMTAwcHggICB8IDwtLSBDU1MgZmxleCBwcm9wZXJ0eSAoZmxleC1ncm93L2ZsZXgtc2hyaW5rL2ZsZXgtYmFzaXMpXG4gKiB8ICAgICAxMDBweCAgICAgICAgICAgICAgMjUwcHggICAgICAgICAgICAgIDIwMHB4ICAgICAgICAgICAgICAxNTBweCAgICAgICAgICAgICAgMTAwcHggICAgIHwgPC0tIGVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLndpZHRoXG4gKiB8X19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX3xcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgODAwcHggICAgICAgICA8LS0gZWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkud2lkdGhcbiAqXG4gKi9cblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbXR4LXNwbGl0JyxcbiAgZXhwb3J0QXM6ICdtdHhTcGxpdCcsXG4gIGhvc3Q6IHtcbiAgICBjbGFzczogJ210eC1zcGxpdCcsXG4gIH0sXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICBzdHlsZVVybHM6IFtgLi9zcGxpdC5zY3NzYF0sXG4gIHRlbXBsYXRlVXJsOiAnLi9zcGxpdC5odG1sJyxcbiAgaW5wdXRzOiBbJ2NvbG9yJ10sXG59KVxuZXhwb3J0IGNsYXNzIE10eFNwbGl0IGV4dGVuZHMgX010eFNwbGl0QmFzZSBpbXBsZW1lbnRzIEFmdGVyVmlld0luaXQsIE9uRGVzdHJveSwgQ2FuQ29sb3Ige1xuICBwcml2YXRlIF9kaXJlY3Rpb246ICdob3Jpem9udGFsJyB8ICd2ZXJ0aWNhbCcgPSAnaG9yaXpvbnRhbCc7XG5cbiAgQElucHV0KCkgc2V0IGRpcmVjdGlvbih2OiAnaG9yaXpvbnRhbCcgfCAndmVydGljYWwnKSB7XG4gICAgdGhpcy5fZGlyZWN0aW9uID0gdiA9PT0gJ3ZlcnRpY2FsJyA/ICd2ZXJ0aWNhbCcgOiAnaG9yaXpvbnRhbCc7XG5cbiAgICB0aGlzLnJlbmRlcmVyLmFkZENsYXNzKHRoaXMuZWxSZWYubmF0aXZlRWxlbWVudCwgYG10eC1zcGxpdC0ke3RoaXMuX2RpcmVjdGlvbn1gKTtcbiAgICB0aGlzLnJlbmRlcmVyLnJlbW92ZUNsYXNzKFxuICAgICAgdGhpcy5lbFJlZi5uYXRpdmVFbGVtZW50LFxuICAgICAgYG10eC1zcGxpdC0ke3RoaXMuX2RpcmVjdGlvbiA9PT0gJ3ZlcnRpY2FsJyA/ICdob3Jpem9udGFsJyA6ICd2ZXJ0aWNhbCd9YFxuICAgICk7XG5cbiAgICB0aGlzLmJ1aWxkKGZhbHNlLCBmYWxzZSk7XG4gIH1cblxuICBnZXQgZGlyZWN0aW9uKCk6ICdob3Jpem9udGFsJyB8ICd2ZXJ0aWNhbCcge1xuICAgIHJldHVybiB0aGlzLl9kaXJlY3Rpb247XG4gIH1cblxuICAvLy8vXG5cbiAgcHJpdmF0ZSBfdW5pdDogJ3BlcmNlbnQnIHwgJ3BpeGVsJyA9ICdwZXJjZW50JztcblxuICBASW5wdXQoKSBzZXQgdW5pdCh2OiAncGVyY2VudCcgfCAncGl4ZWwnKSB7XG4gICAgdGhpcy5fdW5pdCA9IHYgPT09ICdwaXhlbCcgPyAncGl4ZWwnIDogJ3BlcmNlbnQnO1xuXG4gICAgdGhpcy5yZW5kZXJlci5hZGRDbGFzcyh0aGlzLmVsUmVmLm5hdGl2ZUVsZW1lbnQsIGBtdHgtc3BsaXQtJHt0aGlzLl91bml0fWApO1xuICAgIHRoaXMucmVuZGVyZXIucmVtb3ZlQ2xhc3MoXG4gICAgICB0aGlzLmVsUmVmLm5hdGl2ZUVsZW1lbnQsXG4gICAgICBgbXR4LXNwbGl0LSR7dGhpcy5fdW5pdCA9PT0gJ3BpeGVsJyA/ICdwZXJjZW50JyA6ICdwaXhlbCd9YFxuICAgICk7XG5cbiAgICB0aGlzLmJ1aWxkKGZhbHNlLCB0cnVlKTtcbiAgfVxuXG4gIGdldCB1bml0KCk6ICdwZXJjZW50JyB8ICdwaXhlbCcge1xuICAgIHJldHVybiB0aGlzLl91bml0O1xuICB9XG5cbiAgLy8vL1xuXG4gIHByaXZhdGUgX2d1dHRlclNpemUgPSA0O1xuXG4gIEBJbnB1dCgpIHNldCBndXR0ZXJTaXplKHY6IG51bWJlcikge1xuICAgIHRoaXMuX2d1dHRlclNpemUgPSBnZXRJbnB1dFBvc2l0aXZlTnVtYmVyKHYsIDExKTtcblxuICAgIHRoaXMuYnVpbGQoZmFsc2UsIGZhbHNlKTtcbiAgfVxuXG4gIGdldCBndXR0ZXJTaXplKCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMuX2d1dHRlclNpemU7XG4gIH1cblxuICAvLy8vXG5cbiAgcHJpdmF0ZSBfZ3V0dGVyU3RlcCA9IDE7XG5cbiAgQElucHV0KCkgc2V0IGd1dHRlclN0ZXAodjogbnVtYmVyKSB7XG4gICAgdGhpcy5fZ3V0dGVyU3RlcCA9IGdldElucHV0UG9zaXRpdmVOdW1iZXIodiwgMSk7XG4gIH1cblxuICBnZXQgZ3V0dGVyU3RlcCgpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLl9ndXR0ZXJTdGVwO1xuICB9XG5cbiAgLy8vL1xuXG4gIHByaXZhdGUgX3Jlc3RyaWN0TW92ZSA9IGZhbHNlO1xuXG4gIEBJbnB1dCgpIHNldCByZXN0cmljdE1vdmUodjogYm9vbGVhbikge1xuICAgIHRoaXMuX3Jlc3RyaWN0TW92ZSA9IGdldElucHV0Qm9vbGVhbih2KTtcbiAgfVxuXG4gIGdldCByZXN0cmljdE1vdmUoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX3Jlc3RyaWN0TW92ZTtcbiAgfVxuXG4gIC8vLy9cblxuICBwcml2YXRlIF91c2VUcmFuc2l0aW9uID0gZmFsc2U7XG5cbiAgQElucHV0KCkgc2V0IHVzZVRyYW5zaXRpb24odjogYm9vbGVhbikge1xuICAgIHRoaXMuX3VzZVRyYW5zaXRpb24gPSBnZXRJbnB1dEJvb2xlYW4odik7XG5cbiAgICBpZiAodGhpcy5fdXNlVHJhbnNpdGlvbikge1xuICAgICAgdGhpcy5yZW5kZXJlci5hZGRDbGFzcyh0aGlzLmVsUmVmLm5hdGl2ZUVsZW1lbnQsICdtdHgtc3BsaXQtdHJhbnNpdGlvbicpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnJlbmRlcmVyLnJlbW92ZUNsYXNzKHRoaXMuZWxSZWYubmF0aXZlRWxlbWVudCwgJ210eC1zcGxpdC10cmFuc2l0aW9uJyk7XG4gICAgfVxuICB9XG5cbiAgZ2V0IHVzZVRyYW5zaXRpb24oKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX3VzZVRyYW5zaXRpb247XG4gIH1cblxuICAvLy8vXG5cbiAgcHJpdmF0ZSBfZGlzYWJsZWQgPSBmYWxzZTtcblxuICBASW5wdXQoKSBzZXQgZGlzYWJsZWQodjogYm9vbGVhbikge1xuICAgIHRoaXMuX2Rpc2FibGVkID0gZ2V0SW5wdXRCb29sZWFuKHYpO1xuXG4gICAgaWYgKHRoaXMuX2Rpc2FibGVkKSB7XG4gICAgICB0aGlzLnJlbmRlcmVyLmFkZENsYXNzKHRoaXMuZWxSZWYubmF0aXZlRWxlbWVudCwgJ210eC1zcGxpdC1kaXNhYmxlZCcpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnJlbmRlcmVyLnJlbW92ZUNsYXNzKHRoaXMuZWxSZWYubmF0aXZlRWxlbWVudCwgJ210eC1zcGxpdC1kaXNhYmxlZCcpO1xuICAgIH1cbiAgfVxuXG4gIGdldCBkaXNhYmxlZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fZGlzYWJsZWQ7XG4gIH1cblxuICAvLy8vXG5cbiAgcHJpdmF0ZSBfZGlyOiAnbHRyJyB8ICdydGwnID0gJ2x0cic7XG5cbiAgQElucHV0KCkgc2V0IGRpcih2OiAnbHRyJyB8ICdydGwnKSB7XG4gICAgdGhpcy5fZGlyID0gdiA9PT0gJ3J0bCcgPyAncnRsJyA6ICdsdHInO1xuXG4gICAgdGhpcy5yZW5kZXJlci5zZXRBdHRyaWJ1dGUodGhpcy5lbFJlZi5uYXRpdmVFbGVtZW50LCAnZGlyJywgdGhpcy5fZGlyKTtcbiAgfVxuXG4gIGdldCBkaXIoKTogJ2x0cicgfCAncnRsJyB7XG4gICAgcmV0dXJuIHRoaXMuX2RpcjtcbiAgfVxuXG4gIC8vLy9cblxuICBwcml2YXRlIF9ndXR0ZXJEYmxDbGlja0R1cmF0aW9uID0gMDtcblxuICBASW5wdXQoKSBzZXQgZ3V0dGVyRGJsQ2xpY2tEdXJhdGlvbih2OiBudW1iZXIpIHtcbiAgICB0aGlzLl9ndXR0ZXJEYmxDbGlja0R1cmF0aW9uID0gZ2V0SW5wdXRQb3NpdGl2ZU51bWJlcih2LCAwKTtcbiAgfVxuXG4gIGdldCBndXR0ZXJEYmxDbGlja0R1cmF0aW9uKCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMuX2d1dHRlckRibENsaWNrRHVyYXRpb247XG4gIH1cblxuICAvLy8vXG5cbiAgQE91dHB1dCgpIGRyYWdTdGFydCA9IG5ldyBFdmVudEVtaXR0ZXI8TXR4U3BsaXRPdXRwdXREYXRhPihmYWxzZSk7XG4gIEBPdXRwdXQoKSBkcmFnRW5kID0gbmV3IEV2ZW50RW1pdHRlcjxNdHhTcGxpdE91dHB1dERhdGE+KGZhbHNlKTtcbiAgQE91dHB1dCgpIGd1dHRlckNsaWNrID0gbmV3IEV2ZW50RW1pdHRlcjxNdHhTcGxpdE91dHB1dERhdGE+KGZhbHNlKTtcbiAgQE91dHB1dCgpIGd1dHRlckRibENsaWNrID0gbmV3IEV2ZW50RW1pdHRlcjxNdHhTcGxpdE91dHB1dERhdGE+KGZhbHNlKTtcblxuICBwcml2YXRlIHRyYW5zaXRpb25FbmRTdWJzY3JpYmVyITogU3Vic2NyaWJlcjxNdHhTcGxpdE91dHB1dEFyZWFTaXplcz47XG4gIEBPdXRwdXQoKSBnZXQgdHJhbnNpdGlvbkVuZCgpOiBPYnNlcnZhYmxlPE10eFNwbGl0T3V0cHV0QXJlYVNpemVzPiB7XG4gICAgcmV0dXJuIG5ldyBPYnNlcnZhYmxlKHN1YnNjcmliZXIgPT4gKHRoaXMudHJhbnNpdGlvbkVuZFN1YnNjcmliZXIgPSBzdWJzY3JpYmVyKSkucGlwZShcbiAgICAgIGRlYm91bmNlVGltZTxhbnk+KDIwKVxuICAgICk7XG4gIH1cblxuICBwcml2YXRlIGRyYWdQcm9ncmVzc1N1YmplY3Q6IFN1YmplY3Q8TXR4U3BsaXRPdXRwdXREYXRhPiA9IG5ldyBTdWJqZWN0KCk7XG4gIGRyYWdQcm9ncmVzcyQ6IE9ic2VydmFibGU8TXR4U3BsaXRPdXRwdXREYXRhPiA9IHRoaXMuZHJhZ1Byb2dyZXNzU3ViamVjdC5hc09ic2VydmFibGUoKTtcblxuICAvLy8vXG5cbiAgcHJpdmF0ZSBpc0RyYWdnaW5nID0gZmFsc2U7XG4gIHByaXZhdGUgZHJhZ0xpc3RlbmVyczogQXJyYXk8KCkgPT4gdm9pZD4gPSBbXTtcbiAgcHJpdmF0ZSBzbmFwc2hvdDogTXR4U3BsaXRTbmFwc2hvdCB8IG51bGwgPSBudWxsO1xuICBwcml2YXRlIHN0YXJ0UG9pbnQ6IE10eFNwbGl0UG9pbnQgfCBudWxsID0gbnVsbDtcbiAgcHJpdmF0ZSBlbmRQb2ludDogTXR4U3BsaXRQb2ludCB8IG51bGwgPSBudWxsO1xuXG4gIHB1YmxpYyByZWFkb25seSBkaXNwbGF5ZWRBcmVhczogQXJyYXk8TXR4U3BsaXRBcmVhPiA9IFtdO1xuICBwcml2YXRlIHJlYWRvbmx5IGhpZGVkQXJlYXM6IEFycmF5PE10eFNwbGl0QXJlYT4gPSBbXTtcblxuICBAVmlld0NoaWxkcmVuKCdndXR0ZXJFbHMnKSBwcml2YXRlIGd1dHRlckVscyE6IFF1ZXJ5TGlzdDxFbGVtZW50UmVmPjtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIG5nWm9uZTogTmdab25lLFxuICAgIHByaXZhdGUgZWxSZWY6IEVsZW1lbnRSZWYsXG4gICAgcHJpdmF0ZSBjZFJlZjogQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gICAgcHJpdmF0ZSByZW5kZXJlcjogUmVuZGVyZXIyXG4gICkge1xuICAgIHN1cGVyKGVsUmVmKTtcbiAgICAvLyBUbyBmb3JjZSBhZGRpbmcgZGVmYXVsdCBjbGFzcywgY291bGQgYmUgb3ZlcnJpZGUgYnkgdXNlciBASW5wdXQoKSBvciBub3RcbiAgICB0aGlzLmRpcmVjdGlvbiA9IHRoaXMuX2RpcmVjdGlvbjtcbiAgfVxuXG4gIHB1YmxpYyBuZ0FmdGVyVmlld0luaXQoKSB7XG4gICAgdGhpcy5uZ1pvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xuICAgICAgLy8gVG8gYXZvaWQgdHJhbnNpdGlvbiBhdCBmaXJzdCByZW5kZXJpbmdcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4gdGhpcy5yZW5kZXJlci5hZGRDbGFzcyh0aGlzLmVsUmVmLm5hdGl2ZUVsZW1lbnQsICdtdHgtc3BsaXQtaW5pdCcpKTtcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgZ2V0TmJHdXR0ZXJzKCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMuZGlzcGxheWVkQXJlYXMubGVuZ3RoID09PSAwID8gMCA6IHRoaXMuZGlzcGxheWVkQXJlYXMubGVuZ3RoIC0gMTtcbiAgfVxuXG4gIHB1YmxpYyBhZGRBcmVhKGNvbXBvbmVudDogTXR4U3BsaXRQYW5lKTogdm9pZCB7XG4gICAgY29uc3QgbmV3QXJlYTogTXR4U3BsaXRBcmVhID0ge1xuICAgICAgY29tcG9uZW50LFxuICAgICAgb3JkZXI6IDAsXG4gICAgICBzaXplOiAwLFxuICAgICAgbWluU2l6ZTogbnVsbCxcbiAgICAgIG1heFNpemU6IG51bGwsXG4gICAgfTtcblxuICAgIGlmIChjb21wb25lbnQudmlzaWJsZSA9PT0gdHJ1ZSkge1xuICAgICAgdGhpcy5kaXNwbGF5ZWRBcmVhcy5wdXNoKG5ld0FyZWEpO1xuXG4gICAgICB0aGlzLmJ1aWxkKHRydWUsIHRydWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmhpZGVkQXJlYXMucHVzaChuZXdBcmVhKTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgcmVtb3ZlQXJlYShjb21wb25lbnQ6IE10eFNwbGl0UGFuZSk6IHZvaWQge1xuICAgIGlmICh0aGlzLmRpc3BsYXllZEFyZWFzLnNvbWUoYSA9PiBhLmNvbXBvbmVudCA9PT0gY29tcG9uZW50KSkge1xuICAgICAgY29uc3QgYXJlYSA9IHRoaXMuZGlzcGxheWVkQXJlYXMuZmluZChhID0+IGEuY29tcG9uZW50ID09PSBjb21wb25lbnQpIGFzIE10eFNwbGl0QXJlYTtcbiAgICAgIHRoaXMuZGlzcGxheWVkQXJlYXMuc3BsaWNlKHRoaXMuZGlzcGxheWVkQXJlYXMuaW5kZXhPZihhcmVhKSwgMSk7XG5cbiAgICAgIHRoaXMuYnVpbGQodHJ1ZSwgdHJ1ZSk7XG4gICAgfSBlbHNlIGlmICh0aGlzLmhpZGVkQXJlYXMuc29tZShhID0+IGEuY29tcG9uZW50ID09PSBjb21wb25lbnQpKSB7XG4gICAgICBjb25zdCBhcmVhID0gdGhpcy5oaWRlZEFyZWFzLmZpbmQoYSA9PiBhLmNvbXBvbmVudCA9PT0gY29tcG9uZW50KSBhcyBNdHhTcGxpdEFyZWE7XG4gICAgICB0aGlzLmhpZGVkQXJlYXMuc3BsaWNlKHRoaXMuaGlkZWRBcmVhcy5pbmRleE9mKGFyZWEpLCAxKTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgdXBkYXRlQXJlYShjb21wb25lbnQ6IE10eFNwbGl0UGFuZSwgcmVzZXRPcmRlcnM6IGJvb2xlYW4sIHJlc2V0U2l6ZXM6IGJvb2xlYW4pOiB2b2lkIHtcbiAgICBpZiAoY29tcG9uZW50LnZpc2libGUgPT09IHRydWUpIHtcbiAgICAgIHRoaXMuYnVpbGQocmVzZXRPcmRlcnMsIHJlc2V0U2l6ZXMpO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBzaG93QXJlYShjb21wb25lbnQ6IE10eFNwbGl0UGFuZSk6IHZvaWQge1xuICAgIGNvbnN0IGFyZWEgPSB0aGlzLmhpZGVkQXJlYXMuZmluZChhID0+IGEuY29tcG9uZW50ID09PSBjb21wb25lbnQpO1xuICAgIGlmIChhcmVhID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBhcmVhcyA9IHRoaXMuaGlkZWRBcmVhcy5zcGxpY2UodGhpcy5oaWRlZEFyZWFzLmluZGV4T2YoYXJlYSksIDEpO1xuICAgIHRoaXMuZGlzcGxheWVkQXJlYXMucHVzaCguLi5hcmVhcyk7XG5cbiAgICB0aGlzLmJ1aWxkKHRydWUsIHRydWUpO1xuICB9XG5cbiAgcHVibGljIGhpZGVBcmVhKGNvbXA6IE10eFNwbGl0UGFuZSk6IHZvaWQge1xuICAgIGNvbnN0IGFyZWEgPSB0aGlzLmRpc3BsYXllZEFyZWFzLmZpbmQoYSA9PiBhLmNvbXBvbmVudCA9PT0gY29tcCk7XG4gICAgaWYgKGFyZWEgPT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGFyZWFzID0gdGhpcy5kaXNwbGF5ZWRBcmVhcy5zcGxpY2UodGhpcy5kaXNwbGF5ZWRBcmVhcy5pbmRleE9mKGFyZWEpLCAxKTtcbiAgICBhcmVhcy5mb3JFYWNoKF9hcmVhID0+IHtcbiAgICAgIF9hcmVhLm9yZGVyID0gMDtcbiAgICAgIF9hcmVhLnNpemUgPSAwO1xuICAgIH0pO1xuICAgIHRoaXMuaGlkZWRBcmVhcy5wdXNoKC4uLmFyZWFzKTtcblxuICAgIHRoaXMuYnVpbGQodHJ1ZSwgdHJ1ZSk7XG4gIH1cblxuICBwdWJsaWMgZ2V0VmlzaWJsZUFyZWFTaXplcygpOiBNdHhTcGxpdE91dHB1dEFyZWFTaXplcyB7XG4gICAgcmV0dXJuIHRoaXMuZGlzcGxheWVkQXJlYXMubWFwKGEgPT4gKGEuc2l6ZSA9PT0gbnVsbCA/ICcqJyA6IGEuc2l6ZSkpO1xuICB9XG5cbiAgcHVibGljIHNldFZpc2libGVBcmVhU2l6ZXMoc2l6ZXM6IE10eFNwbGl0T3V0cHV0QXJlYVNpemVzKTogYm9vbGVhbiB7XG4gICAgaWYgKHNpemVzLmxlbmd0aCAhPT0gdGhpcy5kaXNwbGF5ZWRBcmVhcy5sZW5ndGgpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBjb25zdCBmb3JtYXRlZFNpemVzID0gc2l6ZXMubWFwKHMgPT4gZ2V0SW5wdXRQb3NpdGl2ZU51bWJlcihzLCBudWxsKSkgYXMgbnVtYmVyW107XG4gICAgY29uc3QgaXNWYWxpZCA9IGlzVXNlclNpemVzVmFsaWQodGhpcy51bml0LCBmb3JtYXRlZFNpemVzKTtcblxuICAgIGlmIChpc1ZhbGlkID09PSBmYWxzZSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvYmFuLXRzLWNvbW1lbnRcbiAgICAvLyBAdHMtaWdub3JlXG4gICAgdGhpcy5kaXNwbGF5ZWRBcmVhcy5mb3JFYWNoKChhcmVhLCBpKSA9PiAoYXJlYS5jb21wb25lbnQuX3NpemUgPSBmb3JtYXRlZFNpemVzW2ldKSk7XG5cbiAgICB0aGlzLmJ1aWxkKGZhbHNlLCB0cnVlKTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIHByaXZhdGUgYnVpbGQocmVzZXRPcmRlcnM6IGJvb2xlYW4sIHJlc2V0U2l6ZXM6IGJvb2xlYW4pOiB2b2lkIHtcbiAgICB0aGlzLnN0b3BEcmFnZ2luZygpO1xuXG4gICAgLy8gwqQgQVJFQVMgT1JERVJcblxuICAgIGlmIChyZXNldE9yZGVycyA9PT0gdHJ1ZSkge1xuICAgICAgLy8gSWYgdXNlciBwcm92aWRlZCAnb3JkZXInIGZvciBlYWNoIGFyZWEsIHVzZSBpdCB0byBzb3J0IHRoZW0uXG4gICAgICBpZiAodGhpcy5kaXNwbGF5ZWRBcmVhcy5ldmVyeShhID0+IGEuY29tcG9uZW50Lm9yZGVyICE9PSBudWxsKSkge1xuICAgICAgICB0aGlzLmRpc3BsYXllZEFyZWFzLnNvcnQoXG4gICAgICAgICAgKGEsIGIpID0+ICgoYS5jb21wb25lbnQub3JkZXIgYXMgbnVtYmVyKSAtIChiLmNvbXBvbmVudC5vcmRlciBhcyBudW1iZXIpKSBhcyBudW1iZXJcbiAgICAgICAgKTtcbiAgICAgIH1cblxuICAgICAgLy8gVGhlbiBzZXQgcmVhbCBvcmRlciB3aXRoIG11bHRpcGxlcyBvZiAyLCBudW1iZXJzIGJldHdlZW4gd2lsbCBiZSB1c2VkIGJ5IGd1dHRlcnMuXG4gICAgICB0aGlzLmRpc3BsYXllZEFyZWFzLmZvckVhY2goKGFyZWEsIGkpID0+IHtcbiAgICAgICAgYXJlYS5vcmRlciA9IGkgKiAyO1xuICAgICAgICBhcmVhLmNvbXBvbmVudC5zZXRTdHlsZU9yZGVyKGFyZWEub3JkZXIpO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gwqQgQVJFQVMgU0laRVxuXG4gICAgaWYgKHJlc2V0U2l6ZXMgPT09IHRydWUpIHtcbiAgICAgIGNvbnN0IHVzZVVzZXJTaXplcyA9IGlzVXNlclNpemVzVmFsaWQoXG4gICAgICAgIHRoaXMudW5pdCxcbiAgICAgICAgdGhpcy5kaXNwbGF5ZWRBcmVhcy5tYXAoYSA9PiBhLmNvbXBvbmVudC5zaXplKSBhcyBudW1iZXJbXVxuICAgICAgKTtcblxuICAgICAgc3dpdGNoICh0aGlzLnVuaXQpIHtcbiAgICAgICAgY2FzZSAncGVyY2VudCc6IHtcbiAgICAgICAgICBjb25zdCBkZWZhdWx0U2l6ZSA9IDEwMCAvIHRoaXMuZGlzcGxheWVkQXJlYXMubGVuZ3RoO1xuXG4gICAgICAgICAgdGhpcy5kaXNwbGF5ZWRBcmVhcy5mb3JFYWNoKGFyZWEgPT4ge1xuICAgICAgICAgICAgYXJlYS5zaXplID0gdXNlVXNlclNpemVzID8gKGFyZWEuY29tcG9uZW50LnNpemUgYXMgbnVtYmVyKSA6IGRlZmF1bHRTaXplO1xuICAgICAgICAgICAgYXJlYS5taW5TaXplID0gZ2V0QXJlYU1pblNpemUoYXJlYSk7XG4gICAgICAgICAgICBhcmVhLm1heFNpemUgPSBnZXRBcmVhTWF4U2l6ZShhcmVhKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICBjYXNlICdwaXhlbCc6IHtcbiAgICAgICAgICBpZiAodXNlVXNlclNpemVzKSB7XG4gICAgICAgICAgICB0aGlzLmRpc3BsYXllZEFyZWFzLmZvckVhY2goYXJlYSA9PiB7XG4gICAgICAgICAgICAgIGFyZWEuc2l6ZSA9IGFyZWEuY29tcG9uZW50LnNpemU7XG4gICAgICAgICAgICAgIGFyZWEubWluU2l6ZSA9IGdldEFyZWFNaW5TaXplKGFyZWEpO1xuICAgICAgICAgICAgICBhcmVhLm1heFNpemUgPSBnZXRBcmVhTWF4U2l6ZShhcmVhKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zdCB3aWxkY2FyZFNpemVBcmVhcyA9IHRoaXMuZGlzcGxheWVkQXJlYXMuZmlsdGVyKGEgPT4gYS5jb21wb25lbnQuc2l6ZSA9PT0gbnVsbCk7XG5cbiAgICAgICAgICAgIC8vIE5vIHdpbGRjYXJkIGFyZWEgPiBOZWVkIHRvIHNlbGVjdCBvbmUgYXJiaXRyYXJpbHkgPiBmaXJzdFxuICAgICAgICAgICAgaWYgKHdpbGRjYXJkU2l6ZUFyZWFzLmxlbmd0aCA9PT0gMCAmJiB0aGlzLmRpc3BsYXllZEFyZWFzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgdGhpcy5kaXNwbGF5ZWRBcmVhcy5mb3JFYWNoKChhcmVhLCBpKSA9PiB7XG4gICAgICAgICAgICAgICAgYXJlYS5zaXplID0gaSA9PT0gMCA/IG51bGwgOiBhcmVhLmNvbXBvbmVudC5zaXplO1xuICAgICAgICAgICAgICAgIGFyZWEubWluU2l6ZSA9IGkgPT09IDAgPyBudWxsIDogZ2V0QXJlYU1pblNpemUoYXJlYSk7XG4gICAgICAgICAgICAgICAgYXJlYS5tYXhTaXplID0gaSA9PT0gMCA/IG51bGwgOiBnZXRBcmVhTWF4U2l6ZShhcmVhKTtcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBNb3JlIHRoYW4gb25lIHdpbGRjYXJkIGFyZWEgPiBOZWVkIHRvIGtlZXAgb25seSBvbmUgYXJiaXRyYXJseSA+IGZpcnN0XG4gICAgICAgICAgICBlbHNlIGlmICh3aWxkY2FyZFNpemVBcmVhcy5sZW5ndGggPiAxKSB7XG4gICAgICAgICAgICAgIGxldCBhbHJlYWR5R290T25lID0gZmFsc2U7XG4gICAgICAgICAgICAgIHRoaXMuZGlzcGxheWVkQXJlYXMuZm9yRWFjaChhcmVhID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoYXJlYS5jb21wb25lbnQuc2l6ZSA9PT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgaWYgKGFscmVhZHlHb3RPbmUgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgICAgIGFyZWEuc2l6ZSA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgIGFyZWEubWluU2l6ZSA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgIGFyZWEubWF4U2l6ZSA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgIGFscmVhZHlHb3RPbmUgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgYXJlYS5zaXplID0gMTAwO1xuICAgICAgICAgICAgICAgICAgICBhcmVhLm1pblNpemUgPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICBhcmVhLm1heFNpemUgPSBudWxsO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICBhcmVhLnNpemUgPSBhcmVhLmNvbXBvbmVudC5zaXplO1xuICAgICAgICAgICAgICAgICAgYXJlYS5taW5TaXplID0gZ2V0QXJlYU1pblNpemUoYXJlYSk7XG4gICAgICAgICAgICAgICAgICBhcmVhLm1heFNpemUgPSBnZXRBcmVhTWF4U2l6ZShhcmVhKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMucmVmcmVzaFN0eWxlU2l6ZXMoKTtcbiAgICB0aGlzLmNkUmVmLm1hcmtGb3JDaGVjaygpO1xuICB9XG5cbiAgcHJpdmF0ZSByZWZyZXNoU3R5bGVTaXplcygpOiB2b2lkIHtcbiAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4gICAgLy8gUEVSQ0VOVCBNT0RFXG4gICAgaWYgKHRoaXMudW5pdCA9PT0gJ3BlcmNlbnQnKSB7XG4gICAgICAvLyBPbmx5IG9uZSBhcmVhID4gZmxleC1iYXNpcyAxMDAlXG4gICAgICBpZiAodGhpcy5kaXNwbGF5ZWRBcmVhcy5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgdGhpcy5kaXNwbGF5ZWRBcmVhc1swXS5jb21wb25lbnQuc2V0U3R5bGVGbGV4KDAsIDAsIGAxMDAlYCwgZmFsc2UsIGZhbHNlKTtcbiAgICAgIH1cbiAgICAgIC8vIE11bHRpcGxlIGFyZWFzID4gdXNlIGVhY2ggcGVyY2VudCBiYXNpc1xuICAgICAgZWxzZSB7XG4gICAgICAgIGNvbnN0IHN1bUd1dHRlclNpemUgPSB0aGlzLmdldE5iR3V0dGVycygpICogdGhpcy5ndXR0ZXJTaXplO1xuXG4gICAgICAgIHRoaXMuZGlzcGxheWVkQXJlYXMuZm9yRWFjaChhcmVhID0+IHtcbiAgICAgICAgICBhcmVhLmNvbXBvbmVudC5zZXRTdHlsZUZsZXgoXG4gICAgICAgICAgICAwLFxuICAgICAgICAgICAgMCxcbiAgICAgICAgICAgIGBjYWxjKCAke2FyZWEuc2l6ZX0lIC0gJHsoKGFyZWEuc2l6ZSBhcyBudW1iZXIpIC8gMTAwKSAqIHN1bUd1dHRlclNpemV9cHggKWAsXG4gICAgICAgICAgICBhcmVhLm1pblNpemUgIT09IG51bGwgJiYgYXJlYS5taW5TaXplID09PSBhcmVhLnNpemUgPyB0cnVlIDogZmFsc2UsXG4gICAgICAgICAgICBhcmVhLm1heFNpemUgIT09IG51bGwgJiYgYXJlYS5tYXhTaXplID09PSBhcmVhLnNpemUgPyB0cnVlIDogZmFsc2VcbiAgICAgICAgICApO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuICAgIC8vIFBJWEVMIE1PREVcbiAgICBlbHNlIGlmICh0aGlzLnVuaXQgPT09ICdwaXhlbCcpIHtcbiAgICAgIHRoaXMuZGlzcGxheWVkQXJlYXMuZm9yRWFjaChhcmVhID0+IHtcbiAgICAgICAgLy8gQXJlYSB3aXRoIHdpbGRjYXJkIHNpemVcbiAgICAgICAgaWYgKGFyZWEuc2l6ZSA9PT0gbnVsbCkge1xuICAgICAgICAgIGlmICh0aGlzLmRpc3BsYXllZEFyZWFzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgICAgYXJlYS5jb21wb25lbnQuc2V0U3R5bGVGbGV4KDEsIDEsIGAxMDAlYCwgZmFsc2UsIGZhbHNlKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgYXJlYS5jb21wb25lbnQuc2V0U3R5bGVGbGV4KDEsIDEsIGBhdXRvYCwgZmFsc2UsIGZhbHNlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gQXJlYSB3aXRoIHBpeGVsIHNpemVcbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgLy8gT25seSBvbmUgYXJlYSA+IGZsZXgtYmFzaXMgMTAwJVxuICAgICAgICAgIGlmICh0aGlzLmRpc3BsYXllZEFyZWFzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgICAgYXJlYS5jb21wb25lbnQuc2V0U3R5bGVGbGV4KDAsIDAsIGAxMDAlYCwgZmFsc2UsIGZhbHNlKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgLy8gTXVsdGlwbGUgYXJlYXMgPiB1c2UgZWFjaCBwaXhlbCBiYXNpc1xuICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgYXJlYS5jb21wb25lbnQuc2V0U3R5bGVGbGV4KFxuICAgICAgICAgICAgICAwLFxuICAgICAgICAgICAgICAwLFxuICAgICAgICAgICAgICBgJHthcmVhLnNpemV9cHhgLFxuICAgICAgICAgICAgICBhcmVhLm1pblNpemUgIT09IG51bGwgJiYgYXJlYS5taW5TaXplID09PSBhcmVhLnNpemUgPyB0cnVlIDogZmFsc2UsXG4gICAgICAgICAgICAgIGFyZWEubWF4U2l6ZSAhPT0gbnVsbCAmJiBhcmVhLm1heFNpemUgPT09IGFyZWEuc2l6ZSA/IHRydWUgOiBmYWxzZVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIF9jbGlja1RpbWVvdXQ6IG51bWJlciB8IG51bGwgPSBudWxsO1xuXG4gIHB1YmxpYyBjbGlja0d1dHRlcihldmVudDogTW91c2VFdmVudCB8IFRvdWNoRXZlbnQsIGd1dHRlck51bTogbnVtYmVyKTogdm9pZCB7XG4gICAgY29uc3QgdGVtcFBvaW50ID0gZ2V0UG9pbnRGcm9tRXZlbnQoZXZlbnQpIGFzIE10eFNwbGl0UG9pbnQ7XG5cbiAgICAvLyBCZSBzdXJlIG1vdXNldXAvdG91Y2hlbmQgaGFwcGVuZWQgYXQgc2FtZSBwb2ludCBhcyBtb3VzZWRvd24vdG91Y2hzdGFydCB0byB0cmlnZ2VyIGNsaWNrL2RibGNsaWNrXG4gICAgaWYgKHRoaXMuc3RhcnRQb2ludCAmJiB0aGlzLnN0YXJ0UG9pbnQueCA9PT0gdGVtcFBvaW50LnggJiYgdGhpcy5zdGFydFBvaW50LnkgPT09IHRlbXBQb2ludC55KSB7XG4gICAgICAvLyBJZiB0aW1lb3V0IGluIHByb2dyZXNzIGFuZCBuZXcgY2xpY2sgPiBjbGVhclRpbWVvdXQgJiBkYmxDbGlja0V2ZW50XG4gICAgICBpZiAodGhpcy5fY2xpY2tUaW1lb3V0ICE9PSBudWxsKSB7XG4gICAgICAgIHdpbmRvdy5jbGVhclRpbWVvdXQodGhpcy5fY2xpY2tUaW1lb3V0KTtcbiAgICAgICAgdGhpcy5fY2xpY2tUaW1lb3V0ID0gbnVsbDtcbiAgICAgICAgdGhpcy5ub3RpZnkoJ2RibGNsaWNrJywgZ3V0dGVyTnVtKTtcbiAgICAgICAgdGhpcy5zdG9wRHJhZ2dpbmcoKTtcbiAgICAgIH1cbiAgICAgIC8vIEVsc2Ugc3RhcnQgdGltZW91dCB0byBjYWxsIGNsaWNrRXZlbnQgYXQgZW5kXG4gICAgICBlbHNlIHtcbiAgICAgICAgdGhpcy5fY2xpY2tUaW1lb3V0ID0gd2luZG93LnNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgIHRoaXMuX2NsaWNrVGltZW91dCA9IG51bGw7XG4gICAgICAgICAgdGhpcy5ub3RpZnkoJ2NsaWNrJywgZ3V0dGVyTnVtKTtcbiAgICAgICAgICB0aGlzLnN0b3BEcmFnZ2luZygpO1xuICAgICAgICB9LCB0aGlzLmd1dHRlckRibENsaWNrRHVyYXRpb24pO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBzdGFydERyYWdnaW5nKFxuICAgIGV2ZW50OiBNb3VzZUV2ZW50IHwgVG91Y2hFdmVudCxcbiAgICBndXR0ZXJPcmRlcjogbnVtYmVyLFxuICAgIGd1dHRlck51bTogbnVtYmVyXG4gICk6IHZvaWQge1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cbiAgICB0aGlzLnN0YXJ0UG9pbnQgPSBnZXRQb2ludEZyb21FdmVudChldmVudCk7XG4gICAgaWYgKHRoaXMuc3RhcnRQb2ludCA9PT0gbnVsbCB8fCB0aGlzLmRpc2FibGVkID09PSB0cnVlKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5zbmFwc2hvdCA9IHtcbiAgICAgIGd1dHRlck51bSxcbiAgICAgIGxhc3RTdGVwcGVkT2Zmc2V0OiAwLFxuICAgICAgYWxsQXJlYXNTaXplUGl4ZWw6XG4gICAgICAgIGdldEVsZW1lbnRQaXhlbFNpemUodGhpcy5lbFJlZiwgdGhpcy5kaXJlY3Rpb24pIC0gdGhpcy5nZXROYkd1dHRlcnMoKSAqIHRoaXMuZ3V0dGVyU2l6ZSxcbiAgICAgIGFsbEludm9sdmVkQXJlYXNTaXplUGVyY2VudDogMTAwLFxuICAgICAgYXJlYXNCZWZvcmVHdXR0ZXI6IFtdLFxuICAgICAgYXJlYXNBZnRlckd1dHRlcjogW10sXG4gICAgfTtcblxuICAgIHRoaXMuZGlzcGxheWVkQXJlYXMuZm9yRWFjaChhcmVhID0+IHtcbiAgICAgIGNvbnN0IGFyZWFTbmFwc2hvdDogTXR4U3BsaXRBcmVhU25hcHNob3QgPSB7XG4gICAgICAgIGFyZWEsXG4gICAgICAgIHNpemVQaXhlbEF0U3RhcnQ6IGdldEVsZW1lbnRQaXhlbFNpemUoYXJlYS5jb21wb25lbnQuZWxSZWYsIHRoaXMuZGlyZWN0aW9uKSxcbiAgICAgICAgc2l6ZVBlcmNlbnRBdFN0YXJ0OiAodGhpcy51bml0ID09PSAncGVyY2VudCcgPyBhcmVhLnNpemUgOiAtMSkgYXMgbnVtYmVyLCAvLyBJZiBwaXhlbCBtb2RlLCBhbnl3YXksIHdpbGwgbm90IGJlIHVzZWQuXG4gICAgICB9O1xuXG4gICAgICBpZiAoYXJlYS5vcmRlciA8IGd1dHRlck9yZGVyKSB7XG4gICAgICAgIGlmICh0aGlzLnJlc3RyaWN0TW92ZSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICh0aGlzLnNuYXBzaG90IGFzIE10eFNwbGl0U25hcHNob3QpLmFyZWFzQmVmb3JlR3V0dGVyID0gW2FyZWFTbmFwc2hvdF07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgKHRoaXMuc25hcHNob3QgYXMgTXR4U3BsaXRTbmFwc2hvdCkuYXJlYXNCZWZvcmVHdXR0ZXIudW5zaGlmdChhcmVhU25hcHNob3QpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKGFyZWEub3JkZXIgPiBndXR0ZXJPcmRlcikge1xuICAgICAgICBpZiAodGhpcy5yZXN0cmljdE1vdmUgPT09IHRydWUpIHtcbiAgICAgICAgICBpZiAoKHRoaXMuc25hcHNob3QgYXMgTXR4U3BsaXRTbmFwc2hvdCkuYXJlYXNBZnRlckd1dHRlci5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICh0aGlzLnNuYXBzaG90IGFzIE10eFNwbGl0U25hcHNob3QpLmFyZWFzQWZ0ZXJHdXR0ZXIgPSBbYXJlYVNuYXBzaG90XTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgKHRoaXMuc25hcHNob3QgYXMgTXR4U3BsaXRTbmFwc2hvdCkuYXJlYXNBZnRlckd1dHRlci5wdXNoKGFyZWFTbmFwc2hvdCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHRoaXMuc25hcHNob3QuYWxsSW52b2x2ZWRBcmVhc1NpemVQZXJjZW50ID0gW1xuICAgICAgLi4udGhpcy5zbmFwc2hvdC5hcmVhc0JlZm9yZUd1dHRlcixcbiAgICAgIC4uLnRoaXMuc25hcHNob3QuYXJlYXNBZnRlckd1dHRlcixcbiAgICBdLnJlZHVjZSgodCwgYSkgPT4gdCArIGEuc2l6ZVBlcmNlbnRBdFN0YXJ0LCAwKTtcblxuICAgIGlmIChcbiAgICAgIHRoaXMuc25hcHNob3QuYXJlYXNCZWZvcmVHdXR0ZXIubGVuZ3RoID09PSAwIHx8XG4gICAgICB0aGlzLnNuYXBzaG90LmFyZWFzQWZ0ZXJHdXR0ZXIubGVuZ3RoID09PSAwXG4gICAgKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5kcmFnTGlzdGVuZXJzLnB1c2goXG4gICAgICB0aGlzLnJlbmRlcmVyLmxpc3RlbignZG9jdW1lbnQnLCAnbW91c2V1cCcsIHRoaXMuc3RvcERyYWdnaW5nLmJpbmQodGhpcykpXG4gICAgKTtcbiAgICB0aGlzLmRyYWdMaXN0ZW5lcnMucHVzaChcbiAgICAgIHRoaXMucmVuZGVyZXIubGlzdGVuKCdkb2N1bWVudCcsICd0b3VjaGVuZCcsIHRoaXMuc3RvcERyYWdnaW5nLmJpbmQodGhpcykpXG4gICAgKTtcbiAgICB0aGlzLmRyYWdMaXN0ZW5lcnMucHVzaChcbiAgICAgIHRoaXMucmVuZGVyZXIubGlzdGVuKCdkb2N1bWVudCcsICd0b3VjaGNhbmNlbCcsIHRoaXMuc3RvcERyYWdnaW5nLmJpbmQodGhpcykpXG4gICAgKTtcblxuICAgIHRoaXMubmdab25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcbiAgICAgIHRoaXMuZHJhZ0xpc3RlbmVycy5wdXNoKFxuICAgICAgICB0aGlzLnJlbmRlcmVyLmxpc3RlbignZG9jdW1lbnQnLCAnbW91c2Vtb3ZlJywgdGhpcy5kcmFnRXZlbnQuYmluZCh0aGlzKSlcbiAgICAgICk7XG4gICAgICB0aGlzLmRyYWdMaXN0ZW5lcnMucHVzaChcbiAgICAgICAgdGhpcy5yZW5kZXJlci5saXN0ZW4oJ2RvY3VtZW50JywgJ3RvdWNobW92ZScsIHRoaXMuZHJhZ0V2ZW50LmJpbmQodGhpcykpXG4gICAgICApO1xuICAgIH0pO1xuXG4gICAgdGhpcy5kaXNwbGF5ZWRBcmVhcy5mb3JFYWNoKGFyZWEgPT4gYXJlYS5jb21wb25lbnQubG9ja0V2ZW50cygpKTtcblxuICAgIHRoaXMuaXNEcmFnZ2luZyA9IHRydWU7XG4gICAgdGhpcy5yZW5kZXJlci5hZGRDbGFzcyh0aGlzLmVsUmVmLm5hdGl2ZUVsZW1lbnQsICdtdHgtZHJhZ2dpbmcnKTtcbiAgICB0aGlzLnJlbmRlcmVyLmFkZENsYXNzKFxuICAgICAgdGhpcy5ndXR0ZXJFbHMudG9BcnJheSgpW3RoaXMuc25hcHNob3QuZ3V0dGVyTnVtIC0gMV0ubmF0aXZlRWxlbWVudCxcbiAgICAgICdtdHgtZHJhZ2dlZCdcbiAgICApO1xuXG4gICAgdGhpcy5ub3RpZnkoJ3N0YXJ0JywgdGhpcy5zbmFwc2hvdC5ndXR0ZXJOdW0pO1xuICB9XG5cbiAgcHJpdmF0ZSBkcmFnRXZlbnQoZXZlbnQ6IE1vdXNlRXZlbnQgfCBUb3VjaEV2ZW50KTogdm9pZCB7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcblxuICAgIGlmICh0aGlzLl9jbGlja1RpbWVvdXQgIT09IG51bGwpIHtcbiAgICAgIHdpbmRvdy5jbGVhclRpbWVvdXQodGhpcy5fY2xpY2tUaW1lb3V0KTtcbiAgICAgIHRoaXMuX2NsaWNrVGltZW91dCA9IG51bGw7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuaXNEcmFnZ2luZyA9PT0gZmFsc2UpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLmVuZFBvaW50ID0gZ2V0UG9pbnRGcm9tRXZlbnQoZXZlbnQpO1xuICAgIGlmICh0aGlzLmVuZFBvaW50ID09PSBudWxsKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gQ2FsY3VsYXRlIHN0ZXBwZWRPZmZzZXRcblxuICAgIGxldCBvZmZzZXQgPVxuICAgICAgdGhpcy5kaXJlY3Rpb24gPT09ICdob3Jpem9udGFsJ1xuICAgICAgICA/ICh0aGlzLnN0YXJ0UG9pbnQgYXMgTXR4U3BsaXRQb2ludCkueCAtIHRoaXMuZW5kUG9pbnQueFxuICAgICAgICA6ICh0aGlzLnN0YXJ0UG9pbnQgYXMgTXR4U3BsaXRQb2ludCkueSAtIHRoaXMuZW5kUG9pbnQueTtcbiAgICBpZiAodGhpcy5kaXIgPT09ICdydGwnKSB7XG4gICAgICBvZmZzZXQgPSAtb2Zmc2V0O1xuICAgIH1cbiAgICBjb25zdCBzdGVwcGVkT2Zmc2V0ID0gTWF0aC5yb3VuZChvZmZzZXQgLyB0aGlzLmd1dHRlclN0ZXApICogdGhpcy5ndXR0ZXJTdGVwO1xuXG4gICAgaWYgKHN0ZXBwZWRPZmZzZXQgPT09ICh0aGlzLnNuYXBzaG90IGFzIE10eFNwbGl0U25hcHNob3QpLmxhc3RTdGVwcGVkT2Zmc2V0KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgKHRoaXMuc25hcHNob3QgYXMgTXR4U3BsaXRTbmFwc2hvdCkubGFzdFN0ZXBwZWRPZmZzZXQgPSBzdGVwcGVkT2Zmc2V0O1xuXG4gICAgLy8gTmVlZCB0byBrbm93IGlmIGVhY2ggZ3V0dGVyIHNpZGUgYXJlYXMgY291bGQgcmVhY3RzIHRvIHN0ZXBwZWRPZmZzZXRcblxuICAgIGxldCBhcmVhc0JlZm9yZSA9IGdldEd1dHRlclNpZGVBYnNvcnB0aW9uQ2FwYWNpdHkoXG4gICAgICB0aGlzLnVuaXQsXG4gICAgICAodGhpcy5zbmFwc2hvdCBhcyBNdHhTcGxpdFNuYXBzaG90KS5hcmVhc0JlZm9yZUd1dHRlcixcbiAgICAgIC1zdGVwcGVkT2Zmc2V0LFxuICAgICAgKHRoaXMuc25hcHNob3QgYXMgTXR4U3BsaXRTbmFwc2hvdCkuYWxsQXJlYXNTaXplUGl4ZWxcbiAgICApO1xuICAgIGxldCBhcmVhc0FmdGVyID0gZ2V0R3V0dGVyU2lkZUFic29ycHRpb25DYXBhY2l0eShcbiAgICAgIHRoaXMudW5pdCxcbiAgICAgICh0aGlzLnNuYXBzaG90IGFzIE10eFNwbGl0U25hcHNob3QpLmFyZWFzQWZ0ZXJHdXR0ZXIsXG4gICAgICBzdGVwcGVkT2Zmc2V0LFxuICAgICAgKHRoaXMuc25hcHNob3QgYXMgTXR4U3BsaXRTbmFwc2hvdCkuYWxsQXJlYXNTaXplUGl4ZWxcbiAgICApO1xuXG4gICAgLy8gRWFjaCBndXR0ZXIgc2lkZSBhcmVhcyBjYW4ndCBhYnNvcmIgYWxsIG9mZnNldFxuICAgIGlmIChhcmVhc0JlZm9yZS5yZW1haW4gIT09IDAgJiYgYXJlYXNBZnRlci5yZW1haW4gIT09IDApIHtcbiAgICAgIGlmIChNYXRoLmFicyhhcmVhc0JlZm9yZS5yZW1haW4pID09PSBNYXRoLmFicyhhcmVhc0FmdGVyLnJlbWFpbikpIHtcbiAgICAgICAgLyoqICovXG4gICAgICB9IGVsc2UgaWYgKE1hdGguYWJzKGFyZWFzQmVmb3JlLnJlbWFpbikgPiBNYXRoLmFicyhhcmVhc0FmdGVyLnJlbWFpbikpIHtcbiAgICAgICAgYXJlYXNBZnRlciA9IGdldEd1dHRlclNpZGVBYnNvcnB0aW9uQ2FwYWNpdHkoXG4gICAgICAgICAgdGhpcy51bml0LFxuICAgICAgICAgICh0aGlzLnNuYXBzaG90IGFzIE10eFNwbGl0U25hcHNob3QpLmFyZWFzQWZ0ZXJHdXR0ZXIsXG4gICAgICAgICAgc3RlcHBlZE9mZnNldCArIGFyZWFzQmVmb3JlLnJlbWFpbixcbiAgICAgICAgICAodGhpcy5zbmFwc2hvdCBhcyBNdHhTcGxpdFNuYXBzaG90KS5hbGxBcmVhc1NpemVQaXhlbFxuICAgICAgICApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYXJlYXNCZWZvcmUgPSBnZXRHdXR0ZXJTaWRlQWJzb3JwdGlvbkNhcGFjaXR5KFxuICAgICAgICAgIHRoaXMudW5pdCxcbiAgICAgICAgICAodGhpcy5zbmFwc2hvdCBhcyBNdHhTcGxpdFNuYXBzaG90KS5hcmVhc0JlZm9yZUd1dHRlcixcbiAgICAgICAgICAtKHN0ZXBwZWRPZmZzZXQgLSBhcmVhc0FmdGVyLnJlbWFpbiksXG4gICAgICAgICAgKHRoaXMuc25hcHNob3QgYXMgTXR4U3BsaXRTbmFwc2hvdCkuYWxsQXJlYXNTaXplUGl4ZWxcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9XG4gICAgLy8gQXJlYXMgYmVmb3JlIGd1dHRlciBjYW4ndCBhYnNvcmJzIGFsbCBvZmZzZXQgPiBuZWVkIHRvIHJlY2FsY3VsYXRlIHNpemVzIGZvciBhcmVhcyBhZnRlciBndXR0ZXIuXG4gICAgZWxzZSBpZiAoYXJlYXNCZWZvcmUucmVtYWluICE9PSAwKSB7XG4gICAgICBhcmVhc0FmdGVyID0gZ2V0R3V0dGVyU2lkZUFic29ycHRpb25DYXBhY2l0eShcbiAgICAgICAgdGhpcy51bml0LFxuICAgICAgICAodGhpcy5zbmFwc2hvdCBhcyBNdHhTcGxpdFNuYXBzaG90KS5hcmVhc0FmdGVyR3V0dGVyLFxuICAgICAgICBzdGVwcGVkT2Zmc2V0ICsgYXJlYXNCZWZvcmUucmVtYWluLFxuICAgICAgICAodGhpcy5zbmFwc2hvdCBhcyBNdHhTcGxpdFNuYXBzaG90KS5hbGxBcmVhc1NpemVQaXhlbFxuICAgICAgKTtcbiAgICB9XG4gICAgLy8gQXJlYXMgYWZ0ZXIgZ3V0dGVyIGNhbid0IGFic29yYnMgYWxsIG9mZnNldCA+IG5lZWQgdG8gcmVjYWxjdWxhdGUgc2l6ZXMgZm9yIGFyZWFzIGJlZm9yZSBndXR0ZXIuXG4gICAgZWxzZSBpZiAoYXJlYXNBZnRlci5yZW1haW4gIT09IDApIHtcbiAgICAgIGFyZWFzQmVmb3JlID0gZ2V0R3V0dGVyU2lkZUFic29ycHRpb25DYXBhY2l0eShcbiAgICAgICAgdGhpcy51bml0LFxuICAgICAgICAodGhpcy5zbmFwc2hvdCBhcyBNdHhTcGxpdFNuYXBzaG90KS5hcmVhc0JlZm9yZUd1dHRlcixcbiAgICAgICAgLShzdGVwcGVkT2Zmc2V0IC0gYXJlYXNBZnRlci5yZW1haW4pLFxuICAgICAgICAodGhpcy5zbmFwc2hvdCBhcyBNdHhTcGxpdFNuYXBzaG90KS5hbGxBcmVhc1NpemVQaXhlbFxuICAgICAgKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy51bml0ID09PSAncGVyY2VudCcpIHtcbiAgICAgIC8vIEhhY2sgYmVjYXVzZSBvZiBicm93c2VyIG1lc3NpbmcgdXAgd2l0aCBzaXplcyB1c2luZyBjYWxjKFglIC0gWXB4KSAtPiBlbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxuICAgICAgLy8gSWYgbm90IHRoZXJlLCBwbGF5aW5nIHdpdGggZ3V0dGVycyBtYWtlcyB0b3RhbCBnb2luZyBkb3duIHRvIDk5Ljk5ODc1JSB0aGVuIDk5Ljk5Mjg2JSwgOTkuOTg5ODYlLC4uXG4gICAgICBjb25zdCBhbGwgPSBbLi4uYXJlYXNCZWZvcmUubGlzdCwgLi4uYXJlYXNBZnRlci5saXN0XTtcbiAgICAgIGNvbnN0IGFyZWFUb1Jlc2V0ID0gYWxsLmZpbmQoXG4gICAgICAgIGEgPT5cbiAgICAgICAgICBhLnBlcmNlbnRBZnRlckFic29ycHRpb24gIT09IDAgJiZcbiAgICAgICAgICBhLnBlcmNlbnRBZnRlckFic29ycHRpb24gIT09IGEuYXJlYVNuYXBzaG90LmFyZWEubWluU2l6ZSAmJlxuICAgICAgICAgIGEucGVyY2VudEFmdGVyQWJzb3JwdGlvbiAhPT0gYS5hcmVhU25hcHNob3QuYXJlYS5tYXhTaXplXG4gICAgICApO1xuXG4gICAgICBpZiAoYXJlYVRvUmVzZXQpIHtcbiAgICAgICAgYXJlYVRvUmVzZXQucGVyY2VudEFmdGVyQWJzb3JwdGlvbiA9XG4gICAgICAgICAgKHRoaXMuc25hcHNob3QgYXMgTXR4U3BsaXRTbmFwc2hvdCkuYWxsSW52b2x2ZWRBcmVhc1NpemVQZXJjZW50IC1cbiAgICAgICAgICBhbGxcbiAgICAgICAgICAgIC5maWx0ZXIoYSA9PiBhICE9PSBhcmVhVG9SZXNldClcbiAgICAgICAgICAgIC5yZWR1Y2UoKHRvdGFsLCBhKSA9PiB0b3RhbCArIGEucGVyY2VudEFmdGVyQWJzb3JwdGlvbiwgMCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gTm93IHdlIGtub3cgYXJlYXMgY291bGQgYWJzb3JiIHN0ZXBwZWRPZmZzZXQsIHRpbWUgdG8gcmVhbGx5IHVwZGF0ZSBzaXplc1xuXG4gICAgYXJlYXNCZWZvcmUubGlzdC5mb3JFYWNoKGl0ZW0gPT4gdXBkYXRlQXJlYVNpemUodGhpcy51bml0LCBpdGVtKSk7XG4gICAgYXJlYXNBZnRlci5saXN0LmZvckVhY2goaXRlbSA9PiB1cGRhdGVBcmVhU2l6ZSh0aGlzLnVuaXQsIGl0ZW0pKTtcblxuICAgIHRoaXMucmVmcmVzaFN0eWxlU2l6ZXMoKTtcbiAgICB0aGlzLm5vdGlmeSgncHJvZ3Jlc3MnLCAodGhpcy5zbmFwc2hvdCBhcyBNdHhTcGxpdFNuYXBzaG90KS5ndXR0ZXJOdW0pO1xuICB9XG5cbiAgcHJpdmF0ZSBzdG9wRHJhZ2dpbmcoZXZlbnQ/OiBFdmVudCk6IHZvaWQge1xuICAgIGlmIChldmVudCkge1xuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmlzRHJhZ2dpbmcgPT09IGZhbHNlKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5kaXNwbGF5ZWRBcmVhcy5mb3JFYWNoKGFyZWEgPT4gYXJlYS5jb21wb25lbnQudW5sb2NrRXZlbnRzKCkpO1xuXG4gICAgd2hpbGUgKHRoaXMuZHJhZ0xpc3RlbmVycy5sZW5ndGggPiAwKSB7XG4gICAgICBjb25zdCBmY3QgPSB0aGlzLmRyYWdMaXN0ZW5lcnMucG9wKCk7XG4gICAgICBpZiAoZmN0KSB7XG4gICAgICAgIGZjdCgpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIFdhcm5pbmc6IEhhdmUgdG8gYmUgYmVmb3JlIFwibm90aWZ5KCdlbmQnKVwiXG4gICAgLy8gYmVjYXVzZSBcIm5vdGlmeSgnZW5kJylcIlwiIGNhbiBiZSBsaW5rZWQgdG8gXCJbc2l6ZV09J3gnXCIgPiBcImJ1aWxkKClcIiA+IFwic3RvcERyYWdnaW5nKClcIlxuICAgIHRoaXMuaXNEcmFnZ2luZyA9IGZhbHNlO1xuXG4gICAgLy8gSWYgbW92ZWQgZnJvbSBzdGFydGluZyBwb2ludCwgbm90aWZ5IGVuZFxuICAgIGlmIChcbiAgICAgIHRoaXMuZW5kUG9pbnQgJiZcbiAgICAgICgodGhpcy5zdGFydFBvaW50IGFzIE10eFNwbGl0UG9pbnQpLnggIT09IHRoaXMuZW5kUG9pbnQueCB8fFxuICAgICAgICAodGhpcy5zdGFydFBvaW50IGFzIE10eFNwbGl0UG9pbnQpLnkgIT09IHRoaXMuZW5kUG9pbnQueSlcbiAgICApIHtcbiAgICAgIHRoaXMubm90aWZ5KCdlbmQnLCAodGhpcy5zbmFwc2hvdCBhcyBNdHhTcGxpdFNuYXBzaG90KS5ndXR0ZXJOdW0pO1xuICAgIH1cblxuICAgIHRoaXMucmVuZGVyZXIucmVtb3ZlQ2xhc3ModGhpcy5lbFJlZi5uYXRpdmVFbGVtZW50LCAnbXR4LWRyYWdnaW5nJyk7XG4gICAgdGhpcy5yZW5kZXJlci5yZW1vdmVDbGFzcyhcbiAgICAgIHRoaXMuZ3V0dGVyRWxzLnRvQXJyYXkoKVsodGhpcy5zbmFwc2hvdCBhcyBNdHhTcGxpdFNuYXBzaG90KS5ndXR0ZXJOdW0gLSAxXS5uYXRpdmVFbGVtZW50LFxuICAgICAgJ210eC1kcmFnZ2VkJ1xuICAgICk7XG4gICAgdGhpcy5zbmFwc2hvdCA9IG51bGw7XG5cbiAgICAvLyBOZWVkZWQgdG8gbGV0IChjbGljayk9XCJjbGlja0d1dHRlciguLi4pXCIgZXZlbnQgcnVuIGFuZCB2ZXJpZnkgaWYgbW91c2UgbW92ZWQgb3Igbm90XG4gICAgdGhpcy5uZ1pvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIHRoaXMuc3RhcnRQb2ludCA9IG51bGw7XG4gICAgICAgIHRoaXMuZW5kUG9pbnQgPSBudWxsO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICBwdWJsaWMgbm90aWZ5KFxuICAgIHR5cGU6ICdzdGFydCcgfCAncHJvZ3Jlc3MnIHwgJ2VuZCcgfCAnY2xpY2snIHwgJ2RibGNsaWNrJyB8ICd0cmFuc2l0aW9uRW5kJyxcbiAgICBndXR0ZXJOdW06IG51bWJlclxuICApOiB2b2lkIHtcbiAgICBjb25zdCBzaXplcyA9IHRoaXMuZ2V0VmlzaWJsZUFyZWFTaXplcygpO1xuXG4gICAgaWYgKHR5cGUgPT09ICdzdGFydCcpIHtcbiAgICAgIHRoaXMuZHJhZ1N0YXJ0LmVtaXQoeyBndXR0ZXJOdW0sIHNpemVzIH0pO1xuICAgIH0gZWxzZSBpZiAodHlwZSA9PT0gJ2VuZCcpIHtcbiAgICAgIHRoaXMuZHJhZ0VuZC5lbWl0KHsgZ3V0dGVyTnVtLCBzaXplcyB9KTtcbiAgICB9IGVsc2UgaWYgKHR5cGUgPT09ICdjbGljaycpIHtcbiAgICAgIHRoaXMuZ3V0dGVyQ2xpY2suZW1pdCh7IGd1dHRlck51bSwgc2l6ZXMgfSk7XG4gICAgfSBlbHNlIGlmICh0eXBlID09PSAnZGJsY2xpY2snKSB7XG4gICAgICB0aGlzLmd1dHRlckRibENsaWNrLmVtaXQoeyBndXR0ZXJOdW0sIHNpemVzIH0pO1xuICAgIH0gZWxzZSBpZiAodHlwZSA9PT0gJ3RyYW5zaXRpb25FbmQnKSB7XG4gICAgICBpZiAodGhpcy50cmFuc2l0aW9uRW5kU3Vic2NyaWJlcikge1xuICAgICAgICB0aGlzLm5nWm9uZS5ydW4oKCkgPT4gdGhpcy50cmFuc2l0aW9uRW5kU3Vic2NyaWJlci5uZXh0KHNpemVzKSk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmICh0eXBlID09PSAncHJvZ3Jlc3MnKSB7XG4gICAgICAvLyBTdGF5IG91dHNpZGUgem9uZSB0byBhbGxvdyB1c2VycyBkbyB3aGF0IHRoZXkgd2FudCBhYm91dCBjaGFuZ2UgZGV0ZWN0aW9uIG1lY2hhbmlzbS5cbiAgICAgIHRoaXMuZHJhZ1Byb2dyZXNzU3ViamVjdC5uZXh0KHsgZ3V0dGVyTnVtLCBzaXplcyB9KTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgbmdPbkRlc3Ryb3koKTogdm9pZCB7XG4gICAgdGhpcy5zdG9wRHJhZ2dpbmcoKTtcbiAgfVxufVxuIiwiPG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PlxyXG48bmctdGVtcGxhdGUgbmdGb3IgW25nRm9yT2ZdPVwiZGlzcGxheWVkQXJlYXNcIiBsZXQtaW5kZXg9XCJpbmRleFwiIGxldC1sYXN0PVwibGFzdFwiPlxyXG4gIDxkaXYgI2d1dHRlckVscyBjbGFzcz1cIm10eC1zcGxpdC1ndXR0ZXJcIiBbbmdDbGFzc109XCJbJ21hdC0nICsgY29sb3JdXCJcclxuICAgICAgICpuZ0lmPVwibGFzdCA9PT0gZmFsc2VcIlxyXG4gICAgICAgW3N0eWxlLmZsZXgtYmFzaXMucHhdPVwiZ3V0dGVyU2l6ZVwiXHJcbiAgICAgICBbc3R5bGUub3JkZXJdPVwiaW5kZXggKiAyICsgMVwiXHJcbiAgICAgICAobW91c2Vkb3duKT1cInN0YXJ0RHJhZ2dpbmcoJGV2ZW50LCBpbmRleCAqIDIgKyAxLCBpbmRleCArIDEpXCJcclxuICAgICAgICh0b3VjaHN0YXJ0KT1cInN0YXJ0RHJhZ2dpbmcoJGV2ZW50LCBpbmRleCAqIDIgKyAxLCBpbmRleCArIDEpXCJcclxuICAgICAgIChtb3VzZXVwKT1cImNsaWNrR3V0dGVyKCRldmVudCwgaW5kZXggKyAxKVwiXHJcbiAgICAgICAodG91Y2hlbmQpPVwiY2xpY2tHdXR0ZXIoJGV2ZW50LCBpbmRleCArIDEpXCI+XHJcbiAgICA8ZGl2IGNsYXNzPVwibXR4LXNwbGl0LWd1dHRlci1oYW5kbGVcIj48L2Rpdj5cclxuICA8L2Rpdj5cclxuPC9uZy10ZW1wbGF0ZT5cclxuIl19