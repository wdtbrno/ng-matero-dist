import { Directive, Input } from '@angular/core';
import { getInputPositiveNumber, getInputBoolean } from './utils';
import * as i0 from "@angular/core";
import * as i1 from "./split";
export class MtxSplitPane {
    set order(v) {
        this._order = getInputPositiveNumber(v, null);
        this.split.updateArea(this, true, false);
    }
    get order() {
        return this._order;
    }
    set size(v) {
        this._size = getInputPositiveNumber(v, null);
        this.split.updateArea(this, false, true);
    }
    get size() {
        return this._size;
    }
    set minSize(v) {
        this._minSize = getInputPositiveNumber(v, null);
        this.split.updateArea(this, false, true);
    }
    get minSize() {
        return this._minSize;
    }
    set maxSize(v) {
        this._maxSize = getInputPositiveNumber(v, null);
        this.split.updateArea(this, false, true);
    }
    get maxSize() {
        return this._maxSize;
    }
    set lockSize(v) {
        this._lockSize = getInputBoolean(v);
        this.split.updateArea(this, false, true);
    }
    get lockSize() {
        return this._lockSize;
    }
    set visible(v) {
        this._visible = getInputBoolean(v);
        if (this._visible) {
            this.split.showArea(this);
            this.renderer.removeClass(this.elRef.nativeElement, 'mtx-split-pane-hidden');
        }
        else {
            this.split.hideArea(this);
            this.renderer.addClass(this.elRef.nativeElement, 'mtx-split-pane-hidden');
        }
    }
    get visible() {
        return this._visible;
    }
    constructor(ngZone, elRef, renderer, split) {
        this.ngZone = ngZone;
        this.elRef = elRef;
        this.renderer = renderer;
        this.split = split;
        this._order = null;
        ////
        this._size = null;
        ////
        this._minSize = null;
        ////
        this._maxSize = null;
        ////
        this._lockSize = false;
        ////
        this._visible = true;
        this.lockListeners = [];
        this.renderer.addClass(this.elRef.nativeElement, 'mtx-split-pane');
    }
    ngOnInit() {
        this.split.addArea(this);
        this.ngZone.runOutsideAngular(() => {
            this.transitionListener = this.renderer.listen(this.elRef.nativeElement, 'transitionend', (event) => {
                // Limit only flex-basis transition to trigger the event
                if (event.propertyName === 'flex-basis') {
                    this.split.notify('transitionEnd', -1);
                }
            });
        });
    }
    setStyleOrder(value) {
        this.renderer.setStyle(this.elRef.nativeElement, 'order', value);
    }
    setStyleFlex(grow, shrink, basis, isMin, isMax) {
        // Need 3 separated properties to work on IE11 (https://github.com/angular/flex-layout/issues/323)
        this.renderer.setStyle(this.elRef.nativeElement, 'flex-grow', grow);
        this.renderer.setStyle(this.elRef.nativeElement, 'flex-shrink', shrink);
        this.renderer.setStyle(this.elRef.nativeElement, 'flex-basis', basis);
        if (isMin === true) {
            this.renderer.addClass(this.elRef.nativeElement, 'mtx-min');
        }
        else {
            this.renderer.removeClass(this.elRef.nativeElement, 'mtx-min');
        }
        if (isMax === true) {
            this.renderer.addClass(this.elRef.nativeElement, 'mtx-max');
        }
        else {
            this.renderer.removeClass(this.elRef.nativeElement, 'mtx-max');
        }
    }
    lockEvents() {
        this.ngZone.runOutsideAngular(() => {
            this.lockListeners.push(this.renderer.listen(this.elRef.nativeElement, 'selectstart', (e) => false));
            this.lockListeners.push(this.renderer.listen(this.elRef.nativeElement, 'dragstart', (e) => false));
        });
    }
    unlockEvents() {
        while (this.lockListeners.length > 0) {
            const fct = this.lockListeners.pop();
            if (fct) {
                fct();
            }
        }
    }
    ngOnDestroy() {
        this.unlockEvents();
        if (this.transitionListener) {
            this.transitionListener();
        }
        this.split.removeArea(this);
    }
}
/** @nocollapse */ MtxSplitPane.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MtxSplitPane, deps: [{ token: i0.NgZone }, { token: i0.ElementRef }, { token: i0.Renderer2 }, { token: i1.MtxSplit }], target: i0.ɵɵFactoryTarget.Directive });
/** @nocollapse */ MtxSplitPane.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.2.1", type: MtxSplitPane, selector: "mtx-split-pane, [mtx-split-pane]", inputs: { order: "order", size: "size", minSize: "minSize", maxSize: "maxSize", lockSize: "lockSize", visible: "visible" }, exportAs: ["mtxSplitPane"], ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MtxSplitPane, decorators: [{
            type: Directive,
            args: [{
                    selector: 'mtx-split-pane, [mtx-split-pane]',
                    exportAs: 'mtxSplitPane',
                }]
        }], ctorParameters: function () { return [{ type: i0.NgZone }, { type: i0.ElementRef }, { type: i0.Renderer2 }, { type: i1.MtxSplit }]; }, propDecorators: { order: [{
                type: Input
            }], size: [{
                type: Input
            }], minSize: [{
                type: Input
            }], maxSize: [{
                type: Input
            }], lockSize: [{
                type: Input
            }], visible: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3BsaXQtcGFuZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL2V4dGVuc2lvbnMvc3BsaXQvc3BsaXQtcGFuZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBb0QsTUFBTSxlQUFlLENBQUM7QUFHbkcsT0FBTyxFQUFFLHNCQUFzQixFQUFFLGVBQWUsRUFBRSxNQUFNLFNBQVMsQ0FBQzs7O0FBTWxFLE1BQU0sT0FBTyxZQUFZO0lBR3ZCLElBQWEsS0FBSyxDQUFDLENBQWdCO1FBQ2pDLElBQUksQ0FBQyxNQUFNLEdBQUcsc0JBQXNCLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBRTlDLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDM0MsQ0FBQztJQUVELElBQUksS0FBSztRQUNQLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQztJQUNyQixDQUFDO0lBTUQsSUFBYSxJQUFJLENBQUMsQ0FBZ0I7UUFDaEMsSUFBSSxDQUFDLEtBQUssR0FBRyxzQkFBc0IsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFFN0MsSUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQztJQUMzQyxDQUFDO0lBRUQsSUFBSSxJQUFJO1FBQ04sT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDO0lBQ3BCLENBQUM7SUFNRCxJQUFhLE9BQU8sQ0FBQyxDQUFnQjtRQUNuQyxJQUFJLENBQUMsUUFBUSxHQUFHLHNCQUFzQixDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUVoRCxJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQzNDLENBQUM7SUFFRCxJ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QWpCLEtBQUs7Z0JBY08sSUFBSTtzQkFBaEIsS0FBSztnQkFjTyxPQUFPO3NCQUFuQixLQUFLO2dCQWNPLE9BQU87c0JBQW5CLEtBQUs7Z0JBY08sUUFBUTtzQkFBcEIsS0FBSztnQkFjTyxPQUFPO3NCQUFuQixLQUFLIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRGlyZWN0aXZlLCBJbnB1dCwgRWxlbWVudFJlZiwgUmVuZGVyZXIyLCBPbkluaXQsIE9uRGVzdHJveSwgTmdab25lIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7IE10eFNwbGl0IH0gZnJvbSAnLi9zcGxpdCc7XG5pbXBvcnQgeyBnZXRJbnB1dFBvc2l0aXZlTnVtYmVyLCBnZXRJbnB1dEJvb2xlYW4gfSBmcm9tICcuL3V0aWxzJztcblxuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnbXR4LXNwbGl0LXBhbmUsIFttdHgtc3BsaXQtcGFuZV0nLFxuICBleHBvcnRBczogJ210eFNwbGl0UGFuZScsXG59KVxuZXhwb3J0IGNsYXNzIE10eFNwbGl0UGFuZSBpbXBsZW1lbnRzIE9uSW5pdCwgT25EZXN0cm95IHtcbiAgcHJpdmF0ZSBfb3JkZXI6IG51bWJlciB8IG51bGwgPSBudWxsO1xuXG4gIEBJbnB1dCgpIHNldCBvcmRlcih2OiBudW1iZXIgfCBudWxsKSB7XG4gICAgdGhpcy5fb3JkZXIgPSBnZXRJbnB1dFBvc2l0aXZlTnVtYmVyKHYsIG51bGwpO1xuXG4gICAgdGhpcy5zcGxpdC51cGRhdGVBcmVhKHRoaXMsIHRydWUsIGZhbHNlKTtcbiAgfVxuXG4gIGdldCBvcmRlcigpOiBudW1iZXIgfCBudWxsIHtcbiAgICByZXR1cm4gdGhpcy5fb3JkZXI7XG4gIH1cblxuICAvLy8vXG5cbiAgcHJpdmF0ZSBfc2l6ZTogbnVtYmVyIHwgbnVsbCA9IG51bGw7XG5cbiAgQElucHV0KCkgc2V0IHNpemUodjogbnVtYmVyIHwgbnVsbCkge1xuICAgIHRoaXMuX3NpemUgPSBnZXRJbnB1dFBvc2l0aXZlTnVtYmVyKHYsIG51bGwpO1xuXG4gICAgdGhpcy5zcGxpdC51cGRhdGVBcmVhKHRoaXMsIGZhbHNlLCB0cnVlKTtcbiAgfVxuXG4gIGdldCBzaXplKCk6IG51bWJlciB8IG51bGwge1xuICAgIHJldHVybiB0aGlzLl9zaXplO1xuICB9XG5cbiAgLy8vL1xuXG4gIHByaXZhdGUgX21pblNpemU6IG51bWJlciB8IG51bGwgPSBudWxsO1xuXG4gIEBJbnB1dCgpIHNldCBtaW5TaXplKHY6IG51bWJlciB8IG51bGwpIHtcbiAgICB0aGlzLl9taW5TaXplID0gZ2V0SW5wdXRQb3NpdGl2ZU51bWJlcih2LCBudWxsKTtcblxuICAgIHRoaXMuc3BsaXQudXBkYXRlQXJlYSh0aGlzLCBmYWxzZSwgdHJ1ZSk7XG4gIH1cblxuICBnZXQgbWluU2l6ZSgpOiBudW1iZXIgfCBudWxsIHtcbiAgICByZXR1cm4gdGhpcy5fbWluU2l6ZTtcbiAgfVxuXG4gIC8vLy9cblxuICBwcml2YXRlIF9tYXhTaXplOiBudW1iZXIgfCBudWxsID0gbnVsbDtcblxuICBASW5wdXQoKSBzZXQgbWF4U2l6ZSh2OiBudW1iZXIgfCBudWxsKSB7XG4gICAgdGhpcy5fbWF4U2l6ZSA9IGdldElucHV0UG9zaXRpdmVOdW1iZXIodiwgbnVsbCk7XG5cbiAgICB0aGlzLnNwbGl0LnVwZGF0ZUFyZWEodGhpcywgZmFsc2UsIHRydWUpO1xuICB9XG5cbiAgZ2V0IG1heFNpemUoKTogbnVtYmVyIHwgbnVsbCB7XG4gICAgcmV0dXJuIHRoaXMuX21heFNpemU7XG4gIH1cblxuICAvLy8vXG5cbiAgcHJpdmF0ZSBfbG9ja1NpemUgPSBmYWxzZTtcblxuICBASW5wdXQoKSBzZXQgbG9ja1NpemUodjogYm9vbGVhbikge1xuICAgIHRoaXMuX2xvY2tTaXplID0gZ2V0SW5wdXRCb29sZWFuKHYpO1xuXG4gICAgdGhpcy5zcGxpdC51cGRhdGVBcmVhKHRoaXMsIGZhbHNlLCB0cnVlKTtcbiAgfVxuXG4gIGdldCBsb2NrU2l6ZSgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fbG9ja1NpemU7XG4gIH1cblxuICAvLy8vXG5cbiAgcHJpdmF0ZSBfdmlzaWJsZSA9IHRydWU7XG5cbiAgQElucHV0KCkgc2V0IHZpc2libGUodjogYm9vbGVhbikge1xuICAgIHRoaXMuX3Zpc2libGUgPSBnZXRJbnB1dEJvb2xlYW4odik7XG5cbiAgICBpZiAodGhpcy5fdmlzaWJsZSkge1xuICAgICAgdGhpcy5zcGxpdC5zaG93QXJlYSh0aGlzKTtcbiAgICAgIHRoaXMucmVuZGVyZXIucmVtb3ZlQ2xhc3ModGhpcy5lbFJlZi5uYXRpdmVFbGVtZW50LCAnbXR4LXNwbGl0LXBhbmUtaGlkZGVuJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuc3BsaXQuaGlkZUFyZWEodGhpcyk7XG4gICAgICB0aGlzLnJlbmRlcmVyLmFkZENsYXNzKHRoaXMuZWxSZWYubmF0aXZlRWxlbWVudCwgJ210eC1zcGxpdC1wYW5lLWhpZGRlbicpO1xuICAgIH1cbiAgfVxuXG4gIGdldCB2aXNpYmxlKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl92aXNpYmxlO1xuICB9XG5cbiAgLy8vL1xuXG4gIHByaXZhdGUgdHJhbnNpdGlvbkxpc3RlbmVyITogKCkgPT4gdm9pZDtcbiAgcHJpdmF0ZSByZWFkb25seSBsb2NrTGlzdGVuZXJzOiBBcnJheTwoKSA9PiB2b2lkPiA9IFtdO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgbmdab25lOiBOZ1pvbmUsXG4gICAgcHVibGljIGVsUmVmOiBFbGVtZW50UmVmLFxuICAgIHByaXZhdGUgcmVuZGVyZXI6IFJlbmRlcmVyMixcbiAgICBwcml2YXRlIHNwbGl0OiBNdHhTcGxpdFxuICApIHtcbiAgICB0aGlzLnJlbmRlcmVyLmFkZENsYXNzKHRoaXMuZWxSZWYubmF0aXZlRWxlbWVudCwgJ210eC1zcGxpdC1wYW5lJyk7XG4gIH1cblxuICBwdWJsaWMgbmdPbkluaXQoKTogdm9pZCB7XG4gICAgdGhpcy5zcGxpdC5hZGRBcmVhKHRoaXMpO1xuXG4gICAgdGhpcy5uZ1pvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xuICAgICAgdGhpcy50cmFuc2l0aW9uTGlzdGVuZXIgPSB0aGlzLnJlbmRlcmVyLmxpc3RlbihcbiAgICAgICAgdGhpcy5lbFJlZi5uYXRpdmVFbGVtZW50LFxuICAgICAgICAndHJhbnNpdGlvbmVuZCcsXG4gICAgICAgIChldmVudDogVHJhbnNpdGlvbkV2ZW50KSA9PiB7XG4gICAgICAgICAgLy8gTGltaXQgb25seSBmbGV4LWJhc2lzIHRyYW5zaXRpb24gdG8gdHJpZ2dlciB0aGUgZXZlbnRcbiAgICAgICAgICBpZiAoZXZlbnQucHJvcGVydHlOYW1lID09PSAnZmxleC1iYXNpcycpIHtcbiAgICAgICAgICAgIHRoaXMuc3BsaXQubm90aWZ5KCd0cmFuc2l0aW9uRW5kJywgLTEpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgKTtcbiAgICB9KTtcbiAgfVxuXG4gIHB1YmxpYyBzZXRTdHlsZU9yZGVyKHZhbHVlOiBudW1iZXIpOiB2b2lkIHtcbiAgICB0aGlzLnJlbmRlcmVyLnNldFN0eWxlKHRoaXMuZWxSZWYubmF0aXZlRWxlbWVudCwgJ29yZGVyJywgdmFsdWUpO1xuICB9XG5cbiAgcHVibGljIHNldFN0eWxlRmxleChcbiAgICBncm93OiBudW1iZXIsXG4gICAgc2hyaW5rOiBudW1iZXIsXG4gICAgYmFzaXM6IHN0cmluZyxcbiAgICBpc01pbjogYm9vbGVhbixcbiAgICBpc01heDogYm9vbGVhblxuICApOiB2b2lkIHtcbiAgICAvLyBOZWVkIDMgc2VwYXJhdGVkIHByb3BlcnRpZXMgdG8gd29yayBvbiBJRTExIChodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9mbGV4LWxheW91dC9pc3N1ZXMvMzIzKVxuICAgIHRoaXMucmVuZGVyZXIuc2V0U3R5bGUodGhpcy5lbFJlZi5uYXRpdmVFbGVtZW50LCAnZmxleC1ncm93JywgZ3Jvdyk7XG4gICAgdGhpcy5yZW5kZXJlci5zZXRTdHlsZSh0aGlzLmVsUmVmLm5hdGl2ZUVsZW1lbnQsICdmbGV4LXNocmluaycsIHNocmluayk7XG4gICAgdGhpcy5yZW5kZXJlci5zZXRTdHlsZSh0aGlzLmVsUmVmLm5hdGl2ZUVsZW1lbnQsICdmbGV4LWJhc2lzJywgYmFzaXMpO1xuXG4gICAgaWYgKGlzTWluID09PSB0cnVlKSB7XG4gICAgICB0aGlzLnJlbmRlcmVyLmFkZENsYXNzKHRoaXMuZWxSZWYubmF0aXZlRWxlbWVudCwgJ210eC1taW4nKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5yZW5kZXJlci5yZW1vdmVDbGFzcyh0aGlzLmVsUmVmLm5hdGl2ZUVsZW1lbnQsICdtdHgtbWluJyk7XG4gICAgfVxuXG4gICAgaWYgKGlzTWF4ID09PSB0cnVlKSB7XG4gICAgICB0aGlzLnJlbmRlcmVyLmFkZENsYXNzKHRoaXMuZWxSZWYubmF0aXZlRWxlbWVudCwgJ210eC1tYXgnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5yZW5kZXJlci5yZW1vdmVDbGFzcyh0aGlzLmVsUmVmLm5hdGl2ZUVsZW1lbnQsICdtdHgtbWF4Jyk7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIGxvY2tFdmVudHMoKTogdm9pZCB7XG4gICAgdGhpcy5uZ1pvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xuICAgICAgdGhpcy5sb2NrTGlzdGVuZXJzLnB1c2goXG4gICAgICAgIHRoaXMucmVuZGVyZXIubGlzdGVuKHRoaXMuZWxSZWYubmF0aXZlRWxlbWVudCwgJ3NlbGVjdHN0YXJ0JywgKGU6IEV2ZW50KSA9PiBmYWxzZSlcbiAgICAgICk7XG4gICAgICB0aGlzLmxvY2tMaXN0ZW5lcnMucHVzaChcbiAgICAgICAgdGhpcy5yZW5kZXJlci5saXN0ZW4odGhpcy5lbFJlZi5uYXRpdmVFbGVtZW50LCAnZHJhZ3N0YXJ0JywgKGU6IEV2ZW50KSA9PiBmYWxzZSlcbiAgICAgICk7XG4gICAgfSk7XG4gIH1cblxuICBwdWJsaWMgdW5sb2NrRXZlbnRzKCk6IHZvaWQge1xuICAgIHdoaWxlICh0aGlzLmxvY2tMaXN0ZW5lcnMubGVuZ3RoID4gMCkge1xuICAgICAgY29uc3QgZmN0ID0gdGhpcy5sb2NrTGlzdGVuZXJzLnBvcCgpO1xuICAgICAgaWYgKGZjdCkge1xuICAgICAgICBmY3QoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwdWJsaWMgbmdPbkRlc3Ryb3koKTogdm9pZCB7XG4gICAgdGhpcy51bmxvY2tFdmVudHMoKTtcblxuICAgIGlmICh0aGlzLnRyYW5zaXRpb25MaXN0ZW5lcikge1xuICAgICAgdGhpcy50cmFuc2l0aW9uTGlzdGVuZXIoKTtcbiAgICB9XG5cbiAgICB0aGlzLnNwbGl0LnJlbW92ZUFyZWEodGhpcyk7XG4gIH1cbn1cbiJdfQ==