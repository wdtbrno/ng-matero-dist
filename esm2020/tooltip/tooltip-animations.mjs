import { animate, keyframes, state, style, transition, trigger, } from '@angular/animations';
/**
 * Animations used by MtxTooltip.
 * @docs-private
 */
export const mtxTooltipAnimations = {
    /** Animation that transitions a tooltip in and out. */
    tooltipState: trigger('state', [
        state('initial, void, hidden', style({ opacity: 0, transform: 'scale(0)' })),
        state('visible', style({ transform: 'scale(1)' })),
        transition('* => visible', animate('200ms cubic-bezier(0, 0, 0.2, 1)', keyframes([
            style({ opacity: 0, transform: 'scale(0)', offset: 0 }),
            style({ opacity: 0.5, transform: 'scale(0.99)', offset: 0.5 }),
            style({ opacity: 1, transform: 'scale(1)', offset: 1 }),
        ]))),
        transition('* => hidden', animate('100ms cubic-bezier(0, 0, 0.2, 1)', style({ opacity: 0 }))),
    ]),
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9vbHRpcC1hbmltYXRpb25zLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vcHJvamVjdHMvZXh0ZW5zaW9ucy90b29sdGlwL3Rvb2x0aXAtYW5pbWF0aW9ucy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQ0wsT0FBTyxFQUVQLFNBQVMsRUFDVCxLQUFLLEVBQ0wsS0FBSyxFQUNMLFVBQVUsRUFDVixPQUFPLEdBQ1IsTUFBTSxxQkFBcUIsQ0FBQztBQUU3Qjs7O0dBR0c7QUFDSCxNQUFNLENBQUMsTUFBTSxvQkFBb0IsR0FFN0I7SUFDRix1REFBdUQ7SUFDdkQsWUFBWSxFQUFFLE9BQU8sQ0FBQyxPQUFPLEVBQUU7UUFDN0IsS0FBSyxDQUFDLHVCQUF1QixFQUFFLEtBQUssQ0FBQyxFQUFFLE9BQU8sRUFBRSxDQUFDLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUM7UUFDNUUsS0FBSyxDQUFDLFNBQVMsRUFBRSxLQUFLLENBQUMsRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFFLENBQUMsQ0FBQztRQUNsRCxVQUFVLENBQ1IsY0FBYyxFQUNkLE9BQU8sQ0FDTCxrQ0FBa0MsRUFDbEMsU0FBUyxDQUFDO1lBQ1IsS0FBSyxDQUFDLEVBQUUsT0FBTyxFQUFFLENBQUMsRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRSxDQUFDLEVBQUUsQ0FBQztZQUN2RCxLQUFLLENBQUMsRUFBRSxPQUFPLEVBQUUsR0FBRyxFQUFFLFNBQVMsRUFBRSxhQUFhLEVBQUUsTUFBTSxFQUFFLEdBQUcsRUFBRSxDQUFDO1lBQzlELEtBQUssQ0FBQyxFQUFFLE9BQU8sRUFBRSxDQUFDLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFFLENBQUM7U0FDeEQsQ0FBQyxDQUNILENBQ0Y7UUFDRCxVQUFVLENBQUMsYUFBYSxFQUFFLE9BQU8sQ0FBQyxrQ0FBa0MsRUFBRSxLQUFLLENBQUMsRUFBRSxPQUFPLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0tBQzlGLENBQUM7Q0FDSCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgYW5pbWF0ZSxcbiAgQW5pbWF0aW9uVHJpZ2dlck1ldGFkYXRhLFxuICBrZXlmcmFtZXMsXG4gIHN0YXRlLFxuICBzdHlsZSxcbiAgdHJhbnNpdGlvbixcbiAgdHJpZ2dlcixcbn0gZnJvbSAnQGFuZ3VsYXIvYW5pbWF0aW9ucyc7XG5cbi8qKlxuICogQW5pbWF0aW9ucyB1c2VkIGJ5IE10eFRvb2x0aXAuXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbmV4cG9ydCBjb25zdCBtdHhUb29sdGlwQW5pbWF0aW9uczoge1xuICByZWFkb25seSB0b29sdGlwU3RhdGU6IEFuaW1hdGlvblRyaWdnZXJNZXRhZGF0YTtcbn0gPSB7XG4gIC8qKiBBbmltYXRpb24gdGhhdCB0cmFuc2l0aW9ucyBhIHRvb2x0aXAgaW4gYW5kIG91dC4gKi9cbiAgdG9vbHRpcFN0YXRlOiB0cmlnZ2VyKCdzdGF0ZScsIFtcbiAgICBzdGF0ZSgnaW5pdGlhbCwgdm9pZCwgaGlkZGVuJywgc3R5bGUoeyBvcGFjaXR5OiAwLCB0cmFuc2Zvcm06ICdzY2FsZSgwKScgfSkpLFxuICAgIHN0YXRlKCd2aXNpYmxlJywgc3R5bGUoeyB0cmFuc2Zvcm06ICdzY2FsZSgxKScgfSkpLFxuICAgIHRyYW5zaXRpb24oXG4gICAgICAnKiA9PiB2aXNpYmxlJyxcbiAgICAgIGFuaW1hdGUoXG4gICAgICAgICcyMDBtcyBjdWJpYy1iZXppZXIoMCwgMCwgMC4yLCAxKScsXG4gICAgICAgIGtleWZyYW1lcyhbXG4gICAgICAgICAgc3R5bGUoeyBvcGFjaXR5OiAwLCB0cmFuc2Zvcm06ICdzY2FsZSgwKScsIG9mZnNldDogMCB9KSxcbiAgICAgICAgICBzdHlsZSh7IG9wYWNpdHk6IDAuNSwgdHJhbnNmb3JtOiAnc2NhbGUoMC45OSknLCBvZmZzZXQ6IDAuNSB9KSxcbiAgICAgICAgICBzdHlsZSh7IG9wYWNpdHk6IDEsIHRyYW5zZm9ybTogJ3NjYWxlKDEpJywgb2Zmc2V0OiAxIH0pLFxuICAgICAgICBdKVxuICAgICAgKVxuICAgICksXG4gICAgdHJhbnNpdGlvbignKiA9PiBoaWRkZW4nLCBhbmltYXRlKCcxMDBtcyBjdWJpYy1iZXppZXIoMCwgMCwgMC4yLCAxKScsIHN0eWxlKHsgb3BhY2l0eTogMCB9KSkpLFxuICBdKSxcbn07XG4iXX0=