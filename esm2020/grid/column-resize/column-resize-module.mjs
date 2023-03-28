/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { NgModule } from '@angular/core';
import { OverlayModule } from '@angular/cdk/overlay';
import { MatColumnResize } from './column-resize-directives/column-resize';
import { MatColumnResizeFlex } from './column-resize-directives/column-resize-flex';
import { MatResizable } from './resizable-directives/resizable';
import { MatColumnResizeOverlayHandle } from './overlay-handle';
import * as i0 from "@angular/core";
const ENTRY_COMMON_COMPONENTS = [MatColumnResizeOverlayHandle];
export class MatColumnResizeCommonModule {
}
/** @nocollapse */ MatColumnResizeCommonModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MatColumnResizeCommonModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
/** @nocollapse */ MatColumnResizeCommonModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "15.2.1", ngImport: i0, type: MatColumnResizeCommonModule, declarations: [MatColumnResizeOverlayHandle], exports: [MatColumnResizeOverlayHandle] });
/** @nocollapse */ MatColumnResizeCommonModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MatColumnResizeCommonModule });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MatColumnResizeCommonModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: ENTRY_COMMON_COMPONENTS,
                    exports: ENTRY_COMMON_COMPONENTS,
                }]
        }] });
const IMPORTS = [OverlayModule, MatColumnResizeCommonModule];
export class MatColumnResizeModule {
}
/** @nocollapse */ MatColumnResizeModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MatColumnResizeModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
/** @nocollapse */ MatColumnResizeModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "15.2.1", ngImport: i0, type: MatColumnResizeModule, declarations: [MatColumnResize, MatColumnResizeFlex, MatResizable], imports: [OverlayModule, MatColumnResizeCommonModule], exports: [MatColumnResize, MatColumnResizeFlex, MatResizable] });
/** @nocollapse */ MatColumnResizeModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MatColumnResizeModule, imports: [IMPORTS] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.1", ngImport: i0, type: MatColumnResizeModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: IMPORTS,
                    declarations: [MatColumnResize, MatColumnResizeFlex, MatResizable],
                    exports: [MatColumnResize, MatColumnResizeFlex, MatResizable],
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29sdW1uLXJlc2l6ZS1tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9leHRlbnNpb25zL2dyaWQvY29sdW1uLXJlc2l6ZS9jb2x1bW4tcmVzaXplLW1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3pDLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQztBQUVyRCxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sMENBQTBDLENBQUM7QUFDM0UsT0FBTyxFQUFFLG1CQUFtQixFQUFFLE1BQU0sK0NBQStDLENBQUM7QUFDcEYsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGtDQUFrQyxDQUFDO0FBQ2hFLE9BQU8sRUFBRSw0QkFBNEIsRUFBRSxNQUFNLGtCQUFrQixDQUFDOztBQUVoRSxNQUFNLHVCQUF1QixHQUFHLENBQUMsNEJBQTRCLENBQUMsQ0FBQztBQU0vRCxNQUFNLE9BQU8sMkJBQTJCOzsySUFBM0IsMkJBQTJCOzRJQUEzQiwyQkFBMkIsaUJBTlAsNEJBQTRCLGFBQTVCLDRCQUE0Qjs0SUFNaEQsMkJBQTJCOzJGQUEzQiwyQkFBMkI7a0JBSnZDLFFBQVE7bUJBQUM7b0JBQ1IsWUFBWSxFQUFFLHVCQUF1QjtvQkFDckMsT0FBTyxFQUFFLHVCQUF1QjtpQkFDakM7O0FBR0QsTUFBTSxPQUFPLEdBQUcsQ0FBQyxhQUFhLEVBQUUsMkJBQTJCLENBQUMsQ0FBQztBQU83RCxNQUFNLE9BQU8scUJBQXFCOztxSUFBckIscUJBQXFCO3NJQUFyQixxQkFBcUIsaUJBSGpCLGVBQWUsRUFBRSxtQkFBbUIsRUFBRSxZQUFZLGFBSmxELGFBQWEsRUFGakIsMkJBQTJCLGFBTzVCLGVBQWUsRUFBRSxtQkFBbUIsRUFBRSxZQUFZO3NJQUVqRCxxQkFBcUIsWUFKdkIsT0FBTzsyRkFJTCxxQkFBcUI7a0JBTGpDLFFBQVE7bUJBQUM7b0JBQ1IsT0FBTyxFQUFFLE9BQU87b0JBQ2hCLFlBQVksRUFBRSxDQUFDLGVBQWUsRUFBRSxtQkFBbUIsRUFBRSxZQUFZLENBQUM7b0JBQ2xFLE9BQU8sRUFBRSxDQUFDLGVBQWUsRUFBRSxtQkFBbUIsRUFBRSxZQUFZLENBQUM7aUJBQzlEIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7IE5nTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBPdmVybGF5TW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY2RrL292ZXJsYXknO1xuXG5pbXBvcnQgeyBNYXRDb2x1bW5SZXNpemUgfSBmcm9tICcuL2NvbHVtbi1yZXNpemUtZGlyZWN0aXZlcy9jb2x1bW4tcmVzaXplJztcbmltcG9ydCB7IE1hdENvbHVtblJlc2l6ZUZsZXggfSBmcm9tICcuL2NvbHVtbi1yZXNpemUtZGlyZWN0aXZlcy9jb2x1bW4tcmVzaXplLWZsZXgnO1xuaW1wb3J0IHsgTWF0UmVzaXphYmxlIH0gZnJvbSAnLi9yZXNpemFibGUtZGlyZWN0aXZlcy9yZXNpemFibGUnO1xuaW1wb3J0IHsgTWF0Q29sdW1uUmVzaXplT3ZlcmxheUhhbmRsZSB9IGZyb20gJy4vb3ZlcmxheS1oYW5kbGUnO1xuXG5jb25zdCBFTlRSWV9DT01NT05fQ09NUE9ORU5UUyA9IFtNYXRDb2x1bW5SZXNpemVPdmVybGF5SGFuZGxlXTtcblxuQE5nTW9kdWxlKHtcbiAgZGVjbGFyYXRpb25zOiBFTlRSWV9DT01NT05fQ09NUE9ORU5UUyxcbiAgZXhwb3J0czogRU5UUllfQ09NTU9OX0NPTVBPTkVOVFMsXG59KVxuZXhwb3J0IGNsYXNzIE1hdENvbHVtblJlc2l6ZUNvbW1vbk1vZHVsZSB7fVxuXG5jb25zdCBJTVBPUlRTID0gW092ZXJsYXlNb2R1bGUsIE1hdENvbHVtblJlc2l6ZUNvbW1vbk1vZHVsZV07XG5cbkBOZ01vZHVsZSh7XG4gIGltcG9ydHM6IElNUE9SVFMsXG4gIGRlY2xhcmF0aW9uczogW01hdENvbHVtblJlc2l6ZSwgTWF0Q29sdW1uUmVzaXplRmxleCwgTWF0UmVzaXphYmxlXSxcbiAgZXhwb3J0czogW01hdENvbHVtblJlc2l6ZSwgTWF0Q29sdW1uUmVzaXplRmxleCwgTWF0UmVzaXphYmxlXSxcbn0pXG5leHBvcnQgY2xhc3MgTWF0Q29sdW1uUmVzaXplTW9kdWxlIHt9XG4iXX0=