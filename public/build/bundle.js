
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
    const file$5 = "src\\home\\topnav.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[5] = list[i];
    	child_ctx[7] = i;
    	return child_ctx;
    }

    // (62:12) {#each ['Home', 'About','Blogs', 'Projects', 'Contact'] as item, i}
    function create_each_block$2(ctx) {
    	let li;
    	let a;
    	let t0;
    	let t1;
    	let mounted;
    	let dispose;

    	function click_handler() {
    		return /*click_handler*/ ctx[4](/*item*/ ctx[5]);
    	}

    	const block = {
    		c: function create() {
    			li = element("li");
    			a = element("a");
    			t0 = text(/*item*/ ctx[5]);
    			t1 = space();
    			attr_dev(a, "href", "#" + /*item*/ ctx[5].toLowerCase());
    			toggle_class(a, "active", /*item*/ ctx[5] === 'Home');
    			add_location(a, file$5, 63, 20, 2082);
    			set_style(li, "--item-index", /*i*/ ctx[7]);
    			add_location(li, file$5, 62, 16, 2030);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, a);
    			append_dev(a, t0);
    			append_dev(li, t1);

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
    		source: "(62:12) {#each ['Home', 'About','Blogs', 'Projects', 'Contact'] as item, i}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$6(ctx) {
    	let div5;
    	let div0;
    	let a;
    	let img;
    	let img_src_value;
    	let img_intro;
    	let t0;
    	let div4;
    	let div1;
    	let t1;
    	let div2;
    	let t2;
    	let div3;
    	let t3;
    	let nav;
    	let ul;
    	let mounted;
    	let dispose;
    	let each_value = ['Home', 'About', 'Blogs', 'Projects', 'Contact'];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < 5; i += 1) {
    		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div5 = element("div");
    			div0 = element("div");
    			a = element("a");
    			img = element("img");
    			t0 = space();
    			div4 = element("div");
    			div1 = element("div");
    			t1 = space();
    			div2 = element("div");
    			t2 = space();
    			div3 = element("div");
    			t3 = space();
    			nav = element("nav");
    			ul = element("ul");

    			for (let i = 0; i < 5; i += 1) {
    				each_blocks[i].c();
    			}

    			if (!src_url_equal(img.src, img_src_value = "/images/logo.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "MOMBE Digitals Logo");
    			add_location(img, file$5, 48, 12, 1567);
    			attr_dev(a, "href", "#");
    			set_style(a, "transform", "scale(1)");
    			add_location(a, file$5, 47, 8, 1513);
    			attr_dev(div0, "class", "logo");
    			add_location(div0, file$5, 46, 4, 1485);
    			add_location(div1, file$5, 54, 8, 1794);
    			add_location(div2, file$5, 55, 8, 1815);
    			add_location(div3, file$5, 56, 8, 1836);
    			attr_dev(div4, "class", "hamburger");
    			toggle_class(div4, "active", /*isMenuOpen*/ ctx[0]);
    			add_location(div4, file$5, 53, 4, 1713);
    			add_location(ul, file$5, 60, 8, 1927);
    			attr_dev(nav, "class", "navigation");
    			toggle_class(nav, "active", /*isMenuOpen*/ ctx[0]);
    			add_location(nav, file$5, 59, 4, 1867);
    			attr_dev(div5, "class", "main-nav");
    			toggle_class(div5, "scrolled", /*isScrolled*/ ctx[1]);
    			add_location(div5, file$5, 45, 0, 1429);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div5, anchor);
    			append_dev(div5, div0);
    			append_dev(div0, a);
    			append_dev(a, img);
    			append_dev(div5, t0);
    			append_dev(div5, div4);
    			append_dev(div4, div1);
    			append_dev(div4, t1);
    			append_dev(div4, div2);
    			append_dev(div4, t2);
    			append_dev(div4, div3);
    			append_dev(div5, t3);
    			append_dev(div5, nav);
    			append_dev(nav, ul);

    			for (let i = 0; i < 5; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(ul, null);
    				}
    			}

    			if (!mounted) {
    				dispose = listen_dev(div4, "click", /*toggleMenu*/ ctx[2], false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*isMenuOpen*/ 1) {
    				toggle_class(div4, "active", /*isMenuOpen*/ ctx[0]);
    			}

    			if (dirty & /*scrollToSection*/ 8) {
    				each_value = ['Home', 'About', 'Blogs', 'Projects', 'Contact'];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < 5; i += 1) {
    					const child_ctx = get_each_context$2(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$2(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(ul, null);
    					}
    				}

    				for (; i < 5; i += 1) {
    					each_blocks[i].d(1);
    				}
    			}

    			if (dirty & /*isMenuOpen*/ 1) {
    				toggle_class(nav, "active", /*isMenuOpen*/ ctx[0]);
    			}

    			if (dirty & /*isScrolled*/ 2) {
    				toggle_class(div5, "scrolled", /*isScrolled*/ ctx[1]);
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
    			if (detaching) detach_dev(div5);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			dispose();
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

    function instance$6($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Topnav', slots, []);
    	let isMenuOpen = false;
    	let isScrolled = false;

    	// Handle scroll effect
    	onMount(() => {
    		window.addEventListener('scroll', () => {
    			$$invalidate(1, isScrolled = window.scrollY > 50);
    		});

    		// Close menu when clicking outside
    		window.addEventListener('click', e => {
    			if (isMenuOpen && !e.target.closest('.navigation') && !e.target.closest('.hamburger')) {
    				$$invalidate(0, isMenuOpen = false);
    			}
    		});
    	});

    	// Toggle mobile menu
    	const toggleMenu = () => {
    		$$invalidate(0, isMenuOpen = !isMenuOpen);

    		// Prevent scrolling when menu is open
    		document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    	};

    	// Add this function to handle scroll to sections
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
    		toggleMenu,
    		scrollToSection
    	});

    	$$self.$inject_state = $$props => {
    		if ('isMenuOpen' in $$props) $$invalidate(0, isMenuOpen = $$props.isMenuOpen);
    		if ('isScrolled' in $$props) $$invalidate(1, isScrolled = $$props.isScrolled);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [isMenuOpen, isScrolled, toggleMenu, scrollToSection, click_handler];
    }

    class Topnav extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init$1(this, options, instance$6, create_fragment$6, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Topnav",
    			options,
    			id: create_fragment$6.name
    		});
    	}
    }

    /* src\home\hero.svelte generated by Svelte v3.59.2 */
    const file$4 = "src\\home\\hero.svelte";

    function create_fragment$5(ctx) {
    	let div7;
    	let div0;
    	let t0;
    	let main;
    	let div3;
    	let h1;
    	let t2;
    	let h2;
    	let t4;
    	let p;
    	let t6;
    	let div1;
    	let button0;
    	let t8;
    	let button1;
    	let t10;
    	let div2;
    	let span0;
    	let t12;
    	let span1;
    	let t14;
    	let span2;
    	let t16;
    	let span3;
    	let t18;
    	let div6;
    	let div5;
    	let img;
    	let img_src_value;
    	let t19;
    	let div4;
    	let span4;
    	let t20;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div7 = element("div");
    			div0 = element("div");
    			t0 = space();
    			main = element("main");
    			div3 = element("div");
    			h1 = element("h1");
    			h1.textContent = `${/*name*/ ctx[0].toUpperCase()}`;
    			t2 = space();
    			h2 = element("h2");
    			h2.textContent = "Software Developer";
    			t4 = space();
    			p = element("p");
    			p.textContent = "Passionate software developer crafting elegant solutions to complex problems. \r\n                Specialized in full-stack development with expertise in modern web technologies.";
    			t6 = space();
    			div1 = element("div");
    			button0 = element("button");
    			button0.textContent = "View Projects";
    			t8 = space();
    			button1 = element("button");
    			button1.textContent = "Get in Touch";
    			t10 = space();
    			div2 = element("div");
    			span0 = element("span");
    			span0.textContent = "Java";
    			t12 = space();
    			span1 = element("span");
    			span1.textContent = "PHP";
    			t14 = space();
    			span2 = element("span");
    			span2.textContent = "Svelte.js";
    			t16 = space();
    			span3 = element("span");
    			span3.textContent = "Python";
    			t18 = space();
    			div6 = element("div");
    			div5 = element("div");
    			img = element("img");
    			t19 = space();
    			div4 = element("div");
    			span4 = element("span");
    			t20 = text("\r\n                    Available for hire");
    			attr_dev(div0, "id", "particles-js");
    			add_location(div0, file$4, 47, 4, 1544);
    			add_location(h1, file$4, 50, 12, 1655);
    			attr_dev(h2, "class", "typewriter");
    			add_location(h2, file$4, 51, 12, 1698);
    			attr_dev(p, "class", "bio");
    			add_location(p, file$4, 52, 12, 1758);
    			attr_dev(button0, "class", "btn primary svelte-wzttmu");
    			add_location(button0, file$4, 57, 16, 2042);
    			attr_dev(button1, "class", "btn secondary svelte-wzttmu");
    			add_location(button1, file$4, 63, 16, 2258);
    			attr_dev(div1, "class", "cta-buttons");
    			add_location(div1, file$4, 56, 12, 1999);
    			attr_dev(span0, "class", "tech-tag");
    			add_location(span0, file$4, 71, 16, 2532);
    			attr_dev(span1, "class", "tech-tag");
    			add_location(span1, file$4, 72, 16, 2584);
    			attr_dev(span2, "class", "tech-tag");
    			add_location(span2, file$4, 73, 16, 2635);
    			attr_dev(span3, "class", "tech-tag");
    			add_location(span3, file$4, 74, 16, 2692);
    			attr_dev(div2, "class", "tech-stack");
    			add_location(div2, file$4, 70, 12, 2490);
    			attr_dev(div3, "class", "left-column");
    			add_location(div3, file$4, 49, 8, 1616);
    			if (!src_url_equal(img.src, img_src_value = "/images/taku.jpg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "Takue Mombe");
    			attr_dev(img, "class", "profile-image");
    			add_location(img, file$4, 79, 16, 2861);
    			attr_dev(span4, "class", "dot");
    			add_location(span4, file$4, 81, 20, 2995);
    			attr_dev(div4, "class", "status-badge");
    			add_location(div4, file$4, 80, 16, 2947);
    			attr_dev(div5, "class", "image-container");
    			add_location(div5, file$4, 78, 12, 2814);
    			attr_dev(div6, "class", "right-column");
    			add_location(div6, file$4, 77, 8, 2774);
    			attr_dev(main, "class", "hero-content");
    			add_location(main, file$4, 48, 4, 1579);
    			attr_dev(div7, "class", "hero-section");
    			add_location(div7, file$4, 46, 0, 1512);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div7, anchor);
    			append_dev(div7, div0);
    			append_dev(div7, t0);
    			append_dev(div7, main);
    			append_dev(main, div3);
    			append_dev(div3, h1);
    			append_dev(div3, t2);
    			append_dev(div3, h2);
    			append_dev(div3, t4);
    			append_dev(div3, p);
    			append_dev(div3, t6);
    			append_dev(div3, div1);
    			append_dev(div1, button0);
    			append_dev(div1, t8);
    			append_dev(div1, button1);
    			append_dev(div3, t10);
    			append_dev(div3, div2);
    			append_dev(div2, span0);
    			append_dev(div2, t12);
    			append_dev(div2, span1);
    			append_dev(div2, t14);
    			append_dev(div2, span2);
    			append_dev(div2, t16);
    			append_dev(div2, span3);
    			append_dev(main, t18);
    			append_dev(main, div6);
    			append_dev(div6, div5);
    			append_dev(div5, img);
    			append_dev(div5, t19);
    			append_dev(div5, div4);
    			append_dev(div4, span4);
    			append_dev(div4, t20);

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
    			if (detaching) detach_dev(div7);
    			mounted = false;
    			run_all(dispose);
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

    function scrollToSection(sectionId) {
    	const element = document.querySelector(sectionId);

    	if (element) {
    		element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    	}
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Hero', slots, []);
    	let name = "Takue Mombe";

    	onMount(() => {
    		// Make sure particles.js is loaded
    		if (window.particlesJS) {
    			particlesJS('particles-js', {
    				particles: {
    					number: {
    						value: 50,
    						density: { enable: true, value_area: 1000 }
    					},
    					color: { value: '#3498db' },
    					shape: { type: 'circle' },
    					opacity: { value: 0.5, random: true },
    					size: { value: 3, random: true },
    					move: {
    						enable: true,
    						speed: 2,
    						direction: 'none',
    						random: true,
    						out_mode: 'out'
    					}
    				},
    				interactivity: {
    					detect_on: 'canvas',
    					events: {
    						onhover: { enable: true, mode: 'repulse' },
    						onclick: { enable: true, mode: 'push' }
    					}
    				}
    			});
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
    		init$1(this, options, instance$5, create_fragment$5, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Hero",
    			options,
    			id: create_fragment$5.name
    		});
    	}
    }

    /* src\home\about.svelte generated by Svelte v3.59.2 */
    const file$3 = "src\\home\\about.svelte";

    function create_fragment$4(ctx) {
    	let section;
    	let div0;
    	let t0;
    	let div19;
    	let div1;
    	let span0;
    	let t2;
    	let h1;
    	let t4;
    	let div18;
    	let div11;
    	let div4;
    	let div2;
    	let t6;
    	let div3;
    	let t8;
    	let div7;
    	let div5;
    	let t10;
    	let div6;
    	let t12;
    	let div10;
    	let div8;
    	let t14;
    	let div9;
    	let t16;
    	let div14;
    	let div13;
    	let div12;
    	let i0;
    	let t17;
    	let h20;
    	let t19;
    	let p0;
    	let t21;
    	let span1;
    	let t23;
    	let div17;
    	let div16;
    	let div15;
    	let i1;
    	let t24;
    	let h21;
    	let t26;
    	let p1;
    	let t28;
    	let span2;

    	const block = {
    		c: function create() {
    			section = element("section");
    			div0 = element("div");
    			t0 = space();
    			div19 = element("div");
    			div1 = element("div");
    			span0 = element("span");
    			span0.textContent = "About Me";
    			t2 = space();
    			h1 = element("h1");
    			h1.textContent = "My Journey";
    			t4 = space();
    			div18 = element("div");
    			div11 = element("div");
    			div4 = element("div");
    			div2 = element("div");
    			div2.textContent = "2+";
    			t6 = space();
    			div3 = element("div");
    			div3.textContent = "Years of Experience";
    			t8 = space();
    			div7 = element("div");
    			div5 = element("div");
    			div5.textContent = "15+";
    			t10 = space();
    			div6 = element("div");
    			div6.textContent = "Projects Delivered";
    			t12 = space();
    			div10 = element("div");
    			div8 = element("div");
    			div8.textContent = "5+";
    			t14 = space();
    			div9 = element("div");
    			div9.textContent = "Technologies";
    			t16 = space();
    			div14 = element("div");
    			div13 = element("div");
    			div12 = element("div");
    			i0 = element("i");
    			t17 = space();
    			h20 = element("h2");
    			h20.textContent = "Full Stack Developer";
    			t19 = space();
    			p0 = element("p");
    			p0.textContent = "Currently leading development of web applications and APIs";
    			t21 = space();
    			span1 = element("span");
    			span1.textContent = "2024 - Present";
    			t23 = space();
    			div17 = element("div");
    			div16 = element("div");
    			div15 = element("div");
    			i1 = element("i");
    			t24 = space();
    			h21 = element("h2");
    			h21.textContent = "Junior Developer";
    			t26 = space();
    			p1 = element("p");
    			p1.textContent = "Full-stack development and system maintenance";
    			t28 = space();
    			span2 = element("span");
    			span2.textContent = "2023 - 2024";
    			attr_dev(div0, "id", "about-particles");
    			add_location(div0, file$3, 47, 4, 1683);
    			attr_dev(span0, "class", "section-tag");
    			add_location(span0, file$3, 51, 12, 1804);
    			add_location(h1, file$3, 52, 12, 1859);
    			attr_dev(div1, "class", "about-header");
    			add_location(div1, file$3, 50, 8, 1764);
    			attr_dev(div2, "class", "stat-value");
    			add_location(div2, file$3, 59, 20, 2079);
    			attr_dev(div3, "class", "stat-label");
    			add_location(div3, file$3, 60, 20, 2133);
    			attr_dev(div4, "class", "stat-item");
    			add_location(div4, file$3, 58, 16, 2034);
    			attr_dev(div5, "class", "stat-value");
    			add_location(div5, file$3, 63, 20, 2269);
    			attr_dev(div6, "class", "stat-label");
    			add_location(div6, file$3, 64, 20, 2324);
    			attr_dev(div7, "class", "stat-item");
    			add_location(div7, file$3, 62, 16, 2224);
    			attr_dev(div8, "class", "stat-value");
    			add_location(div8, file$3, 67, 20, 2459);
    			attr_dev(div9, "class", "stat-label");
    			add_location(div9, file$3, 68, 20, 2513);
    			attr_dev(div10, "class", "stat-item");
    			add_location(div10, file$3, 66, 16, 2414);
    			attr_dev(div11, "class", "about-card stats-card");
    			add_location(div11, file$3, 57, 12, 1981);
    			attr_dev(i0, "class", "fas fa-code");
    			add_location(i0, file$3, 76, 24, 2801);
    			add_location(h20, file$3, 77, 24, 2854);
    			attr_dev(div12, "class", "role-header");
    			add_location(div12, file$3, 75, 20, 2750);
    			add_location(p0, file$3, 79, 20, 2933);
    			attr_dev(span1, "class", "time-badge");
    			add_location(span1, file$3, 80, 20, 3020);
    			attr_dev(div13, "class", "role-content");
    			add_location(div13, file$3, 74, 16, 2702);
    			attr_dev(div14, "class", "about-card role-card");
    			add_location(div14, file$3, 73, 12, 2650);
    			attr_dev(i1, "class", "fas fa-laptop-code");
    			add_location(i1, file$3, 88, 24, 3313);
    			add_location(h21, file$3, 89, 24, 3373);
    			attr_dev(div15, "class", "role-header");
    			add_location(div15, file$3, 87, 20, 3262);
    			add_location(p1, file$3, 91, 20, 3448);
    			attr_dev(span2, "class", "time-badge");
    			add_location(span2, file$3, 92, 20, 3522);
    			attr_dev(div16, "class", "role-content");
    			add_location(div16, file$3, 86, 16, 3214);
    			attr_dev(div17, "class", "about-card role-card");
    			add_location(div17, file$3, 85, 12, 3162);
    			attr_dev(div18, "class", "about-grid");
    			add_location(div18, file$3, 55, 8, 1906);
    			attr_dev(div19, "class", "about-content");
    			add_location(div19, file$3, 49, 4, 1727);
    			attr_dev(section, "class", "about-section");
    			attr_dev(section, "id", "about");
    			add_location(section, file$3, 46, 0, 1635);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			append_dev(section, div0);
    			append_dev(section, t0);
    			append_dev(section, div19);
    			append_dev(div19, div1);
    			append_dev(div1, span0);
    			append_dev(div1, t2);
    			append_dev(div1, h1);
    			append_dev(div19, t4);
    			append_dev(div19, div18);
    			append_dev(div18, div11);
    			append_dev(div11, div4);
    			append_dev(div4, div2);
    			append_dev(div4, t6);
    			append_dev(div4, div3);
    			append_dev(div11, t8);
    			append_dev(div11, div7);
    			append_dev(div7, div5);
    			append_dev(div7, t10);
    			append_dev(div7, div6);
    			append_dev(div11, t12);
    			append_dev(div11, div10);
    			append_dev(div10, div8);
    			append_dev(div10, t14);
    			append_dev(div10, div9);
    			append_dev(div18, t16);
    			append_dev(div18, div14);
    			append_dev(div14, div13);
    			append_dev(div13, div12);
    			append_dev(div12, i0);
    			append_dev(div12, t17);
    			append_dev(div12, h20);
    			append_dev(div13, t19);
    			append_dev(div13, p0);
    			append_dev(div13, t21);
    			append_dev(div13, span1);
    			append_dev(div18, t23);
    			append_dev(div18, div17);
    			append_dev(div17, div16);
    			append_dev(div16, div15);
    			append_dev(div15, i1);
    			append_dev(div15, t24);
    			append_dev(div15, h21);
    			append_dev(div16, t26);
    			append_dev(div16, p1);
    			append_dev(div16, t28);
    			append_dev(div16, span2);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
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
    	validate_slots('About', slots, []);

    	onMount(() => {
    		// Initialize particles for about section
    		if (window.particlesJS) {
    			particlesJS('about-particles', {
    				particles: {
    					number: {
    						value: 30,
    						density: { enable: true, value_area: 1000 }
    					},
    					color: { value: '#3498db' },
    					shape: { type: 'circle' },
    					opacity: { value: 0.3, random: true },
    					size: { value: 2, random: true },
    					move: {
    						enable: true,
    						speed: 1,
    						direction: 'none',
    						random: true,
    						out_mode: 'out'
    					}
    				},
    				interactivity: {
    					detect_on: 'canvas',
    					events: {
    						onhover: { enable: true, mode: 'bubble' },
    						onclick: { enable: true, mode: 'push' }
    					}
    				}
    			});
    		}

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

    	$$self.$capture_state = () => ({ onMount });
    	return [];
    }

    class About extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init$1(this, options, instance$4, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "About",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    /* src\home\blogs.svelte generated by Svelte v3.59.2 */

    const { console: console_1$1 } = globals;
    const file$2 = "src\\home\\blogs.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[11] = list[i];
    	child_ctx[13] = i;
    	return child_ctx;
    }

    function get_each_context_1$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[14] = list[i];
    	child_ctx[13] = i;
    	return child_ctx;
    }

    function get_each_context_2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[16] = list[i];
    	return child_ctx;
    }

    // (223:4) {:else}
    function create_else_block(ctx) {
    	let div;
    	let each_value_1 = /*blogPosts*/ ctx[2];
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1$1(get_each_context_1$1(ctx, each_value_1, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", "posts-grid svelte-14qxhj3");
    			add_location(div, file$2, 222, 17, 7438);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(div, null);
    				}
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*blogPosts, openPost, getAuthorColor, getAuthorIcon*/ 36) {
    				each_value_1 = /*blogPosts*/ ctx[2];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1$1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_1$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_1.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(223:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (219:20) 
    function create_if_block_1$1(ctx) {
    	let div;
    	let p;
    	let t0;
    	let t1;

    	const block = {
    		c: function create() {
    			div = element("div");
    			p = element("p");
    			t0 = text("⚠️ ");
    			t1 = text(/*error*/ ctx[4]);
    			attr_dev(p, "class", "error-message svelte-14qxhj3");
    			add_location(p, file$2, 220, 8, 7366);
    			attr_dev(div, "class", "error-state svelte-14qxhj3");
    			add_location(div, file$2, 219, 6, 7331);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, p);
    			append_dev(p, t0);
    			append_dev(p, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*error*/ 16) set_data_dev(t1, /*error*/ ctx[4]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(219:20) ",
    		ctx
    	});

    	return block;
    }

    // (214:4) {#if loading}
    function create_if_block$2(ctx) {
    	let div1;
    	let div0;
    	let t0;
    	let p;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			t0 = space();
    			p = element("p");
    			p.textContent = "Decrypting neural transmissions...";
    			attr_dev(div0, "class", "loading-spinner svelte-14qxhj3");
    			add_location(div0, file$2, 215, 8, 7201);
    			add_location(p, file$2, 216, 8, 7246);
    			attr_dev(div1, "class", "loading-state svelte-14qxhj3");
    			add_location(div1, file$2, 214, 6, 7164);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div1, t0);
    			append_dev(div1, p);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(214:4) {#if loading}",
    		ctx
    	});

    	return block;
    }

    // (234:14) {#each post.tags as tag}
    function create_each_block_2(ctx) {
    	let span;
    	let t_value = /*tag*/ ctx[16] + "";
    	let t;

    	const block = {
    		c: function create() {
    			span = element("span");
    			t = text(t_value);
    			attr_dev(span, "class", "tag svelte-14qxhj3");
    			add_location(span, file$2, 234, 16, 8038);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*blogPosts*/ 4 && t_value !== (t_value = /*tag*/ ctx[16] + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_2.name,
    		type: "each",
    		source: "(234:14) {#each post.tags as tag}",
    		ctx
    	});

    	return block;
    }

    // (245:14) {#if post.comments && post.comments.length > 0}
    function create_if_block_2(ctx) {
    	let div;
    	let span;
    	let t0;
    	let t1_value = /*post*/ ctx[14].comments.length + "";
    	let t1;

    	const block = {
    		c: function create() {
    			div = element("div");
    			span = element("span");
    			t0 = text("💬 ");
    			t1 = text(t1_value);
    			attr_dev(span, "class", "comment-count");
    			add_location(span, file$2, 246, 18, 8575);
    			attr_dev(div, "class", "comment-indicator");
    			add_location(div, file$2, 245, 16, 8524);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, span);
    			append_dev(span, t0);
    			append_dev(span, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*blogPosts*/ 4 && t1_value !== (t1_value = /*post*/ ctx[14].comments.length + "")) set_data_dev(t1, t1_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(245:14) {#if post.comments && post.comments.length > 0}",
    		ctx
    	});

    	return block;
    }

    // (224:8) {#each blogPosts as post, i}
    function create_each_block_1$1(ctx) {
    	let article;
    	let div1;
    	let span0;
    	let t0_value = /*post*/ ctx[14].date + "";
    	let t0;
    	let t1;
    	let div0;
    	let span1;
    	let t2_value = getAuthorIcon(/*post*/ ctx[14].author) + "";
    	let t2;
    	let t3;
    	let span2;
    	let t4_value = /*post*/ ctx[14].author + "";
    	let t4;
    	let t5;
    	let div2;
    	let t6;
    	let h3;
    	let t7_value = /*post*/ ctx[14].title + "";
    	let t7;
    	let t8;
    	let p;
    	let t9_value = /*post*/ ctx[14].summary + "";
    	let t9;
    	let t10;
    	let div3;
    	let button;
    	let span3;
    	let t12;
    	let span4;
    	let t14;
    	let t15;
    	let mounted;
    	let dispose;
    	let each_value_2 = /*post*/ ctx[14].tags;
    	validate_each_argument(each_value_2);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_2.length; i += 1) {
    		each_blocks[i] = create_each_block_2(get_each_context_2(ctx, each_value_2, i));
    	}

    	function click_handler() {
    		return /*click_handler*/ ctx[6](/*post*/ ctx[14]);
    	}

    	let if_block = /*post*/ ctx[14].comments && /*post*/ ctx[14].comments.length > 0 && create_if_block_2(ctx);

    	const block = {
    		c: function create() {
    			article = element("article");
    			div1 = element("div");
    			span0 = element("span");
    			t0 = text(t0_value);
    			t1 = space();
    			div0 = element("div");
    			span1 = element("span");
    			t2 = text(t2_value);
    			t3 = space();
    			span2 = element("span");
    			t4 = text(t4_value);
    			t5 = space();
    			div2 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t6 = space();
    			h3 = element("h3");
    			t7 = text(t7_value);
    			t8 = space();
    			p = element("p");
    			t9 = text(t9_value);
    			t10 = space();
    			div3 = element("div");
    			button = element("button");
    			span3 = element("span");
    			span3.textContent = "DECRYPT";
    			t12 = space();
    			span4 = element("span");
    			span4.textContent = "→";
    			t14 = space();
    			if (if_block) if_block.c();
    			t15 = space();
    			attr_dev(span0, "class", "post-date svelte-14qxhj3");
    			add_location(span0, file$2, 226, 14, 7630);
    			attr_dev(span1, "class", "author-icon svelte-14qxhj3");
    			add_location(span1, file$2, 228, 16, 7776);
    			attr_dev(span2, "class", "author-name");
    			add_location(span2, file$2, 229, 16, 7855);
    			attr_dev(div0, "class", "post-author svelte-14qxhj3");
    			set_style(div0, "color", getAuthorColor(/*post*/ ctx[14].author));
    			add_location(div0, file$2, 227, 14, 7688);
    			attr_dev(div1, "class", "post-header svelte-14qxhj3");
    			add_location(div1, file$2, 225, 12, 7589);
    			attr_dev(div2, "class", "post-tags svelte-14qxhj3");
    			add_location(div2, file$2, 232, 12, 7957);
    			attr_dev(h3, "class", "post-title svelte-14qxhj3");
    			add_location(h3, file$2, 237, 12, 8125);
    			attr_dev(p, "class", "post-summary svelte-14qxhj3");
    			add_location(p, file$2, 238, 12, 8179);
    			add_location(span3, file$2, 241, 16, 8352);
    			attr_dev(span4, "class", "arrow svelte-14qxhj3");
    			add_location(span4, file$2, 242, 16, 8390);
    			attr_dev(button, "class", "read-more svelte-14qxhj3");
    			add_location(button, file$2, 240, 14, 8276);
    			attr_dev(div3, "class", "post-footer svelte-14qxhj3");
    			add_location(div3, file$2, 239, 12, 8235);
    			attr_dev(article, "class", "post-card svelte-14qxhj3");
    			set_style(article, "animation-delay", /*i*/ ctx[13] * 0.2 + "s");
    			add_location(article, file$2, 224, 10, 7512);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, article, anchor);
    			append_dev(article, div1);
    			append_dev(div1, span0);
    			append_dev(span0, t0);
    			append_dev(div1, t1);
    			append_dev(div1, div0);
    			append_dev(div0, span1);
    			append_dev(span1, t2);
    			append_dev(div0, t3);
    			append_dev(div0, span2);
    			append_dev(span2, t4);
    			append_dev(article, t5);
    			append_dev(article, div2);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(div2, null);
    				}
    			}

    			append_dev(article, t6);
    			append_dev(article, h3);
    			append_dev(h3, t7);
    			append_dev(article, t8);
    			append_dev(article, p);
    			append_dev(p, t9);
    			append_dev(article, t10);
    			append_dev(article, div3);
    			append_dev(div3, button);
    			append_dev(button, span3);
    			append_dev(button, t12);
    			append_dev(button, span4);
    			append_dev(div3, t14);
    			if (if_block) if_block.m(div3, null);
    			append_dev(article, t15);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", click_handler, false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*blogPosts*/ 4 && t0_value !== (t0_value = /*post*/ ctx[14].date + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*blogPosts*/ 4 && t2_value !== (t2_value = getAuthorIcon(/*post*/ ctx[14].author) + "")) set_data_dev(t2, t2_value);
    			if (dirty & /*blogPosts*/ 4 && t4_value !== (t4_value = /*post*/ ctx[14].author + "")) set_data_dev(t4, t4_value);

    			if (dirty & /*blogPosts*/ 4) {
    				set_style(div0, "color", getAuthorColor(/*post*/ ctx[14].author));
    			}

    			if (dirty & /*blogPosts*/ 4) {
    				each_value_2 = /*post*/ ctx[14].tags;
    				validate_each_argument(each_value_2);
    				let i;

    				for (i = 0; i < each_value_2.length; i += 1) {
    					const child_ctx = get_each_context_2(ctx, each_value_2, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_2(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div2, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_2.length;
    			}

    			if (dirty & /*blogPosts*/ 4 && t7_value !== (t7_value = /*post*/ ctx[14].title + "")) set_data_dev(t7, t7_value);
    			if (dirty & /*blogPosts*/ 4 && t9_value !== (t9_value = /*post*/ ctx[14].summary + "")) set_data_dev(t9, t9_value);

    			if (/*post*/ ctx[14].comments && /*post*/ ctx[14].comments.length > 0) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_2(ctx);
    					if_block.c();
    					if_block.m(div3, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(article);
    			destroy_each(each_blocks, detaching);
    			if (if_block) if_block.d();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1$1.name,
    		type: "each",
    		source: "(224:8) {#each blogPosts as post, i}",
    		ctx
    	});

    	return block;
    }

    // (283:6) {#each Array(20) as _, i}
    function create_each_block$1(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", "particle svelte-14qxhj3");
    			set_style(div, "animation-delay", /*i*/ ctx[13] * 0.5 + "s");
    			set_style(div, "left", Math.random() * 100 + "%");
    			set_style(div, "animation-duration", 3 + Math.random() * 4 + "s");
    			add_location(div, file$2, 283, 8, 9737);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(283:6) {#each Array(20) as _, i}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let main;
    	let header;
    	let div0;
    	let h1;
    	let t1;
    	let div1;
    	let p0;
    	let t2;
    	let span0;
    	let t4;
    	let section0;
    	let div6;
    	let div3;
    	let div2;
    	let span1;
    	let t5;
    	let span2;
    	let t6;
    	let span3;
    	let t7;
    	let span4;
    	let t9;
    	let div5;
    	let div4;
    	let p1;
    	let t10;
    	let span5;
    	let t12;
    	let span6;
    	let t14;
    	let t15;
    	let p2;
    	let t17;
    	let section1;
    	let h20;
    	let span7;
    	let t19;
    	let span8;
    	let t21;
    	let div13;
    	let div8;
    	let div7;
    	let t23;
    	let h30;
    	let t25;
    	let p3;
    	let t27;
    	let div10;
    	let div9;
    	let t29;
    	let h31;
    	let t31;
    	let p4;
    	let t33;
    	let div12;
    	let div11;
    	let t35;
    	let h32;
    	let t37;
    	let p5;
    	let t39;
    	let section2;
    	let div14;
    	let p6;
    	let span9;
    	let t41;
    	let span10;
    	let t43;
    	let section3;
    	let h21;
    	let span11;
    	let t45;
    	let span12;
    	let t47;
    	let t48;
    	let section4;
    	let div18;
    	let div15;
    	let h33;
    	let t50;
    	let p7;
    	let t52;
    	let div17;
    	let button0;
    	let span13;
    	let t54;
    	let div16;
    	let t55;
    	let button1;
    	let span14;
    	let t57;
    	let div21;
    	let div19;
    	let t58;
    	let div20;

    	function select_block_type(ctx, dirty) {
    		if (/*loading*/ ctx[3]) return create_if_block$2;
    		if (/*error*/ ctx[4]) return create_if_block_1$1;
    		return create_else_block;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);
    	let each_value = Array(20);
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			main = element("main");
    			header = element("header");
    			div0 = element("div");
    			h1 = element("h1");
    			h1.textContent = "NEURAL CODEX";
    			t1 = space();
    			div1 = element("div");
    			p0 = element("p");
    			t2 = text(/*typewriterText*/ ctx[0]);
    			span0 = element("span");
    			span0.textContent = "█";
    			t4 = space();
    			section0 = element("section");
    			div6 = element("div");
    			div3 = element("div");
    			div2 = element("div");
    			span1 = element("span");
    			t5 = space();
    			span2 = element("span");
    			t6 = space();
    			span3 = element("span");
    			t7 = space();
    			span4 = element("span");
    			span4.textContent = "~/dev/thoughts";
    			t9 = space();
    			div5 = element("div");
    			div4 = element("div");
    			p1 = element("p");
    			t10 = text("In the vast expanse of digital consciousness, where ");
    			span5 = element("span");
    			span5.textContent = "algorithms breathe";
    			t12 = text(" \r\n            and ");
    			span6 = element("span");
    			span6.textContent = "data flows like poetry";
    			t14 = text(", welcome to my neural sanctuary.");
    			t15 = space();
    			p2 = element("p");
    			p2.textContent = "Here, three AI personas merge human intuition with artificial intelligence to craft tomorrow's insights today.";
    			t17 = space();
    			section1 = element("section");
    			h20 = element("h2");
    			span7 = element("span");
    			span7.textContent = ">";
    			t19 = text(" NEURAL_ENTITIES\r\n      ");
    			span8 = element("span");
    			span8.textContent = "_";
    			t21 = space();
    			div13 = element("div");
    			div8 = element("div");
    			div7 = element("div");
    			div7.textContent = "🧠";
    			t23 = space();
    			h30 = element("h3");
    			h30.textContent = "The Neural Sage";
    			t25 = space();
    			p3 = element("p");
    			p3.textContent = "Philosophical AI researcher exploring the intersection of consciousness and code";
    			t27 = space();
    			div10 = element("div");
    			div9 = element("div");
    			div9.textContent = "⚗️";
    			t29 = space();
    			h31 = element("h3");
    			h31.textContent = "The Code Alchemist";
    			t31 = space();
    			p4 = element("p");
    			p4.textContent = "Practical wizard transforming complex concepts into elegant digital solutions";
    			t33 = space();
    			div12 = element("div");
    			div11 = element("div");
    			div11.textContent = "🔮";
    			t35 = space();
    			h32 = element("h3");
    			h32.textContent = "The Cyber Oracle";
    			t37 = space();
    			p5 = element("p");
    			p5.textContent = "Future-focused visionary predicting tech trends with wit and sharp insights";
    			t39 = space();
    			section2 = element("section");
    			div14 = element("div");
    			p6 = element("p");
    			span9 = element("span");
    			span9.textContent = "[";
    			t41 = text("\r\n        AI-generated chronicles from the intersection of creativity, code, and computational thinking\r\n        ");
    			span10 = element("span");
    			span10.textContent = "]";
    			t43 = space();
    			section3 = element("section");
    			h21 = element("h2");
    			span11 = element("span");
    			span11.textContent = ">";
    			t45 = text(" LATEST_TRANSMISSIONS\r\n      ");
    			span12 = element("span");
    			span12.textContent = "_";
    			t47 = space();
    			if_block.c();
    			t48 = space();
    			section4 = element("section");
    			div18 = element("div");
    			div15 = element("div");
    			h33 = element("h3");
    			h33.textContent = "Join the Neural Network";
    			t50 = space();
    			p7 = element("p");
    			p7.textContent = "Subscribe to receive AI-generated transmissions directly to your neural interface.\r\n          Explore the archive of digital wisdom crafted by our three AI personas.";
    			t52 = space();
    			div17 = element("div");
    			button0 = element("button");
    			span13 = element("span");
    			span13.textContent = "INITIALIZE_SUBSCRIPTION";
    			t54 = space();
    			div16 = element("div");
    			t55 = space();
    			button1 = element("button");
    			span14 = element("span");
    			span14.textContent = "BROWSE_ARCHIVE";
    			t57 = space();
    			div21 = element("div");
    			div19 = element("div");
    			t58 = space();
    			div20 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(h1, "class", "cyber-title svelte-14qxhj3");
    			attr_dev(h1, "data-text", "NEURAL CODEX");
    			add_location(h1, file$2, 137, 6, 4368);
    			attr_dev(div0, "class", "glitch-wrapper svelte-14qxhj3");
    			add_location(div0, file$2, 136, 4, 4332);
    			attr_dev(span0, "class", "cursor svelte-14qxhj3");
    			add_location(span0, file$2, 140, 44, 4532);
    			attr_dev(p0, "class", "typewriter svelte-14qxhj3");
    			add_location(p0, file$2, 140, 6, 4494);
    			attr_dev(div1, "class", "typewriter-container svelte-14qxhj3");
    			add_location(div1, file$2, 139, 4, 4452);
    			attr_dev(header, "class", "cyber-header svelte-14qxhj3");
    			add_location(header, file$2, 135, 2, 4297);
    			attr_dev(span1, "class", "btn-close svelte-14qxhj3");
    			add_location(span1, file$2, 149, 10, 4781);
    			attr_dev(span2, "class", "btn-minimize svelte-14qxhj3");
    			add_location(span2, file$2, 150, 10, 4824);
    			attr_dev(span3, "class", "btn-maximize svelte-14qxhj3");
    			add_location(span3, file$2, 151, 10, 4870);
    			attr_dev(div2, "class", "terminal-buttons svelte-14qxhj3");
    			add_location(div2, file$2, 148, 8, 4739);
    			attr_dev(span4, "class", "terminal-title svelte-14qxhj3");
    			add_location(span4, file$2, 153, 8, 4930);
    			attr_dev(div3, "class", "terminal-header svelte-14qxhj3");
    			add_location(div3, file$2, 147, 6, 4700);
    			attr_dev(span5, "class", "highlight svelte-14qxhj3");
    			add_location(span5, file$2, 158, 64, 5168);
    			attr_dev(span6, "class", "highlight svelte-14qxhj3");
    			add_location(span6, file$2, 159, 16, 5236);
    			attr_dev(p1, "class", "cyber-welcome svelte-14qxhj3");
    			add_location(p1, file$2, 157, 10, 5077);
    			attr_dev(p2, "class", "cyber-subtitle svelte-14qxhj3");
    			add_location(p2, file$2, 161, 10, 5350);
    			attr_dev(div4, "class", "welcome-text");
    			add_location(div4, file$2, 156, 8, 5039);
    			attr_dev(div5, "class", "terminal-body svelte-14qxhj3");
    			add_location(div5, file$2, 155, 6, 5002);
    			attr_dev(div6, "class", "terminal-window svelte-14qxhj3");
    			add_location(div6, file$2, 146, 4, 4663);
    			attr_dev(section0, "class", "welcome-section svelte-14qxhj3");
    			add_location(section0, file$2, 145, 2, 4624);
    			attr_dev(span7, "class", "title-decoration svelte-14qxhj3");
    			add_location(span7, file$2, 172, 6, 5689);
    			attr_dev(span8, "class", "cursor-blink svelte-14qxhj3");
    			add_location(span8, file$2, 173, 6, 5752);
    			attr_dev(h20, "class", "section-title svelte-14qxhj3");
    			add_location(h20, file$2, 171, 4, 5655);
    			attr_dev(div7, "class", "persona-icon svelte-14qxhj3");
    			add_location(div7, file$2, 178, 8, 5893);
    			attr_dev(h30, "class", "svelte-14qxhj3");
    			add_location(h30, file$2, 179, 8, 5937);
    			attr_dev(p3, "class", "svelte-14qxhj3");
    			add_location(p3, file$2, 180, 8, 5971);
    			attr_dev(div8, "class", "persona-card neural-sage svelte-14qxhj3");
    			add_location(div8, file$2, 177, 6, 5845);
    			attr_dev(div9, "class", "persona-icon svelte-14qxhj3");
    			add_location(div9, file$2, 183, 8, 6131);
    			attr_dev(h31, "class", "svelte-14qxhj3");
    			add_location(h31, file$2, 184, 8, 6175);
    			attr_dev(p4, "class", "svelte-14qxhj3");
    			add_location(p4, file$2, 185, 8, 6212);
    			attr_dev(div10, "class", "persona-card code-alchemist svelte-14qxhj3");
    			add_location(div10, file$2, 182, 6, 6080);
    			attr_dev(div11, "class", "persona-icon svelte-14qxhj3");
    			add_location(div11, file$2, 188, 8, 6367);
    			attr_dev(h32, "class", "svelte-14qxhj3");
    			add_location(h32, file$2, 189, 8, 6411);
    			attr_dev(p5, "class", "svelte-14qxhj3");
    			add_location(p5, file$2, 190, 8, 6446);
    			attr_dev(div12, "class", "persona-card cyber-oracle svelte-14qxhj3");
    			add_location(div12, file$2, 187, 6, 6318);
    			attr_dev(div13, "class", "personas-grid svelte-14qxhj3");
    			add_location(div13, file$2, 176, 4, 5810);
    			attr_dev(section1, "class", "personas-section svelte-14qxhj3");
    			add_location(section1, file$2, 170, 2, 5615);
    			attr_dev(span9, "class", "bracket svelte-14qxhj3");
    			add_location(span9, file$2, 199, 8, 6704);
    			attr_dev(span10, "class", "bracket svelte-14qxhj3");
    			add_location(span10, file$2, 201, 8, 6847);
    			attr_dev(p6, "class", "cyber-tagline svelte-14qxhj3");
    			add_location(p6, file$2, 198, 6, 6669);
    			attr_dev(div14, "class", "neon-border svelte-14qxhj3");
    			add_location(div14, file$2, 197, 4, 6636);
    			attr_dev(section2, "class", "tagline-section svelte-14qxhj3");
    			add_location(section2, file$2, 196, 2, 6597);
    			attr_dev(span11, "class", "title-decoration svelte-14qxhj3");
    			add_location(span11, file$2, 209, 6, 7017);
    			attr_dev(span12, "class", "cursor-blink svelte-14qxhj3");
    			add_location(span12, file$2, 210, 6, 7085);
    			attr_dev(h21, "class", "section-title svelte-14qxhj3");
    			add_location(h21, file$2, 208, 4, 6983);
    			attr_dev(section3, "class", "posts-section svelte-14qxhj3");
    			add_location(section3, file$2, 207, 2, 6946);
    			attr_dev(h33, "class", "cta-title svelte-14qxhj3");
    			add_location(h33, file$2, 260, 8, 8913);
    			attr_dev(p7, "class", "cta-description svelte-14qxhj3");
    			add_location(p7, file$2, 261, 8, 8973);
    			attr_dev(div15, "class", "cta-text");
    			add_location(div15, file$2, 259, 6, 8881);
    			attr_dev(span13, "class", "btn-text");
    			add_location(span13, file$2, 268, 10, 9292);
    			attr_dev(div16, "class", "btn-glow svelte-14qxhj3");
    			add_location(div16, file$2, 269, 10, 9357);
    			attr_dev(button0, "class", "cta-btn primary svelte-14qxhj3");
    			add_location(button0, file$2, 267, 8, 9248);
    			attr_dev(span14, "class", "btn-text");
    			add_location(span14, file$2, 272, 10, 9460);
    			attr_dev(button1, "class", "cta-btn secondary svelte-14qxhj3");
    			add_location(button1, file$2, 271, 8, 9414);
    			attr_dev(div17, "class", "cta-buttons svelte-14qxhj3");
    			add_location(div17, file$2, 266, 6, 9213);
    			attr_dev(div18, "class", "cta-container");
    			add_location(div18, file$2, 258, 4, 8846);
    			attr_dev(section4, "class", "cta-section svelte-14qxhj3");
    			add_location(section4, file$2, 257, 2, 8811);
    			attr_dev(div19, "class", "grid-overlay svelte-14qxhj3");
    			add_location(div19, file$2, 280, 4, 9628);
    			attr_dev(div20, "class", "particle-field svelte-14qxhj3");
    			add_location(div20, file$2, 281, 4, 9666);
    			attr_dev(div21, "class", "cyber-bg svelte-14qxhj3");
    			add_location(div21, file$2, 279, 2, 9600);
    			attr_dev(main, "class", "cyber-container svelte-14qxhj3");
    			toggle_class(main, "visible", /*isVisible*/ ctx[1]);
    			add_location(main, file$2, 133, 0, 4210);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, header);
    			append_dev(header, div0);
    			append_dev(div0, h1);
    			append_dev(header, t1);
    			append_dev(header, div1);
    			append_dev(div1, p0);
    			append_dev(p0, t2);
    			append_dev(p0, span0);
    			append_dev(main, t4);
    			append_dev(main, section0);
    			append_dev(section0, div6);
    			append_dev(div6, div3);
    			append_dev(div3, div2);
    			append_dev(div2, span1);
    			append_dev(div2, t5);
    			append_dev(div2, span2);
    			append_dev(div2, t6);
    			append_dev(div2, span3);
    			append_dev(div3, t7);
    			append_dev(div3, span4);
    			append_dev(div6, t9);
    			append_dev(div6, div5);
    			append_dev(div5, div4);
    			append_dev(div4, p1);
    			append_dev(p1, t10);
    			append_dev(p1, span5);
    			append_dev(p1, t12);
    			append_dev(p1, span6);
    			append_dev(p1, t14);
    			append_dev(div4, t15);
    			append_dev(div4, p2);
    			append_dev(main, t17);
    			append_dev(main, section1);
    			append_dev(section1, h20);
    			append_dev(h20, span7);
    			append_dev(h20, t19);
    			append_dev(h20, span8);
    			append_dev(section1, t21);
    			append_dev(section1, div13);
    			append_dev(div13, div8);
    			append_dev(div8, div7);
    			append_dev(div8, t23);
    			append_dev(div8, h30);
    			append_dev(div8, t25);
    			append_dev(div8, p3);
    			append_dev(div13, t27);
    			append_dev(div13, div10);
    			append_dev(div10, div9);
    			append_dev(div10, t29);
    			append_dev(div10, h31);
    			append_dev(div10, t31);
    			append_dev(div10, p4);
    			append_dev(div13, t33);
    			append_dev(div13, div12);
    			append_dev(div12, div11);
    			append_dev(div12, t35);
    			append_dev(div12, h32);
    			append_dev(div12, t37);
    			append_dev(div12, p5);
    			append_dev(main, t39);
    			append_dev(main, section2);
    			append_dev(section2, div14);
    			append_dev(div14, p6);
    			append_dev(p6, span9);
    			append_dev(p6, t41);
    			append_dev(p6, span10);
    			append_dev(main, t43);
    			append_dev(main, section3);
    			append_dev(section3, h21);
    			append_dev(h21, span11);
    			append_dev(h21, t45);
    			append_dev(h21, span12);
    			append_dev(section3, t47);
    			if_block.m(section3, null);
    			append_dev(main, t48);
    			append_dev(main, section4);
    			append_dev(section4, div18);
    			append_dev(div18, div15);
    			append_dev(div15, h33);
    			append_dev(div15, t50);
    			append_dev(div15, p7);
    			append_dev(div18, t52);
    			append_dev(div18, div17);
    			append_dev(div17, button0);
    			append_dev(button0, span13);
    			append_dev(button0, t54);
    			append_dev(button0, div16);
    			append_dev(div17, t55);
    			append_dev(div17, button1);
    			append_dev(button1, span14);
    			append_dev(main, t57);
    			append_dev(main, div21);
    			append_dev(div21, div19);
    			append_dev(div21, t58);
    			append_dev(div21, div20);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(div20, null);
    				}
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*typewriterText*/ 1) set_data_dev(t2, /*typewriterText*/ ctx[0]);

    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(section3, null);
    				}
    			}

    			if (dirty & /*Math*/ 0) {
    				each_value = Array(20);
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div20, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (dirty & /*isVisible*/ 2) {
    				toggle_class(main, "visible", /*isVisible*/ ctx[1]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			if_block.d();
    			destroy_each(each_blocks, detaching);
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

    const fullText = 'Where silicon dreams meet liquid logic...';

    // Get author color based on persona
    function getAuthorColor(author) {
    	const colors = {
    		'The Neural Sage': '#00ff41',
    		'The Code Alchemist': '#ff0080',
    		'The Cyber Oracle': '#00ccff'
    	};

    	return colors[author] || '#00ff41';
    }

    // Get author icon based on persona
    function getAuthorIcon(author) {
    	const icons = {
    		'The Neural Sage': '🧠',
    		'The Code Alchemist': '⚗️',
    		'The Cyber Oracle': '🔮'
    	};

    	return icons[author] || '🤖';
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Blogs', slots, []);
    	let typewriterText = '';
    	let isVisible = false;
    	let blogPosts = [];
    	let loading = true;
    	let error = null;
    	let selectedPost = null;
    	let showComments = false;

    	// Load blog posts from JSON files
    	async function loadBlogPosts() {
    		try {
    			// Load generated posts from static/blogs directory
    			const response = await fetch('/blogs/');

    			if (response.ok) {
    				const fileList = await response.text();

    				// Parse the directory listing to get JSON files
    				const jsonFiles = fileList.match(/href="(\d{8}\.json)"/g);

    				if (jsonFiles) {
    					const posts = [];

    					for (const match of jsonFiles) {
    						const filename = match.match(/href="([^"]+)"/)[1];

    						try {
    							const postResponse = await fetch(`/blogs/${filename}`);

    							if (postResponse.ok) {
    								const post = await postResponse.json();
    								posts.push(post);
    							}
    						} catch(err) {
    							console.warn(`Failed to load ${filename}:`, err);
    						}
    					}

    					// Sort posts by date (newest first)
    					posts.sort((a, b) => new Date(b.generated_at) - new Date(a.generated_at));

    					$$invalidate(2, blogPosts = posts);
    				}
    			}

    			// If no posts loaded, use static examples
    			if (blogPosts.length === 0) {
    				$$invalidate(2, blogPosts = [
    					{
    						title: "Neural Networks and Coffee: A Developer's Morning Ritual",
    						summary: "Exploring how AI-assisted debugging transforms the sacred art of morning code reviews, one caffeinated commit at a time.",
    						date: "2025.05.28",
    						tags: ["AI", "DevTools", "Automation"],
    						author: "The Neural Sage",
    						comments: []
    					},
    					{
    						title: "Ghost in the Shell Script: Automating the Invisible",
    						summary: "Deep dive into background processes that make modern development feel like magic—from CI/CD pipelines to intelligent code completion.",
    						date: "2025.05.21",
    						tags: ["Automation", "DevOps", "Shell"],
    						author: "The Code Alchemist",
    						comments: []
    					},
    					{
    						title: "The Poetry of Clean Code: When Algorithms Dance",
    						summary: "Why beautiful code isn't just functional—it's an art form. Examining the intersection of creativity and computational thinking.",
    						date: "2025.05.14",
    						tags: ["Clean Code", "Philosophy", "Craft"],
    						author: "The Cyber Oracle",
    						comments: []
    					}
    				]);
    			}

    			$$invalidate(3, loading = false);
    		} catch(err) {
    			console.error('Error loading blog posts:', err);
    			$$invalidate(4, error = 'Failed to load blog posts');
    			$$invalidate(3, loading = false);
    		}
    	}

    	// Function to open post details with comments
    	function openPost(post) {
    		selectedPost = post;
    		showComments = true;
    	}

    	// Function to close post details
    	function closePost() {
    		selectedPost = null;
    		showComments = false;
    	}

    	onMount(() => {
    		$$invalidate(1, isVisible = true);
    		loadBlogPosts();

    		// Typewriter effect
    		let i = 0;

    		const typeInterval = setInterval(
    			() => {
    				if (i < fullText.length) {
    					$$invalidate(0, typewriterText += fullText.charAt(i));
    					i++;
    				} else {
    					clearInterval(typeInterval);
    				}
    			},
    			50
    		);

    		return () => clearInterval(typeInterval);
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$1.warn(`<Blogs> was created with unknown prop '${key}'`);
    	});

    	const click_handler = post => openPost(post);

    	$$self.$capture_state = () => ({
    		onMount,
    		typewriterText,
    		fullText,
    		isVisible,
    		blogPosts,
    		loading,
    		error,
    		selectedPost,
    		showComments,
    		loadBlogPosts,
    		openPost,
    		closePost,
    		getAuthorColor,
    		getAuthorIcon
    	});

    	$$self.$inject_state = $$props => {
    		if ('typewriterText' in $$props) $$invalidate(0, typewriterText = $$props.typewriterText);
    		if ('isVisible' in $$props) $$invalidate(1, isVisible = $$props.isVisible);
    		if ('blogPosts' in $$props) $$invalidate(2, blogPosts = $$props.blogPosts);
    		if ('loading' in $$props) $$invalidate(3, loading = $$props.loading);
    		if ('error' in $$props) $$invalidate(4, error = $$props.error);
    		if ('selectedPost' in $$props) selectedPost = $$props.selectedPost;
    		if ('showComments' in $$props) showComments = $$props.showComments;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [typewriterText, isVisible, blogPosts, loading, error, openPost, click_handler];
    }

    class Blogs extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init$1(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Blogs",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    /* src\home\project.svelte generated by Svelte v3.59.2 */
    const file$1 = "src\\home\\project.svelte";

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

    // (153:28) {#each project.tech as tech}
    function create_each_block_1(ctx) {
    	let span;
    	let t_value = /*tech*/ ctx[4] + "";
    	let t;

    	const block = {
    		c: function create() {
    			span = element("span");
    			t = text(t_value);
    			attr_dev(span, "class", "tech-tag");
    			add_location(span, file$1, 153, 32, 5818);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(153:28) {#each project.tech as tech}",
    		ctx
    	});

    	return block;
    }

    // (163:28) {#if project.live}
    function create_if_block_1(ctx) {
    	let a;
    	let i;
    	let t;

    	const block = {
    		c: function create() {
    			a = element("a");
    			i = element("i");
    			t = text("\r\n                                    Live Demo");
    			attr_dev(i, "class", "fas fa-external-link-alt svelte-dsebbp");
    			add_location(i, file$1, 164, 36, 6402);
    			attr_dev(a, "href", /*project*/ ctx[1].live);
    			attr_dev(a, "target", "_blank");
    			attr_dev(a, "class", "project-link live svelte-dsebbp");
    			add_location(a, file$1, 163, 32, 6299);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    			append_dev(a, i);
    			append_dev(a, t);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(163:28) {#if project.live}",
    		ctx
    	});

    	return block;
    }

    // (169:28) {#if project.download}
    function create_if_block$1(ctx) {
    	let a;
    	let i;
    	let t;

    	const block = {
    		c: function create() {
    			a = element("a");
    			i = element("i");
    			t = text("\r\n                                    Download App");
    			attr_dev(i, "class", "fas fa-download svelte-dsebbp");
    			add_location(i, file$1, 170, 36, 6752);
    			attr_dev(a, "href", /*project*/ ctx[1].download);
    			attr_dev(a, "download", "");
    			attr_dev(a, "class", "project-link download svelte-dsebbp");
    			add_location(a, file$1, 169, 32, 6648);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    			append_dev(a, i);
    			append_dev(a, t);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(169:28) {#if project.download}",
    		ctx
    	});

    	return block;
    }

    // (141:12) {#each projects as project}
    function create_each_block(ctx) {
    	let div5;
    	let div1;
    	let img;
    	let img_src_value;
    	let t0;
    	let div0;
    	let t1_value = /*project*/ ctx[1].category + "";
    	let t1;
    	let t2;
    	let div4;
    	let h2;
    	let t3_value = /*project*/ ctx[1].title + "";
    	let t3;
    	let t4;
    	let p;
    	let t5_value = /*project*/ ctx[1].description + "";
    	let t5;
    	let t6;
    	let div2;
    	let t7;
    	let div3;
    	let a;
    	let i;
    	let t8;
    	let t9;
    	let t10;
    	let t11;
    	let each_value_1 = /*project*/ ctx[1].tech;
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	let if_block0 = /*project*/ ctx[1].live && create_if_block_1(ctx);
    	let if_block1 = /*project*/ ctx[1].download && create_if_block$1(ctx);

    	const block = {
    		c: function create() {
    			div5 = element("div");
    			div1 = element("div");
    			img = element("img");
    			t0 = space();
    			div0 = element("div");
    			t1 = text(t1_value);
    			t2 = space();
    			div4 = element("div");
    			h2 = element("h2");
    			t3 = text(t3_value);
    			t4 = space();
    			p = element("p");
    			t5 = text(t5_value);
    			t6 = space();
    			div2 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t7 = space();
    			div3 = element("div");
    			a = element("a");
    			i = element("i");
    			t8 = text("\r\n                                View Code");
    			t9 = space();
    			if (if_block0) if_block0.c();
    			t10 = space();
    			if (if_block1) if_block1.c();
    			t11 = space();
    			if (!src_url_equal(img.src, img_src_value = /*project*/ ctx[1].image)) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", /*project*/ ctx[1].title);
    			add_location(img, file$1, 143, 24, 5318);
    			attr_dev(div0, "class", "project-category");
    			add_location(div0, file$1, 144, 24, 5391);
    			attr_dev(div1, "class", "project-image");
    			add_location(div1, file$1, 142, 20, 5265);
    			add_location(h2, file$1, 148, 24, 5572);
    			add_location(p, file$1, 149, 24, 5622);
    			attr_dev(div2, "class", "tech-stack");
    			add_location(div2, file$1, 151, 24, 5702);
    			attr_dev(i, "class", "fab fa-github svelte-dsebbp");
    			add_location(i, file$1, 159, 32, 6111);
    			attr_dev(a, "href", /*project*/ ctx[1].github);
    			attr_dev(a, "target", "_blank");
    			attr_dev(a, "class", "project-link github svelte-dsebbp");
    			add_location(a, file$1, 158, 28, 6008);
    			attr_dev(div3, "class", "project-links svelte-dsebbp");
    			add_location(div3, file$1, 157, 24, 5951);
    			attr_dev(div4, "class", "project-content");
    			add_location(div4, file$1, 147, 20, 5517);
    			attr_dev(div5, "class", "project-card");
    			add_location(div5, file$1, 141, 16, 5217);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div5, anchor);
    			append_dev(div5, div1);
    			append_dev(div1, img);
    			append_dev(div1, t0);
    			append_dev(div1, div0);
    			append_dev(div0, t1);
    			append_dev(div5, t2);
    			append_dev(div5, div4);
    			append_dev(div4, h2);
    			append_dev(h2, t3);
    			append_dev(div4, t4);
    			append_dev(div4, p);
    			append_dev(p, t5);
    			append_dev(div4, t6);
    			append_dev(div4, div2);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(div2, null);
    				}
    			}

    			append_dev(div4, t7);
    			append_dev(div4, div3);
    			append_dev(div3, a);
    			append_dev(a, i);
    			append_dev(a, t8);
    			append_dev(div3, t9);
    			if (if_block0) if_block0.m(div3, null);
    			append_dev(div3, t10);
    			if (if_block1) if_block1.m(div3, null);
    			append_dev(div5, t11);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*projects*/ 1) {
    				each_value_1 = /*project*/ ctx[1].tech;
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div2, null);
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
    			if (detaching) detach_dev(div5);
    			destroy_each(each_blocks, detaching);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(141:12) {#each projects as project}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let section;
    	let div0;
    	let t0;
    	let div1;
    	let t1;
    	let div5;
    	let div2;
    	let span0;
    	let t3;
    	let h1;
    	let t5;
    	let p;
    	let t7;
    	let div3;
    	let t8;
    	let div4;
    	let a;
    	let span1;
    	let t10;
    	let i;
    	let each_value = /*projects*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			section = element("section");
    			div0 = element("div");
    			t0 = space();
    			div1 = element("div");
    			t1 = space();
    			div5 = element("div");
    			div2 = element("div");
    			span0 = element("span");
    			span0.textContent = "Projects";
    			t3 = space();
    			h1 = element("h1");
    			h1.textContent = "Featured Work";
    			t5 = space();
    			p = element("p");
    			p.textContent = "Explore some of my recent projects";
    			t7 = space();
    			div3 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t8 = space();
    			div4 = element("div");
    			a = element("a");
    			span1 = element("span");
    			span1.textContent = "View More on GitHub";
    			t10 = space();
    			i = element("i");
    			attr_dev(div0, "id", "particles-projects");
    			attr_dev(div0, "class", "particles-js svelte-dsebbp");
    			add_location(div0, file$1, 129, 4, 4759);
    			attr_dev(div1, "id", "projects-glow");
    			add_location(div1, file$1, 130, 4, 4821);
    			attr_dev(span0, "class", "section-tag");
    			add_location(span0, file$1, 134, 12, 4946);
    			add_location(h1, file$1, 135, 12, 5001);
    			attr_dev(p, "class", "section-subtitle");
    			add_location(p, file$1, 136, 12, 5037);
    			attr_dev(div2, "class", "projects-header");
    			add_location(div2, file$1, 133, 8, 4903);
    			attr_dev(div3, "class", "projects-grid");
    			add_location(div3, file$1, 139, 8, 5131);
    			add_location(span1, file$1, 182, 16, 7175);
    			attr_dev(i, "class", "fab fa-github");
    			add_location(i, file$1, 183, 16, 7225);
    			attr_dev(a, "href", "https://github.com/Takue-Mombe");
    			attr_dev(a, "target", "_blank");
    			attr_dev(a, "class", "github-link");
    			add_location(a, file$1, 181, 12, 7080);
    			attr_dev(div4, "class", "more-projects");
    			add_location(div4, file$1, 180, 8, 7039);
    			attr_dev(div5, "class", "projects-content svelte-dsebbp");
    			add_location(div5, file$1, 132, 4, 4863);
    			attr_dev(section, "class", "projects-section");
    			attr_dev(section, "id", "projects");
    			add_location(section, file$1, 128, 0, 4705);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			append_dev(section, div0);
    			append_dev(section, t0);
    			append_dev(section, div1);
    			append_dev(section, t1);
    			append_dev(section, div5);
    			append_dev(div5, div2);
    			append_dev(div2, span0);
    			append_dev(div2, t3);
    			append_dev(div2, h1);
    			append_dev(div2, t5);
    			append_dev(div2, p);
    			append_dev(div5, t7);
    			append_dev(div5, div3);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(div3, null);
    				}
    			}

    			append_dev(div5, t8);
    			append_dev(div5, div4);
    			append_dev(div4, a);
    			append_dev(a, span1);
    			append_dev(a, t10);
    			append_dev(a, i);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*projects*/ 1) {
    				each_value = /*projects*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div3, null);
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
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
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

    		// Particles configuration
    		particlesJS('particles-projects', {
    			particles: {
    				number: {
    					value: 80,
    					density: { enable: true, value_area: 800 }
    				},
    				color: { value: '#007bff' },
    				shape: { type: 'circle' },
    				opacity: {
    					value: 0.5,
    					random: false,
    					anim: { enable: false }
    				},
    				size: { value: 3, random: true },
    				line_linked: {
    					enable: true,
    					distance: 150,
    					color: '#007bff',
    					opacity: 0.4,
    					width: 1
    				},
    				move: {
    					enable: true,
    					speed: 2,
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
    					onhover: { enable: true, mode: 'grab' },
    					onclick: { enable: true, mode: 'push' },
    					resize: true
    				},
    				modes: {
    					grab: {
    						distance: 140,
    						line_linked: { opacity: 1 }
    					},
    					push: { particles_nb: 4 }
    				}
    			},
    			retina_detect: true
    		});
    	});

    	const projects = [
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
    		},
    		{
    			title: "Watchlist Tracker",
    			description: "Continuo is a watch list tracker that ensures you never lose track of your video progress across devices. Whether it's a TV series, YouTube, or local media, it offers seamless automation, synchronization, and an intuitive interface to enhance your viewing experience.",
    			image: "/images/projects/continuo.jpg",
    			tech: ["Python", "Django", "SQLite"],
    			github: "https://github.com/Takue-Mombe/Continuo",
    			category: "Backend"
    		},
    		{
    			title: "Portfolio Website",
    			description: "Modern portfolio website built with Svelte showcasing projects and skills.",
    			image: "/images/projects/logo.png",
    			tech: ["Svelte", "JavaScript", "CSS3", "Vite"],
    			github: "https://github.com/Takue-Mombe/portfolio",
    			live: "https://portfolio-mo5o.onrender.com/",
    			category: "Frontend"
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
    		init$1(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Project",
    			options,
    			id: create_fragment$2.name
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

    const { console: console_1 } = globals;
    const file = "src\\home\\contact.svelte";

    // (193:8) {#if submitStatus}
    function create_if_block(ctx) {
    	let div;
    	let t_value = /*submitStatus*/ ctx[2].message + "";
    	let t;
    	let div_class_value;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(t_value);
    			attr_dev(div, "class", div_class_value = "status-message " + /*submitStatus*/ ctx[2].type);
    			add_location(div, file, 193, 12, 6042);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*submitStatus*/ 4 && t_value !== (t_value = /*submitStatus*/ ctx[2].message + "")) set_data_dev(t, t_value);

    			if (dirty & /*submitStatus*/ 4 && div_class_value !== (div_class_value = "status-message " + /*submitStatus*/ ctx[2].type)) {
    				attr_dev(div, "class", div_class_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(193:8) {#if submitStatus}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let section;
    	let div0;
    	let t0;
    	let div5;
    	let h2;
    	let t2;
    	let p;
    	let t4;
    	let form;
    	let div1;
    	let input0;
    	let t5;
    	let div2;
    	let input1;
    	let t6;
    	let div3;
    	let input2;
    	let t7;
    	let div4;
    	let textarea;
    	let t8;
    	let button;
    	let t9_value = (/*isSubmitting*/ ctx[1] ? 'Sending...' : 'Send Message') + "";
    	let t9;
    	let t10;
    	let t11;
    	let div6;
    	let a0;
    	let i0;
    	let t12;
    	let span0;
    	let t14;
    	let a1;
    	let i1;
    	let t15;
    	let span1;
    	let t17;
    	let a2;
    	let i2;
    	let t18;
    	let span2;
    	let mounted;
    	let dispose;
    	let if_block = /*submitStatus*/ ctx[2] && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			section = element("section");
    			div0 = element("div");
    			t0 = space();
    			div5 = element("div");
    			h2 = element("h2");
    			h2.textContent = "Get in Touch";
    			t2 = space();
    			p = element("p");
    			p.textContent = "Have a question or want to work together? Drop me a message!";
    			t4 = space();
    			form = element("form");
    			div1 = element("div");
    			input0 = element("input");
    			t5 = space();
    			div2 = element("div");
    			input1 = element("input");
    			t6 = space();
    			div3 = element("div");
    			input2 = element("input");
    			t7 = space();
    			div4 = element("div");
    			textarea = element("textarea");
    			t8 = space();
    			button = element("button");
    			t9 = text(t9_value);
    			t10 = space();
    			if (if_block) if_block.c();
    			t11 = space();
    			div6 = element("div");
    			a0 = element("a");
    			i0 = element("i");
    			t12 = space();
    			span0 = element("span");
    			span0.textContent = "WhatsApp";
    			t14 = space();
    			a1 = element("a");
    			i1 = element("i");
    			t15 = space();
    			span1 = element("span");
    			span1.textContent = "Twitter";
    			t17 = space();
    			a2 = element("a");
    			i2 = element("i");
    			t18 = space();
    			span2 = element("span");
    			span2.textContent = "Email";
    			attr_dev(div0, "id", "particles-contact");
    			attr_dev(div0, "class", "particles-js");
    			add_location(div0, file, 141, 4, 4242);
    			add_location(h2, file, 143, 8, 4344);
    			attr_dev(p, "class", "contact-description");
    			add_location(p, file, 144, 8, 4375);
    			attr_dev(input0, "type", "text");
    			attr_dev(input0, "name", "name");
    			attr_dev(input0, "placeholder", "Your Name");
    			input0.required = true;
    			add_location(input0, file, 148, 16, 4613);
    			attr_dev(div1, "class", "form-group");
    			add_location(div1, file, 147, 12, 4571);
    			attr_dev(input1, "type", "email");
    			attr_dev(input1, "name", "email");
    			attr_dev(input1, "placeholder", "Your Email");
    			input1.required = true;
    			add_location(input1, file, 158, 16, 4921);
    			attr_dev(div2, "class", "form-group");
    			add_location(div2, file, 157, 12, 4879);
    			attr_dev(input2, "type", "text");
    			attr_dev(input2, "name", "subject");
    			attr_dev(input2, "placeholder", "Subject");
    			input2.required = true;
    			add_location(input2, file, 168, 16, 5233);
    			attr_dev(div3, "class", "form-group");
    			add_location(div3, file, 167, 12, 5191);
    			attr_dev(textarea, "name", "message");
    			attr_dev(textarea, "placeholder", "Your Message");
    			attr_dev(textarea, "rows", "5");
    			textarea.required = true;
    			add_location(textarea, file, 178, 16, 5545);
    			attr_dev(div4, "class", "form-group");
    			add_location(div4, file, 177, 12, 5503);
    			attr_dev(button, "type", "submit");
    			attr_dev(button, "class", "submit-btn");
    			button.disabled = /*isSubmitting*/ ctx[1];
    			add_location(button, file, 187, 12, 5829);
    			attr_dev(form, "class", "contact-form");
    			add_location(form, file, 146, 8, 4490);
    			attr_dev(div5, "class", "contact-container");
    			add_location(div5, file, 142, 4, 4303);
    			attr_dev(i0, "class", "fab fa-whatsapp");
    			add_location(i0, file, 202, 12, 6385);
    			attr_dev(span0, "class", "tooltip");
    			add_location(span0, file, 203, 12, 6430);
    			attr_dev(a0, "href", "https://wa.me/788754745");
    			attr_dev(a0, "target", "_blank");
    			attr_dev(a0, "rel", "noopener noreferrer");
    			attr_dev(a0, "class", "social-btn whatsapp");
    			add_location(a0, file, 201, 8, 6267);
    			attr_dev(i1, "class", "fab fa-twitter");
    			add_location(i1, file, 206, 12, 6608);
    			attr_dev(span1, "class", "tooltip");
    			add_location(span1, file, 207, 12, 6652);
    			attr_dev(a1, "href", "https://x.com/JoseMombe");
    			attr_dev(a1, "target", "_blank");
    			attr_dev(a1, "rel", "noopener noreferrer");
    			attr_dev(a1, "class", "social-btn twitter");
    			add_location(a1, file, 205, 8, 6491);
    			attr_dev(i2, "class", "fas fa-envelope");
    			add_location(i2, file, 210, 12, 6788);
    			attr_dev(span2, "class", "tooltip");
    			add_location(span2, file, 211, 12, 6833);
    			attr_dev(a2, "href", "mailto:mombejose@gmail.com");
    			attr_dev(a2, "class", "social-btn email");
    			add_location(a2, file, 209, 8, 6712);
    			attr_dev(div6, "class", "floating-socials");
    			add_location(div6, file, 200, 4, 6227);
    			attr_dev(section, "class", "contact-section");
    			attr_dev(section, "id", "contact");
    			add_location(section, file, 140, 0, 4190);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			append_dev(section, div0);
    			append_dev(section, t0);
    			append_dev(section, div5);
    			append_dev(div5, h2);
    			append_dev(div5, t2);
    			append_dev(div5, p);
    			append_dev(div5, t4);
    			append_dev(div5, form);
    			append_dev(form, div1);
    			append_dev(div1, input0);
    			set_input_value(input0, /*formData*/ ctx[0].name);
    			append_dev(form, t5);
    			append_dev(form, div2);
    			append_dev(div2, input1);
    			set_input_value(input1, /*formData*/ ctx[0].email);
    			append_dev(form, t6);
    			append_dev(form, div3);
    			append_dev(div3, input2);
    			set_input_value(input2, /*formData*/ ctx[0].subject);
    			append_dev(form, t7);
    			append_dev(form, div4);
    			append_dev(div4, textarea);
    			set_input_value(textarea, /*formData*/ ctx[0].message);
    			append_dev(form, t8);
    			append_dev(form, button);
    			append_dev(button, t9);
    			append_dev(div5, t10);
    			if (if_block) if_block.m(div5, null);
    			append_dev(section, t11);
    			append_dev(section, div6);
    			append_dev(div6, a0);
    			append_dev(a0, i0);
    			append_dev(a0, t12);
    			append_dev(a0, span0);
    			append_dev(div6, t14);
    			append_dev(div6, a1);
    			append_dev(a1, i1);
    			append_dev(a1, t15);
    			append_dev(a1, span1);
    			append_dev(div6, t17);
    			append_dev(div6, a2);
    			append_dev(a2, i2);
    			append_dev(a2, t18);
    			append_dev(a2, span2);

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

    			if (dirty & /*isSubmitting*/ 2 && t9_value !== (t9_value = (/*isSubmitting*/ ctx[1] ? 'Sending...' : 'Send Message') + "")) set_data_dev(t9, t9_value);

    			if (dirty & /*isSubmitting*/ 2) {
    				prop_dev(button, "disabled", /*isSubmitting*/ ctx[1]);
    			}

    			if (/*submitStatus*/ ctx[2]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block(ctx);
    					if_block.c();
    					if_block.m(div5, null);
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
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
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
    	emailjs.init("B31rxbPMCio3oeS6_"); // Your public key

    	onMount(() => {
    		particlesJS('particles-contact', {
    			particles: {
    				number: {
    					value: 60,
    					density: { enable: true, value_area: 800 }
    				},
    				color: { value: '#007bff' },
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
    					color: '#007bff',
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

    		// Verify EmailJS initialization
    		console.log('EmailJS initialized'); // Debug log
    	});

    	async function handleSubmit() {
    		$$invalidate(1, isSubmitting = true);
    		$$invalidate(2, submitStatus = null);

    		try {
    			console.log('Attempting to send email...'); // Debug log

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

    			console.log('Email sent successfully:', response);

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
    			console.error('Detailed email error:', error);

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
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<Contact> was created with unknown prop '${key}'`);
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
    		init$1(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Contact",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src\App.svelte generated by Svelte v3.59.2 */

    function create_fragment(ctx) {
    	let topnav;
    	let t0;
    	let hero;
    	let t1;
    	let blogs;
    	let t2;
    	let about;
    	let t3;
    	let project;
    	let t4;
    	let contact;
    	let current;
    	topnav = new Topnav({ $$inline: true });
    	hero = new Hero({ $$inline: true });
    	blogs = new Blogs({ $$inline: true });
    	about = new About({ $$inline: true });
    	project = new Project({ $$inline: true });
    	contact = new Contact({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(topnav.$$.fragment);
    			t0 = space();
    			create_component(hero.$$.fragment);
    			t1 = space();
    			create_component(blogs.$$.fragment);
    			t2 = space();
    			create_component(about.$$.fragment);
    			t3 = space();
    			create_component(project.$$.fragment);
    			t4 = space();
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
    			mount_component(blogs, target, anchor);
    			insert_dev(target, t2, anchor);
    			mount_component(about, target, anchor);
    			insert_dev(target, t3, anchor);
    			mount_component(project, target, anchor);
    			insert_dev(target, t4, anchor);
    			mount_component(contact, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(topnav.$$.fragment, local);
    			transition_in(hero.$$.fragment, local);
    			transition_in(blogs.$$.fragment, local);
    			transition_in(about.$$.fragment, local);
    			transition_in(project.$$.fragment, local);
    			transition_in(contact.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(topnav.$$.fragment, local);
    			transition_out(hero.$$.fragment, local);
    			transition_out(blogs.$$.fragment, local);
    			transition_out(about.$$.fragment, local);
    			transition_out(project.$$.fragment, local);
    			transition_out(contact.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(topnav, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(hero, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(blogs, detaching);
    			if (detaching) detach_dev(t2);
    			destroy_component(about, detaching);
    			if (detaching) detach_dev(t3);
    			destroy_component(project, detaching);
    			if (detaching) detach_dev(t4);
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
    		Blogs,
    		Project,
    		Contact
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

    /**
     * Adapted from https://github.com/reach/router/blob/b60e6dd781d5d3a4bdaaf4de665649c0f6a7e78d/src/lib/utils.js
     * https://github.com/reach/router/blob/master/LICENSE
     */


    const canUseDOM = () =>
        typeof window !== "undefined" &&
        "document" in window &&
        "location" in window;

    /**
     * Adapted from https://github.com/reach/router/blob/b60e6dd781d5d3a4bdaaf4de665649c0f6a7e78d/src/lib/history.js
     * https://github.com/reach/router/blob/master/LICENSE
     */

    const getLocation = (source) => {
        return {
            ...source.location,
            state: source.history.state,
            key: (source.history.state && source.history.state.key) || "initial",
        };
    };
    const createHistory = (source) => {
        const listeners = [];
        let location = getLocation(source);

        return {
            get location() {
                return location;
            },

            listen(listener) {
                listeners.push(listener);

                const popstateListener = () => {
                    location = getLocation(source);
                    listener({ location, action: "POP" });
                };

                source.addEventListener("popstate", popstateListener);

                return () => {
                    source.removeEventListener("popstate", popstateListener);
                    const index = listeners.indexOf(listener);
                    listeners.splice(index, 1);
                };
            },

            navigate(to, { state, replace = false, preserveScroll = false, blurActiveElement = true } = {}) {
                state = { ...state, key: Date.now() + "" };
                // try...catch iOS Safari limits to 100 pushState calls
                try {
                    if (replace) source.history.replaceState(state, "", to);
                    else source.history.pushState(state, "", to);
                } catch (e) {
                    source.location[replace ? "replace" : "assign"](to);
                }
                location = getLocation(source);
                listeners.forEach((listener) =>
                    listener({ location, action: "PUSH", preserveScroll })
                );
                if(blurActiveElement) document.activeElement.blur();
            },
        };
    };
    // Stores history entries in memory for testing or other platforms like Native
    const createMemorySource = (initialPathname = "/") => {
        let index = 0;
        const stack = [{ pathname: initialPathname, search: "" }];
        const states = [];

        return {
            get location() {
                return stack[index];
            },
            addEventListener(name, fn) {},
            removeEventListener(name, fn) {},
            history: {
                get entries() {
                    return stack;
                },
                get index() {
                    return index;
                },
                get state() {
                    return states[index];
                },
                pushState(state, _, uri) {
                    const [pathname, search = ""] = uri.split("?");
                    index++;
                    stack.push({ pathname, search });
                    states.push(state);
                },
                replaceState(state, _, uri) {
                    const [pathname, search = ""] = uri.split("?");
                    stack[index] = { pathname, search };
                    states[index] = state;
                },
            },
        };
    };
    // Global history uses window.history as the source if available,
    // otherwise a memory history
    createHistory(
        canUseDOM() ? window : createMemorySource()
    );

    const app = new App({
    	target: document.body,
    	props: {
    		url: window.location.pathname
    	}
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
