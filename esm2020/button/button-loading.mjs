import { Directive, Input, } from '@angular/core';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import * as i0 from "@angular/core";
export class MatButtonLoading {
    get loading() {
        return this._loading;
    }
    set loading(value) {
        this._loading = coerceBooleanProperty(value);
    }
    get disabled() {
        return this._disabled;
    }
    set disabled(value) {
        this._disabled = coerceBooleanProperty(value);
    }
    constructor(_elementRef, _viewContainerRef, _renderer) {
        this._elementRef = _elementRef;
        this._viewContainerRef = _viewContainerRef;
        this._renderer = _renderer;
        this._loading = false;
        this._disabled = false;
    }
    ngOnChanges(changes) {
        if (!changes.loading) {
            return;
        }
        if (changes.loading.currentValue) {
            this._elementRef.nativeElement.classList.add('mat-button-loading');
            setTimeout(() => this._elementRef.nativeElement.setAttribute('disabled', ''));
            this.createSpinner();
        }
        else if (!changes.loading.firstChange) {
            this._elementRef.nativeElement.classList.remove('mat-button-loading');
            setTimeout(() => this._elementRef.nativeElement.removeAttribute('disabled'));
            this.destroySpinner();
        }
    }
    createSpinner() {
        if (!this.spinner) {
            this.spinner = this._viewContainerRef.createComponent(MatProgressSpinner);
            this.spinner.instance.color = this.color;
            this.spinner.instance.diameter = 24;
            this.spinner.instance.mode = 'indeterminate';
            this._renderer.appendChild(this._elementRef.nativeElement, this.spinner.instance._elementRef.nativeElement);
        }
    }
    destroySpinner() {
        if (this.spinner) {
            this.spinner.destroy();
            this.spinner = null;
        }
    }
}
/** @nocollapse */ MatButtonLoading.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MatButtonLoading, deps: [{ token: i0.ElementRef }, { token: i0.ViewContainerRef }, { token: i0.Renderer2 }], target: i0.ɵɵFactoryTarget.Directive });
/** @nocollapse */ MatButtonLoading.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.2.1", type: MatButtonLoading, selector: "[mat-button][loading],\n             [mat-raised-button][loading],\n             [mat-stroked-button][loading],\n             [mat-flat-button][loading],\n             [mat-icon-button][loading],\n             [mat-fab][loading],\n             [mat-mini-fab][loading]", inputs: { loading: "loading", disabled: "disabled", color: "color" }, usesOnChanges: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MatButtonLoading, decorators: [{
            type: Directive,
            args: [{
                    selector: `[mat-button][loading],
             [mat-raised-button][loading],
             [mat-stroked-button][loading],
             [mat-flat-button][loading],
             [mat-icon-button][loading],
             [mat-fab][loading],
             [mat-mini-fab][loading]`,
                }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i0.ViewContainerRef }, { type: i0.Renderer2 }]; }, propDecorators: { loading: [{
                type: Input
            }], disabled: [{
                type: Input
            }], color: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnV0dG9uLWxvYWRpbmcuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wcm9qZWN0cy9leHRlbnNpb25zL2J1dHRvbi9idXR0b24tbG9hZGluZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBRUwsU0FBUyxFQUVULEtBQUssR0FLTixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQWdCLHFCQUFxQixFQUFFLE1BQU0sdUJBQXVCLENBQUM7QUFFNUUsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sb0NBQW9DLENBQUM7O0FBV3hFLE1BQU0sT0FBTyxnQkFBZ0I7SUFHM0IsSUFDSSxPQUFPO1FBQ1QsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDO0lBQ3ZCLENBQUM7SUFDRCxJQUFJLE9BQU8sQ0FBQyxLQUFjO1FBQ3hCLElBQUksQ0FBQyxRQUFRLEdBQUcscUJBQXFCLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDL0MsQ0FBQztJQUdELElBQ0ksUUFBUTtRQUNWLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQztJQUN4QixDQUFDO0lBQ0QsSUFBSSxRQUFRLENBQUMsS0FBYztRQUN6QixJQUFJLENBQUMsU0FBUyxHQUFHLHFCQUFxQixDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ2hELENBQUM7SUFLRCxZQUNVLFdBQTBDLEVBQzFDLGlCQUFtQyxFQUNuQyxTQUFvQjtRQUZwQixnQkFBVyxHQUFYLFdBQVcsQ0FBK0I7UUFDMUMsc0JBQWlCLEdBQWpCLGlCQUFpQixDQUFrQjtRQUNuQyxjQUFTLEdBQVQsU0FBUyxDQUFXO1FBaEJ0QixhQUFRLEdBQUcsS0FBSyxDQUFDO1FBU2pCLGNBQVMsR0FBRyxLQUFLLENBQUM7SUFRdkIsQ0FBQztJQUVKLFdBQVcsQ0FBQyxPQUFzQjtRQUNoQyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRTtZQUNwQixPQUFPO1NBQ1I7UUFFRCxJQUFJLE9BQU8sQ0FBQyxPQUFPLENBQUMsWUFBWSxFQUFFO1lBQ2hDLElBQUksQ0FBQyxXQUFXLENBQUMsYUFBYSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsb0JBQW9CLENBQUMsQ0FBQztZQUNuRSxVQUFVLENBQUMsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxhQUFhLENBQUMsWUFBWSxDQUFDLFVBQVUsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQzlFLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztTQUN0QjthQUFNLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLFdBQVcsRUFBRTtZQUN2QyxJQUFJLENBQUMsV0FBVyxDQUFDLGFBQWEsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLG9CQUFvQixDQUFDLENBQUM7WUFDdEUsVUFBVSxDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsYUFBYSxDQUFDLGVBQWUsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO1lBQzdFLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztTQUN2QjtJQUNILENBQUM7SUFFTyxhQUFhO1FBQ25CLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFO1lBQ2pCLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDLGVBQWUsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO1lBQzFFLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO1lBQ3pDLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLFFBQVEsR0FBRyxFQUFFLENBQUM7WUFDcEMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsSUFBSSxHQUFHLGVBQWUsQ0FBQztZQUM3QyxJQUFJLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FDeEIsSUFBSSxDQUFDLFdBQVcsQ0FBQyxhQUFhLEVBQzlCLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxhQUFhLENBQ2hELENBQUM7U0FDSDtJQUNILENBQUM7SUFFTyxjQUFjO1FBQ3BCLElBQUksSUFBSSxDQUFDLE9BQU8sRUFBRTtZQUNoQixJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFDO1lBQ3ZCLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO1NBQ3JCO0lBQ0gsQ0FBQzs7Z0lBL0RVLGdCQUFnQjtvSEFBaEIsZ0JBQWdCOzJGQUFoQixnQkFBZ0I7a0JBVDVCLFNBQVM7bUJBQUM7b0JBQ1QsUUFBUSxFQUFFOzs7Ozs7cUNBTXlCO2lCQUNwQzt3SkFLSyxPQUFPO3NCQURWLEtBQUs7Z0JBVUYsUUFBUTtzQkFEWCxLQUFLO2dCQVNHLEtBQUs7c0JBQWIsS0FBSyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIENvbXBvbmVudFJlZixcbiAgRGlyZWN0aXZlLFxuICBFbGVtZW50UmVmLFxuICBJbnB1dCxcbiAgT25DaGFuZ2VzLFxuICBSZW5kZXJlcjIsXG4gIFNpbXBsZUNoYW5nZXMsXG4gIFZpZXdDb250YWluZXJSZWYsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQm9vbGVhbklucHV0LCBjb2VyY2VCb29sZWFuUHJvcGVydHkgfSBmcm9tICdAYW5ndWxhci9jZGsvY29lcmNpb24nO1xuaW1wb3J0IHsgVGhlbWVQYWxldHRlIH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvY29yZSc7XG5pbXBvcnQgeyBNYXRQcm9ncmVzc1NwaW5uZXIgfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9wcm9ncmVzcy1zcGlubmVyJztcblxuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiBgW21hdC1idXR0b25dW2xvYWRpbmddLFxuICAgICAgICAgICAgIFttYXQtcmFpc2VkLWJ1dHRvbl1bbG9hZGluZ10sXG4gICAgICAgICAgICAgW21hdC1zdHJva2VkLWJ1dHRvbl1bbG9hZGluZ10sXG4gICAgICAgICAgICAgW21hdC1mbGF0LWJ1dHRvbl1bbG9hZGluZ10sXG4gICAgICAgICAgICAgW21hdC1pY29uLWJ1dHRvbl1bbG9hZGluZ10sXG4gICAgICAgICAgICAgW21hdC1mYWJdW2xvYWRpbmddLFxuICAgICAgICAgICAgIFttYXQtbWluaS1mYWJdW2xvYWRpbmddYCxcbn0pXG5leHBvcnQgY2xhc3MgTWF0QnV0dG9uTG9hZGluZyBpbXBsZW1lbnRzIE9uQ2hhbmdlcyB7XG4gIHByaXZhdGUgc3Bpbm5lciE6IENvbXBvbmVudFJlZjxNYXRQcm9ncmVzc1NwaW5uZXI+IHwgbnVsbDtcblxuICBASW5wdXQoKVxuICBnZXQgbG9hZGluZygpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fbG9hZGluZztcbiAgfVxuICBzZXQgbG9hZGluZyh2YWx1ZTogYm9vbGVhbikge1xuICAgIHRoaXMuX2xvYWRpbmcgPSBjb2VyY2VCb29sZWFuUHJvcGVydHkodmFsdWUpO1xuICB9XG4gIHByaXZhdGUgX2xvYWRpbmcgPSBmYWxzZTtcblxuICBASW5wdXQoKVxuICBnZXQgZGlzYWJsZWQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX2Rpc2FibGVkO1xuICB9XG4gIHNldCBkaXNhYmxlZCh2YWx1ZTogYm9vbGVhbikge1xuICAgIHRoaXMuX2Rpc2FibGVkID0gY29lcmNlQm9vbGVhblByb3BlcnR5KHZhbHVlKTtcbiAgfVxuICBwcml2YXRlIF9kaXNhYmxlZCA9IGZhbHNlO1xuXG4gIEBJbnB1dCgpIGNvbG9yOiBUaGVtZVBhbGV0dGU7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBfZWxlbWVudFJlZjogRWxlbWVudFJlZjxIVE1MQnV0dG9uRWxlbWVudD4sXG4gICAgcHJpdmF0ZSBfdmlld0NvbnRhaW5lclJlZjogVmlld0NvbnRhaW5lclJlZixcbiAgICBwcml2YXRlIF9yZW5kZXJlcjogUmVuZGVyZXIyXG4gICkge31cblxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKTogdm9pZCB7XG4gICAgaWYgKCFjaGFuZ2VzLmxvYWRpbmcpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoY2hhbmdlcy5sb2FkaW5nLmN1cnJlbnRWYWx1ZSkge1xuICAgICAgdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmNsYXNzTGlzdC5hZGQoJ21hdC1idXR0b24tbG9hZGluZycpO1xuICAgICAgc2V0VGltZW91dCgoKSA9PiB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuc2V0QXR0cmlidXRlKCdkaXNhYmxlZCcsICcnKSk7XG4gICAgICB0aGlzLmNyZWF0ZVNwaW5uZXIoKTtcbiAgICB9IGVsc2UgaWYgKCFjaGFuZ2VzLmxvYWRpbmcuZmlyc3RDaGFuZ2UpIHtcbiAgICAgIHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdtYXQtYnV0dG9uLWxvYWRpbmcnKTtcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4gdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LnJlbW92ZUF0dHJpYnV0ZSgnZGlzYWJsZWQnKSk7XG4gICAgICB0aGlzLmRlc3Ryb3lTcGlubmVyKCk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBjcmVhdGVTcGlubmVyKCk6IHZvaWQge1xuICAgIGlmICghdGhpcy5zcGlubmVyKSB7XG4gICAgICB0aGlzLnNwaW5uZXIgPSB0aGlzLl92aWV3Q29udGFpbmVyUmVmLmNyZWF0ZUNvbXBvbmVudChNYXRQcm9ncmVzc1NwaW5uZXIpO1xuICAgICAgdGhpcy5zcGlubmVyLmluc3RhbmNlLmNvbG9yID0gdGhpcy5jb2xvcjtcbiAgICAgIHRoaXMuc3Bpbm5lci5pbnN0YW5jZS5kaWFtZXRlciA9IDI0O1xuICAgICAgdGhpcy5zcGlubmVyLmluc3RhbmNlLm1vZGUgPSAnaW5kZXRlcm1pbmF0ZSc7XG4gICAgICB0aGlzLl9yZW5kZXJlci5hcHBlbmRDaGlsZChcbiAgICAgICAgdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LFxuICAgICAgICB0aGlzLnNwaW5uZXIuaW5zdGFuY2UuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudFxuICAgICAgKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGRlc3Ryb3lTcGlubmVyKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLnNwaW5uZXIpIHtcbiAgICAgIHRoaXMuc3Bpbm5lci5kZXN0cm95KCk7XG4gICAgICB0aGlzLnNwaW5uZXIgPSBudWxsO1xuICAgIH1cbiAgfVxuXG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9sb2FkaW5nOiBCb29sZWFuSW5wdXQ7XG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9kaXNhYmxlZDogQm9vbGVhbklucHV0O1xufVxuIl19