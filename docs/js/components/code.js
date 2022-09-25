class Code extends HTMLElement {
    static get observedAttributes() {
        return ['language'];
    }

    get language() {
        return this.getAttribute('language');
    }

    set language(value) {
        if (value)
            this.setAttribute('language', value);
        else
            this.removeAttribute('language');
    }

    attributeChangedCallback(attrName, oldVal, newVal) {
        if (newVal === oldVal) return;

        switch (attrName) {
            case 'language':
                this.#highlight();
                break;
        }
    }

    constructor() {
        super();
    }

    connectedCallback() {
        this.innerHTML = `<pre><code>${this.innerHTML}</code></pre>`;

        this.#highlight();

        this.#upgradeProperty('language');
    }

    #highlight() {
        const code = this.querySelector('code');
        if (!code) return;

        [...code.classList.values()].forEach(className => {
            if (className.match(/language-/)) {
                code.classList.remove(className);
            }
        });

        if (this.language) {
            code.classList.add(`language-${this.language}`);
        }

        window.hljs.highlightElement(code);
    }

    #upgradeProperty(prop) {
        if (this.hasOwnProperty(prop)) {
            let value = this[prop];
            delete this[prop];
            this[prop] = value;
        }

    }
}

window.customElements.define('x-code', Code);