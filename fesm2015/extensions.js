import { MtxAlertModule } from '@ng-matero/extensions/alert';
export * from '@ng-matero/extensions/alert';
import { MtxButtonModule } from '@ng-matero/extensions/button';
export * from '@ng-matero/extensions/button';
import { MtxCheckboxGroupModule } from '@ng-matero/extensions/checkbox-group';
export * from '@ng-matero/extensions/checkbox-group';
import { MtxColorPickerModule } from '@ng-matero/extensions/color-picker';
export * from '@ng-matero/extensions/color-picker';
export * from '@ng-matero/extensions/column-resize';
import { MtxGridModule } from '@ng-matero/extensions/data-grid';
export * from '@ng-matero/extensions/data-grid';
import { MtxDialogModule } from '@ng-matero/extensions/dialog';
export * from '@ng-matero/extensions/dialog';
import { MtxLoaderModule } from '@ng-matero/extensions/loader';
export * from '@ng-matero/extensions/loader';
import { MtxPopoverModule } from '@ng-matero/extensions/popover';
export * from '@ng-matero/extensions/popover';
import { MtxProgressModule } from '@ng-matero/extensions/progress';
export * from '@ng-matero/extensions/progress';
import { MtxSelectModule } from '@ng-matero/extensions/select';
export * from '@ng-matero/extensions/select';
import { MtxSplitModule } from '@ng-matero/extensions/split-pane';
export * from '@ng-matero/extensions/split-pane';
import { MtxTooltipModule } from '@ng-matero/extensions/tooltip';
export * from '@ng-matero/extensions/tooltip';
import { MtxFormGroupModule } from '@ng-matero/extensions/form-group';
export * from '@ng-matero/extensions/form-group';
import { MtxText3dModule } from '@ng-matero/extensions/text3d';
export * from '@ng-matero/extensions/text3d';
import { NgModule } from '@angular/core';

class MaterialExtensionsExperimentalModule {
}
MaterialExtensionsExperimentalModule.decorators = [
    { type: NgModule, args: [{
                exports: [MtxFormGroupModule, MtxText3dModule],
                declarations: [],
            },] }
];

class MaterialExtensionsModule {
}
MaterialExtensionsModule.decorators = [
    { type: NgModule, args: [{
                exports: [
                    MtxAlertModule,
                    MtxButtonModule,
                    MtxCheckboxGroupModule,
                    MtxColorPickerModule,
                    MtxGridModule,
                    MtxDialogModule,
                    MtxLoaderModule,
                    MtxPopoverModule,
                    MtxProgressModule,
                    MtxSelectModule,
                    MtxSplitModule,
                    MtxTooltipModule,
                ],
                declarations: [],
            },] }
];

/*
 * Public API Surface of components
 */

/**
 * Generated bundle index. Do not edit.
 */

export { MaterialExtensionsExperimentalModule, MaterialExtensionsModule };
//# sourceMappingURL=extensions.js.map
