import { OverlayRef } from '@angular/cdk/overlay';
import { Observable } from 'rxjs';
import { MtxDrawerContainer } from './drawer-container';
/**
 * Reference to a drawer dispatched from the drawer service.
 */
export declare class MtxDrawerRef<T = any, R = any> {
    private _overlayRef;
    /** Instance of the component making up the content of the drawer. */
    instance: T;
    /**
     * Instance of the component into which the drawer content is projected.
     * @docs-private
     */
    containerInstance: MtxDrawerContainer;
    /** Whether the user is allowed to close the drawer. */
    disableClose: boolean | undefined;
    /** Subject for notifying the user that the drawer has been dismissed. */
    private readonly _afterDismissed;
    /** Subject for notifying the user that the drawer has opened and appeared. */
    private readonly _afterOpened;
    /** Result to be passed down to the `afterDismissed` stream. */
    private _result;
    /** Handle to the timeout that's running as a fallback in case the exit animation doesn't fire. */
    private _closeFallbackTimeout;
    constructor(containerInstance: MtxDrawerContainer, _overlayRef: OverlayRef);
    /**
     * Dismisses the drawer.
     * @param result Data to be passed back to the drawer opener.
     */
    dismiss(result?: R): void;
    /** Gets an observable that is notified when the drawer is finished closing. */
    afterDismissed(): Observable<R | undefined>;
    /** Gets an observable that is notified when the drawer has opened and appeared. */
    afterOpened(): Observable<void>;
    /**
     * Gets an observable that emits when the overlay's backdrop has been clicked.
     */
    backdropClick(): Observable<MouseEvent>;
    /**
     * Gets an observable that emits when keydown events are targeted on the overlay.
     */
    keydownEvents(): Observable<KeyboardEvent>;
}
