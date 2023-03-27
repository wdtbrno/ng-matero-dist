import { Component, Input, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
export class MtxProgressComponent {
    constructor() {
        /** The progress type */
        this.type = 'info';
        /** The progress value */
        this.value = 0;
        this._striped = false;
        this._animate = false;
    }
    /** Whether applies striped class */
    get striped() {
        return this._striped;
    }
    set striped(value) {
        this._striped = coerceBooleanProperty(value);
    }
    /** Whether applies animated class */
    get animate() {
        return this._animate;
    }
    set animate(value) {
        this._animate = coerceBooleanProperty(value);
    }
}
MtxProgressComponent.decorators = [
    { type: Component, args: [{
                selector: 'mtx-progress',
                exportAs: 'mtxProgress',
                host: {
                    'class': 'mtx-progress',
                    '[style.height]': 'height',
                    '[style.backgroundColor]': 'background',
                },
                template: "<div [class]=\"'mtx-progress-fill mtx-progress-fill-' + type\"\n     [ngClass]=\"{'mtx-progress-fill-striped': striped, 'mtx-progress-fill-animated': animate}\"\n     [ngStyle]=\"{ 'width.%': value, 'background-color': foreground }\"\n     role=\"progress-fill\">\n  <ng-content></ng-content>\n</div>\n",
                encapsulation: ViewEncapsulation.None,
                changeDetection: ChangeDetectionStrategy.OnPush,
                styles: [".mtx-progress{display:flex;height:1rem;margin:8px 0;overflow:hidden;font-size:.75rem;border-radius:.25rem}.mtx-progress-fill{display:flex;flex-direction:column;justify-content:center;text-align:center;transition:width .6s ease}.mtx-progress-fill-striped{background-image:linear-gradient(45deg,hsla(0,0%,100%,.15) 25%,transparent 0,transparent 50%,hsla(0,0%,100%,.15) 0,hsla(0,0%,100%,.15) 75%,transparent 0,transparent);background-size:1rem 1rem}.mtx-progress-fill-animated{-webkit-animation:mtx-progress-fill-stripes 1s linear infinite;animation:mtx-progress-fill-stripes 1s linear infinite}@media (prefers-reduced-motion:reduce){.mtx-progress-fill-animated{-webkit-animation:none;animation:none}}@-webkit-keyframes mtx-progress-fill-stripes{0%{background-position:1rem 0}to{background-position:0 0}}@keyframes mtx-progress-fill-stripes{0%{background-position:1rem 0}to{background-position:0 0}}"]
            },] }
];
MtxProgressComponent.propDecorators = {
    type: [{ type: Input }],
    value: [{ type: Input }],
    height: [{ type: Input }],
    color: [{ type: Input }],
    foreground: [{ type: Input }],
    background: [{ type: Input }],
    striped: [{ type: Input }],
    animate: [{ type: Input }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvZ3Jlc3MuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vcHJvamVjdHMvZXh0ZW5zaW9ucy9wcm9ncmVzcy9wcm9ncmVzcy5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQUUsaUJBQWlCLEVBQUUsdUJBQXVCLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDN0YsT0FBTyxFQUFnQixxQkFBcUIsRUFBRSxNQUFNLHVCQUF1QixDQUFDO0FBaUI1RSxNQUFNLE9BQU8sb0JBQW9CO0lBYmpDO1FBY0Usd0JBQXdCO1FBQ2YsU0FBSSxHQUFvQixNQUFNLENBQUM7UUFFeEMseUJBQXlCO1FBQ2hCLFVBQUssR0FBRyxDQUFDLENBQUM7UUFzQlgsYUFBUSxHQUFHLEtBQUssQ0FBQztRQVVqQixhQUFRLEdBQUcsS0FBSyxDQUFDO0lBSTNCLENBQUM7SUF0QkMsb0NBQW9DO0lBQ3BDLElBQ0ksT0FBTztRQUNULE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQztJQUN2QixDQUFDO0lBQ0QsSUFBSSxPQUFPLENBQUMsS0FBYztRQUN4QixJQUFJLENBQUMsUUFBUSxHQUFHLHFCQUFxQixDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQy9DLENBQUM7SUFHRCxxQ0FBcUM7SUFDckMsSUFDSSxPQUFPO1FBQ1QsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDO0lBQ3ZCLENBQUM7SUFDRCxJQUFJLE9BQU8sQ0FBQyxLQUFjO1FBQ3hCLElBQUksQ0FBQyxRQUFRLEdBQUcscUJBQXFCLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDL0MsQ0FBQzs7O1lBakRGLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsY0FBYztnQkFDeEIsUUFBUSxFQUFFLGFBQWE7Z0JBQ3ZCLElBQUksRUFBRTtvQkFDSixPQUFPLEVBQUUsY0FBYztvQkFDdkIsZ0JBQWdCLEVBQUUsUUFBUTtvQkFDMUIseUJBQXlCLEVBQUUsWUFBWTtpQkFDeEM7Z0JBQ0QsMFRBQXdDO2dCQUV4QyxhQUFhLEVBQUUsaUJBQWlCLENBQUMsSUFBSTtnQkFDckMsZUFBZSxFQUFFLHVCQUF1QixDQUFDLE1BQU07O2FBQ2hEOzs7bUJBR0UsS0FBSztvQkFHTCxLQUFLO3FCQUdMLEtBQUs7b0JBR0wsS0FBSzt5QkFHTCxLQUFLO3lCQUdMLEtBQUs7c0JBR0wsS0FBSztzQkFVTCxLQUFLIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBJbnB1dCwgVmlld0VuY2Fwc3VsYXRpb24sIENoYW5nZURldGVjdGlvblN0cmF0ZWd5IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBCb29sZWFuSW5wdXQsIGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSB9IGZyb20gJ0Bhbmd1bGFyL2Nkay9jb2VyY2lvbic7XG5cbmV4cG9ydCB0eXBlIE10eFByb2dyZXNzVHlwZSA9ICdkZWZhdWx0JyB8ICdpbmZvJyB8ICdzdWNjZXNzJyB8ICd3YXJuaW5nJyB8ICdkYW5nZXInO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdtdHgtcHJvZ3Jlc3MnLFxuICBleHBvcnRBczogJ210eFByb2dyZXNzJyxcbiAgaG9zdDoge1xuICAgICdjbGFzcyc6ICdtdHgtcHJvZ3Jlc3MnLFxuICAgICdbc3R5bGUuaGVpZ2h0XSc6ICdoZWlnaHQnLFxuICAgICdbc3R5bGUuYmFja2dyb3VuZENvbG9yXSc6ICdiYWNrZ3JvdW5kJyxcbiAgfSxcbiAgdGVtcGxhdGVVcmw6ICcuL3Byb2dyZXNzLmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJy4vcHJvZ3Jlc3MuY29tcG9uZW50LnNjc3MnXSxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG59KVxuZXhwb3J0IGNsYXNzIE10eFByb2dyZXNzQ29tcG9uZW50IHtcbiAgLyoqIFRoZSBwcm9ncmVzcyB0eXBlICovXG4gIEBJbnB1dCgpIHR5cGU6IE10eFByb2dyZXNzVHlwZSA9ICdpbmZvJztcblxuICAvKiogVGhlIHByb2dyZXNzIHZhbHVlICovXG4gIEBJbnB1dCgpIHZhbHVlID0gMDtcblxuICAvKiogVGhlIHByb2dyZXNzIGhlaWdodCAqL1xuICBASW5wdXQoKSBoZWlnaHQ6IHN0cmluZztcblxuICAvKiogVGhlIHByb2dyZXNzIHRleHQgY29sb3IgKi9cbiAgQElucHV0KCkgY29sb3I6IHN0cmluZztcblxuICAvKiogVGhlIHByb2dyZXNzIGJhciBjb2xvciAqL1xuICBASW5wdXQoKSBmb3JlZ3JvdW5kOiBzdHJpbmc7XG5cbiAgLyoqIFRoZSBwcm9ncmVzcyB0cmFjayBjb2xvciAqL1xuICBASW5wdXQoKSBiYWNrZ3JvdW5kOiBzdHJpbmc7XG5cbiAgLyoqIFdoZXRoZXIgYXBwbGllcyBzdHJpcGVkIGNsYXNzICovXG4gIEBJbnB1dCgpXG4gIGdldCBzdHJpcGVkKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9zdHJpcGVkO1xuICB9XG4gIHNldCBzdHJpcGVkKHZhbHVlOiBib29sZWFuKSB7XG4gICAgdGhpcy5fc3RyaXBlZCA9IGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSh2YWx1ZSk7XG4gIH1cbiAgcHJpdmF0ZSBfc3RyaXBlZCA9IGZhbHNlO1xuXG4gIC8qKiBXaGV0aGVyIGFwcGxpZXMgYW5pbWF0ZWQgY2xhc3MgKi9cbiAgQElucHV0KClcbiAgZ2V0IGFuaW1hdGUoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX2FuaW1hdGU7XG4gIH1cbiAgc2V0IGFuaW1hdGUodmFsdWU6IGJvb2xlYW4pIHtcbiAgICB0aGlzLl9hbmltYXRlID0gY29lcmNlQm9vbGVhblByb3BlcnR5KHZhbHVlKTtcbiAgfVxuICBwcml2YXRlIF9hbmltYXRlID0gZmFsc2U7XG5cbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX3N0cmlwZWQ6IEJvb2xlYW5JbnB1dDtcbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX2FuaW1hdGU6IEJvb2xlYW5JbnB1dDtcbn1cbiJdfQ==