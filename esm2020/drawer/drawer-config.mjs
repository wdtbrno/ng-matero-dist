/**
 * Configuration used when opening a drawer.
 */
export class MtxDrawerConfig {
    constructor() {
        /** Data being injected into the child component. */
        this.data = null;
        /** Whether the drawer has a backdrop. */
        this.hasBackdrop = true;
        /** Whether the user can use escape or clicking outside to close the drawer. */
        this.disableClose = false;
        /** Aria label to assign to the drawer element. */
        this.ariaLabel = null;
        /**
         * Whether the drawer should close when the user goes backwards/forwards in history.
         * Note that this usually doesn't include clicking on links (unless the user is using
         * the `HashLocationStrategy`).
         */
        this.closeOnNavigation = true;
        /**
         * Where the drawer should focus on open.
         * @breaking-change 14.0.0 Remove boolean option from autoFocus. Use string or
         * AutoFocusTarget instead.
         */
        this.autoFocus = 'first-tabbable';
        /**
         * Whether the drawer should restore focus to the
         * previously-focused element, after it's closed.
         */
        this.restoreFocus = true;
        /** Position of the drawer */
        this.position = 'right';
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHJhd2VyLWNvbmZpZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL2V4dGVuc2lvbnMvZHJhd2VyL2RyYXdlci1jb25maWcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBVUE7O0dBRUc7QUFDSCxNQUFNLE9BQU8sZUFBZTtJQUE1QjtRQVVFLG9EQUFvRDtRQUNwRCxTQUFJLEdBQWMsSUFBSSxDQUFDO1FBRXZCLHlDQUF5QztRQUN6QyxnQkFBVyxHQUFhLElBQUksQ0FBQztRQUs3QiwrRUFBK0U7UUFDL0UsaUJBQVksR0FBYSxLQUFLLENBQUM7UUFFL0Isa0RBQWtEO1FBQ2xELGNBQVMsR0FBbUIsSUFBSSxDQUFDO1FBRWpDOzs7O1dBSUc7UUFDSCxzQkFBaUIsR0FBYSxJQUFJLENBQUM7UUFFbkM7Ozs7V0FJRztRQUNILGNBQVMsR0FBd0MsZ0JBQWdCLENBQUM7UUFFbEU7OztXQUdHO1FBQ0gsaUJBQVksR0FBYSxJQUFJLENBQUM7UUFLOUIsNkJBQTZCO1FBQzdCLGFBQVEsR0FBb0IsT0FBTyxDQUFDO0lBbUJ0QyxDQUFDO0NBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBEaXJlY3Rpb24gfSBmcm9tICdAYW5ndWxhci9jZGsvYmlkaSc7XG5pbXBvcnQgeyBTY3JvbGxTdHJhdGVneSB9IGZyb20gJ0Bhbmd1bGFyL2Nkay9vdmVybGF5JztcbmltcG9ydCB7IFZpZXdDb250YWluZXJSZWYgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuLyoqIE9wdGlvbnMgZm9yIHdoZXJlIHRvIHNldCBmb2N1cyB0byBhdXRvbWF0aWNhbGx5IG9uIGRpYWxvZyBvcGVuICovXG5leHBvcnQgdHlwZSBBdXRvRm9jdXNUYXJnZXQgPSAnZGlhbG9nJyB8ICdmaXJzdC10YWJiYWJsZScgfCAnZmlyc3QtaGVhZGluZyc7XG5cbi8qKiBQb3NzaWJsZSBvdmVycmlkZXMgZm9yIGEgZHJhd2VyJ3MgcG9zaXRpb24uICovXG5leHBvcnQgdHlwZSBEcmF3ZXJQb3NpdGlvbiA9ICd0b3AnIHwgJ2JvdHRvbScgfCAnbGVmdCcgfCAncmlnaHQnO1xuXG4vKipcbiAqIENvbmZpZ3VyYXRpb24gdXNlZCB3aGVuIG9wZW5pbmcgYSBkcmF3ZXIuXG4gKi9cbmV4cG9ydCBjbGFzcyBNdHhEcmF3ZXJDb25maWc8RCA9IGFueT4ge1xuICAvKiogVGhlIHZpZXcgY29udGFpbmVyIHRvIHBsYWNlIHRoZSBvdmVybGF5IGZvciB0aGUgZHJhd2VyIGludG8uICovXG4gIHZpZXdDb250YWluZXJSZWY/OiBWaWV3Q29udGFpbmVyUmVmO1xuXG4gIC8qKiBFeHRyYSBDU1MgY2xhc3NlcyB0byBiZSBhZGRlZCB0byB0aGUgZHJhd2VyIGNvbnRhaW5lci4gKi9cbiAgcGFuZWxDbGFzcz86IHN0cmluZyB8IHN0cmluZ1tdO1xuXG4gIC8qKiBUZXh0IGxheW91dCBkaXJlY3Rpb24gZm9yIHRoZSBkcmF3ZXIuICovXG4gIGRpcmVjdGlvbj86IERpcmVjdGlvbjtcblxuICAvKiogRGF0YSBiZWluZyBpbmplY3RlZCBpbnRvIHRoZSBjaGlsZCBjb21wb25lbnQuICovXG4gIGRhdGE/OiBEIHwgbnVsbCA9IG51bGw7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGRyYXdlciBoYXMgYSBiYWNrZHJvcC4gKi9cbiAgaGFzQmFja2Ryb3A/OiBib29sZWFuID0gdHJ1ZTtcblxuICAvKiogQ3VzdG9tIGNsYXNzIGZvciB0aGUgYmFja2Ryb3AuICovXG4gIGJhY2tkcm9wQ2xhc3M/OiBzdHJpbmc7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIHVzZXIgY2FuIHVzZSBlc2NhcGUgb3IgY2xpY2tpbmcgb3V0c2lkZSB0byBjbG9zZSB0aGUgZHJhd2VyLiAqL1xuICBkaXNhYmxlQ2xvc2U/OiBib29sZWFuID0gZmFsc2U7XG5cbiAgLyoqIEFyaWEgbGFiZWwgdG8gYXNzaWduIHRvIHRoZSBkcmF3ZXIgZWxlbWVudC4gKi9cbiAgYXJpYUxhYmVsPzogc3RyaW5nIHwgbnVsbCA9IG51bGw7XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgdGhlIGRyYXdlciBzaG91bGQgY2xvc2Ugd2hlbiB0aGUgdXNlciBnb2VzIGJhY2t3YXJkcy9mb3J3YXJkcyBpbiBoaXN0b3J5LlxuICAgKiBOb3RlIHRoYXQgdGhpcyB1c3VhbGx5IGRvZXNuJ3QgaW5jbHVkZSBjbGlja2luZyBvbiBsaW5rcyAodW5sZXNzIHRoZSB1c2VyIGlzIHVzaW5nXG4gICAqIHRoZSBgSGFzaExvY2F0aW9uU3RyYXRlZ3lgKS5cbiAgICovXG4gIGNsb3NlT25OYXZpZ2F0aW9uPzogYm9vbGVhbiA9IHRydWU7XG5cbiAgLyoqXG4gICAqIFdoZXJlIHRoZSBkcmF3ZXIgc2hvdWxkIGZvY3VzIG9uIG9wZW4uXG4gICAqIEBicmVha2luZy1jaGFuZ2UgMTQuMC4wIFJlbW92ZSBib29sZWFuIG9wdGlvbiBmcm9tIGF1dG9Gb2N1cy4gVXNlIHN0cmluZyBvclxuICAgKiBBdXRvRm9jdXNUYXJnZXQgaW5zdGVhZC5cbiAgICovXG4gIGF1dG9Gb2N1cz86IEF1dG9Gb2N1c1RhcmdldCB8IHN0cmluZyB8IGJvb2xlYW4gPSAnZmlyc3QtdGFiYmFibGUnO1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHRoZSBkcmF3ZXIgc2hvdWxkIHJlc3RvcmUgZm9jdXMgdG8gdGhlXG4gICAqIHByZXZpb3VzbHktZm9jdXNlZCBlbGVtZW50LCBhZnRlciBpdCdzIGNsb3NlZC5cbiAgICovXG4gIHJlc3RvcmVGb2N1cz86IGJvb2xlYW4gPSB0cnVlO1xuXG4gIC8qKiBTY3JvbGwgc3RyYXRlZ3kgdG8gYmUgdXNlZCBmb3IgdGhlIGRyYXdlci4gKi9cbiAgc2Nyb2xsU3RyYXRlZ3k/OiBTY3JvbGxTdHJhdGVneTtcblxuICAvKiogUG9zaXRpb24gb2YgdGhlIGRyYXdlciAqL1xuICBwb3NpdGlvbj86IERyYXdlclBvc2l0aW9uID0gJ3JpZ2h0JztcblxuICAvKiogV2lkdGggb2YgdGhlIGRyYXdlci4gSWYgYSBudW1iZXIgaXMgcHJvdmlkZWQsIGFzc3VtZXMgcGl4ZWwgdW5pdHMuICovXG4gIHdpZHRoPzogbnVtYmVyIHwgc3RyaW5nO1xuXG4gIC8qKiBIZWlnaHQgb2YgdGhlIGRyYXdlci4gSWYgYSBudW1iZXIgaXMgcHJvdmlkZWQsIGFzc3VtZXMgcGl4ZWwgdW5pdHMuICovXG4gIGhlaWdodD86IG51bWJlciB8IHN0cmluZztcblxuICAvKiogTWluLXdpZHRoIG9mIHRoZSBkcmF3ZXIuIElmIGEgbnVtYmVyIGlzIHByb3ZpZGVkLCBhc3N1bWVzIHBpeGVsIHVuaXRzLiAqL1xuICBtaW5XaWR0aD86IG51bWJlciB8IHN0cmluZztcblxuICAvKiogTWluLWhlaWdodCBvZiB0aGUgZHJhd2VyLiBJZiBhIG51bWJlciBpcyBwcm92aWRlZCwgYXNzdW1lcyBwaXhlbCB1bml0cy4gKi9cbiAgbWluSGVpZ2h0PzogbnVtYmVyIHwgc3RyaW5nO1xuXG4gIC8qKiBNYXgtd2lkdGggb2YgdGhlIGRyYXdlci4gSWYgYSBudW1iZXIgaXMgcHJvdmlkZWQsIGFzc3VtZXMgcGl4ZWwgdW5pdHMuICovXG4gIG1heFdpZHRoPzogbnVtYmVyIHwgc3RyaW5nO1xuXG4gIC8qKiBNYXgtaGVpZ2h0IG9mIHRoZSBkcmF3ZXIuIElmIGEgbnVtYmVyIGlzIHByb3ZpZGVkLCBhc3N1bWVzIHBpeGVsIHVuaXRzLiAqL1xuICBtYXhIZWlnaHQ/OiBudW1iZXIgfCBzdHJpbmc7XG59XG4iXX0=