(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/common'), require('@angular/forms'), require('@angular/material/menu'), require('@angular/material/form-field'), require('@angular/material/input'), require('ngx-color/chrome'), require('@angular/cdk/a11y'), require('@angular/cdk/coercion'), require('@angular/cdk/platform'), require('rxjs'), require('rxjs/operators')) :
    typeof define === 'function' && define.amd ? define('@ng-matero/extensions/color-picker', ['exports', '@angular/core', '@angular/common', '@angular/forms', '@angular/material/menu', '@angular/material/form-field', '@angular/material/input', 'ngx-color/chrome', '@angular/cdk/a11y', '@angular/cdk/coercion', '@angular/cdk/platform', 'rxjs', 'rxjs/operators'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory((global['ng-matero'] = global['ng-matero'] || {}, global['ng-matero'].extensions = global['ng-matero'].extensions || {}, global['ng-matero'].extensions['color-picker'] = {}), global.ng.core, global.ng.common, global.ng.forms, global.ng.material.menu, global.ng.material.formField, global.ng.material.input, global['ngx-color-chrome'], global.ng.cdk.a11y, global.ng.cdk.coercion, global.ng.cdk.platform, global.rxjs, global.rxjs.operators));
}(this, (function (exports, core, common, forms, menu, formField, input, chrome, a11y, coercion, platform, rxjs, operators) { 'use strict';

    var nextUniqueId = 0;
    var MtxColorPickerComponent = /** @class */ (function () {
        function MtxColorPickerComponent(_focusMonitor, _elementRef, _changeDetectorRef, _zone, ngControl, _formField, _document) {
            var _this = this;
            this._focusMonitor = _focusMonitor;
            this._elementRef = _elementRef;
            this._changeDetectorRef = _changeDetectorRef;
            this._zone = _zone;
            this.ngControl = ngControl;
            this._formField = _formField;
            this._document = _document;
            this._value = '';
            /** Implemented as part of MatFormFieldControl. */
            this.stateChanges = new rxjs.Subject();
            /** Unique id for this input. */
            this._uid = "mtx-color-picker-" + nextUniqueId++;
            this._focused = false;
            this._required = false;
            this._disabled = false;
            this._readonly = false;
            this.errorState = false;
            /** A name for this control that can be used by `mat-form-field`. */
            this.controlType = 'mtx-color-picker';
            /** `View -> model callback called when value changes` */
            this._onChange = function () { };
            /** `View -> model callback called when color picker has been touched` */
            this._onTouched = function () { };
            /** Event emitted when the color changed */
            this.colorChange = new core.EventEmitter();
            /** Whether or not the overlay panel is open. */
            this._panelOpen = false;
            /**
             * Whether the color picker can open the next time it is focused. Used to prevent a focused,
             * closed color picker from being reopened if the user switches to another browser tab and then
             * comes back.
             */
            this._canOpenOnNextFocus = true;
            /**
             * Event handler for when the window is blurred. Needs to be an
             * arrow function in order to preserve the context.
             */
            this._windowBlurHandler = function () {
                // If the user blurred the window while the color picker is focused, it means that it'll be
                // refocused when they come back. In this case we want to skip the first focus event, if the
                // pane was closed, in order to avoid reopening it unintentionally.
                _this._canOpenOnNextFocus =
                    _this._document.activeElement !== _this._elementRef.nativeElement || _this._panelOpen;
            };
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
        Object.defineProperty(MtxColorPickerComponent.prototype, "value", {
            /** Value of the color picker control. */
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
        Object.defineProperty(MtxColorPickerComponent.prototype, "id", {
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
        Object.defineProperty(MtxColorPickerComponent.prototype, "placeholder", {
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
        Object.defineProperty(MtxColorPickerComponent.prototype, "focused", {
            /** Whether the input is focused. */
            get: function () {
                return this._focused || this._panelOpen;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MtxColorPickerComponent.prototype, "empty", {
            get: function () {
                return !this.value;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MtxColorPickerComponent.prototype, "shouldLabelFloat", {
            get: function () {
                return this.focused || !this.empty;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MtxColorPickerComponent.prototype, "required", {
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
        Object.defineProperty(MtxColorPickerComponent.prototype, "disabled", {
            get: function () {
                return this._disabled;
            },
            set: function (value) {
                this._disabled = coercion.coerceBooleanProperty(value);
                this.stateChanges.next();
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MtxColorPickerComponent.prototype, "readonly", {
            /** Whether the element is readonly. */
            get: function () {
                return this._readonly;
            },
            set: function (value) {
                this._readonly = coercion.coerceBooleanProperty(value);
            },
            enumerable: false,
            configurable: true
        });
        MtxColorPickerComponent.prototype.ngDoCheck = function () {
            if (this.ngControl) {
                this.errorState = (this.ngControl.invalid && this.ngControl.touched);
                this.stateChanges.next();
            }
        };
        MtxColorPickerComponent.prototype.ngAfterViewInit = function () {
            var _this = this;
            if (typeof window !== 'undefined') {
                this._zone.runOutsideAngular(function () {
                    window.addEventListener('blur', _this._windowBlurHandler);
                });
                if (platform._supportsShadowDom()) {
                    var element = this._elementRef.nativeElement;
                    var rootNode = element.getRootNode ? element.getRootNode() : null;
                    // We need to take the `ShadowRoot` off of `window`, because the built-in types are
                    // incorrect. See https://github.com/Microsoft/TypeScript/issues/27929.
                    this._isInsideShadowRoot = rootNode instanceof window.ShadowRoot;
                }
            }
        };
        MtxColorPickerComponent.prototype.ngOnDestroy = function () {
            this.stateChanges.complete();
            this._focusMonitor.stopMonitoring(this._elementRef);
        };
        /** Implemented as part of MatFormFieldControl. */
        MtxColorPickerComponent.prototype.setDescribedByIds = function (ids) {
            this._ariaDescribedby = ids.join(' ');
        };
        /** Implemented as part of MatFormFieldControl. */
        MtxColorPickerComponent.prototype.onContainerClick = function () {
            this._handleFocus();
        };
        /**
         * Sets the model value. Implemented as part of ControlValueAccessor.
         * @param value New value to be written to the model.
         */
        MtxColorPickerComponent.prototype.writeValue = function (value) {
            this.value = value || '';
            this._changeDetectorRef.markForCheck();
        };
        /**
         * Registers a callback to be triggered when the model value changes.
         * Implemented as part of ControlValueAccessor.
         * @param fn Callback to be registered.
         */
        MtxColorPickerComponent.prototype.registerOnChange = function (fn) {
            this._onChange = fn;
        };
        /**
         * Registers a callback to be triggered when the control is touched.
         * Implemented as part of ControlValueAccessor.
         * @param fn Callback to be registered.
         */
        MtxColorPickerComponent.prototype.registerOnTouched = function (fn) {
            this._onTouched = fn;
        };
        /**
         * Sets the disabled state of the control. Implemented as a part of ControlValueAccessor.
         * @param isDisabled Whether the control should be disabled.
         */
        MtxColorPickerComponent.prototype.setDisabledState = function (isDisabled) {
            this.disabled = isDisabled;
        };
        /** Open panel with input focus event. */
        MtxColorPickerComponent.prototype._handleFocus = function () {
            var _this = this;
            this.trigger.openMenu();
            this._closingActionsSubscription = rxjs.merge(this._getOutsideClickStream())
                .pipe()
                .subscribe(function (event) {
                _this.trigger.closeMenu();
                _this._closingActionsSubscription.unsubscribe();
            });
        };
        /** Opens the overlay panel. */
        MtxColorPickerComponent.prototype._openPanel = function () {
            if (this._focused) {
                this._panelOpen = true;
            }
        };
        /** Closes the overlay panel and focuses the host element. */
        MtxColorPickerComponent.prototype._closePanel = function () {
            if (this._panelOpen) {
                this._panelOpen = false;
                this._changeDetectorRef.markForCheck();
                this._onTouched();
            }
        };
        /** The callback of color changed. */
        MtxColorPickerComponent.prototype._onColorChanged = function (model) {
            this.value = model.color.hex;
            this.colorChange.emit(model);
        };
        /** Stream of clicks outside of the color picker panel. */
        MtxColorPickerComponent.prototype._getOutsideClickStream = function () {
            var _this = this;
            return rxjs.merge(rxjs.fromEvent(this._document, 'click'), rxjs.fromEvent(this._document, 'touchend')).pipe(operators.filter(function (event) {
                // If we're in the Shadow DOM, the event target will be the shadow root, so we have to
                // fall back to check the first element in the path of the click event.
                var clickTarget = (_this._isInsideShadowRoot && event.composedPath ? event.composedPath()[0] : event.target);
                var formField = _this._formField ? _this._formField._elementRef.nativeElement : null;
                return (clickTarget !== _this._elementRef.nativeElement &&
                    (!formField || !formField.contains(clickTarget)));
            }));
        };
        return MtxColorPickerComponent;
    }());
    MtxColorPickerComponent.decorators = [
        { type: core.Component, args: [{
                    selector: 'mtx-color-picker',
                    exportAs: 'mtxColorPicker',
                    template: "<input matInput\n       [(ngModel)]=\"value\"\n       [placeholder]=\"placeholder\"\n       [disabled]=\"disabled\"\n       [readonly]=\"readonly\"\n       (focus)=\"_handleFocus()\"\n       autocomplete=\"off\">\n\n<div #colorPickerTrigger=\"matMenuTrigger\"\n     [matMenuTriggerFor]=\"colorPickerPopover\"\n     (menuOpened)=\"_openPanel()\"\n     (menuClosed)=\"_closePanel()\">\n</div>\n\n<mat-menu #colorPickerPopover=\"matMenu\" class=\"mtx-color-picker-panel\" [hasBackdrop]=\"false\">\n  <div class=\"mtx-color-picker\"\n       (click)=\"$event.stopPropagation()\"\n       (keydown)=\"$event.stopPropagation()\">\n    <color-chrome [color]=\"value\" (onChangeComplete)=\"_onColorChanged($event)\"></color-chrome>\n  </div>\n</mat-menu>\n",
                    encapsulation: core.ViewEncapsulation.None,
                    changeDetection: core.ChangeDetectionStrategy.OnPush,
                    providers: [{ provide: formField.MatFormFieldControl, useExisting: MtxColorPickerComponent }],
                    styles: [".mtx-color-picker-panel .mat-menu-content:not(:empty){padding:0}.mtx-color-picker-panel .mtx-color-picker{padding:8px}.mtx-color-picker-panel .mtx-color-picker .chrome-picker{box-shadow:none;border-radius:0}.mtx-color-picker-panel .mtx-color-picker .chrome-picker .saturation{border-radius:0}"]
                },] }
    ];
    /** @nocollapse */
    MtxColorPickerComponent.ctorParameters = function () { return [
        { type: a11y.FocusMonitor },
        { type: core.ElementRef },
        { type: core.ChangeDetectorRef },
        { type: core.NgZone },
        { type: forms.NgControl, decorators: [{ type: core.Optional }, { type: core.Self }] },
        { type: formField.MatFormField, decorators: [{ type: core.Optional }, { type: core.Host }] },
        { type: undefined, decorators: [{ type: core.Optional }, { type: core.Inject, args: [common.DOCUMENT,] }] }
    ]; };
    MtxColorPickerComponent.propDecorators = {
        value: [{ type: core.Input }],
        id: [{ type: core.Input }],
        placeholder: [{ type: core.Input }],
        required: [{ type: core.Input }],
        disabled: [{ type: core.Input }],
        readonly: [{ type: core.Input }],
        colorChange: [{ type: core.Output }],
        trigger: [{ type: core.ViewChild, args: [menu.MatMenuTrigger, { static: true },] }]
    };

    var MtxColorPickerModule = /** @class */ (function () {
        function MtxColorPickerModule() {
        }
        return MtxColorPickerModule;
    }());
    MtxColorPickerModule.decorators = [
        { type: core.NgModule, args: [{
                    imports: [
                        common.CommonModule,
                        forms.FormsModule,
                        menu.MatMenuModule,
                        formField.MatFormFieldModule,
                        input.MatInputModule,
                        chrome.ColorChromeModule,
                    ],
                    exports: [MtxColorPickerComponent],
                    declarations: [MtxColorPickerComponent],
                },] }
    ];

    /**
     * Generated bundle index. Do not edit.
     */

    exports.MtxColorPickerComponent = MtxColorPickerComponent;
    exports.MtxColorPickerModule = MtxColorPickerModule;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=mtxColorPicker.umd.js.map
