import { Component, Input, ContentChild, TemplateRef, ViewEncapsulation, ChangeDetectionStrategy, } from '@angular/core';
export class MtxText3dComponent {
    constructor() {
        this.text = '';
        this.depth = 20;
        this.rotateX = 60;
        this.rotateY = 0;
        this.rotateZ = 0;
    }
    get transform() {
        return `rotateX(${this.rotateX}deg) rotateY(${this.rotateY}deg) rotateZ(${this.rotateZ}deg)`;
    }
    get depthArr() {
        const tmpArr = [];
        for (let i = 1; i <= this.depth; i++) {
            tmpArr.push(i);
        }
        return tmpArr;
    }
}
MtxText3dComponent.decorators = [
    { type: Component, args: [{
                selector: 'mtx-text3d',
                exportAs: 'mtxText3d',
                host: {
                    'class': 'mtx-text3d',
                    '[style.transform]': 'transform',
                },
                template: "<span class=\"mtx-text3d-layer\" *ngFor=\"let i of depthArr\"\n      [ngStyle]=\"{'z-index': -i, 'transform': 'translate3d(0, 0,'+ -i + 'px)'}\">\n  {{text}}\n  <ng-container [ngTemplateOutlet]=\"template\"></ng-container>\n</span>\n",
                encapsulation: ViewEncapsulation.None,
                changeDetection: ChangeDetectionStrategy.OnPush,
                styles: [".mtx-text3d{display:block;transform-style:preserve-3d;-webkit-animation:rotate 5s ease infinite;animation:rotate 5s ease infinite;font-weight:700}.mtx-text3d .mtx-text3d-layer{display:block;text-align:center;font-size:10rem}.mtx-text3d .mtx-text3d-layer:not(:first-child){position:absolute;top:0;left:0;right:0;margin:auto;transform-style:preserve-3d}"]
            },] }
];
/** @nocollapse */
MtxText3dComponent.ctorParameters = () => [];
MtxText3dComponent.propDecorators = {
    template: [{ type: ContentChild, args: [TemplateRef, { static: false },] }],
    text: [{ type: Input }],
    depth: [{ type: Input }],
    rotateX: [{ type: Input }],
    rotateY: [{ type: Input }],
    rotateZ: [{ type: Input }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGV4dDNkLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL2V4dGVuc2lvbnMvdGV4dDNkL3RleHQzZC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUNMLFNBQVMsRUFDVCxLQUFLLEVBQ0wsWUFBWSxFQUNaLFdBQVcsRUFDWCxpQkFBaUIsRUFDakIsdUJBQXVCLEdBQ3hCLE1BQU0sZUFBZSxDQUFDO0FBY3ZCLE1BQU0sT0FBTyxrQkFBa0I7SUF1QjdCO1FBcEJTLFNBQUksR0FBRyxFQUFFLENBQUM7UUFFVixVQUFLLEdBQUcsRUFBRSxDQUFDO1FBRVgsWUFBTyxHQUFHLEVBQUUsQ0FBQztRQUNiLFlBQU8sR0FBRyxDQUFDLENBQUM7UUFDWixZQUFPLEdBQUcsQ0FBQyxDQUFDO0lBY04sQ0FBQztJQVpoQixJQUFJLFNBQVM7UUFDWCxPQUFPLFdBQVcsSUFBSSxDQUFDLE9BQU8sZ0JBQWdCLElBQUksQ0FBQyxPQUFPLGdCQUFnQixJQUFJLENBQUMsT0FBTyxNQUFNLENBQUM7SUFDL0YsQ0FBQztJQUVELElBQUksUUFBUTtRQUNWLE1BQU0sTUFBTSxHQUFhLEVBQUUsQ0FBQztRQUM1QixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLElBQUksSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUNwQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQ2hCO1FBQ0QsT0FBTyxNQUFNLENBQUM7SUFDaEIsQ0FBQzs7O1lBakNGLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsWUFBWTtnQkFDdEIsUUFBUSxFQUFFLFdBQVc7Z0JBQ3JCLElBQUksRUFBRTtvQkFDSixPQUFPLEVBQUUsWUFBWTtvQkFDckIsbUJBQW1CLEVBQUUsV0FBVztpQkFDakM7Z0JBQ0QscVBBQXNDO2dCQUV0QyxhQUFhLEVBQUUsaUJBQWlCLENBQUMsSUFBSTtnQkFDckMsZUFBZSxFQUFFLHVCQUF1QixDQUFDLE1BQU07O2FBQ2hEOzs7Ozt1QkFFRSxZQUFZLFNBQUMsV0FBVyxFQUFFLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRTttQkFFM0MsS0FBSztvQkFFTCxLQUFLO3NCQUVMLEtBQUs7c0JBQ0wsS0FBSztzQkFDTCxLQUFLIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgQ29tcG9uZW50LFxuICBJbnB1dCxcbiAgQ29udGVudENoaWxkLFxuICBUZW1wbGF0ZVJlZixcbiAgVmlld0VuY2Fwc3VsYXRpb24sXG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbXR4LXRleHQzZCcsXG4gIGV4cG9ydEFzOiAnbXR4VGV4dDNkJyxcbiAgaG9zdDoge1xuICAgICdjbGFzcyc6ICdtdHgtdGV4dDNkJyxcbiAgICAnW3N0eWxlLnRyYW5zZm9ybV0nOiAndHJhbnNmb3JtJyxcbiAgfSxcbiAgdGVtcGxhdGVVcmw6ICcuL3RleHQzZC5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL3RleHQzZC5jb21wb25lbnQuc2NzcyddLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbn0pXG5leHBvcnQgY2xhc3MgTXR4VGV4dDNkQ29tcG9uZW50IHtcbiAgQENvbnRlbnRDaGlsZChUZW1wbGF0ZVJlZiwgeyBzdGF0aWM6IGZhbHNlIH0pIHRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xuXG4gIEBJbnB1dCgpIHRleHQgPSAnJztcblxuICBASW5wdXQoKSBkZXB0aCA9IDIwO1xuXG4gIEBJbnB1dCgpIHJvdGF0ZVggPSA2MDtcbiAgQElucHV0KCkgcm90YXRlWSA9IDA7XG4gIEBJbnB1dCgpIHJvdGF0ZVogPSAwO1xuXG4gIGdldCB0cmFuc2Zvcm0oKSB7XG4gICAgcmV0dXJuIGByb3RhdGVYKCR7dGhpcy5yb3RhdGVYfWRlZykgcm90YXRlWSgke3RoaXMucm90YXRlWX1kZWcpIHJvdGF0ZVooJHt0aGlzLnJvdGF0ZVp9ZGVnKWA7XG4gIH1cblxuICBnZXQgZGVwdGhBcnIoKSB7XG4gICAgY29uc3QgdG1wQXJyOiBudW1iZXJbXSA9IFtdO1xuICAgIGZvciAobGV0IGkgPSAxOyBpIDw9IHRoaXMuZGVwdGg7IGkrKykge1xuICAgICAgdG1wQXJyLnB1c2goaSk7XG4gICAgfVxuICAgIHJldHVybiB0bXBBcnI7XG4gIH1cblxuICBjb25zdHJ1Y3RvcigpIHt9XG59XG4iXX0=