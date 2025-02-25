/*
 * This file belongs to Hoist, an application development toolkit
 * developed by Extremely Heavy Industries (www.xh.io | info@xh.io)
 *
 * Copyright © 2021 Extremely Heavy Industries Inc.
 */
import {HoistModel, XH} from '@xh/hoist/core';
import {action, observable, makeObservable} from '@xh/hoist/mobx';

/**
 *  Manage Theme.
 *
 *  @private
 */
export class ThemeModel extends HoistModel {

    @observable darkTheme = false;

    constructor() {
        super();
        makeObservable(this);
    }

    @action
    toggleTheme() {
        this.setDarkTheme(!this.darkTheme);
    }

    @action
    setDarkTheme(value) {
        const classList = document.body.classList;
        classList.toggle('xh-dark', value);
        classList.toggle('bp3-dark', value);
        this.darkTheme = value;
        XH.setPref('xhTheme', value ? 'dark' : 'light');
    }

    init() {
        this.setDarkTheme(XH.getPref('xhTheme') === 'dark');
    }
}
