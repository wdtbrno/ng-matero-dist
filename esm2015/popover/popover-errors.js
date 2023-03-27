/**
 * Throws an exception for the case when popover trigger doesn't have a valid mtx-popover instance
 */
export function throwMtxPopoverMissingError() {
    throw Error(`mtx-popover-trigger: must pass in an mtx-popover instance.

    Example:
      <mtx-popover #popover="mtxPopover"></mtx-popover>
      <button [mtxPopoverTriggerFor]="popover"></button>`);
}
/**
 * Throws an exception for the case when popover's mtxPopoverPosition[0] value isn't valid.
 * In other words, it doesn't match 'above', 'below', 'before' or 'after'.
 */
export function throwMtxPopoverInvalidPositionStart() {
    throw Error(`mtxPopoverPosition[0] value must be either 'above', 'below', 'before' or 'after'.
    Example: <mtx-popover [position]="['below', 'after']" #popover="mtxPopover"></mtx-popover>`);
}
/**
 * Throws an exception for the case when popover's mtxPopoverPosition[1] value isn't valid.
 * In other words, it doesn't match 'above', 'below', 'before', 'after' or 'center'.
 */
export function throwMtxPopoverInvalidPositionEnd() {
    throw Error(`mtxPopoverPosition[1] value must be either 'above', 'below', 'before', 'after' or 'center'.
    Example: <mtx-popover [position]="['below', 'after']" #popover="mtxPopover"></mtx-popover>`);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9wb3Zlci1lcnJvcnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wcm9qZWN0cy9leHRlbnNpb25zL3BvcG92ZXIvcG9wb3Zlci1lcnJvcnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7O0dBRUc7QUFDSCxNQUFNLFVBQVUsMkJBQTJCO0lBQ3pDLE1BQU0sS0FBSyxDQUFDOzs7O3lEQUkyQyxDQUFDLENBQUM7QUFDM0QsQ0FBQztBQUVEOzs7R0FHRztBQUNILE1BQU0sVUFBVSxtQ0FBbUM7SUFDakQsTUFBTSxLQUFLLENBQUM7K0ZBQ2lGLENBQUMsQ0FBQztBQUNqRyxDQUFDO0FBRUQ7OztHQUdHO0FBQ0gsTUFBTSxVQUFVLGlDQUFpQztJQUMvQyxNQUFNLEtBQUssQ0FBQzsrRkFDaUYsQ0FBQyxDQUFDO0FBQ2pHLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFRocm93cyBhbiBleGNlcHRpb24gZm9yIHRoZSBjYXNlIHdoZW4gcG9wb3ZlciB0cmlnZ2VyIGRvZXNuJ3QgaGF2ZSBhIHZhbGlkIG10eC1wb3BvdmVyIGluc3RhbmNlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB0aHJvd010eFBvcG92ZXJNaXNzaW5nRXJyb3IoKSB7XG4gIHRocm93IEVycm9yKGBtdHgtcG9wb3Zlci10cmlnZ2VyOiBtdXN0IHBhc3MgaW4gYW4gbXR4LXBvcG92ZXIgaW5zdGFuY2UuXG5cbiAgICBFeGFtcGxlOlxuICAgICAgPG10eC1wb3BvdmVyICNwb3BvdmVyPVwibXR4UG9wb3ZlclwiPjwvbXR4LXBvcG92ZXI+XG4gICAgICA8YnV0dG9uIFttdHhQb3BvdmVyVHJpZ2dlckZvcl09XCJwb3BvdmVyXCI+PC9idXR0b24+YCk7XG59XG5cbi8qKlxuICogVGhyb3dzIGFuIGV4Y2VwdGlvbiBmb3IgdGhlIGNhc2Ugd2hlbiBwb3BvdmVyJ3MgbXR4UG9wb3ZlclBvc2l0aW9uWzBdIHZhbHVlIGlzbid0IHZhbGlkLlxuICogSW4gb3RoZXIgd29yZHMsIGl0IGRvZXNuJ3QgbWF0Y2ggJ2Fib3ZlJywgJ2JlbG93JywgJ2JlZm9yZScgb3IgJ2FmdGVyJy5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHRocm93TXR4UG9wb3ZlckludmFsaWRQb3NpdGlvblN0YXJ0KCkge1xuICB0aHJvdyBFcnJvcihgbXR4UG9wb3ZlclBvc2l0aW9uWzBdIHZhbHVlIG11c3QgYmUgZWl0aGVyICdhYm92ZScsICdiZWxvdycsICdiZWZvcmUnIG9yICdhZnRlcicuXG4gICAgRXhhbXBsZTogPG10eC1wb3BvdmVyIFtwb3NpdGlvbl09XCJbJ2JlbG93JywgJ2FmdGVyJ11cIiAjcG9wb3Zlcj1cIm10eFBvcG92ZXJcIj48L210eC1wb3BvdmVyPmApO1xufVxuXG4vKipcbiAqIFRocm93cyBhbiBleGNlcHRpb24gZm9yIHRoZSBjYXNlIHdoZW4gcG9wb3ZlcidzIG10eFBvcG92ZXJQb3NpdGlvblsxXSB2YWx1ZSBpc24ndCB2YWxpZC5cbiAqIEluIG90aGVyIHdvcmRzLCBpdCBkb2Vzbid0IG1hdGNoICdhYm92ZScsICdiZWxvdycsICdiZWZvcmUnLCAnYWZ0ZXInIG9yICdjZW50ZXInLlxuICovXG5leHBvcnQgZnVuY3Rpb24gdGhyb3dNdHhQb3BvdmVySW52YWxpZFBvc2l0aW9uRW5kKCkge1xuICB0aHJvdyBFcnJvcihgbXR4UG9wb3ZlclBvc2l0aW9uWzFdIHZhbHVlIG11c3QgYmUgZWl0aGVyICdhYm92ZScsICdiZWxvdycsICdiZWZvcmUnLCAnYWZ0ZXInIG9yICdjZW50ZXInLlxuICAgIEV4YW1wbGU6IDxtdHgtcG9wb3ZlciBbcG9zaXRpb25dPVwiWydiZWxvdycsICdhZnRlciddXCIgI3BvcG92ZXI9XCJtdHhQb3BvdmVyXCI+PC9tdHgtcG9wb3Zlcj5gKTtcbn1cbiJdfQ==