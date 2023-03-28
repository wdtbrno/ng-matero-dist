import { animate, keyframes, state, style, transition, trigger, } from '@angular/animations';
/**
 * Animations used by the Material datepicker.
 * @docs-private
 */
export const mtxDatetimepickerAnimations = {
    /** Transforms the height of the datepicker's calendar. */
    transformPanel: trigger('transformPanel', [
        transition('void => enter-dropdown', animate('120ms cubic-bezier(0, 0, 0.2, 1)', keyframes([
            style({ opacity: 0, transform: 'scale(1, 0.8)' }),
            style({ opacity: 1, transform: 'scale(1, 1)' }),
        ]))),
        transition('void => enter-dialog', animate('150ms cubic-bezier(0, 0, 0.2, 1)', keyframes([
            style({ opacity: 0, transform: 'scale(0.7)' }),
            style({ transform: 'none', opacity: 1 }),
        ]))),
        transition('* => void', animate('100ms linear', style({ opacity: 0 }))),
    ]),
    /** Fades in the content of the calendar. */
    fadeInCalendar: trigger('fadeInCalendar', [
        state('void', style({ opacity: 0 })),
        state('enter', style({ opacity: 1 })),
        // TODO(crisbeto): this animation should be removed since it isn't quite on spec, but we
        // need to keep it until #12440 gets in, otherwise the exit animation will look glitchy.
        transition('void => *', animate('120ms 100ms cubic-bezier(0.55, 0, 0.55, 0.2)')),
    ]),
    slideCalendar: trigger('slideCalendar', [
        transition('* => left', [
            animate(180, keyframes([
                style({ transform: 'translateX(100%)', offset: 0.5 }),
                style({ transform: 'translateX(-100%)', offset: 0.51 }),
                style({ transform: 'translateX(0)', offset: 1 }),
            ])),
        ]),
        transition('* => right', [
            animate(180, keyframes([
                style({ transform: 'translateX(-100%)', offset: 0.5 }),
                style({ transform: 'translateX(100%)', offset: 0.51 }),
                style({ transform: 'translateX(0)', offset: 1 }),
            ])),
        ]),
    ]),
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZXRpbWVwaWNrZXItYW5pbWF0aW9ucy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL2V4dGVuc2lvbnMvZGF0ZXRpbWVwaWNrZXIvZGF0ZXRpbWVwaWNrZXItYW5pbWF0aW9ucy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQ0wsT0FBTyxFQUVQLFNBQVMsRUFDVCxLQUFLLEVBQ0wsS0FBSyxFQUNMLFVBQVUsRUFDVixPQUFPLEdBQ1IsTUFBTSxxQkFBcUIsQ0FBQztBQUU3Qjs7O0dBR0c7QUFDSCxNQUFNLENBQUMsTUFBTSwyQkFBMkIsR0FJcEM7SUFDRiwwREFBMEQ7SUFDMUQsY0FBYyxFQUFFLE9BQU8sQ0FBQyxnQkFBZ0IsRUFBRTtRQUN4QyxVQUFVLENBQ1Isd0JBQXdCLEVBQ3hCLE9BQU8sQ0FDTCxrQ0FBa0MsRUFDbEMsU0FBUyxDQUFDO1lBQ1IsS0FBSyxDQUFDLEVBQUUsT0FBTyxFQUFFLENBQUMsRUFBRSxTQUFTLEVBQUUsZUFBZSxFQUFFLENBQUM7WUFDakQsS0FBSyxDQUFDLEVBQUUsT0FBTyxFQUFFLENBQUMsRUFBRSxTQUFTLEVBQUUsYUFBYSxFQUFFLENBQUM7U0FDaEQsQ0FBQyxDQUNILENBQ0Y7UUFDRCxVQUFVLENBQ1Isc0JBQXNCLEVBQ3RCLE9BQU8sQ0FDTCxrQ0FBa0MsRUFDbEMsU0FBUyxDQUFDO1lBQ1IsS0FBSyxDQUFDLEVBQUUsT0FBTyxFQUFFLENBQUMsRUFBRSxTQUFTLEVBQUUsWUFBWSxFQUFFLENBQUM7WUFDOUMsS0FBSyxDQUFDLEVBQUUsU0FBUyxFQUFFLE1BQU0sRUFBRSxPQUFPLEVBQUUsQ0FBQyxFQUFFLENBQUM7U0FDekMsQ0FBQyxDQUNILENBQ0Y7UUFDRCxVQUFVLENBQUMsV0FBVyxFQUFFLE9BQU8sQ0FBQyxjQUFjLEVBQUUsS0FBSyxDQUFDLEVBQUUsT0FBTyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztLQUN4RSxDQUFDO0lBRUYsNENBQTRDO0lBQzVDLGNBQWMsRUFBRSxPQUFPLENBQUMsZ0JBQWdCLEVBQUU7UUFDeEMsS0FBSyxDQUFDLE1BQU0sRUFBRSxLQUFLLENBQUMsRUFBRSxPQUFPLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUNwQyxLQUFLLENBQUMsT0FBTyxFQUFFLEtBQUssQ0FBQyxFQUFFLE9BQU8sRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBRXJDLHdGQUF3RjtRQUN4Rix3RkFBd0Y7UUFDeEYsVUFBVSxDQUFDLFdBQVcsRUFBRSxPQUFPLENBQUMsOENBQThDLENBQUMsQ0FBQztLQUNqRixDQUFDO0lBRUYsYUFBYSxFQUFFLE9BQU8sQ0FBQyxlQUFlLEVBQUU7UUFDdEMsVUFBVSxDQUFDLFdBQVcsRUFBRTtZQUN0QixPQUFPLENBQ0wsR0FBRyxFQUNILFNBQVMsQ0FBQztnQkFDUixLQUFLLENBQUMsRUFBRSxTQUFTLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSxFQUFFLEdBQUcsRUFBRSxDQUFDO2dCQUNyRCxLQUFLLENBQUMsRUFBRSxTQUFTLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxDQUFDO2dCQUN2RCxLQUFLLENBQUMsRUFBRSxTQUFTLEVBQUUsZUFBZSxFQUFFLE1BQU0sRUFBRSxDQUFDLEVBQUUsQ0FBQzthQUNqRCxDQUFDLENBQ0g7U0FDRixDQUFDO1FBQ0YsVUFBVSxDQUFDLFlBQVksRUFBRTtZQUN2QixPQUFPLENBQ0wsR0FBRyxFQUNILFNBQVMsQ0FBQztnQkFDUixLQUFLLENBQUMsRUFBRSxTQUFTLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSxFQUFFLEdBQUcsRUFBRSxDQUFDO2dCQUN0RCxLQUFLLENBQUMsRUFBRSxTQUFTLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxDQUFDO2dCQUN0RCxLQUFLLENBQUMsRUFBRSxTQUFTLEVBQUUsZUFBZSxFQUFFLE1BQU0sRUFBRSxDQUFDLEVBQUUsQ0FBQzthQUNqRCxDQUFDLENBQ0g7U0FDRixDQUFDO0tBQ0gsQ0FBQztDQUNILENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBhbmltYXRlLFxuICBBbmltYXRpb25UcmlnZ2VyTWV0YWRhdGEsXG4gIGtleWZyYW1lcyxcbiAgc3RhdGUsXG4gIHN0eWxlLFxuICB0cmFuc2l0aW9uLFxuICB0cmlnZ2VyLFxufSBmcm9tICdAYW5ndWxhci9hbmltYXRpb25zJztcblxuLyoqXG4gKiBBbmltYXRpb25zIHVzZWQgYnkgdGhlIE1hdGVyaWFsIGRhdGVwaWNrZXIuXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbmV4cG9ydCBjb25zdCBtdHhEYXRldGltZXBpY2tlckFuaW1hdGlvbnM6IHtcbiAgcmVhZG9ubHkgdHJhbnNmb3JtUGFuZWw6IEFuaW1hdGlvblRyaWdnZXJNZXRhZGF0YTtcbiAgcmVhZG9ubHkgZmFkZUluQ2FsZW5kYXI6IEFuaW1hdGlvblRyaWdnZXJNZXRhZGF0YTtcbiAgcmVhZG9ubHkgc2xpZGVDYWxlbmRhcjogQW5pbWF0aW9uVHJpZ2dlck1ldGFkYXRhO1xufSA9IHtcbiAgLyoqIFRyYW5zZm9ybXMgdGhlIGhlaWdodCBvZiB0aGUgZGF0ZXBpY2tlcidzIGNhbGVuZGFyLiAqL1xuICB0cmFuc2Zvcm1QYW5lbDogdHJpZ2dlcigndHJhbnNmb3JtUGFuZWwnLCBbXG4gICAgdHJhbnNpdGlvbihcbiAgICAgICd2b2lkID0+IGVudGVyLWRyb3Bkb3duJyxcbiAgICAgIGFuaW1hdGUoXG4gICAgICAgICcxMjBtcyBjdWJpYy1iZXppZXIoMCwgMCwgMC4yLCAxKScsXG4gICAgICAgIGtleWZyYW1lcyhbXG4gICAgICAgICAgc3R5bGUoeyBvcGFjaXR5OiAwLCB0cmFuc2Zvcm06ICdzY2FsZSgxLCAwLjgpJyB9KSxcbiAgICAgICAgICBzdHlsZSh7IG9wYWNpdHk6IDEsIHRyYW5zZm9ybTogJ3NjYWxlKDEsIDEpJyB9KSxcbiAgICAgICAgXSlcbiAgICAgIClcbiAgICApLFxuICAgIHRyYW5zaXRpb24oXG4gICAgICAndm9pZCA9PiBlbnRlci1kaWFsb2cnLFxuICAgICAgYW5pbWF0ZShcbiAgICAgICAgJzE1MG1zIGN1YmljLWJlemllcigwLCAwLCAwLjIsIDEpJyxcbiAgICAgICAga2V5ZnJhbWVzKFtcbiAgICAgICAgICBzdHlsZSh7IG9wYWNpdHk6IDAsIHRyYW5zZm9ybTogJ3NjYWxlKDAuNyknIH0pLFxuICAgICAgICAgIHN0eWxlKHsgdHJhbnNmb3JtOiAnbm9uZScsIG9wYWNpdHk6IDEgfSksXG4gICAgICAgIF0pXG4gICAgICApXG4gICAgKSxcbiAgICB0cmFuc2l0aW9uKCcqID0+IHZvaWQnLCBhbmltYXRlKCcxMDBtcyBsaW5lYXInLCBzdHlsZSh7IG9wYWNpdHk6IDAgfSkpKSxcbiAgXSksXG5cbiAgLyoqIEZhZGVzIGluIHRoZSBjb250ZW50IG9mIHRoZSBjYWxlbmRhci4gKi9cbiAgZmFkZUluQ2FsZW5kYXI6IHRyaWdnZXIoJ2ZhZGVJbkNhbGVuZGFyJywgW1xuICAgIHN0YXRlKCd2b2lkJywgc3R5bGUoeyBvcGFjaXR5OiAwIH0pKSxcbiAgICBzdGF0ZSgnZW50ZXInLCBzdHlsZSh7IG9wYWNpdHk6IDEgfSkpLFxuXG4gICAgLy8gVE9ETyhjcmlzYmV0byk6IHRoaXMgYW5pbWF0aW9uIHNob3VsZCBiZSByZW1vdmVkIHNpbmNlIGl0IGlzbid0IHF1aXRlIG9uIHNwZWMsIGJ1dCB3ZVxuICAgIC8vIG5lZWQgdG8ga2VlcCBpdCB1bnRpbCAjMTI0NDAgZ2V0cyBpbiwgb3RoZXJ3aXNlIHRoZSBleGl0IGFuaW1hdGlvbiB3aWxsIGxvb2sgZ2xpdGNoeS5cbiAgICB0cmFuc2l0aW9uKCd2b2lkID0+IConLCBhbmltYXRlKCcxMjBtcyAxMDBtcyBjdWJpYy1iZXppZXIoMC41NSwgMCwgMC41NSwgMC4yKScpKSxcbiAgXSksXG5cbiAgc2xpZGVDYWxlbmRhcjogdHJpZ2dlcignc2xpZGVDYWxlbmRhcicsIFtcbiAgICB0cmFuc2l0aW9uKCcqID0+IGxlZnQnLCBbXG4gICAgICBhbmltYXRlKFxuICAgICAgICAxODAsXG4gICAgICAgIGtleWZyYW1lcyhbXG4gICAgICAgICAgc3R5bGUoeyB0cmFuc2Zvcm06ICd0cmFuc2xhdGVYKDEwMCUpJywgb2Zmc2V0OiAwLjUgfSksXG4gICAgICAgICAgc3R5bGUoeyB0cmFuc2Zvcm06ICd0cmFuc2xhdGVYKC0xMDAlKScsIG9mZnNldDogMC41MSB9KSxcbiAgICAgICAgICBzdHlsZSh7IHRyYW5zZm9ybTogJ3RyYW5zbGF0ZVgoMCknLCBvZmZzZXQ6IDEgfSksXG4gICAgICAgIF0pXG4gICAgICApLFxuICAgIF0pLFxuICAgIHRyYW5zaXRpb24oJyogPT4gcmlnaHQnLCBbXG4gICAgICBhbmltYXRlKFxuICAgICAgICAxODAsXG4gICAgICAgIGtleWZyYW1lcyhbXG4gICAgICAgICAgc3R5bGUoeyB0cmFuc2Zvcm06ICd0cmFuc2xhdGVYKC0xMDAlKScsIG9mZnNldDogMC41IH0pLFxuICAgICAgICAgIHN0eWxlKHsgdHJhbnNmb3JtOiAndHJhbnNsYXRlWCgxMDAlKScsIG9mZnNldDogMC41MSB9KSxcbiAgICAgICAgICBzdHlsZSh7IHRyYW5zZm9ybTogJ3RyYW5zbGF0ZVgoMCknLCBvZmZzZXQ6IDEgfSksXG4gICAgICAgIF0pXG4gICAgICApLFxuICAgIF0pLFxuICBdKSxcbn07XG4iXX0=