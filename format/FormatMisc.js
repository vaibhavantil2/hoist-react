/*
 * This file belongs to Hoist, an application development toolkit
 * developed by Extremely Heavy Industries (www.xh.io | info@xh.io)
 *
 * Copyright © 2021 Extremely Heavy Industries Inc.
 */
import {span} from '@xh/hoist/cmp/layout';
import {capitalize} from 'lodash';

/**
 * Basic util for splitting a string (via ' ') and capitalizing each word - e.g. for names.
 * Not intended to handle more advanced usages such as HTML or other word boundary characters.
 * @param {string} str
 */
export function capitalizeWords(str) {
    if (str == null || !str.length) return str;
    return str.split(' ')
        .map(s => capitalize(s))
        .join(' ');
}

/**
 * Wrap values in a custom span
 *
 * @param {*} v - value to be placed in span, will be coerced into a string
 * @param {Object} [opts] - an options object:
 * @param {string} [opts.className] - span class
 * @param {string} [opts.title] - span title
 * @param {boolean} [opts.leadSpc] - set to true to add a space before the v to be wrapped
 * @param {boolean} [opts.trailSpc] - set to true to add a space after the span to be returned
 * @param {boolean} [opts.asElement] - return a react element rather than a html string
 */
export function fmtSpan(v, {
    className = null,
    title = null,
    leadSpc = false,
    trailSpc = false,
    asElement = false
} = {}) {
    if (v == null) return '';
    const opts = {className, title, leadSpc, trailSpc};
    return asElement ? fmtSpanElement(v, opts) : fmtSpanHtml(v, opts);
}

//-----------------
// Implementation
//-----------------
function fmtSpanElement(v, opts) {
    const {className, title, leadSpc, trailSpc} = opts,
        txt = (leadSpc ? ' ' : '') + v + (trailSpc ? ' ' : '');

    return span({
        className,
        title,
        item: txt
    });
}

function fmtSpanHtml(v, opts) {
    const {className, title, leadSpc, trailSpc} = opts,
        txt = (leadSpc ? ' ' : '') + v;

    let ret = '<span';
    ret += className ? ` class="${className}"` : '';
    ret += title ? ` title="${title}"` : '';
    ret += `>${txt}</span>`;

    return trailSpc ? ret + ' ' : ret;
}
