(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/common'), require('@angular/forms'), require('@angular/material/table'), require('@angular/material/sort'), require('@angular/material/paginator'), require('@angular/material/checkbox'), require('@angular/material/button'), require('@angular/material/progress-bar'), require('@angular/material/chips'), require('@angular/material/tooltip'), require('@angular/material/icon'), require('@angular/material/select'), require('@angular/material/form-field'), require('@angular/material/menu'), require('@angular/cdk/drag-drop'), require('@ng-matero/extensions/utils'), require('@ng-matero/extensions/dialog'), require('@angular/animations'), require('@angular/cdk/collections'), require('photoviewer'), require('@angular/cdk/overlay'), require('@ng-matero/extensions/column-resize'), require('@angular/cdk/table'), require('@angular/cdk/bidi')) :
    typeof define === 'function' && define.amd ? define('@ng-matero/extensions/data-grid', ['exports', '@angular/core', '@angular/common', '@angular/forms', '@angular/material/table', '@angular/material/sort', '@angular/material/paginator', '@angular/material/checkbox', '@angular/material/button', '@angular/material/progress-bar', '@angular/material/chips', '@angular/material/tooltip', '@angular/material/icon', '@angular/material/select', '@angular/material/form-field', '@angular/material/menu', '@angular/cdk/drag-drop', '@ng-matero/extensions/utils', '@ng-matero/extensions/dialog', '@angular/animations', '@angular/cdk/collections', 'photoviewer', '@angular/cdk/overlay', '@ng-matero/extensions/column-resize', '@angular/cdk/table', '@angular/cdk/bidi'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory((global['ng-matero'] = global['ng-matero'] || {}, global['ng-matero'].extensions = global['ng-matero'].extensions || {}, global['ng-matero'].extensions['data-grid'] = {}), global.ng.core, global.ng.common, global.ng.forms, global.ng.material.table, global.ng.material.sort, global.ng.material.paginator, global.ng.material.checkbox, global.ng.material.button, global.ng.material.progressBar, global.ng.material.chips, global.ng.material.tooltip, global.ng.material.icon, global.ng.material.select, global.ng.material.formField, global.ng.material.menu, global.ng.cdk.dragDrop, global['ng-matero'].extensions.utils, global['ng-matero'].extensions.dialog, global.ng.animations, global.ng.cdk.collections, global.PhotoViewer, global.ng.cdk.overlay, global['ng-matero'].extensions['column-resize'], global.ng.cdk.table, global.ng.cdk.bidi));
}(this, (function (exports, core, common, forms, table, sort, paginator, checkbox, button, progressBar, chips, tooltip, icon, select, formField, menu, dragDrop, utils, dialog, animations, collections, PhotoViewer, overlay, columnResize, table$1, bidi) { 'use strict';

    function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

    var PhotoViewer__default = /*#__PURE__*/_interopDefaultLegacy(PhotoViewer);

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

    var MtxGridService = /** @class */ (function () {
        function MtxGridService() {
        }
        /**
         * Get cell value from column key e.g. `a.b.c`
         * @param rowData Row data
         * @param colDef Column definition
         */
        MtxGridService.prototype.getCellValue = function (rowData, colDef) {
            var keyArr = colDef.field ? colDef.field.split('.') : [];
            var tmp = '';
            keyArr.forEach(function (key, i) {
                if (i === 0) {
                    tmp = rowData[key];
                }
                else {
                    tmp = tmp && tmp[key];
                }
            });
            return tmp;
        };
        /**
         * Get all data of a col
         * @param data All data
         * @param colDef Column definition
         */
        MtxGridService.prototype.getColData = function (data, colDef) {
            var _this = this;
            return data.map(function (rowData) { return _this.getCellValue(rowData, colDef); });
        };
        /**
         * Remove white spaces in a string and convert string to array
         * @param str string
         */
        MtxGridService.prototype.str2arr = function (str) {
            return str.replace(/[\r\n\s]/g, '').split(',');
        };
        return MtxGridService;
    }());
    MtxGridService.decorators = [
        { type: core.Injectable }
    ];
    /** @nocollapse */
    MtxGridService.ctorParameters = function () { return []; };

    var MtxGridComponent = /** @class */ (function () {
        function MtxGridComponent(_dataGridSrv, _changeDetectorRef) {
            this._dataGridSrv = _dataGridSrv;
            this._changeDetectorRef = _changeDetectorRef;
            this.dataSource = new table.MatTableDataSource();
            this.columns = [];
            this.data = [];
            this.length = 0;
            this.loading = false;
            this.columnResizable = false;
            // ===== Page =====
            this.pageOnFront = true;
            this.showPaginator = true;
            this.pageDisabled = false;
            this.showFirstLastButtons = true;
            this.pageIndex = 0;
            this.pageSize = 10;
            this.pageSizeOptions = [10, 50, 100];
            this.hidePageSize = false;
            this.page = new core.EventEmitter();
            // ===== Sort =====
            this.sortOnFront = true;
            this.sortDisableClear = false;
            this.sortDisabled = false;
            this.sortStart = 'asc';
            this.sortChange = new core.EventEmitter();
            // ===== Row =====
            this.rowHover = false;
            this.rowStriped = false;
            this.rowClick = new core.EventEmitter();
            // ===== Expandable Row =====
            this.expansionRowStates = [];
            this.expandable = false;
            this.expandAlways = false;
            this.expansionChange = new core.EventEmitter();
            // ===== Row Selection =====
            /** Whether support multiple row/cell selection. */
            this.multiSelectable = true;
            this.rowSelection = new collections.SelectionModel(true, []);
            this.rowSelected = [];
            this.rowSelectable = false;
            this.hideRowSelectionCheckbox = false;
            this.rowSelectionFormatter = {};
            this.rowSelectionChange = new core.EventEmitter();
            // ===== Cell Selection =====
            this.cellSelection = [];
            this.cellSelectable = true;
            this.cellSelectionChange = new core.EventEmitter();
            // ===== Toolbar =====
            this.showToolbar = false;
            this.toolbarTitle = '';
            // ===== Column Menu =====
            this.columnMenuData = [];
            this.showColumnMenuButton = true;
            this.columnMenuButtonText = '';
            this.columnMenuButtonType = 'stroked';
            this.columnMenuButtonClass = '';
            this.columnMenuButtonIcon = '';
            this.columnHideable = true;
            this.columnHideableChecked = 'show';
            this.columnMovable = true;
            this.columnPinnable = true;
            this.columnChange = new core.EventEmitter();
            this.showColumnMenuHeader = false;
            this.columnMenuHeaderText = 'Columns Header';
            this.showColumnMenuFooter = false;
            this.columnMenuFooterText = 'Columns Footer';
            // ===== No Result =====
            this.noResultText = 'No records found';
            // ===== Summary =====
            this.showSummary = false;
            // ===== Side Bar =====
            this.showSidebar = false;
            // ===== Status Bar =====
            this.showStatusbar = false;
        }
        Object.defineProperty(MtxGridComponent.prototype, "_hasNoResult", {
            get: function () {
                return (!this.data || this.data.length === 0) && !this.loading;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MtxGridComponent.prototype, "_whetherShowSummary", {
            // TODO: Summary display conditions
            get: function () {
                return this.showSummary;
            },
            enumerable: false,
            configurable: true
        });
        MtxGridComponent.prototype.detectChanges = function () {
            this._changeDetectorRef.detectChanges();
        };
        MtxGridComponent.prototype._isTemplateRef = function (obj) {
            return obj instanceof core.TemplateRef;
        };
        MtxGridComponent.prototype._getColData = function (data, colDef) {
            return this._dataGridSrv.getColData(data, colDef);
        };
        MtxGridComponent.prototype._getRowClassList = function (rowData, index) {
            var e_1, _e;
            var classList = {
                'selected': this.rowSelection.isSelected(rowData),
                'mat-row-odd': index % 2,
            };
            if (this.rowClassFormatter) {
                try {
                    for (var _f = __values(Object.keys(this.rowClassFormatter)), _g = _f.next(); !_g.done; _g = _f.next()) {
                        var key = _g.value;
                        classList[key] = this.rowClassFormatter[key](rowData, index);
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (_g && !_g.done && (_e = _f.return)) _e.call(_f);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
            }
            return classList;
        };
        MtxGridComponent.prototype.ngOnInit = function () { };
        // Waiting for async data
        MtxGridComponent.prototype.ngOnChanges = function (changes) {
            var _this = this;
            var _a;
            this._countPinnedPosition();
            this.displayedColumns = this.columns.filter(function (item) { return !item.hide; }).map(function (item) { return item.field; });
            if (this.showColumnMenuButton) {
                this.columnMenuData = this.columns.map(function (item) {
                    var newItem = {
                        label: item.header,
                        field: item.field,
                        disabled: item.disabled,
                    };
                    if (_this.columnHideableChecked === 'show') {
                        newItem.show = !item.hide;
                    }
                    else {
                        newItem.hide = item.hide;
                    }
                    return newItem;
                });
            }
            if (this.rowSelectable && !this.hideRowSelectionCheckbox) {
                this.displayedColumns.unshift('MtxGridCheckboxColumnDef');
            }
            // We should copy each item of data for expansion data
            if (this.expandable) {
                this.expansionRowStates = []; // reset
                (_a = this.data) === null || _a === void 0 ? void 0 : _a.forEach(function (_) {
                    _this.expansionRowStates.push({ expanded: false });
                });
            }
            if (this.rowSelectable) {
                this.rowSelection = new collections.SelectionModel(this.multiSelectable, this.rowSelected);
            }
            this.dataSource = new table.MatTableDataSource(this.data);
            this.dataSource.paginator = this.pageOnFront ? this.paginator : null;
            this.dataSource.sort = this.sortOnFront ? this.sort : null;
            // Only scroll top with data change
            if (changes.data) {
                this.scrollTop(0);
            }
        };
        MtxGridComponent.prototype.ngAfterViewInit = function () {
            if (this.pageOnFront) {
                this.dataSource.paginator = this.paginator;
            }
            if (this.sortOnFront) {
                this.dataSource.sort = this.sort;
            }
        };
        MtxGridComponent.prototype.ngOnDestroy = function () { };
        MtxGridComponent.prototype._countPinnedPosition = function () {
            var count = function (acc, cur) { return acc + parseFloat(cur.width || '80px'); };
            var pinnedLeftCols = this.columns.filter(function (col) { return col.pinned && col.pinned === 'left'; });
            pinnedLeftCols.forEach(function (item, idx) {
                item.left = pinnedLeftCols.slice(0, idx).reduce(count, 0) + 'px';
            });
            var pinnedRightCols = this.columns
                .filter(function (col) { return col.pinned && col.pinned === 'right'; })
                .reverse();
            pinnedRightCols.forEach(function (item, idx) {
                item.right = pinnedRightCols.slice(0, idx).reduce(count, 0) + 'px';
            });
        };
        MtxGridComponent.prototype._getIndex = function (index, dataIndex) {
            return typeof index === 'undefined' ? dataIndex : index;
        };
        MtxGridComponent.prototype._handleSortChange = function (sort) {
            this.sortChange.emit(sort);
        };
        /** Expansion change event */
        MtxGridComponent.prototype._handleExpansionChange = function (expansionRef, rowData, column, index) {
            this.expansionChange.emit({ expanded: expansionRef.expanded, data: rowData, index: index, column: column });
        };
        /** Cell select event */
        MtxGridComponent.prototype._selectCell = function (cellRef, rowData, colDef) {
            // If not the same cell
            if (this._selectedCell !== cellRef) {
                var colValue = this._dataGridSrv.getCellValue(rowData, colDef);
                this.cellSelection = []; // reset
                this.cellSelection.push({ cellData: colValue, rowData: rowData, colDef: colDef });
                this.cellSelectionChange.emit(this.cellSelection);
                if (this._selectedCell) {
                    this._selectedCell.deselect(); // the selectedCell will be undefined
                }
            }
            this._selectedCell = cellRef.selected ? cellRef : undefined;
        };
        /** Row select event */
        MtxGridComponent.prototype._selectRow = function (event, rowData, index) {
            var _a, _b, _c, _d;
            if (this.rowSelectable &&
                !((_b = (_a = this.rowSelectionFormatter).disabled) === null || _b === void 0 ? void 0 : _b.call(_a, rowData, index)) &&
                !((_d = (_c = this.rowSelectionFormatter).hideCheckbox) === null || _d === void 0 ? void 0 : _d.call(_c, rowData, index))) {
                // metaKey -> command key
                if (!event.ctrlKey && !event.metaKey) {
                    this.rowSelection.clear();
                }
                this._toggleNormalCheckbox(rowData);
            }
            this.rowClick.emit({ rowData: rowData, index: index });
        };
        /** Whether the number of selected elements matches the total number of rows. */
        MtxGridComponent.prototype._isAllSelected = function () {
            var _this = this;
            var numSelected = this.rowSelection.selected.length;
            var numRows = this.dataSource.data.filter(function (row, index) { var _a, _b; return !((_b = (_a = _this.rowSelectionFormatter).disabled) === null || _b === void 0 ? void 0 : _b.call(_a, row, index)); }).length;
            return numSelected === numRows;
        };
        /** Select all rows if they are not all selected; otherwise clear selection. */
        MtxGridComponent.prototype._toggleMasterCheckbox = function () {
            var _this = this;
            this._isAllSelected()
                ? this.rowSelection.clear()
                : this.dataSource.data.forEach(function (row, index) {
                    var _a, _b;
                    if (!((_b = (_a = _this.rowSelectionFormatter).disabled) === null || _b === void 0 ? void 0 : _b.call(_a, row, index))) {
                        _this.rowSelection.select(row);
                    }
                });
            this.rowSelectionChange.emit(this.rowSelection.selected);
        };
        /** Select normal row */
        MtxGridComponent.prototype._toggleNormalCheckbox = function (row) {
            this.rowSelection.toggle(row);
            this.rowSelectionChange.emit(this.rowSelection.selected);
        };
        /** Column change event */
        MtxGridComponent.prototype._handleColumnChange = function (columns) {
            this.columnChange.emit(columns);
            this.displayedColumns = Object.assign([], this.getDisplayedColumnFields(columns));
            if (this.rowSelectable && !this.hideRowSelectionCheckbox) {
                this.displayedColumns.unshift('MtxGridCheckboxColumnDef');
            }
        };
        MtxGridComponent.prototype.getDisplayedColumnFields = function (columns) {
            var _this = this;
            var fields = columns
                .filter(function (item) { return _this.columnHideableChecked === 'show' ? item.show : !item.hide; })
                .map(function (item) { return item.field; });
            return fields;
        };
        /** Customize expansion event */
        MtxGridComponent.prototype.toggleExpansion = function (index) {
            if (!this.expandable) {
                throw new Error('The `expandable` should be set true.');
            }
            this.expansionRowStates[index].expanded = !this.expansionRowStates[index].expanded;
            return this.expansionRowStates[index].expanded;
        };
        /** Scroll to top when turn to the next page. */
        MtxGridComponent.prototype._handlePage = function (e) {
            if (this.pageOnFront) {
                this.scrollTop(0);
            }
            this.page.emit(e);
        };
        MtxGridComponent.prototype.scrollTop = function (value) {
            var _a;
            if (value == null) {
                return (_a = this.tableContainer) === null || _a === void 0 ? void 0 : _a.nativeElement.scrollTop;
            }
            if (this.tableContainer && !this.loading) {
                this.tableContainer.nativeElement.scrollTop = value;
            }
        };
        MtxGridComponent.prototype.scrollLeft = function (value) {
            var _a;
            if (value == null) {
                return (_a = this.tableContainer) === null || _a === void 0 ? void 0 : _a.nativeElement.scrollLeft;
            }
            if (this.tableContainer && !this.loading) {
                this.tableContainer.nativeElement.scrollLeft = value;
            }
        };
        return MtxGridComponent;
    }());
    MtxGridComponent.decorators = [
        { type: core.Component, args: [{
                    selector: 'mtx-grid',
                    exportAs: 'mtxGrid',
                    template: "<!-- Progress bar-->\r\n<div class=\"mtx-grid-progress\" *ngIf=\"loading\">\r\n  <mat-progress-bar mode=\"indeterminate\"></mat-progress-bar>\r\n</div>\r\n\r\n<!-- Toolbar -->\r\n<div class=\"mtx-grid-toolbar\" *ngIf=\"showToolbar\">\r\n  <div class=\"mtx-grid-toolbar-content\">\r\n    <ng-template [ngIf]=\"_isTemplateRef(toolbarTemplate)\" [ngIfElse]=\"defaultToolbarTemplate\">\r\n      <ng-template [ngTemplateOutlet]=\"toolbarTemplate\"></ng-template>\r\n    </ng-template>\r\n    <ng-template #defaultToolbarTemplate>\r\n      <div class=\"mtx-grid-toolbar-title\" *ngIf=\"toolbarTitle\">{{toolbarTitle}}</div>\r\n    </ng-template>\r\n  </div>\r\n  <div class=\"mtx-grid-toolbar-actions\">\r\n    <mtx-grid-column-menu *ngIf=\"showColumnMenuButton\" #columnMenu\r\n                          [columns]=\"columnMenuData\"\r\n                          [buttonText]=\"columnMenuButtonText\"\r\n                          [buttonType]=\"columnMenuButtonType\"\r\n                          [buttonColor]=\"columnMenuButtonColor\"\r\n                          [buttonClass]=\"columnMenuButtonClass\"\r\n                          [buttonIcon]=\"columnMenuButtonIcon\"\r\n                          [selectable]=\"columnHideable\"\r\n                          [selectableChecked]=\"columnHideableChecked\"\r\n                          [sortable]=\"columnMovable\"\r\n                          (selectionChange)=\"_handleColumnChange($event)\"\r\n                          (sortChange)=\"_handleColumnChange($event)\"\r\n                          [showHeader]=\"showColumnMenuHeader\"\r\n                          [headerText]=\"columnMenuHeaderText\"\r\n                          [headerTemplate]=\"columnMenuHeaderTemplate\"\r\n                          [showFooter]=\"showColumnMenuFooter\"\r\n                          [footerText]=\"columnMenuFooterText\"\r\n                          [footerTemplate]=\"columnMenuFooterTemplate\">\r\n    </mtx-grid-column-menu>\r\n  </div>\r\n</div>\r\n\r\n<div class=\"mtx-grid-main mtx-grid-layout\">\r\n  <!-- Table content -->\r\n  <div class=\"mtx-grid-content mtx-grid-layout\">\r\n    <div #tableContainer class=\"mat-table-container\"\r\n         [ngClass]=\"{'mat-table-with-data': !_hasNoResult}\">\r\n      <table mat-table *ngIf=\"!columnResizable\"\r\n             [ngClass]=\"{'mat-table-hover': rowHover, 'mat-table-striped': rowStriped, 'mat-table-expandable': expandable}\"\r\n             [dataSource]=\"dataSource\" [multiTemplateDataRows]=\"expandable\"\r\n             matSort\r\n             [matSortActive]=\"sortActive\"\r\n             [matSortDirection]=\"sortDirection\"\r\n             [matSortDisableClear]=\"sortDisableClear\"\r\n             [matSortDisabled]=\"sortDisabled\"\r\n             [matSortStart]=\"sortStart\"\r\n             (matSortChange)=\"_handleSortChange($event)\"\r\n             [trackBy]=\"trackBy\">\r\n\r\n        <ng-container *ngIf=\"rowSelectable && !hideRowSelectionCheckbox\"\r\n                      matColumnDef=\"MtxGridCheckboxColumnDef\">\r\n          <th mat-header-cell *matHeaderCellDef class=\"mtx-grid-checkbox-cell\">\r\n            <mat-checkbox *ngIf=\"multiSelectable\"\r\n                          [checked]=\"rowSelection.hasValue() && _isAllSelected()\"\r\n                          [indeterminate]=\"rowSelection.hasValue() && !_isAllSelected()\"\r\n                          (change)=\"$event ? _toggleMasterCheckbox() : null\">\r\n            </mat-checkbox>\r\n          </th>\r\n          <td mat-cell *matCellDef=\"let row; let index = index; let dataIndex = dataIndex;\"\r\n              class=\"mtx-grid-checkbox-cell\">\r\n            <mat-checkbox *ngIf=\"!(rowSelectionFormatter.hideCheckbox && rowSelectionFormatter.hideCheckbox!(row, _getIndex(index, dataIndex)))\"\r\n                          [disabled]=\"rowSelectionFormatter.disabled && rowSelectionFormatter.disabled!(row, _getIndex(index, dataIndex))\"\r\n                          [checked]=\"rowSelection.isSelected(row)\"\r\n                          (click)=\"$event.stopPropagation()\"\r\n                          (change)=\"$event ? _toggleNormalCheckbox(row) : null\">\r\n            </mat-checkbox>\r\n          </td>\r\n          <td mat-footer-cell *matFooterCellDef class=\"mtx-grid-checkbox-cell\"></td>\r\n        </ng-container>\r\n\r\n        <ng-container *ngFor=\"let col of columns;\">\r\n          <ng-container [matColumnDef]=\"col.field\"\r\n                        [sticky]=\"col.pinned==='left'\" [stickyEnd]=\"col.pinned==='right'\">\r\n            <th mat-header-cell *matHeaderCellDef\r\n                [class]=\"col.class\"\r\n                [ngClass]=\"{'mat-table-sticky-left': col.pinned === 'left', 'mat-table-sticky-right': col.pinned === 'right'}\"\r\n                [ngStyle]=\"{'width': col.width, 'min-width': col.width, 'left': col.left, 'right': col.right}\">\r\n              <div class=\"mat-header-cell-inner\">\r\n                <ng-template [ngIf]=\"_isTemplateRef(headerTemplate)\" [ngIfElse]=\"headerTpl\">\r\n                  <ng-template [ngTemplateOutlet]=\"headerTemplate\"\r\n                               [ngTemplateOutletContext]=\"{ $implicit: col, colDef: col }\">\r\n                  </ng-template>\r\n                </ng-template>\r\n                <ng-template #headerTpl>\r\n                  <ng-template [ngIf]=\"headerTemplate && _isTemplateRef(headerTemplate[col.field])\"\r\n                               [ngIfElse]=\"defaultHeaderTpl\">\r\n                    <ng-template [ngTemplateOutlet]=\"headerTemplate[col.field]\"\r\n                                 [ngTemplateOutletContext]=\"{ $implicit: col, colDef: col }\">\r\n                    </ng-template>\r\n                  </ng-template>\r\n                </ng-template>\r\n                <ng-template #defaultHeaderTpl>\r\n                  <div [mat-sort-header]=\"col.sortProp?.id || col.field\"\r\n                       [disabled]=\"!col.sortable\"\r\n                       [arrowPosition]=\"col.sortProp?.arrowPosition\"\r\n                       [disableClear]=\"col.sortProp?.disableClear\"\r\n                       [start]=\"col.sortProp?.start\">\r\n                    <span class=\"mtx-grid-expansion-placeholder\" *ngIf=\"col.showExpand\"></span>\r\n                    <span>{{col.header | toObservable | async}}</span>\r\n                    <mat-icon class=\"mat-sort-header-icon\" *ngIf=\"col.sortable\">sort</mat-icon>\r\n                  </div>\r\n                  <ng-template [ngTemplateOutlet]=\"headerExtraTplBase\"\r\n                               [ngTemplateOutletContext]=\"{ $implicit: headerExtraTemplate, colDef: col }\">\r\n                  </ng-template>\r\n                </ng-template>\r\n              </div>\r\n            </th>\r\n\r\n            <td mat-cell *matCellDef=\"let row; let index = index; let dataIndex = dataIndex;\"\r\n                [class]=\"col.class\"\r\n                [ngClass]=\"{'mat-table-sticky-left': col.pinned === 'left', 'mat-table-sticky-right': col.pinned === 'right'}\"\r\n                [ngStyle]=\"{'width': col.width, 'min-width': col.width, 'left': col.left, 'right': col.right}\"\r\n                mtx-grid-selectable-cell (cellSelectionChange)=\"_selectCell($event, row, col)\">\r\n              <ng-template [ngIf]=\"_isTemplateRef(cellTemplate)\" [ngIfElse]=\"cellTpl\">\r\n                <ng-template [ngTemplateOutlet]=\"cellTemplate\"\r\n                             [ngTemplateOutletContext]=\"{ $implicit: row, rowData: row, index: _getIndex(index, dataIndex), colDef: col }\">\r\n                </ng-template>\r\n              </ng-template>\r\n              <ng-template #cellTpl>\r\n                <ng-template [ngIf]=\"cellTemplate && _isTemplateRef(cellTemplate[col.field])\"\r\n                             [ngIfElse]=\"colDefCellTpl\">\r\n                  <ng-template [ngTemplateOutlet]=\"cellTemplate[col.field]\"\r\n                               [ngTemplateOutletContext]=\"{ $implicit: row, rowData: row, index: _getIndex(index, dataIndex), colDef: col }\">\r\n                  </ng-template>\r\n                </ng-template>\r\n              </ng-template>\r\n              <ng-template #colDefCellTpl>\r\n                <ng-template [ngIf]=\"col.cellTemplate\" [ngIfElse]=\"defaultCellTpl\"\r\n                             [ngTemplateOutlet]=\"col.cellTemplate\"\r\n                             [ngTemplateOutletContext]=\"{ $implicit: row, rowData: row, index: _getIndex(index, dataIndex), colDef: col }\">\r\n                </ng-template>\r\n              </ng-template>\r\n              <ng-template #defaultCellTpl>\r\n                <button *ngIf=\"col.showExpand && !expandAlways\" mat-icon-button mtx-grid-expansion-toggle\r\n                        [(opened)]=\"expansionRowStates[dataIndex].expanded\"\r\n                        (toggleChange)=\"_handleExpansionChange($event, row, col, dataIndex);\">\r\n                  <mat-icon>keyboard_arrow_right</mat-icon>\r\n                </button>\r\n\r\n                <mtx-grid-cell [rowData]=\"row\" [colDef]=\"col\"></mtx-grid-cell>\r\n              </ng-template>\r\n            </td>\r\n\r\n            <td mat-footer-cell *matFooterCellDef\r\n                [ngClass]=\"{'mat-table-sticky-left': col.pinned === 'left', 'mat-table-sticky-right': col.pinned === 'right'}\"\r\n                [ngStyle]=\"{'width': col.width, 'min-width': col.width, 'left': col.left, 'right': col.right}\">\r\n              <span class=\"mtx-grid-expansion-placeholder\" *ngIf=\"col.showExpand\"></span>\r\n\r\n              <ng-template [ngIf]=\"_isTemplateRef(summaryTemplate)\" [ngIfElse]=\"summaryTpl\">\r\n                <ng-template [ngTemplateOutlet]=\"summaryTemplate\"\r\n                             [ngTemplateOutletContext]=\"{ $implicit: col, colDef: col, data: data }\">\r\n                </ng-template>\r\n              </ng-template>\r\n              <ng-template #summaryTpl>\r\n                <ng-template [ngIf]=\"summaryTemplate && _isTemplateRef(summaryTemplate[col.field])\"\r\n                             [ngIfElse]=\"defaultSummaryTpl\">\r\n                  <ng-template [ngTemplateOutlet]=\"summaryTemplate[col.field]\"\r\n                               [ngTemplateOutletContext]=\"{ $implicit: _getColData(data, col), colData: _getColData(data, col), colDef: col }\">\r\n                  </ng-template>\r\n                </ng-template>\r\n              </ng-template>\r\n              <ng-template #defaultSummaryTpl>\r\n                <mtx-grid-cell [summary]=\"true\" [data]=\"data\" [colDef]=\"col\">\r\n                </mtx-grid-cell>\r\n              </ng-template>\r\n            </td>\r\n          </ng-container>\r\n        </ng-container>\r\n\r\n        <tr mat-header-row *matHeaderRowDef=\"displayedColumns; sticky: true\"></tr>\r\n        <tr mat-row\r\n            *matRowDef=\"let row; let index = index; let dataIndex = dataIndex; columns: displayedColumns;\"\r\n            [ngClass]=\"_getRowClassList(row, _getIndex(index, dataIndex))\"\r\n            (click)=\"_selectRow($event, row, _getIndex(index, dataIndex))\">\r\n        </tr>\r\n        <ng-container *ngIf=\"_whetherShowSummary\">\r\n          <tr mat-footer-row *matFooterRowDef=\"displayedColumns; sticky: true\"></tr>\r\n        </ng-container>\r\n\r\n        <ng-container *ngIf=\"expandable\">\r\n          <!-- Expanded Content Column - The expandable row is made up of this one column that spans across all columns -->\r\n          <ng-container matColumnDef=\"MtxGridExpansionColumnDef\">\r\n            <td mat-cell *matCellDef=\"let row; let dataIndex = dataIndex\"\r\n                [attr.colspan]=\"displayedColumns.length\">\r\n              <div class=\"mtx-grid-expansion-detail\"\r\n                   [@expansion]=\"expandAlways || expansionRowStates[dataIndex].expanded ? 'expanded' : 'collapsed'\">\r\n                <ng-template [ngTemplateOutlet]=\"expansionTemplate\"\r\n                             [ngTemplateOutletContext]=\"{ $implicit: row, rowData: row, index: dataIndex, expanded: expansionRowStates[dataIndex].expanded }\">\r\n                </ng-template>\r\n              </div>\r\n            </td>\r\n          </ng-container>\r\n\r\n          <tr mat-row\r\n              *matRowDef=\"let row; columns: ['MtxGridExpansionColumnDef']; let dataIndex = dataIndex\"\r\n              [ngClass]=\"['mtx-grid-expansion', expandAlways || expansionRowStates[dataIndex].expanded ? 'expanded' : 'collapsed']\">\r\n          </tr>\r\n        </ng-container>\r\n      </table>\r\n\r\n      <!-- TODO: Use flexbox-based mat-table -->\r\n      <table mat-table *ngIf=\"columnResizable\"\r\n             columnResize\r\n             [ngClass]=\"{'mat-table-hover': rowHover, 'mat-table-striped': rowStriped, 'mat-table-expandable': expandable}\"\r\n             [dataSource]=\"dataSource\" [multiTemplateDataRows]=\"expandable\"\r\n             matSort\r\n             [matSortActive]=\"sortActive\"\r\n             [matSortDirection]=\"sortDirection\"\r\n             [matSortDisableClear]=\"sortDisableClear\"\r\n             [matSortDisabled]=\"sortDisabled\"\r\n             [matSortStart]=\"sortStart\"\r\n             (matSortChange)=\"_handleSortChange($event)\"\r\n             [trackBy]=\"trackBy\">\r\n\r\n        <ng-container *ngIf=\"rowSelectable && !hideRowSelectionCheckbox\"\r\n                      matColumnDef=\"MtxGridCheckboxColumnDef\">\r\n          <th mat-header-cell *matHeaderCellDef class=\"mtx-grid-checkbox-cell\">\r\n            <mat-checkbox *ngIf=\"multiSelectable\"\r\n                          [checked]=\"rowSelection.hasValue() && _isAllSelected()\"\r\n                          [indeterminate]=\"rowSelection.hasValue() && !_isAllSelected()\"\r\n                          (change)=\"$event ? _toggleMasterCheckbox() : null\">\r\n            </mat-checkbox>\r\n          </th>\r\n          <td mat-cell *matCellDef=\"let row; let index = index; let dataIndex = dataIndex;\"\r\n              class=\"mtx-grid-checkbox-cell\">\r\n            <mat-checkbox *ngIf=\"!(rowSelectionFormatter.hideCheckbox && rowSelectionFormatter.hideCheckbox!(row, _getIndex(index, dataIndex)))\"\r\n                          [disabled]=\"rowSelectionFormatter.disabled && rowSelectionFormatter.disabled!(row, _getIndex(index, dataIndex))\"\r\n                          [checked]=\"rowSelection.isSelected(row)\"\r\n                          (click)=\"$event.stopPropagation()\"\r\n                          (change)=\"$event ? _toggleNormalCheckbox(row) : null\">\r\n            </mat-checkbox>\r\n          </td>\r\n          <td mat-footer-cell *matFooterCellDef class=\"mtx-grid-checkbox-cell\"></td>\r\n        </ng-container>\r\n\r\n        <ng-container *ngFor=\"let col of columns;\">\r\n          <ng-container [matColumnDef]=\"col.field\"\r\n                        [sticky]=\"col.pinned==='left'\" [stickyEnd]=\"col.pinned==='right'\">\r\n            <th mat-header-cell *matHeaderCellDef\r\n                [class]=\"col.class\"\r\n                [ngClass]=\"{'mat-table-sticky-left': col.pinned === 'left', 'mat-table-sticky-right': col.pinned === 'right'}\"\r\n                [ngStyle]=\"{'width': col.width, 'left': col.left, 'right': col.right}\"\r\n                [resizable]=\"col.resizable\"\r\n                [matResizableMinWidthPx]=\"col.minWidth\" [matResizableMaxWidthPx]=\"col.maxWidth\">\r\n              <div class=\"mat-header-cell-inner\">\r\n                <ng-template [ngIf]=\"_isTemplateRef(headerTemplate)\" [ngIfElse]=\"headerTpl\">\r\n                  <ng-template [ngTemplateOutlet]=\"headerTemplate\"\r\n                               [ngTemplateOutletContext]=\"{ $implicit: col, colDef: col }\">\r\n                  </ng-template>\r\n                </ng-template>\r\n                <ng-template #headerTpl>\r\n                  <ng-template [ngIf]=\"headerTemplate && _isTemplateRef(headerTemplate[col.field])\"\r\n                               [ngIfElse]=\"defaultHeaderTpl\">\r\n                    <ng-template [ngTemplateOutlet]=\"headerTemplate[col.field]\"\r\n                                 [ngTemplateOutletContext]=\"{ $implicit: col, colDef: col }\">\r\n                    </ng-template>\r\n                  </ng-template>\r\n                </ng-template>\r\n                <ng-template #defaultHeaderTpl>\r\n                  <div [mat-sort-header]=\"col.sortProp?.id || col.field\"\r\n                       [disabled]=\"!col.sortable\"\r\n                       [arrowPosition]=\"col.sortProp?.arrowPosition\"\r\n                       [disableClear]=\"col.sortProp?.disableClear\"\r\n                       [start]=\"col.sortProp?.start\">\r\n                    <span class=\"mtx-grid-expansion-placeholder\" *ngIf=\"col.showExpand\"></span>\r\n                    <span>{{col.header | toObservable | async}}</span>\r\n                    <mat-icon class=\"mat-sort-header-icon\" *ngIf=\"col.sortable\">sort</mat-icon>\r\n                  </div>\r\n                  <ng-template [ngTemplateOutlet]=\"headerExtraTplBase\"\r\n                               [ngTemplateOutletContext]=\"{ $implicit: headerExtraTemplate, colDef: col }\">\r\n                  </ng-template>\r\n                </ng-template>\r\n              </div>\r\n            </th>\r\n\r\n            <td mat-cell *matCellDef=\"let row; let index = index; let dataIndex = dataIndex;\"\r\n                [class]=\"col.class\"\r\n                [ngClass]=\"{'mat-table-sticky-left': col.pinned === 'left', 'mat-table-sticky-right': col.pinned === 'right'}\"\r\n                [ngStyle]=\"{'width': col.width, 'left': col.left, 'right': col.right}\"\r\n                mtx-grid-selectable-cell (cellSelectionChange)=\"_selectCell($event, row, col)\">\r\n              <ng-template [ngIf]=\"_isTemplateRef(cellTemplate)\" [ngIfElse]=\"cellTpl\">\r\n                <ng-template [ngTemplateOutlet]=\"cellTemplate\"\r\n                             [ngTemplateOutletContext]=\"{ $implicit: row, rowData: row, index: _getIndex(index, dataIndex), colDef: col }\">\r\n                </ng-template>\r\n              </ng-template>\r\n              <ng-template #cellTpl>\r\n                <ng-template [ngIf]=\"cellTemplate && _isTemplateRef(cellTemplate[col.field])\"\r\n                             [ngIfElse]=\"colDefCellTpl\">\r\n                  <ng-template [ngTemplateOutlet]=\"cellTemplate[col.field]\"\r\n                               [ngTemplateOutletContext]=\"{ $implicit: row, rowData: row, index: _getIndex(index, dataIndex), colDef: col }\">\r\n                  </ng-template>\r\n                </ng-template>\r\n              </ng-template>\r\n              <ng-template #colDefCellTpl>\r\n                <ng-template [ngIf]=\"col.cellTemplate\" [ngIfElse]=\"defaultCellTpl\"\r\n                             [ngTemplateOutlet]=\"col.cellTemplate\"\r\n                             [ngTemplateOutletContext]=\"{ $implicit: row, rowData: row, index: _getIndex(index, dataIndex), colDef: col }\">\r\n                </ng-template>\r\n              </ng-template>\r\n              <ng-template #defaultCellTpl>\r\n                <button *ngIf=\"col.showExpand && !expandAlways\" mat-icon-button mtx-grid-expansion-toggle\r\n                        [(opened)]=\"expansionRowStates[dataIndex].expanded\"\r\n                        (toggleChange)=\"_handleExpansionChange($event, row, col, dataIndex);\">\r\n                  <mat-icon>keyboard_arrow_right</mat-icon>\r\n                </button>\r\n\r\n                <mtx-grid-cell [rowData]=\"row\" [colDef]=\"col\"></mtx-grid-cell>\r\n              </ng-template>\r\n            </td>\r\n\r\n            <td mat-footer-cell *matFooterCellDef\r\n                [ngClass]=\"{'mat-table-sticky-left': col.pinned === 'left', 'mat-table-sticky-right': col.pinned === 'right'}\"\r\n                [ngStyle]=\"{'width': col.width, 'left': col.left, 'right': col.right}\">\r\n              <span class=\"mtx-grid-expansion-placeholder\" *ngIf=\"col.showExpand\"></span>\r\n\r\n              <ng-template [ngIf]=\"_isTemplateRef(summaryTemplate)\" [ngIfElse]=\"summaryTpl\">\r\n                <ng-template [ngTemplateOutlet]=\"summaryTemplate\"\r\n                             [ngTemplateOutletContext]=\"{ $implicit: col, colDef: col, data: data }\">\r\n                </ng-template>\r\n              </ng-template>\r\n              <ng-template #summaryTpl>\r\n                <ng-template [ngIf]=\"summaryTemplate && _isTemplateRef(summaryTemplate[col.field])\"\r\n                             [ngIfElse]=\"defaultSummaryTpl\">\r\n                  <ng-template [ngTemplateOutlet]=\"summaryTemplate[col.field]\"\r\n                               [ngTemplateOutletContext]=\"{ $implicit: _getColData(data, col), colData: _getColData(data, col), colDef: col }\">\r\n                  </ng-template>\r\n                </ng-template>\r\n              </ng-template>\r\n              <ng-template #defaultSummaryTpl>\r\n                <mtx-grid-cell [summary]=\"true\" [data]=\"data\" [colDef]=\"col\">\r\n                </mtx-grid-cell>\r\n              </ng-template>\r\n            </td>\r\n          </ng-container>\r\n        </ng-container>\r\n\r\n        <tr mat-header-row *matHeaderRowDef=\"displayedColumns; sticky: true\"></tr>\r\n        <tr mat-row\r\n            *matRowDef=\"let row; let index = index; let dataIndex = dataIndex; columns: displayedColumns;\"\r\n            [ngClass]=\"_getRowClassList(row, _getIndex(index, dataIndex))\"\r\n            (click)=\"_selectRow($event, row, _getIndex(index, dataIndex))\">\r\n        </tr>\r\n        <ng-container *ngIf=\"_whetherShowSummary\">\r\n          <tr mat-footer-row *matFooterRowDef=\"displayedColumns; sticky: true\"></tr>\r\n        </ng-container>\r\n\r\n        <ng-container *ngIf=\"expandable\">\r\n          <!-- Expanded Content Column - The expandable row is made up of this one column that spans across all columns -->\r\n          <ng-container matColumnDef=\"MtxGridExpansionColumnDef\">\r\n            <td mat-cell *matCellDef=\"let row; let dataIndex = dataIndex\"\r\n                [attr.colspan]=\"displayedColumns.length\">\r\n              <div class=\"mtx-grid-expansion-detail\"\r\n                   [@expansion]=\"expandAlways || expansionRowStates[dataIndex].expanded ? 'expanded' : 'collapsed'\">\r\n                <ng-template [ngTemplateOutlet]=\"expansionTemplate\"\r\n                             [ngTemplateOutletContext]=\"{ $implicit: row, rowData: row, index: dataIndex, expanded: expansionRowStates[dataIndex].expanded }\">\r\n                </ng-template>\r\n              </div>\r\n            </td>\r\n          </ng-container>\r\n\r\n          <tr mat-row\r\n              *matRowDef=\"let row; columns: ['MtxGridExpansionColumnDef']; let dataIndex = dataIndex\"\r\n              [ngClass]=\"['mtx-grid-expansion', expandAlways || expansionRowStates[dataIndex].expanded ? 'expanded' : 'collapsed']\">\r\n          </tr>\r\n        </ng-container>\r\n      </table>\r\n    </div>\r\n\r\n    <!-- No result -->\r\n    <div class=\"mtx-grid-no-result\" *ngIf=\"_hasNoResult\">\r\n      <ng-template [ngIf]=\"_isTemplateRef(noResultTemplate)\" [ngIfElse]=\"defaultNoResultTpl\">\r\n        <ng-template [ngTemplateOutlet]=\"noResultTemplate\"></ng-template>\r\n      </ng-template>\r\n      <ng-template #defaultNoResultTpl>{{noResultText}}</ng-template>\r\n    </div>\r\n  </div>\r\n\r\n  <!-- Tool sidebar -->\r\n  <div class=\"mtx-grid-sidebar\" *ngIf=\"showSidebar\">\r\n    <ng-template [ngIf]=\"_isTemplateRef(sidebarTemplate)\">\r\n      <ng-template [ngTemplateOutlet]=\"sidebarTemplate\"></ng-template>\r\n    </ng-template>\r\n  </div>\r\n</div>\r\n\r\n<div class=\"mtx-grid-footer\">\r\n  <!-- Status Bar -->\r\n  <div class=\"mtx-grid-statusbar\" *ngIf=\"showStatusbar\">\r\n    <ng-template [ngIf]=\"_isTemplateRef(statusbarTemplate)\">\r\n      <ng-template [ngTemplateOutlet]=\"statusbarTemplate\"></ng-template>\r\n    </ng-template>\r\n  </div>\r\n\r\n  <!-- Pagination -->\r\n  <div class=\"mtx-grid-pagination\">\r\n    <ng-template [ngIf]=\"_isTemplateRef(paginationTemplate)\" [ngIfElse]=\"defaultPaginationTemplate\">\r\n      <ng-template [ngTemplateOutlet]=\"paginationTemplate\"></ng-template>\r\n    </ng-template>\r\n    <ng-template #defaultPaginationTemplate>\r\n      <mat-paginator [class.mat-paginator-hidden]=\"!showPaginator || _hasNoResult\"\r\n                     [showFirstLastButtons]=\"showFirstLastButtons\"\r\n                     [length]=\"length\"\r\n                     [pageIndex]=\"pageIndex\"\r\n                     [pageSize]=\"pageSize\"\r\n                     [pageSizeOptions]=\"pageSizeOptions\"\r\n                     [hidePageSize]=\"hidePageSize\"\r\n                     (page)=\"_handlePage($event)\"\r\n                     [disabled]=\"pageDisabled\">\r\n      </mat-paginator>\r\n    </ng-template>\r\n  </div>\r\n</div>\r\n\r\n<!-- Header template for extra content -->\r\n<ng-template #headerExtraTplBase let-headerExtraTemplate let-col=\"colDef\">\r\n  <ng-template [ngIf]=\"_isTemplateRef(headerExtraTemplate)\" [ngIfElse]=\"headerExtraTpl\">\r\n    <ng-template [ngTemplateOutlet]=\"headerExtraTemplate\"\r\n                 [ngTemplateOutletContext]=\"{ $implicit: col, colDef: col }\">\r\n    </ng-template>\r\n  </ng-template>\r\n  <ng-template #headerExtraTpl>\r\n    <ng-template [ngIf]=\"headerExtraTemplate && _isTemplateRef(headerExtraTemplate[col.field])\">\r\n      <ng-template [ngTemplateOutlet]=\"headerExtraTemplate[col.field]\"\r\n                   [ngTemplateOutletContext]=\"{ $implicit: col, colDef: col }\">\r\n      </ng-template>\r\n    </ng-template>\r\n  </ng-template>\r\n</ng-template>\r\n",
                    host: {
                        class: 'mtx-grid',
                    },
                    encapsulation: core.ViewEncapsulation.None,
                    changeDetection: core.ChangeDetectionStrategy.OnPush,
                    animations: [
                        animations.trigger('expansion', [
                            animations.state('collapsed', animations.style({ height: '0', minHeight: '0', visibility: 'hidden' })),
                            animations.state('expanded', animations.style({ height: '*', visibility: 'visible' })),
                            animations.transition('expanded <=> collapsed', animations.animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
                        ]),
                    ],
                    styles: [".mtx-grid{position:relative;display:flex;flex-direction:column;width:100%}.mtx-grid .mat-table-container{overflow:auto}.mtx-grid .mat-table-container.mat-table-with-data{flex:1}.mtx-grid .mat-table:not(.mat-column-resize-table){min-width:100%;border-collapse:separate}.mtx-grid .mat-table:not(.mat-column-resize-table) .mat-cell:not(.mtx-grid-checkbox-cell),.mtx-grid .mat-table:not(.mat-column-resize-table) .mat-footer-cell:not(.mtx-grid-checkbox-cell),.mtx-grid .mat-table:not(.mat-column-resize-table) .mat-header-cell:not(.mtx-grid-checkbox-cell){min-width:80px}.mtx-grid .mat-table-sticky-left{border-right-width:1px;border-right-style:solid}[dir=rtl] .mtx-grid .mat-table-sticky-left{border-right-width:0;border-left-width:1px;border-left-style:solid}.mtx-grid .mat-table-sticky-right{border-left-width:1px;border-left-style:solid}[dir=rtl] .mtx-grid .mat-table-sticky-right{border-left-width:0;border-right-width:1px;border-right-style:solid}.mtx-grid .mat-cell,.mtx-grid .mat-footer-cell,.mtx-grid .mat-header-cell{padding:4px 10px;box-sizing:border-box}.mtx-grid .mat-cell:first-of-type:not(:only-of-type),.mtx-grid .mat-footer-cell:first-of-type:not(:only-of-type),.mtx-grid .mat-header-cell:first-of-type:not(:only-of-type){padding-left:24px}.mtx-grid .mat-cell:first-of-type:not(:only-of-type).mtx-grid-checkbox-cell,.mtx-grid .mat-footer-cell:first-of-type:not(:only-of-type).mtx-grid-checkbox-cell,.mtx-grid .mat-header-cell:first-of-type:not(:only-of-type).mtx-grid-checkbox-cell{padding-left:10px;padding-right:10px}[dir=rtl] .mtx-grid .mat-cell:first-of-type:not(:only-of-type),[dir=rtl] .mtx-grid .mat-footer-cell:first-of-type:not(:only-of-type),[dir=rtl] .mtx-grid .mat-header-cell:first-of-type:not(:only-of-type){padding-left:10px;padding-right:24px}[dir=rtl] .mtx-grid .mat-cell:first-of-type:not(:only-of-type).mtx-grid-checkbox-cell,[dir=rtl] .mtx-grid .mat-footer-cell:first-of-type:not(:only-of-type).mtx-grid-checkbox-cell,[dir=rtl] .mtx-grid .mat-header-cell:first-of-type:not(:only-of-type).mtx-grid-checkbox-cell{padding-left:10px;padding-right:10px}.mtx-grid .mat-cell:last-of-type:not(:only-of-type),.mtx-grid .mat-footer-cell:last-of-type:not(:only-of-type),.mtx-grid .mat-header-cell:last-of-type:not(:only-of-type){padding-right:24px}[dir=rtl] .mtx-grid .mat-cell:last-of-type:not(:only-of-type),[dir=rtl] .mtx-grid .mat-footer-cell:last-of-type:not(:only-of-type),[dir=rtl] .mtx-grid .mat-header-cell:last-of-type:not(:only-of-type){padding-left:24px;padding-right:10px}.mtx-grid .mat-cell .mat-icon-button.expanded .mat-icon{transform:rotate(90deg)}.mtx-grid .mat-row.mtx-grid-expansion{height:0;overflow:hidden}.mtx-grid .mat-row.mtx-grid-expansion .mat-cell{padding-top:0;padding-bottom:0}.mtx-grid .mat-row.mtx-grid-expansion.collapsed .mat-cell{border-bottom-width:0}.mtx-grid .mat-row:last-of-type .mat-cell{border-bottom-width:0}.mtx-grid .mat-sort-header-icon{width:18px;height:18px;margin:0 4px;font-size:18px}.mtx-grid .mat-header-cell-inner{display:flex;align-items:center}.mtx-grid .mat-paginator-hidden{display:none}.mtx-grid-progress{position:absolute;top:0;z-index:120;width:100%}.mtx-grid-toolbar{display:flex;justify-content:space-between;align-items:center;min-height:48px;padding:8px;box-sizing:border-box}.mtx-grid-layout{display:flex;flex:1 1 auto;overflow:auto}.mtx-grid-content{flex-direction:column;width:0}.mtx-grid-sidebar{max-width:50%;border-left-width:1px;border-left-style:solid}[dir=rtl] .mtx-grid-sidebar{border-left-width:0;border-right-width:1px;border-right-style:solid}.mtx-grid-footer{position:relative;z-index:1}.mtx-grid-statusbar{display:flex;align-items:center;min-height:56px;padding:8px}.mtx-grid-no-result{display:flex;justify-content:center;align-items:center;flex:1;min-height:150px}.mtx-grid-expansion-placeholder{display:inline-block;width:40px;height:40px;vertical-align:middle}.mtx-grid-expansion-detail{display:flex;align-items:center;min-height:48px;overflow:hidden}.mtx-grid-checkbox-cell{flex:none;justify-content:center;width:56px;min-width:56px}.mtx-grid-checkbox-cell .mat-checkbox{display:flex;margin:0 10px}.mtx-grid-checkbox-cell .mat-checkbox-inner-container{margin-left:0}"]
                },] }
    ];
    /** @nocollapse */
    MtxGridComponent.ctorParameters = function () { return [
        { type: MtxGridService },
        { type: core.ChangeDetectorRef }
    ]; };
    MtxGridComponent.propDecorators = {
        paginator: [{ type: core.ViewChild, args: [paginator.MatPaginator,] }],
        sort: [{ type: core.ViewChild, args: [sort.MatSort,] }],
        columnMenu: [{ type: core.ViewChild, args: ['columnMenu',] }],
        tableContainer: [{ type: core.ViewChild, args: ['tableContainer',] }],
        displayedColumns: [{ type: core.Input }],
        columns: [{ type: core.Input }],
        data: [{ type: core.Input }],
        length: [{ type: core.Input }],
        loading: [{ type: core.Input }],
        trackBy: [{ type: core.Input }],
        columnResizable: [{ type: core.Input }],
        pageOnFront: [{ type: core.Input }],
        showPaginator: [{ type: core.Input }],
        pageDisabled: [{ type: core.Input }],
        showFirstLastButtons: [{ type: core.Input }],
        pageIndex: [{ type: core.Input }],
        pageSize: [{ type: core.Input }],
        pageSizeOptions: [{ type: core.Input }],
        hidePageSize: [{ type: core.Input }],
        page: [{ type: core.Output }],
        paginationTemplate: [{ type: core.Input }],
        sortOnFront: [{ type: core.Input }],
        sortActive: [{ type: core.Input }],
        sortDirection: [{ type: core.Input }],
        sortDisableClear: [{ type: core.Input }],
        sortDisabled: [{ type: core.Input }],
        sortStart: [{ type: core.Input }],
        sortChange: [{ type: core.Output }],
        rowHover: [{ type: core.Input }],
        rowStriped: [{ type: core.Input }],
        rowClick: [{ type: core.Output }],
        expandable: [{ type: core.Input }],
        expandAlways: [{ type: core.Input }],
        expansionTemplate: [{ type: core.Input }],
        expansionChange: [{ type: core.Output }],
        multiSelectable: [{ type: core.Input }],
        rowSelected: [{ type: core.Input }],
        rowSelectable: [{ type: core.Input }],
        hideRowSelectionCheckbox: [{ type: core.Input }],
        rowSelectionFormatter: [{ type: core.Input }],
        rowClassFormatter: [{ type: core.Input }],
        rowSelectionChange: [{ type: core.Output }],
        cellSelectable: [{ type: core.Input }],
        cellSelectionChange: [{ type: core.Output }],
        showToolbar: [{ type: core.Input }],
        toolbarTitle: [{ type: core.Input }],
        toolbarTemplate: [{ type: core.Input }],
        showColumnMenuButton: [{ type: core.Input }],
        columnMenuButtonText: [{ type: core.Input }],
        columnMenuButtonType: [{ type: core.Input }],
        columnMenuButtonColor: [{ type: core.Input }],
        columnMenuButtonClass: [{ type: core.Input }],
        columnMenuButtonIcon: [{ type: core.Input }],
        columnHideable: [{ type: core.Input }],
        columnHideableChecked: [{ type: core.Input }],
        columnMovable: [{ type: core.Input }],
        columnPinnable: [{ type: core.Input }],
        columnChange: [{ type: core.Output }],
        showColumnMenuHeader: [{ type: core.Input }],
        columnMenuHeaderText: [{ type: core.Input }],
        columnMenuHeaderTemplate: [{ type: core.Input }],
        showColumnMenuFooter: [{ type: core.Input }],
        columnMenuFooterText: [{ type: core.Input }],
        columnMenuFooterTemplate: [{ type: core.Input }],
        noResultText: [{ type: core.Input }],
        noResultTemplate: [{ type: core.Input }],
        headerTemplate: [{ type: core.Input }],
        headerExtraTemplate: [{ type: core.Input }],
        cellTemplate: [{ type: core.Input }],
        showSummary: [{ type: core.Input }],
        summaryTemplate: [{ type: core.Input }],
        showSidebar: [{ type: core.Input }],
        sidebarTemplate: [{ type: core.Input }],
        showStatusbar: [{ type: core.Input }],
        statusbarTemplate: [{ type: core.Input }]
    };

    var MtxGridCellComponent = /** @class */ (function () {
        function MtxGridCellComponent(_dialog, _dataGridSrv) {
            this._dialog = _dialog;
            this._dataGridSrv = _dataGridSrv;
            /** Row data */
            this.rowData = {};
            /** All data */
            this.data = [];
            /** Whether show summary */
            this.summary = false;
        }
        Object.defineProperty(MtxGridCellComponent.prototype, "_colValue", {
            get: function () {
                return this._dataGridSrv.getCellValue(this.rowData, this.colDef);
            },
            enumerable: false,
            configurable: true
        });
        MtxGridCellComponent.prototype._isString = function (fn) {
            return Object.prototype.toString.call(fn) === '[object String]';
        };
        MtxGridCellComponent.prototype._isFunction = function (fn) {
            return Object.prototype.toString.call(fn) === '[object Function]';
        };
        MtxGridCellComponent.prototype._isEmptyValue = function (value) {
            return value == null || value.toString() === '';
        };
        MtxGridCellComponent.prototype._isContainHTML = function (value) {
            return /<\/?[a-z][\s\S]*>/i.test(value);
        };
        MtxGridCellComponent.prototype._getText = function (value) {
            return this._isEmptyValue(value) ? '--' : value;
        };
        MtxGridCellComponent.prototype._getTooltip = function (value) {
            return this._isEmptyValue(value) ? '' : value;
        };
        MtxGridCellComponent.prototype._getFormatterTooltip = function (value) {
            return this._isContainHTML(value) || this._isEmptyValue(value) ? '' : value;
        };
        MtxGridCellComponent.prototype._formatSummary = function (data, colDef) {
            if (this._isString(colDef.summary)) {
                return colDef.summary;
            }
            else if (this._isFunction(colDef.summary)) {
                return colDef.summary(this._dataGridSrv.getColData(data, colDef), colDef);
            }
        };
        MtxGridCellComponent.prototype._handleActionConfirm = function (event, title, description, okColor, okText, closeColor, closeText, fn, data) {
            if (description === void 0) { description = ''; }
            if (okColor === void 0) { okColor = 'primary'; }
            if (okText === void 0) { okText = 'OK'; }
            if (closeText === void 0) { closeText = 'CLOSE'; }
            event.preventDefault();
            event.stopPropagation();
            this._dialog.open({
                title: title,
                description: description,
                buttons: [
                    {
                        color: okColor,
                        text: okText,
                        onClick: function () { return (fn ? fn(data) : {}); },
                    },
                    { color: closeColor, text: closeText, onClick: function () { } },
                ],
            });
        };
        MtxGridCellComponent.prototype._handleActionClick = function (event, btn, rowData) {
            event.preventDefault();
            event.stopPropagation();
            if (btn.click) {
                btn.click(rowData);
            }
        };
        /** Preview enlarged image */
        MtxGridCellComponent.prototype._onPreview = function (urlStr) {
            var imgs = [];
            this._dataGridSrv.str2arr(urlStr).forEach(function (url, index) {
                imgs.push({ title: index + 1 + '', src: url });
            });
            var footerToolbar = imgs.length > 1
                ? ['zoomIn', 'zoomOut', 'prev', 'next', 'rotateRight', 'rotateLeft', 'actualSize']
                : ['zoomIn', 'zoomOut', 'rotateRight', 'rotateLeft', 'actualSize'];
            var options = {
                title: imgs.length > 1,
                footerToolbar: footerToolbar,
            };
            var viewer = new PhotoViewer__default['default'](imgs, options);
        };
        return MtxGridCellComponent;
    }());
    MtxGridCellComponent.decorators = [
        { type: core.Component, args: [{
                    selector: 'mtx-grid-cell',
                    exportAs: 'mtxGridCell',
                    template: "<span *ngIf=\"summary; else customCellFormattingTpl\"\r\n      [title]=\"_getFormatterTooltip(_formatSummary(data, colDef))\"\r\n      [innerHTML]=\"_getText(_formatSummary(data, colDef))\">\r\n</span>\r\n\r\n<!-- Custom formatting -->\r\n<ng-template #customCellFormattingTpl>\r\n  <span *ngIf=\"colDef.formatter; else defaultCellFormattingTpl\"\r\n        [title]=\"_getFormatterTooltip(colDef.formatter!(rowData, colDef))\"\r\n        [innerHTML]=\"_getText(colDef.formatter!(rowData, colDef))\">\r\n  </span>\r\n</ng-template>\r\n\r\n<!-- Default formatting -->\r\n<ng-template #defaultCellFormattingTpl>\r\n  <ng-container [ngSwitch]=\"colDef.type\">\r\n    <!-- Tag -->\r\n    <ng-container *ngSwitchCase=\"'tag'\">\r\n      <mat-chip-list *ngIf=\"colDef.tag && colDef.tag[_colValue]; else tagEmptyTpl\">\r\n        <mat-chip color=\"primary\" [ngClass]=\"['bg-' + colDef.tag[_colValue].color]\">\r\n          {{colDef.tag[_colValue].text}}\r\n        </mat-chip>\r\n      </mat-chip-list>\r\n      <ng-template #tagEmptyTpl>{{_colValue}}</ng-template>\r\n    </ng-container>\r\n    <!-- Buttons -->\r\n    <ng-container *ngSwitchCase=\"'button'\">\r\n      <ng-container *ngFor=\"let btn of colDef.buttons;\">\r\n        <ng-container *ngIf=\"!btn.iif || btn.iif(rowData)\">\r\n          <ng-container *ngIf=\"btn.pop; else btnDefaultTpl\">\r\n            <button [ngClass]=\"['mtx-grid-action-button', btn.class||'']\"\r\n                    *ngIf=\"btn.type==='basic'\"\r\n                    mat-button\r\n                    [color]=\"btn.color || 'primary'\"\r\n                    [disabled]=\"btn.disabled\"\r\n                    [matTooltip]=\"btn.tooltip | toObservable | async\"\r\n                    (click)=\"_handleActionConfirm($event, btn.popTitle, btn.popDescription,\r\n                                                          btn.popOkColor, btn.popOkText,\r\n                                                          btn.popCloseColor, btn.popCloseText,\r\n                                                          btn.click, rowData)\">\r\n              <mat-icon *ngIf=\"btn.icon\">{{btn.icon}}</mat-icon>\r\n              <span>{{btn.text | toObservable | async}}</span>\r\n            </button>\r\n            <button [ngClass]=\"['mtx-grid-action-button', btn.class||'']\"\r\n                    *ngIf=\"!btn.type || btn.type==='icon'\"\r\n                    mat-icon-button\r\n                    [color]=\"btn.color || 'primary'\"\r\n                    [disabled]=\"btn.disabled\"\r\n                    [matTooltip]=\"btn.tooltip | toObservable | async\"\r\n                    (click)=\"_handleActionConfirm($event, btn.popTitle, btn.popDescription,\r\n                                                          btn.popOkColor, btn.popOkText,\r\n                                                          btn.popCloseColor, btn.popCloseText,\r\n                                                          btn.click, rowData)\">\r\n              <mat-icon>{{btn.icon}}</mat-icon>\r\n            </button>\r\n          </ng-container>\r\n          <ng-template #btnDefaultTpl>\r\n            <button [ngClass]=\"['mtx-grid-action-button', btn.class||'']\"\r\n                    *ngIf=\"btn.type==='basic'\"\r\n                    mat-button\r\n                    [color]=\"btn.color || 'primary'\"\r\n                    [disabled]=\"btn.disabled\"\r\n                    [matTooltip]=\"btn.tooltip | toObservable | async\"\r\n                    (click)=\"_handleActionClick($event, btn, rowData)\">\r\n              <mat-icon *ngIf=\"btn.icon\">{{btn.icon}}</mat-icon>\r\n              <span>{{btn.text | toObservable | async}}</span>\r\n            </button>\r\n            <button [ngClass]=\"['mtx-grid-action-button', btn.class||'']\"\r\n                    *ngIf=\"!btn.type || btn.type==='icon'\"\r\n                    mat-icon-button\r\n                    [color]=\"btn.color || 'primary'\"\r\n                    [disabled]=\"btn.disabled\"\r\n                    [matTooltip]=\"btn.tooltip | toObservable | async\"\r\n                    (click)=\"_handleActionClick($event, btn, rowData)\">\r\n              <mat-icon>{{btn.icon}}</mat-icon>\r\n            </button>\r\n          </ng-template>\r\n        </ng-container>\r\n      </ng-container>\r\n    </ng-container>\r\n    <!-- Link -->\r\n    <ng-container *ngSwitchCase=\"'link'\">\r\n      <a [href]=\"_colValue\" target=\"_blank\">{{_colValue}}</a>\r\n    </ng-container>\r\n    <!-- Image -->\r\n    <ng-container *ngSwitchCase=\"'image'\">\r\n      <img class=\"mtx-grid-img\" [src]=\"_colValue\" (click)=\"_onPreview(_colValue)\">\r\n    </ng-container>\r\n    <!-- Boolean -->\r\n    <ng-container *ngSwitchCase=\"'boolean'\">\r\n      <span [title]=\"_getTooltip(_colValue)\">{{_getText(_colValue)}}</span>\r\n    </ng-container>\r\n    <!-- Number -->\r\n    <ng-container *ngSwitchCase=\"'number'\">\r\n      <span [title]=\"_getTooltip(_colValue | number: colDef.typeParameter?.digitsInfo : colDef.typeParameter?.locale)\">\r\n        {{_getText(_colValue | number: colDef.typeParameter?.digitsInfo : colDef.typeParameter?.locale)}}\r\n      </span>\r\n    </ng-container>\r\n    <!-- Currency -->\r\n    <ng-container *ngSwitchCase=\"'currency'\">\r\n      <span [title]=\"_getTooltip(_colValue | currency: colDef.typeParameter?.currencyCode : colDef.typeParameter?.display : colDef.typeParameter?.digitsInfo : colDef.typeParameter?.locale)\">\r\n        {{_getText(_colValue | currency: colDef.typeParameter?.currencyCode : colDef.typeParameter?.display : colDef.typeParameter?.digitsInfo : colDef.typeParameter?.locale)}}\r\n      </span>\r\n    </ng-container>\r\n    <!-- Percent -->\r\n    <ng-container *ngSwitchCase=\"'percent'\">\r\n      <span [title]=\"_getTooltip(_colValue | percent: colDef.typeParameter?.digitsInfo : colDef.typeParameter?.locale)\">\r\n        {{_getText(_colValue | percent: colDef.typeParameter?.digitsInfo : colDef.typeParameter?.locale)}}\r\n      </span>\r\n    </ng-container>\r\n    <!-- Date -->\r\n    <ng-container *ngSwitchCase=\"'date'\">\r\n      <span [title]=\"_getTooltip(_colValue | date: colDef.typeParameter?.format : colDef.typeParameter?.timezone : colDef.typeParameter?.locale)\">\r\n        {{_getText(_colValue | date: colDef.typeParameter?.format : colDef.typeParameter?.timezone : colDef.typeParameter?.locale)}}\r\n      </span>\r\n    </ng-container>\r\n    <!-- Default -->\r\n    <ng-container *ngSwitchDefault>\r\n      <span [title]=\"_getTooltip(_colValue)\">{{_getText(_colValue)}}</span>\r\n    </ng-container>\r\n  </ng-container>\r\n</ng-template>\r\n",
                    encapsulation: core.ViewEncapsulation.None,
                    styles: [".mtx-grid-action-button .mat-icon{width:18px;height:18px;font-size:18px;line-height:18px}.mtx-grid-img{display:block;width:30px;border-radius:4px;cursor:pointer}"]
                },] }
    ];
    /** @nocollapse */
    MtxGridCellComponent.ctorParameters = function () { return [
        { type: dialog.MtxDialog },
        { type: MtxGridService }
    ]; };
    MtxGridCellComponent.propDecorators = {
        rowData: [{ type: core.Input }],
        colDef: [{ type: core.Input }],
        data: [{ type: core.Input }],
        summary: [{ type: core.Input }]
    };

    var MtxGridColumnMenuComponent = /** @class */ (function () {
        function MtxGridColumnMenuComponent() {
            this.columns = [];
            this.selectable = true;
            this.selectableChecked = 'show';
            this.sortable = true;
            this.dndSortable = true;
            this._buttonText = '';
            this.buttonType = 'stroked';
            this.buttonClass = '';
            this.buttonIcon = '';
            this.showHeader = false;
            this.headerText = 'Columns Header';
            this.showFooter = false;
            this.footerText = 'Columns Footer';
            this.selectionChange = new core.EventEmitter();
            this.sortChange = new core.EventEmitter();
        }
        Object.defineProperty(MtxGridColumnMenuComponent.prototype, "buttonText", {
            get: function () {
                var defaultText = "Columns " + (this.selectableChecked === 'show' ? 'Shown' : 'Hidden');
                var text = this._buttonText ? this._buttonText : defaultText;
                return text;
            },
            set: function (value) {
                this._buttonText = value;
            },
            enumerable: false,
            configurable: true
        });
        MtxGridColumnMenuComponent.prototype._handleDroped = function (event) {
            dragDrop.moveItemInArray(this.columns, event.previousIndex, event.currentIndex);
            this.sortChange.emit(this.columns);
        };
        MtxGridColumnMenuComponent.prototype._handleSelection = function (e) {
            this.selectionChange.emit(this.columns);
        };
        return MtxGridColumnMenuComponent;
    }());
    MtxGridColumnMenuComponent.decorators = [
        { type: core.Component, args: [{
                    selector: 'mtx-grid-column-menu',
                    exportAs: 'mtxGridColumnMenu',
                    template: "<ng-container [ngSwitch]=\"buttonType\">\r\n  <ng-container *ngSwitchCase=\"'raised'\">\r\n    <button [ngClass]=\"buttonClass\" mat-raised-button [color]=\"buttonColor\"\r\n            [matMenuTriggerFor]=\"menu\">\r\n      <mat-icon *ngIf=\"buttonIcon\">{{buttonIcon}}</mat-icon> {{buttonText}}\r\n    </button>\r\n  </ng-container>\r\n  <ng-container *ngSwitchCase=\"'stroked'\">\r\n    <button [ngClass]=\"buttonClass\" mat-stroked-button [color]=\"buttonColor\"\r\n            [matMenuTriggerFor]=\"menu\">\r\n      <mat-icon *ngIf=\"buttonIcon\">{{buttonIcon}}</mat-icon> {{buttonText}}\r\n    </button>\r\n  </ng-container>\r\n  <ng-container *ngSwitchCase=\"'flat'\">\r\n    <button [ngClass]=\"buttonClass\" mat-flat-button [color]=\"buttonColor\"\r\n            [matMenuTriggerFor]=\"menu\">\r\n      <mat-icon *ngIf=\"buttonIcon\">{{buttonIcon}}</mat-icon> {{buttonText}}\r\n    </button>\r\n  </ng-container>\r\n  <ng-container *ngSwitchCase=\"'icon'\">\r\n    <button [ngClass]=\"buttonClass\" mat-icon-button [color]=\"buttonColor\"\r\n            [matMenuTriggerFor]=\"menu\">\r\n      <mat-icon *ngIf=\"buttonIcon\">{{buttonIcon}}</mat-icon>\r\n    </button>\r\n  </ng-container>\r\n  <ng-container *ngSwitchCase=\"'fab'\">\r\n    <button [ngClass]=\"buttonClass\" mat-fab [color]=\"buttonColor\" [matMenuTriggerFor]=\"menu\">\r\n      <mat-icon *ngIf=\"buttonIcon\">{{buttonIcon}}</mat-icon> {{buttonText}}\r\n    </button>\r\n  </ng-container>\r\n  <ng-container *ngSwitchCase=\"'mini-fab'\">\r\n    <button [ngClass]=\"buttonClass\" mat-mini-fab [color]=\"buttonColor\"\r\n            [matMenuTriggerFor]=\"menu\">\r\n      <mat-icon *ngIf=\"buttonIcon\">{{buttonIcon}}</mat-icon> {{buttonText}}\r\n    </button>\r\n  </ng-container>\r\n  <ng-container *ngSwitchDefault>\r\n    <button [ngClass]=\"buttonClass\" mat-button [color]=\"buttonColor\" [matMenuTriggerFor]=\"menu\">\r\n      <mat-icon *ngIf=\"buttonIcon\">{{buttonIcon}}</mat-icon> {{buttonText}}\r\n    </button>\r\n  </ng-container>\r\n</ng-container>\r\n\r\n<mat-menu #menu=\"matMenu\" class=\"mtx-grid-column-menu\">\r\n  <div class=\"mtx-grid-column-menu-content\"\r\n       (click)=\"$event.stopPropagation()\" (keydown)=\"$event.stopPropagation()\">\r\n    <div class=\"mtx-grid-column-menu-header\" *ngIf=\"showHeader\">\r\n      <ng-template [ngIf]=\"headerTemplate\" [ngIfElse]=\"defaultHeaderTpl\">\r\n        <ng-template [ngTemplateOutlet]=\"headerTemplate\"></ng-template>\r\n      </ng-template>\r\n      <ng-template #defaultHeaderTpl>{{headerText}}</ng-template>\r\n    </div>\r\n\r\n    <div class=\"mtx-grid-column-menu-body\">\r\n      <div class=\"mtx-grid-column-menu-list\"\r\n           cdkDropList (cdkDropListDropped)=\"_handleDroped($event)\"\r\n           *ngIf=\"sortable\">\r\n        <div class=\"mtx-grid-column-menu-item\" *ngFor=\"let col of columns\"\r\n             cdkDrag [cdkDragDisabled]=\"selectableChecked === 'show'? !col.show : col.hide\">\r\n          <mat-icon cdkDragHandle>drag_handle</mat-icon>\r\n          <ng-template [ngTemplateOutlet]=\"checkboxList\"\r\n                       [ngTemplateOutletContext]=\"{ $implicit: col }\">\r\n          </ng-template>\r\n        </div>\r\n      </div>\r\n\r\n      <div class=\"mtx-grid-column-menu-list\" *ngIf=\"!sortable\">\r\n        <div class=\"mtx-grid-column-menu-item\" *ngFor=\"let col of columns\">\r\n          <ng-template [ngTemplateOutlet]=\"checkboxList\"\r\n                       [ngTemplateOutletContext]=\"{ $implicit: col }\">\r\n          </ng-template>\r\n        </div>\r\n      </div>\r\n    </div>\r\n\r\n    <div class=\"mtx-grid-column-menu-footer\" *ngIf=\"showFooter\">\r\n      <ng-template [ngIf]=\"footerTemplate\" [ngIfElse]=\"defaultFooterTpl\">\r\n        <ng-template [ngTemplateOutlet]=\"footerTemplate\"></ng-template>\r\n      </ng-template>\r\n      <ng-template #defaultFooterTpl>{{footerText}}</ng-template>\r\n    </div>\r\n  </div>\r\n</mat-menu>\r\n\r\n<ng-template #checkboxList let-col>\r\n  <mat-checkbox class=\"mtx-grid-column-menu-item-label\"\r\n                *ngIf=\"selectable\"\r\n                [(ngModel)]=\"col[selectableChecked]\"\r\n                [disabled]=\"col.disabled\"\r\n                (change)=\"_handleSelection($event)\">\r\n    {{col.label | toObservable | async}}\r\n  </mat-checkbox>\r\n  <span class=\"mtx-grid-column-menu-item-label\" *ngIf=\"!selectable\">\r\n    {{col.label | toObservable | async}}\r\n  </span>\r\n</ng-template>\r\n",
                    encapsulation: core.ViewEncapsulation.None,
                    changeDetection: core.ChangeDetectionStrategy.OnPush,
                    styles: [".mtx-grid-column-menu .mat-menu-content{padding:0}.mtx-grid-column-menu-body{padding:16px}.mtx-grid-column-menu-footer,.mtx-grid-column-menu-header{position:sticky;z-index:1;padding:8px 16px}.mtx-grid-column-menu-header{top:0}.mtx-grid-column-menu-footer{bottom:0}.mtx-grid-column-menu-list{display:block;max-width:100%}.mtx-grid-column-menu-list.cdk-drop-list-dragging .mtx-grid-column-menu-item:not(.cdk-drag-placeholder){transition:transform .25s cubic-bezier(0,0,.2,1)}.mtx-grid-column-menu-list.cdk-drop-list .mtx-grid-column-menu-item-label{padding:0 4px}.mtx-grid-column-menu-item{display:flex;flex-direction:row;align-items:center;padding:4px 0}.mtx-grid-column-menu-item.cdk-drag-disabled .cdk-drag-handle{opacity:.35;cursor:no-drop}.mtx-grid-column-menu-item .cdk-drag-handle{cursor:move}.mtx-grid-column-menu-item.cdk-drag-preview{box-shadow:0 3px 1px -2px rgba(0,0,0,.2),0 2px 2px 0 rgba(0,0,0,.14),0 1px 5px 0 rgba(0,0,0,.12)}.mtx-grid-column-menu-item.cdk-drag-placeholder{opacity:0}.mtx-grid-column-menu-item.cdk-drag-animating{transition:transform .25s cubic-bezier(0,0,.2,1)}"]
                },] }
    ];
    MtxGridColumnMenuComponent.propDecorators = {
        menuPanel: [{ type: core.ViewChild, args: ['menu', { static: true },] }],
        menuTrigger: [{ type: core.ViewChild, args: [menu.MatMenuTrigger,] }],
        columns: [{ type: core.Input }],
        selectable: [{ type: core.Input }],
        selectableChecked: [{ type: core.Input }],
        sortable: [{ type: core.Input }],
        dndSortable: [{ type: core.Input }],
        buttonText: [{ type: core.Input }],
        buttonType: [{ type: core.Input }],
        buttonColor: [{ type: core.Input }],
        buttonClass: [{ type: core.Input }],
        buttonIcon: [{ type: core.Input }],
        showHeader: [{ type: core.Input }],
        headerText: [{ type: core.Input }],
        headerTemplate: [{ type: core.Input }],
        showFooter: [{ type: core.Input }],
        footerText: [{ type: core.Input }],
        footerTemplate: [{ type: core.Input }],
        selectionChange: [{ type: core.Output }],
        sortChange: [{ type: core.Output }]
    };

    var MtxGridExpansionToggleDirective = /** @class */ (function () {
        function MtxGridExpansionToggleDirective() {
            this._opened = false;
            this.openedChange = new core.EventEmitter();
            this.toggleChange = new core.EventEmitter();
        }
        Object.defineProperty(MtxGridExpansionToggleDirective.prototype, "opened", {
            get: function () {
                return this._opened;
            },
            set: function (newValue) {
                this._opened = newValue;
                this.openedChange.emit(newValue);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MtxGridExpansionToggleDirective.prototype, "expanded", {
            get: function () {
                return this._opened;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MtxGridExpansionToggleDirective.prototype, "expandableRow", {
            set: function (value) {
                if (value !== this._row) {
                    this._row = value;
                }
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MtxGridExpansionToggleDirective.prototype, "template", {
            set: function (value) {
                if (value !== this._tplRef) {
                    this._tplRef = value;
                }
            },
            enumerable: false,
            configurable: true
        });
        MtxGridExpansionToggleDirective.prototype.onClick = function (event) {
            event.preventDefault();
            event.stopPropagation();
            this.toggle();
        };
        MtxGridExpansionToggleDirective.prototype.toggle = function () {
            this.opened = !this.opened;
            this.toggleChange.emit(this);
        };
        return MtxGridExpansionToggleDirective;
    }());
    MtxGridExpansionToggleDirective.decorators = [
        { type: core.Directive, args: [{
                    selector: '[mtx-grid-expansion-toggle]',
                },] }
    ];
    /** @nocollapse */
    MtxGridExpansionToggleDirective.ctorParameters = function () { return []; };
    MtxGridExpansionToggleDirective.propDecorators = {
        opened: [{ type: core.Input }],
        openedChange: [{ type: core.Output }],
        expanded: [{ type: core.HostBinding, args: ['class.expanded',] }],
        expandableRow: [{ type: core.Input }],
        template: [{ type: core.Input, args: ['expansionRowTpl',] }],
        toggleChange: [{ type: core.Output }],
        onClick: [{ type: core.HostListener, args: ['click', ['$event'],] }]
    };

    var MtxGridCellSelectionDirective = /** @class */ (function () {
        function MtxGridCellSelectionDirective(_dataGrid) {
            this._dataGrid = _dataGrid;
            this._selected = false;
            this.shiftKeyPressed = false;
            this.ctrlKeyPressed = false;
            this.cellSelectionChange = new core.EventEmitter();
        }
        Object.defineProperty(MtxGridCellSelectionDirective.prototype, "selected", {
            get: function () {
                return this._selected;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MtxGridCellSelectionDirective.prototype, "matSelectableRowData", {
            set: function (value) {
                if (value !== this._rowData) {
                    this._rowData = value;
                }
            },
            enumerable: false,
            configurable: true
        });
        MtxGridCellSelectionDirective.prototype.onClick = function (event) {
            this.ctrlKeyPressed = event.ctrlKey;
            this.shiftKeyPressed = event.shiftKey;
            if (this._dataGrid.cellSelectable) {
                this.select();
            }
        };
        MtxGridCellSelectionDirective.prototype.select = function () {
            this._selected = true;
            this.cellSelectionChange.emit(this);
        };
        MtxGridCellSelectionDirective.prototype.deselect = function () {
            this._selected = false;
            this.cellSelectionChange.emit(this);
        };
        MtxGridCellSelectionDirective.prototype.toggle = function () {
            this._selected = !this._selected;
            this.cellSelectionChange.emit(this);
        };
        return MtxGridCellSelectionDirective;
    }());
    MtxGridCellSelectionDirective.decorators = [
        { type: core.Directive, args: [{
                    selector: '[mtx-grid-selectable-cell]',
                },] }
    ];
    /** @nocollapse */
    MtxGridCellSelectionDirective.ctorParameters = function () { return [
        { type: MtxGridComponent }
    ]; };
    MtxGridCellSelectionDirective.propDecorators = {
        selected: [{ type: core.HostBinding, args: ['class.selected',] }],
        matSelectableRowData: [{ type: core.Input }],
        cellSelectionChange: [{ type: core.Output }],
        onClick: [{ type: core.HostListener, args: ['click', ['$event'],] }]
    };

    /**
     * Overrides CdkFlexTableResizeStrategy to match mat-column elements.
     */
    var MatFlexTableResizeStrategy = /** @class */ (function (_super) {
        __extends(MatFlexTableResizeStrategy, _super);
        function MatFlexTableResizeStrategy(columnResize, styleScheduler, table, document) {
            return _super.call(this, columnResize, styleScheduler, table, document) || this;
        }
        MatFlexTableResizeStrategy.prototype.getColumnCssClass = function (cssFriendlyColumnName) {
            return "mat-column-" + cssFriendlyColumnName;
        };
        return MatFlexTableResizeStrategy;
    }(columnResize.CdkFlexTableResizeStrategy));
    MatFlexTableResizeStrategy.decorators = [
        { type: core.Injectable }
    ];
    /** @nocollapse */
    MatFlexTableResizeStrategy.ctorParameters = function () { return [
        { type: columnResize.ColumnResize },
        { type: table$1._CoalescedStyleScheduler, decorators: [{ type: core.Inject, args: [table$1._COALESCED_STYLE_SCHEDULER,] }] },
        { type: table$1.CdkTable },
        { type: undefined, decorators: [{ type: core.Inject, args: [common.DOCUMENT,] }] }
    ]; };
    var FLEX_RESIZE_STRATEGY_PROVIDER = {
        provide: columnResize.ResizeStrategy,
        useClass: MatFlexTableResizeStrategy,
    };

    var PROVIDERS = [
        columnResize.ColumnResizeNotifier,
        columnResize.HeaderRowEventDispatcher,
        columnResize.ColumnResizeNotifierSource,
    ];
    var TABLE_PROVIDERS = __spread(PROVIDERS, [
        columnResize.TABLE_LAYOUT_FIXED_RESIZE_STRATEGY_PROVIDER,
    ]);
    var FLEX_PROVIDERS = __spread(PROVIDERS, [FLEX_RESIZE_STRATEGY_PROVIDER]);
    var TABLE_HOST_BINDINGS = {
        class: 'mat-column-resize-table',
    };
    var FLEX_HOST_BINDINGS = {
        class: 'mat-column-resize-flex',
    };
    var AbstractMatColumnResize = /** @class */ (function (_super) {
        __extends(AbstractMatColumnResize, _super);
        function AbstractMatColumnResize() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        AbstractMatColumnResize.prototype.getTableHeight = function () {
            var table = this.elementRef.nativeElement;
            var tableParent = table.parentNode;
            var isTableContainer = tableParent.classList.contains('mat-table-container');
            return isTableContainer ? tableParent.offsetHeight : table.offsetHeight;
        };
        return AbstractMatColumnResize;
    }(columnResize.ColumnResize));

    /**
     * Explicitly enables column resizing for a table-based mat-table.
     * Individual columns must be annotated specifically.
     */
    var MatColumnResize = /** @class */ (function (_super) {
        __extends(MatColumnResize, _super);
        function MatColumnResize(columnResizeNotifier, elementRef, eventDispatcher, ngZone, notifier) {
            var _this = _super.call(this) || this;
            _this.columnResizeNotifier = columnResizeNotifier;
            _this.elementRef = elementRef;
            _this.eventDispatcher = eventDispatcher;
            _this.ngZone = ngZone;
            _this.notifier = notifier;
            return _this;
        }
        return MatColumnResize;
    }(AbstractMatColumnResize));
    MatColumnResize.decorators = [
        { type: core.Directive, args: [{
                    selector: 'table[mat-table][columnResize]',
                    host: TABLE_HOST_BINDINGS,
                    providers: __spread(TABLE_PROVIDERS, [{ provide: columnResize.ColumnResize, useExisting: MatColumnResize }]),
                },] }
    ];
    /** @nocollapse */
    MatColumnResize.ctorParameters = function () { return [
        { type: columnResize.ColumnResizeNotifier },
        { type: core.ElementRef },
        { type: columnResize.HeaderRowEventDispatcher },
        { type: core.NgZone },
        { type: columnResize.ColumnResizeNotifierSource }
    ]; };

    /**
     * Explicitly enables column resizing for a flexbox-based mat-table.
     * Individual columns must be annotated specifically.
     */
    var MatColumnResizeFlex = /** @class */ (function (_super) {
        __extends(MatColumnResizeFlex, _super);
        function MatColumnResizeFlex(columnResizeNotifier, elementRef, eventDispatcher, ngZone, notifier) {
            var _this = _super.call(this) || this;
            _this.columnResizeNotifier = columnResizeNotifier;
            _this.elementRef = elementRef;
            _this.eventDispatcher = eventDispatcher;
            _this.ngZone = ngZone;
            _this.notifier = notifier;
            return _this;
        }
        return MatColumnResizeFlex;
    }(AbstractMatColumnResize));
    MatColumnResizeFlex.decorators = [
        { type: core.Directive, args: [{
                    selector: 'mat-table[columnResize]',
                    host: FLEX_HOST_BINDINGS,
                    providers: __spread(FLEX_PROVIDERS, [{ provide: columnResize.ColumnResize, useExisting: MatColumnResizeFlex }]),
                },] }
    ];
    /** @nocollapse */
    MatColumnResizeFlex.ctorParameters = function () { return [
        { type: columnResize.ColumnResizeNotifier },
        { type: core.ElementRef },
        { type: columnResize.HeaderRowEventDispatcher },
        { type: core.NgZone },
        { type: columnResize.ColumnResizeNotifierSource }
    ]; };

    /**
     * Component shown over the edge of a resizable column that is responsible
     * for handling column resize mouse events and displaying a vertical line along the column edge.
     */
    var MatColumnResizeOverlayHandle = /** @class */ (function (_super) {
        __extends(MatColumnResizeOverlayHandle, _super);
        function MatColumnResizeOverlayHandle(columnDef, columnResize, directionality, elementRef, eventDispatcher, ngZone, resizeNotifier, resizeRef, styleScheduler, document) {
            var _this = _super.call(this) || this;
            _this.columnDef = columnDef;
            _this.columnResize = columnResize;
            _this.directionality = directionality;
            _this.elementRef = elementRef;
            _this.eventDispatcher = eventDispatcher;
            _this.ngZone = ngZone;
            _this.resizeNotifier = resizeNotifier;
            _this.resizeRef = resizeRef;
            _this.styleScheduler = styleScheduler;
            _this.document = document;
            return _this;
        }
        MatColumnResizeOverlayHandle.prototype.updateResizeActive = function (active) {
            _super.prototype.updateResizeActive.call(this, active);
            this.resizeRef.overlayRef.updateSize({
                height: active
                    ? this.columnResize.getTableHeight()
                    : this.resizeRef.origin.nativeElement.offsetHeight,
            });
        };
        return MatColumnResizeOverlayHandle;
    }(columnResize.ResizeOverlayHandle));
    MatColumnResizeOverlayHandle.decorators = [
        { type: core.Component, args: [{
                    changeDetection: core.ChangeDetectionStrategy.OnPush,
                    encapsulation: core.ViewEncapsulation.None,
                    host: { class: 'mat-column-resize-overlay-thumb' },
                    template: ''
                },] }
    ];
    /** @nocollapse */
    MatColumnResizeOverlayHandle.ctorParameters = function () { return [
        { type: table$1.CdkColumnDef },
        { type: columnResize.ColumnResize },
        { type: bidi.Directionality },
        { type: core.ElementRef },
        { type: columnResize.HeaderRowEventDispatcher },
        { type: core.NgZone },
        { type: columnResize.ColumnResizeNotifierSource },
        { type: columnResize.ResizeRef },
        { type: table$1._CoalescedStyleScheduler, decorators: [{ type: core.Inject, args: [table$1._COALESCED_STYLE_SCHEDULER,] }] },
        { type: undefined, decorators: [{ type: core.Inject, args: [common.DOCUMENT,] }] }
    ]; };

    var AbstractMatResizable = /** @class */ (function (_super) {
        __extends(AbstractMatResizable, _super);
        function AbstractMatResizable() {
            var _this = _super.apply(this, __spread(arguments)) || this;
            _this.minWidthPxInternal = 32;
            return _this;
        }
        AbstractMatResizable.prototype.getInlineHandleCssClassName = function () {
            return 'mat-resizable-handle';
        };
        AbstractMatResizable.prototype.getOverlayHandleComponentType = function () {
            return MatColumnResizeOverlayHandle;
        };
        return AbstractMatResizable;
    }(columnResize.Resizable));
    var RESIZABLE_HOST_BINDINGS = {
        class: 'mat-resizable',
    };
    var RESIZABLE_INPUTS = [
        'minWidthPx: matResizableMinWidthPx',
        'maxWidthPx: matResizableMaxWidthPx',
    ];

    /**
     * Explicitly enables column resizing for a mat-header-cell.
     */
    var MatResizable = /** @class */ (function (_super) {
        __extends(MatResizable, _super);
        function MatResizable(columnDef, columnResize, directionality, document, elementRef, eventDispatcher, injector, ngZone, overlay, resizeNotifier, resizeStrategy, styleScheduler, viewContainerRef, changeDetectorRef) {
            var _this = _super.call(this) || this;
            _this.columnDef = columnDef;
            _this.columnResize = columnResize;
            _this.directionality = directionality;
            _this.elementRef = elementRef;
            _this.eventDispatcher = eventDispatcher;
            _this.injector = injector;
            _this.ngZone = ngZone;
            _this.overlay = overlay;
            _this.resizeNotifier = resizeNotifier;
            _this.resizeStrategy = resizeStrategy;
            _this.styleScheduler = styleScheduler;
            _this.viewContainerRef = viewContainerRef;
            _this.changeDetectorRef = changeDetectorRef;
            _this.isResizable = true;
            _this.document = document;
            return _this;
        }
        Object.defineProperty(MatResizable.prototype, "hasResizableClass", {
            get: function () {
                return this.isResizable ? RESIZABLE_HOST_BINDINGS.class : '';
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MatResizable.prototype, "resizable", {
            get: function () {
                return this.isResizable;
            },
            set: function (newValue) {
                this.isResizable = newValue == null || newValue === '' || newValue;
            },
            enumerable: false,
            configurable: true
        });
        return MatResizable;
    }(AbstractMatResizable));
    MatResizable.decorators = [
        { type: core.Directive, args: [{
                    selector: 'mat-header-cell[resizable], th[mat-header-cell][resizable]',
                    inputs: RESIZABLE_INPUTS,
                },] }
    ];
    /** @nocollapse */
    MatResizable.ctorParameters = function () { return [
        { type: table$1.CdkColumnDef },
        { type: columnResize.ColumnResize },
        { type: bidi.Directionality },
        { type: undefined, decorators: [{ type: core.Inject, args: [common.DOCUMENT,] }] },
        { type: core.ElementRef },
        { type: columnResize.HeaderRowEventDispatcher },
        { type: core.Injector },
        { type: core.NgZone },
        { type: overlay.Overlay },
        { type: columnResize.ColumnResizeNotifierSource },
        { type: columnResize.ResizeStrategy },
        { type: table$1._CoalescedStyleScheduler, decorators: [{ type: core.Inject, args: [table$1._COALESCED_STYLE_SCHEDULER,] }] },
        { type: core.ViewContainerRef },
        { type: core.ChangeDetectorRef }
    ]; };
    MatResizable.propDecorators = {
        hasResizableClass: [{ type: core.HostBinding, args: ['class',] }],
        resizable: [{ type: core.Input }]
    };

    /**
     * @license
     * Copyright Google LLC All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    var ENTRY_COMMON_COMPONENTS = [MatColumnResizeOverlayHandle];
    var MatColumnResizeCommonModule = /** @class */ (function () {
        function MatColumnResizeCommonModule() {
        }
        return MatColumnResizeCommonModule;
    }());
    MatColumnResizeCommonModule.decorators = [
        { type: core.NgModule, args: [{
                    declarations: ENTRY_COMMON_COMPONENTS,
                    exports: ENTRY_COMMON_COMPONENTS,
                    entryComponents: ENTRY_COMMON_COMPONENTS,
                },] }
    ];
    var IMPORTS = [overlay.OverlayModule, MatColumnResizeCommonModule];
    var MatColumnResizeModule = /** @class */ (function () {
        function MatColumnResizeModule() {
        }
        return MatColumnResizeModule;
    }());
    MatColumnResizeModule.decorators = [
        { type: core.NgModule, args: [{
                    imports: IMPORTS,
                    declarations: [MatColumnResize, MatColumnResizeFlex, MatResizable],
                    exports: [MatColumnResize, MatColumnResizeFlex, MatResizable],
                },] }
    ];

    var MtxGridModule = /** @class */ (function () {
        function MtxGridModule() {
        }
        return MtxGridModule;
    }());
    MtxGridModule.decorators = [
        { type: core.NgModule, args: [{
                    imports: [
                        common.CommonModule,
                        forms.FormsModule,
                        table.MatTableModule,
                        sort.MatSortModule,
                        paginator.MatPaginatorModule,
                        checkbox.MatCheckboxModule,
                        button.MatButtonModule,
                        progressBar.MatProgressBarModule,
                        chips.MatChipsModule,
                        tooltip.MatTooltipModule,
                        icon.MatIconModule,
                        select.MatSelectModule,
                        formField.MatFormFieldModule,
                        menu.MatMenuModule,
                        dragDrop.DragDropModule,
                        dialog.MtxDialogModule,
                        utils.MtxUtilsModule,
                        MatColumnResizeModule,
                    ],
                    exports: [
                        MtxGridComponent,
                        MtxGridCellComponent,
                        MtxGridColumnMenuComponent,
                        MtxGridExpansionToggleDirective,
                        MtxGridCellSelectionDirective,
                        MatColumnResizeModule,
                    ],
                    declarations: [
                        MtxGridComponent,
                        MtxGridCellComponent,
                        MtxGridColumnMenuComponent,
                        MtxGridExpansionToggleDirective,
                        MtxGridCellSelectionDirective,
                    ],
                    providers: [MtxGridService],
                },] }
    ];

    /**
     * Generated bundle index. Do not edit.
     */

    Object.defineProperty(exports, 'MAT_TABLE_LAYOUT_FIXED_RESIZE_STRATEGY_PROVIDER', {
        enumerable: true,
        get: function () {
            return columnResize.TABLE_LAYOUT_FIXED_RESIZE_STRATEGY_PROVIDER;
        }
    });
    exports.AbstractMatColumnResize = AbstractMatColumnResize;
    exports.AbstractMatResizable = AbstractMatResizable;
    exports.MAT_FLEX_HOST_BINDINGS = FLEX_HOST_BINDINGS;
    exports.MAT_FLEX_PROVIDERS = FLEX_PROVIDERS;
    exports.MAT_FLEX_RESIZE_STRATEGY_PROVIDER = FLEX_RESIZE_STRATEGY_PROVIDER;
    exports.MAT_RESIZABLE_HOST_BINDINGS = RESIZABLE_HOST_BINDINGS;
    exports.MAT_RESIZABLE_INPUTS = RESIZABLE_INPUTS;
    exports.MAT_TABLE_HOST_BINDINGS = TABLE_HOST_BINDINGS;
    exports.MAT_TABLE_PROVIDERS = TABLE_PROVIDERS;
    exports.MatColumnResize = MatColumnResize;
    exports.MatColumnResizeCommonModule = MatColumnResizeCommonModule;
    exports.MatColumnResizeFlex = MatColumnResizeFlex;
    exports.MatColumnResizeModule = MatColumnResizeModule;
    exports.MatColumnResizeOverlayHandle = MatColumnResizeOverlayHandle;
    exports.MatFlexTableResizeStrategy = MatFlexTableResizeStrategy;
    exports.MatResizable = MatResizable;
    exports.MtxGridCellComponent = MtxGridCellComponent;
    exports.MtxGridCellSelectionDirective = MtxGridCellSelectionDirective;
    exports.MtxGridColumnMenuComponent = MtxGridColumnMenuComponent;
    exports.MtxGridComponent = MtxGridComponent;
    exports.MtxGridExpansionToggleDirective = MtxGridExpansionToggleDirective;
    exports.MtxGridModule = MtxGridModule;
    exports.MtxGridService = MtxGridService;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=mtxGrid.umd.js.map
