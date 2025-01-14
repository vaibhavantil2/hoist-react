/*
 * This file belongs to Hoist, an application development toolkit
 * developed by Extremely Heavy Industries (www.xh.io | info@xh.io)
 *
 * Copyright © 2021 Extremely Heavy Industries Inc.
 */


/**
 * The exports below are platform specific classes we would like to use (carefully!) in our
 * cross-platform code.
 *
 * These are dynamically bound in the method below. This dynamic binding ensures that they are
 * included only on the intended platform to avoid platform specific code contaminating the builds
 * of other platforms.
 *
 * See the platform specific AppContainer where these implementations are actually provided.
 */
export let tabContainerImpl = null;
export let storeFilterFieldImpl = null;
export let pinPadImpl = null;
export let colChooser = null;
export let ColChooserModel = null;

/**
 * Provide implementations of functions and classes exported in this file.
 *
 * Not for Application use.
 */
export function installMobileImpls(impls) {
    tabContainerImpl = impls.tabContainerImpl;
    storeFilterFieldImpl = impls.storeFilterFieldImpl;
    pinPadImpl =  impls.pinPadImpl;
    colChooser = impls.colChooser;
    ColChooserModel = impls.ColChooserModel;
}
