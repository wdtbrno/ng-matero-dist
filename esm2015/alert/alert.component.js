import { Component, ChangeDetectionStrategy, ViewEncapsulation, Input, Output, EventEmitter, ChangeDetectorRef, HostBinding, } from '@angular/core';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
export class MtxAlertComponent {
    constructor(_changeDetectorRef) {
        this._changeDetectorRef = _changeDetectorRef;
        /** The alert type */
        this.type = 'default';
        this._dismissible = false;
        /** Material elevation */
        this.elevation = 0;
        /** This event fires when alert closed, $event is an instance of Alert component */
        this.closed = new EventEmitter();
    }
    get hostClassList() {
        return `mtx-alert-${this.type} mat-elevation-z${this.elevation}`;
    }
    /** Whether displays an inline `Close` button */
    get dismissible() {
        return this._dismissible;
    }
    set dismissible(value) {
        this._dismissible = coerceBooleanProperty(value);
    }
    _onClosed() {
        this._changeDetectorRef.markForCheck();
        this.closed.emit(this);
    }
}
MtxAlertComponent.decorators = [
    { type: Component, args: [{
                selector: 'mtx-alert',
                exportAs: 'mtxAlert',
                host: {
                    '[class.mtx-alert]': 'true',
                    '[class.mtx-alert-dismissible]': 'dismissible',
                    'role': 'alert',
                },
                template: "<ng-content></ng-content>\n<ng-template [ngIf]=\"dismissible\">\n  <button type=\"button\" class=\"mtx-alert-close\" aria-label=\"Close\" (click)=\"_onClosed()\">\n    <span aria-hidden=\"true\">&times;</span>\n  </button>\n</ng-template>\n",
                encapsulation: ViewEncapsulation.None,
                changeDetection: ChangeDetectionStrategy.OnPush,
                styles: [".mtx-alert{position:relative;display:block;padding:.75rem 1.25rem;margin-bottom:1rem;border:1px solid transparent;border-radius:.25rem}.mtx-alert-close{position:absolute;top:0;bottom:0;right:0;padding:0 1.25rem;font-size:1.5rem;line-height:1;color:inherit;opacity:.5;background-color:transparent;border:0;cursor:pointer}[dir=rtl] .mtx-alert-close{right:auto;left:0}.mtx-alert-close:hover{opacity:.75}.mtx-alert-dismissible{padding-right:4rem}"]
            },] }
];
/** @nocollapse */
MtxAlertComponent.ctorParameters = () => [
    { type: ChangeDetectorRef }
];
MtxAlertComponent.propDecorators = {
    hostClassList: [{ type: HostBinding, args: ['class',] }],
    type: [{ type: Input }],
    dismissible: [{ type: Input }],
    color: [{ type: Input }],
    elevation: [{ type: Input }],
    closed: [{ type: Output }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWxlcnQuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vcHJvamVjdHMvZXh0ZW5zaW9ucy9hbGVydC9hbGVydC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUNMLFNBQVMsRUFDVCx1QkFBdUIsRUFDdkIsaUJBQWlCLEVBQ2pCLEtBQUssRUFDTCxNQUFNLEVBQ04sWUFBWSxFQUNaLGlCQUFpQixFQUNqQixXQUFXLEdBQ1osTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFnQixxQkFBcUIsRUFBRSxNQUFNLHVCQUF1QixDQUFDO0FBaUI1RSxNQUFNLE9BQU8saUJBQWlCO0lBMkI1QixZQUFvQixrQkFBcUM7UUFBckMsdUJBQWtCLEdBQWxCLGtCQUFrQixDQUFtQjtRQXRCekQscUJBQXFCO1FBQ1osU0FBSSxHQUFpQixTQUFTLENBQUM7UUFVaEMsaUJBQVksR0FBRyxLQUFLLENBQUM7UUFLN0IseUJBQXlCO1FBQ2hCLGNBQVMsR0FBRyxDQUFDLENBQUM7UUFFdkIsbUZBQW1GO1FBQ3pFLFdBQU0sR0FBRyxJQUFJLFlBQVksRUFBcUIsQ0FBQztJQUVHLENBQUM7SUExQjdELElBQTBCLGFBQWE7UUFDckMsT0FBTyxhQUFhLElBQUksQ0FBQyxJQUFJLG1CQUFtQixJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7SUFDbkUsQ0FBQztJQUtELGdEQUFnRDtJQUNoRCxJQUNJLFdBQVc7UUFDYixPQUFPLElBQUksQ0FBQyxZQUFZLENBQUM7SUFDM0IsQ0FBQztJQUNELElBQUksV0FBVyxDQUFDLEtBQWM7UUFDNUIsSUFBSSxDQUFDLFlBQVksR0FBRyxxQkFBcUIsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNuRCxDQUFDO0lBY0QsU0FBUztRQUNQLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxZQUFZLEVBQUUsQ0FBQztRQUN2QyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUN6QixDQUFDOzs7WUE3Q0YsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSxXQUFXO2dCQUNyQixRQUFRLEVBQUUsVUFBVTtnQkFDcEIsSUFBSSxFQUFFO29CQUNKLG1CQUFtQixFQUFFLE1BQU07b0JBQzNCLCtCQUErQixFQUFFLGFBQWE7b0JBQzlDLE1BQU0sRUFBRSxPQUFPO2lCQUNoQjtnQkFDRCw0UEFBcUM7Z0JBRXJDLGFBQWEsRUFBRSxpQkFBaUIsQ0FBQyxJQUFJO2dCQUNyQyxlQUFlLEVBQUUsdUJBQXVCLENBQUMsTUFBTTs7YUFDaEQ7Ozs7WUFuQkMsaUJBQWlCOzs7NEJBcUJoQixXQUFXLFNBQUMsT0FBTzttQkFLbkIsS0FBSzswQkFHTCxLQUFLO29CQVVMLEtBQUs7d0JBR0wsS0FBSztxQkFHTCxNQUFNIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgQ29tcG9uZW50LFxuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgVmlld0VuY2Fwc3VsYXRpb24sXG4gIElucHV0LFxuICBPdXRwdXQsXG4gIEV2ZW50RW1pdHRlcixcbiAgQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gIEhvc3RCaW5kaW5nLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEJvb2xlYW5JbnB1dCwgY29lcmNlQm9vbGVhblByb3BlcnR5IH0gZnJvbSAnQGFuZ3VsYXIvY2RrL2NvZXJjaW9uJztcblxuZXhwb3J0IHR5cGUgTXR4QWxlcnRUeXBlID0gJ2RlZmF1bHQnIHwgJ2luZm8nIHwgJ3N1Y2Nlc3MnIHwgJ3dhcm5pbmcnIHwgJ2Rhbmdlcic7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ210eC1hbGVydCcsXG4gIGV4cG9ydEFzOiAnbXR4QWxlcnQnLFxuICBob3N0OiB7XG4gICAgJ1tjbGFzcy5tdHgtYWxlcnRdJzogJ3RydWUnLFxuICAgICdbY2xhc3MubXR4LWFsZXJ0LWRpc21pc3NpYmxlXSc6ICdkaXNtaXNzaWJsZScsXG4gICAgJ3JvbGUnOiAnYWxlcnQnLFxuICB9LFxuICB0ZW1wbGF0ZVVybDogJy4vYWxlcnQuY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsnLi9hbGVydC5jb21wb25lbnQuc2NzcyddLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbn0pXG5leHBvcnQgY2xhc3MgTXR4QWxlcnRDb21wb25lbnQge1xuICBASG9zdEJpbmRpbmcoJ2NsYXNzJykgZ2V0IGhvc3RDbGFzc0xpc3QoKSB7XG4gICAgcmV0dXJuIGBtdHgtYWxlcnQtJHt0aGlzLnR5cGV9IG1hdC1lbGV2YXRpb24teiR7dGhpcy5lbGV2YXRpb259YDtcbiAgfVxuXG4gIC8qKiBUaGUgYWxlcnQgdHlwZSAqL1xuICBASW5wdXQoKSB0eXBlOiBNdHhBbGVydFR5cGUgPSAnZGVmYXVsdCc7XG5cbiAgLyoqIFdoZXRoZXIgZGlzcGxheXMgYW4gaW5saW5lIGBDbG9zZWAgYnV0dG9uICovXG4gIEBJbnB1dCgpXG4gIGdldCBkaXNtaXNzaWJsZSgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fZGlzbWlzc2libGU7XG4gIH1cbiAgc2V0IGRpc21pc3NpYmxlKHZhbHVlOiBib29sZWFuKSB7XG4gICAgdGhpcy5fZGlzbWlzc2libGUgPSBjb2VyY2VCb29sZWFuUHJvcGVydHkodmFsdWUpO1xuICB9XG4gIHByaXZhdGUgX2Rpc21pc3NpYmxlID0gZmFsc2U7XG5cbiAgLyoqIFRoZSBhbGVydCB0ZXh0IGNvbG9yICovXG4gIEBJbnB1dCgpIGNvbG9yITogc3RyaW5nO1xuXG4gIC8qKiBNYXRlcmlhbCBlbGV2YXRpb24gKi9cbiAgQElucHV0KCkgZWxldmF0aW9uID0gMDtcblxuICAvKiogVGhpcyBldmVudCBmaXJlcyB3aGVuIGFsZXJ0IGNsb3NlZCwgJGV2ZW50IGlzIGFuIGluc3RhbmNlIG9mIEFsZXJ0IGNvbXBvbmVudCAqL1xuICBAT3V0cHV0KCkgY2xvc2VkID0gbmV3IEV2ZW50RW1pdHRlcjxNdHhBbGVydENvbXBvbmVudD4oKTtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9jaGFuZ2VEZXRlY3RvclJlZjogQ2hhbmdlRGV0ZWN0b3JSZWYpIHt9XG5cbiAgX29uQ2xvc2VkKCk6IHZvaWQge1xuICAgIHRoaXMuX2NoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpO1xuICAgIHRoaXMuY2xvc2VkLmVtaXQodGhpcyk7XG4gIH1cblxuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfZGlzbWlzc2libGU6IEJvb2xlYW5JbnB1dDtcbn1cbiJdfQ==