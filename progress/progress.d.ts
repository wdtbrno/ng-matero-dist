import { BooleanInput } from '@angular/cdk/coercion';
import * as i0 from "@angular/core";
export type MtxProgressType = 'default' | 'info' | 'success' | 'warning' | 'danger';
export declare class MtxProgress {
    /** The progress's type. Can be `default`, `info`, `success`, `warning` or `danger`. */
    type: MtxProgressType;
    /** The value of the progress. */
    value: number;
    /** The height of the progress. */
    height: string;
    /** The text color of the progress. */
    color: string;
    /** The bar color of the progress. */
    foreground: string;
    /** The track color of the progress. */
    background: string;
    /** Whether to apply the striped class. */
    get striped(): boolean;
    set striped(value: boolean);
    private _striped;
    /** Whether to apply the animated class. */
    get animate(): boolean;
    set animate(value: boolean);
    private _animate;
    static ngAcceptInputType_striped: BooleanInput;
    static ngAcceptInputType_animate: BooleanInput;
    static ɵfac: i0.ɵɵFactoryDeclaration<MtxProgress, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MtxProgress, "mtx-progress", ["mtxProgress"], { "type": "type"; "value": "value"; "height": "height"; "color": "color"; "foreground": "foreground"; "background": "background"; "striped": "striped"; "animate": "animate"; }, {}, never, ["*"], false, never>;
}
