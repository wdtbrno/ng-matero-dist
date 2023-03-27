(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/common'), require('@angular/cdk/overlay'), require('@angular/cdk/a11y'), require('@angular/cdk/coercion'), require('@angular/cdk/keycodes'), require('@angular/cdk/bidi'), require('@angular/animations'), require('@angular/cdk/portal'), require('rxjs'), require('rxjs/operators')) :
    typeof define === 'function' && define.amd ? define('@ng-matero/extensions/popover', ['exports', '@angular/core', '@angular/common', '@angular/cdk/overlay', '@angular/cdk/a11y', '@angular/cdk/coercion', '@angular/cdk/keycodes', '@angular/cdk/bidi', '@angular/animations', '@angular/cdk/portal', 'rxjs', 'rxjs/operators'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory((global['ng-matero'] = global['ng-matero'] || {}, global['ng-matero'].extensions = global['ng-matero'].extensions || {}, global['ng-matero'].extensions.popover = {}), global.ng.core, global.ng.common, global.ng.cdk.overlay, global.ng.cdk.a11y, global.ng.cdk.coercion, global.ng.cdk.keycodes, global.ng.cdk.bidi, global.ng.animations, global.ng.cdk.portal, global.rxjs, global.rxjs.operators));
}(this, (function (exports, core, common, overlay, a11y, coercion, keycodes, bidi, animations, portal, rxjs, operators) { 'use strict';

    /**
     * Throws an exception for the case when popover trigger doesn't have a valid mtx-popover instance
     */
    function throwMtxPopoverMissingError() {
        throw Error("mtx-popover-trigger: must pass in an mtx-popover instance.\n\n    Example:\n      <mtx-popover #popover=\"mtxPopover\"></mtx-popover>\n      <button [mtxPopoverTriggerFor]=\"popover\"></button>");
    }
    /**
     * Throws an exception for the case when popover's mtxPopoverPosition[0] value isn't valid.
     * In other words, it doesn't match 'above', 'below', 'before' or 'after'.
     */
    function throwMtxPopoverInvalidPositionStart() {
        throw Error("mtxPopoverPosition[0] value must be either 'above', 'below', 'before' or 'after'.\n    Example: <mtx-popover [position]=\"['below', 'after']\" #popover=\"mtxPopover\"></mtx-popover>");
    }
    /**
     * Throws an exception for the case when popover's mtxPopoverPosition[1] value isn't valid.
     * In other words, it doesn't match 'above', 'below', 'before', 'after' or 'center'.
     */
    function throwMtxPopoverInvalidPositionEnd() {
        throw Error("mtxPopoverPosition[1] value must be either 'above', 'below', 'before', 'after' or 'center'.\n    Example: <mtx-popover [position]=\"['below', 'after']\" #popover=\"mtxPopover\"></mtx-popover>");
    }

    /**
     * Below are all the animations for the md-popover component.
     * Animation duration and timing values are based on AngularJS Material.
     */
    /**
     * This animation controls the popover panel's entry and exit from the page.
     *
     * When the popover panel is added to the DOM, it scales in and fades in its border.
     *
     * When the popover panel is removed from the DOM, it simply fades out after a brief
     * delay to display the ripple.
     */
    var transformPopover = animations.trigger('transformPopover', [
        animations.state('enter', animations.style({
            opacity: 1,
            transform: "scale(1)",
        })),
        animations.transition('void => *', [
            animations.style({
                opacity: 0,
                transform: "scale(0)",
            }),
            animations.animate("200ms cubic-bezier(0.25, 0.8, 0.25, 1)"),
        ]),
        animations.transition('* => void', [animations.animate('50ms 100ms linear', animations.style({ opacity: 0 }))]),
    ]);

    var MtxPopover = /** @class */ (function () {
        function MtxPopover(_dir, _elementRef, zone) {
            this._dir = _dir;
            this._elementRef = _elementRef;
            this.zone = zone;
            this.role = 'dialog';
            /** Settings for popover, view setters and getters for more detail */
            this._position = ['below', 'after'];
            this._triggerEvent = 'hover';
            this._scrollStrategy = 'reposition';
            this._enterDelay = 100;
            this._leaveDelay = 100;
            this._panelOffsetX = 0;
            this._panelOffsetY = 0;
            this._closeOnPanelClick = false;
            this._closeOnBackdropClick = true;
            this._disableAnimation = false;
            this._focusTrapEnabled = true;
            this._focusTrapAutoCaptureEnabled = true;
            this._arrowOffsetX = 20;
            this._arrowOffsetY = 20;
            this._arrowWidth = 16;
            this._arrowHeight = 16;
            /** Config object to be passed into the popover's ngClass */
            this._classList = {};
            /** Whether popover's `targetElement` is defined */
            this.containerPositioning = false;
            /** Closing disabled on popover */
            this.closeDisabled = false;
            /** Emits the current animation state whenever it changes. */
            this._onAnimationStateChange = new core.EventEmitter();
            /** Event emitted when the popover is closed. */
            this.closed = new core.EventEmitter();
            this.setPositionClasses();
        }
        Object.defineProperty(MtxPopover.prototype, "position", {
            /** Position of the popover. */
            get: function () {
                return this._position;
            },
            set: function (value) {
                if (!['before', 'after', 'above', 'below'].includes(value[0])) {
                    throwMtxPopoverInvalidPositionStart();
                }
                if (!['before', 'after', 'above', 'below', 'center'].includes(value[1])) {
                    throwMtxPopoverInvalidPositionEnd();
                }
                this._position = value;
                this.setPositionClasses();
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MtxPopover.prototype, "triggerEvent", {
            /** Popover trigger event */
            get: function () {
                return this._triggerEvent;
            },
            set: function (value) {
                this._triggerEvent = value;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MtxPopover.prototype, "scrollStrategy", {
            /** Popover scroll strategy */
            get: function () {
                return this._scrollStrategy;
            },
            set: function (value) {
                this._scrollStrategy = value;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MtxPopover.prototype, "enterDelay", {
            /** Popover enter delay */
            get: function () {
                return this._enterDelay;
            },
            set: function (value) {
                this._enterDelay = value;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MtxPopover.prototype, "leaveDelay", {
            /** Popover leave delay */
            get: function () {
                return this._leaveDelay;
            },
            set: function (value) {
                this._leaveDelay = value;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MtxPopover.prototype, "xOffset", {
            /** Popover target offset x */
            get: function () {
                return this._panelOffsetX;
            },
            set: function (value) {
                this._panelOffsetX = value;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MtxPopover.prototype, "yOffset", {
            /** Popover target offset y */
            get: function () {
                return this._panelOffsetY;
            },
            set: function (value) {
                this._panelOffsetY = value;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MtxPopover.prototype, "arrowOffsetX", {
            /** Popover arrow offset x */
            get: function () {
                return this._arrowOffsetX;
            },
            set: function (value) {
                this._arrowOffsetX = value;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MtxPopover.prototype, "arrowOffsetY", {
            /** Popover arrow offset y */
            get: function () {
                return this._arrowOffsetY;
            },
            set: function (value) {
                this._arrowOffsetY = value;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MtxPopover.prototype, "arrowWidth", {
            /** Popover arrow width */
            get: function () {
                return this._arrowWidth;
            },
            set: function (value) {
                this._arrowWidth = value;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MtxPopover.prototype, "arrowHeight", {
            /** Popover arrow height */
            get: function () {
                return this._arrowHeight;
            },
            set: function (value) {
                this._arrowHeight = value;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MtxPopover.prototype, "closeOnPanelClick", {
            /** Popover close on container click */
            get: function () {
                return this._closeOnPanelClick;
            },
            set: function (value) {
                this._closeOnPanelClick = coercion.coerceBooleanProperty(value);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MtxPopover.prototype, "closeOnBackdropClick", {
            /** Popover close on backdrop click */
            get: function () {
                return this._closeOnBackdropClick;
            },
            set: function (value) {
                this._closeOnBackdropClick = coercion.coerceBooleanProperty(value);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MtxPopover.prototype, "disableAnimation", {
            /** Disable animations of popover and all child elements */
            get: function () {
                return this._disableAnimation;
            },
            set: function (value) {
                this._disableAnimation = coercion.coerceBooleanProperty(value);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MtxPopover.prototype, "focusTrapEnabled", {
            /** Popover focus trap using cdkTrapFocus */
            get: function () {
                return this._focusTrapEnabled;
            },
            set: function (value) {
                this._focusTrapEnabled = coercion.coerceBooleanProperty(value);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MtxPopover.prototype, "focusTrapAutoCaptureEnabled", {
            /** Popover focus trap auto capture using cdkTrapFocusAutoCapture */
            get: function () {
                return this._focusTrapAutoCaptureEnabled;
            },
            set: function (value) {
                this._focusTrapAutoCaptureEnabled = coercion.coerceBooleanProperty(value);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MtxPopover.prototype, "panelClass", {
            /**
             * This method takes classes set on the host md-popover element and applies them on the
             * popover template that displays in the overlay container.  Otherwise, it's difficult
             * to style the containing popover from outside the component.
             * @param classes list of class names
             */
            set: function (classes) {
                if (classes && classes.length) {
                    this._classList = classes.split(' ').reduce(function (obj, className) {
                        obj[className] = true;
                        return obj;
                    }, {});
                    this._elementRef.nativeElement.className = '';
                    this.setPositionClasses();
                }
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MtxPopover.prototype, "classList", {
            /**
             * This method takes classes set on the host md-popover element and applies them on the
             * popover template that displays in the overlay container.  Otherwise, it's difficult
             * to style the containing popover from outside the component.
             * @deprecated Use `panelClass` instead.
             * @breaking-change 8.0.0
             */
            get: function () {
                return this.panelClass;
            },
            set: function (classes) {
                this.panelClass = classes;
            },
            enumerable: false,
            configurable: true
        });
        MtxPopover.prototype.ngOnDestroy = function () {
            this._emitCloseEvent();
            this.closed.complete();
        };
        /** Handle a keyboard event from the popover, delegating to the appropriate action. */
        MtxPopover.prototype._handleKeydown = function (event) {
            switch (event.keyCode) {
                case keycodes.ESCAPE:
                    this._emitCloseEvent();
                    return;
            }
        };
        /**
         * This emits a close event to which the trigger is subscribed. When emitted, the
         * trigger will close the popover.
         */
        MtxPopover.prototype._emitCloseEvent = function () {
            this.closed.emit();
        };
        /** Close popover on click if closeOnPanelClick is true */
        MtxPopover.prototype.onClick = function () {
            if (this.closeOnPanelClick) {
                this._emitCloseEvent();
            }
        };
        /**
         * TODO: Refactor when @angular/cdk includes feature I mentioned on github see link below.
         * https://github.com/angular/material2/pull/5493#issuecomment-313085323
         */
        /** Disables close of popover when leaving trigger element and mouse over the popover */
        MtxPopover.prototype.onMouseOver = function () {
            if (this.triggerEvent === 'hover') {
                this.closeDisabled = true;
            }
        };
        /** Enables close of popover when mouse leaving popover element */
        MtxPopover.prototype.onMouseLeave = function () {
            if (this.triggerEvent === 'hover') {
                this.closeDisabled = false;
                this._emitCloseEvent();
            }
        };
        // TODO: Refactor how styles are set and updated on the component, use best practices.
        // TODO: If arrow left and right positioning is requested, see if flex direction can be used to work with order.
        /** Sets the current styles for the popover to allow for dynamically changing settings */
        MtxPopover.prototype.setCurrentStyles = function (pos) {
            if (pos === void 0) { pos = this.position; }
            var left = pos[1] === 'after'
                ? this.arrowOffsetX - this.arrowWidth / 2 + "px"
                : pos[1] === 'center'
                    ? "calc(50% - " + this.arrowWidth / 2 + "px)"
                    : '';
            var right = pos[1] === 'before' ? this.arrowOffsetX - this.arrowWidth / 2 + "px" : '';
            var bottom = pos[1] === 'above'
                ? this.arrowOffsetY - this.arrowHeight / 2 + "px"
                : pos[1] === 'center'
                    ? "calc(50% - " + this.arrowHeight / 2 + "px)"
                    : '';
            var top = pos[1] === 'below' ? this.arrowOffsetY - this.arrowHeight / 2 + "px" : '';
            this.popoverArrowStyles =
                pos[0] === 'above' || pos[0] === 'below'
                    ? {
                        left: this._dir.value === 'ltr' ? left : right,
                        right: this._dir.value === 'ltr' ? right : left,
                    }
                    : {
                        top: top,
                        bottom: bottom,
                    };
        };
        /**
         * It's necessary to set position-based classes to ensure the popover panel animation
         * folds out from the correct direction.
         */
        MtxPopover.prototype.setPositionClasses = function (pos) {
            if (pos === void 0) { pos = this.position; }
            this._classList['mtx-popover-before-above'] = pos[0] === 'before' && pos[1] === 'above';
            this._classList['mtx-popover-before-center'] = pos[0] === 'before' && pos[1] === 'center';
            this._classList['mtx-popover-before-below'] = pos[0] === 'before' && pos[1] === 'below';
            this._classList['mtx-popover-after-above'] = pos[0] === 'after' && pos[1] === 'above';
            this._classList['mtx-popover-after-center'] = pos[0] === 'after' && pos[1] === 'center';
            this._classList['mtx-popover-after-below'] = pos[0] === 'after' && pos[1] === 'below';
            this._classList['mtx-popover-above-before'] = pos[0] === 'above' && pos[1] === 'before';
            this._classList['mtx-popover-above-center'] = pos[0] === 'above' && pos[1] === 'center';
            this._classList['mtx-popover-above-after'] = pos[0] === 'above' && pos[1] === 'after';
            this._classList['mtx-popover-below-before'] = pos[0] === 'below' && pos[1] === 'before';
            this._classList['mtx-popover-below-center'] = pos[0] === 'below' && pos[1] === 'center';
            this._classList['mtx-popover-below-after'] = pos[0] === 'below' && pos[1] === 'after';
        };
        return MtxPopover;
    }());
    MtxPopover.decorators = [
        { type: core.Component, args: [{
                    selector: 'mtx-popover',
                    template: "<ng-template>\r\n  <div class=\"mtx-popover-panel mat-elevation-z8\" role=\"dialog\"\r\n       [ngClass]=\"_classList\"\r\n       [ngStyle]=\"popoverPanelStyles\"\r\n       (keydown)=\"_handleKeydown($event)\"\r\n       (click)=\"onClick()\"\r\n       (mouseover)=\"onMouseOver()\"\r\n       (mouseleave)=\"onMouseLeave()\"\r\n       [@.disabled]=\"disableAnimation\"\r\n       [@transformPopover]=\"'enter'\">\r\n    <div class=\"mtx-popover-direction-arrow\" [ngStyle]=\"popoverArrowStyles\"></div>\r\n    <div class=\"mtx-popover-content\"\r\n         [ngStyle]=\"popoverContentStyles\"\r\n         [cdkTrapFocus]=\"focusTrapEnabled\"\r\n         [cdkTrapFocusAutoCapture]=\"focusTrapAutoCaptureEnabled\">\r\n      <ng-content></ng-content>\r\n    </div>\r\n  </div>\r\n</ng-template>\r\n",
                    changeDetection: core.ChangeDetectionStrategy.OnPush,
                    encapsulation: core.ViewEncapsulation.None,
                    animations: [transformPopover],
                    exportAs: 'mtxPopover',
                    styles: [".mtx-popover-panel{max-height:calc(100vh - 48px);padding:8px;border-radius:4px;font-size:16px}.mtx-popover-panel[class*=mtx-popover-below]{margin-top:calc(.5em + 2px)}.mtx-popover-panel[class*=mtx-popover-above]{margin-bottom:calc(.5em + 2px)}.mtx-popover-panel[class*=mtx-popover-before]{margin-right:calc(.5em + 2px)}[dir=rtl] .mtx-popover-panel[class*=mtx-popover-before]{margin-right:auto;margin-left:calc(.5em + 2px)}.mtx-popover-panel[class*=mtx-popover-after]{margin-left:calc(.5em + 2px)}[dir=rtl] .mtx-popover-panel[class*=mtx-popover-after]{margin-left:auto;margin-right:calc(.5em + 2px)}.mtx-popover-direction-arrow{position:absolute}.mtx-popover-direction-arrow:after,.mtx-popover-direction-arrow:before{position:absolute;display:inline-block;content:\"\";border-width:.5em;border-style:solid}.mtx-popover-direction-arrow:after{border-width:calc(.5em - 1px)}[class*=mtx-popover-above] .mtx-popover-direction-arrow,[class*=mtx-popover-below] .mtx-popover-direction-arrow{width:1em}[class*=mtx-popover-above] .mtx-popover-direction-arrow:after,[class*=mtx-popover-below] .mtx-popover-direction-arrow:after{left:1px}[dir=rtl] [class*=mtx-popover-above] .mtx-popover-direction-arrow:after,[dir=rtl] [class*=mtx-popover-below] .mtx-popover-direction-arrow:after{right:1px;left:auto}[class*=mtx-popover-below] .mtx-popover-direction-arrow{top:0}[class*=mtx-popover-below] .mtx-popover-direction-arrow:after,[class*=mtx-popover-below] .mtx-popover-direction-arrow:before{bottom:0;border-top-width:0}[class*=mtx-popover-above] .mtx-popover-direction-arrow{bottom:0}[class*=mtx-popover-above] .mtx-popover-direction-arrow:after,[class*=mtx-popover-above] .mtx-popover-direction-arrow:before{top:0;border-bottom-width:0}[class*=mtx-popover-after] .mtx-popover-direction-arrow,[class*=mtx-popover-before] .mtx-popover-direction-arrow{height:1em}[class*=mtx-popover-after] .mtx-popover-direction-arrow:after,[class*=mtx-popover-before] .mtx-popover-direction-arrow:after{top:1px}[class*=mtx-popover-before] .mtx-popover-direction-arrow{right:0}[class*=mtx-popover-before] .mtx-popover-direction-arrow:after,[class*=mtx-popover-before] .mtx-popover-direction-arrow:before{left:0;border-right-width:0}[dir=rtl] [class*=mtx-popover-before] .mtx-popover-direction-arrow{right:auto;left:0}[dir=rtl] [class*=mtx-popover-before] .mtx-popover-direction-arrow:after,[dir=rtl] [class*=mtx-popover-before] .mtx-popover-direction-arrow:before{left:auto;right:0;border-left-width:0}[dir=rtl] [class*=mtx-popover-before] .mtx-popover-direction-arrow:before{border-right-width:.5em}[dir=rtl] [class*=mtx-popover-before] .mtx-popover-direction-arrow:after{border-right-width:calc(.5em - 1px)}[class*=mtx-popover-after] .mtx-popover-direction-arrow{left:0}[class*=mtx-popover-after] .mtx-popover-direction-arrow:after,[class*=mtx-popover-after] .mtx-popover-direction-arrow:before{right:0;border-left-width:0}[dir=rtl] [class*=mtx-popover-after] .mtx-popover-direction-arrow{left:auto;right:0}[dir=rtl] [class*=mtx-popover-after] .mtx-popover-direction-arrow:after,[dir=rtl] [class*=mtx-popover-after] .mtx-popover-direction-arrow:before{right:auto;left:0;border-right-width:0}[dir=rtl] [class*=mtx-popover-after] .mtx-popover-direction-arrow:before{border-left-width:.5em}[dir=rtl] [class*=mtx-popover-after] .mtx-popover-direction-arrow:after{border-left-width:calc(.5em - 1px)}"]
                },] }
    ];
    /** @nocollapse */
    MtxPopover.ctorParameters = function () { return [
        { type: bidi.Directionality, decorators: [{ type: core.Optional }] },
        { type: core.ElementRef },
        { type: core.NgZone }
    ]; };
    MtxPopover.propDecorators = {
        role: [{ type: core.HostBinding, args: ['attr.role',] }],
        position: [{ type: core.Input }],
        triggerEvent: [{ type: core.Input }],
        scrollStrategy: [{ type: core.Input }],
        enterDelay: [{ type: core.Input }],
        leaveDelay: [{ type: core.Input }],
        xOffset: [{ type: core.Input }],
        yOffset: [{ type: core.Input }],
        arrowOffsetX: [{ type: core.Input }],
        arrowOffsetY: [{ type: core.Input }],
        arrowWidth: [{ type: core.Input }],
        arrowHeight: [{ type: core.Input }],
        closeOnPanelClick: [{ type: core.Input }],
        closeOnBackdropClick: [{ type: core.Input }],
        disableAnimation: [{ type: core.Input }],
        focusTrapEnabled: [{ type: core.Input }],
        focusTrapAutoCaptureEnabled: [{ type: core.Input }],
        panelClass: [{ type: core.Input, args: ['class',] }],
        classList: [{ type: core.Input }],
        closed: [{ type: core.Output }],
        templateRef: [{ type: core.ViewChild, args: [core.TemplateRef,] }]
    };

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
     * This directive is intended to be used in conjunction with an mtx-popover tag. It is
     * responsible for toggling the display of the provided popover instance.
     */
    var MtxPopoverTrigger = /** @class */ (function () {
        function MtxPopoverTrigger(_overlay, _elementRef, _viewContainerRef, _dir, _changeDetectorRef) {
            this._overlay = _overlay;
            this._elementRef = _elementRef;
            this._viewContainerRef = _viewContainerRef;
            this._dir = _dir;
            this._changeDetectorRef = _changeDetectorRef;
            this.ariaHaspopup = true;
            this.popoverOpened$ = new rxjs.Subject();
            this.popoverClosed$ = new rxjs.Subject();
            this._overlayRef = null;
            this._popoverOpen = false;
            this._halt = false;
            // tracking input type is necessary so it's possible to only auto-focus
            // the first item of the list when the popover is opened via the keyboard
            this._openedByMouse = false;
            this._onDestroy = new rxjs.Subject();
            /** Event emitted when the associated popover is opened. */
            this.popoverOpened = new core.EventEmitter();
            /** Event emitted when the associated popover is closed. */
            this.popoverClosed = new core.EventEmitter();
        }
        MtxPopoverTrigger.prototype.ngAfterViewInit = function () {
            var _this = this;
            this._checkPopover();
            this._setCurrentConfig();
            this.popover.closed.subscribe(function () { return _this.closePopover(); });
        };
        MtxPopoverTrigger.prototype.ngOnDestroy = function () {
            this.destroyPopover();
        };
        MtxPopoverTrigger.prototype._setCurrentConfig = function () {
            if (this.triggerEvent) {
                this.popover.triggerEvent = this.triggerEvent;
            }
            this.popover.setCurrentStyles();
        };
        Object.defineProperty(MtxPopoverTrigger.prototype, "popoverOpen", {
            /** Whether the popover is open. */
            get: function () {
                return this._popoverOpen;
            },
            enumerable: false,
            configurable: true
        });
        MtxPopoverTrigger.prototype.onClick = function (event) {
            if (this.popover.triggerEvent === 'click') {
                this.togglePopover();
            }
        };
        MtxPopoverTrigger.prototype.onMouseEnter = function (event) {
            var _this = this;
            this._halt = false;
            if (this.popover.triggerEvent === 'hover') {
                this._mouseoverTimer = setTimeout(function () {
                    _this.openPopover();
                }, this.popover.enterDelay);
            }
        };
        MtxPopoverTrigger.prototype.onMouseLeave = function (event) {
            var _this = this;
            if (this.popover.triggerEvent === 'hover') {
                if (this._mouseoverTimer) {
                    clearTimeout(this._mouseoverTimer);
                    this._mouseoverTimer = null;
                }
                if (this._popoverOpen) {
                    setTimeout(function () {
                        if (!_this.popover.closeDisabled) {
                            _this.closePopover();
                        }
                    }, this.popover.leaveDelay);
                }
                else {
                    this._halt = true;
                }
            }
        };
        /** Toggles the popover between the open and closed states. */
        MtxPopoverTrigger.prototype.togglePopover = function () {
            return this._popoverOpen ? this.closePopover() : this.openPopover();
        };
        /** Opens the popover. */
        MtxPopoverTrigger.prototype.openPopover = function () {
            if (!this._popoverOpen && !this._halt) {
                this._createOverlay().attach(this._portal);
                this._subscribeToBackdrop();
                this._subscribeToDetachments();
                this._initPopover();
            }
        };
        /** Closes the popover. */
        MtxPopoverTrigger.prototype.closePopover = function () {
            if (this._overlayRef) {
                this._overlayRef.detach();
                this._resetPopover();
            }
            this.destroyPopover();
        };
        /** Removes the popover from the DOM. */
        MtxPopoverTrigger.prototype.destroyPopover = function () {
            if (this._mouseoverTimer) {
                clearTimeout(this._mouseoverTimer);
                this._mouseoverTimer = null;
            }
            if (this._overlayRef) {
                this._overlayRef.dispose();
                this._overlayRef = null;
                this._cleanUpSubscriptions();
            }
            this._onDestroy.next();
            this._onDestroy.complete();
        };
        /** Focuses the popover trigger. */
        MtxPopoverTrigger.prototype.focus = function () {
            this._elementRef.nativeElement.focus();
        };
        Object.defineProperty(MtxPopoverTrigger.prototype, "dir", {
            /** The text direction of the containing app. */
            get: function () {
                return this._dir && this._dir.value === 'rtl' ? 'rtl' : 'ltr';
            },
            enumerable: false,
            configurable: true
        });
        /**
         * This method ensures that the popover closes when the overlay backdrop is clicked.
         * We do not use first() here because doing so would not catch clicks from within
         * the popover, and it would fail to unsubscribe properly. Instead, we unsubscribe
         * explicitly when the popover is closed or destroyed.
         */
        MtxPopoverTrigger.prototype._subscribeToBackdrop = function () {
            var _this = this;
            if (this._overlayRef) {
                /** Only subscribe to backdrop if trigger event is click */
                if (this.triggerEvent === 'click' && this.popover.closeOnBackdropClick === true) {
                    this._overlayRef
                        .backdropClick()
                        .pipe(operators.takeUntil(this.popoverClosed$), operators.takeUntil(this._onDestroy))
                        .subscribe(function () {
                        _this.popover._emitCloseEvent();
                    });
                }
            }
        };
        MtxPopoverTrigger.prototype._subscribeToDetachments = function () {
            var _this = this;
            if (this._overlayRef) {
                this._overlayRef
                    .detachments()
                    .pipe(operators.takeUntil(this.popoverClosed$), operators.takeUntil(this._onDestroy))
                    .subscribe(function () {
                    _this._setPopoverClosed();
                });
            }
        };
        /**
         * This method sets the popover state to open and focuses the first item if
         * the popover was opened via the keyboard.
         */
        MtxPopoverTrigger.prototype._initPopover = function () {
            this._setPopoverOpened();
        };
        /**
         * This method resets the popover when it's closed, most importantly restoring
         * focus to the popover trigger if the popover was opened via the keyboard.
         */
        MtxPopoverTrigger.prototype._resetPopover = function () {
            this._setPopoverClosed();
            // Focus only needs to be reset to the host element if the popover was opened
            // by the keyboard and manually shifted to the first popover item.
            if (!this._openedByMouse) {
                this.focus();
            }
            this._openedByMouse = false;
        };
        /** set state rather than toggle to support triggers sharing a popover */
        MtxPopoverTrigger.prototype._setPopoverOpened = function () {
            if (!this._popoverOpen) {
                this._popoverOpen = true;
                this.popoverOpened$.next();
                this.popoverOpened.emit();
            }
        };
        /** set state rather than toggle to support triggers sharing a popover */
        MtxPopoverTrigger.prototype._setPopoverClosed = function () {
            if (this._popoverOpen) {
                this._popoverOpen = false;
                this.popoverClosed$.next();
                this.popoverClosed.emit();
            }
        };
        /**
         *  This method checks that a valid instance of MdPopover has been passed into
         *  mdPopoverTriggerFor. If not, an exception is thrown.
         */
        MtxPopoverTrigger.prototype._checkPopover = function () {
            if (!this.popover) {
                throwMtxPopoverMissingError();
            }
        };
        /**
         *  This method creates the overlay from the provided popover's template and saves its
         *  OverlayRef so that it can be attached to the DOM when openPopover is called.
         */
        MtxPopoverTrigger.prototype._createOverlay = function () {
            if (!this._overlayRef) {
                this._portal = new portal.TemplatePortal(this.popover.templateRef, this._viewContainerRef);
                var config = this._getOverlayConfig();
                this._subscribeToPositions(config.positionStrategy);
                this._overlayRef = this._overlay.create(config);
            }
            return this._overlayRef;
        };
        /**
         * This method builds the configuration object needed to create the overlay, the OverlayConfig.
         * @returns OverlayConfig
         */
        MtxPopoverTrigger.prototype._getOverlayConfig = function () {
            var overlayState = new overlay.OverlayConfig();
            overlayState.positionStrategy = this._getPosition();
            /** Display overlay backdrop if trigger event is click */
            if (this.triggerEvent === 'click') {
                overlayState.hasBackdrop = true;
                overlayState.backdropClass = 'cdk-overlay-transparent-backdrop';
            }
            overlayState.direction = this._dir;
            overlayState.scrollStrategy = this._getOverlayScrollStrategy(this.popover.scrollStrategy);
            return overlayState;
        };
        /**
         * This method returns the scroll strategy used by the cdk/overlay.
         */
        MtxPopoverTrigger.prototype._getOverlayScrollStrategy = function (strategy) {
            switch (strategy) {
                case 'noop':
                    return this._overlay.scrollStrategies.noop();
                case 'close':
                    return this._overlay.scrollStrategies.close();
                case 'block':
                    return this._overlay.scrollStrategies.block();
                case 'reposition':
                default:
                    return this._overlay.scrollStrategies.reposition();
            }
        };
        /**
         * Listens to changes in the position of the overlay and sets the correct classes
         * on the popover based on the new position. This ensures the animation origin is always
         * correct, even if a fallback position is used for the overlay.
         */
        MtxPopoverTrigger.prototype._subscribeToPositions = function (position) {
            var _this = this;
            this._positionSubscription = position.positionChanges.subscribe(function (change) {
                var posX = change.connectionPair.overlayX === 'start'
                    ? 'after'
                    : change.connectionPair.overlayX === 'end'
                        ? 'before'
                        : 'center';
                var posY = change.connectionPair.overlayY === 'top'
                    ? 'below'
                    : change.connectionPair.overlayY === 'bottom'
                        ? 'above'
                        : 'center';
                var pos = _this.popover.position[0] === 'above' || _this.popover.position[0] === 'below'
                    ? [posY, posX]
                    : [posX, posY];
                // required for ChangeDetectionStrategy.OnPush
                _this._changeDetectorRef.markForCheck();
                _this.popover.zone.run(function () {
                    _this.popover.setCurrentStyles(pos);
                    _this.popover.setPositionClasses(pos);
                });
            });
        };
        /**
         * This method builds the position strategy for the overlay, so the popover is properly connected
         * to the trigger.
         * @returns ConnectedPositionStrategy
         */
        MtxPopoverTrigger.prototype._getPosition = function () {
            var _a = __read(this.popover.position[0] === 'before' || this.popover.position[1] === 'after'
                ? ['start', 'center', 'end']
                : this.popover.position[0] === 'after' || this.popover.position[1] === 'before'
                    ? ['end', 'center', 'start']
                    : ['center', 'start', 'end'], 3), originX = _a[0], origin2ndX = _a[1], origin3rdX = _a[2];
            var _b = __read(this.popover.position[0] === 'above' || this.popover.position[1] === 'below'
                ? ['top', 'center', 'bottom']
                : this.popover.position[0] === 'below' || this.popover.position[1] === 'above'
                    ? ['bottom', 'center', 'top']
                    : ['center', 'top', 'bottom'], 3), originY = _b[0], origin2ndY = _b[1], origin3rdY = _b[2];
            var _c = __read(this.popover.position[0] === 'below' || this.popover.position[0] === 'above'
                ? [originX, originX]
                : this.popover.position[0] === 'before'
                    ? ['end', 'start']
                    : ['start', 'end'], 2), overlayX = _c[0], overlayFallbackX = _c[1];
            var _d = __read(this.popover.position[0] === 'before' || this.popover.position[0] === 'after'
                ? [originY, originY]
                : this.popover.position[0] === 'below'
                    ? ['top', 'bottom']
                    : ['bottom', 'top'], 2), overlayY = _d[0], overlayFallbackY = _d[1];
            var originFallbackX = overlayX;
            var originFallbackY = overlayY;
            var offsetX = this.popover.xOffset && !isNaN(Number(this.popover.xOffset))
                ? Number(this.dir === 'ltr' ? this.popover.xOffset : -this.popover.xOffset)
                : 0;
            var offsetY = this.popover.yOffset && !isNaN(Number(this.popover.yOffset))
                ? Number(this.popover.yOffset)
                : 0;
            /**
             * For overriding position element, when `mtxPopoverTargetAt` has a valid element reference.
             * Useful for sticking popover to parent element and offsetting arrow to trigger element.
             * If undefined defaults to the trigger element reference.
             */
            var element = this._elementRef;
            if (typeof this.targetElement !== 'undefined') {
                this.popover.containerPositioning = true;
                element = this.targetElement._elementRef;
            }
            var positions = [{ originX: originX, originY: originY, overlayX: overlayX, overlayY: overlayY }];
            if (this.popover.position[0] === 'above' || this.popover.position[0] === 'below') {
                positions = [
                    { originX: originX, originY: originY, overlayX: overlayX, overlayY: overlayY, offsetY: offsetY },
                    { originX: origin2ndX, originY: originY, overlayX: origin2ndX, overlayY: overlayY, offsetY: offsetY },
                    { originX: origin3rdX, originY: originY, overlayX: origin3rdX, overlayY: overlayY, offsetY: offsetY },
                    {
                        originX: originX,
                        originY: originFallbackY,
                        overlayX: overlayX,
                        overlayY: overlayFallbackY,
                        offsetY: -offsetY,
                    },
                    {
                        originX: origin2ndX,
                        originY: originFallbackY,
                        overlayX: origin2ndX,
                        overlayY: overlayFallbackY,
                        offsetY: -offsetY,
                    },
                    {
                        originX: origin3rdX,
                        originY: originFallbackY,
                        overlayX: origin3rdX,
                        overlayY: overlayFallbackY,
                        offsetY: -offsetY,
                    },
                ];
            }
            if (this.popover.position[0] === 'before' || this.popover.position[0] === 'after') {
                positions = [
                    { originX: originX, originY: originY, overlayX: overlayX, overlayY: overlayY, offsetX: offsetX },
                    { originX: originX, originY: origin2ndY, overlayX: overlayX, overlayY: origin2ndY, offsetX: offsetX },
                    { originX: originX, originY: origin3rdY, overlayX: overlayX, overlayY: origin3rdY, offsetX: offsetX },
                    {
                        originX: originFallbackX,
                        originY: originY,
                        overlayX: overlayFallbackX,
                        overlayY: overlayY,
                        offsetX: -offsetX,
                    },
                    {
                        originX: originFallbackX,
                        originY: origin2ndY,
                        overlayX: overlayFallbackX,
                        overlayY: origin2ndY,
                        offsetX: -offsetX,
                    },
                    {
                        originX: originFallbackX,
                        originY: origin3rdY,
                        overlayX: overlayFallbackX,
                        overlayY: origin3rdY,
                        offsetX: -offsetX,
                    },
                ];
            }
            return this._overlay
                .position()
                .flexibleConnectedTo(element)
                .withLockedPosition()
                .withPositions(positions)
                .withDefaultOffsetX(offsetX)
                .withDefaultOffsetY(offsetY);
        };
        MtxPopoverTrigger.prototype._cleanUpSubscriptions = function () {
            if (this._backdropSubscription) {
                this._backdropSubscription.unsubscribe();
            }
            if (this._positionSubscription) {
                this._positionSubscription.unsubscribe();
            }
            if (this._detachmentsSubscription) {
                this._detachmentsSubscription.unsubscribe();
            }
        };
        MtxPopoverTrigger.prototype._handleMousedown = function (event) {
            if (event && !a11y.isFakeMousedownFromScreenReader(event)) {
                this._openedByMouse = true;
            }
        };
        return MtxPopoverTrigger;
    }());
    MtxPopoverTrigger.decorators = [
        { type: core.Directive, args: [{
                    selector: '[mtxPopoverTriggerFor]',
                    exportAs: 'mtxPopoverTrigger',
                },] }
    ];
    /** @nocollapse */
    MtxPopoverTrigger.ctorParameters = function () { return [
        { type: overlay.Overlay },
        { type: core.ElementRef },
        { type: core.ViewContainerRef },
        { type: bidi.Directionality, decorators: [{ type: core.Optional }] },
        { type: core.ChangeDetectorRef }
    ]; };
    MtxPopoverTrigger.propDecorators = {
        ariaHaspopup: [{ type: core.HostBinding, args: ['attr.aria-haspopup',] }],
        popover: [{ type: core.Input, args: ['mtxPopoverTriggerFor',] }],
        targetElement: [{ type: core.Input, args: ['mtxPopoverTargetAt',] }],
        triggerEvent: [{ type: core.Input, args: ['mtxPopoverTriggerOn',] }],
        popoverOpened: [{ type: core.Output }],
        popoverClosed: [{ type: core.Output }],
        onClick: [{ type: core.HostListener, args: ['click', ['$event'],] }],
        onMouseEnter: [{ type: core.HostListener, args: ['mouseenter', ['$event'],] }],
        onMouseLeave: [{ type: core.HostListener, args: ['mouseleave', ['$event'],] }],
        _handleMousedown: [{ type: core.HostListener, args: ['mousedown', ['$event'],] }]
    };

    var MtxPopoverTarget = /** @class */ (function () {
        function MtxPopoverTarget(_elementRef) {
            this._elementRef = _elementRef;
        }
        return MtxPopoverTarget;
    }());
    MtxPopoverTarget.decorators = [
        { type: core.Directive, args: [{
                    selector: 'mtx-popover-target, [mtxPopoverTarget]',
                    exportAs: 'mtxPopoverTarget',
                },] }
    ];
    /** @nocollapse */
    MtxPopoverTarget.ctorParameters = function () { return [
        { type: core.ElementRef }
    ]; };

    var MtxPopoverModule = /** @class */ (function () {
        function MtxPopoverModule() {
        }
        return MtxPopoverModule;
    }());
    MtxPopoverModule.decorators = [
        { type: core.NgModule, args: [{
                    imports: [overlay.OverlayModule, common.CommonModule, a11y.A11yModule],
                    exports: [MtxPopover, MtxPopoverTrigger, MtxPopoverTarget],
                    declarations: [MtxPopover, MtxPopoverTrigger, MtxPopoverTarget],
                },] }
    ];

    /**
     * Generated bundle index. Do not edit.
     */

    exports.MtxPopover = MtxPopover;
    exports.MtxPopoverModule = MtxPopoverModule;
    exports.MtxPopoverTarget = MtxPopoverTarget;
    exports.MtxPopoverTrigger = MtxPopoverTrigger;
    exports.transformPopover = transformPopover;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=mtxPopover.umd.js.map
