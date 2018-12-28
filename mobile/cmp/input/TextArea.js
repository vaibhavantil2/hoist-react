/*
 * This file belongs to Hoist, an application development toolkit
 * developed by Extremely Heavy Industries (www.xh.io | info@xh.io)
 *
 * Copyright © 2018 Extremely Heavy Industries Inc.
 */

import PT from 'prop-types';
import {HoistComponent, elemFactory} from '@xh/hoist/core';
import {textarea as textareaTag, div} from '@xh/hoist/cmp/layout';
import {withDefault} from '@xh/hoist/utils/js';
import {HoistInput} from '@xh/hoist/cmp/input';

/**
 * A multi-line text input.
 */
@HoistComponent
export class TextArea extends HoistInput {

    static propTypes = {
        ...HoistInput.propTypes,
        value: PT.string,

        /** True to commit on every change/keystroke, default false. */
        commitOnChange: PT.bool,

        /** Height of the control in pixels. */
        height: PT.number,

        /** Function which receives keypress event */
        onKeyPress: PT.func,

        /** Text to display when control is empty */
        placeholder: PT.string,

        /** Whether text in field is selected when field receives focus */
        selectOnFocus: PT.bool,

        /** Whether to allow browser spell check, defaults to true */
        spellCheck: PT.bool,

        /** Width of the control in pixels. */
        width: PT.number
    };

    baseClassName = 'xh-textarea';

    get commitOnChange() {
        return withDefault(this.props.commitOnChange, false);
    }

    render() {
        const {props} = this;

        return div({
            className: this.getClassName(),
            item: textareaTag({
                value: this.renderValue || '',

                disabled: props.disabled,
                placeholder: props.placeholder,
                spellCheck: withDefault(props.spellCheck, false),
                tabIndex: props.tabIndex,

                style: {
                    height: props.height,
                    width: props.width,
                    ...props.style
                },

                onChange: this.onChange,
                onKeyPress: this.onKeyPress,
                onBlur: this.onBlur,
                onFocus: this.onFocus
            })
        });
    }

    onChange = (ev) => {
        this.noteValueChange(ev.target.value);
    };

    onKeyPress = (ev) => {
        const {onKeyPress} = this.props;
        if (onKeyPress) onKeyPress(ev);
    };

    onFocus = (ev) => {
        if (this.props.selectOnFocus && ev.target && ev.target.select) {
            ev.target.select();
        }
        this.noteFocused();
    };
}
export const textArea = elemFactory(TextArea);