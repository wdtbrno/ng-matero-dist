import { Directive, ComponentFactoryResolver, ViewContainerRef, Renderer2, Input, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatProgressSpinner, MatProgressSpinnerModule } from '@angular/material/progress-spinner';

class MatButtonLoadingDirective {
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

class MtxButtonModule {
}
MtxButtonModule.decorators = [
    { type: NgModule, args: [{
                imports: [CommonModule, MatButtonModule, MatProgressSpinnerModule],
                exports: [MatButtonLoadingDirective],
                declarations: [MatButtonLoadingDirective],
            },] }
];

/**
 * Generated bundle index. Do not edit.
 */

export { MatButtonLoadingDirective, MtxButtonModule };
//# sourceMappingURL=mtxButton.js.map
