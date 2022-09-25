
const store = {};

export const options = {
    enableLog: true,
}

function getState(name) {
    if (!store.hasOwnProperty(name)) {
        store[name] = {
            val: null,
            subs: new WeakSet(),
        }
    }

    return store[name];
}

function hasState(name) {
   return store.hasOwnProperty(name);
}

function get(name) {
    return getState(name).value;
}

function set(name, setter) {
    const state = getState(name);

    if (typeof setter !== 'function') {
        setter = (_) => setter;
    }

    const oldValue = state.val;
    const newValue = setter(state.val);

    state.val = newValue;
    state.subs.forEach((sub) => sub(newValue, oldValue));

    if (options.enableLog) {
        console.log(`SET ${name}`, newValue, oldValue);
    }

    return newValue;
}

function sub(name, onChange) {
    getState(name).subs.add(onChange);
}

function unsub(name, sub) {
    if (!hasState(name)) {
        return;
    }

    getState(name).subs.delete(sub);
}

export function scope(ns, store) {
    const scopeName = (name) => `${ns}.${name}`;
    return {
        ...store,
        get: (name) => store.get(scopeName(name)),
        set: (name, ...args) => store.set(scopeName(name), ...args),
        sub: (name, ...args) => store.sub(scopeName(name), ...args),
        unsub: (name, ...args) => store.unsub(scopeName(name), ...args),
    }
}

export default {
    get,
    set,
    sub,
    unsub
}
