export function getPointFromEvent(event) {
    // TouchEvent
    if (event.changedTouches !== undefined &&
        event.changedTouches.length > 0) {
        return {
            x: event.changedTouches[0].clientX,
            y: event.changedTouches[0].clientY,
        };
    }
    // MouseEvent
    // tslint:disable-next-line: one-line
    else if (event.clientX !== undefined &&
        event.clientY !== undefined) {
        return {
            x: event.clientX,
            y: event.clientY,
        };
    }
    return null;
}
export function getElementPixelSize(elRef, direction) {
    const rect = elRef.nativeElement.getBoundingClientRect();
    return direction === 'horizontal' ? rect.width : rect.height;
}
export function getInputBoolean(v) {
    return typeof v === 'boolean' ? v : v === 'false' ? false : true;
}
export function getInputPositiveNumber(v, defaultValue) {
    if (v === null || v === undefined) {
        return defaultValue;
    }
    v = Number(v);
    return !isNaN(v) && v >= 0 ? v : defaultValue;
}
export function isUserSizesValid(unit, sizes) {
    // All sizes have to be not null and total should be 100
    if (unit === 'percent') {
        const total = sizes.reduce((_total, s) => (s !== null ? _total + s : _total), 0);
        return sizes.every(s => s !== null) && total && total > 99.9 && total < 100.1;
    }
    // A size at null is mandatory but only one.
    if (unit === 'pixel') {
        return sizes.filter(s => s === null).length === 1;
    }
}
export function getAreaMinSize(a) {
    if (a.size === null) {
        return null;
    }
    if (a.component.lockSize === true) {
        return a.size;
    }
    if (a.component.minSize === null) {
        return null;
    }
    if (a.component.minSize > a.size) {
        return a.size;
    }
    return a.component.minSize;
}
export function getAreaMaxSize(a) {
    if (a.size === null) {
        return null;
    }
    if (a.component.lockSize === true) {
        return a.size;
    }
    if (a.component.maxSize === null) {
        return null;
    }
    if (a.component.maxSize < a.size) {
        return a.size;
    }
    return a.component.maxSize;
}
export function getGutterSideAbsorptionCapacity(unit, sideAreas, pixels, allAreasSizePixel) {
    return sideAreas.reduce((acc, area) => {
        const res = getAreaAbsorptionCapacity(unit, area, acc.remain, allAreasSizePixel);
        acc.list.push(res);
        acc.remain = res && res.pixelRemain;
        return acc;
    }, { remain: pixels, list: [] });
}
function getAreaAbsorptionCapacity(unit, areaSnapshot, pixels, allAreasSizePixel) {
    // No pain no gain
    if (pixels === 0) {
        return {
            areaSnapshot,
            pixelAbsorb: 0,
            percentAfterAbsorption: areaSnapshot.sizePercentAtStart,
            pixelRemain: 0,
        };
    }
    // Area start at zero and need to be reduced, not possible
    if (areaSnapshot.sizePixelAtStart === 0 && pixels < 0) {
        return {
            areaSnapshot,
            pixelAbsorb: 0,
            percentAfterAbsorption: 0,
            pixelRemain: pixels,
        };
    }
    if (unit === 'percent') {
        return getAreaAbsorptionCapacityPercent(areaSnapshot, pixels, allAreasSizePixel);
    }
    if (unit === 'pixel') {
        return getAreaAbsorptionCapacityPixel(areaSnapshot, pixels, allAreasSizePixel);
    }
}
function getAreaAbsorptionCapacityPercent(areaSnapshot, pixels, allAreasSizePixel) {
    const tempPixelSize = areaSnapshot.sizePixelAtStart + pixels;
    const tempPercentSize = (tempPixelSize / allAreasSizePixel) * 100;
    // ENLARGE AREA
    if (pixels > 0) {
        // If maxSize & newSize bigger than it > absorb to max and return remaining pixels
        if (areaSnapshot.area.maxSize !== null && tempPercentSize > areaSnapshot.area.maxSize) {
            // Use area.area.maxSize as newPercentSize and return calculate pixels remaining
            const maxSizePixel = (areaSnapshot.area.maxSize / 100) * allAreasSizePixel;
            return {
                areaSnapshot,
                pixelAbsorb: maxSizePixel,
                percentAfterAbsorption: areaSnapshot.area.maxSize,
                pixelRemain: areaSnapshot.sizePixelAtStart + pixels - maxSizePixel,
            };
        }
        return {
            areaSnapshot,
            pixelAbsorb: pixels,
            percentAfterAbsorption: tempPercentSize > 100 ? 100 : tempPercentSize,
            pixelRemain: 0,
        };
    }
    // REDUCE AREA
    // tslint:disable-next-line: one-line
    else if (pixels < 0) {
        // If minSize & newSize smaller than it > absorb to min and return remaining pixels
        if (areaSnapshot.area.minSize !== null && tempPercentSize < areaSnapshot.area.minSize) {
            // Use area.area.minSize as newPercentSize and return calculate pixels remaining
            const minSizePixel = (areaSnapshot.area.minSize / 100) * allAreasSizePixel;
            return {
                areaSnapshot,
                pixelAbsorb: minSizePixel,
                percentAfterAbsorption: areaSnapshot.area.minSize,
                pixelRemain: areaSnapshot.sizePixelAtStart + pixels - minSizePixel,
            };
        }
        // If reduced under zero > return remaining pixels
        // tslint:disable-next-line: one-line
        else if (tempPercentSize < 0) {
            // Use 0 as newPercentSize and return calculate pixels remaining
            return {
                areaSnapshot,
                pixelAbsorb: -areaSnapshot.sizePixelAtStart,
                percentAfterAbsorption: 0,
                pixelRemain: pixels + areaSnapshot.sizePixelAtStart,
            };
        }
        return {
            areaSnapshot,
            pixelAbsorb: pixels,
            percentAfterAbsorption: tempPercentSize,
            pixelRemain: 0,
        };
    }
}
function getAreaAbsorptionCapacityPixel(areaSnapshot, pixels, containerSizePixel) {
    const tempPixelSize = areaSnapshot.sizePixelAtStart + pixels;
    // ENLARGE AREA
    if (pixels > 0) {
        // If maxSize & newSize bigger than it > absorb to max and return remaining pixels
        if (areaSnapshot.area.maxSize !== null && tempPixelSize > areaSnapshot.area.maxSize) {
            return {
                areaSnapshot,
                pixelAbsorb: areaSnapshot.area.maxSize - areaSnapshot.sizePixelAtStart,
                percentAfterAbsorption: -1,
                pixelRemain: tempPixelSize - areaSnapshot.area.maxSize,
            };
        }
        return {
            areaSnapshot,
            pixelAbsorb: pixels,
            percentAfterAbsorption: -1,
            pixelRemain: 0,
        };
    }
    // REDUCE AREA
    // tslint:disable-next-line: one-line
    else if (pixels < 0) {
        // If minSize & newSize smaller than it > absorb to min and return remaining pixels
        if (areaSnapshot.area.minSize !== null && tempPixelSize < areaSnapshot.area.minSize) {
            return {
                areaSnapshot,
                pixelAbsorb: areaSnapshot.area.minSize + pixels - tempPixelSize,
                percentAfterAbsorption: -1,
                pixelRemain: tempPixelSize - areaSnapshot.area.minSize,
            };
        }
        // If reduced under zero > return remaining pixels
        // tslint:disable-next-line: one-line
        else if (tempPixelSize < 0) {
            return {
                areaSnapshot,
                pixelAbsorb: -areaSnapshot.sizePixelAtStart,
                percentAfterAbsorption: -1,
                pixelRemain: pixels + areaSnapshot.sizePixelAtStart,
            };
        }
        return {
            areaSnapshot,
            pixelAbsorb: pixels,
            percentAfterAbsorption: -1,
            pixelRemain: 0,
        };
    }
}
export function updateAreaSize(unit, item) {
    if (unit === 'percent') {
        item.areaSnapshot.area.size = item.percentAfterAbsorption;
    }
    else if (unit === 'pixel') {
        // Update size except for the wildcard size area
        if (item.areaSnapshot.area.size !== null) {
            item.areaSnapshot.area.size = item.areaSnapshot.sizePixelAtStart + item.pixelAbsorb;
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wcm9qZWN0cy9leHRlbnNpb25zL3NwbGl0LXBhbmUvdXRpbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBVUEsTUFBTSxVQUFVLGlCQUFpQixDQUFDLEtBQThCO0lBQzlELGFBQWE7SUFDYixJQUNHLEtBQW9CLENBQUMsY0FBYyxLQUFLLFNBQVM7UUFDakQsS0FBb0IsQ0FBQyxjQUFjLENBQUMsTUFBTSxHQUFHLENBQUMsRUFDL0M7UUFDQSxPQUFPO1lBQ0wsQ0FBQyxFQUFHLEtBQW9CLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU87WUFDbEQsQ0FBQyxFQUFHLEtBQW9CLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU87U0FDbkQsQ0FBQztLQUNIO0lBQ0QsYUFBYTtJQUNiLHFDQUFxQztTQUNoQyxJQUNGLEtBQW9CLENBQUMsT0FBTyxLQUFLLFNBQVM7UUFDMUMsS0FBb0IsQ0FBQyxPQUFPLEtBQUssU0FBUyxFQUMzQztRQUNBLE9BQU87WUFDTCxDQUFDLEVBQUcsS0FBb0IsQ0FBQyxPQUFPO1lBQ2hDLENBQUMsRUFBRyxLQUFvQixDQUFDLE9BQU87U0FDakMsQ0FBQztLQUNIO0lBQ0QsT0FBTyxJQUFJLENBQUM7QUFDZCxDQUFDO0FBRUQsTUFBTSxVQUFVLG1CQUFtQixDQUNqQyxLQUFpQixFQUNqQixTQUFvQztJQUVwQyxNQUFNLElBQUksR0FBSSxLQUFLLENBQUMsYUFBNkIsQ0FBQyxxQkFBcUIsRUFBRSxDQUFDO0lBRTFFLE9BQU8sU0FBUyxLQUFLLFlBQVksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQztBQUMvRCxDQUFDO0FBRUQsTUFBTSxVQUFVLGVBQWUsQ0FBQyxDQUFNO0lBQ3BDLE9BQU8sT0FBTyxDQUFDLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FB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VSxjQUFjLENBQUMsSUFBeUIsRUFBRSxJQUFvQztJQUM1RixJQUFJLElBQUksS0FBSyxTQUFTLEVBQUU7UUFDdEIsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxzQkFBc0IsQ0FBQztLQUMzRDtTQUFNLElBQUksSUFBSSxLQUFLLE9BQU8sRUFBRTtRQUMzQixnREFBZ0Q7UUFDaEQsSUFBSSxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLEtBQUssSUFBSSxFQUFFO1lBQ3hDLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLGdCQUFnQixHQUFHLElBQUksQ0FBQyxXQUFXLENBQUM7U0FDckY7S0FDRjtBQUNILENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBFbGVtZW50UmVmIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcblxyXG5pbXBvcnQge1xyXG4gIE10eFNwbGl0QXJlYSxcclxuICBNdHhTcGxpdFBvaW50LFxyXG4gIE10eFNwbGl0QXJlYVNuYXBzaG90LFxyXG4gIE10eFNwbGl0U2lkZUFic29ycHRpb25DYXBhY2l0eSxcclxuICBNdHhTcGxpdEFyZWFBYnNvcnB0aW9uQ2FwYWNpdHksXHJcbn0gZnJvbSAnLi9pbnRlcmZhY2UnO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGdldFBvaW50RnJvbUV2ZW50KGV2ZW50OiBNb3VzZUV2ZW50IHwgVG91Y2hFdmVudCk6IE10eFNwbGl0UG9pbnQgfCBudWxsIHtcclxuICAvLyBUb3VjaEV2ZW50XHJcbiAgaWYgKFxyXG4gICAgKGV2ZW50IGFzIFRvdWNoRXZlbnQpLmNoYW5nZWRUb3VjaGVzICE9PSB1bmRlZmluZWQgJiZcclxuICAgIChldmVudCBhcyBUb3VjaEV2ZW50KS5jaGFuZ2VkVG91Y2hlcy5sZW5ndGggPiAwXHJcbiAgKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICB4OiAoZXZlbnQgYXMgVG91Y2hFdmVudCkuY2hhbmdlZFRvdWNoZXNbMF0uY2xpZW50WCxcclxuICAgICAgeTogKGV2ZW50IGFzIFRvdWNoRXZlbnQpLmNoYW5nZWRUb3VjaGVzWzBdLmNsaWVudFksXHJcbiAgICB9O1xyXG4gIH1cclxuICAvLyBNb3VzZUV2ZW50XHJcbiAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOiBvbmUtbGluZVxyXG4gIGVsc2UgaWYgKFxyXG4gICAgKGV2ZW50IGFzIE1vdXNlRXZlbnQpLmNsaWVudFggIT09IHVuZGVmaW5lZCAmJlxyXG4gICAgKGV2ZW50IGFzIE1vdXNlRXZlbnQpLmNsaWVudFkgIT09IHVuZGVmaW5lZFxyXG4gICkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgeDogKGV2ZW50IGFzIE1vdXNlRXZlbnQpLmNsaWVudFgsXHJcbiAgICAgIHk6IChldmVudCBhcyBNb3VzZUV2ZW50KS5jbGllbnRZLFxyXG4gICAgfTtcclxuICB9XHJcbiAgcmV0dXJuIG51bGw7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRFbGVtZW50UGl4ZWxTaXplKFxyXG4gIGVsUmVmOiBFbGVtZW50UmVmLFxyXG4gIGRpcmVjdGlvbjogJ2hvcml6b250YWwnIHwgJ3ZlcnRpY2FsJ1xyXG4pOiBudW1iZXIge1xyXG4gIGNvbnN0IHJlY3QgPSAoZWxSZWYubmF0aXZlRWxlbWVudCBhcyBIVE1MRWxlbWVudCkuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcblxyXG4gIHJldHVybiBkaXJlY3Rpb24gPT09ICdob3Jpem9udGFsJyA/IHJlY3Qud2lkdGggOiByZWN0LmhlaWdodDtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGdldElucHV0Qm9vbGVhbih2OiBhbnkpOiBib29sZWFuIHtcclxuICByZXR1cm4gdHlwZW9mIHYgPT09ICdib29sZWFuJyA/IHYgOiB2ID09PSAnZmFsc2UnID8gZmFsc2UgOiB0cnVlO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZ2V0SW5wdXRQb3NpdGl2ZU51bWJlcjxUPih2OiBhbnksIGRlZmF1bHRWYWx1ZTogVCk6IG51bWJlciB8IFQge1xyXG4gIGlmICh2ID09PSBudWxsIHx8IHYgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgcmV0dXJuIGRlZmF1bHRWYWx1ZTtcclxuICB9XHJcblxyXG4gIHYgPSBOdW1iZXIodik7XHJcbiAgcmV0dXJuICFpc05hTih2KSAmJiB2ID49IDAgPyB2IDogZGVmYXVsdFZhbHVlO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gaXNVc2VyU2l6ZXNWYWxpZChcclxuICB1bml0OiAncGVyY2VudCcgfCAncGl4ZWwnLFxyXG4gIHNpemVzOiBBcnJheTxudW1iZXI+XHJcbik6IGJvb2xlYW4gfCBudW1iZXIgfCB2b2lkIHtcclxuICAvLyBBbGwgc2l6ZXMgaGF2ZSB0byBiZSBub3QgbnVsbCBhbmQgdG90YWwgc2hvdWxkIGJlIDEwMFxyXG4gIGlmICh1bml0ID09PSAncGVyY2VudCcpIHtcclxuICAgIGNvbnN0IHRvdGFsID0gc2l6ZXMucmVkdWNlKChfdG90YWwsIHMpID0+IChzICE9PSBudWxsID8gX3RvdGFsICsgcyA6IF90b3RhbCksIDApO1xyXG4gICAgcmV0dXJuIHNpemVzLmV2ZXJ5KHMgPT4gcyAhPT0gbnVsbCkgJiYgdG90YWwgJiYgdG90YWwgPiA5OS45ICYmIHRvdGFsIDwgMTAwLjE7XHJcbiAgfVxyXG5cclxuICAvLyBBIHNpemUgYXQgbnVsbCBpcyBtYW5kYXRvcnkgYnV0IG9ubHkgb25lLlxyXG4gIGlmICh1bml0ID09PSAncGl4ZWwnKSB7XHJcbiAgICByZXR1cm4gc2l6ZXMuZmlsdGVyKHMgPT4gcyA9PT0gbnVsbCkubGVuZ3RoID09PSAxO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGdldEFyZWFNaW5TaXplKGE6IE10eFNwbGl0QXJlYSk6IG51bGwgfCBudW1iZXIge1xyXG4gIGlmIChhLnNpemUgPT09IG51bGwpIHtcclxuICAgIHJldHVybiBudWxsO1xyXG4gIH1cclxuXHJcbiAgaWYgKGEuY29tcG9uZW50LmxvY2tTaXplID09PSB0cnVlKSB7XHJcbiAgICByZXR1cm4gYS5zaXplO1xyXG4gIH1cclxuXHJcbiAgaWYgKGEuY29tcG9uZW50Lm1pblNpemUgPT09IG51bGwpIHtcclxuICAgIHJldHVybiBudWxsO1xyXG4gIH1cclxuXHJcbiAgaWYgKGEuY29tcG9uZW50Lm1pblNpemUgPiBhLnNpemUpIHtcclxuICAgIHJldHVybiBhLnNpemU7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gYS5jb21wb25lbnQubWluU2l6ZTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGdldEFyZWFNYXhTaXplKGE6IE10eFNwbGl0QXJlYSk6IG51bGwgfCBudW1iZXIge1xyXG4gIGlmIChhLnNpemUgPT09IG51bGwpIHtcclxuICAgIHJldHVybiBudWxsO1xyXG4gIH1cclxuXHJcbiAgaWYgKGEuY29tcG9uZW50LmxvY2tTaXplID09PSB0cnVlKSB7XHJcbiAgICByZXR1cm4gYS5zaXplO1xyXG4gIH1cclxuXHJcbiAgaWYgKGEuY29tcG9uZW50Lm1heFNpemUgPT09IG51bGwpIHtcclxuICAgIHJldHVybiBudWxsO1xyXG4gIH1cclxuXHJcbiAgaWYgKGEuY29tcG9uZW50Lm1heFNpemUgPCBhLnNpemUpIHtcclxuICAgIHJldHVybiBhLnNpemU7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gYS5jb21wb25lbnQubWF4U2l6ZTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGdldEd1dHRlclNpZGVBYnNvcnB0aW9uQ2FwYWNpdHkoXHJcbiAgdW5pdDogJ3BlcmNlbnQnIHwgJ3BpeGVsJyxcclxuICBzaWRlQXJlYXM6IEFycmF5PE10eFNwbGl0QXJlYVNuYXBzaG90PixcclxuICBwaXhlbHM6IG51bWJlcixcclxuICBhbGxBcmVhc1NpemVQaXhlbDogbnVtYmVyXHJcbik6IE10eFNwbGl0U2lkZUFic29ycHRpb25DYXBhY2l0eSB7XHJcbiAgcmV0dXJuIHNpZGVBcmVhcy5yZWR1Y2UoXHJcbiAgICAoYWNjOiBhbnksIGFyZWEpID0+IHtcclxuICAgICAgY29uc3QgcmVzID0gZ2V0QXJlYUFic29ycHRpb25DYXBhY2l0eSh1bml0LCBhcmVhLCBhY2MucmVtYWluLCBhbGxBcmVhc1NpemVQaXhlbCk7XHJcbiAgICAgIGFjYy5saXN0LnB1c2gocmVzKTtcclxuICAgICAgYWNjLnJlbWFpbiA9IHJlcyAmJiByZXMucGl4ZWxSZW1haW47XHJcbiAgICAgIHJldHVybiBhY2M7XHJcbiAgICB9LFxyXG4gICAgeyByZW1haW46IHBpeGVscywgbGlzdDogW10gfVxyXG4gICk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldEFyZWFBYnNvcnB0aW9uQ2FwYWNpdHkoXHJcbiAgdW5pdDogJ3BlcmNlbnQnIHwgJ3BpeGVsJyxcclxuICBhcmVhU25hcHNob3Q6IE10eFNwbGl0QXJlYVNuYXBzaG90LFxyXG4gIHBpeGVsczogbnVtYmVyLFxyXG4gIGFsbEFyZWFzU2l6ZVBpeGVsOiBudW1iZXJcclxuKTogTXR4U3BsaXRBcmVhQWJzb3JwdGlvbkNhcGFjaXR5IHwgdm9pZCB7XHJcbiAgLy8gTm8gcGFpbiBubyBnYWluXHJcbiAgaWYgKHBpeGVscyA9PT0gMCkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgYXJlYVNuYXBzaG90LFxyXG4gICAgICBwaXhlbEFic29yYjogMCxcclxuICAgICAgcGVyY2VudEFmdGVyQWJzb3JwdGlvbjogYXJlYVNuYXBzaG90LnNpemVQZXJjZW50QXRTdGFydCxcclxuICAgICAgcGl4ZWxSZW1haW46IDAsXHJcbiAgICB9O1xyXG4gIH1cclxuXHJcbiAgLy8gQXJlYSBzdGFydCBhdCB6ZXJvIGFuZCBuZWVkIHRvIGJlIHJlZHVjZWQsIG5vdCBwb3NzaWJsZVxyXG4gIGlmIChhcmVhU25hcHNob3Quc2l6ZVBpeGVsQXRTdGFydCA9PT0gMCAmJiBwaXhlbHMgPCAwKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBhcmVhU25hcHNob3QsXHJcbiAgICAgIHBpeGVsQWJzb3JiOiAwLFxyXG4gICAgICBwZXJjZW50QWZ0ZXJBYnNvcnB0aW9uOiAwLFxyXG4gICAgICBwaXhlbFJlbWFpbjogcGl4ZWxzLFxyXG4gICAgfTtcclxuICB9XHJcblxyXG4gIGlmICh1bml0ID09PSAncGVyY2VudCcpIHtcclxuICAgIHJldHVybiBnZXRBcmVhQWJzb3JwdGlvbkNhcGFjaXR5UGVyY2VudChhcmVhU25hcHNob3QsIHBpeGVscywgYWxsQXJlYXNTaXplUGl4ZWwpO1xyXG4gIH1cclxuXHJcbiAgaWYgKHVuaXQgPT09ICdwaXhlbCcpIHtcclxuICAgIHJldHVybiBnZXRBcmVhQWJzb3JwdGlvbkNhcGFjaXR5UGl4ZWwoYXJlYVNuYXBzaG90LCBwaXhlbHMsIGFsbEFyZWFzU2l6ZVBpeGVsKTtcclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldEFyZWFBYnNvcnB0aW9uQ2FwYWNpdHlQZXJjZW50KFxyXG4gIGFyZWFTbmFwc2hvdDogTXR4U3BsaXRBcmVhU25hcHNob3QsXHJcbiAgcGl4ZWxzOiBudW1iZXIsXHJcbiAgYWxsQXJlYXNTaXplUGl4ZWw6IG51bWJlclxyXG4pOiBNdHhTcGxpdEFyZWFBYnNvcnB0aW9uQ2FwYWNpdHkgfCB2b2lkIHtcclxuICBjb25zdCB0ZW1wUGl4ZWxTaXplID0gYXJlYVNuYXBzaG90LnNpemVQaXhlbEF0U3RhcnQgKyBwaXhlbHM7XHJcbiAgY29uc3QgdGVtcFBlcmNlbnRTaXplID0gKHRlbXBQaXhlbFNpemUgLyBhbGxBcmVhc1NpemVQaXhlbCkgKiAxMDA7XHJcblxyXG4gIC8vIEVOTEFSR0UgQVJFQVxyXG5cclxuICBpZiAocGl4ZWxzID4gMCkge1xyXG4gICAgLy8gSWYgbWF4U2l6ZSAmIG5ld1NpemUgYmlnZ2VyIHRoYW4gaXQgPiBhYnNvcmIgdG8gbWF4IGFuZCByZXR1cm4gcmVtYWluaW5nIHBpeGVsc1xyXG4gICAgaWYgKGFyZWFTbmFwc2hvdC5hcmVhLm1heFNpemUgIT09IG51bGwgJiYgdGVtcFBlcmNlbnRTaXplID4gYXJlYVNuYXBzaG90LmFyZWEubWF4U2l6ZSkge1xyXG4gICAgICAvLyBVc2UgYXJlYS5hcmVhLm1heFNpemUgYXMgbmV3UGVyY2VudFNpemUgYW5kIHJldHVybiBjYWxjdWxhdGUgcGl4ZWxzIHJlbWFpbmluZ1xyXG4gICAgICBjb25zdCBtYXhTaXplUGl4ZWwgPSAoYXJlYVNuYXBzaG90LmFyZWEubWF4U2l6ZSAvIDEwMCkgKiBhbGxBcmVhc1NpemVQaXhlbDtcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICBhcmVhU25hcHNob3QsXHJcbiAgICAgICAgcGl4ZWxBYnNvcmI6IG1heFNpemVQaXhlbCxcclxuICAgICAgICBwZXJjZW50QWZ0ZXJBYnNvcnB0aW9uOiBhcmVhU25hcHNob3QuYXJlYS5tYXhTaXplLFxyXG4gICAgICAgIHBpeGVsUmVtYWluOiBhcmVhU25hcHNob3Quc2l6ZVBpeGVsQXRTdGFydCArIHBpeGVscyAtIG1heFNpemVQaXhlbCxcclxuICAgICAgfTtcclxuICAgIH1cclxuICAgIHJldHVybiB7XHJcbiAgICAgIGFyZWFTbmFwc2hvdCxcclxuICAgICAgcGl4ZWxBYnNvcmI6IHBpeGVscyxcclxuICAgICAgcGVyY2VudEFmdGVyQWJzb3JwdGlvbjogdGVtcFBlcmNlbnRTaXplID4gMTAwID8gMTAwIDogdGVtcFBlcmNlbnRTaXplLFxyXG4gICAgICBwaXhlbFJlbWFpbjogMCxcclxuICAgIH07XHJcbiAgfVxyXG5cclxuICAvLyBSRURVQ0UgQVJFQVxyXG4gIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTogb25lLWxpbmVcclxuICBlbHNlIGlmIChwaXhlbHMgPCAwKSB7XHJcbiAgICAvLyBJZiBtaW5TaXplICYgbmV3U2l6ZSBzbWFsbGVyIHRoYW4gaXQgPiBhYnNvcmIgdG8gbWluIGFuZCByZXR1cm4gcmVtYWluaW5nIHBpeGVsc1xyXG4gICAgaWYgKGFyZWFTbmFwc2hvdC5hcmVhLm1pblNpemUgIT09IG51bGwgJiYgdGVtcFBlcmNlbnRTaXplIDwgYXJlYVNuYXBzaG90LmFyZWEubWluU2l6ZSkge1xyXG4gICAgICAvLyBVc2UgYXJlYS5hcmVhLm1pblNpemUgYXMgbmV3UGVyY2VudFNpemUgYW5kIHJldHVybiBjYWxjdWxhdGUgcGl4ZWxzIHJlbWFpbmluZ1xyXG4gICAgICBjb25zdCBtaW5TaXplUGl4ZWwgPSAoYXJlYVNuYXBzaG90LmFyZWEubWluU2l6ZSAvIDEwMCkgKiBhbGxBcmVhc1NpemVQaXhlbDtcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICBhcmVhU25hcHNob3QsXHJcbiAgICAgICAgcGl4ZWxBYnNvcmI6IG1pblNpemVQaXhlbCxcclxuICAgICAgICBwZXJjZW50QWZ0ZXJBYnNvcnB0aW9uOiBhcmVhU25hcHNob3QuYXJlYS5taW5TaXplLFxyXG4gICAgICAgIHBpeGVsUmVtYWluOiBhcmVhU25hcHNob3Quc2l6ZVBpeGVsQXRTdGFydCArIHBpeGVscyAtIG1pblNpemVQaXhlbCxcclxuICAgICAgfTtcclxuICAgIH1cclxuICAgIC8vIElmIHJlZHVjZWQgdW5kZXIgemVybyA+IHJldHVybiByZW1haW5pbmcgcGl4ZWxzXHJcbiAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6IG9uZS1saW5lXHJcbiAgICBlbHNlIGlmICh0ZW1wUGVyY2VudFNpemUgPCAwKSB7XHJcbiAgICAgIC8vIFVzZSAwIGFzIG5ld1BlcmNlbnRTaXplIGFuZCByZXR1cm4gY2FsY3VsYXRlIHBpeGVscyByZW1haW5pbmdcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICBhcmVhU25hcHNob3QsXHJcbiAgICAgICAgcGl4ZWxBYnNvcmI6IC1hcmVhU25hcHNob3Quc2l6ZVBpeGVsQXRTdGFydCxcclxuICAgICAgICBwZXJjZW50QWZ0ZXJBYnNvcnB0aW9uOiAwLFxyXG4gICAgICAgIHBpeGVsUmVtYWluOiBwaXhlbHMgKyBhcmVhU25hcHNob3Quc2l6ZVBpeGVsQXRTdGFydCxcclxuICAgICAgfTtcclxuICAgIH1cclxuICAgIHJldHVybiB7XHJcbiAgICAgIGFyZWFTbmFwc2hvdCxcclxuICAgICAgcGl4ZWxBYnNvcmI6IHBpeGVscyxcclxuICAgICAgcGVyY2VudEFmdGVyQWJzb3JwdGlvbjogdGVtcFBlcmNlbnRTaXplLFxyXG4gICAgICBwaXhlbFJlbWFpbjogMCxcclxuICAgIH07XHJcbiAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRBcmVhQWJzb3JwdGlvbkNhcGFjaXR5UGl4ZWwoXHJcbiAgYXJlYVNuYXBzaG90OiBNdHhTcGxpdEFyZWFTbmFwc2hvdCxcclxuICBwaXhlbHM6IG51bWJlcixcclxuICBjb250YWluZXJTaXplUGl4ZWw6IG51bWJlclxyXG4pOiBNdHhTcGxpdEFyZWFBYnNvcnB0aW9uQ2FwYWNpdHkgfCB2b2lkIHtcclxuICBjb25zdCB0ZW1wUGl4ZWxTaXplID0gYXJlYVNuYXBzaG90LnNpemVQaXhlbEF0U3RhcnQgKyBwaXhlbHM7XHJcblxyXG4gIC8vIEVOTEFSR0UgQVJFQVxyXG5cclxuICBpZiAocGl4ZWxzID4gMCkge1xyXG4gICAgLy8gSWYgbWF4U2l6ZSAmIG5ld1NpemUgYmlnZ2VyIHRoYW4gaXQgPiBhYnNvcmIgdG8gbWF4IGFuZCByZXR1cm4gcmVtYWluaW5nIHBpeGVsc1xyXG4gICAgaWYgKGFyZWFTbmFwc2hvdC5hcmVhLm1heFNpemUgIT09IG51bGwgJiYgdGVtcFBpeGVsU2l6ZSA+IGFyZWFTbmFwc2hvdC5hcmVhLm1heFNpemUpIHtcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICBhcmVhU25hcHNob3QsXHJcbiAgICAgICAgcGl4ZWxBYnNvcmI6IGFyZWFTbmFwc2hvdC5hcmVhLm1heFNpemUgLSBhcmVhU25hcHNob3Quc2l6ZVBpeGVsQXRTdGFydCxcclxuICAgICAgICBwZXJjZW50QWZ0ZXJBYnNvcnB0aW9uOiAtMSxcclxuICAgICAgICBwaXhlbFJlbWFpbjogdGVtcFBpeGVsU2l6ZSAtIGFyZWFTbmFwc2hvdC5hcmVhLm1heFNpemUsXHJcbiAgICAgIH07XHJcbiAgICB9XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBhcmVhU25hcHNob3QsXHJcbiAgICAgIHBpeGVsQWJzb3JiOiBwaXhlbHMsXHJcbiAgICAgIHBlcmNlbnRBZnRlckFic29ycHRpb246IC0xLFxyXG4gICAgICBwaXhlbFJlbWFpbjogMCxcclxuICAgIH07XHJcbiAgfVxyXG5cclxuICAvLyBSRURVQ0UgQVJFQVxyXG4gIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTogb25lLWxpbmVcclxuICBlbHNlIGlmIChwaXhlbHMgPCAwKSB7XHJcbiAgICAvLyBJZiBtaW5TaXplICYgbmV3U2l6ZSBzbWFsbGVyIHRoYW4gaXQgPiBhYnNvcmIgdG8gbWluIGFuZCByZXR1cm4gcmVtYWluaW5nIHBpeGVsc1xyXG4gICAgaWYgKGFyZWFTbmFwc2hvdC5hcmVhLm1pblNpemUgIT09IG51bGwgJiYgdGVtcFBpeGVsU2l6ZSA8IGFyZWFTbmFwc2hvdC5hcmVhLm1pblNpemUpIHtcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICBhcmVhU25hcHNob3QsXHJcbiAgICAgICAgcGl4ZWxBYnNvcmI6IGFyZWFTbmFwc2hvdC5hcmVhLm1pblNpemUgKyBwaXhlbHMgLSB0ZW1wUGl4ZWxTaXplLFxyXG4gICAgICAgIHBlcmNlbnRBZnRlckFic29ycHRpb246IC0xLFxyXG4gICAgICAgIHBpeGVsUmVtYWluOiB0ZW1wUGl4ZWxTaXplIC0gYXJlYVNuYXBzaG90LmFyZWEubWluU2l6ZSxcclxuICAgICAgfTtcclxuICAgIH1cclxuICAgIC8vIElmIHJlZHVjZWQgdW5kZXIgemVybyA+IHJldHVybiByZW1haW5pbmcgcGl4ZWxzXHJcbiAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6IG9uZS1saW5lXHJcbiAgICBlbHNlIGlmICh0ZW1wUGl4ZWxTaXplIDwgMCkge1xyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIGFyZWFTbmFwc2hvdCxcclxuICAgICAgICBwaXhlbEFic29yYjogLWFyZWFTbmFwc2hvdC5zaXplUGl4ZWxBdFN0YXJ0LFxyXG4gICAgICAgIHBlcmNlbnRBZnRlckFic29ycHRpb246IC0xLFxyXG4gICAgICAgIHBpeGVsUmVtYWluOiBwaXhlbHMgKyBhcmVhU25hcHNob3Quc2l6ZVBpeGVsQXRTdGFydCxcclxuICAgICAgfTtcclxuICAgIH1cclxuICAgIHJldHVybiB7XHJcbiAgICAgIGFyZWFTbmFwc2hvdCxcclxuICAgICAgcGl4ZWxBYnNvcmI6IHBpeGVscyxcclxuICAgICAgcGVyY2VudEFmdGVyQWJzb3JwdGlvbjogLTEsXHJcbiAgICAgIHBpeGVsUmVtYWluOiAwLFxyXG4gICAgfTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiB1cGRhdGVBcmVhU2l6ZSh1bml0OiAncGVyY2VudCcgfCAncGl4ZWwnLCBpdGVtOiBNdHhTcGxpdEFyZWFBYnNvcnB0aW9uQ2FwYWNpdHkpIHtcclxuICBpZiAodW5pdCA9PT0gJ3BlcmNlbnQnKSB7XHJcbiAgICBpdGVtLmFyZWFTbmFwc2hvdC5hcmVhLnNpemUgPSBpdGVtLnBlcmNlbnRBZnRlckFic29ycHRpb247XHJcbiAgfSBlbHNlIGlmICh1bml0ID09PSAncGl4ZWwnKSB7XHJcbiAgICAvLyBVcGRhdGUgc2l6ZSBleGNlcHQgZm9yIHRoZSB3aWxkY2FyZCBzaXplIGFyZWFcclxuICAgIGlmIChpdGVtLmFyZWFTbmFwc2hvdC5hcmVhLnNpemUgIT09IG51bGwpIHtcclxuICAgICAgaXRlbS5hcmVhU25hcHNob3QuYXJlYS5zaXplID0gaXRlbS5hcmVhU25hcHNob3Quc2l6ZVBpeGVsQXRTdGFydCArIGl0ZW0ucGl4ZWxBYnNvcmI7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcbiJdfQ==