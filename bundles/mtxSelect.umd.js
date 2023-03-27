(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/common'), require('@angular/forms'), require('@ng-select/ng-select'), require('@angular/material/form-field'), require('@angular/cdk/coercion'), require('@angular/cdk/a11y'), require('rxjs'), require('rxjs/operators')) :
    typeof define === 'function' && define.amd ? define('@ng-matero/extensions/select', ['exports', '@angular/core', '@angular/common', '@angular/forms', '@ng-select/ng-select', '@angular/material/form-field', '@angular/cdk/coercion', '@angular/cdk/a11y', 'rxjs', 'rxjs/operators'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory((global['ng-matero'] = global['ng-matero'] || {}, global['ng-matero'].extensions = global['ng-matero'].extensions || {}, global['ng-matero'].extensions.select = {}), global.ng.core, global.ng.common, global.ng.forms, global['ng-select'], global.ng.material.formField, global.ng.cdk.coercion, global.ng.cdk.a11y, global.rxjs, global.rxjs.operators));
}(this, (function (exports, core, common, forms, ngSelect, formField, coercion, a11y, rxjs, operators) { 'use strict';

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

    var MtxSelectOptionTemplateDirective = /** @class */ (function () {
        function MtxSelectOptionTemplateDirective(template) {
            this.template = template;
        }
        return MtxSelectOptionTemplateDirective;
    }());
    MtxSelectOptionTemplateDirective.decorators = [
        { type: core.Directive, args: [{ selector: '[ng-option-tmp]' },] }
    ];
    /** @nocollapse */
    MtxSelectOptionTemplateDirective.ctorParameters = function () { return [
        { type: core.TemplateRef }
    ]; };
    var MtxSelectOptgroupTemplateDirective = /** @class */ (function () {
        function MtxSelectOptgroupTemplateDirective(template) {
            this.template = template;
        }
        return MtxSelectOptgroupTemplateDirective;
    }());
    MtxSelectOptgroupTemplateDirective.decorators = [
        { type: core.Directive, args: [{ selector: '[ng-optgroup-tmp]' },] }
    ];
    /** @nocollapse */
    MtxSelectOptgroupTemplateDirective.ctorParameters = function () { return [
        { type: core.TemplateRef }
    ]; };
    var MtxSelectLabelTemplateDirective = /** @class */ (function () {
        function MtxSelectLabelTemplateDirective(template) {
            this.template = template;
        }
        return MtxSelectLabelTemplateDirective;
    }());
    MtxSelectLabelTemplateDirective.decorators = [
        { type: core.Directive, args: [{ selector: '[ng-label-tmp]' },] }
    ];
    /** @nocollapse */
    MtxSelectLabelTemplateDirective.ctorParameters = function () { return [
        { type: core.TemplateRef }
    ]; };
    var MtxSelectMultiLabelTemplateDirective = /** @class */ (function () {
        function MtxSelectMultiLabelTemplateDirective(template) {
            this.template = template;
        }
        return MtxSelectMultiLabelTemplateDirective;
    }());
    MtxSelectMultiLabelTemplateDirective.decorators = [
        { type: core.Directive, args: [{ selector: '[ng-multi-label-tmp]' },] }
    ];
    /** @nocollapse */
    MtxSelectMultiLabelTemplateDirective.ctorParameters = function () { return [
        { type: core.TemplateRef }
    ]; };
    var MtxSelectHeaderTemplateDirective = /** @class */ (function () {
        function MtxSelectHeaderTemplateDirective(template) {
            this.template = template;
        }
        return MtxSelectHeaderTemplateDirective;
    }());
    MtxSelectHeaderTemplateDirective.decorators = [
        { type: core.Directive, args: [{ selector: '[ng-header-tmp]' },] }
    ];
    /** @nocollapse */
    MtxSelectHeaderTemplateDirective.ctorParameters = function () { return [
        { type: core.TemplateRef }
    ]; };
    var MtxSelectFooterTemplateDirective = /** @class */ (function () {
        function MtxSelectFooterTemplateDirective(template) {
            this.template = template;
        }
        return MtxSelectFooterTemplateDirective;
    }());
    MtxSelectFooterTemplateDirective.decorators = [
        { type: core.Directive, args: [{ selector: '[ng-footer-tmp]' },] }
    ];
    /** @nocollapse */
    MtxSelectFooterTemplateDirective.ctorParameters = function () { return [
        { type: core.TemplateRef }
    ]; };
    var MtxSelectNotFoundTemplateDirective = /** @class */ (function () {
        function MtxSelectNotFoundTemplateDirective(template) {
            this.template = template;
        }
        return MtxSelectNotFoundTemplateDirective;
    }());
    MtxSelectNotFoundTemplateDirective.decorators = [
        { type: core.Directive, args: [{ selector: '[ng-notfound-tmp]' },] }
    ];
    /** @nocollapse */
    MtxSelectNotFoundTemplateDirective.ctorParameters = function () { return [
        { type: core.TemplateRef }
    ]; };
    var MtxSelectTypeToSearchTemplateDirective = /** @class */ (function () {
        function MtxSelectTypeToSearchTemplateDirective(template) {
            this.template = template;
        }
        return MtxSelectTypeToSearchTemplateDirective;
    }());
    MtxSelectTypeToSearchTemplateDirective.decorators = [
        { type: core.Directive, args: [{ selector: '[ng-typetosearch-tmp]' },] }
    ];
    /** @nocollapse */
    MtxSelectTypeToSearchTemplateDirective.ctorParameters = function () { return [
        { type: core.TemplateRef }
    ]; };
    var MtxSelectLoadingTextTemplateDirective = /** @class */ (function () {
        function MtxSelectLoadingTextTemplateDirective(template) {
            this.template = template;
        }
        return MtxSelectLoadingTextTemplateDirective;
    }());
    MtxSelectLoadingTextTemplateDirective.decorators = [
        { type: core.Directive, args: [{ selector: '[ng-loadingtext-tmp]' },] }
    ];
    /** @nocollapse */
    MtxSelectLoadingTextTemplateDirective.ctorParameters = function () { return [
        { type: core.TemplateRef }
    ]; };
    var MtxSelectTagTemplateDirective = /** @class */ (function () {
        function MtxSelectTagTemplateDirective(template) {
            this.template = template;
        }
        return MtxSelectTagTemplateDirective;
    }());
    MtxSelectTagTemplateDirective.decorators = [
        { type: core.Directive, args: [{ selector: '[ng-tag-tmp]' },] }
    ];
    /** @nocollapse */
    MtxSelectTagTemplateDirective.ctorParameters = function () { return [
        { type: core.TemplateRef }
    ]; };
    var MtxSelectLoadingSpinnerTemplateDirective = /** @class */ (function () {
        function MtxSelectLoadingSpinnerTemplateDirective(template) {
            this.template = template;
        }
        return MtxSelectLoadingSpinnerTemplateDirective;
    }());
    MtxSelectLoadingSpinnerTemplateDirective.decorators = [
        { type: core.Directive, args: [{ selector: '[ng-loadingspinner-tmp]' },] }
    ];
    /** @nocollapse */
    MtxSelectLoadingSpinnerTemplateDirective.ctorParameters = function () { return [
        { type: core.TemplateRef }
    ]; };

    var MtxOptionComponent = /** @class */ (function () {
        function MtxOptionComponent(elementRef) {
            this.elementRef = elementRef;
            this.stateChange$ = new rxjs.Subject();
            this._disabled = false;
        }
        Object.defineProperty(MtxOptionComponent.prototype, "disabled", {
            get: function () {
                return this._disabled;
            },
            set: function (value) {
                this._disabled = this._isDisabled(value);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MtxOptionComponent.prototype, "label", {
            get: function () {
                return (this.elementRef.nativeElement.textContent || '').trim();
            },
            enumerable: false,
            configurable: true
        });
        MtxOptionComponent.prototype.ngOnChanges = function (changes) {
            if (changes.disabled) {
                this.stateChange$.next({
                    value: this.value,
                    disabled: this._disabled,
                });
            }
        };
        MtxOptionComponent.prototype.ngAfterViewChecked = function () {
            if (this.label !== this._previousLabel) {
                this._previousLabel = this.label;
                this.stateChange$.next({
                    value: this.value,
                    disabled: this._disabled,
                    label: this.elementRef.nativeElement.innerHTML,
                });
            }
        };
        MtxOptionComponent.prototype.ngOnDestroy = function () {
            this.stateChange$.complete();
        };
        MtxOptionComponent.prototype._isDisabled = function (value) {
            return value != null && "" + value !== 'false';
        };
        return MtxOptionComponent;
    }());
    MtxOptionComponent.decorators = [
        { type: core.Component, args: [{
                    selector: 'mtx-option',
                    exportAs: 'mtxOption',
                    changeDetection: core.ChangeDetectionStrategy.OnPush,
                    template: "<ng-content></ng-content>"
                },] }
    ];
    /** @nocollapse */
    MtxOptionComponent.ctorParameters = function () { return [
        { type: core.ElementRef }
    ]; };
    MtxOptionComponent.propDecorators = {
        value: [{ type: core.Input }],
        disabled: [{ type: core.Input }]
    };

    function isDefined(value) {
        return value !== undefined && value !== null;
    }
    var nextUniqueId = 0;
    var MtxSelectComponent = /** @class */ (function () {
        function MtxSelectComponent(_focusMonitor, _elementRef, _changeDetectorRef, ngControl) {
            var _this = this;
            this._focusMonitor = _focusMonitor;
            this._elementRef = _elementRef;
            this._changeDetectorRef = _changeDetectorRef;
            this.ngControl = ngControl;
            /** MtxSelect options */
            this.addTag = false;
            this.addTagText = 'Add item';
            this.appearance = 'underline';
            this.closeOnSelect = true;
            this.clearAllText = 'Clear all';
            this.clearable = true;
            this.clearOnBackspace = true;
            this.dropdownPosition = 'auto';
            this.selectableGroup = false;
            this.selectableGroupAsModel = true;
            this.hideSelected = false;
            this.loading = false;
            this.loadingText = 'Loading...';
            this.labelForId = null;
            this.markFirst = true;
            this.multiple = false;
            this.notFoundText = 'No items found';
            this.searchable = true;
            this.readonly = false;
            this.searchFn = null;
            this.searchWhileComposing = true;
            this.selectOnTab = false;
            this.trackByFn = null;
            this.inputAttrs = {};
            this.minTermLength = 0;
            this.editableSearchTerm = false;
            this.keyDownFn = function (_) { return true; };
            this.virtualScroll = false;
            this.typeToSearchText = 'Type to search';
            this.blurEvent = new core.EventEmitter();
            this.focusEvent = new core.EventEmitter();
            this.changeEvent = new core.EventEmitter();
            this.openEvent = new core.EventEmitter();
            this.closeEvent = new core.EventEmitter();
            this.searchEvent = new core.EventEmitter();
            this.clearEvent = new core.EventEmitter();
            this.addEvent = new core.EventEmitter();
            this.removeEvent = new core.EventEmitter();
            this.scroll = new core.EventEmitter();
            this.scrollToEnd = new core.EventEmitter();
            this._items = [];
            this._destroy$ = new rxjs.Subject();
            this._value = null;
            /** Implemented as part of MatFormFieldControl. */
            this.stateChanges = new rxjs.Subject();
            /** Unique id for this input. */
            this._uid = "mtx-select-" + nextUniqueId++;
            this._focused = false;
            this._required = false;
            this._disabled = false;
            this.errorState = false;
            /** A name for this control that can be used by `mat-form-field`. */
            this.controlType = 'mtx-select';
            /** `View -> model callback called when value changes` */
            this._onChange = function () { };
            /** `View -> model callback called when select has been touched` */
            this._onTouched = function () { };
            _focusMonitor.monitor(_elementRef, true).subscribe(function (origin) {
                if (_this._focused && !origin) {
                    _this._onTouched();
                }
                _this._focused = !!origin;
                _this.stateChanges.next();
            });
            if (this.ngControl != null) {
                this.ngControl.valueAccessor = this;
            }
        }
        Object.defineProperty(MtxSelectComponent.prototype, "clearSearchOnAdd", {
            get: function () {
                return isDefined(this._clearSearchOnAdd) ? this._clearSearchOnAdd : this.closeOnSelect;
            },
            set: function (value) {
                this._clearSearchOnAdd = value;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MtxSelectComponent.prototype, "items", {
            get: function () {
                return this._items;
            },
            set: function (value) {
                this._itemsAreUsed = true;
                this._items = value;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MtxSelectComponent.prototype, "value", {
            /** Value of the select control. */
            get: function () {
                return this._value;
            },
            set: function (newValue) {
                this._value = newValue;
                this._onChange(newValue);
                this.stateChanges.next();
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MtxSelectComponent.prototype, "id", {
            /** Unique id of the element. */
            get: function () {
                return this._id;
            },
            set: function (value) {
                this._id = value || this._uid;
                this.stateChanges.next();
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MtxSelectComponent.prototype, "placeholder", {
            /** Placeholder to be shown if value is empty. */
            get: function () {
                return this._placeholder;
            },
            set: function (value) {
                this._placeholder = value;
                this.stateChanges.next();
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MtxSelectComponent.prototype, "focused", {
            /** Whether the input is focused. */
            get: function () {
                return this._focused;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MtxSelectComponent.prototype, "empty", {
            get: function () {
                return this.value == null || (Array.isArray(this.value) && this.value.length === 0);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MtxSelectComponent.prototype, "shouldLabelFloat", {
            get: function () {
                return this.focused || !this.empty;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MtxSelectComponent.prototype, "required", {
            get: function () {
                return this._required;
            },
            set: function (value) {
                this._required = coercion.coerceBooleanProperty(value);
                this.stateChanges.next();
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MtxSelectComponent.prototype, "disabled", {
            get: function () {
                return this._disabled;
            },
            set: function (value) {
                this._disabled = coercion.coerceBooleanProperty(value);
                this.readonly = this._disabled;
                this.stateChanges.next();
            },
            enumerable: false,
            configurable: true
        });
        MtxSelectComponent.prototype.ngOnInit = function () {
            // Fix compareWith warning of undefined value
            // https://github.com/ng-select/ng-select/issues/1537
            if (this.compareWith) {
                this.ngSelect.compareWith = this.compareWith;
            }
        };
        MtxSelectComponent.prototype.ngAfterViewInit = function () {
            if (!this._itemsAreUsed) {
                this._setItemsFromMtxOptions();
            }
        };
        MtxSelectComponent.prototype.ngDoCheck = function () {
            if (this.ngControl) {
                this.errorState = (this.ngControl.invalid && this.ngControl.touched);
                this.stateChanges.next();
            }
        };
        MtxSelectComponent.prototype.ngOnDestroy = function () {
            this._destroy$.next();
            this._destroy$.complete();
            this.stateChanges.complete();
            this._focusMonitor.stopMonitoring(this._elementRef);
        };
        /** Implemented as part of MatFormFieldControl. */
        MtxSelectComponent.prototype.setDescribedByIds = function (ids) {
            this._ariaDescribedby = ids.join(' ');
        };
        /**
         * Disables the select. Part of the ControlValueAccessor interface required
         * to integrate with Angular's core forms API.
         *
         * @param isDisabled Sets whether the component is disabled.
         */
        MtxSelectComponent.prototype.setDisabledState = function (isDisabled) {
            this.disabled = isDisabled;
        };
        /** Implemented as part of MatFormFieldControl. */
        MtxSelectComponent.prototype.onContainerClick = function (event) {
            var _a;
            var target = event.target;
            if (/mat-form-field|mtx-select/g.test(((_a = target.parentElement) === null || _a === void 0 ? void 0 : _a.classList[0]) || '')) {
                this.focus();
                this.open();
            }
        };
        /**
         * Sets the select's value. Part of the ControlValueAccessor interface
         * required to integrate with Angular's core forms API.
         *
         * @param value New value to be written to the model.
         */
        MtxSelectComponent.prototype.writeValue = function (value) {
            this.value = value;
            this._changeDetectorRef.markForCheck();
        };
        /**
         * Saves a callback function to be invoked when the select's value
         * changes from user input. Part of the ControlValueAccessor interface
         * required to integrate with Angular's core forms API.
         *
         * @param fn Callback to be triggered when the value changes.
         */
        MtxSelectComponent.prototype.registerOnChange = function (fn) {
            this._onChange = fn;
        };
        /**
         * Saves a callback function to be invoked when the select is blurred
         * by the user. Part of the ControlValueAccessor interface required
         * to integrate with Angular's core forms API.
         *
         * @param fn Callback to be triggered when the component has been touched.
         */
        MtxSelectComponent.prototype.registerOnTouched = function (fn) {
            this._onTouched = fn;
        };
        /** NgSelect: _setItemsFromNgOptions */
        MtxSelectComponent.prototype._setItemsFromMtxOptions = function () {
            var _this = this;
            var mapMtxOptions = function (options) {
                _this.items = options.map(function (option) { return ({
                    $ngOptionValue: option.value,
                    $ngOptionLabel: option.elementRef.nativeElement.innerHTML,
                    disabled: option.disabled,
                }); });
                _this.ngSelect.itemsList.setItems(_this.items);
                if (_this.ngSelect.hasValue) {
                    _this.ngSelect.itemsList.mapSelectedItems();
                }
                _this.ngSelect.detectChanges();
            };
            var handleOptionChange = function () {
                var changedOrDestroyed = rxjs.merge(_this.mtxOptions.changes, _this._destroy$);
                rxjs.merge.apply(void 0, __spread(_this.mtxOptions.map(function (option) { return option.stateChange$; }))).pipe(operators.takeUntil(changedOrDestroyed))
                    .subscribe(function (option) {
                    var item = _this.ngSelect.itemsList.findItem(option.value);
                    item.disabled = option.disabled;
                    item.label = option.label || item.label;
                    _this.ngSelect.detectChanges();
                });
            };
            this.mtxOptions.changes
                .pipe(operators.startWith(this.mtxOptions), operators.takeUntil(this._destroy$))
                .subscribe(function (options) {
                mapMtxOptions(options);
                handleOptionChange();
            });
        };
        MtxSelectComponent.prototype.open = function () {
            this.ngSelect.open();
        };
        MtxSelectComponent.prototype.close = function () {
            this.ngSelect.close();
        };
        MtxSelectComponent.prototype.focus = function () {
            this.ngSelect.focus();
        };
        MtxSelectComponent.prototype.blur = function () {
            this.ngSelect.blur();
        };
        return MtxSelectComponent;
    }());
    MtxSelectComponent.decorators = [
        { type: core.Component, args: [{
                    selector: 'mtx-select',
                    exportAs: 'mtxSelect',
                    host: {
                        '[attr.id]': 'id',
                        '[attr.aria-describedby]': '_ariaDescribedby || null',
                        '[class.mtx-select-floating]': 'shouldLabelFloat',
                        '[class.mtx-select-invalid]': 'errorState',
                        'class': 'mtx-select',
                    },
                    template: "<ng-select #ngSelect [class.ng-select-invalid]=\"errorState\"\n           [(ngModel)]=\"value\"\n           [placeholder]=\"placeholder\"\n           [items]=\"items\"\n           [addTag]=\"addTag\"\n           [addTagText]=\"addTagText\"\n           [appendTo]=\"appendTo\"\n           [appearance]=\"appearance\"\n           [bindLabel]=\"bindLabel\"\n           [bindValue]=\"bindValue\"\n           [closeOnSelect]=\"closeOnSelect\"\n           [clearAllText]=\"clearAllText\"\n           [clearable]=\"clearable\"\n           [clearOnBackspace]=\"clearOnBackspace\"\n           [dropdownPosition]=\"dropdownPosition\"\n           [groupBy]=\"groupBy\"\n           [groupValue]=\"groupValue\"\n           [hideSelected]=\"hideSelected\"\n           [isOpen]=\"isOpen\"\n           [inputAttrs]=\"inputAttrs\"\n           [loading]=\"loading\"\n           [loadingText]=\"loadingText\"\n           [labelForId]=\"labelForId\"\n           [markFirst]=\"markFirst\"\n           [maxSelectedItems]=\"maxSelectedItems\"\n           [multiple]=\"multiple\"\n           [notFoundText]=\"notFoundText\"\n           [readonly]=\"readonly\"\n           [typeahead]=\"typeahead\"\n           [typeToSearchText]=\"typeToSearchText\"\n           [trackByFn]=\"trackByFn\"\n           [searchable]=\"searchable\"\n           [searchFn]=\"searchFn\"\n           [searchWhileComposing]=\"searchWhileComposing\"\n           [clearSearchOnAdd]=\"clearSearchOnAdd\"\n           [selectableGroup]=\"selectableGroup\"\n           [selectableGroupAsModel]=\"selectableGroupAsModel\"\n           [selectOnTab]=\"selectOnTab\"\n           [tabIndex]=\"tabIndex\"\n           [openOnEnter]=\"openOnEnter\"\n           [minTermLength]=\"minTermLength\"\n           [editableSearchTerm]=\"editableSearchTerm\"\n           [keyDownFn]=\"keyDownFn\"\n           [virtualScroll]=\"virtualScroll\"\n           (blur)=\"blurEvent.emit($event)\"\n           (focus)=\"focusEvent.emit($event)\"\n           (change)=\"changeEvent.emit($event)\"\n           (open)=\"openEvent.emit($event)\"\n           (close)=\"closeEvent.emit($event)\"\n           (search)=\"searchEvent.emit($event)\"\n           (clear)=\"clearEvent.emit($event)\"\n           (add)=\"addEvent.emit($event)\"\n           (remove)=\"removeEvent.emit($event)\"\n           (scroll)=\"scroll.emit($event)\"\n           (scrollToEnd)=\"scrollToEnd.emit($event)\">\n\n  <ng-container *ngIf=\"optionTemplate\">\n    <ng-template ng-option-tmp let-item=\"item\" let-item$=\"item$\" let-index=\"index\"\n                 let-searchTerm=\"searchTerm\">\n      <ng-template [ngTemplateOutlet]=\"optionTemplate\"\n                   [ngTemplateOutletContext]=\"{ item: item, item$: item$, index: index, searchTerm: searchTerm }\">\n      </ng-template>\n    </ng-template>\n  </ng-container>\n\n  <ng-container *ngIf=\"optgroupTemplate\">\n    <ng-template ng-optgroup-tmp let-item=\"item\" let-item$=\"item$\" let-index=\"index\"\n                 let-searchTerm=\"searchTerm\">\n      <ng-template [ngTemplateOutlet]=\"optgroupTemplate\"\n                   [ngTemplateOutletContext]=\"{ item: item, item$: item$, index: index, searchTerm: searchTerm }\">\n      </ng-template>\n    </ng-template>\n  </ng-container>\n\n  <ng-container *ngIf=\"labelTemplate\">\n    <ng-template ng-label-tmp let-item=\"item\" let-clear=\"clear\" let-label=\"label\">\n      <ng-template [ngTemplateOutlet]=\"labelTemplate\"\n                   [ngTemplateOutletContext]=\"{ item: item, clear: clear, label: label }\">\n      </ng-template>\n    </ng-template>\n  </ng-container>\n\n  <ng-container *ngIf=\"multiLabelTemplate\">\n    <ng-template ng-multi-label-tmp let-items=\"items\" let-clear=\"clear\">\n      <ng-template [ngTemplateOutlet]=\"multiLabelTemplate\"\n                   [ngTemplateOutletContext]=\"{ items: items, clear: clear }\">\n      </ng-template>\n    </ng-template>\n  </ng-container>\n\n  <ng-container *ngIf=\"headerTemplate\">\n    <ng-template ng-header-tmp>\n      <ng-template [ngTemplateOutlet]=\"headerTemplate\">\n      </ng-template>\n    </ng-template>\n  </ng-container>\n\n  <ng-container *ngIf=\"footerTemplate\">\n    <ng-template ng-footer-tmp>\n      <ng-template [ngTemplateOutlet]=\"footerTemplate\">\n      </ng-template>\n    </ng-template>\n  </ng-container>\n\n  <ng-container *ngIf=\"notFoundTemplate\">\n    <ng-template ng-notfound-tmp let-searchTerm=\"searchTerm\">\n      <ng-template [ngTemplateOutlet]=\"notFoundTemplate\"\n                   [ngTemplateOutletContext]=\"{ searchTerm: searchTerm }\">\n      </ng-template>\n    </ng-template>\n  </ng-container>\n\n  <ng-container *ngIf=\"typeToSearchTemplate\">\n    <ng-template ng-typetosearch-tmp>\n      <ng-template [ngTemplateOutlet]=\"typeToSearchTemplate\">\n      </ng-template>\n    </ng-template>\n  </ng-container>\n\n  <ng-container *ngIf=\"loadingTextTemplate\">\n    <ng-template ng-loadingtext-tmp let-searchTerm=\"searchTerm\">\n      <ng-template [ngTemplateOutlet]=\"loadingTextTemplate\"\n                   [ngTemplateOutletContext]=\"{ searchTerm: searchTerm }\">\n      </ng-template>\n    </ng-template>\n  </ng-container>\n\n  <ng-container *ngIf=\"tagTemplate\">\n    <ng-template ng-tag-tmp let-searchTerm=\"searchTerm\">\n      <ng-template [ngTemplateOutlet]=\"tagTemplate\"\n                   [ngTemplateOutletContext]=\"{ searchTerm: searchTerm }\">\n      </ng-template>\n    </ng-template>\n  </ng-container>\n\n  <ng-container *ngIf=\"loadingSpinnerTemplate\">\n    <ng-template ng-loadingspinner-tmp>\n      <ng-template [ngTemplateOutlet]=\"loadingSpinnerTemplate\">\n      </ng-template>\n    </ng-template>\n  </ng-container>\n\n</ng-select>\n",
                    encapsulation: core.ViewEncapsulation.None,
                    changeDetection: core.ChangeDetectionStrategy.OnPush,
                    providers: [{ provide: formField.MatFormFieldControl, useExisting: MtxSelectComponent }],
                    styles: [".ng-select{padding-top:calc(.4375em + .84375em);margin-top:calc(-.4375em - .84375em);padding-bottom:.4375em;margin-bottom:-.4375em}.ng-select .ng-select-container,.ng-select .ng-select-container .ng-value-container{align-items:center}.ng-select .ng-select-container .ng-value-container .ng-input>input{font:inherit;padding:0}.mat-form-field-has-label .ng-select .ng-placeholder{transition:opacity .2s;opacity:0}.mat-form-field-has-label .mtx-select-floating .ng-select .ng-placeholder{opacity:1}.ng-select .ng-has-value .ng-placeholder{display:none}.ng-select.ng-select-opened .ng-arrow-wrapper .ng-arrow{top:-2px;border-width:0 5px 5px}.ng-select.ng-select-single.ng-select-filtered .ng-placeholder{display:initial;visibility:hidden}.ng-select.ng-select-single .ng-select-container .ng-value-container .ng-placeholder:after,.ng-select.ng-select-single .ng-select-container .ng-value-container .ng-value:after{display:inline-block;content:\"\"}.ng-select.ng-select-multiple .ng-select-container .ng-value-container{margin:-4px 0}.ng-select.ng-select-multiple .ng-select-container .ng-value-container .ng-value{margin:4px;border-radius:16px;font-size:.875em;line-height:18px}.ng-select.ng-select-multiple .ng-select-container .ng-value-container .ng-value .ng-value-label{display:inline-block;margin:0 8px}.ng-select.ng-select-multiple .ng-select-container .ng-value-container .ng-value .ng-value-icon{display:inline-block;width:18px;height:18px;border-radius:100%;text-align:center}.ng-select.ng-select-multiple .ng-select-container .ng-value-container .ng-value .ng-value-icon.left{margin-right:-4px}[dir=rtl] .ng-select.ng-select-multiple .ng-select-container .ng-value-container .ng-value .ng-value-icon.left{margin-left:-4px;margin-right:auto}.ng-select.ng-select-multiple .ng-select-container .ng-value-container .ng-value .ng-value-icon.right{margin-left:-4px}[dir=rtl] .ng-select.ng-select-multiple .ng-select-container .ng-value-container .ng-value .ng-value-icon.right{margin-right:-4px;margin-left:auto}.ng-select .ng-clear-wrapper{height:18px;text-align:center}.ng-select .ng-arrow-wrapper{width:18px}.ng-select .ng-arrow-wrapper .ng-arrow{border-width:5px 5px 2px;border-style:solid}.ng-dropdown-panel{left:0}[dir=rtl] .ng-dropdown-panel{right:0;left:auto}.ng-dropdown-panel.ng-select-bottom{top:100%;border-bottom-left-radius:4px;border-bottom-right-radius:4px}.ng-dropdown-panel.ng-select-bottom,.ng-dropdown-panel.ng-select-top{box-shadow:0 2px 4px -1px rgba(0,0,0,.2),0 4px 5px 0 rgba(0,0,0,.14),0 1px 10px 0 rgba(0,0,0,.12)}.ng-dropdown-panel.ng-select-top{bottom:100%;border-top-left-radius:4px;border-top-right-radius:4px}.ng-dropdown-panel .ng-dropdown-footer,.ng-dropdown-panel .ng-dropdown-header{padding:14px 16px}.ng-dropdown-panel .ng-dropdown-panel-items .ng-optgroup{height:3em;padding:14px 16px;font-weight:500;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;cursor:pointer}.ng-dropdown-panel .ng-dropdown-panel-items .ng-optgroup.ng-option-disabled{cursor:default}.ng-dropdown-panel .ng-dropdown-panel-items .ng-option{position:relative;padding:14px 16px;text-overflow:ellipsis;text-decoration:none;text-align:left;white-space:nowrap;overflow:hidden}[dir=rtl] .ng-dropdown-panel .ng-dropdown-panel-items .ng-option{text-align:right}.ng-dropdown-panel .ng-dropdown-panel-items .ng-option.ng-option-child{padding-left:32px}[dir=rtl] .ng-dropdown-panel .ng-dropdown-panel-items .ng-option.ng-option-child{padding-right:32px;padding-left:0}.ng-dropdown-panel .ng-dropdown-panel-items .ng-option .ng-tag-label{padding-right:5px;font-size:80%;font-weight:400}[dir=rtl] .ng-dropdown-panel .ng-dropdown-panel-items .ng-option .ng-tag-label{padding-left:5px;padding-right:0}"]
                },] }
    ];
    /** @nocollapse */
    MtxSelectComponent.ctorParameters = function () { return [
        { type: a11y.FocusMonitor },
        { type: core.ElementRef },
        { type: core.ChangeDetectorRef },
        { type: forms.NgControl, decorators: [{ type: core.Optional }, { type: core.Self }] }
    ]; };
    MtxSelectComponent.propDecorators = {
        ngSelect: [{ type: core.ViewChild, args: ['ngSelect', { static: true },] }],
        optionTemplate: [{ type: core.ContentChild, args: [MtxSelectOptionTemplateDirective, { read: core.TemplateRef },] }],
        optgroupTemplate: [{ type: core.ContentChild, args: [MtxSelectOptgroupTemplateDirective, { read: core.TemplateRef },] }],
        labelTemplate: [{ type: core.ContentChild, args: [MtxSelectLabelTemplateDirective, { read: core.TemplateRef },] }],
        multiLabelTemplate: [{ type: core.ContentChild, args: [MtxSelectMultiLabelTemplateDirective, { read: core.TemplateRef },] }],
        headerTemplate: [{ type: core.ContentChild, args: [MtxSelectHeaderTemplateDirective, { read: core.TemplateRef },] }],
        footerTemplate: [{ type: core.ContentChild, args: [MtxSelectFooterTemplateDirective, { read: core.TemplateRef },] }],
        notFoundTemplate: [{ type: core.ContentChild, args: [MtxSelectNotFoundTemplateDirective, { read: core.TemplateRef },] }],
        typeToSearchTemplate: [{ type: core.ContentChild, args: [MtxSelectTypeToSearchTemplateDirective, { read: core.TemplateRef },] }],
        loadingTextTemplate: [{ type: core.ContentChild, args: [MtxSelectLoadingTextTemplateDirective, { read: core.TemplateRef },] }],
        tagTemplate: [{ type: core.ContentChild, args: [MtxSelectTagTemplateDirective, { read: core.TemplateRef },] }],
        loadingSpinnerTemplate: [{ type: core.ContentChild, args: [MtxSelectLoadingSpinnerTemplateDirective, { read: core.TemplateRef },] }],
        mtxOptions: [{ type: core.ContentChildren, args: [MtxOptionComponent, { descendants: true },] }],
        addTag: [{ type: core.Input }],
        addTagText: [{ type: core.Input }],
        appearance: [{ type: core.Input }],
        appendTo: [{ type: core.Input }],
        bindLabel: [{ type: core.Input }],
        bindValue: [{ type: core.Input }],
        closeOnSelect: [{ type: core.Input }],
        clearAllText: [{ type: core.Input }],
        clearable: [{ type: core.Input }],
        clearOnBackspace: [{ type: core.Input }],
        compareWith: [{ type: core.Input }],
        dropdownPosition: [{ type: core.Input }],
        groupBy: [{ type: core.Input }],
        groupValue: [{ type: core.Input }],
        selectableGroup: [{ type: core.Input }],
        selectableGroupAsModel: [{ type: core.Input }],
        hideSelected: [{ type: core.Input }],
        isOpen: [{ type: core.Input }],
        loading: [{ type: core.Input }],
        loadingText: [{ type: core.Input }],
        labelForId: [{ type: core.Input }],
        markFirst: [{ type: core.Input }],
        maxSelectedItems: [{ type: core.Input }],
        multiple: [{ type: core.Input }],
        notFoundText: [{ type: core.Input }],
        searchable: [{ type: core.Input }],
        readonly: [{ type: core.Input }],
        searchFn: [{ type: core.Input }],
        searchWhileComposing: [{ type: core.Input }],
        selectOnTab: [{ type: core.Input }],
        trackByFn: [{ type: core.Input }],
        inputAttrs: [{ type: core.Input }],
        tabIndex: [{ type: core.Input }],
        openOnEnter: [{ type: core.Input }],
        minTermLength: [{ type: core.Input }],
        editableSearchTerm: [{ type: core.Input }],
        keyDownFn: [{ type: core.Input }],
        virtualScroll: [{ type: core.Input }],
        typeToSearchText: [{ type: core.Input }],
        typeahead: [{ type: core.Input }],
        blurEvent: [{ type: core.Output, args: ['blur',] }],
        focusEvent: [{ type: core.Output, args: ['focus',] }],
        changeEvent: [{ type: core.Output, args: ['change',] }],
        openEvent: [{ type: core.Output, args: ['open',] }],
        closeEvent: [{ type: core.Output, args: ['close',] }],
        searchEvent: [{ type: core.Output, args: ['search',] }],
        clearEvent: [{ type: core.Output, args: ['clear',] }],
        addEvent: [{ type: core.Output, args: ['add',] }],
        removeEvent: [{ type: core.Output, args: ['remove',] }],
        scroll: [{ type: core.Output, args: ['scroll',] }],
        scrollToEnd: [{ type: core.Output, args: ['scrollToEnd',] }],
        clearSearchOnAdd: [{ type: core.Input }],
        items: [{ type: core.Input }],
        value: [{ type: core.Input }],
        id: [{ type: core.Input }],
        placeholder: [{ type: core.Input }],
        required: [{ type: core.Input }],
        disabled: [{ type: core.Input }]
    };

    var MtxSelectModule = /** @class */ (function () {
        function MtxSelectModule() {
        }
        return MtxSelectModule;
    }());
    MtxSelectModule.decorators = [
        { type: core.NgModule, args: [{
                    imports: [common.CommonModule, forms.FormsModule, forms.ReactiveFormsModule, ngSelect.NgSelectModule],
                    exports: [
                        MtxSelectComponent,
                        MtxOptionComponent,
                        MtxSelectOptgroupTemplateDirective,
                        MtxSelectOptionTemplateDirective,
                        MtxSelectLabelTemplateDirective,
                        MtxSelectMultiLabelTemplateDirective,
                        MtxSelectHeaderTemplateDirective,
                        MtxSelectFooterTemplateDirective,
                        MtxSelectNotFoundTemplateDirective,
                        MtxSelectTypeToSearchTemplateDirective,
                        MtxSelectLoadingTextTemplateDirective,
                        MtxSelectTagTemplateDirective,
                        MtxSelectLoadingSpinnerTemplateDirective,
                    ],
                    declarations: [
                        MtxSelectComponent,
                        MtxOptionComponent,
                        MtxSelectOptgroupTemplateDirective,
                        MtxSelectOptionTemplateDirective,
                        MtxSelectLabelTemplateDirective,
                        MtxSelectMultiLabelTemplateDirective,
                        MtxSelectHeaderTemplateDirective,
                        MtxSelectFooterTemplateDirective,
                        MtxSelectNotFoundTemplateDirective,
                        MtxSelectTypeToSearchTemplateDirective,
                        MtxSelectLoadingTextTemplateDirective,
                        MtxSelectTagTemplateDirective,
                        MtxSelectLoadingSpinnerTemplateDirective,
                    ],
                },] }
    ];

    /**
     * Generated bundle index. Do not edit.
     */

    exports.MtxOptionComponent = MtxOptionComponent;
    exports.MtxSelectComponent = MtxSelectComponent;
    exports.MtxSelectFooterTemplateDirective = MtxSelectFooterTemplateDirective;
    exports.MtxSelectHeaderTemplateDirective = MtxSelectHeaderTemplateDirective;
    exports.MtxSelectLabelTemplateDirective = MtxSelectLabelTemplateDirective;
    exports.MtxSelectLoadingSpinnerTemplateDirective = MtxSelectLoadingSpinnerTemplateDirective;
    exports.MtxSelectLoadingTextTemplateDirective = MtxSelectLoadingTextTemplateDirective;
    exports.MtxSelectModule = MtxSelectModule;
    exports.MtxSelectMultiLabelTemplateDirective = MtxSelectMultiLabelTemplateDirective;
    exports.MtxSelectNotFoundTemplateDirective = MtxSelectNotFoundTemplateDirective;
    exports.MtxSelectOptgroupTemplateDirective = MtxSelectOptgroupTemplateDirective;
    exports.MtxSelectOptionTemplateDirective = MtxSelectOptionTemplateDirective;
    exports.MtxSelectTagTemplateDirective = MtxSelectTagTemplateDirective;
    exports.MtxSelectTypeToSearchTemplateDirective = MtxSelectTypeToSearchTemplateDirective;
    exports.isDefined = isDefined;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=mtxSelect.umd.js.map
