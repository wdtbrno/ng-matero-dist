/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { NgModule } from '@angular/core';
import { CdkColumnResize } from './column-resize-directives/column-resize';
import { CdkColumnResizeFlex } from './column-resize-directives/column-resize-flex';
/**
 * One of two NgModules for use with CdkColumnResize.
 * When using this module, columns are not resizable by default.
 */
export class CdkColumnResizeModule {
}
CdkColumnResizeModule.decorators = [
    { type: NgModule, args: [{
                declarations: [CdkColumnResize, CdkColumnResizeFlex],
                exports: [CdkColumnResize, CdkColumnResizeFlex],
            },] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29sdW1uLXJlc2l6ZS1tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wcm9qZWN0cy9leHRlbnNpb25zL2NvbHVtbi1yZXNpemUvY29sdW1uLXJlc2l6ZS1tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUV6QyxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sMENBQTBDLENBQUM7QUFDM0UsT0FBTyxFQUFFLG1CQUFtQixFQUFFLE1BQU0sK0NBQStDLENBQUM7QUFFcEY7OztHQUdHO0FBS0gsTUFBTSxPQUFPLHFCQUFxQjs7O1lBSmpDLFFBQVEsU0FBQztnQkFDUixZQUFZLEVBQUUsQ0FBQyxlQUFlLEVBQUUsbUJBQW1CLENBQUM7Z0JBQ3BELE9BQU8sRUFBRSxDQUFDLGVBQWUsRUFBRSxtQkFBbUIsQ0FBQzthQUNoRCIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQgeyBOZ01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBDZGtDb2x1bW5SZXNpemUgfSBmcm9tICcuL2NvbHVtbi1yZXNpemUtZGlyZWN0aXZlcy9jb2x1bW4tcmVzaXplJztcbmltcG9ydCB7IENka0NvbHVtblJlc2l6ZUZsZXggfSBmcm9tICcuL2NvbHVtbi1yZXNpemUtZGlyZWN0aXZlcy9jb2x1bW4tcmVzaXplLWZsZXgnO1xuXG4vKipcbiAqIE9uZSBvZiB0d28gTmdNb2R1bGVzIGZvciB1c2Ugd2l0aCBDZGtDb2x1bW5SZXNpemUuXG4gKiBXaGVuIHVzaW5nIHRoaXMgbW9kdWxlLCBjb2x1bW5zIGFyZSBub3QgcmVzaXphYmxlIGJ5IGRlZmF1bHQuXG4gKi9cbkBOZ01vZHVsZSh7XG4gIGRlY2xhcmF0aW9uczogW0Nka0NvbHVtblJlc2l6ZSwgQ2RrQ29sdW1uUmVzaXplRmxleF0sXG4gIGV4cG9ydHM6IFtDZGtDb2x1bW5SZXNpemUsIENka0NvbHVtblJlc2l6ZUZsZXhdLFxufSlcbmV4cG9ydCBjbGFzcyBDZGtDb2x1bW5SZXNpemVNb2R1bGUge31cbiJdfQ==