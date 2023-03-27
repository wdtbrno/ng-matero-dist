import { Directive, EventEmitter, HostBinding, HostListener, Input, Output, TemplateRef, } from '@angular/core';
export class MtxGridExpansionToggleDirective {
    constructor() {
        this._opened = false;
        this.openedChange = new EventEmitter();
        this.toggleChange = new EventEmitter();
    }
    get opened() {
        return this._opened;
    }
    set opened(newValue) {
        this._opened = newValue;
        this.openedChange.emit(newValue);
    }
    get expanded() {
        return this._opened;
    }
    set expandableRow(value) {
        if (value !== this._row) {
            this._row = value;
        }
    }
    set template(value) {
        if (value !== this._tplRef) {
            this._tplRef = value;
        }
    }
    onClick(event) {
        event.preventDefault();
        event.stopPropagation();
        this.toggle();
    }
    toggle() {
        this.opened = !this.opened;
        this.toggleChange.emit(this);
    }
}
MtxGridExpansionToggleDirective.decorators = [
    { type: Directive, args: [{
                selector: '[mtx-grid-expansion-toggle]',
            },] }
];
/** @nocollapse */
MtxGridExpansionToggleDirective.ctorParameters = () => [];
MtxGridExpansionToggleDirective.propDecorators = {
    opened: [{ type: Input }],
    openedChange: [{ type: Output }],
    expanded: [{ type: HostBinding, args: ['class.expanded',] }],
    expandableRow: [{ type: Input }],
    template: [{ type: Input, args: ['expansionRowTpl',] }],
    toggleChange: [{ type: Output }],
    onClick: [{ type: HostListener, args: ['click', ['$event'],] }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXhwYW5zaW9uLXRvZ2dsZS5kaXJlY3RpdmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wcm9qZWN0cy9leHRlbnNpb25zL2RhdGEtZ3JpZC9leHBhbnNpb24tdG9nZ2xlLmRpcmVjdGl2ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQ0wsU0FBUyxFQUNULFlBQVksRUFDWixXQUFXLEVBQ1gsWUFBWSxFQUNaLEtBQUssRUFDTCxNQUFNLEVBQ04sV0FBVyxHQUNaLE1BQU0sZUFBZSxDQUFDO0FBS3ZCLE1BQU0sT0FBTywrQkFBK0I7SUFvQzFDO1FBbkNRLFlBQU8sR0FBRyxLQUFLLENBQUM7UUFZZCxpQkFBWSxHQUFHLElBQUksWUFBWSxFQUFXLENBQUM7UUFxQjNDLGlCQUFZLEdBQUcsSUFBSSxZQUFZLEVBQW1DLENBQUM7SUFFOUQsQ0FBQztJQS9CaEIsSUFDSSxNQUFNO1FBQ1IsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDO0lBQ3RCLENBQUM7SUFDRCxJQUFJLE1BQU0sQ0FBQyxRQUFpQjtRQUMxQixJQUFJLENBQUMsT0FBTyxHQUFHLFFBQVEsQ0FBQztRQUN4QixJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUNuQyxDQUFDO0lBR0QsSUFDSSxRQUFRO1FBQ1YsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDO0lBQ3RCLENBQUM7SUFFRCxJQUNJLGFBQWEsQ0FBQyxLQUFVO1FBQzFCLElBQUksS0FBSyxLQUFLLElBQUksQ0FBQyxJQUFJLEVBQUU7WUFDdkIsSUFBSSxDQUFDLElBQUksR0FBRyxLQUFLLENBQUM7U0FDbkI7SUFDSCxDQUFDO0lBRUQsSUFDSSxRQUFRLENBQUMsS0FBdUI7UUFDbEMsSUFBSSxLQUFLLEtBQUssSUFBSSxDQUFDLE9BQU8sRUFBRTtZQUMxQixJQUFJLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQztTQUN0QjtJQUNILENBQUM7SUFPRCxPQUFPLENBQUMsS0FBaUI7UUFDdkIsS0FBSyxDQUFDLGNBQWMsRUFBRSxDQUFDO1FBQ3ZCLEtBQUssQ0FBQyxlQUFlLEVBQUUsQ0FBQztRQUN4QixJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7SUFDaEIsQ0FBQztJQUVELE1BQU07UUFDSixJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQztRQUMzQixJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUMvQixDQUFDOzs7WUFuREYsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSw2QkFBNkI7YUFDeEM7Ozs7O3FCQU1FLEtBQUs7MkJBUUwsTUFBTTt1QkFFTixXQUFXLFNBQUMsZ0JBQWdCOzRCQUs1QixLQUFLO3VCQU9MLEtBQUssU0FBQyxpQkFBaUI7MkJBT3ZCLE1BQU07c0JBSU4sWUFBWSxTQUFDLE9BQU8sRUFBRSxDQUFDLFFBQVEsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XHJcbiAgRGlyZWN0aXZlLFxyXG4gIEV2ZW50RW1pdHRlcixcclxuICBIb3N0QmluZGluZyxcclxuICBIb3N0TGlzdGVuZXIsXHJcbiAgSW5wdXQsXHJcbiAgT3V0cHV0LFxyXG4gIFRlbXBsYXRlUmVmLFxyXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5cclxuQERpcmVjdGl2ZSh7XHJcbiAgc2VsZWN0b3I6ICdbbXR4LWdyaWQtZXhwYW5zaW9uLXRvZ2dsZV0nLFxyXG59KVxyXG5leHBvcnQgY2xhc3MgTXR4R3JpZEV4cGFuc2lvblRvZ2dsZURpcmVjdGl2ZSB7XHJcbiAgcHJpdmF0ZSBfb3BlbmVkID0gZmFsc2U7XHJcbiAgcHJpdmF0ZSBfcm93OiBhbnk7XHJcbiAgcHJpdmF0ZSBfdHBsUmVmOiBUZW1wbGF0ZVJlZjxhbnk+O1xyXG5cclxuICBASW5wdXQoKVxyXG4gIGdldCBvcGVuZWQoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5fb3BlbmVkO1xyXG4gIH1cclxuICBzZXQgb3BlbmVkKG5ld1ZhbHVlOiBib29sZWFuKSB7XHJcbiAgICB0aGlzLl9vcGVuZWQgPSBuZXdWYWx1ZTtcclxuICAgIHRoaXMub3BlbmVkQ2hhbmdlLmVtaXQobmV3VmFsdWUpO1xyXG4gIH1cclxuICBAT3V0cHV0KCkgb3BlbmVkQ2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcjxib29sZWFuPigpO1xyXG5cclxuICBASG9zdEJpbmRpbmcoJ2NsYXNzLmV4cGFuZGVkJylcclxuICBnZXQgZXhwYW5kZWQoKTogYm9vbGVhbiB7XHJcbiAgICByZXR1cm4gdGhpcy5fb3BlbmVkO1xyXG4gIH1cclxuXHJcbiAgQElucHV0KClcclxuICBzZXQgZXhwYW5kYWJsZVJvdyh2YWx1ZTogYW55KSB7XHJcbiAgICBpZiAodmFsdWUgIT09IHRoaXMuX3Jvdykge1xyXG4gICAgICB0aGlzLl9yb3cgPSB2YWx1ZTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIEBJbnB1dCgnZXhwYW5zaW9uUm93VHBsJylcclxuICBzZXQgdGVtcGxhdGUodmFsdWU6IFRlbXBsYXRlUmVmPGFueT4pIHtcclxuICAgIGlmICh2YWx1ZSAhPT0gdGhpcy5fdHBsUmVmKSB7XHJcbiAgICAgIHRoaXMuX3RwbFJlZiA9IHZhbHVlO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgQE91dHB1dCgpIHRvZ2dsZUNoYW5nZSA9IG5ldyBFdmVudEVtaXR0ZXI8TXR4R3JpZEV4cGFuc2lvblRvZ2dsZURpcmVjdGl2ZT4oKTtcclxuXHJcbiAgY29uc3RydWN0b3IoKSB7fVxyXG5cclxuICBASG9zdExpc3RlbmVyKCdjbGljaycsIFsnJGV2ZW50J10pXHJcbiAgb25DbGljayhldmVudDogTW91c2VFdmVudCk6IHZvaWQge1xyXG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgdGhpcy50b2dnbGUoKTtcclxuICB9XHJcblxyXG4gIHRvZ2dsZSgpOiB2b2lkIHtcclxuICAgIHRoaXMub3BlbmVkID0gIXRoaXMub3BlbmVkO1xyXG4gICAgdGhpcy50b2dnbGVDaGFuZ2UuZW1pdCh0aGlzKTtcclxuICB9XHJcbn1cclxuIl19