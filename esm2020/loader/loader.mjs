import { Component, ChangeDetectionStrategy, ViewEncapsulation, Input, } from '@angular/core';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "@angular/material/progress-spinner";
import * as i3 from "@angular/material/progress-bar";
export class MtxLoader {
    /** Whether the loader is loading. */
    get loading() {
        return this._loading;
    }
    set loading(value) {
        this._loading = coerceBooleanProperty(value);
    }
    /** Whether the loader has a backdrop. */
    get hasBackdrop() {
        return this._hasBackdrop;
    }
    set hasBackdrop(value) {
        this._hasBackdrop = coerceBooleanProperty(value);
    }
    constructor(_changeDetectorRef) {
        this._changeDetectorRef = _changeDetectorRef;
        /** The loader's type. Can be `spinner` or `progressbar` */
        this.type = 'spinner';
        /** Theme color palette for the component. */
        this.color = 'primary';
        /** Mode of the progress circle or the progress bar. */
        this.mode = 'indeterminate';
        /** Stroke width of the spinner loader. */
        this.strokeWidth = 4;
        /** The diameter of the spinner loader (will set width and height of svg). */
        this.diameter = 48;
        /** Buffer value of the progressbar loader. */
        this.bufferValue = 0;
        /** Value of the progress circle or the progress bar. */
        this.value = 0;
        this._loading = true;
        this._hasBackdrop = true;
    }
}
/** @nocollapse */ MtxLoader.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MtxLoader, deps: [{ token: i0.ChangeDetectorRef }], target: i0.ɵɵFactoryTarget.Component });
/** @nocollapse */ MtxLoader.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.1", type: MtxLoader, selector: "mtx-loader", inputs: { type: "type", color: "color", mode: "mode", strokeWidth: "strokeWidth", diameter: "diameter", bufferValue: "bufferValue", value: "value", loading: "loading", hasBackdrop: "hasBackdrop" }, host: { properties: { "class.mtx-loader-loading": "loading" }, classAttribute: "mtx-loader" }, exportAs: ["mtxLoader"], ngImport: i0, template: "<div class=\"mtx-loader-backdrop\" *ngIf=\"loading && hasBackdrop\"></div>\r\n<div class=\"mtx-loader-main\" *ngIf=\"loading\">\r\n  <mat-spinner *ngIf=\"type==='spinner'\"\r\n               [color]=\"color\"\r\n               [strokeWidth]=\"strokeWidth\"\r\n               [diameter]=\"diameter\"\r\n               [mode]=\"$any(mode)\"\r\n               [value]=\"value\">\r\n  </mat-spinner>\r\n\r\n  <mat-progress-bar *ngIf=\"type==='progressbar'\"\r\n                    [color]=\"color\"\r\n                    [mode]=\"$any(mode)\"\r\n                    [value]=\"value\"\r\n                    [bufferValue]=\"bufferValue\">\r\n  </mat-progress-bar>\r\n</div>\r\n<ng-content></ng-content>\r\n", styles: [".mtx-loader{position:relative;display:block;width:100%;height:100%}.mtx-loader-main{position:absolute;top:0;left:0;z-index:2;display:flex;justify-content:center;align-items:center;width:100%;height:100%}.mtx-loader-main .mat-mdc-spinner{position:relative}.mtx-loader-main .mat-mdc-progress-bar{position:absolute;top:0;left:0;width:100%}.mtx-loader-backdrop{display:block;position:absolute;top:0;left:0;z-index:1;width:100%;height:100%;content:\"\"}\n"], dependencies: [{ kind: "directive", type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "component", type: i2.MatProgressSpinner, selector: "mat-progress-spinner, mat-spinner", inputs: ["color", "mode", "value", "diameter", "strokeWidth"], exportAs: ["matProgressSpinner"] }, { kind: "component", type: i3.MatProgressBar, selector: "mat-progress-bar", inputs: ["color", "value", "bufferValue", "mode"], outputs: ["animationEnd"], exportAs: ["matProgressBar"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MtxLoader, decorators: [{
            type: Component,
            args: [{ selector: 'mtx-loader', exportAs: 'mtxLoader', host: {
                        'class': 'mtx-loader',
                        '[class.mtx-loader-loading]': 'loading',
                    }, encapsulation: ViewEncapsulation.None, changeDetection: ChangeDetectionStrategy.OnPush, template: "<div class=\"mtx-loader-backdrop\" *ngIf=\"loading && hasBackdrop\"></div>\r\n<div class=\"mtx-loader-main\" *ngIf=\"loading\">\r\n  <mat-spinner *ngIf=\"type==='spinner'\"\r\n               [color]=\"color\"\r\n               [strokeWidth]=\"strokeWidth\"\r\n               [diameter]=\"diameter\"\r\n               [mode]=\"$any(mode)\"\r\n               [value]=\"value\">\r\n  </mat-spinner>\r\n\r\n  <mat-progress-bar *ngIf=\"type==='progressbar'\"\r\n                    [color]=\"color\"\r\n                    [mode]=\"$any(mode)\"\r\n                    [value]=\"value\"\r\n                    [bufferValue]=\"bufferValue\">\r\n  </mat-progress-bar>\r\n</div>\r\n<ng-content></ng-content>\r\n", styles: [".mtx-loader{position:relative;display:block;width:100%;height:100%}.mtx-loader-main{position:absolute;top:0;left:0;z-index:2;display:flex;justify-content:center;align-items:center;width:100%;height:100%}.mtx-loader-main .mat-mdc-spinner{position:relative}.mtx-loader-main .mat-mdc-progress-bar{position:absolute;top:0;left:0;width:100%}.mtx-loader-backdrop{display:block;position:absolute;top:0;left:0;z-index:1;width:100%;height:100%;content:\"\"}\n"] }]
        }], ctorParameters: function () { return [{ type: i0.ChangeDetectorRef }]; }, propDecorators: { type: [{
                type: Input
            }], color: [{
                type: Input
            }], mode: [{
                type: Input
            }], strokeWidth: [{
                type: Input
            }], diameter: [{
                type: Input
            }], bufferValue: [{
                type: Input
            }], value: [{
                type: Input
            }], loading: [{
                type: Input
            }], hasBackdrop: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9hZGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vcHJvamVjdHMvZXh0ZW5zaW9ucy9sb2FkZXIvbG9hZGVyLnRzIiwiLi4vLi4vLi4vLi4vcHJvamVjdHMvZXh0ZW5zaW9ucy9sb2FkZXIvbG9hZGVyLmh0bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUNMLFNBQVMsRUFDVCx1QkFBdUIsRUFDdkIsaUJBQWlCLEVBQ2pCLEtBQUssR0FFTixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQWdCLHFCQUFxQixFQUFFLE1BQU0sdUJBQXVCLENBQUM7Ozs7O0FBbUI1RSxNQUFNLE9BQU8sU0FBUztJQXNCcEIscUNBQXFDO0lBQ3JDLElBQ0ksT0FBTztRQUNULE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQztJQUN2QixDQUFDO0lBQ0QsSUFBSSxPQUFPLENBQUMsS0FBYztRQUN4QixJQUFJLENBQUMsUUFBUSxHQUFHLHFCQUFxQixDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQy9DLENBQUM7SUFHRCx5Q0FBeUM7SUFDekMsSUFDSSxXQUFXO1FBQ2IsT0FBTyxJQUFJLENBQUMsWUFBWSxDQUFDO0lBQzNCLENBQUM7SUFDRCxJQUFJLFdBQVcsQ0FBQyxLQUFjO1FBQzVCLElBQUksQ0FBQyxZQUFZLEdBQUcscUJBQXFCLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDbkQsQ0FBQztJQUdELFlBQW9CLGtCQUFxQztRQUFyQyx1QkFBa0IsR0FBbEIsa0JBQWtCLENBQW1CO1FBekN6RCwyREFBMkQ7UUFDbEQsU0FBSSxHQUFrQixTQUFTLENBQUM7UUFFekMsNkNBQTZDO1FBQ3BDLFVBQUssR0FBaUIsU0FBUyxDQUFDO1FBRXpDLHVEQUF1RDtRQUM5QyxTQUFJLEdBQTBDLGVBQWUsQ0FBQztRQUV2RSwwQ0FBMEM7UUFDakMsZ0JBQVcsR0FBRyxDQUFDLENBQUM7UUFFekIsNkVBQTZFO1FBQ3BFLGFBQVEsR0FBRyxFQUFFLENBQUM7UUFFdkIsOENBQThDO1FBQ3JDLGdCQUFXLEdBQUcsQ0FBQyxDQUFDO1FBRXpCLHdEQUF3RDtRQUMvQyxVQUFLLEdBQUcsQ0FBQyxDQUFDO1FBVVgsYUFBUSxHQUFHLElBQUksQ0FBQztRQVVoQixpQkFBWSxHQUFHLElBQUksQ0FBQztJQUVnQyxDQUFDOzt5SEExQ2xELFNBQVM7NkdBQVQsU0FBUyxnWEMxQnRCLGdzQkFrQkE7MkZEUWEsU0FBUztrQkFackIsU0FBUzsrQkFDRSxZQUFZLFlBQ1osV0FBVyxRQUNmO3dCQUNKLE9BQU8sRUFBRSxZQUFZO3dCQUNyQiw0QkFBNEIsRUFBRSxTQUFTO3FCQUN4QyxpQkFHYyxpQkFBaUIsQ0FBQyxJQUFJLG1CQUNwQix1QkFBdUIsQ0FBQyxNQUFNO3dHQUl0QyxJQUFJO3NCQUFaLEtBQUs7Z0JBR0csS0FBSztzQkFBYixLQUFLO2dCQUdHLElBQUk7c0JBQVosS0FBSztnQkFHRyxXQUFXO3NCQUFuQixLQUFLO2dCQUdHLFFBQVE7c0JBQWhCLEtBQUs7Z0JBR0csV0FBVztzQkFBbkIsS0FBSztnQkFHRyxLQUFLO3NCQUFiLEtBQUs7Z0JBSUYsT0FBTztzQkFEVixLQUFLO2dCQVdGLFdBQVc7c0JBRGQsS0FBSyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIENvbXBvbmVudCxcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIFZpZXdFbmNhcHN1bGF0aW9uLFxuICBJbnB1dCxcbiAgQ2hhbmdlRGV0ZWN0b3JSZWYsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQm9vbGVhbklucHV0LCBjb2VyY2VCb29sZWFuUHJvcGVydHkgfSBmcm9tICdAYW5ndWxhci9jZGsvY29lcmNpb24nO1xuaW1wb3J0IHsgVGhlbWVQYWxldHRlIH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvY29yZSc7XG5pbXBvcnQgeyBQcm9ncmVzc0Jhck1vZGUgfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9wcm9ncmVzcy1iYXInO1xuaW1wb3J0IHsgUHJvZ3Jlc3NTcGlubmVyTW9kZSB9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL3Byb2dyZXNzLXNwaW5uZXInO1xuXG5leHBvcnQgdHlwZSBNdHhMb2FkZXJUeXBlID0gJ3NwaW5uZXInIHwgJ3Byb2dyZXNzYmFyJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbXR4LWxvYWRlcicsXG4gIGV4cG9ydEFzOiAnbXR4TG9hZGVyJyxcbiAgaG9zdDoge1xuICAgICdjbGFzcyc6ICdtdHgtbG9hZGVyJyxcbiAgICAnW2NsYXNzLm10eC1sb2FkZXItbG9hZGluZ10nOiAnbG9hZGluZycsXG4gIH0sXG4gIHRlbXBsYXRlVXJsOiAnLi9sb2FkZXIuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL2xvYWRlci5zY3NzJ10sXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxufSlcbmV4cG9ydCBjbGFzcyBNdHhMb2FkZXIge1xuICAvKiogVGhlIGxvYWRlcidzIHR5cGUuIENhbiBiZSBgc3Bpbm5lcmAgb3IgYHByb2dyZXNzYmFyYCAqL1xuICBASW5wdXQoKSB0eXBlOiBNdHhMb2FkZXJUeXBlID0gJ3NwaW5uZXInO1xuXG4gIC8qKiBUaGVtZSBjb2xvciBwYWxldHRlIGZvciB0aGUgY29tcG9uZW50LiAqL1xuICBASW5wdXQoKSBjb2xvcjogVGhlbWVQYWxldHRlID0gJ3ByaW1hcnknO1xuXG4gIC8qKiBNb2RlIG9mIHRoZSBwcm9ncmVzcyBjaXJjbGUgb3IgdGhlIHByb2dyZXNzIGJhci4gKi9cbiAgQElucHV0KCkgbW9kZTogUHJvZ3Jlc3NTcGlubmVyTW9kZSB8IFByb2dyZXNzQmFyTW9kZSA9ICdpbmRldGVybWluYXRlJztcblxuICAvKiogU3Ryb2tlIHdpZHRoIG9mIHRoZSBzcGlubmVyIGxvYWRlci4gKi9cbiAgQElucHV0KCkgc3Ryb2tlV2lkdGggPSA0O1xuXG4gIC8qKiBUaGUgZGlhbWV0ZXIgb2YgdGhlIHNwaW5uZXIgbG9hZGVyICh3aWxsIHNldCB3aWR0aCBhbmQgaGVpZ2h0IG9mIHN2ZykuICovXG4gIEBJbnB1dCgpIGRpYW1ldGVyID0gNDg7XG5cbiAgLyoqIEJ1ZmZlciB2YWx1ZSBvZiB0aGUgcHJvZ3Jlc3NiYXIgbG9hZGVyLiAqL1xuICBASW5wdXQoKSBidWZmZXJWYWx1ZSA9IDA7XG5cbiAgLyoqIFZhbHVlIG9mIHRoZSBwcm9ncmVzcyBjaXJjbGUgb3IgdGhlIHByb2dyZXNzIGJhci4gKi9cbiAgQElucHV0KCkgdmFsdWUgPSAwO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBsb2FkZXIgaXMgbG9hZGluZy4gKi9cbiAgQElucHV0KClcbiAgZ2V0IGxvYWRpbmcoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX2xvYWRpbmc7XG4gIH1cbiAgc2V0IGxvYWRpbmcodmFsdWU6IGJvb2xlYW4pIHtcbiAgICB0aGlzLl9sb2FkaW5nID0gY29lcmNlQm9vbGVhblByb3BlcnR5KHZhbHVlKTtcbiAgfVxuICBwcml2YXRlIF9sb2FkaW5nID0gdHJ1ZTtcblxuICAvKiogV2hldGhlciB0aGUgbG9hZGVyIGhhcyBhIGJhY2tkcm9wLiAqL1xuICBASW5wdXQoKVxuICBnZXQgaGFzQmFja2Ryb3AoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX2hhc0JhY2tkcm9wO1xuICB9XG4gIHNldCBoYXNCYWNrZHJvcCh2YWx1ZTogYm9vbGVhbikge1xuICAgIHRoaXMuX2hhc0JhY2tkcm9wID0gY29lcmNlQm9vbGVhblByb3BlcnR5KHZhbHVlKTtcbiAgfVxuICBwcml2YXRlIF9oYXNCYWNrZHJvcCA9IHRydWU7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBfY2hhbmdlRGV0ZWN0b3JSZWY6IENoYW5nZURldGVjdG9yUmVmKSB7fVxuXG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9sb2FkaW5nOiBCb29sZWFuSW5wdXQ7XG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9oYXNCYWNrZHJvcDogQm9vbGVhbklucHV0O1xufVxuIiwiPGRpdiBjbGFzcz1cIm10eC1sb2FkZXItYmFja2Ryb3BcIiAqbmdJZj1cImxvYWRpbmcgJiYgaGFzQmFja2Ryb3BcIj48L2Rpdj5cclxuPGRpdiBjbGFzcz1cIm10eC1sb2FkZXItbWFpblwiICpuZ0lmPVwibG9hZGluZ1wiPlxyXG4gIDxtYXQtc3Bpbm5lciAqbmdJZj1cInR5cGU9PT0nc3Bpbm5lcidcIlxyXG4gICAgICAgICAgICAgICBbY29sb3JdPVwiY29sb3JcIlxyXG4gICAgICAgICAgICAgICBbc3Ryb2tlV2lkdGhdPVwic3Ryb2tlV2lkdGhcIlxyXG4gICAgICAgICAgICAgICBbZGlhbWV0ZXJdPVwiZGlhbWV0ZXJcIlxyXG4gICAgICAgICAgICAgICBbbW9kZV09XCIkYW55KG1vZGUpXCJcclxuICAgICAgICAgICAgICAgW3ZhbHVlXT1cInZhbHVlXCI+XHJcbiAgPC9tYXQtc3Bpbm5lcj5cclxuXHJcbiAgPG1hdC1wcm9ncmVzcy1iYXIgKm5nSWY9XCJ0eXBlPT09J3Byb2dyZXNzYmFyJ1wiXHJcbiAgICAgICAgICAgICAgICAgICAgW2NvbG9yXT1cImNvbG9yXCJcclxuICAgICAgICAgICAgICAgICAgICBbbW9kZV09XCIkYW55KG1vZGUpXCJcclxuICAgICAgICAgICAgICAgICAgICBbdmFsdWVdPVwidmFsdWVcIlxyXG4gICAgICAgICAgICAgICAgICAgIFtidWZmZXJWYWx1ZV09XCJidWZmZXJWYWx1ZVwiPlxyXG4gIDwvbWF0LXByb2dyZXNzLWJhcj5cclxuPC9kaXY+XHJcbjxuZy1jb250ZW50PjwvbmctY29udGVudD5cclxuIl19