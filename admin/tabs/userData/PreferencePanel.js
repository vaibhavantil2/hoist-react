/*
 * This file belongs to Hoist, an application development toolkit
 * developed by Extremely Heavy Industries (www.xh.io | info@xh.io)
 *
 * Copyright © 2021 Extremely Heavy Industries Inc.
 */
import {fragment} from '@xh/hoist/cmp/layout';
import {hoistCmp, creates} from '@xh/hoist/core';
import {button} from '@xh/hoist/desktop/cmp/button';
import {Icon} from '@xh/hoist/icon';
import {restGrid} from '@xh/hoist/desktop/cmp/rest';
import {differ} from '../../differ/Differ';
import {regroupDialog} from '../../regroup/RegroupDialog';
import {PreferenceModel} from './PreferenceModel';

export const preferencePanel = hoistCmp.factory({
    model: creates(PreferenceModel),

    render({model}) {
        return fragment(
            restGrid({
                extraToolbarItems: () => {
                    return button({
                        icon: Icon.diff(),
                        text: 'Compare w/ Remote',
                        onClick: () => model.openDiffer()
                    });
                }
            }),
            differ({omit: !model.differModel}),
            regroupDialog()
        );
    }
});
