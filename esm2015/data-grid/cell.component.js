import { Component, Input, ViewEncapsulation } from '@angular/core';
import { MtxDialog } from '@ng-matero/extensions/dialog';
import { MtxGridService } from './grid.service';
import PhotoViewer from 'photoviewer';
export class MtxGridCellComponent {
    constructor(_dialog, _dataGridSrv) {
        this._dialog = _dialog;
        this._dataGridSrv = _dataGridSrv;
        /** Row data */
        this.rowData = {};
        /** All data */
        this.data = [];
        /** Whether show summary */
        this.summary = false;
    }
    get _colValue() {
        return this._dataGridSrv.getCellValue(this.rowData, this.colDef);
    }
    _isString(fn) {
        return Object.prototype.toString.call(fn) === '[object String]';
    }
    _isFunction(fn) {
        return Object.prototype.toString.call(fn) === '[object Function]';
    }
    _isEmptyValue(value) {
        return value == null || value.toString() === '';
    }
    _isContainHTML(value) {
        return /<\/?[a-z][\s\S]*>/i.test(value);
    }
    _getText(value) {
        return this._isEmptyValue(value) ? '--' : value;
    }
    _getTooltip(value) {
        return this._isEmptyValue(value) ? '' : value;
    }
    _getFormatterTooltip(value) {
        return this._isContainHTML(value) || this._isEmptyValue(value) ? '' : value;
    }
    _formatSummary(data, colDef) {
        if (this._isString(colDef.summary)) {
            return colDef.summary;
        }
        else if (this._isFunction(colDef.summary)) {
            return colDef.summary(this._dataGridSrv.getColData(data, colDef), colDef);
        }
    }
    _handleActionConfirm(event, title, description = '', okColor = 'primary', okText = 'OK', closeColor, closeText = 'CLOSE', fn, data) {
        event.preventDefault();
        event.stopPropagation();
        this._dialog.open({
            title,
            description,
            buttons: [
                {
                    color: okColor,
                    text: okText,
                    onClick: () => (fn ? fn(data) : {}),
                },
                { color: closeColor, text: closeText, onClick: () => { } },
            ],
        });
    }
    _handleActionClick(event, btn, rowData) {
        event.preventDefault();
        event.stopPropagation();
        if (btn.click) {
            btn.click(rowData);
        }
    }
    /** Preview enlarged image */
    _onPreview(urlStr) {
        const imgs = [];
        this._dataGridSrv.str2arr(urlStr).forEach((url, index) => {
            imgs.push({ title: index + 1 + '', src: url });
        });
        const footerToolbar = imgs.length > 1
            ? ['zoomIn', 'zoomOut', 'prev', 'next', 'rotateRight', 'rotateLeft', 'actualSize']
            : ['zoomIn', 'zoomOut', 'rotateRight', 'rotateLeft', 'actualSize'];
        const options = {
            title: imgs.length > 1,
            footerToolbar,
        };
        const viewer = new PhotoViewer(imgs, options);
    }
}
MtxGridCellComponent.decorators = [
    { type: Component, args: [{
                selector: 'mtx-grid-cell',
                exportAs: 'mtxGridCell',
                template: "<span *ngIf=\"summary; else customCellFormattingTpl\"\r\n      [title]=\"_getFormatterTooltip(_formatSummary(data, colDef))\"\r\n      [innerHTML]=\"_getText(_formatSummary(data, colDef))\">\r\n</span>\r\n\r\n<!-- Custom formatting -->\r\n<ng-template #customCellFormattingTpl>\r\n  <span *ngIf=\"colDef.formatter; else defaultCellFormattingTpl\"\r\n        [title]=\"_getFormatterTooltip(colDef.formatter!(rowData, colDef))\"\r\n        [innerHTML]=\"_getText(colDef.formatter!(rowData, colDef))\">\r\n  </span>\r\n</ng-template>\r\n\r\n<!-- Default formatting -->\r\n<ng-template #defaultCellFormattingTpl>\r\n  <ng-container [ngSwitch]=\"colDef.type\">\r\n    <!-- Tag -->\r\n    <ng-container *ngSwitchCase=\"'tag'\">\r\n      <mat-chip-list *ngIf=\"colDef.tag && colDef.tag[_colValue]; else tagEmptyTpl\">\r\n        <mat-chip color=\"primary\" [ngClass]=\"['bg-' + colDef.tag[_colValue].color]\">\r\n          {{colDef.tag[_colValue].text}}\r\n        </mat-chip>\r\n      </mat-chip-list>\r\n      <ng-template #tagEmptyTpl>{{_colValue}}</ng-template>\r\n    </ng-container>\r\n    <!-- Buttons -->\r\n    <ng-container *ngSwitchCase=\"'button'\">\r\n      <ng-container *ngFor=\"let btn of colDef.buttons;\">\r\n        <ng-container *ngIf=\"!btn.iif || btn.iif(rowData)\">\r\n          <ng-container *ngIf=\"btn.pop; else btnDefaultTpl\">\r\n            <button [ngClass]=\"['mtx-grid-action-button', btn.class||'']\"\r\n                    *ngIf=\"btn.type==='basic'\"\r\n                    mat-button\r\n                    [color]=\"btn.color || 'primary'\"\r\n                    [disabled]=\"btn.disabled\"\r\n                    [matTooltip]=\"btn.tooltip | toObservable | async\"\r\n                    (click)=\"_handleActionConfirm($event, btn.popTitle, btn.popDescription,\r\n                                                          btn.popOkColor, btn.popOkText,\r\n                                                          btn.popCloseColor, btn.popCloseText,\r\n                                                          btn.click, rowData)\">\r\n              <mat-icon *ngIf=\"btn.icon\">{{btn.icon}}</mat-icon>\r\n              <span>{{btn.text | toObservable | async}}</span>\r\n            </button>\r\n            <button [ngClass]=\"['mtx-grid-action-button', btn.class||'']\"\r\n                    *ngIf=\"!btn.type || btn.type==='icon'\"\r\n                    mat-icon-button\r\n                    [color]=\"btn.color || 'primary'\"\r\n                    [disabled]=\"btn.disabled\"\r\n                    [matTooltip]=\"btn.tooltip | toObservable | async\"\r\n                    (click)=\"_handleActionConfirm($event, btn.popTitle, btn.popDescription,\r\n                                                          btn.popOkColor, btn.popOkText,\r\n                                                          btn.popCloseColor, btn.popCloseText,\r\n                                                          btn.click, rowData)\">\r\n              <mat-icon>{{btn.icon}}</mat-icon>\r\n            </button>\r\n          </ng-container>\r\n          <ng-template #btnDefaultTpl>\r\n            <button [ngClass]=\"['mtx-grid-action-button', btn.class||'']\"\r\n                    *ngIf=\"btn.type==='basic'\"\r\n                    mat-button\r\n                    [color]=\"btn.color || 'primary'\"\r\n                    [disabled]=\"btn.disabled\"\r\n                    [matTooltip]=\"btn.tooltip | toObservable | async\"\r\n                    (click)=\"_handleActionClick($event, btn, rowData)\">\r\n              <mat-icon *ngIf=\"btn.icon\">{{btn.icon}}</mat-icon>\r\n              <span>{{btn.text | toObservable | async}}</span>\r\n            </button>\r\n            <button [ngClass]=\"['mtx-grid-action-button', btn.class||'']\"\r\n                    *ngIf=\"!btn.type || btn.type==='icon'\"\r\n                    mat-icon-button\r\n                    [color]=\"btn.color || 'primary'\"\r\n                    [disabled]=\"btn.disabled\"\r\n                    [matTooltip]=\"btn.tooltip | toObservable | async\"\r\n                    (click)=\"_handleActionClick($event, btn, rowData)\">\r\n              <mat-icon>{{btn.icon}}</mat-icon>\r\n            </button>\r\n          </ng-template>\r\n        </ng-container>\r\n      </ng-container>\r\n    </ng-container>\r\n    <!-- Link -->\r\n    <ng-container *ngSwitchCase=\"'link'\">\r\n      <a [href]=\"_colValue\" target=\"_blank\">{{_colValue}}</a>\r\n    </ng-container>\r\n    <!-- Image -->\r\n    <ng-container *ngSwitchCase=\"'image'\">\r\n      <img class=\"mtx-grid-img\" [src]=\"_colValue\" (click)=\"_onPreview(_colValue)\">\r\n    </ng-container>\r\n    <!-- Boolean -->\r\n    <ng-container *ngSwitchCase=\"'boolean'\">\r\n      <span [title]=\"_getTooltip(_colValue)\">{{_getText(_colValue)}}</span>\r\n    </ng-container>\r\n    <!-- Number -->\r\n    <ng-container *ngSwitchCase=\"'number'\">\r\n      <span [title]=\"_getTooltip(_colValue | number: colDef.typeParameter?.digitsInfo : colDef.typeParameter?.locale)\">\r\n        {{_getText(_colValue | number: colDef.typeParameter?.digitsInfo : colDef.typeParameter?.locale)}}\r\n      </span>\r\n    </ng-container>\r\n    <!-- Currency -->\r\n    <ng-container *ngSwitchCase=\"'currency'\">\r\n      <span [title]=\"_getTooltip(_colValue | currency: colDef.typeParameter?.currencyCode : colDef.typeParameter?.display : colDef.typeParameter?.digitsInfo : colDef.typeParameter?.locale)\">\r\n        {{_getText(_colValue | currency: colDef.typeParameter?.currencyCode : colDef.typeParameter?.display : colDef.typeParameter?.digitsInfo : colDef.typeParameter?.locale)}}\r\n      </span>\r\n    </ng-container>\r\n    <!-- Percent -->\r\n    <ng-container *ngSwitchCase=\"'percent'\">\r\n      <span [title]=\"_getTooltip(_colValue | percent: colDef.typeParameter?.digitsInfo : colDef.typeParameter?.locale)\">\r\n        {{_getText(_colValue | percent: colDef.typeParameter?.digitsInfo : colDef.typeParameter?.locale)}}\r\n      </span>\r\n    </ng-container>\r\n    <!-- Date -->\r\n    <ng-container *ngSwitchCase=\"'date'\">\r\n      <span [title]=\"_getTooltip(_colValue | date: colDef.typeParameter?.format : colDef.typeParameter?.timezone : colDef.typeParameter?.locale)\">\r\n        {{_getText(_colValue | date: colDef.typeParameter?.format : colDef.typeParameter?.timezone : colDef.typeParameter?.locale)}}\r\n      </span>\r\n    </ng-container>\r\n    <!-- Default -->\r\n    <ng-container *ngSwitchDefault>\r\n      <span [title]=\"_getTooltip(_colValue)\">{{_getText(_colValue)}}</span>\r\n    </ng-container>\r\n  </ng-container>\r\n</ng-template>\r\n",
                encapsulation: ViewEncapsulation.None,
                styles: [".mtx-grid-action-button .mat-icon{width:18px;height:18px;font-size:18px;line-height:18px}.mtx-grid-img{display:block;width:30px;border-radius:4px;cursor:pointer}"]
            },] }
];
/** @nocollapse */
MtxGridCellComponent.ctorParameters = () => [
    { type: MtxDialog },
    { type: MtxGridService }
];
MtxGridCellComponent.propDecorators = {
    rowData: [{ type: Input }],
    colDef: [{ type: Input }],
    data: [{ type: Input }],
    summary: [{ type: Input }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2VsbC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wcm9qZWN0cy9leHRlbnNpb25zL2RhdGEtZ3JpZC9jZWxsLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBRSxpQkFBaUIsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUVwRSxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sOEJBQThCLENBQUM7QUFJekQsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQ2hELE9BQU8sV0FBVyxNQUFNLGFBQWEsQ0FBQztBQVN0QyxNQUFNLE9BQU8sb0JBQW9CO0lBd0QvQixZQUFvQixPQUFrQixFQUFVLFlBQTRCO1FBQXhELFlBQU8sR0FBUCxPQUFPLENBQVc7UUFBVSxpQkFBWSxHQUFaLFlBQVksQ0FBZ0I7UUF2RDVFLGVBQWU7UUFDTixZQUFPLEdBQUcsRUFBRSxDQUFDO1FBS3RCLGVBQWU7UUFDTixTQUFJLEdBQUcsRUFBRSxDQUFDO1FBRW5CLDJCQUEyQjtRQUNsQixZQUFPLEdBQUcsS0FBSyxDQUFDO0lBNkNzRCxDQUFDO0lBM0NoRixJQUFJLFNBQVM7UUFDWCxPQUFPLElBQUksQ0FBQyxZQUFZLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ25FLENBQUM7SUFFRCxTQUFTLENBQUMsRUFBTztRQUNmLE9BQU8sTUFBTSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxLQUFLLGlCQUFpQixDQUFDO0lBQ2xFLENBQUM7SUFFRCxXQUFXLENBQUMsRUFBTztRQUNqQixPQUFPLE1BQU0sQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsS0FBSyxtQkFBbUIsQ0FBQztJQUNwRSxDQUFDO0lBRUQsYUFB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QUFDLEdBQUcsRUFBRSxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO1FBQ2pELENBQUMsQ0FBQyxDQUFDO1FBRUgsTUFBTSxhQUFhLEdBQ2pCLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQztZQUNiLENBQUMsQ0FBQyxDQUFDLFFBQVEsRUFBRSxTQUFTLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxhQUFhLEVBQUUsWUFBWSxFQUFFLFlBQVksQ0FBQztZQUNsRixDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUUsU0FBUyxFQUFFLGFBQWEsRUFBRSxZQUFZLEVBQUUsWUFBWSxDQUFDLENBQUM7UUFFdkUsTUFBTSxPQUFPLEdBQXdCO1lBQ25DLEtBQUssRUFBRSxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUM7WUFDdEIsYUFBYTtTQUNkLENBQUM7UUFFRixNQUFNLE1BQU0sR0FBRyxJQUFJLFdBQVcsQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDaEQsQ0FBQzs7O1lBekhGLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsZUFBZTtnQkFDekIsUUFBUSxFQUFFLGFBQWE7Z0JBQ3ZCLHcvTUFBb0M7Z0JBRXBDLGFBQWEsRUFBRSxpQkFBaUIsQ0FBQyxJQUFJOzthQUN0Qzs7OztZQWJRLFNBQVM7WUFJVCxjQUFjOzs7c0JBWXBCLEtBQUs7cUJBR0wsS0FBSzttQkFHTCxLQUFLO3NCQUdMLEtBQUsiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIElucHV0LCBWaWV3RW5jYXBzdWxhdGlvbiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBUaGVtZVBhbGV0dGUgfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9jb3JlJztcclxuaW1wb3J0IHsgTXR4RGlhbG9nIH0gZnJvbSAnQG5nLW1hdGVyby9leHRlbnNpb25zL2RpYWxvZyc7XHJcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcclxuXHJcbmltcG9ydCB7IE10eEdyaWRDb2x1bW4sIE10eEdyaWRDb2x1bW5CdXR0b24gfSBmcm9tICcuL2dyaWQuaW50ZXJmYWNlJztcclxuaW1wb3J0IHsgTXR4R3JpZFNlcnZpY2UgfSBmcm9tICcuL2dyaWQuc2VydmljZSc7XHJcbmltcG9ydCBQaG90b1ZpZXdlciBmcm9tICdwaG90b3ZpZXdlcic7XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICBzZWxlY3RvcjogJ210eC1ncmlkLWNlbGwnLFxyXG4gIGV4cG9ydEFzOiAnbXR4R3JpZENlbGwnLFxyXG4gIHRlbXBsYXRlVXJsOiAnLi9jZWxsLmNvbXBvbmVudC5odG1sJyxcclxuICBzdHlsZVVybHM6IFsnLi9jZWxsLmNvbXBvbmVudC5zY3NzJ10sXHJcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcclxufSlcclxuZXhwb3J0IGNsYXNzIE10eEdyaWRDZWxsQ29tcG9uZW50IHtcclxuICAvKiogUm93IGRhdGEgKi9cclxuICBASW5wdXQoKSByb3dEYXRhID0ge307XHJcblxyXG4gIC8qKiBDb2x1bW4gZGVmaW5pdGlvbiAqL1xyXG4gIEBJbnB1dCgpIGNvbERlZjogTXR4R3JpZENvbHVtbjtcclxuXHJcbiAgLyoqIEFsbCBkYXRhICovXHJcbiAgQElucHV0KCkgZGF0YSA9IFtdO1xyXG5cclxuICAvKiogV2hldGhlciBzaG93IHN1bW1hcnkgKi9cclxuICBASW5wdXQoKSBzdW1tYXJ5ID0gZmFsc2U7XHJcblxyXG4gIGdldCBfY29sVmFsdWUoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5fZGF0YUdyaWRTcnYuZ2V0Q2VsbFZhbHVlKHRoaXMucm93RGF0YSwgdGhpcy5jb2xEZWYpO1xyXG4gIH1cclxuXHJcbiAgX2lzU3RyaW5nKGZuOiBhbnkpIHtcclxuICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoZm4pID09PSAnW29iamVjdCBTdHJpbmddJztcclxuICB9XHJcblxyXG4gIF9pc0Z1bmN0aW9uKGZuOiBhbnkpIHtcclxuICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoZm4pID09PSAnW29iamVjdCBGdW5jdGlvbl0nO1xyXG4gIH1cclxuXHJcbiAgX2lzRW1wdHlWYWx1ZSh2YWx1ZTogYW55KSB7XHJcbiAgICByZXR1cm4gdmFsdWUgPT0gbnVsbCB8fCB2YWx1ZS50b1N0cmluZygpID09PSAnJztcclxuICB9XHJcblxyXG4gIF9pc0NvbnRhaW5IVE1MKHZhbHVlOiBzdHJpbmcpIHtcclxuICAgIHJldHVybiAvPFxcLz9bYS16XVtcXHNcXFNdKj4vaS50ZXN0KHZhbHVlKTtcclxuICB9XHJcblxyXG4gIF9nZXRUZXh0KHZhbHVlOiBhbnkpIHtcclxuICAgIHJldHVybiB0aGlzLl9pc0VtcHR5VmFsdWUodmFsdWUpID8gJy0tJyA6IHZhbHVlO1xyXG4gIH1cclxuXHJcbiAgX2dldFRvb2x0aXAodmFsdWU6IGFueSkge1xyXG4gICAgcmV0dXJuIHRoaXMuX2lzRW1wdHlWYWx1ZSh2YWx1ZSkgPyAnJyA6IHZhbHVlO1xyXG4gIH1cclxuXHJcbiAgX2dldEZvcm1hdHRlclRvb2x0aXAodmFsdWU6IGFueSkge1xyXG4gICAgcmV0dXJuIHRoaXMuX2lzQ29udGFpbkhUTUwodmFsdWUpIHx8IHRoaXMuX2lzRW1wdHlWYWx1ZSh2YWx1ZSkgPyAnJyA6IHZhbHVlO1xyXG4gIH1cclxuXHJcbiAgX2Zvcm1hdFN1bW1hcnkoZGF0YTogYW55W10sIGNvbERlZjogTXR4R3JpZENvbHVtbikge1xyXG4gICAgaWYgKHRoaXMuX2lzU3RyaW5nKGNvbERlZi5zdW1tYXJ5KSkge1xyXG4gICAgICByZXR1cm4gY29sRGVmLnN1bW1hcnk7XHJcbiAgICB9IGVsc2UgaWYgKHRoaXMuX2lzRnVuY3Rpb24oY29sRGVmLnN1bW1hcnkpKSB7XHJcbiAgICAgIHJldHVybiAoY29sRGVmLnN1bW1hcnkgYXMgKGRhdGE6IGFueVtdLCBjb2xEZWY/OiBNdHhHcmlkQ29sdW1uKSA9PiB2b2lkKShcclxuICAgICAgICB0aGlzLl9kYXRhR3JpZFNydi5nZXRDb2xEYXRhKGRhdGEsIGNvbERlZiksXHJcbiAgICAgICAgY29sRGVmXHJcbiAgICAgICk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9kaWFsb2c6IE10eERpYWxvZywgcHJpdmF0ZSBfZGF0YUdyaWRTcnY6IE10eEdyaWRTZXJ2aWNlKSB7fVxyXG5cclxuICBfaGFuZGxlQWN0aW9uQ29uZmlybShcclxuICAgIGV2ZW50OiBNb3VzZUV2ZW50LFxyXG4gICAgdGl0bGU6IHN0cmluZyB8IE9ic2VydmFibGU8c3RyaW5nPixcclxuICAgIGRlc2NyaXB0aW9uOiBzdHJpbmcgfCBPYnNlcnZhYmxlPHN0cmluZz4gPSAnJyxcclxuICAgIG9rQ29sb3I6IFRoZW1lUGFsZXR0ZSA9ICdwcmltYXJ5JyxcclxuICAgIG9rVGV4dDogc3RyaW5nIHwgT2JzZXJ2YWJsZTxzdHJpbmc+ID0gJ09LJyxcclxuICAgIGNsb3NlQ29sb3I6IFRoZW1lUGFsZXR0ZSxcclxuICAgIGNsb3NlVGV4dDogc3RyaW5nIHwgT2JzZXJ2YWJsZTxzdHJpbmc+ID0gJ0NMT1NFJyxcclxuICAgIGZuPzogKHA6IGFueSkgPT4gdm9pZCxcclxuICAgIGRhdGE/OiBhbnlcclxuICApIHtcclxuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuXHJcbiAgICB0aGlzLl9kaWFsb2cub3Blbih7XHJcbiAgICAgIHRpdGxlLFxyXG4gICAgICBkZXNjcmlwdGlvbixcclxuICAgICAgYnV0dG9uczogW1xyXG4gICAgICAgIHtcclxuICAgICAgICAgIGNvbG9yOiBva0NvbG9yLFxyXG4gICAgICAgICAgdGV4dDogb2tUZXh0LFxyXG4gICAgICAgICAgb25DbGljazogKCkgPT4gKGZuID8gZm4oZGF0YSkgOiB7fSksXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7IGNvbG9yOiBjbG9zZUNvbG9yLCB0ZXh0OiBjbG9zZVRleHQsIG9uQ2xpY2s6ICgpID0+IHt9IH0sXHJcbiAgICAgIF0sXHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIF9oYW5kbGVBY3Rpb25DbGljayhldmVudDogTW91c2VFdmVudCwgYnRuOiBNdHhHcmlkQ29sdW1uQnV0dG9uLCByb3dEYXRhOiBhbnkpIHtcclxuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuXHJcbiAgICBpZiAoYnRuLmNsaWNrKSB7XHJcbiAgICAgIGJ0bi5jbGljayhyb3dEYXRhKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qKiBQcmV2aWV3IGVubGFyZ2VkIGltYWdlICovXHJcbiAgX29uUHJldmlldyh1cmxTdHI6IHN0cmluZykge1xyXG4gICAgY29uc3QgaW1nczogUGhvdG9WaWV3ZXIuSW1nW10gPSBbXTtcclxuXHJcbiAgICB0aGlzLl9kYXRhR3JpZFNydi5zdHIyYXJyKHVybFN0cikuZm9yRWFjaCgodXJsLCBpbmRleCkgPT4ge1xyXG4gICAgICBpbWdzLnB1c2goeyB0aXRsZTogaW5kZXggKyAxICsgJycsIHNyYzogdXJsIH0pO1xyXG4gICAgfSk7XHJcblxyXG4gICAgY29uc3QgZm9vdGVyVG9vbGJhciA9XHJcbiAgICAgIGltZ3MubGVuZ3RoID4gMVxyXG4gICAgICAgID8gWyd6b29tSW4nLCAnem9vbU91dCcsICdwcmV2JywgJ25leHQnLCAncm90YXRlUmlnaHQnLCAncm90YXRlTGVmdCcsICdhY3R1YWxTaXplJ11cclxuICAgICAgICA6IFsnem9vbUluJywgJ3pvb21PdXQnLCAncm90YXRlUmlnaHQnLCAncm90YXRlTGVmdCcsICdhY3R1YWxTaXplJ107XHJcblxyXG4gICAgY29uc3Qgb3B0aW9uczogUGhvdG9WaWV3ZXIuT3B0aW9ucyA9IHtcclxuICAgICAgdGl0bGU6IGltZ3MubGVuZ3RoID4gMSxcclxuICAgICAgZm9vdGVyVG9vbGJhcixcclxuICAgIH07XHJcblxyXG4gICAgY29uc3Qgdmlld2VyID0gbmV3IFBob3RvVmlld2VyKGltZ3MsIG9wdGlvbnMpO1xyXG4gIH1cclxufVxyXG4iXX0=