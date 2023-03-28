import * as i0 from "@angular/core";
import * as i1 from "./overlay-handle";
import * as i2 from "./column-resize-directives/column-resize";
import * as i3 from "./column-resize-directives/column-resize-flex";
import * as i4 from "./resizable-directives/resizable";
import * as i5 from "@angular/cdk/overlay";
export declare class MatColumnResizeCommonModule {
    static ɵfac: i0.ɵɵFactoryDeclaration<MatColumnResizeCommonModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<MatColumnResizeCommonModule, [typeof i1.MatColumnResizeOverlayHandle], never, [typeof i1.MatColumnResizeOverlayHandle]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<MatColumnResizeCommonModule>;
}
export declare class MatColumnResizeModule {
    static ɵfac: i0.ɵɵFactoryDeclaration<MatColumnResizeModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<MatColumnResizeModule, [typeof i2.MatColumnResize, typeof i3.MatColumnResizeFlex, typeof i4.MatResizable], [typeof i5.OverlayModule, typeof MatColumnResizeCommonModule], [typeof i2.MatColumnResize, typeof i3.MatColumnResizeFlex, typeof i4.MatResizable]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<MatColumnResizeModule>;
}
