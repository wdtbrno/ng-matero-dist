(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/common'), require('rxjs'), require('rxjs/operators')) :
    typeof define === 'function' && define.amd ? define('@ng-matero/extensions/split-pane', ['exports', '@angular/core', '@angular/common', 'rxjs', 'rxjs/operators'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory((global['ng-matero'] = global['ng-matero'] || {}, global['ng-matero'].extensions = global['ng-matero'].extensions || {}, global['ng-matero'].extensions['split-pane'] = {}), global.ng.core, global.ng.common, global.rxjs, global.rxjs.operators));
}(this, (function (exports, core, common, rxjs, operators) { 'use strict';

    function getPointFromEvent(event) {
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
    function getElementPixelSize(elRef, direction) {
        var rect = elRef.nativeElement.getBoundingClientRect();
        return direction === 'horizontal' ? rect.width : rect.height;
    }
    function getInputBoolean(v) {
        return typeof v === 'boolean' ? v : v === 'false' ? false : true;
    }
    function getInputPositiveNumber(v, defaultValue) {
        if (v === null || v === undefined) {
            return defaultValue;
        }
        v = Number(v);
        return !isNaN(v) && v >= 0 ? v : defaultValue;
    }
    function isUserSizesValid(unit, sizes) {
        // All sizes have to be not null and total should be 100
        if (unit === 'percent') {
            var total = sizes.reduce(function (_total, s) { return (s !== null ? _total + s : _total); }, 0);
            return sizes.every(function (s) { return s !== null; }) && total && total > 99.9 && total < 100.1;
        }
        // A size at null is mandatory but only one.
        if (unit === 'pixel') {
            return sizes.filter(function (s) { return s === null; }).length === 1;
        }
    }
    function getAreaMinSize(a) {
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
    function getAreaMaxSize(a) {
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
    function getGutterSideAbsorptionCapacity(unit, sideAreas, pixels, allAreasSizePixel) {
        return sideAreas.reduce(function (acc, area) {
            var res = getAreaAbsorptionCapacity(unit, area, acc.remain, allAreasSizePixel);
            acc.list.push(res);
            acc.remain = res && res.pixelRemain;
            return acc;
        }, { remain: pixels, list: [] });
    }
    function getAreaAbsorptionCapacity(unit, areaSnapshot, pixels, allAreasSizePixel) {
        // No pain no gain
        if (pixels === 0) {
            return {
                areaSnapshot: areaSnapshot,
                pixelAbsorb: 0,
                percentAfterAbsorption: areaSnapshot.sizePercentAtStart,
                pixelRemain: 0,
            };
        }
        // Area start at zero and need to be reduced, not possible
        if (areaSnapshot.sizePixelAtStart === 0 && pixels < 0) {
            return {
                areaSnapshot: areaSnapshot,
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
        var tempPixelSize = areaSnapshot.sizePixelAtStart + pixels;
        var tempPercentSize = (tempPixelSize / allAreasSizePixel) * 100;
        // ENLARGE AREA
        if (pixels > 0) {
            // If maxSize & newSize bigger than it > absorb to max and return remaining pixels
            if (areaSnapshot.area.maxSize !== null && tempPercentSize > areaSnapshot.area.maxSize) {
                // Use area.area.maxSize as newPercentSize and return calculate pixels remaining
                var maxSizePixel = (areaSnapshot.area.maxSize / 100) * allAreasSizePixel;
                return {
                    areaSnapshot: areaSnapshot,
                    pixelAbsorb: maxSizePixel,
                    percentAfterAbsorption: areaSnapshot.area.maxSize,
                    pixelRemain: areaSnapshot.sizePixelAtStart + pixels - maxSizePixel,
                };
            }
            return {
                areaSnapshot: areaSnapshot,
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
                var minSizePixel = (areaSnapshot.area.minSize / 100) * allAreasSizePixel;
                return {
                    areaSnapshot: areaSnapshot,
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
                    areaSnapshot: areaSnapshot,
                    pixelAbsorb: -areaSnapshot.sizePixelAtStart,
                    percentAfterAbsorption: 0,
                    pixelRemain: pixels + areaSnapshot.sizePixelAtStart,
                };
            }
            return {
                areaSnapshot: areaSnapshot,
                pixelAbsorb: pixels,
                percentAfterAbsorption: tempPercentSize,
                pixelRemain: 0,
            };
        }
    }
    function getAreaAbsorptionCapacityPixel(areaSnapshot, pixels, containerSizePixel) {
        var tempPixelSize = areaSnapshot.sizePixelAtStart + pixels;
        // ENLARGE AREA
        if (pixels > 0) {
            // If maxSize & newSize bigger than it > absorb to max and return remaining pixels
            if (areaSnapshot.area.maxSize !== null && tempPixelSize > areaSnapshot.area.maxSize) {
                return {
                    areaSnapshot: areaSnapshot,
                    pixelAbsorb: areaSnapshot.area.maxSize - areaSnapshot.sizePixelAtStart,
                    percentAfterAbsorption: -1,
                    pixelRemain: tempPixelSize - areaSnapshot.area.maxSize,
                };
            }
            return {
                areaSnapshot: areaSnapshot,
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
                    areaSnapshot: areaSnapshot,
                    pixelAbsorb: areaSnapshot.area.minSize + pixels - tempPixelSize,
                    percentAfterAbsorption: -1,
                    pixelRemain: tempPixelSize - areaSnapshot.area.minSize,
                };
            }
            // If reduced under zero > return remaining pixels
            // tslint:disable-next-line: one-line
            else if (tempPixelSize < 0) {
                return {
                    areaSnapshot: areaSnapshot,
                    pixelAbsorb: -areaSnapshot.sizePixelAtStart,
                    percentAfterAbsorption: -1,
                    pixelRemain: pixels + areaSnapshot.sizePixelAtStart,
                };
            }
            return {
                areaSnapshot: areaSnapshot,
                pixelAbsorb: pixels,
                percentAfterAbsorption: -1,
                pixelRemain: 0,
            };
        }
    }
    function updateAreaSize(unit, item) {
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

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */
    /* global Reflect, Promise */
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b)
                if (Object.prototype.hasOwnProperty.call(b, p))
                    d[p] = b[p]; };
        return extendStatics(d, b);
    };
    function __extends(d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }
    var __assign = function () {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s)
                    if (Object.prototype.hasOwnProperty.call(s, p))
                        t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };
    function __rest(s, e) {
        var t = {};
        for (var p in s)
            if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
                t[p] = s[p];
        if (s != null && typeof Object.getOwnPropertySymbols === "function")
            for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
                if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                    t[p[i]] = s[p[i]];
            }
        return t;
    }
    function __decorate(decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
            r = Reflect.decorate(decorators, target, key, desc);
        else
            for (var i = decorators.length - 1; i >= 0; i--)
                if (d = decorators[i])
                    r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    }
    function __param(paramIndex, decorator) {
        return function (target, key) { decorator(target, key, paramIndex); };
    }
    function __metadata(metadataKey, metadataValue) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function")
            return Reflect.metadata(metadataKey, metadataValue);
    }
    function __awaiter(thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try {
                step(generator.next(value));
            }
            catch (e) {
                reject(e);
            } }
            function rejected(value) { try {
                step(generator["throw"](value));
            }
            catch (e) {
                reject(e);
            } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }
    function __generator(thisArg, body) {
        var _ = { label: 0, sent: function () { if (t[0] & 1)
                throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function () { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f)
                throw new TypeError("Generator is already executing.");
            while (_)
                try {
                    if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done)
                        return t;
                    if (y = 0, t)
                        op = [op[0] & 2, t.value];
                    switch (op[0]) {
                        case 0:
                        case 1:
                            t = op;
                            break;
                        case 4:
                            _.label++;
                            return { value: op[1], done: false };
                        case 5:
                            _.label++;
                            y = op[1];
                            op = [0];
                            continue;
                        case 7:
                            op = _.ops.pop();
                            _.trys.pop();
                            continue;
                        default:
                            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                                _ = 0;
                                continue;
                            }
                            if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                                _.label = op[1];
                                break;
                            }
                            if (op[0] === 6 && _.label < t[1]) {
                                _.label = t[1];
                                t = op;
                                break;
                            }
                            if (t && _.label < t[2]) {
                                _.label = t[2];
                                _.ops.push(op);
                                break;
                            }
                            if (t[2])
                                _.ops.pop();
                            _.trys.pop();
                            continue;
                    }
                    op = body.call(thisArg, _);
                }
                catch (e) {
                    op = [6, e];
                    y = 0;
                }
                finally {
                    f = t = 0;
                }
            if (op[0] & 5)
                throw op[1];
            return { value: op[0] ? op[1] : void 0, done: true };
        }
    }
    var __createBinding = Object.create ? (function (o, m, k, k2) {
        if (k2 === undefined)
            k2 = k;
        Object.defineProperty(o, k2, { enumerable: true, get: function () { return m[k]; } });
    }) : (function (o, m, k, k2) {
        if (k2 === undefined)
            k2 = k;
        o[k2] = m[k];
    });
    function __exportStar(m, o) {
        for (var p in m)
            if (p !== "default" && !Object.prototype.hasOwnProperty.call(o, p))
                __createBinding(o, m, p);
    }
    function __values(o) {
        var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
        if (m)
            return m.call(o);
        if (o && typeof o.length === "number")
            return {
                next: function () {
                    if (o && i >= o.length)
                        o = void 0;
                    return { value: o && o[i++], done: !o };
                }
            };
        throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
    }
    function __read(o, n) {
        var m = typeof Symbol === "function" && o[Symbol.iterator];
        if (!m)
            return o;
        var i = m.call(o), r, ar = [], e;
        try {
            while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
                ar.push(r.value);
        }
        catch (error) {
            e = { error: error };
        }
        finally {
            try {
                if (r && !r.done && (m = i["return"]))
                    m.call(i);
            }
            finally {
                if (e)
                    throw e.error;
            }
        }
        return ar;
    }
    /** @deprecated */
    function __spread() {
        for (var ar = [], i = 0; i < arguments.length; i++)
            ar = ar.concat(__read(arguments[i]));
        return ar;
    }
    /** @deprecated */
    function __spreadArrays() {
        for (var s = 0, i = 0, il = arguments.length; i < il; i++)
            s += arguments[i].length;
        for (var r = Array(s), k = 0, i = 0; i < il; i++)
            for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
                r[k] = a[j];
        return r;
    }
    function __spreadArray(to, from) {
        for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
            to[j] = from[i];
        return to;
    }
    function __await(v) {
        return this instanceof __await ? (this.v = v, this) : new __await(v);
    }
    function __asyncGenerator(thisArg, _arguments, generator) {
        if (!Symbol.asyncIterator)
            throw new TypeError("Symbol.asyncIterator is not defined.");
        var g = generator.apply(thisArg, _arguments || []), i, q = [];
        return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
        function verb(n) { if (g[n])
            i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
        function resume(n, v) { try {
            step(g[n](v));
        }
        catch (e) {
            settle(q[0][3], e);
        } }
        function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
        function fulfill(value) { resume("next", value); }
        function reject(value) { resume("throw", value); }
        function settle(f, v) { if (f(v), q.shift(), q.length)
            resume(q[0][0], q[0][1]); }
    }
    function __asyncDelegator(o) {
        var i, p;
        return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
        function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; } : f; }
    }
    function __asyncValues(o) {
        if (!Symbol.asyncIterator)
            throw new TypeError("Symbol.asyncIterator is not defined.");
        var m = o[Symbol.asyncIterator], i;
        return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
        function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
        function settle(resolve, reject, d, v) { Promise.resolve(v).then(function (v) { resolve({ value: v, done: d }); }, reject); }
    }
    function __makeTemplateObject(cooked, raw) {
        if (Object.defineProperty) {
            Object.defineProperty(cooked, "raw", { value: raw });
        }
        else {
            cooked.raw = raw;
        }
        return cooked;
    }
    ;
    var __setModuleDefault = Object.create ? (function (o, v) {
        Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function (o, v) {
        o["default"] = v;
    };
    function __importStar(mod) {
        if (mod && mod.__esModule)
            return mod;
        var result = {};
        if (mod != null)
            for (var k in mod)
                if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k))
                    __createBinding(result, mod, k);
        __setModuleDefault(result, mod);
        return result;
    }
    function __importDefault(mod) {
        return (mod && mod.__esModule) ? mod : { default: mod };
    }
    function __classPrivateFieldGet(receiver, state, kind, f) {
        if (kind === "a" && !f)
            throw new TypeError("Private accessor was defined without a getter");
        if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
            throw new TypeError("Cannot read private member from an object whose class did not declare it");
        return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
    }
    function __classPrivateFieldSet(receiver, state, value, kind, f) {
        if (kind === "m")
            throw new TypeError("Private method is not writable");
        if (kind === "a" && !f)
            throw new TypeError("Private accessor was defined without a setter");
        if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
            throw new TypeError("Cannot write private member to an object whose class did not declare it");
        return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
    }

    /**
     * mtx-split
     *
     *
     *  PERCENT MODE ([unit]="'percent'")
     *  ___________________________________________________________________________________________
     * |       A       [g1]       B       [g2]       C       [g3]       D       [g4]       E       |
     * |-------------------------------------------------------------------------------------------|
     * |       20                 30                 20                 15                 15      | <-- [size]="x"
     * |               10px               10px               10px               10px               | <-- [gutterSize]="10"
     * |calc(20% - 8px)    calc(30% - 12px)   calc(20% - 8px)    calc(15% - 6px)    calc(15% - 6px)| <-- CSS flex-basis property (with flex-grow&shrink at 0)
     * |     152px              228px              152px              114px              114px     | <-- el.getBoundingClientRect().width
     * |___________________________________________________________________________________________|
     *                                                                                 800px         <-- el.getBoundingClientRect().width
     *  flex-basis = calc( { area.size }% - { area.size/100 * nbGutter*gutterSize }px );
     *
     *
     *  PIXEL MODE ([unit]="'pixel'")
     *  ___________________________________________________________________________________________
     * |       A       [g1]       B       [g2]       C       [g3]       D       [g4]       E       |
     * |-------------------------------------------------------------------------------------------|
     * |      100                250                 *                 150                100      | <-- [size]="y"
     * |               10px               10px               10px               10px               | <-- [gutterSize]="10"
     * |   0 0 100px          0 0 250px           1 1 auto          0 0 150px          0 0 100px   | <-- CSS flex property (flex-grow/flex-shrink/flex-basis)
     * |     100px              250px              200px              150px              100px     | <-- el.getBoundingClientRect().width
     * |___________________________________________________________________________________________|
     *                                                                                 800px         <-- el.getBoundingClientRect().width
     *
     */
    var MtxSplitComponent = /** @class */ (function () {
        function MtxSplitComponent(ngZone, elRef, cdRef, renderer) {
            this.ngZone = ngZone;
            this.elRef = elRef;
            this.cdRef = cdRef;
            this.renderer = renderer;
            this._direction = 'horizontal';
            ////
            this._unit = 'percent';
            ////
            this._gutterSize = 1;
            ////
            this._gutterStep = 1;
            ////
            this._restrictMove = false;
            ////
            this._useTransition = false;
            ////
            this._disabled = false;
            ////
            this._dir = 'ltr';
            ////
            this._gutterDblClickDuration = 0;
            ////
            this.dragStart = new core.EventEmitter(false);
            this.dragEnd = new core.EventEmitter(false);
            this.gutterClick = new core.EventEmitter(false);
            this.gutterDblClick = new core.EventEmitter(false);
            this.dragProgressSubject = new rxjs.Subject();
            this.dragProgress$ = this.dragProgressSubject.asObservable();
            ////
            this.isDragging = false;
            this.dragListeners = [];
            this.snapshot = null;
            this.startPoint = null;
            this.endPoint = null;
            this.displayedAreas = [];
            this.hidedAreas = [];
            this._clickTimeout = null;
            // To force adding default class, could be override by user @Input() or not
            this.direction = this._direction;
        }
        Object.defineProperty(MtxSplitComponent.prototype, "direction", {
            get: function () {
                return this._direction;
            },
            set: function (v) {
                this._direction = v === 'vertical' ? 'vertical' : 'horizontal';
                this.renderer.addClass(this.elRef.nativeElement, "mtx-split-" + this._direction);
                this.renderer.removeClass(this.elRef.nativeElement, "mtx-split-" + (this._direction === 'vertical' ? 'horizontal' : 'vertical'));
                this.build(false, false);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MtxSplitComponent.prototype, "unit", {
            get: function () {
                return this._unit;
            },
            set: function (v) {
                this._unit = v === 'pixel' ? 'pixel' : 'percent';
                this.renderer.addClass(this.elRef.nativeElement, "mtx-split-" + this._unit);
                this.renderer.removeClass(this.elRef.nativeElement, "mtx-split-" + (this._unit === 'pixel' ? 'percent' : 'pixel'));
                this.build(false, true);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MtxSplitComponent.prototype, "gutterSize", {
            get: function () {
                return this._gutterSize;
            },
            set: function (v) {
                this._gutterSize = getInputPositiveNumber(v, 11);
                this.build(false, false);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MtxSplitComponent.prototype, "gutterStep", {
            get: function () {
                return this._gutterStep;
            },
            set: function (v) {
                this._gutterStep = getInputPositiveNumber(v, 1);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MtxSplitComponent.prototype, "restrictMove", {
            get: function () {
                return this._restrictMove;
            },
            set: function (v) {
                this._restrictMove = getInputBoolean(v);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MtxSplitComponent.prototype, "useTransition", {
            get: function () {
                return this._useTransition;
            },
            set: function (v) {
                this._useTransition = getInputBoolean(v);
                if (this._useTransition) {
                    this.renderer.addClass(this.elRef.nativeElement, 'mtx-split-transition');
                }
                else {
                    this.renderer.removeClass(this.elRef.nativeElement, 'mtx-split-transition');
                }
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MtxSplitComponent.prototype, "disabled", {
            get: function () {
                return this._disabled;
            },
            set: function (v) {
                this._disabled = getInputBoolean(v);
                if (this._disabled) {
                    this.renderer.addClass(this.elRef.nativeElement, 'mtx-split-disabled');
                }
                else {
                    this.renderer.removeClass(this.elRef.nativeElement, 'mtx-split-disabled');
                }
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MtxSplitComponent.prototype, "dir", {
            get: function () {
                return this._dir;
            },
            set: function (v) {
                this._dir = v === 'rtl' ? 'rtl' : 'ltr';
                this.renderer.setAttribute(this.elRef.nativeElement, 'dir', this._dir);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MtxSplitComponent.prototype, "gutterDblClickDuration", {
            get: function () {
                return this._gutterDblClickDuration;
            },
            set: function (v) {
                this._gutterDblClickDuration = getInputPositiveNumber(v, 0);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MtxSplitComponent.prototype, "transitionEnd", {
            get: function () {
                var _this = this;
                return new rxjs.Observable(function (subscriber) { return (_this.transitionEndSubscriber = subscriber); }).pipe(operators.debounceTime(20));
            },
            enumerable: false,
            configurable: true
        });
        MtxSplitComponent.prototype.ngAfterViewInit = function () {
            var _this = this;
            this.ngZone.runOutsideAngular(function () {
                // To avoid transition at first rendering
                setTimeout(function () { return _this.renderer.addClass(_this.elRef.nativeElement, 'mtx-split-init'); });
            });
        };
        MtxSplitComponent.prototype.getNbGutters = function () {
            return this.displayedAreas.length === 0 ? 0 : this.displayedAreas.length - 1;
        };
        MtxSplitComponent.prototype.addArea = function (component) {
            var newArea = {
                component: component,
                order: 0,
                size: 0,
                minSize: null,
                maxSize: null,
            };
            if (component.visible === true) {
                this.displayedAreas.push(newArea);
                this.build(true, true);
            }
            else {
                this.hidedAreas.push(newArea);
            }
        };
        MtxSplitComponent.prototype.removeArea = function (component) {
            if (this.displayedAreas.some(function (a) { return a.component === component; })) {
                var area = this.displayedAreas.find(function (a) { return a.component === component; });
                this.displayedAreas.splice(this.displayedAreas.indexOf(area), 1);
                this.build(true, true);
            }
            else if (this.hidedAreas.some(function (a) { return a.component === component; })) {
                var area = this.hidedAreas.find(function (a) { return a.component === component; });
                this.hidedAreas.splice(this.hidedAreas.indexOf(area), 1);
            }
        };
        MtxSplitComponent.prototype.updateArea = function (component, resetOrders, resetSizes) {
            if (component.visible === true) {
                this.build(resetOrders, resetSizes);
            }
        };
        MtxSplitComponent.prototype.showArea = function (component) {
            var _a;
            var area = this.hidedAreas.find(function (a) { return a.component === component; });
            if (area === undefined) {
                return;
            }
            var areas = this.hidedAreas.splice(this.hidedAreas.indexOf(area), 1);
            (_a = this.displayedAreas).push.apply(_a, __spread(areas));
            this.build(true, true);
        };
        MtxSplitComponent.prototype.hideArea = function (comp) {
            var _a;
            var area = this.displayedAreas.find(function (a) { return a.component === comp; });
            if (area === undefined) {
                return;
            }
            var areas = this.displayedAreas.splice(this.displayedAreas.indexOf(area), 1);
            areas.forEach(function (_area) {
                _area.order = 0;
                _area.size = 0;
            });
            (_a = this.hidedAreas).push.apply(_a, __spread(areas));
            this.build(true, true);
        };
        MtxSplitComponent.prototype.getVisibleAreaSizes = function () {
            return this.displayedAreas.map(function (a) { return (a.size === null ? '*' : a.size); });
        };
        MtxSplitComponent.prototype.setVisibleAreaSizes = function (sizes) {
            if (sizes.length !== this.displayedAreas.length) {
                return false;
            }
            var formatedSizes = sizes.map(function (s) { return getInputPositiveNumber(s, null); });
            var isValid = isUserSizesValid(this.unit, formatedSizes);
            if (isValid === false) {
                return false;
            }
            // @ts-ignore
            this.displayedAreas.forEach(function (area, i) { return (area.component._size = formatedSizes[i]); });
            this.build(false, true);
            return true;
        };
        MtxSplitComponent.prototype.build = function (resetOrders, resetSizes) {
            this.stopDragging();
            // ¤ AREAS ORDER
            if (resetOrders === true) {
                // If user provided 'order' for each area, use it to sort them.
                if (this.displayedAreas.every(function (a) { return a.component.order !== null; })) {
                    this.displayedAreas.sort(function (a, b) { return (a.component.order - b.component.order); });
                }
                // Then set real order with multiples of 2, numbers between will be used by gutters.
                this.displayedAreas.forEach(function (area, i) {
                    area.order = i * 2;
                    area.component.setStyleOrder(area.order);
                });
            }
            // ¤ AREAS SIZE
            if (resetSizes === true) {
                var useUserSizes_1 = isUserSizesValid(this.unit, this.displayedAreas.map(function (a) { return a.component.size; }));
                switch (this.unit) {
                    case 'percent': {
                        var defaultSize_1 = 100 / this.displayedAreas.length;
                        this.displayedAreas.forEach(function (area) {
                            area.size = useUserSizes_1 ? area.component.size : defaultSize_1;
                            area.minSize = getAreaMinSize(area);
                            area.maxSize = getAreaMaxSize(area);
                        });
                        break;
                    }
                    case 'pixel': {
                        if (useUserSizes_1) {
                            this.displayedAreas.forEach(function (area) {
                                area.size = area.component.size;
                                area.minSize = getAreaMinSize(area);
                                area.maxSize = getAreaMaxSize(area);
                            });
                        }
                        else {
                            var wildcardSizeAreas = this.displayedAreas.filter(function (a) { return a.component.size === null; });
                            // No wildcard area > Need to select one arbitrarily > first
                            if (wildcardSizeAreas.length === 0 && this.displayedAreas.length > 0) {
                                this.displayedAreas.forEach(function (area, i) {
                                    area.size = i === 0 ? null : area.component.size;
                                    area.minSize = i === 0 ? null : getAreaMinSize(area);
                                    area.maxSize = i === 0 ? null : getAreaMaxSize(area);
                                });
                            }
                            // More than one wildcard area > Need to keep only one arbitrarly > first
                            // tslint:disable-next-line: one-line
                            else if (wildcardSizeAreas.length > 1) {
                                var alreadyGotOne_1 = false;
                                this.displayedAreas.forEach(function (area) {
                                    if (area.component.size === null) {
                                        if (alreadyGotOne_1 === false) {
                                            area.size = null;
                                            area.minSize = null;
                                            area.maxSize = null;
                                            alreadyGotOne_1 = true;
                                        }
                                        else {
                                            area.size = 100;
                                            area.minSize = null;
                                            area.maxSize = null;
                                        }
                                    }
                                    else {
                                        area.size = area.component.size;
                                        area.minSize = getAreaMinSize(area);
                                        area.maxSize = getAreaMaxSize(area);
                                    }
                                });
                            }
                        }
                        break;
                    }
                }
            }
            this.refreshStyleSizes();
            this.cdRef.markForCheck();
        };
        MtxSplitComponent.prototype.refreshStyleSizes = function () {
            var _this = this;
            ///////////////////////////////////////////
            // PERCENT MODE
            if (this.unit === 'percent') {
                // Only one area > flex-basis 100%
                if (this.displayedAreas.length === 1) {
                    this.displayedAreas[0].component.setStyleFlex(0, 0, "100%", false, false);
                }
                // Multiple areas > use each percent basis
                // tslint:disable-next-line: one-line
                else {
                    var sumGutterSize_1 = this.getNbGutters() * this.gutterSize;
                    this.displayedAreas.forEach(function (area) {
                        area.component.setStyleFlex(0, 0, "calc( " + area.size + "% - " + (area.size / 100) * sumGutterSize_1 + "px )", area.minSize !== null && area.minSize === area.size ? true : false, area.maxSize !== null && area.maxSize === area.size ? true : false);
                    });
                }
            }
            ///////////////////////////////////////////
            // PIXEL MODE
            // tslint:disable-next-line: one-line
            else if (this.unit === 'pixel') {
                this.displayedAreas.forEach(function (area) {
                    // Area with wildcard size
                    if (area.size === null) {
                        if (_this.displayedAreas.length === 1) {
                            area.component.setStyleFlex(1, 1, "100%", false, false);
                        }
                        else {
                            area.component.setStyleFlex(1, 1, "auto", false, false);
                        }
                    }
                    // Area with pixel size
                    // tslint:disable-next-line: one-line
                    else {
                        // Only one area > flex-basis 100%
                        if (_this.displayedAreas.length === 1) {
                            area.component.setStyleFlex(0, 0, "100%", false, false);
                        }
                        // Multiple areas > use each pixel basis
                        // tslint:disable-next-line: one-line
                        else {
                            area.component.setStyleFlex(0, 0, area.size + "px", area.minSize !== null && area.minSize === area.size ? true : false, area.maxSize !== null && area.maxSize === area.size ? true : false);
                        }
                    }
                });
            }
        };
        MtxSplitComponent.prototype.clickGutter = function (event, gutterNum) {
            var _this = this;
            var tempPoint = getPointFromEvent(event);
            // Be sure mouseup/touchend happened at same point as mousedown/touchstart to trigger click/dblclick
            if (this.startPoint && this.startPoint.x === tempPoint.x && this.startPoint.y === tempPoint.y) {
                // If timeout in progress and new click > clearTimeout & dblClickEvent
                if (this._clickTimeout !== null) {
                    window.clearTimeout(this._clickTimeout);
                    this._clickTimeout = null;
                    this.notify('dblclick', gutterNum);
                    this.stopDragging();
                }
                // Else start timeout to call clickEvent at end
                // tslint:disable-next-line: one-line
                else {
                    this._clickTimeout = window.setTimeout(function () {
                        _this._clickTimeout = null;
                        _this.notify('click', gutterNum);
                        _this.stopDragging();
                    }, this.gutterDblClickDuration);
                }
            }
        };
        MtxSplitComponent.prototype.startDragging = function (event, gutterOrder, gutterNum) {
            var _this = this;
            event.preventDefault();
            event.stopPropagation();
            this.startPoint = getPointFromEvent(event);
            if (this.startPoint === null || this.disabled === true) {
                return;
            }
            this.snapshot = {
                gutterNum: gutterNum,
                lastSteppedOffset: 0,
                allAreasSizePixel: getElementPixelSize(this.elRef, this.direction) - this.getNbGutters() * this.gutterSize,
                allInvolvedAreasSizePercent: 100,
                areasBeforeGutter: [],
                areasAfterGutter: [],
            };
            this.displayedAreas.forEach(function (area) {
                var areaSnapshot = {
                    area: area,
                    sizePixelAtStart: getElementPixelSize(area.component.elRef, _this.direction),
                    sizePercentAtStart: (_this.unit === 'percent' ? area.size : -1),
                };
                if (area.order < gutterOrder) {
                    if (_this.restrictMove === true) {
                        _this.snapshot.areasBeforeGutter = [areaSnapshot];
                    }
                    else {
                        _this.snapshot.areasBeforeGutter.unshift(areaSnapshot);
                    }
                }
                else if (area.order > gutterOrder) {
                    if (_this.restrictMove === true) {
                        if (_this.snapshot.areasAfterGutter.length === 0) {
                            _this.snapshot.areasAfterGutter = [areaSnapshot];
                        }
                    }
                    else {
                        _this.snapshot.areasAfterGutter.push(areaSnapshot);
                    }
                }
            });
            this.snapshot.allInvolvedAreasSizePercent = __spread(this.snapshot.areasBeforeGutter, this.snapshot.areasAfterGutter).reduce(function (t, a) { return t + a.sizePercentAtStart; }, 0);
            if (this.snapshot.areasBeforeGutter.length === 0 ||
                this.snapshot.areasAfterGutter.length === 0) {
                return;
            }
            this.dragListeners.push(this.renderer.listen('document', 'mouseup', this.stopDragging.bind(this)));
            this.dragListeners.push(this.renderer.listen('document', 'touchend', this.stopDragging.bind(this)));
            this.dragListeners.push(this.renderer.listen('document', 'touchcancel', this.stopDragging.bind(this)));
            this.ngZone.runOutsideAngular(function () {
                _this.dragListeners.push(_this.renderer.listen('document', 'mousemove', _this.dragEvent.bind(_this)));
                _this.dragListeners.push(_this.renderer.listen('document', 'touchmove', _this.dragEvent.bind(_this)));
            });
            this.displayedAreas.forEach(function (area) { return area.component.lockEvents(); });
            this.isDragging = true;
            this.renderer.addClass(this.elRef.nativeElement, 'mtx-dragging');
            this.renderer.addClass(this.gutterEls.toArray()[this.snapshot.gutterNum - 1].nativeElement, 'mtx-dragged');
            this.notify('start', this.snapshot.gutterNum);
        };
        MtxSplitComponent.prototype.dragEvent = function (event) {
            var _this = this;
            event.preventDefault();
            event.stopPropagation();
            if (this._clickTimeout !== null) {
                window.clearTimeout(this._clickTimeout);
                this._clickTimeout = null;
            }
            if (this.isDragging === false) {
                return;
            }
            this.endPoint = getPointFromEvent(event);
            if (this.endPoint === null) {
                return;
            }
            // Calculate steppedOffset
            var offset = this.direction === 'horizontal'
                ? this.startPoint.x - this.endPoint.x
                : this.startPoint.y - this.endPoint.y;
            if (this.dir === 'rtl') {
                offset = -offset;
            }
            var steppedOffset = Math.round(offset / this.gutterStep) * this.gutterStep;
            if (steppedOffset === this.snapshot.lastSteppedOffset) {
                return;
            }
            this.snapshot.lastSteppedOffset = steppedOffset;
            // Need to know if each gutter side areas could reacts to steppedOffset
            var areasBefore = getGutterSideAbsorptionCapacity(this.unit, this.snapshot.areasBeforeGutter, -steppedOffset, this.snapshot.allAreasSizePixel);
            var areasAfter = getGutterSideAbsorptionCapacity(this.unit, this.snapshot.areasAfterGutter, steppedOffset, this.snapshot.allAreasSizePixel);
            // Each gutter side areas can't absorb all offset
            if (areasBefore.remain !== 0 && areasAfter.remain !== 0) {
                if (Math.abs(areasBefore.remain) === Math.abs(areasAfter.remain)) {
                }
                else if (Math.abs(areasBefore.remain) > Math.abs(areasAfter.remain)) {
                    areasAfter = getGutterSideAbsorptionCapacity(this.unit, this.snapshot.areasAfterGutter, steppedOffset + areasBefore.remain, this.snapshot.allAreasSizePixel);
                }
                else {
                    areasBefore = getGutterSideAbsorptionCapacity(this.unit, this.snapshot.areasBeforeGutter, -(steppedOffset - areasAfter.remain), this.snapshot.allAreasSizePixel);
                }
            }
            // Areas before gutter can't absorbs all offset > need to recalculate sizes for areas after gutter.
            // tslint:disable-next-line: one-line
            else if (areasBefore.remain !== 0) {
                areasAfter = getGutterSideAbsorptionCapacity(this.unit, this.snapshot.areasAfterGutter, steppedOffset + areasBefore.remain, this.snapshot.allAreasSizePixel);
            }
            // Areas after gutter can't absorbs all offset > need to recalculate sizes for areas before gutter.
            // tslint:disable-next-line: one-line
            else if (areasAfter.remain !== 0) {
                areasBefore = getGutterSideAbsorptionCapacity(this.unit, this.snapshot.areasBeforeGutter, -(steppedOffset - areasAfter.remain), this.snapshot.allAreasSizePixel);
            }
            if (this.unit === 'percent') {
                // Hack because of browser messing up with sizes using calc(X% - Ypx) -> el.getBoundingClientRect()
                // If not there, playing with gutters makes total going down to 99.99875% then 99.99286%, 99.98986%,..
                var all = __spread(areasBefore.list, areasAfter.list);
                var areaToReset_1 = all.find(function (a) { return a.percentAfterAbsorption !== 0 &&
                    a.percentAfterAbsorption !== a.areaSnapshot.area.minSize &&
                    a.percentAfterAbsorption !== a.areaSnapshot.area.maxSize; });
                if (areaToReset_1) {
                    areaToReset_1.percentAfterAbsorption =
                        this.snapshot.allInvolvedAreasSizePercent -
                            all
                                .filter(function (a) { return a !== areaToReset_1; })
                                .reduce(function (total, a) { return total + a.percentAfterAbsorption; }, 0);
                }
            }
            // Now we know areas could absorb steppedOffset, time to really update sizes
            areasBefore.list.forEach(function (item) { return updateAreaSize(_this.unit, item); });
            areasAfter.list.forEach(function (item) { return updateAreaSize(_this.unit, item); });
            this.refreshStyleSizes();
            this.notify('progress', this.snapshot.gutterNum);
        };
        MtxSplitComponent.prototype.stopDragging = function (event) {
            var _this = this;
            if (event) {
                event.preventDefault();
                event.stopPropagation();
            }
            if (this.isDragging === false) {
                return;
            }
            this.displayedAreas.forEach(function (area) { return area.component.unlockEvents(); });
            while (this.dragListeners.length > 0) {
                var fct = this.dragListeners.pop();
                if (fct) {
                    fct();
                }
            }
            // Warning: Have to be before "notify('end')"
            // because "notify('end')"" can be linked to "[size]='x'" > "build()" > "stopDragging()"
            this.isDragging = false;
            // If moved from starting point, notify end
            if (this.endPoint &&
                (this.startPoint.x !== this.endPoint.x ||
                    this.startPoint.y !== this.endPoint.y)) {
                this.notify('end', this.snapshot.gutterNum);
            }
            this.renderer.removeClass(this.elRef.nativeElement, 'mtx-dragging');
            this.renderer.removeClass(this.gutterEls.toArray()[this.snapshot.gutterNum - 1].nativeElement, 'mtx-dragged');
            this.snapshot = null;
            // Needed to let (click)="clickGutter(...)" event run and verify if mouse moved or not
            this.ngZone.runOutsideAngular(function () {
                setTimeout(function () {
                    _this.startPoint = null;
                    _this.endPoint = null;
                });
            });
        };
        MtxSplitComponent.prototype.notify = function (type, gutterNum) {
            var _this = this;
            var sizes = this.getVisibleAreaSizes();
            if (type === 'start') {
                this.dragStart.emit({ gutterNum: gutterNum, sizes: sizes });
            }
            else if (type === 'end') {
                this.dragEnd.emit({ gutterNum: gutterNum, sizes: sizes });
            }
            else if (type === 'click') {
                this.gutterClick.emit({ gutterNum: gutterNum, sizes: sizes });
            }
            else if (type === 'dblclick') {
                this.gutterDblClick.emit({ gutterNum: gutterNum, sizes: sizes });
            }
            else if (type === 'transitionEnd') {
                if (this.transitionEndSubscriber) {
                    this.ngZone.run(function () { return _this.transitionEndSubscriber.next(sizes); });
                }
            }
            else if (type === 'progress') {
                // Stay outside zone to allow users do what they want about change detection mechanism.
                this.dragProgressSubject.next({ gutterNum: gutterNum, sizes: sizes });
            }
        };
        MtxSplitComponent.prototype.ngOnDestroy = function () {
            this.stopDragging();
        };
        return MtxSplitComponent;
    }());
    MtxSplitComponent.decorators = [
        { type: core.Component, args: [{
                    selector: 'mtx-split',
                    exportAs: 'mtxSplit',
                    host: {
                        class: 'mtx-split',
                    },
                    encapsulation: core.ViewEncapsulation.None,
                    changeDetection: core.ChangeDetectionStrategy.OnPush,
                    template: "<ng-content></ng-content>\r\n<ng-template ngFor [ngForOf]=\"displayedAreas\" let-index=\"index\" let-last=\"last\">\r\n  <div #gutterEls class=\"mtx-split-gutter\"\r\n       *ngIf=\"last === false\"\r\n       [style.flex-basis.px]=\"gutterSize\"\r\n       [style.order]=\"index * 2 + 1\"\r\n       (mousedown)=\"startDragging($event, index * 2 + 1, index + 1)\"\r\n       (touchstart)=\"startDragging($event, index * 2 + 1, index + 1)\"\r\n       (mouseup)=\"clickGutter($event, index + 1)\"\r\n       (touchend)=\"clickGutter($event, index + 1)\">\r\n    <div class=\"mtx-split-gutter-handle\"></div>\r\n  </div>\r\n</ng-template>\r\n",
                    styles: [".mtx-split{display:flex;flex-wrap:nowrap;justify-content:flex-start;align-items:stretch;overflow:hidden;width:100%;height:100%}.mtx-split>.mtx-split-gutter{position:relative;display:flex;flex-grow:0;flex-shrink:0;align-items:center;justify-content:center}.mtx-split>.mtx-split-gutter>.mtx-split-gutter-handle{position:absolute;opacity:0}.mtx-split>.mtx-split-pane{flex-grow:0;flex-shrink:0;overflow-x:hidden;overflow-y:auto}.mtx-split>.mtx-split-pane.mtx-split-pane-hidden{flex:0 1 0!important;overflow-x:hidden;overflow-y:hidden}.mtx-split.mtx-split-horizontal{flex-direction:row}.mtx-split.mtx-split-horizontal>.mtx-split-gutter{flex-direction:row;height:100%;cursor:col-resize}.mtx-split.mtx-split-horizontal>.mtx-split-gutter>.mtx-split-gutter-handle{width:11px;height:100%;left:-5px;right:5px}.mtx-split.mtx-split-horizontal>.mtx-split-pane{height:100%}.mtx-split.mtx-split-vertical{flex-direction:column}.mtx-split.mtx-split-vertical>.mtx-split-gutter{flex-direction:column;width:100%;cursor:row-resize}.mtx-split.mtx-split-vertical>.mtx-split-gutter>.mtx-split-gutter-handle{width:100%;height:11px;top:-5px;bottom:5px}.mtx-split.mtx-split-vertical>.mtx-split-pane{width:100%}.mtx-split.mtx-split-vertical>.mtx-split-pane.mtx-split-pane-hidden{max-width:0}.mtx-split.mtx-split-disabled>.mtx-split-gutter{cursor:default}.mtx-split.mtx-split-disabled>.mtx-split-gutter .mtx-split-gutter-handle{background-image:none}.mtx-split.mtx-split-transition.mtx-split-init:not(.mtx-dragging)>.mtx-split-gutter,.mtx-split.mtx-split-transition.mtx-split-init:not(.mtx-dragging)>.mtx-split-pane{transition:flex-basis .3s}"]
                },] }
    ];
    /** @nocollapse */
    MtxSplitComponent.ctorParameters = function () { return [
        { type: core.NgZone },
        { type: core.ElementRef },
        { type: core.ChangeDetectorRef },
        { type: core.Renderer2 }
    ]; };
    MtxSplitComponent.propDecorators = {
        direction: [{ type: core.Input }],
        unit: [{ type: core.Input }],
        gutterSize: [{ type: core.Input }],
        gutterStep: [{ type: core.Input }],
        restrictMove: [{ type: core.Input }],
        useTransition: [{ type: core.Input }],
        disabled: [{ type: core.Input }],
        dir: [{ type: core.Input }],
        gutterDblClickDuration: [{ type: core.Input }],
        dragStart: [{ type: core.Output }],
        dragEnd: [{ type: core.Output }],
        gutterClick: [{ type: core.Output }],
        gutterDblClick: [{ type: core.Output }],
        transitionEnd: [{ type: core.Output }],
        gutterEls: [{ type: core.ViewChildren, args: ['gutterEls',] }]
    };

    var MtxSplitPaneDirective = /** @class */ (function () {
        function MtxSplitPaneDirective(ngZone, elRef, renderer, split) {
            this.ngZone = ngZone;
            this.elRef = elRef;
            this.renderer = renderer;
            this.split = split;
            this._order = null;
            ////
            this._size = null;
            ////
            this._minSize = null;
            ////
            this._maxSize = null;
            ////
            this._lockSize = false;
            ////
            this._visible = true;
            this.lockListeners = [];
            this.renderer.addClass(this.elRef.nativeElement, 'mtx-split-pane');
        }
        Object.defineProperty(MtxSplitPaneDirective.prototype, "order", {
            get: function () {
                return this._order;
            },
            set: function (v) {
                this._order = getInputPositiveNumber(v, null);
                this.split.updateArea(this, true, false);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MtxSplitPaneDirective.prototype, "size", {
            get: function () {
                return this._size;
            },
            set: function (v) {
                this._size = getInputPositiveNumber(v, null);
                this.split.updateArea(this, false, true);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MtxSplitPaneDirective.prototype, "minSize", {
            get: function () {
                return this._minSize;
            },
            set: function (v) {
                this._minSize = getInputPositiveNumber(v, null);
                this.split.updateArea(this, false, true);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MtxSplitPaneDirective.prototype, "maxSize", {
            get: function () {
                return this._maxSize;
            },
            set: function (v) {
                this._maxSize = getInputPositiveNumber(v, null);
                this.split.updateArea(this, false, true);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MtxSplitPaneDirective.prototype, "lockSize", {
            get: function () {
                return this._lockSize;
            },
            set: function (v) {
                this._lockSize = getInputBoolean(v);
                this.split.updateArea(this, false, true);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MtxSplitPaneDirective.prototype, "visible", {
            get: function () {
                return this._visible;
            },
            set: function (v) {
                this._visible = getInputBoolean(v);
                if (this._visible) {
                    this.split.showArea(this);
                    this.renderer.removeClass(this.elRef.nativeElement, 'mtx-split-pane-hidden');
                }
                else {
                    this.split.hideArea(this);
                    this.renderer.addClass(this.elRef.nativeElement, 'mtx-split-pane-hidden');
                }
            },
            enumerable: false,
            configurable: true
        });
        MtxSplitPaneDirective.prototype.ngOnInit = function () {
            var _this = this;
            this.split.addArea(this);
            this.ngZone.runOutsideAngular(function () {
                _this.transitionListener = _this.renderer.listen(_this.elRef.nativeElement, 'transitionend', function (event) {
                    // Limit only flex-basis transition to trigger the event
                    if (event.propertyName === 'flex-basis') {
                        _this.split.notify('transitionEnd', -1);
                    }
                });
            });
        };
        MtxSplitPaneDirective.prototype.setStyleOrder = function (value) {
            this.renderer.setStyle(this.elRef.nativeElement, 'order', value);
        };
        MtxSplitPaneDirective.prototype.setStyleFlex = function (grow, shrink, basis, isMin, isMax) {
            // Need 3 separated properties to work on IE11 (https://github.com/angular/flex-layout/issues/323)
            this.renderer.setStyle(this.elRef.nativeElement, 'flex-grow', grow);
            this.renderer.setStyle(this.elRef.nativeElement, 'flex-shrink', shrink);
            this.renderer.setStyle(this.elRef.nativeElement, 'flex-basis', basis);
            if (isMin === true) {
                this.renderer.addClass(this.elRef.nativeElement, 'mtx-min');
            }
            else {
                this.renderer.removeClass(this.elRef.nativeElement, 'mtx-min');
            }
            if (isMax === true) {
                this.renderer.addClass(this.elRef.nativeElement, 'mtx-max');
            }
            else {
                this.renderer.removeClass(this.elRef.nativeElement, 'mtx-max');
            }
        };
        MtxSplitPaneDirective.prototype.lockEvents = function () {
            var _this = this;
            this.ngZone.runOutsideAngular(function () {
                _this.lockListeners.push(_this.renderer.listen(_this.elRef.nativeElement, 'selectstart', function (e) { return false; }));
                _this.lockListeners.push(_this.renderer.listen(_this.elRef.nativeElement, 'dragstart', function (e) { return false; }));
            });
        };
        MtxSplitPaneDirective.prototype.unlockEvents = function () {
            while (this.lockListeners.length > 0) {
                var fct = this.lockListeners.pop();
                if (fct) {
                    fct();
                }
            }
        };
        MtxSplitPaneDirective.prototype.ngOnDestroy = function () {
            this.unlockEvents();
            if (this.transitionListener) {
                this.transitionListener();
            }
            this.split.removeArea(this);
        };
        return MtxSplitPaneDirective;
    }());
    MtxSplitPaneDirective.decorators = [
        { type: core.Directive, args: [{
                    selector: 'mtx-split-pane, [mtx-split-pane]',
                    exportAs: 'mtxSplitPane',
                },] }
    ];
    /** @nocollapse */
    MtxSplitPaneDirective.ctorParameters = function () { return [
        { type: core.NgZone },
        { type: core.ElementRef },
        { type: core.Renderer2 },
        { type: MtxSplitComponent }
    ]; };
    MtxSplitPaneDirective.propDecorators = {
        order: [{ type: core.Input }],
        size: [{ type: core.Input }],
        minSize: [{ type: core.Input }],
        maxSize: [{ type: core.Input }],
        lockSize: [{ type: core.Input }],
        visible: [{ type: core.Input }]
    };

    var MtxSplitModule = /** @class */ (function () {
        function MtxSplitModule() {
        }
        return MtxSplitModule;
    }());
    MtxSplitModule.decorators = [
        { type: core.NgModule, args: [{
                    imports: [common.CommonModule],
                    declarations: [MtxSplitComponent, MtxSplitPaneDirective],
                    exports: [MtxSplitComponent, MtxSplitPaneDirective],
                },] }
    ];

    /**
     * Generated bundle index. Do not edit.
     */

    exports.MtxSplitComponent = MtxSplitComponent;
    exports.MtxSplitModule = MtxSplitModule;
    exports.MtxSplitPaneDirective = MtxSplitPaneDirective;
    exports.getAreaMaxSize = getAreaMaxSize;
    exports.getAreaMinSize = getAreaMinSize;
    exports.getElementPixelSize = getElementPixelSize;
    exports.getGutterSideAbsorptionCapacity = getGutterSideAbsorptionCapacity;
    exports.getInputBoolean = getInputBoolean;
    exports.getInputPositiveNumber = getInputPositiveNumber;
    exports.getPointFromEvent = getPointFromEvent;
    exports.isUserSizesValid = isUserSizesValid;
    exports.updateAreaSize = updateAreaSize;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=mtxSplit.umd.js.map
