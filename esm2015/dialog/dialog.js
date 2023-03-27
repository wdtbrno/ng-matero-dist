import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MtxDialogComponent } from './dialog.component';
const ɵ0 = () => { }, ɵ1 = () => { };
const defaults = {
    title: '',
    description: '',
    buttons: [
        {
            color: 'warn',
            text: 'OK',
            focusInitial: true,
            onClick: ɵ0,
        },
        {
            text: 'CLOSE',
            onClick: ɵ1,
        },
    ],
    showCloseIcon: false,
    disableClose: true,
    width: '300px',
};
export class MtxDialog {
    constructor(dialog) {
        this.dialog = dialog;
    }
    originalOpen(componentOrTemplateRef = MtxDialogComponent, config) {
        return this.dialog.open(componentOrTemplateRef, config);
    }
    open(config, componentOrTemplateRef = MtxDialogComponent) {
        const data = Object.assign({}, defaults, config);
        return this.dialog.open(componentOrTemplateRef, Object.assign(Object.assign({}, data), { data }));
    }
    alert(title, description = '', onOk = () => { }) {
        this.open({
            title,
            description,
            buttons: [
                {
                    color: 'warn',
                    text: 'OK',
                    onClick: () => onOk(),
                },
            ],
        });
    }
    confirm(title, description = '', onOk = () => { }, onClose = () => { }) {
        this.open({
            title,
            description,
            buttons: [
                {
                    color: 'warn',
                    text: 'OK',
                    onClick: () => onOk(),
                },
                {
                    text: 'CLOSE',
                    onClick: () => onClose(),
                },
            ],
        });
    }
}
MtxDialog.decorators = [
    { type: Injectable }
];
/** @nocollapse */
MtxDialog.ctorParameters = () => [
    { type: MatDialog }
];
export { ɵ0, ɵ1 };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlhbG9nLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vcHJvamVjdHMvZXh0ZW5zaW9ucy9kaWFsb2cvZGlhbG9nLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQWUsTUFBTSxlQUFlLENBQUM7QUFFeEQsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLDBCQUEwQixDQUFDO0FBRXJELE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLG9CQUFvQixDQUFDO1dBWXpDLEdBQUcsRUFBRSxHQUFFLENBQUMsT0FJUixHQUFHLEVBQUUsR0FBRSxDQUFDO0FBWnZCLE1BQU0sUUFBUSxHQUFrQjtJQUM5QixLQUFLLEVBQUUsRUFBRTtJQUNULFdBQVcsRUFBRSxFQUFFO0lBQ2YsT0FBTyxFQUFFO1FBQ1A7WUFDRSxLQUFLLEVBQUUsTUFBTTtZQUNiLElBQUksRUFBRSxJQUFJO1lBQ1YsWUFBWSxFQUFFLElBQUk7WUFDbEIsT0FBTyxJQUFVO1NBQ2xCO1FBQ0Q7WUFDRSxJQUFJLEVBQUUsT0FBTztZQUNiLE9BQU8sSUFBVTtTQUNsQjtLQUNGO0lBQ0QsYUFBYSxFQUFFLEtBQUs7SUFDcEIsWUFBWSxFQUFFLElBQUk7SUFDbEIsS0FBSyxFQUFFLE9BQU87Q0FDZixDQUFDO0FBR0YsTUFBTSxPQUFPLFNBQVM7SUFDcEIsWUFBbUIsTUFBaUI7UUFBakIsV0FBTSxHQUFOLE1BQU0sQ0FBVztJQUFHLENBQUM7SUFFeEMsWUFBWSxDQUNWLHlCQUFnRSxrQkFBa0IsRUFDbEYsTUFBVztRQUVYLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsc0JBQXNCLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDMUQsQ0FBQztJQUVELElBQUksQ0FDRixNQUFxQixFQUNyQix5QkFBZ0Usa0JBQWtCO1FBRWxGLE1BQU0sSUFBSSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLFFBQVEsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUNqRCxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLHNCQUFzQixrQ0FDekMsSUFBSSxLQUNQLElBQUksSUFDSixDQUFDO0lBQ0wsQ0FBQztJQUVELEtBQUssQ0FDSCxLQUFrQyxFQUNsQyxjQUEyQyxFQUFFLEVBQzdDLElBQUksR0FBRyxHQUFHLEVBQUUsR0FBRSxDQUFDO1FBRWYsSUFBSSxDQUFDLElBQUksQ0FBQztZQUNSLEtBQUs7WUFDTCxXQUFXO1lBQ1gsT0FBTyxFQUFFO2dCQUNQO29CQUNFLEtBQUssRUFBRSxNQUFNO29CQUNiLElBQUksRUFBRSxJQUFJO29CQUNWLE9BQU8sRUFBRSxHQUFHLEVBQUUsQ0FBQyxJQUFJLEVBQUU7aUJBQ3RCO2FBQ0Y7U0FDRixDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUQsT0FBTyxDQUNMLEtBQWtDLEVBQ2xDLGNBQTJDLEVBQUUsRUFDN0MsSUFBSSxHQUFHLEdBQUcsRUFBRSxHQUFFLENBQUMsRUFDZixPQUFPLEdBQUcsR0FBRyxFQUFFLEdBQUUsQ0FBQztRQUVsQixJQUFJLENBQUMsSUFBSSxDQUFDO1lBQ1IsS0FBSztZQUNMLFdBQVc7WUFDWCxPQUFPLEVBQUU7Z0JBQ1A7b0JBQ0UsS0FBSyxFQUFFLE1BQU07b0JBQ2IsSUFBSSxFQUFFLElBQUk7b0JBQ1YsT0FBTyxFQUFFLEdBQUcsRUFBRSxDQUFDLElBQUksRUFBRTtpQkFDdEI7Z0JBQ0Q7b0JBQ0UsSUFBSSxFQUFFLE9BQU87b0JBQ2IsT0FBTyxFQUFFLEdBQUcsRUFBRSxDQUFDLE9BQU8sRUFBRTtpQkFDekI7YUFDRjtTQUNGLENBQUMsQ0FBQztJQUNMLENBQUM7OztZQTdERixVQUFVOzs7O1lBMUJGLFNBQVMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlLCBUZW1wbGF0ZVJlZiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQ29tcG9uZW50VHlwZSB9IGZyb20gJ0Bhbmd1bGFyL2Nkay9wb3J0YWwnO1xuaW1wb3J0IHsgTWF0RGlhbG9nIH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvZGlhbG9nJztcblxuaW1wb3J0IHsgTXR4RGlhbG9nQ29tcG9uZW50IH0gZnJvbSAnLi9kaWFsb2cuY29tcG9uZW50JztcbmltcG9ydCB7IE10eERpYWxvZ0RhdGEgfSBmcm9tICcuL2RpYWxvZy5jb25maWcnO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xuXG5jb25zdCBkZWZhdWx0czogTXR4RGlhbG9nRGF0YSA9IHtcbiAgdGl0bGU6ICcnLFxuICBkZXNjcmlwdGlvbjogJycsXG4gIGJ1dHRvbnM6IFtcbiAgICB7XG4gICAgICBjb2xvcjogJ3dhcm4nLFxuICAgICAgdGV4dDogJ09LJyxcbiAgICAgIGZvY3VzSW5pdGlhbDogdHJ1ZSxcbiAgICAgIG9uQ2xpY2s6ICgpID0+IHt9LFxuICAgIH0sXG4gICAge1xuICAgICAgdGV4dDogJ0NMT1NFJyxcbiAgICAgIG9uQ2xpY2s6ICgpID0+IHt9LFxuICAgIH0sXG4gIF0sXG4gIHNob3dDbG9zZUljb246IGZhbHNlLFxuICBkaXNhYmxlQ2xvc2U6IHRydWUsXG4gIHdpZHRoOiAnMzAwcHgnLFxufTtcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIE10eERpYWxvZyB7XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBkaWFsb2c6IE1hdERpYWxvZykge31cblxuICBvcmlnaW5hbE9wZW4oXG4gICAgY29tcG9uZW50T3JUZW1wbGF0ZVJlZjogQ29tcG9uZW50VHlwZTxhbnk+IHwgVGVtcGxhdGVSZWY8YW55PiA9IE10eERpYWxvZ0NvbXBvbmVudCxcbiAgICBjb25maWc6IGFueVxuICApIHtcbiAgICByZXR1cm4gdGhpcy5kaWFsb2cub3Blbihjb21wb25lbnRPclRlbXBsYXRlUmVmLCBjb25maWcpO1xuICB9XG5cbiAgb3BlbihcbiAgICBjb25maWc6IE10eERpYWxvZ0RhdGEsXG4gICAgY29tcG9uZW50T3JUZW1wbGF0ZVJlZjogQ29tcG9uZW50VHlwZTxhbnk+IHwgVGVtcGxhdGVSZWY8YW55PiA9IE10eERpYWxvZ0NvbXBvbmVudFxuICApIHtcbiAgICBjb25zdCBkYXRhID0gT2JqZWN0LmFzc2lnbih7fSwgZGVmYXVsdHMsIGNvbmZpZyk7XG4gICAgcmV0dXJuIHRoaXMuZGlhbG9nLm9wZW4oY29tcG9uZW50T3JUZW1wbGF0ZVJlZiwge1xuICAgICAgLi4uZGF0YSxcbiAgICAgIGRhdGEsXG4gICAgfSk7XG4gIH1cblxuICBhbGVydChcbiAgICB0aXRsZTogc3RyaW5nIHwgT2JzZXJ2YWJsZTxzdHJpbmc+LFxuICAgIGRlc2NyaXB0aW9uOiBzdHJpbmcgfCBPYnNlcnZhYmxlPHN0cmluZz4gPSAnJyxcbiAgICBvbk9rID0gKCkgPT4ge31cbiAgKSB7XG4gICAgdGhpcy5vcGVuKHtcbiAgICAgIHRpdGxlLFxuICAgICAgZGVzY3JpcHRpb24sXG4gICAgICBidXR0b25zOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBjb2xvcjogJ3dhcm4nLFxuICAgICAgICAgIHRleHQ6ICdPSycsXG4gICAgICAgICAgb25DbGljazogKCkgPT4gb25PaygpLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9KTtcbiAgfVxuXG4gIGNvbmZpcm0oXG4gICAgdGl0bGU6IHN0cmluZyB8IE9ic2VydmFibGU8c3RyaW5nPixcbiAgICBkZXNjcmlwdGlvbjogc3RyaW5nIHwgT2JzZXJ2YWJsZTxzdHJpbmc+ID0gJycsXG4gICAgb25PayA9ICgpID0+IHt9LFxuICAgIG9uQ2xvc2UgPSAoKSA9PiB7fVxuICApIHtcbiAgICB0aGlzLm9wZW4oe1xuICAgICAgdGl0bGUsXG4gICAgICBkZXNjcmlwdGlvbixcbiAgICAgIGJ1dHRvbnM6IFtcbiAgICAgICAge1xuICAgICAgICAgIGNvbG9yOiAnd2FybicsXG4gICAgICAgICAgdGV4dDogJ09LJyxcbiAgICAgICAgICBvbkNsaWNrOiAoKSA9PiBvbk9rKCksXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICB0ZXh0OiAnQ0xPU0UnLFxuICAgICAgICAgIG9uQ2xpY2s6ICgpID0+IG9uQ2xvc2UoKSxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSk7XG4gIH1cbn1cbiJdfQ==