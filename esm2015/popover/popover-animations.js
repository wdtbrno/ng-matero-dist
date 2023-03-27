import { trigger, state, style, animate, transition, } from '@angular/animations';
/**
 * Below are all the animations for the md-popover component.
 * Animation duration and timing values are based on AngularJS Material.
 */
/**
 * This animation controls the popover panel's entry and exit from the page.
 *
 * When the popover panel is added to the DOM, it scales in and fades in its border.
 *
 * When the popover panel is removed from the DOM, it simply fades out after a brief
 * delay to display the ripple.
 */
export const transformPopover = trigger('transformPopover', [
    state('enter', style({
        opacity: 1,
        transform: `scale(1)`,
    })),
    transition('void => *', [
        style({
            opacity: 0,
            transform: `scale(0)`,
        }),
        animate(`200ms cubic-bezier(0.25, 0.8, 0.25, 1)`),
    ]),
    transition('* => void', [animate('50ms 100ms linear', style({ opacity: 0 }))]),
]);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9wb3Zlci1hbmltYXRpb25zLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vcHJvamVjdHMvZXh0ZW5zaW9ucy9wb3BvdmVyL3BvcG92ZXItYW5pbWF0aW9ucy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQ0wsT0FBTyxFQUNQLEtBQUssRUFDTCxLQUFLLEVBQ0wsT0FBTyxFQUNQLFVBQVUsR0FFWCxNQUFNLHFCQUFxQixDQUFDO0FBRTdCOzs7R0FHRztBQUVIOzs7Ozs7O0dBT0c7QUFFSCxNQUFNLENBQUMsTUFBTSxnQkFBZ0IsR0FBNkIsT0FBTyxDQUFDLGtCQUFrQixFQUFFO0lBQ3BGLEtBQUssQ0FDSCxPQUFPLEVBQ1AsS0FBSyxDQUFDO1FBQ0osT0FBTyxFQUFFLENBQUM7UUFDVixTQUFTLEVBQUUsVUFBVTtLQUN0QixDQUFDLENBQ0g7SUFDRCxVQUFVLENBQUMsV0FBVyxFQUFFO1FBQ3RCLEtBQUssQ0FBQztZQUNKLE9BQU8sRUFBRSxDQUFDO1lBQ1YsU0FBUyxFQUFFLFVBQVU7U0FDdEIsQ0FBQztRQUNGLE9BQU8sQ0FBQyx3Q0FBd0MsQ0FBQztLQUNsRCxDQUFDO0lBQ0YsVUFBVSxDQUFDLFdBQVcsRUFBRSxDQUFDLE9BQU8sQ0FBQyxtQkFBbUIsRUFBRSxLQUFLLENBQUMsRUFBRSxPQUFPLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7Q0FDL0UsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcclxuICB0cmlnZ2VyLFxyXG4gIHN0YXRlLFxyXG4gIHN0eWxlLFxyXG4gIGFuaW1hdGUsXHJcbiAgdHJhbnNpdGlvbixcclxuICBBbmltYXRpb25UcmlnZ2VyTWV0YWRhdGEsXHJcbn0gZnJvbSAnQGFuZ3VsYXIvYW5pbWF0aW9ucyc7XHJcblxyXG4vKipcclxuICogQmVsb3cgYXJlIGFsbCB0aGUgYW5pbWF0aW9ucyBmb3IgdGhlIG1kLXBvcG92ZXIgY29tcG9uZW50LlxyXG4gKiBBbmltYXRpb24gZHVyYXRpb24gYW5kIHRpbWluZyB2YWx1ZXMgYXJlIGJhc2VkIG9uIEFuZ3VsYXJKUyBNYXRlcmlhbC5cclxuICovXHJcblxyXG4vKipcclxuICogVGhpcyBhbmltYXRpb24gY29udHJvbHMgdGhlIHBvcG92ZXIgcGFuZWwncyBlbnRyeSBhbmQgZXhpdCBmcm9tIHRoZSBwYWdlLlxyXG4gKlxyXG4gKiBXaGVuIHRoZSBwb3BvdmVyIHBhbmVsIGlzIGFkZGVkIHRvIHRoZSBET00sIGl0IHNjYWxlcyBpbiBhbmQgZmFkZXMgaW4gaXRzIGJvcmRlci5cclxuICpcclxuICogV2hlbiB0aGUgcG9wb3ZlciBwYW5lbCBpcyByZW1vdmVkIGZyb20gdGhlIERPTSwgaXQgc2ltcGx5IGZhZGVzIG91dCBhZnRlciBhIGJyaWVmXHJcbiAqIGRlbGF5IHRvIGRpc3BsYXkgdGhlIHJpcHBsZS5cclxuICovXHJcblxyXG5leHBvcnQgY29uc3QgdHJhbnNmb3JtUG9wb3ZlcjogQW5pbWF0aW9uVHJpZ2dlck1ldGFkYXRhID0gdHJpZ2dlcigndHJhbnNmb3JtUG9wb3ZlcicsIFtcclxuICBzdGF0ZShcclxuICAgICdlbnRlcicsXHJcbiAgICBzdHlsZSh7XHJcbiAgICAgIG9wYWNpdHk6IDEsXHJcbiAgICAgIHRyYW5zZm9ybTogYHNjYWxlKDEpYCxcclxuICAgIH0pXHJcbiAgKSxcclxuICB0cmFuc2l0aW9uKCd2b2lkID0+IConLCBbXHJcbiAgICBzdHlsZSh7XHJcbiAgICAgIG9wYWNpdHk6IDAsXHJcbiAgICAgIHRyYW5zZm9ybTogYHNjYWxlKDApYCxcclxuICAgIH0pLFxyXG4gICAgYW5pbWF0ZShgMjAwbXMgY3ViaWMtYmV6aWVyKDAuMjUsIDAuOCwgMC4yNSwgMSlgKSxcclxuICBdKSxcclxuICB0cmFuc2l0aW9uKCcqID0+IHZvaWQnLCBbYW5pbWF0ZSgnNTBtcyAxMDBtcyBsaW5lYXInLCBzdHlsZSh7IG9wYWNpdHk6IDAgfSkpXSksXHJcbl0pO1xyXG4iXX0=