import { Component, Input, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
export class MtxProgress {
    constructor() {
        /** The progress's type. Can be `default`, `info`, `success`, `warning` or `danger`. */
        this.type = 'info';
        /** The value of the progress. */
        this.value = 0;
        this._striped = false;
        this._animate = false;
    }
    /** Whether to apply the striped class. */
    get striped() {
        return this._striped;
    }
    set striped(value) {
        this._striped = coerceBooleanProperty(value);
    }
    /** Whether to apply the animated class. */
    get animate() {
        return this._animate;
    }
    set animate(value) {
        this._animate = coerceBooleanProperty(value);
    }
}
/** @nocollapse */ MtxProgress.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MtxProgress, deps: [], target: i0.ɵɵFactoryTarget.Component });
/** @nocollapse */ MtxProgress.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.1", type: MtxProgress, selector: "mtx-progress", inputs: { type: "type", value: "value", height: "height", color: "color", foreground: "foreground", background: "background", striped: "striped", animate: "animate" }, host: { properties: { "style.height": "height", "style.backgroundColor": "background" }, classAttribute: "mtx-progress" }, exportAs: ["mtxProgress"], ngImport: i0, template: "<div [class]=\"'mtx-progress-fill mtx-progress-fill-' + type\"\n     [ngClass]=\"{'mtx-progress-fill-striped': striped, 'mtx-progress-fill-animated': animate}\"\n     [ngStyle]=\"{ 'width.%': value, 'background-color': foreground }\"\n     role=\"progress-fill\">\n  <ng-content></ng-content>\n</div>\n", styles: [".mtx-progress{display:flex;height:1rem;margin:8px 0;overflow:hidden;font-size:.75rem;border-radius:.25rem}.mtx-progress-fill{display:flex;flex-direction:column;justify-content:center;text-align:center;transition:width .6s ease}.mtx-progress-fill-striped{background-image:linear-gradient(45deg,rgba(255,255,255,.15) 25%,transparent 25%,transparent 50%,rgba(255,255,255,.15) 50%,rgba(255,255,255,.15) 75%,transparent 75%,transparent);background-size:1rem 1rem}.mtx-progress-fill-animated{animation:mtx-progress-fill-stripes 1s linear infinite}@media (prefers-reduced-motion: reduce){.mtx-progress-fill-animated{animation:none}}@keyframes mtx-progress-fill-stripes{0%{background-position:1rem 0}to{background-position:0 0}}\n"], dependencies: [{ kind: "directive", type: i1.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i1.NgStyle, selector: "[ngStyle]", inputs: ["ngStyle"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MtxProgress, decorators: [{
            type: Component,
            args: [{ selector: 'mtx-progress', exportAs: 'mtxProgress', host: {
                        'class': 'mtx-progress',
                        '[style.height]': 'height',
                        '[style.backgroundColor]': 'background',
                    }, encapsulation: ViewEncapsulation.None, changeDetection: ChangeDetectionStrategy.OnPush, template: "<div [class]=\"'mtx-progress-fill mtx-progress-fill-' + type\"\n     [ngClass]=\"{'mtx-progress-fill-striped': striped, 'mtx-progress-fill-animated': animate}\"\n     [ngStyle]=\"{ 'width.%': value, 'background-color': foreground }\"\n     role=\"progress-fill\">\n  <ng-content></ng-content>\n</div>\n", styles: [".mtx-progress{display:flex;height:1rem;margin:8px 0;overflow:hidden;font-size:.75rem;border-radius:.25rem}.mtx-progress-fill{display:flex;flex-direction:column;justify-content:center;text-align:center;transition:width .6s ease}.mtx-progress-fill-striped{background-image:linear-gradient(45deg,rgba(255,255,255,.15) 25%,transparent 25%,transparent 50%,rgba(255,255,255,.15) 50%,rgba(255,255,255,.15) 75%,transparent 75%,transparent);background-size:1rem 1rem}.mtx-progress-fill-animated{animation:mtx-progress-fill-stripes 1s linear infinite}@media (prefers-reduced-motion: reduce){.mtx-progress-fill-animated{animation:none}}@keyframes mtx-progress-fill-stripes{0%{background-position:1rem 0}to{background-position:0 0}}\n"] }]
        }], propDecorators: { type: [{
                type: Input
            }], value: [{
                type: Input
            }], height: [{
                type: Input
            }], color: [{
                type: Input
            }], foreground: [{
                type: Input
            }], background: [{
                type: Input
            }], striped: [{
                type: Input
            }], animate: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvZ3Jlc3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wcm9qZWN0cy9leHRlbnNpb25zL3Byb2dyZXNzL3Byb2dyZXNzLnRzIiwiLi4vLi4vLi4vLi4vcHJvamVjdHMvZXh0ZW5zaW9ucy9wcm9ncmVzcy9wcm9ncmVzcy5odG1sIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFFLGlCQUFpQixFQUFFLHVCQUF1QixFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzdGLE9BQU8sRUFBZ0IscUJBQXFCLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQzs7O0FBaUI1RSxNQUFNLE9BQU8sV0FBVztJQWJ4QjtRQWNFLHVGQUF1RjtRQUM5RSxTQUFJLEdBQW9CLE1BQU0sQ0FBQztRQUV4QyxpQ0FBaUM7UUFDeEIsVUFBSyxHQUFHLENBQUMsQ0FBQztRQXNCWCxhQUFRLEdBQUcsS0FBSyxDQUFDO1FBVWpCLGFBQVEsR0FBRyxLQUFLLENBQUM7S0FJMUI7SUF0QkMsMENBQTBDO0lBQzFDLElBQ0ksT0FBTztRQUNULE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQztJQUN2QixDQUFDO0lBQ0QsSUFBSSxPQUFPLENBQUMsS0FBYztRQUN4QixJQUFJLENBQUMsUUFBUSxHQUFHLHFCQUFxQixDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQy9DLENBQUM7SUFHRCwyQ0FBMkM7SUFDM0MsSUFDSSxPQUFPO1FBQ1QsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDO0lBQ3ZCLENBQUM7SUFDRCxJQUFJLE9BQU8sQ0FBQyxLQUFjO1FBQ3hCLElBQUksQ0FBQyxRQUFRLEdBQUcscUJBQXFCLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDL0MsQ0FBQzs7MkhBcENVLFdBQVc7K0dBQVgsV0FBVyxrWENsQnhCLGdUQU1BOzJGRFlhLFdBQVc7a0JBYnZCLFNBQVM7K0JBQ0UsY0FBYyxZQUNkLGFBQWEsUUFDakI7d0JBQ0osT0FBTyxFQUFFLGNBQWM7d0JBQ3ZCLGdCQUFnQixFQUFFLFFBQVE7d0JBQzFCLHlCQUF5QixFQUFFLFlBQVk7cUJBQ3hDLGlCQUdjLGlCQUFpQixDQUFDLElBQUksbUJBQ3BCLHVCQUF1QixDQUFDLE1BQU07OEJBSXRDLElBQUk7c0JBQVosS0FBSztnQkFHRyxLQUFLO3NCQUFiLEtBQUs7Z0JBR0csTUFBTTtzQkFBZCxLQUFLO2dCQUdHLEtBQUs7c0JBQWIsS0FBSztnQkFHRyxVQUFVO3NCQUFsQixLQUFLO2dCQUdHLFVBQVU7c0JBQWxCLEtBQUs7Z0JBSUYsT0FBTztzQkFEVixLQUFLO2dCQVdGLE9BQU87c0JBRFYsS0FBSyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgSW5wdXQsIFZpZXdFbmNhcHN1bGF0aW9uLCBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQm9vbGVhbklucHV0LCBjb2VyY2VCb29sZWFuUHJvcGVydHkgfSBmcm9tICdAYW5ndWxhci9jZGsvY29lcmNpb24nO1xuXG5leHBvcnQgdHlwZSBNdHhQcm9ncmVzc1R5cGUgPSAnZGVmYXVsdCcgfCAnaW5mbycgfCAnc3VjY2VzcycgfCAnd2FybmluZycgfCAnZGFuZ2VyJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbXR4LXByb2dyZXNzJyxcbiAgZXhwb3J0QXM6ICdtdHhQcm9ncmVzcycsXG4gIGhvc3Q6IHtcbiAgICAnY2xhc3MnOiAnbXR4LXByb2dyZXNzJyxcbiAgICAnW3N0eWxlLmhlaWdodF0nOiAnaGVpZ2h0JyxcbiAgICAnW3N0eWxlLmJhY2tncm91bmRDb2xvcl0nOiAnYmFja2dyb3VuZCcsXG4gIH0sXG4gIHRlbXBsYXRlVXJsOiAnLi9wcm9ncmVzcy5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJy4vcHJvZ3Jlc3Muc2NzcyddLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbn0pXG5leHBvcnQgY2xhc3MgTXR4UHJvZ3Jlc3Mge1xuICAvKiogVGhlIHByb2dyZXNzJ3MgdHlwZS4gQ2FuIGJlIGBkZWZhdWx0YCwgYGluZm9gLCBgc3VjY2Vzc2AsIGB3YXJuaW5nYCBvciBgZGFuZ2VyYC4gKi9cbiAgQElucHV0KCkgdHlwZTogTXR4UHJvZ3Jlc3NUeXBlID0gJ2luZm8nO1xuXG4gIC8qKiBUaGUgdmFsdWUgb2YgdGhlIHByb2dyZXNzLiAqL1xuICBASW5wdXQoKSB2YWx1ZSA9IDA7XG5cbiAgLyoqIFRoZSBoZWlnaHQgb2YgdGhlIHByb2dyZXNzLiAqL1xuICBASW5wdXQoKSBoZWlnaHQhOiBzdHJpbmc7XG5cbiAgLyoqIFRoZSB0ZXh0IGNvbG9yIG9mIHRoZSBwcm9ncmVzcy4gKi9cbiAgQElucHV0KCkgY29sb3IhOiBzdHJpbmc7XG5cbiAgLyoqIFRoZSBiYXIgY29sb3Igb2YgdGhlIHByb2dyZXNzLiAqL1xuICBASW5wdXQoKSBmb3JlZ3JvdW5kITogc3RyaW5nO1xuXG4gIC8qKiBUaGUgdHJhY2sgY29sb3Igb2YgdGhlIHByb2dyZXNzLiAqL1xuICBASW5wdXQoKSBiYWNrZ3JvdW5kITogc3RyaW5nO1xuXG4gIC8qKiBXaGV0aGVyIHRvIGFwcGx5IHRoZSBzdHJpcGVkIGNsYXNzLiAqL1xuICBASW5wdXQoKVxuICBnZXQgc3RyaXBlZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fc3RyaXBlZDtcbiAgfVxuICBzZXQgc3RyaXBlZCh2YWx1ZTogYm9vbGVhbikge1xuICAgIHRoaXMuX3N0cmlwZWQgPSBjb2VyY2VCb29sZWFuUHJvcGVydHkodmFsdWUpO1xuICB9XG4gIHByaXZhdGUgX3N0cmlwZWQgPSBmYWxzZTtcblxuICAvKiogV2hldGhlciB0byBhcHBseSB0aGUgYW5pbWF0ZWQgY2xhc3MuICovXG4gIEBJbnB1dCgpXG4gIGdldCBhbmltYXRlKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9hbmltYXRlO1xuICB9XG4gIHNldCBhbmltYXRlKHZhbHVlOiBib29sZWFuKSB7XG4gICAgdGhpcy5fYW5pbWF0ZSA9IGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSh2YWx1ZSk7XG4gIH1cbiAgcHJpdmF0ZSBfYW5pbWF0ZSA9IGZhbHNlO1xuXG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9zdHJpcGVkOiBCb29sZWFuSW5wdXQ7XG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9hbmltYXRlOiBCb29sZWFuSW5wdXQ7XG59XG4iLCI8ZGl2IFtjbGFzc109XCInbXR4LXByb2dyZXNzLWZpbGwgbXR4LXByb2dyZXNzLWZpbGwtJyArIHR5cGVcIlxuICAgICBbbmdDbGFzc109XCJ7J210eC1wcm9ncmVzcy1maWxsLXN0cmlwZWQnOiBzdHJpcGVkLCAnbXR4LXByb2dyZXNzLWZpbGwtYW5pbWF0ZWQnOiBhbmltYXRlfVwiXG4gICAgIFtuZ1N0eWxlXT1cInsgJ3dpZHRoLiUnOiB2YWx1ZSwgJ2JhY2tncm91bmQtY29sb3InOiBmb3JlZ3JvdW5kIH1cIlxuICAgICByb2xlPVwicHJvZ3Jlc3MtZmlsbFwiPlxuICA8bmctY29udGVudD48L25nLWNvbnRlbnQ+XG48L2Rpdj5cbiJdfQ==