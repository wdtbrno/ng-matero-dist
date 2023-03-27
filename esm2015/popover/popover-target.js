import { Directive, ElementRef } from '@angular/core';
export class MtxPopoverTarget {
    constructor(_elementRef) {
        this._elementRef = _elementRef;
    }
}
MtxPopoverTarget.decorators = [
    { type: Directive, args: [{
                selector: 'mtx-popover-target, [mtxPopoverTarget]',
                exportAs: 'mtxPopoverTarget',
            },] }
];
/** @nocollapse */
MtxPopoverTarget.ctorParameters = () => [
    { type: ElementRef }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9wb3Zlci10YXJnZXQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wcm9qZWN0cy9leHRlbnNpb25zL3BvcG92ZXIvcG9wb3Zlci10YXJnZXQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFNdEQsTUFBTSxPQUFPLGdCQUFnQjtJQUMzQixZQUFtQixXQUF1QjtRQUF2QixnQkFBVyxHQUFYLFdBQVcsQ0FBWTtJQUFHLENBQUM7OztZQUwvQyxTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLHdDQUF3QztnQkFDbEQsUUFBUSxFQUFFLGtCQUFrQjthQUM3Qjs7OztZQUxtQixVQUFVIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRGlyZWN0aXZlLCBFbGVtZW50UmVmIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcblxyXG5ARGlyZWN0aXZlKHtcclxuICBzZWxlY3RvcjogJ210eC1wb3BvdmVyLXRhcmdldCwgW210eFBvcG92ZXJUYXJnZXRdJyxcclxuICBleHBvcnRBczogJ210eFBvcG92ZXJUYXJnZXQnLFxyXG59KVxyXG5leHBvcnQgY2xhc3MgTXR4UG9wb3ZlclRhcmdldCB7XHJcbiAgY29uc3RydWN0b3IocHVibGljIF9lbGVtZW50UmVmOiBFbGVtZW50UmVmKSB7fVxyXG59XHJcbiJdfQ==