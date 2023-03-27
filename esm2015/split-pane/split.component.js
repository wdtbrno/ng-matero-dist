import { Component, Input, Output, ChangeDetectionStrategy, ChangeDetectorRef, Renderer2, ElementRef, NgZone, ViewChildren, QueryList, EventEmitter, ViewEncapsulation, } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { getInputPositiveNumber, getInputBoolean, isUserSizesValid, getAreaMinSize, getAreaMaxSize, getPointFromEvent, getElementPixelSize, getGutterSideAbsorptionCapacity, updateAreaSize, } from './utils';
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
export class MtxSplitComponent {
    constructor(ngZone, elRef, cdRef, renderer) {
        this.ngZone = ngZone;
        this.elRef = elRef;
        this.cdRef = cdRef;
        this.renderer = renderer;
        this._direction = 'horizontal';
        ////
        this._unit = 'percent';
        ////
        this._gutterSize = 1;
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
                        // tslint:disable-next-line: one-line
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
            // tslint:disable-next-line: one-line
            else {
                const sumGutterSize = this.getNbGutters() * this.gutterSize;
                this.displayedAreas.forEach(area => {
                    area.component.setStyleFlex(0, 0, `calc( ${area.size}% - ${(area.size / 100) * sumGutterSize}px )`, area.minSize !== null && area.minSize === area.size ? true : false, area.maxSize !== null && area.maxSize === area.size ? true : false);
                });
            }
        }
        ///////////////////////////////////////////
        // PIXEL MODE
        // tslint:disable-next-line: one-line
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
                // tslint:disable-next-line: one-line
                else {
                    // Only one area > flex-basis 100%
                    if (this.displayedAreas.length === 1) {
                        area.component.setStyleFlex(0, 0, `100%`, false, false);
                    }
                    // Multiple areas > use each pixel basis
                    // tslint:disable-next-line: one-line
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
            // tslint:disable-next-line: one-line
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
                sizePercentAtStart: (this.unit === 'percent' ? area.size : -1),
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
            }
            else if (Math.abs(areasBefore.remain) > Math.abs(areasAfter.remain)) {
                areasAfter = getGutterSideAbsorptionCapacity(this.unit, this.snapshot.areasAfterGutter, steppedOffset + areasBefore.remain, this.snapshot.allAreasSizePixel);
            }
            else {
                areasBefore = getGutterSideAbsorptionCapacity(this.unit, this.snapshot.areasBeforeGutter, -(steppedOffset - areasAfter.remain), this.snapshot.allAreasSizePixel);
            }
        }
        // Areas before gutter can't absorbs all offset > need to recalculate sizes for areas after gutter.
        // tslint:disable-next-line: one-line
        else if (areasBefore.remain !== 0) {
            areasAfter = getGutterSideAbsorptionCapacity(this.unit, this.snapshot.areasAfterGutter, steppedOffset + areasBefore.remain, this.snapshot.allAreasSizePixel);
        }
        // Areas after gutter can't absorbs all offset > need to recalculate sizes for areas before gutter.
        // tslint:disable-next-line: one-line
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
MtxSplitComponent.decorators = [
    { type: Component, args: [{
                selector: 'mtx-split',
                exportAs: 'mtxSplit',
                host: {
                    class: 'mtx-split',
                },
                encapsulation: ViewEncapsulation.None,
                changeDetection: ChangeDetectionStrategy.OnPush,
                template: "<ng-content></ng-content>\r\n<ng-template ngFor [ngForOf]=\"displayedAreas\" let-index=\"index\" let-last=\"last\">\r\n  <div #gutterEls class=\"mtx-split-gutter\"\r\n       *ngIf=\"last === false\"\r\n       [style.flex-basis.px]=\"gutterSize\"\r\n       [style.order]=\"index * 2 + 1\"\r\n       (mousedown)=\"startDragging($event, index * 2 + 1, index + 1)\"\r\n       (touchstart)=\"startDragging($event, index * 2 + 1, index + 1)\"\r\n       (mouseup)=\"clickGutter($event, index + 1)\"\r\n       (touchend)=\"clickGutter($event, index + 1)\">\r\n    <div class=\"mtx-split-gutter-handle\"></div>\r\n  </div>\r\n</ng-template>\r\n",
                styles: [".mtx-split{display:flex;flex-wrap:nowrap;justify-content:flex-start;align-items:stretch;overflow:hidden;width:100%;height:100%}.mtx-split>.mtx-split-gutter{position:relative;display:flex;flex-grow:0;flex-shrink:0;align-items:center;justify-content:center}.mtx-split>.mtx-split-gutter>.mtx-split-gutter-handle{position:absolute;opacity:0}.mtx-split>.mtx-split-pane{flex-grow:0;flex-shrink:0;overflow-x:hidden;overflow-y:auto}.mtx-split>.mtx-split-pane.mtx-split-pane-hidden{flex:0 1 0!important;overflow-x:hidden;overflow-y:hidden}.mtx-split.mtx-split-horizontal{flex-direction:row}.mtx-split.mtx-split-horizontal>.mtx-split-gutter{flex-direction:row;height:100%;cursor:col-resize}.mtx-split.mtx-split-horizontal>.mtx-split-gutter>.mtx-split-gutter-handle{width:11px;height:100%;left:-5px;right:5px}.mtx-split.mtx-split-horizontal>.mtx-split-pane{height:100%}.mtx-split.mtx-split-vertical{flex-direction:column}.mtx-split.mtx-split-vertical>.mtx-split-gutter{flex-direction:column;width:100%;cursor:row-resize}.mtx-split.mtx-split-vertical>.mtx-split-gutter>.mtx-split-gutter-handle{width:100%;height:11px;top:-5px;bottom:5px}.mtx-split.mtx-split-vertical>.mtx-split-pane{width:100%}.mtx-split.mtx-split-vertical>.mtx-split-pane.mtx-split-pane-hidden{max-width:0}.mtx-split.mtx-split-disabled>.mtx-split-gutter{cursor:default}.mtx-split.mtx-split-disabled>.mtx-split-gutter .mtx-split-gutter-handle{background-image:none}.mtx-split.mtx-split-transition.mtx-split-init:not(.mtx-dragging)>.mtx-split-gutter,.mtx-split.mtx-split-transition.mtx-split-init:not(.mtx-dragging)>.mtx-split-pane{transition:flex-basis .3s}"]
            },] }
];
/** @nocollapse */
MtxSplitComponent.ctorParameters = () => [
    { type: NgZone },
    { type: ElementRef },
    { type: ChangeDetectorRef },
    { type: Renderer2 }
];
MtxSplitComponent.propDecorators = {
    direction: [{ type: Input }],
    unit: [{ type: Input }],
    gutterSize: [{ type: Input }],
    gutterStep: [{ type: Input }],
    restrictMove: [{ type: Input }],
    useTransition: [{ type: Input }],
    disabled: [{ type: Input }],
    dir: [{ type: Input }],
    gutterDblClickDuration: [{ type: Input }],
    dragStart: [{ type: Output }],
    dragEnd: [{ type: Output }],
    gutterClick: [{ type: Output }],
    gutterDblClick: [{ type: Output }],
    transitionEnd: [{ type: Output }],
    gutterEls: [{ type: ViewChildren, args: ['gutterEls',] }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3BsaXQuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vcHJvamVjdHMvZXh0ZW5zaW9ucy9zcGxpdC1wYW5lL3NwbGl0LmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQ0wsU0FBUyxFQUNULEtBQUssRUFDTCxNQUFNLEVBQ04sdUJBQXVCLEVBQ3ZCLGlCQUFpQixFQUNqQixTQUFTLEVBR1QsVUFBVSxFQUNWLE1BQU0sRUFDTixZQUFZLEVBQ1osU0FBUyxFQUNULFlBQVksRUFDWixpQkFBaUIsR0FDbEIsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFFLFVBQVUsRUFBYyxPQUFPLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDdkQsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBVzlDLE9BQU8sRUFDTCxzQkFBc0IsRUFDdEIsZUFBZSxFQUNmLGdCQUFnQixFQUNoQixjQUFjLEVBQ2QsY0FBYyxFQUNkLGlCQUFpQixFQUNqQixtQkFBbUIsRUFDbkIsK0JBQStCLEVBQy9CLGNBQWMsR0FDZixNQUFNLFNBQVMsQ0FBQztBQUVqQjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQTRCRztBQWFILE1BQU0sT0FBTyxpQkFBaUI7SUF5SzVCLFlBQ1UsTUFBYyxFQUNkLEtBQWlCLEVBQ2pCLEtBQXdCLEVBQ3hCLFFBQW1CO1FBSG5CLFdBQU0sR0FBTixNQUFNLENBQVE7UUFDZCxVQUFLLEdBQUwsS0FBSyxDQUFZO1FBQ2pCLFVBQUssR0FBTCxLQUFLLENBQW1CO1FBQ3hCLGFBQVEsR0FBUixRQUFRLENBQVc7UUE1S3JCLGVBQVUsR0FBOEIsWUFBWSxDQUFDO1FBa0I3RCxJQUFJO1FBRUksVUFBSyxHQUF3QixTQUFTLENBQUM7UUFrQi9DLElBQUk7UUFFSSxnQkFBVyxHQUFHLENBQUMsQ0FBQztRQVl4QixJQUFJO1FBRUksZ0JBQVcsR0FBRyxDQUFDLENB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ZUFBZSxFQUFFLHVCQUF1QixDQUFDLE1BQU07Z0JBRS9DLHVvQkFBcUM7O2FBQ3RDOzs7O1lBdEVDLE1BQU07WUFETixVQUFVO1lBSlYsaUJBQWlCO1lBQ2pCLFNBQVM7Ozt3QkE4RVIsS0FBSzttQkFvQkwsS0FBSzt5QkFvQkwsS0FBSzt5QkFjTCxLQUFLOzJCQVlMLEtBQUs7NEJBWUwsS0FBSzt1QkFrQkwsS0FBSztrQkFrQkwsS0FBSztxQ0FjTCxLQUFLO3dCQVVMLE1BQU07c0JBQ04sTUFBTTswQkFDTixNQUFNOzZCQUNOLE1BQU07NEJBR04sTUFBTTt3QkFvQk4sWUFBWSxTQUFDLFdBQVciLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xyXG4gIENvbXBvbmVudCxcclxuICBJbnB1dCxcclxuICBPdXRwdXQsXHJcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXHJcbiAgQ2hhbmdlRGV0ZWN0b3JSZWYsXHJcbiAgUmVuZGVyZXIyLFxyXG4gIEFmdGVyVmlld0luaXQsXHJcbiAgT25EZXN0cm95LFxyXG4gIEVsZW1lbnRSZWYsXHJcbiAgTmdab25lLFxyXG4gIFZpZXdDaGlsZHJlbixcclxuICBRdWVyeUxpc3QsXHJcbiAgRXZlbnRFbWl0dGVyLFxyXG4gIFZpZXdFbmNhcHN1bGF0aW9uLFxyXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBPYnNlcnZhYmxlLCBTdWJzY3JpYmVyLCBTdWJqZWN0IH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7IGRlYm91bmNlVGltZSB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcclxuXHJcbmltcG9ydCB7XHJcbiAgTXR4U3BsaXRBcmVhLFxyXG4gIE10eFNwbGl0UG9pbnQsXHJcbiAgTXR4U3BsaXRTbmFwc2hvdCxcclxuICBNdHhTcGxpdEFyZWFTbmFwc2hvdCxcclxuICBNdHhTcGxpdE91dHB1dERhdGEsXHJcbiAgTXR4U3BsaXRPdXRwdXRBcmVhU2l6ZXMsXHJcbn0gZnJvbSAnLi9pbnRlcmZhY2UnO1xyXG5pbXBvcnQgeyBNdHhTcGxpdFBhbmVEaXJlY3RpdmUgfSBmcm9tICcuL3NwbGl0LXBhbmUuZGlyZWN0aXZlJztcclxuaW1wb3J0IHtcclxuICBnZXRJbnB1dFBvc2l0aXZlTnVtYmVyLFxyXG4gIGdldElucHV0Qm9vbGVhbixcclxuICBpc1VzZXJTaXplc1ZhbGlkLFxyXG4gIGdldEFyZWFNaW5TaXplLFxyXG4gIGdldEFyZWFNYXhTaXplLFxyXG4gIGdldFBvaW50RnJvbUV2ZW50LFxyXG4gIGdldEVsZW1lbnRQaXhlbFNpemUsXHJcbiAgZ2V0R3V0dGVyU2lkZUFic29ycHRpb25DYXBhY2l0eSxcclxuICB1cGRhdGVBcmVhU2l6ZSxcclxufSBmcm9tICcuL3V0aWxzJztcclxuXHJcbi8qKlxyXG4gKiBtdHgtc3BsaXRcclxuICpcclxuICpcclxuICogIFBFUkNFTlQgTU9ERSAoW3VuaXRdPVwiJ3BlcmNlbnQnXCIpXHJcbiAqICBfX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fXHJcbiAqIHwgICAgICAgQSAgICAgICBbZzFdICAgICAgIEIgICAgICAgW2cyXSAgICAgICBDICAgICAgIFtnM10gICAgICAgRCAgICAgICBbZzRdICAgICAgIEUgICAgICAgfFxyXG4gKiB8LS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLXxcclxuICogfCAgICAgICAyMCAgICAgICAgICAgICAgICAgMzAgICAgICAgICAgICAgICAgIDIwICAgICAgICAgICAgICAgICAxNSAgICAgICAgICAgICAgICAgMTUgICAgICB8IDwtLSBbc2l6ZV09XCJ4XCJcclxuICogfCAgICAgICAgICAgICAgIDEwcHggICAgICAgICAgICAgICAxMHB4ICAgICAgICAgICAgICAgMTBweCAgICAgICAgICAgICAgIDEwcHggICAgICAgICAgICAgICB8IDwtLSBbZ3V0dGVyU2l6ZV09XCIxMFwiXHJcbiAqIHxjYWxjKDIwJSAtIDhweCkgICAgY2FsYygzMCUgLSAxMnB4KSAgIGNhbGMoMjAlIC0gOHB4KSAgICBjYWxjKDE1JSAtIDZweCkgICAgY2FsYygxNSUgLSA2cHgpfCA8LS0gQ1NTIGZsZXgtYmFzaXMgcHJvcGVydHkgKHdpdGggZmxleC1ncm93JnNocmluayBhdCAwKVxyXG4gKiB8ICAgICAxNTJweCAgICAgICAgICAgICAgMjI4cHggICAgICAgICAgICAgIDE1MnB4ICAgICAgICAgICAgICAxMTRweCAgICAgICAgICAgICAgMTE0cHggICAgIHwgPC0tIGVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLndpZHRoXHJcbiAqIHxfX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19ffFxyXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDgwMHB4ICAgICAgICAgPC0tIGVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLndpZHRoXHJcbiAqICBmbGV4LWJhc2lzID0gY2FsYyggeyBhcmVhLnNpemUgfSUgLSB7IGFyZWEuc2l6ZS8xMDAgKiBuYkd1dHRlcipndXR0ZXJTaXplIH1weCApO1xyXG4gKlxyXG4gKlxyXG4gKiAgUElYRUwgTU9ERSAoW3VuaXRdPVwiJ3BpeGVsJ1wiKVxyXG4gKiAgX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX1xyXG4gKiB8ICAgICAgIEEgICAgICAgW2cxXSAgICAgICBCICAgICAgIFtnMl0gICAgICAgQyAgICAgICBbZzNdICAgICAgIEQgICAgICAgW2c0XSAgICAgICBFICAgICAgIHxcclxuICogfC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS18XHJcbiAqIHwgICAgICAxMDAgICAgICAgICAgICAgICAgMjUwICAgICAgICAgICAgICAgICAqICAgICAgICAgICAgICAgICAxNTAgICAgICAgICAgICAgICAgMTAwICAgICAgfCA8LS0gW3NpemVdPVwieVwiXHJcbiAqIHwgICAgICAgICAgICAgICAxMHB4ICAgICAgICAgICAgICAgMTBweCAgICAgICAgICAgICAgIDEwcHggICAgICAgICAgICAgICAxMHB4ICAgICAgICAgICAgICAgfCA8LS0gW2d1dHRlclNpemVdPVwiMTBcIlxyXG4gKiB8ICAgMCAwIDEwMHB4ICAgICAgICAgIDAgMCAyNTBweCAgICAgICAgICAgMSAxIGF1dG8gICAgICAgICAgMCAwIDE1MHB4ICAgICAgICAgIDAgMCAxMDBweCAgIHwgPC0tIENTUyBmbGV4IHByb3BlcnR5IChmbGV4LWdyb3cvZmxleC1zaHJpbmsvZmxleC1iYXNpcylcclxuICogfCAgICAgMTAwcHggICAgICAgICAgICAgIDI1MHB4ICAgICAgICAgICAgICAyMDBweCAgICAgICAgICAgICAgMTUwcHggICAgICAgICAgICAgIDEwMHB4ICAgICB8IDwtLSBlbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS53aWR0aFxyXG4gKiB8X19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX3xcclxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA4MDBweCAgICAgICAgIDwtLSBlbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS53aWR0aFxyXG4gKlxyXG4gKi9cclxuXHJcbkBDb21wb25lbnQoe1xyXG4gIHNlbGVjdG9yOiAnbXR4LXNwbGl0JyxcclxuICBleHBvcnRBczogJ210eFNwbGl0JyxcclxuICBob3N0OiB7XHJcbiAgICBjbGFzczogJ210eC1zcGxpdCcsXHJcbiAgfSxcclxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxyXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxyXG4gIHN0eWxlVXJsczogW2AuL3NwbGl0LmNvbXBvbmVudC5zY3NzYF0sXHJcbiAgdGVtcGxhdGVVcmw6ICcuL3NwbGl0LmNvbXBvbmVudC5odG1sJyxcclxufSlcclxuZXhwb3J0IGNsYXNzIE10eFNwbGl0Q29tcG9uZW50IGltcGxlbWVudHMgQWZ0ZXJWaWV3SW5pdCwgT25EZXN0cm95IHtcclxuICBwcml2YXRlIF9kaXJlY3Rpb246ICdob3Jpem9udGFsJyB8ICd2ZXJ0aWNhbCcgPSAnaG9yaXpvbnRhbCc7XHJcblxyXG4gIEBJbnB1dCgpIHNldCBkaXJlY3Rpb24odjogJ2hvcml6b250YWwnIHwgJ3ZlcnRpY2FsJykge1xyXG4gICAgdGhpcy5fZGlyZWN0aW9uID0gdiA9PT0gJ3ZlcnRpY2FsJyA/ICd2ZXJ0aWNhbCcgOiAnaG9yaXpvbnRhbCc7XHJcblxyXG4gICAgdGhpcy5yZW5kZXJlci5hZGRDbGFzcyh0aGlzLmVsUmVmLm5hdGl2ZUVsZW1lbnQsIGBtdHgtc3BsaXQtJHt0aGlzLl9kaXJlY3Rpb259YCk7XHJcbiAgICB0aGlzLnJlbmRlcmVyLnJlbW92ZUNsYXNzKFxyXG4gICAgICB0aGlzLmVsUmVmLm5hdGl2ZUVsZW1lbnQsXHJcbiAgICAgIGBtdHgtc3BsaXQtJHt0aGlzLl9kaXJlY3Rpb24gPT09ICd2ZXJ0aWNhbCcgPyAnaG9yaXpvbnRhbCcgOiAndmVydGljYWwnfWBcclxuICAgICk7XHJcblxyXG4gICAgdGhpcy5idWlsZChmYWxzZSwgZmFsc2UpO1xyXG4gIH1cclxuXHJcbiAgZ2V0IGRpcmVjdGlvbigpOiAnaG9yaXpvbnRhbCcgfCAndmVydGljYWwnIHtcclxuICAgIHJldHVybiB0aGlzLl9kaXJlY3Rpb247XHJcbiAgfVxyXG5cclxuICAvLy8vXHJcblxyXG4gIHByaXZhdGUgX3VuaXQ6ICdwZXJjZW50JyB8ICdwaXhlbCcgPSAncGVyY2VudCc7XHJcblxyXG4gIEBJbnB1dCgpIHNldCB1bml0KHY6ICdwZXJjZW50JyB8ICdwaXhlbCcpIHtcclxuICAgIHRoaXMuX3VuaXQgPSB2ID09PSAncGl4ZWwnID8gJ3BpeGVsJyA6ICdwZXJjZW50JztcclxuXHJcbiAgICB0aGlzLnJlbmRlcmVyLmFkZENsYXNzKHRoaXMuZWxSZWYubmF0aXZlRWxlbWVudCwgYG10eC1zcGxpdC0ke3RoaXMuX3VuaXR9YCk7XHJcbiAgICB0aGlzLnJlbmRlcmVyLnJlbW92ZUNsYXNzKFxyXG4gICAgICB0aGlzLmVsUmVmLm5hdGl2ZUVsZW1lbnQsXHJcbiAgICAgIGBtdHgtc3BsaXQtJHt0aGlzLl91bml0ID09PSAncGl4ZWwnID8gJ3BlcmNlbnQnIDogJ3BpeGVsJ31gXHJcbiAgICApO1xyXG5cclxuICAgIHRoaXMuYnVpbGQoZmFsc2UsIHRydWUpO1xyXG4gIH1cclxuXHJcbiAgZ2V0IHVuaXQoKTogJ3BlcmNlbnQnIHwgJ3BpeGVsJyB7XHJcbiAgICByZXR1cm4gdGhpcy5fdW5pdDtcclxuICB9XHJcblxyXG4gIC8vLy9cclxuXHJcbiAgcHJpdmF0ZSBfZ3V0dGVyU2l6ZSA9IDE7XHJcblxyXG4gIEBJbnB1dCgpIHNldCBndXR0ZXJTaXplKHY6IG51bWJlcikge1xyXG4gICAgdGhpcy5fZ3V0dGVyU2l6ZSA9IGdldElucHV0UG9zaXRpdmVOdW1iZXIodiwgMTEpO1xyXG5cclxuICAgIHRoaXMuYnVpbGQoZmFsc2UsIGZhbHNlKTtcclxuICB9XHJcblxyXG4gIGdldCBndXR0ZXJTaXplKCk6IG51bWJlciB7XHJcbiAgICByZXR1cm4gdGhpcy5fZ3V0dGVyU2l6ZTtcclxuICB9XHJcblxyXG4gIC8vLy9cclxuXHJcbiAgcHJpdmF0ZSBfZ3V0dGVyU3RlcCA9IDE7XHJcblxyXG4gIEBJbnB1dCgpIHNldCBndXR0ZXJTdGVwKHY6IG51bWJlcikge1xyXG4gICAgdGhpcy5fZ3V0dGVyU3RlcCA9IGdldElucHV0UG9zaXRpdmVOdW1iZXIodiwgMSk7XHJcbiAgfVxyXG5cclxuICBnZXQgZ3V0dGVyU3RlcCgpOiBudW1iZXIge1xyXG4gICAgcmV0dXJuIHRoaXMuX2d1dHRlclN0ZXA7XHJcbiAgfVxyXG5cclxuICAvLy8vXHJcblxyXG4gIHByaXZhdGUgX3Jlc3RyaWN0TW92ZSA9IGZhbHNlO1xyXG5cclxuICBASW5wdXQoKSBzZXQgcmVzdHJpY3RNb3ZlKHY6IGJvb2xlYW4pIHtcclxuICAgIHRoaXMuX3Jlc3RyaWN0TW92ZSA9IGdldElucHV0Qm9vbGVhbih2KTtcclxuICB9XHJcblxyXG4gIGdldCByZXN0cmljdE1vdmUoKTogYm9vbGVhbiB7XHJcbiAgICByZXR1cm4gdGhpcy5fcmVzdHJpY3RNb3ZlO1xyXG4gIH1cclxuXHJcbiAgLy8vL1xyXG5cclxuICBwcml2YXRlIF91c2VUcmFuc2l0aW9uID0gZmFsc2U7XHJcblxyXG4gIEBJbnB1dCgpIHNldCB1c2VUcmFuc2l0aW9uKHY6IGJvb2xlYW4pIHtcclxuICAgIHRoaXMuX3VzZVRyYW5zaXRpb24gPSBnZXRJbnB1dEJvb2xlYW4odik7XHJcblxyXG4gICAgaWYgKHRoaXMuX3VzZVRyYW5zaXRpb24pIHtcclxuICAgICAgdGhpcy5yZW5kZXJlci5hZGRDbGFzcyh0aGlzLmVsUmVmLm5hdGl2ZUVsZW1lbnQsICdtdHgtc3BsaXQtdHJhbnNpdGlvbicpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5yZW5kZXJlci5yZW1vdmVDbGFzcyh0aGlzLmVsUmVmLm5hdGl2ZUVsZW1lbnQsICdtdHgtc3BsaXQtdHJhbnNpdGlvbicpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZ2V0IHVzZVRyYW5zaXRpb24oKTogYm9vbGVhbiB7XHJcbiAgICByZXR1cm4gdGhpcy5fdXNlVHJhbnNpdGlvbjtcclxuICB9XHJcblxyXG4gIC8vLy9cclxuXHJcbiAgcHJpdmF0ZSBfZGlzYWJsZWQgPSBmYWxzZTtcclxuXHJcbiAgQElucHV0KCkgc2V0IGRpc2FibGVkKHY6IGJvb2xlYW4pIHtcclxuICAgIHRoaXMuX2Rpc2FibGVkID0gZ2V0SW5wdXRCb29sZWFuKHYpO1xyXG5cclxuICAgIGlmICh0aGlzLl9kaXNhYmxlZCkge1xyXG4gICAgICB0aGlzLnJlbmRlcmVyLmFkZENsYXNzKHRoaXMuZWxSZWYubmF0aXZlRWxlbWVudCwgJ210eC1zcGxpdC1kaXNhYmxlZCcpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5yZW5kZXJlci5yZW1vdmVDbGFzcyh0aGlzLmVsUmVmLm5hdGl2ZUVsZW1lbnQsICdtdHgtc3BsaXQtZGlzYWJsZWQnKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGdldCBkaXNhYmxlZCgpOiBib29sZWFuIHtcclxuICAgIHJldHVybiB0aGlzLl9kaXNhYmxlZDtcclxuICB9XHJcblxyXG4gIC8vLy9cclxuXHJcbiAgcHJpdmF0ZSBfZGlyOiAnbHRyJyB8ICdydGwnID0gJ2x0cic7XHJcblxyXG4gIEBJbnB1dCgpIHNldCBkaXIodjogJ2x0cicgfCAncnRsJykge1xyXG4gICAgdGhpcy5fZGlyID0gdiA9PT0gJ3J0bCcgPyAncnRsJyA6ICdsdHInO1xyXG5cclxuICAgIHRoaXMucmVuZGVyZXIuc2V0QXR0cmlidXRlKHRoaXMuZWxSZWYubmF0aXZlRWxlbWVudCwgJ2RpcicsIHRoaXMuX2Rpcik7XHJcbiAgfVxyXG5cclxuICBnZXQgZGlyKCk6ICdsdHInIHwgJ3J0bCcge1xyXG4gICAgcmV0dXJuIHRoaXMuX2RpcjtcclxuICB9XHJcblxyXG4gIC8vLy9cclxuXHJcbiAgcHJpdmF0ZSBfZ3V0dGVyRGJsQ2xpY2tEdXJhdGlvbiA9IDA7XHJcblxyXG4gIEBJbnB1dCgpIHNldCBndXR0ZXJEYmxDbGlja0R1cmF0aW9uKHY6IG51bWJlcikge1xyXG4gICAgdGhpcy5fZ3V0dGVyRGJsQ2xpY2tEdXJhdGlvbiA9IGdldElucHV0UG9zaXRpdmVOdW1iZXIodiwgMCk7XHJcbiAgfVxyXG5cclxuICBnZXQgZ3V0dGVyRGJsQ2xpY2tEdXJhdGlvbigpOiBudW1iZXIge1xyXG4gICAgcmV0dXJuIHRoaXMuX2d1dHRlckRibENsaWNrRHVyYXRpb247XHJcbiAgfVxyXG5cclxuICAvLy8vXHJcblxyXG4gIEBPdXRwdXQoKSBkcmFnU3RhcnQgPSBuZXcgRXZlbnRFbWl0dGVyPE10eFNwbGl0T3V0cHV0RGF0YT4oZmFsc2UpO1xyXG4gIEBPdXRwdXQoKSBkcmFnRW5kID0gbmV3IEV2ZW50RW1pdHRlcjxNdHhTcGxpdE91dHB1dERhdGE+KGZhbHNlKTtcclxuICBAT3V0cHV0KCkgZ3V0dGVyQ2xpY2sgPSBuZXcgRXZlbnRFbWl0dGVyPE10eFNwbGl0T3V0cHV0RGF0YT4oZmFsc2UpO1xyXG4gIEBPdXRwdXQoKSBndXR0ZXJEYmxDbGljayA9IG5ldyBFdmVudEVtaXR0ZXI8TXR4U3BsaXRPdXRwdXREYXRhPihmYWxzZSk7XHJcblxyXG4gIHByaXZhdGUgdHJhbnNpdGlvbkVuZFN1YnNjcmliZXI6IFN1YnNjcmliZXI8TXR4U3BsaXRPdXRwdXRBcmVhU2l6ZXM+O1xyXG4gIEBPdXRwdXQoKSBnZXQgdHJhbnNpdGlvbkVuZCgpOiBPYnNlcnZhYmxlPE10eFNwbGl0T3V0cHV0QXJlYVNpemVzPiB7XHJcbiAgICByZXR1cm4gbmV3IE9ic2VydmFibGUoc3Vic2NyaWJlciA9PiAodGhpcy50cmFuc2l0aW9uRW5kU3Vic2NyaWJlciA9IHN1YnNjcmliZXIpKS5waXBlKFxyXG4gICAgICBkZWJvdW5jZVRpbWU8YW55PigyMClcclxuICAgICk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGRyYWdQcm9ncmVzc1N1YmplY3Q6IFN1YmplY3Q8TXR4U3BsaXRPdXRwdXREYXRhPiA9IG5ldyBTdWJqZWN0KCk7XHJcbiAgZHJhZ1Byb2dyZXNzJDogT2JzZXJ2YWJsZTxNdHhTcGxpdE91dHB1dERhdGE+ID0gdGhpcy5kcmFnUHJvZ3Jlc3NTdWJqZWN0LmFzT2JzZXJ2YWJsZSgpO1xyXG5cclxuICAvLy8vXHJcblxyXG4gIHByaXZhdGUgaXNEcmFnZ2luZyA9IGZhbHNlO1xyXG4gIHByaXZhdGUgZHJhZ0xpc3RlbmVyczogQXJyYXk8KCkgPT4gdm9pZD4gPSBbXTtcclxuICBwcml2YXRlIHNuYXBzaG90OiBNdHhTcGxpdFNuYXBzaG90IHwgbnVsbCA9IG51bGw7XHJcbiAgcHJpdmF0ZSBzdGFydFBvaW50OiBNdHhTcGxpdFBvaW50IHwgbnVsbCA9IG51bGw7XHJcbiAgcHJpdmF0ZSBlbmRQb2ludDogTXR4U3BsaXRQb2ludCB8IG51bGwgPSBudWxsO1xyXG5cclxuICBwdWJsaWMgcmVhZG9ubHkgZGlzcGxheWVkQXJlYXM6IEFycmF5PE10eFNwbGl0QXJlYT4gPSBbXTtcclxuICBwcml2YXRlIHJlYWRvbmx5IGhpZGVkQXJlYXM6IEFycmF5PE10eFNwbGl0QXJlYT4gPSBbXTtcclxuXHJcbiAgQFZpZXdDaGlsZHJlbignZ3V0dGVyRWxzJykgcHJpdmF0ZSBndXR0ZXJFbHM6IFF1ZXJ5TGlzdDxFbGVtZW50UmVmPjtcclxuXHJcbiAgY29uc3RydWN0b3IoXHJcbiAgICBwcml2YXRlIG5nWm9uZTogTmdab25lLFxyXG4gICAgcHJpdmF0ZSBlbFJlZjogRWxlbWVudFJlZixcclxuICAgIHByaXZhdGUgY2RSZWY6IENoYW5nZURldGVjdG9yUmVmLFxyXG4gICAgcHJpdmF0ZSByZW5kZXJlcjogUmVuZGVyZXIyXHJcbiAgKSB7XHJcbiAgICAvLyBUbyBmb3JjZSBhZGRpbmcgZGVmYXVsdCBjbGFzcywgY291bGQgYmUgb3ZlcnJpZGUgYnkgdXNlciBASW5wdXQoKSBvciBub3RcclxuICAgIHRoaXMuZGlyZWN0aW9uID0gdGhpcy5fZGlyZWN0aW9uO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcclxuICAgIHRoaXMubmdab25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcclxuICAgICAgLy8gVG8gYXZvaWQgdHJhbnNpdGlvbiBhdCBmaXJzdCByZW5kZXJpbmdcclxuICAgICAgc2V0VGltZW91dCgoKSA9PiB0aGlzLnJlbmRlcmVyLmFkZENsYXNzKHRoaXMuZWxSZWYubmF0aXZlRWxlbWVudCwgJ210eC1zcGxpdC1pbml0JykpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGdldE5iR3V0dGVycygpOiBudW1iZXIge1xyXG4gICAgcmV0dXJuIHRoaXMuZGlzcGxheWVkQXJlYXMubGVuZ3RoID09PSAwID8gMCA6IHRoaXMuZGlzcGxheWVkQXJlYXMubGVuZ3RoIC0gMTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBhZGRBcmVhKGNvbXBvbmVudDogTXR4U3BsaXRQYW5lRGlyZWN0aXZlKTogdm9pZCB7XHJcbiAgICBjb25zdCBuZXdBcmVhOiBNdHhTcGxpdEFyZWEgPSB7XHJcbiAgICAgIGNvbXBvbmVudCxcclxuICAgICAgb3JkZXI6IDAsXHJcbiAgICAgIHNpemU6IDAsXHJcbiAgICAgIG1pblNpemU6IG51bGwsXHJcbiAgICAgIG1heFNpemU6IG51bGwsXHJcbiAgICB9O1xyXG5cclxuICAgIGlmIChjb21wb25lbnQudmlzaWJsZSA9PT0gdHJ1ZSkge1xyXG4gICAgICB0aGlzLmRpc3BsYXllZEFyZWFzLnB1c2gobmV3QXJlYSk7XHJcblxyXG4gICAgICB0aGlzLmJ1aWxkKHRydWUsIHRydWUpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5oaWRlZEFyZWFzLnB1c2gobmV3QXJlYSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgcmVtb3ZlQXJlYShjb21wb25lbnQ6IE10eFNwbGl0UGFuZURpcmVjdGl2ZSk6IHZvaWQge1xyXG4gICAgaWYgKHRoaXMuZGlzcGxheWVkQXJlYXMuc29tZShhID0+IGEuY29tcG9uZW50ID09PSBjb21wb25lbnQpKSB7XHJcbiAgICAgIGNvbnN0IGFyZWEgPSB0aGlzLmRpc3BsYXllZEFyZWFzLmZpbmQoYSA9PiBhLmNvbXBvbmVudCA9PT0gY29tcG9uZW50KSBhcyBNdHhTcGxpdEFyZWE7XHJcbiAgICAgIHRoaXMuZGlzcGxheWVkQXJlYXMuc3BsaWNlKHRoaXMuZGlzcGxheWVkQXJlYXMuaW5kZXhPZihhcmVhKSwgMSk7XHJcblxyXG4gICAgICB0aGlzLmJ1aWxkKHRydWUsIHRydWUpO1xyXG4gICAgfSBlbHNlIGlmICh0aGlzLmhpZGVkQXJlYXMuc29tZShhID0+IGEuY29tcG9uZW50ID09PSBjb21wb25lbnQpKSB7XHJcbiAgICAgIGNvbnN0IGFyZWEgPSB0aGlzLmhpZGVkQXJlYXMuZmluZChhID0+IGEuY29tcG9uZW50ID09PSBjb21wb25lbnQpIGFzIE10eFNwbGl0QXJlYTtcclxuICAgICAgdGhpcy5oaWRlZEFyZWFzLnNwbGljZSh0aGlzLmhpZGVkQXJlYXMuaW5kZXhPZihhcmVhKSwgMSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgdXBkYXRlQXJlYShcclxuICAgIGNvbXBvbmVudDogTXR4U3BsaXRQYW5lRGlyZWN0aXZlLFxyXG4gICAgcmVzZXRPcmRlcnM6IGJvb2xlYW4sXHJcbiAgICByZXNldFNpemVzOiBib29sZWFuXHJcbiAgKTogdm9pZCB7XHJcbiAgICBpZiAoY29tcG9uZW50LnZpc2libGUgPT09IHRydWUpIHtcclxuICAgICAgdGhpcy5idWlsZChyZXNldE9yZGVycywgcmVzZXRTaXplcyk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgc2hvd0FyZWEoY29tcG9uZW50OiBNdHhTcGxpdFBhbmVEaXJlY3RpdmUpOiB2b2lkIHtcclxuICAgIGNvbnN0IGFyZWEgPSB0aGlzLmhpZGVkQXJlYXMuZmluZChhID0+IGEuY29tcG9uZW50ID09PSBjb21wb25lbnQpO1xyXG4gICAgaWYgKGFyZWEgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgYXJlYXMgPSB0aGlzLmhpZGVkQXJlYXMuc3BsaWNlKHRoaXMuaGlkZWRBcmVhcy5pbmRleE9mKGFyZWEpLCAxKTtcclxuICAgIHRoaXMuZGlzcGxheWVkQXJlYXMucHVzaCguLi5hcmVhcyk7XHJcblxyXG4gICAgdGhpcy5idWlsZCh0cnVlLCB0cnVlKTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBoaWRlQXJlYShjb21wOiBNdHhTcGxpdFBhbmVEaXJlY3RpdmUpOiB2b2lkIHtcclxuICAgIGNvbnN0IGFyZWEgPSB0aGlzLmRpc3BsYXllZEFyZWFzLmZpbmQoYSA9PiBhLmNvbXBvbmVudCA9PT0gY29tcCk7XHJcbiAgICBpZiAoYXJlYSA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBhcmVhcyA9IHRoaXMuZGlzcGxheWVkQXJlYXMuc3BsaWNlKHRoaXMuZGlzcGxheWVkQXJlYXMuaW5kZXhPZihhcmVhKSwgMSk7XHJcbiAgICBhcmVhcy5mb3JFYWNoKF9hcmVhID0+IHtcclxuICAgICAgX2FyZWEub3JkZXIgPSAwO1xyXG4gICAgICBfYXJlYS5zaXplID0gMDtcclxuICAgIH0pO1xyXG4gICAgdGhpcy5oaWRlZEFyZWFzLnB1c2goLi4uYXJlYXMpO1xyXG5cclxuICAgIHRoaXMuYnVpbGQodHJ1ZSwgdHJ1ZSk7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgZ2V0VmlzaWJsZUFyZWFTaXplcygpOiBNdHhTcGxpdE91dHB1dEFyZWFTaXplcyB7XHJcbiAgICByZXR1cm4gdGhpcy5kaXNwbGF5ZWRBcmVhcy5tYXAoYSA9PiAoYS5zaXplID09PSBudWxsID8gJyonIDogYS5zaXplKSk7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgc2V0VmlzaWJsZUFyZWFTaXplcyhzaXplczogTXR4U3BsaXRPdXRwdXRBcmVhU2l6ZXMpOiBib29sZWFuIHtcclxuICAgIGlmIChzaXplcy5sZW5ndGggIT09IHRoaXMuZGlzcGxheWVkQXJlYXMubGVuZ3RoKSB7XHJcbiAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBmb3JtYXRlZFNpemVzID0gc2l6ZXMubWFwKHMgPT4gZ2V0SW5wdXRQb3NpdGl2ZU51bWJlcihzLCBudWxsKSkgYXMgbnVtYmVyW107XHJcbiAgICBjb25zdCBpc1ZhbGlkID0gaXNVc2VyU2l6ZXNWYWxpZCh0aGlzLnVuaXQsIGZvcm1hdGVkU2l6ZXMpO1xyXG5cclxuICAgIGlmIChpc1ZhbGlkID09PSBmYWxzZSkge1xyXG4gICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gQHRzLWlnbm9yZVxyXG4gICAgdGhpcy5kaXNwbGF5ZWRBcmVhcy5mb3JFYWNoKChhcmVhLCBpKSA9PiAoYXJlYS5jb21wb25lbnQuX3NpemUgPSBmb3JtYXRlZFNpemVzW2ldKSk7XHJcblxyXG4gICAgdGhpcy5idWlsZChmYWxzZSwgdHJ1ZSk7XHJcbiAgICByZXR1cm4gdHJ1ZTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgYnVpbGQocmVzZXRPcmRlcnM6IGJvb2xlYW4sIHJlc2V0U2l6ZXM6IGJvb2xlYW4pOiB2b2lkIHtcclxuICAgIHRoaXMuc3RvcERyYWdnaW5nKCk7XHJcblxyXG4gICAgLy8gwqQgQVJFQVMgT1JERVJcclxuXHJcbiAgICBpZiAocmVzZXRPcmRlcnMgPT09IHRydWUpIHtcclxuICAgICAgLy8gSWYgdXNlciBwcm92aWRlZCAnb3JkZXInIGZvciBlYWNoIGFyZWEsIHVzZSBpdCB0byBzb3J0IHRoZW0uXHJcbiAgICAgIGlmICh0aGlzLmRpc3BsYXllZEFyZWFzLmV2ZXJ5KGEgPT4gYS5jb21wb25lbnQub3JkZXIgIT09IG51bGwpKSB7XHJcbiAgICAgICAgdGhpcy5kaXNwbGF5ZWRBcmVhcy5zb3J0KFxyXG4gICAgICAgICAgKGEsIGIpID0+ICgoYS5jb21wb25lbnQub3JkZXIgYXMgbnVtYmVyKSAtIChiLmNvbXBvbmVudC5vcmRlciBhcyBudW1iZXIpKSBhcyBudW1iZXJcclxuICAgICAgICApO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBUaGVuIHNldCByZWFsIG9yZGVyIHdpdGggbXVsdGlwbGVzIG9mIDIsIG51bWJlcnMgYmV0d2VlbiB3aWxsIGJlIHVzZWQgYnkgZ3V0dGVycy5cclxuICAgICAgdGhpcy5kaXNwbGF5ZWRBcmVhcy5mb3JFYWNoKChhcmVhLCBpKSA9PiB7XHJcbiAgICAgICAgYXJlYS5vcmRlciA9IGkgKiAyO1xyXG4gICAgICAgIGFyZWEuY29tcG9uZW50LnNldFN0eWxlT3JkZXIoYXJlYS5vcmRlcik7XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIMKkIEFSRUFTIFNJWkVcclxuXHJcbiAgICBpZiAocmVzZXRTaXplcyA9PT0gdHJ1ZSkge1xyXG4gICAgICBjb25zdCB1c2VVc2VyU2l6ZXMgPSBpc1VzZXJTaXplc1ZhbGlkKFxyXG4gICAgICAgIHRoaXMudW5pdCxcclxuICAgICAgICB0aGlzLmRpc3BsYXllZEFyZWFzLm1hcChhID0+IGEuY29tcG9uZW50LnNpemUpIGFzIG51bWJlcltdXHJcbiAgICAgICk7XHJcblxyXG4gICAgICBzd2l0Y2ggKHRoaXMudW5pdCkge1xyXG4gICAgICAgIGNhc2UgJ3BlcmNlbnQnOiB7XHJcbiAgICAgICAgICBjb25zdCBkZWZhdWx0U2l6ZSA9IDEwMCAvIHRoaXMuZGlzcGxheWVkQXJlYXMubGVuZ3RoO1xyXG5cclxuICAgICAgICAgIHRoaXMuZGlzcGxheWVkQXJlYXMuZm9yRWFjaChhcmVhID0+IHtcclxuICAgICAgICAgICAgYXJlYS5zaXplID0gdXNlVXNlclNpemVzID8gKGFyZWEuY29tcG9uZW50LnNpemUgYXMgbnVtYmVyKSA6IGRlZmF1bHRTaXplO1xyXG4gICAgICAgICAgICBhcmVhLm1pblNpemUgPSBnZXRBcmVhTWluU2l6ZShhcmVhKTtcclxuICAgICAgICAgICAgYXJlYS5tYXhTaXplID0gZ2V0QXJlYU1heFNpemUoYXJlYSk7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjYXNlICdwaXhlbCc6IHtcclxuICAgICAgICAgIGlmICh1c2VVc2VyU2l6ZXMpIHtcclxuICAgICAgICAgICAgdGhpcy5kaXNwbGF5ZWRBcmVhcy5mb3JFYWNoKGFyZWEgPT4ge1xyXG4gICAgICAgICAgICAgIGFyZWEuc2l6ZSA9IGFyZWEuY29tcG9uZW50LnNpemU7XHJcbiAgICAgICAgICAgICAgYXJlYS5taW5TaXplID0gZ2V0QXJlYU1pblNpemUoYXJlYSk7XHJcbiAgICAgICAgICAgICAgYXJlYS5tYXhTaXplID0gZ2V0QXJlYU1heFNpemUoYXJlYSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY29uc3Qgd2lsZGNhcmRTaXplQXJlYXMgPSB0aGlzLmRpc3BsYXllZEFyZWFzLmZpbHRlcihhID0+IGEuY29tcG9uZW50LnNpemUgPT09IG51bGwpO1xyXG5cclxuICAgICAgICAgICAgLy8gTm8gd2lsZGNhcmQgYXJlYSA+IE5lZWQgdG8gc2VsZWN0IG9uZSBhcmJpdHJhcmlseSA+IGZpcnN0XHJcbiAgICAgICAgICAgIGlmICh3aWxkY2FyZFNpemVBcmVhcy5sZW5ndGggPT09IDAgJiYgdGhpcy5kaXNwbGF5ZWRBcmVhcy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgdGhpcy5kaXNwbGF5ZWRBcmVhcy5mb3JFYWNoKChhcmVhLCBpKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBhcmVhLnNpemUgPSBpID09PSAwID8gbnVsbCA6IGFyZWEuY29tcG9uZW50LnNpemU7XHJcbiAgICAgICAgICAgICAgICBhcmVhLm1pblNpemUgPSBpID09PSAwID8gbnVsbCA6IGdldEFyZWFNaW5TaXplKGFyZWEpO1xyXG4gICAgICAgICAgICAgICAgYXJlYS5tYXhTaXplID0gaSA9PT0gMCA/IG51bGwgOiBnZXRBcmVhTWF4U2l6ZShhcmVhKTtcclxuICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvLyBNb3JlIHRoYW4gb25lIHdpbGRjYXJkIGFyZWEgPiBOZWVkIHRvIGtlZXAgb25seSBvbmUgYXJiaXRyYXJseSA+IGZpcnN0XHJcbiAgICAgICAgICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTogb25lLWxpbmVcclxuICAgICAgICAgICAgZWxzZSBpZiAod2lsZGNhcmRTaXplQXJlYXMubGVuZ3RoID4gMSkge1xyXG4gICAgICAgICAgICAgIGxldCBhbHJlYWR5R290T25lID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgdGhpcy5kaXNwbGF5ZWRBcmVhcy5mb3JFYWNoKGFyZWEgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKGFyZWEuY29tcG9uZW50LnNpemUgPT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgICAgaWYgKGFscmVhZHlHb3RPbmUgPT09IGZhbHNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYXJlYS5zaXplID0gbnVsbDtcclxuICAgICAgICAgICAgICAgICAgICBhcmVhLm1pblNpemUgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgICAgIGFyZWEubWF4U2l6ZSA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICAgICAgYWxyZWFkeUdvdE9uZSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYXJlYS5zaXplID0gMTAwO1xyXG4gICAgICAgICAgICAgICAgICAgIGFyZWEubWluU2l6ZSA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICAgICAgYXJlYS5tYXhTaXplID0gbnVsbDtcclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgYXJlYS5zaXplID0gYXJlYS5jb21wb25lbnQuc2l6ZTtcclxuICAgICAgICAgICAgICAgICAgYXJlYS5taW5TaXplID0gZ2V0QXJlYU1pblNpemUoYXJlYSk7XHJcbiAgICAgICAgICAgICAgICAgIGFyZWEubWF4U2l6ZSA9IGdldEFyZWFNYXhTaXplKGFyZWEpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB0aGlzLnJlZnJlc2hTdHlsZVNpemVzKCk7XHJcbiAgICB0aGlzLmNkUmVmLm1hcmtGb3JDaGVjaygpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSByZWZyZXNoU3R5bGVTaXplcygpOiB2b2lkIHtcclxuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAgIC8vIFBFUkNFTlQgTU9ERVxyXG4gICAgaWYgKHRoaXMudW5pdCA9PT0gJ3BlcmNlbnQnKSB7XHJcbiAgICAgIC8vIE9ubHkgb25lIGFyZWEgPiBmbGV4LWJhc2lzIDEwMCVcclxuICAgICAgaWYgKHRoaXMuZGlzcGxheWVkQXJlYXMubGVuZ3RoID09PSAxKSB7XHJcbiAgICAgICAgdGhpcy5kaXNwbGF5ZWRBcmVhc1swXS5jb21wb25lbnQuc2V0U3R5bGVGbGV4KDAsIDAsIGAxMDAlYCwgZmFsc2UsIGZhbHNlKTtcclxuICAgICAgfVxyXG4gICAgICAvLyBNdWx0aXBsZSBhcmVhcyA+IHVzZSBlYWNoIHBlcmNlbnQgYmFzaXNcclxuICAgICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOiBvbmUtbGluZVxyXG4gICAgICBlbHNlIHtcclxuICAgICAgICBjb25zdCBzdW1HdXR0ZXJTaXplID0gdGhpcy5nZXROYkd1dHRlcnMoKSAqIHRoaXMuZ3V0dGVyU2l6ZTtcclxuXHJcbiAgICAgICAgdGhpcy5kaXNwbGF5ZWRBcmVhcy5mb3JFYWNoKGFyZWEgPT4ge1xyXG4gICAgICAgICAgYXJlYS5jb21wb25lbnQuc2V0U3R5bGVGbGV4KFxyXG4gICAgICAgICAgICAwLFxyXG4gICAgICAgICAgICAwLFxyXG4gICAgICAgICAgICBgY2FsYyggJHthcmVhLnNpemV9JSAtICR7KChhcmVhLnNpemUgYXMgbnVtYmVyKSAvIDEwMCkgKiBzdW1HdXR0ZXJTaXplfXB4IClgLFxyXG4gICAgICAgICAgICBhcmVhLm1pblNpemUgIT09IG51bGwgJiYgYXJlYS5taW5TaXplID09PSBhcmVhLnNpemUgPyB0cnVlIDogZmFsc2UsXHJcbiAgICAgICAgICAgIGFyZWEubWF4U2l6ZSAhPT0gbnVsbCAmJiBhcmVhLm1heFNpemUgPT09IGFyZWEuc2l6ZSA/IHRydWUgOiBmYWxzZVxyXG4gICAgICAgICAgKTtcclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gICAgLy8gUElYRUwgTU9ERVxyXG4gICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOiBvbmUtbGluZVxyXG4gICAgZWxzZSBpZiAodGhpcy51bml0ID09PSAncGl4ZWwnKSB7XHJcbiAgICAgIHRoaXMuZGlzcGxheWVkQXJlYXMuZm9yRWFjaChhcmVhID0+IHtcclxuICAgICAgICAvLyBBcmVhIHdpdGggd2lsZGNhcmQgc2l6ZVxyXG4gICAgICAgIGlmIChhcmVhLnNpemUgPT09IG51bGwpIHtcclxuICAgICAgICAgIGlmICh0aGlzLmRpc3BsYXllZEFyZWFzLmxlbmd0aCA9PT0gMSkge1xyXG4gICAgICAgICAgICBhcmVhLmNvbXBvbmVudC5zZXRTdHlsZUZsZXgoMSwgMSwgYDEwMCVgLCBmYWxzZSwgZmFsc2UpO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgYXJlYS5jb21wb25lbnQuc2V0U3R5bGVGbGV4KDEsIDEsIGBhdXRvYCwgZmFsc2UsIGZhbHNlKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gQXJlYSB3aXRoIHBpeGVsIHNpemVcclxuICAgICAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6IG9uZS1saW5lXHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAvLyBPbmx5IG9uZSBhcmVhID4gZmxleC1iYXNpcyAxMDAlXHJcbiAgICAgICAgICBpZiAodGhpcy5kaXNwbGF5ZWRBcmVhcy5sZW5ndGggPT09IDEpIHtcclxuICAgICAgICAgICAgYXJlYS5jb21wb25lbnQuc2V0U3R5bGVGbGV4KDAsIDAsIGAxMDAlYCwgZmFsc2UsIGZhbHNlKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIC8vIE11bHRpcGxlIGFyZWFzID4gdXNlIGVhY2ggcGl4ZWwgYmFzaXNcclxuICAgICAgICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTogb25lLWxpbmVcclxuICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBhcmVhLmNvbXBvbmVudC5zZXRTdHlsZUZsZXgoXHJcbiAgICAgICAgICAgICAgMCxcclxuICAgICAgICAgICAgICAwLFxyXG4gICAgICAgICAgICAgIGAke2FyZWEuc2l6ZX1weGAsXHJcbiAgICAgICAgICAgICAgYXJlYS5taW5TaXplICE9PSBudWxsICYmIGFyZWEubWluU2l6ZSA9PT0gYXJlYS5zaXplID8gdHJ1ZSA6IGZhbHNlLFxyXG4gICAgICAgICAgICAgIGFyZWEubWF4U2l6ZSAhPT0gbnVsbCAmJiBhcmVhLm1heFNpemUgPT09IGFyZWEuc2l6ZSA/IHRydWUgOiBmYWxzZVxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBfY2xpY2tUaW1lb3V0OiBudW1iZXIgfCBudWxsID0gbnVsbDtcclxuXHJcbiAgcHVibGljIGNsaWNrR3V0dGVyKGV2ZW50OiBNb3VzZUV2ZW50IHwgVG91Y2hFdmVudCwgZ3V0dGVyTnVtOiBudW1iZXIpOiB2b2lkIHtcclxuICAgIGNvbnN0IHRlbXBQb2ludCA9IGdldFBvaW50RnJvbUV2ZW50KGV2ZW50KSBhcyBNdHhTcGxpdFBvaW50O1xyXG5cclxuICAgIC8vIEJlIHN1cmUgbW91c2V1cC90b3VjaGVuZCBoYXBwZW5lZCBhdCBzYW1lIHBvaW50IGFzIG1vdXNlZG93bi90b3VjaHN0YXJ0IHRvIHRyaWdnZXIgY2xpY2svZGJsY2xpY2tcclxuICAgIGlmICh0aGlzLnN0YXJ0UG9pbnQgJiYgdGhpcy5zdGFydFBvaW50LnggPT09IHRlbXBQb2ludC54ICYmIHRoaXMuc3RhcnRQb2ludC55ID09PSB0ZW1wUG9pbnQueSkge1xyXG4gICAgICAvLyBJZiB0aW1lb3V0IGluIHByb2dyZXNzIGFuZCBuZXcgY2xpY2sgPiBjbGVhclRpbWVvdXQgJiBkYmxDbGlja0V2ZW50XHJcbiAgICAgIGlmICh0aGlzLl9jbGlja1RpbWVvdXQgIT09IG51bGwpIHtcclxuICAgICAgICB3aW5kb3cuY2xlYXJUaW1lb3V0KHRoaXMuX2NsaWNrVGltZW91dCk7XHJcbiAgICAgICAgdGhpcy5fY2xpY2tUaW1lb3V0ID0gbnVsbDtcclxuICAgICAgICB0aGlzLm5vdGlmeSgnZGJsY2xpY2snLCBndXR0ZXJOdW0pO1xyXG4gICAgICAgIHRoaXMuc3RvcERyYWdnaW5nKCk7XHJcbiAgICAgIH1cclxuICAgICAgLy8gRWxzZSBzdGFydCB0aW1lb3V0IHRvIGNhbGwgY2xpY2tFdmVudCBhdCBlbmRcclxuICAgICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOiBvbmUtbGluZVxyXG4gICAgICBlbHNlIHtcclxuICAgICAgICB0aGlzLl9jbGlja1RpbWVvdXQgPSB3aW5kb3cuc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICB0aGlzLl9jbGlja1RpbWVvdXQgPSBudWxsO1xyXG4gICAgICAgICAgdGhpcy5ub3RpZnkoJ2NsaWNrJywgZ3V0dGVyTnVtKTtcclxuICAgICAgICAgIHRoaXMuc3RvcERyYWdnaW5nKCk7XHJcbiAgICAgICAgfSwgdGhpcy5ndXR0ZXJEYmxDbGlja0R1cmF0aW9uKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHVibGljIHN0YXJ0RHJhZ2dpbmcoXHJcbiAgICBldmVudDogTW91c2VFdmVudCB8IFRvdWNoRXZlbnQsXHJcbiAgICBndXR0ZXJPcmRlcjogbnVtYmVyLFxyXG4gICAgZ3V0dGVyTnVtOiBudW1iZXJcclxuICApOiB2b2lkIHtcclxuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuXHJcbiAgICB0aGlzLnN0YXJ0UG9pbnQgPSBnZXRQb2ludEZyb21FdmVudChldmVudCk7XHJcbiAgICBpZiAodGhpcy5zdGFydFBvaW50ID09PSBudWxsIHx8IHRoaXMuZGlzYWJsZWQgPT09IHRydWUpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuc25hcHNob3QgPSB7XHJcbiAgICAgIGd1dHRlck51bSxcclxuICAgICAgbGFzdFN0ZXBwZWRPZmZzZXQ6IDAsXHJcbiAgICAgIGFsbEFyZWFzU2l6ZVBpeGVsOlxyXG4gICAgICAgIGdldEVsZW1lbnRQaXhlbFNpemUodGhpcy5lbFJlZiwgdGhpcy5kaXJlY3Rpb24pIC0gdGhpcy5nZXROYkd1dHRlcnMoKSAqIHRoaXMuZ3V0dGVyU2l6ZSxcclxuICAgICAgYWxsSW52b2x2ZWRBcmVhc1NpemVQZXJjZW50OiAxMDAsXHJcbiAgICAgIGFyZWFzQmVmb3JlR3V0dGVyOiBbXSxcclxuICAgICAgYXJlYXNBZnRlckd1dHRlcjogW10sXHJcbiAgICB9O1xyXG5cclxuICAgIHRoaXMuZGlzcGxheWVkQXJlYXMuZm9yRWFjaChhcmVhID0+IHtcclxuICAgICAgY29uc3QgYXJlYVNuYXBzaG90OiBNdHhTcGxpdEFyZWFTbmFwc2hvdCA9IHtcclxuICAgICAgICBhcmVhLFxyXG4gICAgICAgIHNpemVQaXhlbEF0U3RhcnQ6IGdldEVsZW1lbnRQaXhlbFNpemUoYXJlYS5jb21wb25lbnQuZWxSZWYsIHRoaXMuZGlyZWN0aW9uKSxcclxuICAgICAgICBzaXplUGVyY2VudEF0U3RhcnQ6ICh0aGlzLnVuaXQgPT09ICdwZXJjZW50JyA/IGFyZWEuc2l6ZSA6IC0xKSBhcyBudW1iZXIsIC8vIElmIHBpeGVsIG1vZGUsIGFueXdheSwgd2lsbCBub3QgYmUgdXNlZC5cclxuICAgICAgfTtcclxuXHJcbiAgICAgIGlmIChhcmVhLm9yZGVyIDwgZ3V0dGVyT3JkZXIpIHtcclxuICAgICAgICBpZiAodGhpcy5yZXN0cmljdE1vdmUgPT09IHRydWUpIHtcclxuICAgICAgICAgICh0aGlzLnNuYXBzaG90IGFzIE10eFNwbGl0U25hcHNob3QpLmFyZWFzQmVmb3JlR3V0dGVyID0gW2FyZWFTbmFwc2hvdF07XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICh0aGlzLnNuYXBzaG90IGFzIE10eFNwbGl0U25hcHNob3QpLmFyZWFzQmVmb3JlR3V0dGVyLnVuc2hpZnQoYXJlYVNuYXBzaG90KTtcclxuICAgICAgICB9XHJcbiAgICAgIH0gZWxzZSBpZiAoYXJlYS5vcmRlciA+IGd1dHRlck9yZGVyKSB7XHJcbiAgICAgICAgaWYgKHRoaXMucmVzdHJpY3RNb3ZlID09PSB0cnVlKSB7XHJcbiAgICAgICAgICBpZiAoKHRoaXMuc25hcHNob3QgYXMgTXR4U3BsaXRTbmFwc2hvdCkuYXJlYXNBZnRlckd1dHRlci5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgKHRoaXMuc25hcHNob3QgYXMgTXR4U3BsaXRTbmFwc2hvdCkuYXJlYXNBZnRlckd1dHRlciA9IFthcmVhU25hcHNob3RdO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAodGhpcy5zbmFwc2hvdCBhcyBNdHhTcGxpdFNuYXBzaG90KS5hcmVhc0FmdGVyR3V0dGVyLnB1c2goYXJlYVNuYXBzaG90KTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIHRoaXMuc25hcHNob3QuYWxsSW52b2x2ZWRBcmVhc1NpemVQZXJjZW50ID0gW1xyXG4gICAgICAuLi50aGlzLnNuYXBzaG90LmFyZWFzQmVmb3JlR3V0dGVyLFxyXG4gICAgICAuLi50aGlzLnNuYXBzaG90LmFyZWFzQWZ0ZXJHdXR0ZXIsXHJcbiAgICBdLnJlZHVjZSgodCwgYSkgPT4gdCArIGEuc2l6ZVBlcmNlbnRBdFN0YXJ0LCAwKTtcclxuXHJcbiAgICBpZiAoXHJcbiAgICAgIHRoaXMuc25hcHNob3QuYXJlYXNCZWZvcmVHdXR0ZXIubGVuZ3RoID09PSAwIHx8XHJcbiAgICAgIHRoaXMuc25hcHNob3QuYXJlYXNBZnRlckd1dHRlci5sZW5ndGggPT09IDBcclxuICAgICkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5kcmFnTGlzdGVuZXJzLnB1c2goXHJcbiAgICAgIHRoaXMucmVuZGVyZXIubGlzdGVuKCdkb2N1bWVudCcsICdtb3VzZXVwJywgdGhpcy5zdG9wRHJhZ2dpbmcuYmluZCh0aGlzKSlcclxuICAgICk7XHJcbiAgICB0aGlzLmRyYWdMaXN0ZW5lcnMucHVzaChcclxuICAgICAgdGhpcy5yZW5kZXJlci5saXN0ZW4oJ2RvY3VtZW50JywgJ3RvdWNoZW5kJywgdGhpcy5zdG9wRHJhZ2dpbmcuYmluZCh0aGlzKSlcclxuICAgICk7XHJcbiAgICB0aGlzLmRyYWdMaXN0ZW5lcnMucHVzaChcclxuICAgICAgdGhpcy5yZW5kZXJlci5saXN0ZW4oJ2RvY3VtZW50JywgJ3RvdWNoY2FuY2VsJywgdGhpcy5zdG9wRHJhZ2dpbmcuYmluZCh0aGlzKSlcclxuICAgICk7XHJcblxyXG4gICAgdGhpcy5uZ1pvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xyXG4gICAgICB0aGlzLmRyYWdMaXN0ZW5lcnMucHVzaChcclxuICAgICAgICB0aGlzLnJlbmRlcmVyLmxpc3RlbignZG9jdW1lbnQnLCAnbW91c2Vtb3ZlJywgdGhpcy5kcmFnRXZlbnQuYmluZCh0aGlzKSlcclxuICAgICAgKTtcclxuICAgICAgdGhpcy5kcmFnTGlzdGVuZXJzLnB1c2goXHJcbiAgICAgICAgdGhpcy5yZW5kZXJlci5saXN0ZW4oJ2RvY3VtZW50JywgJ3RvdWNobW92ZScsIHRoaXMuZHJhZ0V2ZW50LmJpbmQodGhpcykpXHJcbiAgICAgICk7XHJcbiAgICB9KTtcclxuXHJcbiAgICB0aGlzLmRpc3BsYXllZEFyZWFzLmZvckVhY2goYXJlYSA9PiBhcmVhLmNvbXBvbmVudC5sb2NrRXZlbnRzKCkpO1xyXG5cclxuICAgIHRoaXMuaXNEcmFnZ2luZyA9IHRydWU7XHJcbiAgICB0aGlzLnJlbmRlcmVyLmFkZENsYXNzKHRoaXMuZWxSZWYubmF0aXZlRWxlbWVudCwgJ210eC1kcmFnZ2luZycpO1xyXG4gICAgdGhpcy5yZW5kZXJlci5hZGRDbGFzcyhcclxuICAgICAgdGhpcy5ndXR0ZXJFbHMudG9BcnJheSgpW3RoaXMuc25hcHNob3QuZ3V0dGVyTnVtIC0gMV0ubmF0aXZlRWxlbWVudCxcclxuICAgICAgJ210eC1kcmFnZ2VkJ1xyXG4gICAgKTtcclxuXHJcbiAgICB0aGlzLm5vdGlmeSgnc3RhcnQnLCB0aGlzLnNuYXBzaG90Lmd1dHRlck51bSk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGRyYWdFdmVudChldmVudDogTW91c2VFdmVudCB8IFRvdWNoRXZlbnQpOiB2b2lkIHtcclxuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuXHJcbiAgICBpZiAodGhpcy5fY2xpY2tUaW1lb3V0ICE9PSBudWxsKSB7XHJcbiAgICAgIHdpbmRvdy5jbGVhclRpbWVvdXQodGhpcy5fY2xpY2tUaW1lb3V0KTtcclxuICAgICAgdGhpcy5fY2xpY2tUaW1lb3V0ID0gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy5pc0RyYWdnaW5nID09PSBmYWxzZSkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5lbmRQb2ludCA9IGdldFBvaW50RnJvbUV2ZW50KGV2ZW50KTtcclxuICAgIGlmICh0aGlzLmVuZFBvaW50ID09PSBudWxsKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICAvLyBDYWxjdWxhdGUgc3RlcHBlZE9mZnNldFxyXG5cclxuICAgIGxldCBvZmZzZXQgPVxyXG4gICAgICB0aGlzLmRpcmVjdGlvbiA9PT0gJ2hvcml6b250YWwnXHJcbiAgICAgICAgPyAodGhpcy5zdGFydFBvaW50IGFzIE10eFNwbGl0UG9pbnQpLnggLSB0aGlzLmVuZFBvaW50LnhcclxuICAgICAgICA6ICh0aGlzLnN0YXJ0UG9pbnQgYXMgTXR4U3BsaXRQb2ludCkueSAtIHRoaXMuZW5kUG9pbnQueTtcclxuICAgIGlmICh0aGlzLmRpciA9PT0gJ3J0bCcpIHtcclxuICAgICAgb2Zmc2V0ID0gLW9mZnNldDtcclxuICAgIH1cclxuICAgIGNvbnN0IHN0ZXBwZWRPZmZzZXQgPSBNYXRoLnJvdW5kKG9mZnNldCAvIHRoaXMuZ3V0dGVyU3RlcCkgKiB0aGlzLmd1dHRlclN0ZXA7XHJcblxyXG4gICAgaWYgKHN0ZXBwZWRPZmZzZXQgPT09ICh0aGlzLnNuYXBzaG90IGFzIE10eFNwbGl0U25hcHNob3QpLmxhc3RTdGVwcGVkT2Zmc2V0KSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICAodGhpcy5zbmFwc2hvdCBhcyBNdHhTcGxpdFNuYXBzaG90KS5sYXN0U3RlcHBlZE9mZnNldCA9IHN0ZXBwZWRPZmZzZXQ7XHJcblxyXG4gICAgLy8gTmVlZCB0byBrbm93IGlmIGVhY2ggZ3V0dGVyIHNpZGUgYXJlYXMgY291bGQgcmVhY3RzIHRvIHN0ZXBwZWRPZmZzZXRcclxuXHJcbiAgICBsZXQgYXJlYXNCZWZvcmUgPSBnZXRHdXR0ZXJTaWRlQWJzb3JwdGlvbkNhcGFjaXR5KFxyXG4gICAgICB0aGlzLnVuaXQsXHJcbiAgICAgICh0aGlzLnNuYXBzaG90IGFzIE10eFNwbGl0U25hcHNob3QpLmFyZWFzQmVmb3JlR3V0dGVyLFxyXG4gICAgICAtc3RlcHBlZE9mZnNldCxcclxuICAgICAgKHRoaXMuc25hcHNob3QgYXMgTXR4U3BsaXRTbmFwc2hvdCkuYWxsQXJlYXNTaXplUGl4ZWxcclxuICAgICk7XHJcbiAgICBsZXQgYXJlYXNBZnRlciA9IGdldEd1dHRlclNpZGVBYnNvcnB0aW9uQ2FwYWNpdHkoXHJcbiAgICAgIHRoaXMudW5pdCxcclxuICAgICAgKHRoaXMuc25hcHNob3QgYXMgTXR4U3BsaXRTbmFwc2hvdCkuYXJlYXNBZnRlckd1dHRlcixcclxuICAgICAgc3RlcHBlZE9mZnNldCxcclxuICAgICAgKHRoaXMuc25hcHNob3QgYXMgTXR4U3BsaXRTbmFwc2hvdCkuYWxsQXJlYXNTaXplUGl4ZWxcclxuICAgICk7XHJcblxyXG4gICAgLy8gRWFjaCBndXR0ZXIgc2lkZSBhcmVhcyBjYW4ndCBhYnNvcmIgYWxsIG9mZnNldFxyXG4gICAgaWYgKGFyZWFzQmVmb3JlLnJlbWFpbiAhPT0gMCAmJiBhcmVhc0FmdGVyLnJlbWFpbiAhPT0gMCkge1xyXG4gICAgICBpZiAoTWF0aC5hYnMoYXJlYXNCZWZvcmUucmVtYWluKSA9PT0gTWF0aC5hYnMoYXJlYXNBZnRlci5yZW1haW4pKSB7XHJcbiAgICAgIH0gZWxzZSBpZiAoTWF0aC5hYnMoYXJlYXNCZWZvcmUucmVtYWluKSA+IE1hdGguYWJzKGFyZWFzQWZ0ZXIucmVtYWluKSkge1xyXG4gICAgICAgIGFyZWFzQWZ0ZXIgPSBnZXRHdXR0ZXJTaWRlQWJzb3JwdGlvbkNhcGFjaXR5KFxyXG4gICAgICAgICAgdGhpcy51bml0LFxyXG4gICAgICAgICAgKHRoaXMuc25hcHNob3QgYXMgTXR4U3BsaXRTbmFwc2hvdCkuYXJlYXNBZnRlckd1dHRlcixcclxuICAgICAgICAgIHN0ZXBwZWRPZmZzZXQgKyBhcmVhc0JlZm9yZS5yZW1haW4sXHJcbiAgICAgICAgICAodGhpcy5zbmFwc2hvdCBhcyBNdHhTcGxpdFNuYXBzaG90KS5hbGxBcmVhc1NpemVQaXhlbFxyXG4gICAgICAgICk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgYXJlYXNCZWZvcmUgPSBnZXRHdXR0ZXJTaWRlQWJzb3JwdGlvbkNhcGFjaXR5KFxyXG4gICAgICAgICAgdGhpcy51bml0LFxyXG4gICAgICAgICAgKHRoaXMuc25hcHNob3QgYXMgTXR4U3BsaXRTbmFwc2hvdCkuYXJlYXNCZWZvcmVHdXR0ZXIsXHJcbiAgICAgICAgICAtKHN0ZXBwZWRPZmZzZXQgLSBhcmVhc0FmdGVyLnJlbWFpbiksXHJcbiAgICAgICAgICAodGhpcy5zbmFwc2hvdCBhcyBNdHhTcGxpdFNuYXBzaG90KS5hbGxBcmVhc1NpemVQaXhlbFxyXG4gICAgICAgICk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIC8vIEFyZWFzIGJlZm9yZSBndXR0ZXIgY2FuJ3QgYWJzb3JicyBhbGwgb2Zmc2V0ID4gbmVlZCB0byByZWNhbGN1bGF0ZSBzaXplcyBmb3IgYXJlYXMgYWZ0ZXIgZ3V0dGVyLlxyXG4gICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOiBvbmUtbGluZVxyXG4gICAgZWxzZSBpZiAoYXJlYXNCZWZvcmUucmVtYWluICE9PSAwKSB7XHJcbiAgICAgIGFyZWFzQWZ0ZXIgPSBnZXRHdXR0ZXJTaWRlQWJzb3JwdGlvbkNhcGFjaXR5KFxyXG4gICAgICAgIHRoaXMudW5pdCxcclxuICAgICAgICAodGhpcy5zbmFwc2hvdCBhcyBNdHhTcGxpdFNuYXBzaG90KS5hcmVhc0FmdGVyR3V0dGVyLFxyXG4gICAgICAgIHN0ZXBwZWRPZmZzZXQgKyBhcmVhc0JlZm9yZS5yZW1haW4sXHJcbiAgICAgICAgKHRoaXMuc25hcHNob3QgYXMgTXR4U3BsaXRTbmFwc2hvdCkuYWxsQXJlYXNTaXplUGl4ZWxcclxuICAgICAgKTtcclxuICAgIH1cclxuICAgIC8vIEFyZWFzIGFmdGVyIGd1dHRlciBjYW4ndCBhYnNvcmJzIGFsbCBvZmZzZXQgPiBuZWVkIHRvIHJlY2FsY3VsYXRlIHNpemVzIGZvciBhcmVhcyBiZWZvcmUgZ3V0dGVyLlxyXG4gICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOiBvbmUtbGluZVxyXG4gICAgZWxzZSBpZiAoYXJlYXNBZnRlci5yZW1haW4gIT09IDApIHtcclxuICAgICAgYXJlYXNCZWZvcmUgPSBnZXRHdXR0ZXJTaWRlQWJzb3JwdGlvbkNhcGFjaXR5KFxyXG4gICAgICAgIHRoaXMudW5pdCxcclxuICAgICAgICAodGhpcy5zbmFwc2hvdCBhcyBNdHhTcGxpdFNuYXBzaG90KS5hcmVhc0JlZm9yZUd1dHRlcixcclxuICAgICAgICAtKHN0ZXBwZWRPZmZzZXQgLSBhcmVhc0FmdGVyLnJlbWFpbiksXHJcbiAgICAgICAgKHRoaXMuc25hcHNob3QgYXMgTXR4U3BsaXRTbmFwc2hvdCkuYWxsQXJlYXNTaXplUGl4ZWxcclxuICAgICAgKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy51bml0ID09PSAncGVyY2VudCcpIHtcclxuICAgICAgLy8gSGFjayBiZWNhdXNlIG9mIGJyb3dzZXIgbWVzc2luZyB1cCB3aXRoIHNpemVzIHVzaW5nIGNhbGMoWCUgLSBZcHgpIC0+IGVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXHJcbiAgICAgIC8vIElmIG5vdCB0aGVyZSwgcGxheWluZyB3aXRoIGd1dHRlcnMgbWFrZXMgdG90YWwgZ29pbmcgZG93biB0byA5OS45OTg3NSUgdGhlbiA5OS45OTI4NiUsIDk5Ljk4OTg2JSwuLlxyXG4gICAgICBjb25zdCBhbGwgPSBbLi4uYXJlYXNCZWZvcmUubGlzdCwgLi4uYXJlYXNBZnRlci5saXN0XTtcclxuICAgICAgY29uc3QgYXJlYVRvUmVzZXQgPSBhbGwuZmluZChcclxuICAgICAgICBhID0+XHJcbiAgICAgICAgICBhLnBlcmNlbnRBZnRlckFic29ycHRpb24gIT09IDAgJiZcclxuICAgICAgICAgIGEucGVyY2VudEFmdGVyQWJzb3JwdGlvbiAhPT0gYS5hcmVhU25hcHNob3QuYXJlYS5taW5TaXplICYmXHJcbiAgICAgICAgICBhLnBlcmNlbnRBZnRlckFic29ycHRpb24gIT09IGEuYXJlYVNuYXBzaG90LmFyZWEubWF4U2l6ZVxyXG4gICAgICApO1xyXG5cclxuICAgICAgaWYgKGFyZWFUb1Jlc2V0KSB7XHJcbiAgICAgICAgYXJlYVRvUmVzZXQucGVyY2VudEFmdGVyQWJzb3JwdGlvbiA9XHJcbiAgICAgICAgICAodGhpcy5zbmFwc2hvdCBhcyBNdHhTcGxpdFNuYXBzaG90KS5hbGxJbnZvbHZlZEFyZWFzU2l6ZVBlcmNlbnQgLVxyXG4gICAgICAgICAgYWxsXHJcbiAgICAgICAgICAgIC5maWx0ZXIoYSA9PiBhICE9PSBhcmVhVG9SZXNldClcclxuICAgICAgICAgICAgLnJlZHVjZSgodG90YWwsIGEpID0+IHRvdGFsICsgYS5wZXJjZW50QWZ0ZXJBYnNvcnB0aW9uLCAwKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vIE5vdyB3ZSBrbm93IGFyZWFzIGNvdWxkIGFic29yYiBzdGVwcGVkT2Zmc2V0LCB0aW1lIHRvIHJlYWxseSB1cGRhdGUgc2l6ZXNcclxuXHJcbiAgICBhcmVhc0JlZm9yZS5saXN0LmZvckVhY2goaXRlbSA9PiB1cGRhdGVBcmVhU2l6ZSh0aGlzLnVuaXQsIGl0ZW0pKTtcclxuICAgIGFyZWFzQWZ0ZXIubGlzdC5mb3JFYWNoKGl0ZW0gPT4gdXBkYXRlQXJlYVNpemUodGhpcy51bml0LCBpdGVtKSk7XHJcblxyXG4gICAgdGhpcy5yZWZyZXNoU3R5bGVTaXplcygpO1xyXG4gICAgdGhpcy5ub3RpZnkoJ3Byb2dyZXNzJywgKHRoaXMuc25hcHNob3QgYXMgTXR4U3BsaXRTbmFwc2hvdCkuZ3V0dGVyTnVtKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgc3RvcERyYWdnaW5nKGV2ZW50PzogRXZlbnQpOiB2b2lkIHtcclxuICAgIGlmIChldmVudCkge1xyXG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy5pc0RyYWdnaW5nID09PSBmYWxzZSkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5kaXNwbGF5ZWRBcmVhcy5mb3JFYWNoKGFyZWEgPT4gYXJlYS5jb21wb25lbnQudW5sb2NrRXZlbnRzKCkpO1xyXG5cclxuICAgIHdoaWxlICh0aGlzLmRyYWdMaXN0ZW5lcnMubGVuZ3RoID4gMCkge1xyXG4gICAgICBjb25zdCBmY3QgPSB0aGlzLmRyYWdMaXN0ZW5lcnMucG9wKCk7XHJcbiAgICAgIGlmIChmY3QpIHtcclxuICAgICAgICBmY3QoKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vIFdhcm5pbmc6IEhhdmUgdG8gYmUgYmVmb3JlIFwibm90aWZ5KCdlbmQnKVwiXHJcbiAgICAvLyBiZWNhdXNlIFwibm90aWZ5KCdlbmQnKVwiXCIgY2FuIGJlIGxpbmtlZCB0byBcIltzaXplXT0neCdcIiA+IFwiYnVpbGQoKVwiID4gXCJzdG9wRHJhZ2dpbmcoKVwiXHJcbiAgICB0aGlzLmlzRHJhZ2dpbmcgPSBmYWxzZTtcclxuXHJcbiAgICAvLyBJZiBtb3ZlZCBmcm9tIHN0YXJ0aW5nIHBvaW50LCBub3RpZnkgZW5kXHJcbiAgICBpZiAoXHJcbiAgICAgIHRoaXMuZW5kUG9pbnQgJiZcclxuICAgICAgKCh0aGlzLnN0YXJ0UG9pbnQgYXMgTXR4U3BsaXRQb2ludCkueCAhPT0gdGhpcy5lbmRQb2ludC54IHx8XHJcbiAgICAgICAgKHRoaXMuc3RhcnRQb2ludCBhcyBNdHhTcGxpdFBvaW50KS55ICE9PSB0aGlzLmVuZFBvaW50LnkpXHJcbiAgICApIHtcclxuICAgICAgdGhpcy5ub3RpZnkoJ2VuZCcsICh0aGlzLnNuYXBzaG90IGFzIE10eFNwbGl0U25hcHNob3QpLmd1dHRlck51bSk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5yZW5kZXJlci5yZW1vdmVDbGFzcyh0aGlzLmVsUmVmLm5hdGl2ZUVsZW1lbnQsICdtdHgtZHJhZ2dpbmcnKTtcclxuICAgIHRoaXMucmVuZGVyZXIucmVtb3ZlQ2xhc3MoXHJcbiAgICAgIHRoaXMuZ3V0dGVyRWxzLnRvQXJyYXkoKVsodGhpcy5zbmFwc2hvdCBhcyBNdHhTcGxpdFNuYXBzaG90KS5ndXR0ZXJOdW0gLSAxXS5uYXRpdmVFbGVtZW50LFxyXG4gICAgICAnbXR4LWRyYWdnZWQnXHJcbiAgICApO1xyXG4gICAgdGhpcy5zbmFwc2hvdCA9IG51bGw7XHJcblxyXG4gICAgLy8gTmVlZGVkIHRvIGxldCAoY2xpY2spPVwiY2xpY2tHdXR0ZXIoLi4uKVwiIGV2ZW50IHJ1biBhbmQgdmVyaWZ5IGlmIG1vdXNlIG1vdmVkIG9yIG5vdFxyXG4gICAgdGhpcy5uZ1pvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xyXG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICB0aGlzLnN0YXJ0UG9pbnQgPSBudWxsO1xyXG4gICAgICAgIHRoaXMuZW5kUG9pbnQgPSBudWxsO1xyXG4gICAgICB9KTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIG5vdGlmeShcclxuICAgIHR5cGU6ICdzdGFydCcgfCAncHJvZ3Jlc3MnIHwgJ2VuZCcgfCAnY2xpY2snIHwgJ2RibGNsaWNrJyB8ICd0cmFuc2l0aW9uRW5kJyxcclxuICAgIGd1dHRlck51bTogbnVtYmVyXHJcbiAgKTogdm9pZCB7XHJcbiAgICBjb25zdCBzaXplcyA9IHRoaXMuZ2V0VmlzaWJsZUFyZWFTaXplcygpO1xyXG5cclxuICAgIGlmICh0eXBlID09PSAnc3RhcnQnKSB7XHJcbiAgICAgIHRoaXMuZHJhZ1N0YXJ0LmVtaXQoeyBndXR0ZXJOdW0sIHNpemVzIH0pO1xyXG4gICAgfSBlbHNlIGlmICh0eXBlID09PSAnZW5kJykge1xyXG4gICAgICB0aGlzLmRyYWdFbmQuZW1pdCh7IGd1dHRlck51bSwgc2l6ZXMgfSk7XHJcbiAgICB9IGVsc2UgaWYgKHR5cGUgPT09ICdjbGljaycpIHtcclxuICAgICAgdGhpcy5ndXR0ZXJDbGljay5lbWl0KHsgZ3V0dGVyTnVtLCBzaXplcyB9KTtcclxuICAgIH0gZWxzZSBpZiAodHlwZSA9PT0gJ2RibGNsaWNrJykge1xyXG4gICAgICB0aGlzLmd1dHRlckRibENsaWNrLmVtaXQoeyBndXR0ZXJOdW0sIHNpemVzIH0pO1xyXG4gICAgfSBlbHNlIGlmICh0eXBlID09PSAndHJhbnNpdGlvbkVuZCcpIHtcclxuICAgICAgaWYgKHRoaXMudHJhbnNpdGlvbkVuZFN1YnNjcmliZXIpIHtcclxuICAgICAgICB0aGlzLm5nWm9uZS5ydW4oKCkgPT4gdGhpcy50cmFuc2l0aW9uRW5kU3Vic2NyaWJlci5uZXh0KHNpemVzKSk7XHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSBpZiAodHlwZSA9PT0gJ3Byb2dyZXNzJykge1xyXG4gICAgICAvLyBTdGF5IG91dHNpZGUgem9uZSB0byBhbGxvdyB1c2VycyBkbyB3aGF0IHRoZXkgd2FudCBhYm91dCBjaGFuZ2UgZGV0ZWN0aW9uIG1lY2hhbmlzbS5cclxuICAgICAgdGhpcy5kcmFnUHJvZ3Jlc3NTdWJqZWN0Lm5leHQoeyBndXR0ZXJOdW0sIHNpemVzIH0pO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHVibGljIG5nT25EZXN0cm95KCk6IHZvaWQge1xyXG4gICAgdGhpcy5zdG9wRHJhZ2dpbmcoKTtcclxuICB9XHJcbn1cclxuIl19