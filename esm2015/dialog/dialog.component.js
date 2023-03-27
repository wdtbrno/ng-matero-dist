import { Component, Inject, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
export class MtxDialogComponent {
    constructor(dialogRef, data) {
        this.dialogRef = dialogRef;
        this.data = data;
    }
    _onClick(fn) {
        if (fn) {
            fn.call(this);
        }
        this._onClose();
    }
    _onClose() {
        this.dialogRef.close();
    }
}
MtxDialogComponent.decorators = [
    { type: Component, args: [{
                selector: 'mtx-dialog',
                exportAs: 'mtxDialog',
                template: "<h1 class=\"mtx-dialog-title\" *ngIf=\"data.title\">{{data.title | toObservable | async}}\n  <button mat-icon-button *ngIf=\"data.showCloseIcon\" (click)=\"_onClose()\">\n    <mat-icon>close</mat-icon>\n  </button>\n</h1>\n<div class=\"mtx-dialog-content\" *ngIf=\"data.description\">\n  <p>{{data.description | toObservable | async}}</p>\n</div>\n<div class=\"mtx-dialog-actions\">\n  <ng-container *ngFor=\"let btn of data.buttons\">\n    <ng-container [ngSwitch]=\"btn.type\">\n      <ng-container *ngSwitchCase=\"'raised'\">\n        <button mat-raised-button *ngIf=\"btn.focusInitial\" cdkFocusInitial\n                [color]=\"btn.color\" [ngClass]=\"btn.class\" (click)=\"_onClick(btn.onClick)\">\n          {{btn.text | toObservable | async}}\n        </button>\n        <button mat-raised-button *ngIf=\"!btn.focusInitial\"\n                [color]=\"btn.color\" [ngClass]=\"btn.class\" (click)=\"_onClick(btn.onClick)\">\n          {{btn.text | toObservable | async}}\n        </button>\n      </ng-container>\n      <ng-container *ngSwitchCase=\"'stroked'\">\n        <button mat-stroked-button *ngIf=\"btn.focusInitial\" cdkFocusInitial\n                [color]=\"btn.color\" [ngClass]=\"btn.class\" (click)=\"_onClick(btn.onClick)\">\n          {{btn.text | toObservable | async}}\n        </button>\n        <button mat-stroked-button *ngIf=\"!btn.focusInitial\"\n                [color]=\"btn.color\" [ngClass]=\"btn.class\" (click)=\"_onClick(btn.onClick)\">\n          {{btn.text | toObservable | async}}\n        </button>\n      </ng-container>\n      <ng-container *ngSwitchCase=\"'flat'\">\n        <button mat-flat-button *ngIf=\"btn.focusInitial\" cdkFocusInitial\n                [color]=\"btn.color\" [ngClass]=\"btn.class\" (click)=\"_onClick(btn.onClick)\">\n          {{btn.text | toObservable | async}}\n        </button>\n        <button mat-flat-button *ngIf=\"!btn.focusInitial\"\n                [color]=\"btn.color\" [ngClass]=\"btn.class\" (click)=\"_onClick(btn.onClick)\">\n          {{btn.text | toObservable | async}}\n        </button>\n      </ng-container>\n      <ng-container *ngSwitchDefault>\n        <button mat-button *ngIf=\"btn.focusInitial\" cdkFocusInitial\n                [color]=\"btn.color\" [ngClass]=\"btn.class\" (click)=\"_onClick(btn.onClick)\">\n          {{btn.text | toObservable | async}}\n        </button>\n        <button mat-button *ngIf=\"!btn.focusInitial\"\n                [color]=\"btn.color\" [ngClass]=\"btn.class\" (click)=\"_onClick(btn.onClick)\">\n          {{btn.text | toObservable | async}}\n        </button>\n      </ng-container>\n    </ng-container>\n  </ng-container>\n</div>\n",
                encapsulation: ViewEncapsulation.None,
                changeDetection: ChangeDetectionStrategy.OnPush,
                styles: [".mtx-dialog-title{display:flex;justify-content:space-between;align-items:center;margin:0 0 20px;font:500 20px/32px Roboto,Helvetica Neue,sans-serif;letter-spacing:normal}.mtx-dialog-content{display:block;max-height:65vh;padding:0 24px;margin:0 -24px;overflow:auto;-webkit-overflow-scrolling:touch}.mtx-dialog-actions{display:flex;flex-wrap:wrap;align-items:center;justify-content:flex-end;min-height:52px;padding:8px 0;margin-bottom:-24px}"]
            },] }
];
/** @nocollapse */
MtxDialogComponent.ctorParameters = () => [
    { type: MatDialogRef },
    { type: undefined, decorators: [{ type: Inject, args: [MAT_DIALOG_DATA,] }] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlhbG9nLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL2V4dGVuc2lvbnMvZGlhbG9nL2RpYWxvZy5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLEVBQUUsaUJBQWlCLEVBQUUsdUJBQXVCLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDOUYsT0FBTyxFQUFFLFlBQVksRUFBRSxlQUFlLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQztBQVl6RSxNQUFNLE9BQU8sa0JBQWtCO0lBQzdCLFlBQ1MsU0FBMkMsRUFDbEIsSUFBbUI7UUFENUMsY0FBUyxHQUFULFNBQVMsQ0FBa0M7UUFDbEIsU0FBSSxHQUFKLElBQUksQ0FBZTtJQUNsRCxDQUFDO0lBRUosUUFBUSxDQUFDLEVBQWM7UUFDckIsSUFBSSxFQUFFLEVBQUU7WUFDTixFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQ2Y7UUFDRCxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7SUFDbEIsQ0FBQztJQUVELFFBQVE7UUFDTixJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxDQUFDO0lBQ3pCLENBQUM7OztZQXZCRixTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLFlBQVk7Z0JBQ3RCLFFBQVEsRUFBRSxXQUFXO2dCQUNyQixzbkZBQXNDO2dCQUV0QyxhQUFhLEVBQUUsaUJBQWlCLENBQUMsSUFBSTtnQkFDckMsZUFBZSxFQUFFLHVCQUF1QixDQUFDLE1BQU07O2FBQ2hEOzs7O1lBWFEsWUFBWTs0Q0FlaEIsTUFBTSxTQUFDLGVBQWUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIEluamVjdCwgVmlld0VuY2Fwc3VsYXRpb24sIENoYW5nZURldGVjdGlvblN0cmF0ZWd5IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBNYXREaWFsb2dSZWYsIE1BVF9ESUFMT0dfREFUQSB9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2RpYWxvZyc7XG5cbmltcG9ydCB7IE10eERpYWxvZ0RhdGEgfSBmcm9tICcuL2RpYWxvZy5jb25maWcnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdtdHgtZGlhbG9nJyxcbiAgZXhwb3J0QXM6ICdtdHhEaWFsb2cnLFxuICB0ZW1wbGF0ZVVybDogJy4vZGlhbG9nLmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJy4vZGlhbG9nLmNvbXBvbmVudC5zY3NzJ10sXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxufSlcbmV4cG9ydCBjbGFzcyBNdHhEaWFsb2dDb21wb25lbnQge1xuICBjb25zdHJ1Y3RvcihcbiAgICBwdWJsaWMgZGlhbG9nUmVmOiBNYXREaWFsb2dSZWY8TXR4RGlhbG9nQ29tcG9uZW50PixcbiAgICBASW5qZWN0KE1BVF9ESUFMT0dfREFUQSkgcHVibGljIGRhdGE6IE10eERpYWxvZ0RhdGFcbiAgKSB7fVxuXG4gIF9vbkNsaWNrKGZuOiAoKSA9PiB2b2lkKSB7XG4gICAgaWYgKGZuKSB7XG4gICAgICBmbi5jYWxsKHRoaXMpO1xuICAgIH1cbiAgICB0aGlzLl9vbkNsb3NlKCk7XG4gIH1cblxuICBfb25DbG9zZSgpIHtcbiAgICB0aGlzLmRpYWxvZ1JlZi5jbG9zZSgpO1xuICB9XG59XG4iXX0=