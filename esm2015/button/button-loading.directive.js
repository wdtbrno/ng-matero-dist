import { ComponentFactoryResolver, Directive, Input, Renderer2, ViewContainerRef, } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
export class MatButtonLoadingDirective {
    constructor(matButton, componentFactoryResolver, viewContainerRef, renderer) {
        this.matButton = matButton;
        this.componentFactoryResolver = componentFactoryResolver;
        this.viewContainerRef = viewContainerRef;
        this.renderer = renderer;
        this.spinnerFactory = this.componentFactoryResolver.resolveComponentFactory(MatProgressSpinner);
    }
    ngOnChanges(changes) {
        if (!changes.loading) {
            return;
        }
        if (changes.loading.currentValue) {
            this.matButton._elementRef.nativeElement.classList.add('mat-button-loading');
            this.matButton.disabled = true;
            this.createSpinner();
        }
        else if (!changes.loading.firstChange) {
            this.matButton._elementRef.nativeElement.classList.remove('mat-button-loading');
            this.matButton.disabled = this.disabled;
            this.destroySpinner();
        }
    }
    createSpinner() {
        if (!this.spinner) {
            this.spinner = this.viewContainerRef.createComponent(this.spinnerFactory);
            this.spinner.instance.color = this.color;
            this.spinner.instance.diameter = 20;
            this.spinner.instance.mode = 'indeterminate';
            this.renderer.appendChild(this.matButton._elementRef.nativeElement, this.spinner.instance._elementRef.nativeElement);
        }
    }
    destroySpinner() {
        if (this.spinner) {
            this.spinner.destroy();
            this.spinner = null;
        }
    }
}
MatButtonLoadingDirective.decorators = [
    { type: Directive, args: [{
                selector: `button[mat-button][loading],
             button[mat-raised-button][loading],
             button[mat-stroked-button][loading],
             button[mat-flat-button][loading],
             button[mat-icon-button][loading],
             button[mat-fab][loading],
             button[mat-mini-fab][loading]`,
            },] }
];
/** @nocollapse */
MatButtonLoadingDirective.ctorParameters = () => [
    { type: MatButton },
    { type: ComponentFactoryResolver },
    { type: ViewContainerRef },
    { type: Renderer2 }
];
MatButtonLoadingDirective.propDecorators = {
    loading: [{ type: Input }],
    disabled: [{ type: Input }],
    color: [{ type: Input }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnV0dG9uLWxvYWRpbmcuZGlyZWN0aXZlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vcHJvamVjdHMvZXh0ZW5zaW9ucy9idXR0b24vYnV0dG9uLWxvYWRpbmcuZGlyZWN0aXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFFTCx3QkFBd0IsRUFFeEIsU0FBUyxFQUNULEtBQUssRUFFTCxTQUFTLEVBRVQsZ0JBQWdCLEdBQ2pCLE1BQU0sZUFBZSxDQUFDO0FBRXZCLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQztBQUNyRCxPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSxvQ0FBb0MsQ0FBQztBQVd4RSxNQUFNLE9BQU8seUJBQXlCO0lBYXBDLFlBQ1UsU0FBb0IsRUFDcEIsd0JBQWtELEVBQ2xELGdCQUFrQyxFQUNsQyxRQUFtQjtRQUhuQixjQUFTLEdBQVQsU0FBUyxDQUFXO1FBQ3BCLDZCQUF3QixHQUF4Qix3QkFBd0IsQ0FBMEI7UUFDbEQscUJBQWdCLEdBQWhCLGdCQUFnQixDQUFrQjtRQUNsQyxhQUFRLEdBQVIsUUFBUSxDQUFXO1FBRTNCLElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDLHdCQUF3QixDQUFDLHVCQUF1QixDQUFDLGtCQUFrQixDQUFDLENBQUM7SUFDbEcsQ0FBQztJQUVELFdBQVcsQ0FBQyxPQUFzQjtRQUNoQyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRTtZQUNwQixPQUFPO1NBQ1I7UUFFRCxJQUFJLE9BQU8sQ0FBQyxPQUFPLENBQUMsWUFBWSxFQUFFO1lBQ2hDLElBQUksQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDLGFBQWEsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLG9CQUFvQixDQUFDLENBQUM7WUFDN0UsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDO1lBQy9CLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztTQUN0QjthQUFNLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLFdBQVcsRUFBRTtZQUN2QyxJQUFJLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxhQUFhLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO1lBQ2hGLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUM7WUFDeEMsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO1NBQ3ZCO0lBQ0gsQ0FBQztJQUVPLGFBQWE7UUFDbkIsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUU7WUFDakIsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQztZQUMxRSxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQztZQUN6QyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxRQUFRLEdBQUcsRUFBRSxDQUFDO1lBQ3BDLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLElBQUksR0FBRyxlQUFlLENBQUM7WUFDN0MsSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQ3ZCLElBQUksQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDLGFBQWEsRUFDeEMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLGFBQWEsQ0FDaEQsQ0FBQztTQUNIO0lBQ0gsQ0FBQztJQUVPLGNBQWM7UUFDcEIsSUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFO1lBQ2hCLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLENBQUM7WUFDdkIsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7U0FDckI7SUFDSCxDQUFDOzs7WUFqRUYsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRTs7Ozs7OzJDQU0rQjthQUMxQzs7OztZQVhRLFNBQVM7WUFWaEIsd0JBQXdCO1lBT3hCLGdCQUFnQjtZQUZoQixTQUFTOzs7c0JBcUJSLEtBQUs7dUJBR0wsS0FBSztvQkFHTCxLQUFLIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcclxuICBDb21wb25lbnRGYWN0b3J5LFxyXG4gIENvbXBvbmVudEZhY3RvcnlSZXNvbHZlcixcclxuICBDb21wb25lbnRSZWYsXHJcbiAgRGlyZWN0aXZlLFxyXG4gIElucHV0LFxyXG4gIE9uQ2hhbmdlcyxcclxuICBSZW5kZXJlcjIsXHJcbiAgU2ltcGxlQ2hhbmdlcyxcclxuICBWaWV3Q29udGFpbmVyUmVmLFxyXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBUaGVtZVBhbGV0dGUgfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9jb3JlJztcclxuaW1wb3J0IHsgTWF0QnV0dG9uIH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvYnV0dG9uJztcclxuaW1wb3J0IHsgTWF0UHJvZ3Jlc3NTcGlubmVyIH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvcHJvZ3Jlc3Mtc3Bpbm5lcic7XHJcblxyXG5ARGlyZWN0aXZlKHtcclxuICBzZWxlY3RvcjogYGJ1dHRvblttYXQtYnV0dG9uXVtsb2FkaW5nXSxcclxuICAgICAgICAgICAgIGJ1dHRvblttYXQtcmFpc2VkLWJ1dHRvbl1bbG9hZGluZ10sXHJcbiAgICAgICAgICAgICBidXR0b25bbWF0LXN0cm9rZWQtYnV0dG9uXVtsb2FkaW5nXSxcclxuICAgICAgICAgICAgIGJ1dHRvblttYXQtZmxhdC1idXR0b25dW2xvYWRpbmddLFxyXG4gICAgICAgICAgICAgYnV0dG9uW21hdC1pY29uLWJ1dHRvbl1bbG9hZGluZ10sXHJcbiAgICAgICAgICAgICBidXR0b25bbWF0LWZhYl1bbG9hZGluZ10sXHJcbiAgICAgICAgICAgICBidXR0b25bbWF0LW1pbmktZmFiXVtsb2FkaW5nXWAsXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBNYXRCdXR0b25Mb2FkaW5nRGlyZWN0aXZlIGltcGxlbWVudHMgT25DaGFuZ2VzIHtcclxuICBwcml2YXRlIHNwaW5uZXJGYWN0b3J5OiBDb21wb25lbnRGYWN0b3J5PE1hdFByb2dyZXNzU3Bpbm5lcj47XHJcbiAgcHJpdmF0ZSBzcGlubmVyOiBDb21wb25lbnRSZWY8TWF0UHJvZ3Jlc3NTcGlubmVyPiB8IG51bGw7XHJcblxyXG4gIEBJbnB1dCgpXHJcbiAgbG9hZGluZzogYm9vbGVhbjtcclxuXHJcbiAgQElucHV0KClcclxuICBkaXNhYmxlZDogYm9vbGVhbjtcclxuXHJcbiAgQElucHV0KClcclxuICBjb2xvcjogVGhlbWVQYWxldHRlO1xyXG5cclxuICBjb25zdHJ1Y3RvcihcclxuICAgIHByaXZhdGUgbWF0QnV0dG9uOiBNYXRCdXR0b24sXHJcbiAgICBwcml2YXRlIGNvbXBvbmVudEZhY3RvcnlSZXNvbHZlcjogQ29tcG9uZW50RmFjdG9yeVJlc29sdmVyLFxyXG4gICAgcHJpdmF0ZSB2aWV3Q29udGFpbmVyUmVmOiBWaWV3Q29udGFpbmVyUmVmLFxyXG4gICAgcHJpdmF0ZSByZW5kZXJlcjogUmVuZGVyZXIyXHJcbiAgKSB7XHJcbiAgICB0aGlzLnNwaW5uZXJGYWN0b3J5ID0gdGhpcy5jb21wb25lbnRGYWN0b3J5UmVzb2x2ZXIucmVzb2x2ZUNvbXBvbmVudEZhY3RvcnkoTWF0UHJvZ3Jlc3NTcGlubmVyKTtcclxuICB9XHJcblxyXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpOiB2b2lkIHtcclxuICAgIGlmICghY2hhbmdlcy5sb2FkaW5nKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoY2hhbmdlcy5sb2FkaW5nLmN1cnJlbnRWYWx1ZSkge1xyXG4gICAgICB0aGlzLm1hdEJ1dHRvbi5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmNsYXNzTGlzdC5hZGQoJ21hdC1idXR0b24tbG9hZGluZycpO1xyXG4gICAgICB0aGlzLm1hdEJ1dHRvbi5kaXNhYmxlZCA9IHRydWU7XHJcbiAgICAgIHRoaXMuY3JlYXRlU3Bpbm5lcigpO1xyXG4gICAgfSBlbHNlIGlmICghY2hhbmdlcy5sb2FkaW5nLmZpcnN0Q2hhbmdlKSB7XHJcbiAgICAgIHRoaXMubWF0QnV0dG9uLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnbWF0LWJ1dHRvbi1sb2FkaW5nJyk7XHJcbiAgICAgIHRoaXMubWF0QnV0dG9uLmRpc2FibGVkID0gdGhpcy5kaXNhYmxlZDtcclxuICAgICAgdGhpcy5kZXN0cm95U3Bpbm5lcigpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBjcmVhdGVTcGlubmVyKCk6IHZvaWQge1xyXG4gICAgaWYgKCF0aGlzLnNwaW5uZXIpIHtcclxuICAgICAgdGhpcy5zcGlubmVyID0gdGhpcy52aWV3Q29udGFpbmVyUmVmLmNyZWF0ZUNvbXBvbmVudCh0aGlzLnNwaW5uZXJGYWN0b3J5KTtcclxuICAgICAgdGhpcy5zcGlubmVyLmluc3RhbmNlLmNvbG9yID0gdGhpcy5jb2xvcjtcclxuICAgICAgdGhpcy5zcGlubmVyLmluc3RhbmNlLmRpYW1ldGVyID0gMjA7XHJcbiAgICAgIHRoaXMuc3Bpbm5lci5pbnN0YW5jZS5tb2RlID0gJ2luZGV0ZXJtaW5hdGUnO1xyXG4gICAgICB0aGlzLnJlbmRlcmVyLmFwcGVuZENoaWxkKFxyXG4gICAgICAgIHRoaXMubWF0QnV0dG9uLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQsXHJcbiAgICAgICAgdGhpcy5zcGlubmVyLmluc3RhbmNlLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnRcclxuICAgICAgKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHByaXZhdGUgZGVzdHJveVNwaW5uZXIoKTogdm9pZCB7XHJcbiAgICBpZiAodGhpcy5zcGlubmVyKSB7XHJcbiAgICAgIHRoaXMuc3Bpbm5lci5kZXN0cm95KCk7XHJcbiAgICAgIHRoaXMuc3Bpbm5lciA9IG51bGw7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcbiJdfQ==