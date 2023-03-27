import { Directive, EventEmitter, HostBinding, HostListener, Input, Output, } from '@angular/core';
import { MtxGridComponent } from './grid.component';
export class MtxGridCellSelectionDirective {
    constructor(_dataGrid) {
        this._dataGrid = _dataGrid;
        this._selected = false;
        this.shiftKeyPressed = false;
        this.ctrlKeyPressed = false;
        this.cellSelectionChange = new EventEmitter();
    }
    get selected() {
        return this._selected;
    }
    set matSelectableRowData(value) {
        if (value !== this._rowData) {
            this._rowData = value;
        }
    }
    onClick(event) {
        this.ctrlKeyPressed = event.ctrlKey;
        this.shiftKeyPressed = event.shiftKey;
        if (this._dataGrid.cellSelectable) {
            this.select();
        }
    }
    select() {
        this._selected = true;
        this.cellSelectionChange.emit(this);
    }
    deselect() {
        this._selected = false;
        this.cellSelectionChange.emit(this);
    }
    toggle() {
        this._selected = !this._selected;
        this.cellSelectionChange.emit(this);
    }
}
MtxGridCellSelectionDirective.decorators = [
    { type: Directive, args: [{
                selector: '[mtx-grid-selectable-cell]',
            },] }
];
/** @nocollapse */
MtxGridCellSelectionDirective.ctorParameters = () => [
    { type: MtxGridComponent }
];
MtxGridCellSelectionDirective.propDecorators = {
    selected: [{ type: HostBinding, args: ['class.selected',] }],
    matSelectableRowData: [{ type: Input }],
    cellSelectionChange: [{ type: Output }],
    onClick: [{ type: HostListener, args: ['click', ['$event'],] }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2VsbC1zZWxlY3Rpb24uZGlyZWN0aXZlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vcHJvamVjdHMvZXh0ZW5zaW9ucy9kYXRhLWdyaWQvY2VsbC1zZWxlY3Rpb24uZGlyZWN0aXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFDTCxTQUFTLEVBQ1QsWUFBWSxFQUNaLFdBQVcsRUFDWCxZQUFZLEVBQ1osS0FBSyxFQUNMLE1BQU0sR0FDUCxNQUFNLGVBQWUsQ0FBQztBQUV2QixPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxrQkFBa0IsQ0FBQztBQUtwRCxNQUFNLE9BQU8sNkJBQTZCO0lBcUJ4QyxZQUFvQixTQUEyQjtRQUEzQixjQUFTLEdBQVQsU0FBUyxDQUFrQjtRQXBCdkMsY0FBUyxHQUFHLEtBQUssQ0FBQztRQUcxQixvQkFBZSxHQUFHLEtBQUssQ0FBQztRQUN4QixtQkFBYyxHQUFHLEtBQUssQ0FBQztRQWNiLHdCQUFtQixHQUFHLElBQUksWUFBWSxFQUFpQyxDQUFDO0lBRS9CLENBQUM7SUFkcEQsSUFDSSxRQUFRO1FBQ1YsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDO0lBQ3hCLENBQUM7SUFFRCxJQUNJLG9CQUFvQixDQUFDLEtBQVU7UUFDakMsSUFBSSxLQUFLLEtBQUssSUFBSSxDQUFDLFFBQVEsRUFBRTtZQUMzQixJQUFJLENBQUMsUUFBUSxHQUFHLEtBQUssQ0FBQztTQUN2QjtJQUNILENBQUM7SUFPRCxPQUFPLENBQUMsS0FBaUI7UUFDdkIsSUFBSSxDQUFDLGNBQWMsR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDO1FBQ3BDLElBQUksQ0FBQyxlQUFlLEdBQUcsS0FBSyxDQUFDLFFBQVEsQ0FBQztRQUV0QyxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsY0FBYyxFQUFFO1lBQ2pDLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztTQUNmO0lBQ0gsQ0FBQztJQUVELE1BQU07UUFDSixJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQztRQUN0QixJQUFJLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3RDLENBQUM7SUFFRCxRQUFRO1FBQ04sSUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7UUFDdkIsSUFBSSxDQUFDLG1CQUFtQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUN0QyxDQUFDO0lBRUQsTUFBTTtRQUNKLElBQUksQ0FBQyxTQUFTLEdBQUcsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDO1FBQ2pDLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDdEMsQ0FBQzs7O1lBakRGLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsNEJBQTRCO2FBQ3ZDOzs7O1lBSlEsZ0JBQWdCOzs7dUJBWXRCLFdBQVcsU0FBQyxnQkFBZ0I7bUNBSzVCLEtBQUs7a0NBT0wsTUFBTTtzQkFJTixZQUFZLFNBQUMsT0FBTyxFQUFFLENBQUMsUUFBUSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcclxuICBEaXJlY3RpdmUsXHJcbiAgRXZlbnRFbWl0dGVyLFxyXG4gIEhvc3RCaW5kaW5nLFxyXG4gIEhvc3RMaXN0ZW5lcixcclxuICBJbnB1dCxcclxuICBPdXRwdXQsXHJcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcblxyXG5pbXBvcnQgeyBNdHhHcmlkQ29tcG9uZW50IH0gZnJvbSAnLi9ncmlkLmNvbXBvbmVudCc7XHJcblxyXG5ARGlyZWN0aXZlKHtcclxuICBzZWxlY3RvcjogJ1ttdHgtZ3JpZC1zZWxlY3RhYmxlLWNlbGxdJyxcclxufSlcclxuZXhwb3J0IGNsYXNzIE10eEdyaWRDZWxsU2VsZWN0aW9uRGlyZWN0aXZlIHtcclxuICBwcml2YXRlIF9zZWxlY3RlZCA9IGZhbHNlO1xyXG4gIHByaXZhdGUgX3Jvd0RhdGE6IGFueTtcclxuXHJcbiAgc2hpZnRLZXlQcmVzc2VkID0gZmFsc2U7XHJcbiAgY3RybEtleVByZXNzZWQgPSBmYWxzZTtcclxuXHJcbiAgQEhvc3RCaW5kaW5nKCdjbGFzcy5zZWxlY3RlZCcpXHJcbiAgZ2V0IHNlbGVjdGVkKCk6IGJvb2xlYW4ge1xyXG4gICAgcmV0dXJuIHRoaXMuX3NlbGVjdGVkO1xyXG4gIH1cclxuXHJcbiAgQElucHV0KClcclxuICBzZXQgbWF0U2VsZWN0YWJsZVJvd0RhdGEodmFsdWU6IGFueSkge1xyXG4gICAgaWYgKHZhbHVlICE9PSB0aGlzLl9yb3dEYXRhKSB7XHJcbiAgICAgIHRoaXMuX3Jvd0RhdGEgPSB2YWx1ZTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIEBPdXRwdXQoKSBjZWxsU2VsZWN0aW9uQ2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcjxNdHhHcmlkQ2VsbFNlbGVjdGlvbkRpcmVjdGl2ZT4oKTtcclxuXHJcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBfZGF0YUdyaWQ6IE10eEdyaWRDb21wb25lbnQpIHsgfVxyXG5cclxuICBASG9zdExpc3RlbmVyKCdjbGljaycsIFsnJGV2ZW50J10pXHJcbiAgb25DbGljayhldmVudDogTW91c2VFdmVudCk6IHZvaWQge1xyXG4gICAgdGhpcy5jdHJsS2V5UHJlc3NlZCA9IGV2ZW50LmN0cmxLZXk7XHJcbiAgICB0aGlzLnNoaWZ0S2V5UHJlc3NlZCA9IGV2ZW50LnNoaWZ0S2V5O1xyXG5cclxuICAgIGlmICh0aGlzLl9kYXRhR3JpZC5jZWxsU2VsZWN0YWJsZSkge1xyXG4gICAgICB0aGlzLnNlbGVjdCgpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgc2VsZWN0KCk6IHZvaWQge1xyXG4gICAgdGhpcy5fc2VsZWN0ZWQgPSB0cnVlO1xyXG4gICAgdGhpcy5jZWxsU2VsZWN0aW9uQ2hhbmdlLmVtaXQodGhpcyk7XHJcbiAgfVxyXG5cclxuICBkZXNlbGVjdCgpOiB2b2lkIHtcclxuICAgIHRoaXMuX3NlbGVjdGVkID0gZmFsc2U7XHJcbiAgICB0aGlzLmNlbGxTZWxlY3Rpb25DaGFuZ2UuZW1pdCh0aGlzKTtcclxuICB9XHJcblxyXG4gIHRvZ2dsZSgpOiB2b2lkIHtcclxuICAgIHRoaXMuX3NlbGVjdGVkID0gIXRoaXMuX3NlbGVjdGVkO1xyXG4gICAgdGhpcy5jZWxsU2VsZWN0aW9uQ2hhbmdlLmVtaXQodGhpcyk7XHJcbiAgfVxyXG59XHJcbiJdfQ==