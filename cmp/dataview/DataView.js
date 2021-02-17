/*
 * This file belongs to Hoist, an application development toolkit
 * developed by Extremely Heavy Industries (www.xh.io | info@xh.io)
 *
 * Copyright © 2021 Extremely Heavy Industries Inc.
 */
import {AgGrid} from '@xh/hoist/cmp/ag-grid';
import {grid} from '@xh/hoist/cmp/grid';
import {hoistCmp, HoistModel, useLocalModel, uses} from '@xh/hoist/core';
import {apiRemoved} from '@xh/hoist/utils/js';
import {splitLayoutProps} from '@xh/hoist/utils/react';
import PT from 'prop-types';
import './DataView.scss';
import {DataViewModel} from './DataViewModel';

/**
 * A DataView is a specialized version of the Grid component. It displays its data within a
 * single column, using a configured component for rendering each item.
 */
export const [DataView, dataView] = hoistCmp.withFactory({
    displayName: 'DataView',
    model: uses(DataViewModel),
    className: 'xh-data-view',

    render({model, className, ...props}, ref) {
        apiRemoved(props.itemHeight, 'itemHeight', 'Specify itemHeight on the DataViewModel instead.');
        apiRemoved(props.rowCls, 'rowCls', 'Specify rowClassFn on the DataViewModel instead.');

        const [layoutProps, {onRowClicked, onRowDoubleClicked}] = splitLayoutProps(props);
        const localModel = useLocalModel(() => new LocalModel(model));

        return grid({
            ...layoutProps,
            className,
            ref,
            model: model.gridModel,
            agOptions: localModel.agOptions,
            onRowClicked,
            onRowDoubleClicked
        });
    }
});

DataView.propTypes = {
    /** Primary component model instance. */
    model: PT.oneOfType([PT.instanceOf(DataViewModel), PT.object]),

    /**
     * Callback when a row is clicked. Function will receive an event with a data node
     * containing the row's data. (Note that this may be null - e.g. for clicks on group rows.)
     */
    onRowClicked: PT.func,

    /**
     * Callback to call when a row is double clicked. Function will receive an event
     * with a data node containing the row's data.
     */
    onRowDoubleClicked: PT.func
};

class LocalModel extends HoistModel {
    model;
    agOptions;

    constructor(model) {
        super();
        this.model = model;

        this.addReaction({
            track: () => [model.itemHeight, model.groupRowHeight],
            run: () => model.gridModel.agApi?.resetRowHeights()
        });

        this.agOptions = {
            headerHeight: 0,
            // 500 is the max number of rows agGrid will render at once.
            // so, effectively, the max number of records
            // that can be loaded into a dataview whose items are dynamically 
            // calculated is 500.  
            // see https://www.ag-grid.com/documentation/react/dom-virtualisation/#row-virtualisation
            rowBuffer: model.itemHeightIsFn ? 500 : undefined,
            
            // This is necessary to get the item heights calculated using the reference attached to the record.
            // The first time getRowHeight is called, ref.current is null.  So, onRowDataChanged, we need to call 
            // resetRowHeights to get agGrid to re-run getRowHeight with the now rendered DataViewItems.
            onRowDataChanged: model.itemHeightIsFn ? ({api}) => api.resetRowHeights() : undefined,
            onRowDataUpdated: model.itemHeightIsFn ? ({api}) => api.resetRowHeights() : undefined,

            suppressMakeColumnVisibleAfterUnGroup: true,
            getRowHeight: (params) => {
                // Return (required) itemHeight for data rows.
                if (!params.node?.group) return model.itemHeight(params);

                // For group rows, return groupRowHeight if specified, or use standard height
                // (DataView does not participate in grid sizing modes.)
                return model.groupRowHeight ?? AgGrid.getRowHeightForSizingMode('standard');
            }
        };
    }
}
