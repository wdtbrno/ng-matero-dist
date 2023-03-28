import { Component, ChangeDetectionStrategy, ViewEncapsulation, Input, Output, EventEmitter, HostBinding, } from '@angular/core';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
export class MtxAlert {
    get _hostClassList() {
        return `mtx-alert-${this.type} mat-elevation-z${this.elevation}`;
    }
    /** Whether to display an inline close button. */
    get dismissible() {
        return this._dismissible;
    }
    set dismissible(value) {
        this._dismissible = coerceBooleanProperty(value);
    }
    constructor(_changeDetectorRef) {
        this._changeDetectorRef = _changeDetectorRef;
        /** The alert's type. Can be `default`, `info`, `success`, `warning` or `danger`. */
        this.type = 'default';
        this._dismissible = false;
        /** The alert's elevation (0~24). */
        this.elevation = 0;
        /** Event emitted when the alert closed. */
        this.closed = new EventEmitter();
    }
    _onClosed() {
        this._changeDetectorRef.markForCheck();
        this.closed.emit(this);
    }
}
/** @nocollapse */ MtxAlert.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MtxAlert, deps: [{ token: i0.ChangeDetectorRef }], target: i0.ɵɵFactoryTarget.Component });
/** @nocollapse */ MtxAlert.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.1", type: MtxAlert, selector: "mtx-alert", inputs: { type: "type", dismissible: "dismissible", elevation: "elevation" }, outputs: { closed: "closed" }, host: { attributes: { "role": "alert" }, properties: { "class.mtx-alert": "true", "class.mtx-alert-dismissible": "dismissible", "class": "this._hostClassList" } }, exportAs: ["mtxAlert"], ngImport: i0, template: "<ng-content></ng-content>\n<ng-template [ngIf]=\"dismissible\">\n  <button type=\"button\" class=\"mtx-alert-close\" aria-label=\"Close\" (click)=\"_onClosed()\">\n    <span aria-hidden=\"true\">&times;</span>\n  </button>\n</ng-template>\n", styles: [".mtx-alert{position:relative;display:block;padding:.75rem 1.25rem;margin-bottom:1rem;border:1px solid transparent;border-radius:.25rem}.mtx-alert-close{position:absolute;top:0;bottom:0;right:0;padding:0 1.25rem;font-size:1.5rem;line-height:1;color:inherit;opacity:.5;background-color:transparent;border:0;cursor:pointer}[dir=rtl] .mtx-alert-close{right:auto;left:0}.mtx-alert-close:hover{opacity:.75}.mtx-alert-dismissible{padding-right:4rem}\n"], dependencies: [{ kind: "directive", type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MtxAlert, decorators: [{
            type: Component,
            args: [{ selector: 'mtx-alert', exportAs: 'mtxAlert', host: {
                        '[class.mtx-alert]': 'true',
                        '[class.mtx-alert-dismissible]': 'dismissible',
                        'role': 'alert',
                    }, encapsulation: ViewEncapsulation.None, changeDetection: ChangeDetectionStrategy.OnPush, template: "<ng-content></ng-content>\n<ng-template [ngIf]=\"dismissible\">\n  <button type=\"button\" class=\"mtx-alert-close\" aria-label=\"Close\" (click)=\"_onClosed()\">\n    <span aria-hidden=\"true\">&times;</span>\n  </button>\n</ng-template>\n", styles: [".mtx-alert{position:relative;display:block;padding:.75rem 1.25rem;margin-bottom:1rem;border:1px solid transparent;border-radius:.25rem}.mtx-alert-close{position:absolute;top:0;bottom:0;right:0;padding:0 1.25rem;font-size:1.5rem;line-height:1;color:inherit;opacity:.5;background-color:transparent;border:0;cursor:pointer}[dir=rtl] .mtx-alert-close{right:auto;left:0}.mtx-alert-close:hover{opacity:.75}.mtx-alert-dismissible{padding-right:4rem}\n"] }]
        }], ctorParameters: function () { return [{ type: i0.ChangeDetectorRef }]; }, propDecorators: { _hostClassList: [{
                type: HostBinding,
                args: ['class']
            }], type: [{
                type: Input
            }], dismissible: [{
                type: Input
            }], elevation: [{
                type: Input
            }], closed: [{
                type: Output
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWxlcnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wcm9qZWN0cy9leHRlbnNpb25zL2FsZXJ0L2FsZXJ0LnRzIiwiLi4vLi4vLi4vLi4vcHJvamVjdHMvZXh0ZW5zaW9ucy9hbGVydC9hbGVydC5odG1sIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFDTCxTQUFTLEVBQ1QsdUJBQXVCLEVBQ3ZCLGlCQUFpQixFQUNqQixLQUFLLEVBQ0wsTUFBTSxFQUNOLFlBQVksRUFFWixXQUFXLEdBQ1osTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFnQixxQkFBcUIsRUFBRSxNQUFNLHVCQUF1QixDQUFDOzs7QUFpQjVFLE1BQU0sT0FBTyxRQUFRO0lBQ25CLElBQ0ksY0FBYztRQUNoQixPQUFPLGFBQWEsSUFBSSxDQUFDLElBQUksbUJBQW1CLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztJQUNuRSxDQUFDO0lBS0QsaURBQWlEO0lBQ2pELElBQ0ksV0FBVztRQUNiLE9BQU8sSUFBSSxDQUFDLFlBQVksQ0FBQztJQUMzQixDQUFDO0lBQ0QsSUFBSSxXQUFXLENBQUMsS0FBYztRQUM1QixJQUFJLENBQUMsWUFBWSxHQUFHLHFCQUFxQixDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ25ELENBQUM7SUFTRCxZQUFvQixrQkFBcUM7UUFBckMsdUJBQWtCLEdBQWxCLGtCQUFrQixDQUFtQjtRQW5CekQsb0ZBQW9GO1FBQzNFLFNBQUksR0FBaUIsU0FBUyxDQUFDO1FBVWhDLGlCQUFZLEdBQUcsS0FBSyxDQUFDO1FBRTdCLG9DQUFvQztRQUMzQixjQUFTLEdBQUcsQ0FBQyxDQUFDO1FBRXZCLDJDQUEyQztRQUNqQyxXQUFNLEdBQUcsSUFBSSxZQUFZLEVBQVksQ0FBQztJQUVZLENBQUM7SUFFN0QsU0FBUztRQUNQLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxZQUFZLEVBQUUsQ0FBQztRQUN2QyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUN6QixDQUFDOzt3SEE5QlUsUUFBUTs0R0FBUixRQUFRLDBWQzNCckIsa1BBTUE7MkZEcUJhLFFBQVE7a0JBYnBCLFNBQVM7K0JBQ0UsV0FBVyxZQUNYLFVBQVUsUUFDZDt3QkFDSixtQkFBbUIsRUFBRSxNQUFNO3dCQUMzQiwrQkFBK0IsRUFBRSxhQUFhO3dCQUM5QyxNQUFNLEVBQUUsT0FBTztxQkFDaEIsaUJBR2MsaUJBQWlCLENBQUMsSUFBSSxtQkFDcEIsdUJBQXVCLENBQUMsTUFBTTt3R0FJM0MsY0FBYztzQkFEakIsV0FBVzt1QkFBQyxPQUFPO2dCQU1YLElBQUk7c0JBQVosS0FBSztnQkFJRixXQUFXO3NCQURkLEtBQUs7Z0JBVUcsU0FBUztzQkFBakIsS0FBSztnQkFHSSxNQUFNO3NCQUFmLE1BQU0iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBDb21wb25lbnQsXG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBWaWV3RW5jYXBzdWxhdGlvbixcbiAgSW5wdXQsXG4gIE91dHB1dCxcbiAgRXZlbnRFbWl0dGVyLFxuICBDaGFuZ2VEZXRlY3RvclJlZixcbiAgSG9zdEJpbmRpbmcsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQm9vbGVhbklucHV0LCBjb2VyY2VCb29sZWFuUHJvcGVydHkgfSBmcm9tICdAYW5ndWxhci9jZGsvY29lcmNpb24nO1xuXG5leHBvcnQgdHlwZSBNdHhBbGVydFR5cGUgPSAnZGVmYXVsdCcgfCAnaW5mbycgfCAnc3VjY2VzcycgfCAnd2FybmluZycgfCAnZGFuZ2VyJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbXR4LWFsZXJ0JyxcbiAgZXhwb3J0QXM6ICdtdHhBbGVydCcsXG4gIGhvc3Q6IHtcbiAgICAnW2NsYXNzLm10eC1hbGVydF0nOiAndHJ1ZScsXG4gICAgJ1tjbGFzcy5tdHgtYWxlcnQtZGlzbWlzc2libGVdJzogJ2Rpc21pc3NpYmxlJyxcbiAgICAncm9sZSc6ICdhbGVydCcsXG4gIH0sXG4gIHRlbXBsYXRlVXJsOiAnLi9hbGVydC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJy4vYWxlcnQuc2NzcyddLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbn0pXG5leHBvcnQgY2xhc3MgTXR4QWxlcnQge1xuICBASG9zdEJpbmRpbmcoJ2NsYXNzJylcbiAgZ2V0IF9ob3N0Q2xhc3NMaXN0KCkge1xuICAgIHJldHVybiBgbXR4LWFsZXJ0LSR7dGhpcy50eXBlfSBtYXQtZWxldmF0aW9uLXoke3RoaXMuZWxldmF0aW9ufWA7XG4gIH1cblxuICAvKiogVGhlIGFsZXJ0J3MgdHlwZS4gQ2FuIGJlIGBkZWZhdWx0YCwgYGluZm9gLCBgc3VjY2Vzc2AsIGB3YXJuaW5nYCBvciBgZGFuZ2VyYC4gKi9cbiAgQElucHV0KCkgdHlwZTogTXR4QWxlcnRUeXBlID0gJ2RlZmF1bHQnO1xuXG4gIC8qKiBXaGV0aGVyIHRvIGRpc3BsYXkgYW4gaW5saW5lIGNsb3NlIGJ1dHRvbi4gKi9cbiAgQElucHV0KClcbiAgZ2V0IGRpc21pc3NpYmxlKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9kaXNtaXNzaWJsZTtcbiAgfVxuICBzZXQgZGlzbWlzc2libGUodmFsdWU6IGJvb2xlYW4pIHtcbiAgICB0aGlzLl9kaXNtaXNzaWJsZSA9IGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSh2YWx1ZSk7XG4gIH1cbiAgcHJpdmF0ZSBfZGlzbWlzc2libGUgPSBmYWxzZTtcblxuICAvKiogVGhlIGFsZXJ0J3MgZWxldmF0aW9uICgwfjI0KS4gKi9cbiAgQElucHV0KCkgZWxldmF0aW9uID0gMDtcblxuICAvKiogRXZlbnQgZW1pdHRlZCB3aGVuIHRoZSBhbGVydCBjbG9zZWQuICovXG4gIEBPdXRwdXQoKSBjbG9zZWQgPSBuZXcgRXZlbnRFbWl0dGVyPE10eEFsZXJ0PigpO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgX2NoYW5nZURldGVjdG9yUmVmOiBDaGFuZ2VEZXRlY3RvclJlZikge31cblxuICBfb25DbG9zZWQoKTogdm9pZCB7XG4gICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCk7XG4gICAgdGhpcy5jbG9zZWQuZW1pdCh0aGlzKTtcbiAgfVxuXG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9kaXNtaXNzaWJsZTogQm9vbGVhbklucHV0O1xufVxuIiwiPG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PlxuPG5nLXRlbXBsYXRlIFtuZ0lmXT1cImRpc21pc3NpYmxlXCI+XG4gIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwibXR4LWFsZXJ0LWNsb3NlXCIgYXJpYS1sYWJlbD1cIkNsb3NlXCIgKGNsaWNrKT1cIl9vbkNsb3NlZCgpXCI+XG4gICAgPHNwYW4gYXJpYS1oaWRkZW49XCJ0cnVlXCI+JnRpbWVzOzwvc3Bhbj5cbiAgPC9idXR0b24+XG48L25nLXRlbXBsYXRlPlxuIl19