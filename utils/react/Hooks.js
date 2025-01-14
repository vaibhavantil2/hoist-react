/*
 * This file belongs to Hoist, an application development toolkit
 * developed by Extremely Heavy Industries (www.xh.io | info@xh.io)
 *
 * Copyright © 2021 Extremely Heavy Industries Inc.
 */
import {observeResize, observeVisibleChange} from '@xh/hoist/utils/js';
/* eslint-disable react-hooks/exhaustive-deps */
import {useCallback, useEffect, useRef} from 'react';

/**
 * Hook to run a function once after component has been mounted.
 * @param {function} fn
 */
export function useOnMount(fn) {
    useEffect(
        () => {fn(); return undefined},
        []
    );
}

/**
 * Hook to run a function once after component has been unmounted.
 * @param {function} fn
 */
export function useOnUnmount(fn) {
    useEffect(
        () => fn,
        []
    );
}

/**
 * Hook to run a function when a DOM element is resized.
 *
 * @see observeResize() for more details.
 *
 * @param {function} fn - receives a DOMRect containing the dimensions of the DOM element.
 * @param {Object} [c] - configuration object
 * @param {number} [c.debounce] - milliseconds to debounce
 * @returns {function} - callback ref to be placed on target component
 */
export function useOnResize(fn, {debounce} = {}) {
    const observer = useRef(null);
    useOnUnmount(() => observer.current?.disconnect());

    return useCallback(node => {
        observer.current?.disconnect();
        if (node) observer.current = observeResize(fn, node, {debounce});
    }, [debounce]);
}

/**
 * Hook to run a function when a DOM element becomes visible / invisible.
 *
 * @see observeVisibleChange() for more details.
 *
 * @param {function} fn - receives a boolean signifying if visible.
 * @returns {function} - callback ref to be placed on target component
 */
export function useOnVisibleChange(fn) {
    const observer = useRef(null);
    useOnUnmount(() => observer.current?.disconnect());

    return useCallback(node => {
        observer.current?.disconnect();
        if (node) observer.current = observeVisibleChange(fn, node);
    }, []);
}

/**
 * Hook to run a function when a DOM element scrolls.
 *
 * @param {function} fn - receives the scroll event.
 * @returns {function} - callback ref to be placed on target component
 */
export function useOnScroll(fn) {
    return useCallback(node => {
        if (node) node.addEventListener('scroll', fn);
    }, []);
}

/**
 * Hook to return a cached version of a value.
 *
 * This hook is similar useCallback() and useMemo() and useful for providing stable object
 * references across renders.
 *
 * @param {*} value - value to be cached and potentially returned in this and subsequent calls.
 *      Typically an object.
 * @param {function} [equalsFn] - A function taking the previously cached value, and the currently
 *      presented value.  If evaluates to true, the cached value will be returned rather
 *      than the presented value.  If null, any cached value will always be returned.
 */
export function useCached(value, equalsFn) {
    const cache = useRef(value),
        cachedVal = cache.current;
    if (cachedVal !== value && equalsFn && !equalsFn(cachedVal, value)) {
        cache.current = value;
    }
    return cache.current;
}