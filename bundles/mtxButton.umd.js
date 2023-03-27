(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/common'), require('@angular/material/button'), require('@angular/material/progress-spinner')) :
    typeof define === 'function' && define.amd ? define('@ng-matero/extensions/button', ['exports', '@angular/core', '@angular/common', '@angular/material/button', '@angular/material/progress-spinner'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory((global['ng-matero'] = global['ng-matero'] || {}, global['ng-matero'].extensions = global['ng-matero'].extensions || {}, global['ng-matero'].extensions.button = {}), global.ng.core, global.ng.common, global.ng.material.button, global.ng.material.progressSpinner));
}(this, (function (exports, core, common, button, progressSpinner) { 'use strict';

    var MatButtonLoadingDirective = /** @class */ (function () {
        function MatButtonLoadingDirective(matButton, componentFactoryResolver, viewContainerRef, renderer) {
            this.matButton = matButton;
            this.componentFactoryResolver = componentFactoryResolver;
            this.viewContainerRef = viewContainerRef;
            this.renderer = renderer;
            this.spinnerFactory = this.componentFactoryResolver.resolveComponentFactory(progressSpinner.MatProgressSpinner);
        }
        MatButtonLoadingDirective.prototype.ngOnChanges = function (changes) {
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
        };
        MatButtonLoadingDirective.prototype.createSpinner = function () {
            if (!this.spinner) {
                this.spinner = this.viewContainerRef.createComponent(this.spinnerFactory);
                this.spinner.instance.color = this.color;
                this.spinner.instance.diameter = 20;
                this.spinner.instance.mode = 'indeterminate';
                this.renderer.appendChild(this.matButton._elementRef.nativeElement, this.spinner.instance._elementRef.nativeElement);
            }
        };
        MatButtonLoadingDirective.prototype.destroySpinner = function () {
            if (this.spinner) {
                this.spinner.destroy();
                this.spinner = null;
            }
        };
        return MatButtonLoadingDirective;
    }());
    MatButtonLoadingDirective.decorators = [
        { type: core.Directive, args: [{
                    selector: "button[mat-button][loading],\n             button[mat-raised-button][loading],\n             button[mat-stroked-button][loading],\n             button[mat-flat-button][loading],\n             button[mat-icon-button][loading],\n             button[mat-fab][loading],\n             button[mat-mini-fab][loading]",
                },] }
    ];
    /** @nocollapse */
    MatButtonLoadingDirective.ctorParameters = function () { return [
        { type: button.MatButton },
        { type: core.ComponentFactoryResolver },
        { type: core.ViewContainerRef },
        { type: core.Renderer2 }
    ]; };
    MatButtonLoadingDirective.propDecorators = {
        loading: [{ type: core.Input }],
        disabled: [{ type: core.Input }],
        color: [{ type: core.Input }]
    };

    var MtxButtonModule = /** @class */ (function () {
        function MtxButtonModule() {
        }
        return MtxButtonModule;
    }());
    MtxButtonModule.decorators = [
        { type: core.NgModule, args: [{
                    imports: [common.CommonModule, button.MatButtonModule, progressSpinner.MatProgressSpinnerModule],
                    exports: [MatButtonLoadingDirective],
                    declarations: [MatButtonLoadingDirective],
                },] }
    ];

    /**
     * Generated bundle index. Do not edit.
     */

    exports.MatButtonLoadingDirective = MatButtonLoadingDirective;
    exports.MtxButtonModule = MtxButtonModule;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=mtxButton.umd.js.map
