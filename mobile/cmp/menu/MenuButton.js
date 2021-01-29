/*
 * This file belongs to Hoist, an application development toolkit
 * developed by Extremely Heavy Industries (www.xh.io | info@xh.io)
 *
 * Copyright © 2021 Extremely Heavy Industries Inc.
 */
import {HoistModel, hoistCmp, useLocalModel} from '@xh/hoist/core';
import {observable, action, makeObservable} from '@xh/hoist/mobx';
import {fragment} from '@xh/hoist/cmp/layout';
import {Icon} from '@xh/hoist/icon';
import {button, Button} from '@xh/hoist/mobile/cmp/button';
import {createObservableRef} from '@xh/hoist/utils/react';
import {usePopper} from 'react-popper';
import PT from 'prop-types';
import ReactDom from 'react-dom';

import {MenuItem} from './MenuItem';
import {menu} from './impl/Menu';

/**
 * Convenience Button preconfigured for use as a trigger for a dropdown menu operation.
 */
export const [MenuButton, menuButton] = hoistCmp.withFactory({
    displayName: 'MenuButton',
    className: 'xh-menu-button',

    render({
        menuItems,
        menuPosition = 'auto',
        popperOptions,
        icon = Icon.bars(),
        ...props
    }) {
        const impl = useLocalModel(LocalModel),
            popper = usePopper(impl.targetEl, impl.menuEl, {
                placement: menuPositionToPlacement(menuPosition),
                strategy: 'fixed',
                modifiers: [
                    {name: 'preventOverflow', options: {padding: 10}}
                ],
                ...popperOptions
            });

        return fragment(
            button({
                icon,
                ...props,
                onClick: () => impl.open(),
                ref: impl.buttonRef
            }),
            menu({
                omit: !impl.isOpen,
                menuItems,
                style: popper?.styles?.popper,
                onDismiss: () => impl.close(),
                ref: impl.menuRef
            })
        );
    }
});

MenuButton.propTypes = {
    ...Button.propTypes,

    /** Array of MenuItems or configs to create them */
    menuItems: PT.arrayOf(PT.oneOfType([PT.instanceOf(MenuItem), PT.object])).isRequired,

    /** Position of menu relative to button */
    menuPosition: PT.oneOf([
        'top-left', 'top', 'top-right',
        'right-top', 'right', 'right-bottom',
        'bottom-right', 'bottom', 'bottom-left',
        'left-bottom', 'left', 'left-top',
        'auto'
    ]),

    /** Escape hatch to provide additional options to the PopperJS implementation */
    popperOptions: PT.object
};

class LocalModel extends HoistModel {

    buttonRef = createObservableRef();
    menuRef = createObservableRef();
    @observable isOpen = false;

    constructor() {
        super();
        makeObservable(this);
    }

    @action
    open() {
        this.isOpen = true;
    }

    @action
    close() {
        this.isOpen = false;
    }

    get targetEl() {
        return ReactDom.findDOMNode(this.buttonRef.current);
    }

    get menuEl() {
        return this.menuRef.current;
    }
}

/**
 * Convert a menu position to a Popper.js placement.
 * This allows us to the same position names as desktop, and is inspired
 * by Blueprint's similar implementation:
 * https://github.com/palantir/blueprint/blob/develop/packages/core/src/components/popover/popoverMigrationUtils.ts
 */
function menuPositionToPlacement(position) {
    switch (position) {
        case 'top-left':
            return 'top-start';
        case 'top-right':
            return 'top-end';
        case 'right-top':
            return 'right-start';
        case 'right-bottom':
            return 'right-end';
        case 'bottom-left':
            return 'bottom-start';
        case 'bottom-right':
            return 'bottom-end';
        case 'left-top':
            return 'left-start';
        case 'left-bottom':
            return 'left-end';
        default:
            return position;
    }
}