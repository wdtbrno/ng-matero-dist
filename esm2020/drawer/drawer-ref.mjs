import { ESCAPE, hasModifierKey } from '@angular/cdk/keycodes';
import { merge, Subject } from 'rxjs';
import { filter, take } from 'rxjs/operators';
/**
 * Reference to a drawer dispatched from the drawer service.
 */
export class MtxDrawerRef {
    constructor(containerInstance, _overlayRef) {
        this._overlayRef = _overlayRef;
        /** Subject for notifying the user that the drawer has been dismissed. */
        this._afterDismissed = new Subject();
        /** Subject for notifying the user that the drawer has opened and appeared. */
        this._afterOpened = new Subject();
        this.containerInstance = containerInstance;
        this.disableClose = containerInstance.drawerConfig.disableClose;
        // Emit when opening animation completes
        containerInstance._animationStateChanged
            .pipe(filter(event => event.phaseName === 'done' && event.toState === 'visible'), take(1))
            .subscribe(() => {
            this._afterOpened.next();
            this._afterOpened.complete();
        });
        // Dispose overlay when closing animation is complete
        containerInstance._animationStateChanged
            .pipe(filter(event => event.phaseName === 'done' && event.toState === 'hidden'), take(1))
            .subscribe(() => {
            clearTimeout(this._closeFallbackTimeout);
            _overlayRef.dispose();
        });
        _overlayRef
            .detachments()
            .pipe(take(1))
            .subscribe(() => {
            this._afterDismissed.next(this._result);
            this._afterDismissed.complete();
        });
        merge(_overlayRef.backdropClick(), _overlayRef.keydownEvents().pipe(filter(event => event.keyCode === ESCAPE))).subscribe(event => {
            if (!this.disableClose &&
                (event.type !== 'keydown' || !hasModifierKey(event))) {
                event.preventDefault();
                this.dismiss();
            }
        });
    }
    /**
     * Dismisses the drawer.
     * @param result Data to be passed back to the drawer opener.
     */
    dismiss(result) {
        if (!this._afterDismissed.closed) {
            // Transition the backdrop in parallel to the drawer.
            this.containerInstance._animationStateChanged
                .pipe(filter(event => event.phaseName === 'start'), take(1))
                .subscribe(event => {
                // The logic that disposes of the overlay depends on the exit animation completing, however
                // it isn't guaranteed if the parent view is destroyed while it's running. Add a fallback
                // timeout which will clean everything up if the animation hasn't fired within the specified
                // amount of time plus 100ms. We don't need to run this outside the NgZone, because for the
                // vast majority of cases the timeout will have been cleared before it has fired.
                this._closeFallbackTimeout = setTimeout(() => {
                    this._overlayRef.dispose();
                }, event.totalTime + 100);
                this._overlayRef.detachBackdrop();
            });
            this._result = result;
            this.containerInstance.exit();
        }
    }
    /** Gets an observable that is notified when the drawer is finished closing. */
    afterDismissed() {
        return this._afterDismissed;
    }
    /** Gets an observable that is notified when the drawer has opened and appeared. */
    afterOpened() {
        return this._afterOpened;
    }
    /**
     * Gets an observable that emits when the overlay's backdrop has been clicked.
     */
    backdropClick() {
        return this._overlayRef.backdropClick();
    }
    /**
     * Gets an observable that emits when keydown events are targeted on the overlay.
     */
    keydownEvents() {
        return this._overlayRef.keydownEvents();
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHJhd2VyLXJlZi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL2V4dGVuc2lvbnMvZHJhd2VyL2RyYXdlci1yZWYudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLE1BQU0sRUFBRSxjQUFjLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQztBQUUvRCxPQUFPLEVBQUUsS0FBSyxFQUFjLE9BQU8sRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUNsRCxPQUFPLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBRzlDOztHQUVHO0FBQ0gsTUFBTSxPQUFPLFlBQVk7SUF5QnZCLFlBQVksaUJBQXFDLEVBQVUsV0FBdUI7UUFBdkIsZ0JBQVcsR0FBWCxXQUFXLENBQVk7UUFabEYseUVBQXlFO1FBQ3hELG9CQUFlLEdBQUcsSUFBSSxPQUFPLEVBQWlCLENBQUM7UUFFaEUsOEVBQThFO1FBQzdELGlCQUFZLEdBQUcsSUFBSSxPQUFPLEVBQVEsQ0FBQztRQVNsRCxJQUFJLENBQUMsaUJBQWlCLEdBQUcsaUJBQWlCLENBQUM7UUFDM0MsSUFBSSxDQUFDLFlBQVksR0FBRyxpQkFBaUIsQ0FBQyxZQUFZLENBQUMsWUFBWSxDQUFDO1FBQ2hFLHdDQUF3QztRQUN4QyxpQkFBaUIsQ0FBQyxzQkFBc0I7YUFDckMsSUFBSSxDQUNILE1BQU0sQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxTQUFTLEtBQUssTUFBTSxJQUFJLEtBQUssQ0FBQyxPQUFPLEtBQUssU0FBUyxDQUFDLEVBQzFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FDUjthQUNBLFNBQVMsQ0FBQyxHQUFHLEVBQUU7WUFDZCxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksRUFBRSxDQUFDO1lBQ3pCLElBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDL0IsQ0FBQyxDQUFDLENBQUM7UUFFTCxxREFBcUQ7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Iiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRVNDQVBFLCBoYXNNb2RpZmllcktleSB9IGZyb20gJ0Bhbmd1bGFyL2Nkay9rZXljb2Rlcyc7XG5pbXBvcnQgeyBPdmVybGF5UmVmIH0gZnJvbSAnQGFuZ3VsYXIvY2RrL292ZXJsYXknO1xuaW1wb3J0IHsgbWVyZ2UsIE9ic2VydmFibGUsIFN1YmplY3QgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IGZpbHRlciwgdGFrZSB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7IE10eERyYXdlckNvbnRhaW5lciB9IGZyb20gJy4vZHJhd2VyLWNvbnRhaW5lcic7XG5cbi8qKlxuICogUmVmZXJlbmNlIHRvIGEgZHJhd2VyIGRpc3BhdGNoZWQgZnJvbSB0aGUgZHJhd2VyIHNlcnZpY2UuXG4gKi9cbmV4cG9ydCBjbGFzcyBNdHhEcmF3ZXJSZWY8VCA9IGFueSwgUiA9IGFueT4ge1xuICAvKiogSW5zdGFuY2Ugb2YgdGhlIGNvbXBvbmVudCBtYWtpbmcgdXAgdGhlIGNvbnRlbnQgb2YgdGhlIGRyYXdlci4gKi9cbiAgaW5zdGFuY2UhOiBUO1xuXG4gIC8qKlxuICAgKiBJbnN0YW5jZSBvZiB0aGUgY29tcG9uZW50IGludG8gd2hpY2ggdGhlIGRyYXdlciBjb250ZW50IGlzIHByb2plY3RlZC5cbiAgICogQGRvY3MtcHJpdmF0ZVxuICAgKi9cbiAgY29udGFpbmVySW5zdGFuY2U6IE10eERyYXdlckNvbnRhaW5lcjtcblxuICAvKiogV2hldGhlciB0aGUgdXNlciBpcyBhbGxvd2VkIHRvIGNsb3NlIHRoZSBkcmF3ZXIuICovXG4gIGRpc2FibGVDbG9zZTogYm9vbGVhbiB8IHVuZGVmaW5lZDtcblxuICAvKiogU3ViamVjdCBmb3Igbm90aWZ5aW5nIHRoZSB1c2VyIHRoYXQgdGhlIGRyYXdlciBoYXMgYmVlbiBkaXNtaXNzZWQuICovXG4gIHByaXZhdGUgcmVhZG9ubHkgX2FmdGVyRGlzbWlzc2VkID0gbmV3IFN1YmplY3Q8UiB8IHVuZGVmaW5lZD4oKTtcblxuICAvKiogU3ViamVjdCBmb3Igbm90aWZ5aW5nIHRoZSB1c2VyIHRoYXQgdGhlIGRyYXdlciBoYXMgb3BlbmVkIGFuZCBhcHBlYXJlZC4gKi9cbiAgcHJpdmF0ZSByZWFkb25seSBfYWZ0ZXJPcGVuZWQgPSBuZXcgU3ViamVjdDx2b2lkPigpO1xuXG4gIC8qKiBSZXN1bHQgdG8gYmUgcGFzc2VkIGRvd24gdG8gdGhlIGBhZnRlckRpc21pc3NlZGAgc3RyZWFtLiAqL1xuICBwcml2YXRlIF9yZXN1bHQ6IFIgfCB1bmRlZmluZWQ7XG5cbiAgLyoqIEhhbmRsZSB0byB0aGUgdGltZW91dCB0aGF0J3MgcnVubmluZyBhcyBhIGZhbGxiYWNrIGluIGNhc2UgdGhlIGV4aXQgYW5pbWF0aW9uIGRvZXNuJ3QgZmlyZS4gKi9cbiAgcHJpdmF0ZSBfY2xvc2VGYWxsYmFja1RpbWVvdXQhOiBhbnk7XG5cbiAgY29uc3RydWN0b3IoY29udGFpbmVySW5zdGFuY2U6IE10eERyYXdlckNvbnRhaW5lciwgcHJpdmF0ZSBfb3ZlcmxheVJlZjogT3ZlcmxheVJlZikge1xuICAgIHRoaXMuY29udGFpbmVySW5zdGFuY2UgPSBjb250YWluZXJJbnN0YW5jZTtcbiAgICB0aGlzLmRpc2FibGVDbG9zZSA9IGNvbnRhaW5lckluc3RhbmNlLmRyYXdlckNvbmZpZy5kaXNhYmxlQ2xvc2U7XG4gICAgLy8gRW1pdCB3aGVuIG9wZW5pbmcgYW5pbWF0aW9uIGNvbXBsZXRlc1xuICAgIGNvbnRhaW5lckluc3RhbmNlLl9hbmltYXRpb25TdGF0ZUNoYW5nZWRcbiAgICAgIC5waXBlKFxuICAgICAgICBmaWx0ZXIoZXZlbnQgPT4gZXZlbnQucGhhc2VOYW1lID09PSAnZG9uZScgJiYgZXZlbnQudG9TdGF0ZSA9PT0gJ3Zpc2libGUnKSxcbiAgICAgICAgdGFrZSgxKVxuICAgICAgKVxuICAgICAgLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgIHRoaXMuX2FmdGVyT3BlbmVkLm5leHQoKTtcbiAgICAgICAgdGhpcy5fYWZ0ZXJPcGVuZWQuY29tcGxldGUoKTtcbiAgICAgIH0pO1xuXG4gICAgLy8gRGlzcG9zZSBvdmVybGF5IHdoZW4gY2xvc2luZyBhbmltYXRpb24gaXMgY29tcGxldGVcbiAgICBjb250YWluZXJJbnN0YW5jZS5fYW5pbWF0aW9uU3RhdGVDaGFuZ2VkXG4gICAgICAucGlwZShcbiAgICAgICAgZmlsdGVyKGV2ZW50ID0+IGV2ZW50LnBoYXNlTmFtZSA9PT0gJ2RvbmUnICYmIGV2ZW50LnRvU3RhdGUgPT09ICdoaWRkZW4nKSxcbiAgICAgICAgdGFrZSgxKVxuICAgICAgKVxuICAgICAgLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgIGNsZWFyVGltZW91dCh0aGlzLl9jbG9zZUZhbGxiYWNrVGltZW91dCk7XG4gICAgICAgIF9vdmVybGF5UmVmLmRpc3Bvc2UoKTtcbiAgICAgIH0pO1xuXG4gICAgX292ZXJsYXlSZWZcbiAgICAgIC5kZXRhY2htZW50cygpXG4gICAgICAucGlwZSh0YWtlKDEpKVxuICAgICAgLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgIHRoaXMuX2FmdGVyRGlzbWlzc2VkLm5leHQodGhpcy5fcmVzdWx0KTtcbiAgICAgICAgdGhpcy5fYWZ0ZXJEaXNtaXNzZWQuY29tcGxldGUoKTtcbiAgICAgIH0pO1xuXG4gICAgbWVyZ2UoXG4gICAgICBfb3ZlcmxheVJlZi5iYWNrZHJvcENsaWNrKCksXG4gICAgICBfb3ZlcmxheVJlZi5rZXlkb3duRXZlbnRzKCkucGlwZShmaWx0ZXIoZXZlbnQgPT4gZXZlbnQua2V5Q29kZSA9PT0gRVNDQVBFKSlcbiAgICApLnN1YnNjcmliZShldmVudCA9PiB7XG4gICAgICBpZiAoXG4gICAgICAgICF0aGlzLmRpc2FibGVDbG9zZSAmJlxuICAgICAgICAoZXZlbnQudHlwZSAhPT0gJ2tleWRvd24nIHx8ICFoYXNNb2RpZmllcktleShldmVudCBhcyBLZXlib2FyZEV2ZW50KSlcbiAgICAgICkge1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB0aGlzLmRpc21pc3MoKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEaXNtaXNzZXMgdGhlIGRyYXdlci5cbiAgICogQHBhcmFtIHJlc3VsdCBEYXRhIHRvIGJlIHBhc3NlZCBiYWNrIHRvIHRoZSBkcmF3ZXIgb3BlbmVyLlxuICAgKi9cbiAgZGlzbWlzcyhyZXN1bHQ/OiBSKTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLl9hZnRlckRpc21pc3NlZC5jbG9zZWQpIHtcbiAgICAgIC8vIFRyYW5zaXRpb24gdGhlIGJhY2tkcm9wIGluIHBhcmFsbGVsIHRvIHRoZSBkcmF3ZXIuXG4gICAgICB0aGlzLmNvbnRhaW5lckluc3RhbmNlLl9hbmltYXRpb25TdGF0ZUNoYW5nZWRcbiAgICAgICAgLnBpcGUoXG4gICAgICAgICAgZmlsdGVyKGV2ZW50ID0+IGV2ZW50LnBoYXNlTmFtZSA9PT0gJ3N0YXJ0JyksXG4gICAgICAgICAgdGFrZSgxKVxuICAgICAgICApXG4gICAgICAgIC5zdWJzY3JpYmUoZXZlbnQgPT4ge1xuICAgICAgICAgIC8vIFRoZSBsb2dpYyB0aGF0IGRpc3Bvc2VzIG9mIHRoZSBvdmVybGF5IGRlcGVuZHMgb24gdGhlIGV4aXQgYW5pbWF0aW9uIGNvbXBsZXRpbmcsIGhvd2V2ZXJcbiAgICAgICAgICAvLyBpdCBpc24ndCBndWFyYW50ZWVkIGlmIHRoZSBwYXJlbnQgdmlldyBpcyBkZXN0cm95ZWQgd2hpbGUgaXQncyBydW5uaW5nLiBBZGQgYSBmYWxsYmFja1xuICAgICAgICAgIC8vIHRpbWVvdXQgd2hpY2ggd2lsbCBjbGVhbiBldmVyeXRoaW5nIHVwIGlmIHRoZSBhbmltYXRpb24gaGFzbid0IGZpcmVkIHdpdGhpbiB0aGUgc3BlY2lmaWVkXG4gICAgICAgICAgLy8gYW1vdW50IG9mIHRpbWUgcGx1cyAxMDBtcy4gV2UgZG9uJ3QgbmVlZCB0byBydW4gdGhpcyBvdXRzaWRlIHRoZSBOZ1pvbmUsIGJlY2F1c2UgZm9yIHRoZVxuICAgICAgICAgIC8vIHZhc3QgbWFqb3JpdHkgb2YgY2FzZXMgdGhlIHRpbWVvdXQgd2lsbCBoYXZlIGJlZW4gY2xlYXJlZCBiZWZvcmUgaXQgaGFzIGZpcmVkLlxuICAgICAgICAgIHRoaXMuX2Nsb3NlRmFsbGJhY2tUaW1lb3V0ID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLl9vdmVybGF5UmVmLmRpc3Bvc2UoKTtcbiAgICAgICAgICB9LCBldmVudC50b3RhbFRpbWUgKyAxMDApO1xuXG4gICAgICAgICAgdGhpcy5fb3ZlcmxheVJlZi5kZXRhY2hCYWNrZHJvcCgpO1xuICAgICAgICB9KTtcblxuICAgICAgdGhpcy5fcmVzdWx0ID0gcmVzdWx0O1xuICAgICAgdGhpcy5jb250YWluZXJJbnN0YW5jZS5leGl0KCk7XG4gICAgfVxuICB9XG5cbiAgLyoqIEdldHMgYW4gb2JzZXJ2YWJsZSB0aGF0IGlzIG5vdGlmaWVkIHdoZW4gdGhlIGRyYXdlciBpcyBmaW5pc2hlZCBjbG9zaW5nLiAqL1xuICBhZnRlckRpc21pc3NlZCgpOiBPYnNlcnZhYmxlPFIgfCB1bmRlZmluZWQ+IHtcbiAgICByZXR1cm4gdGhpcy5fYWZ0ZXJEaXNtaXNzZWQ7XG4gIH1cblxuICAvKiogR2V0cyBhbiBvYnNlcnZhYmxlIHRoYXQgaXMgbm90aWZpZWQgd2hlbiB0aGUgZHJhd2VyIGhhcyBvcGVuZWQgYW5kIGFwcGVhcmVkLiAqL1xuICBhZnRlck9wZW5lZCgpOiBPYnNlcnZhYmxlPHZvaWQ+IHtcbiAgICByZXR1cm4gdGhpcy5fYWZ0ZXJPcGVuZWQ7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyBhbiBvYnNlcnZhYmxlIHRoYXQgZW1pdHMgd2hlbiB0aGUgb3ZlcmxheSdzIGJhY2tkcm9wIGhhcyBiZWVuIGNsaWNrZWQuXG4gICAqL1xuICBiYWNrZHJvcENsaWNrKCk6IE9ic2VydmFibGU8TW91c2VFdmVudD4ge1xuICAgIHJldHVybiB0aGlzLl9vdmVybGF5UmVmLmJhY2tkcm9wQ2xpY2soKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIGFuIG9ic2VydmFibGUgdGhhdCBlbWl0cyB3aGVuIGtleWRvd24gZXZlbnRzIGFyZSB0YXJnZXRlZCBvbiB0aGUgb3ZlcmxheS5cbiAgICovXG4gIGtleWRvd25FdmVudHMoKTogT2JzZXJ2YWJsZTxLZXlib2FyZEV2ZW50PiB7XG4gICAgcmV0dXJuIHRoaXMuX292ZXJsYXlSZWYua2V5ZG93bkV2ZW50cygpO1xuICB9XG59XG4iXX0=