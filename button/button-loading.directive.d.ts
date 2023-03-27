import { ComponentFactoryResolver, OnChanges, Renderer2, SimpleChanges, ViewContainerRef } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { MatButton } from '@angular/material/button';
export declare class MatButtonLoadingDirective implements OnChanges {
    private matButton;
    private componentFactoryResolver;
    private viewContainerRef;
    private renderer;
    private spinnerFactory;
    private spinner;
    loading: boolean;
    disabled: boolean;
    color: ThemePalette;
    constructor(matButton: MatButton, componentFactoryResolver: ComponentFactoryResolver, viewContainerRef: ViewContainerRef, renderer: Renderer2);
    ngOnChanges(changes: SimpleChanges): void;
    private createSpinner;
    private destroySpinner;
}
