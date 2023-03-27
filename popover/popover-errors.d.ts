/**
 * Throws an exception for the case when popover trigger doesn't have a valid mtx-popover instance
 */
export declare function throwMtxPopoverMissingError(): void;
/**
 * Throws an exception for the case when popover's mtxPopoverPosition[0] value isn't valid.
 * In other words, it doesn't match 'above', 'below', 'before' or 'after'.
 */
export declare function throwMtxPopoverInvalidPositionStart(): void;
/**
 * Throws an exception for the case when popover's mtxPopoverPosition[1] value isn't valid.
 * In other words, it doesn't match 'above', 'below', 'before', 'after' or 'center'.
 */
export declare function throwMtxPopoverInvalidPositionEnd(): void;
