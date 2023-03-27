import { ChangeDetectionStrategy, Component, ElementRef, Input, } from '@angular/core';
import { Subject } from 'rxjs';
export class MtxOptionComponent {
    constructor(elementRef) {
        this.elementRef = elementRef;
        this.stateChange$ = new Subject();
        this._disabled = false;
    }
    get disabled() {
        return this._disabled;
    }
    set disabled(value) {
        this._disabled = this._isDisabled(value);
    }
    get label() {
        return (this.elementRef.nativeElement.textContent || '').trim();
    }
    ngOnChanges(changes) {
        if (changes.disabled) {
            this.stateChange$.next({
                value: this.value,
                disabled: this._disabled,
            });
        }
    }
    ngAfterViewChecked() {
        if (this.label !== this._previousLabel) {
            this._previousLabel = this.label;
            this.stateChange$.next({
                value: this.value,
                disabled: this._disabled,
                label: this.elementRef.nativeElement.innerHTML,
            });
        }
    }
    ngOnDestroy() {
        this.stateChange$.complete();
    }
    _isDisabled(value) {
        return value != null && `${value}` !== 'false';
    }
}
MtxOptionComponent.decorators = [
    { type: Component, args: [{
                selector: 'mtx-option',
                exportAs: 'mtxOption',
                changeDetection: ChangeDetectionStrategy.OnPush,
                template: `<ng-content></ng-content>`
            },] }
];
/** @nocollapse */
MtxOptionComponent.ctorParameters = () => [
    { type: ElementRef }
];
MtxOptionComponent.propDecorators = {
    value: [{ type: Input }],
    disabled: [{ type: Input }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3B0aW9uLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL2V4dGVuc2lvbnMvc2VsZWN0L29wdGlvbi5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUVMLHVCQUF1QixFQUN2QixTQUFTLEVBQ1QsVUFBVSxFQUNWLEtBQUssR0FJTixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBUS9CLE1BQU0sT0FBTyxrQkFBa0I7SUFlN0IsWUFBbUIsVUFBbUM7UUFBbkMsZUFBVSxHQUFWLFVBQVUsQ0FBeUI7UUFMN0MsaUJBQVksR0FBRyxJQUFJLE9BQU8sRUFBcUQsQ0FBQztRQUVqRixjQUFTLEdBQUcsS0FBSyxDQUFDO0lBRytCLENBQUM7SUFiMUQsSUFDSSxRQUFRO1FBQ1YsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDO0lBQ3hCLENBQUM7SUFDRCxJQUFJLFFBQVEsQ0FBQyxLQUFVO1FBQ3JCLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUMzQyxDQUFDO0lBU0QsSUFBSSxLQUFLO1FBQ1AsT0FBTyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsYUFBYSxDQUFDLFdBQVcsSUFBSSxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUNsRSxDQUFDO0lBRUQsV0FBVyxDQUFDLE9BQXNCO1FBQ2hDLElBQUksT0FBTyxDQUFDLFFBQVEsRUFBRTtZQUNwQixJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQztnQkFDckIsS0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLO2dCQUNqQixRQUFRLEVBQUUsSUFBSSxDQUFDLFNBQVM7YUFDekIsQ0FBQyxDQUFDO1NBQ0o7SUFDSCxDQUFDO0lBRUQsa0JBQWtCO1FBQ2hCLElBQUksSUFBSSxDQUFDLEtBQUssS0FBSyxJQUFJLENBQUMsY0FBYyxFQUFFO1lBQ3RDLElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQztZQUNqQyxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQztnQkFDckIsS0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLO2dCQUNqQixRQUFRLEVBQUUsSUFBSSxDQUFDLFNBQVM7Z0JBQ3hCLEtBQUssRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLGFBQWEsQ0FBQyxTQUFTO2FBQy9DLENBQUMsQ0FBQztTQUNKO0lBQ0gsQ0FBQztJQUVELFdBQVc7UUFDVCxJQUFJLENBQUMsWUFBWSxDQUFDLFFBQVEsRUFBRSxDQUFDO0lBQy9CLENBQUM7SUFFTyxXQUFXLENBQUMsS0FBVztRQUM3QixPQUFPLEtBQUssSUFBSSxJQUFJLElBQUksR0FBRyxLQUFLLEVBQUUsS0FBSyxPQUFPLENBQUM7SUFDakQsQ0FBQzs7O1lBckRGLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsWUFBWTtnQkFDdEIsUUFBUSxFQUFFLFdBQVc7Z0JBQ3JCLGVBQWUsRUFBRSx1QkFBdUIsQ0FBQyxNQUFNO2dCQUMvQyxRQUFRLEVBQUUsMkJBQTJCO2FBQ3RDOzs7O1lBYkMsVUFBVTs7O29CQWVULEtBQUs7dUJBQ0wsS0FBSyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIEFmdGVyVmlld0NoZWNrZWQsXG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBDb21wb25lbnQsXG4gIEVsZW1lbnRSZWYsXG4gIElucHV0LFxuICBPbkNoYW5nZXMsXG4gIE9uRGVzdHJveSxcbiAgU2ltcGxlQ2hhbmdlcyxcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBTdWJqZWN0IH0gZnJvbSAncnhqcyc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ210eC1vcHRpb24nLFxuICBleHBvcnRBczogJ210eE9wdGlvbicsXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICB0ZW1wbGF0ZTogYDxuZy1jb250ZW50PjwvbmctY29udGVudD5gLFxufSlcbmV4cG9ydCBjbGFzcyBNdHhPcHRpb25Db21wb25lbnQgaW1wbGVtZW50cyBPbkNoYW5nZXMsIEFmdGVyVmlld0NoZWNrZWQsIE9uRGVzdHJveSB7XG4gIEBJbnB1dCgpIHZhbHVlOiBhbnk7XG4gIEBJbnB1dCgpXG4gIGdldCBkaXNhYmxlZCgpIHtcbiAgICByZXR1cm4gdGhpcy5fZGlzYWJsZWQ7XG4gIH1cbiAgc2V0IGRpc2FibGVkKHZhbHVlOiBhbnkpIHtcbiAgICB0aGlzLl9kaXNhYmxlZCA9IHRoaXMuX2lzRGlzYWJsZWQodmFsdWUpO1xuICB9XG5cbiAgcmVhZG9ubHkgc3RhdGVDaGFuZ2UkID0gbmV3IFN1YmplY3Q8eyB2YWx1ZTogYW55OyBkaXNhYmxlZDogYm9vbGVhbjsgbGFiZWw/OiBzdHJpbmcgfT4oKTtcblxuICBwcml2YXRlIF9kaXNhYmxlZCA9IGZhbHNlO1xuICBwcml2YXRlIF9wcmV2aW91c0xhYmVsOiBzdHJpbmc7XG5cbiAgY29uc3RydWN0b3IocHVibGljIGVsZW1lbnRSZWY6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+KSB7fVxuXG4gIGdldCBsYWJlbCgpOiBzdHJpbmcge1xuICAgIHJldHVybiAodGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQudGV4dENvbnRlbnQgfHwgJycpLnRyaW0oKTtcbiAgfVxuXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpIHtcbiAgICBpZiAoY2hhbmdlcy5kaXNhYmxlZCkge1xuICAgICAgdGhpcy5zdGF0ZUNoYW5nZSQubmV4dCh7XG4gICAgICAgIHZhbHVlOiB0aGlzLnZhbHVlLFxuICAgICAgICBkaXNhYmxlZDogdGhpcy5fZGlzYWJsZWQsXG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBuZ0FmdGVyVmlld0NoZWNrZWQoKSB7XG4gICAgaWYgKHRoaXMubGFiZWwgIT09IHRoaXMuX3ByZXZpb3VzTGFiZWwpIHtcbiAgICAgIHRoaXMuX3ByZXZpb3VzTGFiZWwgPSB0aGlzLmxhYmVsO1xuICAgICAgdGhpcy5zdGF0ZUNoYW5nZSQubmV4dCh7XG4gICAgICAgIHZhbHVlOiB0aGlzLnZhbHVlLFxuICAgICAgICBkaXNhYmxlZDogdGhpcy5fZGlzYWJsZWQsXG4gICAgICAgIGxhYmVsOiB0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5pbm5lckhUTUwsXG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLnN0YXRlQ2hhbmdlJC5jb21wbGV0ZSgpO1xuICB9XG5cbiAgcHJpdmF0ZSBfaXNEaXNhYmxlZCh2YWx1ZTogbnVsbCkge1xuICAgIHJldHVybiB2YWx1ZSAhPSBudWxsICYmIGAke3ZhbHVlfWAgIT09ICdmYWxzZSc7XG4gIH1cbn1cbiJdfQ==