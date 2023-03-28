import { animate, state, style, transition, trigger, } from '@angular/animations';
/** Animations used by the drawer. */
export const mtxDrawerAnimations = {
    /** Animation that shows and hides a drawer. */
    drawerState: trigger('state', [
        state('void, hidden', style({
            'box-shadow': 'none',
            'visibility': 'hidden',
        })),
        state('visible', style({
            transform: 'none',
            visibility: 'visible',
        })),
        transition('visible => void, visible => hidden', animate('400ms cubic-bezier(0.25, 0.8, 0.25, 1)')),
        transition('void => visible', animate('150ms cubic-bezier(0, 0, 0.2, 1)')),
    ]),
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHJhd2VyLWFuaW1hdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL2V4dGVuc2lvbnMvZHJhd2VyL2RyYXdlci1hbmltYXRpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUNMLE9BQU8sRUFDUCxLQUFLLEVBQ0wsS0FBSyxFQUNMLFVBQVUsRUFDVixPQUFPLEdBRVIsTUFBTSxxQkFBcUIsQ0FBQztBQUU3QixxQ0FBcUM7QUFDckMsTUFBTSxDQUFDLE1BQU0sbUJBQW1CLEdBRTVCO0lBQ0YsK0NBQStDO0lBQy9DLFdBQVcsRUFBRSxPQUFPLENBQUMsT0FBTyxFQUFFO1FBQzVCLEtBQUssQ0FDSCxjQUFjLEVBQ2QsS0FBSyxDQUFDO1lBQ0osWUFBWSxFQUFFLE1BQU07WUFDcEIsWUFBWSxFQUFFLFFBQVE7U0FDdkIsQ0FBQyxDQUNIO1FBQ0QsS0FBSyxDQUNILFNBQVMsRUFDVCxLQUFLLENBQUM7WUFDSixTQUFTLEVBQUUsTUFBTTtZQUNqQixVQUFVLEVBQUUsU0FBUztTQUN0QixDQUFDLENBQ0g7UUFDRCxVQUFVLENBQ1Isb0NBQW9DLEVBQ3BDLE9BQU8sQ0FBQyx3Q0FBd0MsQ0FBQyxDQUNsRDtRQUNELFVBQVUsQ0FBQyxpQkFBaUIsRUFBRSxPQUFPLENBQUMsa0NBQWtDLENBQUMsQ0FBQztLQUMzRSxDQUFDO0NBQ0gsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIGFuaW1hdGUsXG4gIHN0YXRlLFxuICBzdHlsZSxcbiAgdHJhbnNpdGlvbixcbiAgdHJpZ2dlcixcbiAgQW5pbWF0aW9uVHJpZ2dlck1ldGFkYXRhLFxufSBmcm9tICdAYW5ndWxhci9hbmltYXRpb25zJztcblxuLyoqIEFuaW1hdGlvbnMgdXNlZCBieSB0aGUgZHJhd2VyLiAqL1xuZXhwb3J0IGNvbnN0IG10eERyYXdlckFuaW1hdGlvbnM6IHtcbiAgcmVhZG9ubHkgZHJhd2VyU3RhdGU6IEFuaW1hdGlvblRyaWdnZXJNZXRhZGF0YTtcbn0gPSB7XG4gIC8qKiBBbmltYXRpb24gdGhhdCBzaG93cyBhbmQgaGlkZXMgYSBkcmF3ZXIuICovXG4gIGRyYXdlclN0YXRlOiB0cmlnZ2VyKCdzdGF0ZScsIFtcbiAgICBzdGF0ZShcbiAgICAgICd2b2lkLCBoaWRkZW4nLFxuICAgICAgc3R5bGUoe1xuICAgICAgICAnYm94LXNoYWRvdyc6ICdub25lJyxcbiAgICAgICAgJ3Zpc2liaWxpdHknOiAnaGlkZGVuJyxcbiAgICAgIH0pXG4gICAgKSxcbiAgICBzdGF0ZShcbiAgICAgICd2aXNpYmxlJyxcbiAgICAgIHN0eWxlKHtcbiAgICAgICAgdHJhbnNmb3JtOiAnbm9uZScsXG4gICAgICAgIHZpc2liaWxpdHk6ICd2aXNpYmxlJyxcbiAgICAgIH0pXG4gICAgKSxcbiAgICB0cmFuc2l0aW9uKFxuICAgICAgJ3Zpc2libGUgPT4gdm9pZCwgdmlzaWJsZSA9PiBoaWRkZW4nLFxuICAgICAgYW5pbWF0ZSgnNDAwbXMgY3ViaWMtYmV6aWVyKDAuMjUsIDAuOCwgMC4yNSwgMSknKVxuICAgICksXG4gICAgdHJhbnNpdGlvbigndm9pZCA9PiB2aXNpYmxlJywgYW5pbWF0ZSgnMTUwbXMgY3ViaWMtYmV6aWVyKDAsIDAsIDAuMiwgMSknKSksXG4gIF0pLFxufTtcbiJdfQ==