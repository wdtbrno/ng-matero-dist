import { Component, ChangeDetectionStrategy, ViewEncapsulation, Input, ChangeDetectorRef, } from '@angular/core';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
export class MtxLoaderComponent {
    constructor(_changeDetectorRef) {
        this._changeDetectorRef = _changeDetectorRef;
        this.type = 'spinner';
        this.color = 'primary';
        this.mode = 'indeterminate';
        this.value = 0;
        this.strokeWidth = 4; // only support spinner
        this.diameter = 48; // only support spinner
        this.bufferValue = 0; // only support progresbar
        this._loading = true;
        this._hasBackdrop = true;
    }
    get loading() {
        return this._loading;
    }
    set loading(value) {
        this._loading = coerceBooleanProperty(value);
    }
    get hasBackdrop() {
        return this._hasBackdrop;
    }
    set hasBackdrop(value) {
        this._hasBackdrop = coerceBooleanProperty(value);
    }
}
MtxLoaderComponent.decorators = [
    { type: Component, args: [{
                selector: 'mtx-loader',
                exportAs: 'mtxLoader',
                host: {
                    'class': 'mtx-loader',
                    '[class.mtx-loader-loading]': 'loading',
                },
                template: "<div class=\"mtx-loader-backdrop\" *ngIf=\"loading && hasBackdrop\"></div>\r\n<div class=\"mtx-loader-main\" *ngIf=\"loading\">\r\n  <mat-spinner *ngIf=\"type==='spinner'\"\r\n               [color]=\"color\"\r\n               [strokeWidth]=\"strokeWidth\"\r\n               [diameter]=\"diameter\"\r\n               [mode]=\"$any(mode)\"\r\n               [value]=\"value\">\r\n  </mat-spinner>\r\n\r\n  <mat-progress-bar *ngIf=\"type==='progressbar'\"\r\n                    [color]=\"color\"\r\n                    [mode]=\"$any(mode)\"\r\n                    [value]=\"value\"\r\n                    [bufferValue]=\"bufferValue\">\r\n  </mat-progress-bar>\r\n</div>\r\n<ng-content></ng-content>\r\n",
                encapsulation: ViewEncapsulation.None,
                changeDetection: ChangeDetectionStrategy.OnPush,
                styles: [".mtx-loader{position:relative;display:block;width:100%;height:100%}.mtx-loader-main{position:absolute;top:0;left:0;z-index:2;display:flex;justify-content:center;align-items:center;width:100%;height:100%}.mtx-loader-main .mat-spinner{position:relative}.mtx-loader-backdrop,.mtx-loader-main .mat-progress-bar{position:absolute;top:0;left:0;width:100%}.mtx-loader-backdrop{display:block;z-index:1;height:100%;content:\"\"}"]
            },] }
];
/** @nocollapse */
MtxLoaderComponent.ctorParameters = () => [
    { type: ChangeDetectorRef }
];
MtxLoaderComponent.propDecorators = {
    type: [{ type: Input }],
    color: [{ type: Input }],
    mode: [{ type: Input }],
    value: [{ type: Input }],
    strokeWidth: [{ type: Input }],
    diameter: [{ type: Input }],
    bufferValue: [{ type: Input }],
    loading: [{ type: Input }],
    hasBackdrop: [{ type: Input }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9hZGVyLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL2V4dGVuc2lvbnMvbG9hZGVyL2xvYWRlci5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUNMLFNBQVMsRUFDVCx1QkFBdUIsRUFDdkIsaUJBQWlCLEVBQ2pCLEtBQUssRUFDTCxpQkFBaUIsR0FDbEIsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFnQixxQkFBcUIsRUFBRSxNQUFNLHVCQUF1QixDQUFDO0FBbUI1RSxNQUFNLE9BQU8sa0JBQWtCO0lBMEI3QixZQUFvQixrQkFBcUM7UUFBckMsdUJBQWtCLEdBQWxCLGtCQUFrQixDQUFtQjtRQXpCaEQsU0FBSSxHQUFrQixTQUFTLENBQUM7UUFDaEMsVUFBSyxHQUFpQixTQUFTLENBQUM7UUFDaEMsU0FBSSxHQUEwQyxlQUFlLENBQUM7UUFDOUQsVUFBSyxHQUFHLENBQUMsQ0FBQztRQUNWLGdCQUFXLEdBQUcsQ0FBQyxDQUFDLENBQUMsdUJBQXVCO1FBQ3hDLGFBQVEsR0FBRyxFQUFFLENBQUMsQ0FBQyx1QkFBdUI7UUFDdEMsZ0JBQVcsR0FBRyxDQUFDLENBQUMsQ0FBQywwQkFBMEI7UUFRNUMsYUFBUSxHQUFHLElBQUksQ0FBQztRQVNoQixpQkFBWSxHQUFHLElBQUksQ0FBQztJQUVnQyxDQUFDO0lBbEI3RCxJQUNJLE9BQU87UUFDVCxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUM7SUFDdkIsQ0FBQztJQUNELElBQUksT0FBTyxDQUFDLEtBQWM7UUFDeEIsSUFBSSxDQUFDLFFBQVEsR0FBRyxxQkFBcUIsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUMvQyxDQUFDO0lBR0QsSUFDSSxXQUFXO1FBQ2IsT0FBTyxJQUFJLENBQUMsWUFBWSxDQUFDO0lBQzNCLENBQUM7SUFDRCxJQUFJLFdBQVcsQ0FBQyxLQUFjO1FBQzVCLElBQUksQ0FBQyxZQUFZLEdBQUcscUJBQXFCLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDbkQsQ0FBQzs7O1lBbkNGLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsWUFBWTtnQkFDdEIsUUFBUSxFQUFFLFdBQVc7Z0JBQ3JCLElBQUksRUFBRTtvQkFDSixPQUFPLEVBQUUsWUFBWTtvQkFDckIsNEJBQTRCLEVBQUUsU0FBUztpQkFDeEM7Z0JBQ0QsMHNCQUFzQztnQkFFdEMsYUFBYSxFQUFFLGlCQUFpQixDQUFDLElBQUk7Z0JBQ3JDLGVBQWUsRUFBRSx1QkFBdUIsQ0FBQyxNQUFNOzthQUNoRDs7OztZQXBCQyxpQkFBaUI7OzttQkFzQmhCLEtBQUs7b0JBQ0wsS0FBSzttQkFDTCxLQUFLO29CQUNMLEtBQUs7MEJBQ0wsS0FBSzt1QkFDTCxLQUFLOzBCQUNMLEtBQUs7c0JBQ0wsS0FBSzswQkFTTCxLQUFLIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcclxuICBDb21wb25lbnQsXHJcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXHJcbiAgVmlld0VuY2Fwc3VsYXRpb24sXHJcbiAgSW5wdXQsXHJcbiAgQ2hhbmdlRGV0ZWN0b3JSZWYsXHJcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IEJvb2xlYW5JbnB1dCwgY29lcmNlQm9vbGVhblByb3BlcnR5IH0gZnJvbSAnQGFuZ3VsYXIvY2RrL2NvZXJjaW9uJztcclxuaW1wb3J0IHsgVGhlbWVQYWxldHRlIH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvY29yZSc7XHJcbmltcG9ydCB7IFByb2dyZXNzQmFyTW9kZSB9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL3Byb2dyZXNzLWJhcic7XHJcbmltcG9ydCB7IFByb2dyZXNzU3Bpbm5lck1vZGUgfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9wcm9ncmVzcy1zcGlubmVyJztcclxuXHJcbmV4cG9ydCB0eXBlIE10eExvYWRlclR5cGUgPSAnc3Bpbm5lcicgfCAncHJvZ3Jlc3NiYXInO1xyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgc2VsZWN0b3I6ICdtdHgtbG9hZGVyJyxcclxuICBleHBvcnRBczogJ210eExvYWRlcicsXHJcbiAgaG9zdDoge1xyXG4gICAgJ2NsYXNzJzogJ210eC1sb2FkZXInLFxyXG4gICAgJ1tjbGFzcy5tdHgtbG9hZGVyLWxvYWRpbmddJzogJ2xvYWRpbmcnLFxyXG4gIH0sXHJcbiAgdGVtcGxhdGVVcmw6ICcuL2xvYWRlci5jb21wb25lbnQuaHRtbCcsXHJcbiAgc3R5bGVVcmxzOiBbJy4vbG9hZGVyLmNvbXBvbmVudC5zY3NzJ10sXHJcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcclxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcclxufSlcclxuZXhwb3J0IGNsYXNzIE10eExvYWRlckNvbXBvbmVudCB7XHJcbiAgQElucHV0KCkgdHlwZTogTXR4TG9hZGVyVHlwZSA9ICdzcGlubmVyJztcclxuICBASW5wdXQoKSBjb2xvcjogVGhlbWVQYWxldHRlID0gJ3ByaW1hcnknO1xyXG4gIEBJbnB1dCgpIG1vZGU6IFByb2dyZXNzU3Bpbm5lck1vZGUgfCBQcm9ncmVzc0Jhck1vZGUgPSAnaW5kZXRlcm1pbmF0ZSc7XHJcbiAgQElucHV0KCkgdmFsdWUgPSAwO1xyXG4gIEBJbnB1dCgpIHN0cm9rZVdpZHRoID0gNDsgLy8gb25seSBzdXBwb3J0IHNwaW5uZXJcclxuICBASW5wdXQoKSBkaWFtZXRlciA9IDQ4OyAvLyBvbmx5IHN1cHBvcnQgc3Bpbm5lclxyXG4gIEBJbnB1dCgpIGJ1ZmZlclZhbHVlID0gMDsgLy8gb25seSBzdXBwb3J0IHByb2dyZXNiYXJcclxuICBASW5wdXQoKVxyXG4gIGdldCBsb2FkaW5nKCk6IGJvb2xlYW4ge1xyXG4gICAgcmV0dXJuIHRoaXMuX2xvYWRpbmc7XHJcbiAgfVxyXG4gIHNldCBsb2FkaW5nKHZhbHVlOiBib29sZWFuKSB7XHJcbiAgICB0aGlzLl9sb2FkaW5nID0gY29lcmNlQm9vbGVhblByb3BlcnR5KHZhbHVlKTtcclxuICB9XHJcbiAgcHJpdmF0ZSBfbG9hZGluZyA9IHRydWU7XHJcblxyXG4gIEBJbnB1dCgpXHJcbiAgZ2V0IGhhc0JhY2tkcm9wKCk6IGJvb2xlYW4ge1xyXG4gICAgcmV0dXJuIHRoaXMuX2hhc0JhY2tkcm9wO1xyXG4gIH1cclxuICBzZXQgaGFzQmFja2Ryb3AodmFsdWU6IGJvb2xlYW4pIHtcclxuICAgIHRoaXMuX2hhc0JhY2tkcm9wID0gY29lcmNlQm9vbGVhblByb3BlcnR5KHZhbHVlKTtcclxuICB9XHJcbiAgcHJpdmF0ZSBfaGFzQmFja2Ryb3AgPSB0cnVlO1xyXG5cclxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9jaGFuZ2VEZXRlY3RvclJlZjogQ2hhbmdlRGV0ZWN0b3JSZWYpIHt9XHJcblxyXG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9sb2FkaW5nOiBCb29sZWFuSW5wdXQ7XHJcbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX2hhc0JhY2tkcm9wOiBCb29sZWFuSW5wdXQ7XHJcbn1cclxuIl19