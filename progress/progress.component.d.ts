import { BooleanInput } from '@angular/cdk/coercion';
export declare type MtxProgressType = 'default' | 'info' | 'success' | 'warning' | 'danger';
export declare class MtxProgressComponent {
    /** The progress type */
    type: MtxProgressType;
    /** The progress value */
    value: number;
    /** The progress height */
    height: string;
    /** The progress text color */
    color: string;
    /** The progress bar color */
    foreground: string;
    /** The progress track color */
    background: string;
    /** Whether applies striped class */
    get striped(): boolean;
    set striped(value: boolean);
    private _striped;
    /** Whether applies animated class */
    get animate(): boolean;
    set animate(value: boolean);
    private _animate;
    static ngAcceptInputType_striped: BooleanInput;
    static ngAcceptInputType_animate: BooleanInput;
}
