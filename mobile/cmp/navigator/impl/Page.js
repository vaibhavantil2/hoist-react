/*
 * This file belongs to Hoist, an application development toolkit
 * developed by Extremely Heavy Industries (www.xh.io | info@xh.io)
 *
 * Copyright © 2020 Extremely Heavy Industries Inc.
 */
import {useRef} from 'react';
import {hoistCmp, uses, ModelPublishMode, RenderMode} from '@xh/hoist/core';
import {page as onsenPage} from '@xh/hoist/kit/onsen';
import {refreshContextView} from '@xh/hoist/core/refresh';
import {elementFromContent} from '@xh/hoist/utils/react';

import './Page.scss';
import {PageModel} from '../PageModel';

/**
 * Wrapper for contents to be shown within a Navigator. This Component is used by Navigator's
 * internal implementation to:
 *
 *      - Mount/unmount its contents according to `PageModel.renderMode`.
 *      - Track and trigger refreshes according to `PageModel.refreshMode`.
 *
 * @private
 */
export const page = hoistCmp.factory({
    displayName: 'Page',
    model: uses(PageModel, {publishMode: ModelPublishMode.LIMITED}),

    render({model}) {
        const {content, props, isActive, renderMode, refreshContextModel} = model,
            wasActivated = useRef(false);

        if (!wasActivated.current && isActive) wasActivated.current = true;

        if (
            !isActive &&
            (
                (renderMode === RenderMode.UNMOUNT_ON_HIDE) ||
                (renderMode === RenderMode.LAZY && !wasActivated.current)
            )
        ) {
            // Note: We must render an empty placeholder page to work with the Navigator.
            return onsenPage({className: 'xh-page'});
        }

        return refreshContextView({
            model: refreshContextModel,
            item: onsenPage({
                className: 'xh-page',
                item: elementFromContent(content, props)
            })
        });
    }
});