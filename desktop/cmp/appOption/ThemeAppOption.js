/*
 * This file belongs to Hoist, an application development toolkit
 * developed by Extremely Heavy Industries (www.xh.io | info@xh.io)
 *
 * Copyright © 2021 Extremely Heavy Industries Inc.
 */
import {XH} from '@xh/hoist/core';
import {button} from '@xh/hoist/desktop/cmp/button';
import {buttonGroupInput} from '@xh/hoist/desktop/cmp/input';
import {Icon} from '@xh/hoist/icon/Icon';


/**
 * Convenience configuration for the `theme` AppOption.
 * @param {{}} [formFieldProps]
 * @param {{}} [inputProps]
 */
export const themeAppOption = ({formFieldProps, inputProps} = {}) => {
    return {
        name: 'theme',
        formField: {
            label: 'Theme',
            item: buttonGroupInput({
                items: [
                    button({value: false, text: 'Light', icon: Icon.sun(), width: '50%'}),
                    button({value: true, text: 'Dark', icon: Icon.moon(), width: '50%'})
                ],
                ...inputProps
            }),
            ...formFieldProps
        },
        valueGetter: () => XH.darkTheme,
        valueSetter: (v) => XH.setDarkTheme(v)
    };
};