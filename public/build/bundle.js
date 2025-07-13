
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    const identity = x => x;
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function split_css_unit(value) {
        const split = typeof value === 'string' && value.match(/^\s*(-?[\d.]+)([^\s]*)\s*$/);
        return split ? [parseFloat(split[1]), split[2] || 'px'] : [value, 'px'];
    }

    const is_client = typeof window !== 'undefined';
    let now = is_client
        ? () => window.performance.now()
        : () => Date.now();
    let raf = is_client ? cb => requestAnimationFrame(cb) : noop;

    const tasks = new Set();
    function run_tasks(now) {
        tasks.forEach(task => {
            if (!task.c(now)) {
                tasks.delete(task);
                task.f();
            }
        });
        if (tasks.size !== 0)
            raf(run_tasks);
    }
    /**
     * Creates a new task that runs on each raf frame
     * until it returns a falsy value or is aborted
     */
    function loop(callback) {
        let task;
        if (tasks.size === 0)
            raf(run_tasks);
        return {
            promise: new Promise(fulfill => {
                tasks.add(task = { c: callback, f: fulfill });
            }),
            abort() {
                tasks.delete(task);
            }
        };
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);
    function append(target, node) {
        target.appendChild(node);
    }
    function get_root_for_style(node) {
        if (!node)
            return document;
        const root = node.getRootNode ? node.getRootNode() : node.ownerDocument;
        if (root && root.host) {
            return root;
        }
        return node.ownerDocument;
    }
    function append_empty_stylesheet(node) {
        const style_element = element('style');
        append_stylesheet(get_root_for_style(node), style_element);
        return style_element.sheet;
    }
    function append_stylesheet(node, style) {
        append(node.head || node, style);
        return style.sheet;
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        if (node.parentNode) {
            node.parentNode.removeChild(node);
        }
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function prevent_default(fn) {
        return function (event) {
            event.preventDefault();
            // @ts-ignore
            return fn.call(this, event);
        };
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function set_style(node, key, value, important) {
        if (value == null) {
            node.style.removeProperty(key);
        }
        else {
            node.style.setProperty(key, value, important ? 'important' : '');
        }
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, cancelable, detail);
        return e;
    }
    class HtmlTag {
        constructor(is_svg = false) {
            this.is_svg = false;
            this.is_svg = is_svg;
            this.e = this.n = null;
        }
        c(html) {
            this.h(html);
        }
        m(html, target, anchor = null) {
            if (!this.e) {
                if (this.is_svg)
                    this.e = svg_element(target.nodeName);
                /** #7364  target for <template> may be provided as #document-fragment(11) */
                else
                    this.e = element((target.nodeType === 11 ? 'TEMPLATE' : target.nodeName));
                this.t = target.tagName !== 'TEMPLATE' ? target : target.content;
                this.c(html);
            }
            this.i(anchor);
        }
        h(html) {
            this.e.innerHTML = html;
            this.n = Array.from(this.e.nodeName === 'TEMPLATE' ? this.e.content.childNodes : this.e.childNodes);
        }
        i(anchor) {
            for (let i = 0; i < this.n.length; i += 1) {
                insert(this.t, this.n[i], anchor);
            }
        }
        p(html) {
            this.d();
            this.h(html);
            this.i(this.a);
        }
        d() {
            this.n.forEach(detach);
        }
    }

    // we need to store the information for multiple documents because a Svelte application could also contain iframes
    // https://github.com/sveltejs/svelte/issues/3624
    const managed_styles = new Map();
    let active = 0;
    // https://github.com/darkskyapp/string-hash/blob/master/index.js
    function hash(str) {
        let hash = 5381;
        let i = str.length;
        while (i--)
            hash = ((hash << 5) - hash) ^ str.charCodeAt(i);
        return hash >>> 0;
    }
    function create_style_information(doc, node) {
        const info = { stylesheet: append_empty_stylesheet(node), rules: {} };
        managed_styles.set(doc, info);
        return info;
    }
    function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
        const step = 16.666 / duration;
        let keyframes = '{\n';
        for (let p = 0; p <= 1; p += step) {
            const t = a + (b - a) * ease(p);
            keyframes += p * 100 + `%{${fn(t, 1 - t)}}\n`;
        }
        const rule = keyframes + `100% {${fn(b, 1 - b)}}\n}`;
        const name = `__svelte_${hash(rule)}_${uid}`;
        const doc = get_root_for_style(node);
        const { stylesheet, rules } = managed_styles.get(doc) || create_style_information(doc, node);
        if (!rules[name]) {
            rules[name] = true;
            stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
        }
        const animation = node.style.animation || '';
        node.style.animation = `${animation ? `${animation}, ` : ''}${name} ${duration}ms linear ${delay}ms 1 both`;
        active += 1;
        return name;
    }
    function delete_rule(node, name) {
        const previous = (node.style.animation || '').split(', ');
        const next = previous.filter(name
            ? anim => anim.indexOf(name) < 0 // remove specific animation
            : anim => anim.indexOf('__svelte') === -1 // remove all Svelte animations
        );
        const deleted = previous.length - next.length;
        if (deleted) {
            node.style.animation = next.join(', ');
            active -= deleted;
            if (!active)
                clear_rules();
        }
    }
    function clear_rules() {
        raf(() => {
            if (active)
                return;
            managed_styles.forEach(info => {
                const { ownerNode } = info.stylesheet;
                // there is no ownerNode if it runs on jsdom.
                if (ownerNode)
                    detach(ownerNode);
            });
            managed_styles.clear();
        });
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    /**
     * The `onMount` function schedules a callback to run as soon as the component has been mounted to the DOM.
     * It must be called during the component's initialisation (but doesn't need to live *inside* the component;
     * it can be called from an external module).
     *
     * `onMount` does not run inside a [server-side component](/docs#run-time-server-side-component-api).
     *
     * https://svelte.dev/docs#run-time-svelte-onmount
     */
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }

    const dirty_components = [];
    const binding_callbacks = [];
    let render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = /* @__PURE__ */ Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        // Do not reenter flush while dirty components are updated, as this can
        // result in an infinite loop. Instead, let the inner flush handle it.
        // Reentrancy is ok afterwards for bindings etc.
        if (flushidx !== 0) {
            return;
        }
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            try {
                while (flushidx < dirty_components.length) {
                    const component = dirty_components[flushidx];
                    flushidx++;
                    set_current_component(component);
                    update(component.$$);
                }
            }
            catch (e) {
                // reset dirty state to not end up in a deadlocked state and then rethrow
                dirty_components.length = 0;
                flushidx = 0;
                throw e;
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    /**
     * Useful for example to execute remaining `afterUpdate` callbacks before executing `destroy`.
     */
    function flush_render_callbacks(fns) {
        const filtered = [];
        const targets = [];
        render_callbacks.forEach((c) => fns.indexOf(c) === -1 ? filtered.push(c) : targets.push(c));
        targets.forEach((c) => c());
        render_callbacks = filtered;
    }

    let promise;
    function wait() {
        if (!promise) {
            promise = Promise.resolve();
            promise.then(() => {
                promise = null;
            });
        }
        return promise;
    }
    function dispatch(node, direction, kind) {
        node.dispatchEvent(custom_event(`${direction ? 'intro' : 'outro'}${kind}`));
    }
    const outroing = new Set();
    let outros;
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
        else if (callback) {
            callback();
        }
    }
    const null_transition = { duration: 0 };
    function create_in_transition(node, fn, params) {
        const options = { direction: 'in' };
        let config = fn(node, params, options);
        let running = false;
        let animation_name;
        let task;
        let uid = 0;
        function cleanup() {
            if (animation_name)
                delete_rule(node, animation_name);
        }
        function go() {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            if (css)
                animation_name = create_rule(node, 0, 1, duration, delay, easing, css, uid++);
            tick(0, 1);
            const start_time = now() + delay;
            const end_time = start_time + duration;
            if (task)
                task.abort();
            running = true;
            add_render_callback(() => dispatch(node, true, 'start'));
            task = loop(now => {
                if (running) {
                    if (now >= end_time) {
                        tick(1, 0);
                        dispatch(node, true, 'end');
                        cleanup();
                        return running = false;
                    }
                    if (now >= start_time) {
                        const t = easing((now - start_time) / duration);
                        tick(t, 1 - t);
                    }
                }
                return running;
            });
        }
        let started = false;
        return {
            start() {
                if (started)
                    return;
                started = true;
                delete_rule(node);
                if (is_function(config)) {
                    config = config(options);
                    wait().then(go);
                }
                else {
                    go();
                }
            },
            invalidate() {
                started = false;
            },
            end() {
                if (running) {
                    cleanup();
                    running = false;
                }
            }
        };
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = component.$$.on_mount.map(run).filter(is_function);
                // if the component was destroyed immediately
                // it will update the `$$.on_destroy` reference to `null`.
                // the destructured on_destroy may still reference to the old array
                if (component.$$.on_destroy) {
                    component.$$.on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            flush_render_callbacks($$.after_update);
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init$1(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: [],
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            if (!is_function(callback)) {
                return noop;
            }
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.59.2' }, detail), { bubbles: true }));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation, has_stop_immediate_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        if (has_stop_immediate_propagation)
            modifiers.push('stopImmediatePropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function prop_dev(node, property, value) {
        node[property] = value;
        dispatch_dev('SvelteDOMSetProperty', { node, property, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.data === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    function cubicOut(t) {
        const f = t - 1.0;
        return f * f * f + 1.0;
    }

    function fade(node, { delay = 0, duration = 400, easing = identity } = {}) {
        const o = +getComputedStyle(node).opacity;
        return {
            delay,
            duration,
            easing,
            css: t => `opacity: ${t * o}`
        };
    }
    function fly(node, { delay = 0, duration = 400, easing = cubicOut, x = 0, y = 0, opacity = 0 } = {}) {
        const style = getComputedStyle(node);
        const target_opacity = +style.opacity;
        const transform = style.transform === 'none' ? '' : style.transform;
        const od = target_opacity * (1 - opacity);
        const [xValue, xUnit] = split_css_unit(x);
        const [yValue, yUnit] = split_css_unit(y);
        return {
            delay,
            duration,
            easing,
            css: (t, u) => `
			transform: ${transform} translate(${(1 - t) * xValue}${xUnit}, ${(1 - t) * yValue}${yUnit});
			opacity: ${target_opacity - (od * u)}`
        };
    }

    /* src\home\topnav.svelte generated by Svelte v3.59.2 */
    const file$6 = "src\\home\\topnav.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[6] = list[i];
    	child_ctx[8] = i;
    	return child_ctx;
    }

    // (75:12) {#each ['Home', 'About', 'Projects', 'Contact'] as item, i}
    function create_each_block$2(ctx) {
    	let li;
    	let a;
    	let span0;
    	let t0;
    	let t1_value = /*i*/ ctx[8] + 1 + "";
    	let t1;
    	let t2;
    	let span1;
    	let t3;
    	let t4;
    	let mounted;
    	let dispose;

    	function click_handler() {
    		return /*click_handler*/ ctx[5](/*item*/ ctx[6]);
    	}

    	const block = {
    		c: function create() {
    			li = element("li");
    			a = element("a");
    			span0 = element("span");
    			t0 = text("0");
    			t1 = text(t1_value);
    			t2 = space();
    			span1 = element("span");
    			t3 = text(/*item*/ ctx[6]);
    			t4 = space();
    			attr_dev(span0, "class", "nav-item-number svelte-15suewa");
    			add_location(span0, file$6, 83, 24, 2992);
    			attr_dev(span1, "class", "nav-item-text svelte-15suewa");
    			add_location(span1, file$6, 84, 24, 3061);
    			attr_dev(a, "href", "#" + /*item*/ ctx[6].toLowerCase());
    			attr_dev(a, "class", "svelte-15suewa");
    			toggle_class(a, "active", /*item*/ ctx[6] === 'Home');
    			add_location(a, file$6, 76, 20, 2677);
    			set_style(li, "--item-index", /*i*/ ctx[8]);
    			attr_dev(li, "class", "svelte-15suewa");
    			add_location(li, file$6, 75, 16, 2625);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, a);
    			append_dev(a, span0);
    			append_dev(span0, t0);
    			append_dev(span0, t1);
    			append_dev(a, t2);
    			append_dev(a, span1);
    			append_dev(span1, t3);
    			append_dev(li, t4);

    			if (!mounted) {
    				dispose = listen_dev(a, "click", prevent_default(click_handler), false, true, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(75:12) {#each ['Home', 'About', 'Projects', 'Contact'] as item, i}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$7(ctx) {
    	let div11;
    	let div7;
    	let div2;
    	let div0;
    	let a;
    	let img;
    	let img_src_value;
    	let img_intro;
    	let t0;
    	let div1;
    	let span0;
    	let t2;
    	let span1;
    	let t5;
    	let div6;
    	let div3;
    	let t6;
    	let div4;
    	let t7;
    	let div5;
    	let t8;
    	let nav;
    	let ul;
    	let t9;
    	let div10;
    	let div8;
    	let i;
    	let t10;
    	let span2;
    	let t12;
    	let div9;
    	let span3;
    	let mounted;
    	let dispose;
    	let each_value = ['Home', 'About', 'Projects', 'Contact'];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < 4; i += 1) {
    		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div11 = element("div");
    			div7 = element("div");
    			div2 = element("div");
    			div0 = element("div");
    			a = element("a");
    			img = element("img");
    			t0 = space();
    			div1 = element("div");
    			span0 = element("span");
    			span0.textContent = "THE DAILY DEVELOPER";
    			t2 = space();
    			span1 = element("span");
    			span1.textContent = `Evening Edition • ${/*currentDate*/ ctx[2]}`;
    			t5 = space();
    			div6 = element("div");
    			div3 = element("div");
    			t6 = space();
    			div4 = element("div");
    			t7 = space();
    			div5 = element("div");
    			t8 = space();
    			nav = element("nav");
    			ul = element("ul");

    			for (let i = 0; i < 4; i += 1) {
    				each_blocks[i].c();
    			}

    			t9 = space();
    			div10 = element("div");
    			div8 = element("div");
    			i = element("i");
    			t10 = space();
    			span2 = element("span");
    			span2.textContent = "72° • Mostly Sunny";
    			t12 = space();
    			div9 = element("div");
    			span3 = element("span");
    			span3.textContent = "Price: 1 Bitcoin";
    			if (!src_url_equal(img.src, img_src_value = "/images/logo.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "MOMBE Digitals Logo");
    			attr_dev(img, "class", "svelte-15suewa");
    			add_location(img, file$6, 55, 20, 1793);
    			attr_dev(a, "href", "#");
    			set_style(a, "transform", "scale(1)");
    			add_location(a, file$6, 54, 16, 1731);
    			attr_dev(div0, "class", "logo svelte-15suewa");
    			add_location(div0, file$6, 53, 12, 1695);
    			attr_dev(span0, "class", "svelte-15suewa");
    			add_location(span0, file$6, 60, 16, 2015);
    			attr_dev(span1, "class", "edition-info svelte-15suewa");
    			add_location(span1, file$6, 61, 16, 2065);
    			attr_dev(div1, "class", "masthead-title svelte-15suewa");
    			add_location(div1, file$6, 59, 12, 1969);
    			attr_dev(div2, "class", "masthead-left svelte-15suewa");
    			add_location(div2, file$6, 52, 8, 1654);
    			attr_dev(div3, "class", "hamburger-line top-line svelte-15suewa");
    			add_location(div3, file$6, 66, 12, 2271);
    			attr_dev(div4, "class", "hamburger-line middle-line svelte-15suewa");
    			add_location(div4, file$6, 67, 12, 2328);
    			attr_dev(div5, "class", "hamburger-line bottom-line svelte-15suewa");
    			add_location(div5, file$6, 68, 12, 2388);
    			attr_dev(div6, "class", "hamburger svelte-15suewa");
    			toggle_class(div6, "active", /*isMenuOpen*/ ctx[0]);
    			add_location(div6, file$6, 65, 8, 2186);
    			attr_dev(div7, "class", "newspaper-masthead svelte-15suewa");
    			add_location(div7, file$6, 51, 4, 1612);
    			attr_dev(ul, "class", "svelte-15suewa");
    			add_location(ul, file$6, 73, 8, 2530);
    			attr_dev(i, "class", "fas fa-cloud-sun svelte-15suewa");
    			add_location(i, file$6, 92, 16, 3298);
    			add_location(span2, file$6, 93, 16, 3348);
    			attr_dev(div8, "class", "weather-report svelte-15suewa");
    			add_location(div8, file$6, 91, 12, 3252);
    			add_location(span3, file$6, 96, 16, 3454);
    			attr_dev(div9, "class", "price-tag svelte-15suewa");
    			add_location(div9, file$6, 95, 12, 3413);
    			attr_dev(div10, "class", "mobile-nav-footer svelte-15suewa");
    			add_location(div10, file$6, 90, 8, 3207);
    			attr_dev(nav, "class", "navigation svelte-15suewa");
    			toggle_class(nav, "active", /*isMenuOpen*/ ctx[0]);
    			add_location(nav, file$6, 72, 4, 2470);
    			attr_dev(div11, "class", "main-nav svelte-15suewa");
    			toggle_class(div11, "scrolled", /*isScrolled*/ ctx[1]);
    			add_location(div11, file$6, 50, 0, 1556);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div11, anchor);
    			append_dev(div11, div7);
    			append_dev(div7, div2);
    			append_dev(div2, div0);
    			append_dev(div0, a);
    			append_dev(a, img);
    			append_dev(div2, t0);
    			append_dev(div2, div1);
    			append_dev(div1, span0);
    			append_dev(div1, t2);
    			append_dev(div1, span1);
    			append_dev(div7, t5);
    			append_dev(div7, div6);
    			append_dev(div6, div3);
    			append_dev(div6, t6);
    			append_dev(div6, div4);
    			append_dev(div6, t7);
    			append_dev(div6, div5);
    			append_dev(div11, t8);
    			append_dev(div11, nav);
    			append_dev(nav, ul);

    			for (let i = 0; i < 4; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(ul, null);
    				}
    			}

    			append_dev(nav, t9);
    			append_dev(nav, div10);
    			append_dev(div10, div8);
    			append_dev(div8, i);
    			append_dev(div8, t10);
    			append_dev(div8, span2);
    			append_dev(div10, t12);
    			append_dev(div10, div9);
    			append_dev(div9, span3);

    			if (!mounted) {
    				dispose = listen_dev(div6, "click", /*toggleMenu*/ ctx[3], false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*isMenuOpen*/ 1) {
    				toggle_class(div6, "active", /*isMenuOpen*/ ctx[0]);
    			}

    			if (dirty & /*scrollToSection*/ 16) {
    				each_value = ['Home', 'About', 'Projects', 'Contact'];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < 4; i += 1) {
    					const child_ctx = get_each_context$2(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$2(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(ul, null);
    					}
    				}

    				for (; i < 4; i += 1) {
    					each_blocks[i].d(1);
    				}
    			}

    			if (dirty & /*isMenuOpen*/ 1) {
    				toggle_class(nav, "active", /*isMenuOpen*/ ctx[0]);
    			}

    			if (dirty & /*isScrolled*/ 2) {
    				toggle_class(div11, "scrolled", /*isScrolled*/ ctx[1]);
    			}
    		},
    		i: function intro(local) {
    			if (!img_intro) {
    				add_render_callback(() => {
    					img_intro = create_in_transition(img, fly, { y: -20, duration: 1000 });
    					img_intro.start();
    				});
    			}
    		},
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div11);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Topnav', slots, []);
    	let isMenuOpen = false;
    	let isScrolled = false;

    	let currentDate = new Date().toLocaleDateString('en-US', {
    		weekday: 'long',
    		month: 'short',
    		day: 'numeric'
    	});

    	// Handle scroll effect
    	onMount(() => {
    		window.addEventListener('scroll', () => {
    			$$invalidate(1, isScrolled = window.scrollY > 50);
    		});

    		// Close menu when clicking outside
    		window.addEventListener('click', e => {
    			if (isMenuOpen && !e.target.closest('.navigation') && !e.target.closest('.hamburger')) {
    				$$invalidate(0, isMenuOpen = false);
    				document.body.style.overflow = '';
    			}
    		});
    	});

    	// Toggle mobile menu
    	const toggleMenu = () => {
    		$$invalidate(0, isMenuOpen = !isMenuOpen);
    		document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    	};

    	// Scroll to section
    	const scrollToSection = sectionId => {
    		const element = document.getElementById(sectionId);

    		if (element) {
    			const navHeight = document.querySelector('.main-nav').offsetHeight;
    			const elementPosition = element.offsetTop;

    			window.scrollTo({
    				top: elementPosition - navHeight,
    				behavior: 'smooth'
    			});
    		}

    		$$invalidate(0, isMenuOpen = false);
    		document.body.style.overflow = '';
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Topnav> was created with unknown prop '${key}'`);
    	});

    	const click_handler = item => {
    		scrollToSection(item.toLowerCase());
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		fly,
    		fade,
    		isMenuOpen,
    		isScrolled,
    		currentDate,
    		toggleMenu,
    		scrollToSection
    	});

    	$$self.$inject_state = $$props => {
    		if ('isMenuOpen' in $$props) $$invalidate(0, isMenuOpen = $$props.isMenuOpen);
    		if ('isScrolled' in $$props) $$invalidate(1, isScrolled = $$props.isScrolled);
    		if ('currentDate' in $$props) $$invalidate(2, currentDate = $$props.currentDate);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		isMenuOpen,
    		isScrolled,
    		currentDate,
    		toggleMenu,
    		scrollToSection,
    		click_handler
    	];
    }

    class Topnav extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init$1(this, options, instance$7, create_fragment$7, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Topnav",
    			options,
    			id: create_fragment$7.name
    		});
    	}
    }

    /* src\home\hero.svelte generated by Svelte v3.59.2 */
    const file$5 = "src\\home\\hero.svelte";

    function create_fragment$6(ctx) {
    	let div11;
    	let div10;
    	let header;
    	let h1;
    	let t1;
    	let div0;
    	let p0;
    	let t3;
    	let p1;
    	let t5;
    	let div9;
    	let div5;
    	let div1;
    	let span0;
    	let t7;
    	let h2;
    	let t9;
    	let h3;
    	let t10;
    	let p2;
    	let t12;
    	let div2;
    	let button0;
    	let t14;
    	let button1;
    	let t16;
    	let div4;
    	let h4;
    	let t18;
    	let div3;
    	let span1;
    	let t20;
    	let span2;
    	let t22;
    	let span3;
    	let t24;
    	let span4;
    	let t26;
    	let div8;
    	let div7;
    	let img;
    	let img_src_value;
    	let t27;
    	let div6;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div11 = element("div");
    			div10 = element("div");
    			header = element("header");
    			h1 = element("h1");
    			h1.textContent = "THE DEVELOPER TIMES";
    			t1 = space();
    			div0 = element("div");
    			p0 = element("p");

    			p0.textContent = `${new Date().toLocaleDateString('en-US', {
				weekday: 'long',
				month: 'long',
				day: 'numeric',
				year: 'numeric'
			})}`;

    			t3 = space();
    			p1 = element("p");
    			p1.textContent = "DIGITAL EDITION";
    			t5 = space();
    			div9 = element("div");
    			div5 = element("div");
    			div1 = element("div");
    			span0 = element("span");
    			span0.textContent = "FEATURED DEVELOPER";
    			t7 = space();
    			h2 = element("h2");
    			h2.textContent = `${/*name*/ ctx[0]}`;
    			t9 = space();
    			h3 = element("h3");
    			t10 = space();
    			p2 = element("p");
    			p2.textContent = "In the ever-evolving landscape of technology, a developer emerges \r\n                    with a passion for crafting elegant solutions and pushing the \r\n                    boundaries of digital innovation.";
    			t12 = space();
    			div2 = element("div");
    			button0 = element("button");
    			button0.textContent = "View Portfolio";
    			t14 = space();
    			button1 = element("button");
    			button1.textContent = "Get in Touch";
    			t16 = space();
    			div4 = element("div");
    			h4 = element("h4");
    			h4.textContent = "TECHNOLOGIES OF CHOICE";
    			t18 = space();
    			div3 = element("div");
    			span1 = element("span");
    			span1.textContent = "Java";
    			t20 = space();
    			span2 = element("span");
    			span2.textContent = "PHP";
    			t22 = space();
    			span3 = element("span");
    			span3.textContent = "Svelte.js";
    			t24 = space();
    			span4 = element("span");
    			span4.textContent = "Python";
    			t26 = space();
    			div8 = element("div");
    			div7 = element("div");
    			img = element("img");
    			t27 = space();
    			div6 = element("div");
    			div6.textContent = "Portrait of Innovation";
    			attr_dev(h1, "class", "newspaper-title svelte-d0xhx5");
    			add_location(h1, file$5, 43, 12, 1365);
    			attr_dev(p0, "class", "date");
    			add_location(p0, file$5, 45, 16, 1477);
    			attr_dev(p1, "class", "edition");
    			add_location(p1, file$5, 46, 16, 1624);
    			attr_dev(div0, "class", "newspaper-meta svelte-d0xhx5");
    			add_location(div0, file$5, 44, 12, 1431);
    			attr_dev(header, "class", "newspaper-header svelte-d0xhx5");
    			add_location(header, file$5, 42, 8, 1318);
    			attr_dev(span0, "class", "category svelte-d0xhx5");
    			add_location(span0, file$5, 53, 20, 1844);
    			attr_dev(h2, "class", "name svelte-d0xhx5");
    			add_location(h2, file$5, 54, 20, 1914);
    			attr_dev(h3, "class", "typewriter svelte-d0xhx5");
    			add_location(h3, file$5, 55, 20, 1964);
    			attr_dev(div1, "class", "headline svelte-d0xhx5");
    			add_location(div1, file$5, 52, 16, 1800);
    			attr_dev(p2, "class", "lead svelte-d0xhx5");
    			add_location(p2, file$5, 58, 16, 2036);
    			attr_dev(button0, "class", "btn primary svelte-d0xhx5");
    			add_location(button0, file$5, 65, 20, 2384);
    			attr_dev(button1, "class", "btn secondary svelte-d0xhx5");
    			add_location(button1, file$5, 71, 20, 2625);
    			attr_dev(div2, "class", "cta-buttons svelte-d0xhx5");
    			add_location(div2, file$5, 64, 16, 2337);
    			attr_dev(h4, "class", "svelte-d0xhx5");
    			add_location(h4, file$5, 80, 20, 2933);
    			attr_dev(span1, "class", "tech-tag svelte-d0xhx5");
    			add_location(span1, file$5, 82, 24, 3035);
    			attr_dev(span2, "class", "tech-tag svelte-d0xhx5");
    			add_location(span2, file$5, 83, 24, 3095);
    			attr_dev(span3, "class", "tech-tag svelte-d0xhx5");
    			add_location(span3, file$5, 84, 24, 3154);
    			attr_dev(span4, "class", "tech-tag svelte-d0xhx5");
    			add_location(span4, file$5, 85, 24, 3219);
    			attr_dev(div3, "class", "tech-tags svelte-d0xhx5");
    			add_location(div3, file$5, 81, 20, 2986);
    			attr_dev(div4, "class", "tech-stack svelte-d0xhx5");
    			add_location(div4, file$5, 79, 16, 2887);
    			attr_dev(div5, "class", "text-content");
    			add_location(div5, file$5, 51, 12, 1756);
    			if (!src_url_equal(img.src, img_src_value = "/images/taku.jpg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "Takue Mombe");
    			attr_dev(img, "class", "profile-image svelte-d0xhx5");
    			add_location(img, file$5, 92, 20, 3451);
    			attr_dev(div6, "class", "image-caption svelte-d0xhx5");
    			add_location(div6, file$5, 93, 20, 3541);
    			attr_dev(div7, "class", "image-container svelte-d0xhx5");
    			add_location(div7, file$5, 91, 16, 3400);
    			attr_dev(div8, "class", "image-content");
    			add_location(div8, file$5, 90, 12, 3355);
    			attr_dev(div9, "class", "content-wrapper svelte-d0xhx5");
    			add_location(div9, file$5, 50, 8, 1713);
    			attr_dev(div10, "class", "newspaper-container svelte-d0xhx5");
    			add_location(div10, file$5, 41, 4, 1275);
    			attr_dev(div11, "class", "hero-section svelte-d0xhx5");
    			add_location(div11, file$5, 40, 0, 1243);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div11, anchor);
    			append_dev(div11, div10);
    			append_dev(div10, header);
    			append_dev(header, h1);
    			append_dev(header, t1);
    			append_dev(header, div0);
    			append_dev(div0, p0);
    			append_dev(div0, t3);
    			append_dev(div0, p1);
    			append_dev(div10, t5);
    			append_dev(div10, div9);
    			append_dev(div9, div5);
    			append_dev(div5, div1);
    			append_dev(div1, span0);
    			append_dev(div1, t7);
    			append_dev(div1, h2);
    			append_dev(div1, t9);
    			append_dev(div1, h3);
    			append_dev(div5, t10);
    			append_dev(div5, p2);
    			append_dev(div5, t12);
    			append_dev(div5, div2);
    			append_dev(div2, button0);
    			append_dev(div2, t14);
    			append_dev(div2, button1);
    			append_dev(div5, t16);
    			append_dev(div5, div4);
    			append_dev(div4, h4);
    			append_dev(div4, t18);
    			append_dev(div4, div3);
    			append_dev(div3, span1);
    			append_dev(div3, t20);
    			append_dev(div3, span2);
    			append_dev(div3, t22);
    			append_dev(div3, span3);
    			append_dev(div3, t24);
    			append_dev(div3, span4);
    			append_dev(div9, t26);
    			append_dev(div9, div8);
    			append_dev(div8, div7);
    			append_dev(div7, img);
    			append_dev(div7, t27);
    			append_dev(div7, div6);

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", /*click_handler*/ ctx[1], false, false, false, false),
    					listen_dev(button1, "click", /*click_handler_1*/ ctx[2], false, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div11);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function scrollToSection(sectionId) {
    	const element = document.querySelector(sectionId);

    	if (element) {
    		element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    	}
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Hero', slots, []);
    	let name = "Takue Mombe";

    	onMount(() => {
    		// Typewriter effect
    		const typewriterElement = document.querySelector('.typewriter');

    		if (typewriterElement) {
    			const text = "SOFTWARE DEVELOPER";
    			let i = 0;
    			const speed = 100; // milliseconds

    			function typeWriter() {
    				if (i < text.length) {
    					typewriterElement.innerHTML += text.charAt(i);
    					i++;
    					setTimeout(typeWriter, speed);
    				} else {
    					// Add blinking cursor
    					typewriterElement.innerHTML += '<span class="cursor">|</span>';
    				}
    			}

    			setTimeout(typeWriter, 1000); // Delay start
    		}
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Hero> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => scrollToSection('#projects');
    	const click_handler_1 = () => scrollToSection('#contact');
    	$$self.$capture_state = () => ({ onMount, name, scrollToSection });

    	$$self.$inject_state = $$props => {
    		if ('name' in $$props) $$invalidate(0, name = $$props.name);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [name, click_handler, click_handler_1];
    }

    class Hero extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init$1(this, options, instance$6, create_fragment$6, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Hero",
    			options,
    			id: create_fragment$6.name
    		});
    	}
    }

    /* src\home\about.svelte generated by Svelte v3.59.2 */
    const file$4 = "src\\home\\about.svelte";

    function create_fragment$5(ctx) {
    	let section;
    	let div22;
    	let div3;
    	let div0;
    	let t2;
    	let h1;
    	let t4;
    	let div1;
    	let t6;
    	let div2;
    	let t7;
    	let div21;
    	let div6;
    	let div4;
    	let t9;
    	let h2;
    	let t11;
    	let div5;
    	let t13;
    	let div20;
    	let div12;
    	let div7;
    	let t15;
    	let div11;
    	let div8;
    	let span0;
    	let t17;
    	let span1;
    	let t19;
    	let div9;
    	let span2;
    	let t21;
    	let span3;
    	let t23;
    	let div10;
    	let span4;
    	let t25;
    	let span5;
    	let t27;
    	let blockquote;
    	let p0;
    	let t29;
    	let cite;
    	let t31;
    	let div19;
    	let div18;
    	let h3;
    	let t33;
    	let div17;
    	let div14;
    	let div13;
    	let span6;
    	let t35;
    	let h40;
    	let t37;
    	let p1;
    	let t39;
    	let div16;
    	let div15;
    	let span7;
    	let t41;
    	let h41;
    	let t43;
    	let p2;

    	const block = {
    		c: function create() {
    			section = element("section");
    			div22 = element("div");
    			div3 = element("div");
    			div0 = element("div");

    			div0.textContent = `EDITION ${new Date().toLocaleDateString('en-US', {
				weekday: 'long',
				month: 'long',
				day: 'numeric',
				year: 'numeric'
			})}`;

    			t2 = space();
    			h1 = element("h1");
    			h1.textContent = "THE DEVELOPER CHRONICLE";
    			t4 = space();
    			div1 = element("div");
    			div1.textContent = "PORTFOLIO EDITION";
    			t6 = space();
    			div2 = element("div");
    			t7 = space();
    			div21 = element("div");
    			div6 = element("div");
    			div4 = element("div");
    			div4.textContent = "DEVELOPER PROFILE";
    			t9 = space();
    			h2 = element("h2");
    			h2.textContent = "The Journey of Innovation";
    			t11 = space();
    			div5 = element("div");
    			div5.textContent = "A Story of Code, Creativity, and Continuous Growth";
    			t13 = space();
    			div20 = element("div");
    			div12 = element("div");
    			div7 = element("div");
    			div7.textContent = "In the ever-evolving landscape of technology, every developer has a unique story. \n                        Here's an inside look at the journey, experience, and professional milestones \n                        that shape today's innovative solutions.";
    			t15 = space();
    			div11 = element("div");
    			div8 = element("div");
    			span0 = element("span");
    			span0.textContent = "2+";
    			t17 = space();
    			span1 = element("span");
    			span1.textContent = "Years of Experience";
    			t19 = space();
    			div9 = element("div");
    			span2 = element("span");
    			span2.textContent = "15+";
    			t21 = space();
    			span3 = element("span");
    			span3.textContent = "Projects Completed";
    			t23 = space();
    			div10 = element("div");
    			span4 = element("span");
    			span4.textContent = "5+";
    			t25 = space();
    			span5 = element("span");
    			span5.textContent = "Technologies Mastered";
    			t27 = space();
    			blockquote = element("blockquote");
    			p0 = element("p");
    			p0.textContent = "\"Every line of code tells a story, and my journey has been about crafting narratives that solve real problems through technology.\"";
    			t29 = space();
    			cite = element("cite");
    			cite.textContent = "— Takudzwa Josiah Mombe";
    			t31 = space();
    			div19 = element("div");
    			div18 = element("div");
    			h3 = element("h3");
    			h3.textContent = "CAREER HIGHLIGHTS";
    			t33 = space();
    			div17 = element("div");
    			div14 = element("div");
    			div13 = element("div");
    			span6 = element("span");
    			span6.textContent = "2024 - Present";
    			t35 = space();
    			h40 = element("h4");
    			h40.textContent = "Full Stack Developer";
    			t37 = space();
    			p1 = element("p");
    			p1.textContent = "Leading development of web applications and APIs, focusing on scalable and maintainable solutions.";
    			t39 = space();
    			div16 = element("div");
    			div15 = element("div");
    			span7 = element("span");
    			span7.textContent = "2023 - 2024";
    			t41 = space();
    			h41 = element("h4");
    			h41.textContent = "Junior Developer";
    			t43 = space();
    			p2 = element("p");
    			p2.textContent = "Full-stack development and system maintenance, building strong foundations in modern web technologies.";
    			attr_dev(div0, "class", "edition-date svelte-1cb34yf");
    			add_location(div0, file$4, 27, 12, 813);
    			attr_dev(h1, "class", "masthead-title svelte-1cb34yf");
    			add_location(h1, file$4, 28, 12, 975);
    			attr_dev(div1, "class", "edition-type svelte-1cb34yf");
    			add_location(div1, file$4, 29, 12, 1043);
    			attr_dev(div2, "class", "divider svelte-1cb34yf");
    			add_location(div2, file$4, 30, 12, 1105);
    			attr_dev(div3, "class", "masthead svelte-1cb34yf");
    			add_location(div3, file$4, 26, 8, 778);
    			attr_dev(div4, "class", "category-label svelte-1cb34yf");
    			add_location(div4, file$4, 36, 16, 1265);
    			attr_dev(h2, "class", "headline svelte-1cb34yf");
    			add_location(h2, file$4, 37, 16, 1333);
    			attr_dev(div5, "class", "subhead svelte-1cb34yf");
    			add_location(div5, file$4, 38, 16, 1401);
    			attr_dev(div6, "class", "story-header svelte-1cb34yf");
    			add_location(div6, file$4, 35, 12, 1222);
    			attr_dev(div7, "class", "lead-paragraph svelte-1cb34yf");
    			add_location(div7, file$4, 44, 20, 1645);
    			attr_dev(span0, "class", "stat-value svelte-1cb34yf");
    			add_location(span0, file$4, 52, 28, 2109);
    			attr_dev(span1, "class", "stat-label svelte-1cb34yf");
    			add_location(span1, file$4, 53, 28, 2172);
    			attr_dev(div8, "class", "about-card stats-box svelte-1cb34yf");
    			add_location(div8, file$4, 51, 24, 2046);
    			attr_dev(span2, "class", "stat-value svelte-1cb34yf");
    			add_location(span2, file$4, 56, 28, 2342);
    			attr_dev(span3, "class", "stat-label svelte-1cb34yf");
    			add_location(span3, file$4, 57, 28, 2406);
    			attr_dev(div9, "class", "about-card stats-box svelte-1cb34yf");
    			add_location(div9, file$4, 55, 24, 2279);
    			attr_dev(span4, "class", "stat-value svelte-1cb34yf");
    			add_location(span4, file$4, 60, 28, 2575);
    			attr_dev(span5, "class", "stat-label svelte-1cb34yf");
    			add_location(span5, file$4, 61, 28, 2638);
    			attr_dev(div10, "class", "about-card stats-box svelte-1cb34yf");
    			add_location(div10, file$4, 59, 24, 2512);
    			attr_dev(div11, "class", "stats-grid svelte-1cb34yf");
    			add_location(div11, file$4, 50, 20, 1997);
    			attr_dev(p0, "class", "svelte-1cb34yf");
    			add_location(p0, file$4, 66, 24, 2842);
    			attr_dev(cite, "class", "svelte-1cb34yf");
    			add_location(cite, file$4, 67, 24, 3004);
    			attr_dev(blockquote, "class", "about-card featured-quote svelte-1cb34yf");
    			add_location(blockquote, file$4, 65, 20, 2771);
    			attr_dev(div12, "class", "column main-column");
    			add_location(div12, file$4, 43, 16, 1592);
    			attr_dev(h3, "class", "section-title svelte-1cb34yf");
    			add_location(h3, file$4, 74, 24, 3255);
    			attr_dev(span6, "class", "timeline-date svelte-1cb34yf");
    			add_location(span6, file$4, 78, 36, 3516);
    			attr_dev(h40, "class", "svelte-1cb34yf");
    			add_location(h40, file$4, 79, 36, 3602);
    			attr_dev(div13, "class", "timeline-header svelte-1cb34yf");
    			add_location(div13, file$4, 77, 32, 3450);
    			attr_dev(p1, "class", "svelte-1cb34yf");
    			add_location(p1, file$4, 81, 32, 3703);
    			attr_dev(div14, "class", "about-card timeline-item svelte-1cb34yf");
    			add_location(div14, file$4, 76, 28, 3379);
    			attr_dev(span7, "class", "timeline-date svelte-1cb34yf");
    			add_location(span7, file$4, 85, 36, 4009);
    			attr_dev(h41, "class", "svelte-1cb34yf");
    			add_location(h41, file$4, 86, 36, 4092);
    			attr_dev(div15, "class", "timeline-header svelte-1cb34yf");
    			add_location(div15, file$4, 84, 32, 3943);
    			attr_dev(p2, "class", "svelte-1cb34yf");
    			add_location(p2, file$4, 88, 32, 4189);
    			attr_dev(div16, "class", "about-card timeline-item svelte-1cb34yf");
    			add_location(div16, file$4, 83, 28, 3872);
    			attr_dev(div17, "class", "timeline");
    			add_location(div17, file$4, 75, 24, 3328);
    			attr_dev(div18, "class", "career-section");
    			add_location(div18, file$4, 73, 20, 3202);
    			attr_dev(div19, "class", "column sidebar svelte-1cb34yf");
    			add_location(div19, file$4, 72, 16, 3153);
    			attr_dev(div20, "class", "story-columns svelte-1cb34yf");
    			add_location(div20, file$4, 41, 12, 1511);
    			attr_dev(div21, "class", "main-story");
    			add_location(div21, file$4, 34, 8, 1185);
    			attr_dev(div22, "class", "newspaper-container svelte-1cb34yf");
    			add_location(div22, file$4, 24, 4, 710);
    			attr_dev(section, "class", "about-section svelte-1cb34yf");
    			attr_dev(section, "id", "about");
    			toggle_class(section, "visible", /*isVisible*/ ctx[0]);
    			add_location(section, file$4, 23, 0, 637);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			append_dev(section, div22);
    			append_dev(div22, div3);
    			append_dev(div3, div0);
    			append_dev(div3, t2);
    			append_dev(div3, h1);
    			append_dev(div3, t4);
    			append_dev(div3, div1);
    			append_dev(div3, t6);
    			append_dev(div3, div2);
    			append_dev(div22, t7);
    			append_dev(div22, div21);
    			append_dev(div21, div6);
    			append_dev(div6, div4);
    			append_dev(div6, t9);
    			append_dev(div6, h2);
    			append_dev(div6, t11);
    			append_dev(div6, div5);
    			append_dev(div21, t13);
    			append_dev(div21, div20);
    			append_dev(div20, div12);
    			append_dev(div12, div7);
    			append_dev(div12, t15);
    			append_dev(div12, div11);
    			append_dev(div11, div8);
    			append_dev(div8, span0);
    			append_dev(div8, t17);
    			append_dev(div8, span1);
    			append_dev(div11, t19);
    			append_dev(div11, div9);
    			append_dev(div9, span2);
    			append_dev(div9, t21);
    			append_dev(div9, span3);
    			append_dev(div11, t23);
    			append_dev(div11, div10);
    			append_dev(div10, span4);
    			append_dev(div10, t25);
    			append_dev(div10, span5);
    			append_dev(div12, t27);
    			append_dev(div12, blockquote);
    			append_dev(blockquote, p0);
    			append_dev(blockquote, t29);
    			append_dev(blockquote, cite);
    			append_dev(div20, t31);
    			append_dev(div20, div19);
    			append_dev(div19, div18);
    			append_dev(div18, h3);
    			append_dev(div18, t33);
    			append_dev(div18, div17);
    			append_dev(div17, div14);
    			append_dev(div14, div13);
    			append_dev(div13, span6);
    			append_dev(div13, t35);
    			append_dev(div13, h40);
    			append_dev(div14, t37);
    			append_dev(div14, p1);
    			append_dev(div17, t39);
    			append_dev(div17, div16);
    			append_dev(div16, div15);
    			append_dev(div15, span7);
    			append_dev(div15, t41);
    			append_dev(div15, h41);
    			append_dev(div16, t43);
    			append_dev(div16, p2);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*isVisible*/ 1) {
    				toggle_class(section, "visible", /*isVisible*/ ctx[0]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('About', slots, []);
    	let isVisible = false;

    	onMount(() => {
    		$$invalidate(0, isVisible = true);

    		// Intersection Observer for cards
    		const cards = document.querySelectorAll('.about-card');

    		const observer = new IntersectionObserver(entries => {
    				entries.forEach(entry => {
    					if (entry.isIntersecting) {
    						entry.target.classList.add('visible');
    					}
    				});
    			},
    		{ threshold: 0.1 });

    		cards.forEach(card => observer.observe(card));
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<About> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ onMount, isVisible });

    	$$self.$inject_state = $$props => {
    		if ('isVisible' in $$props) $$invalidate(0, isVisible = $$props.isVisible);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [isVisible];
    }

    class About extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init$1(this, options, instance$5, create_fragment$5, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "About",
    			options,
    			id: create_fragment$5.name
    		});
    	}
    }

    /* src\home\project.svelte generated by Svelte v3.59.2 */
    const file$3 = "src\\home\\project.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[1] = list[i];
    	return child_ctx;
    }

    function get_each_context_1$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[4] = list[i];
    	return child_ctx;
    }

    // (143:28) {#each project.tech as tech}
    function create_each_block_1$1(ctx) {
    	let li;
    	let t_value = /*tech*/ ctx[4] + "";
    	let t;

    	const block = {
    		c: function create() {
    			li = element("li");
    			t = text(t_value);
    			attr_dev(li, "class", "tech-item svelte-9ewhm2");
    			add_location(li, file$3, 143, 44, 7519);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, t);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1$1.name,
    		type: "each",
    		source: "(143:28) {#each project.tech as tech}",
    		ctx
    	});

    	return block;
    }

    // (156:28) {#if project.live}
    function create_if_block_1$1(ctx) {
    	let div;
    	let a;
    	let span0;
    	let t1;
    	let span1;

    	const block = {
    		c: function create() {
    			div = element("div");
    			a = element("a");
    			span0 = element("span");
    			span0.textContent = "✨";
    			t1 = space();
    			span1 = element("span");
    			span1.textContent = "Experience Live";
    			attr_dev(span0, "class", "link-icon svelte-9ewhm2");
    			add_location(span0, file$3, 158, 48, 8403);
    			attr_dev(span1, "class", "link-text");
    			add_location(span1, file$3, 159, 48, 8484);
    			attr_dev(a, "href", /*project*/ ctx[1].live);
    			attr_dev(a, "target", "_blank");
    			attr_dev(a, "class", "news-link svelte-9ewhm2");
    			add_location(a, file$3, 157, 44, 8297);
    			attr_dev(div, "class", "link-box svelte-9ewhm2");
    			add_location(div, file$3, 156, 40, 8230);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, a);
    			append_dev(a, span0);
    			append_dev(a, t1);
    			append_dev(a, span1);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(156:28) {#if project.live}",
    		ctx
    	});

    	return block;
    }

    // (164:28) {#if project.download}
    function create_if_block$1(ctx) {
    	let div;
    	let a;
    	let span0;
    	let t1;
    	let span1;

    	const block = {
    		c: function create() {
    			div = element("div");
    			a = element("a");
    			span0 = element("span");
    			span0.textContent = "📥";
    			t1 = space();
    			span1 = element("span");
    			span1.textContent = "Try It Now";
    			attr_dev(span0, "class", "link-icon svelte-9ewhm2");
    			add_location(span0, file$3, 166, 48, 8922);
    			attr_dev(span1, "class", "link-text");
    			add_location(span1, file$3, 167, 48, 9004);
    			attr_dev(a, "href", /*project*/ ctx[1].download);
    			attr_dev(a, "download", "");
    			attr_dev(a, "class", "news-link svelte-9ewhm2");
    			add_location(a, file$3, 165, 44, 8819);
    			attr_dev(div, "class", "link-box svelte-9ewhm2");
    			add_location(div, file$3, 164, 40, 8752);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, a);
    			append_dev(a, span0);
    			append_dev(a, t1);
    			append_dev(a, span1);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(164:28) {#if project.download}",
    		ctx
    	});

    	return block;
    }

    // (124:16) {#each projects as project}
    function create_each_block$1(ctx) {
    	let article;
    	let div0;
    	let h3;
    	let t0_value = /*project*/ ctx[1].title + "";
    	let t0;
    	let t1;
    	let p0;
    	let t2;
    	let html_tag;
    	let raw_value = /*project*/ ctx[1].category.toUpperCase() + "";
    	let t3;
    	let t4_value = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) + "";
    	let t4;
    	let t5;
    	let div6;
    	let div1;
    	let img;
    	let img_src_value;
    	let t6;
    	let p1;
    	let t7;
    	let t8_value = /*project*/ ctx[1].title + "";
    	let t8;
    	let t9;
    	let t10;
    	let div5;
    	let p2;
    	let t11_value = /*project*/ ctx[1].description + "";
    	let t11;
    	let t12;
    	let div2;
    	let h4;
    	let t14;
    	let ul;
    	let t15;
    	let div4;
    	let div3;
    	let a;
    	let span0;
    	let t17;
    	let span1;
    	let t19;
    	let t20;
    	let t21;
    	let div8;
    	let div7;
    	let t22;
    	let p3;
    	let t24;
    	let each_value_1 = /*project*/ ctx[1].tech;
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1$1(get_each_context_1$1(ctx, each_value_1, i));
    	}

    	let if_block0 = /*project*/ ctx[1].live && create_if_block_1$1(ctx);
    	let if_block1 = /*project*/ ctx[1].download && create_if_block$1(ctx);

    	const block = {
    		c: function create() {
    			article = element("article");
    			div0 = element("div");
    			h3 = element("h3");
    			t0 = text(t0_value);
    			t1 = space();
    			p0 = element("p");
    			t2 = text("EXPERTISE IN ");
    			html_tag = new HtmlTag(false);
    			t3 = text(" • Completed ");
    			t4 = text(t4_value);
    			t5 = space();
    			div6 = element("div");
    			div1 = element("div");
    			img = element("img");
    			t6 = space();
    			p1 = element("p");
    			t7 = text("Showcase: The innovative ");
    			t8 = text(t8_value);
    			t9 = text(" platform in action.");
    			t10 = space();
    			div5 = element("div");
    			p2 = element("p");
    			t11 = text(t11_value);
    			t12 = space();
    			div2 = element("div");
    			h4 = element("h4");
    			h4.textContent = "TECHNICAL EXPERTISE DEMONSTRATED:";
    			t14 = space();
    			ul = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t15 = space();
    			div4 = element("div");
    			div3 = element("div");
    			a = element("a");
    			span0 = element("span");
    			span0.textContent = "⚡";
    			t17 = space();
    			span1 = element("span");
    			span1.textContent = "Examine Code Quality";
    			t19 = space();
    			if (if_block0) if_block0.c();
    			t20 = space();
    			if (if_block1) if_block1.c();
    			t21 = space();
    			div8 = element("div");
    			div7 = element("div");
    			t22 = space();
    			p3 = element("p");
    			p3.textContent = "More Impressive Projects on Next Page";
    			t24 = space();
    			attr_dev(h3, "class", "article-title svelte-9ewhm2");
    			add_location(h3, file$3, 126, 28, 6334);
    			html_tag.a = t3;
    			attr_dev(p0, "class", "article-dateline svelte-9ewhm2");
    			add_location(p0, file$3, 127, 28, 6409);
    			attr_dev(div0, "class", "article-header svelte-9ewhm2");
    			add_location(div0, file$3, 125, 24, 6277);
    			if (!src_url_equal(img.src, img_src_value = /*project*/ ctx[1].image)) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", /*project*/ ctx[1].title);
    			attr_dev(img, "class", "news-image svelte-9ewhm2");
    			add_location(img, file$3, 132, 32, 6777);
    			attr_dev(p1, "class", "image-caption svelte-9ewhm2");
    			add_location(p1, file$3, 133, 32, 6876);
    			attr_dev(div1, "class", "article-image svelte-9ewhm2");
    			add_location(div1, file$3, 131, 28, 6717);
    			attr_dev(p2, "class", "article-lead svelte-9ewhm2");
    			add_location(p2, file$3, 137, 32, 7117);
    			attr_dev(h4, "class", "tech-heading svelte-9ewhm2");
    			add_location(h4, file$3, 140, 36, 7295);
    			attr_dev(ul, "class", "tech-list svelte-9ewhm2");
    			add_location(ul, file$3, 141, 36, 7395);
    			attr_dev(div2, "class", "article-tech svelte-9ewhm2");
    			add_location(div2, file$3, 139, 32, 7232);
    			attr_dev(span0, "class", "link-icon svelte-9ewhm2");
    			add_location(span0, file$3, 151, 44, 7926);
    			attr_dev(span1, "class", "link-text");
    			add_location(span1, file$3, 152, 44, 8003);
    			attr_dev(a, "href", /*project*/ ctx[1].github);
    			attr_dev(a, "target", "_blank");
    			attr_dev(a, "class", "news-link svelte-9ewhm2");
    			add_location(a, file$3, 150, 40, 7822);
    			attr_dev(div3, "class", "link-box svelte-9ewhm2");
    			add_location(div3, file$3, 149, 36, 7759);
    			attr_dev(div4, "class", "article-links svelte-9ewhm2");
    			add_location(div4, file$3, 148, 32, 7695);
    			attr_dev(div5, "class", "article-text svelte-9ewhm2");
    			add_location(div5, file$3, 136, 28, 7058);
    			attr_dev(div6, "class", "article-body svelte-9ewhm2");
    			add_location(div6, file$3, 130, 24, 6662);
    			attr_dev(div7, "class", "footer-line svelte-9ewhm2");
    			add_location(div7, file$3, 176, 28, 9387);
    			attr_dev(p3, "class", "footer-note svelte-9ewhm2");
    			add_location(p3, file$3, 177, 28, 9447);
    			attr_dev(div8, "class", "article-footer svelte-9ewhm2");
    			add_location(div8, file$3, 175, 24, 9330);
    			attr_dev(article, "class", "project-article svelte-9ewhm2");
    			add_location(article, file$3, 124, 20, 6219);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, article, anchor);
    			append_dev(article, div0);
    			append_dev(div0, h3);
    			append_dev(h3, t0);
    			append_dev(div0, t1);
    			append_dev(div0, p0);
    			append_dev(p0, t2);
    			html_tag.m(raw_value, p0);
    			append_dev(p0, t3);
    			append_dev(p0, t4);
    			append_dev(article, t5);
    			append_dev(article, div6);
    			append_dev(div6, div1);
    			append_dev(div1, img);
    			append_dev(div1, t6);
    			append_dev(div1, p1);
    			append_dev(p1, t7);
    			append_dev(p1, t8);
    			append_dev(p1, t9);
    			append_dev(div6, t10);
    			append_dev(div6, div5);
    			append_dev(div5, p2);
    			append_dev(p2, t11);
    			append_dev(div5, t12);
    			append_dev(div5, div2);
    			append_dev(div2, h4);
    			append_dev(div2, t14);
    			append_dev(div2, ul);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(ul, null);
    				}
    			}

    			append_dev(div5, t15);
    			append_dev(div5, div4);
    			append_dev(div4, div3);
    			append_dev(div3, a);
    			append_dev(a, span0);
    			append_dev(a, t17);
    			append_dev(a, span1);
    			append_dev(div4, t19);
    			if (if_block0) if_block0.m(div4, null);
    			append_dev(div4, t20);
    			if (if_block1) if_block1.m(div4, null);
    			append_dev(article, t21);
    			append_dev(article, div8);
    			append_dev(div8, div7);
    			append_dev(div8, t22);
    			append_dev(div8, p3);
    			append_dev(article, t24);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*projects*/ 1) {
    				each_value_1 = /*project*/ ctx[1].tech;
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1$1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_1$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(ul, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_1.length;
    			}

    			if (/*project*/ ctx[1].live) if_block0.p(ctx, dirty);
    			if (/*project*/ ctx[1].download) if_block1.p(ctx, dirty);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(article);
    			destroy_each(each_blocks, detaching);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(124:16) {#each projects as project}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let section;
    	let div30;
    	let div20;
    	let div2;
    	let div0;
    	let h1;
    	let t1;
    	let p0;
    	let t3;
    	let div1;
    	let p1;
    	let t5;
    	let p2;
    	let t7;
    	let div5;
    	let div3;
    	let h2;
    	let t9;
    	let p3;
    	let t11;
    	let div4;
    	let p4;
    	let t12;
    	let span0;
    	let t14;
    	let p5;
    	let t16;
    	let div9;
    	let div6;
    	let t17;
    	let div7;
    	let t19;
    	let div8;
    	let t20;
    	let div15;
    	let div14;
    	let div10;
    	let span1;
    	let t22;
    	let div11;
    	let h3;
    	let t24;
    	let p6;
    	let t26;
    	let div13;
    	let div12;
    	let span2;
    	let t28;
    	let span3;
    	let t30;
    	let div19;
    	let div16;
    	let t31;
    	let div17;
    	let t33;
    	let div18;
    	let t34;
    	let div27;
    	let div21;
    	let t35;
    	let div26;
    	let div23;
    	let div22;
    	let p7;
    	let t37;
    	let h40;
    	let t39;
    	let ul;
    	let li0;
    	let t41;
    	let li1;
    	let t43;
    	let li2;
    	let t45;
    	let li3;
    	let t47;
    	let li4;
    	let t49;
    	let p8;
    	let t50;
    	let a;
    	let t52;
    	let div24;
    	let h41;
    	let t54;
    	let p9;
    	let t56;
    	let p10;
    	let t58;
    	let div25;
    	let h42;
    	let t60;
    	let p11;
    	let t62;
    	let p12;
    	let t64;
    	let div29;
    	let div28;
    	let t65;
    	let p13;
    	let each_value = /*projects*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			section = element("section");
    			div30 = element("div");
    			div20 = element("div");
    			div2 = element("div");
    			div0 = element("div");
    			h1 = element("h1");
    			h1.textContent = "THE DEVELOPER TIMES";
    			t1 = space();
    			p0 = element("p");
    			p0.textContent = "SPECIAL HIRING EDITION • Breaking News in Tech Innovation";
    			t3 = space();
    			div1 = element("div");
    			p1 = element("p");
    			p1.textContent = "URGENT EDITION 2024";
    			t5 = space();
    			p2 = element("p");
    			p2.textContent = "Value: Priceless Talent";
    			t7 = space();
    			div5 = element("div");
    			div3 = element("div");
    			h2 = element("h2");
    			h2.textContent = "EXCEPTIONAL DEVELOPER SEEKS NEW OPPORTUNITY";
    			t9 = space();
    			p3 = element("p");
    			p3.textContent = "Portfolio of Innovation and Excellence";
    			t11 = space();
    			div4 = element("div");
    			p4 = element("p");
    			t12 = text("Featured Developer: ");
    			span0 = element("span");
    			span0.textContent = "Takudzwa Josiah Mombe";
    			t14 = space();
    			p5 = element("p");
    			p5.textContent = "\"Transforming Ideas into Exceptional Digital Experiences\"";
    			t16 = space();
    			div9 = element("div");
    			div6 = element("div");
    			t17 = space();
    			div7 = element("div");
    			div7.textContent = "★";
    			t19 = space();
    			div8 = element("div");
    			t20 = space();
    			div15 = element("div");
    			div14 = element("div");
    			div10 = element("div");
    			span1 = element("span");
    			span1.textContent = "AVAILABLE NOW";
    			t22 = space();
    			div11 = element("div");
    			h3 = element("h3");
    			h3.textContent = "EXCEPTIONAL DEVELOPER READY FOR NEXT CHALLENGE";
    			t24 = space();
    			p6 = element("p");
    			p6.textContent = "Full Stack • AI Integration • Modern Technologies";
    			t26 = space();
    			div13 = element("div");
    			div12 = element("div");
    			span2 = element("span");
    			span2.textContent = "HIRE TODAY";
    			t28 = space();
    			span3 = element("span");
    			span3.textContent = "→";
    			t30 = space();
    			div19 = element("div");
    			div16 = element("div");
    			t31 = space();
    			div17 = element("div");
    			div17.textContent = "✦";
    			t33 = space();
    			div18 = element("div");
    			t34 = space();
    			div27 = element("div");
    			div21 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t35 = space();
    			div26 = element("div");
    			div23 = element("div");
    			div22 = element("div");
    			p7 = element("p");
    			p7.textContent = "CAREER OPPORTUNITY";
    			t37 = space();
    			h40 = element("h4");
    			h40.textContent = "WHY HIRE ME?";
    			t39 = space();
    			ul = element("ul");
    			li0 = element("li");
    			li0.textContent = "✓ Full-stack development expertise";
    			t41 = space();
    			li1 = element("li");
    			li1.textContent = "✓ AI & modern tech integration";
    			t43 = space();
    			li2 = element("li");
    			li2.textContent = "✓ Problem-solving mindset";
    			t45 = space();
    			li3 = element("li");
    			li3.textContent = "✓ Strong project portfolio";
    			t47 = space();
    			li4 = element("li");
    			li4.textContent = "✓ Passionate about innovation";
    			t49 = space();
    			p8 = element("p");
    			t50 = text("Let's Connect: ");
    			a = element("a");
    			a.textContent = "mombejose@gmail.com";
    			t52 = space();
    			div24 = element("div");
    			h41 = element("h4");
    			h41.textContent = "DEVELOPER HIGHLIGHTS";
    			t54 = space();
    			p9 = element("p");
    			p9.textContent = "\"Bringing together technical excellence and creative problem-solving to deliver outstanding digital solutions. Experienced in modern frameworks and emerging technologies.\"";
    			t56 = space();
    			p10 = element("p");
    			p10.textContent = "Ready to contribute to your next big project";
    			t58 = space();
    			div25 = element("div");
    			h42 = element("h4");
    			h42.textContent = "AVAILABILITY";
    			t60 = space();
    			p11 = element("p");
    			p11.textContent = "Available for exciting opportunities in full-stack development, AI integration, and innovative tech projects.";
    			t62 = space();
    			p12 = element("p");
    			p12.textContent = "Status: Ready for New Challenges";
    			t64 = space();
    			div29 = element("div");
    			div28 = element("div");
    			t65 = space();
    			p13 = element("p");
    			p13.textContent = "Don't Miss This Opportunity • Contact Now for a Technical Discussion • Portfolio Edition 2024";
    			attr_dev(h1, "class", "masthead-title svelte-9ewhm2");
    			add_location(h1, file$3, 70, 20, 3722);
    			attr_dev(p0, "class", "masthead-subtitle svelte-9ewhm2");
    			add_location(p0, file$3, 71, 20, 3794);
    			attr_dev(div0, "class", "newspaper-title");
    			add_location(div0, file$3, 69, 16, 3672);
    			attr_dev(p1, "class", "date-line svelte-9ewhm2");
    			add_location(p1, file$3, 74, 20, 3973);
    			attr_dev(p2, "class", "price-line svelte-9ewhm2");
    			add_location(p2, file$3, 75, 20, 4038);
    			attr_dev(div1, "class", "newspaper-date svelte-9ewhm2");
    			add_location(div1, file$3, 73, 16, 3924);
    			attr_dev(div2, "class", "newspaper-masthead svelte-9ewhm2");
    			add_location(div2, file$3, 68, 12, 3623);
    			attr_dev(h2, "class", "section-headline svelte-9ewhm2");
    			add_location(h2, file$3, 81, 20, 4252);
    			attr_dev(p3, "class", "section-subhead svelte-9ewhm2");
    			add_location(p3, file$3, 82, 20, 4350);
    			attr_dev(div3, "class", "headline-column");
    			add_location(div3, file$3, 80, 16, 4202);
    			attr_dev(span0, "class", "author-name svelte-9ewhm2");
    			add_location(span0, file$3, 85, 68, 4557);
    			attr_dev(p4, "class", "newspaper-byline svelte-9ewhm2");
    			add_location(p4, file$3, 85, 20, 4509);
    			attr_dev(p5, "class", "developer-quote svelte-9ewhm2");
    			add_location(p5, file$3, 86, 20, 4636);
    			attr_dev(div4, "class", "headline-column");
    			add_location(div4, file$3, 84, 16, 4459);
    			attr_dev(div5, "class", "headline-section svelte-9ewhm2");
    			add_location(div5, file$3, 79, 12, 4155);
    			attr_dev(div6, "class", "divider-line svelte-9ewhm2");
    			add_location(div6, file$3, 91, 16, 4824);
    			attr_dev(div7, "class", "divider-icon svelte-9ewhm2");
    			add_location(div7, file$3, 92, 16, 4873);
    			attr_dev(div8, "class", "divider-line svelte-9ewhm2");
    			add_location(div8, file$3, 93, 16, 4923);
    			attr_dev(div9, "class", "newspaper-divider svelte-9ewhm2");
    			add_location(div9, file$3, 90, 12, 4776);
    			attr_dev(span1, "class", "banner-tag svelte-9ewhm2");
    			add_location(span1, file$3, 99, 24, 5129);
    			attr_dev(div10, "class", "banner-left svelte-9ewhm2");
    			add_location(div10, file$3, 98, 20, 5079);
    			attr_dev(h3, "class", "banner-headline svelte-9ewhm2");
    			add_location(h3, file$3, 102, 24, 5274);
    			attr_dev(p6, "class", "banner-subtext svelte-9ewhm2");
    			add_location(p6, file$3, 103, 24, 5378);
    			attr_dev(div11, "class", "banner-center svelte-9ewhm2");
    			add_location(div11, file$3, 101, 20, 5222);
    			attr_dev(span2, "class", "cta-text");
    			add_location(span2, file$3, 107, 28, 5609);
    			attr_dev(span3, "class", "cta-arrow svelte-9ewhm2");
    			add_location(span3, file$3, 108, 28, 5678);
    			attr_dev(div12, "class", "banner-cta svelte-9ewhm2");
    			add_location(div12, file$3, 106, 24, 5556);
    			attr_dev(div13, "class", "banner-right svelte-9ewhm2");
    			add_location(div13, file$3, 105, 20, 5505);
    			attr_dev(div14, "class", "banner-content svelte-9ewhm2");
    			add_location(div14, file$3, 97, 16, 5030);
    			attr_dev(div15, "class", "hire-banner svelte-9ewhm2");
    			add_location(div15, file$3, 96, 12, 4988);
    			attr_dev(div16, "class", "divider-line svelte-9ewhm2");
    			add_location(div16, file$3, 115, 16, 5872);
    			attr_dev(div17, "class", "divider-icon svelte-9ewhm2");
    			add_location(div17, file$3, 116, 16, 5921);
    			attr_dev(div18, "class", "divider-line svelte-9ewhm2");
    			add_location(div18, file$3, 117, 16, 5971);
    			attr_dev(div19, "class", "newspaper-divider svelte-9ewhm2");
    			add_location(div19, file$3, 114, 12, 5824);
    			attr_dev(div20, "class", "newspaper-header");
    			add_location(div20, file$3, 67, 8, 3580);
    			attr_dev(div21, "class", "newspaper-article svelte-9ewhm2");
    			add_location(div21, file$3, 122, 12, 6123);
    			attr_dev(p7, "class", "ad-label svelte-9ewhm2");
    			add_location(p7, file$3, 186, 24, 9796);
    			attr_dev(h40, "class", "ad-title svelte-9ewhm2");
    			add_location(h40, file$3, 187, 24, 9863);
    			attr_dev(li0, "class", "svelte-9ewhm2");
    			add_location(li0, file$3, 189, 28, 9982);
    			attr_dev(li1, "class", "svelte-9ewhm2");
    			add_location(li1, file$3, 190, 28, 10054);
    			attr_dev(li2, "class", "svelte-9ewhm2");
    			add_location(li2, file$3, 191, 28, 10122);
    			attr_dev(li3, "class", "svelte-9ewhm2");
    			add_location(li3, file$3, 192, 28, 10185);
    			attr_dev(li4, "class", "svelte-9ewhm2");
    			add_location(li4, file$3, 193, 28, 10249);
    			attr_dev(ul, "class", "hire-me-points svelte-9ewhm2");
    			add_location(ul, file$3, 188, 24, 9926);
    			attr_dev(a, "href", "mailto:mombejose@gmail.com");
    			attr_dev(a, "class", "svelte-9ewhm2");
    			add_location(a, file$3, 195, 61, 10379);
    			attr_dev(p8, "class", "ad-contact svelte-9ewhm2");
    			add_location(p8, file$3, 195, 24, 10342);
    			attr_dev(div22, "class", "ad-content");
    			add_location(div22, file$3, 185, 20, 9747);
    			attr_dev(div23, "class", "sidebar-ad hire-me-box svelte-9ewhm2");
    			add_location(div23, file$3, 184, 16, 9690);
    			attr_dev(h41, "class", "sidebar-title svelte-9ewhm2");
    			add_location(h41, file$3, 200, 20, 10589);
    			attr_dev(p9, "class", "sidebar-text svelte-9ewhm2");
    			add_location(p9, file$3, 201, 20, 10661);
    			attr_dev(p10, "class", "sidebar-signature svelte-9ewhm2");
    			add_location(p10, file$3, 202, 20, 10881);
    			attr_dev(div24, "class", "sidebar-section testimonial svelte-9ewhm2");
    			add_location(div24, file$3, 199, 16, 10527);
    			attr_dev(h42, "class", "sidebar-title svelte-9ewhm2");
    			add_location(h42, file$3, 206, 20, 11078);
    			attr_dev(p11, "class", "sidebar-text svelte-9ewhm2");
    			add_location(p11, file$3, 207, 20, 11142);
    			attr_dev(p12, "class", "availability-status svelte-9ewhm2");
    			add_location(p12, file$3, 208, 20, 11300);
    			attr_dev(div25, "class", "sidebar-section availability svelte-9ewhm2");
    			add_location(div25, file$3, 205, 16, 11015);
    			attr_dev(div26, "class", "newspaper-sidebar svelte-9ewhm2");
    			add_location(div26, file$3, 183, 12, 9642);
    			attr_dev(div27, "class", "newspaper-content svelte-9ewhm2");
    			add_location(div27, file$3, 121, 8, 6079);
    			attr_dev(div28, "class", "footer-line svelte-9ewhm2");
    			add_location(div28, file$3, 214, 12, 11477);
    			attr_dev(p13, "class", "footer-text svelte-9ewhm2");
    			add_location(p13, file$3, 215, 12, 11521);
    			attr_dev(div29, "class", "newspaper-footer svelte-9ewhm2");
    			add_location(div29, file$3, 213, 8, 11434);
    			attr_dev(div30, "class", "newspaper-container svelte-9ewhm2");
    			add_location(div30, file$3, 66, 4, 3538);
    			attr_dev(section, "class", "projects-section svelte-9ewhm2");
    			attr_dev(section, "id", "projects");
    			add_location(section, file$3, 65, 0, 3485);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			append_dev(section, div30);
    			append_dev(div30, div20);
    			append_dev(div20, div2);
    			append_dev(div2, div0);
    			append_dev(div0, h1);
    			append_dev(div0, t1);
    			append_dev(div0, p0);
    			append_dev(div2, t3);
    			append_dev(div2, div1);
    			append_dev(div1, p1);
    			append_dev(div1, t5);
    			append_dev(div1, p2);
    			append_dev(div20, t7);
    			append_dev(div20, div5);
    			append_dev(div5, div3);
    			append_dev(div3, h2);
    			append_dev(div3, t9);
    			append_dev(div3, p3);
    			append_dev(div5, t11);
    			append_dev(div5, div4);
    			append_dev(div4, p4);
    			append_dev(p4, t12);
    			append_dev(p4, span0);
    			append_dev(div4, t14);
    			append_dev(div4, p5);
    			append_dev(div20, t16);
    			append_dev(div20, div9);
    			append_dev(div9, div6);
    			append_dev(div9, t17);
    			append_dev(div9, div7);
    			append_dev(div9, t19);
    			append_dev(div9, div8);
    			append_dev(div20, t20);
    			append_dev(div20, div15);
    			append_dev(div15, div14);
    			append_dev(div14, div10);
    			append_dev(div10, span1);
    			append_dev(div14, t22);
    			append_dev(div14, div11);
    			append_dev(div11, h3);
    			append_dev(div11, t24);
    			append_dev(div11, p6);
    			append_dev(div14, t26);
    			append_dev(div14, div13);
    			append_dev(div13, div12);
    			append_dev(div12, span2);
    			append_dev(div12, t28);
    			append_dev(div12, span3);
    			append_dev(div20, t30);
    			append_dev(div20, div19);
    			append_dev(div19, div16);
    			append_dev(div19, t31);
    			append_dev(div19, div17);
    			append_dev(div19, t33);
    			append_dev(div19, div18);
    			append_dev(div30, t34);
    			append_dev(div30, div27);
    			append_dev(div27, div21);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(div21, null);
    				}
    			}

    			append_dev(div27, t35);
    			append_dev(div27, div26);
    			append_dev(div26, div23);
    			append_dev(div23, div22);
    			append_dev(div22, p7);
    			append_dev(div22, t37);
    			append_dev(div22, h40);
    			append_dev(div22, t39);
    			append_dev(div22, ul);
    			append_dev(ul, li0);
    			append_dev(ul, t41);
    			append_dev(ul, li1);
    			append_dev(ul, t43);
    			append_dev(ul, li2);
    			append_dev(ul, t45);
    			append_dev(ul, li3);
    			append_dev(ul, t47);
    			append_dev(ul, li4);
    			append_dev(div22, t49);
    			append_dev(div22, p8);
    			append_dev(p8, t50);
    			append_dev(p8, a);
    			append_dev(div26, t52);
    			append_dev(div26, div24);
    			append_dev(div24, h41);
    			append_dev(div24, t54);
    			append_dev(div24, p9);
    			append_dev(div24, t56);
    			append_dev(div24, p10);
    			append_dev(div26, t58);
    			append_dev(div26, div25);
    			append_dev(div25, h42);
    			append_dev(div25, t60);
    			append_dev(div25, p11);
    			append_dev(div25, t62);
    			append_dev(div25, p12);
    			append_dev(div30, t64);
    			append_dev(div30, div29);
    			append_dev(div29, div28);
    			append_dev(div29, t65);
    			append_dev(div29, p13);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*projects, Date*/ 1) {
    				each_value = /*projects*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div21, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Project', slots, []);

    	onMount(() => {
    		const projectCards = document.querySelectorAll('.project-card');

    		const observer = new IntersectionObserver(entries => {
    				entries.forEach(entry => {
    					if (entry.isIntersecting) {
    						entry.target.classList.add('visible');
    					}
    				});
    			},
    		{ threshold: 0.1 });

    		projectCards.forEach(card => observer.observe(card));
    	});

    	const projects = [
    		{
    			title: "AI Tasks",
    			description: "A sophisticated productivity app featuring glass morphism UI, AI-powered task suggestions using Google's Gemini API, and smart scheduling. Includes authentication with email/password and Google SSO, along with intelligent task management and modern design elements.",
    			image: "/images/projects/aischeduler.png",
    			tech: ["React", "Gemini API", "Glass UI", "Firebase Auth", "Google SSO"],
    			github: "https://github.com/Takue-Mombe/AITasks",
    			live: "https://aitasks-git-main-takudzwa-josiah-mombes-projects.vercel.app/",
    			category: "Full Stack"
    		},
    		{
    			title: "Sekani Security",
    			description: "A professional security company website showcasing comprehensive security solutions. Features a modern catalog-style services section, trust-building elements, and seamless contact integration. Built with a focus on professionalism and user trust.",
    			image: "/images/projects/sekani.png",
    			tech: ["React", "Next.js", "Tailwind CSS", "Responsive Design", "SEO Optimized"],
    			github: "https://github.com/Takue-Mombe/Sekani-Security",
    			live: "https://sekani-secure-web-takudzwa-josiah-mombes-projects.vercel.app/",
    			category: "Web Development"
    		},
    		{
    			title: "AgriConnect",
    			description: "An elegant platform connecting smallholder farmers with local buyers, restaurants, and cooperatives. Features include produce listings, real-time chat, harvest planning, and push notifications. Built with a focus on empowering local agriculture communities.",
    			image: "/images/projects/agriconnect.png",
    			tech: ["React", "Expo", "Node.js", "Firebase", "Push Notifications"],
    			github: "https://github.com/Takue-Mombe/AgriConnect",
    			live: "https://agriconnectmobi.netlify.app/",
    			category: "Full Stack"
    		},
    		{
    			title: "PDF Editor",
    			description: "A robust desktop application for PDF manipulation, featuring merge, split, and watermark functionalities. Built with Python and PyQt5 for a native desktop experience.",
    			image: "/images/projects/pdf-editor.jpg",
    			tech: ["Python", "PyQt5", "PyPDF2", "Qt Designer"],
    			github: "https://github.com/Takue-Mombe/PDF-Editor",
    			download: "/projects/PDF_Editor.zip",
    			category: "Desktop Application"
    		},
    		{
    			title: "Event Scheduler",
    			description: "This is an Event Scheduler app using Restful APIs using springboot, spring security and postgresql.",
    			image: "/images/projects/event.jpg",
    			tech: ["Java", "Springboot", "PSQL"],
    			github: "https://github.com/Takue-Mombe/EventScheduler",
    			category: "Web Application"
    		}
    	];

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Project> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ onMount, projects });
    	return [projects];
    }

    class Project extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init$1(this, options, instance$4, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Project",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    class EmailJSResponseStatus {
        constructor(_status = 0, _text = 'Network Error') {
            this.status = _status;
            this.text = _text;
        }
    }

    const createWebStorage = () => {
        if (typeof localStorage === 'undefined')
            return;
        return {
            get: (key) => Promise.resolve(localStorage.getItem(key)),
            set: (key, value) => Promise.resolve(localStorage.setItem(key, value)),
            remove: (key) => Promise.resolve(localStorage.removeItem(key)),
        };
    };

    const store = {
        origin: 'https://api.emailjs.com',
        blockHeadless: false,
        storageProvider: createWebStorage(),
    };

    const buildOptions = (options) => {
        if (!options)
            return {};
        // support compatibility with SDK v3
        if (typeof options === 'string') {
            return {
                publicKey: options,
            };
        }
        // eslint-disable-next-line @typescript-eslint/no-base-to-string
        if (options.toString() === '[object Object]') {
            return options;
        }
        return {};
    };

    /**
     * EmailJS global SDK config
     * @param {object} options - the EmailJS global SDK config options
     * @param {string} origin - the non-default EmailJS origin
     */
    const init = (options, origin = 'https://api.emailjs.com') => {
        if (!options)
            return;
        const opts = buildOptions(options);
        store.publicKey = opts.publicKey;
        store.blockHeadless = opts.blockHeadless;
        store.storageProvider = opts.storageProvider;
        store.blockList = opts.blockList;
        store.limitRate = opts.limitRate;
        store.origin = opts.origin || origin;
    };

    const sendPost = async (url, data, headers = {}) => {
        const response = await fetch(store.origin + url, {
            method: 'POST',
            headers,
            body: data,
        });
        const message = await response.text();
        const responseStatus = new EmailJSResponseStatus(response.status, message);
        if (response.ok) {
            return responseStatus;
        }
        throw responseStatus;
    };

    const validateParams = (publicKey, serviceID, templateID) => {
        if (!publicKey || typeof publicKey !== 'string') {
            throw 'The public key is required. Visit https://dashboard.emailjs.com/admin/account';
        }
        if (!serviceID || typeof serviceID !== 'string') {
            throw 'The service ID is required. Visit https://dashboard.emailjs.com/admin';
        }
        if (!templateID || typeof templateID !== 'string') {
            throw 'The template ID is required. Visit https://dashboard.emailjs.com/admin/templates';
        }
    };

    const validateTemplateParams = (templateParams) => {
        // eslint-disable-next-line @typescript-eslint/no-base-to-string
        if (templateParams && templateParams.toString() !== '[object Object]') {
            throw 'The template params have to be the object. Visit https://www.emailjs.com/docs/sdk/send/';
        }
    };

    const isHeadless = (navigator) => {
        return navigator.webdriver || !navigator.languages || navigator.languages.length === 0;
    };

    const headlessError = () => {
        return new EmailJSResponseStatus(451, 'Unavailable For Headless Browser');
    };

    const validateBlockListParams = (list, watchVariable) => {
        if (!Array.isArray(list)) {
            throw 'The BlockList list has to be an array';
        }
        if (typeof watchVariable !== 'string') {
            throw 'The BlockList watchVariable has to be a string';
        }
    };

    const isBlockListDisabled = (options) => {
        return !options.list?.length || !options.watchVariable;
    };
    const getValue = (data, name) => {
        return data instanceof FormData ? data.get(name) : data[name];
    };
    const isBlockedValueInParams = (options, params) => {
        if (isBlockListDisabled(options))
            return false;
        validateBlockListParams(options.list, options.watchVariable);
        const value = getValue(params, options.watchVariable);
        if (typeof value !== 'string')
            return false;
        return options.list.includes(value);
    };

    const blockedEmailError = () => {
        return new EmailJSResponseStatus(403, 'Forbidden');
    };

    const validateLimitRateParams = (throttle, id) => {
        if (typeof throttle !== 'number' || throttle < 0) {
            throw 'The LimitRate throttle has to be a positive number';
        }
        if (id && typeof id !== 'string') {
            throw 'The LimitRate ID has to be a non-empty string';
        }
    };

    const getLeftTime = async (id, throttle, storage) => {
        const lastTime = Number((await storage.get(id)) || 0);
        return throttle - Date.now() + lastTime;
    };
    const isLimitRateHit = async (defaultID, options, storage) => {
        if (!options.throttle || !storage) {
            return false;
        }
        validateLimitRateParams(options.throttle, options.id);
        const id = options.id || defaultID;
        const leftTime = await getLeftTime(id, options.throttle, storage);
        if (leftTime > 0) {
            return true;
        }
        await storage.set(id, Date.now().toString());
        return false;
    };

    const limitRateError = () => {
        return new EmailJSResponseStatus(429, 'Too Many Requests');
    };

    /**
     * Send a template to the specific EmailJS service
     * @param {string} serviceID - the EmailJS service ID
     * @param {string} templateID - the EmailJS template ID
     * @param {object} templateParams - the template params, what will be set to the EmailJS template
     * @param {object} options - the EmailJS SDK config options
     * @returns {Promise<EmailJSResponseStatus>}
     */
    const send = async (serviceID, templateID, templateParams, options) => {
        const opts = buildOptions(options);
        const publicKey = opts.publicKey || store.publicKey;
        const blockHeadless = opts.blockHeadless || store.blockHeadless;
        const storageProvider = opts.storageProvider || store.storageProvider;
        const blockList = { ...store.blockList, ...opts.blockList };
        const limitRate = { ...store.limitRate, ...opts.limitRate };
        if (blockHeadless && isHeadless(navigator)) {
            return Promise.reject(headlessError());
        }
        validateParams(publicKey, serviceID, templateID);
        validateTemplateParams(templateParams);
        if (templateParams && isBlockedValueInParams(blockList, templateParams)) {
            return Promise.reject(blockedEmailError());
        }
        if (await isLimitRateHit(location.pathname, limitRate, storageProvider)) {
            return Promise.reject(limitRateError());
        }
        const params = {
            lib_version: '4.4.1',
            user_id: publicKey,
            service_id: serviceID,
            template_id: templateID,
            template_params: templateParams,
        };
        return sendPost('/api/v1.0/email/send', JSON.stringify(params), {
            'Content-type': 'application/json',
        });
    };

    const validateForm = (form) => {
        if (!form || form.nodeName !== 'FORM') {
            throw 'The 3rd parameter is expected to be the HTML form element or the style selector of the form';
        }
    };

    const findHTMLForm = (form) => {
        return typeof form === 'string' ? document.querySelector(form) : form;
    };
    /**
     * Send a form the specific EmailJS service
     * @param {string} serviceID - the EmailJS service ID
     * @param {string} templateID - the EmailJS template ID
     * @param {string | HTMLFormElement} form - the form element or selector
     * @param {object} options - the EmailJS SDK config options
     * @returns {Promise<EmailJSResponseStatus>}
     */
    const sendForm = async (serviceID, templateID, form, options) => {
        const opts = buildOptions(options);
        const publicKey = opts.publicKey || store.publicKey;
        const blockHeadless = opts.blockHeadless || store.blockHeadless;
        const storageProvider = store.storageProvider || opts.storageProvider;
        const blockList = { ...store.blockList, ...opts.blockList };
        const limitRate = { ...store.limitRate, ...opts.limitRate };
        if (blockHeadless && isHeadless(navigator)) {
            return Promise.reject(headlessError());
        }
        const currentForm = findHTMLForm(form);
        validateParams(publicKey, serviceID, templateID);
        validateForm(currentForm);
        const formData = new FormData(currentForm);
        if (isBlockedValueInParams(blockList, formData)) {
            return Promise.reject(blockedEmailError());
        }
        if (await isLimitRateHit(location.pathname, limitRate, storageProvider)) {
            return Promise.reject(limitRateError());
        }
        formData.append('lib_version', '4.4.1');
        formData.append('service_id', serviceID);
        formData.append('template_id', templateID);
        formData.append('user_id', publicKey);
        return sendPost('/api/v1.0/email/send-form', formData);
    };

    var emailjs = {
        init,
        send,
        sendForm,
        EmailJSResponseStatus,
    };

    /* src\home\contact.svelte generated by Svelte v3.59.2 */
    const file$2 = "src\\home\\contact.svelte";

    // (224:20) {#if submitStatus}
    function create_if_block(ctx) {
    	let div1;
    	let div0;
    	let t0;
    	let t1_value = /*submitStatus*/ ctx[2].message + "";
    	let t1;
    	let div1_class_value;

    	function select_block_type(ctx, dirty) {
    		if (/*submitStatus*/ ctx[2].type === 'success') return create_if_block_1;
    		return create_else_block;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			if_block.c();
    			t0 = space();
    			t1 = text(t1_value);
    			attr_dev(div0, "class", "status-icon svelte-1saib08");
    			add_location(div0, file$2, 225, 28, 8398);
    			attr_dev(div1, "class", div1_class_value = "status-message " + /*submitStatus*/ ctx[2].type + " svelte-1saib08");
    			add_location(div1, file$2, 224, 24, 8320);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			if_block.m(div0, null);
    			append_dev(div1, t0);
    			append_dev(div1, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type !== (current_block_type = select_block_type(ctx))) {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(div0, null);
    				}
    			}

    			if (dirty & /*submitStatus*/ 4 && t1_value !== (t1_value = /*submitStatus*/ ctx[2].message + "")) set_data_dev(t1, t1_value);

    			if (dirty & /*submitStatus*/ 4 && div1_class_value !== (div1_class_value = "status-message " + /*submitStatus*/ ctx[2].type + " svelte-1saib08")) {
    				attr_dev(div1, "class", div1_class_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(224:20) {#if submitStatus}",
    		ctx
    	});

    	return block;
    }

    // (229:32) {:else}
    function create_else_block(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("!");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(229:32) {:else}",
    		ctx
    	});

    	return block;
    }

    // (227:32) {#if submitStatus.type === 'success'}
    function create_if_block_1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("✓");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(227:32) {#if submitStatus.type === 'success'}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let section;
    	let div0;
    	let t0;
    	let div28;
    	let div11;
    	let div3;
    	let div1;
    	let h1;
    	let t2;
    	let p0;
    	let t4;
    	let div2;
    	let p1;
    	let t6;
    	let p2;
    	let t8;
    	let div6;
    	let div4;
    	let h2;
    	let t10;
    	let p3;
    	let t12;
    	let div5;
    	let p4;
    	let t14;
    	let div10;
    	let div7;
    	let t15;
    	let div8;
    	let t17;
    	let div9;
    	let t18;
    	let div25;
    	let div24;
    	let div16;
    	let form;
    	let div12;
    	let label0;
    	let t20;
    	let input0;
    	let t21;
    	let div13;
    	let label1;
    	let t23;
    	let input1;
    	let t24;
    	let div14;
    	let label2;
    	let t26;
    	let input2;
    	let t27;
    	let div15;
    	let label3;
    	let t29;
    	let textarea;
    	let t30;
    	let button;
    	let span0;
    	let t32;

    	let t33_value = (/*isSubmitting*/ ctx[1]
    	? 'Dispatching...'
    	: 'Send Correspondence') + "";

    	let t33;
    	let t34;
    	let t35;
    	let div23;
    	let div20;
    	let h30;
    	let t37;
    	let div17;
    	let i0;
    	let t38;
    	let span1;
    	let t40;
    	let div18;
    	let i1;
    	let t41;
    	let span2;
    	let t43;
    	let div19;
    	let i2;
    	let t44;
    	let span3;
    	let t46;
    	let div21;
    	let h31;
    	let t48;
    	let p5;
    	let t50;
    	let p6;
    	let t52;
    	let p7;
    	let t54;
    	let div22;
    	let p8;
    	let t56;
    	let div27;
    	let div26;
    	let t57;
    	let p9;
    	let t59;
    	let div29;
    	let a0;
    	let i3;
    	let t60;
    	let span4;
    	let t62;
    	let a1;
    	let i4;
    	let t63;
    	let span5;
    	let t65;
    	let a2;
    	let i5;
    	let t66;
    	let span6;
    	let mounted;
    	let dispose;
    	let if_block = /*submitStatus*/ ctx[2] && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			section = element("section");
    			div0 = element("div");
    			t0 = space();
    			div28 = element("div");
    			div11 = element("div");
    			div3 = element("div");
    			div1 = element("div");
    			h1 = element("h1");
    			h1.textContent = "THE DAILY DEVELOPER";
    			t2 = space();
    			p0 = element("p");
    			p0.textContent = "Est. 2024 • Vol. 1, No. 1 • www.takuemombe.me";
    			t4 = space();
    			div2 = element("div");
    			p1 = element("p");

    			p1.textContent = `${new Date().toLocaleDateString('en-US', {
				weekday: 'long',
				month: 'long',
				day: 'numeric',
				year: 'numeric'
			})}`;

    			t6 = space();
    			p2 = element("p");
    			p2.textContent = "Price: 1 Bitcoin";
    			t8 = space();
    			div6 = element("div");
    			div4 = element("div");
    			h2 = element("h2");
    			h2.textContent = "CONTACT THE EDITOR";
    			t10 = space();
    			p3 = element("p");
    			p3.textContent = "Send Your Inquiries and Correspondence";
    			t12 = space();
    			div5 = element("div");
    			p4 = element("p");
    			p4.textContent = "For Immediate Publication Consideration";
    			t14 = space();
    			div10 = element("div");
    			div7 = element("div");
    			t15 = space();
    			div8 = element("div");
    			div8.textContent = "✻";
    			t17 = space();
    			div9 = element("div");
    			t18 = space();
    			div25 = element("div");
    			div24 = element("div");
    			div16 = element("div");
    			form = element("form");
    			div12 = element("div");
    			label0 = element("label");
    			label0.textContent = "YOUR NAME";
    			t20 = space();
    			input0 = element("input");
    			t21 = space();
    			div13 = element("div");
    			label1 = element("label");
    			label1.textContent = "TELEGRAPH ADDRESS";
    			t23 = space();
    			input1 = element("input");
    			t24 = space();
    			div14 = element("div");
    			label2 = element("label");
    			label2.textContent = "SUBJECT MATTER";
    			t26 = space();
    			input2 = element("input");
    			t27 = space();
    			div15 = element("div");
    			label3 = element("label");
    			label3.textContent = "YOUR MESSAGE";
    			t29 = space();
    			textarea = element("textarea");
    			t30 = space();
    			button = element("button");
    			span0 = element("span");
    			span0.textContent = "✉";
    			t32 = space();
    			t33 = text(t33_value);
    			t34 = space();
    			if (if_block) if_block.c();
    			t35 = space();
    			div23 = element("div");
    			div20 = element("div");
    			h30 = element("h3");
    			h30.textContent = "EDITORIAL OFFICE";
    			t37 = space();
    			div17 = element("div");
    			i0 = element("i");
    			t38 = space();
    			span1 = element("span");
    			span1.textContent = "mombejose@gmail.com";
    			t40 = space();
    			div18 = element("div");
    			i1 = element("i");
    			t41 = space();
    			span2 = element("span");
    			span2.textContent = "+263 78 875 4745";
    			t43 = space();
    			div19 = element("div");
    			i2 = element("i");
    			t44 = space();
    			span3 = element("span");
    			span3.textContent = "Harare, Zimbabwe";
    			t46 = space();
    			div21 = element("div");
    			h31 = element("h3");
    			h31.textContent = "PUBLICATION HOURS";
    			t48 = space();
    			p5 = element("p");
    			p5.textContent = "Monday - Friday: 8:00 AM - 5:00 PM";
    			t50 = space();
    			p6 = element("p");
    			p6.textContent = "Saturday: 9:00 AM - 1:00 PM";
    			t52 = space();
    			p7 = element("p");
    			p7.textContent = "Sunday: Closed";
    			t54 = space();
    			div22 = element("div");
    			p8 = element("p");
    			p8.textContent = "All correspondence will be answered within 24-48 hours during publication days.";
    			t56 = space();
    			div27 = element("div");
    			div26 = element("div");
    			t57 = space();
    			p9 = element("p");
    			p9.textContent = "© 2024 The Daily Developer. All rights reserved. | Next Edition: Tomorrow Morning";
    			t59 = space();
    			div29 = element("div");
    			a0 = element("a");
    			i3 = element("i");
    			t60 = space();
    			span4 = element("span");
    			span4.textContent = "Send Telegram";
    			t62 = space();
    			a1 = element("a");
    			i4 = element("i");
    			t63 = space();
    			span5 = element("span");
    			span5.textContent = "Dispatch Pigeon";
    			t65 = space();
    			a2 = element("a");
    			i5 = element("i");
    			t66 = space();
    			span6 = element("span");
    			span6.textContent = "Send Courier";
    			attr_dev(div0, "id", "particles-contact");
    			attr_dev(div0, "class", "particles-js svelte-1saib08");
    			add_location(div0, file$2, 134, 4, 3951);
    			attr_dev(h1, "class", "masthead-title");
    			add_location(h1, file$2, 139, 20, 4200);
    			attr_dev(p0, "class", "masthead-subtitle");
    			add_location(p0, file$2, 140, 20, 4273);
    			attr_dev(div1, "class", "newspaper-title");
    			add_location(div1, file$2, 138, 16, 4149);
    			attr_dev(p1, "class", "date-line");
    			add_location(p1, file$2, 143, 20, 4443);
    			attr_dev(p2, "class", "price-line");
    			add_location(p2, file$2, 144, 20, 4599);
    			attr_dev(div2, "class", "newspaper-date");
    			add_location(div2, file$2, 142, 16, 4393);
    			attr_dev(div3, "class", "newspaper-masthead");
    			add_location(div3, file$2, 137, 12, 4099);
    			attr_dev(h2, "class", "section-headline");
    			add_location(h2, file$2, 150, 20, 4812);
    			attr_dev(p3, "class", "section-subhead");
    			add_location(p3, file$2, 151, 20, 4886);
    			attr_dev(div4, "class", "headline-column");
    			add_location(div4, file$2, 149, 16, 4761);
    			attr_dev(p4, "class", "newspaper-byline");
    			add_location(p4, file$2, 154, 20, 5048);
    			attr_dev(div5, "class", "headline-column");
    			add_location(div5, file$2, 153, 16, 4997);
    			attr_dev(div6, "class", "headline-section");
    			add_location(div6, file$2, 148, 12, 4713);
    			attr_dev(div7, "class", "divider-line");
    			add_location(div7, file$2, 159, 16, 5240);
    			attr_dev(div8, "class", "divider-icon");
    			add_location(div8, file$2, 160, 16, 5290);
    			attr_dev(div9, "class", "divider-line");
    			add_location(div9, file$2, 161, 16, 5341);
    			attr_dev(div10, "class", "newspaper-divider");
    			add_location(div10, file$2, 158, 12, 5191);
    			attr_dev(div11, "class", "newspaper-header");
    			add_location(div11, file$2, 136, 8, 4055);
    			attr_dev(label0, "class", "form-label svelte-1saib08");
    			add_location(label0, file$2, 170, 28, 5713);
    			attr_dev(input0, "type", "text");
    			attr_dev(input0, "name", "name");
    			attr_dev(input0, "placeholder", "Enter your full name");
    			input0.required = true;
    			attr_dev(input0, "class", "form-input svelte-1saib08");
    			add_location(input0, file$2, 171, 28, 5786);
    			attr_dev(div12, "class", "form-group svelte-1saib08");
    			add_location(div12, file$2, 169, 24, 5659);
    			attr_dev(label1, "class", "form-label svelte-1saib08");
    			add_location(label1, file$2, 182, 28, 6277);
    			attr_dev(input1, "type", "email");
    			attr_dev(input1, "name", "email");
    			attr_dev(input1, "placeholder", "Your electronic mail");
    			input1.required = true;
    			attr_dev(input1, "class", "form-input svelte-1saib08");
    			add_location(input1, file$2, 183, 28, 6358);
    			attr_dev(div13, "class", "form-group svelte-1saib08");
    			add_location(div13, file$2, 181, 24, 6223);
    			attr_dev(label2, "class", "form-label svelte-1saib08");
    			add_location(label2, file$2, 194, 28, 6852);
    			attr_dev(input2, "type", "text");
    			attr_dev(input2, "name", "subject");
    			attr_dev(input2, "placeholder", "Nature of your correspondence");
    			input2.required = true;
    			attr_dev(input2, "class", "form-input svelte-1saib08");
    			add_location(input2, file$2, 195, 28, 6930);
    			attr_dev(div14, "class", "form-group svelte-1saib08");
    			add_location(div14, file$2, 193, 24, 6798);
    			attr_dev(label3, "class", "form-label svelte-1saib08");
    			add_location(label3, file$2, 206, 28, 7436);
    			attr_dev(textarea, "name", "message");
    			attr_dev(textarea, "placeholder", "Compose your message here...");
    			attr_dev(textarea, "rows", "5");
    			textarea.required = true;
    			attr_dev(textarea, "class", "form-textarea svelte-1saib08");
    			add_location(textarea, file$2, 207, 28, 7512);
    			attr_dev(div15, "class", "form-group svelte-1saib08");
    			add_location(div15, file$2, 205, 24, 7382);
    			attr_dev(span0, "class", "btn-icon svelte-1saib08");
    			add_location(span0, file$2, 218, 28, 8070);
    			attr_dev(button, "type", "submit");
    			attr_dev(button, "class", "submit-btn svelte-1saib08");
    			button.disabled = /*isSubmitting*/ ctx[1];
    			add_location(button, file$2, 217, 24, 7975);
    			attr_dev(form, "class", "contact-form svelte-1saib08");
    			add_location(form, file$2, 168, 20, 5566);
    			attr_dev(div16, "class", "contact-form-column svelte-1saib08");
    			add_location(div16, file$2, 167, 16, 5511);
    			attr_dev(h30, "class", "card-title svelte-1saib08");
    			add_location(h30, file$2, 239, 24, 8966);
    			attr_dev(i0, "class", "fas fa-envelope svelte-1saib08");
    			add_location(i0, file$2, 241, 28, 9094);
    			add_location(span1, file$2, 242, 28, 9155);
    			attr_dev(div17, "class", "contact-method svelte-1saib08");
    			add_location(div17, file$2, 240, 24, 9036);
    			attr_dev(i1, "class", "fas fa-phone svelte-1saib08");
    			add_location(i1, file$2, 245, 28, 9303);
    			add_location(span2, file$2, 246, 28, 9361);
    			attr_dev(div18, "class", "contact-method svelte-1saib08");
    			add_location(div18, file$2, 244, 24, 9245);
    			attr_dev(i2, "class", "fas fa-map-marker-alt svelte-1saib08");
    			add_location(i2, file$2, 249, 28, 9506);
    			add_location(span3, file$2, 250, 28, 9573);
    			attr_dev(div19, "class", "contact-method svelte-1saib08");
    			add_location(div19, file$2, 248, 24, 9448);
    			attr_dev(div20, "class", "contact-card svelte-1saib08");
    			add_location(div20, file$2, 238, 20, 8914);
    			attr_dev(h31, "class", "card-title svelte-1saib08");
    			add_location(h31, file$2, 255, 24, 9758);
    			attr_dev(p5, "class", "svelte-1saib08");
    			add_location(p5, file$2, 256, 24, 9829);
    			attr_dev(p6, "class", "svelte-1saib08");
    			add_location(p6, file$2, 257, 24, 9896);
    			attr_dev(p7, "class", "svelte-1saib08");
    			add_location(p7, file$2, 258, 24, 9956);
    			attr_dev(div21, "class", "office-hours svelte-1saib08");
    			add_location(div21, file$2, 254, 20, 9706);
    			add_location(p8, file$2, 262, 24, 10104);
    			attr_dev(div22, "class", "dispatch-notice svelte-1saib08");
    			add_location(div22, file$2, 261, 20, 10049);
    			attr_dev(div23, "class", "contact-info-column svelte-1saib08");
    			add_location(div23, file$2, 237, 16, 8859);
    			attr_dev(div24, "class", "contact-columns svelte-1saib08");
    			add_location(div24, file$2, 166, 12, 5464);
    			attr_dev(div25, "class", "contact-content svelte-1saib08");
    			add_location(div25, file$2, 165, 8, 5421);
    			attr_dev(div26, "class", "footer-line");
    			add_location(div26, file$2, 269, 12, 10342);
    			attr_dev(p9, "class", "footer-text");
    			add_location(p9, file$2, 270, 12, 10387);
    			attr_dev(div27, "class", "newspaper-footer");
    			add_location(div27, file$2, 268, 8, 10298);
    			attr_dev(div28, "class", "newspaper-container svelte-1saib08");
    			add_location(div28, file$2, 135, 4, 4012);
    			attr_dev(i3, "class", "fab fa-whatsapp");
    			add_location(i3, file$2, 277, 12, 10731);
    			attr_dev(span4, "class", "tooltip svelte-1saib08");
    			add_location(span4, file$2, 278, 12, 10776);
    			attr_dev(a0, "href", "https://wa.me/788754745");
    			attr_dev(a0, "target", "_blank");
    			attr_dev(a0, "rel", "noopener noreferrer");
    			attr_dev(a0, "class", "social-btn whatsapp svelte-1saib08");
    			add_location(a0, file$2, 276, 8, 10613);
    			attr_dev(i4, "class", "fab fa-twitter");
    			add_location(i4, file$2, 281, 12, 10959);
    			attr_dev(span5, "class", "tooltip svelte-1saib08");
    			add_location(span5, file$2, 282, 12, 11003);
    			attr_dev(a1, "href", "https://x.com/JoseMombe");
    			attr_dev(a1, "target", "_blank");
    			attr_dev(a1, "rel", "noopener noreferrer");
    			attr_dev(a1, "class", "social-btn twitter svelte-1saib08");
    			add_location(a1, file$2, 280, 8, 10842);
    			attr_dev(i5, "class", "fas fa-envelope");
    			add_location(i5, file$2, 285, 12, 11147);
    			attr_dev(span6, "class", "tooltip svelte-1saib08");
    			add_location(span6, file$2, 286, 12, 11192);
    			attr_dev(a2, "href", "mailto:mombejose@gmail.com");
    			attr_dev(a2, "class", "social-btn email svelte-1saib08");
    			add_location(a2, file$2, 284, 8, 11071);
    			attr_dev(div29, "class", "floating-socials svelte-1saib08");
    			add_location(div29, file$2, 275, 4, 10573);
    			attr_dev(section, "class", "contact-section svelte-1saib08");
    			attr_dev(section, "id", "contact");
    			add_location(section, file$2, 133, 0, 3899);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			append_dev(section, div0);
    			append_dev(section, t0);
    			append_dev(section, div28);
    			append_dev(div28, div11);
    			append_dev(div11, div3);
    			append_dev(div3, div1);
    			append_dev(div1, h1);
    			append_dev(div1, t2);
    			append_dev(div1, p0);
    			append_dev(div3, t4);
    			append_dev(div3, div2);
    			append_dev(div2, p1);
    			append_dev(div2, t6);
    			append_dev(div2, p2);
    			append_dev(div11, t8);
    			append_dev(div11, div6);
    			append_dev(div6, div4);
    			append_dev(div4, h2);
    			append_dev(div4, t10);
    			append_dev(div4, p3);
    			append_dev(div6, t12);
    			append_dev(div6, div5);
    			append_dev(div5, p4);
    			append_dev(div11, t14);
    			append_dev(div11, div10);
    			append_dev(div10, div7);
    			append_dev(div10, t15);
    			append_dev(div10, div8);
    			append_dev(div10, t17);
    			append_dev(div10, div9);
    			append_dev(div28, t18);
    			append_dev(div28, div25);
    			append_dev(div25, div24);
    			append_dev(div24, div16);
    			append_dev(div16, form);
    			append_dev(form, div12);
    			append_dev(div12, label0);
    			append_dev(div12, t20);
    			append_dev(div12, input0);
    			set_input_value(input0, /*formData*/ ctx[0].name);
    			append_dev(form, t21);
    			append_dev(form, div13);
    			append_dev(div13, label1);
    			append_dev(div13, t23);
    			append_dev(div13, input1);
    			set_input_value(input1, /*formData*/ ctx[0].email);
    			append_dev(form, t24);
    			append_dev(form, div14);
    			append_dev(div14, label2);
    			append_dev(div14, t26);
    			append_dev(div14, input2);
    			set_input_value(input2, /*formData*/ ctx[0].subject);
    			append_dev(form, t27);
    			append_dev(form, div15);
    			append_dev(div15, label3);
    			append_dev(div15, t29);
    			append_dev(div15, textarea);
    			set_input_value(textarea, /*formData*/ ctx[0].message);
    			append_dev(form, t30);
    			append_dev(form, button);
    			append_dev(button, span0);
    			append_dev(button, t32);
    			append_dev(button, t33);
    			append_dev(div16, t34);
    			if (if_block) if_block.m(div16, null);
    			append_dev(div24, t35);
    			append_dev(div24, div23);
    			append_dev(div23, div20);
    			append_dev(div20, h30);
    			append_dev(div20, t37);
    			append_dev(div20, div17);
    			append_dev(div17, i0);
    			append_dev(div17, t38);
    			append_dev(div17, span1);
    			append_dev(div20, t40);
    			append_dev(div20, div18);
    			append_dev(div18, i1);
    			append_dev(div18, t41);
    			append_dev(div18, span2);
    			append_dev(div20, t43);
    			append_dev(div20, div19);
    			append_dev(div19, i2);
    			append_dev(div19, t44);
    			append_dev(div19, span3);
    			append_dev(div23, t46);
    			append_dev(div23, div21);
    			append_dev(div21, h31);
    			append_dev(div21, t48);
    			append_dev(div21, p5);
    			append_dev(div21, t50);
    			append_dev(div21, p6);
    			append_dev(div21, t52);
    			append_dev(div21, p7);
    			append_dev(div23, t54);
    			append_dev(div23, div22);
    			append_dev(div22, p8);
    			append_dev(div28, t56);
    			append_dev(div28, div27);
    			append_dev(div27, div26);
    			append_dev(div27, t57);
    			append_dev(div27, p9);
    			append_dev(section, t59);
    			append_dev(section, div29);
    			append_dev(div29, a0);
    			append_dev(a0, i3);
    			append_dev(a0, t60);
    			append_dev(a0, span4);
    			append_dev(div29, t62);
    			append_dev(div29, a1);
    			append_dev(a1, i4);
    			append_dev(a1, t63);
    			append_dev(a1, span5);
    			append_dev(div29, t65);
    			append_dev(div29, a2);
    			append_dev(a2, i5);
    			append_dev(a2, t66);
    			append_dev(a2, span6);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[4]),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[5]),
    					listen_dev(input2, "input", /*input2_input_handler*/ ctx[6]),
    					listen_dev(textarea, "input", /*textarea_input_handler*/ ctx[7]),
    					listen_dev(form, "submit", prevent_default(/*handleSubmit*/ ctx[3]), false, true, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*formData*/ 1 && input0.value !== /*formData*/ ctx[0].name) {
    				set_input_value(input0, /*formData*/ ctx[0].name);
    			}

    			if (dirty & /*formData*/ 1 && input1.value !== /*formData*/ ctx[0].email) {
    				set_input_value(input1, /*formData*/ ctx[0].email);
    			}

    			if (dirty & /*formData*/ 1 && input2.value !== /*formData*/ ctx[0].subject) {
    				set_input_value(input2, /*formData*/ ctx[0].subject);
    			}

    			if (dirty & /*formData*/ 1) {
    				set_input_value(textarea, /*formData*/ ctx[0].message);
    			}

    			if (dirty & /*isSubmitting*/ 2 && t33_value !== (t33_value = (/*isSubmitting*/ ctx[1]
    			? 'Dispatching...'
    			: 'Send Correspondence') + "")) set_data_dev(t33, t33_value);

    			if (dirty & /*isSubmitting*/ 2) {
    				prop_dev(button, "disabled", /*isSubmitting*/ ctx[1]);
    			}

    			if (/*submitStatus*/ ctx[2]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block(ctx);
    					if_block.c();
    					if_block.m(div16, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    			if (if_block) if_block.d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Contact', slots, []);

    	let formData = {
    		name: '',
    		email: '',
    		subject: '',
    		message: ''
    	};

    	let isSubmitting = false;
    	let submitStatus = null;

    	// Initialize EmailJS with your public key
    	emailjs.init("B31rxbPMCio3oeS6_");

    	onMount(() => {
    		particlesJS('particles-contact', {
    			particles: {
    				number: {
    					value: 60,
    					density: { enable: true, value_area: 800 }
    				},
    				color: {
    					value: '#FFD700', // Changed to gold
    					
    				},
    				shape: { type: 'circle' },
    				opacity: {
    					value: 0.3,
    					random: false,
    					anim: { enable: false }
    				},
    				size: { value: 3, random: true },
    				line_linked: {
    					enable: true,
    					distance: 150,
    					color: '#FFD700', // Changed to gold
    					opacity: 0.2,
    					width: 1
    				},
    				move: {
    					enable: true,
    					speed: 1.5,
    					direction: 'none',
    					random: false,
    					straight: false,
    					out_mode: 'out',
    					bounce: false
    				}
    			},
    			interactivity: {
    				detect_on: 'canvas',
    				events: {
    					onhover: { enable: true, mode: 'repulse' },
    					onclick: { enable: true, mode: 'push' },
    					resize: true
    				},
    				modes: {
    					repulse: { distance: 100, duration: 0.4 },
    					push: { particles_nb: 4 }
    				}
    			},
    			retina_detect: true
    		});
    	});

    	async function handleSubmit() {
    		$$invalidate(1, isSubmitting = true);
    		$$invalidate(2, submitStatus = null);

    		try {
    			const response = await emailjs.send(
    				"service_9hcq2g4",
    				"template_gxanx4b",
    				{
    					name: formData.name,
    					email: formData.email,
    					subject: formData.subject,
    					message: formData.message,
    					reply_to: "mombejose@gmail.com",
    					to_email: "mombejose@gmail.com",
    					company_name: "Mombe Digitals"
    				},
    				"B31rxbPMCio3oeS6_"
    			);

    			$$invalidate(2, submitStatus = {
    				type: 'success',
    				message: 'Thank you! Your message has been sent successfully.'
    			});

    			// Reset form
    			$$invalidate(0, formData = {
    				name: '',
    				email: '',
    				subject: '',
    				message: ''
    			});
    		} catch(error) {
    			$$invalidate(2, submitStatus = {
    				type: 'error',
    				message: `Error: ${error.message || 'Something went wrong. Please try again.'}`
    			});
    		} finally {
    			$$invalidate(1, isSubmitting = false);
    		}
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Contact> was created with unknown prop '${key}'`);
    	});

    	function input0_input_handler() {
    		formData.name = this.value;
    		$$invalidate(0, formData);
    	}

    	function input1_input_handler() {
    		formData.email = this.value;
    		$$invalidate(0, formData);
    	}

    	function input2_input_handler() {
    		formData.subject = this.value;
    		$$invalidate(0, formData);
    	}

    	function textarea_input_handler() {
    		formData.message = this.value;
    		$$invalidate(0, formData);
    	}

    	$$self.$capture_state = () => ({
    		onMount,
    		emailjs,
    		formData,
    		isSubmitting,
    		submitStatus,
    		handleSubmit
    	});

    	$$self.$inject_state = $$props => {
    		if ('formData' in $$props) $$invalidate(0, formData = $$props.formData);
    		if ('isSubmitting' in $$props) $$invalidate(1, isSubmitting = $$props.isSubmitting);
    		if ('submitStatus' in $$props) $$invalidate(2, submitStatus = $$props.submitStatus);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		formData,
    		isSubmitting,
    		submitStatus,
    		handleSubmit,
    		input0_input_handler,
    		input1_input_handler,
    		input2_input_handler,
    		textarea_input_handler
    	];
    }

    class Contact extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init$1(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Contact",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    /* src\home\gitroll.svelte generated by Svelte v3.59.2 */

    const { console: console_1 } = globals;
    const file$1 = "src\\home\\gitroll.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[1] = list[i];
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[4] = list[i];
    	return child_ctx;
    }

    function get_each_context_2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[7] = list[i];
    	return child_ctx;
    }

    // (113:24) {#each gitrollStats.languages as language}
    function create_each_block_2(ctx) {
    	let li;
    	let t_value = /*language*/ ctx[7] + "";
    	let t;

    	const block = {
    		c: function create() {
    			li = element("li");
    			t = text(t_value);
    			attr_dev(li, "class", "language-item svelte-m4qwck");
    			add_location(li, file$1, 113, 28, 5078);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*gitrollStats*/ 1 && t_value !== (t_value = /*language*/ ctx[7] + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_2.name,
    		type: "each",
    		source: "(113:24) {#each gitrollStats.languages as language}",
    		ctx
    	});

    	return block;
    }

    // (122:24) {#each gitrollStats.topSkills as skill}
    function create_each_block_1(ctx) {
    	let li;
    	let t_value = /*skill*/ ctx[4] + "";
    	let t;

    	const block = {
    		c: function create() {
    			li = element("li");
    			t = text(t_value);
    			attr_dev(li, "class", "skill-item svelte-m4qwck");
    			add_location(li, file$1, 122, 28, 5441);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*gitrollStats*/ 1 && t_value !== (t_value = /*skill*/ ctx[4] + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(122:24) {#each gitrollStats.topSkills as skill}",
    		ctx
    	});

    	return block;
    }

    // (132:20) {#each gitrollStats.recentActivity as activity}
    function create_each_block(ctx) {
    	let div2;
    	let div0;
    	let t0_value = (/*activity*/ ctx[1].type === 'commit' ? '✓' : '★') + "";
    	let t0;
    	let t1;
    	let div1;
    	let h4;
    	let t2_value = /*activity*/ ctx[1].project + "";
    	let t2;
    	let t3;
    	let p;
    	let t4_value = /*activity*/ ctx[1].description + "";
    	let t4;
    	let t5;
    	let time;

    	let t6_value = new Date(/*activity*/ ctx[1].date).toLocaleDateString('en-US', {
    		month: 'long',
    		day: 'numeric',
    		year: 'numeric'
    	}) + "";

    	let t6;
    	let t7;

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div0 = element("div");
    			t0 = text(t0_value);
    			t1 = space();
    			div1 = element("div");
    			h4 = element("h4");
    			t2 = text(t2_value);
    			t3 = space();
    			p = element("p");
    			t4 = text(t4_value);
    			t5 = space();
    			time = element("time");
    			t6 = text(t6_value);
    			t7 = space();
    			attr_dev(div0, "class", "activity-icon svelte-m4qwck");
    			add_location(div0, file$1, 133, 28, 5909);
    			attr_dev(h4, "class", "svelte-m4qwck");
    			add_location(h4, file$1, 135, 32, 6076);
    			attr_dev(p, "class", "svelte-m4qwck");
    			add_location(p, file$1, 136, 32, 6137);
    			attr_dev(time, "class", "svelte-m4qwck");
    			add_location(time, file$1, 137, 32, 6200);
    			attr_dev(div1, "class", "activity-details svelte-m4qwck");
    			add_location(div1, file$1, 134, 28, 6012);
    			attr_dev(div2, "class", "activity-item svelte-m4qwck");
    			add_location(div2, file$1, 132, 24, 5852);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);
    			append_dev(div0, t0);
    			append_dev(div2, t1);
    			append_dev(div2, div1);
    			append_dev(div1, h4);
    			append_dev(h4, t2);
    			append_dev(div1, t3);
    			append_dev(div1, p);
    			append_dev(p, t4);
    			append_dev(div1, t5);
    			append_dev(div1, time);
    			append_dev(time, t6);
    			append_dev(div2, t7);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*gitrollStats*/ 1 && t0_value !== (t0_value = (/*activity*/ ctx[1].type === 'commit' ? '✓' : '★') + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*gitrollStats*/ 1 && t2_value !== (t2_value = /*activity*/ ctx[1].project + "")) set_data_dev(t2, t2_value);
    			if (dirty & /*gitrollStats*/ 1 && t4_value !== (t4_value = /*activity*/ ctx[1].description + "")) set_data_dev(t4, t4_value);

    			if (dirty & /*gitrollStats*/ 1 && t6_value !== (t6_value = new Date(/*activity*/ ctx[1].date).toLocaleDateString('en-US', {
    				month: 'long',
    				day: 'numeric',
    				year: 'numeric'
    			}) + "")) set_data_dev(t6, t6_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(132:20) {#each gitrollStats.recentActivity as activity}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let section;
    	let div39;
    	let div10;
    	let div1;
    	let div0;
    	let h1;
    	let t1;
    	let p0;
    	let t3;
    	let div5;
    	let div2;
    	let h2;
    	let t5;
    	let p1;
    	let t7;
    	let div4;
    	let div3;
    	let span0;
    	let t9;
    	let span1;
    	let t11;
    	let span2;
    	let t13;
    	let div9;
    	let div6;
    	let t14;
    	let div7;
    	let t16;
    	let div8;
    	let t17;
    	let div29;
    	let div19;
    	let div12;
    	let h30;
    	let t19;
    	let div11;
    	let t20_value = /*gitrollStats*/ ctx[0].metrics?.reliability + "";
    	let t20;
    	let t21;
    	let t22;
    	let p2;
    	let t24;
    	let div14;
    	let h31;
    	let t26;
    	let div13;
    	let t27_value = /*gitrollStats*/ ctx[0].metrics?.security + "";
    	let t27;
    	let t28;
    	let t29;
    	let p3;
    	let t31;
    	let div16;
    	let h32;
    	let t33;
    	let div15;
    	let t34_value = /*gitrollStats*/ ctx[0].metrics?.maintainability + "";
    	let t34;
    	let t35;
    	let t36;
    	let p4;
    	let t38;
    	let div18;
    	let h33;
    	let t40;
    	let div17;
    	let t41;
    	let t42_value = /*gitrollStats*/ ctx[0].metrics?.contribution + "";
    	let t42;
    	let t43;
    	let t44;
    	let p5;
    	let t46;
    	let div26;
    	let div21;
    	let h34;
    	let t48;
    	let div20;
    	let t49_value = /*gitrollStats*/ ctx[0].commits + "";
    	let t49;
    	let t50;
    	let p6;
    	let t52;
    	let div23;
    	let h35;
    	let t54;
    	let div22;
    	let t55_value = /*gitrollStats*/ ctx[0].repositories + "";
    	let t55;
    	let t56;
    	let p7;
    	let t58;
    	let div24;
    	let h36;
    	let t60;
    	let ul0;
    	let t61;
    	let div25;
    	let h37;
    	let t63;
    	let ul1;
    	let t64;
    	let div28;
    	let h38;
    	let t66;
    	let div27;
    	let t67;
    	let div36;
    	let a;
    	let div35;
    	let div34;
    	let div30;
    	let span3;
    	let t69;
    	let div31;
    	let h39;
    	let t71;
    	let p8;
    	let t73;
    	let div33;
    	let div32;
    	let span4;
    	let t75;
    	let span5;
    	let t77;
    	let div38;
    	let div37;
    	let t78;
    	let p9;
    	let each_value_2 = /*gitrollStats*/ ctx[0].languages;
    	validate_each_argument(each_value_2);
    	let each_blocks_2 = [];

    	for (let i = 0; i < each_value_2.length; i += 1) {
    		each_blocks_2[i] = create_each_block_2(get_each_context_2(ctx, each_value_2, i));
    	}

    	let each_value_1 = /*gitrollStats*/ ctx[0].topSkills;
    	validate_each_argument(each_value_1);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks_1[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	let each_value = /*gitrollStats*/ ctx[0].recentActivity;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			section = element("section");
    			div39 = element("div");
    			div10 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			h1 = element("h1");
    			h1.textContent = "CODE QUALITY METRICS";
    			t1 = space();
    			p0 = element("p");
    			p0.textContent = "SPECIAL ANALYSIS: Developer Performance & Reliability Report";
    			t3 = space();
    			div5 = element("div");
    			div2 = element("div");
    			h2 = element("h2");
    			h2.textContent = "CURISM© DEVELOPER PROFILE";
    			t5 = space();
    			p1 = element("p");
    			p1.textContent = "Comprehensive Analysis of Code Quality and Development Practices";
    			t7 = space();
    			div4 = element("div");
    			div3 = element("div");
    			span0 = element("span");
    			span0.textContent = "Overall Rating";
    			t9 = space();
    			span1 = element("span");
    			span1.textContent = "4.83";
    			t11 = space();
    			span2 = element("span");
    			span2.textContent = "Top 9% of Developers";
    			t13 = space();
    			div9 = element("div");
    			div6 = element("div");
    			t14 = space();
    			div7 = element("div");
    			div7.textContent = "📊";
    			t16 = space();
    			div8 = element("div");
    			t17 = space();
    			div29 = element("div");
    			div19 = element("div");
    			div12 = element("div");
    			h30 = element("h3");
    			h30.textContent = "Reliability Score";
    			t19 = space();
    			div11 = element("div");
    			t20 = text(t20_value);
    			t21 = text("%");
    			t22 = space();
    			p2 = element("p");
    			p2.textContent = "Exceptional Code Reliability";
    			t24 = space();
    			div14 = element("div");
    			h31 = element("h3");
    			h31.textContent = "Security Rating";
    			t26 = space();
    			div13 = element("div");
    			t27 = text(t27_value);
    			t28 = text("%");
    			t29 = space();
    			p3 = element("p");
    			p3.textContent = "Strong Security Practices";
    			t31 = space();
    			div16 = element("div");
    			h32 = element("h3");
    			h32.textContent = "Code Maintainability";
    			t33 = space();
    			div15 = element("div");
    			t34 = text(t34_value);
    			t35 = text("%");
    			t36 = space();
    			p4 = element("p");
    			p4.textContent = "Clean & Maintainable Code";
    			t38 = space();
    			div18 = element("div");
    			h33 = element("h3");
    			h33.textContent = "Open Source Impact";
    			t40 = space();
    			div17 = element("div");
    			t41 = text("Top ");
    			t42 = text(t42_value);
    			t43 = text("%");
    			t44 = space();
    			p5 = element("p");
    			p5.textContent = "In Zimbabwe";
    			t46 = space();
    			div26 = element("div");
    			div21 = element("div");
    			h34 = element("h3");
    			h34.textContent = "Total Commits";
    			t48 = space();
    			div20 = element("div");
    			t49 = text(t49_value);
    			t50 = space();
    			p6 = element("p");
    			p6.textContent = "Quality-Focused Contributions";
    			t52 = space();
    			div23 = element("div");
    			h35 = element("h3");
    			h35.textContent = "Active Repositories";
    			t54 = space();
    			div22 = element("div");
    			t55 = text(t55_value);
    			t56 = space();
    			p7 = element("p");
    			p7.textContent = "Professional Projects";
    			t58 = space();
    			div24 = element("div");
    			h36 = element("h3");
    			h36.textContent = "Core Technologies";
    			t60 = space();
    			ul0 = element("ul");

    			for (let i = 0; i < each_blocks_2.length; i += 1) {
    				each_blocks_2[i].c();
    			}

    			t61 = space();
    			div25 = element("div");
    			h37 = element("h3");
    			h37.textContent = "Development Focus";
    			t63 = space();
    			ul1 = element("ul");

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t64 = space();
    			div28 = element("div");
    			h38 = element("h3");
    			h38.textContent = "Recent Code Quality Improvements";
    			t66 = space();
    			div27 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t67 = space();
    			div36 = element("div");
    			a = element("a");
    			div35 = element("div");
    			div34 = element("div");
    			div30 = element("div");
    			span3 = element("span");
    			span3.textContent = "EXCLUSIVE ACCESS";
    			t69 = space();
    			div31 = element("div");
    			h39 = element("h3");
    			h39.textContent = "VIEW COMPLETE DEVELOPMENT METRICS";
    			t71 = space();
    			p8 = element("p");
    			p8.textContent = "Detailed Analysis • Performance Metrics • Code Quality Insights";
    			t73 = space();
    			div33 = element("div");
    			div32 = element("div");
    			span4 = element("span");
    			span4.textContent = "VIEW FULL REPORT";
    			t75 = space();
    			span5 = element("span");
    			span5.textContent = "→";
    			t77 = space();
    			div38 = element("div");
    			div37 = element("div");
    			t78 = space();
    			p9 = element("p");
    			p9.textContent = "Code Quality Report • Updated Daily • Comprehensive Developer Analytics";
    			attr_dev(h1, "class", "masthead-title");
    			add_location(h1, file$1, 43, 20, 1751);
    			attr_dev(p0, "class", "masthead-subtitle");
    			add_location(p0, file$1, 44, 20, 1825);
    			attr_dev(div0, "class", "newspaper-title");
    			add_location(div0, file$1, 42, 16, 1700);
    			attr_dev(div1, "class", "newspaper-masthead");
    			add_location(div1, file$1, 41, 12, 1650);
    			attr_dev(h2, "class", "section-headline");
    			add_location(h2, file$1, 50, 20, 2089);
    			attr_dev(p1, "class", "section-subhead");
    			add_location(p1, file$1, 51, 20, 2170);
    			attr_dev(div2, "class", "headline-column");
    			add_location(div2, file$1, 49, 16, 2038);
    			attr_dev(span0, "class", "rating-label svelte-m4qwck");
    			add_location(span0, file$1, 55, 24, 2413);
    			attr_dev(span1, "class", "rating-value svelte-m4qwck");
    			add_location(span1, file$1, 56, 24, 2487);
    			attr_dev(span2, "class", "rating-percentile svelte-m4qwck");
    			add_location(span2, file$1, 57, 24, 2551);
    			attr_dev(div3, "class", "overall-rating svelte-m4qwck");
    			add_location(div3, file$1, 54, 20, 2359);
    			attr_dev(div4, "class", "headline-metrics svelte-m4qwck");
    			add_location(div4, file$1, 53, 16, 2307);
    			attr_dev(div5, "class", "headline-section");
    			add_location(div5, file$1, 48, 12, 1990);
    			attr_dev(div6, "class", "divider-line");
    			add_location(div6, file$1, 63, 16, 2759);
    			attr_dev(div7, "class", "divider-icon");
    			add_location(div7, file$1, 64, 16, 2809);
    			attr_dev(div8, "class", "divider-line");
    			add_location(div8, file$1, 65, 16, 2861);
    			attr_dev(div9, "class", "newspaper-divider");
    			add_location(div9, file$1, 62, 12, 2710);
    			attr_dev(div10, "class", "newspaper-header");
    			add_location(div10, file$1, 40, 8, 1606);
    			add_location(h30, file$1, 72, 20, 3087);
    			attr_dev(div11, "class", "metric-number svelte-m4qwck");
    			add_location(div11, file$1, 73, 20, 3135);
    			attr_dev(p2, "class", "metric-description svelte-m4qwck");
    			add_location(p2, file$1, 74, 20, 3226);
    			attr_dev(div12, "class", "metric-card reliability svelte-m4qwck");
    			add_location(div12, file$1, 71, 16, 3028);
    			add_location(h31, file$1, 78, 20, 3388);
    			attr_dev(div13, "class", "metric-number svelte-m4qwck");
    			add_location(div13, file$1, 79, 20, 3434);
    			attr_dev(p3, "class", "metric-description svelte-m4qwck");
    			add_location(p3, file$1, 80, 20, 3522);
    			attr_dev(div14, "class", "metric-card security svelte-m4qwck");
    			add_location(div14, file$1, 77, 16, 3332);
    			add_location(h32, file$1, 84, 20, 3688);
    			attr_dev(div15, "class", "metric-number svelte-m4qwck");
    			add_location(div15, file$1, 85, 20, 3739);
    			attr_dev(p4, "class", "metric-description svelte-m4qwck");
    			add_location(p4, file$1, 86, 20, 3834);
    			attr_dev(div16, "class", "metric-card maintainability svelte-m4qwck");
    			add_location(div16, file$1, 83, 16, 3625);
    			add_location(h33, file$1, 90, 20, 3997);
    			attr_dev(div17, "class", "metric-number svelte-m4qwck");
    			add_location(div17, file$1, 91, 20, 4046);
    			attr_dev(p5, "class", "metric-description svelte-m4qwck");
    			add_location(p5, file$1, 92, 20, 4142);
    			attr_dev(div18, "class", "metric-card contribution svelte-m4qwck");
    			add_location(div18, file$1, 89, 16, 3937);
    			attr_dev(div19, "class", "metrics-grid svelte-m4qwck");
    			add_location(div19, file$1, 70, 12, 2984);
    			attr_dev(h34, "class", "svelte-m4qwck");
    			add_location(h34, file$1, 98, 20, 4342);
    			attr_dev(div20, "class", "stat-number svelte-m4qwck");
    			add_location(div20, file$1, 99, 20, 4386);
    			attr_dev(p6, "class", "stat-description svelte-m4qwck");
    			add_location(p6, file$1, 100, 20, 4461);
    			attr_dev(div21, "class", "stat-card commits svelte-m4qwck");
    			add_location(div21, file$1, 97, 16, 4289);
    			attr_dev(h35, "class", "svelte-m4qwck");
    			add_location(h35, file$1, 104, 20, 4624);
    			attr_dev(div22, "class", "stat-number svelte-m4qwck");
    			add_location(div22, file$1, 105, 20, 4674);
    			attr_dev(p7, "class", "stat-description svelte-m4qwck");
    			add_location(p7, file$1, 106, 20, 4754);
    			attr_dev(div23, "class", "stat-card repositories svelte-m4qwck");
    			add_location(div23, file$1, 103, 16, 4566);
    			attr_dev(h36, "class", "svelte-m4qwck");
    			add_location(h36, file$1, 110, 20, 4906);
    			attr_dev(ul0, "class", "language-list svelte-m4qwck");
    			add_location(ul0, file$1, 111, 20, 4954);
    			attr_dev(div24, "class", "stat-card languages svelte-m4qwck");
    			add_location(div24, file$1, 109, 16, 4851);
    			attr_dev(h37, "class", "svelte-m4qwck");
    			add_location(h37, file$1, 119, 20, 5275);
    			attr_dev(ul1, "class", "skill-list svelte-m4qwck");
    			add_location(ul1, file$1, 120, 20, 5323);
    			attr_dev(div25, "class", "stat-card skills svelte-m4qwck");
    			add_location(div25, file$1, 118, 16, 5223);
    			attr_dev(div26, "class", "stats-grid svelte-m4qwck");
    			add_location(div26, file$1, 96, 12, 4247);
    			attr_dev(h38, "class", "activity-title svelte-m4qwck");
    			add_location(h38, file$1, 129, 16, 5644);
    			attr_dev(div27, "class", "activity-timeline svelte-m4qwck");
    			add_location(div27, file$1, 130, 16, 5726);
    			attr_dev(div28, "class", "activity-section svelte-m4qwck");
    			add_location(div28, file$1, 128, 12, 5596);
    			attr_dev(div29, "class", "gitroll-content");
    			add_location(div29, file$1, 69, 8, 2941);
    			attr_dev(span3, "class", "banner-tag svelte-m4qwck");
    			add_location(span3, file$1, 156, 28, 6996);
    			attr_dev(div30, "class", "banner-left svelte-m4qwck");
    			add_location(div30, file$1, 155, 24, 6941);
    			attr_dev(h39, "class", "banner-headline svelte-m4qwck");
    			add_location(h39, file$1, 159, 28, 7159);
    			attr_dev(p8, "class", "banner-subtext svelte-m4qwck");
    			add_location(p8, file$1, 160, 28, 7255);
    			attr_dev(div31, "class", "banner-center svelte-m4qwck");
    			add_location(div31, file$1, 158, 24, 7102);
    			attr_dev(span4, "class", "cta-text");
    			add_location(span4, file$1, 164, 32, 7519);
    			attr_dev(span5, "class", "cta-arrow svelte-m4qwck");
    			add_location(span5, file$1, 165, 32, 7599);
    			attr_dev(div32, "class", "stats-cta svelte-m4qwck");
    			add_location(div32, file$1, 163, 28, 7462);
    			attr_dev(div33, "class", "banner-right svelte-m4qwck");
    			add_location(div33, file$1, 162, 24, 7406);
    			attr_dev(div34, "class", "banner-content svelte-m4qwck");
    			add_location(div34, file$1, 154, 20, 6887);
    			attr_dev(div35, "class", "stats-banner svelte-m4qwck");
    			add_location(div35, file$1, 153, 16, 6839);
    			attr_dev(a, "href", "https://gitroll.io/profile/uQO0DpfZuTuZYEAWlwINJl6MNbou1");
    			attr_dev(a, "target", "_blank");
    			attr_dev(a, "class", "stats-banner-link svelte-m4qwck");
    			add_location(a, file$1, 150, 12, 6678);
    			attr_dev(div36, "class", "view-stats-section svelte-m4qwck");
    			add_location(div36, file$1, 149, 8, 6632);
    			attr_dev(div37, "class", "footer-line svelte-m4qwck");
    			add_location(div37, file$1, 174, 12, 7841);
    			attr_dev(p9, "class", "footer-text svelte-m4qwck");
    			add_location(p9, file$1, 175, 12, 7886);
    			attr_dev(div38, "class", "newspaper-footer svelte-m4qwck");
    			add_location(div38, file$1, 173, 8, 7797);
    			attr_dev(div39, "class", "newspaper-container svelte-m4qwck");
    			add_location(div39, file$1, 39, 4, 1563);
    			attr_dev(section, "class", "gitroll-section svelte-m4qwck");
    			attr_dev(section, "id", "gitroll");
    			add_location(section, file$1, 38, 0, 1511);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			append_dev(section, div39);
    			append_dev(div39, div10);
    			append_dev(div10, div1);
    			append_dev(div1, div0);
    			append_dev(div0, h1);
    			append_dev(div0, t1);
    			append_dev(div0, p0);
    			append_dev(div10, t3);
    			append_dev(div10, div5);
    			append_dev(div5, div2);
    			append_dev(div2, h2);
    			append_dev(div2, t5);
    			append_dev(div2, p1);
    			append_dev(div5, t7);
    			append_dev(div5, div4);
    			append_dev(div4, div3);
    			append_dev(div3, span0);
    			append_dev(div3, t9);
    			append_dev(div3, span1);
    			append_dev(div3, t11);
    			append_dev(div3, span2);
    			append_dev(div10, t13);
    			append_dev(div10, div9);
    			append_dev(div9, div6);
    			append_dev(div9, t14);
    			append_dev(div9, div7);
    			append_dev(div9, t16);
    			append_dev(div9, div8);
    			append_dev(div39, t17);
    			append_dev(div39, div29);
    			append_dev(div29, div19);
    			append_dev(div19, div12);
    			append_dev(div12, h30);
    			append_dev(div12, t19);
    			append_dev(div12, div11);
    			append_dev(div11, t20);
    			append_dev(div11, t21);
    			append_dev(div12, t22);
    			append_dev(div12, p2);
    			append_dev(div19, t24);
    			append_dev(div19, div14);
    			append_dev(div14, h31);
    			append_dev(div14, t26);
    			append_dev(div14, div13);
    			append_dev(div13, t27);
    			append_dev(div13, t28);
    			append_dev(div14, t29);
    			append_dev(div14, p3);
    			append_dev(div19, t31);
    			append_dev(div19, div16);
    			append_dev(div16, h32);
    			append_dev(div16, t33);
    			append_dev(div16, div15);
    			append_dev(div15, t34);
    			append_dev(div15, t35);
    			append_dev(div16, t36);
    			append_dev(div16, p4);
    			append_dev(div19, t38);
    			append_dev(div19, div18);
    			append_dev(div18, h33);
    			append_dev(div18, t40);
    			append_dev(div18, div17);
    			append_dev(div17, t41);
    			append_dev(div17, t42);
    			append_dev(div17, t43);
    			append_dev(div18, t44);
    			append_dev(div18, p5);
    			append_dev(div29, t46);
    			append_dev(div29, div26);
    			append_dev(div26, div21);
    			append_dev(div21, h34);
    			append_dev(div21, t48);
    			append_dev(div21, div20);
    			append_dev(div20, t49);
    			append_dev(div21, t50);
    			append_dev(div21, p6);
    			append_dev(div26, t52);
    			append_dev(div26, div23);
    			append_dev(div23, h35);
    			append_dev(div23, t54);
    			append_dev(div23, div22);
    			append_dev(div22, t55);
    			append_dev(div23, t56);
    			append_dev(div23, p7);
    			append_dev(div26, t58);
    			append_dev(div26, div24);
    			append_dev(div24, h36);
    			append_dev(div24, t60);
    			append_dev(div24, ul0);

    			for (let i = 0; i < each_blocks_2.length; i += 1) {
    				if (each_blocks_2[i]) {
    					each_blocks_2[i].m(ul0, null);
    				}
    			}

    			append_dev(div26, t61);
    			append_dev(div26, div25);
    			append_dev(div25, h37);
    			append_dev(div25, t63);
    			append_dev(div25, ul1);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				if (each_blocks_1[i]) {
    					each_blocks_1[i].m(ul1, null);
    				}
    			}

    			append_dev(div29, t64);
    			append_dev(div29, div28);
    			append_dev(div28, h38);
    			append_dev(div28, t66);
    			append_dev(div28, div27);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(div27, null);
    				}
    			}

    			append_dev(div39, t67);
    			append_dev(div39, div36);
    			append_dev(div36, a);
    			append_dev(a, div35);
    			append_dev(div35, div34);
    			append_dev(div34, div30);
    			append_dev(div30, span3);
    			append_dev(div34, t69);
    			append_dev(div34, div31);
    			append_dev(div31, h39);
    			append_dev(div31, t71);
    			append_dev(div31, p8);
    			append_dev(div34, t73);
    			append_dev(div34, div33);
    			append_dev(div33, div32);
    			append_dev(div32, span4);
    			append_dev(div32, t75);
    			append_dev(div32, span5);
    			append_dev(div39, t77);
    			append_dev(div39, div38);
    			append_dev(div38, div37);
    			append_dev(div38, t78);
    			append_dev(div38, p9);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*gitrollStats*/ 1 && t20_value !== (t20_value = /*gitrollStats*/ ctx[0].metrics?.reliability + "")) set_data_dev(t20, t20_value);
    			if (dirty & /*gitrollStats*/ 1 && t27_value !== (t27_value = /*gitrollStats*/ ctx[0].metrics?.security + "")) set_data_dev(t27, t27_value);
    			if (dirty & /*gitrollStats*/ 1 && t34_value !== (t34_value = /*gitrollStats*/ ctx[0].metrics?.maintainability + "")) set_data_dev(t34, t34_value);
    			if (dirty & /*gitrollStats*/ 1 && t42_value !== (t42_value = /*gitrollStats*/ ctx[0].metrics?.contribution + "")) set_data_dev(t42, t42_value);
    			if (dirty & /*gitrollStats*/ 1 && t49_value !== (t49_value = /*gitrollStats*/ ctx[0].commits + "")) set_data_dev(t49, t49_value);
    			if (dirty & /*gitrollStats*/ 1 && t55_value !== (t55_value = /*gitrollStats*/ ctx[0].repositories + "")) set_data_dev(t55, t55_value);

    			if (dirty & /*gitrollStats*/ 1) {
    				each_value_2 = /*gitrollStats*/ ctx[0].languages;
    				validate_each_argument(each_value_2);
    				let i;

    				for (i = 0; i < each_value_2.length; i += 1) {
    					const child_ctx = get_each_context_2(ctx, each_value_2, i);

    					if (each_blocks_2[i]) {
    						each_blocks_2[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_2[i] = create_each_block_2(child_ctx);
    						each_blocks_2[i].c();
    						each_blocks_2[i].m(ul0, null);
    					}
    				}

    				for (; i < each_blocks_2.length; i += 1) {
    					each_blocks_2[i].d(1);
    				}

    				each_blocks_2.length = each_value_2.length;
    			}

    			if (dirty & /*gitrollStats*/ 1) {
    				each_value_1 = /*gitrollStats*/ ctx[0].topSkills;
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_1[i] = create_each_block_1(child_ctx);
    						each_blocks_1[i].c();
    						each_blocks_1[i].m(ul1, null);
    					}
    				}

    				for (; i < each_blocks_1.length; i += 1) {
    					each_blocks_1[i].d(1);
    				}

    				each_blocks_1.length = each_value_1.length;
    			}

    			if (dirty & /*Date, gitrollStats*/ 1) {
    				each_value = /*gitrollStats*/ ctx[0].recentActivity;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div27, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    			destroy_each(each_blocks_2, detaching);
    			destroy_each(each_blocks_1, detaching);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Gitroll', slots, []);

    	let gitrollStats = {
    		commits: 0,
    		repositories: 0,
    		languages: [],
    		topSkills: [],
    		recentActivity: []
    	};

    	onMount(async () => {
    		try {
    			// Updated stats to match CURISM profile
    			$$invalidate(0, gitrollStats = {
    				commits: 485, // Moderate number reflecting early career stage
    				repositories: 15,
    				languages: ['JavaScript', 'Java', 'Python', 'TypeScript', 'HTML/CSS'],
    				topSkills: [
    					'Clean Code',
    					'Security-Focused Development',
    					'Full Stack Development',
    					'Reliable Architecture',
    					'API Integration'
    				],
    				recentActivity: [
    					{
    						type: 'commit',
    						project: 'AI Tasks',
    						date: '2024-03-15',
    						description: 'Enhanced security implementations'
    					},
    					{
    						type: 'repository',
    						project: 'Sekani Security',
    						date: '2024-03-10',
    						description: 'Clean code architecture'
    					},
    					{
    						type: 'commit',
    						project: 'AgriConnect',
    						date: '2024-03-05',
    						description: 'Reliability improvements'
    					}
    				],
    				metrics: {
    					reliability: 92,
    					security: 88,
    					maintainability: 85,
    					contribution: 62,
    					influence: 65
    				}
    			});
    		} catch(error) {
    			console.error('Error fetching GitRoll stats:', error);
    		}
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<Gitroll> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ onMount, gitrollStats });

    	$$self.$inject_state = $$props => {
    		if ('gitrollStats' in $$props) $$invalidate(0, gitrollStats = $$props.gitrollStats);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [gitrollStats];
    }

    class Gitroll extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init$1(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Gitroll",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src\home\separator.svelte generated by Svelte v3.59.2 */

    const file = "src\\home\\separator.svelte";

    function create_fragment$1(ctx) {
    	let div8;
    	let div3;
    	let div0;
    	let t0;
    	let div1;
    	let span0;
    	let t2;
    	let span1;
    	let t3;
    	let t4;
    	let span2;
    	let t6;
    	let div2;
    	let t7;
    	let div7;
    	let div4;
    	let t8;
    	let div5;
    	let t10;
    	let div6;

    	const block = {
    		c: function create() {
    			div8 = element("div");
    			div3 = element("div");
    			div0 = element("div");
    			t0 = space();
    			div1 = element("div");
    			span0 = element("span");
    			span0.textContent = "✦";
    			t2 = space();
    			span1 = element("span");
    			t3 = text(/*text*/ ctx[0]);
    			t4 = space();
    			span2 = element("span");
    			span2.textContent = "✦";
    			t6 = space();
    			div2 = element("div");
    			t7 = space();
    			div7 = element("div");
    			div4 = element("div");
    			t8 = space();
    			div5 = element("div");
    			div5.textContent = "◆";
    			t10 = space();
    			div6 = element("div");
    			attr_dev(div0, "class", "separator-line svelte-1mxmo2e");
    			add_location(div0, file, 6, 8, 152);
    			attr_dev(span0, "class", "separator-icon svelte-1mxmo2e");
    			add_location(span0, file, 8, 12, 240);
    			attr_dev(span1, "class", "separator-text svelte-1mxmo2e");
    			add_location(span1, file, 9, 12, 291);
    			attr_dev(span2, "class", "separator-icon svelte-1mxmo2e");
    			add_location(span2, file, 10, 12, 347);
    			attr_dev(div1, "class", "separator-center svelte-1mxmo2e");
    			add_location(div1, file, 7, 8, 196);
    			attr_dev(div2, "class", "separator-line svelte-1mxmo2e");
    			add_location(div2, file, 12, 8, 410);
    			attr_dev(div3, "class", "separator-content svelte-1mxmo2e");
    			add_location(div3, file, 5, 4, 111);
    			attr_dev(div4, "class", "ornament-line svelte-1mxmo2e");
    			add_location(div4, file, 15, 8, 504);
    			attr_dev(div5, "class", "ornament-diamond svelte-1mxmo2e");
    			add_location(div5, file, 16, 8, 547);
    			attr_dev(div6, "class", "ornament-line svelte-1mxmo2e");
    			add_location(div6, file, 17, 8, 594);
    			attr_dev(div7, "class", "separator-ornament svelte-1mxmo2e");
    			add_location(div7, file, 14, 4, 462);
    			attr_dev(div8, "class", "newspaper-separator svelte-1mxmo2e");
    			add_location(div8, file, 4, 0, 72);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div8, anchor);
    			append_dev(div8, div3);
    			append_dev(div3, div0);
    			append_dev(div3, t0);
    			append_dev(div3, div1);
    			append_dev(div1, span0);
    			append_dev(div1, t2);
    			append_dev(div1, span1);
    			append_dev(span1, t3);
    			append_dev(div1, t4);
    			append_dev(div1, span2);
    			append_dev(div3, t6);
    			append_dev(div3, div2);
    			append_dev(div8, t7);
    			append_dev(div8, div7);
    			append_dev(div7, div4);
    			append_dev(div7, t8);
    			append_dev(div7, div5);
    			append_dev(div7, t10);
    			append_dev(div7, div6);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*text*/ 1) set_data_dev(t3, /*text*/ ctx[0]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div8);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Separator', slots, []);
    	let { text = "CONTINUED ON THIS PAGE" } = $$props;
    	const writable_props = ['text'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Separator> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('text' in $$props) $$invalidate(0, text = $$props.text);
    	};

    	$$self.$capture_state = () => ({ text });

    	$$self.$inject_state = $$props => {
    		if ('text' in $$props) $$invalidate(0, text = $$props.text);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [text];
    }

    class Separator extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init$1(this, options, instance$1, create_fragment$1, safe_not_equal, { text: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Separator",
    			options,
    			id: create_fragment$1.name
    		});
    	}

    	get text() {
    		throw new Error("<Separator>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set text(value) {
    		throw new Error("<Separator>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\App.svelte generated by Svelte v3.59.2 */

    function create_fragment(ctx) {
    	let topnav;
    	let t0;
    	let hero;
    	let t1;
    	let separator0;
    	let t2;
    	let about;
    	let t3;
    	let separator1;
    	let t4;
    	let project;
    	let t5;
    	let separator2;
    	let t6;
    	let gitroll;
    	let t7;
    	let separator3;
    	let t8;
    	let contact;
    	let current;
    	topnav = new Topnav({ $$inline: true });
    	hero = new Hero({ $$inline: true });

    	separator0 = new Separator({
    			props: { text: "FEATURED STORY CONTINUES" },
    			$$inline: true
    		});

    	about = new About({ $$inline: true });

    	separator1 = new Separator({
    			props: { text: "SPECIAL PROJECT COVERAGE" },
    			$$inline: true
    		});

    	project = new Project({ $$inline: true });

    	separator2 = new Separator({
    			props: { text: "DEVELOPER METRICS & ANALYSIS" },
    			$$inline: true
    		});

    	gitroll = new Gitroll({ $$inline: true });

    	separator3 = new Separator({
    			props: { text: "CORRESPONDENCE SECTION" },
    			$$inline: true
    		});

    	contact = new Contact({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(topnav.$$.fragment);
    			t0 = space();
    			create_component(hero.$$.fragment);
    			t1 = space();
    			create_component(separator0.$$.fragment);
    			t2 = space();
    			create_component(about.$$.fragment);
    			t3 = space();
    			create_component(separator1.$$.fragment);
    			t4 = space();
    			create_component(project.$$.fragment);
    			t5 = space();
    			create_component(separator2.$$.fragment);
    			t6 = space();
    			create_component(gitroll.$$.fragment);
    			t7 = space();
    			create_component(separator3.$$.fragment);
    			t8 = space();
    			create_component(contact.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(topnav, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(hero, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(separator0, target, anchor);
    			insert_dev(target, t2, anchor);
    			mount_component(about, target, anchor);
    			insert_dev(target, t3, anchor);
    			mount_component(separator1, target, anchor);
    			insert_dev(target, t4, anchor);
    			mount_component(project, target, anchor);
    			insert_dev(target, t5, anchor);
    			mount_component(separator2, target, anchor);
    			insert_dev(target, t6, anchor);
    			mount_component(gitroll, target, anchor);
    			insert_dev(target, t7, anchor);
    			mount_component(separator3, target, anchor);
    			insert_dev(target, t8, anchor);
    			mount_component(contact, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(topnav.$$.fragment, local);
    			transition_in(hero.$$.fragment, local);
    			transition_in(separator0.$$.fragment, local);
    			transition_in(about.$$.fragment, local);
    			transition_in(separator1.$$.fragment, local);
    			transition_in(project.$$.fragment, local);
    			transition_in(separator2.$$.fragment, local);
    			transition_in(gitroll.$$.fragment, local);
    			transition_in(separator3.$$.fragment, local);
    			transition_in(contact.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(topnav.$$.fragment, local);
    			transition_out(hero.$$.fragment, local);
    			transition_out(separator0.$$.fragment, local);
    			transition_out(about.$$.fragment, local);
    			transition_out(separator1.$$.fragment, local);
    			transition_out(project.$$.fragment, local);
    			transition_out(separator2.$$.fragment, local);
    			transition_out(gitroll.$$.fragment, local);
    			transition_out(separator3.$$.fragment, local);
    			transition_out(contact.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(topnav, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(hero, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(separator0, detaching);
    			if (detaching) detach_dev(t2);
    			destroy_component(about, detaching);
    			if (detaching) detach_dev(t3);
    			destroy_component(separator1, detaching);
    			if (detaching) detach_dev(t4);
    			destroy_component(project, detaching);
    			if (detaching) detach_dev(t5);
    			destroy_component(separator2, detaching);
    			if (detaching) detach_dev(t6);
    			destroy_component(gitroll, detaching);
    			if (detaching) detach_dev(t7);
    			destroy_component(separator3, detaching);
    			if (detaching) detach_dev(t8);
    			destroy_component(contact, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Topnav,
    		Hero,
    		About,
    		Project,
    		Contact,
    		Gitroll,
    		Separator
    	});

    	return [];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init$1(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
    	target: document.body
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
